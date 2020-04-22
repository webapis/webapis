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
  var u = r$1.__H || (r$1.__H = {
    __: [],
    __h: []
  });
  return t >= u.__.length && u.__.push({}), u.__[t];
}

function v$1(n) {
  return m$1(x$1, n);
}

function m$1(n, u, i) {
  var o = a$1(t$1++);
  return o.__c || (o.__c = r$1, o.__ = [i ? i(u) : x$1(void 0, u), function (t) {
    var r = n(o.__[0], t);
    o.__[0] !== r && (o.__[0] = r, o.__c.setState({}));
  }]), o.__;
}

function p$1(n, u) {
  var i = a$1(t$1++);
  q(i.__H, u) && (i.__ = n, i.__H = u, r$1.__H.__h.push(i));
}

function s$1(n, r) {
  var u = a$1(t$1++);
  return q(u.__H, r) ? (u.__H = r, u.__h = n, u.__ = n()) : u.__;
}

function T$1(n) {
  var u = r$1.context[n.__c];
  if (!u) return n.__;
  var i = a$1(t$1++);
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
  o$1 && o$1(n), t$1 = 0, (r$1 = n.__c).__H && (r$1.__H.__h.forEach(_$1), r$1.__H.__h.forEach(g$1), r$1.__H.__h = []);
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
  e$1 && e$1(t);
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

function E$1(n, t) {
  for (var e in t) n[e] = t[e];

  return n;
}

function w$1(n, t) {
  for (var e in n) if ("__source" !== e && !(e in t)) return !0;

  for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;

  return !1;
}

var C$1 = function (n) {
  var t, e;

  function r(t) {
    var e;
    return (e = n.call(this, t) || this).isPureReactComponent = !0, e;
  }

  return e = n, (t = r).prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e, r.prototype.shouldComponentUpdate = function (n, t) {
    return w$1(this.props, n) || w$1(this.state, t);
  }, r;
}(m);

var A$1 = n.__b;

n.__b = function (n) {
  n.type && n.type.t && n.ref && (n.props.ref = n.ref, n.ref = null), A$1 && A$1(n);
};

var F$1 = n.__e;

function N$1(n) {
  return n && ((n = E$1({}, n)).__c = null, n.__k = n.__k && n.__k.map(N$1)), n;
}

function U() {
  this.__u = 0, this.o = null, this.__b = null;
}

function M$1(n) {
  var t = n.__.__c;
  return t && t.u && t.u(n);
}

function L(n) {
  var t, e, r;

  function o(o) {
    if (t || (t = n()).then(function (n) {
      e = n.default || n;
    }, function (n) {
      r = n;
    }), r) throw r;
    if (!e) throw t;
    return h(e, o);
  }

  return o.displayName = "Lazy", o.t = !0, o;
}

function O() {
  this.i = null, this.l = null;
}

n.__e = function (n, t, e) {
  if (n.then) for (var r, o = t; o = o.__;) if ((r = o.__c) && r.__c) return r.__c(n, t.__c);
  F$1(n, t, e);
}, (U.prototype = new m()).__c = function (n, t) {
  var e = this;
  null == e.o && (e.o = []), e.o.push(t);

  var r = M$1(e.__v),
      o = !1,
      u = function () {
    o || (o = !0, r ? r(i) : i());
  };

  t.__c = t.componentWillUnmount, t.componentWillUnmount = function () {
    u(), t.__c && t.__c();
  };

  var i = function () {
    var n;
    if (! --e.__u) for (e.__v.__k[0] = e.state.u, e.setState({
      u: e.__b = null
    }); n = e.o.pop();) n.forceUpdate();
  };

  e.__u++ || e.setState({
    u: e.__b = e.__v.__k[0]
  }), n.then(u, u);
}, U.prototype.render = function (n, t) {
  return this.__b && (this.__v.__k[0] = N$1(this.__b), this.__b = null), [h(m, null, t.u ? null : n.children), t.u && n.fallback];
};

var P$1 = function (n, t, e) {
  if (++e[1] === e[0] && n.l.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)) for (e = n.i; e;) {
    for (; e.length > 3;) e.pop()();

    if (e[1] < e[0]) break;
    n.i = e = e[2];
  }
};

(O.prototype = new m()).u = function (n) {
  var t = this,
      e = M$1(t.__v),
      r = t.l.get(n);
  return r[0]++, function (o) {
    var u = function () {
      t.props.revealOrder ? (r.push(o), P$1(t, n, r)) : o();
    };

    e ? e(u) : u();
  };
}, O.prototype.render = function (n) {
  this.i = null, this.l = new Map();
  var t = x(n.children);
  n.revealOrder && "b" === n.revealOrder[0] && t.reverse();

  for (var e = t.length; e--;) this.l.set(t[e], this.i = [1, 0, this.i]);

  return n.children;
}, O.prototype.componentDidUpdate = O.prototype.componentDidMount = function () {
  var n = this;
  n.l.forEach(function (t, e) {
    P$1(n, e, t);
  });
};

var W = function () {
  function n() {}

  var t = n.prototype;
  return t.getChildContext = function () {
    return this.props.context;
  }, t.render = function (n) {
    return n.children;
  }, n;
}();

var D$1 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
m.prototype.isReactComponent = {};
var H$1 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;

var Z = n.event;

function I(n, t) {
  n["UNSAFE_" + t] && !n[t] && Object.defineProperty(n, t, {
    configurable: !1,
    get: function () {
      return this["UNSAFE_" + t];
    },
    set: function (n) {
      this["UNSAFE_" + t] = n;
    }
  });
}

n.event = function (n) {
  Z && (n = Z(n)), n.persist = function () {};
  var t = !1,
      e = !1,
      r = n.stopPropagation;

  n.stopPropagation = function () {
    r.call(n), t = !0;
  };

  var o = n.preventDefault;
  return n.preventDefault = function () {
    o.call(n), e = !0;
  }, n.isPropagationStopped = function () {
    return t;
  }, n.isDefaultPrevented = function () {
    return e;
  }, n.nativeEvent = n;
};

