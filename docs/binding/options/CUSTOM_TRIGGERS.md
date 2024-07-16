# Observe.js - Binding Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-observe-js" binding attribute for DOM elements.  These options are also supported when calling the public function "watch()".
<br>
<br>


## When Changes Are Detected:

### options.events.onChange( *oldValue*, *newValue* ):
Fires when a change has been detected in an object.
<br>
***Parameter:*** oldValue: '*object*' - The old value for the object.
<br>
***Parameter:*** newValue: '*object*' - The new value for the object.
<br>

### options.events.onPropertyChange( *propertyName*, *oldValue*, *newValue* ):
Fires when a change has been detected in an object (states which property changed).
<br>
***Parameter:*** propertyName: '*string*' - The name of the property that has been changed.
<br>
***Parameter:*** oldValue: '*object*' - The old value.
<br>
***Parameter:*** newValue: '*object*' - The new value.
<br>

### options.events.onCancel( *id* ):
Fires when a watch has been cancelled.
<br>
***Parameter:*** id: '*string*' - The ID of the watch that has been cancelled.
<br>

### options.events.onRemove( *id* ):
Fires when a DOM element is no longer available in the DOM.
<br>
***Parameter:*** id: '*string*' - The ID of the DOM element.
<br>

### options.events.onStart( *originalValue* ):
Fires when a watch is started.
<br>
***Parameter:*** id: '*object*' - The object that the watch as started for.
<br>
<br>


## Binding Example:

```markdown
<div data-observe-js="{ 'events': { 'onChange': yourCustomJsFunction } }">
    Your HTML.
</div>
```

<br/>


## "watch()" Example:

```markdown
<script> 
    var version = $observe.watch( yourObject, {
        events: {
            onChange: yourCustomJsFunction
        }
    } );
</script>
```