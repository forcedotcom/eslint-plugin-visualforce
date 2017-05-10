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
      description: 'disallow <apex:*> tags inside <script> tags',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [], // no options
  },
  create (context) {
    return {
      JSXElement: node => context.report({
        message: 'VisualForce standard components (<apex:*> tags) are not allowed in Javascript',
        node,
      })
    }
  },
}
