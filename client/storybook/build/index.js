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

const NavContext = M();
function NavProvider(props) {
  const [drawerOpen, setDrawerOpen] = v$1(false);
  const value = s$1(() => [drawerOpen, setDrawerOpen], [drawerOpen]);
  return h(NavContext.Provider, _extends({
    value: value
  }, props));
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
    debugger;
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

var css_248z$2 = ".message-font-phone-size {\r\n  font-size: 10px;\r\n}\r\n\r\n.message-font-tablet-size {\r\n  font-size: 15px;\r\n}\r\n\r\n.font-laptop-size {\r\n  font-size: 20px;\r\n}\r\n\r\n.message-font-desktop-size {\r\n  font-size: 30px;\r\n}";
styleInject(css_248z$2);

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
  messageText,
  onMessageText,
  onMessage,
  hangout
}) {
  return h("div", {
    style: styles$2.root
  }, h("div", {
    style: {
      flex: 1
    }
  }, h("input", {
    style: styles$2.input,
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
  onNavigation
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
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 75
    }
  }, h("div", {
    style: { ...styles$3.messageContainer,
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
  }, h(IconsDemo, null)));
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
    id: "0"
  }, h(List, null, h(ListItem, {
    id: "icons",
    onClick: handleRoute
  }, "Icons")))));
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
  }, h(NavProvider, null, children)));
}

