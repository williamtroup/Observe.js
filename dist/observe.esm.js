var __getOwnPropNames = Object.getOwnPropertyNames;

var __esm = (e, t) => function n() {
    return e && (t = (0, e[__getOwnPropNames(e)[0]])(e = 0)), t;
};

var __commonJS = (e, t) => function n() {
    return t || (0, e[__getOwnPropNames(e)[0]])((t = {
        exports: {}
    }).exports, t), t.exports;
};

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
            function o(e) {
                return t(e) && typeof e === "string";
            }
            e.definedString = o;
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
            function o(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getDefaultBoolean = o;
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
            function u(e, t) {
                return Is.definedDate(e) ? e : t;
            }
            e.getDefaultDate = u;
            function l(e, t) {
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
            e.getDefaultStringOrArray = l;
        })(Data || (Data = {}));
    }
});

var require_observe = __commonJS({
    "src/observe.ts"(exports, module) {
        init_data();
        init_enum();
        init_is();
        (() => {
            let _configuration = {};
            const _watches = {};
            let _watches_Cancel = false;
            function createWatch(e, t, n) {
                let r = null;
                if (Is.definedObject(e)) {
                    r = Data.String.newGuid();
                    const o = getWatchOptions(t);
                    const a = {};
                    let i = null;
                    a.options = o;
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
                            watchTimer(o, r);
                        }), o.timeout);
                        _watches[r] = a;
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
                    const a = t.originalObject;
                    const i = !n ? JSON.stringify(a) : a;
                    if (o !== i) {
                        if (t.options.reset) {
                            if (n) {
                                r.outerHTML = t.cachedObject;
                            } else {
                                t.originalObject = getObjectFromString(o).object;
                            }
                        } else {
                            t.cachedObject = i;
                        }
                        if (n) {
                            fireCustomTriggerEvent(t.options.events.onChange, o, i);
                        } else {
                            const e = getObjectFromString(o).object;
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
                for (var r in e) {
                    if (e.hasOwnProperty(r)) {
                        const o = e[r];
                        let a = null;
                        if (t.hasOwnProperty(r)) {
                            a = t[r];
                        }
                        if (Is.definedObject(o) && Is.definedObject(a)) {
                            compareWatchObjectProperties(o, a, n);
                        } else {
                            if (!Is.definedArray(n.options.propertyNames) || n.options.propertyNames.indexOf(r) > -1) {
                                if (JSON.stringify(o) !== JSON.stringify(a)) {
                                    fireCustomTriggerEvent(n.options.events.onPropertyChange, r, o, a);
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
            (() => {})();
        })();
    }
});

export default require_observe();//# sourceMappingURL=observe.esm.js.map