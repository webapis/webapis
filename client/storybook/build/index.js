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
  if (arguments.length > 3)
    for (u = [u], i = 3; i < arguments.length; i++) u.push(t[i]);
  if (
    (null != u && (o.children = u),
    "function" == typeof n && null != n.defaultProps)
  )
    for (i in n.defaultProps) void 0 === o[i] && (o[i] = n.defaultProps[i]);
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
    __v: o,
  };
  return null == o && (r.__v = r), n.vnode && n.vnode(r), r;
}
function d(n) {
  return n.children;
}
function m(n, l) {
  (this.props = n), (this.context = l);
}
function w(n, l) {
  if (null == l) return n.__ ? w(n.__, n.__.__k.indexOf(n) + 1) : null;
  for (var u; l < n.__k.length; l++)
    if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
  return "function" == typeof n.type ? w(n) : null;
}
function g(n) {
  var l, u;
  if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)
      if (null != (u = n.__k[l]) && null != u.__e) {
        n.__e = n.__c.base = u.__e;
        break;
      }
    return g(n);
  }
}
function k(l) {
  ((!l.__d && (l.__d = !0) && u.push(l) && !i++) ||
    o !== n.debounceRendering) &&
    ((o = n.debounceRendering) || t)(_);
}
function _() {
  for (var n; (i = u.length); )
    (n = u.sort(function (n, l) {
      return n.__v.__b - l.__v.__b;
    })),
      (u = []),
      n.some(function (n) {
        var l, u, i, t, o, r, f;
        n.__d &&
          ((r = (o = (l = n).__v).__e),
          (f = l.__P) &&
            ((u = []),
            ((i = a({}, o)).__v = i),
            (t = A(
              f,
              o,
              i,
              l.__n,
              void 0 !== f.ownerSVGElement,
              null,
              u,
              null == r ? w(o) : r
            )),
            T(u, o),
            t != r && g(o)));
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
    k = (u && u.__k) || c,
    _ = k.length;
  if (
    (f == e && (f = null != o ? o[0] : _ ? w(u, 0) : null),
    (a = 0),
    (l.__k = x(l.__k, function (u) {
      if (null != u) {
        if (
          ((u.__ = l),
          (u.__b = l.__b + 1),
          null === (p = k[a]) || (p && u.key == p.key && u.type === p.type))
        )
          k[a] = void 0;
        else
          for (h = 0; h < _; h++) {
            if ((p = k[h]) && u.key == p.key && u.type === p.type) {
              k[h] = void 0;
              break;
            }
            p = null;
          }
        if (
          ((y = A(n, u, (p = p || e), i, t, o, r, f, s)),
          (h = u.ref) &&
            p.ref != h &&
            (g || (g = []),
            p.ref && g.push(p.ref, null, u),
            g.push(h, u.__c || y, u)),
          null != y)
        ) {
          var c;
          if ((null == m && (m = y), void 0 !== u.__d))
            (c = u.__d), (u.__d = void 0);
          else if (o == p || y != f || null == y.parentNode) {
            n: if (null == f || f.parentNode !== n)
              n.appendChild(y), (c = null);
            else {
              for (d = f, h = 0; (d = d.nextSibling) && h < _; h += 2)
                if (d == y) break n;
              n.insertBefore(y, f), (c = f);
            }
            "option" == l.type && (n.value = "");
          }
          (f = void 0 !== c ? c : y.nextSibling),
            "function" == typeof l.type && (l.__d = f);
        } else f && p.__e == f && f.parentNode != n && (f = w(p));
      }
      return a++, u;
    })),
    (l.__e = m),
    null != o && "function" != typeof l.type)
  )
    for (a = o.length; a--; ) null != o[a] && v(o[a]);
  for (a = _; a--; ) null != k[a] && D(k[a], k[a]);
  if (g) for (a = 0; a < g.length; a++) j(g[a], g[++a], g[++a]);
}
function x(n, l, u) {
  if ((null == u && (u = []), null == n || "boolean" == typeof n))
    l && u.push(l(null));
  else if (Array.isArray(n)) for (var i = 0; i < n.length; i++) x(n[i], l, u);
  else
    u.push(
      l
        ? l(
            "string" == typeof n || "number" == typeof n
              ? p(null, n, null, null, n)
              : null != n.__e || null != n.__c
              ? p(n.type, n.props, n.key, null, n.__v)
              : n
          )
        : n
    );
  return u;
}
function P(n, l, u, i, t) {
  var o;
  for (o in u)
    "children" === o || "key" === o || o in l || N(n, o, null, u[o], i);
  for (o in l)
    (t && "function" != typeof l[o]) ||
      "children" === o ||
      "key" === o ||
      "value" === o ||
      "checked" === o ||
      u[o] === l[o] ||
      N(n, o, l[o], u[o], i);
}
function C(n, l, u) {
  "-" === l[0]
    ? n.setProperty(l, u)
    : (n[l] =
        "number" == typeof u && !1 === s.test(l)
          ? u + "px"
          : null == u
          ? ""
          : u);
}
function N(n, l, u, i, t) {
  var o, r, f, e, c;
  if (
    (t
      ? "className" === l && (l = "class")
      : "class" === l && (l = "className"),
    "style" === l)
  )
    if (((o = n.style), "string" == typeof u)) o.cssText = u;
    else {
      if (("string" == typeof i && ((o.cssText = ""), (i = null)), i))
        for (e in i) (u && e in u) || C(o, e, "");
      if (u) for (c in u) (i && u[c] === i[c]) || C(o, c, u[c]);
    }
  else
    "o" === l[0] && "n" === l[1]
      ? ((r = l !== (l = l.replace(/Capture$/, ""))),
        (f = l.toLowerCase()),
        (l = (f in n ? f : l).slice(2)),
        u
          ? (i || n.addEventListener(l, z, r), ((n.l || (n.l = {}))[l] = u))
          : n.removeEventListener(l, z, r))
      : "list" !== l &&
        "tagName" !== l &&
        "form" !== l &&
        "type" !== l &&
        "size" !== l &&
        !t &&
        l in n
      ? (n[l] = null == u ? "" : u)
      : "function" != typeof u &&
        "dangerouslySetInnerHTML" !== l &&
        (l !== (l = l.replace(/^xlink:?/, ""))
          ? null == u || !1 === u
            ? n.removeAttributeNS(
                "http://www.w3.org/1999/xlink",
                l.toLowerCase()
              )
            : n.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                l.toLowerCase(),
                u
              )
          : null == u || (!1 === u && !/^ar/.test(l))
          ? n.removeAttribute(l)
          : n.setAttribute(l, u));
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
      if (
        ((k = u.props),
        (_ = (s = P.contextType) && t[s.__c]),
        (x = s ? (_ ? _.props.value : s.__) : t),
        i.__c
          ? (g = (v = u.__c = i.__c).__ = v.__E)
          : ("prototype" in P && P.prototype.render
              ? (u.__c = v = new P(k, x))
              : ((u.__c = v = new m(k, x)),
                (v.constructor = P),
                (v.render = E)),
            _ && _.sub(v),
            (v.props = k),
            v.state || (v.state = {}),
            (v.context = x),
            (v.__n = t),
            (h = v.__d = !0),
            (v.__h = [])),
        null == v.__s && (v.__s = v.state),
        null != P.getDerivedStateFromProps &&
          (v.__s == v.state && (v.__s = a({}, v.__s)),
          a(v.__s, P.getDerivedStateFromProps(k, v.__s))),
        (p = v.props),
        (y = v.state),
        h)
      )
        null == P.getDerivedStateFromProps &&
          null != v.componentWillMount &&
          v.componentWillMount(),
          null != v.componentDidMount && v.__h.push(v.componentDidMount);
      else {
        if (
          (null == P.getDerivedStateFromProps &&
            k !== p &&
            null != v.componentWillReceiveProps &&
            v.componentWillReceiveProps(k, x),
          (!v.__e &&
            null != v.shouldComponentUpdate &&
            !1 === v.shouldComponentUpdate(k, v.__s, x)) ||
            (u.__v === i.__v && !v.__))
        ) {
          for (
            v.props = k,
              v.state = v.__s,
              u.__v !== i.__v && (v.__d = !1),
              v.__v = u,
              u.__e = i.__e,
              u.__k = i.__k,
              v.__h.length && f.push(v),
              s = 0;
            s < u.__k.length;
            s++
          )
            u.__k[s] && (u.__k[s].__ = u);
          break n;
        }
        null != v.componentWillUpdate && v.componentWillUpdate(k, v.__s, x),
          null != v.componentDidUpdate &&
            v.__h.push(function () {
              v.componentDidUpdate(p, y, w);
            });
      }
      (v.context = x),
        (v.props = k),
        (v.state = v.__s),
        (s = n.__r) && s(u),
        (v.__d = !1),
        (v.__v = u),
        (v.__P = l),
        (s = v.render(v.props, v.state, v.context)),
        (u.__k =
          null != s && s.type == d && null == s.key
            ? s.props.children
            : Array.isArray(s)
            ? s
            : [s]),
        null != v.getChildContext && (t = a(a({}, t), v.getChildContext())),
        h ||
          null == v.getSnapshotBeforeUpdate ||
          (w = v.getSnapshotBeforeUpdate(p, y)),
        b(l, u, i, t, o, r, f, e, c),
        (v.base = u.__e),
        v.__h.length && f.push(v),
        g && (v.__E = v.__ = null),
        (v.__e = !1);
    } else
      null == r && u.__v === i.__v
        ? ((u.__k = i.__k), (u.__e = i.__e))
        : (u.__e = $(i.__e, u, i, t, o, r, f, c));
    (s = n.diffed) && s(u);
  } catch (l) {
    (u.__v = null), n.__e(l, u, i);
  }
  return u.__e;
}
function T(l, u) {
  n.__c && n.__c(u, l),
    l.some(function (u) {
      try {
        (l = u.__h),
          (u.__h = []),
          l.some(function (n) {
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
  if (((t = "svg" === l.type || t), null != o))
    for (s = 0; s < o.length; s++)
      if (
        null != (a = o[s]) &&
        ((null === l.type ? 3 === a.nodeType : a.localName === l.type) ||
          n == a)
      ) {
        (n = a), (o[s] = null);
        break;
      }
  if (null == n) {
    if (null === l.type) return document.createTextNode(d);
    (n = t
      ? document.createElementNS("http://www.w3.org/2000/svg", l.type)
      : document.createElement(l.type, d.is && { is: d.is })),
      (o = null),
      (f = !1);
  }
  if (null === l.type) y !== d && n.data != d && (n.data = d);
  else {
    if (
      (null != o && (o = c.slice.call(n.childNodes)),
      (v = (y = u.props || e).dangerouslySetInnerHTML),
      (h = d.dangerouslySetInnerHTML),
      !f)
    ) {
      if (y === e)
        for (y = {}, p = 0; p < n.attributes.length; p++)
          y[n.attributes[p].name] = n.attributes[p].value;
      (h || v) &&
        ((h && v && h.__html == v.__html) ||
          (n.innerHTML = (h && h.__html) || ""));
    }
    P(n, d, y, t, f),
      (l.__k = l.props.children),
      h || b(n, l, u, i, "foreignObject" !== l.type && t, o, r, e, f),
      f ||
        ("value" in d &&
          void 0 !== d.value &&
          d.value !== n.value &&
          (n.value = null == d.value ? "" : d.value),
        "checked" in d &&
          void 0 !== d.checked &&
          d.checked !== n.checked &&
          (n.checked = d.checked));
  }
  return n;
}
function j(l, u, i) {
  try {
    "function" == typeof l ? l(u) : (l.current = u);
  } catch (l) {
    n.__e(l, i);
  }
}
function D(l, u, i) {
  var t, o, r;
  if (
    (n.unmount && n.unmount(l),
    (t = l.ref) && ((t.current && t.current !== l.__e) || j(t, null, u)),
    i || "function" == typeof l.type || (i = null != (o = l.__e)),
    (l.__e = l.__d = void 0),
    null != (t = l.__c))
  ) {
    if (t.componentWillUnmount)
      try {
        t.componentWillUnmount();
      } catch (l) {
        n.__e(l, u);
      }
    t.base = t.__P = null;
  }
  if ((t = l.__k)) for (r = 0; r < t.length; r++) t[r] && D(t[r], u, i);
  null != o && v(o);
}
function E(n, l, u) {
  return this.constructor(n, u);
}
function H(l, u, i) {
  var t, o, f;
  n.__ && n.__(l, u),
    (o = (t = i === r) ? null : (i && i.__k) || u.__k),
    (l = h(d, null, [l])),
    (f = []),
    A(
      u,
      ((t ? u : i || u).__k = l),
      o || e,
      e,
      void 0 !== u.ownerSVGElement,
      i && !t ? [i] : o ? null : c.slice.call(u.childNodes),
      f,
      i || e,
      t
    ),
    T(f, l);
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
        return (
          this.getChildContext ||
            ((i = []),
            (this.getChildContext = function () {
              return (l[u.__c] = t), l;
            }),
            (this.shouldComponentUpdate = function (n) {
              t.props.value !== n.value &&
                i.some(function (l) {
                  (l.context = n.value), k(l);
                });
            }),
            (this.sub = function (n) {
              i.push(n);
              var l = n.componentWillUnmount;
              n.componentWillUnmount = function () {
                i.splice(i.indexOf(n), 1), l && l.call(n);
              };
            })),
          n.children
        );
      },
    };
  return (u.Consumer.contextType = u), u;
}
(n = {
  __e: function (n, l) {
    for (var u, i; (l = l.__); )
      if ((u = l.__c) && !u.__)
        try {
          if (
            (u.constructor &&
              null != u.constructor.getDerivedStateFromError &&
              ((i = !0), u.setState(u.constructor.getDerivedStateFromError(n))),
            null != u.componentDidCatch && ((i = !0), u.componentDidCatch(n)),
            i)
          )
            return k((u.__E = u));
        } catch (l) {
          n = l;
        }
    throw n;
  },
}),
  (m.prototype.setState = function (n, l) {
    var u;
    (u = this.__s !== this.state ? this.__s : (this.__s = a({}, this.state))),
      "function" == typeof n && (n = n(u, this.props)),
      n && a(u, n),
      null != n && this.__v && (l && this.__h.push(l), k(this));
  }),
  (m.prototype.forceUpdate = function (n) {
    this.__v && ((this.__e = !0), n && this.__h.push(n), k(this));
  }),
  (m.prototype.render = d),
  (u = []),
  (i = 0),
  (t =
    "function" == typeof Promise
      ? Promise.prototype.then.bind(Promise.resolve())
      : setTimeout),
  (r = e),
  (f = 0);

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
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

var t$1,
  r$1,
  u$1,
  i$1 = [],
  o$1 = n.__r,
  f$1 = n.diffed,
  c$1 = n.__c,
  e$1 = n.unmount;
function a$1(t) {
  n.__h && n.__h(r$1);
  var u = r$1.__H || (r$1.__H = { __: [], __h: [] });
  return t >= u.__.length && u.__.push({}), u.__[t];
}
function v$1(n) {
  return m$1(x$1, n);
}
function m$1(n, u, i) {
  var o = a$1(t$1++);
  return (
    o.__c ||
      ((o.__c = r$1),
      (o.__ = [
        i ? i(u) : x$1(void 0, u),
        function (t) {
          var r = n(o.__[0], t);
          o.__[0] !== r && ((o.__[0] = r), o.__c.setState({}));
        },
      ])),
    o.__
  );
}
function p$1(n, u) {
  var i = a$1(t$1++);
  q(i.__H, u) && ((i.__ = n), (i.__H = u), r$1.__H.__h.push(i));
}
function y(n) {
  return s$1(function () {
    return { current: n };
  }, []);
}
function s$1(n, r) {
  var u = a$1(t$1++);
  return q(u.__H, r) ? ((u.__H = r), (u.__h = n), (u.__ = n())) : u.__;
}
function T$1(n) {
  var u = r$1.context[n.__c];
  if (!u) return n.__;
  var i = a$1(t$1++);
  return null == i.__ && ((i.__ = !0), u.sub(r$1)), u.props.value;
}
function F() {
  i$1.some(function (t) {
    if (t.__P)
      try {
        t.__H.__h.forEach(_$1), t.__H.__h.forEach(g$1), (t.__H.__h = []);
      } catch (r) {
        return (t.__H.__h = []), n.__e(r, t.__v), !0;
      }
  }),
    (i$1 = []);
}
function _$1(n) {
  n.t && n.t();
}
function g$1(n) {
  var t = n.__();
  "function" == typeof t && (n.t = t);
}
function q(n, t) {
  return (
    !n ||
    t.some(function (t, r) {
      return t !== n[r];
    })
  );
}
function x$1(n, t) {
  return "function" == typeof t ? t(n) : t;
}
(n.__r = function (n) {
  o$1 && o$1(n),
    (t$1 = 0),
    (r$1 = n.__c).__H &&
      (r$1.__H.__h.forEach(_$1), r$1.__H.__h.forEach(g$1), (r$1.__H.__h = []));
}),
  (n.diffed = function (t) {
    f$1 && f$1(t);
    var r = t.__c;
    if (r) {
      var o = r.__H;
      o &&
        o.__h.length &&
        ((1 !== i$1.push(r) && u$1 === n.requestAnimationFrame) ||
          (
            (u$1 = n.requestAnimationFrame) ||
            function (n) {
              var t,
                r = function () {
                  clearTimeout(u), cancelAnimationFrame(t), setTimeout(n);
                },
                u = setTimeout(r, 100);
              "undefined" != typeof window && (t = requestAnimationFrame(r));
            }
          )(F));
    }
  }),
  (n.__c = function (t, r) {
    r.some(function (t) {
      try {
        t.__h.forEach(_$1),
          (t.__h = t.__h.filter(function (n) {
            return !n.__ || g$1(n);
          }));
      } catch (u) {
        r.some(function (n) {
          n.__h && (n.__h = []);
        }),
          (r = []),
          n.__e(u, t.__v);
      }
    }),
      c$1 && c$1(t, r);
  }),
  (n.unmount = function (t) {
    e$1 && e$1(t);
    var r = t.__c;
    if (r) {
      var u = r.__H;
      if (u)
        try {
          u.__.forEach(function (n) {
            return n.t && n.t();
          });
        } catch (t) {
          n.__e(t, r.__v);
        }
    }
  });

const actionTypes = {
  APP_ROUTE_CHANGED: "APP_ROUTE_CHANGED", //  FEATURE_ROUTE_CHANGED:'FEATURE_ROUTE_CHANGED'
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.APP_ROUTE_CHANGED:
      return {
        ...state,
        route: action.route,
        featureRoute: action.featureRoute,
      };

    default:
      return state;
  }
}

const AppRouteContext = M();

function useAppRouteContext() {
  const context = T$1(AppRouteContext);

  if (!context) {
    throw new Error("useAppRouteContext must be used with AppRouteProvider");
  }

  return context;
}
function useAppRoute() {
  const [state, dispatch] = useAppRouteContext();
  const { name } = state;

  function onAppRoute({ route, featureRoute }) {
    if (name) {
      localStorage.setItem(
        name,
        JSON.stringify({
          route,
          featureRoute,
        })
      );
    }

    dispatch({
      type: actionTypes.APP_ROUTE_CHANGED,
      featureRoute,
      route,
    });
  }

  return {
    onAppRoute,
  };
}
function AppRoute(props) {
  const { children, path, paths } = props;
  const [state, dispatch] = useAppRouteContext();
  const { route } = state;

  if (path && route === path) {
    return children;
  } else if (paths && route === paths.find((p) => p === route)) {
    return children;
  }

  return null;
}
function AppRouteProvider(props) {
  const { initState } = props;
  const [state, dispatch] = m$1(reducer, initState);
  p$1(() => {
    if (state && state.name && localStorage.getItem(state.name)) {
      const { featureRoute, route } = JSON.parse(
        localStorage.getItem(state.name)
      );
      dispatch({
        type: actionTypes.APP_ROUTE_CHANGED,
        featureRoute,
        route,
      });
    }
  }, []);
  const value = s$1(() => [state, dispatch], [state]);
  return h(
    AppRouteContext.Provider,
    _extends(
      {
        value: value,
      },
      props
    )
  );
}

/* eslint-disable no-undef */
function AppProviders({ children }) {
  return h(
    AppRouteProvider, //
    {
      title: "Webcom",
      initState: {
        route: "/",
        featureRoute: "/hangouts",
        name: "storybook",
      },
    },
    children
  );
}

const style = {
  width: 15,
  height: 15,
  border: "white 2px solid",
};
function OnlineStatus({ readyState }) {
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
    style: { ...style, backgroundColor: "green" },
    "data-testid": "online",
  });
}
function IsOffline() {
  return h("div", {
    style: { ...style, backgroundColor: "red" },
    "data-testid": "offline",
  });
}
function Connecting() {
  return h("div", {
    style: { ...style, backgroundColor: "orange" },
    "data-testid": "connecting",
  });
}
function Closing() {
  return h("div", {
    style: { ...style, backgroundColor: "pink" },
    "data-testid": "closing",
  });
}

function TextInput(props) {
  const { label, name, type, isValid, message } = props;
  return h(
    "div",
    {
      className: "form-group p-0",
    },
    h(
      "label",
      {
        for: name,
      },
      label
    ),
    h(
      "input",
      _extends(
        {
          type: type,
          className: `form-control ${isValid && "is-valid"} ${
            !isValid && isValid !== undefined && "is-invalid"
          }`,
          id: name,
          "aria-describedby": name,
        },
        props
      )
    ),
    !isValid &&
      h(
        "small",
        {
          id: "emailHelp",
          className: `${!isValid && "invalid-feedback"}`,
          "data-testid": `message-${name}`,
        },
        message
      )
  );
}

function Button(props) {
  const { title, bg = "light", outline, size, loading = false, block } = props;
  return h(
    "button",
    _extends(
      {
        className: `${bg && !outline && `btn btn-${bg}`} ${
          outline && `btn btn-outline-${bg}`
        } ${size && `btn btn-${size}`} ${block && "btn-block"}`,
      },
      props,
      {
        disabled: loading,
      }
    ),
    loading &&
      h("span", {
        class: "spinner-border spinner-border-sm",
        role: "status",
        "aria-hidden": "true",
      }),
    loading ? "wait..." : title
  );
}

function Alert(props) {
  const { alert, message } = props;
  return h(
    "div",
    {
      className: `alert alert-${alert}`,
      role: "alert",
      "data-testid": "alert",
    },
    message,
    h(
      "button",
      {
        type: "button",
        class: "close",
        "data-dismiss": "alert",
        "aria-label": "Close",
      },
      h(
        "span",
        {
          "aria-hidden": "true",
        },
        "\xD7"
      )
    )
  );
}

