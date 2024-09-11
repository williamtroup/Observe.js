# Observe.js - Change Log:

## Version 1.1.0:
- Improved the HTML testing files.
- Improved event assignments, and re-organized the code into separate files.

<br>


#### **Language Shift:**

## Version 1.0.1:
- Updated to the latest NPM packages.
- Organized all of the .ts files into separate folders.
- Removed the dead JS code.

<br>


## Version 1.0.0:

#### **Language Shift:**
- The entire project has been rewritten in TypeScript, allowing all components to be exported, which allows better support for libraries such as React, Angular, etc.
- Added CDN links for the minimized version of the files.
- The TypeScript code is compiled to ES2016 instead of ES5 (older browsers, such as IE, are no longer supported).

#### **Building:**
- You can now run separate builds to produce CJS, ESM, and Minimized project versions.
- All files not required for the NPM packages have now been excluded.

#### **Watch Options:**
- BREAKING: All the event custom triggers are now under a new section called "events".

#### **Configuration Options:**
- BREAKING: All the text options are now under a new section called "text".

#### **Testing:**
- Removed the "src" and "dist" folders under "test".  Only the dist versions remain, removing duplication.
- Added "BUILD_INSTRUCTIONS.md" to help first-time users set up their dev environments.

<br>


## Version 0.8.2:
- Added export support for the global "$observe" object, which can now be imported as "observe.js".
- BREAKING: Renamed the binding attribute "data-observe-watch-options" to "data-observe-js".

<br>


## Version 0.8.1:
- The "unload" window event has been replaced with "pagehide" (due to "unload" being deprecated).
- The public function "setConfiguration()" will now only update the configuration if something in the configuration has been changed.
- All public functions now only accept the right variable types for data (to prevent issues from occurring).
- Added "use strict" support internally and updated all public functions to use the new scope.

<br>


## Version 0.8.0:

#### **Binding Options:**
- Added a new binding option called "removeAttribute", which states if the binding attribute should be removed (defaults to true).

#### **Configuration Options:**
- Added a new configuration option called "objectErrorText", which states the error text that should be shown when an object error is detected (defaults to "Errors in object: {{error_1}}, {{error_2}}").
- Added a new configuration option called "attributeNotValidErrorText", which states the error text that should be shown when a binding object isn't valid (defaults to "The attribute '{{attribute_name}}' is not a valid object.").
- Added a new configuration option called "attributeNotSetErrorText", which states the error text that should be shown when a binding attribute isn't set (defaults to "The attribute '{{attribute_name}}' has not been set correctly.").

#### **General Improvements:**
- All console error logging now goes through the correct method.
- Objects are now checked and defaulted properly when invalid values are passed.
- Updated the formatting used in the "package.json" file so that it can always be parsed.

#### **Documentation:**
- Minor tweaks to the documentation.

<br>


## Version 0.7.1:
- Fixed a fault that caused clearTimeout() to be called instead of clearInterval().

<br>


## Version 0.7.0:

#### **Rules:**
- Watches will now only start if an object can be found (is not null, or the DOM element exists).

#### **Binding Options / Function Options - Custom Triggers:**
- Added a new binding/option custom trigger called "onStart", which states an event that should be triggered when a watch is started.

#### **General Improvements:**
- Added Math injection directly into the main instance.
- Added JSON injection directly into the main instance.
- Improved keywords in the package files.

#### **Documentation:**
- Added install instructions into the main README files.
- Added documentation that states how issues and new feature requests should be raised.

#### **Fixes:**
- Fixed the "observe.js.nuspec" file including the ".github" folder when NuGet PACK is called.

<br>


## Version 0.6.1:
- Updated project homepage URL.
- Fixed the binding property "allowPausing" defaulting to "null" instead of "true" when not manually set.

<br>


## Version 0.6.0:

#### **Binding Options / Function Options:**
- Added a new binding/option called "allowCanceling", which states the watch can be cancelled (defaults to true).
- Added a new binding/option called "allowPausing", which states the watch can be paused (defaults to true).

#### **Public Functions:**
- Added new public function "pauseWatches()", which is used to pause all the watches for a specific number of milliseconds.
- Added new public function "resumeWatches()", which is used to resume all the watches currently paused.

#### **General Improvements:**
- Minor internal refactoring to make things a little clearer.

