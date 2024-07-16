"use strict";

var Constant;

(e => {
    e.OBSERVE_JS_ATTRIBUTE_NAME = "data-observe-js";
})(Constant || (Constant = {}));

var Is;

(e => {
    function t(e) {
        return e !== null && e !== void 0 && e.toString() !== "";
    }
    e.defined = t;
    function n(e) {
        return t(e) && typeof e === "object";
    }
    e.definedObject = n;
    function o(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = o;
    function r(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = r;
    function a(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = a;
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

var Data;

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
    function o(e, t) {
        return Is.definedString(e) ? e : t;
    }
    e.getDefaultString = o;
    function r(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    e.getDefaultBoolean = r;
    function a(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    e.getDefaultNumber = a;
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
    function l(e, t) {
        return Is.definedDate(e) ? e : t;
    }
    e.getDefaultDate = l;
    function u(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const o = e.toString().split("space");
            if (o.length === 0) {
                e = t;
            } else {
                n = o;
            }
        } else {
            n = s(e, t);
        }
        return n;
    }
    e.getDefaultStringOrArray = u;
})(Data || (Data = {}));

(() => {
    let _configuration = {};
    const _watches = {};
    let _watches_Cancel = false;
    function collectDOMObjects() {
        const e = _configuration.domElementTypes;
        const t = e.length;
        for (let n = 0; n < t; n++) {
            const t = document.getElementsByTagName(e[n]);
            const o = [].slice.call(t);
            const r = o.length;
            for (let e = 0; e < r; e++) {
                if (!collectDOMObject(o[e])) {
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
                const o = getObjectFromString(n);
                if (o.parsed && Is.definedObject(o.object)) {
                    const t = getWatchOptions(o.object);
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
    function createWatch(e, t, n) {
        let o = null;
        if (Is.definedObject(e)) {
            o = Data.String.newGuid();
            const r = getWatchOptions(t);
            const a = {};
            let i = null;
            a.options = r;
            a.totalChanges = 0;
            if (Is.definedString(n)) {
                const e = document.getElementById(n);
                if (Is.defined(e)) {
                    a.domElementId = n;
                    a.cachedObject = e.outerHTML;
                    a.originalObject = e.outerHTML;
                    i = e.outerHTML;
                }
            } else {
                a.cachedObject = JSON.stringify(e);
                a.originalObject = e;
                i = e;
            }
            if (Is.defined(a.cachedObject)) {
                fireCustomTriggerEvent(a.options.events.onStart, i);
                a.timer = setInterval((function() {
                    watchTimer(r, o);
                }), r.timeout);
                _watches[o] = a;
            }
        }
        return o;
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
            let o = null;
            if (n) {
                o = document.getElementById(t.domElementId);
                if (Is.defined(o)) {
                    t.originalObject = o.outerHTML;
                } else {
                    t.originalObject = "";
                    fireCustomTriggerEvent(t.options.events.onRemove, t.domElementId);
                }
            }
            const r = t.cachedObject;
            const a = t.originalObject;
            const i = !n ? JSON.stringify(a) : a;
            if (r !== i) {
                if (t.options.reset) {
                    if (n) {
                        o.outerHTML = t.cachedObject;
                    } else {
                        t.originalObject = getObjectFromString(r).object;
                    }
                } else {
                    t.cachedObject = i;
                }
                if (n) {
                    fireCustomTriggerEvent(t.options.events.onChange, r, i);
                } else {
                    const e = getObjectFromString(r).object;
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
            const o = n.options.propertyNames.length;
            for (let r = 0; r < o; r++) {
                const o = n.options.propertyNames[r];
                if (e[o] !== t[o]) {
                    fireCustomTriggerEvent(n.options.events.onChange, e, t);
                    break;
                }
            }
        } else {
            fireCustomTriggerEvent(n.options.events.onChange, e, t);
        }
    }
    function compareWatchObjectProperties(e, t, n) {
        for (var o in e) {
            if (e.hasOwnProperty(o)) {
                const r = e[o];
                let a = null;
                if (t.hasOwnProperty(o)) {
                    a = t[o];
                }
                if (Is.definedObject(r) && Is.definedObject(a)) {
                    compareWatchObjectProperties(r, a, n);
                } else {
                    if (!Is.definedArray(n.options.propertyNames) || n.options.propertyNames.indexOf(o) > -1) {
                        if (JSON.stringify(r) !== JSON.stringify(a)) {
                            fireCustomTriggerEvent(n.options.events.onPropertyChange, o, r, a);
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
            const o = _watches[e].options;
            if (o.allowPausing) {
                o.starts = new Date;
                o.starts.setMilliseconds(o.starts.getMilliseconds() + t);
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
    (() => {})();
})();//# sourceMappingURL=observe.js.map