function Login(props) {
  const {
    emailorusername,
    password,
    loading,
    onLogin,
    onFocus,
    onChange,
    validation,
    onForgotPassword,
    onBlur,
    error,
  } = props;
  return h(
    "div",
    {
      className: "col-md-4 border mx-auto rounded",
      style: {
        margin: 15,
        padding: 16,
      },
    },
    loading &&
      h(
        "div",
        {
          className: "progress",
          style: "height: 5px;",
        },
        h("div", {
          className: "progress-bar progress-bar-striped progress-bar-animated",
          role: "progressbar",
          "aria-valuenow": "100",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          style: "width: 100%",
        })
      ),
    error &&
      h(Alert, {
        alert: "danger",
        message: error.message,
      }),
    h(TextInput, {
      onFocus: onFocus,
      onBlur: onBlur,
      value: emailorusername,
      onChange: onChange,
      label: "Email or username",
      name: "emailorusername",
      type: "text",
      id: "emailorusername",
      "data-testid": "emailorusername",
      message: validation && validation["emailorusername"].message,
      isValid: validation && validation["emailorusername"].isValid,
    }),
    h(TextInput, {
      onFocus: onFocus,
      onBlur: onBlur,
      label: "Password",
      value: password,
      onChange: onChange,
      name: "password",
      type: "password",
      id: "password",
      "data-testid": "password",
      message: validation && validation["password"].message,
      isValid: validation && validation["password"].isValid,
    }),
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
        },
      },
      h(Button, {
        type: "button",
        id: "login-btn",
        "data-testid": "login-btn",
        onClick: onLogin,
        loading: loading,
        title: "Login",
        bg: "primary",
      }),
      h(Button, {
        onClick: onForgotPassword,
        id: "forgotpassword",
        "data-testid": "forgotpassword",
        outline: true,
        bg: "primary",
        title: "Forgot Password!",
      })
    )
  );
}

const validationSuccess = {
  emailorusername: {
    isValid: true,
    message: ".",
  },
  password: {
    isValid: true,
    message: ".",
  },
};
const validationError = {
  emailorusername: {
    isValid: false,
    message: "invalid credentials",
  },
  password: {
    isValid: false,
    message: "invalid credentials",
  },
};
function LoginStates() {
  return h(
    "div",
    {
      className: "container",
    },
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          " Login Validation Success"
        ),
        h(Login, {
          emailorusername: "testuser",
          password: "123456789",
          validation: validationSuccess,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Login Validation Error"
        ),
        h(Login, {
          emailorusername: "testuser",
          password: "123456789",
          validation: validationError,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Logging in"
        ),
        h(Login, {
          emailorusername: "testuser",
          password: "123456789",
          validation: validationSuccess,
          loading: true,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Logging Server error"
        ),
        h(Login, {
          emailorusername: "testuser",
          password: "123456789",
          validation: validationSuccess,
          error: {
            message: "Server is unavailable",
          },
        })
      )
    )
  );
}

function Signup(props) {
  const {
    username,
    password,
    email,
    loading,
    onSignup,
    onChange,
    validation,
    onBlur,
    onFocus,
    error,
  } = props;
  return h(
    "div",
    {
      className: "col-md-4 border mx-auto rounded",
      style: {
        margin: 15,
        padding: 16,
      },
    },
    loading &&
      h(
        "div",
        {
          className: "progress",
          style: "height: 5px;",
        },
        h("div", {
          className: "progress-bar progress-bar-striped progress-bar-animated",
          role: "progressbar",
          "aria-valuenow": "100",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          style: "width: 100%",
        })
      ),
    error &&
      h(Alert, {
        alert: "danger",
        message: error.message,
      }),
    h(TextInput, {
      onBlur: onBlur,
      onFocus: onFocus,
      label: "Username",
      value: username,
      onChange: onChange,
      type: "text",
      "data-testid": "username",
      name: "username",
      isValid: validation && validation["username"].isValid,
      message: validation && validation["username"].message,
    }),
    h(TextInput, {
      onBlur: onBlur,
      onFocus: onFocus,
      label: "Email",
      onChange: onChange,
      value: email,
      type: "email",
      "data-testid": "email",
      name: "email",
      isValid: validation && validation["email"].isValid,
      message: validation && validation["email"].message,
    }),
    h(TextInput, {
      onBlur: onBlur,
      onFocus: onFocus,
      label: "Password",
      onChange: onChange,
      value: password,
      type: "password",
      "data-testid": "password",
      name: "password",
      isValid: validation && validation["password"].isValid,
      message: validation && validation["password"].message,
    }),
    h(Button, {
      type: "button",
      onClick: onSignup,
      id: "signup-btn",
      "data-testid": "signup-btn",
      loading: loading,
      title: "Signup",
      bg: "primary",
    })
  );
}

const validationSuccess$1 = {
  username: {
    isValid: true,
    message: ".",
  },
  password: {
    isValid: true,
    message: ".",
  },
  email: {
    isValid: true,
    message: ".",
  },
};
const validationError$1 = {
  username: {
    isValid: false,
    message: "Username is not valid",
  },
  password: {
    isValid: false,
    message: "Pasword is not valid",
  },
  email: {
    isValid: false,
    message: "Email is not valid",
  },
};
function SignupStates() {
  return h(
    "div",
    {
      className: "container",
    },
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Signup Validation Success"
        ),
        h(Signup, {
          username: "testuser",
          email: "test@gmail.com",
          password: "123456789",
          validation: validationSuccess$1,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Signup Validation Error"
        ),
        h(Signup, {
          username: "testuser",
          email: "test@gmail.com",
          password: "123456789",
          validation: validationError$1,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Signing up"
        ),
        h(Signup, {
          username: "testuser",
          email: "test@gmail.com",
          password: "123456789",
          validation: validationSuccess$1,
          loading: true,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Signing Sever error"
        ),
        h(Signup, {
          username: "testuser",
          email: "test@gmail.com",
          password: "123456789",
          validation: validationSuccess$1,
          error: {
            message: "Server is unavailable",
          },
        })
      )
    )
  );
}

function ChangePassword(props) {
  const {
    password,
    confirm,
    validation,
    onChange,
    onPasswordChange,
    loading,
    error,
  } = props; // useEffect(() => {
  //   let url = new URL(window.location.href);
  //   var urltoken = url.searchParams.get('token');
  //   if (urltoken) {
  //     dispatch(actions.getTokenFromUrl({ token: urltoken }));
  //   }
  // }, []);

  return h(
    "div",
    {
      className: "col-md-4 border mx-auto rounded",
      style: {
        margin: 15,
        padding: 16,
      },
    },
    loading &&
      h(
        "div",
        {
          className: "progress",
          style: "height: 5px;",
        },
        h("div", {
          className: "progress-bar progress-bar-striped progress-bar-animated",
          role: "progressbar",
          "aria-valuenow": "100",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          style: "width: 100%",
        })
      ),
    error &&
      h(Alert, {
        alert: "danger",
        message: error.message,
      }),
    h(TextInput, {
      label: "Password",
      value: password,
      type: "password",
      id: "password",
      name: "password",
      onChange: onChange,
      isValid: validation && validation["password"].isValid,
      message: validation && validation["password"].message,
    }),
    h(TextInput, {
      label: "Confirm",
      value: confirm,
      type: "password",
      id: "confirm",
      name: "confirm",
      onChange: onChange,
      isValid: validation && validation["confirm"].isValid,
      message: validation && validation["confirm"].message,
    }),
    h(Button, {
      type: "button",
      loading: loading,
      "data-testid": "change-pass-btn",
      onClick: onPasswordChange,
      title: "Change",
      bg: "primary",
    })
  );
}

const validationSuccess$2 = {
  password: {
    isValid: true,
    message: ".",
  },
  confirm: {
    isValid: true,
    message: ".",
  },
};
const validationError$2 = {
  password: {
    isValid: false,
    message: "invalid password format",
  },
  confirm: {
    isValid: false,
    message: "invalid password format",
  },
};
function ChangePasswordStates() {
  return h(
    "div",
    {
      className: "container",
    },
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          " ChangePassword Validation Success"
        ),
        h(ChangePassword, {
          password: "123456789",
          confirm: "123456789",
          validation: validationSuccess$2,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "ChangePassword Validation Error"
        ),
        h(ChangePassword, {
          validation: validationError$2,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "ChangePassword in progress"
        ),
        h(ChangePassword, {
          password: "123456789",
          confirm: "123456789",
          validation: validationSuccess$2,
          loading: true,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "ChangePassword Server error"
        ),
        h(ChangePassword, {
          password: "123456789",
          confirm: "123456789",
          validation: validationSuccess$2,
          error: {
            message: "Server is unavailable",
          },
        })
      )
    )
  );
}

function RequestPassChange(props) {
  const {
    email,
    validation,
    onRequestPasswordChange,
    loading,
    onChange,
    error,
  } = props;
  return h(
    "div",
    {
      className: "col-md-4 border mx-auto rounded",
      style: {
        margin: 15,
        padding: 16,
      },
    },
    loading &&
      h(
        "div",
        {
          className: "progress",
          style: "height: 5px;",
        },
        h("div", {
          className: "progress-bar progress-bar-striped progress-bar-animated",
          role: "progressbar",
          "aria-valuenow": "100",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          style: "width: 100%",
        })
      ),
    error &&
      h(Alert, {
        alert: "danger",
        message: error.message,
      }),
    h(TextInput, {
      label: "Email",
      value: email,
      name: "email",
      onChange: onChange,
      type: "email",
      id: "email",
      isValid: validation && validation["email"].isValid,
      message: validation && validation["email"].message,
    }),
    h(Button, {
      type: "button",
      onClick: onRequestPasswordChange,
      "data-testid": "requestpasschange-btn",
      title: "Request password change",
      loading: loading,
      bg: "primary",
    })
  );
}

const validationSuccess$3 = {
  email: {
    isValid: true,
    message: ".",
  },
};
const validationError$3 = {
  email: {
    isValid: false,
    message: "Invalid email format",
  },
};
function ForfotPasswordState() {
  return h(
    "div",
    {
      className: "container",
    },
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          " ForgotPassword Validation Success"
        ),
        h(RequestPassChange, {
          email: "test@gmail.com",
          validation: validationSuccess$3,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "ForgotPassword Validation Error"
        ),
        h(RequestPassChange, {
          email: "testgmail.com",
          validation: validationError$3,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Request Password Change in progress"
        ),
        h(RequestPassChange, {
          email: "test@gmail.com",
          validation: validationSuccess$3,
          loading: true,
        })
      )
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "span",
        {
          className: "col-md-12",
        },
        h(
          "h5",
          {
            className: "text-center",
          },
          "Server error"
        ),
        h(RequestPassChange, {
          email: "test@gmail.com",
          validation: validationSuccess$3,
          error: {
            message: "Server is unavailable",
          },
        })
      )
    )
  );
}

function AuthDemoRoutes() {
  return [
    h(
      AppRoute,
      {
        path: "/login",
      },
      h(LoginStates, null)
    ),
    h(
      AppRoute,
      {
        path: "/signup",
      },
      h(SignupStates, null)
    ),
    h(
      AppRoute,
      {
        path: "/change-password",
      },
      h(ChangePasswordStates, null)
    ),
    h(
      AppRoute,
      {
        path: "/forgot-password",
      },
      h(ForfotPasswordState, null)
    ),
  ];
}

function ButtonDemo() {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        backgroundColor: "yellow",
      },
    },
    h(
      "div",
      null,
      h("h3", null, "Filled Buttons"),
      h(
        Button,
        {
          bg: "primary",
        },
        "Primary"
      ),
      h(
        Button,
        {
          bg: "secondary",
        },
        "Secondary"
      ),
      h(
        Button,
        {
          bg: "success",
        },
        "Success"
      ),
      h(
        Button,
        {
          bg: "danger",
        },
        "Danger"
      ),
      h(
        Button,
        {
          bg: "warning",
        },
        "Warning"
      ),
      h(
        Button,
        {
          bg: "info",
        },
        "Info"
      ),
      h(
        Button,
        {
          bg: "light",
        },
        "Light"
      ),
      h(
        Button,
        {
          bg: "dark",
        },
        "Dark"
      ),
      h(
        Button,
        {
          bg: "link",
        },
        "Link"
      )
    ),
    h(
      "div",
      null,
      h("h3", null, "Outlined Buttons"),
      h(Button, {
        bg: "primary",
        outline: true,
        title: "Primary",
      }),
      h(Button, {
        bg: "secondary",
        outline: true,
        title: "Secondary",
      }),
      h(Button, {
        bg: "success",
        outline: true,
        title: "Success",
      }),
      h(Button, {
        bg: "danger",
        outline: true,
        title: "Danger",
      }),
      h(Button, {
        bg: "warning",
        outline: true,
        title: "Warning",
      }),
      h(Button, {
        bg: "info",
        outline: true,
        title: "Info",
      }),
      h(Button, {
        bg: "light",
        outline: true,
        title: "Light",
      }),
      h(Button, {
        bg: "dark",
        outline: true,
        title: "Dark",
      }),
      h(Button, {
        bg: "link",
        outline: true,
        title: "Link",
      })
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
        },
      },
      h(
        "div",
        null,
        h("h3", null, "Small Buttons"),
        h(Button, {
          bg: "primary",
          size: "sm",
          title: "link",
        }),
        h(Button, {
          bg: "secondary",
          size: "sm",
          title: "Secondary",
        })
      ),
      h("h3", null, "Large Buttons"),
      h(Button, {
        bg: "primary",
        size: "lg",
        title: "Link",
      }),
      h(Button, {
        bg: "secondary",
        size: "lg",
        title: "Secondary",
      })
    ),
    h("div", null),
    h(
      "div",
      null,
      h("h3", null, " Disabled Buttons"),
      h(Button, {
        bg: "primary",
        disabled: true,
        title: "Link",
      }),
      h(Button, {
        bg: "secondary",
        disabled: true,
        title: "Secondary",
      })
    ),
    h(
      "div",
      null,
      h("h3", null, " Spinning Button"),
      h(Button, {
        bg: "primary",
        title: "Spinning",
        loading: true,
      })
    )
  );
}

function TextInputStates() {
  return h(
    "div",
    null,
    h(
      "div",
      null,
      h("h5", null, "Validation"),
      h(TextInput, {
        isValid: true,
      }),
      h(TextInput, {
        isValid: false,
      })
    )
  );
}

const img =
  "data:image/png;base64,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";

function Toast() {
  return h(
    "div",
    {
      className: "toast",
      role: "alert",
      "aria-live": "assertive",
      "aria-atomic": "true",
    },
    h(
      "div",
      {
        className: "toast-header",
      },
      h("img", {
        src: img,
        className: "rounded mr-2",
        alt: "...",
      }),
      h(
        "strong",
        {
          className: "mr-auto",
        },
        "Bootstrap"
      ),
      h(
        "small",
        {
          className: "text-muted",
        },
        "just now"
      ),
      h(
        "button",
        {
          type: "button",
          className: "ml-2 mb-1 close",
          "data-dismiss": "toast",
          "aria-label": "Close",
        },
        h(
          "span",
          {
            "aria-hidden": "true",
          },
          "\xD7"
        )
      )
    ),
    h(
      "div",
      {
        className: "toast-body",
      },
      "See? Just like this."
    )
  );
}

function ToastDemo() {
  return h(Toast, null);
}

function AlertDemo() {
  return h(Alert, {
    alert: "danger",
    message: "Server is temporarily unavailable",
  });
}

function ComponentsRoute() {
  return [
    h(
      AppRoute,
      {
        path: "/button",
      },
      h(ButtonDemo, null)
    ),
    h(
      AppRoute,
      {
        path: "/text-input",
      },
      h(TextInputStates, null)
    ),
    h(
      AppRoute,
      {
        path: "/toast",
      },
      h(ToastDemo, null)
    ),
    h(
      AppRoute,
      {
        path: "/alert",
      },
      h(AlertDemo, null)
    ),
  ];
}

function GearIcon(props) {
  const { color } = props;
  return h(
    "svg",
    _extends({}, props, {
      width: "1em",
      height: "1em",
      viewBox: "0 0 16 16",
      className: "bi bi-gear",
      fill: color,
      xmlns: "http://www.w3.org/2000/svg",
    }),
    h(
      "path",
      _extends({}, props, {
        "fill-rule": "evenodd",
        d:
          "M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z",
      })
    ),
    h(
      "path",
      _extends({}, props, {
        "fill-rule": "evenodd",
        d:
          "M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z",
      })
    )
  );
}

const styles = {
  root: {
    backgroundColor: "#eeeeee",
    height: "100%",
    position: "relative",
  },
};
function Layout({ children, style, id, hangout, onNavigation }) {
  return h(
    "div",
    {
      "data-testid": id,
      style: { ...styles.root, ...style },
    },
    children
  );
}

const style$1 = {
  checkbox: {
    marginRight: 8,
  },
  checkboxRoot: {
    display: "flex",
    alignItems: "center",
    padding: 16,
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68,
  },
};
function Block({ onCancel, onBlock, onReport }) {
  return h(
    Layout,
    {
      style: style$1.layout,
    },
    h(
      "div",
      {
        style: style$1.checkboxRoot,
      },
      h("input", {
        type: "checkbox",
        style: style$1.checkbox,
        onChange: onReport,
      }),
      h("label", null, "Report")
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "div",
        {
          className: "col",
        },
        h(Button, {
          "data-testid": "cancel-btn",
          onClick: onCancel,
          title: "Cancel",
          bg: "secondary",
          outline: true,
          block: true,
        })
      ),
      h(
        "div",
        {
          className: "col",
        },
        h(Button, {
          id: "BLOCK",
          onClick: onBlock,
          "data-testid": "block-btn",
          title: "Block",
          bg: "primary",
          block: true,
        })
      )
    )
  );
}

function Block$1({
  height = 24,
  width = 24,
  fill = "none",
  color = "black",
  onClick,
  id,
}) {
  return h(
    "svg",
    {
      height: height,
      viewBox: "0 0 24 24",
      width: width,
      onClick: onClick,
      id: id,
    },
    h("path", {
      d: "M0 0h24v24H0z",
      fill: fill,
      id: id,
    }),
    h("path", {
      id: id,
      fill: color,
      d:
        "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z",
    })
  );
}

function Center({ children, style }) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        ...style,
      },
    },
    children
  );
}

const style$2 = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68,
  },
};
function Blocked({ hangout, onUnblock, onClose }) {
  return h(
    Layout,
    {
      style: style$2.layout,
      id: "blocked-ui",
    },
    h(
      Center,
      {
        style: {
          flexDirection: "column",
          alignItems: "center",
        },
      },
      h(Block$1, {
        width: "60",
        height: "70",
        color: "red",
      }),
      h("b", null, hangout && hangout.username),
      " is blocked"
    ),
    h(
      "div",
      {
        className: "row",
      },
      h(
        "div",
        {
          className: "col",
        },
        h(Button, {
          "data-testid": "close-btn",
          onClick: onClose,
          title: "CLOSE",
          bg: "secondary",
          block: true,
          outline: true,
        })
      ),
      h(
        "div",
        {
          className: "col",
        },
        h(Button, {
          id: "UNBLOCK",
          onClick: onUnblock,
          "data-testid": "unblock-btn",
          title: "UNBLOCK",
          bg: "primary",
          block: true,
        })
      )
    )
  );
}

function Delete({ height = 24, width = 24, color = "black", fill = "none" }) {
  return h(
    "svg",
    {
      height: height,
      viewBox: "0 0 24 24",
      width: width,
    },
    h("path", {
      fill: color,
      d:
        "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    }),
    h("path", {
      d: "M0 0h24v24H0z",
      fill: fill,
    })
  );
}

function Archive({ height = 24, width = 24, color = "black", fill = "none" }) {
  return h(
    "svg",
    {
      height: 24,
      viewBox: "0 0 24 24",
      width: width,
    },
    h("path", {
      fill: color,
      d:
        "M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z",
    }),
    h("path", {
      d: "M0 0h24v24H0z",
      fill: fill,
    })
  );
}

const style$3 = {
  iconBtn: {
    display: "flex",
    alignItems: "center",
    margin: 8,
  },
  btn: {
    marginRight: 8,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "column",
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
};
function Configure({
  onBlock,
  onDelete,
  onArchive,
  onNotification,
  onConversationHistory,
  onNavigation,
  onOk,
}) {
  return h(
    Layout,
    {
      style: style$3.layout,
    },
    h(
      "div",
      null,
      h(Checkbox, {
        label: "Notifications",
        onChange: onNotification,
      }),
      h(Checkbox, {
        label: "Conversation History",
        onChange: onConversationHistory,
      })
    ),
    h("hr", null),
    h(
      "div",
      {
        style: style$3.btnContainer,
      },
      h(IconButton, {
        title: "Archive",
        Icon: Archive,
        onClick: onArchive,
      }),
      h(IconButton, {
        title: "Delete",
        Icon: Delete,
        onClick: onDelete,
      }),
      h(IconButton, {
        id: "bckui",
        title: "Block",
        Icon: Block$1,
        onClick: onNavigation,
      })
    ),
    h(
      "div",
      null,
      h(Button, {
        onClick: onOk,
        title: "OK",
        bg: "primary",
      })
    )
  );
}

function IconButton({ Icon, title, onClick, id }) {
  return h(
    "div",
    {
      style: style$3.iconBtn,
    },
    h(
      "button",
      {
        id: id,
        style: style$3.btn,
        onClick: onClick,
        "data-testid": `${id}-btn`,
      },
      h(Icon, {
        id: id,
      })
    ),
    h("div", null, title)
  );
}

function Checkbox({ label, onChange }) {
  return h(
    "div",
    {
      style: {
        margin: 8,
        marginTop: 8,
      },
    },
    h("input", {
      type: "checkbox",
      onChange: onChange,
    }),
    h("label", null, label)
  );
}

function useMediaQuery() {
  const [width, setWidth] = v$1(0);
  const [height, setHeight] = v$1(0);
  const [orientation, setOrientation] = v$1("");
  const [device, setDevice] = v$1("");

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
          setDevice("phone");
          break;

        case width <= 768:
        case width <= 992:
        case width <= 1200:
          setDevice("tablet");
          break;

        case width <= 2560:
          setDevice("laptop");
          break;

        case width > 2560:
          setDevice("desktop");
          break;

        default:
          setDevice("");
      }
    }
  }, [width]);
  p$1(() => {
    console.log("device", device);
  }, [device]);
  p$1(() => {
    handleViewportSize();
    handleScreenOrientation();
    window.addEventListener("orientationchange", handleScreenOrientation);
    window.addEventListener("resize", () => handleViewportSize);
    return () => {
      // window.removeEventListener();
      // window.removeEventListener(handleScreenOrientation);
    };
  }, []);
  return {
    width,
    height,
    orientation,
    device,
  };
}