H(h(AppProviders, null, h(StorybookNavigation, null)), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL25hdi9zdHlsZS5qcyIsIi4uLy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5LmpzIiwiLi4vLi4vbmF2L05hdlByb3ZpZGVyLmpzIiwiLi4vLi4vbmF2L0RyYXdlci5qcyIsIi4uLy4uL3RoZW1lL3RoZW1lLWNvbnRleHQuanMiLCIuLi8uLi9uYXYvQXBwQmFyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uL25hdi9pY29ucy9NZW51V2hpdGUuanMiLCIuLi8uLi9uYXYvTWVudS5qcyIsIi4uLy4uL25hdi9OYXZJdGVtLmpzIiwiLi4vLi4vYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vYXBwLXJvdXRlL3JlZHVjZXIuanMiLCIuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlci5qcyIsIi4uLy4uL2NvbXBvbmVudHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvVGV4dElucHV0LmpzIiwiLi4vLi4vY29tcG9uZW50cy9CdXR0b24uanMiLCIuLi8uLi9oYW5nb3V0cy9IYW5nb3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvTGF5b3V0LmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2suanMiLCIuLi8uLi9pY29ucy9CbG9jay5qcyIsIi4uLy4uL2xheW91dC9DZW50ZXIuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9ja2VkLmpzIiwiLi4vLi4vaWNvbnMvRGVsZXRlLmpzIiwiLi4vLi4vaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0NvbmZpZ3VyZS5qcyIsIi4uLy4uL2ljb25zL1BlcnNvbkFkZC5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZS5qcyIsIi4uLy4uL2ljb25zL0RvbmUuanMiLCIuLi8uLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVlLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlLmpzIiwiLi4vLi4vaGFuZ291dHMvc3RhdGUtdWkvSW52aXRlci5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZUVkaXRvci5qcyIsIi4uLy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvQmxvY2tlck1lc3NhZ2UuanMiLCIuLi8uLi9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZWRNZXNzYWdlLmpzIiwiLi4vLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlcy5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlLXVpL0hhbmdjaGF0LmpzIiwiLi4vLi4vaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vaWNvbnMvTWVzc2FnZS5qcyIsIi4uL0ljb25zRGVtby5qcyIsIi4uL2Zha2VNZXNzYWdlcy5qcyIsIi4uLy4uL2hhbmdvdXRzL3N0YXRlL3JlZHVjZVVucmVhZGhhbmdvdXRzLmpzIiwiLi4vLi4vaGFuZ291dHMvVW5yZWFkSGFuZ291dHMuanMiLCIuLi9VcmVhZERlbW8uanMiLCIuLi9CbG9ja2VyTWVzc2FnZURlbW8uanMiLCIuLi9TdG9yeWJvb2tSb3V0ZXMuanMiLCIuLi8uLi9jb21wb25lbnRzL2FjY29yZGlvbi9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYWNjb3JkaW9uL3JlZHVjZXIuanMiLCIuLi8uLi9jb21wb25lbnRzL2FjY29yZGlvbi9pbmRleC5qcyIsIi4uL1N0b3J5Ym9va0RyYXdlckNvbnRlbnQuanMiLCIuLi9TdG9yeWJvb2tOYXZpZ2F0aW9uLmpzIiwiLi4vU3Rvcnlib29rUHJvdmlkZXJzLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgZHJhd2VyID0ge1xyXG4gIGJveFNoYWRvdzogYDBweCAzcHggM3B4IC0ycHggcmdiYSgwLCAwLCAwLCAwLjIpLDBweCAzcHggNHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTQpLCAwcHggMXB4IDhweCAwcHggcmdiYSgwLCAwLCAwLCAwLjEyKWAsXHJcblxyXG4gIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gIGxlZnQ6IDAsXHJcbiAgdG9wOiAwLFxyXG4gIHpJbmRleDogMTAsXHJcbiAgaGVpZ2h0OiAnMTAwdmgnLFxyXG4gIGJhY2tncm91bmRDb2xvcjogJyNmNWY1ZjUnLFxyXG59O1xyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgTmF2Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZU5hdkNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoTmF2Q29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VOYXZDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIE5hdlByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU5hdmlnYXRpb24oKSB7XHJcbiAgY29uc3QgW2RyYXdlck9wZW4sIHNldERyYXdlck9wZW5dID0gdXNlTmF2Q29udGV4dCgpO1xyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRHJhd2VyKCl7XHJcbiAgICAgICAgc2V0RHJhd2VyT3BlbihwcmV2PT4hcHJldilcclxuICAgIH1cclxuICByZXR1cm4geyBkcmF3ZXJPcGVuLCB0b2dnbGVEcmF3ZXIgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdlByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgW2RyYXdlck9wZW4sIHNldERyYXdlck9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW2RyYXdlck9wZW4sIHNldERyYXdlck9wZW5dLCBbZHJhd2VyT3Blbl0pO1xyXG4gIHJldHVybiA8TmF2Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBkcmF3ZXIgfSBmcm9tICcuL3N0eWxlJztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGlvbiB9IGZyb20gJy4vTmF2UHJvdmlkZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmF3ZXIocHJvcHMpIHtcclxuICBjb25zdCBbcGlubmVkLHNldFBpbm5lZF09dXNlU3RhdGUoZmFsc2UpXHJcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgY29uc3QgeyBvcGVuLCBvbkNsaWNrLCBjaGlsZHJlbixzdHlsZSB9ID0gcHJvcHM7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2XHJcbiAgICAgICBzdHlsZT17ey4uLmRyYXdlcixwb3NpdGlvbjogZGV2aWNlPT09XCJwaG9uZVwiID8gJ2ZpeGVkJzoncmVsYXRpdmUnfX1cclxuICAgICAgICBjbGFzc05hbWU9e2BkcmF3ZXItJHtkZXZpY2V9LXdpZHRoYH1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwQmFyKHsgY2hpbGRyZW4sc3R5bGUgfSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAuLi50aGVtZS5wcmltYXJ5LFxyXG4gICAgICAgLy8gIHBvc2l0aW9uOiAnZml4ZWQnLFxyXG4gICAgICAgIC8vIGxlZnQ6IDAsXHJcbiAgICAgICAvLyAgdG9wOiAwLFxyXG4gICAgICAgIG1pbkhlaWdodDogNjQsXHJcbiAgICAgICAvLyBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAvLyBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgZGlzcGxheTonZmxleCcsLi4uc3R5bGVcclxuICAgICAgfX1cclxuICAgID5cclxuICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0ICcuLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGZ1bmN0aW9uIE1lbnVXaGl0ZSh7IG9uQ2xpY2ssIGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2Z1xyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGNsYXNzTmFtZT1cIm1lbnUtd2hpdGVcIlxyXG4gICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcclxuICAgICAgZmlsbD1cIndoaXRlXCJcclxuICAgICAgd2lkdGg9XCIyNHB4XCJcclxuICAgICAgaGVpZ2h0PVwiMjRweFwiXHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD1cIm5vbmVcIiAvPlxyXG4gICAgICA8cGF0aCBkPVwiTTMgMThoMTh2LTJIM3Yyem0wLTVoMTh2LTJIM3Yyem0wLTd2MmgxOFY2SDN6XCIgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRpb24gfSBmcm9tICcuL05hdlByb3ZpZGVyJztcclxuaW1wb3J0IHsgTWVudVdoaXRlIH0gZnJvbSAnLi9pY29ucy9NZW51V2hpdGUnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudSh7b25DbGlja30pIHtcclxuXHJcblxyXG4gIHJldHVybiA8TWVudVdoaXRlIG9uQ2xpY2s9e29uQ2xpY2t9IGlkPVwibWVudVwiIC8+O1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcydcclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0gKHByb3BzKXtcclxuY29uc3Qge2NoaWxkcmVufT1wcm9wc1xyXG5yZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiey4uLnByb3BzfT57Y2hpbGRyZW59PC9kaXY+XHJcbn0iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcclxuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXHJcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuXHJcblxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0XCIgey4uLnByb3BzfS8+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0SXRlbShwcm9wcykge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWl0ZW1cIiB7Li4ucHJvcHN9IC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHtMaXN0SXRlbX0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICBwYWRkaW5nOiA4LFxyXG4gIG1hcmdpbkxlZnQ6IDE2LFxyXG4gIG1hcmdpblJpZ2h0OiAxNixcclxuICBtYXJnaW5Ub3A6IDgsXHJcbiAgbWFyZ2luQm90dG9tOiA4LFxyXG4gIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gIGZsZXg6IDEsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBpZCwgdHlwZSA9ICd0ZXh0JyxzdHlsZSB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCB3aWR0aDogJzEwMCUnIH19PlxyXG4gICAgICA8aW5wdXQgIHN0eWxlPXt7Li4uc3R5bGVzLC4uLnN0eWxlfX0gey4uLnByb3BzfSBkYXRhLXRlc3RpZD17aWR9IHR5cGU9e3R5cGV9IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xyXG4gIGNvbnN0IHsgdGl0bGUsc3R5bGUsaWQgfSA9IHByb3BzO1xyXG4gIHJldHVybiAoXHJcbiAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIHsuLi5wcm9wc30+XHJcbiAgICAgIHt0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgTGlzdCx7IExpc3RJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9saXN0JztcclxuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9UZXh0SW5wdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9jb21wb25lbnRzL0J1dHRvbic7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCB7IHNhdmVNZXNzYWdlIH0gZnJvbSAnLi9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnXHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpbnB1dENvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYm9yZGVyOiAnIzczNzM3MyBzb2xpZCAxcHgnLFxyXG4gIH0sXHJcbiAgaW5wdXQ6IHtcclxuICAgIHBhZGRpbmc6IDEwLFxyXG4gICAgZmxleDogMSxcclxuICAgIGJvcmRlcjogJ3doaXRlJyxcclxuXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXQoe1xyXG4gIGhhbmdvdXRzLFxyXG4gIG9uU2VhcmNoSW5wdXQsXHJcbiAgb25GZXRjaEhhbmdvdXRzLFxyXG4gIG9uU2VsZWN0SGFuZ291dCxcclxuICBzZWFyY2hcclxufSkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRTZWxlY3Rpb24oZSkge1xyXG4gICAgY29uc3QgaWQgPSBlLnRhcmdldC5pZFxyXG4gICAgb25TZWxlY3RIYW5nb3V0KGUpXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZChnID0+IGcudXNlcm5hbWUgPT09IGlkKVxyXG5kZWJ1Z2dlcjtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KVxyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiAoXHJcblxyXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nVG9wOiA2OCB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuaW5wdXRDb250YWluZXJ9PlxyXG4gICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgIHZhbHVlPXtzZWFyY2h9XHJcbiAgICAgICAgICBpZD1cInNlYXJjaC1pbnB1dFwiXHJcbiAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvblNlYXJjaElucHV0fVxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLmlucHV0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2gtYnRuXCJcclxuICAgICAgICAgIGRpc2FibGVkPXshc2VhcmNofVxyXG4gICAgICAgICAgdGl0bGU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgb25DbGljaz17b25GZXRjaEhhbmdvdXRzfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPExpc3QgaWQ9XCJoYW5nb3V0cy1saXN0XCI+XHJcbiAgICAgICAge2hhbmdvdXRzICYmXHJcbiAgICAgICAgICBoYW5nb3V0cy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gaWQ9e2cudXNlcm5hbWV9IGRhdGEtdGVzdGlkPXtnLnVzZXJuYW1lfSBvbkNsaWNrPXtoYW5kbGVIYW5nb3V0U2VsZWN0aW9ufT5cclxuICAgICAgICAgICAgICAgIHtnLnVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KX1cclxuICAgICAgPC9MaXN0PlxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlcyA9IHtcclxuICByb290OiB7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZWVlZWVlJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBMYXlvdXQoeyBjaGlsZHJlbiwgc3R5bGUsIGlkIH0pIHtcclxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17aWR9IHN0eWxlPXt7IC4uLnN0eWxlcy5yb290LCAuLi5zdHlsZSB9fT57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgY2hlY2tib3g6IHsgbWFyZ2luUmlnaHQ6IDggfSxcclxuICBjaGVja2JveFJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgcGFkZGluZzogMTYsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nVG9wOjY4XHJcbiAgfSxcclxuICBidG46IHtcclxuICAgIGZsZXg6IDEsXHJcbiAgICBtYXJnaW5SaWdodDogNCxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2soeyBvbkNhbmNlbCwgb25CbG9jaywgb25SZXBvcnQgfSkge1xyXG5cclxuIFxyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jaGVja2JveFJvb3R9PlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBzdHlsZT17c3R5bGUuY2hlY2tib3h9IG9uQ2hhbmdlPXtvblJlcG9ydH0gLz5cclxuICAgICAgICA8bGFiZWw+UmVwb3J0PC9sYWJlbD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDYW5jZWxcIiBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNhbmNlbH0gLz5cclxuICAgICAgICA8QnV0dG9uIHRpdGxlPVwiQmxvY2tcIiBzdHlsZT17c3R5bGUuYnRufSBpZD1cIkJMT0NLXCIgb25DbGljaz17b25CbG9ja30gZGF0YS10ZXN0aWQ9XCJibG9jay1idG5cIiAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9jayh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBmaWxsID0gJ25vbmUnLFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBvbkNsaWNrLFxyXG4gIGlkLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgaGVpZ2h0PXtoZWlnaHR9XHJcbiAgICAgIHZpZXdCb3g9JzAgMCAyNCAyNCdcclxuICAgICAgd2lkdGg9e3dpZHRofVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0gLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBpZD17aWR9XHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6TTQgMTJjMC00LjQyIDMuNTgtOCA4LTggMS44NSAwIDMuNTUuNjMgNC45IDEuNjlMNS42OSAxNi45QzQuNjMgMTUuNTUgNCAxMy44NSA0IDEyem04IDhjLTEuODUgMC0zLjU1LS42My00LjktMS42OUwxOC4zMSA3LjFDMTkuMzcgOC40NSAyMCAxMC4xNSAyMCAxMmMwIDQuNDItMy41OCA4LTggOHonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gQ2VudGVyKHsgY2hpbGRyZW4sIHN0eWxlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcclxuICAgICAgICAuLi5zdHlsZSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi4vLi4vaWNvbnMvQmxvY2snO1xyXG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tICcuLi8uLi9sYXlvdXQvQ2VudGVyJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL0xheW91dCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBwYWRkaW5nVG9wOjY4XHJcbiAgfSxcclxuICBidG46IHtcclxuICAgIGZsZXg6IDEsXHJcbiAgICBtYXJnaW5SaWdodDogNCxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2tlZCh7IGhhbmdvdXQsIG9uVW5ibG9jaywgb25DbG9zZSB9KSB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImJsb2NrZWQtdWlcIj5cclxuICAgICAgPENlbnRlciBzdHlsZT17eyBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XHJcbiAgICAgICAgPEJsb2NrIHdpZHRoPVwiNjBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwicmVkXCIgLz5cclxuICAgICAgICA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LnVzZXJuYW1lfTwvYj4gaXMgYmxvY2tlZFxyXG4gICAgICA8L0NlbnRlcj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBwYWRkaW5nOiA4IH19PlxyXG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDbG9zZVwiIHN0eWxlPXtzdHlsZS5idG59IG9uQ2xpY2s9e29uQ2xvc2V9IC8+XHJcbiAgICAgICAgPEJ1dHRvbiBpZD0nVU5CTE9DSycgdGl0bGU9XCJVbmJsb2NrXCIgc3R5bGU9e3N0eWxlLmJ0bn0gb25DbGljaz17b25VbmJsb2NrfSBkYXRhLXRlc3RpZD0ndW5ibG9jay1idG4nLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgZnVuY3Rpb24gRGVsZXRlKHtcclxuICBoZWlnaHQgPSAyNCxcclxuICB3aWR0aCA9IDI0LFxyXG4gIGNvbG9yID0gJ2JsYWNrJyxcclxuICBmaWxsID0gJ25vbmUnLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eidcclxuICAgICAgLz5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD17ZmlsbH0gLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXJjaGl2ZSh7XHJcbiAgaGVpZ2h0ID0gMjQsXHJcbiAgd2lkdGggPSAyNCxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgZmlsbCA9ICdub25lJyxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17MjR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofT5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBmaWxsPXtjb2xvcn1cclxuICAgICAgICBkPSdNMjAuNTQgNS4yM2wtMS4zOS0xLjY4QzE4Ljg4IDMuMjEgMTguNDcgMyAxOCAzSDZjLS40NyAwLS44OC4yMS0xLjE2LjU1TDMuNDYgNS4yM0MzLjE3IDUuNTcgMyA2LjAyIDMgNi41VjE5YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNi41YzAtLjQ4LS4xNy0uOTMtLjQ2LTEuMjd6TTEyIDE3LjVMNi41IDEySDEwdi0yaDR2MmgzLjVMMTIgMTcuNXpNNS4xMiA1bC44MS0xaDEybC45NCAxSDUuMTJ6J1xyXG4gICAgICAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vc3RhdGUtdWkvTGF5b3V0JztcclxuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSAnLi4vLi4vaWNvbnMvRGVsZXRlJztcclxuaW1wb3J0IHsgQXJjaGl2ZSB9IGZyb20gJy4uLy4uL2ljb25zL0FyY2hpdmUnO1xyXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2ljb25zL0Jsb2NrJztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBpY29uQnRuOiB7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbjogOCB9LFxyXG4gIGJ0bjogeyBtYXJnaW5SaWdodDogOCB9LFxyXG4gIGJ0bkNvbnRhaW5lcjoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgfSxcclxuICBsYXlvdXQ6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gIH0sXHJcbiAgYnRuT2s6IHtcclxuICAgIG1hcmdpbjogOCxcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xyXG4gIG9uQmxvY2ssXHJcbiAgb25EZWxldGUsXHJcbiAgb25BcmNoaXZlLFxyXG4gIG9uTm90aWZpY2F0aW9uLFxyXG4gIG9uQ29udmVyc2F0aW9uSGlzdG9yeSxcclxuICBvbk5hdmlnYXRpb24sXHJcbiAgb25PayxcclxufSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XHJcbiAgICAgICAgPENoZWNrYm94XHJcbiAgICAgICAgICBsYWJlbD1cIkNvbnZlcnNhdGlvbiBIaXN0b3J5XCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxociAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5idG5Db250YWluZXJ9PlxyXG4gICAgICAgIDxJY29uQnV0dG9uIHRpdGxlPVwiQXJjaGl2ZVwiIEljb249e0FyY2hpdmV9IG9uQ2xpY2s9e29uQXJjaGl2ZX0gLz5cclxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XHJcbiAgICAgICAgPEljb25CdXR0b24gaWQ9XCJiY2t1aVwiIHRpdGxlPVwiQmxvY2tcIiBJY29uPXtCbG9ja30gb25DbGljaz17b25OYXZpZ2F0aW9ufSAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmJ0bk9rfT5cclxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uT2t9Pk9LPC9CdXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gSWNvbkJ1dHRvbih7IEljb24sIHRpdGxlLCBvbkNsaWNrLGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17c3R5bGUuaWNvbkJ0bn0+XHJcbiAgICAgIDxidXR0b24gaWQ9e2lkfSBzdHlsZT17c3R5bGUuYnRufSBvbkNsaWNrPXtvbkNsaWNrfSBkYXRhLXRlc3RpZD17YCR7aWR9LWJ0bmB9PlxyXG4gICAgICAgIDxJY29uIGlkPXtpZH0vPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGRpdj57dGl0bGV9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDaGVja2JveCh7IGxhYmVsLCBvbkNoYW5nZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiA4LCBtYXJnaW5Ub3A6IDggfX0+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XHJcbiAgICAgIDxsYWJlbD57bGFiZWx9PC9sYWJlbD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvbkFkZEljb24oe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgY29sb3IgPSAnYmxhY2snLFxyXG4gIGZpbGwgPSAnd2hpdGUnLFxyXG4gIHN0eWxlLFxyXG59KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPXtmaWxsfSAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGZpbGw9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xNSAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bS05LTJWN0g0djNIMXYyaDN2M2gydi0zaDN2LTJINnptOSA0Yy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCBQZXJzb25BZGQgZnJvbSAnLi4vLi4vaWNvbnMvUGVyc29uQWRkJztcclxuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9UZXh0SW5wdXQnO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL0J1dHRvbic7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xyXG5pbXBvcnQge3Jlc2V0SGFuZ291dH0gZnJvbSAnLi4vc3RhdGUvYWN0aW9ucydcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICB9LFxyXG59O1xyXG4vL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGUoeyBoYW5nb3V0LCBvbkludml0ZSwgb25NZXNzYWdlVGV4dCxtZXNzYWdlVGV4dCwgdmFsdWUgfSkge1xyXG5cclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fWlkPVwiaW52aXRlLXVpXCI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPFBlcnNvbkFkZCBjb2xvcj1cImdyZWVuXCIgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgU3RhcnQgQ29udmVyc2F0aW9uIHdpdGggPGI+e2hhbmdvdXQgJiYgaGFuZ291dC5lbWFpbH08L2I+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgICA8VGV4dElucHV0IGlkPVwibWVzc2FnZVRleHRJbnB1dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSB2YWx1ZT17bWVzc2FnZVRleHR9IC8+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIlNlbmQgSW52aXRlXCIgaWQ9XCJJTlZJVEVcIiBvbkNsaWNrPXtvbkludml0ZX0gZGF0YS10ZXN0aWQ9J29uaW52aXRlLWJ0bicgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICA8L0xheW91dD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERvbmUoe1xyXG4gIGhlaWdodCA9IDI0LFxyXG4gIHdpZHRoID0gMjQsXHJcbiAgZmlsbCA9ICdub25lJyxcclxuICBjb2xvciA9ICdibGFjaycsXHJcbiAgc3R5bGUsXHJcbn0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9e2ZpbGx9IC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZmlsbD17Y29sb3J9XHJcbiAgICAgICAgZD0nTTkgMTYuMkw0LjggMTJsLTEuNCAxLjRMOSAxOSAyMSA3bC0xLjQtMS40TDkgMTYuMnonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZUVmZmVjdH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyBEb25lIH0gZnJvbSAnLi4vLi4vaWNvbnMvRG9uZSc7XHJcbmltcG9ydCB7IENlbnRlciB9IGZyb20gJy4uLy4uL2xheW91dC9DZW50ZXInO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9zdGF0ZS11aS9MYXlvdXQnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgbGF5b3V0OiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVlKHsgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImludml0ZWUtdWlcIj5cclxuICAgICAgPENlbnRlcj5cclxuICAgICAgICA8RG9uZSB3aWR0aD1cIjcwXCIgaGVpZ2h0PVwiNzBcIiBjb2xvcj1cImdyZWVuXCIgLz5cclxuICAgICAgPC9DZW50ZXI+XHJcbiAgICAgIDxDZW50ZXI+XHJcbiAgICAgICAgPHA+XHJcbiAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIGNoYXQgd2l0aCA8Yj57aGFuZ291dCAmJiBoYW5nb3V0LmVtYWlsfTwvYj4gb25jZVxyXG4gICAgICAgICAgeW91ciBpbnZpdGlvbiBoYXMgYmVlbiBhY2NlcHRlZC5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvQ2VudGVyPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgYm9yZGVyQ29sb3I6ICcjZWVlZWVlJyxcclxuICAgIGJvcmRlclN0eWxlOiAnc29saWQnLFxyXG4gICAgYm9yZGVyV2lkdGg6IDEsXHJcbiAgICBib3JkZXJSYWRpdXM6IDUsXHJcbiAgICBwYWRkaW5nOiAzLFxyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG4gICAgbWluSGVpZ2h0OiAzNSxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICB9LFxyXG4gIHVzZXJuYW1lOiB7IG1hcmdpblJpZ2h0OiA4IH0sXHJcbiAgbG9nOiB7XHJcbiAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICBjb2xvcjogJyM3MzczNzMnLFxyXG4gICAgZm9udFNpemU6IDEwLFxyXG4gIH0sXHJcbiAgbWVzc2FnZToge30sXHJcbn07XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGZsb2F0LCB1c2VybmFtZSx0aW1lc3RhbXAgfSA9IG1lc3NhZ2U7XHJcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCB7IGRldmljZSB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIGZ1bmN0aW9uIGNvbnZlcnRNUyhtcykge1xyXG4gICAgdmFyIGQsIGgsIG0sIHM7XHJcbiAgICBzID0gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xyXG4gICAgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcclxuICAgIHMgPSBzICUgNjA7XHJcbiAgICBoID0gTWF0aC5mbG9vcihtIC8gNjApO1xyXG4gICAgbSA9IG0gJSA2MDtcclxuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XHJcbiAgICBoID0gaCAlIDI0O1xyXG4gICAgc2V0RGF5cyhkKTtcclxuICAgIHNldEhvdXJzKGgpO1xyXG4gICAgc2V0TWludXRlcyhtKTtcclxuICAgIHNldFNlY29uZHMocyk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYodGltZXN0YW1wKXtcclxuICBcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29udmVydE1TKERhdGUubm93KCkgLSB0aW1lc3RhbXApO1xyXG4gICAgICB9LCAwKTtcclxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcclxuICAgICAgfSwgNjAwMDApO1xyXG4gXHJcblxyXG4gICAgfVxyXG4gICBcclxuICB9LCBbdGltZXN0YW1wXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIG1hcmdpbkJvdHRvbTogMyB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cIm1lc3NhZ2VcIlxyXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2BtZXNzYWdlLWZvbnQtJHtkZXZpY2V9LXNpemVgfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH1cclxuICAgICAgICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5sb2d9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XHJcbiAgPGRpdj5cclxuICAgICAgICAgICAge21pbnV0ZXMgPT09IDAgJiYgPGRpdj5Ob3c8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA9PT0gMCAmJiBtaW51dGVzID4gMCAmJiA8ZGl2PnttaW51dGVzfSBtaW51dGVzIGFnbyA8L2Rpdj59XHJcbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtob3Vyc30gaG91cnMge21pbnV0ZXN9IG1pbnV0ZXMgYWdveycgJ31cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAge2RheXMgPD0gMTAgJiYgZGF5cyA+IDEgJiYgPGRpdj57ZGF5c30gZGF5cyBhZ288L2Rpdj59XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvQnV0dG9uJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL21lc3NhZ2UtdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL3N0YXRlLXVpL0xheW91dCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHtcclxuICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgcGFkZGluZ1RvcDogNzAsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcbiAgICBwYWRkaW5nQm90dG9tOjgsXHJcbiBcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlcih7IGhhbmdvdXQsIG9uQWNjZXB0LCBvbkRlY2xpbmUgfSkge1xyXG4gXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQgaWQ9XCJpbnZpdGVyLXVpXCI+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luTGVmdDogOCwgZGlzcGxheTonZmxleCcgfX0+XHJcbiAgICAgICAgICB7aGFuZ291dCAmJiBoYW5nb3V0Lm1lc3NhZ2UgJiYgKFxyXG4gICAgICAgICAgICA8TWVzc2FnZVxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U9e1xyXG4gICAgICAgICAgICAgICAgaGFuZ291dCAmJlxyXG4gICAgICAgICAgICAgICAgaGFuZ291dC5tZXNzYWdlICYmIHtcclxuICAgICAgICAgICAgICAgICAgLi4uaGFuZ291dC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxmbG9hdDonbGVmdCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyxwYWRkaW5nTGVmdDo4LHBhZGRpbmdSaWdodDo4IH19PlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkRFQ0xJTkVcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkRlY2xpbmV9XHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVjbGluZS1idG5cIlxyXG4gICAgICAgICAgICB0aXRsZT1cIkRlY2xpbmVcIlxyXG4gICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBtYXJnaW5SaWdodDogNCwgY29sb3I6ICdyZWQnIH19XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICBpZD1cIkFDQ0VQVFwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWNjZXB0fVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2VwdC1idG5cIlxyXG4gICAgICAgICAgICB0aXRsZT1cIkFjY2VwdFwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIG1hcmdpbkxlZnQ6IDQsIGNvbG9yOiAnZ3JlZW4nIH19XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFRleHRJbnB1dCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvVGV4dElucHV0JztcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9CdXR0b24nO1xyXG5jb25zdCBzdHlsZXMgPSB7XHJcbiAgcm9vdDoge1xyXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgIC8vIHBvc2l0aW9uOidmaXhlZCcsXHJcbiAgICB3aWR0aDonMTAwJScsXHJcbiAgICAvLyBib3R0b206MTAsXHJcbiAgICAvLyByaWdodDoxMCxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICAvL21hcmdpbjowXHJcbiAgICBwYWRkaW5nOiA1LFxyXG4gICAgbWFyZ2luTGVmdDogOCxcclxuICAgIG1hcmdpblJpZ2h0OiA4LFxyXG4gICAgbWFyZ2luVG9wOiA4LFxyXG4gICAgbWFyZ2luQm90dG9tOiA4LFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gICAgd2lkdGg6JzEwMCUnXHJcbiAgfSxcclxuICBidG46e1xyXG4gICAgcGFkZGluZzogOCxcclxuICAgIG1hcmdpbkxlZnQ6IDE2LFxyXG4gICAgbWFyZ2luUmlnaHQ6IDE2LFxyXG4gICAgbWFyZ2luVG9wOiA4LFxyXG4gICAgbWFyZ2luQm90dG9tOiA4LFxyXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICBmbGV4OiAxLFxyXG4gIH1cclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VFZGl0b3IoeyBtZXNzYWdlVGV4dCwgb25NZXNzYWdlVGV4dCwgb25NZXNzYWdlLGhhbmdvdXQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMucm9vdH0+XHJcbiAgICAgPGRpdiBzdHlsZT17e2ZsZXg6MX19PlxyXG4gICAgIDxpbnB1dCBzdHlsZT17c3R5bGVzLmlucHV0fSBkaXNhYmxlZD17aGFuZ291dCAmJmhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCd9ICB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fSAgZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWlucHV0XCIgdmFsdWU9e21lc3NhZ2VUZXh0fS8+XHJcbiAgICAgPC9kaXY+XHJcbiAgIFxyXG4gICAgICBcclxuICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkxlZnQ6M319PlxyXG4gICAgICAgIDxCdXR0b24gZGlzYWJsZWQ9e2hhbmdvdXQgJiZoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnfSAgc3R5bGU9e3N0eWxlcy5idG59ICB0aXRsZT1cInNlbmRcIiBpZD0nTUVTU0FHRScgb25DbGljaz17b25NZXNzYWdlfSBkYXRhLXRlc3RpZD0nc2VuZC1idG4nLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgZmxvYXQ6ICdyaWdodCcsXHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgZm9udFNpemU6IDE2LFxyXG4gICAgdGV4dEFsaWduOiAnZW5kJ1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VyTWVzc2FnZSh7IG1lc3NhZ2UgfSkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZXItbWVzc2FnZVwiPnttZXNzYWdlLnRleHR9PC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICAgIGNvbG9yOiAncmVkJyxcclxuICAgIGZsb2F0OiAncmlnaHQnLFxyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIGZvbnRTaXplOiAxNixcclxuICAgIHRleHRBbGlnbjogJ2VuZCdcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlZE1lc3NhZ2UoeyBtZXNzYWdlLG9uTmF2aWdhdGlvbiB9KSB7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVOYXZpZ2F0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIG9uTmF2aWdhdGlvbihlKVxyXG4gICAgfVxyXG4gICAgZGVidWdnZXI7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGRhdGEtdGVzdGlkPVwiYmxvY2tlZC1tZXNzYWdlXCI+e21lc3NhZ2UudGV4dH1cclxuICAgIDxhIGlkPVwiVU5CTE9DS1wiIGRhdGEtdGVzdGlkPVwic2VlbW9yZS1idG5cIiBocmVmPVwiL1wiIG9uQ2xpY2s9e2hhbmRsZU5hdmlnYXRpb259PnNlZSBtb3JlPC9hPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9NZXNzYWdlJztcclxuaW1wb3J0IHsgTWVzc2FnZUVkaXRvciB9IGZyb20gJy4vTWVzc2FnZUVkaXRvcic7XHJcbmltcG9ydCB7IEJsb2NrZXJNZXNzYWdlIH0gZnJvbSAnLi9CbG9ja2VyTWVzc2FnZSdcclxuaW1wb3J0IHtCbG9ja2VkTWVzc2FnZX0gZnJvbSAnLi9CbG9ja2VkTWVzc2FnZSdcclxuaW1wb3J0IHt1c2VNZWRpYVF1ZXJ5fSBmcm9tICcuLi8uLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSdcclxuY29uc3Qgc3R5bGVzID0ge1xyXG4gIG1lc3NhZ2VDb250YWluZXI6IHtcclxuICAgIC8vIHdpZHRoOiAnMTAwJScsXHJcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgIHBhZGRpbmc6IDMsXHJcbiAgLy8gIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXHJcbiAgICBmbGV4OiAzLFxyXG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXHJcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCJcclxuXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2VzKHtcclxuICBtZXNzYWdlcyxcclxuICBvbk1lc3NhZ2UsXHJcbiAgb25NZXNzYWdlVGV4dCxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvblxyXG59KSB7XHJcbiAgY29uc3Qgc2Nyb2xsZXJSZWYgPSB1c2VSZWYobnVsbCk7XHJcbmNvbnN0IHtkZXZpY2V9PXVzZU1lZGlhUXVlcnkoKVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XHJcbiAgICB9XHJcbiAgfSwgW21lc3NhZ2VzXSk7XHJcblxyXG4gIGZ1bmN0aW9uIG9uU2VuZChlKSB7XHJcbiAgICBvbk1lc3NhZ2UoZSk7XHJcbiAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBib3hTaXppbmc6ICdib3JkZXItYm94Jywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwdmgnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBwYWRkaW5nVG9wOiA3NSB9fT5cclxuICAgICAgPGRpdiBzdHlsZT17ey4uLnN0eWxlcy5tZXNzYWdlQ29udGFpbmVyLGZsZXg6IGRldmljZT09PSdwaG9uZSc/NDoyfX0gcmVmPXtzY3JvbGxlclJlZn0+XHJcbiAgICAgICAge21lc3NhZ2VzICYmICBcclxuICAgICAgICAgIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcclxuICAgICAgICAgICAgKG0pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cclxuICAgICAgICAgICAgICAgIHsnICd9XHJcbiAgICAgICAgICAgICAgICB7IW0udHlwZSAmJiA8TWVzc2FnZSBtZXNzYWdlPXttfSAvPn1cclxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSAnYmxvY2tlcicgJiYgPEJsb2NrZXJNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxyXG4gICAgICAgICAgICAgICAge20udHlwZSAmJiBtLnR5cGUgPT09ICdibG9ja2VkJyAmJiA8QmxvY2tlZE1lc3NhZ2UgbWVzc2FnZT17bX0gb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259Lz59XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7ZmxleDoxfX0+XHJcbiAgICAgICAgPE1lc3NhZ2VFZGl0b3JcclxuICAgICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cclxuICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cclxuICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5mdW5jdGlvbiBmbG9hdE1lc3NhZ2VzKHsgbWVzc2FnZXMsIHVzZXJuYW1lIH0pIHtcclxuICBpZiAobWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCAmJiB1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2VzLm1hcCgobXNnKSA9PiB7XHJcbiAgICAgIGlmIChtc2cudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogJ3JpZ2h0JywgdXNlcm5hbWU6ICdtZScgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiAnbGVmdCcgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBzb3J0TWVzc2FnZXMoeyBtZXNzYWdlcyB9KSB7XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vbWVzc2FnZS11aS9NZXNzYWdlcyc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vTGF5b3V0JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nY2hhdCh7XHJcbiAgbWVzc2FnZXMgPSBbXSxcclxuICBvbk1lc3NhZ2VUZXh0LFxyXG4gIG9uTWVzc2FnZSxcclxuICBtZXNzYWdlVGV4dCxcclxuICB1c2VybmFtZSxcclxuICBoYW5nb3V0LFxyXG4gIG9uTmF2aWdhdGlvbixcclxuICBkaXNwYXRjaFxyXG59KSB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dCBpZD1cImhhbmdjaGF0LXVpXCIgPlxyXG4gICAgICA8TWVzc2FnZXNcclxuICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XHJcbiAgICAgICAgaGFuZ291dD17aGFuZ291dH1cclxuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XHJcbiAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XHJcbiAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cclxuICAgICAgICBtZXNzYWdlVGV4dCA9e21lc3NhZ2VUZXh0fVxyXG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgLz5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4uL2ljb25zL01lc3NhZ2UnXHJcbmV4cG9ydCBmdW5jdGlvbiBJY29uc0RlbW8oKXtcclxuICAgIHJldHVybiA8ZGl2PlxyXG5cclxuICAgICAgICA8TWVzc2FnZSBjb3VudD17MX0vPlxyXG4gICAgPC9kaXY+XHJcbn0iLCJleHBvcnQgY29uc3QgbWVzc2FnZXMgPVtcclxuICAgIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzE3ODk5NzEsXHJcbiAgfSxcclxuICAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYE9rIExldCdzIENoYXQgb24gSGFuZ291dCFgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMyMTYzNDYyLFxyXG4gIH0se1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBIb3cgYXJlIHlvdSBkZW1vYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzYzNTcyMyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgQXJlIHlvdSBhbGwgcmlnaHRgLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjc3NTczLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYFllcyBJIGFtLiBIb3cgYXJlIHlvdWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDYsXHJcbiAgfSxcclxuICAsXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2RlbW8nLFxyXG4gICAgdGV4dDogYEFyZSB5b3UgZG9pbmcgZ3JlYXRlYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidkZW1vJyxcclxuICAgIHRleHQ6IGBBcmUgeW91IGRvaW5nIGdyZWF0ZWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDcsXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OCxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6J2JyZW5vJyxcclxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXHJcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXHJcbiAgfSxcclxuICB7XHJcbiAgICB1c2VybmFtZTonYnJlbm8nLFxyXG4gICAgdGV4dDogYFllcyBpIGFtYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcclxuICB9LFxyXG4gIHtcclxuICAgIHVzZXJuYW1lOidicmVubycsXHJcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxyXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxyXG4gIH0sXHJcbl0iLCJleHBvcnQgZnVuY3Rpb24gcmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0c30pe1xyXG4gICAgcmV0dXJuIHVucmVhZGhhbmdvdXRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gKGFjY3VtdWxhdG9yID0gW3sgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH1dKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3Qgb2JqID0gYWNjdW11bGF0b3IuZmluZChcclxuICAgICAgICAgICAgKGEpID0+IGEudXNlcm5hbWUgPT09IGN1cnJlbnQudXNlcm5hbWUgJiYgY3VycmVudC5zdGF0ZSA9PT0gJ01FU1NBTkdFUidcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYWNjdW11bGF0b3IuZmluZEluZGV4KFxyXG4gICAgICAgICAgICAgIChhKSA9PiBhLnVzZXJuYW1lID09PSBjdXJyZW50LnVzZXJuYW1lXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vaWYgY3VycmVudCBleGlzdCBpbnNpZGUgYWNjdW1pbGF0b3IgbWFwIGl0IHRvIHRoYXQgb2JqZWN0XHJcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnNwbGljZShpbmRleCwgMSwge1xyXG4gICAgICAgICAgICAgIC4uLm9iaixcclxuICAgICAgICAgICAgICBtZXNzYWdlQ291bnQ6ICsrb2JqLm1lc3NhZ2VDb3VudCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2lmIGN1cnJlbnQgZXhpc3QgaW5zaWRlIGFjY3VtaWxhdG9yIG1hcCBpdCB0byB0aGF0IG9iamVjdFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHsgLi4uY3VycmVudCwgbWVzc2FnZUNvdW50OiAxIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgIH0sIFtdKTtcclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IExpc3QseyBMaXN0SXRlbSB9IGZyb20gJy4uL2NvbXBvbmVudHMvbGlzdCc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVW5yZWFkSGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyxvblNlbGVjdFVucmVhZCxvblJlbW92ZVVucmVhZCB9KSB7XHJcblxyXG4gIGNvbnN0IFtpdGVtcyxzZXRJdGVtc10gPXVzZVN0YXRlKFtdKVxyXG51c2VFZmZlY3QoKCk9PntcclxuaWYodW5yZWFkaGFuZ291dHMpe1xyXG5cclxuICBjb25zdCByZWR1Y2VkID1yZWR1Y2VyVW5yZWFkaGFuZ291dHMoe3VucmVhZGhhbmdvdXRzfSlcclxuIFxyXG4gIHNldEl0ZW1zKHJlZHVjZWQpXHJcbn1cclxuXHJcbn0sW3VucmVhZGhhbmdvdXRzXSlcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9J3VucmVhZGhhbmdvdXRzJyBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAge2l0ZW1zICYmXHJcbiAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBpdGVtcy5tYXAoKHUpID0+IHtcclxuICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCd9fT5cclxuICAgICAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e29uU2VsZWN0VW5yZWFkfSBpZD17dS51c2VybmFtZX0gc3R5bGU9e3tmbGV4OjV9fSBkYXRhLXRlc3RpZD17YCR7dS51c2VybmFtZX0tc2VsZWN0YH0+e3UudXNlcm5hbWV9IG1lc3NhZ2VzOiB7dS5tZXNzYWdlQ291bnR9PC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e29uUmVtb3ZlVW5yZWFkfSBpZD17dS51c2VybmFtZX0gc3R5bGU9e3tjb2xvcjoncmVkJ319IGRhdGEtdGVzdGlkPXtgJHt1LnVzZXJuYW1lfS1yZW1vdmVgfT54PC9MaXN0SXRlbT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB9KX1cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IFVucmVhZCBmcm9tICcuLi9oYW5nb3V0cy9VbnJlYWRIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVkdWNlclVucmVhZGhhbmdvdXRzfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VVbnJlYWRoYW5nb3V0cydcclxuY29uc3QgdW5yZWFkcyA9IFtcclxuICB7XHJcbiAgICB1c2VybmFtZTogJ2RlbW8nLFxyXG4gICAgc3RhdGU6ICdNRVNTQU5HRVInLFxyXG4gICAgbWVzc2FnZTogeyB0ZXh0OiAnSGVsbG8geW91JywgdGltZXN0YW1wOiAxNTkxODEwNDU4NjMwIH0sXHJcbiAgfSxcclxuXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdkZW1vJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdXNlcm5hbWU6ICdiZXJvJyxcclxuICAgIHN0YXRlOiAnTUVTU0FOR0VSJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogJ0hlbGxvIHlvdScsIHRpbWVzdGFtcDogMTU5MTgxMDQ1ODYzMCB9LFxyXG4gIH0sXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5yZWFkRGVtbygpIHtcclxuICByZXR1cm4gPFVucmVhZCB1bnJlYWRoYW5nb3V0cz17cmVkdWNlclVucmVhZGhhbmdvdXRzKHt1bnJlYWRoYW5nb3V0czp1bnJlYWRzfSl9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge0Jsb2NrZXJNZXNzYWdlfSBmcm9tICcuLi9oYW5nb3V0cy9tZXNzYWdlLXVpL0Jsb2NrZXJNZXNzYWdlJ1xyXG5cclxuY29uc3QgbWVzc2FnZSA9e3RleHQ6J1lvdSBjYW4gbm90IHNlbmQgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZCcsXHJcbnRpbWVzdGFtcDoxMjMyMyxcclxudXNlcm5hbWU6J2RlbW8nXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrZXJNZXNzYWdlRGVtbygpe1xyXG4gICAgcmV0dXJuIDxCbG9ja2VyTWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfS8+XHJcbn0iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgQXBwUm91dGVQcm92aWRlciwgQXBwUm91dGUgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vTmF2aWdhdGlvbic7XHJcbmltcG9ydCBIYW5nb3V0IGZyb20gJy4uL2hhbmdvdXRzL0hhbmdvdXQnO1xyXG5pbXBvcnQgQmxvY2sgZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUtdWkvQmxvY2snO1xyXG5pbXBvcnQgQmxvY2tlZCBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9CbG9ja2VkJztcclxuaW1wb3J0IENvbmZpZ3VyZSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9Db25maWd1cmUnO1xyXG5pbXBvcnQgSW52aXRlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZSc7XHJcbmltcG9ydCBJbnZpdGVlIGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0ludml0ZWUnO1xyXG5pbXBvcnQgSW52aXRlciBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS11aS9JbnZpdGVyJztcclxuaW1wb3J0IEhhbmdjaGF0IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlLXVpL0hhbmdjaGF0JztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL2hhbmdvdXRzL21lc3NhZ2UtdWkvTWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vaGFuZ291dHMvbWVzc2FnZS11aS9NZXNzYWdlcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2VFZGl0b3IgfSBmcm9tICcuLi9oYW5nb3V0cy9tZXNzYWdlLXVpL01lc3NhZ2VFZGl0b3InO1xyXG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi9pY29ucy9vbmxpbmVTdGF0dXMnO1xyXG5pbXBvcnQgTGlzdCx7IExpc3RJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9saXN0JztcclxuaW1wb3J0IHtJY29uc0RlbW99IGZyb20gJy4vSWNvbnNEZW1vJ1xyXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vZmFrZU1lc3NhZ2VzJztcclxuaW1wb3J0IHtVbnJlYWREZW1vfSBmcm9tICcuL1VyZWFkRGVtbydcclxuaW1wb3J0IHtCbG9ja2VyTWVzc2FnZURlbW8gfSBmcm9tICcuL0Jsb2NrZXJNZXNzYWdlRGVtbydcclxuXHJcbmNvbnN0IGhhbmdvdXRzID0gW1xyXG4gICAgeyB1c2VybmFtZTogJ3VzZXJvbmUnIH0sXHJcbiAgICB7IHVzZXJuYW1lOiAndXNlcnR3bycgfSxcclxuICAgIHsgdXNlcm5hbWU6ICd1c2VydGhyZWUnIH0sXHJcbiAgXTtcclxuICBjb25zdCBoYW5nb3V0ID0ge1xyXG4gICAgdXNlcm5hbWU6ICd0ZXN0dXNlcicsXHJcbiAgICBlbWFpbDogJ3Rlc3RAZ21haWwuY29tJyxcclxuICAgIG1lc3NhZ2U6IHsgdGV4dDogYExldCdzIGNoYXQgb24gSGFuZ291dCFgLCB0aW1lc3RhbXA6IDE1OTA4MjA3ODI5MjEgfSxcclxuICB9O1xyXG4gIGNvbnN0IG1lc3NhZ2UgPSB7XHJcbiAgICB1c2VybmFtZTogJ2JyZW5vJyxcclxuICAgIHRleHQ6IGBMZXQncyBDaGF0IG9uIEhhbmdvdXQhYCxcclxuICAgIHRpbWVzdGFtcDogMTU5MTMzMTc2NzgzNixcclxuICB9O1xyXG4gIC8vXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdG9yeWJvb2tSb3V0ZXMoKXtcclxuICAgIHJldHVybihcclxuICA8ZGl2IHN0eWxlPXt7aGVpZ2h0Oic4MHZoJ319PlxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICAgICAgPEhhbmdvdXQgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrXCI+XHJcbiAgICAgICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZWRcIj5cclxuICAgICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cclxuICAgICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZVwiPlxyXG4gICAgICAgICAgICA8SW52aXRlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlZVwiPlxyXG4gICAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZXJcIj5cclxuICAgICAgICAgICAgPEludml0ZXIgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nY2hhdFwiPlxyXG4gICAgICAgICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL21lc3NhZ2VcIj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAyMCwgYmFja2dyb3VuZENvbG9yOiAnI2VlZWVlZWUnIH19PlxyXG4gICAgICAgICAgICAgIDxNZXNzYWdlIG1lc3NhZ2U9e21lc3NhZ2V9IHVzZXJuYW1lPXtoYW5nb3V0LnVzZXJuYW1lfSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9vbmxpbmVcIj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8T25saW5lU3RhdHVzIG9ubGluZSAvPlxyXG4gICAgICAgICAgICAgIDxPbmxpbmVTdGF0dXMgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvbWVzc2FnZXNcIj5cclxuICAgICAgICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi91bnJlYWRcIj5cclxuICAgICAgICAgICAgPFVucmVhZERlbW8vPlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZXItbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICA8QmxvY2tlck1lc3NhZ2VEZW1vLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgXHJcbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9pY29uc1wiPlxyXG4gICAgICAgICAgICA8SWNvbnNEZW1vLz5cclxuICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIFxyXG4gICAgIFxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgIFxyXG4gICAgKVxyXG59IiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgQUNDT1JESU9OX1NFTEVDVEVEOidBQ0NPUkRJT05fU0VMRUNURUQnXHJcbn0iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9e1xyXG4gICAgc2VsZWN0ZWRJZDowXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSxhY3Rpb24pe1xyXG4gICAgc3dpdGNoKGFjdGlvbi50eXBlKXtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFDQ09SRElPTl9TRUxFQ1RFRDpcclxuICAgICAgICAgICAgY29uc3QgbmV4dFN0YXRlPSB7Li4uc3RhdGUsc2VsZWN0ZWRJZDphY3Rpb24uc2VsZWN0ZWRJZH1cclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5leHRTdGF0ZVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaCxjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZVJlZHVjZXIsdXNlTWVtbyx1c2VDb250ZXh0LHVzZVN0YXRlfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCByZWR1Y2VyLHtpbml0U3RhdGV9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmltcG9ydCBMaXN0LCB7TGlzdEl0ZW19IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbGlzdCdcclxuXHJcbmNvbnN0IEFjY29yZGlvbkNvbnRleHQgPWNyZWF0ZUNvbnRleHQoKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWNjb3JkaW9ucyhwcm9wcyl7XHJcbmNvbnN0IHtzZWxlY3RlZElkfT1wcm9wc1xyXG5jb25zdCBbc3RhdGUsZGlzcGF0Y2hdID11c2VSZWR1Y2VyKHJlZHVjZXIsey4uLmluaXRTdGF0ZSxzZWxlY3RlZElkfSlcclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbnJldHVybiA8QWNjb3JkaW9uQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30vPlxyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFjY29yZGlvbih7IGNoaWxkcmVuLCB0aXRsZSxpZCB9KSB7XHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUNvbnRleHQoQWNjb3JkaW9uQ29udGV4dClcclxuICBjb25zdCBbdmlzaWJsZSxzZXRWaXNpYmxlXT11c2VTdGF0ZShmYWxzZSlcclxuY29uc3Qge3NlbGVjdGVkSWR9PXN0YXRlXHJcbiAgZnVuY3Rpb24gc2VsZWN0QWNjb3JkaW9uIChlKXtcclxuICAgICAgY29uc3QgaWQgPWUudGFyZ2V0LmlkXHJcbiAgICAgXHJcbiAgICAgIGlmKGlkICE9PXNlbGVjdGVkSWQpe1xyXG4gICAgICAgIHNldFZpc2libGUodHJ1ZSlcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIHNldFZpc2libGUocHJldj0+ICFwcmV2KVxyXG4gICAgICB9XHJcbiAgICAgXHJcbiAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFDQ09SRElPTl9TRUxFQ1RFRCxzZWxlY3RlZElkOmlkfSlcclxuICB9XHJcblxyXG4gICAgcmV0dXJuICg8TGlzdCBzdHlsZT17e2JhY2tncm91bmRDb2xvcjonI2VlZWVlZScscGFkZGluZzozLGZsZXg6MSxtYXJnaW5Cb3R0b206M319PlxyXG4gICBcclxuICAgICAgIDxMaXN0SXRlbSBpZD17aWR9IG9uQ2xpY2s9e3NlbGVjdEFjY29yZGlvbn0gc3R5bGU9e3tmb250V2VpZ2h0OiA5MDB9fT57dGl0bGV9PC9MaXN0SXRlbT5cclxuICAgIFxyXG4gICAgICAge3NlbGVjdGVkSWQgPT09aWQgJiYgdmlzaWJsZSAmJiBjaGlsZHJlbn1cclxuICAgIDwvTGlzdD4pXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IExpc3Qse0xpc3RJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9saXN0JztcclxuaW1wb3J0IEFjY29yZGlvbnMse0FjY29yZGlvbn0gZnJvbSAnLi4vY29tcG9uZW50cy9hY2NvcmRpb24nXHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQge3VzZU1lZGlhUXVlcnl9IGZyb20gJy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5J1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdG9yeWJvb2tEcmF3ZXJDb250ZW50KHt0b2dnbGVEcmF3ZXIgfSkge1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXHJcblxyXG4gIGNvbnN0IHtkZXZpY2V9PXVzZU1lZGlhUXVlcnkoKVxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOicvJyxyb3V0ZTpgLyR7aWR9YH0pXHJcbiAgICBpZiggZGV2aWNlPT09J3Bob25lJyl7XHJcbiAgICAgIHRvZ2dsZURyYXdlcigpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPEFjY29yZGlvbnMgIHNlbGVjdGVkSWQ9JzAnPlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZzozfX0+XHJcblxyXG4gICAgXHJcbiAgICAgIDxBY2NvcmRpb24gaWQ9XCIwXCIgdGl0bGU9XCJIYW5nb3V0XCIgPlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJoYW5nb3V0c1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEhhbmdvdXRzXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEJsb2NrXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJibG9ja2VkXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgQmxvY2tlZFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgSW52aXRlXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJpbnZpdGVlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgSW52aXRlZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiaW52aXRlclwiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIEludml0ZXJcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cImhhbmdjaGF0XCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICAgSGFuZ2NoYXRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJjb25maWd1cmVcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBDb25maWd1cmVcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBpZD1cIm1lc3NhZ2VcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgICBNZXNzYWdlXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJtZXNzYWdlc1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgIE1lc3NhZ2VzXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJvbmxpbmVcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0+XHJcbiAgICAgICAgIG9ubGluZVN0YXR1c1xyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwidW5yZWFkXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBVcmVhZFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIGlkPVwiYmxvY2tlci1tZXNzYWdlXCIgb25DbGljaz17aGFuZGxlUm91dGV9PlxyXG4gICAgICAgICBCbG9ja2VyTWVzc2FnZVxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPC9MaXN0PlxyXG4gICAgICAgIDwvQWNjb3JkaW9uPlxyXG4gICAgICAgIDxBY2NvcmRpb24gdGl0bGU9XCJJY29uc1wiIGlkPVwiMFwiPlxyXG4gICAgICAgICAgPExpc3Q+XHJcbiAgICAgICAgICA8TGlzdEl0ZW0gaWQ9XCJpY29uc1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfT5cclxuICAgICAgICAgSWNvbnNcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgPC9MaXN0PlxyXG4gICAgICAgIDwvQWNjb3JkaW9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9BY2NvcmRpb25zPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHt1c2VTdGF0ZX1mcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCBEcmF3ZXIgZnJvbSAnLi4vbmF2L0RyYXdlcic7XHJcbmltcG9ydCB7IEFwcEJhciB9IGZyb20gJy4uL25hdi9BcHBCYXInO1xyXG5pbXBvcnQgeyBNZW51IH0gZnJvbSAnLi4vbmF2L01lbnUnO1xyXG5pbXBvcnQgeyBOYXZJdGVtIH0gZnJvbSAnLi4vbmF2L05hdkl0ZW0nO1xyXG5pbXBvcnQgU3Rvcnlib29rUm91dGVzIGZyb20gJy4vU3Rvcnlib29rUm91dGVzJ1xyXG5pbXBvcnQgU3Rvcnlib29rRHJhd2VyQ29udGVudCBmcm9tICcuL1N0b3J5Ym9va0RyYXdlckNvbnRlbnQnXHJcbmltcG9ydCB7dXNlTWVkaWFRdWVyeX0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0b3J5Ym9va05hdmlnYXRpb24oKSB7XHJcbiAgICBjb25zdCBbZHJhd2VySXNPcGVuLHNldERyYXdlclN0YXRlXT11c2VTdGF0ZShmYWxzZSlcclxuXHJcbiAgICBjb25zdCB7ZGV2aWNlfT11c2VNZWRpYVF1ZXJ5KClcclxuICAgIGZ1bmN0aW9uIHRvZ2dsZURyYXdlcigpe1xyXG5cclxuICAgICAgICBzZXREcmF3ZXJTdGF0ZShwcmV2PT4hcHJldilcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4Jyxwb3NpdGlvbjonZml4ZWQnLHdpZHRoOicxMDAlJ319PlxyXG4gICAgICAgICAge2RyYXdlcklzT3BlbiAmJiAgPERyYXdlciAgc3R5bGU9e3twb3NpdGlvbjonYWJzb2x1dGUnfX0gdG9nZ2xlRHJhd2VyPXt0b2dnbGVEcmF3ZXJ9PlxyXG4gICAgICAgICAgICAgICAgPFN0b3J5Ym9va0RyYXdlckNvbnRlbnQgZHJhd2VySXNPcGVuPXtkcmF3ZXJJc09wZW59IHRvZ2dsZURyYXdlcj17dG9nZ2xlRHJhd2VyfSAvPiAgXHJcbiAgICAgICAgICAgIDwvRHJhd2VyPiB9XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjF9fSA+XHJcbiAgICAgICAgICAgIDxBcHBCYXIgPlxyXG4gICAgICAgICAgICAgICAgPE1lbnUgb25DbGljaz17dG9nZ2xlRHJhd2VyfSAvPlxyXG4gICAgICAgICAgICAgICAgPE5hdkl0ZW0gc3R5bGU9e3sgZmxleDogNSB9fT5TdG9yeWJvb2s8L05hdkl0ZW0+XHJcbiAgICAgICAgICAgIDwvQXBwQmFyPlxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICA8U3Rvcnlib29rUm91dGVzLz5cclxuICAgICAgICAgXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG59IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlUHJvdmlkZXIgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcblxyXG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnLi4vdGhlbWUvdGhlbWUtY29udGV4dCc7XHJcbmltcG9ydCB7IE5hdlByb3ZpZGVyIH0gZnJvbSAnLi4vbmF2L05hdlByb3ZpZGVyJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxUaGVtZVByb3ZpZGVyXHJcbiAgICAgIGluaXRTdGF0ZT17e1xyXG4gICAgICAgIHByaW1hcnk6IHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcclxuICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBIZWx2ZXRpY2EsIFwiQXJpYWxcIicsXHJcbiAgICAgICAgfSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPEFwcFJvdXRlUHJvdmlkZXJcclxuICAgICAgICB0aXRsZT1cIldlYmNvbVwiXHJcbiAgICAgICAgaW5pdFN0YXRlPXt7IHJvdXRlOiAnLycsIGZlYXR1cmVSb3V0ZTogJy9oYW5nb3V0cycgfX1cclxuICAgICAgPlxyXG4gICAgICAgICAgPE5hdlByb3ZpZGVyPlxyXG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgIFxyXG4gICAgICAgICAgPC9OYXZQcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9UaGVtZVByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCBTdG9yeWJvb2tOYXZpYXRpb24gZnJvbSAnLi9TdG9yeWJvb2tOYXZpZ2F0aW9uJ1xyXG5pbXBvcnQgU3Rvcnlib29rUm91dGVzIGZyb20gJy4vU3Rvcnlib29rUm91dGVzJ1xyXG5pbXBvcnQgU3Rvcnlib29rUHJvdmlkZXJzIGZyb20gJy4vU3Rvcnlib29rUHJvdmlkZXJzJ1xyXG5jb25zdCBoYW5nb3V0cyA9IFtcclxuICB7IHVzZXJuYW1lOiAndXNlcm9uZScgfSxcclxuICB7IHVzZXJuYW1lOiAndXNlcnR3bycgfSxcclxuICB7IHVzZXJuYW1lOiAndXNlcnRocmVlJyB9LFxyXG5dO1xyXG5jb25zdCBoYW5nb3V0ID0ge1xyXG4gIHVzZXJuYW1lOiAndGVzdHVzZXInLFxyXG4gIGVtYWlsOiAndGVzdEBnbWFpbC5jb20nLFxyXG4gIG1lc3NhZ2U6IHsgdGV4dDogYExldCdzIGNoYXQgb24gSGFuZ291dCFgLCB0aW1lc3RhbXA6IDE1OTA4MjA3ODI5MjEgfSxcclxufTtcclxuY29uc3QgbWVzc2FnZSA9IHtcclxuICB1c2VybmFtZTogJ2JyZW5vJyxcclxuICB0ZXh0OiBgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXHJcbiAgdGltZXN0YW1wOiAxNTkxMzMxNzY3ODM2LFxyXG59O1xyXG4vL1xyXG5yZW5kZXIoXHJcbiAgPFN0b3J5Ym9va1Byb3ZpZGVycz5cclxuICA8U3Rvcnlib29rTmF2aWF0aW9uLz5cclxuXHJcbiAgPC9TdG9yeWJvb2tQcm92aWRlcnM+LFxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiZHJhd2VyIiwiYm94U2hhZG93IiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwiekluZGV4IiwiaGVpZ2h0IiwiYmFja2dyb3VuZENvbG9yIiwidXNlTWVkaWFRdWVyeSIsIndpZHRoIiwic2V0V2lkdGgiLCJ1c2VTdGF0ZSIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJkZXZpY2UiLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsInVzZUVmZmVjdCIsImNvbnNvbGUiLCJsb2ciLCJhZGRFdmVudExpc3RlbmVyIiwiTmF2Q29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJOYXZQcm92aWRlciIsInByb3BzIiwiZHJhd2VyT3BlbiIsInNldERyYXdlck9wZW4iLCJ2YWx1ZSIsInVzZU1lbW8iLCJEcmF3ZXIiLCJwaW5uZWQiLCJzZXRQaW5uZWQiLCJvcGVuIiwib25DbGljayIsImNoaWxkcmVuIiwic3R5bGUiLCJUaGVtZUNvbnRleHQiLCJ1c2VUaGVtZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiVGhlbWVQcm92aWRlciIsImluaXRTdGF0ZSIsInN0YXRlIiwic2V0U3RhdGUiLCJBcHBCYXIiLCJ0aGVtZSIsInByaW1hcnkiLCJtaW5IZWlnaHQiLCJkaXNwbGF5IiwiTWVudVdoaXRlIiwiaWQiLCJNZW51IiwiTmF2SXRlbSIsImFjdGlvblR5cGVzIiwiQVBQX1JPVVRFX0NIQU5HRUQiLCJGRUFUVVJFX1JPVVRFX0NIQU5HRUQiLCJyZWR1Y2VyIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwidXNlQXBwUm91dGVDb250ZXh0IiwidXNlQXBwUm91dGUiLCJkaXNwYXRjaCIsIm9uQXBwUm91dGUiLCJBcHBSb3V0ZSIsInBhdGgiLCJwYXRocyIsImZpbmQiLCJBcHBSb3V0ZVByb3ZpZGVyIiwidXNlUmVkdWNlciIsIkxpc3QiLCJMaXN0SXRlbSIsInN0eWxlcyIsInBhZGRpbmciLCJtYXJnaW5MZWZ0IiwibWFyZ2luUmlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJib3hTaXppbmciLCJmbGV4IiwiVGV4dElucHV0IiwiQnV0dG9uIiwidGl0bGUiLCJpbnB1dENvbnRhaW5lciIsImJvcmRlciIsImlucHV0IiwiSGFuZ291dCIsImhhbmdvdXRzIiwib25TZWFyY2hJbnB1dCIsIm9uRmV0Y2hIYW5nb3V0cyIsIm9uU2VsZWN0SGFuZ291dCIsInNlYXJjaCIsImhhbmRsZUhhbmdvdXRTZWxlY3Rpb24iLCJ0YXJnZXQiLCJoYW5nb3V0IiwidXNlcm5hbWUiLCJwYWRkaW5nVG9wIiwibGVuZ3RoIiwibWFwIiwicm9vdCIsIkxheW91dCIsImNoZWNrYm94IiwiY2hlY2tib3hSb290IiwiYWxpZ25JdGVtcyIsImxheW91dCIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsImJ0biIsIkJsb2NrIiwib25DYW5jZWwiLCJvbkJsb2NrIiwib25SZXBvcnQiLCJmaWxsIiwiY29sb3IiLCJDZW50ZXIiLCJ0ZXh0QWxpZ24iLCJCbG9ja2VkIiwib25VbmJsb2NrIiwib25DbG9zZSIsIkRlbGV0ZSIsIkFyY2hpdmUiLCJpY29uQnRuIiwibWFyZ2luIiwiYnRuQ29udGFpbmVyIiwiYnRuT2siLCJDb25maWd1cmUiLCJvbkRlbGV0ZSIsIm9uQXJjaGl2ZSIsIm9uTm90aWZpY2F0aW9uIiwib25Db252ZXJzYXRpb25IaXN0b3J5Iiwib25OYXZpZ2F0aW9uIiwib25PayIsIkljb25CdXR0b24iLCJJY29uIiwiQ2hlY2tib3giLCJsYWJlbCIsIm9uQ2hhbmdlIiwiUGVyc29uQWRkSWNvbiIsIkludml0ZSIsIm9uSW52aXRlIiwib25NZXNzYWdlVGV4dCIsIm1lc3NhZ2VUZXh0IiwiUGVyc29uQWRkIiwiZW1haWwiLCJEb25lIiwiSW52aXRlZSIsImJvcmRlckNvbG9yIiwiYm9yZGVyU3R5bGUiLCJib3JkZXJXaWR0aCIsImJvcmRlclJhZGl1cyIsImZvbnRTaXplIiwibWVzc2FnZSIsIk1lc3NhZ2UiLCJmbG9hdCIsInRpbWVzdGFtcCIsImRheXMiLCJzZXREYXlzIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJzZXRJbnRlcnZhbCIsInRleHQiLCJwYWRkaW5nQm90dG9tIiwiSW52aXRlciIsIm9uQWNjZXB0Iiwib25EZWNsaW5lIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJNZXNzYWdlRWRpdG9yIiwib25NZXNzYWdlIiwiQmxvY2tlck1lc3NhZ2UiLCJCbG9ja2VkTWVzc2FnZSIsImhhbmRsZU5hdmlnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm1lc3NhZ2VDb250YWluZXIiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJNZXNzYWdlcyIsIm1lc3NhZ2VzIiwic2Nyb2xsZXJSZWYiLCJ1c2VSZWYiLCJjdXJyZW50Iiwic2Nyb2xsVG9wIiwic2Nyb2xsSGVpZ2h0Iiwib25TZW5kIiwiZmxvYXRNZXNzYWdlcyIsInNvcnRNZXNzYWdlcyIsIm1zZyIsInNvcnQiLCJIYW5nY2hhdCIsIk9ubGluZVN0YXR1cyIsInJlYWR5U3RhdGUiLCJJc09ubGluZSIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwiY291bnQiLCJJY29uc0RlbW8iLCJyZWR1Y2VyVW5yZWFkaGFuZ291dHMiLCJ1bnJlYWRoYW5nb3V0cyIsInJlZHVjZSIsImFjY3VtdWxhdG9yIiwiaW5kZXgiLCJtZXNzYWdlQ291bnQiLCJvYmoiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJwdXNoIiwiVW5yZWFkSGFuZ291dHMiLCJvblNlbGVjdFVucmVhZCIsIm9uUmVtb3ZlVW5yZWFkIiwiaXRlbXMiLCJzZXRJdGVtcyIsInJlZHVjZWQiLCJ1bnJlYWRzIiwiVW5yZWFkRGVtbyIsIlVucmVhZCIsIkJsb2NrZXJNZXNzYWdlRGVtbyIsIlN0b3J5Ym9va1JvdXRlcyIsIkFDQ09SRElPTl9TRUxFQ1RFRCIsInNlbGVjdGVkSWQiLCJuZXh0U3RhdGUiLCJBY2NvcmRpb25Db250ZXh0IiwiQWNjb3JkaW9ucyIsIkFjY29yZGlvbiIsInZpc2libGUiLCJzZXRWaXNpYmxlIiwic2VsZWN0QWNjb3JkaW9uIiwicHJldiIsImZvbnRXZWlnaHQiLCJTdG9yeWJvb2tEcmF3ZXJDb250ZW50IiwidG9nZ2xlRHJhd2VyIiwiaGFuZGxlUm91dGUiLCJTdG9yeWJvb2tOYXZpZ2F0aW9uIiwiZHJhd2VySXNPcGVuIiwic2V0RHJhd2VyU3RhdGUiLCJBcHBQcm92aWRlcnMiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsInJlbmRlciIsIlN0b3J5Ym9va1Byb3ZpZGVycyIsIlN0b3J5Ym9va05hdmlhdGlvbiIsImRvY3VtZW50IiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyw4REFBOEQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FDQTUvUixJQUFJQSxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBeUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXVHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENB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
