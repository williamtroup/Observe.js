/*! Observe.js v0.2.0 | (c) Bunoon | MIT License */
(function() {
  function collectDOMObjects() {
    var tagTypes = _configuration.domElementTypes;
    var tagTypesLength = tagTypes.length;
    var tagTypeIndex = 0;
    for (; tagTypeIndex < tagTypesLength; tagTypeIndex++) {
      var domElements = _parameter_Document.getElementsByTagName(tagTypes[tagTypeIndex]);
      var elements = [].slice.call(domElements);
      var elementsLength = elements.length;
      var elementIndex = 0;
      for (; elementIndex < elementsLength; elementIndex++) {
        if (!collectDOMObject(elements[elementIndex])) {
          break;
        }
      }
    }
  }
  function collectDOMObject(element) {
    var result = true;
    if (isDefined(element) && element.hasAttribute(_attribute_Name_Options)) {
      var bindingOptionsData = element.getAttribute(_attribute_Name_Options);
      if (isDefinedString(bindingOptionsData)) {
        var bindingOptions = getObjectFromString(bindingOptionsData);
        if (bindingOptions.parsed && isDefinedObject(bindingOptions.result)) {
          bindingOptions = getObserveOptions(bindingOptions.result);
          if (!isDefinedString(element.id)) {
            element.id = newGuid();
          }
          createWatch(element, bindingOptions, element.id);
        } else {
          if (!_configuration.safeMode) {
            console.error("The attribute '" + _attribute_Name_Options + "' is not a valid object.");
            result = false;
          }
        }
      } else {
        if (!_configuration.safeMode) {
          console.error("The attribute '" + _attribute_Name_Options + "' has not been set correctly.");
          result = false;
        }
      }
    }
    return result;
  }
  function createWatch(object, options, domElementId) {
    var storageId = null;
    if (isDefinedObject(object)) {
      storageId = newGuid();
      var observeOptions = getObserveOptions(options);
      var observable = {};
      observable.options = observeOptions;
      observable.domElementId = domElementId;
      observable.totalChanges = 0;
      if (isDefinedString(domElementId)) {
        var domElement = _parameter_Document.getElementById(domElementId);
        if (isDefined(domElement)) {
          observable.cachedObject = domElement.outerHTML;
          observable.originalObject = domElement.outerHTML;
        }
      } else {
        observable.cachedObject = JSON.stringify(object);
        observable.originalObject = object;
      }
      observable.timer = setInterval(function() {
        var currentDateTime = new Date();
        if (!isDefinedDate(observeOptions.starts) || currentDateTime >= observeOptions.starts) {
          watchObjectForChanges(storageId);
          if (isDefinedDate(observeOptions.expires) && currentDateTime >= observeOptions.expires) {
            cancelWatchObject(storageId);
          }
        }
      }, observeOptions.observeTimeout);
      _observables[storageId] = observable;
    }
    return storageId;
  }
  function watchObjectForChanges(storageId) {
    if (_observables.hasOwnProperty(storageId)) {
      var observable = _observables[storageId];
      var isDomElement = isDefinedString(observable.domElementId);
      var domElement = null;
      if (isDomElement) {
        domElement = _parameter_Document.getElementById(observable.domElementId);
        if (isDefined(domElement)) {
          observable.originalObject = domElement.outerHTML;
        }
      }
      var cachedObject = observable.cachedObject;
      var originalObject = observable.originalObject;
      var originalObjectJson = !isDomElement ? JSON.stringify(originalObject) : originalObject;
      if (cachedObject !== originalObjectJson) {
        var options = observable.options;
        if (options.reset) {
          if (isDomElement) {
            domElement.outerHTML = observable.cachedObject;
          } else {
            observable.originalObject = getObjectFromString(cachedObject).result;
          }
        } else {
          observable.cachedObject = originalObjectJson;
        }
        if (isDomElement) {
          fireCustomTrigger(options.onChange, cachedObject, originalObjectJson);
        } else {
          var oldValue = getObjectFromString(cachedObject).result;
          var newValue = getObjectFromString(originalObjectJson).result;
          fireCustomTrigger(options.onChange, oldValue, newValue);
          if (isDefinedFunction(options.onPropertyChange) && !isDefinedArray(oldValue)) {
            compareWatchObjectProperties(oldValue, newValue, options);
          }
        }
        if (options.cancelOnChange) {
          cancelWatchObject(storageId);
        }
        observable.totalChanges++;
        if (options.maximumChangesBeforeCanceling > 0 && observable.totalChanges >= options.maximumChangesBeforeCanceling) {
          cancelWatchObject(storageId);
        }
      }
    }
  }
  function compareWatchObjectProperties(oldObject, newObject, options) {
    var propertyName;
    for (propertyName in oldObject) {
      if (oldObject.hasOwnProperty(propertyName)) {
        var propertyOldValue = oldObject[propertyName];
        var propertyNewValue = null;
        if (newObject.hasOwnProperty(propertyName)) {
          propertyNewValue = newObject[propertyName];
        }
        if (isDefinedObject(propertyOldValue) && isDefinedObject(propertyNewValue)) {
          compareWatchObjectProperties(propertyOldValue, propertyNewValue, options);
        } else {
          if (JSON.stringify(propertyOldValue) !== JSON.stringify(propertyNewValue)) {
            fireCustomTrigger(options.onPropertyChange, propertyName, propertyOldValue, propertyNewValue);
          }
        }
      }
    }
  }
  function cancelWatchObject(storageId) {
    if (_observables.hasOwnProperty(storageId)) {
      var options = _observables[storageId].options;
      fireCustomTrigger(options.onCancel, storageId);
      clearTimeout(_observables[storageId].timer);
      delete _observables[storageId];
    }
  }
  function getObserveOptions(newOptions) {
    var options = !isDefinedObject(newOptions) ? {} : newOptions;
    options.observeTimeout = getDefaultNumber(options.observeTimeout, 250);
    options.starts = getDefaultDate(options.starts, null);
    options.expires = getDefaultDate(options.expires, null);
    options.reset = getDefaultBoolean(options.reset, false);
    options.cancelOnChange = getDefaultBoolean(options.cancelOnChange, false);
    options.maximumChangesBeforeCanceling = getDefaultNumber(options.maximumChangesBeforeCanceling, 0);
    options = getObserveOptionsCustomTriggers(options);
    return options;
  }
  function getObserveOptionsCustomTriggers(options) {
    options.onChange = getDefaultFunction(options.onChange, null);
    options.onPropertyChange = getDefaultFunction(options.onPropertyChange, null);
    options.onCancel = getDefaultFunction(options.onCancel, null);
    return options;
  }
  function fireCustomTrigger(triggerFunction) {
    if (isDefinedFunction(triggerFunction)) {
      triggerFunction.apply(null, [].slice.call(arguments, 1));
    }
  }
  function newGuid() {
    var result = [];
    var charIndex = 0;
    for (; charIndex < 32; charIndex++) {
      if (charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20) {
        result.push("-");
      }
      var character = Math.floor(Math.random() * 16).toString(16);
      result.push(character);
    }
    return result.join(_string.empty);
  }
  function isDefined(value) {
    return value !== null && value !== undefined && value !== _string.empty;
  }
  function isDefinedObject(object) {
    return isDefined(object) && typeof object === "object";
  }
  function isDefinedBoolean(object) {
    return isDefined(object) && typeof object === "boolean";
  }
  function isDefinedString(object) {
    return isDefined(object) && typeof object === "string";
  }
  function isDefinedFunction(object) {
    return isDefined(object) && typeof object === "function";
  }
  function isDefinedNumber(object) {
    return isDefined(object) && typeof object === "number";
  }
  function isDefinedArray(object) {
    return isDefinedObject(object) && object instanceof Array;
  }
  function isDefinedDate(object) {
    return isDefinedObject(object) && object instanceof Date;
  }
  function getDefaultBoolean(value, defaultValue) {
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function getDefaultFunction(value, defaultValue) {
    return isDefinedFunction(value) ? value : defaultValue;
  }
  function getDefaultNumber(value, defaultValue) {
    return isDefinedNumber(value) ? value : defaultValue;
  }
  function getDefaultDate(value, defaultValue) {
    return isDefinedDate(value) ? value : defaultValue;
  }
  function getDefaultArray(value, defaultValue) {
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getDefaultStringOrArray(value, defaultValue) {
    if (isDefinedString(value)) {
      value = value.split(_string.space);
      if (value.length === 0) {
        value = defaultValue;
      }
    } else {
      value = getDefaultArray(value, defaultValue);
    }
    return value;
  }
  function getObjectFromString(objectString) {
    var parsed = true;
    var result = null;
    try {
      if (isDefinedString(objectString)) {
        result = JSON.parse(objectString);
      }
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
        if (isDefinedFunction(result)) {
          result = result();
        }
      } catch (e2) {
        parsed = logError("Errors in object: " + e1.message + ", " + e2.message);
        result = null;
      }
    }
    return {parsed:parsed, result:result};
  }
  function logError(error) {
    var result = true;
    if (!_configuration.safeMode) {
      console.error(error);
      result = false;
    }
    return result;
  }
  function buildDefaultConfiguration() {
    _configuration.safeMode = getDefaultBoolean(_configuration.safeMode, true);
    _configuration.domElementTypes = getDefaultStringOrArray(_configuration.domElementTypes, ["*"]);
  }
  var _parameter_Document = null;
  var _parameter_Window = null;
  var _string = {empty:""};
  var _observables = {};
  var _configuration = {};
  var _attribute_Name_Options = "data-observe-options";
  this.watchObject = function(object, options) {
    return createWatch(object, options);
  };
  this.cancelWatch = function(id) {
    var result = false;
    if (_observables.hasOwnProperty(id)) {
      cancelWatchObject(id);
      result = true;
    }
    return result;
  };
  this.cancelDomElementWatch = function(elementId) {
    var result = false;
    var storageId;
    for (storageId in _observables) {
      if (_observables.hasOwnProperty(storageId) && isDefinedString(_observables[storageId].domElementId) && _observables[storageId].domElementId === elementId) {
        cancelWatchObject(storageId);
        result = true;
        break;
      }
    }
    return result;
  };
  this.setConfiguration = function(newOptions) {
    _configuration = !isDefinedObject(newOptions) ? {} : newOptions;
    buildDefaultConfiguration();
    return this;
  };
  this.getVersion = function() {
    return "0.2.0";
  };
  (function(documentObject, windowObject) {
    _parameter_Document = documentObject;
    _parameter_Window = windowObject;
    buildDefaultConfiguration();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      collectDOMObjects();
    });
    if (!isDefined(_parameter_Window.$observe)) {
      _parameter_Window.$observe = this;
    }
  })(document, window);
})();