const style$4 = {
  root: {
    borderColor: "#eeeeee",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 35,
    backgroundColor: "white",
  },
  username: {
    marginRight: 8,
  },
  log: {
    display: "flex",
    color: "#737373",
    fontSize: 10,
  },
  message: {},
}; //

function Message(props) {
  const { message } = props;
  const { float, username, timestamp } = message;
  const [days, setDays] = v$1(0);
  const [hours, setHours] = v$1(0);
  const [minutes, setMinutes] = v$1(0);
  const [seconds, setSeconds] = v$1(0);
  const { device } = useMediaQuery();

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
  return h(
    "div",
    {
      style: {
        width: "100%",
        marginBottom: 3,
      },
    },
    h(
      "div",
      {
        style: { ...style$4.root, float },
      },
      h(
        "div",
        {
          "data-testid": "message",
          style: style$4.message,
          className: `message-font-${device}-size`,
        },
        message && message.text
      ),
      h(
        "div",
        {
          style: style$4.log,
        },
        h(
          "div",
          {
            style: style$4.username,
          },
          username && username,
          ":"
        ),
        h(
          "div",
          null,
          minutes === 0 && h("div", null, "Now"),
          hours === 0 &&
            minutes > 0 &&
            h("div", null, minutes, " minutes ago "),
          hours > 0 &&
            days === 0 &&
            h("div", null, hours, " hours ", minutes, " minutes ago", " "),
          days <= 10 && days > 1 && h("div", null, days, " days ago")
        )
      )
    )
  );
}

function MessageEditor({
  loading,
  messageText,
  onMessageText,
  onMessage,
  hangout,
}) {
  return h(
    "div",
    null,
    h(
      "div",
      {
        className: "input-group mb-3",
      },
      h("input", {
        disabled: hangout && hangout.state === "BLOCKED",
        type: "text",
        class: "form-control",
        "aria-label": "Recipient's username",
        "aria-describedby": "button-addon2",
        onChange: onMessageText,
        "data-testid": "message-input",
        value: messageText,
      }),
      h(
        "div",
        {
          className: "input-group-append",
        },
        h(
          "button",
          {
            className: "btn btn-outline-secondary",
            type: "button",
            loading: loading,
            disabled: hangout && hangout.state === "BLOCKED",
            id: "MESSAGE",
            onClick: onMessage,
            "data-testid": "send-btn",
          },
          "Send"
        )
      )
    )
  );
}

const style$5 = {
  color: "red",
  float: "right",
  width: "100%",
  fontSize: 16,
  textAlign: "end",
};
function BlockerMessage({ message }) {
  return h(
    "div",
    {
      style: style$5,
      "data-testid": "blocker-message",
    },
    message.text
  );
}

const style$6 = {
  color: "red",
  float: "right",
  width: "100%",
  fontSize: 16,
  textAlign: "end",
};
function BlockedMessage({ message, onNavigation }) {
  function handleNavigation(e) {
    e.preventDefault();
    onNavigation(e);
  }

  return h(
    "div",
    {
      style: style$6,
      "data-testid": "blocked-message",
    },
    message.text,
    h(
      "a",
      {
        id: "UNBLOCK",
        "data-testid": "seemore-btn",
        href: "/",
        onClick: handleNavigation,
      },
      "see more"
    )
  );
}

