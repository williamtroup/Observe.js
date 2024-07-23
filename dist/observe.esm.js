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
    "src/ts/data/enum.ts"() {
        "use strict";
    }
});

var Is;

var init_is = __esm({
    "src/ts/data/is.ts"() {
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
            function o(e) {
                return t(e) && typeof e === "string";
            }
            e.definedString = o;
            function i(e) {
                return t(e) && typeof e === "function";
            }
            e.definedFunction = i;
            function s(e) {
                return t(e) && typeof e === "number";
            }
            e.definedNumber = s;
            function a(e) {
                return n(e) && e instanceof Array;
            }
            e.definedArray = a;
            function c(e) {
                return n(e) && e instanceof Date;
            }
            e.definedDate = c;
        })(Is || (Is = {}));
    }
});

var Str;

var init_str = __esm({
    "src/ts/data/str.ts"() {
        "use strict";
        init_enum();
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
        })(Str || (Str = {}));
    }
});

var Default;

var init_default = __esm({
    "src/ts/data/default.ts"() {
        "use strict";
        init_enum();
        init_is();
        (e => {
            function t(e, t) {
                return typeof e === "string" ? e : t;
            }
            e.getAnyString = t;
            function n(e, t) {
                return Is.definedString(e) ? e : t;
            }
            e.getString = n;
            function r(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getBoolean = r;
            function o(e, t) {
                return Is.definedNumber(e) ? e : t;
            }
            e.getNumber = o;
            function i(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getFunction = i;
            function s(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getArray = s;
            function a(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getObject = a;
            function c(e, t) {
                return Is.definedDate(e) ? e : t;
            }
            e.getDate = c;
            function u(e, t) {
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
            e.getStringOrArray = u;
        })(Default || (Default = {}));
    }
});

var Config;

var init_config = __esm({
    "src/ts/options/config.ts"() {
        "use strict";
        init_default();
        (e => {
            let t;
            (e => {
                function t(e = null) {
                    let t = Default.getObject(e, {});
                    t.safeMode = Default.getBoolean(t.safeMode, true);
                    t.domElementTypes = Default.getStringOrArray(t.domElementTypes, [ "*" ]);
                    t = n(t);
                    return t;
                }
                e.get = t;
                function n(e) {
                    e.text = Default.getObject(e.text, {});
                    e.text.objectErrorText = Default.getString(e.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
                    e.text.attributeNotValidErrorText = Default.getString(e.text.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
                    e.text.attributeNotSetErrorText = Default.getString(e.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
                    return e;
                }
            })(t = e.Options || (e.Options = {}));
        })(Config || (Config = {}));
    }
});

var Watch;

var init_watch = __esm({
    "src/ts/options/watch.ts"() {
        "use strict";
        init_default();
        (e => {
            let t;
            (e => {
                function t(e) {
                    let t = Default.getObject(e, {});
                    t.timeout = Default.getNumber(t.timeout, 250);
                    t.starts = Default.getDate(t.starts, null);
                    t.expires = Default.getDate(t.expires, null);
                    t.reset = Default.getBoolean(t.reset, false);
                    t.cancelOnChange = Default.getBoolean(t.cancelOnChange, false);
                    t.maximumChangesBeforeCanceling = Default.getNumber(t.maximumChangesBeforeCanceling, 0);
                    t.pauseTimeoutOnChange = Default.getNumber(t.pauseTimeoutOnChange, 0);
                    t.propertyNames = Default.getArray(t.propertyNames, null);
                    t.allowCanceling = Default.getBoolean(t.allowCanceling, true);
                    t.allowPausing = Default.getBoolean(t.allowPausing, true);
                    t.removeAttribute = Default.getBoolean(t.removeAttribute, true);
                    t = n(t);
                    return t;
                }
                e.get = t;
                function n(e) {
                    e.events = Default.getObject(e.events, {});
                    e.events.onChange = Default.getFunction(e.events.onChange, null);
                    e.events.onPropertyChange = Default.getFunction(e.events.onPropertyChange, null);
                    e.events.onCancel = Default.getFunction(e.events.onCancel, null);
                    e.events.onRemove = Default.getFunction(e.events.onRemove, null);
                    e.events.onStart = Default.getFunction(e.events.onStart, null);
                    return e;
                }
            })(t = e.Options || (e.Options = {}));
        })(Watch || (Watch = {}));
    }
});

var require_observe = __commonJS({
    "src/observe.ts"(exports, module) {
        init_constant();
        init_enum();
        init_is();
        init_str();
        init_config();
        init_watch();
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
                    const o = r.length;
                    for (let e = 0; e < o; e++) {
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
                            const t = Watch.Options.get(r.object);
                            if (!Is.definedString(e.id)) {
                                e.id = Str.newGuid();
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
                    r = Str.newGuid();
                    const o = Watch.Options.get(t);
                    const i = {};
                    let s = null;
                    i.options = o;
                    i.totalChanges = 0;
                    if (Is.definedString(n)) {
                        const e = document.getElementById(n);
                        if (Is.defined(e)) {
                            i.domElementId = n;
                            i.cachedObject = e.outerHTML;
                            i.originalObject = e.outerHTML;
                            s = e.outerHTML;
                        }
                    } else {
                        i.cachedObject = JSON.stringify(e);
                        i.originalObject = e;
                        s = e;
                    }
                    if (Is.defined(i.cachedObject)) {
                        fireCustomTriggerEvent(i.options.events.onStart, s);
                        i.timer = setInterval((function() {
                            watchTimer(o, r);
                        }), o.timeout);
                        _watches[r] = i;
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
                    const o = t.cachedObject;
                    const i = t.originalObject;
                    const s = !n ? JSON.stringify(i) : i;
                    if (o !== s) {
                        if (t.options.reset) {
                            if (n) {
                                r.outerHTML = t.cachedObject;
                            } else {
                                t.originalObject = getObjectFromString(o).object;
                            }
                        } else {
                            t.cachedObject = s;
                        }
                        if (n) {
                            fireCustomTriggerEvent(t.options.events.onChange, o, s);
                        } else {
                            const e = getObjectFromString(o).object;
                            const n = getObjectFromString(s).object;
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
                    for (let o = 0; o < r; o++) {
                        const r = n.options.propertyNames[o];
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
                        const o = e[r];
                        let i = null;
                        if (t.hasOwnProperty(r)) {
                            i = t[r];
                        }
                        if (Is.definedObject(o) && Is.definedObject(i)) {
                            compareWatchObjectProperties(o, i, n);
                        } else {
                            if (!Is.definedArray(n.options.propertyNames) || n.options.propertyNames.indexOf(r) > -1) {
                                if (JSON.stringify(o) !== JSON.stringify(i)) {
                                    fireCustomTriggerEvent(n.options.events.onPropertyChange, r, o, i);
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
                            _configuration = Config.Options.get(n);
                        }
                    }
                    return _public;
                },
                getVersion: function() {
                    return "1.0.1";
                }
            };
            (() => {
                _configuration = Config.Options.get();
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