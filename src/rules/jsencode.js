/**
 * @fileoverview Rule to make sure all Apex variables are JSENCODEd in strings
 * @author Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

const safeFunctions = [
  // Date & Time
  'DATE', 'DATEVALUE', 'DATETIMEVALUE', 'DAY', 'MONTH', 'YEAR',
  // Logical
  'AND', 'ISBLANK', 'ISNULL', 'ISNUMBER', 'NOT', 'OR',
  // Math
  'ABS', 'CEILING', 'EXP', 'FLOOR', 'LN', 'LOG', 'MAX', 'MIN', 'MOD', 'ROUND', 'SQRT',
  // Text
  'CASESAFEID', 'CONTAINS', 'FIND', 'ISPICKVAL', 'JSENCODE', 'JSINHTMLENCODE', 'LEN', 'VALUE',
  // Advanced
  'ISCHANGED', 'REGEX' // TODO check LINKTO, REQUIRESCRIPT, and URLFOR
]

const safeBitwiseOperators = [ '>', '>=', '<', '<=', '==', '=', '!=', '<>', '*', '/', '^', '-' ]

const untaintingParents = {
  VFELCallExpression(parentNode, node) {

    // Identifier is just a function name
    if(parentNode.callee === node)
      return true

    const funcName = parentNode.callee.name.toUpperCase()

    // checking against safe functions
    if (safeFunctions.indexOf(funcName)>=0 && parentNode.arguments.indexOf(node)>=0)
      return true

    // Special cases
    // IF's first argument is condition, does not produce output, second and third are unsafe
    if (funcName === 'IF' && parentNode.arguments[0] === node)
      return true

    // CASE's first argument is expression to compare and all odd arguments are values to compare to => safe
    if (funcName === 'CASE') {
      const index = parentNode.arguments.indexOf(node)
      return !index || index%2
    }

    return false
  },
  VFELLogicalExpression() {
    return true
  },
  VFELBinaryExpression(parentNode) {
    return safeBitwiseOperators.indexOf(parentNode.operator)>=0
  },
  UnaryExpression() {
    // Only NOT and !, both boolean
    return true
  },
  MapEntry(parentNode, node) {
    // keys are safe, values are not
    return parentNode.key === node
  },
  VFELMemberExpression() {
    // VFELMemberExpressions such as field[selector] are not untainting
    // However, JSENCODE should be applied to the expression itself,
    // and not the selectors, so we untaint the members of this expression
    return true
  },
}

function isSafeSystemIdentifier(identifier) {
  const systemVariable = identifier.match(/^(\$[^.]+)\./)
  if(!systemVariable) return false

  switch (systemVariable[1]) {
  case '$ACTION':
  case '$API':
  case '$ASSET':
  case '$COMPONENT':
  case '$PAGE':
  case '$PERMISSION':
  case '$RESOURCE':
  case '$SCONTROL':
  case '$SITE':
  case '$SYSTEM':
    return true
  default:
    return false
  }
}

function isTainting (node) {
  const parent = node.parent

  // The end of recursion
  if (parent.type === 'VFELExpression'){
    return true
  }

  const untainter = parent && untaintingParents[parent.type]

  // The parent expression untaints the whole subtree
  if (untainter && untainter(parent, node))
    return false
  else
    return isTainting(parent)
}

function checkNode(node, context) {
  //console.log(`identifier's `, node.name ,` parent is ${node.parent.type}`)

  // Not checking taint for system variables except the only user-controlled one
  if (node.name && isSafeSystemIdentifier(node.name.toUpperCase()))
    return

  if (isTainting(node))
    context.report({
      message: 'JSENCODE() must be applied to all rendered Apex variables',
      node,
      fix(fixer) {
        const vfelText = context.getSourceCode().getText(node)
        return fixer.replaceText(node, `JSENCODE(${vfelText})`)
      }
    })
}


module.exports = {
  meta: {
    docs: {
      description: 'Require all unsafe Apex variables to be JSENCODEd',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/forcedotcom/eslint-plugin-visualforce/blob/master/docs/rules/jsencode.md'
    },
    fixable: 'code',
    schema: [], // no options
  },
  create (context) {
    return {
      VFELIdentifier: node => checkNode(node, context),
      VFELMemberExpression: node => checkNode(node, context),
    }
  },
}
