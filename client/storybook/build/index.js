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
  APP_ROUTE_CHANGED: 'APP_ROUTE_CHANGED',
  FEATURE_ROUTE_CHANGED: 'FEATURE_ROUTE_CHANGED'
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

  function onAppRoute({
    route,
    featureRoute
  }) {
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
  const value = s$1(() => [state, dispatch], [state]);
  return h(AppRouteContext.Provider, _extends({
    value: value
  }, props));
}

function Navigation(props) {
  const {
    children,
    drawerContent
  } = props;
  return h("div", null, h("h1", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: 5
    }
  }, "Storybook"), h("div", {
    style: {
      display: 'flex'
    }
  }, h("div", {
    style: {
      flex: 1
    }
  }, drawerContent), h("div", {
    style: {
      flex: 10
    }
  }, children)));
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".drawer-list-item:hover {\r\n  background-color: #f5f5f5;\r\n  cursor: pointer;\r\n}\r\n\r\n.drawer-list-item * {\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n}\r\n\r\n.btn {\r\n  padding: 6px 16px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  border: none;\r\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n  min-width: 64px;\r\n  font-weight: 500;\r\n  font-size: 0.875rem;\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}";
styleInject(css_248z);

function List({
  children,
  id
}) {
  return h("div", {
    "data-testid": id,
    style: {
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      paddingTop: 8,
      paddingBottom: 8,
      width: '100%'
    }
  }, children);
}
function ListItem({
  children,
  onClick,
  id
}) {
  return h("div", {
    id: id,
    "data-testid": id,
    onClick: onClick,
    className: "drawer-list-item",
    style: {
      boxSizing: 'border-box',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      display: 'flex'
    }
  }, children);
}

const styles = {
  padding: 8,
  marginLeft: 16,
  marginRight: 16,
  marginTop: 8,
  marginBottom: 8,
  boxSizing: 'border-box',
  flex: 1
};
function TextInput(props) {
  const {
    id,
    type = 'text',
    style
  } = props;
  return h("div", {
    style: {
      display: 'flex',
      width: '100%'
    }
  }, h("input", _extends({
    style: { ...styles,
      ...style
    }
  }, props, {
    "data-testid": id,
    type: type
  })));
}

function Button(props) {
  const {
    title,
    style,
    id
  } = props;
  return h("button", _extends({
    className: "btn"
  }, props), title);
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
  onSearch,
  onSelectHangout,
  search,
  username,
  onStartSearch,
  dispatch
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

  return h("div", {
    style: {
      paddingTop: 68
    }
  }, h("div", {
    style: style.inputContainer
  }, h(TextInput, {
    value: search,
    id: "search-input",
    type: "search",
    onChange: onSearch,
    style: style.input
  }), h(Button, {
    "data-testid": "search-btn",
    disabled: !search,
    title: "search",
    onClick: onStartSearch
  })), h(List, {
    id: "hangouts-list"
  }, hangouts && hangouts.length > 0 && hangouts.map(g => {
    return h(ListItem, {
      id: g.username,
      onClick: handleHangoutSelection
    }, g.username);
  })));
}

const styles$1 = {
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
    style: { ...styles$1.root,
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
    title: "Cancel",
    style: style$1.btn,
    onClick: onCancel
  }), h(Button, {
    title: "Block",
    style: style$1.btn,
    id: "BLOCK",
    onClick: onBlock,
    "data-testid": "block-btn"
  })));
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
    title: "Close",
    style: style$2.btn,
    onClick: onClose
  }), h(Button, {
    id: "UNBLOCK",
    title: "Unblock",
    style: style$2.btn,
    onClick: onUnblock,
    "data-testid": "unblock-btn"
  })));
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
};
function Invite({
  hangout,
  onInvite,
  onMessageText,
  messageText,
  value
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
    title: "Send Invite",
    id: "INVITE",
    onClick: onInvite,
    "data-testid": "oninvite-btn"
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

const style$5 = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
};
function Invitee({
  hangout
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

var css_248z$1 = ".message-font-phone-size {\r\n  font-size: 13px;\r\n}\r\n\r\n.message-font-tablet-size {\r\n  font-size: 15px;\r\n}\r\n\r\n.font-font-laptop-size {\r\n  font-size: 20px;\r\n}\r\n\r\n.message-font-desktop-size {\r\n  font-size: 30px;\r\n}";
styleInject(css_248z$1);

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
    username
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
    setTimeout(() => {
      convertMS(Date.now() - message.timestamp);
    }, 0);
    setInterval(() => {
      convertMS(Date.now() - message.timestamp);
    }, 60000);
  }, []);
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
  }, username && username, ":"), h("div", null, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", ' '), days <= 10 && days > 1 && h("div", null, days, " days ago"), days > 10 && new Date(message.timestamp)))));
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
  onDecline
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
  }), h(Button, {
    id: "ACCEPT",
    onClick: onAccept,
    "data-testid": "accept-btn",
    title: "Accept",
    style: {
      flex: 1,
      marginLeft: 4,
      color: 'green'
    }
  }))));
}