var $$1 = {
  configurable: !0,
  get: function () {
    return this.class;
  }
},
    q$1 = n.vnode;

n.vnode = function (n) {
  n.$$typeof = H$1;
  var t = n.type,
      e = n.props;

  if (t) {
    if (e.class != e.className && ($$1.enumerable = "className" in e, null != e.className && (e.class = e.className), Object.defineProperty(e, "className", $$1)), "function" != typeof t) {
      var r, o, u;

      for (u in e.defaultValue && void 0 !== e.value && (e.value || 0 === e.value || (e.value = e.defaultValue), delete e.defaultValue), Array.isArray(e.value) && e.multiple && "select" === t && (x(e.children).forEach(function (n) {
        -1 != e.value.indexOf(n.props.value) && (n.props.selected = !0);
      }), delete e.value), e) if (r = D$1.test(u)) break;

      if (r) for (u in o = n.props = {}, e) o[D$1.test(u) ? u.replace(/[A-Z0-9]/, "-$&").toLowerCase() : u] = e[u];
    }

    !function (t) {
      var e = n.type,
          r = n.props;

      if (r && "string" == typeof e) {
        var o = {};

        for (var u in r) /^on(Ani|Tra|Tou)/.test(u) && (r[u.toLowerCase()] = r[u], delete r[u]), o[u.toLowerCase()] = u;

        if (o.ondoubleclick && (r.ondblclick = r[o.ondoubleclick], delete r[o.ondoubleclick]), o.onbeforeinput && (r.onbeforeinput = r[o.onbeforeinput], delete r[o.onbeforeinput]), o.onchange && ("textarea" === e || "input" === e.toLowerCase() && !/^fil|che|ra/i.test(r.type))) {
          var i = o.oninput || "oninput";
          r[i] || (r[i] = r[o.onchange], delete r[o.onchange]);
        }
      }
    }(), "function" == typeof t && !t.m && t.prototype && (I(t.prototype, "componentWillMount"), I(t.prototype, "componentWillReceiveProps"), I(t.prototype, "componentWillUpdate"), t.m = !0);
  }

  q$1 && q$1(n);
};

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
    t$2 = new Map();

function e$2 (s) {
  var r = t$2.get(this);
  return r || (r = new Map(), t$2.set(this, r)), (r = n$1(this, r.get(s) || (r.set(s, r = function (n) {
    for (var t, s, r = 1, e = "", u = "", h = [0], p = function (n) {
      1 === r && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n, e) : 3 === r && (n || e) ? (h.push(3, n, e), r = 2) : 2 === r && "..." === e && n ? h.push(4, n, 0) : 2 === r && e && !n ? h.push(5, 0, !0, e) : r >= 5 && ((e || !n && 5 === r) && (h.push(r, 0, e, s), r = 6), n && (h.push(r, n, 0, s), r = 6)), e = "";
    }, a = 0; a < n.length; a++) {
      a && (1 === r && p(), p(a));

      for (var l = 0; l < n[a].length; l++) t = n[a][l], 1 === r ? "<" === t ? (p(), h = [h], r = 3) : e += t : 4 === r ? "--" === e && ">" === t ? (r = 1, e = "") : e = t + e[0] : u ? t === u ? u = "" : e += t : '"' === t || "'" === t ? u = t : ">" === t ? (p(), r = 1) : r && ("=" === t ? (r = 5, s = e, e = "") : "/" === t && (r < 5 || ">" === n[a][l + 1]) ? (p(), 3 === r && (h = h[0]), r = h, (h = h[0]).push(2, 0, r), r = 0) : " " === t || "\t" === t || "\n" === t || "\r" === t ? (p(), r = 2) : e += t), 3 === r && "!--" === e && (r = 4, h = h[0]);
    }

    return p(), h;
  }(s)), r), arguments, [])).length > 1 ? r : r[0];
}