const styles$1 = {
  messageContainer: {
    // width: '100%',
    boxSizing: "border-box",
    padding: 3,
    //  backgroundColor: 'orange',
    flex: 3,
    overflowY: "auto",
    overflowX: "hidden",
  },
};
function Messages({
  messages,
  onMessage,
  onMessageText,
  messageText,
  username,
  hangout,
  onNavigation,
  loading,
}) {
  const scrollerRef = y(null);
  const { device } = useMediaQuery();
  p$1(() => {
    if (messages) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  function onSend(e) {
    onMessage(e);
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }

  return h(
    "div",
    {
      style: {
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
    },
    h(
      "div",
      {
        style: {
          ...styles$1.messageContainer,
          flex: device === "phone" ? 4 : 2,
        },
        ref: scrollerRef,
      },
      messages &&
        messages.length > 0 &&
        floatMessages &&
        floatMessages.length > 0 &&
        floatMessages({
          messages: sortMessages({
            messages,
          }),
          username,
        }).map((m) =>
          h(
            "div",
            {
              style: {
                display: "flex",
              },
            },
            " ",
            !m.type &&
              h(Message, {
                message: m,
              }),
            m.type &&
              m.type === "blocker" &&
              h(BlockerMessage, {
                message: m,
              }),
            m.type &&
              m.type === "blocked" &&
              h(BlockedMessage, {
                message: m,
                onNavigation: onNavigation,
              })
          )
        )
    ),
    h(MessageEditor, {
      loading: loading,
      hangout: hangout,
      onMessage: onSend,
      messageText: messageText,
      onMessageText: onMessageText,
    })
  );
}

function floatMessages({ messages, username }) {
  if (messages && messages.length > 0 && username) {
    return messages.map((msg) => {
      if (msg.username === username) {
        return { ...msg, float: "right", username: "me" };
      } else {
        return { ...msg, float: "left" };
      }
    });
  } else {
    return [];
  }
}

function sortMessages({ messages }) {
  if (messages) {
    return messages.sort();
  } else {
    return [];
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
  onNavigation,
}) {
  p$1(() => {
    if (hangout) {
      document.title = hangout.username;
    }
  }, [hangout]);
  return h(
    Layout,
    {
      id: "hangchat-ui",
      onNavigation: onNavigation,
    },
    h(Messages, {
      loading: loading,
      onNavigation: onNavigation,
      hangout: hangout,
      messages: messages,
      onMessage: onMessage,
      onMessageText: onMessageText,
      messageText: messageText,
      username: username,
    })
  );
}

function PersonAddIcon({
  height = 24,
  width = 24,
  color = "black",
  fill = "white",
  style,
}) {
  return h(
    "svg",
    {
      height: height,
      viewBox: "0 0 24 24",
      width: width,
      style: style,
    },
    h("path", {
      d: "M0 0h24v24H0z",
      fill: fill,
    }),
    h("path", {
      fill: color,
      d:
        "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    })
  );
}

const style$7 = {
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}; //

function Invite({ hangout, onInvite, onMessageText, messageText, loading }) {
  return h(
    Layout,
    {
      style: style$7.layout,
      id: "invite-ui",
    },
    h(
      Center,
      null,
      h(PersonAddIcon, {
        color: "green",
      })
    ),
    h(
      Center,
      null,
      "Start Conversation with ",
      h("b", null, hangout && hangout.email)
    ),
    h(TextInput, {
      id: "messageTextInput",
      onChange: onMessageText,
      value: messageText,
      "data-testid": "messageTextInput",
    }),
    h(
      Center,
      null,
      h(Button, {
        loading: loading,
        id: "INVITE",
        onClick: onInvite,
        "data-testid": "oninvite-btn",
        title: "Send Invite",
        bg: "primary",
      })
    )
  );
}

function Done({
  height = 24,
  width = 24,
  fill = "none",
  color = "black",
  style,
}) {
  return h(
    "svg",
    {
      height: height,
      viewBox: "0 0 24 24",
      width: width,
      style: style,
    },
    h("path", {
      d: "M0 0h24v24H0z",
      fill: fill,
    }),
    h("path", {
      fill: color,
      d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",
    })
  );
}

const style$8 = {
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
};
function Invitee({ hangout, dispatch }) {
  return h(
    Layout,
    {
      style: style$8.layout,
      id: "invitee-ui",
    },
    h(
      Center,
      null,
      h(Done, {
        width: "70",
        height: "70",
        color: "green",
      })
    ),
    h(
      Center,
      null,
      h(
        "p",
        null,
        "You will be able to chat with ",
        h("b", null, hangout && hangout.email),
        " once your invition has been accepted."
      )
    )
  );
}

const style$9 = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    paddingTop: 70,
    boxSizing: "border-box",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
};
function Inviter({ hangout, onAccept, onDecline, loading }) {
  return h(
    Layout,
    {
      id: "inviter-ui",
    },
    h(
      "div",
      {
        style: style$9.root,
      },
      h(
        "div",
        {
          style: {
            marginLeft: 8,
            display: "flex",
          },
        },
        hangout &&
          hangout.message &&
          h(Message, {
            message: hangout &&
              hangout.message && {
                ...hangout.message,
                username: hangout.username,
                float: "left",
              },
          })
      ),
      h(
        "div",
        {
          className: "row",
        },
        h(
          "div",
          {
            className: "col",
          },
          h(Button, {
            id: "DECLINE",
            onClick: onDecline,
            "data-testid": "decline-btn",
            title: "Decline",
            block: true,
            bg: "danger",
            outline: true,
          })
        ),
        h(
          "div",
          {
            className: "col",
          },
          h(Button, {
            id: "ACCEPT",
            onClick: onAccept,
            "data-testid": "accept-btn",
            loading: loading,
            title: "Accept",
            bg: "primary",
            block: true,
          })
        )
      )
    )
  );
}

function UnreadHangouts({ unreadhangouts, onUnreadSelect, onUnreadRemove }) {
  return h(
    "ul",
    {
      class: "list-group",
    },
    unreadhangouts.length > 0 &&
      unreadhangouts.map((u) => {
        return h(
          "li",
          {
            "data-testid": u.username,
            onClick: () =>
              onUnreadSelect({
                hangout: u,
              }),
            className:
              "list-group-item d-flex justify-content-between align-items-center list-group-item-action",
          },
          u.username,
          ",",
          u.message && u.message.text,
          h(
            "span",
            {
              onClick: () => {
                onUnreadRemove({
                  hangout: u,
                });
              },
              className: "btn badge badge-danger badge-pill",
            },
            "X"
          )
        );
      })
  );
}

function List(props) {
  return h(
    "div",
    _extends(
      {
        className: "list-group",
      },
      props
    )
  );
}

function ListItem(props) {
  return h(
    "button",
    _extends(
      {
        type: "button",
        className: "list-group-item list-group-item-action",
      },
      props
    )
  );
}

function PersonPlusFill(props) {
  const { width, height, color } = props;
  return h(
    "svg",
    {
      width: width,
      height: height,
      viewBox: "0 0 16 16",
      className: "bi bi-person-plus-fill",
      fill: color,
      xmlns: "http://www.w3.org/2000/svg",
    },
    h("path", {
      "fill-rule": "evenodd",
      d:
        "M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z",
    }),
    h("path", {
      "fill-rule": "evenodd",
      d: "M13 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z",
    })
  );
}

function Filter({
  onLoadHangout,
  filter,
  filterResult = [],
  onFilterSelect,
  onFilterInput,
  onNavigation,
}) {
  p$1(() => {
    onLoadHangout();
  }, []);
  return h(
    "div",
    {
      style: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
    },
    h("input", {
      className: "form-control",
      value: filter,
      onChange: onFilterInput,
      "data-testid": "filter-input",
    }),
    h(
      "div",
      null,
      h(
        List,
        null,
        filterResult.length > 0 &&
          filterResult.map((f) => {
            return h(
              ListItem,
              {
                id: f.username,
                "data-testid": f.username,
                onClick: onFilterSelect,
              },
              f.username
            );
          })
      )
    ),
    filterResult.length === 0 &&
      h(
        "div",
        {
          className: "row align-items-center",
          style: {
            flex: 1,
          },
        },
        h(
          "div",
          {
            className: "col-2  mx-auto",
          },
          h(
            "button",
            {
              "data-testid": "search",
              id: "search",
              onClick: onNavigation,
              className: "btn btn-outline-secondary",
            },
            h(PersonPlusFill, {
              width: "2em",
              height: "2em",
            })
          )
        )
      )
  );
}

function Search({
  onSearchSelect,
  onSearchInput,
  onSearch,
  search,
  searchResult = [],
}) {
  return h(
    "div",
    null,
    h(
      "div",
      {
        className: "input-group mb-3",
      },
      h("input", {
        "data-testid": "search-input",
        value: search,
        onChange: onSearchInput,
        type: "text",
        className: "form-control",
        placeholder: "Enter username",
        "aria-label": "username",
        "aria-describedby": "button-addon2",
      }),
      h(
        "div",
        {
          className: "input-group-append",
        },
        h(
          "button",
          {
            "data-testid": "search-btn",
            onClick: onSearch,
            className: "btn btn-outline-secondary",
            type: "button",
            id: "button-addon2",
          },
          "Search"
        )
      )
    ),
    h(
      List,
      null,
      searchResult.length > 0 &&
        searchResult.map((u) => {
          return h(
            ListItem,
            {
              id: u.username,
              onClick: onSearchSelect,
              "data-testid": u.username,
            },
            u.username
          );
        })
    )
  );
}

const messages = [
  {
    username: "breno",
    text: `Let's Chat on Hangout!`,
    timestamp: 1591331789971,
  },
  {
    username: "demo",
    text: `Ok Let's Chat on Hangout!`,
    timestamp: 1591332163462,
  },
  {
    username: "breno",
    text: `How are you demo`,
    timestamp: 1591333635723,
  },
  {
    username: "breno",
    text: `Are you all right`,
    timestamp: 1591333677573,
  },
  {
    username: "demo",
    text: `Yes I am. How are you`,
    timestamp: 1591333728046,
  },
  ,
  {
    username: "demo",
    text: `Are you doing greate`,
    timestamp: 1591333728047,
  },
  {
    username: "demo",
    text: `Are you doing greate`,
    timestamp: 1591333728047,
  },
  {
    username: "breno",
    text: `Yes i am`,
    timestamp: 1591333728048,
  },
  {
    username: "breno",
    text: `Yes i am`,
    timestamp: 1591333728049,
  },
  {
    username: "breno",
    text: `Yes i am`,
    timestamp: 1591333728049,
  },
  {
    username: "breno",
    text: `Yes i am`,
    timestamp: 1591333728049,
  },
  {
    username: "breno",
    text: `Yes i am`,
    timestamp: 1591333728049,
  },
];

const hangouts = [
  {
    username: "userone",
  },
  {
    username: "usertwo",
  },
  {
    username: "userthree",
  },
];
const hangout = {
  username: "testuser",
  email: "test@gmail.com",
  message: {
    text: `Let's chat on Hangout!`,
    timestamp: 1590820782921,
  },
};
const message = {
  username: "breno",
  text: `Let's Chat on Hangout!`,
  timestamp: 1591331767836,
}; //
function HangoutRoutes() {
  return [
    h(
      AppRoute,
      {
        path: "/block",
      },
      h(Block, {
        hangouts: hangouts,
      })
    ),
    h(
      AppRoute,
      {
        path: "/blocked",
      },
      h(Blocked, {
        hangouts: hangouts,
      })
    ),
    h(
      AppRoute,
      {
        path: "/configure",
      },
      h(Configure, {
        hangouts: hangouts,
      })
    ),
    h(
      AppRoute,
      {
        path: "/hangchat",
      },
      h(Hangchat, {
        hangout: hangout,
        messages: messages,
        username: "demo",
      })
    ),
    h(
      AppRoute,
      {
        path: "/invite",
      },
      h(Invite, {
        hangouts: hangouts,
      })
    ),
    h(
      AppRoute,
      {
        path: "/inviter",
      },
      h(Inviter, {
        hangouts: hangouts,
      })
    ),
    h(
      AppRoute,
      {
        path: "/invitee",
      },
      h(Invitee, {
        hangouts: hangouts,
      })
    ),
    h(
      AppRoute,
      {
        path: "/unreadhangouts",
      },
      h(UnreadHangouts, {
        unreadhangouts: hangouts,
      })
    ),
    h(
      AppRoute,
      {
        path: "/message",
      },
      h(
        "div",
        {
          style: {
            padding: 20,
            backgroundColor: "#eeeeeee",
          },
        },
        h(Message, {
          message: message,
          username: hangout.username,
        })
      )
    ),
    h(
      AppRoute,
      {
        path: "/messages",
      },
      h(Hangchat, {
        hangout: hangout,
        messages: messages,
        username: "demo",
      })
    ),
    h(
      AppRoute,
      {
        path: "/search",
      },
      h(Search, null)
    ),
    h(
      AppRoute,
      {
        path: "/filter",
      },
      h(Filter, null)
    ),
  ];
}

function BootstrapIcons() {
  return h(GearIcon, null);
}

//   { username: 'userone' },
//   { username: 'usertwo' },
//   { username: 'userthree' },
// ];
// const hangout = {
//   username: 'testuser',
//   email: 'test@gmail.com',
//   message: { text: `Let's chat on Hangout!`, timestamp: 1590820782921 },
// };
// const message = {
//   username: 'breno',
//   text: `Let's Chat on Hangout!`,
//   timestamp: 1591331767836,
// };
// //

function StorybookRoutes() {
  return h(
    "div",
    {
      style: {
        height: "85vh",
      },
    },
    h(
      AppRoute,
      {
        path: "/online",
      },
      h(
        "div",
        null,
        h(OnlineStatus, {
          online: true,
        }),
        h(OnlineStatus, null)
      )
    ),
    h(
      AppRoute,
      {
        path: "/icons",
      },
      h(BootstrapIcons, null)
    ),
    h(AuthDemoRoutes, null),
    h(ComponentsRoute, null),
    h(HangoutRoutes, null)
  );
}

function Navbar(props) {
  const { bg = "light", brand, children } = props;
  return h(
    "nav",
    {
      className: `navbar navbar-expand-lg navbar-${bg} bg-${bg}`,
    },
    h(
      "a",
      {
        className: "navbar-brand",
        href: "#",
      },
      brand
    ),
    h(
      "button",
      {
        className: "navbar-toggler",
        type: "button",
        "data-toggle": "collapse",
        "data-target": "#navbarSupportedContent",
        "aria-controls": "navbarSupportedContent",
        "aria-expanded": "false",
        "aria-label": "Toggle navigation",
      },
      h("span", {
        className: "navbar-toggler-icon",
      })
    ),
    children
  );
}
function NavBarCollapse({ children }) {
  return h(
    "div",
    {
      className: "collapse navbar-collapse",
      id: "navbarSupportedContent",
    },
    children
  );
}
function NavBarNav({ children }) {
  return h(
    "ul",
    {
      className: "navbar-nav mr-auto",
    },
    children
  );
} //

function NavDropdown(props) {
  const { title, children } = props;
  return h(
    "li",
    {
      className: "nav-item dropdown",
    },
    h(
      "a",
      _extends(
        {
          className: "nav-link dropdown-toggle",
          href: "#",
          id: "navbarDropdown",
          role: "button",
          "data-toggle": "dropdown",
          "aria-haspopup": "true",
          "aria-expanded": "false",
        },
        props
      ),
      title
    ),
    children
  );
}
function DropdownMenu(props) {
  const { children } = props;
  return h(
    "div",
    {
      className: "dropdown-menu",
      "aria-labelledby": "navbarDropdown",
    },
    children
  );
}
function DropdownItem(props) {
  const { onAppRoute } = useAppRoute();

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    onAppRoute({
      featureRoute: "/",
      route: `/${id}`,
    });
  }

  return h(
    "a",
    _extends(
      {
        className: "dropdown-item",
        href: "#",
      },
      props,
      {
        onClick: handleRoute,
      }
    )
  );
}

H(
  h(
    AppProviders,
    null,
    h(
      Navbar,
      {
        brand: "Storybook",
        bg: "dark",
      },
      h(
        NavBarCollapse,
        null,
        h(
          NavBarNav,
          null,
          h(
            NavDropdown,
            {
              title: "Components",
            },
            h(
              DropdownMenu,
              null,
              h(
                DropdownItem,
                {
                  id: "button",
                },
                "Buttons"
              ),
              h(
                DropdownItem,
                {
                  id: "text-input",
                },
                "TextInput"
              ),
              h(
                DropdownItem,
                {
                  id: "icons",
                },
                "Icons"
              ),
              h(
                DropdownItem,
                {
                  id: "alert",
                },
                "Alert"
              )
            )
          ),
          h(
            NavDropdown,
            {
              title: "Authentication",
            },
            h(
              DropdownMenu,
              null,
              h(
                DropdownItem,
                {
                  id: "login",
                },
                "Login"
              ),
              h(
                DropdownItem,
                {
                  id: "signup",
                },
                "Signup"
              ),
              h(
                DropdownItem,
                {
                  id: "change-password",
                },
                "Change Password"
              ),
              h(
                DropdownItem,
                {
                  id: "forgot-password",
                },
                "Forgot Password"
              )
            )
          ),
          h(
            NavDropdown,
            {
              title: "Hangout",
            },
            h(
              DropdownMenu,
              null,
              h(
                DropdownItem,
                {
                  id: "block",
                },
                "Block"
              ),
              h(
                DropdownItem,
                {
                  id: "blocked",
                },
                "Blocked"
              ),
              h(
                DropdownItem,
                {
                  id: "configure",
                },
                "Configure"
              ),
              h(
                DropdownItem,
                {
                  id: "hangchat",
                },
                "Hangchat"
              ),
              h(
                DropdownItem,
                {
                  id: "hangout",
                },
                "Hangout"
              ),
              h(
                DropdownItem,
                {
                  id: "invite",
                },
                "Invite"
              ),
              h(
                DropdownItem,
                {
                  id: "invitee",
                },
                "Invitee"
              ),
              h(
                DropdownItem,
                {
                  id: "inviter",
                },
                "Inviter"
              ),
              h(
                DropdownItem,
                {
                  id: "unreadhangouts",
                },
                "UnreadHangouts"
              ),
              h(
                DropdownItem,
                {
                  id: "search",
                },
                "Hangout Search"
              ),
              h(
                DropdownItem,
                {
                  id: "filter",
                },
                "Hangout Filter"
              )
            )
          )
        )
      )
    ),
    h(StorybookRoutes, null)
  ),
  document.body
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uL2NvbXBvbmVudHMvYXBwLXJvdXRlL2luZGV4LmpzIiwiLi4vU3Rvcnlib29rUHJvdmlkZXJzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL2J1dHRvbi9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvYWxlcnQvaW5kZXguanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2xvZ2luLnN0YXRlcy5qcyIsIi4uLy4uL2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvc2lnbnVwLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL3NpZ251cC5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2NoYW5nZS1wYXNzd29yZC5zdGF0ZXMuanMiLCIuLi8uLi9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkLmpzIiwiLi4vYXV0aGVudGljYXRpb24vc3RhdGVzL2ZvcmdvdC1wYXNzd29yZC5zdGF0ZXMuanMiLCIuLi9hdXRoZW50aWNhdGlvbi9yb3V0ZS5qcyIsIi4uL2NvbXBvbmVudHMvYnV0dG9uL2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy90ZXh0LWlucHV0L2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9jb250cm9scy90b2FzdC91c2VyLnBuZyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvdG9hc3QvaW5kZXguanMiLCIuLi9jb21wb25lbnRzL3RvYXN0L2luZGV4LmpzIiwiLi4vY29tcG9uZW50cy9hbGVydC9pbmRleC5qcyIsIi4uL2NvbXBvbmVudHMvcm91dGUuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL2Jvb3RzdHJhcC9HZWFySWNvbi5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvTGF5b3V0LmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9jay5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvQmxvY2suanMiLCIuLi8uLi9jb21wb25lbnRzL2xheW91dC9DZW50ZXIuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrZWQuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL0RlbGV0ZS5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvQXJjaGl2ZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvQ29uZmlndXJlLmpzIiwiLi4vLi4vY29tcG9uZW50cy9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvTWVzc2FnZS5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvTWVzc2FnZUVkaXRvci5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbWVzc2FnZXMvQmxvY2tlck1lc3NhZ2UuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL21lc3NhZ2VzL0Jsb2NrZWRNZXNzYWdlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9pbmRleC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ2NoYXQuanMiLCIuLi8uLi9jb21wb25lbnRzL2ljb25zL1BlcnNvbkFkZC5qcyIsIi4uLy4uL2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlLmpzIiwiLi4vLi4vY29tcG9uZW50cy9pY29ucy9Eb25lLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVlLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9JbnZpdGVyLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9VbnJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uL2NvbXBvbmVudHMvY29udHJvbHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uL2NvbXBvbmVudHMvaWNvbnMvYm9vdHN0cmFwL1BlcnNvblBsdXNGaWxsLmpzIiwiLi4vLi4vZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9GaWx0ZXIuanMiLCIuLi8uLi9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL1NlYXJjaC5qcyIsIi4uL2hhbmdvdXQvZmFrZU1lc3NhZ2VzLmpzIiwiLi4vaGFuZ291dC9yb3V0ZS5qcyIsIi4uL2ljb25zL2luZGV4LmpzIiwiLi4vU3Rvcnlib29rUm91dGVzLmpzIiwiLi4vLi4vY29tcG9uZW50cy9uYXYtYmFyL2luZGV4LmpzIiwiLi4vLi4vY29tcG9uZW50cy9uYXYtYmFyL25hdi1kcm9wZG93bi5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xuICBBUFBfUk9VVEVfQ0hBTkdFRDogXCJBUFBfUk9VVEVfQ0hBTkdFRFwiLFxuICAvLyAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXG59O1xuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tIFwiLi9hY3Rpb25UeXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHJvdXRlOiBhY3Rpb24ucm91dGUsXG4gICAgICAgIGZlYXR1cmVSb3V0ZTogYWN0aW9uLmZlYXR1cmVSb3V0ZSxcbiAgICAgIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVJlZHVjZXIsIHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gXCJwcmVhY3QvaG9va3NcIjtcbmltcG9ydCB7IHJlZHVjZXIgfSBmcm9tIFwiLi9yZWR1Y2VyXCI7XG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gXCIuL2FjdGlvblR5cGVzXCI7XG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5cbmZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwUm91dGVDb250ZXh0KTtcblxuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlclwiKTtcbiAgfVxuICByZXR1cm4gY29udGV4dDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xuXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XG4gIGNvbnN0IHsgZmVhdHVyZVJvdXRlIH0gPSBzdGF0ZTtcblxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlKCkge1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xuICBjb25zdCB7IG5hbWUgfSA9IHN0YXRlO1xuICBmdW5jdGlvbiBvbkFwcFJvdXRlKHsgcm91dGUsIGZlYXR1cmVSb3V0ZSB9KSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG5hbWUsIEpTT04uc3RyaW5naWZ5KHsgcm91dGUsIGZlYXR1cmVSb3V0ZSB9KSk7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLCByb3V0ZSB9KTtcbiAgfVxuXG4gIHJldHVybiB7IG9uQXBwUm91dGUgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcblxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xuICBjb25zdCB7IHJvdXRlIH0gPSBzdGF0ZTtcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5uYW1lICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpKSB7XG4gICAgICBjb25zdCB7IGZlYXR1cmVSb3V0ZSwgcm91dGUgfSA9IEpTT04ucGFyc2UoXG4gICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpXG4gICAgICApO1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLCByb3V0ZSB9KTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBBcHBSb3V0ZVByb3ZpZGVyIGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUHJvdmlkZXJzKHsgY2hpbGRyZW4gfSkge1xuICByZXR1cm4gKFxuICAgIDxBcHBSb3V0ZVByb3ZpZGVyXG4gICAgICAvL1xuICAgICAgdGl0bGU9XCJXZWJjb21cIlxuICAgICAgaW5pdFN0YXRlPXt7IHJvdXRlOiBcIi9cIiwgZmVhdHVyZVJvdXRlOiBcIi9oYW5nb3V0c1wiLCBuYW1lOiBcInN0b3J5Ym9va1wiIH19XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvQXBwUm91dGVQcm92aWRlcj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5jb25zdCBzdHlsZSA9IHtcbiAgd2lkdGg6IDE1LFxuICBoZWlnaHQ6IDE1LFxuXG4gIGJvcmRlcjogXCJ3aGl0ZSAycHggc29saWRcIixcbn07XG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XG4gIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XG4gICAgcmV0dXJuIDxJc09ubGluZSAvPjtcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XG4gICAgcmV0dXJuIDxDb25uZWN0aW5nIC8+O1xuICB9IGVsc2UgaWYgKHJlYWR5U3RhdGUgPT09IDIpIHtcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XG4gIH1cbiAgcmV0dXJuIDxJc09mZmxpbmUgLz47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc09ubGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiBcImdyZWVuXCIgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwib25saW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc09mZmxpbmUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogXCJyZWRcIiB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6IFwib3JhbmdlXCIgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXG4gICAgPjwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2xvc2luZygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiBcInBpbmtcIiB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJjbG9zaW5nXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUZXh0SW5wdXQocHJvcHMpIHtcbiAgY29uc3QgeyBsYWJlbCwgbmFtZSwgdHlwZSwgaXNWYWxpZCwgbWVzc2FnZSB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIHAtMFwiPlxuICAgICAgPGxhYmVsIGZvcj17bmFtZX0+e2xhYmVsfTwvbGFiZWw+XG4gICAgICA8aW5wdXRcbiAgICAgICAgdHlwZT17dHlwZX1cbiAgICAgICAgY2xhc3NOYW1lPXtgZm9ybS1jb250cm9sICR7aXNWYWxpZCAmJiBcImlzLXZhbGlkXCJ9ICR7XG4gICAgICAgICAgIWlzVmFsaWQgJiYgaXNWYWxpZCAhPT0gdW5kZWZpbmVkICYmIFwiaXMtaW52YWxpZFwiXG4gICAgICAgIH1gfVxuICAgICAgICBpZD17bmFtZX1cbiAgICAgICAgYXJpYS1kZXNjcmliZWRieT17bmFtZX1cbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgLz5cbiAgICAgIHshaXNWYWxpZCAmJiAoXG4gICAgICAgIDxzbWFsbFxuICAgICAgICAgIGlkPVwiZW1haWxIZWxwXCJcbiAgICAgICAgICBjbGFzc05hbWU9e2AkeyFpc1ZhbGlkICYmIFwiaW52YWxpZC1mZWVkYmFja1wifWB9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2BtZXNzYWdlLSR7bmFtZX1gfVxuICAgICAgICA+XG4gICAgICAgICAge21lc3NhZ2V9XG4gICAgICAgIDwvc21hbGw+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHByb3BzKSB7XG4gIGNvbnN0IHsgdGl0bGUsIGJnID0gXCJsaWdodFwiLCBvdXRsaW5lLCBzaXplLCBsb2FkaW5nID0gZmFsc2UsIGJsb2NrIH0gPSBwcm9wcztcblxuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzTmFtZT17YCR7YmcgJiYgIW91dGxpbmUgJiYgYGJ0biBidG4tJHtiZ31gfSAke1xuICAgICAgICBvdXRsaW5lICYmIGBidG4gYnRuLW91dGxpbmUtJHtiZ31gXG4gICAgICB9ICR7c2l6ZSAmJiBgYnRuIGJ0bi0ke3NpemV9YH0gJHtibG9jayAmJiBcImJ0bi1ibG9ja1wifWB9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICBkaXNhYmxlZD17bG9hZGluZ31cbiAgICA+XG4gICAgICB7bG9hZGluZyAmJiAoXG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3M9XCJzcGlubmVyLWJvcmRlciBzcGlubmVyLWJvcmRlci1zbVwiXG4gICAgICAgICAgcm9sZT1cInN0YXR1c1wiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvc3Bhbj5cbiAgICAgICl9XG4gICAgICB7bG9hZGluZyA/IFwid2FpdC4uLlwiIDogdGl0bGV9XG4gICAgPC9idXR0b24+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQocHJvcHMpIHtcbiAgY29uc3QgeyBhbGVydCwgbWVzc2FnZSB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2BhbGVydCBhbGVydC0ke2FsZXJ0fWB9IHJvbGU9XCJhbGVydFwiIGRhdGEtdGVzdGlkPVwiYWxlcnRcIj5cbiAgICAgIHttZXNzYWdlfVxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3M9XCJjbG9zZVwiXG4gICAgICAgIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIkNsb3NlXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSBcImNvbnRyb2xzL3RleHQtaW5wdXRcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcImNvbnRyb2xzL2J1dHRvblwiO1xuaW1wb3J0IEFsZXJ0IGZyb20gXCJjb250cm9scy9hbGVydFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9naW4ocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIGVtYWlsb3J1c2VybmFtZSxcbiAgICBwYXNzd29yZCxcbiAgICBsb2FkaW5nLFxuICAgIG9uTG9naW4sXG4gICAgb25Gb2N1cyxcbiAgICBvbkNoYW5nZSxcbiAgICB2YWxpZGF0aW9uLFxuICAgIG9uRm9yZ290UGFzc3dvcmQsXG4gICAgb25CbHVyLFxuICAgIGVycm9yLFxuICB9ID0gcHJvcHM7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJjb2wtbWQtNCBib3JkZXIgbXgtYXV0byByb3VuZGVkXCJcbiAgICAgIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19XG4gICAgPlxuICAgICAge2xvYWRpbmcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCJcbiAgICAgICAgICAgIHJvbGU9XCJwcm9ncmVzc2JhclwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbm93PVwiMTAwXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxuICAgICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMTAwJVwiXG4gICAgICAgICAgPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7ZXJyb3IgJiYgPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT17ZXJyb3IubWVzc2FnZX0gLz59XG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgIG9uQmx1cj17b25CbHVyfVxuICAgICAgICB2YWx1ZT17ZW1haWxvcnVzZXJuYW1lfVxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIGxhYmVsPVwiRW1haWwgb3IgdXNlcm5hbWVcIlxuICAgICAgICBuYW1lPVwiZW1haWxvcnVzZXJuYW1lXCJcbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICBpZD1cImVtYWlsb3J1c2VybmFtZVwiXG4gICAgICAgIGRhdGEtdGVzdGlkPVwiZW1haWxvcnVzZXJuYW1lXCJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wiZW1haWxvcnVzZXJuYW1lXCJdLm1lc3NhZ2V9XG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImVtYWlsb3J1c2VybmFtZVwiXS5pc1ZhbGlkfVxuICAgICAgLz5cblxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBvbkZvY3VzPXtvbkZvY3VzfVxuICAgICAgICBvbkJsdXI9e29uQmx1cn1cbiAgICAgICAgbGFiZWw9XCJQYXNzd29yZFwiXG4gICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxuICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICBpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYXNzd29yZFwiXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcInBhc3N3b3JkXCJdLm1lc3NhZ2V9XG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcInBhc3N3b3JkXCJdLmlzVmFsaWR9XG4gICAgICAvPlxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiIH19PlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgaWQ9XCJsb2dpbi1idG5cIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9naW4tYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXtvbkxvZ2lufVxuICAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgICAgdGl0bGU9XCJMb2dpblwiXG4gICAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgICAgLz5cblxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgb25DbGljaz17b25Gb3Jnb3RQYXNzd29yZH1cbiAgICAgICAgICBpZD1cImZvcmdvdHBhc3N3b3JkXCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImZvcmdvdHBhc3N3b3JkXCJcbiAgICAgICAgICBvdXRsaW5lXG4gICAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgICAgICB0aXRsZT1cIkZvcmdvdCBQYXNzd29yZCFcIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IExvZ2luIGZyb20gXCJmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luXCI7XG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHtcbiAgZW1haWxvcnVzZXJuYW1lOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6IFwiLlwiIH0sXG4gIHBhc3N3b3JkOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6IFwiLlwiIH0sXG59O1xuY29uc3QgdmFsaWRhdGlvbkVycm9yID0ge1xuICBlbWFpbG9ydXNlcm5hbWU6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IFwiaW52YWxpZCBjcmVkZW50aWFsc1wiIH0sXG4gIHBhc3N3b3JkOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiBcImludmFsaWQgY3JlZGVudGlhbHNcIiB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExvZ2luU3RhdGVzKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj4gTG9naW4gVmFsaWRhdGlvbiBTdWNjZXNzPC9oNT5cblxuICAgICAgICAgIDxMb2dpblxuICAgICAgICAgICAgZW1haWxvcnVzZXJuYW1lPVwidGVzdHVzZXJcIlxuICAgICAgICAgICAgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5Mb2dpbiBWYWxpZGF0aW9uIEVycm9yPC9oNT5cblxuICAgICAgICAgIDxMb2dpblxuICAgICAgICAgICAgZW1haWxvcnVzZXJuYW1lPVwidGVzdHVzZXJcIlxuICAgICAgICAgICAgcGFzc3dvcmQ9XCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+TG9nZ2luZyBpbjwvaDU+XG4gICAgICAgICAgPExvZ2luXG4gICAgICAgICAgICBlbWFpbG9ydXNlcm5hbWU9XCJ0ZXN0dXNlclwiXG4gICAgICAgICAgICBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31cbiAgICAgICAgICAgIGxvYWRpbmdcbiAgICAgICAgICAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPkxvZ2dpbmcgU2VydmVyIGVycm9yPC9oNT5cbiAgICAgICAgICA8TG9naW5cbiAgICAgICAgICAgIGVtYWlsb3J1c2VybmFtZT1cInRlc3R1c2VyXCJcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgICAgZXJyb3I9e3sgbWVzc2FnZTogXCJTZXJ2ZXIgaXMgdW5hdmFpbGFibGVcIiB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcblxuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5pbXBvcnQgQWxlcnQgZnJvbSBcImNvbnRyb2xzL2FsZXJ0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaWdudXAocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIHVzZXJuYW1lLFxuICAgIHBhc3N3b3JkLFxuICAgIGVtYWlsLFxuICAgIGxvYWRpbmcsXG4gICAgb25TaWdudXAsXG4gICAgb25DaGFuZ2UsXG4gICAgdmFsaWRhdGlvbixcbiAgICBvbkJsdXIsXG4gICAgb25Gb2N1cyxcbiAgICBlcnJvcixcbiAgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIlxuICAgICAgc3R5bGU9e3sgbWFyZ2luOiAxNSwgcGFkZGluZzogMTYgfX1cbiAgICA+XG4gICAgICB7bG9hZGluZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIiBzdHlsZT1cImhlaWdodDogNXB4O1wiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIlxuICAgICAgICAgICAgcm9sZT1cInByb2dyZXNzYmFyXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVub3c9XCIxMDBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgICBzdHlsZT1cIndpZHRoOiAxMDAlXCJcbiAgICAgICAgICA+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgIGxhYmVsPVwiVXNlcm5hbWVcIlxuICAgICAgICB2YWx1ZT17dXNlcm5hbWV9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICBkYXRhLXRlc3RpZD1cInVzZXJuYW1lXCJcbiAgICAgICAgbmFtZT1cInVzZXJuYW1lXCJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1widXNlcm5hbWVcIl0uaXNWYWxpZH1cbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1widXNlcm5hbWVcIl0ubWVzc2FnZX1cbiAgICAgIC8+XG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIG9uQmx1cj17b25CbHVyfVxuICAgICAgICBvbkZvY3VzPXtvbkZvY3VzfVxuICAgICAgICBsYWJlbD1cIkVtYWlsXCJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICB2YWx1ZT17ZW1haWx9XG4gICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgIGRhdGEtdGVzdGlkPVwiZW1haWxcIlxuICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJlbWFpbFwiXS5pc1ZhbGlkfVxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJlbWFpbFwiXS5tZXNzYWdlfVxuICAgICAgLz5cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgIGxhYmVsPVwiUGFzc3dvcmRcIlxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYXNzd29yZFwiXG4gICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcInBhc3N3b3JkXCJdLmlzVmFsaWR9XG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcInBhc3N3b3JkXCJdLm1lc3NhZ2V9XG4gICAgICAvPlxuICAgICAgPEJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgb25DbGljaz17b25TaWdudXB9XG4gICAgICAgIGlkPVwic2lnbnVwLWJ0blwiXG4gICAgICAgIGRhdGEtdGVzdGlkPVwic2lnbnVwLWJ0blwiXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIHRpdGxlPVwiU2lnbnVwXCJcbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IFNpZ251cCBmcm9tIFwiZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9zaWdudXBcIjtcbmNvbnN0IHZhbGlkYXRpb25TdWNjZXNzID0ge1xuICB1c2VybmFtZTogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiBcIi5cIiB9LFxuICBwYXNzd29yZDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiBcIi5cIiB9LFxuICBlbWFpbDogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiBcIi5cIiB9LFxufTtcbmNvbnN0IHZhbGlkYXRpb25FcnJvciA9IHtcbiAgdXNlcm5hbWU6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IFwiVXNlcm5hbWUgaXMgbm90IHZhbGlkXCIgfSxcbiAgcGFzc3dvcmQ6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IFwiUGFzd29yZCBpcyBub3QgdmFsaWRcIiB9LFxuICBlbWFpbDogeyBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogXCJFbWFpbCBpcyBub3QgdmFsaWRcIiB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ251cFN0YXRlcygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2lnbnVwIFZhbGlkYXRpb24gU3VjY2VzczwvaDU+XG4gICAgICAgICAgPFNpZ251cFxuICAgICAgICAgICAgdXNlcm5hbWU9XCJ0ZXN0dXNlclwiXG4gICAgICAgICAgICBlbWFpbD1cInRlc3RAZ21haWwuY29tXCJcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2lnbnVwIFZhbGlkYXRpb24gRXJyb3I8L2g1PlxuICAgICAgICAgIDxTaWdudXBcbiAgICAgICAgICAgIHVzZXJuYW1lPVwidGVzdHVzZXJcIlxuICAgICAgICAgICAgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiXG4gICAgICAgICAgICBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uRXJyb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlNpZ25pbmcgdXA8L2g1PlxuICAgICAgICAgIDxTaWdudXBcbiAgICAgICAgICAgIHVzZXJuYW1lPVwidGVzdHVzZXJcIlxuICAgICAgICAgICAgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiXG4gICAgICAgICAgICBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31cbiAgICAgICAgICAgIGxvYWRpbmdcbiAgICAgICAgICAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlNpZ25pbmcgU2V2ZXIgZXJyb3I8L2g1PlxuICAgICAgICAgIDxTaWdudXBcbiAgICAgICAgICAgIHVzZXJuYW1lPVwidGVzdHVzZXJcIlxuICAgICAgICAgICAgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiXG4gICAgICAgICAgICBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31cbiAgICAgICAgICAgIGVycm9yPXt7IG1lc3NhZ2U6IFwiU2VydmVyIGlzIHVuYXZhaWxhYmxlXCIgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmltcG9ydCBBbGVydCBmcm9tIFwiY29udHJvbHMvYWxlcnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIHBhc3N3b3JkLFxuICAgIGNvbmZpcm0sXG4gICAgdmFsaWRhdGlvbixcbiAgICBvbkNoYW5nZSxcbiAgICBvblBhc3N3b3JkQ2hhbmdlLFxuICAgIGxvYWRpbmcsXG4gICAgZXJyb3IsXG4gIH0gPSBwcm9wcztcblxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xuICAvLyAgIGxldCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgLy8gICB2YXIgdXJsdG9rZW4gPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgndG9rZW4nKTtcblxuICAvLyAgIGlmICh1cmx0b2tlbikge1xuICAvLyAgICAgZGlzcGF0Y2goYWN0aW9ucy5nZXRUb2tlbkZyb21VcmwoeyB0b2tlbjogdXJsdG9rZW4gfSkpO1xuICAvLyAgIH1cbiAgLy8gfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiXG4gICAgICBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fVxuICAgID5cbiAgICAgIHtsb2FkaW5nICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIHByb2dyZXNzLWJhci1hbmltYXRlZFwiXG4gICAgICAgICAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW5vdz1cIjEwMFwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcbiAgICAgICAgICAgIHN0eWxlPVwid2lkdGg6IDEwMCVcIlxuICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge2Vycm9yICYmIDxBbGVydCBhbGVydD1cImRhbmdlclwiIG1lc3NhZ2U9e2Vycm9yLm1lc3NhZ2V9IC8+fVxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICBpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJwYXNzd29yZFwiXS5pc1ZhbGlkfVxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJwYXNzd29yZFwiXS5tZXNzYWdlfVxuICAgICAgLz5cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgbGFiZWw9XCJDb25maXJtXCJcbiAgICAgICAgdmFsdWU9e2NvbmZpcm19XG4gICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgIGlkPVwiY29uZmlybVwiXG4gICAgICAgIG5hbWU9XCJjb25maXJtXCJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJjb25maXJtXCJdLmlzVmFsaWR9XG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImNvbmZpcm1cIl0ubWVzc2FnZX1cbiAgICAgIC8+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICBkYXRhLXRlc3RpZD1cImNoYW5nZS1wYXNzLWJ0blwiXG4gICAgICAgIG9uQ2xpY2s9e29uUGFzc3dvcmRDaGFuZ2V9XG4gICAgICAgIHRpdGxlPVwiQ2hhbmdlXCJcbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IENoYW5nZVBhc3N3b3JkIGZyb20gXCJmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkXCI7XG5jb25zdCB2YWxpZGF0aW9uU3VjY2VzcyA9IHtcbiAgcGFzc3dvcmQ6IHsgaXNWYWxpZDogdHJ1ZSwgbWVzc2FnZTogXCIuXCIgfSxcbiAgY29uZmlybTogeyBpc1ZhbGlkOiB0cnVlLCBtZXNzYWdlOiBcIi5cIiB9LFxufTtcbmNvbnN0IHZhbGlkYXRpb25FcnJvciA9IHtcbiAgcGFzc3dvcmQ6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IFwiaW52YWxpZCBwYXNzd29yZCBmb3JtYXRcIiB9LFxuICBjb25maXJtOiB7IGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiBcImludmFsaWQgcGFzc3dvcmQgZm9ybWF0XCIgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDaGFuZ2VQYXNzd29yZFN0YXRlcygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+IENoYW5nZVBhc3N3b3JkIFZhbGlkYXRpb24gU3VjY2VzczwvaDU+XG4gICAgICAgICAgPENoYW5nZVBhc3N3b3JkXG4gICAgICAgICAgICBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICBjb25maXJtPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+Q2hhbmdlUGFzc3dvcmQgVmFsaWRhdGlvbiBFcnJvcjwvaDU+XG4gICAgICAgICAgPENoYW5nZVBhc3N3b3JkIHZhbGlkYXRpb249e3ZhbGlkYXRpb25FcnJvcn0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5DaGFuZ2VQYXNzd29yZCBpbiBwcm9ncmVzczwvaDU+XG4gICAgICAgICAgPENoYW5nZVBhc3N3b3JkXG4gICAgICAgICAgICBwYXNzd29yZD1cIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICBjb25maXJtPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgICAgbG9hZGluZ1xuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+Q2hhbmdlUGFzc3dvcmQgU2VydmVyIGVycm9yPC9oNT5cbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmRcbiAgICAgICAgICAgIHBhc3N3b3JkPVwiMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgIGNvbmZpcm09XCIxMjM0NTY3ODlcIlxuICAgICAgICAgICAgdmFsaWRhdGlvbj17dmFsaWRhdGlvblN1Y2Nlc3N9XG4gICAgICAgICAgICBlcnJvcj17eyBtZXNzYWdlOiBcIlNlcnZlciBpcyB1bmF2YWlsYWJsZVwiIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tIFwiY29udHJvbHMvdGV4dC1pbnB1dFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5pbXBvcnQgQWxlcnQgZnJvbSBcImNvbnRyb2xzL2FsZXJ0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZXF1ZXN0UGFzc0NoYW5nZShwcm9wcykge1xuICBjb25zdCB7XG4gICAgZW1haWwsXG4gICAgdmFsaWRhdGlvbixcbiAgICBvblJlcXVlc3RQYXNzd29yZENoYW5nZSxcbiAgICBsb2FkaW5nLFxuICAgIG9uQ2hhbmdlLFxuICAgIGVycm9yLFxuICB9ID0gcHJvcHM7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJjb2wtbWQtNCBib3JkZXIgbXgtYXV0byByb3VuZGVkXCJcbiAgICAgIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19XG4gICAgPlxuICAgICAge2xvYWRpbmcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCJcbiAgICAgICAgICAgIHJvbGU9XCJwcm9ncmVzc2JhclwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbm93PVwiMTAwXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxuICAgICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMTAwJVwiXG4gICAgICAgICAgPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7ZXJyb3IgJiYgPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT17ZXJyb3IubWVzc2FnZX0gLz59XG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIGxhYmVsPVwiRW1haWxcIlxuICAgICAgICB2YWx1ZT17ZW1haWx9XG4gICAgICAgIG5hbWU9XCJlbWFpbFwiXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgaWQ9XCJlbWFpbFwiXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImVtYWlsXCJdLmlzVmFsaWR9XG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImVtYWlsXCJdLm1lc3NhZ2V9XG4gICAgICAvPlxuICAgICAgPEJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgb25DbGljaz17b25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2V9XG4gICAgICAgIGRhdGEtdGVzdGlkPVwicmVxdWVzdHBhc3NjaGFuZ2UtYnRuXCJcbiAgICAgICAgdGl0bGU9XCJSZXF1ZXN0IHBhc3N3b3JkIGNoYW5nZVwiXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIGJnPVwicHJpbWFyeVwiXG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBGb3Jnb3RQYXNzd29yZCBmcm9tIFwiZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9Gb3Jnb3RQYXNzd29yZFwiO1xuY29uc3QgdmFsaWRhdGlvblN1Y2Nlc3MgPSB7IGVtYWlsOiB7IGlzVmFsaWQ6IHRydWUsIG1lc3NhZ2U6IFwiLlwiIH0gfTtcbmNvbnN0IHZhbGlkYXRpb25FcnJvciA9IHtcbiAgZW1haWw6IHsgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCBlbWFpbCBmb3JtYXRcIiB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZvcmZvdFBhc3N3b3JkU3RhdGUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPiBGb3Jnb3RQYXNzd29yZCBWYWxpZGF0aW9uIFN1Y2Nlc3M8L2g1PlxuXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkXG4gICAgICAgICAgICBlbWFpbD1cInRlc3RAZ21haWwuY29tXCJcbiAgICAgICAgICAgIHZhbGlkYXRpb249e3ZhbGlkYXRpb25TdWNjZXNzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+Rm9yZ290UGFzc3dvcmQgVmFsaWRhdGlvbiBFcnJvcjwvaDU+XG5cbiAgICAgICAgICA8Rm9yZ290UGFzc3dvcmQgZW1haWw9XCJ0ZXN0Z21haWwuY29tXCIgdmFsaWRhdGlvbj17dmFsaWRhdGlvbkVycm9yfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlJlcXVlc3QgUGFzc3dvcmQgQ2hhbmdlIGluIHByb2dyZXNzPC9oNT5cblxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZFxuICAgICAgICAgICAgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31cbiAgICAgICAgICAgIGxvYWRpbmdcbiAgICAgICAgICAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29sLW1kLTEyXCI+XG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+U2VydmVyIGVycm9yPC9oNT5cblxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZFxuICAgICAgICAgICAgZW1haWw9XCJ0ZXN0QGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uPXt2YWxpZGF0aW9uU3VjY2Vzc31cbiAgICAgICAgICAgIGVycm9yPXt7IG1lc3NhZ2U6IFwiU2VydmVyIGlzIHVuYXZhaWxhYmxlXCIgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBBcHBSb3V0ZSB9IGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuaW1wb3J0IExvZ2luU3RhdGVzIGZyb20gXCIuL3N0YXRlcy9sb2dpbi5zdGF0ZXNcIjtcbmltcG9ydCBTaWduVXBTdGF0ZXMgZnJvbSBcIi4vc3RhdGVzL3NpZ251cC5zdGF0ZXNcIjtcbmltcG9ydCBDaGFuZ2VQYXNzd29yZFN0YXRlcyBmcm9tIFwiLi9zdGF0ZXMvY2hhbmdlLXBhc3N3b3JkLnN0YXRlc1wiO1xuaW1wb3J0IEZvcmdvdFBhc3N3b3JkU3RhdGVzIGZyb20gXCIuL3N0YXRlcy9mb3Jnb3QtcGFzc3dvcmQuc3RhdGVzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoRGVtb1JvdXRlcygpIHtcbiAgcmV0dXJuIFtcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9sb2dpblwiPlxuICAgICAgPExvZ2luU3RhdGVzIC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gICAgPEFwcFJvdXRlIHBhdGg9XCIvc2lnbnVwXCI+XG4gICAgICA8U2lnblVwU3RhdGVzIC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gICAgPEFwcFJvdXRlIHBhdGg9XCIvY2hhbmdlLXBhc3N3b3JkXCI+XG4gICAgICA8Q2hhbmdlUGFzc3dvcmRTdGF0ZXMgLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9mb3Jnb3QtcGFzc3dvcmRcIj5cbiAgICAgIDxGb3Jnb3RQYXNzd29yZFN0YXRlcyAvPlxuICAgIDwvQXBwUm91dGU+LFxuICBdO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcImNvbnRyb2xzL2J1dHRvblwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uRGVtbygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcbiAgICAgICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwieWVsbG93XCIsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMz5GaWxsZWQgQnV0dG9uczwvaDM+XG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCI+UHJpbWFyeTwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uIGJnPVwic2Vjb25kYXJ5XCI+U2Vjb25kYXJ5PC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gYmc9XCJzdWNjZXNzXCI+U3VjY2VzczwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uIGJnPVwiZGFuZ2VyXCI+RGFuZ2VyPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gYmc9XCJ3YXJuaW5nXCI+V2FybmluZzwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uIGJnPVwiaW5mb1wiPkluZm88L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvbiBiZz1cImxpZ2h0XCI+TGlnaHQ8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvbiBiZz1cImRhcmtcIj5EYXJrPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gYmc9XCJsaW5rXCI+TGluazwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2PlxuICAgICAgICA8aDM+T3V0bGluZWQgQnV0dG9uczwvaDM+XG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgb3V0bGluZT17dHJ1ZX0gdGl0bGU9XCJQcmltYXJ5XCIgLz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cInNlY29uZGFyeVwiIG91dGxpbmUgdGl0bGU9XCJTZWNvbmRhcnlcIiAvPlxuICAgICAgICA8QnV0dG9uIGJnPVwic3VjY2Vzc1wiIG91dGxpbmUgdGl0bGU9XCJTdWNjZXNzXCIgLz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cImRhbmdlclwiIG91dGxpbmUgdGl0bGU9XCJEYW5nZXJcIiAvPlxuICAgICAgICA8QnV0dG9uIGJnPVwid2FybmluZ1wiIG91dGxpbmUgdGl0bGU9XCJXYXJuaW5nXCIgLz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cImluZm9cIiBvdXRsaW5lIHRpdGxlPVwiSW5mb1wiIC8+XG4gICAgICAgIDxCdXR0b24gYmc9XCJsaWdodFwiIG91dGxpbmUgdGl0bGU9XCJMaWdodFwiIC8+XG4gICAgICAgIDxCdXR0b24gYmc9XCJkYXJrXCIgb3V0bGluZSB0aXRsZT1cIkRhcmtcIiAvPlxuICAgICAgICA8QnV0dG9uIGJnPVwibGlua1wiIG91dGxpbmUgdGl0bGU9XCJMaW5rXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiB9fT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDM+U21hbGwgQnV0dG9uczwvaDM+XG4gICAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiBzaXplPVwic21cIiB0aXRsZT1cImxpbmtcIiAvPlxuICAgICAgICAgIDxCdXR0b24gYmc9XCJzZWNvbmRhcnlcIiBzaXplPVwic21cIiB0aXRsZT1cIlNlY29uZGFyeVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aDM+TGFyZ2UgQnV0dG9uczwvaDM+XG4gICAgICAgIDxCdXR0b24gYmc9XCJwcmltYXJ5XCIgc2l6ZT1cImxnXCIgdGl0bGU9XCJMaW5rXCIgLz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cInNlY29uZGFyeVwiIHNpemU9XCJsZ1wiIHRpdGxlPVwiU2Vjb25kYXJ5XCIgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdj48L2Rpdj5cblxuICAgICAgPGRpdj5cbiAgICAgICAgPGgzPiBEaXNhYmxlZCBCdXR0b25zPC9oMz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiBkaXNhYmxlZCB0aXRsZT1cIkxpbmtcIiAvPlxuICAgICAgICA8QnV0dG9uIGJnPVwic2Vjb25kYXJ5XCIgZGlzYWJsZWQgdGl0bGU9XCJTZWNvbmRhcnlcIiAvPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMz4gU3Bpbm5pbmcgQnV0dG9uPC9oMz5cbiAgICAgICAgPEJ1dHRvbiBiZz1cInByaW1hcnlcIiB0aXRsZT1cIlNwaW5uaW5nXCIgbG9hZGluZyAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tIFwiY29udHJvbHMvdGV4dC1pbnB1dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUZXh0SW5wdXRTdGF0ZXMoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxoNT5WYWxpZGF0aW9uPC9oNT5cbiAgICAgICAgPFRleHRJbnB1dCBpc1ZhbGlkPXt0cnVlfSAvPlxuICAgICAgICA8VGV4dElucHV0IGlzVmFsaWQ9e2ZhbHNlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFDQUNBUUFBQUJwTjZsQUFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQUFtSkxSMFFBQUtxTkl6SUFBQUFKY0VoWmN3QUFEc1FBQUE3RUFaVXJEaHNBQUFBSGRFbE5SUWZrQkJzSUtpUHdobW1JQUFBSHFVbEVRVlI0MnQyZGFXeFVWUlRIZjMwdHBWUkd3TElXS0FVcVlSV0lBWldxUktpMldCQXdFc0lubzN3d3VNZUVTSkFQaU1vU0M5Z1FTUGdDb1Y4Z0dtU0xMQ0pFMmJHQVVsWXArMUtXVXJhaGdGQ21mcGdNTTIxbmUrL2RjKy9VY3o0UU91K2U4LytmOStiT3ZlZWVlMThTdWlTSnJ2U21LOWxrMFlZTU1rZ2psYWVBYWg3eWdDcXF1TVlGem5LYVk1eWhWaGNzYWVsSUxya01vaThlRzYyOEhLS1VuZXlrUWs4ZzFFc2FCUlR6RDdVdTlUanp5YWVwYVRwMnBBbUZsSERMTmZWUXZjVXlDbWxpbWxwc3lXRTY1NVZTRDlVckZOUEhOTVhJOGpMcjhJbVJEK29PUm1ub3UyeEpFbU00b0lGNlVQY3pPbkdDVU1BK3JlUURXa3ErYWVyUWczVkd5QWQwTTMzTmtVK25pSWRHNmRkU3kwUG0wTXdFL1R4T0dTY2YwSEtHNlNXZnhtd2VHNmNkcWo0V2s2NkxmajhPR3ljY1RzdjBqQkVtY05jNDFVaDZqM2RseVNjenp6akpXRnFFSlVVL2xSWEc2Y1dqUDVNbVFiODVtNHhUaTFlMzhyUnErdTNZYjV5V0hkMUhXNVgwc3lrM1RzbXVuaUJiRmYwMkhEZE94NG1lcEwwSytwNUc5dkNINmtGYXVxV2Yyb2k2dm5DNjFWMHl6ZUpINHhUYzZpcVNvMUdNK2lGem1hamlXMlJVZXBMR2I4NmFUakIrOTlTb2o5Rk82UGVqMmpoMFZYcWR6bmJwcDNIUU9HeVZ1aWRTU2oxU0h6Q2ZVVXErZ1lraW5VaTEweFBrYVVsdjYxVWZROE5SRFpkYVRxZU03cVp2bVlBY1pRQ1A2djh4M0ZkZ0ZvVmFBRld4ai8wY294S1BsclJtRzd6c2luMVpMeDZKUDQ3WG1GRXZuZDJQYjZrVTkrdWxVK3dBYkJBR2NaK3ZJNlF2MC9tR0I4TGVmNHBGdjBBWXdDa0dSdlgvUEtlRkVReVA1ajVKZUpIckw5ckZmQUxiVXlhS1lWczA1Mk9GNzM1cytnQ3RPU0dLNDVYSXJpVlhlUCtsWDF6MEFmcHdUeERKcGtodWg0dkdmVnJjOUFFK0VjVXlLTHpUOVlJdUQ1QmlLd0RKb25tbzFlRmNQaXM2L0xVL3M1RHNqM3poUnJwekJCMldPMWl0U1JaZGZmNnV2cnNtVkFpNis5UTJmWUF2QkJGZHJqODlIaW42d0RsYnBPZ2dpS21XQXIrVHdLTTUzaEhFK09RWTF4eTF1OHdKUVZUalF3UFFWRFQ5OFlmamxyOExvaHBEYWpBQXI5RkMwTlVPQXkxalMwdC9nc1FmZ0JHQ2pxRGNjY3VUb3JqeWd3RW9FSFYweVhITGk2SzRSZ1FDMEpFZW9vN3VHbWdaai9TbWd6OEF1YUp1NExIamxvOGN0NHhQaHVnSmdQTnFqWmJDeUhMOUFSamsycEFVRGNuZkpvREJZSkVrWG0yYjZiaGxSMkZrZlVteTZHNXJMNDhUNmUrNDVRQmhaQzNJc3VncDdNUU5qZWZFc2ZXMjZDYnVaSmpEclEyV2hoTG9iSXN1NGs0NjhvS2pkaS9SUVJ4YlY0c3NjU2RPNTVxU005U0FkTEhVRmhSR2tJbTBzdDJtRmU5cFFOYkc0aGtOYmp4OGFMdk5SelRYZ0N3RDBWUllVTy9ZTEZMcGdsY0xyb3VXcHYwMkhoYlp1bjZSbHZzUDZZaXV3ZFRWeVhIRG1xb05VelhVYUhQMm1IZmlvajlPNDM2a0dwMEJxS1VtanM3d2ZhMWI4V3JRWGcyNElNcmN3OE5DeldpcTRhWm1sN1ZjaUREL3pCVGNkeDVKYjFqYzA5TGJoa29uZjBLNmdYakZwNzhOcGRyaWhuYW5OUnlORUlCVDJyRlVXVnpYN0xLV3oza1E0Yk5pTkIyZFlpNEFGWXhrWWNSUEZ6S0dLMXJ4WExjNHI4Mlpsem4wWkgzVWE5YVN3eFJ1YXNOMEZqN1cwOXN5dzhhTXNDVXpOUDA2VFpKZEdQZnJaU1k3eURzK3pSU3VpR01yZ0c2aURyeE1jN0d0dlJsZkNjOEtzeUNKMjBMR0gxT2lJS21WeVdLeHVjRXRmN1p5cDRqeGNsNTBUVDRnUTRRS2FMZjdWNFpLbFFFTnlrb0dza2VadFYwTVpJMEF5ai85LzR4VEh0bDVBbnY0a3dVbVNtLzdUV2NxTm1zdjkyTkhGaWhHK21SdnNjck4wYXZrVG5BZ21WOFVJajBjTlB5RE1xTlhoZFBzclJXT0RiNFBtczFYWm5Tc0tIMVEyV1BsQlkwMlZYVDYzejR0QjV5VktzRjZzMjVXWXBrU28yOXFvSytxakhwSlhhT0ZDa3hlMUhUQW5hVmtNZWVOdWtaVEZCZ3Qxa0lmWUpGcnJFK0twUU0vV1RXVXVJWWxNVllMTDZ0ZFcxalNzQUl0eCtXR0NaOTRTVk5RV3JtOC83N3daU0h1QmhtbnRkRUhPT2NLNjlxZ29kQlIyMXhYa0E2N2FxM1hXMUg0QUd6bGdBdWpsVm9EY05WRjI3MmhteWZyanR0bnVEQjdXMnNBN3Job1c0ZGwzUUNzQ2N5UU5VUFM2YTJVRGFIL3JUOTB5V2VqUThPWHRHYjAyenRlUmh2TzF1Z1hxSnh3SnA2dXFFKzM0ZUExaHlNUkZpOGJ2M2pwVlgvN1JzTWpORzdnRVMrZ055VlQrYlgrbjhKTlg1cFJSbzVwckFKeWhJRU5COERoMGxmMytRRGRxN1R5NG1OU3VCMG80UTlTT2tNcmhWbjl4SkJaTExWemVWUCtOdDVqcTlUZDl0OU8wU2VCRDFDMnE1WHhISi9UVU1iK1R3N1U4dkdXMCs5TmtYSHdLblNtODQ3RGFpUm5TVWZUNWU0V2FwcXcwVGdGTjdyRi9SdUtQSWJlSUtKQ1M5WFVuTGR1dEFjcngzZHdVeHlTTFh5Mms0U2VVTHNkTElQZHhpblowVkwxaTdUTkcxRjN1RVg5OGZvQXFTdzNUaTBlWFNuemdnVUFpemtKUGpyME1WT3dRQU9BUEEzbGkwNjFVcy82ZENlMkc2Y2FUdmVxZTZWQ0xFbGhlc0s5YUtsWTkrc1loeWJRNjViS29wMFNLZmtjZk1ZZDQrU3JtVzR5aTUxSmlWSDY2N1RzZm84aHc5bG1oUHh1M2UrWWl5YXZhaDRuN3RWVWtHVkwrbE9pWVIrcWo4MkpmUFIvWjc1MFdiMFJUU3VZM1JqT3ZVK2hnS1dLOS96Y1lBbjVOayttTlN5cHZNNWNqcmltZnBnaTh1Uis2T1JMRzl1VFN5NkQ2V3VyaXV3Mmh5aGxCenRkRmNNa1JBQ0NrazB2dXBKTkZtM0pJSU4wVXZBQVhtcTRSeFZWWE9VQ1p6akRNYzdwQXZVZmgyd0NNd2xpSjNBQUFBQWxkRVZZZEdSaGRHVTZZM0psWVhSbEFESXdNakF0TURRdE1qZFVNRGc2TkRJNk16VXJNREE2TUREK3FWczBBQUFBSlhSRldIUmtZWFJsT20xdlpHbG1lUUF5TURJd0xUQTBMVEkzVkRBNE9qUXlPak0xS3pBd09qQXdqL1RqaUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBQUFTVVZPUks1Q1lJST1cIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgdXNlckltYWdlIGZyb20gXCIuL3VzZXIucG5nXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUb2FzdCgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJ0b2FzdFwiXG4gICAgICByb2xlPVwiYWxlcnRcIlxuICAgICAgYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCJcbiAgICAgIGFyaWEtYXRvbWljPVwidHJ1ZVwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2FzdC1oZWFkZXJcIj5cbiAgICAgICAgPGltZyBzcmM9e3VzZXJJbWFnZX0gY2xhc3NOYW1lPVwicm91bmRlZCBtci0yXCIgYWx0PVwiLi4uXCIgLz5cbiAgICAgICAgPHN0cm9uZyBjbGFzc05hbWU9XCJtci1hdXRvXCI+Qm9vdHN0cmFwPC9zdHJvbmc+XG4gICAgICAgIDxzbWFsbCBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkXCI+anVzdCBub3c8L3NtYWxsPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwibWwtMiBtYi0xIGNsb3NlXCJcbiAgICAgICAgICBkYXRhLWRpc21pc3M9XCJ0b2FzdFwiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIkNsb3NlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvYXN0LWJvZHlcIj5TZWU/IEp1c3QgbGlrZSB0aGlzLjwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBUb2FzdCBmcm9tIFwiY29udHJvbHMvdG9hc3RcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRvYXN0RGVtbygpIHtcbiAgcmV0dXJuIDxUb2FzdCAvPjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgQWxlcnQgZnJvbSBcImNvbnRyb2xzL2FsZXJ0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydERlbW8oKSB7XG4gIHJldHVybiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPVwiU2VydmVyIGlzIHRlbXBvcmFyaWx5IHVuYXZhaWxhYmxlXCIgLz47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgQXBwUm91dGUgfSBmcm9tIFwiY29tcG9uZW50cy9hcHAtcm91dGVcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vYnV0dG9uXCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCIuL3RleHQtaW5wdXRcIjtcbmltcG9ydCBUb2FzdERlbW8gZnJvbSBcIi4vdG9hc3RcIjtcbmltcG9ydCBBbGVydERlbW8gZnJvbSBcIi4vYWxlcnRcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbXBvbmVudHNSb3V0ZSgpIHtcbiAgcmV0dXJuIFtcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9idXR0b25cIj5cbiAgICAgIDxCdXR0b24gLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi90ZXh0LWlucHV0XCI+XG4gICAgICA8VGV4dElucHV0IC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gICAgPEFwcFJvdXRlIHBhdGg9XCIvdG9hc3RcIj5cbiAgICAgIDxUb2FzdERlbW8gLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9hbGVydFwiPlxuICAgICAgPEFsZXJ0RGVtbyAvPlxuICAgIDwvQXBwUm91dGU+LFxuICBdO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2Vhckljb24ocHJvcHMpIHtcbiAgY29uc3QgeyBjb2xvciB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPHN2Z1xuICAgICAgey4uLnByb3BzfVxuICAgICAgd2lkdGg9XCIxZW1cIlxuICAgICAgaGVpZ2h0PVwiMWVtXCJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMTYgMTZcIlxuICAgICAgY2xhc3NOYW1lPVwiYmkgYmktZ2VhclwiXG4gICAgICBmaWxsPXtjb2xvcn1cbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgID5cbiAgICAgIDxwYXRoXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgZmlsbC1ydWxlPVwiZXZlbm9kZFwiXG4gICAgICAgIGQ9XCJNOC44MzcgMS42MjZjLS4yNDYtLjgzNS0xLjQyOC0uODM1LTEuNjc0IDBsLS4wOTQuMzE5QTEuODczIDEuODczIDAgMCAxIDQuMzc3IDMuMDZsLS4yOTItLjE2Yy0uNzY0LS40MTUtMS42LjQyLTEuMTg0IDEuMTg1bC4xNTkuMjkyYTEuODczIDEuODczIDAgMCAxLTEuMTE1IDIuNjkybC0uMzE5LjA5NGMtLjgzNS4yNDYtLjgzNSAxLjQyOCAwIDEuNjc0bC4zMTkuMDk0YTEuODczIDEuODczIDAgMCAxIDEuMTE1IDIuNjkzbC0uMTYuMjkxYy0uNDE1Ljc2NC40MiAxLjYgMS4xODUgMS4xODRsLjI5Mi0uMTU5YTEuODczIDEuODczIDAgMCAxIDIuNjkyIDEuMTE2bC4wOTQuMzE4Yy4yNDYuODM1IDEuNDI4LjgzNSAxLjY3NCAwbC4wOTQtLjMxOWExLjg3MyAxLjg3MyAwIDAgMSAyLjY5My0xLjExNWwuMjkxLjE2Yy43NjQuNDE1IDEuNi0uNDIgMS4xODQtMS4xODVsLS4xNTktLjI5MWExLjg3MyAxLjg3MyAwIDAgMSAxLjExNi0yLjY5M2wuMzE4LS4wOTRjLjgzNS0uMjQ2LjgzNS0xLjQyOCAwLTEuNjc0bC0uMzE5LS4wOTRhMS44NzMgMS44NzMgMCAwIDEtMS4xMTUtMi42OTJsLjE2LS4yOTJjLjQxNS0uNzY0LS40Mi0xLjYtMS4xODUtMS4xODRsLS4yOTEuMTU5QTEuODczIDEuODczIDAgMCAxIDguOTMgMS45NDVsLS4wOTQtLjMxOXptLTIuNjMzLS4yODNjLjUyNy0xLjc5IDMuMDY1LTEuNzkgMy41OTIgMGwuMDk0LjMxOWEuODczLjg3MyAwIDAgMCAxLjI1NS41MmwuMjkyLS4xNmMxLjY0LS44OTIgMy40MzQuOTAxIDIuNTQgMi41NDFsLS4xNTkuMjkyYS44NzMuODczIDAgMCAwIC41MiAxLjI1NWwuMzE5LjA5NGMxLjc5LjUyNyAxLjc5IDMuMDY1IDAgMy41OTJsLS4zMTkuMDk0YS44NzMuODczIDAgMCAwLS41MiAxLjI1NWwuMTYuMjkyYy44OTMgMS42NC0uOTAyIDMuNDM0LTIuNTQxIDIuNTRsLS4yOTItLjE1OWEuODczLjg3MyAwIDAgMC0xLjI1NS41MmwtLjA5NC4zMTljLS41MjcgMS43OS0zLjA2NSAxLjc5LTMuNTkyIDBsLS4wOTQtLjMxOWEuODczLjg3MyAwIDAgMC0xLjI1NS0uNTJsLS4yOTIuMTZjLTEuNjQuODkzLTMuNDMzLS45MDItMi41NC0yLjU0MWwuMTU5LS4yOTJhLjg3My44NzMgMCAwIDAtLjUyLTEuMjU1bC0uMzE5LS4wOTRjLTEuNzktLjUyNy0xLjc5LTMuMDY1IDAtMy41OTJsLjMxOS0uMDk0YS44NzMuODczIDAgMCAwIC41Mi0xLjI1NWwtLjE2LS4yOTJjLS44OTItMS42NC45MDItMy40MzMgMi41NDEtMi41NGwuMjkyLjE1OWEuODczLjg3MyAwIDAgMCAxLjI1NS0uNTJsLjA5NC0uMzE5elwiXG4gICAgICAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgICBmaWxsLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgZD1cIk04IDUuNzU0YTIuMjQ2IDIuMjQ2IDAgMSAwIDAgNC40OTIgMi4yNDYgMi4yNDYgMCAwIDAgMC00LjQ5MnpNNC43NTQgOGEzLjI0NiAzLjI0NiAwIDEgMSA2LjQ5MiAwIDMuMjQ2IDMuMjQ2IDAgMCAxLTYuNDkyIDB6XCJcbiAgICAgIC8+XG4gICAgPC9zdmc+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IEdlYXJJY29uIGZyb20gXCJpY29ucy9ib290c3RyYXAvR2Vhckljb25cIjtcbmNvbnN0IHN0eWxlcyA9IHtcbiAgcm9vdDoge1xuICAgIGJhY2tncm91bmRDb2xvcjogXCIjZWVlZWVlXCIsXG4gICAgaGVpZ2h0OiBcIjEwMCVcIixcbiAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExheW91dCh7IGNoaWxkcmVuLCBzdHlsZSwgaWQsIGhhbmdvdXQsIG9uTmF2aWdhdGlvbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD17aWR9IHN0eWxlPXt7IC4uLnN0eWxlcy5yb290LCAuLi5zdHlsZSB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuL0xheW91dFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5jb25zdCBzdHlsZSA9IHtcbiAgY2hlY2tib3g6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgY2hlY2tib3hSb290OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICBwYWRkaW5nOiAxNixcbiAgfSxcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgIHBhZGRpbmdUb3A6IDY4LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2soeyBvbkNhbmNlbCwgb25CbG9jaywgb25SZXBvcnQgfSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jaGVja2JveFJvb3R9PlxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3N0eWxlLmNoZWNrYm94fSBvbkNoYW5nZT17b25SZXBvcnR9IC8+XG4gICAgICAgIDxsYWJlbD5SZXBvcnQ8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY2FuY2VsLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICAgIHRpdGxlPVwiQ2FuY2VsXCJcbiAgICAgICAgICAgIGJnPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIG91dGxpbmVcbiAgICAgICAgICAgIGJsb2NrXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBpZD1cIkJMT0NLXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQmxvY2t9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImJsb2NrLWJ0blwiXG4gICAgICAgICAgICB0aXRsZT1cIkJsb2NrXCJcbiAgICAgICAgICAgIGJnPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBibG9ja1xuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuZXhwb3J0IGZ1bmN0aW9uIEJsb2NrKHtcbiAgaGVpZ2h0ID0gMjQsXG4gIHdpZHRoID0gMjQsXG4gIGZpbGwgPSBcIm5vbmVcIixcbiAgY29sb3IgPSBcImJsYWNrXCIsXG4gIG9uQ2xpY2ssXG4gIGlkLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxzdmdcbiAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICB3aWR0aD17d2lkdGh9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgaWQ9e2lkfVxuICAgID5cbiAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD17ZmlsbH0gaWQ9e2lkfSAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgaWQ9e2lkfVxuICAgICAgICBmaWxsPXtjb2xvcn1cbiAgICAgICAgZD1cIk0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek00IDEyYzAtNC40MiAzLjU4LTggOC04IDEuODUgMCAzLjU1LjYzIDQuOSAxLjY5TDUuNjkgMTYuOUM0LjYzIDE1LjU1IDQgMTMuODUgNCAxMnptOCA4Yy0xLjg1IDAtMy41NS0uNjMtNC45LTEuNjlMMTguMzEgNy4xQzE5LjM3IDguNDUgMjAgMTAuMTUgMjAgMTJjMCA0LjQyLTMuNTggOC04IDh6XCJcbiAgICAgIC8+XG4gICAgPC9zdmc+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuZXhwb3J0IGZ1bmN0aW9uIENlbnRlcih7IGNoaWxkcmVuLCBzdHlsZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIC4uLnN0eWxlLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5pbXBvcnQgeyBCbG9jayB9IGZyb20gXCJpY29ucy9CbG9ja1wiO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSBcImNvbXBvbmVudHMvbGF5b3V0L0NlbnRlclwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuL0xheW91dFwiO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgIHBhZGRpbmdUb3A6IDY4LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxvY2tlZCh7IGhhbmdvdXQsIG9uVW5ibG9jaywgb25DbG9zZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fSBpZD1cImJsb2NrZWQtdWlcIj5cbiAgICAgIDxDZW50ZXIgc3R5bGU9e3sgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgPEJsb2NrIHdpZHRoPVwiNjBcIiBoZWlnaHQ9XCI3MFwiIGNvbG9yPVwicmVkXCIgLz5cbiAgICAgICAgPGI+e2hhbmdvdXQgJiYgaGFuZ291dC51c2VybmFtZX08L2I+IGlzIGJsb2NrZWRcbiAgICAgIDwvQ2VudGVyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xcIj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNsb3NlLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgdGl0bGU9XCJDTE9TRVwiXG4gICAgICAgICAgICBiZz1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBibG9ja1xuICAgICAgICAgICAgb3V0bGluZVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbFwiPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGlkPVwiVU5CTE9DS1wiXG4gICAgICAgICAgICBvbkNsaWNrPXtvblVuYmxvY2t9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInVuYmxvY2stYnRuXCJcbiAgICAgICAgICAgIHRpdGxlPVwiVU5CTE9DS1wiXG4gICAgICAgICAgICBiZz1cInByaW1hcnlcIlxuICAgICAgICAgICAgYmxvY2tcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvTGF5b3V0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmV4cG9ydCBmdW5jdGlvbiBEZWxldGUoe1xuICBoZWlnaHQgPSAyNCxcbiAgd2lkdGggPSAyNCxcbiAgY29sb3IgPSBcImJsYWNrXCIsXG4gIGZpbGwgPSBcIm5vbmVcIixcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9e3dpZHRofT5cbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGw9e2NvbG9yfVxuICAgICAgICBkPVwiTTYgMTljMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjdINnYxMnpNMTkgNGgtMy41bC0xLTFoLTVsLTEgMUg1djJoMTRWNHpcIlxuICAgICAgLz5cbiAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD17ZmlsbH0gLz5cbiAgICA8L3N2Zz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcmNoaXZlKHtcbiAgaGVpZ2h0ID0gMjQsXG4gIHdpZHRoID0gMjQsXG4gIGNvbG9yID0gXCJibGFja1wiLFxuICBmaWxsID0gXCJub25lXCIsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPHN2ZyBoZWlnaHQ9ezI0fSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9e3dpZHRofT5cbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGw9e2NvbG9yfVxuICAgICAgICBkPVwiTTIwLjU0IDUuMjNsLTEuMzktMS42OEMxOC44OCAzLjIxIDE4LjQ3IDMgMTggM0g2Yy0uNDcgMC0uODguMjEtMS4xNi41NUwzLjQ2IDUuMjNDMy4xNyA1LjU3IDMgNi4wMiAzIDYuNVYxOWMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjYuNWMwLS40OC0uMTctLjkzLS40Ni0xLjI3ek0xMiAxNy41TDYuNSAxMkgxMHYtMmg0djJoMy41TDEyIDE3LjV6TTUuMTIgNWwuODEtMWgxMmwuOTQgMUg1LjEyelwiXG4gICAgICAvPlxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPXtmaWxsfSAvPlxuICAgIDwvc3ZnPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBMYXlvdXQgZnJvbSBcIi4vTGF5b3V0XCI7XG5pbXBvcnQgeyBEZWxldGUgfSBmcm9tIFwiaWNvbnMvRGVsZXRlXCI7XG5pbXBvcnQgeyBBcmNoaXZlIH0gZnJvbSBcImljb25zL0FyY2hpdmVcIjtcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSBcImljb25zL0Jsb2NrXCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmNvbnN0IHN0eWxlID0ge1xuICBpY29uQnRuOiB7IGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBtYXJnaW46IDggfSxcbiAgYnRuOiB7IG1hcmdpblJpZ2h0OiA4IH0sXG4gIGJ0bkNvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gIH0sXG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxuICAgIGhlaWdodDogXCIxMDAlXCIsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWd1cmUoe1xuICBvbkJsb2NrLFxuICBvbkRlbGV0ZSxcbiAgb25BcmNoaXZlLFxuICBvbk5vdGlmaWNhdGlvbixcbiAgb25Db252ZXJzYXRpb25IaXN0b3J5LFxuICBvbk5hdmlnYXRpb24sXG4gIG9uT2ssXG59KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBzdHlsZT17c3R5bGUubGF5b3V0fT5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxDaGVja2JveCBsYWJlbD1cIk5vdGlmaWNhdGlvbnNcIiBvbkNoYW5nZT17b25Ob3RpZmljYXRpb259IC8+XG4gICAgICAgIDxDaGVja2JveFxuICAgICAgICAgIGxhYmVsPVwiQ29udmVyc2F0aW9uIEhpc3RvcnlcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNvbnZlcnNhdGlvbkhpc3Rvcnl9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxociAvPlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuYnRuQ29udGFpbmVyfT5cbiAgICAgICAgPEljb25CdXR0b24gdGl0bGU9XCJBcmNoaXZlXCIgSWNvbj17QXJjaGl2ZX0gb25DbGljaz17b25BcmNoaXZlfSAvPlxuICAgICAgICA8SWNvbkJ1dHRvbiB0aXRsZT1cIkRlbGV0ZVwiIEljb249e0RlbGV0ZX0gb25DbGljaz17b25EZWxldGV9IC8+XG4gICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgaWQ9XCJiY2t1aVwiXG4gICAgICAgICAgdGl0bGU9XCJCbG9ja1wiXG4gICAgICAgICAgSWNvbj17QmxvY2t9XG4gICAgICAgICAgb25DbGljaz17b25OYXZpZ2F0aW9ufVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2PlxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uT2t9IHRpdGxlPVwiT0tcIiBiZz1cInByaW1hcnlcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG5cbmZ1bmN0aW9uIEljb25CdXR0b24oeyBJY29uLCB0aXRsZSwgb25DbGljaywgaWQgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlLmljb25CdG59PlxuICAgICAgPGJ1dHRvblxuICAgICAgICBpZD17aWR9XG4gICAgICAgIHN0eWxlPXtzdHlsZS5idG59XG4gICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgIGRhdGEtdGVzdGlkPXtgJHtpZH0tYnRuYH1cbiAgICAgID5cbiAgICAgICAgPEljb24gaWQ9e2lkfSAvPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8ZGl2Pnt0aXRsZX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gQ2hlY2tib3goeyBsYWJlbCwgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiA4LCBtYXJnaW5Ub3A6IDggfX0+XG4gICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgICAgPGxhYmVsPntsYWJlbH08L2xhYmVsPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tIFwiLi9kZXZpY2VUeXBlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KCkge1xuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtvcmllbnRhdGlvbiwgc2V0T3JpZW50YXRpb25dID0gdXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtkZXZpY2UsIHNldERldmljZV0gPSB1c2VTdGF0ZShcIlwiKTtcbiAgZnVuY3Rpb24gaGFuZGxlVmlld3BvcnRTaXplKCkge1xuICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICBzZXRIZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xuICB9XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHdpZHRoID4gMCkge1xuICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxuICAgICAgICAgIHNldERldmljZShcInBob25lXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHdpZHRoIDw9IDc2ODpcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcbiAgICAgICAgICBzZXREZXZpY2UoXCJ0YWJsZXRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcbiAgICAgICAgICBzZXREZXZpY2UoXCJsYXB0b3BcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugd2lkdGggPiAyNTYwOlxuICAgICAgICAgIHNldERldmljZShcImRlc2t0b3BcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc2V0RGV2aWNlKFwiXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW3dpZHRoXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImRldmljZVwiLCBkZXZpY2UpO1xuICB9LCBbZGV2aWNlXSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInByZWFjdC9ob29rc1wiO1xuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gXCJjb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5XCI7XG4vL2ltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcbmNvbnN0IHN0eWxlID0ge1xuICByb290OiB7XG4gICAgYm9yZGVyQ29sb3I6IFwiI2VlZWVlZVwiLFxuICAgIGJvcmRlclN0eWxlOiBcInNvbGlkXCIsXG4gICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgIHBhZGRpbmc6IDMsXG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gICAgbWluSGVpZ2h0OiAzNSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcbiAgfSxcbiAgdXNlcm5hbWU6IHsgbWFyZ2luUmlnaHQ6IDggfSxcbiAgbG9nOiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgY29sb3I6IFwiIzczNzM3M1wiLFxuICAgIGZvbnRTaXplOiAxMCxcbiAgfSxcbiAgbWVzc2FnZToge30sXG59O1xuLy9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1lc3NhZ2UocHJvcHMpIHtcbiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcbiAgY29uc3QgeyBmbG9hdCwgdXNlcm5hbWUsIHRpbWVzdGFtcCB9ID0gbWVzc2FnZTtcbiAgY29uc3QgW2RheXMsIHNldERheXNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtob3Vycywgc2V0SG91cnNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFttaW51dGVzLCBzZXRNaW51dGVzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbc2Vjb25kcywgc2V0U2Vjb25kc10gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcbiAgZnVuY3Rpb24gY29udmVydE1TKG1zKSB7XG4gICAgdmFyIGQsIGgsIG0sIHM7XG4gICAgcyA9IE1hdGguZmxvb3IobXMgLyAxMDAwKTtcbiAgICBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xuICAgIHMgPSBzICUgNjA7XG4gICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICBtID0gbSAlIDYwO1xuICAgIGQgPSBNYXRoLmZsb29yKGggLyAyNCk7XG4gICAgaCA9IGggJSAyNDtcbiAgICBzZXREYXlzKGQpO1xuICAgIHNldEhvdXJzKGgpO1xuICAgIHNldE1pbnV0ZXMobSk7XG4gICAgc2V0U2Vjb25kcyhzKTtcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHRpbWVzdGFtcCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnZlcnRNUyhEYXRlLm5vdygpIC0gdGltZXN0YW1wKTtcbiAgICAgIH0sIDApO1xuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb252ZXJ0TVMoRGF0ZS5ub3coKSAtIHRpbWVzdGFtcCk7XG4gICAgICB9LCA2MDAwMCk7XG4gICAgfVxuICB9LCBbdGltZXN0YW1wXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luQm90dG9tOiAzIH19PlxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5zdHlsZS5yb290LCBmbG9hdCB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWVzc2FnZVwiXG4gICAgICAgICAgc3R5bGU9e3N0eWxlLm1lc3NhZ2V9XG4gICAgICAgICAgY2xhc3NOYW1lPXtgbWVzc2FnZS1mb250LSR7ZGV2aWNlfS1zaXplYH1cbiAgICAgICAgPlxuICAgICAgICAgIHttZXNzYWdlICYmIG1lc3NhZ2UudGV4dH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmxvZ30+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGUudXNlcm5hbWV9Pnt1c2VybmFtZSAmJiB1c2VybmFtZX06PC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIHttaW51dGVzID09PSAwICYmIDxkaXY+Tm93PC9kaXY+fVxuICAgICAgICAgICAge2hvdXJzID09PSAwICYmIG1pbnV0ZXMgPiAwICYmIDxkaXY+e21pbnV0ZXN9IG1pbnV0ZXMgYWdvIDwvZGl2Pn1cbiAgICAgICAgICAgIHtob3VycyA+IDAgJiYgZGF5cyA9PT0gMCAmJiAoXG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge2hvdXJzfSBob3VycyB7bWludXRlc30gbWludXRlcyBhZ297XCIgXCJ9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtkYXlzIDw9IDEwICYmIGRheXMgPiAxICYmIDxkaXY+e2RheXN9IGRheXMgYWdvPC9kaXY+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSBcImNvbnRyb2xzL3RleHQtaW5wdXRcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcImNvbnRyb2xzL2J1dHRvblwiO1xuY29uc3Qgc3R5bGVzID0ge1xuICByb290OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAvLyBwb3NpdGlvbjonZml4ZWQnLFxuICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAvLyBib3R0b206MTAsXG4gICAgLy8gcmlnaHQ6MTAsXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgLy9tYXJnaW46MFxuICAgIHBhZGRpbmc6IDUsXG4gICAgbWFyZ2luTGVmdDogOCxcbiAgICBtYXJnaW5SaWdodDogOCxcbiAgICBtYXJnaW5Ub3A6IDgsXG4gICAgbWFyZ2luQm90dG9tOiA4LFxuICAgIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXG4gICAgZmxleDogMSxcbiAgICB3aWR0aDogXCIxMDAlXCIsXG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVzc2FnZUVkaXRvcih7XG4gIGxvYWRpbmcsXG4gIG1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2UsXG4gIGhhbmdvdXQsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgbWItM1wiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBkaXNhYmxlZD17aGFuZ291dCAmJiBoYW5nb3V0LnN0YXRlID09PSBcIkJMT0NLRURcIn1cbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJSZWNpcGllbnQncyB1c2VybmFtZVwiXG4gICAgICAgICAgYXJpYS1kZXNjcmliZWRieT1cImJ1dHRvbi1hZGRvbjJcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1pbnB1dFwiXG4gICAgICAgICAgdmFsdWU9e21lc3NhZ2VUZXh0fVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFwcGVuZFwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2hhbmdvdXQgJiYgaGFuZ291dC5zdGF0ZSA9PT0gXCJCTE9DS0VEXCJ9XG4gICAgICAgICAgICBpZD1cIk1FU1NBR0VcIlxuICAgICAgICAgICAgb25DbGljaz17b25NZXNzYWdlfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLWJ0blwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgU2VuZFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmNvbnN0IHN0eWxlID0ge1xuICBjb2xvcjogXCJyZWRcIixcbiAgZmxvYXQ6IFwicmlnaHRcIixcbiAgd2lkdGg6IFwiMTAwJVwiLFxuICBmb250U2l6ZTogMTYsXG4gIHRleHRBbGlnbjogXCJlbmRcIixcbn07XG5leHBvcnQgZnVuY3Rpb24gQmxvY2tlck1lc3NhZ2UoeyBtZXNzYWdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZX0gZGF0YS10ZXN0aWQ9XCJibG9ja2VyLW1lc3NhZ2VcIj5cbiAgICAgIHttZXNzYWdlLnRleHR9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGNvbG9yOiBcInJlZFwiLFxuICBmbG9hdDogXCJyaWdodFwiLFxuICB3aWR0aDogXCIxMDAlXCIsXG4gIGZvbnRTaXplOiAxNixcbiAgdGV4dEFsaWduOiBcImVuZFwiLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBCbG9ja2VkTWVzc2FnZSh7IG1lc3NhZ2UsIG9uTmF2aWdhdGlvbiB9KSB7XG4gIGZ1bmN0aW9uIGhhbmRsZU5hdmlnYXRpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBvbk5hdmlnYXRpb24oZSk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3N0eWxlfSBkYXRhLXRlc3RpZD1cImJsb2NrZWQtbWVzc2FnZVwiPlxuICAgICAge21lc3NhZ2UudGV4dH1cbiAgICAgIDxhXG4gICAgICAgIGlkPVwiVU5CTE9DS1wiXG4gICAgICAgIGRhdGEtdGVzdGlkPVwic2VlbW9yZS1idG5cIlxuICAgICAgICBocmVmPVwiL1wiXG4gICAgICAgIG9uQ2xpY2s9e2hhbmRsZU5hdmlnYXRpb259XG4gICAgICA+XG4gICAgICAgIHNlZSBtb3JlXG4gICAgICA8L2E+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiLi9NZXNzYWdlXCI7XG5pbXBvcnQgTWVzc2FnZUVkaXRvciBmcm9tIFwiLi9NZXNzYWdlRWRpdG9yXCI7XG5pbXBvcnQgeyBCbG9ja2VyTWVzc2FnZSB9IGZyb20gXCIuL0Jsb2NrZXJNZXNzYWdlXCI7XG5pbXBvcnQgeyBCbG9ja2VkTWVzc2FnZSB9IGZyb20gXCIuL0Jsb2NrZWRNZXNzYWdlXCI7XG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSBcImNvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnlcIjtcbmNvbnN0IHN0eWxlcyA9IHtcbiAgbWVzc2FnZUNvbnRhaW5lcjoge1xuICAgIC8vIHdpZHRoOiAnMTAwJScsXG4gICAgYm94U2l6aW5nOiBcImJvcmRlci1ib3hcIixcbiAgICBwYWRkaW5nOiAzLFxuICAgIC8vICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxuICAgIGZsZXg6IDMsXG4gICAgb3ZlcmZsb3dZOiBcImF1dG9cIixcbiAgICBvdmVyZmxvd1g6IFwiaGlkZGVuXCIsXG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTWVzc2FnZXMoe1xuICBtZXNzYWdlcyxcbiAgb25NZXNzYWdlLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBtZXNzYWdlVGV4dCxcbiAgdXNlcm5hbWUsXG4gIGhhbmdvdXQsXG4gIG9uTmF2aWdhdGlvbixcbiAgbG9hZGluZyxcbn0pIHtcbiAgY29uc3Qgc2Nyb2xsZXJSZWYgPSB1c2VSZWYobnVsbCk7XG4gIGNvbnN0IHsgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobWVzc2FnZXMpIHtcbiAgICAgIHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZXJSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQ7XG4gICAgfVxuICB9LCBbbWVzc2FnZXNdKTtcblxuICBmdW5jdGlvbiBvblNlbmQoZSkge1xuICAgIG9uTWVzc2FnZShlKTtcbiAgICBzY3JvbGxlclJlZi5jdXJyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVyUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgYm94U2l6aW5nOiBcImJvcmRlci1ib3hcIixcbiAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcbiAgICAgICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17eyAuLi5zdHlsZXMubWVzc2FnZUNvbnRhaW5lciwgZmxleDogZGV2aWNlID09PSBcInBob25lXCIgPyA0IDogMiB9fVxuICAgICAgICByZWY9e3Njcm9sbGVyUmVmfVxuICAgICAgPlxuICAgICAgICB7bWVzc2FnZXMgJiZcbiAgICAgICAgICBtZXNzYWdlcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgZmxvYXRNZXNzYWdlcyAmJlxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlczogc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSksIHVzZXJuYW1lIH0pLm1hcChcbiAgICAgICAgICAgIChtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIgfX0+XG4gICAgICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgICAgIHshbS50eXBlICYmIDxNZXNzYWdlIG1lc3NhZ2U9e219IC8+fVxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSBcImJsb2NrZXJcIiAmJiAoXG4gICAgICAgICAgICAgICAgICA8QmxvY2tlck1lc3NhZ2UgbWVzc2FnZT17bX0gLz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHttLnR5cGUgJiYgbS50eXBlID09PSBcImJsb2NrZWRcIiAmJiAoXG4gICAgICAgICAgICAgICAgICA8QmxvY2tlZE1lc3NhZ2UgbWVzc2FnZT17bX0gb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259IC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8TWVzc2FnZUVkaXRvclxuICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxuICAgICAgICBvbk1lc3NhZ2U9e29uU2VuZH1cbiAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbmZ1bmN0aW9uIGZsb2F0TWVzc2FnZXMoeyBtZXNzYWdlcywgdXNlcm5hbWUgfSkge1xuICBpZiAobWVzc2FnZXMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCAmJiB1c2VybmFtZSkge1xuICAgIHJldHVybiBtZXNzYWdlcy5tYXAoKG1zZykgPT4ge1xuICAgICAgaWYgKG1zZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ubXNnLCBmbG9hdDogXCJyaWdodFwiLCB1c2VybmFtZTogXCJtZVwiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyAuLi5tc2csIGZsb2F0OiBcImxlZnRcIiB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHsgbWVzc2FnZXMgfSkge1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMuc29ydCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gXCJwcmVhY3QvaG9va3NcIjtcbmltcG9ydCBNZXNzYWdlcyBmcm9tIFwiLi9tZXNzYWdlc1wiO1xuaW1wb3J0IExheW91dCBmcm9tIFwiLi9MYXlvdXRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ2NoYXQoe1xuICBsb2FkaW5nLFxuICBtZXNzYWdlcyA9IFtdLFxuICBvbk1lc3NhZ2VUZXh0LFxuICBvbk1lc3NhZ2UsXG4gIG1lc3NhZ2VUZXh0LFxuICB1c2VybmFtZSxcbiAgaGFuZ291dCxcbiAgb25OYXZpZ2F0aW9uLFxufSkge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChoYW5nb3V0KSB7XG4gICAgICBkb2N1bWVudC50aXRsZSA9IGhhbmdvdXQudXNlcm5hbWU7XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuXG4gIHJldHVybiAoXG4gICAgPExheW91dCBpZD1cImhhbmdjaGF0LXVpXCIgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259PlxuICAgICAgPE1lc3NhZ2VzXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIG9uTmF2aWdhdGlvbj17b25OYXZpZ2F0aW9ufVxuICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxuICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XG4gICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XG4gICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgIC8+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGVyc29uQWRkSWNvbih7XG4gIGhlaWdodCA9IDI0LFxuICB3aWR0aCA9IDI0LFxuICBjb2xvciA9IFwiYmxhY2tcIixcbiAgZmlsbCA9IFwid2hpdGVcIixcbiAgc3R5bGUsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPXt3aWR0aH0gc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD17ZmlsbH0gLz5cbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGw9e2NvbG9yfVxuICAgICAgICBkPVwiTTE1IDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptLTktMlY3SDR2M0gxdjJoM3YzaDJ2LTNoM3YtMkg2em05IDRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6XCJcbiAgICAgIC8+XG4gICAgPC9zdmc+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IFBlcnNvbkFkZCBmcm9tIFwiaWNvbnMvUGVyc29uQWRkXCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5pbXBvcnQgeyBDZW50ZXIgfSBmcm9tIFwiY29tcG9uZW50cy9sYXlvdXQvQ2VudGVyXCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuL0xheW91dFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5jb25zdCBzdHlsZSA9IHtcbiAgbGF5b3V0OiB7XG4gICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgfSxcbn07XG4vL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlKHtcbiAgaGFuZ291dCxcbiAgb25JbnZpdGUsXG4gIG9uTWVzc2FnZVRleHQsXG4gIG1lc3NhZ2VUZXh0LFxuICBsb2FkaW5nLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxMYXlvdXQgc3R5bGU9e3N0eWxlLmxheW91dH0gaWQ9XCJpbnZpdGUtdWlcIj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxQZXJzb25BZGQgY29sb3I9XCJncmVlblwiIC8+XG4gICAgICA8L0NlbnRlcj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIFN0YXJ0IENvbnZlcnNhdGlvbiB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPlxuICAgICAgPC9DZW50ZXI+XG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIGlkPVwibWVzc2FnZVRleHRJbnB1dFwiXG4gICAgICAgIG9uQ2hhbmdlPXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICB2YWx1ZT17bWVzc2FnZVRleHR9XG4gICAgICAgIGRhdGEtdGVzdGlkPVwibWVzc2FnZVRleHRJbnB1dFwiXG4gICAgICAvPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgICAgaWQ9XCJJTlZJVEVcIlxuICAgICAgICAgIG9uQ2xpY2s9e29uSW52aXRlfVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwib25pbnZpdGUtYnRuXCJcbiAgICAgICAgICB0aXRsZT1cIlNlbmQgSW52aXRlXCJcbiAgICAgICAgICBiZz1cInByaW1hcnlcIlxuICAgICAgICAvPlxuICAgICAgPC9DZW50ZXI+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gRG9uZSh7XG4gIGhlaWdodCA9IDI0LFxuICB3aWR0aCA9IDI0LFxuICBmaWxsID0gXCJub25lXCIsXG4gIGNvbG9yID0gXCJibGFja1wiLFxuICBzdHlsZSxcbn0pIHtcbiAgcmV0dXJuIChcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9e3dpZHRofSBzdHlsZT17c3R5bGV9PlxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPXtmaWxsfSAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgZmlsbD17Y29sb3J9XG4gICAgICAgIGQ9XCJNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yelwiXG4gICAgICAvPlxuICAgIDwvc3ZnPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IERvbmUgfSBmcm9tIFwiaWNvbnMvRG9uZVwiO1xuaW1wb3J0IHsgQ2VudGVyIH0gZnJvbSBcImNvbXBvbmVudHMvbGF5b3V0L0NlbnRlclwiO1xuaW1wb3J0IExheW91dCBmcm9tIFwiLi9MYXlvdXRcIjtcblxuY29uc3Qgc3R5bGUgPSB7XG4gIGxheW91dDoge1xuICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRlZSh7IGhhbmdvdXQsIGRpc3BhdGNoIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8TGF5b3V0IHN0eWxlPXtzdHlsZS5sYXlvdXR9IGlkPVwiaW52aXRlZS11aVwiPlxuICAgICAgPENlbnRlcj5cbiAgICAgICAgPERvbmUgd2lkdGg9XCI3MFwiIGhlaWdodD1cIjcwXCIgY29sb3I9XCJncmVlblwiIC8+XG4gICAgICA8L0NlbnRlcj5cbiAgICAgIDxDZW50ZXI+XG4gICAgICAgIDxwPlxuICAgICAgICAgIFlvdSB3aWxsIGJlIGFibGUgdG8gY2hhdCB3aXRoIDxiPntoYW5nb3V0ICYmIGhhbmdvdXQuZW1haWx9PC9iPiBvbmNlXG4gICAgICAgICAgeW91ciBpbnZpdGlvbiBoYXMgYmVlbiBhY2NlcHRlZC5cbiAgICAgICAgPC9wPlxuICAgICAgPC9DZW50ZXI+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSBcIi4vbWVzc2FnZXMvTWVzc2FnZVwiO1xuaW1wb3J0IExheW91dCBmcm9tIFwiLi9MYXlvdXRcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcImNvbnRyb2xzL2J1dHRvblwiO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHJvb3Q6IHtcbiAgICBkaXNwbGF5OiBcImZsZXhcIixcbiAgICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxuICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgIHBhZGRpbmdUb3A6IDcwLFxuICAgIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXG4gICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxuICAgIHBhZGRpbmdCb3R0b206IDgsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnZpdGVyKHsgaGFuZ291dCwgb25BY2NlcHQsIG9uRGVjbGluZSwgbG9hZGluZyB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dCBpZD1cImludml0ZXItdWlcIj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLnJvb3R9PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkxlZnQ6IDgsIGRpc3BsYXk6IFwiZmxleFwiIH19PlxuICAgICAgICAgIHtoYW5nb3V0ICYmIGhhbmdvdXQubWVzc2FnZSAmJiAoXG4gICAgICAgICAgICA8TWVzc2FnZVxuICAgICAgICAgICAgICBtZXNzYWdlPXtcbiAgICAgICAgICAgICAgICBoYW5nb3V0ICYmXG4gICAgICAgICAgICAgICAgaGFuZ291dC5tZXNzYWdlICYmIHtcbiAgICAgICAgICAgICAgICAgIC4uLmhhbmdvdXQubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgZmxvYXQ6IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sXCI+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGlkPVwiREVDTElORVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uRGVjbGluZX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWNsaW5lLWJ0blwiXG4gICAgICAgICAgICAgIHRpdGxlPVwiRGVjbGluZVwiXG4gICAgICAgICAgICAgIGJsb2NrXG4gICAgICAgICAgICAgIGJnPVwiZGFuZ2VyXCJcbiAgICAgICAgICAgICAgb3V0bGluZVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sXCI+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGlkPVwiQUNDRVBUXCJcbiAgICAgICAgICAgICAgb25DbGljaz17b25BY2NlcHR9XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjZXB0LWJ0blwiXG4gICAgICAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiQWNjZXB0XCJcbiAgICAgICAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgYmxvY2tcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9MYXlvdXQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVW5yZWFkSGFuZ291dHMoe1xuICB1bnJlYWRoYW5nb3V0cyxcbiAgb25VbnJlYWRTZWxlY3QsXG4gIG9uVW5yZWFkUmVtb3ZlLFxufSkge1xuICByZXR1cm4gKFxuICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cbiAgICAgIHt1bnJlYWRoYW5nb3V0cy5sZW5ndGggPiAwICYmXG4gICAgICAgIHVucmVhZGhhbmdvdXRzLm1hcCgodSkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e3UudXNlcm5hbWV9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uVW5yZWFkU2VsZWN0KHsgaGFuZ291dDogdSB9KX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIgbGlzdC1ncm91cC1pdGVtLWFjdGlvblwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt1LnVzZXJuYW1lfSx7dS5tZXNzYWdlICYmIHUubWVzc2FnZS50ZXh0fVxuICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIG9uVW5yZWFkUmVtb3ZlKHsgaGFuZ291dDogdSB9KTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBiYWRnZSBiYWRnZS1kYW5nZXIgYmFkZ2UtcGlsbFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBYXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgPC91bD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cFwiIHsuLi5wcm9wc30gLz47XG59XG5cbmZ1bmN0aW9uIExpc3RJdGVtKHByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLWFjdGlvblwiXG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKTtcbn1cblxuZXhwb3J0IHsgTGlzdEl0ZW0gfTtcbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQZXJzb25QbHVzRmlsbChwcm9wcykge1xuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGNvbG9yIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8c3ZnXG4gICAgICB3aWR0aD17d2lkdGh9XG4gICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgIHZpZXdCb3g9XCIwIDAgMTYgMTZcIlxuICAgICAgY2xhc3NOYW1lPVwiYmkgYmktcGVyc29uLXBsdXMtZmlsbFwiXG4gICAgICBmaWxsPXtjb2xvcn1cbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgID5cbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGwtcnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICBkPVwiTTEgMTRzLTEgMC0xLTEgMS00IDYtNCA2IDMgNiA0LTEgMS0xIDFIMXptNS02YTMgMyAwIDEgMCAwLTYgMyAzIDAgMCAwIDAgNnptNy41LTNhLjUuNSAwIDAgMSAuNS41djJhLjUuNSAwIDAgMS0uNS41aC0yYS41LjUgMCAwIDEgMC0xSDEzVjUuNWEuNS41IDAgMCAxIC41LS41elwiXG4gICAgICAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgZmlsbC1ydWxlPVwiZXZlbm9kZFwiXG4gICAgICAgIGQ9XCJNMTMgNy41YS41LjUgMCAwIDEgLjUtLjVoMmEuNS41IDAgMCAxIDAgMUgxNHYxLjVhLjUuNSAwIDAgMS0xIDB2LTJ6XCJcbiAgICAgIC8+XG4gICAgPC9zdmc+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSBcInByZWFjdC9ob29rc1wiO1xuaW1wb3J0IExpc3QsIHsgTGlzdEl0ZW0gfSBmcm9tIFwiY29udHJvbHMvbGlzdFwiO1xuXG5pbXBvcnQgUGVyc29uUGx1c0ZpbGwgZnJvbSBcImljb25zL2Jvb3RzdHJhcC9QZXJzb25QbHVzRmlsbFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRmlsdGVyKHtcbiAgb25Mb2FkSGFuZ291dCxcbiAgZmlsdGVyLFxuICBmaWx0ZXJSZXN1bHQgPSBbXSxcbiAgb25GaWx0ZXJTZWxlY3QsXG4gIG9uRmlsdGVySW5wdXQsXG4gIG9uTmF2aWdhdGlvbixcbn0pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBvbkxvYWRIYW5nb3V0KCk7XG4gIH0sIFtdKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogXCIxMDAlXCIsIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiIH19PlxuICAgICAgPGlucHV0XG4gICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgIHZhbHVlPXtmaWx0ZXJ9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkZpbHRlcklucHV0fVxuICAgICAgICBkYXRhLXRlc3RpZD1cImZpbHRlci1pbnB1dFwiXG4gICAgICAvPlxuICAgICAgPGRpdj5cbiAgICAgICAgPExpc3Q+XG4gICAgICAgICAge2ZpbHRlclJlc3VsdC5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICBmaWx0ZXJSZXN1bHQubWFwKChmKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPExpc3RJdGVtXG4gICAgICAgICAgICAgICAgICBpZD17Zi51c2VybmFtZX1cbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtmLnVzZXJuYW1lfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17b25GaWx0ZXJTZWxlY3R9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2YudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgPC9MaXN0SXRlbT5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICA8L0xpc3Q+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtmaWx0ZXJSZXN1bHQubGVuZ3RoID09PSAwICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgYWxpZ24taXRlbXMtY2VudGVyXCIgc3R5bGU9e3sgZmxleDogMSB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC0yICBteC1hdXRvXCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoXCJcbiAgICAgICAgICAgICAgaWQ9XCJzZWFyY2hcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXtvbk5hdmlnYXRpb259XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8UGVyc29uUGx1c0ZpbGwgd2lkdGg9XCIyZW1cIiBoZWlnaHQ9XCIyZW1cIiAvPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgTGlzdCwgeyBMaXN0SXRlbSB9IGZyb20gXCJjb250cm9scy9saXN0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZWFyY2goe1xuICBvblNlYXJjaFNlbGVjdCxcbiAgb25TZWFyY2hJbnB1dCxcbiAgb25TZWFyY2gsXG4gIHNlYXJjaCxcbiAgc2VhcmNoUmVzdWx0ID0gW10sXG59KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgbWItM1wiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1pbnB1dFwiXG4gICAgICAgICAgdmFsdWU9e3NlYXJjaH1cbiAgICAgICAgICBvbkNoYW5nZT17b25TZWFyY2hJbnB1dH1cbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHVzZXJuYW1lXCJcbiAgICAgICAgICBhcmlhLWxhYmVsPVwidXNlcm5hbWVcIlxuICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9XCJidXR0b24tYWRkb24yXCJcbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1hcHBlbmRcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1idG5cIlxuICAgICAgICAgICAgb25DbGljaz17b25TZWFyY2h9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgaWQ9XCJidXR0b24tYWRkb24yXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICBTZWFyY2hcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxMaXN0PlxuICAgICAgICB7c2VhcmNoUmVzdWx0Lmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBzZWFyY2hSZXN1bHQubWFwKCh1KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8TGlzdEl0ZW1cbiAgICAgICAgICAgICAgICBpZD17dS51c2VybmFtZX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvblNlYXJjaFNlbGVjdH1cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17dS51c2VybmFtZX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt1LnVzZXJuYW1lfVxuICAgICAgICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgIDwvTGlzdD5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImV4cG9ydCBjb25zdCBtZXNzYWdlcyA9IFtcbiAge1xuICAgIHVzZXJuYW1lOiBcImJyZW5vXCIsXG4gICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMTc4OTk3MSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOiBcImRlbW9cIixcbiAgICB0ZXh0OiBgT2sgTGV0J3MgQ2hhdCBvbiBIYW5nb3V0IWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMyMTYzNDYyLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6IFwiYnJlbm9cIixcbiAgICB0ZXh0OiBgSG93IGFyZSB5b3UgZGVtb2AsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNjM1NzIzLFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6IFwiYnJlbm9cIixcbiAgICB0ZXh0OiBgQXJlIHlvdSBhbGwgcmlnaHRgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzY3NzU3MyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOiBcImRlbW9cIixcbiAgICB0ZXh0OiBgWWVzIEkgYW0uIEhvdyBhcmUgeW91YCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDYsXG4gIH0sXG4gICxcbiAge1xuICAgIHVzZXJuYW1lOiBcImRlbW9cIixcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOiBcImRlbW9cIixcbiAgICB0ZXh0OiBgQXJlIHlvdSBkb2luZyBncmVhdGVgLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0NyxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOiBcImJyZW5vXCIsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDgsXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTogXCJicmVub1wiLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuICB7XG4gICAgdXNlcm5hbWU6IFwiYnJlbm9cIixcbiAgICB0ZXh0OiBgWWVzIGkgYW1gLFxuICAgIHRpbWVzdGFtcDogMTU5MTMzMzcyODA0OSxcbiAgfSxcbiAge1xuICAgIHVzZXJuYW1lOiBcImJyZW5vXCIsXG4gICAgdGV4dDogYFllcyBpIGFtYCxcbiAgICB0aW1lc3RhbXA6IDE1OTEzMzM3MjgwNDksXG4gIH0sXG4gIHtcbiAgICB1c2VybmFtZTogXCJicmVub1wiLFxuICAgIHRleHQ6IGBZZXMgaSBhbWAsXG4gICAgdGltZXN0YW1wOiAxNTkxMzMzNzI4MDQ5LFxuICB9LFxuXTtcbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBBcHBSb3V0ZSB9IGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuaW1wb3J0IEJsb2NrIGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0Jsb2NrXCI7XG5pbXBvcnQgQmxvY2tlZCBmcm9tIFwiZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9CbG9ja2VkXCI7XG5pbXBvcnQgQ29uZmlndXJlIGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0NvbmZpZ3VyZVwiO1xuaW1wb3J0IEhhbmdjaGF0IGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdjaGF0XCI7XG5pbXBvcnQgSW52aXRlIGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0ludml0ZVwiO1xuaW1wb3J0IEludml0ZWUgZnJvbSBcImZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlZVwiO1xuaW1wb3J0IEludml0ZXIgZnJvbSBcImZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSW52aXRlclwiO1xuaW1wb3J0IFVucmVhZEhhbmdvdXRzIGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL1VucmVhZEhhbmdvdXRzXCI7XG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9tZXNzYWdlcy9NZXNzYWdlXCI7XG5pbXBvcnQgSGFuZ291dEZpbHRlciBmcm9tIFwiZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9GaWx0ZXJcIjtcbmltcG9ydCBIYW5nb3V0U2VhcmNoIGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL1NlYXJjaFwiO1xuY29uc3QgaGFuZ291dHMgPSBbXG4gIHsgdXNlcm5hbWU6IFwidXNlcm9uZVwiIH0sXG4gIHsgdXNlcm5hbWU6IFwidXNlcnR3b1wiIH0sXG4gIHsgdXNlcm5hbWU6IFwidXNlcnRocmVlXCIgfSxcbl07XG5jb25zdCBoYW5nb3V0ID0ge1xuICB1c2VybmFtZTogXCJ0ZXN0dXNlclwiLFxuICBlbWFpbDogXCJ0ZXN0QGdtYWlsLmNvbVwiLFxuICBtZXNzYWdlOiB7IHRleHQ6IGBMZXQncyBjaGF0IG9uIEhhbmdvdXQhYCwgdGltZXN0YW1wOiAxNTkwODIwNzgyOTIxIH0sXG59O1xuY29uc3QgbWVzc2FnZSA9IHtcbiAgdXNlcm5hbWU6IFwiYnJlbm9cIixcbiAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuICB0aW1lc3RhbXA6IDE1OTEzMzE3Njc4MzYsXG59O1xuLy9cbmltcG9ydCB7IG1lc3NhZ2VzIH0gZnJvbSBcIi4vZmFrZU1lc3NhZ2VzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0Um91dGVzKCkge1xuICByZXR1cm4gW1xuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrXCI+XG4gICAgICA8QmxvY2sgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2Jsb2NrZWRcIj5cbiAgICAgIDxCbG9ja2VkIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cbiAgICAgIDxDb25maWd1cmUgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdjaGF0XCI+XG4gICAgICA8SGFuZ2NoYXQgaGFuZ291dD17aGFuZ291dH0gbWVzc2FnZXM9e21lc3NhZ2VzfSB1c2VybmFtZT1cImRlbW9cIiAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZVwiPlxuICAgICAgPEludml0ZSBoYW5nb3V0cz17aGFuZ291dHN9IC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gICAgPEFwcFJvdXRlIHBhdGg9XCIvaW52aXRlclwiPlxuICAgICAgPEludml0ZXIgaGFuZ291dHM9e2hhbmdvdXRzfSAvPlxuICAgIDwvQXBwUm91dGU+LFxuICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ludml0ZWVcIj5cbiAgICAgIDxJbnZpdGVlIGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi91bnJlYWRoYW5nb3V0c1wiPlxuICAgICAgPFVucmVhZEhhbmdvdXRzIHVucmVhZGhhbmdvdXRzPXtoYW5nb3V0c30gLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlXCI+XG4gICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IDIwLCBiYWNrZ3JvdW5kQ29sb3I6IFwiI2VlZWVlZWVcIiB9fT5cbiAgICAgICAgPE1lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0gdXNlcm5hbWU9e2hhbmdvdXQudXNlcm5hbWV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9tZXNzYWdlc1wiPlxuICAgICAgPEhhbmdjaGF0IGhhbmdvdXQ9e2hhbmdvdXR9IG1lc3NhZ2VzPXttZXNzYWdlc30gdXNlcm5hbWU9XCJkZW1vXCIgLz5cbiAgICA8L0FwcFJvdXRlPixcbiAgICA8QXBwUm91dGUgcGF0aD1cIi9zZWFyY2hcIj5cbiAgICAgIDxIYW5nb3V0U2VhcmNoIC8+XG4gICAgPC9BcHBSb3V0ZT4sXG4gICAgPEFwcFJvdXRlIHBhdGg9XCIvZmlsdGVyXCI+XG4gICAgICA8SGFuZ291dEZpbHRlciAvPlxuICAgIDwvQXBwUm91dGU+LFxuICBdO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBHZWFySWNvbiBmcm9tIFwiaWNvbnMvYm9vdHN0cmFwL0dlYXJJY29uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJvb3RzdHJhcEljb25zKCkge1xuICByZXR1cm4gPEdlYXJJY29uIC8+O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tIFwiaWNvbnMvb25saW5lU3RhdHVzXCI7XG5pbXBvcnQgQXV0aERlbW9Sb3V0ZXMgZnJvbSBcIi4vYXV0aGVudGljYXRpb24vcm91dGVcIjtcbmltcG9ydCBDb21wb25lbnRzUm91dGVzIGZyb20gXCIuL2NvbXBvbmVudHMvcm91dGVcIjtcbmltcG9ydCBIYW5nb3V0Um91dGVzIGZyb20gXCIuL2hhbmdvdXQvcm91dGVcIjtcbmltcG9ydCBCb290c3RyYXBJY29ucyBmcm9tIFwiLi9pY29uc1wiO1xuLy8gY29uc3QgaGFuZ291dHMgPSBbXG4vLyAgIHsgdXNlcm5hbWU6ICd1c2Vyb25lJyB9LFxuLy8gICB7IHVzZXJuYW1lOiAndXNlcnR3bycgfSxcbi8vICAgeyB1c2VybmFtZTogJ3VzZXJ0aHJlZScgfSxcbi8vIF07XG4vLyBjb25zdCBoYW5nb3V0ID0ge1xuLy8gICB1c2VybmFtZTogJ3Rlc3R1c2VyJyxcbi8vICAgZW1haWw6ICd0ZXN0QGdtYWlsLmNvbScsXG4vLyAgIG1lc3NhZ2U6IHsgdGV4dDogYExldCdzIGNoYXQgb24gSGFuZ291dCFgLCB0aW1lc3RhbXA6IDE1OTA4MjA3ODI5MjEgfSxcbi8vIH07XG4vLyBjb25zdCBtZXNzYWdlID0ge1xuLy8gICB1c2VybmFtZTogJ2JyZW5vJyxcbi8vICAgdGV4dDogYExldCdzIENoYXQgb24gSGFuZ291dCFgLFxuLy8gICB0aW1lc3RhbXA6IDE1OTEzMzE3Njc4MzYsXG4vLyB9O1xuLy8gLy9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3Rvcnlib29rUm91dGVzKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiBcIjg1dmhcIiB9fT5cbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL29ubGluZVwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxPbmxpbmVTdGF0dXMgb25saW5lIC8+XG4gICAgICAgICAgPE9ubGluZVN0YXR1cyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQXBwUm91dGU+XG5cbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2ljb25zXCI+XG4gICAgICAgIDxCb290c3RyYXBJY29ucyAvPlxuICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgIDxBdXRoRGVtb1JvdXRlcyAvPlxuICAgICAgPENvbXBvbmVudHNSb3V0ZXMgLz5cbiAgICAgIDxIYW5nb3V0Um91dGVzIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tIFwiY29tcG9uZW50cy9hcHAtcm91dGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2YmFyKHByb3BzKSB7XG4gIGNvbnN0IHsgYmcgPSBcImxpZ2h0XCIsIGJyYW5kLCBjaGlsZHJlbiB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPG5hdiBjbGFzc05hbWU9e2BuYXZiYXIgbmF2YmFyLWV4cGFuZC1sZyBuYXZiYXItJHtiZ30gYmctJHtiZ31gfT5cbiAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIjXCI+XG4gICAgICAgIHticmFuZH1cbiAgICAgIDwvYT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXJcIlxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXG4gICAgICAgIGRhdGEtdGFyZ2V0PVwiI25hdmJhclN1cHBvcnRlZENvbnRlbnRcIlxuICAgICAgICBhcmlhLWNvbnRyb2xzPVwibmF2YmFyU3VwcG9ydGVkQ29udGVudFwiXG4gICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJUb2dnbGUgbmF2aWdhdGlvblwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVyLWljb25cIj48L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L25hdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5hdkJhckNvbGxhcHNlKHsgY2hpbGRyZW4gfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCIgaWQ9XCJuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCI+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOYXZCYXJOYXYoeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLW5hdiBtci1hdXRvXCI+e2NoaWxkcmVufTwvdWw+O1xufVxuLy9cbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHsgY2hpbGRyZW4gfSkge1xuICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+e2NoaWxkcmVufTwvbGk+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTmF2TGluayhwcm9wcykge1xuICBjb25zdCB7IGFwcFJvdXRlIH0gPSBwcm9wcztcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xuXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2lkfWAsIHJvdXRlOiBhcHBSb3V0ZSB9KTtcbiAgfVxuICByZXR1cm4gPGEgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBocmVmPVwiI1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZEcm9wZG93bihwcm9wcykge1xuICBjb25zdCB7IHRpdGxlLCBjaGlsZHJlbiB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtIGRyb3Bkb3duXCI+XG4gICAgICA8YVxuICAgICAgICBjbGFzc05hbWU9XCJuYXYtbGluayBkcm9wZG93bi10b2dnbGVcIlxuICAgICAgICBocmVmPVwiI1wiXG4gICAgICAgIGlkPVwibmF2YmFyRHJvcGRvd25cIlxuICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICAgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJcbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgPlxuICAgICAgICB7dGl0bGV9XG4gICAgICA8L2E+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9saT5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERyb3Bkb3duTWVudShwcm9wcykge1xuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJuYXZiYXJEcm9wZG93blwiPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRHJvcGRvd25JdGVtKHByb3BzKSB7XG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBcIi9cIiwgcm91dGU6IGAvJHtpZH1gIH0pO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGEgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCIjXCIgey4uLnByb3BzfSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gLz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGgsIHJlbmRlciB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBTdG9yeWJvb2tQcm92aWRlcnMgZnJvbSBcIi4vU3Rvcnlib29rUHJvdmlkZXJzXCI7XG5pbXBvcnQgU3Rvcnlib29rUm91dGVzIGZyb20gXCIuL1N0b3J5Ym9va1JvdXRlc1wiO1xuaW1wb3J0IE5hdmJhciwge1xuICBOYXZCYXJOYXYsXG4gIE5hdkl0ZW0sXG4gIE5hdkxpbmssXG4gIE5hdkJhckNvbGxhcHNlLFxufSBmcm9tIFwiY29tcG9uZW50cy9uYXYtYmFyXCI7XG5pbXBvcnQgTmF2RHJvcGRvd24sIHtcbiAgRHJvcGRvd25NZW51LFxuICBEcm9wZG93bkl0ZW0sXG59IGZyb20gXCJjb21wb25lbnRzL25hdi1iYXIvbmF2LWRyb3Bkb3duXCI7XG5cbnJlbmRlcihcbiAgPFN0b3J5Ym9va1Byb3ZpZGVycz5cbiAgICA8TmF2YmFyIGJyYW5kPVwiU3Rvcnlib29rXCIgYmc9XCJkYXJrXCI+XG4gICAgICA8TmF2QmFyQ29sbGFwc2U+XG4gICAgICAgIDxOYXZCYXJOYXY+XG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiQ29tcG9uZW50c1wiPlxuICAgICAgICAgICAgPERyb3Bkb3duTWVudT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImJ1dHRvblwiPkJ1dHRvbnM8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cInRleHQtaW5wdXRcIj5UZXh0SW5wdXQ8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImljb25zXCI+SWNvbnM8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImFsZXJ0XCI+QWxlcnQ8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgIDwvRHJvcGRvd25NZW51PlxuICAgICAgICAgIDwvTmF2RHJvcGRvd24+XG4gICAgICAgICAgPE5hdkRyb3Bkb3duIHRpdGxlPVwiQXV0aGVudGljYXRpb25cIj5cbiAgICAgICAgICAgIDxEcm9wZG93bk1lbnU+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJsb2dpblwiPkxvZ2luPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJzaWdudXBcIj5TaWdudXA8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cImNoYW5nZS1wYXNzd29yZFwiPkNoYW5nZSBQYXNzd29yZDwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiZm9yZ290LXBhc3N3b3JkXCI+Rm9yZ290IFBhc3N3b3JkPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICA8L0Ryb3Bkb3duTWVudT5cbiAgICAgICAgICA8L05hdkRyb3Bkb3duPlxuICAgICAgICAgIDxOYXZEcm9wZG93biB0aXRsZT1cIkhhbmdvdXRcIj5cbiAgICAgICAgICAgIDxEcm9wZG93bk1lbnU+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJibG9ja1wiPkJsb2NrPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJibG9ja2VkXCI+QmxvY2tlZDwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiY29uZmlndXJlXCI+Q29uZmlndXJlPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJoYW5nY2hhdFwiPkhhbmdjaGF0PC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJoYW5nb3V0XCI+SGFuZ291dDwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiaW52aXRlXCI+SW52aXRlPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJpbnZpdGVlXCI+SW52aXRlZTwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgICA8RHJvcGRvd25JdGVtIGlkPVwiaW52aXRlclwiPkludml0ZXI8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cInVucmVhZGhhbmdvdXRzXCI+VW5yZWFkSGFuZ291dHM8L0Ryb3Bkb3duSXRlbT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbSBpZD1cInNlYXJjaFwiPkhhbmdvdXQgU2VhcmNoPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW0gaWQ9XCJmaWx0ZXJcIj5IYW5nb3V0IEZpbHRlcjwvRHJvcGRvd25JdGVtPlxuICAgICAgICAgICAgPC9Ecm9wZG93bk1lbnU+XG4gICAgICAgICAgPC9OYXZEcm9wZG93bj5cbiAgICAgICAgPC9OYXZCYXJOYXY+XG4gICAgICA8L05hdkJhckNvbGxhcHNlPlxuICAgIDwvTmF2YmFyPlxuICAgIDxTdG9yeWJvb2tSb3V0ZXMgLz5cbiAgPC9TdG9yeWJvb2tQcm92aWRlcnM+LFxuXG4gIGRvY3VtZW50LmJvZHlcbik7XG4iXSwibmFtZXMiOlsidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJ1c2VBcHBSb3V0ZSIsImRpc3BhdGNoIiwibmFtZSIsIm9uQXBwUm91dGUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsIkFwcFJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImZpbmQiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInVzZUVmZmVjdCIsImdldEl0ZW0iLCJwYXJzZSIsInZhbHVlIiwidXNlTWVtbyIsIkFwcFByb3ZpZGVycyIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXIiLCJPbmxpbmVTdGF0dXMiLCJyZWFkeVN0YXRlIiwiSXNPbmxpbmUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsIlRleHRJbnB1dCIsImxhYmVsIiwiaXNWYWxpZCIsIm1lc3NhZ2UiLCJ1bmRlZmluZWQiLCJCdXR0b24iLCJ0aXRsZSIsImJnIiwib3V0bGluZSIsInNpemUiLCJsb2FkaW5nIiwiYmxvY2siLCJBbGVydCIsImFsZXJ0IiwiTG9naW4iLCJlbWFpbG9ydXNlcm5hbWUiLCJwYXNzd29yZCIsIm9uTG9naW4iLCJvbkZvY3VzIiwib25DaGFuZ2UiLCJ2YWxpZGF0aW9uIiwib25Gb3Jnb3RQYXNzd29yZCIsIm9uQmx1ciIsImVycm9yIiwibWFyZ2luIiwicGFkZGluZyIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsInZhbGlkYXRpb25TdWNjZXNzIiwidmFsaWRhdGlvbkVycm9yIiwiTG9naW5TdGF0ZXMiLCJTaWdudXAiLCJ1c2VybmFtZSIsImVtYWlsIiwib25TaWdudXAiLCJTaWdudXBTdGF0ZXMiLCJDaGFuZ2VQYXNzd29yZCIsImNvbmZpcm0iLCJvblBhc3N3b3JkQ2hhbmdlIiwiQ2hhbmdlUGFzc3dvcmRTdGF0ZXMiLCJSZXF1ZXN0UGFzc0NoYW5nZSIsIm9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlIiwiRm9yZm90UGFzc3dvcmRTdGF0ZSIsIkZvcmdvdFBhc3N3b3JkIiwiQXV0aERlbW9Sb3V0ZXMiLCJTaWduVXBTdGF0ZXMiLCJGb3Jnb3RQYXNzd29yZFN0YXRlcyIsIkJ1dHRvbkRlbW8iLCJmbGV4RGlyZWN0aW9uIiwiYWxpZ25JdGVtcyIsIlRleHRJbnB1dFN0YXRlcyIsIlRvYXN0IiwidXNlckltYWdlIiwiVG9hc3REZW1vIiwiQWxlcnREZW1vIiwiQ29tcG9uZW50c1JvdXRlIiwiR2Vhckljb24iLCJjb2xvciIsInN0eWxlcyIsInJvb3QiLCJwb3NpdGlvbiIsIkxheW91dCIsImlkIiwiaGFuZ291dCIsIm9uTmF2aWdhdGlvbiIsImNoZWNrYm94IiwibWFyZ2luUmlnaHQiLCJjaGVja2JveFJvb3QiLCJsYXlvdXQiLCJib3hTaXppbmciLCJwYWRkaW5nVG9wIiwiQmxvY2siLCJvbkNhbmNlbCIsIm9uQmxvY2siLCJvblJlcG9ydCIsImZpbGwiLCJvbkNsaWNrIiwiQ2VudGVyIiwidGV4dEFsaWduIiwiQmxvY2tlZCIsIm9uVW5ibG9jayIsIm9uQ2xvc2UiLCJEZWxldGUiLCJBcmNoaXZlIiwiaWNvbkJ0biIsImJ0biIsImJ0bkNvbnRhaW5lciIsIkNvbmZpZ3VyZSIsIm9uRGVsZXRlIiwib25BcmNoaXZlIiwib25Ob3RpZmljYXRpb24iLCJvbkNvbnZlcnNhdGlvbkhpc3RvcnkiLCJvbk9rIiwiSWNvbkJ1dHRvbiIsIkljb24iLCJDaGVja2JveCIsIm1hcmdpblRvcCIsInVzZU1lZGlhUXVlcnkiLCJzZXRXaWR0aCIsInVzZVN0YXRlIiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclN0eWxlIiwiYm9yZGVyV2lkdGgiLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJmb250U2l6ZSIsIk1lc3NhZ2UiLCJmbG9hdCIsInRpbWVzdGFtcCIsImRheXMiLCJzZXREYXlzIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwic2Vjb25kcyIsInNldFNlY29uZHMiLCJjb252ZXJ0TVMiLCJtcyIsImQiLCJoIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsIkRhdGUiLCJub3ciLCJzZXRJbnRlcnZhbCIsIm1hcmdpbkJvdHRvbSIsInRleHQiLCJNZXNzYWdlRWRpdG9yIiwibWVzc2FnZVRleHQiLCJvbk1lc3NhZ2VUZXh0Iiwib25NZXNzYWdlIiwiQmxvY2tlck1lc3NhZ2UiLCJCbG9ja2VkTWVzc2FnZSIsImhhbmRsZU5hdmlnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm1lc3NhZ2VDb250YWluZXIiLCJmbGV4Iiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwiTWVzc2FnZXMiLCJtZXNzYWdlcyIsInNjcm9sbGVyUmVmIiwidXNlUmVmIiwiY3VycmVudCIsInNjcm9sbFRvcCIsInNjcm9sbEhlaWdodCIsIm9uU2VuZCIsImxlbmd0aCIsImZsb2F0TWVzc2FnZXMiLCJzb3J0TWVzc2FnZXMiLCJtYXAiLCJtc2ciLCJzb3J0IiwiSGFuZ2NoYXQiLCJkb2N1bWVudCIsIlBlcnNvbkFkZEljb24iLCJJbnZpdGUiLCJvbkludml0ZSIsIlBlcnNvbkFkZCIsIkRvbmUiLCJJbnZpdGVlIiwicGFkZGluZ0JvdHRvbSIsIkludml0ZXIiLCJvbkFjY2VwdCIsIm9uRGVjbGluZSIsIm1hcmdpbkxlZnQiLCJVbnJlYWRIYW5nb3V0cyIsInVucmVhZGhhbmdvdXRzIiwib25VbnJlYWRTZWxlY3QiLCJvblVucmVhZFJlbW92ZSIsIkxpc3QiLCJMaXN0SXRlbSIsIlBlcnNvblBsdXNGaWxsIiwiRmlsdGVyIiwib25Mb2FkSGFuZ291dCIsImZpbHRlciIsImZpbHRlclJlc3VsdCIsIm9uRmlsdGVyU2VsZWN0Iiwib25GaWx0ZXJJbnB1dCIsIlNlYXJjaCIsIm9uU2VhcmNoU2VsZWN0Iiwib25TZWFyY2hJbnB1dCIsIm9uU2VhcmNoIiwic2VhcmNoIiwic2VhcmNoUmVzdWx0IiwiaGFuZ291dHMiLCJIYW5nb3V0Um91dGVzIiwiSGFuZ291dFNlYXJjaCIsIkhhbmdvdXRGaWx0ZXIiLCJCb290c3RyYXBJY29ucyIsIlN0b3J5Ym9va1JvdXRlcyIsIkNvbXBvbmVudHNSb3V0ZXMiLCJOYXZiYXIiLCJicmFuZCIsIk5hdkJhckNvbGxhcHNlIiwiTmF2QmFyTmF2IiwiTmF2RHJvcGRvd24iLCJEcm9wZG93bk1lbnUiLCJEcm9wZG93bkl0ZW0iLCJoYW5kbGVSb3V0ZSIsInRhcmdldCIsInJlbmRlciIsIlN0b3J5Ym9va1Byb3ZpZGVycyIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFHLElBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsOERBQThELFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1L1IsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXlFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUF1RyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMs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
