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
}, x = {
  // 静止的
  static: "static",
  // 缓慢转动着
  slowly: "slowly",
  playing: "playing"
}, L = {
  n: 8,
  radii: 0,
  initialPosition: D.middle,
  defaultStatus: x.static,
  duration: 3e3,
  roundDurationSlowly: 5e4
}, X = (g) => {
  let e, a;
  const i = W({
    itemList: [],
    itemMaxWidth: 0,
    lineList: [],
    status: x.static,
    panStyle: "",
    panStyleSlowly: ""
  }), f = () => {
    i.status !== x.playing && (e.defaultStatus === x.slowly ? i.panStyleSlowly = `animation:fanZhuanpanSlowly ${e.roundDurationSlowly}ms linear infinite` : i.panStyleSlowly = "");
  }, o = (m) => {
    if (i.status === x.playing)
      throw new Error("抽奖转动过程中不允许修改配置项");
    e = { ...e, ...m }, e.defaultStatus !== x.static && e.defaultStatus !== x.slowly && (e.defaultStatus = x.static), i.status = e.defaultStatus, s(), f();
  }, n = (m) => {
    const y = m / 180 * Math.PI;
    return 2 * e.radii * Math.sin(y / 2);
  }, s = () => {
    a = 360 / e.n;
    const m = new Array(e.n).fill(0), y = [];
    i.itemList = m.map((c, S) => {
      const p = {
        offsetDeg: e.initialPosition === D.line ? a * S + a / 2 : a * S
        // 渲染时相对Y轴旋转的角度
      };
      return y.push({
        offsetDeg: p.offsetDeg + a / 2
      }), p;
    }), i.lineList = y, i.itemMaxWidth = n(a);
  };
  (() => {
    o({ ...L, ...g });
  })();
  let u = !0;
  const C = () => {
    i.panStyle = "", f(), u = !0;
  };
  let l, h;
  const t = () => {
    i.status = e.defaultStatus;
  }, r = (m) => new Promise((y, c) => {
    if (i.status === x.playing)
      return c(new Error("请等待上一条完成之后再试"));
    if (!u) {
      C(), setTimeout(() => {
        y(r(m));
      }, 300);
      return;
    }
    u = !1, i.status = x.playing;
    let S = 360 * (e.duration * 10 / L.duration) - m.index * a + (e.initialPosition === D.line ? 0 : a / 2) - (e.endPosition === D.middle ? a / 2 : Math.min(a * 0.8, Math.max(a * 0.2, a * Math.random())));
    i.panStyle = `transition:transform ${e.duration}ms;transform:rotate(${S}deg)`, i.panStyleSlowly !== "" && setTimeout(() => {
      i.panStyleSlowly = "";
    }, e.duration / 2), e.useElementEvent ? (l = y, h = m) : setTimeout(() => {
      y(m), t();
    }, e.duration);
  });
  return { state: i, ZhuanpanStatus: x, ZhuanpanPosition: D, setOptions: o, play: r, reset: C, onPanEnd: () => {
    e.useElementEvent && l && (l(h), l = null, h = null, t());
  } };
}, $ = (g) => {
  const e = N(!0), a = window.requestAnimationFrame, i = window.cancelAnimationFrame;
  return { rafReadyStatus: e, raf: a, cancelRaf: i, onRafReady: (o) => a(o) };
}, _ = (g, ...e) => {
  console.warn("FanUse:", g, ...e);
}, ee = (g) => {
  const { initialValue: e, canvasSelector: a, mp: i, ...f } = g || {}, { raf: o, cancelRaf: n } = $(), s = {
    duration: 800,
    interval: 20,
    minStep: 1,
    decimal: 0
  }, w = N(Number(e) || 0), u = (c) => {
    var S;
    Object.assign(s, {
      ...c,
      decimal: typeof c.decimal < "u" ? c.decimal : typeof c.minStep < "u" ? ((S = c.minStep.toString().split(".")[1]) == null ? void 0 : S.length) || 0 : s.decimal
    });
  };
  u(f);
  let C = 0, l = 0, h = 0, t = 0, r = null;
  const d = () => {
    r && (n(r), r = null);
  }, m = () => {
    d(), r = o(() => {
      r = null;
      const c = Date.now(), S = w.value, v = Math.ceil((c - C) / s.interval);
      let p = Number((l + t * v).toFixed(s.decimal));
      p = t < 0 ? Math.max(h, p) : Math.min(h, p), S !== p && (w.value = p, g != null && g.onChange && g.onChange(p)), w.value !== h ? m() : g != null && g.onFinish && g.onFinish();
    });
  }, y = (c) => {
    const { value: S, ...v } = c, p = Number(S);
    if (isNaN(p)) {
      _("countTo..", "请传入合法的value");
      return;
    }
    p !== w.value && (u(v), l = w.value, h = p, C = Date.now(), t = (h - w.value) / Math.ceil(s.duration / s.interval), t = t < 0 ? Math.min(-Math.abs(s.minStep), t) : Math.max(Math.abs(s.minStep), t), m());
  };
  return U(() => d()), { countValue: w, countTo: y };
}, te = (g) => {
  const { canvasSelector: e, mp: a, ...i } = g || {}, { raf: f, cancelRaf: o } = $(), n = {
    time: 0,
    millisecond: !1
  }, s = (c) => {
    Object.assign(n, c);
  };
  s(i);
  let w = i.time;
  const u = W({
    time: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }), C = (c, S) => {
    let v = !0;
    if (n.millisecond ? v = c !== u.time : v = Math.floor(c / 1e3) !== Math.floor(u.time / 1e3), !v)
      return;
    const p = 1e3, R = p * 60, P = R * 60, q = P * 24;
    let M = Math.max(0, c);
    const I = Math.floor(M / q);
    M -= q * I;
    const O = Math.floor(M / P);
    M -= P * O;
    const T = Math.floor(M / R);
    M -= R * T;
    const A = Math.floor(M / p), F = M - p * A;
    Object.assign(u, { time: M, days: I, hours: O, minutes: T, seconds: A, milliseconds: F }), !S && n.onChange && n.onChange({ ...u });
  };
  C(n.time, !0);
  let l = 0, h = null;
  const t = () => {
    h && (o(h), h = null);
  }, r = () => {
    if (t(), u.time <= 0) {
      l = 0;
      return;
    }
    h = f(() => {
      h = null, C(n.time - (Date.now() - l)), u.time > 0 ? r() : n.onFinish && n.onFinish();
    });
  }, d = () => {
    l || (l = Date.now(), r());
  }, m = () => {
    t(), n.time = u.time, l = 0;
  }, y = (c) => {
    m(), l = 0, s({ time: typeof (c == null ? void 0 : c.time) > "u" ? w : c.time, ...c }), w = n.time, C(n.time);
  };
  return U(() => t()), { current: u, start: d, pause: m, reset: y };
};
class k extends Error {
  status;
  customCode;
  config;
  constructor(e) {
    const a = typeof e == "object" ? e : { message: e };
    super(a.message), this.status = a.status, this.customCode = a.customCode, this.config = a.config;
  }
}
const G = () => new Promise(() => null), ne = (g) => {
  const e = g || {}, a = V.create({
    timeout: e.timeout || 6e4,
    // withCredentials: true, // send cookies when cross-domain requests
    validateStatus: () => !0
  }), i = (f) => typeof e.errorInterceptor == "function" ? Promise.reject(e.errorInterceptor(f)) : Promise.reject(f);
  return a.interceptors.request.use(
    async (f) => {
      let o = { ...f };
      if (typeof e.requestInterceptor == "function") {
        let s = e.requestInterceptor(o);
        j(s) && (s = await s), s && typeof s == "object" && (o = { ...o, ...s });
      }
      const n = ["get", "delete"];
      return (!o.method || n.includes(o.method.toLowerCase()) && o.data && !o.params) && (o.params = o.data), o;
    },
    (f) => {
      const o = `${f.request ? "网络异常，请检查是否有网后再试-" : ""}${f.message || ""}`;
      return i(new k(o));
    }
  ), a.interceptors.response.use(
    async (f) => {
      var h;
      const { config: o, data: n, status: s, headers: w } = f, { rejectErrorCode: u } = o;
      if (typeof e.validateStatus == "function" ? !e.validateStatus(s) : s > 299) {
        let t = "";
        return (h = e.customCodeSet) != null && h.messageKey && n && typeof n == "object" && (t = n[e.customCodeSet.messageKey]), t || (t = `${s > 499 ? "服务忙" : "内部错误"}，请稍候重试...`), i(new k({ message: t, status: s, config: o }));
      }
      let l = n;
      if (typeof e.responseInterceptor == "function") {
        let t = e.responseInterceptor({ data: n, status: s, config: o, headers: w });
        if (j(t))
          try {
            t = await t;
          } catch (r) {
            return i(new k({ message: r.message || "系统开小差了", status: s, config: o }));
          }
        typeof t < "u" && (l = t);
      }
      if (!l || typeof l != "object")
        return l;
      if (u !== !1 && e.customCodeSet) {
        const t = l[e.customCodeSet.key];
        let r = !0;
        if (Array.isArray(e.customCodeSet.okValue) ? r = e.customCodeSet.okValue.includes(t) : r = t === e.customCodeSet.okValue, !r)
          return i(
            new k({ message: l[e.customCodeSet.messageKey], status: s, customCode: t, config: o })
          );
      }
      return l;
    },
    (f) => {
      var w, u;
      if (((w = f.request) == null ? void 0 : w.status) === 0)
        return G();
      const { status: o, data: n } = f.response || {};
      let s;
      return n && ((u = e.customCodeSet) != null && u.messageKey) && (s = n[e.customCodeSet.messageKey]), i(new k({ message: f.message, status: o, customCode: s, config: f.config }));
    }
  ), { request: a };
}, Z = "fanWxJsSdk", B = "//res.wx.qq.com/open/js/jweixin-1.6.0.js";
let b = E ? window.location.href : "";
const H = (g) => {
  const { configGetter: e, sdkLoadedUrl: a } = g || {};
  let i = "";
  a ? b = a : b || (b = E ? window.location.href : "");
  const { isWeixin: f, isIos: o } = J(), n = /* @__PURE__ */ new Map(), s = (t, r) => {
    const d = n.get(t) || [];
    d.push(r), n.set(t, d);
  }, w = (t) => {
    if (!E)
      return;
    const { fn: r, url: d } = t || {}, m = d || window.location.href;
    if (!n.has(m))
      return;
    if (!r) {
      n.delete(m);
      return;
    }
    const y = n.get(m);
    if (!y)
      return;
    const c = y.findIndex((S) => S === r);
    c !== -1 && (y.splice(c, 1), n.set(m, y));
  }, u = (t) => {
    const r = n.get(t);
    r && (r.forEach((d) => d()), w({ url: t }));
  }, C = () => new Promise((t, r) => {
    window.wx.ready(() => t(!0)), window.wx.error((d) => r(new Error(d.errMsg || d.message || JSON.stringify(d))));
  }), l = async (t, r) => {
    if (!E)
      return;
    const d = (r == null ? void 0 : r.url) || window.location.href;
    try {
      if (o)
        await C();
      else if (d !== i)
        throw new Error("Need wx.config");
      t();
    } catch {
      s(d, t);
    }
  }, h = async (t) => {
    if (!E || !f)
      return;
    const r = (t == null ? void 0 : t.configGetter) || e;
    if (!r)
      throw new Error("[configGetter] required");
    let d = window.location.href;
    window.wx || (await K(B, { id: Z }), b = window.location.href);
    let m = !1;
    o && !i && b && d !== b && (m = !0, d = b);
    const y = r({ url: d }), { config: c, shareData: S } = j(y) ? await y : y;
    let v = !0;
    if (o && i)
      try {
        await C(), v = !1;
      } catch {
      }
    if (v && (window.wx.config(c), await C()), i = d, S) {
      if (m)
        return h(t);
      window.wx.updateTimelineShareData(S), window.wx.updateAppMessageShareData(S);
    }
    u(d);
  };
  return { configWeixinJs: h, onConfigReady: l, removeReadyCallback: w };
}, oe = (g) => E ? (window.fanWeixinSdk || (window.fanWeixinSdk = H(g)), window.fanWeixinSdk) : {}, se = (g) => {
  let e;
  const a = (o, n, s) => {
    let w = `${n.top || 0}px ${n.right || 0}px ${n.bottom || 0}px ${n.right || 0}px`;
    e = new IntersectionObserver(
      (u) => {
        u.forEach((C) => {
          var l;
          C.isIntersecting && n.callback && n.callback({ ...(l = C.target) == null ? void 0 : l.dataset });
        });
      },
      { root: s, rootMargin: w }
    ), o.forEach((u) => e.observe(u));
  };
  return { observer: async (o) => {
    let n;
    o.root && (n = document.querySelectorAll(o.root)[0]);
    const s = document.querySelectorAll(o.selector);
    s && s.length && a(s, o, n);
  }, disconnect: () => {
    e && e.disconnect();
  } };
};
export {
  k as RequestError,
  D as ZhuanpanPosition,
  x as ZhuanpanStatus,
  te as useCountDown,
  ee as useCountTo,
  se as useIntersectionObserver,
  ne as useRequest,
  $ as useRequestAnimationFrame,
  oe as useWeixinJsConfig,
  X as useZhuanpan
};