var m$2 = e$2.bind(h);

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
  const [state, dispatch] = m$1(countReducer, {
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
  const [state, dispatch] = m$1(authReducer, initState);
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
  const [route] = useRouteContext();

  if (route === path) {
    return children;
  }

  return null;
}
function Link(props) {
  const {
    to
  } = props;
  const [route, setRoute] = useRouteContext();

  function handleClick(e) {
    e.preventDefault();
    setRoute(to);
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

  return context;
}
function RouteProvider(props) {
  const [route, setRoute] = v$1('/');
  const value = s$1(() => [route, setRoute], [route]);
  return h(RouteContext.Provider, _extends({
    value: value
  }, props));
}

const Login = L(() => import('./Login-539eb269.js'));
const ChangePassword = L(() => import('./ChangePassword-122793cb.js'));
const ForgotPassword = L(() => import('./ForgotPassword-26f75fb2.js'));
const Signup = L(() => import('./Signup-2a7156a6.js'));
H(h(AppProvider, null, h(AuthProvider, null, h(RouteProvider, null, h(Link, {
  to: "/changepassword"
}, "ChangePassword"), h(Link, {
  to: "/login"
}, "Login"), h(Link, {
  to: "/signup"
}, "Signup"), h(Link, {
  to: "/forgotpassword"
}, "ForgotPassword"), h(Route, {
  path: "/changepassword"
}, h(U, {
  fallback: h("div", null, "loading...")
}, h(ChangePassword, null))), h(Route, {
  path: "/login"
}, h(U, {
  fallback: h("div", null, "loading...")
}, h(Login, null))), h(Route, {
  path: "/signup"
}, h(U, {
  fallback: h("div", null, "loading...")
}, h(Signup, null))), h(Route, {
  path: "/forgotpassword"
}, h(U, {
  fallback: h("div", null, "loading...")
}, h(ForgotPassword, null)))))), document.getElementById('app'));

export { M, T$1 as T, _extends as _, h, m$1 as m, p$1 as p, s$1 as s, useAuthContext as u, v$1 as v };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYmVkODdmNzcuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvY29tcGF0L2Rpc3QvY29tcGF0Lm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9odG0vZGlzdC9odG0ubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2h0bS9wcmVhY3QvaW5kZXgubW9kdWxlLmpzIiwiLi4vYXBwLWNvbnRleHQuanMiLCIuLi9hdXRoL2F1dGhSZWR1Y2VyLmpzIiwiLi4vYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi9yb3V0ZS9yb3V0ZXIuanMiLCIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHt1c2VTdGF0ZSBhcyBuLHVzZVJlZHVjZXIgYXMgdCx1c2VFZmZlY3QgYXMgZSx1c2VMYXlvdXRFZmZlY3QgYXMgcix1c2VSZWYgYXMgbyx1c2VJbXBlcmF0aXZlSGFuZGxlIGFzIHUsdXNlTWVtbyBhcyBpLHVzZUNhbGxiYWNrIGFzIGYsdXNlQ29udGV4dCBhcyBjLHVzZURlYnVnVmFsdWUgYXMgYX1mcm9tXCJwcmVhY3QvaG9va3NcIjtleHBvcnQqZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e0NvbXBvbmVudCBhcyBsLGNyZWF0ZUVsZW1lbnQgYXMgcyxvcHRpb25zIGFzIHYsdG9DaGlsZEFycmF5IGFzIGgsaHlkcmF0ZSBhcyBwLHJlbmRlciBhcyBkLF91bm1vdW50IGFzIG0sY2xvbmVFbGVtZW50IGFzIHksY3JlYXRlUmVmIGFzIGIsY3JlYXRlQ29udGV4dCBhcyBnLEZyYWdtZW50IGFzIHh9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2NyZWF0ZUVsZW1lbnQsY3JlYXRlQ29udGV4dCxjcmVhdGVSZWYsRnJhZ21lbnQsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2Z1bmN0aW9uIEUobix0KXtmb3IodmFyIGUgaW4gdCluW2VdPXRbZV07cmV0dXJuIG59ZnVuY3Rpb24gdyhuLHQpe2Zvcih2YXIgZSBpbiBuKWlmKFwiX19zb3VyY2VcIiE9PWUmJiEoZSBpbiB0KSlyZXR1cm4hMDtmb3IodmFyIHIgaW4gdClpZihcIl9fc291cmNlXCIhPT1yJiZuW3JdIT09dFtyXSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgQz1mdW5jdGlvbihuKXt2YXIgdCxlO2Z1bmN0aW9uIHIodCl7dmFyIGU7cmV0dXJuKGU9bi5jYWxsKHRoaXMsdCl8fHRoaXMpLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwLGV9cmV0dXJuIGU9biwodD1yKS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Ll9fcHJvdG9fXz1lLHIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuLHQpe3JldHVybiB3KHRoaXMucHJvcHMsbil8fHcodGhpcy5zdGF0ZSx0KX0scn0obCk7ZnVuY3Rpb24gXyhuLHQpe2Z1bmN0aW9uIGUobil7dmFyIGU9dGhpcy5wcm9wcy5yZWYscj1lPT1uLnJlZjtyZXR1cm4hciYmZSYmKGUuY2FsbD9lKG51bGwpOmUuY3VycmVudD1udWxsKSx0PyF0KHRoaXMucHJvcHMsbil8fCFyOncodGhpcy5wcm9wcyxuKX1mdW5jdGlvbiByKHQpe3JldHVybiB0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1lLHMobixFKHt9LHQpKX1yZXR1cm4gci5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD0hMCxyLmRpc3BsYXlOYW1lPVwiTWVtbyhcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIixyLnQ9ITAscn12YXIgQT12Ll9fYjtmdW5jdGlvbiBTKG4pe2Z1bmN0aW9uIHQodCl7dmFyIGU9RSh7fSx0KTtyZXR1cm4gZGVsZXRlIGUucmVmLG4oZSx0LnJlZil9cmV0dXJuIHQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9dC50PSEwLHQuZGlzcGxheU5hbWU9XCJGb3J3YXJkUmVmKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHR9di5fX2I9ZnVuY3Rpb24obil7bi50eXBlJiZuLnR5cGUudCYmbi5yZWYmJihuLnByb3BzLnJlZj1uLnJlZixuLnJlZj1udWxsKSxBJiZBKG4pfTt2YXIgaz1mdW5jdGlvbihuLHQpe3JldHVybiBuP2gobikucmVkdWNlKGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gbi5jb25jYXQodChlLHIpKX0sW10pOm51bGx9LFI9e21hcDprLGZvckVhY2g6ayxjb3VudDpmdW5jdGlvbihuKXtyZXR1cm4gbj9oKG4pLmxlbmd0aDowfSxvbmx5OmZ1bmN0aW9uKG4pe2lmKDEhPT0obj1oKG4pKS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuXCIpO3JldHVybiBuWzBdfSx0b0FycmF5Omh9LEY9di5fX2U7ZnVuY3Rpb24gTihuKXtyZXR1cm4gbiYmKChuPUUoe30sbikpLl9fYz1udWxsLG4uX19rPW4uX19rJiZuLl9fay5tYXAoTikpLG59ZnVuY3Rpb24gVSgpe3RoaXMuX191PTAsdGhpcy5vPW51bGwsdGhpcy5fX2I9bnVsbH1mdW5jdGlvbiBNKG4pe3ZhciB0PW4uX18uX19jO3JldHVybiB0JiZ0LnUmJnQudShuKX1mdW5jdGlvbiBMKG4pe3ZhciB0LGUscjtmdW5jdGlvbiBvKG8pe2lmKHR8fCh0PW4oKSkudGhlbihmdW5jdGlvbihuKXtlPW4uZGVmYXVsdHx8bn0sZnVuY3Rpb24obil7cj1ufSkscil0aHJvdyByO2lmKCFlKXRocm93IHQ7cmV0dXJuIHMoZSxvKX1yZXR1cm4gby5kaXNwbGF5TmFtZT1cIkxhenlcIixvLnQ9ITAsb31mdW5jdGlvbiBPKCl7dGhpcy5pPW51bGwsdGhpcy5sPW51bGx9di5fX2U9ZnVuY3Rpb24obix0LGUpe2lmKG4udGhlbilmb3IodmFyIHIsbz10O289by5fXzspaWYoKHI9by5fX2MpJiZyLl9fYylyZXR1cm4gci5fX2Mobix0Ll9fYyk7RihuLHQsZSl9LChVLnByb3RvdHlwZT1uZXcgbCkuX19jPWZ1bmN0aW9uKG4sdCl7dmFyIGU9dGhpcztudWxsPT1lLm8mJihlLm89W10pLGUuby5wdXNoKHQpO3ZhciByPU0oZS5fX3YpLG89ITEsdT1mdW5jdGlvbigpe298fChvPSEwLHI/cihpKTppKCkpfTt0Ll9fYz10LmNvbXBvbmVudFdpbGxVbm1vdW50LHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1KCksdC5fX2MmJnQuX19jKCl9O3ZhciBpPWZ1bmN0aW9uKCl7dmFyIG47aWYoIS0tZS5fX3UpZm9yKGUuX192Ll9fa1swXT1lLnN0YXRlLnUsZS5zZXRTdGF0ZSh7dTplLl9fYj1udWxsfSk7bj1lLm8ucG9wKCk7KW4uZm9yY2VVcGRhdGUoKX07ZS5fX3UrK3x8ZS5zZXRTdGF0ZSh7dTplLl9fYj1lLl9fdi5fX2tbMF19KSxuLnRoZW4odSx1KX0sVS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMuX19iJiYodGhpcy5fX3YuX19rWzBdPU4odGhpcy5fX2IpLHRoaXMuX19iPW51bGwpLFtzKGwsbnVsbCx0LnU/bnVsbDpuLmNoaWxkcmVuKSx0LnUmJm4uZmFsbGJhY2tdfTt2YXIgUD1mdW5jdGlvbihuLHQsZSl7aWYoKytlWzFdPT09ZVswXSYmbi5sLmRlbGV0ZSh0KSxuLnByb3BzLnJldmVhbE9yZGVyJiYoXCJ0XCIhPT1uLnByb3BzLnJldmVhbE9yZGVyWzBdfHwhbi5sLnNpemUpKWZvcihlPW4uaTtlOyl7Zm9yKDtlLmxlbmd0aD4zOyllLnBvcCgpKCk7aWYoZVsxXTxlWzBdKWJyZWFrO24uaT1lPWVbMl19fTsoTy5wcm90b3R5cGU9bmV3IGwpLnU9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcyxlPU0odC5fX3YpLHI9dC5sLmdldChuKTtyZXR1cm4gclswXSsrLGZ1bmN0aW9uKG8pe3ZhciB1PWZ1bmN0aW9uKCl7dC5wcm9wcy5yZXZlYWxPcmRlcj8oci5wdXNoKG8pLFAodCxuLHIpKTpvKCl9O2U/ZSh1KTp1KCl9fSxPLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obil7dGhpcy5pPW51bGwsdGhpcy5sPW5ldyBNYXA7dmFyIHQ9aChuLmNoaWxkcmVuKTtuLnJldmVhbE9yZGVyJiZcImJcIj09PW4ucmV2ZWFsT3JkZXJbMF0mJnQucmV2ZXJzZSgpO2Zvcih2YXIgZT10Lmxlbmd0aDtlLS07KXRoaXMubC5zZXQodFtlXSx0aGlzLmk9WzEsMCx0aGlzLmldKTtyZXR1cm4gbi5jaGlsZHJlbn0sTy5wcm90b3R5cGUuY29tcG9uZW50RGlkVXBkYXRlPU8ucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50PWZ1bmN0aW9uKCl7dmFyIG49dGhpcztuLmwuZm9yRWFjaChmdW5jdGlvbih0LGUpe1AobixlLHQpfSl9O3ZhciBXPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe312YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0fSx0LnJlbmRlcj1mdW5jdGlvbihuKXtyZXR1cm4gbi5jaGlsZHJlbn0sbn0oKTtmdW5jdGlvbiBqKG4pe3ZhciB0PXRoaXMsZT1uLmNvbnRhaW5lcixyPXMoVyx7Y29udGV4dDp0LmNvbnRleHR9LG4udm5vZGUpO3JldHVybiB0LnMmJnQucyE9PWUmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpLHQucD0hMSksbi52bm9kZT90LnA/KGUuX19rPXQuX19rLGQocixlKSx0Ll9faz1lLl9fayk6KHQudj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSxwKFwiXCIsZSksZS5hcHBlbmRDaGlsZCh0LnYpLHQucD0hMCx0LnM9ZSxkKHIsZSx0LnYpLHQuX19rPXQudi5fX2spOnQucCYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCkpLHQuaD1yLHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpfSxudWxsfWZ1bmN0aW9uIHoobix0KXtyZXR1cm4gcyhqLHt2bm9kZTpuLGNvbnRhaW5lcjp0fSl9dmFyIEQ9L14oPzphY2NlbnR8YWxpZ25tZW50fGFyYWJpY3xiYXNlbGluZXxjYXB8Y2xpcCg/IVBhdGhVKXxjb2xvcnxmaWxsfGZsb29kfGZvbnR8Z2x5cGgoPyFSKXxob3JpenxtYXJrZXIoPyFIfFd8VSl8b3ZlcmxpbmV8cGFpbnR8c3RvcHxzdHJpa2V0aHJvdWdofHN0cm9rZXx0ZXh0KD8hTCl8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZWN0b3J8dmVydHx3b3JkfHdyaXRpbmd8eCg/IUMpKVtBLVpdLztsLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXt9O3ZhciBIPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpfHw2MDEwMztmdW5jdGlvbiBUKG4sdCxlKXtpZihudWxsPT10Ll9faylmb3IoO3QuZmlyc3RDaGlsZDspdC5yZW1vdmVDaGlsZCh0LmZpcnN0Q2hpbGQpO3JldHVybiBkKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH1mdW5jdGlvbiBWKG4sdCxlKXtyZXR1cm4gcChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9dmFyIFo9di5ldmVudDtmdW5jdGlvbiBJKG4sdCl7bltcIlVOU0FGRV9cIit0XSYmIW5bdF0mJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLHQse2NvbmZpZ3VyYWJsZTohMSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tcIlVOU0FGRV9cIit0XX0sc2V0OmZ1bmN0aW9uKG4pe3RoaXNbXCJVTlNBRkVfXCIrdF09bn19KX12LmV2ZW50PWZ1bmN0aW9uKG4pe1omJihuPVoobikpLG4ucGVyc2lzdD1mdW5jdGlvbigpe307dmFyIHQ9ITEsZT0hMSxyPW4uc3RvcFByb3BhZ2F0aW9uO24uc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7ci5jYWxsKG4pLHQ9ITB9O3ZhciBvPW4ucHJldmVudERlZmF1bHQ7cmV0dXJuIG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtvLmNhbGwobiksZT0hMH0sbi5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1mdW5jdGlvbigpe3JldHVybiB0fSxuLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBlfSxuLm5hdGl2ZUV2ZW50PW59O3ZhciAkPXtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xhc3N9fSxxPXYudm5vZGU7di52bm9kZT1mdW5jdGlvbihuKXtuLiQkdHlwZW9mPUg7dmFyIHQ9bi50eXBlLGU9bi5wcm9wcztpZih0KXtpZihlLmNsYXNzIT1lLmNsYXNzTmFtZSYmKCQuZW51bWVyYWJsZT1cImNsYXNzTmFtZVwiaW4gZSxudWxsIT1lLmNsYXNzTmFtZSYmKGUuY2xhc3M9ZS5jbGFzc05hbWUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiY2xhc3NOYW1lXCIsJCkpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpe3ZhciByLG8sdTtmb3IodSBpbiBlLmRlZmF1bHRWYWx1ZSYmdm9pZCAwIT09ZS52YWx1ZSYmKGUudmFsdWV8fDA9PT1lLnZhbHVlfHwoZS52YWx1ZT1lLmRlZmF1bHRWYWx1ZSksZGVsZXRlIGUuZGVmYXVsdFZhbHVlKSxBcnJheS5pc0FycmF5KGUudmFsdWUpJiZlLm11bHRpcGxlJiZcInNlbGVjdFwiPT09dCYmKGgoZS5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbihuKXstMSE9ZS52YWx1ZS5pbmRleE9mKG4ucHJvcHMudmFsdWUpJiYobi5wcm9wcy5zZWxlY3RlZD0hMCl9KSxkZWxldGUgZS52YWx1ZSksZSlpZihyPUQudGVzdCh1KSlicmVhaztpZihyKWZvcih1IGluIG89bi5wcm9wcz17fSxlKW9bRC50ZXN0KHUpP3UucmVwbGFjZSgvW0EtWjAtOV0vLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCk6dV09ZVt1XX0hZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlLHI9bi5wcm9wcztpZihyJiZcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIG89e307Zm9yKHZhciB1IGluIHIpL15vbihBbml8VHJhfFRvdSkvLnRlc3QodSkmJihyW3UudG9Mb3dlckNhc2UoKV09clt1XSxkZWxldGUgclt1XSksb1t1LnRvTG93ZXJDYXNlKCldPXU7aWYoby5vbmRvdWJsZWNsaWNrJiYoci5vbmRibGNsaWNrPXJbby5vbmRvdWJsZWNsaWNrXSxkZWxldGUgcltvLm9uZG91YmxlY2xpY2tdKSxvLm9uYmVmb3JlaW5wdXQmJihyLm9uYmVmb3JlaW5wdXQ9cltvLm9uYmVmb3JlaW5wdXRdLGRlbGV0ZSByW28ub25iZWZvcmVpbnB1dF0pLG8ub25jaGFuZ2UmJihcInRleHRhcmVhXCI9PT1lfHxcImlucHV0XCI9PT1lLnRvTG93ZXJDYXNlKCkmJiEvXmZpbHxjaGV8cmEvaS50ZXN0KHIudHlwZSkpKXt2YXIgaT1vLm9uaW5wdXR8fFwib25pbnB1dFwiO3JbaV18fChyW2ldPXJbby5vbmNoYW5nZV0sZGVsZXRlIHJbby5vbmNoYW5nZV0pfX19KCksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmIXQubSYmdC5wcm90b3R5cGUmJihJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbE1vdW50XCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzXCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsVXBkYXRlXCIpLHQubT0hMCl9cSYmcShuKX07dmFyIEI9XCIxNi44LjBcIjtmdW5jdGlvbiBHKG4pe3JldHVybiBzLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBKKG4pe3JldHVybiEhbiYmbi4kJHR5cGVvZj09PUh9ZnVuY3Rpb24gSyhuKXtyZXR1cm4gSihuKT95LmFwcGx5KG51bGwsYXJndW1lbnRzKTpufWZ1bmN0aW9uIFEobil7cmV0dXJuISFuLl9fayYmKGQobnVsbCxuKSwhMCl9ZnVuY3Rpb24gWChuKXtyZXR1cm4gbiYmKG4uYmFzZXx8MT09PW4ubm9kZVR5cGUmJm4pfHxudWxsfXZhciBZPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4odCl9O2V4cG9ydCBkZWZhdWx0e3VzZVN0YXRlOm4sdXNlUmVkdWNlcjp0LHVzZUVmZmVjdDplLHVzZUxheW91dEVmZmVjdDpyLHVzZVJlZjpvLHVzZUltcGVyYXRpdmVIYW5kbGU6dSx1c2VNZW1vOmksdXNlQ2FsbGJhY2s6Zix1c2VDb250ZXh0OmMsdXNlRGVidWdWYWx1ZTphLHZlcnNpb246XCIxNi44LjBcIixDaGlsZHJlbjpSLHJlbmRlcjpULGh5ZHJhdGU6VCx1bm1vdW50Q29tcG9uZW50QXROb2RlOlEsY3JlYXRlUG9ydGFsOnosY3JlYXRlRWxlbWVudDpzLGNyZWF0ZUNvbnRleHQ6ZyxjcmVhdGVGYWN0b3J5OkcsY2xvbmVFbGVtZW50OkssY3JlYXRlUmVmOmIsRnJhZ21lbnQ6eCxpc1ZhbGlkRWxlbWVudDpKLGZpbmRET01Ob2RlOlgsQ29tcG9uZW50OmwsUHVyZUNvbXBvbmVudDpDLG1lbW86Xyxmb3J3YXJkUmVmOlMsdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXM6WSxTdXNwZW5zZTpVLFN1c3BlbnNlTGlzdDpPLGxhenk6TH07ZXhwb3J0e0IgYXMgdmVyc2lvbixSIGFzIENoaWxkcmVuLFQgYXMgcmVuZGVyLFYgYXMgaHlkcmF0ZSxRIGFzIHVubW91bnRDb21wb25lbnRBdE5vZGUseiBhcyBjcmVhdGVQb3J0YWwsRyBhcyBjcmVhdGVGYWN0b3J5LEsgYXMgY2xvbmVFbGVtZW50LEogYXMgaXNWYWxpZEVsZW1lbnQsWCBhcyBmaW5kRE9NTm9kZSxDIGFzIFB1cmVDb21wb25lbnQsXyBhcyBtZW1vLFMgYXMgZm9yd2FyZFJlZixZIGFzIHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzLFUgYXMgU3VzcGVuc2UsTyBhcyBTdXNwZW5zZUxpc3QsTCBhcyBsYXp5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBhdC5tb2R1bGUuanMubWFwXG4iLCJ2YXIgbj1mdW5jdGlvbih0LHMscixlKXt2YXIgdTtzWzBdPTA7Zm9yKHZhciBoPTE7aDxzLmxlbmd0aDtoKyspe3ZhciBwPXNbaCsrXSxhPXNbaF0/KHNbMF18PXA/MToyLHJbc1toKytdXSk6c1srK2hdOzM9PT1wP2VbMF09YTo0PT09cD9lWzFdPU9iamVjdC5hc3NpZ24oZVsxXXx8e30sYSk6NT09PXA/KGVbMV09ZVsxXXx8e30pW3NbKytoXV09YTo2PT09cD9lWzFdW3NbKytoXV0rPWErXCJcIjpwPyh1PXQuYXBwbHkoYSxuKHQsYSxyLFtcIlwiLG51bGxdKSksZS5wdXNoKHUpLGFbMF0/c1swXXw9Mjooc1toLTJdPTAsc1toXT11KSk6ZS5wdXNoKGEpfXJldHVybiBlfSx0PW5ldyBNYXA7ZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocyl7dmFyIHI9dC5nZXQodGhpcyk7cmV0dXJuIHJ8fChyPW5ldyBNYXAsdC5zZXQodGhpcyxyKSksKHI9bih0aGlzLHIuZ2V0KHMpfHwoci5zZXQocyxyPWZ1bmN0aW9uKG4pe2Zvcih2YXIgdCxzLHI9MSxlPVwiXCIsdT1cIlwiLGg9WzBdLHA9ZnVuY3Rpb24obil7MT09PXImJihufHwoZT1lLnJlcGxhY2UoL15cXHMqXFxuXFxzKnxcXHMqXFxuXFxzKiQvZyxcIlwiKSkpP2gucHVzaCgwLG4sZSk6Mz09PXImJihufHxlKT8oaC5wdXNoKDMsbixlKSxyPTIpOjI9PT1yJiZcIi4uLlwiPT09ZSYmbj9oLnB1c2goNCxuLDApOjI9PT1yJiZlJiYhbj9oLnB1c2goNSwwLCEwLGUpOnI+PTUmJigoZXx8IW4mJjU9PT1yKSYmKGgucHVzaChyLDAsZSxzKSxyPTYpLG4mJihoLnB1c2gocixuLDAscykscj02KSksZT1cIlwifSxhPTA7YTxuLmxlbmd0aDthKyspe2EmJigxPT09ciYmcCgpLHAoYSkpO2Zvcih2YXIgbD0wO2w8blthXS5sZW5ndGg7bCsrKXQ9blthXVtsXSwxPT09cj9cIjxcIj09PXQ/KHAoKSxoPVtoXSxyPTMpOmUrPXQ6ND09PXI/XCItLVwiPT09ZSYmXCI+XCI9PT10PyhyPTEsZT1cIlwiKTplPXQrZVswXTp1P3Q9PT11P3U9XCJcIjplKz10OidcIic9PT10fHxcIidcIj09PXQ/dT10OlwiPlwiPT09dD8ocCgpLHI9MSk6ciYmKFwiPVwiPT09dD8ocj01LHM9ZSxlPVwiXCIpOlwiL1wiPT09dCYmKHI8NXx8XCI+XCI9PT1uW2FdW2wrMV0pPyhwKCksMz09PXImJihoPWhbMF0pLHI9aCwoaD1oWzBdKS5wdXNoKDIsMCxyKSxyPTApOlwiIFwiPT09dHx8XCJcXHRcIj09PXR8fFwiXFxuXCI9PT10fHxcIlxcclwiPT09dD8ocCgpLHI9Mik6ZSs9dCksMz09PXImJlwiIS0tXCI9PT1lJiYocj00LGg9aFswXSl9cmV0dXJuIHAoKSxofShzKSksciksYXJndW1lbnRzLFtdKSkubGVuZ3RoPjE/cjpyWzBdfVxuIiwiaW1wb3J0e2ggYXMgcixDb21wb25lbnQgYXMgbyxyZW5kZXIgYXMgdH1mcm9tXCJwcmVhY3RcIjtleHBvcnR7aCxyZW5kZXIsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2ltcG9ydCBlIGZyb21cImh0bVwiO3ZhciBtPWUuYmluZChyKTtleHBvcnR7bSBhcyBodG1sfTtcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBBcHBDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gY291bnRSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlICdJTkNSRU1FTlQnOlxyXG4gICAgICByZXR1cm4geyBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGFjdGlvbiB0eXBlJHthY3Rpb24udHlwZX1gKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVzZUFwcENvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG4gIGNvbnN0IGluY3JlbWVudCA9ICgpID0+IGRpc3BhdGNoKHsgdHlwZTogJ0lOQ1JFTUVOVCcgfSk7XHJcbiAgcmV0dXJuIHsgc3RhdGUsIGRpc3BhdGNoLCBpbmNyZW1lbnQgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gQXBwUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoY291bnRSZWR1Y2VyLCB7IGNvdW50OiAwIH0pO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5leHBvcnQgeyBBcHBQcm92aWRlciwgdXNlQXBwQ29udGV4dCB9O1xyXG4iLCJleHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGVtYWlsOiAnJyxcclxuICBwYXNzd29yZDogJycsXHJcbiAgc3VjY2VzczogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgdXNlcm5hbWU6ICcnLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGNvbmZpcm06ICcnLFxyXG4gIGN1cnJlbnQ6ICcnLFxyXG4gIGVtYWlsb3J1c2VybmFtZTogJycsXHJcbiAgdG9rZW46IG51bGwsXHJcbiAgaXNMb2dnZWRJbjogZmFsc2UsXHJcbiAgaXNQYXNzd29yZENoYW5nZWQ6IGZhbHNlLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBbYWN0aW9uLnBheWxvYWQucHJvcE5hbWVdOiBhY3Rpb24ucGF5bG9hZC52YWx1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUsICcsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcclxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1Bhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5JyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIHN1Y2Nlc3M6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHRva2VuOiBhY3Rpb24udG9rZW4gfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vYXV0aFJlZHVjZXInO1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VBdXRoQ29udGV4dCwgQXV0aFByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbywgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtyb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgaWYgKHJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xyXG4gIGNvbnN0IHsgdG8gfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2V0Um91dGUodG8pO1xyXG4gIH1cclxuICByZXR1cm4gPGEgey4uLnByb3BzfSBocmVmPXt0b30gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFJvdXRlQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCcvJyk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbcm91dGUsIHNldFJvdXRlXSwgW3JvdXRlXSk7XHJcblxyXG4gIHJldHVybiA8Um91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5pbXBvcnQgeyBodG1sIH0gZnJvbSAnaHRtL3ByZWFjdCc7XHJcbmltcG9ydCBUZXN0Q29tcG9uZW50IGZyb20gJy4vVGVzdENvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFwcFByb3ZpZGVyIH0gZnJvbSAnLi9hcHAtY29udGV4dCc7XHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCBSb3V0ZSwgTGluayB9IGZyb20gJy4vcm91dGUvcm91dGVyJztcclxuXHJcbmNvbnN0IExvZ2luID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vYXV0aC9Mb2dpbicpKTtcclxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL0NoYW5nZVBhc3N3b3JkJykpO1xyXG5jb25zdCBGb3Jnb3RQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvRm9yZ290UGFzc3dvcmQnKSk7XHJcbmNvbnN0IFNpZ251cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvU2lnbnVwJykpO1xyXG5cclxucmVuZGVyKFxyXG4gIDxBcHBQcm92aWRlcj5cclxuICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgIDxSb3V0ZVByb3ZpZGVyPlxyXG4gICAgICAgIDxMaW5rIHRvPVwiL2NoYW5nZXBhc3N3b3JkXCI+Q2hhbmdlUGFzc3dvcmQ8L0xpbms+XHJcbiAgICAgICAgPExpbmsgdG89XCIvbG9naW5cIj5Mb2dpbjwvTGluaz5cclxuICAgICAgICA8TGluayB0bz1cIi9zaWdudXBcIj5TaWdudXA8L0xpbms+XHJcbiAgICAgICAgPExpbmsgdG89XCIvZm9yZ290cGFzc3dvcmRcIj5Gb3Jnb3RQYXNzd29yZDwvTGluaz5cclxuICAgICAgICA8Um91dGUgcGF0aD1cIi9jaGFuZ2VwYXNzd29yZFwiPlxyXG4gICAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgLz5cclxuICAgICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICA8Um91dGUgcGF0aD1cIi9sb2dpblwiPlxyXG4gICAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgICA8TG9naW4gLz5cclxuICAgICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgICAgPC9Sb3V0ZT5cclxuICAgICAgICA8Um91dGUgcGF0aD1cIi9zaWdudXBcIj5cclxuICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgICAgPFNpZ251cCAvPlxyXG4gICAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgICA8L1JvdXRlPlxyXG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiL2ZvcmdvdHBhc3N3b3JkXCI+XHJcbiAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAvPlxyXG4gICAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgICA8L1JvdXRlPlxyXG4gICAgICA8L1JvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0F1dGhQcm92aWRlcj5cclxuICA8L0FwcFByb3ZpZGVyPixcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcclxuKTtcclxuIl0sIm5hbWVzIjpbIkVNUFRZX09CSiIsIkVNUFRZX0FSUiIsIklTX05PTl9ESU1FTlNJT05BTCIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRDb21wb25lbnQiLCJwcmV2UmFmIiwiYWZ0ZXJQYWludEVmZmVjdHMiLCJvbGRCZWZvcmVSZW5kZXIiLCJvcHRpb25zIiwiX3JlbmRlciIsIm9sZEFmdGVyRGlmZiIsImRpZmZlZCIsIm9sZENvbW1pdCIsIl9jb21taXQiLCJvbGRCZWZvcmVVbm1vdW50IiwidW5tb3VudCIsImdldEhvb2tTdGF0ZSIsImluZGV4IiwiX2hvb2siLCJob29rcyIsIl9faG9va3MiLCJfbGlzdCIsIl9wZW5kaW5nRWZmZWN0cyIsImxlbmd0aCIsInB1c2giLCJ1c2VTdGF0ZSIsImluaXRpYWxTdGF0ZSIsInVzZVJlZHVjZXIiLCJpbnZva2VPclJldHVybiIsInJlZHVjZXIiLCJpbml0IiwiaG9va1N0YXRlIiwiX2NvbXBvbmVudCIsIl92YWx1ZSIsInVuZGVmaW5lZCIsIm5leHRWYWx1ZSIsImFjdGlvbiIsInNldFN0YXRlIiwidXNlRWZmZWN0IiwiY2FsbGJhY2siLCJhcmdzIiwic3RhdGUiLCJhcmdzQ2hhbmdlZCIsIl9hcmdzIiwidXNlTWVtbyIsImZhY3RvcnkiLCJfZmFjdG9yeSIsInVzZUNvbnRleHQiLCJjb250ZXh0IiwicHJvdmlkZXIiLCJfaWQiLCJfZGVmYXVsdFZhbHVlIiwic3ViIiwicHJvcHMiLCJ2YWx1ZSIsImZsdXNoQWZ0ZXJQYWludEVmZmVjdHMiLCJzb21lIiwiY29tcG9uZW50IiwiX3BhcmVudERvbSIsImZvckVhY2giLCJpbnZva2VDbGVhbnVwIiwiaW52b2tlRWZmZWN0IiwiZSIsIl9jYXRjaEVycm9yIiwiX3Zub2RlIiwiaG9vayIsIl9jbGVhbnVwIiwicmVzdWx0Iiwib2xkQXJncyIsIm5ld0FyZ3MiLCJhcmciLCJmIiwidm5vZGUiLCJjIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicmFmIiwiZG9uZSIsImNsZWFyVGltZW91dCIsInRpbWVvdXQiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInNldFRpbWVvdXQiLCJ3aW5kb3ciLCJjb21taXRRdWV1ZSIsIl9yZW5kZXJDYWxsYmFja3MiLCJmaWx0ZXIiLCJjYiIsImFzc2lnbiIsIm9iaiIsImkiLCJzaGFsbG93RGlmZmVycyIsImEiLCJiIiwibiIsInQiLCJzIiwiciIsInUiLCJoIiwicCIsIk9iamVjdCIsImFwcGx5IiwiTWFwIiwiZ2V0Iiwic2V0IiwicmVwbGFjZSIsImwiLCJhcmd1bWVudHMiLCJtIiwiYmluZCIsIkFwcENvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwiY291bnRSZWR1Y2VyIiwidHlwZSIsImNvdW50IiwiRXJyb3IiLCJBcHBQcm92aWRlciIsImRpc3BhdGNoIiwiaW5pdFN0YXRlIiwiZW1haWwiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJlcnJvciIsInVzZXJuYW1lIiwibG9hZGluZyIsImNvbmZpcm0iLCJjdXJyZW50IiwiZW1haWxvcnVzZXJuYW1lIiwidG9rZW4iLCJpc0xvZ2dlZEluIiwiaXNQYXNzd29yZENoYW5nZWQiLCJhdXRoUmVkdWNlciIsImFjdGlvblR5cGVzIiwiVkFMVUVfQ0hBTkdFRCIsInBheWxvYWQiLCJwcm9wTmFtZSIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwic3VjY2Vzc01lc3NhZ2UiLCJMT0dJTl9GQUlMRUQiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJBdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwiUm91dGVDb250ZXh0IiwiUm91dGUiLCJjaGlsZHJlbiIsInBhdGgiLCJyb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsIkxpbmsiLCJ0byIsInNldFJvdXRlIiwiaGFuZGxlQ2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsIlJvdXRlUHJvdmlkZXIiLCJMb2dpbiIsImxhenkiLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwicmVuZGVyIiwiU3VzcGVuc2UiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiS0FBTztBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLElBQU1BLENBQUFBLEdBQVksRUFBbEI7QUFBQSxJQUNNQyxDQUFBQSxHQUFZLEVBRGxCO0FBQUEsSUFFTUMsQ0FBQUEsR0FBcUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQ2xDLElBQUlDLEdBQUo7QUFBQSxJQUdJQyxHQUhKO0FBQUEsSUFjSUMsR0FkSjtBQUFBLElBTUlDLEdBQUFBLEdBQW9CLEVBTnhCO0FBQUEsSUFRSUMsR0FBQUEsR0FBa0JDLENBQUFBLENBQVFDLEdBUjlCO0FBQUEsSUFTSUMsR0FBQUEsR0FBZUYsQ0FBQUEsQ0FBUUcsTUFUM0I7QUFBQSxJQVVJQyxHQUFBQSxHQUFZSixDQUFBQSxDQUFRSyxHQVZ4QjtBQUFBLElBV0lDLEdBQUFBLEdBQW1CTixDQUFBQSxDQUFRTyxPQVgvQjs7QUFtRkEsU0FBU0MsR0FBVCxDQUFzQkMsQ0FBdEIsRUFBc0JBO0FBQ2pCVCxFQUFBQSxDQUFBQSxD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
