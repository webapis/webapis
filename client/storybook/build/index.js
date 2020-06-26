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
  // useEffect(()=>{
  //   return ()=>{
  //     resetHangout({dispatch})
  //   }
  // },[])
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
}; //

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
      console.log('hangout cleared'); // resetHangout({dispatch})
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXIuanMiLCIuLi9OYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvVGV4dElucHV0LmpzIiwiLi4vLi4vY29tcG9uZW50cy9CdXR0b24uanMiLCIuLi8uLi9oYW5nb3V0cy9IYW5nb3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvTGF5b3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jay5qcyIsIi4uLy4uL2ljb25zL0Jsb2NrLmpzIiwiLi4vLi4vbGF5b3V0L0NlbnRlci5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrZWQuanMiLCIuLi8uLi9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9pY29ucy9BcmNoaXZlLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQ29uZmlndXJlLmpzIiwiLi4vLi4vaWNvbnMvUGVyc29uQWRkLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlLmpzIiwiLi4vLi4vaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUuanMiLCIuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZXJNZXNzYWdlLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VkTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZXMuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9IYW5nY2hhdC5qcyIsIi4uLy4uL2ljb25zL29ubGluZVN0YXR1cy5qcyIsIi4uLy4uL3RoZW1lL3RoZW1lLWNvbnRleHQuanMiLCIuLi9EcmF3ZXJDb250ZW50LmpzIiwiLi4vLi4vaWNvbnMvTWVzc2FnZS5qcyIsIi4uL0ljb25zRGVtby5qcyIsIi4uL2Zha2VNZXNzYWdlcy5qcyIsIi4uLy4uL2hhbmdvdXRzL1VucmVhZEhhbmdvdXRzLmpzIiwiLi4vVXJlYWREZW1vLmpzIiwiLi4vQmxvY2tlck1lc3NhZ2VEZW1vLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcclxuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXHJcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdmlnYXRpb24ocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBkcmF3ZXJDb250ZW50IH0gPSBwcm9wcztcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8aDEgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIHBhZGRpbmc6IDUgfX0+XHJcbiAgICAgICAgU3Rvcnlib29rXHJcbiAgICAgIDwvaDE+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT57ZHJhd2VyQ29udGVudH08L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEwIH19PntjaGlsZHJlbn08L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2SXRlbShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+e2NoaWxkcmVufTwvZGl2PjtcclxufVxyXG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcblxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0KHByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdFwiIHsuLi5wcm9wc30vPlxyXG4gICk7XHJcbn1cclxuXHJcblxyXG4gZnVuY3Rpb24gTGlzdEl0ZW0ocHJvcHMpIHtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1pdGVtXCIgey4uLnByb3BzfSAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7TGlzdCxMaXN0SXRlbX0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBwYWRkaW5nOiA4LFxyXG4gIG1hcmdpbkxlZnQ6IDE2LFxyXG4gIG1hcmdpblJpZ2h0OiAxNixcclxuICBtYXJnaW5Ub3A6IDgsXHJcbiAgbWFyZ2luQm90dG9tOiA4LFxyXG4gIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gIGZsZXg6IDEsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBpZCwgdHlwZSA9ICd0ZXh0JyxzdHlsZSB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCB3aWR0aDogJzEwMCUnIH19PlxyXG4gICAgICA8aW5wdXQgIHN0eWxlPXt7Li4uc3R5bGVzLC4uLnN0eWxlfX0gey4uLnByb3BzfSBkYXRhLXRlc3RpZD17aWR9IHR5cGU9e3R5cGV9IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xyXG4gIGNvbnN0IHsgdGl0bGUsc3R5bGUsaWQgfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIHsuLi5wcm9wc30+XHJcbiAgICAgIHt0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2NvbXBvbmVudHMvbGlzdCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVGV4dElucHV0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQgeyBzYXZlTWVzc2FnZSB9IGZyb20gJy4vc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2F2ZVBlbmRpbmdIYW5nb3V0J1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgaW5wdXRDb250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGJvcmRlcjogJyM3MzczNzMgc29saWQgMXB4JyxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICBwYWRkaW5nOiAxMCxcclxuICAgIGZsZXg6IDEsXHJcbiAgICBib3JkZXI6ICd3aGl0ZScsXHJcblxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0KHtcclxuICBoYW5nb3V0cyxcclxuICBvblNlYXJjaElucHV0LFxyXG4gIG9uRmV0Y2hIYW5nb3V0cyxcclxuICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgc2VhcmNoXHJcbn0pIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKClcclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0U2VsZWN0aW9uKGUpIHtcclxuICAgIGNvbnN0IGlkID0gZS50YXJnZXQuaWRcclxuICAgIG9uU2VsZWN0SGFuZ291dChlKVxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoZyA9PiBnLnVzZXJuYW1lID09PSBpZClcclxuXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSlcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZ1RvcDogNjggfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxyXG4gICAgICAgICAgaWQ9XCJzZWFyY2gtaW5wdXRcIlxyXG4gICAgICAgICAgdHlwZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2hJbnB1dH1cclxuICAgICAgICAgIHN0eWxlPXtzdHlsZS5pbnB1dH1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxCdXR0b25cclxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWJ0blwiXHJcbiAgICAgICAgICBkaXNhYmxlZD17IXNlYXJjaH1cclxuICAgICAgICAgIHRpdGxlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG9uQ2xpY2s9e29uRmV0Y2hIYW5nb3V0c31cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxMaXN0IGlkPVwiaGFuZ291dHMtbGlzdFwiPlxyXG4gICAgICAgIHtoYW5nb3V0cyAmJlxyXG4gICAgICAgICAgaGFuZ291dHMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgPExpc3RJdGVtIGlkPXtnLnVzZXJuYW1lfSBkYXRhLXRlc3RpZD17Zy51c2VybmFtZX0gb25DbGljaz17aGFuZGxlSGFuZ291dFNlbGVjdGlvbn0+XHJcbiAgICAgICAgICAgICAgICB7Zy51c2VybmFtZX1cclxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2VlZWVlZScsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTGF5b3V0KHsgY2hpbGRyZW4sIHN0eWxlLCBpZCB9KSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9e2lkfSBzdHlsZT17eyAuLi5zdHlsZXMucm9vdCwgLi4uc3R5bGUgfX0+e2NoaWxkcmVufTwvZGl2PjtcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gcmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pe1xyXG4gICAgcmV0dXJuIHVucmVhZGhhbmdvdXRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gKGFjY3VtdWxhdG9yID0gW3sgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH1dKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3Qgb2JqID0gYWNjdW11bGF0b3IuZmluZChcclxuICAgICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWUgJiYgY3VycmVudC5zdGF0ZSA9PT0gJ01FU1NBTkdFUidcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYWNjdW11bGF0b3IuZmluZEluZGV4KFxyXG4gICAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XHJcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnNwbGljZShpbmRleCwgMSwge1xyXG4gICAgICAgICAgICAgIC4uLm9iaixcclxuICAgICAgICAgICAgICBtZXNzYWdlQ291bnQ6ICsrb2JqLm1lc3NhZ2VDb3VudCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHsgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgIH0sIFtdKTtcclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL0J1dHRvbic7XHJcbmltcG9ydCB7cmVzZXRIYW5nb3V0fSBmcm9tICcuLi9zdGF0ZS9hY3Rpb25zJ1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjaGVja2JveDogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGNoZWNrYm94Um9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICBwYWRkaW5nOiAxNixcclxuICB9LFxyXG4gIGxheW91dDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmdUb3A6NjhcclxuICB9LFxyXG4gIGJ0bjoge1xyXG4gICAgZmxleDogMSxcclxuICAgIG1hcmdpblJpZ2h0OiA0LFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9jayh7IG9uQ2FuY2VsLCBvbkJsb2NrLCBvblJlcG9ydCB9KSB7XHJcblxyXG4gXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmNoZWNrYm94Um9vdH0+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHN0eWxlPXtzdHlsZS5jaGVja2JveH0gb25DaGFuZ2U9e29uUmVwb3J0fSAvPlxyXG4gICAgICAgIDxsYWJlbD5SZXBvcnQ8L2xhYmVsPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XHJcbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkNhbmNlbFwiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2FuY2VsfSAvPlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJCbG9ja1wiIHN0eWxlPXtzdHlsZS5idG59IGlkPVwiQkxPQ0tcIiBvbkNsaWNrPXtvbkJsb2NrfSBkYXRhLXRlc3RpZD1cImJsb2NrLWJ0blwiIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIG9uQ2xpY2ssXHJcbiAgaWQsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2Z1xyXG4gICAgICBoZWlnaHQ9e2hlaWdodH1cclxuICAgICAgdmlld0JveD0nMCAwIDI0IDI0J1xyXG4gICAgICB3aWR0aD17d2lkdGh9XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGlkPXtpZH1cclxuICAgID5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gaWQ9e2lkfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGlkPXtpZH1cclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnpNNCAxMmMwLTQuNDIgMy41OC04IDgtOCAxLjg1IDAgMy41NS42MyA0LjkgMS42OUw1LjY5IDE2LjlDNC42MyAxNS41NSA0IDEzLjg1IDQgMTJ6bTggOGMtMS44NSAwLTMuNTUtLjYzLTQuOS0xLjY5TDE4LjMxIDcuMUMxOS4zNyA4LjQ1IDIwIDEwLjE1IDIwIDEyYzAgNC40Mi0zLjU4IDgtOCA4eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBDZW50ZXIoeyBjaGlsZHJlbiwgc3R5bGUgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgIC4uLnN0eWxlLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2ljb25zL0Jsb2NrJztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvQnV0dG9uJztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xyXG5pbXBvcnQge3Jlc2V0SGFuZ291dH0gZnJvbSAnLi4vc3RhdGUvYWN0aW9ucydcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZ1RvcDo2OFxyXG4gIH0sXHJcbiAgYnRuOiB7XHJcbiAgICBmbGV4OiAxLFxyXG4gICAgbWFyZ2luUmlnaHQ6IDQsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrZWQoeyBoYW5nb3V0LCBvblVuYmxvY2ssIG9uQ2xvc2UgfSkge1xyXG5cclxuICAvLyB1c2VFZmZlY3QoKCk9PntcclxuICAvLyAgIHJldHVybiAoKT0+e1xyXG5cclxuICAvLyAgICAgcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pXHJcbiAgLy8gICB9XHJcbiAgLy8gfSxbXSlcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImJsb2NrZWQtdWlcIj5cclxuICAgICAgPENlbnRlciBzdHlsZT17eyBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XHJcbiAgICAgICAgPEJsb2NrIHdpZHRoPVwiNjBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwicmVkXCIgLz5cclxuICAgICAgICA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LnVzZXJuYW1lfTwvYj4gaXMgYmxvY2tlZFxyXG4gICAgICA8L0NlbnRlcj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDbG9zZVwiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xvc2V9IC8+XHJcbiAgICAgICAgPEJ1dHRvbiBpZD0nVU5CTE9DSycgdGl0bGU9XCJVbmJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25VbmJsb2NrfSBkYXRhLXRlc3RpZD0ndW5ibG9jay1idG4nLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gRGVsZXRlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXJjaGl2ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17MjR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMjAuNTQgNS4yM2wtMS4zOS0xLjY4QzE4Ljg4IDMuMjEgMTguNDcgMyAxOCAzSDZjLS40NyAwLS44OC4yMS0xLjE2LjU1TDMuNDYgNS4yM0MzLjE3IDUuNTcgMyA2LjAyIDMgNi41VjE5YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNi41YzAtLjQ4LS4xNy0uOTMtLjQ2LTEuMjd6TTEyIDE3LjVMNi41IDEySDEwdi0yaDR2MmgzLjVMMTIgMTcuNXpNNS4xMiA1bC44MS0xaDEybC45NCAxSDUuMTJ6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcclxuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSAnLi4vLi4vaWNvbnMvRGVsZXRlJztcclxuaW1wb3J0IHsgQXJjaGl2ZSB9IGZyb20gJy4uLy4uL2ljb25zL0FyY2hpdmUnO1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2ljb25zL0Jsb2NrJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpY29uQnRuOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbjogOCB9LFxyXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGJ0bkNvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbiAgYnRuT2s6IHtcclxuICAgIG1hcmdpbjogOCxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xyXG4gIG9uQmxvY2ssXHJcbiAgb25EZWxldGUsXHJcbiAgb25BcmNoaXZlLFxyXG4gIG9uTm90aWZpY2F0aW9uLFxyXG4gIG9uQ29udmVyc2F0aW9uSGlzdG9yeSxcclxuICBvbk5hdmlnYXRpb24sXHJcbiAgb25PayxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XHJcbiAgICAgICAgPENoZWNrYm94XHJcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxociAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Db250YWluZXJ9PlxyXG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gaWQ9XCJiY2t1aVwiIHRpdGxlPVwiQmxvY2tcIiBJY29uPXtCbG9ja30gb25DbGljaz17b25OYXZpZ2F0aW9ufSAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bk9rfT5cclxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uT2t9Pk9LPC9CdXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gSWNvbkJ1dHRvbih7IEljb24sIHRpdGxlLCBvbkNsaWNrLGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUuaWNvbkJ0bn0+XHJcbiAgICAgIDxidXR0b24gaWQ9e2lkfSBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsaWNrfSBkYXRhLXRlc3RpZD17YCR7aWR9LWJ0bmB9PlxyXG4gICAgICAgIDxJY29uIGlkPXtpZH0vPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGRpdj57dGl0bGV9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDaGVja2JveCh7IGxhYmVsLCBvbkNoYW5nZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiA4LCBtYXJnaW5Ub3A6IDggfX0+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XHJcbiAgICAgIDxsYWJlbD57bGFiZWx9PC9sYWJlbD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnd2hpdGUnLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCBQZXJzb25BZGQgZnJvbSAnLi4vLi4vaWNvbnMvUGVyc29uQWRkJztcclxuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9UZXh0SW5wdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL0J1dHRvbic7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xyXG5pbXBvcnQge3Jlc2V0SGFuZ291dH0gZnJvbSAnLi4vc3RhdGUvYWN0aW9ucydcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICB9LFxyXG59O1xyXG4vL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGUoeyBoYW5nb3V0LCBvbkludml0ZSwgb25NZXNzYWdlVGV4dCxtZXNzYWdlVGV4dCwgdmFsdWUgfSkge1xyXG5cclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fWlkPVwiaW52aXRlLXVpXCI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPFBlcnNvbkFkZCBjb2xvcj1cImdyZWVuXCIgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgU3RhcnQgQ29udmVyc2F0aW9uIHdpdGggPGI+e2hhbmdvdXQgJiYgaGFuZ291dC5lbWFpbH08L2I+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgICA8VGV4dElucHV0IGlkPVwibWVzc2FnZVRleHRJbnB1dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSB2YWx1ZT17bWVzc2FnZVRleHR9IC8+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIlNlbmQgSW52aXRlXCIgaWQ9XCJJTlZJVEVcIiBvbkNsaWNrPXtvbkludml0ZX0gZGF0YS10ZXN0aWQ9J29uaW52aXRlLWJ0bicgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERvbmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTkgMTYuMkw0LjggMTJsLTEuNCAxLjRMOSAxOSAyMSA3bC0xLjQtMS40TDkgMTYuMnonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyBEb25lIH0gZnJvbSAnLi4vLi4vaWNvbnMvRG9uZSc7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVlKHsgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8RG9uZSB3aWR0aD1cIjcwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cImdyZWVuXCIgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPHA+XHJcbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxyXG4gICAgICAgICAgeW91ciBpbnZpdGlvbiBoYXMgYmVlbiBhY2NlcHRlZC5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgYm9yZGVyQ29sb3I6ICcjZWVlZWVlJyxcclxuICAgIGJvcmRlclN0eWxlOiAnc29saWQnLFxyXG4gICAgYm9yZGVyV2lkdGg6IDEsXHJcbiAgICBib3JkZXJSYWRpdXM6IDUsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgbWluSGVpZ2h0OiAzNSxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICB9LFxyXG4gIHVzZXJuYW1lOiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgbG9nOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBjb2xvcjogJyM3MzczNzMnLFxyXG4gICAgZm9udFNpemU6IDEwLFxyXG4gIH0sXHJcbiAgbWVzc2FnZToge30sXHJcbn07XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSx0aW1lc3RhbXAgfSA9IG1lc3NhZ2U7XHJcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCB7IGRldmljZSB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIGZ1bmN0aW9uIGNvbnZlcnRNUyhtcykge1xyXG4gICAgdmFyIGQsIGgsIG0sIHM7XHJcbiAgICBzID0gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xyXG4gICAgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcclxuICAgIHMgPSBzICUgNjA7XHJcbiAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xyXG4gICAgbSA9IG0gJSA2MDtcclxuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XHJcbiAgICBoID0gaCAlIDI0O1xyXG4gICAgc2V0RGF5cyhkKTtcclxuICAgIHNldEhvdXJzKGgpO1xyXG4gICAgc2V0TWludXRlcyhtKTtcclxuICAgIHNldFNlY29uZHMocyk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYodGltZXN0YW1wKXtcclxuICBcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSB0aW1lc3RhbXApO1xyXG4gICAgICB9LCAwKTtcclxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcclxuICAgICAgfSwgNjAwMDApO1xyXG4gXHJcblxyXG4gICAgfVxyXG4gICBcclxuICB9LCBbdGltZXN0YW1wXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIG1hcmdpbkJvdHRvbTogMyB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VcIlxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2BtZXNzYWdlLWZvbnQtJHtkZXZpY2V9LXNpemVgfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH1cclxuICAgICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5sb2d9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XHJcbiAgPGRpdj5cclxuICAgICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA9PT0gMCAmJiBtaW51dGVzID4gMCAmJiA8ZGl2PnttaW51dGVzfSBtaW51dGVzIGFnbyA8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtob3Vyc30gaG91cnMge21pbnV0ZXN9IG1pbnV0ZXMgYWdveycgJ31cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAge2RheXMgPD0gMTAgJiYgZGF5cyA+IDEgJiYgPGRpdj57ZGF5c30gZGF5cyBhZ288L2Rpdj59XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvQnV0dG9uJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL21lc3NhZ2UtdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgcGFkZGluZ1RvcDogNzAsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBwYWRkaW5nQm90dG9tOjgsXHJcbiBcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlcih7IGhhbmdvdXQsIG9uQWNjZXB0LCBvbkRlY2xpbmUgfSkge1xyXG4gXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luTGVmdDogOCwgZGlzcGxheTonZmxleCcgfX0+XHJcbiAgICAgICAgICB7aGFuZ291dCAmJiBoYW5nb3V0Lm1lc3NhZ2UgJiYgKFxyXG4gICAgICAgICAgICA8TWVzc2FnZVxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U9e1xyXG4gICAgICAgICAgICAgICAgaGFuZ291dCAmJlxyXG4gICAgICAgICAgICAgICAgaGFuZ291dC5tZXNzYWdlICYmIHtcclxuICAgICAgICAgICAgICAgICAgLi4uaGFuZ291dC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxmbG9hdDonbGVmdCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyxwYWRkaW5nTGVmdDo4LHBhZGRpbmdSaWdodDo4IH19PlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkRFQ0xJTkVcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkRlY2xpbmV9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVjbGluZS1idG5cIlxyXG4gICAgICAgICAgICB0aXRsZT1cIkRlY2xpbmVcIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5SaWdodDogNCwgY29sb3I6ICdyZWQnIH19XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkFDQ0VQVFwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2VwdC1idG5cIlxyXG4gICAgICAgICAgICB0aXRsZT1cIkFjY2VwdFwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpbkxlZnQ6IDQsIGNvbG9yOiAnZ3JlZW4nIH19XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvVGV4dElucHV0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcidcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICAvL21hcmdpbjowXHJcbiAgICBwYWRkaW5nOiA1LFxyXG4gICAgbWFyZ2luTGVmdDogOCxcclxuICAgIG1hcmdpblJpZ2h0OiA4LFxyXG4gICAgbWFyZ2luVG9wOiA4LFxyXG4gICAgbWFyZ2luQm90dG9tOiA4LFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgXHJcbiAgfSxcclxuICBidG46e1xyXG4gICAgcGFkZGluZzogOCxcclxuXHJcbiAgICBtYXJnaW5SaWdodDogMTYsXHJcbiAgICBtYXJnaW5Ub3A6IDgsXHJcbiAgICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGZsZXg6IDEsXHJcbiAgfVxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZUVkaXRvcih7IG1lc3NhZ2VUZXh0LCBvbk1lc3NhZ2VUZXh0LCBvbk1lc3NhZ2UsaGFuZ291dCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5yb290fT5cclxuICAgICBcclxuICAgICAgPGlucHV0IHN0eWxlPXtzdHlsZXMuaW5wdXR9IGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHR5cGU9XCJ0ZXh0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9ICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtaW5wdXRcIiB2YWx1ZT17bWVzc2FnZVRleHR9Lz5cclxuICAgICAgXHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPEJ1dHRvbiBkaXNhYmxlZD17aGFuZ291dCAmJmhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCd9ICBzdHlsZT17c3R5bGVzLmJ0bn0gIHRpdGxlPVwic2VuZFwiIGlkPSdNRVNTQUdFJyBvbkNsaWNrPXtvbk1lc3NhZ2V9IGRhdGEtdGVzdGlkPSdzZW5kLWJ0bicvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBmbG9hdDogJ3JpZ2h0JyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBmb250U2l6ZTogMTYsXHJcbiAgICB0ZXh0QWxpZ246ICdlbmQnXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlKHsgbWVzc2FnZSB9KSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlci1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH08L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgZmxvYXQ6ICdyaWdodCcsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgZm9udFNpemU6IDE2LFxyXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VkTWVzc2FnZSh7IG1lc3NhZ2Usb25OYXZpZ2F0aW9uIH0pIHtcclxuICAgIGZ1bmN0aW9uIGhhbmRsZU5hdmlnYXRpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgb25OYXZpZ2F0aW9uKGUpXHJcbiAgICB9XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VkLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fVxyXG4gICAgPGEgaWQ9XCJVTkJMT0NLXCIgZGF0YS10ZXN0aWQ9XCJzZWVtb3JlLWJ0blwiIGhyZWY9XCIvXCIgb25DbGljaz17aGFuZGxlTmF2aWdhdGlvbn0+c2VlIG1vcmU8L2E+XHJcbiAgICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi9NZXNzYWdlRWRpdG9yJztcclxuaW1wb3J0IHsgQmxvY2tlck1lc3NhZ2UgfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlJ1xyXG5pbXBvcnQge0Jsb2NrZWRNZXNzYWdlfSBmcm9tICcuL0Jsb2NrZWRNZXNzYWdlJ1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgbWVzc2FnZUNvbnRhaW5lcjoge1xyXG4gICAgLy8gd2lkdGg6ICcxMDAlJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZzogMyxcclxuICAvLyAgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyxcclxuICAgIGZsZXg6IDE1LFxyXG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXHJcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCJcclxuXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VzKHtcclxuICBtZXNzYWdlcyxcclxuICBvbk1lc3NhZ2UsXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvblxyXG59KSB7XHJcbiAgY29uc3Qgc2Nyb2xsZXJSZWYgPSB1c2VSZWYobnVsbCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobWVzc2FnZXMpIHtcclxuICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICAgIH1cclxuICB9LCBbbWVzc2FnZXNdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25TZW5kKGUpIHtcclxuICAgIG9uTWVzc2FnZShlKTtcclxuICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGJveFNpemluZzogJ2JvcmRlci1ib3gnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgcGFkZGluZ1RvcDogNzUgfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5tZXNzYWdlQ29udGFpbmVyfSByZWY9e3Njcm9sbGVyUmVmfT5cclxuICAgICAgICB7bWVzc2FnZXMgJiZcclxuICAgICAgICAgIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcclxuICAgICAgICAgICAgKG0pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cclxuICAgICAgICAgICAgICAgIHsnICd9XHJcbiAgICAgICAgICAgICAgICB7IW0udHlwZSAmJiA8TWVzc2FnZSBtZXNzYWdlPXttfSAvPn1cclxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSAnYmxvY2tlcicgJiYgPEJsb2NrZXJNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VkJyAmJiA8QmxvY2tlZE1lc3NhZ2UgbWVzc2FnZT17bX0gb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259Lz59XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEgfX0+XHJcbiAgICAgICAgPE1lc3NhZ2VFZGl0b3JcclxuICAgICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cclxuICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cclxuICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5mdW5jdGlvbiBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcclxuICBpZiAobWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCAmJiB1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2VzLm1hcCgobXNnKSA9PiB7XHJcbiAgICAgIGlmIChtc2cudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ3JpZ2h0JywgdXNlcm5hbWU6ICdtZScgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAnbGVmdCcgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSB7XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vbWVzc2FnZS11aS9NZXNzYWdlcyc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IHtyZXNldEhhbmdvdXR9IGZyb20gJy4uL3N0YXRlL2FjdGlvbnMnXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ2NoYXQoe1xyXG4gIG1lc3NhZ2VzID0gW10sXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBvbk1lc3NhZ2UsXHJcbiAgbWVzc2FnZVRleHQsXHJcbiAgdXNlcm5hbWUsXHJcbiAgaGFuZ291dCxcclxuICBvbk5hdmlnYXRpb24sXHJcbiAgZGlzcGF0Y2hcclxufSkge1xyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIHJldHVybiAoKT0+e1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc29sZS5sb2coJ2hhbmdvdXQgY2xlYXJlZCcpXHJcbiAgICAgLy8gcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pXHJcbiAgICB9XHJcbiAgfSxbXSlcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImhhbmdjaGF0LXVpXCIgPlxyXG4gICAgICA8TWVzc2FnZXNcclxuICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XHJcbiAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XHJcbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XHJcbiAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICBtZXNzYWdlVGV4dCA9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgLz5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUaGVtZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggVGhlbWVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgXHJcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRTdGF0ZSk7XHJcblxyXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0LCBUaGVtZVByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2NvbXBvbmVudHMvbGlzdCc7XHJcblxyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuZXhwb3J0IGZ1bmN0aW9uIERyYXdlckNvbnRlbnQoeyBvcGVuIH0pIHtcclxuICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTonLycscm91dGU6YC8ke2lkfWB9KVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaGFuZ291dHNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBIYW5nb3V0c1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBCbG9ja1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tlZFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEJsb2NrZWRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEludml0ZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEludml0ZWVcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZXJcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBJbnZpdGVyXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nY2hhdFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEhhbmdjaGF0XHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuXHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiY29uZmlndXJlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgQ29uZmlndXJlXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJtZXNzYWdlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgTWVzc2FnZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwibWVzc2FnZXNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBNZXNzYWdlc1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwib25saW5lXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBvbmxpbmVTdGF0dXNcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cInVucmVhZFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgVXJlYWRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImJsb2NrZXItbWVzc2FnZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgQmxvY2tlck1lc3NhZ2VcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImljb25zXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBJY29uc1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBtZXNzYWdlSWNvbiBmcm9tICcuL21lc3NhZ2UucG5nJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgY291bnQ6IHtcclxuICAgIHdpZHRoOiAzMCxcclxuICAgIGhlaWdodDogMzAsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicsXHJcbiAgICBjb2xvcjogJ3doaXRlJyxcclxuICAgIHRleHRBbGlnbjonY2VudGVyJyxcclxuICAgIGJvcmRlclJhZGl1czoxNSxcclxuICAgIGRpc3BsYXk6J2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczonY2VudGVyJyxcclxuICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UoeyBjb3VudD0wIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XHJcbiAgICAgICAgICA8ZGl2Pm1lc3NhZ2U6PC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmNvdW50fSBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtY291bnRcIj57Y291bnR9PC9kaXY+IFxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICcuLi9pY29ucy9NZXNzYWdlJ1xyXG5leHBvcnQgZnVuY3Rpb24gSWNvbnNEZW1vKCl7XHJcbiAgICByZXR1cm4gPGRpdj5cclxuXHJcbiAgICAgICAgPE1lc3NhZ2UgY291bnQ9ezF9Lz5cclxuICAgIDwvZGl2PlxyXG59IiwiZXhwb3J0IGNvbnN0IG1lc3NhZ2VzID1bXHJcbiAgICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxyXG4gIH0sXHJcbiAgIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBPayBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMjE2MzQ2MixcclxuICB9LHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgSG93IGFyZSB5b3UgZGVtb2AsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgYWxsIHJpZ2h0YCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzY3NzU3MyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ2LFxyXG4gIH0sXHJcbiAgLFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonZGVtbycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDgsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG5dIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2NvbXBvbmVudHMvbGlzdCc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVW5yZWFkSGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyxvblNlbGVjdFVucmVhZCxvblJlbW92ZVVucmVhZCB9KSB7XHJcblxyXG4gIGNvbnN0IFtpdGVtcyxzZXRJdGVtc10gPXVzZVN0YXRlKFtdKVxyXG51c2VFZmZlY3QoKCk9PntcclxuaWYodW5yZWFkaGFuZ291dHMpe1xyXG5cclxuICBjb25zdCByZWR1Y2VkID1yZWR1Y2VyVW5yZWFkaGFuZ291dHMoe3VucmVhZGhhbmdvdXRzfSlcclxuIFxyXG4gIHNldEl0ZW1zKHJlZHVjZWQpXHJcbn1cclxuXHJcbn0sW3VucmVhZGhhbmdvdXRzXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9J3VucmVhZGhhbmdvdXRzJyBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAge2l0ZW1zICYmXHJcbiAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBpdGVtcy5tYXAoKHUpID0+IHtcclxuICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCd9fT5cclxuICAgICAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e29uU2VsZWN0VW5yZWFkfSBpZD17dS51c2VybmFtZX0gc3R5bGU9e3tmbGV4OjV9fSBkYXRhLXRlc3RpZD17YCR7dS51c2VybmFtZX0tc2VsZWN0YH0+e3UudXNlcm5hbWV9IG1lc3NhZ2VzOiB7dS5tZXNzYWdlQ291bnR9PC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e29uUmVtb3ZlVW5yZWFkfSBpZD17dS51c2VybmFtZX0gc3R5bGU9e3tjb2xvcjoncmVkJ319IGRhdGEtdGVzdGlkPXtgJHt1LnVzZXJuYW1lfS1yZW1vdmVgfT54PC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB9KX1cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IFVucmVhZCBmcm9tICcuLi9oYW5nb3V0cy9VbnJlYWRIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuY29uc3QgdW5yZWFkcyA9IFtcclxuICB7XHJcbiAgICB1c2VybmFtZTogJ2RlbW8nLFxyXG4gICAgc3RhdGU6ICdNRVNTQU5HRVInLFxyXG4gICAgbWVzc2FnZTogeyB0ZXh0OiAnSGVsbG8geW91JywgdGltZXN0YW1wOiAxNTkxODEwNDU4NjMwIH0sXHJcbiAgfSxcclxuXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdiZXJvJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5yZWFkRGVtbygpIHtcclxuICByZXR1cm4gPFVucmVhZCB1bnJlYWRoYW5nb3V0cz17cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0czp1bnJlYWRzfSl9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge0Jsb2NrZXJNZXNzYWdlfSBmcm9tICcuLi9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZXJNZXNzYWdlJ1xyXG5cclxuY29uc3QgbWVzc2FnZSA9e3RleHQ6J1lvdSBjYW4gbm90IHNlbmQgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZCcsXHJcbnRpbWVzdGFtcDoxMjMyMyxcclxudXNlcm5hbWU6J2RlbW8nXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlRGVtbygpe1xyXG4gICAgcmV0dXJuIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfS8+XHJcbn0iLCJpbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBSb3V0ZVByb3ZpZGVyLCBBcHBSb3V0ZSB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcclxuaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi9OYXZpZ2F0aW9uJztcclxuaW1wb3J0IEhhbmdvdXQgZnJvbSAnLi4vaGFuZ291dHMvSGFuZ291dCc7XHJcbmltcG9ydCBCbG9jayBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jayc7XHJcbmltcG9ydCBCbG9ja2VkIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrZWQnO1xyXG5pbXBvcnQgQ29uZmlndXJlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0NvbmZpZ3VyZSc7XHJcbmltcG9ydCBJbnZpdGUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlJztcclxuaW1wb3J0IEludml0ZWUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlZSc7XHJcbmltcG9ydCBJbnZpdGVyIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXInO1xyXG5pbXBvcnQgSGFuZ2NoYXQgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlJztcclxuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VzJztcclxuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZUVkaXRvcic7XHJcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJy4uL2ljb25zL29ubGluZVN0YXR1cyc7XHJcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9jb21wb25lbnRzL2xpc3QnO1xyXG5pbXBvcnQgeyBEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi9EcmF3ZXJDb250ZW50JztcclxuaW1wb3J0IHtJY29uc0RlbW99IGZyb20gJy4vSWNvbnNEZW1vJ1xyXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcclxuaW1wb3J0IHtVbnJlYWREZW1vfSBmcm9tICcuL1VyZWFkRGVtbydcclxuaW1wb3J0IHtCbG9ja2VyTWVzc2FnZURlbW8gfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlRGVtbydcclxuY29uc3QgaGFuZ291dHMgPSBbXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJvbmUnIH0sXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXHJcbiAgeyB1c2VybmFtZTogJ3VzZXJ0aHJlZScgfSxcclxuXTtcclxuY29uc3QgaGFuZ291dCA9IHtcclxuICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcclxuICBlbWFpbDogJ3Rlc3RAZ21haWwuY29tJyxcclxuICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXHJcbn07XHJcbmNvbnN0IG1lc3NhZ2UgPSB7XHJcbiAgdXNlcm5hbWU6ICdicmVubycsXHJcbiAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gIHRpbWVzdGFtcDogMTU5MTMzMTc2NzgzNixcclxufTtcclxuLy9cclxucmVuZGVyKFxyXG4gIDxUaGVtZVByb3ZpZGVyXHJcbiAgICBpbml0U3RhdGU9e3tcclxuICAgICAgcHJpbWFyeToge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcclxuICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcclxuICAgICAgfSxcclxuICAgIH19XHJcbiAgPlxyXG4gICAgPEFwcFJvdXRlUHJvdmlkZXIgaW5pdFN0YXRlPXt7IGZlYXR1cmVSb3V0ZTogJy8nLCByb3V0ZTogJy91bnJlYWQnIH19PlxyXG4gICAgICA8TmF2aWdhdGlvbiBkcmF3ZXJDb250ZW50PXs8RHJhd2VyQ29udGVudCAvPn0+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrXCI+XHJcbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZWRcIj5cclxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cclxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZVwiPlxyXG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlZVwiPlxyXG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZXJcIj5cclxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nY2hhdFwiPlxyXG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VcIj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cclxuICAgICAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0gdXNlcm5hbWU9e2hhbmdvdXQudXNlcm5hbWV9IC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL29ubGluZVwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cclxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlc1wiPlxyXG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL3VucmVhZFwiPlxyXG4gICAgICAgICAgPFVucmVhZERlbW8vPlxyXG4gICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tlci1tZXNzYWdlXCI+XHJcbiAgICAgICAgICA8QmxvY2tlck1lc3NhZ2VEZW1vLz5cclxuICAgICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pY29uc1wiPlxyXG4gICAgICAgICAgPEljb25zRGVtby8+XHJcbiAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPC9OYXZpZ2F0aW9uPlxyXG4gICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gIDwvVGhlbWVQcm92aWRlcj4sXHJcbiAgZG9jdW1lbnQuYm9keVxyXG4pO1xyXG4iXSwibmFtZXMiOlsidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwiRkVBVFVSRV9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJ1c2VBcHBSb3V0ZSIsImRpc3BhdGNoIiwib25BcHBSb3V0ZSIsIkFwcFJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImZpbmQiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInZhbHVlIiwidXNlTWVtbyIsIk5hdmlnYXRpb24iLCJkcmF3ZXJDb250ZW50IiwiZGlzcGxheSIsImp1c3RpZnlDb250ZW50IiwicGFkZGluZyIsImZsZXgiLCJMaXN0IiwiTGlzdEl0ZW0iLCJzdHlsZXMiLCJtYXJnaW5MZWZ0IiwibWFyZ2luUmlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJib3hTaXppbmciLCJUZXh0SW5wdXQiLCJpZCIsInN0eWxlIiwid2lkdGgiLCJCdXR0b24iLCJ0aXRsZSIsImlucHV0Q29udGFpbmVyIiwiYm9yZGVyIiwiaW5wdXQiLCJIYW5nb3V0IiwiaGFuZ291dHMiLCJvblNlYXJjaElucHV0Iiwib25GZXRjaEhhbmdvdXRzIiwib25TZWxlY3RIYW5nb3V0Iiwic2VhcmNoIiwiaGFuZGxlSGFuZ291dFNlbGVjdGlvbiIsInRhcmdldCIsImhhbmdvdXQiLCJ1c2VybmFtZSIsInBhZGRpbmdUb3AiLCJsZW5ndGgiLCJtYXAiLCJyb290IiwiYmFja2dyb3VuZENvbG9yIiwiaGVpZ2h0IiwiTGF5b3V0IiwicmVkdWNlclVucmVhZGhhbmdvdXRzIiwidW5yZWFkaGFuZ291dHMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsImN1cnJlbnQiLCJpbmRleCIsIm1lc3NhZ2VDb3VudCIsIm9iaiIsImZpbmRJbmRleCIsInNwbGljZSIsInB1c2giLCJjaGVja2JveCIsImNoZWNrYm94Um9vdCIsImFsaWduSXRlbXMiLCJsYXlvdXQiLCJmbGV4RGlyZWN0aW9uIiwiYnRuIiwiQmxvY2siLCJvbkNhbmNlbCIsIm9uQmxvY2siLCJvblJlcG9ydCIsImZpbGwiLCJjb2xvciIsIm9uQ2xpY2siLCJDZW50ZXIiLCJ0ZXh0QWxpZ24iLCJCbG9ja2VkIiwib25VbmJsb2NrIiwib25DbG9zZSIsIkRlbGV0ZSIsIkFyY2hpdmUiLCJpY29uQnRuIiwibWFyZ2luIiwiYnRuQ29udGFpbmVyIiwiYnRuT2siLCJDb25maWd1cmUiLCJvbkRlbGV0ZSIsIm9uQXJjaGl2ZSIsIm9uTm90aWZpY2F0aW9uIiwib25Db252ZXJzYXRpb25IaXN0b3J5Iiwib25OYXZpZ2F0aW9uIiwib25PayIsIkljb25CdXR0b24iLCJJY29uIiwiQ2hlY2tib3giLCJsYWJlbCIsIm9uQ2hhbmdlIiwiUGVyc29uQWRkSWNvbiIsIkludml0ZSIsIm9uSW52aXRlIiwib25NZXNzYWdlVGV4dCIsIm1lc3NhZ2VUZXh0IiwiUGVyc29uQWRkIiwiZW1haWwiLCJEb25lIiwiSW52aXRlZSIsInVzZU1lZGlhUXVlcnkiLCJzZXRXaWR0aCIsInVzZVN0YXRlIiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwidXNlRWZmZWN0IiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJmb250U2l6ZSIsIm1lc3NhZ2UiLCJNZXNzYWdlIiwiZmxvYXQiLCJ0aW1lc3RhbXAiLCJkYXlzIiwic2V0RGF5cyIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJkIiwiaCIsIk1hdGgiLCJmbG9vciIsInNldFRpbWVvdXQiLCJEYXRlIiwibm93Iiwic2V0SW50ZXJ2YWwiLCJ0ZXh0IiwicGFkZGluZ0JvdHRvbSIsIkludml0ZXIiLCJvbkFjY2VwdCIsIm9uRGVjbGluZSIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0IiwiTWVzc2FnZUVkaXRvciIsIm9uTWVzc2FnZSIsIkJsb2NrZXJNZXNzYWdlIiwiQmxvY2tlZE1lc3NhZ2UiLCJoYW5kbGVOYXZpZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJtZXNzYWdlQ29udGFpbmVyIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwic2Nyb2xsVG9wIiwic2Nyb2xsSGVpZ2h0Iiwib25TZW5kIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1zZyIsInNvcnQiLCJIYW5nY2hhdCIsIk9ubGluZVN0YXR1cyIsInJlYWR5U3RhdGUiLCJJc09ubGluZSIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwiVGhlbWVDb250ZXh0IiwiVGhlbWVQcm92aWRlciIsInNldFN0YXRlIiwiRHJhd2VyQ29udGVudCIsIm9wZW4iLCJoYW5kbGVSb3V0ZSIsImNvdW50IiwiSWNvbnNEZW1vIiwiVW5yZWFkSGFuZ291dHMiLCJvblNlbGVjdFVucmVhZCIsIm9uUmVtb3ZlVW5yZWFkIiwiaXRlbXMiLCJzZXRJdGVtcyIsInJlZHVjZWQiLCJ1bnJlYWRzIiwiVW5yZWFkRGVtbyIsIlVucmVhZCIsIkJsb2NrZXJNZXNzYWdlRGVtbyIsInJlbmRlciIsInByaW1hcnkiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsImRvY3VtZW50IiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyw4REFBOEQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQSxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBeUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXVHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDOztBQ0F0dEUsTUFBTVUsV0FBVyxHQUFFO0FBQ3RCQyxFQUFBQSxpQkFBaUIsRUFBQyxtQkFESTtBQUV0QkMsRUFBQUEscUJBQXFCLEVBQUM7QUFGQSxDQUFuQjs7QUNFQSxTQUFTQyxPQUFULENBQWlCQyxLQUFqQixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFDbkMsVUFBUUEsTUFBTSxDQUFDQyxJQUFmO0FBQ0ksU0FBS04sV0FBVyxDQUFDQyxpQkFBakI7QUFDSSxhQUFPLEVBQUUsR0FBR0csS0FBTDtBQUFZRyxRQUFBQSxLQUFLLEVBQUVGLE1BQU0sQ0FBQ0UsS0FBMUI7QUFBZ0NDLFFBQUFBLFlBQVksRUFBRUgsTUFBTSxDQUFDRztBQUFyRCxPQUFQOztBQUNKO0FBQ0ksYUFBT0osS0FBUDtBQUpSO0FBTUg7O0FDTEQsTUFBTUssZUFBZSxHQUFHQyxDQUFhLEVBQXJDOztBQUVDLFNBQVNDLGtCQUFULEdBQThCO0FBQzdCLFFBQU1DLE9BQU8sR0FBR0MsR0FBVSxDQUFDSixlQUFELENBQTFCOztBQUVBLE1BQUksQ0FBQ0csT0FBTCxFQUFjO0FBQ1osVUFBTSxJQUFJRSxLQUFKLENBQVUsdURBQVYsQ0FBTjtBQUNEOztBQUNELFNBQU9GLE9BQVA7QUFDRDtBQWVNLFNBQVNHLFdBQVQsR0FBdUI7QUFDNUIsUUFBTSxDQUFDWCxLQUFELEVBQU9ZLFFBQVAsSUFBaUJMLGtCQUFrQixFQUF6Qzs7QUFFQSxXQUFTTSxVQUFULENBQW9CO0FBQUNWLElBQUFBLEtBQUQ7QUFBT0MsSUFBQUE7QUFBUCxHQUFwQixFQUF5QztBQUN2Q1EsSUFBQUEsUUFBUSxDQUFDO0FBQUNWLE1BQUFBLElBQUksRUFBQ04sV0FBVyxDQUFDQyxpQkFBbEI7QUFBcUNPLE1BQUFBLFlBQXJDO0FBQWtERCxNQUFBQTtBQUFsRCxLQUFELENBQVI7QUFDRDs7QUFFRCxTQUFPO0FBQUNVLElBQUFBO0FBQUQsR0FBUDtBQUNEO0FBRU0sU0FBU0MsUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUI7QUFDOUIsUUFBTTtBQUFFQyxJQUFBQSxRQUFGO0FBQVlDLElBQUFBLElBQVo7QUFBa0JDLElBQUFBO0FBQWxCLE1BQTRCSCxLQUFsQztBQUVBLFFBQU0sQ0FBQ2YsS0FBRCxFQUFPWSxRQUFQLElBQW1CTCxrQkFBa0IsRUFBM0M7QUFDRixRQUFNO0FBQUNKLElBQUFBO0FBQUQsTUFBUUgsS0FBZDs7QUFDRSxNQUFJaUIsSUFBSSxJQUFJZCxLQUFLLEtBQUtjLElBQXRCLEVBQTRCO0FBQzFCLFdBQU9ELFFBQVA7QUFDRCxHQUZELE1BRU8sSUFBSUUsS0FBSyxJQUFJZixLQUFLLEtBQUtlLEtBQUssQ0FBQ0MsSUFBTixDQUFZNUIsQ0FBRCxJQUFPQSxDQUFDLEtBQUtZLEtBQXhCLENBQXZCLEVBQXVEO0FBQzVELFdBQU9hLFFBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRDtBQUNNLFNBQVNJLGdCQUFULENBQTBCTCxLQUExQixFQUFpQztBQUN0QyxRQUFNO0FBQUNNLElBQUFBO0FBQUQsTUFBWU4sS0FBbEI7QUFDQSxRQUFNLENBQUNmLEtBQUQsRUFBT1ksUUFBUCxJQUFpQlUsR0FBVSxDQUFDdkIsT0FBRCxFQUFTc0IsU0FBVCxDQUFqQztBQUdGLFFBQU1FLEtBQUssR0FBR0MsR0FBTyxDQUFDLE1BQU0sQ0FBQ3hCLEtBQUQsRUFBUVksUUFBUixDQUFQLEVBQTBCLENBQUNaLEtBQUQsQ0FBMUIsQ0FBckI7QUFDRSxTQUFPLEVBQUMsZUFBRCxDQUFpQixRQUFqQjtBQUEwQixJQUFBLEtBQUssRUFBRXVCO0FBQWpDLEtBQTRDUixLQUE1QyxFQUFQO0FBQ0Q7O0FDdkRjLFNBQVNVLFVBQVQsQ0FBb0JWLEtBQXBCLEVBQTJCO0FBQ3hDLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZVSxJQUFBQTtBQUFaLE1BQThCWCxLQUFwQztBQUdBLFNBQ0UsZUFDRTtBQUFJLElBQUEsS0FBSyxFQUFFO0FBQUVZLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CQyxNQUFBQSxjQUFjLEVBQUUsUUFBbkM7QUFBNkNDLE1BQUFBLE9BQU8sRUFBRTtBQUF0RDtBQUFYLGlCQURGLEVBSUU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFRixNQUFBQSxPQUFPLEVBQUU7QUFBWDtBQUFaLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFRyxNQUFBQSxJQUFJLEVBQUU7QUFBUjtBQUFaLEtBQTBCSixhQUExQixDQURGLEVBRUU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFSSxNQUFBQSxJQUFJLEVBQUU7QUFBUjtBQUFaLEtBQTJCZCxRQUEzQixDQUZGLENBSkYsQ0FERjtBQVdEOztBQ2pCRCxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQy9CLEVBQUUsS0FBSyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqQyxFQUFFLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDOUI7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQzFEO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxFQUFFLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztBQUMxQjtBQUNBLEVBQUUsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO0FBQzFCLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3pCLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QixLQUFLO0FBQ0wsR0FBRyxNQUFNO0FBQ1QsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO0FBQ3hCLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ25DLEdBQUcsTUFBTTtBQUNULElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEQsR0FBRztBQUNIOzs7OztBQ25CQyxTQUFTZSxJQUFULENBQWNoQixLQUFkLEVBQXFCO0FBQ3BCLFNBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQTBCQSxLQUExQixFQURGO0FBR0Q7O0FBR0EsU0FBU2lCLFFBQVQsQ0FBa0JqQixLQUFsQixFQUF5QjtBQUV4QixTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUErQkEsS0FBL0IsRUFERjtBQUdEOztBQ2hCRCxNQUFNa0IsTUFBTSxHQUFHO0FBQ2JKLEVBQUFBLE9BQU8sRUFBRSxDQURJO0FBRWJLLEVBQUFBLFVBQVUsRUFBRSxFQUZDO0FBR2JDLEVBQUFBLFdBQVcsRUFBRSxFQUhBO0FBSWJDLEVBQUFBLFNBQVMsRUFBRSxDQUpFO0FBS2JDLEVBQUFBLFlBQVksRUFBRSxDQUxEO0FBTWJDLEVBQUFBLFNBQVMsRUFBRSxZQU5FO0FBT2JSLEVBQUFBLElBQUksRUFBRTtBQVBPLENBQWY7QUFVTyxTQUFTUyxTQUFULENBQW1CeEIsS0FBbkIsRUFBMEI7QUFDL0IsUUFBTTtBQUFFeUIsSUFBQUEsRUFBRjtBQUFNdEMsSUFBQUEsSUFBSSxHQUFHLE1BQWI7QUFBb0J1QyxJQUFBQTtBQUFwQixNQUE4QjFCLEtBQXBDO0FBQ0EsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVZLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CZSxNQUFBQSxLQUFLLEVBQUU7QUFBMUI7QUFBWixLQUNFO0FBQVEsSUFBQSxLQUFLLEVBQUUsRUFBQyxHQUFHVCxNQUFKO0FBQVcsU0FBR1E7QUFBZDtBQUFmLEtBQXlDMUIsS0FBekM7QUFBZ0QsbUJBQWF5QixFQUE3RDtBQUFpRSxJQUFBLElBQUksRUFBRXRDO0FBQXZFLEtBREYsQ0FERjtBQUtEOztBQ2pCTSxTQUFTeUMsTUFBVCxDQUFnQjVCLEtBQWhCLEVBQXVCO0FBQzVCLFFBQU07QUFBRTZCLElBQUFBLEtBQUY7QUFBUUgsSUFBQUEsS0FBUjtBQUFjRCxJQUFBQTtBQUFkLE1BQXFCekIsS0FBM0I7QUFDQSxTQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUM7QUFBbEIsS0FBNEJBLEtBQTVCLEdBQ0c2QixLQURILENBREY7QUFLRDs7QUNERCxNQUFNSCxLQUFLLEdBQUc7QUFDWkksRUFBQUEsY0FBYyxFQUFFO0FBQ2RsQixJQUFBQSxPQUFPLEVBQUUsTUFESztBQUVkbUIsSUFBQUEsTUFBTSxFQUFFO0FBRk0sR0FESjtBQUtaQyxFQUFBQSxLQUFLLEVBQUU7QUFDTGxCLElBQUFBLE9BQU8sRUFBRSxFQURKO0FBRUxDLElBQUFBLElBQUksRUFBRSxDQUZEO0FBR0xnQixJQUFBQSxNQUFNLEVBQUU7QUFISDtBQUxLLENBQWQ7QUFhZSxTQUFTRSxPQUFULENBQWlCO0FBQzlCQyxFQUFBQSxRQUQ4QjtBQUU5QkMsRUFBQUEsYUFGOEI7QUFHOUJDLEVBQUFBLGVBSDhCO0FBSTlCQyxFQUFBQSxlQUo4QjtBQUs5QkMsRUFBQUE7QUFMOEIsQ0FBakIsRUFNWjtBQUNELFFBQU07QUFBRXhDLElBQUFBO0FBQUYsTUFBaUJGLFdBQVcsRUFBbEM7O0FBQ0EsV0FBUzJDLHNCQUFULENBQWdDcEUsQ0FBaEMsRUFBbUM7QUFDakMsVUFBTXNELEVBQUUsR0FBR3RELENBQUMsQ0FBQ3FFLE1BQUYsQ0FBU2YsRUFBcEI7QUFDQVksSUFBQUEsZUFBZSxDQUFDbEUsQ0FBRCxDQUFmO0FBQ0EsVUFBTXNFLE9BQU8sR0FBR1AsUUFBUSxDQUFDOUIsSUFBVCxDQUFjeEIsQ0FBQyxJQUFJQSxDQUFDLENBQUM4RCxRQUFGLEtBQWVqQixFQUFsQyxDQUFoQjtBQUVBM0IsSUFBQUEsVUFBVSxDQUFDO0FBQUVULE1BQUFBLFlBQVksRUFBRyxJQUFHb0QsT0FBTyxDQUFDeEQsS0FBTSxFQUFsQztBQUFxQ0csTUFBQUEsS0FBSyxFQUFFO0FBQTVDLEtBQUQsQ0FBVjtBQUNEOztBQUdELFNBRUU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFdUQsTUFBQUEsVUFBVSxFQUFFO0FBQWQ7QUFBWixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVqQixLQUFLLENBQUNJO0FBQWxCLEtBQ0UsRUFBQyxTQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUVRLE1BRFQ7QUFFRSxJQUFBLEVBQUUsRUFBQyxjQUZMO0FBR0UsSUFBQSxJQUFJLEVBQUMsUUFIUDtBQUlFLElBQUEsUUFBUSxFQUFFSCxhQUpaO0FBS0UsSUFBQSxLQUFLLEVBQUVULEtBQUssQ0FBQ007QUFMZixJQURGLEVBUUUsRUFBQyxNQUFEO0FBQ0UsbUJBQVksWUFEZDtBQUVFLElBQUEsUUFBUSxFQUFFLENBQUNNLE1BRmI7QUFHRSxJQUFBLEtBQUssRUFBQyxRQUhSO0FBSUUsSUFBQSxPQUFPLEVBQUVGO0FBSlgsSUFSRixDQURGLEVBaUJFLEVBQUMsSUFBRDtBQUFNLElBQUEsRUFBRSxFQUFDO0FBQVQsS0FDR0YsUUFBUSxJQUNQQSxRQUFRLENBQUNVLE1BQVQsR0FBa0IsQ0FEbkIsSUFFQ1YsUUFBUSxDQUFDVyxHQUFULENBQWNqRSxDQUFELElBQU87QUFDbEIsV0FDRSxFQUFDLFFBQUQ7QUFBVSxNQUFBLEVBQUUsRUFBRUEsQ0FBQyxDQUFDOEQsUUFBaEI7QUFBMEIscUJBQWE5RCxDQUFDLENBQUM4RCxRQUF6QztBQUFtRCxNQUFBLE9BQU8sRUFBRUg7QUFBNUQsT0FDRzNELENBQUMsQ0FBQzhELFFBREwsQ0FERjtBQUtELEdBTkQsQ0FISixDQWpCRixDQUZGO0FBaUNEOztBQ3RFRCxNQUFNeEIsUUFBTSxHQUFHO0FBQ2I0QixFQUFBQSxJQUFJLEVBQUU7QUFDSkMsSUFBQUEsZUFBZSxFQUFFLFNBRGI7QUFFSkMsSUFBQUEsTUFBTSxFQUFFO0FBRko7QUFETyxDQUFmO0FBTU8sU0FBU0MsTUFBVCxDQUFnQjtBQUFFaEQsRUFBQUEsUUFBRjtBQUFZeUIsRUFBQUEsS0FBWjtBQUFtQkQsRUFBQUE7QUFBbkIsQ0FBaEIsRUFBeUM7QUFDOUMsU0FBTztBQUFLLG1CQUFhQSxFQUFsQjtBQUFzQixJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUdQLFFBQU0sQ0FBQzRCLElBQVo7QUFBa0IsU0FBR3BCO0FBQXJCO0FBQTdCLEtBQTREekIsUUFBNUQsQ0FBUDtBQUNEOztBQ1RNLFNBQVNpRCxxQkFBVCxDQUErQjtBQUFDQyxFQUFBQTtBQUFELENBQS9CLEVBQWdEO0FBQ25ELFNBQU9BLGNBQWMsQ0FBQ0MsTUFBZixDQUFzQixDQUFDQyxXQUFELEVBQWNDLE9BQWQsRUFBdUJDLEtBQXZCLEtBQWlDO0FBQzFELFFBQUlBLEtBQUssS0FBSyxDQUFkLEVBQWlCO0FBQ2YsYUFBUUYsV0FBVyxHQUFHLENBQUMsRUFBRSxHQUFHQyxPQUFMO0FBQWNFLFFBQUFBLFlBQVksRUFBRTtBQUE1QixPQUFELENBQXRCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTUMsR0FBRyxHQUFHSixXQUFXLENBQUNqRCxJQUFaLENBQ1RoQyxDQUFELElBQU9BLENBQUMsQ0FBQ3NFLFFBQUYsS0FBZVksT0FBTyxDQUFDWixRQUF2QixJQUFtQ1ksT0FBTyxDQUFDckUsS0FBUixLQUFrQixXQURsRCxDQUFaOztBQUdBLFVBQUl3RSxHQUFKLEVBQVM7QUFDUCxjQUFNRixLQUFLLEdBQUdGLFdBQVcsQ0FBQ0ssU0FBWixDQUNYdEYsQ0FBRCxJQUFPQSxDQUFDLENBQUNzRSxRQUFGLEtBQWVZLE9BQU8sQ0FBQ1osUUFEbEIsQ0FBZCxDQURPOztBQUtQVyxRQUFBQSxXQUFXLENBQUNNLE1BQVosQ0FBbUJKLEtBQW5CLEVBQTBCLENBQTFCLEVBQTZCLEVBQzNCLEdBQUdFLEdBRHdCO0FBRTNCRCxVQUFBQSxZQUFZLEVBQUUsRUFBRUMsR0FBRyxDQUFDRDtBQUZPLFNBQTdCO0FBSUQsT0FURCxNQVNPO0FBQ0w7QUFDQUgsUUFBQUEsV0FBVyxDQUFDTyxJQUFaLENBQWlCLEVBQUUsR0FBR04sT0FBTDtBQUFjRSxVQUFBQSxZQUFZLEVBQUU7QUFBNUIsU0FBakI7QUFDRDtBQUNGOztBQUNELFdBQU9ILFdBQVA7QUFDRCxHQXRCSSxFQXNCRixFQXRCRSxDQUFQO0FBdUJIOztBQ25CRCxNQUFNM0IsT0FBSyxHQUFHO0FBQ1ptQyxFQUFBQSxRQUFRLEVBQUU7QUFBRXpDLElBQUFBLFdBQVcsRUFBRTtBQUFmLEdBREU7QUFFWjBDLEVBQUFBLFlBQVksRUFBRTtBQUNabEQsSUFBQUEsT0FBTyxFQUFFLE1BREc7QUFFWm1ELElBQUFBLFVBQVUsRUFBRSxRQUZBO0FBR1pqRCxJQUFBQSxPQUFPLEVBQUU7QUFIRyxHQUZGO0FBT1prRCxFQUFBQSxNQUFNLEVBQUU7QUFDTnBELElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU5xRCxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdOakIsSUFBQUEsTUFBTSxFQUFFLE1BSEY7QUFJTm5DLElBQUFBLGNBQWMsRUFBRSxlQUpWO0FBS05VLElBQUFBLFNBQVMsRUFBRSxZQUxMO0FBTU5vQixJQUFBQSxVQUFVLEVBQUM7QUFOTCxHQVBJO0FBZVp1QixFQUFBQSxHQUFHLEVBQUU7QUFDSG5ELElBQUFBLElBQUksRUFBRSxDQURIO0FBRUhLLElBQUFBLFdBQVcsRUFBRTtBQUZWO0FBZk8sQ0FBZDtBQXFCZSxTQUFTK0MsS0FBVCxDQUFlO0FBQUVDLEVBQUFBLFFBQUY7QUFBWUMsRUFBQUEsT0FBWjtBQUFxQkMsRUFBQUE7QUFBckIsQ0FBZixFQUFnRDtBQUc3RCxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFFNUMsT0FBSyxDQUFDc0M7QUFBckIsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFdEMsT0FBSyxDQUFDb0M7QUFBbEIsS0FDRTtBQUFPLElBQUEsSUFBSSxFQUFDLFVBQVo7QUFBdUIsSUFBQSxLQUFLLEVBQUVwQyxPQUFLLENBQUNtQyxRQUFwQztBQUE4QyxJQUFBLFFBQVEsRUFBRVM7QUFBeEQsSUFERixFQUVFLDBCQUZGLENBREYsRUFLRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUUxRCxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkUsTUFBQUEsT0FBTyxFQUFFO0FBQTVCO0FBQVosS0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBQyxRQUFkO0FBQXVCLElBQUEsS0FBSyxFQUFFWSxPQUFLLENBQUN3QyxHQUFwQztBQUF5QyxJQUFBLE9BQU8sRUFBRUU7QUFBbEQsSUFERixFQUVFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFDLE9BQWQ7QUFBc0IsSUFBQSxLQUFLLEVBQUUxQyxPQUFLLENBQUN3QyxHQUFuQztBQUF3QyxJQUFBLEVBQUUsRUFBQyxPQUEzQztBQUFtRCxJQUFBLE9BQU8sRUFBRUcsT0FBNUQ7QUFBcUUsbUJBQVk7QUFBakYsSUFGRixDQUxGLENBREY7QUFZRDs7QUN4Q00sU0FBU0YsT0FBVCxDQUFlO0FBQ3BCbkIsRUFBQUEsTUFBTSxHQUFHLEVBRFc7QUFFcEJyQixFQUFBQSxLQUFLLEdBQUcsRUFGWTtBQUdwQjRDLEVBQUFBLElBQUksR0FBRyxNQUhhO0FBSXBCQyxFQUFBQSxLQUFLLEdBQUcsT0FKWTtBQUtwQkMsRUFBQUEsT0FMb0I7QUFNcEJoRCxFQUFBQTtBQU5vQixDQUFmLEVBT0o7QUFDRCxTQUNFO0FBQ0UsSUFBQSxNQUFNLEVBQUV1QixNQURWO0FBRUUsSUFBQSxPQUFPLEVBQUMsV0FGVjtBQUdFLElBQUEsS0FBSyxFQUFFckIsS0FIVDtBQUlFLElBQUEsT0FBTyxFQUFFOEMsT0FKWDtBQUtFLElBQUEsRUFBRSxFQUFFaEQ7QUFMTixLQU9FO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRThDLElBQTlCO0FBQW9DLElBQUEsRUFBRSxFQUFFOUM7QUFBeEMsSUFQRixFQVFFO0FBQ0UsSUFBQSxFQUFFLEVBQUVBLEVBRE47QUFFRSxJQUFBLElBQUksRUFBRStDLEtBRlI7QUFHRSxJQUFBLENBQUMsRUFBQztBQUhKLElBUkYsQ0FERjtBQWdCRDs7QUN4Qk0sU0FBU0UsTUFBVCxDQUFnQjtBQUFFekUsRUFBQUEsUUFBRjtBQUFZeUIsRUFBQUE7QUFBWixDQUFoQixFQUFxQztBQUMxQyxTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTGQsTUFBQUEsT0FBTyxFQUFFLE1BREo7QUFFTEMsTUFBQUEsY0FBYyxFQUFFLFFBRlg7QUFHTDhELE1BQUFBLFNBQVMsRUFBRSxRQUhOO0FBSUwsU0FBR2pEO0FBSkU7QUFEVCxLQVFHekIsUUFSSCxDQURGO0FBWUQ7O0FDUEQsTUFBTXlCLE9BQUssR0FBRztBQUNac0MsRUFBQUEsTUFBTSxFQUFFO0FBQ05wRCxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVOcUQsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTmpCLElBQUFBLE1BQU0sRUFBRSxNQUhGO0FBSU5uQyxJQUFBQSxjQUFjLEVBQUUsZUFKVjtBQUtOVSxJQUFBQSxTQUFTLEVBQUUsWUFMTDtBQU1Ob0IsSUFBQUEsVUFBVSxFQUFDO0FBTkwsR0FESTtBQVNadUIsRUFBQUEsR0FBRyxFQUFFO0FBQ0huRCxJQUFBQSxJQUFJLEVBQUUsQ0FESDtBQUVISyxJQUFBQSxXQUFXLEVBQUU7QUFGVjtBQVRPLENBQWQ7QUFlZSxTQUFTd0QsT0FBVCxDQUFpQjtBQUFFbkMsRUFBQUEsT0FBRjtBQUFXb0MsRUFBQUEsU0FBWDtBQUFzQkMsRUFBQUE7QUFBdEIsQ0FBakIsRUFBa0Q7QUFFL0Q7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVwRCxPQUFLLENBQUNzQyxNQUFyQjtBQUE2QixJQUFBLEVBQUUsRUFBQztBQUFoQyxLQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFFO0FBQUVDLE1BQUFBLGFBQWEsRUFBRSxRQUFqQjtBQUEyQkYsTUFBQUEsVUFBVSxFQUFFO0FBQXZDO0FBQWYsS0FDRSxFQUFDSSxPQUFEO0FBQU8sSUFBQSxLQUFLLEVBQUMsSUFBYjtBQUFrQixJQUFBLE1BQU0sRUFBQyxJQUF6QjtBQUE4QixJQUFBLEtBQUssRUFBQztBQUFwQyxJQURGLEVBRUUsYUFBSTFCLE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxRQUF2QixDQUZGLGdCQURGLEVBTUU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFOUIsTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJFLE1BQUFBLE9BQU8sRUFBRTtBQUE1QjtBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsT0FBZDtBQUFzQixJQUFBLEtBQUssRUFBRVksT0FBSyxDQUFDd0MsR0FBbkM7QUFBd0MsSUFBQSxPQUFPLEVBQUVZO0FBQWpELElBREYsRUFFRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQyxTQUFYO0FBQXFCLElBQUEsS0FBSyxFQUFDLFNBQTNCO0FBQXFDLElBQUEsS0FBSyxFQUFFcEQsT0FBSyxDQUFDd0MsR0FBbEQ7QUFBdUQsSUFBQSxPQUFPLEVBQUVXLFNBQWhFO0FBQTJFLG1CQUFZO0FBQXZGLElBRkYsQ0FORixDQURGO0FBYUQ7O0FDMUNNLFNBQVNFLE1BQVQsQ0FBZ0I7QUFDckIvQixFQUFBQSxNQUFNLEdBQUcsRUFEWTtBQUVyQnJCLEVBQUFBLEtBQUssR0FBRyxFQUZhO0FBR3JCNkMsRUFBQUEsS0FBSyxHQUFHLE9BSGE7QUFJckJELEVBQUFBLElBQUksR0FBRztBQUpjLENBQWhCLEVBS0o7QUFDRCxTQUNFO0FBQUssSUFBQSxNQUFNLEVBQUV2QixNQUFiO0FBQXFCLElBQUEsT0FBTyxFQUFDLFdBQTdCO0FBQXlDLElBQUEsS0FBSyxFQUFFckI7QUFBaEQsS0FDRTtBQUNFLElBQUEsSUFBSSxFQUFFNkMsS0FEUjtBQUVFLElBQUEsQ0FBQyxFQUFDO0FBRkosSUFERixFQUtFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRUQ7QUFBOUIsSUFMRixDQURGO0FBU0Q7O0FDZE0sU0FBU1MsT0FBVCxDQUFpQjtBQUN0QmhDLEVBQUFBLE1BQU0sR0FBRyxFQURhO0FBRXRCckIsRUFBQUEsS0FBSyxHQUFHLEVBRmM7QUFHdEI2QyxFQUFBQSxLQUFLLEdBQUcsT0FIYztBQUl0QkQsRUFBQUEsSUFBSSxHQUFHO0FBSmUsQ0FBakIsRUFLSjtBQUNELFNBQ0U7QUFBSyxJQUFBLE1BQU0sRUFBRSxFQUFiO0FBQWlCLElBQUEsT0FBTyxFQUFDLFdBQXpCO0FBQXFDLElBQUEsS0FBSyxFQUFFNUM7QUFBNUMsS0FDRTtBQUNFLElBQUEsSUFBSSxFQUFFNkMsS0FEUjtBQUVFLElBQUEsQ0FBQyxFQUFDO0FBRkosSUFERixFQUtFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRUQ7QUFBOUIsSUFMRixDQURGO0FBU0Q7O0FDWEQsTUFBTTdDLE9BQUssR0FBRztBQUNadUQsRUFBQUEsT0FBTyxFQUFFO0FBQUVyRSxJQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQm1ELElBQUFBLFVBQVUsRUFBRSxRQUEvQjtBQUF5Q21CLElBQUFBLE1BQU0sRUFBRTtBQUFqRCxHQURHO0FBRVpoQixFQUFBQSxHQUFHLEVBQUU7QUFBRTlDLElBQUFBLFdBQVcsRUFBRTtBQUFmLEdBRk87QUFHWitELEVBQUFBLFlBQVksRUFBRTtBQUNadkUsSUFBQUEsT0FBTyxFQUFFLE1BREc7QUFFWnFELElBQUFBLGFBQWEsRUFBRTtBQUZILEdBSEY7QUFPWkQsRUFBQUEsTUFBTSxFQUFFO0FBQ05wRCxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVOcUQsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTnBELElBQUFBLGNBQWMsRUFBRSxlQUhWO0FBSU5tQyxJQUFBQSxNQUFNLEVBQUU7QUFKRixHQVBJO0FBYVpvQyxFQUFBQSxLQUFLLEVBQUU7QUFDTEYsSUFBQUEsTUFBTSxFQUFFLENBREg7QUFFTHRFLElBQUFBLE9BQU8sRUFBRSxNQUZKO0FBR0xDLElBQUFBLGNBQWMsRUFBRTtBQUhYO0FBYkssQ0FBZDtBQW9CZSxTQUFTd0UsU0FBVCxDQUFtQjtBQUNoQ2hCLEVBQUFBLE9BRGdDO0FBRWhDaUIsRUFBQUEsUUFGZ0M7QUFHaENDLEVBQUFBLFNBSGdDO0FBSWhDQyxFQUFBQSxjQUpnQztBQUtoQ0MsRUFBQUEscUJBTGdDO0FBTWhDQyxFQUFBQSxZQU5nQztBQU9oQ0MsRUFBQUE7QUFQZ0MsQ0FBbkIsRUFRWjtBQUNELFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVqRSxPQUFLLENBQUNzQztBQUFyQixLQUNFLGVBQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxLQUFLLEVBQUMsZUFBaEI7QUFBZ0MsSUFBQSxRQUFRLEVBQUV3QjtBQUExQyxJQURGLEVBRUUsRUFBQyxRQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUMsc0JBRFI7QUFFRSxJQUFBLFFBQVEsRUFBRUM7QUFGWixJQUZGLENBREYsRUFRRSxhQVJGLEVBU0U7QUFBSyxJQUFBLEtBQUssRUFBRS9ELE9BQUssQ0FBQ3lEO0FBQWxCLEtBQ0UsRUFBQyxVQUFEO0FBQVksSUFBQSxLQUFLLEVBQUMsU0FBbEI7QUFBNEIsSUFBQSxJQUFJLEVBQUVILE9BQWxDO0FBQTJDLElBQUEsT0FBTyxFQUFFTztBQUFwRCxJQURGLEVBRUUsRUFBQyxVQUFEO0FBQVksSUFBQSxLQUFLLEVBQUMsUUFBbEI7QUFBMkIsSUFBQSxJQUFJLEVBQUVSLE1BQWpDO0FBQXlDLElBQUEsT0FBTyxFQUFFTztBQUFsRCxJQUZGLEVBR0UsRUFBQyxVQUFEO0FBQVksSUFBQSxFQUFFLEVBQUMsT0FBZjtBQUF1QixJQUFBLEtBQUssRUFBQyxPQUE3QjtBQUFxQyxJQUFBLElBQUksRUFBRW5CLE9BQTNDO0FBQWtELElBQUEsT0FBTyxFQUFFdUI7QUFBM0QsSUFIRixDQVRGLEVBY0U7QUFBSyxJQUFBLEtBQUssRUFBRWhFLE9BQUssQ0FBQzBEO0FBQWxCLEtBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxPQUFPLEVBQUVPO0FBQWpCLFVBREYsQ0FkRixDQURGO0FBb0JEOztBQUVELFNBQVNDLFVBQVQsQ0FBb0I7QUFBRUMsRUFBQUEsSUFBRjtBQUFRaEUsRUFBQUEsS0FBUjtBQUFlNEMsRUFBQUEsT0FBZjtBQUF1QmhELEVBQUFBO0FBQXZCLENBQXBCLEVBQWlEO0FBQy9DLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRUMsT0FBSyxDQUFDdUQ7QUFBbEIsS0FDRTtBQUFRLElBQUEsRUFBRSxFQUFFeEQsRUFBWjtBQUFnQixJQUFBLEtBQUssRUFBRUMsT0FBSyxDQUFDd0MsR0FBN0I7QUFBa0MsSUFBQSxPQUFPLEVBQUVPLE9BQTNDO0FBQW9ELG1CQUFjLEdBQUVoRCxFQUFHO0FBQXZFLEtBQ0UsRUFBQyxJQUFEO0FBQU0sSUFBQSxFQUFFLEVBQUVBO0FBQVYsSUFERixDQURGLEVBSUUsZUFBTUksS0FBTixDQUpGLENBREY7QUFRRDs7QUFFRCxTQUFTaUUsUUFBVCxDQUFrQjtBQUFFQyxFQUFBQSxLQUFGO0FBQVNDLEVBQUFBO0FBQVQsQ0FBbEIsRUFBdUM7QUFDckMsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVkLE1BQUFBLE1BQU0sRUFBRSxDQUFWO0FBQWE3RCxNQUFBQSxTQUFTLEVBQUU7QUFBeEI7QUFBWixLQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsVUFBWjtBQUF1QixJQUFBLFFBQVEsRUFBRTJFO0FBQWpDLElBREYsRUFFRSxpQkFBUUQsS0FBUixDQUZGLENBREY7QUFNRDs7QUMxRWMsU0FBU0UsYUFBVCxDQUF1QjtBQUNwQ2pELEVBQUFBLE1BQU0sR0FBRyxFQUQyQjtBQUVwQ3JCLEVBQUFBLEtBQUssR0FBRyxFQUY0QjtBQUdwQzZDLEVBQUFBLEtBQUssR0FBRyxPQUg0QjtBQUlwQ0QsRUFBQUEsSUFBSSxHQUFHLE9BSjZCO0FBS3BDN0MsRUFBQUE7QUFMb0MsQ0FBdkIsRUFNWjtBQUNELFNBQ0U7QUFBSyxJQUFBLE1BQU0sRUFBRXNCLE1BQWI7QUFBcUIsSUFBQSxPQUFPLEVBQUMsV0FBN0I7QUFBeUMsSUFBQSxLQUFLLEVBQUVyQixLQUFoRDtBQUF1RCxJQUFBLEtBQUssRUFBRUQ7QUFBOUQsS0FDRTtBQUFNLElBQUEsQ0FBQyxFQUFDLGVBQVI7QUFBd0IsSUFBQSxJQUFJLEVBQUU2QztBQUE5QixJQURGLEVBRUU7QUFDRSxJQUFBLElBQUksRUFBRUMsS0FEUjtBQUVFLElBQUEsQ0FBQyxFQUFDO0FBRkosSUFGRixDQURGO0FBU0Q7O0FDVEQsTUFBTTlDLE9BQUssR0FBRztBQUNac0MsRUFBQUEsTUFBTSxFQUFFO0FBQ05wRCxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVOcUQsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTnBELElBQUFBLGNBQWMsRUFBRTtBQUhWO0FBREksQ0FBZDs7QUFRZSxTQUFTcUYsTUFBVCxDQUFnQjtBQUFFekQsRUFBQUEsT0FBRjtBQUFXMEQsRUFBQUEsUUFBWDtBQUFxQkMsRUFBQUEsYUFBckI7QUFBbUNDLEVBQUFBLFdBQW5DO0FBQWdEN0YsRUFBQUE7QUFBaEQsQ0FBaEIsRUFBeUU7QUFHdEYsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRWtCLE9BQUssQ0FBQ3NDLE1BQXJCO0FBQTRCLElBQUEsRUFBRSxFQUFDO0FBQS9CLEtBQ0UsRUFBQyxNQUFELFFBQ0UsRUFBQ3NDLGFBQUQ7QUFBVyxJQUFBLEtBQUssRUFBQztBQUFqQixJQURGLENBREYsRUFJRSxFQUFDLE1BQUQsb0NBQzBCLGFBQUk3RCxPQUFPLElBQUlBLE9BQU8sQ0FBQzhELEtBQXZCLENBRDFCLENBSkYsRUFPRSxFQUFDLFNBQUQ7QUFBVyxJQUFBLEVBQUUsRUFBQyxrQkFBZDtBQUFpQyxJQUFBLFFBQVEsRUFBRUgsYUFBM0M7QUFBMEQsSUFBQSxLQUFLLEVBQUVDO0FBQWpFLElBUEYsRUFRRSxFQUFDLE1BQUQsUUFDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBQyxhQUFkO0FBQTRCLElBQUEsRUFBRSxFQUFDLFFBQS9CO0FBQXdDLElBQUEsT0FBTyxFQUFFRixRQUFqRDtBQUEyRCxtQkFBWTtBQUF2RSxJQURGLENBUkYsQ0FERjtBQWNEOztBQy9CTSxTQUFTSyxJQUFULENBQWM7QUFDbkJ4RCxFQUFBQSxNQUFNLEdBQUcsRUFEVTtBQUVuQnJCLEVBQUFBLEtBQUssR0FBRyxFQUZXO0FBR25CNEMsRUFBQUEsSUFBSSxHQUFHLE1BSFk7QUFJbkJDLEVBQUFBLEtBQUssR0FBRyxPQUpXO0FBS25COUMsRUFBQUE7QUFMbUIsQ0FBZCxFQU1KO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFc0IsTUFBYjtBQUFxQixJQUFBLE9BQU8sRUFBQyxXQUE3QjtBQUF5QyxJQUFBLEtBQUssRUFBRXJCLEtBQWhEO0FBQXVELElBQUEsS0FBSyxFQUFFRDtBQUE5RCxLQUNFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRTZDO0FBQTlCLElBREYsRUFFRTtBQUNFLElBQUEsSUFBSSxFQUFFQyxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQUZGLENBREY7QUFTRDs7QUNaRCxNQUFNOUMsT0FBSyxHQUFHO0FBQ1pzQyxFQUFBQSxNQUFNLEVBQUU7QUFDTnBELElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU5xRCxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdOcEQsSUFBQUEsY0FBYyxFQUFFO0FBSFY7QUFESSxDQUFkO0FBT2UsU0FBUzRGLE9BQVQsQ0FBaUI7QUFBRWhFLEVBQUFBLE9BQUY7QUFBVTVDLEVBQUFBO0FBQVYsQ0FBakIsRUFBdUM7QUFHcEQsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRTZCLE9BQUssQ0FBQ3NDLE1BQXJCO0FBQTZCLElBQUEsRUFBRSxFQUFDO0FBQWhDLEtBQ0UsRUFBQyxNQUFELFFBQ0UsRUFBQyxJQUFEO0FBQU0sSUFBQSxLQUFLLEVBQUMsSUFBWjtBQUFpQixJQUFBLE1BQU0sRUFBQyxJQUF4QjtBQUE2QixJQUFBLEtBQUssRUFBQztBQUFuQyxJQURGLENBREYsRUFJRSxFQUFDLE1BQUQsUUFDRSwrQ0FDZ0MsYUFBSXZCLE9BQU8sSUFBSUEsT0FBTyxDQUFDOEQsS0FBdkIsQ0FEaEMsMkNBREYsQ0FKRixDQURGO0FBYUQ7O0FDekJNLFNBQVNHLGFBQVQsR0FBeUI7QUFDOUIsUUFBTSxDQUFDL0UsS0FBRCxFQUFRZ0YsUUFBUixJQUFvQkMsR0FBUSxDQUFDLENBQUQsQ0FBbEM7QUFDQSxRQUFNLENBQUM1RCxNQUFELEVBQVM2RCxTQUFULElBQXNCRCxHQUFRLENBQUMsQ0FBRCxDQUFwQztBQUNBLFFBQU0sQ0FBQ0UsV0FBRCxFQUFjQyxjQUFkLElBQWdDSCxHQUFRLENBQUMsRUFBRCxDQUE5QztBQUNBLFFBQU0sQ0FBQ0ksTUFBRCxFQUFTQyxTQUFULElBQXNCTCxHQUFRLENBQUMsRUFBRCxDQUFwQzs7QUFDQSxXQUFTTSxrQkFBVCxHQUE4QjtBQUUxQlAsSUFBQUEsUUFBUSxDQUFDUSxNQUFNLENBQUNDLFVBQVIsQ0FBUjtBQUNBUCxJQUFBQSxTQUFTLENBQUNNLE1BQU0sQ0FBQ0UsV0FBUixDQUFUO0FBRUg7O0FBRUQsV0FBU0MsdUJBQVQsR0FBbUM7QUFDakNQLElBQUFBLGNBQWMsQ0FBQ0ksTUFBTSxDQUFDSSxNQUFQLENBQWNULFdBQWYsQ0FBZDtBQUNEOztBQUNEVSxFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkLFFBQUk3RixLQUFLLEdBQUcsQ0FBWixFQUFlO0FBQ2IsY0FBUSxJQUFSO0FBQ0UsYUFBS0EsS0FBSyxJQUFJLEdBQWQ7QUFDRXNGLFVBQUFBLFNBQVMsQ0FBQyxPQUFELENBQVQ7QUFDQTs7QUFDRixhQUFLdEYsS0FBSyxJQUFJLEdBQWQ7QUFDQSxhQUFLQSxLQUFLLElBQUksR0FBZDtBQUNBLGFBQUtBLEtBQUssSUFBSSxJQUFkO0FBQ0VzRixVQUFBQSxTQUFTLENBQUMsUUFBRCxDQUFUO0FBQ0E7O0FBQ0YsYUFBS3RGLEtBQUssSUFBSSxJQUFkO0FBQ0VzRixVQUFBQSxTQUFTLENBQUMsUUFBRCxDQUFUO0FBQ0E7O0FBQ0YsYUFBS3RGLEtBQUssR0FBRyxJQUFiO0FBQ0VzRixVQUFBQSxTQUFTLENBQUMsU0FBRCxDQUFUO0FBQ0E7O0FBQ0Y7QUFDRUEsVUFBQUEsU0FBUyxDQUFDLEVBQUQsQ0FBVDtBQWhCSjtBQWtCRDtBQUNGLEdBckJRLEVBcUJOLENBQUN0RixLQUFELENBckJNLENBQVQ7QUF1QkE2RixFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkQyxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxRQUFaLEVBQXNCVixNQUF0QjtBQUNELEdBRlEsRUFFTixDQUFDQSxNQUFELENBRk0sQ0FBVDtBQUdBUSxFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkTixJQUFBQSxrQkFBa0I7QUFDbEJJLElBQUFBLHVCQUF1QjtBQUN2QkgsSUFBQUEsTUFBTSxDQUFDUSxnQkFBUCxDQUF3QixtQkFBeEIsRUFBNkNMLHVCQUE3QztBQUNBSCxJQUFBQSxNQUFNLENBQUNRLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLE1BQU1ULGtCQUF4QztBQUVBLFdBQU8sTUFBTTtBQUVYO0FBQ0QsS0FIRDtBQUlELEdBVlEsRUFVTixFQVZNLENBQVQ7QUFZQSxTQUFPO0FBQUV2RixJQUFBQSxLQUFGO0FBQVNxQixJQUFBQSxNQUFUO0FBQWlCOEQsSUFBQUEsV0FBakI7QUFBOEJFLElBQUFBO0FBQTlCLEdBQVA7QUFDRDs7Ozs7QUN0REQsTUFBTXRGLE9BQUssR0FBRztBQUNab0IsRUFBQUEsSUFBSSxFQUFFO0FBQ0o4RSxJQUFBQSxXQUFXLEVBQUUsU0FEVDtBQUVKQyxJQUFBQSxXQUFXLEVBQUUsT0FGVDtBQUdKQyxJQUFBQSxXQUFXLEVBQUUsQ0FIVDtBQUlKQyxJQUFBQSxZQUFZLEVBQUUsQ0FKVjtBQUtKakgsSUFBQUEsT0FBTyxFQUFFLENBTEw7QUFNSkYsSUFBQUEsT0FBTyxFQUFFLE1BTkw7QUFPSnFELElBQUFBLGFBQWEsRUFBRSxRQVBYO0FBUUpwRCxJQUFBQSxjQUFjLEVBQUUsZUFSWjtBQVNKbUgsSUFBQUEsU0FBUyxFQUFFLEVBVFA7QUFVSmpGLElBQUFBLGVBQWUsRUFBRTtBQVZiLEdBRE07QUFhWkwsRUFBQUEsUUFBUSxFQUFFO0FBQUV0QixJQUFBQSxXQUFXLEVBQUU7QUFBZixHQWJFO0FBY1pzRyxFQUFBQSxHQUFHLEVBQUU7QUFDSDlHLElBQUFBLE9BQU8sRUFBRSxNQUROO0FBRUg0RCxJQUFBQSxLQUFLLEVBQUUsU0FGSjtBQUdIeUQsSUFBQUEsUUFBUSxFQUFFO0FBSFAsR0FkTztBQW1CWkMsRUFBQUEsT0FBTyxFQUFFO0FBbkJHLENBQWQ7O0FBc0JPLFNBQVNDLE9BQVQsQ0FBaUJuSSxLQUFqQixFQUF3QjtBQUM3QixRQUFNO0FBQUVrSSxJQUFBQTtBQUFGLE1BQWNsSSxLQUFwQjtBQUNBLFFBQU07QUFBRW9JLElBQUFBLEtBQUY7QUFBUzFGLElBQUFBLFFBQVQ7QUFBa0IyRixJQUFBQTtBQUFsQixNQUFnQ0gsT0FBdEM7QUFDQSxRQUFNLENBQUNJLElBQUQsRUFBT0MsT0FBUCxJQUFrQjNCLEdBQVEsQ0FBQyxDQUFELENBQWhDO0FBQ0EsUUFBTSxDQUFDNEIsS0FBRCxFQUFRQyxRQUFSLElBQW9CN0IsR0FBUSxDQUFDLENBQUQsQ0FBbEM7QUFDQSxRQUFNLENBQUM4QixPQUFELEVBQVVDLFVBQVYsSUFBd0IvQixHQUFRLENBQUMsQ0FBRCxDQUF0QztBQUNBLFFBQU0sQ0FBQ2dDLE9BQUQsRUFBVUMsVUFBVixJQUF3QmpDLEdBQVEsQ0FBQyxDQUFELENBQXRDO0FBQ0EsUUFBTTtBQUFFSSxJQUFBQTtBQUFGLE1BQWFOLGFBQWEsRUFBaEM7O0FBQ0EsV0FBU29DLFNBQVQsQ0FBbUJDLEVBQW5CLEVBQXVCO0FBQ3JCLFFBQUlDLENBQUosRUFBT0MsQ0FBUCxFQUFVM0ssQ0FBVixFQUFhRyxDQUFiO0FBQ0FBLElBQUFBLENBQUMsR0FBR3lLLElBQUksQ0FBQ0MsS0FBTCxDQUFXSixFQUFFLEdBQUcsSUFBaEIsQ0FBSjtBQUNBekssSUFBQUEsQ0FBQyxHQUFHNEssSUFBSSxDQUFDQyxLQUFMLENBQVcxSyxDQUFDLEdBQUcsRUFBZixDQUFKO0FBQ0FBLElBQUFBLENBQUMsR0FBR0EsQ0FBQyxHQUFHLEVBQVI7QUFDQXdLLElBQUFBLENBQUMsR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVc3SyxDQUFDLEdBQUcsRUFBZixDQUFKO0FBQ0FBLElBQUFBLENBQUMsR0FBR0EsQ0FBQyxHQUFHLEVBQVI7QUFDQTBLLElBQUFBLENBQUMsR0FBR0UsSUFBSSxDQUFDQyxLQUFMLENBQVdGLENBQUMsR0FBRyxFQUFmLENBQUo7QUFDQUEsSUFBQUEsQ0FBQyxHQUFHQSxDQUFDLEdBQUcsRUFBUjtBQUNBVixJQUFBQSxPQUFPLENBQUNTLENBQUQsQ0FBUDtBQUNBUCxJQUFBQSxRQUFRLENBQUNRLENBQUQsQ0FBUjtBQUNBTixJQUFBQSxVQUFVLENBQUNySyxDQUFELENBQVY7QUFDQXVLLElBQUFBLFVBQVUsQ0FBQ3BLLENBQUQsQ0FBVjtBQUNEOztBQUVEK0ksRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFHYSxTQUFILEVBQWE7QUFFWGUsTUFBQUEsVUFBVSxDQUFDLE1BQU07QUFDZk4sUUFBQUEsU0FBUyxDQUFDTyxJQUFJLENBQUNDLEdBQUwsS0FBYWpCLFNBQWQsQ0FBVDtBQUNELE9BRlMsRUFFUCxDQUZPLENBQVY7QUFHQWtCLE1BQUFBLFdBQVcsQ0FBQyxNQUFNO0FBQ2hCVCxRQUFBQSxTQUFTLENBQUNPLElBQUksQ0FBQ0MsR0FBTCxLQUFhakIsU0FBZCxDQUFUO0FBQ0QsT0FGVSxFQUVSLEtBRlEsQ0FBWDtBQUtEO0FBRUYsR0FiUSxFQWFOLENBQUNBLFNBQUQsQ0FiTSxDQUFUO0FBZUEsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUUxRyxNQUFBQSxLQUFLLEVBQUUsTUFBVDtBQUFpQkwsTUFBQUEsWUFBWSxFQUFFO0FBQS9CO0FBQVosS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBR0ksT0FBSyxDQUFDb0IsSUFBWDtBQUFpQnNGLE1BQUFBO0FBQWpCO0FBQVosS0FDRTtBQUNFLG1CQUFZLFNBRGQ7QUFFRSxJQUFBLEtBQUssRUFBRTFHLE9BQUssQ0FBQ3dHLE9BRmY7QUFHRSxJQUFBLFNBQVMsRUFBRyxnQkFBZWxCLE1BQU87QUFIcEMsS0FLR2tCLE9BQU8sSUFBSUEsT0FBTyxDQUFDc0IsSUFMdEIsQ0FERixFQVNFO0FBQUssSUFBQSxLQUFLLEVBQUU5SCxPQUFLLENBQUNnRztBQUFsQixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVoRyxPQUFLLENBQUNnQjtBQUFsQixLQUE2QkEsUUFBUSxJQUFJQSxRQUF6QyxNQURGLEVBRU4sZUFDV2dHLE9BQU8sS0FBSyxDQUFaLElBQWlCLHFCQUQ1QixFQUVXRixLQUFLLEtBQUssQ0FBVixJQUFlRSxPQUFPLEdBQUcsQ0FBekIsSUFBOEIsZUFBTUEsT0FBTixrQkFGekMsRUFHV0YsS0FBSyxHQUFHLENBQVIsSUFBYUYsSUFBSSxLQUFLLENBQXRCLElBQ0MsZUFDR0UsS0FESCxhQUNpQkUsT0FEakIsa0JBQ3NDLEdBRHRDLENBSlosRUFRV0osSUFBSSxJQUFJLEVBQVIsSUFBY0EsSUFBSSxHQUFHLENBQXJCLElBQTBCLGVBQU1BLElBQU4sY0FSckMsQ0FGTSxDQVRGLENBREYsQ0FERjtBQTRCRDs7QUN4RkQsTUFBTTVHLE9BQUssR0FBRztBQUNab0IsRUFBQUEsSUFBSSxFQUFFO0FBQ0psQyxJQUFBQSxPQUFPLEVBQUUsTUFETDtBQUVKcUQsSUFBQUEsYUFBYSxFQUFFLFFBRlg7QUFHSnRDLElBQUFBLEtBQUssRUFBRSxNQUhIO0FBSUpxQixJQUFBQSxNQUFNLEVBQUUsTUFKSjtBQUtKTCxJQUFBQSxVQUFVLEVBQUUsRUFMUjtBQU1KcEIsSUFBQUEsU0FBUyxFQUFFLFlBTlA7QUFPSlYsSUFBQUEsY0FBYyxFQUFFLGVBUFo7QUFRSjRJLElBQUFBLGFBQWEsRUFBQztBQVJWO0FBRE0sQ0FBZDtBQWNlLFNBQVNDLE9BQVQsQ0FBaUI7QUFBRWpILEVBQUFBLE9BQUY7QUFBV2tILEVBQUFBLFFBQVg7QUFBcUJDLEVBQUFBO0FBQXJCLENBQWpCLEVBQW1EO0FBRWhFLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVsSSxPQUFLLENBQUNvQjtBQUFsQixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRTNCLE1BQUFBLFVBQVUsRUFBRSxDQUFkO0FBQWlCUCxNQUFBQSxPQUFPLEVBQUM7QUFBekI7QUFBWixLQUNHNkIsT0FBTyxJQUFJQSxPQUFPLENBQUN5RixPQUFuQixJQUNDLEVBQUMsT0FBRDtBQUNFLElBQUEsT0FBTyxFQUNMekYsT0FBTyxJQUNQQSxPQUFPLENBQUN5RixPQURSLElBQ21CLEVBQ2pCLEdBQUd6RixPQUFPLENBQUN5RixPQURNO0FBRWpCeEYsTUFBQUEsUUFBUSxFQUFFRCxPQUFPLENBQUNDLFFBRkQ7QUFFVTBGLE1BQUFBLEtBQUssRUFBQztBQUZoQjtBQUh2QixJQUZKLENBREYsRUFlRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUV4SCxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFrQmlKLE1BQUFBLFdBQVcsRUFBQyxDQUE5QjtBQUFnQ0MsTUFBQUEsWUFBWSxFQUFDO0FBQTdDO0FBQVosS0FDRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLEVBQUUsRUFBQyxTQURMO0FBRUUsSUFBQSxPQUFPLEVBQUVGLFNBRlg7QUFHRSxtQkFBWSxhQUhkO0FBSUUsSUFBQSxLQUFLLEVBQUMsU0FKUjtBQUtFLElBQUEsS0FBSyxFQUFFO0FBQUU3SSxNQUFBQSxJQUFJLEVBQUUsQ0FBUjtBQUFXSyxNQUFBQSxXQUFXLEVBQUUsQ0FBeEI7QUFBMkJvRCxNQUFBQSxLQUFLLEVBQUU7QUFBbEM7QUFMVCxJQURGLEVBUUUsRUFBQyxNQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsUUFETDtBQUVFLElBQUEsT0FBTyxFQUFFbUYsUUFGWDtBQUdFLG1CQUFZLFlBSGQ7QUFJRSxJQUFBLEtBQUssRUFBQyxRQUpSO0FBS0UsSUFBQSxLQUFLLEVBQUU7QUFBRTVJLE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdJLE1BQUFBLFVBQVUsRUFBRSxDQUF2QjtBQUEwQnFELE1BQUFBLEtBQUssRUFBRTtBQUFqQztBQUxULElBUkYsQ0FmRixDQURGLENBREY7QUFvQ0Q7O0FDckRELE1BQU10RCxRQUFNLEdBQUc7QUFDYjRCLEVBQUFBLElBQUksRUFBRTtBQUNKbEMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSm1ELElBQUFBLFVBQVUsRUFBRTtBQUZSLEdBRE87QUFLYi9CLEVBQUFBLEtBQUssRUFBRTtBQUNMO0FBQ0FsQixJQUFBQSxPQUFPLEVBQUUsQ0FGSjtBQUdMSyxJQUFBQSxVQUFVLEVBQUUsQ0FIUDtBQUlMQyxJQUFBQSxXQUFXLEVBQUUsQ0FKUjtBQUtMQyxJQUFBQSxTQUFTLEVBQUUsQ0FMTjtBQU1MQyxJQUFBQSxZQUFZLEVBQUUsQ0FOVDtBQU9MQyxJQUFBQSxTQUFTLEVBQUUsWUFQTjtBQVFMUixJQUFBQSxJQUFJLEVBQUU7QUFSRCxHQUxNO0FBZ0JibUQsRUFBQUEsR0FBRyxFQUFDO0FBQ0ZwRCxJQUFBQSxPQUFPLEVBQUUsQ0FEUDtBQUdGTSxJQUFBQSxXQUFXLEVBQUUsRUFIWDtBQUlGQyxJQUFBQSxTQUFTLEVBQUUsQ0FKVDtBQUtGQyxJQUFBQSxZQUFZLEVBQUUsQ0FMWjtBQU1GQyxJQUFBQSxTQUFTLEVBQUUsWUFOVDtBQU9GUixJQUFBQSxJQUFJLEVBQUU7QUFQSjtBQWhCUyxDQUFmO0FBMEJPLFNBQVNnSixhQUFULENBQXVCO0FBQUUxRCxFQUFBQSxXQUFGO0FBQWVELEVBQUFBLGFBQWY7QUFBOEI0RCxFQUFBQSxTQUE5QjtBQUF3Q3ZILEVBQUFBO0FBQXhDLENBQXZCLEVBQTBFO0FBQy9FLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRXZCLFFBQU0sQ0FBQzRCO0FBQW5CLEtBRUU7QUFBTyxJQUFBLEtBQUssRUFBRTVCLFFBQU0sQ0FBQ2MsS0FBckI7QUFBNEIsSUFBQSxRQUFRLEVBQUVTLE9BQU8sSUFBR0EsT0FBTyxDQUFDeEQsS0FBUixLQUFnQixTQUFoRTtBQUE0RSxJQUFBLElBQUksRUFBQyxNQUFqRjtBQUF3RixJQUFBLFFBQVEsRUFBRW1ILGFBQWxHO0FBQWtILG1CQUFZLGVBQTlIO0FBQThJLElBQUEsS0FBSyxFQUFFQztBQUFySixJQUZGLEVBSUUsZUFDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLFFBQVEsRUFBRTVELE9BQU8sSUFBR0EsT0FBTyxDQUFDeEQsS0FBUixLQUFnQixTQUE1QztBQUF3RCxJQUFBLEtBQUssRUFBRWlDLFFBQU0sQ0FBQ2dELEdBQXRFO0FBQTRFLElBQUEsS0FBSyxFQUFDLE1BQWxGO0FBQXlGLElBQUEsRUFBRSxFQUFDLFNBQTVGO0FBQXNHLElBQUEsT0FBTyxFQUFFOEYsU0FBL0c7QUFBMEgsbUJBQVk7QUFBdEksSUFERixDQUpGLENBREY7QUFVRDs7QUN2Q0QsTUFBTXRJLE9BQUssR0FBRztBQUNWOEMsRUFBQUEsS0FBSyxFQUFFLEtBREc7QUFFVjRELEVBQUFBLEtBQUssRUFBRSxPQUZHO0FBR1Z6RyxFQUFBQSxLQUFLLEVBQUUsTUFIRztBQUlWc0csRUFBQUEsUUFBUSxFQUFFLEVBSkE7QUFLVnRELEVBQUFBLFNBQVMsRUFBRTtBQUxELENBQWQ7QUFPTyxTQUFTc0YsY0FBVCxDQUF3QjtBQUFFL0IsRUFBQUE7QUFBRixDQUF4QixFQUFxQztBQUN4QyxTQUFPO0FBQUssSUFBQSxLQUFLLEVBQUV4RyxPQUFaO0FBQW1CLG1CQUFZO0FBQS9CLEtBQWtEd0csT0FBTyxDQUFDc0IsSUFBMUQsQ0FBUDtBQUNIOztBQ1RELE1BQU05SCxPQUFLLEdBQUc7QUFDVjhDLEVBQUFBLEtBQUssRUFBRSxLQURHO0FBRVY0RCxFQUFBQSxLQUFLLEVBQUUsT0FGRztBQUdWekcsRUFBQUEsS0FBSyxFQUFFLE1BSEc7QUFJVnNHLEVBQUFBLFFBQVEsRUFBRSxFQUpBO0FBS1Z0RCxFQUFBQSxTQUFTLEVBQUU7QUFMRCxDQUFkO0FBT08sU0FBU3VGLGNBQVQsQ0FBd0I7QUFBRWhDLEVBQUFBLE9BQUY7QUFBVXhDLEVBQUFBO0FBQVYsQ0FBeEIsRUFBa0Q7QUFDckQsV0FBU3lFLGdCQUFULENBQTBCaE0sQ0FBMUIsRUFBNEI7QUFDeEJBLElBQUFBLENBQUMsQ0FBQ2lNLGNBQUY7QUFDQTFFLElBQUFBLFlBQVksQ0FBQ3ZILENBQUQsQ0FBWjtBQUNIOztBQUNEO0FBQ0EsU0FBTztBQUFLLElBQUEsS0FBSyxFQUFFdUQsT0FBWjtBQUFtQixtQkFBWTtBQUEvQixLQUFrRHdHLE9BQU8sQ0FBQ3NCLElBQTFELEVBQ1A7QUFBRyxJQUFBLEVBQUUsRUFBQyxTQUFOO0FBQWdCLG1CQUFZLGFBQTVCO0FBQTBDLElBQUEsSUFBSSxFQUFDLEdBQS9DO0FBQW1ELElBQUEsT0FBTyxFQUFFVztBQUE1RCxnQkFETyxDQUFQO0FBR0g7O0FDWEQsTUFBTWpKLFFBQU0sR0FBRztBQUNibUosRUFBQUEsZ0JBQWdCLEVBQUU7QUFDaEI7QUFDQTlJLElBQUFBLFNBQVMsRUFBRSxZQUZLO0FBR2hCVCxJQUFBQSxPQUFPLEVBQUUsQ0FITztBQUlsQjtBQUNFQyxJQUFBQSxJQUFJLEVBQUUsRUFMVTtBQU1oQnVKLElBQUFBLFNBQVMsRUFBRSxNQU5LO0FBT2hCQyxJQUFBQSxTQUFTLEVBQUU7QUFQSztBQURMLENBQWY7QUFZTyxTQUFTQyxRQUFULENBQWtCO0FBQ3ZCQyxFQUFBQSxRQUR1QjtBQUV2QlQsRUFBQUEsU0FGdUI7QUFHdkI1RCxFQUFBQSxhQUh1QjtBQUl2QkMsRUFBQUEsV0FKdUI7QUFLdkIzRCxFQUFBQSxRQUx1QjtBQU12QkQsRUFBQUEsT0FOdUI7QUFPdkJpRCxFQUFBQTtBQVB1QixDQUFsQixFQVFKO0FBQ0QsUUFBTWdGLFdBQVcsR0FBR0MsQ0FBTSxDQUFDLElBQUQsQ0FBMUI7QUFFQW5ELEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSWlELFFBQUosRUFBYztBQUNaQyxNQUFBQSxXQUFXLENBQUNwSCxPQUFaLENBQW9Cc0gsU0FBcEIsR0FBZ0NGLFdBQVcsQ0FBQ3BILE9BQVosQ0FBb0J1SCxZQUFwRDtBQUNEO0FBQ0YsR0FKUSxFQUlOLENBQUNKLFFBQUQsQ0FKTSxDQUFUOztBQU1BLFdBQVNLLE1BQVQsQ0FBZ0IzTSxDQUFoQixFQUFtQjtBQUNqQjZMLElBQUFBLFNBQVMsQ0FBQzdMLENBQUQsQ0FBVDtBQUNBdU0sSUFBQUEsV0FBVyxDQUFDcEgsT0FBWixDQUFvQnNILFNBQXBCLEdBQWdDRixXQUFXLENBQUNwSCxPQUFaLENBQW9CdUgsWUFBcEQ7QUFDRDs7QUFDRCxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRXRKLE1BQUFBLFNBQVMsRUFBRSxZQUFiO0FBQTJCSSxNQUFBQSxLQUFLLEVBQUUsTUFBbEM7QUFBMENxQixNQUFBQSxNQUFNLEVBQUUsTUFBbEQ7QUFBMERwQyxNQUFBQSxPQUFPLEVBQUUsTUFBbkU7QUFBMkVxRCxNQUFBQSxhQUFhLEVBQUUsUUFBMUY7QUFBb0d0QixNQUFBQSxVQUFVLEVBQUU7QUFBaEg7QUFBWixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUV6QixRQUFNLENBQUNtSixnQkFBbkI7QUFBcUMsSUFBQSxHQUFHLEVBQUVLO0FBQTFDLEtBQ0dELFFBQVEsSUFDUEEsUUFBUSxDQUFDN0gsTUFBVCxHQUFrQixDQURuQixJQUVDbUksYUFBYSxDQUFDO0FBQUVOLElBQUFBLFFBQVEsRUFBRU8sWUFBWSxDQUFDO0FBQUVQLE1BQUFBO0FBQUYsS0FBRCxDQUF4QjtBQUF3Qy9ILElBQUFBO0FBQXhDLEdBQUQsQ0FBYixDQUFrRUcsR0FBbEUsQ0FDR3ZFLENBQUQsSUFDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVzQyxNQUFBQSxPQUFPLEVBQUU7QUFBWDtBQUFaLEtBQ0csR0FESCxFQUVHLENBQUN0QyxDQUFDLENBQUNhLElBQUgsSUFBVyxFQUFDLE9BQUQ7QUFBUyxJQUFBLE9BQU8sRUFBRWI7QUFBbEIsSUFGZCxFQUdHQSxDQUFDLENBQUNhLElBQUYsSUFBVWIsQ0FBQyxDQUFDYSxJQUFGLEtBQVcsU0FBckIsSUFBa0MsRUFBQyxjQUFEO0FBQWdCLElBQUEsT0FBTyxFQUFFYjtBQUF6QixJQUhyQyxFQUlHQSxDQUFDLENBQUNhLElBQUYsSUFBVWIsQ0FBQyxDQUFDYSxJQUFGLEtBQVcsU0FBckIsSUFBa0MsRUFBQyxjQUFEO0FBQWdCLElBQUEsT0FBTyxFQUFFYixDQUF6QjtBQUE0QixJQUFBLFlBQVksRUFBRW9IO0FBQTFDLElBSnJDLENBRkosQ0FISixDQURGLEVBZUU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFM0UsTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFBWixLQUNFLEVBQUMsYUFBRDtBQUNFLElBQUEsT0FBTyxFQUFFMEIsT0FEWDtBQUVFLElBQUEsU0FBUyxFQUFFcUksTUFGYjtBQUdFLElBQUEsV0FBVyxFQUFFekUsV0FIZjtBQUlFLElBQUEsYUFBYSxFQUFFRDtBQUpqQixJQURGLENBZkYsQ0FERjtBQTJCRDs7QUFDRCxTQUFTMkUsYUFBVCxDQUF1QjtBQUFFTixFQUFBQSxRQUFGO0FBQVkvSCxFQUFBQTtBQUFaLENBQXZCLEVBQStDO0FBQzdDLE1BQUkrSCxRQUFRLElBQUlBLFFBQVEsQ0FBQzdILE1BQVQsR0FBa0IsQ0FBOUIsSUFBbUNGLFFBQXZDLEVBQWlEO0FBQy9DLFdBQU8rSCxRQUFRLENBQUM1SCxHQUFULENBQWNvSSxHQUFELElBQVM7QUFDM0IsVUFBSUEsR0FBRyxDQUFDdkksUUFBSixLQUFpQkEsUUFBckIsRUFBK0I7QUFDN0IsZUFBTyxFQUFFLEdBQUd1SSxHQUFMO0FBQVU3QyxVQUFBQSxLQUFLLEVBQUUsT0FBakI7QUFBMEIxRixVQUFBQSxRQUFRLEVBQUU7QUFBcEMsU0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sRUFBRSxHQUFHdUksR0FBTDtBQUFVN0MsVUFBQUEsS0FBSyxFQUFFO0FBQWpCLFNBQVA7QUFDRDtBQUNGLEtBTk0sQ0FBUDtBQU9ELEdBUkQsTUFRTztBQUNMLFdBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBQ0QsU0FBUzRDLFlBQVQsQ0FBc0I7QUFBRVAsRUFBQUE7QUFBRixDQUF0QixFQUFvQztBQUNsQyxNQUFJQSxRQUFKLEVBQWM7QUFDWixXQUFPQSxRQUFRLENBQUNTLElBQVQsRUFBUDtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FDL0VjLFNBQVNDLFFBQVQsQ0FBa0I7QUFDL0JWLEVBQUFBLFFBQVEsR0FBRyxFQURvQjtBQUUvQnJFLEVBQUFBLGFBRitCO0FBRy9CNEQsRUFBQUEsU0FIK0I7QUFJL0IzRCxFQUFBQSxXQUorQjtBQUsvQjNELEVBQUFBLFFBTCtCO0FBTS9CRCxFQUFBQSxPQU4rQjtBQU8vQmlELEVBQUFBLFlBUCtCO0FBUS9CN0YsRUFBQUE7QUFSK0IsQ0FBbEIsRUFTWjtBQUVEMkgsRUFBQUEsR0FBUyxDQUFDLE1BQUk7QUFDWixXQUFPLE1BQUk7QUFDVDtBQUNBQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxpQkFBWixFQUZTO0FBSVYsS0FKRDtBQUtELEdBTlEsRUFNUCxFQU5PLENBQVQ7QUFPQSxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDO0FBQVgsS0FDRSxFQUFDLFFBQUQ7QUFDQSxJQUFBLFlBQVksRUFBRWhDLFlBRGQ7QUFFRSxJQUFBLE9BQU8sRUFBRWpELE9BRlg7QUFHRSxJQUFBLFFBQVEsRUFBRWdJLFFBSFo7QUFJRSxJQUFBLFNBQVMsRUFBRVQsU0FKYjtBQUtFLElBQUEsYUFBYSxFQUFFNUQsYUFMakI7QUFNRSxJQUFBLFdBQVcsRUFBR0MsV0FOaEI7QUFPRSxJQUFBLFFBQVEsRUFBRTNEO0FBUFosSUFERixDQURGO0FBYUQ7O0FDckNELE1BQU1oQixPQUFLLEdBQUc7QUFDWkMsRUFBQUEsS0FBSyxFQUFFLEVBREs7QUFFWnFCLEVBQUFBLE1BQU0sRUFBRSxFQUZJO0FBSVpqQixFQUFBQSxNQUFNLEVBQUU7QUFKSSxDQUFkO0FBTU8sU0FBU3FKLFlBQVQsQ0FBc0I7QUFBRUMsRUFBQUE7QUFBRixDQUF0QixFQUFzQztBQUMzQyxNQUFJQSxVQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDcEIsV0FBTyxFQUFDLFFBQUQsT0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJQSxVQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDM0IsV0FBTyxFQUFDLFVBQUQsT0FBUDtBQUNELEdBRk0sTUFFQSxJQUFJQSxVQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDM0IsV0FBTyxFQUFDLE9BQUQsT0FBUDtBQUNEOztBQUNELFNBQU8sRUFBQyxTQUFELE9BQVA7QUFDRDtBQUVNLFNBQVNDLFFBQVQsR0FBb0I7QUFDekIsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBRzVKLE9BQUw7QUFBWXFCLE1BQUFBLGVBQWUsRUFBRTtBQUE3QixLQURUO0FBRUUsbUJBQVk7QUFGZCxJQURGO0FBTUQ7QUFFTSxTQUFTd0ksU0FBVCxHQUFxQjtBQUMxQixTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHN0osT0FBTDtBQUFZcUIsTUFBQUEsZUFBZSxFQUFFO0FBQTdCLEtBRFQ7QUFFRSxtQkFBWTtBQUZkLElBREY7QUFNRDtBQUVNLFNBQVN5SSxVQUFULEdBQXNCO0FBQzNCLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUc5SixPQUFMO0FBQVlxQixNQUFBQSxlQUFlLEVBQUU7QUFBN0IsS0FEVDtBQUVFLG1CQUFZO0FBRmQsSUFERjtBQU1EO0FBRU0sU0FBUzBJLE9BQVQsR0FBbUI7QUFDeEIsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBRy9KLE9BQUw7QUFBWXFCLE1BQUFBLGVBQWUsRUFBRTtBQUE3QixLQURUO0FBRUUsbUJBQVk7QUFGZCxJQURGO0FBTUQ7O0FDakRELE1BQU0ySSxZQUFZLEdBQUduTSxDQUFhLEVBQWxDOztBQWNBLFNBQVNvTSxhQUFULENBQXVCM0wsS0FBdkIsRUFBOEI7QUFFNUIsUUFBTTtBQUFFTSxJQUFBQTtBQUFGLE1BQWdCTixLQUF0QjtBQUVBLFFBQU0sQ0FBQ2YsS0FBRCxFQUFRMk0sUUFBUixJQUFvQmhGLEdBQVEsQ0FBQ3RHLFNBQUQsQ0FBbEM7QUFFQSxTQUFPLEVBQUMsWUFBRCxDQUFjLFFBQWQ7QUFBdUIsSUFBQSxLQUFLLEVBQUVyQjtBQUE5QixLQUF5Q2UsS0FBekMsRUFBUDtBQUNEOztBQ3BCTSxTQUFTNkwsYUFBVCxDQUF1QjtBQUFFQyxFQUFBQTtBQUFGLENBQXZCLEVBQWlDO0FBQ3RDLFFBQU07QUFBQ2hNLElBQUFBO0FBQUQsTUFBYUYsV0FBVyxFQUE5Qjs7QUFFQSxXQUFTbU0sV0FBVCxDQUFxQjVOLENBQXJCLEVBQXdCO0FBQ3RCLFVBQU07QUFBRXNELE1BQUFBO0FBQUYsUUFBU3RELENBQUMsQ0FBQ3FFLE1BQWpCO0FBQ0ExQyxJQUFBQSxVQUFVLENBQUM7QUFBQ1QsTUFBQUEsWUFBWSxFQUFDLEdBQWQ7QUFBa0JELE1BQUFBLEtBQUssRUFBRSxJQUFHcUMsRUFBRztBQUEvQixLQUFELENBQVY7QUFDRDs7QUFDRCxTQUNFLGVBQ0UsRUFBQyxJQUFELFFBQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsVUFBYjtBQUF3QixJQUFBLE9BQU8sRUFBRXNLO0FBQWpDLGdCQURGLEVBSUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsT0FBYjtBQUFxQixJQUFBLE9BQU8sRUFBRUE7QUFBOUIsYUFKRixFQU9FLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFNBQWI7QUFBdUIsSUFBQSxPQUFPLEVBQUVBO0FBQWhDLGVBUEYsRUFVRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxRQUFiO0FBQXNCLElBQUEsT0FBTyxFQUFFQTtBQUEvQixjQVZGLEVBYUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsU0FBYjtBQUF1QixJQUFBLE9BQU8sRUFBRUE7QUFBaEMsZUFiRixFQWdCRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxTQUFiO0FBQXVCLElBQUEsT0FBTyxFQUFFQTtBQUFoQyxlQWhCRixFQW1CRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxVQUFiO0FBQXdCLElBQUEsT0FBTyxFQUFFQTtBQUFqQyxnQkFuQkYsRUF1QkUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsV0FBYjtBQUF5QixJQUFBLE9BQU8sRUFBRUE7QUFBbEMsaUJBdkJGLEVBMEJFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFNBQWI7QUFBdUIsSUFBQSxPQUFPLEVBQUVBO0FBQWhDLGVBMUJGLEVBNkJFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFVBQWI7QUFBd0IsSUFBQSxPQUFPLEVBQUVBO0FBQWpDLGdCQTdCRixFQWdDRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxRQUFiO0FBQXNCLElBQUEsT0FBTyxFQUFFQTtBQUEvQixvQkFoQ0YsRUFtQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsUUFBYjtBQUFzQixJQUFBLE9BQU8sRUFBRUE7QUFBL0IsYUFuQ0YsRUFzQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsaUJBQWI7QUFBK0IsSUFBQSxPQUFPLEVBQUVBO0FBQXhDLHNCQXRDRixFQXlDRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxPQUFiO0FBQXFCLElBQUEsT0FBTyxFQUFFQTtBQUE5QixhQXpDRixDQURGLENBREY7QUFpREQ7O0FDMURELE1BQU1ySyxPQUFLLEdBQUc7QUFDWnNLLEVBQUFBLEtBQUssRUFBRTtBQUNMckssSUFBQUEsS0FBSyxFQUFFLEVBREY7QUFFTHFCLElBQUFBLE1BQU0sRUFBRSxFQUZIO0FBR0xELElBQUFBLGVBQWUsRUFBRSxPQUhaO0FBSUx5QixJQUFBQSxLQUFLLEVBQUUsT0FKRjtBQUtMRyxJQUFBQSxTQUFTLEVBQUMsUUFMTDtBQU1Mb0QsSUFBQUEsWUFBWSxFQUFDLEVBTlI7QUFPTG5ILElBQUFBLE9BQU8sRUFBQyxNQVBIO0FBUUxtRCxJQUFBQSxVQUFVLEVBQUMsUUFSTjtBQVNMbEQsSUFBQUEsY0FBYyxFQUFDO0FBVFY7QUFESyxDQUFkO0FBYU8sU0FBU3NILFNBQVQsQ0FBaUI7QUFBRTZELEVBQUFBLEtBQUssR0FBQztBQUFSLENBQWpCLEVBQThCO0FBQ25DLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFDcEwsTUFBQUEsT0FBTyxFQUFDLE1BQVQ7QUFBaUJtRCxNQUFBQSxVQUFVLEVBQUM7QUFBNUI7QUFBWixLQUNNLDBCQUROLEVBRUU7QUFBSyxJQUFBLEtBQUssRUFBRXJDLE9BQUssQ0FBQ3NLLEtBQWxCO0FBQXlCLG1CQUFZO0FBQXJDLEtBQXNEQSxLQUF0RCxDQUZGLENBREY7QUFNRDs7QUNwQk0sU0FBU0MsU0FBVCxHQUFvQjtBQUN2QixTQUFPLGVBRUgsRUFBQzlELFNBQUQ7QUFBUyxJQUFBLEtBQUssRUFBRTtBQUFoQixJQUZHLENBQVA7QUFJSDs7QUNQTSxNQUFNc0MsUUFBUSxHQUFFLENBQ25CO0FBQ0EvSCxFQUFBQSxRQUFRLEVBQUMsT0FEVDtBQUVBOEcsRUFBQUEsSUFBSSxFQUFHLHdCQUZQO0FBR0FuQixFQUFBQSxTQUFTLEVBQUU7QUFIWCxDQURtQixFQU1wQjtBQUNDM0YsRUFBQUEsUUFBUSxFQUFDLE1BRFY7QUFFQzhHLEVBQUFBLElBQUksRUFBRywyQkFGUjtBQUdDbkIsRUFBQUEsU0FBUyxFQUFFO0FBSFosQ0FOb0IsRUFVbkI7QUFDQTNGLEVBQUFBLFFBQVEsRUFBQyxPQURUO0FBRUE4RyxFQUFBQSxJQUFJLEVBQUcsa0JBRlA7QUFHQW5CLEVBQUFBLFNBQVMsRUFBRTtBQUhYLENBVm1CLEVBZXJCO0FBQ0UzRixFQUFBQSxRQUFRLEVBQUMsT0FEWDtBQUVFOEcsRUFBQUEsSUFBSSxFQUFHLG1CQUZUO0FBR0VuQixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQWZxQixFQW9CckI7QUFDRTNGLEVBQUFBLFFBQVEsRUFBQyxNQURYO0FBRUU4RyxFQUFBQSxJQUFJLEVBQUcsdUJBRlQ7QUFHRW5CLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBcEJxQixHQTBCckI7QUFDRTNGLEVBQUFBLFFBQVEsRUFBQyxNQURYO0FBRUU4RyxFQUFBQSxJQUFJLEVBQUcsc0JBRlQ7QUFHRW5CLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBMUJxQixFQStCckI7QUFDRTNGLEVBQUFBLFFBQVEsRUFBQyxNQURYO0FBRUU4RyxFQUFBQSxJQUFJLEVBQUcsc0JBRlQ7QUFHRW5CLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBL0JxQixFQW9DckI7QUFDRTNGLEVBQUFBLFFBQVEsRUFBQyxPQURYO0FBRUU4RyxFQUFBQSxJQUFJLEVBQUcsVUFGVDtBQUdFbkIsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0FwQ3FCLEVBeUNyQjtBQUNFM0YsRUFBQUEsUUFBUSxFQUFDLE9BRFg7QUFFRThHLEVBQUFBLElBQUksRUFBRyxVQUZUO0FBR0VuQixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQXpDcUIsRUE4Q3JCO0FBQ0UzRixFQUFBQSxRQUFRLEVBQUMsT0FEWDtBQUVFOEcsRUFBQUEsSUFBSSxFQUFHLFVBRlQ7QUFHRW5CLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBOUNxQixFQW1EckI7QUFDRTNGLEVBQUFBLFFBQVEsRUFBQyxPQURYO0FBRUU4RyxFQUFBQSxJQUFJLEVBQUcsVUFGVDtBQUdFbkIsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0FuRHFCLEVBd0RyQjtBQUNFM0YsRUFBQUEsUUFBUSxFQUFDLE9BRFg7QUFFRThHLEVBQUFBLElBQUksRUFBRyxVQUZUO0FBR0VuQixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQXhEcUIsQ0FBaEI7O0FDSVEsU0FBUzZELGNBQVQsQ0FBd0I7QUFBRS9JLEVBQUFBLGNBQUY7QUFBaUJnSixFQUFBQSxjQUFqQjtBQUFnQ0MsRUFBQUE7QUFBaEMsQ0FBeEIsRUFBMEU7QUFFdkYsUUFBTSxDQUFDQyxLQUFELEVBQU9DLFFBQVAsSUFBa0IxRixHQUFRLENBQUMsRUFBRCxDQUFoQztBQUNGWSxFQUFBQSxHQUFTLENBQUMsTUFBSTtBQUNkLFFBQUdyRSxjQUFILEVBQWtCO0FBRWhCLFlBQU1vSixPQUFPLEdBQUVySixxQkFBcUIsQ0FBQztBQUFDQyxRQUFBQTtBQUFELE9BQUQsQ0FBcEM7QUFFQW1KLE1BQUFBLFFBQVEsQ0FBQ0MsT0FBRCxDQUFSO0FBQ0Q7QUFFQSxHQVJRLEVBUVAsQ0FBQ3BKLGNBQUQsQ0FSTyxDQUFUO0FBVUUsU0FDRTtBQUFLLG1CQUFZLGdCQUFqQjtBQUFrQyxJQUFBLEtBQUssRUFBRTtBQUFDUixNQUFBQSxVQUFVLEVBQUM7QUFBWjtBQUF6QyxLQUNFLEVBQUMsSUFBRCxRQUNHMEosS0FBSyxJQUNKQSxLQUFLLENBQUN6SixNQUFOLEdBQWUsQ0FEaEIsSUFFQ3lKLEtBQUssQ0FBQ3hKLEdBQU4sQ0FBVy9FLENBQUQsSUFBTztBQUVqQixXQUFRO0FBQUssTUFBQSxLQUFLLEVBQUU7QUFBQzhDLFFBQUFBLE9BQU8sRUFBQztBQUFUO0FBQVosT0FDTixFQUFDLFFBQUQ7QUFBVSxNQUFBLE9BQU8sRUFBRXVMLGNBQW5CO0FBQW1DLE1BQUEsRUFBRSxFQUFFck8sQ0FBQyxDQUFDNEUsUUFBekM7QUFBbUQsTUFBQSxLQUFLLEVBQUU7QUFBQzNCLFFBQUFBLElBQUksRUFBQztBQUFOLE9BQTFEO0FBQW9FLHFCQUFjLEdBQUVqRCxDQUFDLENBQUM0RSxRQUFTO0FBQS9GLE9BQTBHNUUsQ0FBQyxDQUFDNEUsUUFBNUcsaUJBQWlJNUUsQ0FBQyxDQUFDMEYsWUFBbkksQ0FETSxFQUVOLEVBQUMsUUFBRDtBQUFVLE1BQUEsT0FBTyxFQUFFNEksY0FBbkI7QUFBbUMsTUFBQSxFQUFFLEVBQUV0TyxDQUFDLENBQUM0RSxRQUF6QztBQUFtRCxNQUFBLEtBQUssRUFBRTtBQUFDOEIsUUFBQUEsS0FBSyxFQUFDO0FBQVAsT0FBMUQ7QUFBeUUscUJBQWMsR0FBRTFHLENBQUMsQ0FBQzRFLFFBQVM7QUFBcEcsV0FGTSxDQUFSO0FBSUMsR0FORCxDQUhKLENBREYsQ0FERjtBQWVEOztBQzdCRCxNQUFNOEosT0FBTyxHQUFHLENBQ2Q7QUFDRTlKLEVBQUFBLFFBQVEsRUFBRSxNQURaO0FBRUV6RCxFQUFBQSxLQUFLLEVBQUUsV0FGVDtBQUdFaUosRUFBQUEsT0FBTyxFQUFFO0FBQUVzQixJQUFBQSxJQUFJLEVBQUUsV0FBUjtBQUFxQm5CLElBQUFBLFNBQVMsRUFBRTtBQUFoQztBQUhYLENBRGMsRUFPZDtBQUNFM0YsRUFBQUEsUUFBUSxFQUFFLE1BRFo7QUFFRXpELEVBQUFBLEtBQUssRUFBRSxXQUZUO0FBR0VpSixFQUFBQSxPQUFPLEVBQUU7QUFBRXNCLElBQUFBLElBQUksRUFBRSxXQUFSO0FBQXFCbkIsSUFBQUEsU0FBUyxFQUFFO0FBQWhDO0FBSFgsQ0FQYyxFQVlkO0FBQ0UzRixFQUFBQSxRQUFRLEVBQUUsTUFEWjtBQUVFekQsRUFBQUEsS0FBSyxFQUFFLFdBRlQ7QUFHRWlKLEVBQUFBLE9BQU8sRUFBRTtBQUFFc0IsSUFBQUEsSUFBSSxFQUFFLFdBQVI7QUFBcUJuQixJQUFBQSxTQUFTLEVBQUU7QUFBaEM7QUFIWCxDQVpjLENBQWhCO0FBbUJPLFNBQVNvRSxVQUFULEdBQXNCO0FBQzNCLFNBQU8sRUFBQ0MsY0FBRDtBQUFRLElBQUEsY0FBYyxFQUFFeEoscUJBQXFCLENBQUM7QUFBQ0MsTUFBQUEsY0FBYyxFQUFDcUo7QUFBaEIsS0FBRDtBQUE3QyxJQUFQO0FBQ0Q7O0FDckJELE1BQU10RSxPQUFPLEdBQUU7QUFBQ3NCLEVBQUFBLElBQUksRUFBQyxrREFBTjtBQUNmbkIsRUFBQUEsU0FBUyxFQUFDLEtBREs7QUFFZjNGLEVBQUFBLFFBQVEsRUFBQztBQUZNLENBQWY7QUFJTyxTQUFTaUssa0JBQVQsR0FBNkI7QUFDaEMsU0FBTyxFQUFDLGNBQUQ7QUFBZ0IsSUFBQSxPQUFPLEVBQUV6RTtBQUF6QixJQUFQO0FBQ0g7O0FDYUQsTUFBTWhHLFFBQVEsR0FBRyxDQUNmO0FBQUVRLEVBQUFBLFFBQVEsRUFBRTtBQUFaLENBRGUsRUFFZjtBQUFFQSxFQUFBQSxRQUFRLEVBQUU7QUFBWixDQUZlLEVBR2Y7QUFBRUEsRUFBQUEsUUFBUSxFQUFFO0FBQVosQ0FIZSxDQUFqQjtBQUtBLE1BQU1ELE9BQU8sR0FBRztBQUNkQyxFQUFBQSxRQUFRLEVBQUUsVUFESTtBQUVkNkQsRUFBQUEsS0FBSyxFQUFFLGdCQUZPO0FBR2QyQixFQUFBQSxPQUFPLEVBQUU7QUFBRXNCLElBQUFBLElBQUksRUFBRyx3QkFBVDtBQUFrQ25CLElBQUFBLFNBQVMsRUFBRTtBQUE3QztBQUhLLENBQWhCO0FBS0EsTUFBTUgsU0FBTyxHQUFHO0FBQ2R4RixFQUFBQSxRQUFRLEVBQUUsT0FESTtBQUVkOEcsRUFBQUEsSUFBSSxFQUFHLHdCQUZPO0FBR2RuQixFQUFBQSxTQUFTLEVBQUU7QUFIRyxDQUFoQjs7QUFNQXVFLENBQU0sQ0FDSixFQUFDLGFBQUQ7QUFDRSxFQUFBLFNBQVMsRUFBRTtBQUNUQyxJQUFBQSxPQUFPLEVBQUU7QUFDUEMsTUFBQUEsVUFBVSxFQUFFLFNBREw7QUFFUHRJLE1BQUFBLEtBQUssRUFBRSxTQUZBO0FBR1B1SSxNQUFBQSxVQUFVLEVBQUU7QUFITDtBQURBO0FBRGIsR0FTRSxFQUFDLGdCQUFEO0FBQWtCLEVBQUEsU0FBUyxFQUFFO0FBQUUxTixJQUFBQSxZQUFZLEVBQUUsR0FBaEI7QUFBcUJELElBQUFBLEtBQUssRUFBRTtBQUE1QjtBQUE3QixHQUNFLEVBQUMsVUFBRDtBQUFZLEVBQUEsYUFBYSxFQUFFLEVBQUMsYUFBRDtBQUEzQixHQUNFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLE9BQUQ7QUFBUyxFQUFBLFFBQVEsRUFBRThDO0FBQW5CLEVBREYsQ0FERixFQUlFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLEtBQUQ7QUFBTyxFQUFBLE9BQU8sRUFBRU87QUFBaEIsRUFERixDQUpGLEVBT0UsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsT0FBRDtBQUFTLEVBQUEsT0FBTyxFQUFFQTtBQUFsQixFQURGLENBUEYsRUFVRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxTQUFEO0FBQVcsRUFBQSxPQUFPLEVBQUVBO0FBQXBCLEVBREYsQ0FWRixFQWFFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLE1BQUQ7QUFBUSxFQUFBLE9BQU8sRUFBRUE7QUFBakIsRUFERixDQWJGLEVBZ0JFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLE9BQUQ7QUFBUyxFQUFBLE9BQU8sRUFBRUE7QUFBbEIsRUFERixDQWhCRixFQW1CRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxPQUFEO0FBQVMsRUFBQSxPQUFPLEVBQUVBO0FBQWxCLEVBREYsQ0FuQkYsRUFzQkUsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsUUFBRDtBQUFVLEVBQUEsT0FBTyxFQUFFQSxPQUFuQjtBQUE0QixFQUFBLFFBQVEsRUFBRWdJLFFBQXRDO0FBQWdELEVBQUEsUUFBUSxFQUFDO0FBQXpELEVBREYsQ0F0QkYsRUF5QkUsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFO0FBQUssRUFBQSxLQUFLLEVBQUU7QUFBRTNKLElBQUFBLE9BQU8sRUFBRSxFQUFYO0FBQWVpQyxJQUFBQSxlQUFlLEVBQUU7QUFBaEM7QUFBWixHQUNFLEVBQUMsT0FBRDtBQUFTLEVBQUEsT0FBTyxFQUFFbUYsU0FBbEI7QUFBMkIsRUFBQSxRQUFRLEVBQUV6RixPQUFPLENBQUNDO0FBQTdDLEVBREYsQ0FERixDQXpCRixFQThCRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsZUFDRSxFQUFDLFlBQUQ7QUFBYyxFQUFBLE1BQU07QUFBcEIsRUFERixFQUVFLEVBQUMsWUFBRCxPQUZGLENBREYsQ0E5QkYsRUFvQ0UsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsUUFBRDtBQUFVLEVBQUEsT0FBTyxFQUFFRCxPQUFuQjtBQUE0QixFQUFBLFFBQVEsRUFBRWdJLFFBQXRDO0FBQWdELEVBQUEsUUFBUSxFQUFDO0FBQXpELEVBREYsQ0FwQ0YsRUF1Q0UsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsVUFBRCxPQURGLENBdkNGLEVBMENFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLGtCQUFELE9BREYsQ0ExQ0YsRUE4Q0UsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsU0FBRCxPQURGLENBOUNGLENBREYsQ0FURixDQURJLEVBK0RKdUMsUUFBUSxDQUFDQyxJQS9ETCxDQUFOIn0=
