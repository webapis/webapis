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

  return h("div", null, h("div", {
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
    justifyContent: 'space-between'
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
    onClick: onBlock
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
    justifyContent: 'space-between'
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
    title: "Unblock",
    style: style$2.btn,
    onClick: onUnblock
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
    title: "Block and Report",
    Icon: Block$1,
    onClick: onBlock
  })), h("div", {
    style: style$3.btnOk
  }, h(Button, {
    onClick: onOk
  }, "OK")));
}

function IconButton({
  Icon,
  title,
  onClick
}) {
  return h("div", {
    style: style$3.iconBtn
  }, h("button", {
    style: style$3.btn,
    onClick: onClick
  }, h(Icon, null)), h("div", null, title));
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
    justifyContent: 'space-between',
    height: '100%'
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
      flex: 1,
      marginTop: 16,
      marginLeft: 8
    }
  }, hangout && hangout.message && h(Message, {
    message: hangout && hangout.message && hangout.message
  })), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    id: "DECLINE",
    onClick: onDecline,
    title: "Ignore",
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
  input: {//margin:0
  }
};
function MessageEditor({
  messageText,
  onMessageText,
  onMessage
}) {
  return h("div", {
    style: styles$2.root
  }, h("input", {
    type: "text",
    onChange: onMessageText,
    "data-testid": "message-input"
  }), h("div", null, h(Button, {
    title: "send",
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  })));
}

