/**
 * @fileoverview Rule to disallow VFEL merge fields as atomic expressions
 * @author Marat Vyshegorodtsev
 * @license BSD-3-Clause
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
  meta: {
    docs: {
      description: 'disallow VFEL merge fields as atomic expressions',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [], // no options
  },
  create (context) {
    return {
      VFELExpression: node => context.report({
        message: 'VisualForce merge fields should only be allowed in strings',
        node,
        fix(fixer) {
          const vfelText = context.getSourceCode().getText(node)
          return fixer.replaceText(node, `JSON.parse('${vfelText}')`)
        }
      })
    }
  },
}
