var support = {
  searchParams: "URLSearchParams" in self,
  iterable: "Symbol" in self && "iterator" in Symbol,
  blob:
    "FileReader" in self &&
    "Blob" in self &&
    (function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    })(),
  formData: "FormData" in self,
  arrayBuffer: "ArrayBuffer" in self,
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}

if (support.arrayBuffer) {
  var viewClasses = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]",
  ];

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function (obj) {
      return (
        obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      );
    };
}

function normalizeName(name) {
  if (typeof name !== "string") {
    name = String(name);
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError("Invalid character in header field name");
  }
  return name.toLowerCase();
}

function normalizeValue(value) {
  if (typeof value !== "string") {
    value = String(value);
  }
  return value;
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function () {
      var value = items.shift();
      return { done: value === undefined, value: value };
    },
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}

function Headers(headers) {
  this.map = {};

  if (headers instanceof Headers) {
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}

Headers.prototype.append = function (name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ", " + value : value;
};

Headers.prototype["delete"] = function (name) {
  delete this.map[normalizeName(name)];
};

Headers.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};

Headers.prototype.has = function (name) {
  return this.map.hasOwnProperty(normalizeName(name));
};

Headers.prototype.set = function (name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

Headers.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

Headers.prototype.keys = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push(name);
  });
  return iteratorFor(items);
};

Headers.prototype.values = function () {
  var items = [];
  this.forEach(function (value) {
    items.push(value);
  });
  return iteratorFor(items);
};

Headers.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError("Already read"));
  }
  body.bodyUsed = true;
}

function fileReaderReady(reader) {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}

function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise;
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }
  return chars.join("");
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0);
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer;
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function (body) {
    this._bodyInit = body;
    if (!body) {
      this._bodyText = "";
    } else if (typeof body === "string") {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (
      support.searchParams &&
      URLSearchParams.prototype.isPrototypeOf(body)
    ) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer);
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (
      support.arrayBuffer &&
      (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))
    ) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }

    if (!this.headers.get("content-type")) {
      if (typeof body === "string") {
        this.headers.set("content-type", "text/plain;charset=UTF-8");
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set("content-type", this._bodyBlob.type);
      } else if (
        support.searchParams &&
        URLSearchParams.prototype.isPrototypeOf(body)
      ) {
        this.headers.set(
          "content-type",
          "application/x-www-form-urlencoded;charset=UTF-8"
        );
      }
    }
  };

  if (support.blob) {
    this.blob = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
      } else if (this._bodyFormData) {
        throw new Error("could not read FormData body as blob");
      } else {
        return Promise.resolve(new Blob([this._bodyText]));
      }
    };

    this.arrayBuffer = function () {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
      } else {
        return this.blob().then(readBlobAsArrayBuffer);
      }
    };
  }

  this.text = function () {
    var rejected = consumed(this);
    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error("could not read FormData body as text");
    } else {
      return Promise.resolve(this._bodyText);
    }
  };

  if (support.formData) {
    this.formData = function () {
      return this.text().then(decode);
    };
  }

  this.json = function () {
    return this.text().then(JSON.parse);
  };

  return this;
}

// HTTP methods whose capitalization should be normalized
var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}

function Request(input, options) {
  options = options || {};
  var body = options.body;

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError("Already read");
    }
    this.url = input.url;
    this.credentials = input.credentials;
    if (!options.headers) {
      this.headers = new Headers(input.headers);
    }
    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;
    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  } else {
    this.url = String(input);
  }

  this.credentials = options.credentials || this.credentials || "same-origin";
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }
  this.method = normalizeMethod(options.method || this.method || "GET");
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal;
  this.referrer = null;

  if ((this.method === "GET" || this.method === "HEAD") && body) {
    throw new TypeError("Body not allowed for GET or HEAD requests");
  }
  this._initBody(body);
}

Request.prototype.clone = function () {
  return new Request(this, { body: this._bodyInit });
};

function decode(body) {
  var form = new FormData();
  body
    .trim()
    .split("&")
    .forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split("=");
        var name = split.shift().replace(/\+/g, " ");
        var value = split.join("=").replace(/\+/g, " ");
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
  return form;
}

function parseHeaders(rawHeaders) {
  var headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
  preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
    var parts = line.split(":");
    var key = parts.shift().trim();
    if (key) {
      var value = parts.join(":").trim();
      headers.append(key, value);
    }
  });
  return headers;
}

Body.call(Request.prototype);

function Response(bodyInit, options) {
  if (!options) {
    options = {};
  }

  this.type = "default";
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = "statusText" in options ? options.statusText : "OK";
  this.headers = new Headers(options.headers);
  this.url = options.url || "";
  this._initBody(bodyInit);
}

Body.call(Response.prototype);

Response.prototype.clone = function () {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url,
  });
};

Response.error = function () {
  var response = new Response(null, { status: 0, statusText: "" });
  response.type = "error";
  return response;
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function (url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError("Invalid status code");
  }

  return new Response(null, { status: status, headers: { location: url } });
};

var DOMException = self.DOMException;
try {
  new DOMException();
} catch (err) {
  DOMException = function (message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };
  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

function fetch$1(input, init) {
  return new Promise(function (resolve, reject) {
    var request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException("Aborted", "AbortError"));
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function () {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ""),
      };
      options.url =
        "responseURL" in xhr
          ? xhr.responseURL
          : options.headers.get("X-Request-URL");
      var body = "response" in xhr ? xhr.response : xhr.responseText;
      resolve(new Response(body, options));
    };

    xhr.onerror = function () {
      reject(new TypeError("Network request failed"));
    };

    xhr.ontimeout = function () {
      reject(new TypeError("Network request failed"));
    };

    xhr.onabort = function () {
      reject(new DOMException("Aborted", "AbortError"));
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === "include") {
      xhr.withCredentials = true;
    } else if (request.credentials === "omit") {
      xhr.withCredentials = false;
    }

    if ("responseType" in xhr && support.blob) {
      xhr.responseType = "blob";
    }

    request.headers.forEach(function (value, name) {
      xhr.setRequestHeader(name, value);
    });

    if (request.signal) {
      request.signal.addEventListener("abort", abortXhr);

      xhr.onreadystatechange = function () {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener("abort", abortXhr);
        }
      };
    }

    xhr.send(
      typeof request._bodyInit === "undefined" ? null : request._bodyInit
    );
  });
}

fetch$1.polyfill = true;

if (!self.fetch) {
  self.fetch = fetch$1;
  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;
}

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

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === "undefined") {
    return;
  }

  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";

  if (insertAt === "top") {
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

var css_248z =
  ".main-content {\n  background-color: #546e7a;\n  position: fixed;\n  left: 320px;\n  top: 100px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 80%;\n  height: 80%;\n  padding: 5px;\n}\n\n.loading {\n  height: 100%;\n  width: 100%;\n  color: white;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.surface {\n  background-color: #f5f5f5;\n}";
styleInject(css_248z);

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

var actionTypes = {
  INIT_FORM_VALIDATION_STATE: "INIT_FORM_VALIDATION_STATE",
  RESET_VALIDATION_STATE: "RESET_VALIDATION_STATE",
  INPUT_BLURRED: "INPUT_BLURRED",
  INPUT_FOCUSED: "INPUT_FOCUSED",
  SERVER_VALIDATION: "SERVER_VALIDATION",
  CLIENT_VALIDATION: "CLIENT_VALIDATION",
  INC_INPUT_COUTN: "INC_INPUT_COUTN",
};

var validationStates = {
  VALID: "VALID",
  INVALID: "INVALID",
  INACTIVE: "INACTIVE",
};

const initState = {
  validation: {},
};
function formReducer(state, action) {
  let nextState = null;

  switch (action.type) {
    case actionTypes.SERVER_VALIDATION:
      nextState = {
        ...state,
        validation: {
          ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message,
          },
        },
      };
      return nextState;

    case actionTypes.CLIENT_VALIDATION:
      nextState = {
        ...state,
        validation: {
          ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message,
          },
        },
      };
      return nextState;

    case actionTypes.RESET_VALIDATION_STATE:
      return {
        ...state,
        validation: {
          ...state.validation,
          [action.validationType]: {
            validationState: validationStates.INACTIVE,
            message: "",
          },
        },
      };

    case actionTypes.INPUT_FOCUSED:
      return {
        ...state,
        validation: {
          ...state.validation,
          formState: validationStates.INACTIVE,
          [action.propName]: {
            validationState: validationStates.INACTIVE,
            message: "",
          },
        },
      };

    case actionTypes.INIT_FORM_VALIDATION_STATE:
      return {
        ...state,
        validation: {
          ...state.validation,
          formState: validationStates.INACTIVE,
        },
      };

    case actionTypes.INC_INPUT_COUTN:
      return { ...state, count: state.count + 1 };

    default:
      return state;
  }
}

const FormContext = M();
function useFormContext() {
  const context = T$1(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used with FormProvider");
  }

  const [state, dispatch] = context;
  return {
    state,
    dispatch,
  };
}
function FormProvider(props) {
  const [state, dispatch] = m$1(formReducer, initState);
  const value = s$1(() => [state, dispatch], [state]);
  return h(
    FormContext.Provider,
    _extends(
      {
        value: value,
      },
      props
    )
  );
}

function ValidationMessage({ validationTypes, name }) {
  const { state } = useFormContext();
  return validationTypes.map((validationName) => {
    if (state.validation[validationName]) {
      const { message } = state.validation[validationName];
      return h(
        "div",
        {
          key: validationName,
          style: {
            color: "red",
            paddingLeft: 3,
          },
        },
        message !== "" &&
          h(
            "div",
            {
              role: "message",
              "data-testid": `message-${name}`,
            },
            `* ${message}`
          )
      );
    }
  });
}

function ValidityTickState({ valid }) {
  let stateColor = "#4fc3f7";

  switch (valid) {
    case validationStates.VALID:
      stateColor = "green";
      break;

    case validationStates.INVALID:
      stateColor = "red";
      break;

    case validationStates.INACTIVE:
      stateColor = "#4fc3f7";
      break;

    default:
      stateColor = "#4fc3f7";
  }

  return h(
    "div",
    {
      style: {
        flex: 1,
        color: stateColor,
        lineHeight: 2,
        width: 20,
        textAlign: "center",
      },
    },
    valid ? "✓" : "☓"
  );
}

function ValidityIcon({ validationTypes }) {
  const { state } = useFormContext();
  return validationTypes.map((validationName) => {
    if (state.validation[validationName]) {
      const { validationState } = state.validation[validationName];

      if (
        validationState === validationStates.VALID ||
        validationState === validationStates.INVALID
      ) {
        return h(ValidityTickState, {
          key: validationName,
          valid: validationState,
        });
      }

      return null;
    }
  });
}

var actionTypes$1 = {
  VALUE_CHANGED: "VALUE_CHANGED",
  LOGIN_STARTED: "LOGIN_STARTED",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT_STARTED: "LOGOUT_STARTED",
  LOGOUT_FAILED: "LOGOUT_FAILED",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  SIGNUP_STARTED: "SIGNUP_STARTED",
  SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
  SIGNUP_FAILED: "SIGNUP_FAILED",
  CHANGE_PASSWORD_STARTED: "CHANGE_PASSWORD_STARTED",
  CHANGE_PASSWORD_SUCCESS: "CHANGE_PASSWORD_SUCCESS",
  CHANGE_PASSWORD_FAILED: "CHANGE_PASSWORD_FAILED",
  REQUEST_PASS_CHANGE_STARTED: "REQUEST_PASS_CHANGE_STARTED",
  REQUEST_PASS_CHANGE_SUCCESS: "REQUEST_PASS_CHANGE_SUCCESS",
  REQUEST_PASS_CHANGE_FAILED: "REQUEST_PASS_CHANGE_FAILED",
  GOT_TOKEN_FROM_URL: "GOT_TOKEN_FROM_URL",
};

