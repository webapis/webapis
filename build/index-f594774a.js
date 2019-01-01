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

// import Signup from './auth/Signup';
// import ForgotPassword from './auth/ForgotPassword';
// import ChangePassword from './auth/ChangePassword';

const Login = L(() => import('./Login-520a12ac.js'));
const ChangePassword = L(() => import('./ChangePassword-5a313c2a.js'));
const ForgotPassword = L(() => import('./ForgotPassword-1fae60d5.js'));
const Signup = L(() => import('./Signup-cc678589.js'));
H(h(AppProvider, null, h(AuthProvider, null, h(RouteProvider, null, h(Link, {
  to: "/changepassword"
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
}, h(ForgotPassword, null))))), document.getElementById('app'));

export { M, T$1 as T, _extends as _, h, m$1 as m, p$1 as p, s$1 as s, useAuthContext as u, v$1 as v };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZjU5NDc3NGEuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9ob29rcy9kaXN0L2hvb2tzLm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvY29tcGF0L2Rpc3QvY29tcGF0Lm1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9odG0vZGlzdC9odG0ubW9kdWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2h0bS9wcmVhY3QvaW5kZXgubW9kdWxlLmpzIiwiLi4vYXBwLWNvbnRleHQuanMiLCIuLi9hdXRoL2F1dGhSZWR1Y2VyLmpzIiwiLi4vYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi9yb3V0ZS9yb3V0ZS1jb250ZXh0LmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7dXNlU3RhdGUgYXMgbix1c2VSZWR1Y2VyIGFzIHQsdXNlRWZmZWN0IGFzIGUsdXNlTGF5b3V0RWZmZWN0IGFzIHIsdXNlUmVmIGFzIG8sdXNlSW1wZXJhdGl2ZUhhbmRsZSBhcyB1LHVzZU1lbW8gYXMgaSx1c2VDYWxsYmFjayBhcyBmLHVzZUNvbnRleHQgYXMgYyx1c2VEZWJ1Z1ZhbHVlIGFzIGF9ZnJvbVwicHJlYWN0L2hvb2tzXCI7ZXhwb3J0KmZyb21cInByZWFjdC9ob29rc1wiO2ltcG9ydHtDb21wb25lbnQgYXMgbCxjcmVhdGVFbGVtZW50IGFzIHMsb3B0aW9ucyBhcyB2LHRvQ2hpbGRBcnJheSBhcyBoLGh5ZHJhdGUgYXMgcCxyZW5kZXIgYXMgZCxfdW5tb3VudCBhcyBtLGNsb25lRWxlbWVudCBhcyB5LGNyZWF0ZVJlZiBhcyBiLGNyZWF0ZUNvbnRleHQgYXMgZyxGcmFnbWVudCBhcyB4fWZyb21cInByZWFjdFwiO2V4cG9ydHtjcmVhdGVFbGVtZW50LGNyZWF0ZUNvbnRleHQsY3JlYXRlUmVmLEZyYWdtZW50LENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtmdW5jdGlvbiBFKG4sdCl7Zm9yKHZhciBlIGluIHQpbltlXT10W2VdO3JldHVybiBufWZ1bmN0aW9uIHcobix0KXtmb3IodmFyIGUgaW4gbilpZihcIl9fc291cmNlXCIhPT1lJiYhKGUgaW4gdCkpcmV0dXJuITA7Zm9yKHZhciByIGluIHQpaWYoXCJfX3NvdXJjZVwiIT09ciYmbltyXSE9PXRbcl0pcmV0dXJuITA7cmV0dXJuITF9dmFyIEM9ZnVuY3Rpb24obil7dmFyIHQsZTtmdW5jdGlvbiByKHQpe3ZhciBlO3JldHVybihlPW4uY2FsbCh0aGlzLHQpfHx0aGlzKS5pc1B1cmVSZWFjdENvbXBvbmVudD0hMCxlfXJldHVybiBlPW4sKHQ9cikucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5fX3Byb3RvX189ZSxyLnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obix0KXtyZXR1cm4gdyh0aGlzLnByb3BzLG4pfHx3KHRoaXMuc3RhdGUsdCl9LHJ9KGwpO2Z1bmN0aW9uIF8obix0KXtmdW5jdGlvbiBlKG4pe3ZhciBlPXRoaXMucHJvcHMucmVmLHI9ZT09bi5yZWY7cmV0dXJuIXImJmUmJihlLmNhbGw/ZShudWxsKTplLmN1cnJlbnQ9bnVsbCksdD8hdCh0aGlzLnByb3BzLG4pfHwhcjp3KHRoaXMucHJvcHMsbil9ZnVuY3Rpb24gcih0KXtyZXR1cm4gdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZSxzKG4sRSh7fSx0KSl9cmV0dXJuIHIucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9ITAsci5kaXNwbGF5TmFtZT1cIk1lbW8oXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsci50PSEwLHJ9dmFyIEE9di5fX2I7ZnVuY3Rpb24gUyhuKXtmdW5jdGlvbiB0KHQpe3ZhciBlPUUoe30sdCk7cmV0dXJuIGRlbGV0ZSBlLnJlZixuKGUsdC5yZWYpfXJldHVybiB0LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXQudD0hMCx0LmRpc3BsYXlOYW1lPVwiRm9yd2FyZFJlZihcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIix0fXYuX19iPWZ1bmN0aW9uKG4pe24udHlwZSYmbi50eXBlLnQmJm4ucmVmJiYobi5wcm9wcy5yZWY9bi5yZWYsbi5yZWY9bnVsbCksQSYmQShuKX07dmFyIGs9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9oKG4pLnJlZHVjZShmdW5jdGlvbihuLGUscil7cmV0dXJuIG4uY29uY2F0KHQoZSxyKSl9LFtdKTpudWxsfSxSPXttYXA6ayxmb3JFYWNoOmssY291bnQ6ZnVuY3Rpb24obil7cmV0dXJuIG4/aChuKS5sZW5ndGg6MH0sb25seTpmdW5jdGlvbihuKXtpZigxIT09KG49aChuKSkubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNoaWxkcmVuLm9ubHkoKSBleHBlY3RzIG9ubHkgb25lIGNoaWxkLlwiKTtyZXR1cm4gblswXX0sdG9BcnJheTpofSxGPXYuX19lO2Z1bmN0aW9uIE4obil7cmV0dXJuIG4mJigobj1FKHt9LG4pKS5fX2M9bnVsbCxuLl9faz1uLl9fayYmbi5fX2subWFwKE4pKSxufWZ1bmN0aW9uIFUoKXt0aGlzLl9fdT0wLHRoaXMubz1udWxsLHRoaXMuX19iPW51bGx9ZnVuY3Rpb24gTShuKXt2YXIgdD1uLl9fLl9fYztyZXR1cm4gdCYmdC51JiZ0LnUobil9ZnVuY3Rpb24gTChuKXt2YXIgdCxlLHI7ZnVuY3Rpb24gbyhvKXtpZih0fHwodD1uKCkpLnRoZW4oZnVuY3Rpb24obil7ZT1uLmRlZmF1bHR8fG59LGZ1bmN0aW9uKG4pe3I9bn0pLHIpdGhyb3cgcjtpZighZSl0aHJvdyB0O3JldHVybiBzKGUsbyl9cmV0dXJuIG8uZGlzcGxheU5hbWU9XCJMYXp5XCIsby50PSEwLG99ZnVuY3Rpb24gTygpe3RoaXMuaT1udWxsLHRoaXMubD1udWxsfXYuX19lPWZ1bmN0aW9uKG4sdCxlKXtpZihuLnRoZW4pZm9yKHZhciByLG89dDtvPW8uX187KWlmKChyPW8uX19jKSYmci5fX2MpcmV0dXJuIHIuX19jKG4sdC5fX2MpO0Yobix0LGUpfSwoVS5wcm90b3R5cGU9bmV3IGwpLl9fYz1mdW5jdGlvbihuLHQpe3ZhciBlPXRoaXM7bnVsbD09ZS5vJiYoZS5vPVtdKSxlLm8ucHVzaCh0KTt2YXIgcj1NKGUuX192KSxvPSExLHU9ZnVuY3Rpb24oKXtvfHwobz0hMCxyP3IoaSk6aSgpKX07dC5fX2M9dC5jb21wb25lbnRXaWxsVW5tb3VudCx0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dSgpLHQuX19jJiZ0Ll9fYygpfTt2YXIgaT1mdW5jdGlvbigpe3ZhciBuO2lmKCEtLWUuX191KWZvcihlLl9fdi5fX2tbMF09ZS5zdGF0ZS51LGUuc2V0U3RhdGUoe3U6ZS5fX2I9bnVsbH0pO249ZS5vLnBvcCgpOyluLmZvcmNlVXBkYXRlKCl9O2UuX191Kyt8fGUuc2V0U3RhdGUoe3U6ZS5fX2I9ZS5fX3YuX19rWzBdfSksbi50aGVuKHUsdSl9LFUucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuLHQpe3JldHVybiB0aGlzLl9fYiYmKHRoaXMuX192Ll9fa1swXT1OKHRoaXMuX19iKSx0aGlzLl9fYj1udWxsKSxbcyhsLG51bGwsdC51P251bGw6bi5jaGlsZHJlbiksdC51JiZuLmZhbGxiYWNrXX07dmFyIFA9ZnVuY3Rpb24obix0LGUpe2lmKCsrZVsxXT09PWVbMF0mJm4ubC5kZWxldGUodCksbi5wcm9wcy5yZXZlYWxPcmRlciYmKFwidFwiIT09bi5wcm9wcy5yZXZlYWxPcmRlclswXXx8IW4ubC5zaXplKSlmb3IoZT1uLmk7ZTspe2Zvcig7ZS5sZW5ndGg+MzspZS5wb3AoKSgpO2lmKGVbMV08ZVswXSlicmVhaztuLmk9ZT1lWzJdfX07KE8ucHJvdG90eXBlPW5ldyBsKS51PWZ1bmN0aW9uKG4pe3ZhciB0PXRoaXMsZT1NKHQuX192KSxyPXQubC5nZXQobik7cmV0dXJuIHJbMF0rKyxmdW5jdGlvbihvKXt2YXIgdT1mdW5jdGlvbigpe3QucHJvcHMucmV2ZWFsT3JkZXI/KHIucHVzaChvKSxQKHQsbixyKSk6bygpfTtlP2UodSk6dSgpfX0sTy5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4pe3RoaXMuaT1udWxsLHRoaXMubD1uZXcgTWFwO3ZhciB0PWgobi5jaGlsZHJlbik7bi5yZXZlYWxPcmRlciYmXCJiXCI9PT1uLnJldmVhbE9yZGVyWzBdJiZ0LnJldmVyc2UoKTtmb3IodmFyIGU9dC5sZW5ndGg7ZS0tOyl0aGlzLmwuc2V0KHRbZV0sdGhpcy5pPVsxLDAsdGhpcy5pXSk7cmV0dXJuIG4uY2hpbGRyZW59LE8ucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZT1PLnByb3RvdHlwZS5jb21wb25lbnREaWRNb3VudD1mdW5jdGlvbigpe3ZhciBuPXRoaXM7bi5sLmZvckVhY2goZnVuY3Rpb24odCxlKXtQKG4sZSx0KX0pfTt2YXIgVz1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9dmFyIHQ9bi5wcm90b3R5cGU7cmV0dXJuIHQuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dH0sdC5yZW5kZXI9ZnVuY3Rpb24obil7cmV0dXJuIG4uY2hpbGRyZW59LG59KCk7ZnVuY3Rpb24gaihuKXt2YXIgdD10aGlzLGU9bi5jb250YWluZXIscj1zKFcse2NvbnRleHQ6dC5jb250ZXh0fSxuLnZub2RlKTtyZXR1cm4gdC5zJiZ0LnMhPT1lJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSx0LnA9ITEpLG4udm5vZGU/dC5wPyhlLl9faz10Ll9fayxkKHIsZSksdC5fX2s9ZS5fX2spOih0LnY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikscChcIlwiLGUpLGUuYXBwZW5kQ2hpbGQodC52KSx0LnA9ITAsdC5zPWUsZChyLGUsdC52KSx0Ll9faz10LnYuX19rKTp0LnAmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpKSx0Lmg9cix0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKX0sbnVsbH1mdW5jdGlvbiB6KG4sdCl7cmV0dXJuIHMoaix7dm5vZGU6bixjb250YWluZXI6dH0pfXZhciBEPS9eKD86YWNjZW50fGFsaWdubWVudHxhcmFiaWN8YmFzZWxpbmV8Y2FwfGNsaXAoPyFQYXRoVSl8Y29sb3J8ZmlsbHxmbG9vZHxmb250fGdseXBoKD8hUil8aG9yaXp8bWFya2VyKD8hSHxXfFUpfG92ZXJsaW5lfHBhaW50fHN0b3B8c3RyaWtldGhyb3VnaHxzdHJva2V8dGV4dCg/IUwpfHVuZGVybGluZXx1bmljb2RlfHVuaXRzfHZ8dmVjdG9yfHZlcnR8d29yZHx3cml0aW5nfHgoPyFDKSlbQS1aXS87bC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTt2YXIgSD1cInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yJiZTeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKXx8NjAxMDM7ZnVuY3Rpb24gVChuLHQsZSl7aWYobnVsbD09dC5fX2spZm9yKDt0LmZpcnN0Q2hpbGQ7KXQucmVtb3ZlQ2hpbGQodC5maXJzdENoaWxkKTtyZXR1cm4gZChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9ZnVuY3Rpb24gVihuLHQsZSl7cmV0dXJuIHAobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfXZhciBaPXYuZXZlbnQ7ZnVuY3Rpb24gSShuLHQpe25bXCJVTlNBRkVfXCIrdF0mJiFuW3RdJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobix0LHtjb25maWd1cmFibGU6ITEsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbXCJVTlNBRkVfXCIrdF19LHNldDpmdW5jdGlvbihuKXt0aGlzW1wiVU5TQUZFX1wiK3RdPW59fSl9di5ldmVudD1mdW5jdGlvbihuKXtaJiYobj1aKG4pKSxuLnBlcnNpc3Q9ZnVuY3Rpb24oKXt9O3ZhciB0PSExLGU9ITEscj1uLnN0b3BQcm9wYWdhdGlvbjtuLnN0b3BQcm9wYWdhdGlvbj1mdW5jdGlvbigpe3IuY2FsbChuKSx0PSEwfTt2YXIgbz1uLnByZXZlbnREZWZhdWx0O3JldHVybiBuLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7by5jYWxsKG4pLGU9ITB9LG4uaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sbi5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gZX0sbi5uYXRpdmVFdmVudD1ufTt2YXIgJD17Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNsYXNzfX0scT12LnZub2RlO3Yudm5vZGU9ZnVuY3Rpb24obil7bi4kJHR5cGVvZj1IO3ZhciB0PW4udHlwZSxlPW4ucHJvcHM7aWYodCl7aWYoZS5jbGFzcyE9ZS5jbGFzc05hbWUmJigkLmVudW1lcmFibGU9XCJjbGFzc05hbWVcImluIGUsbnVsbCE9ZS5jbGFzc05hbWUmJihlLmNsYXNzPWUuY2xhc3NOYW1lKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImNsYXNzTmFtZVwiLCQpKSxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXt2YXIgcixvLHU7Zm9yKHUgaW4gZS5kZWZhdWx0VmFsdWUmJnZvaWQgMCE9PWUudmFsdWUmJihlLnZhbHVlfHwwPT09ZS52YWx1ZXx8KGUudmFsdWU9ZS5kZWZhdWx0VmFsdWUpLGRlbGV0ZSBlLmRlZmF1bHRWYWx1ZSksQXJyYXkuaXNBcnJheShlLnZhbHVlKSYmZS5tdWx0aXBsZSYmXCJzZWxlY3RcIj09PXQmJihoKGUuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24obil7LTEhPWUudmFsdWUuaW5kZXhPZihuLnByb3BzLnZhbHVlKSYmKG4ucHJvcHMuc2VsZWN0ZWQ9ITApfSksZGVsZXRlIGUudmFsdWUpLGUpaWYocj1ELnRlc3QodSkpYnJlYWs7aWYocilmb3IodSBpbiBvPW4ucHJvcHM9e30sZSlvW0QudGVzdCh1KT91LnJlcGxhY2UoL1tBLVowLTldLyxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpOnVdPWVbdV19IWZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSxyPW4ucHJvcHM7aWYociYmXCJzdHJpbmdcIj09dHlwZW9mIGUpe3ZhciBvPXt9O2Zvcih2YXIgdSBpbiByKS9eb24oQW5pfFRyYXxUb3UpLy50ZXN0KHUpJiYoclt1LnRvTG93ZXJDYXNlKCldPXJbdV0sZGVsZXRlIHJbdV0pLG9bdS50b0xvd2VyQ2FzZSgpXT11O2lmKG8ub25kb3VibGVjbGljayYmKHIub25kYmxjbGljaz1yW28ub25kb3VibGVjbGlja10sZGVsZXRlIHJbby5vbmRvdWJsZWNsaWNrXSksby5vbmJlZm9yZWlucHV0JiYoci5vbmJlZm9yZWlucHV0PXJbby5vbmJlZm9yZWlucHV0XSxkZWxldGUgcltvLm9uYmVmb3JlaW5wdXRdKSxvLm9uY2hhbmdlJiYoXCJ0ZXh0YXJlYVwiPT09ZXx8XCJpbnB1dFwiPT09ZS50b0xvd2VyQ2FzZSgpJiYhL15maWx8Y2hlfHJhL2kudGVzdChyLnR5cGUpKSl7dmFyIGk9by5vbmlucHV0fHxcIm9uaW5wdXRcIjtyW2ldfHwocltpXT1yW28ub25jaGFuZ2VdLGRlbGV0ZSByW28ub25jaGFuZ2VdKX19fSgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJiF0Lm0mJnQucHJvdG90eXBlJiYoSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxNb3VudFwiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wc1wiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFVwZGF0ZVwiKSx0Lm09ITApfXEmJnEobil9O3ZhciBCPVwiMTYuOC4wXCI7ZnVuY3Rpb24gRyhuKXtyZXR1cm4gcy5iaW5kKG51bGwsbil9ZnVuY3Rpb24gSihuKXtyZXR1cm4hIW4mJm4uJCR0eXBlb2Y9PT1IfWZ1bmN0aW9uIEsobil7cmV0dXJuIEoobik/eS5hcHBseShudWxsLGFyZ3VtZW50cyk6bn1mdW5jdGlvbiBRKG4pe3JldHVybiEhbi5fX2smJihkKG51bGwsbiksITApfWZ1bmN0aW9uIFgobil7cmV0dXJuIG4mJihuLmJhc2V8fDE9PT1uLm5vZGVUeXBlJiZuKXx8bnVsbH12YXIgWT1mdW5jdGlvbihuLHQpe3JldHVybiBuKHQpfTtleHBvcnQgZGVmYXVsdHt1c2VTdGF0ZTpuLHVzZVJlZHVjZXI6dCx1c2VFZmZlY3Q6ZSx1c2VMYXlvdXRFZmZlY3Q6cix1c2VSZWY6byx1c2VJbXBlcmF0aXZlSGFuZGxlOnUsdXNlTWVtbzppLHVzZUNhbGxiYWNrOmYsdXNlQ29udGV4dDpjLHVzZURlYnVnVmFsdWU6YSx2ZXJzaW9uOlwiMTYuOC4wXCIsQ2hpbGRyZW46UixyZW5kZXI6VCxoeWRyYXRlOlQsdW5tb3VudENvbXBvbmVudEF0Tm9kZTpRLGNyZWF0ZVBvcnRhbDp6LGNyZWF0ZUVsZW1lbnQ6cyxjcmVhdGVDb250ZXh0OmcsY3JlYXRlRmFjdG9yeTpHLGNsb25lRWxlbWVudDpLLGNyZWF0ZVJlZjpiLEZyYWdtZW50OngsaXNWYWxpZEVsZW1lbnQ6SixmaW5kRE9NTm9kZTpYLENvbXBvbmVudDpsLFB1cmVDb21wb25lbnQ6QyxtZW1vOl8sZm9yd2FyZFJlZjpTLHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzOlksU3VzcGVuc2U6VSxTdXNwZW5zZUxpc3Q6TyxsYXp5Okx9O2V4cG9ydHtCIGFzIHZlcnNpb24sUiBhcyBDaGlsZHJlbixUIGFzIHJlbmRlcixWIGFzIGh5ZHJhdGUsUSBhcyB1bm1vdW50Q29tcG9uZW50QXROb2RlLHogYXMgY3JlYXRlUG9ydGFsLEcgYXMgY3JlYXRlRmFjdG9yeSxLIGFzIGNsb25lRWxlbWVudCxKIGFzIGlzVmFsaWRFbGVtZW50LFggYXMgZmluZERPTU5vZGUsQyBhcyBQdXJlQ29tcG9uZW50LF8gYXMgbWVtbyxTIGFzIGZvcndhcmRSZWYsWSBhcyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyxVIGFzIFN1c3BlbnNlLE8gYXMgU3VzcGVuc2VMaXN0LEwgYXMgbGF6eX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wYXQubW9kdWxlLmpzLm1hcFxuIiwidmFyIG49ZnVuY3Rpb24odCxzLHIsZSl7dmFyIHU7c1swXT0wO2Zvcih2YXIgaD0xO2g8cy5sZW5ndGg7aCsrKXt2YXIgcD1zW2grK10sYT1zW2hdPyhzWzBdfD1wPzE6MixyW3NbaCsrXV0pOnNbKytoXTszPT09cD9lWzBdPWE6ND09PXA/ZVsxXT1PYmplY3QuYXNzaWduKGVbMV18fHt9LGEpOjU9PT1wPyhlWzFdPWVbMV18fHt9KVtzWysraF1dPWE6Nj09PXA/ZVsxXVtzWysraF1dKz1hK1wiXCI6cD8odT10LmFwcGx5KGEsbih0LGEscixbXCJcIixudWxsXSkpLGUucHVzaCh1KSxhWzBdP3NbMF18PTI6KHNbaC0yXT0wLHNbaF09dSkpOmUucHVzaChhKX1yZXR1cm4gZX0sdD1uZXcgTWFwO2V4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHMpe3ZhciByPXQuZ2V0KHRoaXMpO3JldHVybiByfHwocj1uZXcgTWFwLHQuc2V0KHRoaXMscikpLChyPW4odGhpcyxyLmdldChzKXx8KHIuc2V0KHMscj1mdW5jdGlvbihuKXtmb3IodmFyIHQscyxyPTEsZT1cIlwiLHU9XCJcIixoPVswXSxwPWZ1bmN0aW9uKG4pezE9PT1yJiYobnx8KGU9ZS5yZXBsYWNlKC9eXFxzKlxcblxccyp8XFxzKlxcblxccyokL2csXCJcIikpKT9oLnB1c2goMCxuLGUpOjM9PT1yJiYobnx8ZSk/KGgucHVzaCgzLG4sZSkscj0yKToyPT09ciYmXCIuLi5cIj09PWUmJm4/aC5wdXNoKDQsbiwwKToyPT09ciYmZSYmIW4/aC5wdXNoKDUsMCwhMCxlKTpyPj01JiYoKGV8fCFuJiY1PT09cikmJihoLnB1c2gociwwLGUscykscj02KSxuJiYoaC5wdXNoKHIsbiwwLHMpLHI9NikpLGU9XCJcIn0sYT0wO2E8bi5sZW5ndGg7YSsrKXthJiYoMT09PXImJnAoKSxwKGEpKTtmb3IodmFyIGw9MDtsPG5bYV0ubGVuZ3RoO2wrKyl0PW5bYV1bbF0sMT09PXI/XCI8XCI9PT10PyhwKCksaD1baF0scj0zKTplKz10OjQ9PT1yP1wiLS1cIj09PWUmJlwiPlwiPT09dD8ocj0xLGU9XCJcIik6ZT10K2VbMF06dT90PT09dT91PVwiXCI6ZSs9dDonXCInPT09dHx8XCInXCI9PT10P3U9dDpcIj5cIj09PXQ/KHAoKSxyPTEpOnImJihcIj1cIj09PXQ/KHI9NSxzPWUsZT1cIlwiKTpcIi9cIj09PXQmJihyPDV8fFwiPlwiPT09blthXVtsKzFdKT8ocCgpLDM9PT1yJiYoaD1oWzBdKSxyPWgsKGg9aFswXSkucHVzaCgyLDAscikscj0wKTpcIiBcIj09PXR8fFwiXFx0XCI9PT10fHxcIlxcblwiPT09dHx8XCJcXHJcIj09PXQ/KHAoKSxyPTIpOmUrPXQpLDM9PT1yJiZcIiEtLVwiPT09ZSYmKHI9NCxoPWhbMF0pfXJldHVybiBwKCksaH0ocykpLHIpLGFyZ3VtZW50cyxbXSkpLmxlbmd0aD4xP3I6clswXX1cbiIsImltcG9ydHtoIGFzIHIsQ29tcG9uZW50IGFzIG8scmVuZGVyIGFzIHR9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2gscmVuZGVyLENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtpbXBvcnQgZSBmcm9tXCJodG1cIjt2YXIgbT1lLmJpbmQocik7ZXhwb3J0e20gYXMgaHRtbH07XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcblxuY29uc3QgQXBwQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gY291bnRSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgJ0lOQ1JFTUVOVCc6XG4gICAgICByZXR1cm4geyBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgYWN0aW9uIHR5cGUke2FjdGlvbi50eXBlfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVzZUFwcENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcbiAgfVxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XG4gIGNvbnN0IGluY3JlbWVudCA9ICgpID0+IGRpc3BhdGNoKHsgdHlwZTogJ0lOQ1JFTUVOVCcgfSk7XG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCwgaW5jcmVtZW50IH07XG59XG5cbmZ1bmN0aW9uIEFwcFByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihjb3VudFJlZHVjZXIsIHsgY291bnQ6IDAgfSk7XG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8QXBwQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG5leHBvcnQgeyBBcHBQcm92aWRlciwgdXNlQXBwQ29udGV4dCB9O1xuIiwiZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgZW1haWw6ICcnLFxuICBwYXNzd29yZDogJycsXG4gIHN1Y2Nlc3M6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgdXNlcm5hbWU6ICcnLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgY29uZmlybTogJycsXG4gIGN1cnJlbnQ6ICcnLFxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxuICB0b2tlbjogbnVsbCxcbiAgaXNMb2dnZWRJbjogZmFsc2UsXG4gIGlzUGFzc3dvcmRDaGFuZ2VkOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRoUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgW2FjdGlvbi5wYXlsb2FkLnByb3BOYW1lXTogYWN0aW9uLnBheWxvYWQudmFsdWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUsICcsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZScsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgaXNQYXNzd29yZENoYW5nZWQ6IHRydWUsXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHknLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIHN1Y2Nlc3M6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gdXNlQXV0aENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xuICB9XG5cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xuXG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZSxcbiAgICBkaXNwYXRjaCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG5cbmV4cG9ydCB7IHVzZUF1dGhDb250ZXh0LCBBdXRoUHJvdmlkZXIgfTtcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5cbmNvbnN0IFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3QgeyBsb2NhdGlvbiB9ID0gc3RhdGU7XG5cbiAgaWYgKGxvY2F0aW9uLmhhc2ggPT09IHBhdGgpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMaW5rKHByb3BzKSB7XG4gIGNvbnN0IHsgdG8gfSA9IHByb3BzO1xuICBjb25zdCB7IHN0YXRlLCBwdXNoIH0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBwdXNoKHRvKTtcbiAgfVxuICByZXR1cm4gPGEgey4uLnByb3BzfSBocmVmPXt0b30gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlUm91dGVDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChSb3V0ZUNvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBSb3V0ZVByb3ZpZGVyJyk7XG4gIH1cbiAgY29uc3QgW3N0YXRlLCBwdXNoXSA9IGNvbnRleHQ7XG5cbiAgcmV0dXJuIHsgc3RhdGUsIHB1c2ggfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZSh7IGxvY2F0aW9uOiB3aW5kb3cubG9jYXRpb24gfSk7XG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgcHVzaF0sIFtzdGF0ZSwgcHVzaF0pO1xuXG4gIGZ1bmN0aW9uIHB1c2godXJsKSB7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHVybCk7XG4gICAgc2V0U3RhdGUoKHByZXYpID0+ICh7IC4uLnByZXYsIGxvY2F0aW9uOiB3aW5kb3cubG9jYXRpb24gfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9wU3RhdGUoKSB7XG4gICAgc2V0U3RhdGUoKHByZXYpID0+ICh7IC4uLnByZXYsIGxvY2F0aW9uOiB3aW5kb3cubG9jYXRpb24gfSkpO1xuICB9XG4gXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBoYW5kbGVQb3BTdGF0ZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZVBvcFN0YXRlKTtcbiAgICB9O1xuICB9LCBbXSk7XG4gIHJldHVybiA8Um91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImltcG9ydCB7IGgsIHJlbmRlciB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gJ2h0bS9wcmVhY3QnO1xuaW1wb3J0IFRlc3RDb21wb25lbnQgZnJvbSAnLi9UZXN0Q29tcG9uZW50JztcbmltcG9ydCB7IEFwcFByb3ZpZGVyIH0gZnJvbSAnLi9hcHAtY29udGV4dCc7XG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIFJvdXRlLCBMaW5rIH0gZnJvbSAnLi9yb3V0ZS9yb3V0ZS1jb250ZXh0Jztcbi8vIGltcG9ydCBMb2dpbiBmcm9tICcuL2F1dGgvTG9naW4nO1xuLy8gaW1wb3J0IFNpZ251cCBmcm9tICcuL2F1dGgvU2lnbnVwJztcbi8vIGltcG9ydCBGb3Jnb3RQYXNzd29yZCBmcm9tICcuL2F1dGgvRm9yZ290UGFzc3dvcmQnO1xuLy8gaW1wb3J0IENoYW5nZVBhc3N3b3JkIGZyb20gJy4vYXV0aC9DaGFuZ2VQYXNzd29yZCc7XG5jb25zdCBMb2dpbiA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvTG9naW4nKSk7XG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvQ2hhbmdlUGFzc3dvcmQnKSk7XG5jb25zdCBGb3Jnb3RQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL2F1dGgvRm9yZ290UGFzc3dvcmQnKSk7XG5jb25zdCBTaWdudXAgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9hdXRoL1NpZ251cCcpKTtcblxucmVuZGVyKFxuICA8QXBwUHJvdmlkZXI+XG4gICAgPEF1dGhQcm92aWRlcj5cbiAgICAgIDxSb3V0ZVByb3ZpZGVyPlxuICAgICAgICA8TGluayB0bz1cIi9jaGFuZ2VwYXNzd29yZFwiPkNoYW5nZVBhc3N3b3JkPC9MaW5rPlxuICAgICAgICA8TGluayB0bz1cIiMvbG9naW5cIj5Mb2dpbjwvTGluaz5cbiAgICAgICAgPExpbmsgdG89XCIjL3NpZ251cFwiPlNpZ251cDwvTGluaz5cbiAgICAgICAgPExpbmsgdG89XCIjL2ZvcmdvdHBhc3N3b3JkXCI+Rm9yZ290UGFzc3dvcmQ8L0xpbms+XG4gICAgICAgIDxSb3V0ZSBwYXRoPVwiIy9jaGFuZ2VwYXNzd29yZFwiPlxuICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCAvPlxuICAgICAgICA8L1JvdXRlPlxuICAgICAgICA8Um91dGUgcGF0aD1cIiMvbG9naW5cIj5cbiAgICAgICAgICA8TG9naW4gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIjL3NpZ251cFwiPlxuICAgICAgICAgIDxTaWdudXAgLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIjL2ZvcmdvdHBhc3N3b3JkXCI+XG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkIC8+XG4gICAgICAgIDwvUm91dGU+XG4gICAgICA8L1JvdXRlUHJvdmlkZXI+XG4gICAgPC9BdXRoUHJvdmlkZXI+XG4gIDwvQXBwUHJvdmlkZXI+LFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcbik7XG4iXSwibmFtZXMiOlsiRU1QVFlfT0JKIiwiRU1QVFlfQVJSIiwiSVNfTk9OX0RJTUVOU0lPTkFMIiwiY3VycmVudEluZGV4IiwiY3VycmVudENvbXBvbmVudCIsInByZXZSYWYiLCJhZnRlclBhaW50RWZmZWN0cyIsIm9sZEJlZm9yZVJlbmRlciIsIm9wdGlvbnMiLCJfcmVuZGVyIiwib2xkQWZ0ZXJEaWZmIiwiZGlmZmVkIiwib2xkQ29tbWl0IiwiX2NvbW1pdCIsIm9sZEJlZm9yZVVubW91bnQiLCJ1bm1vdW50IiwiZ2V0SG9va1N0YXRlIiwiaW5kZXgiLCJfaG9vayIsImhvb2tzIiwiX19ob29rcyIsIl9saXN0IiwiX3BlbmRpbmdFZmZlY3RzIiwibGVuZ3RoIiwicHVzaCIsInVzZVN0YXRlIiwiaW5pdGlhbFN0YXRlIiwidXNlUmVkdWNlciIsImludm9rZU9yUmV0dXJuIiwicmVkdWNlciIsImluaXQiLCJob29rU3RhdGUiLCJfY29tcG9uZW50IiwiX3ZhbHVlIiwidW5kZWZpbmVkIiwibmV4dFZhbHVlIiwiYWN0aW9uIiwic2V0U3RhdGUiLCJ1c2VFZmZlY3QiLCJjYWxsYmFjayIsImFyZ3MiLCJzdGF0ZSIsImFyZ3NDaGFuZ2VkIiwiX2FyZ3MiLCJ1c2VNZW1vIiwiZmFjdG9yeSIsIl9mYWN0b3J5IiwidXNlQ29udGV4dCIsImNvbnRleHQiLCJwcm92aWRlciIsIl9pZCIsIl9kZWZhdWx0VmFsdWUiLCJzdWIiLCJwcm9wcyIsInZhbHVlIiwiZmx1c2hBZnRlclBhaW50RWZmZWN0cyIsInNvbWUiLCJjb21wb25lbnQiLCJfcGFyZW50RG9tIiwiZm9yRWFjaCIsImludm9rZUNsZWFudXAiLCJpbnZva2VFZmZlY3QiLCJlIiwiX2NhdGNoRXJyb3IiLCJfdm5vZGUiLCJob29rIiwiX2NsZWFudXAiLCJyZXN1bHQiLCJvbGRBcmdzIiwibmV3QXJncyIsImFyZyIsImYiLCJ2bm9kZSIsImMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyYWYiLCJkb25lIiwiY2xlYXJUaW1lb3V0IiwidGltZW91dCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwic2V0VGltZW91dCIsIndpbmRvdyIsImNvbW1pdFF1ZXVlIiwiX3JlbmRlckNhbGxiYWNrcyIsImZpbHRlciIsImNiIiwiYXNzaWduIiwib2JqIiwiaSIsInNoYWxsb3dEaWZmZXJzIiwiYSIsImIiLCJuIiwidCIsInMiLCJyIiwidSIsImgiLCJwIiwiT2JqZWN0IiwiYXBwbHkiLCJNYXAiLCJnZXQiLCJzZXQiLCJyZXBsYWNlIiwibCIsImFyZ3VtZW50cyIsIm0iLCJiaW5kIiwiQXBwQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJjb3VudFJlZHVjZXIiLCJ0eXBlIiwiY291bnQiLCJFcnJvciIsIkFwcFByb3ZpZGVyIiwiZGlzcGF0Y2giLCJpbml0U3RhdGUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImVycm9yIiwidXNlcm5hbWUiLCJsb2FkaW5nIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImlzTG9nZ2VkSW4iLCJpc1Bhc3N3b3JkQ2hhbmdlZCIsImF1dGhSZWR1Y2VyIiwiYWN0aW9uVHlwZXMiLCJWQUxVRV9DSEFOR0VEIiwicGF5bG9hZCIsInByb3BOYW1lIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJzdWNjZXNzTWVzc2FnZSIsIkxPR0lOX0ZBSUxFRCIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJSb3V0ZUNvbnRleHQiLCJSb3V0ZSIsImNoaWxkcmVuIiwicGF0aCIsInVzZVJvdXRlQ29udGV4dCIsImxvY2F0aW9uIiwiaGFzaCIsIkxpbmsiLCJ0byIsImhhbmRsZUNsaWNrIiwicHJldmVudERlZmF1bHQiLCJSb3V0ZVByb3ZpZGVyIiwidXJsIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInByZXYiLCJoYW5kbGVQb3BTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiTG9naW4iLCJsYXp5IiwiQ2hhbmdlUGFzc3dvcmQiLCJGb3Jnb3RQYXNzd29yZCIsIlNpZ251cCIsInJlbmRlciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiJLQUFPO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsS0FBQTtBQUFBLEtBQUE7QUFBQSxLQUFBO0FBQUEsSUFBTUEsQ0FBQUEsR0FBWSxFQUFsQjtBQUFBLElBQ01DLENBQUFBLEdBQVksRUFEbEI7QUFBQSxJQUVNQyxDQUFBQSxHQUFxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNDbEMsSUFBSUMsR0FBSjtBQUFBLElBR0lDLEdBSEo7QUFBQSxJQWNJQyxHQWRKO0FBQUEsSUFNSUMsR0FBQUEsR0FBb0IsRUFOeEI7QUFBQSxJQVFJQyxHQUFBQSxHQUFrQkMsQ0FBQUEsQ0FBUUMsR0FSOUI7QUFBQSxJQVNJQyxHQUFBQSxHQUFlRixDQUFBQSxDQUFRRyxNQVQzQjtBQUFBLElBVUlDLEdBQUFBLEdBQVlKLENBQUFBLENBQVFLLEdBVnhCO0FBQUEsSUFXSUMsR0FBQUEsR0FB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
