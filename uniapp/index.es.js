import { reactive as V, ref as N, getCurrentInstance as U, onMounted as W, onUnmounted as k } from "vue";
import { isPromiseLike as q } from "fan-utils";
const T = {
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
}, I = {
  n: 8,
  radii: 0,
  initialPosition: T.middle,
  defaultStatus: C.static,
  duration: 3e3,
  roundDurationSlowly: 5e4
}, _ = (t) => {
  let e, r;
  const o = V({
    itemList: [],
    itemMaxWidth: 0,
    lineList: [],
    status: C.static,
    panStyle: "",
    panStyleSlowly: ""
  }), s = () => {
    o.status !== C.playing && (e.defaultStatus === C.slowly ? o.panStyleSlowly = `animation:fanZhuanpanSlowly ${e.roundDurationSlowly}ms linear infinite` : o.panStyleSlowly = "");
  }, S = (y) => {
    if (o.status === C.playing)
      throw new Error("抽奖转动过程中不允许修改配置项");
    e = { ...e, ...y }, e.defaultStatus !== C.static && e.defaultStatus !== C.slowly && (e.defaultStatus = C.static), o.status = e.defaultStatus, l(), s();
  }, n = (y) => {
    const w = y / 180 * Math.PI;
    return 2 * e.radii * Math.sin(w / 2);
  }, l = () => {
    r = 360 / e.n;
    const y = new Array(e.n).fill(0), w = [];
    o.itemList = y.map((c, v) => {
      const g = {
        offsetDeg: e.initialPosition === T.line ? r * v + r / 2 : r * v
        // 渲染时相对Y轴旋转的角度
      };
      return w.push({
        offsetDeg: g.offsetDeg + r / 2
      }), g;
    }), o.lineList = w, o.itemMaxWidth = n(r);
  };
  (() => {
    S({ ...I, ...t });
  })();
  let d = !0;
  const i = () => {
    o.panStyle = "", s(), d = !0;
  };
  let f, u;
  const a = () => {
    o.status = e.defaultStatus;
  }, h = (y) => new Promise((w, c) => {
    if (o.status === C.playing)
      return c(new Error("请等待上一条完成之后再试"));
    if (!d) {
      i(), setTimeout(() => {
        w(h(y));
      }, 300);
      return;
    }
    d = !1, o.status = C.playing;
    let v = 360 * (e.duration * 10 / I.duration) - y.index * r + (e.initialPosition === T.line ? 0 : r / 2) - (e.endPosition === T.middle ? r / 2 : Math.min(r * 0.8, Math.max(r * 0.2, r * Math.random())));
    o.panStyle = `transition:transform ${e.duration}ms;transform:rotate(${v}deg)`, o.panStyleSlowly !== "" && setTimeout(() => {
      o.panStyleSlowly = "";
    }, e.duration / 2), e.useElementEvent ? (f = w, u = y) : setTimeout(() => {
      w(y), a();
    }, e.duration);
  });
  return { state: o, ZhuanpanStatus: C, ZhuanpanPosition: T, setOptions: S, play: h, reset: i, onPanEnd: () => {
    e.useElementEvent && f && (f(u), f = null, u = null, a());
  } };
}, L = (t, ...e) => {
  console.warn("FanUse:", t, ...e);
}, j = (t) => {
  let e;
  const r = (t == null ? void 0 : t.mp) !== !1, o = N(!r || !(t != null && t.canvasSelector)), s = (i) => setTimeout(i, 16.666666666666668, Date.now()), S = (i) => r ? t != null && t.canvasSelector ? e.requestAnimationFrame(i) : s(i) : window.requestAnimationFrame(i), n = (i) => r ? t != null && t.canvasSelector ? e.cancelAnimationFrame(i) : clearTimeout(i) : window.cancelAnimationFrame(i), l = [], m = (i) => {
    if (!r || o.value) {
      i();
      return;
    }
    l.push(i);
  }, d = U();
  return W(() => {
    t != null && t.canvasSelector && uni.createSelectorQuery().in(d).select(t.canvasSelector).fields({ node: !0 }, (i) => {
      if ((i == null ? void 0 : i.nodeCanvasType) !== "2d" || !i.node) {
        L("useRequestAnimationFrame..", "请传入正确的canvasSelector");
        return;
      }
      if (e = i.node, o.value = !0, l.length) {
        for (let f = 0; f < l.length; f++)
          l[f]();
        l.length = 0;
      }
    }).exec();
  }), { rafReadyStatus: o, raf: S, cancelRaf: n, onRafReady: m };
}, B = (t) => {
  const { initialValue: e, canvasSelector: r, mp: o, ...s } = t || {}, { raf: S, cancelRaf: n } = j({ canvasSelector: r, mp: o }), l = {
    duration: 800,
    interval: 20,
    minStep: 1,
    decimal: 0
  }, m = N(Number(e) || 0), d = (c) => {
    var v;
    Object.assign(l, {
      ...c,
      decimal: typeof c.decimal < "u" ? c.decimal : typeof c.minStep < "u" ? ((v = c.minStep.toString().split(".")[1]) == null ? void 0 : v.length) || 0 : l.decimal
    });
  };
  d(s);
  let i = 0, f = 0, u = 0, a = 0, h = null;
  const D = () => {
    h && (n(h), h = null);
  }, y = () => {
    D(), h = S(() => {
      h = null;
      const c = Date.now(), v = m.value, b = Math.ceil((c - i) / l.interval);
      let g = Number((f + a * b).toFixed(l.decimal));
      g = a < 0 ? Math.max(u, g) : Math.min(u, g), v !== g && (m.value = g, t != null && t.onChange && t.onChange(g)), m.value !== u ? y() : t != null && t.onFinish && t.onFinish();
    });
  }, w = (c) => {
    const { value: v, ...b } = c, g = Number(v);
    if (isNaN(g)) {
      L("countTo..", "请传入合法的value");
      return;
    }
    g !== m.value && (d(b), f = m.value, u = g, i = Date.now(), a = (u - m.value) / Math.ceil(l.duration / l.interval), a = a < 0 ? Math.min(-Math.abs(l.minStep), a) : Math.max(Math.abs(l.minStep), a), y());
  };
  return k(() => D()), { countValue: m, countTo: w };
}, H = (t) => {
  const { canvasSelector: e, mp: r, ...o } = t || {}, { raf: s, cancelRaf: S } = j({ canvasSelector: e, mp: r }), n = {
    time: 0,
    millisecond: !1
  }, l = (c) => {
    Object.assign(n, c);
  };
  l(o);
  let m = o.time;
  const d = V({
    time: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }), i = (c, v) => {
    let b = !0;
    if (n.millisecond ? b = c !== d.time : b = Math.floor(c / 1e3) !== Math.floor(d.time / 1e3), !b)
      return;
    const g = 1e3, E = g * 60, R = E * 60, P = R * 24;
    let M = Math.max(0, c);
    const x = Math.floor(M / P);
    M -= P * x;
    const A = Math.floor(M / R);
    M -= R * A;
    const F = Math.floor(M / E);
    M -= E * F;
    const O = Math.floor(M / g), $ = M - g * O;
    Object.assign(d, { time: M, days: x, hours: A, minutes: F, seconds: O, milliseconds: $ }), !v && n.onChange && n.onChange({ ...d });
  };
  i(n.time, !0);
  let f = 0, u = null;
  const a = () => {
    u && (S(u), u = null);
  }, h = () => {
    if (a(), d.time <= 0) {
      f = 0;
      return;
    }
    u = s(() => {
      u = null, i(n.time - (Date.now() - f)), d.time > 0 ? h() : n.onFinish && n.onFinish();
    });
  }, D = () => {
    f || (f = Date.now(), h());
  }, y = () => {
    a(), n.time = d.time, f = 0;
  }, w = (c) => {
    y(), f = 0, l({ time: typeof (c == null ? void 0 : c.time) > "u" ? m : c.time, ...c }), m = n.time, i(n.time);
  };
  return k(() => a()), { current: d, start: D, pause: y, reset: w };
};
class p extends Error {
  status;
  customCode;
  config;
  constructor(e) {
    const r = typeof e == "object" ? e : { message: e };
    super(r.message), this.status = r.status, this.customCode = r.customCode, this.config = r.config;
  }
}
const J = (t) => {
  const e = t || {};
  return { request: async (o) => {
    var S;
    let s = { timeout: e.timeout || 6e4, ...o };
    if (typeof e.requestInterceptor == "function") {
      let n = e.requestInterceptor(s);
      q(n) && (n = await n), n && (s = { ...s, ...n });
    }
    s.headers && !s.header && (s.header = s.headers);
    try {
      const n = await uni.request(s), { data: l, statusCode: m, header: d } = n, { rejectErrorCode: i } = s;
      if (typeof e.validateStatus == "function" ? !e.validateStatus(m) : m > 299) {
        let a = "";
        throw (S = e.customCodeSet) != null && S.messageKey && l && typeof l == "object" && (a = l[e.customCodeSet.messageKey]), a || (a = `${m > 499 ? "服务忙" : "内部错误"}，请稍候重试...`), new p({ message: a, status: m, config: s });
      }
      let u = l;
      if (typeof e.responseInterceptor == "function") {
        let a = e.responseInterceptor({ data: l, status: m, config: o, headers: d });
        if (q(a))
          try {
            a = await a;
          } catch (h) {
            throw new p({ message: h.message || "系统开小差了", status: m, config: s });
          }
        typeof a < "u" && (u = a);
      }
      if (!u || typeof u != "object")
        return u;
      if (i !== !1 && e.customCodeSet) {
        const a = u[e.customCodeSet.key];
        let h = !0;
        if (Array.isArray(e.customCodeSet.okValue) ? h = e.customCodeSet.okValue.includes(a) : h = a === e.customCodeSet.okValue, !h)
          throw new p({ message: u[e.customCodeSet.messageKey], status: m, customCode: a, config: s });
      }
      return u;
    } catch (n) {
      const l = new p({
        message: `${n.status ? "" : "网络异常，请检查是否有网后再试-"}${n.message || n.errMsg || ""}`,
        status: n.status,
        customCode: n.customCode,
        config: s
      });
      throw typeof e.errorInterceptor == "function" ? e.errorInterceptor(l) : l;
    }
  } };
}, Q = () => {
  console.log("uniapp不支持");
}, Y = (t) => {
  const e = uni.createIntersectionObserver(t, { observeAll: !0, nativeMode: !0 });
  return { observer: (s) => {
    const S = { top: s.top || 0, bottom: s.bottom || 0, left: s.left || 0, right: s.right || 0 };
    s.root ? e.relativeTo(s.root, S) : e.relativeToViewport(S), e.observe(s.selector, (n) => {
      n.intersectionRatio > 0 && s.callback && s.callback(n.dataset);
    });
  }, disconnect: () => e.disconnect() };
};
export {
  p as RequestError,
  T as ZhuanpanPosition,
  C as ZhuanpanStatus,
  H as useCountDown,
  B as useCountTo,
  Y as useIntersectionObserver,
  J as useRequest,
  j as useRequestAnimationFrame,
  Q as useWeixinJsConfig,
  _ as useZhuanpan
};
