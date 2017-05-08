# Prevent &lt;apex:\*&gt; tags inside of &lt;script&gt; tag

Apex tags (VisualForce standard components) should not be used in Javascript context since it may lead to unpredicted behavior.

## Rule details

The following pattern is considered an error:

```html
<apex:page>
  <script>
    <apex:repeat value="{! apexArray }" var="entry">
      document.write('{! JSENCODE(entry) }')
    </apex:repeat>
  </script>
</apex:page>
```

Example of correct code:

```javascript
<apex:page>
  <script>
    var apexArray = JSON.parse('{! JSENCODE(apexArray) }')
    if(Array.isArray(apexArray)) apexArray.forEach(function(entry){
      document.write(entry)
    })
  </script>
</apex:page>
```
