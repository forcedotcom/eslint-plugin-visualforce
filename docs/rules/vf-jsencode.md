# JSENCODE all Apex variables

All Apex variables (controller fields) rendered inside Javascript strings via merge fields [must be escaped using JSENCODE() function](https://developer.salesforce.com/page/Secure_Coding_Cross_Site_Scripting#JSENCODE).

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
