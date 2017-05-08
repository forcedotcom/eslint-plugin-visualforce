/**
 * @fileoverview Rule to disallow VFEL merge fields as atomic expressions
 * @author Marat Vyshegorodtsev
 * @license BSD-3-Clause
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/BSD-3-Clause
 */

// TODO implement merge fields inside JSX Elements (see: https://github.com/eslint/espree/issues/334)

module.exports = {
  meta: {
    docs: {
      description: 'disallow <apex:*> tags inside <script> tags',
      category: 'Possible Errors',
      recommended: false, // before TODO is done
    },
    //fixable: 'code',
    schema: [], // no options
  },
  create (context) {
    return {
      JSXElement: node => context.report({
        message: 'VisualForce standard components (<apex:*> tags) are not allowed in Javascript',
        node,
        // fix(fixer) {
        //   //return fixer.replaceText(node, `JSON.parse('${node.raw}')`)
        // }
      })
    }
  },
}
