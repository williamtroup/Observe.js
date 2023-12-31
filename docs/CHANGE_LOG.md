# Observe.js - Change Log:

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