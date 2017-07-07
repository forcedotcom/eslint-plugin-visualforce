# eslint-plugin-visualforce

[![Build Status](https://travis-ci.org/forcedotcom/eslint-plugin-visualforce.svg?branch=master)](https://travis-ci.org/forcedotcom/eslint-plugin-visualforce)
[![NPM version](https://img.shields.io/npm/v/@salesforce/eslint-plugin-visualforce.svg)](https://www.npmjs.com/package/@salesforce/eslint-plugin-visualforce)

This [`ESLint`](https://eslint.org) plugin extracts and lints scripts from VisualForce pages.

It supports VisualForce Expression Language merge fields within the JS syntax.
This plugin is a heavily modified fork of [`eslint-plugin-html`](https://github.com/BenoitZugmeyer/eslint-plugin-html) developed by [Benoît Zugmeyer](https://github.com/BenoitZugmeyer) under [ISC](https://opensource.org/licenses/ISC) license.

## License

This plugin is issued under the [ISC](./LICENSE) license.

## Usage

Simply install via `yard add --dev @salesforce/eslint-plugin-visualforce` and add the plugin to your ESLint
configuration. See
[ESLint documentation](http://eslint.org/docs/user-guide/configuring#configuring-plugins).

Example:

```javascript
{
    "plugins": [
        "@salesforce/eslint-plugin-visualforce"
    ],
    "rules": {
      "visualforce/no-atom-expr": "error",
      "visualforce/no-apex-tags": "error",
      "visualforce/jsencode": "error"
    }
}
```

Note: by default, when executing the `eslint` command on a directory, only `.js` files will be
linted. You will have to specify extra extensions with the `--ext` option. Example: `eslint --ext
.page pages` will lint `.page` files in the `pages` directory. See [ESLint
documentation](http://eslint.org/docs/user-guide/command-line-interface#ext).

## Configuring linter-eslint package for the Atom editor

If the [`language-salesforce`](https://atom.io/packages/language-salesforce) plugin is installed simply add `source.visualforce` under "List of scopes to run ESLint on" at the `linter-eslint` configuration page.
