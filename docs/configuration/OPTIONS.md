# Observe.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.


### Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | domElementTypes | The DOM element types to lookup (can be either an array of strings, or a space-separated string, and defaults to "*"). |

<br/>


## Example:

```markdown
<script> 
  $observe.setConfiguration( {
      safeMode: false
  } );
</script>
```