# Observe.js v0.3.0

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Observe.js%2C%20a%20free%20JavaScript%observe%builder&url=https://github.com/williamtroup/Observe.js&hashtags=javascript,html,observe)
[![npm](https://img.shields.io/badge/npmjs-v0.3.0-blue)](https://www.npmjs.com/package/jobserve.js)
[![nuget](https://img.shields.io/badge/nuget-v0.3.0-purple)](https://www.nuget.org/packages/jObserve.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/Observe.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/Observe.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://github.com/williamtroup)

> A lightweight, and easy-to-use, JavaScript library for observing any kind of JS object, or HTML DOM element, to detect changes!


## What features does Observe.js have?

- Zero-dependencies and extremely lightweight!
- JS Object, and HTML DOM Element watching!
- Cancellation and Pausing support!
- Full API available via public functions.
- Fully configurable!
- Fully configurable per watch!
- Custom triggers for actions (when changes are detected, on cancellation, etc).


## What browsers are supported?

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.


## What are the most recent changes?

To see a list of all the most recent changes, click [here](https://github.com/williamtroup/Observe.js/blob/main/docs/CHANGE_LOG.md).


## How do I get started?

To get started using Observe.js, do the following steps:

### 1. Prerequisites:

Make sure you include the "DOCTYPE html" tag at the top of your HTML, as follows:

```markdown
<!DOCTYPE html>
```

### 2. Include Files:

```markdown
<script src="dist/observe.js"></script>
```

### 3. DOM Element Binding / Object Watching:

```markdown
<div data-observe-options="{ 'onChange': yourCustomJsFunction }">
    Your HTML.
</div>
```

```markdown
<script> 
    var id = $observe.watchObject( yourObject, {
        onChange: yourCustomJsFunction
    } );
</script>
```

To see a list of all the available binding options you can use for "data-observe-options", and "watchObject()", click [here](https://github.com/williamtroup/Observe.js/blob/main/docs/binding/options/OPTIONS.md).

To see a list of all the available custom triggers you can use for "data-observe-options", and "watchObject()", click [here](https://github.com/williamtroup/Observe.js/blob/main/docs/binding/options/CUSTOM_TRIGGERS.md).


### 4. Finishing Up:

That's it! Nice and simple. Please refer to the code if you need more help (fully documented).


## How do I go about customizing Observe.js?

To customize, and get more out of Observe.js, please read through the following documentation.


### 1. Public Functions:

To see a list of all the public functions available, click [here](https://github.com/williamtroup/Observe.js/blob/main/docs/PUBLIC_FUNCTIONS.md).


### 2. Configuration:

Configuration options allow you to customize how Observe.js will function.  You can set them as follows:

```markdown
<script> 
  $observe.setConfiguration( {
      safeMode: false
  } );
</script>
```

To see a list of all the available configuration options you can use, click [here](https://github.com/williamtroup/Observe.js/blob/main/docs/configuration/OPTIONS.md).