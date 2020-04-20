var n,
    u,
    i,
    t,
    o,
    r,
    f,
    e = {},
    c = [],
    s = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

function a(n, l) {
  for (var u in l) n[u] = l[u];

  return n;
}

function v(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
}

function h(n, l, u) {
  var i,
      t = arguments,
      o = {};

  for (i in l) "key" !== i && "ref" !== i && (o[i] = l[i]);

  if (arguments.length > 3) for (u = [u], i = 3; i < arguments.length; i++) u.push(t[i]);
  if (null != u && (o.children = u), "function" == typeof n && null != n.defaultProps) for (i in n.defaultProps) void 0 === o[i] && (o[i] = n.defaultProps[i]);
  return p(n, o, l && l.key, l && l.ref, null);
}

function p(l, u, i, t, o) {
  var r = {
    type: l,
    props: u,
    key: i,
    ref: t,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: o
  };
  return null == o && (r.__v = r), n.vnode && n.vnode(r), r;
}

function d(n) {
  return n.children;
}

function m(n, l) {
  this.props = n, this.context = l;
}

function w(n, l) {
  if (null == l) return n.__ ? w(n.__, n.__.__k.indexOf(n) + 1) : null;

  for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;

  return "function" == typeof n.type ? w(n) : null;
}

function g(n) {
  var l, u;

  if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
      n.__e = n.__c.base = u.__e;
      break;
    }

    return g(n);
  }
}

function k(l) {
  (!l.__d && (l.__d = !0) && u.push(l) && !i++ || o !== n.debounceRendering) && ((o = n.debounceRendering) || t)(_);
}

function _() {
  for (var n; i = u.length;) n = u.sort(function (n, l) {
    return n.__v.__b - l.__v.__b;
  }), u = [], n.some(function (n) {
    var l, u, i, t, o, r, f;
    n.__d && (r = (o = (l = n).__v).__e, (f = l.__P) && (u = [], (i = a({}, o)).__v = i, t = A(f, o, i, l.__n, void 0 !== f.ownerSVGElement, null, u, null == r ? w(o) : r), T(u, o), t != r && g(o)));
  });
}

function b(n, l, u, i, t, o, r, f, s) {
  var a,
      h,
      p,
      y,
      d,
      m,
      g,
      k = u && u.__k || c,
      _ = k.length;
  if (f == e && (f = null != o ? o[0] : _ ? w(u, 0) : null), a = 0, l.__k = x(l.__k, function (u) {
    if (null != u) {
      if (u.__ = l, u.__b = l.__b + 1, null === (p = k[a]) || p && u.key == p.key && u.type === p.type) k[a] = void 0;else for (h = 0; h < _; h++) {
        if ((p = k[h]) && u.key == p.key && u.type === p.type) {
          k[h] = void 0;
          break;
        }

        p = null;
      }

      if (y = A(n, u, p = p || e, i, t, o, r, f, s), (h = u.ref) && p.ref != h && (g || (g = []), p.ref && g.push(p.ref, null, u), g.push(h, u.__c || y, u)), null != y) {
        var c;
        if (null == m && (m = y), void 0 !== u.__d) c = u.__d, u.__d = void 0;else if (o == p || y != f || null == y.parentNode) {
          n: if (null == f || f.parentNode !== n) n.appendChild(y), c = null;else {
            for (d = f, h = 0; (d = d.nextSibling) && h < _; h += 2) if (d == y) break n;

            n.insertBefore(y, f), c = f;
          }

          "option" == l.type && (n.value = "");
        }
        f = void 0 !== c ? c : y.nextSibling, "function" == typeof l.type && (l.__d = f);
      } else f && p.__e == f && f.parentNode != n && (f = w(p));
    }

    return a++, u;
  }), l.__e = m, null != o && "function" != typeof l.type) for (a = o.length; a--;) null != o[a] && v(o[a]);

  for (a = _; a--;) null != k[a] && D(k[a], k[a]);

  if (g) for (a = 0; a < g.length; a++) j(g[a], g[++a], g[++a]);
}

function x(n, l, u) {
  if (null == u && (u = []), null == n || "boolean" == typeof n) l && u.push(l(null));else if (Array.isArray(n)) for (var i = 0; i < n.length; i++) x(n[i], l, u);else u.push(l ? l("string" == typeof n || "number" == typeof n ? p(null, n, null, null, n) : null != n.__e || null != n.__c ? p(n.type, n.props, n.key, null, n.__v) : n) : n);
  return u;
}

function P(n, l, u, i, t) {
  var o;

  for (o in u) "children" === o || "key" === o || o in l || N(n, o, null, u[o], i);

  for (o in l) t && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || N(n, o, l[o], u[o], i);
}

function C(n, l, u) {
  "-" === l[0] ? n.setProperty(l, u) : n[l] = "number" == typeof u && !1 === s.test(l) ? u + "px" : null == u ? "" : u;
}

function N(n, l, u, i, t) {
  var o, r, f, e, c;
  if (t ? "className" === l && (l = "class") : "class" === l && (l = "className"), "style" === l) {
    if (o = n.style, "string" == typeof u) o.cssText = u;else {
      if ("string" == typeof i && (o.cssText = "", i = null), i) for (e in i) u && e in u || C(o, e, "");
      if (u) for (c in u) i && u[c] === i[c] || C(o, c, u[c]);
    }
  } else "o" === l[0] && "n" === l[1] ? (r = l !== (l = l.replace(/Capture$/, "")), f = l.toLowerCase(), l = (f in n ? f : l).slice(2), u ? (i || n.addEventListener(l, z, r), (n.l || (n.l = {}))[l] = u) : n.removeEventListener(l, z, r)) : "list" !== l && "tagName" !== l && "form" !== l && "type" !== l && "size" !== l && !t && l in n ? n[l] = null == u ? "" : u : "function" != typeof u && "dangerouslySetInnerHTML" !== l && (l !== (l = l.replace(/^xlink:?/, "")) ? null == u || !1 === u ? n.removeAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase()) : n.setAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase(), u) : null == u || !1 === u && !/^ar/.test(l) ? n.removeAttribute(l) : n.setAttribute(l, u));
}

function z(l) {
  this.l[l.type](n.event ? n.event(l) : l);
}

function A(l, u, i, t, o, r, f, e, c) {
  var s,
      v,
      h,
      p,
      y,
      w,
      g,
      k,
      _,
      x,
      P = u.type;

  if (void 0 !== u.constructor) return null;
  (s = n.__b) && s(u);

  try {
    n: if ("function" == typeof P) {
      if (k = u.props, _ = (s = P.contextType) && t[s.__c], x = s ? _ ? _.props.value : s.__ : t, i.__c ? g = (v = u.__c = i.__c).__ = v.__E : ("prototype" in P && P.prototype.render ? u.__c = v = new P(k, x) : (u.__c = v = new m(k, x), v.constructor = P, v.render = E), _ && _.sub(v), v.props = k, v.state || (v.state = {}), v.context = x, v.__n = t, h = v.__d = !0, v.__h = []), null == v.__s && (v.__s = v.state), null != P.getDerivedStateFromProps && (v.__s == v.state && (v.__s = a({}, v.__s)), a(v.__s, P.getDerivedStateFromProps(k, v.__s))), p = v.props, y = v.state, h) null == P.getDerivedStateFromProps && null != v.componentWillMount && v.componentWillMount(), null != v.componentDidMount && v.__h.push(v.componentDidMount);else {
        if (null == P.getDerivedStateFromProps && k !== p && null != v.componentWillReceiveProps && v.componentWillReceiveProps(k, x), !v.__e && null != v.shouldComponentUpdate && !1 === v.shouldComponentUpdate(k, v.__s, x) || u.__v === i.__v && !v.__) {
          for (v.props = k, v.state = v.__s, u.__v !== i.__v && (v.__d = !1), v.__v = u, u.__e = i.__e, u.__k = i.__k, v.__h.length && f.push(v), s = 0; s < u.__k.length; s++) u.__k[s] && (u.__k[s].__ = u);

          break n;
        }

        null != v.componentWillUpdate && v.componentWillUpdate(k, v.__s, x), null != v.componentDidUpdate && v.__h.push(function () {
          v.componentDidUpdate(p, y, w);
        });
      }
      v.context = x, v.props = k, v.state = v.__s, (s = n.__r) && s(u), v.__d = !1, v.__v = u, v.__P = l, s = v.render(v.props, v.state, v.context), u.__k = null != s && s.type == d && null == s.key ? s.props.children : Array.isArray(s) ? s : [s], null != v.getChildContext && (t = a(a({}, t), v.getChildContext())), h || null == v.getSnapshotBeforeUpdate || (w = v.getSnapshotBeforeUpdate(p, y)), b(l, u, i, t, o, r, f, e, c), v.base = u.__e, v.__h.length && f.push(v), g && (v.__E = v.__ = null), v.__e = !1;
    } else null == r && u.__v === i.__v ? (u.__k = i.__k, u.__e = i.__e) : u.__e = $(i.__e, u, i, t, o, r, f, c);

    (s = n.diffed) && s(u);
  } catch (l) {
    u.__v = null, n.__e(l, u, i);
  }

  return u.__e;
}

function T(l, u) {
  n.__c && n.__c(u, l), l.some(function (u) {
    try {
      l = u.__h, u.__h = [], l.some(function (n) {
        n.call(u);
      });
    } catch (l) {
      n.__e(l, u.__v);
    }
  });
}

function $(n, l, u, i, t, o, r, f) {
  var s,
      a,
      v,
      h,
      p,
      y = u.props,
      d = l.props;
  if (t = "svg" === l.type || t, null != o) for (s = 0; s < o.length; s++) if (null != (a = o[s]) && ((null === l.type ? 3 === a.nodeType : a.localName === l.type) || n == a)) {
    n = a, o[s] = null;
    break;
  }

  if (null == n) {
    if (null === l.type) return document.createTextNode(d);
    n = t ? document.createElementNS("http://www.w3.org/2000/svg", l.type) : document.createElement(l.type, d.is && {
      is: d.is
    }), o = null, f = !1;
  }

  if (null === l.type) y !== d && n.data != d && (n.data = d);else {
    if (null != o && (o = c.slice.call(n.childNodes)), v = (y = u.props || e).dangerouslySetInnerHTML, h = d.dangerouslySetInnerHTML, !f) {
      if (y === e) for (y = {}, p = 0; p < n.attributes.length; p++) y[n.attributes[p].name] = n.attributes[p].value;
      (h || v) && (h && v && h.__html == v.__html || (n.innerHTML = h && h.__html || ""));
    }

    P(n, d, y, t, f), l.__k = l.props.children, h || b(n, l, u, i, "foreignObject" !== l.type && t, o, r, e, f), f || ("value" in d && void 0 !== d.value && d.value !== n.value && (n.value = null == d.value ? "" : d.value), "checked" in d && void 0 !== d.checked && d.checked !== n.checked && (n.checked = d.checked));
  }
  return n;
}

function j(l, u, i) {
  try {
    "function" == typeof l ? l(u) : l.current = u;
  } catch (l) {
    n.__e(l, i);
  }
}

function D(l, u, i) {
  var t, o, r;

  if (n.unmount && n.unmount(l), (t = l.ref) && (t.current && t.current !== l.__e || j(t, null, u)), i || "function" == typeof l.type || (i = null != (o = l.__e)), l.__e = l.__d = void 0, null != (t = l.__c)) {
    if (t.componentWillUnmount) try {
      t.componentWillUnmount();
    } catch (l) {
      n.__e(l, u);
    }
    t.base = t.__P = null;
  }

  if (t = l.__k) for (r = 0; r < t.length; r++) t[r] && D(t[r], u, i);
  null != o && v(o);
}

function E(n, l, u) {
  return this.constructor(n, u);
}

function H(l, u, i) {
  var t, o, f;
  n.__ && n.__(l, u), o = (t = i === r) ? null : i && i.__k || u.__k, l = h(d, null, [l]), f = [], A(u, (t ? u : i || u).__k = l, o || e, e, void 0 !== u.ownerSVGElement, i && !t ? [i] : o ? null : c.slice.call(u.childNodes), f, i || e, t), T(f, l);
}

function M(n) {
  var l = {},
      u = {
    __c: "__cC" + f++,
    __: n,
    Consumer: function (n, l) {
      return n.children(l);
    },
    Provider: function (n) {
      var i,
          t = this;
      return this.getChildContext || (i = [], this.getChildContext = function () {
        return l[u.__c] = t, l;
      }, this.shouldComponentUpdate = function (n) {
        t.props.value !== n.value && i.some(function (l) {
          l.context = n.value, k(l);
        });
      }, this.sub = function (n) {
        i.push(n);
        var l = n.componentWillUnmount;

        n.componentWillUnmount = function () {
          i.splice(i.indexOf(n), 1), l && l.call(n);
        };
      }), n.children;
    }
  };
  return u.Consumer.contextType = u, u;
}

n = {
  __e: function (n, l) {
    for (var u, i; l = l.__;) if ((u = l.__c) && !u.__) try {
      if (u.constructor && null != u.constructor.getDerivedStateFromError && (i = !0, u.setState(u.constructor.getDerivedStateFromError(n))), null != u.componentDidCatch && (i = !0, u.componentDidCatch(n)), i) return k(u.__E = u);
    } catch (l) {
      n = l;
    }

    throw n;
  }
}, m.prototype.setState = function (n, l) {
  var u;
  u = this.__s !== this.state ? this.__s : this.__s = a({}, this.state), "function" == typeof n && (n = n(u, this.props)), n && a(u, n), null != n && this.__v && (l && this.__h.push(l), k(this));
}, m.prototype.forceUpdate = function (n) {
  this.__v && (this.__e = !0, n && this.__h.push(n), k(this));
}, m.prototype.render = d, u = [], i = 0, t = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, r = e, f = 0;

