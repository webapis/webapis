var n,u,i,t,o,r,f,e={},c=[],a=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var i,t=arguments,o={};for(i in l)"key"!==i&&"ref"!==i&&(o[i]=l[i]);if(arguments.length>3)for(u=[u],i=3;i<arguments.length;i++)u.push(t[i]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===o[i]&&(o[i]=n.defaultProps[i]);return y(n,o,l&&l.key,l&&l.ref,null)}function y(l,u,i,t,o){var r={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),n.vnode&&n.vnode(r),r}function d(n){return n.children}function m(n,l){this.props=n,this.context=l;}function w(n,l){if(null==l)return n.__?w(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?w(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k(n)}}function g(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!i++||o!==n.debounceRendering)&&((o=n.debounceRendering)||t)(_);}function _(){for(var n;i=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(i=s({},o)).__v=i,t=z(f,o,i,l.__n,void 0!==f.ownerSVGElement,null,u,null==r?w(o):r),T(u,o),t!=r&&k(o)));});}function b(n,l,u,i,t,o,r,f,a,s){var h,p,m,k,g,_,b,x,A,P=i&&i.__k||c,C=P.length;for(a==e&&(a=null!=r?r[0]:C?w(i,0):null),u.__k=[],h=0;h<l.length;h++)if(null!=(k=u.__k[h]=null==(k=l[h])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k?y(null,k,null,null,k):Array.isArray(k)?y(d,{children:k},null,null,null):null!=k.__e||null!=k.__c?y(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(m=P[h])||m&&k.key==m.key&&k.type===m.type)P[h]=void 0;else for(p=0;p<C;p++){if((m=P[p])&&k.key==m.key&&k.type===m.type){P[p]=void 0;break}m=null;}if(g=z(n,k,m=m||e,t,o,r,f,a,s),(p=k.ref)&&m.ref!=p&&(x||(x=[]),m.ref&&x.push(m.ref,null,k),x.push(p,k.__c||g,k)),null!=g){if(null==b&&(b=g),A=void 0,void 0!==k.__d)A=k.__d,k.__d=void 0;else if(r==m||g!=a||null==g.parentNode){n:if(null==a||a.parentNode!==n)n.appendChild(g),A=null;else {for(_=a,p=0;(_=_.nextSibling)&&p<C;p+=2)if(_==g)break n;n.insertBefore(g,a),A=a;}"option"==u.type&&(n.value="");}a=void 0!==A?A:g.nextSibling,"function"==typeof u.type&&(u.__d=a);}else a&&m.__e==a&&a.parentNode!=n&&(a=w(m));}if(u.__e=b,null!=r&&"function"!=typeof u.type)for(h=r.length;h--;)null!=r[h]&&v(r[h]);for(h=C;h--;)null!=P[h]&&D(P[h],P[h]);if(x)for(h=0;h<x.length;h++)j(x[h],x[++h],x[++h]);}function A(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||C(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||C(n,o,l[o],u[o],i);}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===a.test(l)?u+"px":null==u?"":u;}function C(n,l,u,i,t){var o,r,f,e,c;if(t?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else {if("string"==typeof i&&(o.cssText="",i=null),i)for(e in i)u&&e in u||P(o,e,"");if(u)for(c in u)i&&u[c]===i[c]||P(o,c,u[c]);}else "o"===l[0]&&"n"===l[1]?(r=l!==(l=l.replace(/Capture$/,"")),f=l.toLowerCase(),l=(f in n?f:l).slice(2),u?(i||n.addEventListener(l,N,r),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,N,r)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u));}function N(l){this.l[l.type](n.event?n.event(l):l);}function z(l,u,i,t,o,r,f,e,c){var a,v,h,y,p,w,k,g,_,x,A,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(g=u.props,_=(a=P.contextType)&&t[a.__c],x=a?_?_.props.value:a.__:t,i.__c?k=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(g,x):(u.__c=v=new m(g,x),v.constructor=P,v.render=E),_&&_.sub(v),v.props=g,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=s({},v.__s)),s(v.__s,P.getDerivedStateFromProps(g,v.__s))),y=v.props,p=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&g!==y&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(g,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(g,v.__s,x)||u.__v===i.__v){for(v.props=g,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v),a=0;a<u.__k.length;a++)u.__k[a]&&(u.__k[a].__=u);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(g,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(y,p,w);});}v.context=x,v.props=g,v.state=v.__s,(a=n.__r)&&a(u),v.__d=!1,v.__v=u,v.__P=l,a=v.render(v.props,v.state,v.context),null!=v.getChildContext&&(t=s(s({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(w=v.getSnapshotBeforeUpdate(y,p)),A=null!=a&&a.type==d&&null==a.key?a.props.children:a,b(l,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),v.base=u.__e,v.__h.length&&f.push(v),k&&(v.__E=v.__=null),v.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=$(i.__e,u,i,t,o,r,f,c);(a=n.diffed)&&a(u);}catch(l){u.__v=null,n.__e(l,u,i);}return u.__e}function T(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n.__e(l,u.__v);}});}function $(n,l,u,i,t,o,r,f){var a,s,v,h,y,p=u.props,d=l.props;if(t="svg"===l.type||t,null!=o)for(a=0;a<o.length;a++)if(null!=(s=o[a])&&((null===l.type?3===s.nodeType:s.localName===l.type)||n==s)){n=s,o[a]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,f=!1;}if(null===l.type)p!==d&&n.data!=d&&(n.data=d);else {if(null!=o&&(o=c.slice.call(n.childNodes)),v=(p=u.props||e).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!f){if(null!=o)for(p={},y=0;y<n.attributes.length;y++)p[n.attributes[y].name]=n.attributes[y].value;(h||v)&&(h&&v&&h.__html==v.__html||(n.innerHTML=h&&h.__html||""));}A(n,d,p,t,f),h?l.__k=[]:(a=l.props.children,b(n,Array.isArray(a)?a:[a],l,u,i,"foreignObject"!==l.type&&t,o,r,e,f)),f||("value"in d&&void 0!==(a=d.value)&&a!==n.value&&C(n,"value",a,p.value,!1),"checked"in d&&void 0!==(a=d.checked)&&a!==n.checked&&C(n,"checked",a,p.checked,!1));}return n}function j(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,i);}}function D(l,u,i){var t,o,r;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||j(t,null,u)),i||"function"==typeof l.type||(i=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(r=0;r<t.length;r++)t[r]&&D(t[r],u,i);null!=o&&v(o);}function E(n,l,u){return this.constructor(n,u)}function H(l,u,i){var t,o,f;n.__&&n.__(l,u),o=(t=i===r)?null:i&&i.__k||u.__k,l=h(d,null,[l]),f=[],z(u,(t?u:i||u).__k=l,o||e,e,void 0!==u.ownerSVGElement,i&&!t?[i]:o?null:u.childNodes.length?c.slice.call(u.childNodes):null,f,i||e,t),T(f,l);}function M(n){var l={},u={__c:"__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var i,t=this;return this.getChildContext||(i=[],this.getChildContext=function(){return l[u.__c]=t,l},this.shouldComponentUpdate=function(n){t.props.value!==n.value&&i.some(function(l){l.context=n.value,g(l);});},this.sub=function(n){i.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){i.splice(i.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Consumer.contextType=u,u.Provider.__=u,u}n={__e:function(n,l){for(var u,i;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(i=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(i=!0,u.componentDidCatch(n)),i)return g(u.__E=u)}catch(l){n=l;}throw n}},m.prototype.setState=function(n,l){var u;u=this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),g(this));},m.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),g(this));},m.prototype.render=d,u=[],i=0,t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,r=e,f=0;

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

var t$1,u$1,r$1,i$1=0,o$1=[],c$1=n.__r,f$1=n.diffed,e$1=n.__c,a$1=n.unmount;function v$1(t,r){n.__h&&n.__h(u$1,t,i$1||r),i$1=0;var o=u$1.__H||(u$1.__H={__:[],__h:[]});return t>=o.__.length&&o.__.push({}),o.__[t]}function m$1(n){return i$1=1,p(E$1,n)}function p(n,r,i){var o=v$1(t$1++,2);return o.t=n,o.__c||(o.__c=u$1,o.__=[i?i(r):E$1(void 0,r),function(n){var t=o.t(o.__[0],n);o.__[0]!==t&&(o.__[0]=t,o.__c.setState({}));}]),o.__}function l(r,i){var o=v$1(t$1++,3);!n.__s&&x(o.__H,i)&&(o.__=r,o.__H=i,u$1.__H.__h.push(o));}function d$1(n){return i$1=5,h$1(function(){return {current:n}},[])}function h$1(n,u){var r=v$1(t$1++,7);return x(r.__H,u)?(r.__H=u,r.__h=n,r.__=n()):r.__}function w$1(n){var r=u$1.context[n.__c],i=v$1(t$1++,9);return i.__c=n,r?(null==i.__&&(i.__=!0,r.sub(u$1)),r.props.value):n.__}function _$1(){o$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(g$1),t.__H.__h.forEach(q),t.__H.__h=[];}catch(u){return t.__H.__h=[],n.__e(u,t.__v),!0}}),o$1=[];}function g$1(n){"function"==typeof n.u&&n.u();}function q(n){n.u=n.__();}function x(n,t){return !n||t.some(function(t,u){return t!==n[u]})}function E$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){c$1&&c$1(n),t$1=0;var r=(u$1=n.__c).__H;r&&(r.__h.forEach(g$1),r.__h.forEach(q),r.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var u=t.__c;u&&u.__H&&u.__H.__h.length&&(1!==o$1.push(u)&&r$1===n.requestAnimationFrame||((r$1=n.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(r),cancelAnimationFrame(t),setTimeout(n);},r=setTimeout(u,100);"undefined"!=typeof window&&(t=requestAnimationFrame(u));})(_$1));},n.__c=function(t,u){u.some(function(t){try{t.__h.forEach(g$1),t.__h=t.__h.filter(function(n){return !n.__||q(n)});}catch(r){u.some(function(n){n.__h&&(n.__h=[]);}),u=[],n.__e(r,t.__v);}}),e$1&&e$1(t,u);},n.unmount=function(t){a$1&&a$1(t);var u=t.__c;if(u&&u.__H)try{u.__H.__.forEach(g$1);}catch(t){n.__e(t,u.__v);}};

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
  const context = w$1(AppRouteContext);

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
  const [state, dispatch] = p(reducer, initState);
  const value = h$1(() => [state, dispatch], [state]);
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

