# Observe.js - Binding Options:

Below is a list of all the options supported in the "data-observe-watch-options" binding attribute for DOM elements.  These options are also supported when calling the public function "watch()".
<br>
<br>


## Standard Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *number* | timeout | States the delay (in milliseconds) that should be used before checking the object for changes (defaults to 250 milliseconds). |
| *date* | starts | States a date/time when the watch should start (defaults to null). |
| *date* | expires | States a date/time when the watch should expire (defaults to null). |
| *boolean* | reset | States if the value of the object should be reset back to its original value when a change is detected (defaults to false). |
| *boolean* | cancelOnChange | States if the watch should be cancelled when the first change is detected (defaults to false). |
| *number* | maximumChangesBeforeCanceling | States the total number of changes that are allowed before the watch is cancelled (defaults to 0, which is off) |
| *number* | pauseTimeoutOnChange | States the delay (in milliseconds) that should be used before checking for changes again after a change is detected (defaults to 0, which is off) |
| *string[]* | propertyNames | States the property names that should be watched for changes (defaults to all). |
| *boolean* | allowCanceling | States if the watch can be cancelled (defaults to true). |
| *boolean* | allowPausing | States if the watch can be paused (defaults to true). |
| *boolean* | removeAttribute | States if the binding attribute should be removed (defaults to true). |

<br/>


## Binding Example:

```markdown
<div data-observe-watch-options="{ 'timeout': 1000 }">
    Your HTML.
</div>
```

<br/>


## "watch()" Example:

```markdown
<script> 
    var id = $observe.watch( yourObject, {
        timeout: 1000
    } );
</script>
```