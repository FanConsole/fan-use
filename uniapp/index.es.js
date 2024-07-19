import { reactive as k, ref as p, getCurrentInstance as U, onMounted as W, onUnmounted as I } from "vue";
import { isPromiseLike as V } from "fan-utils";
const T = {
  // 在线上（左线）
  line: "line",
  // 在格子中间
  middle: "middle",
  // 格子内随机
  random: "random"
}, b = {
  // 静止的
  static: "static",
  // 缓慢转动着
  slowly: "slowly",
  playing: "playing"
}, N = {
  n: 8,
  radii: 0,
  initialPosition: T.middle,
  defaultStatus: b.static,
  duration: 3e3,
  roundDurationSlowly: 5e4
}, _ = (t) => {
  let e, i;
  const a = k({
    itemList: [],
    itemMaxWidth: 0,
    lineList: [],
    status: b.static,
    panStyle: "",
    panStyleSlowly: ""
  }), o = () => {
    a.status !== b.playing && (e.defaultStatus === b.slowly ? a.panStyleSlowly = `animation:fanZhuanpanSlowly ${e.roundDurationSlowly}ms linear infinite` : a.panStyleSlowly = "");
  }, w = (f) => {
    if (a.status === b.playing)
      throw new Error("抽奖转动过程中不允许修改配置项");
    e = { ...e, ...f }, e.defaultStatus !== b.static && e.defaultStatus !== b.slowly && (e.defaultStatus = b.static), a.status = e.defaultStatus, u(), o();
  }, m = (f) => {
    const M = f / 180 * Math.PI;
    return 2 * e.radii * Math.sin(M / 2);
  }, u = () => {
    i = 360 / e.n;
    const f = new Array(e.n).fill(0), M = [];
    a.itemList = f.map((c, v) => {
      const y = {
        offsetDeg: e.initialPosition === T.line ? i * v + i / 2 : i * v
        // 渲染时相对Y轴旋转的角度
      };
      return M.push({
        offsetDeg: y.offsetDeg + i / 2
      }), y;
    }), a.lineList = M, a.itemMaxWidth = m(i);
  };
  (() => {
    w({ ...N, ...t });
  })();
  let s = !0;
  const n = () => {
    a.panStyle = "", o(), s = !0;
  };
  let l, g;
  const S = () => {
    a.status = e.defaultStatus;
  }, h = (f) => new Promise((M, c) => {
    if (a.status === b.playing)
      return c(new Error("请等待上一条完成之后再试"));
    if (!s) {
      n(), setTimeout(() => {
        M(h(f));
      }, 300);
      return;
    }
    s = !1, a.status = b.playing;
    let v = 360 * (e.duration * 10 / N.duration) - f.index * i + (e.initialPosition === T.line ? 0 : i / 2) - (e.endPosition === T.middle ? i / 2 : Math.min(i * 0.8, Math.max(i * 0.2, i * Math.random())));
    a.panStyle = `transition:transform ${e.duration}ms;transform:rotate(${v}deg)`, a.panStyleSlowly !== "" && setTimeout(() => {
      a.panStyleSlowly = "";
    }, e.duration / 2), e.useElementEvent ? (l = M, g = f) : setTimeout(() => {
      M(f), S();
    }, e.duration);
  });
  return { state: a, ZhuanpanStatus: b, ZhuanpanPosition: T, setOptions: w, play: h, reset: n, onPanEnd: () => {
    e.useElementEvent && l && (l(g), l = null, g = null, S());
  } };
}, L = (t, ...e) => {
  console.warn("FanUse:", t, ...e);
}, j = (t) => {
  let e;
  const i = (t == null ? void 0 : t.mp) !== !1, a = p(!i || !(t != null && t.canvasSelector)), o = (n) => setTimeout(n, 16.666666666666668, Date.now()), w = (n) => i ? t != null && t.canvasSelector ? e.requestAnimationFrame(n) : o(n) : window.requestAnimationFrame(n), m = (n) => i ? t != null && t.canvasSelector ? e.cancelAnimationFrame(n) : clearTimeout(n) : window.cancelAnimationFrame(n), u = [], r = (n) => {
    if (!i || a.value) {
      n();
      return;
    }
    u.push(n);
  }, s = U();
  return W(() => {
    t != null && t.canvasSelector && uni.createSelectorQuery().in(s).select(t.canvasSelector).fields({ node: !0 }, (n) => {
      if ((n == null ? void 0 : n.nodeCanvasType) !== "2d" || !n.node) {
        L("useRequestAnimationFrame..", "请传入正确的canvasSelector");
        return;
      }
      if (e = n.node, a.value = !0, u.length) {
        for (let l = 0; l < u.length; l++)
          u[l]();
        u.length = 0;
      }
    }).exec();
  }), { rafReadyStatus: a, raf: w, cancelRaf: m, onRafReady: r };
}, B = (t) => {
  const { initialValue: e, canvasSelector: i, mp: a, ...o } = t || {}, { raf: w, cancelRaf: m } = j({ canvasSelector: i, mp: a }), u = {
    duration: 800,
    interval: 20,
    minStep: 1,
    decimal: 0
  }, r = p(Number(e) || 0), s = (c) => {
    var v;
    Object.assign(u, {
      ...c,
      decimal: typeof c.decimal < "u" ? c.decimal : typeof c.minStep < "u" ? ((v = c.minStep.toString().split(".")[1]) == null ? void 0 : v.length) || 0 : u.decimal
    });
  };
  s(o);
  let n = 0, l = 0, g = 0, S = 0, h = null;
  const d = () => {
    h && (m(h), h = null);
  }, f = () => {
    d(), h = w(() => {
      h = null;
      const c = Date.now(), v = r.value, D = Math.ceil((c - n) / u.interval);
      let y = Number((l + S * D).toFixed(u.decimal));
      y = S < 0 ? Math.max(g, y) : Math.min(g, y), v !== y && (r.value = y, t != null && t.onChange && t.onChange(y)), r.value !== g ? f() : t != null && t.onFinish && t.onFinish();
    });
  }, M = (c) => {
    const { value: v, ...D } = c, y = Number(v);
    if (isNaN(y)) {
      L("countTo..", "请传入合法的value");
      return;
    }
    y !== r.value && (s(D), l = r.value, g = y, n = Date.now(), S = (g - r.value) / Math.ceil(u.duration / u.interval), S = S < 0 ? Math.min(-Math.abs(u.minStep), S) : Math.max(Math.abs(u.minStep), S), f());
  };
  return I(() => d()), { countValue: r, countTo: M };
}, H = (t) => {
  const { canvasSelector: e, mp: i, ...a } = t || {}, { raf: o, cancelRaf: w } = j({ canvasSelector: e, mp: i }), m = {
    time: 0,
    millisecond: !1
  }, u = (c) => {
    Object.assign(m, c);
  };
  u(a);
  let r = a.time;
  const s = k({
    time: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }), n = (c, v) => {
    let D = !0;
    if (m.millisecond ? D = c !== s.time : D = Math.floor(c / 1e3) !== Math.floor(s.time / 1e3), !D)
      return;
    const y = 1e3, E = y * 60, P = E * 60, x = P * 24;
    let C = Math.max(0, c);
    const A = Math.floor(C / x);
    C -= x * A;
    const F = Math.floor(C / P);
    C -= P * F;
    const O = Math.floor(C / E);
    C -= E * O;
    const q = Math.floor(C / y), $ = C - y * q;
    Object.assign(s, { time: C, days: A, hours: F, minutes: O, seconds: q, milliseconds: $ }), !v && m.onChange && m.onChange({ ...s });
  };
  n(m.time, !0);
  let l = 0, g = null;
  const S = () => {
    g && (w(g), g = null);
  }, h = () => {
    if (S(), s.time <= 0) {
      l = 0;
      return;
    }
    g = o(() => {
      g = null, n(m.time - (Date.now() - l)), s.time > 0 ? h() : m.onFinish && m.onFinish();
    });
  }, d = () => {
    l || (l = Date.now(), h());
  }, f = () => {
    S(), m.time = s.time, l = 0;
  }, M = (c) => {
    f(), l = 0, u({ time: typeof (c == null ? void 0 : c.time) > "u" ? r : c.time, ...c }), r = m.time, n(m.time);
  };
  return I(() => S()), { current: s, start: d, pause: f, reset: M };
};
class R extends Error {
  status;
  customCode;
  config;
  constructor(e) {
    const i = typeof e == "object" ? e : { message: e };
    super(i.message), this.status = i.status, this.customCode = i.customCode, this.config = i.config;
  }
}
const J = (t) => {
  const { timeout: e, requestInterceptor: i, responseInterceptor: a, customCodeSet: o, errorInterceptor: w } = t || {};
  return { request: async (u) => {
    let r = { timeout: e || 6e4, ...u };
    if (typeof i == "function") {
      let s = i(r);
      V(s) && (s = await s), s && (r = { ...r, ...s });
    }
    r.headers && !r.header && (r.header = r.headers);
    try {
      const s = await uni.request(r), { data: n, statusCode: l, header: g } = s, { rejectErrorCode: S } = r;
      if (l > 299) {
        let d = "";
        throw o != null && o.messageKey && n && typeof n == "object" && (d = n[o.messageKey]), d || (d = `${l > 499 ? "服务忙" : "内部错误"}，请稍候重试...`), new R({ message: d, status: l, config: r });
      }
      let h = n;
      if (typeof a == "function") {
        let d = a({ data: n, status: l, config: u, headers: g });
        if (V(d))
          try {
            d = await d;
          } catch (f) {
            throw new R({ message: f.message || "系统开小差了", status: l, config: r });
          }
        typeof d < "u" && (h = d);
      }
      if (!h || typeof h != "object")
        return h;
      if (S !== !1 && o) {
        const d = h[o.key];
        let f = !0;
        if (Array.isArray(o.okValue) ? f = o.okValue.includes(d) : f = d === o.okValue, !f)
          throw new R({ message: h[o.messageKey], status: l, customCode: d, config: r });
      }
      return h;
    } catch (s) {
      const n = new R({
        message: `${s.status ? "" : "网络异常，请检查是否有网后再试-"}${s.message || s.errMsg || ""}`,
        status: s.status,
        customCode: s.customCode,
        config: r
      });
      throw typeof w == "function" ? w(n) : n;
    }
  } };
}, Q = () => {
  console.log("uniapp不支持");
}, Y = (t) => {
  const e = uni.createIntersectionObserver(t, { observeAll: !0 });
  return { observer: (o) => {
    const w = { top: o.top || 0, bottom: o.bottom || 0, left: o.left || 0, right: o.right || 0 };
    o.root ? e.relativeTo(o.root, w) : e.relativeToViewport(w), e.observe(o.selector, (m) => {
      m.intersectionRatio > 0 && o.callback && o.callback(m.dataset);
    });
  }, disconnect: () => e.disconnect() };
};
export {
  R as RequestError,
  T as ZhuanpanPosition,
  b as ZhuanpanStatus,
  H as useCountDown,
  B as useCountTo,
  Y as useIntersectionObserver,
  J as useRequest,
  j as useRequestAnimationFrame,
  Q as useWeixinJsConfig,
  _ as useZhuanpan
};
