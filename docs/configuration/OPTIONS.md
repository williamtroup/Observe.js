# Observe.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.


### Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | domElementTypes | The DOM element types to lookup (can be either an array of strings, or a space-separated string, and defaults to "*"). |

<br/>


### Options - Strings:

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | objectErrorText | The error text that should be shown when an object error is detected (defaults to "Errors in object: {{error_1}}, {{error_2}}"). |
| *string* | attributeNotValidErrorText | The error text that should be shown when a binding object is'nt valid (defaults to "The attribute '{{attribute_name}}' is not a valid object."). |
| *string* | attributeNotSetErrorText | The error text that should be shown when a binding attribute is'nt set (defaults to "The attribute '{{attribute_name}}' has not been set correctly."). |

<br/>


## Example:

```markdown
<script> 
  $observe.setConfiguration( {
      safeMode: false
  } );
</script>
```