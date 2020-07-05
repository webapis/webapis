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
    className: `${!isValid && 'invalid-feedback'}`
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

function Login(props) {
  const {
    emailorusername,
    password,
    loading,
    onLogin,
    onChange,
    validation,
    onForgotPassword
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
  })), h(TextInput, {
    value: emailorusername,
    onChange: onChange,
    label: "Email or username",
    name: "emailorusername",
    type: "text",
    placeholder: "Enter email or username",
    id: "emailOrUsername",
    "data-testid": "emailOrUsername",
    message: validation && validation['emailorusername'].message,
    isValid: validation && validation['emailorusername'].isValid // validationTypes={[
    //   validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
    //   validationTypes.INVALID_CREDENTIALS,
    //   validationTypes.EMAIL_NOT_REGISTERED,
    //   validationTypes.USERNAME_NOT_REGISTERED,
    // ]}

  }), h(TextInput, {
    label: "Password",
    value: password,
    onChange: onChange,
    name: "password",
    type: "password",
    placeholder: "enter password",
    id: "password",
    "data-testid": "password",
    message: validation && validation['password'].message,
    isValid: validation && validation['password'].isValid // validationTypes={[
    //   validationTypes.EMPTY_STRING_VALIDATION,
    //   validationTypes.INVALID_CREDENTIALS,
    // ]}

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
    validation
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
  })), h(TextInput, {
    label: "Username",
    value: username,
    onChange: onChange,
    type: "text",
    "data-testid": "username",
    name: "username",
    placeholder: "username",
    isValid: validation && validation['username'].isValid,
    message: validation && validation['username'].message // validationTypes={[
    //   validationTypes.USERNAME_FORMAT_VALIDATION,
    //   validationTypes.USERNAME_TAKEN,
    //   validationTypes.EMPTY_STRING_VALIDATION,
    // ]}

  }), h(TextInput, {
    label: "Email",
    onChange: onChange,
    value: email,
    placeholder: "email",
    type: "email",
    "data-testid": "email",
    name: "email",
    isValid: validation && validation['email'].isValid,
    message: validation && validation['email'].message // validationTypes={[
    //   validationTypes.EMAIL_FORMAT_VALIDATION,
    //   validationTypes.REGISTERED_EMAIL,
    // ]}

  }), h(TextInput, {
    label: "Password",
    onChange: onChange,
    value: password,
    placeholder: "password",
    type: "password",
    "data-testid": "password",
    name: "password",
    isValid: validation && validation['password'].isValid,
    message: validation && validation['password'].message // validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}

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
  }))));
}

const AuthContext = M();

function ChangePassword(props) {
  const {
    password,
    confirm,
    validation,
    onChange,
    onPasswordChange,
    loading
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
  })), h(TextInput, {
    label: "Password",
    value: password,
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Enter new password",
    onChange: onChange,
    isValid: validation && validation['password'].isValid,
    message: validation && validation['password'].message //  validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}

  }), h(TextInput, {
    label: "Confirm",
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    placeholder: "Confirm new password",
    onChange: onChange,
    isValid: validation && validation['confirm'].isValid,
    message: validation && validation['confirm'].message //   validationTypes={[validationTypes.PASSWORDS_MATCH_VALIDATION]}

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
  }))));
}

