import { reactive as V, ref as j, getCurrentInstance as U, onMounted as W, onUnmounted as N } from "vue";
import { isPromiseLike as I } from "fan-utils";
const D = {
  // 在线上（左线）
  line: "line",
  // 在格子中间
  middle: "middle",
  // 格子内随机
  random: "random"
}, C = {
  // 静止的
  static: "static",
  // 缓慢转动着
  slowly: "slowly",
  playing: "playing"
}, q = {
  n: 8,
  radii: 0,
  initialPosition: D.middle,
  defaultStatus: C.static,
  duration: 3e3,
  roundDurationSlowly: 5e4
}, _ = (n) => {
  let e, r;
  const a = V({
    itemList: [],
    itemMaxWidth: 0,
    lineList: [],
    status: C.static,
    panStyle: "",
    panStyleSlowly: ""
  }), o = () => {
    a.status !== C.playing && (e.defaultStatus === C.slowly ? a.panStyleSlowly = `animation:fanZhuanpanSlowly ${e.roundDurationSlowly}ms linear infinite` : a.panStyleSlowly = "");
  }, S = (y) => {
    if (a.status === C.playing)
      throw new Error("抽奖转动过程中不允许修改配置项");
    e = { ...e, ...y }, e.defaultStatus !== C.static && e.defaultStatus !== C.slowly && (e.defaultStatus = C.static), a.status = e.defaultStatus, t(), o();
  }, m = (y) => {
    const v = y / 180 * Math.PI;
    return 2 * e.radii * Math.sin(v / 2);
  }, t = () => {
    r = 360 / e.n;
    const y = new Array(e.n).fill(0), v = [];
    a.itemList = y.map((d, w) => {
      const g = {
        offsetDeg: e.initialPosition === D.line ? r * w + r / 2 : r * w
        // 渲染时相对Y轴旋转的角度
      };
      return v.push({
        offsetDeg: g.offsetDeg + r / 2
      }), g;
    }), a.lineList = v, a.itemMaxWidth = m(r);
  };
  (() => {
    S({ ...q, ...n });
  })();
  let i = !0;
  const s = () => {
    a.panStyle = "", o(), i = !0;
  };
  let u, h;
  const l = () => {
    a.status = e.defaultStatus;
  }, c = (y) => new Promise((v, d) => {
    if (a.status === C.playing)
      return d(new Error("请等待上一条完成之后再试"));
    if (!i) {
      s(), setTimeout(() => {
        v(c(y));
      }, 300);
      return;
    }
    i = !1, a.status = C.playing;
    let w = 360 * (e.duration * 10 / q.duration) - y.index * r + (e.initialPosition === D.line ? 0 : r / 2) - (e.endPosition === D.middle ? r / 2 : Math.min(r * 0.8, Math.max(r * 0.2, r * Math.random())));
    a.panStyle = `transition:transform ${e.duration}ms;transform:rotate(${w}deg)`, a.panStyleSlowly !== "" && setTimeout(() => {
      a.panStyleSlowly = "";
    }, e.duration / 2), e.useElementEvent ? (u = v, h = y) : setTimeout(() => {
      v(y), l();
    }, e.duration);
  });
  return { state: a, ZhuanpanStatus: C, ZhuanpanPosition: D, setOptions: S, play: c, reset: s, onPanEnd: () => {
    e.useElementEvent && u && (u(h), u = null, h = null, l());
  } };
}, k = (n, ...e) => {
  console.warn("FanUse:", n, ...e);
}, L = (n) => {
  let e;
  const r = (n == null ? void 0 : n.mp) !== !1, a = j(!r || !(n != null && n.canvasSelector)), o = (s) => setTimeout(s, 16.666666666666668, Date.now()), S = (s) => r ? n != null && n.canvasSelector ? e.requestAnimationFrame(s) : o(s) : window.requestAnimationFrame(s), m = (s) => r ? n != null && n.canvasSelector ? e.cancelAnimationFrame(s) : clearTimeout(s) : window.cancelAnimationFrame(s), t = [], f = (s) => {
    if (!r || a.value) {
      s();
      return;
    }
    t.push(s);
  }, i = U();
  return W(() => {
    n != null && n.canvasSelector && uni.createSelectorQuery().in(i).select(n.canvasSelector).fields({ node: !0 }, (s) => {
      if ((s == null ? void 0 : s.nodeCanvasType) !== "2d" || !s.node) {
        k("useRequestAnimationFrame..", "请传入正确的canvasSelector");
        return;
      }
      if (e = s.node, a.value = !0, t.length) {
        for (let u = 0; u < t.length; u++)
          t[u]();
        t.length = 0;
      }
    }).exec();
  }), { rafReadyStatus: a, raf: S, cancelRaf: m, onRafReady: f };
}, B = (n) => {
  const { initialValue: e, canvasSelector: r, mp: a, ...o } = n || {}, { raf: S, cancelRaf: m } = L({ canvasSelector: r, mp: a }), t = {
    duration: 800,
    interval: 20,
    minStep: 1,
    decimal: 0
  }, f = j(Number(e) || 0), i = (d) => {
    var w;
    Object.assign(t, {
      ...d,
      decimal: typeof d.decimal < "u" ? d.decimal : typeof d.minStep < "u" ? ((w = d.minStep.toString().split(".")[1]) == null ? void 0 : w.length) || 0 : t.decimal
    });
  };
  i(o);
  let s = 0, u = 0, h = 0, l = 0, c = null;
  const M = () => {
    c && (m(c), c = null);
  }, y = () => {
    M(), c = S(() => {
      c = null;
      const d = Date.now(), w = f.value, b = Math.ceil((d - s) / t.interval);
      let g = Number((u + l * b).toFixed(t.decimal));
      g = l < 0 ? Math.max(h, g) : Math.min(h, g), w !== g && (f.value = g, n != null && n.onChange && n.onChange(g)), f.value !== h ? y() : n != null && n.onFinish && n.onFinish();
    });
  }, v = (d) => {
    const { value: w, ...b } = d, g = Number(w);
    if (isNaN(g)) {
      k("countTo..", "请传入合法的value");
      return;
    }
    g !== f.value && (i(b), u = f.value, h = g, s = Date.now(), l = (h - f.value) / Math.ceil(t.duration / t.interval), l = l < 0 ? Math.min(-Math.abs(t.minStep), l) : Math.max(Math.abs(t.minStep), l), y());
  };
  return N(() => M()), { countValue: f, countTo: v };
}, H = (n) => {
  const { canvasSelector: e, mp: r, ...a } = n || {}, { raf: o, cancelRaf: S } = L({ canvasSelector: e, mp: r }), m = {
    time: 0,
    millisecond: !1
  }, t = (d) => {
    Object.assign(m, d);
  };
  t(a);
  let f = a.time;
  const i = V({
    time: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }), s = (d, w) => {
    let b = !0;
    if (m.millisecond ? b = d !== i.time : b = Math.floor(d / 1e3) !== Math.floor(i.time / 1e3), !b)
      return;
    const g = 1e3, T = g * 60, R = T * 60, P = R * 24;
    let p = Math.max(0, d);
    const x = Math.floor(p / P);
    p -= P * x;
    const A = Math.floor(p / R);
    p -= R * A;
    const F = Math.floor(p / T);
    p -= T * F;
    const O = Math.floor(p / g), $ = p - g * O;
    Object.assign(i, { time: d, days: x, hours: A, minutes: F, seconds: O, milliseconds: $ }), !w && m.onChange && m.onChange({ ...i });
  };
  s(m.time, !0);
  let u = 0, h = null;
  const l = () => {
    h && (S(h), h = null);
  }, c = () => {
    if (l(), i.time <= 0) {
      u = 0;
      return;
    }
    h = o(() => {
      h = null, s(m.time - (Date.now() - u)), i.time > 0 ? c() : m.onFinish && m.onFinish();
    });
  }, M = () => {
    u || (u = Date.now(), c());
  }, y = () => {
    l(), m.time = i.time, u = 0;
  }, v = (d) => {
    y(), u = 0, t({ time: typeof (d == null ? void 0 : d.time) > "u" ? f : d.time, ...d }), f = m.time, s(m.time);
  };
  return N(() => l()), { current: i, start: M, pause: y, reset: v };
};
class E extends Error {
  status;
  customCode;
  config;
  constructor(e) {
    const r = typeof e == "object" ? e : { message: e };
    super(r.message), this.status = r.status, this.customCode = r.customCode, this.config = r.config;
  }
}
const J = (n) => {
  const e = n || {};
  return { request: async (a) => {
    var m;
    let o = { timeout: e.timeout || 6e4, ...a };
    if (typeof e.requestInterceptor == "function") {
      let t = e.requestInterceptor(o);
      I(t) && (t = await t), t && (o = { ...o, ...t });
    }
    o.headers && !o.header && (o.header = o.headers);
    const S = (t, f) => {
      if (!e.customCodeSet)
        return;
      const i = t[e.customCodeSet.key];
      let s = !0;
      if (Array.isArray(e.customCodeSet.okValue) ? s = e.customCodeSet.okValue.includes(i) : s = i === e.customCodeSet.okValue, !s)
        throw new E({ message: t[e.customCodeSet.messageKey], status: f, customCode: i, config: o });
    };
    try {
      const t = await uni.request(o), { data: f, statusCode: i, header: s } = t, { rejectErrorCode: u } = o;
      if (typeof e.validateStatus == "function" ? !e.validateStatus(i) : i > 299) {
        let c = "";
        throw (m = e.customCodeSet) != null && m.messageKey && f && typeof f == "object" && (c = f[e.customCodeSet.messageKey]), c || (c = `${i > 499 ? "服务忙" : "内部错误"}，请稍候重试...`), new E({ message: c, status: i, config: o });
      }
      let l = f;
      if (typeof e.responseInterceptor == "function") {
        let c = e.responseInterceptor({ data: f, status: i, config: a, headers: s });
        if (I(c))
          try {
            c = await c;
          } catch (M) {
            throw new E({ message: M.message || "系统开小差了", status: i, config: o });
          }
        typeof c < "u" && (l = c);
      }
      return !l || typeof l != "object" || u !== !1 && e.customCodeSet && S(l, i), l;
    } catch (t) {
      if (t.statusCode >= 400 && e.validateStatus && e.validateStatus(t.statusCode)) {
        const { data: s, statusCode: u, header: h } = t;
        let l = t.data;
        if (typeof e.responseInterceptor == "function") {
          let c = e.responseInterceptor({ data: s, status: u, config: a, headers: h });
          if (I(c))
            try {
              c = await c;
            } catch (M) {
              throw new E({ message: M.message || "系统开小差了", status: u, config: o });
            }
          typeof c < "u" && (l = c);
        }
        return !l || typeof l != "object" || o.rejectErrorCode !== !1 && e.customCodeSet && S(l, u), l;
      }
      const f = t.status || t.statusCode || 0, i = new E({
        message: `${f ? "" : "网络异常，请检查是否有网后再试-"}${t.message || t.errMsg || ""}`,
        status: f,
        customCode: t.customCode,
        config: o
      });
      throw typeof e.errorInterceptor == "function" ? e.errorInterceptor(i) : i;
    }
  } };
}, Q = () => {
  console.log("uniapp不支持");
}, Y = (n) => {
  const e = uni.createIntersectionObserver(n, { observeAll: !0, nativeMode: !0 });
  return { observer: (o) => {
    const S = { top: o.top || 0, bottom: o.bottom || 0, left: o.left || 0, right: o.right || 0 };
    o.root ? e.relativeTo(o.root, S) : e.relativeToViewport(S), e.observe(o.selector, (m) => {
      m.intersectionRatio > 0 && o.callback && o.callback(m.dataset);
    });
  }, disconnect: () => e.disconnect() };
};
export {
  E as RequestError,
  D as ZhuanpanPosition,
  C as ZhuanpanStatus,
  H as useCountDown,
  B as useCountTo,
  Y as useIntersectionObserver,
  J as useRequest,
  L as useRequestAnimationFrame,
  Q as useWeixinJsConfig,
  _ as useZhuanpan
};
