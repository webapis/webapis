var n,u,i,t,o,r,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var i,t=arguments,o={};for(i in l)"key"!==i&&"ref"!==i&&(o[i]=l[i]);if(arguments.length>3)for(u=[u],i=3;i<arguments.length;i++)u.push(t[i]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===o[i]&&(o[i]=n.defaultProps[i]);return p(n,o,l&&l.key,l&&l.ref,null)}function p(l,u,i,t,o){var r={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),n.vnode&&n.vnode(r),r}function d(n){return n.children}function m(n,l){this.props=n,this.context=l;}function w(n,l){if(null==l)return n.__?w(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?w(n):null}function g(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return g(n)}}function k(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!i++||o!==n.debounceRendering)&&((o=n.debounceRendering)||t)(_);}function _(){for(var n;i=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(i=a({},o)).__v=i,t=A(f,o,i,l.__n,void 0!==f.ownerSVGElement,null,u,null==r?w(o):r),T(u,o),t!=r&&g(o)));});}function b(n,l,u,i,t,o,r,f,s){var a,h,p,y,d,m,g,k=u&&u.__k||c,_=k.length;if(f==e&&(f=null!=o?o[0]:_?w(u,0):null),a=0,l.__k=x(l.__k,function(u){if(null!=u){if(u.__=l,u.__b=l.__b+1,null===(p=k[a])||p&&u.key==p.key&&u.type===p.type)k[a]=void 0;else for(h=0;h<_;h++){if((p=k[h])&&u.key==p.key&&u.type===p.type){k[h]=void 0;break}p=null;}if(y=A(n,u,p=p||e,i,t,o,r,f,s),(h=u.ref)&&p.ref!=h&&(g||(g=[]),p.ref&&g.push(p.ref,null,u),g.push(h,u.__c||y,u)),null!=y){var c;if(null==m&&(m=y),void 0!==u.__d)c=u.__d,u.__d=void 0;else if(o==p||y!=f||null==y.parentNode){n:if(null==f||f.parentNode!==n)n.appendChild(y),c=null;else {for(d=f,h=0;(d=d.nextSibling)&&h<_;h+=2)if(d==y)break n;n.insertBefore(y,f),c=f;}"option"==l.type&&(n.value="");}f=void 0!==c?c:y.nextSibling,"function"==typeof l.type&&(l.__d=f);}else f&&p.__e==f&&f.parentNode!=n&&(f=w(p));}return a++,u}),l.__e=m,null!=o&&"function"!=typeof l.type)for(a=o.length;a--;)null!=o[a]&&v(o[a]);for(a=_;a--;)null!=k[a]&&D(k[a],k[a]);if(g)for(a=0;a<g.length;a++)j(g[a],g[++a],g[++a]);}function x(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var i=0;i<n.length;i++)x(n[i],l,u);else u.push(l?l("string"==typeof n||"number"==typeof n?p(null,n,null,null,n):null!=n.__e||null!=n.__c?p(n.type,n.props,n.key,null,n.__v):n):n);return u}function P(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||N(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||N(n,o,l[o],u[o],i);}function C(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===s.test(l)?u+"px":null==u?"":u;}function N(n,l,u,i,t){var o,r,f,e,c;if(t?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else {if("string"==typeof i&&(o.cssText="",i=null),i)for(e in i)u&&e in u||C(o,e,"");if(u)for(c in u)i&&u[c]===i[c]||C(o,c,u[c]);}else "o"===l[0]&&"n"===l[1]?(r=l!==(l=l.replace(/Capture$/,"")),f=l.toLowerCase(),l=(f in n?f:l).slice(2),u?(i||n.addEventListener(l,z,r),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,z,r)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u));}function z(l){this.l[l.type](n.event?n.event(l):l);}function A(l,u,i,t,o,r,f,e,c){var s,v,h,p,y,w,g,k,_,x,P=u.type;if(void 0!==u.constructor)return null;(s=n.__b)&&s(u);try{n:if("function"==typeof P){if(k=u.props,_=(s=P.contextType)&&t[s.__c],x=s?_?_.props.value:s.__:t,i.__c?g=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(k,x):(u.__c=v=new m(k,x),v.constructor=P,v.render=E),_&&_.sub(v),v.props=k,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=a({},v.__s)),a(v.__s,P.getDerivedStateFromProps(k,v.__s))),p=v.props,y=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&k!==p&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(k,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(k,v.__s,x)||u.__v===i.__v&&!v.__){for(v.props=k,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v),s=0;s<u.__k.length;s++)u.__k[s]&&(u.__k[s].__=u);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(k,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(p,y,w);});}v.context=x,v.props=k,v.state=v.__s,(s=n.__r)&&s(u),v.__d=!1,v.__v=u,v.__P=l,s=v.render(v.props,v.state,v.context),u.__k=null!=s&&s.type==d&&null==s.key?s.props.children:Array.isArray(s)?s:[s],null!=v.getChildContext&&(t=a(a({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(w=v.getSnapshotBeforeUpdate(p,y)),b(l,u,i,t,o,r,f,e,c),v.base=u.__e,v.__h.length&&f.push(v),g&&(v.__E=v.__=null),v.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=$(i.__e,u,i,t,o,r,f,c);(s=n.diffed)&&s(u);}catch(l){u.__v=null,n.__e(l,u,i);}return u.__e}function T(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n.__e(l,u.__v);}});}function $(n,l,u,i,t,o,r,f){var s,a,v,h,p,y=u.props,d=l.props;if(t="svg"===l.type||t,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,f=!1;}if(null===l.type)y!==d&&n.data!=d&&(n.data=d);else {if(null!=o&&(o=c.slice.call(n.childNodes)),v=(y=u.props||e).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!f){if(y===e)for(y={},p=0;p<n.attributes.length;p++)y[n.attributes[p].name]=n.attributes[p].value;(h||v)&&(h&&v&&h.__html==v.__html||(n.innerHTML=h&&h.__html||""));}P(n,d,y,t,f),l.__k=l.props.children,h||b(n,l,u,i,"foreignObject"!==l.type&&t,o,r,e,f),f||("value"in d&&void 0!==d.value&&d.value!==n.value&&(n.value=null==d.value?"":d.value),"checked"in d&&void 0!==d.checked&&d.checked!==n.checked&&(n.checked=d.checked));}return n}function j(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,i);}}function D(l,u,i){var t,o,r;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||j(t,null,u)),i||"function"==typeof l.type||(i=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(r=0;r<t.length;r++)t[r]&&D(t[r],u,i);null!=o&&v(o);}function E(n,l,u){return this.constructor(n,u)}function H(l,u,i){var t,o,f;n.__&&n.__(l,u),o=(t=i===r)?null:i&&i.__k||u.__k,l=h(d,null,[l]),f=[],A(u,(t?u:i||u).__k=l,o||e,e,void 0!==u.ownerSVGElement,i&&!t?[i]:o?null:c.slice.call(u.childNodes),f,i||e,t),T(f,l);}function M(n){var l={},u={__c:"__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var i,t=this;return this.getChildContext||(i=[],this.getChildContext=function(){return l[u.__c]=t,l},this.shouldComponentUpdate=function(n){t.props.value!==n.value&&i.some(function(l){l.context=n.value,k(l);});},this.sub=function(n){i.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){i.splice(i.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Consumer.contextType=u,u}n={__e:function(n,l){for(var u,i;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(i=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(i=!0,u.componentDidCatch(n)),i)return k(u.__E=u)}catch(l){n=l;}throw n}},m.prototype.setState=function(n,l){var u;u=this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),k(this));},m.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),k(this));},m.prototype.render=d,u=[],i=0,t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,r=e,f=0;

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var t$1,r$1,u$1,i$1=[],o$1=n.__r,f$1=n.diffed,c$1=n.__c,e$1=n.unmount;function a$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v$1(n){return m$1(x$1,n)}function m$1(n,u,i){var o=a$1(t$1++);return o.__c||(o.__c=r$1,o.__=[i?i(u):x$1(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p$1(n,u){var i=a$1(t$1++);q(i.__H,u)&&(i.__=n,i.__H=u,r$1.__H.__h.push(i));}function y(n){return s$1(function(){return {current:n}},[])}function s$1(n,r){var u=a$1(t$1++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__;var i=a$1(t$1++);return null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value}function F(){i$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(_$1),t.__H.__h.forEach(g$1),t.__H.__h=[];}catch(r){return t.__H.__h=[],n.__e(r,t.__v),!0}}),i$1=[];}function _$1(n){n.t&&n.t();}function g$1(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o$1&&o$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.__h.forEach(_$1),r$1.__H.__h.forEach(g$1),r$1.__H.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i$1.push(r)&&u$1===n.requestAnimationFrame||((u$1=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_$1),t.__h=t.__h.filter(function(n){return !n.__||g$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c$1&&c$1(t,r);},n.unmount=function(t){e$1&&e$1(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

const actionTypes = {
  APP_ROUTE_CHANGED: 'APP_ROUTE_CHANGED' //  FEATURE_ROUTE_CHANGED:'FEATURE_ROUTE_CHANGED'

};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.APP_ROUTE_CHANGED:
      return { ...state,
        route: action.route,
        featureRoute: action.featureRoute
      };

    default:
      return state;
  }
}

const AppRouteContext = M();

function useAppRouteContext() {
  const context = T$1(AppRouteContext);

  if (!context) {
    throw new Error('useAppRouteContext must be used with AppRouteProvider');
  }

  return context;
}
function useAppRoute() {
  const [state, dispatch] = useAppRouteContext();
  const {
    name
  } = state;

  function onAppRoute({
    route,
    featureRoute
  }) {
    if (name) {
      localStorage.setItem(name, JSON.stringify({
        route,
        featureRoute
      }));
    }

    dispatch({
      type: actionTypes.APP_ROUTE_CHANGED,
      featureRoute,
      route
    });
  }

  return {
    onAppRoute
  };
}
function AppRoute(props) {
  const {
    children,
    path,
    paths
  } = props;
  const [state, dispatch] = useAppRouteContext();
  const {
    route
  } = state;

  if (path && route === path) {
    return children;
  } else if (paths && route === paths.find(p => p === route)) {
    return children;
  }

  return null;
}
function AppRouteProvider(props) {
  const {
    initState
  } = props;
  const [state, dispatch] = m$1(reducer, initState);
  p$1(() => {
    if (state && state.name && localStorage.getItem(state.name)) {
      const {
        featureRoute,
        route
      } = JSON.parse(localStorage.getItem(state.name));
      dispatch({
        type: actionTypes.APP_ROUTE_CHANGED,
        featureRoute,
        route
      });
    }
  }, []);
  const value = s$1(() => [state, dispatch], [state]);
  return h(AppRouteContext.Provider, _extends({
    value: value
  }, props));
}

/* eslint-disable no-undef */
function AppProviders({
  children
}) {
  return h(AppRouteProvider //
  , {
    title: "Webcom",
    initState: {
      route: '/',
      featureRoute: '/hangouts',
      name: 'storybook'
    }
  }, children);
}

const style = {
  width: 15,
  height: 15,
  border: 'white 2px solid'
};
function OnlineStatus({
  readyState
}) {
  if (readyState === 1) {
    return h(IsOnline, null);
  } else if (readyState === 0) {
    return h(Connecting, null);
  } else if (readyState === 2) {
    return h(Closing, null);
  }

  return h(IsOffline, null);
}
function IsOnline() {
  return h("div", {
    style: { ...style,
      backgroundColor: 'green'
    },
    "data-testid": "online"
  });
}
function IsOffline() {
  return h("div", {
    style: { ...style,
      backgroundColor: 'red'
    },
    "data-testid": "offline"
  });
}
function Connecting() {
  return h("div", {
    style: { ...style,
      backgroundColor: 'orange'
    },
    "data-testid": "connecting"
  });
}
function Closing() {
  return h("div", {
    style: { ...style,
      backgroundColor: 'pink'
    },
    "data-testid": "closing"
  });
}

const style$1 = {
  count: {
    width: 30,
    height: 30,
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
function Message({
  count = 0
}) {
  return h("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, h("div", null, "message:"), h("div", {
    style: style$1.count,
    "data-testid": "message-count"
  }, count));
}

function IconsDemo() {
  return h("div", null, h(Message, {
    count: 1
  }));
}

function TextInput(props) {
  const {
    label,
    name,
    type,
    isValid,
    message
  } = props;
  return h("div", {
    className: "form-group p-0"
  }, h("label", {
    for: name
  }, label), h("input", _extends({
    type: type,
    className: `form-control ${isValid && 'is-valid'} ${!isValid && isValid !== undefined && 'is-invalid'}`,
    id: name,
    "aria-describedby": name
  }, props)), !isValid && h("small", {
    id: "emailHelp",
    className: `${!isValid && 'invalid-feedback'}`,
    "data-testid": `message-${name}`
  }, message));
}

function Button(props) {
  const {
    title,
    bg = "light",
    outline,
    size,
    loading = false,
    block
  } = props;
  return h("button", _extends({
    className: `${bg && !outline && `btn btn-${bg}`} ${outline && `btn btn-outline-${bg}`} ${size && `btn btn-${size}`} ${block && 'btn-block'}`
  }, props, {
    disabled: loading
  }), loading && h("span", {
    class: "spinner-border spinner-border-sm",
    role: "status",
    "aria-hidden": "true"
  }), loading ? 'wait...' : title);
}

function Alert(props) {
  const {
    alert,
    message
  } = props;
  return h("div", {
    className: `alert alert-${alert}`,
    role: "alert",
    "data-testid": "alert"
  }, message, h("button", {
    type: "button",
    class: "close",
    "data-dismiss": "alert",
    "aria-label": "Close"
  }, h("span", {
    "aria-hidden": "true"
  }, "\xD7")));
}

function Login(props) {
  const {
    emailorusername,
    password,
    loading,
    onLogin,
    onFocus,
    onChange,
    validation,
    onForgotPassword,
    onBlur,
    error
  } = props;
  return h("div", {
    className: "col-md-4 border mx-auto rounded",
    style: {
      margin: 15,
      padding: 16
    }
  }, loading && h("div", {
    className: "progress",
    style: "height: 5px;"
  }, h("div", {
    className: "progress-bar progress-bar-striped progress-bar-animated",
    role: "progressbar",
    "aria-valuenow": "100",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    style: "width: 100%"
  })), error && h(Alert, {
    alert: "danger",
    message: error.message
  }), h(TextInput, {
    onFocus: onFocus,
    onBlur: onBlur,
    value: emailorusername,
    onChange: onChange,
    label: "Email or username",
    name: "emailorusername",
    type: "text",
    id: "emailorusername",
    "data-testid": "emailorusername",
    message: validation && validation['emailorusername'].message,
    isValid: validation && validation['emailorusername'].isValid
  }), h(TextInput, {
    onFocus: onFocus,
    onBlur: onBlur,
    label: "Password",
    value: password,
    onChange: onChange,
    name: "password",
    type: "password",
    id: "password",
    "data-testid": "password",
    message: validation && validation['password'].message,
    isValid: validation && validation['password'].isValid
  }), h("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, h(Button, {
    type: "button",
    id: "login-btn",
    "data-testid": "login-btn",
    onClick: onLogin,
    loading: loading,
    title: "Login",
    bg: "primary"
  }), h(Button, {
    onClick: onForgotPassword,
    id: "forgotpassword",
    "data-testid": "forgotpassword",
    outline: true,
    bg: "primary",
    title: "Forgot Password!"
  })));
}

const validationSuccess = {
  emailorusername: {
    isValid: true,
    message: '.'
  },
  password: {
    isValid: true,
    message: '.'
  }
};
const validationError = {
  emailorusername: {
    isValid: false,
    message: 'invalid credentials'
  },
  password: {
    isValid: false,
    message: 'invalid credentials'
  }
};
function LoginStates() {
  return h("div", {
    className: "container"
  }, h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, " Login Validation Success"), h(Login, {
    emailorusername: "testuser",
    password: "123456789",
    validation: validationSuccess
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Login Validation Error"), h(Login, {
    emailorusername: "testuser",
    password: "123456789",
    validation: validationError
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Logging in"), h(Login, {
    emailorusername: "testuser",
    password: "123456789",
    validation: validationSuccess,
    loading: true
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Logging Server error"), h(Login, {
    emailorusername: "testuser",
    password: "123456789",
    validation: validationSuccess,
    error: {
      message: 'Server is unavailable'
    }
  }))));
}

function Signup(props) {
  const {
    username,
    password,
    email,
    loading,
    onSignup,
    onChange,
    validation,
    onBlur,
    onFocus,
    error
  } = props;
  return h("div", {
    className: "col-md-4 border mx-auto rounded",
    style: {
      margin: 15,
      padding: 16
    }
  }, loading && h("div", {
    className: "progress",
    style: "height: 5px;"
  }, h("div", {
    className: "progress-bar progress-bar-striped progress-bar-animated",
    role: "progressbar",
    "aria-valuenow": "100",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    style: "width: 100%"
  })), error && h(Alert, {
    alert: "danger",
    message: error.message
  }), h(TextInput, {
    onBlur: onBlur,
    onFocus: onFocus,
    label: "Username",
    value: username,
    onChange: onChange,
    type: "text",
    "data-testid": "username",
    name: "username",
    isValid: validation && validation['username'].isValid,
    message: validation && validation['username'].message
  }), h(TextInput, {
    onBlur: onBlur,
    onFocus: onFocus,
    label: "Email",
    onChange: onChange,
    value: email,
    type: "email",
    "data-testid": "email",
    name: "email",
    isValid: validation && validation['email'].isValid,
    message: validation && validation['email'].message
  }), h(TextInput, {
    onBlur: onBlur,
    onFocus: onFocus,
    label: "Password",
    onChange: onChange,
    value: password,
    type: "password",
    "data-testid": "password",
    name: "password",
    isValid: validation && validation['password'].isValid,
    message: validation && validation['password'].message
  }), h(Button, {
    type: "button",
    onClick: onSignup,
    id: "signup-btn",
    "data-testid": "signup-btn",
    loading: loading,
    title: "Signup",
    bg: "primary"
  }));
}

const validationSuccess$1 = {
  username: {
    isValid: true,
    message: '.'
  },
  password: {
    isValid: true,
    message: '.'
  },
  email: {
    isValid: true,
    message: '.'
  }
};
const validationError$1 = {
  username: {
    isValid: false,
    message: 'Username is not valid'
  },
  password: {
    isValid: false,
    message: 'Pasword is not valid'
  },
  email: {
    isValid: false,
    message: 'Email is not valid'
  }
};
function SignupStates() {
  return h("div", {
    className: "container"
  }, h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Signup Validation Success"), h(Signup, {
    username: "testuser",
    email: "test@gmail.com",
    password: "123456789",
    validation: validationSuccess$1
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Signup Validation Error"), h(Signup, {
    username: "testuser",
    email: "test@gmail.com",
    password: "123456789",
    validation: validationError$1
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Signing up"), h(Signup, {
    username: "testuser",
    email: "test@gmail.com",
    password: "123456789",
    validation: validationSuccess$1,
    loading: true
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Signing Sever error"), h(Signup, {
    username: "testuser",
    email: "test@gmail.com",
    password: "123456789",
    validation: validationSuccess$1,
    error: {
      message: 'Server is unavailable'
    }
  }))));
}

function ChangePassword(props) {
  const {
    password,
    confirm,
    validation,
    onChange,
    onPasswordChange,
    loading,
    error
  } = props; // useEffect(() => {
  //   let url = new URL(window.location.href);
  //   var urltoken = url.searchParams.get('token');
  //   if (urltoken) {
  //     dispatch(actions.getTokenFromUrl({ token: urltoken }));
  //   }
  // }, []);

  return h("div", {
    className: "col-md-4 border mx-auto rounded",
    style: {
      margin: 15,
      padding: 16
    }
  }, loading && h("div", {
    className: "progress",
    style: "height: 5px;"
  }, h("div", {
    className: "progress-bar progress-bar-striped progress-bar-animated",
    role: "progressbar",
    "aria-valuenow": "100",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    style: "width: 100%"
  })), error && h(Alert, {
    alert: "danger",
    message: error.message
  }), h(TextInput, {
    label: "Password",
    value: password,
    type: "password",
    id: "password",
    name: "password",
    onChange: onChange,
    isValid: validation && validation['password'].isValid,
    message: validation && validation['password'].message
  }), h(TextInput, {
    label: "Confirm",
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    onChange: onChange,
    isValid: validation && validation['confirm'].isValid,
    message: validation && validation['confirm'].message
  }), h(Button, {
    type: "button",
    loading: loading,
    "data-testid": "change-pass-btn",
    onClick: onPasswordChange,
    title: "Change",
    bg: "primary"
  }));
}

const validationSuccess$2 = {
  password: {
    isValid: true,
    message: '.'
  },
  confirm: {
    isValid: true,
    message: '.'
  }
};
const validationError$2 = {
  password: {
    isValid: false,
    message: 'invalid password format'
  },
  confirm: {
    isValid: false,
    message: 'invalid password format'
  }
};
function ChangePasswordStates() {
  return h("div", {
    className: "container"
  }, h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, " ChangePassword Validation Success"), h(ChangePassword, {
    password: "123456789",
    confirm: "123456789",
    validation: validationSuccess$2
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "ChangePassword Validation Error"), h(ChangePassword, {
    validation: validationError$2
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "ChangePassword in progress"), h(ChangePassword, {
    password: "123456789",
    confirm: "123456789",
    validation: validationSuccess$2,
    loading: true
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "ChangePassword Server error"), h(ChangePassword, {
    password: "123456789",
    confirm: "123456789",
    validation: validationSuccess$2,
    error: {
      message: 'Server is unavailable'
    }
  }))));
}

function RequestPassChange(props) {
  const {
    email,
    validation,
    onRequestPasswordChange,
    loading,
    onChange,
    error
  } = props;
  return h("div", {
    className: "col-md-4 border mx-auto rounded",
    style: {
      margin: 15,
      padding: 16
    }
  }, loading && h("div", {
    className: "progress",
    style: "height: 5px;"
  }, h("div", {
    className: "progress-bar progress-bar-striped progress-bar-animated",
    role: "progressbar",
    "aria-valuenow": "100",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    style: "width: 100%"
  })), error && h(Alert, {
    alert: "danger",
    message: error.message
  }), h(TextInput, {
    label: "Email",
    value: email,
    name: "email",
    onChange: onChange,
    type: "email",
    id: "email",
    isValid: validation && validation['email'].isValid,
    message: validation && validation['email'].message
  }), h(Button, {
    type: "button",
    onClick: onRequestPasswordChange,
    "data-testid": "requestpasschange-btn",
    title: "Request password change",
    loading: loading,
    bg: "primary"
  }));
}

const validationSuccess$3 = {
  email: {
    isValid: true,
    message: '.'
  }
};
const validationError$3 = {
  email: {
    isValid: false,
    message: 'Invalid email format'
  }
};
function ForfotPasswordState() {
  return h("div", {
    className: "container"
  }, h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, " ForgotPassword Validation Success"), h(RequestPassChange, {
    email: "test@gmail.com",
    validation: validationSuccess$3
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "ForgotPassword Validation Error"), h(RequestPassChange, {
    email: "testgmail.com",
    validation: validationError$3
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Request Password Change in progress"), h(RequestPassChange, {
    email: "test@gmail.com",
    validation: validationSuccess$3,
    loading: true
  }))), h("div", {
    className: "row"
  }, h("span", {
    className: "col-md-12"
  }, h("h5", {
    className: "text-center"
  }, "Server error"), h(RequestPassChange, {
    email: "test@gmail.com",
    validation: validationSuccess$3,
    error: {
      message: 'Server is unavailable'
    }
  }))));
}

function AuthDemoRoutes() {
  return [h(AppRoute, {
    path: "/login"
  }, h(LoginStates, null)), h(AppRoute, {
    path: "/signup"
  }, h(SignupStates, null)), h(AppRoute, {
    path: "/change-password"
  }, h(ChangePasswordStates, null)), h(AppRoute, {
    path: "/forgot-password"
  }, h(ForfotPasswordState, null))];
}

function ButtonDemo() {
  return h("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      backgroundColor: 'yellow'
    }
  }, h("div", null, h("h3", null, "Filled Buttons"), h(Button, {
    bg: "primary"
  }, "Primary"), h(Button, {
    bg: "secondary"
  }, "Secondary"), h(Button, {
    bg: "success"
  }, "Success"), h(Button, {
    bg: "danger"
  }, "Danger"), h(Button, {
    bg: "warning"
  }, "Warning"), h(Button, {
    bg: "info"
  }, "Info"), h(Button, {
    bg: "light"
  }, "Light"), h(Button, {
    bg: "dark"
  }, "Dark"), h(Button, {
    bg: "link"
  }, "Link")), h("div", null, h("h3", null, "Outlined Buttons"), h(Button, {
    bg: "primary",
    outline: true,
    title: "Primary"
  }), h(Button, {
    bg: "secondary",
    outline: true,
    title: "Secondary"
  }), h(Button, {
    bg: "success",
    outline: true,
    title: "Success"
  }), h(Button, {
    bg: "danger",
    outline: true,
    title: "Danger"
  }), h(Button, {
    bg: "warning",
    outline: true,
    title: "Warning"
  }), h(Button, {
    bg: "info",
    outline: true,
    title: "Info"
  }), h(Button, {
    bg: "light",
    outline: true,
    title: "Light"
  }), h(Button, {
    bg: "dark",
    outline: true,
    title: "Dark"
  }), h(Button, {
    bg: "link",
    outline: true,
    title: "Link"
  })), h("div", {
    style: {
      display: 'flex'
    }
  }, h("div", null, h("h3", null, "Small Buttons"), h(Button, {
    bg: "primary",
    size: "sm",
    title: "link"
  }), h(Button, {
    bg: "secondary",
    size: "sm",
    title: "Secondary"
  })), h("h3", null, "Large Buttons"), h(Button, {
    bg: "primary",
    size: "lg",
    title: "Link"
  }), h(Button, {
    bg: "secondary",
    size: "lg",
    title: "Secondary"
  })), h("div", null), h("div", null, h("h3", null, " Disabled Buttons"), h(Button, {
    bg: "primary",
    disabled: true,
    title: "Link"
  }), h(Button, {
    bg: "secondary",
    disabled: true,
    title: "Secondary"
  })), h("div", null, h("h3", null, " Spinning Button"), h(Button, {
    bg: "primary",
    title: "Spinning",
    loading: true
  })));
}

function TextInputStates() {
  return h("div", null, h("div", null, h("h5", null, "Validation"), h(TextInput, {
    isValid: true
  }), h(TextInput, {
    isValid: false
  })));
}

const img = "data:image/png;base64,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";

function Toast() {
  return h("div", {
    className: "toast",
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  }, h("div", {
    className: "toast-header"
  }, h("img", {
    src: img,
    className: "rounded mr-2",
    alt: "..."
  }), h("strong", {
    className: "mr-auto"
  }, "Bootstrap"), h("small", {
    className: "text-muted"
  }, "just now"), h("button", {
    type: "button",
    className: "ml-2 mb-1 close",
    "data-dismiss": "toast",
    "aria-label": "Close"
  }, h("span", {
    "aria-hidden": "true"
  }, "\xD7"))), h("div", {
    className: "toast-body"
  }, "See? Just like this."));
}

function ToastDemo() {
  return h(Toast, null);
}

function AlertDemo() {
  return h(Alert, {
    alert: "danger",
    message: "Server is temporarily unavailable"
  });
}

function ComponentsRoute() {
  return [h(AppRoute, {
    path: "/button"
  }, h(ButtonDemo, null)), h(AppRoute, {
    path: "/text-input"
  }, h(TextInputStates, null)), h(AppRoute, {
    path: "/toast"
  }, h(ToastDemo, null)), h(AppRoute, {
    path: "/alert"
  }, h(AlertDemo, null))];
}

const styles = {
  root: {
    backgroundColor: '#eeeeee',
    height: '100%'
  }
};
function Layout({
  children,
  style,
  id
}) {
  return h("div", {
    "data-testid": id,
    style: { ...styles.root,
      ...style
    }
  }, children);
}

const style$2 = {
  checkbox: {
    marginRight: 8
  },
  checkboxRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: 16
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    paddingTop: 68
  },
  btn: {
    flex: 1,
    marginRight: 4
  }
};
function Block({
  onCancel,
  onBlock,
  onReport
}) {
  return h(Layout, {
    style: style$2.layout
  }, h("div", {
    style: style$2.checkboxRoot
  }, h("input", {
    type: "checkbox",
    style: style$2.checkbox,
    onChange: onReport
  }), h("label", null, "Report")), h("div", {
    className: "row"
  }, h("div", {
    className: "col"
  }, h(Button, {
    "data-testid": "cancel-btn",
    onClick: onCancel,
    title: "Cancel",
    bg: "secondary",
    outline: true,
    block: true
  })), h("div", {
    className: "col"
  }, h(Button, {
    id: "BLOCK",
    onClick: onBlock,
    "data-testid": "block-btn",
    title: "Block",
    bg: "primary",
    block: true
  }))));
}

function Block$1({
  height = 24,
  width = 24,
  fill = 'none',
  color = 'black',
  onClick,
  id
}) {
  return h("svg", {
    height: height,
    viewBox: "0 0 24 24",
    width: width,
    onClick: onClick,
    id: id
  }, h("path", {
    d: "M0 0h24v24H0z",
    fill: fill,
    id: id
  }), h("path", {
    id: id,
    fill: color,
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"
  }));
}

function Center({
  children,
  style
}) {
  return h("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      ...style
    }
  }, children);
}

