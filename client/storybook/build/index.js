var n,u,i,t,o,r,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var i,t=arguments,o={};for(i in l)"key"!==i&&"ref"!==i&&(o[i]=l[i]);if(arguments.length>3)for(u=[u],i=3;i<arguments.length;i++)u.push(t[i]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===o[i]&&(o[i]=n.defaultProps[i]);return p(n,o,l&&l.key,l&&l.ref,null)}function p(l,u,i,t,o){var r={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),n.vnode&&n.vnode(r),r}function d(n){return n.children}function m(n,l){this.props=n,this.context=l;}function w(n,l){if(null==l)return n.__?w(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?w(n):null}function g(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return g(n)}}function k(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!i++||o!==n.debounceRendering)&&((o=n.debounceRendering)||t)(_);}function _(){for(var n;i=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(i=a({},o)).__v=i,t=A(f,o,i,l.__n,void 0!==f.ownerSVGElement,null,u,null==r?w(o):r),T(u,o),t!=r&&g(o)));});}function b(n,l,u,i,t,o,r,f,s){var a,h,p,y,d,m,g,k=u&&u.__k||c,_=k.length;if(f==e&&(f=null!=o?o[0]:_?w(u,0):null),a=0,l.__k=x(l.__k,function(u){if(null!=u){if(u.__=l,u.__b=l.__b+1,null===(p=k[a])||p&&u.key==p.key&&u.type===p.type)k[a]=void 0;else for(h=0;h<_;h++){if((p=k[h])&&u.key==p.key&&u.type===p.type){k[h]=void 0;break}p=null;}if(y=A(n,u,p=p||e,i,t,o,r,f,s),(h=u.ref)&&p.ref!=h&&(g||(g=[]),p.ref&&g.push(p.ref,null,u),g.push(h,u.__c||y,u)),null!=y){var c;if(null==m&&(m=y),void 0!==u.__d)c=u.__d,u.__d=void 0;else if(o==p||y!=f||null==y.parentNode){n:if(null==f||f.parentNode!==n)n.appendChild(y),c=null;else {for(d=f,h=0;(d=d.nextSibling)&&h<_;h+=2)if(d==y)break n;n.insertBefore(y,f),c=f;}"option"==l.type&&(n.value="");}f=void 0!==c?c:y.nextSibling,"function"==typeof l.type&&(l.__d=f);}else f&&p.__e==f&&f.parentNode!=n&&(f=w(p));}return a++,u}),l.__e=m,null!=o&&"function"!=typeof l.type)for(a=o.length;a--;)null!=o[a]&&v(o[a]);for(a=_;a--;)null!=k[a]&&D(k[a],k[a]);if(g)for(a=0;a<g.length;a++)j(g[a],g[++a],g[++a]);}function x(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var i=0;i<n.length;i++)x(n[i],l,u);else u.push(l?l("string"==typeof n||"number"==typeof n?p(null,n,null,null,n):null!=n.__e||null!=n.__c?p(n.type,n.props,n.key,null,n.__v):n):n);return u}function P(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||N(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||N(n,o,l[o],u[o],i);}function C(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===s.test(l)?u+"px":null==u?"":u;}function N(n,l,u,i,t){var o,r,f,e,c;if(t?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else {if("string"==typeof i&&(o.cssText="",i=null),i)for(e in i)u&&e in u||C(o,e,"");if(u)for(c in u)i&&u[c]===i[c]||C(o,c,u[c]);}else "o"===l[0]&&"n"===l[1]?(r=l!==(l=l.replace(/Capture$/,"")),f=l.toLowerCase(),l=(f in n?f:l).slice(2),u?(i||n.addEventListener(l,z,r),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,z,r)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u));}function z(l){this.l[l.type](n.event?n.event(l):l);}function A(l,u,i,t,o,r,f,e,c){var s,v,h,p,y,w,g,k,_,x,P=u.type;if(void 0!==u.constructor)return null;(s=n.__b)&&s(u);try{n:if("function"==typeof P){if(k=u.props,_=(s=P.contextType)&&t[s.__c],x=s?_?_.props.value:s.__:t,i.__c?g=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(k,x):(u.__c=v=new m(k,x),v.constructor=P,v.render=E),_&&_.sub(v),v.props=k,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=a({},v.__s)),a(v.__s,P.getDerivedStateFromProps(k,v.__s))),p=v.props,y=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&k!==p&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(k,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(k,v.__s,x)||u.__v===i.__v&&!v.__){for(v.props=k,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v),s=0;s<u.__k.length;s++)u.__k[s]&&(u.__k[s].__=u);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(k,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(p,y,w);});}v.context=x,v.props=k,v.state=v.__s,(s=n.__r)&&s(u),v.__d=!1,v.__v=u,v.__P=l,s=v.render(v.props,v.state,v.context),u.__k=null!=s&&s.type==d&&null==s.key?s.props.children:Array.isArray(s)?s:[s],null!=v.getChildContext&&(t=a(a({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(w=v.getSnapshotBeforeUpdate(p,y)),b(l,u,i,t,o,r,f,e,c),v.base=u.__e,v.__h.length&&f.push(v),g&&(v.__E=v.__=null),v.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=$(i.__e,u,i,t,o,r,f,c);(s=n.diffed)&&s(u);}catch(l){u.__v=null,n.__e(l,u,i);}return u.__e}function T(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n.__e(l,u.__v);}});}function $(n,l,u,i,t,o,r,f){var s,a,v,h,p,y=u.props,d=l.props;if(t="svg"===l.type||t,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,f=!1;}if(null===l.type)y!==d&&n.data!=d&&(n.data=d);else {if(null!=o&&(o=c.slice.call(n.childNodes)),v=(y=u.props||e).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!f){if(y===e)for(y={},p=0;p<n.attributes.length;p++)y[n.attributes[p].name]=n.attributes[p].value;(h||v)&&(h&&v&&h.__html==v.__html||(n.innerHTML=h&&h.__html||""));}P(n,d,y,t,f),l.__k=l.props.children,h||b(n,l,u,i,"foreignObject"!==l.type&&t,o,r,e,f),f||("value"in d&&void 0!==d.value&&d.value!==n.value&&(n.value=null==d.value?"":d.value),"checked"in d&&void 0!==d.checked&&d.checked!==n.checked&&(n.checked=d.checked));}return n}function j(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,i);}}function D(l,u,i){var t,o,r;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||j(t,null,u)),i||"function"==typeof l.type||(i=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(r=0;r<t.length;r++)t[r]&&D(t[r],u,i);null!=o&&v(o);}function E(n,l,u){return this.constructor(n,u)}function H(l,u,i){var t,o,f;n.__&&n.__(l,u),o=(t=i===r)?null:i&&i.__k||u.__k,l=h(d,null,[l]),f=[],A(u,(t?u:i||u).__k=l,o||e,e,void 0!==u.ownerSVGElement,i&&!t?[i]:o?null:c.slice.call(u.childNodes),f,i||e,t),T(f,l);}function M(n){var l={},u={__c:"__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var i,t=this;return this.getChildContext||(i=[],this.getChildContext=function(){return l[u.__c]=t,l},this.shouldComponentUpdate=function(n){t.props.value!==n.value&&i.some(function(l){l.context=n.value,k(l);});},this.sub=function(n){i.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){i.splice(i.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Consumer.contextType=u,u}n={__e:function(n,l){for(var u,i;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(i=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(i=!0,u.componentDidCatch(n)),i)return k(u.__E=u)}catch(l){n=l;}throw n}},m.prototype.setState=function(n,l){var u;u=this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),k(this));},m.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),k(this));},m.prototype.render=d,u=[],i=0,t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,r=e,f=0;

var t$1,r$1,u$1,i$1=[],o$1=n.__r,f$1=n.diffed,c$1=n.__c,e$1=n.unmount;function a$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v$1(n){return m$1(x$1,n)}function m$1(n,u,i){var o=a$1(t$1++);return o.__c||(o.__c=r$1,o.__=[i?i(u):x$1(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p$1(n,u){var i=a$1(t$1++);q(i.__H,u)&&(i.__=n,i.__H=u,r$1.__H.__h.push(i));}function y(n){return s$1(function(){return {current:n}},[])}function s$1(n,r){var u=a$1(t$1++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__;var i=a$1(t$1++);return null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value}function F(){i$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(_$1),t.__H.__h.forEach(g$1),t.__H.__h=[];}catch(r){return t.__H.__h=[],n.__e(r,t.__v),!0}}),i$1=[];}function _$1(n){n.t&&n.t();}function g$1(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o$1&&o$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.__h.forEach(_$1),r$1.__H.__h.forEach(g$1),r$1.__H.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i$1.push(r)&&u$1===n.requestAnimationFrame||((u$1=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_$1),t.__h=t.__h.filter(function(n){return !n.__||g$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c$1&&c$1(t,r);},n.unmount=function(t){e$1&&e$1(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

const drawer = {
  boxShadow: `0px 3px 3px -2px rgba(0, 0, 0, 0.2),0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)`,
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 10,
  height: '100vh',
  backgroundColor: '#f5f5f5'
};

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

function Drawer(props) {
  const [pinned, setPinned] = v$1(false);
  const {
    width,
    height,
    orientation,
    device
  } = useMediaQuery();
  const {
    open,
    onClick,
    children,
    style
  } = props;
  return h("div", {
    style: { ...drawer,
      position: device === "phone" ? 'fixed' : 'relative'
    },
    className: `drawer-${device}-width`
  }, h("div", null, children));
}

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

const ThemeContext = M();

function useThemeContext() {
  const context = T$1(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used with ThemeProvider');
  }

  return context;
}

function ThemeProvider(props) {
  const {
    initState
  } = props;
  const [state, setState] = v$1(initState);
  return h(ThemeContext.Provider, _extends({
    value: state
  }, props));
}

function AppBar({
  children,
  style
}) {
  const theme = useThemeContext();
  return h("div", {
    style: { ...theme.primary,
      //  position: 'fixed',
      // left: 0,
      //  top: 0,
      minHeight: 64,
      // paddingLeft: 16,
      // paddingRight: 16,
      width: '100%',
      display: 'flex',
      ...style
    }
  }, children);
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

var css_248z = ".nav-item:hover {\r\n  background-color: #3700b3;\r\n  border-radius: 4px;\r\n}\r\n\r\n.nav-item {\r\n  color: #ffffff;\r\n  min-height: 36px;\r\n  padding-left: 16px;\r\n  padding-right: 16px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n}\r\n\r\n.menu-white {\r\n  min-height: 36px;\r\n  min-width: 36px;\r\n  padding: 8px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n}\r\n\r\n.menu-white:hover {\r\n  border-radius: 50%;\r\n}\r\n\r\n.drawer-phone-width {\r\n  width: 90%;\r\n}\r\n\r\n.drawer-tablet-width {\r\n  width: 30%;\r\n}\r\n\r\n.drawer-laptop-width {\r\n  width: 20%;\r\n}\r\n\r\n.drawer-desktop-width {\r\n  width: 20%;\r\n}";
styleInject(css_248z);

function MenuWhite({
  onClick,
  id
}) {
  return h("svg", {
    "data-testid": id,
    onClick: onClick,
    className: "menu-white",
    viewBox: "0 0 24 24",
    fill: "white",
    width: "24px",
    height: "24px"
  }, h("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), h("path", {
    d: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
  }));
}

function Menu({
  onClick
}) {
  return h(MenuWhite, {
    onClick: onClick,
    id: "menu"
  });
}

function NavItem(props) {
  const {
    children
  } = props;
  return h("div", _extends({
    className: "nav-item"
  }, props), children);
}

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

var css_248z$1 = ".list {\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  background-color: #fff;\r\n  padding-top: 8px;\r\n  padding-bottom: 8px;\r\n  width: 100%;\r\n}\r\n\r\n.list-item {\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  padding-left: 16px;\r\n  padding-right: 16px;\r\n  padding-top: 8px;\r\n  padding-bottom: 8px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n}\r\n\r\n.list-item:hover {\r\n  background-color: #f5f5f5;\r\n  cursor: pointer;\r\n}";
styleInject(css_248z$1);

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
  return h("div", null, h("input", props));
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

var css_248z$2 = ".btn {\r\n  padding: 6px 16px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  border: none;\r\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n  min-width: 64px;\r\n  font-weight: 500;\r\n  font-size: 0.875rem;\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}";
styleInject(css_248z$2);

const style$1 = {
  circle: {
    backgroundColor: 'green',
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 3,
    padding: 3
  },
  circleContainer: {
    display: 'flex'
  }
};

function ProgressBar() {
  const [selected, setSelected] = v$1(0);
  const [state, setState] = v$1(false);
  p$1(() => {
    if (state) {
      if (selected === 0) {
        setSelected(1);
      }

      if (selected === 1) {
        setSelected(2);
      }

      if (selected === 2) {
        setSelected(0);
      }
    }
  }, [state]);
  p$1(() => {
    let interval = setInterval(function () {
      setState(prev => !prev);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return h("div", {
    style: style$1.circleContainer,
    className: "btn"
  }, h("div", {
    style: { ...style$1.circle,
      backgroundColor: selected === 0 ? 'white' : 'green'
    }
  }), h("div", {
    style: { ...style$1.circle,
      backgroundColor: selected === 1 ? 'white' : 'green'
    }
  }), h("div", {
    style: { ...style$1.circle,
      backgroundColor: selected === 2 ? 'white' : 'green'
    }
  }));
}

function AsyncButton(props) {
  const {
    loading
  } = props;

  if (loading) {
    return h(ProgressBar, null);
  } else return h("button", _extends({
    className: "btn"
  }, props));
}

const style$2 = {
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
    style: style$2.layout
  }, h("div", {
    style: style$2.checkboxRoot
  }, h("input", {
    type: "checkbox",
    style: style$2.checkbox,
    onChange: onReport
  }), h("label", null, "Report")), h("div", {
    style: {
      display: 'flex',
      padding: 8
    }
  }, h(Button, {
    "data-testid": "cancel-btn",
    style: style$2.btn,
    onClick: onCancel
  }, "CANCEL"), h(AsyncButton, {
    title: "Block",
    style: style$2.btn,
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

const style$3 = {
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
    style: style$3.layout,
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
  }, h(AsyncButton, {
    "data-testid": "close-btn",
    style: style$3.btn,
    onClick: onClose
  }, "CLOSE"), h(AsyncButton, {
    id: "UNBLOCK",
    style: style$3.btn,
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

const style$4 = {
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
    style: style$4.layout
  }, h("div", null, h(Checkbox, {
    label: "Notifications",
    onChange: onNotification
  }), h(Checkbox, {
    label: "Conversation History",
    onChange: onConversationHistory
  })), h("hr", null), h("div", {
    style: style$4.btnContainer
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
    style: style$4.btnOk
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
    style: style$4.iconBtn
  }, h("button", {
    id: id,
    style: style$4.btn,
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

const style$5 = {
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
    style: style$5.layout,
    id: "invite-ui"
  }, h(Center, null, h(PersonAddIcon, {
    color: "green"
  })), h(Center, null, "Start Conversation with ", h("b", null, hangout && hangout.email)), h(TextInput, {
    id: "messageTextInput",
    onChange: onMessageText,
    value: messageText
  }), h(Center, null, h(AsyncButton, {
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

const style$6 = {
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
    style: style$6.layout,
    id: "invitee-ui"
  }, h(Center, null, h(Done, {
    width: "70",
    height: "70",
    color: "green"
  })), h(Center, null, h("p", null, "You will be able to chat with ", h("b", null, hangout && hangout.email), " once your invition has been accepted.")));
}

var css_248z$3 = ".message-font-phone-size {\r\n  font-size: 10px;\r\n}\r\n\r\n.message-font-tablet-size {\r\n  font-size: 15px;\r\n}\r\n\r\n.font-laptop-size {\r\n  font-size: 20px;\r\n}\r\n\r\n.message-font-desktop-size {\r\n  font-size: 30px;\r\n}";
styleInject(css_248z$3);

const style$7 = {
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
    style: { ...style$7.root,
      float
    }
  }, h("div", {
    "data-testid": "message",
    style: style$7.message,
    className: `message-font-${device}-size`
  }, message && message.text), h("div", {
    style: style$7.log
  }, h("div", {
    style: style$7.username
  }, username && username, ":"), h("div", null, minutes === 0 && h("div", null, "Now"), hours === 0 && minutes > 0 && h("div", null, minutes, " minutes ago "), hours > 0 && days === 0 && h("div", null, hours, " hours ", minutes, " minutes ago", ' '), days <= 10 && days > 1 && h("div", null, days, " days ago")))));
}

const style$8 = {
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
    style: style$8.root
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
  }, h(AsyncButton, {
    id: "DECLINE",
    onClick: onDecline,
    "data-testid": "decline-btn",
    title: "Decline",
    style: {
      flex: 1,
      marginRight: 4,
      color: 'red'
    }
  }, "DECLINE"), h(AsyncButton, {
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
  }, h(AsyncButton, {
    loading: loading,
    disabled: hangout && hangout.state === 'BLOCKED',
    style: styles$1.btn,
    id: "MESSAGE",
    onClick: onMessage,
    "data-testid": "send-btn"
  }, "SENT")));
}

const style$9 = {
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
    style: style$9,
    "data-testid": "blocker-message"
  }, message.text);
}

const style$a = {
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
    style: style$a,
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

const style$b = {
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
    style: { ...style$b,
      backgroundColor: 'green'
    },
    "data-testid": "online"
  });
}
function IsOffline() {
  return h("div", {
    style: { ...style$b,
      backgroundColor: 'red'
    },
    "data-testid": "offline"
  });
}
function Connecting() {
  return h("div", {
    style: { ...style$b,
      backgroundColor: 'orange'
    },
    "data-testid": "connecting"
  });
}
function Closing() {
  return h("div", {
    style: { ...style$b,
      backgroundColor: 'pink'
    },
    "data-testid": "closing"
  });
}

const style$c = {
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
    style: style$c.count,
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

function AsyncButtonDemo() {
  return h("div", null, h(AsyncButton, {
    loading: true,
    title: "Send"
  }), h(AsyncButton, {
    title: "Send"
  }));
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
      height: '80vh'
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
  }, h(IconsDemo, null)), h(AppRoute, {
    path: "/asyncbutton"
  }, h(AsyncButtonDemo, null)));
}

var actionTypes$1 = {
  ACCORDION_SELECTED: 'ACCORDION_SELECTED'
};

const initState = {
  selectedId: 0
};
function reducer$1(state, action) {
  switch (action.type) {
    case actionTypes$1.ACCORDION_SELECTED:
      const nextState = { ...state,
        selectedId: action.selectedId
      };
      return nextState;

    default:
      return state;
  }
}

const AccordionContext = M();
function Accordions(props) {
  const {
    selectedId
  } = props;
  const [state, dispatch] = m$1(reducer$1, { ...initState,
    selectedId
  });
  const value = s$1(() => [state, dispatch], [state]);
  return h(AccordionContext.Provider, _extends({
    value: value
  }, props));
}
function Accordion({
  children,
  title,
  id
}) {
  const [state, dispatch] = T$1(AccordionContext);
  const [visible, setVisible] = v$1(false);
  const {
    selectedId
  } = state;

  function selectAccordion(e) {
    const id = e.target.id;

    if (id !== selectedId) {
      setVisible(true);
    } else {
      setVisible(prev => !prev);
    }

    dispatch({
      type: actionTypes$1.ACCORDION_SELECTED,
      selectedId: id
    });
  }

  return h(List, {
    style: {
      backgroundColor: '#eeeeee',
      padding: 3,
      flex: 1,
      marginBottom: 3
    }
  }, h(ListItem, {
    id: id,
    onClick: selectAccordion,
    style: {
      fontWeight: 900
    }
  }, title), selectedId === id && visible && children);
}

function StorybookDrawerContent({
  toggleDrawer
}) {
  const {
    onAppRoute
  } = useAppRoute();
  const {
    device
  } = useMediaQuery();

  function handleRoute(e) {
    const {
      id
    } = e.target;
    onAppRoute({
      featureRoute: '/',
      route: `/${id}`
    });

    if (device === 'phone') {
      toggleDrawer();
    }
  }

  return h(Accordions, {
    selectedId: "0"
  }, h("div", {
    style: {
      padding: 3
    }
  }, h(Accordion, {
    id: "0",
    title: "Hangout"
  }, h(List, null, h(ListItem, {
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
  }, "BlockerMessage"))), h(Accordion, {
    title: "Icons",
    id: "1"
  }, h(List, null, h(ListItem, {
    id: "icons",
    onClick: handleRoute
  }, "Icons"))), h(Accordion, {
    title: "Components",
    id: "2"
  }, h(List, null, h(ListItem, {
    id: "asyncbutton",
    onClick: handleRoute
  }, "AsyncButton")))));
}

function StorybookNavigation() {
  const [drawerIsOpen, setDrawerState] = v$1(false);
  const {
    device
  } = useMediaQuery();

  function toggleDrawer() {
    setDrawerState(prev => !prev);
  }

  return h("div", {
    style: {
      display: 'flex',
      position: 'fixed',
      width: '100%'
    }
  }, drawerIsOpen && h(Drawer, {
    style: {
      position: 'absolute'
    },
    toggleDrawer: toggleDrawer
  }, h(StorybookDrawerContent, {
    drawerIsOpen: drawerIsOpen,
    toggleDrawer: toggleDrawer
  })), h("div", {
    style: {
      flex: 1
    }
  }, h(AppBar, null, h(Menu, {
    onClick: toggleDrawer
  }), h(NavItem, {
    style: {
      flex: 5
    }
  }, "Storybook")), h(StorybookRoutes, null)));
}

/* eslint-disable no-undef */
function AppProviders({
  children
}) {
  return h(ThemeProvider, {
    initState: {
      primary: {
        background: '#6200EE',
        color: '#ffffff',
        fontFamily: 'Roboto, Helvetica, "Arial"'
      }
    }
  }, h(AppRouteProvider, {
    title: "Webcom",
    initState: {
      route: '/',
      featureRoute: '/hangouts'
    }
  }, children));
}

H(h(AppProviders, null, h(StorybookNavigation, null)), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvbmF2aWdhdGlvbi9zdHlsZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL25hdmlnYXRpb24vRHJhd2VyLmpzIiwiLi4vLi4vY29tcG9uZW50cy90aGVtZS90aGVtZS1jb250ZXh0LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9uYXZpZ2F0aW9uL0FwcEJhci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL25hdmlnYXRpb24vaWNvbnMvTWVudVdoaXRlLmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9uYXZpZ2F0aW9uL01lbnUuanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL25hdmlnYXRpb24vTmF2SXRlbS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9saXN0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy90ZXh0LWlucHV0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9idXR0b24vaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXQuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0xheW91dC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvYXN5bmMtYnV0dG9uL2luZGV4LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9jay5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvQmxvY2suanMiLCIuLi8uLi9jb21wb25lbnRzL2xheW91dC9DZW50ZXIuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrZWQuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0RlbGV0ZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQ29uZmlndXJlLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9QZXJzb25BZGQuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvRG9uZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvTWVzc2FnZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlci5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvTWVzc2FnZUVkaXRvci5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvQmxvY2tlck1lc3NhZ2UuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL0Jsb2NrZWRNZXNzYWdlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9pbmRleC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ2NoYXQuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL29ubGluZVN0YXR1cy5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvTWVzc2FnZS5qcyIsIi4uL0ljb25zRGVtby5qcyIsIi4uL2Zha2VNZXNzYWdlcy5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9VbnJlYWRIYW5nb3V0cy5qcyIsIi4uL1VyZWFkRGVtby5qcyIsIi4uL0Jsb2NrZXJNZXNzYWdlRGVtby5qcyIsIi4uL2NvbXBvbmVudHMvQXN5bmNCdXR0b25EZW1vLmpzIiwiLi4vU3Rvcnlib29rUm91dGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9hY2NvcmRpb24vYWN0aW9uVHlwZXMuanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL2FjY29yZGlvbi9yZWR1Y2VyLmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy9hY2NvcmRpb24vaW5kZXguanMiLCIuLi9TdG9yeWJvb2tEcmF3ZXJDb250ZW50LmpzIiwiLi4vU3Rvcnlib29rTmF2aWdhdGlvbi5qcyIsIi4uL1N0b3J5Ym9va1Byb3ZpZGVycy5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGRyYXdlciA9IHtcclxuICBib3hTaGFkb3c6IGAwcHggM3B4IDNweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSwwcHggM3B4IDRweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDFweCA4cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xMilgLFxyXG5cclxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICBsZWZ0OiAwLFxyXG4gIHRvcDogMCxcclxuICB6SW5kZXg6IDEwLFxyXG4gIGhlaWdodDogJzEwMHZoJyxcclxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjVmNWY1JyxcclxufTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tICcuL2RldmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKSB7XHJcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW29yaWVudGF0aW9uLCBzZXRPcmllbnRhdGlvbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2RldmljZSwgc2V0RGV2aWNlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XHJcbiAgIFxyXG4gICAgICBzZXRXaWR0aCh3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbiAgICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpIHtcclxuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xyXG4gIH1cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoID4gMCkge1xyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDYwMDpcclxuICAgICAgICAgIHNldERldmljZSgncGhvbmUnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNzY4OlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gOTkyOlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcclxuICAgICAgICAgIHNldERldmljZSgndGFibGV0Jyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2xhcHRvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2Rlc2t0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3dpZHRoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2aWNlJywgZGV2aWNlKTtcclxuICB9LCBbZGV2aWNlXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGhhbmRsZVZpZXdwb3J0U2l6ZSgpO1xyXG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgZHJhd2VyIH0gZnJvbSAnLi9zdHlsZSc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERyYXdlcihwcm9wcykge1xyXG4gIGNvbnN0IFtwaW5uZWQsc2V0UGlubmVkXT11c2VTdGF0ZShmYWxzZSlcclxuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7IG9wZW4sIG9uQ2xpY2ssIGNoaWxkcmVuLHN0eWxlIH0gPSBwcm9wcztcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXZcclxuICAgICAgIHN0eWxlPXt7Li4uZHJhd2VyLHBvc2l0aW9uOiBkZXZpY2U9PT1cInBob25lXCIgPyAnZml4ZWQnOidyZWxhdGl2ZSd9fVxyXG4gICAgICAgIGNsYXNzTmFtZT17YGRyYXdlci0ke2RldmljZX0td2lkdGhgfVxyXG4gICAgICA+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFRoZW1lQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZVRoZW1lQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xyXG5cclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFRoZW1lUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGhlbWVQcm92aWRlcihwcm9wcykge1xyXG4gIFxyXG4gIGNvbnN0IHsgaW5pdFN0YXRlIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0U3RhdGUpO1xyXG5cclxuICByZXR1cm4gPFRoZW1lQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17c3RhdGV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9O1xyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlVGhlbWVDb250ZXh0IH0gZnJvbSAnLi4vLi4vdGhlbWUvdGhlbWUtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBCYXIoeyBjaGlsZHJlbixzdHlsZSB9KSB7XHJcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZUNvbnRleHQoKTtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIC4uLnRoZW1lLnByaW1hcnksXHJcbiAgICAgICAvLyAgcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgLy8gbGVmdDogMCxcclxuICAgICAgIC8vICB0b3A6IDAsXHJcbiAgICAgICAgbWluSGVpZ2h0OiA2NCxcclxuICAgICAgIC8vIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgIC8vIHBhZGRpbmdSaWdodDogMTYsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICBkaXNwbGF5OidmbGV4JywuLi5zdHlsZVxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgJy4uL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudVdoaXRlKHsgb25DbGljaywgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPVwibWVudS13aGl0ZVwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICBmaWxsPVwid2hpdGVcIlxyXG4gICAgICB3aWR0aD1cIjI0cHhcIlxyXG4gICAgICBoZWlnaHQ9XCIyNHB4XCJcclxuICAgID5cclxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMyAxOGgxOHYtMkgzdjJ6bTAtNWgxOHYtMkgzdjJ6bTAtN3YyaDE4VjZIM3pcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTWVudVdoaXRlIH0gZnJvbSAnLi9pY29ucy9NZW51V2hpdGUnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudSh7b25DbGlja30pIHtcclxuXHJcblxyXG4gIHJldHVybiA8TWVudVdoaXRlIG9uQ2xpY2s9e29uQ2xpY2t9IGlkPVwibWVudVwiIC8+O1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcydcclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0gKHByb3BzKXtcclxuY29uc3Qge2NoaWxkcmVufT1wcm9wc1xyXG5yZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiey4uLnByb3BzfT57Y2hpbGRyZW59PC9kaXY+XHJcbn0iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcclxuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXHJcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5cclxuXHJcblxyXG4gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGlzdChwcm9wcykge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3RcIiB7Li4ucHJvcHN9Lz5cclxuICApO1xyXG59XHJcblxyXG5cclxuIGZ1bmN0aW9uIExpc3RJdGVtKHByb3BzKSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtaXRlbVwiIHsuLi5wcm9wc30gLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQge0xpc3RJdGVtfSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHBhZGRpbmc6IDgsXHJcbiAgbWFyZ2luTGVmdDogMTYsXHJcbiAgbWFyZ2luUmlnaHQ6IDE2LFxyXG4gIG1hcmdpblRvcDogOCxcclxuICBtYXJnaW5Cb3R0b206IDgsXHJcbiAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgZmxleDogMSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiAgPlxyXG4gICAgICA8aW5wdXQgey4uLnByb3BzfS8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0aXRsZSxzdHlsZSxpZCB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgey4uLnByb3BzfT5cclxuICAgICAge3RpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCBMaXN0LHsgTGlzdEl0ZW0gfSBmcm9tICdjb250cm9scy9saXN0JztcclxuaW1wb3J0ICBUZXh0SW5wdXQgIGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgIEJ1dHRvbiAgZnJvbSAnY29udHJvbHMvYnV0dG9uJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuXHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpbnB1dENvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYm9yZGVyOiAnIzczNzM3MyBzb2xpZCAxcHgnLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIHBhZGRpbmc6IDEwLFxyXG4gICAgZmxleDogMSxcclxuICAgIGJvcmRlcjogJ3doaXRlJyxcclxuXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXQoe1xyXG4gIGhhbmdvdXRzLFxyXG4gIG9uU2VhcmNoSW5wdXQsXHJcbiAgb25GZXRjaEhhbmdvdXRzLFxyXG4gIG9uU2VsZWN0SGFuZ291dCxcclxuICBzZWFyY2hcclxufSkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRTZWxlY3Rpb24oZSkge1xyXG4gICAgY29uc3QgaWQgPSBlLnRhcmdldC5pZFxyXG4gICAgb25TZWxlY3RIYW5nb3V0KGUpXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZChnID0+IGcudXNlcm5hbWUgPT09IGlkKVxyXG5cclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KVxyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiAoXHJcblxyXG4gICAgPGRpdiA+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cclxuICAgICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgICB2YWx1ZT17c2VhcmNofVxyXG4gICAgICAgICAgaWQ9XCJzZWFyY2gtaW5wdXRcIlxyXG4gICAgICAgICAgdHlwZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2hJbnB1dH1cclxuICAgICAgICAgIHN0eWxlPXtzdHlsZS5pbnB1dH1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxCdXR0b25cclxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWJ0blwiXHJcbiAgICAgICAgICBkaXNhYmxlZD17IXNlYXJjaH1cclxuICAgICAgICAgIHRpdGxlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG9uQ2xpY2s9e29uRmV0Y2hIYW5nb3V0c31cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxMaXN0IGlkPVwiaGFuZ291dHMtbGlzdFwiPlxyXG4gICAgICAgIHtoYW5nb3V0cyAmJlxyXG4gICAgICAgICAgaGFuZ291dHMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgPExpc3RJdGVtIGlkPXtnLnVzZXJuYW1lfSBkYXRhLXRlc3RpZD17Zy51c2VybmFtZX0gb25DbGljaz17aGFuZGxlSGFuZ291dFNlbGVjdGlvbn0+XHJcbiAgICAgICAgICAgICAgICB7Zy51c2VybmFtZX1cclxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2VlZWVlZScsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMYXlvdXQoeyBjaGlsZHJlbiwgc3R5bGUsIGlkIH0pIHtcclxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17aWR9IHN0eWxlPXt7IC4uLnN0eWxlcy5yb290LCAuLi5zdHlsZSB9fT57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJ1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNpcmNsZToge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgICAgICB3aWR0aDogMTAsXHJcbiAgICAgICAgaGVpZ2h0OiAxMCxcclxuICAgICAgICBib3JkZXJSYWRpdXM6IDEwLFxyXG4gICAgICAgIG1hcmdpblJpZ2h0OiAzLFxyXG4gICAgICAgIHBhZGRpbmc6MyxcclxuICAgIH0sXHJcbiAgICBjaXJjbGVDb250YWluZXI6IHtcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCdcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gUHJvZ3Jlc3NCYXIoKSB7XHJcbiAgICBjb25zdCBbc2VsZWN0ZWQsIHNldFNlbGVjdGVkXSA9IHVzZVN0YXRlKDApXHJcbiAgICBjb25zdCBbc3RhdGUsc2V0U3RhdGVdPXVzZVN0YXRlKGZhbHNlKVxyXG4gICAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICAgICAgaWYoc3RhdGUpe1xyXG4gICAgICAgICAgICBpZihzZWxlY3RlZD09PTApe1xyXG4gICAgICAgICAgICAgICAgc2V0U2VsZWN0ZWQoMSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihzZWxlY3RlZD09PTEpe1xyXG4gICAgICAgICAgICAgICAgc2V0U2VsZWN0ZWQoMilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihzZWxlY3RlZD09PTIpe1xyXG4gICAgICAgICAgICAgICAgc2V0U2VsZWN0ZWQoMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICBcclxuXHJcbiAgICB9LFtzdGF0ZV0pXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGxldCBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgIHNldFN0YXRlKHByZXY9PiAhcHJldilcclxuICAgICAgICB9LCAxMDApXHJcblxyXG4gICAgICAgIHJldHVybiAoKT0+e1xyXG4gICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpXHJcbiAgICAgICAgfVxyXG4gICAgfSwgW10pXHJcblxyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlLmNpcmNsZUNvbnRhaW5lcn0gY2xhc3NOYW1lPVwiYnRuXCI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5jaXJjbGUsIGJhY2tncm91bmRDb2xvcjogc2VsZWN0ZWQgPT09IDAgPyAnd2hpdGUnIDogJ2dyZWVuJyB9fT48L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLmNpcmNsZSwgYmFja2dyb3VuZENvbG9yOiBzZWxlY3RlZCA9PT0gMSA/ICd3aGl0ZScgOiAnZ3JlZW4nIH19PjwvZGl2PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGUuY2lyY2xlLCBiYWNrZ3JvdW5kQ29sb3I6IHNlbGVjdGVkID09PSAyID8gJ3doaXRlJyA6ICdncmVlbicgfX0+PC9kaXY+XHJcblxyXG4gICAgPC9kaXY+XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFzeW5jQnV0dG9uKHByb3BzKSB7XHJcbiAgICBjb25zdCB7bG9hZGluZ309cHJvcHNcclxuICAgIGlmIChsb2FkaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIDxQcm9ncmVzc0JhciAvPlxyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgcmV0dXJuIDxidXR0b24gIGNsYXNzTmFtZT1cImJ0blwiIHsuLi5wcm9wc30vPlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgIExheW91dCAgZnJvbSAnLi9MYXlvdXQnO1xyXG5pbXBvcnQgIEJ1dHRvbiAgZnJvbSAnY29udHJvbHMvYnV0dG9uJztcclxuaW1wb3J0IEFzeW5jQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2FzeW5jLWJ1dHRvbidcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgY2hlY2tib3g6IHsgbWFyZ2luUmlnaHQ6IDggfSxcclxuICBjaGVja2JveFJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgcGFkZGluZzogMTYsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nVG9wOjY4XHJcbiAgfSxcclxuICBidG46IHtcclxuICAgIGZsZXg6IDEsXHJcbiAgICBtYXJnaW5SaWdodDogNCxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2soeyBvbkNhbmNlbCwgb25CbG9jaywgb25SZXBvcnQgfSkge1xyXG5cclxuIFxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jaGVja2JveFJvb3R9PlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBzdHlsZT17c3R5bGUuY2hlY2tib3h9IG9uQ2hhbmdlPXtvblJlcG9ydH0gLz5cclxuICAgICAgICA8bGFiZWw+UmVwb3J0PC9sYWJlbD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxyXG4gICAgICAgIDxCdXR0b24gZGF0YS10ZXN0aWQ9J2NhbmNlbC1idG4nIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2FuY2VsfSA+Q0FOQ0VMPC9CdXR0b24+XHJcbiAgICAgICAgPEFzeW5jQnV0dG9uIHRpdGxlPVwiQmxvY2tcIiBzdHlsZT17c3R5bGUuYnRufSBpZD1cIkJMT0NLXCIgb25DbGljaz17b25CbG9ja30gZGF0YS10ZXN0aWQ9XCJibG9jay1idG5cIiA+QkxPQ0s8L0FzeW5jQnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9jayh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBvbkNsaWNrLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgaGVpZ2h0PXtoZWlnaHR9XHJcbiAgICAgIHZpZXdCb3g9JzAgMCAyNCAyNCdcclxuICAgICAgd2lkdGg9e3dpZHRofVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBpZD17aWR9XHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6TTQgMTJjMC00LjQyIDMuNTgtOCA4LTggMS44NSAwIDMuNTUuNjMgNC45IDEuNjlMNS42OSAxNi45QzQuNjMgMTUuNTUgNCAxMy44NSA0IDEyem04IDhjLTEuODUgMC0zLjU1LS42My00LjktMS42OUwxOC4zMSA3LjFDMTkuMzcgOC40NSAyMCAxMC4xNSAyMCAxMmMwIDQuNDItMy41OCA4LTggOHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQ2VudGVyKHsgY2hpbGRyZW4sIHN0eWxlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcclxuICAgICAgICAuLi5zdHlsZSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnaWNvbnMvQmxvY2snO1xyXG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgIEFzeW5jQnV0dG9uICBmcm9tICdjb250cm9scy9hc3luYy1idXR0b24nO1xyXG5pbXBvcnQgIExheW91dCAgZnJvbSAnLi9MYXlvdXQnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgcGFkZGluZ1RvcDo2OFxyXG4gIH0sXHJcbiAgYnRuOiB7XHJcbiAgICBmbGV4OiAxLFxyXG4gICAgbWFyZ2luUmlnaHQ6IDQsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsb2NrZWQoeyBoYW5nb3V0LCBvblVuYmxvY2ssIG9uQ2xvc2UgfSkge1xyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJibG9ja2VkLXVpXCI+XHJcbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxyXG4gICAgICAgIDxCbG9jayB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cInJlZFwiIC8+XHJcbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcclxuICAgICAgPC9DZW50ZXI+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgcGFkZGluZzogOCB9fT5cclxuICAgICAgICA8QXN5bmNCdXR0b24gZGF0YS10ZXN0aWQ9J2Nsb3NlLWJ0bicgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbG9zZX0gPkNMT1NFPC9Bc3luY0J1dHRvbj5cclxuICAgICAgICA8QXN5bmNCdXR0b24gaWQ9J1VOQkxPQ0snICBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvblVuYmxvY2t9IGRhdGEtdGVzdGlkPSd1bmJsb2NrLWJ0bic+VU5CTE9DSzwvQXN5bmNCdXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIERlbGV0ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHonXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFyY2hpdmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnbm9uZScsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9ezI0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTIwLjU0IDUuMjNsLTEuMzktMS42OEMxOC44OCAzLjIxIDE4LjQ3IDMgMTggM0g2Yy0uNDcgMC0uODguMjEtMS4xNi41NUwzLjQ2IDUuMjNDMy4xNyA1LjU3IDMgNi4wMiAzIDYuNVYxOWMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjYuNWMwLS40OC0uMTctLjkzLS40Ni0xLjI3ek0xMiAxNy41TDYuNSAxMkgxMHYtMmg0djJoMy41TDEyIDE3LjV6TTUuMTIgNWwuODEtMWgxMmwuOTQgMUg1LjEyeidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcbmltcG9ydCB7IERlbGV0ZSB9IGZyb20gJ2ljb25zL0RlbGV0ZSc7XHJcbmltcG9ydCB7IEFyY2hpdmUgfSBmcm9tICdpY29ucy9BcmNoaXZlJztcclxuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICAnaWNvbnMvQmxvY2snO1xyXG5pbXBvcnQgIEJ1dHRvbiAgZnJvbSAnY29udHJvbHMvYnV0dG9uJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgaWNvbkJ0bjogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW46IDggfSxcclxuICBidG46IHsgbWFyZ2luUmlnaHQ6IDggfSxcclxuICBidG5Db250YWluZXI6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gIH0sXHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICB9LFxyXG4gIGJ0bk9rOiB7XHJcbiAgICBtYXJnaW46IDgsXHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlndXJlKHtcclxuICBvbkJsb2NrLFxyXG4gIG9uRGVsZXRlLFxyXG4gIG9uQXJjaGl2ZSxcclxuICBvbk5vdGlmaWNhdGlvbixcclxuICBvbkNvbnZlcnNhdGlvbkhpc3RvcnksXHJcbiAgb25OYXZpZ2F0aW9uLFxyXG4gIG9uT2ssXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8Q2hlY2tib3ggbGFiZWw9XCJOb3RpZmljYXRpb25zXCIgb25DaGFuZ2U9e29uTm90aWZpY2F0aW9ufSAvPlxyXG4gICAgICAgIDxDaGVja2JveFxyXG4gICAgICAgICAgbGFiZWw9XCJDb252ZXJzYXRpb24gSGlzdG9yeVwiXHJcbiAgICAgICAgICBvbkNoYW5nZT17b25Db252ZXJzYXRpb25IaXN0b3J5fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8aHIgLz5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuQ29udGFpbmVyfT5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkFyY2hpdmVcIiBJY29uPXtBcmNoaXZlfSBvbkNsaWNrPXtvbkFyY2hpdmV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJEZWxldGVcIiBJY29uPXtEZWxldGV9IG9uQ2xpY2s9e29uRGVsZXRlfSAvPlxyXG4gICAgICAgIDxJY29uQnV0dG9uIGlkPVwiYmNrdWlcIiB0aXRsZT1cIkJsb2NrXCIgSWNvbj17QmxvY2t9IG9uQ2xpY2s9e29uTmF2aWdhdGlvbn0gIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Pa30+XHJcbiAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvbk9rfT5PSzwvQnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEljb25CdXR0b24oeyBJY29uLCB0aXRsZSwgb25DbGljayxpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLmljb25CdG59PlxyXG4gICAgICA8YnV0dG9uIGlkPXtpZH0gc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25DbGlja30gZGF0YS10ZXN0aWQ9e2Ake2lkfS1idG5gfT5cclxuICAgICAgICA8SWNvbiBpZD17aWR9Lz5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxkaXY+e3RpdGxlfTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2hlY2tib3goeyBsYWJlbCwgb25DaGFuZ2UgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbjogOCwgbWFyZ2luVG9wOiA4IH19PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxyXG4gICAgICA8bGFiZWw+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQZXJzb25BZGRJY29uKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ3doaXRlJyxcclxuICBzdHlsZSxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTUgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0tOS0yVjdINHYzSDF2MmgzdjNoMnYtM2gzdi0ySDZ6bTkgNGMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgUGVyc29uQWRkIGZyb20gJ2ljb25zL1BlcnNvbkFkZCc7XHJcbmltcG9ydCAgVGV4dElucHV0ICBmcm9tICdjb250cm9scy90ZXh0LWlucHV0JztcclxuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyJztcclxuaW1wb3J0ICBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IEFzeW5jQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2FzeW5jLWJ1dHRvbidcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICB9LFxyXG59O1xyXG4vL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGUoeyBoYW5nb3V0LCBvbkludml0ZSwgb25NZXNzYWdlVGV4dCxtZXNzYWdlVGV4dCwgbG9hZGluZyB9KSB7XHJcblxyXG4gIFxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9aWQ9XCJpbnZpdGUtdWlcIj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8UGVyc29uQWRkIGNvbG9yPVwiZ3JlZW5cIiAvPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICBTdGFydCBDb252ZXJzYXRpb24gd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxUZXh0SW5wdXQgaWQ9XCJtZXNzYWdlVGV4dElucHV0XCIgb25DaGFuZ2U9e29uTWVzc2FnZVRleHR9IHZhbHVlPXttZXNzYWdlVGV4dH0gLz5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8QXN5bmNCdXR0b24gbG9hZGluZz17bG9hZGluZ30gIGlkPVwiSU5WSVRFXCIgb25DbGljaz17b25JbnZpdGV9IGRhdGEtdGVzdGlkPSdvbmludml0ZS1idG4nID5cclxuICAgICAgICAgIFNFTkQgSU5WSVRFXHJcbiAgICAgICAgPC9Bc3luY0J1dHRvbj5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERvbmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTkgMTYuMkw0LjggMTJsLTEuNCAxLjRMOSAxOSAyMSA3bC0xLjQtMS40TDkgMTYuMnonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBEb25lIH0gZnJvbSAnaWNvbnMvRG9uZSc7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L0NlbnRlcic7XHJcbmltcG9ydCAgTGF5b3V0ICBmcm9tICcuL0xheW91dCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludml0ZWUoeyBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiaW52aXRlZS11aVwiPlxyXG4gICAgICA8Q2VudGVyPlxyXG4gICAgICAgIDxEb25lIHdpZHRoPVwiNzBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwiZ3JlZW5cIiAvPlxyXG4gICAgICA8L0NlbnRlcj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8cD5cclxuICAgICAgICAgIFlvdSB3aWxsIGJlIGFibGUgdG8gY2hhdCB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPiBvbmNlXHJcbiAgICAgICAgICB5b3VyIGludml0aW9uIGhhcyBiZWVuIGFjY2VwdGVkLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGJvcmRlckNvbG9yOiAnI2VlZWVlZScsXHJcbiAgICBib3JkZXJTdHlsZTogJ3NvbGlkJyxcclxuICAgIGJvcmRlcldpZHRoOiAxLFxyXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxyXG4gICAgcGFkZGluZzogMyxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIG1pbkhlaWdodDogMzUsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXHJcbiAgfSxcclxuICB1c2VybmFtZTogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGxvZzoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgY29sb3I6ICcjNzM3MzczJyxcclxuICAgIGZvbnRTaXplOiAxMCxcclxuICB9LFxyXG4gIG1lc3NhZ2U6IHt9LFxyXG59O1xyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZShwcm9wcykge1xyXG4gIGNvbnN0IHsgbWVzc2FnZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgeyBmbG9hdCwgdXNlcm5hbWUsdGltZXN0YW1wIH0gPSBtZXNzYWdlO1xyXG4gIGNvbnN0IFtkYXlzLCBzZXREYXlzXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtob3Vycywgc2V0SG91cnNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW21pbnV0ZXMsIHNldE1pbnV0ZXNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW3NlY29uZHMsIHNldFNlY29uZHNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBmdW5jdGlvbiBjb252ZXJ0TVMobXMpIHtcclxuICAgIHZhciBkLCBoLCBtLCBzO1xyXG4gICAgcyA9IE1hdGguZmxvb3IobXMgLyAxMDAwKTtcclxuICAgIG0gPSBNYXRoLmZsb29yKHMgLyA2MCk7XHJcbiAgICBzID0gcyAlIDYwO1xyXG4gICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcclxuICAgIG0gPSBtICUgNjA7XHJcbiAgICBkID0gTWF0aC5mbG9vcihoIC8gMjQpO1xyXG4gICAgaCA9IGggJSAyNDtcclxuICAgIHNldERheXMoZCk7XHJcbiAgICBzZXRIb3VycyhoKTtcclxuICAgIHNldE1pbnV0ZXMobSk7XHJcbiAgICBzZXRTZWNvbmRzKHMpO1xyXG4gIH1cclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmKHRpbWVzdGFtcCl7XHJcbiAgXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcclxuICAgICAgfSwgMCk7XHJcbiAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIHRpbWVzdGFtcCk7XHJcbiAgICAgIH0sIDYwMDAwKTtcclxuIFxyXG5cclxuICAgIH1cclxuICAgXHJcbiAgfSwgW3RpbWVzdGFtcF0pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBtYXJnaW5Cb3R0b206IDMgfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGUucm9vdCwgZmxvYXQgfX0+XHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJtZXNzYWdlXCJcclxuICAgICAgICAgIHN0eWxlPXtzdHlsZS5tZXNzYWdlfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgbWVzc2FnZS1mb250LSR7ZGV2aWNlfS1zaXplYH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7bWVzc2FnZSAmJiBtZXNzYWdlLnRleHR9XHJcbiAgICAgICAgXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUubG9nfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnVzZXJuYW1lfT57dXNlcm5hbWUgJiYgdXNlcm5hbWV9OjwvZGl2PlxyXG4gIDxkaXY+XHJcbiAgICAgICAgICAgIHttaW51dGVzID09PSAwICYmIDxkaXY+Tm93PC9kaXY+fVxyXG4gICAgICAgICAgICB7aG91cnMgPT09IDAgJiYgbWludXRlcyA+IDAgJiYgPGRpdj57bWludXRlc30gbWludXRlcyBhZ28gPC9kaXY+fVxyXG4gICAgICAgICAgICB7aG91cnMgPiAwICYmIGRheXMgPT09IDAgJiYgKFxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICB7aG91cnN9IGhvdXJzIHttaW51dGVzfSBtaW51dGVzIGFnb3snICd9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIHtkYXlzIDw9IDEwICYmIGRheXMgPiAxICYmIDxkaXY+e2RheXN9IGRheXMgYWdvPC9kaXY+fVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vbWVzc2FnZXMvTWVzc2FnZSc7XHJcbmltcG9ydCBMYXlvdXQgIGZyb20gJy4vTGF5b3V0JztcclxuaW1wb3J0IEFzeW5jQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2FzeW5jLWJ1dHRvbidcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBwYWRkaW5nVG9wOiA3MCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIHBhZGRpbmdCb3R0b206OCxcclxuIFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSxsb2FkaW5nIH0pIHtcclxuIFxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IGlkPVwiaW52aXRlci11aVwiPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkxlZnQ6IDgsIGRpc3BsYXk6J2ZsZXgnIH19PlxyXG4gICAgICAgICAge2hhbmdvdXQgJiYgaGFuZ291dC5tZXNzYWdlICYmIChcclxuICAgICAgICAgICAgPE1lc3NhZ2VcclxuICAgICAgICAgICAgICBtZXNzYWdlPXtcclxuICAgICAgICAgICAgICAgIGhhbmdvdXQgJiZcclxuICAgICAgICAgICAgICAgIGhhbmdvdXQubWVzc2FnZSAmJiB7XHJcbiAgICAgICAgICAgICAgICAgIC4uLmhhbmdvdXQubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsZmxvYXQ6J2xlZnQnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcscGFkZGluZ0xlZnQ6OCxwYWRkaW5nUmlnaHQ6OCB9fT5cclxuICAgICAgICAgIDxBc3luY0J1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkRFQ0xJTkVcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkRlY2xpbmV9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVjbGluZS1idG5cIlxyXG4gICAgICAgICAgICB0aXRsZT1cIkRlY2xpbmVcIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5SaWdodDogNCwgY29sb3I6ICdyZWQnIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIERFQ0xJTkVcclxuICAgICAgICAgIDwvQXN5bmNCdXR0b24+XHJcbiAgICAgICAgICA8QXN5bmNCdXR0b25cclxuICAgICAgICAgICAgaWQ9XCJBQ0NFUFRcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkFjY2VwdH1cclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NlcHQtYnRuXCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgbWFyZ2luTGVmdDogNCwgY29sb3I6ICdncmVlbicgfX1cclxuICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgQUNDRVBUXHJcbiAgICAgICAgICA8L0FzeW5jQnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAgVGV4dElucHV0ICBmcm9tICdjb250cm9scy90ZXh0LWlucHV0JztcclxuaW1wb3J0IEFzeW5jQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2FzeW5jLWJ1dHRvbidcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAvLyBwb3NpdGlvbjonZml4ZWQnLFxyXG4gICAgd2lkdGg6JzEwMCUnLFxyXG4gICAgLy8gYm90dG9tOjEwLFxyXG4gICAgLy8gcmlnaHQ6MTAsXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgLy9tYXJnaW46MFxyXG4gICAgcGFkZGluZzogNSxcclxuICAgIG1hcmdpbkxlZnQ6IDgsXHJcbiAgICBtYXJnaW5SaWdodDogOCxcclxuICAgIG1hcmdpblRvcDogOCxcclxuICAgIG1hcmdpbkJvdHRvbTogOCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgZmxleDogMSxcclxuICAgIHdpZHRoOicxMDAlJ1xyXG4gIH0sXHJcbiAgYnRuOntcclxuICAgIHBhZGRpbmc6IDgsXHJcbiAgICBtYXJnaW5MZWZ0OiAxNixcclxuICAgIG1hcmdpblJpZ2h0OiAxNixcclxuICAgIG1hcmdpblRvcDogOCxcclxuICAgIG1hcmdpbkJvdHRvbTogOCxcclxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgZmxleDogMSxcclxuICB9XHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlRWRpdG9yKHsgbG9hZGluZyxtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlLGhhbmdvdXQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XHJcbiAgICAgPGRpdiBzdHlsZT17e2ZsZXg6MX19PlxyXG4gICAgIDxUZXh0SW5wdXQgc3R5bGU9e3N0eWxlcy5pbnB1dH0gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17b25NZXNzYWdlVGV4dH0gIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiIHZhbHVlPXttZXNzYWdlVGV4dH0vPlxyXG4gICAgIDwvZGl2PlxyXG4gICBcclxuICAgICAgXHJcbiAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5MZWZ0OjN9fT5cclxuICAgICAgICA8QXN5bmNCdXR0b24gbG9hZGluZz17bG9hZGluZ30gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgc3R5bGU9e3N0eWxlcy5idG59ICAgaWQ9J01FU1NBR0UnIG9uQ2xpY2s9e29uTWVzc2FnZX0gZGF0YS10ZXN0aWQ9J3NlbmQtYnRuJz5cclxuU0VOVFxyXG4gICAgICAgIDwvQXN5bmNCdXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlck1lc3NhZ2UoeyBtZXNzYWdlIH0pIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VyLW1lc3NhZ2VcIj57bWVzc2FnZS50ZXh0fTwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBmbG9hdDogJ3JpZ2h0JyxcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICBmb250U2l6ZTogMTYsXHJcbiAgICB0ZXh0QWxpZ246ICdlbmQnXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZWRNZXNzYWdlKHsgbWVzc2FnZSxvbk5hdmlnYXRpb24gfSkge1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlTmF2aWdhdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBvbk5hdmlnYXRpb24oZSlcclxuICAgIH1cclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZWQtbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9XHJcbiAgICA8YSBpZD1cIlVOQkxPQ0tcIiBkYXRhLXRlc3RpZD1cInNlZW1vcmUtYnRuXCIgaHJlZj1cIi9cIiBvbkNsaWNrPXtoYW5kbGVOYXZpZ2F0aW9ufT5zZWUgbW9yZTwvYT5cclxuICAgIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VFZGl0b3IgfSBmcm9tICcuL01lc3NhZ2VFZGl0b3InO1xyXG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZSB9IGZyb20gJy4vQmxvY2tlck1lc3NhZ2UnXHJcbmltcG9ydCB7QmxvY2tlZE1lc3NhZ2V9IGZyb20gJy4vQmxvY2tlZE1lc3NhZ2UnXHJcbmltcG9ydCB7dXNlTWVkaWFRdWVyeX0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvdXNlTWVkaWFRdWVyeSdcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIG1lc3NhZ2VDb250YWluZXI6IHtcclxuICAgIC8vIHdpZHRoOiAnMTAwJScsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmc6IDMsXHJcbiAgLy8gIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXHJcbiAgICBmbGV4OiAzLFxyXG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXHJcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCJcclxuXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVzc2FnZXMoe1xyXG4gIG1lc3NhZ2VzLFxyXG4gIG9uTWVzc2FnZSxcclxuICBvbk1lc3NhZ2VUZXh0LFxyXG4gIG1lc3NhZ2VUZXh0LFxyXG4gIHVzZXJuYW1lLFxyXG4gIGhhbmdvdXQsXHJcbiAgb25OYXZpZ2F0aW9uLFxyXG4gIGxvYWRpbmdcclxufSkge1xyXG4gIGNvbnN0IHNjcm9sbGVyUmVmID0gdXNlUmVmKG51bGwpO1xyXG5jb25zdCB7ZGV2aWNlfT11c2VNZWRpYVF1ZXJ5KClcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChtZXNzYWdlcykge1xyXG4gICAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH0sIFttZXNzYWdlc10pO1xyXG5cclxuICBmdW5jdGlvbiBvblNlbmQoZSkge1xyXG4gICAgb25NZXNzYWdlKGUpO1xyXG4gICAgc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbEhlaWdodDtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3suLi5zdHlsZXMubWVzc2FnZUNvbnRhaW5lcixmbGV4OiBkZXZpY2U9PT0ncGhvbmUnPzQ6Mn19IHJlZj17c2Nyb2xsZXJSZWZ9PlxyXG4gICAgICAgIHttZXNzYWdlcyAmJiAgXHJcbiAgICAgICAgICBtZXNzYWdlcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXM6IHNvcnRNZXNzYWdlcyh7IG1lc3NhZ2VzIH0pLCB1c2VybmFtZSB9KS5tYXAoXHJcbiAgICAgICAgICAgIChtKSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XHJcbiAgICAgICAgICAgICAgICB7JyAnfVxyXG4gICAgICAgICAgICAgICAgeyFtLnR5cGUgJiYgPE1lc3NhZ2UgbWVzc2FnZT17bX0gLz59XHJcbiAgICAgICAgICAgICAgICB7bS50eXBlICYmIG0udHlwZSA9PT0gJ2Jsb2NrZXInICYmIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttfSAvPn1cclxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSAnYmxvY2tlZCcgJiYgPEJsb2NrZWRNZXNzYWdlIG1lc3NhZ2U9e219IG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufS8+fVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApfVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17e2ZsZXg6MX19PlxyXG4gICAgICAgIDxNZXNzYWdlRWRpdG9yXHJcbiAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxyXG4gICAgICAgICAgb25NZXNzYWdlPXtvblNlbmR9XHJcbiAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XHJcbiAgICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuZnVuY3Rpb24gZmxvYXRNZXNzYWdlcyh7IG1lc3NhZ2VzLCB1c2VybmFtZSB9KSB7XHJcbiAgaWYgKG1lc3NhZ2VzICYmIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgdXNlcm5hbWUpIHtcclxuICAgIHJldHVybiBtZXNzYWdlcy5tYXAoKG1zZykgPT4ge1xyXG4gICAgICBpZiAobXNnLnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIHJldHVybiB7IC4uLm1zZywgZmxvYXQ6ICdyaWdodCcsIHVzZXJuYW1lOiAnbWUnIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ2xlZnQnIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2VzLnNvcnQoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgIE1lc3NhZ2VzICBmcm9tICcuL21lc3NhZ2VzJztcclxuaW1wb3J0IExheW91dCAgZnJvbSAnLi9MYXlvdXQnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdjaGF0KHtcclxuICBsb2FkaW5nLFxyXG4gIG1lc3NhZ2VzID0gW10sXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBvbk1lc3NhZ2UsXHJcbiAgbWVzc2FnZVRleHQsXHJcbiAgdXNlcm5hbWUsXHJcbiAgaGFuZ291dCxcclxuICBvbk5hdmlnYXRpb24sXHJcblxyXG59KSB7XHJcblxyXG4gIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgZG9jdW1lbnQudGl0bGU9aGFuZ291dC51c2VybmFtZVxyXG5cclxuICB9LFtdKVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImhhbmdjaGF0LXVpXCIgPlxyXG4gICAgICA8TWVzc2FnZXNcclxuICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XHJcbiAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XHJcbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XHJcbiAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICBtZXNzYWdlVGV4dCA9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgLz5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJ2ljb25zL01lc3NhZ2UnXHJcbmV4cG9ydCBmdW5jdGlvbiBJY29uc0RlbW8oKXtcclxuICAgIHJldHVybiA8ZGl2PlxyXG5cclxuICAgICAgICA8TWVzc2FnZSBjb3VudD17MX0vPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJleHBvcnQgY29uc3QgbWVzc2FnZXMgPVtcclxuICAgIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzE3ODk5NzEsXHJcbiAgfSxcclxuICAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYE9rIExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMyMTYzNDYyLFxyXG4gIH0se1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBIb3cgYXJlIHlvdSBkZW1vYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzYzNTcyMyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBhbGwgcmlnaHRgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjc3NTczLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYFllcyBJIGFtLiBIb3cgYXJlIHlvdWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDYsXHJcbiAgfSxcclxuICAsXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgZG9pbmcgZ3JlYXRlYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OCxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbl0iLCJleHBvcnQgZnVuY3Rpb24gcmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pe1xyXG4gICAgcmV0dXJuIHVucmVhZGhhbmdvdXRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gKGFjY3VtdWxhdG9yID0gW3sgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH1dKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3Qgb2JqID0gYWNjdW11bGF0b3IuZmluZChcclxuICAgICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWUgJiYgY3VycmVudC5zdGF0ZSA9PT0gJ01FU1NBTkdFUidcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYWNjdW11bGF0b3IuZmluZEluZGV4KFxyXG4gICAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XHJcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnNwbGljZShpbmRleCwgMSwge1xyXG4gICAgICAgICAgICAgIC4uLm9iaixcclxuICAgICAgICAgICAgICBtZXNzYWdlQ291bnQ6ICsrb2JqLm1lc3NhZ2VDb3VudCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHsgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgIH0sIFtdKTtcclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IExpc3QseyBMaXN0SXRlbSB9IGZyb20gJ2NvbnRyb2xzL2xpc3QnO1xyXG5pbXBvcnQge3JlZHVjZXJVbnJlYWRoYW5nb3V0c30gZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvcmVkdWNlVW5yZWFkaGFuZ291dHMnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVucmVhZEhhbmdvdXRzKHsgdW5yZWFkaGFuZ291dHMsb25TZWxlY3RVbnJlYWQsb25SZW1vdmVVbnJlYWQgfSkge1xyXG5cclxuICBjb25zdCBbaXRlbXMsc2V0SXRlbXNdID11c2VTdGF0ZShbXSlcclxudXNlRWZmZWN0KCgpPT57XHJcbmlmKHVucmVhZGhhbmdvdXRzKXtcclxuXHJcbiAgY29uc3QgcmVkdWNlZCA9cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pXHJcbiBcclxuICBzZXRJdGVtcyhyZWR1Y2VkKVxyXG59XHJcblxyXG59LFt1bnJlYWRoYW5nb3V0c10pXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPSd1bnJlYWRoYW5nb3V0cycgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIHtpdGVtcyAmJlxyXG4gICAgICAgICAgaXRlbXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgaXRlbXMubWFwKCh1KSA9PiB7XHJcbiAgICAgICBcclxuICAgICAgICAgIHJldHVybiAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnfX0+XHJcbiAgICAgICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtvblNlbGVjdFVucmVhZH0gaWQ9e3UudXNlcm5hbWV9IHN0eWxlPXt7ZmxleDo1fX0gZGF0YS10ZXN0aWQ9e2Ake3UudXNlcm5hbWV9LXNlbGVjdGB9Pnt1LnVzZXJuYW1lfSBtZXNzYWdlczoge3UubWVzc2FnZUNvdW50fTwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtvblJlbW92ZVVucmVhZH0gaWQ9e3UudXNlcm5hbWV9IHN0eWxlPXt7Y29sb3I6J3JlZCd9fSBkYXRhLXRlc3RpZD17YCR7dS51c2VybmFtZX0tcmVtb3ZlYH0+eDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBVbnJlYWQgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9VbnJlYWRIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuY29uc3QgdW5yZWFkcyA9IFtcclxuICB7XHJcbiAgICB1c2VybmFtZTogJ2RlbW8nLFxyXG4gICAgc3RhdGU6ICdNRVNTQU5HRVInLFxyXG4gICAgbWVzc2FnZTogeyB0ZXh0OiAnSGVsbG8geW91JywgdGltZXN0YW1wOiAxNTkxODEwNDU4NjMwIH0sXHJcbiAgfSxcclxuXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdiZXJvJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5yZWFkRGVtbygpIHtcclxuICByZXR1cm4gPFVucmVhZCB1bnJlYWRoYW5nb3V0cz17cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0czp1bnJlYWRzfSl9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge0Jsb2NrZXJNZXNzYWdlfSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL0Jsb2NrZXJNZXNzYWdlJ1xyXG5cclxuY29uc3QgbWVzc2FnZSA9e3RleHQ6J1lvdSBjYW4gbm90IHNlbmQgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZCcsXHJcbnRpbWVzdGFtcDoxMjMyMyxcclxudXNlcm5hbWU6J2RlbW8nXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlRGVtbygpe1xyXG4gICAgcmV0dXJuIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfS8+XHJcbn0iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IEFzeW5jQnV0dG9uICBmcm9tICdjb250cm9scy9hc3luYy1idXR0b24nXHJcblxyXG5leHBvcnQgZGVmYXVsdCAgZnVuY3Rpb24gQXN5bmNCdXR0b25EZW1vKCl7XHJcblxyXG4gICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgICAgPEFzeW5jQnV0dG9uIGxvYWRpbmcgIHRpdGxlPVwiU2VuZFwiLz5cclxuICAgICAgICA8QXN5bmNCdXR0b24gICB0aXRsZT1cIlNlbmRcIi8+XHJcbiAgICAgICAgPC9kaXY+XHJcbn0iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgQXBwUm91dGUgfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSc7XHJcblxyXG5pbXBvcnQgSGFuZ291dCBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXQnO1xyXG5pbXBvcnQgQmxvY2sgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9jayc7XHJcbmltcG9ydCBCbG9ja2VkIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQmxvY2tlZCc7XHJcbmltcG9ydCBDb25maWd1cmUgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9Db25maWd1cmUnO1xyXG5pbXBvcnQgSW52aXRlIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlJztcclxuaW1wb3J0IEludml0ZWUgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVlJztcclxuaW1wb3J0IEludml0ZXIgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVyJztcclxuaW1wb3J0IEhhbmdjaGF0IGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ2NoYXQnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9NZXNzYWdlJztcclxuaW1wb3J0IHsgT25saW5lU3RhdHVzIH0gZnJvbSAnaWNvbnMvb25saW5lU3RhdHVzJztcclxuaW1wb3J0IHtJY29uc0RlbW99IGZyb20gJy4vSWNvbnNEZW1vJ1xyXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcclxuaW1wb3J0IHtVbnJlYWREZW1vfSBmcm9tICcuL1VyZWFkRGVtbydcclxuaW1wb3J0IHtCbG9ja2VyTWVzc2FnZURlbW8gfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlRGVtbydcclxuaW1wb3J0IEFzeW5jQnV0dG9uRGVtbyBmcm9tICcuL2NvbXBvbmVudHMvQXN5bmNCdXR0b25EZW1vJ1xyXG5jb25zdCBoYW5nb3V0cyA9IFtcclxuICAgIHsgdXNlcm5hbWU6ICd1c2Vyb25lJyB9LFxyXG4gICAgeyB1c2VybmFtZTogJ3VzZXJ0d28nIH0sXHJcbiAgICB7IHVzZXJuYW1lOiAndXNlcnRocmVlJyB9LFxyXG4gIF07XHJcbiAgY29uc3QgaGFuZ291dCA9IHtcclxuICAgIHVzZXJuYW1lOiAndGVzdHVzZXInLFxyXG4gICAgZW1haWw6ICd0ZXN0QGdtYWlsLmNvbScsXHJcbiAgICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXHJcbiAgfTtcclxuICBjb25zdCBtZXNzYWdlID0ge1xyXG4gICAgdXNlcm5hbWU6ICdicmVubycsXHJcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzE3Njc4MzYsXHJcbiAgfTtcclxuICAvL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3Rvcnlib29rUm91dGVzKCl7XHJcbiAgICByZXR1cm4oXHJcbiAgPGRpdiBzdHlsZT17e2hlaWdodDonODB2aCd9fT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgICAgIDxIYW5nb3V0IGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja1wiPlxyXG4gICAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja2VkXCI+XHJcbiAgICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XHJcbiAgICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pbnZpdGVcIj5cclxuICAgICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZWVcIj5cclxuICAgICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pbnZpdGVyXCI+XHJcbiAgICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ2NoYXRcIj5cclxuICAgICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlXCI+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAsIGJhY2tncm91bmRDb2xvcjogJyNlZWVlZWVlJyB9fT5cclxuICAgICAgICAgICAgICA8TWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfSB1c2VybmFtZT17aGFuZ291dC51c2VybmFtZX0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvb25saW5lXCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPE9ubGluZVN0YXR1cyBvbmxpbmUgLz5cclxuICAgICAgICAgICAgICA8T25saW5lU3RhdHVzIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VzXCI+XHJcbiAgICAgICAgICAgIDxIYW5nY2hhdCBoYW5nb3V0PXtoYW5nb3V0fSBtZXNzYWdlcz17bWVzc2FnZXN9IHVzZXJuYW1lPVwiZGVtb1wiIC8+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvdW5yZWFkXCI+XHJcbiAgICAgICAgICAgIDxVbnJlYWREZW1vLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9ibG9ja2VyLW1lc3NhZ2VcIj5cclxuICAgICAgICAgICAgPEJsb2NrZXJNZXNzYWdlRGVtby8+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gIFxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaWNvbnNcIj5cclxuICAgICAgICAgICAgPEljb25zRGVtby8+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYXN5bmNidXR0b25cIj5cclxuICAgICAgICAgICAgPEFzeW5jQnV0dG9uRGVtby8+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgIFxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgIFxyXG4gICAgKVxyXG59IiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgQUNDT1JESU9OX1NFTEVDVEVEOidBQ0NPUkRJT05fU0VMRUNURUQnXHJcbn0iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9e1xyXG4gICAgc2VsZWN0ZWRJZDowXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSxhY3Rpb24pe1xyXG4gICAgc3dpdGNoKGFjdGlvbi50eXBlKXtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFDQ09SRElPTl9TRUxFQ1RFRDpcclxuICAgICAgICAgICAgY29uc3QgbmV4dFN0YXRlPSB7Li4uc3RhdGUsc2VsZWN0ZWRJZDphY3Rpb24uc2VsZWN0ZWRJZH1cclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5leHRTdGF0ZVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaCxjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZVJlZHVjZXIsdXNlTWVtbyx1c2VDb250ZXh0LHVzZVN0YXRlfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCByZWR1Y2VyLHtpbml0U3RhdGV9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmltcG9ydCBMaXN0LCB7TGlzdEl0ZW19IGZyb20gJ2NvbnRyb2xzL2xpc3QnXHJcblxyXG5jb25zdCBBY2NvcmRpb25Db250ZXh0ID1jcmVhdGVDb250ZXh0KClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFjY29yZGlvbnMocHJvcHMpe1xyXG5jb25zdCB7c2VsZWN0ZWRJZH09cHJvcHNcclxuY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9dXNlUmVkdWNlcihyZWR1Y2VyLHsuLi5pbml0U3RhdGUsc2VsZWN0ZWRJZH0pXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG5yZXR1cm4gPEFjY29yZGlvbkNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9Lz5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBY2NvcmRpb24oeyBjaGlsZHJlbiwgdGl0bGUsaWQgfSkge1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VDb250ZXh0KEFjY29yZGlvbkNvbnRleHQpXHJcbiAgY29uc3QgW3Zpc2libGUsc2V0VmlzaWJsZV09dXNlU3RhdGUoZmFsc2UpXHJcbmNvbnN0IHtzZWxlY3RlZElkfT1zdGF0ZVxyXG4gIGZ1bmN0aW9uIHNlbGVjdEFjY29yZGlvbiAoZSl7XHJcbiAgICAgIGNvbnN0IGlkID1lLnRhcmdldC5pZFxyXG4gICAgIFxyXG4gICAgICBpZihpZCAhPT1zZWxlY3RlZElkKXtcclxuICAgICAgICBzZXRWaXNpYmxlKHRydWUpXHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBzZXRWaXNpYmxlKHByZXY9PiAhcHJldilcclxuICAgICAgfVxyXG4gICAgIFxyXG4gICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BQ0NPUkRJT05fU0VMRUNURUQsc2VsZWN0ZWRJZDppZH0pXHJcbiAgfVxyXG5cclxuICAgIHJldHVybiAoPExpc3Qgc3R5bGU9e3tiYWNrZ3JvdW5kQ29sb3I6JyNlZWVlZWUnLHBhZGRpbmc6MyxmbGV4OjEsbWFyZ2luQm90dG9tOjN9fT5cclxuICAgXHJcbiAgICAgICA8TGlzdEl0ZW0gaWQ9e2lkfSBvbkNsaWNrPXtzZWxlY3RBY2NvcmRpb259IHN0eWxlPXt7Zm9udFdlaWdodDogOTAwfX0+e3RpdGxlfTwvTGlzdEl0ZW0+XHJcbiAgICBcclxuICAgICAgIHtzZWxlY3RlZElkID09PWlkICYmIHZpc2libGUgJiYgY2hpbGRyZW59XHJcbiAgICA8L0xpc3Q+KVxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBMaXN0LHtMaXN0SXRlbSB9IGZyb20gJ2NvbnRyb2xzL2xpc3QnO1xyXG5pbXBvcnQgQWNjb3JkaW9ucyx7QWNjb3JkaW9ufSBmcm9tICdjb250cm9scy9hY2NvcmRpb24nXHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5pbXBvcnQge3VzZU1lZGlhUXVlcnl9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0b3J5Ym9va0RyYXdlckNvbnRlbnQoe3RvZ2dsZURyYXdlciB9KSB7XHJcbiAgY29uc3Qge29uQXBwUm91dGV9PXVzZUFwcFJvdXRlKClcclxuXHJcbiAgY29uc3Qge2RldmljZX09dXNlTWVkaWFRdWVyeSgpXHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6Jy8nLHJvdXRlOmAvJHtpZH1gfSlcclxuICAgIGlmKCBkZXZpY2U9PT0ncGhvbmUnKXtcclxuICAgICAgdG9nZ2xlRHJhd2VyKClcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8QWNjb3JkaW9ucyAgc2VsZWN0ZWRJZD0nMCc+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOjN9fT5cclxuXHJcbiAgICBcclxuICAgICAgPEFjY29yZGlvbiBpZD1cIjBcIiB0aXRsZT1cIkhhbmdvdXRcIiA+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImhhbmdvdXRzXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgSGFuZ291dHNcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImJsb2NrXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgQmxvY2tcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImJsb2NrZWRcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBCbG9ja2VkXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJpbnZpdGVcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBJbnZpdGVcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImludml0ZWVcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBJbnZpdGVlXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJpbnZpdGVyXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgSW52aXRlclxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaGFuZ2NoYXRcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBIYW5nY2hhdFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcblxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImNvbmZpZ3VyZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIENvbmZpZ3VyZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwibWVzc2FnZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIE1lc3NhZ2VcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cIm1lc3NhZ2VzXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgTWVzc2FnZXNcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cIm9ubGluZVwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgb25saW5lU3RhdHVzXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJ1bnJlYWRcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgIFVyZWFkXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja2VyLW1lc3NhZ2VcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgIEJsb2NrZXJNZXNzYWdlXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8L0xpc3Q+XHJcbiAgICAgICAgPC9BY2NvcmRpb24+XHJcbiAgICAgICAgPEFjY29yZGlvbiB0aXRsZT1cIkljb25zXCIgaWQ9XCIxXCI+XHJcbiAgICAgICAgICA8TGlzdD5cclxuICAgICAgICAgIDxMaXN0SXRlbSBpZD1cImljb25zXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBJY29uc1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICA8L0xpc3Q+XHJcbiAgICAgICAgPC9BY2NvcmRpb24+XHJcbiAgICAgICAgPEFjY29yZGlvbiB0aXRsZT1cIkNvbXBvbmVudHNcIiBpZD1cIjJcIj5cclxuICAgICAgICA8TGlzdD5cclxuICAgICAgICAgIDxMaXN0SXRlbSBpZD1cImFzeW5jYnV0dG9uXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBBc3luY0J1dHRvblxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICA8L0xpc3Q+XHJcbiAgICAgICAgPC9BY2NvcmRpb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L0FjY29yZGlvbnM+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZVN0YXRlfWZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IERyYXdlciBmcm9tICdjb250cm9scy9uYXZpZ2F0aW9uL0RyYXdlcic7XHJcbmltcG9ydCB7IEFwcEJhciB9IGZyb20gJ2NvbnRyb2xzL25hdmlnYXRpb24vQXBwQmFyJztcclxuaW1wb3J0IHsgTWVudSB9IGZyb20gJ2NvbnRyb2xzL25hdmlnYXRpb24vTWVudSc7XHJcbmltcG9ydCB7IE5hdkl0ZW0gfSBmcm9tICdjb250cm9scy9uYXZpZ2F0aW9uL05hdkl0ZW0nO1xyXG5pbXBvcnQgU3Rvcnlib29rUm91dGVzIGZyb20gJy4vU3Rvcnlib29rUm91dGVzJ1xyXG5pbXBvcnQgU3Rvcnlib29rRHJhd2VyQ29udGVudCBmcm9tICcuL1N0b3J5Ym9va0RyYXdlckNvbnRlbnQnXHJcbmltcG9ydCB7dXNlTWVkaWFRdWVyeX0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvdXNlTWVkaWFRdWVyeSdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3Rvcnlib29rTmF2aWdhdGlvbigpIHtcclxuICAgIGNvbnN0IFtkcmF3ZXJJc09wZW4sc2V0RHJhd2VyU3RhdGVdPXVzZVN0YXRlKGZhbHNlKVxyXG5cclxuICAgIGNvbnN0IHtkZXZpY2V9PXVzZU1lZGlhUXVlcnkoKVxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRHJhd2VyKCl7XHJcblxyXG4gICAgICAgIHNldERyYXdlclN0YXRlKHByZXY9PiFwcmV2KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLHBvc2l0aW9uOidmaXhlZCcsd2lkdGg6JzEwMCUnfX0+XHJcbiAgICAgICAgICB7ZHJhd2VySXNPcGVuICYmICA8RHJhd2VyICBzdHlsZT17e3Bvc2l0aW9uOidhYnNvbHV0ZSd9fSB0b2dnbGVEcmF3ZXI9e3RvZ2dsZURyYXdlcn0+XHJcbiAgICAgICAgICAgICAgICA8U3Rvcnlib29rRHJhd2VyQ29udGVudCBkcmF3ZXJJc09wZW49e2RyYXdlcklzT3Blbn0gdG9nZ2xlRHJhd2VyPXt0b2dnbGVEcmF3ZXJ9IC8+ICBcclxuICAgICAgICAgICAgPC9EcmF3ZXI+IH1cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZsZXg6MX19ID5cclxuICAgICAgICAgICAgPEFwcEJhciA+XHJcbiAgICAgICAgICAgICAgICA8TWVudSBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9IC8+XHJcbiAgICAgICAgICAgICAgICA8TmF2SXRlbSBzdHlsZT17eyBmbGV4OiA1IH19PlN0b3J5Ym9vazwvTmF2SXRlbT5cclxuICAgICAgICAgICAgPC9BcHBCYXI+XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIDxTdG9yeWJvb2tSb3V0ZXMvPlxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApXHJcbn0iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBBcHBSb3V0ZVByb3ZpZGVyICBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSc7XHJcblxyXG5pbXBvcnQgIFRoZW1lUHJvdmlkZXIgZnJvbSAnY29tcG9uZW50cy90aGVtZS90aGVtZS1jb250ZXh0JztcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUHJvdmlkZXJzKHsgY2hpbGRyZW4gfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8VGhlbWVQcm92aWRlclxyXG4gICAgICBpbml0U3RhdGU9e3tcclxuICAgICAgICBwcmltYXJ5OiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXHJcbiAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgSGVsdmV0aWNhLCBcIkFyaWFsXCInLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxBcHBSb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgdGl0bGU9XCJXZWJjb21cIlxyXG4gICAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnIH19XHJcbiAgICAgID5cclxuICAgIFxyXG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9UaGVtZVByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCBTdG9yeWJvb2tOYXZpYXRpb24gZnJvbSAnLi9TdG9yeWJvb2tOYXZpZ2F0aW9uJ1xyXG5pbXBvcnQgU3Rvcnlib29rUm91dGVzIGZyb20gJy4vU3Rvcnlib29rUm91dGVzJ1xyXG5pbXBvcnQgU3Rvcnlib29rUHJvdmlkZXJzIGZyb20gJy4vU3Rvcnlib29rUHJvdmlkZXJzJ1xyXG5jb25zdCBoYW5nb3V0cyA9IFtcclxuICB7IHVzZXJuYW1lOiAndXNlcm9uZScgfSxcclxuICB7IHVzZXJuYW1lOiAndXNlcnR3bycgfSxcclxuICB7IHVzZXJuYW1lOiAndXNlcnRocmVlJyB9LFxyXG5dO1xyXG5jb25zdCBoYW5nb3V0ID0ge1xyXG4gIHVzZXJuYW1lOiAndGVzdHVzZXInLFxyXG4gIGVtYWlsOiAndGVzdEBnbWFpbC5jb20nLFxyXG4gIG1lc3NhZ2U6IHsgdGV4dDogYExldCdzIGNoYXQgb24gSGFuZ291dCFgLCB0aW1lc3RhbXA6IDE1OTA4MjA3ODI5MjEgfSxcclxufTtcclxuY29uc3QgbWVzc2FnZSA9IHtcclxuICB1c2VybmFtZTogJ2JyZW5vJyxcclxuICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXHJcbiAgdGltZXN0YW1wOiAxNTkxMzMxNzY3ODM2LFxyXG59O1xyXG4vL1xyXG5yZW5kZXIoXHJcbiAgPFN0b3J5Ym9va1Byb3ZpZGVycz5cclxuICA8U3Rvcnlib29rTmF2aWF0aW9uLz5cclxuXHJcbiAgPC9TdG9yeWJvb2tQcm92aWRlcnM+LFxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiZHJhd2VyIiwiYm94U2hhZG93IiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwiekluZGV4IiwiaGVpZ2h0IiwiYmFja2dyb3VuZENvbG9yIiwidXNlTWVkaWFRdWVyeSIsIndpZHRoIiwic2V0V2lkdGgiLCJ1c2VTdGF0ZSIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJkZXZpY2UiLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsInVzZUVmZmVjdCIsImNvbnNvbGUiLCJsb2ciLCJhZGRFdmVudExpc3RlbmVyIiwiRHJhd2VyIiwicHJvcHMiLCJwaW5uZWQiLCJzZXRQaW5uZWQiLCJvcGVuIiwib25DbGljayIsImNoaWxkcmVuIiwic3R5bGUiLCJUaGVtZUNvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlVGhlbWVDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIlRoZW1lUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJzdGF0ZSIsInNldFN0YXRlIiwiQXBwQmFyIiwidGhlbWUiLCJwcmltYXJ5IiwibWluSGVpZ2h0IiwiZGlzcGxheSIsIk1lbnVXaGl0ZSIsImlkIiwiTWVudSIsIk5hdkl0ZW0iLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwiRkVBVFVSRV9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsInVzZUFwcFJvdXRlIiwiZGlzcGF0Y2giLCJvbkFwcFJvdXRlIiwiQXBwUm91dGUiLCJwYXRoIiwicGF0aHMiLCJmaW5kIiwiQXBwUm91dGVQcm92aWRlciIsInVzZVJlZHVjZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJMaXN0IiwiTGlzdEl0ZW0iLCJUZXh0SW5wdXQiLCJCdXR0b24iLCJ0aXRsZSIsImlucHV0Q29udGFpbmVyIiwiYm9yZGVyIiwiaW5wdXQiLCJwYWRkaW5nIiwiZmxleCIsIkhhbmdvdXQiLCJoYW5nb3V0cyIsIm9uU2VhcmNoSW5wdXQiLCJvbkZldGNoSGFuZ291dHMiLCJvblNlbGVjdEhhbmdvdXQiLCJzZWFyY2giLCJoYW5kbGVIYW5nb3V0U2VsZWN0aW9uIiwidGFyZ2V0IiwiaGFuZ291dCIsInVzZXJuYW1lIiwibGVuZ3RoIiwibWFwIiwic3R5bGVzIiwicm9vdCIsIkxheW91dCIsImNpcmNsZSIsImJvcmRlclJhZGl1cyIsIm1hcmdpblJpZ2h0IiwiY2lyY2xlQ29udGFpbmVyIiwiUHJvZ3Jlc3NCYXIiLCJzZWxlY3RlZCIsInNldFNlbGVjdGVkIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInByZXYiLCJjbGVhckludGVydmFsIiwiQXN5bmNCdXR0b24iLCJsb2FkaW5nIiwiY2hlY2tib3giLCJjaGVja2JveFJvb3QiLCJhbGlnbkl0ZW1zIiwibGF5b3V0IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiYm94U2l6aW5nIiwicGFkZGluZ1RvcCIsImJ0biIsIkJsb2NrIiwib25DYW5jZWwiLCJvbkJsb2NrIiwib25SZXBvcnQiLCJmaWxsIiwiY29sb3IiLCJDZW50ZXIiLCJ0ZXh0QWxpZ24iLCJCbG9ja2VkIiwib25VbmJsb2NrIiwib25DbG9zZSIsIkRlbGV0ZSIsIkFyY2hpdmUiLCJpY29uQnRuIiwibWFyZ2luIiwiYnRuQ29udGFpbmVyIiwiYnRuT2siLCJDb25maWd1cmUiLCJvbkRlbGV0ZSIsIm9uQXJjaGl2ZSIsIm9uTm90aWZpY2F0aW9uIiwib25Db252ZXJzYXRpb25IaXN0b3J5Iiwib25OYXZpZ2F0aW9uIiwib25PayIsIkljb25CdXR0b24iLCJJY29uIiwiQ2hlY2tib3giLCJsYWJlbCIsIm9uQ2hhbmdlIiwibWFyZ2luVG9wIiwiUGVyc29uQWRkSWNvbiIsIkludml0ZSIsIm9uSW52aXRlIiwib25NZXNzYWdlVGV4dCIsIm1lc3NhZ2VUZXh0IiwiUGVyc29uQWRkIiwiZW1haWwiLCJEb25lIiwiSW52aXRlZSIsImJvcmRlckNvbG9yIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJXaWR0aCIsImZvbnRTaXplIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJmbG9hdCIsInRpbWVzdGFtcCIsImRheXMiLCJzZXREYXlzIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJtYXJnaW5Cb3R0b20iLCJ0ZXh0IiwicGFkZGluZ0JvdHRvbSIsIkludml0ZXIiLCJvbkFjY2VwdCIsIm9uRGVjbGluZSIsIm1hcmdpbkxlZnQiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsIk1lc3NhZ2VFZGl0b3IiLCJvbk1lc3NhZ2UiLCJCbG9ja2VyTWVzc2FnZSIsIkJsb2NrZWRNZXNzYWdlIiwiaGFuZGxlTmF2aWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwibWVzc2FnZUNvbnRhaW5lciIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsIk1lc3NhZ2VzIiwibWVzc2FnZXMiLCJzY3JvbGxlclJlZiIsInVzZVJlZiIsImN1cnJlbnQiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJvblNlbmQiLCJmbG9hdE1lc3NhZ2VzIiwic29ydE1lc3NhZ2VzIiwibXNnIiwic29ydCIsIkhhbmdjaGF0IiwiZG9jdW1lbnQiLCJPbmxpbmVTdGF0dXMiLCJyZWFkeVN0YXRlIiwiSXNPbmxpbmUiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsImNvdW50IiwiSWNvbnNEZW1vIiwicmVkdWNlclVucmVhZGhhbmdvdXRzIiwidW5yZWFkaGFuZ291dHMiLCJyZWR1Y2UiLCJhY2N1bXVsYXRvciIsImluZGV4IiwibWVzc2FnZUNvdW50Iiwib2JqIiwiZmluZEluZGV4Iiwic3BsaWNlIiwicHVzaCIsIlVucmVhZEhhbmdvdXRzIiwib25TZWxlY3RVbnJlYWQiLCJvblJlbW92ZVVucmVhZCIsIml0ZW1zIiwic2V0SXRlbXMiLCJyZWR1Y2VkIiwidW5yZWFkcyIsIlVucmVhZERlbW8iLCJVbnJlYWQiLCJCbG9ja2VyTWVzc2FnZURlbW8iLCJBc3luY0J1dHRvbkRlbW8iLCJTdG9yeWJvb2tSb3V0ZXMiLCJBQ0NPUkRJT05fU0VMRUNURUQiLCJzZWxlY3RlZElkIiwibmV4dFN0YXRlIiwiQWNjb3JkaW9uQ29udGV4dCIsIkFjY29yZGlvbnMiLCJBY2NvcmRpb24iLCJ2aXNpYmxlIiwic2V0VmlzaWJsZSIsInNlbGVjdEFjY29yZGlvbiIsImZvbnRXZWlnaHQiLCJTdG9yeWJvb2tEcmF3ZXJDb250ZW50IiwidG9nZ2xlRHJhd2VyIiwiaGFuZGxlUm91dGUiLCJTdG9yeWJvb2tOYXZpZ2F0aW9uIiwiZHJhd2VySXNPcGVuIiwic2V0RHJhd2VyU3RhdGUiLCJBcHBQcm92aWRlcnMiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsInJlbmRlciIsIlN0b3J5Ym9va1Byb3ZpZGVycyIsIlN0b3J5Ym9va05hdmlhdGlvbiIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFHLElBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsOERBQThELFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQ0E1L1IsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXlFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUF1RyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENB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
