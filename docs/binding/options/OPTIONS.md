# Observe.js - Binding Options:

Below is a list of all the options supported in the "data-observe-options" binding attribute for DOM elements.  These options are also supported when calling the public function "watchObject()".
<br>
<br>


## Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *number* | observeTimeout | States the delay that should be waited before checking the object for changes (defaults to 250 milliseconds). |
| *date* | expires | States a date/time when the watch should expire (defaults to null). |
| *boolean* | reset | States if the original value of the object should be reset back to its original value when a change is detected (defaults to false). |
<br/>


## Binding Example:
<br/>

```markdown
<div data-observe-options="{ 'onChange': yourCustomJsFunction }">
    Your HTML.
</div>
```

<br/>


## "watchObject()" Example:
<br/>

```markdown
<script> 
    var id = $observe.watchObject( yourObject, {
        onChange: yourCustomJsFunction
    } );
</script>
```