# Observe.js - Functions:

Below is a list of all the public functions that can be called from the Observe.js instance.
<br>
<br>


## Watching Objects:

### **watch( *object*, *options* )**:
Adds an object that should be watched for changes.
<br>
***Parameter: object***: '*Object*' - The object that should be watched. 
<br>
***Parameter: options***: '*Object*' - All the options that should be used (refer to ["Configuration Options"](binding/options/OPTIONS.md) documentation for properties).
<br>
***Returns***: '*string*' - The ID that the object watch is stored under.
<br>

### **cancelWatch( *id* )**:
Cancels the watching of an object for changes.
<br>
***Parameter: id***: '*string*' - The ID of the object being watched, or DOM element ID being watched.
<br>
***Returns***: '*boolean*' - States if the object being watched has been cancelled.
<br>

### **cancelWatches()**:
Cancels all the watches currently running, or paused.
<br>
***Returns***: '*Object*' - The Observe.js class instance.
<br>

### **getWatch( *id* )**:
Returns the properties for a running, or paused, watch.
<br>
***Parameter: id***: '*string*' - The ID of the object being watched, or DOM element ID being watched.
<br>
***Returns***: '*Object*' - The watch properties for an object (null if not found).
<br>

### **getWatches()**:
Returns all the watches currently running, or paused.
<br>
***Returns***: '*Object*' - The object of watches currently running, or paused.
<br>

### **pauseWatch( *id*, *milliseconds* )**:
Pauses the watching of an object for changes for a specific number of milliseconds.
<br>
***Parameter: id***: '*string*' - The ID of the object being watched, or DOM element ID being watched.
<br>
***Parameter: milliseconds***: '*number*' - The milliseconds to pause the watch for.
<br>
***Returns***: '*boolean*' - States if the object being watched has been paused.
<br>

### **pauseWatches( *milliseconds* )**:
Pauses all the watches for a specific number of milliseconds.
<br>
***Parameter: milliseconds***: '*number*' - The milliseconds to pause the watches for.
<br>
***Returns***: '*Object*' - The Observe.js class instance.
<br>

### **resumeWatch( *id* )**:
Resumes all the watches that are currently paused.
<br>
***Parameter: id***: '*string*' - The ID of the object being watched, or DOM element ID being watched.
<br>
***Returns***: '*boolean*' - States if the watching of an object has been resumed.
<br>

### **resumeWatches()**:
Resumes the watching of all objects for changes after they were paused.
<br>
***Returns***: '*Object*' - The Observe.js class instance.
<br>

### **searchDomForNewWatches()**:
Searches the DOM for new elements to watch, and adds them.
<br>
***Returns***: '*Object*' - The Observe.js class instance.
<br>
<br>


## Configuration:

### **setConfiguration( *newConfiguration* )**:
Sets the specific configuration options that should be used.
<br>
***Parameter: newConfiguration***: '*Object*' - All the configuration options that should be set (refer to ["Configuration Options"](configuration/OPTIONS.md) documentation for properties).
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

```markdown
<script> 
    var version = $observe.getVersion();
</script>
```