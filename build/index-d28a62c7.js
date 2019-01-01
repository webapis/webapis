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

const Login = L(() => import('./Login-083d52c0.js'));
const ChangePassword = L(() => import('./ChangePassword-c91119c1.js'));
const ForgotPassword = L(() => import('./ForgotPassword-b572d231.js'));
const Signup = L(() => import('./Signup-0fce55d5.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZDI4YTYyYzcuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvY29tcGF0L2Rpc3QvY29tcGF0Lm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9odG0vZGlzdC9odG0ubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2h0bS9wcmVhY3QvaW5kZXgubW9kdWxlLmpzIiwiLi4vYXBwLWNvbnRleHQuanMiLCIuLi9hdXRoL2F1dGhSZWR1Y2VyLmpzIiwiLi4vYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi9yb3V0ZS9yb3V0ZXIuanMiLCIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHt1c2VTdGF0ZSBhcyBuLHVzZVJlZHVjZXIgYXMgdCx1c2VFZmZlY3QgYXMgZSx1c2VMYXlvdXRFZmZlY3QgYXMgcix1c2VSZWYgYXMgbyx1c2VJbXBlcmF0aXZlSGFuZGxlIGFzIHUsdXNlTWVtbyBhcyBpLHVzZUNhbGxiYWNrIGFzIGYsdXNlQ29udGV4dCBhcyBjLHVzZURlYnVnVmFsdWUgYXMgYX1mcm9tXCJwcmVhY3QvaG9va3NcIjtleHBvcnQqZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e0NvbXBvbmVudCBhcyBsLGNyZWF0ZUVsZW1lbnQgYXMgcyxvcHRpb25zIGFzIHYsdG9DaGlsZEFycmF5IGFzIGgsaHlkcmF0ZSBhcyBwLHJlbmRlciBhcyBkLF91bm1vdW50IGFzIG0sY2xvbmVFbGVtZW50IGFzIHksY3JlYXRlUmVmIGFzIGIsY3JlYXRlQ29udGV4dCBhcyBnLEZyYWdtZW50IGFzIHh9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2NyZWF0ZUVsZW1lbnQsY3JlYXRlQ29udGV4dCxjcmVhdGVSZWYsRnJhZ21lbnQsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2Z1bmN0aW9uIEUobix0KXtmb3IodmFyIGUgaW4gdCluW2VdPXRbZV07cmV0dXJuIG59ZnVuY3Rpb24gdyhuLHQpe2Zvcih2YXIgZSBpbiBuKWlmKFwiX19zb3VyY2VcIiE9PWUmJiEoZSBpbiB0KSlyZXR1cm4hMDtmb3IodmFyIHIgaW4gdClpZihcIl9fc291cmNlXCIhPT1yJiZuW3JdIT09dFtyXSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgQz1mdW5jdGlvbihuKXt2YXIgdCxlO2Z1bmN0aW9uIHIodCl7dmFyIGU7cmV0dXJuKGU9bi5jYWxsKHRoaXMsdCl8fHRoaXMpLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwLGV9cmV0dXJuIGU9biwodD1yKS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Ll9fcHJvdG9fXz1lLHIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuLHQpe3JldHVybiB3KHRoaXMucHJvcHMsbil8fHcodGhpcy5zdGF0ZSx0KX0scn0obCk7ZnVuY3Rpb24gXyhuLHQpe2Z1bmN0aW9uIGUobil7dmFyIGU9dGhpcy5wcm9wcy5yZWYscj1lPT1uLnJlZjtyZXR1cm4hciYmZSYmKGUuY2FsbD9lKG51bGwpOmUuY3VycmVudD1udWxsKSx0PyF0KHRoaXMucHJvcHMsbil8fCFyOncodGhpcy5wcm9wcyxuKX1mdW5jdGlvbiByKHQpe3JldHVybiB0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1lLHMobixFKHt9LHQpKX1yZXR1cm4gci5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD0hMCxyLmRpc3BsYXlOYW1lPVwiTWVtbyhcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIixyLnQ9ITAscn12YXIgQT12Ll9fYjtmdW5jdGlvbiBTKG4pe2Z1bmN0aW9uIHQodCl7dmFyIGU9RSh7fSx0KTtyZXR1cm4gZGVsZXRlIGUucmVmLG4oZSx0LnJlZil9cmV0dXJuIHQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9dC50PSEwLHQuZGlzcGxheU5hbWU9XCJGb3J3YXJkUmVmKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHR9di5fX2I9ZnVuY3Rpb24obil7bi50eXBlJiZuLnR5cGUudCYmbi5yZWYmJihuLnByb3BzLnJlZj1uLnJlZixuLnJlZj1udWxsKSxBJiZBKG4pfTt2YXIgaz1mdW5jdGlvbihuLHQpe3JldHVybiBuP2gobikucmVkdWNlKGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gbi5jb25jYXQodChlLHIpKX0sW10pOm51bGx9LFI9e21hcDprLGZvckVhY2g6ayxjb3VudDpmdW5jdGlvbihuKXtyZXR1cm4gbj9oKG4pLmxlbmd0aDowfSxvbmx5OmZ1bmN0aW9uKG4pe2lmKDEhPT0obj1oKG4pKS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuXCIpO3JldHVybiBuWzBdfSx0b0FycmF5Omh9LEY9di5fX2U7ZnVuY3Rpb24gTihuKXtyZXR1cm4gbiYmKChuPUUoe30sbikpLl9fYz1udWxsLG4uX19rPW4uX19rJiZuLl9fay5tYXAoTikpLG59ZnVuY3Rpb24gVSgpe3RoaXMuX191PTAsdGhpcy5vPW51bGwsdGhpcy5fX2I9bnVsbH1mdW5jdGlvbiBNKG4pe3ZhciB0PW4uX18uX19jO3JldHVybiB0JiZ0LnUmJnQudShuKX1mdW5jdGlvbiBMKG4pe3ZhciB0LGUscjtmdW5jdGlvbiBvKG8pe2lmKHR8fCh0PW4oKSkudGhlbihmdW5jdGlvbihuKXtlPW4uZGVmYXVsdHx8bn0sZnVuY3Rpb24obil7cj1ufSkscil0aHJvdyByO2lmKCFlKXRocm93IHQ7cmV0dXJuIHMoZSxvKX1yZXR1cm4gby5kaXNwbGF5TmFtZT1cIkxhenlcIixvLnQ9ITAsb31mdW5jdGlvbiBPKCl7dGhpcy5pPW51bGwsdGhpcy5sPW51bGx9di5fX2U9ZnVuY3Rpb24obix0LGUpe2lmKG4udGhlbilmb3IodmFyIHIsbz10O289by5fXzspaWYoKHI9by5fX2MpJiZyLl9fYylyZXR1cm4gci5fX2Mobix0Ll9fYyk7RihuLHQsZSl9LChVLnByb3RvdHlwZT1uZXcgbCkuX19jPWZ1bmN0aW9uKG4sdCl7dmFyIGU9dGhpcztudWxsPT1lLm8mJihlLm89W10pLGUuby5wdXNoKHQpO3ZhciByPU0oZS5fX3YpLG89ITEsdT1mdW5jdGlvbigpe298fChvPSEwLHI/cihpKTppKCkpfTt0Ll9fYz10LmNvbXBvbmVudFdpbGxVbm1vdW50LHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1KCksdC5fX2MmJnQuX19jKCl9O3ZhciBpPWZ1bmN0aW9uKCl7dmFyIG47aWYoIS0tZS5fX3UpZm9yKGUuX192Ll9fa1swXT1lLnN0YXRlLnUsZS5zZXRTdGF0ZSh7dTplLl9fYj1udWxsfSk7bj1lLm8ucG9wKCk7KW4uZm9yY2VVcGRhdGUoKX07ZS5fX3UrK3x8ZS5zZXRTdGF0ZSh7dTplLl9fYj1lLl9fdi5fX2tbMF19KSxuLnRoZW4odSx1KX0sVS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMuX19iJiYodGhpcy5fX3YuX19rWzBdPU4odGhpcy5fX2IpLHRoaXMuX19iPW51bGwpLFtzKGwsbnVsbCx0LnU/bnVsbDpuLmNoaWxkcmVuKSx0LnUmJm4uZmFsbGJhY2tdfTt2YXIgUD1mdW5jdGlvbihuLHQsZSl7aWYoKytlWzFdPT09ZVswXSYmbi5sLmRlbGV0ZSh0KSxuLnByb3BzLnJldmVhbE9yZGVyJiYoXCJ0XCIhPT1uLnByb3BzLnJldmVhbE9yZGVyWzBdfHwhbi5sLnNpemUpKWZvcihlPW4uaTtlOyl7Zm9yKDtlLmxlbmd0aD4zOyllLnBvcCgpKCk7aWYoZVsxXTxlWzBdKWJyZWFrO24uaT1lPWVbMl19fTsoTy5wcm90b3R5cGU9bmV3IGwpLnU9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcyxlPU0odC5fX3YpLHI9dC5sLmdldChuKTtyZXR1cm4gclswXSsrLGZ1bmN0aW9uKG8pe3ZhciB1PWZ1bmN0aW9uKCl7dC5wcm9wcy5yZXZlYWxPcmRlcj8oci5wdXNoKG8pLFAodCxuLHIpKTpvKCl9O2U/ZSh1KTp1KCl9fSxPLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obil7dGhpcy5pPW51bGwsdGhpcy5sPW5ldyBNYXA7dmFyIHQ9aChuLmNoaWxkcmVuKTtuLnJldmVhbE9yZGVyJiZcImJcIj09PW4ucmV2ZWFsT3JkZXJbMF0mJnQucmV2ZXJzZSgpO2Zvcih2YXIgZT10Lmxlbmd0aDtlLS07KXRoaXMubC5zZXQodFtlXSx0aGlzLmk9WzEsMCx0aGlzLmldKTtyZXR1cm4gbi5jaGlsZHJlbn0sTy5wcm90b3R5cGUuY29tcG9uZW50RGlkVXBkYXRlPU8ucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50PWZ1bmN0aW9uKCl7dmFyIG49dGhpcztuLmwuZm9yRWFjaChmdW5jdGlvbih0LGUpe1AobixlLHQpfSl9O3ZhciBXPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe312YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0fSx0LnJlbmRlcj1mdW5jdGlvbihuKXtyZXR1cm4gbi5jaGlsZHJlbn0sbn0oKTtmdW5jdGlvbiBqKG4pe3ZhciB0PXRoaXMsZT1uLmNvbnRhaW5lcixyPXMoVyx7Y29udGV4dDp0LmNvbnRleHR9LG4udm5vZGUpO3JldHVybiB0LnMmJnQucyE9PWUmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpLHQucD0hMSksbi52bm9kZT90LnA/KGUuX19rPXQuX19rLGQocixlKSx0Ll9faz1lLl9fayk6KHQudj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSxwKFwiXCIsZSksZS5hcHBlbmRDaGlsZCh0LnYpLHQucD0hMCx0LnM9ZSxkKHIsZSx0LnYpLHQuX19rPXQudi5fX2spOnQucCYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCkpLHQuaD1yLHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpfSxudWxsfWZ1bmN0aW9uIHoobix0KXtyZXR1cm4gcyhqLHt2bm9kZTpuLGNvbnRhaW5lcjp0fSl9dmFyIEQ9L14oPzphY2NlbnR8YWxpZ25tZW50fGFyYWJpY3xiYXNlbGluZXxjYXB8Y2xpcCg/IVBhdGhVKXxjb2xvcnxmaWxsfGZsb29kfGZvbnR8Z2x5cGgoPyFSKXxob3JpenxtYXJrZXIoPyFIfFd8VSl8b3ZlcmxpbmV8cGFpbnR8c3RvcHxzdHJpa2V0aHJvdWdofHN0cm9rZXx0ZXh0KD8hTCl8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZWN0b3J8dmVydHx3b3JkfHdyaXRpbmd8eCg/IUMpKVtBLVpdLztsLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXt9O3ZhciBIPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpfHw2MDEwMztmdW5jdGlvbiBUKG4sdCxlKXtpZihudWxsPT10Ll9faylmb3IoO3QuZmlyc3RDaGlsZDspdC5yZW1vdmVDaGlsZCh0LmZpcnN0Q2hpbGQpO3JldHVybiBkKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH1mdW5jdGlvbiBWKG4sdCxlKXtyZXR1cm4gcChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9dmFyIFo9di5ldmVudDtmdW5jdGlvbiBJKG4sdCl7bltcIlVOU0FGRV9cIit0XSYmIW5bdF0mJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLHQse2NvbmZpZ3VyYWJsZTohMSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tcIlVOU0FGRV9cIit0XX0sc2V0OmZ1bmN0aW9uKG4pe3RoaXNbXCJVTlNBRkVfXCIrdF09bn19KX12LmV2ZW50PWZ1bmN0aW9uKG4pe1omJihuPVoobikpLG4ucGVyc2lzdD1mdW5jdGlvbigpe307dmFyIHQ9ITEsZT0hMSxyPW4uc3RvcFByb3BhZ2F0aW9uO24uc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7ci5jYWxsKG4pLHQ9ITB9O3ZhciBvPW4ucHJldmVudERlZmF1bHQ7cmV0dXJuIG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtvLmNhbGwobiksZT0hMH0sbi5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1mdW5jdGlvbigpe3JldHVybiB0fSxuLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBlfSxuLm5hdGl2ZUV2ZW50PW59O3ZhciAkPXtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xhc3N9fSxxPXYudm5vZGU7di52bm9kZT1mdW5jdGlvbihuKXtuLiQkdHlwZW9mPUg7dmFyIHQ9bi50eXBlLGU9bi5wcm9wcztpZih0KXtpZihlLmNsYXNzIT1lLmNsYXNzTmFtZSYmKCQuZW51bWVyYWJsZT1cImNsYXNzTmFtZVwiaW4gZSxudWxsIT1lLmNsYXNzTmFtZSYmKGUuY2xhc3M9ZS5jbGFzc05hbWUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiY2xhc3NOYW1lXCIsJCkpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpe3ZhciByLG8sdTtmb3IodSBpbiBlLmRlZmF1bHRWYWx1ZSYmdm9pZCAwIT09ZS52YWx1ZSYmKGUudmFsdWV8fDA9PT1lLnZhbHVlfHwoZS52YWx1ZT1lLmRlZmF1bHRWYWx1ZSksZGVsZXRlIGUuZGVmYXVsdFZhbHVlKSxBcnJheS5pc0FycmF5KGUudmFsdWUpJiZlLm11bHRpcGxlJiZcInNlbGVjdFwiPT09dCYmKGgoZS5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbihuKXstMSE9ZS52YWx1ZS5pbmRleE9mKG4ucHJvcHMudmFsdWUpJiYobi5wcm9wcy5zZWxlY3RlZD0hMCl9KSxkZWxldGUgZS52YWx1ZSksZSlpZihyPUQudGVzdCh1KSlicmVhaztpZihyKWZvcih1IGluIG89bi5wcm9wcz17fSxlKW9bRC50ZXN0KHUpP3UucmVwbGFjZSgvW0EtWjAtOV0vLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCk6dV09ZVt1XX0hZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlLHI9bi5wcm9wcztpZihyJiZcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIG89e307Zm9yKHZhciB1IGluIHIpL15vbihBbml8VHJhfFRvdSkvLnRlc3QodSkmJihyW3UudG9Mb3dlckNhc2UoKV09clt1XSxkZWxldGUgclt1XSksb1t1LnRvTG93ZXJDYXNlKCldPXU7aWYoby5vbmRvdWJsZWNsaWNrJiYoci5vbmRibGNsaWNrPXJbby5vbmRvdWJsZWNsaWNrXSxkZWxldGUgcltvLm9uZG91YmxlY2xpY2tdKSxvLm9uYmVmb3JlaW5wdXQmJihyLm9uYmVmb3JlaW5wdXQ9cltvLm9uYmVmb3JlaW5wdXRdLGRlbGV0ZSByW28ub25iZWZvcmVpbnB1dF0pLG8ub25jaGFuZ2UmJihcInRleHRhcmVhXCI9PT1lfHxcImlucHV0XCI9PT1lLnRvTG93ZXJDYXNlKCkmJiEvXmZpbHxjaGV8cmEvaS50ZXN0KHIudHlwZSkpKXt2YXIgaT1vLm9uaW5wdXR8fFwib25pbnB1dFwiO3JbaV18fChyW2ldPXJbby5vbmNoYW5nZV0sZGVsZXRlIHJbby5vbmNoYW5nZV0pfX19KCksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmIXQubSYmdC5wcm90b3R5cGUmJihJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbE1vdW50XCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzXCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsVXBkYXRlXCIpLHQubT0hMCl9cSYmcShuKX07dmFyIEI9XCIxNi44LjBcIjtmdW5jdGlvbiBHKG4pe3JldHVybiBzLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBKKG4pe3JldHVybiEhbiYmbi4kJHR5cGVvZj09PUh9ZnVuY3Rpb24gSyhuKXtyZXR1cm4gSihuKT95LmFwcGx5KG51bGwsYXJndW1lbnRzKTpufWZ1bmN0aW9uIFEobil7cmV0dXJuISFuLl9fayYmKGQobnVsbCxuKSwhMCl9ZnVuY3Rpb24gWChuKXtyZXR1cm4gbiYmKG4uYmFzZXx8MT09PW4ubm9kZVR5cGUmJm4pfHxudWxsfXZhciBZPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4odCl9O2V4cG9ydCBkZWZhdWx0e3VzZVN0YXRlOm4sdXNlUmVkdWNlcjp0LHVzZUVmZmVjdDplLHVzZUxheW91dEVmZmVjdDpyLHVzZVJlZjpvLHVzZUltcGVyYXRpdmVIYW5kbGU6dSx1c2VNZW1vOmksdXNlQ2FsbGJhY2s6Zix1c2VDb250ZXh0OmMsdXNlRGVidWdWYWx1ZTphLHZlcnNpb246XCIxNi44LjBcIixDaGlsZHJlbjpSLHJlbmRlcjpULGh5ZHJhdGU6VCx1bm1vdW50Q29tcG9uZW50QXROb2RlOlEsY3JlYXRlUG9ydGFsOnosY3JlYXRlRWxlbWVudDpzLGNyZWF0ZUNvbnRleHQ6ZyxjcmVhdGVGYWN0b3J5OkcsY2xvbmVFbGVtZW50OkssY3JlYXRlUmVmOmIsRnJhZ21lbnQ6eCxpc1ZhbGlkRWxlbWVudDpKLGZpbmRET01Ob2RlOlgsQ29tcG9uZW50OmwsUHVyZUNvbXBvbmVudDpDLG1lbW86Xyxmb3J3YXJkUmVmOlMsdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXM6WSxTdXNwZW5zZTpVLFN1c3BlbnNlTGlzdDpPLGxhenk6TH07ZXhwb3J0e0IgYXMgdmVyc2lvbixSIGFzIENoaWxkcmVuLFQgYXMgcmVuZGVyLFYgYXMgaHlkcmF0ZSxRIGFzIHVubW91bnRDb21wb25lbnRBdE5vZGUseiBhcyBjcmVhdGVQb3J0YWwsRyBhcyBjcmVhdGVGYWN0b3J5LEsgYXMgY2xvbmVFbGVtZW50LEogYXMgaXNWYWxpZEVsZW1lbnQsWCBhcyBmaW5kRE9NTm9kZSxDIGFzIFB1cmVDb21wb25lbnQsXyBhcyBtZW1vLFMgYXMgZm9yd2FyZFJlZixZIGFzIHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzLFUgYXMgU3VzcGVuc2UsTyBhcyBTdXNwZW5zZUxpc3QsTCBhcyBsYXp5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBhdC5tb2R1bGUuanMubWFwXG4iLCJ2YXIgbj1mdW5jdGlvbih0LHMscixlKXt2YXIgdTtzWzBdPTA7Zm9yKHZhciBoPTE7aDxzLmxlbmd0aDtoKyspe3ZhciBwPXNbaCsrXSxhPXNbaF0/KHNbMF18PXA/MToyLHJbc1toKytdXSk6c1srK2hdOzM9PT1wP2VbMF09YTo0PT09cD9lWzFdPU9iamVjdC5hc3NpZ24oZVsxXXx8e30sYSk6NT09PXA/KGVbMV09ZVsxXXx8e30pW3NbKytoXV09YTo2PT09cD9lWzFdW3NbKytoXV0rPWErXCJcIjpwPyh1PXQuYXBwbHkoYSxuKHQsYSxyLFtcIlwiLG51bGxdKSksZS5wdXNoKHUpLGFbMF0/c1swXXw9Mjooc1toLTJdPTAsc1toXT11KSk6ZS5wdXNoKGEpfXJldHVybiBlfSx0PW5ldyBNYXA7ZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocyl7dmFyIHI9dC5nZXQodGhpcyk7cmV0dXJuIHJ8fChyPW5ldyBNYXAsdC5zZXQodGhpcyxyKSksKHI9bih0aGlzLHIuZ2V0KHMpfHwoci5zZXQocyxyPWZ1bmN0aW9uKG4pe2Zvcih2YXIgdCxzLHI9MSxlPVwiXCIsdT1cIlwiLGg9WzBdLHA9ZnVuY3Rpb24obil7MT09PXImJihufHwoZT1lLnJlcGxhY2UoL15cXHMqXFxuXFxzKnxcXHMqXFxuXFxzKiQvZyxcIlwiKSkpP2gucHVzaCgwLG4sZSk6Mz09PXImJihufHxlKT8oaC5wdXNoKDMsbixlKSxyPTIpOjI9PT1yJiZcIi4uLlwiPT09ZSYmbj9oLnB1c2goNCxuLDApOjI9PT1yJiZlJiYhbj9oLnB1c2goNSwwLCEwLGUpOnI+PTUmJigoZXx8IW4mJjU9PT1yKSYmKGgucHVzaChyLDAsZSxzKSxyPTYpLG4mJihoLnB1c2gocixuLDAscykscj02KSksZT1cIlwifSxhPTA7YTxuLmxlbmd0aDthKyspe2EmJigxPT09ciYmcCgpLHAoYSkpO2Zvcih2YXIgbD0wO2w8blthXS5sZW5ndGg7bCsrKXQ9blthXVtsXSwxPT09cj9cIjxcIj09PXQ/KHAoKSxoPVtoXSxyPTMpOmUrPXQ6ND09PXI/XCItLVwiPT09ZSYmXCI+XCI9PT10PyhyPTEsZT1cIlwiKTplPXQrZVswXTp1P3Q9PT11P3U9XCJcIjplKz10OidcIic9PT10fHxcIidcIj09PXQ/dT10OlwiPlwiPT09dD8ocCgpLHI9MSk6ciYmKFwiPVwiPT09dD8ocj01LHM9ZSxlPVwiXCIpOlwiL1wiPT09dCYmKHI8NXx8XCI+XCI9PT1uW2FdW2wrMV0pPyhwKCksMz09PXImJihoPWhbMF0pLHI9aCwoaD1oWzBdKS5wdXNoKDIsMCxyKSxyPTApOlwiIFwiPT09dHx8XCJcXHRcIj09PXR8fFwiXFxuXCI9PT10fHxcIlxcclwiPT09dD8ocCgpLHI9Mik6ZSs9dCksMz09PXImJlwiIS0tXCI9PT1lJiYocj00LGg9aFswXSl9cmV0dXJuIHAoKSxofShzKSksciksYXJndW1lbnRzLFtdKSkubGVuZ3RoPjE/cjpyWzBdfVxuIiwiaW1wb3J0e2ggYXMgcixDb21wb25lbnQgYXMgbyxyZW5kZXIgYXMgdH1mcm9tXCJwcmVhY3RcIjtleHBvcnR7aCxyZW5kZXIsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2ltcG9ydCBlIGZyb21cImh0bVwiO3ZhciBtPWUuYmluZChyKTtleHBvcnR7bSBhcyBodG1sfTtcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuXG5jb25zdCBBcHBDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuXG5mdW5jdGlvbiBjb3VudFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSAnSU5DUkVNRU5UJzpcbiAgICAgIHJldHVybiB7IGNvdW50OiBzdGF0ZS5jb3VudCArIDEgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBhY3Rpb24gdHlwZSR7YWN0aW9uLnR5cGV9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXNlQXBwQ29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwQ29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xuICB9XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcbiAgY29uc3QgaW5jcmVtZW50ID0gKCkgPT4gZGlzcGF0Y2goeyB0eXBlOiAnSU5DUkVNRU5UJyB9KTtcbiAgcmV0dXJuIHsgc3RhdGUsIGRpc3BhdGNoLCBpbmNyZW1lbnQgfTtcbn1cblxuZnVuY3Rpb24gQXBwUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGNvdW50UmVkdWNlciwgeyBjb3VudDogMCB9KTtcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxBcHBDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbmV4cG9ydCB7IEFwcFByb3ZpZGVyLCB1c2VBcHBDb250ZXh0IH07XG4iLCJleHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xuICBlbWFpbDogJycsXG4gIHBhc3N3b3JkOiAnJyxcbiAgc3VjY2VzczogZmFsc2UsXG4gIGVycm9yOiBudWxsLFxuICB1c2VybmFtZTogJycsXG4gIGxvYWRpbmc6IGZhbHNlLFxuICBjb25maXJtOiAnJyxcbiAgY3VycmVudDogJycsXG4gIGVtYWlsb3J1c2VybmFtZTogJycsXG4gIHRva2VuOiBudWxsLFxuICBpc0xvZ2dlZEluOiBmYWxzZSxcbiAgaXNQYXNzd29yZENoYW5nZWQ6IGZhbHNlLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBbYWN0aW9uLnBheWxvYWQucHJvcE5hbWVdOiBhY3Rpb24ucGF5bG9hZC52YWx1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZSwgJyxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lJyxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseScsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgc3VjY2VzczogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHRva2VuOiBhY3Rpb24udG9rZW4gfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2F1dGhSZWR1Y2VyJztcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuXG5mdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XG4gIH1cblxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XG5cblxuICByZXR1cm4ge1xuICAgIHN0YXRlLFxuICAgIGRpc3BhdGNoLFxuICB9O1xufVxuXG5mdW5jdGlvbiBBdXRoUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cblxuZXhwb3J0IHsgdXNlQXV0aENvbnRleHQsIEF1dGhQcm92aWRlciB9O1xuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbywgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcblxuY29uc3QgUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gUm91dGUocHJvcHMpIHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCB9ID0gcHJvcHM7XG4gIGNvbnN0IFtyb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcblxuICBpZiAocm91dGUgPT09IHBhdGgpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMaW5rKHByb3BzKSB7XG4gIGNvbnN0IHsgdG8gfSA9IHByb3BzO1xuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNldFJvdXRlKHRvKTtcbiAgfVxuICByZXR1cm4gPGEgey4uLnByb3BzfSBocmVmPXt0b30gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlUm91dGVDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChSb3V0ZUNvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBSb3V0ZVByb3ZpZGVyJyk7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VTdGF0ZSgnLycpO1xuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbcm91dGUsIHNldFJvdXRlXSwgW3JvdXRlXSk7XG5cbiAgcmV0dXJuIDxSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSAnaHRtL3ByZWFjdCc7XG5pbXBvcnQgVGVzdENvbXBvbmVudCBmcm9tICcuL1Rlc3RDb21wb25lbnQnO1xuaW1wb3J0IHsgQXBwUHJvdmlkZXIgfSBmcm9tICcuL2FwcC1jb250ZXh0JztcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4vYXV0aC9hdXRoLWNvbnRleHQnO1xuaW1wb3J0IHsgUm91dGVQcm92aWRlciwgUm91dGUsIExpbmsgfSBmcm9tICcuL3JvdXRlL3JvdXRlcic7XG5cbmNvbnN0IExvZ2luID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vYXV0aC9Mb2dpbicpKTtcbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vYXV0aC9DaGFuZ2VQYXNzd29yZCcpKTtcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vYXV0aC9Gb3Jnb3RQYXNzd29yZCcpKTtcbmNvbnN0IFNpZ251cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvU2lnbnVwJykpO1xuXG5yZW5kZXIoXG4gIDxBcHBQcm92aWRlcj5cbiAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgPFJvdXRlUHJvdmlkZXI+XG4gICAgICAgIDxMaW5rIHRvPVwiL2NoYW5nZXBhc3N3b3JkXCI+Q2hhbmdlUGFzc3dvcmQ8L0xpbms+XG4gICAgICAgIDxMaW5rIHRvPVwiL2xvZ2luXCI+TG9naW48L0xpbms+XG4gICAgICAgIDxMaW5rIHRvPVwiL3NpZ251cFwiPlNpZ251cDwvTGluaz5cbiAgICAgICAgPExpbmsgdG89XCIvZm9yZ290cGFzc3dvcmRcIj5Gb3Jnb3RQYXNzd29yZDwvTGluaz5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvY2hhbmdlcGFzc3dvcmRcIj5cbiAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgLz5cbiAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9sb2dpblwiPlxuICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICAgIDxMb2dpbiAvPlxuICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiL3NpZ251cFwiPlxuICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICAgIDxTaWdudXAgLz5cbiAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9mb3Jnb3RwYXNzd29yZFwiPlxuICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAvPlxuICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICA8L1JvdXRlUHJvdmlkZXI+XG4gICAgPC9BdXRoUHJvdmlkZXI+XG4gIDwvQXBwUHJvdmlkZXI+LFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcbik7XG4iXSwibmFtZXMiOlsiRU1QVFlfT0JKIiwiRU1QVFlfQVJSIiwiSVNfTk9OX0RJTUVOU0lPTkFMIiwiY3VycmVudEluZGV4IiwiY3VycmVudENvbXBvbmVudCIsInByZXZSYWYiLCJhZnRlclBhaW50RWZmZWN0cyIsIm9sZEJlZm9yZVJlbmRlciIsIm9wdGlvbnMiLCJfcmVuZGVyIiwib2xkQWZ0ZXJEaWZmIiwiZGlmZmVkIiwib2xkQ29tbWl0IiwiX2NvbW1pdCIsIm9sZEJlZm9yZVVubW91bnQiLCJ1bm1vdW50IiwiZ2V0SG9va1N0YXRlIiwiaW5kZXgiLCJfaG9vayIsImhvb2tzIiwiX19ob29rcyIsIl9saXN0IiwiX3BlbmRpbmdFZmZlY3RzIiwibGVuZ3RoIiwicHVzaCIsInVzZVN0YXRlIiwiaW5pdGlhbFN0YXRlIiwidXNlUmVkdWNlciIsImludm9rZU9yUmV0dXJuIiwicmVkdWNlciIsImluaXQiLCJob29rU3RhdGUiLCJfY29tcG9uZW50IiwiX3ZhbHVlIiwidW5kZWZpbmVkIiwibmV4dFZhbHVlIiwiYWN0aW9uIiwic2V0U3RhdGUiLCJ1c2VFZmZlY3QiLCJjYWxsYmFjayIsImFyZ3MiLCJzdGF0ZSIsImFyZ3NDaGFuZ2VkIiwiX2FyZ3MiLCJ1c2VNZW1vIiwiZmFjdG9yeSIsIl9mYWN0b3J5IiwidXNlQ29udGV4dCIsImNvbnRleHQiLCJwcm92aWRlciIsIl9pZCIsIl9kZWZhdWx0VmFsdWUiLCJzdWIiLCJwcm9wcyIsInZhbHVlIiwiZmx1c2hBZnRlclBhaW50RWZmZWN0cyIsInNvbWUiLCJjb21wb25lbnQiLCJfcGFyZW50RG9tIiwiZm9yRWFjaCIsImludm9rZUNsZWFudXAiLCJpbnZva2VFZmZlY3QiLCJlIiwiX2NhdGNoRXJyb3IiLCJfdm5vZGUiLCJob29rIiwiX2NsZWFudXAiLCJyZXN1bHQiLCJvbGRBcmdzIiwibmV3QXJncyIsImFyZyIsImYiLCJ2bm9kZSIsImMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyYWYiLCJkb25lIiwiY2xlYXJUaW1lb3V0IiwidGltZW91dCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwic2V0VGltZW91dCIsIndpbmRvdyIsImNvbW1pdFF1ZXVlIiwiX3JlbmRlckNhbGxiYWNrcyIsImZpbHRlciIsImNiIiwiYXNzaWduIiwib2JqIiwiaSIsInNoYWxsb3dEaWZmZXJzIiwiYSIsImIiLCJuIiwidCIsInMiLCJyIiwidSIsImgiLCJwIiwiT2JqZWN0IiwiYXBwbHkiLCJNYXAiLCJnZXQiLCJzZXQiLCJyZXBsYWNlIiwibCIsImFyZ3VtZW50cyIsIm0iLCJiaW5kIiwiQXBwQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJjb3VudFJlZHVjZXIiLCJ0eXBlIiwiY291bnQiLCJFcnJvciIsIkFwcFByb3ZpZGVyIiwiZGlzcGF0Y2giLCJpbml0U3RhdGUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImVycm9yIiwidXNlcm5hbWUiLCJsb2FkaW5nIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImlzTG9nZ2VkSW4iLCJpc1Bhc3N3b3JkQ2hhbmdlZCIsImF1dGhSZWR1Y2VyIiwiYWN0aW9uVHlwZXMiLCJWQUxVRV9DSEFOR0VEIiwicGF5bG9hZCIsInByb3BOYW1lIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJzdWNjZXNzTWVzc2FnZSIsIkxPR0lOX0ZBSUxFRCIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJSb3V0ZUNvbnRleHQiLCJSb3V0ZSIsImNoaWxkcmVuIiwicGF0aCIsInJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiTGluayIsInRvIiwic2V0Um91dGUiLCJoYW5kbGVDbGljayIsInByZXZlbnREZWZhdWx0IiwiUm91dGVQcm92aWRlciIsIkxvZ2luIiwibGF6eSIsIkNoYW5nZVBhc3N3b3JkIiwiRm9yZ290UGFzc3dvcmQiLCJTaWdudXAiLCJyZW5kZXIiLCJTdXNwZW5zZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiJLQUFPO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsSUFBTUEsQ0FBQUEsR0FBWSxFQUFsQjtBQUFBLElBQ01DLENBQUFBLEdBQVksRUFEbEI7QUFBQSxJQUVNQyxDQUFBQSxHQUFxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
