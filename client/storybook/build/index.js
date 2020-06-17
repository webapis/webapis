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
    style: style$b.count
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXIuanMiLCIuLi9OYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uL2xheW91dC9OYXZMaXN0LmpzIiwiLi4vLi4vbGF5b3V0L1RleHRJbnB1dC5qcyIsIi4uLy4uL2xheW91dC9CdXR0b24uanMiLCIuLi8uLi9oYW5nb3V0cy9IYW5nb3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvTGF5b3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2suanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvQmxvY2suanMiLCIuLi8uLi9sYXlvdXQvQ2VudGVyLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2tlZC5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9QZXJzb25BZGQuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2UuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVyLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9CbG9ja2VyTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvQmxvY2tlZE1lc3NhZ2UuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VzLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uL0RyYXdlckNvbnRlbnQuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvTWVzc2FnZS5qcyIsIi4uL0ljb25zRGVtby5qcyIsIi4uL2Zha2VNZXNzYWdlcy5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzLmpzIiwiLi4vLi4vaGFuZ291dHMvVW5yZWFkSGFuZ291dHMuanMiLCIuLi9VcmVhZERlbW8uanMiLCIuLi9CbG9ja2VyTWVzc2FnZURlbW8uanMiLCIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxhPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkfGl0ZXJhL2k7ZnVuY3Rpb24gcyhuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4geShuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24geShsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiBwKCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGsobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBrKG4pfX1mdW5jdGlvbiBnKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPXMoe30sbykpLl9fdj1pLHQ9eihmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZrKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixhLHMpe3ZhciBoLHAsbSxrLGcsXyxiLHgsQSxQPWkmJmkuX19rfHxjLEM9UC5sZW5ndGg7Zm9yKGE9PWUmJihhPW51bGwhPXI/clswXTpDP3coaSwwKTpudWxsKSx1Ll9faz1bXSxoPTA7aDxsLmxlbmd0aDtoKyspaWYobnVsbCE9KGs9dS5fX2tbaF09bnVsbD09KGs9bFtoXSl8fFwiYm9vbGVhblwiPT10eXBlb2Ygaz9udWxsOlwic3RyaW5nXCI9PXR5cGVvZiBrfHxcIm51bWJlclwiPT10eXBlb2Ygaz95KG51bGwsayxudWxsLG51bGwsayk6QXJyYXkuaXNBcnJheShrKT95KGQse2NoaWxkcmVuOmt9LG51bGwsbnVsbCxudWxsKTpudWxsIT1rLl9fZXx8bnVsbCE9ay5fX2M/eShrLnR5cGUsay5wcm9wcyxrLmtleSxudWxsLGsuX192KTprKSl7aWYoay5fXz11LGsuX19iPXUuX19iKzEsbnVsbD09PShtPVBbaF0pfHxtJiZrLmtleT09bS5rZXkmJmsudHlwZT09PW0udHlwZSlQW2hdPXZvaWQgMDtlbHNlIGZvcihwPTA7cDxDO3ArKyl7aWYoKG09UFtwXSkmJmsua2V5PT1tLmtleSYmay50eXBlPT09bS50eXBlKXtQW3BdPXZvaWQgMDticmVha31tPW51bGx9aWYoZz16KG4sayxtPW18fGUsdCxvLHIsZixhLHMpLChwPWsucmVmKSYmbS5yZWYhPXAmJih4fHwoeD1bXSksbS5yZWYmJngucHVzaChtLnJlZixudWxsLGspLHgucHVzaChwLGsuX19jfHxnLGspKSxudWxsIT1nKXtpZihudWxsPT1iJiYoYj1nKSxBPXZvaWQgMCx2b2lkIDAhPT1rLl9fZClBPWsuX19kLGsuX19kPXZvaWQgMDtlbHNlIGlmKHI9PW18fGchPWF8fG51bGw9PWcucGFyZW50Tm9kZSl7bjppZihudWxsPT1hfHxhLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoZyksQT1udWxsO2Vsc2V7Zm9yKF89YSxwPTA7KF89Xy5uZXh0U2libGluZykmJnA8QztwKz0yKWlmKF89PWcpYnJlYWsgbjtuLmluc2VydEJlZm9yZShnLGEpLEE9YX1cIm9wdGlvblwiPT11LnR5cGUmJihuLnZhbHVlPVwiXCIpfWE9dm9pZCAwIT09QT9BOmcubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgdS50eXBlJiYodS5fX2Q9YSl9ZWxzZSBhJiZtLl9fZT09YSYmYS5wYXJlbnROb2RlIT1uJiYoYT13KG0pKX1pZih1Ll9fZT1iLG51bGwhPXImJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUudHlwZSlmb3IoaD1yLmxlbmd0aDtoLS07KW51bGwhPXJbaF0mJnYocltoXSk7Zm9yKGg9QztoLS07KW51bGwhPVBbaF0mJkQoUFtoXSxQW2hdKTtpZih4KWZvcihoPTA7aDx4Lmxlbmd0aDtoKyspaih4W2hdLHhbKytoXSx4WysraF0pfWZ1bmN0aW9uIHgobil7cmV0dXJuIG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2Ygbj9bXTpBcnJheS5pc0FycmF5KG4pP2MuY29uY2F0LmFwcGx5KFtdLG4ubWFwKHgpKTpbbl19ZnVuY3Rpb24gQShuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8QyhuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fEMobixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBQKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09YS50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIEMobixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8UChvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxQKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCxOLHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCxOLHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiBOKGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiB6KGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgYSx2LGgseSxwLHcsayxnLF8seCxBLFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KGE9bi5fX2IpJiZhKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGc9dS5wcm9wcyxfPShhPVAuY29udGV4dFR5cGUpJiZ0W2EuX19jXSx4PWE/Xz9fLnByb3BzLnZhbHVlOmEuX186dCxpLl9fYz9rPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGcseCk6KHUuX19jPXY9bmV3IG0oZyx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1nLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPXMoe30sdi5fX3MpKSxzKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGcsdi5fX3MpKSkseT12LnByb3BzLHA9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmchPT15JiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhnLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoZyx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdil7Zm9yKHYucHJvcHM9Zyx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxhPTA7YTx1Ll9fay5sZW5ndGg7YSsrKXUuX19rW2FdJiYodS5fX2tbYV0uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShnLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUoeSxwLHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1nLHYuc3RhdGU9di5fX3MsKGE9bi5fX3IpJiZhKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxhPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1zKHMoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUoeSxwKSksQT1udWxsIT1hJiZhLnR5cGU9PWQmJm51bGw9PWEua2V5P2EucHJvcHMuY2hpbGRyZW46YSxiKGwsQXJyYXkuaXNBcnJheShBKT9BOltBXSx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxrJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhhPW4uZGlmZmVkKSYmYSh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBhLHMsdixoLHkscD11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3IoYT0wO2E8by5sZW5ndGg7YSsrKWlmKG51bGwhPShzPW9bYV0pJiYoKG51bGw9PT1sLnR5cGU/Mz09PXMubm9kZVR5cGU6cy5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1zKSl7bj1zLG9bYV09bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSlwIT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHA9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZihudWxsIT1vKWZvcihwPXt9LHk9MDt5PG4uYXR0cmlidXRlcy5sZW5ndGg7eSsrKXBbbi5hdHRyaWJ1dGVzW3ldLm5hbWVdPW4uYXR0cmlidXRlc1t5XS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfUEobixkLHAsdCxmKSxoP2wuX19rPVtdOihhPWwucHJvcHMuY2hpbGRyZW4sYihuLEFycmF5LmlzQXJyYXkoYSk/YTpbYV0sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZikpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT0oYT1kLnZhbHVlKSYmYSE9PW4udmFsdWUmJkMobixcInZhbHVlXCIsYSxwLnZhbHVlLCExKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PShhPWQuY2hlY2tlZCkmJmEhPT1uLmNoZWNrZWQmJkMobixcImNoZWNrZWRcIixhLHAuY2hlY2tlZCwhMSkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLHoodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOnUuY2hpbGROb2Rlcy5sZW5ndGg/Yy5zbGljZS5jYWxsKHUuY2hpbGROb2Rlcyk6bnVsbCxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7dmFyIHUsaTtmb3IoaSBpbiBsPXMocyh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHU9e30sbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJih1W2ldPWxbaV0pO3JldHVybiB5KG4udHlwZSx1LGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGcobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdS5Qcm92aWRlci5fXz11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGcodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPXMoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZzKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGcodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksZyh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQscCBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQsdSxyLGk9MCxvPVtdLGM9bi5fX3IsZj1uLmRpZmZlZCxlPW4uX19jLGE9bi51bm1vdW50O2Z1bmN0aW9uIHYodCxyKXtuLl9faCYmbi5fX2godSx0LGl8fHIpLGk9MDt2YXIgbz11Ll9fSHx8KHUuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49by5fXy5sZW5ndGgmJm8uX18ucHVzaCh7fSksby5fX1t0XX1mdW5jdGlvbiBtKG4pe3JldHVybiBpPTEscChFLG4pfWZ1bmN0aW9uIHAobixyLGkpe3ZhciBvPXYodCsrLDIpO3JldHVybiBvLnQ9bixvLl9fY3x8KG8uX19jPXUsby5fXz1baT9pKHIpOkUodm9pZCAwLHIpLGZ1bmN0aW9uKG4pe3ZhciB0PW8udChvLl9fWzBdLG4pO28uX19bMF0hPT10JiYoby5fX1swXT10LG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBsKHIsaSl7dmFyIG89dih0KyssMyk7IW4uX19zJiZ4KG8uX19ILGkpJiYoby5fXz1yLG8uX19IPWksdS5fX0guX19oLnB1c2gobykpfWZ1bmN0aW9uIHkocixpKXt2YXIgbz12KHQrKyw0KTshbi5fX3MmJngoby5fX0gsaSkmJihvLl9fPXIsby5fX0g9aSx1Ll9faC5wdXNoKG8pKX1mdW5jdGlvbiBkKG4pe3JldHVybiBpPTUsaChmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gcyhuLHQsdSl7aT02LHkoZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXU/dTp1LmNvbmNhdChuKSl9ZnVuY3Rpb24gaChuLHUpe3ZhciByPXYodCsrLDcpO3JldHVybiB4KHIuX19ILHUpPyhyLl9fSD11LHIuX19oPW4sci5fXz1uKCkpOnIuX199ZnVuY3Rpb24gVChuLHQpe3JldHVybiBpPTgsaChmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiB3KG4pe3ZhciByPXUuY29udGV4dFtuLl9fY10saT12KHQrKyw5KTtyZXR1cm4gaS5fX2M9bixyPyhudWxsPT1pLl9fJiYoaS5fXz0hMCxyLnN1Yih1KSksci5wcm9wcy52YWx1ZSk6bi5fX31mdW5jdGlvbiBBKHQsdSl7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUodT91KHQpOnQpfWZ1bmN0aW9uIEYobil7dmFyIHI9dih0KyssMTApLGk9bSgpO3JldHVybiByLl9fPW4sdS5jb21wb25lbnREaWRDYXRjaHx8KHUuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7ci5fXyYmci5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBfKCl7by5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2guZm9yRWFjaChxKSx0Ll9fSC5fX2g9W119Y2F0Y2godSl7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZSh1LHQuX192KSwhMH19KSxvPVtdfWZ1bmN0aW9uIGcobil7XCJmdW5jdGlvblwiPT10eXBlb2Ygbi51JiZuLnUoKX1mdW5jdGlvbiBxKG4pe24udT1uLl9fKCl9ZnVuY3Rpb24geChuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCx1KXtyZXR1cm4gdCE9PW5bdV19KX1mdW5jdGlvbiBFKG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7YyYmYyhuKSx0PTA7dmFyIHI9KHU9bi5fX2MpLl9fSDtyJiYoci5fX2guZm9yRWFjaChnKSxyLl9faC5mb3JFYWNoKHEpLHIuX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgdT10Ll9fYzt1JiZ1Ll9fSCYmdS5fX0guX19oLmxlbmd0aCYmKDEhPT1vLnB1c2godSkmJnI9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KChyPW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQsdT1mdW5jdGlvbigpe2NsZWFyVGltZW91dChyKSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSxyPXNldFRpbWVvdXQodSwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZSh1KSl9KShfKSl9LG4uX19jPWZ1bmN0aW9uKHQsdSl7dS5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKGcpLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8cShuKX0pfWNhdGNoKHIpe3Uuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHU9W10sbi5fX2Uocix0Ll9fdil9fSksZSYmZSh0LHUpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7YSYmYSh0KTt2YXIgdT10Ll9fYztpZih1JiZ1Ll9fSCl0cnl7dS5fX0guX18uZm9yRWFjaChnKX1jYXRjaCh0KXtuLl9fZSh0LHUuX192KX19O2V4cG9ydHttIGFzIHVzZVN0YXRlLHAgYXMgdXNlUmVkdWNlcixsIGFzIHVzZUVmZmVjdCx5IGFzIHVzZUxheW91dEVmZmVjdCxkIGFzIHVzZVJlZixzIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUsaCBhcyB1c2VNZW1vLFQgYXMgdXNlQ2FsbGJhY2ssdyBhcyB1c2VDb250ZXh0LEEgYXMgdXNlRGVidWdWYWx1ZSxGIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID17XG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZpZ2F0aW9uKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGRyYXdlckNvbnRlbnQgfSA9IHByb3BzO1xuXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGgxIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBwYWRkaW5nOiA1IH19PlxuICAgICAgICBTdG9yeWJvb2tcbiAgICAgIDwvaDE+XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxIH19PntkcmF3ZXJDb250ZW50fTwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEwIH19PntjaGlsZHJlbn08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTmF2SXRlbShwcm9wcykge1xuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibmF2LWl0ZW1cIj57Y2hpbGRyZW59PC9kaXY+O1xufVxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBMaXN0KHsgY2hpbGRyZW4sIGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxyXG5cclxuICAgICAgICBwYWRkaW5nVG9wOiA4LFxyXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpc3RJdGVtKHsgY2hpbGRyZW4sIG9uQ2xpY2ssIGlkIH0pIHtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgaWQ9e2lkfVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGNsYXNzTmFtZT0nZHJhd2VyLWxpc3QtaXRlbSdcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgICAgICBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiAxNixcclxuICAgICAgICBwYWRkaW5nVG9wOiA4LFxyXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHBhZGRpbmc6IDgsXHJcbiAgbWFyZ2luTGVmdDogMTYsXHJcbiAgbWFyZ2luUmlnaHQ6IDE2LFxyXG4gIG1hcmdpblRvcDogOCxcclxuICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgZmxleDogMSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBUZXh0SW5wdXQocHJvcHMpIHtcclxuICBjb25zdCB7IGlkLCB0eXBlID0gJ3RleHQnLHN0eWxlIH0gPSBwcm9wcztcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHdpZHRoOiAnMTAwJScgfX0+XHJcbiAgICAgIDxpbnB1dCAgc3R5bGU9e3suLi5zdHlsZXMsLi4uc3R5bGV9fSB7Li4ucHJvcHN9IGRhdGEtdGVzdGlkPXtpZH0gdHlwZT17dHlwZX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBCdXR0b24ocHJvcHMpIHtcbiAgY29uc3QgeyB0aXRsZSxzdHlsZSxpZCB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiB7Li4ucHJvcHN9PlxuICAgICAge3RpdGxlfVxuICAgIDwvYnV0dG9uPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi9sYXlvdXQvVGV4dElucHV0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2xheW91dC9CdXR0b24nO1xuaW1wb3J0IHt1c2VBcHBSb3V0ZX1mcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcbmltcG9ydCB7c2F2ZU1lc3NhZ2V9ZnJvbSAnLi9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnXG5cbmNvbnN0IHN0eWxlID0ge1xuICBpbnB1dENvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBib3JkZXI6ICcjNzM3MzczIHNvbGlkIDFweCcsXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgcGFkZGluZzogMTAsXG4gICAgZmxleDogMSxcbiAgICBib3JkZXI6ICd3aGl0ZScsXG4gIFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dCh7XG4gIGhhbmdvdXRzLFxuICBvblNlYXJjaCxcbiAgb25TZWxlY3RIYW5nb3V0LFxuICBzZWFyY2gsXG4gIHVzZXJuYW1lLFxuICBvblN0YXJ0U2VhcmNoLFxuICBkaXNwYXRjaFxufSkge1xuICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0U2VsZWN0aW9uKGUpe1xuICAgIGNvbnN0IGlkID1lLnRhcmdldC5pZFxuICAgIG9uU2VsZWN0SGFuZ291dChlKVxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKGc9PiBnLnVzZXJuYW1lPT09aWQpXG4gIFxuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTpgLyR7aGFuZ291dC5zdGF0ZX1gLHJvdXRlOicvaGFuZ291dHMnfSlcbiAgfVxuICByZXR1cm4gKFxuIFxuICAgIDxkaXYgc3R5bGU9e3sgIHBhZGRpbmdUb3A6Njh9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cbiAgICAgICAgPFRleHRJbnB1dFxuICAgICAgICAgIHZhbHVlPXtzZWFyY2h9XG4gICAgICAgICAgaWQ9XCJzZWFyY2gtaW5wdXRcIlxuICAgICAgICAgIHR5cGU9XCJzZWFyY2hcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtvblNlYXJjaH1cbiAgICAgICAgICBzdHlsZT17c3R5bGUuaW5wdXR9XG4gICAgICAgIC8+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1idG5cIlxuICAgICAgICAgIGRpc2FibGVkPXshc2VhcmNofVxuICAgICAgICAgIHRpdGxlPVwic2VhcmNoXCJcbiAgICAgICAgICBvbkNsaWNrPXtvblN0YXJ0U2VhcmNofVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxMaXN0IGlkPVwiaGFuZ291dHMtbGlzdFwiPlxuICAgICAgICB7aGFuZ291dHMgJiZcbiAgICAgICAgICBoYW5nb3V0cy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gaWQ9e2cudXNlcm5hbWV9IG9uQ2xpY2s9e2hhbmRsZUhhbmdvdXRTZWxlY3Rpb259PlxuICAgICAgICAgICAgICAgIHtnLnVzZXJuYW1lfVxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgIDwvTGlzdD5cbiAgIFxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5jb25zdCBzdHlsZXMgPSB7XG4gIHJvb3Q6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZWVlZWVlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgfSxcbn07XG5leHBvcnQgZnVuY3Rpb24gTGF5b3V0KHsgY2hpbGRyZW4sIHN0eWxlLCBpZCB9KSB7XG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPXtpZH0gc3R5bGU9e3sgLi4uc3R5bGVzLnJvb3QsIC4uLnN0eWxlIH19PntjaGlsZHJlbn08L2Rpdj47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcblxuY29uc3Qgc3R5bGUgPSB7XG4gIGNoZWNrYm94OiB7IG1hcmdpblJpZ2h0OiA4IH0sXG4gIGNoZWNrYm94Um9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBwYWRkaW5nOiAxNixcbiAgfSxcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgcGFkZGluZ1RvcDo2OFxuICB9LFxuICBidG46IHtcbiAgICBmbGV4OiAxLFxuICAgIG1hcmdpblJpZ2h0OiA0LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2soeyBvbkNhbmNlbCwgb25CbG9jaywgb25SZXBvcnQgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jaGVja2JveFJvb3R9PlxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XG4gICAgICAgIDxsYWJlbD5SZXBvcnQ8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkNhbmNlbFwiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2FuY2VsfSAvPlxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQmxvY2tcIiBzdHlsZT17c3R5bGUuYnRufSBpZD1cIkJMT0NLXCIgb25DbGljaz17b25CbG9ja30gZGF0YS10ZXN0aWQ9XCJibG9jay1idG5cIiAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIG9uQ2xpY2ssXHJcbiAgaWQsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2Z1xyXG4gICAgICBoZWlnaHQ9e2hlaWdodH1cclxuICAgICAgdmlld0JveD0nMCAwIDI0IDI0J1xyXG4gICAgICB3aWR0aD17d2lkdGh9XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGlkPXtpZH1cclxuICAgID5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gaWQ9e2lkfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGlkPXtpZH1cclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnpNNCAxMmMwLTQuNDIgMy41OC04IDgtOCAxLjg1IDAgMy41NS42MyA0LjkgMS42OUw1LjY5IDE2LjlDNC42MyAxNS41NSA0IDEzLjg1IDQgMTJ6bTggOGMtMS44NSAwLTMuNTUtLjYzLTQuOS0xLjY5TDE4LjMxIDcuMUMxOS4zNyA4LjQ1IDIwIDEwLjE1IDIwIDEyYzAgNC40Mi0zLjU4IDgtOCA4eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5leHBvcnQgZnVuY3Rpb24gQ2VudGVyKHsgY2hpbGRyZW4sIHN0eWxlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgLi4uc3R5bGUsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvQmxvY2snO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcblxuY29uc3Qgc3R5bGUgPSB7XG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIHBhZGRpbmdUb3A6NjhcbiAgfSxcbiAgYnRuOiB7XG4gICAgZmxleDogMSxcbiAgICBtYXJnaW5SaWdodDogNCxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrZWQoeyBoYW5nb3V0LCBvblVuYmxvY2ssIG9uQ2xvc2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJibG9ja2VkLXVpXCI+XG4gICAgICA8Q2VudGVyIHN0eWxlPXt7IGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPEJsb2NrIHdpZHRoPVwiNjBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwicmVkXCIgLz5cbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcbiAgICAgIDwvQ2VudGVyPlxuXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkNsb3NlXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbG9zZX0gLz5cbiAgICAgICAgPEJ1dHRvbiBpZD0nVU5CTE9DSycgdGl0bGU9XCJVbmJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25VbmJsb2NrfSBkYXRhLXRlc3RpZD0ndW5ibG9jay1idG4nLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBEZWxldGUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9PlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J002IDE5YzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMlY3SDZ2MTJ6TTE5IDRoLTMuNWwtMS0xaC01bC0xIDFINXYyaDE0VjR6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcmNoaXZlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXsyNH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9PlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00yMC41NCA1LjIzbC0xLjM5LTEuNjhDMTguODggMy4yMSAxOC40NyAzIDE4IDNINmMtLjQ3IDAtLjg4LjIxLTEuMTYuNTVMMy40NiA1LjIzQzMuMTcgNS41NyAzIDYuMDIgMyA2LjVWMTljMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY2LjVjMC0uNDgtLjE3LS45My0uNDYtMS4yN3pNMTIgMTcuNUw2LjUgMTJIMTB2LTJoNHYyaDMuNUwxMiAxNy41ek01LjEyIDVsLjgxLTFoMTJsLjk0IDFINS4xMnonXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmltcG9ydCB7IERlbGV0ZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9EZWxldGUnO1xuaW1wb3J0IHsgQXJjaGl2ZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9BcmNoaXZlJztcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0Jsb2NrJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGljb25CdG46IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWFyZ2luOiA4IH0sXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxuICBidG5Db250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIH0sXG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICB9LFxuICBidG5Pazoge1xuICAgIG1hcmdpbjogOCxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xuICBvbkJsb2NrLFxuICBvbkRlbGV0ZSxcbiAgb25BcmNoaXZlLFxuICBvbk5vdGlmaWNhdGlvbixcbiAgb25Db252ZXJzYXRpb25IaXN0b3J5LFxuICBvbk5hdmlnYXRpb24sXG4gIG9uT2ssXG59KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XG4gICAgICAgIDxDaGVja2JveFxuICAgICAgICAgIGxhYmVsPVwiQ29udmVyc2F0aW9uIEhpc3RvcnlcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxociAvPlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuQ29udGFpbmVyfT5cbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJBcmNoaXZlXCIgSWNvbj17QXJjaGl2ZX0gb25DbGljaz17b25BcmNoaXZlfSAvPlxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XG4gICAgICAgIDxJY29uQnV0dG9uIGlkPVwiYmNrdWlcIiB0aXRsZT1cIkJsb2NrXCIgSWNvbj17QmxvY2t9IG9uQ2xpY2s9e29uTmF2aWdhdGlvbn0gIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bk9rfT5cbiAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvbk9rfT5PSzwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG5cbmZ1bmN0aW9uIEljb25CdXR0b24oeyBJY29uLCB0aXRsZSwgb25DbGljayxpZCB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17c3R5bGUuaWNvbkJ0bn0+XG4gICAgICA8YnV0dG9uIGlkPXtpZH0gc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbGlja30gZGF0YS10ZXN0aWQ9e2Ake2lkfS1idG5gfT5cbiAgICAgICAgPEljb24gaWQ9e2lkfS8+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxkaXY+e3RpdGxlfTwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBDaGVja2JveCh7IGxhYmVsLCBvbkNoYW5nZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBtYXJnaW46IDgsIG1hcmdpblRvcDogOCB9fT5cbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XG4gICAgICA8bGFiZWw+e2xhYmVsfTwvbGFiZWw+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGVyc29uQWRkSWNvbih7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICd3aGl0ZScsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTE1IDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptLTktMlY3SDR2M0gxdjJoM3YzaDJ2LTNoM3YtMkg2em05IDRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCBQZXJzb25BZGQgZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL1BlcnNvbkFkZCc7XG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi8uLi9sYXlvdXQvVGV4dElucHV0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGUoeyBoYW5nb3V0LCBvbkludml0ZSwgb25NZXNzYWdlVGV4dCxtZXNzYWdlVGV4dCwgdmFsdWUgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH1pZD1cImludml0ZS11aVwiPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgPFBlcnNvbkFkZCBjb2xvcj1cImdyZWVuXCIgLz5cbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgU3RhcnQgQ29udmVyc2F0aW9uIHdpdGggPGI+e2hhbmdvdXQgJiYgaGFuZ291dC5lbWFpbH08L2I+XG4gICAgICA8L0NlbnRlcj5cbiAgICAgIDxUZXh0SW5wdXQgaWQ9XCJtZXNzYWdlVGV4dElucHV0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9IHZhbHVlPXttZXNzYWdlVGV4dH0gLz5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJTZW5kIEludml0ZVwiIGlkPVwiSU5WSVRFXCIgb25DbGljaz17b25JbnZpdGV9IGRhdGEtdGVzdGlkPSdvbmludml0ZS1idG4nIC8+XG4gICAgICA8L0NlbnRlcj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERvbmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTkgMTYuMkw0LjggMTJsLTEuNCAxLjRMOSAxOSAyMSA3bC0xLjQtMS40TDkgMTYuMnonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgRG9uZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9Eb25lJztcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcblxuY29uc3Qgc3R5bGUgPSB7XG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlZSh7IGhhbmdvdXQgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJpbnZpdGVlLXVpXCI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8RG9uZSB3aWR0aD1cIjcwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cImdyZWVuXCIgLz5cbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgPHA+XG4gICAgICAgICAgWW91IHdpbGwgYmUgYWJsZSB0byBjaGF0IHdpdGggPGI+e2hhbmdvdXQgJiYgaGFuZ291dC5lbWFpbH08L2I+IG9uY2VcbiAgICAgICAgICB5b3VyIGludml0aW9uIGhhcyBiZWVuIGFjY2VwdGVkLlxuICAgICAgICA8L3A+XG4gICAgICA8L0NlbnRlcj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5jb25zdCBzdHlsZSA9IHtcbiAgcm9vdDoge1xuICAgIGJvcmRlckNvbG9yOiAnI2VlZWVlZScsXG4gICAgYm9yZGVyU3R5bGU6ICdzb2xpZCcsXG4gICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgIHBhZGRpbmc6IDMsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgbWluSGVpZ2h0OiAzNSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gIH0sXG4gIHVzZXJuYW1lOiB7IG1hcmdpblJpZ2h0OiA4IH0sXG4gIGxvZzoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBjb2xvcjogJyM3MzczNzMnLFxuICAgIGZvbnRTaXplOiAxMCxcbiAgfSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XG4gIGNvbnN0IHsgbWVzc2FnZSB9ID0gcHJvcHM7XG4gIGNvbnN0IHsgZmxvYXQsIHVzZXJuYW1lIH0gPSBtZXNzYWdlO1xuICBjb25zdCBbZGF5cywgc2V0RGF5c10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW21pbnV0ZXMsIHNldE1pbnV0ZXNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtzZWNvbmRzLCBzZXRTZWNvbmRzXSA9IHVzZVN0YXRlKDApO1xuXG4gIGZ1bmN0aW9uIGNvbnZlcnRNUyhtcykge1xuICAgIHZhciBkLCBoLCBtLCBzO1xuICAgIHMgPSBNYXRoLmZsb29yKG1zIC8gMTAwMCk7XG4gICAgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcbiAgICBzID0gcyAlIDYwO1xuICAgIGggPSBNYXRoLmZsb29yKG0gLyA2MCk7XG4gICAgbSA9IG0gJSA2MDtcbiAgICBkID0gTWF0aC5mbG9vcihoIC8gMjQpO1xuICAgIGggPSBoICUgMjQ7XG4gICAgc2V0RGF5cyhkKTtcbiAgICBzZXRIb3VycyhoKTtcbiAgICBzZXRNaW51dGVzKG0pO1xuICAgIHNldFNlY29uZHMocyk7XG4gIH1cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gbWVzc2FnZS50aW1lc3RhbXApO1xuICAgIH0sIDApO1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gbWVzc2FnZS50aW1lc3RhbXApO1xuICAgIH0sIDYwMDAwKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLG1hcmdpbkJvdHRvbTozIH19PlxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VcIiBzdHlsZT17c3R5bGUubWVzc2FnZX0+e21lc3NhZ2UgJiYgbWVzc2FnZS50ZXh0fTwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5sb2d9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnVzZXJuYW1lfT57dXNlcm5hbWUgJiYgdXNlcm5hbWV9OjwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICB7bWludXRlcyA9PT0gMCAmJiA8ZGl2Pk5vdzwvZGl2Pn1cbiAgICAgICAgICAgIHtob3VycyA9PT0gMCAmJiBtaW51dGVzID4gMCAmJiA8ZGl2PnttaW51dGVzfSBtaW51dGVzIGFnbyA8L2Rpdj59XG4gICAgICAgICAgICB7aG91cnMgPiAwICYmIGRheXMgPT09IDAgJiYgKFxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtob3Vyc30gaG91cnMge21pbnV0ZXN9IG1pbnV0ZXMgYWdveycgJ31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2RheXMgPD0gMTAgJiYgZGF5cyA+IDEgJiYgPGRpdj57ZGF5c30gZGF5cyBhZ288L2Rpdj59XG4gICAgICAgICAgICB7ZGF5cyA+IDEwICYmIG5ldyBEYXRlKG1lc3NhZ2UudGltZXN0YW1wKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL21lc3NhZ2UtdWkvTWVzc2FnZSc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBwYWRkaW5nVG9wOiA3MCxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIHBhZGRpbmdCb3R0b206OCxcbiBcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZXIoeyBoYW5nb3V0LCBvbkFjY2VwdCwgb25EZWNsaW5lIH0pIHtcblxuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5MZWZ0OiA4LCBkaXNwbGF5OidmbGV4JyB9fT5cbiAgICAgICAgICB7aGFuZ291dCAmJiBoYW5nb3V0Lm1lc3NhZ2UgJiYgKFxuICAgICAgICAgICAgPE1lc3NhZ2VcbiAgICAgICAgICAgICAgbWVzc2FnZT17XG4gICAgICAgICAgICAgICAgaGFuZ291dCAmJlxuICAgICAgICAgICAgICAgIGhhbmdvdXQubWVzc2FnZSAmJiB7XG4gICAgICAgICAgICAgICAgICAuLi5oYW5nb3V0Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxmbG9hdDonbGVmdCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcscGFkZGluZ0xlZnQ6OCxwYWRkaW5nUmlnaHQ6OCB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBpZD1cIkRFQ0xJTkVcIlxuICAgICAgICAgICAgb25DbGljaz17b25EZWNsaW5lfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWNsaW5lLWJ0blwiXG4gICAgICAgICAgICB0aXRsZT1cIkRlY2xpbmVcIlxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luUmlnaHQ6IDQsIGNvbG9yOiAncmVkJyB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgaWQ9XCJBQ0NFUFRcIlxuICAgICAgICAgICAgb25DbGljaz17b25BY2NlcHR9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2VwdC1idG5cIlxuICAgICAgICAgICAgdGl0bGU9XCJBY2NlcHRcIlxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luTGVmdDogNCwgY29sb3I6ICdncmVlbicgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi8uLi9sYXlvdXQvVGV4dElucHV0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuY29uc3Qgc3R5bGVzID0ge1xuICByb290OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICB9LFxuICBpbnB1dDoge1xuICAgIC8vbWFyZ2luOjBcbiAgICBwYWRkaW5nOiA1LFxuICAgIG1hcmdpbkxlZnQ6IDgsXG4gICAgbWFyZ2luUmlnaHQ6IDgsXG4gICAgbWFyZ2luVG9wOiA4LFxuICAgIG1hcmdpbkJvdHRvbTogOCxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBmbGV4OiAxLFxuICAgIFxuICB9LFxuICBidG46e1xuICAgIHBhZGRpbmc6IDgsXG5cbiAgICBtYXJnaW5SaWdodDogMTYsXG4gICAgbWFyZ2luVG9wOiA4LFxuICAgIG1hcmdpbkJvdHRvbTogOCxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBmbGV4OiAxLFxuICB9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlLGhhbmdvdXQgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5yb290fT5cbiAgICAgXG4gICAgICA8aW5wdXQgc3R5bGU9e3N0eWxlcy5pbnB1dH0gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiIHZhbHVlPXttZXNzYWdlVGV4dH0vPlxuICAgICAgXG4gICAgICA8ZGl2PlxuICAgICAgICA8QnV0dG9uIGRpc2FibGVkPXtoYW5nb3V0ICYmaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJ30gIHN0eWxlPXtzdHlsZXMuYnRufSAgdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXG5jb25zdCBzdHlsZSA9IHtcbiAgICBjb2xvcjogJ3JlZCcsXG4gICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBmb250U2l6ZTogMTYsXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xufVxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlKHsgbWVzc2FnZSB9KSB7XG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZXItbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9PC9kaXY+XG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcbmNvbnN0IHN0eWxlID0ge1xuICAgIGNvbG9yOiAncmVkJyxcbiAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICB0ZXh0QWxpZ246ICdlbmQnXG59XG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlZE1lc3NhZ2UoeyBtZXNzYWdlLG9uTmF2aWdhdGlvbiB9KSB7XG4gICAgZnVuY3Rpb24gaGFuZGxlTmF2aWdhdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIG9uTmF2aWdhdGlvbihlKVxuICAgIH1cbiAgICBkZWJ1Z2dlcjtcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlZC1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH1cbiAgICA8YSBpZD1cIlVOQkxPQ0tcIiBkYXRhLXRlc3RpZD1cInNlZW1vcmUtYnRuXCIgaHJlZj1cIi9cIiBvbkNsaWNrPXtoYW5kbGVOYXZpZ2F0aW9ufT5zZWUgbW9yZTwvYT5cbiAgICA8L2Rpdj5cbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4vTWVzc2FnZUVkaXRvcic7XG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZSB9IGZyb20gJy4vQmxvY2tlck1lc3NhZ2UnXG5pbXBvcnQge0Jsb2NrZWRNZXNzYWdlfSBmcm9tICcuL0Jsb2NrZWRNZXNzYWdlJ1xuY29uc3Qgc3R5bGVzID0ge1xuICBtZXNzYWdlQ29udGFpbmVyOiB7XG4gICAgLy8gd2lkdGg6ICcxMDAlJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBwYWRkaW5nOiAzLFxuICAvLyAgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyxcbiAgICBmbGV4OiAxNSxcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCJcblxuICB9LFxufTtcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlcyh7XG4gIG1lc3NhZ2VzLFxuICBvbk1lc3NhZ2UsXG4gIG9uTWVzc2FnZVRleHQsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZSxcbiAgaGFuZ291dCxcbiAgb25OYXZpZ2F0aW9uXG59KSB7XG4gIGNvbnN0IHNjcm9sbGVyUmVmID0gdXNlUmVmKG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICAgIH1cbiAgfSwgW21lc3NhZ2VzXSk7XG5cbiAgZnVuY3Rpb24gb25TZW5kKGUpIHtcbiAgICBvbk1lc3NhZ2UoZSk7XG4gICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBwYWRkaW5nVG9wOiA2OCB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5tZXNzYWdlQ29udGFpbmVyfSByZWY9e3Njcm9sbGVyUmVmfT5cbiAgICAgICAge21lc3NhZ2VzICYmXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcbiAgICAgICAgICAgIChtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgeyFtLnR5cGUgJiYgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VyJyAmJiA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VkJyAmJiA8QmxvY2tlZE1lc3NhZ2UgbWVzc2FnZT17bX0gb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259Lz59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cbiAgICAgICAgPE1lc3NhZ2VFZGl0b3JcbiAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxuICAgICAgICAgIG9uTWVzc2FnZT17b25TZW5kfVxuICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cbiAgICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xuICBpZiAobWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCAmJiB1c2VybmFtZSkge1xuICAgIHJldHVybiBtZXNzYWdlcy5tYXAoKG1zZykgPT4ge1xuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ3JpZ2h0JywgdXNlcm5hbWU6ICdtZScgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdsZWZ0JyB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5mdW5jdGlvbiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSB7XG4gIGlmIChtZXNzYWdlcykge1xuICAgIHJldHVybiBtZXNzYWdlcy5zb3J0KCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9tZXNzYWdlLXVpL01lc3NhZ2VzJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdjaGF0KHtcbiAgbWVzc2FnZXMgPSBbXSxcbiAgb25NZXNzYWdlVGV4dCxcbiAgb25NZXNzYWdlLFxuICBtZXNzYWdlVGV4dCxcbiAgdXNlcm5hbWUsXG4gIGhhbmdvdXQsXG4gIG9uTmF2aWdhdGlvblxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cbiAgICAgIDxNZXNzYWdlc1xuICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XG4gICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XG4gICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XG4gICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgIG1lc3NhZ2VUZXh0ID17bWVzc2FnZVRleHR9XG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgIC8+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmNvbnN0IHN0eWxlID0ge1xuICB3aWR0aDogMTUsXG4gIGhlaWdodDogMTUsXG5cbiAgYm9yZGVyOiAnd2hpdGUgMnB4IHNvbGlkJyxcbn07XG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XG4gIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XG4gICAgcmV0dXJuIDxJc09ubGluZSAvPjtcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XG4gICAgcmV0dXJuIDxDb25uZWN0aW5nIC8+O1xuICB9IGVsc2UgaWYgKHJlYWR5U3RhdGUgPT09IDIpIHtcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XG4gIH1cbiAgcmV0dXJuIDxJc09mZmxpbmUgLz47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc09ubGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nIH19XG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXG4gICAgPjwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNPZmZsaW5lKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvbm5lY3RpbmcoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXG4gICAgPjwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2xvc2luZygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncGluaycgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXG4gICAgPjwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFRoZW1lQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZVRoZW1lQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xyXG5cclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFRoZW1lUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gVGhlbWVQcm92aWRlcihwcm9wcykge1xyXG4gIFxyXG4gIGNvbnN0IHsgaW5pdFN0YXRlIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0U3RhdGUpO1xyXG5cclxuICByZXR1cm4gPFRoZW1lQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17c3RhdGV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZVRoZW1lQ29udGV4dCwgVGhlbWVQcm92aWRlciB9O1xyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xuXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcbmV4cG9ydCBmdW5jdGlvbiBEcmF3ZXJDb250ZW50KHsgb3BlbiB9KSB7XG4gIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXG5cbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTonLycscm91dGU6YC8ke2lkfWB9KVxuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxMaXN0PlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nb3V0c1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBIYW5nb3V0c1xuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBCbG9ja1xuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja2VkXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEJsb2NrZWRcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEludml0ZVxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJpbnZpdGVlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEludml0ZWVcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlclwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBJbnZpdGVyXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImhhbmdjaGF0XCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEhhbmdjaGF0XG4gICAgICAgIDwvTGlzdEl0ZW0+XG5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiY29uZmlndXJlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIENvbmZpZ3VyZVxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJtZXNzYWdlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIE1lc3NhZ2VcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwibWVzc2FnZXNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgTWVzc2FnZXNcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwib25saW5lXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgb25saW5lU3RhdHVzXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cInVucmVhZFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgIFVyZWFkXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImJsb2NrZXItbWVzc2FnZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgIEJsb2NrZXJNZXNzYWdlXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImljb25zXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgSWNvbnNcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgIDwvTGlzdD5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGNvdW50OiB7XG4gICAgd2lkdGg6IDMwLFxuICAgIGhlaWdodDogMzAsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nLFxuICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgIHRleHRBbGlnbjonY2VudGVyJyxcbiAgICBib3JkZXJSYWRpdXM6MTUsXG4gICAgZGlzcGxheTonZmxleCcsXG4gICAgYWxpZ25JdGVtczonY2VudGVyJyxcbiAgICBqdXN0aWZ5Q29udGVudDonY2VudGVyJ1xuICB9LFxufTtcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHsgY291bnQ9MCB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgICAgPGRpdj5tZXNzYWdlOjwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9Pntjb3VudH08L2Rpdj4gXG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi4vbGF5b3V0L2ljb25zL01lc3NhZ2UnXG5leHBvcnQgZnVuY3Rpb24gSWNvbnNEZW1vKCl7XG4gICAgcmV0dXJuIDxkaXY+XG5cbiAgICAgICAgPE1lc3NhZ2UgY291bnQ9ezF9Lz5cbiAgICA8L2Rpdj5cbn0iLCJleHBvcnQgY29uc3QgbWVzc2FnZXMgPVtcbiAgICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxuICB9LFxuICAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgT2sgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMyMTYzNDYyLFxuICB9LHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBIb3cgYXJlIHlvdSBkZW1vYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGFsbCByaWdodGAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjc3NTczLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NixcbiAgfSxcbiAgLFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OCxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG5dIiwiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7dW5yZWFkaGFuZ291dHN9KXtcbiAgICByZXR1cm4gICB1bnJlYWRoYW5nb3V0cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gKGFjY3VtdWxhdG9yID0gW3sgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH1dKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBvYmogPSBhY2N1bXVsYXRvci5maW5kKFxuICAgICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWUgJiYgY3VycmVudC5zdGF0ZSA9PT0gJ01FU1NBTkdFUidcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYWNjdW11bGF0b3IuZmluZEluZGV4KFxuICAgICAgICAgICAgICAoYSkgPT4gYS51c2VybmFtZSA9PT0gY3VycmVudC51c2VybmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XG4gICAgICAgICAgICBhY2N1bXVsYXRvci5zcGxpY2UoaW5kZXgsIDEsIHtcbiAgICAgICAgICAgICAgLi4ub2JqLFxuICAgICAgICAgICAgICBtZXNzYWdlQ291bnQ6ICsrb2JqLm1lc3NhZ2VDb3VudCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxuICAgICAgICAgICAgYWNjdW11bGF0b3IucHVzaCh7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgfSwgW10pO1xufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVucmVhZEhhbmdvdXRzKHsgdW5yZWFkaGFuZ291dHMsb25TZWxlY3RVbnJlYWQgfSkge1xuICBjb25zdCBbaXRlbXMsc2V0SXRlbXNdID11c2VTdGF0ZShbXSlcbnVzZUVmZmVjdCgoKT0+e1xuaWYodW5yZWFkaGFuZ291dHMpe1xuICBjb25zdCByZWR1Y2VkID1yZWR1Y2VyVW5yZWFkaGFuZ291dHMoe3VucmVhZGhhbmdvdXRzfSlcbiAgc2V0SXRlbXMocmVkdWNlZClcbn1cblxufSxbdW5yZWFkaGFuZ291dHNdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD0ndW5yZWFkaGFuZ291dHMnPlxuICAgICAgPExpc3Q+XG4gICAgICAgIHtpdGVtcyAmJlxuICAgICAgICAgIGl0ZW1zLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBpdGVtcy5tYXAoKHUpID0+IHtcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgIHJldHVybiA8TGlzdEl0ZW0gb25DbGljaz17b25TZWxlY3RVbnJlYWR9IGlkPXt1LnVzZXJuYW1lfT57dS51c2VybmFtZX0gPGRpdiBzdHlsZT17e2NvbG9yOicjNzM3MzczJ319Pm1lc3NhZ2VzOiB7dS5tZXNzYWdlQ291bnR9PC9kaXY+PC9MaXN0SXRlbT47XG4gICAgICAgICAgfSl9XG4gICAgICA8L0xpc3Q+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCBVbnJlYWQgZnJvbSAnLi4vaGFuZ291dHMvVW5yZWFkSGFuZ291dHMnO1xuaW1wb3J0IHtyZWR1Y2VyVW5yZWFkaGFuZ291dHN9IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzJ1xuY29uc3QgdW5yZWFkcyA9IFtcbiAge1xuICAgIHVzZXJuYW1lOiAnZGVtbycsXG4gICAgc3RhdGU6ICdNRVNTQU5HRVInLFxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxuICB9LFxuXG4gIHtcbiAgICB1c2VybmFtZTogJ2RlbW8nLFxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOiAnYmVybycsXG4gICAgc3RhdGU6ICdNRVNTQU5HRVInLFxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxuICB9LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFVucmVhZERlbW8oKSB7XG4gIHJldHVybiA8VW5yZWFkIHVucmVhZGhhbmdvdXRzPXtyZWR1Y2VyVW5yZWFkaGFuZ291dHMoe3VucmVhZGhhbmdvdXRzOnVucmVhZHN9KX0gLz47XG59XG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcbmltcG9ydCB7QmxvY2tlck1lc3NhZ2V9IGZyb20gJy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvQmxvY2tlck1lc3NhZ2UnXG5cbmNvbnN0IG1lc3NhZ2UgPXt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIGJsb2NrZWQnLFxudGltZXN0YW1wOjEyMzIzLFxudXNlcm5hbWU6J2RlbW8nXG59XG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlck1lc3NhZ2VEZW1vKCl7XG4gICAgcmV0dXJuIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfS8+XG59IiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IEFwcFJvdXRlUHJvdmlkZXIsIEFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xuaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi9OYXZpZ2F0aW9uJztcbmltcG9ydCBIYW5nb3V0IGZyb20gJy4uL2hhbmdvdXRzL0hhbmdvdXQnO1xuaW1wb3J0IEJsb2NrIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrJztcbmltcG9ydCBCbG9ja2VkIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrZWQnO1xuaW1wb3J0IENvbmZpZ3VyZSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9Db25maWd1cmUnO1xuaW1wb3J0IEludml0ZSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGUnO1xuaW1wb3J0IEludml0ZWUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlZSc7XG5pbXBvcnQgSW52aXRlciBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVyJztcbmltcG9ydCBIYW5nY2hhdCBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9IYW5nY2hhdCc7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlJztcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlcyc7XG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlRWRpdG9yJztcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJy4uL2xheW91dC9pY29ucy9vbmxpbmVTdGF0dXMnO1xuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XG5pbXBvcnQgeyBEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi9EcmF3ZXJDb250ZW50JztcbmltcG9ydCB7SWNvbnNEZW1vfSBmcm9tICcuL0ljb25zRGVtbydcbmltcG9ydCB7IG1lc3NhZ2VzIH0gZnJvbSAnLi9mYWtlTWVzc2FnZXMnO1xuaW1wb3J0IHtVbnJlYWREZW1vfSBmcm9tICcuL1VyZWFkRGVtbydcbmltcG9ydCB7QmxvY2tlck1lc3NhZ2VEZW1vIH0gZnJvbSAnLi9CbG9ja2VyTWVzc2FnZURlbW8nXG5jb25zdCBoYW5nb3V0cyA9IFtcbiAgeyB1c2VybmFtZTogJ3VzZXJvbmUnIH0sXG4gIHsgdXNlcm5hbWU6ICd1c2VydHdvJyB9LFxuICB7IHVzZXJuYW1lOiAndXNlcnRocmVlJyB9LFxuXTtcbmNvbnN0IGhhbmdvdXQgPSB7XG4gIHVzZXJuYW1lOiAndGVzdHVzZXInLFxuICBlbWFpbDogJ3Rlc3RAZ21haWwuY29tJyxcbiAgbWVzc2FnZTogeyB0ZXh0OiBgTGV0J3MgY2hhdCBvbiBIYW5nb3V0IWAsIHRpbWVzdGFtcDogMTU5MDgyMDc4MjkyMSB9LFxufTtcbmNvbnN0IG1lc3NhZ2UgPSB7XG4gIHVzZXJuYW1lOiAnYnJlbm8nLFxuICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gIHRpbWVzdGFtcDogMTU5MTMzMTc2NzgzNixcbn07XG4vL1xucmVuZGVyKFxuICA8VGhlbWVQcm92aWRlclxuICAgIGluaXRTdGF0ZT17e1xuICAgICAgcHJpbWFyeToge1xuICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXG4gICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcbiAgICAgIH0sXG4gICAgfX1cbiAgPlxuICAgIDxBcHBSb3V0ZVByb3ZpZGVyIGluaXRTdGF0ZT17eyBmZWF0dXJlUm91dGU6ICcvJywgcm91dGU6ICcvaWNvbnMnIH19PlxuICAgICAgPE5hdmlnYXRpb24gZHJhd2VyQ29udGVudD17PERyYXdlckNvbnRlbnQgLz59PlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tcIj5cbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tlZFwiPlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlXCI+XG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pbnZpdGVlXCI+XG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlclwiPlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdjaGF0XCI+XG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvbWVzc2FnZVwiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cbiAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e21lc3NhZ2V9IHVzZXJuYW1lPXtoYW5nb3V0LnVzZXJuYW1lfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9vbmxpbmVcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cbiAgICAgICAgICAgIDxPbmxpbmVTdGF0dXMgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvbWVzc2FnZXNcIj5cbiAgICAgICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi91bnJlYWRcIj5cbiAgICAgICAgICA8VW5yZWFkRGVtby8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZXItbWVzc2FnZVwiPlxuICAgICAgICAgIDxCbG9ja2VyTWVzc2FnZURlbW8vPlxuICAgICAgICA8L0FwcFJvdXRlPlxuXG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ljb25zXCI+XG4gICAgICAgICAgPEljb25zRGVtby8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICA8L05hdmlnYXRpb24+XG4gICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxuICA8L1RoZW1lUHJvdmlkZXI+LFxuICBkb2N1bWVudC5ib2R5XG4pO1xuIl0sIm5hbWVzIjpbInQiLCJ1IiwiciIsImkiLCJvIiwiYyIsImYiLCJlIiwiYSIsInYiLCJtIiwiRSIsImQiLCJoIiwidyIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwidXNlQXBwUm91dGUiLCJkaXNwYXRjaCIsIm9uQXBwUm91dGUiLCJBcHBSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJmaW5kIiwicCIsIkFwcFJvdXRlUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJ1c2VSZWR1Y2VyIiwidmFsdWUiLCJ1c2VNZW1vIiwiTmF2aWdhdGlvbiIsImRyYXdlckNvbnRlbnQiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJwYWRkaW5nIiwiZmxleCIsIkxpc3QiLCJpZCIsImJveFNpemluZyIsImJhY2tncm91bmRDb2xvciIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwid2lkdGgiLCJMaXN0SXRlbSIsIm9uQ2xpY2siLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsInN0eWxlcyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIlRleHRJbnB1dCIsInN0eWxlIiwiQnV0dG9uIiwidGl0bGUiLCJpbnB1dENvbnRhaW5lciIsImJvcmRlciIsImlucHV0IiwiSGFuZ291dCIsImhhbmdvdXRzIiwib25TZWFyY2giLCJvblNlbGVjdEhhbmdvdXQiLCJzZWFyY2giLCJ1c2VybmFtZSIsIm9uU3RhcnRTZWFyY2giLCJoYW5kbGVIYW5nb3V0U2VsZWN0aW9uIiwidGFyZ2V0IiwiaGFuZ291dCIsImxlbmd0aCIsIm1hcCIsInJvb3QiLCJoZWlnaHQiLCJMYXlvdXQiLCJjaGVja2JveCIsImNoZWNrYm94Um9vdCIsImFsaWduSXRlbXMiLCJsYXlvdXQiLCJmbGV4RGlyZWN0aW9uIiwiYnRuIiwiQmxvY2siLCJvbkNhbmNlbCIsIm9uQmxvY2siLCJvblJlcG9ydCIsImZpbGwiLCJjb2xvciIsIkNlbnRlciIsInRleHRBbGlnbiIsIkJsb2NrZWQiLCJvblVuYmxvY2siLCJvbkNsb3NlIiwiRGVsZXRlIiwiQXJjaGl2ZSIsImljb25CdG4iLCJtYXJnaW4iLCJidG5Db250YWluZXIiLCJidG5PayIsIkNvbmZpZ3VyZSIsIm9uRGVsZXRlIiwib25BcmNoaXZlIiwib25Ob3RpZmljYXRpb24iLCJvbkNvbnZlcnNhdGlvbkhpc3RvcnkiLCJvbk5hdmlnYXRpb24iLCJvbk9rIiwiSWNvbkJ1dHRvbiIsIkljb24iLCJDaGVja2JveCIsImxhYmVsIiwib25DaGFuZ2UiLCJQZXJzb25BZGRJY29uIiwiSW52aXRlIiwib25JbnZpdGUiLCJvbk1lc3NhZ2VUZXh0IiwibWVzc2FnZVRleHQiLCJQZXJzb25BZGQiLCJlbWFpbCIsIkRvbmUiLCJJbnZpdGVlIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwiYm9yZGVyUmFkaXVzIiwibWluSGVpZ2h0IiwibG9nIiwiZm9udFNpemUiLCJNZXNzYWdlIiwibWVzc2FnZSIsImZsb2F0IiwiZGF5cyIsInNldERheXMiLCJ1c2VTdGF0ZSIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJzIiwiTWF0aCIsImZsb29yIiwidXNlRWZmZWN0Iiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJ0aW1lc3RhbXAiLCJzZXRJbnRlcnZhbCIsInRleHQiLCJJbnZpdGVyIiwib25BY2NlcHQiLCJvbkRlY2xpbmUiLCJNZXNzYWdlRWRpdG9yIiwib25NZXNzYWdlIiwiQmxvY2tlck1lc3NhZ2UiLCJCbG9ja2VkTWVzc2FnZSIsImhhbmRsZU5hdmlnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm1lc3NhZ2VDb250YWluZXIiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJNZXNzYWdlcyIsIm1lc3NhZ2VzIiwic2Nyb2xsZXJSZWYiLCJ1c2VSZWYiLCJjdXJyZW50Iiwic2Nyb2xsVG9wIiwic2Nyb2xsSGVpZ2h0Iiwib25TZW5kIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1zZyIsInNvcnQiLCJIYW5nY2hhdCIsIk9ubGluZVN0YXR1cyIsInJlYWR5U3RhdGUiLCJJc09ubGluZSIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwiVGhlbWVDb250ZXh0IiwiVGhlbWVQcm92aWRlciIsInNldFN0YXRlIiwiRHJhd2VyQ29udGVudCIsIm9wZW4iLCJoYW5kbGVSb3V0ZSIsImNvdW50IiwiSWNvbnNEZW1vIiwicmVkdWNlclVucmVhZGhhbmdvdXRzIiwidW5yZWFkaGFuZ291dHMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsImluZGV4IiwibWVzc2FnZUNvdW50Iiwib2JqIiwiZmluZEluZGV4Iiwic3BsaWNlIiwicHVzaCIsIlVucmVhZEhhbmdvdXRzIiwib25TZWxlY3RVbnJlYWQiLCJpdGVtcyIsInNldEl0ZW1zIiwicmVkdWNlZCIsInVucmVhZHMiLCJVbnJlYWREZW1vIiwiVW5yZWFkIiwiQmxvY2tlck1lc3NhZ2VEZW1vIiwicmVuZGVyIiwicHJpbWFyeSIsImJhY2tncm91bmQiLCJmb250RmFtaWx5IiwiZG9jdW1lbnQiLCJib2R5Il0sIm1hcHBpbmdzIjoiQUFBRyxJQUFDLENBQUMsQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9FQUFvRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUF1RyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBc08sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTVvUyxJQUFJQSxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1IsR0FBQyxDQUFDLENBQUMsQ0FBQ0UsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUMsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNTLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPUCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBbUYsU0FBU1csR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ULEdBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUEyRyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFzRCxTQUFTYyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNiLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQ1EsR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBNE4sU0FBU2MsR0FBQyxFQUFFLENBQUNYLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1osR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNOLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDTCxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUYsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRWEsR0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1QsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDQyxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQ1EsR0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQzs7QUNBenRFLE1BQU1DLFdBQVcsR0FBRTtBQUN0QkMsRUFBQUEsaUJBQWlCLEVBQUMsbUJBREk7QUFFdEJDLEVBQUFBLHFCQUFxQixFQUFDO0FBRkEsQ0FBbkI7O0FDRUEsU0FBU0MsT0FBVCxDQUFpQkMsS0FBakIsRUFBd0JDLE1BQXhCLEVBQWdDO0FBQ25DLFVBQVFBLE1BQU0sQ0FBQ0MsSUFBZjtBQUNJLFNBQUtOLFdBQVcsQ0FBQ0MsaUJBQWpCO0FBQ0ksYUFBTyxFQUFFLEdBQUdHLEtBQUw7QUFBWUcsUUFBQUEsS0FBSyxFQUFFRixNQUFNLENBQUNFLEtBQTFCO0FBQWdDQyxRQUFBQSxZQUFZLEVBQUVILE1BQU0sQ0FBQ0c7QUFBckQsT0FBUDs7QUFDSjtBQUNJLGFBQU9KLEtBQVA7QUFKUjtBQU1IOztBQ0xELE1BQU1LLGVBQWUsR0FBR0MsQ0FBYSxFQUFyQzs7QUFFQyxTQUFTQyxrQkFBVCxHQUE4QjtBQUM3QixRQUFNQyxPQUFPLEdBQUdDLEdBQVUsQ0FBQ0osZUFBRCxDQUExQjs7QUFFQSxNQUFJLENBQUNHLE9BQUwsRUFBYztBQUNaLFVBQU0sSUFBSUUsS0FBSixDQUFVLHVEQUFWLENBQU47QUFDRDs7QUFDRCxTQUFPRixPQUFQO0FBQ0Q7QUFlTSxTQUFTRyxXQUFULEdBQXVCO0FBQzVCLFFBQU0sQ0FBQ1gsS0FBRCxFQUFPWSxRQUFQLElBQWlCTCxrQkFBa0IsRUFBekM7O0FBRUEsV0FBU00sVUFBVCxDQUFvQjtBQUFDVixJQUFBQSxLQUFEO0FBQU9DLElBQUFBO0FBQVAsR0FBcEIsRUFBeUM7QUFDdkNRLElBQUFBLFFBQVEsQ0FBQztBQUFDVixNQUFBQSxJQUFJLEVBQUNOLFdBQVcsQ0FBQ0MsaUJBQWxCO0FBQXFDTyxNQUFBQSxZQUFyQztBQUFrREQsTUFBQUE7QUFBbEQsS0FBRCxDQUFSO0FBQ0Q7O0FBRUQsU0FBTztBQUFDVSxJQUFBQTtBQUFELEdBQVA7QUFDRDtBQUVNLFNBQVNDLFFBQVQsQ0FBa0JDLEtBQWxCLEVBQXlCO0FBQzlCLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQSxJQUFaO0FBQWtCQyxJQUFBQTtBQUFsQixNQUE0QkgsS0FBbEM7QUFFQSxRQUFNLENBQUNmLEtBQUQsRUFBT1ksUUFBUCxJQUFtQkwsa0JBQWtCLEVBQTNDO0FBQ0YsUUFBTTtBQUFDSixJQUFBQTtBQUFELE1BQVFILEtBQWQ7O0FBQ0UsTUFBSWlCLElBQUksSUFBSWQsS0FBSyxLQUFLYyxJQUF0QixFQUE0QjtBQUMxQixXQUFPRCxRQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUlFLEtBQUssSUFBSWYsS0FBSyxLQUFLZSxLQUFLLENBQUNDLElBQU4sQ0FBWUMsQ0FBRCxJQUFPQSxDQUFDLEtBQUtqQixLQUF4QixDQUF2QixFQUF1RDtBQUM1RCxXQUFPYSxRQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7QUFDTSxTQUFTSyxnQkFBVCxDQUEwQk4sS0FBMUIsRUFBaUM7QUFDdEMsUUFBTTtBQUFDTyxJQUFBQTtBQUFELE1BQVlQLEtBQWxCO0FBQ0EsUUFBTSxDQUFDZixLQUFELEVBQU9ZLFFBQVAsSUFBaUJXLENBQVUsQ0FBQ3hCLE9BQUQsRUFBU3VCLFNBQVQsQ0FBakM7QUFHRixRQUFNRSxLQUFLLEdBQUdDLEdBQU8sQ0FBQyxNQUFNLENBQUN6QixLQUFELEVBQVFZLFFBQVIsQ0FBUCxFQUEwQixDQUFDWixLQUFELENBQTFCLENBQXJCO0FBQ0UsU0FBTyxFQUFDLGVBQUQsQ0FBaUIsUUFBakI7QUFBMEIsSUFBQSxLQUFLLEVBQUV3QjtBQUFqQyxLQUE0Q1QsS0FBNUMsRUFBUDtBQUNEOztBQ3ZEYyxTQUFTVyxVQUFULENBQW9CWCxLQUFwQixFQUEyQjtBQUN4QyxRQUFNO0FBQUVDLElBQUFBLFFBQUY7QUFBWVcsSUFBQUE7QUFBWixNQUE4QlosS0FBcEM7QUFHQSxTQUNFLGVBQ0U7QUFBSSxJQUFBLEtBQUssRUFBRTtBQUFFYSxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkMsTUFBQUEsY0FBYyxFQUFFLFFBQW5DO0FBQTZDQyxNQUFBQSxPQUFPLEVBQUU7QUFBdEQ7QUFBWCxpQkFERixFQUlFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUYsTUFBQUEsT0FBTyxFQUFFO0FBQVg7QUFBWixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUcsTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFBWixLQUEwQkosYUFBMUIsQ0FERixFQUVFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUksTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFBWixLQUEyQmYsUUFBM0IsQ0FGRixDQUpGLENBREY7QUFXRDs7QUNqQkQsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUMvQixFQUFFLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDakMsRUFBRSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQzlCO0FBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUMxRDtBQUNBLEVBQUUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkUsRUFBRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7QUFDMUI7QUFDQSxFQUFFLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtBQUMxQixJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN6QixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRCxLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsS0FBSztBQUNMLEdBQUcsTUFBTTtBQUNULElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtBQUN4QixJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNuQyxHQUFHLE1BQU07QUFDVCxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BELEdBQUc7QUFDSDs7Ozs7QUN2Qk8sU0FBU2dCLElBQVQsQ0FBYztBQUFFaEIsRUFBQUEsUUFBRjtBQUFZaUIsRUFBQUE7QUFBWixDQUFkLEVBQWdDO0FBQ3JDLFNBQ0U7QUFDQSxtQkFBYUEsRUFEYjtBQUVFLElBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLFNBQVMsRUFBRSxZQUROO0FBRUxDLE1BQUFBLGVBQWUsRUFBRSxNQUZaO0FBSUxDLE1BQUFBLFVBQVUsRUFBRSxDQUpQO0FBS0xDLE1BQUFBLGFBQWEsRUFBRSxDQUxWO0FBTUxDLE1BQUFBLEtBQUssRUFBRTtBQU5GO0FBRlQsS0FXR3RCLFFBWEgsQ0FERjtBQWVEO0FBRU0sU0FBU3VCLFFBQVQsQ0FBa0I7QUFBRXZCLEVBQUFBLFFBQUY7QUFBWXdCLEVBQUFBLE9BQVo7QUFBcUJQLEVBQUFBO0FBQXJCLENBQWxCLEVBQTZDO0FBRWxELFNBQ0U7QUFDRSxJQUFBLEVBQUUsRUFBRUEsRUFETjtBQUVFLG1CQUFhQSxFQUZmO0FBR0UsSUFBQSxPQUFPLEVBQUVPLE9BSFg7QUFJRSxJQUFBLFNBQVMsRUFBQyxrQkFKWjtBQUtFLElBQUEsS0FBSyxFQUFFO0FBQ0xOLE1BQUFBLFNBQVMsRUFBRSxZQUROO0FBRUxPLE1BQUFBLFdBQVcsRUFBRSxFQUZSO0FBR0xDLE1BQUFBLFlBQVksRUFBRSxFQUhUO0FBSUxOLE1BQUFBLFVBQVUsRUFBRSxDQUpQO0FBS0xDLE1BQUFBLGFBQWEsRUFBRSxDQUxWO0FBTUxULE1BQUFBLE9BQU8sRUFBRTtBQU5KO0FBTFQsS0FjR1osUUFkSCxDQURGO0FBa0JEOztBQ3RDRCxNQUFNMkIsTUFBTSxHQUFHO0FBQ2JiLEVBQUFBLE9BQU8sRUFBRSxDQURJO0FBRWJjLEVBQUFBLFVBQVUsRUFBRSxFQUZDO0FBR2JDLEVBQUFBLFdBQVcsRUFBRSxFQUhBO0FBSWJDLEVBQUFBLFNBQVMsRUFBRSxDQUpFO0FBS2JDLEVBQUFBLFlBQVksRUFBRSxDQUxEO0FBTWJiLEVBQUFBLFNBQVMsRUFBRSxZQU5FO0FBT2JILEVBQUFBLElBQUksRUFBRTtBQVBPLENBQWY7QUFVTyxTQUFTaUIsU0FBVCxDQUFtQmpDLEtBQW5CLEVBQTBCO0FBQy9CLFFBQU07QUFBRWtCLElBQUFBLEVBQUY7QUFBTS9CLElBQUFBLElBQUksR0FBRyxNQUFiO0FBQW9CK0MsSUFBQUE7QUFBcEIsTUFBOEJsQyxLQUFwQztBQUNBLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFYSxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQlUsTUFBQUEsS0FBSyxFQUFFO0FBQTFCO0FBQVosS0FDRTtBQUFRLElBQUEsS0FBSyxFQUFFLEVBQUMsR0FBR0ssTUFBSjtBQUFXLFNBQUdNO0FBQWQ7QUFBZixLQUF5Q2xDLEtBQXpDO0FBQWdELG1CQUFha0IsRUFBN0Q7QUFBaUUsSUFBQSxJQUFJLEVBQUUvQjtBQUF2RSxLQURGLENBREY7QUFLRDs7QUNqQk0sU0FBU2dELE1BQVQsQ0FBZ0JuQyxLQUFoQixFQUF1QjtBQUM1QixRQUFNO0FBQUVvQyxJQUFBQSxLQUFGO0FBQVFGLElBQUFBLEtBQVI7QUFBY2hCLElBQUFBO0FBQWQsTUFBcUJsQixLQUEzQjtBQUNBLFNBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBQztBQUFsQixLQUE0QkEsS0FBNUIsR0FDR29DLEtBREgsQ0FERjtBQUtEOztBQ0RELE1BQU1GLEtBQUssR0FBRztBQUNaRyxFQUFBQSxjQUFjLEVBQUU7QUFDZHhCLElBQUFBLE9BQU8sRUFBRSxNQURLO0FBRWR5QixJQUFBQSxNQUFNLEVBQUU7QUFGTSxHQURKO0FBS1pDLEVBQUFBLEtBQUssRUFBRTtBQUNMeEIsSUFBQUEsT0FBTyxFQUFFLEVBREo7QUFFTEMsSUFBQUEsSUFBSSxFQUFFLENBRkQ7QUFHTHNCLElBQUFBLE1BQU0sRUFBRTtBQUhIO0FBTEssQ0FBZDtBQWFlLFNBQVNFLE9BQVQsQ0FBaUI7QUFDOUJDLEVBQUFBLFFBRDhCO0FBRTlCQyxFQUFBQSxRQUY4QjtBQUc5QkMsRUFBQUEsZUFIOEI7QUFJOUJDLEVBQUFBLE1BSjhCO0FBSzlCQyxFQUFBQSxRQUw4QjtBQU05QkMsRUFBQUEsYUFOOEI7QUFPOUJqRCxFQUFBQTtBQVA4QixDQUFqQixFQVFaO0FBQ0QsUUFBTTtBQUFDQyxJQUFBQTtBQUFELE1BQWFGLFdBQVcsRUFBOUI7O0FBQ0EsV0FBU21ELHNCQUFULENBQWdDNUUsQ0FBaEMsRUFBa0M7QUFDaEMsVUFBTStDLEVBQUUsR0FBRS9DLENBQUMsQ0FBQzZFLE1BQUYsQ0FBUzlCLEVBQW5CO0FBQ0F5QixJQUFBQSxlQUFlLENBQUN4RSxDQUFELENBQWY7QUFDQSxVQUFNOEUsT0FBTyxHQUFHUixRQUFRLENBQUNyQyxJQUFULENBQWN4QixDQUFDLElBQUdBLENBQUMsQ0FBQ2lFLFFBQUYsS0FBYTNCLEVBQS9CLENBQWhCO0FBRUFwQixJQUFBQSxVQUFVLENBQUM7QUFBQ1QsTUFBQUEsWUFBWSxFQUFFLElBQUc0RCxPQUFPLENBQUNoRSxLQUFNLEVBQWhDO0FBQWtDRyxNQUFBQSxLQUFLLEVBQUM7QUFBeEMsS0FBRCxDQUFWO0FBQ0Q7O0FBQ0QsU0FFRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUdpQyxNQUFBQSxVQUFVLEVBQUM7QUFBZDtBQUFaLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRWEsS0FBSyxDQUFDRztBQUFsQixLQUNFLEVBQUMsU0FBRDtBQUNFLElBQUEsS0FBSyxFQUFFTyxNQURUO0FBRUUsSUFBQSxFQUFFLEVBQUMsY0FGTDtBQUdFLElBQUEsSUFBSSxFQUFDLFFBSFA7QUFJRSxJQUFBLFFBQVEsRUFBRUYsUUFKWjtBQUtFLElBQUEsS0FBSyxFQUFFUixLQUFLLENBQUNLO0FBTGYsSUFERixFQVFFLEVBQUMsTUFBRDtBQUNFLG1CQUFZLFlBRGQ7QUFFRSxJQUFBLFFBQVEsRUFBRSxDQUFDSyxNQUZiO0FBR0UsSUFBQSxLQUFLLEVBQUMsUUFIUjtBQUlFLElBQUEsT0FBTyxFQUFFRTtBQUpYLElBUkYsQ0FERixFQWlCRSxFQUFDLElBQUQ7QUFBTSxJQUFBLEVBQUUsRUFBQztBQUFULEtBQ0dMLFFBQVEsSUFDUEEsUUFBUSxDQUFDUyxNQUFULEdBQWtCLENBRG5CLElBRUNULFFBQVEsQ0FBQ1UsR0FBVCxDQUFjdkUsQ0FBRCxJQUFPO0FBQ2xCLFdBQ0UsRUFBQyxRQUFEO0FBQVUsTUFBQSxFQUFFLEVBQUVBLENBQUMsQ0FBQ2lFLFFBQWhCO0FBQTBCLE1BQUEsT0FBTyxFQUFFRTtBQUFuQyxPQUNHbkUsQ0FBQyxDQUFDaUUsUUFETCxDQURGO0FBS0QsR0FORCxDQUhKLENBakJGLENBRkY7QUFpQ0Q7O0FDdEVELE1BQU1qQixRQUFNLEdBQUc7QUFDYndCLEVBQUFBLElBQUksRUFBRTtBQUNKaEMsSUFBQUEsZUFBZSxFQUFFLFNBRGI7QUFFSmlDLElBQUFBLE1BQU0sRUFBRTtBQUZKO0FBRE8sQ0FBZjtBQU1PLFNBQVNDLE1BQVQsQ0FBZ0I7QUFBRXJELEVBQUFBLFFBQUY7QUFBWWlDLEVBQUFBLEtBQVo7QUFBbUJoQixFQUFBQTtBQUFuQixDQUFoQixFQUF5QztBQUM5QyxTQUFPO0FBQUssbUJBQWFBLEVBQWxCO0FBQXNCLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBR1UsUUFBTSxDQUFDd0IsSUFBWjtBQUFrQixTQUFHbEI7QUFBckI7QUFBN0IsS0FBNERqQyxRQUE1RCxDQUFQO0FBQ0Q7O0FDTEQsTUFBTWlDLE9BQUssR0FBRztBQUNacUIsRUFBQUEsUUFBUSxFQUFFO0FBQUV6QixJQUFBQSxXQUFXLEVBQUU7QUFBZixHQURFO0FBRVowQixFQUFBQSxZQUFZLEVBQUU7QUFDWjNDLElBQUFBLE9BQU8sRUFBRSxNQURHO0FBRVo0QyxJQUFBQSxVQUFVLEVBQUUsUUFGQTtBQUdaMUMsSUFBQUEsT0FBTyxFQUFFO0FBSEcsR0FGRjtBQU9aMkMsRUFBQUEsTUFBTSxFQUFFO0FBQ043QyxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVOOEMsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTk4sSUFBQUEsTUFBTSxFQUFFLE1BSEY7QUFJTnZDLElBQUFBLGNBQWMsRUFBRSxlQUpWO0FBS05LLElBQUFBLFNBQVMsRUFBRSxZQUxMO0FBTU5FLElBQUFBLFVBQVUsRUFBQztBQU5MLEdBUEk7QUFlWnVDLEVBQUFBLEdBQUcsRUFBRTtBQUNINUMsSUFBQUEsSUFBSSxFQUFFLENBREg7QUFFSGMsSUFBQUEsV0FBVyxFQUFFO0FBRlY7QUFmTyxDQUFkO0FBcUJlLFNBQVMrQixLQUFULENBQWU7QUFBRUMsRUFBQUEsUUFBRjtBQUFZQyxFQUFBQSxPQUFaO0FBQXFCQyxFQUFBQTtBQUFyQixDQUFmLEVBQWdEO0FBQzdELFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUU5QixPQUFLLENBQUN3QjtBQUFyQixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUV4QixPQUFLLENBQUNzQjtBQUFsQixLQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsVUFBWjtBQUF1QixJQUFBLEtBQUssRUFBRXRCLE9BQUssQ0FBQ3FCLFFBQXBDO0FBQThDLElBQUEsUUFBUSxFQUFFUztBQUF4RCxJQURGLEVBRUUsMEJBRkYsQ0FERixFQUtFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRW5ELE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CRSxNQUFBQSxPQUFPLEVBQUU7QUFBNUI7QUFBWixLQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFDLFFBQWQ7QUFBdUIsSUFBQSxLQUFLLEVBQUVtQixPQUFLLENBQUMwQixHQUFwQztBQUF5QyxJQUFBLE9BQU8sRUFBRUU7QUFBbEQsSUFERixFQUVFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFDLE9BQWQ7QUFBc0IsSUFBQSxLQUFLLEVBQUU1QixPQUFLLENBQUMwQixHQUFuQztBQUF3QyxJQUFBLEVBQUUsRUFBQyxPQUEzQztBQUFtRCxJQUFBLE9BQU8sRUFBRUcsT0FBNUQ7QUFBcUUsbUJBQVk7QUFBakYsSUFGRixDQUxGLENBREY7QUFZRDs7QUNyQ00sU0FBU0YsT0FBVCxDQUFlO0FBQ3BCUixFQUFBQSxNQUFNLEdBQUcsRUFEVztBQUVwQjlCLEVBQUFBLEtBQUssR0FBRyxFQUZZO0FBR3BCMEMsRUFBQUEsSUFBSSxHQUFHLE1BSGE7QUFJcEJDLEVBQUFBLEtBQUssR0FBRyxPQUpZO0FBS3BCekMsRUFBQUEsT0FMb0I7QUFNcEJQLEVBQUFBO0FBTm9CLENBQWYsRUFPSjtBQUNELFNBQ0U7QUFDRSxJQUFBLE1BQU0sRUFBRW1DLE1BRFY7QUFFRSxJQUFBLE9BQU8sRUFBQyxXQUZWO0FBR0UsSUFBQSxLQUFLLEVBQUU5QixLQUhUO0FBSUUsSUFBQSxPQUFPLEVBQUVFLE9BSlg7QUFLRSxJQUFBLEVBQUUsRUFBRVA7QUFMTixLQU9FO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRStDLElBQTlCO0FBQW9DLElBQUEsRUFBRSxFQUFFL0M7QUFBeEMsSUFQRixFQVFFO0FBQ0UsSUFBQSxFQUFFLEVBQUVBLEVBRE47QUFFRSxJQUFBLElBQUksRUFBRWdELEtBRlI7QUFHRSxJQUFBLENBQUMsRUFBQztBQUhKLElBUkYsQ0FERjtBQWdCRDs7QUN4Qk0sU0FBU0MsTUFBVCxDQUFnQjtBQUFFbEUsRUFBQUEsUUFBRjtBQUFZaUMsRUFBQUE7QUFBWixDQUFoQixFQUFxQztBQUMxQyxTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTHJCLE1BQUFBLE9BQU8sRUFBRSxNQURKO0FBRUxDLE1BQUFBLGNBQWMsRUFBRSxRQUZYO0FBR0xzRCxNQUFBQSxTQUFTLEVBQUUsUUFITjtBQUlMLFNBQUdsQztBQUpFO0FBRFQsS0FRR2pDLFFBUkgsQ0FERjtBQVlEOztBQ1JELE1BQU1pQyxPQUFLLEdBQUc7QUFDWndCLEVBQUFBLE1BQU0sRUFBRTtBQUNON0MsSUFBQUEsT0FBTyxFQUFFLE1BREg7QUFFTjhDLElBQUFBLGFBQWEsRUFBRSxRQUZUO0FBR05OLElBQUFBLE1BQU0sRUFBRSxNQUhGO0FBSU52QyxJQUFBQSxjQUFjLEVBQUUsZUFKVjtBQUtOSyxJQUFBQSxTQUFTLEVBQUUsWUFMTDtBQU1ORSxJQUFBQSxVQUFVLEVBQUM7QUFOTCxHQURJO0FBU1p1QyxFQUFBQSxHQUFHLEVBQUU7QUFDSDVDLElBQUFBLElBQUksRUFBRSxDQURIO0FBRUhjLElBQUFBLFdBQVcsRUFBRTtBQUZWO0FBVE8sQ0FBZDtBQWVlLFNBQVN1QyxPQUFULENBQWlCO0FBQUVwQixFQUFBQSxPQUFGO0FBQVdxQixFQUFBQSxTQUFYO0FBQXNCQyxFQUFBQTtBQUF0QixDQUFqQixFQUFrRDtBQUMvRCxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFFckMsT0FBSyxDQUFDd0IsTUFBckI7QUFBNkIsSUFBQSxFQUFFLEVBQUM7QUFBaEMsS0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRTtBQUFFQyxNQUFBQSxhQUFhLEVBQUUsUUFBakI7QUFBMkJGLE1BQUFBLFVBQVUsRUFBRTtBQUF2QztBQUFmLEtBQ0UsRUFBQ0ksT0FBRDtBQUFPLElBQUEsS0FBSyxFQUFDLElBQWI7QUFBa0IsSUFBQSxNQUFNLEVBQUMsSUFBekI7QUFBOEIsSUFBQSxLQUFLLEVBQUM7QUFBcEMsSUFERixFQUVFLGFBQUlaLE9BQU8sSUFBSUEsT0FBTyxDQUFDSixRQUF2QixDQUZGLGdCQURGLEVBTUU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFaEMsTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJFLE1BQUFBLE9BQU8sRUFBRTtBQUE1QjtBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsT0FBZDtBQUFzQixJQUFBLEtBQUssRUFBRW1CLE9BQUssQ0FBQzBCLEdBQW5DO0FBQXdDLElBQUEsT0FBTyxFQUFFVztBQUFqRCxJQURGLEVBRUUsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUMsU0FBWDtBQUFxQixJQUFBLEtBQUssRUFBQyxTQUEzQjtBQUFxQyxJQUFBLEtBQUssRUFBRXJDLE9BQUssQ0FBQzBCLEdBQWxEO0FBQXVELElBQUEsT0FBTyxFQUFFVSxTQUFoRTtBQUEyRSxtQkFBWTtBQUF2RixJQUZGLENBTkYsQ0FERjtBQWFEOztBQ2xDTSxTQUFTRSxNQUFULENBQWdCO0FBQ3JCbkIsRUFBQUEsTUFBTSxHQUFHLEVBRFk7QUFFckI5QixFQUFBQSxLQUFLLEdBQUcsRUFGYTtBQUdyQjJDLEVBQUFBLEtBQUssR0FBRyxPQUhhO0FBSXJCRCxFQUFBQSxJQUFJLEdBQUc7QUFKYyxDQUFoQixFQUtKO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFWixNQUFiO0FBQXFCLElBQUEsT0FBTyxFQUFDLFdBQTdCO0FBQXlDLElBQUEsS0FBSyxFQUFFOUI7QUFBaEQsS0FDRTtBQUNFLElBQUEsSUFBSSxFQUFFMkMsS0FEUjtBQUVFLElBQUEsQ0FBQyxFQUFDO0FBRkosSUFERixFQUtFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRUQ7QUFBOUIsSUFMRixDQURGO0FBU0Q7O0FDZE0sU0FBU1EsT0FBVCxDQUFpQjtBQUN0QnBCLEVBQUFBLE1BQU0sR0FBRyxFQURhO0FBRXRCOUIsRUFBQUEsS0FBSyxHQUFHLEVBRmM7QUFHdEIyQyxFQUFBQSxLQUFLLEdBQUcsT0FIYztBQUl0QkQsRUFBQUEsSUFBSSxHQUFHO0FBSmUsQ0FBakIsRUFLSjtBQUNELFNBQ0U7QUFBSyxJQUFBLE1BQU0sRUFBRSxFQUFiO0FBQWlCLElBQUEsT0FBTyxFQUFDLFdBQXpCO0FBQXFDLElBQUEsS0FBSyxFQUFFMUM7QUFBNUMsS0FDRTtBQUNFLElBQUEsSUFBSSxFQUFFMkMsS0FEUjtBQUVFLElBQUEsQ0FBQyxFQUFDO0FBRkosSUFERixFQUtFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRUQ7QUFBOUIsSUFMRixDQURGO0FBU0Q7O0FDWEQsTUFBTS9CLE9BQUssR0FBRztBQUNad0MsRUFBQUEsT0FBTyxFQUFFO0FBQUU3RCxJQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQjRDLElBQUFBLFVBQVUsRUFBRSxRQUEvQjtBQUF5Q2tCLElBQUFBLE1BQU0sRUFBRTtBQUFqRCxHQURHO0FBRVpmLEVBQUFBLEdBQUcsRUFBRTtBQUFFOUIsSUFBQUEsV0FBVyxFQUFFO0FBQWYsR0FGTztBQUdaOEMsRUFBQUEsWUFBWSxFQUFFO0FBQ1ovRCxJQUFBQSxPQUFPLEVBQUUsTUFERztBQUVaOEMsSUFBQUEsYUFBYSxFQUFFO0FBRkgsR0FIRjtBQU9aRCxFQUFBQSxNQUFNLEVBQUU7QUFDTjdDLElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU44QyxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdON0MsSUFBQUEsY0FBYyxFQUFFLGVBSFY7QUFJTnVDLElBQUFBLE1BQU0sRUFBRTtBQUpGLEdBUEk7QUFhWndCLEVBQUFBLEtBQUssRUFBRTtBQUNMRixJQUFBQSxNQUFNLEVBQUUsQ0FESDtBQUVMOUQsSUFBQUEsT0FBTyxFQUFFLE1BRko7QUFHTEMsSUFBQUEsY0FBYyxFQUFFO0FBSFg7QUFiSyxDQUFkO0FBb0JlLFNBQVNnRSxTQUFULENBQW1CO0FBQ2hDZixFQUFBQSxPQURnQztBQUVoQ2dCLEVBQUFBLFFBRmdDO0FBR2hDQyxFQUFBQSxTQUhnQztBQUloQ0MsRUFBQUEsY0FKZ0M7QUFLaENDLEVBQUFBLHFCQUxnQztBQU1oQ0MsRUFBQUEsWUFOZ0M7QUFPaENDLEVBQUFBO0FBUGdDLENBQW5CLEVBUVo7QUFDRCxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFFbEQsT0FBSyxDQUFDd0I7QUFBckIsS0FDRSxlQUNFLEVBQUMsUUFBRDtBQUFVLElBQUEsS0FBSyxFQUFDLGVBQWhCO0FBQWdDLElBQUEsUUFBUSxFQUFFdUI7QUFBMUMsSUFERixFQUVFLEVBQUMsUUFBRDtBQUNFLElBQUEsS0FBSyxFQUFDLHNCQURSO0FBRUUsSUFBQSxRQUFRLEVBQUVDO0FBRlosSUFGRixDQURGLEVBUUUsYUFSRixFQVNFO0FBQUssSUFBQSxLQUFLLEVBQUVoRCxPQUFLLENBQUMwQztBQUFsQixLQUNFLEVBQUMsVUFBRDtBQUFZLElBQUEsS0FBSyxFQUFDLFNBQWxCO0FBQTRCLElBQUEsSUFBSSxFQUFFSCxPQUFsQztBQUEyQyxJQUFBLE9BQU8sRUFBRU87QUFBcEQsSUFERixFQUVFLEVBQUMsVUFBRDtBQUFZLElBQUEsS0FBSyxFQUFDLFFBQWxCO0FBQTJCLElBQUEsSUFBSSxFQUFFUixNQUFqQztBQUF5QyxJQUFBLE9BQU8sRUFBRU87QUFBbEQsSUFGRixFQUdFLEVBQUMsVUFBRDtBQUFZLElBQUEsRUFBRSxFQUFDLE9BQWY7QUFBdUIsSUFBQSxLQUFLLEVBQUMsT0FBN0I7QUFBcUMsSUFBQSxJQUFJLEVBQUVsQixPQUEzQztBQUFrRCxJQUFBLE9BQU8sRUFBRXNCO0FBQTNELElBSEYsQ0FURixFQWNFO0FBQUssSUFBQSxLQUFLLEVBQUVqRCxPQUFLLENBQUMyQztBQUFsQixLQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsT0FBTyxFQUFFTztBQUFqQixVQURGLENBZEYsQ0FERjtBQW9CRDs7QUFFRCxTQUFTQyxVQUFULENBQW9CO0FBQUVDLEVBQUFBLElBQUY7QUFBUWxELEVBQUFBLEtBQVI7QUFBZVgsRUFBQUEsT0FBZjtBQUF1QlAsRUFBQUE7QUFBdkIsQ0FBcEIsRUFBaUQ7QUFDL0MsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFZ0IsT0FBSyxDQUFDd0M7QUFBbEIsS0FDRTtBQUFRLElBQUEsRUFBRSxFQUFFeEQsRUFBWjtBQUFnQixJQUFBLEtBQUssRUFBRWdCLE9BQUssQ0FBQzBCLEdBQTdCO0FBQWtDLElBQUEsT0FBTyxFQUFFbkMsT0FBM0M7QUFBb0QsbUJBQWMsR0FBRVAsRUFBRztBQUF2RSxLQUNFLEVBQUMsSUFBRDtBQUFNLElBQUEsRUFBRSxFQUFFQTtBQUFWLElBREYsQ0FERixFQUlFLGVBQU1rQixLQUFOLENBSkYsQ0FERjtBQVFEOztBQUVELFNBQVNtRCxRQUFULENBQWtCO0FBQUVDLEVBQUFBLEtBQUY7QUFBU0MsRUFBQUE7QUFBVCxDQUFsQixFQUF1QztBQUNyQyxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRWQsTUFBQUEsTUFBTSxFQUFFLENBQVY7QUFBYTVDLE1BQUFBLFNBQVMsRUFBRTtBQUF4QjtBQUFaLEtBQ0U7QUFBTyxJQUFBLElBQUksRUFBQyxVQUFaO0FBQXVCLElBQUEsUUFBUSxFQUFFMEQ7QUFBakMsSUFERixFQUVFLGlCQUFRRCxLQUFSLENBRkYsQ0FERjtBQU1EOztBQzFFYyxTQUFTRSxhQUFULENBQXVCO0FBQ3BDckMsRUFBQUEsTUFBTSxHQUFHLEVBRDJCO0FBRXBDOUIsRUFBQUEsS0FBSyxHQUFHLEVBRjRCO0FBR3BDMkMsRUFBQUEsS0FBSyxHQUFHLE9BSDRCO0FBSXBDRCxFQUFBQSxJQUFJLEdBQUcsT0FKNkI7QUFLcEMvQixFQUFBQTtBQUxvQyxDQUF2QixFQU1aO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFbUIsTUFBYjtBQUFxQixJQUFBLE9BQU8sRUFBQyxXQUE3QjtBQUF5QyxJQUFBLEtBQUssRUFBRTlCLEtBQWhEO0FBQXVELElBQUEsS0FBSyxFQUFFVztBQUE5RCxLQUNFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRStCO0FBQTlCLElBREYsRUFFRTtBQUNFLElBQUEsSUFBSSxFQUFFQyxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQUZGLENBREY7QUFTRDs7QUNYRCxNQUFNaEMsT0FBSyxHQUFHO0FBQ1p3QixFQUFBQSxNQUFNLEVBQUU7QUFDTjdDLElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU44QyxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdON0MsSUFBQUEsY0FBYyxFQUFFO0FBSFY7QUFESSxDQUFkO0FBUWUsU0FBUzZFLE1BQVQsQ0FBZ0I7QUFBRTFDLEVBQUFBLE9BQUY7QUFBVzJDLEVBQUFBLFFBQVg7QUFBcUJDLEVBQUFBLGFBQXJCO0FBQW1DQyxFQUFBQSxXQUFuQztBQUFnRHJGLEVBQUFBO0FBQWhELENBQWhCLEVBQXlFO0FBQ3RGLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUV5QixPQUFLLENBQUN3QixNQUFyQjtBQUE0QixJQUFBLEVBQUUsRUFBQztBQUEvQixLQUNFLEVBQUMsTUFBRCxRQUNFLEVBQUNxQyxhQUFEO0FBQVcsSUFBQSxLQUFLLEVBQUM7QUFBakIsSUFERixDQURGLEVBSUUsRUFBQyxNQUFELG9DQUMwQixhQUFJOUMsT0FBTyxJQUFJQSxPQUFPLENBQUMrQyxLQUF2QixDQUQxQixDQUpGLEVBT0UsRUFBQyxTQUFEO0FBQVcsSUFBQSxFQUFFLEVBQUMsa0JBQWQ7QUFBaUMsSUFBQSxRQUFRLEVBQUVILGFBQTNDO0FBQTBELElBQUEsS0FBSyxFQUFFQztBQUFqRSxJQVBGLEVBUUUsRUFBQyxNQUFELFFBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsYUFBZDtBQUE0QixJQUFBLEVBQUUsRUFBQyxRQUEvQjtBQUF3QyxJQUFBLE9BQU8sRUFBRUYsUUFBakQ7QUFBMkQsbUJBQVk7QUFBdkUsSUFERixDQVJGLENBREY7QUFjRDs7QUMzQk0sU0FBU0ssSUFBVCxDQUFjO0FBQ25CNUMsRUFBQUEsTUFBTSxHQUFHLEVBRFU7QUFFbkI5QixFQUFBQSxLQUFLLEdBQUcsRUFGVztBQUduQjBDLEVBQUFBLElBQUksR0FBRyxNQUhZO0FBSW5CQyxFQUFBQSxLQUFLLEdBQUcsT0FKVztBQUtuQmhDLEVBQUFBO0FBTG1CLENBQWQsRUFNSjtBQUNELFNBQ0U7QUFBSyxJQUFBLE1BQU0sRUFBRW1CLE1BQWI7QUFBcUIsSUFBQSxPQUFPLEVBQUMsV0FBN0I7QUFBeUMsSUFBQSxLQUFLLEVBQUU5QixLQUFoRDtBQUF1RCxJQUFBLEtBQUssRUFBRVc7QUFBOUQsS0FDRTtBQUFNLElBQUEsQ0FBQyxFQUFDLGVBQVI7QUFBd0IsSUFBQSxJQUFJLEVBQUUrQjtBQUE5QixJQURGLEVBRUU7QUFDRSxJQUFBLElBQUksRUFBRUMsS0FEUjtBQUVFLElBQUEsQ0FBQyxFQUFDO0FBRkosSUFGRixDQURGO0FBU0Q7O0FDYkQsTUFBTWhDLE9BQUssR0FBRztBQUNad0IsRUFBQUEsTUFBTSxFQUFFO0FBQ043QyxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVOOEMsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTjdDLElBQUFBLGNBQWMsRUFBRTtBQUhWO0FBREksQ0FBZDtBQU9lLFNBQVNvRixPQUFULENBQWlCO0FBQUVqRCxFQUFBQTtBQUFGLENBQWpCLEVBQThCO0FBQzNDLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVmLE9BQUssQ0FBQ3dCLE1BQXJCO0FBQTZCLElBQUEsRUFBRSxFQUFDO0FBQWhDLEtBQ0UsRUFBQyxNQUFELFFBQ0UsRUFBQyxJQUFEO0FBQU0sSUFBQSxLQUFLLEVBQUMsSUFBWjtBQUFpQixJQUFBLE1BQU0sRUFBQyxJQUF4QjtBQUE2QixJQUFBLEtBQUssRUFBQztBQUFuQyxJQURGLENBREYsRUFJRSxFQUFDLE1BQUQsUUFDRSwrQ0FDZ0MsYUFBSVQsT0FBTyxJQUFJQSxPQUFPLENBQUMrQyxLQUF2QixDQURoQywyQ0FERixDQUpGLENBREY7QUFhRDs7QUN4QkQsTUFBTTlELE9BQUssR0FBRztBQUNaa0IsRUFBQUEsSUFBSSxFQUFFO0FBQ0orQyxJQUFBQSxXQUFXLEVBQUUsU0FEVDtBQUVKQyxJQUFBQSxXQUFXLEVBQUUsT0FGVDtBQUdKQyxJQUFBQSxXQUFXLEVBQUUsQ0FIVDtBQUlKQyxJQUFBQSxZQUFZLEVBQUUsQ0FKVjtBQUtKdkYsSUFBQUEsT0FBTyxFQUFFLENBTEw7QUFNSkYsSUFBQUEsT0FBTyxFQUFFLE1BTkw7QUFPSjhDLElBQUFBLGFBQWEsRUFBRSxRQVBYO0FBUUo3QyxJQUFBQSxjQUFjLEVBQUUsZUFSWjtBQVNKeUYsSUFBQUEsU0FBUyxFQUFFLEVBVFA7QUFVSm5GLElBQUFBLGVBQWUsRUFBRTtBQVZiLEdBRE07QUFhWnlCLEVBQUFBLFFBQVEsRUFBRTtBQUFFZixJQUFBQSxXQUFXLEVBQUU7QUFBZixHQWJFO0FBY1owRSxFQUFBQSxHQUFHLEVBQUU7QUFDSDNGLElBQUFBLE9BQU8sRUFBRSxNQUROO0FBRUhxRCxJQUFBQSxLQUFLLEVBQUUsU0FGSjtBQUdIdUMsSUFBQUEsUUFBUSxFQUFFO0FBSFA7QUFkTyxDQUFkO0FBcUJPLFNBQVNDLE9BQVQsQ0FBaUIxRyxLQUFqQixFQUF3QjtBQUM3QixRQUFNO0FBQUUyRyxJQUFBQTtBQUFGLE1BQWMzRyxLQUFwQjtBQUNBLFFBQU07QUFBRTRHLElBQUFBLEtBQUY7QUFBUy9ELElBQUFBO0FBQVQsTUFBc0I4RCxPQUE1QjtBQUNBLFFBQU0sQ0FBQ0UsSUFBRCxFQUFPQyxPQUFQLElBQWtCQyxHQUFRLENBQUMsQ0FBRCxDQUFoQztBQUNBLFFBQU0sQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLElBQW9CRixHQUFRLENBQUMsQ0FBRCxDQUFsQztBQUNBLFFBQU0sQ0FBQ0csT0FBRCxFQUFVQyxVQUFWLElBQXdCSixHQUFRLENBQUMsQ0FBRCxDQUF0QztBQUNBLFFBQU0sQ0FBQ0ssT0FBRCxFQUFVQyxVQUFWLElBQXdCTixHQUFRLENBQUMsQ0FBRCxDQUF0Qzs7QUFFQSxXQUFTTyxTQUFULENBQW1CQyxFQUFuQixFQUF1QjtBQUNyQixRQUFJL0ksQ0FBSixFQUFPQyxDQUFQLEVBQVVILENBQVYsRUFBYWtKLENBQWI7QUFDQUEsSUFBQUEsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0gsRUFBRSxHQUFHLElBQWhCLENBQUo7QUFDQWpKLElBQUFBLENBQUMsR0FBR21KLElBQUksQ0FBQ0MsS0FBTCxDQUFXRixDQUFDLEdBQUcsRUFBZixDQUFKO0FBQ0FBLElBQUFBLENBQUMsR0FBR0EsQ0FBQyxHQUFHLEVBQVI7QUFDQS9JLElBQUFBLENBQUMsR0FBR2dKLElBQUksQ0FBQ0MsS0FBTCxDQUFXcEosQ0FBQyxHQUFHLEVBQWYsQ0FBSjtBQUNBQSxJQUFBQSxDQUFDLEdBQUdBLENBQUMsR0FBRyxFQUFSO0FBQ0FFLElBQUFBLENBQUMsR0FBR2lKLElBQUksQ0FBQ0MsS0FBTCxDQUFXakosQ0FBQyxHQUFHLEVBQWYsQ0FBSjtBQUNBQSxJQUFBQSxDQUFDLEdBQUdBLENBQUMsR0FBRyxFQUFSO0FBQ0FxSSxJQUFBQSxPQUFPLENBQUN0SSxDQUFELENBQVA7QUFDQXlJLElBQUFBLFFBQVEsQ0FBQ3hJLENBQUQsQ0FBUjtBQUNBMEksSUFBQUEsVUFBVSxDQUFDN0ksQ0FBRCxDQUFWO0FBQ0ErSSxJQUFBQSxVQUFVLENBQUNHLENBQUQsQ0FBVjtBQUNEOztBQUNERyxFQUFBQSxDQUFTLENBQUMsTUFBTTtBQUNkQyxJQUFBQSxVQUFVLENBQUMsTUFBTTtBQUNmTixNQUFBQSxTQUFTLENBQUNPLElBQUksQ0FBQ0MsR0FBTCxLQUFhbkIsT0FBTyxDQUFDb0IsU0FBdEIsQ0FBVDtBQUNELEtBRlMsRUFFUCxDQUZPLENBQVY7QUFHQUMsSUFBQUEsV0FBVyxDQUFDLE1BQU07QUFDaEJWLE1BQUFBLFNBQVMsQ0FBQ08sSUFBSSxDQUFDQyxHQUFMLEtBQWFuQixPQUFPLENBQUNvQixTQUF0QixDQUFUO0FBQ0QsS0FGVSxFQUVSLEtBRlEsQ0FBWDtBQUdELEdBUFEsRUFPTixFQVBNLENBQVQ7QUFTQSxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRXhHLE1BQUFBLEtBQUssRUFBRSxNQUFUO0FBQWdCUyxNQUFBQSxZQUFZLEVBQUM7QUFBN0I7QUFBWixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHRSxPQUFLLENBQUNrQixJQUFYO0FBQWlCd0QsTUFBQUE7QUFBakI7QUFBWixLQUNFO0FBQUssbUJBQVksU0FBakI7QUFBMkIsSUFBQSxLQUFLLEVBQUUxRSxPQUFLLENBQUN5RTtBQUF4QyxLQUFrREEsT0FBTyxJQUFJQSxPQUFPLENBQUNzQixJQUFyRSxDQURGLEVBRUU7QUFBSyxJQUFBLEtBQUssRUFBRS9GLE9BQUssQ0FBQ3NFO0FBQWxCLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRXRFLE9BQUssQ0FBQ1c7QUFBbEIsS0FBNkJBLFFBQVEsSUFBSUEsUUFBekMsTUFERixFQUVFLGVBQ0dxRSxPQUFPLEtBQUssQ0FBWixJQUFpQixxQkFEcEIsRUFFR0YsS0FBSyxLQUFLLENBQVYsSUFBZUUsT0FBTyxHQUFHLENBQXpCLElBQThCLGVBQU1BLE9BQU4sa0JBRmpDLEVBR0dGLEtBQUssR0FBRyxDQUFSLElBQWFILElBQUksS0FBSyxDQUF0QixJQUNDLGVBQ0dHLEtBREgsYUFDaUJFLE9BRGpCLGtCQUNzQyxHQUR0QyxDQUpKLEVBUUdMLElBQUksSUFBSSxFQUFSLElBQWNBLElBQUksR0FBRyxDQUFyQixJQUEwQixlQUFNQSxJQUFOLGNBUjdCLEVBU0dBLElBQUksR0FBRyxFQUFQLElBQWEsSUFBSWdCLElBQUosQ0FBU2xCLE9BQU8sQ0FBQ29CLFNBQWpCLENBVGhCLENBRkYsQ0FGRixDQURGLENBREY7QUFxQkQ7O0FDdEVELE1BQU03RixPQUFLLEdBQUc7QUFDWmtCLEVBQUFBLElBQUksRUFBRTtBQUNKdkMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSjhDLElBQUFBLGFBQWEsRUFBRSxRQUZYO0FBR0pwQyxJQUFBQSxLQUFLLEVBQUUsTUFISDtBQUlKOEIsSUFBQUEsTUFBTSxFQUFFLE1BSko7QUFLSmhDLElBQUFBLFVBQVUsRUFBRSxFQUxSO0FBTUpGLElBQUFBLFNBQVMsRUFBRSxZQU5QO0FBT0pMLElBQUFBLGNBQWMsRUFBRSxlQVBaO0FBUUpRLElBQUFBLGFBQWEsRUFBQztBQVJWO0FBRE0sQ0FBZDtBQWNlLFNBQVM0RyxPQUFULENBQWlCO0FBQUVqRixFQUFBQSxPQUFGO0FBQVdrRixFQUFBQSxRQUFYO0FBQXFCQyxFQUFBQTtBQUFyQixDQUFqQixFQUFtRDtBQUVoRSxTQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsRUFBRSxFQUFDO0FBQVgsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFbEcsT0FBSyxDQUFDa0I7QUFBbEIsS0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUV2QixNQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQmhCLE1BQUFBLE9BQU8sRUFBQztBQUF6QjtBQUFaLEtBQ0dvQyxPQUFPLElBQUlBLE9BQU8sQ0FBQzBELE9BQW5CLElBQ0MsRUFBQyxPQUFEO0FBQ0UsSUFBQSxPQUFPLEVBQ0wxRCxPQUFPLElBQ1BBLE9BQU8sQ0FBQzBELE9BRFIsSUFDbUIsRUFDakIsR0FBRzFELE9BQU8sQ0FBQzBELE9BRE07QUFFakI5RCxNQUFBQSxRQUFRLEVBQUVJLE9BQU8sQ0FBQ0osUUFGRDtBQUVVK0QsTUFBQUEsS0FBSyxFQUFDO0FBRmhCO0FBSHZCLElBRkosQ0FERixFQWVFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRS9GLE1BQUFBLE9BQU8sRUFBRSxNQUFYO0FBQWtCYSxNQUFBQSxXQUFXLEVBQUMsQ0FBOUI7QUFBZ0NDLE1BQUFBLFlBQVksRUFBQztBQUE3QztBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsU0FETDtBQUVFLElBQUEsT0FBTyxFQUFFeUcsU0FGWDtBQUdFLG1CQUFZLGFBSGQ7QUFJRSxJQUFBLEtBQUssRUFBQyxTQUpSO0FBS0UsSUFBQSxLQUFLLEVBQUU7QUFBRXBILE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdjLE1BQUFBLFdBQVcsRUFBRSxDQUF4QjtBQUEyQm9DLE1BQUFBLEtBQUssRUFBRTtBQUFsQztBQUxULElBREYsRUFRRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLEVBQUUsRUFBQyxRQURMO0FBRUUsSUFBQSxPQUFPLEVBQUVpRSxRQUZYO0FBR0UsbUJBQVksWUFIZDtBQUlFLElBQUEsS0FBSyxFQUFDLFFBSlI7QUFLRSxJQUFBLEtBQUssRUFBRTtBQUFFbkgsTUFBQUEsSUFBSSxFQUFFLENBQVI7QUFBV2EsTUFBQUEsVUFBVSxFQUFFLENBQXZCO0FBQTBCcUMsTUFBQUEsS0FBSyxFQUFFO0FBQWpDO0FBTFQsSUFSRixDQWZGLENBREYsQ0FERjtBQW9DRDs7QUN0REQsTUFBTXRDLFFBQU0sR0FBRztBQUNid0IsRUFBQUEsSUFBSSxFQUFFO0FBQ0p2QyxJQUFBQSxPQUFPLEVBQUUsTUFETDtBQUVKNEMsSUFBQUEsVUFBVSxFQUFFO0FBRlIsR0FETztBQUtibEIsRUFBQUEsS0FBSyxFQUFFO0FBQ0w7QUFDQXhCLElBQUFBLE9BQU8sRUFBRSxDQUZKO0FBR0xjLElBQUFBLFVBQVUsRUFBRSxDQUhQO0FBSUxDLElBQUFBLFdBQVcsRUFBRSxDQUpSO0FBS0xDLElBQUFBLFNBQVMsRUFBRSxDQUxOO0FBTUxDLElBQUFBLFlBQVksRUFBRSxDQU5UO0FBT0xiLElBQUFBLFNBQVMsRUFBRSxZQVBOO0FBUUxILElBQUFBLElBQUksRUFBRTtBQVJELEdBTE07QUFnQmI0QyxFQUFBQSxHQUFHLEVBQUM7QUFDRjdDLElBQUFBLE9BQU8sRUFBRSxDQURQO0FBR0ZlLElBQUFBLFdBQVcsRUFBRSxFQUhYO0FBSUZDLElBQUFBLFNBQVMsRUFBRSxDQUpUO0FBS0ZDLElBQUFBLFlBQVksRUFBRSxDQUxaO0FBTUZiLElBQUFBLFNBQVMsRUFBRSxZQU5UO0FBT0ZILElBQUFBLElBQUksRUFBRTtBQVBKO0FBaEJTLENBQWY7QUEwQk8sU0FBU3FILGFBQVQsQ0FBdUI7QUFBRXZDLEVBQUFBLFdBQUY7QUFBZUQsRUFBQUEsYUFBZjtBQUE4QnlDLEVBQUFBLFNBQTlCO0FBQXdDckYsRUFBQUE7QUFBeEMsQ0FBdkIsRUFBMEU7QUFDL0UsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFckIsUUFBTSxDQUFDd0I7QUFBbkIsS0FFRTtBQUFPLElBQUEsS0FBSyxFQUFFeEIsUUFBTSxDQUFDVyxLQUFyQjtBQUE0QixJQUFBLFFBQVEsRUFBRVUsT0FBTyxJQUFHQSxPQUFPLENBQUNoRSxLQUFSLEtBQWdCLFNBQWhFO0FBQTRFLElBQUEsSUFBSSxFQUFDLE1BQWpGO0FBQXdGLElBQUEsUUFBUSxFQUFFNEcsYUFBbEc7QUFBa0gsbUJBQVksZUFBOUg7QUFBOEksSUFBQSxLQUFLLEVBQUVDO0FBQXJKLElBRkYsRUFJRSxlQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsUUFBUSxFQUFFN0MsT0FBTyxJQUFHQSxPQUFPLENBQUNoRSxLQUFSLEtBQWdCLFNBQTVDO0FBQXdELElBQUEsS0FBSyxFQUFFMkMsUUFBTSxDQUFDZ0MsR0FBdEU7QUFBNEUsSUFBQSxLQUFLLEVBQUMsTUFBbEY7QUFBeUYsSUFBQSxFQUFFLEVBQUMsU0FBNUY7QUFBc0csSUFBQSxPQUFPLEVBQUUwRSxTQUEvRztBQUEwSCxtQkFBWTtBQUF0SSxJQURGLENBSkYsQ0FERjtBQVVEOztBQ3ZDRCxNQUFNcEcsT0FBSyxHQUFHO0FBQ1ZnQyxFQUFBQSxLQUFLLEVBQUUsS0FERztBQUVWMEMsRUFBQUEsS0FBSyxFQUFFLE9BRkc7QUFHVnJGLEVBQUFBLEtBQUssRUFBRSxNQUhHO0FBSVZrRixFQUFBQSxRQUFRLEVBQUUsRUFKQTtBQUtWckMsRUFBQUEsU0FBUyxFQUFFO0FBTEQsQ0FBZDtBQU9PLFNBQVNtRSxjQUFULENBQXdCO0FBQUU1QixFQUFBQTtBQUFGLENBQXhCLEVBQXFDO0FBQ3hDLFNBQU87QUFBSyxJQUFBLEtBQUssRUFBRXpFLE9BQVo7QUFBbUIsbUJBQVk7QUFBL0IsS0FBa0R5RSxPQUFPLENBQUNzQixJQUExRCxDQUFQO0FBQ0g7O0FDVEQsTUFBTS9GLE9BQUssR0FBRztBQUNWZ0MsRUFBQUEsS0FBSyxFQUFFLEtBREc7QUFFVjBDLEVBQUFBLEtBQUssRUFBRSxPQUZHO0FBR1ZyRixFQUFBQSxLQUFLLEVBQUUsTUFIRztBQUlWa0YsRUFBQUEsUUFBUSxFQUFFLEVBSkE7QUFLVnJDLEVBQUFBLFNBQVMsRUFBRTtBQUxELENBQWQ7QUFPTyxTQUFTb0UsY0FBVCxDQUF3QjtBQUFFN0IsRUFBQUEsT0FBRjtBQUFVeEIsRUFBQUE7QUFBVixDQUF4QixFQUFrRDtBQUNyRCxXQUFTc0QsZ0JBQVQsQ0FBMEJ0SyxDQUExQixFQUE0QjtBQUN4QkEsSUFBQUEsQ0FBQyxDQUFDdUssY0FBRjtBQUNBdkQsSUFBQUEsWUFBWSxDQUFDaEgsQ0FBRCxDQUFaO0FBQ0g7O0FBQ0Q7QUFDQSxTQUFPO0FBQUssSUFBQSxLQUFLLEVBQUUrRCxPQUFaO0FBQW1CLG1CQUFZO0FBQS9CLEtBQWtEeUUsT0FBTyxDQUFDc0IsSUFBMUQsRUFDUDtBQUFHLElBQUEsRUFBRSxFQUFDLFNBQU47QUFBZ0IsbUJBQVksYUFBNUI7QUFBMEMsSUFBQSxJQUFJLEVBQUMsR0FBL0M7QUFBbUQsSUFBQSxPQUFPLEVBQUVRO0FBQTVELGdCQURPLENBQVA7QUFHSDs7QUNYRCxNQUFNN0csUUFBTSxHQUFHO0FBQ2IrRyxFQUFBQSxnQkFBZ0IsRUFBRTtBQUNoQjtBQUNBeEgsSUFBQUEsU0FBUyxFQUFFLFlBRks7QUFHaEJKLElBQUFBLE9BQU8sRUFBRSxDQUhPO0FBSWxCO0FBQ0VDLElBQUFBLElBQUksRUFBRSxFQUxVO0FBTWhCNEgsSUFBQUEsU0FBUyxFQUFFLE1BTks7QUFPaEJDLElBQUFBLFNBQVMsRUFBRTtBQVBLO0FBREwsQ0FBZjtBQVlPLFNBQVNDLFFBQVQsQ0FBa0I7QUFDdkJDLEVBQUFBLFFBRHVCO0FBRXZCVCxFQUFBQSxTQUZ1QjtBQUd2QnpDLEVBQUFBLGFBSHVCO0FBSXZCQyxFQUFBQSxXQUp1QjtBQUt2QmpELEVBQUFBLFFBTHVCO0FBTXZCSSxFQUFBQSxPQU51QjtBQU92QmtDLEVBQUFBO0FBUHVCLENBQWxCLEVBUUo7QUFDRCxRQUFNNkQsV0FBVyxHQUFHQyxHQUFNLENBQUMsSUFBRCxDQUExQjtBQUVBdEIsRUFBQUEsQ0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJb0IsUUFBSixFQUFjO0FBQ1pDLE1BQUFBLFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkMsU0FBcEIsR0FBZ0NILFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkUsWUFBcEQ7QUFDRDtBQUNGLEdBSlEsRUFJTixDQUFDTCxRQUFELENBSk0sQ0FBVDs7QUFNQSxXQUFTTSxNQUFULENBQWdCbEwsQ0FBaEIsRUFBbUI7QUFDakJtSyxJQUFBQSxTQUFTLENBQUNuSyxDQUFELENBQVQ7QUFDQTZLLElBQUFBLFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkMsU0FBcEIsR0FBZ0NILFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkUsWUFBcEQ7QUFDRDs7QUFDRCxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRWpJLE1BQUFBLFNBQVMsRUFBRSxZQUFiO0FBQTJCSSxNQUFBQSxLQUFLLEVBQUUsTUFBbEM7QUFBMEM4QixNQUFBQSxNQUFNLEVBQUUsTUFBbEQ7QUFBMER4QyxNQUFBQSxPQUFPLEVBQUUsTUFBbkU7QUFBMkU4QyxNQUFBQSxhQUFhLEVBQUUsUUFBMUY7QUFBb0d0QyxNQUFBQSxVQUFVLEVBQUU7QUFBaEg7QUFBWixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVPLFFBQU0sQ0FBQytHLGdCQUFuQjtBQUFxQyxJQUFBLEdBQUcsRUFBRUs7QUFBMUMsS0FDR0QsUUFBUSxJQUNQQSxRQUFRLENBQUM3RixNQUFULEdBQWtCLENBRG5CLElBRUNvRyxhQUFhLENBQUM7QUFBRVAsSUFBQUEsUUFBUSxFQUFFUSxZQUFZLENBQUM7QUFBRVIsTUFBQUE7QUFBRixLQUFELENBQXhCO0FBQXdDbEcsSUFBQUE7QUFBeEMsR0FBRCxDQUFiLENBQWtFTSxHQUFsRSxDQUNHN0UsQ0FBRCxJQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRXVDLE1BQUFBLE9BQU8sRUFBRTtBQUFYO0FBQVosS0FDRyxHQURILEVBRUcsQ0FBQ3ZDLENBQUMsQ0FBQ2EsSUFBSCxJQUFXLEVBQUMsT0FBRDtBQUFTLElBQUEsT0FBTyxFQUFFYjtBQUFsQixJQUZkLEVBR0dBLENBQUMsQ0FBQ2EsSUFBRixJQUFVYixDQUFDLENBQUNhLElBQUYsS0FBVyxTQUFyQixJQUFrQyxFQUFDLGNBQUQ7QUFBZ0IsSUFBQSxPQUFPLEVBQUViO0FBQXpCLElBSHJDLEVBSUdBLENBQUMsQ0FBQ2EsSUFBRixJQUFVYixDQUFDLENBQUNhLElBQUYsS0FBVyxTQUFyQixJQUFrQyxFQUFDLGNBQUQ7QUFBZ0IsSUFBQSxPQUFPLEVBQUViLENBQXpCO0FBQTRCLElBQUEsWUFBWSxFQUFFNkc7QUFBMUMsSUFKckMsQ0FGSixDQUhKLENBREYsRUFlRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVuRSxNQUFBQSxJQUFJLEVBQUU7QUFBUjtBQUFaLEtBQ0UsRUFBQyxhQUFEO0FBQ0UsSUFBQSxPQUFPLEVBQUVpQyxPQURYO0FBRUUsSUFBQSxTQUFTLEVBQUVvRyxNQUZiO0FBR0UsSUFBQSxXQUFXLEVBQUV2RCxXQUhmO0FBSUUsSUFBQSxhQUFhLEVBQUVEO0FBSmpCLElBREYsQ0FmRixDQURGO0FBMkJEOztBQUNELFNBQVN5RCxhQUFULENBQXVCO0FBQUVQLEVBQUFBLFFBQUY7QUFBWWxHLEVBQUFBO0FBQVosQ0FBdkIsRUFBK0M7QUFDN0MsTUFBSWtHLFFBQVEsSUFBSUEsUUFBUSxDQUFDN0YsTUFBVCxHQUFrQixDQUE5QixJQUFtQ0wsUUFBdkMsRUFBaUQ7QUFDL0MsV0FBT2tHLFFBQVEsQ0FBQzVGLEdBQVQsQ0FBY3FHLEdBQUQsSUFBUztBQUMzQixVQUFJQSxHQUFHLENBQUMzRyxRQUFKLEtBQWlCQSxRQUFyQixFQUErQjtBQUM3QixlQUFPLEVBQUUsR0FBRzJHLEdBQUw7QUFBVTVDLFVBQUFBLEtBQUssRUFBRSxPQUFqQjtBQUEwQi9ELFVBQUFBLFFBQVEsRUFBRTtBQUFwQyxTQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxFQUFFLEdBQUcyRyxHQUFMO0FBQVU1QyxVQUFBQSxLQUFLLEVBQUU7QUFBakIsU0FBUDtBQUNEO0FBQ0YsS0FOTSxDQUFQO0FBT0QsR0FSRCxNQVFPO0FBQ0wsV0FBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFDRCxTQUFTMkMsWUFBVCxDQUFzQjtBQUFFUixFQUFBQTtBQUFGLENBQXRCLEVBQW9DO0FBQ2xDLE1BQUlBLFFBQUosRUFBYztBQUNaLFdBQU9BLFFBQVEsQ0FBQ1UsSUFBVCxFQUFQO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTyxJQUFQO0FBQ0Q7QUFDRjs7QUNoRmMsU0FBU0MsUUFBVCxDQUFrQjtBQUMvQlgsRUFBQUEsUUFBUSxHQUFHLEVBRG9CO0FBRS9CbEQsRUFBQUEsYUFGK0I7QUFHL0J5QyxFQUFBQSxTQUgrQjtBQUkvQnhDLEVBQUFBLFdBSitCO0FBSy9CakQsRUFBQUEsUUFMK0I7QUFNL0JJLEVBQUFBLE9BTitCO0FBTy9Ca0MsRUFBQUE7QUFQK0IsQ0FBbEIsRUFRWjtBQUNELFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxLQUNFLEVBQUMsUUFBRDtBQUNBLElBQUEsWUFBWSxFQUFFQSxZQURkO0FBRUUsSUFBQSxPQUFPLEVBQUVsQyxPQUZYO0FBR0UsSUFBQSxRQUFRLEVBQUU4RixRQUhaO0FBSUUsSUFBQSxTQUFTLEVBQUVULFNBSmI7QUFLRSxJQUFBLGFBQWEsRUFBRXpDLGFBTGpCO0FBTUUsSUFBQSxXQUFXLEVBQUdDLFdBTmhCO0FBT0UsSUFBQSxRQUFRLEVBQUVqRDtBQVBaLElBREYsQ0FERjtBQWFEOztBQzNCRCxNQUFNWCxPQUFLLEdBQUc7QUFDWlgsRUFBQUEsS0FBSyxFQUFFLEVBREs7QUFFWjhCLEVBQUFBLE1BQU0sRUFBRSxFQUZJO0FBSVpmLEVBQUFBLE1BQU0sRUFBRTtBQUpJLENBQWQ7QUFNTyxTQUFTcUgsWUFBVCxDQUFzQjtBQUFFQyxFQUFBQTtBQUFGLENBQXRCLEVBQXNDO0FBQzNDLE1BQUlBLFVBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUNwQixXQUFPLEVBQUMsUUFBRCxPQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUlBLFVBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUMzQixXQUFPLEVBQUMsVUFBRCxPQUFQO0FBQ0QsR0FGTSxNQUVBLElBQUlBLFVBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUMzQixXQUFPLEVBQUMsT0FBRCxPQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxFQUFDLFNBQUQsT0FBUDtBQUNEO0FBRU0sU0FBU0MsUUFBVCxHQUFvQjtBQUN6QixTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHM0gsT0FBTDtBQUFZZCxNQUFBQSxlQUFlLEVBQUU7QUFBN0IsS0FEVDtBQUVFLG1CQUFZO0FBRmQsSUFERjtBQU1EO0FBRU0sU0FBUzBJLFNBQVQsR0FBcUI7QUFDMUIsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBRzVILE9BQUw7QUFBWWQsTUFBQUEsZUFBZSxFQUFFO0FBQTdCLEtBRFQ7QUFFRSxtQkFBWTtBQUZkLElBREY7QUFNRDtBQUVNLFNBQVMySSxVQUFULEdBQXNCO0FBQzNCLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUc3SCxPQUFMO0FBQVlkLE1BQUFBLGVBQWUsRUFBRTtBQUE3QixLQURUO0FBRUUsbUJBQVk7QUFGZCxJQURGO0FBTUQ7QUFFTSxTQUFTNEksT0FBVCxHQUFtQjtBQUN4QixTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHOUgsT0FBTDtBQUFZZCxNQUFBQSxlQUFlLEVBQUU7QUFBN0IsS0FEVDtBQUVFLG1CQUFZO0FBRmQsSUFERjtBQU1EOztBQ2pERCxNQUFNNkksWUFBWSxHQUFHMUssQ0FBYSxFQUFsQzs7QUFjQSxTQUFTMkssYUFBVCxDQUF1QmxLLEtBQXZCLEVBQThCO0FBRTVCLFFBQU07QUFBRU8sSUFBQUE7QUFBRixNQUFnQlAsS0FBdEI7QUFFQSxRQUFNLENBQUNmLEtBQUQsRUFBUWtMLFFBQVIsSUFBb0JwRCxHQUFRLENBQUN4RyxTQUFELENBQWxDO0FBRUEsU0FBTyxFQUFDLFlBQUQsQ0FBYyxRQUFkO0FBQXVCLElBQUEsS0FBSyxFQUFFdEI7QUFBOUIsS0FBeUNlLEtBQXpDLEVBQVA7QUFDRDs7QUNwQk0sU0FBU29LLGFBQVQsQ0FBdUI7QUFBRUMsRUFBQUE7QUFBRixDQUF2QixFQUFpQztBQUN0QyxRQUFNO0FBQUN2SyxJQUFBQTtBQUFELE1BQWFGLFdBQVcsRUFBOUI7O0FBRUEsV0FBUzBLLFdBQVQsQ0FBcUJuTSxDQUFyQixFQUF3QjtBQUN0QixVQUFNO0FBQUUrQyxNQUFBQTtBQUFGLFFBQVMvQyxDQUFDLENBQUM2RSxNQUFqQjtBQUNBbEQsSUFBQUEsVUFBVSxDQUFDO0FBQUNULE1BQUFBLFlBQVksRUFBQyxHQUFkO0FBQWtCRCxNQUFBQSxLQUFLLEVBQUUsSUFBRzhCLEVBQUc7QUFBL0IsS0FBRCxDQUFWO0FBQ0Q7O0FBQ0QsU0FDRSxlQUNFLEVBQUMsSUFBRCxRQUNFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFVBQWI7QUFBd0IsSUFBQSxPQUFPLEVBQUVvSjtBQUFqQyxnQkFERixFQUlFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLE9BQWI7QUFBcUIsSUFBQSxPQUFPLEVBQUVBO0FBQTlCLGFBSkYsRUFPRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxTQUFiO0FBQXVCLElBQUEsT0FBTyxFQUFFQTtBQUFoQyxlQVBGLEVBVUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsUUFBYjtBQUFzQixJQUFBLE9BQU8sRUFBRUE7QUFBL0IsY0FWRixFQWFFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFNBQWI7QUFBdUIsSUFBQSxPQUFPLEVBQUVBO0FBQWhDLGVBYkYsRUFnQkUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsU0FBYjtBQUF1QixJQUFBLE9BQU8sRUFBRUE7QUFBaEMsZUFoQkYsRUFtQkUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsVUFBYjtBQUF3QixJQUFBLE9BQU8sRUFBRUE7QUFBakMsZ0JBbkJGLEVBdUJFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFdBQWI7QUFBeUIsSUFBQSxPQUFPLEVBQUVBO0FBQWxDLGlCQXZCRixFQTBCRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxTQUFiO0FBQXVCLElBQUEsT0FBTyxFQUFFQTtBQUFoQyxlQTFCRixFQTZCRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxVQUFiO0FBQXdCLElBQUEsT0FBTyxFQUFFQTtBQUFqQyxnQkE3QkYsRUFnQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsUUFBYjtBQUFzQixJQUFBLE9BQU8sRUFBRUE7QUFBL0Isb0JBaENGLEVBbUNFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFFBQWI7QUFBc0IsSUFBQSxPQUFPLEVBQUVBO0FBQS9CLGFBbkNGLEVBc0NFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLGlCQUFiO0FBQStCLElBQUEsT0FBTyxFQUFFQTtBQUF4QyxzQkF0Q0YsRUF5Q0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsT0FBYjtBQUFxQixJQUFBLE9BQU8sRUFBRUE7QUFBOUIsYUF6Q0YsQ0FERixDQURGO0FBaUREOztBQzFERCxNQUFNcEksT0FBSyxHQUFHO0FBQ1pxSSxFQUFBQSxLQUFLLEVBQUU7QUFDTGhKLElBQUFBLEtBQUssRUFBRSxFQURGO0FBRUw4QixJQUFBQSxNQUFNLEVBQUUsRUFGSDtBQUdMakMsSUFBQUEsZUFBZSxFQUFFLE9BSFo7QUFJTDhDLElBQUFBLEtBQUssRUFBRSxPQUpGO0FBS0xFLElBQUFBLFNBQVMsRUFBQyxRQUxMO0FBTUxrQyxJQUFBQSxZQUFZLEVBQUMsRUFOUjtBQU9MekYsSUFBQUEsT0FBTyxFQUFDLE1BUEg7QUFRTDRDLElBQUFBLFVBQVUsRUFBQyxRQVJOO0FBU0wzQyxJQUFBQSxjQUFjLEVBQUM7QUFUVjtBQURLLENBQWQ7QUFhTyxTQUFTNEYsU0FBVCxDQUFpQjtBQUFFNkQsRUFBQUEsS0FBSyxHQUFDO0FBQVIsQ0FBakIsRUFBOEI7QUFDbkMsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUMxSixNQUFBQSxPQUFPLEVBQUMsTUFBVDtBQUFpQjRDLE1BQUFBLFVBQVUsRUFBQztBQUE1QjtBQUFaLEtBQ00sMEJBRE4sRUFFRTtBQUFLLElBQUEsS0FBSyxFQUFFdkIsT0FBSyxDQUFDcUk7QUFBbEIsS0FBMEJBLEtBQTFCLENBRkYsQ0FERjtBQU1EOztBQ3BCTSxTQUFTQyxTQUFULEdBQW9CO0FBQ3ZCLFNBQU8sZUFFSCxFQUFDOUQsU0FBRDtBQUFTLElBQUEsS0FBSyxFQUFFO0FBQWhCLElBRkcsQ0FBUDtBQUlIOztBQ1BNLE1BQU1xQyxRQUFRLEdBQUUsQ0FDbkI7QUFDQWxHLEVBQUFBLFFBQVEsRUFBQyxPQURUO0FBRUFvRixFQUFBQSxJQUFJLEVBQUcsd0JBRlA7QUFHQUYsRUFBQUEsU0FBUyxFQUFFO0FBSFgsQ0FEbUIsRUFNcEI7QUFDQ2xGLEVBQUFBLFFBQVEsRUFBQyxNQURWO0FBRUNvRixFQUFBQSxJQUFJLEVBQUcsMkJBRlI7QUFHQ0YsRUFBQUEsU0FBUyxFQUFFO0FBSFosQ0FOb0IsRUFVbkI7QUFDQWxGLEVBQUFBLFFBQVEsRUFBQyxPQURUO0FBRUFvRixFQUFBQSxJQUFJLEVBQUcsa0JBRlA7QUFHQUYsRUFBQUEsU0FBUyxFQUFFO0FBSFgsQ0FWbUIsRUFlckI7QUFDRWxGLEVBQUFBLFFBQVEsRUFBQyxPQURYO0FBRUVvRixFQUFBQSxJQUFJLEVBQUcsbUJBRlQ7QUFHRUYsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0FmcUIsRUFvQnJCO0FBQ0VsRixFQUFBQSxRQUFRLEVBQUMsTUFEWDtBQUVFb0YsRUFBQUEsSUFBSSxFQUFHLHVCQUZUO0FBR0VGLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBcEJxQixHQTBCckI7QUFDRWxGLEVBQUFBLFFBQVEsRUFBQyxNQURYO0FBRUVvRixFQUFBQSxJQUFJLEVBQUcsc0JBRlQ7QUFHRUYsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0ExQnFCLEVBK0JyQjtBQUNFbEYsRUFBQUEsUUFBUSxFQUFDLE1BRFg7QUFFRW9GLEVBQUFBLElBQUksRUFBRyxzQkFGVDtBQUdFRixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQS9CcUIsRUFvQ3JCO0FBQ0VsRixFQUFBQSxRQUFRLEVBQUMsT0FEWDtBQUVFb0YsRUFBQUEsSUFBSSxFQUFHLFVBRlQ7QUFHRUYsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0FwQ3FCLEVBeUNyQjtBQUNFbEYsRUFBQUEsUUFBUSxFQUFDLE9BRFg7QUFFRW9GLEVBQUFBLElBQUksRUFBRyxVQUZUO0FBR0VGLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBekNxQixFQThDckI7QUFDRWxGLEVBQUFBLFFBQVEsRUFBQyxPQURYO0FBRUVvRixFQUFBQSxJQUFJLEVBQUcsVUFGVDtBQUdFRixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQTlDcUIsRUFtRHJCO0FBQ0VsRixFQUFBQSxRQUFRLEVBQUMsT0FEWDtBQUVFb0YsRUFBQUEsSUFBSSxFQUFHLFVBRlQ7QUFHRUYsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0FuRHFCLEVBd0RyQjtBQUNFbEYsRUFBQUEsUUFBUSxFQUFDLE9BRFg7QUFFRW9GLEVBQUFBLElBQUksRUFBRyxVQUZUO0FBR0VGLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBeERxQixDQUFoQjs7QUNBQSxTQUFTMEMscUJBQVQsQ0FBK0I7QUFBQ0MsRUFBQUE7QUFBRCxDQUEvQixFQUFnRDtBQUNuRCxTQUFTQSxjQUFjLENBQUNDLE1BQWYsQ0FBc0IsQ0FBQ0MsV0FBRCxFQUFjMUIsT0FBZCxFQUF1QjJCLEtBQXZCLEtBQWlDO0FBQzVELFFBQUlBLEtBQUssS0FBSyxDQUFkLEVBQWlCO0FBQ2YsYUFBUUQsV0FBVyxHQUFHLENBQUMsRUFBRSxHQUFHMUIsT0FBTDtBQUFjNEIsUUFBQUEsWUFBWSxFQUFFO0FBQTVCLE9BQUQsQ0FBdEI7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNQyxHQUFHLEdBQUdILFdBQVcsQ0FBQ3hLLElBQVosQ0FDVGhDLENBQUQsSUFBT0EsQ0FBQyxDQUFDeUUsUUFBRixLQUFlcUcsT0FBTyxDQUFDckcsUUFBdkIsSUFBbUNxRyxPQUFPLENBQUNqSyxLQUFSLEtBQWtCLFdBRGxELENBQVo7O0FBR0EsVUFBSThMLEdBQUosRUFBUztBQUNQLGNBQU1GLEtBQUssR0FBR0QsV0FBVyxDQUFDSSxTQUFaLENBQ1g1TSxDQUFELElBQU9BLENBQUMsQ0FBQ3lFLFFBQUYsS0FBZXFHLE9BQU8sQ0FBQ3JHLFFBRGxCLENBQWQsQ0FETzs7QUFLUCtILFFBQUFBLFdBQVcsQ0FBQ0ssTUFBWixDQUFtQkosS0FBbkIsRUFBMEIsQ0FBMUIsRUFBNkIsRUFDM0IsR0FBR0UsR0FEd0I7QUFFM0JELFVBQUFBLFlBQVksRUFBRSxFQUFFQyxHQUFHLENBQUNEO0FBRk8sU0FBN0I7QUFJRCxPQVRELE1BU087QUFDTDtBQUNBRixRQUFBQSxXQUFXLENBQUNNLElBQVosQ0FBaUIsRUFBRSxHQUFHaEMsT0FBTDtBQUFjNEIsVUFBQUEsWUFBWSxFQUFFO0FBQTVCLFNBQWpCO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPRixXQUFQO0FBQ0QsR0F0Qk0sRUFzQkosRUF0QkksQ0FBVDtBQXVCSDs7QUNwQmMsU0FBU08sY0FBVCxDQUF3QjtBQUFFVCxFQUFBQSxjQUFGO0FBQWlCVSxFQUFBQTtBQUFqQixDQUF4QixFQUEyRDtBQUN4RSxRQUFNLENBQUNDLEtBQUQsRUFBT0MsUUFBUCxJQUFrQnZFLEdBQVEsQ0FBQyxFQUFELENBQWhDO0FBQ0ZZLEVBQUFBLENBQVMsQ0FBQyxNQUFJO0FBQ2QsUUFBRytDLGNBQUgsRUFBa0I7QUFDaEIsWUFBTWEsT0FBTyxHQUFFZCxxQkFBcUIsQ0FBQztBQUFDQyxRQUFBQTtBQUFELE9BQUQsQ0FBcEM7QUFDQVksTUFBQUEsUUFBUSxDQUFDQyxPQUFELENBQVI7QUFDRDtBQUVBLEdBTlEsRUFNUCxDQUFDYixjQUFELENBTk8sQ0FBVDtBQVFFLFNBQ0U7QUFBSyxtQkFBWTtBQUFqQixLQUNFLEVBQUMsSUFBRCxRQUNHVyxLQUFLLElBQ0pBLEtBQUssQ0FBQ25JLE1BQU4sR0FBZSxDQURoQixJQUVDbUksS0FBSyxDQUFDbEksR0FBTixDQUFXdEYsQ0FBRCxJQUFPO0FBQ2Y7QUFDRixXQUFPLEVBQUMsUUFBRDtBQUFVLE1BQUEsT0FBTyxFQUFFdU4sY0FBbkI7QUFBbUMsTUFBQSxFQUFFLEVBQUV2TixDQUFDLENBQUNnRjtBQUF6QyxPQUFvRGhGLENBQUMsQ0FBQ2dGLFFBQXRELE9BQWdFO0FBQUssTUFBQSxLQUFLLEVBQUU7QUFBQ3FCLFFBQUFBLEtBQUssRUFBQztBQUFQO0FBQVoscUJBQTBDckcsQ0FBQyxDQUFDaU4sWUFBNUMsQ0FBaEUsQ0FBUDtBQUNDLEdBSEQsQ0FISixDQURGLENBREY7QUFZRDs7QUN2QkQsTUFBTVUsT0FBTyxHQUFHLENBQ2Q7QUFDRTNJLEVBQUFBLFFBQVEsRUFBRSxNQURaO0FBRUU1RCxFQUFBQSxLQUFLLEVBQUUsV0FGVDtBQUdFMEgsRUFBQUEsT0FBTyxFQUFFO0FBQUVzQixJQUFBQSxJQUFJLEVBQUUsV0FBUjtBQUFxQkYsSUFBQUEsU0FBUyxFQUFFO0FBQWhDO0FBSFgsQ0FEYyxFQU9kO0FBQ0VsRixFQUFBQSxRQUFRLEVBQUUsTUFEWjtBQUVFNUQsRUFBQUEsS0FBSyxFQUFFLFdBRlQ7QUFHRTBILEVBQUFBLE9BQU8sRUFBRTtBQUFFc0IsSUFBQUEsSUFBSSxFQUFFLFdBQVI7QUFBcUJGLElBQUFBLFNBQVMsRUFBRTtBQUFoQztBQUhYLENBUGMsRUFZZDtBQUNFbEYsRUFBQUEsUUFBUSxFQUFFLE1BRFo7QUFFRTVELEVBQUFBLEtBQUssRUFBRSxXQUZUO0FBR0UwSCxFQUFBQSxPQUFPLEVBQUU7QUFBRXNCLElBQUFBLElBQUksRUFBRSxXQUFSO0FBQXFCRixJQUFBQSxTQUFTLEVBQUU7QUFBaEM7QUFIWCxDQVpjLENBQWhCO0FBbUJPLFNBQVMwRCxVQUFULEdBQXNCO0FBQzNCLFNBQU8sRUFBQ0MsY0FBRDtBQUFRLElBQUEsY0FBYyxFQUFFakIscUJBQXFCLENBQUM7QUFBQ0MsTUFBQUEsY0FBYyxFQUFDYztBQUFoQixLQUFEO0FBQTdDLElBQVA7QUFDRDs7QUNyQkQsTUFBTTdFLE9BQU8sR0FBRTtBQUFDc0IsRUFBQUEsSUFBSSxFQUFDLGtEQUFOO0FBQ2ZGLEVBQUFBLFNBQVMsRUFBQyxLQURLO0FBRWZsRixFQUFBQSxRQUFRLEVBQUM7QUFGTSxDQUFmO0FBSU8sU0FBUzhJLGtCQUFULEdBQTZCO0FBQ2hDLFNBQU8sRUFBQyxjQUFEO0FBQWdCLElBQUEsT0FBTyxFQUFFaEY7QUFBekIsSUFBUDtBQUNIOztBQ2FELE1BQU1sRSxRQUFRLEdBQUcsQ0FDZjtBQUFFSSxFQUFBQSxRQUFRLEVBQUU7QUFBWixDQURlLEVBRWY7QUFBRUEsRUFBQUEsUUFBUSxFQUFFO0FBQVosQ0FGZSxFQUdmO0FBQUVBLEVBQUFBLFFBQVEsRUFBRTtBQUFaLENBSGUsQ0FBakI7QUFLQSxNQUFNSSxPQUFPLEdBQUc7QUFDZEosRUFBQUEsUUFBUSxFQUFFLFVBREk7QUFFZG1ELEVBQUFBLEtBQUssRUFBRSxnQkFGTztBQUdkVyxFQUFBQSxPQUFPLEVBQUU7QUFBRXNCLElBQUFBLElBQUksRUFBRyx3QkFBVDtBQUFrQ0YsSUFBQUEsU0FBUyxFQUFFO0FBQTdDO0FBSEssQ0FBaEI7QUFLQSxNQUFNcEIsU0FBTyxHQUFHO0FBQ2Q5RCxFQUFBQSxRQUFRLEVBQUUsT0FESTtBQUVkb0YsRUFBQUEsSUFBSSxFQUFHLHdCQUZPO0FBR2RGLEVBQUFBLFNBQVMsRUFBRTtBQUhHLENBQWhCOztBQU1BNkQsQ0FBTSxDQUNKLEVBQUMsYUFBRDtBQUNFLEVBQUEsU0FBUyxFQUFFO0FBQ1RDLElBQUFBLE9BQU8sRUFBRTtBQUNQQyxNQUFBQSxVQUFVLEVBQUUsU0FETDtBQUVQNUgsTUFBQUEsS0FBSyxFQUFFLFNBRkE7QUFHUDZILE1BQUFBLFVBQVUsRUFBRTtBQUhMO0FBREE7QUFEYixHQVNFLEVBQUMsZ0JBQUQ7QUFBa0IsRUFBQSxTQUFTLEVBQUU7QUFBRTFNLElBQUFBLFlBQVksRUFBRSxHQUFoQjtBQUFxQkQsSUFBQUEsS0FBSyxFQUFFO0FBQTVCO0FBQTdCLEdBQ0UsRUFBQyxVQUFEO0FBQVksRUFBQSxhQUFhLEVBQUUsRUFBQyxhQUFEO0FBQTNCLEdBQ0UsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsT0FBRDtBQUFTLEVBQUEsUUFBUSxFQUFFcUQ7QUFBbkIsRUFERixDQURGLEVBSUUsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsS0FBRDtBQUFPLEVBQUEsT0FBTyxFQUFFUTtBQUFoQixFQURGLENBSkYsRUFPRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxPQUFEO0FBQVMsRUFBQSxPQUFPLEVBQUVBO0FBQWxCLEVBREYsQ0FQRixFQVVFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLFNBQUQ7QUFBVyxFQUFBLE9BQU8sRUFBRUE7QUFBcEIsRUFERixDQVZGLEVBYUUsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsTUFBRDtBQUFRLEVBQUEsT0FBTyxFQUFFQTtBQUFqQixFQURGLENBYkYsRUFnQkUsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsT0FBRDtBQUFTLEVBQUEsT0FBTyxFQUFFQTtBQUFsQixFQURGLENBaEJGLEVBbUJFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLE9BQUQ7QUFBUyxFQUFBLE9BQU8sRUFBRUE7QUFBbEIsRUFERixDQW5CRixFQXNCRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxRQUFEO0FBQVUsRUFBQSxPQUFPLEVBQUVBLE9BQW5CO0FBQTRCLEVBQUEsUUFBUSxFQUFFOEYsUUFBdEM7QUFBZ0QsRUFBQSxRQUFRLEVBQUM7QUFBekQsRUFERixDQXRCRixFQXlCRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0U7QUFBSyxFQUFBLEtBQUssRUFBRTtBQUFFaEksSUFBQUEsT0FBTyxFQUFFLEVBQVg7QUFBZUssSUFBQUEsZUFBZSxFQUFFO0FBQWhDO0FBQVosR0FDRSxFQUFDLE9BQUQ7QUFBUyxFQUFBLE9BQU8sRUFBRXVGLFNBQWxCO0FBQTJCLEVBQUEsUUFBUSxFQUFFMUQsT0FBTyxDQUFDSjtBQUE3QyxFQURGLENBREYsQ0F6QkYsRUE4QkUsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLGVBQ0UsRUFBQyxZQUFEO0FBQWMsRUFBQSxNQUFNO0FBQXBCLEVBREYsRUFFRSxFQUFDLFlBQUQsT0FGRixDQURGLENBOUJGLEVBb0NFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLE9BQU8sRUFBRUksT0FBbkI7QUFBNEIsRUFBQSxRQUFRLEVBQUU4RixRQUF0QztBQUFnRCxFQUFBLFFBQVEsRUFBQztBQUF6RCxFQURGLENBcENGLEVBdUNFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLFVBQUQsT0FERixDQXZDRixFQTBDRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxrQkFBRCxPQURGLENBMUNGLEVBOENFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLFNBQUQsT0FERixDQTlDRixDQURGLENBVEYsQ0FESSxFQStESmlELFFBQVEsQ0FBQ0MsSUEvREwsQ0FBTiJ9
