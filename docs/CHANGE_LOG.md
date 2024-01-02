# Observe.js - Change Log:

## Version 0.2.0:

#### **New Features:**
- Added "reset" support, which will force any object to be reset back to its original value when a change is detected.
- Added "cancelOnChange" support, which will force a watch to cancel when the first change is detected in an object.

#### **Binding Options / Function Options:**
- Added a new binding/option called "reset", which states if an object should be reset back to its original value when a change is detected (defaults to false).
- Added a new binding/option called "cancelOnChange", which states if a watch should be canceled when the first change is detected (defaults to false).

#### **Watching:**
- Changes are now detected for HTML DOM element objects when attributes are updated.

#### **Fixes:**
- Fixed the "expires" binding/option not accurately checking the expired date and time.

<br>


## Version 0.1.0:
- Everything :)