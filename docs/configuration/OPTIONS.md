# Observe.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.


### Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
<br/>


## Example:
<br/>

```markdown
<script> 
  $observe.setConfiguration( {
      safeMode: false
  } );
</script>
```