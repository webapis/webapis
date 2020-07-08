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
  APP_ROUTE_CHANGED: "APP_ROUTE_CHANGED" //  FEATURE_ROUTE_CHANGED:'FEATURE_ROUTE_CHANGED'

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
    throw new Error("useAppRouteContext must be used with AppRouteProvider");
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
      route: "/",
      featureRoute: "/hangouts",
      name: "storybook"
    }
  }, children);
}

const style = {
  width: 15,
  height: 15,
  border: "white 2px solid"
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
      backgroundColor: "green"
    },
    "data-testid": "online"
  });
}
function IsOffline() {
  return h("div", {
    style: { ...style,
      backgroundColor: "red"
    },
    "data-testid": "offline"
  });
}
function Connecting() {
  return h("div", {
    style: { ...style,
      backgroundColor: "orange"
    },
    "data-testid": "connecting"
  });
}
function Closing() {
  return h("div", {
    style: { ...style,
      backgroundColor: "pink"
    },
    "data-testid": "closing"
  });
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
    className: `form-control ${isValid && "is-valid"} ${!isValid && isValid !== undefined && "is-invalid"}`,
    id: name,
    "aria-describedby": name
  }, props)), !isValid && h("small", {
    id: "emailHelp",
    className: `${!isValid && "invalid-feedback"}`,
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
    className: `${bg && !outline && `btn btn-${bg}`} ${outline && `btn btn-outline-${bg}`} ${size && `btn btn-${size}`} ${block && "btn-block"}`
  }, props, {
    disabled: loading
  }), loading && h("span", {
    class: "spinner-border spinner-border-sm",
    role: "status",
    "aria-hidden": "true"
  }), loading ? "wait..." : title);
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
    message: validation && validation["emailorusername"].message,
    isValid: validation && validation["emailorusername"].isValid
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
    message: validation && validation["password"].message,
    isValid: validation && validation["password"].isValid
  }), h("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
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
    message: "."
  },
  password: {
    isValid: true,
    message: "."
  }
};
const validationError = {
  emailorusername: {
    isValid: false,
    message: "invalid credentials"
  },
  password: {
    isValid: false,
    message: "invalid credentials"
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
      message: "Server is unavailable"
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
    isValid: validation && validation["username"].isValid,
    message: validation && validation["username"].message
  }), h(TextInput, {
    onBlur: onBlur,
    onFocus: onFocus,
    label: "Email",
    onChange: onChange,
    value: email,
    type: "email",
    "data-testid": "email",
    name: "email",
    isValid: validation && validation["email"].isValid,
    message: validation && validation["email"].message
  }), h(TextInput, {
    onBlur: onBlur,
    onFocus: onFocus,
    label: "Password",
    onChange: onChange,
    value: password,
    type: "password",
    "data-testid": "password",
    name: "password",
    isValid: validation && validation["password"].isValid,
    message: validation && validation["password"].message
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
    message: "."
  },
  password: {
    isValid: true,
    message: "."
  },
  email: {
    isValid: true,
    message: "."
  }
};
const validationError$1 = {
  username: {
    isValid: false,
    message: "Username is not valid"
  },
  password: {
    isValid: false,
    message: "Pasword is not valid"
  },
  email: {
    isValid: false,
    message: "Email is not valid"
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
      message: "Server is unavailable"
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
    isValid: validation && validation["password"].isValid,
    message: validation && validation["password"].message
  }), h(TextInput, {
    label: "Confirm",
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    onChange: onChange,
    isValid: validation && validation["confirm"].isValid,
    message: validation && validation["confirm"].message
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
    message: "."
  },
  confirm: {
    isValid: true,
    message: "."
  }
};
const validationError$2 = {
  password: {
    isValid: false,
    message: "invalid password format"
  },
  confirm: {
    isValid: false,
    message: "invalid password format"
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
      message: "Server is unavailable"
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
    isValid: validation && validation["email"].isValid,
    message: validation && validation["email"].message
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
    message: "."
  }
};
const validationError$3 = {
  email: {
    isValid: false,
    message: "Invalid email format"
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
      message: "Server is unavailable"
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
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "center",
      backgroundColor: "yellow"
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
      display: "flex"
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

function GearIcon(props) {
  const {
    color
  } = props;
  return h("svg", _extends({}, props, {
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    className: "bi bi-gear",
    fill: color,
    xmlns: "http://www.w3.org/2000/svg"
  }), h("path", _extends({}, props, {
    "fill-rule": "evenodd",
    d: "M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z"
  })), h("path", _extends({}, props, {
    "fill-rule": "evenodd",
    d: "M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z"
  })));
}

const styles = {
  root: {
    backgroundColor: "#eeeeee",
    height: "100%",
    position: 'relative'
  }
};
function Layout({
  children,
  style,
  id,
  hangout,
  onNavigation
}) {
  return h("div", {
    "data-testid": id,
    style: { ...styles.root,
      ...style
    }
  }, children);
}

const style$1 = {
  checkbox: {
    marginRight: 8
  },
  checkboxRoot: {
    display: "flex",
    alignItems: "center",
    padding: 16
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68
  }
};
function Block({
  onCancel,
  onBlock,
  onReport
}) {
  return h(Layout, {
    style: style$1.layout
  }, h("div", {
    style: style$1.checkboxRoot
  }, h("input", {
    type: "checkbox",
    style: style$1.checkbox,
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
  fill = "none",
  color = "black",
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
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      ...style
    }
  }, children);
}

const style$2 = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68
  }
};
function Blocked({
  hangout,
  onUnblock,
  onClose
}) {
  return h(Layout, {
    style: style$2.layout,
    id: "blocked-ui"
  }, h(Center, {
    style: {
      flexDirection: "column",
      alignItems: "center"
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
  color = "black",
  fill = "none"
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
  color = "black",
  fill = "none"
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

const style$3 = {
  iconBtn: {
    display: "flex",
    alignItems: "center",
    margin: 8
  },
  btn: {
    marginRight: 8
  },
  btnContainer: {
    display: "flex",
    flexDirection: "column"
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%"
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
    style: style$3.layout
  }, h("div", null, h(Checkbox, {
    label: "Notifications",
    onChange: onNotification
  }), h(Checkbox, {
    label: "Conversation History",
    onChange: onConversationHistory
  })), h("hr", null), h("div", {
    style: style$3.btnContainer
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
    style: style$3.iconBtn
  }, h("button", {
    id: id,
    style: style$3.btn,
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
  const [orientation, setOrientation] = v$1("");
  const [device, setDevice] = v$1("");

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
          setDevice("phone");
          break;

        case width <= 768:
        case width <= 992:
        case width <= 1200:
          setDevice("tablet");
          break;

        case width <= 2560:
          setDevice("laptop");
          break;

        case width > 2560:
          setDevice("desktop");
          break;

        default:
          setDevice("");
      }
    }
  }, [width]);
  p$1(() => {
    console.log("device", device);
  }, [device]);
  p$1(() => {
    handleViewportSize();
    handleScreenOrientation();
    window.addEventListener("orientationchange", handleScreenOrientation);
    window.addEventListener("resize", () => handleViewportSize);
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

const style$4 = {
  root: {
    borderColor: "#eeeeee",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 35,
    backgroundColor: "white"
  },
  username: {
    marginRight: 8
  },
  log: {
    display: "flex",
    color: "#737373",
    fontSize: 10
  },
  message: {}
}; //

function Message(props) {
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
      width: "100%",
      marginBottom: 3
    }
  }, h("div", {
    style: { ...style$4.root,
      float
    }
  }, h("div", {
    "data-testid": "message",
    style: style$4.message,
    className: `message-font-${device}-size`
  }, message && message.text), h("div", {
    style: style$4.log
  }, h("div", {
    style: style$4.username
  }, username && username, ":"), h("div", null, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", " "), days <= 10 && days > 1 && h("div", null, days, " days ago")))));
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
    disabled: hangout && hangout.state === "BLOCKED",
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  }, "Send"))));
}

const style$5 = {
  color: "red",
  float: "right",
  width: "100%",
  fontSize: 16,
  textAlign: "end"
};
function BlockerMessage({
  message
}) {
  return h("div", {
    style: style$5,
    "data-testid": "blocker-message"
  }, message.text);
}

const style$6 = {
  color: "red",
  float: "right",
  width: "100%",
  fontSize: 16,
  textAlign: "end"
};
function BlockedMessage({
  message,
  onNavigation
}) {
  function handleNavigation(e) {
    e.preventDefault();
    onNavigation(e);
  }

  return h("div", {
    style: style$6,
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
    boxSizing: "border-box",
    padding: 3,
    //  backgroundColor: 'orange',
    flex: 3,
    overflowY: "auto",
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
      boxSizing: "border-box",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }
  }, h("div", {
    style: { ...styles$1.messageContainer,
      flex: device === "phone" ? 4 : 2
    },
    ref: scrollerRef
  }, messages && messages.length > 0 && floatMessages({
    messages: sortMessages({
      messages
    }),
    username
  }).map(m => h("div", {
    style: {
      display: "flex"
    }
  }, " ", !m.type && h(Message, {
    message: m
  }), m.type && m.type === "blocker" && h(BlockerMessage, {
    message: m
  }), m.type && m.type === "blocked" && h(BlockedMessage, {
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
          float: "right",
          username: "me"
        };
      } else {
        return { ...msg,
          float: "left"
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
    if (hangout) {
      document.title = hangout.username;
    }
  }, [hangout]);
  return h(Layout, {
    id: "hangchat-ui",
    onNavigation: onNavigation
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
  return h("div", null, h("div", {
    class: "input-group mb-3"
  }, h("input", {
    value: search,
    id: "search-input",
    onChange: onSearchInput,
    type: "text",
    className: "form-control",
    "aria-label": "Recipient's username",
    "aria-describedby": "button-addon2",
    "data-testid": "search-input"
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
      onClick: onSelectHangout
    }, g.username);
  })));
}

function PersonAddIcon({
  height = 24,
  width = 24,
  color = "black",
  fill = "white",
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

const style$7 = {
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
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
    style: style$7.layout,
    id: "invite-ui"
  }, h(Center, null, h(PersonAddIcon, {
    color: "green"
  })), h(Center, null, "Start Conversation with ", h("b", null, hangout && hangout.email)), h(TextInput, {
    id: "messageTextInput",
    onChange: onMessageText,
    value: messageText,
    "data-testid": "messageTextInput"
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
  fill = "none",
  color = "black",
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

const style$8 = {
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  }
};
function Invitee({
  hangout,
  dispatch
}) {
  return h(Layout, {
    style: style$8.layout,
    id: "invitee-ui"
  }, h(Center, null, h(Done, {
    width: "70",
    height: "70",
    color: "green"
  })), h(Center, null, h("p", null, "You will be able to chat with ", h("b", null, hangout && hangout.email), " once your invition has been accepted.")));
}

const style$9 = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    paddingTop: 70,
    boxSizing: "border-box",
    justifyContent: "space-between",
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
    style: style$9.root
  }, h("div", {
    style: {
      marginLeft: 8,
      display: "flex"
    }
  }, hangout && hangout.message && h(Message, {
    message: hangout && hangout.message && { ...hangout.message,
      username: hangout.username,
      float: "left"
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
      const obj = accumulator.find(a => a.username === current.username && current.state === "MESSANGER");

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
  username: "breno",
  text: `Let's Chat on Hangout!`,
  timestamp: 1591331789971
}, {
  username: "demo",
  text: `Ok Let's Chat on Hangout!`,
  timestamp: 1591332163462
}, {
  username: "breno",
  text: `How are you demo`,
  timestamp: 1591333635723
}, {
  username: "breno",
  text: `Are you all right`,
  timestamp: 1591333677573
}, {
  username: "demo",
  text: `Yes I am. How are you`,
  timestamp: 1591333728046
},, {
  username: "demo",
  text: `Are you doing greate`,
  timestamp: 1591333728047
}, {
  username: "demo",
  text: `Are you doing greate`,
  timestamp: 1591333728047
}, {
  username: "breno",
  text: `Yes i am`,
  timestamp: 1591333728048
}, {
  username: "breno",
  text: `Yes i am`,
  timestamp: 1591333728049
}, {
  username: "breno",
  text: `Yes i am`,
  timestamp: 1591333728049
}, {
  username: "breno",
  text: `Yes i am`,
  timestamp: 1591333728049
}, {
  username: "breno",
  text: `Yes i am`,
  timestamp: 1591333728049
}];

const hangouts = [{
  username: "userone"
}, {
  username: "usertwo"
}, {
  username: "userthree"
}];
const hangout = {
  username: "testuser",
  email: "test@gmail.com",
  message: {
    text: `Let's chat on Hangout!`,
    timestamp: 1590820782921
  }
};
const message = {
  username: "breno",
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
      backgroundColor: "#eeeeeee"
    }
  }, h(Message, {
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

function BootstrapIcons() {
  return h(GearIcon, null);
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
      height: "85vh"
    }
  }, h(AppRoute, {
    path: "/online"
  }, h("div", null, h(OnlineStatus, {
    online: true
  }), h(OnlineStatus, null))), h(AppRoute, {
    path: "/icons"
  }, h(BootstrapIcons, null)), h(AuthDemoRoutes, null), h(ComponentsRoute, null), h(HangoutRoutes, null));
}

function Navbar(props) {
  const {
    bg = "light",
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
      featureRoute: "/",
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
  id: "icons"
}, "Icons"), h(DropdownItem, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2luZGV4LmpzIiwiLi4vU3Rvcnlib29rUHJvdmlkZXJzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL2J1dHRvbi9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvYWxlcnQvaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2xvZ2luLnN0YXRlcy5qcyIsIi4uLy4uL2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvc2lnbnVwLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL3NpZ251cC5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2NoYW5nZS1wYXNzd29yZC5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2ZvcmdvdC1wYXNzd29yZC5zdGF0ZXMuanMiLCIuLi9hdXRoZW50aWNhdGlvbi9yb3V0ZS5qcyIsIi4uL2NvbXBvbmVudHMvYnV0dG9uL2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy90ZXh0LWlucHV0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy90b2FzdC91c2VyLnBuZyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvdG9hc3QvaW5kZXguanMiLCIuLi9jb21wb25lbnRzL3RvYXN0L2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy9hbGVydC9pbmRleC5qcyIsIi4uL2NvbXBvbmVudHMvcm91dGUuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL2Jvb3RzdHJhcC9HZWFySWNvbi5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvTGF5b3V0LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9jay5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvQmxvY2suanMiLCIuLi8uLi9jb21wb25lbnRzL2xheW91dC9DZW50ZXIuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrZWQuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0RlbGV0ZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQ29uZmlndXJlLmpzIiwiLi4vLi4vY29tcG9uZW50cy9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvTWVzc2FnZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvTWVzc2FnZUVkaXRvci5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvQmxvY2tlck1lc3NhZ2UuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL0Jsb2NrZWRNZXNzYWdlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9pbmRleC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ2NoYXQuanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL2xpc3QvaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXQuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL1BlcnNvbkFkZC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9Eb25lLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL1VucmVhZEhhbmdvdXRzLmpzIiwiLi4vaGFuZ291dC9mYWtlTWVzc2FnZXMuanMiLCIuLi9oYW5nb3V0L3JvdXRlLmpzIiwiLi4vaWNvbnMvaW5kZXguanMiLCIuLi9TdG9yeWJvb2tSb3V0ZXMuanMiLCIuLi8uLi9jb21wb25lbnRzL25hdi1iYXIvaW5kZXguanMiLCIuLi8uLi9jb21wb25lbnRzL25hdi1iYXIvbmF2LWRyb3Bkb3duLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPSB7XG4gIEFQUF9ST1VURV9DSEFOR0VEOiBcIkFQUF9ST1VURV9DSEFOR0VEXCIsXG4gIC8vICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcbn07XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gXCIuL2FjdGlvblR5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgcm91dGU6IGFjdGlvbi5yb3V0ZSxcbiAgICAgICAgZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlLFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlciwgdXNlTWVtbywgdXNlRWZmZWN0IH0gZnJvbSBcInByZWFjdC9ob29rc1wiO1xuaW1wb3J0IHsgcmVkdWNlciB9IGZyb20gXCIuL3JlZHVjZXJcIjtcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSBcIi4vYWN0aW9uVHlwZXNcIjtcbmNvbnN0IEFwcFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xuXG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInVzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyXCIpO1xuICB9XG4gIHJldHVybiBjb250ZXh0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XG5cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3QgeyBmZWF0dXJlUm91dGUgfSA9IHN0YXRlO1xuXG4gIGlmIChwYXRoICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwUm91dGUoKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XG4gIGNvbnN0IHsgbmFtZSB9ID0gc3RhdGU7XG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoeyByb3V0ZSwgZmVhdHVyZVJvdXRlIH0pIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obmFtZSwgSlNPTi5zdHJpbmdpZnkoeyByb3V0ZSwgZmVhdHVyZVJvdXRlIH0pKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUsIHJvdXRlIH0pO1xuICB9XG5cbiAgcmV0dXJuIHsgb25BcHBSb3V0ZSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGUocHJvcHMpIHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xuXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XG4gIGNvbnN0IHsgcm91dGUgfSA9IHN0YXRlO1xuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChwYXRocyAmJiByb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gcm91dGUpKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLm5hbWUgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSkpIHtcbiAgICAgIGNvbnN0IHsgZmVhdHVyZVJvdXRlLCByb3V0ZSB9ID0gSlNPTi5wYXJzZShcbiAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSlcbiAgICAgICk7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUsIHJvdXRlIH0pO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5pbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IEFwcFJvdXRlUHJvdmlkZXIgZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPEFwcFJvdXRlUHJvdmlkZXJcbiAgICAgIC8vXG4gICAgICB0aXRsZT1cIldlYmNvbVwiXG4gICAgICBpbml0U3RhdGU9e3sgcm91dGU6IFwiL1wiLCBmZWF0dXJlUm91dGU6IFwiL2hhbmdvdXRzXCIsIG5hbWU6IFwic3Rvcnlib29rXCIgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmNvbnN0IHN0eWxlID0ge1xuICB3aWR0aDogMTUsXG4gIGhlaWdodDogMTUsXG5cbiAgYm9yZGVyOiBcIndoaXRlIDJweCBzb2xpZFwiLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBPbmxpbmVTdGF0dXMoeyByZWFkeVN0YXRlIH0pIHtcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICByZXR1cm4gPElzT25saW5lIC8+O1xuICB9IGVsc2UgaWYgKHJlYWR5U3RhdGUgPT09IDApIHtcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMikge1xuICAgIHJldHVybiA8Q2xvc2luZyAvPjtcbiAgfVxuICByZXR1cm4gPElzT2ZmbGluZSAvPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT25saW5lKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6IFwiZ3JlZW5cIiB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiBcInJlZFwiIH19XG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvbm5lY3RpbmcoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogXCJvcmFuZ2VcIiB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJjb25uZWN0aW5nXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDbG9zaW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6IFwicGlua1wiIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xuICBjb25zdCB7IGxhYmVsLCBuYW1lLCB0eXBlLCBpc1ZhbGlkLCBtZXNzYWdlIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgcC0wXCI+XG4gICAgICA8bGFiZWwgZm9yPXtuYW1lfT57bGFiZWx9PC9sYWJlbD5cbiAgICAgIDxpbnB1dFxuICAgICAgICB0eXBlPXt0eXBlfVxuICAgICAgICBjbGFzc05hbWU9e2Bmb3JtLWNvbnRyb2wgJHtpc1ZhbGlkICYmIFwiaXMtdmFsaWRcIn0gJHtcbiAgICAgICAgICAhaXNWYWxpZCAmJiBpc1ZhbGlkICE9PSB1bmRlZmluZWQgJiYgXCJpcy1pbnZhbGlkXCJcbiAgICAgICAgfWB9XG4gICAgICAgIGlkPXtuYW1lfVxuICAgICAgICBhcmlhLWRlc2NyaWJlZGJ5PXtuYW1lfVxuICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAvPlxuICAgICAgeyFpc1ZhbGlkICYmIChcbiAgICAgICAgPHNtYWxsXG4gICAgICAgICAgaWQ9XCJlbWFpbEhlbHBcIlxuICAgICAgICAgIGNsYXNzTmFtZT17YCR7IWlzVmFsaWQgJiYgXCJpbnZhbGlkLWZlZWRiYWNrXCJ9YH1cbiAgICAgICAgICBkYXRhLXRlc3RpZD17YG1lc3NhZ2UtJHtuYW1lfWB9XG4gICAgICAgID5cbiAgICAgICAgICB7bWVzc2FnZX1cbiAgICAgICAgPC9zbWFsbD5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCdXR0b24ocHJvcHMpIHtcbiAgY29uc3QgeyB0aXRsZSwgYmcgPSBcImxpZ2h0XCIsIG91dGxpbmUsIHNpemUsIGxvYWRpbmcgPSBmYWxzZSwgYmxvY2sgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgY2xhc3NOYW1lPXtgJHtiZyAmJiAhb3V0bGluZSAmJiBgYnRuIGJ0bi0ke2JnfWB9ICR7XG4gICAgICAgIG91dGxpbmUgJiYgYGJ0biBidG4tb3V0bGluZS0ke2JnfWBcbiAgICAgIH0gJHtzaXplICYmIGBidG4gYnRuLSR7c2l6ZX1gfSAke2Jsb2NrICYmIFwiYnRuLWJsb2NrXCJ9YH1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIGRpc2FibGVkPXtsb2FkaW5nfVxuICAgID5cbiAgICAgIHtsb2FkaW5nICYmIChcbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtXCJcbiAgICAgICAgICByb2xlPVwic3RhdHVzXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9zcGFuPlxuICAgICAgKX1cbiAgICAgIHtsb2FkaW5nID8gXCJ3YWl0Li4uXCIgOiB0aXRsZX1cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChwcm9wcykge1xuICBjb25zdCB7IGFsZXJ0LCBtZXNzYWdlIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17YGFsZXJ0IGFsZXJ0LSR7YWxlcnR9YH0gcm9sZT1cImFsZXJ0XCIgZGF0YS10ZXN0aWQ9XCJhbGVydFwiPlxuICAgICAge21lc3NhZ2V9XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzcz1cImNsb3NlXCJcbiAgICAgICAgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2VcIlxuICAgICAgPlxuICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tIFwiY29udHJvbHMvdGV4dC1pbnB1dFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5pbXBvcnQgQWxlcnQgZnJvbSBcImNvbnRyb2xzL2FsZXJ0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbihwcm9wcykge1xuICBjb25zdCB7XG4gICAgZW1haWxvcnVzZXJuYW1lLFxuICAgIHBhc3N3b3JkLFxuICAgIGxvYWRpbmcsXG4gICAgb25Mb2dpbixcbiAgICBvbkZvY3VzLFxuICAgIG9uQ2hhbmdlLFxuICAgIHZhbGlkYXRpb24sXG4gICAgb25Gb3Jnb3RQYXNzd29yZCxcbiAgICBvbkJsdXIsXG4gICAgZXJyb3IsXG4gIH0gPSBwcm9wcztcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIlxuICAgICAgc3R5bGU9e3sgbWFyZ2luOiAxNSwgcGFkZGluZzogMTYgfX1cbiAgICA+XG4gICAgICB7bG9hZGluZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIiBzdHlsZT1cImhlaWdodDogNXB4O1wiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIlxuICAgICAgICAgICAgcm9sZT1cInByb2dyZXNzYmFyXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVub3c9XCIxMDBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgICBzdHlsZT1cIndpZHRoOiAxMDAlXCJcbiAgICAgICAgICA+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgIHZhbHVlPXtlbWFpbG9ydXNlcm5hbWV9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgbGFiZWw9XCJFbWFpbCBvciB1c2VybmFtZVwiXG4gICAgICAgIG5hbWU9XCJlbWFpbG9ydXNlcm5hbWVcIlxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIGlkPVwiZW1haWxvcnVzZXJuYW1lXCJcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJlbWFpbG9ydXNlcm5hbWVcIlxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJlbWFpbG9ydXNlcm5hbWVcIl0ubWVzc2FnZX1cbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wiZW1haWxvcnVzZXJuYW1lXCJdLmlzVmFsaWR9XG4gICAgICAvPlxuXG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgIG9uQmx1cj17b25CbHVyfVxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgIGlkPVwicGFzc3dvcmRcIlxuICAgICAgICBkYXRhLXRlc3RpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wicGFzc3dvcmRcIl0ubWVzc2FnZX1cbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wicGFzc3dvcmRcIl0uaXNWYWxpZH1cbiAgICAgIC8+XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIgfX0+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBpZD1cImxvZ2luLWJ0blwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2dpbi1idG5cIlxuICAgICAgICAgIG9uQ2xpY2s9e29uTG9naW59XG4gICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgICB0aXRsZT1cIkxvZ2luXCJcbiAgICAgICAgICBiZz1cInByaW1hcnlcIlxuICAgICAgICAvPlxuXG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtvbkZvcmdvdFBhc3N3b3JkfVxuICAgICAgICAgIGlkPVwiZm9yZ290cGFzc3dvcmRcIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZm9yZ290cGFzc3dvcmRcIlxuICAgICAgICAgIG91dGxpbmVcbiAgICAgICAgICBiZz1cInByaW1hcnlcIlxuICAgICAgICAgIHRpdGxlPVwiRm9yZ290IFBhc3N3b3JkIVwiXG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgTG9naW4gZnJvbSBcImZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvTG9naW5cIjtcbmNvbnN0IHZhbGlkYXRpb25TdWNjZXNzID0ge1xuICBlbWFpbG9ydXNlcm5hbWU6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogXCIuXCIgfSxcbiAgcGFzc3dvcmQ6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogXCIuXCIgfSxcbn07XG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB7XG4gIGVtYWlsb3J1c2VybmFtZTogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogXCJpbnZhbGlkIGNyZWRlbnRpYWxzXCIgfSxcbiAgcGFzc3dvcmQ6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IFwiaW52YWxpZCBjcmVkZW50aWFsc1wiIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9naW5TdGF0ZXMoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPiBMb2dpbiBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxuXG4gICAgICAgICAgPExvZ2luXG4gICAgICAgICAgICBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiXG4gICAgICAgICAgICBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkxvZ2luIFZhbGlkYXRpb24gRXJyb3I8L2g1PlxuXG4gICAgICAgICAgPExvZ2luXG4gICAgICAgICAgICBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiXG4gICAgICAgICAgICBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uRXJyb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5Mb2dnaW5nIGluPC9oNT5cbiAgICAgICAgICA8TG9naW5cbiAgICAgICAgICAgIGVtYWlsb3J1c2VybmFtZT1cInRlc3R1c2VyXCJcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgICAgbG9hZGluZ1xuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+TG9nZ2luZyBTZXJ2ZXIgZXJyb3I8L2g1PlxuICAgICAgICAgIDxMb2dpblxuICAgICAgICAgICAgZW1haWxvcnVzZXJuYW1lPVwidGVzdHVzZXJcIlxuICAgICAgICAgICAgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9XG4gICAgICAgICAgICBlcnJvcj17eyBtZXNzYWdlOiBcIlNlcnZlciBpcyB1bmF2YWlsYWJsZVwiIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSBcImNvbnRyb2xzL3RleHQtaW5wdXRcIjtcbmltcG9ydCBBbGVydCBmcm9tIFwiY29udHJvbHMvYWxlcnRcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cChwcm9wcykge1xuICBjb25zdCB7XG4gICAgdXNlcm5hbWUsXG4gICAgcGFzc3dvcmQsXG4gICAgZW1haWwsXG4gICAgbG9hZGluZyxcbiAgICBvblNpZ251cCxcbiAgICBvbkNoYW5nZSxcbiAgICB2YWxpZGF0aW9uLFxuICAgIG9uQmx1cixcbiAgICBvbkZvY3VzLFxuICAgIGVycm9yLFxuICB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiXG4gICAgICBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fVxuICAgID5cbiAgICAgIHtsb2FkaW5nICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIHByb2dyZXNzLWJhci1hbmltYXRlZFwiXG4gICAgICAgICAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW5vdz1cIjEwMFwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcbiAgICAgICAgICAgIHN0eWxlPVwid2lkdGg6IDEwMCVcIlxuICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge2Vycm9yICYmIDxBbGVydCBhbGVydD1cImRhbmdlclwiIG1lc3NhZ2U9e2Vycm9yLm1lc3NhZ2V9IC8+fVxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBvbkJsdXI9e29uQmx1cn1cbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICAgICAgbGFiZWw9XCJVc2VybmFtZVwiXG4gICAgICAgIHZhbHVlPXt1c2VybmFtZX1cbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIGRhdGEtdGVzdGlkPVwidXNlcm5hbWVcIlxuICAgICAgICBuYW1lPVwidXNlcm5hbWVcIlxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJ1c2VybmFtZVwiXS5pc1ZhbGlkfVxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJ1c2VybmFtZVwiXS5tZXNzYWdlfVxuICAgICAgLz5cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgIGxhYmVsPVwiRW1haWxcIlxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIHZhbHVlPXtlbWFpbH1cbiAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJlbWFpbFwiXG4gICAgICAgIG5hbWU9XCJlbWFpbFwiXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImVtYWlsXCJdLmlzVmFsaWR9XG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImVtYWlsXCJdLm1lc3NhZ2V9XG4gICAgICAvPlxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBvbkJsdXI9e29uQmx1cn1cbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICAgICAgbGFiZWw9XCJQYXNzd29yZFwiXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICBkYXRhLXRlc3RpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wicGFzc3dvcmRcIl0uaXNWYWxpZH1cbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wicGFzc3dvcmRcIl0ubWVzc2FnZX1cbiAgICAgIC8+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBvbkNsaWNrPXtvblNpZ251cH1cbiAgICAgICAgaWQ9XCJzaWdudXAtYnRuXCJcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJzaWdudXAtYnRuXCJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgdGl0bGU9XCJTaWdudXBcIlxuICAgICAgICBiZz1cInByaW1hcnlcIlxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgU2lnbnVwIGZyb20gXCJmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL3NpZ251cFwiO1xuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPSB7XG4gIHVzZXJuYW1lOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6IFwiLlwiIH0sXG4gIHBhc3N3b3JkOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6IFwiLlwiIH0sXG4gIGVtYWlsOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6IFwiLlwiIH0sXG59O1xuY29uc3QgdmFsaWRhdGlvbkVycm9yID0ge1xuICB1c2VybmFtZTogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogXCJVc2VybmFtZSBpcyBub3QgdmFsaWRcIiB9LFxuICBwYXNzd29yZDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogXCJQYXN3b3JkIGlzIG5vdCB2YWxpZFwiIH0sXG4gIGVtYWlsOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiBcIkVtYWlsIGlzIG5vdCB2YWxpZFwiIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2lnbnVwU3RhdGVzKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWdudXAgVmFsaWRhdGlvbiBTdWNjZXNzPC9oNT5cbiAgICAgICAgICA8U2lnbnVwXG4gICAgICAgICAgICB1c2VybmFtZT1cInRlc3R1c2VyXCJcbiAgICAgICAgICAgIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIlxuICAgICAgICAgICAgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWdudXAgVmFsaWRhdGlvbiBFcnJvcjwvaDU+XG4gICAgICAgICAgPFNpZ251cFxuICAgICAgICAgICAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiXG4gICAgICAgICAgICBlbWFpbD1cInRlc3RAZ21haWwuY29tXCJcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25FcnJvcn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2lnbmluZyB1cDwvaDU+XG4gICAgICAgICAgPFNpZ251cFxuICAgICAgICAgICAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiXG4gICAgICAgICAgICBlbWFpbD1cInRlc3RAZ21haWwuY29tXCJcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgICAgbG9hZGluZ1xuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2lnbmluZyBTZXZlciBlcnJvcjwvaDU+XG4gICAgICAgICAgPFNpZ251cFxuICAgICAgICAgICAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiXG4gICAgICAgICAgICBlbWFpbD1cInRlc3RAZ21haWwuY29tXCJcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgICAgZXJyb3I9e3sgbWVzc2FnZTogXCJTZXJ2ZXIgaXMgdW5hdmFpbGFibGVcIiB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSBcImNvbnRyb2xzL3RleHQtaW5wdXRcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcImNvbnRyb2xzL2J1dHRvblwiO1xuaW1wb3J0IEFsZXJ0IGZyb20gXCJjb250cm9scy9hbGVydFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDaGFuZ2VQYXNzd29yZChwcm9wcykge1xuICBjb25zdCB7XG4gICAgcGFzc3dvcmQsXG4gICAgY29uZmlybSxcbiAgICB2YWxpZGF0aW9uLFxuICAgIG9uQ2hhbmdlLFxuICAgIG9uUGFzc3dvcmRDaGFuZ2UsXG4gICAgbG9hZGluZyxcbiAgICBlcnJvcixcbiAgfSA9IHByb3BzO1xuXG4gIC8vIHVzZUVmZmVjdCgoKSA9PiB7XG4gIC8vICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAvLyAgIHZhciB1cmx0b2tlbiA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KCd0b2tlbicpO1xuXG4gIC8vICAgaWYgKHVybHRva2VuKSB7XG4gIC8vICAgICBkaXNwYXRjaChhY3Rpb25zLmdldFRva2VuRnJvbVVybCh7IHRva2VuOiB1cmx0b2tlbiB9KSk7XG4gIC8vICAgfVxuICAvLyB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJjb2wtbWQtNCBib3JkZXIgbXgtYXV0byByb3VuZGVkXCJcbiAgICAgIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19XG4gICAgPlxuICAgICAge2xvYWRpbmcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCJcbiAgICAgICAgICAgIHJvbGU9XCJwcm9ncmVzc2JhclwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbm93PVwiMTAwXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxuICAgICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMTAwJVwiXG4gICAgICAgICAgPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7ZXJyb3IgJiYgPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT17ZXJyb3IubWVzc2FnZX0gLz59XG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIGxhYmVsPVwiUGFzc3dvcmRcIlxuICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgIGlkPVwicGFzc3dvcmRcIlxuICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcInBhc3N3b3JkXCJdLmlzVmFsaWR9XG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcInBhc3N3b3JkXCJdLm1lc3NhZ2V9XG4gICAgICAvPlxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBsYWJlbD1cIkNvbmZpcm1cIlxuICAgICAgICB2YWx1ZT17Y29uZmlybX1cbiAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgaWQ9XCJjb25maXJtXCJcbiAgICAgICAgbmFtZT1cImNvbmZpcm1cIlxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImNvbmZpcm1cIl0uaXNWYWxpZH1cbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wiY29uZmlybVwiXS5tZXNzYWdlfVxuICAgICAgLz5cbiAgICAgIDxCdXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIGRhdGEtdGVzdGlkPVwiY2hhbmdlLXBhc3MtYnRuXCJcbiAgICAgICAgb25DbGljaz17b25QYXNzd29yZENoYW5nZX1cbiAgICAgICAgdGl0bGU9XCJDaGFuZ2VcIlxuICAgICAgICBiZz1cInByaW1hcnlcIlxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgQ2hhbmdlUGFzc3dvcmQgZnJvbSBcImZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvQ2hhbmdlUGFzc3dvcmRcIjtcbmNvbnN0IHZhbGlkYXRpb25TdWNjZXNzID0ge1xuICBwYXNzd29yZDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiBcIi5cIiB9LFxuICBjb25maXJtOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6IFwiLlwiIH0sXG59O1xuY29uc3QgdmFsaWRhdGlvbkVycm9yID0ge1xuICBwYXNzd29yZDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogXCJpbnZhbGlkIHBhc3N3b3JkIGZvcm1hdFwiIH0sXG4gIGNvbmZpcm06IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IFwiaW52YWxpZCBwYXNzd29yZCBmb3JtYXRcIiB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkU3RhdGVzKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj4gQ2hhbmdlUGFzc3dvcmQgVmFsaWRhdGlvbiBTdWNjZXNzPC9oNT5cbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmRcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIGNvbmZpcm09XCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5DaGFuZ2VQYXNzd29yZCBWYWxpZGF0aW9uIEVycm9yPC9oNT5cbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkNoYW5nZVBhc3N3b3JkIGluIHByb2dyZXNzPC9oNT5cbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmRcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIGNvbmZpcm09XCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9XG4gICAgICAgICAgICBsb2FkaW5nXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5DaGFuZ2VQYXNzd29yZCBTZXJ2ZXIgZXJyb3I8L2g1PlxuICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZFxuICAgICAgICAgICAgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgY29uZmlybT1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31cbiAgICAgICAgICAgIGVycm9yPXt7IG1lc3NhZ2U6IFwiU2VydmVyIGlzIHVuYXZhaWxhYmxlXCIgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmltcG9ydCBBbGVydCBmcm9tIFwiY29udHJvbHMvYWxlcnRcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlcXVlc3RQYXNzQ2hhbmdlKHByb3BzKSB7XG4gIGNvbnN0IHtcbiAgICBlbWFpbCxcbiAgICB2YWxpZGF0aW9uLFxuICAgIG9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlLFxuICAgIGxvYWRpbmcsXG4gICAgb25DaGFuZ2UsXG4gICAgZXJyb3IsXG4gIH0gPSBwcm9wcztcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIlxuICAgICAgc3R5bGU9e3sgbWFyZ2luOiAxNSwgcGFkZGluZzogMTYgfX1cbiAgICA+XG4gICAgICB7bG9hZGluZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIiBzdHlsZT1cImhlaWdodDogNXB4O1wiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIlxuICAgICAgICAgICAgcm9sZT1cInByb2dyZXNzYmFyXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVub3c9XCIxMDBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgICBzdHlsZT1cIndpZHRoOiAxMDAlXCJcbiAgICAgICAgICA+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXG4gICAgICAgIHZhbHVlPXtlbWFpbH1cbiAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgICBpZD1cImVtYWlsXCJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wiZW1haWxcIl0uaXNWYWxpZH1cbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wiZW1haWxcIl0ubWVzc2FnZX1cbiAgICAgIC8+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBvbkNsaWNrPXtvblJlcXVlc3RQYXNzd29yZENoYW5nZX1cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJyZXF1ZXN0cGFzc2NoYW5nZS1idG5cIlxuICAgICAgICB0aXRsZT1cIlJlcXVlc3QgcGFzc3dvcmQgY2hhbmdlXCJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IEZvcmdvdFBhc3N3b3JkIGZyb20gXCJmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkXCI7XG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHsgZW1haWw6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogXCIuXCIgfSB9O1xuY29uc3QgdmFsaWRhdGlvbkVycm9yID0ge1xuICBlbWFpbDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIGVtYWlsIGZvcm1hdFwiIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9yZm90UGFzc3dvcmRTdGF0ZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+IEZvcmdvdFBhc3N3b3JkIFZhbGlkYXRpb24gU3VjY2VzczwvaDU+XG5cbiAgICAgICAgICA8Rm9yZ290UGFzc3dvcmRcbiAgICAgICAgICAgIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIlxuICAgICAgICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5Gb3Jnb3RQYXNzd29yZCBWYWxpZGF0aW9uIEVycm9yPC9oNT5cblxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCBlbWFpbD1cInRlc3RnbWFpbC5jb21cIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uRXJyb3J9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+UmVxdWVzdCBQYXNzd29yZCBDaGFuZ2UgaW4gcHJvZ3Jlc3M8L2g1PlxuXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkXG4gICAgICAgICAgICBlbWFpbD1cInRlc3RAZ21haWwuY29tXCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgICAgbG9hZGluZ1xuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TZXJ2ZXIgZXJyb3I8L2g1PlxuXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkXG4gICAgICAgICAgICBlbWFpbD1cInRlc3RAZ21haWwuY29tXCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgICAgZXJyb3I9e3sgbWVzc2FnZTogXCJTZXJ2ZXIgaXMgdW5hdmFpbGFibGVcIiB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5pbXBvcnQgTG9naW5TdGF0ZXMgZnJvbSBcIi4vc3RhdGVzL2xvZ2luLnN0YXRlc1wiO1xuaW1wb3J0IFNpZ25VcFN0YXRlcyBmcm9tIFwiLi9zdGF0ZXMvc2lnbnVwLnN0YXRlc1wiO1xuaW1wb3J0IENoYW5nZVBhc3N3b3JkU3RhdGVzIGZyb20gXCIuL3N0YXRlcy9jaGFuZ2UtcGFzc3dvcmQuc3RhdGVzXCI7XG5pbXBvcnQgRm9yZ290UGFzc3dvcmRTdGF0ZXMgZnJvbSBcIi4vc3RhdGVzL2ZvcmdvdC1wYXNzd29yZC5zdGF0ZXNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhEZW1vUm91dGVzKCkge1xuICByZXR1cm4gW1xuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2xvZ2luXCI+XG4gICAgICA8TG9naW5TdGF0ZXMgLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9zaWdudXBcIj5cbiAgICAgIDxTaWduVXBTdGF0ZXMgLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9jaGFuZ2UtcGFzc3dvcmRcIj5cbiAgICAgIDxDaGFuZ2VQYXNzd29yZFN0YXRlcyAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ZvcmdvdC1wYXNzd29yZFwiPlxuICAgICAgPEZvcmdvdFBhc3N3b3JkU3RhdGVzIC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gIF07XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCdXR0b25EZW1vKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxuICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ5ZWxsb3dcIixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGRpdj5cbiAgICAgICAgPGgzPkZpbGxlZCBCdXR0b25zPC9oMz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIj5QcmltYXJ5PC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIj5TZWNvbmRhcnk8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvbiBiZz1cInN1Y2Nlc3NcIj5TdWNjZXNzPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gYmc9XCJkYW5nZXJcIj5EYW5nZXI8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIj5XYXJuaW5nPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gYmc9XCJpbmZvXCI+SW5mbzwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uIGJnPVwibGlnaHRcIj5MaWdodDwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiPkRhcms8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvbiBiZz1cImxpbmtcIj5MaW5rPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMz5PdXRsaW5lZCBCdXR0b25zPC9oMz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiBvdXRsaW5lPXt0cnVlfSB0aXRsZT1cIlByaW1hcnlcIiAvPlxuICAgICAgICA8QnV0dG9uIGJnPVwic2Vjb25kYXJ5XCIgb3V0bGluZSB0aXRsZT1cIlNlY29uZGFyeVwiIC8+XG4gICAgICAgIDxCdXR0b24gYmc9XCJzdWNjZXNzXCIgb3V0bGluZSB0aXRsZT1cIlN1Y2Nlc3NcIiAvPlxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFuZ2VyXCIgb3V0bGluZSB0aXRsZT1cIkRhbmdlclwiIC8+XG4gICAgICAgIDxCdXR0b24gYmc9XCJ3YXJuaW5nXCIgb3V0bGluZSB0aXRsZT1cIldhcm5pbmdcIiAvPlxuICAgICAgICA8QnV0dG9uIGJnPVwiaW5mb1wiIG91dGxpbmUgdGl0bGU9XCJJbmZvXCIgLz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cImxpZ2h0XCIgb3V0bGluZSB0aXRsZT1cIkxpZ2h0XCIgLz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cImRhcmtcIiBvdXRsaW5lIHRpdGxlPVwiRGFya1wiIC8+XG4gICAgICAgIDxCdXR0b24gYmc9XCJsaW5rXCIgb3V0bGluZSB0aXRsZT1cIkxpbmtcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoMz5TbWFsbCBCdXR0b25zPC9oMz5cbiAgICAgICAgICA8QnV0dG9uIGJnPVwicHJpbWFyeVwiIHNpemU9XCJzbVwiIHRpdGxlPVwibGlua1wiIC8+XG4gICAgICAgICAgPEJ1dHRvbiBiZz1cInNlY29uZGFyeVwiIHNpemU9XCJzbVwiIHRpdGxlPVwiU2Vjb25kYXJ5XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxoMz5MYXJnZSBCdXR0b25zPC9oMz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiBzaXplPVwibGdcIiB0aXRsZT1cIkxpbmtcIiAvPlxuICAgICAgICA8QnV0dG9uIGJnPVwic2Vjb25kYXJ5XCIgc2l6ZT1cImxnXCIgdGl0bGU9XCJTZWNvbmRhcnlcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2PjwvZGl2PlxuXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDM+IERpc2FibGVkIEJ1dHRvbnM8L2gzPlxuICAgICAgICA8QnV0dG9uIGJnPVwicHJpbWFyeVwiIGRpc2FibGVkIHRpdGxlPVwiTGlua1wiIC8+XG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiBkaXNhYmxlZCB0aXRsZT1cIlNlY29uZGFyeVwiIC8+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdj5cbiAgICAgICAgPGgzPiBTcGlubmluZyBCdXR0b248L2gzPlxuICAgICAgICA8QnV0dG9uIGJnPVwicHJpbWFyeVwiIHRpdGxlPVwiU3Bpbm5pbmdcIiBsb2FkaW5nIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRleHRJbnB1dFN0YXRlcygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdj5cbiAgICAgICAgPGg1PlZhbGlkYXRpb248L2g1PlxuICAgICAgICA8VGV4dElucHV0IGlzVmFsaWQ9e3RydWV9IC8+XG4gICAgICAgIDxUZXh0SW5wdXQgaXNWYWxpZD17ZmFsc2V9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUNBQ0FRQUFBQnBONmxBQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQW1KTFIwUUFBS3FOSXpJQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFIZEVsTlJRZmtCQnNJS2lQd2htbUlBQUFIcVVsRVFWUjQydDJkYVd4VVZSVEhmMzB0cFZSR3dMSVdLQVVxWVJXSUFaV3FSS2kyV0JBd0VzSW5vM3d3dU1lRVNKQVBpTW9TQzlnUVNQZ0NvVjhnR21TTExDSkUyYkdBVWxZcCsxS1dVcmFoZ0ZDbWZwZ01NMjFuZSsvZGMrL1VjejRRT3UrZTgvK2Y5K2JPdmVlZWUxOFN1aVNKcnZTbUs5bGswWVlNTWtnamxhZUFhaDd5Z0NxcXVNWUZ6bkthWTV5aFZoY3NhZWxJTHJrTW9pOGVHNjI4SEtLVW5leWtRazhnMUVzYUJSVHpEN1V1OVRqenlhZXBhVHAycEFtRmxIRExOZlZRdmNVeUNtbGltbHBzeVdFNjU1VlNEOVVyRk5QSE5NWEk4akxyOEltUkQrb09SbW5vdTJ4SkVtTTRvSUY2VVBjek9uR0NVTUErcmVRRFdrcSthZXJRZzNWR3lBZDBNMzNOa1UrbmlJZEc2ZGRTeTBQbTBNd0UvVHhPR1NjZjBIS0c2U1dmeG13ZUc2Y2RxajRXazY2TGZqOE9HeWNjVHN2MGpCRW1jTmM0MVVoNmozZGx5U2N6enpqSldGcUVKVVUvbFJYRzZjV2pQNU1tUWI4NW00eFRpMWUzOHJScSt1M1liNXlXSGQxSFc1WDBzeWszVHNtdW5pQmJGZjAySERkT3g0bWVwTDBLK3A1Rzl2Q0g2a0ZhdXFXZjJvaTZ2bkM2MVYweXplSkg0eFRjNmlxU28xR00raUZ6bWFqaVcyUlVlcExHYjg2YVRqQis5OVNvajlGTzZQZWoyamgwVlhxZHpuYnBwM0hRT0d5VnVpZFNTajFTSHpDZlVVcStnWWtpblVpMTB4UGthVWx2NjFVZlE4TlJEWmRhVHFlTTdxWnZtWUFjWlFDUDZ2OHgzRmRnRm9WYUFGV3hqLzBjb3hLUGxyUm1HN3pzaW4xWkx4NkpQNDdYbUZFdm5kMlBiNmtVOSt1bFUrd0FiQkFHY1ordkk2UXYwL21HQjhMZWY0cEZ2MEFZd0NrR1J2WC9QS2VGRVF5UDVqNUplSkhyTDlyRmZBTGJVeWFLWVZzMDUyT0Y3MzVzK2dDdE9TR0s0NVhJcmlWWGVQK2xYMXowQWZwd1R4REpwa2h1aDR2R2ZWcmM5QUUrRWNVeUtMelQ5WUl1RDVCaUt3REpvbm1vMWVGY1BpczYvTFUvczVEc2ozemhScnB6QkIyV08xaXRTUlpkZmY2dXZyc21WQWk2KzlRMmZZQXZCQkZkcmo4OUhpbjZ3RGxicE9nZ2lLbVdBcitUd0tNNTNoSEUrT1FZMXh5MXU4d0pRVlRqUXdQUVZEVDk4WWZqbHI4TG9ocERhakFBcjlGQzBOVU9BeTFqUzB0L2dzUWZnQkdDanFEY2NjdVRvcmp5Z3dFb0VIVjB5WEhMaTZLNFJnUUMwSkVlb283dUdtZ1pqL1NtZ3o4QXVhSnU0TEhqbG84Y3Q0eFBodWdKZ1BOcWpaYkN5SEw5QVJqazJwQVVEY25mSm9EQllKRWtYbTJiNmJobFIyRmtmVW15Nkc1ckw0OFQ2ZSs0NVFCaFpDM0lzdWdwN01RTmplZkVzZlcyNkNidVpKakRyUTJXaGhMb2JJc3U0azQ2OG9LamRpL1JRUnhiVjRzc2NTZE81NXFTTTlTQWRMSFVGaFJHa0ltMHN0Mm1GZTlwUU5iRzRoa05iang4YUx2TlJ6VFhnQ3dEMFZSWVVPL1lMRkxwZ2xjTHJvdVdwdjAySGhiWnVuNlJsdnNQNllpdXdkVFZ5WEhEbXFvTlV6WFVhSFAybUhmaW9qOU80MzZrR3AwQnFLVW1qczd3ZmExYjhXclFYZzI0SU1yY3c4TkN6V2lxNGFabWw3VmNpREQvekJUY2R4NUpiMWpjMDlMYmhrb25mMEs2Z1hqRnA3OE5wZHJpaG5hbk5SeU5FSUJUMnJGVVdWelg3TEtXejNrUTRiTmlOQjJkWWk0QUZZeGtZY1JQRnpLR0sxcnhYTGM0cjgyWmx6bjBaSDNVYTlhU3d4UnVhc04wRmo3VzA5c3l3OGFNc0NVek5QMDZUWkpkR1BmclpTWTd5RHMrelJTdWlHTXJnRzZpRHJ4TWM3R3R2UmxmQ2M4S3N5Q0oyMExHSDFPaUlLbVZ5V0t4dWNFdGY3WnlwNGp4Y2w1MFRUNGdRNFFLYUxmN1Y0WktsUUVOeWtvR3NrZVp0VjBNWkkwQXlqLzkvNHhUSHRsNUFudjRrd1VtU20vN1RXY3FObXN2OTJOSEZpaEcrbVJ2c2NyTjBhdmtUbkFnbVY4VUlqMGNOUHlETXFOWGhkUHNyUldPRGI0UG1zMVhablNzS0gxUTJXUGxCWTAyVlhUNjN6NHRCNXlWS3NGNnMyNVdZcGtTbzI5cW9LK3FqSHBKWGFPRkNreGUxSFRBbmFWa01lZU51a1pURkJndDFrSWZZSkZyckUrS3BRTS9XVFdVdUlZbE1WWUxMNnRkVzFqU3NBSXR4K1dHQ1o5NFNWTlFXcm04Lzc3d1pTSHVCaG1udGRFSE9PY0s2OXFnb2RCUjIxeFhrQTY3YXEzWFcxSDRBR3psZ0F1amxWb0RjTlZGMjcyaG15ZnJqdHRudURCN1cyc0E3cmhvVzRkbDNRQ3NDY3lRTlVQUzZhMlVEYUgvclQ5MHlXZWpROE9YdEdiMDJ6dGVSaHZPMXVnWHFKeHdKcDZ1cUUrMzRlQTFoeU1SRmk4YnYzanBWWC83UnNNak5HN2dFUytnTnlWVCtiWCtuOEpOWDVwUlJvNXByQUp5aElFTkI4RGgwbGYzK1FEZHE3VHk0bU5TdUIwbzRROVNPa01yaFZuOXhKQlpMTFZ6ZVZQK050NWpxOVRkOXQ5TzBTZUJEMUMycTVYeEhKL1RVTWIrVHc3VTh2R1cwKzlOa1hId0tuU204NDdEYWlSblNVZlQ1ZTRXYXBxdzBUZ0ZON3JGL1J1S1BJYmVJS0pDUzlYVW5MZHV0QWNyeDNkd1V4eVNMWHkyazRTZVVMc2RMSVBkeGluWjBWTDFpN1RORzFGM3VFWDk4Zm9BcVN3M1RpMGVYU256Z2dVQWl6a0pQanIwTVZPd1FBT0FQQTNsaTA2MVVzLzZkQ2UyRzZjYVR2ZXFlNlZDTEVsaGVzSzlhS2xZOStzWWh5YlE2NWJLb3AwU0tma2NmTVlkNCtTcm1XNHlpNTFKaVZINjY3VHNmbzhodzlsbWhQeHUzZStZaXlhdmFoNG43dFZVa0dWTCtsT2lZUitxajgySmZQUi9aNzUwV2IwUlRTdVkzUmpPdlUraGdLV0s5L3pjWUFuNU5rK21OU3lwdk01Y2pyaW1mcGdpOHVSKzZPUkxHOXVUU3k2RDZXdXJpdXcyaHlobEJ6dGRGY01rUkFDQ2trMHZ1cEpORm0zSklJTjBVdkFBWG1xNFJ4VlZYT1VDWnpqRE1jN3BBdlVmaDJ3Q013bGlKM0FBQUFBbGRFVllkR1JoZEdVNlkzSmxZWFJsQURJd01qQXRNRFF0TWpkVU1EZzZOREk2TXpVck1EQTZNREQrcVZzMEFBQUFKWFJGV0hSa1lYUmxPbTF2WkdsbWVRQXlNREl3TFRBMExUSTNWREE0T2pReU9qTTFLekF3T2pBd2ovVGppQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB1c2VySW1hZ2UgZnJvbSBcIi4vdXNlci5wbmdcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRvYXN0KCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cInRvYXN0XCJcbiAgICAgIHJvbGU9XCJhbGVydFwiXG4gICAgICBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIlxuICAgICAgYXJpYS1hdG9taWM9XCJ0cnVlXCJcbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvYXN0LWhlYWRlclwiPlxuICAgICAgICA8aW1nIHNyYz17dXNlckltYWdlfSBjbGFzc05hbWU9XCJyb3VuZGVkIG1yLTJcIiBhbHQ9XCIuLi5cIiAvPlxuICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cIm1yLWF1dG9cIj5Cb290c3RyYXA8L3N0cm9uZz5cbiAgICAgICAgPHNtYWxsIGNsYXNzTmFtZT1cInRleHQtbXV0ZWRcIj5qdXN0IG5vdzwvc21hbGw+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJtbC0yIG1iLTEgY2xvc2VcIlxuICAgICAgICAgIGRhdGEtZGlzbWlzcz1cInRvYXN0XCJcbiAgICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9hc3QtYm9keVwiPlNlZT8gSnVzdCBsaWtlIHRoaXMuPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IFRvYXN0IGZyb20gXCJjb250cm9scy90b2FzdFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVG9hc3REZW1vKCkge1xuICByZXR1cm4gPFRvYXN0IC8+O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBBbGVydCBmcm9tIFwiY29udHJvbHMvYWxlcnRcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFsZXJ0RGVtbygpIHtcbiAgcmV0dXJuIDxBbGVydCBhbGVydD1cImRhbmdlclwiIG1lc3NhZ2U9XCJTZXJ2ZXIgaXMgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGVcIiAvPjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBBcHBSb3V0ZSB9IGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9idXR0b25cIjtcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSBcIi4vdGV4dC1pbnB1dFwiO1xuaW1wb3J0IFRvYXN0RGVtbyBmcm9tIFwiLi90b2FzdFwiO1xuaW1wb3J0IEFsZXJ0RGVtbyBmcm9tIFwiLi9hbGVydFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29tcG9uZW50c1JvdXRlKCkge1xuICByZXR1cm4gW1xuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2J1dHRvblwiPlxuICAgICAgPEJ1dHRvbiAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL3RleHQtaW5wdXRcIj5cbiAgICAgIDxUZXh0SW5wdXQgLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi90b2FzdFwiPlxuICAgICAgPFRvYXN0RGVtbyAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2FsZXJ0XCI+XG4gICAgICA8QWxlcnREZW1vIC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gIF07XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2Vhckljb24ocHJvcHMpIHtcclxuICAgIGNvbnN0IHtjb2xvcn09cHJvcHNcclxuICAgIHJldHVybiA8c3ZnIHsuLi5wcm9wc30gd2lkdGg9XCIxZW1cIiBoZWlnaHQ9XCIxZW1cIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgY2xhc3NOYW1lPVwiYmkgYmktZ2VhclwiIGZpbGw9e2NvbG9yfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgPHBhdGggey4uLnByb3BzfSBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk04LjgzNyAxLjYyNmMtLjI0Ni0uODM1LTEuNDI4LS44MzUtMS42NzQgMGwtLjA5NC4zMTlBMS44NzMgMS44NzMgMCAwIDEgNC4zNzcgMy4wNmwtLjI5Mi0uMTZjLS43NjQtLjQxNS0xLjYuNDItMS4xODQgMS4xODVsLjE1OS4yOTJhMS44NzMgMS44NzMgMCAwIDEtMS4xMTUgMi42OTJsLS4zMTkuMDk0Yy0uODM1LjI0Ni0uODM1IDEuNDI4IDAgMS42NzRsLjMxOS4wOTRhMS44NzMgMS44NzMgMCAwIDEgMS4xMTUgMi42OTNsLS4xNi4yOTFjLS40MTUuNzY0LjQyIDEuNiAxLjE4NSAxLjE4NGwuMjkyLS4xNTlhMS44NzMgMS44NzMgMCAwIDEgMi42OTIgMS4xMTZsLjA5NC4zMThjLjI0Ni44MzUgMS40MjguODM1IDEuNjc0IDBsLjA5NC0uMzE5YTEuODczIDEuODczIDAgMCAxIDIuNjkzLTEuMTE1bC4yOTEuMTZjLjc2NC40MTUgMS42LS40MiAxLjE4NC0xLjE4NWwtLjE1OS0uMjkxYTEuODczIDEuODczIDAgMCAxIDEuMTE2LTIuNjkzbC4zMTgtLjA5NGMuODM1LS4yNDYuODM1LTEuNDI4IDAtMS42NzRsLS4zMTktLjA5NGExLjg3MyAxLjg3MyAwIDAgMS0xLjExNS0yLjY5MmwuMTYtLjI5MmMuNDE1LS43NjQtLjQyLTEuNi0xLjE4NS0xLjE4NGwtLjI5MS4xNTlBMS44NzMgMS44NzMgMCAwIDEgOC45MyAxLjk0NWwtLjA5NC0uMzE5em0tMi42MzMtLjI4M2MuNTI3LTEuNzkgMy4wNjUtMS43OSAzLjU5MiAwbC4wOTQuMzE5YS44NzMuODczIDAgMCAwIDEuMjU1LjUybC4yOTItLjE2YzEuNjQtLjg5MiAzLjQzNC45MDEgMi41NCAyLjU0MWwtLjE1OS4yOTJhLjg3My44NzMgMCAwIDAgLjUyIDEuMjU1bC4zMTkuMDk0YzEuNzkuNTI3IDEuNzkgMy4wNjUgMCAzLjU5MmwtLjMxOS4wOTRhLjg3My44NzMgMCAwIDAtLjUyIDEuMjU1bC4xNi4yOTJjLjg5MyAxLjY0LS45MDIgMy40MzQtMi41NDEgMi41NGwtLjI5Mi0uMTU5YS44NzMuODczIDAgMCAwLTEuMjU1LjUybC0uMDk0LjMxOWMtLjUyNyAxLjc5LTMuMDY1IDEuNzktMy41OTIgMGwtLjA5NC0uMzE5YS44NzMuODczIDAgMCAwLTEuMjU1LS41MmwtLjI5Mi4xNmMtMS42NC44OTMtMy40MzMtLjkwMi0yLjU0LTIuNTQxbC4xNTktLjI5MmEuODczLjg3MyAwIDAgMC0uNTItMS4yNTVsLS4zMTktLjA5NGMtMS43OS0uNTI3LTEuNzktMy4wNjUgMC0zLjU5MmwuMzE5LS4wOTRhLjg3My44NzMgMCAwIDAgLjUyLTEuMjU1bC0uMTYtLjI5MmMtLjg5Mi0xLjY0LjkwMi0zLjQzMyAyLjU0MS0yLjU0bC4yOTIuMTU5YS44NzMuODczIDAgMCAwIDEuMjU1LS41MmwuMDk0LS4zMTl6XCIgLz5cclxuICAgICAgICA8cGF0aCB7Li4ucHJvcHN9IGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTggNS43NTRhMi4yNDYgMi4yNDYgMCAxIDAgMCA0LjQ5MiAyLjI0NiAyLjI0NiAwIDAgMCAwLTQuNDkyek00Ljc1NCA4YTMuMjQ2IDMuMjQ2IDAgMSAxIDYuNDkyIDAgMy4yNDYgMy4yNDYgMCAwIDEtNi40OTIgMHpcIiAvPlxyXG4gICAgPC9zdmc+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IEdlYXJJY29uIGZyb20gJ2ljb25zL2Jvb3RzdHJhcC9HZWFySWNvbidcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGJhY2tncm91bmRDb2xvcjogXCIjZWVlZWVlXCIsXG4gICAgaGVpZ2h0OiBcIjEwMCVcIixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExheW91dCh7IGNoaWxkcmVuLCBzdHlsZSwgaWQsIGhhbmdvdXQsIG9uTmF2aWdhdGlvbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD17aWR9IHN0eWxlPXt7IC4uLnN0eWxlcy5yb290LCAuLi5zdHlsZSB9fT5cbiBcbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuL0xheW91dFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5jb25zdCBzdHlsZSA9IHtcbiAgY2hlY2tib3g6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgY2hlY2tib3hSb290OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICBwYWRkaW5nOiAxNixcbiAgfSxcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgIHBhZGRpbmdUb3A6IDY4LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2soeyBvbkNhbmNlbCwgb25CbG9jaywgb25SZXBvcnQgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jaGVja2JveFJvb3R9PlxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XG4gICAgICAgIDxsYWJlbD5SZXBvcnQ8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY2FuY2VsLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICAgIHRpdGxlPVwiQ2FuY2VsXCJcbiAgICAgICAgICAgIGJnPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIG91dGxpbmVcbiAgICAgICAgICAgIGJsb2NrXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBpZD1cIkJMT0NLXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQmxvY2t9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImJsb2NrLWJ0blwiXG4gICAgICAgICAgICB0aXRsZT1cIkJsb2NrXCJcbiAgICAgICAgICAgIGJnPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBibG9ja1xuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrKHtcbiAgaGVpZ2h0ID0gMjQsXG4gIHdpZHRoID0gMjQsXG4gIGZpbGwgPSBcIm5vbmVcIixcbiAgY29sb3IgPSBcImJsYWNrXCIsXG4gIG9uQ2xpY2ssXG4gIGlkLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxzdmdcbiAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICB3aWR0aD17d2lkdGh9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgaWQ9e2lkfVxuICAgID5cbiAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD17ZmlsbH0gaWQ9e2lkfSAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgaWQ9e2lkfVxuICAgICAgICBmaWxsPXtjb2xvcn1cbiAgICAgICAgZD1cIk0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek00IDEyYzAtNC40MiAzLjU4LTggOC04IDEuODUgMCAzLjU1LjYzIDQuOSAxLjY5TDUuNjkgMTYuOUM0LjYzIDE1LjU1IDQgMTMuODUgNCAxMnptOCA4Yy0xLjg1IDAtMy41NS0uNjMtNC45LTEuNjlMMTguMzEgNy4xQzE5LjM3IDguNDUgMjAgMTAuMTUgMjAgMTJjMCA0LjQyLTMuNTggOC04IDh6XCJcbiAgICAgIC8+XG4gICAgPC9zdmc+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuZXhwb3J0IGZ1bmN0aW9uIENlbnRlcih7IGNoaWxkcmVuLCBzdHlsZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIC4uLnN0eWxlLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gXCJpY29ucy9CbG9ja1wiO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSBcImNvbXBvbmVudHMvbGF5b3V0L0NlbnRlclwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuL0xheW91dFwiO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgIHBhZGRpbmdUb3A6IDY4LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2tlZCh7IGhhbmdvdXQsIG9uVW5ibG9jaywgb25DbG9zZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImJsb2NrZWQtdWlcIj5cbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgPEJsb2NrIHdpZHRoPVwiNjBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwicmVkXCIgLz5cbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNsb3NlLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgdGl0bGU9XCJDTE9TRVwiXG4gICAgICAgICAgICBiZz1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBibG9ja1xuICAgICAgICAgICAgb3V0bGluZVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGlkPVwiVU5CTE9DS1wiXG4gICAgICAgICAgICBvbkNsaWNrPXtvblVuYmxvY2t9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInVuYmxvY2stYnRuXCJcbiAgICAgICAgICAgIHRpdGxlPVwiVU5CTE9DS1wiXG4gICAgICAgICAgICBiZz1cInByaW1hcnlcIlxuICAgICAgICAgICAgYmxvY2tcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmV4cG9ydCBmdW5jdGlvbiBEZWxldGUoe1xuICBoZWlnaHQgPSAyNCxcbiAgd2lkdGggPSAyNCxcbiAgY29sb3IgPSBcImJsYWNrXCIsXG4gIGZpbGwgPSBcIm5vbmVcIixcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9e3dpZHRofT5cbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGw9e2NvbG9yfVxuICAgICAgICBkPVwiTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHpcIlxuICAgICAgLz5cbiAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD17ZmlsbH0gLz5cbiAgICA8L3N2Zz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcmNoaXZlKHtcbiAgaGVpZ2h0ID0gMjQsXG4gIHdpZHRoID0gMjQsXG4gIGNvbG9yID0gXCJibGFja1wiLFxuICBmaWxsID0gXCJub25lXCIsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPHN2ZyBoZWlnaHQ9ezI0fSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9e3dpZHRofT5cbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGw9e2NvbG9yfVxuICAgICAgICBkPVwiTTIwLjU0IDUuMjNsLTEuMzktMS42OEMxOC44OCAzLjIxIDE4LjQ3IDMgMTggM0g2Yy0uNDcgMC0uODguMjEtMS4xNi41NUwzLjQ2IDUuMjNDMy4xNyA1LjU3IDMgNi4wMiAzIDYuNVYxOWMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjYuNWMwLS40OC0uMTctLjkzLS40Ni0xLjI3ek0xMiAxNy41TDYuNSAxMkgxMHYtMmg0djJoMy41TDEyIDE3LjV6TTUuMTIgNWwuODEtMWgxMmwuOTQgMUg1LjEyelwiXG4gICAgICAvPlxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPXtmaWxsfSAvPlxuICAgIDwvc3ZnPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBMYXlvdXQgZnJvbSBcIi4vTGF5b3V0XCI7XG5pbXBvcnQgeyBEZWxldGUgfSBmcm9tIFwiaWNvbnMvRGVsZXRlXCI7XG5pbXBvcnQgeyBBcmNoaXZlIH0gZnJvbSBcImljb25zL0FyY2hpdmVcIjtcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSBcImljb25zL0Jsb2NrXCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmNvbnN0IHN0eWxlID0ge1xuICBpY29uQnRuOiB7IGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBtYXJnaW46IDggfSxcbiAgYnRuOiB7IG1hcmdpblJpZ2h0OiA4IH0sXG4gIGJ0bkNvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gIH0sXG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxuICAgIGhlaWdodDogXCIxMDAlXCIsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xuICBvbkJsb2NrLFxuICBvbkRlbGV0ZSxcbiAgb25BcmNoaXZlLFxuICBvbk5vdGlmaWNhdGlvbixcbiAgb25Db252ZXJzYXRpb25IaXN0b3J5LFxuICBvbk5hdmlnYXRpb24sXG4gIG9uT2ssXG59KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XG4gICAgICAgIDxDaGVja2JveFxuICAgICAgICAgIGxhYmVsPVwiQ29udmVyc2F0aW9uIEhpc3RvcnlcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxociAvPlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuQ29udGFpbmVyfT5cbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJBcmNoaXZlXCIgSWNvbj17QXJjaGl2ZX0gb25DbGljaz17b25BcmNoaXZlfSAvPlxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XG4gICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgaWQ9XCJiY2t1aVwiXG4gICAgICAgICAgdGl0bGU9XCJCbG9ja1wiXG4gICAgICAgICAgSWNvbj17QmxvY2t9XG4gICAgICAgICAgb25DbGljaz17b25OYXZpZ2F0aW9ufVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2PlxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uT2t9IHRpdGxlPVwiT0tcIiBiZz1cInByaW1hcnlcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG5cbmZ1bmN0aW9uIEljb25CdXR0b24oeyBJY29uLCB0aXRsZSwgb25DbGljaywgaWQgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLmljb25CdG59PlxuICAgICAgPGJ1dHRvblxuICAgICAgICBpZD17aWR9XG4gICAgICAgIHN0eWxlPXtzdHlsZS5idG59XG4gICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgIGRhdGEtdGVzdGlkPXtgJHtpZH0tYnRuYH1cbiAgICAgID5cbiAgICAgICAgPEljb24gaWQ9e2lkfSAvPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8ZGl2Pnt0aXRsZX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gQ2hlY2tib3goeyBsYWJlbCwgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiA4LCBtYXJnaW5Ub3A6IDggfX0+XG4gICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgICAgPGxhYmVsPntsYWJlbH08L2xhYmVsPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tIFwiLi9kZXZpY2VUeXBlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KCkge1xuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtvcmllbnRhdGlvbiwgc2V0T3JpZW50YXRpb25dID0gdXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtkZXZpY2UsIHNldERldmljZV0gPSB1c2VTdGF0ZShcIlwiKTtcbiAgZnVuY3Rpb24gaGFuZGxlVmlld3BvcnRTaXplKCkge1xuICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICBzZXRIZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xuICB9XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHdpZHRoID4gMCkge1xuICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxuICAgICAgICAgIHNldERldmljZShcInBob25lXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHdpZHRoIDw9IDc2ODpcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcbiAgICAgICAgICBzZXREZXZpY2UoXCJ0YWJsZXRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcbiAgICAgICAgICBzZXREZXZpY2UoXCJsYXB0b3BcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugd2lkdGggPiAyNTYwOlxuICAgICAgICAgIHNldERldmljZShcImRlc2t0b3BcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc2V0RGV2aWNlKFwiXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW3dpZHRoXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImRldmljZVwiLCBkZXZpY2UpO1xuICB9LCBbZGV2aWNlXSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInByZWFjdC9ob29rc1wiO1xuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gXCJjb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5XCI7XG4vL2ltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcbmNvbnN0IHN0eWxlID0ge1xuICByb290OiB7XG4gICAgYm9yZGVyQ29sb3I6IFwiI2VlZWVlZVwiLFxuICAgIGJvcmRlclN0eWxlOiBcInNvbGlkXCIsXG4gICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgIHBhZGRpbmc6IDMsXG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gICAgbWluSGVpZ2h0OiAzNSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcbiAgfSxcbiAgdXNlcm5hbWU6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgbG9nOiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgY29sb3I6IFwiIzczNzM3M1wiLFxuICAgIGZvbnRTaXplOiAxMCxcbiAgfSxcbiAgbWVzc2FnZToge30sXG59O1xuLy9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lc3NhZ2UocHJvcHMpIHtcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcbiAgY29uc3QgeyBmbG9hdCwgdXNlcm5hbWUsIHRpbWVzdGFtcCB9ID0gbWVzc2FnZTtcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtob3Vycywgc2V0SG91cnNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFttaW51dGVzLCBzZXRNaW51dGVzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XG4gICAgdmFyIGQsIGgsIG0sIHM7XG4gICAgcyA9IE1hdGguZmxvb3IobXMgLyAxMDAwKTtcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xuICAgIHMgPSBzICUgNjA7XG4gICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICBtID0gbSAlIDYwO1xuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XG4gICAgaCA9IGggJSAyNDtcbiAgICBzZXREYXlzKGQpO1xuICAgIHNldEhvdXJzKGgpO1xuICAgIHNldE1pbnV0ZXMobSk7XG4gICAgc2V0U2Vjb25kcyhzKTtcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHRpbWVzdGFtcCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcbiAgICAgIH0sIDApO1xuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIHRpbWVzdGFtcCk7XG4gICAgICB9LCA2MDAwMCk7XG4gICAgfVxuICB9LCBbdGltZXN0YW1wXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luQm90dG9tOiAzIH19PlxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWVzc2FnZVwiXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9XG4gICAgICAgICAgY2xhc3NOYW1lPXtgbWVzc2FnZS1mb250LSR7ZGV2aWNlfS1zaXplYH1cbiAgICAgICAgPlxuICAgICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmxvZ30+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHttaW51dGVzID09PSAwICYmIDxkaXY+Tm93PC9kaXY+fVxuICAgICAgICAgICAge2hvdXJzID09PSAwICYmIG1pbnV0ZXMgPiAwICYmIDxkaXY+e21pbnV0ZXN9IG1pbnV0ZXMgYWdvIDwvZGl2Pn1cbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge2hvdXJzfSBob3VycyB7bWludXRlc30gbWludXRlcyBhZ297XCIgXCJ9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtkYXlzIDw9IDEwICYmIGRheXMgPiAxICYmIDxkaXY+e2RheXN9IGRheXMgYWdvPC9kaXY+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSBcImNvbnRyb2xzL3RleHQtaW5wdXRcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcImNvbnRyb2xzL2J1dHRvblwiO1xuY29uc3Qgc3R5bGVzID0ge1xuICByb290OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAvLyBwb3NpdGlvbjonZml4ZWQnLFxuICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAvLyBib3R0b206MTAsXG4gICAgLy8gcmlnaHQ6MTAsXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgLy9tYXJnaW46MFxuICAgIHBhZGRpbmc6IDUsXG4gICAgbWFyZ2luTGVmdDogOCxcbiAgICBtYXJnaW5SaWdodDogOCxcbiAgICBtYXJnaW5Ub3A6IDgsXG4gICAgbWFyZ2luQm90dG9tOiA4LFxuICAgIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXG4gICAgZmxleDogMSxcbiAgICB3aWR0aDogXCIxMDAlXCIsXG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVzc2FnZUVkaXRvcih7XG4gIGxvYWRpbmcsXG4gIG1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2UsXG4gIGhhbmdvdXQsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgbWItM1wiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJSZWNpcGllbnQncyB1c2VybmFtZVwiXG4gICAgICAgICAgYXJpYS1kZXNjcmliZWRieT1cImJ1dHRvbi1hZGRvbjJcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiXG4gICAgICAgICAgdmFsdWU9e21lc3NhZ2VUZXh0fVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFwcGVuZFwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2hhbmdvdXQgJiYgaGFuZ291dC5zdGF0ZSA9PT0gXCJCTE9DS0VEXCJ9XG4gICAgICAgICAgICBpZD1cIk1FU1NBR0VcIlxuICAgICAgICAgICAgb25DbGljaz17b25NZXNzYWdlfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLWJ0blwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgU2VuZFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmNvbnN0IHN0eWxlID0ge1xuICBjb2xvcjogXCJyZWRcIixcbiAgZmxvYXQ6IFwicmlnaHRcIixcbiAgd2lkdGg6IFwiMTAwJVwiLFxuICBmb250U2l6ZTogMTYsXG4gIHRleHRBbGlnbjogXCJlbmRcIixcbn07XG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlck1lc3NhZ2UoeyBtZXNzYWdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VyLW1lc3NhZ2VcIj5cbiAgICAgIHttZXNzYWdlLnRleHR9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGNvbG9yOiBcInJlZFwiLFxuICBmbG9hdDogXCJyaWdodFwiLFxuICB3aWR0aDogXCIxMDAlXCIsXG4gIGZvbnRTaXplOiAxNixcbiAgdGV4dEFsaWduOiBcImVuZFwiLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VkTWVzc2FnZSh7IG1lc3NhZ2UsIG9uTmF2aWdhdGlvbiB9KSB7XG4gIGZ1bmN0aW9uIGhhbmRsZU5hdmlnYXRpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBvbk5hdmlnYXRpb24oZSk7XG4gIH1cbiAgXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlZC1tZXNzYWdlXCI+XG4gICAgICB7bWVzc2FnZS50ZXh0fVxuICAgICAgPGFcbiAgICAgICAgaWQ9XCJVTkJMT0NLXCJcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWVtb3JlLWJ0blwiXG4gICAgICAgIGhyZWY9XCIvXCJcbiAgICAgICAgb25DbGljaz17aGFuZGxlTmF2aWdhdGlvbn1cbiAgICAgID5cbiAgICAgICAgc2VlIG1vcmVcbiAgICAgIDwvYT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gXCJwcmVhY3QvaG9va3NcIjtcbmltcG9ydCBNZXNzYWdlIGZyb20gXCIuL01lc3NhZ2VcIjtcbmltcG9ydCBNZXNzYWdlRWRpdG9yIGZyb20gXCIuL01lc3NhZ2VFZGl0b3JcIjtcbmltcG9ydCB7IEJsb2NrZXJNZXNzYWdlIH0gZnJvbSBcIi4vQmxvY2tlck1lc3NhZ2VcIjtcbmltcG9ydCB7IEJsb2NrZWRNZXNzYWdlIH0gZnJvbSBcIi4vQmxvY2tlZE1lc3NhZ2VcIjtcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tIFwiY29tcG9uZW50cy9sYXlvdXQvdXNlTWVkaWFRdWVyeVwiO1xuY29uc3Qgc3R5bGVzID0ge1xuICBtZXNzYWdlQ29udGFpbmVyOiB7XG4gICAgLy8gd2lkdGg6ICcxMDAlJyxcbiAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgIHBhZGRpbmc6IDMsXG4gICAgLy8gIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXG4gICAgZmxleDogMyxcbiAgICBvdmVyZmxvd1k6IFwiYXV0b1wiLFxuICAgIG92ZXJmbG93WDogXCJoaWRkZW5cIixcbiAgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNZXNzYWdlcyh7XG4gIG1lc3NhZ2VzLFxuICBvbk1lc3NhZ2UsXG4gIG9uTWVzc2FnZVRleHQsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZSxcbiAgaGFuZ291dCxcbiAgb25OYXZpZ2F0aW9uLFxuICBsb2FkaW5nLFxufSkge1xuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChtZXNzYWdlcykge1xuICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcbiAgICB9XG4gIH0sIFttZXNzYWdlc10pO1xuXG4gIGZ1bmN0aW9uIG9uU2VuZChlKSB7XG4gICAgb25NZXNzYWdlKGUpO1xuICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17e1xuICAgICAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgIGhlaWdodDogXCIxMDAlXCIsXG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlcy5tZXNzYWdlQ29udGFpbmVyLCBmbGV4OiBkZXZpY2UgPT09IFwicGhvbmVcIiA/IDQgOiAyIH19XG4gICAgICAgIHJlZj17c2Nyb2xsZXJSZWZ9XG4gICAgICA+XG4gICAgICAgIHttZXNzYWdlcyAmJlxuICAgICAgICAgIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXM6IHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pLCB1c2VybmFtZSB9KS5tYXAoXG4gICAgICAgICAgICAobSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiIH19PlxuICAgICAgICAgICAgICAgIHtcIiBcIn1cbiAgICAgICAgICAgICAgICB7IW0udHlwZSAmJiA8TWVzc2FnZSBtZXNzYWdlPXttfSAvPn1cbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gXCJibG9ja2VyXCIgJiYgKFxuICAgICAgICAgICAgICAgICAgPEJsb2NrZXJNZXNzYWdlIG1lc3NhZ2U9e219IC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gXCJibG9ja2VkXCIgJiYgKFxuICAgICAgICAgICAgICAgICAgPEJsb2NrZWRNZXNzYWdlIG1lc3NhZ2U9e219IG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufSAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgPE1lc3NhZ2VFZGl0b3JcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgaGFuZ291dD17aGFuZ291dH1cbiAgICAgICAgb25NZXNzYWdlPXtvblNlbmR9XG4gICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cbiAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG5mdW5jdGlvbiBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcbiAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgdXNlcm5hbWUpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcbiAgICAgIGlmIChtc2cudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6IFwicmlnaHRcIiwgdXNlcm5hbWU6IFwibWVcIiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogXCJsZWZ0XCIgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSBcInByZWFjdC9ob29rc1wiO1xuaW1wb3J0IE1lc3NhZ2VzIGZyb20gXCIuL21lc3NhZ2VzXCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuL0xheW91dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XG4gIGxvYWRpbmcsXG4gIG1lc3NhZ2VzID0gW10sXG4gIG9uTWVzc2FnZVRleHQsXG4gIG9uTWVzc2FnZSxcbiAgbWVzc2FnZVRleHQsXG4gIHVzZXJuYW1lLFxuICBoYW5nb3V0LFxuICBvbk5hdmlnYXRpb24sXG59KSB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYoaGFuZ291dCl7XG4gICAgICBkb2N1bWVudC50aXRsZSA9IGhhbmdvdXQudXNlcm5hbWU7XG4gICAgfVxuICAgXG4gIH0sIFtoYW5nb3V0XSk7XG5cbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IGlkPVwiaGFuZ2NoYXQtdWlcIiBvbk5hdmlnYXRpb249e29uTmF2aWdhdGlvbn0+XG4gICAgICA8TWVzc2FnZXNcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XG4gICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XG4gICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cbiAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxuICAgICAgLz5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cFwiIHsuLi5wcm9wc30gLz47XG59XG5cbmZ1bmN0aW9uIExpc3RJdGVtKHByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLWFjdGlvblwiXG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKTtcbn1cblxuZXhwb3J0IHsgTGlzdEl0ZW0gfTtcbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgTGlzdCwgeyBMaXN0SXRlbSB9IGZyb20gXCJjb250cm9scy9saXN0XCI7XG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0KHtcbiAgaGFuZ291dHMsXG4gIG9uU2VhcmNoSW5wdXQsXG4gIG9uRmV0Y2hIYW5nb3V0cyxcbiAgb25TZWxlY3RIYW5nb3V0LFxuICBzZWFyY2gsXG59KSB7XG5cbiAgXG4gIFxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAgbWItM1wiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxuICAgICAgICAgIGlkPVwic2VhcmNoLWlucHV0XCJcbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2hJbnB1dH1cbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICBhcmlhLWxhYmVsPVwiUmVjaXBpZW50J3MgdXNlcm5hbWVcIlxuICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9XCJidXR0b24tYWRkb24yXCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1pbnB1dFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeVwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGlkPVwiYnV0dG9uLWFkZG9uMlwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkZldGNoSGFuZ291dHN9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1idG5cIlxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFzZWFyY2h9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgU2VhcmNoXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8TGlzdCBpZD1cImhhbmdvdXRzLWxpc3RcIj5cbiAgICAgICAge2hhbmdvdXRzICYmXG4gICAgICAgICAgaGFuZ291dHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPExpc3RJdGVtXG4gICAgICAgICAgICAgICAgaWQ9e2cudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2cudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgb25DbGljaz17b25TZWxlY3RIYW5nb3V0fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2cudXNlcm5hbWV9XG4gICAgICAgICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xuICBoZWlnaHQgPSAyNCxcbiAgd2lkdGggPSAyNCxcbiAgY29sb3IgPSBcImJsYWNrXCIsXG4gIGZpbGwgPSBcIndoaXRlXCIsXG4gIHN0eWxlLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XG4gICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9e2ZpbGx9IC8+XG4gICAgICA8cGF0aFxuICAgICAgICBmaWxsPXtjb2xvcn1cbiAgICAgICAgZD1cIk0xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00elwiXG4gICAgICAvPlxuICAgIDwvc3ZnPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBQZXJzb25BZGQgZnJvbSBcImljb25zL1BlcnNvbkFkZFwiO1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tIFwiY29udHJvbHMvdGV4dC1pbnB1dFwiO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSBcImNvbXBvbmVudHMvbGF5b3V0L0NlbnRlclwiO1xuaW1wb3J0IExheW91dCBmcm9tIFwiLi9MYXlvdXRcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcImNvbnRyb2xzL2J1dHRvblwiO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gIH0sXG59O1xuLy9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZSh7XG4gIGhhbmdvdXQsXG4gIG9uSW52aXRlLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBtZXNzYWdlVGV4dCxcbiAgbG9hZGluZyxcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiaW52aXRlLXVpXCI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8UGVyc29uQWRkIGNvbG9yPVwiZ3JlZW5cIiAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICBTdGFydCBDb252ZXJzYXRpb24gd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj5cbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBpZD1cIm1lc3NhZ2VUZXh0SW5wdXRcIlxuICAgICAgICBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH1cbiAgICAgICAgdmFsdWU9e21lc3NhZ2VUZXh0fVxuICAgICAgICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VUZXh0SW5wdXRcIlxuICAgICAgLz5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAgIGlkPVwiSU5WSVRFXCJcbiAgICAgICAgICBvbkNsaWNrPXtvbkludml0ZX1cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cIm9uaW52aXRlLWJ0blwiXG4gICAgICAgICAgdGl0bGU9XCJTZW5kIEludml0ZVwiXG4gICAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgICAgLz5cbiAgICAgIDwvQ2VudGVyPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIERvbmUoe1xuICBoZWlnaHQgPSAyNCxcbiAgd2lkdGggPSAyNCxcbiAgZmlsbCA9IFwibm9uZVwiLFxuICBjb2xvciA9IFwiYmxhY2tcIixcbiAgc3R5bGUsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD17ZmlsbH0gLz5cbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGw9e2NvbG9yfVxuICAgICAgICBkPVwiTTkgMTYuMkw0LjggMTJsLTEuNCAxLjRMOSAxOSAyMSA3bC0xLjQtMS40TDkgMTYuMnpcIlxuICAgICAgLz5cbiAgICA8L3N2Zz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBEb25lIH0gZnJvbSBcImljb25zL0RvbmVcIjtcbmltcG9ydCB7IENlbnRlciB9IGZyb20gXCJjb21wb25lbnRzL2xheW91dC9DZW50ZXJcIjtcbmltcG9ydCBMYXlvdXQgZnJvbSBcIi4vTGF5b3V0XCI7XG5cbmNvbnN0IHN0eWxlID0ge1xuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiBcImZsZXhcIixcbiAgICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZWUoeyBoYW5nb3V0LCBkaXNwYXRjaCB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxEb25lIHdpZHRoPVwiNzBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwiZ3JlZW5cIiAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8cD5cbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxuICAgICAgICAgIHlvdXIgaW52aXRpb24gaGFzIGJlZW4gYWNjZXB0ZWQuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvQ2VudGVyPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBNZXNzYWdlIGZyb20gXCIuL21lc3NhZ2VzL01lc3NhZ2VcIjtcbmltcG9ydCBMYXlvdXQgZnJvbSBcIi4vTGF5b3V0XCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmNvbnN0IHN0eWxlID0ge1xuICByb290OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgaGVpZ2h0OiBcIjEwMCVcIixcbiAgICBwYWRkaW5nVG9wOiA3MCxcbiAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICBwYWRkaW5nQm90dG9tOiA4LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlcih7IGhhbmdvdXQsIG9uQWNjZXB0LCBvbkRlY2xpbmUsIGxvYWRpbmcgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5MZWZ0OiA4LCBkaXNwbGF5OiBcImZsZXhcIiB9fT5cbiAgICAgICAgICB7aGFuZ291dCAmJiBoYW5nb3V0Lm1lc3NhZ2UgJiYgKFxuICAgICAgICAgICAgPE1lc3NhZ2VcbiAgICAgICAgICAgICAgbWVzc2FnZT17XG4gICAgICAgICAgICAgICAgaGFuZ291dCAmJlxuICAgICAgICAgICAgICAgIGhhbmdvdXQubWVzc2FnZSAmJiB7XG4gICAgICAgICAgICAgICAgICAuLi5oYW5nb3V0Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgIGZsb2F0OiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpZD1cIkRFQ0xJTkVcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXtvbkRlY2xpbmV9XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVjbGluZS1idG5cIlxuICAgICAgICAgICAgICB0aXRsZT1cIkRlY2xpbmVcIlxuICAgICAgICAgICAgICBibG9ja1xuICAgICAgICAgICAgICBiZz1cImRhbmdlclwiXG4gICAgICAgICAgICAgIG91dGxpbmVcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpZD1cIkFDQ0VQVFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2VwdC1idG5cIlxuICAgICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAgICAgICB0aXRsZT1cIkFjY2VwdFwiXG4gICAgICAgICAgICAgIGJnPVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgIGJsb2NrXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzIH0pIHtcbiAgcmV0dXJuIHVucmVhZGhhbmdvdXRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQsIGluZGV4KSA9PiB7XG4gICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICByZXR1cm4gKGFjY3VtdWxhdG9yID0gW3sgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH1dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb2JqID0gYWNjdW11bGF0b3IuZmluZChcbiAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWUgJiYgY3VycmVudC5zdGF0ZSA9PT0gXCJNRVNTQU5HRVJcIlxuICAgICAgKTtcbiAgICAgIGlmIChvYmopIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBhY2N1bXVsYXRvci5maW5kSW5kZXgoXG4gICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWVcbiAgICAgICAgKTtcbiAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcbiAgICAgICAgYWNjdW11bGF0b3Iuc3BsaWNlKGluZGV4LCAxLCB7XG4gICAgICAgICAgLi4ub2JqLFxuICAgICAgICAgIG1lc3NhZ2VDb3VudDogKytvYmoubWVzc2FnZUNvdW50LFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XG4gICAgICAgIGFjY3VtdWxhdG9yLnB1c2goeyAuLi5jdXJyZW50LCBtZXNzYWdlQ291bnQ6IDEgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgfSwgW10pO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgTGlzdCwgeyBMaXN0SXRlbSB9IGZyb20gXCJjb250cm9scy9saXN0XCI7XG5pbXBvcnQgeyByZWR1Y2VyVW5yZWFkaGFuZ291dHMgfSBmcm9tIFwiZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVucmVhZEhhbmdvdXRzKHtcbiAgdW5yZWFkaGFuZ291dHMsXG4gIG9uU2VsZWN0VW5yZWFkLFxuICBvblJlbW92ZVVucmVhZCxcbn0pIHtcbiAgY29uc3QgW2l0ZW1zLCBzZXRJdGVtc10gPSB1c2VTdGF0ZShbXSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVucmVhZGhhbmdvdXRzKSB7XG4gICAgICBjb25zdCByZWR1Y2VkID0gcmVkdWNlclVucmVhZGhhbmdvdXRzKHsgdW5yZWFkaGFuZ291dHMgfSk7XG5cbiAgICAgIHNldEl0ZW1zKHJlZHVjZWQpO1xuICAgIH1cbiAgfSwgW3VucmVhZGhhbmdvdXRzXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwidW5yZWFkaGFuZ291dHNcIiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwXCI+XG4gICAgICB7aXRlbXMgJiZcbiAgICAgICAgaXRlbXMubGVuZ3RoID4gMCAmJlxuICAgICAgICBpdGVtcy5tYXAoKHUpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGxpXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbSBkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyXCJcbiAgICAgICAgICAgICAgb25DbGljaz17b25TZWxlY3RVbnJlYWR9XG4gICAgICAgICAgICAgIGlkPXt1LnVzZXJuYW1lfVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YCR7dS51c2VybmFtZX0tc2VsZWN0YH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3UudXNlcm5hbWV9IG1lc3NhZ2VzOiB7dS5tZXNzYWdlQ291bnR9XG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmFkZ2UgYmFkZ2UtZGFuZ2VyIGJhZGdlLXBpbGxcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uUmVtb3ZlVW5yZWFkfVxuICAgICAgICAgICAgICAgIGlkPXt1LnVzZXJuYW1lfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgJHt1LnVzZXJuYW1lfS1yZW1vdmVgfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgeFxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiZXhwb3J0IGNvbnN0IG1lc3NhZ2VzID0gW1xuICB7XG4gICAgdXNlcm5hbWU6IFwiYnJlbm9cIixcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6IFwiZGVtb1wiLFxuICAgIHRleHQ6IGBPayBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzIxNjM0NjIsXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTogXCJicmVub1wiLFxuICAgIHRleHQ6IGBIb3cgYXJlIHlvdSBkZW1vYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTogXCJicmVub1wiLFxuICAgIHRleHQ6IGBBcmUgeW91IGFsbCByaWdodGAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjc3NTczLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6IFwiZGVtb1wiLFxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NixcbiAgfSxcbiAgLFxuICB7XG4gICAgdXNlcm5hbWU6IFwiZGVtb1wiLFxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6IFwiZGVtb1wiLFxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6IFwiYnJlbm9cIixcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OCxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOiBcImJyZW5vXCIsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTogXCJicmVub1wiLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6IFwiYnJlbm9cIixcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOiBcImJyZW5vXCIsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG5dO1xuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5pbXBvcnQgQmxvY2sgZnJvbSBcImZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2tcIjtcbmltcG9ydCBCbG9ja2VkIGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrZWRcIjtcbmltcG9ydCBDb25maWd1cmUgZnJvbSBcImZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQ29uZmlndXJlXCI7XG5pbXBvcnQgSGFuZ2NoYXQgZnJvbSBcImZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ2NoYXRcIjtcbmltcG9ydCBIYW5nb3V0IGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXRcIjtcbmltcG9ydCBJbnZpdGUgZnJvbSBcImZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlXCI7XG5pbXBvcnQgSW52aXRlZSBmcm9tIFwiZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVlXCI7XG5pbXBvcnQgSW52aXRlciBmcm9tIFwiZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVyXCI7XG5pbXBvcnQgVW5yZWFkSGFuZ291dHMgZnJvbSBcImZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvVW5yZWFkSGFuZ291dHNcIjtcbmltcG9ydCBNZXNzYWdlIGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL01lc3NhZ2VcIjtcbmNvbnN0IGhhbmdvdXRzID0gW1xuICB7IHVzZXJuYW1lOiBcInVzZXJvbmVcIiB9LFxuICB7IHVzZXJuYW1lOiBcInVzZXJ0d29cIiB9LFxuICB7IHVzZXJuYW1lOiBcInVzZXJ0aHJlZVwiIH0sXG5dO1xuY29uc3QgaGFuZ291dCA9IHtcbiAgdXNlcm5hbWU6IFwidGVzdHVzZXJcIixcbiAgZW1haWw6IFwidGVzdEBnbWFpbC5jb21cIixcbiAgbWVzc2FnZTogeyB0ZXh0OiBgTGV0J3MgY2hhdCBvbiBIYW5nb3V0IWAsIHRpbWVzdGFtcDogMTU5MDgyMDc4MjkyMSB9LFxufTtcbmNvbnN0IG1lc3NhZ2UgPSB7XG4gIHVzZXJuYW1lOiBcImJyZW5vXCIsXG4gIHRleHQ6IGBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcbiAgdGltZXN0YW1wOiAxNTkxMzMxNzY3ODM2LFxufTtcbi8vXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gXCIuL2Zha2VNZXNzYWdlc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dFJvdXRlcygpIHtcbiAgcmV0dXJuIFtcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja1wiPlxuICAgICAgPEJsb2NrIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja2VkXCI+XG4gICAgICA8QmxvY2tlZCBoYW5nb3V0cz17aGFuZ291dHN9IC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gICAgPEFwcFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XG4gICAgICA8Q29uZmlndXJlIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nY2hhdFwiPlxuICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nb3V0XCI+XG4gICAgICA8SGFuZ291dCBoYW5nb3V0cz17aGFuZ291dHN9IC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlXCI+XG4gICAgICA8SW52aXRlIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9pbnZpdGVyXCI+XG4gICAgICA8SW52aXRlciBoYW5nb3V0cz17aGFuZ291dHN9IC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlZVwiPlxuICAgICAgPEludml0ZWUgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL3VucmVhZGhhbmdvdXRzXCI+XG4gICAgICA8VW5yZWFkSGFuZ291dHMgdW5yZWFkaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VcIj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogXCIjZWVlZWVlZVwiIH19PlxuICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfSB1c2VybmFtZT17aGFuZ291dC51c2VybmFtZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VzXCI+XG4gICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxuICAgIDwvQXBwUm91dGU+LFxuICBdO1xufVxuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBHZWFySWNvbiBmcm9tICdpY29ucy9ib290c3RyYXAvR2Vhckljb24nXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCb290c3RyYXBJY29ucyAoKXtcclxuICAgIHJldHVybiA8R2Vhckljb24vPlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tIFwiaWNvbnMvb25saW5lU3RhdHVzXCI7XG5pbXBvcnQgQXV0aERlbW9Sb3V0ZXMgZnJvbSBcIi4vYXV0aGVudGljYXRpb24vcm91dGVcIjtcbmltcG9ydCBDb21wb25lbnRzUm91dGVzIGZyb20gXCIuL2NvbXBvbmVudHMvcm91dGVcIjtcbmltcG9ydCBIYW5nb3V0Um91dGVzIGZyb20gXCIuL2hhbmdvdXQvcm91dGVcIjtcbmltcG9ydCBCb290c3RyYXBJY29ucyBmcm9tICcuL2ljb25zJ1xuLy8gY29uc3QgaGFuZ291dHMgPSBbXG4vLyAgIHsgdXNlcm5hbWU6ICd1c2Vyb25lJyB9LFxuLy8gICB7IHVzZXJuYW1lOiAndXNlcnR3bycgfSxcbi8vICAgeyB1c2VybmFtZTogJ3VzZXJ0aHJlZScgfSxcbi8vIF07XG4vLyBjb25zdCBoYW5nb3V0ID0ge1xuLy8gICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcbi8vICAgZW1haWw6ICd0ZXN0QGdtYWlsLmNvbScsXG4vLyAgIG1lc3NhZ2U6IHsgdGV4dDogYExldCdzIGNoYXQgb24gSGFuZ291dCFgLCB0aW1lc3RhbXA6IDE1OTA4MjA3ODI5MjEgfSxcbi8vIH07XG4vLyBjb25zdCBtZXNzYWdlID0ge1xuLy8gICB1c2VybmFtZTogJ2JyZW5vJyxcbi8vICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuLy8gICB0aW1lc3RhbXA6IDE1OTEzMzE3Njc4MzYsXG4vLyB9O1xuLy8gLy9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3Rvcnlib29rUm91dGVzKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiBcIjg1dmhcIiB9fT5cbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL29ubGluZVwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxPbmxpbmVTdGF0dXMgb25saW5lIC8+XG4gICAgICAgICAgPE9ubGluZVN0YXR1cyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQXBwUm91dGU+XG5cblxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaWNvbnNcIj5cbiAgICAgICAgPEJvb3RzdHJhcEljb25zIC8+XG4gICAgICA8L0FwcFJvdXRlPlxuICAgICAgPEF1dGhEZW1vUm91dGVzIC8+XG4gICAgICA8Q29tcG9uZW50c1JvdXRlcyAvPlxuICAgICAgPEhhbmdvdXRSb3V0ZXMgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZiYXIocHJvcHMpIHtcbiAgY29uc3QgeyBiZyA9IFwibGlnaHRcIiwgYnJhbmQsIGNoaWxkcmVuIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciBuYXZiYXItZXhwYW5kLWxnIG5hdmJhci0ke2JnfSBiZy0ke2JnfWB9PlxuICAgICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIiNcIj5cbiAgICAgICAge2JyYW5kfVxuICAgICAgPC9hPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlclwiXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJcbiAgICAgICAgZGF0YS10YXJnZXQ9XCIjbmF2YmFyU3VwcG9ydGVkQ29udGVudFwiXG4gICAgICAgIGFyaWEtY29udHJvbHM9XCJuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCJcbiAgICAgICAgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlRvZ2dsZSBuYXZpZ2F0aW9uXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXItaWNvblwiPjwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvbmF2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyQ29sbGFwc2UoeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIj5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5hdkJhck5hdih7IGNoaWxkcmVuIH0pIHtcbiAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1yLWF1dG9cIj57Y2hpbGRyZW59PC91bD47XG59XG4vL1xuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0oeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW1cIj57Y2hpbGRyZW59PC9saT47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOYXZMaW5rKHByb3BzKSB7XG4gIGNvbnN0IHsgYXBwUm91dGUgfSA9IHByb3BzO1xuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XG5cbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCwgcm91dGU6IGFwcFJvdXRlIH0pO1xuICB9XG4gIHJldHVybiA8YSBjbGFzc05hbWU9XCJuYXYtbGlua1wiIGhyZWY9XCIjXCIgb25DbGljaz17aGFuZGxlUm91dGV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tIFwiY29tcG9uZW50cy9hcHAtcm91dGVcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdkRyb3Bkb3duKHByb3BzKSB7XG4gIGNvbnN0IHsgdGl0bGUsIGNoaWxkcmVuIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW0gZHJvcGRvd25cIj5cbiAgICAgIDxhXG4gICAgICAgIGNsYXNzTmFtZT1cIm5hdi1saW5rIGRyb3Bkb3duLXRvZ2dsZVwiXG4gICAgICAgIGhyZWY9XCIjXCJcbiAgICAgICAgaWQ9XCJuYXZiYXJEcm9wZG93blwiXG4gICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgYXJpYS1oYXNwb3B1cD1cInRydWVcIlxuICAgICAgICBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIlxuICAgICAgICB7Li4ucHJvcHN9XG4gICAgICA+XG4gICAgICAgIHt0aXRsZX1cbiAgICAgIDwvYT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2xpPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRHJvcGRvd25NZW51KHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cIm5hdmJhckRyb3Bkb3duXCI+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBEcm9wZG93bkl0ZW0ocHJvcHMpIHtcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IFwiL1wiLCByb3V0ZTogYC8ke2lkfWAgfSk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8YSBjbGFzc05hbWU9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cIiNcIiB7Li4ucHJvcHN9IG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSAvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IFN0b3J5Ym9va1Byb3ZpZGVycyBmcm9tIFwiLi9TdG9yeWJvb2tQcm92aWRlcnNcIjtcbmltcG9ydCBTdG9yeWJvb2tSb3V0ZXMgZnJvbSBcIi4vU3Rvcnlib29rUm91dGVzXCI7XG5pbXBvcnQgTmF2YmFyLCB7XG4gIE5hdkJhck5hdixcbiAgTmF2SXRlbSxcbiAgTmF2TGluayxcbiAgTmF2QmFyQ29sbGFwc2UsXG59IGZyb20gXCJjb21wb25lbnRzL25hdi1iYXJcIjtcbmltcG9ydCBOYXZEcm9wZG93biwge1xuICBEcm9wZG93bk1lbnUsXG4gIERyb3Bkb3duSXRlbSxcbn0gZnJvbSBcImNvbXBvbmVudHMvbmF2LWJhci9uYXYtZHJvcGRvd25cIjtcblxucmVuZGVyKFxuICA8U3Rvcnlib29rUHJvdmlkZXJzPlxuICAgIDxOYXZiYXIgYnJhbmQ9XCJTdG9yeWJvb2tcIiBiZz1cImRhcmtcIj5cbiAgICAgIDxOYXZCYXJDb2xsYXBzZT5cbiAgICAgICAgPE5hdkJhck5hdj5cbiAgICAgICAgICA8TmF2RHJvcGRvd24gdGl0bGU9XCJDb21wb25lbnRzXCI+XG4gICAgICAgICAgICA8RHJvcGRvd25NZW51PlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiYnV0dG9uXCI+QnV0dG9uczwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwidGV4dC1pbnB1dFwiPlRleHRJbnB1dDwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiaWNvbnNcIj5JY29uczwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiYWxlcnRcIj5BbGVydDwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgPC9Ecm9wZG93bk1lbnU+XG4gICAgICAgICAgPC9OYXZEcm9wZG93bj5cbiAgICAgICAgICA8TmF2RHJvcGRvd24gdGl0bGU9XCJBdXRoZW50aWNhdGlvblwiPlxuICAgICAgICAgICAgPERyb3Bkb3duTWVudT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImxvZ2luXCI+TG9naW48L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cInNpZ251cFwiPlNpZ251cDwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiY2hhbmdlLXBhc3N3b3JkXCI+Q2hhbmdlIFBhc3N3b3JkPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJmb3Jnb3QtcGFzc3dvcmRcIj5Gb3Jnb3QgUGFzc3dvcmQ8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgIDwvRHJvcGRvd25NZW51PlxuICAgICAgICAgIDwvTmF2RHJvcGRvd24+XG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiSGFuZ291dFwiPlxuICAgICAgICAgICAgPERyb3Bkb3duTWVudT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImJsb2NrXCI+QmxvY2s8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImJsb2NrZWRcIj5CbG9ja2VkPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJjb25maWd1cmVcIj5Db25maWd1cmU8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImhhbmdjaGF0XCI+SGFuZ2NoYXQ8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImhhbmdvdXRcIj5IYW5nb3V0PC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJpbnZpdGVcIj5JbnZpdGU8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImludml0ZWVcIj5JbnZpdGVlPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJpbnZpdGVyXCI+SW52aXRlcjwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwidW5yZWFkaGFuZ291dHNcIj5VbnJlYWRIYW5nb3V0czwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgPC9Ecm9wZG93bk1lbnU+XG4gICAgICAgICAgPC9OYXZEcm9wZG93bj5cbiAgICAgICAgPC9OYXZCYXJOYXY+XG4gICAgICA8L05hdkJhckNvbGxhcHNlPlxuICAgIDwvTmF2YmFyPlxuICAgIDxTdG9yeWJvb2tSb3V0ZXMgLz5cbiAgPC9TdG9yeWJvb2tQcm92aWRlcnM+LFxuXG4gIGRvY3VtZW50LmJvZHlcbik7XG4iXSwibmFtZXMiOlsidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJ1c2VBcHBSb3V0ZSIsImRpc3BhdGNoIiwibmFtZSIsIm9uQXBwUm91dGUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsIkFwcFJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImZpbmQiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInVzZUVmZmVjdCIsImdldEl0ZW0iLCJwYXJzZSIsInZhbHVlIiwidXNlTWVtbyIsIkFwcFByb3ZpZGVycyIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXIiLCJPbmxpbmVTdGF0dXMiLCJyZWFkeVN0YXRlIiwiSXNPbmxpbmUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsIlRleHRJbnB1dCIsImxhYmVsIiwiaXNWYWxpZCIsIm1lc3NhZ2UiLCJ1bmRlZmluZWQiLCJCdXR0b24iLCJ0aXRsZSIsImJnIiwib3V0bGluZSIsInNpemUiLCJsb2FkaW5nIiwiYmxvY2siLCJBbGVydCIsImFsZXJ0IiwiTG9naW4iLCJlbWFpbG9ydXNlcm5hbWUiLCJwYXNzd29yZCIsIm9uTG9naW4iLCJvbkZvY3VzIiwib25DaGFuZ2UiLCJ2YWxpZGF0aW9uIiwib25Gb3Jnb3RQYXNzd29yZCIsIm9uQmx1ciIsImVycm9yIiwibWFyZ2luIiwicGFkZGluZyIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsInZhbGlkYXRpb25TdWNjZXNzIiwidmFsaWRhdGlvbkVycm9yIiwiTG9naW5TdGF0ZXMiLCJTaWdudXAiLCJ1c2VybmFtZSIsImVtYWlsIiwib25TaWdudXAiLCJTaWdudXBTdGF0ZXMiLCJDaGFuZ2VQYXNzd29yZCIsImNvbmZpcm0iLCJvblBhc3N3b3JkQ2hhbmdlIiwiQ2hhbmdlUGFzc3dvcmRTdGF0ZXMiLCJSZXF1ZXN0UGFzc0NoYW5nZSIsIm9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlIiwiRm9yZm90UGFzc3dvcmRTdGF0ZSIsIkZvcmdvdFBhc3N3b3JkIiwiQXV0aERlbW9Sb3V0ZXMiLCJTaWduVXBTdGF0ZXMiLCJGb3Jnb3RQYXNzd29yZFN0YXRlcyIsIkJ1dHRvbkRlbW8iLCJmbGV4RGlyZWN0aW9uIiwiYWxpZ25JdGVtcyIsIlRleHRJbnB1dFN0YXRlcyIsIlRvYXN0IiwidXNlckltYWdlIiwiVG9hc3REZW1vIiwiQWxlcnREZW1vIiwiQ29tcG9uZW50c1JvdXRlIiwiR2Vhckljb24iLCJjb2xvciIsInN0eWxlcyIsInJvb3QiLCJwb3NpdGlvbiIsIkxheW91dCIsImlkIiwiaGFuZ291dCIsIm9uTmF2aWdhdGlvbiIsImNoZWNrYm94IiwibWFyZ2luUmlnaHQiLCJjaGVja2JveFJvb3QiLCJsYXlvdXQiLCJib3hTaXppbmciLCJwYWRkaW5nVG9wIiwiQmxvY2siLCJvbkNhbmNlbCIsIm9uQmxvY2siLCJvblJlcG9ydCIsImZpbGwiLCJvbkNsaWNrIiwiQ2VudGVyIiwidGV4dEFsaWduIiwiQmxvY2tlZCIsIm9uVW5ibG9jayIsIm9uQ2xvc2UiLCJEZWxldGUiLCJBcmNoaXZlIiwiaWNvbkJ0biIsImJ0biIsImJ0bkNvbnRhaW5lciIsIkNvbmZpZ3VyZSIsIm9uRGVsZXRlIiwib25BcmNoaXZlIiwib25Ob3RpZmljYXRpb24iLCJvbkNvbnZlcnNhdGlvbkhpc3RvcnkiLCJvbk9rIiwiSWNvbkJ1dHRvbiIsIkljb24iLCJDaGVja2JveCIsIm1hcmdpblRvcCIsInVzZU1lZGlhUXVlcnkiLCJzZXRXaWR0aCIsInVzZVN0YXRlIiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJmb250U2l6ZSIsIk1lc3NhZ2UiLCJmbG9hdCIsInRpbWVzdGFtcCIsImRheXMiLCJzZXREYXlzIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJzZXRJbnRlcnZhbCIsIm1hcmdpbkJvdHRvbSIsInRleHQiLCJNZXNzYWdlRWRpdG9yIiwibWVzc2FnZVRleHQiLCJvbk1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlIiwiQmxvY2tlck1lc3NhZ2UiLCJCbG9ja2VkTWVzc2FnZSIsImhhbmRsZU5hdmlnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm1lc3NhZ2VDb250YWluZXIiLCJmbGV4Iiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImxlbmd0aCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtYXAiLCJtc2ciLCJzb3J0IiwiSGFuZ2NoYXQiLCJkb2N1bWVudCIsIkxpc3QiLCJMaXN0SXRlbSIsIkhhbmdvdXQiLCJoYW5nb3V0cyIsIm9uU2VhcmNoSW5wdXQiLCJvbkZldGNoSGFuZ291dHMiLCJvblNlbGVjdEhhbmdvdXQiLCJzZWFyY2giLCJQZXJzb25BZGRJY29uIiwiSW52aXRlIiwib25JbnZpdGUiLCJQZXJzb25BZGQiLCJEb25lIiwiSW52aXRlZSIsInBhZGRpbmdCb3R0b20iLCJJbnZpdGVyIiwib25BY2NlcHQiLCJvbkRlY2xpbmUiLCJtYXJnaW5MZWZ0IiwicmVkdWNlclVucmVhZGhhbmdvdXRzIiwidW5yZWFkaGFuZ291dHMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsImluZGV4IiwibWVzc2FnZUNvdW50Iiwib2JqIiwiZmluZEluZGV4Iiwic3BsaWNlIiwicHVzaCIsIlVucmVhZEhhbmdvdXRzIiwib25TZWxlY3RVbnJlYWQiLCJvblJlbW92ZVVucmVhZCIsIml0ZW1zIiwic2V0SXRlbXMiLCJyZWR1Y2VkIiwiSGFuZ291dFJvdXRlcyIsIkJvb3RzdHJhcEljb25zIiwiU3Rvcnlib29rUm91dGVzIiwiQ29tcG9uZW50c1JvdXRlcyIsIk5hdmJhciIsImJyYW5kIiwiTmF2QmFyQ29sbGFwc2UiLCJOYXZCYXJOYXYiLCJOYXZEcm9wZG93biIsIkRyb3Bkb3duTWVudSIsIkRyb3Bkb3duSXRlbSIsImhhbmRsZVJvdXRlIiwidGFyZ2V0IiwicmVuZGVyIiwiU3Rvcnlib29rUHJvdmlkZXJzIiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyw4REFBOEQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQSxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBeUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXVHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDOztBQ0F0dEUsTUFBTVUsV0FBVyxHQUFHO0FBQ3pCQyxFQUFBQSxpQkFBaUIsRUFBRSxtQkFETTs7QUFBQSxDQUFwQjs7QUNFQSxTQUFT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
