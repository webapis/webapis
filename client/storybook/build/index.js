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

function List(props) {
  return h("div", _extends({
    className: "list"
  }, props));
}

function ListItem(props) {
  return h("div", _extends({
    className: "list-item"
  }, props));
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
    loading = false
  } = props;
  return h("button", _extends({
    className: `${bg && !outline && `btn btn-${bg}`} ${outline && `btn btn-outline-${bg}`} ${size && `btn btn-${size}`}`
  }, props, {
    disabled: loading
  }), loading && h("span", {
    class: "spinner-border spinner-border-sm",
    role: "status",
    "aria-hidden": "true"
  }), loading ? 'wait...' : title);
}

const style = {
  inputContainer: {
    display: 'flex',
    border: '#737373 solid 1px'
  },
  input: {
    padding: 10,
    flex: 1,
    border: 'white'
  }
};
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
    style: style.inputContainer
  }, h(TextInput, {
    value: search,
    id: "search-input",
    type: "search",
    onChange: onSearchInput,
    style: style.input
  }), h(Button, {
    "data-testid": "search-btn",
    disabled: !search,
    title: "search",
    onClick: onFetchHangouts
  })), h(List, {
    id: "hangouts-list"
  }, hangouts && hangouts.length > 0 && hangouts.map(g => {
    return h(ListItem, {
      id: g.username,
      "data-testid": g.username,
      onClick: handleHangoutSelection
    }, g.username);
  })));
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

const style$1 = {
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
    style: style$1.layout
  }, h("div", {
    style: style$1.checkboxRoot
  }, h("input", {
    type: "checkbox",
    style: style$1.checkbox,
    onChange: onReport
  }), h("label", null, "Report")), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    "data-testid": "cancel-btn",
    style: style$1.btn,
    onClick: onCancel
  }, "CANCEL"), h(Button, {
    title: "Block",
    style: style$1.btn,
    id: "BLOCK",
    onClick: onBlock,
    "data-testid": "block-btn"
  }, "BLOCK")));
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

const style$2 = {
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
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, h(Block$1, {
    width: "60",
    height: "70",
    color: "red"
  }), h("b", null, hangout && hangout.username), " is blocked"), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    "data-testid": "close-btn",
    style: style$2.btn,
    onClick: onClose
  }, "CLOSE"), h(Button, {
    id: "UNBLOCK",
    style: style$2.btn,
    onClick: onUnblock,
    "data-testid": "unblock-btn"
  }, "UNBLOCK")));
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

const style$3 = {
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
  })), h("div", {
    style: style$3.btnOk
  }, h(Button, {
    onClick: onOk
  }, "OK")));
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

const style$4 = {
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
    style: style$4.layout,
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
    "data-testid": "oninvite-btn"
  }, "SEND INVITE")));
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

const style$5 = {
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
    style: style$5.layout,
    id: "invitee-ui"
  }, h(Center, null, h(Done, {
    width: "70",
    height: "70",
    color: "green"
  })), h(Center, null, h("p", null, "You will be able to chat with ", h("b", null, hangout && hangout.email), " once your invition has been accepted.")));
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

const style$6 = {
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
      width: '100%',
      marginBottom: 3
    }
  }, h("div", {
    style: { ...style$6.root,
      float
    }
  }, h("div", {
    "data-testid": "message",
    style: style$6.message,
    className: `message-font-${device}-size`
  }, message && message.text), h("div", {
    style: style$6.log
  }, h("div", {
    style: style$6.username
  }, username && username, ":"), h("div", null, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", ' '), days <= 10 && days > 1 && h("div", null, days, " days ago")))));
}

const style$7 = {
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
    style: style$7.root
  }, h("div", {
    style: {
      marginLeft: 8,
      display: 'flex'
    }
  }, hangout && hangout.message && h(Message, {
    message: hangout && hangout.message && { ...hangout.message,
      username: hangout.username,
      float: 'left'
    }
  })), h("div", {
    style: {
      display: 'flex',
      paddingLeft: 8,
      paddingRight: 8
    }
  }, h(Button, {
    id: "DECLINE",
    onClick: onDecline,
    "data-testid": "decline-btn",
    title: "Decline",
    style: {
      flex: 1,
      marginRight: 4,
      color: 'red'
    }
  }, "DECLINE"), h(Button, {
    id: "ACCEPT",
    onClick: onAccept,
    "data-testid": "accept-btn",
    style: {
      flex: 1,
      marginLeft: 4,
      color: 'green'
    },
    loading: loading
  }, "ACCEPT"))));
}

const styles$1 = {
  root: {
    display: 'flex',
    alignItems: 'center',
    // position:'fixed',
    width: '100%' // bottom:10,
    // right:10,

  },
  input: {
    //margin:0
    padding: 5,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: 'border-box',
    flex: 1,
    width: '100%'
  },
  btn: {
    padding: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: 'border-box',
    flex: 1
  }
};
function MessageEditor({
  loading,
  messageText,
  onMessageText,
  onMessage,
  hangout
}) {
  return h("div", {
    style: styles$1.root
  }, h("div", {
    style: {
      flex: 1
    }
  }, h(TextInput, {
    style: styles$1.input,
    disabled: hangout && hangout.state === 'BLOCKED',
    type: "text",
    onChange: onMessageText,
    "data-testid": "message-input",
    value: messageText
  })), h("div", {
    style: {
      marginLeft: 3
    }
  }, h(Button, {
    loading: loading,
    disabled: hangout && hangout.state === 'BLOCKED',
    style: styles$1.btn,
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  }, "SENT")));
}

const style$8 = {
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
    style: style$8,
    "data-testid": "blocker-message"
  }, message.text);
}

const style$9 = {
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
    style: style$9,
    "data-testid": "blocked-message"
  }, message.text, h("a", {
    id: "UNBLOCK",
    "data-testid": "seemore-btn",
    href: "/",
    onClick: handleNavigation
  }, "see more"));
}

const styles$2 = {
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
    style: { ...styles$2.messageContainer,
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
  }, ' ', !m.type && h(Message, {
    message: m
  }), m.type && m.type === 'blocker' && h(BlockerMessage, {
    message: m
  }), m.type && m.type === 'blocked' && h(BlockedMessage, {
    message: m,
    onNavigation: onNavigation
  })))), h("div", {
    style: {
      flex: 1
    }
  }, h(MessageEditor, {
    loading: loading,
    hangout: hangout,
    onMessage: onSend,
    messageText: messageText,
    onMessageText: onMessageText
  })));
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

const style$a = {
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
    style: { ...style$a,
      backgroundColor: 'green'
    },
    "data-testid": "online"
  });
}
function IsOffline() {
  return h("div", {
    style: { ...style$a,
      backgroundColor: 'red'
    },
    "data-testid": "offline"
  });
}
function Connecting() {
  return h("div", {
    style: { ...style$a,
      backgroundColor: 'orange'
    },
    "data-testid": "connecting"
  });
}
function Closing() {
  return h("div", {
    style: { ...style$a,
      backgroundColor: 'pink'
    },
    "data-testid": "closing"
  });
}

const style$b = {
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
function Message$1({
  count = 0
}) {
  return h("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, h("div", null, "message:"), h("div", {
    style: style$b.count,
    "data-testid": "message-count"
  }, count));
}

