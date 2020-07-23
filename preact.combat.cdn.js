
import{useState as n,useReducer as t,useEffect as e,useLayoutEffect as r,useRef as o,useImperativeHandle as u,useMemo as i,useCallback as f,useContext as c,useDebugValue as a}from"https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";export*from"https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";import{Component as l,createElement as s,options as v,toChildArray as h,Fragment as d,hydrate as p,render as m,__u as y,cloneElement as b,createRef as S,createContext as g}from"https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";export{createElement,createContext,createRef,Fragment,Component}from"https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";function w(n,t){for(var e in t)n[e]=t[e];return n}function x(n,t){for(var e in n)if("__source"!==e&&!(e in t))return!0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return!0;return!1}var E=function(n){var t,e;function r(t){var e;return(e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return x(this.props,n)||x(this.state,t)},r}(l);function C(n,t){function e(n){var e=this.props.ref,r=e==n.ref;return!r&&e&&(e.call?e(null):e.current=null),t?!t(this.props,n)||!r:x(this.props,n)}function r(t){return this.shouldComponentUpdate=e,s(n,t)}return r.prototype.isReactComponent=!0,r.displayName="Memo("+(n.displayName||n.name)+")",r.t=!0,r}var _=v.__b;v.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),_&&_(n)};var A="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function k(n){function t(t,e){var r=w({},t);return delete r.ref,n(r,(e=t.ref||e)&&("object"!=typeof e||"current"in e)?e:null)}return t.$$typeof=A,t.render=t,t.prototype.isReactComponent=t.t=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var R=function(n,t){return n?h(n).reduce(function(n,e,r){return n.concat(t(e,r))},[]):null},F={map:R,forEach:R,count:function(n){return n?h(n).length:0},only:function(n){if(1!==(n=h(n)).length)throw new Error("Children.only() expects only one child.");return n[0]},toArray:h},N=v.__e;function U(n){return n&&((n=w({},n)).__c=null,n.__k=n.__k&&n.__k.map(U)),n}function M(){this.__u=0,this.o=null,this.__b=null}function j(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function L(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n},function(n){r=n}),r)throw r;if(!e)throw t;return s(e,o)}return o.displayName="Lazy",o.t=!0,o}function O(){this.i=null,this.l=null}v.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);N(n,t,e)},(M.prototype=new l).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=j(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i())};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c()};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate()};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u)},M.prototype.render=function(n,t){return this.__b&&(this.__v.__k&&(this.__v.__k[0]=U(this.__b)),this.__b=null),[s(d,null,t.u?null:n.children),t.u&&n.fallback]};var P=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2]}};(O.prototype=new l).u=function(n){var t=this,e=j(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),P(t,n,r)):o()};e?e(u):u()}},O.prototype.render=function(n){this.i=null,this.l=new Map;var t=h(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},O.prototype.componentDidUpdate=O.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){P(n,e,t)})};var W=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();function z(n){var t=this,e=n.container,r=s(W,{context:t.context},n.vnode);return t.s&&t.s!==e&&(t.v.parentNode&&t.s.removeChild(t.v),y(t.h),t.p=!1),n.vnode?t.p?(e.__k=t.__k,m(r,e),t.__k=e.__k):(t.v=document.createTextNode(""),p("",e),e.appendChild(t.v),t.p=!0,t.s=e,m(r,e,t.v),t.__k=t.v.__k):t.p&&(t.v.parentNode&&t.s.removeChild(t.v),y(t.h)),t.h=r,t.componentWillUnmount=function(){t.v.parentNode&&t.s.removeChild(t.v),y(t.h)},null}function D(n,t){return s(z,{vnode:n,container:t})}var H=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;l.prototype.isReactComponent={};var T="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;function V(n,t,e){if(null==t.__k)for(;t.firstChild;)t.removeChild(t.firstChild);return m(n,t),"function"==typeof e&&e(),n?n.__c:null}function Z(n,t,e){return p(n,t),"function"==typeof e&&e(),n?n.__c:null}var I=v.event;function $(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n}})}v.event=function(n){I&&(n=I(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var q={configurable:!0,get:function(){return this.class}},B=v.vnode;v.vnode=function(n){n.$$typeof=T;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&(q.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",q)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(h(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0)}),delete e.value),e)if(r=H.test(u))break;if(r)for(u in o=n.props={},e)o[H.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u]}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange])}}}(),"function"==typeof t&&!t.m&&t.prototype&&($(t.prototype,"componentWillMount"),$(t.prototype,"componentWillReceiveProps"),$(t.prototype,"componentWillUpdate"),t.m=!0)}B&&B(n)};var G="16.8.0";function J(n){return s.bind(null,n)}function K(n){return!!n&&n.$$typeof===T}function Q(n){return K(n)?b.apply(null,arguments):n}function X(n){return!!n.__k&&(m(null,n),!0)}function Y(n){return n&&(n.base||1===n.nodeType&&n)||null}var nn=function(n,t){return n(t)},tn=d;export default{useState:n,useReducer:t,useEffect:e,useLayoutEffect:r,useRef:o,useImperativeHandle:u,useMemo:i,useCallback:f,useContext:c,useDebugValue:a,version:"16.8.0",Children:F,render:V,hydrate:Z,unmountComponentAtNode:X,createPortal:D,createElement:s,createContext:g,createFactory:J,cloneElement:Q,createRef:S,Fragment:d,isValidElement:K,findDOMNode:Y,Component:l,PureComponent:E,memo:C,forwardRef:k,unstable_batchedUpdates:nn,StrictMode:d,Suspense:M,SuspenseList:O,lazy:L};export{G as version,F as Children,V as render,Z as hydrate,X as unmountComponentAtNode,D as createPortal,J as createFactory,Q as cloneElement,K as isValidElement,Y as findDOMNode,E as PureComponent,C as memo,k as forwardRef,nn as unstable_batchedUpdates,tn as StrictMode,M as Suspense,O as SuspenseList,L as lazy};
//# sourceMappingURL=compat.module.js.map