var n$1 = function (t, s, r, e) {
  var u;
  s[0] = 0;

  for (var h = 1; h < s.length; h++) {
    var p = s[h++],
        a = s[h] ? (s[0] |= p ? 1 : 2, r[s[h++]]) : s[++h];
    3 === p ? e[0] = a : 4 === p ? e[1] = Object.assign(e[1] || {}, a) : 5 === p ? (e[1] = e[1] || {})[s[++h]] = a : 6 === p ? e[1][s[++h]] += a + "" : p ? (u = t.apply(a, n$1(t, a, r, ["", null])), e.push(u), a[0] ? s[0] |= 2 : (s[h - 2] = 0, s[h] = u)) : e.push(a);
  }

  return e;
},
    t$1 = new Map();

function e$1 (s) {
  var r = t$1.get(this);
  return r || (r = new Map(), t$1.set(this, r)), (r = n$1(this, r.get(s) || (r.set(s, r = function (n) {
    for (var t, s, r = 1, e = "", u = "", h = [0], p = function (n) {
      1 === r && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n, e) : 3 === r && (n || e) ? (h.push(3, n, e), r = 2) : 2 === r && "..." === e && n ? h.push(4, n, 0) : 2 === r && e && !n ? h.push(5, 0, !0, e) : r >= 5 && ((e || !n && 5 === r) && (h.push(r, 0, e, s), r = 6), n && (h.push(r, n, 0, s), r = 6)), e = "";
    }, a = 0; a < n.length; a++) {
      a && (1 === r && p(), p(a));

      for (var l = 0; l < n[a].length; l++) t = n[a][l], 1 === r ? "<" === t ? (p(), h = [h], r = 3) : e += t : 4 === r ? "--" === e && ">" === t ? (r = 1, e = "") : e = t + e[0] : u ? t === u ? u = "" : e += t : '"' === t || "'" === t ? u = t : ">" === t ? (p(), r = 1) : r && ("=" === t ? (r = 5, s = e, e = "") : "/" === t && (r < 5 || ">" === n[a][l + 1]) ? (p(), 3 === r && (h = h[0]), r = h, (h = h[0]).push(2, 0, r), r = 0) : " " === t || "\t" === t || "\n" === t || "\r" === t ? (p(), r = 2) : e += t), 3 === r && "!--" === e && (r = 4, h = h[0]);
    }

    return p(), h;
  }(s)), r), arguments, [])).length > 1 ? r : r[0];
}

var m$1 = e$1.bind(h);

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

var t$2,
    r$1,
    u$1,
    i$1 = [],
    o$1 = n.__r,
    f$1 = n.diffed,
    c$1 = n.__c,
    e$2 = n.unmount;

function a$1(t) {
  n.__h && n.__h(r$1);
  var u = r$1.__H || (r$1.__H = {
    __: [],
    __h: []
  });
  return t >= u.__.length && u.__.push({}), u.__[t];
}

function v$1(n) {
  return m$2(x$1, n);
}

function m$2(n, u, i) {
  var o = a$1(t$2++);
  return o.__c || (o.__c = r$1, o.__ = [i ? i(u) : x$1(void 0, u), function (t) {
    var r = n(o.__[0], t);
    o.__[0] !== r && (o.__[0] = r, o.__c.setState({}));
  }]), o.__;
}

function p$1(n, u) {
  var i = a$1(t$2++);
  q(i.__H, u) && (i.__ = n, i.__H = u, r$1.__H.__h.push(i));
}

function s$1(n, r) {
  var u = a$1(t$2++);
  return q(u.__H, r) ? (u.__H = r, u.__h = n, u.__ = n()) : u.__;
}

function T$1(n) {
  var u = r$1.context[n.__c];
  if (!u) return n.__;
  var i = a$1(t$2++);
  return null == i.__ && (i.__ = !0, u.sub(r$1)), u.props.value;
}

function F() {
  i$1.some(function (t) {
    if (t.__P) try {
      t.__H.__h.forEach(_$1), t.__H.__h.forEach(g$1), t.__H.__h = [];
    } catch (r) {
      return t.__H.__h = [], n.__e(r, t.__v), !0;
    }
  }), i$1 = [];
}

function _$1(n) {
  n.t && n.t();
}

function g$1(n) {
  var t = n.__();

  "function" == typeof t && (n.t = t);
}

function q(n, t) {
  return !n || t.some(function (t, r) {
    return t !== n[r];
  });
}

function x$1(n, t) {
  return "function" == typeof t ? t(n) : t;
}

n.__r = function (n) {
  o$1 && o$1(n), t$2 = 0, (r$1 = n.__c).__H && (r$1.__H.__h.forEach(_$1), r$1.__H.__h.forEach(g$1), r$1.__H.__h = []);
}, n.diffed = function (t) {
  f$1 && f$1(t);
  var r = t.__c;

  if (r) {
    var o = r.__H;
    o && o.__h.length && (1 !== i$1.push(r) && u$1 === n.requestAnimationFrame || ((u$1 = n.requestAnimationFrame) || function (n) {
      var t,
          r = function () {
        clearTimeout(u), cancelAnimationFrame(t), setTimeout(n);
      },
          u = setTimeout(r, 100);

      "undefined" != typeof window && (t = requestAnimationFrame(r));
    })(F));
  }
}, n.__c = function (t, r) {
  r.some(function (t) {
    try {
      t.__h.forEach(_$1), t.__h = t.__h.filter(function (n) {
        return !n.__ || g$1(n);
      });
    } catch (u) {
      r.some(function (n) {
        n.__h && (n.__h = []);
      }), r = [], n.__e(u, t.__v);
    }
  }), c$1 && c$1(t, r);
}, n.unmount = function (t) {
  e$2 && e$2(t);
  var r = t.__c;

  if (r) {
    var u = r.__H;
    if (u) try {
      u.__.forEach(function (n) {
        return n.t && n.t();
      });
    } catch (t) {
      n.__e(t, r.__v);
    }
  }
};

const AppContext = M();

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      };

    default:
      throw new Error(`Unsupported action type${action.type}`);
  }
}

function AppProvider(props) {
  const [state, dispatch] = m$2(countReducer, {
    count: 0
  });
  const value = s$1(() => [state, dispatch], [state]);
  return h(AppContext.Provider, _extends({
    value: value
  }, props));
}

const initState = {
  email: '',
  password: '',
  success: false,
  error: null,
  username: '',
  loading: false,
  confirm: '',
  current: '',
  emailorusername: '',
  token: null,
  isLoggedIn: false,
  isPasswordChanged: false
};
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes.VALUE_CHANGED:
      return { ...state,
        [action.payload.propName]: action.payload.value
      };

    case actionTypes.LOGIN_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.LOGIN_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        token: action.token,
        isLoggedIn: true,
        password: '',
        successMessage: 'Welcome, '
      };

    case actionTypes.LOGIN_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes.SIGNUP_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.SIGNUP_SUCCESS:
      return { ...state,
        loading: false,
        success: true,
        isLoggedIn: true,
        token: action.token,
        password: '',
        successMessage: 'Welcome'
      };

    case actionTypes.SIGNUP_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes.CHANGE_PASSWORD_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.CHANGE_PASSWORD_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        isPasswordChanged: true,
        successMessage: 'Password changed successfully'
      };

    case actionTypes.CHANGE_PASSWORD_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes.REQUEST_PASS_CHANGE_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.REQUEST_PASS_CHANGE_SUCCESS:
      return { ...state,
        loading: false,
        success: true
      };

    case actionTypes.REQUEST_PASS_CHANGE_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes.GOT_TOKEN_FROM_URL:
      return { ...state,
        token: action.token
      };

    default:
      return state;
  }
}

const AuthContext = M();

function useAuthContext() {
  const context = T$1(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used with AppProvider');
  }

  const [state, dispatch] = context;
  return {
    state,
    dispatch
  };
}

function AuthProvider(props) {
  const [state, dispatch] = m$2(authReducer, initState);
  const value = s$1(() => [state, dispatch], [state]);
  return h(AuthContext.Provider, _extends({
    value: value
  }, props));
}

