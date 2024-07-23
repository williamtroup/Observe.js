var __getOwnPropNames = Object.getOwnPropertyNames;

var __esm = (e, t) => function n() {
    return e && (t = (0, e[__getOwnPropNames(e)[0]])(e = 0)), t;
};

var __commonJS = (e, t) => function n() {
    return t || (0, e[__getOwnPropNames(e)[0]])((t = {
        exports: {}
    }).exports, t), t.exports;
};

var Constant;

var init_constant = __esm({
    "src/ts/constant.ts"() {
        "use strict";
        (e => {
            e.OBSERVE_JS_ATTRIBUTE_NAME = "data-observe-js";
        })(Constant || (Constant = {}));
    }
});

var init_enum = __esm({
    "src/ts/enum.ts"() {
        "use strict";
    }
});

var Is;

var init_is = __esm({
    "src/ts/is.ts"() {
        "use strict";
        init_enum();
        (e => {
            function t(e) {
                return e !== null && e !== void 0 && e.toString() !== "";
            }
            e.defined = t;
            function n(e) {
                return t(e) && typeof e === "object";
            }
            e.definedObject = n;
            function r(e) {
                return t(e) && typeof e === "boolean";
            }
            e.definedBoolean = r;
            function a(e) {
                return t(e) && typeof e === "string";
            }
            e.definedString = a;
            function o(e) {
                return t(e) && typeof e === "function";
            }
            e.definedFunction = o;
            function i(e) {
                return t(e) && typeof e === "number";
            }
            e.definedNumber = i;
            function s(e) {
                return n(e) && e instanceof Array;
            }
            e.definedArray = s;
            function c(e) {
                return n(e) && e instanceof Date;
            }
            e.definedDate = c;
        })(Is || (Is = {}));
    }
});

var Data;

