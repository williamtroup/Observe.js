# Observe.js - Binding Options:

Below is a list of all the options supported in the "data-observe-options" binding attribute for DOM elements.  These options are also supported when calling the public function "watchObject()".
<br>
<br>


## Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *number* | timeout | States the delay that should be waited before checking the object for changes (defaults to 250 milliseconds). |
| *date* | starts | States a date/time when the watch should start (defaults to null). |
| *date* | expires | States a date/time when the watch should expire (defaults to null). |
| *boolean* | reset | States if the value of the object should be reset back to its original value when a change is detected (defaults to false). |
| *boolean* | cancelOnChange | States if the watch should be canceled when the first change is detected (defaults to false). |
| *number* | maximumChangesBeforeCanceling | States the total number of changes that are allowed before the watch is canceled (defaults to 0, which is off) |
<br/>


## Binding Example:
<br/>

```markdown
<div data-observe-options="{ 'timeout': 1000 }">
    Your HTML.
</div>
```

<br/>


## "watchObject()" Example:
<br/>

```markdown
<script> 
    var id = $observe.watchObject( yourObject, {
        timeout: 1000
    } );
</script>
```