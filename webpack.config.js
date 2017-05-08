/**
 * @author Marat Vyshegorodtsev
 * @license BSD-3-Clause
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/BSD-3-Clause
 */

const path = require('path')
const config = require('./package.json')

const externals = Object.keys(config.dependencies).reduce((result, dep) => Object.assign(result, { [dep]: `commonjs2 ${ dep }` }), {})
externals.acorn = 'commonjs2 acorn'
externals['@salesforce/acorn-visualforce/dist/inject'] = 'commonjs2 @salesforce/acorn-visualforce/dist/inject'

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: ['regenerator-runtime/runtime','./index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
}
