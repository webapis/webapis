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

var css_248z = ".list {\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  background-color: #fff;\r\n  padding-top: 8px;\r\n  padding-bottom: 8px;\r\n  width: 100%;\r\n}\r\n\r\n.list-item {\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  padding-left: 16px;\r\n  padding-right: 16px;\r\n  padding-top: 8px;\r\n  padding-bottom: 8px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n}\r\n\r\n.list-item:hover {\r\n  background-color: #f5f5f5;\r\n  cursor: pointer;\r\n}";
styleInject(css_248z);

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

const actionTypes$1 = {
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOADED_MESSAGES: 'LOADED_MESSAGES',
  SEARCHED_HANGOUT: 'SEARCHED_HANGOUT',
  SELECTED_HANGOUT: 'SELECTED_HANGOUT',
  CLEARED_HANGOUT: 'CLEARED_HANGOUT',
  FETCH_HANGOUT_STARTED: 'FETCH_HANGOUT_STARTED',
  FETCH_HANGOUT_SUCCESS: 'FETCH_HANGOUT_SUCCESS',
  FETCH_HANGOUT_FAILED: 'FETCH_HANGOUT_FAILED',
  ONLINE_STATE_CHANGED: 'ONLINE_STATE_CHANGED',
  SOCKET_MESSAGE_RECIEVED: 'SOCKET_MESSAGE_RECIEVED',
  MESSAGES_UPDATED: 'MESSAGES_UPDATED',
  HANGOUTS_UPDATED: 'HANGOUTS_UPDATED',
  HANGOUT_UPDATED: 'HANGOUT_UPDATED',
  UNREAD_HANGOUTS_UPDATED: 'UNREAD_HANGOUTS_UPDATED',
  //SOCKET
  CONNECTING: 'CONNECTING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED',
  SOCKET_READY: 'SOCKET_READY',
  SOCKET_ERROR: 'SOCKET_ERROR'
};

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
      "data-testid": g.username,
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

