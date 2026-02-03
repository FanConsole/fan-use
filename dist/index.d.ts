declare module "common/interfaces/index" {
    export type ValueOf<T> = T[keyof T];
    /**
     * 小程序帧动画的特殊选项参数
     *
     * @property {string} canvasSelector?: 仅小程序有效，canvas元素的选择器，如 #rafCanvas。不传则用 setTimeout 模拟。
     *   canvas元素自行添加，如：\<canvas type="2d" id="rafCanvas" style="width: 0; height: 0; pointer-events: none" />
     *
     * @property {boolean} mp?: 是否小程序，uniapp等跨平台框架项目有效，在框架需要输出H5时会有用（打包会使条件注释丢失，故要以参数由外部传入，默认true）
     */
    export interface MpAnimationFrameOptions {
        canvasSelector?: string;
        mp?: boolean;
    }
}
declare module "use-zhuanpan/index" {
    import { type ValueOf } from "common/interfaces/index";
    export const ZhuanpanPosition: {
        line: string;
        middle: string;
        random: string;
    };
    export const ZhuanpanStatus: {
        static: string;
        slowly: string;
        playing: string;
    };
    export interface UseZhuanpanOptions {
        n?: number;
        radii?: number;
        initialPosition?: ValueOf<typeof ZhuanpanPosition>;
        endPosition?: ValueOf<typeof ZhuanpanPosition>;
        defaultStatus?: ValueOf<typeof ZhuanpanStatus>;
        duration?: number;
        roundDurationSlowly?: number;
        useElementEvent?: boolean;
    }
    /**
     * 转盘
     * @param options -{
     *   n?: 转盘格子数量，默认8；
     *   radii?: 转盘半径，默认0，用于计算出每个格子相对（所以这里不处理单位）的最大宽度；
     *   initialPosition?: 初始位置，ZhuanpanPosition.middle（默认）| ZhuanpanPosition.line；
     *   endPosition?: 抽奖转动结束位置，ZhuanpanPosition.middle | ZhuanpanPosition.random（默认）；
     *   defaultStatus?: 非抽奖时的状态，ZhuanpanStatus.static（默认）| ZhuanpanStatus.slowly（需引入./index.css）；
     *   duration?: 主转盘抽奖时转动时长，ms，默认3000；
     *   roundDurationSlowly?: 缓动盘转一周的时长，ms，默认50000；
     *   useElementEvent?: 是否使用元素事件触发抽奖转动结束（与动画精准一致，需设置onPanEnd到主转盘的transitionend事件），默认使用duration结合定时器（与动画可能存在微小不一致）；
     * }
     * @description 需要 defaultStatus=ZhuanpanStatus.slowly 的，渲染节点用双盘配合 state.panStyleSlowly，详见demo
     */
    export const useZhuanpan: (options?: UseZhuanpanOptions) => {
        state: {
            itemList: {
                offsetDeg: number;
            }[];
            itemMaxWidth: number;
            lineList: {
                offsetDeg: number;
            }[];
            status: ValueOf<typeof ZhuanpanStatus>;
            panStyle: string;
            panStyleSlowly: string;
        };
        ZhuanpanStatus: {
            static: string;
            slowly: string;
            playing: string;
        };
        ZhuanpanPosition: {
            line: string;
            middle: string;
            random: string;
        };
        setOptions: (options: UseZhuanpanOptions) => void;
        play: (params: {
            index: number;
        }) => Promise<unknown>;
        reset: () => void;
        onPanEnd: () => void;
    };
}
declare module "use-request-animation-frame/index" {
    import { MpAnimationFrameOptions } from "common/interfaces/index";
    export const useRequestAnimationFrame: (opt?: MpAnimationFrameOptions) => {
        rafReadyStatus: import("vue").Ref<boolean>;
        raf: ((callback: FrameRequestCallback) => number) & typeof requestAnimationFrame;
        cancelRaf: ((handle: number) => void) & typeof cancelAnimationFrame;
        onRafReady: (fn: FrameRequestCallback) => number;
    };
}
declare module "utils/index" {
    export const inBrowser: boolean;
    export const libLogWarn: (message?: any, ...optionalParams: any[]) => void;
}
declare module "use-count-to/index" {
    import { MpAnimationFrameOptions } from "common/interfaces/index";
    /**
     * @property {number} duration 数值变化总时长，ms，默认800
     * @property {number} interval 数值更新间隔，ms，默认20
     * @property {number} minStep 一次数值更新的最小差值，ms，默认1，若总的变化范围<=该值，则不会有动画过程
     * @property {number} decimal 数值小数位数（精度），默认0
     */
    interface CountToSettings {
        duration?: number;
        interval?: number;
        minStep?: number;
        decimal?: number;
    }
    interface CountToOptions {
        initialValue?: number | string;
        onChange?: (value: number) => void;
        onFinish?: () => void;
    }
    export const useCountTo: (opt?: MpAnimationFrameOptions & CountToSettings & CountToOptions) => {
        countValue: import("vue").Ref<number>;
        countTo: (params: CountToSettings & {
            value: number | string;
        }) => void;
    };
}
declare module "use-count-down/index" {
    import { MpAnimationFrameOptions } from "common/interfaces/index";
    interface CountDownCurrent {
        time: number;
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        milliseconds: number;
    }
    /**
     * @property {number} time 倒计时时长，毫秒级时间戳
     * @property {boolean} millisecond? 是否开启毫秒级渲染，默认false
     * @property {function} onChange?
     * @property {function} onFinish?
     */
    interface CountDownOptions {
        time: number;
        millisecond?: boolean;
        onChange?: (current: CountDownCurrent) => void;
        onFinish?: () => void;
    }
    export const useCountDown: (opt: MpAnimationFrameOptions & CountDownOptions) => {
        current: {
            time: number;
            days: number;
            hours: number;
            minutes: number;
            seconds: number;
            milliseconds: number;
        };
        start: () => void;
        pause: () => void;
        reset: (opt?: {
            time?: number;
            millisecond?: boolean;
        }) => void;
    };
}
declare module "use-request/interface" {
    /**
     * @property rejectErrorCode -结合 UseRequestOptions?.customCodeSet 决定是否把服务端约定的非成功状态自动作为错误处理
     * @property ext -预留字段，完全自定义
     */
    export interface RequestConfig<T = any> {
        url?: string;
        timeout?: number;
        method?: 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'options' | 'OPTIONS' | string;
        data?: T;
        headers?: Record<string, string> & any;
        rejectErrorCode?: boolean;
        ext?: any;
    }
    /**
     * @property data -responseData
     * @property status -responseStatus
     * @property headers -responseHeaders
     * @property config -RequestConfig
     */
    export interface RequestResponse<T = any, D = any> {
        data: T;
        status: number;
        headers: Record<string, string> & any;
        config: RequestConfig<D>;
    }
    export class RequestError extends Error {
        status: number | undefined;
        customCode: number | string | undefined;
        config: RequestConfig | undefined;
        constructor(data?: string | undefined | {
            message?: string;
            status?: number;
            customCode?: number | string;
            config?: RequestConfig;
        });
    }
    /**
     * @property timeout -超时时间，ms，默认60000
     * @property requestInterceptor -请求拦截器函数
     * @property responseInterceptor -返回拦截器函数
     * @property customCodeSet -服务端自定义的状态码及成功标识
     * @property validateStatus -校验状态码是否为“成功”，否则会进error处理，默认值：status => status >= 200 && status < 300
     * @property errorInterceptor -错误拦截器函数
     */
    export interface UseRequestOptions {
        timeout?: number;
        requestInterceptor?: (options: RequestConfig) => RequestConfig | undefined | void | Promise<RequestConfig | undefined | void>;
        responseInterceptor?: (response: RequestResponse) => any | Promise<any>;
        customCodeSet?: {
            key: string;
            okValue: number | string | Array<number | string>;
            messageKey: string;
        };
        validateStatus?: ((status: number) => boolean) | null | undefined;
        errorInterceptor?: (error: RequestError) => RequestError | Error;
    }
}
declare module "common/index" {
    export const foreverPending: () => Promise<unknown>;
}
declare module "use-request/index" {
    import { type UseRequestOptions } from "use-request/interface";
    export * from "use-request/interface";
    module 'axios' {
        interface AxiosRequestConfig {
            rejectErrorCode?: boolean;
            ext?: any;
        }
    }
    export const useRequest: (options?: UseRequestOptions) => {
        request: import("axios").AxiosInstance;
    };
}
declare module "use-weixin-sdk/index" {
    global {
        interface Window {
            wx?: any;
            fanWeixinSdk?: ReturnType<typeof createInstance>;
        }
    }
    export interface WeixinConfigData {
        config: Record<string, any>;
        shareData?: {
            link: string;
            title: string;
            desc: string;
            imgUrl: string;
        };
    }
    export type WeixinConfigDataGetter = (params: {
        url: string;
    }) => WeixinConfigData | Promise<WeixinConfigData>;
    const createInstance: (opt?: {
        configGetter?: WeixinConfigDataGetter;
        sdkLoadedUrl?: string;
    }) => {
        configWeixinJs: (params?: {
            configGetter?: WeixinConfigDataGetter | undefined;
        } | undefined) => Promise<unknown>;
        onConfigReady: (fn: Function, params?: {
            url?: string;
        }) => Promise<void>;
        removeReadyCallback: (params?: {
            url?: string;
            fn?: Function;
        }) => void;
    };
    /**
     * useWeixinJsConfig 单例
     * @param opt {
     *   configGetter: 配置数据获取器（函数），会收到参数：
     *     url：string
     *    configGetter 请求 wxJsConfig 时的 url 一般传这个就好
     *
     *   sdkLoadedUrl?: 自定义手动加载 wxjssdk 文件，加载文件时的页面 url，默认 useWeixinJsConfig 自动加载
     * }
     * @returns wx.ready 完成了
     */
    export const useWeixinJsConfig: (opt?: {
        configGetter?: WeixinConfigDataGetter;
        sdkLoadedUrl?: string;
    }) => {
        configWeixinJs: (params?: {
            configGetter?: WeixinConfigDataGetter | undefined;
        } | undefined) => Promise<unknown>;
        onConfigReady: (fn: Function, params?: {
            url?: string;
        }) => Promise<void>;
        removeReadyCallback: (params?: {
            url?: string;
            fn?: Function;
        }) => void;
    };
}
declare module "use-intersection-observer/interface" {
    export interface ObserverOptions {
        selector: string;
        root?: string;
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        callback?: (dataset: Record<string, unknown>) => never | void;
    }
}
declare module "use-intersection-observer/index" {
    import { EffectScope } from 'vue';
    import { ObserverOptions } from "use-intersection-observer/interface";
    /**
     * @param _this 为 getCurrentInstance() 兼容小程序
     * @returns
     */
    export const useIntersectionObserver: (_this: EffectScope) => {
        observer: (opt: ObserverOptions) => Promise<void>;
        disconnect: () => void;
    };
}
declare module "fan-use" {
    export * from "use-zhuanpan/index";
    export * from "use-request-animation-frame/index";
    export * from "use-count-to/index";
    export * from "use-count-down/index";
    export * from "use-request/index";
    export * from "use-weixin-sdk/index";
    export * from "use-intersection-observer/index";
}
