import { reactive as Z, ref as z, getCurrentInstance as K, onMounted as rt, onUnmounted as B } from "vue";
const j = {
  // 在线上（左线）
  line: "line",
  // 在格子中间
  middle: "middle",
  // 格子内随机
  random: "random"
}, R = {
  // 静止的
  static: "static",
  // 缓慢转动着
  slowly: "slowly",
  playing: "playing"
}, W = {
  n: 8,
  radii: 0,
  initialPosition: j.middle,
  defaultStatus: R.static,
  duration: 3e3,
  roundDurationSlowly: 5e4
}, ut = (u) => {
  let p, b;
  const f = Z({
    itemList: [],
    itemMaxWidth: 0,
    lineList: [],
    status: R.static,
    panStyle: "",
    panStyleSlowly: ""
  }), S = () => {
    f.status !== R.playing && (p.defaultStatus === R.slowly ? f.panStyleSlowly = `animation:fanZhuanpanSlowly ${p.roundDurationSlowly}ms linear infinite` : f.panStyleSlowly = "");
  }, d = (s) => {
    if (f.status === R.playing)
      throw new Error("抽奖转动过程中不允许修改配置项");
    p = { ...p, ...s }, p.defaultStatus !== R.static && p.defaultStatus !== R.slowly && (p.defaultStatus = R.static), f.status = p.defaultStatus, t(), S();
  }, a = (s) => {
    const x = s / 180 * Math.PI;
    return 2 * p.radii * Math.sin(x / 2);
  }, t = () => {
    b = 360 / p.n;
    const s = new Array(p.n).fill(0), x = [];
    f.itemList = s.map((T, _) => {
      const C = {
        offsetDeg: p.initialPosition === j.line ? b * _ + b / 2 : b * _
        // 渲染时相对Y轴旋转的角度
      };
      return x.push({
        offsetDeg: C.offsetDeg + b / 2
      }), C;
    }), f.lineList = x, f.itemMaxWidth = a(b);
  };
  (() => {
    d({ ...W, ...u });
  })();
  let n = !0;
  const e = () => {
    f.panStyle = "", S(), n = !0;
  };
  let l, v;
  const E = () => {
    f.status = p.defaultStatus;
  }, c = (s) => new Promise((x, T) => {
    if (f.status === R.playing)
      return T(new Error("请等待上一条完成之后再试"));
    if (!n) {
      e(), setTimeout(() => {
        x(c(s));
      }, 300);
      return;
    }
    n = !1, f.status = R.playing;
    let _ = 360 * (p.duration * 10 / W.duration) - s.index * b + (p.initialPosition === j.line ? 0 : b / 2) - (p.endPosition === j.middle ? b / 2 : Math.min(b * 0.8, Math.max(b * 0.2, b * Math.random())));
    f.panStyle = `transition:transform ${p.duration}ms;transform:rotate(${_}deg)`, f.panStyleSlowly !== "" && setTimeout(() => {
      f.panStyleSlowly = "";
    }, p.duration / 2), p.useElementEvent ? (l = x, v = s) : setTimeout(() => {
      x(s), E();
    }, p.duration);
  });
  return { state: f, ZhuanpanStatus: R, ZhuanpanPosition: j, setOptions: d, play: c, reset: e, onPanEnd: () => {
    p.useElementEvent && l && (l(v), l = null, v = null, E());
  } };
}, G = (u, ...p) => {
  console.warn("FanUse:", u, ...p);
}, J = (u) => {
  let p;
  const b = (u == null ? void 0 : u.mp) !== !1, f = z(!b || !(u != null && u.canvasSelector)), S = (e) => setTimeout(e, 16.666666666666668, Date.now()), d = (e) => b ? u != null && u.canvasSelector ? p.requestAnimationFrame(e) : S(e) : window.requestAnimationFrame(e), a = (e) => b ? u != null && u.canvasSelector ? p.cancelAnimationFrame(e) : clearTimeout(e) : window.cancelAnimationFrame(e), t = [], r = (e) => {
    if (!b || f.value) {
      e();
      return;
    }
    t.push(e);
  }, n = K();
  return rt(() => {
    u != null && u.canvasSelector && uni.createSelectorQuery().in(n).select(u.canvasSelector).fields({ node: !0 }, (e) => {
      if ((e == null ? void 0 : e.nodeCanvasType) !== "2d" || !e.node) {
        G("useRequestAnimationFrame..", "请传入正确的canvasSelector");
        return;
      }
      if (p = e.node, f.value = !0, t.length) {
        for (let l = 0; l < t.length; l++)
          t[l]();
        t.length = 0;
      }
    }).exec();
  }), { rafReadyStatus: f, raf: d, cancelRaf: a, onRafReady: r };
}, ct = (u) => {
  const { initialValue: p, canvasSelector: b, mp: f, ...S } = u || {}, { raf: d, cancelRaf: a } = J({ canvasSelector: b, mp: f }), t = {
    duration: 800,
    interval: 20,
    minStep: 1,
    decimal: 0
  }, r = z(Number(p) || 0), n = (T) => {
    var _;
    Object.assign(t, {
      ...T,
      decimal: typeof T.decimal < "u" ? T.decimal : typeof T.minStep < "u" ? ((_ = T.minStep.toString().split(".")[1]) == null ? void 0 : _.length) || 0 : t.decimal
    });
  };
  n(S);
  let e = 0, l = 0, v = 0, E = 0, c = null;
  const m = () => {
    c && (a(c), c = null);
  }, s = () => {
    m(), c = d(() => {
      c = null;
      const T = Date.now(), _ = r.value, A = Math.ceil((T - e) / t.interval);
      let C = Number((l + E * A).toFixed(t.decimal));
      C = E < 0 ? Math.max(v, C) : Math.min(v, C), _ !== C && (r.value = C, u != null && u.onChange && u.onChange(C)), r.value !== v ? s() : u != null && u.onFinish && u.onFinish();
    });
  }, x = (T) => {
    const { value: _, ...A } = T, C = Number(_);
    if (isNaN(C)) {
      G("countTo..", "请传入合法的value");
      return;
    }
    C !== r.value && (n(A), l = r.value, v = C, e = Date.now(), E = (v - r.value) / Math.ceil(t.duration / t.interval), E = E < 0 ? Math.min(-Math.abs(t.minStep), E) : Math.max(Math.abs(t.minStep), E), s());
  };
  return B(() => m()), { countValue: r, countTo: x };
}, lt = (u) => {
  const { canvasSelector: p, mp: b, ...f } = u || {}, { raf: S, cancelRaf: d } = J({ canvasSelector: p, mp: b }), a = {
    time: 0,
    millisecond: !1
  }, t = (T) => {
    Object.assign(a, T);
  };
  t(f);
  let r = f.time;
  const n = Z({
    time: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }), e = (T, _) => {
    let A = !0;
    if (a.millisecond ? A = T !== n.time : A = Math.floor(T / 1e3) !== Math.floor(n.time / 1e3), !A)
      return;
    const C = 1e3, D = C * 60, N = D * 60, P = N * 24;
    let M = Math.max(0, T);
    const k = Math.floor(M / P);
    M -= P * k;
    const F = Math.floor(M / N);
    M -= N * F;
    const I = Math.floor(M / D);
    M -= D * I;
    const L = Math.floor(M / C), $ = M - C * L;
    Object.assign(n, { time: M, days: k, hours: F, minutes: I, seconds: L, milliseconds: $ }), !_ && a.onChange && a.onChange({ ...n });
  };
  e(a.time, !0);
  let l = 0, v = null;
  const E = () => {
    v && (d(v), v = null);
  }, c = () => {
    if (E(), n.time <= 0) {
      l = 0;
      return;
    }
    v = S(() => {
      v = null, e(a.time - (Date.now() - l)), n.time > 0 ? c() : a.onFinish && a.onFinish();
    });
  }, m = () => {
    l || (l = Date.now(), c());
  }, s = () => {
    E(), a.time = n.time, l = 0;
  }, x = (T) => {
    s(), l = 0, t({ time: typeof (T == null ? void 0 : T.time) > "u" ? r : T.time, ...T }), r = a.time, e(a.time);
  };
  return B(() => E()), { current: n, start: m, pause: s, reset: x };
};
class U extends Error {
  status;
  customCode;
  config;
  constructor(p) {
    const b = typeof p == "object" ? p : { message: p };
    super(b.message), this.status = b.status, this.customCode = b.customCode, this.config = b.config;
  }
}
var ot = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, it = { exports: {} };
/*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */
(function(u, p) {
  (function(f, S) {
    u.exports = S();
  })(ot, function() {
    return (
      /******/
      function() {
        var b = {
          /***/
          686: (
            /***/
            function(d, a, t) {
              t.d(a, {
                default: function() {
                  return (
                    /* binding */
                    nt
                  );
                }
              });
              var r = t(279), n = /* @__PURE__ */ t.n(r), e = t(370), l = /* @__PURE__ */ t.n(e), v = t(817), E = /* @__PURE__ */ t.n(v);
              function c(g) {
                try {
                  return document.execCommand(g);
                } catch {
                  return !1;
                }
              }
              var m = function(i) {
                var o = E()(i);
                return c("cut"), o;
              }, s = m;
              function x(g) {
                var i = document.documentElement.getAttribute("dir") === "rtl", o = document.createElement("textarea");
                o.style.fontSize = "12pt", o.style.border = "0", o.style.padding = "0", o.style.margin = "0", o.style.position = "absolute", o.style[i ? "right" : "left"] = "-9999px";
                var y = window.pageYOffset || document.documentElement.scrollTop;
                return o.style.top = "".concat(y, "px"), o.setAttribute("readonly", ""), o.value = g, o;
              }
              var T = function(i, o) {
                var y = x(i);
                o.container.appendChild(y);
                var h = E()(y);
                return c("copy"), y.remove(), h;
              }, _ = function(i) {
                var o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                  container: document.body
                }, y = "";
                return typeof i == "string" ? y = T(i, o) : i instanceof HTMLInputElement && !["text", "search", "url", "tel", "password"].includes(i == null ? void 0 : i.type) ? y = T(i.value, o) : (y = E()(i), c("copy")), y;
              }, A = _;
              function C(g) {
                "@babel/helpers - typeof";
                return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? C = function(o) {
                  return typeof o;
                } : C = function(o) {
                  return o && typeof Symbol == "function" && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
                }, C(g);
              }
              var D = function() {
                var i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = i.action, y = o === void 0 ? "copy" : o, h = i.container, w = i.target, O = i.text;
                if (y !== "copy" && y !== "cut")
                  throw new Error('Invalid "action" value, use either "copy" or "cut"');
                if (w !== void 0)
                  if (w && C(w) === "object" && w.nodeType === 1) {
                    if (y === "copy" && w.hasAttribute("disabled"))
                      throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                    if (y === "cut" && (w.hasAttribute("readonly") || w.hasAttribute("disabled")))
                      throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`);
                  } else
                    throw new Error('Invalid "target" value, use a valid Element');
                if (O)
                  return A(O, {
                    container: h
                  });
                if (w)
                  return y === "cut" ? s(w) : A(w, {
                    container: h
                  });
              }, N = D;
              function P(g) {
                "@babel/helpers - typeof";
                return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? P = function(o) {
                  return typeof o;
                } : P = function(o) {
                  return o && typeof Symbol == "function" && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
                }, P(g);
              }
              function M(g, i) {
                if (!(g instanceof i))
                  throw new TypeError("Cannot call a class as a function");
              }
              function k(g, i) {
                for (var o = 0; o < i.length; o++) {
                  var y = i[o];
                  y.enumerable = y.enumerable || !1, y.configurable = !0, "value" in y && (y.writable = !0), Object.defineProperty(g, y.key, y);
                }
              }
              function F(g, i, o) {
                return i && k(g.prototype, i), o && k(g, o), g;
              }
              function I(g, i) {
                if (typeof i != "function" && i !== null)
                  throw new TypeError("Super expression must either be null or a function");
                g.prototype = Object.create(i && i.prototype, { constructor: { value: g, writable: !0, configurable: !0 } }), i && L(g, i);
              }
              function L(g, i) {
                return L = Object.setPrototypeOf || function(y, h) {
                  return y.__proto__ = h, y;
                }, L(g, i);
              }
              function $(g) {
                var i = tt();
                return function() {
                  var y = V(g), h;
                  if (i) {
                    var w = V(this).constructor;
                    h = Reflect.construct(y, arguments, w);
                  } else
                    h = y.apply(this, arguments);
                  return Q(this, h);
                };
              }
              function Q(g, i) {
                return i && (P(i) === "object" || typeof i == "function") ? i : X(g);
              }
              function X(g) {
                if (g === void 0)
                  throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return g;
              }
              function tt() {
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
              function V(g) {
                return V = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
                  return o.__proto__ || Object.getPrototypeOf(o);
                }, V(g);
              }
              function H(g, i) {
                var o = "data-clipboard-".concat(g);
                if (i.hasAttribute(o))
                  return i.getAttribute(o);
              }
              var et = /* @__PURE__ */ function(g) {
                I(o, g);
                var i = $(o);
                function o(y, h) {
                  var w;
                  return M(this, o), w = i.call(this), w.resolveOptions(h), w.listenClick(y), w;
                }
                return F(o, [{
                  key: "resolveOptions",
                  value: function() {
                    var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                    this.action = typeof h.action == "function" ? h.action : this.defaultAction, this.target = typeof h.target == "function" ? h.target : this.defaultTarget, this.text = typeof h.text == "function" ? h.text : this.defaultText, this.container = P(h.container) === "object" ? h.container : document.body;
                  }
                  /**
                   * Adds a click event listener to the passed trigger.
                   * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
                   */
                }, {
                  key: "listenClick",
                  value: function(h) {
                    var w = this;
                    this.listener = l()(h, "click", function(O) {
                      return w.onClick(O);
                    });
                  }
                  /**
                   * Defines a new `ClipboardAction` on each click event.
                   * @param {Event} e
                   */
                }, {
                  key: "onClick",
                  value: function(h) {
                    var w = h.delegateTarget || h.currentTarget, O = this.action(w) || "copy", q = N({
                      action: O,
                      container: this.container,
                      target: this.target(w),
                      text: this.text(w)
                    });
                    this.emit(q ? "success" : "error", {
                      action: O,
                      text: q,
                      trigger: w,
                      clearSelection: function() {
                        w && w.focus(), window.getSelection().removeAllRanges();
                      }
                    });
                  }
                  /**
                   * Default `action` lookup function.
                   * @param {Element} trigger
                   */
                }, {
                  key: "defaultAction",
                  value: function(h) {
                    return H("action", h);
                  }
                  /**
                   * Default `target` lookup function.
                   * @param {Element} trigger
                   */
                }, {
                  key: "defaultTarget",
                  value: function(h) {
                    var w = H("target", h);
                    if (w)
                      return document.querySelector(w);
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
                  value: function(h) {
                    return H("text", h);
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
                  value: function(h) {
                    var w = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                      container: document.body
                    };
                    return A(h, w);
                  }
                  /**
                   * Allow fire programmatically a cut action
                   * @param {String|HTMLElement} target
                   * @returns Text cutted.
                   */
                }, {
                  key: "cut",
                  value: function(h) {
                    return s(h);
                  }
                  /**
                   * Returns the support of the given action, or all actions if no action is
                   * given.
                   * @param {String} [action]
                   */
                }, {
                  key: "isSupported",
                  value: function() {
                    var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["copy", "cut"], w = typeof h == "string" ? [h] : h, O = !!document.queryCommandSupported;
                    return w.forEach(function(q) {
                      O = O && !!document.queryCommandSupported(q);
                    }), O;
                  }
                }]), o;
              }(n()), nt = et;
            }
          ),
          /***/
          828: (
            /***/
            function(d) {
              var a = 9;
              if (typeof Element < "u" && !Element.prototype.matches) {
                var t = Element.prototype;
                t.matches = t.matchesSelector || t.mozMatchesSelector || t.msMatchesSelector || t.oMatchesSelector || t.webkitMatchesSelector;
              }
              function r(n, e) {
                for (; n && n.nodeType !== a; ) {
                  if (typeof n.matches == "function" && n.matches(e))
                    return n;
                  n = n.parentNode;
                }
              }
              d.exports = r;
            }
          ),
          /***/
          438: (
            /***/
            function(d, a, t) {
              var r = t(828);
              function n(v, E, c, m, s) {
                var x = l.apply(this, arguments);
                return v.addEventListener(c, x, s), {
                  destroy: function() {
                    v.removeEventListener(c, x, s);
                  }
                };
              }
              function e(v, E, c, m, s) {
                return typeof v.addEventListener == "function" ? n.apply(null, arguments) : typeof c == "function" ? n.bind(null, document).apply(null, arguments) : (typeof v == "string" && (v = document.querySelectorAll(v)), Array.prototype.map.call(v, function(x) {
                  return n(x, E, c, m, s);
                }));
              }
              function l(v, E, c, m) {
                return function(s) {
                  s.delegateTarget = r(s.target, E), s.delegateTarget && m.call(v, s);
                };
              }
              d.exports = e;
            }
          ),
          /***/
          879: (
            /***/
            function(d, a) {
              a.node = function(t) {
                return t !== void 0 && t instanceof HTMLElement && t.nodeType === 1;
              }, a.nodeList = function(t) {
                var r = Object.prototype.toString.call(t);
                return t !== void 0 && (r === "[object NodeList]" || r === "[object HTMLCollection]") && "length" in t && (t.length === 0 || a.node(t[0]));
              }, a.string = function(t) {
                return typeof t == "string" || t instanceof String;
              }, a.fn = function(t) {
                var r = Object.prototype.toString.call(t);
                return r === "[object Function]";
              };
            }
          ),
          /***/
          370: (
            /***/
            function(d, a, t) {
              var r = t(879), n = t(438);
              function e(c, m, s) {
                if (!c && !m && !s)
                  throw new Error("Missing required arguments");
                if (!r.string(m))
                  throw new TypeError("Second argument must be a String");
                if (!r.fn(s))
                  throw new TypeError("Third argument must be a Function");
                if (r.node(c))
                  return l(c, m, s);
                if (r.nodeList(c))
                  return v(c, m, s);
                if (r.string(c))
                  return E(c, m, s);
                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
              }
              function l(c, m, s) {
                return c.addEventListener(m, s), {
                  destroy: function() {
                    c.removeEventListener(m, s);
                  }
                };
              }
              function v(c, m, s) {
                return Array.prototype.forEach.call(c, function(x) {
                  x.addEventListener(m, s);
                }), {
                  destroy: function() {
                    Array.prototype.forEach.call(c, function(x) {
                      x.removeEventListener(m, s);
                    });
                  }
                };
              }
              function E(c, m, s) {
                return n(document.body, c, m, s);
              }
              d.exports = e;
            }
          ),
          /***/
          817: (
            /***/
            function(d) {
              function a(t) {
                var r;
                if (t.nodeName === "SELECT")
                  t.focus(), r = t.value;
                else if (t.nodeName === "INPUT" || t.nodeName === "TEXTAREA") {
                  var n = t.hasAttribute("readonly");
                  n || t.setAttribute("readonly", ""), t.select(), t.setSelectionRange(0, t.value.length), n || t.removeAttribute("readonly"), r = t.value;
                } else {
                  t.hasAttribute("contenteditable") && t.focus();
                  var e = window.getSelection(), l = document.createRange();
                  l.selectNodeContents(t), e.removeAllRanges(), e.addRange(l), r = e.toString();
                }
                return r;
              }
              d.exports = a;
            }
          ),
          /***/
          279: (
            /***/
            function(d) {
              function a() {
              }
              a.prototype = {
                on: function(t, r, n) {
                  var e = this.e || (this.e = {});
                  return (e[t] || (e[t] = [])).push({
                    fn: r,
                    ctx: n
                  }), this;
                },
                once: function(t, r, n) {
                  var e = this;
                  function l() {
                    e.off(t, l), r.apply(n, arguments);
                  }
                  return l._ = r, this.on(t, l, n);
                },
                emit: function(t) {
                  var r = [].slice.call(arguments, 1), n = ((this.e || (this.e = {}))[t] || []).slice(), e = 0, l = n.length;
                  for (e; e < l; e++)
                    n[e].fn.apply(n[e].ctx, r);
                  return this;
                },
                off: function(t, r) {
                  var n = this.e || (this.e = {}), e = n[t], l = [];
                  if (e && r)
                    for (var v = 0, E = e.length; v < E; v++)
                      e[v].fn !== r && e[v].fn._ !== r && l.push(e[v]);
                  return l.length ? n[t] = l : delete n[t], this;
                }
              }, d.exports = a, d.exports.TinyEmitter = a;
            }
          )
          /******/
        }, f = {};
        function S(d) {
          if (f[d])
            return f[d].exports;
          var a = f[d] = {
            /******/
            // no module.id needed
            /******/
            // no module.loaded needed
            /******/
            exports: {}
            /******/
          };
          return b[d](a, a.exports, S), a.exports;
        }
        return function() {
          S.n = function(d) {
            var a = d && d.__esModule ? (
              /******/
              function() {
                return d.default;
              }
            ) : (
              /******/
              function() {
                return d;
              }
            );
            return S.d(a, { a }), a;
          };
        }(), function() {
          S.d = function(d, a) {
            for (var t in a)
              S.o(a, t) && !S.o(d, t) && Object.defineProperty(d, t, { enumerable: !0, get: a[t] });
          };
        }(), function() {
          S.o = function(d, a) {
            return Object.prototype.hasOwnProperty.call(d, a);
          };
        }(), S(686);
      }().default
    );
  });
})(it);
function Y(u) {
  return u instanceof Promise || typeof (u == null ? void 0 : u.then) == "function";
}
const ft = (u) => {
  const { timeout: p, requestInterceptor: b, responseInterceptor: f, customCodeSet: S, errorInterceptor: d } = u || {};
  return { request: async (t) => {
    let r = { timeout: p || 6e4, ...t };
    if (typeof b == "function") {
      let n = b(r);
      Y(n) && (n = await n), n && (r = { ...r, ...n });
    }
    r.headers && !r.header && (r.header = r.headers);
    try {
      const n = await uni.request(r), { data: e, statusCode: l, header: v } = n, { rejectErrorCode: E } = r;
      if (l > 299) {
        let m = "";
        throw S != null && S.messageKey && e && typeof e == "object" && (m = e[S.messageKey]), m || (m = `${l > 499 ? "服务忙" : "内部错误"}，请稍候重试...`), new U({ message: m, status: l, config: r });
      }
      let c = e;
      if (typeof f == "function") {
        let m = f({ data: e, status: l, config: t, headers: v });
        if (Y(m))
          try {
            m = await m;
          } catch (s) {
            throw new U({ message: s.message || "系统开小差了", status: l, config: r });
          }
        typeof m < "u" && (c = m);
      }
      if (!c || typeof c != "object")
        return c;
      if (E !== !1 && S) {
        const m = c[S.key];
        let s = !0;
        if (Array.isArray(S.okValue) ? s = S.okValue.includes(m) : s = m === S.okValue, !s)
          throw new U({ message: c[S.messageKey], status: l, customCode: m, config: r });
      }
      return c;
    } catch (n) {
      const e = new U({
        message: `${n.status ? "" : "网络异常，请检查是否有网后再试-"}${n.message || n.errMsg || ""}`,
        status: n.status,
        customCode: n.customCode,
        config: r
      });
      throw typeof d == "function" ? d(e) : e;
    }
  } };
}, dt = () => {
  console.log("uniapp不支持");
}, yt = () => {
  const u = uni.createIntersectionObserver(K(), { observeAll: !0 });
  return { observer: (f) => {
    const S = { top: f.top || 0, bottom: f.bottom || 0, left: f.left || 0, right: f.right || 0 };
    f.root ? u.relativeTo(f.root, S) : u.relativeToViewport(S), u.observe(f.selector, (d) => {
      d.intersectionRatio > 0 && f.callback && f.callback(d.dataset);
    });
  }, disconnect: () => u.disconnect() };
};
export {
  U as RequestError,
  j as ZhuanpanPosition,
  R as ZhuanpanStatus,
  lt as useCountDown,
  ct as useCountTo,
  yt as useIntersectionObserver,
  ft as useRequest,
  J as useRequestAnimationFrame,
  dt as useWeixinJsConfig,
  ut as useZhuanpan
};
