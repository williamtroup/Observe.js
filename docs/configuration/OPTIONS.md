# Observe.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.


### Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | domElementTypes | The DOM element types to lookup (can be either an array of strings, or a space-separated string, and defaults to "*"). |

<br/>


### Options - Strings:

| Category: | Type: | Name: | Description: |
| --- | --- | --- | --- |
| text | *string* | objectErrorText | The error text that should be shown when an object error is detected (defaults to "Errors in object: {{error_1}}, {{error_2}}"). |
| text | *string* | attributeNotValidErrorText | The error text that should be shown when a binding object isn't valid (defaults to "The attribute '{{attribute_name}}' is not a valid object."). |
| text | *string* | attributeNotSetErrorText | The error text that should be shown when a binding attribute isn't set (defaults to "The attribute '{{attribute_name}}' has not been set correctly."). |

<br/>


## Example:

```markdown
<script> 
  $observe.setConfiguration( {
      safeMode: false
  } );
</script>
```