const initState$1 = {
  email: "",
  password: "",
  success: false,
  error: null,
  username: "",
  loading: false,
  confirm: "",
  current: "",
  emailorusername: "",
  token: null,
  isLoggedIn: false,
  isPasswordChanged: false,
  authFeedback: null,
};
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes$1.VALUE_CHANGED:
      const nextState = {
        ...state,
        [action.payload.propName]: action.payload.value,
      };
      debugger;
      return nextState;

    case actionTypes$1.LOGIN_STARTED:
      return { ...state, loading: true };

    case actionTypes$1.LOGIN_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        token: action.token,
        username: action.username,
        email: action.email,
        isLoggedIn: true,
        password: "",
        successMessage: "Welcome, ",
      };

    case actionTypes$1.LOGIN_FAILED:
      return { ...state, loading: false, error: action.payload.error };

    case actionTypes$1.SIGNUP_STARTED:
      return { ...state, loading: true };

    case actionTypes$1.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        isLoggedIn: true,
        token: action.token,
        username: action.username,
        email: action.email,
        password: "",
        successMessage: "Welcome",
      };

    case actionTypes$1.SIGNUP_FAILED:
      return { ...state, loading: false, error: action.payload.error };

    case actionTypes$1.CHANGE_PASSWORD_STARTED:
      return { ...state, loading: true };

    case actionTypes$1.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        token: action.token,
        username: action.username,
        email: action.email,
        isPasswordChanged: true,
        authFeedback: action.message,
      };

    case actionTypes$1.CHANGE_PASSWORD_FAILED:
      return { ...state, loading: false, error: action.error };

    case actionTypes$1.REQUEST_PASS_CHANGE_STARTED:
      return { ...state, loading: true };

    case actionTypes$1.REQUEST_PASS_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        authFeedback: action.message,
      };

    case actionTypes$1.REQUEST_PASS_CHANGE_FAILED:
      return { ...state, loading: false, error: action.payload.error };

    case actionTypes$1.GOT_TOKEN_FROM_URL:
      return { ...state, token: action.token };

    case actionTypes$1.LOGOUT_SUCCESS:
      return { ...initState$1 };

    default:
      return state;
  }
}

const AuthContext = M();

function useAuthContext() {
  const context = T$1(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used with AppProvider");
  }

  const [state, dispatch] = context;
  return {
    state,
    dispatch,
  };
}

function AuthProvider(props) {
  const [state, dispatch] = m$1(authReducer, initState$1);
  const value = s$1(() => [state, dispatch], [state]);
  return h(
    AuthContext.Provider,
    _extends(
      {
        value: value,
      },
      props
    )
  );
}

var validationTypes = {
  //constraint
  EMAIL_FORMAT_VALIDATION: "EMAIL_FORMAT_VALIDATION",
  PASSWORD_FORMAT_VALIDATION: "PASSWORD_FORMAT_VALIDATION",
  USERNAME_FORMAT_VALIDATION: "USERNAME_FORMAT_VALIDATION",
  USERNAME_OR_EMAIL_FORMAT_VALIDATION: "USERNAME_OR_EMAIL_FORMAT_VALIDATION",
  EMPTY_STRING_VALIDATION: "EMPTY_STRING_VALIDATION",
  PASSWORDS_MATCH_VALIDATION: "PASSWORDS_MATCH_VALIDATION",
  //auth
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USERNAME_TAKEN: "USERNAME_TAKEN",
  REGISTERED_EMAIL: "REGISTERED_EMAIL",
  EMAIL_NOT_REGISTERED: "EMAIL_NOT_REGISTERED",
  USERNAME_NOT_REGISTERED: "USERNAME_NOT_REGISTERED",
};

var validationMessages = {
  INVALID_PASSWORD:
    "at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, Can contain special characters",
  INVALID_EMAIL: "email format is not valid",
  EMAIL_NOT_REGISTERED: "email is not registered",
  USERNAME_NOT_REGISTERED: "username is not registered",
  INVALID_USERNAME:
    "only Letters a-z or A-Z and the Symbols - and _ are allowed",
  INVALID_EMPTY_STRING: "empty string is not allowed",
  INVALID_USERNAME_OR_EMAIL: "email or username is not valid",
  INVALID_CREDENTIALS: "invalid credentials provided",
  USERNAME_TAKEN: "username is already taken",
  REGISTERED_EMAIL: "email is already registered",
  PASSWORDS_DO_NOT_MATCH: "passwords do not match",
};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
const usernameRegex = /[a-zA-Z]+[-_]*[a-zA-Z]+/g;

function validateEmailConstraint({ email }) {
  const emailConstraint = new RegExp(emailRegex);

  if (emailConstraint.test(email)) {
    return {
      validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: "",
    };
  } else {
    return {
      validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_EMAIL,
    };
  }
}
function isClientValidationType({ validationType }) {
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
function validatePasswordConstraint({ password }) {
  const passwordConstraint = new RegExp(passwordRegex);

  if (passwordConstraint.test(password)) {
    return {
      validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: "",
    };
  }

  if (!passwordConstraint.test(password)) {
    return {
      validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_PASSWORD,
    };
  }
}
function validateUserNameConstraint({ username }) {
  const usernameConstraint = new RegExp(usernameRegex);

  if (usernameConstraint.test(username)) {
    return {
      validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: "",
    };
  } else {
    return {
      validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_USERNAME,
    };
  }
}
function validateEmailOrUsername({ value }) {
  const emailConstraint = new RegExp(emailRegex);
  const usernameConstraint = new RegExp(usernameRegex);

  if (emailConstraint.test(value)) {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: "",
    };
  } else if (usernameConstraint.test(value)) {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.VALID,
      message: "",
    };
  } else {
    return {
      validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_USERNAME_OR_EMAIL,
    };
  }
}
function validateEmptyString({ value }) {
  if (value.length === 0) {
    return {
      validationType: validationTypes.EMPTY_STRING_VALIDATION,
      validationState: validationStates.INVALID,
      message: validationMessages.INVALID_EMPTY_STRING,
    };
  } else {
    return {
      validationType: validationTypes.EMPTY_STRING_VALIDATION,
      validationState: validationStates.VALID,
      message: "",
    };
  }
}
function validatePasswordMatch({ auth }) {
  const { password, confirm } = auth;
  debugger;

  if (password === "" || password !== confirm) {
    return {
      validationState: validationStates.INVALID,
      message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
    };
  } else {
    return {
      validationState: validationStates.VALID,
      message: "",
      validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
    };
  }
}

var httpStatus = {
  //login
  credentialInvalid: "401",
  //signup
  usernameIsTaken: "402",
  emailIsRegistered: "403",
  usernameInvalid: "405",
  passwordInvalid: "406",
  //change password
  emailInvalid: "407",
  //login
  emailIsNotRegistered: "408",
  emptyStringNotValid: "409",
  emailorusernameNotValid: "410",
  usernameIsNotRegistered: "411",
  //change password
  passwordDoNotMatch: "412",
  tokenExpired: "413",
  serverValidationRange: (status) => {
    if (status >= 400 && status <= 410) {
      return true;
    }

    return false;
  },
};

function clientValidation({ validationType, value, state, auth }) {
  let validation = null;

  switch (validationType) {
    case validationTypes.EMAIL_FORMAT_VALIDATION:
      validation = validateEmailConstraint({
        email: value,
      });
      break;

    case validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION:
      validation = validateEmailOrUsername({
        value,
      });
      break;

    case validationTypes.PASSWORD_FORMAT_VALIDATION:
      validation = validatePasswordConstraint({
        password: value,
      });
      break;

    case validationTypes.USERNAME_FORMAT_VALIDATION:
      validation = validateUserNameConstraint({
        username: value,
      });
      break;

    case validationTypes.EMPTY_STRING_VALIDATION:
      validation = validateEmptyString({
        value,
      });
      break;

    case validationTypes.PASSWORDS_MATCH_VALIDATION:
      validation = validatePasswordMatch({
        auth,
      });
      break;
  }

  return {
    type: actionTypes.CLIENT_VALIDATION,
    ...validation,
  };
}
function resetInputValidationState({ validationType }) {
  return {
    type: actionTypes.RESET_VALIDATION_STATE,
    validationType,
  };
}
function serverValidation({ status = 0 }) {
  switch (status) {
    case httpStatus.credentialInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID,
      };

    case httpStatus.emailInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID,
      };

    case httpStatus.passwordInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
        message: validationMessages.INVALID_PASSWORD,
        validationState: validationStates.INVALID,
      };

    case httpStatus.usernameInvalid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME,
        validationState: validationStates.INVALID,
      };

    case httpStatus.emailIsRegistered:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.REGISTERED_EMAIL,
        message: validationMessages.REGISTERED_EMAIL,
        validationState: validationStates.INVALID,
      };

    case httpStatus.emailIsNotRegistered:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_NOT_REGISTERED,
        message: validationMessages.EMAIL_NOT_REGISTERED,
        validationState: validationStates.INVALID,
      };

    case httpStatus.usernameIsTaken:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_TAKEN,
        message: validationMessages.USERNAME_TAKEN,
        validationState: validationStates.INVALID,
      };

    case httpStatus.emptyStringNotValid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.EMPTY_STRING_VALIDATION,
        message: validationMessages.INVALID_EMPTY_STRING,
        validationState: validationStates.INVALID,
      };

    case httpStatus.emailorusernameNotValid:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        validationState: validationStates.INVALID,
      };

    case httpStatus.usernameIsNotRegistered:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_NOT_REGISTERED,
        message: validationMessages.USERNAME_NOT_REGISTERED,
        validationState: validationStates.INVALID,
      };

    case httpStatus.passwordDoNotMatch:
      return {
        type: actionTypes.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
        validationState: validationStates.INVALID,
      };

    default:
      return null;
  }
}

function useClientValidation({ validationTypes, value, name }) {
  const { state, dispatch } = useFormContext();
  const { state: auth } = useAuthContext();
  p$1(() => {
    if (auth.password) {
      debugger;
    }
  }, [auth]);

  function validate() {
    debugger;
    validationTypes.forEach((validationName) => {
      if (
        isClientValidationType({
          validationType: validationName,
        })
      ) {
        dispatch(
          clientValidation({
            validationType: validationName,
            value: auth[name],
            state,
            auth,
          })
        );
      }
    });
  }

  function resetValidationState() {
    validationTypes.forEach((validationName) => {
      if (state.validation[validationName]) {
        dispatch(
          resetInputValidationState({
            validationType: validationName,
          })
        );
      }
    });
  }

  return {
    validate,
    resetValidationState,
  };
}