const RouteContext = M();
function Route(props) {
  const {
    children,
    path
  } = props;
  const {
    state
  } = useRouteContext();
  const {
    location
  } = state;

  if (location.hash === path) {
    return children;
  }

  return null;
}
function Link(props) {
  const {
    to
  } = props;
  const {
    state,
    push
  } = useRouteContext();

  function handleClick(e) {
    e.preventDefault();
    push(to);
  }

  return h("a", _extends({}, props, {
    href: to,
    onClick: handleClick
  }));
}
function useRouteContext() {
  const context = T$1(RouteContext);

  if (!context) {
    throw new Error('useRouteContext must be used with RouteProvider');
  }

  const [state, push] = context;
  return {
    state,
    push
  };
}
function RouteProvider(props) {
  const [state, setState] = v$1({
    location: window.location
  });
  const value = s$1(() => [state, push], [state, push]);

  function push(url) {
    window.history.pushState(null, null, url);
    setState(prev => ({ ...prev,
      location: window.location
    }));
  }

  function handlePopState() {
    setState(prev => ({ ...prev,
      location: window.location
    }));
  }

  p$1(() => {
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  return h(RouteContext.Provider, _extends({
    value: value
  }, props));
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

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

var css_248z = ".auth-form {\n  background-color: #455a64;\n  padding: 5px;\n  border: 1px solid white;\n  border-radius: 5px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n.auth-form input {\n  padding: 5px;\n  margin: 5px;\n}\n\n.auth-form button {\n  padding: 5px;\n  margin: 5px;\n}\n\n.auth-form fieldset {\n  padding: 10px;\n  color: white;\n}\n\n.auth-form a {\n  color: white;\n}\n\n.main-content {\n  background-color: #546e7a;\n  position: fixed;\n  left: 320px;\n  top: 100px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 80%;\n  height: 80%;\n  padding: 5px;\n}\n\n.loading {\n  height: 100%;\n  width: 100%;\n  color: white;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\ninput:invalid {\n  -webkit-box-shadow: 0 0 5px 1px red;\n          box-shadow: 0 0 5px 1px red;\n  color: red;\n}\n\n.btn {\n  border-radius: 2px;\n  height: 33px;\n}";
styleInject(css_248z);

var validationStates = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  INACTIVE: 'INACTIVE'
};

var validationTypes = {
  //constraint
  EMAIL_FORMAT_VALIDATION: 'EMAIL_FORMAT_VALIDATION',
  PASSWORD_FORMAT_VALIDATION: 'PASSWORD_FORMAT_VALIDATION',
  USERNAME_FORMAT_VALIDATION: 'USERNAME_FORMAT_VALIDATION',
  USERNAME_OR_EMAIL_FORMAT_VALIDATION: 'USERNAME_OR_EMAIL_FORMAT_VALIDATION',
  EMPTY_STRING_VALIDATION: 'EMPTY_STRING_VALIDATION',
  PASSWORDS_MATCH_VALIDATION: 'PASSWORDS_MATCH_VALIDATION',
  //auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  REGISTERED_EMAIL: 'REGISTERED_EMAIL',
  EMAIL_NOT_REGISTERED: 'EMAIL_NOT_REGISTERED',
  USERNAME_NOT_REGISTERED: 'USERNAME_NOT_REGISTERED'
};

var validationMessages = {
  INVALID_PASSWORD: 'at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, Can contain special characters',
  INVALID_EMAIL: 'email format is not valid',
  EMAIL_NOT_REGISTERED: 'email is not registered',
  USERNAME_NOT_REGISTERED: 'username is not registered',
  INVALID_USERNAME: 'only Letters a-z or A-Z and the Symbols - and _ are allowed',
  INVALID_EMPTY_STRING: 'empty string is not allowed',
  INVALID_USERNAME_OR_EMAIL: 'email or username is not valid',
  INVALID_CREDENTIALS: 'invalid credentials provided',
  USERNAME_TAKEN: 'username is already taken',
  REGISTERED_EMAIL: 'email is already registered',
  PASSWORDS_DO_NOT_MATCH: 'passwords do not match'
};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
const usernameRegex = /[a-zA-Z]+[-_]*[a-zA-Z]+/g;

function validateEmailConstraint({
  email
}) {
  const emailConstraint = new RegExp(emailRegex);

  if (emailConstraint.test(email)) {
    return {
      validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  } else {
    return {
      validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_EMAIL
    };
  }
}
function isClientValidationType({
  validationType
}) {
  switch (validationType) {
    case validationTypes.PASSWORD_FORMAT_VALIDATION:
      return true;

    case validationTypes.EMAIL_FORMAT_VALIDATION:
      return true;

    case validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION:
      return true;

    case validationTypes.EMPTY_STRING_VALIDATION:
      return true;

    case validationTypes.PASSWORDS_MATCH_VALIDATION:
      return true;

    case validationTypes.USERNAME_FORMAT_VALIDATION:
      return true;

    default:
      return false;
  }
}
function validatePasswordConstraint({
  password
}) {
  const passwordConstraint = new RegExp(passwordRegex);

  if (passwordConstraint.test(password)) {
    return {
      validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  }

  if (!passwordConstraint.test(password)) {
    return {
      validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_PASSWORD
    };
  }
}
function validateUserNameConstraint({
  username
}) {
  const usernameConstraint = new RegExp(usernameRegex);

  if (usernameConstraint.test(username)) {
    return {
      validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  } else {
    return {
      validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_USERNAME
    };
  }
}
function validateEmailOrUsername({
  value
}) {
  const emailConstraint = new RegExp(emailRegex);
  const usernameConstraint = new RegExp(usernameRegex);

  if (emailConstraint.test(value)) {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  } else if (usernameConstraint.test(value)) {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  } else {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_USERNAME_OR_EMAIL
    };
  }
}
function validateEmptyString({
  value
}) {
  if (value.length === 0) {
    return {
      validationType: validationTypes.EMPTY_STRING_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_EMPTY_STRING
    };
  } else {
    return {
      validationType: validationTypes.EMPTY_STRING_VALIDATION,
      validationState: validationStates.VALID,
      message: ''
    };
  }
}
function validatePasswordMatch({
  state
}) {
  const {
    password,
    confirm
  } = state.auth;

  if (password === '' || password !== confirm) {
    return {
      validationState: validationStates.INVALID,
      message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      validationType: validationTypes.PASSWORDS_MATCH_VALIDATION
    };
  } else {
    return {
      validationState: validationStates.VALID,
      message: '',
      validationType: validationTypes.PASSWORDS_MATCH_VALIDATION
    };
  }
}

var actionTypes$1 = {
  INIT_FORM_VALIDATION_STATE: 'INIT_FORM_VALIDATION_STATE',
  RESET_VALIDATION_STATE: 'RESET_VALIDATION_STATE',
  INPUT_BLURRED: 'INPUT_BLURRED',
  INPUT_FOCUSED: 'INPUT_FOCUSED',
  SERVER_VALIDATION: 'SERVER_VALIDATION',
  CLIENT_VALIDATION: 'CLIENT_VALIDATION',
  INC_INPUT_COUTN: 'INC_INPUT_COUTN'
};

var httpStatus = {
  //login
  credentialInvalid: '401',
  //signup
  usernameIsTaken: '402',
  emailIsRegistered: '403',
  usernameInvalid: '405',
  passwordInvalid: '406',
  //change password
  emailInvalid: '407',
  //login
  emailIsNotRegistered: '408',
  emptyStringNotValid: '409',
  emailorusernameNotValid: '410',
  usernameIsNotRegistered: '411',
  //change password
  passwordDoNotMatch: '412',
  tokenExpired: '413',
  serverValidationRange: status => {
    if (status >= 400 && status <= 410) {
      return true;
    }

    return false;
  }
};

function clientValidation({
  validationType,
  value,
  state
}) {
  let validation = null;

  switch (validationType) {
    case validationTypes.EMAIL_FORMAT_VALIDATION:
      validation = validateEmailConstraint({
        email: value
      });
      break;

    case validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION:
      validation = validateEmailOrUsername({
        value
      });
      break;

    case validationTypes.PASSWORD_FORMAT_VALIDATION:
      validation = validatePasswordConstraint({
        password: value
      });
      break;

    case validationTypes.USERNAME_FORMAT_VALIDATION:
      validation = validateUserNameConstraint({
        username: value
      });
      break;

    case validationTypes.EMPTY_STRING_VALIDATION:
      validation = validateEmptyString({
        value
      });
      break;

    case validationTypes.PASSWORDS_MATCH_VALIDATION:
      debugger;
      validation = validatePasswordMatch({
        state
      });
      break;
  }

  return {
    type: actionTypes$1.CLIENT_VALIDATION,
    ...validation
  };
}
function resetInputValidationState({
  validationType
}) {
  return {
    type: actionTypes$1.RESET_VALIDATION_STATE,
    validationType
  };
}
function serverValidation({
  status = 0
}) {
  debugger;

  switch (status) {
    case httpStatus.credentialInvalid:
      debugger;
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailInvalid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordInvalid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
        message: validationMessages.INVALID_PASSWORD,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameInvalid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsRegistered:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.REGISTERED_EMAIL,
        message: validationMessages.REGISTERED_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsNotRegistered:
      debugger;
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_NOT_REGISTERED,
        message: validationMessages.EMAIL_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsTaken:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_TAKEN,
        message: validationMessages.USERNAME_TAKEN,
        validationState: validationStates.INVALID
      };

    case httpStatus.emptyStringNotValid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.EMPTY_STRING_VALIDATION,
        message: validationMessages.INVALID_EMPTY_STRING,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailorusernameNotValid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsNotRegistered:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_NOT_REGISTERED,
        message: validationMessages.USERNAME_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordDoNotMatch:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
        validationState: validationStates.INVALID
      };

    default:
      return null;
  }
}

const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACsklEQVR4nO2au24TQRSGP9sK0FgiIgLlIoUuqQNUVOHSmBLegHQUgS7PgZIOhKmIYihi3sAICQpSJKEECSsGgkKLJUuRKWYWHLOLd+fM7trx+aSRJWtn/v/Yu7MzZw4oiqIoiqIoijKOFDLQOANcAa4DS8BF4AIwZT8BfgJH9vMHsAO8BT4AnQw8eucSsAa8AdpA17G17RhrdsyhpgDcBmqYf8016KjWsWPfIps7NxE3gF38Bx3Vdq1m7lwGXpFd4P3tJTCfdpBRPET2fPtqbWA15VhPcBZ47jkIH61qvaXKDPA+xyAHtXfAdFrBzwFNocEmsA5UgAWgbNuC/W7dg8YX69Urk8BHgakD4D5QiqFVste2BHr7wHlRxD2cwyxGXM1sY/7lpJSBukC3Yb2L2RSYeAwUBdpFO4ar/qZAG4B7AvFt/KzYisjuhLuuwpPAd0fRA9xu+yjKuM8J32wsiak6CnYxk5hvVgR+niUVuyYQaxJvtk9KCdkr8mrYoFET1COB0TpwLOgfxTHwWtA/dkyzyLazFYHJQVQEvjqYlewJwu6AB8CEwOQnQd9BfBb0ncDENpBD3H/lLn5n/37KQm+H/QNKFimngrAf4KlwzH+eM4/MCvs/iSsy1pNgC5NqkphMizuCvjXga9yLx2Yh9D+qArGRXwqDbDPU4hRshkC+Hfbxms1tOxwwygmRFwLtP0hTYnVGPCUG5hnaF5hpYSaxuEnRFWRJ0T08JkUD5jApZ1dTXcxrbAOzVljkb1p80X63wZCmxQNmMIcPEoNptlQPRgLG+misl1WG43D0FxkfjvYyj9k35BV8jRyPx3tZJvsCieVMIktAAVO+skV6JTJbwE2GsESmn6BIqoG8SKpBikVSWZXJLRFeJjdlrzkivExuhxEtk1MURVEURVEUZbj5DckMFeQhrFj9AAAAAElFTkSuQmCC";

const img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADs0lEQVR4nO3bS2hcVRzH8U9ao9IymoIoSmOqLa0rN75wK4JatJQaFezCiNKtiFBc6NKVdCOKC1ErIooKoqCC4FvRjSK1ii5EDWhNUfEFgRiMizORNL03cx5zZ2Jyf/AnMMmc3///zbn3ntelVatWrU7UXsx0Y9+QcxmKZrDQjb8xOdx0Bq+lANYlhH1C0csh3DTMpAatSS2EWgg3DzOpQauFYI1DGIn8u0k8i1OWfDaP/Xi+x3e34DJc3I1d3c/O7MY/+AU/d38ex6f4EJ9gLjLHxlXVE+ZV94QLcDfervhOSszifdyLc5opK029IFyNV4X/am7RdTGHF7oesT23EdVB+FL/i66LI7iq6UJXUhWEYcSLmGi41lqtFgizuKvhWmu1WiAs4DBOa7TaGq0mCB/j3KYKPR9vYXvF72IhHMMhXC9cu5vQEcYGu/EwpiPaWSm+x9Y+1g3Oxtddg2npEH7CFEYjvDbiDvxQ01ZMHMVYapF12iyMyJYapEI4kOHbwSsVbcXGezg9w/ckPVFjkAJhHrdkeG/AQzX+MfFchucJ2t/DYFAQSnrCjRme4Dz8GWEwCAgd+feEY8LkK1mHE0wGAeHOhHyWx5OpZpdkmDQNYaOyR+SlKWavZZpMY1tFe/2C8EhmXgt4JtZku7Lp7LU17fYDwu6CvOaE+1pPPVhgsoDxFdouhXBRYW4PxJgcLzTpNSEpgdApzG0mwqMYQMwQNBfCpsLcogAcKjS5IsZEHoSJwtyiLoFdhSa3xZh0lQrhhoK8om+C8HqB0WOxJl2lQCjpndGPQfIGQosxi7NSzMRBGBWGtbl5JQ2ECBseuWb3p5rpDWGqIJ/HM/KxFb9nGv6BnRmedRAOCIsqObn8qGBx5PZM0wV8LiympKrfa4x7M3L4TyPKLoWXDBfCUxneJ2mzsFmZm8QR7MjwLYXwJk7N8K3UOL4rSOY33Kc/T4eY+AxnZNS5orbh24xklsasME6YEkaMY8LcYRzXqN7mSoXwjYb3Bo4mJJMaOUvuS+Md6b0sWR28HJHMoCE8Km7foS/agHuELr0aIDzd/xLjtBPvViQ0aAh1J1UGohHs0cwBif8NBMKq7R68of8QLqzwW5UQFrUDB/GRsuLnhD2+62p8io/wDeKw0Rgux5XCouaE8DjtCGOAUWHy9KtwVO4rfCGMID/AXz3arzvCd6twqGpdqD3brIWAegjr6n2HFoJ6COvqHagqCFEbI2tJyyGsOwCEbr/4GmDR+mCrVq3Wnv4Frrcuj2OfR5sAAAAASUVORK5CYII=";

function IconState({
  open
}) {
  if (open) {
    return h("img", {
      width: "30px",
      src: img
    });
  }

  return h("img", {
    width: "30px",
    src: img$1
  });
}

function EyeIcon({
  onClick
}) {
  const [state, setState] = v$1(false);

  function toggle() {
    onClick();
    setState(prev => !prev);
  }

  return h("div", {
    onClick: toggle,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 1
    }
  }, h(IconState, {
    open: state
  }));
}

const initState$1 = {
  validation: {}
};
function formReducer(state, action) {
  let nextState = null;

  switch (action.type) {
    case actionTypes$1.SERVER_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes$1.CLIENT_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes$1.RESET_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$1.INPUT_FOCUSED:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE,
          [action.propName]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$1.INIT_FORM_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE
        }
      };

    case actionTypes$1.INC_INPUT_COUTN:
      return { ...state,
        count: state.count + 1
      };

    default:
      return state;
  }
}

const FormContext = M();
function useFormContext() {
  const context = T$1(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used with AppProvider');
  }

  const [state, dispatch] = context;
  return {
    state,
    dispatch
  };
}
function FormProvider(props) {
  const [state, dispatch] = m$2(formReducer, initState$1);
  const value = s$1(() => [state, dispatch], [state]);
  return h(FormContext.Provider, _extends({
    value: value
  }, props));
}

function ValidityIcon({
  valid
}) {
  let stateColor = '#4fc3f7';

  switch (valid) {
    case validationStates.VALID:
      stateColor = 'green';
      break;

    case validationStates.INVALID:
      stateColor = 'red';
      break;

    case validationStates.INACTIVE:
      stateColor = '#4fc3f7';
      break;

    default:
      stateColor = '#4fc3f7';
  }

  return h("div", {
    style: {
      flex: 1,
      color: stateColor,
      lineHeight: 2,
      width: 20,
      textAlign: 'center'
    }
  }, valid ? '✓' : '☓');
}

const style = {
  input: {
    margin: 1,
    border: '1px solid',
    padding: 8,
    flex: 10,
    borderRadius: 2
  },
  root: {
    borderRadius: 2,
    margin: 3,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    border: '1px solid white',
    marginBottom: 1
  },
  inputContainer: {
    display: 'flex',
    flex: 1
  },
  message: {
    color: 'red',
    paddingLeft: 3
  }
};
function Input({
  placeholder,
  type,
  name,
  onChange,
  value = '',
  validationTypes = [],
  id
}) {
  const {
    state,
    dispatch
  } = useFormContext();
  const [inputValidation, setInputValidation] = v$1({
    validationState: validationStates.INACTIVE,
    message: '',
    validationType: undefined
  });
  const [inputType, setInputType] = v$1(type);
  const [borderColor, setBorderColor] = v$1('');
  p$1(() => {
    if (inputValidation && inputValidation.validationState === validationStates.VALID) {
      setBorderColor('green');
    }

    if (inputValidation && inputValidation.validationState === validationStates.INVALID) {
      setBorderColor('red');
    }

    if (inputValidation && inputValidation.validationState === validationStates.INACTIVE) {
      setBorderColor('#4fc3f7');
    }
  }, [inputValidation]);

  function handleFocus() {
    validationTypes.forEach(validationName => {
      if (state.form.validation[validationName]) {
        dispatch(resetInputValidationState({
          validationType: validationName
        }));
      }
    });
  }

  function handleBlur() {
    validationTypes.forEach(validationName => {
      if (isClientValidationType({
        validationType: validationName
      })) {
        dispatch(clientValidation({
          validationType: validationName,
          value,
          state
        }));
      }
    });
  }

  function toggleEye() {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  }

  return h("div", {
    style: style.root
  }, h("div", {
    style: style.inputContainer
  }, h("input", {
    style: { ...style.input,
      borderColor
    },
    type: inputType,
    name: name,
    onChange: onChange,
    value: value,
    onBlur: handleBlur,
    placeholder: placeholder,
    onFocus: handleFocus,
    "data-testid": id
  }), validationTypes.map(validationName => {
    if (state.validation[validationName]) {
      const {
        validationState
      } = state.validation[validationName];

      if (validationState === validationStates.VALID || validationState === validationStates.INVALID) {
        return h(ValidityIcon, {
          key: validationName,
          valid: validationState
        });
      }

      return null;
    }
  }), type === 'password' && h(EyeIcon, {
    onClick: toggleEye
  })), validationTypes.map(validationName => {
    if (state.validation[validationName]) {
      const {
        message
      } = state.validation[validationName];
      return h("div", {
        key: validationName,
        style: style.message
      }, message !== '' && h("div", {
        role: "message",
        "data-testid": `message-${name}`
      }, `* ${message}`));
    }
  }));
}

