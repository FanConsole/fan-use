(function(A,M){typeof exports=="object"&&typeof module<"u"?M(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],M):(A=typeof globalThis<"u"?globalThis:A||self,M(A.FanUse={},A.Vue))})(this,function(A,M){"use strict";const N={line:"line",middle:"middle",random:"random"},O={static:"static",slowly:"slowly",playing:"playing"},z={n:8,radii:0,initialPosition:N.middle,defaultStatus:O.static,duration:3e3,roundDurationSlowly:5e4},B=u=>{let p,b;const f=M.reactive({itemList:[],itemMaxWidth:0,lineList:[],status:O.static,panStyle:"",panStyleSlowly:""}),S=()=>{f.status!==O.playing&&(p.defaultStatus===O.slowly?f.panStyleSlowly=`animation:fanZhuanpanSlowly ${p.roundDurationSlowly}ms linear infinite`:f.panStyleSlowly="")},d=s=>{if(f.status===O.playing)throw new Error("抽奖转动过程中不允许修改配置项");p={...p,...s},p.defaultStatus!==O.static&&p.defaultStatus!==O.slowly&&(p.defaultStatus=O.static),f.status=p.defaultStatus,t(),S()},a=s=>{const C=s/180*Math.PI;return 2*p.radii*Math.sin(C/2)},t=()=>{b=360/p.n;const s=new Array(p.n).fill(0),C=[];f.itemList=s.map((E,x)=>{const _={offsetDeg:p.initialPosition===N.line?b*x+b/2:b*x};return C.push({offsetDeg:_.offsetDeg+b/2}),_}),f.lineList=C,f.itemMaxWidth=a(b)};(()=>{d({...z,...u})})();let n=!0;const e=()=>{f.panStyle="",S(),n=!0};let l,v;const T=()=>{f.status=p.defaultStatus},c=s=>new Promise((C,E)=>{if(f.status===O.playing)return E(new Error("请等待上一条完成之后再试"));if(!n){e(),setTimeout(()=>{C(c(s))},300);return}n=!1,f.status=O.playing;let x=360*(p.duration*10/z.duration)-s.index*b+(p.initialPosition===N.line?0:b/2)-(p.endPosition===N.middle?b/2:Math.min(b*.8,Math.max(b*.2,b*Math.random())));f.panStyle=`transition:transform ${p.duration}ms;transform:rotate(${x}deg)`,f.panStyleSlowly!==""&&setTimeout(()=>{f.panStyleSlowly=""},p.duration/2),p.useElementEvent?(l=C,v=s):setTimeout(()=>{C(s),T()},p.duration)});return{state:f,ZhuanpanStatus:O,ZhuanpanPosition:N,setOptions:d,play:c,reset:e,onPanEnd:()=>{p.useElementEvent&&l&&(l(v),l=null,v=null,T())}}},K=(u,...p)=>{console.warn("FanUse:",u,...p)},H=u=>{let p;const b=(u==null?void 0:u.mp)!==!1,f=M.ref(!b||!(u!=null&&u.canvasSelector)),S=e=>setTimeout(e,16.666666666666668,Date.now()),d=e=>b?u!=null&&u.canvasSelector?p.requestAnimationFrame(e):S(e):window.requestAnimationFrame(e),a=e=>b?u!=null&&u.canvasSelector?p.cancelAnimationFrame(e):clearTimeout(e):window.cancelAnimationFrame(e),t=[],r=e=>{if(!b||f.value){e();return}t.push(e)},n=M.getCurrentInstance();return M.onMounted(()=>{u!=null&&u.canvasSelector&&uni.createSelectorQuery().in(n).select(u.canvasSelector).fields({node:!0},e=>{if((e==null?void 0:e.nodeCanvasType)!=="2d"||!e.node){K("useRequestAnimationFrame..","请传入正确的canvasSelector");return}if(p=e.node,f.value=!0,t.length){for(let l=0;l<t.length;l++)t[l]();t.length=0}}).exec()}),{rafReadyStatus:f,raf:d,cancelRaf:a,onRafReady:r}},G=u=>{const{initialValue:p,canvasSelector:b,mp:f,...S}=u||{},{raf:d,cancelRaf:a}=H({canvasSelector:b,mp:f}),t={duration:800,interval:20,minStep:1,decimal:0},r=M.ref(Number(p)||0),n=E=>{var x;Object.assign(t,{...E,decimal:typeof E.decimal<"u"?E.decimal:typeof E.minStep<"u"?((x=E.minStep.toString().split(".")[1])==null?void 0:x.length)||0:t.decimal})};n(S);let e=0,l=0,v=0,T=0,c=null;const m=()=>{c&&(a(c),c=null)},s=()=>{m(),c=d(()=>{c=null;const E=Date.now(),x=r.value,R=Math.ceil((E-e)/t.interval);let _=Number((l+T*R).toFixed(t.decimal));_=T<0?Math.max(v,_):Math.min(v,_),x!==_&&(r.value=_,u!=null&&u.onChange&&u.onChange(_)),r.value!==v?s():u!=null&&u.onFinish&&u.onFinish()})},C=E=>{const{value:x,...R}=E,_=Number(x);if(isNaN(_)){K("countTo..","请传入合法的value");return}_!==r.value&&(n(R),l=r.value,v=_,e=Date.now(),T=(v-r.value)/Math.ceil(t.duration/t.interval),T=T<0?Math.min(-Math.abs(t.minStep),T):Math.max(Math.abs(t.minStep),T),s())};return M.onUnmounted(()=>m()),{countValue:r,countTo:C}},Q=u=>{const{canvasSelector:p,mp:b,...f}=u||{},{raf:S,cancelRaf:d}=H({canvasSelector:p,mp:b}),a={time:0,millisecond:!1},t=E=>{Object.assign(a,E)};t(f);let r=f.time;const n=M.reactive({time:0,days:0,hours:0,minutes:0,seconds:0,milliseconds:0}),e=(E,x)=>{let R=!0;if(a.millisecond?R=E!==n.time:R=Math.floor(E/1e3)!==Math.floor(n.time/1e3),!R)return;const _=1e3,F=_*60,I=F*60,L=I*24;let P=Math.max(0,E);const q=Math.floor(P/L);P-=L*q;const V=Math.floor(P/I);P-=I*V;const U=Math.floor(P/F);P-=F*U;const k=Math.floor(P/_),W=P-_*k;Object.assign(n,{time:P,days:q,hours:V,minutes:U,seconds:k,milliseconds:W}),!x&&a.onChange&&a.onChange({...n})};e(a.time,!0);let l=0,v=null;const T=()=>{v&&(d(v),v=null)},c=()=>{if(T(),n.time<=0){l=0;return}v=S(()=>{v=null,e(a.time-(Date.now()-l)),n.time>0?c():a.onFinish&&a.onFinish()})},m=()=>{l||(l=Date.now(),c())},s=()=>{T(),a.time=n.time,l=0},C=E=>{s(),l=0,t({time:typeof(E==null?void 0:E.time)>"u"?r:E.time,...E}),r=a.time,e(a.time)};return M.onUnmounted(()=>T()),{current:n,start:m,pause:s,reset:C}};class j extends Error{status;customCode;config;constructor(p){const b=typeof p=="object"?p:{message:p};super(b.message),this.status=b.status,this.customCode=b.customCode,this.config=b.config}}var X=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},tt={exports:{}};/*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */(function(u,p){(function(f,S){u.exports=S()})(X,function(){return function(){var b={686:function(d,a,t){t.d(a,{default:function(){return ut}});var r=t(279),n=t.n(r),e=t(370),l=t.n(e),v=t(817),T=t.n(v);function c(g){try{return document.execCommand(g)}catch{return!1}}var m=function(i){var o=T()(i);return c("cut"),o},s=m;function C(g){var i=document.documentElement.getAttribute("dir")==="rtl",o=document.createElement("textarea");o.style.fontSize="12pt",o.style.border="0",o.style.padding="0",o.style.margin="0",o.style.position="absolute",o.style[i?"right":"left"]="-9999px";var y=window.pageYOffset||document.documentElement.scrollTop;return o.style.top="".concat(y,"px"),o.setAttribute("readonly",""),o.value=g,o}var E=function(i,o){var y=C(i);o.container.appendChild(y);var h=T()(y);return c("copy"),y.remove(),h},x=function(i){var o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{container:document.body},y="";return typeof i=="string"?y=E(i,o):i instanceof HTMLInputElement&&!["text","search","url","tel","password"].includes(i==null?void 0:i.type)?y=E(i.value,o):(y=T()(i),c("copy")),y},R=x;function _(g){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?_=function(o){return typeof o}:_=function(o){return o&&typeof Symbol=="function"&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_(g)}var F=function(){var i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},o=i.action,y=o===void 0?"copy":o,h=i.container,w=i.target,D=i.text;if(y!=="copy"&&y!=="cut")throw new Error('Invalid "action" value, use either "copy" or "cut"');if(w!==void 0)if(w&&_(w)==="object"&&w.nodeType===1){if(y==="copy"&&w.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if(y==="cut"&&(w.hasAttribute("readonly")||w.hasAttribute("disabled")))throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`)}else throw new Error('Invalid "target" value, use a valid Element');if(D)return R(D,{container:h});if(w)return y==="cut"?s(w):R(w,{container:h})},I=F;function L(g){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?L=function(o){return typeof o}:L=function(o){return o&&typeof Symbol=="function"&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},L(g)}function P(g,i){if(!(g instanceof i))throw new TypeError("Cannot call a class as a function")}function q(g,i){for(var o=0;o<i.length;o++){var y=i[o];y.enumerable=y.enumerable||!1,y.configurable=!0,"value"in y&&(y.writable=!0),Object.defineProperty(g,y.key,y)}}function V(g,i,o){return i&&q(g.prototype,i),o&&q(g,o),g}function U(g,i){if(typeof i!="function"&&i!==null)throw new TypeError("Super expression must either be null or a function");g.prototype=Object.create(i&&i.prototype,{constructor:{value:g,writable:!0,configurable:!0}}),i&&k(g,i)}function k(g,i){return k=Object.setPrototypeOf||function(y,h){return y.__proto__=h,y},k(g,i)}function W(g){var i=at();return function(){var y=Z(g),h;if(i){var w=Z(this).constructor;h=Reflect.construct(y,arguments,w)}else h=y.apply(this,arguments);return ot(this,h)}}function ot(g,i){return i&&(L(i)==="object"||typeof i=="function")?i:it(g)}function it(g){if(g===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return g}function at(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}function Z(g){return Z=Object.setPrototypeOf?Object.getPrototypeOf:function(o){return o.__proto__||Object.getPrototypeOf(o)},Z(g)}function Y(g,i){var o="data-clipboard-".concat(g);if(i.hasAttribute(o))return i.getAttribute(o)}var st=function(g){U(o,g);var i=W(o);function o(y,h){var w;return P(this,o),w=i.call(this),w.resolveOptions(h),w.listenClick(y),w}return V(o,[{key:"resolveOptions",value:function(){var h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};this.action=typeof h.action=="function"?h.action:this.defaultAction,this.target=typeof h.target=="function"?h.target:this.defaultTarget,this.text=typeof h.text=="function"?h.text:this.defaultText,this.container=L(h.container)==="object"?h.container:document.body}},{key:"listenClick",value:function(h){var w=this;this.listener=l()(h,"click",function(D){return w.onClick(D)})}},{key:"onClick",value:function(h){var w=h.delegateTarget||h.currentTarget,D=this.action(w)||"copy",$=I({action:D,container:this.container,target:this.target(w),text:this.text(w)});this.emit($?"success":"error",{action:D,text:$,trigger:w,clearSelection:function(){w&&w.focus(),window.getSelection().removeAllRanges()}})}},{key:"defaultAction",value:function(h){return Y("action",h)}},{key:"defaultTarget",value:function(h){var w=Y("target",h);if(w)return document.querySelector(w)}},{key:"defaultText",value:function(h){return Y("text",h)}},{key:"destroy",value:function(){this.listener.destroy()}}],[{key:"copy",value:function(h){var w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{container:document.body};return R(h,w)}},{key:"cut",value:function(h){return s(h)}},{key:"isSupported",value:function(){var h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:["copy","cut"],w=typeof h=="string"?[h]:h,D=!!document.queryCommandSupported;return w.forEach(function($){D=D&&!!document.queryCommandSupported($)}),D}}]),o}(n()),ut=st},828:function(d){var a=9;if(typeof Element<"u"&&!Element.prototype.matches){var t=Element.prototype;t.matches=t.matchesSelector||t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector||t.webkitMatchesSelector}function r(n,e){for(;n&&n.nodeType!==a;){if(typeof n.matches=="function"&&n.matches(e))return n;n=n.parentNode}}d.exports=r},438:function(d,a,t){var r=t(828);function n(v,T,c,m,s){var C=l.apply(this,arguments);return v.addEventListener(c,C,s),{destroy:function(){v.removeEventListener(c,C,s)}}}function e(v,T,c,m,s){return typeof v.addEventListener=="function"?n.apply(null,arguments):typeof c=="function"?n.bind(null,document).apply(null,arguments):(typeof v=="string"&&(v=document.querySelectorAll(v)),Array.prototype.map.call(v,function(C){return n(C,T,c,m,s)}))}function l(v,T,c,m){return function(s){s.delegateTarget=r(s.target,T),s.delegateTarget&&m.call(v,s)}}d.exports=e},879:function(d,a){a.node=function(t){return t!==void 0&&t instanceof HTMLElement&&t.nodeType===1},a.nodeList=function(t){var r=Object.prototype.toString.call(t);return t!==void 0&&(r==="[object NodeList]"||r==="[object HTMLCollection]")&&"length"in t&&(t.length===0||a.node(t[0]))},a.string=function(t){return typeof t=="string"||t instanceof String},a.fn=function(t){var r=Object.prototype.toString.call(t);return r==="[object Function]"}},370:function(d,a,t){var r=t(879),n=t(438);function e(c,m,s){if(!c&&!m&&!s)throw new Error("Missing required arguments");if(!r.string(m))throw new TypeError("Second argument must be a String");if(!r.fn(s))throw new TypeError("Third argument must be a Function");if(r.node(c))return l(c,m,s);if(r.nodeList(c))return v(c,m,s);if(r.string(c))return T(c,m,s);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function l(c,m,s){return c.addEventListener(m,s),{destroy:function(){c.removeEventListener(m,s)}}}function v(c,m,s){return Array.prototype.forEach.call(c,function(C){C.addEventListener(m,s)}),{destroy:function(){Array.prototype.forEach.call(c,function(C){C.removeEventListener(m,s)})}}}function T(c,m,s){return n(document.body,c,m,s)}d.exports=e},817:function(d){function a(t){var r;if(t.nodeName==="SELECT")t.focus(),r=t.value;else if(t.nodeName==="INPUT"||t.nodeName==="TEXTAREA"){var n=t.hasAttribute("readonly");n||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),n||t.removeAttribute("readonly"),r=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var e=window.getSelection(),l=document.createRange();l.selectNodeContents(t),e.removeAllRanges(),e.addRange(l),r=e.toString()}return r}d.exports=a},279:function(d){function a(){}a.prototype={on:function(t,r,n){var e=this.e||(this.e={});return(e[t]||(e[t]=[])).push({fn:r,ctx:n}),this},once:function(t,r,n){var e=this;function l(){e.off(t,l),r.apply(n,arguments)}return l._=r,this.on(t,l,n)},emit:function(t){var r=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),e=0,l=n.length;for(e;e<l;e++)n[e].fn.apply(n[e].ctx,r);return this},off:function(t,r){var n=this.e||(this.e={}),e=n[t],l=[];if(e&&r)for(var v=0,T=e.length;v<T;v++)e[v].fn!==r&&e[v].fn._!==r&&l.push(e[v]);return l.length?n[t]=l:delete n[t],this}},d.exports=a,d.exports.TinyEmitter=a}},f={};function S(d){if(f[d])return f[d].exports;var a=f[d]={exports:{}};return b[d](a,a.exports,S),a.exports}return function(){S.n=function(d){var a=d&&d.__esModule?function(){return d.default}:function(){return d};return S.d(a,{a}),a}}(),function(){S.d=function(d,a){for(var t in a)S.o(a,t)&&!S.o(d,t)&&Object.defineProperty(d,t,{enumerable:!0,get:a[t]})}}(),function(){S.o=function(d,a){return Object.prototype.hasOwnProperty.call(d,a)}}(),S(686)}().default})})(tt);function J(u){return u instanceof Promise||typeof(u==null?void 0:u.then)=="function"}const et=u=>{const{timeout:p,requestInterceptor:b,responseInterceptor:f,customCodeSet:S,errorInterceptor:d}=u||{};return{request:async t=>{let r={timeout:p||6e4,...t};if(typeof b=="function"){let n=b(r);J(n)&&(n=await n),n&&(r={...r,...n})}r.headers&&!r.header&&(r.header=r.headers);try{const n=await uni.request(r),{data:e,statusCode:l,header:v}=n,{rejectErrorCode:T}=r;if(l>299){let m="";throw S!=null&&S.messageKey&&e&&typeof e=="object"&&(m=e[S.messageKey]),m||(m=`${l>499?"服务忙":"内部错误"}，请稍候重试...`),new j({message:m,status:l,config:r})}let c=e;if(typeof f=="function"){let m=f({data:e,status:l,config:t,headers:v});if(J(m))try{m=await m}catch(s){throw new j({message:s.message||"系统开小差了",status:l,config:r})}typeof m<"u"&&(c=m)}if(!c||typeof c!="object")return c;if(T!==!1&&S){const m=c[S.key];let s=!0;if(Array.isArray(S.okValue)?s=S.okValue.includes(m):s=m===S.okValue,!s)throw new j({message:c[S.messageKey],status:l,customCode:m,config:r})}return c}catch(n){const e=new j({message:`${n.status?"":"网络异常，请检查是否有网后再试-"}${n.message||n.errMsg||""}`,status:n.status,customCode:n.customCode,config:r});throw typeof d=="function"?d(e):e}}}},nt=()=>{console.log("uniapp不支持")},rt=()=>{const u=uni.createIntersectionObserver(M.getCurrentInstance(),{observeAll:!0});return{observer:f=>{const S={top:f.top||0,bottom:f.bottom||0,left:f.left||0,right:f.right||0};f.root?u.relativeTo(f.root,S):u.relativeToViewport(S),u.observe(f.selector,d=>{d.intersectionRatio>0&&f.callback&&f.callback(d.dataset)})},disconnect:()=>u.disconnect()}};A.RequestError=j,A.ZhuanpanPosition=N,A.ZhuanpanStatus=O,A.useCountDown=Q,A.useCountTo=G,A.useIntersectionObserver=rt,A.useRequest=et,A.useRequestAnimationFrame=H,A.useWeixinJsConfig=nt,A.useZhuanpan=B,Object.defineProperty(A,Symbol.toStringTag,{value:"Module"})});
