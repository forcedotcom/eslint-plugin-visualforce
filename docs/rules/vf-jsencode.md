# JSENCODE all Apex variables

TODO Work in progress

## Rule details

The following pattern is considered an error:

```html
<apex:page>
  <script>
    var foo = '{! someControllerField }'
  </script>
</apex:page>
```

Example of correct code:

```html
<apex:page>
  <script>
    var foo = '{! JSENCODE(someControllerField) }'
  </script>
</apex:page>
```