function Button({
  onClick,
  title,
  disabled,
  id
}) {
  return h("button", {
    "data-testid": id,
    disabled: disabled,
    style: {
      borderRadius: 2,
      height: 33
    },
    onClick: onClick
  }, title);
}

const style$1 = {
  display: 'flex',
  flexDirection: 'column',
  width: 300
};
function Form({
  children,
  formTitle,
  error
}) {
  return h(FormProvider, null, h("fieldset", {
    style: style$1
  }, h("legend", null, formTitle, ":"), children, error && h("div", {
    style: {
      color: 'red',
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 5
    }
  }, "* ", error.message)));
}

var actionTypes$2 = {
  VALUE_CHANGED: 'VALUE_CHANGED',
  LOGIN_STARTED: 'LOGIN_STARTED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT_STARTED: 'LOGOUT_STARTED',
  LOGOUT_FAILED: 'LOGOUT_FAILED',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  SIGNUP_STARTED: 'SIGNUP_STARTED',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILED: 'SIGNUP_FAILED',
  CHANGE_PASSWORD_STARTED: 'CHANGE_PASSWORD_STARTED',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_FAILED: 'CHANGE_PASSWORD_FAILED',
  REQUEST_PASS_CHANGE_STARTED: 'REQUEST_PASS_CHANGE_STARTED',
  REQUEST_PASS_CHANGE_SUCCESS: 'REQUEST_PASS_CHANGE_SUCCESS',
  REQUEST_PASS_CHANGE_FAILED: 'REQUEST_PASS_CHANGE_FAILED',
  GOT_TOKEN_FROM_URL: 'GOT_TOKEN_FROM_URL'
};

function valueChanged({
  propName,
  value
}) {
  return {
    type: actionTypes$2.VALUE_CHANGED,
    payload: {
      propName,
      value
    }
  };
}
async function login({
  dispatch,
  state
}) {
  try {
    const {
      emailorusername,
      password
    } = state;
    dispatch({
      type: actionTypes$2.LOGIN_STARTED
    });
    const response = await fetch(`${process.env.REACT_APP_XAF_SERVER_URL}/auth/login`, {
      headers: {
        'Conten-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: 'Basic ' + btoa(`${emailorusername}:${password}`)
      },
      method: 'GET'
    });
    const result = await response.json();

    if (response.status === 200) {
      dispatch({
        type: actionTypes$2.LOGIN_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        dispatch(serverValidation({
          status: error
        }));
      });
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.LOGIN_FAILED,
      payload: {
        error
      }
    });
  }
}
async function signup({
  dispatch,
  state
}) {
  dispatch({
    type: actionTypes$2.SIGNUP_STARTED
  });
  const {
    email,
    password,
    username
  } = state;

  try {
    const response = await fetch(`${process.env.REACT_APP_XAF_SERVER_URL}/auth/signup`, {
      body: JSON.stringify({
        password,
        email,
        username
      }),
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json'
      },
      method: 'POST'
    });
    const result = await response.json();

    if (response.status === 200) {
      dispatch({
        type: actionTypes$2.SIGNUP_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        dispatch(serverValidation({
          status: error
        }));
      });
    } else {
      throw new Error('Signup failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.SIGNUP_FAILED,
      payload: {
        error
      }
    });
  }
}
async function changePassword({
  dispatch,
  state
}) {
  dispatch({
    type: actionTypes$2.CHANGE_PASSWORD_STARTED
  });

  try {
    const {
      confirm,
      password,
      token,
      emailorusername,
      current
    } = state;
    const response = await fetch(`${process.env.REACT_APP_XAF_SERVER_URL}/auth/changepass`, {
      method: 'put',
      body: JSON.stringify({
        confirm,
        password,
        current,
        token,
        emailorusername
      })
    });
    const result = await response.json();

    if (response.status === 200) {
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        dispatch(serverValidation({
          status: error
        }));
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_FAILED,
        error: error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.CHANGE_PASSWORD_FAILED,
      payload: {
        error
      }
    });
  }
}
async function forgotPassword({
  dispatch,
  state
}) {
  try {
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_STARTED
    });
    const {
      email
    } = state;
    const response = await fetch('/requestpasschange', {
      method: 'post',
      body: JSON.stringify({
        email
      })
    });
    const result = await response.json();

    if (response.status === 200) {
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_SUCCESS,
        token: result.token
      });
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        dispatch(serverValidation({
          status: error
        }));
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_FAILED,
        error: error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED,
      payload: {
        error: err
      }
    });
  }
}

function Login() {
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    emailorusername,
    password,
    error
  } = state;

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    dispatch(valueChanged({
      propName,
      value,
      dispatch,
      state
    }));
  }

  function handleLogin() {
    dispatch(login({
      dispatch,
      state
    }));
  }

  return h("div", {
    "data-testid": "loginform",
    className: "auth-form"
  }, h(Form, {
    formTitle: "Login",
    error: error
  }, h(Input, {
    value: emailorusername,
    onChange: handleChange,
    name: "emailorusername",
    type: "text",
    placeholder: "Enter email or username",
    id: "emailOrUsername",
    "data-testid": "emailOrUsername",
    validationTypes: [validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION, validationTypes.INVALID_CREDENTIALS, validationTypes.EMAIL_NOT_REGISTERED, validationTypes.USERNAME_NOT_REGISTERED]
  }), h(Input, {
    value: password,
    onChange: handleChange,
    name: "password",
    type: "password",
    placeholder: "enter password",
    id: "password",
    "data-testid": "password",
    validationTypes: [validationTypes.EMPTY_STRING_VALIDATION, validationTypes.INVALID_CREDENTIALS]
  }), h(Button, {
    type: "button",
    id: "login-btn",
    "data-testid": "login-btn",
    onClick: handleLogin,
    title: "Login"
  }), h("a", {
    href: "#/requestpasschange"
  }, "Forgot Password!")));
}

function Signup() {
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    username,
    password,
    email
  } = state;

  function handleSignup() {
    dispatch(signup({
      dispatch,
      state
    }));
  }

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    dispatch(valueChanged({
      propName: name,
      value,
      dispatch,
      state
    }));
  }

  return h("div", {
    "data-testid": "signupform",
    className: "auth-form"
  }, h(Form, {
    formTitle: "Sign up"
  }, h(Input, {
    value: username,
    onChange: handleChange,
    type: "text",
    id: "username",
    name: "username",
    placeholder: "username",
    validationTypes: [validationTypes.USERNAME_FORMAT_VALIDATION, validationTypes.USERNAME_TAKEN]
  }), h(Input, {
    onChange: handleChange,
    value: email,
    placeholder: "email",
    type: "email",
    id: "email",
    name: "email",
    validationTypes: [validationTypes.EMAIL_FORMAT_VALIDATION, validationTypes.REGISTERED_EMAIL]
  }), h(Input, {
    onChange: handleChange,
    value: password,
    placeholder: "password",
    type: "password",
    id: "password",
    name: "password",
    validationTypes: [validationTypes.PASSWORD_FORMAT_VALIDATION]
  }), h(Button, {
    className: "btn",
    type: "button",
    onClick: handleSignup,
    id: "signup-btn",
    title: "Signup"
  })));
}

function RequestPassChange() {
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    email
  } = state;

  function handleForgotPassword() {
    dispatch(forgotPassword({
      dispatch,
      state
    }));
  }

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    dispatch(valueChanged({
      propName: name,
      value,
      dispatch,
      state
    }));
  }

  return h("div", {
    "data-testid": "signupform",
    className: "auth-form"
  }, h(Form, {
    formTitle: "Forgot Password"
  }, h(Input, {
    value: email,
    placeholder: "email",
    name: "email",
    onChange: handleChange,
    type: "email",
    id: "email",
    validationTypes: [validationTypes.EMAIL_FORMAT_VALIDATION, validationTypes.EMAIL_NOT_REGISTERED]
  }), h(Button, {
    className: "btn",
    type: "button",
    onClick: handleForgotPassword,
    id: "requestpasschange-btn",
    title: "Send"
  })));
}

function ChangePassword() {
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    password,
    confirm,
    current,
    emailorusername,
    token,
    error
  } = state;
  p$1(() => {
    let url = new URL(window.location.href);
    var token = url.searchParams.get('token');
  }, []);

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
  }

  function handleChangePass() {
    changePassword({
      dispatch,
      state
    });
  }

  return h("div", {
    "data-testid": "signupform",
    className: "auth-form"
  }, h(Form, {
    formTitle: "Change Password",
    error: error
  }, !token && h(Input, {
    value: emailorusername,
    type: "text",
    id: "emailorusername",
    name: "emailorusername",
    placeholder: "Enter email or username",
    onChange: handleChange,
    validationTypes: [validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION, validationTypes.INVALID_CREDENTIALS]
  }), !token && h(Input, {
    value: current,
    type: "password",
    id: "current",
    name: "current",
    onChange: handleChange,
    placeholder: "Enter current password",
    validationTypes: [validationTypes.EMPTY_STRING_VALIDATION, validationTypes.INVALID_CREDENTIALS]
  }), h(Input, {
    value: password,
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Enter new password",
    onChange: handleChange,
    validationTypes: [validationTypes.PASSWORD_FORMAT_VALIDATION]
  }), h(Input, {
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    placeholder: "Confirm new password",
    onChange: handleChange,
    validationTypes: [validationTypes.PASSWORDS_MATCH_VALIDATION]
  }), h(Button, {
    type: "button",
    id: "change-pass-btn",
    "data-testid": "change-pass-btn",
    onClick: handleChangePass,
    title: "Change"
  })));
}

// const ChangePassword = lazy(() => import('./auth/ChangePassword'));
// const ForgotPassword = lazy(() => import('./auth/ForgotPassword'));
// const Signup = lazy(() => import('./auth/Signup'));