function resetHangout({
  dispatch
}) {
  dispatch({
    type: actionTypes$1.CLEARED_HANGOUT
  });
}
//END saveInviter

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
  onReport,
  dispatch
}) {
  p$1(() => {
    return () => {
      resetHangout({
        dispatch
      });
    };
  }, []);
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
  onClose,
  dispatch
}) {
  p$1(() => {
    return () => {
      resetHangout({
        dispatch
      });
    };
  }, []);
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
  hangout,
  dispatch
}) {
  p$1(() => {
    return () => {
      debugger;
      resetHangout({
        dispatch
      });
    };
  }, []);
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

var css_248z$1 = ".message-font-phone-size {\r\n  font-size: 10px;\r\n}\r\n\r\n.message-font-tablet-size {\r\n  font-size: 15px;\r\n}\r\n\r\n.font-laptop-size {\r\n  font-size: 20px;\r\n}\r\n\r\n.message-font-desktop-size {\r\n  font-size: 30px;\r\n}";
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
      debugger;
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
  }, username && username, ":"), h("div", null, minutes, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", ' '), days <= 10 && days > 1 && h("div", null, days, " days ago"), days > 10 && new Date(message.timestamp)))));
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
      paddingTop: 75
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
  onNavigation,
  dispatch
}) {
  p$1(() => {
    return () => {
      debugger;
      console.log('hangout cleared');
      resetHangout({
        dispatch
      });
    };
  }, []);
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
    route: '/unread'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXIuanMiLCIuLi9OYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvVGV4dElucHV0LmpzIiwiLi4vLi4vY29tcG9uZW50cy9CdXR0b24uanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2hhbmdvdXRzL0hhbmdvdXQuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9MYXlvdXQuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cy5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jay5qcyIsIi4uLy4uL2ljb25zL0Jsb2NrLmpzIiwiLi4vLi4vbGF5b3V0L0NlbnRlci5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrZWQuanMiLCIuLi8uLi9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9pY29ucy9BcmNoaXZlLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQ29uZmlndXJlLmpzIiwiLi4vLi4vaWNvbnMvUGVyc29uQWRkLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlLmpzIiwiLi4vLi4vaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUuanMiLCIuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZXJNZXNzYWdlLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VkTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZXMuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9IYW5nY2hhdC5qcyIsIi4uLy4uL2ljb25zL29ubGluZVN0YXR1cy5qcyIsIi4uLy4uL3RoZW1lL3RoZW1lLWNvbnRleHQuanMiLCIuLi9EcmF3ZXJDb250ZW50LmpzIiwiLi4vLi4vaWNvbnMvTWVzc2FnZS5qcyIsIi4uL0ljb25zRGVtby5qcyIsIi4uL2Zha2VNZXNzYWdlcy5qcyIsIi4uLy4uL2hhbmdvdXRzL1VucmVhZEhhbmdvdXRzLmpzIiwiLi4vVXJlYWREZW1vLmpzIiwiLi4vQmxvY2tlck1lc3NhZ2VEZW1vLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcclxuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXHJcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8sdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHtyZWR1Y2VyfSBmcm9tICcuL3JlZHVjZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmNvbnN0IEFwcFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbiBmdW5jdGlvbiB1c2VBcHBSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwUm91dGVDb250ZXh0KTtcclxuICBcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZVJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtmZWF0dXJlUm91dGV9PXN0YXRlXHJcblxyXG4gIGlmIChwYXRoICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aCkge1xyXG5cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gZmVhdHVyZVJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwUm91dGUgKCl7XHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VBcHBSb3V0ZUNvbnRleHQoKVxyXG5cclxuICBmdW5jdGlvbiBvbkFwcFJvdXRlKHtyb3V0ZSxmZWF0dXJlUm91dGV9KXtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtvbkFwcFJvdXRlfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge3JvdXRlfT1zdGF0ZVxyXG4gIGlmIChwYXRoICYmIHJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiByb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gcm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3Qge2luaXRTdGF0ZX09cHJvcHNcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZVJlZHVjZXIocmVkdWNlcixpbml0U3RhdGUpXHJcblxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZpZ2F0aW9uKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgZHJhd2VyQ29udGVudCB9ID0gcHJvcHM7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGgxIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBwYWRkaW5nOiA1IH19PlxyXG4gICAgICAgIFN0b3J5Ym9va1xyXG4gICAgICA8L2gxPlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEgfX0+e2RyYXdlckNvbnRlbnR9PC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxMCB9fT57Y2hpbGRyZW59PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0ocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcclxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPntjaGlsZHJlbn08L2Rpdj47XHJcbn1cclxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsIlxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XG5cblxuXG4gZnVuY3Rpb24gTGlzdChwcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdFwiIHsuLi5wcm9wc30vPlxuICApO1xufVxuXG5cbiBmdW5jdGlvbiBMaXN0SXRlbShwcm9wcykge1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWl0ZW1cIiB7Li4ucHJvcHN9IC8+XG4gICk7XG59XG5cbmV4cG9ydCB7TGlzdCxMaXN0SXRlbX0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBwYWRkaW5nOiA4LFxyXG4gIG1hcmdpbkxlZnQ6IDE2LFxyXG4gIG1hcmdpblJpZ2h0OiAxNixcclxuICBtYXJnaW5Ub3A6IDgsXHJcbiAgbWFyZ2luQm90dG9tOiA4LFxyXG4gIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gIGZsZXg6IDEsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBpZCwgdHlwZSA9ICd0ZXh0JyxzdHlsZSB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCB3aWR0aDogJzEwMCUnIH19PlxyXG4gICAgICA8aW5wdXQgIHN0eWxlPXt7Li4uc3R5bGVzLC4uLnN0eWxlfX0gey4uLnByb3BzfSBkYXRhLXRlc3RpZD17aWR9IHR5cGU9e3R5cGV9IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xyXG4gIGNvbnN0IHsgdGl0bGUsc3R5bGUsaWQgfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIHsuLi5wcm9wc30+XHJcbiAgICAgIHt0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xyXG5cclxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXHJcblxyXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxyXG4gICAgTE9BREVEX01FU1NBR0VTOiAnTE9BREVEX01FU1NBR0VTJyxcclxuIFxyXG4gICAgU0VBUkNIRURfSEFOR09VVDogJ1NFQVJDSEVEX0hBTkdPVVQnLFxyXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxyXG4gICAgQ0xFQVJFRF9IQU5HT1VUOidDTEVBUkVEX0hBTkdPVVQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXHJcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcclxuICAgIFxyXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXHJcblxyXG4gICAgU09DS0VUX01FU1NBR0VfUkVDSUVWRUQ6J1NPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEJyxcclxuXHJcbiAgICBcclxuICAgIE1FU1NBR0VTX1VQREFURUQ6J01FU1NBR0VTX1VQREFURUQnLFxyXG4gICAgSEFOR09VVFNfVVBEQVRFRDonSEFOR09VVFNfVVBEQVRFRCcsXHJcbiAgICBIQU5HT1VUX1VQREFURUQ6J0hBTkdPVVRfVVBEQVRFRCcsXHJcbiAgICBVTlJFQURfSEFOR09VVFNfVVBEQVRFRDonVU5SRUFEX0hBTkdPVVRTX1VQREFURUQnLFxyXG4gICAgLy9TT0NLRVRcclxuXHJcbiAgICBDT05ORUNUSU5HOidDT05ORUNUSU5HJyxcclxuICAgIE9QRU46J09QRU4nLFxyXG4gICAgQ0xPU0lORzonQ0xPU0lORycsXHJcbiAgICBDTE9TRUQ6J0NMT1NFRCcsXHJcbiAgICBTT0NLRVRfUkVBRFk6J1NPQ0tFVF9SRUFEWScsXHJcbiAgICBTT0NLRVRfRVJST1I6J1NPQ0tFVF9FUlJPUidcclxuXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9jb21wb25lbnRzL2xpc3QnO1xyXG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi9jb21wb25lbnRzL1RleHRJbnB1dCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvQnV0dG9uJztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX1mcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHtzYXZlTWVzc2FnZX1mcm9tICcuL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dCdcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGlucHV0Q29udGFpbmVyOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBib3JkZXI6ICcjNzM3MzczIHNvbGlkIDFweCcsXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgcGFkZGluZzogMTAsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgYm9yZGVyOiAnd2hpdGUnLFxyXG4gIFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0KHtcclxuICBoYW5nb3V0cyxcclxuICBvblNlYXJjaCxcclxuICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgc2VhcmNoLFxyXG4gIHVzZXJuYW1lLFxyXG4gIG9uU3RhcnRTZWFyY2gsXHJcbiAgZGlzcGF0Y2hcclxufSkge1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dFNlbGVjdGlvbihlKXtcclxuICAgIGNvbnN0IGlkID1lLnRhcmdldC5pZFxyXG4gICAgb25TZWxlY3RIYW5nb3V0KGUpXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZChnPT4gZy51c2VybmFtZT09PWlkKVxyXG4gIFxyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOmAvJHtoYW5nb3V0LnN0YXRlfWAscm91dGU6Jy9oYW5nb3V0cyd9KVxyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiBcclxuICAgIDxkaXYgc3R5bGU9e3sgIHBhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuaW5wdXRDb250YWluZXJ9PlxyXG4gICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgIHZhbHVlPXtzZWFyY2h9XHJcbiAgICAgICAgICBpZD1cInNlYXJjaC1pbnB1dFwiXHJcbiAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvblNlYXJjaH1cclxuICAgICAgICAgIHN0eWxlPXtzdHlsZS5pbnB1dH1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxCdXR0b25cclxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWJ0blwiXHJcbiAgICAgICAgICBkaXNhYmxlZD17IXNlYXJjaH1cclxuICAgICAgICAgIHRpdGxlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG9uQ2xpY2s9e29uU3RhcnRTZWFyY2h9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8TGlzdCBpZD1cImhhbmdvdXRzLWxpc3RcIj5cclxuICAgICAgICB7aGFuZ291dHMgJiZcclxuICAgICAgICAgIGhhbmdvdXRzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGhhbmdvdXRzLm1hcCgoZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxMaXN0SXRlbSBpZD17Zy51c2VybmFtZX0gZGF0YS10ZXN0aWQ9e2cudXNlcm5hbWV9IG9uQ2xpY2s9e2hhbmRsZUhhbmdvdXRTZWxlY3Rpb259PlxyXG4gICAgICAgICAgICAgICAge2cudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICA8L0xpc3Q+XHJcbiAgIFxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWUnLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIExheW91dCh7IGNoaWxkcmVuLCBzdHlsZSwgaWQgfSkge1xyXG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPXtpZH0gc3R5bGU9e3sgLi4uc3R5bGVzLnJvb3QsIC4uLnN0eWxlIH19PntjaGlsZHJlbn08L2Rpdj47XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KXtcclxuICAgIHJldHVybiB1bnJlYWRoYW5nb3V0cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIChhY2N1bXVsYXRvciA9IFt7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9XSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IG9iaiA9IGFjY3VtdWxhdG9yLmZpbmQoXHJcbiAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lICYmIGN1cnJlbnQuc3RhdGUgPT09ICdNRVNTQU5HRVInXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGFjY3VtdWxhdG9yLmZpbmRJbmRleChcclxuICAgICAgICAgICAgICAoYSkgPT4gYS51c2VybmFtZSA9PT0gY3VycmVudC51c2VybmFtZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5zcGxpY2UoaW5kZXgsIDEsIHtcclxuICAgICAgICAgICAgICAuLi5vYmosXHJcbiAgICAgICAgICAgICAgbWVzc2FnZUNvdW50OiArK29iai5tZXNzYWdlQ291bnQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcclxuICAgICAgICAgICAgYWNjdW11bGF0b3IucHVzaCh7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xyXG4gICAgICB9LCBbXSk7XHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyByZWR1Y2VyVW5yZWFkaGFuZ291dHMgfSBmcm9tICcuL3JlZHVjZVVucmVhZGhhbmdvdXRzJztcclxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xyXG59XHJcbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pe1xyXG4gIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNMRUFSRURfSEFOR09VVH0pXHJcbn0gXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHtkaXNwYXRjaCx1c2VybmFtZX0pe1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XHJcbn1cclxuXHJcbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxyXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcclxufVxyXG4vL2ZpbHRlciBoYW5nb3V0IGFmdGVyIHNlYXJjaCBzdGF0ZSBjaGFuZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xyXG59XHJcblxyXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXHJcbiAgICApO1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcclxuICBcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tJHtoYW5nb3V0LnVzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZVVucmVhZCh7IHVucmVhZGhhbmdvdXRzLCBkaXNwYXRjaCB9KSB7XHJcbiAgLy8gZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy4sIHVucmVhZGhhbmdvdXRzOiByZWR1Y2VyVW5yZWFkaGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyB9KSB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vRU5EIHNhdmVJbnZpdGVyXHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5pbXBvcnQge3Jlc2V0SGFuZ291dH0gZnJvbSAnLi4vc3RhdGUvYWN0aW9ucydcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgY2hlY2tib3g6IHsgbWFyZ2luUmlnaHQ6IDggfSxcclxuICBjaGVja2JveFJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgcGFkZGluZzogMTYsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nVG9wOjY4XHJcbiAgfSxcclxuICBidG46IHtcclxuICAgIGZsZXg6IDEsXHJcbiAgICBtYXJnaW5SaWdodDogNCxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2soeyBvbkNhbmNlbCwgb25CbG9jaywgb25SZXBvcnQsZGlzcGF0Y2ggfSkge1xyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIHJldHVybiAoKT0+e1xyXG4gICAgICByZXNldEhhbmdvdXQoe2Rpc3BhdGNofSlcclxuICAgIH1cclxuICB9LFtdKVxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jaGVja2JveFJvb3R9PlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBzdHlsZT17c3R5bGUuY2hlY2tib3h9IG9uQ2hhbmdlPXtvblJlcG9ydH0gLz5cclxuICAgICAgICA8bGFiZWw+UmVwb3J0PC9sYWJlbD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDYW5jZWxcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNhbmNlbH0gLz5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQmxvY2tcIiBzdHlsZT17c3R5bGUuYnRufSBpZD1cIkJMT0NLXCIgb25DbGljaz17b25CbG9ja30gZGF0YS10ZXN0aWQ9XCJibG9jay1idG5cIiAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9jayh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBvbkNsaWNrLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgaGVpZ2h0PXtoZWlnaHR9XHJcbiAgICAgIHZpZXdCb3g9JzAgMCAyNCAyNCdcclxuICAgICAgd2lkdGg9e3dpZHRofVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBpZD17aWR9XHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6TTQgMTJjMC00LjQyIDMuNTgtOCA4LTggMS44NSAwIDMuNTUuNjMgNC45IDEuNjlMNS42OSAxNi45QzQuNjMgMTUuNTUgNCAxMy44NSA0IDEyem04IDhjLTEuODUgMC0zLjU1LS42My00LjktMS42OUwxOC4zMSA3LjFDMTkuMzcgOC40NSAyMCAxMC4xNSAyMCAxMmMwIDQuNDItMy41OCA4LTggOHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQ2VudGVyKHsgY2hpbGRyZW4sIHN0eWxlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcclxuICAgICAgICAuLi5zdHlsZSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuLi8uLi9pY29ucy9CbG9jayc7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL0J1dHRvbic7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IHtyZXNldEhhbmdvdXR9IGZyb20gJy4uL3N0YXRlL2FjdGlvbnMnXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmdUb3A6NjhcclxuICB9LFxyXG4gIGJ0bjoge1xyXG4gICAgZmxleDogMSxcclxuICAgIG1hcmdpblJpZ2h0OiA0LFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9ja2VkKHsgaGFuZ291dCwgb25VbmJsb2NrLCBvbkNsb3NlLGRpc3BhdGNoIH0pIHtcclxuXHJcbiAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICByZXR1cm4gKCk9PntcclxuXHJcbiAgICAgIHJlc2V0SGFuZ291dCh7ZGlzcGF0Y2h9KVxyXG4gICAgfVxyXG4gIH0sW10pXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJibG9ja2VkLXVpXCI+XHJcbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxyXG4gICAgICAgIDxCbG9jayB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cInJlZFwiIC8+XHJcbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcclxuICAgICAgPC9DZW50ZXI+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQ2xvc2VcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsb3NlfSAvPlxyXG4gICAgICAgIDxCdXR0b24gaWQ9J1VOQkxPQ0snIHRpdGxlPVwiVW5ibG9ja1wiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uVW5ibG9ja30gZGF0YS10ZXN0aWQ9J3VuYmxvY2stYnRuJy8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIERlbGV0ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHonXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFyY2hpdmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9ezI0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTIwLjU0IDUuMjNsLTEuMzktMS42OEMxOC44OCAzLjIxIDE4LjQ3IDMgMTggM0g2Yy0uNDcgMC0uODguMjEtMS4xNi41NUwzLjQ2IDUuMjNDMy4xNyA1LjU3IDMgNi4wMiAzIDYuNVYxOWMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjYuNWMwLS40OC0uMTctLjkzLS40Ni0xLjI3ek0xMiAxNy41TDYuNSAxMkgxMHYtMmg0djJoMy41TDEyIDE3LjV6TTUuMTIgNWwuODEtMWgxMmwuOTQgMUg1LjEyeidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmltcG9ydCB7IERlbGV0ZSB9IGZyb20gJy4uLy4uL2ljb25zL0RlbGV0ZSc7XHJcbmltcG9ydCB7IEFyY2hpdmUgfSBmcm9tICcuLi8uLi9pY29ucy9BcmNoaXZlJztcclxuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuLi8uLi9pY29ucy9CbG9jayc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvQnV0dG9uJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgaWNvbkJ0bjogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW46IDggfSxcclxuICBidG46IHsgbWFyZ2luUmlnaHQ6IDggfSxcclxuICBidG5Db250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gIH0sXHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICB9LFxyXG4gIGJ0bk9rOiB7XHJcbiAgICBtYXJnaW46IDgsXHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlndXJlKHtcclxuICBvbkJsb2NrLFxyXG4gIG9uRGVsZXRlLFxyXG4gIG9uQXJjaGl2ZSxcclxuICBvbk5vdGlmaWNhdGlvbixcclxuICBvbkNvbnZlcnNhdGlvbkhpc3RvcnksXHJcbiAgb25OYXZpZ2F0aW9uLFxyXG4gIG9uT2ssXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8Q2hlY2tib3ggbGFiZWw9XCJOb3RpZmljYXRpb25zXCIgb25DaGFuZ2U9e29uTm90aWZpY2F0aW9ufSAvPlxyXG4gICAgICAgIDxDaGVja2JveFxyXG4gICAgICAgICAgbGFiZWw9XCJDb252ZXJzYXRpb24gSGlzdG9yeVwiXHJcbiAgICAgICAgICBvbkNoYW5nZT17b25Db252ZXJzYXRpb25IaXN0b3J5fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8aHIgLz5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuQ29udGFpbmVyfT5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkFyY2hpdmVcIiBJY29uPXtBcmNoaXZlfSBvbkNsaWNrPXtvbkFyY2hpdmV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJEZWxldGVcIiBJY29uPXtEZWxldGV9IG9uQ2xpY2s9e29uRGVsZXRlfSAvPlxyXG4gICAgICAgIDxJY29uQnV0dG9uIGlkPVwiYmNrdWlcIiB0aXRsZT1cIkJsb2NrXCIgSWNvbj17QmxvY2t9IG9uQ2xpY2s9e29uTmF2aWdhdGlvbn0gIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Pa30+XHJcbiAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvbk9rfT5PSzwvQnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEljb25CdXR0b24oeyBJY29uLCB0aXRsZSwgb25DbGljayxpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLmljb25CdG59PlxyXG4gICAgICA8YnV0dG9uIGlkPXtpZH0gc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbGlja30gZGF0YS10ZXN0aWQ9e2Ake2lkfS1idG5gfT5cclxuICAgICAgICA8SWNvbiBpZD17aWR9Lz5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxkaXY+e3RpdGxlfTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2hlY2tib3goeyBsYWJlbCwgb25DaGFuZ2UgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbjogOCwgbWFyZ2luVG9wOiA4IH19PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxyXG4gICAgICA8bGFiZWw+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQZXJzb25BZGRJY29uKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ3doaXRlJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTUgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0tOS0yVjdINHYzSDF2MmgzdjNoMnYtM2gzdi0ySDZ6bTkgNGMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgUGVyc29uQWRkIGZyb20gJy4uLy4uL2ljb25zL1BlcnNvbkFkZCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvVGV4dElucHV0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICcuLi8uLi9sYXlvdXQvQ2VudGVyJztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZSh7IGhhbmdvdXQsIG9uSW52aXRlLCBvbk1lc3NhZ2VUZXh0LG1lc3NhZ2VUZXh0LCB2YWx1ZSB9KSB7XHJcblxyXG4gIFxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9aWQ9XCJpbnZpdGUtdWlcIj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8UGVyc29uQWRkIGNvbG9yPVwiZ3JlZW5cIiAvPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICBTdGFydCBDb252ZXJzYXRpb24gd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxUZXh0SW5wdXQgaWQ9XCJtZXNzYWdlVGV4dElucHV0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9IHZhbHVlPXttZXNzYWdlVGV4dH0gLz5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiU2VuZCBJbnZpdGVcIiBpZD1cIklOVklURVwiIG9uQ2xpY2s9e29uSW52aXRlfSBkYXRhLXRlc3RpZD0nb25pbnZpdGUtYnRuJyAvPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRG9uZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yeidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IERvbmUgfSBmcm9tICcuLi8uLi9pY29ucy9Eb25lJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmltcG9ydCB7cmVzZXRIYW5nb3V0fSBmcm9tICcuLi9zdGF0ZS9hY3Rpb25zJ1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZWUoeyBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuXHJcbiAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICByZXR1cm4gKCk9PntcclxuICAgICAgZGVidWdnZXI7XHJcblxyXG4gICAgICByZXNldEhhbmdvdXQoe2Rpc3BhdGNofSlcclxuICAgIH1cclxuICB9LFtdKVxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiaW52aXRlZS11aVwiPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxEb25lIHdpZHRoPVwiNzBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwiZ3JlZW5cIiAvPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8cD5cclxuICAgICAgICAgIFlvdSB3aWxsIGJlIGFibGUgdG8gY2hhdCB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPiBvbmNlXHJcbiAgICAgICAgICB5b3VyIGludml0aW9uIGhhcyBiZWVuIGFjY2VwdGVkLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IGRldmljZVR5cGUgZnJvbSAnLi9kZXZpY2VUeXBlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KCkge1xyXG4gIGNvbnN0IFt3aWR0aCwgc2V0V2lkdGhdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hlaWdodCwgc2V0SGVpZ2h0XSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtvcmllbnRhdGlvbiwgc2V0T3JpZW50YXRpb25dID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtkZXZpY2UsIHNldERldmljZV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlVmlld3BvcnRTaXplKCkge1xyXG4gICBcclxuICAgICAgc2V0V2lkdGgod2luZG93LmlubmVyV2lkdGgpO1xyXG4gICAgICBzZXRIZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKSB7XHJcbiAgICBzZXRPcmllbnRhdGlvbih3aW5kb3cuc2NyZWVuLm9yaWVudGF0aW9uKTtcclxuICB9XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh3aWR0aCA+IDApIHtcclxuICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA2MDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3Bob25lJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDc2ODpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDk5MjpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDEyMDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3RhYmxldCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdsYXB0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPiAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdkZXNrdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFt3aWR0aF0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2RldmljZScsIGRldmljZSk7XHJcbiAgfSwgW2RldmljZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBoYW5kbGVWaWV3cG9ydFNpemUoKTtcclxuICAgIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gaGFuZGxlVmlld3BvcnRTaXplKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB9O1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24sIGRldmljZSB9O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJy4uLy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICByb290OiB7XHJcbiAgICBib3JkZXJDb2xvcjogJyNlZWVlZWUnLFxyXG4gICAgYm9yZGVyU3R5bGU6ICdzb2xpZCcsXHJcbiAgICBib3JkZXJXaWR0aDogMSxcclxuICAgIGJvcmRlclJhZGl1czogNSxcclxuICAgIHBhZGRpbmc6IDMsXHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBtaW5IZWlnaHQ6IDM1LFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxyXG4gIH0sXHJcbiAgdXNlcm5hbWU6IHsgbWFyZ2luUmlnaHQ6IDggfSxcclxuICBsb2c6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGNvbG9yOiAnIzczNzM3MycsXHJcbiAgICBmb250U2l6ZTogMTAsXHJcbiAgfSxcclxuICBtZXNzYWdlOiB7fSxcclxufTtcclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UocHJvcHMpIHtcclxuICBjb25zdCB7IG1lc3NhZ2UgfSA9IHByb3BzO1xyXG4gIGNvbnN0IHsgZmxvYXQsIHVzZXJuYW1lLHRpbWVzdGFtcCB9ID0gbWVzc2FnZTtcclxuICBjb25zdCBbZGF5cywgc2V0RGF5c10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFttaW51dGVzLCBzZXRNaW51dGVzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtzZWNvbmRzLCBzZXRTZWNvbmRzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IHsgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XHJcbiAgICB2YXIgZCwgaCwgbSwgcztcclxuICAgIHMgPSBNYXRoLmZsb29yKG1zIC8gMTAwMCk7XHJcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xyXG4gICAgcyA9IHMgJSA2MDtcclxuICAgIGggPSBNYXRoLmZsb29yKG0gLyA2MCk7XHJcbiAgICBtID0gbSAlIDYwO1xyXG4gICAgZCA9IE1hdGguZmxvb3IoaCAvIDI0KTtcclxuICAgIGggPSBoICUgMjQ7XHJcbiAgICBzZXREYXlzKGQpO1xyXG4gICAgc2V0SG91cnMoaCk7XHJcbiAgICBzZXRNaW51dGVzKG0pO1xyXG4gICAgc2V0U2Vjb25kcyhzKTtcclxuICB9XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZih0aW1lc3RhbXApe1xyXG4gIFxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIHRpbWVzdGFtcCk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSB0aW1lc3RhbXApO1xyXG4gICAgICB9LCA2MDAwMCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgIH1cclxuICAgXHJcbiAgfSwgW3RpbWVzdGFtcF0pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBtYXJnaW5Cb3R0b206IDMgfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGUucm9vdCwgZmxvYXQgfX0+XHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJtZXNzYWdlXCJcclxuICAgICAgICAgIHN0eWxlPXtzdHlsZS5tZXNzYWdlfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgbWVzc2FnZS1mb250LSR7ZGV2aWNlfS1zaXplYH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7bWVzc2FnZSAmJiBtZXNzYWdlLnRleHR9XHJcbiAgICAgICAgXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUubG9nfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnVzZXJuYW1lfT57dXNlcm5hbWUgJiYgdXNlcm5hbWV9OjwvZGl2PlxyXG4gICAgICAgICAgPGRpdj57bWludXRlc31cclxuICAgICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA9PT0gMCAmJiBtaW51dGVzID4gMCAmJiA8ZGl2PnttaW51dGVzfSBtaW51dGVzIGFnbyA8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtob3Vyc30gaG91cnMge21pbnV0ZXN9IG1pbnV0ZXMgYWdveycgJ31cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAge2RheXMgPD0gMTAgJiYgZGF5cyA+IDEgJiYgPGRpdj57ZGF5c30gZGF5cyBhZ288L2Rpdj59XHJcbiAgICAgICAgICAgIHtkYXlzID4gMTAgJiYgbmV3IERhdGUobWVzc2FnZS50aW1lc3RhbXApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vbWVzc2FnZS11aS9NZXNzYWdlJztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBwYWRkaW5nVG9wOiA3MCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIHBhZGRpbmdCb3R0b206OCxcclxuIFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSB9KSB7XHJcbiBcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImludml0ZXItdWlcIj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUucm9vdH0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5MZWZ0OiA4LCBkaXNwbGF5OidmbGV4JyB9fT5cclxuICAgICAgICAgIHtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiAoXHJcbiAgICAgICAgICAgIDxNZXNzYWdlXHJcbiAgICAgICAgICAgICAgbWVzc2FnZT17XHJcbiAgICAgICAgICAgICAgICBoYW5nb3V0ICYmXHJcbiAgICAgICAgICAgICAgICBoYW5nb3V0Lm1lc3NhZ2UgJiYge1xyXG4gICAgICAgICAgICAgICAgICAuLi5oYW5nb3V0Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLGZsb2F0OidsZWZ0J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLHBhZGRpbmdMZWZ0OjgscGFkZGluZ1JpZ2h0OjggfX0+XHJcbiAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgIGlkPVwiREVDTElORVwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWNsaW5lLWJ0blwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwiRGVjbGluZVwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblJpZ2h0OiA0LCBjb2xvcjogJ3JlZCcgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgIGlkPVwiQUNDRVBUXCJcclxuICAgICAgICAgICAgb25DbGljaz17b25BY2NlcHR9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjZXB0LWJ0blwiXHJcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luTGVmdDogNCwgY29sb3I6ICdncmVlbicgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9UZXh0SW5wdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL0J1dHRvbic7XHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICByb290OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJ1xyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIC8vbWFyZ2luOjBcclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICBtYXJnaW5MZWZ0OiA4LFxyXG4gICAgbWFyZ2luUmlnaHQ6IDgsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgICBcclxuICB9LFxyXG4gIGJ0bjp7XHJcbiAgICBwYWRkaW5nOiA4LFxyXG5cclxuICAgIG1hcmdpblJpZ2h0OiAxNixcclxuICAgIG1hcmdpblRvcDogOCxcclxuICAgIG1hcmdpbkJvdHRvbTogOCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgZmxleDogMSxcclxuICB9XHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlRWRpdG9yKHsgbWVzc2FnZVRleHQsIG9uTWVzc2FnZVRleHQsIG9uTWVzc2FnZSxoYW5nb3V0IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGVzLnJvb3R9PlxyXG4gICAgIFxyXG4gICAgICA8aW5wdXQgc3R5bGU9e3N0eWxlcy5pbnB1dH0gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiIHZhbHVlPXttZXNzYWdlVGV4dH0vPlxyXG4gICAgICBcclxuICAgICAgPGRpdj5cclxuICAgICAgICA8QnV0dG9uIGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHN0eWxlPXtzdHlsZXMuYnRufSAgdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlck1lc3NhZ2UoeyBtZXNzYWdlIH0pIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VyLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fTwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBmbG9hdDogJ3JpZ2h0JyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBmb250U2l6ZTogMTYsXHJcbiAgICB0ZXh0QWxpZ246ICdlbmQnXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZWRNZXNzYWdlKHsgbWVzc2FnZSxvbk5hdmlnYXRpb24gfSkge1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlTmF2aWdhdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBvbk5hdmlnYXRpb24oZSlcclxuICAgIH1cclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZWQtbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9XHJcbiAgICA8YSBpZD1cIlVOQkxPQ0tcIiBkYXRhLXRlc3RpZD1cInNlZW1vcmUtYnRuXCIgaHJlZj1cIi9cIiBvbkNsaWNrPXtoYW5kbGVOYXZpZ2F0aW9ufT5zZWUgbW9yZTwvYT5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VFZGl0b3IgfSBmcm9tICcuL01lc3NhZ2VFZGl0b3InO1xyXG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZSB9IGZyb20gJy4vQmxvY2tlck1lc3NhZ2UnXHJcbmltcG9ydCB7QmxvY2tlZE1lc3NhZ2V9IGZyb20gJy4vQmxvY2tlZE1lc3NhZ2UnXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBtZXNzYWdlQ29udGFpbmVyOiB7XHJcbiAgICAvLyB3aWR0aDogJzEwMCUnLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gIC8vICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxyXG4gICAgZmxleDogMTUsXHJcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcclxuICAgIG92ZXJmbG93WDogXCJoaWRkZW5cIlxyXG5cclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZXMoe1xyXG4gIG1lc3NhZ2VzLFxyXG4gIG9uTWVzc2FnZSxcclxuICBvbk1lc3NhZ2VUZXh0LFxyXG4gIG1lc3NhZ2VUZXh0LFxyXG4gIHVzZXJuYW1lLFxyXG4gIGhhbmdvdXQsXHJcbiAgb25OYXZpZ2F0aW9uXHJcbn0pIHtcclxuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChtZXNzYWdlcykge1xyXG4gICAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH0sIFttZXNzYWdlc10pO1xyXG5cclxuICBmdW5jdGlvbiBvblNlbmQoZSkge1xyXG4gICAgb25NZXNzYWdlKGUpO1xyXG4gICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBwYWRkaW5nVG9wOiA3NSB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLm1lc3NhZ2VDb250YWluZXJ9IHJlZj17c2Nyb2xsZXJSZWZ9PlxyXG4gICAgICAgIHttZXNzYWdlcyAmJlxyXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzOiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSwgdXNlcm5hbWUgfSkubWFwKFxyXG4gICAgICAgICAgICAobSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxyXG4gICAgICAgICAgICAgICAgeycgJ31cclxuICAgICAgICAgICAgICAgIHshbS50eXBlICYmIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VyJyAmJiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZWQnICYmIDxCbG9ja2VkTWVzc2FnZSBtZXNzYWdlPXttfSBvbk5hdmlnYXRpb249e29uTmF2aWdhdGlvbn0vPn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cclxuICAgICAgICA8TWVzc2FnZUVkaXRvclxyXG4gICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICAgIG9uTWVzc2FnZT17b25TZW5kfVxyXG4gICAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xyXG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcclxuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5zb3J0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9tZXNzYWdlLXVpL01lc3NhZ2VzJztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xyXG5pbXBvcnQge3Jlc2V0SGFuZ291dH0gZnJvbSAnLi4vc3RhdGUvYWN0aW9ucydcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XHJcbiAgbWVzc2FnZXMgPSBbXSxcclxuICBvbk1lc3NhZ2VUZXh0LFxyXG4gIG9uTWVzc2FnZSxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvbixcclxuICBkaXNwYXRjaFxyXG59KSB7XHJcblxyXG4gIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgcmV0dXJuICgpPT57XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zb2xlLmxvZygnaGFuZ291dCBjbGVhcmVkJylcclxuICAgICAgcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pXHJcbiAgICB9XHJcbiAgfSxbXSlcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImhhbmdjaGF0LXVpXCIgPlxyXG4gICAgICA8TWVzc2FnZXNcclxuICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XHJcbiAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XHJcbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XHJcbiAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICBtZXNzYWdlVGV4dCA9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgLz5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUaGVtZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggVGhlbWVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgXHJcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRTdGF0ZSk7XHJcblxyXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0LCBUaGVtZVByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2NvbXBvbmVudHMvbGlzdCc7XHJcblxyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuZXhwb3J0IGZ1bmN0aW9uIERyYXdlckNvbnRlbnQoeyBvcGVuIH0pIHtcclxuICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTonLycscm91dGU6YC8ke2lkfWB9KVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaGFuZ291dHNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBIYW5nb3V0c1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBCbG9ja1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tlZFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEJsb2NrZWRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEludml0ZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEludml0ZWVcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZXJcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBJbnZpdGVyXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nY2hhdFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEhhbmdjaGF0XHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuXHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiY29uZmlndXJlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgQ29uZmlndXJlXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJtZXNzYWdlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgTWVzc2FnZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwibWVzc2FnZXNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBNZXNzYWdlc1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwib25saW5lXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBvbmxpbmVTdGF0dXNcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cInVucmVhZFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgVXJlYWRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImJsb2NrZXItbWVzc2FnZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgQmxvY2tlck1lc3NhZ2VcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImljb25zXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBJY29uc1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBtZXNzYWdlSWNvbiBmcm9tICcuL21lc3NhZ2UucG5nJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgY291bnQ6IHtcclxuICAgIHdpZHRoOiAzMCxcclxuICAgIGhlaWdodDogMzAsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicsXHJcbiAgICBjb2xvcjogJ3doaXRlJyxcclxuICAgIHRleHRBbGlnbjonY2VudGVyJyxcclxuICAgIGJvcmRlclJhZGl1czoxNSxcclxuICAgIGRpc3BsYXk6J2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczonY2VudGVyJyxcclxuICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UoeyBjb3VudD0wIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XHJcbiAgICAgICAgICA8ZGl2Pm1lc3NhZ2U6PC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmNvdW50fSBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtY291bnRcIj57Y291bnR9PC9kaXY+IFxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICcuLi9pY29ucy9NZXNzYWdlJ1xyXG5leHBvcnQgZnVuY3Rpb24gSWNvbnNEZW1vKCl7XHJcbiAgICByZXR1cm4gPGRpdj5cclxuXHJcbiAgICAgICAgPE1lc3NhZ2UgY291bnQ9ezF9Lz5cclxuICAgIDwvZGl2PlxyXG59IiwiZXhwb3J0IGNvbnN0IG1lc3NhZ2VzID1bXHJcbiAgICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxyXG4gIH0sXHJcbiAgIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBPayBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMjE2MzQ2MixcclxuICB9LHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgSG93IGFyZSB5b3UgZGVtb2AsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgYWxsIHJpZ2h0YCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzY3NzU3MyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ2LFxyXG4gIH0sXHJcbiAgLFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonZGVtbycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDgsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG5dIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2NvbXBvbmVudHMvbGlzdCc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVW5yZWFkSGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyxvblNlbGVjdFVucmVhZCxvblJlbW92ZVVucmVhZCB9KSB7XHJcblxyXG4gIGNvbnN0IFtpdGVtcyxzZXRJdGVtc10gPXVzZVN0YXRlKFtdKVxyXG51c2VFZmZlY3QoKCk9PntcclxuaWYodW5yZWFkaGFuZ291dHMpe1xyXG5cclxuICBjb25zdCByZWR1Y2VkID1yZWR1Y2VyVW5yZWFkaGFuZ291dHMoe3VucmVhZGhhbmdvdXRzfSlcclxuIFxyXG4gIHNldEl0ZW1zKHJlZHVjZWQpXHJcbn1cclxuXHJcbn0sW3VucmVhZGhhbmdvdXRzXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9J3VucmVhZGhhbmdvdXRzJyBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAge2l0ZW1zICYmXHJcbiAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBpdGVtcy5tYXAoKHUpID0+IHtcclxuICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCd9fT5cclxuICAgICAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e29uU2VsZWN0VW5yZWFkfSBpZD17dS51c2VybmFtZX0gc3R5bGU9e3tmbGV4OjV9fSBkYXRhLXRlc3RpZD17YCR7dS51c2VybmFtZX0tc2VsZWN0YH0+e3UudXNlcm5hbWV9IG1lc3NhZ2VzOiB7dS5tZXNzYWdlQ291bnR9PC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e29uUmVtb3ZlVW5yZWFkfSBpZD17dS51c2VybmFtZX0gc3R5bGU9e3tjb2xvcjoncmVkJ319IGRhdGEtdGVzdGlkPXtgJHt1LnVzZXJuYW1lfS1yZW1vdmVgfT54PC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB9KX1cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IFVucmVhZCBmcm9tICcuLi9oYW5nb3V0cy9VbnJlYWRIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuY29uc3QgdW5yZWFkcyA9IFtcclxuICB7XHJcbiAgICB1c2VybmFtZTogJ2RlbW8nLFxyXG4gICAgc3RhdGU6ICdNRVNTQU5HRVInLFxyXG4gICAgbWVzc2FnZTogeyB0ZXh0OiAnSGVsbG8geW91JywgdGltZXN0YW1wOiAxNTkxODEwNDU4NjMwIH0sXHJcbiAgfSxcclxuXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdiZXJvJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5yZWFkRGVtbygpIHtcclxuICByZXR1cm4gPFVucmVhZCB1bnJlYWRoYW5nb3V0cz17cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0czp1bnJlYWRzfSl9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge0Jsb2NrZXJNZXNzYWdlfSBmcm9tICcuLi9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZXJNZXNzYWdlJ1xyXG5cclxuY29uc3QgbWVzc2FnZSA9e3RleHQ6J1lvdSBjYW4gbm90IHNlbmQgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZCcsXHJcbnRpbWVzdGFtcDoxMjMyMyxcclxudXNlcm5hbWU6J2RlbW8nXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlRGVtbygpe1xyXG4gICAgcmV0dXJuIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfS8+XHJcbn0iLCJpbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBSb3V0ZVByb3ZpZGVyLCBBcHBSb3V0ZSB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcclxuaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi9OYXZpZ2F0aW9uJztcclxuaW1wb3J0IEhhbmdvdXQgZnJvbSAnLi4vaGFuZ291dHMvSGFuZ291dCc7XHJcbmltcG9ydCBCbG9jayBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jayc7XHJcbmltcG9ydCBCbG9ja2VkIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrZWQnO1xyXG5pbXBvcnQgQ29uZmlndXJlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0NvbmZpZ3VyZSc7XHJcbmltcG9ydCBJbnZpdGUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlJztcclxuaW1wb3J0IEludml0ZWUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlZSc7XHJcbmltcG9ydCBJbnZpdGVyIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXInO1xyXG5pbXBvcnQgSGFuZ2NoYXQgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlJztcclxuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VzJztcclxuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZUVkaXRvcic7XHJcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJy4uL2ljb25zL29ubGluZVN0YXR1cyc7XHJcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9jb21wb25lbnRzL2xpc3QnO1xyXG5pbXBvcnQgeyBEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi9EcmF3ZXJDb250ZW50JztcclxuaW1wb3J0IHtJY29uc0RlbW99IGZyb20gJy4vSWNvbnNEZW1vJ1xyXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcclxuaW1wb3J0IHtVbnJlYWREZW1vfSBmcm9tICcuL1VyZWFkRGVtbydcclxuaW1wb3J0IHtCbG9ja2VyTWVzc2FnZURlbW8gfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlRGVtbydcclxuY29uc3QgaGFuZ291dHMgPSBbXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJvbmUnIH0sXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJ0aHJlZScgfSxcclxuXTtcclxuY29uc3QgaGFuZ291dCA9IHtcclxuICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcclxuICBlbWFpbDogJ3Rlc3RAZ21haWwuY29tJyxcclxuICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXHJcbn07XHJcbmNvbnN0IG1lc3NhZ2UgPSB7XHJcbiAgdXNlcm5hbWU6ICdicmVubycsXHJcbiAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gIHRpbWVzdGFtcDogMTU5MTMzMTc2NzgzNixcclxufTtcclxuLy9cclxucmVuZGVyKFxyXG4gIDxUaGVtZVByb3ZpZGVyXHJcbiAgICBpbml0U3RhdGU9e3tcclxuICAgICAgcHJpbWFyeToge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcclxuICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcclxuICAgICAgfSxcclxuICAgIH19XHJcbiAgPlxyXG4gICAgPEFwcFJvdXRlUHJvdmlkZXIgaW5pdFN0YXRlPXt7IGZlYXR1cmVSb3V0ZTogJy8nLCByb3V0ZTogJy91bnJlYWQnIH19PlxyXG4gICAgICA8TmF2aWdhdGlvbiBkcmF3ZXJDb250ZW50PXs8RHJhd2VyQ29udGVudCAvPn0+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrXCI+XHJcbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZWRcIj5cclxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cclxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZVwiPlxyXG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlZVwiPlxyXG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZXJcIj5cclxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nY2hhdFwiPlxyXG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VcIj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cclxuICAgICAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0gdXNlcm5hbWU9e2hhbmdvdXQudXNlcm5hbWV9IC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL29ubGluZVwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cclxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlc1wiPlxyXG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL3VucmVhZFwiPlxyXG4gICAgICAgICAgPFVucmVhZERlbW8vPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tlci1tZXNzYWdlXCI+XHJcbiAgICAgICAgICA8QmxvY2tlck1lc3NhZ2VEZW1vLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pY29uc1wiPlxyXG4gICAgICAgICAgPEljb25zRGVtby8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPC9OYXZpZ2F0aW9uPlxyXG4gICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gIDwvVGhlbWVQcm92aWRlcj4sXHJcbiAgZG9jdW1lbnQuYm9keVxyXG4pO1xyXG4iXSwibmFtZXMiOlsidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwiRkVBVFVSRV9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJ1c2VBcHBSb3V0ZSIsImRpc3BhdGNoIiwib25BcHBSb3V0ZSIsIkFwcFJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImZpbmQiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInZhbHVlIiwidXNlTWVtbyIsIk5hdmlnYXRpb24iLCJkcmF3ZXJDb250ZW50IiwiZGlzcGxheSIsImp1c3RpZnlDb250ZW50IiwicGFkZGluZyIsImZsZXgiLCJMaXN0IiwiTGlzdEl0ZW0iLCJzdHlsZXMiLCJtYXJnaW5MZWZ0IiwibWFyZ2luUmlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJib3hTaXppbmciLCJUZXh0SW5wdXQiLCJpZCIsInN0eWxlIiwid2lkdGgiLCJCdXR0b24iLCJ0aXRsZSIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURFRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiQ0xFQVJFRF9IQU5HT1VUIiwiRkVUQ0hfSEFOR09VVF9TVEFSVEVEIiwiRkVUQ0hfSEFOR09VVF9TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVF9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIlNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEIiwiTUVTU0FHRVNfVVBEQVRFRCIsIkhBTkdPVVRTX1VQREFURUQiLCJIQU5HT1VUX1VQREFURUQiLCJVTlJFQURfSEFOR09VVFNfVVBEQVRFRCIsIkNPTk5FQ1RJTkciLCJPUEVOIiwiQ0xPU0lORyIsIkNMT1NFRCIsIlNPQ0tFVF9SRUFEWSIsIlNPQ0tFVF9FUlJPUiIsImlucHV0Q29udGFpbmVyIiwiYm9yZGVyIiwiaW5wdXQiLCJIYW5nb3V0IiwiaGFuZ291dHMiLCJvblNlYXJjaCIsIm9uU2VsZWN0SGFuZ291dCIsInNlYXJjaCIsInVzZXJuYW1lIiwib25TdGFydFNlYXJjaCIsImhhbmRsZUhhbmdvdXRTZWxlY3Rpb24iLCJ0YXJnZXQiLCJoYW5nb3V0IiwicGFkZGluZ1RvcCIsImxlbmd0aCIsIm1hcCIsInJvb3QiLCJiYWNrZ3JvdW5kQ29sb3IiLCJoZWlnaHQiLCJMYXlvdXQiLCJyZWR1Y2VyVW5yZWFkaGFuZ291dHMiLCJ1bnJlYWRoYW5nb3V0cyIsInJlZHVjZSIsImFjY3VtdWxhdG9yIiwiY3VycmVudCIsImluZGV4IiwibWVzc2FnZUNvdW50Iiwib2JqIiwiZmluZEluZGV4Iiwic3BsaWNlIiwicHVzaCIsInJlc2V0SGFuZ291dCIsImNoZWNrYm94IiwiY2hlY2tib3hSb290IiwiYWxpZ25JdGVtcyIsImxheW91dCIsImZsZXhEaXJlY3Rpb24iLCJidG4iLCJCbG9jayIsIm9uQ2FuY2VsIiwib25CbG9jayIsIm9uUmVwb3J0IiwidXNlRWZmZWN0IiwiZmlsbCIsImNvbG9yIiwib25DbGljayIsIkNlbnRlciIsInRleHRBbGlnbiIsIkJsb2NrZWQiLCJvblVuYmxvY2siLCJvbkNsb3NlIiwiRGVsZXRlIiwiQXJjaGl2ZSIsImljb25CdG4iLCJtYXJnaW4iLCJidG5Db250YWluZXIiLCJidG5PayIsIkNvbmZpZ3VyZSIsIm9uRGVsZXRlIiwib25BcmNoaXZlIiwib25Ob3RpZmljYXRpb24iLCJvbkNvbnZlcnNhdGlvbkhpc3RvcnkiLCJvbk5hdmlnYXRpb24iLCJvbk9rIiwiSWNvbkJ1dHRvbiIsIkljb24iLCJDaGVja2JveCIsImxhYmVsIiwib25DaGFuZ2UiLCJQZXJzb25BZGRJY29uIiwiSW52aXRlIiwib25JbnZpdGUiLCJvbk1lc3NhZ2VUZXh0IiwibWVzc2FnZVRleHQiLCJQZXJzb25BZGQiLCJlbWFpbCIsIkRvbmUiLCJJbnZpdGVlIiwidXNlTWVkaWFRdWVyeSIsInNldFdpZHRoIiwidXNlU3RhdGUiLCJzZXRIZWlnaHQiLCJvcmllbnRhdGlvbiIsInNldE9yaWVudGF0aW9uIiwiZGV2aWNlIiwic2V0RGV2aWNlIiwiaGFuZGxlVmlld3BvcnRTaXplIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwiaGFuZGxlU2NyZWVuT3JpZW50YXRpb24iLCJzY3JlZW4iLCJjb25zb2xlIiwibG9nIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJvcmRlckNvbG9yIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJXaWR0aCIsImJvcmRlclJhZGl1cyIsIm1pbkhlaWdodCIsImZvbnRTaXplIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJmbG9hdCIsInRpbWVzdGFtcCIsImRheXMiLCJzZXREYXlzIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJzZXRJbnRlcnZhbCIsInRleHQiLCJwYWRkaW5nQm90dG9tIiwiSW52aXRlciIsIm9uQWNjZXB0Iiwib25EZWNsaW5lIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJNZXNzYWdlRWRpdG9yIiwib25NZXNzYWdlIiwiQmxvY2tlck1lc3NhZ2UiLCJCbG9ja2VkTWVzc2FnZSIsImhhbmRsZU5hdmlnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm1lc3NhZ2VDb250YWluZXIiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJNZXNzYWdlcyIsIm1lc3NhZ2VzIiwic2Nyb2xsZXJSZWYiLCJ1c2VSZWYiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJvblNlbmQiLCJmbG9hdE1lc3NhZ2VzIiwic29ydE1lc3NhZ2VzIiwibXNnIiwic29ydCIsIkhhbmdjaGF0IiwiT25saW5lU3RhdHVzIiwicmVhZHlTdGF0ZSIsIklzT25saW5lIiwiSXNPZmZsaW5lIiwiQ29ubmVjdGluZyIsIkNsb3NpbmciLCJUaGVtZUNvbnRleHQiLCJUaGVtZVByb3ZpZGVyIiwic2V0U3RhdGUiLCJEcmF3ZXJDb250ZW50Iiwib3BlbiIsImhhbmRsZVJvdXRlIiwiY291bnQiLCJJY29uc0RlbW8iLCJVbnJlYWRIYW5nb3V0cyIsIm9uU2VsZWN0VW5yZWFkIiwib25SZW1vdmVVbnJlYWQiLCJpdGVtcyIsInNldEl0ZW1zIiwicmVkdWNlZCIsInVucmVhZHMiLCJVbnJlYWREZW1vIiwiVW5yZWFkIiwiQmxvY2tlck1lc3NhZ2VEZW1vIiwicmVuZGVyIiwicHJpbWFyeSIsImJhY2tncm91bmQiLCJmb250RmFtaWx5IiwiZG9jdW1lbnQiLCJib2R5Il0sIm1hcHBpbmdzIjoiQUFBRyxJQUFDLENBQUMsQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDhEQUE4RCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLHlCQUF5QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBNEssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQXVELENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBNS9SLElBQUlBLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxFQUFFLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNQLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDQSxHQUFDLENBQUMsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUF5RSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPWSxHQUFDLENBQUMsVUFBVSxDQUFDLE9BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBdUcsU0FBU0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0wsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFrRCxTQUFTYyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNiLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDTyxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQXlOLFNBQVMsQ0FBQyxFQUFFLENBQUNFLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNiLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNQLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDSixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYyxHQUFDLENBQUMsQ0FBQ2QsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZSxHQUFDLENBQUMsQ0FBQ2YsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUdGLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUVELEdBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENB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
