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

function L(n, l) {
  return l = a(a({}, n.props), l), arguments.length > 2 && (l.children = c.slice.call(arguments, 2)), p(n.type, l, l.key || n.key, l.ref || n.ref, null);
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

function L$1(n) {
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

var EMPTY$1 = {};

function assign(obj, props) {
  // eslint-disable-next-line guard-for-in
  for (var i in props) {
    obj[i] = props[i];
  }

  return obj;
}

function exec(url, route, opts) {
  var reg = /(?:\?([^#]*))?(#.*)?$/,
      c = url.match(reg),
      matches = {},
      ret;

  if (c && c[1]) {
    var p = c[1].split('&');

    for (var i = 0; i < p.length; i++) {
      var r = p[i].split('=');
      matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
    }
  }

  url = segmentize(url.replace(reg, ''));
  route = segmentize(route || '');
  var max = Math.max(url.length, route.length);

  for (var i$1 = 0; i$1 < max; i$1++) {
    if (route[i$1] && route[i$1].charAt(0) === ':') {
      var param = route[i$1].replace(/(^:|[+*?]+$)/g, ''),
          flags = (route[i$1].match(/[+*?]+$/) || EMPTY$1)[0] || '',
          plus = ~flags.indexOf('+'),
          star = ~flags.indexOf('*'),
          val = url[i$1] || '';

      if (!val && !star && (flags.indexOf('?') < 0 || plus)) {
        ret = false;
        break;
      }

      matches[param] = decodeURIComponent(val);

      if (plus || star) {
        matches[param] = url.slice(i$1).map(decodeURIComponent).join('/');
        break;
      }
    } else if (route[i$1] !== url[i$1]) {
      ret = false;
      break;
    }
  }

  if (opts.default !== true && ret === false) {
    return false;
  }

  return matches;
}

function pathRankSort(a, b) {
  return a.rank < b.rank ? 1 : a.rank > b.rank ? -1 : a.index - b.index;
} // filter out VNodes without attributes (which are unrankeable), and add `index`/`rank` properties to be used in sorting.


function prepareVNodeForRanking(vnode, index) {
  vnode.index = index;
  vnode.rank = rankChild(vnode);
  return vnode.props;
}

function segmentize(url) {
  return url.replace(/(^\/+|\/+$)/g, '').split('/');
}

function rankSegment(segment) {
  return segment.charAt(0) == ':' ? 1 + '*+?'.indexOf(segment.charAt(segment.length - 1)) || 4 : 5;
}

function rank(path) {
  return segmentize(path).map(rankSegment).join('');
}

function rankChild(vnode) {
  return vnode.props.default ? 0 : rank(vnode.props.path);
}

var customHistory = null;
var ROUTERS = [];
var subscribers = [];
var EMPTY = {};

function setUrl(url, type) {
  if (type === void 0) type = 'push';

  if (customHistory && customHistory[type]) {
    customHistory[type](url);
  } else if (typeof history !== 'undefined' && history[type + 'State']) {
    history[type + 'State'](null, null, url);
  }
}

function getCurrentUrl() {
  var url;

  if (customHistory && customHistory.location) {
    url = customHistory.location;
  } else if (customHistory && customHistory.getCurrentLocation) {
    url = customHistory.getCurrentLocation();
  } else {
    url = typeof location !== 'undefined' ? location : EMPTY;
  }

  return "" + (url.pathname || '') + (url.search || '');
}

function route(url, replace) {
  if (replace === void 0) replace = false;

  if (typeof url !== 'string' && url.url) {
    replace = url.replace;
    url = url.url;
  } // only push URL into history if we can handle it


  if (canRoute(url)) {
    setUrl(url, replace ? 'replace' : 'push');
  }

  return routeTo(url);
}
/** Check if the given URL can be handled by any router instances. */


function canRoute(url) {
  for (var i = ROUTERS.length; i--;) {
    if (ROUTERS[i].canRoute(url)) {
      return true;
    }
  }

  return false;
}
/** Tell all router instances to handle the given URL.  */


function routeTo(url) {
  var didRoute = false;

  for (var i = 0; i < ROUTERS.length; i++) {
    if (ROUTERS[i].routeTo(url) === true) {
      didRoute = true;
    }
  }

  for (var i$1 = subscribers.length; i$1--;) {
    subscribers[i$1](url);
  }

  return didRoute;
}

function routeFromLink(node) {
  // only valid elements
  if (!node || !node.getAttribute) {
    return;
  }

  var href = node.getAttribute('href'),
      target = node.getAttribute('target'); // ignore links with targets and non-path URLs

  if (!href || !href.match(/^\//g) || target && !target.match(/^_?self$/i)) {
    return;
  } // attempt to route, if no match simply cede control to browser


  return route(href);
}

function handleLinkClick(e) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
    return;
  }

  routeFromLink(e.currentTarget || e.target || this);
  return prevent(e);
}

function prevent(e) {
  if (e) {
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }

    if (e.stopPropagation) {
      e.stopPropagation();
    }

    e.preventDefault();
  }

  return false;
}

function delegateLinkHandler(e) {
  // ignore events the browser takes care of already:
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
    return;
  }

  var t = e.target;

  do {
    if (String(t.nodeName).toUpperCase() === 'A' && t.getAttribute('href')) {
      if (t.hasAttribute('native')) {
        return;
      } // if link is handled by the router, prevent browser defaults


      if (routeFromLink(t)) {
        return prevent(e);
      }
    }
  } while (t = t.parentNode);
}

var eventListenersInitialized = false;

function initEventListeners() {
  if (eventListenersInitialized) {
    return;
  }

  if (typeof addEventListener === 'function') {
    if (!customHistory) {
      addEventListener('popstate', function () {
        routeTo(getCurrentUrl());
      });
    }

    addEventListener('click', delegateLinkHandler);
  }

  eventListenersInitialized = true;
}

var Router = function (Component$$1) {
  function Router(props) {
    Component$$1.call(this, props);

    if (props.history) {
      customHistory = props.history;
    }

    this.state = {
      url: props.url || getCurrentUrl()
    };
    initEventListeners();
  }

  if (Component$$1) Router.__proto__ = Component$$1;
  Router.prototype = Object.create(Component$$1 && Component$$1.prototype);
  Router.prototype.constructor = Router;

  Router.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
    if (props.static !== true) {
      return true;
    }

    return props.url !== this.props.url || props.onChange !== this.props.onChange;
  };
  /** Check if the given URL can be matched against any children */


  Router.prototype.canRoute = function canRoute(url) {
    var children = x(this.props.children);
    return this.getMatchingChildren(children, url, false).length > 0;
  };
  /** Re-render children with a new URL to match against. */


  Router.prototype.routeTo = function routeTo(url) {
    this.setState({
      url: url
    });
    var didRoute = this.canRoute(url); // trigger a manual re-route if we're not in the middle of an update:

    if (!this.updating) {
      this.forceUpdate();
    }

    return didRoute;
  };

  Router.prototype.componentWillMount = function componentWillMount() {
    ROUTERS.push(this);
    this.updating = true;
  };

  Router.prototype.componentDidMount = function componentDidMount() {
    var this$1 = this;

    if (customHistory) {
      this.unlisten = customHistory.listen(function (location) {
        this$1.routeTo("" + (location.pathname || '') + (location.search || ''));
      });
    }

    this.updating = false;
  };

  Router.prototype.componentWillUnmount = function componentWillUnmount() {
    if (typeof this.unlisten === 'function') {
      this.unlisten();
    }

    ROUTERS.splice(ROUTERS.indexOf(this), 1);
  };

  Router.prototype.componentWillUpdate = function componentWillUpdate() {
    this.updating = true;
  };

  Router.prototype.componentDidUpdate = function componentDidUpdate() {
    this.updating = false;
  };

  Router.prototype.getMatchingChildren = function getMatchingChildren(children, url, invoke) {
    return children.filter(prepareVNodeForRanking).sort(pathRankSort).map(function (vnode) {
      var matches = exec(url, vnode.props.path, vnode.props);

      if (matches) {
        if (invoke !== false) {
          var newProps = {
            url: url,
            matches: matches
          };
          assign(newProps, matches);
          delete newProps.ref;
          delete newProps.key;
          return L(vnode, newProps);
        }

        return vnode;
      }
    }).filter(Boolean);
  };

  Router.prototype.render = function render(ref, ref$1) {
    var children = ref.children;
    var onChange = ref.onChange;
    var url = ref$1.url;
    var active = this.getMatchingChildren(x(children), url, true);
    var current = active[0] || null;
    var previous = this.previousUrl;

    if (url !== previous) {
      this.previousUrl = url;

      if (typeof onChange === 'function') {
        onChange({
          router: this,
          url: url,
          previous: previous,
          active: active,
          current: current
        });
      }
    }

    return current;
  };

  return Router;
}(m);

var Link$1 = function (props) {
  return h('a', assign({
    onClick: handleLinkClick
  }, props));
};

var Route$1 = function (props) {
  return h(props.component, props);
};

Router.subscribers = subscribers;
Router.getCurrentUrl = getCurrentUrl;
Router.route = route;
Router.Router = Router;
Router.Route = Route$1;
Router.Link = Link$1;
Router.exec = exec;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = exports.Match = undefined;

var _extends$1 = Object.assign || function (target) {
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

var _preact = require('preact');

var _preactRouter = require('preact-router');

function _objectWithoutProperties(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Match = exports.Match = function (_Component) {
  _inherits(Match, _Component);

  function Match() {
    var _temp, _this, _ret;

    _classCallCheck(this, Match);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.update = function (url) {
      _this.nextUrl = url;

      _this.setState({});
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Match.prototype.componentDidMount = function componentDidMount() {
    _preactRouter.subscribers.push(this.update);
  };

  Match.prototype.componentWillUnmount = function componentWillUnmount() {
    _preactRouter.subscribers.splice(_preactRouter.subscribers.indexOf(this.update) >>> 0, 1);
  };

  Match.prototype.render = function render(props) {
    var url = this.nextUrl || (0, _preactRouter.getCurrentUrl)(),
        path = url.replace(/\?.+$/, '');
    this.nextUrl = null;
    return props.children({
      url: url,
      path: path,
      matches: (0, _preactRouter.exec)(path, props.path, {}) !== false
    });
  };

  return Match;
}(_preact.Component);

var Link$2 = function Link(_ref) {
  var activeClassName = _ref.activeClassName,
      path = _ref.path,
      props = _objectWithoutProperties(_ref, ['activeClassName', 'path']);

  return (0, _preact.h)(Match, {
    path: path || props.href
  }, function (_ref2) {
    var matches = _ref2.matches;
    return (0, _preact.h)(_preactRouter.Link, _extends$1({}, props, {
      'class': [props.class || props.className, matches && activeClassName].filter(Boolean).join(' ')
    }));
  });
};

exports.Link = Link$2;
exports.default = Match;
Match.Link = Link$2;

// import Login from './auth/Login';
// import Signup from './auth/Signup';
// import ForgotPassword from './auth/ForgotPassword';
// import ChangePassword from './auth/ChangePassword';

const Login = L$1(() => import('./Login-c2f963e4.js'));
const ChangePassword = L$1(() => import('./ChangePassword-59754b63.js'));
const ForgotPassword = L$1(() => import('./ForgotPassword-d0ef2587.js'));
const Signup = L$1(() => import('./Signup-00f4d739.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMjAzY2I2ZjguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvY29tcGF0L2Rpc3QvY29tcGF0Lm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9odG0vZGlzdC9odG0ubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2h0bS9wcmVhY3QvaW5kZXgubW9kdWxlLmpzIiwiLi4vYXBwLWNvbnRleHQuanMiLCIuLi9hdXRoL2F1dGhSZWR1Y2VyLmpzIiwiLi4vYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi9ub2RlX21vZHVsZXMvcHJlYWN0LXJvdXRlci9kaXN0L3ByZWFjdC1yb3V0ZXIuZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvcHJlYWN0LXJvdXRlci9tYXRjaC5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e3VzZVN0YXRlIGFzIG4sdXNlUmVkdWNlciBhcyB0LHVzZUVmZmVjdCBhcyBlLHVzZUxheW91dEVmZmVjdCBhcyByLHVzZVJlZiBhcyBvLHVzZUltcGVyYXRpdmVIYW5kbGUgYXMgdSx1c2VNZW1vIGFzIGksdXNlQ2FsbGJhY2sgYXMgZix1c2VDb250ZXh0IGFzIGMsdXNlRGVidWdWYWx1ZSBhcyBhfWZyb21cInByZWFjdC9ob29rc1wiO2V4cG9ydCpmcm9tXCJwcmVhY3QvaG9va3NcIjtpbXBvcnR7Q29tcG9uZW50IGFzIGwsY3JlYXRlRWxlbWVudCBhcyBzLG9wdGlvbnMgYXMgdix0b0NoaWxkQXJyYXkgYXMgaCxoeWRyYXRlIGFzIHAscmVuZGVyIGFzIGQsX3VubW91bnQgYXMgbSxjbG9uZUVsZW1lbnQgYXMgeSxjcmVhdGVSZWYgYXMgYixjcmVhdGVDb250ZXh0IGFzIGcsRnJhZ21lbnQgYXMgeH1mcm9tXCJwcmVhY3RcIjtleHBvcnR7Y3JlYXRlRWxlbWVudCxjcmVhdGVDb250ZXh0LGNyZWF0ZVJlZixGcmFnbWVudCxDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7ZnVuY3Rpb24gRShuLHQpe2Zvcih2YXIgZSBpbiB0KW5bZV09dFtlXTtyZXR1cm4gbn1mdW5jdGlvbiB3KG4sdCl7Zm9yKHZhciBlIGluIG4paWYoXCJfX3NvdXJjZVwiIT09ZSYmIShlIGluIHQpKXJldHVybiEwO2Zvcih2YXIgciBpbiB0KWlmKFwiX19zb3VyY2VcIiE9PXImJm5bcl0hPT10W3JdKXJldHVybiEwO3JldHVybiExfXZhciBDPWZ1bmN0aW9uKG4pe3ZhciB0LGU7ZnVuY3Rpb24gcih0KXt2YXIgZTtyZXR1cm4oZT1uLmNhbGwodGhpcyx0KXx8dGhpcykuaXNQdXJlUmVhY3RDb21wb25lbnQ9ITAsZX1yZXR1cm4gZT1uLCh0PXIpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuX19wcm90b19fPWUsci5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHcodGhpcy5wcm9wcyxuKXx8dyh0aGlzLnN0YXRlLHQpfSxyfShsKTtmdW5jdGlvbiBfKG4sdCl7ZnVuY3Rpb24gZShuKXt2YXIgZT10aGlzLnByb3BzLnJlZixyPWU9PW4ucmVmO3JldHVybiFyJiZlJiYoZS5jYWxsP2UobnVsbCk6ZS5jdXJyZW50PW51bGwpLHQ/IXQodGhpcy5wcm9wcyxuKXx8IXI6dyh0aGlzLnByb3BzLG4pfWZ1bmN0aW9uIHIodCl7cmV0dXJuIHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWUscyhuLEUoe30sdCkpfXJldHVybiByLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PSEwLHIuZGlzcGxheU5hbWU9XCJNZW1vKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHIudD0hMCxyfXZhciBBPXYuX19iO2Z1bmN0aW9uIFMobil7ZnVuY3Rpb24gdCh0KXt2YXIgZT1FKHt9LHQpO3JldHVybiBkZWxldGUgZS5yZWYsbihlLHQucmVmKX1yZXR1cm4gdC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD10LnQ9ITAsdC5kaXNwbGF5TmFtZT1cIkZvcndhcmRSZWYoXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsdH12Ll9fYj1mdW5jdGlvbihuKXtuLnR5cGUmJm4udHlwZS50JiZuLnJlZiYmKG4ucHJvcHMucmVmPW4ucmVmLG4ucmVmPW51bGwpLEEmJkEobil9O3ZhciBrPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/aChuKS5yZWR1Y2UoZnVuY3Rpb24obixlLHIpe3JldHVybiBuLmNvbmNhdCh0KGUscikpfSxbXSk6bnVsbH0sUj17bWFwOmssZm9yRWFjaDprLGNvdW50OmZ1bmN0aW9uKG4pe3JldHVybiBuP2gobikubGVuZ3RoOjB9LG9ubHk6ZnVuY3Rpb24obil7aWYoMSE9PShuPWgobikpLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZHJlbi5vbmx5KCkgZXhwZWN0cyBvbmx5IG9uZSBjaGlsZC5cIik7cmV0dXJuIG5bMF19LHRvQXJyYXk6aH0sRj12Ll9fZTtmdW5jdGlvbiBOKG4pe3JldHVybiBuJiYoKG49RSh7fSxuKSkuX19jPW51bGwsbi5fX2s9bi5fX2smJm4uX19rLm1hcChOKSksbn1mdW5jdGlvbiBVKCl7dGhpcy5fX3U9MCx0aGlzLm89bnVsbCx0aGlzLl9fYj1udWxsfWZ1bmN0aW9uIE0obil7dmFyIHQ9bi5fXy5fX2M7cmV0dXJuIHQmJnQudSYmdC51KG4pfWZ1bmN0aW9uIEwobil7dmFyIHQsZSxyO2Z1bmN0aW9uIG8obyl7aWYodHx8KHQ9bigpKS50aGVuKGZ1bmN0aW9uKG4pe2U9bi5kZWZhdWx0fHxufSxmdW5jdGlvbihuKXtyPW59KSxyKXRocm93IHI7aWYoIWUpdGhyb3cgdDtyZXR1cm4gcyhlLG8pfXJldHVybiBvLmRpc3BsYXlOYW1lPVwiTGF6eVwiLG8udD0hMCxvfWZ1bmN0aW9uIE8oKXt0aGlzLmk9bnVsbCx0aGlzLmw9bnVsbH12Ll9fZT1mdW5jdGlvbihuLHQsZSl7aWYobi50aGVuKWZvcih2YXIgcixvPXQ7bz1vLl9fOylpZigocj1vLl9fYykmJnIuX19jKXJldHVybiByLl9fYyhuLHQuX19jKTtGKG4sdCxlKX0sKFUucHJvdG90eXBlPW5ldyBsKS5fX2M9ZnVuY3Rpb24obix0KXt2YXIgZT10aGlzO251bGw9PWUubyYmKGUubz1bXSksZS5vLnB1c2godCk7dmFyIHI9TShlLl9fdiksbz0hMSx1PWZ1bmN0aW9uKCl7b3x8KG89ITAscj9yKGkpOmkoKSl9O3QuX19jPXQuY29tcG9uZW50V2lsbFVubW91bnQsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3UoKSx0Ll9fYyYmdC5fX2MoKX07dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbjtpZighLS1lLl9fdSlmb3IoZS5fX3YuX19rWzBdPWUuc3RhdGUudSxlLnNldFN0YXRlKHt1OmUuX19iPW51bGx9KTtuPWUuby5wb3AoKTspbi5mb3JjZVVwZGF0ZSgpfTtlLl9fdSsrfHxlLnNldFN0YXRlKHt1OmUuX19iPWUuX192Ll9fa1swXX0pLG4udGhlbih1LHUpfSxVLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obix0KXtyZXR1cm4gdGhpcy5fX2ImJih0aGlzLl9fdi5fX2tbMF09Tih0aGlzLl9fYiksdGhpcy5fX2I9bnVsbCksW3MobCxudWxsLHQudT9udWxsOm4uY2hpbGRyZW4pLHQudSYmbi5mYWxsYmFja119O3ZhciBQPWZ1bmN0aW9uKG4sdCxlKXtpZigrK2VbMV09PT1lWzBdJiZuLmwuZGVsZXRlKHQpLG4ucHJvcHMucmV2ZWFsT3JkZXImJihcInRcIiE9PW4ucHJvcHMucmV2ZWFsT3JkZXJbMF18fCFuLmwuc2l6ZSkpZm9yKGU9bi5pO2U7KXtmb3IoO2UubGVuZ3RoPjM7KWUucG9wKCkoKTtpZihlWzFdPGVbMF0pYnJlYWs7bi5pPWU9ZVsyXX19OyhPLnByb3RvdHlwZT1uZXcgbCkudT1mdW5jdGlvbihuKXt2YXIgdD10aGlzLGU9TSh0Ll9fdikscj10LmwuZ2V0KG4pO3JldHVybiByWzBdKyssZnVuY3Rpb24obyl7dmFyIHU9ZnVuY3Rpb24oKXt0LnByb3BzLnJldmVhbE9yZGVyPyhyLnB1c2gobyksUCh0LG4scikpOm8oKX07ZT9lKHUpOnUoKX19LE8ucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuKXt0aGlzLmk9bnVsbCx0aGlzLmw9bmV3IE1hcDt2YXIgdD1oKG4uY2hpbGRyZW4pO24ucmV2ZWFsT3JkZXImJlwiYlwiPT09bi5yZXZlYWxPcmRlclswXSYmdC5yZXZlcnNlKCk7Zm9yKHZhciBlPXQubGVuZ3RoO2UtLTspdGhpcy5sLnNldCh0W2VdLHRoaXMuaT1bMSwwLHRoaXMuaV0pO3JldHVybiBuLmNoaWxkcmVufSxPLnByb3RvdHlwZS5jb21wb25lbnREaWRVcGRhdGU9Ty5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQ9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO24ubC5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7UChuLGUsdCl9KX07dmFyIFc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7fXZhciB0PW4ucHJvdG90eXBlO3JldHVybiB0LmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnByb3BzLmNvbnRleHR9LHQucmVuZGVyPWZ1bmN0aW9uKG4pe3JldHVybiBuLmNoaWxkcmVufSxufSgpO2Z1bmN0aW9uIGoobil7dmFyIHQ9dGhpcyxlPW4uY29udGFpbmVyLHI9cyhXLHtjb250ZXh0OnQuY29udGV4dH0sbi52bm9kZSk7cmV0dXJuIHQucyYmdC5zIT09ZSYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCksdC5wPSExKSxuLnZub2RlP3QucD8oZS5fX2s9dC5fX2ssZChyLGUpLHQuX19rPWUuX19rKToodC52PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpLHAoXCJcIixlKSxlLmFwcGVuZENoaWxkKHQudiksdC5wPSEwLHQucz1lLGQocixlLHQudiksdC5fX2s9dC52Ll9fayk6dC5wJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSksdC5oPXIsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Qudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCl9LG51bGx9ZnVuY3Rpb24geihuLHQpe3JldHVybiBzKGose3Zub2RlOm4sY29udGFpbmVyOnR9KX12YXIgRD0vXig/OmFjY2VudHxhbGlnbm1lbnR8YXJhYmljfGJhc2VsaW5lfGNhcHxjbGlwKD8hUGF0aFUpfGNvbG9yfGZpbGx8Zmxvb2R8Zm9udHxnbHlwaCg/IVIpfGhvcml6fG1hcmtlcig/IUh8V3xVKXxvdmVybGluZXxwYWludHxzdG9wfHN0cmlrZXRocm91Z2h8c3Ryb2tlfHRleHQoPyFMKXx1bmRlcmxpbmV8dW5pY29kZXx1bml0c3x2fHZlY3Rvcnx2ZXJ0fHdvcmR8d3JpdGluZ3x4KD8hQykpW0EtWl0vO2wucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9e307dmFyIEg9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvciYmU3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIil8fDYwMTAzO2Z1bmN0aW9uIFQobix0LGUpe2lmKG51bGw9PXQuX19rKWZvcig7dC5maXJzdENoaWxkOyl0LnJlbW92ZUNoaWxkKHQuZmlyc3RDaGlsZCk7cmV0dXJuIGQobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfWZ1bmN0aW9uIFYobix0LGUpe3JldHVybiBwKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH12YXIgWj12LmV2ZW50O2Z1bmN0aW9uIEkobix0KXtuW1wiVU5TQUZFX1wiK3RdJiYhblt0XSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sdCx7Y29uZmlndXJhYmxlOiExLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzW1wiVU5TQUZFX1wiK3RdfSxzZXQ6ZnVuY3Rpb24obil7dGhpc1tcIlVOU0FGRV9cIit0XT1ufX0pfXYuZXZlbnQ9ZnVuY3Rpb24obil7WiYmKG49WihuKSksbi5wZXJzaXN0PWZ1bmN0aW9uKCl7fTt2YXIgdD0hMSxlPSExLHI9bi5zdG9wUHJvcGFnYXRpb247bi5zdG9wUHJvcGFnYXRpb249ZnVuY3Rpb24oKXtyLmNhbGwobiksdD0hMH07dmFyIG89bi5wcmV2ZW50RGVmYXVsdDtyZXR1cm4gbi5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe28uY2FsbChuKSxlPSEwfSxuLmlzUHJvcGFnYXRpb25TdG9wcGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LG4uaXNEZWZhdWx0UHJldmVudGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGV9LG4ubmF0aXZlRXZlbnQ9bn07dmFyICQ9e2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGFzc319LHE9di52bm9kZTt2LnZub2RlPWZ1bmN0aW9uKG4pe24uJCR0eXBlb2Y9SDt2YXIgdD1uLnR5cGUsZT1uLnByb3BzO2lmKHQpe2lmKGUuY2xhc3MhPWUuY2xhc3NOYW1lJiYoJC5lbnVtZXJhYmxlPVwiY2xhc3NOYW1lXCJpbiBlLG51bGwhPWUuY2xhc3NOYW1lJiYoZS5jbGFzcz1lLmNsYXNzTmFtZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJjbGFzc05hbWVcIiwkKSksXCJmdW5jdGlvblwiIT10eXBlb2YgdCl7dmFyIHIsbyx1O2Zvcih1IGluIGUuZGVmYXVsdFZhbHVlJiZ2b2lkIDAhPT1lLnZhbHVlJiYoZS52YWx1ZXx8MD09PWUudmFsdWV8fChlLnZhbHVlPWUuZGVmYXVsdFZhbHVlKSxkZWxldGUgZS5kZWZhdWx0VmFsdWUpLEFycmF5LmlzQXJyYXkoZS52YWx1ZSkmJmUubXVsdGlwbGUmJlwic2VsZWN0XCI9PT10JiYoaChlLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uKG4pey0xIT1lLnZhbHVlLmluZGV4T2Yobi5wcm9wcy52YWx1ZSkmJihuLnByb3BzLnNlbGVjdGVkPSEwKX0pLGRlbGV0ZSBlLnZhbHVlKSxlKWlmKHI9RC50ZXN0KHUpKWJyZWFrO2lmKHIpZm9yKHUgaW4gbz1uLnByb3BzPXt9LGUpb1tELnRlc3QodSk/dS5yZXBsYWNlKC9bQS1aMC05XS8sXCItJCZcIikudG9Mb3dlckNhc2UoKTp1XT1lW3VdfSFmdW5jdGlvbih0KXt2YXIgZT1uLnR5cGUscj1uLnByb3BzO2lmKHImJlwic3RyaW5nXCI9PXR5cGVvZiBlKXt2YXIgbz17fTtmb3IodmFyIHUgaW4gcikvXm9uKEFuaXxUcmF8VG91KS8udGVzdCh1KSYmKHJbdS50b0xvd2VyQ2FzZSgpXT1yW3VdLGRlbGV0ZSByW3VdKSxvW3UudG9Mb3dlckNhc2UoKV09dTtpZihvLm9uZG91YmxlY2xpY2smJihyLm9uZGJsY2xpY2s9cltvLm9uZG91YmxlY2xpY2tdLGRlbGV0ZSByW28ub25kb3VibGVjbGlja10pLG8ub25iZWZvcmVpbnB1dCYmKHIub25iZWZvcmVpbnB1dD1yW28ub25iZWZvcmVpbnB1dF0sZGVsZXRlIHJbby5vbmJlZm9yZWlucHV0XSksby5vbmNoYW5nZSYmKFwidGV4dGFyZWFcIj09PWV8fFwiaW5wdXRcIj09PWUudG9Mb3dlckNhc2UoKSYmIS9eZmlsfGNoZXxyYS9pLnRlc3Qoci50eXBlKSkpe3ZhciBpPW8ub25pbnB1dHx8XCJvbmlucHV0XCI7cltpXXx8KHJbaV09cltvLm9uY2hhbmdlXSxkZWxldGUgcltvLm9uY2hhbmdlXSl9fX0oKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYhdC5tJiZ0LnByb3RvdHlwZSYmKEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsTW91bnRcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHNcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxVcGRhdGVcIiksdC5tPSEwKX1xJiZxKG4pfTt2YXIgQj1cIjE2LjguMFwiO2Z1bmN0aW9uIEcobil7cmV0dXJuIHMuYmluZChudWxsLG4pfWZ1bmN0aW9uIEoobil7cmV0dXJuISFuJiZuLiQkdHlwZW9mPT09SH1mdW5jdGlvbiBLKG4pe3JldHVybiBKKG4pP3kuYXBwbHkobnVsbCxhcmd1bWVudHMpOm59ZnVuY3Rpb24gUShuKXtyZXR1cm4hIW4uX19rJiYoZChudWxsLG4pLCEwKX1mdW5jdGlvbiBYKG4pe3JldHVybiBuJiYobi5iYXNlfHwxPT09bi5ub2RlVHlwZSYmbil8fG51bGx9dmFyIFk9ZnVuY3Rpb24obix0KXtyZXR1cm4gbih0KX07ZXhwb3J0IGRlZmF1bHR7dXNlU3RhdGU6bix1c2VSZWR1Y2VyOnQsdXNlRWZmZWN0OmUsdXNlTGF5b3V0RWZmZWN0OnIsdXNlUmVmOm8sdXNlSW1wZXJhdGl2ZUhhbmRsZTp1LHVzZU1lbW86aSx1c2VDYWxsYmFjazpmLHVzZUNvbnRleHQ6Yyx1c2VEZWJ1Z1ZhbHVlOmEsdmVyc2lvbjpcIjE2LjguMFwiLENoaWxkcmVuOlIscmVuZGVyOlQsaHlkcmF0ZTpULHVubW91bnRDb21wb25lbnRBdE5vZGU6USxjcmVhdGVQb3J0YWw6eixjcmVhdGVFbGVtZW50OnMsY3JlYXRlQ29udGV4dDpnLGNyZWF0ZUZhY3Rvcnk6RyxjbG9uZUVsZW1lbnQ6SyxjcmVhdGVSZWY6YixGcmFnbWVudDp4LGlzVmFsaWRFbGVtZW50OkosZmluZERPTU5vZGU6WCxDb21wb25lbnQ6bCxQdXJlQ29tcG9uZW50OkMsbWVtbzpfLGZvcndhcmRSZWY6Uyx1bnN0YWJsZV9iYXRjaGVkVXBkYXRlczpZLFN1c3BlbnNlOlUsU3VzcGVuc2VMaXN0Ok8sbGF6eTpMfTtleHBvcnR7QiBhcyB2ZXJzaW9uLFIgYXMgQ2hpbGRyZW4sVCBhcyByZW5kZXIsViBhcyBoeWRyYXRlLFEgYXMgdW5tb3VudENvbXBvbmVudEF0Tm9kZSx6IGFzIGNyZWF0ZVBvcnRhbCxHIGFzIGNyZWF0ZUZhY3RvcnksSyBhcyBjbG9uZUVsZW1lbnQsSiBhcyBpc1ZhbGlkRWxlbWVudCxYIGFzIGZpbmRET01Ob2RlLEMgYXMgUHVyZUNvbXBvbmVudCxfIGFzIG1lbW8sUyBhcyBmb3J3YXJkUmVmLFkgYXMgdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMsVSBhcyBTdXNwZW5zZSxPIGFzIFN1c3BlbnNlTGlzdCxMIGFzIGxhenl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGF0Lm1vZHVsZS5qcy5tYXBcbiIsInZhciBuPWZ1bmN0aW9uKHQscyxyLGUpe3ZhciB1O3NbMF09MDtmb3IodmFyIGg9MTtoPHMubGVuZ3RoO2grKyl7dmFyIHA9c1toKytdLGE9c1toXT8oc1swXXw9cD8xOjIscltzW2grK11dKTpzWysraF07Mz09PXA/ZVswXT1hOjQ9PT1wP2VbMV09T2JqZWN0LmFzc2lnbihlWzFdfHx7fSxhKTo1PT09cD8oZVsxXT1lWzFdfHx7fSlbc1srK2hdXT1hOjY9PT1wP2VbMV1bc1srK2hdXSs9YStcIlwiOnA/KHU9dC5hcHBseShhLG4odCxhLHIsW1wiXCIsbnVsbF0pKSxlLnB1c2godSksYVswXT9zWzBdfD0yOihzW2gtMl09MCxzW2hdPXUpKTplLnB1c2goYSl9cmV0dXJuIGV9LHQ9bmV3IE1hcDtleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzKXt2YXIgcj10LmdldCh0aGlzKTtyZXR1cm4gcnx8KHI9bmV3IE1hcCx0LnNldCh0aGlzLHIpKSwocj1uKHRoaXMsci5nZXQocyl8fChyLnNldChzLHI9ZnVuY3Rpb24obil7Zm9yKHZhciB0LHMscj0xLGU9XCJcIix1PVwiXCIsaD1bMF0scD1mdW5jdGlvbihuKXsxPT09ciYmKG58fChlPWUucmVwbGFjZSgvXlxccypcXG5cXHMqfFxccypcXG5cXHMqJC9nLFwiXCIpKSk/aC5wdXNoKDAsbixlKTozPT09ciYmKG58fGUpPyhoLnB1c2goMyxuLGUpLHI9Mik6Mj09PXImJlwiLi4uXCI9PT1lJiZuP2gucHVzaCg0LG4sMCk6Mj09PXImJmUmJiFuP2gucHVzaCg1LDAsITAsZSk6cj49NSYmKChlfHwhbiYmNT09PXIpJiYoaC5wdXNoKHIsMCxlLHMpLHI9NiksbiYmKGgucHVzaChyLG4sMCxzKSxyPTYpKSxlPVwiXCJ9LGE9MDthPG4ubGVuZ3RoO2ErKyl7YSYmKDE9PT1yJiZwKCkscChhKSk7Zm9yKHZhciBsPTA7bDxuW2FdLmxlbmd0aDtsKyspdD1uW2FdW2xdLDE9PT1yP1wiPFwiPT09dD8ocCgpLGg9W2hdLHI9Myk6ZSs9dDo0PT09cj9cIi0tXCI9PT1lJiZcIj5cIj09PXQ/KHI9MSxlPVwiXCIpOmU9dCtlWzBdOnU/dD09PXU/dT1cIlwiOmUrPXQ6J1wiJz09PXR8fFwiJ1wiPT09dD91PXQ6XCI+XCI9PT10PyhwKCkscj0xKTpyJiYoXCI9XCI9PT10PyhyPTUscz1lLGU9XCJcIik6XCIvXCI9PT10JiYocjw1fHxcIj5cIj09PW5bYV1bbCsxXSk/KHAoKSwzPT09ciYmKGg9aFswXSkscj1oLChoPWhbMF0pLnB1c2goMiwwLHIpLHI9MCk6XCIgXCI9PT10fHxcIlxcdFwiPT09dHx8XCJcXG5cIj09PXR8fFwiXFxyXCI9PT10PyhwKCkscj0yKTplKz10KSwzPT09ciYmXCIhLS1cIj09PWUmJihyPTQsaD1oWzBdKX1yZXR1cm4gcCgpLGh9KHMpKSxyKSxhcmd1bWVudHMsW10pKS5sZW5ndGg+MT9yOnJbMF19XG4iLCJpbXBvcnR7aCBhcyByLENvbXBvbmVudCBhcyBvLHJlbmRlciBhcyB0fWZyb21cInByZWFjdFwiO2V4cG9ydHtoLHJlbmRlcixDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7aW1wb3J0IGUgZnJvbVwiaHRtXCI7dmFyIG09ZS5iaW5kKHIpO2V4cG9ydHttIGFzIGh0bWx9O1xuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5cbmNvbnN0IEFwcENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5cbmZ1bmN0aW9uIGNvdW50UmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdJTkNSRU1FTlQnOlxuICAgICAgcmV0dXJuIHsgY291bnQ6IHN0YXRlLmNvdW50ICsgMSB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGFjdGlvbiB0eXBlJHthY3Rpb24udHlwZX1gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1c2VBcHBDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XG4gIH1cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xuICBjb25zdCBpbmNyZW1lbnQgPSAoKSA9PiBkaXNwYXRjaCh7IHR5cGU6ICdJTkNSRU1FTlQnIH0pO1xuICByZXR1cm4geyBzdGF0ZSwgZGlzcGF0Y2gsIGluY3JlbWVudCB9O1xufVxuXG5mdW5jdGlvbiBBcHBQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoY291bnRSZWR1Y2VyLCB7IGNvdW50OiAwIH0pO1xuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEFwcENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuZXhwb3J0IHsgQXBwUHJvdmlkZXIsIHVzZUFwcENvbnRleHQgfTtcbiIsImV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGVtYWlsOiAnJyxcbiAgcGFzc3dvcmQ6ICcnLFxuICBzdWNjZXNzOiBmYWxzZSxcbiAgZXJyb3I6IG51bGwsXG4gIHVzZXJuYW1lOiAnJyxcbiAgbG9hZGluZzogZmFsc2UsXG4gIGNvbmZpcm06ICcnLFxuICBjdXJyZW50OiAnJyxcbiAgZW1haWxvcnVzZXJuYW1lOiAnJyxcbiAgdG9rZW46IG51bGwsXG4gIGlzTG9nZ2VkSW46IGZhbHNlLFxuICBpc1Bhc3N3b3JkQ2hhbmdlZDogZmFsc2UsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0aFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIFthY3Rpb24ucGF5bG9hZC5wcm9wTmFtZV06IGFjdGlvbi5wYXlsb2FkLnZhbHVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lLCAnLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUnLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGlzUGFzc3dvcmRDaGFuZ2VkOiB0cnVlLFxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1Bhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBzdWNjZXNzOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkw6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vYXV0aFJlZHVjZXInO1xuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5cbmZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcbiAgfVxuXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcblxuXG4gIHJldHVybiB7XG4gICAgc3RhdGUsXG4gICAgZGlzcGF0Y2gsXG4gIH07XG59XG5cbmZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSk7XG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuXG5leHBvcnQgeyB1c2VBdXRoQ29udGV4dCwgQXV0aFByb3ZpZGVyIH07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIGNsb25lRWxlbWVudCwgY3JlYXRlRWxlbWVudCwgdG9DaGlsZEFycmF5IH0gZnJvbSAncHJlYWN0JztcblxudmFyIEVNUFRZJDEgPSB7fTtcblxuZnVuY3Rpb24gYXNzaWduKG9iaiwgcHJvcHMpIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGd1YXJkLWZvci1pblxuXHRmb3IgKHZhciBpIGluIHByb3BzKSB7XG5cdFx0b2JqW2ldID0gcHJvcHNbaV07XG5cdH1cblx0cmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gZXhlYyh1cmwsIHJvdXRlLCBvcHRzKSB7XG5cdHZhciByZWcgPSAvKD86XFw/KFteI10qKSk/KCMuKik/JC8sXG5cdFx0YyA9IHVybC5tYXRjaChyZWcpLFxuXHRcdG1hdGNoZXMgPSB7fSxcblx0XHRyZXQ7XG5cdGlmIChjICYmIGNbMV0pIHtcblx0XHR2YXIgcCA9IGNbMV0uc3BsaXQoJyYnKTtcblx0XHRmb3IgKHZhciBpPTA7IGk8cC5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHIgPSBwW2ldLnNwbGl0KCc9Jyk7XG5cdFx0XHRtYXRjaGVzW2RlY29kZVVSSUNvbXBvbmVudChyWzBdKV0gPSBkZWNvZGVVUklDb21wb25lbnQoci5zbGljZSgxKS5qb2luKCc9JykpO1xuXHRcdH1cblx0fVxuXHR1cmwgPSBzZWdtZW50aXplKHVybC5yZXBsYWNlKHJlZywgJycpKTtcblx0cm91dGUgPSBzZWdtZW50aXplKHJvdXRlIHx8ICcnKTtcblx0dmFyIG1heCA9IE1hdGgubWF4KHVybC5sZW5ndGgsIHJvdXRlLmxlbmd0aCk7XG5cdGZvciAodmFyIGkkMT0wOyBpJDE8bWF4OyBpJDErKykge1xuXHRcdGlmIChyb3V0ZVtpJDFdICYmIHJvdXRlW2kkMV0uY2hhckF0KDApPT09JzonKSB7XG5cdFx0XHR2YXIgcGFyYW0gPSByb3V0ZVtpJDFdLnJlcGxhY2UoLyheOnxbKyo/XSskKS9nLCAnJyksXG5cdFx0XHRcdGZsYWdzID0gKHJvdXRlW2kkMV0ubWF0Y2goL1srKj9dKyQvKSB8fCBFTVBUWSQxKVswXSB8fCAnJyxcblx0XHRcdFx0cGx1cyA9IH5mbGFncy5pbmRleE9mKCcrJyksXG5cdFx0XHRcdHN0YXIgPSB+ZmxhZ3MuaW5kZXhPZignKicpLFxuXHRcdFx0XHR2YWwgPSB1cmxbaSQxXSB8fCAnJztcblx0XHRcdGlmICghdmFsICYmICFzdGFyICYmIChmbGFncy5pbmRleE9mKCc/Jyk8MCB8fCBwbHVzKSkge1xuXHRcdFx0XHRyZXQgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRtYXRjaGVzW3BhcmFtXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWwpO1xuXHRcdFx0aWYgKHBsdXMgfHwgc3Rhcikge1xuXHRcdFx0XHRtYXRjaGVzW3BhcmFtXSA9IHVybC5zbGljZShpJDEpLm1hcChkZWNvZGVVUklDb21wb25lbnQpLmpvaW4oJy8nKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHJvdXRlW2kkMV0hPT11cmxbaSQxXSkge1xuXHRcdFx0cmV0ID0gZmFsc2U7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0aWYgKG9wdHMuZGVmYXVsdCE9PXRydWUgJiYgcmV0PT09ZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdHJldHVybiBtYXRjaGVzO1xufVxuXG5mdW5jdGlvbiBwYXRoUmFua1NvcnQoYSwgYikge1xuXHRyZXR1cm4gKFxuXHRcdChhLnJhbmsgPCBiLnJhbmspID8gMSA6XG5cdFx0XHQoYS5yYW5rID4gYi5yYW5rKSA/IC0xIDpcblx0XHRcdFx0KGEuaW5kZXggLSBiLmluZGV4KVxuXHQpO1xufVxuXG4vLyBmaWx0ZXIgb3V0IFZOb2RlcyB3aXRob3V0IGF0dHJpYnV0ZXMgKHdoaWNoIGFyZSB1bnJhbmtlYWJsZSksIGFuZCBhZGQgYGluZGV4YC9gcmFua2AgcHJvcGVydGllcyB0byBiZSB1c2VkIGluIHNvcnRpbmcuXG5mdW5jdGlvbiBwcmVwYXJlVk5vZGVGb3JSYW5raW5nKHZub2RlLCBpbmRleCkge1xuXHR2bm9kZS5pbmRleCA9IGluZGV4O1xuXHR2bm9kZS5yYW5rID0gcmFua0NoaWxkKHZub2RlKTtcblx0cmV0dXJuIHZub2RlLnByb3BzO1xufVxuXG5mdW5jdGlvbiBzZWdtZW50aXplKHVybCkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoLyheXFwvK3xcXC8rJCkvZywgJycpLnNwbGl0KCcvJyk7XG59XG5cbmZ1bmN0aW9uIHJhbmtTZWdtZW50KHNlZ21lbnQpIHtcblx0cmV0dXJuIHNlZ21lbnQuY2hhckF0KDApPT0nOicgPyAoMSArICcqKz8nLmluZGV4T2Yoc2VnbWVudC5jaGFyQXQoc2VnbWVudC5sZW5ndGgtMSkpKSB8fCA0IDogNTtcbn1cblxuZnVuY3Rpb24gcmFuayhwYXRoKSB7XG5cdHJldHVybiBzZWdtZW50aXplKHBhdGgpLm1hcChyYW5rU2VnbWVudCkuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIHJhbmtDaGlsZCh2bm9kZSkge1xuXHRyZXR1cm4gdm5vZGUucHJvcHMuZGVmYXVsdCA/IDAgOiByYW5rKHZub2RlLnByb3BzLnBhdGgpO1xufVxuXG52YXIgY3VzdG9tSGlzdG9yeSA9IG51bGw7XG5cbnZhciBST1VURVJTID0gW107XG5cbnZhciBzdWJzY3JpYmVycyA9IFtdO1xuXG52YXIgRU1QVFkgPSB7fTtcblxuZnVuY3Rpb24gc2V0VXJsKHVybCwgdHlwZSkge1xuXHRpZiAoIHR5cGUgPT09IHZvaWQgMCApIHR5cGU9J3B1c2gnO1xuXG5cdGlmIChjdXN0b21IaXN0b3J5ICYmIGN1c3RvbUhpc3RvcnlbdHlwZV0pIHtcblx0XHRjdXN0b21IaXN0b3J5W3R5cGVdKHVybCk7XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIGhpc3RvcnkhPT0ndW5kZWZpbmVkJyAmJiBoaXN0b3J5W3R5cGUrJ1N0YXRlJ10pIHtcblx0XHRoaXN0b3J5W3R5cGUrJ1N0YXRlJ10obnVsbCwgbnVsbCwgdXJsKTtcblx0fVxufVxuXG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRVcmwoKSB7XG5cdHZhciB1cmw7XG5cdGlmIChjdXN0b21IaXN0b3J5ICYmIGN1c3RvbUhpc3RvcnkubG9jYXRpb24pIHtcblx0XHR1cmwgPSBjdXN0b21IaXN0b3J5LmxvY2F0aW9uO1xuXHR9XG5cdGVsc2UgaWYgKGN1c3RvbUhpc3RvcnkgJiYgY3VzdG9tSGlzdG9yeS5nZXRDdXJyZW50TG9jYXRpb24pIHtcblx0XHR1cmwgPSBjdXN0b21IaXN0b3J5LmdldEN1cnJlbnRMb2NhdGlvbigpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHVybCA9IHR5cGVvZiBsb2NhdGlvbiE9PSd1bmRlZmluZWQnID8gbG9jYXRpb24gOiBFTVBUWTtcblx0fVxuXHRyZXR1cm4gKFwiXCIgKyAodXJsLnBhdGhuYW1lIHx8ICcnKSArICh1cmwuc2VhcmNoIHx8ICcnKSk7XG59XG5cblxuXG5mdW5jdGlvbiByb3V0ZSh1cmwsIHJlcGxhY2UpIHtcblx0aWYgKCByZXBsYWNlID09PSB2b2lkIDAgKSByZXBsYWNlPWZhbHNlO1xuXG5cdGlmICh0eXBlb2YgdXJsIT09J3N0cmluZycgJiYgdXJsLnVybCkge1xuXHRcdHJlcGxhY2UgPSB1cmwucmVwbGFjZTtcblx0XHR1cmwgPSB1cmwudXJsO1xuXHR9XG5cblx0Ly8gb25seSBwdXNoIFVSTCBpbnRvIGhpc3RvcnkgaWYgd2UgY2FuIGhhbmRsZSBpdFxuXHRpZiAoY2FuUm91dGUodXJsKSkge1xuXHRcdHNldFVybCh1cmwsIHJlcGxhY2UgPyAncmVwbGFjZScgOiAncHVzaCcpO1xuXHR9XG5cblx0cmV0dXJuIHJvdXRlVG8odXJsKTtcbn1cblxuXG4vKiogQ2hlY2sgaWYgdGhlIGdpdmVuIFVSTCBjYW4gYmUgaGFuZGxlZCBieSBhbnkgcm91dGVyIGluc3RhbmNlcy4gKi9cbmZ1bmN0aW9uIGNhblJvdXRlKHVybCkge1xuXHRmb3IgKHZhciBpPVJPVVRFUlMubGVuZ3RoOyBpLS07ICkge1xuXHRcdGlmIChST1VURVJTW2ldLmNhblJvdXRlKHVybCkpIHsgcmV0dXJuIHRydWU7IH1cblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cblxuLyoqIFRlbGwgYWxsIHJvdXRlciBpbnN0YW5jZXMgdG8gaGFuZGxlIHRoZSBnaXZlbiBVUkwuICAqL1xuZnVuY3Rpb24gcm91dGVUbyh1cmwpIHtcblx0dmFyIGRpZFJvdXRlID0gZmFsc2U7XG5cdGZvciAodmFyIGk9MDsgaTxST1VURVJTLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKFJPVVRFUlNbaV0ucm91dGVUbyh1cmwpPT09dHJ1ZSkge1xuXHRcdFx0ZGlkUm91dGUgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHRmb3IgKHZhciBpJDE9c3Vic2NyaWJlcnMubGVuZ3RoOyBpJDEtLTsgKSB7XG5cdFx0c3Vic2NyaWJlcnNbaSQxXSh1cmwpO1xuXHR9XG5cdHJldHVybiBkaWRSb3V0ZTtcbn1cblxuXG5mdW5jdGlvbiByb3V0ZUZyb21MaW5rKG5vZGUpIHtcblx0Ly8gb25seSB2YWxpZCBlbGVtZW50c1xuXHRpZiAoIW5vZGUgfHwgIW5vZGUuZ2V0QXR0cmlidXRlKSB7IHJldHVybjsgfVxuXG5cdHZhciBocmVmID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcblx0XHR0YXJnZXQgPSBub2RlLmdldEF0dHJpYnV0ZSgndGFyZ2V0Jyk7XG5cblx0Ly8gaWdub3JlIGxpbmtzIHdpdGggdGFyZ2V0cyBhbmQgbm9uLXBhdGggVVJMc1xuXHRpZiAoIWhyZWYgfHwgIWhyZWYubWF0Y2goL15cXC8vZykgfHwgKHRhcmdldCAmJiAhdGFyZ2V0Lm1hdGNoKC9eXz9zZWxmJC9pKSkpIHsgcmV0dXJuOyB9XG5cblx0Ly8gYXR0ZW1wdCB0byByb3V0ZSwgaWYgbm8gbWF0Y2ggc2ltcGx5IGNlZGUgY29udHJvbCB0byBicm93c2VyXG5cdHJldHVybiByb3V0ZShocmVmKTtcbn1cblxuXG5mdW5jdGlvbiBoYW5kbGVMaW5rQ2xpY2soZSkge1xuXHRpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLmFsdEtleSB8fCBlLnNoaWZ0S2V5IHx8IGUuYnV0dG9uIT09MCkgeyByZXR1cm47IH1cblx0cm91dGVGcm9tTGluayhlLmN1cnJlbnRUYXJnZXQgfHwgZS50YXJnZXQgfHwgdGhpcyk7XG5cdHJldHVybiBwcmV2ZW50KGUpO1xufVxuXG5cbmZ1bmN0aW9uIHByZXZlbnQoZSkge1xuXHRpZiAoZSkge1xuXHRcdGlmIChlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikgeyBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpOyB9XG5cdFx0aWYgKGUuc3RvcFByb3BhZ2F0aW9uKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH1cblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5cbmZ1bmN0aW9uIGRlbGVnYXRlTGlua0hhbmRsZXIoZSkge1xuXHQvLyBpZ25vcmUgZXZlbnRzIHRoZSBicm93c2VyIHRha2VzIGNhcmUgb2YgYWxyZWFkeTpcblx0aWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5hbHRLZXkgfHwgZS5zaGlmdEtleSB8fCBlLmJ1dHRvbiE9PTApIHsgcmV0dXJuOyB9XG5cblx0dmFyIHQgPSBlLnRhcmdldDtcblx0ZG8ge1xuXHRcdGlmIChTdHJpbmcodC5ub2RlTmFtZSkudG9VcHBlckNhc2UoKT09PSdBJyAmJiB0LmdldEF0dHJpYnV0ZSgnaHJlZicpKSB7XG5cdFx0XHRpZiAodC5oYXNBdHRyaWJ1dGUoJ25hdGl2ZScpKSB7IHJldHVybjsgfVxuXHRcdFx0Ly8gaWYgbGluayBpcyBoYW5kbGVkIGJ5IHRoZSByb3V0ZXIsIHByZXZlbnQgYnJvd3NlciBkZWZhdWx0c1xuXHRcdFx0aWYgKHJvdXRlRnJvbUxpbmsodCkpIHtcblx0XHRcdFx0cmV0dXJuIHByZXZlbnQoZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IHdoaWxlICgodD10LnBhcmVudE5vZGUpKTtcbn1cblxuXG52YXIgZXZlbnRMaXN0ZW5lcnNJbml0aWFsaXplZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBpbml0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdGlmIChldmVudExpc3RlbmVyc0luaXRpYWxpemVkKSB7IHJldHVybjsgfVxuXG5cdGlmICh0eXBlb2YgYWRkRXZlbnRMaXN0ZW5lcj09PSdmdW5jdGlvbicpIHtcblx0XHRpZiAoIWN1c3RvbUhpc3RvcnkpIHtcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyb3V0ZVRvKGdldEN1cnJlbnRVcmwoKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxlZ2F0ZUxpbmtIYW5kbGVyKTtcblx0fVxuXHRldmVudExpc3RlbmVyc0luaXRpYWxpemVkID0gdHJ1ZTtcbn1cblxuXG52YXIgUm91dGVyID0gKGZ1bmN0aW9uIChDb21wb25lbnQkJDEpIHtcblx0ZnVuY3Rpb24gUm91dGVyKHByb3BzKSB7XG5cdFx0Q29tcG9uZW50JCQxLmNhbGwodGhpcywgcHJvcHMpO1xuXHRcdGlmIChwcm9wcy5oaXN0b3J5KSB7XG5cdFx0XHRjdXN0b21IaXN0b3J5ID0gcHJvcHMuaGlzdG9yeTtcblx0XHR9XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0dXJsOiBwcm9wcy51cmwgfHwgZ2V0Q3VycmVudFVybCgpXG5cdFx0fTtcblxuXHRcdGluaXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0aWYgKCBDb21wb25lbnQkJDEgKSBSb3V0ZXIuX19wcm90b19fID0gQ29tcG9uZW50JCQxO1xuXHRSb3V0ZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggQ29tcG9uZW50JCQxICYmIENvbXBvbmVudCQkMS5wcm90b3R5cGUgKTtcblx0Um91dGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJvdXRlcjtcblxuXHRSb3V0ZXIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZSA9IGZ1bmN0aW9uIHNob3VsZENvbXBvbmVudFVwZGF0ZSAocHJvcHMpIHtcblx0XHRpZiAocHJvcHMuc3RhdGljIT09dHJ1ZSkgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdHJldHVybiBwcm9wcy51cmwhPT10aGlzLnByb3BzLnVybCB8fCBwcm9wcy5vbkNoYW5nZSE9PXRoaXMucHJvcHMub25DaGFuZ2U7XG5cdH07XG5cblx0LyoqIENoZWNrIGlmIHRoZSBnaXZlbiBVUkwgY2FuIGJlIG1hdGNoZWQgYWdhaW5zdCBhbnkgY2hpbGRyZW4gKi9cblx0Um91dGVyLnByb3RvdHlwZS5jYW5Sb3V0ZSA9IGZ1bmN0aW9uIGNhblJvdXRlICh1cmwpIHtcblx0XHR2YXIgY2hpbGRyZW4gPSB0b0NoaWxkQXJyYXkodGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0TWF0Y2hpbmdDaGlsZHJlbihjaGlsZHJlbiwgdXJsLCBmYWxzZSkubGVuZ3RoID4gMDtcblx0fTtcblxuXHQvKiogUmUtcmVuZGVyIGNoaWxkcmVuIHdpdGggYSBuZXcgVVJMIHRvIG1hdGNoIGFnYWluc3QuICovXG5cdFJvdXRlci5wcm90b3R5cGUucm91dGVUbyA9IGZ1bmN0aW9uIHJvdXRlVG8gKHVybCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyB1cmw6IHVybCB9KTtcblxuXHRcdHZhciBkaWRSb3V0ZSA9IHRoaXMuY2FuUm91dGUodXJsKTtcblxuXHRcdC8vIHRyaWdnZXIgYSBtYW51YWwgcmUtcm91dGUgaWYgd2UncmUgbm90IGluIHRoZSBtaWRkbGUgb2YgYW4gdXBkYXRlOlxuXHRcdGlmICghdGhpcy51cGRhdGluZykgeyB0aGlzLmZvcmNlVXBkYXRlKCk7IH1cblxuXHRcdHJldHVybiBkaWRSb3V0ZTtcblx0fTtcblxuXHRSb3V0ZXIucHJvdG90eXBlLmNvbXBvbmVudFdpbGxNb3VudCA9IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG5cdFx0Uk9VVEVSUy5wdXNoKHRoaXMpO1xuXHRcdHRoaXMudXBkYXRpbmcgPSB0cnVlO1xuXHR9O1xuXG5cdFJvdXRlci5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdFx0dmFyIHRoaXMkMSA9IHRoaXM7XG5cblx0XHRpZiAoY3VzdG9tSGlzdG9yeSkge1xuXHRcdFx0dGhpcy51bmxpc3RlbiA9IGN1c3RvbUhpc3RvcnkubGlzdGVuKGZ1bmN0aW9uIChsb2NhdGlvbikge1xuXHRcdFx0XHR0aGlzJDEucm91dGVUbygoXCJcIiArIChsb2NhdGlvbi5wYXRobmFtZSB8fCAnJykgKyAobG9jYXRpb24uc2VhcmNoIHx8ICcnKSkpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRpbmcgPSBmYWxzZTtcblx0fTtcblxuXHRSb3V0ZXIucHJvdG90eXBlLmNvbXBvbmVudFdpbGxVbm1vdW50ID0gZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuXHRcdGlmICh0eXBlb2YgdGhpcy51bmxpc3Rlbj09PSdmdW5jdGlvbicpIHsgdGhpcy51bmxpc3RlbigpOyB9XG5cdFx0Uk9VVEVSUy5zcGxpY2UoUk9VVEVSUy5pbmRleE9mKHRoaXMpLCAxKTtcblx0fTtcblxuXHRSb3V0ZXIucHJvdG90eXBlLmNvbXBvbmVudFdpbGxVcGRhdGUgPSBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlICgpIHtcblx0XHR0aGlzLnVwZGF0aW5nID0gdHJ1ZTtcblx0fTtcblxuXHRSb3V0ZXIucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZSA9IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSAoKSB7XG5cdFx0dGhpcy51cGRhdGluZyA9IGZhbHNlO1xuXHR9O1xuXG5cdFJvdXRlci5wcm90b3R5cGUuZ2V0TWF0Y2hpbmdDaGlsZHJlbiA9IGZ1bmN0aW9uIGdldE1hdGNoaW5nQ2hpbGRyZW4gKGNoaWxkcmVuLCB1cmwsIGludm9rZSkge1xuXHRcdHJldHVybiBjaGlsZHJlblxuXHRcdFx0LmZpbHRlcihwcmVwYXJlVk5vZGVGb3JSYW5raW5nKVxuXHRcdFx0LnNvcnQocGF0aFJhbmtTb3J0KVxuXHRcdFx0Lm1hcCggZnVuY3Rpb24gKHZub2RlKSB7XG5cdFx0XHRcdHZhciBtYXRjaGVzID0gZXhlYyh1cmwsIHZub2RlLnByb3BzLnBhdGgsIHZub2RlLnByb3BzKTtcblx0XHRcdFx0aWYgKG1hdGNoZXMpIHtcblx0XHRcdFx0XHRpZiAoaW52b2tlICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0dmFyIG5ld1Byb3BzID0geyB1cmw6IHVybCwgbWF0Y2hlczogbWF0Y2hlcyB9O1xuXHRcdFx0XHRcdFx0YXNzaWduKG5ld1Byb3BzLCBtYXRjaGVzKTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBuZXdQcm9wcy5yZWY7XG5cdFx0XHRcdFx0XHRkZWxldGUgbmV3UHJvcHMua2V5O1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNsb25lRWxlbWVudCh2bm9kZSwgbmV3UHJvcHMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdm5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdH0pLmZpbHRlcihCb29sZWFuKTtcblx0fTtcblxuXHRSb3V0ZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAocmVmLCByZWYkMSkge1xuXHRcdHZhciBjaGlsZHJlbiA9IHJlZi5jaGlsZHJlbjtcblx0XHR2YXIgb25DaGFuZ2UgPSByZWYub25DaGFuZ2U7XG5cdFx0dmFyIHVybCA9IHJlZiQxLnVybDtcblxuXHRcdHZhciBhY3RpdmUgPSB0aGlzLmdldE1hdGNoaW5nQ2hpbGRyZW4odG9DaGlsZEFycmF5KGNoaWxkcmVuKSwgdXJsLCB0cnVlKTtcblxuXHRcdHZhciBjdXJyZW50ID0gYWN0aXZlWzBdIHx8IG51bGw7XG5cblx0XHR2YXIgcHJldmlvdXMgPSB0aGlzLnByZXZpb3VzVXJsO1xuXHRcdGlmICh1cmwhPT1wcmV2aW91cykge1xuXHRcdFx0dGhpcy5wcmV2aW91c1VybCA9IHVybDtcblx0XHRcdGlmICh0eXBlb2Ygb25DaGFuZ2U9PT0nZnVuY3Rpb24nKSB7XG5cdFx0XHRcdG9uQ2hhbmdlKHtcblx0XHRcdFx0XHRyb3V0ZXI6IHRoaXMsXG5cdFx0XHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRcdFx0cHJldmlvdXM6IHByZXZpb3VzLFxuXHRcdFx0XHRcdGFjdGl2ZTogYWN0aXZlLFxuXHRcdFx0XHRcdGN1cnJlbnQ6IGN1cnJlbnRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGN1cnJlbnQ7XG5cdH07XG5cblx0cmV0dXJuIFJvdXRlcjtcbn0oQ29tcG9uZW50KSk7XG5cbnZhciBMaW5rID0gZnVuY3Rpb24gKHByb3BzKSB7IHJldHVybiAoXG5cdGNyZWF0ZUVsZW1lbnQoJ2EnLCBhc3NpZ24oeyBvbkNsaWNrOiBoYW5kbGVMaW5rQ2xpY2sgfSwgcHJvcHMpKVxuKTsgfTtcblxudmFyIFJvdXRlID0gZnVuY3Rpb24gKHByb3BzKSB7IHJldHVybiBjcmVhdGVFbGVtZW50KHByb3BzLmNvbXBvbmVudCwgcHJvcHMpOyB9O1xuXG5Sb3V0ZXIuc3Vic2NyaWJlcnMgPSBzdWJzY3JpYmVycztcblJvdXRlci5nZXRDdXJyZW50VXJsID0gZ2V0Q3VycmVudFVybDtcblJvdXRlci5yb3V0ZSA9IHJvdXRlO1xuUm91dGVyLlJvdXRlciA9IFJvdXRlcjtcblJvdXRlci5Sb3V0ZSA9IFJvdXRlO1xuUm91dGVyLkxpbmsgPSBMaW5rO1xuUm91dGVyLmV4ZWMgPSBleGVjO1xuXG5leHBvcnQgeyBzdWJzY3JpYmVycywgZ2V0Q3VycmVudFVybCwgcm91dGUsIFJvdXRlciwgUm91dGUsIExpbmssIGV4ZWMgfTtleHBvcnQgZGVmYXVsdCBSb3V0ZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3Qtcm91dGVyLmVzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5MaW5rID0gZXhwb3J0cy5NYXRjaCA9IHVuZGVmaW5lZDtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9wcmVhY3QgPSByZXF1aXJlKCdwcmVhY3QnKTtcblxudmFyIF9wcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdwcmVhY3Qtcm91dGVyJyk7XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgTWF0Y2ggPSBleHBvcnRzLk1hdGNoID0gZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcblx0X2luaGVyaXRzKE1hdGNoLCBfQ29tcG9uZW50KTtcblxuXHRmdW5jdGlvbiBNYXRjaCgpIHtcblx0XHR2YXIgX3RlbXAsIF90aGlzLCBfcmV0O1xuXG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1hdGNoKTtcblxuXHRcdGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdFx0XHRhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHRcdH1cblxuXHRcdHJldHVybiBfcmV0ID0gKF90ZW1wID0gKF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0NvbXBvbmVudC5jYWxsLmFwcGx5KF9Db21wb25lbnQsIFt0aGlzXS5jb25jYXQoYXJncykpKSwgX3RoaXMpLCBfdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAodXJsKSB7XG5cdFx0XHRfdGhpcy5uZXh0VXJsID0gdXJsO1xuXHRcdFx0X3RoaXMuc2V0U3RhdGUoe30pO1xuXHRcdH0sIF90ZW1wKSwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oX3RoaXMsIF9yZXQpO1xuXHR9XG5cblx0TWF0Y2gucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50ID0gZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0X3ByZWFjdFJvdXRlci5zdWJzY3JpYmVycy5wdXNoKHRoaXMudXBkYXRlKTtcblx0fTtcblxuXHRNYXRjaC5wcm90b3R5cGUuY29tcG9uZW50V2lsbFVubW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRfcHJlYWN0Um91dGVyLnN1YnNjcmliZXJzLnNwbGljZShfcHJlYWN0Um91dGVyLnN1YnNjcmliZXJzLmluZGV4T2YodGhpcy51cGRhdGUpID4+PiAwLCAxKTtcblx0fTtcblxuXHRNYXRjaC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKHByb3BzKSB7XG5cdFx0dmFyIHVybCA9IHRoaXMubmV4dFVybCB8fCAoMCwgX3ByZWFjdFJvdXRlci5nZXRDdXJyZW50VXJsKSgpLFxuXHRcdCAgICBwYXRoID0gdXJsLnJlcGxhY2UoL1xcPy4rJC8sICcnKTtcblx0XHR0aGlzLm5leHRVcmwgPSBudWxsO1xuXHRcdHJldHVybiBwcm9wcy5jaGlsZHJlbih7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdHBhdGg6IHBhdGgsXG5cdFx0XHRtYXRjaGVzOiAoMCwgX3ByZWFjdFJvdXRlci5leGVjKShwYXRoLCBwcm9wcy5wYXRoLCB7fSkgIT09IGZhbHNlXG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIE1hdGNoO1xufShfcHJlYWN0LkNvbXBvbmVudCk7XG5cbnZhciBMaW5rID0gZnVuY3Rpb24gTGluayhfcmVmKSB7XG5cdHZhciBhY3RpdmVDbGFzc05hbWUgPSBfcmVmLmFjdGl2ZUNsYXNzTmFtZSxcblx0ICAgIHBhdGggPSBfcmVmLnBhdGgsXG5cdCAgICBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2FjdGl2ZUNsYXNzTmFtZScsICdwYXRoJ10pO1xuXG5cdHJldHVybiAoMCwgX3ByZWFjdC5oKShcblx0XHRNYXRjaCxcblx0XHR7IHBhdGg6IHBhdGggfHwgcHJvcHMuaHJlZiB9LFxuXHRcdGZ1bmN0aW9uIChfcmVmMikge1xuXHRcdFx0dmFyIG1hdGNoZXMgPSBfcmVmMi5tYXRjaGVzO1xuXHRcdFx0cmV0dXJuICgwLCBfcHJlYWN0LmgpKF9wcmVhY3RSb3V0ZXIuTGluaywgX2V4dGVuZHMoe30sIHByb3BzLCB7ICdjbGFzcyc6IFtwcm9wcy5jbGFzcyB8fCBwcm9wcy5jbGFzc05hbWUsIG1hdGNoZXMgJiYgYWN0aXZlQ2xhc3NOYW1lXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpIH0pKTtcblx0XHR9XG5cdCk7XG59O1xuXG5leHBvcnRzLkxpbmsgPSBMaW5rO1xuZXhwb3J0cy5kZWZhdWx0ID0gTWF0Y2g7XG5cbk1hdGNoLkxpbmsgPSBMaW5rO1xuIiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSAnaHRtL3ByZWFjdCc7XG5pbXBvcnQgVGVzdENvbXBvbmVudCBmcm9tICcuL1Rlc3RDb21wb25lbnQnO1xuaW1wb3J0IHsgQXBwUHJvdmlkZXIgfSBmcm9tICcuL2FwcC1jb250ZXh0JztcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4vYXV0aC9hdXRoLWNvbnRleHQnO1xuaW1wb3J0IFJvdXRlciBmcm9tICdwcmVhY3Qtcm91dGVyJztcbmltcG9ydCB7TGl9IGZyb20gJ3ByZWFjdC1yb3V0ZXIvbWF0Y2gnO1xuLy9pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCBSb3V0ZSwgTGluayB9IGZyb20gJy4vcm91dGUvcm91dGUtY29udGV4dCc7XG4vLyBpbXBvcnQgTG9naW4gZnJvbSAnLi9hdXRoL0xvZ2luJztcbi8vIGltcG9ydCBTaWdudXAgZnJvbSAnLi9hdXRoL1NpZ251cCc7XG4vLyBpbXBvcnQgRm9yZ290UGFzc3dvcmQgZnJvbSAnLi9hdXRoL0ZvcmdvdFBhc3N3b3JkJztcbi8vIGltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICcuL2F1dGgvQ2hhbmdlUGFzc3dvcmQnO1xuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL0xvZ2luJykpO1xuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL0NoYW5nZVBhc3N3b3JkJykpO1xuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL0ZvcmdvdFBhc3N3b3JkJykpO1xuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vYXV0aC9TaWdudXAnKSk7XG5cbnJlbmRlcihcbiAgPEFwcFByb3ZpZGVyPlxuICAgIDxBdXRoUHJvdmlkZXI+XG4gICAgICA8Um91dGVQcm92aWRlcj5cbiAgICAgICAgPExpbmsgdG89XCIvY2hhbmdlcGFzc3dvcmRcIj5DaGFuZ2VQYXNzd29yZDwvTGluaz5cbiAgICAgICAgPExpbmsgdG89XCIvbG9naW5cIj5Mb2dpbjwvTGluaz5cbiAgICAgICAgPExpbmsgdG89XCIvc2lnbnVwXCI+U2lnbnVwPC9MaW5rPlxuICAgICAgICA8TGluayB0bz1cIi9mb3Jnb3RwYXNzd29yZFwiPkZvcmdvdFBhc3N3b3JkPC9MaW5rPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9jaGFuZ2VwYXNzd29yZFwiPlxuICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgLz5cbiAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgIFxuICAgICAgICA8L1JvdXRlPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9sb2dpblwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgIDxMb2dpbiAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICBcbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvc2lnbnVwXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8U2lnbnVwIC8+XG4gICAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvZm9yZ290cGFzc3dvcmRcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAvPlxuICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICA8L1JvdXRlUHJvdmlkZXI+XG4gICAgPC9BdXRoUHJvdmlkZXI+XG4gIDwvQXBwUHJvdmlkZXI+LFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcbik7XG4iXSwibmFtZXMiOlsiRU1QVFlfT0JKIiwiRU1QVFlfQVJSIiwiSVNfTk9OX0RJTUVOU0lPTkFMIiwiY3VycmVudEluZGV4IiwiY3VycmVudENvbXBvbmVudCIsInByZXZSYWYiLCJhZnRlclBhaW50RWZmZWN0cyIsIm9sZEJlZm9yZVJlbmRlciIsIm9wdGlvbnMiLCJfcmVuZGVyIiwib2xkQWZ0ZXJEaWZmIiwiZGlmZmVkIiwib2xkQ29tbWl0IiwiX2NvbW1pdCIsIm9sZEJlZm9yZVVubW91bnQiLCJ1bm1vdW50IiwiZ2V0SG9va1N0YXRlIiwiaW5kZXgiLCJfaG9vayIsImhvb2tzIiwiX19ob29rcyIsIl9saXN0IiwiX3BlbmRpbmdFZmZlY3RzIiwibGVuZ3RoIiwicHVzaCIsInVzZVN0YXRlIiwiaW5pdGlhbFN0YXRlIiwidXNlUmVkdWNlciIsImludm9rZU9yUmV0dXJuIiwicmVkdWNlciIsImluaXQiLCJob29rU3RhdGUiLCJfY29tcG9uZW50IiwiX3ZhbHVlIiwidW5kZWZpbmVkIiwibmV4dFZhbHVlIiwiYWN0aW9uIiwic2V0U3RhdGUiLCJ1c2VFZmZlY3QiLCJjYWxsYmFjayIsImFyZ3MiLCJzdGF0ZSIsImFyZ3NDaGFuZ2VkIiwiX2FyZ3MiLCJ1c2VNZW1vIiwiZmFjdG9yeSIsIl9mYWN0b3J5IiwidXNlQ29udGV4dCIsImNvbnRleHQiLCJwcm92aWRlciIsIl9pZCIsIl9kZWZhdWx0VmFsdWUiLCJzdWIiLCJwcm9wcyIsInZhbHVlIiwiZmx1c2hBZnRlclBhaW50RWZmZWN0cyIsInNvbWUiLCJjb21wb25lbnQiLCJfcGFyZW50RG9tIiwiZm9yRWFjaCIsImludm9rZUNsZWFudXAiLCJpbnZva2VFZmZlY3QiLCJlIiwiX2NhdGNoRXJyb3IiLCJfdm5vZGUiLCJob29rIiwiX2NsZWFudXAiLCJyZXN1bHQiLCJvbGRBcmdzIiwibmV3QXJncyIsImFyZyIsImYiLCJ2bm9kZSIsImMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyYWYiLCJkb25lIiwiY2xlYXJUaW1lb3V0IiwidGltZW91dCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwic2V0VGltZW91dCIsIndpbmRvdyIsImNvbW1pdFF1ZXVlIiwiX3JlbmRlckNhbGxiYWNrcyIsImZpbHRlciIsImNiIiwiYXNzaWduIiwib2JqIiwiaSIsInNoYWxsb3dEaWZmZXJzIiwiYSIsImIiLCJuIiwidCIsInMiLCJyIiwidSIsImgiLCJwIiwiT2JqZWN0IiwiYXBwbHkiLCJNYXAiLCJnZXQiLCJzZXQiLCJyZXBsYWNlIiwibCIsImFyZ3VtZW50cyIsIm0iLCJiaW5kIiwiQXBwQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJjb3VudFJlZHVjZXIiLCJ0eXBlIiwiY291bnQiLCJFcnJvciIsIkFwcFByb3ZpZGVyIiwiZGlzcGF0Y2giLCJpbml0U3RhdGUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImVycm9yIiwidXNlcm5hbWUiLCJsb2FkaW5nIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImlzTG9nZ2VkSW4iLCJpc1Bhc3N3b3JkQ2hhbmdlZCIsImF1dGhSZWR1Y2VyIiwiYWN0aW9uVHlwZXMiLCJWQUxVRV9DSEFOR0VEIiwicGF5bG9hZCIsInByb3BOYW1lIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJzdWNjZXNzTWVzc2FnZSIsIkxPR0lOX0ZBSUxFRCIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJjb25zdCIsIkVNUFRZIiwibGV0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwiTGluayIsIk1hdGNoIiwiX2V4dGVuZHMiLCJ0YXJnZXQiLCJzb3VyY2UiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJfcHJlYWN0IiwicmVxdWlyZSIsIl9wcmVhY3RSb3V0ZXIiLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMiLCJrZXlzIiwiaW5kZXhPZiIsIl9jbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiQ29uc3RydWN0b3IiLCJUeXBlRXJyb3IiLCJfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiIsInNlbGYiLCJSZWZlcmVuY2VFcnJvciIsIl9pbmhlcml0cyIsInN1YkNsYXNzIiwic3VwZXJDbGFzcyIsImNyZWF0ZSIsImNvbnN0cnVjdG9yIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJfQ29tcG9uZW50IiwiX3RlbXAiLCJfdGhpcyIsIl9yZXQiLCJfbGVuIiwiQXJyYXkiLCJfa2V5IiwiY29uY2F0IiwidXBkYXRlIiwidXJsIiwibmV4dFVybCIsImNvbXBvbmVudERpZE1vdW50Iiwic3Vic2NyaWJlcnMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInNwbGljZSIsInJlbmRlciIsImdldEN1cnJlbnRVcmwiLCJwYXRoIiwiY2hpbGRyZW4iLCJtYXRjaGVzIiwiZXhlYyIsIkNvbXBvbmVudCIsIl9yZWYiLCJhY3RpdmVDbGFzc05hbWUiLCJocmVmIiwiX3JlZjIiLCJjbGFzcyIsImNsYXNzTmFtZSIsIkJvb2xlYW4iLCJqb2luIiwiZGVmYXVsdCIsIkxvZ2luIiwibGF6eSIsIkNoYW5nZVBhc3N3b3JkIiwiRm9yZ290UGFzc3dvcmQiLCJTaWdudXAiLCJTdXNwZW5zZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiJLQUFPO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsSUFBTUEsQ0FBQUEsR0FBWSxFQUFsQjtBQUFBLElBQ01DLENBQUFBLEdBQVksRUFEbEI7QUFBQSxJQUVNQyxDQUFBQSxHQUFxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQ2xDLElBQUlDLEdBQUo7QUFBQSxJQUdJQyxHQUhKO0FBQUEsSUFjSUMsR0FkSjtBQUFBLElBTUlDLEdBQUFBLEdBQW9CLEVBTnhCO0FBQUEsSUFRSUMsR0FBQUEsR0FBa0JDLENBQUFBLENBQVFDLEdB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
