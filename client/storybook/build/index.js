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

const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBBsIKiPwhmmIAAAHqUlEQVR42t2daWxUVRTHf30tpVRGwLIWKAUqYRWIAZWqRKi2WBAwEsIno3wwuMeESJAPiMoSC9gQSPgCoV8gGmSLLCJE2bGAUlYp+1KWUrahgFCmfpgMM21ne+/dc+/Ucz4QOu+e8/+f9+bOveeee18SuiSJrvSmK9lk0YYMMkgjlaeAah7ygCqquMYFznKaY5yhVhcsaelILrkMoi8eG628HKKUneykQk8g1EsaBRTzD7Uu9TjzyaepaTp2pAmFlHDLNfVQvcUyCmlimlpsyWE655VSD9UrFNPHNMXI8jLr8ImRD+oORmnou2xJEmM4oIF6UPczOnGCUMA+reQDWkq+aerQg3VGyAd0M33NkU+niIdG6ddSy0Pm0MwE/TxOGScf0HKG6SWfxmweG6cdqj4Wk66Lfj8OGyccTsv0jBEmcNc41Uh6j3dlySczzzjJWFqEJUU/lRXG6cWjP5MmQb85m4xTi1e38rRq+u3Yb5yWHd1HW5X0syk3TsmuniBbFf02HDdOx4mepL0K+p5G9vCH6kFauqWf2oi6vnC61V0yzeJH4xTc6iqSo1GM+iFzmajiW2RUepLGb86aTjB+99Soj9FO6Pej2jh0VXqdznbpp3HQOGyVuidSSj1SHzCfUUq+gYkinUi10xPkaUlv61UfQ8NRDZdaTqeM7qZvmYAcZQCP6v8x3FdgFoVaAFWxj/0coxKPlrRmG7zsin1ZLx6JP47XmFEvnd2Pb6kU9+ulU+wAbBAGcZ+vI6Qv0/mGB8Lef4pFv0AYwCkGRvX/PKeFEQyP5j5JeJHrL9rFfALbUyaKYVs052OF735s+gCtOSGK45XIriVXeP+lX1z0AfpwTxDJpkhuh4vGfVrc9AE+EcUyKLzT9YIuD5BiKwDJonmo1eFcPis6/LU/s5Dsj3zhRrpzBB2WO1itSRZdff6uvrsmVAi6+9Q2fYAvBBFdrj89Hin6wDlbpOggiKmWAr+TwKM53hHE+OQY1xy1u8wJQVTjQwPQVDT98Yfjlr8LohpDajAAr9FC0NUOAy1jS0t/gsQfgBGCjqDcccuTorjygwEoEHV0yXHLi6K4RgQC0JEeoo7uGmgZj/Smgz8AuaJu4LHjlo8ct4xPhugJgPNqjZbCyHL9ARjk2pAUDcnfJoDBYJEkXm2b6bhlR2FkfUmy6G5rL48T6e+45QBhZC3Isugp7MQNjefEsfW26CbuZJjDrQ2WhhLobIsu4k468oKjdi/RQRxbV4sscSdO55qSM9SAdLHUFhRGkIm0st2mFe9pQNbG4hkNbjx8aLvNRzTXgCwD0VRYUO/YLFLpglcLrouWpv02HhbZun6RlvsP6YiuwdTVyXHDmqoNUzXUaHP2mHfioj9O436kGp0BqKUmjs7wfa1b8WrQXg24IMrcw8NCzWiq4aZml7VciDD/zBTcdx5Jb1jc09Lbhkonf0K6gXjFp78NpdrihnanNRyNEIBT2rFUWVzX7LKWz3kQ4bNiNB2dYi4AFYxkYcRPFzKGK1rxXLc4r82Zlzn0ZH3Ua9aSwxRuasN0Fj7W09syw8aMsCUzNP06TZJdGPfrZSY7yDs+zRSuiGMrgG6iDrxMc7GtvRlfCc8KsyCJ20LGH1OiIKmVyWKxucEtf7Zyp4jxcl50TT4gQ4QKaLf7V4ZKlQENykoGskeZtV0MZI0Ayj/9/4xTHtl5Anv4kwUmSm/7TWcqNmsv92NHFihG+mRvscrN0avkTnAgmV8UIj0cNPyDMqNXhdPsrRWODb4Pms1XZnSsKH1Q2WPlBY02VXT63z4tB5yVKsF6s25WYpkSo29qoK+qjHpJXaOFCkxe1HTAnaVkMeeNukZTFBgt1kIfYJFrrE+KpQM/WTWUuIYlMVYLL6tdW1jSsAItx+WGCZ94SVNQWrm8/77wZSHuBhmntdEHOOcK69qgodBR21xXkA67aq3XW1H4AGzlgAujlVoDcNVF272hmyfrjttnuDB7W2sA7rhoW4dl3QCsCcyQNUPS6a2UDaH/rT90yWejQ8OXtGb02zteRhvO1ugXqJxwJp6uqE+34eA1hyMRFi8bv3jpVX/7RsMjNG7gES+gNyVT+bX+n8JNX5pRRo5prAJyhIENB8Dh0lf3+QDdq7Ty4mNSuB0o4Q9SOkMrhVn9xJBZLLVzeVP+Nt5jq9Td9t9O0SeBD1C2q5XxHJ/TUMb+Tw7U8vGW0+9NkXHwKnSm847DaiRnSUfT5e4Wapqw0TgFN7rF/RuKPIbeIKJCS9XUnLdutAcrx3dwUxySLXy2k4SeULsdLIPdxinZ0VL1i7TNG1F3uEX98foAqSw3Ti0eXSnzggUAizkJPjr0MVOwQAOAPA3li061Us/6dCe2G6caTveqe6VCLElhesK9aKlY9+sYhybQ65bKop0SKfkcfMYd4+SrmW4yi51JiVH667Tsfo8hw9lmhPxu3e+Yiyavah4n7tVUkGVL+lOiYR+qj82JfPR/Z750Wb0RTSuY3RjOvU+hgKWK9/zcYAn5Nk+mNSypvM5cjrimfpgi8uR+6ORLG9uTSy6D6Wuriuw2hyhlBztdFcMkRACCkk0vupJNFm3JIIN0UvAAXmq4RxVVXOUCZzjDMc7pAvUfh2wCMwliJ3AAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDQtMjdUMDg6NDI6MzUrMDA6MDD+qVs0AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA0LTI3VDA4OjQyOjM1KzAwOjAwj/TjiAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=";

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
    "data-testid": "unreadhangouts",
    className: "list-group"
  }, items && items.length > 0 && items.map(u => {
    return h("li", {
      className: "list-group-item d-flex justify-content-between align-items-center",
      onClick: onSelectUnread,
      id: u.username,
      "data-testid": `${u.username}-select`
    }, u.username, " messages: ", u.messageCount, h("span", {
      className: "badge badge-danger badge-pill",
      onClick: onRemoveUnread,
      id: u.username,
      "data-testid": `${u.username}-remove`
    }, "x"));
  }));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2luZGV4LmpzIiwiLi4vU3Rvcnlib29rUHJvdmlkZXJzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL01lc3NhZ2UuanMiLCIuLi9JY29uc0RlbW8uanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL2J1dHRvbi9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvYWxlcnQvaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2xvZ2luLnN0YXRlcy5qcyIsIi4uLy4uL2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvc2lnbnVwLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL3NpZ251cC5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2NoYW5nZS1wYXNzd29yZC5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2ZvcmdvdC1wYXNzd29yZC5zdGF0ZXMuanMiLCIuLi9hdXRoZW50aWNhdGlvbi9yb3V0ZS5qcyIsIi4uL2NvbXBvbmVudHMvYnV0dG9uL2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy90ZXh0LWlucHV0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy90b2FzdC91c2VyLnBuZyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvdG9hc3QvaW5kZXguanMiLCIuLi9jb21wb25lbnRzL3RvYXN0L2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy9hbGVydC9pbmRleC5qcyIsIi4uL2NvbXBvbmVudHMvcm91dGUuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0xheW91dC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2suanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0Jsb2NrLmpzIiwiLi4vLi4vY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9ja2VkLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0FyY2hpdmUuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL01lc3NhZ2UuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL0Jsb2NrZXJNZXNzYWdlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9CbG9ja2VkTWVzc2FnZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdjaGF0LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9saXN0L2luZGV4LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9IYW5nb3V0LmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9QZXJzb25BZGQuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlci5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9VbnJlYWRIYW5nb3V0cy5qcyIsIi4uL2hhbmdvdXQvZmFrZU1lc3NhZ2VzLmpzIiwiLi4vaGFuZ291dC9yb3V0ZS5qcyIsIi4uL1N0b3J5Ym9va1JvdXRlcy5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbmF2LWJhci9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtZHJvcGRvd24uanMiLCIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xyXG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcclxuICAvLyAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcbiAgY29uc3Qge25hbWV9PXN0YXRlXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBpZihuYW1lKXtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obmFtZSxKU09OLnN0cmluZ2lmeSh7cm91dGUsZmVhdHVyZVJvdXRlfSkpXHJcbiAgICB9XHJcbiAgIFxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGlmKHN0YXRlICYmIHN0YXRlLm5hbWUgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSkpe1xyXG4gXHJcbiAgICAgICAgY29uc3Qge2ZlYXR1cmVSb3V0ZSxyb3V0ZX09IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpKVxyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gICAgfVxyXG5cclxuICB9LFtdKVxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAgQXBwUm91dGVQcm92aWRlciAgZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICBcclxuICAgICAgPEFwcFJvdXRlUHJvdmlkZXJcclxuICAgICAgIC8vXHJcbiAgICAgICAgdGl0bGU9XCJXZWJjb21cIlxyXG4gICAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnLG5hbWU6J3N0b3J5Ym9vaycgfX1cclxuICAgICAgPlxyXG4gICAgXHJcbiAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICA8L0FwcFJvdXRlUHJvdmlkZXI+XHJcblxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJ2ljb25zL01lc3NhZ2UnXHJcbmV4cG9ydCBmdW5jdGlvbiBJY29uc0RlbW8oKXtcclxuICAgIHJldHVybiA8ZGl2PlxyXG5cclxuICAgICAgICA8TWVzc2FnZSBjb3VudD17MX0vPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBsYWJlbCwgbmFtZSwgdHlwZSwgaXNWYWxpZCwgbWVzc2FnZSB9ID0gcHJvcHNcclxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIHAtMFwiPlxyXG4gICAgPGxhYmVsIGZvcj17bmFtZX0gPntsYWJlbH08L2xhYmVsPlxyXG4gICAgPGlucHV0IHR5cGU9e3R5cGV9IGNsYXNzTmFtZT17YGZvcm0tY29udHJvbCAke2lzVmFsaWQgJiYgJ2lzLXZhbGlkJ30gJHshaXNWYWxpZCAmJiBpc1ZhbGlkICE9PSB1bmRlZmluZWQgJiYgJ2lzLWludmFsaWQnfWB9IGlkPXtuYW1lfSBhcmlhLWRlc2NyaWJlZGJ5PXtuYW1lfXsuLi5wcm9wc30gLz5cclxueyFpc1ZhbGlkICYmIDxzbWFsbCBpZD1cImVtYWlsSGVscFwiIGNsYXNzTmFtZT17YCR7IWlzVmFsaWQgJiYgJ2ludmFsaWQtZmVlZGJhY2snfWB9IGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH0+e21lc3NhZ2V9PC9zbWFsbD59XHJcbiAgPC9kaXY+XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCdXR0b24ocHJvcHMpIHtcclxuICBjb25zdCB7IHRpdGxlLCBiZz1cImxpZ2h0XCIsb3V0bGluZSwgc2l6ZSxsb2FkaW5nPWZhbHNlLCBibG9ja30gPSBwcm9wcztcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9IHtgJHtiZyAmJiAhb3V0bGluZSYmYGJ0biBidG4tJHtiZ31gfSAke291dGxpbmUmJmBidG4gYnRuLW91dGxpbmUtJHtiZ31gfSAke3NpemUmJmBidG4gYnRuLSR7c2l6ZX1gfSAke2Jsb2NrICAmJiAnYnRuLWJsb2NrJ31gfSB7Li4ucHJvcHN9IGRpc2FibGVkPXtsb2FkaW5nfT5cclxuICAgICAgICB7bG9hZGluZyAmJiA8c3BhbiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtXCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj59IFxyXG4gICAgICAgIHsgbG9hZGluZyA/ICd3YWl0Li4uJzp0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFsZXJ0IChwcm9wcyl7XHJcbmNvbnN0IHthbGVydCxtZXNzYWdlfT1wcm9wc1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgYWxlcnQgYWxlcnQtJHthbGVydH1gfSByb2xlPVwiYWxlcnRcIiBkYXRhLXRlc3RpZD1cImFsZXJ0XCI+XHJcbiAgICB7bWVzc2FnZX1cclxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxyXG4gICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuaW1wb3J0IEFsZXJ0IGZyb20gJ2NvbnRyb2xzL2FsZXJ0J1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbihwcm9wcykge1xyXG4gIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCwgbG9hZGluZywgb25Mb2dpbiwgb25Gb2N1cywgb25DaGFuZ2UsIHZhbGlkYXRpb24sIG9uRm9yZ290UGFzc3dvcmQsIG9uQmx1ciwgZXJyb3IgfSA9IHByb3BzO1xyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cclxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbCBvciB1c2VybmFtZVwiXHJcbiAgICAgICAgbmFtZT0nZW1haWxvcnVzZXJuYW1lJ1xyXG4gICAgICAgIHR5cGU9J3RleHQnXHJcbiAgICAgXHJcbiAgICAgICAgaWQ9J2VtYWlsb3J1c2VybmFtZSdcclxuICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWxvcnVzZXJuYW1lJ1xyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnZW1haWxvcnVzZXJuYW1lJ10ubWVzc2FnZX1cclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2VtYWlsb3J1c2VybmFtZSddLmlzVmFsaWR9XHJcblxyXG4gICAgICAvPlxyXG5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgbGFiZWw9XCJQYXNzd29yZFwiXHJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICBuYW1lPSdwYXNzd29yZCdcclxuICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICBcclxuICAgICAgICBpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5pc1ZhbGlkfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XHJcblxyXG5cclxuICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgICAgICBpZD0nbG9naW4tYnRuJ1xyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9J2xvZ2luLWJ0bidcclxuICAgICAgICAgIG9uQ2xpY2s9e29uTG9naW59XHJcbiAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgdGl0bGU9XCJMb2dpblwiXHJcbiAgICAgICAgICBiZz1cInByaW1hcnlcIlxyXG4gICAgICAgIC8+XHJcblxyXG4gICAgICAgIDxCdXR0b24gb25DbGljaz17b25Gb3Jnb3RQYXNzd29yZH0gaWQ9J2ZvcmdvdHBhc3N3b3JkJyBkYXRhLXRlc3RpZD0nZm9yZ290cGFzc3dvcmQnIG91dGxpbmUgYmc9XCJwcmltYXJ5XCIgdGl0bGU9XCJGb3Jnb3QgUGFzc3dvcmQhXCIgLz5cclxuXHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBMb2dpbiBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luJ1xyXG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHsgZW1haWxvcnVzZXJuYW1lOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiAnLicgfSB9XHJcbmNvbnN0IHZhbGlkYXRpb25FcnJvciA9IHsgZW1haWxvcnVzZXJuYW1lOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnaW52YWxpZCBjcmVkZW50aWFscycgfSwgcGFzc3dvcmQ6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdpbnZhbGlkIGNyZWRlbnRpYWxzJyB9IH1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9naW5TdGF0ZXMoKSB7XHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+IExvZ2luIFZhbGlkYXRpb24gU3VjY2VzczwvaDU+XHJcblxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IC8+XHJcblxyXG5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+TG9naW4gVmFsaWRhdGlvbiBFcnJvcjwvaDU+XHJcblxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfSAvPlxyXG5cclxuXHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkxvZ2dpbmcgaW48L2g1PlxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IGxvYWRpbmcgLz5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+TG9nZ2luZyBTZXJ2ZXIgZXJyb3I8L2g1PlxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9ICBlcnJvcj17e21lc3NhZ2U6J1NlcnZlciBpcyB1bmF2YWlsYWJsZSd9fS8+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0J1xyXG5pbXBvcnQgQWxlcnQgZnJvbSAnY29udHJvbHMvYWxlcnQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cChwcm9wcykge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCwgbG9hZGluZywgb25TaWdudXAsIG9uQ2hhbmdlLCB2YWxpZGF0aW9uLCBvbkJsdXIsIG9uRm9jdXMsIGVycm9yIH0gPSBwcm9wcztcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNCBib3JkZXIgbXgtYXV0byByb3VuZGVkXCIgc3R5bGU9e3sgbWFyZ2luOiAxNSwgcGFkZGluZzogMTYgfX0+XHJcbiAgICAgIHtsb2FkaW5nICYmIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIiBzdHlsZT1cImhlaWdodDogNXB4O1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIHByb2dyZXNzLWJhci1hbmltYXRlZFwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIxMDBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIiBzdHlsZT1cIndpZHRoOiAxMDAlXCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2Pn1cclxuICAgICAge2Vycm9yICYmIDxBbGVydCBhbGVydD1cImRhbmdlclwiIG1lc3NhZ2U9e2Vycm9yLm1lc3NhZ2V9IC8+fVxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cclxuICAgICAgICBsYWJlbD1cIlVzZXJuYW1lXCJcclxuICAgICAgICB2YWx1ZT17dXNlcm5hbWV9XHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIHR5cGU9J3RleHQnXHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J3VzZXJuYW1lJ1xyXG4gICAgICAgIG5hbWU9J3VzZXJuYW1lJ1xyXG4gIFxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsndXNlcm5hbWUnXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsndXNlcm5hbWUnXS5tZXNzYWdlfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uQmx1cj17b25CbHVyfVxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIHZhbHVlPXtlbWFpbH1cclxuICAgICBcclxuICAgICAgICB0eXBlPSdlbWFpbCdcclxuICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWwnXHJcbiAgICAgICAgbmFtZT0nZW1haWwnXHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvPlxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cclxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgIFxyXG4gICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIGRhdGEtdGVzdGlkPSdwYXNzd29yZCdcclxuICAgICAgICBuYW1lPSdwYXNzd29yZCdcclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10uaXNWYWxpZH1cclxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10ubWVzc2FnZX1cclxuXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uU2lnbnVwfVxyXG4gICAgICAgIGlkPSdzaWdudXAtYnRuJ1xyXG4gICAgICAgIGRhdGEtdGVzdGlkPVwic2lnbnVwLWJ0blwiXHJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICB0aXRsZT1cIlNpZ251cFwiXHJcbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcclxuICAgICAgLz5cclxuXHJcblxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IFNpZ251cCBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL3NpZ251cCdcclxuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPSB7IHVzZXJuYW1lOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiAnLicgfSwgZW1haWw6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0gfVxyXG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB7IHVzZXJuYW1lOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnVXNlcm5hbWUgaXMgbm90IHZhbGlkJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ1Bhc3dvcmQgaXMgbm90IHZhbGlkJyB9LCBlbWFpbDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ0VtYWlsIGlzIG5vdCB2YWxpZCcgfSB9XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cFN0YXRlcygpIHtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlNpZ251cCBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxyXG4gICAgICAgICAgICAgICAgPFNpZ251cCB1c2VybmFtZT1cInRlc3R1c2VyXCIgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWdudXAgVmFsaWRhdGlvbiBFcnJvcjwvaDU+XHJcbiAgICAgICAgICAgICAgICA8U2lnbnVwIHVzZXJuYW1lPVwidGVzdHVzZXJcIiBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uRXJyb3J9IC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2lnbmluZyB1cDwvaDU+XHJcbiAgICAgICAgICAgICAgICA8U2lnbnVwIHVzZXJuYW1lPVwidGVzdHVzZXJcIiBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31sb2FkaW5nIC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWduaW5nIFNldmVyIGVycm9yPC9oNT5cclxuICAgICAgICAgICAgICAgIDxTaWdudXAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSBlcnJvcj17e21lc3NhZ2U6J1NlcnZlciBpcyB1bmF2YWlsYWJsZSd9fSAvPlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkKHByb3BzKSB7XHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgdmFsaWRhdGlvbiwgb25DaGFuZ2UsIG9uUGFzc3dvcmRDaGFuZ2UsIGxvYWRpbmcsZXJyb3IgfSA9IHByb3BzO1xyXG5cclxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIC8vICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gIC8vICAgdmFyIHVybHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XHJcblxyXG4gIC8vICAgaWYgKHVybHRva2VuKSB7XHJcbiAgLy8gICAgIGRpc3BhdGNoKGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW46IHVybHRva2VuIH0pKTtcclxuICAvLyAgIH1cclxuICAvLyB9LCBbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIiBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fT5cclxuICAgICAge2xvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjEwMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+fVxyXG4gICAgICB7ZXJyb3IgJiYgPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT17ZXJyb3IubWVzc2FnZX0gLz59XHJcbiAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIGxhYmVsPVwiQ29uZmlybVwiXHJcbiAgICAgICAgdmFsdWU9e2NvbmZpcm19XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J2NvbmZpcm0nXHJcbiAgICAgICAgbmFtZT0nY29uZmlybSdcclxuICAgICAgIFxyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2NvbmZpcm0nXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnY29uZmlybSddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvPlxyXG4gICAgICA8QnV0dG9uXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J2NoYW5nZS1wYXNzLWJ0bidcclxuICAgICAgICBvbkNsaWNrPXtvblBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgIHRpdGxlPVwiQ2hhbmdlXCIgYmc9XCJwcmltYXJ5XCIgLz5cclxuICAgIDwvZGl2PlxyXG5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkJ1xyXG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHsgcGFzc3dvcmQ6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0sIGNvbmZpcm06IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0gfVxyXG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB7IHBhc3N3b3JkOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnaW52YWxpZCBwYXNzd29yZCBmb3JtYXQnIH0sIGNvbmZpcm06IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdpbnZhbGlkIHBhc3N3b3JkIGZvcm1hdCcgfSB9XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkU3RhdGVzKCkge1xyXG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPiBDaGFuZ2VQYXNzd29yZCBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxyXG4gICAgICAgIDxDaGFuZ2VQYXNzd29yZCBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiIGNvbmZpcm09XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gIC8+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkNoYW5nZVBhc3N3b3JkIFZhbGlkYXRpb24gRXJyb3I8L2g1PlxyXG4gICAgICAgIDxDaGFuZ2VQYXNzd29yZCB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uRXJyb3J9ICAvPlxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5DaGFuZ2VQYXNzd29yZCBpbiBwcm9ncmVzczwvaDU+XHJcbiAgICAgICAgPENoYW5nZVBhc3N3b3JkIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgY29uZmlybT1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSBsb2FkaW5nIC8+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkNoYW5nZVBhc3N3b3JkIFNlcnZlciBlcnJvcjwvaDU+XHJcbiAgICAgICAgPENoYW5nZVBhc3N3b3JkIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgY29uZmlybT1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSBlcnJvcj17eyBtZXNzYWdlOiAnU2VydmVyIGlzIHVuYXZhaWxhYmxlJyB9fSAvPlxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVxdWVzdFBhc3NDaGFuZ2UocHJvcHMpIHtcclxuICBjb25zdCB7IGVtYWlsLCB2YWxpZGF0aW9uLCBvblJlcXVlc3RQYXNzd29yZENoYW5nZSwgbG9hZGluZywgb25DaGFuZ2UsZXJyb3IgfSA9IHByb3BzXHJcblxyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfS8+fVxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXHJcbiAgICAgICAgdmFsdWU9e2VtYWlsfVxyXG4gICAgIFxyXG4gICAgICAgIG5hbWU9J2VtYWlsJ1xyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICB0eXBlPSdlbWFpbCdcclxuICAgICAgICBpZD0nZW1haWwnXHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcblxyXG4gICAgXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicmVxdWVzdHBhc3NjaGFuZ2UtYnRuXCJcclxuICAgICAgICB0aXRsZT1cIlJlcXVlc3QgcGFzc3dvcmQgY2hhbmdlXCJcclxuICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgIGJnPVwicHJpbWFyeVwiXHJcblxyXG4gICAgICAvPlxyXG5cclxuXHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgRm9yZ290UGFzc3dvcmQgZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9Gb3Jnb3RQYXNzd29yZCdcclxuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPSB7IGVtYWlsOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9IH1cclxuY29uc3QgdmFsaWRhdGlvbkVycm9yID0geyBlbWFpbDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ0ludmFsaWQgZW1haWwgZm9ybWF0JyB9IH1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9yZm90UGFzc3dvcmRTdGF0ZSgpIHtcclxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj4gRm9yZ290UGFzc3dvcmQgVmFsaWRhdGlvbiBTdWNjZXNzPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5Gb3Jnb3RQYXNzd29yZCBWYWxpZGF0aW9uIEVycm9yPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdGdtYWlsLmNvbVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25FcnJvcn0gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5SZXF1ZXN0IFBhc3N3b3JkIENoYW5nZSBpbiBwcm9ncmVzczwvaDU+XHJcblxyXG4gICAgICAgIDxGb3Jnb3RQYXNzd29yZCBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IGxvYWRpbmcgLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2VydmVyIGVycm9yPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gZXJyb3I9e3ttZXNzYWdlOidTZXJ2ZXIgaXMgdW5hdmFpbGFibGUnfX0gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgTG9naW5TdGF0ZXMgZnJvbSAnLi9zdGF0ZXMvbG9naW4uc3RhdGVzJ1xyXG5pbXBvcnQgU2lnblVwU3RhdGVzIGZyb20gJy4vc3RhdGVzL3NpZ251cC5zdGF0ZXMnXHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZFN0YXRlcyBmcm9tICcuL3N0YXRlcy9jaGFuZ2UtcGFzc3dvcmQuc3RhdGVzJ1xyXG5pbXBvcnQgRm9yZ290UGFzc3dvcmRTdGF0ZXMgZnJvbSAnLi9zdGF0ZXMvZm9yZ290LXBhc3N3b3JkLnN0YXRlcydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aERlbW9Sb3V0ZXMoKSB7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9sb2dpblwiPlxyXG4gICAgICAgICAgICA8TG9naW5TdGF0ZXMgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9zaWdudXBcIj5cclxuICAgICAgICAgICAgPFNpZ25VcFN0YXRlcyAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2NoYW5nZS1wYXNzd29yZFwiPlxyXG4gICAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmRTdGF0ZXMgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9mb3Jnb3QtcGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgPEZvcmdvdFBhc3N3b3JkU3RhdGVzIC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgIF1cclxufSIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uRGVtbyAoKXtcclxuXHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZSA9e3tkaXNwbGF5OidmbGV4JywgZmxleERpcmVjdGlvbjonY29sdW1uJyx3aWR0aDonMTAwJScsIGFsaWduSXRlbXM6J2NlbnRlcicsYmFja2dyb3VuZENvbG9yOid5ZWxsb3cnfX0+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICA8aDM+RmlsbGVkIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCI+UHJpbWFyeTwvQnV0dG9uPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIj5TZWNvbmRhcnk8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwic3VjY2Vzc1wiPlN1Y2Nlc3M8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFuZ2VyXCI+RGFuZ2VyPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIj5XYXJuaW5nPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImluZm9cIj5JbmZvPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImxpZ2h0XCI+TGlnaHQ8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiPkRhcms8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwibGlua1wiPkxpbms8L0J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ID5cclxuICAgICAgICAgICAgPGgzPk91dGxpbmVkIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgb3V0bGluZT17dHJ1ZX0gdGl0bGU9XCJQcmltYXJ5XCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiBvdXRsaW5lIHRpdGxlPVwiU2Vjb25kYXJ5XCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzdWNjZXNzXCIgb3V0bGluZSB0aXRsZT1cIlN1Y2Nlc3NcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImRhbmdlclwiIG91dGxpbmUgdGl0bGU9XCJEYW5nZXJcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIiBvdXRsaW5lIHRpdGxlPVwiV2FybmluZ1wiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiaW5mb1wiIG91dGxpbmUgdGl0bGU9XCJJbmZvXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJsaWdodFwiIG91dGxpbmUgdGl0bGU9XCJMaWdodFwiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiIG91dGxpbmUgdGl0bGU9XCJEYXJrXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJsaW5rXCIgb3V0bGluZSB0aXRsZT1cIkxpbmtcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnfX0+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICA8aDM+U21hbGwgQnV0dG9uczwvaDM+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcInNpemU9XCJzbVwiIHRpdGxlPVwibGlua1wiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwic2Vjb25kYXJ5XCIgc2l6ZT1cInNtXCIgdGl0bGU9XCJTZWNvbmRhcnlcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGgzPkxhcmdlIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCJzaXplPVwibGdcIiB0aXRsZT1cIkxpbmtcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInNlY29uZGFyeVwiIHNpemU9XCJsZ1wiIHRpdGxlPVwiU2Vjb25kYXJ5XCIvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICBcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgIDxoMz4gRGlzYWJsZWQgQnV0dG9uczwvaDM+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiBkaXNhYmxlZCAgdGl0bGU9XCJMaW5rXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiAgZGlzYWJsZWQgdGl0bGU9XCJTZWNvbmRhcnlcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgPGgzPiBTcGlubmluZyBCdXR0b248L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgdGl0bGU9XCJTcGlubmluZ1wiIGxvYWRpbmcvPlxyXG4gICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0U3RhdGVzKCkge1xyXG4gICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGg1PlZhbGlkYXRpb248L2g1PlxyXG4gICAgICAgIDxUZXh0SW5wdXQgaXNWYWxpZD17dHJ1ZX0gLz5cclxuICAgICAgICA8VGV4dElucHV0IGlzVmFsaWQ9e2ZhbHNlfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgXHJcbiAgICA8L2Rpdj5cclxufSIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUNBQ0FRQUFBQnBONmxBQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQW1KTFIwUUFBS3FOSXpJQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFIZEVsTlJRZmtCQnNJS2lQd2htbUlBQUFIcVVsRVFWUjQydDJkYVd4VVZSVEhmMzB0cFZSR3dMSVdLQVVxWVJXSUFaV3FSS2kyV0JBd0VzSW5vM3d3dU1lRVNKQVBpTW9TQzlnUVNQZ0NvVjhnR21TTExDSkUyYkdBVWxZcCsxS1dVcmFoZ0ZDbWZwZ01NMjFuZSsvZGMrL1VjejRRT3UrZTgvK2Y5K2JPdmVlZWUxOFN1aVNKcnZTbUs5bGswWVlNTWtnamxhZUFhaDd5Z0NxcXVNWUZ6bkthWTV5aFZoY3NhZWxJTHJrTW9pOGVHNjI4SEtLVW5leWtRazhnMUVzYUJSVHpEN1V1OVRqenlhZXBhVHAycEFtRmxIRExOZlZRdmNVeUNtbGltbHBzeVdFNjU1VlNEOVVyRk5QSE5NWEk4akxyOEltUkQrb09SbW5vdTJ4SkVtTTRvSUY2VVBjek9uR0NVTUErcmVRRFdrcSthZXJRZzNWR3lBZDBNMzNOa1UrbmlJZEc2ZGRTeTBQbTBNd0UvVHhPR1NjZjBIS0c2U1dmeG13ZUc2Y2RxajRXazY2TGZqOE9HeWNjVHN2MGpCRW1jTmM0MVVoNmozZGx5U2N6enpqSldGcUVKVVUvbFJYRzZjV2pQNU1tUWI4NW00eFRpMWUzOHJScSt1M1liNXlXSGQxSFc1WDBzeWszVHNtdW5pQmJGZjAySERkT3g0bWVwTDBLK3A1Rzl2Q0g2a0ZhdXFXZjJvaTZ2bkM2MVYweXplSkg0eFRjNmlxU28xR00raUZ6bWFqaVcyUlVlcExHYjg2YVRqQis5OVNvajlGTzZQZWoyamgwVlhxZHpuYnBwM0hRT0d5VnVpZFNTajFTSHpDZlVVcStnWWtpblVpMTB4UGthVWx2NjFVZlE4TlJEWmRhVHFlTTdxWnZtWUFjWlFDUDZ2OHgzRmRnRm9WYUFGV3hqLzBjb3hLUGxyUm1HN3pzaW4xWkx4NkpQNDdYbUZFdm5kMlBiNmtVOSt1bFUrd0FiQkFHY1ordkk2UXYwL21HQjhMZWY0cEZ2MEFZd0NrR1J2WC9QS2VGRVF5UDVqNUplSkhyTDlyRmZBTGJVeWFLWVZzMDUyT0Y3MzVzK2dDdE9TR0s0NVhJcmlWWGVQK2xYMXowQWZwd1R4REpwa2h1aDR2R2ZWcmM5QUUrRWNVeUtMelQ5WUl1RDVCaUt3REpvbm1vMWVGY1BpczYvTFUvczVEc2ozemhScnB6QkIyV08xaXRTUlpkZmY2dXZyc21WQWk2KzlRMmZZQXZCQkZkcmo4OUhpbjZ3RGxicE9nZ2lLbVdBcitUd0tNNTNoSEUrT1FZMXh5MXU4d0pRVlRqUXdQUVZEVDk4WWZqbHI4TG9ocERhakFBcjlGQzBOVU9BeTFqUzB0L2dzUWZnQkdDanFEY2NjdVRvcmp5Z3dFb0VIVjB5WEhMaTZLNFJnUUMwSkVlb283dUdtZ1pqL1NtZ3o4QXVhSnU0TEhqbG84Y3Q0eFBodWdKZ1BOcWpaYkN5SEw5QVJqazJwQVVEY25mSm9EQllKRWtYbTJiNmJobFIyRmtmVW15Nkc1ckw0OFQ2ZSs0NVFCaFpDM0lzdWdwN01RTmplZkVzZlcyNkNidVpKakRyUTJXaGhMb2JJc3U0azQ2OG9LamRpL1JRUnhiVjRzc2NTZE81NXFTTTlTQWRMSFVGaFJHa0ltMHN0Mm1GZTlwUU5iRzRoa05iang4YUx2TlJ6VFhnQ3dEMFZSWVVPL1lMRkxwZ2xjTHJvdVdwdjAySGhiWnVuNlJsdnNQNllpdXdkVFZ5WEhEbXFvTlV6WFVhSFAybUhmaW9qOU80MzZrR3AwQnFLVW1qczd3ZmExYjhXclFYZzI0SU1yY3c4TkN6V2lxNGFabWw3VmNpREQvekJUY2R4NUpiMWpjMDlMYmhrb25mMEs2Z1hqRnA3OE5wZHJpaG5hbk5SeU5FSUJUMnJGVVdWelg3TEtXejNrUTRiTmlOQjJkWWk0QUZZeGtZY1JQRnpLR0sxcnhYTGM0cjgyWmx6bjBaSDNVYTlhU3d4UnVhc04wRmo3VzA5c3l3OGFNc0NVek5QMDZUWkpkR1BmclpTWTd5RHMrelJTdWlHTXJnRzZpRHJ4TWM3R3R2UmxmQ2M4S3N5Q0oyMExHSDFPaUlLbVZ5V0t4dWNFdGY3WnlwNGp4Y2w1MFRUNGdRNFFLYUxmN1Y0WktsUUVOeWtvR3NrZVp0VjBNWkkwQXlqLzkvNHhUSHRsNUFudjRrd1VtU20vN1RXY3FObXN2OTJOSEZpaEcrbVJ2c2NyTjBhdmtUbkFnbVY4VUlqMGNOUHlETXFOWGhkUHNyUldPRGI0UG1zMVhablNzS0gxUTJXUGxCWTAyVlhUNjN6NHRCNXlWS3NGNnMyNVdZcGtTbzI5cW9LK3FqSHBKWGFPRkNreGUxSFRBbmFWa01lZU51a1pURkJndDFrSWZZSkZyckUrS3BRTS9XVFdVdUlZbE1WWUxMNnRkVzFqU3NBSXR4K1dHQ1o5NFNWTlFXcm04Lzc3d1pTSHVCaG1udGRFSE9PY0s2OXFnb2RCUjIxeFhrQTY3YXEzWFcxSDRBR3psZ0F1amxWb0RjTlZGMjcyaG15ZnJqdHRudURCN1cyc0E3cmhvVzRkbDNRQ3NDY3lRTlVQUzZhMlVEYUgvclQ5MHlXZWpROE9YdEdiMDJ6dGVSaHZPMXVnWHFKeHdKcDZ1cUUrMzRlQTFoeU1SRmk4YnYzanBWWC83UnNNak5HN2dFUytnTnlWVCtiWCtuOEpOWDVwUlJvNXByQUp5aElFTkI4RGgwbGYzK1FEZHE3VHk0bU5TdUIwbzRROVNPa01yaFZuOXhKQlpMTFZ6ZVZQK050NWpxOVRkOXQ5TzBTZUJEMUMycTVYeEhKL1RVTWIrVHc3VTh2R1cwKzlOa1hId0tuU204NDdEYWlSblNVZlQ1ZTRXYXBxdzBUZ0ZON3JGL1J1S1BJYmVJS0pDUzlYVW5MZHV0QWNyeDNkd1V4eVNMWHkyazRTZVVMc2RMSVBkeGluWjBWTDFpN1RORzFGM3VFWDk4Zm9BcVN3M1RpMGVYU256Z2dVQWl6a0pQanIwTVZPd1FBT0FQQTNsaTA2MVVzLzZkQ2UyRzZjYVR2ZXFlNlZDTEVsaGVzSzlhS2xZOStzWWh5YlE2NWJLb3AwU0tma2NmTVlkNCtTcm1XNHlpNTFKaVZINjY3VHNmbzhodzlsbWhQeHUzZStZaXlhdmFoNG43dFZVa0dWTCtsT2lZUitxajgySmZQUi9aNzUwV2IwUlRTdVkzUmpPdlUraGdLV0s5L3pjWUFuNU5rK21OU3lwdk01Y2pyaW1mcGdpOHVSKzZPUkxHOXVUU3k2RDZXdXJpdXcyaHlobEJ6dGRGY01rUkFDQ2trMHZ1cEpORm0zSklJTjBVdkFBWG1xNFJ4VlZYT1VDWnpqRE1jN3BBdlVmaDJ3Q013bGlKM0FBQUFBbGRFVllkR1JoZEdVNlkzSmxZWFJsQURJd01qQXRNRFF0TWpkVU1EZzZOREk2TXpVck1EQTZNREQrcVZzMEFBQUFKWFJGV0hSa1lYUmxPbTF2WkdsbWVRQXlNREl3TFRBMExUSTNWREE0T2pReU9qTTFLekF3T2pBd2ovVGppQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB1c2VySW1hZ2UgZnJvbSAnLi91c2VyLnBuZydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVG9hc3QgKCl7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJ0b2FzdFwiIHJvbGU9XCJhbGVydFwiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2FzdC1oZWFkZXJcIj5cclxuICAgICAgPGltZyBzcmM9e3VzZXJJbWFnZX0gY2xhc3NOYW1lPVwicm91bmRlZCBtci0yXCIgYWx0PVwiLi4uXCIvPlxyXG4gICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cIm1yLWF1dG9cIj5Cb290c3RyYXA8L3N0cm9uZz5cclxuICAgICAgPHNtYWxsIGNsYXNzTmFtZT1cInRleHQtbXV0ZWRcIj5qdXN0IG5vdzwvc21hbGw+XHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm1sLTIgbWItMSBjbG9zZVwiIGRhdGEtZGlzbWlzcz1cInRvYXN0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XHJcbiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9hc3QtYm9keVwiPlxyXG4gICAgICBTZWU/IEp1c3QgbGlrZSB0aGlzLlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBUb2FzdCBmcm9tICdjb250cm9scy90b2FzdCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVG9hc3REZW1vKCl7XHJcblxyXG4gICAgcmV0dXJuIDxUb2FzdC8+XHJcbn0gIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnREZW1vICgpe1xyXG4gICAgcmV0dXJuPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT1cIlNlcnZlciBpcyB0ZW1wb3JhcmlseSB1bmF2YWlsYWJsZVwiLz5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJ1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJy4vdGV4dC1pbnB1dCdcclxuaW1wb3J0IFRvYXN0RGVtbyBmcm9tICcuL3RvYXN0J1xyXG5pbXBvcnQgQWxlcnREZW1vIGZyb20gJy4vYWxlcnQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbXBvbmVudHNSb3V0ZSgpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYnV0dG9uXCI+XHJcbiAgICAgICAgICAgIDxCdXR0b24gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi90ZXh0LWlucHV0XCI+XHJcbiAgICAgICAgICAgIDxUZXh0SW5wdXQgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi90b2FzdFwiPlxyXG4gICAgICAgICAgICA8VG9hc3REZW1vIC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYWxlcnRcIj5cclxuICAgICAgICAgICAgPEFsZXJ0RGVtbyAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICBdXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWUnLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGF5b3V0KHsgY2hpbGRyZW4sIHN0eWxlLCBpZCB9KSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9e2lkfSBzdHlsZT17eyAuLi5zdHlsZXMucm9vdCwgLi4uc3R5bGUgfX0+e2NoaWxkcmVufTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0ICBCdXR0b24gIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGNoZWNrYm94OiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgY2hlY2tib3hSb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgIHBhZGRpbmc6IDE2LFxyXG4gIH0sXHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZ1RvcDo2OFxyXG4gIH0sXHJcbiAgYnRuOiB7XHJcbiAgICBmbGV4OiAxLFxyXG4gICAgbWFyZ2luUmlnaHQ6IDQsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgb25DYW5jZWwsIG9uQmxvY2ssIG9uUmVwb3J0IH0pIHtcclxuXHJcbiBcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY2hlY2tib3hSb290fT5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XHJcbiAgICAgICAgPGxhYmVsPlJlcG9ydDwvbGFiZWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sXCI+XHJcbiAgICAgICAgPEJ1dHRvbiBkYXRhLXRlc3RpZD0nY2FuY2VsLWJ0bicgIG9uQ2xpY2s9e29uQ2FuY2VsfSB0aXRsZT1cIkNhbmNlbFwiIGJnPVwic2Vjb25kYXJ5XCIgb3V0bGluZSBibG9jay8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICBcclxuICBcclxuICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxyXG4gIDxCdXR0b24gaWQ9XCJCTE9DS1wiIG9uQ2xpY2s9e29uQmxvY2t9IGRhdGEtdGVzdGlkPVwiYmxvY2stYnRuXCIgIHRpdGxlPVwiQmxvY2tcIiBiZz1cInByaW1hcnlcIiBibG9jay8+XHJcbiAgPC9kaXY+XHJcbiAgICAgXHJcblxyXG5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2soe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgb25DbGljayxcclxuICBpZCxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGhlaWdodD17aGVpZ2h0fVxyXG4gICAgICB2aWV3Qm94PScwIDAgMjQgMjQnXHJcbiAgICAgIHdpZHRoPXt3aWR0aH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgaWQ9e2lkfVxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSBpZD17aWR9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgaWQ9e2lkfVxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek00IDEyYzAtNC40MiAzLjU4LTggOC04IDEuODUgMCAzLjU1LjYzIDQuOSAxLjY5TDUuNjkgMTYuOUM0LjYzIDE1LjU1IDQgMTMuODUgNCAxMnptOCA4Yy0xLjg1IDAtMy41NS0uNjMtNC45LTEuNjlMMTguMzEgNy4xQzE5LjM3IDguNDUgMjAgMTAuMTUgMjAgMTJjMCA0LjQyLTMuNTggOC04IDh6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIENlbnRlcih7IGNoaWxkcmVuLCBzdHlsZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgLi4uc3R5bGUsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJ2ljb25zL0Jsb2NrJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5pbXBvcnQgTGF5b3V0IGZyb20gJy4vTGF5b3V0JztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmdUb3A6IDY4XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrZWQoeyBoYW5nb3V0LCBvblVuYmxvY2ssIG9uQ2xvc2UgfSkge1xyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJibG9ja2VkLXVpXCI+XHJcbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxyXG4gICAgICAgIDxCbG9jayB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cInJlZFwiIC8+XHJcbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cclxuICAgICAgICAgIDxCdXR0b24gZGF0YS10ZXN0aWQ9J2Nsb3NlLWJ0bicgb25DbGljaz17b25DbG9zZX0gdGl0bGU9XCJDTE9TRVwiIGJnPVwic2Vjb25kYXJ5XCIgYmxvY2sgb3V0bGluZSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sXCI+XHJcbiAgICAgICAgICA8QnV0dG9uIGlkPSdVTkJMT0NLJyBvbkNsaWNrPXtvblVuYmxvY2t9IGRhdGEtdGVzdGlkPSd1bmJsb2NrLWJ0bicgdGl0bGU9XCJVTkJMT0NLXCIgYmc9XCJwcmltYXJ5XCIgYmxvY2sgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gRGVsZXRlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXJjaGl2ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17MjR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMjAuNTQgNS4yM2wtMS4zOS0xLjY4QzE4Ljg4IDMuMjEgMTguNDcgMyAxOCAzSDZjLS40NyAwLS44OC4yMS0xLjE2LjU1TDMuNDYgNS4yM0MzLjE3IDUuNTcgMyA2LjAyIDMgNi41VjE5YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNi41YzAtLjQ4LS4xNy0uOTMtLjQ2LTEuMjd6TTEyIDE3LjVMNi41IDEySDEwdi0yaDR2MmgzLjVMMTIgMTcuNXpNNS4xMiA1bC44MS0xaDEybC45NCAxSDUuMTJ6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSAnaWNvbnMvRGVsZXRlJztcclxuaW1wb3J0IHsgQXJjaGl2ZSB9IGZyb20gJ2ljb25zL0FyY2hpdmUnO1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gICdpY29ucy9CbG9jayc7XHJcbmltcG9ydCAgQnV0dG9uICBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpY29uQnRuOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbjogOCB9LFxyXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGJ0bkNvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbiAgYnRuT2s6IHtcclxuICAgIG1hcmdpbjogOCxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xyXG4gIG9uQmxvY2ssXHJcbiAgb25EZWxldGUsXHJcbiAgb25BcmNoaXZlLFxyXG4gIG9uTm90aWZpY2F0aW9uLFxyXG4gIG9uQ29udmVyc2F0aW9uSGlzdG9yeSxcclxuICBvbk5hdmlnYXRpb24sXHJcbiAgb25PayxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XHJcbiAgICAgICAgPENoZWNrYm94XHJcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxociAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Db250YWluZXJ9PlxyXG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gaWQ9XCJiY2t1aVwiIHRpdGxlPVwiQmxvY2tcIiBJY29uPXtCbG9ja30gb25DbGljaz17b25OYXZpZ2F0aW9ufSAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvbk9rfSB0aXRsZT1cIk9LXCIgYmc9XCJwcmltYXJ5XCIgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBJY29uQnV0dG9uKHsgSWNvbiwgdGl0bGUsIG9uQ2xpY2ssaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pY29uQnRufT5cclxuICAgICAgPGJ1dHRvbiBpZD17aWR9IHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xpY2t9IGRhdGEtdGVzdGlkPXtgJHtpZH0tYnRuYH0+XHJcbiAgICAgICAgPEljb24gaWQ9e2lkfS8+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8ZGl2Pnt0aXRsZX08L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENoZWNrYm94KHsgbGFiZWwsIG9uQ2hhbmdlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBtYXJnaW46IDgsIG1hcmdpblRvcDogOCB9fT5cclxuICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz5cclxuICAgICAgPGxhYmVsPntsYWJlbH08L2xhYmVsPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuLy9pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGJvcmRlckNvbG9yOiAnI2VlZWVlZScsXHJcbiAgICBib3JkZXJTdHlsZTogJ3NvbGlkJyxcclxuICAgIGJvcmRlcldpZHRoOiAxLFxyXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxyXG4gICAgcGFkZGluZzogMyxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIG1pbkhlaWdodDogMzUsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgfSxcclxuICB1c2VybmFtZTogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGxvZzoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgY29sb3I6ICcjNzM3MzczJyxcclxuICAgIGZvbnRTaXplOiAxMCxcclxuICB9LFxyXG4gIG1lc3NhZ2U6IHt9LFxyXG59O1xyXG4vL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSx0aW1lc3RhbXAgfSA9IG1lc3NhZ2U7XHJcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCB7IGRldmljZSB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIGZ1bmN0aW9uIGNvbnZlcnRNUyhtcykge1xyXG4gICAgdmFyIGQsIGgsIG0sIHM7XHJcbiAgICBzID0gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xyXG4gICAgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcclxuICAgIHMgPSBzICUgNjA7XHJcbiAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xyXG4gICAgbSA9IG0gJSA2MDtcclxuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XHJcbiAgICBoID0gaCAlIDI0O1xyXG4gICAgc2V0RGF5cyhkKTtcclxuICAgIHNldEhvdXJzKGgpO1xyXG4gICAgc2V0TWludXRlcyhtKTtcclxuICAgIHNldFNlY29uZHMocyk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYodGltZXN0YW1wKXtcclxuICBcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSB0aW1lc3RhbXApO1xyXG4gICAgICB9LCAwKTtcclxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcclxuICAgICAgfSwgNjAwMDApO1xyXG4gXHJcblxyXG4gICAgfVxyXG4gICBcclxuICB9LCBbdGltZXN0YW1wXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIG1hcmdpbkJvdHRvbTogMyB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VcIlxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2BtZXNzYWdlLWZvbnQtJHtkZXZpY2V9LXNpemVgfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH1cclxuICAgICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5sb2d9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XHJcbiAgPGRpdj5cclxuICAgICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA9PT0gMCAmJiBtaW51dGVzID4gMCAmJiA8ZGl2PnttaW51dGVzfSBtaW51dGVzIGFnbyA8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtob3Vyc30gaG91cnMge21pbnV0ZXN9IG1pbnV0ZXMgYWdveycgJ31cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAge2RheXMgPD0gMTAgJiYgZGF5cyA+IDEgJiYgPGRpdj57ZGF5c30gZGF5cyBhZ288L2Rpdj59XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAvLyBwb3NpdGlvbjonZml4ZWQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIC8vIGJvdHRvbToxMCxcclxuICAgIC8vIHJpZ2h0OjEwLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIC8vbWFyZ2luOjBcclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICBtYXJnaW5MZWZ0OiA4LFxyXG4gICAgbWFyZ2luUmlnaHQ6IDgsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgICB3aWR0aDogJzEwMCUnXHJcbiAgfSxcclxuXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBsb2FkaW5nLCBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlLCBoYW5nb3V0IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cCBtYi0zXCI+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiAgYXJpYS1sYWJlbD1cIlJlY2lwaWVudCdzIHVzZXJuYW1lXCIgYXJpYS1kZXNjcmliZWRieT1cImJ1dHRvbi1hZGRvbjJcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWlucHV0XCIgdmFsdWU9e21lc3NhZ2VUZXh0fSAvPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcIiB0eXBlPVwiYnV0dG9uXCIgbG9hZGluZz17bG9hZGluZ30gZGlzYWJsZWQ9e2hhbmdvdXQgJiYgaGFuZ291dC5zdGF0ZSA9PT0gJ0JMT0NLRUQnfSBpZD0nTUVTU0FHRScgb25DbGljaz17b25NZXNzYWdlfSBkYXRhLXRlc3RpZD0nc2VuZC1idG4nPlNlbmQ8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgZmxvYXQ6ICdyaWdodCcsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgZm9udFNpemU6IDE2LFxyXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VyTWVzc2FnZSh7IG1lc3NhZ2UgfSkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZXItbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9PC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlZE1lc3NhZ2UoeyBtZXNzYWdlLG9uTmF2aWdhdGlvbiB9KSB7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVOYXZpZ2F0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIG9uTmF2aWdhdGlvbihlKVxyXG4gICAgfVxyXG4gICAgZGVidWdnZXI7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlZC1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH1cclxuICAgIDxhIGlkPVwiVU5CTE9DS1wiIGRhdGEtdGVzdGlkPVwic2VlbW9yZS1idG5cIiBocmVmPVwiL1wiIG9uQ2xpY2s9e2hhbmRsZU5hdmlnYXRpb259PnNlZSBtb3JlPC9hPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgIE1lc3NhZ2UgIGZyb20gJy4vTWVzc2FnZSc7XHJcbmltcG9ydCAgTWVzc2FnZUVkaXRvciAgZnJvbSAnLi9NZXNzYWdlRWRpdG9yJztcclxuaW1wb3J0IHsgQmxvY2tlck1lc3NhZ2UgfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlJ1xyXG5pbXBvcnQge0Jsb2NrZWRNZXNzYWdlfSBmcm9tICcuL0Jsb2NrZWRNZXNzYWdlJ1xyXG5pbXBvcnQge3VzZU1lZGlhUXVlcnl9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBtZXNzYWdlQ29udGFpbmVyOiB7XHJcbiAgICAvLyB3aWR0aDogJzEwMCUnLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gIC8vICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxyXG4gICAgZmxleDogMyxcclxuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxyXG4gICAgb3ZlcmZsb3dYOiBcImhpZGRlblwiXHJcblxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lc3NhZ2VzKHtcclxuICBtZXNzYWdlcyxcclxuICBvbk1lc3NhZ2UsXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvbixcclxuICBsb2FkaW5nXHJcbn0pIHtcclxuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcclxuY29uc3Qge2RldmljZX09dXNlTWVkaWFRdWVyeSgpXHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobWVzc2FnZXMpIHtcclxuICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuICB9LCBbbWVzc2FnZXNdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25TZW5kKGUpIHtcclxuICAgIG9uTWVzc2FnZShlKTtcclxuICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGJveFNpemluZzogJ2JvcmRlci1ib3gnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJ319PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7Li4uc3R5bGVzLm1lc3NhZ2VDb250YWluZXIsZmxleDogZGV2aWNlPT09J3Bob25lJz80OjJ9fSByZWY9e3Njcm9sbGVyUmVmfT5cclxuICAgICAgICB7bWVzc2FnZXMgJiYgIFxyXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzOiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSwgdXNlcm5hbWUgfSkubWFwKFxyXG4gICAgICAgICAgICAobSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxyXG4gICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgIHshbS50eXBlICYmIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VyJyAmJiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZWQnICYmIDxCbG9ja2VkTWVzc2FnZSBtZXNzYWdlPXttfSBvbk5hdmlnYXRpb249e29uTmF2aWdhdGlvbn0vPn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgXHJcbiAgICAgICAgPE1lc3NhZ2VFZGl0b3JcclxuICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cclxuICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cclxuICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgLz5cclxuICAgICBcclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xyXG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcclxuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5zb3J0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0ICBNZXNzYWdlcyAgZnJvbSAnLi9tZXNzYWdlcyc7XHJcbmltcG9ydCBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XHJcbiAgbG9hZGluZyxcclxuICBtZXNzYWdlcyA9IFtdLFxyXG4gIG9uTWVzc2FnZVRleHQsXHJcbiAgb25NZXNzYWdlLFxyXG4gIG1lc3NhZ2VUZXh0LFxyXG4gIHVzZXJuYW1lLFxyXG4gIGhhbmdvdXQsXHJcbiAgb25OYXZpZ2F0aW9uLFxyXG5cclxufSkge1xyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGRvY3VtZW50LnRpdGxlPWhhbmdvdXQudXNlcm5hbWVcclxuXHJcbiAgfSxbXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cclxuICAgICAgPE1lc3NhZ2VzXHJcbiAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgIG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufVxyXG4gICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxyXG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxyXG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgbWVzc2FnZVRleHQgPXttZXNzYWdlVGV4dH1cclxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgIC8+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcblxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwXCIgey4uLnByb3BzfS8+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0SXRlbShwcm9wcykge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1hY3Rpb25cIiB7Li4ucHJvcHN9Lz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQge0xpc3RJdGVtfSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0IExpc3QsIHsgTGlzdEl0ZW0gfSBmcm9tICdjb250cm9scy9saXN0JztcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0JztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5cclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGlucHV0Q29udGFpbmVyOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBib3JkZXI6ICcjNzM3MzczIHNvbGlkIDFweCcsXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgcGFkZGluZzogMTAsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgYm9yZGVyOiAnd2hpdGUnLFxyXG5cclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dCh7XHJcbiAgaGFuZ291dHMsXHJcbiAgb25TZWFyY2hJbnB1dCxcclxuICBvbkZldGNoSGFuZ291dHMsXHJcbiAgb25TZWxlY3RIYW5nb3V0LFxyXG4gIHNlYXJjaFxyXG59KSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dFNlbGVjdGlvbihlKSB7XHJcbiAgICBjb25zdCBpZCA9IGUudGFyZ2V0LmlkXHJcbiAgICBvblNlbGVjdEhhbmdvdXQoZSlcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKGcgPT4gZy51c2VybmFtZSA9PT0gaWQpXHJcblxyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuXHJcbiAgICA8ZGl2ID5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cCBtYi0zXCI+XHJcbiAgICAgICAgPGlucHV0IHZhbHVlPXtzZWFyY2h9IGlkPVwic2VhcmNoLWlucHV0XCIgb25DaGFuZ2U9e29uU2VhcmNoSW5wdXR9IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgYXJpYS1sYWJlbD1cIlJlY2lwaWVudCdzIHVzZXJuYW1lXCIgYXJpYS1kZXNjcmliZWRieT1cImJ1dHRvbi1hZGRvbjJcIiAvPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcIiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJidXR0b24tYWRkb24yXCIgb25DbGljaz17b25GZXRjaEhhbmdvdXRzfSBkYXRhLXRlc3RpZD1cInNlYXJjaC1idG5cIiBkaXNhYmxlZD17IXNlYXJjaH0+U2VhcmNoPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8TGlzdCBpZD1cImhhbmdvdXRzLWxpc3RcIj5cclxuICAgICAgICB7aGFuZ291dHMgJiZcclxuICAgICAgICAgIGhhbmdvdXRzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGhhbmdvdXRzLm1hcCgoZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxMaXN0SXRlbSBpZD17Zy51c2VybmFtZX0gZGF0YS10ZXN0aWQ9e2cudXNlcm5hbWV9IG9uQ2xpY2s9e2hhbmRsZUhhbmdvdXRTZWxlY3Rpb259PlxyXG4gICAgICAgICAgICAgICAge2cudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICA8L0xpc3Q+XHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGVyc29uQWRkSWNvbih7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICd3aGl0ZScsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTE1IDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptLTktMlY3SDR2M0gxdjJoM3YzaDJ2LTNoM3YtMkg2em05IDRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IFBlcnNvbkFkZCBmcm9tICdpY29ucy9QZXJzb25BZGQnO1xyXG5pbXBvcnQgIFRleHRJbnB1dCAgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCAgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gIH0sXHJcbn07XHJcbi8vXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZSh7IGhhbmdvdXQsIG9uSW52aXRlLCBvbk1lc3NhZ2VUZXh0LG1lc3NhZ2VUZXh0LCBsb2FkaW5nIH0pIHtcclxuXHJcbiAgXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH1pZD1cImludml0ZS11aVwiPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxQZXJzb25BZGQgY29sb3I9XCJncmVlblwiIC8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIFN0YXJ0IENvbnZlcnNhdGlvbiB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPFRleHRJbnB1dCBpZD1cIm1lc3NhZ2VUZXh0SW5wdXRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gdmFsdWU9e21lc3NhZ2VUZXh0fSAvPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxCdXR0b24gbG9hZGluZz17bG9hZGluZ30gIGlkPVwiSU5WSVRFXCIgb25DbGljaz17b25JbnZpdGV9IGRhdGEtdGVzdGlkPSdvbmludml0ZS1idG4nIHRpdGxlPVwiU2VuZCBJbnZpdGVcIiBiZz1cInByaW1hcnlcIi8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBEb25lKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J005IDE2LjJMNC44IDEybC0xLjQgMS40TDkgMTkgMjEgN2wtMS40LTEuNEw5IDE2LjJ6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgRG9uZSB9IGZyb20gJ2ljb25zL0RvbmUnO1xyXG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgIExheW91dCAgZnJvbSAnLi9MYXlvdXQnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVlKHsgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8RG9uZSB3aWR0aD1cIjcwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cImdyZWVuXCIgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPHA+XHJcbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxyXG4gICAgICAgICAgeW91ciBpbnZpdGlvbiBoYXMgYmVlbiBhY2NlcHRlZC5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBNZXNzYWdlICBmcm9tICcuL21lc3NhZ2VzL01lc3NhZ2UnO1xyXG5pbXBvcnQgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICByb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIHBhZGRpbmdUb3A6IDcwLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgcGFkZGluZ0JvdHRvbTo4LFxyXG4gXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZXIoeyBoYW5nb3V0LCBvbkFjY2VwdCwgb25EZWNsaW5lLGxvYWRpbmcgfSkge1xyXG4gXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luTGVmdDogOCwgZGlzcGxheTonZmxleCcgfX0+XHJcbiAgICAgICAgICB7aGFuZ291dCAmJiBoYW5nb3V0Lm1lc3NhZ2UgJiYgKFxyXG4gICAgICAgICAgICA8TWVzc2FnZVxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U9e1xyXG4gICAgICAgICAgICAgICAgaGFuZ291dCAmJlxyXG4gICAgICAgICAgICAgICAgaGFuZ291dC5tZXNzYWdlICYmIHtcclxuICAgICAgICAgICAgICAgICAgLi4uaGFuZ291dC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxmbG9hdDonbGVmdCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJERUNMSU5FXCJcclxuICAgICAgICAgICAgb25DbGljaz17b25EZWNsaW5lfVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlY2xpbmUtYnRuXCJcclxuICAgICAgICAgICAgdGl0bGU9XCJEZWNsaW5lXCJcclxuICAgICAgICAgICAgYmxvY2tcclxuICAgICAgICAgICAgYmc9XCJkYW5nZXJcIlxyXG4gICAgICAgICAgICBvdXRsaW5lXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgXHJcbiAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sXCI+XHJcbiAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJBQ0NFUFRcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkFjY2VwdH1cclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NlcHQtYnRuXCJcclxuICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICAgICAgdGl0bGU9XCJBY2NlcHRcIlxyXG4gICAgICAgICAgICBiZz1cInByaW1hcnlcIlxyXG5cclxuICAgICAgICAgICAgYmxvY2tcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICBcclxuICAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KXtcclxuICAgIHJldHVybiB1bnJlYWRoYW5nb3V0cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIChhY2N1bXVsYXRvciA9IFt7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9XSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IG9iaiA9IGFjY3VtdWxhdG9yLmZpbmQoXHJcbiAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lICYmIGN1cnJlbnQuc3RhdGUgPT09ICdNRVNTQU5HRVInXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGFjY3VtdWxhdG9yLmZpbmRJbmRleChcclxuICAgICAgICAgICAgICAoYSkgPT4gYS51c2VybmFtZSA9PT0gY3VycmVudC51c2VybmFtZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5zcGxpY2UoaW5kZXgsIDEsIHtcclxuICAgICAgICAgICAgICAuLi5vYmosXHJcbiAgICAgICAgICAgICAgbWVzc2FnZUNvdW50OiArK29iai5tZXNzYWdlQ291bnQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcclxuICAgICAgICAgICAgYWNjdW11bGF0b3IucHVzaCh7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xyXG4gICAgICB9LCBbXSk7XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBMaXN0LCB7IExpc3RJdGVtIH0gZnJvbSAnY29udHJvbHMvbGlzdCc7XHJcbmltcG9ydCB7IHJlZHVjZXJVbnJlYWRoYW5nb3V0cyB9IGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVbnJlYWRIYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzLCBvblNlbGVjdFVucmVhZCwgb25SZW1vdmVVbnJlYWQgfSkge1xyXG5cclxuICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9IHVzZVN0YXRlKFtdKVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodW5yZWFkaGFuZ291dHMpIHtcclxuXHJcbiAgICAgIGNvbnN0IHJlZHVjZWQgPSByZWR1Y2VyVW5yZWFkaGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyB9KVxyXG5cclxuICAgICAgc2V0SXRlbXMocmVkdWNlZClcclxuICAgIH1cclxuXHJcbiAgfSwgW3VucmVhZGhhbmdvdXRzXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9J3VucmVhZGhhbmdvdXRzJyBjbGFzc05hbWU9XCJsaXN0LWdyb3VwXCI+XHJcbiAgICAgIHtpdGVtcyAmJlxyXG4gICAgICAgIGl0ZW1zLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICBpdGVtcy5tYXAoKHUpID0+IHtcclxuICAgICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXJcIiBvbkNsaWNrPXtvblNlbGVjdFVucmVhZH0gaWQ9e3UudXNlcm5hbWV9IGRhdGEtdGVzdGlkPXtgJHt1LnVzZXJuYW1lfS1zZWxlY3RgfT5cclxuICAgICAgICAgICAge3UudXNlcm5hbWV9IG1lc3NhZ2VzOiB7dS5tZXNzYWdlQ291bnR9XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlIGJhZGdlLWRhbmdlciBiYWRnZS1waWxsXCIgb25DbGljaz17b25SZW1vdmVVbnJlYWR9IGlkPXt1LnVzZXJuYW1lfSBkYXRhLXRlc3RpZD17YCR7dS51c2VybmFtZX0tcmVtb3ZlYH0+eDwvc3Bhbj5cclxuICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgIH0pfVxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IG1lc3NhZ2VzID1bXHJcbiAgICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxyXG4gIH0sXHJcbiAgIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBPayBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMjE2MzQ2MixcclxuICB9LHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgSG93IGFyZSB5b3UgZGVtb2AsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgYWxsIHJpZ2h0YCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzY3NzU3MyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ2LFxyXG4gIH0sXHJcbiAgLFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonZGVtbycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDgsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG5dIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgQXBwUm91dGUgfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSc7XHJcbmltcG9ydCBCbG9jayBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrJ1xyXG5pbXBvcnQgQmxvY2tlZCBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrZWQnXHJcbmltcG9ydCBDb25maWd1cmUgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9Db25maWd1cmUnXHJcbmltcG9ydCBIYW5nY2hhdCBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdjaGF0J1xyXG5pbXBvcnQgSGFuZ291dCBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXQnXHJcbmltcG9ydCBJbnZpdGUgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGUnXHJcbmltcG9ydCBJbnZpdGVlIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlZSdcclxuaW1wb3J0IEludml0ZXIgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVyJ1xyXG5pbXBvcnQgVW5yZWFkSGFuZ291dHMgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9VbnJlYWRIYW5nb3V0cydcclxuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9NZXNzYWdlJ1xyXG5jb25zdCBoYW5nb3V0cyA9IFtcclxuICAgIHsgdXNlcm5hbWU6ICd1c2Vyb25lJyB9LFxyXG4gICAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXHJcbiAgICB7IHVzZXJuYW1lOiAndXNlcnRocmVlJyB9LFxyXG5dO1xyXG5jb25zdCBoYW5nb3V0ID0ge1xyXG4gICAgdXNlcm5hbWU6ICd0ZXN0dXNlcicsXHJcbiAgICBlbWFpbDogJ3Rlc3RAZ21haWwuY29tJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogYExldCdzIGNoYXQgb24gSGFuZ291dCFgLCB0aW1lc3RhbXA6IDE1OTA4MjA3ODI5MjEgfSxcclxufTtcclxuY29uc3QgbWVzc2FnZSA9IHtcclxuICAgIHVzZXJuYW1lOiAnYnJlbm8nLFxyXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzY3ODM2LFxyXG59O1xyXG4vL1xyXG5pbXBvcnQge21lc3NhZ2VzfSBmcm9tICcuL2Zha2VNZXNzYWdlcydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dFJvdXRlcygpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tcIj5cclxuICAgICAgICAgICAgPEJsb2NrIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja2VkXCI+XHJcbiAgICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cclxuICAgICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0cz17aGFuZ291dHN9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ2NoYXRcIj5cclxuICAgICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nb3V0XCI+XHJcbiAgICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pbnZpdGVcIj5cclxuICAgICAgICAgICAgPEludml0ZSBoYW5nb3V0cz17aGFuZ291dHN9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZXJcIj5cclxuICAgICAgICAgICAgPEludml0ZXIgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZWVcIj5cclxuICAgICAgICAgICAgPEludml0ZWUgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL3VucmVhZGhhbmdvdXRzXCI+XHJcbiAgICAgICAgICAgIDxVbnJlYWRIYW5nb3V0cyB1bnJlYWRoYW5nb3V0cz17aGFuZ291dHN9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IDIwLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZWVlZWVlZScgfX0+XHJcbiAgICAgICAgICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfSB1c2VybmFtZT17aGFuZ291dC51c2VybmFtZX0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvbWVzc2FnZXNcIj5cclxuICAgICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgIF1cclxufSAiLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyBBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IHsgT25saW5lU3RhdHVzIH0gZnJvbSAnaWNvbnMvb25saW5lU3RhdHVzJztcclxuaW1wb3J0IHsgSWNvbnNEZW1vIH0gZnJvbSAnLi9JY29uc0RlbW8nXHJcbmltcG9ydCBBdXRoRGVtb1JvdXRlcyBmcm9tICcuL2F1dGhlbnRpY2F0aW9uL3JvdXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50c1JvdXRlcyBmcm9tICcuL2NvbXBvbmVudHMvcm91dGUnXHJcbmltcG9ydCBIYW5nb3V0Um91dGVzIGZyb20gJy4vaGFuZ291dC9yb3V0ZSdcclxuXHJcbi8vIGNvbnN0IGhhbmdvdXRzID0gW1xyXG4vLyAgIHsgdXNlcm5hbWU6ICd1c2Vyb25lJyB9LFxyXG4vLyAgIHsgdXNlcm5hbWU6ICd1c2VydHdvJyB9LFxyXG4vLyAgIHsgdXNlcm5hbWU6ICd1c2VydGhyZWUnIH0sXHJcbi8vIF07XHJcbi8vIGNvbnN0IGhhbmdvdXQgPSB7XHJcbi8vICAgdXNlcm5hbWU6ICd0ZXN0dXNlcicsXHJcbi8vICAgZW1haWw6ICd0ZXN0QGdtYWlsLmNvbScsXHJcbi8vICAgbWVzc2FnZTogeyB0ZXh0OiBgTGV0J3MgY2hhdCBvbiBIYW5nb3V0IWAsIHRpbWVzdGFtcDogMTU5MDgyMDc4MjkyMSB9LFxyXG4vLyB9O1xyXG4vLyBjb25zdCBtZXNzYWdlID0ge1xyXG4vLyAgIHVzZXJuYW1lOiAnYnJlbm8nLFxyXG4vLyAgIHRleHQ6IGBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcclxuLy8gICB0aW1lc3RhbXA6IDE1OTEzMzE3Njc4MzYsXHJcbi8vIH07XHJcbi8vIC8vXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdG9yeWJvb2tSb3V0ZXMoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCd9fT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvb25saW5lXCI+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxPbmxpbmVTdGF0dXMgb25saW5lIC8+XHJcbiAgICAgICAgICA8T25saW5lU3RhdHVzIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgXHJcbiAgICBcclxuXHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ljb25zXCI+XHJcbiAgICAgICAgPEljb25zRGVtbyAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXV0aERlbW9Sb3V0ZXMvPlxyXG4gICAgICA8Q29tcG9uZW50c1JvdXRlcy8+XHJcbiAgICAgIDxIYW5nb3V0Um91dGVzLz5cclxuICAgIDwvZGl2PlxyXG5cclxuICApXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdmJhcihwcm9wcykge1xyXG4gICAgY29uc3QgeyBiZyA9ICdsaWdodCcsIGJyYW5kLCBjaGlsZHJlbiB9ID0gcHJvcHNcclxuICAgIHJldHVybiA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciBuYXZiYXItZXhwYW5kLWxnIG5hdmJhci0ke2JnfSBiZy0ke2JnfWB9PlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIjXCI+e2JyYW5kfTwvYT5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCIgYXJpYS1jb250cm9scz1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiVG9nZ2xlIG5hdmlnYXRpb25cIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXItaWNvblwiPjwvc3Bhbj5cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgIFxyXG4gICAgPC9uYXY+XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyQ29sbGFwc2Uoe2NoaWxkcmVufSl7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyTmF2KHsgY2hpbGRyZW4gfSkge1xyXG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1yLWF1dG9cIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L3VsPlxyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHsgY2hpbGRyZW4gfSkge1xyXG4gIFxyXG4gICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPntjaGlsZHJlbn08L2xpPlxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkxpbmsocHJvcHMpIHtcclxuICAgIGNvbnN0IHthcHBSb3V0ZX09cHJvcHNcclxuICAgIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBcclxuICAgICAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6YC8ke2lkfWAscm91dGU6YXBwUm91dGV9KVxyXG4gICAgICB9XHJcbiAgICByZXR1cm4gPGEgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBocmVmPVwiI1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSAgey4uLnByb3BzfS8+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2RHJvcGRvd24ocHJvcHMpIHtcclxuICAgIGNvbnN0IHt0aXRsZSxjaGlsZHJlbn09cHJvcHNcclxuICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW0gZHJvcGRvd25cIiA+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwibmF2LWxpbmsgZHJvcGRvd24tdG9nZ2xlXCIgaHJlZj1cIiNcIiBpZD1cIm5hdmJhckRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiey4uLnByb3BzfT5cclxuICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2xpPlxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERyb3Bkb3duTWVudShwcm9wcykge1xyXG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHNcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJuYXZiYXJEcm9wZG93blwiPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRHJvcGRvd25JdGVtIChwcm9wcyl7XHJcbiAgICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTonLycscm91dGU6YC8ke2lkfWB9KVxyXG4gICAgICB9XHJcbiAgICByZXR1cm4gICAgPGEgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCIjXCIgey4uLnByb3BzfSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0vPlxyXG59IiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IFN0b3J5Ym9va1Byb3ZpZGVycyBmcm9tICcuL1N0b3J5Ym9va1Byb3ZpZGVycydcclxuaW1wb3J0IFN0b3J5Ym9va1JvdXRlcyBmcm9tICcuL1N0b3J5Ym9va1JvdXRlcydcclxuaW1wb3J0IE5hdmJhciwgeyBOYXZCYXJOYXYsIE5hdkl0ZW0sIE5hdkxpbmssIE5hdkJhckNvbGxhcHNlIH0gZnJvbSAnY29tcG9uZW50cy9uYXYtYmFyJ1xyXG5pbXBvcnQgTmF2RHJvcGRvd24sIHsgRHJvcGRvd25NZW51LCBEcm9wZG93bkl0ZW0gfSBmcm9tICdjb21wb25lbnRzL25hdi1iYXIvbmF2LWRyb3Bkb3duJ1xyXG5cclxucmVuZGVyKFxyXG4gIDxTdG9yeWJvb2tQcm92aWRlcnM+XHJcbiAgICA8TmF2YmFyIGJyYW5kPVwiU3Rvcnlib29rXCIgYmc9XCJkYXJrXCI+XHJcbiAgICAgIDxOYXZCYXJDb2xsYXBzZT5cclxuICAgICAgICA8TmF2QmFyTmF2PlxyXG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiQ29tcG9uZW50c1wiPlxyXG4gICAgICAgICAgICA8RHJvcGRvd25NZW51PlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJidXR0b25cIj5CdXR0b25zPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cInRleHQtaW5wdXRcIj5UZXh0SW5wdXQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwidG9hc3RcIj5Ub2FzdDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJhbGVydFwiPkFsZXJ0PC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgIDwvRHJvcGRvd25NZW51PlxyXG4gICAgICAgICAgPC9OYXZEcm9wZG93bj5cclxuICAgICAgICAgIDxOYXZEcm9wZG93biB0aXRsZT1cIkF1dGhlbnRpY2F0aW9uXCI+XHJcbiAgICAgICAgICAgIDxEcm9wZG93bk1lbnU+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImxvZ2luXCI+TG9naW48L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwic2lnbnVwXCI+U2lnbnVwPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImNoYW5nZS1wYXNzd29yZFwiPkNoYW5nZSBQYXNzd29yZDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJmb3Jnb3QtcGFzc3dvcmRcIj5Gb3Jnb3QgUGFzc3dvcmQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgPC9Ecm9wZG93bk1lbnU+XHJcbiAgICAgICAgICA8L05hdkRyb3Bkb3duPlxyXG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiSGFuZ291dFwiPlxyXG4gICAgICAgICAgICA8RHJvcGRvd25NZW51PlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJibG9ja1wiPkJsb2NrPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImJsb2NrZWRcIj5CbG9ja2VkPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImNvbmZpZ3VyZVwiPkNvbmZpZ3VyZTwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJoYW5nY2hhdFwiPkhhbmdjaGF0PC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImhhbmdvdXRcIj5IYW5nb3V0PC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImludml0ZVwiPkludml0ZTwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJpbnZpdGVlXCI+SW52aXRlZTwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJpbnZpdGVyXCI+SW52aXRlcjwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJ1bnJlYWRoYW5nb3V0c1wiPlVucmVhZEhhbmdvdXRzPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgIDwvRHJvcGRvd25NZW51PlxyXG4gICAgICAgICAgPC9OYXZEcm9wZG93bj5cclxuICAgICAgICA8L05hdkJhck5hdj5cclxuICAgICAgPC9OYXZCYXJDb2xsYXBzZT5cclxuICAgIDwvTmF2YmFyPlxyXG4gICAgPFN0b3J5Ym9va1JvdXRlcyAvPlxyXG4gIDwvU3Rvcnlib29rUHJvdmlkZXJzPlxyXG5cclxuICAsXHJcbiAgZG9jdW1lbnQuYm9keVxyXG4pO1xyXG4iXSwibmFtZXMiOlsidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJ1c2VBcHBSb3V0ZSIsImRpc3BhdGNoIiwibmFtZSIsIm9uQXBwUm91dGUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsIkFwcFJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImZpbmQiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInVzZUVmZmVjdCIsImdldEl0ZW0iLCJwYXJzZSIsInZhbHVlIiwidXNlTWVtbyIsIkFwcFByb3ZpZGVycyIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXIiLCJPbmxpbmVTdGF0dXMiLCJyZWFkeVN0YXRlIiwiSXNPbmxpbmUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsImNvdW50IiwiY29sb3IiLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiTWVzc2FnZSIsIkljb25zRGVtbyIsIlRleHRJbnB1dCIsImxhYmVsIiwiaXNWYWxpZCIsIm1lc3NhZ2UiLCJ1bmRlZmluZWQiLCJCdXR0b24iLCJ0aXRsZSIsImJnIiwib3V0bGluZSIsInNpemUiLCJsb2FkaW5nIiwiYmxvY2siLCJBbGVydCIsImFsZXJ0IiwiTG9naW4iLCJlbWFpbG9ydXNlcm5hbWUiLCJwYXNzd29yZCIsIm9uTG9naW4iLCJvbkZvY3VzIiwib25DaGFuZ2UiLCJ2YWxpZGF0aW9uIiwib25Gb3Jnb3RQYXNzd29yZCIsIm9uQmx1ciIsImVycm9yIiwibWFyZ2luIiwicGFkZGluZyIsInZhbGlkYXRpb25TdWNjZXNzIiwidmFsaWRhdGlvbkVycm9yIiwiTG9naW5TdGF0ZXMiLCJTaWdudXAiLCJ1c2VybmFtZSIsImVtYWlsIiwib25TaWdudXAiLCJTaWdudXBTdGF0ZXMiLCJDaGFuZ2VQYXNzd29yZCIsImNvbmZpcm0iLCJvblBhc3N3b3JkQ2hhbmdlIiwiQ2hhbmdlUGFzc3dvcmRTdGF0ZXMiLCJSZXF1ZXN0UGFzc0NoYW5nZSIsIm9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlIiwiRm9yZm90UGFzc3dvcmRTdGF0ZSIsIkZvcmdvdFBhc3N3b3JkIiwiQXV0aERlbW9Sb3V0ZXMiLCJTaWduVXBTdGF0ZXMiLCJGb3Jnb3RQYXNzd29yZFN0YXRlcyIsIkJ1dHRvbkRlbW8iLCJmbGV4RGlyZWN0aW9uIiwiVGV4dElucHV0U3RhdGVzIiwiVG9hc3QiLCJ1c2VySW1hZ2UiLCJUb2FzdERlbW8iLCJBbGVydERlbW8iLCJDb21wb25lbnRzUm91dGUiLCJzdHlsZXMiLCJyb290IiwiTGF5b3V0IiwiaWQiLCJjaGVja2JveCIsIm1hcmdpblJpZ2h0IiwiY2hlY2tib3hSb290IiwibGF5b3V0IiwiYm94U2l6aW5nIiwicGFkZGluZ1RvcCIsImJ0biIsImZsZXgiLCJCbG9jayIsIm9uQ2FuY2VsIiwib25CbG9jayIsIm9uUmVwb3J0IiwiZmlsbCIsIm9uQ2xpY2siLCJDZW50ZXIiLCJCbG9ja2VkIiwiaGFuZ291dCIsIm9uVW5ibG9jayIsIm9uQ2xvc2UiLCJEZWxldGUiLCJBcmNoaXZlIiwiaWNvbkJ0biIsImJ0bkNvbnRhaW5lciIsImJ0bk9rIiwiQ29uZmlndXJlIiwib25EZWxldGUiLCJvbkFyY2hpdmUiLCJvbk5vdGlmaWNhdGlvbiIsIm9uQ29udmVyc2F0aW9uSGlzdG9yeSIsIm9uTmF2aWdhdGlvbiIsIm9uT2siLCJJY29uQnV0dG9uIiwiSWNvbiIsIkNoZWNrYm94IiwibWFyZ2luVG9wIiwidXNlTWVkaWFRdWVyeSIsInNldFdpZHRoIiwidXNlU3RhdGUiLCJzZXRIZWlnaHQiLCJvcmllbnRhdGlvbiIsInNldE9yaWVudGF0aW9uIiwiZGV2aWNlIiwic2V0RGV2aWNlIiwiaGFuZGxlVmlld3BvcnRTaXplIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwiaGFuZGxlU2NyZWVuT3JpZW50YXRpb24iLCJzY3JlZW4iLCJjb25zb2xlIiwibG9nIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJvcmRlckNvbG9yIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJXaWR0aCIsIm1pbkhlaWdodCIsImZvbnRTaXplIiwiZmxvYXQiLCJ0aW1lc3RhbXAiLCJkYXlzIiwic2V0RGF5cyIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJkIiwiaCIsIk1hdGgiLCJmbG9vciIsInNldFRpbWVvdXQiLCJEYXRlIiwibm93Iiwic2V0SW50ZXJ2YWwiLCJtYXJnaW5Cb3R0b20iLCJ0ZXh0IiwiTWVzc2FnZUVkaXRvciIsIm1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlVGV4dCIsIm9uTWVzc2FnZSIsIkJsb2NrZXJNZXNzYWdlIiwiQmxvY2tlZE1lc3NhZ2UiLCJoYW5kbGVOYXZpZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJtZXNzYWdlQ29udGFpbmVyIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImxlbmd0aCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtYXAiLCJtc2ciLCJzb3J0IiwiSGFuZ2NoYXQiLCJkb2N1bWVudCIsIkxpc3QiLCJMaXN0SXRlbSIsIkhhbmdvdXQiLCJoYW5nb3V0cyIsIm9uU2VhcmNoSW5wdXQiLCJvbkZldGNoSGFuZ291dHMiLCJvblNlbGVjdEhhbmdvdXQiLCJzZWFyY2giLCJoYW5kbGVIYW5nb3V0U2VsZWN0aW9uIiwidGFyZ2V0IiwiUGVyc29uQWRkSWNvbiIsIkludml0ZSIsIm9uSW52aXRlIiwiUGVyc29uQWRkIiwiRG9uZSIsIkludml0ZWUiLCJwYWRkaW5nQm90dG9tIiwiSW52aXRlciIsIm9uQWNjZXB0Iiwib25EZWNsaW5lIiwibWFyZ2luTGVmdCIsInJlZHVjZXJVbnJlYWRoYW5nb3V0cyIsInVucmVhZGhhbmdvdXRzIiwicmVkdWNlIiwiYWNjdW11bGF0b3IiLCJpbmRleCIsIm1lc3NhZ2VDb3VudCIsIm9iaiIsImZpbmRJbmRleCIsInNwbGljZSIsInB1c2giLCJVbnJlYWRIYW5nb3V0cyIsIm9uU2VsZWN0VW5yZWFkIiwib25SZW1vdmVVbnJlYWQiLCJpdGVtcyIsInNldEl0ZW1zIiwicmVkdWNlZCIsIkhhbmdvdXRSb3V0ZXMiLCJTdG9yeWJvb2tSb3V0ZXMiLCJDb21wb25lbnRzUm91dGVzIiwiTmF2YmFyIiwiYnJhbmQiLCJOYXZCYXJDb2xsYXBzZSIsIk5hdkJhck5hdiIsIk5hdkRyb3Bkb3duIiwiRHJvcGRvd25NZW51IiwiRHJvcGRvd25JdGVtIiwiaGFuZGxlUm91dGUiLCJyZW5kZXIiLCJTdG9yeWJvb2tQcm92aWRlcnMiLCJib2R5Il0sIm1hcHBpbmdzIjoiQUFBRyxJQUFDLENBQUMsQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDhEQUE4RCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLHlCQUF5QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBNEssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQXVELENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBNS9SLElBQUlBLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxFQUFFLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNQLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDQSxHQUFDLENBQUMsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUF5RSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPWSxHQUFDLENBQUMsVUFBVSxDQUFDLE9BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBdUcsU0FBU0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0wsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFrRCxTQUFTYyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNiLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDTyxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQXlOLFNBQVMsQ0FBQyxFQUFFLENBQUNFLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNiLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNQLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDSixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYyxHQUFDLENBQUMsQ0FBQ2QsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZSxHQUFDLENBQUMsQ0FBQ2YsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUdGLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUVELEdBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUVDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1YsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMs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