function IconsDemo() {
  return h("div", null, h(Message$1, {
    count: 1
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
    style: {
      paddingTop: 68
    }
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

const unreads = [{
  username: 'demo',
  state: 'MESSANGER',
  message: {
    text: 'Hello you',
    timestamp: 1591810458630
  }
}, {
  username: 'demo',
  state: 'MESSANGER',
  message: {
    text: 'Hello you',
    timestamp: 1591810458630
  }
}, {
  username: 'bero',
  state: 'MESSANGER',
  message: {
    text: 'Hello you',
    timestamp: 1591810458630
  }
}];
function UnreadDemo() {
  return h(UnreadHangouts, {
    unreadhangouts: reducerUnreadhangouts({
      unreadhangouts: unreads
    })
  });
}

const message = {
  text: 'You can not send message because you are blocked',
  timestamp: 12323,
  username: 'demo'
};
function BlockerMessageDemo() {
  return h(BlockerMessage, {
    message: message
  });
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
const message$1 = {
  username: 'breno',
  text: `Let's Chat on Hangout!`,
  timestamp: 1591331767836
}; //

function StorybookRoutes() {
  return h("div", {
    style: {
      height: '100vh'
    }
  }, h(AppRoute, {
    path: "/hangouts"
  }, h(Hangout, {
    hangouts: hangouts
  })), h(AppRoute, {
    path: "/block"
  }, h(Block, {
    hangout: hangout
  })), h(AppRoute, {
    path: "/blocked"
  }, h(Blocked, {
    hangout: hangout
  })), h(AppRoute, {
    path: "/configure"
  }, h(Configure, {
    hangout: hangout
  })), h(AppRoute, {
    path: "/invite"
  }, h(Invite, {
    hangout: hangout
  })), h(AppRoute, {
    path: "/invitee"
  }, h(Invitee, {
    hangout: hangout
  })), h(AppRoute, {
    path: "/inviter"
  }, h(Inviter, {
    hangout: hangout
  })), h(AppRoute, {
    path: "/hangchat"
  }, h(Hangchat, {
    hangout: hangout,
    messages: messages,
    username: "demo"
  })), h(AppRoute, {
    path: "/message"
  }, h("div", {
    style: {
      padding: 20,
      backgroundColor: '#eeeeeee'
    }
  }, h(Message, {
    message: message$1,
    username: hangout.username
  }))), h(AppRoute, {
    path: "/online"
  }, h("div", null, h(OnlineStatus, {
    online: true
  }), h(OnlineStatus, null))), h(AppRoute, {
    path: "/messages"
  }, h(Hangchat, {
    hangout: hangout,
    messages: messages,
    username: "demo"
  })), h(AppRoute, {
    path: "/unread"
  }, h(UnreadDemo, null)), h(AppRoute, {
    path: "/blocker-message"
  }, h(BlockerMessageDemo, null)), h(AppRoute, {
    path: "/icons"
  }, h(IconsDemo, null)), h(AuthDemoRoutes, null), h(ComponentsRoute, null));
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
}, "Forgot Password")))))), h(StorybookRoutes, null)), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2luZGV4LmpzIiwiLi4vU3Rvcnlib29rUHJvdmlkZXJzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9saXN0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy90ZXh0LWlucHV0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9idXR0b24vaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXQuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0xheW91dC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2suanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0Jsb2NrLmpzIiwiLi4vLi4vY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9ja2VkLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0FyY2hpdmUuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvUGVyc29uQWRkLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGUuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0RvbmUuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZWUuanMiLCIuLi8uLi9jb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9NZXNzYWdlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9CbG9ja2VyTWVzc2FnZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvQmxvY2tlZE1lc3NhZ2UuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL2luZGV4LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9IYW5nY2hhdC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9NZXNzYWdlLmpzIiwiLi4vSWNvbnNEZW1vLmpzIiwiLi4vZmFrZU1lc3NhZ2VzLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL1VucmVhZEhhbmdvdXRzLmpzIiwiLi4vVXJlYWREZW1vLmpzIiwiLi4vQmxvY2tlck1lc3NhZ2VEZW1vLmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9hbGVydC9pbmRleC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvTG9naW4uanMiLCIuLi9hdXRoZW50aWNhdGlvbi9zdGF0ZXMvbG9naW4uc3RhdGVzLmpzIiwiLi4vLi4vZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9zaWdudXAuanMiLCIuLi9hdXRoZW50aWNhdGlvbi9zdGF0ZXMvc2lnbnVwLnN0YXRlcy5qcyIsIi4uLy4uL2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvQ2hhbmdlUGFzc3dvcmQuanMiLCIuLi9hdXRoZW50aWNhdGlvbi9zdGF0ZXMvY2hhbmdlLXBhc3N3b3JkLnN0YXRlcy5qcyIsIi4uLy4uL2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvRm9yZ290UGFzc3dvcmQuanMiLCIuLi9hdXRoZW50aWNhdGlvbi9zdGF0ZXMvZm9yZ290LXBhc3N3b3JkLnN0YXRlcy5qcyIsIi4uL2F1dGhlbnRpY2F0aW9uL3JvdXRlLmpzIiwiLi4vY29tcG9uZW50cy9idXR0b24vaW5kZXguanMiLCIuLi9jb21wb25lbnRzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL3RvYXN0L3VzZXIucG5nIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy90b2FzdC9pbmRleC5qcyIsIi4uL2NvbXBvbmVudHMvdG9hc3QvaW5kZXguanMiLCIuLi9jb21wb25lbnRzL2FsZXJ0L2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy9yb3V0ZS5qcyIsIi4uL1N0b3J5Ym9va1JvdXRlcy5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbmF2LWJhci9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtZHJvcGRvd24uanMiLCIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xyXG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcclxuICAvLyAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcbiAgY29uc3Qge25hbWV9PXN0YXRlXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBpZihuYW1lKXtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obmFtZSxKU09OLnN0cmluZ2lmeSh7cm91dGUsZmVhdHVyZVJvdXRlfSkpXHJcbiAgICB9XHJcbiAgIFxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGlmKHN0YXRlICYmIHN0YXRlLm5hbWUgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSkpe1xyXG4gXHJcbiAgICAgICAgY29uc3Qge2ZlYXR1cmVSb3V0ZSxyb3V0ZX09IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpKVxyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gICAgfVxyXG5cclxuICB9LFtdKVxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAgQXBwUm91dGVQcm92aWRlciAgZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICBcclxuICAgICAgPEFwcFJvdXRlUHJvdmlkZXJcclxuICAgICAgIC8vXHJcbiAgICAgICAgdGl0bGU9XCJXZWJjb21cIlxyXG4gICAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnLG5hbWU6J3N0b3J5Ym9vaycgfX1cclxuICAgICAgPlxyXG4gICAgXHJcbiAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICA8L0FwcFJvdXRlUHJvdmlkZXI+XHJcblxyXG4gICk7XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuXHJcblxyXG4gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGlzdChwcm9wcykge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3RcIiB7Li4ucHJvcHN9Lz5cclxuICApO1xyXG59XHJcblxyXG5cclxuIGZ1bmN0aW9uIExpc3RJdGVtKHByb3BzKSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtaXRlbVwiIHsuLi5wcm9wc30gLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQge0xpc3RJdGVtfSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUZXh0SW5wdXQocHJvcHMpIHtcclxuICBjb25zdCB7IGxhYmVsLCBuYW1lLCB0eXBlLCBpc1ZhbGlkLCBtZXNzYWdlIH0gPSBwcm9wc1xyXG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgcC0wXCI+XHJcbiAgICA8bGFiZWwgZm9yPXtuYW1lfSA+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICA8aW5wdXQgdHlwZT17dHlwZX0gY2xhc3NOYW1lPXtgZm9ybS1jb250cm9sICR7aXNWYWxpZCAmJiAnaXMtdmFsaWQnfSAkeyFpc1ZhbGlkICYmIGlzVmFsaWQgIT09IHVuZGVmaW5lZCAmJiAnaXMtaW52YWxpZCd9YH0gaWQ9e25hbWV9IGFyaWEtZGVzY3JpYmVkYnk9e25hbWV9ey4uLnByb3BzfSAvPlxyXG57IWlzVmFsaWQgJiYgPHNtYWxsIGlkPVwiZW1haWxIZWxwXCIgY2xhc3NOYW1lPXtgJHshaXNWYWxpZCAmJiAnaW52YWxpZC1mZWVkYmFjayd9YH0gZGF0YS10ZXN0aWQ9e2BtZXNzYWdlLSR7bmFtZX1gfT57bWVzc2FnZX08L3NtYWxsPn1cclxuICA8L2Rpdj5cclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xyXG4gIGNvbnN0IHsgdGl0bGUsIGJnPVwibGlnaHRcIixvdXRsaW5lLCBzaXplLGxvYWRpbmc9ZmFsc2V9ID0gcHJvcHM7XHJcbiAgXHJcbiAgcmV0dXJuIChcclxuICAgIDxidXR0b24gY2xhc3NOYW1lPSB7YCR7YmcgJiYgIW91dGxpbmUmJmBidG4gYnRuLSR7Ymd9YH0gJHtvdXRsaW5lJiZgYnRuIGJ0bi1vdXRsaW5lLSR7Ymd9YH0gJHtzaXplJiZgYnRuIGJ0bi0ke3NpemV9YH1gfSB7Li4ucHJvcHN9IGRpc2FibGVkPXtsb2FkaW5nfT5cclxuICAgICAgICB7bG9hZGluZyAmJiA8c3BhbiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtXCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj59IFxyXG4gICAgICAgIHsgbG9hZGluZyA/ICd3YWl0Li4uJzp0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgTGlzdCx7IExpc3RJdGVtIH0gZnJvbSAnY29udHJvbHMvbGlzdCc7XHJcbmltcG9ydCAgVGV4dElucHV0ICBmcm9tICdjb250cm9scy90ZXh0LWlucHV0JztcclxuaW1wb3J0ICBCdXR0b24gIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnXHJcblxyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgaW5wdXRDb250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGJvcmRlcjogJyM3MzczNzMgc29saWQgMXB4JyxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICBwYWRkaW5nOiAxMCxcclxuICAgIGZsZXg6IDEsXHJcbiAgICBib3JkZXI6ICd3aGl0ZScsXHJcblxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0KHtcclxuICBoYW5nb3V0cyxcclxuICBvblNlYXJjaElucHV0LFxyXG4gIG9uRmV0Y2hIYW5nb3V0cyxcclxuICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgc2VhcmNoXHJcbn0pIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKClcclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0U2VsZWN0aW9uKGUpIHtcclxuICAgIGNvbnN0IGlkID0gZS50YXJnZXQuaWRcclxuICAgIG9uU2VsZWN0SGFuZ291dChlKVxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoZyA9PiBnLnVzZXJuYW1lID09PSBpZClcclxuXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSlcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pbnB1dENvbnRhaW5lcn0+XHJcbiAgICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgICAgdmFsdWU9e3NlYXJjaH1cclxuICAgICAgICAgIGlkPVwic2VhcmNoLWlucHV0XCJcclxuICAgICAgICAgIHR5cGU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgb25DaGFuZ2U9e29uU2VhcmNoSW5wdXR9XHJcbiAgICAgICAgICBzdHlsZT17c3R5bGUuaW5wdXR9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1idG5cIlxyXG4gICAgICAgICAgZGlzYWJsZWQ9eyFzZWFyY2h9XHJcbiAgICAgICAgICB0aXRsZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICBvbkNsaWNrPXtvbkZldGNoSGFuZ291dHN9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8TGlzdCBpZD1cImhhbmdvdXRzLWxpc3RcIj5cclxuICAgICAgICB7aGFuZ291dHMgJiZcclxuICAgICAgICAgIGhhbmdvdXRzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGhhbmdvdXRzLm1hcCgoZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxMaXN0SXRlbSBpZD17Zy51c2VybmFtZX0gZGF0YS10ZXN0aWQ9e2cudXNlcm5hbWV9IG9uQ2xpY2s9e2hhbmRsZUhhbmdvdXRTZWxlY3Rpb259PlxyXG4gICAgICAgICAgICAgICAge2cudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICA8L0xpc3Q+XHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWUnLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGF5b3V0KHsgY2hpbGRyZW4sIHN0eWxlLCBpZCB9KSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9e2lkfSBzdHlsZT17eyAuLi5zdHlsZXMucm9vdCwgLi4uc3R5bGUgfX0+e2NoaWxkcmVufTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCAgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcbmltcG9ydCAgQnV0dG9uICBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjaGVja2JveDogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGNoZWNrYm94Um9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICBwYWRkaW5nOiAxNixcclxuICB9LFxyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmdUb3A6NjhcclxuICB9LFxyXG4gIGJ0bjoge1xyXG4gICAgZmxleDogMSxcclxuICAgIG1hcmdpblJpZ2h0OiA0LFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9jayh7IG9uQ2FuY2VsLCBvbkJsb2NrLCBvblJlcG9ydCB9KSB7XHJcblxyXG4gXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmNoZWNrYm94Um9vdH0+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHN0eWxlPXtzdHlsZS5jaGVja2JveH0gb25DaGFuZ2U9e29uUmVwb3J0fSAvPlxyXG4gICAgICAgIDxsYWJlbD5SZXBvcnQ8L2xhYmVsPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XHJcbiAgICAgICAgPEJ1dHRvbiBkYXRhLXRlc3RpZD0nY2FuY2VsLWJ0bicgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DYW5jZWx9ID5DQU5DRUw8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQmxvY2tcIiBzdHlsZT17c3R5bGUuYnRufSBpZD1cIkJMT0NLXCIgb25DbGljaz17b25CbG9ja30gZGF0YS10ZXN0aWQ9XCJibG9jay1idG5cIiA+QkxPQ0s8L0J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2soe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgb25DbGljayxcclxuICBpZCxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGhlaWdodD17aGVpZ2h0fVxyXG4gICAgICB2aWV3Qm94PScwIDAgMjQgMjQnXHJcbiAgICAgIHdpZHRoPXt3aWR0aH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgaWQ9e2lkfVxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSBpZD17aWR9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgaWQ9e2lkfVxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek00IDEyYzAtNC40MiAzLjU4LTggOC04IDEuODUgMCAzLjU1LjYzIDQuOSAxLjY5TDUuNjkgMTYuOUM0LjYzIDE1LjU1IDQgMTMuODUgNCAxMnptOCA4Yy0xLjg1IDAtMy41NS0uNjMtNC45LTEuNjlMMTguMzEgNy4xQzE5LjM3IDguNDUgMjAgMTAuMTUgMjAgMTJjMCA0LjQyLTMuNTggOC04IDh6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIENlbnRlcih7IGNoaWxkcmVuLCBzdHlsZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgLi4uc3R5bGUsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJ2ljb25zL0Jsb2NrJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyJztcclxuaW1wb3J0ICBCdXR0b24gIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCAgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nVG9wOjY4XHJcbiAgfSxcclxuICBidG46IHtcclxuICAgIGZsZXg6IDEsXHJcbiAgICBtYXJnaW5SaWdodDogNCxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2tlZCh7IGhhbmdvdXQsIG9uVW5ibG9jaywgb25DbG9zZSB9KSB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImJsb2NrZWQtdWlcIj5cclxuICAgICAgPENlbnRlciBzdHlsZT17eyBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XHJcbiAgICAgICAgPEJsb2NrIHdpZHRoPVwiNjBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwicmVkXCIgLz5cclxuICAgICAgICA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LnVzZXJuYW1lfTwvYj4gaXMgYmxvY2tlZFxyXG4gICAgICA8L0NlbnRlcj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxyXG4gICAgICAgIDxCdXR0b24gZGF0YS10ZXN0aWQ9J2Nsb3NlLWJ0bicgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbG9zZX0gPkNMT1NFPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBpZD0nVU5CTE9DSycgIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uVW5ibG9ja30gZGF0YS10ZXN0aWQ9J3VuYmxvY2stYnRuJz5VTkJMT0NLPC9CdXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIERlbGV0ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHonXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFyY2hpdmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9ezI0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTIwLjU0IDUuMjNsLTEuMzktMS42OEMxOC44OCAzLjIxIDE4LjQ3IDMgMTggM0g2Yy0uNDcgMC0uODguMjEtMS4xNi41NUwzLjQ2IDUuMjNDMy4xNyA1LjU3IDMgNi4wMiAzIDYuNVYxOWMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjYuNWMwLS40OC0uMTctLjkzLS40Ni0xLjI3ek0xMiAxNy41TDYuNSAxMkgxMHYtMmg0djJoMy41TDEyIDE3LjV6TTUuMTIgNWwuODEtMWgxMmwuOTQgMUg1LjEyeidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcbmltcG9ydCB7IERlbGV0ZSB9IGZyb20gJ2ljb25zL0RlbGV0ZSc7XHJcbmltcG9ydCB7IEFyY2hpdmUgfSBmcm9tICdpY29ucy9BcmNoaXZlJztcclxuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICAnaWNvbnMvQmxvY2snO1xyXG5pbXBvcnQgIEJ1dHRvbiAgZnJvbSAnY29udHJvbHMvYnV0dG9uJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgaWNvbkJ0bjogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW46IDggfSxcclxuICBidG46IHsgbWFyZ2luUmlnaHQ6IDggfSxcclxuICBidG5Db250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gIH0sXHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICB9LFxyXG4gIGJ0bk9rOiB7XHJcbiAgICBtYXJnaW46IDgsXHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlndXJlKHtcclxuICBvbkJsb2NrLFxyXG4gIG9uRGVsZXRlLFxyXG4gIG9uQXJjaGl2ZSxcclxuICBvbk5vdGlmaWNhdGlvbixcclxuICBvbkNvbnZlcnNhdGlvbkhpc3RvcnksXHJcbiAgb25OYXZpZ2F0aW9uLFxyXG4gIG9uT2ssXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8Q2hlY2tib3ggbGFiZWw9XCJOb3RpZmljYXRpb25zXCIgb25DaGFuZ2U9e29uTm90aWZpY2F0aW9ufSAvPlxyXG4gICAgICAgIDxDaGVja2JveFxyXG4gICAgICAgICAgbGFiZWw9XCJDb252ZXJzYXRpb24gSGlzdG9yeVwiXHJcbiAgICAgICAgICBvbkNoYW5nZT17b25Db252ZXJzYXRpb25IaXN0b3J5fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8aHIgLz5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuQ29udGFpbmVyfT5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkFyY2hpdmVcIiBJY29uPXtBcmNoaXZlfSBvbkNsaWNrPXtvbkFyY2hpdmV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJEZWxldGVcIiBJY29uPXtEZWxldGV9IG9uQ2xpY2s9e29uRGVsZXRlfSAvPlxyXG4gICAgICAgIDxJY29uQnV0dG9uIGlkPVwiYmNrdWlcIiB0aXRsZT1cIkJsb2NrXCIgSWNvbj17QmxvY2t9IG9uQ2xpY2s9e29uTmF2aWdhdGlvbn0gIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Pa30+XHJcbiAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvbk9rfT5PSzwvQnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEljb25CdXR0b24oeyBJY29uLCB0aXRsZSwgb25DbGljayxpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLmljb25CdG59PlxyXG4gICAgICA8YnV0dG9uIGlkPXtpZH0gc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbGlja30gZGF0YS10ZXN0aWQ9e2Ake2lkfS1idG5gfT5cclxuICAgICAgICA8SWNvbiBpZD17aWR9Lz5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxkaXY+e3RpdGxlfTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2hlY2tib3goeyBsYWJlbCwgb25DaGFuZ2UgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbjogOCwgbWFyZ2luVG9wOiA4IH19PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxyXG4gICAgICA8bGFiZWw+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQZXJzb25BZGRJY29uKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ3doaXRlJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTUgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0tOS0yVjdINHYzSDF2MmgzdjNoMnYtM2gzdi0ySDZ6bTkgNGMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgUGVyc29uQWRkIGZyb20gJ2ljb25zL1BlcnNvbkFkZCc7XHJcbmltcG9ydCAgVGV4dElucHV0ICBmcm9tICdjb250cm9scy90ZXh0LWlucHV0JztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyJztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgfSxcclxufTtcclxuLy9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlKHsgaGFuZ291dCwgb25JbnZpdGUsIG9uTWVzc2FnZVRleHQsbWVzc2FnZVRleHQsIGxvYWRpbmcgfSkge1xyXG5cclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fWlkPVwiaW52aXRlLXVpXCI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPFBlcnNvbkFkZCBjb2xvcj1cImdyZWVuXCIgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgU3RhcnQgQ29udmVyc2F0aW9uIHdpdGggPGI+e2hhbmdvdXQgJiYgaGFuZ291dC5lbWFpbH08L2I+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgICA8VGV4dElucHV0IGlkPVwibWVzc2FnZVRleHRJbnB1dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSB2YWx1ZT17bWVzc2FnZVRleHR9IC8+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPEJ1dHRvbiBsb2FkaW5nPXtsb2FkaW5nfSAgaWQ9XCJJTlZJVEVcIiBvbkNsaWNrPXtvbkludml0ZX0gZGF0YS10ZXN0aWQ9J29uaW52aXRlLWJ0bicgPlxyXG4gICAgICAgICAgU0VORCBJTlZJVEVcclxuICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERvbmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTkgMTYuMkw0LjggMTJsLTEuNCAxLjRMOSAxOSAyMSA3bC0xLjQtMS40TDkgMTYuMnonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBEb25lIH0gZnJvbSAnaWNvbnMvRG9uZSc7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCAgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZWUoeyBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiaW52aXRlZS11aVwiPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxEb25lIHdpZHRoPVwiNzBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwiZ3JlZW5cIiAvPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8cD5cclxuICAgICAgICAgIFlvdSB3aWxsIGJlIGFibGUgdG8gY2hhdCB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPiBvbmNlXHJcbiAgICAgICAgICB5b3VyIGludml0aW9uIGhhcyBiZWVuIGFjY2VwdGVkLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IGRldmljZVR5cGUgZnJvbSAnLi9kZXZpY2VUeXBlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KCkge1xyXG4gIGNvbnN0IFt3aWR0aCwgc2V0V2lkdGhdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hlaWdodCwgc2V0SGVpZ2h0XSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtvcmllbnRhdGlvbiwgc2V0T3JpZW50YXRpb25dID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtkZXZpY2UsIHNldERldmljZV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlVmlld3BvcnRTaXplKCkge1xyXG4gICBcclxuICAgICAgc2V0V2lkdGgod2luZG93LmlubmVyV2lkdGgpO1xyXG4gICAgICBzZXRIZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKSB7XHJcbiAgICBzZXRPcmllbnRhdGlvbih3aW5kb3cuc2NyZWVuLm9yaWVudGF0aW9uKTtcclxuICB9XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh3aWR0aCA+IDApIHtcclxuICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA2MDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3Bob25lJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDc2ODpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDk5MjpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDEyMDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3RhYmxldCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdsYXB0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPiAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdkZXNrdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFt3aWR0aF0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2RldmljZScsIGRldmljZSk7XHJcbiAgfSwgW2RldmljZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBoYW5kbGVWaWV3cG9ydFNpemUoKTtcclxuICAgIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gaGFuZGxlVmlld3BvcnRTaXplKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB9O1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24sIGRldmljZSB9O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG4vL2ltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgYm9yZGVyQ29sb3I6ICcjZWVlZWVlJyxcclxuICAgIGJvcmRlclN0eWxlOiAnc29saWQnLFxyXG4gICAgYm9yZGVyV2lkdGg6IDEsXHJcbiAgICBib3JkZXJSYWRpdXM6IDUsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgbWluSGVpZ2h0OiAzNSxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICB9LFxyXG4gIHVzZXJuYW1lOiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgbG9nOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBjb2xvcjogJyM3MzczNzMnLFxyXG4gICAgZm9udFNpemU6IDEwLFxyXG4gIH0sXHJcbiAgbWVzc2FnZToge30sXHJcbn07XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSx0aW1lc3RhbXAgfSA9IG1lc3NhZ2U7XHJcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCB7IGRldmljZSB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIGZ1bmN0aW9uIGNvbnZlcnRNUyhtcykge1xyXG4gICAgdmFyIGQsIGgsIG0sIHM7XHJcbiAgICBzID0gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xyXG4gICAgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcclxuICAgIHMgPSBzICUgNjA7XHJcbiAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xyXG4gICAgbSA9IG0gJSA2MDtcclxuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XHJcbiAgICBoID0gaCAlIDI0O1xyXG4gICAgc2V0RGF5cyhkKTtcclxuICAgIHNldEhvdXJzKGgpO1xyXG4gICAgc2V0TWludXRlcyhtKTtcclxuICAgIHNldFNlY29uZHMocyk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYodGltZXN0YW1wKXtcclxuICBcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSB0aW1lc3RhbXApO1xyXG4gICAgICB9LCAwKTtcclxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcclxuICAgICAgfSwgNjAwMDApO1xyXG4gXHJcblxyXG4gICAgfVxyXG4gICBcclxuICB9LCBbdGltZXN0YW1wXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIG1hcmdpbkJvdHRvbTogMyB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VcIlxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2BtZXNzYWdlLWZvbnQtJHtkZXZpY2V9LXNpemVgfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH1cclxuICAgICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5sb2d9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XHJcbiAgPGRpdj5cclxuICAgICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA9PT0gMCAmJiBtaW51dGVzID4gMCAmJiA8ZGl2PnttaW51dGVzfSBtaW51dGVzIGFnbyA8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtob3Vyc30gaG91cnMge21pbnV0ZXN9IG1pbnV0ZXMgYWdveycgJ31cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAge2RheXMgPD0gMTAgJiYgZGF5cyA+IDEgJiYgPGRpdj57ZGF5c30gZGF5cyBhZ288L2Rpdj59XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9tZXNzYWdlcy9NZXNzYWdlJztcclxuaW1wb3J0IExheW91dCAgZnJvbSAnLi9MYXlvdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBwYWRkaW5nVG9wOiA3MCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIHBhZGRpbmdCb3R0b206OCxcclxuIFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSxsb2FkaW5nIH0pIHtcclxuIFxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IGlkPVwiaW52aXRlci11aVwiPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkxlZnQ6IDgsIGRpc3BsYXk6J2ZsZXgnIH19PlxyXG4gICAgICAgICAge2hhbmdvdXQgJiYgaGFuZ291dC5tZXNzYWdlICYmIChcclxuICAgICAgICAgICAgPE1lc3NhZ2VcclxuICAgICAgICAgICAgICBtZXNzYWdlPXtcclxuICAgICAgICAgICAgICAgIGhhbmdvdXQgJiZcclxuICAgICAgICAgICAgICAgIGhhbmdvdXQubWVzc2FnZSAmJiB7XHJcbiAgICAgICAgICAgICAgICAgIC4uLmhhbmdvdXQubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsZmxvYXQ6J2xlZnQnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcscGFkZGluZ0xlZnQ6OCxwYWRkaW5nUmlnaHQ6OCB9fT5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJERUNMSU5FXCJcclxuICAgICAgICAgICAgb25DbGljaz17b25EZWNsaW5lfVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlY2xpbmUtYnRuXCJcclxuICAgICAgICAgICAgdGl0bGU9XCJEZWNsaW5lXCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luUmlnaHQ6IDQsIGNvbG9yOiAncmVkJyB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBERUNMSU5FXHJcbiAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJBQ0NFUFRcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkFjY2VwdH1cclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NlcHQtYnRuXCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luTGVmdDogNCwgY29sb3I6ICdncmVlbicgfX1cclxuICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgQUNDRVBUXHJcbiAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgIFRleHRJbnB1dCAgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgIC8vIHBvc2l0aW9uOidmaXhlZCcsXHJcbiAgICB3aWR0aDonMTAwJScsXHJcbiAgICAvLyBib3R0b206MTAsXHJcbiAgICAvLyByaWdodDoxMCxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICAvL21hcmdpbjowXHJcbiAgICBwYWRkaW5nOiA1LFxyXG4gICAgbWFyZ2luTGVmdDogOCxcclxuICAgIG1hcmdpblJpZ2h0OiA4LFxyXG4gICAgbWFyZ2luVG9wOiA4LFxyXG4gICAgbWFyZ2luQm90dG9tOiA4LFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgd2lkdGg6JzEwMCUnXHJcbiAgfSxcclxuICBidG46e1xyXG4gICAgcGFkZGluZzogOCxcclxuICAgIG1hcmdpbkxlZnQ6IDE2LFxyXG4gICAgbWFyZ2luUmlnaHQ6IDE2LFxyXG4gICAgbWFyZ2luVG9wOiA4LFxyXG4gICAgbWFyZ2luQm90dG9tOiA4LFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gIH1cclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBsb2FkaW5nLG1lc3NhZ2VUZXh0LCBvbk1lc3NhZ2VUZXh0LCBvbk1lc3NhZ2UsaGFuZ291dCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5yb290fT5cclxuICAgICA8ZGl2IHN0eWxlPXt7ZmxleDoxfX0+XHJcbiAgICAgPFRleHRJbnB1dCBzdHlsZT17c3R5bGVzLmlucHV0fSBkaXNhYmxlZD17aGFuZ291dCAmJmhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCd9ICB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSAgZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWlucHV0XCIgdmFsdWU9e21lc3NhZ2VUZXh0fS8+XHJcbiAgICAgPC9kaXY+XHJcbiAgIFxyXG4gICAgICBcclxuICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkxlZnQ6M319PlxyXG4gICAgICAgIDxCdXR0b24gbG9hZGluZz17bG9hZGluZ30gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgc3R5bGU9e3N0eWxlcy5idG59ICAgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJz5cclxuU0VOVFxyXG4gICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBmbG9hdDogJ3JpZ2h0JyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBmb250U2l6ZTogMTYsXHJcbiAgICB0ZXh0QWxpZ246ICdlbmQnXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlKHsgbWVzc2FnZSB9KSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlci1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH08L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgZmxvYXQ6ICdyaWdodCcsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgZm9udFNpemU6IDE2LFxyXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VkTWVzc2FnZSh7IG1lc3NhZ2Usb25OYXZpZ2F0aW9uIH0pIHtcclxuICAgIGZ1bmN0aW9uIGhhbmRsZU5hdmlnYXRpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgb25OYXZpZ2F0aW9uKGUpXHJcbiAgICB9XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VkLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fVxyXG4gICAgPGEgaWQ9XCJVTkJMT0NLXCIgZGF0YS10ZXN0aWQ9XCJzZWVtb3JlLWJ0blwiIGhyZWY9XCIvXCIgb25DbGljaz17aGFuZGxlTmF2aWdhdGlvbn0+c2VlIG1vcmU8L2E+XHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi9NZXNzYWdlRWRpdG9yJztcclxuaW1wb3J0IHsgQmxvY2tlck1lc3NhZ2UgfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlJ1xyXG5pbXBvcnQge0Jsb2NrZWRNZXNzYWdlfSBmcm9tICcuL0Jsb2NrZWRNZXNzYWdlJ1xyXG5pbXBvcnQge3VzZU1lZGlhUXVlcnl9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBtZXNzYWdlQ29udGFpbmVyOiB7XHJcbiAgICAvLyB3aWR0aDogJzEwMCUnLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gIC8vICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxyXG4gICAgZmxleDogMyxcclxuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxyXG4gICAgb3ZlcmZsb3dYOiBcImhpZGRlblwiXHJcblxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lc3NhZ2VzKHtcclxuICBtZXNzYWdlcyxcclxuICBvbk1lc3NhZ2UsXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvbixcclxuICBsb2FkaW5nXHJcbn0pIHtcclxuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcclxuY29uc3Qge2RldmljZX09dXNlTWVkaWFRdWVyeSgpXHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobWVzc2FnZXMpIHtcclxuICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuICB9LCBbbWVzc2FnZXNdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25TZW5kKGUpIHtcclxuICAgIG9uTWVzc2FnZShlKTtcclxuICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGJveFNpemluZzogJ2JvcmRlci1ib3gnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJ319PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7Li4uc3R5bGVzLm1lc3NhZ2VDb250YWluZXIsZmxleDogZGV2aWNlPT09J3Bob25lJz80OjJ9fSByZWY9e3Njcm9sbGVyUmVmfT5cclxuICAgICAgICB7bWVzc2FnZXMgJiYgIFxyXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzOiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSwgdXNlcm5hbWUgfSkubWFwKFxyXG4gICAgICAgICAgICAobSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxyXG4gICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgIHshbS50eXBlICYmIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VyJyAmJiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZWQnICYmIDxCbG9ja2VkTWVzc2FnZSBtZXNzYWdlPXttfSBvbk5hdmlnYXRpb249e29uTmF2aWdhdGlvbn0vPn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjF9fT5cclxuICAgICAgICA8TWVzc2FnZUVkaXRvclxyXG4gICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICAgIG9uTWVzc2FnZT17b25TZW5kfVxyXG4gICAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xyXG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcclxuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5zb3J0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0ICBNZXNzYWdlcyAgZnJvbSAnLi9tZXNzYWdlcyc7XHJcbmltcG9ydCBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XHJcbiAgbG9hZGluZyxcclxuICBtZXNzYWdlcyA9IFtdLFxyXG4gIG9uTWVzc2FnZVRleHQsXHJcbiAgb25NZXNzYWdlLFxyXG4gIG1lc3NhZ2VUZXh0LFxyXG4gIHVzZXJuYW1lLFxyXG4gIGhhbmdvdXQsXHJcbiAgb25OYXZpZ2F0aW9uLFxyXG5cclxufSkge1xyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGRvY3VtZW50LnRpdGxlPWhhbmdvdXQudXNlcm5hbWVcclxuXHJcbiAgfSxbXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cclxuICAgICAgPE1lc3NhZ2VzXHJcbiAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgIG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufVxyXG4gICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxyXG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxyXG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgbWVzc2FnZVRleHQgPXttZXNzYWdlVGV4dH1cclxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgIC8+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICB3aWR0aDogMTUsXHJcbiAgaGVpZ2h0OiAxNSxcclxuXHJcbiAgYm9yZGVyOiAnd2hpdGUgMnB4IHNvbGlkJyxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xyXG4gIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XHJcbiAgICByZXR1cm4gPElzT25saW5lIC8+O1xyXG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xyXG4gICAgcmV0dXJuIDxDb25uZWN0aW5nIC8+O1xyXG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMikge1xyXG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xyXG4gIH1cclxuICByZXR1cm4gPElzT2ZmbGluZSAvPjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT25saW5lKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBJc09mZmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3JlZCcgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcclxuICAgID48L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ29ubmVjdGluZygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDbG9zaW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdwaW5rJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBtZXNzYWdlSWNvbiBmcm9tICcuL21lc3NhZ2UucG5nJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgY291bnQ6IHtcclxuICAgIHdpZHRoOiAzMCxcclxuICAgIGhlaWdodDogMzAsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicsXHJcbiAgICBjb2xvcjogJ3doaXRlJyxcclxuICAgIHRleHRBbGlnbjonY2VudGVyJyxcclxuICAgIGJvcmRlclJhZGl1czoxNSxcclxuICAgIGRpc3BsYXk6J2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczonY2VudGVyJyxcclxuICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UoeyBjb3VudD0wIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XHJcbiAgICAgICAgICA8ZGl2Pm1lc3NhZ2U6PC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmNvdW50fSBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtY291bnRcIj57Y291bnR9PC9kaXY+IFxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICdpY29ucy9NZXNzYWdlJ1xyXG5leHBvcnQgZnVuY3Rpb24gSWNvbnNEZW1vKCl7XHJcbiAgICByZXR1cm4gPGRpdj5cclxuXHJcbiAgICAgICAgPE1lc3NhZ2UgY291bnQ9ezF9Lz5cclxuICAgIDwvZGl2PlxyXG59IiwiZXhwb3J0IGNvbnN0IG1lc3NhZ2VzID1bXHJcbiAgICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxyXG4gIH0sXHJcbiAgIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBPayBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMjE2MzQ2MixcclxuICB9LHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgSG93IGFyZSB5b3UgZGVtb2AsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgYWxsIHJpZ2h0YCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzY3NzU3MyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ2LFxyXG4gIH0sXHJcbiAgLFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonZGVtbycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDgsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG5dIiwiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KXtcclxuICAgIHJldHVybiB1bnJlYWRoYW5nb3V0cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIChhY2N1bXVsYXRvciA9IFt7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9XSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IG9iaiA9IGFjY3VtdWxhdG9yLmZpbmQoXHJcbiAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lICYmIGN1cnJlbnQuc3RhdGUgPT09ICdNRVNTQU5HRVInXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGFjY3VtdWxhdG9yLmZpbmRJbmRleChcclxuICAgICAgICAgICAgICAoYSkgPT4gYS51c2VybmFtZSA9PT0gY3VycmVudC51c2VybmFtZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5zcGxpY2UoaW5kZXgsIDEsIHtcclxuICAgICAgICAgICAgICAuLi5vYmosXHJcbiAgICAgICAgICAgICAgbWVzc2FnZUNvdW50OiArK29iai5tZXNzYWdlQ291bnQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcclxuICAgICAgICAgICAgYWNjdW11bGF0b3IucHVzaCh7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xyXG4gICAgICB9LCBbXSk7XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBMaXN0LHsgTGlzdEl0ZW0gfSBmcm9tICdjb250cm9scy9saXN0JztcclxuaW1wb3J0IHtyZWR1Y2VyVW5yZWFkaGFuZ291dHN9IGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVbnJlYWRIYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzLG9uU2VsZWN0VW5yZWFkLG9uUmVtb3ZlVW5yZWFkIH0pIHtcclxuXHJcbiAgY29uc3QgW2l0ZW1zLHNldEl0ZW1zXSA9dXNlU3RhdGUoW10pXHJcbnVzZUVmZmVjdCgoKT0+e1xyXG5pZih1bnJlYWRoYW5nb3V0cyl7XHJcblxyXG4gIGNvbnN0IHJlZHVjZWQgPXJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KVxyXG4gXHJcbiAgc2V0SXRlbXMocmVkdWNlZClcclxufVxyXG5cclxufSxbdW5yZWFkaGFuZ291dHNdKVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBkYXRhLXRlc3RpZD0ndW5yZWFkaGFuZ291dHMnIHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICB7aXRlbXMgJiZcclxuICAgICAgICAgIGl0ZW1zLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGl0ZW1zLm1hcCgodSkgPT4ge1xyXG4gICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4J319PlxyXG4gICAgICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17b25TZWxlY3RVbnJlYWR9IGlkPXt1LnVzZXJuYW1lfSBzdHlsZT17e2ZsZXg6NX19IGRhdGEtdGVzdGlkPXtgJHt1LnVzZXJuYW1lfS1zZWxlY3RgfT57dS51c2VybmFtZX0gbWVzc2FnZXM6IHt1Lm1lc3NhZ2VDb3VudH08L0xpc3RJdGVtPlxyXG4gICAgICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17b25SZW1vdmVVbnJlYWR9IGlkPXt1LnVzZXJuYW1lfSBzdHlsZT17e2NvbG9yOidyZWQnfX0gZGF0YS10ZXN0aWQ9e2Ake3UudXNlcm5hbWV9LXJlbW92ZWB9Png8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIH0pfVxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVW5yZWFkIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvVW5yZWFkSGFuZ291dHMnO1xyXG5pbXBvcnQge3JlZHVjZXJVbnJlYWRoYW5nb3V0c30gZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMnXHJcbmNvbnN0IHVucmVhZHMgPSBbXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcblxyXG4gIHtcclxuICAgIHVzZXJuYW1lOiAnZGVtbycsXHJcbiAgICBzdGF0ZTogJ01FU1NBTkdFUicsXHJcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOiAnYmVybycsXHJcbiAgICBzdGF0ZTogJ01FU1NBTkdFUicsXHJcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcclxuICB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFVucmVhZERlbW8oKSB7XHJcbiAgcmV0dXJuIDxVbnJlYWQgdW5yZWFkaGFuZ291dHM9e3JlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHM6dW5yZWFkc30pfSAvPjtcclxufVxyXG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHtCbG9ja2VyTWVzc2FnZX0gZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9CbG9ja2VyTWVzc2FnZSdcclxuXHJcbmNvbnN0IG1lc3NhZ2UgPXt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIGJsb2NrZWQnLFxyXG50aW1lc3RhbXA6MTIzMjMsXHJcbnVzZXJuYW1lOidkZW1vJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VyTWVzc2FnZURlbW8oKXtcclxuICAgIHJldHVybiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0vPlxyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFsZXJ0IChwcm9wcyl7XHJcbmNvbnN0IHthbGVydCxtZXNzYWdlfT1wcm9wc1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgYWxlcnQgYWxlcnQtJHthbGVydH1gfSByb2xlPVwiYWxlcnRcIiBkYXRhLXRlc3RpZD1cImFsZXJ0XCI+XHJcbiAgICB7bWVzc2FnZX1cclxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxyXG4gICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuaW1wb3J0IEFsZXJ0IGZyb20gJ2NvbnRyb2xzL2FsZXJ0J1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbihwcm9wcykge1xyXG4gIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCwgbG9hZGluZywgb25Mb2dpbiwgb25Gb2N1cywgb25DaGFuZ2UsIHZhbGlkYXRpb24sIG9uRm9yZ290UGFzc3dvcmQsIG9uQmx1ciwgZXJyb3IgfSA9IHByb3BzO1xyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cclxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbCBvciB1c2VybmFtZVwiXHJcbiAgICAgICAgbmFtZT0nZW1haWxvcnVzZXJuYW1lJ1xyXG4gICAgICAgIHR5cGU9J3RleHQnXHJcbiAgICAgXHJcbiAgICAgICAgaWQ9J2VtYWlsb3J1c2VybmFtZSdcclxuICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWxvcnVzZXJuYW1lJ1xyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnZW1haWxvcnVzZXJuYW1lJ10ubWVzc2FnZX1cclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2VtYWlsb3J1c2VybmFtZSddLmlzVmFsaWR9XHJcblxyXG4gICAgICAvPlxyXG5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgbGFiZWw9XCJQYXNzd29yZFwiXHJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICBuYW1lPSdwYXNzd29yZCdcclxuICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICBcclxuICAgICAgICBpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5pc1ZhbGlkfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XHJcblxyXG5cclxuICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgICAgICBpZD0nbG9naW4tYnRuJ1xyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9J2xvZ2luLWJ0bidcclxuICAgICAgICAgIG9uQ2xpY2s9e29uTG9naW59XHJcbiAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgdGl0bGU9XCJMb2dpblwiXHJcbiAgICAgICAgICBiZz1cInByaW1hcnlcIlxyXG4gICAgICAgIC8+XHJcblxyXG4gICAgICAgIDxCdXR0b24gb25DbGljaz17b25Gb3Jnb3RQYXNzd29yZH0gaWQ9J2ZvcmdvdHBhc3N3b3JkJyBkYXRhLXRlc3RpZD0nZm9yZ290cGFzc3dvcmQnIG91dGxpbmUgYmc9XCJwcmltYXJ5XCIgdGl0bGU9XCJGb3Jnb3QgUGFzc3dvcmQhXCIgLz5cclxuXHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBMb2dpbiBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luJ1xyXG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHsgZW1haWxvcnVzZXJuYW1lOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiAnLicgfSB9XHJcbmNvbnN0IHZhbGlkYXRpb25FcnJvciA9IHsgZW1haWxvcnVzZXJuYW1lOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnaW52YWxpZCBjcmVkZW50aWFscycgfSwgcGFzc3dvcmQ6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdpbnZhbGlkIGNyZWRlbnRpYWxzJyB9IH1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9naW5TdGF0ZXMoKSB7XHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+IExvZ2luIFZhbGlkYXRpb24gU3VjY2VzczwvaDU+XHJcblxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IC8+XHJcblxyXG5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+TG9naW4gVmFsaWRhdGlvbiBFcnJvcjwvaDU+XHJcblxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfSAvPlxyXG5cclxuXHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkxvZ2dpbmcgaW48L2g1PlxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IGxvYWRpbmcgLz5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+TG9nZ2luZyBTZXJ2ZXIgZXJyb3I8L2g1PlxyXG4gICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9ICBlcnJvcj17e21lc3NhZ2U6J1NlcnZlciBpcyB1bmF2YWlsYWJsZSd9fS8+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0J1xyXG5pbXBvcnQgQWxlcnQgZnJvbSAnY29udHJvbHMvYWxlcnQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cChwcm9wcykge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCwgbG9hZGluZywgb25TaWdudXAsIG9uQ2hhbmdlLCB2YWxpZGF0aW9uLCBvbkJsdXIsIG9uRm9jdXMsIGVycm9yIH0gPSBwcm9wcztcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNCBib3JkZXIgbXgtYXV0byByb3VuZGVkXCIgc3R5bGU9e3sgbWFyZ2luOiAxNSwgcGFkZGluZzogMTYgfX0+XHJcbiAgICAgIHtsb2FkaW5nICYmIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIiBzdHlsZT1cImhlaWdodDogNXB4O1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIHByb2dyZXNzLWJhci1hbmltYXRlZFwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIxMDBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIiBzdHlsZT1cIndpZHRoOiAxMDAlXCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2Pn1cclxuICAgICAge2Vycm9yICYmIDxBbGVydCBhbGVydD1cImRhbmdlclwiIG1lc3NhZ2U9e2Vycm9yLm1lc3NhZ2V9IC8+fVxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cclxuICAgICAgICBsYWJlbD1cIlVzZXJuYW1lXCJcclxuICAgICAgICB2YWx1ZT17dXNlcm5hbWV9XHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIHR5cGU9J3RleHQnXHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J3VzZXJuYW1lJ1xyXG4gICAgICAgIG5hbWU9J3VzZXJuYW1lJ1xyXG4gIFxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsndXNlcm5hbWUnXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsndXNlcm5hbWUnXS5tZXNzYWdlfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIG9uQmx1cj17b25CbHVyfVxyXG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIHZhbHVlPXtlbWFpbH1cclxuICAgICBcclxuICAgICAgICB0eXBlPSdlbWFpbCdcclxuICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWwnXHJcbiAgICAgICAgbmFtZT0nZW1haWwnXHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvPlxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XHJcbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cclxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgIFxyXG4gICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIGRhdGEtdGVzdGlkPSdwYXNzd29yZCdcclxuICAgICAgICBuYW1lPSdwYXNzd29yZCdcclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10uaXNWYWxpZH1cclxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10ubWVzc2FnZX1cclxuXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uU2lnbnVwfVxyXG4gICAgICAgIGlkPSdzaWdudXAtYnRuJ1xyXG4gICAgICAgIGRhdGEtdGVzdGlkPVwic2lnbnVwLWJ0blwiXHJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICB0aXRsZT1cIlNpZ251cFwiXHJcbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcclxuICAgICAgLz5cclxuXHJcblxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IFNpZ251cCBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL3NpZ251cCdcclxuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPSB7IHVzZXJuYW1lOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiAnLicgfSwgZW1haWw6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0gfVxyXG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB7IHVzZXJuYW1lOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnVXNlcm5hbWUgaXMgbm90IHZhbGlkJyB9LCBwYXNzd29yZDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ1Bhc3dvcmQgaXMgbm90IHZhbGlkJyB9LCBlbWFpbDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ0VtYWlsIGlzIG5vdCB2YWxpZCcgfSB9XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cFN0YXRlcygpIHtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlNpZ251cCBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxyXG4gICAgICAgICAgICAgICAgPFNpZ251cCB1c2VybmFtZT1cInRlc3R1c2VyXCIgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWdudXAgVmFsaWRhdGlvbiBFcnJvcjwvaDU+XHJcbiAgICAgICAgICAgICAgICA8U2lnbnVwIHVzZXJuYW1lPVwidGVzdHVzZXJcIiBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uRXJyb3J9IC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2lnbmluZyB1cDwvaDU+XHJcbiAgICAgICAgICAgICAgICA8U2lnbnVwIHVzZXJuYW1lPVwidGVzdHVzZXJcIiBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31sb2FkaW5nIC8+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWduaW5nIFNldmVyIGVycm9yPC9oNT5cclxuICAgICAgICAgICAgICAgIDxTaWdudXAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSBlcnJvcj17e21lc3NhZ2U6J1NlcnZlciBpcyB1bmF2YWlsYWJsZSd9fSAvPlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkKHByb3BzKSB7XHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgdmFsaWRhdGlvbiwgb25DaGFuZ2UsIG9uUGFzc3dvcmRDaGFuZ2UsIGxvYWRpbmcsZXJyb3IgfSA9IHByb3BzO1xyXG5cclxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIC8vICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gIC8vICAgdmFyIHVybHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XHJcblxyXG4gIC8vICAgaWYgKHVybHRva2VuKSB7XHJcbiAgLy8gICAgIGRpc3BhdGNoKGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW46IHVybHRva2VuIH0pKTtcclxuICAvLyAgIH1cclxuICAvLyB9LCBbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIiBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fT5cclxuICAgICAge2xvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjEwMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+fVxyXG4gICAgICB7ZXJyb3IgJiYgPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT17ZXJyb3IubWVzc2FnZX0gLz59XHJcbiAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIGxhYmVsPVwiQ29uZmlybVwiXHJcbiAgICAgICAgdmFsdWU9e2NvbmZpcm19XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J2NvbmZpcm0nXHJcbiAgICAgICAgbmFtZT0nY29uZmlybSdcclxuICAgICAgIFxyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2NvbmZpcm0nXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnY29uZmlybSddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvPlxyXG4gICAgICA8QnV0dG9uXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J2NoYW5nZS1wYXNzLWJ0bidcclxuICAgICAgICBvbkNsaWNrPXtvblBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgIHRpdGxlPVwiQ2hhbmdlXCIgYmc9XCJwcmltYXJ5XCIgLz5cclxuICAgIDwvZGl2PlxyXG5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkJ1xyXG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHsgcGFzc3dvcmQ6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0sIGNvbmZpcm06IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0gfVxyXG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPSB7IHBhc3N3b3JkOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnaW52YWxpZCBwYXNzd29yZCBmb3JtYXQnIH0sIGNvbmZpcm06IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdpbnZhbGlkIHBhc3N3b3JkIGZvcm1hdCcgfSB9XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkU3RhdGVzKCkge1xyXG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPiBDaGFuZ2VQYXNzd29yZCBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxyXG5cclxuICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIiBjb25maXJtPVwiMTIzNDU2Nzg5XCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9ICAvPlxyXG5cclxuXHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkNoYW5nZVBhc3N3b3JkIFZhbGlkYXRpb24gRXJyb3I8L2g1PlxyXG5cclxuICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfSAgLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5DaGFuZ2VQYXNzd29yZCBpbiBwcm9ncmVzczwvaDU+XHJcblxyXG4gICAgICAgIDxDaGFuZ2VQYXNzd29yZCBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiIGNvbmZpcm09XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gbG9hZGluZyAvPlxyXG5cclxuXHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkNoYW5nZVBhc3N3b3JkIFNlcnZlciBlcnJvcjwvaDU+XHJcbiAgICAgICAgPENoYW5nZVBhc3N3b3JkIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgY29uZmlybT1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSBlcnJvcj17eyBtZXNzYWdlOiAnU2VydmVyIGlzIHVuYXZhaWxhYmxlJyB9fSAvPlxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVxdWVzdFBhc3NDaGFuZ2UocHJvcHMpIHtcclxuICBjb25zdCB7IGVtYWlsLCB2YWxpZGF0aW9uLCBvblJlcXVlc3RQYXNzd29yZENoYW5nZSwgbG9hZGluZywgb25DaGFuZ2UsZXJyb3IgfSA9IHByb3BzXHJcblxyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfS8+fVxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXHJcbiAgICAgICAgdmFsdWU9e2VtYWlsfVxyXG4gICAgIFxyXG4gICAgICAgIG5hbWU9J2VtYWlsJ1xyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICB0eXBlPSdlbWFpbCdcclxuICAgICAgICBpZD0nZW1haWwnXHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcblxyXG4gICAgXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicmVxdWVzdHBhc3NjaGFuZ2UtYnRuXCJcclxuICAgICAgICB0aXRsZT1cIlJlcXVlc3QgcGFzc3dvcmQgY2hhbmdlXCJcclxuICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgIGJnPVwicHJpbWFyeVwiXHJcblxyXG4gICAgICAvPlxyXG5cclxuXHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgRm9yZ290UGFzc3dvcmQgZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9Gb3Jnb3RQYXNzd29yZCdcclxuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPSB7IGVtYWlsOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9IH1cclxuY29uc3QgdmFsaWRhdGlvbkVycm9yID0geyBlbWFpbDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ0ludmFsaWQgZW1haWwgZm9ybWF0JyB9IH1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9yZm90UGFzc3dvcmRTdGF0ZSgpIHtcclxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj4gRm9yZ290UGFzc3dvcmQgVmFsaWRhdGlvbiBTdWNjZXNzPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5Gb3Jnb3RQYXNzd29yZCBWYWxpZGF0aW9uIEVycm9yPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdGdtYWlsLmNvbVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25FcnJvcn0gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5SZXF1ZXN0IFBhc3N3b3JkIENoYW5nZSBpbiBwcm9ncmVzczwvaDU+XHJcblxyXG4gICAgICAgIDxGb3Jnb3RQYXNzd29yZCBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IGxvYWRpbmcgLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2VydmVyIGVycm9yPC9oNT5cclxuXHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gZXJyb3I9e3ttZXNzYWdlOidTZXJ2ZXIgaXMgdW5hdmFpbGFibGUnfX0gLz5cclxuXHJcblxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgTG9naW5TdGF0ZXMgZnJvbSAnLi9zdGF0ZXMvbG9naW4uc3RhdGVzJ1xyXG5pbXBvcnQgU2lnblVwU3RhdGVzIGZyb20gJy4vc3RhdGVzL3NpZ251cC5zdGF0ZXMnXHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZFN0YXRlcyBmcm9tICcuL3N0YXRlcy9jaGFuZ2UtcGFzc3dvcmQuc3RhdGVzJ1xyXG5pbXBvcnQgRm9yZ290UGFzc3dvcmRTdGF0ZXMgZnJvbSAnLi9zdGF0ZXMvZm9yZ290LXBhc3N3b3JkLnN0YXRlcydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aERlbW9Sb3V0ZXMoKSB7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9sb2dpblwiPlxyXG4gICAgICAgICAgICA8TG9naW5TdGF0ZXMgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9zaWdudXBcIj5cclxuICAgICAgICAgICAgPFNpZ25VcFN0YXRlcyAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2NoYW5nZS1wYXNzd29yZFwiPlxyXG4gICAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmRTdGF0ZXMgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9mb3Jnb3QtcGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgPEZvcmdvdFBhc3N3b3JkU3RhdGVzIC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgIF1cclxufSIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uRGVtbyAoKXtcclxuXHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZSA9e3tkaXNwbGF5OidmbGV4JywgZmxleERpcmVjdGlvbjonY29sdW1uJyx3aWR0aDonMTAwJScsIGFsaWduSXRlbXM6J2NlbnRlcicsYmFja2dyb3VuZENvbG9yOid5ZWxsb3cnfX0+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICA8aDM+RmlsbGVkIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCI+UHJpbWFyeTwvQnV0dG9uPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIj5TZWNvbmRhcnk8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwic3VjY2Vzc1wiPlN1Y2Nlc3M8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFuZ2VyXCI+RGFuZ2VyPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIj5XYXJuaW5nPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImluZm9cIj5JbmZvPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImxpZ2h0XCI+TGlnaHQ8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiPkRhcms8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwibGlua1wiPkxpbms8L0J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ID5cclxuICAgICAgICAgICAgPGgzPk91dGxpbmVkIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgb3V0bGluZT17dHJ1ZX0gdGl0bGU9XCJQcmltYXJ5XCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiBvdXRsaW5lIHRpdGxlPVwiU2Vjb25kYXJ5XCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzdWNjZXNzXCIgb3V0bGluZSB0aXRsZT1cIlN1Y2Nlc3NcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImRhbmdlclwiIG91dGxpbmUgdGl0bGU9XCJEYW5nZXJcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIiBvdXRsaW5lIHRpdGxlPVwiV2FybmluZ1wiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiaW5mb1wiIG91dGxpbmUgdGl0bGU9XCJJbmZvXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJsaWdodFwiIG91dGxpbmUgdGl0bGU9XCJMaWdodFwiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiIG91dGxpbmUgdGl0bGU9XCJEYXJrXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJsaW5rXCIgb3V0bGluZSB0aXRsZT1cIkxpbmtcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnfX0+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICA8aDM+U21hbGwgQnV0dG9uczwvaDM+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcInNpemU9XCJzbVwiIHRpdGxlPVwibGlua1wiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwic2Vjb25kYXJ5XCIgc2l6ZT1cInNtXCIgdGl0bGU9XCJTZWNvbmRhcnlcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGgzPkxhcmdlIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCJzaXplPVwibGdcIiB0aXRsZT1cIkxpbmtcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInNlY29uZGFyeVwiIHNpemU9XCJsZ1wiIHRpdGxlPVwiU2Vjb25kYXJ5XCIvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICBcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgIDxoMz4gRGlzYWJsZWQgQnV0dG9uczwvaDM+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiBkaXNhYmxlZCAgdGl0bGU9XCJMaW5rXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiAgZGlzYWJsZWQgdGl0bGU9XCJTZWNvbmRhcnlcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgPGgzPiBTcGlubmluZyBCdXR0b248L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgdGl0bGU9XCJTcGlubmluZ1wiIGxvYWRpbmcvPlxyXG4gICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0U3RhdGVzKCkge1xyXG4gICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGg1PlZhbGlkYXRpb248L2g1PlxyXG4gICAgICAgIDxUZXh0SW5wdXQgaXNWYWxpZD17dHJ1ZX0gLz5cclxuICAgICAgICA8VGV4dElucHV0IGlzVmFsaWQ9e2ZhbHNlfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgXHJcbiAgICA8L2Rpdj5cclxufSIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUNBQ0FRQUFBQnBONmxBQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQW1KTFIwUUFBS3FOSXpJQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFIZEVsTlJRZmtCQnNJS2lQd2htbUlBQUFIcVVsRVFWUjQydDJkYVd4VVZSVEhmMzB0cFZSR3dMSVdLQVVxWVJXSUFaV3FSS2kyV0JBd0VzSW5vM3d3dU1lRVNKQVBpTW9TQzlnUVNQZ0NvVjhnR21TTExDSkUyYkdBVWxZcCsxS1dVcmFoZ0ZDbWZwZ01NMjFuZSsvZGMrL1VjejRRT3UrZTgvK2Y5K2JPdmVlZWUxOFN1aVNKcnZTbUs5bGswWVlNTWtnamxhZUFhaDd5Z0NxcXVNWUZ6bkthWTV5aFZoY3NhZWxJTHJrTW9pOGVHNjI4SEtLVW5leWtRazhnMUVzYUJSVHpEN1V1OVRqenlhZXBhVHAycEFtRmxIRExOZlZRdmNVeUNtbGltbHBzeVdFNjU1VlNEOVVyRk5QSE5NWEk4akxyOEltUkQrb09SbW5vdTJ4SkVtTTRvSUY2VVBjek9uR0NVTUErcmVRRFdrcSthZXJRZzNWR3lBZDBNMzNOa1UrbmlJZEc2ZGRTeTBQbTBNd0UvVHhPR1NjZjBIS0c2U1dmeG13ZUc2Y2RxajRXazY2TGZqOE9HeWNjVHN2MGpCRW1jTmM0MVVoNmozZGx5U2N6enpqSldGcUVKVVUvbFJYRzZjV2pQNU1tUWI4NW00eFRpMWUzOHJScSt1M1liNXlXSGQxSFc1WDBzeWszVHNtdW5pQmJGZjAySERkT3g0bWVwTDBLK3A1Rzl2Q0g2a0ZhdXFXZjJvaTZ2bkM2MVYweXplSkg0eFRjNmlxU28xR00raUZ6bWFqaVcyUlVlcExHYjg2YVRqQis5OVNvajlGTzZQZWoyamgwVlhxZHpuYnBwM0hRT0d5VnVpZFNTajFTSHpDZlVVcStnWWtpblVpMTB4UGthVWx2NjFVZlE4TlJEWmRhVHFlTTdxWnZtWUFjWlFDUDZ2OHgzRmRnRm9WYUFGV3hqLzBjb3hLUGxyUm1HN3pzaW4xWkx4NkpQNDdYbUZFdm5kMlBiNmtVOSt1bFUrd0FiQkFHY1ordkk2UXYwL21HQjhMZWY0cEZ2MEFZd0NrR1J2WC9QS2VGRVF5UDVqNUplSkhyTDlyRmZBTGJVeWFLWVZzMDUyT0Y3MzVzK2dDdE9TR0s0NVhJcmlWWGVQK2xYMXowQWZwd1R4REpwa2h1aDR2R2ZWcmM5QUUrRWNVeUtMelQ5WUl1RDVCaUt3REpvbm1vMWVGY1BpczYvTFUvczVEc2ozemhScnB6QkIyV08xaXRTUlpkZmY2dXZyc21WQWk2KzlRMmZZQXZCQkZkcmo4OUhpbjZ3RGxicE9nZ2lLbVdBcitUd0tNNTNoSEUrT1FZMXh5MXU4d0pRVlRqUXdQUVZEVDk4WWZqbHI4TG9ocERhakFBcjlGQzBOVU9BeTFqUzB0L2dzUWZnQkdDanFEY2NjdVRvcmp5Z3dFb0VIVjB5WEhMaTZLNFJnUUMwSkVlb283dUdtZ1pqL1NtZ3o4QXVhSnU0TEhqbG84Y3Q0eFBodWdKZ1BOcWpaYkN5SEw5QVJqazJwQVVEY25mSm9EQllKRWtYbTJiNmJobFIyRmtmVW15Nkc1ckw0OFQ2ZSs0NVFCaFpDM0lzdWdwN01RTmplZkVzZlcyNkNidVpKakRyUTJXaGhMb2JJc3U0azQ2OG9LamRpL1JRUnhiVjRzc2NTZE81NXFTTTlTQWRMSFVGaFJHa0ltMHN0Mm1GZTlwUU5iRzRoa05iang4YUx2TlJ6VFhnQ3dEMFZSWVVPL1lMRkxwZ2xjTHJvdVdwdjAySGhiWnVuNlJsdnNQNllpdXdkVFZ5WEhEbXFvTlV6WFVhSFAybUhmaW9qOU80MzZrR3AwQnFLVW1qczd3ZmExYjhXclFYZzI0SU1yY3c4TkN6V2lxNGFabWw3VmNpREQvekJUY2R4NUpiMWpjMDlMYmhrb25mMEs2Z1hqRnA3OE5wZHJpaG5hbk5SeU5FSUJUMnJGVVdWelg3TEtXejNrUTRiTmlOQjJkWWk0QUZZeGtZY1JQRnpLR0sxcnhYTGM0cjgyWmx6bjBaSDNVYTlhU3d4UnVhc04wRmo3VzA5c3l3OGFNc0NVek5QMDZUWkpkR1BmclpTWTd5RHMrelJTdWlHTXJnRzZpRHJ4TWM3R3R2UmxmQ2M4S3N5Q0oyMExHSDFPaUlLbVZ5V0t4dWNFdGY3WnlwNGp4Y2w1MFRUNGdRNFFLYUxmN1Y0WktsUUVOeWtvR3NrZVp0VjBNWkkwQXlqLzkvNHhUSHRsNUFudjRrd1VtU20vN1RXY3FObXN2OTJOSEZpaEcrbVJ2c2NyTjBhdmtUbkFnbVY4VUlqMGNOUHlETXFOWGhkUHNyUldPRGI0UG1zMVhablNzS0gxUTJXUGxCWTAyVlhUNjN6NHRCNXlWS3NGNnMyNVdZcGtTbzI5cW9LK3FqSHBKWGFPRkNreGUxSFRBbmFWa01lZU51a1pURkJndDFrSWZZSkZyckUrS3BRTS9XVFdVdUlZbE1WWUxMNnRkVzFqU3NBSXR4K1dHQ1o5NFNWTlFXcm04Lzc3d1pTSHVCaG1udGRFSE9PY0s2OXFnb2RCUjIxeFhrQTY3YXEzWFcxSDRBR3psZ0F1amxWb0RjTlZGMjcyaG15ZnJqdHRudURCN1cyc0E3cmhvVzRkbDNRQ3NDY3lRTlVQUzZhMlVEYUgvclQ5MHlXZWpROE9YdEdiMDJ6dGVSaHZPMXVnWHFKeHdKcDZ1cUUrMzRlQTFoeU1SRmk4YnYzanBWWC83UnNNak5HN2dFUytnTnlWVCtiWCtuOEpOWDVwUlJvNXByQUp5aElFTkI4RGgwbGYzK1FEZHE3VHk0bU5TdUIwbzRROVNPa01yaFZuOXhKQlpMTFZ6ZVZQK050NWpxOVRkOXQ5TzBTZUJEMUMycTVYeEhKL1RVTWIrVHc3VTh2R1cwKzlOa1hId0tuU204NDdEYWlSblNVZlQ1ZTRXYXBxdzBUZ0ZON3JGL1J1S1BJYmVJS0pDUzlYVW5MZHV0QWNyeDNkd1V4eVNMWHkyazRTZVVMc2RMSVBkeGluWjBWTDFpN1RORzFGM3VFWDk4Zm9BcVN3M1RpMGVYU256Z2dVQWl6a0pQanIwTVZPd1FBT0FQQTNsaTA2MVVzLzZkQ2UyRzZjYVR2ZXFlNlZDTEVsaGVzSzlhS2xZOStzWWh5YlE2NWJLb3AwU0tma2NmTVlkNCtTcm1XNHlpNTFKaVZINjY3VHNmbzhodzlsbWhQeHUzZStZaXlhdmFoNG43dFZVa0dWTCtsT2lZUitxajgySmZQUi9aNzUwV2IwUlRTdVkzUmpPdlUraGdLV0s5L3pjWUFuNU5rK21OU3lwdk01Y2pyaW1mcGdpOHVSKzZPUkxHOXVUU3k2RDZXdXJpdXcyaHlobEJ6dGRGY01rUkFDQ2trMHZ1cEpORm0zSklJTjBVdkFBWG1xNFJ4VlZYT1VDWnpqRE1jN3BBdlVmaDJ3Q013bGlKM0FBQUFBbGRFVllkR1JoZEdVNlkzSmxZWFJsQURJd01qQXRNRFF0TWpkVU1EZzZOREk2TXpVck1EQTZNREQrcVZzMEFBQUFKWFJGV0hSa1lYUmxPbTF2WkdsbWVRQXlNREl3TFRBMExUSTNWREE0T2pReU9qTTFLekF3T2pBd2ovVGppQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB1c2VySW1hZ2UgZnJvbSAnLi91c2VyLnBuZydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVG9hc3QgKCl7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJ0b2FzdFwiIHJvbGU9XCJhbGVydFwiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2FzdC1oZWFkZXJcIj5cclxuICAgICAgPGltZyBzcmM9e3VzZXJJbWFnZX0gY2xhc3NOYW1lPVwicm91bmRlZCBtci0yXCIgYWx0PVwiLi4uXCIvPlxyXG4gICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cIm1yLWF1dG9cIj5Cb290c3RyYXA8L3N0cm9uZz5cclxuICAgICAgPHNtYWxsIGNsYXNzTmFtZT1cInRleHQtbXV0ZWRcIj5qdXN0IG5vdzwvc21hbGw+XHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm1sLTIgbWItMSBjbG9zZVwiIGRhdGEtZGlzbWlzcz1cInRvYXN0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XHJcbiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9hc3QtYm9keVwiPlxyXG4gICAgICBTZWU/IEp1c3QgbGlrZSB0aGlzLlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBUb2FzdCBmcm9tICdjb250cm9scy90b2FzdCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVG9hc3REZW1vKCl7XHJcblxyXG4gICAgcmV0dXJuIDxUb2FzdC8+XHJcbn0gIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnREZW1vICgpe1xyXG4gICAgcmV0dXJuPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT1cIlNlcnZlciBpcyB0ZW1wb3JhcmlseSB1bmF2YWlsYWJsZVwiLz5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJ1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJy4vdGV4dC1pbnB1dCdcclxuaW1wb3J0IFRvYXN0RGVtbyBmcm9tICcuL3RvYXN0J1xyXG5pbXBvcnQgQWxlcnREZW1vIGZyb20gJy4vYWxlcnQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbXBvbmVudHNSb3V0ZSgpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYnV0dG9uXCI+XHJcbiAgICAgICAgICAgIDxCdXR0b24gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi90ZXh0LWlucHV0XCI+XHJcbiAgICAgICAgICAgIDxUZXh0SW5wdXQgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi90b2FzdFwiPlxyXG4gICAgICAgICAgICA8VG9hc3REZW1vIC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYWxlcnRcIj5cclxuICAgICAgICAgICAgPEFsZXJ0RGVtbyAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICBdXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyBBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IEhhbmdvdXQgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9IYW5nb3V0JztcclxuaW1wb3J0IEJsb2NrIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2snO1xyXG5pbXBvcnQgQmxvY2tlZCBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrZWQnO1xyXG5pbXBvcnQgQ29uZmlndXJlIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQ29uZmlndXJlJztcclxuaW1wb3J0IEludml0ZSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZSc7XHJcbmltcG9ydCBJbnZpdGVlIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlZSc7XHJcbmltcG9ydCBJbnZpdGVyIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlcic7XHJcbmltcG9ydCBIYW5nY2hhdCBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdjaGF0JztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvTWVzc2FnZSc7XHJcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJ2ljb25zL29ubGluZVN0YXR1cyc7XHJcbmltcG9ydCB7IEljb25zRGVtbyB9IGZyb20gJy4vSWNvbnNEZW1vJ1xyXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcclxuaW1wb3J0IHsgVW5yZWFkRGVtbyB9IGZyb20gJy4vVXJlYWREZW1vJ1xyXG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZURlbW8gfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlRGVtbydcclxuaW1wb3J0IEF1dGhEZW1vUm91dGVzIGZyb20gJy4vYXV0aGVudGljYXRpb24vcm91dGUnXHJcbmltcG9ydCBDb21wb25lbnRzUm91dGVzIGZyb20gJy4vY29tcG9uZW50cy9yb3V0ZSdcclxuY29uc3QgaGFuZ291dHMgPSBbXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJvbmUnIH0sXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJ0aHJlZScgfSxcclxuXTtcclxuY29uc3QgaGFuZ291dCA9IHtcclxuICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcclxuICBlbWFpbDogJ3Rlc3RAZ21haWwuY29tJyxcclxuICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXHJcbn07XHJcbmNvbnN0IG1lc3NhZ2UgPSB7XHJcbiAgdXNlcm5hbWU6ICdicmVubycsXHJcbiAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gIHRpbWVzdGFtcDogMTU5MTMzMTc2NzgzNixcclxufTtcclxuLy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0b3J5Ym9va1JvdXRlcygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDB2aCd9fT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8SGFuZ291dCBoYW5nb3V0cz17aGFuZ291dHN9IC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrXCI+XHJcbiAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZWRcIj5cclxuICAgICAgICA8QmxvY2tlZCBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cclxuICAgICAgICA8Q29uZmlndXJlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZVwiPlxyXG4gICAgICAgIDxJbnZpdGUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlZVwiPlxyXG4gICAgICAgIDxJbnZpdGVlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZXJcIj5cclxuICAgICAgICA8SW52aXRlciBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nY2hhdFwiPlxyXG4gICAgICAgIDxIYW5nY2hhdCBoYW5nb3V0PXtoYW5nb3V0fSBtZXNzYWdlcz17bWVzc2FnZXN9IHVzZXJuYW1lPVwiZGVtb1wiIC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VcIj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IDIwLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZWVlZWVlZScgfX0+XHJcbiAgICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfSB1c2VybmFtZT17aGFuZ291dC51c2VybmFtZX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvb25saW5lXCI+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxPbmxpbmVTdGF0dXMgb25saW5lIC8+XHJcbiAgICAgICAgICA8T25saW5lU3RhdHVzIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VzXCI+XHJcbiAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvdW5yZWFkXCI+XHJcbiAgICAgICAgPFVucmVhZERlbW8gLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tlci1tZXNzYWdlXCI+XHJcbiAgICAgICAgPEJsb2NrZXJNZXNzYWdlRGVtbyAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaWNvbnNcIj5cclxuICAgICAgICA8SWNvbnNEZW1vIC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBdXRoRGVtb1JvdXRlcy8+XHJcbiAgICAgIDxDb21wb25lbnRzUm91dGVzLz5cclxuICAgIDwvZGl2PlxyXG5cclxuICApXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdmJhcihwcm9wcykge1xyXG4gICAgY29uc3QgeyBiZyA9ICdsaWdodCcsIGJyYW5kLCBjaGlsZHJlbiB9ID0gcHJvcHNcclxuICAgIHJldHVybiA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciBuYXZiYXItZXhwYW5kLWxnIG5hdmJhci0ke2JnfSBiZy0ke2JnfWB9PlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIjXCI+e2JyYW5kfTwvYT5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCIgYXJpYS1jb250cm9scz1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiVG9nZ2xlIG5hdmlnYXRpb25cIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXItaWNvblwiPjwvc3Bhbj5cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgIFxyXG4gICAgPC9uYXY+XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyQ29sbGFwc2Uoe2NoaWxkcmVufSl7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyTmF2KHsgY2hpbGRyZW4gfSkge1xyXG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1yLWF1dG9cIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L3VsPlxyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHsgY2hpbGRyZW4gfSkge1xyXG4gIFxyXG4gICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPntjaGlsZHJlbn08L2xpPlxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkxpbmsocHJvcHMpIHtcclxuICAgIGNvbnN0IHthcHBSb3V0ZX09cHJvcHNcclxuICAgIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBcclxuICAgICAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6YC8ke2lkfWAscm91dGU6YXBwUm91dGV9KVxyXG4gICAgICB9XHJcbiAgICByZXR1cm4gPGEgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBocmVmPVwiI1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSAgey4uLnByb3BzfS8+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2RHJvcGRvd24ocHJvcHMpIHtcclxuICAgIGNvbnN0IHt0aXRsZSxjaGlsZHJlbn09cHJvcHNcclxuICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW0gZHJvcGRvd25cIiA+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwibmF2LWxpbmsgZHJvcGRvd24tdG9nZ2xlXCIgaHJlZj1cIiNcIiBpZD1cIm5hdmJhckRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiey4uLnByb3BzfT5cclxuICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2xpPlxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERyb3Bkb3duTWVudShwcm9wcykge1xyXG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHNcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJuYXZiYXJEcm9wZG93blwiPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRHJvcGRvd25JdGVtIChwcm9wcyl7XHJcbiAgICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTonLycscm91dGU6YC8ke2lkfWB9KVxyXG4gICAgICB9XHJcbiAgICByZXR1cm4gICAgPGEgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCIjXCIgey4uLnByb3BzfSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0vPlxyXG59IiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IFN0b3J5Ym9va1Byb3ZpZGVycyBmcm9tICcuL1N0b3J5Ym9va1Byb3ZpZGVycydcclxuaW1wb3J0IFN0b3J5Ym9va1JvdXRlcyBmcm9tICcuL1N0b3J5Ym9va1JvdXRlcydcclxuaW1wb3J0IE5hdmJhciwgeyBOYXZCYXJOYXYsIE5hdkl0ZW0sIE5hdkxpbmssIE5hdkJhckNvbGxhcHNlIH0gZnJvbSAnY29tcG9uZW50cy9uYXYtYmFyJ1xyXG5pbXBvcnQgTmF2RHJvcGRvd24sIHsgRHJvcGRvd25NZW51LCBEcm9wZG93bkl0ZW0gfSBmcm9tICdjb21wb25lbnRzL25hdi1iYXIvbmF2LWRyb3Bkb3duJ1xyXG5cclxucmVuZGVyKFxyXG4gIDxTdG9yeWJvb2tQcm92aWRlcnM+XHJcbiAgICA8TmF2YmFyIGJyYW5kPVwiU3Rvcnlib29rXCIgYmc9XCJkYXJrXCI+XHJcbiAgICAgIDxOYXZCYXJDb2xsYXBzZT5cclxuICAgICAgICA8TmF2QmFyTmF2PlxyXG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiQ29tcG9uZW50c1wiPlxyXG4gICAgICAgICAgICA8RHJvcGRvd25NZW51PlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJidXR0b25cIj5CdXR0b25zPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cInRleHQtaW5wdXRcIj5UZXh0SW5wdXQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwidG9hc3RcIj5Ub2FzdDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJhbGVydFwiPkFsZXJ0PC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgIDwvRHJvcGRvd25NZW51PlxyXG4gICAgICAgICAgPC9OYXZEcm9wZG93bj5cclxuICAgICAgICAgIDxOYXZEcm9wZG93biB0aXRsZT1cIkF1dGhlbnRpY2F0aW9uXCI+XHJcbiAgICAgICAgICAgIDxEcm9wZG93bk1lbnU+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImxvZ2luXCI+TG9naW48L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwic2lnbnVwXCI+U2lnbnVwPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImNoYW5nZS1wYXNzd29yZFwiPkNoYW5nZSBQYXNzd29yZDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJmb3Jnb3QtcGFzc3dvcmRcIj5Gb3Jnb3QgUGFzc3dvcmQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgPC9Ecm9wZG93bk1lbnU+XHJcbiAgICAgICAgICA8L05hdkRyb3Bkb3duPlxyXG4gICAgICAgIDwvTmF2QmFyTmF2PlxyXG4gICAgICA8L05hdkJhckNvbGxhcHNlPlxyXG4gICAgPC9OYXZiYXI+XHJcbiAgICA8U3Rvcnlib29rUm91dGVzIC8+XHJcbiAgPC9TdG9yeWJvb2tQcm92aWRlcnM+XHJcblxyXG4gICxcclxuICBkb2N1bWVudC5ib2R5XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJ0IiwiciIsInUiLCJpIiwibyIsImYiLCJjIiwiZSIsImEiLCJ2IiwibSIsIngiLCJwIiwicyIsIlQiLCJfIiwiZyIsImFjdGlvblR5cGVzIiwiQVBQX1JPVVRFX0NIQU5HRUQiLCJyZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwicm91dGUiLCJmZWF0dXJlUm91dGUiLCJBcHBSb3V0ZUNvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlQXBwUm91dGVDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsInVzZUFwcFJvdXRlIiwiZGlzcGF0Y2giLCJuYW1lIiwib25BcHBSb3V0ZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiQXBwUm91dGUiLCJwcm9wcyIsImNoaWxkcmVuIiwicGF0aCIsInBhdGhzIiwiZmluZCIsIkFwcFJvdXRlUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwiZ2V0SXRlbSIsInBhcnNlIiwidmFsdWUiLCJ1c2VNZW1vIiwiQXBwUHJvdmlkZXJzIiwiTGlzdCIsIkxpc3RJdGVtIiwiVGV4dElucHV0IiwibGFiZWwiLCJpc1ZhbGlkIiwibWVzc2FnZSIsInVuZGVmaW5lZCIsIkJ1dHRvbiIsInRpdGxlIiwiYmciLCJvdXRsaW5lIiwic2l6ZSIsImxvYWRpbmciLCJzdHlsZSIsImlucHV0Q29udGFpbmVyIiwiZGlzcGxheSIsImJvcmRlciIsImlucHV0IiwicGFkZGluZyIsImZsZXgiLCJIYW5nb3V0IiwiaGFuZ291dHMiLCJvblNlYXJjaElucHV0Iiwib25GZXRjaEhhbmdvdXRzIiwib25TZWxlY3RIYW5nb3V0Iiwic2VhcmNoIiwiaGFuZGxlSGFuZ291dFNlbGVjdGlvbiIsImlkIiwidGFyZ2V0IiwiaGFuZ291dCIsInVzZXJuYW1lIiwibGVuZ3RoIiwibWFwIiwic3R5bGVzIiwicm9vdCIsImJhY2tncm91bmRDb2xvciIsImhlaWdodCIsIkxheW91dCIsImNoZWNrYm94IiwibWFyZ2luUmlnaHQiLCJjaGVja2JveFJvb3QiLCJhbGlnbkl0ZW1zIiwibGF5b3V0IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiYm94U2l6aW5nIiwicGFkZGluZ1RvcCIsImJ0biIsIkJsb2NrIiwib25DYW5jZWwiLCJvbkJsb2NrIiwib25SZXBvcnQiLCJ3aWR0aCIsImZpbGwiLCJjb2xvciIsIm9uQ2xpY2siLCJDZW50ZXIiLCJ0ZXh0QWxpZ24iLCJCbG9ja2VkIiwib25VbmJsb2NrIiwib25DbG9zZSIsIkRlbGV0ZSIsIkFyY2hpdmUiLCJpY29uQnRuIiwibWFyZ2luIiwiYnRuQ29udGFpbmVyIiwiYnRuT2siLCJDb25maWd1cmUiLCJvbkRlbGV0ZSIsIm9uQXJjaGl2ZSIsIm9uTm90aWZpY2F0aW9uIiwib25Db252ZXJzYXRpb25IaXN0b3J5Iiwib25OYXZpZ2F0aW9uIiwib25PayIsIkljb25CdXR0b24iLCJJY29uIiwiQ2hlY2tib3giLCJvbkNoYW5nZSIsIm1hcmdpblRvcCIsIlBlcnNvbkFkZEljb24iLCJJbnZpdGUiLCJvbkludml0ZSIsIm9uTWVzc2FnZVRleHQiLCJtZXNzYWdlVGV4dCIsIlBlcnNvbkFkZCIsImVtYWlsIiwiRG9uZSIsIkludml0ZWUiLCJ1c2VNZWRpYVF1ZXJ5Iiwic2V0V2lkdGgiLCJ1c2VTdGF0ZSIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJkZXZpY2UiLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsImNvbnNvbGUiLCJsb2ciLCJhZGRFdmVudExpc3RlbmVyIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwiYm9yZGVyUmFkaXVzIiwibWluSGVpZ2h0IiwiZm9udFNpemUiLCJNZXNzYWdlIiwiZmxvYXQiLCJ0aW1lc3RhbXAiLCJkYXlzIiwic2V0RGF5cyIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJkIiwiaCIsIk1hdGgiLCJmbG9vciIsInNldFRpbWVvdXQiLCJEYXRlIiwibm93Iiwic2V0SW50ZXJ2YWwiLCJtYXJnaW5Cb3R0b20iLCJ0ZXh0IiwicGFkZGluZ0JvdHRvbSIsIkludml0ZXIiLCJvbkFjY2VwdCIsIm9uRGVjbGluZSIsIm1hcmdpbkxlZnQiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsIk1lc3NhZ2VFZGl0b3IiLCJvbk1lc3NhZ2UiLCJCbG9ja2VyTWVzc2FnZSIsIkJsb2NrZWRNZXNzYWdlIiwiaGFuZGxlTmF2aWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwibWVzc2FnZUNvbnRhaW5lciIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsIk1lc3NhZ2VzIiwibWVzc2FnZXMiLCJzY3JvbGxlclJlZiIsInVzZVJlZiIsImN1cnJlbnQiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJvblNlbmQiLCJmbG9hdE1lc3NhZ2VzIiwic29ydE1lc3NhZ2VzIiwibXNnIiwic29ydCIsIkhhbmdjaGF0IiwiZG9jdW1lbnQiLCJPbmxpbmVTdGF0dXMiLCJyZWFkeVN0YXRlIiwiSXNPbmxpbmUiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsImNvdW50IiwiSWNvbnNEZW1vIiwicmVkdWNlclVucmVhZGhhbmdvdXRzIiwidW5yZWFkaGFuZ291dHMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsImluZGV4IiwibWVzc2FnZUNvdW50Iiwib2JqIiwiZmluZEluZGV4Iiwic3BsaWNlIiwicHVzaCIsIlVucmVhZEhhbmdvdXRzIiwib25TZWxlY3RVbnJlYWQiLCJvblJlbW92ZVVucmVhZCIsIml0ZW1zIiwic2V0SXRlbXMiLCJyZWR1Y2VkIiwidW5yZWFkcyIsIlVucmVhZERlbW8iLCJVbnJlYWQiLCJCbG9ja2VyTWVzc2FnZURlbW8iLCJBbGVydCIsImFsZXJ0IiwiTG9naW4iLCJlbWFpbG9ydXNlcm5hbWUiLCJwYXNzd29yZCIsIm9uTG9naW4iLCJvbkZvY3VzIiwidmFsaWRhdGlvbiIsIm9uRm9yZ290UGFzc3dvcmQiLCJvbkJsdXIiLCJlcnJvciIsInZhbGlkYXRpb25TdWNjZXNzIiwidmFsaWRhdGlvbkVycm9yIiwiTG9naW5TdGF0ZXMiLCJTaWdudXAiLCJvblNpZ251cCIsIlNpZ251cFN0YXRlcyIsIkNoYW5nZVBhc3N3b3JkIiwiY29uZmlybSIsIm9uUGFzc3dvcmRDaGFuZ2UiLCJDaGFuZ2VQYXNzd29yZFN0YXRlcyIsIlJlcXVlc3RQYXNzQ2hhbmdlIiwib25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UiLCJGb3Jmb3RQYXNzd29yZFN0YXRlIiwiRm9yZ290UGFzc3dvcmQiLCJBdXRoRGVtb1JvdXRlcyIsIlNpZ25VcFN0YXRlcyIsIkZvcmdvdFBhc3N3b3JkU3RhdGVzIiwiQnV0dG9uRGVtbyIsIlRleHRJbnB1dFN0YXRlcyIsIlRvYXN0IiwidXNlckltYWdlIiwiVG9hc3REZW1vIiwiQWxlcnREZW1vIiwiQ29tcG9uZW50c1JvdXRlIiwiU3Rvcnlib29rUm91dGVzIiwiQ29tcG9uZW50c1JvdXRlcyIsIk5hdmJhciIsImJyYW5kIiwiTmF2QmFyQ29sbGFwc2UiLCJOYXZCYXJOYXYiLCJOYXZEcm9wZG93biIsIkRyb3Bkb3duTWVudSIsIkRyb3Bkb3duSXRlbSIsImhhbmRsZVJvdXRlIiwicmVuZGVyIiwiU3Rvcnlib29rUHJvdmlkZXJzIiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyw4REFBOEQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQSxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBeUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXVHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDOztBQ0F0dEUsTUFBTVUsV0FBVyxHQUFFO0FBQ3RCQyxFQUFBQSxpQkFBaUIsRUFBQyxtQkFESTs7QUFBQSxDQUFuQjs7QUNFQSxTQUFTQyxPQUFULENBQWlCQyxLQUFqQixFQUF3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
