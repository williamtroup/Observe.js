# Observe.js v1.0.0

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Observe.js%2C%20a%20free%20JavaScript%observe%builder&url=https://github.com/williamtroup/Observe.js&hashtags=javascript,html,observe)
[![npm](https://img.shields.io/badge/npmjs-v1.0.0-blue)](https://www.npmjs.com/package/jobserve.js)
[![nuget](https://img.shields.io/badge/nuget-v1.0.0-purple)](https://www.nuget.org/packages/jObserve.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/Observe.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/Observe.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://www.william-troup.com/)

> A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.


## What features does Observe.js have?

- Zero-dependencies and extremely lightweight!
- Written in TypeScript, allowing greater support for React, Angular, and other libraries!
- JS Object and HTML DOM Element watching!
- Watch for specific property changes!
- Cancel, Pause, and Resume support!
- Full API available via public functions.
- Fully configurable!
- Fully configurable per watch!
- Custom triggers for actions (when changes are detected, on cancellation, etc).


## What browsers are supported?

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.


## What are the most recent changes?

To see a list of all the most recent changes, click [here](https://github.com/williamtroup/Observe.js/blob/main/docs/CHANGE_LOG.md).


## How do I install Observe.js?

You can install the library with npm into your local modules directory using the following command:

```markdown
npm install jobserve.js
```


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
<div data-observe-js="{ 'onChange': yourCustomJsFunction }">
    Your HTML.
</div>
```

```markdown
<script> 
    var id = $observe.watch( yourObject, {
        onChange: yourCustomJsFunction
    } );
</script>
```

To see a list of all the available binding options you can use for "data-observe-js", and "watch()", click [here](https://github.com/williamtroup/Observe.js/blob/main/docs/binding/options/OPTIONS.md).

To see a list of all the available custom triggers you can use for "data-observe-js", and "watch()", click [here](https://github.com/williamtroup/Observe.js/blob/main/docs/binding/options/CUSTOM_TRIGGERS.md).


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