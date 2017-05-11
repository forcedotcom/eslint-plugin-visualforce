/**
 * @fileoverview Rule to make sure all Apex variables are JSENCODEd in strings
 * @author Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

// TODO WIP

const untaintingParents = {
  VFELCallExpression(node) {
    const safeFunctions = ['LEN']
    return safeFunctions.includes(node.callee.name)
  }
}


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
      VFELIdentifier: node => {
        const untaintingParent = untaintingParents[node.parent.type]
        if(untaintingParent && untaintingParent(node.parent))
          return null
        return context.report({
          message: 'JSENCODE() must be applied to all rendered Apex variables',
          node,
          fix(fixer) {
            return null
          }
        }) }
    }
  },
}