const img =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACsklEQVR4nO2au24TQRSGP9sK0FgiIgLlIoUuqQNUVOHSmBLegHQUgS7PgZIOhKmIYihi3sAICQpSJKEECSsGgkKLJUuRKWYWHLOLd+fM7trx+aSRJWtn/v/Yu7MzZw4oiqIoiqIoijKOFDLQOANcAa4DS8BF4AIwZT8BfgJH9vMHsAO8BT4AnQw8eucSsAa8AdpA17G17RhrdsyhpgDcBmqYf8016KjWsWPfIps7NxE3gF38Bx3Vdq1m7lwGXpFd4P3tJTCfdpBRPET2fPtqbWA15VhPcBZ47jkIH61qvaXKDPA+xyAHtXfAdFrBzwFNocEmsA5UgAWgbNuC/W7dg8YX69Urk8BHgakD4D5QiqFVste2BHr7wHlRxD2cwyxGXM1sY/7lpJSBukC3Yb2L2RSYeAwUBdpFO4ar/qZAG4B7AvFt/KzYisjuhLuuwpPAd0fRA9xu+yjKuM8J32wsiak6CnYxk5hvVgR+niUVuyYQaxJvtk9KCdkr8mrYoFET1COB0TpwLOgfxTHwWtA/dkyzyLazFYHJQVQEvjqYlewJwu6AB8CEwOQnQd9BfBb0ncDENpBD3H/lLn5n/37KQm+H/QNKFimngrAf4KlwzH+eM4/MCvs/iSsy1pNgC5NqkphMizuCvjXga9yLx2Yh9D+qArGRXwqDbDPU4hRshkC+Hfbxms1tOxwwygmRFwLtP0hTYnVGPCUG5hnaF5hpYSaxuEnRFWRJ0T08JkUD5jApZ1dTXcxrbAOzVljkb1p80X63wZCmxQNmMIcPEoNptlQPRgLG+misl1WG43D0FxkfjvYyj9k35BV8jRyPx3tZJvsCieVMIktAAVO+skV6JTJbwE2GsESmn6BIqoG8SKpBikVSWZXJLRFeJjdlrzkivExuhxEtk1MURVEURVEUZbj5DckMFeQhrFj9AAAAAElFTkSuQmCC";

const img$1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADs0lEQVR4nO3bS2hcVRzH8U9ao9IymoIoSmOqLa0rN75wK4JatJQaFezCiNKtiFBc6NKVdCOKC1ErIooKoqCC4FvRjSK1ii5EDWhNUfEFgRiMizORNL03cx5zZ2Jyf/AnMMmc3///zbn3ntelVatWrU7UXsx0Y9+QcxmKZrDQjb8xOdx0Bq+lANYlhH1C0csh3DTMpAatSS2EWgg3DzOpQauFYI1DGIn8u0k8i1OWfDaP/Xi+x3e34DJc3I1d3c/O7MY/+AU/d38ex6f4EJ9gLjLHxlXVE+ZV94QLcDfervhOSszifdyLc5opK029IFyNV4X/am7RdTGHF7oesT23EdVB+FL/i66LI7iq6UJXUhWEYcSLmGi41lqtFgizuKvhWmu1WiAs4DBOa7TaGq0mCB/j3KYKPR9vYXvF72IhHMMhXC9cu5vQEcYGu/EwpiPaWSm+x9Y+1g3Oxtddg2npEH7CFEYjvDbiDvxQ01ZMHMVYapF12iyMyJYapEI4kOHbwSsVbcXGezg9w/ckPVFjkAJhHrdkeG/AQzX+MfFchucJ2t/DYFAQSnrCjRme4Dz8GWEwCAgd+feEY8LkK1mHE0wGAeHOhHyWx5OpZpdkmDQNYaOyR+SlKWavZZpMY1tFe/2C8EhmXgt4JtZku7Lp7LU17fYDwu6CvOaE+1pPPVhgsoDxFdouhXBRYW4PxJgcLzTpNSEpgdApzG0mwqMYQMwQNBfCpsLcogAcKjS5IsZEHoSJwtyiLoFdhSa3xZh0lQrhhoK8om+C8HqB0WOxJl2lQCjpndGPQfIGQosxi7NSzMRBGBWGtbl5JQ2ECBseuWb3p5rpDWGqIJ/HM/KxFb9nGv6BnRmedRAOCIsqObn8qGBx5PZM0wV8LiympKrfa4x7M3L4TyPKLoWXDBfCUxneJ2mzsFmZm8QR7MjwLYXwJk7N8K3UOL4rSOY33Kc/T4eY+AxnZNS5orbh24xklsasME6YEkaMY8LcYRzXqN7mSoXwjYb3Bo4mJJMaOUvuS+Md6b0sWR28HJHMoCE8Km7foS/agHuELr0aIDzd/xLjtBPvViQ0aAh1J1UGohHs0cwBif8NBMKq7R68of8QLqzwW5UQFrUDB/GRsuLnhD2+62p8io/wDeKw0Rgux5XCouaE8DjtCGOAUWHy9KtwVO4rfCGMID/AXz3arzvCd6twqGpdqD3brIWAegjr6n2HFoJ6COvqHagqCFEbI2tJyyGsOwCEbr/4GmDR+mCrVq3Wnv4Frrcuj2OfR5sAAAAASUVORK5CYII=";

function IconState({ open }) {
  if (open) {
    return h("img", {
      style: {
        width: 25,
      },
      src: img,
    });
  }

  return h("img", {
    style: {
      width: 25,
    },
    src: img$1,
  });
}

function EyeIcon({ onClick, inputType }) {
  const [state, setState] = v$1(false);

  function toggle() {
    onClick();
    setState((prev) => !prev);
  }

  if (inputType === "password")
    return h(
      "div",
      {
        onClick: toggle,
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 1,
        },
      },
      h(IconState, {
        open: state,
      })
    );
  return null;
}

const style = {
  input: {
    border: "1px solid",
    padding: 8,
    flex: 10,
    borderRadius: 2,
  },
  root: {
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    border: "1px solid white",
    marginBottom: 1,
  },
  inputContainer: {
    display: "flex",
    flex: 1,
  },
};
function Input({
  placeholder,
  type,
  name,
  onChange,
  value = "",
  validationTypes = [],
  id,
}) {
  const { validate, resetValidationState } = useClientValidation({
    validationTypes,
    value,
    name,
  });
  const [focused, setFocused] = v$1(false);
  const [inputType, setInputType] = v$1(type);

  function handleFocus() {
    resetValidationState();
    setFocused(true);
  }

  function handleBlur(e) {
    if (e.target.name === name) {
      debugger;
      validate();
    }
  }

  function toggleEye() {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  }

  return h(
    "div",
    {
      style: style.root,
    },
    h(
      "div",
      {
        style: style.inputContainer,
      },
      h("input", {
        style: { ...style.input },
        type: inputType,
        name: name,
        onChange: onChange,
        value: value,
        onBlur: handleBlur,
        placeholder: placeholder,
        onFocus: handleFocus,
        "data-testid": id,
      }),
      h(ValidityIcon, {
        validationTypes: validationTypes,
      }),
      h(EyeIcon, {
        inputType: type,
        onClick: toggleEye,
      })
    ),
    h(ValidationMessage, {
      validationTypes: validationTypes,
      name: name,
    })
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

function Form({ children, formTitle, error }) {
  return h(
    "div",
    null,
    h("legend", null, formTitle, ":"),
    children,
    error &&
      h(
        "div",
        {
          style: {
            color: "red",
            backgroundColor: "white",
            padding: 5,
            borderRadius: 5,
          },
        },
        "* ",
        error.message
      )
  );
}

const ThemeContext = M();

function useThemeContext() {
  const context = T$1(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used with ThemeProvider");
  }

  return context;
}

function ThemeProvider(props) {
  const { initState } = props;
  const [state, setState] = v$1(initState);
  return h(
    ThemeContext.Provider,
    _extends(
      {
        value: state,
      },
      props
    )
  );
}

var css_248z$1 =
  ".btn {\n  padding: 6px 16px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: none;\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  min-width: 64px;\n  font-weight: 500;\n  font-size: 0.875rem;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}";
styleInject(css_248z$1);

function Button({ onClick, title, disabled, id, color = "primary" }) {
  const theme = useThemeContext();
  return h(
    "button",
    {
      className: "btn",
      "data-testid": id,
      disabled: disabled,
      style: { ...theme[color] },
      onClick: onClick,
    },
    title
  );
}

function valueChanged({ propName, value }) {
  debugger;
  return {
    type: actionTypes$1.VALUE_CHANGED,
    payload: {
      propName,
      value,
    },
  };
}
async function changePassword({ dispatch, state, formDispatch, token }) {
  dispatch({
    type: actionTypes$1.CHANGE_PASSWORD_STARTED,
  });

  try {
    const { confirm, password } = state;
    debugger;
    const response = await fetch(
      `${"https://localhost:3000"}/auth/changepass`,
      {
        method: "put",
        body: JSON.stringify({
          confirm,
          password,
          token,
        }),
      }
    );
    const result = await response.json();

    if (response.status === 200) {
      const { token, username, email } = result;
      debugger;
      dispatch({
        type: actionTypes$1.CHANGE_PASSWORD_SUCCESS,
        token,
        username,
        email,
        message: `Password changed successfully.`,
      });
      window.localStorage.setItem(
        "webcom",
        JSON.stringify({
          token,
          username,
          email,
        })
      );
    } else if (response.status === 400) {
      const { errors } = result;
      debugger;
      errors.forEach((error) => {
        formDispatch(
          serverValidation({
            status: error,
          })
        );
      });
    } else if (response.status === 500) {
      const { error } = result;
      dispatch({
        type: actionTypes$1.CHANGE_PASSWORD_FAILED,
        error,
      });
    } else {
      throw new Error("Changing password failed");
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.CHANGE_PASSWORD_FAILED,
      payload: {
        error,
      },
    });
  }
}
function getTokenFromUrl({ token }) {
  return {
    type: actionTypes$1.GOT_TOKEN_FROM_URL,
    token,
  };
}

const style$1 = {
  boxShadow: `0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)`,
  margin: 8,
  padding: 8,
};
function Paper(props) {
  const { children } = props;
  return h(
    "div",
    {
      style: style$1,
    },
    children
  );
}

function Grid(props) {
  const { children, width } = props;
  return h(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: `auto ${width}% auto`,
      },
    },
    h("div", null),
    h("div", null, children),
    h("div", null)
  );
}

const RouteContext = M();
function Route(props) {
  const { children, path } = props;
  const [route] = useRouteContext();

  if (route === path) {
    return children;
  }

  return null;
}
function useRouteContext() {
  const context = T$1(RouteContext);

  if (!context) {
    throw new Error("useRouteContext must be used with RouteProvider");
  }

  return context;
} //

function RouteProvider(props) {
  const { initialRoute } = props;
  const [route, setRoute] = v$1(initialRoute);
  const value = s$1(() => [route, setRoute], [route]);
  return h(
    RouteContext.Provider,
    _extends(
      {
        value: value,
      },
      props
    )
  );
}

function useUserName() {
  const [userName, setUsername] = v$1(null);
  const [token, setToken] = v$1(null);
  const [email, setEmail] = v$1("");
  const { state, dispatch } = useAuthContext();
  p$1(() => {
    if (window.localStorage.getItem("webcom")) {
      const { username, token, email } = JSON.parse(
        window.localStorage.getItem("webcom")
      );
      setUsername(username);
      setToken(token);
      setEmail(email);
    }
  }, []);
  p$1(() => {
    if (state.token) {
      const { username, email, token } = state; // const { username, token, email } = JSON.parse(
      //   window.localStorage.getItem('webcom')
      // );

      setUsername(username);
      setToken(token);
      setEmail(email);
    }
  }, [state]);
  return {
    userName,
    token,
    email,
  };
}

