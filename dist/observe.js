/*! Observe.js v0.6.1 | (c) Bunoon 2024 | MIT License */
(function() {
  function I() {
    for (var a = q.domElementTypes, b = a.length, c = 0; c < b; c++) {
      var f = y.getElementsByTagName(a[c]);
      f = [].slice.call(f);
      for (var k = f.length, h = 0; h < k; h++) {
        var l = f[h], e = !0;
        if (r(l) && l.hasAttribute("data-observe-watch-options")) {
          var g = l.getAttribute("data-observe-watch-options");
          p(g) ? (g = A(g), g.parsed && t(g.result) ? (g = J(g.result), p(l.id) || (l.id = K()), l.removeAttribute("data-observe-watch-options"), L(l, g, l.id)) : q.safeMode || (console.error("The attribute 'data-observe-watch-options' is not a valid object."), e = !1)) : q.safeMode || (console.error("The attribute 'data-observe-watch-options' has not been set correctly."), e = !1);
        }
        if (!e) {
          break;
        }
      }
    }
  }
  function L(a, b, c) {
    var f = null;
    if (t(a)) {
      f = K();
      var k = J(b);
      b = {};
      b.options = k;
      b.totalChanges = 0;
      p(c) ? (a = y.getElementById(c), r(a) && (b.domElementId = c, b.cachedObject = a.outerHTML, b.originalObject = a.outerHTML)) : (b.cachedObject = JSON.stringify(a), b.originalObject = a);
      b.timer = setInterval(function() {
        var h = f, l = new Date();
        if (!B(k.starts) || l >= k.starts) {
          if (d.hasOwnProperty(h)) {
            var e = d[h], g = p(e.domElementId), m = null;
            g && (m = y.getElementById(e.domElementId), r(m) ? e.originalObject = m.outerHTML : (e.originalObject = C.empty, u(e.options.onRemove, e.domElementId)));
            var v = e.cachedObject, n = e.originalObject;
            n = g ? n : JSON.stringify(n);
            if (v !== n) {
              e.options.reset ? g ? m.outerHTML = e.cachedObject : e.originalObject = A(v).result : e.cachedObject = n;
              if (g) {
                u(e.options.onChange, v, n);
              } else {
                if (g = A(v).result, m = A(n).result, w(g) || w(m)) {
                  u(e.options.onChange, g, m);
                } else {
                  if (w(e.options.propertyNames)) {
                    for (v = e.options.propertyNames.length, n = 0; n < v; n++) {
                      var M = e.options.propertyNames[n];
                      if (g[M] !== m[M]) {
                        u(e.options.onChange, g, m);
                        break;
                      }
                    }
                  } else {
                    u(e.options.onChange, g, m);
                  }
                  D(e.options.onPropertyChange) && N(g, m, e);
                }
              }
              e.totalChanges++;
              0 < e.options.pauseTimeoutOnChange && E(h, e.options.pauseTimeoutOnChange);
              e.options.cancelOnChange && x(h);
              0 < e.options.maximumChangesBeforeCanceling && e.totalChanges >= e.options.maximumChangesBeforeCanceling && x(h);
            }
          }
          B(k.expires) && l >= k.expires && x(h);
        }
      }, k.timeout);
      d[f] = b;
    }
    return f;
  }
  function N(a, b, c) {
    for (var f in a) {
      if (a.hasOwnProperty(f)) {
        var k = a[f], h = null;
        b.hasOwnProperty(f) && (h = b[f]);
        t(k) && t(h) ? N(k, h, c.options) : (!w(c.options.propertyNames) || -1 < c.options.propertyNames.indexOf(f)) && JSON.stringify(k) !== JSON.stringify(h) && u(c.options.onPropertyChange, f, k, h);
      }
    }
  }
  function O() {
    for (var a in d) {
      d.hasOwnProperty(a) && x(a);
    }
  }
  function x(a) {
    if (d.hasOwnProperty(a)) {
      var b = d[a].options;
      if (b.allowCanceling || P) {
        u(b.onCancel, a), clearTimeout(d[a].timer), delete d[a];
      }
    }
  }
  function E(a, b) {
    var c = !1;
    if (d.hasOwnProperty(a)) {
      var f = d[a].options;
      f.allowPausing && (f.starts = new Date(), f.starts.setMilliseconds(f.starts.getMilliseconds() + b), c = !0);
    }
    return c;
  }
  function J(a) {
    a = t(a) ? a : {};
    a.timeout = H(a.timeout, 250);
    var b = a;
    var c = a.starts;
    c = B(c) ? c : null;
    b.starts = c;
    b = a;
    c = a.expires;
    c = B(c) ? c : null;
    b.expires = c;
    a.reset = z(a.reset, !1);
    a.cancelOnChange = z(a.cancelOnChange, !1);
    a.maximumChangesBeforeCanceling = H(a.maximumChangesBeforeCanceling, 0);
    a.pauseTimeoutOnChange = H(a.pauseTimeoutOnChange, 0);
    b = a;
    c = a.propertyNames;
    c = w(c) ? c : null;
    b.propertyNames = c;
    a.allowCanceling = z(a.allowCanceling, !0);
    a.allowPausing = z(a.allowPausing, !0);
    a.onChange = F(a.onChange, null);
    a.onPropertyChange = F(a.onPropertyChange, null);
    a.onCancel = F(a.onCancel, null);
    a.onRemove = F(a.onRemove, null);
    return a;
  }
  function u(a) {
    D(a) && a.apply(null, [].slice.call(arguments, 1));
  }
  function K() {
    for (var a = [], b = 0; 32 > b; b++) {
      8 !== b && 12 !== b && 16 !== b && 20 !== b || a.push("-");
      var c = Math.floor(16 * Math.random()).toString(16);
      a.push(c);
    }
    return a.join(C.empty);
  }
  function r(a) {
    return null !== a && void 0 !== a && a !== C.empty;
  }
  function t(a) {
    return r(a) && "object" === typeof a;
  }
  function p(a) {
    return r(a) && "string" === typeof a;
  }
  function D(a) {
    return r(a) && "function" === typeof a;
  }
  function w(a) {
    return t(a) && a instanceof Array;
  }
  function B(a) {
    return t(a) && a instanceof Date;
  }
  function z(a, b) {
    return r(a) && "boolean" === typeof a ? a : b;
  }
  function F(a, b) {
    return D(a) ? a : b;
  }
  function H(a, b) {
    return r(a) && "number" === typeof a ? a : b;
  }
  function A(a) {
    var b = !0, c = null;
    try {
      p(a) && (c = JSON.parse(a));
    } catch (f) {
      try {
        c = eval("(" + a + ")"), D(c) && (c = c());
      } catch (k) {
        b = R("Errors in object: " + f.message + ", " + k.message), c = null;
      }
    }
    return {parsed:b, result:c};
  }
  function R(a) {
    var b = !0;
    q.safeMode || (console.error(a), b = !1);
    return b;
  }
  function Q() {
    q.safeMode = z(q.safeMode, !0);
    var a = q, b = q.domElementTypes, c = ["*"];
    p(b) ? (b = b.split(C.space), 0 === b.length && (b = c)) : b = w(b) ? b : c;
    a.domElementTypes = b;
  }
  var y = null, G = null, C = {empty:""}, d = {}, P = !1, q = {};
  this.watch = function(a, b) {
    return L(a, b);
  };
  this.cancelWatch = function(a) {
    var b = !1;
    if (d.hasOwnProperty(a)) {
      x(a), b = !0;
    } else {
      for (var c in d) {
        if (d.hasOwnProperty(c) && p(d[c].domElementId) && d[c].domElementId === a) {
          x(c);
          b = !0;
          break;
        }
      }
    }
    return b;
  };
  this.cancelWatches = function() {
    O();
    return this;
  };
  this.getWatch = function(a) {
    var b = null;
    if (d.hasOwnProperty(a)) {
      b = d[a];
    } else {
      for (var c in d) {
        if (d.hasOwnProperty(c) && p(d[c].domElementId) && d[c].domElementId === a) {
          b = d[c];
          break;
        }
      }
    }
    return b;
  };
  this.getWatches = function() {
    return d;
  };
  this.pauseWatch = function(a, b) {
    var c = !1;
    if (d.hasOwnProperty(a)) {
      c = E(a, b);
    } else {
      for (var f in d) {
        if (d.hasOwnProperty(f) && p(d[f].domElementId) && d[f].domElementId === a) {
          c = E(f, b);
          break;
        }
      }
    }
    return c;
  };
  this.pauseWatches = function(a) {
    for (var b in d) {
      d.hasOwnProperty(b) && E(b, a);
    }
    return this;
  };
  this.resumeWatch = function(a) {
    var b = !1;
    if (d.hasOwnProperty(a)) {
      d[a].options.starts = null, b = !0;
    } else {
      for (var c in d) {
        if (d.hasOwnProperty(c) && p(d[c].domElementId) && d[c].domElementId === a) {
          d[c].options.starts = null;
          b = !0;
          break;
        }
      }
    }
    return b;
  };
  this.resumeWatches = function() {
    for (var a in d) {
      d.hasOwnProperty(a) && (d[a].options.starts = null);
    }
    return this;
  };
  this.searchDomForNewWatches = function() {
    I();
    return this;
  };
  this.setConfiguration = function(a) {
    q = t(a) ? a : {};
    Q();
    return this;
  };
  this.getVersion = function() {
    return "0.6.1";
  };
  (function(a, b) {
    y = a;
    G = b;
    Q();
    y.addEventListener("DOMContentLoaded", function() {
      I();
    });
    G.addEventListener("unload", function() {
      P = !0;
      O();
    });
    r(G.$observe) || (G.$observe = this);
  })(document, window);
})();