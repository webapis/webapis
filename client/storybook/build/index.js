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

const RouteContext = M();
function Route(props) {
  const {
    children,
    path,
    paths
  } = props;
  const [route] = useRouteContext();

  if (path && route === path) {
    return children;
  } else if (paths && route === paths.find(p => p === route)) {
    return children;
  }

  return null;
}
function useRouteContext() {
  const context = w$1(RouteContext);

  if (!context) {
    throw new Error('useRouteContext must be used with RouteProvider');
  }

  return context;
} //

function RouteProvider(props) {
  const {
    initialRoute
  } = props;
  const [route, setRoute] = m$1(initialRoute);
  const value = h$1(() => [route, setRoute], [route]);
  return h(RouteContext.Provider, _extends({
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

const actionTypes = {
  APP_ROUTE_CHANGED: 'APP_ROUTE_CHANGED',
  FEATURE_ROUTE_CHANGED: 'FEATURE_ROUTE_CHANGED'
};

const AppRouteContext = M();

function useAppRouteContext() {
  const context = w$1(AppRouteContext);
  l(() => {
    if (context) {
      debugger;
    }
  }, [context]);

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
  users,
  onStartSearch
}) {
  const {
    onAppRoute
  } = useAppRoute();

  function handleHangoutSelection(e) {
    const id = e.target.id;
    onSelectHangout(e);
    const hangout = hangouts.find(g => g.username === id);
    debugger;
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
  const message = { ...hangout.message,
    username: hangout.username
  };
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
  }, h(Message, {
    message: message && message
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
    width: '100%',
    // backgroundColor: 'orange',
    height: '20vh',
    overflow: 'auto'
  }
};
function Messages({
  messages,
  username,
  onMessage,
  onMessageText,
  messageText
}) {
  const scrollerRef = d$1(null);

  function onSend(e) {
    onMessage(e);
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }

  return h("div", null, h("div", {
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
  })))), h(MessageEditor, {
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
  const [route, setRoute] = useRouteContext();

  function handleRoute(e) {
    const {
      id
    } = e.target;
    setRoute(`/${id}`);
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
  }, "onlineStatus")));
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
};
H(h(ThemeProvider, {
  initState: {
    primary: {
      background: '#6200EE',
      color: '#ffffff',
      fontFamily: 'Roboto, Helvetica, "Arial"'
    }
  }
}, h(RouteProvider, {
  initialRoute: "/messages"
}, h(Navigation, {
  drawerContent: h(DrawerContent, null)
}, h(Route, {
  path: "/hangouts"
}, h(Hangout, {
  hangouts: hangouts
})), h(Route, {
  path: "/block"
}, h(Block, {
  hangout: hangout
})), h(Route, {
  path: "/blocked"
}, h(Blocked, {
  hangout: hangout
})), h(Route, {
  path: "/configure"
}, h(Configure, {
  hangout: hangout
})), h(Route, {
  path: "/invite"
}, h(Invite, {
  hangout: hangout
})), h(Route, {
  path: "/invitee"
}, h(Invitee, {
  hangout: hangout
})), h(Route, {
  path: "/inviter"
}, h(Inviter, {
  hangout: hangout
})), h(Route, {
  path: "/hangchat"
}, h(Hangchat, {
  hangout: hangout,
  messages: messages,
  username: "demo"
})), h(Route, {
  path: "/message"
}, h("div", {
  style: {
    padding: 20,
    backgroundColor: '#eeeeeee'
  }
}, h(Message, {
  message: message,
  username: hangout.username
}))), h(Route, {
  path: "/online"
}, h("div", null, h(OnlineStatus, {
  online: true
}), h(OnlineStatus, null))), h(Route, {
  path: "/messages"
}, h(Hangchat, {
  hangout: hangout,
  messages: messages,
  username: "demo"
}))))), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL3JvdXRlL3JvdXRlci5qcyIsIi4uL05hdmlnYXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vbGF5b3V0L05hdkxpc3QuanMiLCIuLi8uLi9sYXlvdXQvVGV4dElucHV0LmpzIiwiLi4vLi4vbGF5b3V0L0J1dHRvbi5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vaGFuZ291dHMvSGFuZ291dC5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0xheW91dC5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrLmpzIiwiLi4vLi4vbGF5b3V0L2ljb25zL0Jsb2NrLmpzIiwiLi4vLi4vbGF5b3V0L0NlbnRlci5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0Jsb2NrZWQuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvRGVsZXRlLmpzIiwiLi4vLi4vbGF5b3V0L2ljb25zL0FyY2hpdmUuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9Db25maWd1cmUuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvUGVyc29uQWRkLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlLmpzIiwiLi4vLi4vbGF5b3V0L2ljb25zL0RvbmUuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVlLmpzIiwiLi4vLi4vaGFuZ291dHMvdWkvTWVzc2FnZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZXIuanMiLCIuLi8uLi9oYW5nb3V0cy91aS9NZXNzYWdlRWRpdG9yLmpzIiwiLi4vLi4vaGFuZ291dHMvdWkvTWVzc2FnZXMuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9IYW5nY2hhdC5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi90aGVtZS90aGVtZS1jb250ZXh0LmpzIiwiLi4vRHJhd2VyQ29udGVudC5qcyIsIi4uL2Zha2VNZXNzYWdlcy5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLGE9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmR8aXRlcmEvaTtmdW5jdGlvbiBzKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiB5KG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiB5KGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHAoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gayhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGsobil9fWZ1bmN0aW9uIGcobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9cyh7fSxvKSkuX192PWksdD16KGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmsobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLGEscyl7dmFyIGgscCxtLGssZyxfLGIseCxBLFA9aSYmaS5fX2t8fGMsQz1QLmxlbmd0aDtmb3IoYT09ZSYmKGE9bnVsbCE9cj9yWzBdOkM/dyhpLDApOm51bGwpLHUuX19rPVtdLGg9MDtoPGwubGVuZ3RoO2grKylpZihudWxsIT0oaz11Ll9fa1toXT1udWxsPT0oaz1sW2hdKXx8XCJib29sZWFuXCI9PXR5cGVvZiBrP251bGw6XCJzdHJpbmdcIj09dHlwZW9mIGt8fFwibnVtYmVyXCI9PXR5cGVvZiBrP3kobnVsbCxrLG51bGwsbnVsbCxrKTpBcnJheS5pc0FycmF5KGspP3koZCx7Y2hpbGRyZW46a30sbnVsbCxudWxsLG51bGwpOm51bGwhPWsuX19lfHxudWxsIT1rLl9fYz95KGsudHlwZSxrLnByb3BzLGsua2V5LG51bGwsay5fX3YpOmspKXtpZihrLl9fPXUsay5fX2I9dS5fX2IrMSxudWxsPT09KG09UFtoXSl8fG0mJmsua2V5PT1tLmtleSYmay50eXBlPT09bS50eXBlKVBbaF09dm9pZCAwO2Vsc2UgZm9yKHA9MDtwPEM7cCsrKXtpZigobT1QW3BdKSYmay5rZXk9PW0ua2V5JiZrLnR5cGU9PT1tLnR5cGUpe1BbcF09dm9pZCAwO2JyZWFrfW09bnVsbH1pZihnPXoobixrLG09bXx8ZSx0LG8scixmLGEscyksKHA9ay5yZWYpJiZtLnJlZiE9cCYmKHh8fCh4PVtdKSxtLnJlZiYmeC5wdXNoKG0ucmVmLG51bGwsaykseC5wdXNoKHAsay5fX2N8fGcsaykpLG51bGwhPWcpe2lmKG51bGw9PWImJihiPWcpLEE9dm9pZCAwLHZvaWQgMCE9PWsuX19kKUE9ay5fX2Qsay5fX2Q9dm9pZCAwO2Vsc2UgaWYocj09bXx8ZyE9YXx8bnVsbD09Zy5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWF8fGEucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZChnKSxBPW51bGw7ZWxzZXtmb3IoXz1hLHA9MDsoXz1fLm5leHRTaWJsaW5nKSYmcDxDO3ArPTIpaWYoXz09ZylicmVhayBuO24uaW5zZXJ0QmVmb3JlKGcsYSksQT1hfVwib3B0aW9uXCI9PXUudHlwZSYmKG4udmFsdWU9XCJcIil9YT12b2lkIDAhPT1BP0E6Zy5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LnR5cGUmJih1Ll9fZD1hKX1lbHNlIGEmJm0uX19lPT1hJiZhLnBhcmVudE5vZGUhPW4mJihhPXcobSkpfWlmKHUuX19lPWIsbnVsbCE9ciYmXCJmdW5jdGlvblwiIT10eXBlb2YgdS50eXBlKWZvcihoPXIubGVuZ3RoO2gtLTspbnVsbCE9cltoXSYmdihyW2hdKTtmb3IoaD1DO2gtLTspbnVsbCE9UFtoXSYmRChQW2hdLFBbaF0pO2lmKHgpZm9yKGg9MDtoPHgubGVuZ3RoO2grKylqKHhbaF0seFsrK2hdLHhbKytoXSl9ZnVuY3Rpb24geChuKXtyZXR1cm4gbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuP1tdOkFycmF5LmlzQXJyYXkobik/Yy5jb25jYXQuYXBwbHkoW10sbi5tYXAoeCkpOltuXX1mdW5jdGlvbiBBKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxDKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8QyhuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIFAobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1hLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gQyhuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxQKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fFAobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLE4sciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLE4scikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIE4obCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIHoobCx1LGksdCxvLHIsZixlLGMpe3ZhciBhLHYsaCx5LHAsdyxrLGcsXyx4LEEsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsoYT1uLl9fYikmJmEodSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoZz11LnByb3BzLF89KGE9UC5jb250ZXh0VHlwZSkmJnRbYS5fX2NdLHg9YT9fP18ucHJvcHMudmFsdWU6YS5fXzp0LGkuX19jP2s9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoZyx4KToodS5fX2M9dj1uZXcgbShnLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWcsdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9cyh7fSx2Ll9fcykpLHModi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoZyx2Ll9fcykpKSx5PXYucHJvcHMscD12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmZyE9PXkmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGcseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShnLHYuX19zLHgpfHx1Ll9fdj09PWkuX192KXtmb3Iodi5wcm9wcz1nLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGE9MDthPHUuX19rLmxlbmd0aDthKyspdS5fX2tbYV0mJih1Ll9fa1thXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGcsdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZSh5LHAsdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWcsdi5zdGF0ZT12Ll9fcywoYT1uLl9fcikmJmEodSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLGE9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PXMocyh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSh5LHApKSxBPW51bGwhPWEmJmEudHlwZT09ZCYmbnVsbD09YS5rZXk/YS5wcm9wcy5jaGlsZHJlbjphLGIobCxBcnJheS5pc0FycmF5KEEpP0E6W0FdLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGsmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KGE9bi5kaWZmZWQpJiZhKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIGEscyx2LGgseSxwPXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihhPTA7YTxvLmxlbmd0aDthKyspaWYobnVsbCE9KHM9b1thXSkmJigobnVsbD09PWwudHlwZT8zPT09cy5ub2RlVHlwZTpzLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PXMpKXtuPXMsb1thXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXAhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0ocD11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKG51bGwhPW8pZm9yKHA9e30seT0wO3k8bi5hdHRyaWJ1dGVzLmxlbmd0aDt5KyspcFtuLmF0dHJpYnV0ZXNbeV0ubmFtZV09bi5hdHRyaWJ1dGVzW3ldLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9QShuLGQscCx0LGYpLGg/bC5fX2s9W106KGE9bC5wcm9wcy5jaGlsZHJlbixiKG4sQXJyYXkuaXNBcnJheShhKT9hOlthXSxsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PShhPWQudmFsdWUpJiZhIT09bi52YWx1ZSYmQyhuLFwidmFsdWVcIixhLHAudmFsdWUsITEpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09KGE9ZC5jaGVja2VkKSYmYSE9PW4uY2hlY2tlZCYmQyhuLFwiY2hlY2tlZFwiLGEscC5jaGVja2VkLCExKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10seih1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6dS5jaGlsZE5vZGVzLmxlbmd0aD9jLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKTpudWxsLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXt2YXIgdSxpO2ZvcihpIGluIGw9cyhzKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSksdT17fSxsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKHVbaV09bFtpXSk7cmV0dXJuIHkobi50eXBlLHUsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsZyhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1LlByb3ZpZGVyLl9fPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gZyh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9cyh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJnModSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksZyh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxnKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCxwIGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCx1LHIsaT0wLG89W10sYz1uLl9fcixmPW4uZGlmZmVkLGU9bi5fX2MsYT1uLnVubW91bnQ7ZnVuY3Rpb24gdih0LHIpe24uX19oJiZuLl9faCh1LHQsaXx8ciksaT0wO3ZhciBvPXUuX19IfHwodS5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj1vLl9fLmxlbmd0aCYmby5fXy5wdXNoKHt9KSxvLl9fW3RdfWZ1bmN0aW9uIG0obil7cmV0dXJuIGk9MSxwKEUsbil9ZnVuY3Rpb24gcChuLHIsaSl7dmFyIG89dih0KyssMik7cmV0dXJuIG8udD1uLG8uX19jfHwoby5fX2M9dSxvLl9fPVtpP2kocik6RSh2b2lkIDAsciksZnVuY3Rpb24obil7dmFyIHQ9by50KG8uX19bMF0sbik7by5fX1swXSE9PXQmJihvLl9fWzBdPXQsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIGwocixpKXt2YXIgbz12KHQrKywzKTshbi5fX3MmJngoby5fX0gsaSkmJihvLl9fPXIsby5fX0g9aSx1Ll9fSC5fX2gucHVzaChvKSl9ZnVuY3Rpb24geShyLGkpe3ZhciBvPXYodCsrLDQpOyFuLl9fcyYmeChvLl9fSCxpKSYmKG8uX189cixvLl9fSD1pLHUuX19oLnB1c2gobykpfWZ1bmN0aW9uIGQobil7cmV0dXJuIGk9NSxoKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBzKG4sdCx1KXtpPTYseShmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09dT91OnUuY29uY2F0KG4pKX1mdW5jdGlvbiBoKG4sdSl7dmFyIHI9dih0KyssNyk7cmV0dXJuIHgoci5fX0gsdSk/KHIuX19IPXUsci5fX2g9bixyLl9fPW4oKSk6ci5fX31mdW5jdGlvbiBUKG4sdCl7cmV0dXJuIGk9OCxoKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIHcobil7dmFyIHI9dS5jb250ZXh0W24uX19jXSxpPXYodCsrLDkpO3JldHVybiBpLl9fYz1uLHI/KG51bGw9PWkuX18mJihpLl9fPSEwLHIuc3ViKHUpKSxyLnByb3BzLnZhbHVlKTpuLl9ffWZ1bmN0aW9uIEEodCx1KXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZSh1P3UodCk6dCl9ZnVuY3Rpb24gRihuKXt2YXIgcj12KHQrKywxMCksaT1tKCk7cmV0dXJuIHIuX189bix1LmNvbXBvbmVudERpZENhdGNofHwodS5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXtyLl9fJiZyLl9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIF8oKXtvLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faC5mb3JFYWNoKHEpLHQuX19ILl9faD1bXX1jYXRjaCh1KXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHUsdC5fX3YpLCEwfX0pLG89W119ZnVuY3Rpb24gZyhuKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnUmJm4udSgpfWZ1bmN0aW9uIHEobil7bi51PW4uX18oKX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHUpe3JldHVybiB0IT09blt1XX0pfWZ1bmN0aW9uIEUobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtjJiZjKG4pLHQ9MDt2YXIgcj0odT1uLl9fYykuX19IO3ImJihyLl9faC5mb3JFYWNoKGcpLHIuX19oLmZvckVhY2gocSksci5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciB1PXQuX19jO3UmJnUuX19IJiZ1Ll9fSC5fX2gubGVuZ3RoJiYoMSE9PW8ucHVzaCh1KSYmcj09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHI9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCx1PWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHI9c2V0VGltZW91dCh1LDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHUpKX0pKF8pKX0sbi5fX2M9ZnVuY3Rpb24odCx1KXt1LnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goZyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxxKG4pfSl9Y2F0Y2gocil7dS5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSksdT1bXSxuLl9fZShyLHQuX192KX19KSxlJiZlKHQsdSl9LG4udW5tb3VudD1mdW5jdGlvbih0KXthJiZhKHQpO3ZhciB1PXQuX19jO2lmKHUmJnUuX19IKXRyeXt1Ll9fSC5fXy5mb3JFYWNoKGcpfWNhdGNoKHQpe24uX19lKHQsdS5fX3YpfX07ZXhwb3J0e20gYXMgdXNlU3RhdGUscCBhcyB1c2VSZWR1Y2VyLGwgYXMgdXNlRWZmZWN0LHkgYXMgdXNlTGF5b3V0RWZmZWN0LGQgYXMgdXNlUmVmLHMgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxoIGFzIHVzZU1lbW8sVCBhcyB1c2VDYWxsYmFjayx3IGFzIHVzZUNvbnRleHQsQSBhcyB1c2VEZWJ1Z1ZhbHVlLEYgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbcm91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XHJcblxyXG4gIGlmIChwYXRoICYmIHJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiByb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gcm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xyXG4gIGNvbnN0IHsgdG8sIGlkIH0gPSBwcm9wcztcclxuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldFJvdXRlKHRvKTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxhXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgey4uLnByb3BzfVxyXG4gICAgICBocmVmPXt0b31cclxuICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9XHJcbiAgICAgIHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiAnaW5oZXJpdCcgfX1cclxuICAgIC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChSb3V0ZUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGluaXRpYWxSb3V0ZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VTdGF0ZShpbml0aWFsUm91dGUpO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3JvdXRlLCBzZXRSb3V0ZV0sIFtyb3V0ZV0pO1xyXG5cclxuICByZXR1cm4gPFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdmlnYXRpb24ocHJvcHMpIHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgZHJhd2VyQ29udGVudCB9ID0gcHJvcHM7XG5cblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8aDEgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIHBhZGRpbmc6IDUgfX0+XG4gICAgICAgIFN0b3J5Ym9va1xuICAgICAgPC9oMT5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEgfX0+e2RyYXdlckNvbnRlbnR9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMTAgfX0+e2NoaWxkcmVufTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPntjaGlsZHJlbn08L2Rpdj47XG59XG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGZ1bmN0aW9uIExpc3QoeyBjaGlsZHJlbiwgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXHJcblxyXG4gICAgICAgIHBhZGRpbmdUb3A6IDgsXHJcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogOCxcclxuICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGlzdEl0ZW0oeyBjaGlsZHJlbiwgb25DbGljaywgaWQgfSkge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBpZD17aWR9XHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPSdkcmF3ZXItbGlzdC1pdGVtJ1xyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgICAgIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgICBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHBhZGRpbmdUb3A6IDgsXHJcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogOCxcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcGFkZGluZzogOCxcclxuICBtYXJnaW5MZWZ0OiAxNixcclxuICBtYXJnaW5SaWdodDogMTYsXHJcbiAgbWFyZ2luVG9wOiA4LFxyXG4gIG1hcmdpbkJvdHRvbTogOCxcclxuICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICBmbGV4OiAxLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xyXG4gIGNvbnN0IHsgaWQsIHR5cGUgPSAndGV4dCcsc3R5bGUgfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4Jywgd2lkdGg6ICcxMDAlJyB9fT5cclxuICAgICAgPGlucHV0ICBzdHlsZT17ey4uLnN0eWxlcywuLi5zdHlsZX19IHsuLi5wcm9wc30gZGF0YS10ZXN0aWQ9e2lkfSB0eXBlPXt0eXBlfSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xuICBjb25zdCB7IHRpdGxlLHN0eWxlLGlkIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIHsuLi5wcm9wc30+XG4gICAgICB7dGl0bGV9XG4gICAgPC9idXR0b24+XG4gICk7XG59XG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcbiAgICBBUFBfUk9VVEVfQ0hBTkdFRDonQVBQX1JPVVRFX0NIQU5HRUQnLFxuICAgIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8sdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHtyZWR1Y2VyfSBmcm9tICcuL3JlZHVjZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmNvbnN0IEFwcFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbiBmdW5jdGlvbiB1c2VBcHBSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwUm91dGVDb250ZXh0KTtcclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGlmKGNvbnRleHQpe1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgIH1cclxuICB9LFtjb250ZXh0XSlcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZVJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtmZWF0dXJlUm91dGV9PXN0YXRlXHJcbnVzZUVmZmVjdCgoKT0+e1xyXG4gIGlmKGZlYXR1cmVSb3V0ZSl7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICB9XHJcbn0sW2ZlYXR1cmVSb3V0ZV0pXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uL2xheW91dC9UZXh0SW5wdXQnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQge3VzZUFwcFJvdXRlfWZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgaW5wdXRDb250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYm9yZGVyOiAnIzczNzM3MyBzb2xpZCAxcHgnLFxuICB9LFxuICBpbnB1dDoge1xuICAgIHBhZGRpbmc6IDEwLFxuICAgIGZsZXg6IDEsXG4gICAgYm9yZGVyOiAnd2hpdGUnLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dCh7XG4gIGhhbmdvdXRzLFxuICBvblNlYXJjaCxcbiAgb25TZWxlY3RIYW5nb3V0LFxuICBzZWFyY2gsXG4gIHVzZXJzLFxuICBvblN0YXJ0U2VhcmNoLFxufSkge1xuICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0U2VsZWN0aW9uKGUpe1xuICAgIGNvbnN0IGlkID1lLnRhcmdldC5pZFxuICAgIG9uU2VsZWN0SGFuZ291dChlKVxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKGc9PiBnLnVzZXJuYW1lPT09aWQpXG4gICAgZGVidWdnZXI7XG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOmAvJHtoYW5nb3V0LnN0YXRlfWAscm91dGU6Jy9oYW5nb3V0cyd9KVxuICB9XG4gIHJldHVybiAoXG4gXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cbiAgICAgICAgPFRleHRJbnB1dFxuICAgICAgICAgIHZhbHVlPXtzZWFyY2h9XG4gICAgICAgICAgaWQ9XCJzZWFyY2gtaW5wdXRcIlxuICAgICAgICAgIHR5cGU9XCJzZWFyY2hcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtvblNlYXJjaH1cbiAgICAgICAgICBzdHlsZT17c3R5bGUuaW5wdXR9XG4gICAgICAgIC8+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1idG5cIlxuICAgICAgICAgIGRpc2FibGVkPXshc2VhcmNofVxuICAgICAgICAgIHRpdGxlPVwic2VhcmNoXCJcbiAgICAgICAgICBvbkNsaWNrPXtvblN0YXJ0U2VhcmNofVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxMaXN0IGlkPVwiaGFuZ291dHMtbGlzdFwiPlxuICAgICAgICB7aGFuZ291dHMgJiZcbiAgICAgICAgICBoYW5nb3V0cy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gaWQ9e2cudXNlcm5hbWV9IG9uQ2xpY2s9e2hhbmRsZUhhbmdvdXRTZWxlY3Rpb259PlxuICAgICAgICAgICAgICAgIHtnLnVzZXJuYW1lfVxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgIDwvTGlzdD5cbiAgIFxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5jb25zdCBzdHlsZXMgPSB7XG4gIHJvb3Q6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZWVlZWVlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgfSxcbn07XG5leHBvcnQgZnVuY3Rpb24gTGF5b3V0KHsgY2hpbGRyZW4sIHN0eWxlLCBpZCB9KSB7XG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPXtpZH0gc3R5bGU9e3sgLi4uc3R5bGVzLnJvb3QsIC4uLnN0eWxlIH19PntjaGlsZHJlbn08L2Rpdj47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcblxuY29uc3Qgc3R5bGUgPSB7XG4gIGNoZWNrYm94OiB7IG1hcmdpblJpZ2h0OiA4IH0sXG4gIGNoZWNrYm94Um9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBwYWRkaW5nOiAxNixcbiAgfSxcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gIH0sXG4gIGJ0bjoge1xuICAgIGZsZXg6IDEsXG4gICAgbWFyZ2luUmlnaHQ6IDQsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9jayh7IG9uQ2FuY2VsLCBvbkJsb2NrLCBvblJlcG9ydCB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmNoZWNrYm94Um9vdH0+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBzdHlsZT17c3R5bGUuY2hlY2tib3h9IG9uQ2hhbmdlPXtvblJlcG9ydH0gLz5cbiAgICAgICAgPGxhYmVsPlJlcG9ydDwvbGFiZWw+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQ2FuY2VsXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DYW5jZWx9IC8+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJCbG9ja1wiIHN0eWxlPXtzdHlsZS5idG59IGlkPVwiQkxPQ0tcIiBvbkNsaWNrPXtvbkJsb2NrfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIG9uQ2xpY2ssXHJcbiAgaWQsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2Z1xyXG4gICAgICBoZWlnaHQ9e2hlaWdodH1cclxuICAgICAgdmlld0JveD0nMCAwIDI0IDI0J1xyXG4gICAgICB3aWR0aD17d2lkdGh9XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGlkPXtpZH1cclxuICAgID5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gaWQ9e2lkfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGlkPXtpZH1cclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnpNNCAxMmMwLTQuNDIgMy41OC04IDgtOCAxLjg1IDAgMy41NS42MyA0LjkgMS42OUw1LjY5IDE2LjlDNC42MyAxNS41NSA0IDEzLjg1IDQgMTJ6bTggOGMtMS44NSAwLTMuNTUtLjYzLTQuOS0xLjY5TDE4LjMxIDcuMUMxOS4zNyA4LjQ1IDIwIDEwLjE1IDIwIDEyYzAgNC40Mi0zLjU4IDgtOCA4eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5leHBvcnQgZnVuY3Rpb24gQ2VudGVyKHsgY2hpbGRyZW4sIHN0eWxlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgLi4uc3R5bGUsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvQmxvY2snO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcblxuY29uc3Qgc3R5bGUgPSB7XG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICB9LFxuICBidG46IHtcbiAgICBmbGV4OiAxLFxuICAgIG1hcmdpblJpZ2h0OiA0LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2tlZCh7IGhhbmdvdXQsIG9uVW5ibG9jaywgb25DbG9zZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImJsb2NrZWQtdWlcIj5cbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICA8QmxvY2sgd2lkdGg9XCI2MFwiIGhlaWdodD1cIjcwXCIgY29sb3I9XCJyZWRcIiAvPlxuICAgICAgICA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LnVzZXJuYW1lfTwvYj4gaXMgYmxvY2tlZFxuICAgICAgPC9DZW50ZXI+XG5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQ2xvc2VcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsb3NlfSAvPlxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiVW5ibG9ja1wiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uVW5ibG9ja30gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBEZWxldGUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9PlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J002IDE5YzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMlY3SDZ2MTJ6TTE5IDRoLTMuNWwtMS0xaC01bC0xIDFINXYyaDE0VjR6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcmNoaXZlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXsyNH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9PlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00yMC41NCA1LjIzbC0xLjM5LTEuNjhDMTguODggMy4yMSAxOC40NyAzIDE4IDNINmMtLjQ3IDAtLjg4LjIxLTEuMTYuNTVMMy40NiA1LjIzQzMuMTcgNS41NyAzIDYuMDIgMyA2LjVWMTljMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY2LjVjMC0uNDgtLjE3LS45My0uNDYtMS4yN3pNMTIgMTcuNUw2LjUgMTJIMTB2LTJoNHYyaDMuNUwxMiAxNy41ek01LjEyIDVsLjgxLTFoMTJsLjk0IDFINS4xMnonXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmltcG9ydCB7IERlbGV0ZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9EZWxldGUnO1xuaW1wb3J0IHsgQXJjaGl2ZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9BcmNoaXZlJztcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0Jsb2NrJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGljb25CdG46IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWFyZ2luOiA4IH0sXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxuICBidG5Db250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIH0sXG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICB9LFxuICBidG5Pazoge1xuICAgIG1hcmdpbjogOCxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xuICBvbkJsb2NrLFxuICBvbkRlbGV0ZSxcbiAgb25BcmNoaXZlLFxuICBvbk5vdGlmaWNhdGlvbixcbiAgb25Db252ZXJzYXRpb25IaXN0b3J5LFxuICBvbk9rLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XG4gICAgICA8ZGl2PlxuICAgICAgICA8Q2hlY2tib3ggbGFiZWw9XCJOb3RpZmljYXRpb25zXCIgb25DaGFuZ2U9e29uTm90aWZpY2F0aW9ufSAvPlxuICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcbiAgICAgICAgICBvbkNoYW5nZT17b25Db252ZXJzYXRpb25IaXN0b3J5fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8aHIgLz5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bkNvbnRhaW5lcn0+XG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJEZWxldGVcIiBJY29uPXtEZWxldGV9IG9uQ2xpY2s9e29uRGVsZXRlfSAvPlxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkJsb2NrIGFuZCBSZXBvcnRcIiBJY29uPXtCbG9ja30gb25DbGljaz17b25CbG9ja30gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuT2t9PlxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uT2t9Pk9LPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cblxuZnVuY3Rpb24gSWNvbkJ1dHRvbih7IEljb24sIHRpdGxlLCBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pY29uQnRufT5cbiAgICAgIDxidXR0b24gc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbGlja30+XG4gICAgICAgIDxJY29uIC8+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxkaXY+e3RpdGxlfTwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBDaGVja2JveCh7IGxhYmVsLCBvbkNoYW5nZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBtYXJnaW46IDgsIG1hcmdpblRvcDogOCB9fT5cbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XG4gICAgICA8bGFiZWw+e2xhYmVsfTwvbGFiZWw+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGVyc29uQWRkSWNvbih7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICd3aGl0ZScsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTE1IDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptLTktMlY3SDR2M0gxdjJoM3YzaDJ2LTNoM3YtMkg2em05IDRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCBQZXJzb25BZGQgZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL1BlcnNvbkFkZCc7XG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi8uLi9sYXlvdXQvVGV4dElucHV0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGUoeyBoYW5nb3V0LCBvbkludml0ZSwgb25NZXNzYWdlVGV4dCxtZXNzYWdlVGV4dCwgdmFsdWUgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH1pZD1cImludml0ZS11aVwiPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgPFBlcnNvbkFkZCBjb2xvcj1cImdyZWVuXCIgLz5cbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgU3RhcnQgQ29udmVyc2F0aW9uIHdpdGggPGI+e2hhbmdvdXQgJiYgaGFuZ291dC5lbWFpbH08L2I+XG4gICAgICA8L0NlbnRlcj5cbiAgICAgIDxUZXh0SW5wdXQgaWQ9XCJtZXNzYWdlVGV4dElucHV0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9IHZhbHVlPXttZXNzYWdlVGV4dH0gLz5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJTZW5kIEludml0ZVwiIGlkPVwiSU5WSVRFXCIgb25DbGljaz17b25JbnZpdGV9IGRhdGEtdGVzdGlkPSdvbmludml0ZS1idG4nIC8+XG4gICAgICA8L0NlbnRlcj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERvbmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTkgMTYuMkw0LjggMTJsLTEuNCAxLjRMOSAxOSAyMSA3bC0xLjQtMS40TDkgMTYuMnonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgRG9uZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9Eb25lJztcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcblxuY29uc3Qgc3R5bGUgPSB7XG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlZSh7IGhhbmdvdXQgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJpbnZpdGVlLXVpXCI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8RG9uZSB3aWR0aD1cIjcwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cImdyZWVuXCIgLz5cbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgPHA+XG4gICAgICAgICAgWW91IHdpbGwgYmUgYWJsZSB0byBjaGF0IHdpdGggPGI+e2hhbmdvdXQgJiYgaGFuZ291dC5lbWFpbH08L2I+IG9uY2VcbiAgICAgICAgICB5b3VyIGludml0aW9uIGhhcyBiZWVuIGFjY2VwdGVkLlxuICAgICAgICA8L3A+XG4gICAgICA8L0NlbnRlcj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5jb25zdCBzdHlsZSA9IHtcbiAgcm9vdDoge1xuICAgIGJvcmRlckNvbG9yOiAnI2VlZWVlZScsXG4gICAgYm9yZGVyU3R5bGU6ICdzb2xpZCcsXG4gICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgIHBhZGRpbmc6IDMsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgbWluSGVpZ2h0OiAzNSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gIH0sXG4gIHVzZXJuYW1lOiB7IG1hcmdpblJpZ2h0OiA4IH0sXG4gIGxvZzoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBjb2xvcjogJyM3MzczNzMnLFxuICAgIGZvbnRTaXplOiAxMCxcbiAgfSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XG4gIGNvbnN0IHsgbWVzc2FnZSB9ID0gcHJvcHM7XG4gIGNvbnN0IHsgZmxvYXQsIHVzZXJuYW1lIH0gPSBtZXNzYWdlO1xuICBjb25zdCBbZGF5cywgc2V0RGF5c10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW21pbnV0ZXMsIHNldE1pbnV0ZXNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtzZWNvbmRzLCBzZXRTZWNvbmRzXSA9IHVzZVN0YXRlKDApO1xuXG4gIGZ1bmN0aW9uIGNvbnZlcnRNUyhtcykge1xuICAgIHZhciBkLCBoLCBtLCBzO1xuICAgIHMgPSBNYXRoLmZsb29yKG1zIC8gMTAwMCk7XG4gICAgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcbiAgICBzID0gcyAlIDYwO1xuICAgIGggPSBNYXRoLmZsb29yKG0gLyA2MCk7XG4gICAgbSA9IG0gJSA2MDtcbiAgICBkID0gTWF0aC5mbG9vcihoIC8gMjQpO1xuICAgIGggPSBoICUgMjQ7XG4gICAgc2V0RGF5cyhkKTtcbiAgICBzZXRIb3VycyhoKTtcbiAgICBzZXRNaW51dGVzKG0pO1xuICAgIHNldFNlY29uZHMocyk7XG4gIH1cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gbWVzc2FnZS50aW1lc3RhbXApO1xuICAgIH0sIDApO1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gbWVzc2FnZS50aW1lc3RhbXApO1xuICAgIH0sIDYwMDAwKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLG1hcmdpbkJvdHRvbTozIH19PlxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VcIiBzdHlsZT17c3R5bGUubWVzc2FnZX0+e21lc3NhZ2UgJiYgbWVzc2FnZS50ZXh0fTwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5sb2d9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnVzZXJuYW1lfT57dXNlcm5hbWUgJiYgdXNlcm5hbWV9OjwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICB7bWludXRlcyA9PT0gMCAmJiA8ZGl2Pk5vdzwvZGl2Pn1cbiAgICAgICAgICAgIHtob3VycyA9PT0gMCAmJiBtaW51dGVzID4gMCAmJiA8ZGl2PnttaW51dGVzfSBtaW51dGVzIGFnbyA8L2Rpdj59XG4gICAgICAgICAgICB7aG91cnMgPiAwICYmIGRheXMgPT09IDAgJiYgKFxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtob3Vyc30gaG91cnMge21pbnV0ZXN9IG1pbnV0ZXMgYWdveycgJ31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2RheXMgPD0gMTAgJiYgZGF5cyA+IDEgJiYgPGRpdj57ZGF5c30gZGF5cyBhZ288L2Rpdj59XG4gICAgICAgICAgICB7ZGF5cyA+IDEwICYmIG5ldyBEYXRlKG1lc3NhZ2UudGltZXN0YW1wKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vdWkvTWVzc2FnZSc7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZXIoeyBoYW5nb3V0LCBvbkFjY2VwdCwgb25EZWNsaW5lIH0pIHtcbiAgY29uc3QgbWVzc2FnZSA9IHsgLi4uaGFuZ291dC5tZXNzYWdlLCB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSB9XG4gIHJldHVybiAoXG4gICAgPExheW91dCBpZD0naW52aXRlci11aSc+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5Ub3A6IDE2LCBtYXJnaW5MZWZ0OiA4IH19PlxuICAgICAgICAgIDxNZXNzYWdlXG4gICAgICAgICAgICBtZXNzYWdlPXttZXNzYWdlICYmIG1lc3NhZ2V9XG5cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBpZD1cIkRFQ0xJTkVcIlxuICAgICAgICAgICAgb25DbGljaz17b25EZWNsaW5lfVxuICAgICAgICAgICAgdGl0bGU9XCJJZ25vcmVcIlxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luUmlnaHQ6IDQsIGNvbG9yOiAncmVkJyB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgaWQ9XCJBQ0NFUFRcIlxuICAgICAgICAgICAgb25DbGljaz17b25BY2NlcHR9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nYWNjZXB0LWJ0bidcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpbkxlZnQ6IDQsIGNvbG9yOiAnZ3JlZW4nIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICAvL21hcmdpbjowXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiLz5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJzZW5kXCIgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJy8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4vTWVzc2FnZUVkaXRvcic7XG5jb25zdCBzdHlsZXMgPSB7XG4gIG1lc3NhZ2VDb250YWluZXI6IHtcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIC8vIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXG4gICAgaGVpZ2h0OiAnMjB2aCcsXG4gICAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgfSxcbn07XG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZXMoe1xuICBtZXNzYWdlcyxcbiAgdXNlcm5hbWUsXG4gIG9uTWVzc2FnZSxcbiAgb25NZXNzYWdlVGV4dCxcbiAgbWVzc2FnZVRleHQsXG59KSB7XG4gIGNvbnN0IHNjcm9sbGVyUmVmID0gdXNlUmVmKG51bGwpO1xuICBmdW5jdGlvbiBvblNlbmQoZSkge1xuICAgIG9uTWVzc2FnZShlKTtcbiAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5tZXNzYWdlQ29udGFpbmVyfSByZWY9e3Njcm9sbGVyUmVmfT5cbiAgICAgICAge21lc3NhZ2VzICYmXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcbiAgICAgICAgICAgIChtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPE1lc3NhZ2VFZGl0b3Igb25NZXNzYWdlPXtvblNlbmR9IG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1vbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fSAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuZnVuY3Rpb24gZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzLCB1c2VybmFtZSB9KSB7XG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLm1hcCgobXNnKSA9PiB7XG4gICAgICBpZiAobXNnLnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ2xlZnQnIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcbiAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLnNvcnQoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBNZXNzYWdlcyB9IGZyb20gJy4uL3VpL01lc3NhZ2VzJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdjaGF0KHtcbiAgbWVzc2FnZXMgPSBbXSxcbiAgb25NZXNzYWdlVGV4dCxcbiAgb25NZXNzYWdlLFxuICBtZXNzYWdlVGV4dCxcbiAgdXNlcm5hbWVcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IGlkPVwiaGFuZ2NoYXQtdWlcIj5cbiAgICAgIDxNZXNzYWdlc1xuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICBtZXNzYWdlVGV4dFxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XG4gICAgICAvPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgd2lkdGg6IDE1LFxuICBoZWlnaHQ6IDE1LFxuXG4gIGJvcmRlcjogJ3doaXRlIDJweCBzb2xpZCcsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xuICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xuICAgIHJldHVybiA8Q29ubmVjdGluZyAvPjtcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xuICB9XG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcbmltcG9ydCB7IHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XG5leHBvcnQgZnVuY3Rpb24gRHJhd2VyQ29udGVudCh7IG9wZW4gfSkge1xuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XG4gICAgc2V0Um91dGUoYC8ke2lkfWApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxMaXN0PlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nb3V0c1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBIYW5nb3V0c1xuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBCbG9ja1xuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja2VkXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEJsb2NrZWRcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEludml0ZVxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJpbnZpdGVlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEludml0ZWVcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlclwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBJbnZpdGVyXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImhhbmdjaGF0XCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEhhbmdjaGF0XG4gICAgICAgIDwvTGlzdEl0ZW0+XG5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiY29uZmlndXJlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIENvbmZpZ3VyZVxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJtZXNzYWdlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIE1lc3NhZ2VcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwibWVzc2FnZXNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgTWVzc2FnZXNcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwib25saW5lXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgb25saW5lU3RhdHVzXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICA8L0xpc3Q+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJleHBvcnQgY29uc3QgbWVzc2FnZXMgPVtcbiAgICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxuICB9LFxuICAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgT2sgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMyMTYzNDYyLFxuICB9LHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBIb3cgYXJlIHlvdSBkZW1vYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGFsbCByaWdodGAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjc3NTczLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NixcbiAgfSxcbiAgLFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OCxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG5dIiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIFJvdXRlIH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vTmF2aWdhdGlvbic7XG5pbXBvcnQgSGFuZ291dCBmcm9tICcuLi9oYW5nb3V0cy9IYW5nb3V0JztcbmltcG9ydCBCbG9jayBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jayc7XG5pbXBvcnQgQmxvY2tlZCBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9ja2VkJztcbmltcG9ydCBDb25maWd1cmUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvQ29uZmlndXJlJztcbmltcG9ydCBJbnZpdGUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlJztcbmltcG9ydCBJbnZpdGVlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUnO1xuaW1wb3J0IEludml0ZXIgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlcic7XG5pbXBvcnQgSGFuZ2NoYXQgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL2hhbmdvdXRzL3VpL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9oYW5nb3V0cy91aS9NZXNzYWdlcyc7XG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi4vaGFuZ291dHMvdWkvTWVzc2FnZUVkaXRvcic7XG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi9sYXlvdXQvaWNvbnMvb25saW5lU3RhdHVzJztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4vRHJhd2VyQ29udGVudCc7XG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcbmNvbnN0IGhhbmdvdXRzID0gW1xuICB7IHVzZXJuYW1lOiAndXNlcm9uZScgfSxcbiAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXG4gIHsgdXNlcm5hbWU6ICd1c2VydGhyZWUnIH0sXG5dO1xuY29uc3QgaGFuZ291dCA9IHtcbiAgdXNlcm5hbWU6ICd0ZXN0dXNlcicsXG4gIGVtYWlsOiAndGVzdEBnbWFpbC5jb20nLFxuICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXG59O1xuY29uc3QgbWVzc2FnZSA9IHtcbiAgdXNlcm5hbWU6ICdicmVubycsXG4gIHRleHQ6IGBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcbiAgdGltZXN0YW1wOiAxNTkxMzMxNzY3ODM2LFxufTtcblxucmVuZGVyKFxuICA8VGhlbWVQcm92aWRlclxuICAgIGluaXRTdGF0ZT17e1xuICAgICAgcHJpbWFyeToge1xuICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXG4gICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcbiAgICAgIH0sXG4gICAgfX1cbiAgPlxuICAgIDxSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT1cIi9tZXNzYWdlc1wiPlxuICAgICAgPE5hdmlnYXRpb24gZHJhd2VyQ29udGVudD17PERyYXdlckNvbnRlbnQgLz59PlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvYmxvY2tcIj5cbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvYmxvY2tlZFwiPlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvaW52aXRlXCI+XG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9pbnZpdGVlXCI+XG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvaW52aXRlclwiPlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdjaGF0XCI+XG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWVzc2FnZVwiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cbiAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e21lc3NhZ2V9IHVzZXJuYW1lPXtoYW5nb3V0LnVzZXJuYW1lfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9vbmxpbmVcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cbiAgICAgICAgICAgIDxPbmxpbmVTdGF0dXMgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWVzc2FnZXNcIj5cbiAgICAgICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgPC9OYXZpZ2F0aW9uPlxuICAgIDwvUm91dGVQcm92aWRlcj5cbiAgPC9UaGVtZVByb3ZpZGVyPixcbiAgZG9jdW1lbnQuYm9keVxuKTtcbiJdLCJuYW1lcyI6WyJ0IiwidSIsInIiLCJpIiwibyIsImMiLCJmIiwiZSIsImEiLCJ2IiwibSIsIkUiLCJkIiwiaCIsInciLCJfIiwiZyIsIlJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJyb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsImZpbmQiLCJwIiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIlJvdXRlUHJvdmlkZXIiLCJpbml0aWFsUm91dGUiLCJzZXRSb3V0ZSIsInVzZVN0YXRlIiwidmFsdWUiLCJ1c2VNZW1vIiwiTmF2aWdhdGlvbiIsImRyYXdlckNvbnRlbnQiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJwYWRkaW5nIiwiZmxleCIsIkxpc3QiLCJpZCIsImJveFNpemluZyIsImJhY2tncm91bmRDb2xvciIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwid2lkdGgiLCJMaXN0SXRlbSIsIm9uQ2xpY2siLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsInN0eWxlcyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIlRleHRJbnB1dCIsInR5cGUiLCJzdHlsZSIsIkJ1dHRvbiIsInRpdGxlIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsIkFwcFJvdXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZUFwcFJvdXRlIiwic3RhdGUiLCJkaXNwYXRjaCIsIm9uQXBwUm91dGUiLCJmZWF0dXJlUm91dGUiLCJpbnB1dENvbnRhaW5lciIsImJvcmRlciIsImlucHV0IiwiSGFuZ291dCIsImhhbmdvdXRzIiwib25TZWFyY2giLCJvblNlbGVjdEhhbmdvdXQiLCJzZWFyY2giLCJ1c2VycyIsIm9uU3RhcnRTZWFyY2giLCJoYW5kbGVIYW5nb3V0U2VsZWN0aW9uIiwidGFyZ2V0IiwiaGFuZ291dCIsInVzZXJuYW1lIiwibGVuZ3RoIiwibWFwIiwicm9vdCIsImhlaWdodCIsIkxheW91dCIsImNoZWNrYm94IiwiY2hlY2tib3hSb290IiwiYWxpZ25JdGVtcyIsImxheW91dCIsImZsZXhEaXJlY3Rpb24iLCJidG4iLCJCbG9jayIsIm9uQ2FuY2VsIiwib25CbG9jayIsIm9uUmVwb3J0IiwiZmlsbCIsImNvbG9yIiwiQ2VudGVyIiwidGV4dEFsaWduIiwiQmxvY2tlZCIsIm9uVW5ibG9jayIsIm9uQ2xvc2UiLCJEZWxldGUiLCJBcmNoaXZlIiwiaWNvbkJ0biIsIm1hcmdpbiIsImJ0bkNvbnRhaW5lciIsImJ0bk9rIiwiQ29uZmlndXJlIiwib25EZWxldGUiLCJvbkFyY2hpdmUiLCJvbk5vdGlmaWNhdGlvbiIsIm9uQ29udmVyc2F0aW9uSGlzdG9yeSIsIm9uT2siLCJJY29uQnV0dG9uIiwiSWNvbiIsIkNoZWNrYm94IiwibGFiZWwiLCJvbkNoYW5nZSIsIlBlcnNvbkFkZEljb24iLCJJbnZpdGUiLCJvbkludml0ZSIsIm9uTWVzc2FnZVRleHQiLCJtZXNzYWdlVGV4dCIsIlBlcnNvbkFkZCIsImVtYWlsIiwiRG9uZSIsIkludml0ZWUiLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJsb2ciLCJmb250U2l6ZSIsIk1lc3NhZ2UiLCJtZXNzYWdlIiwiZmxvYXQiLCJkYXlzIiwic2V0RGF5cyIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJzIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJ0aW1lc3RhbXAiLCJzZXRJbnRlcnZhbCIsInRleHQiLCJJbnZpdGVyIiwib25BY2NlcHQiLCJvbkRlY2xpbmUiLCJNZXNzYWdlRWRpdG9yIiwib25NZXNzYWdlIiwibWVzc2FnZUNvbnRhaW5lciIsIm92ZXJmbG93IiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwib25TZW5kIiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtc2ciLCJzb3J0IiwiSGFuZ2NoYXQiLCJPbmxpbmVTdGF0dXMiLCJyZWFkeVN0YXRlIiwiSXNPbmxpbmUiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsIlRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJzZXRTdGF0ZSIsIkRyYXdlckNvbnRlbnQiLCJvcGVuIiwiaGFuZGxlUm91dGUiLCJyZW5kZXIiLCJwcmltYXJ5IiwiYmFja2dyb3VuZCIsImZvbnRGYW1pbHkiLCJkb2N1bWVudCIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFHLElBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsb0VBQW9FLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQXVHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLHlCQUF5QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFzTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQXVELENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBNW9TLElBQUlBLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxFQUFFLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUixHQUFDLENBQUMsQ0FBQyxDQUFDRSxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9QLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFtRixTQUFTVyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1QsR0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQTJHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQXNELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDUSxHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUE0TixTQUFTYyxHQUFDLEVBQUUsQ0FBQ1gsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDWixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ04sR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1YsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRixHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFYSxHQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FB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
