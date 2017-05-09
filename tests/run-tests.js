const path = require('path')
const test = require('tape')
const CLIEngine = require('eslint').CLIEngine
const plugin = require('../dist/index.js')

function execute(file, baseConfig) {
  if (!baseConfig) baseConfig = {}

  const cli = new CLIEngine({
    extensions: ['page', 'component'],
    baseConfig: {
      settings: baseConfig.settings,
      rules: Object.assign({}, baseConfig.rules),
    },
    ignore: false,
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    },
    useEslintrc: false,
    fix: baseConfig.fix,
  })

  cli.addPlugin("visualforce", plugin)
  const results = cli.executeOnFiles([ path.join(__dirname, 'fixtures', file) ]).results[0]
  return baseConfig.fix ? results : results && results.messages
}

test('Merge field in JS expression context', assert => {
  assert.plan(2)

  const messages = execute('simple.page', {
    rules: {
      'visualforce/vf-no-atom-expr': 'error'
    }
  })

  assert.equal(messages.length, 1)
  assert.deepEqual(messages[0], { ruleId: 'visualforce/vf-no-atom-expr',
    severity: 2,
    message: 'VisualForce merge fields should only be allowed in strings',
    line: 5,
    column: 19,
    nodeType: 'VFELExpression',
    source: 'var fooz =  {! apexVariable }',
    fix: { range: [ 115, 132 ], text: 'JSON.parse(\'{! apexVariable }\')' }
  })

})

test('Autofixing merge fields in JS expression context', assert => {
  assert.plan(1)

  const result = execute('fix.page', {
    rules: {
      'visualforce/vf-no-atom-expr': 'error'
    },
    fix: true
  })

  assert.equals(result.output, `<apex:page>
<script>
if(JSON.parse('{! apexVariable }')) alert(1)
</script>
</apex:page>
`)

})

test('<apex:*> tags in Javascript', assert => {
  assert.plan(1)

  const messages = execute('apex-tags-in-script.page', {
    rules: {
      'visualforce/vf-no-apex-tags': 'error'
    }
  })

  console.log(messages)

  assert.deepEqual(messages[0], { ruleId: 'visualforce/vf-no-apex-tags',
    severity: 2,
    message: 'VisualForce standard components (<apex:*> tags) are not allowed in Javascript',
    line: 6,
    column: 7,
    nodeType: 'JSXElement',
    source: '<apex:repeat value="{! someArray }" var="entry">'
  })

})