const style$3 = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    paddingTop: 68
  }
};
function Blocked({
  hangout,
  onUnblock,
  onClose
}) {
  return h(Layout, {
    style: style$3.layout,
    id: "blocked-ui"
  }, h(Center, {
    style: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, h(Block$1, {
    width: "60",
    height: "70",
    color: "red"
  }), h("b", null, hangout && hangout.username), " is blocked"), h("div", {
    className: "row"
  }, h("div", {
    className: "col"
  }, h(Button, {
    "data-testid": "close-btn",
    onClick: onClose,
    title: "CLOSE",
    bg: "secondary",
    block: true,
    outline: true
  })), h("div", {
    className: "col"
  }, h(Button, {
    id: "UNBLOCK",
    onClick: onUnblock,
    "data-testid": "unblock-btn",
    title: "UNBLOCK",
    bg: "primary",
    block: true
  }))));
}

function Delete({
  height = 24,
  width = 24,
  color = 'black',
  fill = 'none'
}) {
  return h("svg", {
    height: height,
    viewBox: "0 0 24 24",
    width: width
  }, h("path", {
    fill: color,
    d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
  }), h("path", {
    d: "M0 0h24v24H0z",
    fill: fill
  }));
}

function Archive({
  height = 24,
  width = 24,
  color = 'black',
  fill = 'none'
}) {
  return h("svg", {
    height: 24,
    viewBox: "0 0 24 24",
    width: width
  }, h("path", {
    fill: color,
    d: "M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
  }), h("path", {
    d: "M0 0h24v24H0z",
    fill: fill
  }));
}

const style$4 = {
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    margin: 8
  },
  btn: {
    marginRight: 8
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  btnOk: {
    margin: 8,
    display: 'flex',
    justifyContent: 'flex-end'
  }
};
function Configure({
  onBlock,
  onDelete,
  onArchive,
  onNotification,
  onConversationHistory,
  onNavigation,
  onOk
}) {
  return h(Layout, {
    style: style$4.layout
  }, h("div", null, h(Checkbox, {
    label: "Notifications",
    onChange: onNotification
  }), h(Checkbox, {
    label: "Conversation History",
    onChange: onConversationHistory
  })), h("hr", null), h("div", {
    style: style$4.btnContainer
  }, h(IconButton, {
    title: "Archive",
    Icon: Archive,
    onClick: onArchive
  }), h(IconButton, {
    title: "Delete",
    Icon: Delete,
    onClick: onDelete
  }), h(IconButton, {
    id: "bckui",
    title: "Block",
    Icon: Block$1,
    onClick: onNavigation
  })), h("div", null, h(Button, {
    onClick: onOk,
    title: "OK",
    bg: "primary"
  })));
}

function IconButton({
  Icon,
  title,
  onClick,
  id
}) {
  return h("div", {
    style: style$4.iconBtn
  }, h("button", {
    id: id,
    style: style$4.btn,
    onClick: onClick,
    "data-testid": `${id}-btn`
  }, h(Icon, {
    id: id
  })), h("div", null, title));
}

function Checkbox({
  label,
  onChange
}) {
  return h("div", {
    style: {
      margin: 8,
      marginTop: 8
    }
  }, h("input", {
    type: "checkbox",
    onChange: onChange
  }), h("label", null, label));
}

function useMediaQuery() {
  const [width, setWidth] = v$1(0);
  const [height, setHeight] = v$1(0);
  const [orientation, setOrientation] = v$1('');
  const [device, setDevice] = v$1('');

  function handleViewportSize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  function handleScreenOrientation() {
    setOrientation(window.screen.orientation);
  }

  p$1(() => {
    if (width > 0) {
      switch (true) {
        case width <= 600:
          setDevice('phone');
          break;

        case width <= 768:
        case width <= 992:
        case width <= 1200:
          setDevice('tablet');
          break;

        case width <= 2560:
          setDevice('laptop');
          break;

        case width > 2560:
          setDevice('desktop');
          break;

        default:
          setDevice('');
      }
    }
  }, [width]);
  p$1(() => {
    console.log('device', device);
  }, [device]);
  p$1(() => {
    handleViewportSize();
    handleScreenOrientation();
    window.addEventListener('orientationchange', handleScreenOrientation);
    window.addEventListener('resize', () => handleViewportSize);
    return () => {// window.removeEventListener();
      // window.removeEventListener(handleScreenOrientation);
    };
  }, []);
  return {
    width,
    height,
    orientation,
    device
  };
}

const style$5 = {
  root: {
    borderColor: '#eeeeee',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 35,
    backgroundColor: 'white'
  },
  username: {
    marginRight: 8
  },
  log: {
    display: 'flex',
    color: '#737373',
    fontSize: 10
  },
  message: {}
}; //

function Message$1(props) {
  const {
    message
  } = props;
  const {
    float,
    username,
    timestamp
  } = message;
  const [days, setDays] = v$1(0);
  const [hours, setHours] = v$1(0);
  const [minutes, setMinutes] = v$1(0);
  const [seconds, setSeconds] = v$1(0);
  const {
    device
  } = useMediaQuery();

  function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    setDays(d);
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }

  p$1(() => {
    if (timestamp) {
      setTimeout(() => {
        convertMS(Date.now() - timestamp);
      }, 0);
      setInterval(() => {
        convertMS(Date.now() - timestamp);
      }, 60000);
    }
  }, [timestamp]);
  return h("div", {
    style: {
      width: '100%',
      marginBottom: 3
    }
  }, h("div", {
    style: { ...style$5.root,
      float
    }
  }, h("div", {
    "data-testid": "message",
    style: style$5.message,
    className: `message-font-${device}-size`
  }, message && message.text), h("div", {
    style: style$5.log
  }, h("div", {
    style: style$5.username
  }, username && username, ":"), h("div", null, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", ' '), days <= 10 && days > 1 && h("div", null, days, " days ago")))));
}

function MessageEditor({
  loading,
  messageText,
  onMessageText,
  onMessage,
  hangout
}) {
  return h("div", null, h("div", {
    className: "input-group mb-3"
  }, h("input", {
    type: "text",
    class: "form-control",
    "aria-label": "Recipient's username",
    "aria-describedby": "button-addon2",
    onChange: onMessageText,
    "data-testid": "message-input",
    value: messageText
  }), h("div", {
    className: "input-group-append"
  }, h("button", {
    className: "btn btn-outline-secondary",
    type: "button",
    loading: loading,
    disabled: hangout && hangout.state === 'BLOCKED',
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  }, "Send"))));
}

const style$6 = {
  color: 'red',
  float: 'right',
  width: '100%',
  fontSize: 16,
  textAlign: 'end'
};
function BlockerMessage({
  message
}) {
  return h("div", {
    style: style$6,
    "data-testid": "blocker-message"
  }, message.text);
}

const style$7 = {
  color: 'red',
  float: 'right',
  width: '100%',
  fontSize: 16,
  textAlign: 'end'
};
function BlockedMessage({
  message,
  onNavigation
}) {
  function handleNavigation(e) {
    e.preventDefault();
    onNavigation(e);
  }

  debugger;
  return h("div", {
    style: style$7,
    "data-testid": "blocked-message"
  }, message.text, h("a", {
    id: "UNBLOCK",
    "data-testid": "seemore-btn",
    href: "/",
    onClick: handleNavigation
  }, "see more"));
}

const styles$1 = {
  messageContainer: {
    // width: '100%',
    boxSizing: 'border-box',
    padding: 3,
    //  backgroundColor: 'orange',
    flex: 3,
    overflowY: 'auto',
    overflowX: "hidden"
  }
};
function Messages({
  messages,
  onMessage,
  onMessageText,
  messageText,
  username,
  hangout,
  onNavigation,
  loading
}) {
  const scrollerRef = y(null);
  const {
    device
  } = useMediaQuery();
  p$1(() => {
    if (messages) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  function onSend(e) {
    onMessage(e);
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }

  return h("div", {
    style: {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, h("div", {
    style: { ...styles$1.messageContainer,
      flex: device === 'phone' ? 4 : 2
    },
    ref: scrollerRef
  }, messages && messages.length > 0 && floatMessages({
    messages: sortMessages({
      messages
    }),
    username
  }).map(m => h("div", {
    style: {
      display: 'flex'
    }
  }, ' ', !m.type && h(Message$1, {
    message: m
  }), m.type && m.type === 'blocker' && h(BlockerMessage, {
    message: m
  }), m.type && m.type === 'blocked' && h(BlockedMessage, {
    message: m,
    onNavigation: onNavigation
  })))), h(MessageEditor, {
    loading: loading,
    hangout: hangout,
    onMessage: onSend,
    messageText: messageText,
    onMessageText: onMessageText
  }));
}

function floatMessages({
  messages,
  username
}) {
  if (messages && messages.length > 0 && username) {
    return messages.map(msg => {
      if (msg.username === username) {
        return { ...msg,
          float: 'right',
          username: 'me'
        };
      } else {
        return { ...msg,
          float: 'left'
        };
      }
    });
  } else {
    return null;
  }
}

function sortMessages({
  messages
}) {
  if (messages) {
    return messages.sort();
  } else {
    return null;
  }
}

function Hangchat({
  loading,
  messages = [],
  onMessageText,
  onMessage,
  messageText,
  username,
  hangout,
  onNavigation
}) {
  p$1(() => {
    document.title = hangout.username;
  }, []);
  return h(Layout, {
    id: "hangchat-ui"
  }, h(Messages, {
    loading: loading,
    onNavigation: onNavigation,
    hangout: hangout,
    messages: messages,
    onMessage: onMessage,
    onMessageText: onMessageText,
    messageText: messageText,
    username: username
  }));
}

function List(props) {
  return h("div", _extends({
    className: "list-group"
  }, props));
}

function ListItem(props) {
  return h("button", _extends({
    type: "button",
    className: "list-group-item list-group-item-action"
  }, props));
}

function Hangout({
  hangouts,
  onSearchInput,
  onFetchHangouts,
  onSelectHangout,
  search
}) {
  const {
    onAppRoute
  } = useAppRoute();

  function handleHangoutSelection(e) {
    const id = e.target.id;
    onSelectHangout(e);
    const hangout = hangouts.find(g => g.username === id);
    onAppRoute({
      featureRoute: `/${hangout.state}`,
      route: '/hangouts'
    });
  }

  return h("div", null, h("div", {
    class: "input-group mb-3"
  }, h("input", {
    value: search,
    id: "search-input",
    onChange: onSearchInput,
    type: "text",
    className: "form-control",
    "aria-label": "Recipient's username",
    "aria-describedby": "button-addon2"
  }), h("div", {
    className: "input-group-append"
  }, h("button", {
    className: "btn btn-outline-secondary",
    type: "button",
    id: "button-addon2",
    onClick: onFetchHangouts,
    "data-testid": "search-btn",
    disabled: !search
  }, "Search"))), h(List, {
    id: "hangouts-list"
  }, hangouts && hangouts.length > 0 && hangouts.map(g => {
    return h(ListItem, {
      id: g.username,
      "data-testid": g.username,
      onClick: handleHangoutSelection
    }, g.username);
  })));
}

function PersonAddIcon({
  height = 24,
  width = 24,
  color = 'black',
  fill = 'white',
  style
}) {
  return h("svg", {
    height: height,
    viewBox: "0 0 24 24",
    width: width,
    style: style
  }, h("path", {
    d: "M0 0h24v24H0z",
    fill: fill
  }), h("path", {
    fill: color,
    d: "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
  }));
}

const style$8 = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}; //

function Invite({
  hangout,
  onInvite,
  onMessageText,
  messageText,
  loading
}) {
  return h(Layout, {
    style: style$8.layout,
    id: "invite-ui"
  }, h(Center, null, h(PersonAddIcon, {
    color: "green"
  })), h(Center, null, "Start Conversation with ", h("b", null, hangout && hangout.email)), h(TextInput, {
    id: "messageTextInput",
    onChange: onMessageText,
    value: messageText
  }), h(Center, null, h(Button, {
    loading: loading,
    id: "INVITE",
    onClick: onInvite,
    "data-testid": "oninvite-btn",
    title: "Send Invite",
    bg: "primary"
  })));
}

function Done({
  height = 24,
  width = 24,
  fill = 'none',
  color = 'black',
  style
}) {
  return h("svg", {
    height: height,
    viewBox: "0 0 24 24",
    width: width,
    style: style
  }, h("path", {
    d: "M0 0h24v24H0z",
    fill: fill
  }), h("path", {
    fill: color,
    d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
  }));
}

const style$9 = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
};
function Invitee({
  hangout,
  dispatch
}) {
  return h(Layout, {
    style: style$9.layout,
    id: "invitee-ui"
  }, h(Center, null, h(Done, {
    width: "70",
    height: "70",
    color: "green"
  })), h(Center, null, h("p", null, "You will be able to chat with ", h("b", null, hangout && hangout.email), " once your invition has been accepted.")));
}

const style$a = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingTop: 70,
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    paddingBottom: 8
  }
};
function Inviter({
  hangout,
  onAccept,
  onDecline,
  loading
}) {
  return h(Layout, {
    id: "inviter-ui"
  }, h("div", {
    style: style$a.root
  }, h("div", {
    style: {
      marginLeft: 8,
      display: 'flex'
    }
  }, hangout && hangout.message && h(Message$1, {
    message: hangout && hangout.message && { ...hangout.message,
      username: hangout.username,
      float: 'left'
    }
  })), h("div", {
    className: "row"
  }, h("div", {
    className: "col"
  }, h(Button, {
    id: "DECLINE",
    onClick: onDecline,
    "data-testid": "decline-btn",
    title: "Decline",
    block: true,
    bg: "danger",
    outline: true
  })), h("div", {
    className: "col"
  }, h(Button, {
    id: "ACCEPT",
    onClick: onAccept,
    "data-testid": "accept-btn",
    loading: loading,
    title: "Accept",
    bg: "primary",
    block: true
  })))));
}

function reducerUnreadhangouts({
  unreadhangouts
}) {
  return unreadhangouts.reduce((accumulator, current, index) => {
    if (index === 0) {
      return accumulator = [{ ...current,
        messageCount: 1
      }];
    } else {
      const obj = accumulator.find(a => a.username === current.username && current.state === 'MESSANGER');

      if (obj) {
        const index = accumulator.findIndex(a => a.username === current.username); //if current exist inside accumilator map it to that object

        accumulator.splice(index, 1, { ...obj,
          messageCount: ++obj.messageCount
        });
      } else {
        //if current exist inside accumilator map it to that object
        accumulator.push({ ...current,
          messageCount: 1
        });
      }
    }

    return accumulator;
  }, []);
}

function UnreadHangouts({
  unreadhangouts,
  onSelectUnread,
  onRemoveUnread
}) {
  const [items, setItems] = v$1([]);
  p$1(() => {
    if (unreadhangouts) {
      const reduced = reducerUnreadhangouts({
        unreadhangouts
      });
      setItems(reduced);
    }
  }, [unreadhangouts]);
  return h("div", {
    "data-testid": "unreadhangouts"
  }, h(List, null, items && items.length > 0 && items.map(u => {
    return h("div", {
      style: {
        display: 'flex'
      }
    }, h(ListItem, {
      onClick: onSelectUnread,
      id: u.username,
      style: {
        flex: 5
      },
      "data-testid": `${u.username}-select`
    }, u.username, " messages: ", u.messageCount), h(ListItem, {
      onClick: onRemoveUnread,
      id: u.username,
      style: {
        color: 'red'
      },
      "data-testid": `${u.username}-remove`
    }, "x"));
  })));
}

const messages = [{
  username: 'breno',
  text: `Let's Chat on Hangout!`,
  timestamp: 1591331789971
}, {
  username: 'demo',
  text: `Ok Let's Chat on Hangout!`,
  timestamp: 1591332163462
}, {
  username: 'breno',
  text: `How are you demo`,
  timestamp: 1591333635723
}, {
  username: 'breno',
  text: `Are you all right`,
  timestamp: 1591333677573
}, {
  username: 'demo',
  text: `Yes I am. How are you`,
  timestamp: 1591333728046
},, {
  username: 'demo',
  text: `Are you doing greate`,
  timestamp: 1591333728047
}, {
  username: 'demo',
  text: `Are you doing greate`,
  timestamp: 1591333728047
}, {
  username: 'breno',
  text: `Yes i am`,
  timestamp: 1591333728048
}, {
  username: 'breno',
  text: `Yes i am`,
  timestamp: 1591333728049
}, {
  username: 'breno',
  text: `Yes i am`,
  timestamp: 1591333728049
}, {
  username: 'breno',
  text: `Yes i am`,
  timestamp: 1591333728049
}, {
  username: 'breno',
  text: `Yes i am`,
  timestamp: 1591333728049
}];

const hangouts = [{
  username: 'userone'
}, {
  username: 'usertwo'
}, {
  username: 'userthree'
}];
const hangout = {
  username: 'testuser',
  email: 'test@gmail.com',
  message: {
    text: `Let's chat on Hangout!`,
    timestamp: 1590820782921
  }
};
const message = {
  username: 'breno',
  text: `Let's Chat on Hangout!`,
  timestamp: 1591331767836
}; //
function HangoutRoutes() {
  return [h(AppRoute, {
    path: "/block"
  }, h(Block, {
    hangouts: hangouts
  })), h(AppRoute, {
    path: "/blocked"
  }, h(Blocked, {
    hangouts: hangouts
  })), h(AppRoute, {
    path: "/configure"
  }, h(Configure, {
    hangouts: hangouts
  })), h(AppRoute, {
    path: "/hangchat"
  }, h(Hangchat, {
    hangout: hangout,
    messages: messages,
    username: "demo"
  })), h(AppRoute, {
    path: "/hangout"
  }, h(Hangout, {
    hangouts: hangouts
  })), h(AppRoute, {
    path: "/invite"
  }, h(Invite, {
    hangouts: hangouts
  })), h(AppRoute, {
    path: "/inviter"
  }, h(Inviter, {
    hangouts: hangouts
  })), h(AppRoute, {
    path: "/invitee"
  }, h(Invitee, {
    hangouts: hangouts
  })), h(AppRoute, {
    path: "/unreadhangouts"
  }, h(UnreadHangouts, {
    unreadhangouts: hangouts
  })), h(AppRoute, {
    path: "/message"
  }, h("div", {
    style: {
      padding: 20,
      backgroundColor: '#eeeeeee'
    }
  }, h(Message$1, {
    message: message,
    username: hangout.username
  }))), h(AppRoute, {
    path: "/messages"
  }, h(Hangchat, {
    hangout: hangout,
    messages: messages,
    username: "demo"
  }))];
}

//   { username: 'userone' },
//   { username: 'usertwo' },
//   { username: 'userthree' },
// ];
// const hangout = {
//   username: 'testuser',
//   email: 'test@gmail.com',
//   message: { text: `Let's chat on Hangout!`, timestamp: 1590820782921 },
// };
// const message = {
//   username: 'breno',
//   text: `Let's Chat on Hangout!`,
//   timestamp: 1591331767836,
// };
// //

function StorybookRoutes() {
  return h("div", {
    style: {
      height: '85vh'
    }
  }, h(AppRoute, {
    path: "/online"
  }, h("div", null, h(OnlineStatus, {
    online: true
  }), h(OnlineStatus, null))), h(AppRoute, {
    path: "/icons"
  }, h(IconsDemo, null)), h(AuthDemoRoutes, null), h(ComponentsRoute, null), h(HangoutRoutes, null));
}

function Navbar(props) {
  const {
    bg = 'light',
    brand,
    children
  } = props;
  return h("nav", {
    className: `navbar navbar-expand-lg navbar-${bg} bg-${bg}`
  }, h("a", {
    className: "navbar-brand",
    href: "#"
  }, brand), h("button", {
    className: "navbar-toggler",
    type: "button",
    "data-toggle": "collapse",
    "data-target": "#navbarSupportedContent",
    "aria-controls": "navbarSupportedContent",
    "aria-expanded": "false",
    "aria-label": "Toggle navigation"
  }, h("span", {
    className: "navbar-toggler-icon"
  })), children);
}
function NavBarCollapse({
  children
}) {
  return h("div", {
    className: "collapse navbar-collapse",
    id: "navbarSupportedContent"
  }, children);
}
function NavBarNav({
  children
}) {
  return h("ul", {
    className: "navbar-nav mr-auto"
  }, children);
} //

function NavDropdown(props) {
  const {
    title,
    children
  } = props;
  return h("li", {
    className: "nav-item dropdown"
  }, h("a", _extends({
    className: "nav-link dropdown-toggle",
    href: "#",
    id: "navbarDropdown",
    role: "button",
    "data-toggle": "dropdown",
    "aria-haspopup": "true",
    "aria-expanded": "false"
  }, props), title), children);
}
function DropdownMenu(props) {
  const {
    children
  } = props;
  return h("div", {
    className: "dropdown-menu",
    "aria-labelledby": "navbarDropdown"
  }, children);
}
function DropdownItem(props) {
  const {
    onAppRoute
  } = useAppRoute();

  function handleRoute(e) {
    e.preventDefault();
    const {
      id
    } = e.target;
    onAppRoute({
      featureRoute: '/',
      route: `/${id}`
    });
  }

  return h("a", _extends({
    className: "dropdown-item",
    href: "#"
  }, props, {
    onClick: handleRoute
  }));
}

H(h(AppProviders, null, h(Navbar, {
  brand: "Storybook",
  bg: "dark"
}, h(NavBarCollapse, null, h(NavBarNav, null, h(NavDropdown, {
  title: "Components"
}, h(DropdownMenu, null, h(DropdownItem, {
  id: "button"
}, "Buttons"), h(DropdownItem, {
  id: "text-input"
}, "TextInput"), h(DropdownItem, {
  id: "toast"
}, "Toast"), h(DropdownItem, {
  id: "alert"
}, "Alert"))), h(NavDropdown, {
  title: "Authentication"
}, h(DropdownMenu, null, h(DropdownItem, {
  id: "login"
}, "Login"), h(DropdownItem, {
  id: "signup"
}, "Signup"), h(DropdownItem, {
  id: "change-password"
}, "Change Password"), h(DropdownItem, {
  id: "forgot-password"
}, "Forgot Password"))), h(NavDropdown, {
  title: "Hangout"
}, h(DropdownMenu, null, h(DropdownItem, {
  id: "block"
}, "Block"), h(DropdownItem, {
  id: "blocked"
}, "Blocked"), h(DropdownItem, {
  id: "configure"
}, "Configure"), h(DropdownItem, {
  id: "hangchat"
}, "Hangchat"), h(DropdownItem, {
  id: "hangout"
}, "Hangout"), h(DropdownItem, {
  id: "invite"
}, "Invite"), h(DropdownItem, {
  id: "invitee"
}, "Invitee"), h(DropdownItem, {
  id: "inviter"
}, "Inviter"), h(DropdownItem, {
  id: "unreadhangouts"
}, "UnreadHangouts")))))), h(StorybookRoutes, null)), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2luZGV4LmpzIiwiLi4vU3Rvcnlib29rUHJvdmlkZXJzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL01lc3NhZ2UuanMiLCIuLi9JY29uc0RlbW8uanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL2J1dHRvbi9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvYWxlcnQvaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2xvZ2luLnN0YXRlcy5qcyIsIi4uLy4uL2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvc2lnbnVwLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL3NpZ251cC5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2NoYW5nZS1wYXNzd29yZC5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2ZvcmdvdC1wYXNzd29yZC5zdGF0ZXMuanMiLCIuLi9hdXRoZW50aWNhdGlvbi9yb3V0ZS5qcyIsIi4uL2NvbXBvbmVudHMvYnV0dG9uL2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy90ZXh0LWlucHV0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy90b2FzdC91c2VyLnBuZyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvdG9hc3QvaW5kZXguanMiLCIuLi9jb21wb25lbnRzL3RvYXN0L2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy9hbGVydC9pbmRleC5qcyIsIi4uL2NvbXBvbmVudHMvcm91dGUuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0xheW91dC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2suanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0Jsb2NrLmpzIiwiLi4vLi4vY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9ja2VkLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0FyY2hpdmUuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL01lc3NhZ2UuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL0Jsb2NrZXJNZXNzYWdlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9CbG9ja2VkTWVzc2FnZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdjaGF0LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9saXN0L2luZGV4LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9IYW5nb3V0LmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9QZXJzb25BZGQuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlci5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9VbnJlYWRIYW5nb3V0cy5qcyIsIi4uL2hhbmdvdXQvZmFrZU1lc3NhZ2VzLmpzIiwiLi4vaGFuZ291dC9yb3V0ZS5qcyIsIi4uL1N0b3J5Ym9va1JvdXRlcy5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbmF2LWJhci9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtZHJvcGRvd24uanMiLCIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xyXG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcclxuICAvLyAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcbiAgY29uc3Qge25hbWV9PXN0YXRlXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBpZihuYW1lKXtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obmFtZSxKU09OLnN0cmluZ2lmeSh7cm91dGUsZmVhdHVyZVJvdXRlfSkpXHJcbiAgICB9XHJcbiAgIFxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGlmKHN0YXRlICYmIHN0YXRlLm5hbWUgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSkpe1xyXG4gXHJcbiAgICAgICAgY29uc3Qge2ZlYXR1cmVSb3V0ZSxyb3V0ZX09IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpKVxyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gICAgfVxyXG5cclxuICB9LFtdKVxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAgQXBwUm91dGVQcm92aWRlciAgZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICBcclxuICAgICAgPEFwcFJvdXRlUHJvdmlkZXJcclxuICAgICAgIC8vXHJcbiAgICAgICAgdGl0bGU9XCJXZWJjb21cIlxyXG4gICAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnLG5hbWU6J3N0b3J5Ym9vaycgfX1cclxuICAgICAgPlxyXG4gICAgXHJcbiAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICA8L0FwcFJvdXRlUHJvdmlkZXI+XHJcblxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJ2ljb25zL01lc3NhZ2UnXHJcbmV4cG9ydCBmdW5jdGlvbiBJY29uc0RlbW8oKXtcclxuICAgIHJldHVybiA8ZGl2PlxyXG5cclxuICAgICAgICA8TWVzc2FnZSBjb3VudD17MX0vPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBsYWJlbCwgbmFtZSwgdHlwZSwgaXNWYWxpZCwgbWVzc2FnZSB9ID0gcHJvcHNcclxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIHAtMFwiPlxyXG4gICAgPGxhYmVsIGZvcj17bmFtZX0gPntsYWJlbH08L2xhYmVsPlxyXG4gICAgPGlucHV0IHR5cGU9e3R5cGV9IGNsYXNzTmFtZT17YGZvcm0tY29udHJvbCAke2lzVmFsaWQgJiYgJ2lzLXZhbGlkJ30gJHshaXNWYWxpZCAmJiBpc1ZhbGlkICE9PSB1bmRlZmluZWQgJiYgJ2lzLWludmFsaWQnfWB9IGlkPXtuYW1lfSBhcmlhLWRlc2NyaWJlZGJ5PXtuYW1lfXsuLi5wcm9wc30gLz5cclxueyFpc1ZhbGlkICYmIDxzbWFsbCBpZD1cImVtYWlsSGVscFwiIGNsYXNzTmFtZT17YCR7IWlzVmFsaWQgJiYgJ2ludmFsaWQtZmVlZGJhY2snfWB9IGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH0+e21lc3NhZ2V9PC9zbWFsbD59XHJcbiAgPC9kaXY+XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCdXR0b24ocHJvcHMpIHtcclxuICBjb25zdCB7IHRpdGxlLCBiZz1cImxpZ2h0XCIsb3V0bGluZSwgc2l6ZSxsb2FkaW5nPWZhbHNlLCBibG9ja30gPSBwcm9wcztcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9IHtgJHtiZyAmJiAhb3V0bGluZSYmYGJ0biBidG4tJHtiZ31gfSAke291dGxpbmUmJmBidG4gYnRuLW91dGxpbmUtJHtiZ31gfSAke3NpemUmJmBidG4gYnRuLSR7c2l6ZX1gfSAke2Jsb2NrICAmJiAnYnRuLWJsb2NrJ31gfSB7Li4ucHJvcHN9IGRpc2FibGVkPXtsb2FkaW5nfT5cclxuICAgICAgICB7bG9hZGluZyAmJiA8c3BhbiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtXCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj59IFxyXG4gICAgICAgIHsgbG9hZGluZyA/ICd3YWl0Li4uJzp0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFsZXJ0IChwcm9wcyl7XHJcbmNvbnN0IHthbGVydCxtZXNzYWdlfT1wcm9wc1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgYWxlcnQgYWxlcnQtJHthbGVydH1gfSByb2xlPVwiYWxlcnRcIiBkYXRhLXRlc3RpZD1cImFsZXJ0XCI+XHJcbiAgICB7bWVzc2FnZX1cclxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxyXG4gICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuaW1wb3J0IEFsZXJ0IGZyb20gJ2NvbnRyb2xzL2FsZXJ0J1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbihwcm9wcykge1xyXG4gIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCwgbG9hZGluZywgb25Mb2dpbiwgb25Gb2N1cywgb25DaGFuZ2UsIHZhbGlkYXRpb24sIG9uRm9yZ290UGFzc3dvcmQsIG9uQmx1ciwgZXJyb3IgfSA9IHByb3BzO1xyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cclxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbCBvciB1c2VybmFtZVwiXHJcbiAgICAgICAgbmFtZT0nZW1haWxvcnVzZXJuYW1lJ1xyXG4gICAgICAgIHR5cGU9J3RleHQnXHJcbiAgICAgXHJcbiAgICAgICAgaWQ9J2VtYWlsb3J1c2VybmFtZSdcclxuICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWxvcnVzZXJuYW1lJ1xyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnZW1haWxvcnVzZXJuYW1lJ10ubWVzc2FnZX1cclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2VtYWlsb3J1c2VybmFtZSddLmlzVmFsaWR9XHJcblxyXG4gICAgICAvPlxyXG5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgbGFiZWw9XCJQYXNzd29yZFwiXHJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICBuYW1lPSdwYXNzd29yZCdcclxuICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICBcclxuICAgICAgICBpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5pc1ZhbGlkfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XHJcblxyXG5cclxuICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgICAgICBpZD0nbG9naW4tYnRuJ1xyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9J2xvZ2luLWJ0bidcclxuICAgICAgICAgIG9uQ2xpY2s9e29uTG9naW59XHJcbiAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgdGl0bGU9XCJMb2dpblwiXHJcbiAgICAgICAgICBiZz1cInByaW1hcnlcIlxyXG4gICAgICAgIC8+XHJcblxyXG4gICAgICAgIDxCdXR0b24gb25DbGljaz17b25Gb3Jnb3RQYXNzd29yZH0gaWQ9J2ZvcmdvdHBhc3N3b3JkJyBkYXRhLXRlc3RpZD0nZm9yZ290cGFzc3dvcmQnIG91dGxpbmUgYmc9XCJwcmltYXJ5XCIgdGl0bGU9XCJGb3Jnb3QgUGFzc3dvcmQhXCIgLz5cclxuXHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBMb2dpbiBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luJ1xyXG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHsgZW1haWxvcnVzZXJuYW1lOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiAnLicgfSB9XHJcbmNvbnN0IHZhbGlkYXRpb25FcnJvciA9IHsgZW1haWxvcnVzZXJuYW1lOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnaW52YWxpZCBjcmVkZW50aWFscycgfSwgcGFzc3dvcmQ6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdpbnZhbGlkIGNyZWRlbnRpYWxzJyB9IH1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9naW5TdGF0ZXMoKSB7XHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+IExvZ2luIFZhbGlkYXRpb24gU3VjY2VzczwvaDU+XHJcblxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IC8+XHJcblxyXG5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+TG9naW4gVmFsaWRhdGlvbiBFcnJvcjwvaDU+XHJcblxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfSAvPlxyXG5cclxuXHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkxvZ2dpbmcgaW48L2g1PlxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IGxvYWRpbmcgLz5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+TG9nZ2luZyBTZXJ2ZXIgZXJyb3I8L2g1PlxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9ICBlcnJvcj17e21lc3NhZ2U6J1NlcnZlciBpcyB1bmF2YWlsYWJsZSd9fS8+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0J1xyXG5pbXBvcnQgQWxlcnQgZnJvbSAnY29udHJvbHMvYWxlcnQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cChwcm9wcykge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCwgbG9hZGluZywgb25TaWdudXAsIG9uQ2hhbmdlLCB2YWxpZGF0aW9uLCBvbkJsdXIsIG9uRm9jdXMsIGVycm9yIH0gPSBwcm9wcztcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNCBib3JkZXIgbXgtYXV0byByb3VuZGVkXCIgc3R5bGU9e3sgbWFyZ2luOiAxNSwgcGFkZGluZzogMTYgfX0+XHJcbiAgICAgIHtsb2FkaW5nICYmIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIiBzdHlsZT1cImhlaWdodDogNXB4O1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIHByb2dyZXNzLWJhci1hbmltYXRlZFwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIxMDBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIiBzdHlsZT1cIndpZHRoOiAxMDAlXCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2Pn1cclxuICAgICAge2Vycm9yICYmIDxBbGVydCBhbGVydD1cImRhbmdlclwiIG1lc3NhZ2U9e2Vycm9yLm1lc3NhZ2V9IC8+fVxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cclxuICAgICAgICBsYWJlbD1cIlVzZXJuYW1lXCJcclxuICAgICAgICB2YWx1ZT17dXNlcm5hbWV9XHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIHR5cGU9J3RleHQnXHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J3VzZXJuYW1lJ1xyXG4gICAgICAgIG5hbWU9J3VzZXJuYW1lJ1xyXG4gIFxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsndXNlcm5hbWUnXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsndXNlcm5hbWUnXS5tZXNzYWdlfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uQmx1cj17b25CbHVyfVxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIHZhbHVlPXtlbWFpbH1cclxuICAgICBcclxuICAgICAgICB0eXBlPSdlbWFpbCdcclxuICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWwnXHJcbiAgICAgICAgbmFtZT0nZW1haWwnXHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvPlxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cclxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgIFxyXG4gICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIGRhdGEtdGVzdGlkPSdwYXNzd29yZCdcclxuICAgICAgICBuYW1lPSdwYXNzd29yZCdcclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10uaXNWYWxpZH1cclxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10ubWVzc2FnZX1cclxuXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uU2lnbnVwfVxyXG4gICAgICAgIGlkPSdzaWdudXAtYnRuJ1xyXG4gICAgICAgIGRhdGEtdGVzdGlkPVwic2lnbnVwLWJ0blwiXHJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICB0aXRsZT1cIlNpZ251cFwiXHJcbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcclxuICAgICAgLz5cclxuXHJcblxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IFNpZ251cCBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL3NpZ251cCdcclxuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPSB7IHVzZXJuYW1lOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiAnLicgfSwgZW1haWw6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0gfVxyXG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB7IHVzZXJuYW1lOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnVXNlcm5hbWUgaXMgbm90IHZhbGlkJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ1Bhc3dvcmQgaXMgbm90IHZhbGlkJyB9LCBlbWFpbDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ0VtYWlsIGlzIG5vdCB2YWxpZCcgfSB9XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cFN0YXRlcygpIHtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlNpZ251cCBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxyXG4gICAgICAgICAgICAgICAgPFNpZ251cCB1c2VybmFtZT1cInRlc3R1c2VyXCIgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWdudXAgVmFsaWRhdGlvbiBFcnJvcjwvaDU+XHJcbiAgICAgICAgICAgICAgICA8U2lnbnVwIHVzZXJuYW1lPVwidGVzdHVzZXJcIiBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uRXJyb3J9IC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2lnbmluZyB1cDwvaDU+XHJcbiAgICAgICAgICAgICAgICA8U2lnbnVwIHVzZXJuYW1lPVwidGVzdHVzZXJcIiBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31sb2FkaW5nIC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWduaW5nIFNldmVyIGVycm9yPC9oNT5cclxuICAgICAgICAgICAgICAgIDxTaWdudXAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSBlcnJvcj17e21lc3NhZ2U6J1NlcnZlciBpcyB1bmF2YWlsYWJsZSd9fSAvPlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkKHByb3BzKSB7XHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgdmFsaWRhdGlvbiwgb25DaGFuZ2UsIG9uUGFzc3dvcmRDaGFuZ2UsIGxvYWRpbmcsZXJyb3IgfSA9IHByb3BzO1xyXG5cclxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIC8vICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gIC8vICAgdmFyIHVybHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XHJcblxyXG4gIC8vICAgaWYgKHVybHRva2VuKSB7XHJcbiAgLy8gICAgIGRpc3BhdGNoKGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW46IHVybHRva2VuIH0pKTtcclxuICAvLyAgIH1cclxuICAvLyB9LCBbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIiBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fT5cclxuICAgICAge2xvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjEwMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+fVxyXG4gICAgICB7ZXJyb3IgJiYgPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT17ZXJyb3IubWVzc2FnZX0gLz59XHJcbiAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIGxhYmVsPVwiQ29uZmlybVwiXHJcbiAgICAgICAgdmFsdWU9e2NvbmZpcm19XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J2NvbmZpcm0nXHJcbiAgICAgICAgbmFtZT0nY29uZmlybSdcclxuICAgICAgIFxyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2NvbmZpcm0nXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnY29uZmlybSddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvPlxyXG4gICAgICA8QnV0dG9uXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J2NoYW5nZS1wYXNzLWJ0bidcclxuICAgICAgICBvbkNsaWNrPXtvblBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgIHRpdGxlPVwiQ2hhbmdlXCIgYmc9XCJwcmltYXJ5XCIgLz5cclxuICAgIDwvZGl2PlxyXG5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkJ1xyXG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHsgcGFzc3dvcmQ6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0sIGNvbmZpcm06IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0gfVxyXG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB7IHBhc3N3b3JkOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnaW52YWxpZCBwYXNzd29yZCBmb3JtYXQnIH0sIGNvbmZpcm06IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdpbnZhbGlkIHBhc3N3b3JkIGZvcm1hdCcgfSB9XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkU3RhdGVzKCkge1xyXG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPiBDaGFuZ2VQYXNzd29yZCBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxyXG4gICAgICAgIDxDaGFuZ2VQYXNzd29yZCBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiIGNvbmZpcm09XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gIC8+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkNoYW5nZVBhc3N3b3JkIFZhbGlkYXRpb24gRXJyb3I8L2g1PlxyXG4gICAgICAgIDxDaGFuZ2VQYXNzd29yZCB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uRXJyb3J9ICAvPlxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5DaGFuZ2VQYXNzd29yZCBpbiBwcm9ncmVzczwvaDU+XHJcbiAgICAgICAgPENoYW5nZVBhc3N3b3JkIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgY29uZmlybT1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSBsb2FkaW5nIC8+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkNoYW5nZVBhc3N3b3JkIFNlcnZlciBlcnJvcjwvaDU+XHJcbiAgICAgICAgPENoYW5nZVBhc3N3b3JkIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgY29uZmlybT1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSBlcnJvcj17eyBtZXNzYWdlOiAnU2VydmVyIGlzIHVuYXZhaWxhYmxlJyB9fSAvPlxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVxdWVzdFBhc3NDaGFuZ2UocHJvcHMpIHtcclxuICBjb25zdCB7IGVtYWlsLCB2YWxpZGF0aW9uLCBvblJlcXVlc3RQYXNzd29yZENoYW5nZSwgbG9hZGluZywgb25DaGFuZ2UsZXJyb3IgfSA9IHByb3BzXHJcblxyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfS8+fVxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXHJcbiAgICAgICAgdmFsdWU9e2VtYWlsfVxyXG4gICAgIFxyXG4gICAgICAgIG5hbWU9J2VtYWlsJ1xyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICB0eXBlPSdlbWFpbCdcclxuICAgICAgICBpZD0nZW1haWwnXHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcblxyXG4gICAgXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicmVxdWVzdHBhc3NjaGFuZ2UtYnRuXCJcclxuICAgICAgICB0aXRsZT1cIlJlcXVlc3QgcGFzc3dvcmQgY2hhbmdlXCJcclxuICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgIGJnPVwicHJpbWFyeVwiXHJcblxyXG4gICAgICAvPlxyXG5cclxuXHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgRm9yZ290UGFzc3dvcmQgZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9Gb3Jnb3RQYXNzd29yZCdcclxuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPSB7IGVtYWlsOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9IH1cclxuY29uc3QgdmFsaWRhdGlvbkVycm9yID0geyBlbWFpbDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ0ludmFsaWQgZW1haWwgZm9ybWF0JyB9IH1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9yZm90UGFzc3dvcmRTdGF0ZSgpIHtcclxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj4gRm9yZ290UGFzc3dvcmQgVmFsaWRhdGlvbiBTdWNjZXNzPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5Gb3Jnb3RQYXNzd29yZCBWYWxpZGF0aW9uIEVycm9yPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdGdtYWlsLmNvbVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25FcnJvcn0gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5SZXF1ZXN0IFBhc3N3b3JkIENoYW5nZSBpbiBwcm9ncmVzczwvaDU+XHJcblxyXG4gICAgICAgIDxGb3Jnb3RQYXNzd29yZCBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IGxvYWRpbmcgLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2VydmVyIGVycm9yPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gZXJyb3I9e3ttZXNzYWdlOidTZXJ2ZXIgaXMgdW5hdmFpbGFibGUnfX0gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgTG9naW5TdGF0ZXMgZnJvbSAnLi9zdGF0ZXMvbG9naW4uc3RhdGVzJ1xyXG5pbXBvcnQgU2lnblVwU3RhdGVzIGZyb20gJy4vc3RhdGVzL3NpZ251cC5zdGF0ZXMnXHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZFN0YXRlcyBmcm9tICcuL3N0YXRlcy9jaGFuZ2UtcGFzc3dvcmQuc3RhdGVzJ1xyXG5pbXBvcnQgRm9yZ290UGFzc3dvcmRTdGF0ZXMgZnJvbSAnLi9zdGF0ZXMvZm9yZ290LXBhc3N3b3JkLnN0YXRlcydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aERlbW9Sb3V0ZXMoKSB7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9sb2dpblwiPlxyXG4gICAgICAgICAgICA8TG9naW5TdGF0ZXMgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9zaWdudXBcIj5cclxuICAgICAgICAgICAgPFNpZ25VcFN0YXRlcyAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2NoYW5nZS1wYXNzd29yZFwiPlxyXG4gICAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmRTdGF0ZXMgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9mb3Jnb3QtcGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgPEZvcmdvdFBhc3N3b3JkU3RhdGVzIC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgIF1cclxufSIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uRGVtbyAoKXtcclxuXHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZSA9e3tkaXNwbGF5OidmbGV4JywgZmxleERpcmVjdGlvbjonY29sdW1uJyx3aWR0aDonMTAwJScsIGFsaWduSXRlbXM6J2NlbnRlcicsYmFja2dyb3VuZENvbG9yOid5ZWxsb3cnfX0+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICA8aDM+RmlsbGVkIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCI+UHJpbWFyeTwvQnV0dG9uPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIj5TZWNvbmRhcnk8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwic3VjY2Vzc1wiPlN1Y2Nlc3M8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFuZ2VyXCI+RGFuZ2VyPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIj5XYXJuaW5nPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImluZm9cIj5JbmZvPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImxpZ2h0XCI+TGlnaHQ8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiPkRhcms8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwibGlua1wiPkxpbms8L0J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ID5cclxuICAgICAgICAgICAgPGgzPk91dGxpbmVkIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgb3V0bGluZT17dHJ1ZX0gdGl0bGU9XCJQcmltYXJ5XCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiBvdXRsaW5lIHRpdGxlPVwiU2Vjb25kYXJ5XCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzdWNjZXNzXCIgb3V0bGluZSB0aXRsZT1cIlN1Y2Nlc3NcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImRhbmdlclwiIG91dGxpbmUgdGl0bGU9XCJEYW5nZXJcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIiBvdXRsaW5lIHRpdGxlPVwiV2FybmluZ1wiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiaW5mb1wiIG91dGxpbmUgdGl0bGU9XCJJbmZvXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJsaWdodFwiIG91dGxpbmUgdGl0bGU9XCJMaWdodFwiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiIG91dGxpbmUgdGl0bGU9XCJEYXJrXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJsaW5rXCIgb3V0bGluZSB0aXRsZT1cIkxpbmtcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnfX0+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICA8aDM+U21hbGwgQnV0dG9uczwvaDM+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcInNpemU9XCJzbVwiIHRpdGxlPVwibGlua1wiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwic2Vjb25kYXJ5XCIgc2l6ZT1cInNtXCIgdGl0bGU9XCJTZWNvbmRhcnlcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGgzPkxhcmdlIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCJzaXplPVwibGdcIiB0aXRsZT1cIkxpbmtcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInNlY29uZGFyeVwiIHNpemU9XCJsZ1wiIHRpdGxlPVwiU2Vjb25kYXJ5XCIvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICBcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgIDxoMz4gRGlzYWJsZWQgQnV0dG9uczwvaDM+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiBkaXNhYmxlZCAgdGl0bGU9XCJMaW5rXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiAgZGlzYWJsZWQgdGl0bGU9XCJTZWNvbmRhcnlcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgPGgzPiBTcGlubmluZyBCdXR0b248L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgdGl0bGU9XCJTcGlubmluZ1wiIGxvYWRpbmcvPlxyXG4gICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0U3RhdGVzKCkge1xyXG4gICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGg1PlZhbGlkYXRpb248L2g1PlxyXG4gICAgICAgIDxUZXh0SW5wdXQgaXNWYWxpZD17dHJ1ZX0gLz5cclxuICAgICAgICA8VGV4dElucHV0IGlzVmFsaWQ9e2ZhbHNlfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgXHJcbiAgICA8L2Rpdj5cclxufSIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUNBQ0FRQUFBQnBONmxBQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQW1KTFIwUUFBS3FOSXpJQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFIZEVsTlJRZmtCQnNJS2lQd2htbUlBQUFIcVVsRVFWUjQydDJkYVd4VVZSVEhmMzB0cFZSR3dMSVdLQVVxWVJXSUFaV3FSS2kyV0JBd0VzSW5vM3d3dU1lRVNKQVBpTW9TQzlnUVNQZ0NvVjhnR21TTExDSkUyYkdBVWxZcCsxS1dVcmFoZ0ZDbWZwZ01NMjFuZSsvZGMrL1VjejRRT3UrZTgvK2Y5K2JPdmVlZWUxOFN1aVNKcnZTbUs5bGswWVlNTWtnamxhZUFhaDd5Z0NxcXVNWUZ6bkthWTV5aFZoY3NhZWxJTHJrTW9pOGVHNjI4SEtLVW5leWtRazhnMUVzYUJSVHpEN1V1OVRqenlhZXBhVHAycEFtRmxIRExOZlZRdmNVeUNtbGltbHBzeVdFNjU1VlNEOVVyRk5QSE5NWEk4akxyOEltUkQrb09SbW5vdTJ4SkVtTTRvSUY2VVBjek9uR0NVTUErcmVRRFdrcSthZXJRZzNWR3lBZDBNMzNOa1UrbmlJZEc2ZGRTeTBQbTBNd0UvVHhPR1NjZjBIS0c2U1dmeG13ZUc2Y2RxajRXazY2TGZqOE9HeWNjVHN2MGpCRW1jTmM0MVVoNmozZGx5U2N6enpqSldGcUVKVVUvbFJYRzZjV2pQNU1tUWI4NW00eFRpMWUzOHJScSt1M1liNXlXSGQxSFc1WDBzeWszVHNtdW5pQmJGZjAySERkT3g0bWVwTDBLK3A1Rzl2Q0g2a0ZhdXFXZjJvaTZ2bkM2MVYweXplSkg0eFRjNmlxU28xR00raUZ6bWFqaVcyUlVlcExHYjg2YVRqQis5OVNvajlGTzZQZWoyamgwVlhxZHpuYnBwM0hRT0d5VnVpZFNTajFTSHpDZlVVcStnWWtpblVpMTB4UGthVWx2NjFVZlE4TlJEWmRhVHFlTTdxWnZtWUFjWlFDUDZ2OHgzRmRnRm9WYUFGV3hqLzBjb3hLUGxyUm1HN3pzaW4xWkx4NkpQNDdYbUZFdm5kMlBiNmtVOSt1bFUrd0FiQkFHY1ordkk2UXYwL21HQjhMZWY0cEZ2MEFZd0NrR1J2WC9QS2VGRVF5UDVqNUplSkhyTDlyRmZBTGJVeWFLWVZzMDUyT0Y3MzVzK2dDdE9TR0s0NVhJcmlWWGVQK2xYMXowQWZwd1R4REpwa2h1aDR2R2ZWcmM5QUUrRWNVeUtMelQ5WUl1RDVCaUt3REpvbm1vMWVGY1BpczYvTFUvczVEc2ozemhScnB6QkIyV08xaXRTUlpkZmY2dXZyc21WQWk2KzlRMmZZQXZCQkZkcmo4OUhpbjZ3RGxicE9nZ2lLbVdBcitUd0tNNTNoSEUrT1FZMXh5MXU4d0pRVlRqUXdQUVZEVDk4WWZqbHI4TG9ocERhakFBcjlGQzBOVU9BeTFqUzB0L2dzUWZnQkdDanFEY2NjdVRvcmp5Z3dFb0VIVjB5WEhMaTZLNFJnUUMwSkVlb283dUdtZ1pqL1NtZ3o4QXVhSnU0TEhqbG84Y3Q0eFBodWdKZ1BOcWpaYkN5SEw5QVJqazJwQVVEY25mSm9EQllKRWtYbTJiNmJobFIyRmtmVW15Nkc1ckw0OFQ2ZSs0NVFCaFpDM0lzdWdwN01RTmplZkVzZlcyNkNidVpKakRyUTJXaGhMb2JJc3U0azQ2OG9LamRpL1JRUnhiVjRzc2NTZE81NXFTTTlTQWRMSFVGaFJHa0ltMHN0Mm1GZTlwUU5iRzRoa05iang4YUx2TlJ6VFhnQ3dEMFZSWVVPL1lMRkxwZ2xjTHJvdVdwdjAySGhiWnVuNlJsdnNQNllpdXdkVFZ5WEhEbXFvTlV6WFVhSFAybUhmaW9qOU80MzZrR3AwQnFLVW1qczd3ZmExYjhXclFYZzI0SU1yY3c4TkN6V2lxNGFabWw3VmNpREQvekJUY2R4NUpiMWpjMDlMYmhrb25mMEs2Z1hqRnA3OE5wZHJpaG5hbk5SeU5FSUJUMnJGVVdWelg3TEtXejNrUTRiTmlOQjJkWWk0QUZZeGtZY1JQRnpLR0sxcnhYTGM0cjgyWmx6bjBaSDNVYTlhU3d4UnVhc04wRmo3VzA5c3l3OGFNc0NVek5QMDZUWkpkR1BmclpTWTd5RHMrelJTdWlHTXJnRzZpRHJ4TWM3R3R2UmxmQ2M4S3N5Q0oyMExHSDFPaUlLbVZ5V0t4dWNFdGY3WnlwNGp4Y2w1MFRUNGdRNFFLYUxmN1Y0WktsUUVOeWtvR3NrZVp0VjBNWkkwQXlqLzkvNHhUSHRsNUFudjRrd1VtU20vN1RXY3FObXN2OTJOSEZpaEcrbVJ2c2NyTjBhdmtUbkFnbVY4VUlqMGNOUHlETXFOWGhkUHNyUldPRGI0UG1zMVhablNzS0gxUTJXUGxCWTAyVlhUNjN6NHRCNXlWS3NGNnMyNVdZcGtTbzI5cW9LK3FqSHBKWGFPRkNreGUxSFRBbmFWa01lZU51a1pURkJndDFrSWZZSkZyckUrS3BRTS9XVFdVdUlZbE1WWUxMNnRkVzFqU3NBSXR4K1dHQ1o5NFNWTlFXcm04Lzc3d1pTSHVCaG1udGRFSE9PY0s2OXFnb2RCUjIxeFhrQTY3YXEzWFcxSDRBR3psZ0F1amxWb0RjTlZGMjcyaG15ZnJqdHRudURCN1cyc0E3cmhvVzRkbDNRQ3NDY3lRTlVQUzZhMlVEYUgvclQ5MHlXZWpROE9YdEdiMDJ6dGVSaHZPMXVnWHFKeHdKcDZ1cUUrMzRlQTFoeU1SRmk4YnYzanBWWC83UnNNak5HN2dFUytnTnlWVCtiWCtuOEpOWDVwUlJvNXByQUp5aElFTkI4RGgwbGYzK1FEZHE3VHk0bU5TdUIwbzRROVNPa01yaFZuOXhKQlpMTFZ6ZVZQK050NWpxOVRkOXQ5TzBTZUJEMUMycTVYeEhKL1RVTWIrVHc3VTh2R1cwKzlOa1hId0tuU204NDdEYWlSblNVZlQ1ZTRXYXBxdzBUZ0ZON3JGL1J1S1BJYmVJS0pDUzlYVW5MZHV0QWNyeDNkd1V4eVNMWHkyazRTZVVMc2RMSVBkeGluWjBWTDFpN1RORzFGM3VFWDk4Zm9BcVN3M1RpMGVYU256Z2dVQWl6a0pQanIwTVZPd1FBT0FQQTNsaTA2MVVzLzZkQ2UyRzZjYVR2ZXFlNlZDTEVsaGVzSzlhS2xZOStzWWh5YlE2NWJLb3AwU0tma2NmTVlkNCtTcm1XNHlpNTFKaVZINjY3VHNmbzhodzlsbWhQeHUzZStZaXlhdmFoNG43dFZVa0dWTCtsT2lZUitxajgySmZQUi9aNzUwV2IwUlRTdVkzUmpPdlUraGdLV0s5L3pjWUFuNU5rK21OU3lwdk01Y2pyaW1mcGdpOHVSKzZPUkxHOXVUU3k2RDZXdXJpdXcyaHlobEJ6dGRGY01rUkFDQ2trMHZ1cEpORm0zSklJTjBVdkFBWG1xNFJ4VlZYT1VDWnpqRE1jN3BBdlVmaDJ3Q013bGlKM0FBQUFBbGRFVllkR1JoZEdVNlkzSmxZWFJsQURJd01qQXRNRFF0TWpkVU1EZzZOREk2TXpVck1EQTZNREQrcVZzMEFBQUFKWFJGV0hSa1lYUmxPbTF2WkdsbWVRQXlNREl3TFRBMExUSTNWREE0T2pReU9qTTFLekF3T2pBd2ovVGppQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB1c2VySW1hZ2UgZnJvbSAnLi91c2VyLnBuZydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVG9hc3QgKCl7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJ0b2FzdFwiIHJvbGU9XCJhbGVydFwiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2FzdC1oZWFkZXJcIj5cclxuICAgICAgPGltZyBzcmM9e3VzZXJJbWFnZX0gY2xhc3NOYW1lPVwicm91bmRlZCBtci0yXCIgYWx0PVwiLi4uXCIvPlxyXG4gICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cIm1yLWF1dG9cIj5Cb290c3RyYXA8L3N0cm9uZz5cclxuICAgICAgPHNtYWxsIGNsYXNzTmFtZT1cInRleHQtbXV0ZWRcIj5qdXN0IG5vdzwvc21hbGw+XHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm1sLTIgbWItMSBjbG9zZVwiIGRhdGEtZGlzbWlzcz1cInRvYXN0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XHJcbiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9hc3QtYm9keVwiPlxyXG4gICAgICBTZWU/IEp1c3QgbGlrZSB0aGlzLlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBUb2FzdCBmcm9tICdjb250cm9scy90b2FzdCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVG9hc3REZW1vKCl7XHJcblxyXG4gICAgcmV0dXJuIDxUb2FzdC8+XHJcbn0gIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnREZW1vICgpe1xyXG4gICAgcmV0dXJuPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT1cIlNlcnZlciBpcyB0ZW1wb3JhcmlseSB1bmF2YWlsYWJsZVwiLz5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJ1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJy4vdGV4dC1pbnB1dCdcclxuaW1wb3J0IFRvYXN0RGVtbyBmcm9tICcuL3RvYXN0J1xyXG5pbXBvcnQgQWxlcnREZW1vIGZyb20gJy4vYWxlcnQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbXBvbmVudHNSb3V0ZSgpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYnV0dG9uXCI+XHJcbiAgICAgICAgICAgIDxCdXR0b24gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi90ZXh0LWlucHV0XCI+XHJcbiAgICAgICAgICAgIDxUZXh0SW5wdXQgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi90b2FzdFwiPlxyXG4gICAgICAgICAgICA8VG9hc3REZW1vIC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYWxlcnRcIj5cclxuICAgICAgICAgICAgPEFsZXJ0RGVtbyAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICBdXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWUnLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGF5b3V0KHsgY2hpbGRyZW4sIHN0eWxlLCBpZCB9KSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9e2lkfSBzdHlsZT17eyAuLi5zdHlsZXMucm9vdCwgLi4uc3R5bGUgfX0+e2NoaWxkcmVufTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0ICBCdXR0b24gIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGNoZWNrYm94OiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgY2hlY2tib3hSb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgIHBhZGRpbmc6IDE2LFxyXG4gIH0sXHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZ1RvcDo2OFxyXG4gIH0sXHJcbiAgYnRuOiB7XHJcbiAgICBmbGV4OiAxLFxyXG4gICAgbWFyZ2luUmlnaHQ6IDQsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgb25DYW5jZWwsIG9uQmxvY2ssIG9uUmVwb3J0IH0pIHtcclxuXHJcbiBcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY2hlY2tib3hSb290fT5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XHJcbiAgICAgICAgPGxhYmVsPlJlcG9ydDwvbGFiZWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sXCI+XHJcbiAgICAgICAgPEJ1dHRvbiBkYXRhLXRlc3RpZD0nY2FuY2VsLWJ0bicgIG9uQ2xpY2s9e29uQ2FuY2VsfSB0aXRsZT1cIkNhbmNlbFwiIGJnPVwic2Vjb25kYXJ5XCIgb3V0bGluZSBibG9jay8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICBcclxuICBcclxuICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxyXG4gIDxCdXR0b24gaWQ9XCJCTE9DS1wiIG9uQ2xpY2s9e29uQmxvY2t9IGRhdGEtdGVzdGlkPVwiYmxvY2stYnRuXCIgIHRpdGxlPVwiQmxvY2tcIiBiZz1cInByaW1hcnlcIiBibG9jay8+XHJcbiAgPC9kaXY+XHJcbiAgICAgXHJcblxyXG5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2soe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgb25DbGljayxcclxuICBpZCxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGhlaWdodD17aGVpZ2h0fVxyXG4gICAgICB2aWV3Qm94PScwIDAgMjQgMjQnXHJcbiAgICAgIHdpZHRoPXt3aWR0aH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgaWQ9e2lkfVxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSBpZD17aWR9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgaWQ9e2lkfVxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek00IDEyYzAtNC40MiAzLjU4LTggOC04IDEuODUgMCAzLjU1LjYzIDQuOSAxLjY5TDUuNjkgMTYuOUM0LjYzIDE1LjU1IDQgMTMuODUgNCAxMnptOCA4Yy0xLjg1IDAtMy41NS0uNjMtNC45LTEuNjlMMTguMzEgNy4xQzE5LjM3IDguNDUgMjAgMTAuMTUgMjAgMTJjMCA0LjQyLTMuNTggOC04IDh6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIENlbnRlcih7IGNoaWxkcmVuLCBzdHlsZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgLi4uc3R5bGUsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJ2ljb25zL0Jsb2NrJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5pbXBvcnQgTGF5b3V0IGZyb20gJy4vTGF5b3V0JztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmdUb3A6IDY4XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrZWQoeyBoYW5nb3V0LCBvblVuYmxvY2ssIG9uQ2xvc2UgfSkge1xyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJibG9ja2VkLXVpXCI+XHJcbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxyXG4gICAgICAgIDxCbG9jayB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cInJlZFwiIC8+XHJcbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cclxuICAgICAgICAgIDxCdXR0b24gZGF0YS10ZXN0aWQ9J2Nsb3NlLWJ0bicgb25DbGljaz17b25DbG9zZX0gdGl0bGU9XCJDTE9TRVwiIGJnPVwic2Vjb25kYXJ5XCIgYmxvY2sgb3V0bGluZSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sXCI+XHJcbiAgICAgICAgICA8QnV0dG9uIGlkPSdVTkJMT0NLJyBvbkNsaWNrPXtvblVuYmxvY2t9IGRhdGEtdGVzdGlkPSd1bmJsb2NrLWJ0bicgdGl0bGU9XCJVTkJMT0NLXCIgYmc9XCJwcmltYXJ5XCIgYmxvY2sgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gRGVsZXRlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXJjaGl2ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17MjR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMjAuNTQgNS4yM2wtMS4zOS0xLjY4QzE4Ljg4IDMuMjEgMTguNDcgMyAxOCAzSDZjLS40NyAwLS44OC4yMS0xLjE2LjU1TDMuNDYgNS4yM0MzLjE3IDUuNTcgMyA2LjAyIDMgNi41VjE5YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNi41YzAtLjQ4LS4xNy0uOTMtLjQ2LTEuMjd6TTEyIDE3LjVMNi41IDEySDEwdi0yaDR2MmgzLjVMMTIgMTcuNXpNNS4xMiA1bC44MS0xaDEybC45NCAxSDUuMTJ6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSAnaWNvbnMvRGVsZXRlJztcclxuaW1wb3J0IHsgQXJjaGl2ZSB9IGZyb20gJ2ljb25zL0FyY2hpdmUnO1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gICdpY29ucy9CbG9jayc7XHJcbmltcG9ydCAgQnV0dG9uICBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpY29uQnRuOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbjogOCB9LFxyXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGJ0bkNvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbiAgYnRuT2s6IHtcclxuICAgIG1hcmdpbjogOCxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xyXG4gIG9uQmxvY2ssXHJcbiAgb25EZWxldGUsXHJcbiAgb25BcmNoaXZlLFxyXG4gIG9uTm90aWZpY2F0aW9uLFxyXG4gIG9uQ29udmVyc2F0aW9uSGlzdG9yeSxcclxuICBvbk5hdmlnYXRpb24sXHJcbiAgb25PayxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XHJcbiAgICAgICAgPENoZWNrYm94XHJcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxociAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Db250YWluZXJ9PlxyXG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gaWQ9XCJiY2t1aVwiIHRpdGxlPVwiQmxvY2tcIiBJY29uPXtCbG9ja30gb25DbGljaz17b25OYXZpZ2F0aW9ufSAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvbk9rfSB0aXRsZT1cIk9LXCIgYmc9XCJwcmltYXJ5XCIgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBJY29uQnV0dG9uKHsgSWNvbiwgdGl0bGUsIG9uQ2xpY2ssaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pY29uQnRufT5cclxuICAgICAgPGJ1dHRvbiBpZD17aWR9IHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xpY2t9IGRhdGEtdGVzdGlkPXtgJHtpZH0tYnRuYH0+XHJcbiAgICAgICAgPEljb24gaWQ9e2lkfS8+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8ZGl2Pnt0aXRsZX08L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENoZWNrYm94KHsgbGFiZWwsIG9uQ2hhbmdlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBtYXJnaW46IDgsIG1hcmdpblRvcDogOCB9fT5cclxuICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz5cclxuICAgICAgPGxhYmVsPntsYWJlbH08L2xhYmVsPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuLy9pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGJvcmRlckNvbG9yOiAnI2VlZWVlZScsXHJcbiAgICBib3JkZXJTdHlsZTogJ3NvbGlkJyxcclxuICAgIGJvcmRlcldpZHRoOiAxLFxyXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxyXG4gICAgcGFkZGluZzogMyxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIG1pbkhlaWdodDogMzUsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgfSxcclxuICB1c2VybmFtZTogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGxvZzoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgY29sb3I6ICcjNzM3MzczJyxcclxuICAgIGZvbnRTaXplOiAxMCxcclxuICB9LFxyXG4gIG1lc3NhZ2U6IHt9LFxyXG59O1xyXG4vL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSx0aW1lc3RhbXAgfSA9IG1lc3NhZ2U7XHJcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCB7IGRldmljZSB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIGZ1bmN0aW9uIGNvbnZlcnRNUyhtcykge1xyXG4gICAgdmFyIGQsIGgsIG0sIHM7XHJcbiAgICBzID0gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xyXG4gICAgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcclxuICAgIHMgPSBzICUgNjA7XHJcbiAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xyXG4gICAgbSA9IG0gJSA2MDtcclxuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XHJcbiAgICBoID0gaCAlIDI0O1xyXG4gICAgc2V0RGF5cyhkKTtcclxuICAgIHNldEhvdXJzKGgpO1xyXG4gICAgc2V0TWludXRlcyhtKTtcclxuICAgIHNldFNlY29uZHMocyk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYodGltZXN0YW1wKXtcclxuICBcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSB0aW1lc3RhbXApO1xyXG4gICAgICB9LCAwKTtcclxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcclxuICAgICAgfSwgNjAwMDApO1xyXG4gXHJcblxyXG4gICAgfVxyXG4gICBcclxuICB9LCBbdGltZXN0YW1wXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIG1hcmdpbkJvdHRvbTogMyB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VcIlxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2BtZXNzYWdlLWZvbnQtJHtkZXZpY2V9LXNpemVgfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH1cclxuICAgICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5sb2d9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XHJcbiAgPGRpdj5cclxuICAgICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA9PT0gMCAmJiBtaW51dGVzID4gMCAmJiA8ZGl2PnttaW51dGVzfSBtaW51dGVzIGFnbyA8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtob3Vyc30gaG91cnMge21pbnV0ZXN9IG1pbnV0ZXMgYWdveycgJ31cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAge2RheXMgPD0gMTAgJiYgZGF5cyA+IDEgJiYgPGRpdj57ZGF5c30gZGF5cyBhZ288L2Rpdj59XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAvLyBwb3NpdGlvbjonZml4ZWQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIC8vIGJvdHRvbToxMCxcclxuICAgIC8vIHJpZ2h0OjEwLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIC8vbWFyZ2luOjBcclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICBtYXJnaW5MZWZ0OiA4LFxyXG4gICAgbWFyZ2luUmlnaHQ6IDgsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgICB3aWR0aDogJzEwMCUnXHJcbiAgfSxcclxuXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBsb2FkaW5nLCBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlLCBoYW5nb3V0IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cCBtYi0zXCI+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiAgYXJpYS1sYWJlbD1cIlJlY2lwaWVudCdzIHVzZXJuYW1lXCIgYXJpYS1kZXNjcmliZWRieT1cImJ1dHRvbi1hZGRvbjJcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWlucHV0XCIgdmFsdWU9e21lc3NhZ2VUZXh0fSAvPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcIiB0eXBlPVwiYnV0dG9uXCIgbG9hZGluZz17bG9hZGluZ30gZGlzYWJsZWQ9e2hhbmdvdXQgJiYgaGFuZ291dC5zdGF0ZSA9PT0gJ0JMT0NLRUQnfSBpZD0nTUVTU0FHRScgb25DbGljaz17b25NZXNzYWdlfSBkYXRhLXRlc3RpZD0nc2VuZC1idG4nPlNlbmQ8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgZmxvYXQ6ICdyaWdodCcsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgZm9udFNpemU6IDE2LFxyXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VyTWVzc2FnZSh7IG1lc3NhZ2UgfSkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZXItbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9PC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlZE1lc3NhZ2UoeyBtZXNzYWdlLG9uTmF2aWdhdGlvbiB9KSB7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVOYXZpZ2F0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIG9uTmF2aWdhdGlvbihlKVxyXG4gICAgfVxyXG4gICAgZGVidWdnZXI7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlZC1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH1cclxuICAgIDxhIGlkPVwiVU5CTE9DS1wiIGRhdGEtdGVzdGlkPVwic2VlbW9yZS1idG5cIiBocmVmPVwiL1wiIG9uQ2xpY2s9e2hhbmRsZU5hdmlnYXRpb259PnNlZSBtb3JlPC9hPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgIE1lc3NhZ2UgIGZyb20gJy4vTWVzc2FnZSc7XHJcbmltcG9ydCAgTWVzc2FnZUVkaXRvciAgZnJvbSAnLi9NZXNzYWdlRWRpdG9yJztcclxuaW1wb3J0IHsgQmxvY2tlck1lc3NhZ2UgfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlJ1xyXG5pbXBvcnQge0Jsb2NrZWRNZXNzYWdlfSBmcm9tICcuL0Jsb2NrZWRNZXNzYWdlJ1xyXG5pbXBvcnQge3VzZU1lZGlhUXVlcnl9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBtZXNzYWdlQ29udGFpbmVyOiB7XHJcbiAgICAvLyB3aWR0aDogJzEwMCUnLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gIC8vICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxyXG4gICAgZmxleDogMyxcclxuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxyXG4gICAgb3ZlcmZsb3dYOiBcImhpZGRlblwiXHJcblxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lc3NhZ2VzKHtcclxuICBtZXNzYWdlcyxcclxuICBvbk1lc3NhZ2UsXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvbixcclxuICBsb2FkaW5nXHJcbn0pIHtcclxuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcclxuY29uc3Qge2RldmljZX09dXNlTWVkaWFRdWVyeSgpXHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobWVzc2FnZXMpIHtcclxuICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuICB9LCBbbWVzc2FnZXNdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25TZW5kKGUpIHtcclxuICAgIG9uTWVzc2FnZShlKTtcclxuICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGJveFNpemluZzogJ2JvcmRlci1ib3gnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJ319PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7Li4uc3R5bGVzLm1lc3NhZ2VDb250YWluZXIsZmxleDogZGV2aWNlPT09J3Bob25lJz80OjJ9fSByZWY9e3Njcm9sbGVyUmVmfT5cclxuICAgICAgICB7bWVzc2FnZXMgJiYgIFxyXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzOiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSwgdXNlcm5hbWUgfSkubWFwKFxyXG4gICAgICAgICAgICAobSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxyXG4gICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgIHshbS50eXBlICYmIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VyJyAmJiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZWQnICYmIDxCbG9ja2VkTWVzc2FnZSBtZXNzYWdlPXttfSBvbk5hdmlnYXRpb249e29uTmF2aWdhdGlvbn0vPn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgXHJcbiAgICAgICAgPE1lc3NhZ2VFZGl0b3JcclxuICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cclxuICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cclxuICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgLz5cclxuICAgICBcclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xyXG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcclxuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5zb3J0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0ICBNZXNzYWdlcyAgZnJvbSAnLi9tZXNzYWdlcyc7XHJcbmltcG9ydCBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XHJcbiAgbG9hZGluZyxcclxuICBtZXNzYWdlcyA9IFtdLFxyXG4gIG9uTWVzc2FnZVRleHQsXHJcbiAgb25NZXNzYWdlLFxyXG4gIG1lc3NhZ2VUZXh0LFxyXG4gIHVzZXJuYW1lLFxyXG4gIGhhbmdvdXQsXHJcbiAgb25OYXZpZ2F0aW9uLFxyXG5cclxufSkge1xyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGRvY3VtZW50LnRpdGxlPWhhbmdvdXQudXNlcm5hbWVcclxuXHJcbiAgfSxbXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cclxuICAgICAgPE1lc3NhZ2VzXHJcbiAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgIG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufVxyXG4gICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxyXG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxyXG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgbWVzc2FnZVRleHQgPXttZXNzYWdlVGV4dH1cclxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgIC8+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcblxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwXCIgey4uLnByb3BzfS8+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0SXRlbShwcm9wcykge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1hY3Rpb25cIiB7Li4ucHJvcHN9Lz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQge0xpc3RJdGVtfSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0IExpc3QsIHsgTGlzdEl0ZW0gfSBmcm9tICdjb250cm9scy9saXN0JztcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0JztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5cclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGlucHV0Q29udGFpbmVyOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBib3JkZXI6ICcjNzM3MzczIHNvbGlkIDFweCcsXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgcGFkZGluZzogMTAsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgYm9yZGVyOiAnd2hpdGUnLFxyXG5cclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dCh7XHJcbiAgaGFuZ291dHMsXHJcbiAgb25TZWFyY2hJbnB1dCxcclxuICBvbkZldGNoSGFuZ291dHMsXHJcbiAgb25TZWxlY3RIYW5nb3V0LFxyXG4gIHNlYXJjaFxyXG59KSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dFNlbGVjdGlvbihlKSB7XHJcbiAgICBjb25zdCBpZCA9IGUudGFyZ2V0LmlkXHJcbiAgICBvblNlbGVjdEhhbmdvdXQoZSlcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKGcgPT4gZy51c2VybmFtZSA9PT0gaWQpXHJcblxyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuXHJcbiAgICA8ZGl2ID5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cCBtYi0zXCI+XHJcbiAgICAgICAgPGlucHV0IHZhbHVlPXtzZWFyY2h9IGlkPVwic2VhcmNoLWlucHV0XCIgb25DaGFuZ2U9e29uU2VhcmNoSW5wdXR9IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgYXJpYS1sYWJlbD1cIlJlY2lwaWVudCdzIHVzZXJuYW1lXCIgYXJpYS1kZXNjcmliZWRieT1cImJ1dHRvbi1hZGRvbjJcIiAvPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcIiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJidXR0b24tYWRkb24yXCIgb25DbGljaz17b25GZXRjaEhhbmdvdXRzfSBkYXRhLXRlc3RpZD1cInNlYXJjaC1idG5cIiBkaXNhYmxlZD17IXNlYXJjaH0+U2VhcmNoPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8TGlzdCBpZD1cImhhbmdvdXRzLWxpc3RcIj5cclxuICAgICAgICB7aGFuZ291dHMgJiZcclxuICAgICAgICAgIGhhbmdvdXRzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGhhbmdvdXRzLm1hcCgoZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxMaXN0SXRlbSBpZD17Zy51c2VybmFtZX0gZGF0YS10ZXN0aWQ9e2cudXNlcm5hbWV9IG9uQ2xpY2s9e2hhbmRsZUhhbmdvdXRTZWxlY3Rpb259PlxyXG4gICAgICAgICAgICAgICAge2cudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICA8L0xpc3Q+XHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGVyc29uQWRkSWNvbih7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICd3aGl0ZScsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTE1IDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptLTktMlY3SDR2M0gxdjJoM3YzaDJ2LTNoM3YtMkg2em05IDRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IFBlcnNvbkFkZCBmcm9tICdpY29ucy9QZXJzb25BZGQnO1xyXG5pbXBvcnQgIFRleHRJbnB1dCAgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCAgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gIH0sXHJcbn07XHJcbi8vXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZSh7IGhhbmdvdXQsIG9uSW52aXRlLCBvbk1lc3NhZ2VUZXh0LG1lc3NhZ2VUZXh0LCBsb2FkaW5nIH0pIHtcclxuXHJcbiAgXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH1pZD1cImludml0ZS11aVwiPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxQZXJzb25BZGQgY29sb3I9XCJncmVlblwiIC8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIFN0YXJ0IENvbnZlcnNhdGlvbiB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPFRleHRJbnB1dCBpZD1cIm1lc3NhZ2VUZXh0SW5wdXRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gdmFsdWU9e21lc3NhZ2VUZXh0fSAvPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxCdXR0b24gbG9hZGluZz17bG9hZGluZ30gIGlkPVwiSU5WSVRFXCIgb25DbGljaz17b25JbnZpdGV9IGRhdGEtdGVzdGlkPSdvbmludml0ZS1idG4nIHRpdGxlPVwiU2VuZCBJbnZpdGVcIiBiZz1cInByaW1hcnlcIi8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBEb25lKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J005IDE2LjJMNC44IDEybC0xLjQgMS40TDkgMTkgMjEgN2wtMS40LTEuNEw5IDE2LjJ6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgRG9uZSB9IGZyb20gJ2ljb25zL0RvbmUnO1xyXG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgIExheW91dCAgZnJvbSAnLi9MYXlvdXQnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVlKHsgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8RG9uZSB3aWR0aD1cIjcwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cImdyZWVuXCIgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPHA+XHJcbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxyXG4gICAgICAgICAgeW91ciBpbnZpdGlvbiBoYXMgYmVlbiBhY2NlcHRlZC5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBNZXNzYWdlICBmcm9tICcuL21lc3NhZ2VzL01lc3NhZ2UnO1xyXG5pbXBvcnQgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICByb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIHBhZGRpbmdUb3A6IDcwLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgcGFkZGluZ0JvdHRvbTo4LFxyXG4gXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZXIoeyBoYW5nb3V0LCBvbkFjY2VwdCwgb25EZWNsaW5lLGxvYWRpbmcgfSkge1xyXG4gXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luTGVmdDogOCwgZGlzcGxheTonZmxleCcgfX0+XHJcbiAgICAgICAgICB7aGFuZ291dCAmJiBoYW5nb3V0Lm1lc3NhZ2UgJiYgKFxyXG4gICAgICAgICAgICA8TWVzc2FnZVxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U9e1xyXG4gICAgICAgICAgICAgICAgaGFuZ291dCAmJlxyXG4gICAgICAgICAgICAgICAgaGFuZ291dC5tZXNzYWdlICYmIHtcclxuICAgICAgICAgICAgICAgICAgLi4uaGFuZ291dC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxmbG9hdDonbGVmdCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJERUNMSU5FXCJcclxuICAgICAgICAgICAgb25DbGljaz17b25EZWNsaW5lfVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlY2xpbmUtYnRuXCJcclxuICAgICAgICAgICAgdGl0bGU9XCJEZWNsaW5lXCJcclxuICAgICAgICAgICAgYmxvY2tcclxuICAgICAgICAgICAgYmc9XCJkYW5nZXJcIlxyXG4gICAgICAgICAgICBvdXRsaW5lXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgXHJcbiAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sXCI+XHJcbiAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJBQ0NFUFRcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkFjY2VwdH1cclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NlcHQtYnRuXCJcclxuICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICAgICAgdGl0bGU9XCJBY2NlcHRcIlxyXG4gICAgICAgICAgICBiZz1cInByaW1hcnlcIlxyXG5cclxuICAgICAgICAgICAgYmxvY2tcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICBcclxuICAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KXtcclxuICAgIHJldHVybiB1bnJlYWRoYW5nb3V0cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIChhY2N1bXVsYXRvciA9IFt7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9XSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IG9iaiA9IGFjY3VtdWxhdG9yLmZpbmQoXHJcbiAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lICYmIGN1cnJlbnQuc3RhdGUgPT09ICdNRVNTQU5HRVInXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGFjY3VtdWxhdG9yLmZpbmRJbmRleChcclxuICAgICAgICAgICAgICAoYSkgPT4gYS51c2VybmFtZSA9PT0gY3VycmVudC51c2VybmFtZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5zcGxpY2UoaW5kZXgsIDEsIHtcclxuICAgICAgICAgICAgICAuLi5vYmosXHJcbiAgICAgICAgICAgICAgbWVzc2FnZUNvdW50OiArK29iai5tZXNzYWdlQ291bnQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcclxuICAgICAgICAgICAgYWNjdW11bGF0b3IucHVzaCh7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xyXG4gICAgICB9LCBbXSk7XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBMaXN0LHsgTGlzdEl0ZW0gfSBmcm9tICdjb250cm9scy9saXN0JztcclxuaW1wb3J0IHtyZWR1Y2VyVW5yZWFkaGFuZ291dHN9IGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVbnJlYWRIYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzLG9uU2VsZWN0VW5yZWFkLG9uUmVtb3ZlVW5yZWFkIH0pIHtcclxuXHJcbiAgY29uc3QgW2l0ZW1zLHNldEl0ZW1zXSA9dXNlU3RhdGUoW10pXHJcbnVzZUVmZmVjdCgoKT0+e1xyXG5pZih1bnJlYWRoYW5nb3V0cyl7XHJcblxyXG4gIGNvbnN0IHJlZHVjZWQgPXJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KVxyXG4gXHJcbiAgc2V0SXRlbXMocmVkdWNlZClcclxufVxyXG5cclxufSxbdW5yZWFkaGFuZ291dHNdKVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBkYXRhLXRlc3RpZD0ndW5yZWFkaGFuZ291dHMnID5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAge2l0ZW1zICYmXHJcbiAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBpdGVtcy5tYXAoKHUpID0+IHtcclxuICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCd9fT5cclxuICAgICAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e29uU2VsZWN0VW5yZWFkfSBpZD17dS51c2VybmFtZX0gc3R5bGU9e3tmbGV4OjV9fSBkYXRhLXRlc3RpZD17YCR7dS51c2VybmFtZX0tc2VsZWN0YH0+e3UudXNlcm5hbWV9IG1lc3NhZ2VzOiB7dS5tZXNzYWdlQ291bnR9PC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e29uUmVtb3ZlVW5yZWFkfSBpZD17dS51c2VybmFtZX0gc3R5bGU9e3tjb2xvcjoncmVkJ319IGRhdGEtdGVzdGlkPXtgJHt1LnVzZXJuYW1lfS1yZW1vdmVgfT54PC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB9KX1cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJleHBvcnQgY29uc3QgbWVzc2FnZXMgPVtcclxuICAgIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzE3ODk5NzEsXHJcbiAgfSxcclxuICAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYE9rIExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMyMTYzNDYyLFxyXG4gIH0se1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBIb3cgYXJlIHlvdSBkZW1vYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzYzNTcyMyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBhbGwgcmlnaHRgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjc3NTczLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYFllcyBJIGFtLiBIb3cgYXJlIHlvdWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDYsXHJcbiAgfSxcclxuICAsXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgZG9pbmcgZ3JlYXRlYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OCxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbl0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyBBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IEJsb2NrIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2snXHJcbmltcG9ydCBCbG9ja2VkIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2tlZCdcclxuaW1wb3J0IENvbmZpZ3VyZSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0NvbmZpZ3VyZSdcclxuaW1wb3J0IEhhbmdjaGF0IGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ2NoYXQnXHJcbmltcG9ydCBIYW5nb3V0IGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ291dCdcclxuaW1wb3J0IEludml0ZSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZSdcclxuaW1wb3J0IEludml0ZWUgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVlJ1xyXG5pbXBvcnQgSW52aXRlciBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZXInXHJcbmltcG9ydCBVbnJlYWRIYW5nb3V0cyBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL1VucmVhZEhhbmdvdXRzJ1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL01lc3NhZ2UnXHJcbmNvbnN0IGhhbmdvdXRzID0gW1xyXG4gICAgeyB1c2VybmFtZTogJ3VzZXJvbmUnIH0sXHJcbiAgICB7IHVzZXJuYW1lOiAndXNlcnR3bycgfSxcclxuICAgIHsgdXNlcm5hbWU6ICd1c2VydGhyZWUnIH0sXHJcbl07XHJcbmNvbnN0IGhhbmdvdXQgPSB7XHJcbiAgICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcclxuICAgIGVtYWlsOiAndGVzdEBnbWFpbC5jb20nLFxyXG4gICAgbWVzc2FnZTogeyB0ZXh0OiBgTGV0J3MgY2hhdCBvbiBIYW5nb3V0IWAsIHRpbWVzdGFtcDogMTU5MDgyMDc4MjkyMSB9LFxyXG59O1xyXG5jb25zdCBtZXNzYWdlID0ge1xyXG4gICAgdXNlcm5hbWU6ICdicmVubycsXHJcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzE3Njc4MzYsXHJcbn07XHJcbi8vXHJcbmltcG9ydCB7bWVzc2FnZXN9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0Um91dGVzKCkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja1wiPlxyXG4gICAgICAgICAgICA8QmxvY2sgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZWRcIj5cclxuICAgICAgICAgICAgPEJsb2NrZWQgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxyXG4gICAgICAgICAgICA8Q29uZmlndXJlIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nY2hhdFwiPlxyXG4gICAgICAgICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdvdXRcIj5cclxuICAgICAgICAgICAgPEhhbmdvdXQgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZVwiPlxyXG4gICAgICAgICAgICA8SW52aXRlIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlclwiPlxyXG4gICAgICAgICAgICA8SW52aXRlciBoYW5nb3V0cz17aGFuZ291dHN9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlZVwiPlxyXG4gICAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0cz17aGFuZ291dHN9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvdW5yZWFkaGFuZ291dHNcIj5cclxuICAgICAgICAgICAgPFVucmVhZEhhbmdvdXRzIHVucmVhZGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlXCI+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cclxuICAgICAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e21lc3NhZ2V9IHVzZXJuYW1lPXtoYW5nb3V0LnVzZXJuYW1lfSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlc1wiPlxyXG4gICAgICAgICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcblxyXG4gICAgXVxyXG59ICIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICdpY29ucy9vbmxpbmVTdGF0dXMnO1xyXG5pbXBvcnQgeyBJY29uc0RlbW8gfSBmcm9tICcuL0ljb25zRGVtbydcclxuaW1wb3J0IEF1dGhEZW1vUm91dGVzIGZyb20gJy4vYXV0aGVudGljYXRpb24vcm91dGUnXHJcbmltcG9ydCBDb21wb25lbnRzUm91dGVzIGZyb20gJy4vY29tcG9uZW50cy9yb3V0ZSdcclxuaW1wb3J0IEhhbmdvdXRSb3V0ZXMgZnJvbSAnLi9oYW5nb3V0L3JvdXRlJ1xyXG5cclxuLy8gY29uc3QgaGFuZ291dHMgPSBbXHJcbi8vICAgeyB1c2VybmFtZTogJ3VzZXJvbmUnIH0sXHJcbi8vICAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXHJcbi8vICAgeyB1c2VybmFtZTogJ3VzZXJ0aHJlZScgfSxcclxuLy8gXTtcclxuLy8gY29uc3QgaGFuZ291dCA9IHtcclxuLy8gICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcclxuLy8gICBlbWFpbDogJ3Rlc3RAZ21haWwuY29tJyxcclxuLy8gICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXHJcbi8vIH07XHJcbi8vIGNvbnN0IG1lc3NhZ2UgPSB7XHJcbi8vICAgdXNlcm5hbWU6ICdicmVubycsXHJcbi8vICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4vLyAgIHRpbWVzdGFtcDogMTU5MTMzMTc2NzgzNixcclxuLy8gfTtcclxuLy8gLy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0b3J5Ym9va1JvdXRlcygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICc4NXZoJ319PlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9vbmxpbmVcIj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cclxuICAgICAgICAgIDxPbmxpbmVTdGF0dXMgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICBcclxuICAgIFxyXG5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaWNvbnNcIj5cclxuICAgICAgICA8SWNvbnNEZW1vIC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBdXRoRGVtb1JvdXRlcy8+XHJcbiAgICAgIDxDb21wb25lbnRzUm91dGVzLz5cclxuICAgICAgPEhhbmdvdXRSb3V0ZXMvPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gIClcclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2YmFyKHByb3BzKSB7XHJcbiAgICBjb25zdCB7IGJnID0gJ2xpZ2h0JywgYnJhbmQsIGNoaWxkcmVuIH0gPSBwcm9wc1xyXG4gICAgcmV0dXJuIDxuYXYgY2xhc3NOYW1lPXtgbmF2YmFyIG5hdmJhci1leHBhbmQtbGcgbmF2YmFyLSR7Ymd9IGJnLSR7Ymd9YH0+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIiNcIj57YnJhbmR9PC9hPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXJcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiI25hdmJhclN1cHBvcnRlZENvbnRlbnRcIiBhcmlhLWNvbnRyb2xzPVwibmF2YmFyU3VwcG9ydGVkQ29udGVudFwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtbGFiZWw9XCJUb2dnbGUgbmF2aWdhdGlvblwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlci1pY29uXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgXHJcbiAgICA8L25hdj5cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZCYXJDb2xsYXBzZSh7Y2hpbGRyZW59KXtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZVwiIGlkPVwibmF2YmFyU3VwcG9ydGVkQ29udGVudFwiPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZCYXJOYXYoeyBjaGlsZHJlbiB9KSB7XHJcbiAgICByZXR1cm4gPHVsIGNsYXNzTmFtZT1cIm5hdmJhci1uYXYgbXItYXV0b1wiPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvdWw+XHJcbn1cclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0oeyBjaGlsZHJlbiB9KSB7XHJcbiAgXHJcbiAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+e2NoaWxkcmVufTwvbGk+XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2TGluayhwcm9wcykge1xyXG4gICAgY29uc3Qge2FwcFJvdXRlfT1wcm9wc1xyXG4gICAgY29uc3Qge29uQXBwUm91dGV9PXVzZUFwcFJvdXRlKClcclxuICAgIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIFxyXG4gICAgICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTpgLyR7aWR9YCxyb3V0ZTphcHBSb3V0ZX0pXHJcbiAgICAgIH1cclxuICAgIHJldHVybiA8YSBjbGFzc05hbWU9XCJuYXYtbGlua1wiIGhyZWY9XCIjXCIgb25DbGljaz17aGFuZGxlUm91dGV9ICB7Li4ucHJvcHN9Lz5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZEcm9wZG93bihwcm9wcykge1xyXG4gICAgY29uc3Qge3RpdGxlLGNoaWxkcmVufT1wcm9wc1xyXG4gICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbSBkcm9wZG93blwiID5cclxuICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXYtbGluayBkcm9wZG93bi10b2dnbGVcIiBocmVmPVwiI1wiIGlkPVwibmF2YmFyRHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJ7Li4ucHJvcHN9PlxyXG4gICAgICAgICAgICB7dGl0bGV9XHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvbGk+XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRHJvcGRvd25NZW51KHByb3BzKSB7XHJcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wc1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cIm5hdmJhckRyb3Bkb3duXCI+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBEcm9wZG93bkl0ZW0gKHByb3BzKXtcclxuICAgIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOicvJyxyb3V0ZTpgLyR7aWR9YH0pXHJcbiAgICAgIH1cclxuICAgIHJldHVybiAgICA8YSBjbGFzc05hbWU9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cIiNcIiB7Li4ucHJvcHN9IG9uQ2xpY2s9e2hhbmRsZVJvdXRlfS8+XHJcbn0iLCJpbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgU3Rvcnlib29rUHJvdmlkZXJzIGZyb20gJy4vU3Rvcnlib29rUHJvdmlkZXJzJ1xyXG5pbXBvcnQgU3Rvcnlib29rUm91dGVzIGZyb20gJy4vU3Rvcnlib29rUm91dGVzJ1xyXG5pbXBvcnQgTmF2YmFyLCB7IE5hdkJhck5hdiwgTmF2SXRlbSwgTmF2TGluaywgTmF2QmFyQ29sbGFwc2UgfSBmcm9tICdjb21wb25lbnRzL25hdi1iYXInXHJcbmltcG9ydCBOYXZEcm9wZG93biwgeyBEcm9wZG93bk1lbnUsIERyb3Bkb3duSXRlbSB9IGZyb20gJ2NvbXBvbmVudHMvbmF2LWJhci9uYXYtZHJvcGRvd24nXHJcblxyXG5yZW5kZXIoXHJcbiAgPFN0b3J5Ym9va1Byb3ZpZGVycz5cclxuICAgIDxOYXZiYXIgYnJhbmQ9XCJTdG9yeWJvb2tcIiBiZz1cImRhcmtcIj5cclxuICAgICAgPE5hdkJhckNvbGxhcHNlPlxyXG4gICAgICAgIDxOYXZCYXJOYXY+XHJcbiAgICAgICAgICA8TmF2RHJvcGRvd24gdGl0bGU9XCJDb21wb25lbnRzXCI+XHJcbiAgICAgICAgICAgIDxEcm9wZG93bk1lbnU+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImJ1dHRvblwiPkJ1dHRvbnM8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwidGV4dC1pbnB1dFwiPlRleHRJbnB1dDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJ0b2FzdFwiPlRvYXN0PC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImFsZXJ0XCI+QWxlcnQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgPC9Ecm9wZG93bk1lbnU+XHJcbiAgICAgICAgICA8L05hdkRyb3Bkb3duPlxyXG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiQXV0aGVudGljYXRpb25cIj5cclxuICAgICAgICAgICAgPERyb3Bkb3duTWVudT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwibG9naW5cIj5Mb2dpbjwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJzaWdudXBcIj5TaWdudXA8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiY2hhbmdlLXBhc3N3b3JkXCI+Q2hhbmdlIFBhc3N3b3JkPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImZvcmdvdC1wYXNzd29yZFwiPkZvcmdvdCBQYXNzd29yZDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICA8L0Ryb3Bkb3duTWVudT5cclxuICAgICAgICAgIDwvTmF2RHJvcGRvd24+XHJcbiAgICAgICAgICA8TmF2RHJvcGRvd24gdGl0bGU9XCJIYW5nb3V0XCI+XHJcbiAgICAgICAgICAgIDxEcm9wZG93bk1lbnU+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImJsb2NrXCI+QmxvY2s8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiYmxvY2tlZFwiPkJsb2NrZWQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiY29uZmlndXJlXCI+Q29uZmlndXJlPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImhhbmdjaGF0XCI+SGFuZ2NoYXQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiaGFuZ291dFwiPkhhbmdvdXQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiaW52aXRlXCI+SW52aXRlPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImludml0ZWVcIj5JbnZpdGVlPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImludml0ZXJcIj5JbnZpdGVyPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cInVucmVhZGhhbmdvdXRzXCI+VW5yZWFkSGFuZ291dHM8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgPC9Ecm9wZG93bk1lbnU+XHJcbiAgICAgICAgICA8L05hdkRyb3Bkb3duPlxyXG4gICAgICAgIDwvTmF2QmFyTmF2PlxyXG4gICAgICA8L05hdkJhckNvbGxhcHNlPlxyXG4gICAgPC9OYXZiYXI+XHJcbiAgICA8U3Rvcnlib29rUm91dGVzIC8+XHJcbiAgPC9TdG9yeWJvb2tQcm92aWRlcnM+XHJcblxyXG4gICxcclxuICBkb2N1bWVudC5ib2R5XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJ0IiwiciIsInUiLCJpIiwibyIsImYiLCJjIiwiZSIsImEiLCJ2IiwibSIsIngiLCJwIiwicyIsIlQiLCJfIiwiZyIsImFjdGlvblR5cGVzIiwiQVBQX1JPVVRFX0NIQU5HRUQiLCJyZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwicm91dGUiLCJmZWF0dXJlUm91dGUiLCJBcHBSb3V0ZUNvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlQXBwUm91dGVDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsInVzZUFwcFJvdXRlIiwiZGlzcGF0Y2giLCJuYW1lIiwib25BcHBSb3V0ZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiQXBwUm91dGUiLCJwcm9wcyIsImNoaWxkcmVuIiwicGF0aCIsInBhdGhzIiwiZmluZCIsIkFwcFJvdXRlUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwiZ2V0SXRlbSIsInBhcnNlIiwidmFsdWUiLCJ1c2VNZW1vIiwiQXBwUHJvdmlkZXJzIiwic3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlciIsIk9ubGluZVN0YXR1cyIsInJlYWR5U3RhdGUiLCJJc09ubGluZSIsImJhY2tncm91bmRDb2xvciIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwiY291bnQiLCJjb2xvciIsInRleHRBbGlnbiIsImJvcmRlclJhZGl1cyIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJNZXNzYWdlIiwiSWNvbnNEZW1vIiwiVGV4dElucHV0IiwibGFiZWwiLCJpc1ZhbGlkIiwibWVzc2FnZSIsInVuZGVmaW5lZCIsIkJ1dHRvbiIsInRpdGxlIiwiYmciLCJvdXRsaW5lIiwic2l6ZSIsImxvYWRpbmciLCJibG9jayIsIkFsZXJ0IiwiYWxlcnQiLCJMb2dpbiIsImVtYWlsb3J1c2VybmFtZSIsInBhc3N3b3JkIiwib25Mb2dpbiIsIm9uRm9jdXMiLCJvbkNoYW5nZSIsInZhbGlkYXRpb24iLCJvbkZvcmdvdFBhc3N3b3JkIiwib25CbHVyIiwiZXJyb3IiLCJtYXJnaW4iLCJwYWRkaW5nIiwidmFsaWRhdGlvblN1Y2Nlc3MiLCJ2YWxpZGF0aW9uRXJyb3IiLCJMb2dpblN0YXRlcyIsIlNpZ251cCIsInVzZXJuYW1lIiwiZW1haWwiLCJvblNpZ251cCIsIlNpZ251cFN0YXRlcyIsIkNoYW5nZVBhc3N3b3JkIiwiY29uZmlybSIsIm9uUGFzc3dvcmRDaGFuZ2UiLCJDaGFuZ2VQYXNzd29yZFN0YXRlcyIsIlJlcXVlc3RQYXNzQ2hhbmdlIiwib25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UiLCJGb3Jmb3RQYXNzd29yZFN0YXRlIiwiRm9yZ290UGFzc3dvcmQiLCJBdXRoRGVtb1JvdXRlcyIsIlNpZ25VcFN0YXRlcyIsIkZvcmdvdFBhc3N3b3JkU3RhdGVzIiwiQnV0dG9uRGVtbyIsImZsZXhEaXJlY3Rpb24iLCJUZXh0SW5wdXRTdGF0ZXMiLCJUb2FzdCIsInVzZXJJbWFnZSIsIlRvYXN0RGVtbyIsIkFsZXJ0RGVtbyIsIkNvbXBvbmVudHNSb3V0ZSIsInN0eWxlcyIsInJvb3QiLCJMYXlvdXQiLCJpZCIsImNoZWNrYm94IiwibWFyZ2luUmlnaHQiLCJjaGVja2JveFJvb3QiLCJsYXlvdXQiLCJib3hTaXppbmciLCJwYWRkaW5nVG9wIiwiYnRuIiwiZmxleCIsIkJsb2NrIiwib25DYW5jZWwiLCJvbkJsb2NrIiwib25SZXBvcnQiLCJmaWxsIiwib25DbGljayIsIkNlbnRlciIsIkJsb2NrZWQiLCJoYW5nb3V0Iiwib25VbmJsb2NrIiwib25DbG9zZSIsIkRlbGV0ZSIsIkFyY2hpdmUiLCJpY29uQnRuIiwiYnRuQ29udGFpbmVyIiwiYnRuT2siLCJDb25maWd1cmUiLCJvbkRlbGV0ZSIsIm9uQXJjaGl2ZSIsIm9uTm90aWZpY2F0aW9uIiwib25Db252ZXJzYXRpb25IaXN0b3J5Iiwib25OYXZpZ2F0aW9uIiwib25PayIsIkljb25CdXR0b24iLCJJY29uIiwiQ2hlY2tib3giLCJtYXJnaW5Ub3AiLCJ1c2VNZWRpYVF1ZXJ5Iiwic2V0V2lkdGgiLCJ1c2VTdGF0ZSIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJkZXZpY2UiLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsImNvbnNvbGUiLCJsb2ciLCJhZGRFdmVudExpc3RlbmVyIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwibWluSGVpZ2h0IiwiZm9udFNpemUiLCJmbG9hdCIsInRpbWVzdGFtcCIsImRheXMiLCJzZXREYXlzIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJzZXRJbnRlcnZhbCIsIm1hcmdpbkJvdHRvbSIsInRleHQiLCJNZXNzYWdlRWRpdG9yIiwibWVzc2FnZVRleHQiLCJvbk1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlIiwiQmxvY2tlck1lc3NhZ2UiLCJCbG9ja2VkTWVzc2FnZSIsImhhbmRsZU5hdmlnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm1lc3NhZ2VDb250YWluZXIiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJNZXNzYWdlcyIsIm1lc3NhZ2VzIiwic2Nyb2xsZXJSZWYiLCJ1c2VSZWYiLCJjdXJyZW50Iiwic2Nyb2xsVG9wIiwic2Nyb2xsSGVpZ2h0Iiwib25TZW5kIiwibGVuZ3RoIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1hcCIsIm1zZyIsInNvcnQiLCJIYW5nY2hhdCIsImRvY3VtZW50IiwiTGlzdCIsIkxpc3RJdGVtIiwiSGFuZ291dCIsImhhbmdvdXRzIiwib25TZWFyY2hJbnB1dCIsIm9uRmV0Y2hIYW5nb3V0cyIsIm9uU2VsZWN0SGFuZ291dCIsInNlYXJjaCIsImhhbmRsZUhhbmdvdXRTZWxlY3Rpb24iLCJ0YXJnZXQiLCJQZXJzb25BZGRJY29uIiwiSW52aXRlIiwib25JbnZpdGUiLCJQZXJzb25BZGQiLCJEb25lIiwiSW52aXRlZSIsInBhZGRpbmdCb3R0b20iLCJJbnZpdGVyIiwib25BY2NlcHQiLCJvbkRlY2xpbmUiLCJtYXJnaW5MZWZ0IiwicmVkdWNlclVucmVhZGhhbmdvdXRzIiwidW5yZWFkaGFuZ291dHMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsImluZGV4IiwibWVzc2FnZUNvdW50Iiwib2JqIiwiZmluZEluZGV4Iiwic3BsaWNlIiwicHVzaCIsIlVucmVhZEhhbmdvdXRzIiwib25TZWxlY3RVbnJlYWQiLCJvblJlbW92ZVVucmVhZCIsIml0ZW1zIiwic2V0SXRlbXMiLCJyZWR1Y2VkIiwiSGFuZ291dFJvdXRlcyIsIlN0b3J5Ym9va1JvdXRlcyIsIkNvbXBvbmVudHNSb3V0ZXMiLCJOYXZiYXIiLCJicmFuZCIsIk5hdkJhckNvbGxhcHNlIiwiTmF2QmFyTmF2IiwiTmF2RHJvcGRvd24iLCJEcm9wZG93bk1lbnUiLCJEcm9wZG93bkl0ZW0iLCJoYW5kbGVSb3V0ZSIsInJlbmRlciIsIlN0b3J5Ym9va1Byb3ZpZGVycyIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFHLElBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsOERBQThELFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1L1IsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXlFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUF1RyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQzs7QUNBdHRFLE1BQU1VLFdBQVcsR0FBRTtBQUN0QkMsRUFBQUEsaUJBQWlCLEVBQUMsbUJBREk7O0FBQUEsQ0FBbkI7O0FDRUEsU0FBU0MsT0FBVCxDQUFpQkMsS0FBakIsRUFBd0JDLE1BQXhCLEVBQWdDO0FBQ25DLFVBQVFBLE1BQU0sQ0FBQ0MsSUFBZjtBQUNJLFNBQUtMLFdBQVcsQ0FBQ0MsaUJBQWpCO0FBQ0ksYUFBTyxFQUFFLEdBQUdFLEtBQUw7QUFBWUcsUUFBQUEsS0FBSyxFQUFFRixNQUFNLENBQUNFLEtBQTFCO0FBQWdDQyxRQUFBQSxZQUFZLEVBQUVILE1BQU0sQ0FBQ0c7QUFBckQsT0FBUDs7QUFDSjtBQUNJLGFBQU9KLEtBQVA7QUFKUjtBQU1IOztBQ0xELE1BQU1LLGVBQWUsR0FBR0MsQ0FBYSxFQUFyQzs7QUFFQyxTQUFTQyxrQkFBVCxHQUE4QjtBQUM3QixRQUFNQyxPQUFPLEdBQUdDLEdBQVUsQ0FBQ0osZUFBRCxDQUExQjs7QUFFQSxNQUFJLENBQUNHLE9BQUwsRUFBYztBQUNaLFVBQU0sSUFBSUUsS0FBSixDQUFVLHVEQUFWLENBQU47QUFDRDs7QUFDRCxTQUFPRixPQUFQO0FBQ0Q7QUFlTSxTQUFTRyxXQUFULEdBQXVCO0FBQzVCLFFBQU0sQ0FBQ1gsS0FBRCxFQUFPWSxRQUFQLElBQWlCTCxrQkFBa0IsRUFBekM7QUFDQSxRQUFNO0FBQUNNLElBQUFBO0FBQUQsTUFBT2IsS0FBYjs7QUFDQSxXQUFTYyxVQUFULENBQW9CO0FBQUNYLElBQUFBLEtBQUQ7QUFBT0MsSUFBQUE7QUFBUCxHQUFwQixFQUF5QztBQUN2QyxRQUFHUyxJQUFILEVBQVE7QUFDTkUsTUFBQUEsWUFBWSxDQUFDQyxPQUFiLENBQXFCSCxJQUFyQixFQUEwQkksSUFBSSxDQUFDQyxTQUFMLENBQWU7QUFBQ2YsUUFBQUEsS0FBRDtBQUFPQyxRQUFBQTtBQUFQLE9BQWYsQ0FBMUI7QUFDRDs7QUFFRFEsSUFBQUEsUUFBUSxDQUFDO0FBQUNWLE1BQUFBLElBQUksRUFBQ0wsV0FBVyxDQUFDQyxpQkFBbEI7QUFBcUNNLE1BQUFBLFlBQXJDO0FBQWtERCxNQUFBQTtBQUFsRCxLQUFELENBQVI7QUFDRDs7QUFFRCxTQUFPO0FBQUNXLElBQUFBO0FBQUQsR0FBUDtBQUNEO0FBRU0sU0FBU0ssUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUI7QUFDOUIsUUFBTTtBQUFFQyxJQUFBQSxRQUFGO0FBQVlDLElBQUFBLElBQVo7QUFBa0JDLElBQUFBO0FBQWxCLE1BQTRCSCxLQUFsQztBQUVBLFFBQU0sQ0FBQ3BCLEtBQUQsRUFBT1ksUUFBUCxJQUFtQkwsa0JBQWtCLEVBQTNDO0FBQ0YsUUFBTTtBQUFDSixJQUFBQTtBQUFELE1BQVFILEtBQWQ7O0FBQ0UsTUFBSXNCLElBQUksSUFBSW5CLEtBQUssS0FBS21CLElBQXRCLEVBQTRCO0FBQzFCLFdBQU9ELFFBQVA7QUFDRCxHQUZELE1BRU8sSUFBSUUsS0FBSyxJQUFJcEIsS0FBSyxLQUFLb0IsS0FBSyxDQUFDQyxJQUFOLENBQVloQyxDQUFELElBQU9BLENBQUMsS0FBS1csS0FBeEIsQ0FBdkIsRUFBdUQ7QUFDNUQsV0FBT2tCLFFBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRDtBQUNjLFNBQVNJLGdCQUFULENBQTBCTCxLQUExQixFQUFpQztBQUM5QyxRQUFNO0FBQUNNLElBQUFBO0FBQUQsTUFBWU4sS0FBbEI7QUFDQSxRQUFNLENBQUNwQixLQUFELEVBQU9ZLFFBQVAsSUFBaUJlLEdBQVUsQ0FBQzVCLE9BQUQsRUFBUzJCLFNBQVQsQ0FBakM7QUFFQUUsRUFBQUEsR0FBUyxDQUFDLE1BQUk7QUFDWixRQUFHNUIsS0FBSyxJQUFJQSxLQUFLLENBQUNhLElBQWYsSUFBdUJFLFlBQVksQ0FBQ2MsT0FBYixDQUFxQjdCLEtBQUssQ0FBQ2EsSUFBM0IsQ0FBMUIsRUFBMkQ7QUFFdkQsWUFBTTtBQUFDVCxRQUFBQSxZQUFEO0FBQWNELFFBQUFBO0FBQWQsVUFBc0JjLElBQUksQ0FBQ2EsS0FBTCxDQUFZZixZQUFZLENBQUNjLE9BQWIsQ0FBcUI3QixLQUFLLENBQUNhLElBQTNCLENBQVosQ0FBNUI7QUFDQUQsTUFBQUEsUUFBUSxDQUFDO0FBQUNWLFFBQUFBLElBQUksRUFBQ0wsV0FBVyxDQUFDQyxpQkFBbEI7QUFBcUNNLFFBQUFBLFlBQXJDO0FBQWtERCxRQUFBQTtBQUFsRCxPQUFELENBQVI7QUFDSDtBQUVGLEdBUFEsRUFPUCxFQVBPLENBQVQ7QUFTRixRQUFNNEIsS0FBSyxHQUFHQyxHQUFPLENBQUMsTUFBTSxDQUFDaEMsS0FBRCxFQUFRWSxRQUFSLENBQVAsRUFBMEIsQ0FBQ1osS0FBRCxDQUExQixDQUFyQjtBQUNFLFNBQU8sRUFBQyxlQUFELENBQWlCLFFBQWpCO0FBQTBCLElBQUEsS0FBSyxFQUFFK0I7QUFBakMsS0FBNENYLEtBQTVDLEVBQVA7QUFDRDs7QUNyRUQ7QUFHZSxTQUFTYSxZQUFULENBQXNCO0FBQUVaLEVBQUFBO0FBQUYsQ0FBdEIsRUFBb0M7QUFDakQsU0FFSSxFQUFDLGdCQUFEO0FBQUE7QUFFRSxJQUFBLEtBQUssRUFBQyxRQUZSO0FBR0UsSUFBQSxTQUFTLEVBQUU7QUFBRWxCLE1BQUFBLEtBQUssRUFBRSxHQUFUO0FBQWNDLE1BQUFBLFlBQVksRUFBRSxXQUE1QjtBQUF3Q1MsTUFBQUEsSUFBSSxFQUFDO0FBQTdDO0FBSGIsS0FNU1EsUUFOVCxDQUZKO0FBY0Q7O0FDakJELE1BQU1hLEtBQUssR0FBRztBQUNaQyxFQUFBQSxLQUFLLEVBQUUsRUFESztBQUVaQyxFQUFBQSxNQUFNLEVBQUUsRUFGSTtBQUlaQyxFQUFBQSxNQUFNLEVBQUU7QUFKSSxDQUFkO0FBTU8sU0FBU0MsWUFBVCxDQUFzQjtBQUFFQyxFQUFBQTtBQUFGLENBQXRCLEVBQXNDO0FBQzNDLE1BQUlBLFVBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUNwQixXQUFPLEVBQUMsUUFBRCxPQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUlBLFVBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUMzQixXQUFPLEVBQUMsVUFBRCxPQUFQO0FBQ0QsR0FGTSxNQUVBLElBQUlBLFVBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUMzQixXQUFPLEVBQUMsT0FBRCxPQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxFQUFDLFNBQUQsT0FBUDtBQUNEO0FBRU0sU0FBU0MsUUFBVCxHQUFvQjtBQUN6QixTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHTixLQUFMO0FBQVlPLE1BQUFBLGVBQWUsRUFBRTtBQUE3QixLQURUO0FBRUUsbUJBQVk7QUFGZCxJQURGO0FBTUQ7QUFFTSxTQUFTQyxTQUFULEdBQXFCO0FBQzFCLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUdSLEtBQUw7QUFBWU8sTUFBQUEsZUFBZSxFQUFFO0FBQTdCLEtBRFQ7QUFFRSxtQkFBWTtBQUZkLElBREY7QUFNRDtBQUVNLFNBQVNFLFVBQVQsR0FBc0I7QUFDM0IsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBR1QsS0FBTDtBQUFZTyxNQUFBQSxlQUFlLEVBQUU7QUFBN0IsS0FEVDtBQUVFLG1CQUFZO0FBRmQsSUFERjtBQU1EO0FBRU0sU0FBU0csT0FBVCxHQUFtQjtBQUN4QixTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHVixLQUFMO0FBQVlPLE1BQUFBLGVBQWUsRUFBRTtBQUE3QixLQURUO0FBRUUsbUJBQVk7QUFGZCxJQURGO0FBTUQ7O0FDbERELE1BQU1QLE9BQUssR0FBRztBQUNaVyxFQUFBQSxLQUFLLEVBQUU7QUFDTFYsSUFBQUEsS0FBSyxFQUFFLEVBREY7QUFFTEMsSUFBQUEsTUFBTSxFQUFFLEVBRkg7QUFHTEssSUFBQUEsZUFBZSxFQUFFLE9BSFo7QUFJTEssSUFBQUEsS0FBSyxFQUFFLE9BSkY7QUFLTEMsSUFBQUEsU0FBUyxFQUFDLFFBTEw7QUFNTEMsSUFBQUEsWUFBWSxFQUFDLEVBTlI7QUFPTEMsSUFBQUEsT0FBTyxFQUFDLE1BUEg7QUFRTEMsSUFBQUEsVUFBVSxFQUFDLFFBUk47QUFTTEMsSUFBQUEsY0FBYyxFQUFDO0FBVFY7QUFESyxDQUFkO0FBYU8sU0FBU0MsT0FBVCxDQUFpQjtBQUFFUCxFQUFBQSxLQUFLLEdBQUM7QUFBUixDQUFqQixFQUE4QjtBQUNuQyxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBQ0ksTUFBQUEsT0FBTyxFQUFDLE1BQVQ7QUFBaUJDLE1BQUFBLFVBQVUsRUFBQztBQUE1QjtBQUFaLEtBQ00sMEJBRE4sRUFFRTtBQUFLLElBQUEsS0FBSyxFQUFFaEIsT0FBSyxDQUFDVyxLQUFsQjtBQUF5QixtQkFBWTtBQUFyQyxLQUFzREEsS0FBdEQsQ0FGRixDQURGO0FBTUQ7O0FDcEJNLFNBQVNRLFNBQVQsR0FBb0I7QUFDdkIsU0FBTyxlQUVILEVBQUMsT0FBRDtBQUFTLElBQUEsS0FBSyxFQUFFO0FBQWhCLElBRkcsQ0FBUDtBQUlIOztBQ0hjLFNBQVNDLFNBQVQsQ0FBbUJsQyxLQUFuQixFQUEwQjtBQUN2QyxRQUFNO0FBQUVtQyxJQUFBQSxLQUFGO0FBQVMxQyxJQUFBQSxJQUFUO0FBQWVYLElBQUFBLElBQWY7QUFBcUJzRCxJQUFBQSxPQUFyQjtBQUE4QkMsSUFBQUE7QUFBOUIsTUFBMENyQyxLQUFoRDtBQUNBLFNBQU87QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0w7QUFBTyxJQUFBLEdBQUcsRUFBRVA7QUFBWixLQUFvQjBDLEtBQXBCLENBREssRUFFTDtBQUFPLElBQUEsSUFBSSxFQUFFckQsSUFBYjtBQUFtQixJQUFBLFNBQVMsRUFBRyxnQkFBZXNELE9BQU8sSUFBSSxVQUFXLElBQUcsQ0FBQ0EsT0FBRCxJQUFZQSxPQUFPLEtBQUtFLFNBQXhCLElBQXFDLFlBQWEsRUFBekg7QUFBNEgsSUFBQSxFQUFFLEVBQUU3QyxJQUFoSTtBQUFzSSx3QkFBa0JBO0FBQXhKLEtBQWlLTyxLQUFqSyxFQUZLLEVBR1IsQ0FBQ29DLE9BQUQsSUFBWTtBQUFPLElBQUEsRUFBRSxFQUFDLFdBQVY7QUFBc0IsSUFBQSxTQUFTLEVBQUcsR0FBRSxDQUFDQSxPQUFELElBQVksa0JBQW1CLEVBQW5FO0FBQXNFLG1CQUFjLFdBQVUzQyxJQUFLO0FBQW5HLEtBQXVHNEMsT0FBdkcsQ0FISixDQUFQO0FBS0Q7O0FDVGMsU0FBU0UsTUFBVCxDQUFnQnZDLEtBQWhCLEVBQXVCO0FBQ3BDLFFBQU07QUFBRXdDLElBQUFBLEtBQUY7QUFBU0MsSUFBQUEsRUFBRSxHQUFDLE9BQVo7QUFBb0JDLElBQUFBLE9BQXBCO0FBQTZCQyxJQUFBQSxJQUE3QjtBQUFrQ0MsSUFBQUEsT0FBTyxHQUFDLEtBQTFDO0FBQWlEQyxJQUFBQTtBQUFqRCxNQUEwRDdDLEtBQWhFO0FBRUEsU0FDRTtBQUFRLElBQUEsU0FBUyxFQUFJLEdBQUV5QyxFQUFFLElBQUksQ0FBQ0MsT0FBUCxJQUFpQixXQUFVRCxFQUFHLEVBQUUsSUFBR0MsT0FBTyxJQUFHLG1CQUFrQkQsRUFBRyxFQUFFLElBQUdFLElBQUksSUFBRyxXQUFVQSxJQUFLLEVBQUUsSUFBR0UsS0FBSyxJQUFLLFdBQVk7QUFBL0ksS0FBc0o3QyxLQUF0SjtBQUE2SixJQUFBLFFBQVEsRUFBRTRDO0FBQXZLLE1BQ0tBLE9BQU8sSUFBSTtBQUFNLElBQUEsS0FBSyxFQUFDLGtDQUFaO0FBQStDLElBQUEsSUFBSSxFQUFDLFFBQXBEO0FBQTZELG1CQUFZO0FBQXpFLElBRGhCLEVBRU1BLE9BQU8sR0FBRyxTQUFILEdBQWFKLEtBRjFCLENBREY7QUFNRDs7QUNWYyxTQUFTTSxLQUFULENBQWdCOUMsS0FBaEIsRUFBc0I7QUFDckMsUUFBTTtBQUFDK0MsSUFBQUEsS0FBRDtBQUFPVixJQUFBQTtBQUFQLE1BQWdCckMsS0FBdEI7QUFDSSxTQUFPO0FBQUssSUFBQSxTQUFTLEVBQUcsZUFBYytDLEtBQU0sRUFBckM7QUFBd0MsSUFBQSxJQUFJLEVBQUMsT0FBN0M7QUFBcUQsbUJBQVk7QUFBakUsS0FDTlYsT0FETSxFQUVQO0FBQVEsSUFBQSxJQUFJLEVBQUMsUUFBYjtBQUFzQixJQUFBLEtBQUssRUFBQyxPQUE1QjtBQUFvQyxvQkFBYSxPQUFqRDtBQUF5RCxrQkFBVztBQUFwRSxLQUNBO0FBQU0sbUJBQVk7QUFBbEIsWUFEQSxDQUZPLENBQVA7QUFNSDs7QUNMYyxTQUFTVyxLQUFULENBQWVoRCxLQUFmLEVBQXNCO0FBQ25DLFFBQU07QUFBRWlELElBQUFBLGVBQUY7QUFBbUJDLElBQUFBLFFBQW5CO0FBQTZCTixJQUFBQSxPQUE3QjtBQUFzQ08sSUFBQUEsT0FBdEM7QUFBK0NDLElBQUFBLE9BQS9DO0FBQXdEQyxJQUFBQSxRQUF4RDtBQUFrRUMsSUFBQUEsVUFBbEU7QUFBOEVDLElBQUFBLGdCQUE5RTtBQUFnR0MsSUFBQUEsTUFBaEc7QUFBd0dDLElBQUFBO0FBQXhHLE1BQWtIekQsS0FBeEg7QUFFQSxTQUVFO0FBQUssSUFBQSxTQUFTLEVBQUMsaUNBQWY7QUFBaUQsSUFBQSxLQUFLLEVBQUU7QUFBRTBELE1BQUFBLE1BQU0sRUFBRSxFQUFWO0FBQWNDLE1BQUFBLE9BQU8sRUFBRTtBQUF2QjtBQUF4RCxLQUNHZixPQUFPLElBQUk7QUFBSyxJQUFBLFNBQVMsRUFBQyxVQUFmO0FBQTBCLElBQUEsS0FBSyxFQUFDO0FBQWhDLEtBQ1Y7QUFBSyxJQUFBLFNBQVMsRUFBQyx5REFBZjtBQUF5RSxJQUFBLElBQUksRUFBQyxhQUE5RTtBQUE0RixxQkFBYyxLQUExRztBQUFnSCxxQkFBYyxHQUE5SDtBQUFrSSxxQkFBYyxLQUFoSjtBQUFzSixJQUFBLEtBQUssRUFBQztBQUE1SixJQURVLENBRGQsRUFJR2EsS0FBSyxJQUFJLEVBQUMsS0FBRDtBQUFPLElBQUEsS0FBSyxFQUFDLFFBQWI7QUFBc0IsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ3BCO0FBQXJDLElBSlosRUFLRSxFQUFDLFNBQUQ7QUFDRSxJQUFBLE9BQU8sRUFBRWUsT0FEWDtBQUVFLElBQUEsTUFBTSxFQUFFSSxNQUZWO0FBR0UsSUFBQSxLQUFLLEVBQUVQLGVBSFQ7QUFJRSxJQUFBLFFBQVEsRUFBRUksUUFKWjtBQUtFLElBQUEsS0FBSyxFQUFDLG1CQUxSO0FBTUUsSUFBQSxJQUFJLEVBQUMsaUJBTlA7QUFPRSxJQUFBLElBQUksRUFBQyxNQVBQO0FBU0UsSUFBQSxFQUFFLEVBQUMsaUJBVEw7QUFVRSxtQkFBWSxpQkFWZDtBQVdFLElBQUEsT0FBTyxFQUFFQyxVQUFVLElBQUlBLFVBQVUsQ0FBQyxpQkFBRCxDQUFWLENBQThCakIsT0FYdkQ7QUFZRSxJQUFBLE9BQU8sRUFBRWlCLFVBQVUsSUFBSUEsVUFBVSxDQUFDLGlCQUFELENBQVYsQ0FBOEJsQjtBQVp2RCxJQUxGLEVBcUJFLEVBQUMsU0FBRDtBQUNFLElBQUEsT0FBTyxFQUFFZ0IsT0FEWDtBQUVFLElBQUEsTUFBTSxFQUFFSSxNQUZWO0FBR0UsSUFBQSxLQUFLLEVBQUMsVUFIUjtBQUlFLElBQUEsS0FBSyxFQUFFTixRQUpUO0FBS0UsSUFBQSxRQUFRLEVBQUVHLFFBTFo7QUFNRSxJQUFBLElBQUksRUFBQyxVQU5QO0FBT0UsSUFBQSxJQUFJLEVBQUMsVUFQUDtBQVNFLElBQUEsRUFBRSxFQUFDLFVBVEw7QUFVRSxtQkFBWSxVQVZkO0FBV0UsSUFBQSxPQUFPLEVBQUVDLFVBQVUsSUFBSUEsVUFBVSxDQUFDLFVBQUQsQ0FBVixDQUF1QmpCLE9BWGhEO0FBWUUsSUFBQSxPQUFPLEVBQUVpQixVQUFVLElBQUlBLFVBQVUsQ0FBQyxVQUFELENBQVYsQ0FBdUJsQjtBQVpoRCxJQXJCRixFQW9DRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVQLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CRSxNQUFBQSxjQUFjLEVBQUU7QUFBbkM7QUFBWixLQUdFLEVBQUMsTUFBRDtBQUNFLElBQUEsSUFBSSxFQUFDLFFBRFA7QUFFRSxJQUFBLEVBQUUsRUFBQyxXQUZMO0FBR0UsbUJBQVksV0FIZDtBQUlFLElBQUEsT0FBTyxFQUFFb0IsT0FKWDtBQUtFLElBQUEsT0FBTyxFQUFFUCxPQUxYO0FBTUUsSUFBQSxLQUFLLEVBQUMsT0FOUjtBQU9FLElBQUEsRUFBRSxFQUFDO0FBUEwsSUFIRixFQWFFLEVBQUMsTUFBRDtBQUFRLElBQUEsT0FBTyxFQUFFVyxnQkFBakI7QUFBbUMsSUFBQSxFQUFFLEVBQUMsZ0JBQXRDO0FBQXVELG1CQUFZLGdCQUFuRTtBQUFvRixJQUFBLE9BQU8sTUFBM0Y7QUFBNEYsSUFBQSxFQUFFLEVBQUMsU0FBL0Y7QUFBeUcsSUFBQSxLQUFLLEVBQUM7QUFBL0csSUFiRixDQXBDRixDQUZGO0FBMEREOztBQy9ERCxNQUFNSyxpQkFBaUIsR0FBRztBQUFFWCxFQUFBQSxlQUFlLEVBQUU7QUFBRWIsSUFBQUEsT0FBTyxFQUFFLElBQVg7QUFBaUJDLElBQUFBLE9BQU8sRUFBRTtBQUExQixHQUFuQjtBQUFvRGEsRUFBQUEsUUFBUSxFQUFFO0FBQUVkLElBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxJQUFBQSxPQUFPLEVBQUU7QUFBMUI7QUFBOUQsQ0FBMUI7QUFDQSxNQUFNd0IsZUFBZSxHQUFHO0FBQUVaLEVBQUFBLGVBQWUsRUFBRTtBQUFFYixJQUFBQSxPQUFPLEVBQUUsS0FBWDtBQUFrQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTNCLEdBQW5CO0FBQXVFYSxFQUFBQSxRQUFRLEVBQUU7QUFBRWQsSUFBQUEsT0FBTyxFQUFFLEtBQVg7QUFBa0JDLElBQUFBLE9BQU8sRUFBRTtBQUEzQjtBQUFqRixDQUF4QjtBQUNlLFNBQVN5QixXQUFULEdBQXVCO0FBQ3BDLFNBQU87QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0w7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCxpQ0FERixFQUdFLEVBQUMsS0FBRDtBQUFPLElBQUEsZUFBZSxFQUFDLFVBQXZCO0FBQWtDLElBQUEsUUFBUSxFQUFDLFdBQTNDO0FBQXVELElBQUEsVUFBVSxFQUFFRjtBQUFuRSxJQUhGLENBREYsQ0FESyxFQVVMO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQU0sSUFBQSxTQUFTLEVBQUM7QUFBaEIsS0FDRTtBQUFJLElBQUEsU0FBUyxFQUFDO0FBQWQsOEJBREYsRUFHRSxFQUFDLEtBQUQ7QUFBTyxJQUFBLGVBQWUsRUFBQyxVQUF2QjtBQUFrQyxJQUFBLFFBQVEsRUFBQyxXQUEzQztBQUF1RCxJQUFBLFVBQVUsRUFBRUM7QUFBbkUsSUFIRixDQURGLENBVkssRUFtQkw7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCxrQkFERixFQUVFLEVBQUMsS0FBRDtBQUFPLElBQUEsZUFBZSxFQUFDLFVBQXZCO0FBQWtDLElBQUEsUUFBUSxFQUFDLFdBQTNDO0FBQXVELElBQUEsVUFBVSxFQUFFRCxpQkFBbkU7QUFBc0YsSUFBQSxPQUFPO0FBQTdGLElBRkYsQ0FERixDQW5CSyxFQXlCTDtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLEtBQ0U7QUFBSSxJQUFBLFNBQVMsRUFBQztBQUFkLDRCQURGLEVBRUUsRUFBQyxLQUFEO0FBQU8sSUFBQSxlQUFlLEVBQUMsVUFBdkI7QUFBa0MsSUFBQSxRQUFRLEVBQUMsV0FBM0M7QUFBdUQsSUFBQSxVQUFVLEVBQUVBLGlCQUFuRTtBQUF1RixJQUFBLEtBQUssRUFBRTtBQUFDdkIsTUFBQUEsT0FBTyxFQUFDO0FBQVQ7QUFBOUYsSUFGRixDQURGLENBekJLLENBQVA7QUFnQ0Q7O0FDaENjLFNBQVMwQixNQUFULENBQWdCL0QsS0FBaEIsRUFBdUI7QUFDcEMsUUFBTTtBQUFFZ0UsSUFBQUEsUUFBRjtBQUFZZCxJQUFBQSxRQUFaO0FBQXNCZSxJQUFBQSxLQUF0QjtBQUE2QnJCLElBQUFBLE9BQTdCO0FBQXNDc0IsSUFBQUEsUUFBdEM7QUFBZ0RiLElBQUFBLFFBQWhEO0FBQTBEQyxJQUFBQSxVQUExRDtBQUFzRUUsSUFBQUEsTUFBdEU7QUFBOEVKLElBQUFBLE9BQTlFO0FBQXVGSyxJQUFBQTtBQUF2RixNQUFpR3pELEtBQXZHO0FBQ0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDLGlDQUFmO0FBQWlELElBQUEsS0FBSyxFQUFFO0FBQUUwRCxNQUFBQSxNQUFNLEVBQUUsRUFBVjtBQUFjQyxNQUFBQSxPQUFPLEVBQUU7QUFBdkI7QUFBeEQsS0FDR2YsT0FBTyxJQUFJO0FBQUssSUFBQSxTQUFTLEVBQUMsVUFBZjtBQUEwQixJQUFBLEtBQUssRUFBQztBQUFoQyxLQUNWO0FBQUssSUFBQSxTQUFTLEVBQUMseURBQWY7QUFBeUUsSUFBQSxJQUFJLEVBQUMsYUFBOUU7QUFBNEYscUJBQWMsS0FBMUc7QUFBZ0gscUJBQWMsR0FBOUg7QUFBa0kscUJBQWMsS0FBaEo7QUFBc0osSUFBQSxLQUFLLEVBQUM7QUFBNUosSUFEVSxDQURkLEVBSUdhLEtBQUssSUFBSSxFQUFDLEtBQUQ7QUFBTyxJQUFBLEtBQUssRUFBQyxRQUFiO0FBQXNCLElBQUEsT0FBTyxFQUFFQSxLQUFLLENBQUNwQjtBQUFyQyxJQUpaLEVBS0UsRUFBQyxTQUFEO0FBQ0UsSUFBQSxNQUFNLEVBQUVtQixNQURWO0FBRUUsSUFBQSxPQUFPLEVBQUVKLE9BRlg7QUFHRSxJQUFBLEtBQUssRUFBQyxVQUhSO0FBSUUsSUFBQSxLQUFLLEVBQUVZLFFBSlQ7QUFLRSxJQUFBLFFBQVEsRUFBRVgsUUFMWjtBQU1FLElBQUEsSUFBSSxFQUFDLE1BTlA7QUFPRSxtQkFBWSxVQVBkO0FBUUUsSUFBQSxJQUFJLEVBQUMsVUFSUDtBQVVFLElBQUEsT0FBTyxFQUFFQyxVQUFVLElBQUlBLFVBQVUsQ0FBQyxVQUFELENBQVYsQ0FBdUJsQixPQVZoRDtBQVdFLElBQUEsT0FBTyxFQUFFa0IsVUFBVSxJQUFJQSxVQUFVLENBQUMsVUFBRCxDQUFWLENBQXVCakI7QUFYaEQsSUFMRixFQW1CRSxFQUFDLFNBQUQ7QUFDRSxJQUFBLE1BQU0sRUFBRW1CLE1BRFY7QUFFRSxJQUFBLE9BQU8sRUFBRUosT0FGWDtBQUdFLElBQUEsS0FBSyxFQUFDLE9BSFI7QUFJRSxJQUFBLFFBQVEsRUFBRUMsUUFKWjtBQUtFLElBQUEsS0FBSyxFQUFFWSxLQUxUO0FBT0UsSUFBQSxJQUFJLEVBQUMsT0FQUDtBQVFFLG1CQUFZLE9BUmQ7QUFTRSxJQUFBLElBQUksRUFBQyxPQVRQO0FBVUUsSUFBQSxPQUFPLEVBQUVYLFVBQVUsSUFBSUEsVUFBVSxDQUFDLE9BQUQsQ0FBVixDQUFvQmxCLE9BVjdDO0FBV0UsSUFBQSxPQUFPLEVBQUVrQixVQUFVLElBQUlBLFVBQVUsQ0FBQyxPQUFELENBQVYsQ0FBb0JqQjtBQVg3QyxJQW5CRixFQWlDRSxFQUFDLFNBQUQ7QUFDRSxJQUFBLE1BQU0sRUFBRW1CLE1BRFY7QUFFRSxJQUFBLE9BQU8sRUFBRUosT0FGWDtBQUdFLElBQUEsS0FBSyxFQUFDLFVBSFI7QUFJRSxJQUFBLFFBQVEsRUFBRUMsUUFKWjtBQUtFLElBQUEsS0FBSyxFQUFFSCxRQUxUO0FBT0UsSUFBQSxJQUFJLEVBQUMsVUFQUDtBQVFFLG1CQUFZLFVBUmQ7QUFTRSxJQUFBLElBQUksRUFBQyxVQVRQO0FBVUUsSUFBQSxPQUFPLEVBQUVJLFVBQVUsSUFBSUEsVUFBVSxDQUFDLFVBQUQsQ0FBVixDQUF1QmxCLE9BVmhEO0FBV0UsSUFBQSxPQUFPLEVBQUVrQixVQUFVLElBQUlBLFVBQVUsQ0FBQyxVQUFELENBQVYsQ0FBdUJqQjtBQVhoRCxJQWpDRixFQStDRSxFQUFDLE1BQUQ7QUFFRSxJQUFBLElBQUksRUFBQyxRQUZQO0FBR0UsSUFBQSxPQUFPLEVBQUU2QixRQUhYO0FBSUUsSUFBQSxFQUFFLEVBQUMsWUFKTDtBQUtFLG1CQUFZLFlBTGQ7QUFNRSxJQUFBLE9BQU8sRUFBRXRCLE9BTlg7QUFPRSxJQUFBLEtBQUssRUFBQyxRQVBSO0FBUUUsSUFBQSxFQUFFLEVBQUM7QUFSTCxJQS9DRixDQURGO0FBK0REOztBQ3BFRCxNQUFNZ0IsbUJBQWlCLEdBQUc7QUFBRUksRUFBQUEsUUFBUSxFQUFFO0FBQUU1QixJQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTFCLEdBQVo7QUFBNkNhLEVBQUFBLFFBQVEsRUFBRTtBQUFFZCxJQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTFCLEdBQXZEO0FBQXdGNEIsRUFBQUEsS0FBSyxFQUFFO0FBQUU3QixJQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTFCO0FBQS9GLENBQTFCO0FBQ0EsTUFBTXdCLGlCQUFlLEdBQUc7QUFBRUcsRUFBQUEsUUFBUSxFQUFFO0FBQUU1QixJQUFBQSxPQUFPLEVBQUUsS0FBWDtBQUFrQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTNCLEdBQVo7QUFBa0VhLEVBQUFBLFFBQVEsRUFBRTtBQUFFZCxJQUFBQSxPQUFPLEVBQUUsS0FBWDtBQUFrQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTNCLEdBQTVFO0FBQWlJNEIsRUFBQUEsS0FBSyxFQUFFO0FBQUU3QixJQUFBQSxPQUFPLEVBQUUsS0FBWDtBQUFrQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTNCO0FBQXhJLENBQXhCO0FBQ2UsU0FBUzhCLFlBQVQsR0FBd0I7QUFDbkMsU0FBTztBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDSDtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDSTtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLEtBQ0k7QUFBSSxJQUFBLFNBQVMsRUFBQztBQUFkLGlDQURKLEVBRUksRUFBQyxNQUFEO0FBQVEsSUFBQSxRQUFRLEVBQUMsVUFBakI7QUFBNEIsSUFBQSxLQUFLLEVBQUMsZ0JBQWxDO0FBQW1ELElBQUEsUUFBUSxFQUFDLFdBQTVEO0FBQXdFLElBQUEsVUFBVSxFQUFFUDtBQUFwRixJQUZKLENBREosQ0FERyxFQU9IO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNJO0FBQU0sSUFBQSxTQUFTLEVBQUM7QUFBaEIsS0FDSTtBQUFJLElBQUEsU0FBUyxFQUFDO0FBQWQsK0JBREosRUFFSSxFQUFDLE1BQUQ7QUFBUSxJQUFBLFFBQVEsRUFBQyxVQUFqQjtBQUE0QixJQUFBLEtBQUssRUFBQyxnQkFBbEM7QUFBbUQsSUFBQSxRQUFRLEVBQUMsV0FBNUQ7QUFBd0UsSUFBQSxVQUFVLEVBQUVDO0FBQXBGLElBRkosQ0FESixDQVBHLEVBY0g7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0k7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNJO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCxrQkFESixFQUVJLEVBQUMsTUFBRDtBQUFRLElBQUEsUUFBUSxFQUFDLFVBQWpCO0FBQTRCLElBQUEsS0FBSyxFQUFDLGdCQUFsQztBQUFtRCxJQUFBLFFBQVEsRUFBQyxXQUE1RDtBQUF3RSxJQUFBLFVBQVUsRUFBRUQsbUJBQXBGO0FBQXNHLElBQUEsT0FBTztBQUE3RyxJQUZKLENBREosQ0FkRyxFQW9CSDtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDSTtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLEtBQ0k7QUFBSSxJQUFBLFNBQVMsRUFBQztBQUFkLDJCQURKLEVBRUksRUFBQyxNQUFEO0FBQVEsSUFBQSxRQUFRLEVBQUMsVUFBakI7QUFBNEIsSUFBQSxLQUFLLEVBQUMsZ0JBQWxDO0FBQW1ELElBQUEsUUFBUSxFQUFDLFdBQTVEO0FBQXdFLElBQUEsVUFBVSxFQUFFQSxtQkFBcEY7QUFBdUcsSUFBQSxLQUFLLEVBQUU7QUFBQ3ZCLE1BQUFBLE9BQU8sRUFBQztBQUFUO0FBQTlHLElBRkosQ0FESixDQXBCRyxDQUFQO0FBMkJIOztBQzNCYyxTQUFTK0IsY0FBVCxDQUF3QnBFLEtBQXhCLEVBQStCO0FBQzVDLFFBQU07QUFBRWtELElBQUFBLFFBQUY7QUFBWW1CLElBQUFBLE9BQVo7QUFBcUJmLElBQUFBLFVBQXJCO0FBQWlDRCxJQUFBQSxRQUFqQztBQUEyQ2lCLElBQUFBLGdCQUEzQztBQUE2RDFCLElBQUFBLE9BQTdEO0FBQXFFYSxJQUFBQTtBQUFyRSxNQUErRXpELEtBQXJGLENBRDRDO0FBSTVDO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUMsaUNBQWY7QUFBaUQsSUFBQSxLQUFLLEVBQUU7QUFBRTBELE1BQUFBLE1BQU0sRUFBRSxFQUFWO0FBQWNDLE1BQUFBLE9BQU8sRUFBRTtBQUF2QjtBQUF4RCxLQUNHZixPQUFPLElBQUk7QUFBSyxJQUFBLFNBQVMsRUFBQyxVQUFmO0FBQTBCLElBQUEsS0FBSyxFQUFDO0FBQWhDLEtBQ1Y7QUFBSyxJQUFBLFNBQVMsRUFBQyx5REFBZjtBQUF5RSxJQUFBLElBQUksRUFBQyxhQUE5RTtBQUE0RixxQkFBYyxLQUExRztBQUFnSCxxQkFBYyxHQUE5SDtBQUFrSSxxQkFBYyxLQUFoSjtBQUFzSixJQUFBLEtBQUssRUFBQztBQUE1SixJQURVLENBRGQsRUFJR2EsS0FBSyxJQUFJLEVBQUMsS0FBRDtBQUFPLElBQUEsS0FBSyxFQUFDLFFBQWI7QUFBc0IsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ3BCO0FBQXJDLElBSlosRUFLRSxFQUFDLFNBQUQ7QUFDRSxJQUFBLEtBQUssRUFBQyxVQURSO0FBRUUsSUFBQSxLQUFLLEVBQUVhLFFBRlQ7QUFHRSxJQUFBLElBQUksRUFBQyxVQUhQO0FBSUUsSUFBQSxFQUFFLEVBQUMsVUFKTDtBQUtFLElBQUEsSUFBSSxFQUFDLFVBTFA7QUFPRSxJQUFBLFFBQVEsRUFBRUcsUUFQWjtBQVFFLElBQUEsT0FBTyxFQUFFQyxVQUFVLElBQUlBLFVBQVUsQ0FBQyxVQUFELENBQVYsQ0FBdUJsQixPQVJoRDtBQVNFLElBQUEsT0FBTyxFQUFFa0IsVUFBVSxJQUFJQSxVQUFVLENBQUMsVUFBRCxDQUFWLENBQXVCakI7QUFUaEQsSUFMRixFQWlCRSxFQUFDLFNBQUQ7QUFDRSxJQUFBLEtBQUssRUFBQyxTQURSO0FBRUUsSUFBQSxLQUFLLEVBQUVnQyxPQUZUO0FBR0UsSUFBQSxJQUFJLEVBQUMsVUFIUDtBQUlFLElBQUEsRUFBRSxFQUFDLFNBSkw7QUFLRSxJQUFBLElBQUksRUFBQyxTQUxQO0FBT0UsSUFBQSxRQUFRLEVBQUVoQixRQVBaO0FBUUUsSUFBQSxPQUFPLEVBQUVDLFVBQVUsSUFBSUEsVUFBVSxDQUFDLFNBQUQsQ0FBVixDQUFzQmxCLE9BUi9DO0FBU0UsSUFBQSxPQUFPLEVBQUVrQixVQUFVLElBQUlBLFVBQVUsQ0FBQyxTQUFELENBQVYsQ0FBc0JqQjtBQVQvQyxJQWpCRixFQTZCRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLElBQUksRUFBQyxRQURQO0FBRUUsSUFBQSxPQUFPLEVBQUVPLE9BRlg7QUFHRSxtQkFBWSxpQkFIZDtBQUlFLElBQUEsT0FBTyxFQUFFMEIsZ0JBSlg7QUFLRSxJQUFBLEtBQUssRUFBQyxRQUxSO0FBS2lCLElBQUEsRUFBRSxFQUFDO0FBTHBCLElBN0JGLENBREY7QUF1Q0Q7O0FDdERELE1BQU1WLG1CQUFpQixHQUFHO0FBQUVWLEVBQUFBLFFBQVEsRUFBRTtBQUFFZCxJQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTFCLEdBQVo7QUFBNkNnQyxFQUFBQSxPQUFPLEVBQUU7QUFBRWpDLElBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxJQUFBQSxPQUFPLEVBQUU7QUFBMUI7QUFBdEQsQ0FBMUI7QUFDQSxNQUFNd0IsaUJBQWUsR0FBRztBQUFFWCxFQUFBQSxRQUFRLEVBQUU7QUFBRWQsSUFBQUEsT0FBTyxFQUFFLEtBQVg7QUFBa0JDLElBQUFBLE9BQU8sRUFBRTtBQUEzQixHQUFaO0FBQW9FZ0MsRUFBQUEsT0FBTyxFQUFFO0FBQUVqQyxJQUFBQSxPQUFPLEVBQUUsS0FBWDtBQUFrQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTNCO0FBQTdFLENBQXhCO0FBQ2UsU0FBU2tDLG9CQUFULEdBQWdDO0FBQzdDLFNBQU87QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0w7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCwwQ0FERixFQUVFLEVBQUMsY0FBRDtBQUFnQixJQUFBLFFBQVEsRUFBQyxXQUF6QjtBQUFxQyxJQUFBLE9BQU8sRUFBQyxXQUE3QztBQUF5RCxJQUFBLFVBQVUsRUFBRVg7QUFBckUsSUFGRixDQURGLENBREssRUFPTDtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLEtBQ0U7QUFBSSxJQUFBLFNBQVMsRUFBQztBQUFkLHVDQURGLEVBRUUsRUFBQyxjQUFEO0FBQWdCLElBQUEsVUFBVSxFQUFFQztBQUE1QixJQUZGLENBREYsQ0FQSyxFQWFMO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQU0sSUFBQSxTQUFTLEVBQUM7QUFBaEIsS0FDRTtBQUFJLElBQUEsU0FBUyxFQUFDO0FBQWQsa0NBREYsRUFFRSxFQUFDLGNBQUQ7QUFBZ0IsSUFBQSxRQUFRLEVBQUMsV0FBekI7QUFBcUMsSUFBQSxPQUFPLEVBQUMsV0FBN0M7QUFBeUQsSUFBQSxVQUFVLEVBQUVELG1CQUFyRTtBQUF3RixJQUFBLE9BQU87QUFBL0YsSUFGRixDQURGLENBYkssRUFtQkw7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCxtQ0FERixFQUVFLEVBQUMsY0FBRDtBQUFnQixJQUFBLFFBQVEsRUFBQyxXQUF6QjtBQUFxQyxJQUFBLE9BQU8sRUFBQyxXQUE3QztBQUF5RCxJQUFBLFVBQVUsRUFBRUEsbUJBQXJFO0FBQXdGLElBQUEsS0FBSyxFQUFFO0FBQUV2QixNQUFBQSxPQUFPLEVBQUU7QUFBWDtBQUEvRixJQUZGLENBREYsQ0FuQkssQ0FBUDtBQTBCRDs7QUMzQmMsU0FBU21DLGlCQUFULENBQTJCeEUsS0FBM0IsRUFBa0M7QUFDL0MsUUFBTTtBQUFFaUUsSUFBQUEsS0FBRjtBQUFTWCxJQUFBQSxVQUFUO0FBQXFCbUIsSUFBQUEsdUJBQXJCO0FBQThDN0IsSUFBQUEsT0FBOUM7QUFBdURTLElBQUFBLFFBQXZEO0FBQWdFSSxJQUFBQTtBQUFoRSxNQUEwRXpELEtBQWhGO0FBR0EsU0FFRTtBQUFLLElBQUEsU0FBUyxFQUFDLGlDQUFmO0FBQWlELElBQUEsS0FBSyxFQUFFO0FBQUUwRCxNQUFBQSxNQUFNLEVBQUUsRUFBVjtBQUFjQyxNQUFBQSxPQUFPLEVBQUU7QUFBdkI7QUFBeEQsS0FDR2YsT0FBTyxJQUFJO0FBQUssSUFBQSxTQUFTLEVBQUMsVUFBZjtBQUEwQixJQUFBLEtBQUssRUFBQztBQUFoQyxLQUNWO0FBQUssSUFBQSxTQUFTLEVBQUMseURBQWY7QUFBeUUsSUFBQSxJQUFJLEVBQUMsYUFBOUU7QUFBNEYscUJBQWMsS0FBMUc7QUFBZ0gscUJBQWMsR0FBOUg7QUFBa0kscUJBQWMsS0FBaEo7QUFBc0osSUFBQSxLQUFLLEVBQUM7QUFBNUosSUFEVSxDQURkLEVBSUdhLEtBQUssSUFBSSxFQUFDLEtBQUQ7QUFBTyxJQUFBLEtBQUssRUFBQyxRQUFiO0FBQXNCLElBQUEsT0FBTyxFQUFFQSxLQUFLLENBQUNwQjtBQUFyQyxJQUpaLEVBS0UsRUFBQyxTQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUMsT0FEUjtBQUVFLElBQUEsS0FBSyxFQUFFNEIsS0FGVDtBQUlFLElBQUEsSUFBSSxFQUFDLE9BSlA7QUFLRSxJQUFBLFFBQVEsRUFBRVosUUFMWjtBQU1FLElBQUEsSUFBSSxFQUFDLE9BTlA7QUFPRSxJQUFBLEVBQUUsRUFBQyxPQVBMO0FBUUUsSUFBQSxPQUFPLEVBQUVDLFVBQVUsSUFBSUEsVUFBVSxDQUFDLE9BQUQsQ0FBVixDQUFvQmxCLE9BUjdDO0FBU0UsSUFBQSxPQUFPLEVBQUVrQixVQUFVLElBQUlBLFVBQVUsQ0FBQyxPQUFELENBQVYsQ0FBb0JqQjtBQVQ3QyxJQUxGLEVBa0JFLEVBQUMsTUFBRDtBQUVFLElBQUEsSUFBSSxFQUFDLFFBRlA7QUFHRSxJQUFBLE9BQU8sRUFBRW9DLHVCQUhYO0FBSUUsbUJBQVksdUJBSmQ7QUFLRSxJQUFBLEtBQUssRUFBQyx5QkFMUjtBQU1FLElBQUEsT0FBTyxFQUFFN0IsT0FOWDtBQU9FLElBQUEsRUFBRSxFQUFDO0FBUEwsSUFsQkYsQ0FGRjtBQW1DRDs7QUN6Q0QsTUFBTWdCLG1CQUFpQixHQUFHO0FBQUVLLEVBQUFBLEtBQUssRUFBRTtBQUFFN0IsSUFBQUEsT0FBTyxFQUFFLElBQVg7QUFBaUJDLElBQUFBLE9BQU8sRUFBRTtBQUExQjtBQUFULENBQTFCO0FBQ0EsTUFBTXdCLGlCQUFlLEdBQUc7QUFBRUksRUFBQUEsS0FBSyxFQUFFO0FBQUU3QixJQUFBQSxPQUFPLEVBQUUsS0FBWDtBQUFrQkMsSUFBQUEsT0FBTyxFQUFFO0FBQTNCO0FBQVQsQ0FBeEI7QUFDZSxTQUFTcUMsbUJBQVQsR0FBK0I7QUFDNUMsU0FBTztBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDTDtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLEtBQ0U7QUFBSSxJQUFBLFNBQVMsRUFBQztBQUFkLDBDQURGLEVBR0UsRUFBQ0MsaUJBQUQ7QUFBZ0IsSUFBQSxLQUFLLEVBQUMsZ0JBQXRCO0FBQXVDLElBQUEsVUFBVSxFQUFFZjtBQUFuRCxJQUhGLENBREYsQ0FESyxFQVVMO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQU0sSUFBQSxTQUFTLEVBQUM7QUFBaEIsS0FDRTtBQUFJLElBQUEsU0FBUyxFQUFDO0FBQWQsdUNBREYsRUFHRSxFQUFDZSxpQkFBRDtBQUFnQixJQUFBLEtBQUssRUFBQyxlQUF0QjtBQUFzQyxJQUFBLFVBQVUsRUFBRWQ7QUFBbEQsSUFIRixDQURGLENBVkssRUFtQkw7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCwyQ0FERixFQUdFLEVBQUNjLGlCQUFEO0FBQWdCLElBQUEsS0FBSyxFQUFDLGdCQUF0QjtBQUF1QyxJQUFBLFVBQVUsRUFBRWYsbUJBQW5EO0FBQXNFLElBQUEsT0FBTztBQUE3RSxJQUhGLENBREYsQ0FuQkssRUE2Qkw7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCxvQkFERixFQUdFLEVBQUNlLGlCQUFEO0FBQWdCLElBQUEsS0FBSyxFQUFDLGdCQUF0QjtBQUF1QyxJQUFBLFVBQVUsRUFBRWYsbUJBQW5EO0FBQXNFLElBQUEsS0FBSyxFQUFFO0FBQUN2QixNQUFBQSxPQUFPLEVBQUM7QUFBVDtBQUE3RSxJQUhGLENBREYsQ0E3QkssQ0FBUDtBQXVDRDs7QUN0Q2MsU0FBU3VDLGNBQVQsR0FBMEI7QUFFckMsU0FBTyxDQUNILEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDSSxFQUFDLFdBQUQsT0FESixDQURHLEVBSUgsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUNDLFlBQUQsT0FESixDQUpHLEVBT0gsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUMsb0JBQUQsT0FESixDQVBHLEVBVUgsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUNDLG1CQUFELE9BREosQ0FWRyxDQUFQO0FBY0g7O0FDcEJjLFNBQVNDLFVBQVQsR0FBc0I7QUFFakMsU0FBTztBQUFLLElBQUEsS0FBSyxFQUFHO0FBQUNsRCxNQUFBQSxPQUFPLEVBQUMsTUFBVDtBQUFpQm1ELE1BQUFBLGFBQWEsRUFBQyxRQUEvQjtBQUF3Q2pFLE1BQUFBLEtBQUssRUFBQyxNQUE5QztBQUFzRGUsTUFBQUEsVUFBVSxFQUFDLFFBQWpFO0FBQTBFVCxNQUFBQSxlQUFlLEVBQUM7QUFBMUY7QUFBYixLQUNILGVBQ0EsK0JBREEsRUFFQSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQztBQUFYLGVBRkEsRUFHQSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQztBQUFYLGlCQUhBLEVBSUEsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxlQUpBLEVBS0EsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxjQUxBLEVBTUEsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxlQU5BLEVBT0EsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxZQVBBLEVBUUEsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxhQVJBLEVBU0EsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxZQVRBLEVBVUEsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxZQVZBLENBREcsRUFhSCxlQUNJLGlDQURKLEVBRUEsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUMsU0FBWDtBQUFxQixJQUFBLE9BQU8sRUFBRSxJQUE5QjtBQUFvQyxJQUFBLEtBQUssRUFBQztBQUExQyxJQUZBLEVBR0EsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUMsV0FBWDtBQUF1QixJQUFBLE9BQU8sTUFBOUI7QUFBK0IsSUFBQSxLQUFLLEVBQUM7QUFBckMsSUFIQSxFQUlBLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDLFNBQVg7QUFBcUIsSUFBQSxPQUFPLE1BQTVCO0FBQTZCLElBQUEsS0FBSyxFQUFDO0FBQW5DLElBSkEsRUFLQSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQyxRQUFYO0FBQW9CLElBQUEsT0FBTyxNQUEzQjtBQUE0QixJQUFBLEtBQUssRUFBQztBQUFsQyxJQUxBLEVBTUEsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUMsU0FBWDtBQUFxQixJQUFBLE9BQU8sTUFBNUI7QUFBNkIsSUFBQSxLQUFLLEVBQUM7QUFBbkMsSUFOQSxFQU9BLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDLE1BQVg7QUFBa0IsSUFBQSxPQUFPLE1BQXpCO0FBQTBCLElBQUEsS0FBSyxFQUFDO0FBQWhDLElBUEEsRUFRQSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQyxPQUFYO0FBQW1CLElBQUEsT0FBTyxNQUExQjtBQUEyQixJQUFBLEtBQUssRUFBQztBQUFqQyxJQVJBLEVBU0EsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUMsTUFBWDtBQUFrQixJQUFBLE9BQU8sTUFBekI7QUFBMEIsSUFBQSxLQUFLLEVBQUM7QUFBaEMsSUFUQSxFQVVBLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDLE1BQVg7QUFBa0IsSUFBQSxPQUFPLE1BQXpCO0FBQTBCLElBQUEsS0FBSyxFQUFDO0FBQWhDLElBVkEsQ0FiRyxFQXlCSDtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUNRLE1BQUFBLE9BQU8sRUFBQztBQUFUO0FBQVosS0FDQSxlQUNBLDhCQURBLEVBRUEsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUMsU0FBWDtBQUFvQixJQUFBLElBQUksRUFBQyxJQUF6QjtBQUE4QixJQUFBLEtBQUssRUFBQztBQUFwQyxJQUZBLEVBR0EsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUMsV0FBWDtBQUF1QixJQUFBLElBQUksRUFBQyxJQUE1QjtBQUFpQyxJQUFBLEtBQUssRUFBQztBQUF2QyxJQUhBLENBREEsRUFNQSw4QkFOQSxFQU9BLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDLFNBQVg7QUFBb0IsSUFBQSxJQUFJLEVBQUMsSUFBekI7QUFBOEIsSUFBQSxLQUFLLEVBQUM7QUFBcEMsSUFQQSxFQVFBLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDLFdBQVg7QUFBdUIsSUFBQSxJQUFJLEVBQUMsSUFBNUI7QUFBaUMsSUFBQSxLQUFLLEVBQUM7QUFBdkMsSUFSQSxDQXpCRyxFQW1DSCxjQW5DRyxFQXVDSCxlQUNBLGtDQURBLEVBRUEsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUMsU0FBWDtBQUFxQixJQUFBLFFBQVEsTUFBN0I7QUFBK0IsSUFBQSxLQUFLLEVBQUM7QUFBckMsSUFGQSxFQUdBLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDLFdBQVg7QUFBd0IsSUFBQSxRQUFRLE1BQWhDO0FBQWlDLElBQUEsS0FBSyxFQUFDO0FBQXZDLElBSEEsQ0F2Q0csRUE2Q0gsZUFDQSxpQ0FEQSxFQUVBLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDLFNBQVg7QUFBcUIsSUFBQSxLQUFLLEVBQUMsVUFBM0I7QUFBc0MsSUFBQSxPQUFPO0FBQTdDLElBRkEsQ0E3Q0csQ0FBUDtBQW1ESDs7QUNwRGMsU0FBU29ELGVBQVQsR0FBMkI7QUFDdEMsU0FBTyxlQUNILGVBQ0ksMkJBREosRUFFQSxFQUFDLFNBQUQ7QUFBVyxJQUFBLE9BQU8sRUFBRTtBQUFwQixJQUZBLEVBR0EsRUFBQyxTQUFEO0FBQVcsSUFBQSxPQUFPLEVBQUU7QUFBcEIsSUFIQSxDQURHLENBQVA7QUFRSDs7QUNaRCxNQUFNLEdBQUcsR0FBRyx3K0ZBQXcrRjs7QUNFcitGLFNBQVNDLEtBQVQsR0FBaUI7QUFDNUIsU0FBTztBQUFLLElBQUEsU0FBUyxFQUFDLE9BQWY7QUFBdUIsSUFBQSxJQUFJLEVBQUMsT0FBNUI7QUFBb0MsaUJBQVUsV0FBOUM7QUFBMEQsbUJBQVk7QUFBdEUsS0FDUDtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFLLElBQUEsR0FBRyxFQUFFQyxHQUFWO0FBQXFCLElBQUEsU0FBUyxFQUFDLGNBQS9CO0FBQThDLElBQUEsR0FBRyxFQUFDO0FBQWxELElBREYsRUFFRTtBQUFRLElBQUEsU0FBUyxFQUFDO0FBQWxCLGlCQUZGLEVBR0U7QUFBTyxJQUFBLFNBQVMsRUFBQztBQUFqQixnQkFIRixFQUlFO0FBQVEsSUFBQSxJQUFJLEVBQUMsUUFBYjtBQUFzQixJQUFBLFNBQVMsRUFBQyxpQkFBaEM7QUFBa0Qsb0JBQWEsT0FBL0Q7QUFBdUUsa0JBQVc7QUFBbEYsS0FDRTtBQUFNLG1CQUFZO0FBQWxCLFlBREYsQ0FKRixDQURPLEVBU1A7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLDRCQVRPLENBQVA7QUFjSDs7QUNmYyxTQUFTQyxTQUFULEdBQW9CO0FBRS9CLFNBQU8sRUFBQyxLQUFELE9BQVA7QUFDSDs7QUNIYyxTQUFTQyxTQUFULEdBQXFCO0FBQ2hDLFNBQU0sRUFBQyxLQUFEO0FBQU8sSUFBQSxLQUFLLEVBQUMsUUFBYjtBQUFzQixJQUFBLE9BQU8sRUFBQztBQUE5QixJQUFOO0FBQ0g7O0FDRWMsU0FBU0MsZUFBVCxHQUEyQjtBQUN0QyxTQUFPLENBQ0gsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUMvQyxVQUFELE9BREosQ0FERyxFQUlILEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDSSxFQUFDTCxlQUFELE9BREosQ0FKRyxFQU9ILEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDSSxFQUFDLFNBQUQsT0FESixDQVBHLEVBVUgsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUMsU0FBRCxPQURKLENBVkcsQ0FBUDtBQWNIOztBQ3BCRCxNQUFNcUQsTUFBTSxHQUFHO0FBQ2JDLEVBQUFBLElBQUksRUFBRTtBQUNKbkUsSUFBQUEsZUFBZSxFQUFFLFNBRGI7QUFFSkwsSUFBQUEsTUFBTSxFQUFFO0FBRko7QUFETyxDQUFmO0FBTWUsU0FBU3lFLE1BQVQsQ0FBZ0I7QUFBRXhGLEVBQUFBLFFBQUY7QUFBWWEsRUFBQUEsS0FBWjtBQUFtQjRFLEVBQUFBO0FBQW5CLENBQWhCLEVBQXlDO0FBQ3RELFNBQU87QUFBSyxtQkFBYUEsRUFBbEI7QUFBc0IsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHSCxNQUFNLENBQUNDLElBQVo7QUFBa0IsU0FBRzFFO0FBQXJCO0FBQTdCLEtBQTREYixRQUE1RCxDQUFQO0FBQ0Q7O0FDTkQsTUFBTWEsT0FBSyxHQUFHO0FBQ1o2RSxFQUFBQSxRQUFRLEVBQUU7QUFBRUMsSUFBQUEsV0FBVyxFQUFFO0FBQWYsR0FERTtBQUVaQyxFQUFBQSxZQUFZLEVBQUU7QUFDWmhFLElBQUFBLE9BQU8sRUFBRSxNQURHO0FBRVpDLElBQUFBLFVBQVUsRUFBRSxRQUZBO0FBR1o2QixJQUFBQSxPQUFPLEVBQUU7QUFIRyxHQUZGO0FBT1ptQyxFQUFBQSxNQUFNLEVBQUU7QUFDTmpFLElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU5tRCxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdOaEUsSUFBQUEsTUFBTSxFQUFFLE1BSEY7QUFJTmUsSUFBQUEsY0FBYyxFQUFFLGVBSlY7QUFLTmdFLElBQUFBLFNBQVMsRUFBRSxZQUxMO0FBTU5DLElBQUFBLFVBQVUsRUFBQztBQU5MLEdBUEk7QUFlWkMsRUFBQUEsR0FBRyxFQUFFO0FBQ0hDLElBQUFBLElBQUksRUFBRSxDQURIO0FBRUhOLElBQUFBLFdBQVcsRUFBRTtBQUZWO0FBZk8sQ0FBZDtBQXFCZSxTQUFTTyxLQUFULENBQWU7QUFBRUMsRUFBQUEsUUFBRjtBQUFZQyxFQUFBQSxPQUFaO0FBQXFCQyxFQUFBQTtBQUFyQixDQUFmLEVBQWdEO0FBRzdELFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUV4RixPQUFLLENBQUNnRjtBQUFyQixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVoRixPQUFLLENBQUMrRTtBQUFsQixLQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsVUFBWjtBQUF1QixJQUFBLEtBQUssRUFBRS9FLE9BQUssQ0FBQzZFLFFBQXBDO0FBQThDLElBQUEsUUFBUSxFQUFFVztBQUF4RCxJQURGLEVBRUUsMEJBRkYsQ0FERixFQUtFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNBLEVBQUMsTUFBRDtBQUFRLG1CQUFZLFlBQXBCO0FBQWtDLElBQUEsT0FBTyxFQUFFRixRQUEzQztBQUFxRCxJQUFBLEtBQUssRUFBQyxRQUEzRDtBQUFvRSxJQUFBLEVBQUUsRUFBQyxXQUF2RTtBQUFtRixJQUFBLE9BQU8sTUFBMUY7QUFBMkYsSUFBQSxLQUFLO0FBQWhHLElBREEsQ0FERixFQU1KO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNBLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDLE9BQVg7QUFBbUIsSUFBQSxPQUFPLEVBQUVDLE9BQTVCO0FBQXFDLG1CQUFZLFdBQWpEO0FBQThELElBQUEsS0FBSyxFQUFDLE9BQXBFO0FBQTRFLElBQUEsRUFBRSxFQUFDLFNBQS9FO0FBQXlGLElBQUEsS0FBSztBQUE5RixJQURBLENBTkksQ0FMRixDQURGO0FBcUJEOztBQy9DTSxTQUFTRixPQUFULENBQWU7QUFDcEJuRixFQUFBQSxNQUFNLEdBQUcsRUFEVztBQUVwQkQsRUFBQUEsS0FBSyxHQUFHLEVBRlk7QUFHcEJ3RixFQUFBQSxJQUFJLEdBQUcsTUFIYTtBQUlwQjdFLEVBQUFBLEtBQUssR0FBRyxPQUpZO0FBS3BCOEUsRUFBQUEsT0FMb0I7QUFNcEJkLEVBQUFBO0FBTm9CLENBQWYsRUFPSjtBQUNELFNBQ0U7QUFDRSxJQUFBLE1BQU0sRUFBRTFFLE1BRFY7QUFFRSxJQUFBLE9BQU8sRUFBQyxXQUZWO0FBR0UsSUFBQSxLQUFLLEVBQUVELEtBSFQ7QUFJRSxJQUFBLE9BQU8sRUFBRXlGLE9BSlg7QUFLRSxJQUFBLEVBQUUsRUFBRWQ7QUFMTixLQU9FO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRWEsSUFBOUI7QUFBb0MsSUFBQSxFQUFFLEVBQUViO0FBQXhDLElBUEYsRUFRRTtBQUNFLElBQUEsRUFBRSxFQUFFQSxFQUROO0FBRUUsSUFBQSxJQUFJLEVBQUVoRSxLQUZSO0FBR0UsSUFBQSxDQUFDLEVBQUM7QUFISixJQVJGLENBREY7QUFnQkQ7O0FDeEJNLFNBQVMrRSxNQUFULENBQWdCO0FBQUV4RyxFQUFBQSxRQUFGO0FBQVlhLEVBQUFBO0FBQVosQ0FBaEIsRUFBcUM7QUFDMUMsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFO0FBQ0xlLE1BQUFBLE9BQU8sRUFBRSxNQURKO0FBRUxFLE1BQUFBLGNBQWMsRUFBRSxRQUZYO0FBR0xKLE1BQUFBLFNBQVMsRUFBRSxRQUhOO0FBSUwsU0FBR2I7QUFKRTtBQURULEtBUUdiLFFBUkgsQ0FERjtBQVlEOztBQ1BELE1BQU1hLE9BQUssR0FBRztBQUNaZ0YsRUFBQUEsTUFBTSxFQUFFO0FBQ05qRSxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVObUQsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTmhFLElBQUFBLE1BQU0sRUFBRSxNQUhGO0FBSU5lLElBQUFBLGNBQWMsRUFBRSxlQUpWO0FBS05nRSxJQUFBQSxTQUFTLEVBQUUsWUFMTDtBQU1OQyxJQUFBQSxVQUFVLEVBQUU7QUFOTjtBQURJLENBQWQ7QUFZZSxTQUFTVSxPQUFULENBQWlCO0FBQUVDLEVBQUFBLE9BQUY7QUFBV0MsRUFBQUEsU0FBWDtBQUFzQkMsRUFBQUE7QUFBdEIsQ0FBakIsRUFBa0Q7QUFHL0QsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRS9GLE9BQUssQ0FBQ2dGLE1BQXJCO0FBQTZCLElBQUEsRUFBRSxFQUFDO0FBQWhDLEtBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUU7QUFBRWQsTUFBQUEsYUFBYSxFQUFFLFFBQWpCO0FBQTJCbEQsTUFBQUEsVUFBVSxFQUFFO0FBQXZDO0FBQWYsS0FDRSxFQUFDcUUsT0FBRDtBQUFPLElBQUEsS0FBSyxFQUFDLElBQWI7QUFBa0IsSUFBQSxNQUFNLEVBQUMsSUFBekI7QUFBOEIsSUFBQSxLQUFLLEVBQUM7QUFBcEMsSUFERixFQUVFLGFBQUlRLE9BQU8sSUFBSUEsT0FBTyxDQUFDM0MsUUFBdkIsQ0FGRixnQkFERixFQUtFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFLEVBQUMsTUFBRDtBQUFRLG1CQUFZLFdBQXBCO0FBQWdDLElBQUEsT0FBTyxFQUFFNkMsT0FBekM7QUFBa0QsSUFBQSxLQUFLLEVBQUMsT0FBeEQ7QUFBZ0UsSUFBQSxFQUFFLEVBQUMsV0FBbkU7QUFBK0UsSUFBQSxLQUFLLE1BQXBGO0FBQXFGLElBQUEsT0FBTztBQUE1RixJQURGLENBREYsRUFJRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQyxTQUFYO0FBQXFCLElBQUEsT0FBTyxFQUFFRCxTQUE5QjtBQUF5QyxtQkFBWSxhQUFyRDtBQUFtRSxJQUFBLEtBQUssRUFBQyxTQUF6RTtBQUFtRixJQUFBLEVBQUUsRUFBQyxTQUF0RjtBQUFnRyxJQUFBLEtBQUs7QUFBckcsSUFERixDQUpGLENBTEYsQ0FERjtBQWdCRDs7QUNyQ00sU0FBU0UsTUFBVCxDQUFnQjtBQUNyQjlGLEVBQUFBLE1BQU0sR0FBRyxFQURZO0FBRXJCRCxFQUFBQSxLQUFLLEdBQUcsRUFGYTtBQUdyQlcsRUFBQUEsS0FBSyxHQUFHLE9BSGE7QUFJckI2RSxFQUFBQSxJQUFJLEdBQUc7QUFKYyxDQUFoQixFQUtKO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFdkYsTUFBYjtBQUFxQixJQUFBLE9BQU8sRUFBQyxXQUE3QjtBQUF5QyxJQUFBLEtBQUssRUFBRUQ7QUFBaEQsS0FDRTtBQUNFLElBQUEsSUFBSSxFQUFFVyxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQURGLEVBS0U7QUFBTSxJQUFBLENBQUMsRUFBQyxlQUFSO0FBQXdCLElBQUEsSUFBSSxFQUFFNkU7QUFBOUIsSUFMRixDQURGO0FBU0Q7O0FDZE0sU0FBU1EsT0FBVCxDQUFpQjtBQUN0Qi9GLEVBQUFBLE1BQU0sR0FBRyxFQURhO0FBRXRCRCxFQUFBQSxLQUFLLEdBQUcsRUFGYztBQUd0QlcsRUFBQUEsS0FBSyxHQUFHLE9BSGM7QUFJdEI2RSxFQUFBQSxJQUFJLEdBQUc7QUFKZSxDQUFqQixFQUtKO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFLEVBQWI7QUFBaUIsSUFBQSxPQUFPLEVBQUMsV0FBekI7QUFBcUMsSUFBQSxLQUFLLEVBQUV4RjtBQUE1QyxLQUNFO0FBQ0UsSUFBQSxJQUFJLEVBQUVXLEtBRFI7QUFFRSxJQUFBLENBQUMsRUFBQztBQUZKLElBREYsRUFLRTtBQUFNLElBQUEsQ0FBQyxFQUFDLGVBQVI7QUFBd0IsSUFBQSxJQUFJLEVBQUU2RTtBQUE5QixJQUxGLENBREY7QUFTRDs7QUNYRCxNQUFNekYsT0FBSyxHQUFHO0FBQ1prRyxFQUFBQSxPQUFPLEVBQUU7QUFBRW5GLElBQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CQyxJQUFBQSxVQUFVLEVBQUUsUUFBL0I7QUFBeUM0QixJQUFBQSxNQUFNLEVBQUU7QUFBakQsR0FERztBQUVadUMsRUFBQUEsR0FBRyxFQUFFO0FBQUVMLElBQUFBLFdBQVcsRUFBRTtBQUFmLEdBRk87QUFHWnFCLEVBQUFBLFlBQVksRUFBRTtBQUNacEYsSUFBQUEsT0FBTyxFQUFFLE1BREc7QUFFWm1ELElBQUFBLGFBQWEsRUFBRTtBQUZILEdBSEY7QUFPWmMsRUFBQUEsTUFBTSxFQUFFO0FBQ05qRSxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVObUQsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTmpELElBQUFBLGNBQWMsRUFBRSxlQUhWO0FBSU5mLElBQUFBLE1BQU0sRUFBRTtBQUpGLEdBUEk7QUFhWmtHLEVBQUFBLEtBQUssRUFBRTtBQUNMeEQsSUFBQUEsTUFBTSxFQUFFLENBREg7QUFFTDdCLElBQUFBLE9BQU8sRUFBRSxNQUZKO0FBR0xFLElBQUFBLGNBQWMsRUFBRTtBQUhYO0FBYkssQ0FBZDtBQW9CZSxTQUFTb0YsU0FBVCxDQUFtQjtBQUNoQ2QsRUFBQUEsT0FEZ0M7QUFFaENlLEVBQUFBLFFBRmdDO0FBR2hDQyxFQUFBQSxTQUhnQztBQUloQ0MsRUFBQUEsY0FKZ0M7QUFLaENDLEVBQUFBLHFCQUxnQztBQU1oQ0MsRUFBQUEsWUFOZ0M7QUFPaENDLEVBQUFBO0FBUGdDLENBQW5CLEVBUVo7QUFDRCxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFFM0csT0FBSyxDQUFDZ0Y7QUFBckIsS0FDRSxlQUNFLEVBQUMsUUFBRDtBQUFVLElBQUEsS0FBSyxFQUFDLGVBQWhCO0FBQWdDLElBQUEsUUFBUSxFQUFFd0I7QUFBMUMsSUFERixFQUVFLEVBQUMsUUFBRDtBQUNFLElBQUEsS0FBSyxFQUFDLHNCQURSO0FBRUUsSUFBQSxRQUFRLEVBQUVDO0FBRlosSUFGRixDQURGLEVBUUUsYUFSRixFQVNFO0FBQUssSUFBQSxLQUFLLEVBQUV6RyxPQUFLLENBQUNtRztBQUFsQixLQUNFLEVBQUMsVUFBRDtBQUFZLElBQUEsS0FBSyxFQUFDLFNBQWxCO0FBQTRCLElBQUEsSUFBSSxFQUFFRixPQUFsQztBQUEyQyxJQUFBLE9BQU8sRUFBRU07QUFBcEQsSUFERixFQUVFLEVBQUMsVUFBRDtBQUFZLElBQUEsS0FBSyxFQUFDLFFBQWxCO0FBQTJCLElBQUEsSUFBSSxFQUFFUCxNQUFqQztBQUF5QyxJQUFBLE9BQU8sRUFBRU07QUFBbEQsSUFGRixFQUdFLEVBQUMsVUFBRDtBQUFZLElBQUEsRUFBRSxFQUFDLE9BQWY7QUFBdUIsSUFBQSxLQUFLLEVBQUMsT0FBN0I7QUFBcUMsSUFBQSxJQUFJLEVBQUVqQixPQUEzQztBQUFrRCxJQUFBLE9BQU8sRUFBRXFCO0FBQTNELElBSEYsQ0FURixFQWNFLGVBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxPQUFPLEVBQUVDLElBQWpCO0FBQXVCLElBQUEsS0FBSyxFQUFDLElBQTdCO0FBQWtDLElBQUEsRUFBRSxFQUFDO0FBQXJDLElBREYsQ0FkRixDQURGO0FBb0JEOztBQUVELFNBQVNDLFVBQVQsQ0FBb0I7QUFBRUMsRUFBQUEsSUFBRjtBQUFRbkYsRUFBQUEsS0FBUjtBQUFlZ0UsRUFBQUEsT0FBZjtBQUF1QmQsRUFBQUE7QUFBdkIsQ0FBcEIsRUFBaUQ7QUFDL0MsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFNUUsT0FBSyxDQUFDa0c7QUFBbEIsS0FDRTtBQUFRLElBQUEsRUFBRSxFQUFFdEIsRUFBWjtBQUFnQixJQUFBLEtBQUssRUFBRTVFLE9BQUssQ0FBQ21GLEdBQTdCO0FBQWtDLElBQUEsT0FBTyxFQUFFTyxPQUEzQztBQUFvRCxtQkFBYyxHQUFFZCxFQUFHO0FBQXZFLEtBQ0UsRUFBQyxJQUFEO0FBQU0sSUFBQSxFQUFFLEVBQUVBO0FBQVYsSUFERixDQURGLEVBSUUsZUFBTWxELEtBQU4sQ0FKRixDQURGO0FBUUQ7O0FBRUQsU0FBU29GLFFBQVQsQ0FBa0I7QUFBRXpGLEVBQUFBLEtBQUY7QUFBU2tCLEVBQUFBO0FBQVQsQ0FBbEIsRUFBdUM7QUFDckMsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVLLE1BQUFBLE1BQU0sRUFBRSxDQUFWO0FBQWFtRSxNQUFBQSxTQUFTLEVBQUU7QUFBeEI7QUFBWixLQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsVUFBWjtBQUF1QixJQUFBLFFBQVEsRUFBRXhFO0FBQWpDLElBREYsRUFFRSxpQkFBUWxCLEtBQVIsQ0FGRixDQURGO0FBTUQ7O0FDdkVNLFNBQVMyRixhQUFULEdBQXlCO0FBQzlCLFFBQU0sQ0FBQy9HLEtBQUQsRUFBUWdILFFBQVIsSUFBb0JDLEdBQVEsQ0FBQyxDQUFELENBQWxDO0FBQ0EsUUFBTSxDQUFDaEgsTUFBRCxFQUFTaUgsU0FBVCxJQUFzQkQsR0FBUSxDQUFDLENBQUQsQ0FBcEM7QUFDQSxRQUFNLENBQUNFLFdBQUQsRUFBY0MsY0FBZCxJQUFnQ0gsR0FBUSxDQUFDLEVBQUQsQ0FBOUM7QUFDQSxRQUFNLENBQUNJLE1BQUQsRUFBU0MsU0FBVCxJQUFzQkwsR0FBUSxDQUFDLEVBQUQsQ0FBcEM7O0FBQ0EsV0FBU00sa0JBQVQsR0FBOEI7QUFFMUJQLElBQUFBLFFBQVEsQ0FBQ1EsTUFBTSxDQUFDQyxVQUFSLENBQVI7QUFDQVAsSUFBQUEsU0FBUyxDQUFDTSxNQUFNLENBQUNFLFdBQVIsQ0FBVDtBQUVIOztBQUVELFdBQVNDLHVCQUFULEdBQW1DO0FBQ2pDUCxJQUFBQSxjQUFjLENBQUNJLE1BQU0sQ0FBQ0ksTUFBUCxDQUFjVCxXQUFmLENBQWQ7QUFDRDs7QUFDRDFILEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSU8sS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiLGNBQVEsSUFBUjtBQUNFLGFBQUtBLEtBQUssSUFBSSxHQUFkO0FBQ0VzSCxVQUFBQSxTQUFTLENBQUMsT0FBRCxDQUFUO0FBQ0E7O0FBQ0YsYUFBS3RILEtBQUssSUFBSSxHQUFkO0FBQ0EsYUFBS0EsS0FBSyxJQUFJLEdBQWQ7QUFDQSxhQUFLQSxLQUFLLElBQUksSUFBZDtBQUNFc0gsVUFBQUEsU0FBUyxDQUFDLFFBQUQsQ0FBVDtBQUNBOztBQUNGLGFBQUt0SCxLQUFLLElBQUksSUFBZDtBQUNFc0gsVUFBQUEsU0FBUyxDQUFDLFFBQUQsQ0FBVDtBQUNBOztBQUNGLGFBQUt0SCxLQUFLLEdBQUcsSUFBYjtBQUNFc0gsVUFBQUEsU0FBUyxDQUFDLFNBQUQsQ0FBVDtBQUNBOztBQUNGO0FBQ0VBLFVBQUFBLFNBQVMsQ0FBQyxFQUFELENBQVQ7QUFoQko7QUFrQkQ7QUFDRixHQXJCUSxFQXFCTixDQUFDdEgsS0FBRCxDQXJCTSxDQUFUO0FBdUJBUCxFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkb0ksSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksUUFBWixFQUFzQlQsTUFBdEI7QUFDRCxHQUZRLEVBRU4sQ0FBQ0EsTUFBRCxDQUZNLENBQVQ7QUFHQTVILEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2Q4SCxJQUFBQSxrQkFBa0I7QUFDbEJJLElBQUFBLHVCQUF1QjtBQUN2QkgsSUFBQUEsTUFBTSxDQUFDTyxnQkFBUCxDQUF3QixtQkFBeEIsRUFBNkNKLHVCQUE3QztBQUNBSCxJQUFBQSxNQUFNLENBQUNPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLE1BQU1SLGtCQUF4QztBQUVBLFdBQU8sTUFBTTtBQUVYO0FBQ0QsS0FIRDtBQUlELEdBVlEsRUFVTixFQVZNLENBQVQ7QUFZQSxTQUFPO0FBQUV2SCxJQUFBQSxLQUFGO0FBQVNDLElBQUFBLE1BQVQ7QUFBaUJrSCxJQUFBQSxXQUFqQjtBQUE4QkUsSUFBQUE7QUFBOUIsR0FBUDtBQUNEOztBQ3RERCxNQUFNdEgsT0FBSyxHQUFHO0FBQ1owRSxFQUFBQSxJQUFJLEVBQUU7QUFDSnVELElBQUFBLFdBQVcsRUFBRSxTQURUO0FBRUpDLElBQUFBLFdBQVcsRUFBRSxPQUZUO0FBR0pDLElBQUFBLFdBQVcsRUFBRSxDQUhUO0FBSUpySCxJQUFBQSxZQUFZLEVBQUUsQ0FKVjtBQUtKK0IsSUFBQUEsT0FBTyxFQUFFLENBTEw7QUFNSjlCLElBQUFBLE9BQU8sRUFBRSxNQU5MO0FBT0ptRCxJQUFBQSxhQUFhLEVBQUUsUUFQWDtBQVFKakQsSUFBQUEsY0FBYyxFQUFFLGVBUlo7QUFTSm1ILElBQUFBLFNBQVMsRUFBRSxFQVRQO0FBVUo3SCxJQUFBQSxlQUFlLEVBQUU7QUFWYixHQURNO0FBYVoyQyxFQUFBQSxRQUFRLEVBQUU7QUFBRTRCLElBQUFBLFdBQVcsRUFBRTtBQUFmLEdBYkU7QUFjWmlELEVBQUFBLEdBQUcsRUFBRTtBQUNIaEgsSUFBQUEsT0FBTyxFQUFFLE1BRE47QUFFSEgsSUFBQUEsS0FBSyxFQUFFLFNBRko7QUFHSHlILElBQUFBLFFBQVEsRUFBRTtBQUhQLEdBZE87QUFtQlo5RyxFQUFBQSxPQUFPLEVBQUU7QUFuQkcsQ0FBZDs7QUFzQmUsU0FBU0wsU0FBVCxDQUFpQmhDLEtBQWpCLEVBQXdCO0FBQ3JDLFFBQU07QUFBRXFDLElBQUFBO0FBQUYsTUFBY3JDLEtBQXBCO0FBQ0EsUUFBTTtBQUFFb0osSUFBQUEsS0FBRjtBQUFTcEYsSUFBQUEsUUFBVDtBQUFrQnFGLElBQUFBO0FBQWxCLE1BQWdDaEgsT0FBdEM7QUFDQSxRQUFNLENBQUNpSCxJQUFELEVBQU9DLE9BQVAsSUFBa0J2QixHQUFRLENBQUMsQ0FBRCxDQUFoQztBQUNBLFFBQU0sQ0FBQ3dCLEtBQUQsRUFBUUMsUUFBUixJQUFvQnpCLEdBQVEsQ0FBQyxDQUFELENBQWxDO0FBQ0EsUUFBTSxDQUFDMEIsT0FBRCxFQUFVQyxVQUFWLElBQXdCM0IsR0FBUSxDQUFDLENBQUQsQ0FBdEM7QUFDQSxRQUFNLENBQUM0QixPQUFELEVBQVVDLFVBQVYsSUFBd0I3QixHQUFRLENBQUMsQ0FBRCxDQUF0QztBQUNBLFFBQU07QUFBRUksSUFBQUE7QUFBRixNQUFhTixhQUFhLEVBQWhDOztBQUNBLFdBQVNnQyxTQUFULENBQW1CQyxFQUFuQixFQUF1QjtBQUNyQixRQUFJQyxDQUFKLEVBQU9DLENBQVAsRUFBVS9MLENBQVYsRUFBYUcsQ0FBYjtBQUNBQSxJQUFBQSxDQUFDLEdBQUc2TCxJQUFJLENBQUNDLEtBQUwsQ0FBV0osRUFBRSxHQUFHLElBQWhCLENBQUo7QUFDQTdMLElBQUFBLENBQUMsR0FBR2dNLElBQUksQ0FBQ0MsS0FBTCxDQUFXOUwsQ0FBQyxHQUFHLEVBQWYsQ0FBSjtBQUNBQSxJQUFBQSxDQUFDLEdBQUdBLENBQUMsR0FBRyxFQUFSO0FBQ0E0TCxJQUFBQSxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXak0sQ0FBQyxHQUFHLEVBQWYsQ0FBSjtBQUNBQSxJQUFBQSxDQUFDLEdBQUdBLENBQUMsR0FBRyxFQUFSO0FBQ0E4TCxJQUFBQSxDQUFDLEdBQUdFLElBQUksQ0FBQ0MsS0FBTCxDQUFXRixDQUFDLEdBQUcsRUFBZixDQUFKO0FBQ0FBLElBQUFBLENBQUMsR0FBR0EsQ0FBQyxHQUFHLEVBQVI7QUFDQVYsSUFBQUEsT0FBTyxDQUFDUyxDQUFELENBQVA7QUFDQVAsSUFBQUEsUUFBUSxDQUFDUSxDQUFELENBQVI7QUFDQU4sSUFBQUEsVUFBVSxDQUFDekwsQ0FBRCxDQUFWO0FBQ0EyTCxJQUFBQSxVQUFVLENBQUN4TCxDQUFELENBQVY7QUFDRDs7QUFFRG1DLEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBRzZJLFNBQUgsRUFBYTtBQUVYZSxNQUFBQSxVQUFVLENBQUMsTUFBTTtBQUNmTixRQUFBQSxTQUFTLENBQUNPLElBQUksQ0FBQ0MsR0FBTCxLQUFhakIsU0FBZCxDQUFUO0FBQ0QsT0FGUyxFQUVQLENBRk8sQ0FBVjtBQUdBa0IsTUFBQUEsV0FBVyxDQUFDLE1BQU07QUFDaEJULFFBQUFBLFNBQVMsQ0FBQ08sSUFBSSxDQUFDQyxHQUFMLEtBQWFqQixTQUFkLENBQVQ7QUFDRCxPQUZVLEVBRVIsS0FGUSxDQUFYO0FBS0Q7QUFFRixHQWJRLEVBYU4sQ0FBQ0EsU0FBRCxDQWJNLENBQVQ7QUFlQSxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRXRJLE1BQUFBLEtBQUssRUFBRSxNQUFUO0FBQWlCeUosTUFBQUEsWUFBWSxFQUFFO0FBQS9CO0FBQVosS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBRzFKLE9BQUssQ0FBQzBFLElBQVg7QUFBaUI0RCxNQUFBQTtBQUFqQjtBQUFaLEtBQ0U7QUFDRSxtQkFBWSxTQURkO0FBRUUsSUFBQSxLQUFLLEVBQUV0SSxPQUFLLENBQUN1QixPQUZmO0FBR0UsSUFBQSxTQUFTLEVBQUcsZ0JBQWUrRixNQUFPO0FBSHBDLEtBS0cvRixPQUFPLElBQUlBLE9BQU8sQ0FBQ29JLElBTHRCLENBREYsRUFTRTtBQUFLLElBQUEsS0FBSyxFQUFFM0osT0FBSyxDQUFDK0g7QUFBbEIsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFL0gsT0FBSyxDQUFDa0Q7QUFBbEIsS0FBNkJBLFFBQVEsSUFBSUEsUUFBekMsTUFERixFQUVOLGVBQ1cwRixPQUFPLEtBQUssQ0FBWixJQUFpQixxQkFENUIsRUFFV0YsS0FBSyxLQUFLLENBQVYsSUFBZUUsT0FBTyxHQUFHLENBQXpCLElBQThCLGVBQU1BLE9BQU4sa0JBRnpDLEVBR1dGLEtBQUssR0FBRyxDQUFSLElBQWFGLElBQUksS0FBSyxDQUF0QixJQUNDLGVBQ0dFLEtBREgsYUFDaUJFLE9BRGpCLGtCQUNzQyxHQUR0QyxDQUpaLEVBUVdKLElBQUksSUFBSSxFQUFSLElBQWNBLElBQUksR0FBRyxDQUFyQixJQUEwQixlQUFNQSxJQUFOLGNBUnJDLENBRk0sQ0FURixDQURGLENBREY7QUE0QkQ7O0FDbkVjLFNBQVNvQixhQUFULENBQXVCO0FBQUU5SCxFQUFBQSxPQUFGO0FBQVcrSCxFQUFBQSxXQUFYO0FBQXdCQyxFQUFBQSxhQUF4QjtBQUF1Q0MsRUFBQUEsU0FBdkM7QUFBa0RsRSxFQUFBQTtBQUFsRCxDQUF2QixFQUFvRjtBQUNqRyxTQUNFLGVBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBTyxJQUFBLElBQUksRUFBQyxNQUFaO0FBQW1CLElBQUEsS0FBSyxFQUFDLGNBQXpCO0FBQXlDLGtCQUFXLHNCQUFwRDtBQUEyRSx3QkFBaUIsZUFBNUY7QUFBNEcsSUFBQSxRQUFRLEVBQUVpRSxhQUF0SDtBQUFxSSxtQkFBWSxlQUFqSjtBQUFpSyxJQUFBLEtBQUssRUFBRUQ7QUFBeEssSUFERixFQUVFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUMsMkJBQWxCO0FBQThDLElBQUEsSUFBSSxFQUFDLFFBQW5EO0FBQTRELElBQUEsT0FBTyxFQUFFL0gsT0FBckU7QUFBOEUsSUFBQSxRQUFRLEVBQUUrRCxPQUFPLElBQUlBLE9BQU8sQ0FBQy9ILEtBQVIsS0FBa0IsU0FBckg7QUFBZ0ksSUFBQSxFQUFFLEVBQUMsU0FBbkk7QUFBNkksSUFBQSxPQUFPLEVBQUVpTSxTQUF0SjtBQUFpSyxtQkFBWTtBQUE3SyxZQURGLENBRkYsQ0FERixDQURGO0FBVUQ7O0FDbkNELE1BQU0vSixPQUFLLEdBQUc7QUFDVlksRUFBQUEsS0FBSyxFQUFFLEtBREc7QUFFVjBILEVBQUFBLEtBQUssRUFBRSxPQUZHO0FBR1ZySSxFQUFBQSxLQUFLLEVBQUUsTUFIRztBQUlWb0ksRUFBQUEsUUFBUSxFQUFFLEVBSkE7QUFLVnhILEVBQUFBLFNBQVMsRUFBRTtBQUxELENBQWQ7QUFPTyxTQUFTbUosY0FBVCxDQUF3QjtBQUFFekksRUFBQUE7QUFBRixDQUF4QixFQUFxQztBQUN4QyxTQUFPO0FBQUssSUFBQSxLQUFLLEVBQUV2QixPQUFaO0FBQW1CLG1CQUFZO0FBQS9CLEtBQWtEdUIsT0FBTyxDQUFDb0ksSUFBMUQsQ0FBUDtBQUNIOztBQ1RELE1BQU0zSixPQUFLLEdBQUc7QUFDVlksRUFBQUEsS0FBSyxFQUFFLEtBREc7QUFFVjBILEVBQUFBLEtBQUssRUFBRSxPQUZHO0FBR1ZySSxFQUFBQSxLQUFLLEVBQUUsTUFIRztBQUlWb0ksRUFBQUEsUUFBUSxFQUFFLEVBSkE7QUFLVnhILEVBQUFBLFNBQVMsRUFBRTtBQUxELENBQWQ7QUFPTyxTQUFTb0osY0FBVCxDQUF3QjtBQUFFMUksRUFBQUEsT0FBRjtBQUFVbUYsRUFBQUE7QUFBVixDQUF4QixFQUFrRDtBQUNyRCxXQUFTd0QsZ0JBQVQsQ0FBMEJqTixDQUExQixFQUE0QjtBQUN4QkEsSUFBQUEsQ0FBQyxDQUFDa04sY0FBRjtBQUNBekQsSUFBQUEsWUFBWSxDQUFDekosQ0FBRCxDQUFaO0FBQ0g7O0FBQ0Q7QUFDQSxTQUFPO0FBQUssSUFBQSxLQUFLLEVBQUUrQyxPQUFaO0FBQW1CLG1CQUFZO0FBQS9CLEtBQWtEdUIsT0FBTyxDQUFDb0ksSUFBMUQsRUFDUDtBQUFHLElBQUEsRUFBRSxFQUFDLFNBQU47QUFBZ0IsbUJBQVksYUFBNUI7QUFBMEMsSUFBQSxJQUFJLEVBQUMsR0FBL0M7QUFBbUQsSUFBQSxPQUFPLEVBQUVPO0FBQTVELGdCQURPLENBQVA7QUFHSDs7QUNWRCxNQUFNekYsUUFBTSxHQUFHO0FBQ2IyRixFQUFBQSxnQkFBZ0IsRUFBRTtBQUNoQjtBQUNBbkYsSUFBQUEsU0FBUyxFQUFFLFlBRks7QUFHaEJwQyxJQUFBQSxPQUFPLEVBQUUsQ0FITztBQUlsQjtBQUNFdUMsSUFBQUEsSUFBSSxFQUFFLENBTFU7QUFNaEJpRixJQUFBQSxTQUFTLEVBQUUsTUFOSztBQU9oQkMsSUFBQUEsU0FBUyxFQUFFO0FBUEs7QUFETCxDQUFmO0FBWWUsU0FBU0MsUUFBVCxDQUFrQjtBQUMvQkMsRUFBQUEsUUFEK0I7QUFFL0JULEVBQUFBLFNBRitCO0FBRy9CRCxFQUFBQSxhQUgrQjtBQUkvQkQsRUFBQUEsV0FKK0I7QUFLL0IzRyxFQUFBQSxRQUwrQjtBQU0vQjJDLEVBQUFBLE9BTitCO0FBTy9CYSxFQUFBQSxZQVArQjtBQVEvQjVFLEVBQUFBO0FBUitCLENBQWxCLEVBU1o7QUFDRCxRQUFNMkksV0FBVyxHQUFHQyxDQUFNLENBQUMsSUFBRCxDQUExQjtBQUNGLFFBQU07QUFBQ3BELElBQUFBO0FBQUQsTUFBU04sYUFBYSxFQUE1QjtBQUVFdEgsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJOEssUUFBSixFQUFjO0FBQ1pDLE1BQUFBLFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkMsU0FBcEIsR0FBZ0NILFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkUsWUFBcEQ7QUFDRDtBQUNGLEdBSlEsRUFJTixDQUFDTCxRQUFELENBSk0sQ0FBVDs7QUFNQSxXQUFTTSxNQUFULENBQWdCN04sQ0FBaEIsRUFBbUI7QUFDakI4TSxJQUFBQSxTQUFTLENBQUM5TSxDQUFELENBQVQ7QUFDQXdOLElBQUFBLFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkMsU0FBcEIsR0FBZ0NILFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkUsWUFBcEQ7QUFDRDs7QUFDRCxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRTVGLE1BQUFBLFNBQVMsRUFBRSxZQUFiO0FBQTJCaEYsTUFBQUEsS0FBSyxFQUFFLE1BQWxDO0FBQTBDQyxNQUFBQSxNQUFNLEVBQUUsTUFBbEQ7QUFBMERhLE1BQUFBLE9BQU8sRUFBRSxNQUFuRTtBQUEyRW1ELE1BQUFBLGFBQWEsRUFBRTtBQUExRjtBQUFaLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRSxFQUFDLEdBQUdPLFFBQU0sQ0FBQzJGLGdCQUFYO0FBQTRCaEYsTUFBQUEsSUFBSSxFQUFFa0MsTUFBTSxLQUFHLE9BQVQsR0FBaUIsQ0FBakIsR0FBbUI7QUFBckQsS0FBWjtBQUFxRSxJQUFBLEdBQUcsRUFBRW1EO0FBQTFFLEtBQ0dELFFBQVEsSUFDUEEsUUFBUSxDQUFDTyxNQUFULEdBQWtCLENBRG5CLElBRUNDLGFBQWEsQ0FBQztBQUFFUixJQUFBQSxRQUFRLEVBQUVTLFlBQVksQ0FBQztBQUFFVCxNQUFBQTtBQUFGLEtBQUQsQ0FBeEI7QUFBd0N0SCxJQUFBQTtBQUF4QyxHQUFELENBQWIsQ0FBa0VnSSxHQUFsRSxDQUNHOU4sQ0FBRCxJQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRTJELE1BQUFBLE9BQU8sRUFBRTtBQUFYO0FBQVosS0FDRyxHQURILEVBRUcsQ0FBQzNELENBQUMsQ0FBQ1ksSUFBSCxJQUFXLEVBQUNrRCxTQUFEO0FBQVMsSUFBQSxPQUFPLEVBQUU5RDtBQUFsQixJQUZkLEVBR0dBLENBQUMsQ0FBQ1ksSUFBRixJQUFVWixDQUFDLENBQUNZLElBQUYsS0FBVyxTQUFyQixJQUFrQyxFQUFDLGNBQUQ7QUFBZ0IsSUFBQSxPQUFPLEVBQUVaO0FBQXpCLElBSHJDLEVBSUdBLENBQUMsQ0FBQ1ksSUFBRixJQUFVWixDQUFDLENBQUNZLElBQUYsS0FBVyxTQUFyQixJQUFrQyxFQUFDLGNBQUQ7QUFBZ0IsSUFBQSxPQUFPLEVBQUVaLENBQXpCO0FBQTRCLElBQUEsWUFBWSxFQUFFc0o7QUFBMUMsSUFKckMsQ0FGSixDQUhKLENBREYsRUFnQkksRUFBQyxhQUFEO0FBQ0MsSUFBQSxPQUFPLEVBQUU1RSxPQURWO0FBRUUsSUFBQSxPQUFPLEVBQUUrRCxPQUZYO0FBR0UsSUFBQSxTQUFTLEVBQUVpRixNQUhiO0FBSUUsSUFBQSxXQUFXLEVBQUVqQixXQUpmO0FBS0UsSUFBQSxhQUFhLEVBQUVDO0FBTGpCLElBaEJKLENBREY7QUE0QkQ7O0FBQ0QsU0FBU2tCLGFBQVQsQ0FBdUI7QUFBRVIsRUFBQUEsUUFBRjtBQUFZdEgsRUFBQUE7QUFBWixDQUF2QixFQUErQztBQUM3QyxNQUFJc0gsUUFBUSxJQUFJQSxRQUFRLENBQUNPLE1BQVQsR0FBa0IsQ0FBOUIsSUFBbUM3SCxRQUF2QyxFQUFpRDtBQUMvQyxXQUFPc0gsUUFBUSxDQUFDVSxHQUFULENBQWNDLEdBQUQsSUFBUztBQUMzQixVQUFJQSxHQUFHLENBQUNqSSxRQUFKLEtBQWlCQSxRQUFyQixFQUErQjtBQUM3QixlQUFPLEVBQUUsR0FBR2lJLEdBQUw7QUFBVTdDLFVBQUFBLEtBQUssRUFBRSxPQUFqQjtBQUEwQnBGLFVBQUFBLFFBQVEsRUFBRTtBQUFwQyxTQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxFQUFFLEdBQUdpSSxHQUFMO0FBQVU3QyxVQUFBQSxLQUFLLEVBQUU7QUFBakIsU0FBUDtBQUNEO0FBQ0YsS0FOTSxDQUFQO0FBT0QsR0FSRCxNQVFPO0FBQ0wsV0FBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFDRCxTQUFTMkMsWUFBVCxDQUFzQjtBQUFFVCxFQUFBQTtBQUFGLENBQXRCLEVBQW9DO0FBQ2xDLE1BQUlBLFFBQUosRUFBYztBQUNaLFdBQU9BLFFBQVEsQ0FBQ1ksSUFBVCxFQUFQO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTyxJQUFQO0FBQ0Q7QUFDRjs7QUNwRmMsU0FBU0MsUUFBVCxDQUFrQjtBQUMvQnZKLEVBQUFBLE9BRCtCO0FBRS9CMEksRUFBQUEsUUFBUSxHQUFHLEVBRm9CO0FBRy9CVixFQUFBQSxhQUgrQjtBQUkvQkMsRUFBQUEsU0FKK0I7QUFLL0JGLEVBQUFBLFdBTCtCO0FBTS9CM0csRUFBQUEsUUFOK0I7QUFPL0IyQyxFQUFBQSxPQVArQjtBQVEvQmEsRUFBQUE7QUFSK0IsQ0FBbEIsRUFVWjtBQUVEaEgsRUFBQUEsR0FBUyxDQUFDLE1BQUk7QUFDWjRMLElBQUFBLFFBQVEsQ0FBQzVKLEtBQVQsR0FBZW1FLE9BQU8sQ0FBQzNDLFFBQXZCO0FBRUQsR0FIUSxFQUdQLEVBSE8sQ0FBVDtBQUtBLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxLQUNFLEVBQUMsUUFBRDtBQUNBLElBQUEsT0FBTyxFQUFFcEIsT0FEVDtBQUVBLElBQUEsWUFBWSxFQUFFNEUsWUFGZDtBQUdFLElBQUEsT0FBTyxFQUFFYixPQUhYO0FBSUUsSUFBQSxRQUFRLEVBQUUyRSxRQUpaO0FBS0UsSUFBQSxTQUFTLEVBQUVULFNBTGI7QUFNRSxJQUFBLGFBQWEsRUFBRUQsYUFOakI7QUFPRSxJQUFBLFdBQVcsRUFBR0QsV0FQaEI7QUFRRSxJQUFBLFFBQVEsRUFBRTNHO0FBUlosSUFERixDQURGO0FBY0Q7O0FDaENlLFNBQVNxSSxJQUFULENBQWNyTSxLQUFkLEVBQXFCO0FBQ25DLFNBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQWdDQSxLQUFoQyxFQURGO0FBR0Q7O0FBR0EsU0FBU3NNLFFBQVQsQ0FBa0J0TSxLQUFsQixFQUF5QjtBQUV4QixTQUNFO0FBQVEsSUFBQSxJQUFJLEVBQUMsUUFBYjtBQUFzQixJQUFBLFNBQVMsRUFBQztBQUFoQyxLQUE2RUEsS0FBN0UsRUFERjtBQUdEOztBQ0ljLFNBQVN1TSxPQUFULENBQWlCO0FBQzlCQyxFQUFBQSxRQUQ4QjtBQUU5QkMsRUFBQUEsYUFGOEI7QUFHOUJDLEVBQUFBLGVBSDhCO0FBSTlCQyxFQUFBQSxlQUo4QjtBQUs5QkMsRUFBQUE7QUFMOEIsQ0FBakIsRUFNWjtBQUNELFFBQU07QUFBRWxOLElBQUFBO0FBQUYsTUFBaUJILFdBQVcsRUFBbEM7O0FBQ0EsV0FBU3NOLHNCQUFULENBQWdDOU8sQ0FBaEMsRUFBbUM7QUFDakMsVUFBTTJILEVBQUUsR0FBRzNILENBQUMsQ0FBQytPLE1BQUYsQ0FBU3BILEVBQXBCO0FBQ0FpSCxJQUFBQSxlQUFlLENBQUM1TyxDQUFELENBQWY7QUFDQSxVQUFNNEksT0FBTyxHQUFHNkYsUUFBUSxDQUFDcE0sSUFBVCxDQUFjNUIsQ0FBQyxJQUFJQSxDQUFDLENBQUN3RixRQUFGLEtBQWUwQixFQUFsQyxDQUFoQjtBQUVBaEcsSUFBQUEsVUFBVSxDQUFDO0FBQUVWLE1BQUFBLFlBQVksRUFBRyxJQUFHMkgsT0FBTyxDQUFDL0gsS0FBTSxFQUFsQztBQUFxQ0csTUFBQUEsS0FBSyxFQUFFO0FBQTVDLEtBQUQsQ0FBVjtBQUNEOztBQUdELFNBRUUsZUFFRTtBQUFLLElBQUEsS0FBSyxFQUFDO0FBQVgsS0FDRTtBQUFPLElBQUEsS0FBSyxFQUFFNk4sTUFBZDtBQUFzQixJQUFBLEVBQUUsRUFBQyxjQUF6QjtBQUF3QyxJQUFBLFFBQVEsRUFBRUgsYUFBbEQ7QUFBaUUsSUFBQSxJQUFJLEVBQUMsTUFBdEU7QUFBNkUsSUFBQSxTQUFTLEVBQUMsY0FBdkY7QUFBc0csa0JBQVcsc0JBQWpIO0FBQXdJLHdCQUFpQjtBQUF6SixJQURGLEVBRUU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBQywyQkFBbEI7QUFBOEMsSUFBQSxJQUFJLEVBQUMsUUFBbkQ7QUFBNEQsSUFBQSxFQUFFLEVBQUMsZUFBL0Q7QUFBK0UsSUFBQSxPQUFPLEVBQUVDLGVBQXhGO0FBQXlHLG1CQUFZLFlBQXJIO0FBQWtJLElBQUEsUUFBUSxFQUFFLENBQUNFO0FBQTdJLGNBREYsQ0FGRixDQUZGLEVBUUUsRUFBQyxJQUFEO0FBQU0sSUFBQSxFQUFFLEVBQUM7QUFBVCxLQUNHSixRQUFRLElBQ1BBLFFBQVEsQ0FBQ1gsTUFBVCxHQUFrQixDQURuQixJQUVDVyxRQUFRLENBQUNSLEdBQVQsQ0FBY3hOLENBQUQsSUFBTztBQUNsQixXQUNFLEVBQUMsUUFBRDtBQUFVLE1BQUEsRUFBRSxFQUFFQSxDQUFDLENBQUN3RixRQUFoQjtBQUEwQixxQkFBYXhGLENBQUMsQ0FBQ3dGLFFBQXpDO0FBQW1ELE1BQUEsT0FBTyxFQUFFNkk7QUFBNUQsT0FDR3JPLENBQUMsQ0FBQ3dGLFFBREwsQ0FERjtBQUtELEdBTkQsQ0FISixDQVJGLENBRkY7QUF3QkQ7O0FDN0RjLFNBQVMrSSxhQUFULENBQXVCO0FBQ3BDL0wsRUFBQUEsTUFBTSxHQUFHLEVBRDJCO0FBRXBDRCxFQUFBQSxLQUFLLEdBQUcsRUFGNEI7QUFHcENXLEVBQUFBLEtBQUssR0FBRyxPQUg0QjtBQUlwQzZFLEVBQUFBLElBQUksR0FBRyxPQUo2QjtBQUtwQ3pGLEVBQUFBO0FBTG9DLENBQXZCLEVBTVo7QUFDRCxTQUNFO0FBQUssSUFBQSxNQUFNLEVBQUVFLE1BQWI7QUFBcUIsSUFBQSxPQUFPLEVBQUMsV0FBN0I7QUFBeUMsSUFBQSxLQUFLLEVBQUVELEtBQWhEO0FBQXVELElBQUEsS0FBSyxFQUFFRDtBQUE5RCxLQUNFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRXlGO0FBQTlCLElBREYsRUFFRTtBQUNFLElBQUEsSUFBSSxFQUFFN0UsS0FEUjtBQUVFLElBQUEsQ0FBQyxFQUFDO0FBRkosSUFGRixDQURGO0FBU0Q7O0FDWEQsTUFBTVosT0FBSyxHQUFHO0FBQ1pnRixFQUFBQSxNQUFNLEVBQUU7QUFDTmpFLElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU5tRCxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdOakQsSUFBQUEsY0FBYyxFQUFFO0FBSFY7QUFESSxDQUFkOztBQVFlLFNBQVNpTCxNQUFULENBQWdCO0FBQUVyRyxFQUFBQSxPQUFGO0FBQVdzRyxFQUFBQSxRQUFYO0FBQXFCckMsRUFBQUEsYUFBckI7QUFBbUNELEVBQUFBLFdBQW5DO0FBQWdEL0gsRUFBQUE7QUFBaEQsQ0FBaEIsRUFBMkU7QUFHeEYsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRTlCLE9BQUssQ0FBQ2dGLE1BQXJCO0FBQTRCLElBQUEsRUFBRSxFQUFDO0FBQS9CLEtBQ0UsRUFBQyxNQUFELFFBQ0UsRUFBQ29ILGFBQUQ7QUFBVyxJQUFBLEtBQUssRUFBQztBQUFqQixJQURGLENBREYsRUFJRSxFQUFDLE1BQUQsb0NBQzBCLGFBQUl2RyxPQUFPLElBQUlBLE9BQU8sQ0FBQzFDLEtBQXZCLENBRDFCLENBSkYsRUFPRSxFQUFDLFNBQUQ7QUFBVyxJQUFBLEVBQUUsRUFBQyxrQkFBZDtBQUFpQyxJQUFBLFFBQVEsRUFBRTJHLGFBQTNDO0FBQTBELElBQUEsS0FBSyxFQUFFRDtBQUFqRSxJQVBGLEVBUUUsRUFBQyxNQUFELFFBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxPQUFPLEVBQUUvSCxPQUFqQjtBQUEyQixJQUFBLEVBQUUsRUFBQyxRQUE5QjtBQUF1QyxJQUFBLE9BQU8sRUFBRXFLLFFBQWhEO0FBQTBELG1CQUFZLGNBQXRFO0FBQXFGLElBQUEsS0FBSyxFQUFDLGFBQTNGO0FBQXlHLElBQUEsRUFBRSxFQUFDO0FBQTVHLElBREYsQ0FSRixDQURGO0FBY0Q7O0FDN0JNLFNBQVNFLElBQVQsQ0FBYztBQUNuQm5NLEVBQUFBLE1BQU0sR0FBRyxFQURVO0FBRW5CRCxFQUFBQSxLQUFLLEdBQUcsRUFGVztBQUduQndGLEVBQUFBLElBQUksR0FBRyxNQUhZO0FBSW5CN0UsRUFBQUEsS0FBSyxHQUFHLE9BSlc7QUFLbkJaLEVBQUFBO0FBTG1CLENBQWQsRUFNSjtBQUNELFNBQ0U7QUFBSyxJQUFBLE1BQU0sRUFBRUUsTUFBYjtBQUFxQixJQUFBLE9BQU8sRUFBQyxXQUE3QjtBQUF5QyxJQUFBLEtBQUssRUFBRUQsS0FBaEQ7QUFBdUQsSUFBQSxLQUFLLEVBQUVEO0FBQTlELEtBQ0U7QUFBTSxJQUFBLENBQUMsRUFBQyxlQUFSO0FBQXdCLElBQUEsSUFBSSxFQUFFeUY7QUFBOUIsSUFERixFQUVFO0FBQ0UsSUFBQSxJQUFJLEVBQUU3RSxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQUZGLENBREY7QUFTRDs7QUNiRCxNQUFNWixPQUFLLEdBQUc7QUFDWmdGLEVBQUFBLE1BQU0sRUFBRTtBQUNOakUsSUFBQUEsT0FBTyxFQUFFLE1BREg7QUFFTm1ELElBQUFBLGFBQWEsRUFBRSxRQUZUO0FBR05qRCxJQUFBQSxjQUFjLEVBQUU7QUFIVjtBQURJLENBQWQ7QUFPZSxTQUFTcUwsT0FBVCxDQUFpQjtBQUFFekcsRUFBQUEsT0FBRjtBQUFVbkgsRUFBQUE7QUFBVixDQUFqQixFQUF1QztBQUdwRCxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFFc0IsT0FBSyxDQUFDZ0YsTUFBckI7QUFBNkIsSUFBQSxFQUFFLEVBQUM7QUFBaEMsS0FDRSxFQUFDLE1BQUQsUUFDRSxFQUFDLElBQUQ7QUFBTSxJQUFBLEtBQUssRUFBQyxJQUFaO0FBQWlCLElBQUEsTUFBTSxFQUFDLElBQXhCO0FBQTZCLElBQUEsS0FBSyxFQUFDO0FBQW5DLElBREYsQ0FERixFQUlFLEVBQUMsTUFBRCxRQUNFLCtDQUNnQyxhQUFJYSxPQUFPLElBQUlBLE9BQU8sQ0FBQzFDLEtBQXZCLENBRGhDLDJDQURGLENBSkYsQ0FERjtBQWFEOztBQ3hCRCxNQUFNbkQsT0FBSyxHQUFHO0FBQ1owRSxFQUFBQSxJQUFJLEVBQUU7QUFDSjNELElBQUFBLE9BQU8sRUFBRSxNQURMO0FBRUptRCxJQUFBQSxhQUFhLEVBQUUsUUFGWDtBQUdKakUsSUFBQUEsS0FBSyxFQUFFLE1BSEg7QUFJSkMsSUFBQUEsTUFBTSxFQUFFLE1BSko7QUFLSmdGLElBQUFBLFVBQVUsRUFBRSxFQUxSO0FBTUpELElBQUFBLFNBQVMsRUFBRSxZQU5QO0FBT0poRSxJQUFBQSxjQUFjLEVBQUUsZUFQWjtBQVFKc0wsSUFBQUEsYUFBYSxFQUFDO0FBUlY7QUFETSxDQUFkO0FBY2UsU0FBU0MsT0FBVCxDQUFpQjtBQUFFM0csRUFBQUEsT0FBRjtBQUFXNEcsRUFBQUEsUUFBWDtBQUFxQkMsRUFBQUEsU0FBckI7QUFBK0I1SyxFQUFBQTtBQUEvQixDQUFqQixFQUEyRDtBQUV4RSxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDO0FBQVgsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFOUIsT0FBSyxDQUFDMEU7QUFBbEIsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVpSSxNQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQjVMLE1BQUFBLE9BQU8sRUFBQztBQUF6QjtBQUFaLEtBQ0c4RSxPQUFPLElBQUlBLE9BQU8sQ0FBQ3RFLE9BQW5CLElBQ0MsRUFBQ0wsU0FBRDtBQUNFLElBQUEsT0FBTyxFQUNMMkUsT0FBTyxJQUNQQSxPQUFPLENBQUN0RSxPQURSLElBQ21CLEVBQ2pCLEdBQUdzRSxPQUFPLENBQUN0RSxPQURNO0FBRWpCMkIsTUFBQUEsUUFBUSxFQUFFMkMsT0FBTyxDQUFDM0MsUUFGRDtBQUVVb0YsTUFBQUEsS0FBSyxFQUFDO0FBRmhCO0FBSHZCLElBRkosQ0FERixFQWVFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNBLEVBQUMsTUFBRDtBQUNFLElBQUEsRUFBRSxFQUFDLFNBREw7QUFFRSxJQUFBLE9BQU8sRUFBRW9FLFNBRlg7QUFHRSxtQkFBWSxhQUhkO0FBSUUsSUFBQSxLQUFLLEVBQUMsU0FKUjtBQUtFLElBQUEsS0FBSyxNQUxQO0FBTUUsSUFBQSxFQUFFLEVBQUMsUUFOTDtBQU9FLElBQUEsT0FBTztBQVBULElBREEsQ0FERixFQWFDO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNBLEVBQUMsTUFBRDtBQUNHLElBQUEsRUFBRSxFQUFDLFFBRE47QUFFRyxJQUFBLE9BQU8sRUFBRUQsUUFGWjtBQUdHLG1CQUFZLFlBSGY7QUFJRyxJQUFBLE9BQU8sRUFBRTNLLE9BSlo7QUFLRyxJQUFBLEtBQUssRUFBQyxRQUxUO0FBTUcsSUFBQSxFQUFFLEVBQUMsU0FOTjtBQVFHLElBQUEsS0FBSztBQVJSLElBREEsQ0FiRCxDQWZGLENBREYsQ0FERjtBQWdERDs7QUNwRU0sU0FBUzhLLHFCQUFULENBQStCO0FBQUNDLEVBQUFBO0FBQUQsQ0FBL0IsRUFBZ0Q7QUFDbkQsU0FBT0EsY0FBYyxDQUFDQyxNQUFmLENBQXNCLENBQUNDLFdBQUQsRUFBY3BDLE9BQWQsRUFBdUJxQyxLQUF2QixLQUFpQztBQUMxRCxRQUFJQSxLQUFLLEtBQUssQ0FBZCxFQUFpQjtBQUNmLGFBQVFELFdBQVcsR0FBRyxDQUFDLEVBQUUsR0FBR3BDLE9BQUw7QUFBY3NDLFFBQUFBLFlBQVksRUFBRTtBQUE1QixPQUFELENBQXRCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTUMsR0FBRyxHQUFHSCxXQUFXLENBQUN6TixJQUFaLENBQ1RwQyxDQUFELElBQU9BLENBQUMsQ0FBQ2dHLFFBQUYsS0FBZXlILE9BQU8sQ0FBQ3pILFFBQXZCLElBQW1DeUgsT0FBTyxDQUFDN00sS0FBUixLQUFrQixXQURsRCxDQUFaOztBQUdBLFVBQUlvUCxHQUFKLEVBQVM7QUFDUCxjQUFNRixLQUFLLEdBQUdELFdBQVcsQ0FBQ0ksU0FBWixDQUNYalEsQ0FBRCxJQUFPQSxDQUFDLENBQUNnRyxRQUFGLEtBQWV5SCxPQUFPLENBQUN6SCxRQURsQixDQUFkLENBRE87O0FBS1A2SixRQUFBQSxXQUFXLENBQUNLLE1BQVosQ0FBbUJKLEtBQW5CLEVBQTBCLENBQTFCLEVBQTZCLEVBQzNCLEdBQUdFLEdBRHdCO0FBRTNCRCxVQUFBQSxZQUFZLEVBQUUsRUFBRUMsR0FBRyxDQUFDRDtBQUZPLFNBQTdCO0FBSUQsT0FURCxNQVNPO0FBQ0w7QUFDQUYsUUFBQUEsV0FBVyxDQUFDTSxJQUFaLENBQWlCLEVBQUUsR0FBRzFDLE9BQUw7QUFBY3NDLFVBQUFBLFlBQVksRUFBRTtBQUE1QixTQUFqQjtBQUNEO0FBQ0Y7O0FBQ0QsV0FBT0YsV0FBUDtBQUNELEdBdEJJLEVBc0JGLEVBdEJFLENBQVA7QUF1Qkg7O0FDcEJjLFNBQVNPLGNBQVQsQ0FBd0I7QUFBRVQsRUFBQUEsY0FBRjtBQUFpQlUsRUFBQUEsY0FBakI7QUFBZ0NDLEVBQUFBO0FBQWhDLENBQXhCLEVBQTBFO0FBRXZGLFFBQU0sQ0FBQ0MsS0FBRCxFQUFPQyxRQUFQLElBQWtCeEcsR0FBUSxDQUFDLEVBQUQsQ0FBaEM7QUFDRnhILEVBQUFBLEdBQVMsQ0FBQyxNQUFJO0FBQ2QsUUFBR21OLGNBQUgsRUFBa0I7QUFFaEIsWUFBTWMsT0FBTyxHQUFFZixxQkFBcUIsQ0FBQztBQUFDQyxRQUFBQTtBQUFELE9BQUQsQ0FBcEM7QUFFQWEsTUFBQUEsUUFBUSxDQUFDQyxPQUFELENBQVI7QUFDRDtBQUVBLEdBUlEsRUFRUCxDQUFDZCxjQUFELENBUk8sQ0FBVDtBQVVFLFNBQ0U7QUFBSyxtQkFBWTtBQUFqQixLQUNFLEVBQUMsSUFBRCxRQUNHWSxLQUFLLElBQ0pBLEtBQUssQ0FBQzFDLE1BQU4sR0FBZSxDQURoQixJQUVDMEMsS0FBSyxDQUFDdkMsR0FBTixDQUFXdE8sQ0FBRCxJQUFPO0FBRWpCLFdBQVE7QUFBSyxNQUFBLEtBQUssRUFBRTtBQUFDbUUsUUFBQUEsT0FBTyxFQUFDO0FBQVQ7QUFBWixPQUNOLEVBQUMsUUFBRDtBQUFVLE1BQUEsT0FBTyxFQUFFd00sY0FBbkI7QUFBbUMsTUFBQSxFQUFFLEVBQUUzUSxDQUFDLENBQUNzRyxRQUF6QztBQUFtRCxNQUFBLEtBQUssRUFBRTtBQUFDa0MsUUFBQUEsSUFBSSxFQUFDO0FBQU4sT0FBMUQ7QUFBb0UscUJBQWMsR0FBRXhJLENBQUMsQ0FBQ3NHLFFBQVM7QUFBL0YsT0FBMEd0RyxDQUFDLENBQUNzRyxRQUE1RyxpQkFBaUl0RyxDQUFDLENBQUNxUSxZQUFuSSxDQURNLEVBRU4sRUFBQyxRQUFEO0FBQVUsTUFBQSxPQUFPLEVBQUVPLGNBQW5CO0FBQW1DLE1BQUEsRUFBRSxFQUFFNVEsQ0FBQyxDQUFDc0csUUFBekM7QUFBbUQsTUFBQSxLQUFLLEVBQUU7QUFBQ3RDLFFBQUFBLEtBQUssRUFBQztBQUFQLE9BQTFEO0FBQXlFLHFCQUFjLEdBQUVoRSxDQUFDLENBQUNzRyxRQUFTO0FBQXBHLFdBRk0sQ0FBUjtBQUlDLEdBTkQsQ0FISixDQURGLENBREY7QUFlRDs7QUNoQ00sTUFBTXNILFFBQVEsR0FBRSxDQUNuQjtBQUNBdEgsRUFBQUEsUUFBUSxFQUFDLE9BRFQ7QUFFQXlHLEVBQUFBLElBQUksRUFBRyx3QkFGUDtBQUdBcEIsRUFBQUEsU0FBUyxFQUFFO0FBSFgsQ0FEbUIsRUFNcEI7QUFDQ3JGLEVBQUFBLFFBQVEsRUFBQyxNQURWO0FBRUN5RyxFQUFBQSxJQUFJLEVBQUcsMkJBRlI7QUFHQ3BCLEVBQUFBLFNBQVMsRUFBRTtBQUhaLENBTm9CLEVBVW5CO0FBQ0FyRixFQUFBQSxRQUFRLEVBQUMsT0FEVDtBQUVBeUcsRUFBQUEsSUFBSSxFQUFHLGtCQUZQO0FBR0FwQixFQUFBQSxTQUFTLEVBQUU7QUFIWCxDQVZtQixFQWVyQjtBQUNFckYsRUFBQUEsUUFBUSxFQUFDLE9BRFg7QUFFRXlHLEVBQUFBLElBQUksRUFBRyxtQkFGVDtBQUdFcEIsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0FmcUIsRUFvQnJCO0FBQ0VyRixFQUFBQSxRQUFRLEVBQUMsTUFEWDtBQUVFeUcsRUFBQUEsSUFBSSxFQUFHLHVCQUZUO0FBR0VwQixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQXBCcUIsR0EwQnJCO0FBQ0VyRixFQUFBQSxRQUFRLEVBQUMsTUFEWDtBQUVFeUcsRUFBQUEsSUFBSSxFQUFHLHNCQUZUO0FBR0VwQixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQTFCcUIsRUErQnJCO0FBQ0VyRixFQUFBQSxRQUFRLEVBQUMsTUFEWDtBQUVFeUcsRUFBQUEsSUFBSSxFQUFHLHNCQUZUO0FBR0VwQixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQS9CcUIsRUFvQ3JCO0FBQ0VyRixFQUFBQSxRQUFRLEVBQUMsT0FEWDtBQUVFeUcsRUFBQUEsSUFBSSxFQUFHLFVBRlQ7QUFHRXBCLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBcENxQixFQXlDckI7QUFDRXJGLEVBQUFBLFFBQVEsRUFBQyxPQURYO0FBRUV5RyxFQUFBQSxJQUFJLEVBQUcsVUFGVDtBQUdFcEIsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0F6Q3FCLEVBOENyQjtBQUNFckYsRUFBQUEsUUFBUSxFQUFDLE9BRFg7QUFFRXlHLEVBQUFBLElBQUksRUFBRyxVQUZUO0FBR0VwQixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQTlDcUIsRUFtRHJCO0FBQ0VyRixFQUFBQSxRQUFRLEVBQUMsT0FEWDtBQUVFeUcsRUFBQUEsSUFBSSxFQUFHLFVBRlQ7QUFHRXBCLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBbkRxQixFQXdEckI7QUFDRXJGLEVBQUFBLFFBQVEsRUFBQyxPQURYO0FBRUV5RyxFQUFBQSxJQUFJLEVBQUcsVUFGVDtBQUdFcEIsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0F4RHFCLENBQWhCOztBQ1lQLE1BQU1tRCxRQUFRLEdBQUcsQ0FDYjtBQUFFeEksRUFBQUEsUUFBUSxFQUFFO0FBQVosQ0FEYSxFQUViO0FBQUVBLEVBQUFBLFFBQVEsRUFBRTtBQUFaLENBRmEsRUFHYjtBQUFFQSxFQUFBQSxRQUFRLEVBQUU7QUFBWixDQUhhLENBQWpCO0FBS0EsTUFBTTJDLE9BQU8sR0FBRztBQUNaM0MsRUFBQUEsUUFBUSxFQUFFLFVBREU7QUFFWkMsRUFBQUEsS0FBSyxFQUFFLGdCQUZLO0FBR1o1QixFQUFBQSxPQUFPLEVBQUU7QUFBRW9JLElBQUFBLElBQUksRUFBRyx3QkFBVDtBQUFrQ3BCLElBQUFBLFNBQVMsRUFBRTtBQUE3QztBQUhHLENBQWhCO0FBS0EsTUFBTWhILE9BQU8sR0FBRztBQUNaMkIsRUFBQUEsUUFBUSxFQUFFLE9BREU7QUFFWnlHLEVBQUFBLElBQUksRUFBRyx3QkFGSztBQUdacEIsRUFBQUEsU0FBUyxFQUFFO0FBSEMsQ0FBaEI7QUFPZSxTQUFTcUYsYUFBVCxHQUF5QjtBQUNwQyxTQUFPLENBQ0gsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUMsS0FBRDtBQUFPLElBQUEsUUFBUSxFQUFFbEM7QUFBakIsSUFESixDQURHLEVBSUgsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUMsT0FBRDtBQUFTLElBQUEsUUFBUSxFQUFFQTtBQUFuQixJQURKLENBSkcsRUFPSCxFQUFDLFFBQUQ7QUFBVSxJQUFBLElBQUksRUFBQztBQUFmLEtBQ0ksRUFBQyxTQUFEO0FBQVcsSUFBQSxRQUFRLEVBQUVBO0FBQXJCLElBREosQ0FQRyxFQVVILEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDSSxFQUFDLFFBQUQ7QUFBVSxJQUFBLE9BQU8sRUFBRTdGLE9BQW5CO0FBQTRCLElBQUEsUUFBUSxFQUFFMkUsUUFBdEM7QUFBZ0QsSUFBQSxRQUFRLEVBQUM7QUFBekQsSUFESixDQVZHLEVBYUgsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUMsT0FBRDtBQUFTLElBQUEsUUFBUSxFQUFFa0I7QUFBbkIsSUFESixDQWJHLEVBZ0JILEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDSSxFQUFDLE1BQUQ7QUFBUSxJQUFBLFFBQVEsRUFBRUE7QUFBbEIsSUFESixDQWhCRyxFQW1CRixFQUFDLFFBQUQ7QUFBVSxJQUFBLElBQUksRUFBQztBQUFmLEtBQ0csRUFBQyxPQUFEO0FBQVMsSUFBQSxRQUFRLEVBQUVBO0FBQW5CLElBREgsQ0FuQkUsRUFzQkgsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUMsT0FBRDtBQUFTLElBQUEsUUFBUSxFQUFFQTtBQUFuQixJQURKLENBdEJHLEVBeUJILEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDSSxFQUFDLGNBQUQ7QUFBZ0IsSUFBQSxjQUFjLEVBQUVBO0FBQWhDLElBREosQ0F6QkcsRUE0QkgsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRTdJLE1BQUFBLE9BQU8sRUFBRSxFQUFYO0FBQWV0QyxNQUFBQSxlQUFlLEVBQUU7QUFBaEM7QUFBWixLQUNJLEVBQUNXLFNBQUQ7QUFBUyxJQUFBLE9BQU8sRUFBRUssT0FBbEI7QUFBMkIsSUFBQSxRQUFRLEVBQUVzRSxPQUFPLENBQUMzQztBQUE3QyxJQURKLENBREosQ0E1QkcsRUFpQ0gsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNJLEVBQUMsUUFBRDtBQUFVLElBQUEsT0FBTyxFQUFFMkMsT0FBbkI7QUFBNEIsSUFBQSxRQUFRLEVBQUUyRSxRQUF0QztBQUFnRCxJQUFBLFFBQVEsRUFBQztBQUF6RCxJQURKLENBakNHLENBQVA7QUFzQ0g7O0FDM0REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSxTQUFTcUQsZUFBVCxHQUEyQjtBQUN4QyxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRTNOLE1BQUFBLE1BQU0sRUFBRTtBQUFWO0FBQVosS0FDRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLElBQUksRUFBQztBQUFmLEtBQ0UsZUFDRSxFQUFDLFlBQUQ7QUFBYyxJQUFBLE1BQU07QUFBcEIsSUFERixFQUVFLEVBQUMsWUFBRCxPQUZGLENBREYsQ0FERixFQVVFLEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDRSxFQUFDLFNBQUQsT0FERixDQVZGLEVBYUUsRUFBQyxjQUFELE9BYkYsRUFjRSxFQUFDNE4sZUFBRCxPQWRGLEVBZUUsRUFBQyxhQUFELE9BZkYsQ0FERjtBQW9CRDs7QUMzQ2MsU0FBU0MsTUFBVCxDQUFnQjdPLEtBQWhCLEVBQXVCO0FBQ2xDLFFBQU07QUFBRXlDLElBQUFBLEVBQUUsR0FBRyxPQUFQO0FBQWdCcU0sSUFBQUEsS0FBaEI7QUFBdUI3TyxJQUFBQTtBQUF2QixNQUFvQ0QsS0FBMUM7QUFDQSxTQUFPO0FBQUssSUFBQSxTQUFTLEVBQUcsa0NBQWlDeUMsRUFBRyxPQUFNQSxFQUFHO0FBQTlELEtBQ0g7QUFBRyxJQUFBLFNBQVMsRUFBQyxjQUFiO0FBQTRCLElBQUEsSUFBSSxFQUFDO0FBQWpDLEtBQXNDcU0sS0FBdEMsQ0FERyxFQUVIO0FBQVEsSUFBQSxTQUFTLEVBQUMsZ0JBQWxCO0FBQW1DLElBQUEsSUFBSSxFQUFDLFFBQXhDO0FBQWlELG1CQUFZLFVBQTdEO0FBQXdFLG1CQUFZLHlCQUFwRjtBQUE4RyxxQkFBYyx3QkFBNUg7QUFBcUoscUJBQWMsT0FBbks7QUFBMkssa0JBQVc7QUFBdEwsS0FDSTtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLElBREosQ0FGRyxFQUtFN08sUUFMRixDQUFQO0FBUUg7QUFHTSxTQUFTOE8sY0FBVCxDQUF3QjtBQUFDOU8sRUFBQUE7QUFBRCxDQUF4QixFQUFtQztBQUN0QyxTQUFPO0FBQUssSUFBQSxTQUFTLEVBQUMsMEJBQWY7QUFBMEMsSUFBQSxFQUFFLEVBQUM7QUFBN0MsS0FDRkEsUUFERSxDQUFQO0FBR0g7QUFJTSxTQUFTK08sU0FBVCxDQUFtQjtBQUFFL08sRUFBQUE7QUFBRixDQUFuQixFQUFpQztBQUNwQyxTQUFPO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCxLQUNGQSxRQURFLENBQVA7QUFHSDs7QUMxQmMsU0FBU2dQLFdBQVQsQ0FBcUJqUCxLQUFyQixFQUE0QjtBQUN2QyxRQUFNO0FBQUN3QyxJQUFBQSxLQUFEO0FBQU92QyxJQUFBQTtBQUFQLE1BQWlCRCxLQUF2QjtBQUNBLFNBQU87QUFBSSxJQUFBLFNBQVMsRUFBQztBQUFkLEtBQ0g7QUFBRyxJQUFBLFNBQVMsRUFBQywwQkFBYjtBQUF3QyxJQUFBLElBQUksRUFBQyxHQUE3QztBQUFpRCxJQUFBLEVBQUUsRUFBQyxnQkFBcEQ7QUFBcUUsSUFBQSxJQUFJLEVBQUMsUUFBMUU7QUFBbUYsbUJBQVksVUFBL0Y7QUFBMEcscUJBQWMsTUFBeEg7QUFBK0gscUJBQWM7QUFBN0ksS0FBd0pBLEtBQXhKLEdBQ0t3QyxLQURMLENBREcsRUFJRnZDLFFBSkUsQ0FBUDtBQU1IO0FBR00sU0FBU2lQLFlBQVQsQ0FBc0JsUCxLQUF0QixFQUE2QjtBQUNoQyxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBZUQsS0FBckI7QUFDQSxTQUFPO0FBQUssSUFBQSxTQUFTLEVBQUMsZUFBZjtBQUErQix1QkFBZ0I7QUFBL0MsS0FDRkMsUUFERSxDQUFQO0FBR0g7QUFFTSxTQUFTa1AsWUFBVCxDQUF1Qm5QLEtBQXZCLEVBQTZCO0FBQ2hDLFFBQU07QUFBQ04sSUFBQUE7QUFBRCxNQUFhSCxXQUFXLEVBQTlCOztBQUNBLFdBQVM2UCxXQUFULENBQXFCclIsQ0FBckIsRUFBd0I7QUFDcEJBLElBQUFBLENBQUMsQ0FBQ2tOLGNBQUY7QUFDQSxVQUFNO0FBQUV2RixNQUFBQTtBQUFGLFFBQVMzSCxDQUFDLENBQUMrTyxNQUFqQjtBQUNBcE4sSUFBQUEsVUFBVSxDQUFDO0FBQUNWLE1BQUFBLFlBQVksRUFBQyxHQUFkO0FBQWtCRCxNQUFBQSxLQUFLLEVBQUUsSUFBRzJHLEVBQUc7QUFBL0IsS0FBRCxDQUFWO0FBQ0Q7O0FBQ0gsU0FBVTtBQUFHLElBQUEsU0FBUyxFQUFDLGVBQWI7QUFBNkIsSUFBQSxJQUFJLEVBQUM7QUFBbEMsS0FBMEMxRixLQUExQztBQUFpRCxJQUFBLE9BQU8sRUFBRW9QO0FBQTFELEtBQVY7QUFDSDs7QUN0QkRDLENBQU0sQ0FDSixFQUFDQyxZQUFELFFBQ0UsRUFBQyxNQUFEO0FBQVEsRUFBQSxLQUFLLEVBQUMsV0FBZDtBQUEwQixFQUFBLEVBQUUsRUFBQztBQUE3QixHQUNFLEVBQUMsY0FBRCxRQUNFLEVBQUMsU0FBRCxRQUNFLEVBQUMsV0FBRDtBQUFhLEVBQUEsS0FBSyxFQUFDO0FBQW5CLEdBQ0UsRUFBQyxZQUFELFFBQ0UsRUFBQyxZQUFEO0FBQWMsRUFBQSxFQUFFLEVBQUM7QUFBakIsYUFERixFQUVFLEVBQUMsWUFBRDtBQUFjLEVBQUEsRUFBRSxFQUFDO0FBQWpCLGVBRkYsRUFHRSxFQUFDLFlBQUQ7QUFBYyxFQUFBLEVBQUUsRUFBQztBQUFqQixXQUhGLEVBSUUsRUFBQyxZQUFEO0FBQWMsRUFBQSxFQUFFLEVBQUM7QUFBakIsV0FKRixDQURGLENBREYsRUFTRSxFQUFDLFdBQUQ7QUFBYSxFQUFBLEtBQUssRUFBQztBQUFuQixHQUNFLEVBQUMsWUFBRCxRQUNFLEVBQUMsWUFBRDtBQUFjLEVBQUEsRUFBRSxFQUFDO0FBQWpCLFdBREYsRUFFRSxFQUFDLFlBQUQ7QUFBYyxFQUFBLEVBQUUsRUFBQztBQUFqQixZQUZGLEVBR0UsRUFBQyxZQUFEO0FBQWMsRUFBQSxFQUFFLEVBQUM7QUFBakIscUJBSEYsRUFJRSxFQUFDLFlBQUQ7QUFBYyxFQUFBLEVBQUUsRUFBQztBQUFqQixxQkFKRixDQURGLENBVEYsRUFpQkUsRUFBQyxXQUFEO0FBQWEsRUFBQSxLQUFLLEVBQUM7QUFBbkIsR0FDRSxFQUFDLFlBQUQsUUFDRSxFQUFDLFlBQUQ7QUFBYyxFQUFBLEVBQUUsRUFBQztBQUFqQixXQURGLEVBRUUsRUFBQyxZQUFEO0FBQWMsRUFBQSxFQUFFLEVBQUM7QUFBakIsYUFGRixFQUdFLEVBQUMsWUFBRDtBQUFjLEVBQUEsRUFBRSxFQUFDO0FBQWpCLGVBSEYsRUFJRSxFQUFDLFlBQUQ7QUFBYyxFQUFBLEVBQUUsRUFBQztBQUFqQixjQUpGLEVBS0UsRUFBQyxZQUFEO0FBQWMsRUFBQSxFQUFFLEVBQUM7QUFBakIsYUFMRixFQU1FLEVBQUMsWUFBRDtBQUFjLEVBQUEsRUFBRSxFQUFDO0FBQWpCLFlBTkYsRUFPRSxFQUFDLFlBQUQ7QUFBYyxFQUFBLEVBQUUsRUFBQztBQUFqQixhQVBGLEVBUUUsRUFBQyxZQUFEO0FBQWMsRUFBQSxFQUFFLEVBQUM7QUFBakIsYUFSRixFQVNFLEVBQUMsWUFBRDtBQUFjLEVBQUEsRUFBRSxFQUFDO0FBQWpCLG9CQVRGLENBREYsQ0FqQkYsQ0FERixDQURGLENBREYsRUFvQ0UsRUFBQyxlQUFELE9BcENGLENBREksRUF5Q0psRCxRQUFRLENBQUNtRCxJQXpDTCxDQUFOIn0=
