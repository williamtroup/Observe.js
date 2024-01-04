# Observe.js - Binding Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-observe-watch-options" binding attribute for DOM elements.  These options are also supported when calling the public function "watch()".
<br>
<br>


## When Changes Are Detected:

### options.onChange( *oldValue*, *newValue* ):
Fires when a change has been detected in an object.
<br>
***Parameter:*** oldValue: '*object*' - The old value for the object.
<br>
***Parameter:*** newValue: '*object*' - The new value for the object.

### options.onPropertyChange( *propertyName*, *oldValue*, *newValue* ):
Fires when a change has been detected in an object (states which property changed).
<br>
***Parameter:*** propertyName: '*string*' - The name of the property that has been changed.
<br>
***Parameter:*** oldValue: '*object*' - The old value.
<br>
***Parameter:*** newValue: '*object*' - The new value.

### options.onCancel( *id* ):
Fires when a watch has been cancelled.
<br>
***Parameter:*** id: '*string*' - The ID of the watch that has been cancelled.

<br>


## Binding Example:

```markdown
<div data-observe-watch-options="{ 'onChange': yourCustomJsFunction }">
    Your HTML.
</div>
```

<br/>


## "watch()" Example:

```markdown
<script> 
    var version = $observe.watch( yourObject, {
        onChange: yourCustomJsFunction
    } );
</script>
```