var css_248z = ".drawer-list-item:hover {\n  background-color: #f5f5f5;\n  cursor: pointer;\n}\n\n.drawer-list-item * {\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n}\n\n.btn {\n  padding: 6px 16px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: none;\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  min-width: 64px;\n  font-weight: 500;\n  font-size: 0.875rem;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}";
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
  }
};
function Message(props) {
  const {
    message
  } = props;
  const {
    float,
    username
  } = message;
  const [days, setDays] = m$1(0);
  const [hours, setHours] = m$1(0);
  const [minutes, setMinutes] = m$1(0);
  const [seconds, setSeconds] = m$1(0);

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

  l(() => {
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
    style: style$6.message
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
  const scrollerRef = d$1(null);
  l(() => {
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
  const [state, setState] = m$1(initState);
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
  }, "BlockerMessage")));
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
  const [items, setItems] = m$1([]);
  l(() => {
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
    debugger;
    return h(ListItem, {
      onClick: onSelectUnread,
      id: u.username
    }, u.username, " ", h("div", {
      style: {
        color: '#737373'
      }
    }, "messages: ", u.messageCount));
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
    route: '/blocker-message'
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
}, h(BlockerMessageDemo, null))))), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXIuanMiLCIuLi9OYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uL2xheW91dC9OYXZMaXN0LmpzIiwiLi4vLi4vbGF5b3V0L1RleHRJbnB1dC5qcyIsIi4uLy4uL2xheW91dC9CdXR0b24uanMiLCIuLi8uLi9oYW5nb3V0cy9IYW5nb3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvTGF5b3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2suanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvQmxvY2suanMiLCIuLi8uLi9sYXlvdXQvQ2VudGVyLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2tlZC5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9QZXJzb25BZGQuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2UuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVyLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VyTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvQmxvY2tlZE1lc3NhZ2UuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VzLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uL0RyYXdlckNvbnRlbnQuanMiLCIuLi9mYWtlTWVzc2FnZXMuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cy5qcyIsIi4uLy4uL2hhbmdvdXRzL1VucmVhZEhhbmdvdXRzLmpzIiwiLi4vVXJlYWREZW1vLmpzIiwiLi4vQmxvY2tlck1lc3NhZ2VEZW1vLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10sYT0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZHxpdGVyYS9pO2Z1bmN0aW9uIHMobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHkobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHkobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24gcCgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBrKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gayhuKX19ZnVuY3Rpb24gZyhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1zKHt9LG8pKS5fX3Y9aSx0PXooZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmayhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYsYSxzKXt2YXIgaCxwLG0sayxnLF8sYix4LEEsUD1pJiZpLl9fa3x8YyxDPVAubGVuZ3RoO2ZvcihhPT1lJiYoYT1udWxsIT1yP3JbMF06Qz93KGksMCk6bnVsbCksdS5fX2s9W10saD0wO2g8bC5sZW5ndGg7aCsrKWlmKG51bGwhPShrPXUuX19rW2hdPW51bGw9PShrPWxbaF0pfHxcImJvb2xlYW5cIj09dHlwZW9mIGs/bnVsbDpcInN0cmluZ1wiPT10eXBlb2Yga3x8XCJudW1iZXJcIj09dHlwZW9mIGs/eShudWxsLGssbnVsbCxudWxsLGspOkFycmF5LmlzQXJyYXkoayk/eShkLHtjaGlsZHJlbjprfSxudWxsLG51bGwsbnVsbCk6bnVsbCE9ay5fX2V8fG51bGwhPWsuX19jP3koay50eXBlLGsucHJvcHMsay5rZXksbnVsbCxrLl9fdik6aykpe2lmKGsuX189dSxrLl9fYj11Ll9fYisxLG51bGw9PT0obT1QW2hdKXx8bSYmay5rZXk9PW0ua2V5JiZrLnR5cGU9PT1tLnR5cGUpUFtoXT12b2lkIDA7ZWxzZSBmb3IocD0wO3A8QztwKyspe2lmKChtPVBbcF0pJiZrLmtleT09bS5rZXkmJmsudHlwZT09PW0udHlwZSl7UFtwXT12b2lkIDA7YnJlYWt9bT1udWxsfWlmKGc9eihuLGssbT1tfHxlLHQsbyxyLGYsYSxzKSwocD1rLnJlZikmJm0ucmVmIT1wJiYoeHx8KHg9W10pLG0ucmVmJiZ4LnB1c2gobS5yZWYsbnVsbCxrKSx4LnB1c2gocCxrLl9fY3x8ZyxrKSksbnVsbCE9Zyl7aWYobnVsbD09YiYmKGI9ZyksQT12b2lkIDAsdm9pZCAwIT09ay5fX2QpQT1rLl9fZCxrLl9fZD12b2lkIDA7ZWxzZSBpZihyPT1tfHxnIT1hfHxudWxsPT1nLnBhcmVudE5vZGUpe246aWYobnVsbD09YXx8YS5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKGcpLEE9bnVsbDtlbHNle2ZvcihfPWEscD0wOyhfPV8ubmV4dFNpYmxpbmcpJiZwPEM7cCs9MilpZihfPT1nKWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoZyxhKSxBPWF9XCJvcHRpb25cIj09dS50eXBlJiYobi52YWx1ZT1cIlwiKX1hPXZvaWQgMCE9PUE/QTpnLm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIHUudHlwZSYmKHUuX19kPWEpfWVsc2UgYSYmbS5fX2U9PWEmJmEucGFyZW50Tm9kZSE9biYmKGE9dyhtKSl9aWYodS5fX2U9YixudWxsIT1yJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB1LnR5cGUpZm9yKGg9ci5sZW5ndGg7aC0tOyludWxsIT1yW2hdJiZ2KHJbaF0pO2ZvcihoPUM7aC0tOyludWxsIT1QW2hdJiZEKFBbaF0sUFtoXSk7aWYoeClmb3IoaD0wO2g8eC5sZW5ndGg7aCsrKWooeFtoXSx4WysraF0seFsrK2hdKX1mdW5jdGlvbiB4KG4pe3JldHVybiBudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4/W106QXJyYXkuaXNBcnJheShuKT9jLmNvbmNhdC5hcHBseShbXSxuLm1hcCh4KSk6W25dfWZ1bmN0aW9uIEEobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fEMobixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxDKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gUChuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PWEudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBDKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fFAobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8UChvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwsTixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwsTixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24gTihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24geihsLHUsaSx0LG8scixmLGUsYyl7dmFyIGEsdixoLHkscCx3LGssZyxfLHgsQSxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhhPW4uX19iKSYmYSh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihnPXUucHJvcHMsXz0oYT1QLmNvbnRleHRUeXBlKSYmdFthLl9fY10seD1hP18/Xy5wcm9wcy52YWx1ZTphLl9fOnQsaS5fX2M/az0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChnLHgpOih1Ll9fYz12PW5ldyBtKGcseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9Zyx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1zKHt9LHYuX19zKSkscyh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhnLHYuX19zKSkpLHk9di5wcm9wcyxwPXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZnIT09eSYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoZyx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGcsdi5fX3MseCl8fHUuX192PT09aS5fX3Ype2Zvcih2LnByb3BzPWcsdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godiksYT0wO2E8dS5fX2subGVuZ3RoO2ErKyl1Ll9fa1thXSYmKHUuX19rW2FdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoZyx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHkscCx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9Zyx2LnN0YXRlPXYuX19zLChhPW4uX19yKSYmYSh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwsYT12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9cyhzKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHkscCkpLEE9bnVsbCE9YSYmYS50eXBlPT1kJiZudWxsPT1hLmtleT9hLnByb3BzLmNoaWxkcmVuOmEsYihsLEFycmF5LmlzQXJyYXkoQSk/QTpbQV0sdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksayYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsoYT1uLmRpZmZlZCkmJmEodSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgYSxzLHYsaCx5LHA9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKGE9MDthPG8ubGVuZ3RoO2ErKylpZihudWxsIT0ocz1vW2FdKSYmKChudWxsPT09bC50eXBlPzM9PT1zLm5vZGVUeXBlOnMubG9jYWxOYW1lPT09bC50eXBlKXx8bj09cykpe249cyxvW2FdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpcCE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PShwPXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYobnVsbCE9bylmb3IocD17fSx5PTA7eTxuLmF0dHJpYnV0ZXMubGVuZ3RoO3krKylwW24uYXR0cmlidXRlc1t5XS5uYW1lXT1uLmF0dHJpYnV0ZXNbeV0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1BKG4sZCxwLHQsZiksaD9sLl9faz1bXTooYT1sLnByb3BzLmNoaWxkcmVuLGIobixBcnJheS5pc0FycmF5KGEpP2E6W2FdLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09KGE9ZC52YWx1ZSkmJmEhPT1uLnZhbHVlJiZDKG4sXCJ2YWx1ZVwiLGEscC52YWx1ZSwhMSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT0oYT1kLmNoZWNrZWQpJiZhIT09bi5jaGVja2VkJiZDKG4sXCJjaGVja2VkXCIsYSxwLmNoZWNrZWQsITEpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSx6KHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDp1LmNoaWxkTm9kZXMubGVuZ3RoP2Muc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpOm51bGwsZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3ZhciB1LGk7Zm9yKGkgaW4gbD1zKHMoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSx1PXt9LGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYodVtpXT1sW2ldKTtyZXR1cm4geShuLnR5cGUsdSxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxnKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHUuUHJvdmlkZXIuX189dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBnKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1zKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmcyh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxnKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGcodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHAgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHUscixpPTAsbz1bXSxjPW4uX19yLGY9bi5kaWZmZWQsZT1uLl9fYyxhPW4udW5tb3VudDtmdW5jdGlvbiB2KHQscil7bi5fX2gmJm4uX19oKHUsdCxpfHxyKSxpPTA7dmFyIG89dS5fX0h8fCh1Ll9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PW8uX18ubGVuZ3RoJiZvLl9fLnB1c2goe30pLG8uX19bdF19ZnVuY3Rpb24gbShuKXtyZXR1cm4gaT0xLHAoRSxuKX1mdW5jdGlvbiBwKG4scixpKXt2YXIgbz12KHQrKywyKTtyZXR1cm4gby50PW4sby5fX2N8fChvLl9fYz11LG8uX189W2k/aShyKTpFKHZvaWQgMCxyKSxmdW5jdGlvbihuKXt2YXIgdD1vLnQoby5fX1swXSxuKTtvLl9fWzBdIT09dCYmKG8uX19bMF09dCxvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gbChyLGkpe3ZhciBvPXYodCsrLDMpOyFuLl9fcyYmeChvLl9fSCxpKSYmKG8uX189cixvLl9fSD1pLHUuX19ILl9faC5wdXNoKG8pKX1mdW5jdGlvbiB5KHIsaSl7dmFyIG89dih0KyssNCk7IW4uX19zJiZ4KG8uX19ILGkpJiYoby5fXz1yLG8uX19IPWksdS5fX2gucHVzaChvKSl9ZnVuY3Rpb24gZChuKXtyZXR1cm4gaT01LGgoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIHMobix0LHUpe2k9Nix5KGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT11P3U6dS5jb25jYXQobikpfWZ1bmN0aW9uIGgobix1KXt2YXIgcj12KHQrKyw3KTtyZXR1cm4geChyLl9fSCx1KT8oci5fX0g9dSxyLl9faD1uLHIuX189bigpKTpyLl9ffWZ1bmN0aW9uIFQobix0KXtyZXR1cm4gaT04LGgoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gdyhuKXt2YXIgcj11LmNvbnRleHRbbi5fX2NdLGk9dih0KyssOSk7cmV0dXJuIGkuX19jPW4scj8obnVsbD09aS5fXyYmKGkuX189ITAsci5zdWIodSkpLHIucHJvcHMudmFsdWUpOm4uX199ZnVuY3Rpb24gQSh0LHUpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHU/dSh0KTp0KX1mdW5jdGlvbiBGKG4pe3ZhciByPXYodCsrLDEwKSxpPW0oKTtyZXR1cm4gci5fXz1uLHUuY29tcG9uZW50RGlkQ2F0Y2h8fCh1LmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3IuX18mJnIuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gXygpe28uc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oLmZvckVhY2gocSksdC5fX0guX19oPVtdfWNhdGNoKHUpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2UodSx0Ll9fdiksITB9fSksbz1bXX1mdW5jdGlvbiBnKG4pe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4udSYmbi51KCl9ZnVuY3Rpb24gcShuKXtuLnU9bi5fXygpfWZ1bmN0aW9uIHgobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQsdSl7cmV0dXJuIHQhPT1uW3VdfSl9ZnVuY3Rpb24gRShuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe2MmJmMobiksdD0wO3ZhciByPSh1PW4uX19jKS5fX0g7ciYmKHIuX19oLmZvckVhY2goZyksci5fX2guZm9yRWFjaChxKSxyLl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHU9dC5fX2M7dSYmdS5fX0gmJnUuX19ILl9faC5sZW5ndGgmJigxIT09by5wdXNoKHUpJiZyPT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgocj1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHU9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQociksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0scj1zZXRUaW1lb3V0KHUsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodSkpfSkoXykpfSxuLl9fYz1mdW5jdGlvbih0LHUpe3Uuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChnKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fHEobil9KX1jYXRjaChyKXt1LnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSx1PVtdLG4uX19lKHIsdC5fX3YpfX0pLGUmJmUodCx1KX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2EmJmEodCk7dmFyIHU9dC5fX2M7aWYodSYmdS5fX0gpdHJ5e3UuX19ILl9fLmZvckVhY2goZyl9Y2F0Y2godCl7bi5fX2UodCx1Ll9fdil9fTtleHBvcnR7bSBhcyB1c2VTdGF0ZSxwIGFzIHVzZVJlZHVjZXIsbCBhcyB1c2VFZmZlY3QseSBhcyB1c2VMYXlvdXRFZmZlY3QsZCBhcyB1c2VSZWYscyBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLGggYXMgdXNlTWVtbyxUIGFzIHVzZUNhbGxiYWNrLHcgYXMgdXNlQ29udGV4dCxBIGFzIHVzZURlYnVnVmFsdWUsRiBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXG4gICAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVJlZHVjZXIsdXNlTWVtbyx1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2aWdhdGlvbihwcm9wcykge1xuICBjb25zdCB7IGNoaWxkcmVuLCBkcmF3ZXJDb250ZW50IH0gPSBwcm9wcztcblxuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxoMSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgcGFkZGluZzogNSB9fT5cbiAgICAgICAgU3Rvcnlib29rXG4gICAgICA8L2gxPlxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT57ZHJhd2VyQ29udGVudH08L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxMCB9fT57Y2hpbGRyZW59PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0ocHJvcHMpIHtcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+e2NoaWxkcmVufTwvZGl2Pjtcbn1cbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTGlzdCh7IGNoaWxkcmVuLCBpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcclxuXHJcbiAgICAgICAgcGFkZGluZ1RvcDogOCxcclxuICAgICAgICBwYWRkaW5nQm90dG9tOiA4LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMaXN0SXRlbSh7IGNoaWxkcmVuLCBvbkNsaWNrLCBpZCB9KSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIGlkPXtpZH1cclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBjbGFzc05hbWU9J2RyYXdlci1saXN0LWl0ZW0nXHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgcGFkZGluZ0xlZnQ6IDE2LFxyXG4gICAgICAgIHBhZGRpbmdSaWdodDogMTYsXHJcbiAgICAgICAgcGFkZGluZ1RvcDogOCxcclxuICAgICAgICBwYWRkaW5nQm90dG9tOiA4LFxyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBwYWRkaW5nOiA4LFxyXG4gIG1hcmdpbkxlZnQ6IDE2LFxyXG4gIG1hcmdpblJpZ2h0OiAxNixcclxuICBtYXJnaW5Ub3A6IDgsXHJcbiAgbWFyZ2luQm90dG9tOiA4LFxyXG4gIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gIGZsZXg6IDEsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBpZCwgdHlwZSA9ICd0ZXh0JyxzdHlsZSB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCB3aWR0aDogJzEwMCUnIH19PlxyXG4gICAgICA8aW5wdXQgIHN0eWxlPXt7Li4uc3R5bGVzLC4uLnN0eWxlfX0gey4uLnByb3BzfSBkYXRhLXRlc3RpZD17aWR9IHR5cGU9e3R5cGV9IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gQnV0dG9uKHByb3BzKSB7XG4gIGNvbnN0IHsgdGl0bGUsc3R5bGUsaWQgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgey4uLnByb3BzfT5cbiAgICAgIHt0aXRsZX1cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7dXNlQXBwUm91dGV9ZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXG5pbXBvcnQge3NhdmVNZXNzYWdlfWZyb20gJy4vc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2F2ZVBlbmRpbmdIYW5nb3V0J1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgaW5wdXRDb250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYm9yZGVyOiAnIzczNzM3MyBzb2xpZCAxcHgnLFxuICB9LFxuICBpbnB1dDoge1xuICAgIHBhZGRpbmc6IDEwLFxuICAgIGZsZXg6IDEsXG4gICAgYm9yZGVyOiAnd2hpdGUnLFxuICBcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXQoe1xuICBoYW5nb3V0cyxcbiAgb25TZWFyY2gsXG4gIG9uU2VsZWN0SGFuZ291dCxcbiAgc2VhcmNoLFxuICB1c2VybmFtZSxcbiAgb25TdGFydFNlYXJjaCxcbiAgZGlzcGF0Y2hcbn0pIHtcbiAgY29uc3Qge29uQXBwUm91dGV9PXVzZUFwcFJvdXRlKClcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dFNlbGVjdGlvbihlKXtcbiAgICBjb25zdCBpZCA9ZS50YXJnZXQuaWRcbiAgICBvblNlbGVjdEhhbmdvdXQoZSlcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZChnPT4gZy51c2VybmFtZT09PWlkKVxuICBcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6YC8ke2hhbmdvdXQuc3RhdGV9YCxyb3V0ZTonL2hhbmdvdXRzJ30pXG4gIH1cbiAgcmV0dXJuIChcbiBcbiAgICA8ZGl2IHN0eWxlPXt7ICBwYWRkaW5nVG9wOjY4fX0+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pbnB1dENvbnRhaW5lcn0+XG4gICAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxuICAgICAgICAgIGlkPVwic2VhcmNoLWlucHV0XCJcbiAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2h9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlLmlucHV0fVxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2gtYnRuXCJcbiAgICAgICAgICBkaXNhYmxlZD17IXNlYXJjaH1cbiAgICAgICAgICB0aXRsZT1cInNlYXJjaFwiXG4gICAgICAgICAgb25DbGljaz17b25TdGFydFNlYXJjaH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8TGlzdCBpZD1cImhhbmdvdXRzLWxpc3RcIj5cbiAgICAgICAge2hhbmdvdXRzICYmXG4gICAgICAgICAgaGFuZ291dHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPExpc3RJdGVtIGlkPXtnLnVzZXJuYW1lfSBvbkNsaWNrPXtoYW5kbGVIYW5nb3V0U2VsZWN0aW9ufT5cbiAgICAgICAgICAgICAgICB7Zy51c2VybmFtZX1cbiAgICAgICAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICA8L0xpc3Q+XG4gICBcbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuY29uc3Qgc3R5bGVzID0ge1xuICByb290OiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2VlZWVlZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIExheW91dCh7IGNoaWxkcmVuLCBzdHlsZSwgaWQgfSkge1xuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17aWR9IHN0eWxlPXt7IC4uLnN0eWxlcy5yb290LCAuLi5zdHlsZSB9fT57Y2hpbGRyZW59PC9kaXY+O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5cbmNvbnN0IHN0eWxlID0ge1xuICBjaGVja2JveDogeyBtYXJnaW5SaWdodDogOCB9LFxuICBjaGVja2JveFJvb3Q6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcGFkZGluZzogMTYsXG4gIH0sXG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIHBhZGRpbmdUb3A6NjhcbiAgfSxcbiAgYnRuOiB7XG4gICAgZmxleDogMSxcbiAgICBtYXJnaW5SaWdodDogNCxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgb25DYW5jZWwsIG9uQmxvY2ssIG9uUmVwb3J0IH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY2hlY2tib3hSb290fT5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHN0eWxlPXtzdHlsZS5jaGVja2JveH0gb25DaGFuZ2U9e29uUmVwb3J0fSAvPlxuICAgICAgICA8bGFiZWw+UmVwb3J0PC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDYW5jZWxcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNhbmNlbH0gLz5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gaWQ9XCJCTE9DS1wiIG9uQ2xpY2s9e29uQmxvY2t9IGRhdGEtdGVzdGlkPVwiYmxvY2stYnRuXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9jayh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBvbkNsaWNrLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgaGVpZ2h0PXtoZWlnaHR9XHJcbiAgICAgIHZpZXdCb3g9JzAgMCAyNCAyNCdcclxuICAgICAgd2lkdGg9e3dpZHRofVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBpZD17aWR9XHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6TTQgMTJjMC00LjQyIDMuNTgtOCA4LTggMS44NSAwIDMuNTUuNjMgNC45IDEuNjlMNS42OSAxNi45QzQuNjMgMTUuNTUgNCAxMy44NSA0IDEyem04IDhjLTEuODUgMC0zLjU1LS42My00LjktMS42OUwxOC4zMSA3LjFDMTkuMzcgOC40NSAyMCAxMC4xNSAyMCAxMmMwIDQuNDItMy41OCA4LTggOHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIENlbnRlcih7IGNoaWxkcmVuLCBzdHlsZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIC4uLnN0eWxlLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0Jsb2NrJztcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL0xheW91dCc7XG5cbmNvbnN0IHN0eWxlID0ge1xuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBwYWRkaW5nVG9wOjY4XG4gIH0sXG4gIGJ0bjoge1xuICAgIGZsZXg6IDEsXG4gICAgbWFyZ2luUmlnaHQ6IDQsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9ja2VkKHsgaGFuZ291dCwgb25VbmJsb2NrLCBvbkNsb3NlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiYmxvY2tlZC11aVwiPlxuICAgICAgPENlbnRlciBzdHlsZT17eyBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgIDxCbG9jayB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cInJlZFwiIC8+XG4gICAgICAgIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQudXNlcm5hbWV9PC9iPiBpcyBibG9ja2VkXG4gICAgICA8L0NlbnRlcj5cblxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDbG9zZVwiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xvc2V9IC8+XG4gICAgICAgIDxCdXR0b24gaWQ9J1VOQkxPQ0snIHRpdGxlPVwiVW5ibG9ja1wiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uVW5ibG9ja30gZGF0YS10ZXN0aWQ9J3VuYmxvY2stYnRuJy8+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gRGVsZXRlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXJjaGl2ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17MjR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMjAuNTQgNS4yM2wtMS4zOS0xLjY4QzE4Ljg4IDMuMjEgMTguNDcgMyAxOCAzSDZjLS40NyAwLS44OC4yMS0xLjE2LjU1TDMuNDYgNS4yM0MzLjE3IDUuNTcgMyA2LjAyIDMgNi41VjE5YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNi41YzAtLjQ4LS4xNy0uOTMtLjQ2LTEuMjd6TTEyIDE3LjVMNi41IDEySDEwdi0yaDR2MmgzLjVMMTIgMTcuNXpNNS4xMiA1bC44MS0xaDEybC45NCAxSDUuMTJ6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XG5pbXBvcnQgeyBEZWxldGUgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvRGVsZXRlJztcbmltcG9ydCB7IEFyY2hpdmUgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvQXJjaGl2ZSc7XG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9CbG9jayc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlID0ge1xuICBpY29uQnRuOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbjogOCB9LFxuICBidG46IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgYnRuQ29udGFpbmVyOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICB9LFxuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgfSxcbiAgYnRuT2s6IHtcbiAgICBtYXJnaW46IDgsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlndXJlKHtcbiAgb25CbG9jayxcbiAgb25EZWxldGUsXG4gIG9uQXJjaGl2ZSxcbiAgb25Ob3RpZmljYXRpb24sXG4gIG9uQ29udmVyc2F0aW9uSGlzdG9yeSxcbiAgb25OYXZpZ2F0aW9uLFxuICBvbk9rLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XG4gICAgICA8ZGl2PlxuICAgICAgICA8Q2hlY2tib3ggbGFiZWw9XCJOb3RpZmljYXRpb25zXCIgb25DaGFuZ2U9e29uTm90aWZpY2F0aW9ufSAvPlxuICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcbiAgICAgICAgICBvbkNoYW5nZT17b25Db252ZXJzYXRpb25IaXN0b3J5fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8aHIgLz5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bkNvbnRhaW5lcn0+XG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJEZWxldGVcIiBJY29uPXtEZWxldGV9IG9uQ2xpY2s9e29uRGVsZXRlfSAvPlxuICAgICAgICA8SWNvbkJ1dHRvbiBpZD1cImJja3VpXCIgdGl0bGU9XCJCbG9ja1wiIEljb249e0Jsb2NrfSBvbkNsaWNrPXtvbk5hdmlnYXRpb259ICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Pa30+XG4gICAgICAgIDxCdXR0b24gb25DbGljaz17b25Pa30+T0s8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuXG5mdW5jdGlvbiBJY29uQnV0dG9uKHsgSWNvbiwgdGl0bGUsIG9uQ2xpY2ssaWQgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLmljb25CdG59PlxuICAgICAgPGJ1dHRvbiBpZD17aWR9IHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xpY2t9IGRhdGEtdGVzdGlkPXtgJHtpZH0tYnRuYH0+XG4gICAgICAgIDxJY29uIGlkPXtpZH0vPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8ZGl2Pnt0aXRsZX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gQ2hlY2tib3goeyBsYWJlbCwgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiA4LCBtYXJnaW5Ub3A6IDggfX0+XG4gICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgICAgPGxhYmVsPntsYWJlbH08L2xhYmVsPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnd2hpdGUnLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgUGVyc29uQWRkIGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9QZXJzb25BZGQnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmNvbnN0IHN0eWxlID0ge1xuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlKHsgaGFuZ291dCwgb25JbnZpdGUsIG9uTWVzc2FnZVRleHQsbWVzc2FnZVRleHQsIHZhbHVlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9aWQ9XCJpbnZpdGUtdWlcIj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxQZXJzb25BZGQgY29sb3I9XCJncmVlblwiIC8+XG4gICAgICA8L0NlbnRlcj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIFN0YXJ0IENvbnZlcnNhdGlvbiB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8VGV4dElucHV0IGlkPVwibWVzc2FnZVRleHRJbnB1dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSB2YWx1ZT17bWVzc2FnZVRleHR9IC8+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiU2VuZCBJbnZpdGVcIiBpZD1cIklOVklURVwiIG9uQ2xpY2s9e29uSW52aXRlfSBkYXRhLXRlc3RpZD0nb25pbnZpdGUtYnRuJyAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBEb25lKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J005IDE2LjJMNC44IDEybC0xLjQgMS40TDkgMTkgMjEgN2wtMS40LTEuNEw5IDE2LjJ6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IERvbmUgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvRG9uZSc7XG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICcuLi8uLi9sYXlvdXQvQ2VudGVyJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XG5cbmNvbnN0IHN0eWxlID0ge1xuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZWUoeyBoYW5nb3V0IH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiaW52aXRlZS11aVwiPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgPERvbmUgd2lkdGg9XCI3MFwiIGhlaWdodD1cIjcwXCIgY29sb3I9XCJncmVlblwiIC8+XG4gICAgICA8L0NlbnRlcj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxwPlxuICAgICAgICAgIFlvdSB3aWxsIGJlIGFibGUgdG8gY2hhdCB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPiBvbmNlXG4gICAgICAgICAgeW91ciBpbnZpdGlvbiBoYXMgYmVlbiBhY2NlcHRlZC5cbiAgICAgICAgPC9wPlxuICAgICAgPC9DZW50ZXI+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBib3JkZXJDb2xvcjogJyNlZWVlZWUnLFxuICAgIGJvcmRlclN0eWxlOiAnc29saWQnLFxuICAgIGJvcmRlcldpZHRoOiAxLFxuICAgIGJvcmRlclJhZGl1czogNSxcbiAgICBwYWRkaW5nOiAzLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIG1pbkhlaWdodDogMzUsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICB9LFxuICB1c2VybmFtZTogeyBtYXJnaW5SaWdodDogOCB9LFxuICBsb2c6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgY29sb3I6ICcjNzM3MzczJyxcbiAgICBmb250U2l6ZTogMTAsXG4gIH0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZShwcm9wcykge1xuICBjb25zdCB7IG1lc3NhZ2UgfSA9IHByb3BzO1xuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSB9ID0gbWVzc2FnZTtcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtob3Vycywgc2V0SG91cnNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFttaW51dGVzLCBzZXRNaW51dGVzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcblxuICBmdW5jdGlvbiBjb252ZXJ0TVMobXMpIHtcbiAgICB2YXIgZCwgaCwgbSwgcztcbiAgICBzID0gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xuICAgIG0gPSBNYXRoLmZsb29yKHMgLyA2MCk7XG4gICAgcyA9IHMgJSA2MDtcbiAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xuICAgIG0gPSBtICUgNjA7XG4gICAgZCA9IE1hdGguZmxvb3IoaCAvIDI0KTtcbiAgICBoID0gaCAlIDI0O1xuICAgIHNldERheXMoZCk7XG4gICAgc2V0SG91cnMoaCk7XG4gICAgc2V0TWludXRlcyhtKTtcbiAgICBzZXRTZWNvbmRzKHMpO1xuICB9XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIG1lc3NhZ2UudGltZXN0YW1wKTtcbiAgICB9LCAwKTtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIG1lc3NhZ2UudGltZXN0YW1wKTtcbiAgICB9LCA2MDAwMCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJyxtYXJnaW5Cb3R0b206MyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGUucm9vdCwgZmxvYXQgfX0+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtZXNzYWdlXCIgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9PnttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH08L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUubG9nfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS51c2VybmFtZX0+e3VzZXJuYW1lICYmIHVzZXJuYW1lfTo8L2Rpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XG4gICAgICAgICAgICB7aG91cnMgPT09IDAgJiYgbWludXRlcyA+IDAgJiYgPGRpdj57bWludXRlc30gbWludXRlcyBhZ28gPC9kaXY+fVxuICAgICAgICAgICAge2hvdXJzID4gMCAmJiBkYXlzID09PSAwICYmIChcbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7aG91cnN9IGhvdXJzIHttaW51dGVzfSBtaW51dGVzIGFnb3snICd9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtkYXlzIDw9IDEwICYmIGRheXMgPiAxICYmIDxkaXY+e2RheXN9IGRheXMgYWdvPC9kaXY+fVxuICAgICAgICAgICAge2RheXMgPiAxMCAmJiBuZXcgRGF0ZShtZXNzYWdlLnRpbWVzdGFtcCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi9tZXNzYWdlLXVpL01lc3NhZ2UnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmNvbnN0IHN0eWxlID0ge1xuICByb290OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgcGFkZGluZ1RvcDogNzAsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBwYWRkaW5nQm90dG9tOjgsXG4gXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSB9KSB7XG5cbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IGlkPVwiaW52aXRlci11aVwiPlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUucm9vdH0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luTGVmdDogOCwgZGlzcGxheTonZmxleCcgfX0+XG4gICAgICAgICAge2hhbmdvdXQgJiYgaGFuZ291dC5tZXNzYWdlICYmIChcbiAgICAgICAgICAgIDxNZXNzYWdlXG4gICAgICAgICAgICAgIG1lc3NhZ2U9e1xuICAgICAgICAgICAgICAgIGhhbmdvdXQgJiZcbiAgICAgICAgICAgICAgICBoYW5nb3V0Lm1lc3NhZ2UgJiYge1xuICAgICAgICAgICAgICAgICAgLi4uaGFuZ291dC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsZmxvYXQ6J2xlZnQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLHBhZGRpbmdMZWZ0OjgscGFkZGluZ1JpZ2h0OjggfX0+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgaWQ9XCJERUNMSU5FXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVjbGluZS1idG5cIlxuICAgICAgICAgICAgdGl0bGU9XCJEZWNsaW5lXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblJpZ2h0OiA0LCBjb2xvcjogJ3JlZCcgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGlkPVwiQUNDRVBUXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NlcHQtYnRuXCJcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpbkxlZnQ6IDQsIGNvbG9yOiAnZ3JlZW4nIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICAvL21hcmdpbjowXG4gICAgcGFkZGluZzogNSxcbiAgICBtYXJnaW5MZWZ0OiA4LFxuICAgIG1hcmdpblJpZ2h0OiA4LFxuICAgIG1hcmdpblRvcDogOCxcbiAgICBtYXJnaW5Cb3R0b206IDgsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgZmxleDogMSxcbiAgICBcbiAgfSxcbiAgYnRuOntcbiAgICBwYWRkaW5nOiA4LFxuXG4gICAgbWFyZ2luUmlnaHQ6IDE2LFxuICAgIG1hcmdpblRvcDogOCxcbiAgICBtYXJnaW5Cb3R0b206IDgsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgZmxleDogMSxcbiAgfVxufTtcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlRWRpdG9yKHsgbWVzc2FnZVRleHQsIG9uTWVzc2FnZVRleHQsIG9uTWVzc2FnZSxoYW5nb3V0IH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XG4gICAgIFxuICAgICAgPGlucHV0IHN0eWxlPXtzdHlsZXMuaW5wdXR9IGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHR5cGU9XCJ0ZXh0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9ICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtaW5wdXRcIiB2YWx1ZT17bWVzc2FnZVRleHR9Lz5cbiAgICAgIFxuICAgICAgPGRpdj5cbiAgICAgICAgPEJ1dHRvbiBkaXNhYmxlZD17aGFuZ291dCAmJmhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCd9ICBzdHlsZT17c3R5bGVzLmJ0bn0gIHRpdGxlPVwic2VuZFwiIGlkPSdNRVNTQUdFJyBvbkNsaWNrPXtvbk1lc3NhZ2V9IGRhdGEtdGVzdGlkPSdzZW5kLWJ0bicvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xuY29uc3Qgc3R5bGUgPSB7XG4gICAgY29sb3I6ICdyZWQnLFxuICAgIGZsb2F0OiAncmlnaHQnLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgZm9udFNpemU6IDE2LFxuICAgIHRleHRBbGlnbjogJ2VuZCdcbn1cbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VyTWVzc2FnZSh7IG1lc3NhZ2UgfSkge1xuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VyLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fTwvZGl2PlxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXG5jb25zdCBzdHlsZSA9IHtcbiAgICBjb2xvcjogJ3JlZCcsXG4gICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBmb250U2l6ZTogMTYsXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xufVxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZWRNZXNzYWdlKHsgbWVzc2FnZSxvbk5hdmlnYXRpb24gfSkge1xuICAgIGZ1bmN0aW9uIGhhbmRsZU5hdmlnYXRpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBvbk5hdmlnYXRpb24oZSlcbiAgICB9XG4gICAgZGVidWdnZXI7XG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZWQtbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9XG4gICAgPGEgaWQ9XCJVTkJMT0NLXCIgZGF0YS10ZXN0aWQ9XCJzZWVtb3JlLWJ0blwiIGhyZWY9XCIvXCIgb25DbGljaz17aGFuZGxlTmF2aWdhdGlvbn0+c2VlIG1vcmU8L2E+XG4gICAgPC9kaXY+XG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9NZXNzYWdlJztcbmltcG9ydCB7IE1lc3NhZ2VFZGl0b3IgfSBmcm9tICcuL01lc3NhZ2VFZGl0b3InO1xuaW1wb3J0IHsgQmxvY2tlck1lc3NhZ2UgfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlJ1xuaW1wb3J0IHtCbG9ja2VkTWVzc2FnZX0gZnJvbSAnLi9CbG9ja2VkTWVzc2FnZSdcbmNvbnN0IHN0eWxlcyA9IHtcbiAgbWVzc2FnZUNvbnRhaW5lcjoge1xuICAgIC8vIHdpZHRoOiAnMTAwJScsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgcGFkZGluZzogMyxcbiAgLy8gIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXG4gICAgZmxleDogMTUsXG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgb3ZlcmZsb3dYOiBcImhpZGRlblwiXG5cbiAgfSxcbn07XG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZXMoe1xuICBtZXNzYWdlcyxcbiAgb25NZXNzYWdlLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBtZXNzYWdlVGV4dCxcbiAgdXNlcm5hbWUsXG4gIGhhbmdvdXQsXG4gIG9uTmF2aWdhdGlvblxufSkge1xuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChtZXNzYWdlcykge1xuICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcbiAgICB9XG4gIH0sIFttZXNzYWdlc10pO1xuXG4gIGZ1bmN0aW9uIG9uU2VuZChlKSB7XG4gICAgb25NZXNzYWdlKGUpO1xuICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGJveFNpemluZzogJ2JvcmRlci1ib3gnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgcGFkZGluZ1RvcDogNjggfX0+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMubWVzc2FnZUNvbnRhaW5lcn0gcmVmPXtzY3JvbGxlclJlZn0+XG4gICAgICAgIHttZXNzYWdlcyAmJlxuICAgICAgICAgIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXM6IHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pLCB1c2VybmFtZSB9KS5tYXAoXG4gICAgICAgICAgICAobSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cbiAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgIHshbS50eXBlICYmIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSAnYmxvY2tlcicgJiYgPEJsb2NrZXJNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSAnYmxvY2tlZCcgJiYgPEJsb2NrZWRNZXNzYWdlIG1lc3NhZ2U9e219IG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufS8+fVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEgfX0+XG4gICAgICAgIDxNZXNzYWdlRWRpdG9yXG4gICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cbiAgICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cbiAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XG4gICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG4gICk7XG59XG5mdW5jdGlvbiBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcbiAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgdXNlcm5hbWUpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcbiAgICAgIGlmIChtc2cudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdyaWdodCcsIHVzZXJuYW1lOiAnbWUnIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAnbGVmdCcgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vbWVzc2FnZS11aS9NZXNzYWdlcyc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL0xheW91dCc7XG5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XG4gIG1lc3NhZ2VzID0gW10sXG4gIG9uTWVzc2FnZVRleHQsXG4gIG9uTWVzc2FnZSxcbiAgbWVzc2FnZVRleHQsXG4gIHVzZXJuYW1lLFxuICBoYW5nb3V0LFxuICBvbk5hdmlnYXRpb25cbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IGlkPVwiaGFuZ2NoYXQtdWlcIiA+XG4gICAgICA8TWVzc2FnZXNcbiAgICAgIG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufVxuICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICBtZXNzYWdlVGV4dCA9e21lc3NhZ2VUZXh0fVxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XG4gICAgICAvPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgd2lkdGg6IDE1LFxuICBoZWlnaHQ6IDE1LFxuXG4gIGJvcmRlcjogJ3doaXRlIDJweCBzb2xpZCcsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xuICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xuICAgIHJldHVybiA8Q29ubmVjdGluZyAvPjtcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xuICB9XG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcblxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXG5leHBvcnQgZnVuY3Rpb24gRHJhd2VyQ29udGVudCh7IG9wZW4gfSkge1xuICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6Jy8nLHJvdXRlOmAvJHtpZH1gfSlcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8TGlzdD5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaGFuZ291dHNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgSGFuZ291dHNcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgQmxvY2tcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tlZFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBCbG9ja2VkXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBJbnZpdGVcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBJbnZpdGVlXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZXJcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgSW52aXRlclxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nY2hhdFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBIYW5nY2hhdFxuICAgICAgICA8L0xpc3RJdGVtPlxuXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImNvbmZpZ3VyZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBDb25maWd1cmVcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwibWVzc2FnZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBNZXNzYWdlXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cIm1lc3NhZ2VzXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIE1lc3NhZ2VzXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cIm9ubGluZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgIG9ubGluZVN0YXR1c1xuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJ1bnJlYWRcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICBVcmVhZFxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja2VyLW1lc3NhZ2VcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICBCbG9ja2VyTWVzc2FnZVxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiZXhwb3J0IGNvbnN0IG1lc3NhZ2VzID1bXG4gICAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMTc4OTk3MSxcbiAgfSxcbiAgIHtcbiAgICB1c2VybmFtZTonZGVtbycsXG4gICAgdGV4dDogYE9rIExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMjE2MzQ2MixcbiAgfSx7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgSG93IGFyZSB5b3UgZGVtb2AsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjM1NzIzLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgQXJlIHlvdSBhbGwgcmlnaHRgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzY3NzU3MyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgWWVzIEkgYW0uIEhvdyBhcmUgeW91YCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDYsXG4gIH0sXG4gICxcbiAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDgsXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuXSIsImV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyVW5yZWFkaGFuZ291dHMoe3VucmVhZGhhbmdvdXRzfSl7XG4gICAgcmV0dXJuICAgdW5yZWFkaGFuZ291dHMucmVkdWNlKChhY2N1bXVsYXRvciwgY3VycmVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIChhY2N1bXVsYXRvciA9IFt7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0gYWNjdW11bGF0b3IuZmluZChcbiAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lICYmIGN1cnJlbnQuc3RhdGUgPT09ICdNRVNTQU5HRVInXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGFjY3VtdWxhdG9yLmZpbmRJbmRleChcbiAgICAgICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxuICAgICAgICAgICAgYWNjdW11bGF0b3Iuc3BsaWNlKGluZGV4LCAxLCB7XG4gICAgICAgICAgICAgIC4uLm9iaixcbiAgICAgICAgICAgICAgbWVzc2FnZUNvdW50OiArK29iai5tZXNzYWdlQ291bnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnB1c2goeyAuLi5jdXJyZW50LCBtZXNzYWdlQ291bnQ6IDEgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgIH0sIFtdKTtcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XG5pbXBvcnQge3JlZHVjZXJVbnJlYWRoYW5nb3V0c30gZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMnXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVbnJlYWRIYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzLG9uU2VsZWN0VW5yZWFkIH0pIHtcbiAgY29uc3QgW2l0ZW1zLHNldEl0ZW1zXSA9dXNlU3RhdGUoW10pXG51c2VFZmZlY3QoKCk9PntcbmlmKHVucmVhZGhhbmdvdXRzKXtcbiAgY29uc3QgcmVkdWNlZCA9cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pXG4gIHNldEl0ZW1zKHJlZHVjZWQpXG59XG5cbn0sW3VucmVhZGhhbmdvdXRzXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9J3VucmVhZGhhbmdvdXRzJz5cbiAgICAgIDxMaXN0PlxuICAgICAgICB7aXRlbXMgJiZcbiAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgaXRlbXMubWFwKCh1KSA9PiB7XG4gICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICByZXR1cm4gPExpc3RJdGVtIG9uQ2xpY2s9e29uU2VsZWN0VW5yZWFkfSBpZD17dS51c2VybmFtZX0+e3UudXNlcm5hbWV9IDxkaXYgc3R5bGU9e3tjb2xvcjonIzczNzM3Myd9fT5tZXNzYWdlczoge3UubWVzc2FnZUNvdW50fTwvZGl2PjwvTGlzdEl0ZW0+O1xuICAgICAgICAgIH0pfVxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgVW5yZWFkIGZyb20gJy4uL2hhbmdvdXRzL1VucmVhZEhhbmdvdXRzJztcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcbmNvbnN0IHVucmVhZHMgPSBbXG4gIHtcbiAgICB1c2VybmFtZTogJ2RlbW8nLFxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcbiAgfSxcblxuICB7XG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcbiAgICBzdGF0ZTogJ01FU1NBTkdFUicsXG4gICAgbWVzc2FnZTogeyB0ZXh0OiAnSGVsbG8geW91JywgdGltZXN0YW1wOiAxNTkxODEwNDU4NjMwIH0sXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTogJ2Jlcm8nLFxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcbiAgfSxcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBVbnJlYWREZW1vKCkge1xuICByZXR1cm4gPFVucmVhZCB1bnJlYWRoYW5nb3V0cz17cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0czp1bnJlYWRzfSl9IC8+O1xufVxuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXG5pbXBvcnQge0Jsb2NrZXJNZXNzYWdlfSBmcm9tICcuLi9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZXJNZXNzYWdlJ1xuXG5jb25zdCBtZXNzYWdlID17dGV4dDonWW91IGNhbiBub3Qgc2VuZCBtZXNzYWdlIGJlY2F1c2UgeW91IGFyZSBibG9ja2VkJyxcbnRpbWVzdGFtcDoxMjMyMyxcbnVzZXJuYW1lOidkZW1vJ1xufVxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlRGVtbygpe1xuICAgIHJldHVybiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0vPlxufSIsImltcG9ydCB7IGgsIHJlbmRlciB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBBcHBSb3V0ZVByb3ZpZGVyLCBBcHBSb3V0ZSB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vTmF2aWdhdGlvbic7XG5pbXBvcnQgSGFuZ291dCBmcm9tICcuLi9oYW5nb3V0cy9IYW5nb3V0JztcbmltcG9ydCBCbG9jayBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jayc7XG5pbXBvcnQgQmxvY2tlZCBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9ja2VkJztcbmltcG9ydCBDb25maWd1cmUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvQ29uZmlndXJlJztcbmltcG9ydCBJbnZpdGUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlJztcbmltcG9ydCBJbnZpdGVlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUnO1xuaW1wb3J0IEludml0ZXIgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlcic7XG5pbXBvcnQgSGFuZ2NoYXQgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZSc7XG5pbXBvcnQgeyBNZXNzYWdlcyB9IGZyb20gJy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZXMnO1xuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZUVkaXRvcic7XG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi9sYXlvdXQvaWNvbnMvb25saW5lU3RhdHVzJztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4vRHJhd2VyQ29udGVudCc7XG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcbmltcG9ydCB7VW5yZWFkRGVtb30gZnJvbSAnLi9VcmVhZERlbW8nXG5pbXBvcnQge0Jsb2NrZXJNZXNzYWdlRGVtbyB9IGZyb20gJy4vQmxvY2tlck1lc3NhZ2VEZW1vJ1xuY29uc3QgaGFuZ291dHMgPSBbXG4gIHsgdXNlcm5hbWU6ICd1c2Vyb25lJyB9LFxuICB7IHVzZXJuYW1lOiAndXNlcnR3bycgfSxcbiAgeyB1c2VybmFtZTogJ3VzZXJ0aHJlZScgfSxcbl07XG5jb25zdCBoYW5nb3V0ID0ge1xuICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcbiAgZW1haWw6ICd0ZXN0QGdtYWlsLmNvbScsXG4gIG1lc3NhZ2U6IHsgdGV4dDogYExldCdzIGNoYXQgb24gSGFuZ291dCFgLCB0aW1lc3RhbXA6IDE1OTA4MjA3ODI5MjEgfSxcbn07XG5jb25zdCBtZXNzYWdlID0ge1xuICB1c2VybmFtZTogJ2JyZW5vJyxcbiAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuICB0aW1lc3RhbXA6IDE1OTEzMzE3Njc4MzYsXG59O1xuLy9cbnJlbmRlcihcbiAgPFRoZW1lUHJvdmlkZXJcbiAgICBpbml0U3RhdGU9e3tcbiAgICAgIHByaW1hcnk6IHtcbiAgICAgICAgYmFja2dyb3VuZDogJyM2MjAwRUUnLFxuICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBIZWx2ZXRpY2EsIFwiQXJpYWxcIicsXG4gICAgICB9LFxuICAgIH19XG4gID5cbiAgICA8QXBwUm91dGVQcm92aWRlciBpbml0U3RhdGU9e3sgZmVhdHVyZVJvdXRlOiAnLycsIHJvdXRlOiAnL2Jsb2NrZXItbWVzc2FnZScgfX0+XG4gICAgICA8TmF2aWdhdGlvbiBkcmF3ZXJDb250ZW50PXs8RHJhd2VyQ29udGVudCAvPn0+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XG4gICAgICAgICAgPEhhbmdvdXQgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja1wiPlxuICAgICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja2VkXCI+XG4gICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pbnZpdGVcIj5cbiAgICAgICAgICA8SW52aXRlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZWVcIj5cbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pbnZpdGVyXCI+XG4gICAgICAgICAgPEludml0ZXIgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ2NoYXRcIj5cbiAgICAgICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlXCI+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAyMCwgYmFja2dyb3VuZENvbG9yOiAnI2VlZWVlZWUnIH19PlxuICAgICAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0gdXNlcm5hbWU9e2hhbmdvdXQudXNlcm5hbWV9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL29ubGluZVwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8T25saW5lU3RhdHVzIG9ubGluZSAvPlxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlc1wiPlxuICAgICAgICAgIDxIYW5nY2hhdCBoYW5nb3V0PXtoYW5nb3V0fSBtZXNzYWdlcz17bWVzc2FnZXN9IHVzZXJuYW1lPVwiZGVtb1wiIC8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL3VucmVhZFwiPlxuICAgICAgICAgIDxVbnJlYWREZW1vLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tlci1tZXNzYWdlXCI+XG4gICAgICAgICAgPEJsb2NrZXJNZXNzYWdlRGVtby8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICA8L05hdmlnYXRpb24+XG4gICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxuICA8L1RoZW1lUHJvdmlkZXI+LFxuICBkb2N1bWVudC5ib2R5XG4pO1xuIl0sIm5hbWVzIjpbInQiLCJ1IiwiciIsImkiLCJvIiwiYyIsImYiLCJlIiwiYSIsInYiLCJtIiwiRSIsImQiLCJoIiwidyIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwidXNlQXBwUm91dGUiLCJkaXNwYXRjaCIsIm9uQXBwUm91dGUiLCJBcHBSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJmaW5kIiwicCIsIkFwcFJvdXRlUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJ1c2VSZWR1Y2VyIiwidmFsdWUiLCJ1c2VNZW1vIiwiTmF2aWdhdGlvbiIsImRyYXdlckNvbnRlbnQiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJwYWRkaW5nIiwiZmxleCIsIkxpc3QiLCJpZCIsImJveFNpemluZyIsImJhY2tncm91bmRDb2xvciIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwid2lkdGgiLCJMaXN0SXRlbSIsIm9uQ2xpY2siLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsInN0eWxlcyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIlRleHRJbnB1dCIsInN0eWxlIiwiQnV0dG9uIiwidGl0bGUiLCJpbnB1dENvbnRhaW5lciIsImJvcmRlciIsImlucHV0IiwiSGFuZ291dCIsImhhbmdvdXRzIiwib25TZWFyY2giLCJvblNlbGVjdEhhbmdvdXQiLCJzZWFyY2giLCJ1c2VybmFtZSIsIm9uU3RhcnRTZWFyY2giLCJoYW5kbGVIYW5nb3V0U2VsZWN0aW9uIiwidGFyZ2V0IiwiaGFuZ291dCIsImxlbmd0aCIsIm1hcCIsInJvb3QiLCJoZWlnaHQiLCJMYXlvdXQiLCJjaGVja2JveCIsImNoZWNrYm94Um9vdCIsImFsaWduSXRlbXMiLCJsYXlvdXQiLCJmbGV4RGlyZWN0aW9uIiwiYnRuIiwiQmxvY2siLCJvbkNhbmNlbCIsIm9uQmxvY2siLCJvblJlcG9ydCIsImZpbGwiLCJjb2xvciIsIkNlbnRlciIsInRleHRBbGlnbiIsIkJsb2NrZWQiLCJvblVuYmxvY2siLCJvbkNsb3NlIiwiRGVsZXRlIiwiQXJjaGl2ZSIsImljb25CdG4iLCJtYXJnaW4iLCJidG5Db250YWluZXIiLCJidG5PayIsIkNvbmZpZ3VyZSIsIm9uRGVsZXRlIiwib25BcmNoaXZlIiwib25Ob3RpZmljYXRpb24iLCJvbkNvbnZlcnNhdGlvbkhpc3RvcnkiLCJvbk5hdmlnYXRpb24iLCJvbk9rIiwiSWNvbkJ1dHRvbiIsIkljb24iLCJDaGVja2JveCIsImxhYmVsIiwib25DaGFuZ2UiLCJQZXJzb25BZGRJY29uIiwiSW52aXRlIiwib25JbnZpdGUiLCJvbk1lc3NhZ2VUZXh0IiwibWVzc2FnZVRleHQiLCJQZXJzb25BZGQiLCJlbWFpbCIsIkRvbmUiLCJJbnZpdGVlIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwiYm9yZGVyUmFkaXVzIiwibWluSGVpZ2h0IiwibG9nIiwiZm9udFNpemUiLCJNZXNzYWdlIiwibWVzc2FnZSIsImZsb2F0IiwiZGF5cyIsInNldERheXMiLCJ1c2VTdGF0ZSIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJzIiwiTWF0aCIsImZsb29yIiwidXNlRWZmZWN0Iiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJ0aW1lc3RhbXAiLCJzZXRJbnRlcnZhbCIsInRleHQiLCJJbnZpdGVyIiwib25BY2NlcHQiLCJvbkRlY2xpbmUiLCJNZXNzYWdlRWRpdG9yIiwib25NZXNzYWdlIiwiQmxvY2tlck1lc3NhZ2UiLCJCbG9ja2VkTWVzc2FnZSIsImhhbmRsZU5hdmlnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm1lc3NhZ2VDb250YWluZXIiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJNZXNzYWdlcyIsIm1lc3NhZ2VzIiwic2Nyb2xsZXJSZWYiLCJ1c2VSZWYiLCJjdXJyZW50Iiwic2Nyb2xsVG9wIiwic2Nyb2xsSGVpZ2h0Iiwib25TZW5kIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1zZyIsInNvcnQiLCJIYW5nY2hhdCIsIk9ubGluZVN0YXR1cyIsInJlYWR5U3RhdGUiLCJJc09ubGluZSIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwiVGhlbWVDb250ZXh0IiwiVGhlbWVQcm92aWRlciIsInNldFN0YXRlIiwiRHJhd2VyQ29udGVudCIsIm9wZW4iLCJoYW5kbGVSb3V0ZSIsInJlZHVjZXJVbnJlYWRoYW5nb3V0cyIsInVucmVhZGhhbmdvdXRzIiwicmVkdWNlIiwiYWNjdW11bGF0b3IiLCJpbmRleCIsIm1lc3NhZ2VDb3VudCIsIm9iaiIsImZpbmRJbmRleCIsInNwbGljZSIsInB1c2giLCJVbnJlYWRIYW5nb3V0cyIsIm9uU2VsZWN0VW5yZWFkIiwiaXRlbXMiLCJzZXRJdGVtcyIsInJlZHVjZWQiLCJ1bnJlYWRzIiwiVW5yZWFkRGVtbyIsIlVucmVhZCIsIkJsb2NrZXJNZXNzYWdlRGVtbyIsInJlbmRlciIsInByaW1hcnkiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsImRvY3VtZW50IiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxvRUFBb0UsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBdUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXNPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1b1MsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNSLEdBQUMsQ0FBQyxDQUFDLENBQUNFLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1AsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQW1GLFNBQVNXLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPVCxHQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsVUFBVSxDQUFDLE9BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBMkcsU0FBU0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBc0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQTROLFNBQVNjLEdBQUMsRUFBRSxDQUFDWCxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNaLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDTixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUdGLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUVGLEdBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUVhLEdBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNULEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUNRLEdBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7O0FDQXp0RSxNQUFNQyxX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