const styles$2 = {
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    //margin:0
    padding: 5,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: 'border-box',
    flex: 1
  },
  btn: {
    padding: 8,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: 'border-box',
    flex: 1
  }
};
function MessageEditor({
  messageText,
  onMessageText,
  onMessage,
  hangout
}) {
  return h("div", {
    style: styles$2.root
  }, h("input", {
    style: styles$2.input,
    disabled: hangout && hangout.state === 'BLOCKED',
    type: "text",
    onChange: onMessageText,
    "data-testid": "message-input",
    value: messageText
  }), h("div", null, h(Button, {
    disabled: hangout && hangout.state === 'BLOCKED',
    style: styles$2.btn,
    title: "send",
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  })));
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

const styles$3 = {
  messageContainer: {
    // width: '100%',
    boxSizing: 'border-box',
    padding: 3,
    //  backgroundColor: 'orange',
    flex: 15,
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
  onNavigation
}) {
  const scrollerRef = y(null);
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
      flexDirection: 'column',
      paddingTop: 68
    }
  }, h("div", {
    style: styles$3.messageContainer,
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
  messages = [],
  onMessageText,
  onMessage,
  messageText,
  username,
  hangout,
  onNavigation
}) {
  return h(Layout, {
    id: "hangchat-ui"
  }, h(Messages, {
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

const ThemeContext = M();

function ThemeProvider(props) {
  const {
    initState
  } = props;
  const [state, setState] = v$1(initState);
  return h(ThemeContext.Provider, _extends({
    value: state
  }, props));
}

function DrawerContent({
  open
}) {
  const {
    onAppRoute
  } = useAppRoute();

  function handleRoute(e) {
    const {
      id
    } = e.target;
    onAppRoute({
      featureRoute: '/',
      route: `/${id}`
    });
  }

  return h("div", null, h(List, null, h(ListItem, {
    id: "hangouts",
    onClick: handleRoute
  }, "Hangouts"), h(ListItem, {
    id: "block",
    onClick: handleRoute
  }, "Block"), h(ListItem, {
    id: "blocked",
    onClick: handleRoute
  }, "Blocked"), h(ListItem, {
    id: "invite",
    onClick: handleRoute
  }, "Invite"), h(ListItem, {
    id: "invitee",
    onClick: handleRoute
  }, "Invitee"), h(ListItem, {
    id: "inviter",
    onClick: handleRoute
  }, "Inviter"), h(ListItem, {
    id: "hangchat",
    onClick: handleRoute
  }, "Hangchat"), h(ListItem, {
    id: "configure",
    onClick: handleRoute
  }, "Configure"), h(ListItem, {
    id: "message",
    onClick: handleRoute
  }, "Message"), h(ListItem, {
    id: "messages",
    onClick: handleRoute
  }, "Messages"), h(ListItem, {
    id: "online",
    onClick: handleRoute
  }, "onlineStatus"), h(ListItem, {
    id: "unread",
    onClick: handleRoute
  }, "Uread"), h(ListItem, {
    id: "blocker-message",
    onClick: handleRoute
  }, "BlockerMessage"), h(ListItem, {
    id: "icons",
    onClick: handleRoute
  }, "Icons")));
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
  onSelectUnread
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
    return h(ListItem, {
      onClick: onSelectUnread,
      id: u.username
    }, u.username, " messages: ", u.messageCount);
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

H(h(ThemeProvider, {
  initState: {
    primary: {
      background: '#6200EE',
      color: '#ffffff',
      fontFamily: 'Roboto, Helvetica, "Arial"'
    }
  }
}, h(AppRouteProvider, {
  initState: {
    featureRoute: '/',
    route: '/icons'
  }
}, h(Navigation, {
  drawerContent: h(DrawerContent, null)
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
}, h(IconsDemo, null))))), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXIuanMiLCIuLi9OYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uL2xheW91dC9OYXZMaXN0LmpzIiwiLi4vLi4vbGF5b3V0L1RleHRJbnB1dC5qcyIsIi4uLy4uL2xheW91dC9CdXR0b24uanMiLCIuLi8uLi9oYW5nb3V0cy9IYW5nb3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvTGF5b3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2suanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvQmxvY2suanMiLCIuLi8uLi9sYXlvdXQvQ2VudGVyLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2tlZC5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9QZXJzb25BZGQuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUuanMiLCIuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZXJNZXNzYWdlLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VkTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZXMuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9IYW5nY2hhdC5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi90aGVtZS90aGVtZS1jb250ZXh0LmpzIiwiLi4vRHJhd2VyQ29udGVudC5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9NZXNzYWdlLmpzIiwiLi4vSWNvbnNEZW1vLmpzIiwiLi4vZmFrZU1lc3NhZ2VzLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMuanMiLCIuLi8uLi9oYW5nb3V0cy9VbnJlYWRIYW5nb3V0cy5qcyIsIi4uL1VyZWFkRGVtby5qcyIsIi4uL0Jsb2NrZXJNZXNzYWdlRGVtby5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID17XHJcbiAgICBBUFBfUk9VVEVfQ0hBTkdFRDonQVBQX1JPVVRFX0NIQU5HRUQnLFxyXG4gICAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2aWdhdGlvbihwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIGRyYXdlckNvbnRlbnQgfSA9IHByb3BzO1xyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxoMSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgcGFkZGluZzogNSB9fT5cclxuICAgICAgICBTdG9yeWJvb2tcclxuICAgICAgPC9oMT5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxIH19PntkcmF3ZXJDb250ZW50fTwvZGl2PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMTAgfX0+e2NoaWxkcmVufTwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibmF2LWl0ZW1cIj57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTGlzdCh7IGNoaWxkcmVuLCBpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcclxuXHJcbiAgICAgICAgcGFkZGluZ1RvcDogOCxcclxuICAgICAgICBwYWRkaW5nQm90dG9tOiA4LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMaXN0SXRlbSh7IGNoaWxkcmVuLCBvbkNsaWNrLCBpZCB9KSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIGlkPXtpZH1cclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBjbGFzc05hbWU9J2RyYXdlci1saXN0LWl0ZW0nXHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgcGFkZGluZ0xlZnQ6IDE2LFxyXG4gICAgICAgIHBhZGRpbmdSaWdodDogMTYsXHJcbiAgICAgICAgcGFkZGluZ1RvcDogOCxcclxuICAgICAgICBwYWRkaW5nQm90dG9tOiA4LFxyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBwYWRkaW5nOiA4LFxyXG4gIG1hcmdpbkxlZnQ6IDE2LFxyXG4gIG1hcmdpblJpZ2h0OiAxNixcclxuICBtYXJnaW5Ub3A6IDgsXHJcbiAgbWFyZ2luQm90dG9tOiA4LFxyXG4gIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gIGZsZXg6IDEsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBpZCwgdHlwZSA9ICd0ZXh0JyxzdHlsZSB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCB3aWR0aDogJzEwMCUnIH19PlxyXG4gICAgICA8aW5wdXQgIHN0eWxlPXt7Li4uc3R5bGVzLC4uLnN0eWxlfX0gey4uLnByb3BzfSBkYXRhLXRlc3RpZD17aWR9IHR5cGU9e3R5cGV9IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xyXG4gIGNvbnN0IHsgdGl0bGUsc3R5bGUsaWQgfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIHsuLi5wcm9wc30+XHJcbiAgICAgIHt0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xyXG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi9sYXlvdXQvVGV4dElucHV0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vbGF5b3V0L0J1dHRvbic7XHJcbmltcG9ydCB7dXNlQXBwUm91dGV9ZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCB7c2F2ZU1lc3NhZ2V9ZnJvbSAnLi9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnXHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpbnB1dENvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYm9yZGVyOiAnIzczNzM3MyBzb2xpZCAxcHgnLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIHBhZGRpbmc6IDEwLFxyXG4gICAgZmxleDogMSxcclxuICAgIGJvcmRlcjogJ3doaXRlJyxcclxuICBcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dCh7XHJcbiAgaGFuZ291dHMsXHJcbiAgb25TZWFyY2gsXHJcbiAgb25TZWxlY3RIYW5nb3V0LFxyXG4gIHNlYXJjaCxcclxuICB1c2VybmFtZSxcclxuICBvblN0YXJ0U2VhcmNoLFxyXG4gIGRpc3BhdGNoXHJcbn0pIHtcclxuICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRTZWxlY3Rpb24oZSl7XHJcbiAgICBjb25zdCBpZCA9ZS50YXJnZXQuaWRcclxuICAgIG9uU2VsZWN0SGFuZ291dChlKVxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoZz0+IGcudXNlcm5hbWU9PT1pZClcclxuICBcclxuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTpgLyR7aGFuZ291dC5zdGF0ZX1gLHJvdXRlOicvaGFuZ291dHMnfSlcclxuICB9XHJcbiAgcmV0dXJuIChcclxuIFxyXG4gICAgPGRpdiBzdHlsZT17eyAgcGFkZGluZ1RvcDo2OH19PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pbnB1dENvbnRhaW5lcn0+XHJcbiAgICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgICAgdmFsdWU9e3NlYXJjaH1cclxuICAgICAgICAgIGlkPVwic2VhcmNoLWlucHV0XCJcclxuICAgICAgICAgIHR5cGU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgb25DaGFuZ2U9e29uU2VhcmNofVxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLmlucHV0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2gtYnRuXCJcclxuICAgICAgICAgIGRpc2FibGVkPXshc2VhcmNofVxyXG4gICAgICAgICAgdGl0bGU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgb25DbGljaz17b25TdGFydFNlYXJjaH1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxMaXN0IGlkPVwiaGFuZ291dHMtbGlzdFwiPlxyXG4gICAgICAgIHtoYW5nb3V0cyAmJlxyXG4gICAgICAgICAgaGFuZ291dHMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgPExpc3RJdGVtIGlkPXtnLnVzZXJuYW1lfSBvbkNsaWNrPXtoYW5kbGVIYW5nb3V0U2VsZWN0aW9ufT5cclxuICAgICAgICAgICAgICAgIHtnLnVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KX1cclxuICAgICAgPC9MaXN0PlxyXG4gICBcclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICByb290OiB7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZWVlZWVlJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBMYXlvdXQoeyBjaGlsZHJlbiwgc3R5bGUsIGlkIH0pIHtcclxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17aWR9IHN0eWxlPXt7IC4uLnN0eWxlcy5yb290LCAuLi5zdHlsZSB9fT57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGNoZWNrYm94OiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgY2hlY2tib3hSb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgIHBhZGRpbmc6IDE2LFxyXG4gIH0sXHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZ1RvcDo2OFxyXG4gIH0sXHJcbiAgYnRuOiB7XHJcbiAgICBmbGV4OiAxLFxyXG4gICAgbWFyZ2luUmlnaHQ6IDQsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgb25DYW5jZWwsIG9uQmxvY2ssIG9uUmVwb3J0IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY2hlY2tib3hSb290fT5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XHJcbiAgICAgICAgPGxhYmVsPlJlcG9ydDwvbGFiZWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQ2FuY2VsXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DYW5jZWx9IC8+XHJcbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gaWQ9XCJCTE9DS1wiIG9uQ2xpY2s9e29uQmxvY2t9IGRhdGEtdGVzdGlkPVwiYmxvY2stYnRuXCIgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2soe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgb25DbGljayxcclxuICBpZCxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGhlaWdodD17aGVpZ2h0fVxyXG4gICAgICB2aWV3Qm94PScwIDAgMjQgMjQnXHJcbiAgICAgIHdpZHRoPXt3aWR0aH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgaWQ9e2lkfVxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSBpZD17aWR9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgaWQ9e2lkfVxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek00IDEyYzAtNC40MiAzLjU4LTggOC04IDEuODUgMCAzLjU1LjYzIDQuOSAxLjY5TDUuNjkgMTYuOUM0LjYzIDE1LjU1IDQgMTMuODUgNCAxMnptOCA4Yy0xLjg1IDAtMy41NS0uNjMtNC45LTEuNjlMMTguMzEgNy4xQzE5LjM3IDguNDUgMjAgMTAuMTUgMjAgMTJjMCA0LjQyLTMuNTggOC04IDh6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIENlbnRlcih7IGNoaWxkcmVuLCBzdHlsZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgLi4uc3R5bGUsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0Jsb2NrJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL0xheW91dCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nVG9wOjY4XHJcbiAgfSxcclxuICBidG46IHtcclxuICAgIGZsZXg6IDEsXHJcbiAgICBtYXJnaW5SaWdodDogNCxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2tlZCh7IGhhbmdvdXQsIG9uVW5ibG9jaywgb25DbG9zZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJibG9ja2VkLXVpXCI+XHJcbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxyXG4gICAgICAgIDxCbG9jayB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cInJlZFwiIC8+XHJcbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcclxuICAgICAgPC9DZW50ZXI+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQ2xvc2VcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsb3NlfSAvPlxyXG4gICAgICAgIDxCdXR0b24gaWQ9J1VOQkxPQ0snIHRpdGxlPVwiVW5ibG9ja1wiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uVW5ibG9ja30gZGF0YS10ZXN0aWQ9J3VuYmxvY2stYnRuJy8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIERlbGV0ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHonXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFyY2hpdmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9ezI0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTIwLjU0IDUuMjNsLTEuMzktMS42OEMxOC44OCAzLjIxIDE4LjQ3IDMgMTggM0g2Yy0uNDcgMC0uODguMjEtMS4xNi41NUwzLjQ2IDUuMjNDMy4xNyA1LjU3IDMgNi4wMiAzIDYuNVYxOWMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjYuNWMwLS40OC0uMTctLjkzLS40Ni0xLjI3ek0xMiAxNy41TDYuNSAxMkgxMHYtMmg0djJoMy41TDEyIDE3LjV6TTUuMTIgNWwuODEtMWgxMmwuOTQgMUg1LjEyeidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmltcG9ydCB7IERlbGV0ZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9EZWxldGUnO1xyXG5pbXBvcnQgeyBBcmNoaXZlIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0FyY2hpdmUnO1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9CbG9jayc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpY29uQnRuOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbjogOCB9LFxyXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGJ0bkNvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbiAgYnRuT2s6IHtcclxuICAgIG1hcmdpbjogOCxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xyXG4gIG9uQmxvY2ssXHJcbiAgb25EZWxldGUsXHJcbiAgb25BcmNoaXZlLFxyXG4gIG9uTm90aWZpY2F0aW9uLFxyXG4gIG9uQ29udmVyc2F0aW9uSGlzdG9yeSxcclxuICBvbk5hdmlnYXRpb24sXHJcbiAgb25PayxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XHJcbiAgICAgICAgPENoZWNrYm94XHJcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxociAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Db250YWluZXJ9PlxyXG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gaWQ9XCJiY2t1aVwiIHRpdGxlPVwiQmxvY2tcIiBJY29uPXtCbG9ja30gb25DbGljaz17b25OYXZpZ2F0aW9ufSAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bk9rfT5cclxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uT2t9Pk9LPC9CdXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gSWNvbkJ1dHRvbih7IEljb24sIHRpdGxlLCBvbkNsaWNrLGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUuaWNvbkJ0bn0+XHJcbiAgICAgIDxidXR0b24gaWQ9e2lkfSBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsaWNrfSBkYXRhLXRlc3RpZD17YCR7aWR9LWJ0bmB9PlxyXG4gICAgICAgIDxJY29uIGlkPXtpZH0vPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGRpdj57dGl0bGV9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDaGVja2JveCh7IGxhYmVsLCBvbkNoYW5nZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiA4LCBtYXJnaW5Ub3A6IDggfX0+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XHJcbiAgICAgIDxsYWJlbD57bGFiZWx9PC9sYWJlbD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnd2hpdGUnLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBQZXJzb25BZGQgZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL1BlcnNvbkFkZCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2xheW91dC9UZXh0SW5wdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZSh7IGhhbmdvdXQsIG9uSW52aXRlLCBvbk1lc3NhZ2VUZXh0LG1lc3NhZ2VUZXh0LCB2YWx1ZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH1pZD1cImludml0ZS11aVwiPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxQZXJzb25BZGQgY29sb3I9XCJncmVlblwiIC8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIFN0YXJ0IENvbnZlcnNhdGlvbiB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPFRleHRJbnB1dCBpZD1cIm1lc3NhZ2VUZXh0SW5wdXRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gdmFsdWU9e21lc3NhZ2VUZXh0fSAvPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJTZW5kIEludml0ZVwiIGlkPVwiSU5WSVRFXCIgb25DbGljaz17b25JbnZpdGV9IGRhdGEtdGVzdGlkPSdvbmludml0ZS1idG4nIC8+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBEb25lKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J005IDE2LjJMNC44IDEybC0xLjQgMS40TDkgMTkgMjEgN2wtMS40LTEuNEw5IDE2LjJ6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgRG9uZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9Eb25lJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZWUoeyBoYW5nb3V0IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8RG9uZSB3aWR0aD1cIjcwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cImdyZWVuXCIgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPHA+XHJcbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxyXG4gICAgICAgICAgeW91ciBpbnZpdGlvbiBoYXMgYmVlbiBhY2NlcHRlZC5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgYm9yZGVyQ29sb3I6ICcjZWVlZWVlJyxcclxuICAgIGJvcmRlclN0eWxlOiAnc29saWQnLFxyXG4gICAgYm9yZGVyV2lkdGg6IDEsXHJcbiAgICBib3JkZXJSYWRpdXM6IDUsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgbWluSGVpZ2h0OiAzNSxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICB9LFxyXG4gIHVzZXJuYW1lOiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgbG9nOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBjb2xvcjogJyM3MzczNzMnLFxyXG4gICAgZm9udFNpemU6IDEwLFxyXG4gIH0sXHJcbiAgbWVzc2FnZToge30sXHJcbn07XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSB9ID0gbWVzc2FnZTtcclxuICBjb25zdCBbZGF5cywgc2V0RGF5c10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFttaW51dGVzLCBzZXRNaW51dGVzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtzZWNvbmRzLCBzZXRTZWNvbmRzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IHsgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XHJcbiAgICB2YXIgZCwgaCwgbSwgcztcclxuICAgIHMgPSBNYXRoLmZsb29yKG1zIC8gMTAwMCk7XHJcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xyXG4gICAgcyA9IHMgJSA2MDtcclxuICAgIGggPSBNYXRoLmZsb29yKG0gLyA2MCk7XHJcbiAgICBtID0gbSAlIDYwO1xyXG4gICAgZCA9IE1hdGguZmxvb3IoaCAvIDI0KTtcclxuICAgIGggPSBoICUgMjQ7XHJcbiAgICBzZXREYXlzKGQpO1xyXG4gICAgc2V0SG91cnMoaCk7XHJcbiAgICBzZXRNaW51dGVzKG0pO1xyXG4gICAgc2V0U2Vjb25kcyhzKTtcclxuICB9XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIG1lc3NhZ2UudGltZXN0YW1wKTtcclxuICAgIH0sIDApO1xyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIG1lc3NhZ2UudGltZXN0YW1wKTtcclxuICAgIH0sIDYwMDAwKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIG1hcmdpbkJvdHRvbTogMyB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VcIlxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2BtZXNzYWdlLWZvbnQtJHtkZXZpY2V9LXNpemVgfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5sb2d9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bWludXRlcyA9PT0gMCAmJiA8ZGl2Pk5vdzwvZGl2Pn1cclxuICAgICAgICAgICAge2hvdXJzID09PSAwICYmIG1pbnV0ZXMgPiAwICYmIDxkaXY+e21pbnV0ZXN9IG1pbnV0ZXMgYWdvIDwvZGl2Pn1cclxuICAgICAgICAgICAge2hvdXJzID4gMCAmJiBkYXlzID09PSAwICYmIChcclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge2hvdXJzfSBob3VycyB7bWludXRlc30gbWludXRlcyBhZ297JyAnfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICB7ZGF5cyA8PSAxMCAmJiBkYXlzID4gMSAmJiA8ZGl2PntkYXlzfSBkYXlzIGFnbzwvZGl2Pn1cclxuICAgICAgICAgICAge2RheXMgPiAxMCAmJiBuZXcgRGF0ZShtZXNzYWdlLnRpbWVzdGFtcCl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL21lc3NhZ2UtdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgcGFkZGluZ1RvcDogNzAsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBwYWRkaW5nQm90dG9tOjgsXHJcbiBcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlcih7IGhhbmdvdXQsIG9uQWNjZXB0LCBvbkRlY2xpbmUgfSkge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImludml0ZXItdWlcIj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUucm9vdH0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5MZWZ0OiA4LCBkaXNwbGF5OidmbGV4JyB9fT5cclxuICAgICAgICAgIHtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiAoXHJcbiAgICAgICAgICAgIDxNZXNzYWdlXHJcbiAgICAgICAgICAgICAgbWVzc2FnZT17XHJcbiAgICAgICAgICAgICAgICBoYW5nb3V0ICYmXHJcbiAgICAgICAgICAgICAgICBoYW5nb3V0Lm1lc3NhZ2UgJiYge1xyXG4gICAgICAgICAgICAgICAgICAuLi5oYW5nb3V0Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLGZsb2F0OidsZWZ0J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLHBhZGRpbmdMZWZ0OjgscGFkZGluZ1JpZ2h0OjggfX0+XHJcbiAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgIGlkPVwiREVDTElORVwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWNsaW5lLWJ0blwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwiRGVjbGluZVwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblJpZ2h0OiA0LCBjb2xvcjogJ3JlZCcgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgIGlkPVwiQUNDRVBUXCJcclxuICAgICAgICAgICAgb25DbGljaz17b25BY2NlcHR9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjZXB0LWJ0blwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luTGVmdDogNCwgY29sb3I6ICdncmVlbicgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgLy9tYXJnaW46MFxyXG4gICAgcGFkZGluZzogNSxcclxuICAgIG1hcmdpbkxlZnQ6IDgsXHJcbiAgICBtYXJnaW5SaWdodDogOCxcclxuICAgIG1hcmdpblRvcDogOCxcclxuICAgIG1hcmdpbkJvdHRvbTogOCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgZmxleDogMSxcclxuICAgIFxyXG4gIH0sXHJcbiAgYnRuOntcclxuICAgIHBhZGRpbmc6IDgsXHJcblxyXG4gICAgbWFyZ2luUmlnaHQ6IDE2LFxyXG4gICAgbWFyZ2luVG9wOiA4LFxyXG4gICAgbWFyZ2luQm90dG9tOiA4LFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gIH1cclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlLGhhbmdvdXQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XHJcbiAgICAgXHJcbiAgICAgIDxpbnB1dCBzdHlsZT17c3R5bGVzLmlucHV0fSBkaXNhYmxlZD17aGFuZ291dCAmJmhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCd9ICB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSAgZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWlucHV0XCIgdmFsdWU9e21lc3NhZ2VUZXh0fS8+XHJcbiAgICAgIFxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxCdXR0b24gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgc3R5bGU9e3N0eWxlcy5idG59ICB0aXRsZT1cInNlbmRcIiBpZD0nTUVTU0FHRScgb25DbGljaz17b25NZXNzYWdlfSBkYXRhLXRlc3RpZD0nc2VuZC1idG4nLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgZmxvYXQ6ICdyaWdodCcsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgZm9udFNpemU6IDE2LFxyXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VyTWVzc2FnZSh7IG1lc3NhZ2UgfSkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZXItbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9PC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlZE1lc3NhZ2UoeyBtZXNzYWdlLG9uTmF2aWdhdGlvbiB9KSB7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVOYXZpZ2F0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIG9uTmF2aWdhdGlvbihlKVxyXG4gICAgfVxyXG4gICAgZGVidWdnZXI7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlZC1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH1cclxuICAgIDxhIGlkPVwiVU5CTE9DS1wiIGRhdGEtdGVzdGlkPVwic2VlbW9yZS1idG5cIiBocmVmPVwiL1wiIG9uQ2xpY2s9e2hhbmRsZU5hdmlnYXRpb259PnNlZSBtb3JlPC9hPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9NZXNzYWdlJztcclxuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4vTWVzc2FnZUVkaXRvcic7XHJcbmltcG9ydCB7IEJsb2NrZXJNZXNzYWdlIH0gZnJvbSAnLi9CbG9ja2VyTWVzc2FnZSdcclxuaW1wb3J0IHtCbG9ja2VkTWVzc2FnZX0gZnJvbSAnLi9CbG9ja2VkTWVzc2FnZSdcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIG1lc3NhZ2VDb250YWluZXI6IHtcclxuICAgIC8vIHdpZHRoOiAnMTAwJScsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmc6IDMsXHJcbiAgLy8gIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXHJcbiAgICBmbGV4OiAxNSxcclxuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxyXG4gICAgb3ZlcmZsb3dYOiBcImhpZGRlblwiXHJcblxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlcyh7XHJcbiAgbWVzc2FnZXMsXHJcbiAgb25NZXNzYWdlLFxyXG4gIG9uTWVzc2FnZVRleHQsXHJcbiAgbWVzc2FnZVRleHQsXHJcbiAgdXNlcm5hbWUsXHJcbiAgaGFuZ291dCxcclxuICBvbk5hdmlnYXRpb25cclxufSkge1xyXG4gIGNvbnN0IHNjcm9sbGVyUmVmID0gdXNlUmVmKG51bGwpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XHJcbiAgICB9XHJcbiAgfSwgW21lc3NhZ2VzXSk7XHJcblxyXG4gIGZ1bmN0aW9uIG9uU2VuZChlKSB7XHJcbiAgICBvbk1lc3NhZ2UoZSk7XHJcbiAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBib3hTaXppbmc6ICdib3JkZXItYm94Jywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIHBhZGRpbmdUb3A6IDY4IH19PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMubWVzc2FnZUNvbnRhaW5lcn0gcmVmPXtzY3JvbGxlclJlZn0+XHJcbiAgICAgICAge21lc3NhZ2VzICYmXHJcbiAgICAgICAgICBtZXNzYWdlcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXM6IHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pLCB1c2VybmFtZSB9KS5tYXAoXHJcbiAgICAgICAgICAgIChtKSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XHJcbiAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgeyFtLnR5cGUgJiYgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZXInICYmIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttfSAvPn1cclxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSAnYmxvY2tlZCcgJiYgPEJsb2NrZWRNZXNzYWdlIG1lc3NhZ2U9e219IG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufS8+fVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApfVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxIH19PlxyXG4gICAgICAgIDxNZXNzYWdlRWRpdG9yXHJcbiAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxyXG4gICAgICAgICAgb25NZXNzYWdlPXtvblNlbmR9XHJcbiAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XHJcbiAgICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuZnVuY3Rpb24gZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzLCB1c2VybmFtZSB9KSB7XHJcbiAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgdXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5tYXAoKG1zZykgPT4ge1xyXG4gICAgICBpZiAobXNnLnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdyaWdodCcsIHVzZXJuYW1lOiAnbWUnIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ2xlZnQnIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2VzLnNvcnQoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBNZXNzYWdlcyB9IGZyb20gJy4uL21lc3NhZ2UtdWkvTWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL0xheW91dCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdjaGF0KHtcclxuICBtZXNzYWdlcyA9IFtdLFxyXG4gIG9uTWVzc2FnZVRleHQsXHJcbiAgb25NZXNzYWdlLFxyXG4gIG1lc3NhZ2VUZXh0LFxyXG4gIHVzZXJuYW1lLFxyXG4gIGhhbmdvdXQsXHJcbiAgb25OYXZpZ2F0aW9uXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImhhbmdjaGF0LXVpXCIgPlxyXG4gICAgICA8TWVzc2FnZXNcclxuICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XHJcbiAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XHJcbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XHJcbiAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICBtZXNzYWdlVGV4dCA9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgLz5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUaGVtZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggVGhlbWVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgXHJcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRTdGF0ZSk7XHJcblxyXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0LCBUaGVtZVByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcclxuXHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5leHBvcnQgZnVuY3Rpb24gRHJhd2VyQ29udGVudCh7IG9wZW4gfSkge1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOicvJyxyb3V0ZTpgLyR7aWR9YH0pXHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nb3V0c1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEhhbmdvdXRzXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEJsb2NrXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja2VkXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgQmxvY2tlZFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgSW52aXRlXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJpbnZpdGVlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgSW52aXRlZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlclwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEludml0ZXJcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImhhbmdjaGF0XCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgSGFuZ2NoYXRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJjb25maWd1cmVcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBDb25maWd1cmVcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cIm1lc3NhZ2VcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBNZXNzYWdlXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJtZXNzYWdlc1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIE1lc3NhZ2VzXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJvbmxpbmVcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgIG9ubGluZVN0YXR1c1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwidW5yZWFkXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBVcmVhZFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tlci1tZXNzYWdlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBCbG9ja2VyTWVzc2FnZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaWNvbnNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgIEljb25zXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4uL2xheW91dC9pY29ucy9NZXNzYWdlJ1xyXG5leHBvcnQgZnVuY3Rpb24gSWNvbnNEZW1vKCl7XHJcbiAgICByZXR1cm4gPGRpdj5cclxuXHJcbiAgICAgICAgPE1lc3NhZ2UgY291bnQ9ezF9Lz5cclxuICAgIDwvZGl2PlxyXG59IiwiZXhwb3J0IGNvbnN0IG1lc3NhZ2VzID1bXHJcbiAgICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxyXG4gIH0sXHJcbiAgIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBPayBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMjE2MzQ2MixcclxuICB9LHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgSG93IGFyZSB5b3UgZGVtb2AsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgYWxsIHJpZ2h0YCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzY3NzU3MyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ2LFxyXG4gIH0sXHJcbiAgLFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonZGVtbycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDgsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG5dIiwiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KXtcclxuICAgIHJldHVybiAgIHVucmVhZGhhbmdvdXRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gKGFjY3VtdWxhdG9yID0gW3sgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH1dKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3Qgb2JqID0gYWNjdW11bGF0b3IuZmluZChcclxuICAgICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWUgJiYgY3VycmVudC5zdGF0ZSA9PT0gJ01FU1NBTkdFUidcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYWNjdW11bGF0b3IuZmluZEluZGV4KFxyXG4gICAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XHJcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnNwbGljZShpbmRleCwgMSwge1xyXG4gICAgICAgICAgICAgIC4uLm9iaixcclxuICAgICAgICAgICAgICBtZXNzYWdlQ291bnQ6ICsrb2JqLm1lc3NhZ2VDb3VudCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHsgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgIH0sIFtdKTtcclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVW5yZWFkSGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyxvblNlbGVjdFVucmVhZCB9KSB7XHJcblxyXG4gIGNvbnN0IFtpdGVtcyxzZXRJdGVtc10gPXVzZVN0YXRlKFtdKVxyXG51c2VFZmZlY3QoKCk9PntcclxuaWYodW5yZWFkaGFuZ291dHMpe1xyXG5cclxuICBjb25zdCByZWR1Y2VkID1yZWR1Y2VyVW5yZWFkaGFuZ291dHMoe3VucmVhZGhhbmdvdXRzfSlcclxuIFxyXG4gIHNldEl0ZW1zKHJlZHVjZWQpXHJcbn1cclxuXHJcbn0sW3VucmVhZGhhbmdvdXRzXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9J3VucmVhZGhhbmdvdXRzJyBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAge2l0ZW1zICYmXHJcbiAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBpdGVtcy5tYXAoKHUpID0+IHtcclxuICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIDxMaXN0SXRlbSBvbkNsaWNrPXtvblNlbGVjdFVucmVhZH0gaWQ9e3UudXNlcm5hbWV9Pnt1LnVzZXJuYW1lfSBtZXNzYWdlczoge3UubWVzc2FnZUNvdW50fTwvTGlzdEl0ZW0+O1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBVbnJlYWQgZnJvbSAnLi4vaGFuZ291dHMvVW5yZWFkSGFuZ291dHMnO1xyXG5pbXBvcnQge3JlZHVjZXJVbnJlYWRoYW5nb3V0c30gZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMnXHJcbmNvbnN0IHVucmVhZHMgPSBbXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcblxyXG4gIHtcclxuICAgIHVzZXJuYW1lOiAnZGVtbycsXHJcbiAgICBzdGF0ZTogJ01FU1NBTkdFUicsXHJcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOiAnYmVybycsXHJcbiAgICBzdGF0ZTogJ01FU1NBTkdFUicsXHJcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcclxuICB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFVucmVhZERlbW8oKSB7XHJcbiAgcmV0dXJuIDxVbnJlYWQgdW5yZWFkaGFuZ291dHM9e3JlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHM6dW5yZWFkc30pfSAvPjtcclxufVxyXG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHtCbG9ja2VyTWVzc2FnZX0gZnJvbSAnLi4vaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VyTWVzc2FnZSdcclxuXHJcbmNvbnN0IG1lc3NhZ2UgPXt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIGJsb2NrZWQnLFxyXG50aW1lc3RhbXA6MTIzMjMsXHJcbnVzZXJuYW1lOidkZW1vJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VyTWVzc2FnZURlbW8oKXtcclxuICAgIHJldHVybiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0vPlxyXG59IiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgQXBwUm91dGVQcm92aWRlciwgQXBwUm91dGUgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vTmF2aWdhdGlvbic7XHJcbmltcG9ydCBIYW5nb3V0IGZyb20gJy4uL2hhbmdvdXRzL0hhbmdvdXQnO1xyXG5pbXBvcnQgQmxvY2sgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2snO1xyXG5pbXBvcnQgQmxvY2tlZCBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9ja2VkJztcclxuaW1wb3J0IENvbmZpZ3VyZSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9Db25maWd1cmUnO1xyXG5pbXBvcnQgSW52aXRlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZSc7XHJcbmltcG9ydCBJbnZpdGVlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUnO1xyXG5pbXBvcnQgSW52aXRlciBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVyJztcclxuaW1wb3J0IEhhbmdjaGF0IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0hhbmdjaGF0JztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2VFZGl0b3IgfSBmcm9tICcuLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3InO1xyXG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi9sYXlvdXQvaWNvbnMvb25saW5lU3RhdHVzJztcclxuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcclxuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4vRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7SWNvbnNEZW1vfSBmcm9tICcuL0ljb25zRGVtbydcclxuaW1wb3J0IHsgbWVzc2FnZXMgfSBmcm9tICcuL2Zha2VNZXNzYWdlcyc7XHJcbmltcG9ydCB7VW5yZWFkRGVtb30gZnJvbSAnLi9VcmVhZERlbW8nXHJcbmltcG9ydCB7QmxvY2tlck1lc3NhZ2VEZW1vIH0gZnJvbSAnLi9CbG9ja2VyTWVzc2FnZURlbW8nXHJcbmNvbnN0IGhhbmdvdXRzID0gW1xyXG4gIHsgdXNlcm5hbWU6ICd1c2Vyb25lJyB9LFxyXG4gIHsgdXNlcm5hbWU6ICd1c2VydHdvJyB9LFxyXG4gIHsgdXNlcm5hbWU6ICd1c2VydGhyZWUnIH0sXHJcbl07XHJcbmNvbnN0IGhhbmdvdXQgPSB7XHJcbiAgdXNlcm5hbWU6ICd0ZXN0dXNlcicsXHJcbiAgZW1haWw6ICd0ZXN0QGdtYWlsLmNvbScsXHJcbiAgbWVzc2FnZTogeyB0ZXh0OiBgTGV0J3MgY2hhdCBvbiBIYW5nb3V0IWAsIHRpbWVzdGFtcDogMTU5MDgyMDc4MjkyMSB9LFxyXG59O1xyXG5jb25zdCBtZXNzYWdlID0ge1xyXG4gIHVzZXJuYW1lOiAnYnJlbm8nLFxyXG4gIHRleHQ6IGBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcclxuICB0aW1lc3RhbXA6IDE1OTEzMzE3Njc4MzYsXHJcbn07XHJcbi8vXHJcbnJlbmRlcihcclxuICA8VGhlbWVQcm92aWRlclxyXG4gICAgaW5pdFN0YXRlPXt7XHJcbiAgICAgIHByaW1hcnk6IHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXHJcbiAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBIZWx2ZXRpY2EsIFwiQXJpYWxcIicsXHJcbiAgICAgIH0sXHJcbiAgICB9fVxyXG4gID5cclxuICAgIDxBcHBSb3V0ZVByb3ZpZGVyIGluaXRTdGF0ZT17eyBmZWF0dXJlUm91dGU6ICcvJywgcm91dGU6ICcvaWNvbnMnIH19PlxyXG4gICAgICA8TmF2aWdhdGlvbiBkcmF3ZXJDb250ZW50PXs8RHJhd2VyQ29udGVudCAvPn0+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrXCI+XHJcbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZWRcIj5cclxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cclxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZVwiPlxyXG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlZVwiPlxyXG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZXJcIj5cclxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nY2hhdFwiPlxyXG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VcIj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cclxuICAgICAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0gdXNlcm5hbWU9e2hhbmdvdXQudXNlcm5hbWV9IC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL29ubGluZVwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cclxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlc1wiPlxyXG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL3VucmVhZFwiPlxyXG4gICAgICAgICAgPFVucmVhZERlbW8vPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tlci1tZXNzYWdlXCI+XHJcbiAgICAgICAgICA8QmxvY2tlck1lc3NhZ2VEZW1vLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pY29uc1wiPlxyXG4gICAgICAgICAgPEljb25zRGVtby8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPC9OYXZpZ2F0aW9uPlxyXG4gICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gIDwvVGhlbWVQcm92aWRlcj4sXHJcbiAgZG9jdW1lbnQuYm9keVxyXG4pO1xyXG4iXSwibmFtZXMiOlsidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwiRkVBVFVSRV9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJ1c2VBcHBSb3V0ZSIsImRpc3BhdGNoIiwib25BcHBSb3V0ZSIsIkFwcFJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImZpbmQiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInZhbHVlIiwidXNlTWVtbyIsIk5hdmlnYXRpb24iLCJkcmF3ZXJDb250ZW50IiwiZGlzcGxheSIsImp1c3RpZnlDb250ZW50IiwicGFkZGluZyIsImZsZXgiLCJMaXN0IiwiaWQiLCJib3hTaXppbmciLCJiYWNrZ3JvdW5kQ29sb3IiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsIndpZHRoIiwiTGlzdEl0ZW0iLCJvbkNsaWNrIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJzdHlsZXMiLCJtYXJnaW5MZWZ0IiwibWFyZ2luUmlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJUZXh0SW5wdXQiLCJzdHlsZSIsIkJ1dHRvbiIsInRpdGxlIiwiaW5wdXRDb250YWluZXIiLCJib3JkZXIiLCJpbnB1dCIsIkhhbmdvdXQiLCJoYW5nb3V0cyIsIm9uU2VhcmNoIiwib25TZWxlY3RIYW5nb3V0Iiwic2VhcmNoIiwidXNlcm5hbWUiLCJvblN0YXJ0U2VhcmNoIiwiaGFuZGxlSGFuZ291dFNlbGVjdGlvbiIsInRhcmdldCIsImhhbmdvdXQiLCJsZW5ndGgiLCJtYXAiLCJyb290IiwiaGVpZ2h0IiwiTGF5b3V0IiwiY2hlY2tib3giLCJjaGVja2JveFJvb3QiLCJhbGlnbkl0ZW1zIiwibGF5b3V0IiwiZmxleERpcmVjdGlvbiIsImJ0biIsIkJsb2NrIiwib25DYW5jZWwiLCJvbkJsb2NrIiwib25SZXBvcnQiLCJmaWxsIiwiY29sb3IiLCJDZW50ZXIiLCJ0ZXh0QWxpZ24iLCJCbG9ja2VkIiwib25VbmJsb2NrIiwib25DbG9zZSIsIkRlbGV0ZSIsIkFyY2hpdmUiLCJpY29uQnRuIiwibWFyZ2luIiwiYnRuQ29udGFpbmVyIiwiYnRuT2siLCJDb25maWd1cmUiLCJvbkRlbGV0ZSIsIm9uQXJjaGl2ZSIsIm9uTm90aWZpY2F0aW9uIiwib25Db252ZXJzYXRpb25IaXN0b3J5Iiwib25OYXZpZ2F0aW9uIiwib25PayIsIkljb25CdXR0b24iLCJJY29uIiwiQ2hlY2tib3giLCJsYWJlbCIsIm9uQ2hhbmdlIiwiUGVyc29uQWRkSWNvbiIsIkludml0ZSIsIm9uSW52aXRlIiwib25NZXNzYWdlVGV4dCIsIm1lc3NhZ2VUZXh0IiwiUGVyc29uQWRkIiwiZW1haWwiLCJEb25lIiwiSW52aXRlZSIsInVzZU1lZGlhUXVlcnkiLCJzZXRXaWR0aCIsInVzZVN0YXRlIiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwidXNlRWZmZWN0IiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJmb250U2l6ZSIsIm1lc3NhZ2UiLCJNZXNzYWdlIiwiZmxvYXQiLCJkYXlzIiwic2V0RGF5cyIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJkIiwiaCIsIk1hdGgiLCJmbG9vciIsInNldFRpbWVvdXQiLCJEYXRlIiwibm93IiwidGltZXN0YW1wIiwic2V0SW50ZXJ2YWwiLCJ0ZXh0IiwiSW52aXRlciIsIm9uQWNjZXB0Iiwib25EZWNsaW5lIiwiTWVzc2FnZUVkaXRvciIsIm9uTWVzc2FnZSIsIkJsb2NrZXJNZXNzYWdlIiwiQmxvY2tlZE1lc3NhZ2UiLCJoYW5kbGVOYXZpZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJtZXNzYWdlQ29udGFpbmVyIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtc2ciLCJzb3J0IiwiSGFuZ2NoYXQiLCJPbmxpbmVTdGF0dXMiLCJyZWFkeVN0YXRlIiwiSXNPbmxpbmUiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsIlRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJzZXRTdGF0ZSIsIkRyYXdlckNvbnRlbnQiLCJvcGVuIiwiaGFuZGxlUm91dGUiLCJjb3VudCIsIkljb25zRGVtbyIsInJlZHVjZXJVbnJlYWRoYW5nb3V0cyIsInVucmVhZGhhbmdvdXRzIiwicmVkdWNlIiwiYWNjdW11bGF0b3IiLCJpbmRleCIsIm1lc3NhZ2VDb3VudCIsIm9iaiIsImZpbmRJbmRleCIsInNwbGljZSIsInB1c2giLCJVbnJlYWRIYW5nb3V0cyIsIm9uU2VsZWN0VW5yZWFkIiwiaXRlbXMiLCJzZXRJdGVtcyIsInJlZHVjZWQiLCJ1bnJlYWRzIiwiVW5yZWFkRGVtbyIsIlVucmVhZCIsIkJsb2NrZXJNZXNzYWdlRGVtbyIsInJlbmRlciIsInByaW1hcnkiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsImRvY3VtZW50IiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyw4REFBOEQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQSxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBeUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXVHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FB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