H(h(AppProvider, null, h(AuthProvider, null, h(RouteProvider, null, h(Link, {
  to: "#/changepassword"
}, "ChangePassword"), h(Link, {
  to: "#/login"
}, "Login"), h(Link, {
  to: "#/signup"
}, "Signup"), h(Link, {
  to: "#/forgotpassword"
}, "ForgotPassword"), h(Route, {
  path: "#/changepassword"
}, h(ChangePassword, null)), h(Route, {
  path: "#/login"
}, h(Login, null)), h(Route, {
  path: "#/signup"
}, h(Signup, null)), h(Route, {
  path: "#/forgotpassword"
}, h(RequestPassChange, null))))), document.getElementById('app'));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2h0bS9kaXN0L2h0bS5tb2R1bGUuanMiLCIuLi9ub2RlX21vZHVsZXMvaHRtL3ByZWFjdC9pbmRleC5tb2R1bGUuanMiLCIuLi9ub2RlX21vZHVsZXMvcHJlYWN0L2hvb2tzL2Rpc3QvaG9va3MubW9kdWxlLmpzIiwiLi4vYXBwLWNvbnRleHQuanMiLCIuLi9hdXRoL2F1dGhSZWR1Y2VyLmpzIiwiLi4vYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi9yb3V0ZS9yb3V0ZS1jb250ZXh0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uL2Zvcm0vdmFsaWRhdGlvblN0YXRlcy5qcyIsIi4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi9mb3JtL3ZhbGlkYXRpb25SZWdleC5qcyIsIi4uL2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uL2Zvcm0vYWN0aW9ucy5qcyIsIi4uL2Zvcm0vaWNvbnMvb3BlbkV5ZS5wbmciLCIuLi9mb3JtL2ljb25zL2Nsb3NlRXllLnBuZyIsIi4uL2Zvcm0vRXllSWNvbi5qcyIsIi4uL2Zvcm0vZm9ybVJlZHVjZXIuanMiLCIuLi9mb3JtL2Zvcm0tY29udGV4dC5qcyIsIi4uL2Zvcm0vSW5wdXQuanMiLCIuLi9mb3JtL0J1dHRvbi5qcyIsIi4uL2Zvcm0vRm9ybS5qcyIsIi4uL2F1dGgvYWN0aW9uVHlwZXMuanMiLCIuLi9hdXRoL2FjdGlvbnMuanMiLCIuLi9hdXRoL0xvZ2luLmpzIiwiLi4vYXV0aC9TaWdudXAuanMiLCIuLi9hdXRoL0ZvcmdvdFBhc3N3b3JkLmpzIiwiLi4vYXV0aC9DaGFuZ2VQYXNzd29yZC5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsInZhciBuPWZ1bmN0aW9uKHQscyxyLGUpe3ZhciB1O3NbMF09MDtmb3IodmFyIGg9MTtoPHMubGVuZ3RoO2grKyl7dmFyIHA9c1toKytdLGE9c1toXT8oc1swXXw9cD8xOjIscltzW2grK11dKTpzWysraF07Mz09PXA/ZVswXT1hOjQ9PT1wP2VbMV09T2JqZWN0LmFzc2lnbihlWzFdfHx7fSxhKTo1PT09cD8oZVsxXT1lWzFdfHx7fSlbc1srK2hdXT1hOjY9PT1wP2VbMV1bc1srK2hdXSs9YStcIlwiOnA/KHU9dC5hcHBseShhLG4odCxhLHIsW1wiXCIsbnVsbF0pKSxlLnB1c2godSksYVswXT9zWzBdfD0yOihzW2gtMl09MCxzW2hdPXUpKTplLnB1c2goYSl9cmV0dXJuIGV9LHQ9bmV3IE1hcDtleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzKXt2YXIgcj10LmdldCh0aGlzKTtyZXR1cm4gcnx8KHI9bmV3IE1hcCx0LnNldCh0aGlzLHIpKSwocj1uKHRoaXMsci5nZXQocyl8fChyLnNldChzLHI9ZnVuY3Rpb24obil7Zm9yKHZhciB0LHMscj0xLGU9XCJcIix1PVwiXCIsaD1bMF0scD1mdW5jdGlvbihuKXsxPT09ciYmKG58fChlPWUucmVwbGFjZSgvXlxccypcXG5cXHMqfFxccypcXG5cXHMqJC9nLFwiXCIpKSk/aC5wdXNoKDAsbixlKTozPT09ciYmKG58fGUpPyhoLnB1c2goMyxuLGUpLHI9Mik6Mj09PXImJlwiLi4uXCI9PT1lJiZuP2gucHVzaCg0LG4sMCk6Mj09PXImJmUmJiFuP2gucHVzaCg1LDAsITAsZSk6cj49NSYmKChlfHwhbiYmNT09PXIpJiYoaC5wdXNoKHIsMCxlLHMpLHI9NiksbiYmKGgucHVzaChyLG4sMCxzKSxyPTYpKSxlPVwiXCJ9LGE9MDthPG4ubGVuZ3RoO2ErKyl7YSYmKDE9PT1yJiZwKCkscChhKSk7Zm9yKHZhciBsPTA7bDxuW2FdLmxlbmd0aDtsKyspdD1uW2FdW2xdLDE9PT1yP1wiPFwiPT09dD8ocCgpLGg9W2hdLHI9Myk6ZSs9dDo0PT09cj9cIi0tXCI9PT1lJiZcIj5cIj09PXQ/KHI9MSxlPVwiXCIpOmU9dCtlWzBdOnU/dD09PXU/dT1cIlwiOmUrPXQ6J1wiJz09PXR8fFwiJ1wiPT09dD91PXQ6XCI+XCI9PT10PyhwKCkscj0xKTpyJiYoXCI9XCI9PT10PyhyPTUscz1lLGU9XCJcIik6XCIvXCI9PT10JiYocjw1fHxcIj5cIj09PW5bYV1bbCsxXSk/KHAoKSwzPT09ciYmKGg9aFswXSkscj1oLChoPWhbMF0pLnB1c2goMiwwLHIpLHI9MCk6XCIgXCI9PT10fHxcIlxcdFwiPT09dHx8XCJcXG5cIj09PXR8fFwiXFxyXCI9PT10PyhwKCkscj0yKTplKz10KSwzPT09ciYmXCIhLS1cIj09PWUmJihyPTQsaD1oWzBdKX1yZXR1cm4gcCgpLGh9KHMpKSxyKSxhcmd1bWVudHMsW10pKS5sZW5ndGg+MT9yOnJbMF19XG4iLCJpbXBvcnR7aCBhcyByLENvbXBvbmVudCBhcyBvLHJlbmRlciBhcyB0fWZyb21cInByZWFjdFwiO2V4cG9ydHtoLHJlbmRlcixDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7aW1wb3J0IGUgZnJvbVwiaHRtXCI7dmFyIG09ZS5iaW5kKHIpO2V4cG9ydHttIGFzIGh0bWx9O1xuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcblxuY29uc3QgQXBwQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gY291bnRSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgJ0lOQ1JFTUVOVCc6XG4gICAgICByZXR1cm4geyBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgYWN0aW9uIHR5cGUke2FjdGlvbi50eXBlfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVzZUFwcENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcbiAgfVxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XG4gIGNvbnN0IGluY3JlbWVudCA9ICgpID0+IGRpc3BhdGNoKHsgdHlwZTogJ0lOQ1JFTUVOVCcgfSk7XG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCwgaW5jcmVtZW50IH07XG59XG5cbmZ1bmN0aW9uIEFwcFByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihjb3VudFJlZHVjZXIsIHsgY291bnQ6IDAgfSk7XG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8QXBwQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG5leHBvcnQgeyBBcHBQcm92aWRlciwgdXNlQXBwQ29udGV4dCB9O1xuIiwiZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgZW1haWw6ICcnLFxuICBwYXNzd29yZDogJycsXG4gIHN1Y2Nlc3M6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgdXNlcm5hbWU6ICcnLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgY29uZmlybTogJycsXG4gIGN1cnJlbnQ6ICcnLFxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxuICB0b2tlbjogbnVsbCxcbiAgaXNMb2dnZWRJbjogZmFsc2UsXG4gIGlzUGFzc3dvcmRDaGFuZ2VkOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRoUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgW2FjdGlvbi5wYXlsb2FkLnByb3BOYW1lXTogYWN0aW9uLnBheWxvYWQudmFsdWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUsICcsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZScsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgaXNQYXNzd29yZENoYW5nZWQ6IHRydWUsXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHknLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIHN1Y2Nlc3M6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gdXNlQXV0aENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xuICB9XG5cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xuXG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZSxcbiAgICBkaXNwYXRjaCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG5cbmV4cG9ydCB7IHVzZUF1dGhDb250ZXh0LCBBdXRoUHJvdmlkZXIgfTtcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5cbmNvbnN0IFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3QgeyBsb2NhdGlvbiB9ID0gc3RhdGU7XG5cbiAgaWYgKGxvY2F0aW9uLmhhc2ggPT09IHBhdGgpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMaW5rKHByb3BzKSB7XG4gIGNvbnN0IHsgdG8gfSA9IHByb3BzO1xuICBjb25zdCB7IHN0YXRlLCBwdXNoIH0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBwdXNoKHRvKTtcbiAgfVxuICByZXR1cm4gPGEgey4uLnByb3BzfSBocmVmPXt0b30gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlUm91dGVDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChSb3V0ZUNvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBSb3V0ZVByb3ZpZGVyJyk7XG4gIH1cbiAgY29uc3QgW3N0YXRlLCBwdXNoXSA9IGNvbnRleHQ7XG5cbiAgcmV0dXJuIHsgc3RhdGUsIHB1c2ggfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZSh7IGxvY2F0aW9uOiB3aW5kb3cubG9jYXRpb24gfSk7XG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgcHVzaF0sIFtzdGF0ZSwgcHVzaF0pO1xuXG4gIGZ1bmN0aW9uIHB1c2godXJsKSB7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHVybCk7XG4gICAgc2V0U3RhdGUoKHByZXYpID0+ICh7IC4uLnByZXYsIGxvY2F0aW9uOiB3aW5kb3cubG9jYXRpb24gfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9wU3RhdGUoKSB7XG4gICAgc2V0U3RhdGUoKHByZXYpID0+ICh7IC4uLnByZXYsIGxvY2F0aW9uOiB3aW5kb3cubG9jYXRpb24gfSkpO1xuICB9XG4gXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBoYW5kbGVQb3BTdGF0ZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZVBvcFN0YXRlKTtcbiAgICB9O1xuICB9LCBbXSk7XG4gIHJldHVybiA8Um91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIFZBTElEOiAnVkFMSUQnLFxuICBJTlZBTElEOiAnSU5WQUxJRCcsXG4gIElOQUNUSVZFOiAnSU5BQ1RJVkUnXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAvL2NvbnN0cmFpbnRcbiAgRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdFTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXG4gIFBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOiAnUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04nLFxuICBVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OJyxcbiAgVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXG4gIEVNUFRZX1NUUklOR19WQUxJREFUSU9OOiAnRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04nLFxuICBQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjogJ1BBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OJyxcbiAgLy9hdXRoXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdJTlZBTElEX0NSRURFTlRJQUxTJyxcbiAgVVNFUk5BTUVfVEFLRU46ICdVU0VSTkFNRV9UQUtFTicsXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdSRUdJU1RFUkVEX0VNQUlMJyxcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdFTUFJTF9OT1RfUkVHSVNURVJFRCcsXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOidVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCdcbn07XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOVkFMSURfUEFTU1dPUkQ6XG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxuICBJTlZBTElEX0VNQUlMOiAnZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZCcsXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnZW1haWwgaXMgbm90IHJlZ2lzdGVyZWQnLFxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcbiAgSU5WQUxJRF9VU0VSTkFNRTpcbiAgICAnb25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWQnLFxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ2VtcHR5IHN0cmluZyBpcyBub3QgYWxsb3dlZCcsXG4gIElOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUw6ICdlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWQnLFxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnLFxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCdcbn07XG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XG5cbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xuXG5leHBvcnQgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9bYS16QS1aXStbLV9dKlthLXpBLVpdKy9nO1xuIiwiaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XG5cbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XG4gIGNvbnN0IHBhc3N3b3JkQ29uc3RyYWludCA9IG5ldyBSZWdFeHAocGFzc3dvcmRSZWdleCk7XG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgfTtcbiAgfVxuICBpZiAoIXBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xuXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcblxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pIHtcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBzdGF0ZSB9KSB7XG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9IHN0YXRlLmF1dGg7XG5cbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxuICAgIH07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICBJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTogJ0lOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFJyxcbiAgICBSRVNFVF9WQUxJREFUSU9OX1NUQVRFOiAnUkVTRVRfVkFMSURBVElPTl9TVEFURScsXG4gICAgSU5QVVRfQkxVUlJFRDogJ0lOUFVUX0JMVVJSRUQnLFxuICAgIElOUFVUX0ZPQ1VTRUQ6ICdJTlBVVF9GT0NVU0VEJyxcbiAgXG4gICAgU0VSVkVSX1ZBTElEQVRJT046ICdTRVJWRVJfVkFMSURBVElPTicsXG4gICAgQ0xJRU5UX1ZBTElEQVRJT046J0NMSUVOVF9WQUxJREFUSU9OJyxcbiAgXG4gICAgSU5DX0lOUFVUX0NPVVROIDonSU5DX0lOUFVUX0NPVVROJ1xuICB9O1xuICAiLCJleHBvcnQgZGVmYXVsdCB7XG4gIC8vbG9naW5cbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxuICAvL3NpZ251cFxuICB1c2VybmFtZUlzVGFrZW46ICc0MDInLFxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXG4gIHBhc3N3b3JkSW52YWxpZDogJzQwNicsIC8vY2hhbmdlIHBhc3N3b3JkXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXG4gIC8vbG9naW5cbiAgZW1haWxJc05vdFJlZ2lzdGVyZWQ6ICc0MDgnLFxuICBlbXB0eVN0cmluZ05vdFZhbGlkOiAnNDA5JyxcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXG4gIHVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOic0MTEnLFxuLy9jaGFuZ2UgcGFzc3dvcmRcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxuICB0b2tlbkV4cGlyZWQ6JzQxMycsXG4gIHNlcnZlclZhbGlkYXRpb25SYW5nZTogc3RhdHVzID0+IHtcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuIiwiXG5pbXBvcnQgKiBhcyB2YWxpZGF0aW9ucyBmcm9tICcuL2NvbnN0cmFpbnRWYWxpZGF0b3JzJztcbmltcG9ydCBjb25zdFZhbFR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGUsIHZhbHVlLCBzdGF0ZSB9KSB7XG4gIGxldCB2YWxpZGF0aW9uID0gbnVsbDtcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7XG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcbiAgICAgICAgdmFsdWUsXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHtcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxuICAgICAgZGVidWdnZXI7XG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgc3RhdGUgfSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTiwgLi4udmFsaWRhdGlvbiB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEZvcm1WYWxpZGF0aW9uU3RhdGUoKSB7XG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFLCB2YWxpZGF0aW9uVHlwZSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5jSW5wdXRDb3VudCgpIHtcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROIH07XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwIH0pIHtcbiAgZGVidWdnZXI7XG4gIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxuICAgICAgZGVidWdnZXI7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbEludmFsaWQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzUmVnaXN0ZXJlZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlJFR0lTVEVSRURfRU1BSUwsXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRUdJU1RFUkVEX0VNQUlMLFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNOb3RSZWdpc3RlcmVkOlxuICAgICAgZGVidWdnZXI7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNUYWtlbjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX1RBS0VOLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfVEFLRU4sXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlTdHJpbmdOb3RWYWxpZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmREb05vdE1hdGNoOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBWUFBQUNxYVhIZUFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFDc2tsRVFWUjRuTzJhdTI0VFFSU0dQOXNLMEZnaUlnTGxJb1V1cVFOVVZPSFNtQkxlZ0hRVWdTN1BnWklPaEttSVlpaGkzc0FJQ1FwU0pLRUVDU3NHZ2tLTEpVdVJLV1lXSExPTGQrZk03dHJ4K2FTUkpXdG4vdi9ZdTdNelp3NG9pcUlvaXFJb2lqS09GRExRT0FOY0FhNERTOEJGNEFJd1pUOEJmZ0pIOXZNSHNBTzhCVDRBblF3OGV1Y1NzQWE4QWRwQTE3RzE3UmhyZHN5aHBnRGNCbXFZZjgwMTZLaldzV1BmSXBzN054RTNnRjM4QngzVmRxMW03bHdHWHBGZDRQM3RKVENmZHBCUlBFVDJmUHRxYldBMTVWaFBjQlo0N2prSUg2MXF2YVhLRFBBK3h5QUh0WGZBZEZyQnp3Rk5vY0Vtc0E1VWdBV2diTnVDL1c3ZGc4WVg2OVVyazhCSGdha0Q0RDVRaXFGVnN0ZTJCSHI3d0hsUnhEMmN3eXhHWE0xc1kvN2xwSlNCdWtDM1liMkwyUlNZZUF3VUJkcEZPNGFyL3FaQUc0QjdBdkZ0L0t6WWlzanVoTHV1d3BQQWQwZlJBOXh1K3lqS3VNOEozMndzaWFrNkNuWXhrNWh2VmdSK25pVVZ1eVlRYXhKdnRrOUtDZGtyOG1yWW9GRVQxQ09CMFRwd0xPZ2Z4VEh3V3RBL2RreXp5TGF6RllISlFWUUV2anFZbGV3Snd1NkFCOENFd09RblFkOUJmQmIwbmNERU5wQkQzSC9sTG41bi8zN0tRbStIL1FOS0ZpbW5nckFmNEtsd3pIK2VNNC9NQ3ZzL2lTc3kxcE5nQzVOcWtwaE1penVDdmpYZ2E5eUx4MlloOUQrcUFyR1JYd3FEYkRQVTRoUnNoa0MrSGZieG1zMXRPeHd3eWdtUkZ3THRQMGhUWW5WR1BDVUc1aG5hRjVocFlTYXh1RW5SRldSSjBUMDhKa1VENWpBcFoxZFRYY3hyYkFPelZsamtiMXA4MFg2M3daQ214UU5tTUljUEVvTnB0bFFQUmdMRyttaXNsMVdHNDNEMEZ4a2Zqdll5ajlrMzVCVjhqUnlQeDN0Wkp2c0NpZVZNSWt0QUFWTytza1Y2SlRKYndFMkdzRVNtbjZCSXFvRzhTS3BCaWtWU1daWEpMUkZlSmpkbHJ6a2l2RXh1aHhFdGsxTVVSVkVVUlZFVVpiajVEY2tNRmVRaHJGajlBQUFBQUVsRlRrU3VRbUNDXCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBWUFBQUNxYVhIZUFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFEczBsRVFWUjRuTzNiUzJoY1ZSekg4VTlhbzlJeW1vSW9TbU9xTGEwck43NXdLNEphdEpRYUZlekNpTkt0aUZCYzZOS1ZkQ09LQzFFcklvb0tvcUNDNEZ2UmpTSzFpaTVFRFdoTlVmRUZnUmlNaXpPUk5MMDNjeDV6WjJKeWYvQW5NTW1jMy8vL3pibjNudGVsVmF0V3JVN1VYc3gwWTkrUWN4bUtackRRamI4eE9keDBCcStsQU5ZbGhIMUMwY3NoM0RUTXBBYXRTUzJFV2dnM0R6T3BRYXVGWUkxREdJbjh1MGs4aTFPV2ZEYVAvWGkreDNlMzRESmMzSTFkM2MvTzdNWS8rQVUvZDM4ZXg2ZjRFSjlnTGpMSHhsWFZFK1pWOTRRTGNEZmVydmhPU3N6aWZkeUxjNW9wSzAyOUlGeU5WNFgvYW03UmRUR0hGN29lc1QyM0VkVkIrRkwvaTY2TEk3aXE2VUpYVWhXRVljU0xtR2k0MWxxdEZnaXp1S3ZoV211MVdpQXM0REJPYTdUYUdxMG1DQi9qM0tZS1BSOXZZWHZGNzJJaEhNTWhYQzljdTV2UUVjWUd1L0V3cGlQYVdTbSt4OVkrMWczT3h0ZGRnMm5wRUg3Q0ZFWWp2RGJpRHZ4UTAxWk1ITVZZYXBGMTJpeU15SllhcEVJNGtPSGJ3U3NWYmNYR2V6Zzl3L2NrUFZGamtBSmhIcmRrZUcvQVF6WCtNZkZjaHVjSjJ0L0RZRkFRU25yQ2pSbWU0RHo4R1dFd0NBZ2QrZmVFWThMa0sxbUhFMHdHQWVIT2hIeVd4NU9wWnBka21EUU5ZYU95UitTbEtXYXZaWnBNWTF0RmUvMkM4RWhtWGd0NEp0Wmt1N0xwN0xVMTdmWUR3dTZDdk9hRSsxcFBQVmhnc29EeEZkb3VoWEJSWVc0UHhKZ2NMelRwTlNFcGdkQXB6RzBtd3FNWVFNd1FOQmZDcHNMY29nQWNLalM1SXNaRUhvU0p3dHlpTG9GZGhTYTN4WmgwbFFyaGhvSzhvbStDOEhxQjBXT3hKbDJsUUNqcG5kR1BRZklHUW9zeGk3TlN6TVJCR0JXR3RibDVKUTJFQ0JzZXVXYjNwNXJwRFdHcUlKL0hNL0t4RmI5bkd2NkJuUm1lZFJBT0NJc3FPYm44cUdCeDVQWk0wd1Y4TGl5bXBLcmZhNHg3TTNMNFR5UEtMb1dYREJmQ1V4bmVKMm16c0ZtWm04UVI3TWp3TFlYd0prN044SzNVT0w0clNPWTMzS2MvVDRlWStBeG5aTlM1b3JiaDI0eGtsc2FzTUU2WUVrYU1ZOExjWVJ6WHFON21Tb1h3alliM0JvNG1KSk1hT1V2dVMrTWQ2YjBzV1IyOEhKSE1vQ0U4S203Zm9TL2FnSHVFTHIwYUlEemQveExqdEJQdlZpUTBhQWgxSjFVR29oSHMwY3dCaWY4TkJNS3E3UjY4b2Y4UUxxendXNVVRRnJVREIvR1JzdUxuaEQyKzYycDhpby93RGVLdzBSZ3V4NVhDb3VhRThEanRDR09BVVdIeTlLdHdWTzRyZkNHTUlEL0FYejNhcnp2Q2Q2dHdxR3BkcUQzYnJJV0FlZ2pyNm4ySEZvSjZDT3ZxSGFncUNGRWJJMnRKeXlHc093Q0Vici80R21EUittQ3JWcTNXbnY0RnJyY3VqMk9mUjVzQUFBQUFTVVZPUks1Q1lJST1cIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7dXNlU3RhdGV9IGZyb20gJ3ByZWFjdC9ob29rcydcbmltcG9ydCBvcGVuSWNvbiBmcm9tICcuL2ljb25zL29wZW5FeWUucG5nJztcbmltcG9ydCBjbG9zZUljb24gZnJvbSAnLi9pY29ucy9jbG9zZUV5ZS5wbmcnO1xuZnVuY3Rpb24gSWNvblN0YXRlKHsgb3BlbiB9KSB7XG4gIGlmIChvcGVuKSB7XG4gICAgcmV0dXJuIDxpbWcgd2lkdGg9XCIzMHB4XCIgc3JjPXtvcGVuSWNvbn0gLz47XG4gIH1cbiAgcmV0dXJuIDxpbWcgd2lkdGg9XCIzMHB4XCIgc3JjPXtjbG9zZUljb259IC8+O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFeWVJY29uKHtvbkNsaWNrfSkge1xuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgIG9uQ2xpY2soKVxuICAgIHNldFN0YXRlKHByZXYgPT4gIXByZXYpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBvbkNsaWNrPXt0b2dnbGV9XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDonY2VudGVyJyxcbiAgICAgICAgbWFyZ2luOiAxXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxJY29uU3RhdGUgb3Blbj17c3RhdGV9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XG5cbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7IHZhbGlkYXRpb246IHt9IH07XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIGxldCBuZXh0U3RhdGUgPSBudWxsO1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTjpcbiAgICAgIG5leHRTdGF0ZSA9IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OOlxuICAgICAgbmV4dFN0YXRlID0ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXG5cbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XG5cbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEU6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxuICAgICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICBjYXNlIGFjdGlvblR5cGVzLklOUFVUX0ZPQ1VTRUQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXG4gICAgICAgICAgW2FjdGlvbi5wcm9wTmFtZV06IHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxuICAgICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE46XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgY291bnQ6IHN0YXRlLmNvdW50ICsgMSB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgZm9ybVJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vZm9ybVJlZHVjZXInO1xuY29uc3QgRm9ybUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VGb3JtQ29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRm9ybUNvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUZvcm1Db250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XG4gIH1cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xuXG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRm9ybVByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihmb3JtUmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxGb3JtQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcbmltcG9ydCB7IGlzQ2xpZW50VmFsaWRhdGlvblR5cGUgfSBmcm9tICcuL2NvbnN0cmFpbnRWYWxpZGF0b3JzJztcbmltcG9ydCBFeWVJY29uIGZyb20gJy4vRXllSWNvbic7XG5pbXBvcnQgeyB1c2VGb3JtQ29udGV4dCB9IGZyb20gJy4vZm9ybS1jb250ZXh0JztcbmZ1bmN0aW9uIFZhbGlkaXR5SWNvbih7IHZhbGlkIH0pIHtcbiAgbGV0IHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XG4gIHN3aXRjaCAodmFsaWQpIHtcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuVkFMSUQ6XG4gICAgICBzdGF0ZUNvbG9yID0gJ2dyZWVuJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEOlxuICAgICAgc3RhdGVDb2xvciA9ICdyZWQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLklOQUNUSVZFOlxuICAgICAgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17e1xuICAgICAgICBmbGV4OiAxLFxuICAgICAgICBjb2xvcjogc3RhdGVDb2xvcixcbiAgICAgICAgbGluZUhlaWdodDogMixcbiAgICAgICAgd2lkdGg6IDIwLFxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7dmFsaWQgPyAn4pyTJyA6ICfimJMnfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5jb25zdCBzdHlsZSA9IHtcbiAgaW5wdXQ6IHtcbiAgICBtYXJnaW46IDEsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkJyxcbiAgICBwYWRkaW5nOiA4LFxuICAgIGZsZXg6IDEwLFxuICAgIGJvcmRlclJhZGl1czogMixcbiAgfSxcbiAgcm9vdDoge1xuICAgIGJvcmRlclJhZGl1czogMixcbiAgICBtYXJnaW46IDMsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnLFxuICAgIG1hcmdpbkJvdHRvbTogMSxcbiAgfSxcbiAgaW5wdXRDb250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleDogMSxcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIGNvbG9yOiAncmVkJyxcbiAgICBwYWRkaW5nTGVmdDogMyxcbiAgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnB1dCh7XG4gIHBsYWNlaG9sZGVyLFxuICB0eXBlLFxuICBuYW1lLFxuICBvbkNoYW5nZSxcbiAgdmFsdWUgPSAnJyxcbiAgdmFsaWRhdGlvblR5cGVzID0gW10sXG4gIGlkLFxufSkge1xuICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlRm9ybUNvbnRleHQoKTtcblxuICBjb25zdCBbaW5wdXRWYWxpZGF0aW9uLCBzZXRJbnB1dFZhbGlkYXRpb25dID0gdXNlU3RhdGUoe1xuICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTkFDVElWRSxcbiAgICBtZXNzYWdlOiAnJyxcbiAgICB2YWxpZGF0aW9uVHlwZTogdW5kZWZpbmVkLFxuICB9KTtcblxuICBjb25zdCBbaW5wdXRUeXBlLCBzZXRJbnB1dFR5cGVdID0gdXNlU3RhdGUodHlwZSk7XG5cbiAgY29uc3QgW2JvcmRlckNvbG9yLCBzZXRCb3JkZXJDb2xvcl0gPSB1c2VTdGF0ZSgnJyk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoXG4gICAgICBpbnB1dFZhbGlkYXRpb24gJiZcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuVkFMSURcbiAgICApIHtcbiAgICAgIHNldEJvcmRlckNvbG9yKCdncmVlbicpO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBpbnB1dFZhbGlkYXRpb24gJiZcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRFxuICAgICkge1xuICAgICAgc2V0Qm9yZGVyQ29sb3IoJ3JlZCcpO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBpbnB1dFZhbGlkYXRpb24gJiZcbiAgICAgIGlucHV0VmFsaWRhdGlvbi52YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkVcbiAgICApIHtcbiAgICAgIHNldEJvcmRlckNvbG9yKCcjNGZjM2Y3Jyk7XG4gICAgfVxuICB9LCBbaW5wdXRWYWxpZGF0aW9uXSk7XG4gIGZ1bmN0aW9uIGhhbmRsZUZvY3VzKCkge1xuICAgIHZhbGlkYXRpb25UeXBlcy5mb3JFYWNoKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xuICAgICAgaWYgKHN0YXRlLmZvcm0udmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcbiAgICAgICAgZGlzcGF0Y2goXG4gICAgICAgICAgYWN0aW9ucy5yZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQmx1cigpIHtcbiAgICB2YWxpZGF0aW9uVHlwZXMuZm9yRWFjaCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmIChpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25OYW1lIH0pKSB7XG4gICAgICAgIGRpc3BhdGNoKFxuICAgICAgICAgIGFjdGlvbnMuY2xpZW50VmFsaWRhdGlvbih7XG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGVFeWUoKSB7XG4gICAgaWYgKGlucHV0VHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgc2V0SW5wdXRUeXBlKCd0ZXh0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldElucHV0VHlwZSgncGFzc3dvcmQnKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgc3R5bGU9e3sgLi4uc3R5bGUuaW5wdXQsIGJvcmRlckNvbG9yIH19XG4gICAgICAgICAgdHlwZT17aW5wdXRUeXBlfVxuICAgICAgICAgIG5hbWU9e25hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBvbkJsdXI9e2hhbmRsZUJsdXJ9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfVxuICAgICAgICAgIG9uRm9jdXM9e2hhbmRsZUZvY3VzfVxuICAgICAgICAgIGRhdGEtdGVzdGlkPXtpZH1cbiAgICAgICAgLz5cbiAgICAgICAge3ZhbGlkYXRpb25UeXBlcy5tYXAoKHZhbGlkYXRpb25OYW1lKSA9PiB7XG4gICAgICAgICAgaWYgKHN0YXRlLnZhbGlkYXRpb25bdmFsaWRhdGlvbk5hbWVdKSB7XG4gICAgICAgICAgICBjb25zdCB7IHZhbGlkYXRpb25TdGF0ZSB9ID0gc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV07XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5WQUxJRCB8fFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGUgPT09IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFZhbGlkaXR5SWNvbiBrZXk9e3ZhbGlkYXRpb25OYW1lfSB2YWxpZD17dmFsaWRhdGlvblN0YXRlfSAvPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgICAge3R5cGUgPT09ICdwYXNzd29yZCcgJiYgPEV5ZUljb24gb25DbGljaz17dG9nZ2xlRXllfSAvPn1cbiAgICAgIDwvZGl2PlxuICAgICAge3ZhbGlkYXRpb25UeXBlcy5tYXAoKHZhbGlkYXRpb25OYW1lKSA9PiB7XG4gICAgICAgIGlmIChzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXSkge1xuICAgICAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV07XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYga2V5PXt2YWxpZGF0aW9uTmFtZX0gc3R5bGU9e3N0eWxlLm1lc3NhZ2V9PlxuICAgICAgICAgICAgICB7bWVzc2FnZSAhPT0gJycgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJtZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH1cbiAgICAgICAgICAgICAgICA+e2AqICR7bWVzc2FnZX1gfTwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSl9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvbih7IG9uQ2xpY2ssIHRpdGxlLCBkaXNhYmxlZCwgaWQgfSkge1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cbiAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogMiwgaGVpZ2h0OiAzMyB9fVxuICAgICAgb25DbGljaz17b25DbGlja31cbiAgICA+XG4gICAgICB7dGl0bGV9XG4gICAgPC9idXR0b24+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgKiBhcyB2YWxpZGF0aW9uQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgRm9ybVByb3ZpZGVyIH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIHdpZHRoOiAzMDAsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGb3JtKHsgY2hpbGRyZW4sIGZvcm1UaXRsZSwgZXJyb3IgfSkge1xuICByZXR1cm4gKFxuICAgIDxGb3JtUHJvdmlkZXI+XG4gICAgICA8ZmllbGRzZXQgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgPGxlZ2VuZD57Zm9ybVRpdGxlfTo8L2xlZ2VuZD5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgICoge2Vycm9yLm1lc3NhZ2V9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2ZpZWxkc2V0PlxuICAgIDwvRm9ybVByb3ZpZGVyPlxuICApO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBWQUxVRV9DSEFOR0VEOiAnVkFMVUVfQ0hBTkdFRCcsXG4gIExPR0lOX1NUQVJURUQ6ICdMT0dJTl9TVEFSVEVEJyxcbiAgTE9HSU5fU1VDQ0VTUzogJ0xPR0lOX1NVQ0NFU1MnLFxuICBMT0dJTl9GQUlMRUQ6ICdMT0dJTl9GQUlMRUQnLFxuXG4gIExPR09VVF9TVEFSVEVEOiAnTE9HT1VUX1NUQVJURUQnLFxuICBMT0dPVVRfRkFJTEVEOiAnTE9HT1VUX0ZBSUxFRCcsXG4gIExPR09VVF9TVUNDRVNTOiAnTE9HT1VUX1NVQ0NFU1MnLFxuXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxuICBTSUdOVVBfU1VDQ0VTUzogJ1NJR05VUF9TVUNDRVNTJyxcbiAgU0lHTlVQX0ZBSUxFRDogJ1NJR05VUF9GQUlMRUQnLFxuXG4gIENIQU5HRV9QQVNTV09SRF9TVEFSVEVEOiAnQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQnLFxuICBDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzogJ0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTJyxcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxuXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCcsXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQnLFxuICBHT1RfVE9LRU5fRlJPTV9VUkw6ICdHT1RfVE9LRU5fRlJPTV9VUkwnLFxufTtcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IHNlcnZlclZhbGlkYXRpb24gfSBmcm9tICcuLi9mb3JtL2FjdGlvbnMnO1xuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi4vZm9ybS9odHRwLXN0YXR1cyc7XG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIHByb3BOYW1lLFxuICAgICAgdmFsdWUsXG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ2luKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7cHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMfS9hdXRoL2xvZ2luYCxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW4tVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICcqJyxcbiAgICAgICAgICBBdXRob3JpemF0aW9uOiAnQmFzaWMgJyArIGJ0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApLFxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgfVxuICAgICk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB0b2tlbjogcmVzdWx0LnRva2VuIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XG5cbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBkaXNwYXRjaChcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvZ2luIGZhaWxlZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWdudXAoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCwgdXNlcm5hbWUgfSA9IHN0YXRlO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICBgJHtwcm9jZXNzLmVudi5SRUFDVF9BUFBfWEFGX1NFUlZFUl9VUkx9L2F1dGgvc2lnbnVwYCxcbiAgICAgIHtcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB9XG4gICAgKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTLCB0b2tlbjogcmVzdWx0LnRva2VuIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWdudXAgZmFpbGVkJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xuICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9nb3V0KHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHRva2VuIH0gPSBzdGF0ZTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYCR7cHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMfS9hdXRoL2xvZ291dD9gICtcbiAgICAgICAgbmV3IFVSTFNlYXJjaFBhcmFtcyh7IHRva2VuIH0pXG4gICAgKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVF9TVEFSVEVEIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XG4gIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQgfSk7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBjb25maXJtLCBwYXNzd29yZCwgdG9rZW4sIGVtYWlsb3J1c2VybmFtZSwgY3VycmVudCB9ID0gc3RhdGU7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgIGAke3Byb2Nlc3MuZW52LlJFQUNUX0FQUF9YQUZfU0VSVkVSX1VSTH0vYXV0aC9jaGFuZ2VwYXNzYCxcbiAgICAgIHtcbiAgICAgICAgbWV0aG9kOiAncHV0JyxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNvbmZpcm0sXG4gICAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgICAgY3VycmVudCxcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICBlbWFpbG9ydXNlcm5hbWUsXG4gICAgICAgIH0pLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBkaXNwYXRjaChcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxuICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3IgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9yZXF1ZXN0cGFzc2NoYW5nZScsIHtcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcbiAgICB9KTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBkaXNwYXRjaChcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxuICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXG4gICAgICBwYXlsb2FkOiB7IGVycm9yOiBlcnIgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTCxcbiAgICB0b2tlbixcbiAgfTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uL2Zvcm0vSW5wdXQnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9mb3JtL0J1dHRvbic7XG5pbXBvcnQgRm9ybSBmcm9tICcuLi9mb3JtL0Zvcm0nO1xuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuLi9mb3JtL3ZhbGlkYXRpb25UeXBlcyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExvZ2luKCkge1xuICBjb25zdCB7IGRpc3BhdGNoLCBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcblxuICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQsIGVycm9yIH0gPSBzdGF0ZTtcblxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0O1xuICAgIGRpc3BhdGNoKGFjdGlvbnMudmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlLCBkaXNwYXRjaCwgc3RhdGUgfSkpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKCkge1xuICAgIGRpc3BhdGNoKGFjdGlvbnMubG9naW4oeyBkaXNwYXRjaCwgc3RhdGUgfSkpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9naW5mb3JtXCIgY2xhc3NOYW1lPVwiYXV0aC1mb3JtXCI+XG4gICAgICA8Rm9ybSBmb3JtVGl0bGU9XCJMb2dpblwiIGVycm9yPXtlcnJvcn0+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtlbWFpbG9ydXNlcm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICBuYW1lPVwiZW1haWxvcnVzZXJuYW1lXCJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCBvciB1c2VybmFtZVwiXG4gICAgICAgICAgaWQ9XCJlbWFpbE9yVXNlcm5hbWVcIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZW1haWxPclVzZXJuYW1lXCJcbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxuICAgICAgICAgIF19XG4gICAgICAgIC8+XG5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZW50ZXIgcGFzc3dvcmRcIlxuICAgICAgICAgIGlkPVwicGFzc3dvcmRcIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwicGFzc3dvcmRcIlxuICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W1xuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgXX1cbiAgICAgICAgLz5cblxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgaWQ9XCJsb2dpbi1idG5cIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9naW4tYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVMb2dpbn1cbiAgICAgICAgICB0aXRsZT1cIkxvZ2luXCJcbiAgICAgICAgLz5cbiAgICAgICAgPGEgaHJlZj1cIiMvcmVxdWVzdHBhc3NjaGFuZ2VcIj5Gb3Jnb3QgUGFzc3dvcmQhPC9hPlxuICAgICAgPC9Gb3JtPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XG5pbXBvcnQgRm9ybSBmcm9tICcuLi9mb3JtL0Zvcm0nO1xuaW1wb3J0IElucHV0IGZyb20gJy4uL2Zvcm0vSW5wdXQnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9mb3JtL0J1dHRvbic7XG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzJztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2lnbnVwKCkge1xuICBjb25zdCB7IGRpc3BhdGNoLCBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcblxuICBjb25zdCB7IHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwgfSA9IHN0YXRlO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZVNpZ251cCgpIHtcbiAgICBkaXNwYXRjaChhY3Rpb25zLnNpZ251cCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldDtcbiAgICBkaXNwYXRjaChhY3Rpb25zLnZhbHVlQ2hhbmdlZCh7IHByb3BOYW1lOiBuYW1lLCB2YWx1ZSwgZGlzcGF0Y2gsIHN0YXRlIH0pKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzaWdudXBmb3JtXCIgY2xhc3NOYW1lPVwiYXV0aC1mb3JtXCI+XG4gICAgICA8Rm9ybSBmb3JtVGl0bGU9XCJTaWduIHVwXCI+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXt1c2VybmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICBpZD1cInVzZXJuYW1lXCJcbiAgICAgICAgICBuYW1lPVwidXNlcm5hbWVcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwidXNlcm5hbWVcIlxuICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W1xuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX1RBS0VOLFxuICAgICAgICAgIF19XG4gICAgICAgIC8+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgdmFsdWU9e2VtYWlsfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZW1haWxcIlxuICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgaWQ9XCJlbWFpbFwiXG4gICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5SRUdJU1RFUkVEX0VNQUlMLFxuICAgICAgICAgIF19XG4gICAgICAgIC8+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwicGFzc3dvcmRcIlxuICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgaWQ9XCJwYXNzd29yZFwiXG4gICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT05dfVxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVTaWdudXB9XG4gICAgICAgICAgaWQ9XCJzaWdudXAtYnRuXCJcbiAgICAgICAgICB0aXRsZT1cIlNpZ251cFwiXG4gICAgICAgIC8+XG4gICAgICA8L0Zvcm0+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9mb3JtL0lucHV0JztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2Zvcm0vQnV0dG9uJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZXF1ZXN0UGFzc0NoYW5nZSgpIHtcbiAgY29uc3QgeyBkaXNwYXRjaCwgc3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUZvcmdvdFBhc3N3b3JkKCkge1xuICAgIGRpc3BhdGNoKGFjdGlvbnMuZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUgfSkpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXQ7XG4gICAgZGlzcGF0Y2goYWN0aW9ucy52YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZTogbmFtZSwgdmFsdWUsIGRpc3BhdGNoLCBzdGF0ZSB9KSk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2lnbnVwZm9ybVwiIGNsYXNzTmFtZT1cImF1dGgtZm9ybVwiPlxuICAgICAgPEZvcm0gZm9ybVRpdGxlPVwiRm9yZ290IFBhc3N3b3JkXCI+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtlbWFpbH1cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cImVtYWlsXCJcbiAgICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgICBpZD1cImVtYWlsXCJcbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcbiAgICAgICAgICBdfVxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVGb3Jnb3RQYXNzd29yZH1cbiAgICAgICAgICBpZD1cInJlcXVlc3RwYXNzY2hhbmdlLWJ0blwiXG4gICAgICAgICAgdGl0bGU9XCJTZW5kXCJcbiAgICAgICAgLz5cbiAgICAgIDwvRm9ybT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9mb3JtL0lucHV0JztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2Zvcm0vQnV0dG9uJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBnZXRUb2tlbkZyb21VcmwgfSBmcm9tICcuL2FjdGlvbnMnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQoKSB7XG4gIGNvbnN0IHsgZGlzcGF0Y2gsIHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xuXG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0sIGN1cnJlbnQsIGVtYWlsb3J1c2VybmFtZSwgdG9rZW4sIGVycm9yIH0gPSBzdGF0ZTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICB2YXIgdG9rZW4gPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgndG9rZW4nKTtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4sIGRpc3BhdGNoLCBzdGF0ZSB9KTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0O1xuICAgIGFjdGlvbnMudmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWU6IG5hbWUsIHZhbHVlLCBkaXNwYXRjaCwgc3RhdGUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlUGFzcygpIHtcbiAgICBhY3Rpb25zLmNoYW5nZVBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlIH0pO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInNpZ251cGZvcm1cIiBjbGFzc05hbWU9XCJhdXRoLWZvcm1cIj5cbiAgICAgIDxGb3JtIGZvcm1UaXRsZT1cIkNoYW5nZSBQYXNzd29yZFwiIGVycm9yPXtlcnJvcn0+XG4gICAgICAgIHshdG9rZW4gJiYgKFxuICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGlkPVwiZW1haWxvcnVzZXJuYW1lXCJcbiAgICAgICAgICAgIG5hbWU9XCJlbWFpbG9ydXNlcm5hbWVcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCBvciB1c2VybmFtZVwiXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICBdfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHshdG9rZW4gJiYgKFxuICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnR9XG4gICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICAgICAgaWQ9XCJjdXJyZW50XCJcbiAgICAgICAgICAgIG5hbWU9XCJjdXJyZW50XCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIGN1cnJlbnQgcGFzc3dvcmRcIlxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICBdfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgaWQ9XCJwYXNzd29yZFwiXG4gICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIG5ldyBwYXNzd29yZFwiXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT05dfVxuICAgICAgICAvPlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICB2YWx1ZT17Y29uZmlybX1cbiAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICAgIGlkPVwiY29uZmlybVwiXG4gICAgICAgICAgbmFtZT1cImNvbmZpcm1cIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ29uZmlybSBuZXcgcGFzc3dvcmRcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OXX1cbiAgICAgICAgLz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGlkPVwiY2hhbmdlLXBhc3MtYnRuXCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImNoYW5nZS1wYXNzLWJ0blwiXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQ2hhbmdlUGFzc31cbiAgICAgICAgICB0aXRsZT1cIkNoYW5nZVwiXG4gICAgICAgIC8+XG4gICAgICA8L0Zvcm0+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xuLy9pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gJ2h0bS9wcmVhY3QnO1xuaW1wb3J0IFRlc3RDb21wb25lbnQgZnJvbSAnLi9UZXN0Q29tcG9uZW50JztcbmltcG9ydCB7IEFwcFByb3ZpZGVyIH0gZnJvbSAnLi9hcHAtY29udGV4dCc7XG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIFJvdXRlLCBMaW5rIH0gZnJvbSAnLi9yb3V0ZS9yb3V0ZS1jb250ZXh0JztcbmltcG9ydCBMb2dpbiBmcm9tICcuL2F1dGgvTG9naW4nO1xuaW1wb3J0IFNpZ251cCBmcm9tICcuL2F1dGgvU2lnbnVwJztcbmltcG9ydCBGb3Jnb3RQYXNzd29yZCBmcm9tICcuL2F1dGgvRm9yZ290UGFzc3dvcmQnO1xuaW1wb3J0IENoYW5nZVBhc3N3b3JkIGZyb20gJy4vYXV0aC9DaGFuZ2VQYXNzd29yZCc7XG4vLyBjb25zdCBMb2dpbiA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvTG9naW4nKSk7XG4vLyBjb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvQ2hhbmdlUGFzc3dvcmQnKSk7XG4vLyBjb25zdCBGb3Jnb3RQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvRm9yZ290UGFzc3dvcmQnKSk7XG4vLyBjb25zdCBTaWdudXAgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL1NpZ251cCcpKTtcblxucmVuZGVyKFxuICA8QXBwUHJvdmlkZXI+XG4gICAgPEF1dGhQcm92aWRlcj5cbiAgICAgIDxSb3V0ZVByb3ZpZGVyPlxuICAgICAgICA8TGluayB0bz1cIiMvY2hhbmdlcGFzc3dvcmRcIj5DaGFuZ2VQYXNzd29yZDwvTGluaz5cbiAgICAgICAgPExpbmsgdG89XCIjL2xvZ2luXCI+TG9naW48L0xpbms+XG4gICAgICAgIDxMaW5rIHRvPVwiIy9zaWdudXBcIj5TaWdudXA8L0xpbms+XG4gICAgICAgIDxMaW5rIHRvPVwiIy9mb3Jnb3RwYXNzd29yZFwiPkZvcmdvdFBhc3N3b3JkPC9MaW5rPlxuICAgICAgICA8Um91dGUgcGF0aD1cIiMvY2hhbmdlcGFzc3dvcmRcIj5cbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIjL2xvZ2luXCI+XG4gICAgICAgICAgPExvZ2luIC8+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiIy9zaWdudXBcIj5cbiAgICAgICAgICA8U2lnbnVwIC8+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiIy9mb3Jnb3RwYXNzd29yZFwiPlxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAvPlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxuICAgIDwvQXV0aFByb3ZpZGVyPlxuICA8L0FwcFByb3ZpZGVyPixcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpXG4pO1xuIl0sIm5hbWVzIjpbIkVNUFRZX09CSiIsIkVNUFRZX0FSUiIsIklTX05PTl9ESU1FTlNJT05BTCIsIm4iLCJ0IiwicyIsInIiLCJlIiwidSIsImgiLCJsZW5ndGgiLCJwIiwiYSIsIk9iamVjdCIsImFzc2lnbiIsImFwcGx5IiwicHVzaCIsIk1hcCIsImdldCIsInNldCIsInJlcGxhY2UiLCJsIiwiYXJndW1lbnRzIiwibSIsImJpbmQiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50Q29tcG9uZW50IiwicHJldlJhZiIsImFmdGVyUGFpbnRFZmZlY3RzIiwib2xkQmVmb3JlUmVuZGVyIiwib3B0aW9ucyIsIl9yZW5kZXIiLCJvbGRBZnRlckRpZmYiLCJkaWZmZWQiLCJvbGRDb21taXQiLCJfY29tbWl0Iiwib2xkQmVmb3JlVW5tb3VudCIsInVubW91bnQiLCJnZXRIb29rU3RhdGUiLCJpbmRleCIsIl9ob29rIiwiaG9va3MiLCJfX2hvb2tzIiwiX2xpc3QiLCJfcGVuZGluZ0VmZmVjdHMiLCJ1c2VTdGF0ZSIsImluaXRpYWxTdGF0ZSIsInVzZVJlZHVjZXIiLCJpbnZva2VPclJldHVybiIsInJlZHVjZXIiLCJpbml0IiwiaG9va1N0YXRlIiwiX2NvbXBvbmVudCIsIl92YWx1ZSIsInVuZGVmaW5lZCIsIm5leHRWYWx1ZSIsImFjdGlvbiIsInNldFN0YXRlIiwidXNlRWZmZWN0IiwiY2FsbGJhY2siLCJhcmdzIiwic3RhdGUiLCJhcmdzQ2hhbmdlZCIsIl9hcmdzIiwidXNlTWVtbyIsImZhY3RvcnkiLCJfZmFjdG9yeSIsInVzZUNvbnRleHQiLCJjb250ZXh0IiwicHJvdmlkZXIiLCJfaWQiLCJfZGVmYXVsdFZhbHVlIiwic3ViIiwicHJvcHMiLCJ2YWx1ZSIsImZsdXNoQWZ0ZXJQYWludEVmZmVjdHMiLCJzb21lIiwiY29tcG9uZW50IiwiX3BhcmVudERvbSIsImZvckVhY2giLCJpbnZva2VDbGVhbnVwIiwiaW52b2tlRWZmZWN0IiwiX2NhdGNoRXJyb3IiLCJfdm5vZGUiLCJob29rIiwiX2NsZWFudXAiLCJyZXN1bHQiLCJvbGRBcmdzIiwibmV3QXJncyIsImFyZyIsImYiLCJ2bm9kZSIsImMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyYWYiLCJkb25lIiwiY2xlYXJUaW1lb3V0IiwidGltZW91dCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwic2V0VGltZW91dCIsIndpbmRvdyIsImNvbW1pdFF1ZXVlIiwiX3JlbmRlckNhbGxiYWNrcyIsImZpbHRlciIsImNiIiwiQXBwQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJjb3VudFJlZHVjZXIiLCJ0eXBlIiwiY291bnQiLCJFcnJvciIsIkFwcFByb3ZpZGVyIiwiZGlzcGF0Y2giLCJpbml0U3RhdGUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImVycm9yIiwidXNlcm5hbWUiLCJsb2FkaW5nIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImlzTG9nZ2VkSW4iLCJpc1Bhc3N3b3JkQ2hhbmdlZCIsImF1dGhSZWR1Y2VyIiwiYWN0aW9uVHlwZXMiLCJWQUxVRV9DSEFOR0VEIiwicGF5bG9hZCIsInByb3BOYW1lIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJzdWNjZXNzTWVzc2FnZSIsIkxPR0lOX0ZBSUxFRCIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJSb3V0ZUNvbnRleHQiLCJSb3V0ZSIsImNoaWxkcmVuIiwicGF0aCIsInVzZVJvdXRlQ29udGV4dCIsImxvY2F0aW9uIiwiaGFzaCIsIkxpbmsiLCJ0byIsImhhbmRsZUNsaWNrIiwicHJldmVudERlZmF1bHQiLCJSb3V0ZVByb3ZpZGVyIiwidXJsIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInByZXYiLCJoYW5kbGVQb3BTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3R5bGVJbmplY3QiLCJjc3MiLCJyZWYiLCJpbnNlcnRBdCIsImRvY3VtZW50IiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwic3R5bGUiLCJjcmVhdGVFbGVtZW50IiwiZmlyc3RDaGlsZCIsImluc2VydEJlZm9yZSIsImFwcGVuZENoaWxkIiwic3R5bGVTaGVldCIsImNzc1RleHQiLCJjcmVhdGVUZXh0Tm9kZSIsIlZBTElEIiwiSU5WQUxJRCIsIklOQUNUSVZFIiwiRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiIsIlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIlVTRVJOQU1FX1RBS0VOIiwiUkVHSVNURVJFRF9FTUFJTCIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJJTlZBTElEX1BBU1NXT1JEIiwiSU5WQUxJRF9FTUFJTCIsIklOVkFMSURfVVNFUk5BTUUiLCJJTlZBTElEX0VNUFRZX1NUUklORyIsIklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwiLCJQQVNTV09SRFNfRE9fTk9UX01BVENIIiwicGFzc3dvcmRSZWdleCIsImVtYWlsUmVnZXgiLCJ1c2VybmFtZVJlZ2V4IiwidmFsaWRhdGVFbWFpbENvbnN0cmFpbnQiLCJlbWFpbENvbnN0cmFpbnQiLCJSZWdFeHAiLCJ0ZXN0IiwidmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0aW9uVHlwZXMiLCJ2YWxpZGF0aW9uU3RhdGUiLCJtZXNzYWdlIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwiaXNDbGllbnRWYWxpZGF0aW9uVHlwZSIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSIsInZhbGlkYXRlRW1wdHlTdHJpbmciLCJ2YWxpZGF0ZVBhc3N3b3JkTWF0Y2giLCJhdXRoIiwiSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUiLCJSRVNFVF9WQUxJREFUSU9OX1NUQVRFIiwiSU5QVVRfQkxVUlJFRCIsIklOUFVUX0ZPQ1VTRUQiLCJTRVJWRVJfVkFMSURBVElPTiIsIkNMSUVOVF9WQUxJREFUSU9OIiwiSU5DX0lOUFVUX0NPVVROIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwidmFsaWRhdGlvbiIsImNvbnN0VmFsVHlwZXMiLCJ2YWxpZGF0aW9ucyIsInJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUiLCJzZXJ2ZXJWYWxpZGF0aW9uIiwiaHR0cFN0YXR1cyIsInZhbGlkYXRpb25TdGF0ZXMiLCJpbWciLCJJY29uU3RhdGUiLCJvcGVuIiwib3Blbkljb24iLCJjbG9zZUljb24iLCJFeWVJY29uIiwib25DbGljayIsInRvZ2dsZSIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJtYXJnaW4iLCJmb3JtUmVkdWNlciIsIm5leHRTdGF0ZSIsImZvcm1TdGF0ZSIsIkZvcm1Db250ZXh0IiwidXNlRm9ybUNvbnRleHQiLCJGb3JtUHJvdmlkZXIiLCJWYWxpZGl0eUljb24iLCJ2YWxpZCIsInN0YXRlQ29sb3IiLCJmbGV4IiwiY29sb3IiLCJsaW5lSGVpZ2h0Iiwid2lkdGgiLCJ0ZXh0QWxpZ24iLCJpbnB1dCIsImJvcmRlciIsInBhZGRpbmciLCJib3JkZXJSYWRpdXMiLCJyb290IiwiZmxleERpcmVjdGlvbiIsImJhY2tncm91bmRDb2xvciIsIm1hcmdpbkJvdHRvbSIsImlucHV0Q29udGFpbmVyIiwicGFkZGluZ0xlZnQiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwibmFtZSIsIm9uQ2hhbmdlIiwiaWQiLCJpbnB1dFZhbGlkYXRpb24iLCJzZXRJbnB1dFZhbGlkYXRpb24iLCJpbnB1dFR5cGUiLCJzZXRJbnB1dFR5cGUiLCJib3JkZXJDb2xvciIsInNldEJvcmRlckNvbG9yIiwiaGFuZGxlRm9jdXMiLCJ2YWxpZGF0aW9uTmFtZSIsImZvcm0iLCJhY3Rpb25zIiwiaGFuZGxlQmx1ciIsInRvZ2dsZUV5ZSIsIm1hcCIsIkJ1dHRvbiIsInRpdGxlIiwiZGlzYWJsZWQiLCJoZWlnaHQiLCJGb3JtIiwiZm9ybVRpdGxlIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJ2YWx1ZUNoYW5nZWQiLCJsb2dpbiIsInJlc3BvbnNlIiwiZmV0Y2giLCJwcm9jZXNzIiwiZW52IiwiUkVBQ1RfQVBQX1hBRl9TRVJWRVJfVVJMIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwibWV0aG9kIiwianNvbiIsImVycm9ycyIsInNpZ251cCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiQ29udGVudFR5cGUiLCJBY2NlcHQiLCJjaGFuZ2VQYXNzd29yZCIsImZvcmdvdFBhc3N3b3JkIiwiZXJyIiwiTG9naW4iLCJoYW5kbGVDaGFuZ2UiLCJ0YXJnZXQiLCJoYW5kbGVMb2dpbiIsIlNpZ251cCIsImhhbmRsZVNpZ251cCIsIlJlcXVlc3RQYXNzQ2hhbmdlIiwiaGFuZGxlRm9yZ290UGFzc3dvcmQiLCJDaGFuZ2VQYXNzd29yZCIsIlVSTCIsImhyZWYiLCJzZWFyY2hQYXJhbXMiLCJoYW5kbGVDaGFuZ2VQYXNzIiwicmVuZGVyIiwiRm9yZ290UGFzc3dvcmQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6IktBQU87QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxJQUFNQSxDQUFBQSxHQUFZLEVBQWxCO0FBQUEsSUFDTUMsQ0FBQUEsR0FBWSxFQURsQjtBQUFBLElBRU1DLENBQUFBLEdBQXFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZsQyxJQUFJQyxHQUFDLEdBQUMsVUFBU0MsQ0FBVCxFQUFXQyxDQUFYLEVBQWFDLENBQWIsRUFBZUMsQ0FBZixFQUFpQjtBQUFDLE1BQUlDLENBQUo7QUFBTUgsRUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFLLENBQUw7O0FBQU8sT0FBSSxJQUFJSSxDQUFDLEdBQUMsQ0FBVixFQUFZQSxDQUFDLEdBQUNKLENBQUMsQ0FBQ0ssTUFBaEIsRUFBdUJELENBQUMsRUFBeEIsRUFB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