function ChangePassword() {
  const { state, dispatch } = useAuthContext();
  const { dispatch: formDispatch } = useFormContext();
  const { token } = useUserName();
  const [route, setRoute] = useRouteContext();
  const { device } = useMediaQuery();
  const { password, confirm, error } = state;
  p$1(() => {
    let url = new URL(window.location.href);
    var urltoken = url.searchParams.get("token");

    if (urltoken) {
      dispatch(
        getTokenFromUrl({
          token: urltoken,
        })
      );
    }
  }, []);
  p$1(() => {
    if (state.authFeedback) {
      setRoute("/authfeedback");
    }
  }, [state.authFeedback]);

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(
      valueChanged({
        propName: name,
        value,
        dispatch,
        state,
      })
    );
  }

  function handleChangePass() {
    dispatch(
      changePassword({
        dispatch,
        state,
        token,
        formDispatch,
      })
    );
  }

  return h(
    Grid,
    {
      width: device === "phone" ? 100 : 25,
    },
    h(
      Paper,
      null,
      h(
        Form,
        {
          formTitle: "Change Password",
          error: error,
        },
        h(Input, {
          value: password,
          type: "password",
          id: "password",
          name: "password",
          placeholder: "Enter new password",
          onChange: handleChange,
          validationTypes: [validationTypes.PASSWORD_FORMAT_VALIDATION],
        }),
        h(Input, {
          value: confirm,
          type: "password",
          id: "confirm",
          name: "confirm",
          placeholder: "Confirm new password",
          onChange: handleChange,
          validationTypes: [validationTypes.PASSWORDS_MATCH_VALIDATION],
        }),
        h(Button, {
          type: "button",
          id: "change-pass-btn",
          "data-testid": "change-pass-btn",
          onClick: handleChangePass,
          title: "Change",
        })
      )
    )
  );
}

function AuthFeedback({ message, children }) {
  const { state } = useAuthContext();
  return h(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 300,
        fontSize: 16,
      },
      "data-testid": "auth-feedback",
    },
    h("div", null, state.authFeedback),
    h("div", null, " ", children)
  );
}
function LoginLink() {
  return h(
    "div",
    null,
    h(
      "a",
      {
        href: `${"https://localhost:3000"}`,
      },
      "Login"
    )
  );
}

