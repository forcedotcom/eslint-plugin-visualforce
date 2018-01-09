/**
 * @fileoverview Rule to disallow VFEL merge fields as atomic expressions
 * @author Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

module.exports = {
  meta: {
    docs: {
      description: 'Disallow VFEL merge fields as atomic expressions',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/forcedotcom/eslint-plugin-visualforce/blob/master/docs/rules/no-atom-expr.md'
    },
    fixable: 'code',
    schema: [], // no options
  },
  create (context) {
    return {
      VFELExpression: node => {
        if(node.parent && node.parent.type !== 'MetaString')
          context.report({
            message: 'VisualForce merge fields should only be allowed in strings',
            node,
            fix(fixer) {
              const vfelText = context.getSourceCode().getText(node)
              return fixer.replaceText(node, `JSON.parse('${vfelText}')`)
            }
          })
      }
    }
  },
}