function RequestPassChange(props) {
  const {
    email,
    validation,
    onRequestPasswordChange,
    loading,
    onChange
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
  })), h(TextInput, {
    label: "Email",
    value: email,
    placeholder: "email",
    name: "email",
    onChange: onChange,
    type: "email",
    id: "email",
    isValid: validation && validation['email'].isValid,
    message: validation && validation['email'].message // validationTypes={[
    //   validationTypes.EMAIL_FORMAT_VALIDATION,
    //   validationTypes.EMAIL_NOT_REGISTERED,
    // ]}

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

function ComponentsRoute() {
  return [h(AppRoute, {
    path: "/button"
  }, h(ButtonDemo, null)), h(AppRoute, {
    path: "/text-input"
  }, h(TextInputStates, null))];
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

function NavDropdown({
  title,
  children
}) {
  return h("li", {
    className: "nav-item dropdown"
  }, h("a", {
    className: "nav-link dropdown-toggle",
    href: "#",
    id: "navbarDropdown",
    role: "button",
    "data-toggle": "dropdown",
    "aria-haspopup": "true",
    "aria-expanded": "false"
  }, title), children);
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
}, "TextInput"))), h(NavDropdown, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2luZGV4LmpzIiwiLi4vU3Rvcnlib29rUHJvdmlkZXJzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9saXN0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy90ZXh0LWlucHV0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9idXR0b24vaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXQuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0xheW91dC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2suanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0Jsb2NrLmpzIiwiLi4vLi4vY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9ja2VkLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0FyY2hpdmUuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvUGVyc29uQWRkLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGUuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0RvbmUuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZWUuanMiLCIuLi8uLi9jb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9NZXNzYWdlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9CbG9ja2VyTWVzc2FnZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvQmxvY2tlZE1lc3NhZ2UuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL2luZGV4LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9IYW5nY2hhdC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9NZXNzYWdlLmpzIiwiLi4vSWNvbnNEZW1vLmpzIiwiLi4vZmFrZU1lc3NhZ2VzLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL1VucmVhZEhhbmdvdXRzLmpzIiwiLi4vVXJlYWREZW1vLmpzIiwiLi4vQmxvY2tlck1lc3NhZ2VEZW1vLmpzIiwiLi4vLi4vZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9Mb2dpbi5qcyIsIi4uL2F1dGhlbnRpY2F0aW9uL3N0YXRlcy9sb2dpbi5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL3NpZ251cC5qcyIsIi4uL2F1dGhlbnRpY2F0aW9uL3N0YXRlcy9zaWdudXAuc3RhdGVzLmpzIiwiLi4vLi4vZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvQXV0aFByb3ZpZGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9DaGFuZ2VQYXNzd29yZC5qcyIsIi4uL2F1dGhlbnRpY2F0aW9uL3N0YXRlcy9jaGFuZ2UtcGFzc3dvcmQuc3RhdGVzLmpzIiwiLi4vLi4vZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9Gb3Jnb3RQYXNzd29yZC5qcyIsIi4uL2F1dGhlbnRpY2F0aW9uL3N0YXRlcy9mb3Jnb3QtcGFzc3dvcmQuc3RhdGVzLmpzIiwiLi4vYXV0aGVudGljYXRpb24vcm91dGUuanMiLCIuLi9jb21wb25lbnRzL2J1dHRvbi9pbmRleC5qcyIsIi4uL2NvbXBvbmVudHMvdGV4dC1pbnB1dC9pbmRleC5qcyIsIi4uL2NvbXBvbmVudHMvcm91dGUuanMiLCIuLi9TdG9yeWJvb2tSb3V0ZXMuanMiLCIuLi8uLi9jb21wb25lbnRzL25hdi1iYXIvaW5kZXguanMiLCIuLi8uLi9jb21wb25lbnRzL25hdi1iYXIvbmF2LWRyb3Bkb3duLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcclxuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXHJcbiAgLy8gIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByb3V0ZTogYWN0aW9uLnJvdXRlLGZlYXR1cmVSb3V0ZTogYWN0aW9uLmZlYXR1cmVSb3V0ZSB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVJlZHVjZXIsdXNlTWVtbywgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHtyZWR1Y2VyfSBmcm9tICcuL3JlZHVjZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmNvbnN0IEFwcFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbiBmdW5jdGlvbiB1c2VBcHBSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwUm91dGVDb250ZXh0KTtcclxuICBcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZVJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtmZWF0dXJlUm91dGV9PXN0YXRlXHJcblxyXG4gIGlmIChwYXRoICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aCkge1xyXG5cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gZmVhdHVyZVJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwUm91dGUgKCl7XHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VBcHBSb3V0ZUNvbnRleHQoKVxyXG4gIGNvbnN0IHtuYW1lfT1zdGF0ZVxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgaWYobmFtZSl7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG5hbWUsSlNPTi5zdHJpbmdpZnkoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pKVxyXG4gICAgfVxyXG4gICBcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtvbkFwcFJvdXRlfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge3JvdXRlfT1zdGF0ZVxyXG4gIGlmIChwYXRoICYmIHJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiByb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gcm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcbiAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICBpZihzdGF0ZSAmJiBzdGF0ZS5uYW1lICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpKXtcclxuIFxyXG4gICAgICAgIGNvbnN0IHtmZWF0dXJlUm91dGUscm91dGV9PSBKU09OLnBhcnNlKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdGF0ZS5uYW1lKSlcclxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICAgIH1cclxuXHJcbiAgfSxbXSlcclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgIEFwcFJvdXRlUHJvdmlkZXIgIGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUHJvdmlkZXJzKHsgY2hpbGRyZW4gfSkge1xyXG4gIHJldHVybiAoXHJcbiAgXHJcbiAgICAgIDxBcHBSb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAvL1xyXG4gICAgICAgIHRpdGxlPVwiV2ViY29tXCJcclxuICAgICAgICBpbml0U3RhdGU9e3sgcm91dGU6ICcvJywgZmVhdHVyZVJvdXRlOiAnL2hhbmdvdXRzJyxuYW1lOidzdG9yeWJvb2snIH19XHJcbiAgICAgID5cclxuICAgIFxyXG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG5cclxuICApO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcblxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0XCIgey4uLnByb3BzfS8+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0SXRlbShwcm9wcykge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWl0ZW1cIiB7Li4ucHJvcHN9IC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHtMaXN0SXRlbX0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBsYWJlbCwgbmFtZSwgdHlwZSwgaXNWYWxpZCwgbWVzc2FnZSB9ID0gcHJvcHNcclxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIHAtMFwiPlxyXG4gICAgPGxhYmVsIGZvcj17bmFtZX0gPntsYWJlbH08L2xhYmVsPlxyXG4gICAgPGlucHV0IHR5cGU9e3R5cGV9IGNsYXNzTmFtZT17YGZvcm0tY29udHJvbCAke2lzVmFsaWQgJiYgJ2lzLXZhbGlkJ30gJHshaXNWYWxpZCAmJiBpc1ZhbGlkICE9PSB1bmRlZmluZWQgJiYgJ2lzLWludmFsaWQnfWB9IGlkPXtuYW1lfSBhcmlhLWRlc2NyaWJlZGJ5PXtuYW1lfXsuLi5wcm9wc30gLz5cclxueyFpc1ZhbGlkICYmIDxzbWFsbCBpZD1cImVtYWlsSGVscFwiIGNsYXNzTmFtZT17YCR7IWlzVmFsaWQgJiYgJ2ludmFsaWQtZmVlZGJhY2snfWB9PnttZXNzYWdlfTwvc21hbGw+fVxyXG4gIDwvZGl2PlxyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0aXRsZSwgYmc9XCJsaWdodFwiLG91dGxpbmUsIHNpemUsbG9hZGluZz1mYWxzZX0gPSBwcm9wcztcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9IHtgJHtiZyAmJiAhb3V0bGluZSYmYGJ0biBidG4tJHtiZ31gfSAke291dGxpbmUmJmBidG4gYnRuLW91dGxpbmUtJHtiZ31gfSAke3NpemUmJmBidG4gYnRuLSR7c2l6ZX1gfWB9IHsuLi5wcm9wc30gZGlzYWJsZWQ9e2xvYWRpbmd9PlxyXG4gICAgICAgIHtsb2FkaW5nICYmIDxzcGFuIGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc21cIiByb2xlPVwic3RhdHVzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPn0gXHJcbiAgICAgICAgeyBsb2FkaW5nID8gJ3dhaXQuLi4nOnRpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCBMaXN0LHsgTGlzdEl0ZW0gfSBmcm9tICdjb250cm9scy9saXN0JztcclxuaW1wb3J0ICBUZXh0SW5wdXQgIGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgIEJ1dHRvbiAgZnJvbSAnY29udHJvbHMvYnV0dG9uJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuXHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpbnB1dENvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYm9yZGVyOiAnIzczNzM3MyBzb2xpZCAxcHgnLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIHBhZGRpbmc6IDEwLFxyXG4gICAgZmxleDogMSxcclxuICAgIGJvcmRlcjogJ3doaXRlJyxcclxuXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXQoe1xyXG4gIGhhbmdvdXRzLFxyXG4gIG9uU2VhcmNoSW5wdXQsXHJcbiAgb25GZXRjaEhhbmdvdXRzLFxyXG4gIG9uU2VsZWN0SGFuZ291dCxcclxuICBzZWFyY2hcclxufSkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRTZWxlY3Rpb24oZSkge1xyXG4gICAgY29uc3QgaWQgPSBlLnRhcmdldC5pZFxyXG4gICAgb25TZWxlY3RIYW5nb3V0KGUpXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZChnID0+IGcudXNlcm5hbWUgPT09IGlkKVxyXG5cclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KVxyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiAoXHJcblxyXG4gICAgPGRpdiA+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxyXG4gICAgICAgICAgaWQ9XCJzZWFyY2gtaW5wdXRcIlxyXG4gICAgICAgICAgdHlwZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2hJbnB1dH1cclxuICAgICAgICAgIHN0eWxlPXtzdHlsZS5pbnB1dH1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxCdXR0b25cclxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWJ0blwiXHJcbiAgICAgICAgICBkaXNhYmxlZD17IXNlYXJjaH1cclxuICAgICAgICAgIHRpdGxlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG9uQ2xpY2s9e29uRmV0Y2hIYW5nb3V0c31cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxMaXN0IGlkPVwiaGFuZ291dHMtbGlzdFwiPlxyXG4gICAgICAgIHtoYW5nb3V0cyAmJlxyXG4gICAgICAgICAgaGFuZ291dHMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgPExpc3RJdGVtIGlkPXtnLnVzZXJuYW1lfSBkYXRhLXRlc3RpZD17Zy51c2VybmFtZX0gb25DbGljaz17aGFuZGxlSGFuZ291dFNlbGVjdGlvbn0+XHJcbiAgICAgICAgICAgICAgICB7Zy51c2VybmFtZX1cclxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2VlZWVlZScsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMYXlvdXQoeyBjaGlsZHJlbiwgc3R5bGUsIGlkIH0pIHtcclxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17aWR9IHN0eWxlPXt7IC4uLnN0eWxlcy5yb290LCAuLi5zdHlsZSB9fT57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0ICBCdXR0b24gIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGNoZWNrYm94OiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgY2hlY2tib3hSb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgIHBhZGRpbmc6IDE2LFxyXG4gIH0sXHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZ1RvcDo2OFxyXG4gIH0sXHJcbiAgYnRuOiB7XHJcbiAgICBmbGV4OiAxLFxyXG4gICAgbWFyZ2luUmlnaHQ6IDQsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgb25DYW5jZWwsIG9uQmxvY2ssIG9uUmVwb3J0IH0pIHtcclxuXHJcbiBcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY2hlY2tib3hSb290fT5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XHJcbiAgICAgICAgPGxhYmVsPlJlcG9ydDwvbGFiZWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cclxuICAgICAgICA8QnV0dG9uIGRhdGEtdGVzdGlkPSdjYW5jZWwtYnRuJyBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNhbmNlbH0gPkNBTkNFTDwvQnV0dG9uPlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJCbG9ja1wiIHN0eWxlPXtzdHlsZS5idG59IGlkPVwiQkxPQ0tcIiBvbkNsaWNrPXtvbkJsb2NrfSBkYXRhLXRlc3RpZD1cImJsb2NrLWJ0blwiID5CTE9DSzwvQnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9jayh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBvbkNsaWNrLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgaGVpZ2h0PXtoZWlnaHR9XHJcbiAgICAgIHZpZXdCb3g9JzAgMCAyNCAyNCdcclxuICAgICAgd2lkdGg9e3dpZHRofVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBpZD17aWR9XHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6TTQgMTJjMC00LjQyIDMuNTgtOCA4LTggMS44NSAwIDMuNTUuNjMgNC45IDEuNjlMNS42OSAxNi45QzQuNjMgMTUuNTUgNCAxMy44NSA0IDEyem04IDhjLTEuODUgMC0zLjU1LS42My00LjktMS42OUwxOC4zMSA3LjFDMTkuMzcgOC40NSAyMCAxMC4xNSAyMCAxMmMwIDQuNDItMy41OCA4LTggOHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQ2VudGVyKHsgY2hpbGRyZW4sIHN0eWxlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcclxuICAgICAgICAuLi5zdHlsZSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnaWNvbnMvQmxvY2snO1xyXG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgIEJ1dHRvbiAgZnJvbSAnY29udHJvbHMvYnV0dG9uJztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmdUb3A6NjhcclxuICB9LFxyXG4gIGJ0bjoge1xyXG4gICAgZmxleDogMSxcclxuICAgIG1hcmdpblJpZ2h0OiA0LFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9ja2VkKHsgaGFuZ291dCwgb25VbmJsb2NrLCBvbkNsb3NlIH0pIHtcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiYmxvY2tlZC11aVwiPlxyXG4gICAgICA8Q2VudGVyIHN0eWxlPXt7IGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cclxuICAgICAgICA8QmxvY2sgd2lkdGg9XCI2MFwiIGhlaWdodD1cIjcwXCIgY29sb3I9XCJyZWRcIiAvPlxyXG4gICAgICAgIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQudXNlcm5hbWV9PC9iPiBpcyBibG9ja2VkXHJcbiAgICAgIDwvQ2VudGVyPlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XHJcbiAgICAgICAgPEJ1dHRvbiBkYXRhLXRlc3RpZD0nY2xvc2UtYnRuJyBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsb3NlfSA+Q0xPU0U8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGlkPSdVTkJMT0NLJyAgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25VbmJsb2NrfSBkYXRhLXRlc3RpZD0ndW5ibG9jay1idG4nPlVOQkxPQ0s8L0J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gRGVsZXRlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXJjaGl2ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17MjR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMjAuNTQgNS4yM2wtMS4zOS0xLjY4QzE4Ljg4IDMuMjEgMTguNDcgMyAxOCAzSDZjLS40NyAwLS44OC4yMS0xLjE2LjU1TDMuNDYgNS4yM0MzLjE3IDUuNTcgMyA2LjAyIDMgNi41VjE5YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNi41YzAtLjQ4LS4xNy0uOTMtLjQ2LTEuMjd6TTEyIDE3LjVMNi41IDEySDEwdi0yaDR2MmgzLjVMMTIgMTcuNXpNNS4xMiA1bC44MS0xaDEybC45NCAxSDUuMTJ6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSAnaWNvbnMvRGVsZXRlJztcclxuaW1wb3J0IHsgQXJjaGl2ZSB9IGZyb20gJ2ljb25zL0FyY2hpdmUnO1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gICdpY29ucy9CbG9jayc7XHJcbmltcG9ydCAgQnV0dG9uICBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpY29uQnRuOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbjogOCB9LFxyXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGJ0bkNvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbiAgYnRuT2s6IHtcclxuICAgIG1hcmdpbjogOCxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xyXG4gIG9uQmxvY2ssXHJcbiAgb25EZWxldGUsXHJcbiAgb25BcmNoaXZlLFxyXG4gIG9uTm90aWZpY2F0aW9uLFxyXG4gIG9uQ29udmVyc2F0aW9uSGlzdG9yeSxcclxuICBvbk5hdmlnYXRpb24sXHJcbiAgb25PayxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XHJcbiAgICAgICAgPENoZWNrYm94XHJcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxociAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Db250YWluZXJ9PlxyXG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gaWQ9XCJiY2t1aVwiIHRpdGxlPVwiQmxvY2tcIiBJY29uPXtCbG9ja30gb25DbGljaz17b25OYXZpZ2F0aW9ufSAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bk9rfT5cclxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uT2t9Pk9LPC9CdXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gSWNvbkJ1dHRvbih7IEljb24sIHRpdGxlLCBvbkNsaWNrLGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUuaWNvbkJ0bn0+XHJcbiAgICAgIDxidXR0b24gaWQ9e2lkfSBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsaWNrfSBkYXRhLXRlc3RpZD17YCR7aWR9LWJ0bmB9PlxyXG4gICAgICAgIDxJY29uIGlkPXtpZH0vPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGRpdj57dGl0bGV9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDaGVja2JveCh7IGxhYmVsLCBvbkNoYW5nZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiA4LCBtYXJnaW5Ub3A6IDggfX0+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XHJcbiAgICAgIDxsYWJlbD57bGFiZWx9PC9sYWJlbD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnd2hpdGUnLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBQZXJzb25BZGQgZnJvbSAnaWNvbnMvUGVyc29uQWRkJztcclxuaW1wb3J0ICBUZXh0SW5wdXQgIGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgIExheW91dCAgZnJvbSAnLi9MYXlvdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICB9LFxyXG59O1xyXG4vL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGUoeyBoYW5nb3V0LCBvbkludml0ZSwgb25NZXNzYWdlVGV4dCxtZXNzYWdlVGV4dCwgbG9hZGluZyB9KSB7XHJcblxyXG4gIFxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9aWQ9XCJpbnZpdGUtdWlcIj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8UGVyc29uQWRkIGNvbG9yPVwiZ3JlZW5cIiAvPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICBTdGFydCBDb252ZXJzYXRpb24gd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxUZXh0SW5wdXQgaWQ9XCJtZXNzYWdlVGV4dElucHV0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9IHZhbHVlPXttZXNzYWdlVGV4dH0gLz5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8QnV0dG9uIGxvYWRpbmc9e2xvYWRpbmd9ICBpZD1cIklOVklURVwiIG9uQ2xpY2s9e29uSW52aXRlfSBkYXRhLXRlc3RpZD0nb25pbnZpdGUtYnRuJyA+XHJcbiAgICAgICAgICBTRU5EIElOVklURVxyXG4gICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRG9uZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yeidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IERvbmUgfSBmcm9tICdpY29ucy9Eb25lJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyJztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlZSh7IGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJpbnZpdGVlLXVpXCI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPERvbmUgd2lkdGg9XCI3MFwiIGhlaWdodD1cIjcwXCIgY29sb3I9XCJncmVlblwiIC8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxwPlxyXG4gICAgICAgICAgWW91IHdpbGwgYmUgYWJsZSB0byBjaGF0IHdpdGggPGI+e2hhbmdvdXQgJiYgaGFuZ291dC5lbWFpbH08L2I+IG9uY2VcclxuICAgICAgICAgIHlvdXIgaW52aXRpb24gaGFzIGJlZW4gYWNjZXB0ZWQuXHJcbiAgICAgICAgPC9wPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tICcuL2RldmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKSB7XHJcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW29yaWVudGF0aW9uLCBzZXRPcmllbnRhdGlvbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2RldmljZSwgc2V0RGV2aWNlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XHJcbiAgIFxyXG4gICAgICBzZXRXaWR0aCh3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbiAgICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpIHtcclxuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xyXG4gIH1cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoID4gMCkge1xyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDYwMDpcclxuICAgICAgICAgIHNldERldmljZSgncGhvbmUnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNzY4OlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gOTkyOlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcclxuICAgICAgICAgIHNldERldmljZSgndGFibGV0Jyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2xhcHRvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2Rlc2t0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3dpZHRoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2aWNlJywgZGV2aWNlKTtcclxuICB9LCBbZGV2aWNlXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGhhbmRsZVZpZXdwb3J0U2l6ZSgpO1xyXG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbi8vaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICByb290OiB7XHJcbiAgICBib3JkZXJDb2xvcjogJyNlZWVlZWUnLFxyXG4gICAgYm9yZGVyU3R5bGU6ICdzb2xpZCcsXHJcbiAgICBib3JkZXJXaWR0aDogMSxcclxuICAgIGJvcmRlclJhZGl1czogNSxcclxuICAgIHBhZGRpbmc6IDMsXHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBtaW5IZWlnaHQ6IDM1LFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxyXG4gIH0sXHJcbiAgdXNlcm5hbWU6IHsgbWFyZ2luUmlnaHQ6IDggfSxcclxuICBsb2c6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGNvbG9yOiAnIzczNzM3MycsXHJcbiAgICBmb250U2l6ZTogMTAsXHJcbiAgfSxcclxuICBtZXNzYWdlOiB7fSxcclxufTtcclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UocHJvcHMpIHtcclxuICBjb25zdCB7IG1lc3NhZ2UgfSA9IHByb3BzO1xyXG4gIGNvbnN0IHsgZmxvYXQsIHVzZXJuYW1lLHRpbWVzdGFtcCB9ID0gbWVzc2FnZTtcclxuICBjb25zdCBbZGF5cywgc2V0RGF5c10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFttaW51dGVzLCBzZXRNaW51dGVzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtzZWNvbmRzLCBzZXRTZWNvbmRzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IHsgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XHJcbiAgICB2YXIgZCwgaCwgbSwgcztcclxuICAgIHMgPSBNYXRoLmZsb29yKG1zIC8gMTAwMCk7XHJcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xyXG4gICAgcyA9IHMgJSA2MDtcclxuICAgIGggPSBNYXRoLmZsb29yKG0gLyA2MCk7XHJcbiAgICBtID0gbSAlIDYwO1xyXG4gICAgZCA9IE1hdGguZmxvb3IoaCAvIDI0KTtcclxuICAgIGggPSBoICUgMjQ7XHJcbiAgICBzZXREYXlzKGQpO1xyXG4gICAgc2V0SG91cnMoaCk7XHJcbiAgICBzZXRNaW51dGVzKG0pO1xyXG4gICAgc2V0U2Vjb25kcyhzKTtcclxuICB9XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZih0aW1lc3RhbXApe1xyXG4gIFxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIHRpbWVzdGFtcCk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSB0aW1lc3RhbXApO1xyXG4gICAgICB9LCA2MDAwMCk7XHJcbiBcclxuXHJcbiAgICB9XHJcbiAgIFxyXG4gIH0sIFt0aW1lc3RhbXBdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgbWFyZ2luQm90dG9tOiAzIH19PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLnJvb3QsIGZsb2F0IH19PlxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWVzc2FnZVwiXHJcbiAgICAgICAgICBzdHlsZT17c3R5bGUubWVzc2FnZX1cclxuICAgICAgICAgIGNsYXNzTmFtZT17YG1lc3NhZ2UtZm9udC0ke2RldmljZX0tc2l6ZWB9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge21lc3NhZ2UgJiYgbWVzc2FnZS50ZXh0fVxyXG4gICAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmxvZ30+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS51c2VybmFtZX0+e3VzZXJuYW1lICYmIHVzZXJuYW1lfTo8L2Rpdj5cclxuICA8ZGl2PlxyXG4gICAgICAgICAgICB7bWludXRlcyA9PT0gMCAmJiA8ZGl2Pk5vdzwvZGl2Pn1cclxuICAgICAgICAgICAge2hvdXJzID09PSAwICYmIG1pbnV0ZXMgPiAwICYmIDxkaXY+e21pbnV0ZXN9IG1pbnV0ZXMgYWdvIDwvZGl2Pn1cclxuICAgICAgICAgICAge2hvdXJzID4gMCAmJiBkYXlzID09PSAwICYmIChcclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge2hvdXJzfSBob3VycyB7bWludXRlc30gbWludXRlcyBhZ297JyAnfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICB7ZGF5cyA8PSAxMCAmJiBkYXlzID4gMSAmJiA8ZGl2PntkYXlzfSBkYXlzIGFnbzwvZGl2Pn1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL21lc3NhZ2VzL01lc3NhZ2UnO1xyXG5pbXBvcnQgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICByb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIHBhZGRpbmdUb3A6IDcwLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgcGFkZGluZ0JvdHRvbTo4LFxyXG4gXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZXIoeyBoYW5nb3V0LCBvbkFjY2VwdCwgb25EZWNsaW5lLGxvYWRpbmcgfSkge1xyXG4gXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luTGVmdDogOCwgZGlzcGxheTonZmxleCcgfX0+XHJcbiAgICAgICAgICB7aGFuZ291dCAmJiBoYW5nb3V0Lm1lc3NhZ2UgJiYgKFxyXG4gICAgICAgICAgICA8TWVzc2FnZVxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U9e1xyXG4gICAgICAgICAgICAgICAgaGFuZ291dCAmJlxyXG4gICAgICAgICAgICAgICAgaGFuZ291dC5tZXNzYWdlICYmIHtcclxuICAgICAgICAgICAgICAgICAgLi4uaGFuZ291dC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxmbG9hdDonbGVmdCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyxwYWRkaW5nTGVmdDo4LHBhZGRpbmdSaWdodDo4IH19PlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkRFQ0xJTkVcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkRlY2xpbmV9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVjbGluZS1idG5cIlxyXG4gICAgICAgICAgICB0aXRsZT1cIkRlY2xpbmVcIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5SaWdodDogNCwgY29sb3I6ICdyZWQnIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIERFQ0xJTkVcclxuICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkFDQ0VQVFwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2VwdC1idG5cIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5MZWZ0OiA0LCBjb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBBQ0NFUFRcclxuICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAgVGV4dElucHV0ICBmcm9tICdjb250cm9scy90ZXh0LWlucHV0JztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICByb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgLy8gcG9zaXRpb246J2ZpeGVkJyxcclxuICAgIHdpZHRoOicxMDAlJyxcclxuICAgIC8vIGJvdHRvbToxMCxcclxuICAgIC8vIHJpZ2h0OjEwLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIC8vbWFyZ2luOjBcclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICBtYXJnaW5MZWZ0OiA4LFxyXG4gICAgbWFyZ2luUmlnaHQ6IDgsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgICB3aWR0aDonMTAwJSdcclxuICB9LFxyXG4gIGJ0bjp7XHJcbiAgICBwYWRkaW5nOiA4LFxyXG4gICAgbWFyZ2luTGVmdDogMTYsXHJcbiAgICBtYXJnaW5SaWdodDogMTYsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgfVxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZUVkaXRvcih7IGxvYWRpbmcsbWVzc2FnZVRleHQsIG9uTWVzc2FnZVRleHQsIG9uTWVzc2FnZSxoYW5nb3V0IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGVzLnJvb3R9PlxyXG4gICAgIDxkaXYgc3R5bGU9e3tmbGV4OjF9fT5cclxuICAgICA8VGV4dElucHV0IHN0eWxlPXtzdHlsZXMuaW5wdXR9IGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHR5cGU9XCJ0ZXh0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9ICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtaW5wdXRcIiB2YWx1ZT17bWVzc2FnZVRleHR9Lz5cclxuICAgICA8L2Rpdj5cclxuICAgXHJcbiAgICAgIFxyXG4gICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luTGVmdDozfX0+XHJcbiAgICAgICAgPEJ1dHRvbiBsb2FkaW5nPXtsb2FkaW5nfSBkaXNhYmxlZD17aGFuZ291dCAmJmhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCd9ICBzdHlsZT17c3R5bGVzLmJ0bn0gICBpZD0nTUVTU0FHRScgb25DbGljaz17b25NZXNzYWdlfSBkYXRhLXRlc3RpZD0nc2VuZC1idG4nPlxyXG5TRU5UXHJcbiAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlck1lc3NhZ2UoeyBtZXNzYWdlIH0pIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VyLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fTwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBmbG9hdDogJ3JpZ2h0JyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBmb250U2l6ZTogMTYsXHJcbiAgICB0ZXh0QWxpZ246ICdlbmQnXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZWRNZXNzYWdlKHsgbWVzc2FnZSxvbk5hdmlnYXRpb24gfSkge1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlTmF2aWdhdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBvbk5hdmlnYXRpb24oZSlcclxuICAgIH1cclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZWQtbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9XHJcbiAgICA8YSBpZD1cIlVOQkxPQ0tcIiBkYXRhLXRlc3RpZD1cInNlZW1vcmUtYnRuXCIgaHJlZj1cIi9cIiBvbkNsaWNrPXtoYW5kbGVOYXZpZ2F0aW9ufT5zZWUgbW9yZTwvYT5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VFZGl0b3IgfSBmcm9tICcuL01lc3NhZ2VFZGl0b3InO1xyXG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZSB9IGZyb20gJy4vQmxvY2tlck1lc3NhZ2UnXHJcbmltcG9ydCB7QmxvY2tlZE1lc3NhZ2V9IGZyb20gJy4vQmxvY2tlZE1lc3NhZ2UnXHJcbmltcG9ydCB7dXNlTWVkaWFRdWVyeX0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvdXNlTWVkaWFRdWVyeSdcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIG1lc3NhZ2VDb250YWluZXI6IHtcclxuICAgIC8vIHdpZHRoOiAnMTAwJScsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmc6IDMsXHJcbiAgLy8gIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXHJcbiAgICBmbGV4OiAzLFxyXG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXHJcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCJcclxuXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVzc2FnZXMoe1xyXG4gIG1lc3NhZ2VzLFxyXG4gIG9uTWVzc2FnZSxcclxuICBvbk1lc3NhZ2VUZXh0LFxyXG4gIG1lc3NhZ2VUZXh0LFxyXG4gIHVzZXJuYW1lLFxyXG4gIGhhbmdvdXQsXHJcbiAgb25OYXZpZ2F0aW9uLFxyXG4gIGxvYWRpbmdcclxufSkge1xyXG4gIGNvbnN0IHNjcm9sbGVyUmVmID0gdXNlUmVmKG51bGwpO1xyXG5jb25zdCB7ZGV2aWNlfT11c2VNZWRpYVF1ZXJ5KClcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChtZXNzYWdlcykge1xyXG4gICAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH0sIFttZXNzYWdlc10pO1xyXG5cclxuICBmdW5jdGlvbiBvblNlbmQoZSkge1xyXG4gICAgb25NZXNzYWdlKGUpO1xyXG4gICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3suLi5zdHlsZXMubWVzc2FnZUNvbnRhaW5lcixmbGV4OiBkZXZpY2U9PT0ncGhvbmUnPzQ6Mn19IHJlZj17c2Nyb2xsZXJSZWZ9PlxyXG4gICAgICAgIHttZXNzYWdlcyAmJiAgXHJcbiAgICAgICAgICBtZXNzYWdlcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXM6IHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pLCB1c2VybmFtZSB9KS5tYXAoXHJcbiAgICAgICAgICAgIChtKSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XHJcbiAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgeyFtLnR5cGUgJiYgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZXInICYmIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttfSAvPn1cclxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSAnYmxvY2tlZCcgJiYgPEJsb2NrZWRNZXNzYWdlIG1lc3NhZ2U9e219IG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufS8+fVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApfVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17e2ZsZXg6MX19PlxyXG4gICAgICAgIDxNZXNzYWdlRWRpdG9yXHJcbiAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxyXG4gICAgICAgICAgb25NZXNzYWdlPXtvblNlbmR9XHJcbiAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XHJcbiAgICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuZnVuY3Rpb24gZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzLCB1c2VybmFtZSB9KSB7XHJcbiAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgdXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5tYXAoKG1zZykgPT4ge1xyXG4gICAgICBpZiAobXNnLnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdyaWdodCcsIHVzZXJuYW1lOiAnbWUnIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ2xlZnQnIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2VzLnNvcnQoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgIE1lc3NhZ2VzICBmcm9tICcuL21lc3NhZ2VzJztcclxuaW1wb3J0IExheW91dCAgZnJvbSAnLi9MYXlvdXQnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdjaGF0KHtcclxuICBsb2FkaW5nLFxyXG4gIG1lc3NhZ2VzID0gW10sXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBvbk1lc3NhZ2UsXHJcbiAgbWVzc2FnZVRleHQsXHJcbiAgdXNlcm5hbWUsXHJcbiAgaGFuZ291dCxcclxuICBvbk5hdmlnYXRpb24sXHJcblxyXG59KSB7XHJcblxyXG4gIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgZG9jdW1lbnQudGl0bGU9aGFuZ291dC51c2VybmFtZVxyXG5cclxuICB9LFtdKVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImhhbmdjaGF0LXVpXCIgPlxyXG4gICAgICA8TWVzc2FnZXNcclxuICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XHJcbiAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XHJcbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XHJcbiAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICBtZXNzYWdlVGV4dCA9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgLz5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJ2ljb25zL01lc3NhZ2UnXHJcbmV4cG9ydCBmdW5jdGlvbiBJY29uc0RlbW8oKXtcclxuICAgIHJldHVybiA8ZGl2PlxyXG5cclxuICAgICAgICA8TWVzc2FnZSBjb3VudD17MX0vPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJleHBvcnQgY29uc3QgbWVzc2FnZXMgPVtcclxuICAgIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzE3ODk5NzEsXHJcbiAgfSxcclxuICAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYE9rIExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMyMTYzNDYyLFxyXG4gIH0se1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBIb3cgYXJlIHlvdSBkZW1vYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzYzNTcyMyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBhbGwgcmlnaHRgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjc3NTczLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYFllcyBJIGFtLiBIb3cgYXJlIHlvdWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDYsXHJcbiAgfSxcclxuICAsXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgZG9pbmcgZ3JlYXRlYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OCxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbl0iLCJleHBvcnQgZnVuY3Rpb24gcmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pe1xyXG4gICAgcmV0dXJuIHVucmVhZGhhbmdvdXRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gKGFjY3VtdWxhdG9yID0gW3sgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH1dKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3Qgb2JqID0gYWNjdW11bGF0b3IuZmluZChcclxuICAgICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWUgJiYgY3VycmVudC5zdGF0ZSA9PT0gJ01FU1NBTkdFUidcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYWNjdW11bGF0b3IuZmluZEluZGV4KFxyXG4gICAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XHJcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnNwbGljZShpbmRleCwgMSwge1xyXG4gICAgICAgICAgICAgIC4uLm9iaixcclxuICAgICAgICAgICAgICBtZXNzYWdlQ291bnQ6ICsrb2JqLm1lc3NhZ2VDb3VudCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHsgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgIH0sIFtdKTtcclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IExpc3QseyBMaXN0SXRlbSB9IGZyb20gJ2NvbnRyb2xzL2xpc3QnO1xyXG5pbXBvcnQge3JlZHVjZXJVbnJlYWRoYW5nb3V0c30gZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVucmVhZEhhbmdvdXRzKHsgdW5yZWFkaGFuZ291dHMsb25TZWxlY3RVbnJlYWQsb25SZW1vdmVVbnJlYWQgfSkge1xyXG5cclxuICBjb25zdCBbaXRlbXMsc2V0SXRlbXNdID11c2VTdGF0ZShbXSlcclxudXNlRWZmZWN0KCgpPT57XHJcbmlmKHVucmVhZGhhbmdvdXRzKXtcclxuXHJcbiAgY29uc3QgcmVkdWNlZCA9cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pXHJcbiBcclxuICBzZXRJdGVtcyhyZWR1Y2VkKVxyXG59XHJcblxyXG59LFt1bnJlYWRoYW5nb3V0c10pXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPSd1bnJlYWRoYW5nb3V0cycgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIHtpdGVtcyAmJlxyXG4gICAgICAgICAgaXRlbXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgaXRlbXMubWFwKCh1KSA9PiB7XHJcbiAgICAgICBcclxuICAgICAgICAgIHJldHVybiAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnfX0+XHJcbiAgICAgICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtvblNlbGVjdFVucmVhZH0gaWQ9e3UudXNlcm5hbWV9IHN0eWxlPXt7ZmxleDo1fX0gZGF0YS10ZXN0aWQ9e2Ake3UudXNlcm5hbWV9LXNlbGVjdGB9Pnt1LnVzZXJuYW1lfSBtZXNzYWdlczoge3UubWVzc2FnZUNvdW50fTwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtvblJlbW92ZVVucmVhZH0gaWQ9e3UudXNlcm5hbWV9IHN0eWxlPXt7Y29sb3I6J3JlZCd9fSBkYXRhLXRlc3RpZD17YCR7dS51c2VybmFtZX0tcmVtb3ZlYH0+eDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBVbnJlYWQgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9VbnJlYWRIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuY29uc3QgdW5yZWFkcyA9IFtcclxuICB7XHJcbiAgICB1c2VybmFtZTogJ2RlbW8nLFxyXG4gICAgc3RhdGU6ICdNRVNTQU5HRVInLFxyXG4gICAgbWVzc2FnZTogeyB0ZXh0OiAnSGVsbG8geW91JywgdGltZXN0YW1wOiAxNTkxODEwNDU4NjMwIH0sXHJcbiAgfSxcclxuXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdiZXJvJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5yZWFkRGVtbygpIHtcclxuICByZXR1cm4gPFVucmVhZCB1bnJlYWRoYW5nb3V0cz17cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0czp1bnJlYWRzfSl9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge0Jsb2NrZXJNZXNzYWdlfSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL0Jsb2NrZXJNZXNzYWdlJ1xyXG5cclxuY29uc3QgbWVzc2FnZSA9e3RleHQ6J1lvdSBjYW4gbm90IHNlbmQgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZCcsXHJcbnRpbWVzdGFtcDoxMjMyMyxcclxudXNlcm5hbWU6J2RlbW8nXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlRGVtbygpe1xyXG4gICAgcmV0dXJuIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfS8+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0JztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExvZ2luKHByb3BzKSB7XHJcbiAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkLGxvYWRpbmcsb25Mb2dpbixvbkNoYW5nZSx2YWxpZGF0aW9uLCBvbkZvcmdvdFBhc3N3b3JkIH0gPXByb3BzO1xyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7bWFyZ2luOjE1LCBwYWRkaW5nOjE2fX0+XHJcbiAgICAgIHtsb2FkaW5nICYmICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG48L2Rpdj59XHJcbiAgICAgICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgICAgIHZhbHVlPXtlbWFpbG9ydXNlcm5hbWV9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgICAgbGFiZWw9XCJFbWFpbCBvciB1c2VybmFtZVwiXHJcbiAgICAgICAgICAgIG5hbWU9J2VtYWlsb3J1c2VybmFtZSdcclxuICAgICAgICAgICAgdHlwZT0ndGV4dCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0VudGVyIGVtYWlsIG9yIHVzZXJuYW1lJ1xyXG4gICAgICAgICAgICBpZD0nZW1haWxPclVzZXJuYW1lJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWxPclVzZXJuYW1lJ1xyXG4gICAgICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2VtYWlsb3J1c2VybmFtZSddLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24mJiB2YWxpZGF0aW9uWydlbWFpbG9ydXNlcm5hbWUnXS5pc1ZhbGlkfVxyXG4gICAgICAgICAgICAvLyB2YWxpZGF0aW9uVHlwZXM9e1tcclxuICAgICAgICAgICAgLy8gICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgICAgIC8vICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIC8vICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgICAgICAvLyAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICAgICAgLy8gXX1cclxuICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2VudGVyIHBhc3N3b3JkJ1xyXG4gICAgICAgICAgICBpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiAgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG4gICAgICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10uaXNWYWxpZH1cclxuICAgICAgICAgICAgLy8gdmFsaWRhdGlvblR5cGVzPXtbXHJcbiAgICAgICAgICAgIC8vICAgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgICAgICAvLyAgIHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAvLyBdfVxyXG4gICAgICAgICAgLz5cclxuICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsanVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nfX0+XHJcblxyXG4gXHJcbiAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcclxuICAgICAgICAgICAgaWQ9J2xvZ2luLWJ0bidcclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9J2xvZ2luLWJ0bidcclxuICAgICAgICAgICAgb25DbGljaz17b25Mb2dpbn1cclxuICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICAgICAgdGl0bGU9XCJMb2dpblwiXHJcbiAgICAgICAgICAgIGJnPVwicHJpbWFyeVwiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICBcclxuICAgICAgICAgIDxCdXR0b24gb25DbGljaz17b25Gb3Jnb3RQYXNzd29yZH0gaWQ9J2ZvcmdvdHBhc3N3b3JkJyBkYXRhLXRlc3RpZD0nZm9yZ290cGFzc3dvcmQnIG91dGxpbmUgICBiZz1cInByaW1hcnlcIiB0aXRsZT1cIkZvcmdvdCBQYXNzd29yZCFcIi8+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgTG9naW4gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9Mb2dpbidcclxuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPXtlbWFpbG9ydXNlcm5hbWU6e2lzVmFsaWQ6dHJ1ZSxtZXNzYWdlOicuJ30scGFzc3dvcmQ6e2lzVmFsaWQ6dHJ1ZSxtZXNzYWdlOicuJ319XHJcbmNvbnN0IHZhbGlkYXRpb25FcnJvciA9e2VtYWlsb3J1c2VybmFtZTp7aXNWYWxpZDpmYWxzZSxtZXNzYWdlOidpbnZhbGlkIGNyZWRlbnRpYWxzJ30scGFzc3dvcmQ6e2lzVmFsaWQ6ZmFsc2UsbWVzc2FnZTonaW52YWxpZCBjcmVkZW50aWFscyd9fVxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpblN0YXRlcyAoKXtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPiBcclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj4gTG9naW4gVmFsaWRhdGlvbiBTdWNjZXNzPC9oNT5cclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICA8TG9naW4gZW1haWxvcnVzZXJuYW1lPVwidGVzdHVzZXJcIiBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSAvPlxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+IFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkxvZ2luIFZhbGlkYXRpb24gRXJyb3I8L2g1PlxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfSAvPlxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+IFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkxvZ2dpbmcgaW48L2g1PlxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxMb2dpbiBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IGxvYWRpbmcgLz5cclxuICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuXHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJ1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cChwcm9wcykge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCxsb2FkaW5nLG9uU2lnbnVwLG9uQ2hhbmdlLHZhbGlkYXRpb24gfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbjxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7bWFyZ2luOjE1LCBwYWRkaW5nOjE2fX0+XHJcbntsb2FkaW5nICYmICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG48L2Rpdj59XHJcbiAgICAgICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgICAgIGxhYmVsPVwiVXNlcm5hbWVcIlxyXG4gICAgICAgICAgICB2YWx1ZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgICAgdHlwZT0ndGV4dCdcclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9J3VzZXJuYW1lJ1xyXG4gICAgICAgICAgICBuYW1lPSd1c2VybmFtZSdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J3VzZXJuYW1lJ1xyXG4gICAgICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3VzZXJuYW1lJ10uaXNWYWxpZH1cclxuICAgICAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWyd1c2VybmFtZSddLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgIC8vIHZhbGlkYXRpb25UeXBlcz17W1xyXG4gICAgICAgICAgICAvLyAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICAgICAgLy8gICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgICAgIC8vICAgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgICAgICAvLyBdfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgICAgbGFiZWw9XCJFbWFpbFwiXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgICAgdmFsdWU9e2VtYWlsfVxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nZW1haWwnXHJcbiAgICAgICAgICAgIHR5cGU9J2VtYWlsJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWwnXHJcbiAgICAgICAgICAgIG5hbWU9J2VtYWlsJ1xyXG4gICAgICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2VtYWlsJ10uaXNWYWxpZH1cclxuICAgICAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgIC8vIHZhbGlkYXRpb25UeXBlcz17W1xyXG4gICAgICAgICAgICAvLyAgIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICAgICAgLy8gICB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBdfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgICAgbGFiZWw9XCJQYXNzd29yZFwiXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10uaXNWYWxpZH1cclxuICAgICAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydwYXNzd29yZCddLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgIC8vIHZhbGlkYXRpb25UeXBlcz17W3ZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTl19XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcclxuICAgICAgICAgICAgb25DbGljaz17b25TaWdudXB9XHJcbiAgICAgICAgICAgIGlkPSdzaWdudXAtYnRuJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInNpZ251cC1idG5cIlxyXG4gICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgICB0aXRsZT1cIlNpZ251cFwiXHJcbiAgICAgICAgICAgIGJnPVwicHJpbWFyeVwiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICBcclxuICAgICAgICAgIFxyXG4gIFxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgU2lnbnVwIGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvc2lnbnVwJ1xyXG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHsgdXNlcm5hbWU6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogJy4nIH0sIHBhc3N3b3JkOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6ICcuJyB9LCBlbWFpbDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiAnLicgfSB9XHJcbmNvbnN0IHZhbGlkYXRpb25FcnJvciA9IHsgdXNlcm5hbWU6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdVc2VybmFtZSBpcyBub3QgdmFsaWQnIH0sIHBhc3N3b3JkOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnUGFzd29yZCBpcyBub3QgdmFsaWQnIH0sIGVtYWlsOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnRW1haWwgaXMgbm90IHZhbGlkJyB9IH1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2lnbnVwU3RhdGVzKCkge1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2lnbnVwIFZhbGlkYXRpb24gU3VjY2VzczwvaDU+XHJcbiAgICAgICAgICAgICAgICA8U2lnbnVwIHVzZXJuYW1lPVwidGVzdHVzZXJcIiBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIiB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gLz5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlNpZ251cCBWYWxpZGF0aW9uIEVycm9yPC9oNT5cclxuICAgICAgICAgICAgICAgIDxTaWdudXAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25FcnJvcn0gLz5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5TaWduaW5nIHVwPC9oNT5cclxuICAgICAgICAgICAgICAgIDxTaWdudXAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiIGVtYWlsPVwidGVzdEBnbWFpbC5jb21cIiBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfWxvYWRpbmcgLz5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XHJcbmltcG9ydCBBdXRoQWRhcHRlciBmcm9tICcuL0F1dGhBZGFwdGVyJ1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XHJcbiAgICAgIDxBdXRoQWRhcHRlciBzdGF0ZT17c3RhdGV9IGRpc3BhdGNoPXtkaXNwYXRjaH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgPC9BdXRoQWRhcHRlcj5cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG4vL2ltcG9ydCAnLi9jc3Mvc3R5bGUuc2Nzcyc7XHJcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcblxyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcblxyXG5cclxuXHJcblxyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uL3N0YXRlL3VzZVVzZXJOYW1lJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQocHJvcHMpIHtcclxuICBcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgdmFsaWRhdGlvbixvbkNoYW5nZSwgb25QYXNzd29yZENoYW5nZSxsb2FkaW5nIH0gPSBwcm9wcztcclxuXHJcbiAgLy8gdXNlRWZmZWN0KCgpID0+IHtcclxuICAvLyAgIGxldCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAvLyAgIHZhciB1cmx0b2tlbiA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KCd0b2tlbicpO1xyXG5cclxuICAvLyAgIGlmICh1cmx0b2tlbikge1xyXG4gIC8vICAgICBkaXNwYXRjaChhY3Rpb25zLmdldFRva2VuRnJvbVVybCh7IHRva2VuOiB1cmx0b2tlbiB9KSk7XHJcbiAgLy8gICB9XHJcbiAgLy8gfSwgW10pO1xyXG5cclxuXHJcblxyXG5cclxuIFxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIiBzdHlsZT17e21hcmdpbjoxNSwgcGFkZGluZzoxNn19PlxyXG4gICAgICB7bG9hZGluZyAmJiAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjEwMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIj48L2Rpdj5cclxuPC9kaXY+fVxyXG4gICAgICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgICAgbGFiZWw9XCJQYXNzd29yZFwiXHJcbiAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cclxuICAgICAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIGlkPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgbmFtZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdFbnRlciBuZXcgcGFzc3dvcmQnXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydwYXNzd29yZCddLmlzVmFsaWR9XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10ubWVzc2FnZX1cclxuICAgICAgICAgIC8vICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT05dfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgIGxhYmVsPVwiQ29uZmlybVwiXHJcbiAgICAgICAgICAgIHZhbHVlPXtjb25maXJtfVxyXG4gICAgICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgaWQ9J2NvbmZpcm0nXHJcbiAgICAgICAgICAgIG5hbWU9J2NvbmZpcm0nXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdDb25maXJtIG5ldyBwYXNzd29yZCdcclxuICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2NvbmZpcm0nXS5pc1ZhbGlkfVxyXG4gICAgICAgICAgICBtZXNzYWdlID17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydjb25maXJtJ10ubWVzc2FnZX1cclxuICAgICAgICAgLy8gICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT05dfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nY2hhbmdlLXBhc3MtYnRuJ1xyXG4gICAgICAgICAgICBvbkNsaWNrPXtvblBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB0aXRsZT1cIkNoYW5nZVwiIGJnPVwicHJpbWFyeVwiLz5cclxuICAgIDwvZGl2PlxyXG4gICBcclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgQ2hhbmdlUGFzc3dvcmQgZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9DaGFuZ2VQYXNzd29yZCdcclxuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPXtwYXNzd29yZDp7aXNWYWxpZDp0cnVlLG1lc3NhZ2U6Jy4nfSxjb25maXJtOntpc1ZhbGlkOnRydWUsbWVzc2FnZTonLid9fVxyXG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPXtwYXNzd29yZDp7aXNWYWxpZDpmYWxzZSxtZXNzYWdlOidpbnZhbGlkIHBhc3N3b3JkIGZvcm1hdCd9LGNvbmZpcm06e2lzVmFsaWQ6ZmFsc2UsbWVzc2FnZTonaW52YWxpZCBwYXNzd29yZCBmb3JtYXQnfX1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmRTdGF0ZXMgKCl7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID4gXHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+IENoYW5nZVBhc3N3b3JkIFZhbGlkYXRpb24gU3VjY2VzczwvaDU+XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPENoYW5nZVBhc3N3b3JkIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgY29uZmlybT1cIjEyMzQ1Njc4OVwiICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfSAvPlxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+IFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkNoYW5nZVBhc3N3b3JkIFZhbGlkYXRpb24gRXJyb3I8L2g1PlxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25FcnJvcn0gLz5cclxuICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgPiBcclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5DaGFuZ2VQYXNzd29yZCBpbiBwcm9ncmVzczwvaDU+XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPENoYW5nZVBhc3N3b3JkIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCIgY29uZmlybT1cIjEyMzQ1Njc4OVwiICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc30gbG9hZGluZyAvPlxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5cclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVxdWVzdFBhc3NDaGFuZ2UocHJvcHMpIHtcclxuICBjb25zdCB7IGVtYWlsLCB2YWxpZGF0aW9uLCBvblJlcXVlc3RQYXNzd29yZENoYW5nZSwgbG9hZGluZywgb25DaGFuZ2UgfSA9IHByb3BzXHJcblxyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICBsYWJlbD1cIkVtYWlsXCJcclxuICAgICAgICB2YWx1ZT17ZW1haWx9XHJcbiAgICAgICAgcGxhY2Vob2xkZXI9J2VtYWlsJ1xyXG4gICAgICAgIG5hbWU9J2VtYWlsJ1xyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICB0eXBlPSdlbWFpbCdcclxuICAgICAgICBpZD0nZW1haWwnXHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvLyB2YWxpZGF0aW9uVHlwZXM9e1tcclxuICAgICAgLy8gICB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIC8vICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAvLyBdfVxyXG4gICAgICAvPlxyXG4gICAgICA8QnV0dG9uXHJcblxyXG4gICAgICAgIHR5cGU9J2J1dHRvbidcclxuICAgICAgICBvbkNsaWNrPXtvblJlcXVlc3RQYXNzd29yZENoYW5nZX1cclxuICAgICAgICBkYXRhLXRlc3RpZD1cInJlcXVlc3RwYXNzY2hhbmdlLWJ0blwiXHJcbiAgICAgICAgdGl0bGU9XCJSZXF1ZXN0IHBhc3N3b3JkIGNoYW5nZVwiXHJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICBiZz1cInByaW1hcnlcIlxyXG5cclxuICAgICAgLz5cclxuXHJcblxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBGb3Jnb3RQYXNzd29yZCBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkJ1xyXG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9e2VtYWlsOntpc1ZhbGlkOnRydWUsbWVzc2FnZTonLid9fVxyXG5jb25zdCB2YWxpZGF0aW9uRXJyb3IgPXtlbWFpbDp7aXNWYWxpZDpmYWxzZSxtZXNzYWdlOidJbnZhbGlkIGVtYWlsIGZvcm1hdCd9fVxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGb3Jmb3RQYXNzd29yZFN0YXRlICgpe1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+IFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPiBGb3Jnb3RQYXNzd29yZCBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCBlbWFpbD1cInRlc3RAZ21haWwuY29tXCIgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IC8+XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiID4gXHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+Rm9yZ290UGFzc3dvcmQgVmFsaWRhdGlvbiBFcnJvcjwvaDU+XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPEZvcmdvdFBhc3N3b3JkICAgZW1haWw9XCJ0ZXN0Z21haWwuY29tXCIgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfSAvPlxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiA+IFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlJlcXVlc3QgUGFzc3dvcmQgQ2hhbmdlIGluIHByb2dyZXNzPC9oNT5cclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICA8Rm9yZ290UGFzc3dvcmQgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9IGxvYWRpbmcgLz5cclxuICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgTG9naW5TdGF0ZXMgZnJvbSAnLi9zdGF0ZXMvbG9naW4uc3RhdGVzJ1xyXG5pbXBvcnQgU2lnblVwU3RhdGVzIGZyb20gJy4vc3RhdGVzL3NpZ251cC5zdGF0ZXMnXHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZFN0YXRlcyBmcm9tICcuL3N0YXRlcy9jaGFuZ2UtcGFzc3dvcmQuc3RhdGVzJ1xyXG5pbXBvcnQgRm9yZ290UGFzc3dvcmRTdGF0ZXMgZnJvbSAnLi9zdGF0ZXMvZm9yZ290LXBhc3N3b3JkLnN0YXRlcydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aERlbW9Sb3V0ZXMoKSB7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9sb2dpblwiPlxyXG4gICAgICAgICAgICA8TG9naW5TdGF0ZXMgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9zaWdudXBcIj5cclxuICAgICAgICAgICAgPFNpZ25VcFN0YXRlcyAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+LFxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2NoYW5nZS1wYXNzd29yZFwiPlxyXG4gICAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmRTdGF0ZXMgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPixcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9mb3Jnb3QtcGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgPEZvcmdvdFBhc3N3b3JkU3RhdGVzIC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgIF1cclxufSIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbidcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uRGVtbyAoKXtcclxuXHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZSA9e3tkaXNwbGF5OidmbGV4JywgZmxleERpcmVjdGlvbjonY29sdW1uJyx3aWR0aDonMTAwJScsIGFsaWduSXRlbXM6J2NlbnRlcicsYmFja2dyb3VuZENvbG9yOid5ZWxsb3cnfX0+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICA8aDM+RmlsbGVkIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCI+UHJpbWFyeTwvQnV0dG9uPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIj5TZWNvbmRhcnk8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwic3VjY2Vzc1wiPlN1Y2Nlc3M8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFuZ2VyXCI+RGFuZ2VyPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIj5XYXJuaW5nPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImluZm9cIj5JbmZvPC9CdXR0b24+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImxpZ2h0XCI+TGlnaHQ8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiPkRhcms8L0J1dHRvbj5cclxuICAgICAgICA8QnV0dG9uIGJnPVwibGlua1wiPkxpbms8L0J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2ID5cclxuICAgICAgICAgICAgPGgzPk91dGxpbmVkIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgb3V0bGluZT17dHJ1ZX0gdGl0bGU9XCJQcmltYXJ5XCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiBvdXRsaW5lIHRpdGxlPVwiU2Vjb25kYXJ5XCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzdWNjZXNzXCIgb3V0bGluZSB0aXRsZT1cIlN1Y2Nlc3NcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cImRhbmdlclwiIG91dGxpbmUgdGl0bGU9XCJEYW5nZXJcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cIndhcm5pbmdcIiBvdXRsaW5lIHRpdGxlPVwiV2FybmluZ1wiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiaW5mb1wiIG91dGxpbmUgdGl0bGU9XCJJbmZvXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJsaWdodFwiIG91dGxpbmUgdGl0bGU9XCJMaWdodFwiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFya1wiIG91dGxpbmUgdGl0bGU9XCJEYXJrXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJsaW5rXCIgb3V0bGluZSB0aXRsZT1cIkxpbmtcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnfX0+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICA8aDM+U21hbGwgQnV0dG9uczwvaDM+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcInNpemU9XCJzbVwiIHRpdGxlPVwibGlua1wiLz5cclxuICAgICAgICA8QnV0dG9uIGJnPVwic2Vjb25kYXJ5XCIgc2l6ZT1cInNtXCIgdGl0bGU9XCJTZWNvbmRhcnlcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGgzPkxhcmdlIEJ1dHRvbnM8L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCJzaXplPVwibGdcIiB0aXRsZT1cIkxpbmtcIi8+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInNlY29uZGFyeVwiIHNpemU9XCJsZ1wiIHRpdGxlPVwiU2Vjb25kYXJ5XCIvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICBcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgIDxoMz4gRGlzYWJsZWQgQnV0dG9uczwvaDM+XHJcbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiBkaXNhYmxlZCAgdGl0bGU9XCJMaW5rXCIvPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiAgZGlzYWJsZWQgdGl0bGU9XCJTZWNvbmRhcnlcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgPGgzPiBTcGlubmluZyBCdXR0b248L2gzPlxyXG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgdGl0bGU9XCJTcGlubmluZ1wiIGxvYWRpbmcvPlxyXG4gICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdjb250cm9scy90ZXh0LWlucHV0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0U3RhdGVzKCkge1xyXG4gICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGg1PlZhbGlkYXRpb248L2g1PlxyXG4gICAgICAgIDxUZXh0SW5wdXQgaXNWYWxpZD17dHJ1ZX0gLz5cclxuICAgICAgICA8VGV4dElucHV0IGlzVmFsaWQ9e2ZhbHNlfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgXHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJ1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJy4vdGV4dC1pbnB1dCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29tcG9uZW50c1JvdXRlKCl7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9idXR0b25cIj5cclxuICAgICAgICA8QnV0dG9uLz5cclxuICAgICAgPC9BcHBSb3V0ZT4sXHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL3RleHQtaW5wdXRcIj5cclxuICAgICAgPFRleHRJbnB1dC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICBdXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyBBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IEhhbmdvdXQgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9IYW5nb3V0JztcclxuaW1wb3J0IEJsb2NrIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2snO1xyXG5pbXBvcnQgQmxvY2tlZCBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrZWQnO1xyXG5pbXBvcnQgQ29uZmlndXJlIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQ29uZmlndXJlJztcclxuaW1wb3J0IEludml0ZSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZSc7XHJcbmltcG9ydCBJbnZpdGVlIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlZSc7XHJcbmltcG9ydCBJbnZpdGVyIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlcic7XHJcbmltcG9ydCBIYW5nY2hhdCBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdjaGF0JztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvTWVzc2FnZSc7XHJcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJ2ljb25zL29ubGluZVN0YXR1cyc7XHJcbmltcG9ydCB7IEljb25zRGVtbyB9IGZyb20gJy4vSWNvbnNEZW1vJ1xyXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcclxuaW1wb3J0IHsgVW5yZWFkRGVtbyB9IGZyb20gJy4vVXJlYWREZW1vJ1xyXG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZURlbW8gfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlRGVtbydcclxuaW1wb3J0IEF1dGhEZW1vUm91dGVzIGZyb20gJy4vYXV0aGVudGljYXRpb24vcm91dGUnXHJcbmltcG9ydCBDb21wb25lbnRzUm91dGVzIGZyb20gJy4vY29tcG9uZW50cy9yb3V0ZSdcclxuY29uc3QgaGFuZ291dHMgPSBbXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJvbmUnIH0sXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJ0aHJlZScgfSxcclxuXTtcclxuY29uc3QgaGFuZ291dCA9IHtcclxuICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcclxuICBlbWFpbDogJ3Rlc3RAZ21haWwuY29tJyxcclxuICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXHJcbn07XHJcbmNvbnN0IG1lc3NhZ2UgPSB7XHJcbiAgdXNlcm5hbWU6ICdicmVubycsXHJcbiAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gIHRpbWVzdGFtcDogMTU5MTMzMTc2NzgzNixcclxufTtcclxuLy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0b3J5Ym9va1JvdXRlcygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDB2aCd9fT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8SGFuZ291dCBoYW5nb3V0cz17aGFuZ291dHN9IC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrXCI+XHJcbiAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZWRcIj5cclxuICAgICAgICA8QmxvY2tlZCBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cclxuICAgICAgICA8Q29uZmlndXJlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZVwiPlxyXG4gICAgICAgIDxJbnZpdGUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlZVwiPlxyXG4gICAgICAgIDxJbnZpdGVlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZXJcIj5cclxuICAgICAgICA8SW52aXRlciBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nY2hhdFwiPlxyXG4gICAgICAgIDxIYW5nY2hhdCBoYW5nb3V0PXtoYW5nb3V0fSBtZXNzYWdlcz17bWVzc2FnZXN9IHVzZXJuYW1lPVwiZGVtb1wiIC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VcIj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IDIwLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZWVlZWVlZScgfX0+XHJcbiAgICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfSB1c2VybmFtZT17aGFuZ291dC51c2VybmFtZX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvb25saW5lXCI+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxPbmxpbmVTdGF0dXMgb25saW5lIC8+XHJcbiAgICAgICAgICA8T25saW5lU3RhdHVzIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VzXCI+XHJcbiAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvdW5yZWFkXCI+XHJcbiAgICAgICAgPFVucmVhZERlbW8gLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tlci1tZXNzYWdlXCI+XHJcbiAgICAgICAgPEJsb2NrZXJNZXNzYWdlRGVtbyAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaWNvbnNcIj5cclxuICAgICAgICA8SWNvbnNEZW1vIC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBdXRoRGVtb1JvdXRlcy8+XHJcbiAgICAgIDxDb21wb25lbnRzUm91dGVzLz5cclxuICAgIDwvZGl2PlxyXG5cclxuICApXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdmJhcihwcm9wcykge1xyXG4gICAgY29uc3QgeyBiZyA9ICdsaWdodCcsIGJyYW5kLCBjaGlsZHJlbiB9ID0gcHJvcHNcclxuICAgIHJldHVybiA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciBuYXZiYXItZXhwYW5kLWxnIG5hdmJhci0ke2JnfSBiZy0ke2JnfWB9PlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIjXCI+e2JyYW5kfTwvYT5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCIgYXJpYS1jb250cm9scz1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiVG9nZ2xlIG5hdmlnYXRpb25cIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXItaWNvblwiPjwvc3Bhbj5cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgIFxyXG4gICAgPC9uYXY+XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyQ29sbGFwc2Uoe2NoaWxkcmVufSl7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyTmF2KHsgY2hpbGRyZW4gfSkge1xyXG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1yLWF1dG9cIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L3VsPlxyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHsgY2hpbGRyZW4gfSkge1xyXG4gIFxyXG4gICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPntjaGlsZHJlbn08L2xpPlxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkxpbmsocHJvcHMpIHtcclxuICAgIGNvbnN0IHthcHBSb3V0ZX09cHJvcHNcclxuICAgIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOmAvJHtpZH1gLHJvdXRlOmFwcFJvdXRlfSlcclxuICAgICAgfVxyXG4gICAgcmV0dXJuIDxhIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgaHJlZj1cIiNcIiB7Li4ucHJvcHN9IG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSAvPlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdkRyb3Bkb3duKHsgdGl0bGUsY2hpbGRyZW4gfSkge1xyXG4gICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbSBkcm9wZG93blwiPlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdi1saW5rIGRyb3Bkb3duLXRvZ2dsZVwiIGhyZWY9XCIjXCIgaWQ9XCJuYXZiYXJEcm9wZG93blwiIHJvbGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2xpPlxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERyb3Bkb3duTWVudShwcm9wcykge1xyXG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHNcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJuYXZiYXJEcm9wZG93blwiPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRHJvcGRvd25JdGVtIChwcm9wcyl7XHJcbiAgICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTonLycscm91dGU6YC8ke2lkfWB9KVxyXG4gICAgICB9XHJcbiAgICByZXR1cm4gICAgPGEgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCIjXCIgey4uLnByb3BzfSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0vPlxyXG59IiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IFN0b3J5Ym9va1Byb3ZpZGVycyBmcm9tICcuL1N0b3J5Ym9va1Byb3ZpZGVycydcclxuaW1wb3J0IFN0b3J5Ym9va1JvdXRlcyBmcm9tICcuL1N0b3J5Ym9va1JvdXRlcydcclxuaW1wb3J0IE5hdmJhciwgeyBOYXZCYXJOYXYsIE5hdkl0ZW0sIE5hdkxpbmssIE5hdkJhckNvbGxhcHNlIH0gZnJvbSAnY29tcG9uZW50cy9uYXYtYmFyJ1xyXG5pbXBvcnQgTmF2RHJvcGRvd24sIHsgRHJvcGRvd25NZW51LCBEcm9wZG93bkl0ZW0gfSBmcm9tICdjb21wb25lbnRzL25hdi1iYXIvbmF2LWRyb3Bkb3duJ1xyXG5cclxucmVuZGVyKFxyXG4gIDxTdG9yeWJvb2tQcm92aWRlcnM+XHJcbiAgICA8TmF2YmFyIGJyYW5kPVwiU3Rvcnlib29rXCIgYmc9XCJkYXJrXCI+XHJcbiAgICAgIDxOYXZCYXJDb2xsYXBzZT5cclxuICAgICAgICA8TmF2QmFyTmF2PlxyXG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiQ29tcG9uZW50c1wiPlxyXG4gICAgICAgICAgICA8RHJvcGRvd25NZW51PlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJidXR0b25cIj5CdXR0b25zPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cInRleHQtaW5wdXRcIj5UZXh0SW5wdXQ8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgPC9Ecm9wZG93bk1lbnU+XHJcbiAgICAgICAgICA8L05hdkRyb3Bkb3duPlxyXG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiQXV0aGVudGljYXRpb25cIj5cclxuICAgICAgICAgICAgPERyb3Bkb3duTWVudT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwibG9naW5cIj5Mb2dpbjwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJzaWdudXBcIj5TaWdudXA8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiY2hhbmdlLXBhc3N3b3JkXCI+Q2hhbmdlIFBhc3N3b3JkPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImZvcmdvdC1wYXNzd29yZFwiPkZvcmdvdCBQYXNzd29yZDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICA8L0Ryb3Bkb3duTWVudT5cclxuICAgICAgICAgIDwvTmF2RHJvcGRvd24+XHJcbiAgICAgICAgPC9OYXZCYXJOYXY+XHJcbiAgICAgIDwvTmF2QmFyQ29sbGFwc2U+XHJcbiAgICA8L05hdmJhcj5cclxuICAgIDxTdG9yeWJvb2tSb3V0ZXMgLz5cclxuICA8L1N0b3J5Ym9va1Byb3ZpZGVycz5cclxuXHJcbiAgLFxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwidXNlQXBwUm91dGUiLCJkaXNwYXRjaCIsIm5hbWUiLCJvbkFwcFJvdXRlIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJBcHBSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJmaW5kIiwiQXBwUm91dGVQcm92aWRlciIsImluaXRTdGF0ZSIsInVzZVJlZHVjZXIiLCJ1c2VFZmZlY3QiLCJnZXRJdGVtIiwicGFyc2UiLCJ2YWx1ZSIsInVzZU1lbW8iLCJBcHBQcm92aWRlcnMiLCJMaXN0IiwiTGlzdEl0ZW0iLCJUZXh0SW5wdXQiLCJsYWJlbCIsImlzVmFsaWQiLCJtZXNzYWdlIiwidW5kZWZpbmVkIiwiQnV0dG9uIiwidGl0bGUiLCJiZyIsIm91dGxpbmUiLCJzaXplIiwibG9hZGluZyIsInN0eWxlIiwiaW5wdXRDb250YWluZXIiLCJkaXNwbGF5IiwiYm9yZGVyIiwiaW5wdXQiLCJwYWRkaW5nIiwiZmxleCIsIkhhbmdvdXQiLCJoYW5nb3V0cyIsIm9uU2VhcmNoSW5wdXQiLCJvbkZldGNoSGFuZ291dHMiLCJvblNlbGVjdEhhbmdvdXQiLCJzZWFyY2giLCJoYW5kbGVIYW5nb3V0U2VsZWN0aW9uIiwiaWQiLCJ0YXJnZXQiLCJoYW5nb3V0IiwidXNlcm5hbWUiLCJsZW5ndGgiLCJtYXAiLCJzdHlsZXMiLCJyb290IiwiYmFja2dyb3VuZENvbG9yIiwiaGVpZ2h0IiwiTGF5b3V0IiwiY2hlY2tib3giLCJtYXJnaW5SaWdodCIsImNoZWNrYm94Um9vdCIsImFsaWduSXRlbXMiLCJsYXlvdXQiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJib3hTaXppbmciLCJwYWRkaW5nVG9wIiwiYnRuIiwiQmxvY2siLCJvbkNhbmNlbCIsIm9uQmxvY2siLCJvblJlcG9ydCIsIndpZHRoIiwiZmlsbCIsImNvbG9yIiwib25DbGljayIsIkNlbnRlciIsInRleHRBbGlnbiIsIkJsb2NrZWQiLCJvblVuYmxvY2siLCJvbkNsb3NlIiwiRGVsZXRlIiwiQXJjaGl2ZSIsImljb25CdG4iLCJtYXJnaW4iLCJidG5Db250YWluZXIiLCJidG5PayIsIkNvbmZpZ3VyZSIsIm9uRGVsZXRlIiwib25BcmNoaXZlIiwib25Ob3RpZmljYXRpb24iLCJvbkNvbnZlcnNhdGlvbkhpc3RvcnkiLCJvbk5hdmlnYXRpb24iLCJvbk9rIiwiSWNvbkJ1dHRvbiIsIkljb24iLCJDaGVja2JveCIsIm9uQ2hhbmdlIiwibWFyZ2luVG9wIiwiUGVyc29uQWRkSWNvbiIsIkludml0ZSIsIm9uSW52aXRlIiwib25NZXNzYWdlVGV4dCIsIm1lc3NhZ2VUZXh0IiwiUGVyc29uQWRkIiwiZW1haWwiLCJEb25lIiwiSW52aXRlZSIsInVzZU1lZGlhUXVlcnkiLCJzZXRXaWR0aCIsInVzZVN0YXRlIiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJmb250U2l6ZSIsIk1lc3NhZ2UiLCJmbG9hdCIsInRpbWVzdGFtcCIsImRheXMiLCJzZXREYXlzIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJzZXRJbnRlcnZhbCIsIm1hcmdpbkJvdHRvbSIsInRleHQiLCJwYWRkaW5nQm90dG9tIiwiSW52aXRlciIsIm9uQWNjZXB0Iiwib25EZWNsaW5lIiwibWFyZ2luTGVmdCIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0IiwiTWVzc2FnZUVkaXRvciIsIm9uTWVzc2FnZSIsIkJsb2NrZXJNZXNzYWdlIiwiQmxvY2tlZE1lc3NhZ2UiLCJoYW5kbGVOYXZpZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJtZXNzYWdlQ29udGFpbmVyIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtc2ciLCJzb3J0IiwiSGFuZ2NoYXQiLCJkb2N1bWVudCIsIk9ubGluZVN0YXR1cyIsInJlYWR5U3RhdGUiLCJJc09ubGluZSIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwiY291bnQiLCJJY29uc0RlbW8iLCJyZWR1Y2VyVW5yZWFkaGFuZ291dHMiLCJ1bnJlYWRoYW5nb3V0cyIsInJlZHVjZSIsImFjY3VtdWxhdG9yIiwiaW5kZXgiLCJtZXNzYWdlQ291bnQiLCJvYmoiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJwdXNoIiwiVW5yZWFkSGFuZ291dHMiLCJvblNlbGVjdFVucmVhZCIsIm9uUmVtb3ZlVW5yZWFkIiwiaXRlbXMiLCJzZXRJdGVtcyIsInJlZHVjZWQiLCJ1bnJlYWRzIiwiVW5yZWFkRGVtbyIsIlVucmVhZCIsIkJsb2NrZXJNZXNzYWdlRGVtbyIsIkxvZ2luIiwiZW1haWxvcnVzZXJuYW1lIiwicGFzc3dvcmQiLCJvbkxvZ2luIiwidmFsaWRhdGlvbiIsIm9uRm9yZ290UGFzc3dvcmQiLCJ2YWxpZGF0aW9uU3VjY2VzcyIsInZhbGlkYXRpb25FcnJvciIsIkxvZ2luU3RhdGVzIiwiU2lnbnVwIiwib25TaWdudXAiLCJTaWdudXBTdGF0ZXMiLCJBdXRoQ29udGV4dCIsIkNoYW5nZVBhc3N3b3JkIiwiY29uZmlybSIsIm9uUGFzc3dvcmRDaGFuZ2UiLCJDaGFuZ2VQYXNzd29yZFN0YXRlcyIsIlJlcXVlc3RQYXNzQ2hhbmdlIiwib25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UiLCJGb3Jmb3RQYXNzd29yZFN0YXRlIiwiRm9yZ290UGFzc3dvcmQiLCJBdXRoRGVtb1JvdXRlcyIsIlNpZ25VcFN0YXRlcyIsIkZvcmdvdFBhc3N3b3JkU3RhdGVzIiwiQnV0dG9uRGVtbyIsIlRleHRJbnB1dFN0YXRlcyIsIkNvbXBvbmVudHNSb3V0ZSIsIlN0b3J5Ym9va1JvdXRlcyIsIkNvbXBvbmVudHNSb3V0ZXMiLCJOYXZiYXIiLCJicmFuZCIsIk5hdkJhckNvbGxhcHNlIiwiTmF2QmFyTmF2IiwiTmF2RHJvcGRvd24iLCJEcm9wZG93bk1lbnUiLCJEcm9wZG93bkl0ZW0iLCJoYW5kbGVSb3V0ZSIsInJlbmRlciIsIlN0b3J5Ym9va1Byb3ZpZGVycyIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFHLElBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsOERBQThELFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1L1IsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXlFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUF1RyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENB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
