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
    function a(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = a;
    function s(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = s;
    function u(e) {
        return n(e) && e instanceof Date;
    }
    e.definedDate = u;
})(Is || (Is = {}));

var Log;

(e => {
    function t(e, t) {
        let n = true;
        if (!t.safeMode) {
            console.error(e);
            n = false;
        }
        return n;
    }
    e.error = t;
})(Log || (Log = {}));

var Default2;

(Default => {
    function getAnyString(e, t) {
        return typeof e === "string" ? e : t;
    }
    Default.getAnyString = getAnyString;
    function getString(e, t) {
        return Is.definedString(e) ? e : t;
    }
    Default.getString = getString;
    function getBoolean(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    Default.getBoolean = getBoolean;
    function getNumber(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    Default.getNumber = getNumber;
    function getFunction(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    Default.getFunction = getFunction;
    function getArray(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    Default.getArray = getArray;
    function getObject(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    Default.getObject = getObject;
    function getDate(e, t) {
        return Is.definedDate(e) ? e : t;
    }
    Default.getDate = getDate;
    function getStringOrArray(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const r = e.toString().split("space");
            if (r.length === 0) {
                e = t;
            } else {
                n = r;
            }
        } else {
            n = getArray(e, t);
        }
        return n;
    }
    Default.getStringOrArray = getStringOrArray;
    function getObjectFromString(objectString, configuration) {
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
                    configuration;
                }
            } catch (e) {
                if (!configuration.safeMode) {
                    Log.error(configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message), configuration);
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    Default.getObjectFromString = getObjectFromString;
})(Default2 || (Default2 = {}));

var Config;

(e => {
    let t;
    (e => {
        function t(e = null) {
            let t = Default2.getObject(e, {});
            t.safeMode = Default2.getBoolean(t.safeMode, true);
            t.domElementTypes = Default2.getStringOrArray(t.domElementTypes, [ "*" ]);
            t = n(t);
            return t;
        }
        e.get = t;
        function n(e) {
            e.text = Default2.getObject(e.text, {});
            e.text.objectErrorText = Default2.getString(e.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
            e.text.attributeNotValidErrorText = Default2.getString(e.text.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
            e.text.attributeNotSetErrorText = Default2.getString(e.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(Config || (Config = {}));

var Watch;

(e => {
    let t;
    (e => {
        function t(e) {
            let t = Default2.getObject(e, {});
            t.timeout = Default2.getNumber(t.timeout, 250);
            t.starts = Default2.getDate(t.starts, null);
            t.expires = Default2.getDate(t.expires, null);
            t.reset = Default2.getBoolean(t.reset, false);
            t.cancelOnChange = Default2.getBoolean(t.cancelOnChange, false);
            t.maximumChangesBeforeCanceling = Default2.getNumber(t.maximumChangesBeforeCanceling, 0);
            t.pauseTimeoutOnChange = Default2.getNumber(t.pauseTimeoutOnChange, 0);
            t.propertyNames = Default2.getArray(t.propertyNames, null);
            t.allowCanceling = Default2.getBoolean(t.allowCanceling, true);
            t.allowPausing = Default2.getBoolean(t.allowPausing, true);
            t.removeAttribute = Default2.getBoolean(t.removeAttribute, true);
            t = n(t);
            return t;
        }
        e.get = t;
        function n(e) {
            e.events = Default2.getObject(e.events, {});
            e.events.onChange = Default2.getFunction(e.events.onChange, null);
            e.events.onPropertyChange = Default2.getFunction(e.events.onPropertyChange, null);
            e.events.onCancel = Default2.getFunction(e.events.onCancel, null);
            e.events.onRemove = Default2.getFunction(e.events.onRemove, null);
            e.events.onStart = Default2.getFunction(e.events.onStart, null);
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(Watch || (Watch = {}));

var Trigger;

(e => {
    function t(e, ...t) {
        if (Is.definedFunction(e)) {
            e.apply(null, [].slice.call(t, 0));
        }
    }
    e.customEvent = t;
})(Trigger || (Trigger = {}));

(() => {
    let e = {};
    const t = {};
    let n = false;
    function r() {
        const t = e.domElementTypes;
        const n = t.length;
        for (let e = 0; e < n; e++) {
            const n = document.getElementsByTagName(t[e]);
            const r = [].slice.call(n);
            const i = r.length;
            for (let e = 0; e < i; e++) {
                if (!o(r[e])) {
                    break;
                }
            }
        }
    }
    function o(t) {
        let n = true;
        if (Is.defined(t) && t.hasAttribute(Constant.OBSERVE_JS_ATTRIBUTE_NAME)) {
            const r = t.getAttribute(Constant.OBSERVE_JS_ATTRIBUTE_NAME);
            if (Is.definedString(r)) {
                const o = Default2.getObjectFromString(r, e);
                if (o.parsed && Is.definedObject(o.object)) {
                    const e = Watch.Options.get(o.object);
                    if (!Is.definedString(t.id)) {
                        t.id = crypto.randomUUID();
                    }
                    if (e.removeAttribute) {
                        t.removeAttribute(Constant.OBSERVE_JS_ATTRIBUTE_NAME);
                    }
                    i(t, e, t.id);
                } else {
                    Log.error(e.text.attributeNotValidErrorText.replace("{{attribute_name}}", Constant.OBSERVE_JS_ATTRIBUTE_NAME), e);
                    n = false;
                }
            } else {
                Log.error(e.text.attributeNotSetErrorText.replace("{{attribute_name}}", Constant.OBSERVE_JS_ATTRIBUTE_NAME), e);
                n = false;
            }
        }
        return n;
    }
    function i(e, n, r = null) {
        let o = null;
        if (Is.definedObject(e)) {
            o = crypto.randomUUID();
            const i = Watch.Options.get(n);
            const s = {};
            let u = null;
            s.options = i;
            s.totalChanges = 0;
            if (Is.definedString(r)) {
                const e = document.getElementById(r);
                if (Is.defined(e)) {
                    s.domElementId = r;
                    s.cachedObject = e.outerHTML;
                    s.originalObject = e.outerHTML;
                    u = e.outerHTML;
                }
            } else {
                s.cachedObject = JSON.stringify(e);
                s.originalObject = e;
                u = e;
            }
            if (Is.defined(s.cachedObject)) {
                Trigger.customEvent(s.options.events.onStart, u);
                s.timer = setInterval((() => {
                    a(i, o);
                }), i.timeout);
                t[o] = s;
            }
        }
        return o;
    }
    function a(e, t) {
        const n = new Date;
        if (!Is.definedDate(e.starts) || n >= e.starts) {
            s(t);
            if (Is.definedDate(e.expires) && n >= e.expires) {
                c(t);
            }
        }
    }
    function s(n) {
        if (t.hasOwnProperty(n)) {
            const r = t[n];
            const o = Is.definedString(r.domElementId);
            let i = null;
            if (o) {
                i = document.getElementById(r.domElementId);
                if (Is.defined(i)) {
                    r.originalObject = i.outerHTML;
                } else {
                    r.originalObject = "";
                    Trigger.customEvent(r.options.events.onRemove, r.domElementId);
                }
            }
            const a = r.cachedObject;
            const s = r.originalObject;
            const l = !o ? JSON.stringify(s) : s;
            if (a !== l) {
                if (r.options.reset) {
                    if (o) {
                        i.outerHTML = r.cachedObject;
                    } else {
                        r.originalObject = Default2.getObjectFromString(a, e).object;
                    }
                } else {
                    r.cachedObject = l;
                }
                if (o) {
                    Trigger.customEvent(r.options.events.onChange, a, l);
                } else {
                    const t = Default2.getObjectFromString(a, e).object;
                    const n = Default2.getObjectFromString(l, e).object;
                    if (!Is.definedArray(t) && !Is.definedArray(n)) {
                        u(t, n, r);
                        if (Is.definedFunction(r.options.events.onPropertyChange)) {
                            f(t, n, r);
                        }
                    } else {
                        Trigger.customEvent(r.options.events.onChange, t, n);
                    }
                }
                r.totalChanges++;
                if (r.options.pauseTimeoutOnChange > 0) {
                    g(n, r.options.pauseTimeoutOnChange);
                }
                if (r.options.cancelOnChange) {
                    c(n);
                }
                if (r.options.maximumChangesBeforeCanceling > 0 && r.totalChanges >= r.options.maximumChangesBeforeCanceling) {
                    c(n);
                }
            }
        }
    }
    function u(e, t, n) {
        if (Is.definedArray(n.options.propertyNames)) {
            const r = n.options.propertyNames.length;
            for (let o = 0; o < r; o++) {
                const r = n.options.propertyNames[o];
                if (e[r] !== t[r]) {
                    Trigger.customEvent(n.options.events.onChange, e, t);
                    break;
                }
            }
        } else {
            Trigger.customEvent(n.options.events.onChange, e, t);
        }
    }
    function f(e, t, n) {
        for (let r in e) {
            if (e.hasOwnProperty(r)) {
                const o = e[r];
                let i = null;
                if (t.hasOwnProperty(r)) {
                    i = t[r];
                }
                if (Is.definedObject(o) && Is.definedObject(i)) {
                    f(o, i, n);
                } else {
                    if (!Is.definedArray(n.options.propertyNames) || n.options.propertyNames.indexOf(r) > -1) {
                        if (JSON.stringify(o) !== JSON.stringify(i)) {
                            Trigger.customEvent(n.options.events.onPropertyChange, r, o, i);
                        }
                    }
                }
            }
        }
    }
    function l() {
        for (let e in t) {
            if (t.hasOwnProperty(e)) {
                c(e);
            }
        }
    }
    function c(e) {
        if (t.hasOwnProperty(e)) {
            const r = t[e].options;
            if (r.allowCanceling || n) {
                Trigger.customEvent(r.events.onCancel, e);
                clearInterval(t[e].timer);
                delete t[e];
            }
        }
    }
    function g(e, n) {
        let r = false;
        if (t.hasOwnProperty(e)) {
            const o = t[e].options;
            if (o.allowPausing) {
                o.starts = new Date;
                o.starts.setMilliseconds(o.starts.getMilliseconds() + n);
                r = true;
            }
        }
        return r;
    }
    const d = {
        watch: function(e, t) {
            return i(e, t);
        },
        cancelWatch: function(e) {
            let n = false;
            if (Is.definedString(e)) {
                if (t.hasOwnProperty(e)) {
                    c(e);
                    n = true;
                } else {
                    for (let r in t) {
                        if (t.hasOwnProperty(r) && Is.definedString(t[r].domElementId) && t[r].domElementId === e) {
                            c(r);
                            n = true;
                            break;
                        }
                    }
                }
            }
            return n;
        },
        cancelWatches: function() {
            l();
            return d;
        },
        getWatch: function(e) {
            let n = null;
            if (Is.definedString(e)) {
                if (t.hasOwnProperty(e)) {
                    n = t[e];
                } else {
                    for (let r in t) {
                        if (t.hasOwnProperty(r) && Is.definedString(t[r].domElementId) && t[r].domElementId === e) {
                            n = t[r];
                            break;
                        }
                    }
                }
            }
            return n;
        },
        getWatches: function() {
            return t;
        },
        pauseWatch: function(e, n) {
            let r = false;
            if (Is.definedString(e) && Is.definedNumber(n)) {
                if (t.hasOwnProperty(e)) {
                    r = g(e, n);
                } else {
                    for (let o in t) {
                        if (t.hasOwnProperty(o) && Is.definedString(t[o].domElementId) && t[o].domElementId === e) {
                            r = g(o, n);
                            break;
                        }
                    }
                }
            }
            return r;
        },
        pauseWatches: function(e) {
            if (Is.definedNumber(e)) {
                for (let n in t) {
                    if (t.hasOwnProperty(n)) {
                        g(n, e);
                    }
                }
            }
            return d;
        },
        resumeWatch: function(e) {
            let n = false;
            if (Is.definedString(e)) {
                if (t.hasOwnProperty(e)) {
                    t[e].options.starts = null;
                    n = true;
                } else {
                    for (let r in t) {
                        if (t.hasOwnProperty(r) && Is.definedString(t[r].domElementId) && t[r].domElementId === e) {
                            t[r].options.starts = null;
                            n = true;
                            break;
                        }
                    }
                }
            }
            return n;
        },
        resumeWatches: function() {
            for (let e in t) {
                if (t.hasOwnProperty(e)) {
                    t[e].options.starts = null;
                }
            }
            return d;
        },
        searchDomForNewWatches: function() {
            r();
            return d;
        },
        setConfiguration: function(t) {
            if (Is.definedObject(t)) {
                let n = false;
                const r = e;
                for (let o in t) {
                    if (t.hasOwnProperty(o) && e.hasOwnProperty(o) && r[o] !== t[o]) {
                        r[o] = t[o];
                        n = true;
                    }
                }
                if (n) {
                    e = Config.Options.get(r);
                }
            }
            return d;
        },
        getVersion: function() {
            return "1.1.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => r()));
        window.addEventListener("pagehide", (() => {
            n = true;
            l();
        }));
        if (!Is.defined(window.$observe)) {
            window.$observe = d;
        }
    })();
})();//# sourceMappingURL=observe.esm.js.map