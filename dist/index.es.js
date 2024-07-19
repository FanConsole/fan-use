import { reactive as W, ref as N, onUnmounted as U } from "vue";
import V from "axios";
import { isPromiseLike as j, inBrowser as E, getSystemInfo as J, loadJs as K } from "fan-utils";
const D = {
  // 在线上（左线）
  line: "line",
  // 在格子中间
  middle: "middle",
  // 格子内随机
  random: "random"
}, M = {
  // 静止的
  static: "static",
  // 缓慢转动着
  slowly: "slowly",
  playing: "playing"
}, L = {
  n: 8,
  radii: 0,
  initialPosition: D.middle,
  defaultStatus: M.static,
  duration: 3e3,
  roundDurationSlowly: 5e4
}, X = (w) => {
  let t, u;
  const a = W({
    itemList: [],
    itemMaxWidth: 0,
    lineList: [],
    status: M.static,
    panStyle: "",
    panStyleSlowly: ""
  }), g = () => {
    a.status !== M.playing && (t.defaultStatus === M.slowly ? a.panStyleSlowly = `animation:fanZhuanpanSlowly ${t.roundDurationSlowly}ms linear infinite` : a.panStyleSlowly = "");
  }, y = (c) => {
    if (a.status === M.playing)
      throw new Error("抽奖转动过程中不允许修改配置项");
    t = { ...t, ...c }, t.defaultStatus !== M.static && t.defaultStatus !== M.slowly && (t.defaultStatus = M.static), a.status = t.defaultStatus, d(), g();
  }, i = (c) => {
    const S = c / 180 * Math.PI;
    return 2 * t.radii * Math.sin(S / 2);
  }, d = () => {
    u = 360 / t.n;
    const c = new Array(t.n).fill(0), S = [];
    a.itemList = c.map((f, p) => {
      const x = {
        offsetDeg: t.initialPosition === D.line ? u * p + u / 2 : u * p
        // 渲染时相对Y轴旋转的角度
      };
      return S.push({
        offsetDeg: x.offsetDeg + u / 2
      }), x;
    }), a.lineList = S, a.itemMaxWidth = i(u);
  };
  (() => {
    y({ ...L, ...w });
  })();
  let e = !0;
  const m = () => {
    a.panStyle = "", g(), e = !0;
  };
  let s, h;
  const r = () => {
    a.status = t.defaultStatus;
  }, o = (c) => new Promise((S, f) => {
    if (a.status === M.playing)
      return f(new Error("请等待上一条完成之后再试"));
    if (!e) {
      m(), setTimeout(() => {
        S(o(c));
      }, 300);
      return;
    }
    e = !1, a.status = M.playing;
    let p = 360 * (t.duration * 10 / L.duration) - c.index * u + (t.initialPosition === D.line ? 0 : u / 2) - (t.endPosition === D.middle ? u / 2 : Math.min(u * 0.8, Math.max(u * 0.2, u * Math.random())));
    a.panStyle = `transition:transform ${t.duration}ms;transform:rotate(${p}deg)`, a.panStyleSlowly !== "" && setTimeout(() => {
      a.panStyleSlowly = "";
    }, t.duration / 2), t.useElementEvent ? (s = S, h = c) : setTimeout(() => {
      S(c), r();
    }, t.duration);
  });
  return { state: a, ZhuanpanStatus: M, ZhuanpanPosition: D, setOptions: y, play: o, reset: m, onPanEnd: () => {
    t.useElementEvent && s && (s(h), s = null, h = null, r());
  } };
}, $ = (w) => {
  const t = N(!0), u = window.requestAnimationFrame, a = window.cancelAnimationFrame;
  return { rafReadyStatus: t, raf: u, cancelRaf: a, onRafReady: (y) => u(y) };
}, _ = (w, ...t) => {
  console.warn("FanUse:", w, ...t);
}, ee = (w) => {
  const { initialValue: t, canvasSelector: u, mp: a, ...g } = w || {}, { raf: y, cancelRaf: i } = $(), d = {
    duration: 800,
    interval: 20,
    minStep: 1,
    decimal: 0
  }, l = N(Number(t) || 0), e = (f) => {
    var p;
    Object.assign(d, {
      ...f,
      decimal: typeof f.decimal < "u" ? f.decimal : typeof f.minStep < "u" ? ((p = f.minStep.toString().split(".")[1]) == null ? void 0 : p.length) || 0 : d.decimal
    });
  };
  e(g);
  let m = 0, s = 0, h = 0, r = 0, o = null;
  const n = () => {
    o && (i(o), o = null);
  }, c = () => {
    n(), o = y(() => {
      o = null;
      const f = Date.now(), p = l.value, v = Math.ceil((f - m) / d.interval);
      let x = Number((s + r * v).toFixed(d.decimal));
      x = r < 0 ? Math.max(h, x) : Math.min(h, x), p !== x && (l.value = x, w != null && w.onChange && w.onChange(x)), l.value !== h ? c() : w != null && w.onFinish && w.onFinish();
    });
  }, S = (f) => {
    const { value: p, ...v } = f, x = Number(p);
    if (isNaN(x)) {
      _("countTo..", "请传入合法的value");
      return;
    }
    x !== l.value && (e(v), s = l.value, h = x, m = Date.now(), r = (h - l.value) / Math.ceil(d.duration / d.interval), r = r < 0 ? Math.min(-Math.abs(d.minStep), r) : Math.max(Math.abs(d.minStep), r), c());
  };
  return U(() => n()), { countValue: l, countTo: S };
}, te = (w) => {
  const { canvasSelector: t, mp: u, ...a } = w || {}, { raf: g, cancelRaf: y } = $(), i = {
    time: 0,
    millisecond: !1
  }, d = (f) => {
    Object.assign(i, f);
  };
  d(a);
  let l = a.time;
  const e = W({
    time: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }), m = (f, p) => {
    let v = !0;
    if (i.millisecond ? v = f !== e.time : v = Math.floor(f / 1e3) !== Math.floor(e.time / 1e3), !v)
      return;
    const x = 1e3, R = x * 60, P = R * 60, q = P * 24;
    let b = Math.max(0, f);
    const I = Math.floor(b / q);
    b -= q * I;
    const O = Math.floor(b / P);
    b -= P * O;
    const T = Math.floor(b / R);
    b -= R * T;
    const A = Math.floor(b / x), F = b - x * A;
    Object.assign(e, { time: b, days: I, hours: O, minutes: T, seconds: A, milliseconds: F }), !p && i.onChange && i.onChange({ ...e });
  };
  m(i.time, !0);
  let s = 0, h = null;
  const r = () => {
    h && (y(h), h = null);
  }, o = () => {
    if (r(), e.time <= 0) {
      s = 0;
      return;
    }
    h = g(() => {
      h = null, m(i.time - (Date.now() - s)), e.time > 0 ? o() : i.onFinish && i.onFinish();
    });
  }, n = () => {
    s || (s = Date.now(), o());
  }, c = () => {
    r(), i.time = e.time, s = 0;
  }, S = (f) => {
    c(), s = 0, d({ time: typeof (f == null ? void 0 : f.time) > "u" ? l : f.time, ...f }), l = i.time, m(i.time);
  };
  return U(() => r()), { current: e, start: n, pause: c, reset: S };
};
class k extends Error {
  status;
  customCode;
  config;
  constructor(t) {
    const u = typeof t == "object" ? t : { message: t };
    super(u.message), this.status = u.status, this.customCode = u.customCode, this.config = u.config;
  }
}
const G = () => new Promise(() => null), ne = (w) => {
  const { timeout: t, requestInterceptor: u, responseInterceptor: a, customCodeSet: g, errorInterceptor: y } = w || {}, i = V.create({
    timeout: t || 6e4,
    // withCredentials: true, // send cookies when cross-domain requests
    validateStatus: () => !0
  }), d = (l) => typeof y == "function" ? Promise.reject(y(l)) : Promise.reject(l);
  return i.interceptors.request.use(
    async (l) => {
      let e = { ...l };
      if (typeof u == "function") {
        let s = u(e);
        j(s) && (s = await s), s && typeof s == "object" && (e = { ...e, ...s });
      }
      const m = ["get", "delete"];
      return (!e.method || m.includes(e.method.toLowerCase()) && e.data && !e.params) && (e.params = e.data), e;
    },
    (l) => {
      const e = `${l.request ? "网络异常，请检查是否有网后再试-" : ""}${l.message || ""}`;
      return d(new k(e));
    }
  ), i.interceptors.response.use(
    async (l) => {
      const { config: e, data: m, status: s, headers: h } = l, { rejectErrorCode: r } = e;
      if (s > 299) {
        let n = "";
        return g != null && g.messageKey && m && typeof m == "object" && (n = m[g.messageKey]), n || (n = `${s > 499 ? "服务忙" : "内部错误"}，请稍候重试...`), d(new k({ message: n, status: s, config: e }));
      }
      let o = m;
      if (typeof a == "function") {
        let n = a({ data: m, status: s, config: e, headers: h });
        if (j(n))
          try {
            n = await n;
          } catch (c) {
            return d(new k({ message: c.message || "系统开小差了", status: s, config: e }));
          }
        typeof n < "u" && (o = n);
      }
      if (!o || typeof o != "object")
        return o;
      if (r !== !1 && g) {
        const n = o[g.key];
        let c = !0;
        if (Array.isArray(g.okValue) ? c = g.okValue.includes(n) : c = n === g.okValue, !c)
          return d(
            new k({ message: o[g.messageKey], status: s, customCode: n, config: e })
          );
      }
      return o;
    },
    (l) => {
      var h;
      if (((h = l.request) == null ? void 0 : h.status) === 0)
        return G();
      const { status: e, data: m } = l.response || {};
      let s;
      return m && (g != null && g.messageKey) && (s = m[g.messageKey]), d(new k({ message: l.message, status: e, customCode: s, config: l.config }));
    }
  ), { request: i };
}, Z = "fanWxJsSdk", B = "//res.wx.qq.com/open/js/jweixin-1.6.0.js";
let C = E ? window.location.href : "";
const H = (w) => {
  const { configGetter: t, sdkLoadedUrl: u } = w || {};
  let a = "";
  u ? C = u : C || (C = E ? window.location.href : "");
  const { isWeixin: g, isIos: y } = J(), i = /* @__PURE__ */ new Map(), d = (r, o) => {
    const n = i.get(r) || [];
    n.push(o), i.set(r, n);
  }, l = (r) => {
    if (!E)
      return;
    const { fn: o, url: n } = r || {}, c = n || window.location.href;
    if (!i.has(c))
      return;
    if (!o) {
      i.delete(c);
      return;
    }
    const S = i.get(c);
    if (!S)
      return;
    const f = S.findIndex((p) => p === o);
    f !== -1 && (S.splice(f, 1), i.set(c, S));
  }, e = (r) => {
    const o = i.get(r);
    o && (o.forEach((n) => n()), l({ url: r }));
  }, m = () => new Promise((r, o) => {
    window.wx.ready(() => r(!0)), window.wx.error((n) => o(new Error(n.errMsg || n.message || JSON.stringify(n))));
  }), s = async (r, o) => {
    if (!E)
      return;
    const n = (o == null ? void 0 : o.url) || window.location.href;
    try {
      if (y)
        await m();
      else if (n !== a)
        throw new Error("Need wx.config");
      r();
    } catch {
      d(n, r);
    }
  }, h = async (r) => {
    if (!E || !g)
      return;
    const o = (r == null ? void 0 : r.configGetter) || t;
    if (!o)
      throw new Error("[configGetter] required");
    let n = window.location.href;
    window.wx || (await K(B, { id: Z }), C = window.location.href);
    let c = !1;
    y && !a && C && n !== C && (c = !0, n = C);
    const S = o({ url: n }), { config: f, shareData: p } = j(S) ? await S : S;
    let v = !0;
    if (y && a)
      try {
        await m(), v = !1;
      } catch {
      }
    if (v && (window.wx.config(f), await m()), a = n, p) {
      if (c)
        return h(r);
      window.wx.updateTimelineShareData(p), window.wx.updateAppMessageShareData(p);
    }
    e(n);
  };
  return { configWeixinJs: h, onConfigReady: s, removeReadyCallback: l };
}, ie = (w) => E ? (window.fanWeixinSdk || (window.fanWeixinSdk = H(w)), window.fanWeixinSdk) : {}, se = (w) => {
  let t;
  const u = (y, i, d) => {
    let l = `${i.top || 0}px ${i.right || 0}px ${i.bottom || 0}px ${i.right || 0}px`;
    t = new IntersectionObserver(
      (e) => {
        e.forEach((m) => {
          var s;
          m.isIntersecting && i.callback && i.callback({ ...(s = m.target) == null ? void 0 : s.dataset });
        });
      },
      { root: d, rootMargin: l }
    ), y.forEach((e) => t.observe(e));
  };
  return { observer: async (y) => {
    let i;
    y.root && (i = document.querySelectorAll(y.root)[0]);
    const d = document.querySelectorAll(y.selector);
    d && d.length && u(d, y, i);
  }, disconnect: () => {
    t && t.disconnect();
  } };
};
export {
  k as RequestError,
  D as ZhuanpanPosition,
  M as ZhuanpanStatus,
  te as useCountDown,
  ee as useCountTo,
  se as useIntersectionObserver,
  ne as useRequest,
  $ as useRequestAnimationFrame,
  ie as useWeixinJsConfig,
  X as useZhuanpan
};
