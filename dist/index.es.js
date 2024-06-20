import { reactive as K, ref as Y, onUnmounted as Z } from "vue";
import nt from "axios";
const I = {
  // 在线上（左线）
  line: "line",
  // 在格子中间
  middle: "middle",
  // 格子内随机
  random: "random"
}, O = {
  // 静止的
  static: "static",
  // 缓慢转动着
  slowly: "slowly",
  playing: "playing"
}, G = {
  n: 8,
  radii: 0,
  initialPosition: I.middle,
  defaultStatus: O.static,
  duration: 3e3,
  roundDurationSlowly: 5e4
}, pt = (p) => {
  let y, S;
  const b = K({
    itemList: [],
    itemMaxWidth: 0,
    lineList: [],
    status: O.static,
    panStyle: "",
    panStyleSlowly: ""
  }), d = () => {
    b.status !== O.playing && (y.defaultStatus === O.slowly ? b.panStyleSlowly = `animation:fanZhuanpanSlowly ${y.roundDurationSlowly}ms linear infinite` : b.panStyleSlowly = "");
  }, u = (a) => {
    if (b.status === O.playing)
      throw new Error("抽奖转动过程中不允许修改配置项");
    y = { ...y, ...a }, y.defaultStatus !== O.static && y.defaultStatus !== O.slowly && (y.defaultStatus = O.static), b.status = y.defaultStatus, t(), d();
  }, o = (a) => {
    const C = a / 180 * Math.PI;
    return 2 * y.radii * Math.sin(C / 2);
  }, t = () => {
    S = 360 / y.n;
    const a = new Array(y.n).fill(0), C = [];
    b.itemList = a.map((x, _) => {
      const T = {
        offsetDeg: y.initialPosition === I.line ? S * _ + S / 2 : S * _
        // 渲染时相对Y轴旋转的角度
      };
      return C.push({
        offsetDeg: T.offsetDeg + S / 2
      }), T;
    }), b.lineList = C, b.itemMaxWidth = o(S);
  };
  (() => {
    u({ ...G, ...p });
  })();
  let e = !0;
  const s = () => {
    b.panStyle = "", d(), e = !0;
  };
  let f, g;
  const m = () => {
    b.status = y.defaultStatus;
  }, r = (a) => new Promise((C, x) => {
    if (b.status === O.playing)
      return x(new Error("请等待上一条完成之后再试"));
    if (!e) {
      s(), setTimeout(() => {
        C(r(a));
      }, 300);
      return;
    }
    e = !1, b.status = O.playing;
    let _ = 360 * (y.duration * 10 / G.duration) - a.index * S + (y.initialPosition === I.line ? 0 : S / 2) - (y.endPosition === I.middle ? S / 2 : Math.min(S * 0.8, Math.max(S * 0.2, S * Math.random())));
    b.panStyle = `transition:transform ${y.duration}ms;transform:rotate(${_}deg)`, b.panStyleSlowly !== "" && setTimeout(() => {
      b.panStyleSlowly = "";
    }, y.duration / 2), y.useElementEvent ? (f = C, g = a) : setTimeout(() => {
      C(a), m();
    }, y.duration);
  });
  return { state: b, ZhuanpanStatus: O, ZhuanpanPosition: I, setOptions: u, play: r, reset: s, onPanEnd: () => {
    y.useElementEvent && f && (f(g), f = null, g = null, m());
  } };
}, z = (p) => {
  const y = Y(!0), S = window.requestAnimationFrame, b = window.cancelAnimationFrame;
  return { rafReadyStatus: y, raf: S, cancelRaf: b, onRafReady: (u) => S(u) };
}, ot = (p, ...y) => {
  console.warn("FanUse:", p, ...y);
}, gt = (p) => {
  const { initialValue: y, canvasSelector: S, mp: b, ...d } = p || {}, { raf: u, cancelRaf: o } = z(), t = {
    duration: 800,
    interval: 20,
    minStep: 1,
    decimal: 0
  }, n = Y(Number(y) || 0), e = (x) => {
    var _;
    Object.assign(t, {
      ...x,
      decimal: typeof x.decimal < "u" ? x.decimal : typeof x.minStep < "u" ? ((_ = x.minStep.toString().split(".")[1]) == null ? void 0 : _.length) || 0 : t.decimal
    });
  };
  e(d);
  let s = 0, f = 0, g = 0, m = 0, r = null;
  const i = () => {
    r && (o(r), r = null);
  }, a = () => {
    i(), r = u(() => {
      r = null;
      const x = Date.now(), _ = n.value, A = Math.ceil((x - s) / t.interval);
      let T = Number((f + m * A).toFixed(t.decimal));
      T = m < 0 ? Math.max(g, T) : Math.min(g, T), _ !== T && (n.value = T, p != null && p.onChange && p.onChange(T)), n.value !== g ? a() : p != null && p.onFinish && p.onFinish();
    });
  }, C = (x) => {
    const { value: _, ...A } = x, T = Number(_);
    if (isNaN(T)) {
      ot("countTo..", "请传入合法的value");
      return;
    }
    T !== n.value && (e(A), f = n.value, g = T, s = Date.now(), m = (g - n.value) / Math.ceil(t.duration / t.interval), m = m < 0 ? Math.min(-Math.abs(t.minStep), m) : Math.max(Math.abs(t.minStep), m), a());
  };
  return Z(() => i()), { countValue: n, countTo: C };
}, ht = (p) => {
  const { canvasSelector: y, mp: S, ...b } = p || {}, { raf: d, cancelRaf: u } = z(), o = {
    time: 0,
    millisecond: !1
  }, t = (x) => {
    Object.assign(o, x);
  };
  t(b);
  let n = b.time;
  const e = K({
    time: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }), s = (x, _) => {
    let A = !0;
    if (o.millisecond ? A = x !== e.time : A = Math.floor(x / 1e3) !== Math.floor(e.time / 1e3), !A)
      return;
    const T = 1e3, L = T * 60, j = L * 60, R = j * 24;
    let M = Math.max(0, x);
    const D = Math.floor(M / R);
    M -= R * D;
    const W = Math.floor(M / j);
    M -= j * W;
    const q = Math.floor(M / L);
    M -= L * q;
    const k = Math.floor(M / T), H = M - T * k;
    Object.assign(e, { time: M, days: D, hours: W, minutes: q, seconds: k, milliseconds: H }), !_ && o.onChange && o.onChange({ ...e });
  };
  s(o.time, !0);
  let f = 0, g = null;
  const m = () => {
    g && (u(g), g = null);
  }, r = () => {
    if (m(), e.time <= 0) {
      f = 0;
      return;
    }
    g = d(() => {
      g = null, s(o.time - (Date.now() - f)), e.time > 0 ? r() : o.onFinish && o.onFinish();
    });
  }, i = () => {
    f || (f = Date.now(), r());
  }, a = () => {
    m(), o.time = e.time, f = 0;
  }, C = (x) => {
    a(), f = 0, t({ time: typeof (x == null ? void 0 : x.time) > "u" ? n : x.time, ...x }), n = o.time, s(o.time);
  };
  return Z(() => m()), { current: e, start: i, pause: a, reset: C };
};
class N extends Error {
  status;
  customCode;
  config;
  constructor(y) {
    const S = typeof y == "object" ? y : { message: y };
    super(S.message), this.status = S.status, this.customCode = S.customCode, this.config = S.config;
  }
}
var rt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, it = { exports: {} };
/*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */
(function(p, y) {
  (function(b, d) {
    p.exports = d();
  })(rt, function() {
    return (
      /******/
      function() {
        var S = {
          /***/
          686: (
            /***/
            function(u, o, t) {
              t.d(o, {
                default: function() {
                  return (
                    /* binding */
                    et
                  );
                }
              });
              var n = t(279), e = /* @__PURE__ */ t.n(n), s = t(370), f = /* @__PURE__ */ t.n(s), g = t(817), m = /* @__PURE__ */ t.n(g);
              function r(w) {
                try {
                  return document.execCommand(w);
                } catch {
                  return !1;
                }
              }
              var i = function(l) {
                var c = m()(l);
                return r("cut"), c;
              }, a = i;
              function C(w) {
                var l = document.documentElement.getAttribute("dir") === "rtl", c = document.createElement("textarea");
                c.style.fontSize = "12pt", c.style.border = "0", c.style.padding = "0", c.style.margin = "0", c.style.position = "absolute", c.style[l ? "right" : "left"] = "-9999px";
                var h = window.pageYOffset || document.documentElement.scrollTop;
                return c.style.top = "".concat(h, "px"), c.setAttribute("readonly", ""), c.value = w, c;
              }
              var x = function(l, c) {
                var h = C(l);
                c.container.appendChild(h);
                var v = m()(h);
                return r("copy"), h.remove(), v;
              }, _ = function(l) {
                var c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                  container: document.body
                }, h = "";
                return typeof l == "string" ? h = x(l, c) : l instanceof HTMLInputElement && !["text", "search", "url", "tel", "password"].includes(l == null ? void 0 : l.type) ? h = x(l.value, c) : (h = m()(l), r("copy")), h;
              }, A = _;
              function T(w) {
                "@babel/helpers - typeof";
                return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? T = function(c) {
                  return typeof c;
                } : T = function(c) {
                  return c && typeof Symbol == "function" && c.constructor === Symbol && c !== Symbol.prototype ? "symbol" : typeof c;
                }, T(w);
              }
              var L = function() {
                var l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, c = l.action, h = c === void 0 ? "copy" : c, v = l.container, E = l.target, P = l.text;
                if (h !== "copy" && h !== "cut")
                  throw new Error('Invalid "action" value, use either "copy" or "cut"');
                if (E !== void 0)
                  if (E && T(E) === "object" && E.nodeType === 1) {
                    if (h === "copy" && E.hasAttribute("disabled"))
                      throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                    if (h === "cut" && (E.hasAttribute("readonly") || E.hasAttribute("disabled")))
                      throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`);
                  } else
                    throw new Error('Invalid "target" value, use a valid Element');
                if (P)
                  return A(P, {
                    container: v
                  });
                if (E)
                  return h === "cut" ? a(E) : A(E, {
                    container: v
                  });
              }, j = L;
              function R(w) {
                "@babel/helpers - typeof";
                return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? R = function(c) {
                  return typeof c;
                } : R = function(c) {
                  return c && typeof Symbol == "function" && c.constructor === Symbol && c !== Symbol.prototype ? "symbol" : typeof c;
                }, R(w);
              }
              function M(w, l) {
                if (!(w instanceof l))
                  throw new TypeError("Cannot call a class as a function");
              }
              function D(w, l) {
                for (var c = 0; c < l.length; c++) {
                  var h = l[c];
                  h.enumerable = h.enumerable || !1, h.configurable = !0, "value" in h && (h.writable = !0), Object.defineProperty(w, h.key, h);
                }
              }
              function W(w, l, c) {
                return l && D(w.prototype, l), c && D(w, c), w;
              }
              function q(w, l) {
                if (typeof l != "function" && l !== null)
                  throw new TypeError("Super expression must either be null or a function");
                w.prototype = Object.create(l && l.prototype, { constructor: { value: w, writable: !0, configurable: !0 } }), l && k(w, l);
              }
              function k(w, l) {
                return k = Object.setPrototypeOf || function(h, v) {
                  return h.__proto__ = v, h;
                }, k(w, l);
              }
              function H(w) {
                var l = Q();
                return function() {
                  var h = F(w), v;
                  if (l) {
                    var E = F(this).constructor;
                    v = Reflect.construct(h, arguments, E);
                  } else
                    v = h.apply(this, arguments);
                  return B(this, v);
                };
              }
              function B(w, l) {
                return l && (R(l) === "object" || typeof l == "function") ? l : X(w);
              }
              function X(w) {
                if (w === void 0)
                  throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return w;
              }
              function Q() {
                if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
                  return !1;
                if (typeof Proxy == "function")
                  return !0;
                try {
                  return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
                  })), !0;
                } catch {
                  return !1;
                }
              }
              function F(w) {
                return F = Object.setPrototypeOf ? Object.getPrototypeOf : function(c) {
                  return c.__proto__ || Object.getPrototypeOf(c);
                }, F(w);
              }
              function V(w, l) {
                var c = "data-clipboard-".concat(w);
                if (l.hasAttribute(c))
                  return l.getAttribute(c);
              }
              var tt = /* @__PURE__ */ function(w) {
                q(c, w);
                var l = H(c);
                function c(h, v) {
                  var E;
                  return M(this, c), E = l.call(this), E.resolveOptions(v), E.listenClick(h), E;
                }
                return W(c, [{
                  key: "resolveOptions",
                  value: function() {
                    var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                    this.action = typeof v.action == "function" ? v.action : this.defaultAction, this.target = typeof v.target == "function" ? v.target : this.defaultTarget, this.text = typeof v.text == "function" ? v.text : this.defaultText, this.container = R(v.container) === "object" ? v.container : document.body;
                  }
                  /**
                   * Adds a click event listener to the passed trigger.
                   * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
                   */
                }, {
                  key: "listenClick",
                  value: function(v) {
                    var E = this;
                    this.listener = f()(v, "click", function(P) {
                      return E.onClick(P);
                    });
                  }
                  /**
                   * Defines a new `ClipboardAction` on each click event.
                   * @param {Event} e
                   */
                }, {
                  key: "onClick",
                  value: function(v) {
                    var E = v.delegateTarget || v.currentTarget, P = this.action(E) || "copy", U = j({
                      action: P,
                      container: this.container,
                      target: this.target(E),
                      text: this.text(E)
                    });
                    this.emit(U ? "success" : "error", {
                      action: P,
                      text: U,
                      trigger: E,
                      clearSelection: function() {
                        E && E.focus(), window.getSelection().removeAllRanges();
                      }
                    });
                  }
                  /**
                   * Default `action` lookup function.
                   * @param {Element} trigger
                   */
                }, {
                  key: "defaultAction",
                  value: function(v) {
                    return V("action", v);
                  }
                  /**
                   * Default `target` lookup function.
                   * @param {Element} trigger
                   */
                }, {
                  key: "defaultTarget",
                  value: function(v) {
                    var E = V("target", v);
                    if (E)
                      return document.querySelector(E);
                  }
                  /**
                   * Allow fire programmatically a copy action
                   * @param {String|HTMLElement} target
                   * @param {Object} options
                   * @returns Text copied.
                   */
                }, {
                  key: "defaultText",
                  /**
                   * Default `text` lookup function.
                   * @param {Element} trigger
                   */
                  value: function(v) {
                    return V("text", v);
                  }
                  /**
                   * Destroy lifecycle.
                   */
                }, {
                  key: "destroy",
                  value: function() {
                    this.listener.destroy();
                  }
                }], [{
                  key: "copy",
                  value: function(v) {
                    var E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                      container: document.body
                    };
                    return A(v, E);
                  }
                  /**
                   * Allow fire programmatically a cut action
                   * @param {String|HTMLElement} target
                   * @returns Text cutted.
                   */
                }, {
                  key: "cut",
                  value: function(v) {
                    return a(v);
                  }
                  /**
                   * Returns the support of the given action, or all actions if no action is
                   * given.
                   * @param {String} [action]
                   */
                }, {
                  key: "isSupported",
                  value: function() {
                    var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["copy", "cut"], E = typeof v == "string" ? [v] : v, P = !!document.queryCommandSupported;
                    return E.forEach(function(U) {
                      P = P && !!document.queryCommandSupported(U);
                    }), P;
                  }
                }]), c;
              }(e()), et = tt;
            }
          ),
          /***/
          828: (
            /***/
            function(u) {
              var o = 9;
              if (typeof Element < "u" && !Element.prototype.matches) {
                var t = Element.prototype;
                t.matches = t.matchesSelector || t.mozMatchesSelector || t.msMatchesSelector || t.oMatchesSelector || t.webkitMatchesSelector;
              }
              function n(e, s) {
                for (; e && e.nodeType !== o; ) {
                  if (typeof e.matches == "function" && e.matches(s))
                    return e;
                  e = e.parentNode;
                }
              }
              u.exports = n;
            }
          ),
          /***/
          438: (
            /***/
            function(u, o, t) {
              var n = t(828);
              function e(g, m, r, i, a) {
                var C = f.apply(this, arguments);
                return g.addEventListener(r, C, a), {
                  destroy: function() {
                    g.removeEventListener(r, C, a);
                  }
                };
              }
              function s(g, m, r, i, a) {
                return typeof g.addEventListener == "function" ? e.apply(null, arguments) : typeof r == "function" ? e.bind(null, document).apply(null, arguments) : (typeof g == "string" && (g = document.querySelectorAll(g)), Array.prototype.map.call(g, function(C) {
                  return e(C, m, r, i, a);
                }));
              }
              function f(g, m, r, i) {
                return function(a) {
                  a.delegateTarget = n(a.target, m), a.delegateTarget && i.call(g, a);
                };
              }
              u.exports = s;
            }
          ),
          /***/
          879: (
            /***/
            function(u, o) {
              o.node = function(t) {
                return t !== void 0 && t instanceof HTMLElement && t.nodeType === 1;
              }, o.nodeList = function(t) {
                var n = Object.prototype.toString.call(t);
                return t !== void 0 && (n === "[object NodeList]" || n === "[object HTMLCollection]") && "length" in t && (t.length === 0 || o.node(t[0]));
              }, o.string = function(t) {
                return typeof t == "string" || t instanceof String;
              }, o.fn = function(t) {
                var n = Object.prototype.toString.call(t);
                return n === "[object Function]";
              };
            }
          ),
          /***/
          370: (
            /***/
            function(u, o, t) {
              var n = t(879), e = t(438);
              function s(r, i, a) {
                if (!r && !i && !a)
                  throw new Error("Missing required arguments");
                if (!n.string(i))
                  throw new TypeError("Second argument must be a String");
                if (!n.fn(a))
                  throw new TypeError("Third argument must be a Function");
                if (n.node(r))
                  return f(r, i, a);
                if (n.nodeList(r))
                  return g(r, i, a);
                if (n.string(r))
                  return m(r, i, a);
                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
              }
              function f(r, i, a) {
                return r.addEventListener(i, a), {
                  destroy: function() {
                    r.removeEventListener(i, a);
                  }
                };
              }
              function g(r, i, a) {
                return Array.prototype.forEach.call(r, function(C) {
                  C.addEventListener(i, a);
                }), {
                  destroy: function() {
                    Array.prototype.forEach.call(r, function(C) {
                      C.removeEventListener(i, a);
                    });
                  }
                };
              }
              function m(r, i, a) {
                return e(document.body, r, i, a);
              }
              u.exports = s;
            }
          ),
          /***/
          817: (
            /***/
            function(u) {
              function o(t) {
                var n;
                if (t.nodeName === "SELECT")
                  t.focus(), n = t.value;
                else if (t.nodeName === "INPUT" || t.nodeName === "TEXTAREA") {
                  var e = t.hasAttribute("readonly");
                  e || t.setAttribute("readonly", ""), t.select(), t.setSelectionRange(0, t.value.length), e || t.removeAttribute("readonly"), n = t.value;
                } else {
                  t.hasAttribute("contenteditable") && t.focus();
                  var s = window.getSelection(), f = document.createRange();
                  f.selectNodeContents(t), s.removeAllRanges(), s.addRange(f), n = s.toString();
                }
                return n;
              }
              u.exports = o;
            }
          ),
          /***/
          279: (
            /***/
            function(u) {
              function o() {
              }
              o.prototype = {
                on: function(t, n, e) {
                  var s = this.e || (this.e = {});
                  return (s[t] || (s[t] = [])).push({
                    fn: n,
                    ctx: e
                  }), this;
                },
                once: function(t, n, e) {
                  var s = this;
                  function f() {
                    s.off(t, f), n.apply(e, arguments);
                  }
                  return f._ = n, this.on(t, f, e);
                },
                emit: function(t) {
                  var n = [].slice.call(arguments, 1), e = ((this.e || (this.e = {}))[t] || []).slice(), s = 0, f = e.length;
                  for (s; s < f; s++)
                    e[s].fn.apply(e[s].ctx, n);
                  return this;
                },
                off: function(t, n) {
                  var e = this.e || (this.e = {}), s = e[t], f = [];
                  if (s && n)
                    for (var g = 0, m = s.length; g < m; g++)
                      s[g].fn !== n && s[g].fn._ !== n && f.push(s[g]);
                  return f.length ? e[t] = f : delete e[t], this;
                }
              }, u.exports = o, u.exports.TinyEmitter = o;
            }
          )
          /******/
        }, b = {};
        function d(u) {
          if (b[u])
            return b[u].exports;
          var o = b[u] = {
            /******/
            // no module.id needed
            /******/
            // no module.loaded needed
            /******/
            exports: {}
            /******/
          };
          return S[u](o, o.exports, d), o.exports;
        }
        return function() {
          d.n = function(u) {
            var o = u && u.__esModule ? (
              /******/
              function() {
                return u.default;
              }
            ) : (
              /******/
              function() {
                return u;
              }
            );
            return d.d(o, { a: o }), o;
          };
        }(), function() {
          d.d = function(u, o) {
            for (var t in o)
              d.o(o, t) && !d.o(u, t) && Object.defineProperty(u, t, { enumerable: !0, get: o[t] });
          };
        }(), function() {
          d.o = function(u, o) {
            return Object.prototype.hasOwnProperty.call(u, o);
          };
        }(), d(686);
      }().default
    );
  });
})(it);
const $ = typeof window < "u";
function J(p) {
  return p instanceof Promise || typeof (p == null ? void 0 : p.then) == "function";
}
const at = () => {
  if (!$)
    return {};
  const p = navigator.userAgent, y = /macintosh|mac os x/i.test(p), S = /micromessenger/.test(p.toLowerCase());
  return {
    devicePixelRatio: window.devicePixelRatio,
    language: navigator.language,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    statusBarHeight: 0,
    navBarHeight: 0,
    isMac: y,
    isIos: /(iPhone|iPad|iPod|iOS)/i.test(p) || y,
    isWeixin: S,
    isAlipay: /alipay/.test(p.toLowerCase()),
    isMpWebWeixin: S && p.includes("miniProgram")
  };
}, st = (p, y) => new Promise((S, b) => {
  const d = document.createElement("script");
  if (y)
    for (let u in y)
      d.setAttribute(u, y[u]);
  d.src = p, d.onload = S, d.onerror = (u) => {
    document.head.removeChild(d), b(u);
  }, document.head.appendChild(d);
}), ut = () => new Promise(() => null), vt = (p) => {
  const { timeout: y, requestInterceptor: S, responseInterceptor: b, customCodeSet: d, errorInterceptor: u } = p || {}, o = nt.create({
    timeout: y || 6e4,
    // withCredentials: true, // send cookies when cross-domain requests
    validateStatus: () => !0
  }), t = (n) => typeof u == "function" ? Promise.reject(u(n)) : Promise.reject(n);
  return o.interceptors.request.use(
    async (n) => {
      let e = { ...n };
      if (typeof S == "function") {
        let f = S(e);
        J(f) && (f = await f), f && typeof f == "object" && (e = { ...e, ...f });
      }
      const s = ["get", "delete"];
      return (!e.method || s.includes(e.method.toLowerCase()) && e.data && !e.params) && (e.params = e.data), e;
    },
    (n) => {
      const e = `${n.request ? "网络异常，请检查是否有网后再试-" : ""}${n.message || ""}`;
      return t(new N(e));
    }
  ), o.interceptors.response.use(
    async (n) => {
      const { config: e, data: s, status: f, headers: g } = n, { rejectErrorCode: m } = e;
      if (f > 299) {
        let i = "";
        return d != null && d.messageKey && s && typeof s == "object" && (i = s[d.messageKey]), i || (i = `${f > 499 ? "服务忙" : "内部错误"}，请稍候重试...`), t(new N({ message: i, status: f, config: e }));
      }
      let r = s;
      if (typeof b == "function") {
        let i = b({ data: s, status: f, config: e, headers: g });
        if (J(i))
          try {
            i = await i;
          } catch (a) {
            return t(new N({ message: a.message || "系统开小差了", status: f, config: e }));
          }
        typeof i < "u" && (r = i);
      }
      if (!r || typeof r != "object")
        return r;
      if (m !== !1 && d) {
        const i = s[d.key];
        let a = !0;
        if (Array.isArray(d.okValue) ? a = d.okValue.includes(i) : a = i === d.okValue, !a)
          return t(
            new N({ message: s[d.messageKey], status: f, customCode: i, config: e })
          );
      }
      return r;
    },
    (n) => {
      var g;
      if (((g = n.request) == null ? void 0 : g.status) === 0)
        return ut();
      const { status: e, data: s } = n.response || {};
      let f;
      return s && (d != null && d.messageKey) && (f = s[d.messageKey]), t(new N({ message: n.message, status: e, customCode: f, config: n.config }));
    }
  ), { request: o };
}, ct = "fanWxJsSdk", lt = "//res.wx.qq.com/open/js/jweixin-1.6.0.js", ft = (p) => {
  const { configGetter: y, sdkLoadedUrl: S } = p || {};
  let b = "";
  const { isWeixin: d, isIos: u } = at(), o = /* @__PURE__ */ new Map(), t = (m, r) => {
    const i = o.get(m) || [];
    i.push(r), o.set(m, i);
  }, n = (m) => {
    if (!$)
      return;
    const { fn: r, url: i } = m || {}, a = i || window.location.href;
    if (!o.has(a))
      return;
    if (!r) {
      o.delete(a);
      return;
    }
    const C = o.get(a);
    if (!C)
      return;
    const x = C.findIndex((_) => _ === r);
    x !== -1 && (C.splice(x, 1), o.set(a, C));
  }, e = (m) => {
    const r = o.get(m);
    r && (r.forEach((i) => i()), n({ url: m }));
  }, s = () => new Promise((m, r) => {
    window.wx.ready(() => m(!0)), window.wx.error((i) => r(new Error(i.errMsg || i.message || JSON.stringify(i))));
  });
  return { configWeixinJs: async (m) => {
    if (!$ || !d)
      return;
    const r = (m == null ? void 0 : m.configGetter) || y;
    if (!r)
      throw new Error("[configGetter] required");
    const i = window.location.href;
    window.wx || await st(lt, { id: ct });
    const a = r({ url: i }), { config: C, shareData: x } = J(a) ? await a : a;
    let _ = !0;
    if (u && b)
      try {
        await s(), _ = !1;
      } catch {
      }
    _ && (window.wx.config(C), await s()), b = i, x && (window.wx.updateTimelineShareData(x), window.wx.updateAppMessageShareData(x)), e(i);
  }, onConfigReady: async (m, r) => {
    if (!$)
      return;
    const i = (r == null ? void 0 : r.url) || window.location.href;
    try {
      if (u)
        await s();
      else if (i !== b)
        throw new Error("Need wx.config");
      m();
    } catch {
      t(i, m);
    }
  }, removeReadyCallback: n };
}, wt = (p) => (window.fanWeixinSdk || (window.fanWeixinSdk = ft(p)), window.fanWeixinSdk), bt = () => {
  let p;
  const y = (d, u, o) => {
    let t = `${u.top || 0}px ${u.right || 0}px ${u.bottom || 0}px ${u.right || 0}px`;
    p = new IntersectionObserver(
      (n) => {
        n.forEach((e) => {
          var s;
          e.isIntersecting && u.callback && u.callback({ ...(s = e.target) == null ? void 0 : s.dataset });
        });
      },
      { root: o, rootMargin: t }
    ), d.forEach((n) => p.observe(n));
  };
  return { observer: async (d) => {
    let u;
    d.root && (u = document.querySelectorAll(d.root)[0]);
    const o = document.querySelectorAll(d.selector);
    o && o.length && y(o, d, u);
  }, disconnect: () => {
    p && p.disconnect();
  } };
};
export {
  N as RequestError,
  I as ZhuanpanPosition,
  O as ZhuanpanStatus,
  ht as useCountDown,
  gt as useCountTo,
  bt as useIntersectionObserver,
  vt as useRequest,
  z as useRequestAnimationFrame,
  wt as useWeixinJsConfig,
  pt as useZhuanpan
};
