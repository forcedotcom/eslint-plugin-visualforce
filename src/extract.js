/**
 * @author Benoît Zugmeyer, Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

const htmlparser2 = require('htmlparser2')
const TransformableString = require('./TransformableString')

function iterateScripts (code, onChunk) {
  if (!code) return

  let index = 0
  let inScript = false
  let nextType = null
  let nextEnd = null

  function emitChunk (type, end, lastChunk) {
    // Ignore empty chunkss
    if (index !== end) {
      // Keep concatenating same type chunks
      if (nextType !== null && nextType !== type) {
        onChunk({
          type: nextType,
          start: index,
          end: nextEnd,
        })
        index = nextEnd
      }

      nextType = type
      nextEnd = end

      if (lastChunk)
        onChunk({
          type: nextType,
          start: index,
          end: nextEnd,
        })

    }

  }

  const parser = new htmlparser2.Parser({

    // TODO on* attributes
    // https://www.w3schools.com/jsref/dom_obj_event.asp
    // apex tags with escape="false": apex:outputtext, apex:pagemessage, apex:pagemessages, apex:selectoption
    // itemescaped="false"
    // https://github.com/pmd/pmd/blob/master/pmd-visualforce/src/main/java/net/sourceforge/pmd/lang/vf/rule/security/VfUnescapeElRule.java
    //
    // URLENCODE for <a, <apex:iframe, <iframe

    onopentag (name) {
      // Test if current tag is a valid <script> tag.
      if (name === 'apex:repeat' && inScript) {
        emitChunk('script', parser.startIndex)
        emitChunk('apex:repeat', parser.endIndex + 1)
        //console.log('open tag: ', code.slice(parser.startIndex, parser.endIndex+1));
      }
      if (name !== 'script')
        return
      inScript = true
      emitChunk('html', parser.endIndex + 1)
    },

    oncdatastart () {
      if (inScript) {
        emitChunk('cdata start', parser.startIndex + 9)
        emitChunk('script', parser.endIndex - 2)
        emitChunk('cdata end', parser.endIndex + 1)
      }
    },

    onclosetag (name) {
      if (name === 'apex:repeat' && inScript) {
        emitChunk('script', parser.startIndex)
        emitChunk('apex:repeat', parser.endIndex + 1)
        // console.log('close tag: ', code.slice(parser.startIndex, parser.endIndex+1));
      }

      if (name !== 'script' || !inScript)
        return


      inScript = false

      const endSpaces = code.slice(index, parser.startIndex).match(/[ \t]*$/)[0].length
      emitChunk('script', parser.startIndex - endSpaces)
    },

    ontext () {
      if (!inScript)
        return


      emitChunk('script', parser.endIndex + 1)
    },

  }, { xmlMode: true })

  parser.parseComplete(code)

  emitChunk('html', parser.endIndex + 1, true)
}

function computeIndent (descriptor, previousHTML, codeSlice) {
  if (!descriptor) {
    const indentMatch = /[\n\r]+([ \t]*)/.exec(codeSlice)
    return indentMatch ? indentMatch[1] : ''
  }

  if (descriptor.relative)
    return previousHTML.match(/([^\n\r]*)<[^<]*$/)[1] + descriptor.spaces


  return descriptor.spaces
}

function* dedent (indent, codeSlice) {
  let hadNonEmptyLine = false
  const re = /(\r\n|\n|\r)([ \t]*)(.*)/g

  for(;;) {
    const match = re.exec(codeSlice)
    if (!match) break

    const newLine = match[1]
    const lineIndent = match[2]
    const lineText = match[3]

    const isEmptyLine = !lineText
    const isFirstNonEmptyLine = !isEmptyLine && !hadNonEmptyLine

    const badIndentation
      // Be stricter on the first line
      = isFirstNonEmptyLine
        ? indent !== lineIndent
        : lineIndent.indexOf(indent) !== 0

    if (!badIndentation)
      yield {
        type: 'dedent',
        from: match.index + newLine.length,
        to: match.index + newLine.length + indent.length,
      }

    else if (isEmptyLine)
      yield { type: 'empty' }

    else
      yield { type: 'bad-indent' }


    if (!isEmptyLine)
      hadNonEmptyLine = true

  }
}

function extract (code, indentDescriptor) {
  const badIndentationLines = []
  const apexRepeatTags = []
  const transformedCode = new TransformableString(code)
  let lineNumber = 1
  let previousHTML = ''

  iterateScripts(code, chunk => {
    const codeSlice = code.slice(chunk.start, chunk.end)

    switch(chunk.type) {
    case 'html':
      previousHTML = codeSlice
      // falls through
    case 'apex:repeat':
    case 'cdata start':
    case 'cdata end': {
      const newLinesRe = /(?:\r\n|\n|\r)([^\r\n])?/g
      let lastEmptyLinesLength = 0
      for(;;) {
        const match = newLinesRe.exec(codeSlice)
        if (!match) break
        lineNumber += 1
        lastEmptyLinesLength = !match[1] ? lastEmptyLinesLength + match[0].length : 0
      }
      transformedCode.replace(chunk.start, chunk.end - lastEmptyLinesLength, '/* HTML */')
      break
    }
    // case 'apex:repeat':
    //   transformedCode.replace(chunk.start, chunk.end, `/* ${codeSlice} */`)
    //   // TODO add message
    //   break
    case 'script':
      for (const action of dedent(computeIndent(indentDescriptor, previousHTML, codeSlice), codeSlice)) {
        lineNumber += 1
        if (action.type === 'dedent')
          transformedCode.replace(chunk.start + action.from, chunk.start + action.to, '')
        else if (action.type === 'bad-indent')
          badIndentationLines.push(lineNumber)
      }
      break;
    }

  }) // iterateScripts

  return {
    code: transformedCode,
    badIndentationLines,
    apexRepeatTags,
  }
}

module.exports = extract
