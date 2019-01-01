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
  const {
    state
  } = useRouteContext();
  const {
    location
  } = state;

  if (location.pathname === path) {
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

// import Signup from './auth/Signup';
// import ForgotPassword from './auth/ForgotPassword';
// import ChangePassword from './auth/ChangePassword';

const Login = L(() => import('./Login-b987bd10.js'));
const ChangePassword = L(() => import('./ChangePassword-1b7595ee.js'));
const ForgotPassword = L(() => import('./ForgotPassword-27d71c99.js'));
const Signup = L(() => import('./Signup-827d5be5.js'));
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
  fall: true
}, h(ChangePassword, null))), h(Route, {
  path: "/login"
}, h(Login, null)), h(Route, {
  path: "/signup"
}, h(Signup, null)), h(Route, {
  path: "/forgotpassword"
}, h(ForgotPassword, null))))), document.getElementById('app'));

export { M, T$1 as T, _extends as _, h, m$1 as m, p$1 as p, s$1 as s, useAuthContext as u, v$1 as v };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZTllMjY2NjUuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvY29tcGF0L2Rpc3QvY29tcGF0Lm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9odG0vZGlzdC9odG0ubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2h0bS9wcmVhY3QvaW5kZXgubW9kdWxlLmpzIiwiLi4vYXBwLWNvbnRleHQuanMiLCIuLi9hdXRoL2F1dGhSZWR1Y2VyLmpzIiwiLi4vYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi9yb3V0ZS9yb3V0ZS1jb250ZXh0LmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7dXNlU3RhdGUgYXMgbix1c2VSZWR1Y2VyIGFzIHQsdXNlRWZmZWN0IGFzIGUsdXNlTGF5b3V0RWZmZWN0IGFzIHIsdXNlUmVmIGFzIG8sdXNlSW1wZXJhdGl2ZUhhbmRsZSBhcyB1LHVzZU1lbW8gYXMgaSx1c2VDYWxsYmFjayBhcyBmLHVzZUNvbnRleHQgYXMgYyx1c2VEZWJ1Z1ZhbHVlIGFzIGF9ZnJvbVwicHJlYWN0L2hvb2tzXCI7ZXhwb3J0KmZyb21cInByZWFjdC9ob29rc1wiO2ltcG9ydHtDb21wb25lbnQgYXMgbCxjcmVhdGVFbGVtZW50IGFzIHMsb3B0aW9ucyBhcyB2LHRvQ2hpbGRBcnJheSBhcyBoLGh5ZHJhdGUgYXMgcCxyZW5kZXIgYXMgZCxfdW5tb3VudCBhcyBtLGNsb25lRWxlbWVudCBhcyB5LGNyZWF0ZVJlZiBhcyBiLGNyZWF0ZUNvbnRleHQgYXMgZyxGcmFnbWVudCBhcyB4fWZyb21cInByZWFjdFwiO2V4cG9ydHtjcmVhdGVFbGVtZW50LGNyZWF0ZUNvbnRleHQsY3JlYXRlUmVmLEZyYWdtZW50LENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtmdW5jdGlvbiBFKG4sdCl7Zm9yKHZhciBlIGluIHQpbltlXT10W2VdO3JldHVybiBufWZ1bmN0aW9uIHcobix0KXtmb3IodmFyIGUgaW4gbilpZihcIl9fc291cmNlXCIhPT1lJiYhKGUgaW4gdCkpcmV0dXJuITA7Zm9yKHZhciByIGluIHQpaWYoXCJfX3NvdXJjZVwiIT09ciYmbltyXSE9PXRbcl0pcmV0dXJuITA7cmV0dXJuITF9dmFyIEM9ZnVuY3Rpb24obil7dmFyIHQsZTtmdW5jdGlvbiByKHQpe3ZhciBlO3JldHVybihlPW4uY2FsbCh0aGlzLHQpfHx0aGlzKS5pc1B1cmVSZWFjdENvbXBvbmVudD0hMCxlfXJldHVybiBlPW4sKHQ9cikucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5fX3Byb3RvX189ZSxyLnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obix0KXtyZXR1cm4gdyh0aGlzLnByb3BzLG4pfHx3KHRoaXMuc3RhdGUsdCl9LHJ9KGwpO2Z1bmN0aW9uIF8obix0KXtmdW5jdGlvbiBlKG4pe3ZhciBlPXRoaXMucHJvcHMucmVmLHI9ZT09bi5yZWY7cmV0dXJuIXImJmUmJihlLmNhbGw/ZShudWxsKTplLmN1cnJlbnQ9bnVsbCksdD8hdCh0aGlzLnByb3BzLG4pfHwhcjp3KHRoaXMucHJvcHMsbil9ZnVuY3Rpb24gcih0KXtyZXR1cm4gdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZSxzKG4sRSh7fSx0KSl9cmV0dXJuIHIucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9ITAsci5kaXNwbGF5TmFtZT1cIk1lbW8oXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsci50PSEwLHJ9dmFyIEE9di5fX2I7ZnVuY3Rpb24gUyhuKXtmdW5jdGlvbiB0KHQpe3ZhciBlPUUoe30sdCk7cmV0dXJuIGRlbGV0ZSBlLnJlZixuKGUsdC5yZWYpfXJldHVybiB0LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXQudD0hMCx0LmRpc3BsYXlOYW1lPVwiRm9yd2FyZFJlZihcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIix0fXYuX19iPWZ1bmN0aW9uKG4pe24udHlwZSYmbi50eXBlLnQmJm4ucmVmJiYobi5wcm9wcy5yZWY9bi5yZWYsbi5yZWY9bnVsbCksQSYmQShuKX07dmFyIGs9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9oKG4pLnJlZHVjZShmdW5jdGlvbihuLGUscil7cmV0dXJuIG4uY29uY2F0KHQoZSxyKSl9LFtdKTpudWxsfSxSPXttYXA6ayxmb3JFYWNoOmssY291bnQ6ZnVuY3Rpb24obil7cmV0dXJuIG4/aChuKS5sZW5ndGg6MH0sb25seTpmdW5jdGlvbihuKXtpZigxIT09KG49aChuKSkubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNoaWxkcmVuLm9ubHkoKSBleHBlY3RzIG9ubHkgb25lIGNoaWxkLlwiKTtyZXR1cm4gblswXX0sdG9BcnJheTpofSxGPXYuX19lO2Z1bmN0aW9uIE4obil7cmV0dXJuIG4mJigobj1FKHt9LG4pKS5fX2M9bnVsbCxuLl9faz1uLl9fayYmbi5fX2subWFwKE4pKSxufWZ1bmN0aW9uIFUoKXt0aGlzLl9fdT0wLHRoaXMubz1udWxsLHRoaXMuX19iPW51bGx9ZnVuY3Rpb24gTShuKXt2YXIgdD1uLl9fLl9fYztyZXR1cm4gdCYmdC51JiZ0LnUobil9ZnVuY3Rpb24gTChuKXt2YXIgdCxlLHI7ZnVuY3Rpb24gbyhvKXtpZih0fHwodD1uKCkpLnRoZW4oZnVuY3Rpb24obil7ZT1uLmRlZmF1bHR8fG59LGZ1bmN0aW9uKG4pe3I9bn0pLHIpdGhyb3cgcjtpZighZSl0aHJvdyB0O3JldHVybiBzKGUsbyl9cmV0dXJuIG8uZGlzcGxheU5hbWU9XCJMYXp5XCIsby50PSEwLG99ZnVuY3Rpb24gTygpe3RoaXMuaT1udWxsLHRoaXMubD1udWxsfXYuX19lPWZ1bmN0aW9uKG4sdCxlKXtpZihuLnRoZW4pZm9yKHZhciByLG89dDtvPW8uX187KWlmKChyPW8uX19jKSYmci5fX2MpcmV0dXJuIHIuX19jKG4sdC5fX2MpO0Yobix0LGUpfSwoVS5wcm90b3R5cGU9bmV3IGwpLl9fYz1mdW5jdGlvbihuLHQpe3ZhciBlPXRoaXM7bnVsbD09ZS5vJiYoZS5vPVtdKSxlLm8ucHVzaCh0KTt2YXIgcj1NKGUuX192KSxvPSExLHU9ZnVuY3Rpb24oKXtvfHwobz0hMCxyP3IoaSk6aSgpKX07dC5fX2M9dC5jb21wb25lbnRXaWxsVW5tb3VudCx0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dSgpLHQuX19jJiZ0Ll9fYygpfTt2YXIgaT1mdW5jdGlvbigpe3ZhciBuO2lmKCEtLWUuX191KWZvcihlLl9fdi5fX2tbMF09ZS5zdGF0ZS51LGUuc2V0U3RhdGUoe3U6ZS5fX2I9bnVsbH0pO249ZS5vLnBvcCgpOyluLmZvcmNlVXBkYXRlKCl9O2UuX191Kyt8fGUuc2V0U3RhdGUoe3U6ZS5fX2I9ZS5fX3YuX19rWzBdfSksbi50aGVuKHUsdSl9LFUucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuLHQpe3JldHVybiB0aGlzLl9fYiYmKHRoaXMuX192Ll9fa1swXT1OKHRoaXMuX19iKSx0aGlzLl9fYj1udWxsKSxbcyhsLG51bGwsdC51P251bGw6bi5jaGlsZHJlbiksdC51JiZuLmZhbGxiYWNrXX07dmFyIFA9ZnVuY3Rpb24obix0LGUpe2lmKCsrZVsxXT09PWVbMF0mJm4ubC5kZWxldGUodCksbi5wcm9wcy5yZXZlYWxPcmRlciYmKFwidFwiIT09bi5wcm9wcy5yZXZlYWxPcmRlclswXXx8IW4ubC5zaXplKSlmb3IoZT1uLmk7ZTspe2Zvcig7ZS5sZW5ndGg+MzspZS5wb3AoKSgpO2lmKGVbMV08ZVswXSlicmVhaztuLmk9ZT1lWzJdfX07KE8ucHJvdG90eXBlPW5ldyBsKS51PWZ1bmN0aW9uKG4pe3ZhciB0PXRoaXMsZT1NKHQuX192KSxyPXQubC5nZXQobik7cmV0dXJuIHJbMF0rKyxmdW5jdGlvbihvKXt2YXIgdT1mdW5jdGlvbigpe3QucHJvcHMucmV2ZWFsT3JkZXI/KHIucHVzaChvKSxQKHQsbixyKSk6bygpfTtlP2UodSk6dSgpfX0sTy5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4pe3RoaXMuaT1udWxsLHRoaXMubD1uZXcgTWFwO3ZhciB0PWgobi5jaGlsZHJlbik7bi5yZXZlYWxPcmRlciYmXCJiXCI9PT1uLnJldmVhbE9yZGVyWzBdJiZ0LnJldmVyc2UoKTtmb3IodmFyIGU9dC5sZW5ndGg7ZS0tOyl0aGlzLmwuc2V0KHRbZV0sdGhpcy5pPVsxLDAsdGhpcy5pXSk7cmV0dXJuIG4uY2hpbGRyZW59LE8ucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZT1PLnByb3RvdHlwZS5jb21wb25lbnREaWRNb3VudD1mdW5jdGlvbigpe3ZhciBuPXRoaXM7bi5sLmZvckVhY2goZnVuY3Rpb24odCxlKXtQKG4sZSx0KX0pfTt2YXIgVz1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9dmFyIHQ9bi5wcm90b3R5cGU7cmV0dXJuIHQuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dH0sdC5yZW5kZXI9ZnVuY3Rpb24obil7cmV0dXJuIG4uY2hpbGRyZW59LG59KCk7ZnVuY3Rpb24gaihuKXt2YXIgdD10aGlzLGU9bi5jb250YWluZXIscj1zKFcse2NvbnRleHQ6dC5jb250ZXh0fSxuLnZub2RlKTtyZXR1cm4gdC5zJiZ0LnMhPT1lJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSx0LnA9ITEpLG4udm5vZGU/dC5wPyhlLl9faz10Ll9fayxkKHIsZSksdC5fX2s9ZS5fX2spOih0LnY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikscChcIlwiLGUpLGUuYXBwZW5kQ2hpbGQodC52KSx0LnA9ITAsdC5zPWUsZChyLGUsdC52KSx0Ll9faz10LnYuX19rKTp0LnAmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpKSx0Lmg9cix0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKX0sbnVsbH1mdW5jdGlvbiB6KG4sdCl7cmV0dXJuIHMoaix7dm5vZGU6bixjb250YWluZXI6dH0pfXZhciBEPS9eKD86YWNjZW50fGFsaWdubWVudHxhcmFiaWN8YmFzZWxpbmV8Y2FwfGNsaXAoPyFQYXRoVSl8Y29sb3J8ZmlsbHxmbG9vZHxmb250fGdseXBoKD8hUil8aG9yaXp8bWFya2VyKD8hSHxXfFUpfG92ZXJsaW5lfHBhaW50fHN0b3B8c3RyaWtldGhyb3VnaHxzdHJva2V8dGV4dCg/IUwpfHVuZGVybGluZXx1bmljb2RlfHVuaXRzfHZ8dmVjdG9yfHZlcnR8d29yZHx3cml0aW5nfHgoPyFDKSlbQS1aXS87bC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTt2YXIgSD1cInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yJiZTeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKXx8NjAxMDM7ZnVuY3Rpb24gVChuLHQsZSl7aWYobnVsbD09dC5fX2spZm9yKDt0LmZpcnN0Q2hpbGQ7KXQucmVtb3ZlQ2hpbGQodC5maXJzdENoaWxkKTtyZXR1cm4gZChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9ZnVuY3Rpb24gVihuLHQsZSl7cmV0dXJuIHAobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfXZhciBaPXYuZXZlbnQ7ZnVuY3Rpb24gSShuLHQpe25bXCJVTlNBRkVfXCIrdF0mJiFuW3RdJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobix0LHtjb25maWd1cmFibGU6ITEsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbXCJVTlNBRkVfXCIrdF19LHNldDpmdW5jdGlvbihuKXt0aGlzW1wiVU5TQUZFX1wiK3RdPW59fSl9di5ldmVudD1mdW5jdGlvbihuKXtaJiYobj1aKG4pKSxuLnBlcnNpc3Q9ZnVuY3Rpb24oKXt9O3ZhciB0PSExLGU9ITEscj1uLnN0b3BQcm9wYWdhdGlvbjtuLnN0b3BQcm9wYWdhdGlvbj1mdW5jdGlvbigpe3IuY2FsbChuKSx0PSEwfTt2YXIgbz1uLnByZXZlbnREZWZhdWx0O3JldHVybiBuLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7by5jYWxsKG4pLGU9ITB9LG4uaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sbi5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gZX0sbi5uYXRpdmVFdmVudD1ufTt2YXIgJD17Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNsYXNzfX0scT12LnZub2RlO3Yudm5vZGU9ZnVuY3Rpb24obil7bi4kJHR5cGVvZj1IO3ZhciB0PW4udHlwZSxlPW4ucHJvcHM7aWYodCl7aWYoZS5jbGFzcyE9ZS5jbGFzc05hbWUmJigkLmVudW1lcmFibGU9XCJjbGFzc05hbWVcImluIGUsbnVsbCE9ZS5jbGFzc05hbWUmJihlLmNsYXNzPWUuY2xhc3NOYW1lKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImNsYXNzTmFtZVwiLCQpKSxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXt2YXIgcixvLHU7Zm9yKHUgaW4gZS5kZWZhdWx0VmFsdWUmJnZvaWQgMCE9PWUudmFsdWUmJihlLnZhbHVlfHwwPT09ZS52YWx1ZXx8KGUudmFsdWU9ZS5kZWZhdWx0VmFsdWUpLGRlbGV0ZSBlLmRlZmF1bHRWYWx1ZSksQXJyYXkuaXNBcnJheShlLnZhbHVlKSYmZS5tdWx0aXBsZSYmXCJzZWxlY3RcIj09PXQmJihoKGUuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24obil7LTEhPWUudmFsdWUuaW5kZXhPZihuLnByb3BzLnZhbHVlKSYmKG4ucHJvcHMuc2VsZWN0ZWQ9ITApfSksZGVsZXRlIGUudmFsdWUpLGUpaWYocj1ELnRlc3QodSkpYnJlYWs7aWYocilmb3IodSBpbiBvPW4ucHJvcHM9e30sZSlvW0QudGVzdCh1KT91LnJlcGxhY2UoL1tBLVowLTldLyxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpOnVdPWVbdV19IWZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSxyPW4ucHJvcHM7aWYociYmXCJzdHJpbmdcIj09dHlwZW9mIGUpe3ZhciBvPXt9O2Zvcih2YXIgdSBpbiByKS9eb24oQW5pfFRyYXxUb3UpLy50ZXN0KHUpJiYoclt1LnRvTG93ZXJDYXNlKCldPXJbdV0sZGVsZXRlIHJbdV0pLG9bdS50b0xvd2VyQ2FzZSgpXT11O2lmKG8ub25kb3VibGVjbGljayYmKHIub25kYmxjbGljaz1yW28ub25kb3VibGVjbGlja10sZGVsZXRlIHJbby5vbmRvdWJsZWNsaWNrXSksby5vbmJlZm9yZWlucHV0JiYoci5vbmJlZm9yZWlucHV0PXJbby5vbmJlZm9yZWlucHV0XSxkZWxldGUgcltvLm9uYmVmb3JlaW5wdXRdKSxvLm9uY2hhbmdlJiYoXCJ0ZXh0YXJlYVwiPT09ZXx8XCJpbnB1dFwiPT09ZS50b0xvd2VyQ2FzZSgpJiYhL15maWx8Y2hlfHJhL2kudGVzdChyLnR5cGUpKSl7dmFyIGk9by5vbmlucHV0fHxcIm9uaW5wdXRcIjtyW2ldfHwocltpXT1yW28ub25jaGFuZ2VdLGRlbGV0ZSByW28ub25jaGFuZ2VdKX19fSgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJiF0Lm0mJnQucHJvdG90eXBlJiYoSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxNb3VudFwiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wc1wiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFVwZGF0ZVwiKSx0Lm09ITApfXEmJnEobil9O3ZhciBCPVwiMTYuOC4wXCI7ZnVuY3Rpb24gRyhuKXtyZXR1cm4gcy5iaW5kKG51bGwsbil9ZnVuY3Rpb24gSihuKXtyZXR1cm4hIW4mJm4uJCR0eXBlb2Y9PT1IfWZ1bmN0aW9uIEsobil7cmV0dXJuIEoobik/eS5hcHBseShudWxsLGFyZ3VtZW50cyk6bn1mdW5jdGlvbiBRKG4pe3JldHVybiEhbi5fX2smJihkKG51bGwsbiksITApfWZ1bmN0aW9uIFgobil7cmV0dXJuIG4mJihuLmJhc2V8fDE9PT1uLm5vZGVUeXBlJiZuKXx8bnVsbH12YXIgWT1mdW5jdGlvbihuLHQpe3JldHVybiBuKHQpfTtleHBvcnQgZGVmYXVsdHt1c2VTdGF0ZTpuLHVzZVJlZHVjZXI6dCx1c2VFZmZlY3Q6ZSx1c2VMYXlvdXRFZmZlY3Q6cix1c2VSZWY6byx1c2VJbXBlcmF0aXZlSGFuZGxlOnUsdXNlTWVtbzppLHVzZUNhbGxiYWNrOmYsdXNlQ29udGV4dDpjLHVzZURlYnVnVmFsdWU6YSx2ZXJzaW9uOlwiMTYuOC4wXCIsQ2hpbGRyZW46UixyZW5kZXI6VCxoeWRyYXRlOlQsdW5tb3VudENvbXBvbmVudEF0Tm9kZTpRLGNyZWF0ZVBvcnRhbDp6LGNyZWF0ZUVsZW1lbnQ6cyxjcmVhdGVDb250ZXh0OmcsY3JlYXRlRmFjdG9yeTpHLGNsb25lRWxlbWVudDpLLGNyZWF0ZVJlZjpiLEZyYWdtZW50OngsaXNWYWxpZEVsZW1lbnQ6SixmaW5kRE9NTm9kZTpYLENvbXBvbmVudDpsLFB1cmVDb21wb25lbnQ6QyxtZW1vOl8sZm9yd2FyZFJlZjpTLHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzOlksU3VzcGVuc2U6VSxTdXNwZW5zZUxpc3Q6TyxsYXp5Okx9O2V4cG9ydHtCIGFzIHZlcnNpb24sUiBhcyBDaGlsZHJlbixUIGFzIHJlbmRlcixWIGFzIGh5ZHJhdGUsUSBhcyB1bm1vdW50Q29tcG9uZW50QXROb2RlLHogYXMgY3JlYXRlUG9ydGFsLEcgYXMgY3JlYXRlRmFjdG9yeSxLIGFzIGNsb25lRWxlbWVudCxKIGFzIGlzVmFsaWRFbGVtZW50LFggYXMgZmluZERPTU5vZGUsQyBhcyBQdXJlQ29tcG9uZW50LF8gYXMgbWVtbyxTIGFzIGZvcndhcmRSZWYsWSBhcyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyxVIGFzIFN1c3BlbnNlLE8gYXMgU3VzcGVuc2VMaXN0LEwgYXMgbGF6eX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wYXQubW9kdWxlLmpzLm1hcFxuIiwidmFyIG49ZnVuY3Rpb24odCxzLHIsZSl7dmFyIHU7c1swXT0wO2Zvcih2YXIgaD0xO2g8cy5sZW5ndGg7aCsrKXt2YXIgcD1zW2grK10sYT1zW2hdPyhzWzBdfD1wPzE6MixyW3NbaCsrXV0pOnNbKytoXTszPT09cD9lWzBdPWE6ND09PXA/ZVsxXT1PYmplY3QuYXNzaWduKGVbMV18fHt9LGEpOjU9PT1wPyhlWzFdPWVbMV18fHt9KVtzWysraF1dPWE6Nj09PXA/ZVsxXVtzWysraF1dKz1hK1wiXCI6cD8odT10LmFwcGx5KGEsbih0LGEscixbXCJcIixudWxsXSkpLGUucHVzaCh1KSxhWzBdP3NbMF18PTI6KHNbaC0yXT0wLHNbaF09dSkpOmUucHVzaChhKX1yZXR1cm4gZX0sdD1uZXcgTWFwO2V4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHMpe3ZhciByPXQuZ2V0KHRoaXMpO3JldHVybiByfHwocj1uZXcgTWFwLHQuc2V0KHRoaXMscikpLChyPW4odGhpcyxyLmdldChzKXx8KHIuc2V0KHMscj1mdW5jdGlvbihuKXtmb3IodmFyIHQscyxyPTEsZT1cIlwiLHU9XCJcIixoPVswXSxwPWZ1bmN0aW9uKG4pezE9PT1yJiYobnx8KGU9ZS5yZXBsYWNlKC9eXFxzKlxcblxccyp8XFxzKlxcblxccyokL2csXCJcIikpKT9oLnB1c2goMCxuLGUpOjM9PT1yJiYobnx8ZSk/KGgucHVzaCgzLG4sZSkscj0yKToyPT09ciYmXCIuLi5cIj09PWUmJm4/aC5wdXNoKDQsbiwwKToyPT09ciYmZSYmIW4/aC5wdXNoKDUsMCwhMCxlKTpyPj01JiYoKGV8fCFuJiY1PT09cikmJihoLnB1c2gociwwLGUscykscj02KSxuJiYoaC5wdXNoKHIsbiwwLHMpLHI9NikpLGU9XCJcIn0sYT0wO2E8bi5sZW5ndGg7YSsrKXthJiYoMT09PXImJnAoKSxwKGEpKTtmb3IodmFyIGw9MDtsPG5bYV0ubGVuZ3RoO2wrKyl0PW5bYV1bbF0sMT09PXI/XCI8XCI9PT10PyhwKCksaD1baF0scj0zKTplKz10OjQ9PT1yP1wiLS1cIj09PWUmJlwiPlwiPT09dD8ocj0xLGU9XCJcIik6ZT10K2VbMF06dT90PT09dT91PVwiXCI6ZSs9dDonXCInPT09dHx8XCInXCI9PT10P3U9dDpcIj5cIj09PXQ/KHAoKSxyPTEpOnImJihcIj1cIj09PXQ/KHI9NSxzPWUsZT1cIlwiKTpcIi9cIj09PXQmJihyPDV8fFwiPlwiPT09blthXVtsKzFdKT8ocCgpLDM9PT1yJiYoaD1oWzBdKSxyPWgsKGg9aFswXSkucHVzaCgyLDAscikscj0wKTpcIiBcIj09PXR8fFwiXFx0XCI9PT10fHxcIlxcblwiPT09dHx8XCJcXHJcIj09PXQ/KHAoKSxyPTIpOmUrPXQpLDM9PT1yJiZcIiEtLVwiPT09ZSYmKHI9NCxoPWhbMF0pfXJldHVybiBwKCksaH0ocykpLHIpLGFyZ3VtZW50cyxbXSkpLmxlbmd0aD4xP3I6clswXX1cbiIsImltcG9ydHtoIGFzIHIsQ29tcG9uZW50IGFzIG8scmVuZGVyIGFzIHR9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2gscmVuZGVyLENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtpbXBvcnQgZSBmcm9tXCJodG1cIjt2YXIgbT1lLmJpbmQocik7ZXhwb3J0e20gYXMgaHRtbH07XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcblxuY29uc3QgQXBwQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gY291bnRSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgJ0lOQ1JFTUVOVCc6XG4gICAgICByZXR1cm4geyBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgYWN0aW9uIHR5cGUke2FjdGlvbi50eXBlfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVzZUFwcENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcbiAgfVxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XG4gIGNvbnN0IGluY3JlbWVudCA9ICgpID0+IGRpc3BhdGNoKHsgdHlwZTogJ0lOQ1JFTUVOVCcgfSk7XG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCwgaW5jcmVtZW50IH07XG59XG5cbmZ1bmN0aW9uIEFwcFByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihjb3VudFJlZHVjZXIsIHsgY291bnQ6IDAgfSk7XG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8QXBwQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG5leHBvcnQgeyBBcHBQcm92aWRlciwgdXNlQXBwQ29udGV4dCB9O1xuIiwiZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgZW1haWw6ICcnLFxuICBwYXNzd29yZDogJycsXG4gIHN1Y2Nlc3M6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgdXNlcm5hbWU6ICcnLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgY29uZmlybTogJycsXG4gIGN1cnJlbnQ6ICcnLFxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxuICB0b2tlbjogbnVsbCxcbiAgaXNMb2dnZWRJbjogZmFsc2UsXG4gIGlzUGFzc3dvcmRDaGFuZ2VkOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRoUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgW2FjdGlvbi5wYXlsb2FkLnByb3BOYW1lXTogYWN0aW9uLnBheWxvYWQudmFsdWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUsICcsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZScsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgaXNQYXNzd29yZENoYW5nZWQ6IHRydWUsXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHknLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIHN1Y2Nlc3M6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gdXNlQXV0aENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xuICB9XG5cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xuXG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZSxcbiAgICBkaXNwYXRjaCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG5cbmV4cG9ydCB7IHVzZUF1dGhDb250ZXh0LCBBdXRoUHJvdmlkZXIgfTtcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5cbmNvbnN0IFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3QgeyBsb2NhdGlvbiB9ID0gc3RhdGU7XG5cbiAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lID09PSBwYXRoKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xuICBjb25zdCB7IHRvIH0gPSBwcm9wcztcbiAgY29uc3QgeyBzdGF0ZSwgcHVzaCB9ID0gdXNlUm91dGVDb250ZXh0KCk7XG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcHVzaCh0byk7XG4gIH1cbiAgcmV0dXJuIDxhIHsuLi5wcm9wc30gaHJlZj17dG99IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSAvPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVJvdXRlQ29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoUm91dGVDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggUm91dGVQcm92aWRlcicpO1xuICB9XG4gIGNvbnN0IFtzdGF0ZSwgcHVzaF0gPSBjb250ZXh0O1xuXG4gIHJldHVybiB7IHN0YXRlLCBwdXNoIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoeyBsb2NhdGlvbjogd2luZG93LmxvY2F0aW9uIH0pO1xuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIHB1c2hdLCBbc3RhdGUsIHB1c2hdKTtcblxuICBmdW5jdGlvbiBwdXNoKHVybCkge1xuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCB1cmwpO1xuICAgIHNldFN0YXRlKChwcmV2KSA9PiAoeyAuLi5wcmV2LCBsb2NhdGlvbjogd2luZG93LmxvY2F0aW9uIH0pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVBvcFN0YXRlKCkge1xuICAgIHNldFN0YXRlKChwcmV2KSA9PiAoeyAuLi5wcmV2LCBsb2NhdGlvbjogd2luZG93LmxvY2F0aW9uIH0pKTtcbiAgfVxuIFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgaGFuZGxlUG9wU3RhdGUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBoYW5kbGVQb3BTdGF0ZSk7XG4gICAgfTtcbiAgfSwgW10pO1xuICByZXR1cm4gPFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCB7IGh0bWwgfSBmcm9tICdodG0vcHJlYWN0JztcbmltcG9ydCBUZXN0Q29tcG9uZW50IGZyb20gJy4vVGVzdENvbXBvbmVudCc7XG5pbXBvcnQgeyBBcHBQcm92aWRlciB9IGZyb20gJy4vYXBwLWNvbnRleHQnO1xuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCBSb3V0ZSwgTGluayB9IGZyb20gJy4vcm91dGUvcm91dGUtY29udGV4dCc7XG4vLyBpbXBvcnQgTG9naW4gZnJvbSAnLi9hdXRoL0xvZ2luJztcbi8vIGltcG9ydCBTaWdudXAgZnJvbSAnLi9hdXRoL1NpZ251cCc7XG4vLyBpbXBvcnQgRm9yZ290UGFzc3dvcmQgZnJvbSAnLi9hdXRoL0ZvcmdvdFBhc3N3b3JkJztcbi8vIGltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICcuL2F1dGgvQ2hhbmdlUGFzc3dvcmQnO1xuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL0xvZ2luJykpO1xuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL0NoYW5nZVBhc3N3b3JkJykpO1xuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL0ZvcmdvdFBhc3N3b3JkJykpO1xuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vYXV0aC9TaWdudXAnKSk7XG5cbnJlbmRlcihcbiAgPEFwcFByb3ZpZGVyPlxuICAgIDxBdXRoUHJvdmlkZXI+XG4gICAgICA8Um91dGVQcm92aWRlcj5cbiAgICAgICAgPExpbmsgdG89XCIvY2hhbmdlcGFzc3dvcmRcIj5DaGFuZ2VQYXNzd29yZDwvTGluaz5cbiAgICAgICAgPExpbmsgdG89XCIvbG9naW5cIj5Mb2dpbjwvTGluaz5cbiAgICAgICAgPExpbmsgdG89XCIvc2lnbnVwXCI+U2lnbnVwPC9MaW5rPlxuICAgICAgICA8TGluayB0bz1cIi9mb3Jnb3RwYXNzd29yZFwiPkZvcmdvdFBhc3N3b3JkPC9MaW5rPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9jaGFuZ2VwYXNzd29yZFwiPlxuICAgICAgICAgIDxTdXNwZW5zZSBmYWxsPlxuICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCAvPlxuICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgXG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiL2xvZ2luXCI+XG4gICAgICAgICAgPExvZ2luIC8+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiL3NpZ251cFwiPlxuICAgICAgICAgIDxTaWdudXAgLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvZm9yZ290cGFzc3dvcmRcIj5cbiAgICAgICAgICA8Rm9yZ290UGFzc3dvcmQgLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgIDwvUm91dGVQcm92aWRlcj5cbiAgICA8L0F1dGhQcm92aWRlcj5cbiAgPC9BcHBQcm92aWRlcj4sXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKVxuKTtcbiJdLCJuYW1lcyI6WyJFTVBUWV9PQkoiLCJFTVBUWV9BUlIiLCJJU19OT05fRElNRU5TSU9OQUwiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50Q29tcG9uZW50IiwicHJldlJhZiIsImFmdGVyUGFpbnRFZmZlY3RzIiwib2xkQmVmb3JlUmVuZGVyIiwib3B0aW9ucyIsIl9yZW5kZXIiLCJvbGRBZnRlckRpZmYiLCJkaWZmZWQiLCJvbGRDb21taXQiLCJfY29tbWl0Iiwib2xkQmVmb3JlVW5tb3VudCIsInVubW91bnQiLCJnZXRIb29rU3RhdGUiLCJpbmRleCIsIl9ob29rIiwiaG9va3MiLCJfX2hvb2tzIiwiX2xpc3QiLCJfcGVuZGluZ0VmZmVjdHMiLCJsZW5ndGgiLCJwdXNoIiwidXNlU3RhdGUiLCJpbml0aWFsU3RhdGUiLCJ1c2VSZWR1Y2VyIiwiaW52b2tlT3JSZXR1cm4iLCJyZWR1Y2VyIiwiaW5pdCIsImhvb2tTdGF0ZSIsIl9jb21wb25lbnQiLCJfdmFsdWUiLCJ1bmRlZmluZWQiLCJuZXh0VmFsdWUiLCJhY3Rpb24iLCJzZXRTdGF0ZSIsInVzZUVmZmVjdCIsImNhbGxiYWNrIiwiYXJncyIsInN0YXRlIiwiYXJnc0NoYW5nZWQiLCJfYXJncyIsInVzZU1lbW8iLCJmYWN0b3J5IiwiX2ZhY3RvcnkiLCJ1c2VDb250ZXh0IiwiY29udGV4dCIsInByb3ZpZGVyIiwiX2lkIiwiX2RlZmF1bHRWYWx1ZSIsInN1YiIsInByb3BzIiwidmFsdWUiLCJmbHVzaEFmdGVyUGFpbnRFZmZlY3RzIiwic29tZSIsImNvbXBvbmVudCIsIl9wYXJlbnREb20iLCJmb3JFYWNoIiwiaW52b2tlQ2xlYW51cCIsImludm9rZUVmZmVjdCIsImUiLCJfY2F0Y2hFcnJvciIsIl92bm9kZSIsImhvb2siLCJfY2xlYW51cCIsInJlc3VsdCIsIm9sZEFyZ3MiLCJuZXdBcmdzIiwiYXJnIiwiZiIsInZub2RlIiwiYyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInJhZiIsImRvbmUiLCJjbGVhclRpbWVvdXQiLCJ0aW1lb3V0IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJzZXRUaW1lb3V0Iiwid2luZG93IiwiY29tbWl0UXVldWUiLCJfcmVuZGVyQ2FsbGJhY2tzIiwiZmlsdGVyIiwiY2IiLCJhc3NpZ24iLCJvYmoiLCJpIiwic2hhbGxvd0RpZmZlcnMiLCJhIiwiYiIsIm4iLCJ0IiwicyIsInIiLCJ1IiwiaCIsInAiLCJPYmplY3QiLCJhcHBseSIsIk1hcCIsImdldCIsInNldCIsInJlcGxhY2UiLCJsIiwiYXJndW1lbnRzIiwibSIsImJpbmQiLCJBcHBDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsImNvdW50UmVkdWNlciIsInR5cGUiLCJjb3VudCIsIkVycm9yIiwiQXBwUHJvdmlkZXIiLCJkaXNwYXRjaCIsImluaXRTdGF0ZSIsImVtYWlsIiwicGFzc3dvcmQiLCJzdWNjZXNzIiwiZXJyb3IiLCJ1c2VybmFtZSIsImxvYWRpbmciLCJjb25maXJtIiwiY3VycmVudCIsImVtYWlsb3J1c2VybmFtZSIsInRva2VuIiwiaXNMb2dnZWRJbiIsImlzUGFzc3dvcmRDaGFuZ2VkIiwiYXV0aFJlZHVjZXIiLCJhY3Rpb25UeXBlcyIsIlZBTFVFX0NIQU5HRUQiLCJwYXlsb2FkIiwicHJvcE5hbWUiLCJMT0dJTl9TVEFSVEVEIiwiTE9HSU5fU1VDQ0VTUyIsInN1Y2Nlc3NNZXNzYWdlIiwiTE9HSU5fRkFJTEVEIiwiU0lHTlVQX1NUQVJURUQiLCJTSUdOVVBfU1VDQ0VTUyIsIlNJR05VUF9GQUlMRUQiLCJDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCIsIkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTIiwiQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyIsIlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEIiwiR09UX1RPS0VOX0ZST01fVVJMIiwiQXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsIkF1dGhQcm92aWRlciIsIlJvdXRlQ29udGV4dCIsIlJvdXRlIiwiY2hpbGRyZW4iLCJwYXRoIiwidXNlUm91dGVDb250ZXh0IiwibG9jYXRpb24iLCJwYXRobmFtZSIsIkxpbmsiLCJ0byIsImhhbmRsZUNsaWNrIiwicHJldmVudERlZmF1bHQiLCJSb3V0ZVByb3ZpZGVyIiwidXJsIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInByZXYiLCJoYW5kbGVQb3BTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiTG9naW4iLCJsYXp5IiwiQ2hhbmdlUGFzc3dvcmQiLCJGb3Jnb3RQYXNzd29yZCIsIlNpZ251cCIsInJlbmRlciIsIlN1c3BlbnNlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6IktBQU87QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxJQUFNQSxDQUFBQSxHQUFZLEVBQWxCO0FBQUEsSUFDTUMsQ0FBQUEsR0FBWSxFQURsQjtBQUFBLElBRU1DLENBQUFBLEdBQXFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0NsQyxJQUFJQyxHQUFKO0FBQUEsSUFHSUMsR0FISjtBQUFBLElBY0lDLEdBZEo7QUFBQSxJQU1JQyxHQUFBQSxHQUFvQixFQU54QjtBQUFBLElBUUlDLEdBQUFBLEdBQWtCQyxDQUFBQSxDQUFRQyxHQVI5QjtBQUFBLElBU0lDLEdBQUFBLEdBQWVGLENBQUFBLENB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
