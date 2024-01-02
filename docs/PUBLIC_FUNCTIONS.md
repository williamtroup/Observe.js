# Observe.js - Functions:

Below is a list of all the public functions that can be called from the Observe.js instance.
<br>
<br>


## Watching Objects:

### **watchObject( *object*, *options* )**:
Adds an object that should be watched for changes.
<br>
***Parameter: object***: '*Object*' - The object that should be watched. 
<br>
***Parameter: options***: '*Object*' - All the options that should be used (refer to ["Configuration Options"](binding/options/OPTIONS.md) documentation for properties).
<br>
***Returns***: '*string*' - The ID that object watch is stored under.
<br>

### **cancelWatch( *id* )**:
Cancels the watching of an object for changes.
<br>
***Parameter: id***: '*string*' - The Id of the object being watched, or DOM element ID being watched.
<br>
***Returns***: '*boolean*' - States if the object being watched has been canceled.
<br>

### **getWatch( *id* )**:
Returns the properties for an active watch.
<br>
***Parameter: id***: '*string*' - The Id of the object being watched, or DOM element ID being watched.
<br>
***Returns***: '*Object*' - The watch properties for an object (null if not found).
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
<br>


## Additional Data:

### **getVersion()**:
Returns the version of Observe.js.
<br>
***Returns***: '*string*' - The version number.
<br>
<br>


## Example:
<br/>

```markdown
<script> 
    var version = $observe.getVersion();
</script>
```