H(
  h(
    "div",
    null,
    h(
      FormProvider,
      null,
      h(
        AuthProvider,
        null,
        h(
          ThemeProvider,
          {
            initState: {
              primary: {
                background: "#6200EE",
                color: "#ffffff",
                fontFamily: 'Roboto, Helvetica, "Arial"',
              },
            },
          },
          h(
            RouteProvider,
            {
              initialRoute: "/",
            },
            h(
              Route,
              {
                path: "/",
              },
              h(ChangePassword, null)
            ),
            h(
              Route,
              {
                path: "/authfeedback",
              },
              h(AuthFeedback, null, h(LoginLink, null))
            )
          )
        )
      )
    )
  ),
  document.body
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLXBhc3N3b3JkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9kaXN0L3ByZWFjdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2hvb2tzL2Rpc3QvaG9va3MubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm1SZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vVmFsaWRhdGlvbk1lc3NhZ2UuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9WYWxpZGl0eUljb24uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2F1dGhSZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aC1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS91c2VDbGllbnRWYWxpZGF0aW9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vaWNvbnMvb3BlbkV5ZS5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9pY29ucy9jbG9zZUV5ZS5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9FeWVJY29uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vSW5wdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9Gb3JtLmpzIiwiLi4vLi4vLi4vY2xpZW50L3RoZW1lL3RoZW1lLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9CdXR0b24uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9QYXBlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvR3JpZC5qcyIsIi4uLy4uLy4uL2NsaWVudC9yb3V0ZS9yb3V0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL0NoYW5nZVBhc3N3b3JkLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvQXV0aEZlZWRiYWNrLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvY2hhbmdlLXBhc3N3b3JkL2NoYW5nZS1wYXNzd29yZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3VwcG9ydCA9IHtcbiAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgYmxvYjpcbiAgICAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJlxuICAgICdCbG9iJyBpbiBzZWxmICYmXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG59XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXcob2JqKSB7XG4gIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxufVxuXG5pZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgXVxuXG4gIHZhciBpc0FycmF5QnVmZmVyVmlldyA9XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3IHx8XG4gICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICB9XG4gIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gIH1cbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG4vLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgdmFyIGl0ZXJhdG9yID0ge1xuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXRlcmF0b3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICB0aGlzLm1hcCA9IHt9XG5cbiAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVycykpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgfSwgdGhpcylcbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCAnICsgdmFsdWUgOiB2YWx1ZVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICB9XG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKG5hbWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIGl0ZW1zLnB1c2godmFsdWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbn1cblxuZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgfVxuICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxufVxuXG5mdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgfVxuICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgfVxuICByZXR1cm4gY2hhcnMuam9pbignJylcbn1cblxuZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gIGlmIChidWYuc2xpY2UpIHtcbiAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gIH0gZWxzZSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICB9XG59XG5cbmZ1bmN0aW9uIEJvZHkoKSB7XG4gIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgIGlmICghYm9keSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChib2R5KVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG52YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG5mdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgcmV0dXJuIG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xID8gdXBjYXNlZCA6IG1ldGhvZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgfVxuICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgIHRoaXMuc2lnbmFsID0gaW5wdXQuc2lnbmFsXG4gICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gIH1cblxuICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdzYW1lLW9yaWdpbidcbiAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB9XG4gIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgdGhpcy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbCB8fCB0aGlzLnNpZ25hbFxuICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gIH1cbiAgdGhpcy5faW5pdEJvZHkoYm9keSlcbn1cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHtib2R5OiB0aGlzLl9ib2R5SW5pdH0pXG59XG5cbmZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgYm9keVxuICAgIC50cmltKClcbiAgICAuc3BsaXQoJyYnKVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICByZXR1cm4gZm9ybVxufVxuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgLy8gUmVwbGFjZSBpbnN0YW5jZXMgb2YgXFxyXFxuIGFuZCBcXG4gZm9sbG93ZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlIG9yIGhvcml6b250YWwgdGFiIHdpdGggYSBzcGFjZVxuICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKVxuICBwcmVQcm9jZXNzZWRIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBoZWFkZXJzXG59XG5cbkJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzXG4gIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbn1cblxuQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgIHVybDogdGhpcy51cmxcbiAgfSlcbn1cblxuUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG5SZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbn1cblxuZXhwb3J0IHZhciBET01FeGNlcHRpb24gPSBzZWxmLkRPTUV4Y2VwdGlvblxudHJ5IHtcbiAgbmV3IERPTUV4Y2VwdGlvbigpXG59IGNhdGNoIChlcnIpIHtcbiAgRE9NRXhjZXB0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgbmFtZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdmFyIGVycm9yID0gRXJyb3IobWVzc2FnZSlcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgfVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpXG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBET01FeGNlcHRpb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKGlucHV0LCBpbml0KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICBmdW5jdGlvbiBhYm9ydFhocigpIHtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICB9XG4gICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgfVxuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnb21pdCcpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgfVxuXG4gICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgIH0pXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgIHJlcXVlc3Quc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRE9ORSAoc3VjY2VzcyBvciBmYWlsdXJlKVxuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICByZXF1ZXN0LnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgfSlcbn1cblxuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG5cbmlmICghc2VsZi5mZXRjaCkge1xuICBzZWxmLmZldGNoID0gZmV0Y2hcbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxufVxuIiwidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIElOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOiAnSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUnLFxuICAgIFJFU0VUX1ZBTElEQVRJT05fU1RBVEU6ICdSRVNFVF9WQUxJREFUSU9OX1NUQVRFJyxcbiAgICBJTlBVVF9CTFVSUkVEOiAnSU5QVVRfQkxVUlJFRCcsXG4gICAgSU5QVVRfRk9DVVNFRDogJ0lOUFVUX0ZPQ1VTRUQnLFxuICBcbiAgICBTRVJWRVJfVkFMSURBVElPTjogJ1NFUlZFUl9WQUxJREFUSU9OJyxcbiAgICBDTElFTlRfVkFMSURBVElPTjonQ0xJRU5UX1ZBTElEQVRJT04nLFxuICBcbiAgICBJTkNfSU5QVVRfQ09VVE4gOidJTkNfSU5QVVRfQ09VVE4nXG4gIH07XG4gICIsImV4cG9ydCBkZWZhdWx0IHtcbiAgVkFMSUQ6ICdWQUxJRCcsXG4gIElOVkFMSUQ6ICdJTlZBTElEJyxcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRSdcbn07XG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XG5cbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7IHZhbGlkYXRpb246IHt9IH07XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG5cbiAgbGV0IG5leHRTdGF0ZSA9IG51bGw7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OOlxuICAgICAgbmV4dFN0YXRlID0ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT046XG4gICAgICBuZXh0U3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcblxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5QVVRfRk9DVVNFRDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcbiAgICAgICAgICBbYWN0aW9uLnByb3BOYW1lXToge1xuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTjpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBmb3JtUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9mb3JtUmVkdWNlcic7XG5jb25zdCBGb3JtQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1Db250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChGb3JtQ29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlRm9ybUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggRm9ybVByb3ZpZGVyJyk7XG4gIH1cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xuXG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRm9ybVByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihmb3JtUmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxGb3JtQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUZvcm1Db250ZXh0IH0gZnJvbSAnLi9mb3JtLWNvbnRleHQnO1xuZXhwb3J0IGZ1bmN0aW9uIFZhbGlkYXRpb25NZXNzYWdlKHsgdmFsaWRhdGlvblR5cGVzLG5hbWUgfSkge1xuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VGb3JtQ29udGV4dCgpO1xuICByZXR1cm4gdmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcbiAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV07XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXt2YWxpZGF0aW9uTmFtZX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgICAgICAgcGFkZGluZ0xlZnQ6IDMsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHttZXNzYWdlICE9PSAnJyAmJiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHJvbGU9J21lc3NhZ2UnXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH1cbiAgICAgICAgICAgID57YCogJHttZXNzYWdlfWB9PC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XG5pbXBvcnQgeyB1c2VGb3JtQ29udGV4dCB9IGZyb20gJy4vZm9ybS1jb250ZXh0JztcbmZ1bmN0aW9uIFZhbGlkaXR5VGlja1N0YXRlKHsgdmFsaWQgfSkge1xuICBsZXQgc3RhdGVDb2xvciA9ICcjNGZjM2Y3JztcbiAgc3dpdGNoICh2YWxpZCkge1xuICAgIGNhc2UgdmFsaWRhdGlvblN0YXRlcy5WQUxJRDpcbiAgICAgIHN0YXRlQ29sb3IgPSAnZ3JlZW4nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQ6XG4gICAgICBzdGF0ZUNvbG9yID0gJ3JlZCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIHZhbGlkYXRpb25TdGF0ZXMuSU5BQ1RJVkU6XG4gICAgICBzdGF0ZUNvbG9yID0gJyM0ZmMzZjcnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHN0YXRlQ29sb3IgPSAnIzRmYzNmNyc7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGZsZXg6IDEsXG4gICAgICAgIGNvbG9yOiBzdGF0ZUNvbG9yLFxuICAgICAgICBsaW5lSGVpZ2h0OiAyLFxuICAgICAgICB3aWR0aDogMjAsXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHt2YWxpZCA/ICfinJMnIDogJ+KYkyd9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWYWxpZGl0eUljb24oeyB2YWxpZGF0aW9uVHlwZXMgfSkge1xuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VGb3JtQ29udGV4dCgpO1xuICByZXR1cm4gdmFsaWRhdGlvblR5cGVzLm1hcCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICBpZiAoc3RhdGUudmFsaWRhdGlvblt2YWxpZGF0aW9uTmFtZV0pIHtcbiAgICAgIGNvbnN0IHsgdmFsaWRhdGlvblN0YXRlIH0gPSBzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXTtcbiAgICAgIGlmIChcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlID09PSB2YWxpZGF0aW9uU3RhdGVzLlZBTElEIHx8XG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZSA9PT0gdmFsaWRhdGlvblN0YXRlcy5JTlZBTElEXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8VmFsaWRpdHlUaWNrU3RhdGUga2V5PXt2YWxpZGF0aW9uTmFtZX0gdmFsaWQ9e3ZhbGlkYXRpb25TdGF0ZX0gLz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIFZBTFVFX0NIQU5HRUQ6ICdWQUxVRV9DSEFOR0VEJyxcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxuICBMT0dJTl9TVUNDRVNTOiAnTE9HSU5fU1VDQ0VTUycsXG4gIExPR0lOX0ZBSUxFRDogJ0xPR0lOX0ZBSUxFRCcsXG5cbiAgTE9HT1VUX1NUQVJURUQ6ICdMT0dPVVRfU1RBUlRFRCcsXG4gIExPR09VVF9GQUlMRUQ6ICdMT0dPVVRfRkFJTEVEJyxcbiAgTE9HT1VUX1NVQ0NFU1M6ICdMT0dPVVRfU1VDQ0VTUycsXG5cbiAgU0lHTlVQX1NUQVJURUQ6ICdTSUdOVVBfU1RBUlRFRCcsXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxuICBTSUdOVVBfRkFJTEVEOiAnU0lHTlVQX0ZBSUxFRCcsXG5cbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXG4gIENIQU5HRV9QQVNTV09SRF9TVUNDRVNTOiAnQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MnLFxuICBDSEFOR0VfUEFTU1dPUkRfRkFJTEVEOiAnQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCcsXG5cbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEJyxcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTJyxcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogJ0dPVF9UT0tFTl9GUk9NX1VSTCcsXG59O1xuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgZW1haWw6ICcnLFxuICBwYXNzd29yZDogJycsXG4gIHN1Y2Nlc3M6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgdXNlcm5hbWU6ICcnLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgY29uZmlybTogJycsXG4gIGN1cnJlbnQ6ICcnLFxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxuICB0b2tlbjogbnVsbCxcbiAgaXNMb2dnZWRJbjogZmFsc2UsXG4gIGlzUGFzc3dvcmRDaGFuZ2VkOiBmYWxzZSxcbiAgYXV0aEZlZWRiYWNrOiBudWxsLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRDpcbiAgICAgICAgICBjb25zdCBuZXh0U3RhdGUgPSB7IC4uLnN0YXRlLCBbYWN0aW9uLnBheWxvYWQucHJvcE5hbWVdOiBhY3Rpb24ucGF5bG9hZC52YWx1ZSB9XG4gICAgICAgICAgZGVidWdnZXI7XG4gICAgICByZXR1cm4gbmV4dFN0YXRlXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlcm5hbWUsXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lLCAnLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcbiAgICAgICAgZW1haWw6IGFjdGlvbi5lbWFpbCxcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUnLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlcm5hbWUsXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXG4gICAgICAgIGlzUGFzc3dvcmRDaGFuZ2VkOiB0cnVlLFxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxuICAgXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5pbml0U3RhdGUgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2F1dGhSZWR1Y2VyJztcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuXG5mdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XG4gIH1cblxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XG5cblxuICByZXR1cm4ge1xuICAgIHN0YXRlLFxuICAgIGRpc3BhdGNoLFxuICB9O1xufVxuXG5mdW5jdGlvbiBBdXRoUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cblxuZXhwb3J0IHsgdXNlQXV0aENvbnRleHQsIEF1dGhQcm92aWRlciB9O1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAvL2NvbnN0cmFpbnRcbiAgRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdFTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXG4gIFBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOiAnUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04nLFxuICBVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OJyxcbiAgVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXG4gIEVNUFRZX1NUUklOR19WQUxJREFUSU9OOiAnRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04nLFxuICBQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjogJ1BBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OJyxcbiAgLy9hdXRoXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdJTlZBTElEX0NSRURFTlRJQUxTJyxcbiAgVVNFUk5BTUVfVEFLRU46ICdVU0VSTkFNRV9UQUtFTicsXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdSRUdJU1RFUkVEX0VNQUlMJyxcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdFTUFJTF9OT1RfUkVHSVNURVJFRCcsXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOidVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCdcbn07XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOVkFMSURfUEFTU1dPUkQ6XG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxuICBJTlZBTElEX0VNQUlMOiAnZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZCcsXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnZW1haWwgaXMgbm90IHJlZ2lzdGVyZWQnLFxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcbiAgSU5WQUxJRF9VU0VSTkFNRTpcbiAgICAnb25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWQnLFxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ2VtcHR5IHN0cmluZyBpcyBub3QgYWxsb3dlZCcsXG4gIElOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUw6ICdlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWQnLFxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnLFxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCdcbn07XG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XG5cbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xuXG5leHBvcnQgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9bYS16QS1aXStbLV9dKlthLXpBLVpdKy9nO1xuIiwiaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XG5cbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XG4gIGNvbnN0IHBhc3N3b3JkQ29uc3RyYWludCA9IG5ldyBSZWdFeHAocGFzc3dvcmRSZWdleCk7XG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgfTtcbiAgfVxuICBpZiAoIXBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xuXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcblxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pIHtcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pIHtcblxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtIH0gPWF1dGg7XG5kZWJ1Z2dlcjtcbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxuICAgIH07XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgLy9sb2dpblxuICBjcmVkZW50aWFsSW52YWxpZDogJzQwMScsXG4gIC8vc2lnbnVwXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXG4gIGVtYWlsSXNSZWdpc3RlcmVkOiAnNDAzJyxcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcbiAgZW1haWxJbnZhbGlkOiAnNDA3JyxcbiAgLy9sb2dpblxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXG4gIGVtcHR5U3RyaW5nTm90VmFsaWQ6ICc0MDknLFxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXG4vL2NoYW5nZSBwYXNzd29yZFxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcbiAgc2VydmVyVmFsaWRhdGlvblJhbmdlOiBzdGF0dXMgPT4ge1xuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG4iLCJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xuaW1wb3J0IGNvbnN0VmFsVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZSwgdmFsdWUsIHN0YXRlLGF1dGggfSkge1xuXG4gIGxldCB2YWxpZGF0aW9uID0gbnVsbDtcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7XG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcbiAgICAgICAgdmFsdWUsXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHtcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxuICAgXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OLCAuLi52YWxpZGF0aW9uIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0Rm9ybVZhbGlkYXRpb25TdGF0ZSgpIHtcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE4gfTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAgfSkge1xuXG4gIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxuICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcbiAgICAgIH07XG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUludmFsaWQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5SRUdJU1RFUkVEX0VNQUlMLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcbiAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTixcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVN0cmluZ05vdFZhbGlkOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXG4gICAgICB9O1xuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyB1c2VGb3JtQ29udGV4dCB9IGZyb20gJy4vZm9ybS1jb250ZXh0JztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuaW1wb3J0IHsgaXNDbGllbnRWYWxpZGF0aW9uVHlwZSB9IGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZXMsIHZhbHVlLCBuYW1lIH0pIHtcbiAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUZvcm1Db250ZXh0KCk7XG4gIGNvbnN0IHsgc3RhdGU6IGF1dGggfSA9IHVzZUF1dGhDb250ZXh0KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYXV0aC5wYXNzd29yZCkge1xuICAgZGVidWdnZXI7XG4gICAgfVxuICB9LCBbYXV0aF0pO1xuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xuICAgIGRlYnVnZ2VyO1xuICAgIHZhbGlkYXRpb25UeXBlcy5mb3JFYWNoKCh2YWxpZGF0aW9uTmFtZSkgPT4ge1xuICAgICAgaWYgKGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUgfSkpIHtcbiAgICAgICAgZGlzcGF0Y2goXG4gICAgICAgICAgYWN0aW9ucy5jbGllbnRWYWxpZGF0aW9uKHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uTmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBhdXRoW25hbWVdLFxuICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICBhdXRoLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFZhbGlkYXRpb25TdGF0ZSgpIHtcbiAgICB2YWxpZGF0aW9uVHlwZXMuZm9yRWFjaCgodmFsaWRhdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmIChzdGF0ZS52YWxpZGF0aW9uW3ZhbGlkYXRpb25OYW1lXSkge1xuICAgICAgICBkaXNwYXRjaChcbiAgICAgICAgICBhY3Rpb25zLnJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvbk5hbWUgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7IHZhbGlkYXRlLCByZXNldFZhbGlkYXRpb25TdGF0ZSB9O1xufVxuIiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBQ3NrbEVRVlI0bk8yYXUyNFRRUlNHUDlzSzBGZ2lJZ0xsSW9VdXFRTlVWT0hTbUJMZWdIUVVnUzdQZ1pJT2hLbUlZaWhpM3NBSUNRcFNKS0VFQ1NzR2drS0xKVXVSS1dZV0hMT0xkK2ZNN3RyeCthU1JKV3RuL3YvWXU3TXpadzRvaXFJb2lxSW9paktPRkRMUU9BTmNBYTREUzhCRjRBSXdaVDhCZmdKSDl2TUhzQU84QlQ0QW5RdzhldWNTc0FhOEFkcEExN0cxN1JocmRzeWhwZ0RjQm1xWWY4MDE2S2pXc1dQZklwczdOeEUzZ0YzOEJ4M1ZkcTFtN2x3R1hwRmQ0UDN0SlRDZmRwQlJQRVQyZlB0cWJXQTE1VmhQY0JaNDdqa0lINjFxdmFYS0RQQSt4eUFIdFhmQWRGckJ6d0ZOb2NFbXNBNVVnQVdnYk51Qy9XN2RnOFlYNjlVcms4QkhnYWtENEQ1UWlxRlZzdGUyQkhyN3dIbFJ4RDJjd3l4R1hNMXNZLzdscEpTQnVrQzNZYjJMMlJTWWVBd1VCZHBGTzRhci9xWkFHNEI3QXZGdC9Lellpc2p1aEx1dXdwUEFkMGZSQTl4dSt5akt1TThKMzJ3c2lhazZDbll4azVodlZnUituaVVWdXlZUWF4SnZ0azlLQ2RrcjhtcllvRkVUMUNPQjBUcHdMT2dmeFRId1d0QS9ka3l6eUxhekZZSEpRVlFFdmpxWWxld0p3dTZBQjhDRXdPUW5RZDlCZkJiMG5jREVOcEJEM0gvbExuNW4vMzdLUW0rSC9RTktGaW1uZ3JBZjRLbHd6SCtlTTQvTUN2cy9pU3N5MXBOZ0M1TnFrcGhNaXp1Q3ZqWGdhOXlMeDJZaDlEK3FBckdSWHdxRGJEUFU0aFJzaGtDK0hmYnhtczF0T3h3d3lnbVJGd0x0UDBoVFluVkdQQ1VHNWhuYUY1aHBZU2F4dUVuUkZXUkowVDA4SmtVRDVqQXBaMWRUWGN4cmJBT3pWbGprYjFwODBYNjN3WkNteFFObU1JY1BFb05wdGxRUFJnTEcrbWlzbDFXRzQzRDBGeGtmanZZeWo5azM1QlY4alJ5UHgzdFpKdnNDaWVWTUlrdEFBVk8rc2tWNkpUSmJ3RTJHc0VTbW42Qklxb0c4U0twQmlrVlNXWlhKTFJGZUpqZGxyemtpdkV4dWh4RXRrMU1VUlZFVVJWRVVaYmo1RGNrTUZlUWhyRmo5QUFBQUFFbEZUa1N1UW1DQ1wiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVlBQUFDcWFYSGVBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRHMwbEVRVlI0bk8zYlMyaGNWUnpIOFU5YW85SXltb0lvU21PcUxhMHJONzV3SzRKYXRKUWFGZXpDaU5LdGlGQmM2TktWZENPS0MxRXJJb29Lb3FDQzRGdlJqU0sxaWk1RURXaE5VZkVGZ1JpTWl6T1JOTDAzY3g1eloySnlmL0FuTU1tYzMvLy96Ym4zbnRlbFZhdFdyVTdVWHN4MFk5K1FjeG1LWnJEUWpiOHhPZHgwQnErbEFOWWxoSDFDMGNzaDNEVE1wQWF0U1MyRVdnZzNEek9wUWF1RllJMURHSW44dTBrOGkxT1dmRGFQL1hpK3gzZTM0REpjM0kxZDNjL083TVkvK0FVL2QzOGV4NmY0RUo5Z0xqTEh4bFhWRStaVjk0UUxjRGZlcnZoT1NzemlmZHlMYzVvcEswMjlJRnlOVjRYL2FtN1JkVEdIRjdvZXNUMjNFZFZCK0ZML2k2NkxJN2lxNlVKWFVoV0VZY1NMbUdpNDFscXRGZ2l6dUt2aFdtdTFXaUFzNERCT2E3VGFHcTBtQ0IvajNLWUtQUjl2WVh2RjcySWhITU1oWEM5Y3U1dlFFY1lHdS9Fd3BpUGFXU20reDlZKzFnM094dGRkZzJucEVIN0NGRVlqdkRiaUR2eFEwMVpNSE1WWWFwRjEyaXlNeUpZYXBFSTRrT0hid1NzVmJjWEdlemc5dy9ja1BWRmprQUpoSHJka2VHL0FRelgrTWZGY2h1Y0oydC9EWUZBUVNuckNqUm1lNER6OEdXRXdDQWdkK2ZlRVk4TGtLMW1IRTB3R0FlSE9oSHlXeDVPcFpwZGttRFFOWWFPeVIrU2xLV2F2WlpwTVkxdEZlLzJDOEVobVhndDRKdFprdTdMcDdMVTE3ZllEd3U2Q3ZPYUUrMXBQUFZoZ3NvRHhGZG91aFhCUllXNFB4SmdjTHpUcE5TRXBnZEFwekcwbXdxTVlRTXdRTkJmQ3BzTGNvZ0FjS2pTNUlzWkVIb1NKd3R5aUxvRmRoU2EzeFpoMGxRcmhob0s4b20rQzhIcUIwV094SmwybFFDanBuZEdQUWZJR1Fvc3hpN05Tek1SQkdCV0d0Ymw1SlEyRUNCc2V1V2IzcDVycERXR3FJSi9ITS9LeEZiOW5HdjZCblJtZWRSQU9DSXNxT2JuOHFHQng1UFpNMHdWOExpeW1wS3JmYTR4N00zTDRUeVBLTG9XWERCZkNVeG5lSjJtenNGbVptOFFSN01qd0xZWHdKazdOOEszVU9MNHJTT1kzM0tjL1Q0ZVkrQXhuWk5TNW9yYmgyNHhrbHNhc01FNllFa2FNWThMY1lSelhxTjdtU29Yd2pZYjNCbzRtSkpNYU9VdnVTK01kNmIwc1dSMjhISkhNb0NFOEttN2ZvUy9hZ0h1RUxyMGFJRHpkL3hManRCUHZWaVEwYUFoMUoxVUdvaEhzMGN3QmlmOE5CTUtxN1I2OG9mOFFMcXp3VzVVUUZyVURCL0dSc3VMbmhEMis2MnA4aW8vd0RlS3cwUmd1eDVYQ291YUU4RGp0Q0dPQVVXSHk5S3R3Vk80cmZDR01JRC9BWHozYXJ6dkNkNnR3cUdwZHFEM2JySVdBZWdqcjZuMkhGb0o2Q092cUhhZ3FDRkViSTJ0Snl5R3NPd0NFYnIvNEdtRFIrbUNyVnEzV252NEZycmN1ajJPZlI1c0FBQUFBU1VWT1JLNUNZSUk9XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCBvcGVuSWNvbiBmcm9tICcuL2ljb25zL29wZW5FeWUucG5nJztcbmltcG9ydCBjbG9zZUljb24gZnJvbSAnLi9pY29ucy9jbG9zZUV5ZS5wbmcnO1xuZnVuY3Rpb24gSWNvblN0YXRlKHsgb3BlbiB9KSB7XG4gIGlmIChvcGVuKSB7XG4gICAgcmV0dXJuIDxpbWcgc3R5bGU9e3sgd2lkdGg6IDI1IH19IHNyYz17b3Blbkljb259IC8+O1xuICB9XG4gIHJldHVybiA8aW1nIHN0eWxlPXt7IHdpZHRoOiAyNSB9fSBzcmM9e2Nsb3NlSWNvbn0gLz47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEV5ZUljb24oeyBvbkNsaWNrLGlucHV0VHlwZSB9KSB7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBmdW5jdGlvbiB0b2dnbGUoKSB7XG4gICAgb25DbGljaygpO1xuICAgIHNldFN0YXRlKChwcmV2KSA9PiAhcHJldik7XG4gIH1cbiAgaWYgKGlucHV0VHlwZSA9PT0gJ3Bhc3N3b3JkJylcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBvbkNsaWNrPXt0b2dnbGV9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBtYXJnaW46IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxJY29uU3RhdGUgb3Blbj17c3RhdGV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gIHJldHVybiBudWxsO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5cbmltcG9ydCB7IFZhbGlkYXRpb25NZXNzYWdlIH0gZnJvbSAnLi9WYWxpZGF0aW9uTWVzc2FnZSc7XG5pbXBvcnQgeyBWYWxpZGl0eUljb24gfSBmcm9tICcuL1ZhbGlkaXR5SWNvbic7XG5pbXBvcnQgeyB1c2VDbGllbnRWYWxpZGF0aW9uIH0gZnJvbSAnLi91c2VDbGllbnRWYWxpZGF0aW9uJztcbmltcG9ydCBFeWVJY29uIGZyb20gJy4vRXllSWNvbic7XG5cbmNvbnN0IHN0eWxlID0ge1xuICBpbnB1dDoge1xuICAgIGJvcmRlcjogJzFweCBzb2xpZCcsXG4gICAgcGFkZGluZzogOCxcbiAgICBmbGV4OiAxMCxcbiAgICBib3JkZXJSYWRpdXM6IDIsXG4gIH0sXG4gIHJvb3Q6IHtcbiAgICBib3JkZXJSYWRpdXM6IDIsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnLFxuICAgIG1hcmdpbkJvdHRvbTogMSxcbiAgfSxcbiAgaW5wdXRDb250YWluZXI6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleDogMSxcbiAgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnB1dCh7XG4gIHBsYWNlaG9sZGVyLFxuICB0eXBlLFxuICBuYW1lLFxuICBvbkNoYW5nZSxcbiAgdmFsdWUgPSAnJyxcbiAgdmFsaWRhdGlvblR5cGVzID0gW10sXG4gIGlkLFxufSkge1xuICBjb25zdCB7IHZhbGlkYXRlLCByZXNldFZhbGlkYXRpb25TdGF0ZSB9ID0gdXNlQ2xpZW50VmFsaWRhdGlvbih7XG4gICAgdmFsaWRhdGlvblR5cGVzLFxuICAgIHZhbHVlLFxuICAgIG5hbWUsXG4gIH0pO1xuICBjb25zdCBbZm9jdXNlZCwgc2V0Rm9jdXNlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpbnB1dFR5cGUsIHNldElucHV0VHlwZV0gPSB1c2VTdGF0ZSh0eXBlKTtcblxuICBmdW5jdGlvbiBoYW5kbGVGb2N1cygpIHtcbiAgICByZXNldFZhbGlkYXRpb25TdGF0ZSgpO1xuICAgIHNldEZvY3VzZWQodHJ1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQmx1cihlKSB7XG4gICAgaWYgKGUudGFyZ2V0Lm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgdmFsaWRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGVFeWUoKSB7XG4gICAgaWYgKGlucHV0VHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgc2V0SW5wdXRUeXBlKCd0ZXh0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldElucHV0VHlwZSgncGFzc3dvcmQnKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZS5yb290fT5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmlucHV0Q29udGFpbmVyfT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgc3R5bGU9e3sgLi4uc3R5bGUuaW5wdXQgfX1cbiAgICAgICAgICB0eXBlPXtpbnB1dFR5cGV9XG4gICAgICAgICAgbmFtZT17bmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgICAgb25Gb2N1cz17aGFuZGxlRm9jdXN9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxuICAgICAgICAvPlxuICAgICAgICA8VmFsaWRpdHlJY29uIHZhbGlkYXRpb25UeXBlcz17dmFsaWRhdGlvblR5cGVzfSAvPlxuICAgICAgICA8RXllSWNvbiBpbnB1dFR5cGU9e3R5cGV9IG9uQ2xpY2s9e3RvZ2dsZUV5ZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPFZhbGlkYXRpb25NZXNzYWdlIHZhbGlkYXRpb25UeXBlcz17dmFsaWRhdGlvblR5cGVzfSBuYW1lPXtuYW1lfSAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KCkge1xuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtvcmllbnRhdGlvbiwgc2V0T3JpZW50YXRpb25dID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XG4gICAgc2V0V2lkdGgod2luZG93LmlubmVyV2lkdGgpO1xuICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKSB7XG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XG4gIH1cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAod2lkdGggPiAwKSB7XG4gICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA2MDA6XG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHdpZHRoIDw9IDc2ODpcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcbiAgICAgICAgICBzZXREZXZpY2UoJ3RhYmxldCcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XG4gICAgICAgICAgc2V0RGV2aWNlKCdsYXB0b3AnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XG4gICAgICAgICAgc2V0RGV2aWNlKCdkZXNrdG9wJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc2V0RGV2aWNlKCcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFt3aWR0aF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ2RldmljZScsIGRldmljZSk7XG4gIH0sIFtkZXZpY2VdKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBoYW5kbGVWaWV3cG9ydFNpemUoKTtcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gaGFuZGxlVmlld3BvcnRTaXplKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigpO1xuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XG4vL2ltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9ybSh7IGNoaWxkcmVuLCBmb3JtVGl0bGUsIGVycm9yIH0pIHtcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnk7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgIC8vY2xhc3NOYW1lPVwicGFwZXJcIlxuICAgIC8vICBzdHlsZT17eyB3aWR0aDogZGV2aWNlID09PSAncGhvbmUnID8gJzEwMCUnIDogMzUwIH19XG4gICAgPlxuICAgICAgPGxlZ2VuZD57Zm9ybVRpdGxlfTo8L2xlZ2VuZD5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICAgIHtlcnJvciAmJiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgcGFkZGluZzogNSxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgKiB7ZXJyb3IubWVzc2FnZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5cbmNvbnN0IFRoZW1lQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xuXG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFRoZW1lUHJvdmlkZXInKTtcbiAgfVxuXG5cbiAgcmV0dXJuIGNvbnRleHRcbn1cblxuXG5mdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XG4gIFxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XG5cbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0U3RhdGUpO1xuXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcbn1cblxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0LCBUaGVtZVByb3ZpZGVyIH07XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHtcbiAgb25DbGljayxcbiAgdGl0bGUsXG4gIGRpc2FibGVkLFxuICBpZCxcbiAgY29sb3IgPSAncHJpbWFyeScsXG59KSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgY2xhc3NOYW1lPSdidG4nXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XG4gICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICBzdHlsZT17eyAuLi50aGVtZVtjb2xvcl0gfX1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAge3RpdGxlfVxuICAgIDwvYnV0dG9uPlxuICApO1xufVxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IHsgc2VydmVyVmFsaWRhdGlvbiB9IGZyb20gJy4uL2Zvcm0vYWN0aW9ucyc7XG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuLi9mb3JtL2h0dHAtc3RhdHVzJztcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xuZGVidWdnZXI7XG4gIHJldHVybiB7XG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCxcbiAgICBwYXlsb2FkOiB7XG4gICAgICBwcm9wTmFtZSxcbiAgICAgIHZhbHVlLFxuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9sb2dpbmAsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICcqJyxcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJhc2ljICR7YnRvYShgJHtlbWFpbG9ydXNlcm5hbWV9OiR7cGFzc3dvcmR9YCl9YCxcbiAgICAgIH0sXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0pO1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAnd2ViY29tJyxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgIGVtYWlsLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xuICAgICAgZGVidWdnZXI7XG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgZm9ybURpc3BhdGNoKFxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2dpbiBmYWlsZWQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGVidWdnZXI7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbnVwKHsgZGlzcGF0Y2gsIGZvcm1EaXNwYXRjaCwgc3RhdGUgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCwgdXNlcm5hbWUgfSA9IHN0YXRlO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3NpZ251cGAsIHtcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGFzc3dvcmQsIGVtYWlsLCB1c2VybmFtZSB9KSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgfSk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XG5cbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSk7XG4gXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICd3ZWJjb20nLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgZW1haWwsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBmb3JtRGlzcGF0Y2goXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWdudXAgZmFpbGVkJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGVyciA9IGVycm9yO1xuICAgIGRlYnVnZ2VyO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0KCkge1xuICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3dlYmNvbScpO1xuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUyB9O1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2gsIHRva2VuIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGNvbmZpcm0sIHBhc3N3b3JkIH0gPSBzdGF0ZTtcbmRlYnVnZ2VyO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpX3VybH0vYXV0aC9jaGFuZ2VwYXNzYCwge1xuICAgICAgbWV0aG9kOiAncHV0JyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY29uZmlybSxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIHRva2VuLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyxcbiAgICAgICAgdG9rZW4sXG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICBlbWFpbCxcbiAgICAgICAgbWVzc2FnZTogYFBhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LmAsXG4gICAgICB9KTtcblxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAnd2ViY29tJyxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgIGVtYWlsLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xuICAgICAgZGVidWdnZXI7XG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgZm9ybURpc3BhdGNoKFxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xuXG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXG4gICAgICAgIGVycm9yLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXG4gICAgICBwYXlsb2FkOiB7IGVycm9yIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkge1xuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3JlcXVlc3RwYXNzY2hhbmdlYCwge1xuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsIH0pLFxuICAgIH0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxuICAgICAgICBtZXNzYWdlOiBgQSBsaW5rIGZvciBwYXNzd29yZCBjaGFuZ2UgIGhhcyBiZWVuIHNlbnQgdG8sICR7ZW1haWx9ISBgLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBmb3JtRGlzcGF0Y2goXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XG5cbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXG4gICAgICAgIGVycm9yLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxuICAgICAgcGF5bG9hZDogeyBlcnJvcjogZXJyIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcblxuICByZXR1cm4ge1xuICAgIHR5cGU6IGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTCxcbiAgICB0b2tlbixcbiAgfTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgYm94U2hhZG93OiBgMHB4IDNweCAzcHggLTJweCByZ2JhKDAsIDAsIDAsIDAuMiksXG4gICAgMHB4IDNweCA0cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xNCksIDBweCAxcHggOHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTIpYCxcbiAgbWFyZ2luOiA4LFxuICBwYWRkaW5nOiA4LFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIFBhcGVyKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xuICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9PntjaGlsZHJlbn08L2Rpdj47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIEdyaWQocHJvcHMpIHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgd2lkdGggfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6ICdncmlkJyxcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogYGF1dG8gJHt3aWR0aH0lIGF1dG9gLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8ZGl2PjwvZGl2PlxuICAgICAgPGRpdj57Y2hpbGRyZW59PC9kaXY+XG4gICAgICA8ZGl2PjwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5cbmNvbnN0IFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xuICBjb25zdCBbcm91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XG5cbiAgaWYgKHJvdXRlID09PSBwYXRoKSB7XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMaW5rKHByb3BzKSB7XG4gIGNvbnN0IHsgdG8sIGlkIH0gPSBwcm9wcztcbiAgY29uc3QgW3JvdXRlLHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNldFJvdXRlKHRvKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxhXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICBocmVmPXt0b31cbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxuICAgICAgc3R5bGU9e3sgdGV4dERlY29yYXRpb246ICdub25lJywgY29sb3I6ICdpbmhlcml0JyB9fVxuICAgIC8+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VSb3V0ZUNvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFJvdXRlQ29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFJvdXRlUHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuLy9cbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IHtpbml0aWFsUm91dGV9PXByb3BzXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoaW5pdGlhbFJvdXRlKTtcblxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3JvdXRlLCBzZXRSb3V0ZV0sIFtyb3V0ZV0pO1xuXG4gIHJldHVybiA8Um91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XG5leHBvcnQgZnVuY3Rpb24gdXNlVXNlck5hbWUoKSB7XG4gIGNvbnN0IFt1c2VyTmFtZSwgc2V0VXNlcm5hbWVdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCB7IHN0YXRlLGRpc3BhdGNoIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwgfSA9IEpTT04ucGFyc2UoXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJylcbiAgICAgICk7XG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XG4gICAgICBzZXRUb2tlbih0b2tlbik7XG4gICAgICBzZXRFbWFpbChlbWFpbCk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc3RhdGUudG9rZW4pIHtcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0b2tlbiB9ID1zdGF0ZTtcbiAgICAgIC8vIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCB9ID0gSlNPTi5wYXJzZShcbiAgICAgIC8vICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxuICAgICAgLy8gKTtcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcbiAgICAgIHNldFRva2VuKHRva2VuKTtcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcbiAgICB9XG4gIH0sIFtzdGF0ZV0pO1xuXG4gIHJldHVybiB7IHVzZXJOYW1lLCB0b2tlbiwgZW1haWwgfTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9mb3JtL0lucHV0JztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2Zvcm0vQnV0dG9uJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgeyB1c2VGb3JtQ29udGV4dCB9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0JztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XG5pbXBvcnQgeyBQYXBlciB9IGZyb20gJy4uL2xheW91dC9QYXBlcic7XG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnLi4vbGF5b3V0L0dyaWQnO1xuaW1wb3J0IHsgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCB7IHVzZVVzZXJOYW1lIH0gZnJvbSAnLi91c2VVc2VyTmFtZSc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDaGFuZ2VQYXNzd29yZCgpIHtcbiAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgZGlzcGF0Y2g6IGZvcm1EaXNwYXRjaCB9ID0gdXNlRm9ybUNvbnRleHQoKTtcbiAgY29uc3QgeyB0b2tlbiB9ID0gdXNlVXNlck5hbWUoKTtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcblxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtLCBlcnJvciB9ID0gc3RhdGU7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgdmFyIHVybHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XG5cbiAgICBpZiAodXJsdG9rZW4pIHtcbiAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW46IHVybHRva2VuIH0pKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzdGF0ZS5hdXRoRmVlZGJhY2spIHtcbiAgICAgIHNldFJvdXRlKCcvYXV0aGZlZWRiYWNrJyk7XG4gICAgfVxuICB9LCBbc3RhdGUuYXV0aEZlZWRiYWNrXSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldDtcbiAgICBkaXNwYXRjaChcbiAgICAgIGFjdGlvbnMudmFsdWVDaGFuZ2VkKHtcbiAgICAgICAgcHJvcE5hbWU6IG5hbWUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgc3RhdGUsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlUGFzcygpIHtcbiAgICBkaXNwYXRjaChcbiAgICAgIGFjdGlvbnMuY2hhbmdlUGFzc3dvcmQoe1xuICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIHRva2VuLFxuICAgICAgICBmb3JtRGlzcGF0Y2gsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8R3JpZCB3aWR0aD17ZGV2aWNlID09PSAncGhvbmUnID8gMTAwIDogMjV9PlxuICAgICAgPFBhcGVyPlxuICAgICAgICA8Rm9ybSBmb3JtVGl0bGU9J0NoYW5nZSBQYXNzd29yZCcgZXJyb3I9e2Vycm9yfT5cbiAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xuICAgICAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xuICAgICAgICAgICAgbmFtZT0ncGFzc3dvcmQnXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nRW50ZXIgbmV3IHBhc3N3b3JkJ1xuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W3ZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTl19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgIHZhbHVlPXtjb25maXJtfVxuICAgICAgICAgICAgdHlwZT0ncGFzc3dvcmQnXG4gICAgICAgICAgICBpZD0nY29uZmlybSdcbiAgICAgICAgICAgIG5hbWU9J2NvbmZpcm0nXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nQ29uZmlybSBuZXcgcGFzc3dvcmQnXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OXX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICAgIGlkPSdjaGFuZ2UtcGFzcy1idG4nXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nY2hhbmdlLXBhc3MtYnRuJ1xuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQ2hhbmdlUGFzc31cbiAgICAgICAgICAgIHRpdGxlPSdDaGFuZ2UnXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Gb3JtPlxuICAgICAgPC9QYXBlcj5cbiAgICA8L0dyaWQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aEZlZWRiYWNrKHsgbWVzc2FnZSwgY2hpbGRyZW4gfSkge1xuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xuXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGhlaWdodDogMzAwLFxuICAgICAgICBmb250U2l6ZTogMTYsXG4gICAgICB9fVxuICAgICAgZGF0YS10ZXN0aWQ9J2F1dGgtZmVlZGJhY2snXG4gICAgPlxuICAgICAgPGRpdj57c3RhdGUuYXV0aEZlZWRiYWNrfTwvZGl2PlxuXG4gICAgICA8ZGl2PiB7Y2hpbGRyZW59PC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMb2dpbkxpbmsoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxhIGhyZWY9e2Ake2FwaV91cmx9YH0+TG9naW48L2E+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgJ3doYXR3Zy1mZXRjaCc7XG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IENoYW5nZVBhc3N3b3JkIGZyb20gJy4uL0NoYW5nZVBhc3N3b3JkJztcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IEZvcm1Qcm92aWRlciB9IGZyb20gJy4uLy4uL2Zvcm0vZm9ybS1jb250ZXh0JztcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIFJvdXRlIH0gZnJvbSAnLi4vLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi8uLi90aGVtZS90aGVtZS1jb250ZXh0JztcbmltcG9ydCBBdXRoRmVlZGJhY2ssIHsgTG9naW5MaW5rIH0gZnJvbSAnLi4vQXV0aEZlZWRiYWNrJztcbnJlbmRlcihcbiAgPGRpdj5cbiAgICA8Rm9ybVByb3ZpZGVyPlxuICAgICAgPEF1dGhQcm92aWRlcj5cbiAgICAgICAgPFRoZW1lUHJvdmlkZXJcbiAgICAgICAgICBpbml0U3RhdGU9e3tcbiAgICAgICAgICAgIHByaW1hcnk6IHtcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyM2MjAwRUUnLFxuICAgICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBIZWx2ZXRpY2EsIFwiQXJpYWxcIicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9Jy8nPlxuICAgICAgICAgICAgPFJvdXRlIHBhdGg9Jy8nPlxuICAgICAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgLz5cbiAgICAgICAgICAgIDwvUm91dGU+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XG4gICAgICAgICAgICAgIDxBdXRoRmVlZGJhY2s+XG4gICAgICAgICAgICAgICAgPExvZ2luTGluayAvPlxuICAgICAgICAgICAgICA8L0F1dGhGZWVkYmFjaz5cbiAgICAgICAgICAgIDwvUm91dGU+XG4gICAgICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxuICAgICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgICA8L0F1dGhQcm92aWRlcj5cbiAgICA8L0Zvcm1Qcm92aWRlcj5cbiAgPC9kaXY+LFxuICBkb2N1bWVudC5ib2R5XG4pO1xuIl0sIm5hbWVzIjpbImZldGNoIiwidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSIsIlJFU0VUX1ZBTElEQVRJT05fU1RBVEUiLCJJTlBVVF9CTFVSUkVEIiwiSU5QVVRfRk9DVVNFRCIsIlNFUlZFUl9WQUxJREFUSU9OIiwiQ0xJRU5UX1ZBTElEQVRJT04iLCJJTkNfSU5QVVRfQ09VVE4iLCJWQUxJRCIsIklOVkFMSUQiLCJJTkFDVElWRSIsImluaXRTdGF0ZSIsInZhbGlkYXRpb24iLCJmb3JtUmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwibmV4dFN0YXRlIiwidHlwZSIsImFjdGlvblR5cGVzIiwidmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0aW9uU3RhdGUiLCJtZXNzYWdlIiwiZm9ybVN0YXRlIiwicHJvcE5hbWUiLCJjb3VudCIsIkZvcm1Db250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUZvcm1Db250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsImRpc3BhdGNoIiwiRm9ybVByb3ZpZGVyIiwicHJvcHMiLCJ1c2VSZWR1Y2VyIiwidmFsdWUiLCJ1c2VNZW1vIiwiVmFsaWRhdGlvbk1lc3NhZ2UiLCJ2YWxpZGF0aW9uVHlwZXMiLCJuYW1lIiwibWFwIiwidmFsaWRhdGlvbk5hbWUiLCJjb2xvciIsInBhZGRpbmdMZWZ0IiwiVmFsaWRpdHlUaWNrU3RhdGUiLCJ2YWxpZCIsInN0YXRlQ29sb3IiLCJ2YWxpZGF0aW9uU3RhdGVzIiwiZmxleCIsImxpbmVIZWlnaHQiLCJ3aWR0aCIsInRleHRBbGlnbiIsIlZhbGlkaXR5SWNvbiIsIlZBTFVFX0NIQU5HRUQiLCJMT0dJTl9TVEFSVEVEIiwiTE9HSU5fU1VDQ0VTUyIsIkxPR0lOX0ZBSUxFRCIsIkxPR09VVF9TVEFSVEVEIiwiTE9HT1VUX0ZBSUxFRCIsIkxPR09VVF9TVUNDRVNTIiwiU0lHTlVQX1NUQVJURUQiLCJTSUdOVVBfU1VDQ0VTUyIsIlNJR05VUF9GQUlMRUQiLCJDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCIsIkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTIiwiQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyIsIlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEIiwiR09UX1RPS0VOX0ZST01fVVJMIiwiZW1haWwiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJlcnJvciIsInVzZXJuYW1lIiwibG9hZGluZyIsImNvbmZpcm0iLCJjdXJyZW50IiwiZW1haWxvcnVzZXJuYW1lIiwidG9rZW4iLCJpc0xvZ2dlZEluIiwiaXNQYXNzd29yZENoYW5nZWQiLCJhdXRoRmVlZGJhY2siLCJhdXRoUmVkdWNlciIsInBheWxvYWQiLCJzdWNjZXNzTWVzc2FnZSIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJFTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJpc0NsaWVudFZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsaWRhdGVFbXB0eVN0cmluZyIsImxlbmd0aCIsInZhbGlkYXRlUGFzc3dvcmRNYXRjaCIsImF1dGgiLCJjcmVkZW50aWFsSW52YWxpZCIsInVzZXJuYW1lSXNUYWtlbiIsImVtYWlsSXNSZWdpc3RlcmVkIiwidXNlcm5hbWVJbnZhbGlkIiwicGFzc3dvcmRJbnZhbGlkIiwiZW1haWxJbnZhbGlkIiwiZW1haWxJc05vdFJlZ2lzdGVyZWQiLCJlbXB0eVN0cmluZ05vdFZhbGlkIiwiZW1haWxvcnVzZXJuYW1lTm90VmFsaWQiLCJ1c2VybmFtZUlzTm90UmVnaXN0ZXJlZCIsInBhc3N3b3JkRG9Ob3RNYXRjaCIsInRva2VuRXhwaXJlZCIsInNlcnZlclZhbGlkYXRpb25SYW5nZSIsInN0YXR1cyIsImNsaWVudFZhbGlkYXRpb24iLCJjb25zdFZhbFR5cGVzIiwidmFsaWRhdGlvbnMiLCJyZXNldElucHV0VmFsaWRhdGlvblN0YXRlIiwic2VydmVyVmFsaWRhdGlvbiIsImh0dHBTdGF0dXMiLCJ1c2VDbGllbnRWYWxpZGF0aW9uIiwidXNlRWZmZWN0IiwidmFsaWRhdGUiLCJmb3JFYWNoIiwiYWN0aW9ucyIsInJlc2V0VmFsaWRhdGlvblN0YXRlIiwiaW1nIiwiSWNvblN0YXRlIiwib3BlbiIsIm9wZW5JY29uIiwiY2xvc2VJY29uIiwiRXllSWNvbiIsIm9uQ2xpY2siLCJpbnB1dFR5cGUiLCJzZXRTdGF0ZSIsInVzZVN0YXRlIiwidG9nZ2xlIiwicHJldiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJtYXJnaW4iLCJzdHlsZSIsImlucHV0IiwiYm9yZGVyIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInJvb3QiLCJmbGV4RGlyZWN0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwibWFyZ2luQm90dG9tIiwiaW5wdXRDb250YWluZXIiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwib25DaGFuZ2UiLCJpZCIsImZvY3VzZWQiLCJzZXRGb2N1c2VkIiwic2V0SW5wdXRUeXBlIiwiaGFuZGxlRm9jdXMiLCJoYW5kbGVCbHVyIiwidGFyZ2V0IiwidG9nZ2xlRXllIiwidXNlTWVkaWFRdWVyeSIsInNldFdpZHRoIiwiaGVpZ2h0Iiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJGb3JtIiwiY2hpbGRyZW4iLCJmb3JtVGl0bGUiLCJUaGVtZUNvbnRleHQiLCJ1c2VUaGVtZUNvbnRleHQiLCJUaGVtZVByb3ZpZGVyIiwiQnV0dG9uIiwidGl0bGUiLCJkaXNhYmxlZCIsInRoZW1lIiwidmFsdWVDaGFuZ2VkIiwiY2hhbmdlUGFzc3dvcmQiLCJmb3JtRGlzcGF0Y2giLCJyZXNwb25zZSIsImFwaV91cmwiLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3VsdCIsImpzb24iLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZXJyb3JzIiwiZ2V0VG9rZW5Gcm9tVXJsIiwiYm94U2hhZG93IiwiUGFwZXIiLCJHcmlkIiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsIlJvdXRlQ29udGV4dCIsIlJvdXRlIiwicGF0aCIsInJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiUm91dGVQcm92aWRlciIsImluaXRpYWxSb3V0ZSIsInNldFJvdXRlIiwidXNlVXNlck5hbWUiLCJ1c2VyTmFtZSIsInNldFVzZXJuYW1lIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsImdldEl0ZW0iLCJwYXJzZSIsIkNoYW5nZVBhc3N3b3JkIiwidXJsIiwiVVJMIiwibG9jYXRpb24iLCJocmVmIiwidXJsdG9rZW4iLCJzZWFyY2hQYXJhbXMiLCJnZXQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVDaGFuZ2VQYXNzIiwiQXV0aEZlZWRiYWNrIiwiZm9udFNpemUiLCJMb2dpbkxpbmsiLCJyZW5kZXIiLCJwcmltYXJ5IiwiYmFja2dyb3VuZCIsImZvbnRGYW1pbHkiLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxPQUFPLEdBQUc7QUFDZCxFQUFFLFlBQVksRUFBRSxpQkFBaUIsSUFBSSxJQUFJO0FBQ3pDLEVBQUUsUUFBUSxFQUFFLFFBQVEsSUFBSSxJQUFJLElBQUksVUFBVSxJQUFJLE1BQU07QUFDcEQsRUFBRSxJQUFJO0FBQ04sSUFBSSxZQUFZLElBQUksSUFBSTtBQUN4QixJQUFJLE1BQU0sSUFBSSxJQUFJO0FBQ2xCLElBQUksQ0FBQyxXQUFXO0FBQ2hCLE1BQU0sSUFBSTtBQUNWLFFBQVEsSUFBSSxJQUFJLEdBQUU7QUFDbEIsUUFBUSxPQUFPLElBQUk7QUFDbkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsT0FBTyxLQUFLO0FBQ3BCLE9BQU87QUFDUCxLQUFLLEdBQUc7QUFDUixFQUFFLFFBQVEsRUFBRSxVQUFVLElBQUksSUFBSTtBQUM5QixFQUFFLFdBQVcsRUFBRSxhQUFhLElBQUksSUFBSTtBQUNwQyxFQUFDO0FBQ0Q7QUFDQSxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7QUFDekIsRUFBRSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDckQsQ0FBQztBQUNEO0FBQ0EsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO0FB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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FDQTUvUixJQUFJQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBd08sU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0wsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFrRCxTQUFTYyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNiLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDTyxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQXlOLFNBQVMsQ0FBQyxFQUFFLENBQUNFLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNiLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNQLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDSixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYyxHQUFDLENBQUMsQ0FBQ2QsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZSxHQUFDLENBQUMsQ0FBQ2YsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUdGLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUVELEdBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUVDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1YsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDQyxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUM7O0FDQTd0RSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQy9CLEVBQUUsS0FBSyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqQyxFQUFFLElBQUksUUFBUSxH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
