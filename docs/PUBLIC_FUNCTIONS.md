# Observe.js - Functions:

Below is a list of all the public functions that can be called from the Observe.js instance.
<br>
<br>


## Configuration:

### **setConfiguration( *newOptions* )**:
Sets the specific configuration options that should be used.
<br>
***Parameter: newOptions***: '*Options*' - All the configuration options that should be set (refer to ["Configuration Options"](configuration/OPTIONS.md) documentation for properties).
<br>
***Returns***: '*Object*' - The Observe.js class instance.
<br>


## Additional Data:

### **getVersion()**:
Returns the version of Observe.js.
<br>
***Returns***: '*string*' - The version number.
<br>


## Example:
<br/>

```markdown
<script> 
    var version = $observe.getVersion();
</script>
```