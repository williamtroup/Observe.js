/*! Observe.js v0.8.1 | (c) Bunoon 2024 | MIT License */
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
    if (isDefined(element) && element.hasAttribute(_attribute_Name_Watch_Options)) {
      var bindingOptionsData = element.getAttribute(_attribute_Name_Watch_Options);
      if (isDefinedString(bindingOptionsData)) {
        var bindingOptions = getObjectFromString(bindingOptionsData);
        if (bindingOptions.parsed && isDefinedObject(bindingOptions.result)) {
          bindingOptions = getWatchOptions(bindingOptions.result);
          if (!isDefinedString(element.id)) {
            element.id = newGuid();
          }
          element.removeAttribute(_attribute_Name_Watch_Options);
          createWatch(element, bindingOptions, element.id);
        } else {
          logError(_configuration.attributeNotValidErrorText.replace("{{attribute_name}}", _attribute_Name_Watch_Options));
          result = false;
        }
      } else {
        logError(_configuration.attributeNotSetErrorText.replace("{{attribute_name}}", _attribute_Name_Watch_Options));
        result = false;
      }
    }
    return result;
  }
  function createWatch(object, options, domElementId) {
    var storageId = null;
    if (isDefinedObject(object)) {
      storageId = newGuid();
      var watchOptions = getWatchOptions(options);
      var watch = {};
      var startWatchObject;
      watch.options = watchOptions;
      watch.totalChanges = 0;
      if (isDefinedString(domElementId)) {
        var domElement = _parameter_Document.getElementById(domElementId);
        if (isDefined(domElement)) {
          watch.domElementId = domElementId;
          watch.cachedObject = domElement.outerHTML;
          watch.originalObject = domElement.outerHTML;
          startWatchObject = domElement.outerHTML;
        }
      } else {
        watch.cachedObject = _parameter_Json.stringify(object);
        watch.originalObject = object;
        startWatchObject = object;
      }
      if (isDefined(watch.cachedObject)) {
        fireCustomTrigger(watch.options.onStart, startWatchObject);
        watch.timer = setInterval(function() {
          watchTimer(watchOptions, storageId);
        }, watchOptions.timeout);
        _watches[storageId] = watch;
      }
    }
    return storageId;
  }
  function watchTimer(watchOptions, storageId) {
    var currentDateTime = new Date();
    if (!isDefinedDate(watchOptions.starts) || currentDateTime >= watchOptions.starts) {
      watchObjectForChanges(storageId);
      if (isDefinedDate(watchOptions.expires) && currentDateTime >= watchOptions.expires) {
        cancelWatchObject(storageId);
      }
    }
  }
  function watchObjectForChanges(storageId) {
    if (_watches.hasOwnProperty(storageId)) {
      var watch = _watches[storageId];
      var isDomElement = isDefinedString(watch.domElementId);
      var domElement = null;
      if (isDomElement) {
        domElement = _parameter_Document.getElementById(watch.domElementId);
        if (isDefined(domElement)) {
          watch.originalObject = domElement.outerHTML;
        } else {
          watch.originalObject = _string.empty;
          fireCustomTrigger(watch.options.onRemove, watch.domElementId);
        }
      }
      var cachedObject = watch.cachedObject;
      var originalObject = watch.originalObject;
      var originalObjectJson = !isDomElement ? _parameter_Json.stringify(originalObject) : originalObject;
      if (cachedObject !== originalObjectJson) {
        if (watch.options.reset) {
          if (isDomElement) {
            domElement.outerHTML = watch.cachedObject;
          } else {
            watch.originalObject = getObjectFromString(cachedObject).result;
          }
        } else {
          watch.cachedObject = originalObjectJson;
        }
        if (isDomElement) {
          fireCustomTrigger(watch.options.onChange, cachedObject, originalObjectJson);
        } else {
          var oldValue = getObjectFromString(cachedObject).result;
          var newValue = getObjectFromString(originalObjectJson).result;
          if (!isDefinedArray(oldValue) && !isDefinedArray(newValue)) {
            compareWatchObject(oldValue, newValue, watch);
            if (isDefinedFunction(watch.options.onPropertyChange)) {
              compareWatchObjectProperties(oldValue, newValue, watch);
            }
          } else {
            fireCustomTrigger(watch.options.onChange, oldValue, newValue);
          }
        }
        watch.totalChanges++;
        if (watch.options.pauseTimeoutOnChange > 0) {
          pauseWatchObject(storageId, watch.options.pauseTimeoutOnChange);
        }
        if (watch.options.cancelOnChange) {
          cancelWatchObject(storageId);
        }
        if (watch.options.maximumChangesBeforeCanceling > 0 && watch.totalChanges >= watch.options.maximumChangesBeforeCanceling) {
          cancelWatchObject(storageId);
        }
      }
    }
  }
  function compareWatchObject(oldObject, newObject, watch) {
    if (isDefinedArray(watch.options.propertyNames)) {
      var propertyNamesLength = watch.options.propertyNames.length;
      var propertyNameIndex = 0;
      for (; propertyNameIndex < propertyNamesLength; propertyNameIndex++) {
        var propertyName = watch.options.propertyNames[propertyNameIndex];
        if (oldObject[propertyName] !== newObject[propertyName]) {
          fireCustomTrigger(watch.options.onChange, oldObject, newObject);
          break;
        }
      }
    } else {
      fireCustomTrigger(watch.options.onChange, oldObject, newObject);
    }
  }
  function compareWatchObjectProperties(oldObject, newObject, watch) {
    var propertyName;
    for (propertyName in oldObject) {
      if (oldObject.hasOwnProperty(propertyName)) {
        var propertyOldValue = oldObject[propertyName];
        var propertyNewValue = null;
        if (newObject.hasOwnProperty(propertyName)) {
          propertyNewValue = newObject[propertyName];
        }
        if (isDefinedObject(propertyOldValue) && isDefinedObject(propertyNewValue)) {
          compareWatchObjectProperties(propertyOldValue, propertyNewValue, watch.options);
        } else {
          if (!isDefinedArray(watch.options.propertyNames) || watch.options.propertyNames.indexOf(propertyName) > -1) {
            if (_parameter_Json.stringify(propertyOldValue) !== _parameter_Json.stringify(propertyNewValue)) {
              fireCustomTrigger(watch.options.onPropertyChange, propertyName, propertyOldValue, propertyNewValue);
            }
          }
        }
      }
    }
  }
  function cancelWatchesForObjects() {
    var storageId;
    for (storageId in _watches) {
      if (_watches.hasOwnProperty(storageId)) {
        cancelWatchObject(storageId);
      }
    }
  }
  function cancelWatchObject(storageId) {
    if (_watches.hasOwnProperty(storageId)) {
      var watchOptions = _watches[storageId].options;
      if (watchOptions.allowCanceling || _watches_Cancel) {
        fireCustomTrigger(watchOptions.onCancel, storageId);
        clearInterval(_watches[storageId].timer);
        delete _watches[storageId];
      }
    }
  }
  function pauseWatchObject(storageId, milliseconds) {
    var result = false;
    if (_watches.hasOwnProperty(storageId)) {
      var watchOptions = _watches[storageId].options;
      if (watchOptions.allowPausing) {
        watchOptions.starts = new Date();
        watchOptions.starts.setMilliseconds(watchOptions.starts.getMilliseconds() + milliseconds);
        result = true;
      }
    }
    return result;
  }
  function getWatchOptions(newOptions) {
    var options = getDefaultObject(newOptions, {});
    options.timeout = getDefaultNumber(options.timeout, 250);
    options.starts = getDefaultDate(options.starts, null);
    options.expires = getDefaultDate(options.expires, null);
    options.reset = getDefaultBoolean(options.reset, false);
    options.cancelOnChange = getDefaultBoolean(options.cancelOnChange, false);
    options.maximumChangesBeforeCanceling = getDefaultNumber(options.maximumChangesBeforeCanceling, 0);
    options.pauseTimeoutOnChange = getDefaultNumber(options.pauseTimeoutOnChange, 0);
    options.propertyNames = getDefaultArray(options.propertyNames, null);
    options.allowCanceling = getDefaultBoolean(options.allowCanceling, true);
    options.allowPausing = getDefaultBoolean(options.allowPausing, true);
    options = getWatchOptionsCustomTriggers(options);
    return options;
  }
  function getWatchOptionsCustomTriggers(options) {
    options.onChange = getDefaultFunction(options.onChange, null);
    options.onPropertyChange = getDefaultFunction(options.onPropertyChange, null);
    options.onCancel = getDefaultFunction(options.onCancel, null);
    options.onRemove = getDefaultFunction(options.onRemove, null);
    options.onStart = getDefaultFunction(options.onStart, null);
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
      var character = _parameter_Math.floor(_parameter_Math.random() * 16).toString(16);
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
  function getDefaultString(value, defaultValue) {
    return isDefinedString(value) ? value : defaultValue;
  }
  function getDefaultDate(value, defaultValue) {
    return isDefinedDate(value) ? value : defaultValue;
  }
  function getDefaultArray(value, defaultValue) {
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getDefaultObject(value, defaultValue) {
    return isDefinedObject(value) ? value : defaultValue;
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
        result = _parameter_Json.parse(objectString);
      }
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
        if (isDefinedFunction(result)) {
          result = result();
        }
      } catch (e2) {
        parsed = logError(_configuration.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e2.message));
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
    buildDefaultConfigurationStrings();
  }
  function buildDefaultConfigurationStrings() {
    _configuration.objectErrorText = getDefaultString(_configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
    _configuration.attributeNotValidErrorText = getDefaultString(_configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
    _configuration.attributeNotSetErrorText = getDefaultString(_configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
  }
  var _parameter_Document = null;
  var _parameter_Window = null;
  var _parameter_Math = null;
  var _parameter_Json = null;
  var _string = {empty:""};
  var _watches = {};
  var _watches_Cancel = false;
  var _configuration = {};
  var _attribute_Name_Watch_Options = "data-observe-watch-options";
  this.watch = function(object, options) {
    return createWatch(object, options);
  };
  this.cancelWatch = function(id) {
    var result = false;
    if (_watches.hasOwnProperty(id)) {
      cancelWatchObject(id);
      result = true;
    } else {
      var storageId;
      for (storageId in _watches) {
        if (_watches.hasOwnProperty(storageId) && isDefinedString(_watches[storageId].domElementId) && _watches[storageId].domElementId === id) {
          cancelWatchObject(storageId);
          result = true;
          break;
        }
      }
    }
    return result;
  };
  this.cancelWatches = function() {
    cancelWatchesForObjects();
    return this;
  };
  this.getWatch = function(id) {
    var result = null;
    if (_watches.hasOwnProperty(id)) {
      result = _watches[id];
    } else {
      var storageId;
      for (storageId in _watches) {
        if (_watches.hasOwnProperty(storageId) && isDefinedString(_watches[storageId].domElementId) && _watches[storageId].domElementId === id) {
          result = _watches[storageId];
          break;
        }
      }
    }
    return result;
  };
  this.getWatches = function() {
    return _watches;
  };
  this.pauseWatch = function(id, milliseconds) {
    var result = false;
    if (_watches.hasOwnProperty(id)) {
      result = pauseWatchObject(id, milliseconds);
    } else {
      var storageId;
      for (storageId in _watches) {
        if (_watches.hasOwnProperty(storageId) && isDefinedString(_watches[storageId].domElementId) && _watches[storageId].domElementId === id) {
          result = pauseWatchObject(storageId, milliseconds);
          break;
        }
      }
    }
    return result;
  };
  this.pauseWatches = function(milliseconds) {
    var storageId;
    for (storageId in _watches) {
      if (_watches.hasOwnProperty(storageId)) {
        pauseWatchObject(storageId, milliseconds);
      }
    }
    return this;
  };
  this.resumeWatch = function(id) {
    var result = false;
    if (_watches.hasOwnProperty(id)) {
      _watches[id].options.starts = null;
      result = true;
    } else {
      var storageId;
      for (storageId in _watches) {
        if (_watches.hasOwnProperty(storageId) && isDefinedString(_watches[storageId].domElementId) && _watches[storageId].domElementId === id) {
          _watches[storageId].options.starts = null;
          result = true;
          break;
        }
      }
    }
    return result;
  };
  this.resumeWatches = function() {
    var storageId;
    for (storageId in _watches) {
      if (_watches.hasOwnProperty(storageId)) {
        _watches[storageId].options.starts = null;
      }
    }
    return this;
  };
  this.searchDomForNewWatches = function() {
    collectDOMObjects();
    return this;
  };
  this.setConfiguration = function(newConfiguration) {
    _configuration = getDefaultObject(newConfiguration, {});
    buildDefaultConfiguration();
    return this;
  };
  this.getVersion = function() {
    return "0.8.1";
  };
  (function(documentObject, windowObject, mathObject, jsonObject) {
    _parameter_Document = documentObject;
    _parameter_Window = windowObject;
    _parameter_Math = mathObject;
    _parameter_Json = jsonObject;
    buildDefaultConfiguration();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      collectDOMObjects();
    });
    _parameter_Window.addEventListener("unload", function() {
      _watches_Cancel = true;
      cancelWatchesForObjects();
    });
    if (!isDefined(_parameter_Window.$observe)) {
      _parameter_Window.$observe = this;
    }
  })(document, window, Math, JSON);
})();