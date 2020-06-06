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
    style
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
  onSelectUser,
  search,
  users,
  onStartSearch
}) {
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
      onClick: onSelectHangout
    }, g.username);
  })), h(List, {
    id: "users-list"
  }, users && users.map(g => {
    return h(ListItem, {
      id: g.username,
      onClick: onSelectUser
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
  }, h(Message, {
    message: hangout && hangout.message,
    username: hangout && hangout.username
  })), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    onClick: onDecline,
    title: "Ignore",
    style: {
      flex: 1,
      marginRight: 4,
      color: 'red'
    }
  }), h(Button, {
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

  function onSend() {
    onMessage();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL3JvdXRlL3JvdXRlci5qcyIsIi4uL05hdmlnYXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vbGF5b3V0L05hdkxpc3QuanMiLCIuLi8uLi9sYXlvdXQvVGV4dElucHV0LmpzIiwiLi4vLi4vbGF5b3V0L0J1dHRvbi5qcyIsIi4uLy4uL2hhbmdvdXRzL0hhbmdvdXQuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9MYXlvdXQuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jay5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9CbG9jay5qcyIsIi4uLy4uL2xheW91dC9DZW50ZXIuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9ja2VkLmpzIiwiLi4vLi4vbGF5b3V0L2ljb25zL0RlbGV0ZS5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9BcmNoaXZlLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQ29uZmlndXJlLmpzIiwiLi4vLi4vbGF5b3V0L2ljb25zL1BlcnNvbkFkZC5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZS5qcyIsIi4uLy4uL2xheW91dC9pY29ucy9Eb25lLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3VpL01lc3NhZ2UuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVyLmpzIiwiLi4vLi4vaGFuZ291dHMvdWkvTWVzc2FnZUVkaXRvci5qcyIsIi4uLy4uL2hhbmdvdXRzL3VpL01lc3NhZ2VzLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQuanMiLCIuLi8uLi9sYXlvdXQvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uL0RyYXdlckNvbnRlbnQuanMiLCIuLi9mYWtlTWVzc2FnZXMuanMiLCIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxhPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkfGl0ZXJhL2k7ZnVuY3Rpb24gcyhuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4geShuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24geShsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiBwKCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGsobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBrKG4pfX1mdW5jdGlvbiBnKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPXMoe30sbykpLl9fdj1pLHQ9eihmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZrKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixhLHMpe3ZhciBoLHAsbSxrLGcsXyxiLHgsQSxQPWkmJmkuX19rfHxjLEM9UC5sZW5ndGg7Zm9yKGE9PWUmJihhPW51bGwhPXI/clswXTpDP3coaSwwKTpudWxsKSx1Ll9faz1bXSxoPTA7aDxsLmxlbmd0aDtoKyspaWYobnVsbCE9KGs9dS5fX2tbaF09bnVsbD09KGs9bFtoXSl8fFwiYm9vbGVhblwiPT10eXBlb2Ygaz9udWxsOlwic3RyaW5nXCI9PXR5cGVvZiBrfHxcIm51bWJlclwiPT10eXBlb2Ygaz95KG51bGwsayxudWxsLG51bGwsayk6QXJyYXkuaXNBcnJheShrKT95KGQse2NoaWxkcmVuOmt9LG51bGwsbnVsbCxudWxsKTpudWxsIT1rLl9fZXx8bnVsbCE9ay5fX2M/eShrLnR5cGUsay5wcm9wcyxrLmtleSxudWxsLGsuX192KTprKSl7aWYoay5fXz11LGsuX19iPXUuX19iKzEsbnVsbD09PShtPVBbaF0pfHxtJiZrLmtleT09bS5rZXkmJmsudHlwZT09PW0udHlwZSlQW2hdPXZvaWQgMDtlbHNlIGZvcihwPTA7cDxDO3ArKyl7aWYoKG09UFtwXSkmJmsua2V5PT1tLmtleSYmay50eXBlPT09bS50eXBlKXtQW3BdPXZvaWQgMDticmVha31tPW51bGx9aWYoZz16KG4sayxtPW18fGUsdCxvLHIsZixhLHMpLChwPWsucmVmKSYmbS5yZWYhPXAmJih4fHwoeD1bXSksbS5yZWYmJngucHVzaChtLnJlZixudWxsLGspLHgucHVzaChwLGsuX19jfHxnLGspKSxudWxsIT1nKXtpZihudWxsPT1iJiYoYj1nKSxBPXZvaWQgMCx2b2lkIDAhPT1rLl9fZClBPWsuX19kLGsuX19kPXZvaWQgMDtlbHNlIGlmKHI9PW18fGchPWF8fG51bGw9PWcucGFyZW50Tm9kZSl7bjppZihudWxsPT1hfHxhLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoZyksQT1udWxsO2Vsc2V7Zm9yKF89YSxwPTA7KF89Xy5uZXh0U2libGluZykmJnA8QztwKz0yKWlmKF89PWcpYnJlYWsgbjtuLmluc2VydEJlZm9yZShnLGEpLEE9YX1cIm9wdGlvblwiPT11LnR5cGUmJihuLnZhbHVlPVwiXCIpfWE9dm9pZCAwIT09QT9BOmcubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgdS50eXBlJiYodS5fX2Q9YSl9ZWxzZSBhJiZtLl9fZT09YSYmYS5wYXJlbnROb2RlIT1uJiYoYT13KG0pKX1pZih1Ll9fZT1iLG51bGwhPXImJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUudHlwZSlmb3IoaD1yLmxlbmd0aDtoLS07KW51bGwhPXJbaF0mJnYocltoXSk7Zm9yKGg9QztoLS07KW51bGwhPVBbaF0mJkQoUFtoXSxQW2hdKTtpZih4KWZvcihoPTA7aDx4Lmxlbmd0aDtoKyspaih4W2hdLHhbKytoXSx4WysraF0pfWZ1bmN0aW9uIHgobil7cmV0dXJuIG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2Ygbj9bXTpBcnJheS5pc0FycmF5KG4pP2MuY29uY2F0LmFwcGx5KFtdLG4ubWFwKHgpKTpbbl19ZnVuY3Rpb24gQShuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8QyhuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fEMobixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBQKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09YS50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIEMobixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8UChvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxQKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCxOLHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCxOLHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiBOKGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiB6KGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgYSx2LGgseSxwLHcsayxnLF8seCxBLFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KGE9bi5fX2IpJiZhKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGc9dS5wcm9wcyxfPShhPVAuY29udGV4dFR5cGUpJiZ0W2EuX19jXSx4PWE/Xz9fLnByb3BzLnZhbHVlOmEuX186dCxpLl9fYz9rPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGcseCk6KHUuX19jPXY9bmV3IG0oZyx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1nLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPXMoe30sdi5fX3MpKSxzKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGcsdi5fX3MpKSkseT12LnByb3BzLHA9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmchPT15JiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhnLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoZyx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdil7Zm9yKHYucHJvcHM9Zyx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxhPTA7YTx1Ll9fay5sZW5ndGg7YSsrKXUuX19rW2FdJiYodS5fX2tbYV0uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShnLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUoeSxwLHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1nLHYuc3RhdGU9di5fX3MsKGE9bi5fX3IpJiZhKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxhPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1zKHMoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUoeSxwKSksQT1udWxsIT1hJiZhLnR5cGU9PWQmJm51bGw9PWEua2V5P2EucHJvcHMuY2hpbGRyZW46YSxiKGwsQXJyYXkuaXNBcnJheShBKT9BOltBXSx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxrJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhhPW4uZGlmZmVkKSYmYSh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBhLHMsdixoLHkscD11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3IoYT0wO2E8by5sZW5ndGg7YSsrKWlmKG51bGwhPShzPW9bYV0pJiYoKG51bGw9PT1sLnR5cGU/Mz09PXMubm9kZVR5cGU6cy5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1zKSl7bj1zLG9bYV09bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSlwIT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHA9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZihudWxsIT1vKWZvcihwPXt9LHk9MDt5PG4uYXR0cmlidXRlcy5sZW5ndGg7eSsrKXBbbi5hdHRyaWJ1dGVzW3ldLm5hbWVdPW4uYXR0cmlidXRlc1t5XS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfUEobixkLHAsdCxmKSxoP2wuX19rPVtdOihhPWwucHJvcHMuY2hpbGRyZW4sYihuLEFycmF5LmlzQXJyYXkoYSk/YTpbYV0sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZikpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT0oYT1kLnZhbHVlKSYmYSE9PW4udmFsdWUmJkMobixcInZhbHVlXCIsYSxwLnZhbHVlLCExKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PShhPWQuY2hlY2tlZCkmJmEhPT1uLmNoZWNrZWQmJkMobixcImNoZWNrZWRcIixhLHAuY2hlY2tlZCwhMSkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLHoodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOnUuY2hpbGROb2Rlcy5sZW5ndGg/Yy5zbGljZS5jYWxsKHUuY2hpbGROb2Rlcyk6bnVsbCxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7dmFyIHUsaTtmb3IoaSBpbiBsPXMocyh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHU9e30sbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJih1W2ldPWxbaV0pO3JldHVybiB5KG4udHlwZSx1LGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGcobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdS5Qcm92aWRlci5fXz11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGcodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPXMoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZzKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGcodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksZyh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQscCBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQsdSxyLGk9MCxvPVtdLGM9bi5fX3IsZj1uLmRpZmZlZCxlPW4uX19jLGE9bi51bm1vdW50O2Z1bmN0aW9uIHYodCxyKXtuLl9faCYmbi5fX2godSx0LGl8fHIpLGk9MDt2YXIgbz11Ll9fSHx8KHUuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49by5fXy5sZW5ndGgmJm8uX18ucHVzaCh7fSksby5fX1t0XX1mdW5jdGlvbiBtKG4pe3JldHVybiBpPTEscChFLG4pfWZ1bmN0aW9uIHAobixyLGkpe3ZhciBvPXYodCsrLDIpO3JldHVybiBvLnQ9bixvLl9fY3x8KG8uX19jPXUsby5fXz1baT9pKHIpOkUodm9pZCAwLHIpLGZ1bmN0aW9uKG4pe3ZhciB0PW8udChvLl9fWzBdLG4pO28uX19bMF0hPT10JiYoby5fX1swXT10LG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBsKHIsaSl7dmFyIG89dih0KyssMyk7IW4uX19zJiZ4KG8uX19ILGkpJiYoby5fXz1yLG8uX19IPWksdS5fX0guX19oLnB1c2gobykpfWZ1bmN0aW9uIHkocixpKXt2YXIgbz12KHQrKyw0KTshbi5fX3MmJngoby5fX0gsaSkmJihvLl9fPXIsby5fX0g9aSx1Ll9faC5wdXNoKG8pKX1mdW5jdGlvbiBkKG4pe3JldHVybiBpPTUsaChmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gcyhuLHQsdSl7aT02LHkoZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXU/dTp1LmNvbmNhdChuKSl9ZnVuY3Rpb24gaChuLHUpe3ZhciByPXYodCsrLDcpO3JldHVybiB4KHIuX19ILHUpPyhyLl9fSD11LHIuX19oPW4sci5fXz1uKCkpOnIuX199ZnVuY3Rpb24gVChuLHQpe3JldHVybiBpPTgsaChmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiB3KG4pe3ZhciByPXUuY29udGV4dFtuLl9fY10saT12KHQrKyw5KTtyZXR1cm4gaS5fX2M9bixyPyhudWxsPT1pLl9fJiYoaS5fXz0hMCxyLnN1Yih1KSksci5wcm9wcy52YWx1ZSk6bi5fX31mdW5jdGlvbiBBKHQsdSl7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUodT91KHQpOnQpfWZ1bmN0aW9uIEYobil7dmFyIHI9dih0KyssMTApLGk9bSgpO3JldHVybiByLl9fPW4sdS5jb21wb25lbnREaWRDYXRjaHx8KHUuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7ci5fXyYmci5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBfKCl7by5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2guZm9yRWFjaChxKSx0Ll9fSC5fX2g9W119Y2F0Y2godSl7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZSh1LHQuX192KSwhMH19KSxvPVtdfWZ1bmN0aW9uIGcobil7XCJmdW5jdGlvblwiPT10eXBlb2Ygbi51JiZuLnUoKX1mdW5jdGlvbiBxKG4pe24udT1uLl9fKCl9ZnVuY3Rpb24geChuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCx1KXtyZXR1cm4gdCE9PW5bdV19KX1mdW5jdGlvbiBFKG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7YyYmYyhuKSx0PTA7dmFyIHI9KHU9bi5fX2MpLl9fSDtyJiYoci5fX2guZm9yRWFjaChnKSxyLl9faC5mb3JFYWNoKHEpLHIuX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgdT10Ll9fYzt1JiZ1Ll9fSCYmdS5fX0guX19oLmxlbmd0aCYmKDEhPT1vLnB1c2godSkmJnI9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KChyPW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQsdT1mdW5jdGlvbigpe2NsZWFyVGltZW91dChyKSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSxyPXNldFRpbWVvdXQodSwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZSh1KSl9KShfKSl9LG4uX19jPWZ1bmN0aW9uKHQsdSl7dS5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKGcpLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8cShuKX0pfWNhdGNoKHIpe3Uuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHU9W10sbi5fX2Uocix0Ll9fdil9fSksZSYmZSh0LHUpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7YSYmYSh0KTt2YXIgdT10Ll9fYztpZih1JiZ1Ll9fSCl0cnl7dS5fX0guX18uZm9yRWFjaChnKX1jYXRjaCh0KXtuLl9fZSh0LHUuX192KX19O2V4cG9ydHttIGFzIHVzZVN0YXRlLHAgYXMgdXNlUmVkdWNlcixsIGFzIHVzZUVmZmVjdCx5IGFzIHVzZUxheW91dEVmZmVjdCxkIGFzIHVzZVJlZixzIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUsaCBhcyB1c2VNZW1vLFQgYXMgdXNlQ2FsbGJhY2ssdyBhcyB1c2VDb250ZXh0LEEgYXMgdXNlRGVidWdWYWx1ZSxGIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3JvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xyXG5cclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmsocHJvcHMpIHtcclxuICBjb25zdCB7IHRvLCBpZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRSb3V0ZSh0byk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8YVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgICAgaHJlZj17dG99XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxyXG4gICAgICBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnIH19XHJcbiAgICAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoUm91dGVDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBpbml0aWFsUm91dGUgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoaW5pdGlhbFJvdXRlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtyb3V0ZSwgc2V0Um91dGVdLCBbcm91dGVdKTtcclxuXHJcbiAgcmV0dXJuIDxSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZpZ2F0aW9uKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGRyYXdlckNvbnRlbnQgfSA9IHByb3BzO1xuXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGgxIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBwYWRkaW5nOiA1IH19PlxuICAgICAgICBTdG9yeWJvb2tcbiAgICAgIDwvaDE+XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxIH19PntkcmF3ZXJDb250ZW50fTwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEwIH19PntjaGlsZHJlbn08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTmF2SXRlbShwcm9wcykge1xuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibmF2LWl0ZW1cIj57Y2hpbGRyZW59PC9kaXY+O1xufVxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBMaXN0KHsgY2hpbGRyZW4sIGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxyXG5cclxuICAgICAgICBwYWRkaW5nVG9wOiA4LFxyXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpc3RJdGVtKHsgY2hpbGRyZW4sIG9uQ2xpY2ssIGlkIH0pIHtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgaWQ9e2lkfVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGNsYXNzTmFtZT0nZHJhd2VyLWxpc3QtaXRlbSdcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgICAgICBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiAxNixcclxuICAgICAgICBwYWRkaW5nVG9wOiA4LFxyXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHBhZGRpbmc6IDgsXHJcbiAgbWFyZ2luTGVmdDogMTYsXHJcbiAgbWFyZ2luUmlnaHQ6IDE2LFxyXG4gIG1hcmdpblRvcDogOCxcclxuICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgZmxleDogMSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBUZXh0SW5wdXQocHJvcHMpIHtcclxuICBjb25zdCB7IGlkLCB0eXBlID0gJ3RleHQnLHN0eWxlIH0gPSBwcm9wcztcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHdpZHRoOiAnMTAwJScgfX0+XHJcbiAgICAgIDxpbnB1dCAgc3R5bGU9e3suLi5zdHlsZXMsLi4uc3R5bGV9fSB7Li4ucHJvcHN9IGRhdGEtdGVzdGlkPXtpZH0gdHlwZT17dHlwZX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBCdXR0b24ocHJvcHMpIHtcbiAgY29uc3QgeyB0aXRsZSxzdHlsZSB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiB7Li4ucHJvcHN9PlxuICAgICAge3RpdGxlfVxuICAgIDwvYnV0dG9uPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi9sYXlvdXQvVGV4dElucHV0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2xheW91dC9CdXR0b24nO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGlucHV0Q29udGFpbmVyOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGJvcmRlcjogJyM3MzczNzMgc29saWQgMXB4JyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICBwYWRkaW5nOiAxMCxcbiAgICBmbGV4OiAxLFxuICAgIGJvcmRlcjogJ3doaXRlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXQoe1xuICBoYW5nb3V0cyxcbiAgb25TZWFyY2gsXG4gIG9uU2VsZWN0SGFuZ291dCxcbiAgb25TZWxlY3RVc2VyLFxuICBzZWFyY2gsXG4gIHVzZXJzLFxuICBvblN0YXJ0U2VhcmNoLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5pbnB1dENvbnRhaW5lcn0+XG4gICAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxuICAgICAgICAgIGlkPVwic2VhcmNoLWlucHV0XCJcbiAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2h9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlLmlucHV0fVxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2gtYnRuXCJcbiAgICAgICAgICBkaXNhYmxlZD17IXNlYXJjaH1cbiAgICAgICAgICB0aXRsZT1cInNlYXJjaFwiXG4gICAgICAgICAgb25DbGljaz17b25TdGFydFNlYXJjaH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8TGlzdCBpZD1cImhhbmdvdXRzLWxpc3RcIj5cbiAgICAgICAge2hhbmdvdXRzICYmXG4gICAgICAgICAgaGFuZ291dHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPExpc3RJdGVtIGlkPXtnLnVzZXJuYW1lfSBvbkNsaWNrPXtvblNlbGVjdEhhbmdvdXR9PlxuICAgICAgICAgICAgICAgIHtnLnVzZXJuYW1lfVxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgIDwvTGlzdD5cbiAgICAgIDxMaXN0IGlkPVwidXNlcnMtbGlzdFwiPlxuICAgICAgICB7dXNlcnMgJiZcbiAgICAgICAgICB1c2Vycy5tYXAoKGcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxMaXN0SXRlbSBpZD17Zy51c2VybmFtZX0gb25DbGljaz17b25TZWxlY3RVc2VyfT5cbiAgICAgICAgICAgICAgICB7Zy51c2VybmFtZX1cbiAgICAgICAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICA8L0xpc3Q+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICB9LFxufTtcbmV4cG9ydCBmdW5jdGlvbiBMYXlvdXQoeyBjaGlsZHJlbiwgc3R5bGUsIGlkIH0pIHtcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9e2lkfSBzdHlsZT17eyAuLi5zdHlsZXMucm9vdCwgLi4uc3R5bGUgfX0+e2NoaWxkcmVufTwvZGl2Pjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2xheW91dC9CdXR0b24nO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgY2hlY2tib3g6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgY2hlY2tib3hSb290OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIHBhZGRpbmc6IDE2LFxuICB9LFxuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgfSxcbiAgYnRuOiB7XG4gICAgZmxleDogMSxcbiAgICBtYXJnaW5SaWdodDogNCxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrKHsgb25DYW5jZWwsIG9uQmxvY2ssIG9uUmVwb3J0IH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY2hlY2tib3hSb290fT5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHN0eWxlPXtzdHlsZS5jaGVja2JveH0gb25DaGFuZ2U9e29uUmVwb3J0fSAvPlxuICAgICAgICA8bGFiZWw+UmVwb3J0PC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDYW5jZWxcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNhbmNlbH0gLz5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25CbG9ja30gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9jayh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBvbkNsaWNrLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgaGVpZ2h0PXtoZWlnaHR9XHJcbiAgICAgIHZpZXdCb3g9JzAgMCAyNCAyNCdcclxuICAgICAgd2lkdGg9e3dpZHRofVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBpZD17aWR9XHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6TTQgMTJjMC00LjQyIDMuNTgtOCA4LTggMS44NSAwIDMuNTUuNjMgNC45IDEuNjlMNS42OSAxNi45QzQuNjMgMTUuNTUgNCAxMy44NSA0IDEyem04IDhjLTEuODUgMC0zLjU1LS42My00LjktMS42OUwxOC4zMSA3LjFDMTkuMzcgOC40NSAyMCAxMC4xNSAyMCAxMmMwIDQuNDItMy41OCA4LTggOHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIENlbnRlcih7IGNoaWxkcmVuLCBzdHlsZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIC4uLnN0eWxlLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0Jsb2NrJztcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0J1dHRvbic7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL0xheW91dCc7XG5cbmNvbnN0IHN0eWxlID0ge1xuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgfSxcbiAgYnRuOiB7XG4gICAgZmxleDogMSxcbiAgICBtYXJnaW5SaWdodDogNCxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrZWQoeyBoYW5nb3V0LCBvblVuYmxvY2ssIG9uQ2xvc2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJibG9ja2VkLXVpXCI+XG4gICAgICA8Q2VudGVyIHN0eWxlPXt7IGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPEJsb2NrIHdpZHRoPVwiNjBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwicmVkXCIgLz5cbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcbiAgICAgIDwvQ2VudGVyPlxuXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkNsb3NlXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbG9zZX0gLz5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIlVuYmxvY2tcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvblVuYmxvY2t9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gRGVsZXRlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXJjaGl2ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17MjR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMjAuNTQgNS4yM2wtMS4zOS0xLjY4QzE4Ljg4IDMuMjEgMTguNDcgMyAxOCAzSDZjLS40NyAwLS44OC4yMS0xLjE2LjU1TDMuNDYgNS4yM0MzLjE3IDUuNTcgMyA2LjAyIDMgNi41VjE5YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNi41YzAtLjQ4LS4xNy0uOTMtLjQ2LTEuMjd6TTEyIDE3LjVMNi41IDEySDEwdi0yaDR2MmgzLjVMMTIgMTcuNXpNNS4xMiA1bC44MS0xaDEybC45NCAxSDUuMTJ6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XG5pbXBvcnQgeyBEZWxldGUgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvRGVsZXRlJztcbmltcG9ydCB7IEFyY2hpdmUgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvQXJjaGl2ZSc7XG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9CbG9jayc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlID0ge1xuICBpY29uQnRuOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbjogOCB9LFxuICBidG46IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgYnRuQ29udGFpbmVyOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICB9LFxuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgfSxcbiAgYnRuT2s6IHtcbiAgICBtYXJnaW46IDgsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlndXJlKHtcbiAgb25CbG9jayxcbiAgb25EZWxldGUsXG4gIG9uQXJjaGl2ZSxcbiAgb25Ob3RpZmljYXRpb24sXG4gIG9uQ29udmVyc2F0aW9uSGlzdG9yeSxcbiAgb25Payxcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxuICAgICAgPGRpdj5cbiAgICAgICAgPENoZWNrYm94IGxhYmVsPVwiTm90aWZpY2F0aW9uc1wiIG9uQ2hhbmdlPXtvbk5vdGlmaWNhdGlvbn0gLz5cbiAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgbGFiZWw9XCJDb252ZXJzYXRpb24gSGlzdG9yeVwiXG4gICAgICAgICAgb25DaGFuZ2U9e29uQ29udmVyc2F0aW9uSGlzdG9yeX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGhyIC8+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Db250YWluZXJ9PlxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkFyY2hpdmVcIiBJY29uPXtBcmNoaXZlfSBvbkNsaWNrPXtvbkFyY2hpdmV9IC8+XG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiRGVsZXRlXCIgSWNvbj17RGVsZXRlfSBvbkNsaWNrPXtvbkRlbGV0ZX0gLz5cbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJCbG9jayBhbmQgUmVwb3J0XCIgSWNvbj17QmxvY2t9IG9uQ2xpY2s9e29uQmxvY2t9IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bk9rfT5cbiAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvbk9rfT5PSzwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG5cbmZ1bmN0aW9uIEljb25CdXR0b24oeyBJY29uLCB0aXRsZSwgb25DbGljayB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17c3R5bGUuaWNvbkJ0bn0+XG4gICAgICA8YnV0dG9uIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICA8SWNvbiAvPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8ZGl2Pnt0aXRsZX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gQ2hlY2tib3goeyBsYWJlbCwgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiA4LCBtYXJnaW5Ub3A6IDggfX0+XG4gICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgICAgPGxhYmVsPntsYWJlbH08L2xhYmVsPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnd2hpdGUnLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgUGVyc29uQWRkIGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9QZXJzb25BZGQnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcbmNvbnN0IHN0eWxlID0ge1xuICBsYXlvdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlKHsgaGFuZ291dCwgb25JbnZpdGUsIG9uTWVzc2FnZVRleHQsbWVzc2FnZVRleHQsIHZhbHVlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9aWQ9XCJpbnZpdGUtdWlcIj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxQZXJzb25BZGQgY29sb3I9XCJncmVlblwiIC8+XG4gICAgICA8L0NlbnRlcj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIFN0YXJ0IENvbnZlcnNhdGlvbiB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8VGV4dElucHV0IGlkPVwibWVzc2FnZVRleHRJbnB1dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSB2YWx1ZT17bWVzc2FnZVRleHR9IC8+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiU2VuZCBJbnZpdGVcIiBvbkNsaWNrPXtvbkludml0ZX0gZGF0YS10ZXN0aWQ9J29uaW52aXRlLWJ0bicgLz5cbiAgICAgIDwvQ2VudGVyPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRG9uZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yeidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBEb25lIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL0RvbmUnO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnLi4vLi4vbGF5b3V0L0NlbnRlcic7XG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVlKHsgaGFuZ291dCB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxEb25lIHdpZHRoPVwiNzBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwiZ3JlZW5cIiAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8Q2VudGVyPlxuICAgICAgICA8cD5cbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxuICAgICAgICAgIHlvdXIgaW52aXRpb24gaGFzIGJlZW4gYWNjZXB0ZWQuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvQ2VudGVyPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmNvbnN0IHN0eWxlID0ge1xuICByb290OiB7XG4gICAgYm9yZGVyQ29sb3I6ICcjZWVlZWVlJyxcbiAgICBib3JkZXJTdHlsZTogJ3NvbGlkJyxcbiAgICBib3JkZXJXaWR0aDogMSxcbiAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgcGFkZGluZzogMyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBtaW5IZWlnaHQ6IDM1LFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgfSxcbiAgdXNlcm5hbWU6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgbG9nOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGNvbG9yOiAnIzczNzM3MycsXG4gICAgZm9udFNpemU6IDEwLFxuICB9LFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UocHJvcHMpIHtcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcbiAgY29uc3QgeyBmbG9hdCwgdXNlcm5hbWUgfSA9IG1lc3NhZ2U7XG4gIGNvbnN0IFtkYXlzLCBzZXREYXlzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW3NlY29uZHMsIHNldFNlY29uZHNdID0gdXNlU3RhdGUoMCk7XG5cbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XG4gICAgdmFyIGQsIGgsIG0sIHM7XG4gICAgcyA9IE1hdGguZmxvb3IobXMgLyAxMDAwKTtcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xuICAgIHMgPSBzICUgNjA7XG4gICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICBtID0gbSAlIDYwO1xuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XG4gICAgaCA9IGggJSAyNDtcbiAgICBzZXREYXlzKGQpO1xuICAgIHNldEhvdXJzKGgpO1xuICAgIHNldE1pbnV0ZXMobSk7XG4gICAgc2V0U2Vjb25kcyhzKTtcbiAgfVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSBtZXNzYWdlLnRpbWVzdGFtcCk7XG4gICAgfSwgMCk7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSBtZXNzYWdlLnRpbWVzdGFtcCk7XG4gICAgfSwgNjAwMDApO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsbWFyZ2luQm90dG9tOjMgfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLnJvb3QsIGZsb2F0IH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5tZXNzYWdlfT57bWVzc2FnZSAmJiBtZXNzYWdlLnRleHR9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmxvZ30+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHttaW51dGVzID09PSAwICYmIDxkaXY+Tm93PC9kaXY+fVxuICAgICAgICAgICAge2hvdXJzID09PSAwICYmIG1pbnV0ZXMgPiAwICYmIDxkaXY+e21pbnV0ZXN9IG1pbnV0ZXMgYWdvIDwvZGl2Pn1cbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge2hvdXJzfSBob3VycyB7bWludXRlc30gbWludXRlcyBhZ297JyAnfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7ZGF5cyA8PSAxMCAmJiBkYXlzID4gMSAmJiA8ZGl2PntkYXlzfSBkYXlzIGFnbzwvZGl2Pn1cbiAgICAgICAgICAgIHtkYXlzID4gMTAgJiYgbmV3IERhdGUobWVzc2FnZS50aW1lc3RhbXApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi91aS9NZXNzYWdlJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlcih7IGhhbmdvdXQsIG9uQWNjZXB0LG9uRGVjbGluZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBpZD0naW52aXRlci11aSc+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5Ub3A6IDE2LCBtYXJnaW5MZWZ0OiA4IH19PlxuICAgICAgICAgIDxNZXNzYWdlXG4gICAgICAgICAgICBtZXNzYWdlPXtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZX1cbiAgICAgICAgICAgIHVzZXJuYW1lPXtoYW5nb3V0ICYmIGhhbmdvdXQudXNlcm5hbWV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIHBhZGRpbmc6IDggfX0+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cbiAgICAgICAgICAgIHRpdGxlPVwiSWdub3JlXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpblJpZ2h0OiA0LCBjb2xvcjogJ3JlZCcgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtvbkFjY2VwdH1cbiAgICAgICAgICBkYXRhLXRlc3RpZD0nYWNjZXB0LWJ0bidcbiAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpbkxlZnQ6IDQsIGNvbG9yOiAnZ3JlZW4nIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vbGF5b3V0L1RleHRJbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9sYXlvdXQvQnV0dG9uJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICAvL21hcmdpbjowXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiLz5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJzZW5kXCIgb25DbGljaz17b25NZXNzYWdlfSBkYXRhLXRlc3RpZD0nc2VuZC1idG4nLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWYgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi9NZXNzYWdlRWRpdG9yJztcbmNvbnN0IHN0eWxlcyA9IHtcbiAgbWVzc2FnZUNvbnRhaW5lcjoge1xuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgLy8gYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyxcbiAgICBoZWlnaHQ6ICcyMHZoJyxcbiAgICBvdmVyZmxvdzogJ2F1dG8nLFxuICB9LFxufTtcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlcyh7XG4gIG1lc3NhZ2VzLFxuICB1c2VybmFtZSxcbiAgb25NZXNzYWdlLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBtZXNzYWdlVGV4dCxcbn0pIHtcbiAgY29uc3Qgc2Nyb2xsZXJSZWYgPSB1c2VSZWYobnVsbCk7XG4gIGZ1bmN0aW9uIG9uU2VuZCgpIHtcbiAgICBvbk1lc3NhZ2UoKTtcbiAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5tZXNzYWdlQ29udGFpbmVyfSByZWY9e3Njcm9sbGVyUmVmfT5cbiAgICAgICAge21lc3NhZ2VzICYmXG4gICAgICAgICAgbWVzc2FnZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcbiAgICAgICAgICAgIChtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxuICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPE1lc3NhZ2VFZGl0b3Igb25NZXNzYWdlPXtvblNlbmR9IG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1vbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fSAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuZnVuY3Rpb24gZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzLCB1c2VybmFtZSB9KSB7XG4gIGlmIChtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIHVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLm1hcCgobXNnKSA9PiB7XG4gICAgICBpZiAobXNnLnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAncmlnaHQnLCB1c2VybmFtZTogJ21lJyB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ2xlZnQnIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbmZ1bmN0aW9uIHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pIHtcbiAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLnNvcnQoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBNZXNzYWdlcyB9IGZyb20gJy4uL3VpL01lc3NhZ2VzJztcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdjaGF0KHtcbiAgbWVzc2FnZXMgPSBbXSxcbiAgb25NZXNzYWdlVGV4dCxcbiAgb25NZXNzYWdlLFxuICBtZXNzYWdlVGV4dCxcbiAgdXNlcm5hbWVcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IGlkPVwiaGFuZ2NoYXQtdWlcIj5cbiAgICAgIDxNZXNzYWdlc1xuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICBtZXNzYWdlVGV4dFxuICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XG4gICAgICAvPlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgd2lkdGg6IDE1LFxuICBoZWlnaHQ6IDE1LFxuXG4gIGJvcmRlcjogJ3doaXRlIDJweCBzb2xpZCcsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xuICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xuICAgIHJldHVybiA8Q29ubmVjdGluZyAvPjtcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xuICB9XG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcbmltcG9ydCB7IHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XG5leHBvcnQgZnVuY3Rpb24gRHJhd2VyQ29udGVudCh7IG9wZW4gfSkge1xuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XG4gICAgc2V0Um91dGUoYC8ke2lkfWApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxMaXN0PlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nb3V0c1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBIYW5nb3V0c1xuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBCbG9ja1xuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja2VkXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEJsb2NrZWRcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEludml0ZVxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJpbnZpdGVlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEludml0ZWVcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlclwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cbiAgICAgICAgICBJbnZpdGVyXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImhhbmdjaGF0XCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIEhhbmdjaGF0XG4gICAgICAgIDwvTGlzdEl0ZW0+XG5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwiY29uZmlndXJlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIENvbmZpZ3VyZVxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJtZXNzYWdlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgIE1lc3NhZ2VcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwibWVzc2FnZXNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XG4gICAgICAgICAgTWVzc2FnZXNcbiAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgPExpc3RJdGVtIGlkPVwib25saW5lXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxuICAgICAgICAgb25saW5lU3RhdHVzXG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gICAgICA8L0xpc3Q+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJleHBvcnQgY29uc3QgbWVzc2FnZXMgPVtcbiAgICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMxNzg5OTcxLFxuICB9LFxuICAge1xuICAgIHVzZXJuYW1lOidkZW1vJyxcbiAgICB0ZXh0OiBgT2sgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMyMTYzNDYyLFxuICB9LHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBIb3cgYXJlIHlvdSBkZW1vYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM2MzU3MjMsXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGFsbCByaWdodGAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjc3NTczLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBZZXMgSSBhbS4gSG93IGFyZSB5b3VgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NixcbiAgfSxcbiAgLFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2RlbW8nLFxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ3LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OCxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTonYnJlbm8nLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOidicmVubycsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG5dIiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIFJvdXRlIH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vTmF2aWdhdGlvbic7XG5pbXBvcnQgSGFuZ291dCBmcm9tICcuLi9oYW5nb3V0cy9IYW5nb3V0JztcbmltcG9ydCBCbG9jayBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9jayc7XG5pbXBvcnQgQmxvY2tlZCBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9ja2VkJztcbmltcG9ydCBDb25maWd1cmUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvQ29uZmlndXJlJztcbmltcG9ydCBJbnZpdGUgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlJztcbmltcG9ydCBJbnZpdGVlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUnO1xuaW1wb3J0IEludml0ZXIgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlcic7XG5pbXBvcnQgSGFuZ2NoYXQgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvSGFuZ2NoYXQnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL2hhbmdvdXRzL3VpL01lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuLi9oYW5nb3V0cy91aS9NZXNzYWdlcyc7XG5pbXBvcnQgeyBNZXNzYWdlRWRpdG9yIH0gZnJvbSAnLi4vaGFuZ291dHMvdWkvTWVzc2FnZUVkaXRvcic7XG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi9sYXlvdXQvaWNvbnMvb25saW5lU3RhdHVzJztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4vRHJhd2VyQ29udGVudCc7XG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcbmNvbnN0IGhhbmdvdXRzID0gW1xuICB7IHVzZXJuYW1lOiAndXNlcm9uZScgfSxcbiAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXG4gIHsgdXNlcm5hbWU6ICd1c2VydGhyZWUnIH0sXG5dO1xuY29uc3QgaGFuZ291dCA9IHtcbiAgdXNlcm5hbWU6ICd0ZXN0dXNlcicsXG4gIGVtYWlsOiAndGVzdEBnbWFpbC5jb20nLFxuICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXG59O1xuY29uc3QgbWVzc2FnZSA9IHtcbiAgdXNlcm5hbWU6ICdicmVubycsXG4gIHRleHQ6IGBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcbiAgdGltZXN0YW1wOiAxNTkxMzMxNzY3ODM2LFxufTtcblxucmVuZGVyKFxuICA8VGhlbWVQcm92aWRlclxuICAgIGluaXRTdGF0ZT17e1xuICAgICAgcHJpbWFyeToge1xuICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXG4gICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcbiAgICAgIH0sXG4gICAgfX1cbiAgPlxuICAgIDxSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT1cIi9tZXNzYWdlc1wiPlxuICAgICAgPE5hdmlnYXRpb24gZHJhd2VyQ29udGVudD17PERyYXdlckNvbnRlbnQgLz59PlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvYmxvY2tcIj5cbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvYmxvY2tlZFwiPlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvaW52aXRlXCI+XG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9pbnZpdGVlXCI+XG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvaW52aXRlclwiPlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdjaGF0XCI+XG4gICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWVzc2FnZVwiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cbiAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e21lc3NhZ2V9IHVzZXJuYW1lPXtoYW5nb3V0LnVzZXJuYW1lfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9vbmxpbmVcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cbiAgICAgICAgICAgIDxPbmxpbmVTdGF0dXMgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWVzc2FnZXNcIj5cbiAgICAgICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgPC9OYXZpZ2F0aW9uPlxuICAgIDwvUm91dGVQcm92aWRlcj5cbiAgPC9UaGVtZVByb3ZpZGVyPixcbiAgZG9jdW1lbnQuYm9keVxuKTtcbiJdLCJuYW1lcyI6WyJ0IiwidSIsInIiLCJpIiwibyIsImMiLCJmIiwiZSIsImEiLCJ2IiwibSIsIkUiLCJkIiwiaCIsInciLCJfIiwiZyIsIlJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJyb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsImZpbmQiLCJwIiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIlJvdXRlUHJvdmlkZXIiLCJpbml0aWFsUm91dGUiLCJzZXRSb3V0ZSIsInVzZVN0YXRlIiwidmFsdWUiLCJ1c2VNZW1vIiwiTmF2aWdhdGlvbiIsImRyYXdlckNvbnRlbnQiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJwYWRkaW5nIiwiZmxleCIsIkxpc3QiLCJpZCIsImJveFNpemluZyIsImJhY2tncm91bmRDb2xvciIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwid2lkdGgiLCJMaXN0SXRlbSIsIm9uQ2xpY2siLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsInN0eWxlcyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIlRleHRJbnB1dCIsInR5cGUiLCJzdHlsZSIsIkJ1dHRvbiIsInRpdGxlIiwiaW5wdXRDb250YWluZXIiLCJib3JkZXIiLCJpbnB1dCIsIkhhbmdvdXQiLCJoYW5nb3V0cyIsIm9uU2VhcmNoIiwib25TZWxlY3RIYW5nb3V0Iiwib25TZWxlY3RVc2VyIiwic2VhcmNoIiwidXNlcnMiLCJvblN0YXJ0U2VhcmNoIiwibGVuZ3RoIiwibWFwIiwidXNlcm5hbWUiLCJyb290IiwiaGVpZ2h0IiwiTGF5b3V0IiwiY2hlY2tib3giLCJjaGVja2JveFJvb3QiLCJhbGlnbkl0ZW1zIiwibGF5b3V0IiwiZmxleERpcmVjdGlvbiIsImJ0biIsIkJsb2NrIiwib25DYW5jZWwiLCJvbkJsb2NrIiwib25SZXBvcnQiLCJmaWxsIiwiY29sb3IiLCJDZW50ZXIiLCJ0ZXh0QWxpZ24iLCJCbG9ja2VkIiwiaGFuZ291dCIsIm9uVW5ibG9jayIsIm9uQ2xvc2UiLCJEZWxldGUiLCJBcmNoaXZlIiwiaWNvbkJ0biIsIm1hcmdpbiIsImJ0bkNvbnRhaW5lciIsImJ0bk9rIiwiQ29uZmlndXJlIiwib25EZWxldGUiLCJvbkFyY2hpdmUiLCJvbk5vdGlmaWNhdGlvbiIsIm9uQ29udmVyc2F0aW9uSGlzdG9yeSIsIm9uT2siLCJJY29uQnV0dG9uIiwiSWNvbiIsIkNoZWNrYm94IiwibGFiZWwiLCJvbkNoYW5nZSIsIlBlcnNvbkFkZEljb24iLCJJbnZpdGUiLCJvbkludml0ZSIsIm9uTWVzc2FnZVRleHQiLCJtZXNzYWdlVGV4dCIsIlBlcnNvbkFkZCIsImVtYWlsIiwiRG9uZSIsIkludml0ZWUiLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJsb2ciLCJmb250U2l6ZSIsIk1lc3NhZ2UiLCJtZXNzYWdlIiwiZmxvYXQiLCJkYXlzIiwic2V0RGF5cyIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsInNlY29uZHMiLCJzZXRTZWNvbmRzIiwiY29udmVydE1TIiwibXMiLCJzIiwiTWF0aCIsImZsb29yIiwidXNlRWZmZWN0Iiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJ0aW1lc3RhbXAiLCJzZXRJbnRlcnZhbCIsInRleHQiLCJJbnZpdGVyIiwib25BY2NlcHQiLCJvbkRlY2xpbmUiLCJNZXNzYWdlRWRpdG9yIiwib25NZXNzYWdlIiwibWVzc2FnZUNvbnRhaW5lciIsIm92ZXJmbG93IiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwib25TZW5kIiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtc2ciLCJzb3J0IiwiSGFuZ2NoYXQiLCJPbmxpbmVTdGF0dXMiLCJyZWFkeVN0YXRlIiwiSXNPbmxpbmUiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsIlRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJzdGF0ZSIsInNldFN0YXRlIiwiRHJhd2VyQ29udGVudCIsIm9wZW4iLCJoYW5kbGVSb3V0ZSIsInRhcmdldCIsInJlbmRlciIsInByaW1hcnkiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsImRvY3VtZW50IiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxvRUFBb0UsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBdUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXNPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1b1MsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNSLEdBQUMsQ0FBQyxDQUFDLENBQUNFLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1AsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQW1GLFNBQVNXLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPVCxHQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsVUFBVSxDQUFDLE9BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBMkcsU0FBU0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBc0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQTROLFNBQVNjLEdBQUMsRUFBRSxDQUFDWCxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNaLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDTixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUdGLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUVGLEdBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUVhLEdBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNULEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUNRLEdBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7O0FDR2h1RSxNQUFNQyxZQUFZLEdBQUdDLENBQWEsRUFBbEM7QUFFTyxTQUFTQyxLQUFULENBQWVDLEtBQWYsRUFBc0I7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