#### **Fixes:**
- Fixed some errors in HTML files when calling the public functions.

<br>


## Version 0.5.1:
- Project description update.
- Minor documentation updates.
- Fixed a small fault that prevented the total changes from being handled correctly when a watch was stopped.
- Added support to watch array objects for changes.

<br>


## Version 0.5.0:

#### **New Features:**
- Added specific properties watch support! This will only watch for changes in specific properties on an object, instead of all of them by default.

#### **Binding Options / Function Options:**
- Added a new binding/option called "propertyNames", which states the property names that should be watched for changes (defaults to all).

#### **Binding Options / Function Options - Custom Triggers:**
- Added a new binding/option custom trigger called "onRemove", which states an event that should be triggered when a DOM element is removed.

#### **Public Functions:**
- Added new public function "resumeWatch()", which is used to resume a watch that has been paused.

#### **Fixes:**
- Fixed a fault that allowed comparisons between arrays and objects (was causing some script errors).

#### **Documentation:**
- Fixed some of the documentation mistakes.

<br>


## Version 0.4.0:

#### **Public Functions:**
- Added new public function "searchDomForNewWatches()", which is used to search the DOM for new elements to watch, then adds them.

#### **BREAKING CHANGES:**
- Renamed the DOM attribute "data-observe-options" to "data-observe-watch-options".
- Renamed the public function "watchObject()" to "watch()".

#### **General Improvements:**
- Minor internal refactoring to make things a little clearer.

#### **Fixes:**
- Fixed a fault that prevented the binding attribute from being removed from the DOM elements.
- Fixed a fault that prevented changes from being detected when a DOM element is removed from the DOM.
- Fixed some properties being assigned to internal watches when not required.

<br>


## Version 0.3.0:

#### **New Features:**
- Added "Pause Timeout On Change" support, which will force the watch to wait a specific number of milliseconds before detecting changes again when a change is detected.

#### **Binding Options / Function Options:**
- Added a new binding/option called "pauseTimeoutOnChange", which states the milliseconds to wait for new changes to be detected when a change is detected (defaults to 0, which is off).

#### **Public Functions:**
- Added new public function "cancelWatches()", which is used to cancel all the watches currently running, or paused.
- Added new public function "getWatches()", which is used to return all the watches currently running, or paused.
- Added new public function "pauseWatch()", which is used to pause a running watch for a specific number of milliseconds.

#### **General Improvements:**
- When the page is unloaded, all active watches are now cancelled.

#### **Documentation:**
- Fixed some of the documentation spelling/grammar mistakes.

<br>


## Version 0.2.0:

#### **New Features:**
- Added "Reset" support, which will force any object to be reset back to its original value when a change is detected.
- Added "Cancel On Change" support, which will force a watch to cancel when the first change is detected in an object.
- Added "Maximum Changes Before Canceling" support, which states how many changes are allowed before a watch is cancelled.
- Added "Starts" support, which states a date/time a watch should be started.

#### **Binding Options / Function Options:**
- Added a new binding/option called "reset", which states if an object should be reset back to its original value when a change is detected (defaults to false).
- Added a new binding/option called "cancelOnChange", which states if a watch should be cancelled when the first change is detected (defaults to false).
- Added a new binding/option called "maximumChangesBeforeCanceling", which states the total number of changes allowed before a watch is cancelled (defaults to 0, which for off).
- Added a new binding/option called "starts", which states the date/time a watch should start (defaults to null).
- Renamed the binding/option "observeTimeout" to "timeout".

#### **Binding Options / Function Options - Custom Triggers:**
- Added a new binding/option custom trigger called "onCancel", which states an event that should be triggered when a watch is cancelled.

#### **Public Functions:**
- Added new public function "getWatch()", which is used to return all the watch properties for an object being watched.
- Removed the public function "cancelDomElementWatch()", as "cancelWatch()" will now do it for you.

#### **Watching:**
- Changes are now detected for HTML DOM element objects when attributes are updated.

#### **General Improvements:**
- Refactored lots of the internal code to align with the naming of the areas.

#### **Documentation:**
- Fixed some of the documentation referencing the wrong properties.

#### **Fixes:**
- Fixed the "expires" binding/option not accurately checking the expired date and time.
- Fixed a script error that occurred sometimes when a watch is cancelled using the public function "cancelWatch()".

<br>


## Version 0.1.0:
- Everything :)