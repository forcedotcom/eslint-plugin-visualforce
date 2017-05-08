# Prevent VisualForce Merge Field in JS expression context

Merge Fields outside of strings are dangerous even if JSENCODE is applied to them. If it is required to pass a JS expression from Apex, it should be merged to a string first, and then parsed using `JSON.parse`.

## Rule details

The following pattern is considered an error:

```javascript
var apexVariable = {! JSENCODE(apexVariable) }
```

Example of correct code:

```javascript
var apexVariable = JSON.parse('{! JSENCODE(apexVariable) }')
```
