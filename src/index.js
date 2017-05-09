/**
 * @author Marat Vyshegorodtsev
 * @license BSD-3-Clause
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/BSD-3-Clause
 */

const acornVFEL = require('@salesforce/acorn-visualforce/dist/inject')
const proxyquire = require('proxyquire');
const path = require('path')
const extract = require('./extract')

// If you pack the plugin using webpack, the node require function is not available directly
/* global __non_webpack_require__ */
const requireCache = typeof(__non_webpack_require__)!=='undefined' ? __non_webpack_require__.cache : require.cache

const defaultVisualForceExtensions = [ '.page', '.component' ]

function getPluginSettings (settings) {

  let reportBadIndent
  switch (settings['visualforce/report-bad-indent']) {
  case undefined: case false: case 0: case 'off':
    reportBadIndent = 0
    break
  case true: case 1: case 'warn':
    reportBadIndent = 1
    break
  case 2: case 'error':
    reportBadIndent = 2
    break
  default:
    throw new Error('Invalid value for visualforce/report-bad-indent, '
        + 'expected one of 0, 1, 2, "off", "warn" or "error"')
  }

  const parsedIndent = /^(\+)?(tab|\d+)$/.exec(settings['visualforce/indent'])
  const indent = parsedIndent && {
    relative: parsedIndent[1] === '+',
    spaces: parsedIndent[2] === 'tab' ? '\t' : ' '.repeat(parsedIndent[2]),
  }


  return {
    visualForceExtensions: defaultVisualForceExtensions,
    indent,
    reportBadIndent,
  }
}

// Monkey patching ESLint and espree
function patchESLint() {

  const eslintPath = Object.keys(requireCache).find(key => key.endsWith(path.join('lib', 'eslint.js')))

  const {exports: eslint} = requireCache[eslintPath]
  const {exports: SourceCode} = requireCache[path.join(eslintPath, '..', 'util', 'source-code.js')]
  const {exports: SourceCodeFixer} = requireCache[path.join(eslintPath, '..', 'util', 'source-code-fixer.js')]

  if (typeof eslint.verify !== 'function' || !SourceCode || !SourceCodeFixer)
    throw new Error('eslint-plugin-visualforce error: Could not locate eslint in the require() cache. '
                    + 'If you think it is a bug, please file a report at '
                    + 'https://github.com/forcedotcom/eslint-plugin-visualforce/issues')

  const sourceCodeForMessages = new WeakMap()

  const verify = eslint.verify
  eslint.verify = function (textOrSourceCode, config, filenameOrOptions, saveState) {
    const localVerify = code => verify.call(this, code, config, filenameOrOptions, saveState)

    let messages
    const filename = typeof filenameOrOptions === 'object'
      ? filenameOrOptions.filename
      : filenameOrOptions
    const extension = path.extname(filename || '')

    const pluginSettings = getPluginSettings(config.settings || {})
    const isVisualForce = pluginSettings.visualForceExtensions.indexOf(extension) >= 0

    if (typeof textOrSourceCode === 'string' && isVisualForce) {
      const currentInfos = extract(
        textOrSourceCode,
        pluginSettings.indent,
        false // isXML
      )
      // parsing the source code with the patched espree
      let espreePath = Object.keys(requireCache).find(key => key.endsWith(path.join('espree', 'espree.js')))
      espreePath = espreePath ? espreePath : 'espree'
      let acornJSXPath = Object.keys(requireCache).find(key => key.endsWith(path.join('acorn-jsx', 'inject.js')))
      acornJSXPath = acornJSXPath ? acornJSXPath : 'acorn-jsx/inject'

      const acornJSX = typeof(__non_webpack_require__)!=='undefined' ? __non_webpack_require__.call(null, acornJSXPath) : require(acornJSXPath)

      const espree = proxyquire(espreePath, {
        'acorn-jsx/inject': acorn => acornVFEL(acornJSX(acorn), true)
      })

      const parserOptions = Object.assign({}, config.parserOptions, {
        loc: true,
        range: true,
        raw: true,
        tokens: true,
        comment: true,
        filePath: filename,
      })
      const ast = espree.parse(String(currentInfos.code), parserOptions)
      //console.log('ast: ', JSON.stringify(ast, 4, 4))
      const sourceCode = new SourceCode(String(currentInfos.code), ast)

      messages = remapMessages(
        localVerify(sourceCode),
        currentInfos.code,
        pluginSettings.reportBadIndent,
        currentInfos.badIndentationLines
      )
      sourceCodeForMessages.set(messages, textOrSourceCode)
    } else
      messages = localVerify(textOrSourceCode)


    return messages
  }

  const applyFixes = SourceCodeFixer.applyFixes
  SourceCodeFixer.applyFixes = function (sourceCode, messages) {
    const originalSourceCode = sourceCodeForMessages.get(messages)
    // The BOM is always included in the HTML, which is removed by the extract process
    return applyFixes.call(
      this,
      originalSourceCode === undefined ? sourceCode : {
        text: originalSourceCode,
        hasBOM: false,
      },
      messages
    )
  }

}

function remapMessages (messages, code, reportBadIndent, badIndentationLines) {
  const newMessages = []

  messages.forEach(message => {
    const location = code.originalLocation(message)

    // Ignore messages if they were in transformed code
    if (location) {
      Object.assign(message, location)

      // Map fix range
      if (message.fix && message.fix.range)
        message.fix.range = [
          code.originalIndex(message.fix.range[0]),
          code.originalIndex(message.fix.range[1]),
        ]


      // Map end location
      if (message.endLine && message.endColumn) {
        const endLocation = code.originalLocation({
          line: message.endLine,
          column: message.endColumn,
        })
        if (endLocation) {
          message.endLine = endLocation.line
          message.endColumn = endLocation.column
        }
      }

      newMessages.push(message)
    }
  })

  if (reportBadIndent)
    badIndentationLines.forEach(line => {
      newMessages.push({
        message: 'Bad line indentation',
        line,
        column: 1,
        ruleId: '(visualforce plugin)',
        severity: reportBadIndent === true ? 2 : reportBadIndent,
      })
    })


  newMessages.sort((ma, mb) => {
    return ma.line - mb.line || ma.column - mb.column
  })

  return newMessages
}


patchESLint()

module.exports = {
  rules: {
    'vf-no-atom-expr': require('./rules/vf-no-atom-expr'),
    'vf-no-apex-tags': require('./rules/vf-no-apex-tags'),
  }
}