var init_data = __esm({
    "src/ts/data.ts"() {
        "use strict";
        init_enum();
        init_is();
        (e => {
            let t;
            (e => {
                function t() {
                    const e = [];
                    for (let t = 0; t < 32; t++) {
                        if (t === 8 || t === 12 || t === 16 || t === 20) {
                            e.push("-");
                        }
                        const n = Math.floor(Math.random() * 16).toString(16);
                        e.push(n);
                    }
                    return e.join("");
                }
                e.newGuid = t;
            })(t = e.String || (e.String = {}));
            function n(e, t) {
                return typeof e === "string" ? e : t;
            }
            e.getDefaultAnyString = n;
            function r(e, t) {
                return Is.definedString(e) ? e : t;
            }
            e.getDefaultString = r;
            function a(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getDefaultBoolean = a;
            function o(e, t) {
                return Is.definedNumber(e) ? e : t;
            }
            e.getDefaultNumber = o;
            function i(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getDefaultFunction = i;
            function s(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getDefaultArray = s;
            function c(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getDefaultObject = c;
            function u(e, t) {
                return Is.definedDate(e) ? e : t;
            }
            e.getDefaultDate = u;
            function f(e, t) {
                let n = t;
                if (Is.definedString(e)) {
                    const r = e.toString().split("space");
                    if (r.length === 0) {
                        e = t;
                    } else {
                        n = r;
                    }
                } else {
                    n = s(e, t);
                }
                return n;
            }
            e.getDefaultStringOrArray = f;
        })(Data || (Data = {}));
    }
});

var require_observe = __commonJS({
    "src/observe.ts"(exports, module) {
        init_constant();
        init_data();
        init_enum();
        init_is();
        (() => {
            let _configuration = {};
            const _watches = {};
            let _watches_Cancel = false;
            function collectDOMObjects() {
                const e = _configuration.domElementTypes;
                const t = e.length;
                for (let n = 0; n < t; n++) {
                    const t = document.getElementsByTagName(e[n]);
                    const r = [].slice.call(t);
                    const a = r.length;
                    for (let e = 0; e < a; e++) {
                        if (!collectDOMObject(r[e])) {
                            break;
                        }
                    }
                }
            }
            function collectDOMObject(e) {
                let t = true;
                if (Is.defined(e) && e.hasAttribute(Constant.OBSERVE_JS_ATTRIBUTE_NAME)) {
                    const n = e.getAttribute(Constant.OBSERVE_JS_ATTRIBUTE_NAME);
                    if (Is.definedString(n)) {
                        const r = getObjectFromString(n);
                        if (r.parsed && Is.definedObject(r.object)) {
                            const t = getWatchOptions(r.object);
                            if (!Is.definedString(e.id)) {
                                e.id = Data.String.newGuid();
                            }
                            if (t.removeAttribute) {
                                e.removeAttribute(Constant.OBSERVE_JS_ATTRIBUTE_NAME);
                            }
                            createWatch(e, t, e.id);
                        } else {
                            logError(_configuration.text.attributeNotValidErrorText.replace("{{attribute_name}}", Constant.OBSERVE_JS_ATTRIBUTE_NAME));
                            t = false;
                        }
                    } else {
                        logError(_configuration.text.attributeNotSetErrorText.replace("{{attribute_name}}", Constant.OBSERVE_JS_ATTRIBUTE_NAME));
                        t = false;
                    }
                }
                return t;
            }
            function createWatch(e, t, n = null) {
                let r = null;
                if (Is.definedObject(e)) {
                    r = Data.String.newGuid();
                    const a = getWatchOptions(t);
                    const o = {};
                    let i = null;
                    o.options = a;
                    o.totalChanges = 0;
                    if (Is.definedString(n)) {
                        const e = document.getElementById(n);
                        if (Is.defined(e)) {
                            o.domElementId = n;
                            o.cachedObject = e.outerHTML;
                            o.originalObject = e.outerHTML;
                            i = e.outerHTML;
                        }
                    } else {
                        o.cachedObject = JSON.stringify(e);
                        o.originalObject = e;
                        i = e;
                    }
                    if (Is.defined(o.cachedObject)) {
                        fireCustomTriggerEvent(o.options.events.onStart, i);
                        o.timer = setInterval((function() {
                            watchTimer(a, r);
                        }), a.timeout);
                        _watches[r] = o;
                    }
                }
                return r;
            }
            function watchTimer(e, t) {
                const n = new Date;
                if (!Is.definedDate(e.starts) || n >= e.starts) {
                    watchObjectForChanges(t);
                    if (Is.definedDate(e.expires) && n >= e.expires) {
                        cancelWatchObject(t);
                    }
                }
            }
            function watchObjectForChanges(e) {
                if (_watches.hasOwnProperty(e)) {
                    const t = _watches[e];
                    const n = Is.definedString(t.domElementId);
                    let r = null;
                    if (n) {
                        r = document.getElementById(t.domElementId);
                        if (Is.defined(r)) {
                            t.originalObject = r.outerHTML;
                        } else {
                            t.originalObject = "";
                            fireCustomTriggerEvent(t.options.events.onRemove, t.domElementId);
                        }
                    }
                    const a = t.cachedObject;
                    const o = t.originalObject;
                    const i = !n ? JSON.stringify(o) : o;
                    if (a !== i) {
                        if (t.options.reset) {
                            if (n) {
                                r.outerHTML = t.cachedObject;
                            } else {
                                t.originalObject = getObjectFromString(a).object;
                            }
                        } else {
                            t.cachedObject = i;
                        }
                        if (n) {
                            fireCustomTriggerEvent(t.options.events.onChange, a, i);
                        } else {
                            const e = getObjectFromString(a).object;
                            const n = getObjectFromString(i).object;
                            if (!Is.definedArray(e) && !Is.definedArray(n)) {
                                compareWatchObject(e, n, t);
                                if (Is.definedFunction(t.options.events.onPropertyChange)) {
                                    compareWatchObjectProperties(e, n, t);
                                }
                            } else {
                                fireCustomTriggerEvent(t.options.events.onChange, e, n);
                            }
                        }
                        t.totalChanges++;
                        if (t.options.pauseTimeoutOnChange > 0) {
                            pauseWatchObject(e, t.options.pauseTimeoutOnChange);
                        }
                        if (t.options.cancelOnChange) {
                            cancelWatchObject(e);
                        }
                        if (t.options.maximumChangesBeforeCanceling > 0 && t.totalChanges >= t.options.maximumChangesBeforeCanceling) {
                            cancelWatchObject(e);
                        }
                    }
                }
            }
            function compareWatchObject(e, t, n) {
                if (Is.definedArray(n.options.propertyNames)) {
                    const r = n.options.propertyNames.length;
                    for (let a = 0; a < r; a++) {
                        const r = n.options.propertyNames[a];
                        if (e[r] !== t[r]) {
                            fireCustomTriggerEvent(n.options.events.onChange, e, t);
                            break;
                        }
                    }
                } else {
                    fireCustomTriggerEvent(n.options.events.onChange, e, t);
                }
            }
            function compareWatchObjectProperties(e, t, n) {
                for (let r in e) {
                    if (e.hasOwnProperty(r)) {
                        const a = e[r];
                        let o = null;
                        if (t.hasOwnProperty(r)) {
                            o = t[r];
                        }
                        if (Is.definedObject(a) && Is.definedObject(o)) {
                            compareWatchObjectProperties(a, o, n);
                        } else {
                            if (!Is.definedArray(n.options.propertyNames) || n.options.propertyNames.indexOf(r) > -1) {
                                if (JSON.stringify(a) !== JSON.stringify(o)) {
                                    fireCustomTriggerEvent(n.options.events.onPropertyChange, r, a, o);
                                }
                            }
                        }
                    }
                }
            }
            function cancelWatchesForObjects() {
                for (let e in _watches) {
                    if (_watches.hasOwnProperty(e)) {
                        cancelWatchObject(e);
                    }
                }
            }
            function cancelWatchObject(e) {
                if (_watches.hasOwnProperty(e)) {
                    const t = _watches[e].options;
                    if (t.allowCanceling || _watches_Cancel) {
                        fireCustomTriggerEvent(t.events.onCancel, e);
                        clearInterval(_watches[e].timer);
                        delete _watches[e];
                    }
                }
            }
            function pauseWatchObject(e, t) {
                let n = false;
                if (_watches.hasOwnProperty(e)) {
                    const r = _watches[e].options;
                    if (r.allowPausing) {
                        r.starts = new Date;
                        r.starts.setMilliseconds(r.starts.getMilliseconds() + t);
                        n = true;
                    }
                }
                return n;
            }
            function getWatchOptions(e) {
                let t = Data.getDefaultObject(e, {});
                t.timeout = Data.getDefaultNumber(t.timeout, 250);
                t.starts = Data.getDefaultDate(t.starts, null);
                t.expires = Data.getDefaultDate(t.expires, null);
                t.reset = Data.getDefaultBoolean(t.reset, false);
                t.cancelOnChange = Data.getDefaultBoolean(t.cancelOnChange, false);
                t.maximumChangesBeforeCanceling = Data.getDefaultNumber(t.maximumChangesBeforeCanceling, 0);
                t.pauseTimeoutOnChange = Data.getDefaultNumber(t.pauseTimeoutOnChange, 0);
                t.propertyNames = Data.getDefaultArray(t.propertyNames, null);
                t.allowCanceling = Data.getDefaultBoolean(t.allowCanceling, true);
                t.allowPausing = Data.getDefaultBoolean(t.allowPausing, true);
                t.removeAttribute = Data.getDefaultBoolean(t.removeAttribute, true);
                t = getWatchOptionsCustomTriggers(t);
                return t;
            }
            function getWatchOptionsCustomTriggers(e) {
                e.events = Data.getDefaultObject(e.events, {});
                e.events.onChange = Data.getDefaultFunction(e.events.onChange, null);
                e.events.onPropertyChange = Data.getDefaultFunction(e.events.onPropertyChange, null);
                e.events.onCancel = Data.getDefaultFunction(e.events.onCancel, null);
                e.events.onRemove = Data.getDefaultFunction(e.events.onRemove, null);
                e.events.onStart = Data.getDefaultFunction(e.events.onStart, null);
                return e;
            }
            function fireCustomTriggerEvent(e, ...t) {
                if (Is.definedFunction(e)) {
                    e.apply(null, [].slice.call(t, 0));
                }
            }
            function getObjectFromString(objectString) {
                const result = {
                    parsed: true,
                    object: null
                };
                try {
                    if (Is.definedString(objectString)) {
                        result.object = JSON.parse(objectString);
                    }
                } catch (e1) {
                    try {
                        result.object = eval(`(${objectString})`);
                        if (Is.definedFunction(result.object)) {
                            result.object = result.object();
                        }
                    } catch (e) {
                        if (!_configuration.safeMode) {
                            logError(_configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message));
                            result.parsed = false;
                        }
                        result.object = null;
                    }
                }
                return result;
            }
            function logError(e) {
                let t = true;
                if (!_configuration.safeMode) {
                    console.error(e);
                    t = false;
                }
                return t;
            }
            function buildDefaultConfiguration(e = null) {
                _configuration = Data.getDefaultObject(e, {});
                _configuration.safeMode = Data.getDefaultBoolean(_configuration.safeMode, true);
                _configuration.domElementTypes = Data.getDefaultStringOrArray(_configuration.domElementTypes, [ "*" ]);
                buildDefaultConfigurationStrings();
            }
            function buildDefaultConfigurationStrings() {
                _configuration.text = Data.getDefaultObject(_configuration.text, {});
                _configuration.text.objectErrorText = Data.getDefaultString(_configuration.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
                _configuration.text.attributeNotValidErrorText = Data.getDefaultString(_configuration.text.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
                _configuration.text.attributeNotSetErrorText = Data.getDefaultString(_configuration.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
            }
            const _public = {
                watch: function(e, t) {
                    return createWatch(e, t);
                },
                cancelWatch: function(e) {
                    let t = false;
                    if (Is.definedString(e)) {
                        if (_watches.hasOwnProperty(e)) {
                            cancelWatchObject(e);
                            t = true;
                        } else {
                            for (let n in _watches) {
                                if (_watches.hasOwnProperty(n) && Is.definedString(_watches[n].domElementId) && _watches[n].domElementId === e) {
                                    cancelWatchObject(n);
                                    t = true;
                                    break;
                                }
                            }
                        }
                    }
                    return t;
                },
                cancelWatches: function() {
                    cancelWatchesForObjects();
                    return _public;
                },
                getWatch: function(e) {
                    let t = null;
                    if (Is.definedString(e)) {
                        if (_watches.hasOwnProperty(e)) {
                            t = _watches[e];
                        } else {
                            for (let n in _watches) {
                                if (_watches.hasOwnProperty(n) && Is.definedString(_watches[n].domElementId) && _watches[n].domElementId === e) {
                                    t = _watches[n];
                                    break;
                                }
                            }
                        }
                    }
                    return t;
                },
                getWatches: function() {
                    return _watches;
                },
                pauseWatch: function(e, t) {
                    let n = false;
                    if (Is.definedString(e) && Is.definedNumber(t)) {
                        if (_watches.hasOwnProperty(e)) {
                            n = pauseWatchObject(e, t);
                        } else {
                            for (let r in _watches) {
                                if (_watches.hasOwnProperty(r) && Is.definedString(_watches[r].domElementId) && _watches[r].domElementId === e) {
                                    n = pauseWatchObject(r, t);
                                    break;
                                }
                            }
                        }
                    }
                    return n;
                },
                pauseWatches: function(e) {
                    if (Is.definedNumber(e)) {
                        for (let t in _watches) {
                            if (_watches.hasOwnProperty(t)) {
                                pauseWatchObject(t, e);
                            }
                        }
                    }
                    return _public;
                },
                resumeWatch: function(e) {
                    let t = false;
                    if (Is.definedString(e)) {
                        if (_watches.hasOwnProperty(e)) {
                            _watches[e].options.starts = null;
                            t = true;
                        } else {
                            for (let n in _watches) {
                                if (_watches.hasOwnProperty(n) && Is.definedString(_watches[n].domElementId) && _watches[n].domElementId === e) {
                                    _watches[n].options.starts = null;
                                    t = true;
                                    break;
                                }
                            }
                        }
                    }
                    return t;
                },
                resumeWatches: function() {
                    for (let e in _watches) {
                        if (_watches.hasOwnProperty(e)) {
                            _watches[e].options.starts = null;
                        }
                    }
                    return _public;
                },
                searchDomForNewWatches: function() {
                    collectDOMObjects();
                    return _public;
                },
                setConfiguration: function(e) {
                    if (Is.definedObject(e)) {
                        let t = false;
                        const n = _configuration;
                        for (let r in e) {
                            if (e.hasOwnProperty(r) && _configuration.hasOwnProperty(r) && n[r] !== e[r]) {
                                n[r] = e[r];
                                t = true;
                            }
                        }
                        if (t) {
                            buildDefaultConfiguration(n);
                        }
                    }
                    return _public;
                },
                getVersion: function() {
                    return "1.0.1";
                }
            };
            (() => {
                buildDefaultConfiguration();
                document.addEventListener("DOMContentLoaded", (function() {
                    collectDOMObjects();
                }));
                window.addEventListener("pagehide", (function() {
                    _watches_Cancel = true;
                    cancelWatchesForObjects();
                }));
                if (!Is.defined(window.$observe)) {
                    window.$observe = _public;
                }
            })();
        })();
    }
});

export default require_observe();//# sourceMappingURL=observe.esm.js.map