const styles$3 = {
  messageContainer: {
    // width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'orange',
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
  username
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
      backgroundColor: 'yellow',
      display: 'flex',
      flexDirection: 'column'
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
  }, ' ', h(Message, {
    message: m
  })))), h("div", {
    style: {
      flex: 1,
      backgroundColor: 'green'
    }
  }, h(MessageEditor, {
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
  username
}) {
  return h(Layout, {
    id: "hangchat-ui"
  }, h(Messages, {
    messages: messages,
    onMessage: onMessage,
    onMessageText: onMessageText,
    messageText: true,
    username: username
  }));
}

const style$8 = {
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
    style: { ...style$8,
      backgroundColor: 'green'
    },
    "data-testid": "online"
  });
}
function IsOffline() {
  return h("div", {
    style: { ...style$8,
      backgroundColor: 'red'
    },
    "data-testid": "offline"
  });
}
function Connecting() {
  return h("div", {
    style: { ...style$8,
      backgroundColor: 'orange'
    },
    "data-testid": "connecting"
  });
}
function Closing() {
  return h("div", {
    style: { ...style$8,
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
  }, "Uread")));
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
  message: message,
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
}, h(UnreadDemo, null))))), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXIuanMiLCIuLi9OYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uL2xheW91dC9OYXZMaXN0LmpzIiwiLi4vLi4vbGF5b3V0L1RleHRJbnB1dC5qcyIsIi4uLy4uL2xheW91dC9CdXR0b24uanMiLCIuLi8uLi9oYW5nb3V0cy9IYW5nb3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvTGF5b3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2suanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvQmxvY2suanMiLCIuLi8uLi9sYXlvdXQvQ2VudGVyLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2tlZC5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9EZWxldGUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9QZXJzb25BZGQuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUuanMiLCIuLi8uLi9oYW5nb3V0cy91aS9NZXNzYWdlLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlci5qcyIsIi4uLy4uL2hhbmdvdXRzL3VpL01lc3NhZ2VFZGl0b3IuanMiLCIuLi8uLi9oYW5nb3V0cy91aS9NZXNzYWdlcy5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0hhbmdjaGF0LmpzIiwiLi4vLi4vbGF5b3V0L2ljb25zL29ubGluZVN0YXR1cy5qcyIsIi4uLy4uL3RoZW1lL3RoZW1lLWNvbnRleHQuanMiLCIuLi9EcmF3ZXJDb250ZW50LmpzIiwiLi4vZmFrZU1lc3NhZ2VzLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMuanMiLCIuLi8uLi9oYW5nb3V0cy9VbnJlYWRIYW5nb3V0cy5qcyIsIi4uL1VyZWFkRGVtby5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLGE9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmR8aXRlcmEvaTtmdW5jdGlvbiBzKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiB5KG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiB5KGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHAoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gayhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGsobil9fWZ1bmN0aW9uIGcobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9cyh7fSxvKSkuX192PWksdD16KGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmsobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLGEscyl7dmFyIGgscCxtLGssZyxfLGIseCxBLFA9aSYmaS5fX2t8fGMsQz1QLmxlbmd0aDtmb3IoYT09ZSYmKGE9bnVsbCE9cj9yWzBdOkM/dyhpLDApOm51bGwpLHUuX19rPVtdLGg9MDtoPGwubGVuZ3RoO2grKylpZihudWxsIT0oaz11Ll9fa1toXT1udWxsPT0oaz1sW2hdKXx8XCJib29sZWFuXCI9PXR5cGVvZiBrP251bGw6XCJzdHJpbmdcIj09dHlwZW9mIGt8fFwibnVtYmVyXCI9PXR5cGVvZiBrP3kobnVsbCxrLG51bGwsbnVsbCxrKTpBcnJheS5pc0FycmF5KGspP3koZCx7Y2hpbGRyZW46a30sbnVsbCxudWxsLG51bGwpOm51bGwhPWsuX19lfHxudWxsIT1rLl9fYz95KGsudHlwZSxrLnByb3BzLGsua2V5LG51bGwsay5fX3YpOmspKXtpZihrLl9fPXUsay5fX2I9dS5fX2IrMSxudWxsPT09KG09UFtoXSl8fG0mJmsua2V5PT1tLmtleSYmay50eXBlPT09bS50eXBlKVBbaF09dm9pZCAwO2Vsc2UgZm9yKHA9MDtwPEM7cCsrKXtpZigobT1QW3BdKSYmay5rZXk9PW0ua2V5JiZrLnR5cGU9PT1tLnR5cGUpe1BbcF09dm9pZCAwO2JyZWFrfW09bnVsbH1pZihnPXoobixrLG09bXx8ZSx0LG8scixmLGEscyksKHA9ay5yZWYpJiZtLnJlZiE9cCYmKHh8fCh4PVtdKSxtLnJlZiYmeC5wdXNoKG0ucmVmLG51bGwsaykseC5wdXNoKHAsay5fX2N8fGcsaykpLG51bGwhPWcpe2lmKG51bGw9PWImJihiPWcpLEE9dm9pZCAwLHZvaWQgMCE9PWsuX19kKUE9ay5fX2Qsay5fX2Q9dm9pZCAwO2Vsc2UgaWYocj09bXx8ZyE9YXx8bnVsbD09Zy5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWF8fGEucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZChnKSxBPW51bGw7ZWxzZXtmb3IoXz1hLHA9MDsoXz1fLm5leHRTaWJsaW5nKSYmcDxDO3ArPTIpaWYoXz09ZylicmVhayBuO24uaW5zZXJ0QmVmb3JlKGcsYSksQT1hfVwib3B0aW9uXCI9PXUudHlwZSYmKG4udmFsdWU9XCJcIil9YT12b2lkIDAhPT1BP0E6Zy5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LnR5cGUmJih1Ll9fZD1hKX1lbHNlIGEmJm0uX19lPT1hJiZhLnBhcmVudE5vZGUhPW4mJihhPXcobSkpfWlmKHUuX19lPWIsbnVsbCE9ciYmXCJmdW5jdGlvblwiIT10eXBlb2YgdS50eXBlKWZvcihoPXIubGVuZ3RoO2gtLTspbnVsbCE9cltoXSYmdihyW2hdKTtmb3IoaD1DO2gtLTspbnVsbCE9UFtoXSYmRChQW2hdLFBbaF0pO2lmKHgpZm9yKGg9MDtoPHgubGVuZ3RoO2grKylqKHhbaF0seFsrK2hdLHhbKytoXSl9ZnVuY3Rpb24geChuKXtyZXR1cm4gbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuP1tdOkFycmF5LmlzQXJyYXkobik/Yy5jb25jYXQuYXBwbHkoW10sbi5tYXAoeCkpOltuXX1mdW5jdGlvbiBBKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxDKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8QyhuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIFAobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1hLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gQyhuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxQKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fFAobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLE4sciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLE4scikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIE4obCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIHoobCx1LGksdCxvLHIsZixlLGMpe3ZhciBhLHYsaCx5LHAsdyxrLGcsXyx4LEEsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsoYT1uLl9fYikmJmEodSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoZz11LnByb3BzLF89KGE9UC5jb250ZXh0VHlwZSkmJnRbYS5fX2NdLHg9YT9fP18ucHJvcHMudmFsdWU6YS5fXzp0LGkuX19jP2s9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoZyx4KToodS5fX2M9dj1uZXcgbShnLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWcsdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9cyh7fSx2Ll9fcykpLHModi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoZyx2Ll9fcykpKSx5PXYucHJvcHMscD12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmZyE9PXkmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGcseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShnLHYuX19zLHgpfHx1Ll9fdj09PWkuX192KXtmb3Iodi5wcm9wcz1nLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGE9MDthPHUuX19rLmxlbmd0aDthKyspdS5fX2tbYV0mJih1Ll9fa1thXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGcsdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZSh5LHAsdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWcsdi5zdGF0ZT12Ll9fcywoYT1uLl9fcikmJmEodSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLGE9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PXMocyh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSh5LHApKSxBPW51bGwhPWEmJmEudHlwZT09ZCYmbnVsbD09YS5rZXk/YS5wcm9wcy5jaGlsZHJlbjphLGIobCxBcnJheS5pc0FycmF5KEEpP0E6W0FdLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGsmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KGE9bi5kaWZmZWQpJiZhKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIGEscyx2LGgseSxwPXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihhPTA7YTxvLmxlbmd0aDthKyspaWYobnVsbCE9KHM9b1thXSkmJigobnVsbD09PWwudHlwZT8zPT09cy5ub2RlVHlwZTpzLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PXMpKXtuPXMsb1thXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXAhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0ocD11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKG51bGwhPW8pZm9yKHA9e30seT0wO3k8bi5hdHRyaWJ1dGVzLmxlbmd0aDt5KyspcFtuLmF0dHJpYnV0ZXNbeV0ubmFtZV09bi5hdHRyaWJ1dGVzW3ldLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9QShuLGQscCx0LGYpLGg/bC5fX2s9W106KGE9bC5wcm9wcy5jaGlsZHJlbixiKG4sQXJyYXkuaXNBcnJheShhKT9hOlthXSxsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PShhPWQudmFsdWUpJiZhIT09bi52YWx1ZSYmQyhuLFwidmFsdWVcIixhLHAudmFsdWUsITEpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09KGE9ZC5jaGVja2VkKSYmYSE9PW4uY2hlY2tlZCYmQyhuLFwiY2hlY2tlZFwiLGEscC5jaGVja2VkLCExKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10seih1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6dS5jaGlsZE5vZGVzLmxlbmd0aD9jLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKTpudWxsLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXt2YXIgdSxpO2ZvcihpIGluIGw9cyhzKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSksdT17fSxsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKHVbaV09bFtpXSk7cmV0dXJuIHkobi50eXBlLHUsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsZyhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1LlByb3ZpZGVyLl9fPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gZyh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9cyh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJnModSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksZyh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxnKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCxwIGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCx1LHIsaT0wLG89W10sYz1uLl9fcixmPW4uZGlmZmVkLGU9bi5fX2MsYT1uLnVubW91bnQ7ZnVuY3Rpb24gdih0LHIpe24uX19oJiZuLl9faCh1LHQsaXx8ciksaT0wO3ZhciBvPXUuX19IfHwodS5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj1vLl9fLmxlbmd0aCYmby5fXy5wdXNoKHt9KSxvLl9fW3RdfWZ1bmN0aW9uIG0obil7cmV0dXJuIGk9MSxwKEUsbil9ZnVuY3Rpb24gcChuLHIsaSl7dmFyIG89dih0KyssMik7cmV0dXJuIG8udD1uLG8uX19jfHwoby5fX2M9dSxvLl9fPVtpP2kocik6RSh2b2lkIDAsciksZnVuY3Rpb24obil7dmFyIHQ9by50KG8uX19bMF0sbik7by5fX1swXSE9PXQmJihvLl9fWzBdPXQsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIGwocixpKXt2YXIgbz12KHQrKywzKTshbi5fX3MmJngoby5fX0gsaSkmJihvLl9fPXIsby5fX0g9aSx1Ll9fSC5fX2gucHVzaChvKSl9ZnVuY3Rpb24geShyLGkpe3ZhciBvPXYodCsrLDQpOyFuLl9fcyYmeChvLl9fSCxpKSYmKG8uX189cixvLl9fSD1pLHUuX19oLnB1c2gobykpfWZ1bmN0aW9uIGQobil7cmV0dXJuIGk9NSxoKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBzKG4sdCx1KXtpPTYseShmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09dT91OnUuY29uY2F0KG4pKX1mdW5jdGlvbiBoKG4sdSl7dmFyIHI9dih0KyssNyk7cmV0dXJuIHgoci5fX0gsdSk/KHIuX19IPXUsci5fX2g9bixyLl9fPW4oKSk6ci5fX31mdW5jdGlvbiBUKG4sdCl7cmV0dXJuIGk9OCxoKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIHcobil7dmFyIHI9dS5jb250ZXh0W24uX19jXSxpPXYodCsrLDkpO3JldHVybiBpLl9fYz1uLHI/KG51bGw9PWkuX18mJihpLl9fPSEwLHIuc3ViKHUpKSxyLnByb3BzLnZhbHVlKTpuLl9ffWZ1bmN0aW9uIEEodCx1KXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZSh1P3UodCk6dCl9ZnVuY3Rpb24gRihuKXt2YXIgcj12KHQrKywxMCksaT1tKCk7cmV0dXJuIHIuX189bix1LmNvbXBvbmVudERpZENhdGNofHwodS5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXtyLl9fJiZyLl9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIF8oKXtvLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faC5mb3JFYWNoKHEpLHQuX19ILl9faD1bXX1jYXRjaCh1KXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHUsdC5fX3YpLCEwfX0pLG89W119ZnVuY3Rpb24gZyhuKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnUmJm4udSgpfWZ1bmN0aW9uIHEobil7bi51PW4uX18oKX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHUpe3JldHVybiB0IT09blt1XX0pfWZ1bmN0aW9uIEUobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtjJiZjKG4pLHQ9MDt2YXIgcj0odT1uLl9fYykuX19IO3ImJihyLl9faC5mb3JFYWNoKGcpLHIuX19oLmZvckVhY2gocSksci5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciB1PXQuX19jO3UmJnUuX19IJiZ1Ll9fSC5fX2gubGVuZ3RoJiYoMSE9PW8ucHVzaCh1KSYmcj09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHI9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCx1PWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHI9c2V0VGltZW91dCh1LDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHUpKX0pKF8pKX0sbi5fX2M9ZnVuY3Rpb24odCx1KXt1LnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goZyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxxKG4pfSl9Y2F0Y2gocil7dS5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSksdT1bXSxuLl9fZShyLHQuX192KX19KSxlJiZlKHQsdSl9LG4udW5tb3VudD1mdW5jdGlvbih0KXthJiZhKHQpO3ZhciB1PXQuX19jO2lmKHUmJnUuX19IKXRyeXt1Ll9fSC5fXy5mb3JFYWNoKGcpfWNhdGNoKHQpe24uX19lKHQsdS5fX3YpfX07ZXhwb3J0e20gYXMgdXNlU3RhdGUscCBhcyB1c2VSZWR1Y2VyLGwgYXMgdXNlRWZmZWN0LHkgYXMgdXNlTGF5b3V0RWZmZWN0LGQgYXMgdXNlUmVmLHMgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxoIGFzIHVzZU1lbW8sVCBhcyB1c2VDYWxsYmFjayx3IGFzIHVzZUNvbnRleHQsQSBhcyB1c2VEZWJ1Z1ZhbHVlLEYgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcbiAgICBBUFBfUk9VVEVfQ0hBTkdFRDonQVBQX1JPVVRFX0NIQU5HRUQnLFxuICAgIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByb3V0ZTogYWN0aW9uLnJvdXRlLGZlYXR1cmVSb3V0ZTogYWN0aW9uLmZlYXR1cmVSb3V0ZSB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8sdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHtyZWR1Y2VyfSBmcm9tICcuL3JlZHVjZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmNvbnN0IEFwcFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbiBmdW5jdGlvbiB1c2VBcHBSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwUm91dGVDb250ZXh0KTtcclxuICBcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZVJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtmZWF0dXJlUm91dGV9PXN0YXRlXHJcblxyXG4gIGlmIChwYXRoICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aCkge1xyXG5cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gZmVhdHVyZVJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwUm91dGUgKCl7XHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VBcHBSb3V0ZUNvbnRleHQoKVxyXG5cclxuICBmdW5jdGlvbiBvbkFwcFJvdXRlKHtyb3V0ZSxmZWF0dXJlUm91dGV9KXtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtvbkFwcFJvdXRlfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge3JvdXRlfT1zdGF0ZVxyXG4gIGlmIChwYXRoICYmIHJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiByb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gcm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3Qge2luaXRTdGF0ZX09cHJvcHNcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZVJlZHVjZXIocmVkdWNlcixpbml0U3RhdGUpXHJcblxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdmlnYXRpb24ocHJvcHMpIHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgZHJhd2VyQ29udGVudCB9ID0gcHJvcHM7XG5cblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8aDEgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIHBhZGRpbmc6IDUgfX0+XG4gICAgICAgIFN0b3J5Ym9va1xuICAgICAgPC9oMT5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEgfX0+e2RyYXdlckNvbnRlbnR9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMTAgfX0+e2NoaWxkcmVufTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPntjaGlsZHJlbn08L2Rpdj47XG59XG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGZ1bmN0aW9uIExpc3QoeyBjaGlsZHJlbiwgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXHJcblxyXG4gICAgICAgIHBhZGRpbmdUb3A6IDgsXHJcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogOCxcclxuICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGlzdEl0ZW0oeyBjaGlsZHJlbiwgb25DbGljaywgaWQgfSkge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBpZD17aWR9XHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPSdkcmF3ZXItbGlzdC1pdGVtJ1xyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgICAgIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgICBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHBhZGRpbmdUb3A6IDgsXHJcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogOCxcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcGFkZGluZzogOCxcclxuICBtYXJnaW5MZWZ0OiAxNixcclxuICBtYXJnaW5SaWdodDogMTYsXHJcbiAgbWFyZ2luVG9wOiA4LFxyXG4gIG1hcmdpbkJvdHRvbTogOCxcclxuICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICBmbGV4OiAxLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xyXG4gIGNvbnN0IHsgaWQsIHR5cGUgPSAndGV4dCcsc3R5bGUgfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4Jywgd2lkdGg6ICcxMDAlJyB9fT5cclxuICAgICAgPGlucHV0ICBzdHlsZT17ey4uLnN0eWxlcywuLi5zdHlsZX19IHsuLi5wcm9wc30gZGF0YS10ZXN0aWQ9e2lkfSB0eXBlPXt0eXBlfSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xuICBjb25zdCB7IHRpdGxlLHN0eWxlLGlkIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIHsuLi5wcm9wc30+XG4gICAgICB7dGl0bGV9XG4gICAgPC9idXR0b24+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uL2xheW91dC9UZXh0SW5wdXQnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQge3VzZUFwcFJvdXRlfWZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xuaW1wb3J0IHtzYXZlTWVzc2FnZX1mcm9tICcuL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dCdcblxuY29uc3Qgc3R5bGUgPSB7XG4gIGlucHV0Q29udGFpbmVyOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGJvcmRlcjogJyM3MzczNzMgc29saWQgMXB4JyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICBwYWRkaW5nOiAxMCxcbiAgICBmbGV4OiAxLFxuICAgIGJvcmRlcjogJ3doaXRlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXQoe1xuICBoYW5nb3V0cyxcbiAgb25TZWFyY2gsXG4gIG9uU2VsZWN0SGFuZ291dCxcbiAgc2VhcmNoLFxuICB1c2VybmFtZSxcbiAgb25TdGFydFNlYXJjaCxcbiAgZGlzcGF0Y2hcbn0pIHtcbiAgY29uc3Qge29uQXBwUm91dGV9PXVzZUFwcFJvdXRlKClcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dFNlbGVjdGlvbihlKXtcbiAgICBjb25zdCBpZCA9ZS50YXJnZXQuaWRcbiAgICBvblNlbGVjdEhhbmdvdXQoZSlcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZChnPT4gZy51c2VybmFtZT09PWlkKVxuICBcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6YC8ke2hhbmdvdXQuc3RhdGV9YCxyb3V0ZTonL2hhbmdvdXRzJ30pXG4gIH1cbiAgcmV0dXJuIChcbiBcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuaW5wdXRDb250YWluZXJ9PlxuICAgICAgICA8VGV4dElucHV0XG4gICAgICAgICAgdmFsdWU9e3NlYXJjaH1cbiAgICAgICAgICBpZD1cInNlYXJjaC1pbnB1dFwiXG4gICAgICAgICAgdHlwZT1cInNlYXJjaFwiXG4gICAgICAgICAgb25DaGFuZ2U9e29uU2VhcmNofVxuICAgICAgICAgIHN0eWxlPXtzdHlsZS5pbnB1dH1cbiAgICAgICAgLz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWJ0blwiXG4gICAgICAgICAgZGlzYWJsZWQ9eyFzZWFyY2h9XG4gICAgICAgICAgdGl0bGU9XCJzZWFyY2hcIlxuICAgICAgICAgIG9uQ2xpY2s9e29uU3RhcnRTZWFyY2h9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPExpc3QgaWQ9XCJoYW5nb3V0cy1saXN0XCI+XG4gICAgICAgIHtoYW5nb3V0cyAmJlxuICAgICAgICAgIGhhbmdvdXRzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBoYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxMaXN0SXRlbSBpZD17Zy51c2VybmFtZX0gb25DbGljaz17aGFuZGxlSGFuZ291dFNlbGVjdGlvbn0+XG4gICAgICAgICAgICAgICAge2cudXNlcm5hbWV9XG4gICAgICAgICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgPC9MaXN0PlxuICAgXG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICB9LFxufTtcbmV4cG9ydCBmdW5jdGlvbiBMYXlvdXQoeyBjaGlsZHJlbiwgc3R5bGUsIGlkIH0pIHtcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9e2lkfSBzdHlsZT17eyAuLi5zdHlsZXMucm9vdCwgLi4uc3R5bGUgfX0+e2NoaWxkcmVufTwvZGl2Pjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgY2hlY2tib3g6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgY2hlY2tib3hSb290OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIHBhZGRpbmc6IDE2LFxuICB9LFxuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgfSxcbiAgYnRuOiB7XG4gICAgZmxleDogMSxcbiAgICBtYXJnaW5SaWdodDogNCxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgb25DYW5jZWwsIG9uQmxvY2ssIG9uUmVwb3J0IH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY2hlY2tib3hSb290fT5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHN0eWxlPXtzdHlsZS5jaGVja2JveH0gb25DaGFuZ2U9e29uUmVwb3J0fSAvPlxuICAgICAgICA8bGFiZWw+UmVwb3J0PC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDYW5jZWxcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNhbmNlbH0gLz5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gaWQ9XCJCTE9DS1wiIG9uQ2xpY2s9e29uQmxvY2t9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2soe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgb25DbGljayxcclxuICBpZCxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGhlaWdodD17aGVpZ2h0fVxyXG4gICAgICB2aWV3Qm94PScwIDAgMjQgMjQnXHJcbiAgICAgIHdpZHRoPXt3aWR0aH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgaWQ9e2lkfVxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSBpZD17aWR9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgaWQ9e2lkfVxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek00IDEyYzAtNC40MiAzLjU4LTggOC04IDEuODUgMCAzLjU1LjYzIDQuOSAxLjY5TDUuNjkgMTYuOUM0LjYzIDE1LjU1IDQgMTMuODUgNCAxMnptOCA4Yy0xLjg1IDAtMy41NS0uNjMtNC45LTEuNjlMMTguMzEgNy4xQzE5LjM3IDguNDUgMjAgMTAuMTUgMjAgMTJjMCA0LjQyLTMuNTggOC04IDh6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmV4cG9ydCBmdW5jdGlvbiBDZW50ZXIoeyBjaGlsZHJlbiwgc3R5bGUgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAuLi5zdHlsZSxcbiAgICAgIH19XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9CbG9jayc7XG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICcuLi8uLi9sYXlvdXQvQ2VudGVyJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gIH0sXG4gIGJ0bjoge1xuICAgIGZsZXg6IDEsXG4gICAgbWFyZ2luUmlnaHQ6IDQsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9ja2VkKHsgaGFuZ291dCwgb25VbmJsb2NrLCBvbkNsb3NlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiYmxvY2tlZC11aVwiPlxuICAgICAgPENlbnRlciBzdHlsZT17eyBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgIDxCbG9jayB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cInJlZFwiIC8+XG4gICAgICAgIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQudXNlcm5hbWV9PC9iPiBpcyBibG9ja2VkXG4gICAgICA8L0NlbnRlcj5cblxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDbG9zZVwiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xvc2V9IC8+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJVbmJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25VbmJsb2NrfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIERlbGV0ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHonXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFyY2hpdmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9ezI0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTIwLjU0IDUuMjNsLTEuMzktMS42OEMxOC44OCAzLjIxIDE4LjQ3IDMgMTggM0g2Yy0uNDcgMC0uODguMjEtMS4xNi41NUwzLjQ2IDUuMjNDMy4xNyA1LjU3IDMgNi4wMiAzIDYuNVYxOWMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjYuNWMwLS40OC0uMTctLjkzLS40Ni0xLjI3ek0xMiAxNy41TDYuNSAxMkgxMHYtMmg0djJoMy41TDEyIDE3LjV6TTUuMTIgNWwuODEtMWgxMmwuOTQgMUg1LjEyeidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0RlbGV0ZSc7XG5pbXBvcnQgeyBBcmNoaXZlIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0FyY2hpdmUnO1xuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvQmxvY2snO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5jb25zdCBzdHlsZSA9IHtcbiAgaWNvbkJ0bjogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW46IDggfSxcbiAgYnRuOiB7IG1hcmdpblJpZ2h0OiA4IH0sXG4gIGJ0bkNvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgfSxcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gIH0sXG4gIGJ0bk9rOiB7XG4gICAgbWFyZ2luOiA4LFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbmZpZ3VyZSh7XG4gIG9uQmxvY2ssXG4gIG9uRGVsZXRlLFxuICBvbkFyY2hpdmUsXG4gIG9uTm90aWZpY2F0aW9uLFxuICBvbkNvbnZlcnNhdGlvbkhpc3RvcnksXG4gIG9uT2ssXG59KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XG4gICAgICAgIDxDaGVja2JveFxuICAgICAgICAgIGxhYmVsPVwiQ29udmVyc2F0aW9uIEhpc3RvcnlcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxociAvPlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuQ29udGFpbmVyfT5cbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJBcmNoaXZlXCIgSWNvbj17QXJjaGl2ZX0gb25DbGljaz17b25BcmNoaXZlfSAvPlxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQmxvY2sgYW5kIFJlcG9ydFwiIEljb249e0Jsb2NrfSBvbkNsaWNrPXtvbkJsb2NrfSAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Pa30+XG4gICAgICAgIDxCdXR0b24gb25DbGljaz17b25Pa30+T0s8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuXG5mdW5jdGlvbiBJY29uQnV0dG9uKHsgSWNvbiwgdGl0bGUsIG9uQ2xpY2sgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLmljb25CdG59PlxuICAgICAgPGJ1dHRvbiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgICAgPEljb24gLz5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGRpdj57dGl0bGV9PC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmZ1bmN0aW9uIENoZWNrYm94KHsgbGFiZWwsIG9uQ2hhbmdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbjogOCwgbWFyZ2luVG9wOiA4IH19PlxuICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz5cbiAgICAgIDxsYWJlbD57bGFiZWx9PC9sYWJlbD5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQZXJzb25BZGRJY29uKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ3doaXRlJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTUgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0tOS0yVjdINHYzSDF2MmgzdjNoMnYtM2gzdi0ySDZ6bTkgNGMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IFBlcnNvbkFkZCBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvUGVyc29uQWRkJztcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2xheW91dC9UZXh0SW5wdXQnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICcuLi8uLi9sYXlvdXQvQ2VudGVyJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZSh7IGhhbmdvdXQsIG9uSW52aXRlLCBvbk1lc3NhZ2VUZXh0LG1lc3NhZ2VUZXh0LCB2YWx1ZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fWlkPVwiaW52aXRlLXVpXCI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8UGVyc29uQWRkIGNvbG9yPVwiZ3JlZW5cIiAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICBTdGFydCBDb252ZXJzYXRpb24gd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj5cbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPFRleHRJbnB1dCBpZD1cIm1lc3NhZ2VUZXh0SW5wdXRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gdmFsdWU9e21lc3NhZ2VUZXh0fSAvPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIlNlbmQgSW52aXRlXCIgaWQ9XCJJTlZJVEVcIiBvbkNsaWNrPXtvbkludml0ZX0gZGF0YS10ZXN0aWQ9J29uaW52aXRlLWJ0bicgLz5cbiAgICAgIDwvQ2VudGVyPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRG9uZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yeidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBEb25lIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0RvbmUnO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVlKHsgaGFuZ291dCB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxEb25lIHdpZHRoPVwiNzBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwiZ3JlZW5cIiAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8cD5cbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxuICAgICAgICAgIHlvdXIgaW52aXRpb24gaGFzIGJlZW4gYWNjZXB0ZWQuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvQ2VudGVyPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmNvbnN0IHN0eWxlID0ge1xuICByb290OiB7XG4gICAgYm9yZGVyQ29sb3I6ICcjZWVlZWVlJyxcbiAgICBib3JkZXJTdHlsZTogJ3NvbGlkJyxcbiAgICBib3JkZXJXaWR0aDogMSxcbiAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgcGFkZGluZzogMyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBtaW5IZWlnaHQ6IDM1LFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgfSxcbiAgdXNlcm5hbWU6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgbG9nOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGNvbG9yOiAnIzczNzM3MycsXG4gICAgZm9udFNpemU6IDEwLFxuICB9LFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UocHJvcHMpIHtcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcbiAgY29uc3QgeyBmbG9hdCwgdXNlcm5hbWUgfSA9IG1lc3NhZ2U7XG4gIGNvbnN0IFtkYXlzLCBzZXREYXlzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW3NlY29uZHMsIHNldFNlY29uZHNdID0gdXNlU3RhdGUoMCk7XG5cbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XG4gICAgdmFyIGQsIGgsIG0sIHM7XG4gICAgcyA9IE1hdGguZmxvb3IobXMgLyAxMDAwKTtcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xuICAgIHMgPSBzICUgNjA7XG4gICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICBtID0gbSAlIDYwO1xuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XG4gICAgaCA9IGggJSAyNDtcbiAgICBzZXREYXlzKGQpO1xuICAgIHNldEhvdXJzKGgpO1xuICAgIHNldE1pbnV0ZXMobSk7XG4gICAgc2V0U2Vjb25kcyhzKTtcbiAgfVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSBtZXNzYWdlLnRpbWVzdGFtcCk7XG4gICAgfSwgMCk7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSBtZXNzYWdlLnRpbWVzdGFtcCk7XG4gICAgfSwgNjAwMDApO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsbWFyZ2luQm90dG9tOjMgfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLnJvb3QsIGZsb2F0IH19PlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibWVzc2FnZVwiIHN0eWxlPXtzdHlsZS5tZXNzYWdlfT57bWVzc2FnZSAmJiBtZXNzYWdlLnRleHR9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmxvZ30+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHttaW51dGVzID09PSAwICYmIDxkaXY+Tm93PC9kaXY+fVxuICAgICAgICAgICAge2hvdXJzID09PSAwICYmIG1pbnV0ZXMgPiAwICYmIDxkaXY+e21pbnV0ZXN9IG1pbnV0ZXMgYWdvIDwvZGl2Pn1cbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge2hvdXJzfSBob3VycyB7bWludXRlc30gbWludXRlcyBhZ297JyAnfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7ZGF5cyA8PSAxMCAmJiBkYXlzID4gMSAmJiA8ZGl2PntkYXlzfSBkYXlzIGFnbzwvZGl2Pn1cbiAgICAgICAgICAgIHtkYXlzID4gMTAgJiYgbmV3IERhdGUobWVzc2FnZS50aW1lc3RhbXApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vdWkvTWVzc2FnZSc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZXIoeyBoYW5nb3V0LCBvbkFjY2VwdCwgb25EZWNsaW5lIH0pIHtcblxuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5Ub3A6IDE2LCBtYXJnaW5MZWZ0OiA4IH19PlxuICAgICAgICAgIHtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiAoXG4gICAgICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiBoYW5nb3V0Lm1lc3NhZ2V9IC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgaWQ9XCJERUNMSU5FXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cbiAgICAgICAgICAgIHRpdGxlPVwiSWdub3JlXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblJpZ2h0OiA0LCBjb2xvcjogJ3JlZCcgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGlkPVwiQUNDRVBUXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NlcHQtYnRuXCJcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpbkxlZnQ6IDQsIGNvbG9yOiAnZ3JlZW4nIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICAvL21hcmdpbjowXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiLz5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi9NZXNzYWdlRWRpdG9yJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgbWVzc2FnZUNvbnRhaW5lcjoge1xuICAgLy8gd2lkdGg6ICcxMDAlJyxcbiAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxuICAgIGZsZXg6MTUsXG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgb3ZlcmZsb3dYOiBcImhpZGRlblwiXG4gICAgXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VzKHtcbiAgbWVzc2FnZXMsXG4gIG9uTWVzc2FnZSxcbiAgb25NZXNzYWdlVGV4dCxcbiAgbWVzc2FnZVRleHQsXG4gIHVzZXJuYW1lLFxufSkge1xuICBjb25zdCBzY3JvbGxlclJlZiA9IHVzZVJlZihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChtZXNzYWdlcykge1xuICAgICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcbiAgICB9XG4gIH0sIFttZXNzYWdlc10pO1xuXG4gIGZ1bmN0aW9uIG9uU2VuZChlKSB7XG4gICAgb25NZXNzYWdlKGUpO1xuICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7ICBib3hTaXppbmc6ICdib3JkZXItYm94Jyx3aWR0aDonMTAwJScsaGVpZ2h0OicxMDAlJywgYmFja2dyb3VuZENvbG9yOid5ZWxsb3cnLCBkaXNwbGF5OidmbGV4JyxmbGV4RGlyZWN0aW9uOidjb2x1bW4nfX0+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMubWVzc2FnZUNvbnRhaW5lcn0gcmVmPXtzY3JvbGxlclJlZn0+XG4gICAgICAgIHttZXNzYWdlcyAmJlxuICAgICAgICAgIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXM6IHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pLCB1c2VybmFtZSB9KS5tYXAoXG4gICAgICAgICAgICAobSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cbiAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjEsIGJhY2tncm91bmRDb2xvcjonZ3JlZW4nfX0+XG4gICAgICA8TWVzc2FnZUVkaXRvclxuICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cbiAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgXG4gICAgPC9kaXY+XG4gICk7XG59XG5mdW5jdGlvbiBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcbiAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgdXNlcm5hbWUpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtc2cpID0+IHtcbiAgICAgIGlmIChtc2cudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdyaWdodCcsIHVzZXJuYW1lOiAnbWUnIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAnbGVmdCcgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vdWkvTWVzc2FnZXMnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9MYXlvdXQnO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ2NoYXQoe1xuICBtZXNzYWdlcyA9IFtdLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2UsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZVxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgaWQ9XCJoYW5nY2hhdC11aVwiID5cbiAgICAgIDxNZXNzYWdlc1xuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICBtZXNzYWdlVGV4dFxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XG4gICAgICAvPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgd2lkdGg6IDE1LFxuICBoZWlnaHQ6IDE1LFxuXG4gIGJvcmRlcjogJ3doaXRlIDJweCBzb2xpZCcsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xuICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xuICAgIHJldHVybiA8Q29ubmVjdGluZyAvPjtcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xuICB9XG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcblxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXG5leHBvcnQgZnVuY3Rpb24gRHJhd2VyQ29udGVudCh7IG9wZW4gfSkge1xuICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6Jy8nLHJvdXRlOmAvJHtpZH1gfSlcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8TGlzdD5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaGFuZ291dHNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgSGFuZ291dHNcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgQmxvY2tcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tlZFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBCbG9ja2VkXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBJbnZpdGVcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBJbnZpdGVlXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZXJcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgSW52aXRlclxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nY2hhdFwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBIYW5nY2hhdFxuICAgICAgICA8L0xpc3RJdGVtPlxuXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImNvbmZpZ3VyZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBDb25maWd1cmVcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwibWVzc2FnZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBNZXNzYWdlXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cIm1lc3NhZ2VzXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIE1lc3NhZ2VzXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cIm9ubGluZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgIG9ubGluZVN0YXR1c1xuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJ1bnJlYWRcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICBVcmVhZFxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiZXhwb3J0IGNvbnN0IG1lc3NhZ2VzID1bXG4gICAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMTc4OTk3MSxcbiAgfSxcbiAgIHtcbiAgICB1c2VybmFtZTonZGVtbycsXG4gICAgdGV4dDogYE9rIExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMjE2MzQ2MixcbiAgfSx7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgSG93IGFyZSB5b3UgZGVtb2AsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjM1NzIzLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgQXJlIHlvdSBhbGwgcmlnaHRgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzY3NzU3MyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgWWVzIEkgYW0uIEhvdyBhcmUgeW91YCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDYsXG4gIH0sXG4gICxcbiAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDgsXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuXSIsImV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyVW5yZWFkaGFuZ291dHMoe3VucmVhZGhhbmdvdXRzfSl7XG4gICAgcmV0dXJuICAgdW5yZWFkaGFuZ291dHMucmVkdWNlKChhY2N1bXVsYXRvciwgY3VycmVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIChhY2N1bXVsYXRvciA9IFt7IC4uLmN1cnJlbnQsIG1lc3NhZ2VDb3VudDogMSB9XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0gYWNjdW11bGF0b3IuZmluZChcbiAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lICYmIGN1cnJlbnQuc3RhdGUgPT09ICdNRVNTQU5HRVInXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGFjY3VtdWxhdG9yLmZpbmRJbmRleChcbiAgICAgICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxuICAgICAgICAgICAgYWNjdW11bGF0b3Iuc3BsaWNlKGluZGV4LCAxLCB7XG4gICAgICAgICAgICAgIC4uLm9iaixcbiAgICAgICAgICAgICAgbWVzc2FnZUNvdW50OiArK29iai5tZXNzYWdlQ291bnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9pZiBjdXJyZW50IGV4aXN0IGluc2lkZSBhY2N1bWlsYXRvciBtYXAgaXQgdG8gdGhhdCBvYmplY3RcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnB1c2goeyAuLi5jdXJyZW50LCBtZXNzYWdlQ291bnQ6IDEgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgIH0sIFtdKTtcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XG5pbXBvcnQge3JlZHVjZXJVbnJlYWRoYW5nb3V0c30gZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMnXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVbnJlYWRIYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzLG9uU2VsZWN0VW5yZWFkIH0pIHtcbiAgY29uc3QgW2l0ZW1zLHNldEl0ZW1zXSA9dXNlU3RhdGUoW10pXG51c2VFZmZlY3QoKCk9PntcbmlmKHVucmVhZGhhbmdvdXRzKXtcbiAgY29uc3QgcmVkdWNlZCA9cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pXG4gIHNldEl0ZW1zKHJlZHVjZWQpXG59XG5cbn0sW3VucmVhZGhhbmdvdXRzXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9J3VucmVhZGhhbmdvdXRzJz5cbiAgICAgIDxMaXN0PlxuICAgICAgICB7aXRlbXMgJiZcbiAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgaXRlbXMubWFwKCh1KSA9PiB7XG4gICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICByZXR1cm4gPExpc3RJdGVtIG9uQ2xpY2s9e29uU2VsZWN0VW5yZWFkfSBpZD17dS51c2VybmFtZX0+e3UudXNlcm5hbWV9IDxkaXYgc3R5bGU9e3tjb2xvcjonIzczNzM3Myd9fT5tZXNzYWdlczoge3UubWVzc2FnZUNvdW50fTwvZGl2PjwvTGlzdEl0ZW0+O1xuICAgICAgICAgIH0pfVxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgVW5yZWFkIGZyb20gJy4uL2hhbmdvdXRzL1VucmVhZEhhbmdvdXRzJztcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcbmNvbnN0IHVucmVhZHMgPSBbXG4gIHtcbiAgICB1c2VybmFtZTogJ2RlbW8nLFxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcbiAgfSxcblxuICB7XG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcbiAgICBzdGF0ZTogJ01FU1NBTkdFUicsXG4gICAgbWVzc2FnZTogeyB0ZXh0OiAnSGVsbG8geW91JywgdGltZXN0YW1wOiAxNTkxODEwNDU4NjMwIH0sXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTogJ2Jlcm8nLFxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcbiAgICBtZXNzYWdlOiB7IHRleHQ6ICdIZWxsbyB5b3UnLCB0aW1lc3RhbXA6IDE1OTE4MTA0NTg2MzAgfSxcbiAgfSxcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBVbnJlYWREZW1vKCkge1xuICByZXR1cm4gPFVucmVhZCB1bnJlYWRoYW5nb3V0cz17cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0czp1bnJlYWRzfSl9IC8+O1xufVxuIiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IEFwcFJvdXRlUHJvdmlkZXIsIEFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xuaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi9OYXZpZ2F0aW9uJztcbmltcG9ydCBIYW5nb3V0IGZyb20gJy4uL2hhbmdvdXRzL0hhbmdvdXQnO1xuaW1wb3J0IEJsb2NrIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrJztcbmltcG9ydCBCbG9ja2VkIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrZWQnO1xuaW1wb3J0IENvbmZpZ3VyZSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9Db25maWd1cmUnO1xuaW1wb3J0IEludml0ZSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGUnO1xuaW1wb3J0IEludml0ZWUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlZSc7XG5pbXBvcnQgSW52aXRlciBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVyJztcbmltcG9ydCBIYW5nY2hhdCBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9IYW5nY2hhdCc7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vaGFuZ291dHMvdWkvTWVzc2FnZSc7XG5pbXBvcnQgeyBNZXNzYWdlcyB9IGZyb20gJy4uL2hhbmdvdXRzL3VpL01lc3NhZ2VzJztcbmltcG9ydCB7IE1lc3NhZ2VFZGl0b3IgfSBmcm9tICcuLi9oYW5nb3V0cy91aS9NZXNzYWdlRWRpdG9yJztcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJy4uL2xheW91dC9pY29ucy9vbmxpbmVTdGF0dXMnO1xuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XG5pbXBvcnQgeyBEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi9EcmF3ZXJDb250ZW50JztcbmltcG9ydCB7IG1lc3NhZ2VzIH0gZnJvbSAnLi9mYWtlTWVzc2FnZXMnO1xuaW1wb3J0IHtVbnJlYWREZW1vfSBmcm9tICcuL1VyZWFkRGVtbydcbmNvbnN0IGhhbmdvdXRzID0gW1xuICB7IHVzZXJuYW1lOiAndXNlcm9uZScgfSxcbiAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXG4gIHsgdXNlcm5hbWU6ICd1c2VydGhyZWUnIH0sXG5dO1xuY29uc3QgaGFuZ291dCA9IHtcbiAgdXNlcm5hbWU6ICd0ZXN0dXNlcicsXG4gIGVtYWlsOiAndGVzdEBnbWFpbC5jb20nLFxuICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXG59O1xuY29uc3QgbWVzc2FnZSA9IHtcbiAgdXNlcm5hbWU6ICdicmVubycsXG4gIHRleHQ6IGBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcbiAgdGltZXN0YW1wOiAxNTkxMzMxNzY3ODM2LFxufTtcbi8vXG5yZW5kZXIoXG4gIDxUaGVtZVByb3ZpZGVyXG4gICAgaW5pdFN0YXRlPXt7XG4gICAgICBwcmltYXJ5OiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcbiAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgSGVsdmV0aWNhLCBcIkFyaWFsXCInLFxuICAgICAgfSxcbiAgICB9fVxuICA+XG4gICAgPEFwcFJvdXRlUHJvdmlkZXIgaW5pdFN0YXRlPXt7IGZlYXR1cmVSb3V0ZTogJy8nLCByb3V0ZTogJy91bnJlYWQnIH19PlxuICAgICAgPE5hdmlnYXRpb24gZHJhd2VyQ29udGVudD17PERyYXdlckNvbnRlbnQgLz59PlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tcIj5cbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYmxvY2tlZFwiPlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlXCI+XG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pbnZpdGVlXCI+XG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlclwiPlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdjaGF0XCI+XG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvbWVzc2FnZVwiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cbiAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e21lc3NhZ2V9IHVzZXJuYW1lPXtoYW5nb3V0LnVzZXJuYW1lfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9vbmxpbmVcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cbiAgICAgICAgICAgIDxPbmxpbmVTdGF0dXMgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvbWVzc2FnZXNcIj5cbiAgICAgICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxuICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi91bnJlYWRcIj5cbiAgICAgICAgICA8VW5yZWFkRGVtby8+XG4gICAgICAgIDwvQXBwUm91dGU+XG4gICAgICA8L05hdmlnYXRpb24+XG4gICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxuICA8L1RoZW1lUHJvdmlkZXI+LFxuICBkb2N1bWVudC5ib2R5XG4pO1xuIl0sIm5hbWVzIjpbInQiLCJ1IiwiciIsImkiLCJvIiwiYyIsImYiLCJlIiwiYSIsInYiLCJtIiwiRSIsImQiLCJoIiwidyIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwidXNlQXBwUm91dGUiLCJkaXNwYXRjaCIsIm9uQXBwUm91dGUiLCJBcHBSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJmaW5kIiwicCIsIkFwcFJvdXRlUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJ1c2VSZWR1Y2VyIiwidmFsdWUiLCJ1c2VNZW1vIiwiTmF2aWdhdGlvbiIsImRyYXdlckNvbnRlbnQiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJwYWRkaW5nIiwiZmxleCIsIkxpc3QiLCJpZCIsImJveFNpemluZyIsImJhY2tncm91bmRDb2xvciIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwid2lkdGgiLCJMaXN0SXRlbSIsIm9uQ2xpY2siLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsInN0eWxlcyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIlRleHRJbnB1dCIsInN0eWxlIiwiQnV0dG9uIiwidGl0bGUiLCJpbnB1dENvbnRhaW5lciIsImJvcmRlciIsImlucHV0IiwiSGFuZ291dCIsImhhbmdvdXRzIiwib25TZWFyY2giLCJvblNlbGVjdEhhbmdvdXQiLCJzZWFyY2giLCJ1c2VybmFtZSIsIm9uU3RhcnRTZWFyY2giLCJoYW5kbGVIYW5nb3V0U2VsZWN0aW9uIiwidGFyZ2V0IiwiaGFuZ291dCIsImxlbmd0aCIsIm1hcCIsInJvb3QiLCJoZWlnaHQiLCJMYXlvdXQiLCJjaGVja2JveCIsImNoZWNrYm94Um9vdCIsImFsaWduSXRlbXMiLCJsYXlvdXQiLCJmbGV4RGlyZWN0aW9uIiwiYnRuIiwiQmxvY2siLCJvbkNhbmNlbCIsIm9uQmxvY2siLCJvblJlcG9ydCIsImZpbGwiLCJjb2xvciIsIkNlbnRlciIsInRleHRBbGlnbiIsIkJsb2NrZWQiLCJvblVuYmxvY2siLCJvbkNsb3NlIiwiRGVsZXRlIiwiQXJjaGl2ZSIsImljb25CdG4iLCJtYXJnaW4iLCJidG5Db250YWluZXIiLCJidG5PayIsIkNvbmZpZ3VyZSIsIm9uRGVsZXRlIiwib25BcmNoaXZlIiwib25Ob3RpZmljYXRpb24iLCJvbkNvbnZlcnNhdGlvbkhpc3RvcnkiLCJvbk9rIiwiSWNvbkJ1dHRvbiIsIkljb24iLCJDaGVja2JveCIsImxhYmVsIiwib25DaGFuZ2UiLCJQZXJzb25BZGRJY29uIiwiSW52aXRlIiwib25JbnZpdGUiLCJvbk1lc3NhZ2VUZXh0IiwibWVzc2FnZVRleHQiLCJQZXJzb25BZGQiLCJlbWFpbCIsIkRvbmUiLCJJbnZpdGVlIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwiYm9yZGVyUmFkaXVzIiwibWluSGVpZ2h0IiwibG9nIiwiZm9udFNpemUiLCJNZXNzYWdlIiwibWVzc2FnZSIsImZsb2F0IiwiZGF5cyIsInNldERheXMiLCJ1c2VTdGF0ZSIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJzIiwiTWF0aCIsImZsb29yIiwidXNlRWZmZWN0Iiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJ0aW1lc3RhbXAiLCJzZXRJbnRlcnZhbCIsInRleHQiLCJJbnZpdGVyIiwib25BY2NlcHQiLCJvbkRlY2xpbmUiLCJNZXNzYWdlRWRpdG9yIiwib25NZXNzYWdlIiwibWVzc2FnZUNvbnRhaW5lciIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsIk1lc3NhZ2VzIiwibWVzc2FnZXMiLCJzY3JvbGxlclJlZiIsInVzZVJlZiIsImN1cnJlbnQiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJvblNlbmQiLCJmbG9hdE1lc3NhZ2VzIiwic29ydE1lc3NhZ2VzIiwibXNnIiwic29ydCIsIkhhbmdjaGF0IiwiT25saW5lU3RhdHVzIiwicmVhZHlTdGF0ZSIsIklzT25saW5lIiwiSXNPZmZsaW5lIiwiQ29ubmVjdGluZyIsIkNsb3NpbmciLCJUaGVtZUNvbnRleHQiLCJUaGVtZVByb3ZpZGVyIiwic2V0U3RhdGUiLCJEcmF3ZXJDb250ZW50Iiwib3BlbiIsImhhbmRsZVJvdXRlIiwicmVkdWNlclVucmVhZGhhbmdvdXRzIiwidW5yZWFkaGFuZ291dHMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsImluZGV4IiwibWVzc2FnZUNvdW50Iiwib2JqIiwiZmluZEluZGV4Iiwic3BsaWNlIiwicHVzaCIsIlVucmVhZEhhbmdvdXRzIiwib25TZWxlY3RVbnJlYWQiLCJpdGVtcyIsInNldEl0ZW1zIiwicmVkdWNlZCIsInVucmVhZHMiLCJVbnJlYWREZW1vIiwiVW5yZWFkIiwicmVuZGVyIiwicHJpbWFyeSIsImJhY2tncm91bmQiLCJmb250RmFtaWx5IiwiZG9jdW1lbnQiLCJib2R5Il0sIm1hcHBpbmdzIjoiQUFBRyxJQUFDLENBQUMsQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9FQUFvRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUF1RyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBc08sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTVvUyxJQUFJQSxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1IsR0FBQyxDQUFDLENBQUMsQ0FBQ0UsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUMsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNTLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPUCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBbUYsU0FBU1csR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ULEdBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUEyRyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFzRCxTQUFTYyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNiLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQ1EsR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBNE4sU0FBU2MsR0FBQyxFQUFFLENBQUNYLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1osR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNOLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDTCxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUYsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRWEsR0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1QsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDQyxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQ1EsR0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQzs7QUNBenRFLE1BQU1DLFdBQVcsR0FBRTtBQUN0QkMsRUFBQUEsaUJBQWlCLEVBQUMsbUJBREk7QUFFdEJDLEVBQUFBLHFCQUFxQixFQUFDO0FBRkEsQ0FBbkI7O0FDRUEsU0FBU0MsT0FBVCxDQUFpQkMsS0FBakIsRUFBd0JDLE1BQXhCLEVBQWdDO0FBQ25DLFVBQVFBLE1BQU0sQ0FBQ0MsSUFBZjtBQUNJLFNBQUtOLFdBQVcsQ0FBQ0MsaUJBQWpCO0FBQ0ksYUFBTyxFQUFFLEdBQUdHLEtBQUw7QUFBWUcsUUFBQUEsS0FBSyxFQUFFRixNQUFNLENBQUNFLEtBQTFCO0FBQWdDQyxRQUFBQSxZQUFZLEVBQUVILE1BQU0sQ0FBQ0c7QUFBckQsT0FBUDs7QUFDSjtBQUNJLGFBQU9KLEtBQVA7QUFKUjtBQU1IOztBQ0xELE1BQU1LLGVBQWUsR0FBR0MsQ0FBYSxFQUFyQzs7QUFFQyxTQUFTQyxrQkFBVCxHQUE4QjtBQUM3QixRQUFNQyxPQUFPLEdBQUdDLEdBQVUsQ0FBQ0osZUFBRCxDQUExQjs7QUFFQSxNQUFJLENBQUNHLE9BQUwsRUFBYztBQUNaLFVBQU0sSUFBSUUsS0FBSixDQUFVLHVEQUFWLENBQU47QUFDRDs7QUFDRCxTQUFPRixPQUFQO0FBQ0Q7QUFlTSxTQUFTRyxXQUFULEdBQXVCO0FBQzVCLFFBQU0sQ0FBQ1gsS0FBRCxFQUFPWSxRQUFQLElBQWlCTCxrQkFBa0IsRUFBekM7O0FBRUEsV0FBU00sVUFBVCxDQUFvQjtBQUFDVixJQUFBQSxLQUFEO0FBQU9DLElBQUFBO0FBQVAsR0FBcEIsRUFBeUM7QUFDdkNRLElBQUFBLFFBQVEsQ0FBQztBQUFDVixNQUFBQSxJQUFJLEVBQUNOLFdBQVcsQ0FBQ0MsaUJBQWxCO0FBQXFDTyxNQUFBQSxZQUFyQztBQUFrREQsTUFBQUE7QUFBbEQsS0FBRCxDQUFSO0FBQ0Q7O0FBRUQsU0FBTztBQUFDVSxJQUFBQTtBQUFELEdBQVA7QUFDRDtBQUVNLFNBQVNDLFFBQVQsQ0FBa0JDLEtBQWxCLEVBQXlCO0FBQzlCLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQSxJQUFaO0FBQWtCQyxJQUFBQTtBQUFsQixNQUE0QkgsS0FBbEM7QUFFQSxRQUFNLENBQUNmLEtBQUQsRUFBT1ksUUFBUCxJQUFtQkwsa0JBQWtCLEVBQTNDO0FBQ0YsUUFBTTtBQUFDSixJQUFBQTtBQUFELE1BQVFILEtBQWQ7O0FBQ0UsTUFBSWlCLElBQUksSUFBSWQsS0FBSyxLQUFLYyxJQUF0QixFQUE0QjtBQUMxQixXQUFPRCxRQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUlFLEtBQUssSUFBSWYsS0FBSyxLQUFLZSxLQUFLLENBQUNDLElBQU4sQ0FBWUMsQ0FBRCxJQUFPQSxDQUFDLEtBQUtqQixLQUF4QixDQUF2QixFQUF1RDtBQUM1RCxXQUFPYSxRQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7QUFDTSxTQUFTSyxnQkFBVCxDQUEwQk4sS0FBMUIsRUFBaUM7QUFDdEMsUUFBTTtBQUFDTyxJQUFBQTtBQUFELE1BQVlQLEtBQWxCO0FBQ0EsUUFBTSxDQUFDZixLQUFELEVBQU9ZLFFBQVAsSUFBaUJXLENBQVUsQ0FBQ3hCLE9BQUQsRUFBU3VCLFNBQVQsQ0FBakM7QUFHRixRQUFNRSxLQUFLLEdBQUdDLEdBQU8sQ0FBQyxNQUFNLENBQUN6QixLQUFELEVBQVFZLFFBQVIsQ0FBUCxFQUEwQixDQUFDWixLQUFELENBQTFCLENBQXJCO0FBQ0UsU0FBTyxFQUFDLGVBQUQsQ0FBaUIsUUFBakI7QUFBMEIsSUFBQSxLQUFLLEVBQUV3QjtBQUFqQyxLQUE0Q1QsS0FBNUMsRUFBUDtBQUNEOztBQ3ZEYyxTQUFTVyxVQUFULENBQW9CWCxLQUFwQixFQUEyQjtBQUN4QyxRQUFNO0FBQUVDLElBQUFBLFFBQUY7QUFBWVcsSUFBQUE7QUFBWixNQUE4QlosS0FBcEM7QUFHQSxTQUNFLGVBQ0U7QUFBSSxJQUFBLEtBQUssRUFBRTtBQUFFYSxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkMsTUFBQUEsY0FBYyxFQUFFLFFBQW5DO0FBQTZDQyxNQUFBQSxPQUFPLEVBQUU7QUFBdEQ7QUFBWCxpQkFERixFQUlFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUYsTUFBQUEsT0FBTyxFQUFFO0FBQVg7QUFBWixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUcsTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFBWixLQUEwQkosYUFBMUIsQ0FERixFQUVFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUksTUFBQUEsSUFBSSxFQUFFO0FBQVI7QUFBWixLQUEyQmYsUUFBM0IsQ0FGRixDQUpGLENBREY7QUFXRDs7QUNqQkQsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUMvQixFQUFFLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDakMsRUFBRSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQzlCO0FBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUMxRDtBQUNBLEVBQUUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkUsRUFBRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7QUFDMUI7QUFDQSxFQUFFLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtBQUMxQixJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN6QixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRCxLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsS0FBSztBQUNMLEdBQUcsTUFBTTtBQUNULElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtBQUN4QixJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNuQyxHQUFHLE1BQU07QUFDVCxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BELEdBQUc7QUFDSDs7Ozs7QUN2Qk8sU0FBU2dCLElBQVQsQ0FBYztBQUFFaEIsRUFBQUEsUUFBRjtBQUFZaUIsRUFBQUE7QUFBWixDQUFkLEVBQWdDO0FBQ3JDLFNBQ0U7QUFDQSxtQkFBYUEsRUFEYjtBQUVFLElBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLFNBQVMsRUFBRSxZQUROO0FBRUxDLE1BQUFBLGVBQWUsRUFBRSxNQUZaO0FBSUxDLE1BQUFBLFVBQVUsRUFBRSxDQUpQO0FBS0xDLE1BQUFBLGFBQWEsRUFBRSxDQUxWO0FBTUxDLE1BQUFBLEtBQUssRUFBRTtBQU5GO0FBRlQsS0FXR3RCLFFBWEgsQ0FERjtBQWVEO0FBRU0sU0FBU3VCLFFBQVQsQ0FBa0I7QUFBRXZCLEVBQUFBLFFBQUY7QUFBWXdCLEVBQUFBLE9BQVo7QUFBcUJQLEVBQUFBO0FBQXJCLENBQWxCLEVBQTZDO0FBRWxELFNBQ0U7QUFDRSxJQUFBLEVBQUUsRUFBRUEsRUFETjtBQUVFLG1CQUFhQSxFQUZmO0FBR0UsSUFBQSxPQUFPLEVBQUVPLE9BSFg7QUFJRSxJQUFBLFNBQVMsRUFBQyxrQkFKWjtBQUtFLElBQUEsS0FBSyxFQUFFO0FBQ0xOLE1BQUFBLFNBQVMsRUFBRSxZQUROO0FBRUxPLE1BQUFBLFdBQVcsRUFBRSxFQUZSO0FBR0xDLE1BQUFBLFlBQVksRUFBRSxFQUhUO0FBSUxOLE1BQUFBLFVBQVUsRUFBRSxDQUpQO0FBS0xDLE1BQUFBLGFBQWEsRUFBRSxDQUxWO0FBTUxULE1BQUFBLE9BQU8sRUFBRTtBQU5KO0FBTFQsS0FjR1osUUFkSCxDQURGO0FBa0JEOztBQ3RDRCxNQUFNMkIsTUFBTSxHQUFHO0FBQ2JiLEVBQUFBLE9BQU8sRUFBRSxDQURJO0FBRWJjLEVBQUFBLFVBQVUsRUFBRSxFQUZDO0FBR2JDLEVBQUFBLFdBQVcsRUFBRSxFQUhBO0FBSWJDLEVBQUFBLFNBQVMsRUFBRSxDQUpFO0FBS2JDLEVBQUFBLFlBQVksRUFBRSxDQUxEO0FBTWJiLEVBQUFBLFNBQVMsRUFBRSxZQU5FO0FBT2JILEVBQUFBLElBQUksRUFBRTtBQVBPLENBQWY7QUFVTyxTQUFTaUIsU0FBVCxDQUFtQmpDLEtBQW5CLEVBQTBCO0FBQy9CLFFBQU07QUFBRWtCLElBQUFBLEVBQUY7QUFBTS9CLElBQUFBLElBQUksR0FBRyxNQUFiO0FBQW9CK0MsSUFBQUE7QUFBcEIsTUFBOEJsQyxLQUFwQztBQUNBLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFYSxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQlUsTUFBQUEsS0FBSyxFQUFFO0FBQTFCO0FBQVosS0FDRTtBQUFRLElBQUEsS0FBSyxFQUFFLEVBQUMsR0FBR0ssTUFBSjtBQUFXLFNBQUdNO0FBQWQ7QUFBZixLQUF5Q2xDLEtBQXpDO0FBQWdELG1CQUFha0IsRUFBN0Q7QUFBaUUsSUFBQSxJQUFJLEVBQUUvQjtBQUF2RSxLQURGLENBREY7QUFLRDs7QUNqQk0sU0FBU2dELE1BQVQsQ0FBZ0JuQyxLQUFoQixFQUF1QjtBQUM1QixRQUFNO0FBQUVvQyxJQUFBQSxLQUFGO0FBQVFGLElBQUFBLEtBQVI7QUFBY2hCLElBQUFBO0FBQWQsTUFBcUJsQixLQUEzQjtBQUNBLFNBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBQztBQUFsQixLQUE0QkEsS0FBNUIsR0FDR29DLEtBREgsQ0FERjtBQUtEOztBQ0RELE1BQU1GLEtBQUssR0FBRztBQUNaRyxFQUFBQSxjQUFjLEVBQUU7QUFDZHhCLElBQUFBLE9BQU8sRUFBRSxNQURLO0FBRWR5QixJQUFBQSxNQUFNLEVBQUU7QUFGTSxHQURKO0FBS1pDLEVBQUFBLEtBQUssRUFBRTtBQUNMeEIsSUFBQUEsT0FBTyxFQUFFLEVBREo7QUFFTEMsSUFBQUEsSUFBSSxFQUFFLENBRkQ7QUFHTHNCLElBQUFBLE1BQU0sRUFBRTtBQUhIO0FBTEssQ0FBZDtBQVllLFNBQVNFLE9BQVQsQ0FBaUI7QUFDOUJDLEVBQUFBLFFBRDhCO0FBRTlCQyxFQUFBQSxRQUY4QjtBQUc5QkMsRUFBQUEsZUFIOEI7QUFJOUJDLEVBQUFBLE1BSjhCO0FBSzlCQyxFQUFBQSxRQUw4QjtBQU05QkMsRUFBQUEsYUFOOEI7QUFPOUJqRCxFQUFBQTtBQVA4QixDQUFqQixFQVFaO0FBQ0QsUUFBTTtBQUFDQyxJQUFBQTtBQUFELE1BQWFGLFdBQVcsRUFBOUI7O0FBQ0EsV0FBU21ELHNCQUFULENBQWdDNUUsQ0FBaEMsRUFBa0M7QUFDaEMsVUFBTStDLEVBQUUsR0FBRS9DLENBQUMsQ0FBQzZFLE1BQUYsQ0FBUzlCLEVBQW5CO0FBQ0F5QixJQUFBQSxlQUFlLENBQUN4RSxDQUFELENBQWY7QUFDQSxVQUFNOEUsT0FBTyxHQUFHUixRQUFRLENBQUNyQyxJQUFULENBQWN4QixDQUFDLElBQUdBLENBQUMsQ0FBQ2lFLFFBQUYsS0FBYTNCLEVBQS9CLENBQWhCO0FBRUFwQixJQUFBQSxVQUFVLENBQUM7QUFBQ1QsTUFBQUEsWUFBWSxFQUFFLElBQUc0RCxPQUFPLENBQUNoRSxLQUFNLEVBQWhDO0FBQWtDRyxNQUFBQSxLQUFLLEVBQUM7QUFBeEMsS0FBRCxDQUFWO0FBQ0Q7O0FBQ0QsU0FFRSxlQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU4QyxLQUFLLENBQUNHO0FBQWxCLEtBQ0UsRUFBQyxTQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUVPLE1BRFQ7QUFFRSxJQUFBLEVBQUUsRUFBQyxjQUZMO0FBR0UsSUFBQSxJQUFJLEVBQUMsUUFIUDtBQUlFLElBQUEsUUFBUSxFQUFFRixRQUpaO0FBS0UsSUFBQSxLQUFLLEVBQUVSLEtBQUssQ0FBQ0s7QUFMZixJQURGLEVBUUUsRUFBQyxNQUFEO0FBQ0UsbUJBQVksWUFEZDtBQUVFLElBQUEsUUFBUSxFQUFFLENBQUNLLE1BRmI7QUFHRSxJQUFBLEtBQUssRUFBQyxRQUhSO0FBSUUsSUFBQSxPQUFPLEVBQUVFO0FBSlgsSUFSRixDQURGLEVBaUJFLEVBQUMsSUFBRDtBQUFNLElBQUEsRUFBRSxFQUFDO0FBQVQsS0FDR0wsUUFBUSxJQUNQQSxRQUFRLENBQUNTLE1BQVQsR0FBa0IsQ0FEbkIsSUFFQ1QsUUFBUSxDQUFDVSxHQUFULENBQWN2RSxDQUFELElBQU87QUFDbEIsV0FDRSxFQUFDLFFBQUQ7QUFBVSxNQUFBLEVBQUUsRUFBRUEsQ0FBQyxDQUFDaUUsUUFBaEI7QUFBMEIsTUFBQSxPQUFPLEVBQUVFO0FBQW5DLE9BQ0duRSxDQUFDLENBQUNpRSxRQURMLENBREY7QUFLRCxHQU5ELENBSEosQ0FqQkYsQ0FGRjtBQWlDRDs7QUNyRUQsTUFBTWpCLFFBQU0sR0FBRztBQUNid0IsRUFBQUEsSUFBSSxFQUFFO0FBQ0poQyxJQUFBQSxlQUFlLEVBQUUsU0FEYjtBQUVKaUMsSUFBQUEsTUFBTSxFQUFFO0FBRko7QUFETyxDQUFmO0FBTU8sU0FBU0MsTUFBVCxDQUFnQjtBQUFFckQsRUFBQUEsUUFBRjtBQUFZaUMsRUFBQUEsS0FBWjtBQUFtQmhCLEVBQUFBO0FBQW5CLENBQWhCLEVBQXlDO0FBQzlDLFNBQU87QUFBSyxtQkFBYUEsRUFBbEI7QUFBc0IsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHVSxRQUFNLENBQUN3QixJQUFaO0FBQWtCLFNBQUdsQjtBQUFyQjtBQUE3QixLQUE0RGpDLFFBQTVELENBQVA7QUFDRDs7QUNMRCxNQUFNaUMsT0FBSyxHQUFHO0FBQ1pxQixFQUFBQSxRQUFRLEVBQUU7QUFBRXpCLElBQUFBLFdBQVcsRUFBRTtBQUFmLEdBREU7QUFFWjBCLEVBQUFBLFlBQVksRUFBRTtBQUNaM0MsSUFBQUEsT0FBTyxFQUFFLE1BREc7QUFFWjRDLElBQUFBLFVBQVUsRUFBRSxRQUZBO0FBR1oxQyxJQUFBQSxPQUFPLEVBQUU7QUFIRyxHQUZGO0FBT1oyQyxFQUFBQSxNQUFNLEVBQUU7QUFDTjdDLElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU44QyxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdOTixJQUFBQSxNQUFNLEVBQUUsTUFIRjtBQUlOdkMsSUFBQUEsY0FBYyxFQUFFO0FBSlYsR0FQSTtBQWFaOEMsRUFBQUEsR0FBRyxFQUFFO0FBQ0g1QyxJQUFBQSxJQUFJLEVBQUUsQ0FESDtBQUVIYyxJQUFBQSxXQUFXLEVBQUU7QUFGVjtBQWJPLENBQWQ7QUFtQmUsU0FBUytCLEtBQVQsQ0FBZTtBQUFFQyxFQUFBQSxRQUFGO0FBQVlDLEVBQUFBLE9BQVo7QUFBcUJDLEVBQUFBO0FBQXJCLENBQWYsRUFBZ0Q7QUFDN0QsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRTlCLE9BQUssQ0FBQ3dCO0FBQXJCLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRXhCLE9BQUssQ0FBQ3NCO0FBQWxCLEtBQ0U7QUFBTyxJQUFBLElBQUksRUFBQyxVQUFaO0FBQXVCLElBQUEsS0FBSyxFQUFFdEIsT0FBSyxDQUFDcUIsUUFBcEM7QUFBOEMsSUFBQSxRQUFRLEVBQUVTO0FBQXhELElBREYsRUFFRSwwQkFGRixDQURGLEVBS0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFbkQsTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJFLE1BQUFBLE9BQU8sRUFBRTtBQUE1QjtBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsUUFBZDtBQUF1QixJQUFBLEtBQUssRUFBRW1CLE9BQUssQ0FBQzBCLEdBQXBDO0FBQXlDLElBQUEsT0FBTyxFQUFFRTtBQUFsRCxJQURGLEVBRUUsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsT0FBZDtBQUFzQixJQUFBLEtBQUssRUFBRTVCLE9BQUssQ0FBQzBCLEdBQW5DO0FBQXdDLElBQUEsRUFBRSxFQUFDLE9BQTNDO0FBQW1ELElBQUEsT0FBTyxFQUFFRztBQUE1RCxJQUZGLENBTEYsQ0FERjtBQVlEOztBQ25DTSxTQUFTRixPQUFULENBQWU7QUFDcEJSLEVBQUFBLE1BQU0sR0FBRyxFQURXO0FBRXBCOUIsRUFBQUEsS0FBSyxHQUFHLEVBRlk7QUFHcEIwQyxFQUFBQSxJQUFJLEdBQUcsTUFIYTtBQUlwQkMsRUFBQUEsS0FBSyxHQUFHLE9BSlk7QUFLcEJ6QyxFQUFBQSxPQUxvQjtBQU1wQlAsRUFBQUE7QUFOb0IsQ0FBZixFQU9KO0FBQ0QsU0FDRTtBQUNFLElBQUEsTUFBTSxFQUFFbUMsTUFEVjtBQUVFLElBQUEsT0FBTyxFQUFDLFdBRlY7QUFHRSxJQUFBLEtBQUssRUFBRTlCLEtBSFQ7QUFJRSxJQUFBLE9BQU8sRUFBRUUsT0FKWDtBQUtFLElBQUEsRUFBRSxFQUFFUDtBQUxOLEtBT0U7QUFBTSxJQUFBLENBQUMsRUFBQyxlQUFSO0FBQXdCLElBQUEsSUFBSSxFQUFFK0MsSUFBOUI7QUFBb0MsSUFBQSxFQUFFLEVBQUUvQztBQUF4QyxJQVBGLEVBUUU7QUFDRSxJQUFBLEVBQUUsRUFBRUEsRUFETjtBQUVFLElBQUEsSUFBSSxFQUFFZ0QsS0FGUjtBQUdFLElBQUEsQ0FBQyxFQUFDO0FBSEosSUFSRixDQURGO0FBZ0JEOztBQ3hCTSxTQUFTQyxNQUFULENBQWdCO0FBQUVsRSxFQUFBQSxRQUFGO0FBQVlpQyxFQUFBQTtBQUFaLENBQWhCLEVBQXFDO0FBQzFDLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMckIsTUFBQUEsT0FBTyxFQUFFLE1BREo7QUFFTEMsTUFBQUEsY0FBYyxFQUFFLFFBRlg7QUFHTHNELE1BQUFBLFNBQVMsRUFBRSxRQUhOO0FBSUwsU0FBR2xDO0FBSkU7QUFEVCxLQVFHakMsUUFSSCxDQURGO0FBWUQ7O0FDUkQsTUFBTWlDLE9BQUssR0FBRztBQUNad0IsRUFBQUEsTUFBTSxFQUFFO0FBQ043QyxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVOOEMsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTk4sSUFBQUEsTUFBTSxFQUFFLE1BSEY7QUFJTnZDLElBQUFBLGNBQWMsRUFBRTtBQUpWLEdBREk7QUFPWjhDLEVBQUFBLEdBQUcsRUFBRTtBQUNINUMsSUFBQUEsSUFBSSxFQUFFLENBREg7QUFFSGMsSUFBQUEsV0FBVyxFQUFFO0FBRlY7QUFQTyxDQUFkO0FBYWUsU0FBU3VDLE9BQVQsQ0FBaUI7QUFBRXBCLEVBQUFBLE9BQUY7QUFBV3FCLEVBQUFBLFNBQVg7QUFBc0JDLEVBQUFBO0FBQXRCLENBQWpCLEVBQWtEO0FBQy9ELFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVyQyxPQUFLLENBQUN3QixNQUFyQjtBQUE2QixJQUFBLEVBQUUsRUFBQztBQUFoQyxLQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFFO0FBQUVDLE1BQUFBLGFBQWEsRUFBRSxRQUFqQjtBQUEyQkYsTUFBQUEsVUFBVSxFQUFFO0FBQXZDO0FBQWYsS0FDRSxFQUFDSSxPQUFEO0FBQU8sSUFBQSxLQUFLLEVBQUMsSUFBYjtBQUFrQixJQUFBLE1BQU0sRUFBQyxJQUF6QjtBQUE4QixJQUFBLEtBQUssRUFBQztBQUFwQyxJQURGLEVBRUUsYUFBSVosT0FBTyxJQUFJQSxPQUFPLENBQUNKLFFBQXZCLENBRkYsZ0JBREYsRUFNRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUVoQyxNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkUsTUFBQUEsT0FBTyxFQUFFO0FBQTVCO0FBQVosS0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBQyxPQUFkO0FBQXNCLElBQUEsS0FBSyxFQUFFbUIsT0FBSyxDQUFDMEIsR0FBbkM7QUFBd0MsSUFBQSxPQUFPLEVBQUVXO0FBQWpELElBREYsRUFFRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBQyxTQUFkO0FBQXdCLElBQUEsS0FBSyxFQUFFckMsT0FBSyxDQUFDMEIsR0FBckM7QUFBMEMsSUFBQSxPQUFPLEVBQUVVO0FBQW5ELElBRkYsQ0FORixDQURGO0FBYUQ7O0FDaENNLFNBQVNFLE1BQVQsQ0FBZ0I7QUFDckJuQixFQUFBQSxNQUFNLEdBQUcsRUFEWTtBQUVyQjlCLEVBQUFBLEtBQUssR0FBRyxFQUZhO0FBR3JCMkMsRUFBQUEsS0FBSyxHQUFHLE9BSGE7QUFJckJELEVBQUFBLElBQUksR0FBRztBQUpjLENBQWhCLEVBS0o7QUFDRCxTQUNFO0FBQUssSUFBQSxNQUFNLEVBQUVaLE1BQWI7QUFBcUIsSUFBQSxPQUFPLEVBQUMsV0FBN0I7QUFBeUMsSUFBQSxLQUFLLEVBQUU5QjtBQUFoRCxLQUNFO0FBQ0UsSUFBQSxJQUFJLEVBQUUyQyxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQURGLEVBS0U7QUFBTSxJQUFBLENBQUMsRUFBQyxlQUFSO0FBQXdCLElBQUEsSUFBSSxFQUFFRDtBQUE5QixJQUxGLENBREY7QUFTRDs7QUNkTSxTQUFTUSxPQUFULENBQWlCO0FBQ3RCcEIsRUFBQUEsTUFBTSxHQUFHLEVBRGE7QUFFdEI5QixFQUFBQSxLQUFLLEdBQUcsRUFGYztBQUd0QjJDLEVBQUFBLEtBQUssR0FBRyxPQUhjO0FBSXRCRCxFQUFBQSxJQUFJLEdBQUc7QUFKZSxDQUFqQixFQUtKO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFLEVBQWI7QUFBaUIsSUFBQSxPQUFPLEVBQUMsV0FBekI7QUFBcUMsSUFBQSxLQUFLLEVBQUUxQztBQUE1QyxLQUNFO0FBQ0UsSUFBQSxJQUFJLEVBQUUyQyxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQURGLEVBS0U7QUFBTSxJQUFBLENBQUMsRUFBQyxlQUFSO0FBQXdCLElBQUEsSUFBSSxFQUFFRDtBQUE5QixJQUxGLENBREY7QUFTRDs7QUNYRCxNQUFNL0IsT0FBSyxHQUFHO0FBQ1p3QyxFQUFBQSxPQUFPLEVBQUU7QUFBRTdELElBQUFBLE9BQU8sRUFBRSxNQUFYO0FBQW1CNEMsSUFBQUEsVUFBVSxFQUFFLFFBQS9CO0FBQXlDa0IsSUFBQUEsTUFBTSxFQUFFO0FBQWpELEdBREc7QUFFWmYsRUFBQUEsR0FBRyxFQUFFO0FBQUU5QixJQUFBQSxXQUFXLEVBQUU7QUFBZixHQUZPO0FBR1o4QyxFQUFBQSxZQUFZLEVBQUU7QUFDWi9ELElBQUFBLE9BQU8sRUFBRSxNQURHO0FBRVo4QyxJQUFBQSxhQUFhLEVBQUU7QUFGSCxHQUhGO0FBT1pELEVBQUFBLE1BQU0sRUFBRTtBQUNON0MsSUFBQUEsT0FBTyxFQUFFLE1BREg7QUFFTjhDLElBQUFBLGFBQWEsRUFBRSxRQUZUO0FBR043QyxJQUFBQSxjQUFjLEVBQUUsZUFIVjtBQUlOdUMsSUFBQUEsTUFBTSxFQUFFO0FBSkYsR0FQSTtBQWFad0IsRUFBQUEsS0FBSyxFQUFFO0FBQ0xGLElBQUFBLE1BQU0sRUFBRSxDQURIO0FBRUw5RCxJQUFBQSxPQUFPLEVBQUUsTUFGSjtBQUdMQyxJQUFBQSxjQUFjLEVBQUU7QUFIWDtBQWJLLENBQWQ7QUFvQmUsU0FBU2dFLFNBQVQsQ0FBbUI7QUFDaENmLEVBQUFBLE9BRGdDO0FBRWhDZ0IsRUFBQUEsUUFGZ0M7QUFHaENDLEVBQUFBLFNBSGdDO0FBSWhDQyxFQUFBQSxjQUpnQztBQUtoQ0MsRUFBQUEscUJBTGdDO0FBTWhDQyxFQUFBQTtBQU5nQyxDQUFuQixFQU9aO0FBQ0QsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBRWpELE9BQUssQ0FBQ3dCO0FBQXJCLEtBQ0UsZUFDRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEtBQUssRUFBQyxlQUFoQjtBQUFnQyxJQUFBLFFBQVEsRUFBRXVCO0FBQTFDLElBREYsRUFFRSxFQUFDLFFBQUQ7QUFDRSxJQUFBLEtBQUssRUFBQyxzQkFEUjtBQUVFLElBQUEsUUFBUSxFQUFFQztBQUZaLElBRkYsQ0FERixFQVFFLGFBUkYsRUFTRTtBQUFLLElBQUEsS0FBSyxFQUFFaEQsT0FBSyxDQUFDMEM7QUFBbEIsS0FDRSxFQUFDLFVBQUQ7QUFBWSxJQUFBLEtBQUssRUFBQyxTQUFsQjtBQUE0QixJQUFBLElBQUksRUFBRUgsT0FBbEM7QUFBMkMsSUFBQSxPQUFPLEVBQUVPO0FBQXBELElBREYsRUFFRSxFQUFDLFVBQUQ7QUFBWSxJQUFBLEtBQUssRUFBQyxRQUFsQjtBQUEyQixJQUFBLElBQUksRUFBRVIsTUFBakM7QUFBeUMsSUFBQSxPQUFPLEVBQUVPO0FBQWxELElBRkYsRUFHRSxFQUFDLFVBQUQ7QUFBWSxJQUFBLEtBQUssRUFBQyxrQkFBbEI7QUFBcUMsSUFBQSxJQUFJLEVBQUVsQixPQUEzQztBQUFrRCxJQUFBLE9BQU8sRUFBRUU7QUFBM0QsSUFIRixDQVRGLEVBY0U7QUFBSyxJQUFBLEtBQUssRUFBRTdCLE9BQUssQ0FBQzJDO0FBQWxCLEtBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxPQUFPLEVBQUVNO0FBQWpCLFVBREYsQ0FkRixDQURGO0FBb0JEOztBQUVELFNBQVNDLFVBQVQsQ0FBb0I7QUFBRUMsRUFBQUEsSUFBRjtBQUFRakQsRUFBQUEsS0FBUjtBQUFlWCxFQUFBQTtBQUFmLENBQXBCLEVBQThDO0FBQzVDLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRVMsT0FBSyxDQUFDd0M7QUFBbEIsS0FDRTtBQUFRLElBQUEsS0FBSyxFQUFFeEMsT0FBSyxDQUFDMEIsR0FBckI7QUFBMEIsSUFBQSxPQUFPLEVBQUVuQztBQUFuQyxLQUNFLEVBQUMsSUFBRCxPQURGLENBREYsRUFJRSxlQUFNVyxLQUFOLENBSkYsQ0FERjtBQVFEOztBQUVELFNBQVNrRCxRQUFULENBQWtCO0FBQUVDLEVBQUFBLEtBQUY7QUFBU0MsRUFBQUE7QUFBVCxDQUFsQixFQUF1QztBQUNyQyxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRWIsTUFBQUEsTUFBTSxFQUFFLENBQVY7QUFBYTVDLE1BQUFBLFNBQVMsRUFBRTtBQUF4QjtBQUFaLEtBQ0U7QUFBTyxJQUFBLElBQUksRUFBQyxVQUFaO0FBQXVCLElBQUEsUUFBUSxFQUFFeUQ7QUFBakMsSUFERixFQUVFLGlCQUFRRCxLQUFSLENBRkYsQ0FERjtBQU1EOztBQ3pFYyxTQUFTRSxhQUFULENBQXVCO0FBQ3BDcEMsRUFBQUEsTUFBTSxHQUFHLEVBRDJCO0FBRXBDOUIsRUFBQUEsS0FBSyxHQUFHLEVBRjRCO0FBR3BDMkMsRUFBQUEsS0FBSyxHQUFHLE9BSDRCO0FBSXBDRCxFQUFBQSxJQUFJLEdBQUcsT0FKNkI7QUFLcEMvQixFQUFBQTtBQUxvQyxDQUF2QixFQU1aO0FBQ0QsU0FDRTtBQUFLLElBQUEsTUFBTSxFQUFFbUIsTUFBYjtBQUFxQixJQUFBLE9BQU8sRUFBQyxXQUE3QjtBQUF5QyxJQUFBLEtBQUssRUFBRTlCLEtBQWhEO0FBQXVELElBQUEsS0FBSyxFQUFFVztBQUE5RCxLQUNFO0FBQU0sSUFBQSxDQUFDLEVBQUMsZUFBUjtBQUF3QixJQUFBLElBQUksRUFBRStCO0FBQTlCLElBREYsRUFFRTtBQUNFLElBQUEsSUFBSSxFQUFFQyxLQURSO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQUZGLENBREY7QUFTRDs7QUNYRCxNQUFNaEMsT0FBSyxHQUFHO0FBQ1p3QixFQUFBQSxNQUFNLEVBQUU7QUFDTjdDLElBQUFBLE9BQU8sRUFBRSxNQURIO0FBRU44QyxJQUFBQSxhQUFhLEVBQUUsUUFGVDtBQUdON0MsSUFBQUEsY0FBYyxFQUFFO0FBSFY7QUFESSxDQUFkO0FBUWUsU0FBUzRFLE1BQVQsQ0FBZ0I7QUFBRXpDLEVBQUFBLE9BQUY7QUFBVzBDLEVBQUFBLFFBQVg7QUFBcUJDLEVBQUFBLGFBQXJCO0FBQW1DQyxFQUFBQSxXQUFuQztBQUFnRHBGLEVBQUFBO0FBQWhELENBQWhCLEVBQXlFO0FBQ3RGLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUV5QixPQUFLLENBQUN3QixNQUFyQjtBQUE0QixJQUFBLEVBQUUsRUFBQztBQUEvQixLQUNFLEVBQUMsTUFBRCxRQUNFLEVBQUNvQyxhQUFEO0FBQVcsSUFBQSxLQUFLLEVBQUM7QUFBakIsSUFERixDQURGLEVBSUUsRUFBQyxNQUFELG9DQUMwQixhQUFJN0MsT0FBTyxJQUFJQSxPQUFPLENBQUM4QyxLQUF2QixDQUQxQixDQUpGLEVBT0UsRUFBQyxTQUFEO0FBQVcsSUFBQSxFQUFFLEVBQUMsa0JBQWQ7QUFBaUMsSUFBQSxRQUFRLEVBQUVILGFBQTNDO0FBQTBELElBQUEsS0FBSyxFQUFFQztBQUFqRSxJQVBGLEVBUUUsRUFBQyxNQUFELFFBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsYUFBZDtBQUE0QixJQUFBLEVBQUUsRUFBQyxRQUEvQjtBQUF3QyxJQUFBLE9BQU8sRUFBRUYsUUFBakQ7QUFBMkQsbUJBQVk7QUFBdkUsSUFERixDQVJGLENBREY7QUFjRDs7QUMzQk0sU0FBU0ssSUFBVCxDQUFjO0FBQ25CM0MsRUFBQUEsTUFBTSxHQUFHLEVBRFU7QUFFbkI5QixFQUFBQSxLQUFLLEdBQUcsRUFGVztBQUduQjBDLEVBQUFBLElBQUksR0FBRyxNQUhZO0FBSW5CQyxFQUFBQSxLQUFLLEdBQUcsT0FKVztBQUtuQmhDLEVBQUFBO0FBTG1CLENBQWQsRUFNSjtBQUNELFNBQ0U7QUFBSyxJQUFBLE1BQU0sRUFBRW1CLE1BQWI7QUFBcUIsSUFBQSxPQUFPLEVBQUMsV0FBN0I7QUFBeUMsSUFBQSxLQUFLLEVBQUU5QixLQUFoRDtBQUF1RCxJQUFBLEtBQUssRUFBRVc7QUFBOUQsS0FDRTtBQUFNLElBQUEsQ0FBQyxFQUFDLGVBQVI7QUFBd0IsSUFBQSxJQUFJLEVBQUUrQjtBQUE5QixJQURGLEVBRUU7QUFDRSxJQUFBLElBQUksRUFBRUMsS0FEUjtBQUVFLElBQUEsQ0FBQyxFQUFDO0FBRkosSUFGRixDQURGO0FBU0Q7O0FDYkQsTUFBTWhDLE9BQUssR0FBRztBQUNad0IsRUFBQUEsTUFBTSxFQUFFO0FBQ043QyxJQUFBQSxPQUFPLEVBQUUsTUFESDtBQUVOOEMsSUFBQUEsYUFBYSxFQUFFLFFBRlQ7QUFHTjdDLElBQUFBLGNBQWMsRUFBRTtBQUhWO0FBREksQ0FBZDtBQU9lLFNBQVNtRixPQUFULENBQWlCO0FBQUVoRCxFQUFBQTtBQUFGLENBQWpCLEVBQThCO0FBQzNDLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUVmLE9BQUssQ0FBQ3dCLE1BQXJCO0FBQTZCLElBQUEsRUFBRSxFQUFDO0FBQWhDLEtBQ0UsRUFBQyxNQUFELFFBQ0UsRUFBQyxJQUFEO0FBQU0sSUFBQSxLQUFLLEVBQUMsSUFBWjtBQUFpQixJQUFBLE1BQU0sRUFBQyxJQUF4QjtBQUE2QixJQUFBLEtBQUssRUFBQztBQUFuQyxJQURGLENBREYsRUFJRSxFQUFDLE1BQUQsUUFDRSwrQ0FDZ0MsYUFBSVQsT0FBTyxJQUFJQSxPQUFPLENBQUM4QyxLQUF2QixDQURoQywyQ0FERixDQUpGLENBREY7QUFhRDs7QUN4QkQsTUFBTTdELE9BQUssR0FBRztBQUNaa0IsRUFBQUEsSUFBSSxFQUFFO0FBQ0o4QyxJQUFBQSxXQUFXLEVBQUUsU0FEVDtBQUVKQyxJQUFBQSxXQUFXLEVBQUUsT0FGVDtBQUdKQyxJQUFBQSxXQUFXLEVBQUUsQ0FIVDtBQUlKQyxJQUFBQSxZQUFZLEVBQUUsQ0FKVjtBQUtKdEYsSUFBQUEsT0FBTyxFQUFFLENBTEw7QUFNSkYsSUFBQUEsT0FBTyxFQUFFLE1BTkw7QUFPSjhDLElBQUFBLGFBQWEsRUFBRSxRQVBYO0FBUUo3QyxJQUFBQSxjQUFjLEVBQUUsZUFSWjtBQVNKd0YsSUFBQUEsU0FBUyxFQUFFLEVBVFA7QUFVSmxGLElBQUFBLGVBQWUsRUFBRTtBQVZiLEdBRE07QUFhWnlCLEVBQUFBLFFBQVEsRUFBRTtBQUFFZixJQUFBQSxXQUFXLEVBQUU7QUFBZixHQWJFO0FBY1p5RSxFQUFBQSxHQUFHLEVBQUU7QUFDSDFGLElBQUFBLE9BQU8sRUFBRSxNQUROO0FBRUhxRCxJQUFBQSxLQUFLLEVBQUUsU0FGSjtBQUdIc0MsSUFBQUEsUUFBUSxFQUFFO0FBSFA7QUFkTyxDQUFkO0FBcUJPLFNBQVNDLE9BQVQsQ0FBaUJ6RyxLQUFqQixFQUF3QjtBQUM3QixRQUFNO0FBQUUwRyxJQUFBQTtBQUFGLE1BQWMxRyxLQUFwQjtBQUNBLFFBQU07QUFBRTJHLElBQUFBLEtBQUY7QUFBUzlELElBQUFBO0FBQVQsTUFBc0I2RCxPQUE1QjtBQUNBLFFBQU0sQ0FBQ0UsSUFBRCxFQUFPQyxPQUFQLElBQWtCQyxHQUFRLENBQUMsQ0FBRCxDQUFoQztBQUNBLFFBQU0sQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLElBQW9CRixHQUFRLENBQUMsQ0FBRCxDQUFsQztBQUNBLFFBQU0sQ0FBQ0csT0FBRCxFQUFVQyxVQUFWLElBQXdCSixHQUFRLENBQUMsQ0FBRCxDQUF0QztBQUNBLFFBQU0sQ0FBQ0ssT0FBRCxFQUFVQyxVQUFWLElBQXdCTixHQUFRLENBQUMsQ0FBRCxDQUF0Qzs7QUFFQSxXQUFTTyxTQUFULENBQW1CQyxFQUFuQixFQUF1QjtBQUNyQixRQUFJOUksQ0FBSixFQUFPQyxDQUFQLEVBQVVILENBQVYsRUFBYWlKLENBQWI7QUFDQUEsSUFBQUEsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0gsRUFBRSxHQUFHLElBQWhCLENBQUo7QUFDQWhKLElBQUFBLENBQUMsR0FBR2tKLElBQUksQ0FBQ0MsS0FBTCxDQUFXRixDQUFDLEdBQUcsRUFBZixDQUFKO0FBQ0FBLElBQUFBLENBQUMsR0FBR0EsQ0FBQyxHQUFHLEVBQVI7QUFDQTlJLElBQUFBLENBQUMsR0FBRytJLElBQUksQ0FBQ0MsS0FBTCxDQUFXbkosQ0FBQyxHQUFHLEVBQWYsQ0FBSjtBQUNBQSxJQUFBQSxDQUFDLEdBQUdBLENBQUMsR0FBRyxFQUFSO0FBQ0FFLElBQUFBLENBQUMsR0FBR2dKLElBQUksQ0FBQ0MsS0FBTCxDQUFXaEosQ0FBQyxHQUFHLEVBQWYsQ0FBSjtBQUNBQSxJQUFBQSxDQUFDLEdBQUdBLENBQUMsR0FBRyxFQUFSO0FBQ0FvSSxJQUFBQSxPQUFPLENBQUNySSxDQUFELENBQVA7QUFDQXdJLElBQUFBLFFBQVEsQ0FBQ3ZJLENBQUQsQ0FBUjtBQUNBeUksSUFBQUEsVUFBVSxDQUFDNUksQ0FBRCxDQUFWO0FBQ0E4SSxJQUFBQSxVQUFVLENBQUNHLENBQUQsQ0FBVjtBQUNEOztBQUNERyxFQUFBQSxDQUFTLENBQUMsTUFBTTtBQUNkQyxJQUFBQSxVQUFVLENBQUMsTUFBTTtBQUNmTixNQUFBQSxTQUFTLENBQUNPLElBQUksQ0FBQ0MsR0FBTCxLQUFhbkIsT0FBTyxDQUFDb0IsU0FBdEIsQ0FBVDtBQUNELEtBRlMsRUFFUCxDQUZPLENBQVY7QUFHQUMsSUFBQUEsV0FBVyxDQUFDLE1BQU07QUFDaEJWLE1BQUFBLFNBQVMsQ0FBQ08sSUFBSSxDQUFDQyxHQUFMLEtBQWFuQixPQUFPLENBQUNvQixTQUF0QixDQUFUO0FBQ0QsS0FGVSxFQUVSLEtBRlEsQ0FBWDtBQUdELEdBUFEsRUFPTixFQVBNLENBQVQ7QUFTQSxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRXZHLE1BQUFBLEtBQUssRUFBRSxNQUFUO0FBQWdCUyxNQUFBQSxZQUFZLEVBQUM7QUFBN0I7QUFBWixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHRSxPQUFLLENBQUNrQixJQUFYO0FBQWlCdUQsTUFBQUE7QUFBakI7QUFBWixLQUNFO0FBQUssbUJBQVksU0FBakI7QUFBMkIsSUFBQSxLQUFLLEVBQUV6RSxPQUFLLENBQUN3RTtBQUF4QyxLQUFrREEsT0FBTyxJQUFJQSxPQUFPLENBQUNzQixJQUFyRSxDQURGLEVBRUU7QUFBSyxJQUFBLEtBQUssRUFBRTlGLE9BQUssQ0FBQ3FFO0FBQWxCLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRXJFLE9BQUssQ0FBQ1c7QUFBbEIsS0FBNkJBLFFBQVEsSUFBSUEsUUFBekMsTUFERixFQUVFLGVBQ0dvRSxPQUFPLEtBQUssQ0FBWixJQUFpQixxQkFEcEIsRUFFR0YsS0FBSyxLQUFLLENBQVYsSUFBZUUsT0FBTyxHQUFHLENBQXpCLElBQThCLGVBQU1BLE9BQU4sa0JBRmpDLEVBR0dGLEtBQUssR0FBRyxDQUFSLElBQWFILElBQUksS0FBSyxDQUF0QixJQUNDLGVBQ0dHLEtBREgsYUFDaUJFLE9BRGpCLGtCQUNzQyxHQUR0QyxDQUpKLEVBUUdMLElBQUksSUFBSSxFQUFSLElBQWNBLElBQUksR0FBRyxDQUFyQixJQUEwQixlQUFNQSxJQUFOLGNBUjdCLEVBU0dBLElBQUksR0FBRyxFQUFQLElBQWEsSUFBSWdCLElBQUosQ0FBU2xCLE9BQU8sQ0FBQ29CLFNBQWpCLENBVGhCLENBRkYsQ0FGRixDQURGLENBREY7QUFxQkQ7O0FDdEVELE1BQU01RixPQUFLLEdBQUc7QUFDWmtCLEVBQUFBLElBQUksRUFBRTtBQUNKdkMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSjhDLElBQUFBLGFBQWEsRUFBRSxRQUZYO0FBR0o3QyxJQUFBQSxjQUFjLEVBQUUsZUFIWjtBQUlKdUMsSUFBQUEsTUFBTSxFQUFFO0FBSko7QUFETSxDQUFkO0FBU2UsU0FBUzRFLE9BQVQsQ0FBaUI7QUFBRWhGLEVBQUFBLE9BQUY7QUFBV2lGLEVBQUFBLFFBQVg7QUFBcUJDLEVBQUFBO0FBQXJCLENBQWpCLEVBQW1EO0FBRWhFLFNBQ0UsRUFBQyxNQUFEO0FBQVEsSUFBQSxFQUFFLEVBQUM7QUFBWCxLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUVqRyxPQUFLLENBQUNrQjtBQUFsQixLQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRXBDLE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdlLE1BQUFBLFNBQVMsRUFBRSxFQUF0QjtBQUEwQkYsTUFBQUEsVUFBVSxFQUFFO0FBQXRDO0FBQVosS0FDR29CLE9BQU8sSUFBSUEsT0FBTyxDQUFDeUQsT0FBbkIsSUFDQyxFQUFDLE9BQUQ7QUFBUyxJQUFBLE9BQU8sRUFBRXpELE9BQU8sSUFBSUEsT0FBTyxDQUFDeUQsT0FBbkIsSUFBOEJ6RCxPQUFPLENBQUN5RDtBQUF4RCxJQUZKLENBREYsRUFPRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUU3RixNQUFBQSxPQUFPLEVBQUUsTUFBWDtBQUFtQkUsTUFBQUEsT0FBTyxFQUFFO0FBQTVCO0FBQVosS0FDRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLEVBQUUsRUFBQyxTQURMO0FBRUUsSUFBQSxPQUFPLEVBQUVvSCxTQUZYO0FBR0UsSUFBQSxLQUFLLEVBQUMsUUFIUjtBQUlFLElBQUEsS0FBSyxFQUFFO0FBQUVuSCxNQUFBQSxJQUFJLEVBQUUsQ0FBUjtBQUFXYyxNQUFBQSxXQUFXLEVBQUUsQ0FBeEI7QUFBMkJvQyxNQUFBQSxLQUFLLEVBQUU7QUFBbEM7QUFKVCxJQURGLEVBT0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsUUFETDtBQUVFLElBQUEsT0FBTyxFQUFFZ0UsUUFGWDtBQUdFLG1CQUFZLFlBSGQ7QUFJRSxJQUFBLEtBQUssRUFBQyxRQUpSO0FBS0UsSUFBQSxLQUFLLEVBQUU7QUFBRWxILE1BQUFBLElBQUksRUFBRSxDQUFSO0FBQVdhLE1BQUFBLFVBQVUsRUFBRSxDQUF2QjtBQUEwQnFDLE1BQUFBLEtBQUssRUFBRTtBQUFqQztBQUxULElBUEYsQ0FQRixDQURGLENBREY7QUEyQkQ7O0FDeENELE1BQU10QyxRQUFNLEdBQUc7QUFDYndCLEVBQUFBLElBQUksRUFBRTtBQUNKdkMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSjRDLElBQUFBLFVBQVUsRUFBRTtBQUZSLEdBRE87QUFLYmxCLEVBQUFBLEtBQUssRUFBRTtBQUFBO0FBTE0sQ0FBZjtBQVNPLFNBQVM2RixhQUFULENBQXVCO0FBQUV2QyxFQUFBQSxXQUFGO0FBQWVELEVBQUFBLGFBQWY7QUFBOEJ5QyxFQUFBQTtBQUE5QixDQUF2QixFQUFrRTtBQUN2RSxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUV6RyxRQUFNLENBQUN3QjtBQUFuQixLQUNFO0FBQU8sSUFBQSxJQUFJLEVBQUMsTUFBWjtBQUFtQixJQUFBLFFBQVEsRUFBRXdDLGFBQTdCO0FBQTZDLG1CQUFZO0FBQXpELElBREYsRUFFRSxlQUNFLEVBQUMsTUFBRDtBQUFRLElBQUEsS0FBSyxFQUFDLE1BQWQ7QUFBcUIsSUFBQSxFQUFFLEVBQUMsU0FBeEI7QUFBa0MsSUFBQSxPQUFPLEVBQUV5QyxTQUEzQztBQUFzRCxtQkFBWTtBQUFsRSxJQURGLENBRkYsQ0FERjtBQVFEOztBQ2pCRCxNQUFNekcsUUFBTSxHQUFHO0FBQ2IwRyxFQUFBQSxnQkFBZ0IsRUFBRTtBQUNqQjtBQUNBbkgsSUFBQUEsU0FBUyxFQUFFLFlBRk07QUFHZkMsSUFBQUEsZUFBZSxFQUFFLFFBSEY7QUFJaEJKLElBQUFBLElBQUksRUFBQyxFQUpXO0FBS2hCdUgsSUFBQUEsU0FBUyxFQUFFLE1BTEs7QUFNaEJDLElBQUFBLFNBQVMsRUFBRTtBQU5LO0FBREwsQ0FBZjtBQVdPLFNBQVNDLFFBQVQsQ0FBa0I7QUFDdkJDLEVBQUFBLFFBRHVCO0FBRXZCTCxFQUFBQSxTQUZ1QjtBQUd2QnpDLEVBQUFBLGFBSHVCO0FBSXZCQyxFQUFBQSxXQUp1QjtBQUt2QmhELEVBQUFBO0FBTHVCLENBQWxCLEVBTUo7QUFDRCxRQUFNOEYsV0FBVyxHQUFHQyxHQUFNLENBQUMsSUFBRCxDQUExQjtBQUVBbEIsRUFBQUEsQ0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJZ0IsUUFBSixFQUFjO0FBQ1pDLE1BQUFBLFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkMsU0FBcEIsR0FBZ0NILFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkUsWUFBcEQ7QUFDRDtBQUNGLEdBSlEsRUFJTixDQUFDTCxRQUFELENBSk0sQ0FBVDs7QUFNQSxXQUFTTSxNQUFULENBQWdCN0ssQ0FBaEIsRUFBbUI7QUFDakJrSyxJQUFBQSxTQUFTLENBQUNsSyxDQUFELENBQVQ7QUFDQXdLLElBQUFBLFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkMsU0FBcEIsR0FBZ0NILFdBQVcsQ0FBQ0UsT0FBWixDQUFvQkUsWUFBcEQ7QUFDRDs7QUFDRCxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRzVILE1BQUFBLFNBQVMsRUFBRSxZQUFkO0FBQTJCSSxNQUFBQSxLQUFLLEVBQUMsTUFBakM7QUFBd0M4QixNQUFBQSxNQUFNLEVBQUMsTUFBL0M7QUFBdURqQyxNQUFBQSxlQUFlLEVBQUMsUUFBdkU7QUFBaUZQLE1BQUFBLE9BQU8sRUFBQyxNQUF6RjtBQUFnRzhDLE1BQUFBLGFBQWEsRUFBQztBQUE5RztBQUFaLEtBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRS9CLFFBQU0sQ0FBQzBHLGdCQUFuQjtBQUFxQyxJQUFBLEdBQUcsRUFBRUs7QUFBMUMsS0FDR0QsUUFBUSxJQUNQQSxRQUFRLENBQUN4RixNQUFULEdBQWtCLENBRG5CLElBRUMrRixhQUFhLENBQUM7QUFBRVAsSUFBQUEsUUFBUSxFQUFFUSxZQUFZLENBQUM7QUFBRVIsTUFBQUE7QUFBRixLQUFELENBQXhCO0FBQXdDN0YsSUFBQUE7QUFBeEMsR0FBRCxDQUFiLENBQWtFTSxHQUFsRSxDQUNHN0UsQ0FBRCxJQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRXVDLE1BQUFBLE9BQU8sRUFBRTtBQUFYO0FBQVosS0FDRyxHQURILEVBRUUsRUFBQyxPQUFEO0FBQVMsSUFBQSxPQUFPLEVBQUV2QztBQUFsQixJQUZGLENBRkosQ0FISixDQURGLEVBYUU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFDMEMsTUFBQUEsSUFBSSxFQUFDLENBQU47QUFBU0ksTUFBQUEsZUFBZSxFQUFDO0FBQXpCO0FBQVosS0FDQSxFQUFDLGFBQUQ7QUFDRSxJQUFBLFNBQVMsRUFBRTRILE1BRGI7QUFFRSxJQUFBLFdBQVcsRUFBRW5ELFdBRmY7QUFHRSxJQUFBLGFBQWEsRUFBRUQ7QUFIakIsSUFEQSxDQWJGLENBREY7QUF3QkQ7O0FBQ0QsU0FBU3FELGFBQVQsQ0FBdUI7QUFBRVAsRUFBQUEsUUFBRjtBQUFZN0YsRUFBQUE7QUFBWixDQUF2QixFQUErQztBQUM3QyxNQUFJNkYsUUFBUSxJQUFJQSxRQUFRLENBQUN4RixNQUFULEdBQWtCLENBQTlCLElBQW1DTCxRQUF2QyxFQUFpRDtBQUMvQyxXQUFPNkYsUUFBUSxDQUFDdkYsR0FBVCxDQUFjZ0csR0FBRCxJQUFTO0FBQzNCLFVBQUlBLEdBQUcsQ0FBQ3RHLFFBQUosS0FBaUJBLFFBQXJCLEVBQStCO0FBQzdCLGVBQU8sRUFBRSxHQUFHc0csR0FBTDtBQUFVeEMsVUFBQUEsS0FBSyxFQUFFLE9BQWpCO0FBQTBCOUQsVUFBQUEsUUFBUSxFQUFFO0FBQXBDLFNBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLEVBQUUsR0FBR3NHLEdBQUw7QUFBVXhDLFVBQUFBLEtBQUssRUFBRTtBQUFqQixTQUFQO0FBQ0Q7QUFDRixLQU5NLENBQVA7QUFPRCxHQVJELE1BUU87QUFDTCxXQUFPLElBQVA7QUFDRDtBQUNGOztBQUNELFNBQVN1QyxZQUFULENBQXNCO0FBQUVSLEVBQUFBO0FBQUYsQ0FBdEIsRUFBb0M7QUFDbEMsTUFBSUEsUUFBSixFQUFjO0FBQ1osV0FBT0EsUUFBUSxDQUFDVSxJQUFULEVBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPLElBQVA7QUFDRDtBQUNGOztBQ3hFYyxTQUFTQyxRQUFULENBQWtCO0FBQy9CWCxFQUFBQSxRQUFRLEdBQUcsRUFEb0I7QUFFL0I5QyxFQUFBQSxhQUYrQjtBQUcvQnlDLEVBQUFBLFNBSCtCO0FBSS9CeEMsRUFBQUEsV0FKK0I7QUFLL0JoRCxFQUFBQTtBQUwrQixDQUFsQixFQU1aO0FBQ0QsU0FDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEVBQUUsRUFBQztBQUFYLEtBQ0UsRUFBQyxRQUFEO0FBQ0UsSUFBQSxRQUFRLEVBQUU2RixRQURaO0FBRUUsSUFBQSxTQUFTLEVBQUVMLFNBRmI7QUFHRSxJQUFBLGFBQWEsRUFBRXpDLGFBSGpCO0FBSUUsSUFBQSxXQUFXLE1BSmI7QUFLRSxJQUFBLFFBQVEsRUFBRS9DO0FBTFosSUFERixDQURGO0FBV0Q7O0FDdkJELE1BQU1YLE9BQUssR0FBRztBQUNaWCxFQUFBQSxLQUFLLEVBQUUsRUFESztBQUVaOEIsRUFBQUEsTUFBTSxFQUFFLEVBRkk7QUFJWmYsRUFBQUEsTUFBTSxFQUFFO0FBSkksQ0FBZDtBQU1PLFNBQVNnSCxZQUFULENBQXNCO0FBQUVDLEVBQUFBO0FBQUYsQ0FBdEIsRUFBc0M7QUFDM0MsTUFBSUEsVUFBVSxLQUFLLENBQW5CLEVBQXNCO0FBQ3BCLFdBQU8sRUFBQyxRQUFELE9BQVA7QUFDRCxHQUZELE1BRU8sSUFBSUEsVUFBVSxLQUFLLENBQW5CLEVBQXNCO0FBQzNCLFdBQU8sRUFBQyxVQUFELE9BQVA7QUFDRCxHQUZNLE1BRUEsSUFBSUEsVUFBVSxLQUFLLENBQW5CLEVBQXNCO0FBQzNCLFdBQU8sRUFBQyxPQUFELE9BQVA7QUFDRDs7QUFDRCxTQUFPLEVBQUMsU0FBRCxPQUFQO0FBQ0Q7QUFFTSxTQUFTQyxRQUFULEdBQW9CO0FBQ3pCLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUd0SCxPQUFMO0FBQVlkLE1BQUFBLGVBQWUsRUFBRTtBQUE3QixLQURUO0FBRUUsbUJBQVk7QUFGZCxJQURGO0FBTUQ7QUFFTSxTQUFTcUksU0FBVCxHQUFxQjtBQUMxQixTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHdkgsT0FBTDtBQUFZZCxNQUFBQSxlQUFlLEVBQUU7QUFBN0IsS0FEVDtBQUVFLG1CQUFZO0FBRmQsSUFERjtBQU1EO0FBRU0sU0FBU3NJLFVBQVQsR0FBc0I7QUFDM0IsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBR3hILE9BQUw7QUFBWWQsTUFBQUEsZUFBZSxFQUFFO0FBQTdCLEtBRFQ7QUFFRSxtQkFBWTtBQUZkLElBREY7QUFNRDtBQUVNLFNBQVN1SSxPQUFULEdBQW1CO0FBQ3hCLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUd6SCxPQUFMO0FBQVlkLE1BQUFBLGVBQWUsRUFBRTtBQUE3QixLQURUO0FBRUUsbUJBQVk7QUFGZCxJQURGO0FBTUQ7O0FDakRELE1BQU13SSxZQUFZLEdBQUdySyxDQUFhLEVBQWxDOztBQWNBLFNBQVNzSyxhQUFULENBQXVCN0osS0FBdkIsRUFBOEI7QUFFNUIsUUFBTTtBQUFFTyxJQUFBQTtBQUFGLE1BQWdCUCxLQUF0QjtBQUVBLFFBQU0sQ0FBQ2YsS0FBRCxFQUFRNkssUUFBUixJQUFvQmhELEdBQVEsQ0FBQ3ZHLFNBQUQsQ0FBbEM7QUFFQSxTQUFPLEVBQUMsWUFBRCxDQUFjLFFBQWQ7QUFBdUIsSUFBQSxLQUFLLEVBQUV0QjtBQUE5QixLQUF5Q2UsS0FBekMsRUFBUDtBQUNEOztBQ3BCTSxTQUFTK0osYUFBVCxDQUF1QjtBQUFFQyxFQUFBQTtBQUFGLENBQXZCLEVBQWlDO0FBQ3RDLFFBQU07QUFBQ2xLLElBQUFBO0FBQUQsTUFBYUYsV0FBVyxFQUE5Qjs7QUFFQSxXQUFTcUssV0FBVCxDQUFxQjlMLENBQXJCLEVBQXdCO0FBQ3RCLFVBQU07QUFBRStDLE1BQUFBO0FBQUYsUUFBUy9DLENBQUMsQ0FBQzZFLE1BQWpCO0FBQ0FsRCxJQUFBQSxVQUFVLENBQUM7QUFBQ1QsTUFBQUEsWUFBWSxFQUFDLEdBQWQ7QUFBa0JELE1BQUFBLEtBQUssRUFBRSxJQUFHOEIsRUFBRztBQUEvQixLQUFELENBQVY7QUFDRDs7QUFDRCxTQUNFLGVBQ0UsRUFBQyxJQUFELFFBQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsVUFBYjtBQUF3QixJQUFBLE9BQU8sRUFBRStJO0FBQWpDLGdCQURGLEVBSUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsT0FBYjtBQUFxQixJQUFBLE9BQU8sRUFBRUE7QUFBOUIsYUFKRixFQU9FLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFNBQWI7QUFBdUIsSUFBQSxPQUFPLEVBQUVBO0FBQWhDLGVBUEYsRUFVRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxRQUFiO0FBQXNCLElBQUEsT0FBTyxFQUFFQTtBQUEvQixjQVZGLEVBYUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsU0FBYjtBQUF1QixJQUFBLE9BQU8sRUFBRUE7QUFBaEMsZUFiRixFQWdCRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxTQUFiO0FBQXVCLElBQUEsT0FBTyxFQUFFQTtBQUFoQyxlQWhCRixFQW1CRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxVQUFiO0FBQXdCLElBQUEsT0FBTyxFQUFFQTtBQUFqQyxnQkFuQkYsRUF1QkUsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsV0FBYjtBQUF5QixJQUFBLE9BQU8sRUFBRUE7QUFBbEMsaUJBdkJGLEVBMEJFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFNBQWI7QUFBdUIsSUFBQSxPQUFPLEVBQUVBO0FBQWhDLGVBMUJGLEVBNkJFLEVBQUMsUUFBRDtBQUFVLElBQUEsRUFBRSxFQUFDLFVBQWI7QUFBd0IsSUFBQSxPQUFPLEVBQUVBO0FBQWpDLGdCQTdCRixFQWdDRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLEVBQUUsRUFBQyxRQUFiO0FBQXNCLElBQUEsT0FBTyxFQUFFQTtBQUEvQixvQkFoQ0YsRUFtQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxFQUFFLEVBQUMsUUFBYjtBQUFzQixJQUFBLE9BQU8sRUFBRUE7QUFBL0IsYUFuQ0YsQ0FERixDQURGO0FBMkNEOztBQ3RETSxNQUFNdkIsUUFBUSxHQUFFLENBQ25CO0FBQ0E3RixFQUFBQSxRQUFRLEVBQUMsT0FEVDtBQUVBbUYsRUFBQUEsSUFBSSxFQUFHLHdCQUZQO0FBR0FGLEVBQUFBLFNBQVMsRUFBRTtBQUhYLENBRG1CLEVBTXBCO0FBQ0NqRixFQUFBQSxRQUFRLEVBQUMsTUFEVjtBQUVDbUYsRUFBQUEsSUFBSSxFQUFHLDJCQUZSO0FBR0NGLEVBQUFBLFNBQVMsRUFBRTtBQUhaLENBTm9CLEVBVW5CO0FBQ0FqRixFQUFBQSxRQUFRLEVBQUMsT0FEVDtBQUVBbUYsRUFBQUEsSUFBSSxFQUFHLGtCQUZQO0FBR0FGLEVBQUFBLFNBQVMsRUFBRTtBQUhYLENBVm1CLEVBZXJCO0FBQ0VqRixFQUFBQSxRQUFRLEVBQUMsT0FEWDtBQUVFbUYsRUFBQUEsSUFBSSxFQUFHLG1CQUZUO0FBR0VGLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBZnFCLEVBb0JyQjtBQUNFakYsRUFBQUEsUUFBUSxFQUFDLE1BRFg7QUFFRW1GLEVBQUFBLElBQUksRUFBRyx1QkFGVDtBQUdFRixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQXBCcUIsR0EwQnJCO0FBQ0VqRixFQUFBQSxRQUFRLEVBQUMsTUFEWDtBQUVFbUYsRUFBQUEsSUFBSSxFQUFHLHNCQUZUO0FBR0VGLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBMUJxQixFQStCckI7QUFDRWpGLEVBQUFBLFFBQVEsRUFBQyxNQURYO0FBRUVtRixFQUFBQSxJQUFJLEVBQUcsc0JBRlQ7QUFHRUYsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0EvQnFCLEVBb0NyQjtBQUNFakYsRUFBQUEsUUFBUSxFQUFDLE9BRFg7QUFFRW1GLEVBQUFBLElBQUksRUFBRyxVQUZUO0FBR0VGLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBcENxQixFQXlDckI7QUFDRWpGLEVBQUFBLFFBQVEsRUFBQyxPQURYO0FBRUVtRixFQUFBQSxJQUFJLEVBQUcsVUFGVDtBQUdFRixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQXpDcUIsRUE4Q3JCO0FBQ0VqRixFQUFBQSxRQUFRLEVBQUMsT0FEWDtBQUVFbUYsRUFBQUEsSUFBSSxFQUFHLFVBRlQ7QUFHRUYsRUFBQUEsU0FBUyxFQUFFO0FBSGIsQ0E5Q3FCLEVBbURyQjtBQUNFakYsRUFBQUEsUUFBUSxFQUFDLE9BRFg7QUFFRW1GLEVBQUFBLElBQUksRUFBRyxVQUZUO0FBR0VGLEVBQUFBLFNBQVMsRUFBRTtBQUhiLENBbkRxQixFQXdEckI7QUFDRWpGLEVBQUFBLFFBQVEsRUFBQyxPQURYO0FBRUVtRixFQUFBQSxJQUFJLEVBQUcsVUFGVDtBQUdFRixFQUFBQSxTQUFTLEVBQUU7QUFIYixDQXhEcUIsQ0FBaEI7O0FDQUEsU0FBU29DLHFCQUFULENBQStCO0FBQUNDLEVBQUFBO0FBQUQsQ0FBL0IsRUFBZ0Q7QUFDbkQsU0FBU0EsY0FBYyxDQUFDQyxNQUFmLENBQXNCLENBQUNDLFdBQUQsRUFBY3hCLE9BQWQsRUFBdUJ5QixLQUF2QixLQUFpQztBQUM1RCxRQUFJQSxLQUFLLEtBQUssQ0FBZCxFQUFpQjtBQUNmLGFBQVFELFdBQVcsR0FBRyxDQUFDLEVBQUUsR0FBR3hCLE9BQUw7QUFBYzBCLFFBQUFBLFlBQVksRUFBRTtBQUE1QixPQUFELENBQXRCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTUMsR0FBRyxHQUFHSCxXQUFXLENBQUNqSyxJQUFaLENBQ1RoQyxDQUFELElBQU9BLENBQUMsQ0FBQ3lFLFFBQUYsS0FBZWdHLE9BQU8sQ0FBQ2hHLFFBQXZCLElBQW1DZ0csT0FBTyxDQUFDNUosS0FBUixLQUFrQixXQURsRCxDQUFaOztBQUdBLFVBQUl1TCxHQUFKLEVBQVM7QUFDUCxjQUFNRixLQUFLLEdBQUdELFdBQVcsQ0FBQ0ksU0FBWixDQUNYck0sQ0FBRCxJQUFPQSxDQUFDLENBQUN5RSxRQUFGLEtBQWVnRyxPQUFPLENBQUNoRyxRQURsQixDQUFkLENBRE87O0FBS1B3SCxRQUFBQSxXQUFXLENBQUNLLE1BQVosQ0FBbUJKLEtBQW5CLEVBQTBCLENBQTFCLEVBQTZCLEVBQzNCLEdBQUdFLEdBRHdCO0FBRTNCRCxVQUFBQSxZQUFZLEVBQUUsRUFBRUMsR0FBRyxDQUFDRDtBQUZPLFNBQTdCO0FBSUQsT0FURCxNQVNPO0FBQ0w7QUFDQUYsUUFBQUEsV0FBVyxDQUFDTSxJQUFaLENBQWlCLEVBQUUsR0FBRzlCLE9BQUw7QUFBYzBCLFVBQUFBLFlBQVksRUFBRTtBQUE1QixTQUFqQjtBQUNEO0FBQ0Y7O0FBQ0QsV0FBT0YsV0FBUDtBQUNELEdBdEJNLEVBc0JKLEVBdEJJLENBQVQ7QUF1Qkg7O0FDcEJjLFNBQVNPLGNBQVQsQ0FBd0I7QUFBRVQsRUFBQUEsY0FBRjtBQUFpQlUsRUFBQUE7QUFBakIsQ0FBeEIsRUFBMkQ7QUFDeEUsUUFBTSxDQUFDQyxLQUFELEVBQU9DLFFBQVAsSUFBa0JqRSxHQUFRLENBQUMsRUFBRCxDQUFoQztBQUNGWSxFQUFBQSxDQUFTLENBQUMsTUFBSTtBQUNkLFFBQUd5QyxjQUFILEVBQWtCO0FBQ2hCLFlBQU1hLE9BQU8sR0FBRWQscUJBQXFCLENBQUM7QUFBQ0MsUUFBQUE7QUFBRCxPQUFELENBQXBDO0FBQ0FZLE1BQUFBLFFBQVEsQ0FBQ0MsT0FBRCxDQUFSO0FBQ0Q7QUFFQSxHQU5RLEVBTVAsQ0FBQ2IsY0FBRCxDQU5PLENBQVQ7QUFRRSxTQUNFO0FBQUssbUJBQVk7QUFBakIsS0FDRSxFQUFDLElBQUQsUUFDR1csS0FBSyxJQUNKQSxLQUFLLENBQUM1SCxNQUFOLEdBQWUsQ0FEaEIsSUFFQzRILEtBQUssQ0FBQzNILEdBQU4sQ0FBV3RGLENBQUQsSUFBTztBQUNmO0FBQ0YsV0FBTyxFQUFDLFFBQUQ7QUFBVSxNQUFBLE9BQU8sRUFBRWdOLGNBQW5CO0FBQW1DLE1BQUEsRUFBRSxFQUFFaE4sQ0FBQyxDQUFDZ0Y7QUFBekMsT0FBb0RoRixDQUFDLENBQUNnRixRQUF0RCxPQUFnRTtBQUFLLE1BQUEsS0FBSyxFQUFFO0FBQUNxQixRQUFBQSxLQUFLLEVBQUM7QUFBUDtBQUFaLHFCQUEwQ3JHLENBQUMsQ0FBQzBNLFlBQTVDLENBQWhFLENBQVA7QUFDQyxHQUhELENBSEosQ0FERixDQURGO0FBWUQ7O0FDdkJELE1BQU1VLE9BQU8sR0FBRyxDQUNkO0FBQ0VwSSxFQUFBQSxRQUFRLEVBQUUsTUFEWjtBQUVFNUQsRUFBQUEsS0FBSyxFQUFFLFdBRlQ7QUFHRXlILEVBQUFBLE9BQU8sRUFBRTtBQUFFc0IsSUFBQUEsSUFBSSxFQUFFLFdBQVI7QUFBcUJGLElBQUFBLFNBQVMsRUFBRTtBQUFoQztBQUhYLENBRGMsRUFPZDtBQUNFakYsRUFBQUEsUUFBUSxFQUFFLE1BRFo7QUFFRTVELEVBQUFBLEtBQUssRUFBRSxXQUZUO0FBR0V5SCxFQUFBQSxPQUFPLEVBQUU7QUFBRXNCLElBQUFBLElBQUksRUFBRSxXQUFSO0FBQXFCRixJQUFBQSxTQUFTLEVBQUU7QUFBaEM7QUFIWCxDQVBjLEVBWWQ7QUFDRWpGLEVBQUFBLFFBQVEsRUFBRSxNQURaO0FBRUU1RCxFQUFBQSxLQUFLLEVBQUUsV0FGVDtBQUdFeUgsRUFBQUEsT0FBTyxFQUFFO0FBQUVzQixJQUFBQSxJQUFJLEVBQUUsV0FBUjtBQUFxQkYsSUFBQUEsU0FBUyxFQUFFO0FBQWhDO0FBSFgsQ0FaYyxDQUFoQjtBQW1CTyxTQUFTb0QsVUFBVCxHQUFzQjtBQUMzQixTQUFPLEVBQUNDLGNBQUQ7QUFBUSxJQUFBLGNBQWMsRUFBRWpCLHFCQUFxQixDQUFDO0FBQUNDLE1BQUFBLGNBQWMsRUFBQ2M7QUFBaEIsS0FBRDtBQUE3QyxJQUFQO0FBQ0Q7O0FDSkQsTUFBTXhJLFFBQVEsR0FBRyxDQUNmO0FBQUVJLEVBQUFBLFFBQVEsRUFBRTtBQUFaLENBRGUsRUFFZjtBQUFFQSxFQUFBQSxRQUFRLEVBQUU7QUFBWixDQUZlLEVBR2Y7QUFBRUEsRUFBQUEsUUFBUSxFQUFFO0FBQVosQ0FIZSxDQUFqQjtBQUtBLE1BQU1JLE9BQU8sR0FBRztBQUNkSixFQUFBQSxRQUFRLEVBQUUsVUFESTtBQUVka0QsRUFBQUEsS0FBSyxFQUFFLGdCQUZPO0FBR2RXLEVBQUFBLE9BQU8sRUFBRTtBQUFFc0IsSUFBQUEsSUFBSSxFQUFHLHdCQUFUO0FBQWtDRixJQUFBQSxTQUFTLEVBQUU7QUFBN0M7QUFISyxDQUFoQjtBQUtBLE1BQU1wQixPQUFPLEdBQUc7QUFDZDdELEVBQUFBLFFBQVEsRUFBRSxPQURJO0FBRWRtRixFQUFBQSxJQUFJLEVBQUcsd0JBRk87QUFHZEYsRUFBQUEsU0FBUyxFQUFFO0FBSEcsQ0FBaEI7O0FBTUFzRCxDQUFNLENBQ0osRUFBQyxhQUFEO0FBQ0UsRUFBQSxTQUFTLEVBQUU7QUFDVEMsSUFBQUEsT0FBTyxFQUFFO0FBQ1BDLE1BQUFBLFVBQVUsRUFBRSxTQURMO0FBRVBwSCxNQUFBQSxLQUFLLEVBQUUsU0FGQTtBQUdQcUgsTUFBQUEsVUFBVSxFQUFFO0FBSEw7QUFEQTtBQURiLEdBU0UsRUFBQyxnQkFBRDtBQUFrQixFQUFBLFNBQVMsRUFBRTtBQUFFbE0sSUFBQUEsWUFBWSxFQUFFLEdBQWhCO0FBQXFCRCxJQUFBQSxLQUFLLEVBQUU7QUFBNUI7QUFBN0IsR0FDRSxFQUFDLFVBQUQ7QUFBWSxFQUFBLGFBQWEsRUFBRSxFQUFDLGFBQUQ7QUFBM0IsR0FDRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxPQUFEO0FBQVMsRUFBQSxRQUFRLEVBQUVxRDtBQUFuQixFQURGLENBREYsRUFJRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxLQUFEO0FBQU8sRUFBQSxPQUFPLEVBQUVRO0FBQWhCLEVBREYsQ0FKRixFQU9FLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLE9BQUQ7QUFBUyxFQUFBLE9BQU8sRUFBRUE7QUFBbEIsRUFERixDQVBGLEVBVUUsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsU0FBRDtBQUFXLEVBQUEsT0FBTyxFQUFFQTtBQUFwQixFQURGLENBVkYsRUFhRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxNQUFEO0FBQVEsRUFBQSxPQUFPLEVBQUVBO0FBQWpCLEVBREYsQ0FiRixFQWdCRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsRUFBQyxPQUFEO0FBQVMsRUFBQSxPQUFPLEVBQUVBO0FBQWxCLEVBREYsQ0FoQkYsRUFtQkUsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsT0FBRDtBQUFTLEVBQUEsT0FBTyxFQUFFQTtBQUFsQixFQURGLENBbkJGLEVBc0JFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLE9BQU8sRUFBRUEsT0FBbkI7QUFBNEIsRUFBQSxRQUFRLEVBQUV5RixRQUF0QztBQUFnRCxFQUFBLFFBQVEsRUFBQztBQUF6RCxFQURGLENBdEJGLEVBeUJFLEVBQUMsUUFBRDtBQUFVLEVBQUEsSUFBSSxFQUFDO0FBQWYsR0FDRTtBQUFLLEVBQUEsS0FBSyxFQUFFO0FBQUUzSCxJQUFBQSxPQUFPLEVBQUUsRUFBWDtBQUFlSyxJQUFBQSxlQUFlLEVBQUU7QUFBaEM7QUFBWixHQUNFLEVBQUMsT0FBRDtBQUFTLEVBQUEsT0FBTyxFQUFFc0YsT0FBbEI7QUFBMkIsRUFBQSxRQUFRLEVBQUV6RCxPQUFPLENBQUNKO0FBQTdDLEVBREYsQ0FERixDQXpCRixFQThCRSxFQUFDLFFBQUQ7QUFBVSxFQUFBLElBQUksRUFBQztBQUFmLEdBQ0UsZUFDRSxFQUFDLFlBQUQ7QUFBYyxFQUFBLE1BQU07QUFBcEIsRUFERixFQUVFLEVBQUMsWUFBRCxPQUZGLENBREYsQ0E5QkYsRUFvQ0UsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsUUFBRDtBQUFVLEVBQUEsT0FBTyxFQUFFSSxPQUFuQjtBQUE0QixFQUFBLFFBQVEsRUFBRXlGLFFBQXRDO0FBQWdELEVBQUEsUUFBUSxFQUFDO0FBQXpELEVBREYsQ0FwQ0YsRUF1Q0UsRUFBQyxRQUFEO0FBQVUsRUFBQSxJQUFJLEVBQUM7QUFBZixHQUNFLEVBQUMsVUFBRCxPQURGLENBdkNGLENBREYsQ0FURixDQURJLEVBd0RKOEMsUUFBUSxDQUFDQyxJQXhETCxDQUFOIn0=
