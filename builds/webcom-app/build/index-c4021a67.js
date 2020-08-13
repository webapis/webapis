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

function FeatureRoute(props) {
  const { children, path, paths } = props;
  const [state, dispatch] = useAppRouteContext();
  const { featureRoute } = state;

  if (path && featureRoute === path) {
    return children;
  } else if (paths && featureRoute === paths.find((p) => p === featureRoute)) {
    return children;
  }

  return null;
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

const actionTypes$1 = {
  //fetch
  FETCH_HANGOUTS_STARTED: "FETCH_HANGOUTS_STARTED",
  FETCH_HANGOUTS_SUCCESS: "FETCH_HANGOUTS_SUCCESS",
  FETCH_HANGOUTS_FAILED: "FETCH_HANGOUTS_FAILED",
  //search
  SEARCH_INPUT_CHANGE: "SEARCH_INPUT_CHANGE",
  SEARCH_HANGOUT_STARTED: "SEARCH_HANGOUT_STARTED",
  SEARCH_HANGOUT_SUCCESS: "SEARCH_HANGOUT_SUCCESS",
  SEARCH_HANGOUT_FAILED: "SEARCH_HANGOUT_FAILED",
  //filter
  FILTER_INPUT_CHANGED: "FILTER_INPUT_CHANGED",
  SENDING_HANGOUT_STARTED: "SENDING_HANGOUT_STARTED",
  SENDING_HANGOUT_FULLFILLED: "SENDING_HANGOUT_FULLFILLED",
  MESSAGE_TEXT_CHANGED: "MESSAGE_TEXT_CHANGED",
  LOADED_HANGOUTS: "LOADED_HANGOUTS",
  LOADED_MESSAGES: "LOADED_MESSAGES",
  SELECTED_HANGOUT: "SELECTED_HANGOUT",
  CLEARED_HANGOUT: "CLEARED_HANGOUT",
  ERROR_RECIEVED: "ERROR_RECIEVED",
  ONLINE_STATE_CHANGED: "ONLINE_STATE_CHANGED",
  SERVER_MESSAGE_RECIEVED: "SERVER_MESSAGE_RECIEVED",
  MESSAGES_UPDATED: "MESSAGES_UPDATED",
  HANGOUTS_UPDATED: "HANGOUTS_UPDATED",
  HANGOUT_UPDATED: "HANGOUT_UPDATED",
  UNREAD_HANGOUTS_UPDATED: "UNREAD_HANGOUTS_UPDATED",
  //SOCKET
  CONNECTING: "CONNECTING",
  OPEN: "OPEN",
  CLOSING: "CLOSING",
  CLOSED: "CLOSED",
  SOCKET_READY: "SOCKET_READY",
  SOCKET_ERROR: "SOCKET_ERROR",
  //user siged out
  SET_HANGOUT_TO_INIT_STATE: "SET_HANGOUT_TO_INIT_STATE",
};

const initState = {
  hangouts: null,
  hangout: null,
  unreadhangouts: [],
  messages: null,
  loading: false,
  error: null,
  messageText: "",
  online: false,
  socket: null,
  readyState: 0,
  socketMessage: null,
  //search
  search: "",
  searchResult: [],
  searchHangouts: false,
  //filter
  filter: "",
  filterResult: [],
  //fetch
  fetchHangouts: false,
  pendingHangout: null,
  message: null,
};
function reducer$1(state, action) {
  switch (action.type) {
    case actionTypes$1.SET_HANGOUT_TO_INIT_STATE:
      return { ...initState };

    case actionTypes$1.FETCH_HANGOUTS_STARTED:
      return { ...state, fetchHangouts: true };

    case actionTypes$1.FETCH_HANGOUTS_SUCCESS:
      return { ...state, fetchHangouts: false };

    case actionTypes$1.FETCH_HANGOUTS_FAILED:
      return { ...state, fetchHangouts: false, error: action.error };

    case actionTypes$1.ERROR_RECIEVED:
      return { ...state, error: action.error };
    //pending hangout

    case actionTypes$1.SENDING_HANGOUT_FULLFILLED:
      return { ...state, pendingHangout: null };

    case actionTypes$1.SENDING_HANGOUT_STARTED:
      return { ...state, pendingHangout: action.pendingHangout };
    //----

    case actionTypes$1.CLEARED_HANGOUT:
      return { ...state, hangout: null };

    case actionTypes$1.UNREAD_HANGOUTS_UPDATED:
      return { ...state, unreadhangouts: action.unreadhangouts };

    case actionTypes$1.HANGOUT_UPDATED:
      return { ...state, hangout: action.hangout };

    case actionTypes$1.HANGOUTS_UPDATED:
      return { ...state, hangouts: action.hangouts };

    case actionTypes$1.MESSAGES_UPDATED:
      return { ...state, messages: action.messages };

    case actionTypes$1.SERVER_MESSAGE_RECIEVED:
      return { ...state, message: action.message };

    case actionTypes$1.LOADED_MESSAGES:
      return { ...state, messages: action.messages };

    case actionTypes$1.MESSAGE_TEXT_CHANGED:
      return { ...state, messageText: action.text };
    //search

    case actionTypes$1.SEARCH_HANGOUT_STARTED:
      return { ...state, loading: true, searchHangouts: true };

    case actionTypes$1.SEARCH_HANGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResult: action.hangouts,
        searchHangouts: false,
      };

    case actionTypes$1.SEARCH_HANGOUT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
        searchHangouts: false,
      };

    case actionTypes$1.SEARCH_INPUT_CHANGE:
      return { ...state, search: action.search };
    //filter

    case actionTypes$1.FILTER_INPUT_CHANGED:
      return { ...state, filter: action.filter };

    case actionTypes$1.LOADED_HANGOUTS:
      return { ...state, filterResult: action.hangouts };

    case actionTypes$1.SELECTED_HANGOUT:
      return { ...state, hangout: action.hangout };
    //SOCKET

    case actionTypes$1.SOCKET_ERROR:
      return { ...state, error: action.error };

    case actionTypes$1.CONNECTING:
      return { ...state, readyState: 0 };

    case actionTypes$1.OPEN:
      return { ...state, readyState: 1 };

    case actionTypes$1.CLOSING:
      return { ...state, readyState: 2 };

    case actionTypes$1.CLOSED:
      return { ...state, readyState: 3 };

    case actionTypes$1.SOCKET_READY:
      return { ...state, socket: action.socket };

    default:
      return state;
  }
}

const hangoutStates = {
  INVITER: "INVITER",
  ACCEPTER: "ACCEPTER",
  DECLINER: "DECLINER",
  BLOCKER: "BLOCKER",
  UNBLOCKER: "UNBLOCKER",
  MESSANGER: "MESSANGER",
  READER: "READER",
  // acknowlegement
  INVITED: "INVITED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  BLOCKED: "BLOCKED",
  UNBLOCKED: "UNBLOCKED",
  MESSAGED: "MESSAGED",
  READ: "READ",
};

function updateUnread({ dispatch, hangout, name, dState }) {
  const { username, timestamp } = hangout;
  const hangoutKey = `${name}-unread-hangouts`;
  const readHangout = { ...hangout, dState };
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = localHangouts.findIndex(
    (f) => f.username === username && f.timestamp === timestamp
  );
  localHangouts.splice(hangoutIndex, 1, readHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({
    type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: localHangouts,
  });
}
function saveSentMessage({ hangout, dispatch, name, dState }) {
  const { username, message } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const pendingMessage = { ...message, username: name, state: dState };

  if (localMessages && localMessages.length > 0) {
    localStorage.setItem(
      messageKey,
      JSON.stringify([...localMessages, pendingMessage])
    );
    dispatch({
      type: actionTypes$1.MESSAGES_UPDATED,
      messages: [...localMessages, pendingMessage],
    });
  } else {
    localStorage.setItem(messageKey, JSON.stringify([pendingMessage]));
    dispatch({
      type: actionTypes$1.MESSAGES_UPDATED,
      messages: [pendingMessage],
    });
  }
}
function saveRecievedMessage({ hangout, dispatch, name, dState }) {
  const { username, message } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const pendingMessage = { ...message, username, state: dState };

  if (localMessages && localMessages.length > 0) {
    localStorage.setItem(
      messageKey,
      JSON.stringify([...localMessages, pendingMessage])
    );
    dispatch({
      type: actionTypes$1.MESSAGES_UPDATED,
      messages: [...localMessages, pendingMessage],
    });
  } else {
    localStorage.setItem(messageKey, JSON.stringify([pendingMessage]));
    dispatch({
      type: actionTypes$1.MESSAGES_UPDATED,
      messages: [pendingMessage],
    });
  }
}
function saveUnread({ dispatch, name, hangout, dState }) {
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const unreadHangout = { ...hangout, dState };

  if (localHangouts && localHangouts.length > 0) {
    localStorage.setItem(
      hangoutKey,
      JSON.stringify([...localHangouts, unreadHangout])
    );
    dispatch({
      type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: [...localHangouts, unreadHangout],
    });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([unreadHangout]));
    dispatch({
      type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: [unreadHangout],
    });
  }
}
function updateSentMessage({ hangout, name, dispatch, dState }) {
  const { username, message } = hangout;
  const { timestamp } = message;
  const messageKey = `${name}-${username}-messages`;
  const updatedMessage = { ...message, username: name, state: dState };
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  let messageIndex = localMessages.findIndex((i) => {
    i.username === username, i.timestamp === timestamp;
  });
  localMessages.splice(messageIndex, 1, updatedMessage);
  localStorage.setItem(messageKey, JSON.stringify(localMessages));
  dispatch({
    type: actionTypes$1.MESSAGES_UPDATED,
    messages: localMessages,
  });
}
function updateHangout({ dispatch, name, hangout }) {
  const { username } = hangout;
  const hangoutKey = `${name}-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  let hangoutIndex = localHangouts.findIndex((l) => l.username === username);
  localHangouts.splice(hangoutIndex, 1, hangout);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({
    type: actionTypes$1.HANGOUTS_UPDATED,
    hangouts: localHangouts,
  });
}
function saveHangout({ hangout, dispatch, name }) {
  const hangoutKey = `${name}-hangouts`;
  let localHangouts = localStorage.getItem(hangoutKey);

  if (localHangouts && localHangouts.length > 0) {
    localStorage.setItem(
      hangoutKey,
      JSON.stringify([...localHangouts, hangout])
    );
    dispatch({
      type: actionTypes$1.HANGOUTS_UPDATED,
      hangouts: [...localHangouts, hangout],
    });
    dispatch({
      type: actionTypes$1.HANGOUT_UPDATED,
      hangout: hangout,
    });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([hangout]));
    dispatch({
      type: actionTypes$1.HANGOUTS_UPDATED,
      hangouts: [hangout],
    });
  }
}
function removeUnread({ hangout, dispatch, name }) {
  const { username, timestamp } = hangout;
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = localHangouts.findIndex(
    (f) => f.username === username && f.timestamp === timestamp
  );
  localHangouts.splice(hangoutIndex, 1);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({
    type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: localHangouts,
  });
}
function removeUnreads({ dispatch, name }) {
  const hangoutKey = `${name}-unread-hangouts`;
  localStorage.removeItem(hangoutKey);
  dispatch({
    type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: [],
  });
}

function useMessage({ message, username, dispatch, focusedHangout }) {
  const { onAppRoute } = useAppRoute();

  function handleAcknowledgement({ hangout, offline }) {
    switch (hangout.state) {
      case hangoutStates.UNBLOCKED:
        saveUnblovked({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline,
        });
        break;

      case hangoutStates.INVITED:
        updateHangout({
          dispatch,
          hangout,
          name: username,
        });
        updateSentMessage({
          hangout,
          name: username,
          dispatch,
        });
        dispatch({
          type: actionTypes$1.SENDING_HANGOUT_FULLFILLED,
        });
        onAppRoute({
          featureRoute: `/${hangout.state}`,
          route: "/hangouts",
        });
        break;

      case hangoutStates.DECLINED:
        updateUnread({
          dispatch,
          hangout,
          name: username,
          dState: "read",
        });
        updateSentMessage({
          hangout,
          name: username,
          dispatch,
        });
        dispatch({
          type: actionTypes$1.SENDING_HANGOUT_FULLFILLED,
        });
        onAppRoute({
          featureRoute: `/${hangout.state}`,
          route: "/hangouts",
        });
        break;

      case hangoutStates.ACCEPTED:
        updateUnread({
          dispatch,
          hangout,
          name: username,
          dState: "read",
        });
        updateHangout({
          dispatch,
          hangout,
          name: username,
        });
        updateSentMessage({
          hangout,
          name: username,
          dispatch,
        });
        dispatch({
          type: actionTypes$1.SENDING_HANGOUT_FULLFILLED,
        });
        onAppRoute({
          featureRoute: `/${hangout.state}`,
          route: "/hangouts",
        });
        break;

      case hangoutStates.BLOCKED:
        updateHangout({
          dispatch,
          hangout,
          name: username,
        });
        updateSentMessage({
          hangout,
          name: username,
          dispatch,
        });
        removeUnreads({
          dispatch,
          name,
        });
        dispatch({
          type: actionTypes$1.HANGOUT_UPDATED,
          hangout,
        });
        dispatch({
          type: actionTypes$1.SENDING_HANGOUT_FULLFILLED,
        });
        onAppRoute({
          featureRoute: `/${hangout.state}`,
          route: "/hangouts",
        });
        break;

      case hangoutStates.MESSAGED:
        updateHangout({
          dispatch,
          name: username,
          hangout,
        });
        updateSentMessage({
          hangout,
          name: username,
          dispatch,
          dState: "delivered",
        });
        dispatch({
          type: actionTypes$1.SENDING_HANGOUT_FULLFILLED,
        });
        break;

      case hangoutStates.READ:
        updateHangout({
          dispatch,
          name: username,
          hangout,
        });
        dispatch({
          type: actionTypes$1.SENDING_HANGOUT_FULLFILLED,
        });
        removeUnread({
          dispatch,
          hangout,
          name: username,
        });
        break;
    }
  }

  function onHangout({ hangout }) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
        updateHangout({
          dispatch,
          name: username,
          hangout,
        });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        saveUnread({
          dispatch,
          name: username,
          hangout,
        });
        break;

      case hangoutStates.BLOCKER:
        updateHangout({
          dispatch,
          name: username,
          hangout,
        });
        removeUnreads({
          dispatch,
          name,
        });
        break;

      case hangoutStates.DECLINER:
        updateHangout({
          dispatch,
          name: username,
          hangout,
        });
        break;

      case hangoutStates.INVITER:
        saveUnread({
          dispatch,
          hangout,
          name: username,
          dState: "unread",
        });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        break;

      case hangoutStates.MESSANGER:
        updateHangout({
          dispatch,
          name: username,
          hangout,
        });
        saveUnread({
          dispatch,
          hangout,
          name: username,
          dState: "unread",
        });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        break;
    }
  }

  function handleHangouts({ hangouts }) {
    hangouts.forEach((hangout) => {
      onHangout({
        hangout,
        unread: true,
      });
    });
  }

  p$1(() => {
    if (message && username) {
      switch (message.type) {
        case "ACKHOWLEDGEMENT":
          handleAcknowledgement({
            hangout: message.hangout,
            offline: false,
          });
          break;

        case "HANGOUT":
          if (
            focusedHangout &&
            focusedHangout.username === message.hangout.username
          ) {
            onHangout({
              hangout: message.hangout,
              unread: false,
            });
          } else {
            onHangout({
              hangout: message.hangout,
              unread: true,
            });
          }

          break;

        case "UNREAD_HANGOUTS":
          handleHangouts({
            hangouts: message.hangouts,
          });
          break;

        case "OFFLINE_ACKN":
          handleAcknowledgement({
            hangout: message.hangout,
            offline: true,
          });
          break;
      }
    }
  }, [message, username]);
  return {};
}

var actionTypes$2 = {
  VALUE_CHANGED: "VALUE_CHANGED",
  LOGIN_STARTED: "LOGIN_STARTED",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
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
  RECOVER_LOCAL_AUTH_STATE: "RECOVER_LOCAL_AUTH_STATE",
  SERVER_ERROR_RECIEVED: "SERVER_ERROR_RECIEVED",
  CONSTRAINT_VALIDATION: "CONSTRAINT_VALIDATION",
  SET_ERROR_TO_NULL: "SET_ERROR_TO_NULL",
};

const initState$1 = {
  login: false,
  signup: false,
  changePassword: false,
  requestPassChange: false,
  validation: {
    username: {
      isValid: undefined,
      message: "",
    },
    email: {
      isValid: undefined,
      message: "",
    },
    password: {
      isValid: undefined,
      message: "",
    },
    confirm: {
      isValid: undefined,
      message: "",
    },
    emailorusername: {
      isValid: undefined,
      message: "",
    },
  },
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
  authFeedback: null,
  user: null,
  signout: false,
};
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes$2.SET_ERROR_TO_NULL:
      return { ...state, error: null };

    case actionTypes$2.SERVER_ERROR_RECIEVED:
      return { ...state, error: action.error };

    case actionTypes$2.CONSTRAINT_VALIDATION:
      return {
        ...state,
        validation: {
          ...state.validation,
          [action.name]: {
            isValid: action.isValid,
            message: action.message,
          },
        },
      };

    case actionTypes$2.VALUE_CHANGED:
      const nextState = { ...state, [action.name]: action.value };
      return nextState;

    case actionTypes$2.LOGIN_STARTED:
      return { ...state, loading: true, login: true };

    case actionTypes$2.LOGIN_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        user: action.user,
        password: "",
      };

    case actionTypes$2.LOGIN_FAILED:
      return { ...state, loading: false, login: false };

    case actionTypes$2.SIGNUP_STARTED:
      return { ...state, loading: true, signup: true };

    case actionTypes$2.SIGNUP_SUCCESS:
      return { ...state, loading: false, user: action.user };

    case actionTypes$2.SIGNUP_FAILED:
      return { ...state, loading: false, signup: false };

    case actionTypes$2.CHANGE_PASSWORD_STARTED:
      return { ...state, loading: true, changePassword: true };

    case actionTypes$2.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.user,
        changePassword: false,
      };

    case actionTypes$2.CHANGE_PASSWORD_FAILED:
      return { ...state, loading: false, changePassword: false };

    case actionTypes$2.REQUEST_PASS_CHANGE_STARTED:
      return { ...state, loading: true, requestPassChange: true };

    case actionTypes$2.REQUEST_PASS_CHANGE_SUCCESS:
      return { ...state, loading: false, requestPassChange: false };

    case actionTypes$2.REQUEST_PASS_CHANGE_FAILED:
      return { ...state, loading: false, requestPassChange: false };

    case actionTypes$2.GOT_TOKEN_FROM_URL:
      return { ...state, token: action.token };

    case actionTypes$2.LOGOUT:
      return { ...initState$1, signout: true };

    case actionTypes$2.RECOVER_LOCAL_AUTH_STATE:
      return { ...state, user: action.user };

    default:
      return state;
  }
}

var httpStatus = {
  accountAlreadyExits: 202,
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
  emptyPasswordNotValid: "409",
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

var validationMessages = {
  INVALID_PASSWORD:
    "at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, Can contain special characters",
  INVALID_EMAIL: "email format is not valid",
  EMAIL_NOT_REGISTERED: "email is not registered",
  USERNAME_NOT_REGISTERED: "username is not registered",
  INVALID_USERNAME:
    "only Letters a-z or A-Z and the Symbols - and _ are allowed",
  INVALID_EMPTY_STRING: "Required field",
  INVALID_USERNAME_OR_EMAIL: "email or username is not valid",
  INVALID_CREDENTIALS: "invalid credentials provided",
  USERNAME_TAKEN: "username is already taken",
  REGISTERED_EMAIL: "email is already registered",
  PASSWORDS_DO_NOT_MATCH: "passwords do not match",
  ACCOUNT_ALREADY_EXISTS: "Account already exists for this username.",
  REQUIRED_FIELD: "Required field",
};

function serverValidation({ status = 0, dispatch }) {
  switch (status) {
    case 101:
    case 200:
    case httpStatus.credentialInvalid:
    case httpStatus.emailIsNotRegistered:
    case httpStatus.emailorusernameNotValid:
    case httpStatus.usernameIsNotRegistered:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS,
      });
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "emailorusername",
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS,
      });
      break;

    case 125:
    case -3:
    case httpStatus.emailInvalid:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "email",
        isValid: false,
        message: validationMessages.INVALID_EMAIL,
      });
      break;

    case httpStatus.passwordInvalid:
    case -4:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.INVALID_PASSWORD,
      });
      break;

    case httpStatus.usernameInvalid:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "username",
        isValid: false,
        message: validationMessages.INVALID_USERNAME,
      });
      break;

    case 203:
    case httpStatus.emailIsRegistered:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "email",
        isValid: false,
        message: validationMessages.REGISTERED_EMAIL,
      });
      break;

    case 202: //parse

    case httpStatus.usernameIsTaken:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "username",
        isValid: false,
        message: validationMessages.USERNAME_TAKEN,
      });
      break;

    case httpStatus.emptyPasswordNotValid:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.REQUIRED_FIELD,
      });
      break;

    case httpStatus.passwordDoNotMatch:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      });
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "confirm",
        isValid: false,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
      });
      break;

    default:
      return null;
  }
}

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
const usernameRegex = /[a-zA-Z]+[-_]*[a-zA-Z]+/g;

function validateEmailConstraint({ email }) {
  const emailConstraint = new RegExp(emailRegex);

  if (emailConstraint.test(email)) {
    return {
      isValid: true,
      message: "",
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_EMAIL,
    };
  }
}
function validatePasswordConstraint({ password }) {
  const passwordConstraint = new RegExp(passwordRegex);

  if (passwordConstraint.test(password)) {
    return {
      isValid: true,
      message: "",
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_PASSWORD,
    };
  }
}
function validateUserNameConstraint({ username }) {
  const usernameConstraint = new RegExp(usernameRegex);

  if (usernameConstraint.test(username)) {
    return {
      isValid: true,
      message: "",
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_USERNAME,
    };
  }
}
function validateEmailOrUsername({ value }) {
  const emailConstraint = new RegExp(emailRegex);
  const usernameConstraint = new RegExp(usernameRegex);

  if (emailConstraint.test(value)) {
    return {
      isValid: true,
      message: "",
    };
  } else if (usernameConstraint.test(value)) {
    return {
      isValid: true,
      message: "",
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_USERNAME_OR_EMAIL,
    };
  }
}

async function signup({ dispatch, state }) {
  const { email, password, username } = state;

  try {
    const response = await fetch(`/auth/signup`, {
      body: JSON.stringify({
        password,
        email,
        username,
      }),
      headers: {
        ContentType: "application/json",
        Accept: "application/json",
      },
      method: "POST",
    });
    const result = await response.json();

    if (response.status === 200) {
      const { token, username, email } = result;
      dispatch({
        type: actionTypes$2.SIGNUP_SUCCESS,
        user: {
          token,
          username,
          email,
        },
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
      errors.forEach((error) => {
        serverValidation({
          status: error,
          dispatch,
        });
      });
      dispatch({
        type: actionTypes$2.SIGNUP_FAILED,
      });
    } else if (response.status === 500) {
      const { error } = result;
      dispatch({
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error,
      });
      dispatch({
        type: actionTypes$2.SIGNUP_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.SERVER_ERROR_RECIEVED,
      error,
    });
    dispatch({
      type: actionTypes$2.SIGNUP_FAILED,
    });
  }
}
async function login({ dispatch, state, formDispatch }) {
  try {
    const { emailorusername, password } = state;
    const response = await fetch(`/auth/login`, {
      headers: {
        "Conten-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`,
      },
      method: "GET",
    });
    const result = await response.json();

    if (response.status === 200) {
      const { token, username, email } = result;
      dispatch({
        type: actionTypes$2.LOGIN_SUCCESS,
        user: {
          token,
          username,
          email,
        },
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
      errors.forEach((error) => {
        serverValidation({
          status: error,
          dispatch,
        });
      });
      dispatch({
        type: actionTypes$2.LOGIN_FAILED,
      });
    } else if (response.status === 500) {
      const { error } = result;
      dispatch({
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error,
      });
      dispatch({
        type: actionTypes$2.LOGIN_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.SERVER_ERROR_RECIEVED,
      error,
    });
    dispatch({
      type: actionTypes$2.LOGIN_FAILED,
    });
  }
}
async function changePassword({ dispatch, state }) {
  try {
    const { confirm, password } = state;
    const { token } = state.user;
    const response = await fetch(`/auth/changepass`, {
      method: "put",
      body: JSON.stringify({
        confirm,
        password,
        token,
      }),
    });
    const result = await response.json();

    if (response.status === 200) {
      const { token, username, email } = result;
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_SUCCESS,
        user: {
          token,
          username,
          email,
        },
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
      errors.forEach((error) => {
        serverValidation({
          status: error,
          dispatch,
        });
      });
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_FAILED,
      });
    } else if (response.status === 500) {
      const { error } = result;
      dispatch({
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error,
      });
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.SERVER_ERROR_RECIEVED,
      error,
    });
    dispatch({
      type: actionTypes$2.CHANGE_PASSWORD_FAILED,
    });
  }
}
async function forgotPassword({ dispatch, state }) {
  try {
    const { email } = state;
    const response = await fetch(`/auth/requestpasschange`, {
      method: "post",
      body: JSON.stringify({
        email,
      }),
    });

    if (response.status === 200) {
      const result = await response.json();
      dispatch({
        type: actionTypes$2.REQUEST_PASS_CHANGE_SUCCESS,
        token: result.token,
      });
    } else if (response.status === 400) {
      const result = await response.json();
      const { errors } = result;
      errors.forEach((error) => {
        serverValidation({
          status: error,
          dispatch,
        });
      });
      dispatch({
        type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED,
      });
    } else if (response.status === 500) {
      const { error } = result;
      dispatch({
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error,
      });
      dispatch({
        type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.SERVER_ERROR_RECIEVED,
      error,
    });
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED,
    });
  }
}

function NodeAuthService({ children, state, dispatch }) {
  const {
    login: login$1,
    signup: signup$1,
    changePassword: changePassword$1,
    requestPassChange,
  } = state;
  p$1(() => {
    if (login$1) {
      login({
        dispatch,
        state,
      });
    }
  }, [login$1]);
  p$1(() => {
    if (signup$1) {
      signup({
        dispatch,
        state,
      });
    }
  }, [signup$1]);
  p$1(() => {
    if (changePassword$1) {
      changePassword({
        dispatch,
        state,
      });
    }
  }, [changePassword$1]);
  p$1(() => {
    if (requestPassChange) {
      forgotPassword({
        dispatch,
        state,
      });
    }
  }, [requestPassChange]);
  return children;
}

function AuthAdapter(props) {
  {
    return h(NodeAuthService, props);
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
  const { children } = props;
  const [state, dispatch] = m$1(authReducer, initState$1);
  const value = s$1(() => [state, dispatch], [state]);
  return h(
    AuthContext.Provider,
    _extends(
      {
        value: value,
      },
      props
    ),
    h(
      AuthAdapter,
      {
        state: state,
        dispatch: dispatch,
      },
      children
    )
  );
}

function useUserName() {
  const [userName, setUsername] = v$1(null);
  const [token, setToken] = v$1(null);
  const [email, setEmail] = v$1("");
  const [objectId, setObjectId] = v$1(null);
  const { state, dispatch } = useAuthContext();
  p$1(() => {
    if (window.localStorage.getItem("webcom")) {
      const { username, token, email, objectId } = JSON.parse(
        window.localStorage.getItem("webcom")
      );
      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId);
      dispatch({
        type: actionTypes$2.RECOVER_LOCAL_AUTH_STATE,
        user: {
          username,
          token,
          email,
          objectId,
        },
      });
    }
  }, []);
  p$1(() => {
    if (state.user && state.user.token) {
      const { username, email, token, objectId } = state.user;
      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId);
    }
  }, [state.user]);
  p$1(() => {
    if (state && state.user === null) {
      setUsername(null);
      setToken(null);
      setEmail(null);
      setObjectId(null);
    }
  }, [state]);
  return {
    username: userName,
    token,
    email,
  };
}

//is sent by client
const clientCommands = {
  INVITE: "INVITE",
  ACCEPT: "ACCEPT",
  DECLINE: "DECLINE",
  BLOCK: "BLOCK",
  UNBLOCK: "UNBLOCK",
  MESSAGE: "MESSAGE",
  ONLINE: "ONLINE",
  READ: "READ",
};

const HangoutContext = M();
function useHangoutContext() {
  const context = T$1(HangoutContext);

  if (!context) {
    throw new Error("useHangoutContext must be used with HangoutsProvider");
  }

  return context;
}
function HangoutsProvider(props) {
  const { username, token } = useUserName();
  const [state, dispatch] = m$1(reducer$1, initState);
  const { hangout, message } = state;
  const handleMessage = useMessage({
    message,
    username,
    dispatch,
    focusedHangout: hangout,
  });
  p$1(() => {
    if (hangout) {
      switch (hangout.state) {
        case "ACCEPTER":
        case "DECLINER":
        case "BLOCKER":
        case "MESSANGER":
        case "UNBLOCKER":
          debugger;
          dispatch({
            type: actionTypes$1.SENDING_HANGOUT_STARTED,
            pendingHangout: { ...hangout, command: clientCommands.READ },
          });
      }
    }
  }, [hangout]);
  p$1(() => {
    if (!username) {
      dispatch({
        type: actionTypes$1.SET_HANGOUT_TO_INIT_STATE,
      });
    }
  }, [username]);
  p$1(() => {
    const unreadhangoutKey = `${username}-unread-hangouts`;
    const unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutKey));

    if (unreadhangouts && unreadhangouts.length > 0) {
      dispatch({
        type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
        unreadhangouts,
      });
    }

    const hangoutKey = `${username}-hangouts`;
    const hangouts = JSON.parse(localStorage.getItem(hangoutKey));

    if (!hangouts) {
      dispatch({
        type: actionTypes$1.FETCH_HANGOUTS_STARTED,
      });
    }
  }, []);
  const value = s$1(() => [state, dispatch], [state]);
  return h(
    HangoutContext.Provider,
    _extends(
      {
        value: value,
      },
      props
    )
  );
}

function useAuth() {
  const { state, dispatch } = useAuthContext();

  function onChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: actionTypes$2.VALUE_CHANGED,
      name,
      value,
    });
  }

  function onLogin() {
    if (password === "") {
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: false,
        message: "Required field",
      });
    } else {
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: "password",
        isValid: true,
        message: "",
      });
    }

    dispatch({
      type: actionTypes$2.CONSTRAINT_VALIDATION,
      name: "emailorusername",
      ...validateEmailOrUsername({
        value: emailorusername,
      }),
    });
    dispatch({
      type: actionTypes$2.LOGIN_STARTED,
    });
  }

  function onSignup() {
    // dispatch({ type: actionTypes.CONSTRAINT_VALIDATION, name: 'password', ...cv.validatePasswordConstraint({ password }) })
    //  dispatch({ type: actionTypes.CONSTRAINT_VALIDATION, name: 'email', ...cv.validateEmailConstraint({ email }) })
    //  dispatch({ type: actionTypes.CONSTRAINT_VALIDATION, name: 'username', ...cv.validateUserNameConstraint({ username }) })
    dispatch({
      type: actionTypes$2.SIGNUP_STARTED,
    });
  }

  function onRequestPasswordChange() {
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_STARTED,
    });
  }

  function onPasswordChange() {
    dispatch({
      type: actionTypes$2.CHANGE_PASSWORD_STARTED,
    });
  }

  function onSignOut() {
    localStorage.removeItem("webcom");
    dispatch({
      type: actionTypes$2.LOGOUT,
    });
  }

  function onLoginBlur(e) {
    const { emailorusername, password } = state;
    const { name } = e.target;

    switch (name) {
      case "password":
        if (password === "") {
          dispatch({
            type: actionTypes$2.CONSTRAINT_VALIDATION,
            name: "password",
            isValid: false,
            message: "Required field",
          });
        } else {
          dispatch({
            type: actionTypes$2.CONSTRAINT_VALIDATION,
            name: "password",
            isValid: true,
            message: "",
          });
        }

        break;

      case "emailorusername":
        dispatch({
          type: actionTypes$2.CONSTRAINT_VALIDATION,
          name: "emailorusername",
          ...validateEmailOrUsername({
            value: emailorusername,
          }),
        });
        break;

      default:
        throw new Error("onLoginBlur error");
    }
  }

  function onSignupBlur(e) {
    const { email, username, password } = state;
    const { name } = e.target;

    switch (name) {
      case "password":
        dispatch({
          type: actionTypes$2.CONSTRAINT_VALIDATION,
          name: "password",
          ...validatePasswordConstraint({
            password,
          }),
        });
        break;

      case "email":
        dispatch({
          type: actionTypes$2.CONSTRAINT_VALIDATION,
          name: "email",
          ...validateEmailConstraint({
            email,
          }),
        });
        break;

      case "username":
        dispatch({
          type: actionTypes$2.CONSTRAINT_VALIDATION,
          name: "username",
          ...validateUserNameConstraint({
            username,
          }),
        });
        break;

      default:
        throw new Error("onLoginBlur error");
    }
  }

  function onChangePassBlur() {}

  function onRequestPassChangeBlur() {}

  function onFocus(e) {
    const { name } = e.target;
    dispatch({
      type: actionTypes$2.CONSTRAINT_VALIDATION,
      name,
      isValid: undefined,
      message: "",
    });
    dispatch({
      type: actionTypes$2.SET_ERROR_TO_NULL,
    });
  }

  return {
    state,
    onFocus,
    onLoginBlur,
    onSignupBlur,
    onChangePassBlur,
    onRequestPassChangeBlur,
    dispatch,
    onLogin,
    onSignup,
    onRequestPasswordChange,
    onPasswordChange,
    onChange,
    onSignOut,
  };
}

function E$1(n, t) {
  for (var e in t) n[e] = t[e];
  return n;
}
function w$1(n, t) {
  for (var e in n) if ("__source" !== e && !(e in t)) return !0;
  for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
  return !1;
}
var C$1 = (function (n) {
  var t, e;
  function r(t) {
    var e;
    return ((e = n.call(this, t) || this).isPureReactComponent = !0), e;
  }
  return (
    (e = n),
    ((t = r).prototype = Object.create(e.prototype)),
    (t.prototype.constructor = t),
    (t.__proto__ = e),
    (r.prototype.shouldComponentUpdate = function (n, t) {
      return w$1(this.props, n) || w$1(this.state, t);
    }),
    r
  );
})(m);
var A$1 = n.__b;
n.__b = function (n) {
  n.type && n.type.t && n.ref && ((n.props.ref = n.ref), (n.ref = null)),
    A$1 && A$1(n);
};
var F$1 = n.__e;
function N$1(n) {
  return (
    n && (((n = E$1({}, n)).__c = null), (n.__k = n.__k && n.__k.map(N$1))), n
  );
}
function U() {
  (this.__u = 0), (this.o = null), (this.__b = null);
}
function M$1(n) {
  var t = n.__.__c;
  return t && t.u && t.u(n);
}
function L(n) {
  var t, e, r;
  function o(o) {
    if (
      (t ||
        (t = n()).then(
          function (n) {
            e = n.default || n;
          },
          function (n) {
            r = n;
          }
        ),
      r)
    )
      throw r;
    if (!e) throw t;
    return h(e, o);
  }
  return (o.displayName = "Lazy"), (o.t = !0), o;
}
function O() {
  (this.i = null), (this.l = null);
}
(n.__e = function (n, t, e) {
  if (n.then)
    for (var r, o = t; (o = o.__); )
      if ((r = o.__c) && r.__c) return r.__c(n, t.__c);
  F$1(n, t, e);
}),
  ((U.prototype = new m()).__c = function (n, t) {
    var e = this;
    null == e.o && (e.o = []), e.o.push(t);
    var r = M$1(e.__v),
      o = !1,
      u = function () {
        o || ((o = !0), r ? r(i) : i());
      };
    (t.__c = t.componentWillUnmount),
      (t.componentWillUnmount = function () {
        u(), t.__c && t.__c();
      });
    var i = function () {
      var n;
      if (!--e.__u)
        for (
          e.__v.__k[0] = e.state.u, e.setState({ u: (e.__b = null) });
          (n = e.o.pop());

        )
          n.forceUpdate();
    };
    e.__u++ || e.setState({ u: (e.__b = e.__v.__k[0]) }), n.then(u, u);
  }),
  (U.prototype.render = function (n, t) {
    return (
      this.__b && ((this.__v.__k[0] = N$1(this.__b)), (this.__b = null)),
      [h(m, null, t.u ? null : n.children), t.u && n.fallback]
    );
  });
var P$1 = function (n, t, e) {
  if (
    (++e[1] === e[0] && n.l.delete(t),
    n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size))
  )
    for (e = n.i; e; ) {
      for (; e.length > 3; ) e.pop()();
      if (e[1] < e[0]) break;
      n.i = e = e[2];
    }
};
((O.prototype = new m()).u = function (n) {
  var t = this,
    e = M$1(t.__v),
    r = t.l.get(n);
  return (
    r[0]++,
    function (o) {
      var u = function () {
        t.props.revealOrder ? (r.push(o), P$1(t, n, r)) : o();
      };
      e ? e(u) : u();
    }
  );
}),
  (O.prototype.render = function (n) {
    (this.i = null), (this.l = new Map());
    var t = x(n.children);
    n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
    for (var e = t.length; e--; ) this.l.set(t[e], (this.i = [1, 0, this.i]));
    return n.children;
  }),
  (O.prototype.componentDidUpdate = O.prototype.componentDidMount = function () {
    var n = this;
    n.l.forEach(function (t, e) {
      P$1(n, e, t);
    });
  });
var W = (function () {
  function n() {}
  var t = n.prototype;
  return (
    (t.getChildContext = function () {
      return this.props.context;
    }),
    (t.render = function (n) {
      return n.children;
    }),
    n
  );
})();
var D$1 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
m.prototype.isReactComponent = {};
var H$1 =
  ("undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element")) ||
  60103;
var Z = n.event;
function I(n, t) {
  n["UNSAFE_" + t] &&
    !n[t] &&
    Object.defineProperty(n, t, {
      configurable: !1,
      get: function () {
        return this["UNSAFE_" + t];
      },
      set: function (n) {
        this["UNSAFE_" + t] = n;
      },
    });
}
n.event = function (n) {
  Z && (n = Z(n)), (n.persist = function () {});
  var t = !1,
    e = !1,
    r = n.stopPropagation;
  n.stopPropagation = function () {
    r.call(n), (t = !0);
  };
  var o = n.preventDefault;
  return (
    (n.preventDefault = function () {
      o.call(n), (e = !0);
    }),
    (n.isPropagationStopped = function () {
      return t;
    }),
    (n.isDefaultPrevented = function () {
      return e;
    }),
    (n.nativeEvent = n)
  );
};
var $$1 = {
    configurable: !0,
    get: function () {
      return this.class;
    },
  },
  q$1 = n.vnode;
n.vnode = function (n) {
  n.$$typeof = H$1;
  var t = n.type,
    e = n.props;
  if (t) {
    if (
      (e.class != e.className &&
        (($$1.enumerable = "className" in e),
        null != e.className && (e.class = e.className),
        Object.defineProperty(e, "className", $$1)),
      "function" != typeof t)
    ) {
      var r, o, u;
      for (u in (e.defaultValue &&
        void 0 !== e.value &&
        (e.value || 0 === e.value || (e.value = e.defaultValue),
        delete e.defaultValue),
      Array.isArray(e.value) &&
        e.multiple &&
        "select" === t &&
        (x(e.children).forEach(function (n) {
          -1 != e.value.indexOf(n.props.value) && (n.props.selected = !0);
        }),
        delete e.value),
      e))
        if ((r = D$1.test(u))) break;
      if (r)
        for (u in ((o = n.props = {}), e))
          o[D$1.test(u) ? u.replace(/[A-Z0-9]/, "-$&").toLowerCase() : u] =
            e[u];
    }
    !(function (t) {
      var e = n.type,
        r = n.props;
      if (r && "string" == typeof e) {
        var o = {};
        for (var u in r)
          /^on(Ani|Tra|Tou)/.test(u) &&
            ((r[u.toLowerCase()] = r[u]), delete r[u]),
            (o[u.toLowerCase()] = u);
        if (
          (o.ondoubleclick &&
            ((r.ondblclick = r[o.ondoubleclick]), delete r[o.ondoubleclick]),
          o.onbeforeinput &&
            ((r.onbeforeinput = r[o.onbeforeinput]), delete r[o.onbeforeinput]),
          o.onchange &&
            ("textarea" === e ||
              ("input" === e.toLowerCase() && !/^fil|che|ra/i.test(r.type))))
        ) {
          var i = o.oninput || "oninput";
          r[i] || ((r[i] = r[o.onchange]), delete r[o.onchange]);
        }
      }
    })(),
      "function" == typeof t &&
        !t.m &&
        t.prototype &&
        (I(t.prototype, "componentWillMount"),
        I(t.prototype, "componentWillReceiveProps"),
        I(t.prototype, "componentWillUpdate"),
        (t.m = !0));
  }
  q$1 && q$1(n);
};

const Login = L(() => import("./Login-58122ae8.js"));
const ChangePassword = L(() => import("./ChangePassword-58c75fd0.js"));
const ForgotPassword = L(() => import("./ForgotPassword-f45f619d.js"));
const Signup = L(() => import("./Signup-d2561a26.js"));
const Profile = L(() => import("./Profile-43e7c979.js"));
function AuthFeatureRoutes() {
  const {
    onFocus,
    onLogin,
    onLoginBlur,
    onSignupBlur,
    onChangePassBlur,
    onRequestPassChangeBlur,
    onSignup,
    onRequestPasswordChange,
    onPasswordChange,
    onChange,
    state,
  } = useAuth();
  return [
    h(
      FeatureRoute,
      {
        path: "/change-pasword",
      },
      h(
        U,
        {
          fallback: h("div", null, "loading..."),
        },
        h(
          ChangePassword,
          _extends({}, state, {
            onFocus: onFocus,
            onBlur: onChangePassBlur,
            onChange: onChange,
            onPasswordChange: onPasswordChange,
          })
        )
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/login",
      },
      h(
        U,
        {
          fallback: h("div", null, "loading..."),
        },
        h(
          Login,
          _extends({}, state, {
            onFocus: onFocus,
            onBlur: onLoginBlur,
            onChange: onChange,
            onLogin: onLogin,
          })
        )
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/signup",
      },
      h(
        U,
        {
          fallback: h("div", null, "loading..."),
        },
        h(
          Signup,
          _extends({}, state, {
            onFocus: onFocus,
            onBlur: onSignupBlur,
            onChange: onChange,
            onSignup: onSignup,
          })
        )
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/forgot-pasword",
      },
      h(
        U,
        {
          fallback: h("div", null, "loading..."),
        },
        h(
          ForgotPassword,
          _extends({}, state, {
            onFocus: onFocus,
            onBlur: onRequestPassChangeBlur,
            onChange: onChange,
            onRequestPasswordChange: onRequestPasswordChange,
          })
        )
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/profile",
      },
      h(
        U,
        {
          fallback: h("div", null, "loading..."),
        },
        h(Profile, null)
      )
    ),
  ];
}

function changeMessageText({ text, dispatch }) {
  dispatch({
    type: actionTypes$1.MESSAGE_TEXT_CHANGED,
    text,
  });
}
//END saveInviter

function useHangouts() {
  const { onAppRoute } = useAppRoute();
  const authContext = useAuthContext();
  const username = authContext.state.user && authContext.state.user.username;
  const [state, dispatch] = useHangoutContext();
  const { hangout, hangouts, messageText, messages, readyState } = state;

  function onNavigation(e) {
    e.stopPropagation();
    const id = e.currentTarget.id;
    onAppRoute({
      featureRoute: `/${id}`,
      route: "/hangouts",
    });
  }

  function onMessageText(e) {
    const text = e.target.value;
    changeMessageText({
      dispatch,
      text,
    });
  }

  function onInvite() {
    const { email } = hangout;
    const timestamp = Date.now();
    const message =
      messageText !== ""
        ? {
            text: messageText,
            timestamp,
          }
        : null;
    const invitation = {
      username: hangout.username,
      email,
      message,
      command: "INVITE",
      timestamp,
    };
    saveHangout({
      hangout: invitation,
      name: username,
      dispatch,
    });
    saveSentMessage({
      hangout: invitation,
      dispatch,
      name: username,
      dState: "pending",
    });
    dispatch({
      type: actionTypes$1.SENDING_HANGOUT_STARTED,
      pendingHangout: invitation,
    });
  }

  function onAccept() {
    try {
      const { email, timestamp } = hangout;
      const accept = {
        username: hangout.username,
        email,
        message: {
          text: "Accepted your invitation",
          timestamp,
        },
        command: "ACCEPT",
        timestamp,
      };
      saveHangout({
        hangout: accept,
        name: username,
        dispatch,
      });
      saveSentMessage({
        hangout: accept,
        dispatch,
        name: username,
        dState: "pending",
      });
      updateUnread({
        dispatch,
        hangout: accept,
        name: username,
      });
      dispatch({
        type: actionTypes$1.SENDING_HANGOUT_STARTED,
        pendingHangout: accept,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function onDecline() {
    try {
      const { email, timestamp } = hangout;
      const decline = {
        username: hangout.username,
        email,
        message: {
          text: "Your invitation declined",
          timestamp,
        },
        command: "DECLINE",
        timestamp,
      };
      updateUnread({
        dispatch,
        hangout: decline,
        name: username,
      });
      saveSentMessage({
        hangout: decline,
        name: username,
        dispatch,
        dState: "pending",
      });
      dispatch({
        type: actionTypes$1.SENDING_HANGOUT_STARTED,
        pendingHangout: decline,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function onMessage() {
    const { email, state } = hangout;
    const timestamp = Date.now();
    const message =
      messageText !== ""
        ? {
            text: messageText,
            timestamp,
          }
        : null;
    const messaging = {
      username: hangout.username,
      email,
      message,
      command: "MESSAGE",
      timestamp,
    };
    saveSentMessage({
      hangout: messaging,
      dispatch,
      name: username,
      dState: "pending",
    });

    if (hangout.state === "BLOCKER") {
      debugger;
      saveSentMessage({
        hangout: {
          ...hangout,
          message: {
            ...hangout.message,
            text: "You cannot send this message because you are blocked",
            type: "blocker",
          },
        },
        dispatch,
        name: username,
        dState: "pending",
      });
    } else {
      updateHangout({
        hangout: messaging,
        name: username,
        dispatch,
      });
      dispatch({
        type: actionTypes$1.SENDING_HANGOUT_STARTED,
        pendingHangout: messaging,
      });
    }
  }

  function onBlock() {
    try {
      const { email } = hangout;
      const timestamp = Date.now();
      const block = {
        username: hangout.username,
        email,
        message: {
          text: "You have blocked this user",
          timestamp,
          type: "blocked",
        },
        command: "BLOCK",
        timestamp,
      };
      updateHangout({
        hangout: block,
        name: username,
        dispatch,
      });
      saveSentMessage({
        hangout: block,
        dispatch,
        name: username,
        dState: "pending",
      });
      dispatch({
        type: actionTypes$1.SENDING_HANGOUT_STARTED,
        pendingHangout: block,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function onUnblock() {}

  return {
    onInvite,
    onAccept,
    onDecline,
    onBlock,
    onUnblock,
    onMessage,
    state,
    onNavigation,
    onMessageText,
    messageText,
    dispatch,
    hangout,
    hangouts,
    username,
    messages,
    readyState,
  };
}

//fetch hangout from server if not found in local hangouts
async function searchHangouts({ search, dispatch, username }) {
  try {
    const response = await fetch(
      `/hangouts/findOne?search=${search}&username=${username}`
    );

    if (response.ok) {
      const { hangouts } = await response.json(); //3.

      dispatch({
        type: actionTypes$1.SEARCH_HANGOUT_SUCCESS,
        hangouts,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.SEARCH_HANGOUT_FAILED,
      error,
    });
  }
}
async function findHangouts({ dispatch, username }) {
  try {
    const response = await fetch(`/hangouts/findHangouts?username=${username}`);

    if (response.ok) {
      const { hangouts } = await response.json();

      if (hangouts.length > 0) {
        localStorage.setItem(`${username}-hangouts`, JSON.stringify(hangouts));
      }

      dispatch({
        type: actionTypes$1.FETCH_HANGOUTS_SUCCESS,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.FETCH_HANGOUTS_FAILED,
      error,
    });
  }
}

function WebSocketContainer(props) {
  const { state: authState } = useAuth();
  const { username, token } = useUserName();
  const [socket, setSocket] = v$1(null);
  const { children, socketUrl } = props;
  const { dispatch, state } = useHangouts();
  const {
    searchHangouts: searchHangouts$1,
    search,
    pendingHangout,
    fetchHangouts,
  } = state;
  p$1(() => {
    if (username && socket === null) {
      setSocket(new WebSocket(`${socketUrl}/hangouts/?username=${username}`));
      dispatch({
        type: actionTypes$1.SOCKET_READY,
      });
    }

    if (!username && socket) {
      socket.close();
      setSocket(null);
      dispatch({
        type: actionTypes$1.SET_HANGOUT_TO_INIT_STATE,
      });
    }
  }, [username, socket]);
  p$1(() => {
    if (socket) {
      socket.onmessage = (serverMessage) => {
        const msg = JSON.parse(serverMessage.data);
        dispatch({
          type: actionTypes$1.SERVER_MESSAGE_RECIEVED,
          message: msg,
        });
      };

      socket.onopen = () => {
        dispatch({
          type: actionTypes$1.OPEN,
        });
      };

      socket.onclose = () => {
        dispatch({
          type: actionTypes$1.CLOSED,
        });
      };

      socket.onerror = (error) => {
        dispatch({
          type: actionTypes$1.SOCKET_ERROR,
          error,
        });
      };
    }
  }, [socket]);
  p$1(() => {
    if (searchHangouts$1) {
      //2.
      searchHangouts({
        dispatch,
        search,
        username,
      });
    }
  }, [searchHangouts$1]);
  p$1(() => {
    if (pendingHangout) {
      sendPendingHangout();
    }
  }, [pendingHangout]);
  p$1(() => {
    if (fetchHangouts && username) {
      findHangouts({
        dispatch,
        username,
      });
    }
  }, [fetchHangouts, username]);

  function sendPendingHangout() {
    try {
      socket.send(JSON.stringify(pendingHangout));
      dispatch({
        type: actionTypes$1.SENDING_HANGOUT_FULLFILLED,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return children;
}

function HangoutAdapter(props) {
  {
    return h(WebSocketContainer, props);
  }
}

/* eslint-disable no-undef */
function AppProviders({ children }) {
  return h(
    AppRouteProvider,
    {
      title: "Webcom",
      initState: {
        route: "/",
        featureRoute: "/hangouts",
      },
    },
    h(
      AuthProvider,
      null,
      h(
        HangoutsProvider,
        null,
        h(
          HangoutAdapter,
          {
            socketUrl: `wss://${"10.100.36.114"}:3000`,
          },
          children
        )
      )
    )
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

function NavItem({ children }) {
  return h(
    "li",
    {
      className: "nav-item",
    },
    children
  );
}
function NavLink(props) {
  const { appRoute } = props;
  const { onAppRoute } = useAppRoute();

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    onAppRoute({
      featureRoute: `/${id}`,
      route: appRoute,
    });
  }

  return h(
    "a",
    _extends(
      {
        className: "nav-link",
        href: "#",
        onClick: handleRoute,
      },
      props
    )
  );
}

function Nav(props) {
  const { children, horizontalAlignment } = props;
  return h(
    "ul",
    _extends(
      {
        className: `nav ${horizontalAlignment && horizontalAlignment}`,
      },
      props
    ),
    children
  );
}

function useSearch({ state, dispatch, onAppRoute }) {
  const { search, searchResult } = state;

  function onSearchSelect(e) {
    const { id } = e.target;
    const hangout = searchResult.find((s) => s.username === id);
    dispatch({
      type: actionTypes$1.SELECTED_HANGOUT,
      hangout,
    });
    onAppRoute({
      featureRoute: `/${hangout.state}`,
      route: "/hangouts",
    });
  }

  function onSearchInput(e) {
    dispatch({
      type: actionTypes$1.SEARCH_INPUT_CHANGE,
      search: e.target.value,
    });
  }

  function onSearch() {
    dispatch({
      type: actionTypes$1.SEARCH_HANGOUT_STARTED,
    });
  }

  return {
    onSearch,
    onSearchInput,
    onSearchSelect,
    search,
    searchResult,
  };
}

function filterHangouts({ filter, dispatch, name }) {
  const hangoutKey = `${name}-hangouts`;
  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));

  if (localHangouts && localHangouts.length > 0) {
    let filteredHangouts = localHangouts.filter((f) =>
      f.username.includes(filter)
    );

    if (filteredHangouts && filteredHangouts.length > 0) {
      dispatch({
        type: actionTypes$1.HANGOUTS_UPDATED,
        hangouts: filterHangouts,
      });
    } else {
      dispatch({
        type: actionTypes$1.HANGOUTS_UPDATED,
        hangouts: [],
      });
    }
  }
}

function loadHangouts({ name, dispatch }) {
  const hangoutKey = `${name}-hangouts`;
  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));

  if (localHangouts && localHangouts.length > 0) {
    dispatch({
      type: actionTypes$1.LOADED_HANGOUTS,
      hangouts: localHangouts,
    });
  }
}

function useFilter({ state, dispatch, onAppRoute, username }) {
  const { filter, filterResult } = state;
  p$1(() => {
    if (filter.length > 0) {
      //
      filterHangouts({
        filter,
        dispatch,
        name: username,
      });
    }
  }, [filter]);

  function onFilterInput(e) {
    dispatch({
      type: actionTypes$1.FILTER_INPUT_CHANGED,
      filter: e.target.value,
    });
  }

  function onFilterSelect(e) {
    const { id } = e.target;
    const hangout = filterResult.find((s) => s.username === id);
    dispatch({
      type: actionTypes$1.SELECTED_HANGOUT,
      hangout,
    });
    onAppRoute({
      featureRoute: `/${hangout.state}`,
      route: "/hangouts",
    });
  }

  function onLoadHangout() {
    loadHangouts({
      dispatch,
      name: username,
    });
  }

  return {
    filter,
    filterResult,
    onFilterSelect,
    onFilterInput,
    onLoadHangout,
  };
}

function useUnread({ state, dispatch, onAppRoute, username }) {
  const { unreadhangouts } = state;

  function onUnreadSelect({ hangout }) {
    dispatch({
      type: actionTypes$1.SELECTED_HANGOUT,
      hangout,
    });
    onAppRoute({
      featureRoute: `/${hangout.state}`,
      route: "/hangouts",
    });
  }

  function onUnreadRemove() {}

  return {
    unreadhangouts,
    onUnreadSelect,
    onUnreadRemove,
  };
}

const Block = L(() => import("./Block-61312099.js"));
const Blocked = L(() => import("./Blocked-6768124c.js"));
const Configure = L(() => import("./Configure-275a074a.js"));
const Hangchat = L(() => import("./Hangchat-8a3ad7cb.js"));
const Invite = L(() => import("./Invite-16a4d377.js"));
const Invitee = L(() => import("./Invitee-5674da91.js"));
const Inviter = L(() => import("./Inviter-c4535443.js"));
const Search = L(() => import("./Search-4c3700cd.js"));
const Filter = L(() => import("./Filter-d025d46c.js"));
const UnreadHangouts = L(() => import("./UnreadHangouts-9ea079d7.js"));
function HangoutsFeatureRoutes(props) {
  const { onAppRoute } = useAppRoute();
  const {
    state,
    hangout,
    onInvite,
    onAccept,
    onDecline,
    onBlock,
    onUnblock,
    onMessage,
    onMessageText,
    messageText,
    username,
    messages,
    dispatch,
    onNavigation,
  } = useHangouts();
  const {
    search,
    onSearchInput,
    searchResult,
    onSearch,
    onSearchSelect,
  } = useSearch({
    state,
    dispatch,
    onAppRoute,
  });
  const {
    filter,
    filterResult,
    onFilterSelect,
    onFilterInput,
    onLoadHangout,
  } = useFilter({
    dispatch,
    state,
    onAppRoute,
    username,
  });
  const { unreadhangouts, onUnreadSelect, onUnreadRemove } = useUnread({
    state,
    dispatch,
    onAppRoute,
    username,
  });
  const { loading } = state;
  return [
    h(
      FeatureRoute,
      {
        path: "/bckui",
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Block, {
          hangout: hangout,
          onBlock: onBlock,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        paths: ["/UNBLOCK", "/DECLINED"],
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Blocked, {
          hangout: hangout,
          onUnblock: onUnblock,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/configure",
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Configure, {
          hangout: hangout,
          onNavigation: onNavigation,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        paths: [
          "/ACCEPTED",
          "/ACCEPTER",
          "/MESSANGER",
          "/MESSAGED",
          "/BLOCKER",
          "/BLOCKED",
          "/UNBLOCKED",
          "/UNBLOCKER",
          "/READ",
        ],
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Hangchat, {
          loading: loading,
          onNavigation: onNavigation,
          hangout: hangout,
          onMessageText: onMessageText,
          onMessage: onMessage,
          messages: messages,
          username: username,
          messageText: messageText,
          dispatch: dispatch,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/INVITE",
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Invite, {
          loading: loading,
          hangout: hangout,
          onInvite: onInvite,
          onMessageText: onMessageText,
          messageText: messageText,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        paths: ["/INVITED", "/DECLINER"],
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Invitee, {
          hangout: hangout,
          loading: loading,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/INVITER",
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Inviter, {
          loading: loading,
          hangout: hangout,
          onAccept: onAccept,
          onDecline: onDecline,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/unread",
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(UnreadHangouts, {
          unreadhangouts: unreadhangouts,
          onUnreadSelect: onUnreadSelect,
          onUnreadRemove: onUnreadRemove,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/search",
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Search, {
          onSearchSelect: onSearchSelect,
          searchResult: searchResult,
          onSearch: onSearch,
          onSearchInput: onSearchInput,
          search: search,
        })
      )
    ),
    h(
      FeatureRoute,
      {
        path: "/filter",
      },
      h(
        U,
        {
          fallback: h(Loading, null),
        },
        h(Filter, {
          onLoadHangout: onLoadHangout,
          onNavigation: onNavigation,
          filter: filter,
          onFilterInput: onFilterInput,
          filterResult: filterResult,
          onFilterSelect: onFilterSelect,
        })
      )
    ),
  ];
}

function Loading() {
  return h(
    "div",
    {
      "data-testid": "loading",
    },
    "Loading"
  );
}

var HangoutsFeatureRoutes$1 = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  default: HangoutsFeatureRoutes,
});

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

function PersonPlusIcon(props) {
  const { width, height } = props;
  return h(
    "svg",
    {
      width: width,
      height: height,
      viewBox: "0 0 16 16",
      className: "bi bi-person-plus",
      fill: "white",
      xmlns: "http://www.w3.org/2000/svg",
    },
    h("path", {
      "fill-rule": "evenodd",
      d:
        "M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm4.5 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z",
    }),
    h("path", {
      "fill-rule": "evenodd",
      d: "M13 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z",
    })
  );
}

function AppNavigation() {
  const { username } = useUserName();
  const { onSignOut } = useAuth();
  const { state, onNavigation } = useHangouts();
  const { hangout, unreadhangouts } = state;
  return h(
    "div",
    null,
    h(
      Navbar,
      {
        brand: "Webcom",
        bg: "dark",
      },
      h(
        NavBarCollapse,
        null,
        h(
          NavBarNav,
          null,
          h(
            NavItem,
            null,
            username &&
              h(
                NavLink,
                {
                  id: "filter",
                  appRoute: "/hangouts",
                  "data-testid": "hangouts-link",
                },
                "Hangouts"
              )
          )
        ),
        h(
          Nav,
          {
            horizontalAlignment: "justify-content-end",
          },
          username &&
            h(
              "button",
              {
                id: "unread",
                appRoute: "/unread",
                onClick: onNavigation,
                "data-testid": "unread-link",
                type: "button",
                class: "btn btn-dark",
              },
              "messages",
              " ",
              h(
                "span",
                {
                  class: "badge badge-light",
                  "data-testid": "message-count",
                },
                unreadhangouts ? unreadhangouts.length : 0
              )
            ),
          !username &&
            h(
              NavItem,
              null,
              h(
                NavLink,
                {
                  id: "login",
                  appRoute: "/auth",
                  "data-testid": "login-link",
                },
                "Sign in"
              )
            ),
          !username &&
            h(
              NavItem,
              null,
              h(
                NavLink,
                {
                  id: "signup",
                  appRoute: "/auth",
                  "data-testid": "signup-link",
                },
                "Sign up"
              )
            ),
          h(
            NavItem,
            null,
            username &&
              h(
                NavLink,
                {
                  id: "profile",
                  appRoute: "/auth",
                  "data-testid": "profile-link",
                },
                "Welcome, ",
                username
              )
          ),
          h(
            NavItem,
            null,
            username &&
              h(
                NavLink,
                {
                  id: "profile",
                  appRoute: "/auth",
                  "data-testid": "signout-link",
                  onClick: onSignOut,
                },
                "Sign out"
              )
          ),
          h(
            NavItem,
            null,
            hangout &&
              h(
                "button",
                {
                  className: "btn",
                  "data-testid": "nav-config",
                  id: "configure",
                  onClick: onNavigation,
                },
                h(GearIcon, {
                  color: "white",
                })
              )
          ),
          h(
            NavItem,
            null,
            h(
              FeatureRoute,
              {
                path: "/filter",
              },
              h(
                "button",
                {
                  className: "btn",
                  "data-testid": "search-link",
                  id: "search",
                  onClick: onNavigation,
                },
                h(PersonPlusIcon, {
                  width: "1.5em",
                  height: "1.5em",
                })
              )
            )
          )
        )
      )
    )
  );
}

function Home() {
  return h(
    "div",
    {
      "data-testid": "home",
      style: {
        paddingTop: 68,
      },
    },
    "Home"
  );
}

const HangoutsFeatureRoutes$2 = L(() =>
  Promise.resolve().then(function () {
    return HangoutsFeatureRoutes$1;
  })
);
function AppRoutes() {
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
        path: "/auth",
      },
      h(AuthFeatureRoutes, null)
    ),
    h(
      AppRoute,
      {
        path: "/",
      },
      h(Home, null)
    ),
    h(
      AppRoute,
      {
        path: "/hangouts",
      },
      h(
        U,
        {
          fallback: h("div", null, "loading..."),
        },
        h(HangoutsFeatureRoutes$2, null)
      )
    )
  );
}

function App() {
  return h("div", null, h(AppNavigation, null), h(AppRoutes, null), "");
}

Parse.initialize(
  "zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA",
  "Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"
); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY

Parse.serverURL = `https://${"10.100.36.114"}:1337/parse`; //Parse.liveQueryServerURL = `https://${"10.100.36.114"}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
//Parse.liveQueryServerURL = `wss://webapis.back4app.io`

H(h(AppProviders, null, h(App, null)), document.body);

export { _extends as _, h, p$1 as p, v$1 as v, y };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYzQwMjFhNjcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2FwcC1yb3V0ZS9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvbG9jYWwtc3RvcmFnZS9jb21tb24uanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvdXNlTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9hdXRoUmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL2h0dHAtc3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3ZhbGlkYXRpb24vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3ZhbGlkYXRpb24vc2VydmVyRXJyb3JBY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3ZhbGlkYXRpb24vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3ZhbGlkYXRpb24vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc2VydmljZXMvbm9kZWpzL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc2VydmljZXMvbm9kZWpzL05vZGVBdXRoU2VydmljZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9BdXRoQWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9BdXRoUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvdXNlVXNlck5hbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvY2xpZW50Q29tbWFuZHMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VBdXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9jb21wYXQvZGlzdC9jb21wYXQubW9kdWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL0F1dGhGZWF0dXJlUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc2VydmljZXMvd2Vic29ja2V0L2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc2VydmljZXMvd2Vic29ja2V0L1dlYlNvY2tldENvbnRhaW5lci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0QWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwUHJvdmlkZXJzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbmF2LWJhci9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL25hdi9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS91c2VTZWFyY2guanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvbG9jYWwtc3RvcmFnZS9sb2NhbC9maWx0ZXJIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9sb2NhbC1zdG9yYWdlL2xvY2FsL2xvYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS91c2VGaWx0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvdXNlVW5yZWFkLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL0hhbmdvdXRzRmVhdHVyZVJvdXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2ljb25zL2Jvb3RzdHJhcC9HZWFySWNvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2ljb25zL2Jvb3RzdHJhcC9QZXJzb25QbHVzSWNvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwTmF2aWdhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvSG9tZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9BcHAuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwcy93ZWJjb20tYXBwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBzdXBwb3J0ID0ge1xuICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICBibG9iOlxuICAgICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmXG4gICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbn1cblxuZnVuY3Rpb24gaXNEYXRhVmlldyhvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG59XG5cbmlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICBdXG5cbiAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICBBcnJheUJ1ZmZlci5pc1ZpZXcgfHxcbiAgICBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gIH1cbiAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgfVxuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG5mdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvclxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpdGVyYXRvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gIHRoaXMubWFwID0ge31cblxuICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICB9LCB0aGlzKVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSArICcsICcgKyB2YWx1ZSA6IHZhbHVlXG59XG5cbkhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2gobmFtZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaXRlbXMucHVzaCh2YWx1ZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5pZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xufVxuXG5mdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICB9XG4gIGJvZHkuYm9keVVzZWQgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICB9XG4gICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICB9XG4gIHJldHVybiBjaGFycy5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgaWYgKGJ1Zi5zbGljZSkge1xuICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgfSBlbHNlIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gIH1cbn1cblxuZnVuY3Rpb24gQm9keSgpIHtcbiAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5ID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbnZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICByZXR1cm4gbWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEgPyB1cGNhc2VkIDogbWV0aG9kXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICB9XG4gICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgdGhpcy5zaWduYWwgPSBpbnB1dC5zaWduYWxcbiAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgfVxuXG4gIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJ1xuICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIH1cbiAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICB0aGlzLnNpZ25hbCA9IG9wdGlvbnMuc2lnbmFsIHx8IHRoaXMuc2lnbmFsXG4gIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgfVxuICB0aGlzLl9pbml0Qm9keShib2R5KVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywge2JvZHk6IHRoaXMuX2JvZHlJbml0fSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICBib2R5XG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnJicpXG4gICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gIHJldHVybiBmb3JtXG59XG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMwI3NlY3Rpb24tMy4yXG4gIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGhlYWRlcnNcbn1cblxuQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxufVxuXG5Cb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgdXJsOiB0aGlzLnVybFxuICB9KVxufVxuXG5SZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cblJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxufVxuXG5leHBvcnQgdmFyIERPTUV4Y2VwdGlvbiA9IHNlbGYuRE9NRXhjZXB0aW9uXG50cnkge1xuICBuZXcgRE9NRXhjZXB0aW9uKClcbn0gY2F0Y2ggKGVycikge1xuICBET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB2YXIgZXJyb3IgPSBFcnJvcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFja1xuICB9XG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERPTUV4Y2VwdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwgJiYgcmVxdWVzdC5zaWduYWwuYWJvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICB9XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICB9XG5cbiAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgfSlcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCkge1xuICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBET05FIChzdWNjZXNzIG9yIGZhaWx1cmUpXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICB9KVxufVxuXG5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcblxuaWYgKCFzZWxmLmZldGNoKSB7XG4gIHNlbGYuZmV0Y2ggPSBmZXRjaFxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG59XG4iLCJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgQVBQX1JPVVRFX0NIQU5HRUQ6IFwiQVBQX1JPVVRFX0NIQU5HRURcIixcbiAgLy8gIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xufTtcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSBcIi4vYWN0aW9uVHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICByb3V0ZTogYWN0aW9uLnJvdXRlLFxuICAgICAgICBmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUsXG4gICAgICB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLCB1c2VNZW1vLCB1c2VFZmZlY3QgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgeyByZWR1Y2VyIH0gZnJvbSBcIi4vcmVkdWNlclwiO1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tIFwiLi9hY3Rpb25UeXBlc1wiO1xuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuXG5mdW5jdGlvbiB1c2VBcHBSb3V0ZUNvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XG5cbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXNlQXBwUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFJvdXRlUHJvdmlkZXJcIik7XG4gIH1cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZVJvdXRlKHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcblxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xuICBjb25zdCB7IGZlYXR1cmVSb3V0ZSB9ID0gc3RhdGU7XG5cbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKHBhdGhzICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gZmVhdHVyZVJvdXRlKSkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSgpIHtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3QgeyBuYW1lIH0gPSBzdGF0ZTtcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7IHJvdXRlLCBmZWF0dXJlUm91dGUgfSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShuYW1lLCBKU09OLnN0cmluZ2lmeSh7IHJvdXRlLCBmZWF0dXJlUm91dGUgfSkpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSwgcm91dGUgfSk7XG4gIH1cblxuICByZXR1cm4geyBvbkFwcFJvdXRlIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XG5cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3QgeyByb3V0ZSB9ID0gc3RhdGU7XG4gIGlmIChwYXRoICYmIHJvdXRlID09PSBwYXRoKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IHsgaW5pdFN0YXRlIH0gPSBwcm9wcztcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUubmFtZSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdGF0ZS5uYW1lKSkge1xuICAgICAgY29uc3QgeyBmZWF0dXJlUm91dGUsIHJvdXRlIH0gPSBKU09OLnBhcnNlKFxuICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdGF0ZS5uYW1lKVxuICAgICAgKTtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSwgcm91dGUgfSk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xuICAvL2ZldGNoXG4gIEZFVENIX0hBTkdPVVRTX1NUQVJURUQ6IFwiRkVUQ0hfSEFOR09VVFNfU1RBUlRFRFwiLFxuICBGRVRDSF9IQU5HT1VUU19TVUNDRVNTOiBcIkZFVENIX0hBTkdPVVRTX1NVQ0NFU1NcIixcbiAgRkVUQ0hfSEFOR09VVFNfRkFJTEVEOiBcIkZFVENIX0hBTkdPVVRTX0ZBSUxFRFwiLFxuXG4gIC8vc2VhcmNoXG4gIFNFQVJDSF9JTlBVVF9DSEFOR0U6IFwiU0VBUkNIX0lOUFVUX0NIQU5HRVwiLFxuICBTRUFSQ0hfSEFOR09VVF9TVEFSVEVEOiBcIlNFQVJDSF9IQU5HT1VUX1NUQVJURURcIixcbiAgU0VBUkNIX0hBTkdPVVRfU1VDQ0VTUzogXCJTRUFSQ0hfSEFOR09VVF9TVUNDRVNTXCIsXG4gIFNFQVJDSF9IQU5HT1VUX0ZBSUxFRDogXCJTRUFSQ0hfSEFOR09VVF9GQUlMRURcIixcbiAgLy9maWx0ZXJcbiAgRklMVEVSX0lOUFVUX0NIQU5HRUQ6IFwiRklMVEVSX0lOUFVUX0NIQU5HRURcIixcblxuICBTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRDogXCJTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRFwiLFxuICBTRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRDogXCJTRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRFwiLFxuXG4gIE1FU1NBR0VfVEVYVF9DSEFOR0VEOiBcIk1FU1NBR0VfVEVYVF9DSEFOR0VEXCIsXG5cbiAgTE9BREVEX0hBTkdPVVRTOiBcIkxPQURFRF9IQU5HT1VUU1wiLFxuICBMT0FERURfTUVTU0FHRVM6IFwiTE9BREVEX01FU1NBR0VTXCIsXG5cbiAgU0VMRUNURURfSEFOR09VVDogXCJTRUxFQ1RFRF9IQU5HT1VUXCIsXG4gIENMRUFSRURfSEFOR09VVDogXCJDTEVBUkVEX0hBTkdPVVRcIixcblxuICBFUlJPUl9SRUNJRVZFRDogXCJFUlJPUl9SRUNJRVZFRFwiLFxuICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogXCJPTkxJTkVfU1RBVEVfQ0hBTkdFRFwiLFxuXG4gIFNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEOiBcIlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEXCIsXG5cbiAgTUVTU0FHRVNfVVBEQVRFRDogXCJNRVNTQUdFU19VUERBVEVEXCIsXG4gIEhBTkdPVVRTX1VQREFURUQ6IFwiSEFOR09VVFNfVVBEQVRFRFwiLFxuICBIQU5HT1VUX1VQREFURUQ6IFwiSEFOR09VVF9VUERBVEVEXCIsXG4gIFVOUkVBRF9IQU5HT1VUU19VUERBVEVEOiBcIlVOUkVBRF9IQU5HT1VUU19VUERBVEVEXCIsXG4gIC8vU09DS0VUXG5cbiAgQ09OTkVDVElORzogXCJDT05ORUNUSU5HXCIsXG4gIE9QRU46IFwiT1BFTlwiLFxuICBDTE9TSU5HOiBcIkNMT1NJTkdcIixcbiAgQ0xPU0VEOiBcIkNMT1NFRFwiLFxuICBTT0NLRVRfUkVBRFk6IFwiU09DS0VUX1JFQURZXCIsXG4gIFNPQ0tFVF9FUlJPUjogXCJTT0NLRVRfRVJST1JcIixcblxuICAvL3VzZXIgc2lnZWQgb3V0XG4gIFNFVF9IQU5HT1VUX1RPX0lOSVRfU1RBVEU6IFwiU0VUX0hBTkdPVVRfVE9fSU5JVF9TVEFURVwiLFxufTtcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSBcIi4vYWN0aW9uVHlwZXNcIjtcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGhhbmdvdXRzOiBudWxsLFxuICBoYW5nb3V0OiBudWxsLFxuICB1bnJlYWRoYW5nb3V0czogW10sXG4gIG1lc3NhZ2VzOiBudWxsLFxuXG4gIGxvYWRpbmc6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgbWVzc2FnZVRleHQ6IFwiXCIsXG4gIG9ubGluZTogZmFsc2UsXG4gIHNvY2tldDogbnVsbCxcbiAgcmVhZHlTdGF0ZTogMCxcbiAgc29ja2V0TWVzc2FnZTogbnVsbCxcbiAgLy9zZWFyY2hcbiAgc2VhcmNoOiBcIlwiLFxuICBzZWFyY2hSZXN1bHQ6IFtdLFxuICBzZWFyY2hIYW5nb3V0czogZmFsc2UsXG5cbiAgLy9maWx0ZXJcbiAgZmlsdGVyOiBcIlwiLFxuICBmaWx0ZXJSZXN1bHQ6IFtdLFxuXG4gIC8vZmV0Y2hcbiAgZmV0Y2hIYW5nb3V0czogZmFsc2UsXG5cbiAgcGVuZGluZ0hhbmdvdXQ6IG51bGwsXG4gIG1lc3NhZ2U6IG51bGwsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVRfSEFOR09VVF9UT19JTklUX1NUQVRFOlxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUU19TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGZldGNoSGFuZ291dHM6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRTX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZmV0Y2hIYW5nb3V0czogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRTX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBmZXRjaEhhbmdvdXRzOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRVJST1JfUkVDSUVWRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIC8vcGVuZGluZyBoYW5nb3V0XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBwZW5kaW5nSGFuZ291dDogbnVsbCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcGVuZGluZ0hhbmdvdXQ6IGFjdGlvbi5wZW5kaW5nSGFuZ291dCB9O1xuICAgIC8vLS0tLVxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXQ6IG51bGwgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHVucmVhZGhhbmdvdXRzOiBhY3Rpb24udW5yZWFkaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgLy9zZWFyY2hcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSF9IQU5HT1VUX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSwgc2VhcmNoSGFuZ291dHM6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHNlYXJjaFJlc3VsdDogYWN0aW9uLmhhbmdvdXRzLFxuICAgICAgICBzZWFyY2hIYW5nb3V0czogZmFsc2UsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VBUkNIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBlcnJvcjogYWN0aW9uLmVycm9yLFxuICAgICAgICBzZWFyY2hIYW5nb3V0czogZmFsc2UsXG4gICAgICB9O1xuXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hfSU5QVVRfQ0hBTkdFOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xuICAgIC8vZmlsdGVyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSU5QVVRfQ0hBTkdFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBmaWx0ZXI6IGFjdGlvbi5maWx0ZXIgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURFRF9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBmaWx0ZXJSZXN1bHQ6IGFjdGlvbi5oYW5nb3V0cyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcbiAgICAgIH07XG4gICAgLy9TT0NLRVRcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUjpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DT05ORUNUSU5HOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9QRU46XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0lORzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAyIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBoYW5nb3V0U3RhdGVzID0ge1xuICBJTlZJVEVSOiBcIklOVklURVJcIixcbiAgQUNDRVBURVI6IFwiQUNDRVBURVJcIixcbiAgREVDTElORVI6IFwiREVDTElORVJcIixcbiAgQkxPQ0tFUjogXCJCTE9DS0VSXCIsXG4gIFVOQkxPQ0tFUjogXCJVTkJMT0NLRVJcIixcbiAgTUVTU0FOR0VSOiBcIk1FU1NBTkdFUlwiLFxuICBSRUFERVI6IFwiUkVBREVSXCIsXG4gIC8vIGFja25vd2xlZ2VtZW50XG4gIElOVklURUQ6IFwiSU5WSVRFRFwiLFxuICBBQ0NFUFRFRDogXCJBQ0NFUFRFRFwiLFxuICBERUNMSU5FRDogXCJERUNMSU5FRFwiLFxuICBCTE9DS0VEOiBcIkJMT0NLRURcIixcbiAgVU5CTE9DS0VEOiBcIlVOQkxPQ0tFRFwiLFxuICBNRVNTQUdFRDogXCJNRVNTQUdFRFwiLFxuICBSRUFEOiBcIlJFQURcIixcbn07XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gXCIuLi9hY3Rpb25UeXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVW5yZWFkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGRTdGF0ZSB9KSB7XG4gIGNvbnN0IHsgdXNlcm5hbWUsIHRpbWVzdGFtcCB9ID0gaGFuZ291dDtcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XG4gIGNvbnN0IHJlYWRIYW5nb3V0ID0geyAuLi5oYW5nb3V0LCBkU3RhdGUgfTtcbiAgbGV0IGxvY2FsSGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gbG9jYWxIYW5nb3V0cy5maW5kSW5kZXgoXG4gICAgKGYpID0+IGYudXNlcm5hbWUgPT09IHVzZXJuYW1lICYmIGYudGltZXN0YW1wID09PSB0aW1lc3RhbXBcbiAgKTtcbiAgbG9jYWxIYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCByZWFkSGFuZ291dCk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGxvY2FsSGFuZ291dHMpKTtcbiAgZGlzcGF0Y2goe1xuICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxuICAgIHVucmVhZGhhbmdvdXRzOiBsb2NhbEhhbmdvdXRzLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZW50TWVzc2FnZSh7IGhhbmdvdXQsIGRpc3BhdGNoLCBuYW1lLCBkU3RhdGUgfSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCBsb2NhbE1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XG4gIGNvbnN0IHBlbmRpbmdNZXNzYWdlID0geyAuLi5tZXNzYWdlLCB1c2VybmFtZTogbmFtZSwgc3RhdGU6IGRTdGF0ZSB9O1xuICBpZiAobG9jYWxNZXNzYWdlcyAmJiBsb2NhbE1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgIG1lc3NhZ2VLZXksXG4gICAgICBKU09OLnN0cmluZ2lmeShbLi4ubG9jYWxNZXNzYWdlcywgcGVuZGluZ01lc3NhZ2VdKVxuICAgICk7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCxcbiAgICAgIG1lc3NhZ2VzOiBbLi4ubG9jYWxNZXNzYWdlcywgcGVuZGluZ01lc3NhZ2VdLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KFtwZW5kaW5nTWVzc2FnZV0pKTtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELFxuICAgICAgbWVzc2FnZXM6IFtwZW5kaW5nTWVzc2FnZV0sXG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRNZXNzYWdlKHsgaGFuZ291dCwgZGlzcGF0Y2gsIG5hbWUsIGRTdGF0ZSB9KSB7XG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XG4gIGNvbnN0IGxvY2FsTWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcbiAgY29uc3QgcGVuZGluZ01lc3NhZ2UgPSB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCBzdGF0ZTogZFN0YXRlIH07XG4gIGlmIChsb2NhbE1lc3NhZ2VzICYmIGxvY2FsTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgbWVzc2FnZUtleSxcbiAgICAgIEpTT04uc3RyaW5naWZ5KFsuLi5sb2NhbE1lc3NhZ2VzLCBwZW5kaW5nTWVzc2FnZV0pXG4gICAgKTtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELFxuICAgICAgbWVzc2FnZXM6IFsuLi5sb2NhbE1lc3NhZ2VzLCBwZW5kaW5nTWVzc2FnZV0sXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkoW3BlbmRpbmdNZXNzYWdlXSkpO1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsXG4gICAgICBtZXNzYWdlczogW3BlbmRpbmdNZXNzYWdlXSxcbiAgICB9KTtcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbnJlYWQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgZFN0YXRlIH0pIHtcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XG4gIGxldCBsb2NhbEhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XG4gIGNvbnN0IHVucmVhZEhhbmdvdXQgPSB7IC4uLmhhbmdvdXQsIGRTdGF0ZSB9O1xuICBpZiAobG9jYWxIYW5nb3V0cyAmJiBsb2NhbEhhbmdvdXRzLmxlbmd0aCA+IDApIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgIGhhbmdvdXRLZXksXG4gICAgICBKU09OLnN0cmluZ2lmeShbLi4ubG9jYWxIYW5nb3V0cywgdW5yZWFkSGFuZ291dF0pXG4gICAgKTtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcbiAgICAgIHVucmVhZGhhbmdvdXRzOiBbLi4ubG9jYWxIYW5nb3V0cywgdW5yZWFkSGFuZ291dF0sXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoW3VucmVhZEhhbmdvdXRdKSk7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXG4gICAgICB1bnJlYWRoYW5nb3V0czogW3VucmVhZEhhbmdvdXRdLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVTZW50TWVzc2FnZSh7IGhhbmdvdXQsIG5hbWUsIGRpc3BhdGNoLCBkU3RhdGUgfSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xuICBjb25zdCB7IHRpbWVzdGFtcCB9ID0gbWVzc2FnZTtcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgdXBkYXRlZE1lc3NhZ2UgPSB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lOiBuYW1lLCBzdGF0ZTogZFN0YXRlIH07XG4gIGNvbnN0IGxvY2FsTWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcblxuICBsZXQgbWVzc2FnZUluZGV4ID0gbG9jYWxNZXNzYWdlcy5maW5kSW5kZXgoKGkpID0+IHtcbiAgICBpLnVzZXJuYW1lID09PSB1c2VybmFtZSwgaS50aW1lc3RhbXAgPT09IHRpbWVzdGFtcDtcbiAgfSk7XG4gIGxvY2FsTWVzc2FnZXMuc3BsaWNlKG1lc3NhZ2VJbmRleCwgMSwgdXBkYXRlZE1lc3NhZ2UpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShsb2NhbE1lc3NhZ2VzKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IGxvY2FsTWVzc2FnZXMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWNpZXZlZE1lc3NhZ2Uoe1xuICBoYW5nb3V0LFxuICBuYW1lLFxuICBkaXNwYXRjaCxcbiAgZFN0YXRlLFxuICBtZXNzYWdlZEJ5LFxufSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xuXG4gIGNvbnN0IHsgdGltZXN0YW1wIH0gPSBtZXNzYWdlO1xuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCB1cGRhdGVkTWVzc2FnZSA9IHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHN0YXRlOiBkU3RhdGUgfTtcbiAgY29uc3QgbG9jYWxNZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xuXG4gIGxldCBtZXNzYWdlSW5kZXggPSBsb2NhbE1lc3NhZ2VzLmZpbmRJbmRleCgoaSkgPT4ge1xuICAgIGkudXNlcm5hbWUgPT09IHVzZXJuYW1lLCBpLnRpbWVzdGFtcCA9PT0gdGltZXN0YW1wO1xuICB9KTtcbiAgbG9jYWxNZXNzYWdlcy5zcGxpY2UobWVzc2FnZUluZGV4LCAxLCB1cGRhdGVkTWVzc2FnZSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KGxvY2FsTWVzc2FnZXMpKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogbG9jYWxNZXNzYWdlcyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCB9KSB7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XG5cbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcbiAgbGV0IGxvY2FsSGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcbiAgbGV0IGhhbmdvdXRJbmRleCA9IGxvY2FsSGFuZ291dHMuZmluZEluZGV4KChsKSA9PiBsLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG4gIGxvY2FsSGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgaGFuZ291dCk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGxvY2FsSGFuZ291dHMpKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogbG9jYWxIYW5nb3V0cyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dCwgZGlzcGF0Y2gsIG5hbWUgfSkge1xuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xuICBsZXQgbG9jYWxIYW5nb3V0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpO1xuXG4gIGlmIChsb2NhbEhhbmdvdXRzICYmIGxvY2FsSGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgaGFuZ291dEtleSxcbiAgICAgIEpTT04uc3RyaW5naWZ5KFsuLi5sb2NhbEhhbmdvdXRzLCBoYW5nb3V0XSlcbiAgICApO1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsXG4gICAgICBoYW5nb3V0czogWy4uLmxvY2FsSGFuZ291dHMsIGhhbmdvdXRdLFxuICAgIH0pO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9VUERBVEVELCBoYW5nb3V0OiBoYW5nb3V0IH0pO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IFtoYW5nb3V0XSB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVW5yZWFkKHsgaGFuZ291dCwgZGlzcGF0Y2gsIG5hbWUgfSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCB0aW1lc3RhbXAgfSA9IGhhbmdvdXQ7XG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xuICBsZXQgbG9jYWxIYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xuICBjb25zdCBoYW5nb3V0SW5kZXggPSBsb2NhbEhhbmdvdXRzLmZpbmRJbmRleChcbiAgICAoZikgPT4gZi51c2VybmFtZSA9PT0gdXNlcm5hbWUgJiYgZi50aW1lc3RhbXAgPT09IHRpbWVzdGFtcFxuICApO1xuICBsb2NhbEhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShsb2NhbEhhbmdvdXRzKSk7XG4gIGRpc3BhdGNoKHtcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcbiAgICB1bnJlYWRoYW5nb3V0czogbG9jYWxIYW5nb3V0cyxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVVbnJlYWRzKHsgZGlzcGF0Y2gsIG5hbWUgfSkge1xuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcbiAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oaGFuZ291dEtleSk7XG4gIGRpc3BhdGNoKHtcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcbiAgICB1bnJlYWRoYW5nb3V0czogW10sXG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gXCJwcmVhY3QvaG9va3NcIjtcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5pbXBvcnQgeyBoYW5nb3V0U3RhdGVzIH0gZnJvbSBcInNlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzXCI7XG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gXCIuL2FjdGlvblR5cGVzXCI7XG5pbXBvcnQge1xuICB1cGRhdGVVbnJlYWQsXG4gIHVwZGF0ZVNlbnRNZXNzYWdlLFxuICBzYXZlVW5yZWFkLFxuICBzYXZlUmVjaWV2ZWRNZXNzYWdlLFxuICB1cGRhdGVIYW5nb3V0LFxuICByZW1vdmVVbnJlYWQsXG4gIHJlbW92ZVVucmVhZHMsXG59IGZyb20gXCIuL2xvY2FsLXN0b3JhZ2UvY29tbW9uXCI7XG5leHBvcnQgZnVuY3Rpb24gdXNlTWVzc2FnZSh7IG1lc3NhZ2UsIHVzZXJuYW1lLCBkaXNwYXRjaCwgZm9jdXNlZEhhbmdvdXQgfSkge1xuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XG4gIGZ1bmN0aW9uIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQsIG9mZmxpbmUgfSkge1xuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRDpcbiAgICAgICAgc2F2ZVVuYmxvdmtlZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcbiAgICAgICAgICBvbkFwcFJvdXRlLFxuICAgICAgICAgIG9mZmxpbmUsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVEOlxuICAgICAgICB1cGRhdGVIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWU6IHVzZXJuYW1lIH0pO1xuICAgICAgICB1cGRhdGVTZW50TWVzc2FnZSh7IGhhbmdvdXQsIG5hbWU6IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRCB9KTtcbiAgICAgICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6IFwiL2hhbmdvdXRzXCIgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxuICAgICAgICB1cGRhdGVVbnJlYWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZTogdXNlcm5hbWUsIGRTdGF0ZTogXCJyZWFkXCIgfSk7XG4gICAgICAgIHVwZGF0ZVNlbnRNZXNzYWdlKHsgaGFuZ291dCwgbmFtZTogdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEIH0pO1xuICAgICAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogXCIvaGFuZ291dHNcIiB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XG4gICAgICAgIHVwZGF0ZVVucmVhZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lOiB1c2VybmFtZSwgZFN0YXRlOiBcInJlYWRcIiB9KTtcbiAgICAgICAgdXBkYXRlSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lOiB1c2VybmFtZSB9KTtcbiAgICAgICAgdXBkYXRlU2VudE1lc3NhZ2UoeyBoYW5nb3V0LCBuYW1lOiB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQgfSk7XG4gICAgICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiBcIi9oYW5nb3V0c1wiIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VEOlxuICAgICAgICB1cGRhdGVIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWU6IHVzZXJuYW1lIH0pO1xuICAgICAgICB1cGRhdGVTZW50TWVzc2FnZSh7IGhhbmdvdXQsIG5hbWU6IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcbiAgICAgICAgcmVtb3ZlVW5yZWFkcyh7IGRpc3BhdGNoLCBuYW1lIH0pO1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRCwgaGFuZ291dCB9KTtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRCB9KTtcbiAgICAgICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6IFwiL2hhbmdvdXRzXCIgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxuICAgICAgICB1cGRhdGVIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWU6IHVzZXJuYW1lLCBoYW5nb3V0IH0pO1xuICAgICAgICB1cGRhdGVTZW50TWVzc2FnZSh7XG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBkU3RhdGU6IFwiZGVsaXZlcmVkXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5SRUFEOlxuICAgICAgICB1cGRhdGVIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWU6IHVzZXJuYW1lLCBoYW5nb3V0IH0pO1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEIH0pO1xuICAgICAgICByZW1vdmVVbnJlYWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZTogdXNlcm5hbWUgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25IYW5nb3V0KHsgaGFuZ291dCB9KSB7XG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XG4gICAgICAgIHVwZGF0ZUhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZTogdXNlcm5hbWUsIGhhbmdvdXQgfSk7XG4gICAgICAgIHNhdmVSZWNpZXZlZE1lc3NhZ2Uoe1xuICAgICAgICAgIGhhbmdvdXQsXG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgbmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgZFN0YXRlOiBcInVucmVhZFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgc2F2ZVVucmVhZCh7IGRpc3BhdGNoLCBuYW1lOiB1c2VybmFtZSwgaGFuZ291dCB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFUjpcbiAgICAgICAgdXBkYXRlSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lOiB1c2VybmFtZSwgaGFuZ291dCB9KTtcbiAgICAgICAgcmVtb3ZlVW5yZWFkcyh7IGRpc3BhdGNoLCBuYW1lIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FUjpcbiAgICAgICAgdXBkYXRlSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lOiB1c2VybmFtZSwgaGFuZ291dCB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcbiAgICAgICAgc2F2ZVVucmVhZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICBkU3RhdGU6IFwidW5yZWFkXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBzYXZlUmVjaWV2ZWRNZXNzYWdlKHtcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgIG5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgIGRTdGF0ZTogXCJ1bnJlYWRcIixcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcbiAgICAgICAgdXBkYXRlSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lOiB1c2VybmFtZSwgaGFuZ291dCB9KTtcbiAgICAgICAgc2F2ZVVucmVhZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICBkU3RhdGU6IFwidW5yZWFkXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBzYXZlUmVjaWV2ZWRNZXNzYWdlKHtcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgIG5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgIGRTdGF0ZTogXCJ1bnJlYWRcIixcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFUjpcbiAgICAgICAgLy8gc2F2ZVVuYmxvY2tlcih7XG4gICAgICAgIC8vICAgZGlzcGF0Y2gsXG4gICAgICAgIC8vICAgaGFuZ291dCxcbiAgICAgICAgLy8gICBuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgLy8gICBmb2N1c2VkSGFuZ291dCxcbiAgICAgICAgLy8gICBvbkFwcFJvdXRlLFxuICAgICAgICAvLyAgIHVucmVhZCxcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlJFQURFUjpcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzIH0pIHtcbiAgICBoYW5nb3V0cy5mb3JFYWNoKChoYW5nb3V0KSA9PiB7XG4gICAgICBvbkhhbmdvdXQoeyBoYW5nb3V0LCB1bnJlYWQ6IHRydWUgfSk7XG4gICAgfSk7XG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChtZXNzYWdlICYmIHVzZXJuYW1lKSB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwiQUNLSE9XTEVER0VNRU5UXCI6XG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LCBvZmZsaW5lOiBmYWxzZSB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkhBTkdPVVRcIjpcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBmb2N1c2VkSGFuZ291dCAmJlxuICAgICAgICAgICAgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IG1lc3NhZ2UuaGFuZ291dC51c2VybmFtZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgb25IYW5nb3V0KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LCB1bnJlYWQ6IGZhbHNlIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbkhhbmdvdXQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsIHVucmVhZDogdHJ1ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJVTlJFQURfSEFOR09VVFNcIjpcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzOiBtZXNzYWdlLmhhbmdvdXRzIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiT0ZGTElORV9BQ0tOXCI6XG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LCBvZmZsaW5lOiB0cnVlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW21lc3NhZ2UsIHVzZXJuYW1lXSk7XG5cbiAgcmV0dXJuIHt9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBWQUxVRV9DSEFOR0VEOiBcIlZBTFVFX0NIQU5HRURcIixcbiAgTE9HSU5fU1RBUlRFRDogXCJMT0dJTl9TVEFSVEVEXCIsXG4gIExPR0lOX1NVQ0NFU1M6IFwiTE9HSU5fU1VDQ0VTU1wiLFxuICBMT0dJTl9GQUlMRUQ6IFwiTE9HSU5fRkFJTEVEXCIsXG5cbiAgTE9HT1VUOiBcIkxPR09VVFwiLFxuXG4gIFNJR05VUF9TVEFSVEVEOiBcIlNJR05VUF9TVEFSVEVEXCIsXG4gIFNJR05VUF9TVUNDRVNTOiBcIlNJR05VUF9TVUNDRVNTXCIsXG4gIFNJR05VUF9GQUlMRUQ6IFwiU0lHTlVQX0ZBSUxFRFwiLFxuXG4gIENIQU5HRV9QQVNTV09SRF9TVEFSVEVEOiBcIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEXCIsXG4gIENIQU5HRV9QQVNTV09SRF9TVUNDRVNTOiBcIkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTXCIsXG4gIENIQU5HRV9QQVNTV09SRF9GQUlMRUQ6IFwiQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRFwiLFxuXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDogXCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURURcIixcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiBcIlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTU1wiLFxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDogXCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRFwiLFxuXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogXCJHT1RfVE9LRU5fRlJPTV9VUkxcIixcblxuICBSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6IFwiUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFXCIsXG5cbiAgU0VSVkVSX0VSUk9SX1JFQ0lFVkVEOiBcIlNFUlZFUl9FUlJPUl9SRUNJRVZFRFwiLFxuXG4gIENPTlNUUkFJTlRfVkFMSURBVElPTjogXCJDT05TVFJBSU5UX1ZBTElEQVRJT05cIixcblxuICBTRVRfRVJST1JfVE9fTlVMTDogXCJTRVRfRVJST1JfVE9fTlVMTFwiLFxufTtcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tIFwiLi9hY3Rpb25UeXBlc1wiO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgbG9naW46IGZhbHNlLFxuICBzaWdudXA6IGZhbHNlLFxuICBjaGFuZ2VQYXNzd29yZDogZmFsc2UsXG4gIHJlcXVlc3RQYXNzQ2hhbmdlOiBmYWxzZSxcbiAgdmFsaWRhdGlvbjoge1xuICAgIHVzZXJuYW1lOiB7IGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogXCJcIiB9LFxuICAgIGVtYWlsOiB7IGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogXCJcIiB9LFxuICAgIHBhc3N3b3JkOiB7IGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogXCJcIiB9LFxuICAgIGNvbmZpcm06IHtcbiAgICAgIGlzVmFsaWQ6IHVuZGVmaW5lZCxcbiAgICAgIG1lc3NhZ2U6IFwiXCIsXG4gICAgfSxcbiAgICBlbWFpbG9ydXNlcm5hbWU6IHsgaXNWYWxpZDogdW5kZWZpbmVkLCBtZXNzYWdlOiBcIlwiIH0sXG4gIH0sXG4gIGVtYWlsOiBcIlwiLFxuICBwYXNzd29yZDogXCJcIixcbiAgc3VjY2VzczogZmFsc2UsXG4gIGVycm9yOiBudWxsLFxuICB1c2VybmFtZTogXCJcIixcbiAgbG9hZGluZzogZmFsc2UsXG4gIGNvbmZpcm06IFwiXCIsXG4gIGN1cnJlbnQ6IFwiXCIsXG4gIGVtYWlsb3J1c2VybmFtZTogXCJcIixcbiAgdG9rZW46IG51bGwsXG4gIGF1dGhGZWVkYmFjazogbnVsbCxcbiAgdXNlcjogbnVsbCxcbiAgc2lnbm91dDogZmFsc2UsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0aFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVRfRVJST1JfVE9fTlVMTDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBlcnJvcjogbnVsbCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcbiAgICAgICAgICBbYWN0aW9uLm5hbWVdOiB7IGlzVmFsaWQ6IGFjdGlvbi5pc1ZhbGlkLCBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBbYWN0aW9uLm5hbWVdOiBhY3Rpb24udmFsdWUsXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBsb2dpbjogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgdXNlcjogYWN0aW9uLnVzZXIsXG4gICAgICAgIHBhc3N3b3JkOiBcIlwiLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgbG9naW46IGZhbHNlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBzaWdudXA6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyOiBhY3Rpb24udXNlcixcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBzaWdudXA6IGZhbHNlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBjaGFuZ2VQYXNzd29yZDogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHVzZXI6IGFjdGlvbi51c2VyLFxuICAgICAgICBjaGFuZ2VQYXNzd29yZDogZmFsc2UsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgY2hhbmdlUGFzc3dvcmQ6IGZhbHNlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSwgcmVxdWVzdFBhc3NDaGFuZ2U6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgcmVxdWVzdFBhc3NDaGFuZ2U6IGZhbHNlLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCByZXF1ZXN0UGFzc0NoYW5nZTogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVQ6XG4gICAgICByZXR1cm4geyAuLi5pbml0U3RhdGUsIHNpZ25vdXQ6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB1c2VyOiBhY3Rpb24udXNlcixcbiAgICAgIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBhY2NvdW50QWxyZWFkeUV4aXRzOiAyMDIsXG4gIC8vbG9naW5cbiAgY3JlZGVudGlhbEludmFsaWQ6IFwiNDAxXCIsXG4gIC8vc2lnbnVwXG4gIHVzZXJuYW1lSXNUYWtlbjogXCI0MDJcIixcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6IFwiNDAzXCIsXG4gIHVzZXJuYW1lSW52YWxpZDogXCI0MDVcIixcbiAgcGFzc3dvcmRJbnZhbGlkOiBcIjQwNlwiLCAvL2NoYW5nZSBwYXNzd29yZFxuICBlbWFpbEludmFsaWQ6IFwiNDA3XCIsXG4gIC8vbG9naW5cbiAgZW1haWxJc05vdFJlZ2lzdGVyZWQ6IFwiNDA4XCIsXG4gIGVtcHR5UGFzc3dvcmROb3RWYWxpZDogXCI0MDlcIixcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6IFwiNDEwXCIsXG4gIHVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOiBcIjQxMVwiLFxuICAvL2NoYW5nZSBwYXNzd29yZFxuICBwYXNzd29yZERvTm90TWF0Y2g6IFwiNDEyXCIsXG4gIHRva2VuRXhwaXJlZDogXCI0MTNcIixcbiAgc2VydmVyVmFsaWRhdGlvblJhbmdlOiAoc3RhdHVzKSA9PiB7XG4gICAgaWYgKHN0YXR1cyA+PSA0MDAgJiYgc3RhdHVzIDw9IDQxMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOVkFMSURfUEFTU1dPUkQ6XG4gICAgXCJhdCBsZWFzdCA4IGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBhdCBsZWFzdCAxIHVwcGVyY2FzZSBsZXR0ZXIsIDEgbG93ZXJjYXNlIGxldHRlciwgQ2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzXCIsXG4gIElOVkFMSURfRU1BSUw6IFwiZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZFwiLFxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogXCJlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZFwiLFxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogXCJ1c2VybmFtZSBpcyBub3QgcmVnaXN0ZXJlZFwiLFxuICBJTlZBTElEX1VTRVJOQU1FOlxuICAgIFwib25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWRcIixcbiAgSU5WQUxJRF9FTVBUWV9TVFJJTkc6IFwiUmVxdWlyZWQgZmllbGRcIixcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogXCJlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWRcIixcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogXCJpbnZhbGlkIGNyZWRlbnRpYWxzIHByb3ZpZGVkXCIsXG4gIFVTRVJOQU1FX1RBS0VOOiBcInVzZXJuYW1lIGlzIGFscmVhZHkgdGFrZW5cIixcbiAgUkVHSVNURVJFRF9FTUFJTDogXCJlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWRcIixcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogXCJwYXNzd29yZHMgZG8gbm90IG1hdGNoXCIsXG4gIEFDQ09VTlRfQUxSRUFEWV9FWElTVFM6IFwiQWNjb3VudCBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyB1c2VybmFtZS5cIixcbiAgUkVRVUlSRURfRklFTEQ6IFwiUmVxdWlyZWQgZmllbGRcIixcbn07XG4iLCJpbXBvcnQgaHR0cFN0YXR1cyBmcm9tIFwiLi9odHRwLXN0YXR1c1wiO1xuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tIFwiLi92YWxpZGF0aW9uTWVzc2FnZXNcIjtcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tIFwiLi4vc3RhdGUvYWN0aW9uVHlwZXNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwLCBkaXNwYXRjaCB9KSB7XG4gIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgY2FzZSAxMDE6XG4gICAgY2FzZSAyMDA6XG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOlxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgfSk7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixcbiAgICAgICAgbmFtZTogXCJlbWFpbG9ydXNlcm5hbWVcIixcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDEyNTpcbiAgICBjYXNlIC0zOlxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbEludmFsaWQ6XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixcbiAgICAgICAgbmFtZTogXCJlbWFpbFwiLFxuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZEludmFsaWQ6XG4gICAgY2FzZSAtNDpcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLFxuICAgICAgICBuYW1lOiBcInVzZXJuYW1lXCIsXG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyMDM6XG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICAgIG5hbWU6IFwiZW1haWxcIixcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRUdJU1RFUkVEX0VNQUlMLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDIwMjogLy9wYXJzZVxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzVGFrZW46XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixcbiAgICAgICAgbmFtZTogXCJ1c2VybmFtZVwiLFxuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX1RBS0VOLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlQYXNzd29yZE5vdFZhbGlkOlxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRVFVSVJFRF9GSUVMRCxcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcbiAgICAgIH0pO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICAgIG5hbWU6IFwiY29uZmlybVwiLFxuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlthLXpBLVpdKS57OCx9JC9nO1xuXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcblxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcbiIsImltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSBcIi4vdmFsaWRhdGlvbk1lc3NhZ2VzXCI7XG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSBcIi4vdmFsaWRhdGlvblJlZ2V4XCI7XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XG5cbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgbWVzc2FnZTogXCJcIixcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkge1xuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBtZXNzYWdlOiBcIlwiLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IFwiXCIsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcblxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBtZXNzYWdlOiBcIlwiLFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBtZXNzYWdlOiBcIlwiLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KSB7XG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9IGF1dGg7XG5cbiAgaWYgKHBhc3N3b3JkID09PSBcIlwiIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxuICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IFwiXCIsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pIHtcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVRVUlSRURfRklFTEQsXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOiBcIlwiLFxuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSBcIi4uLy4uL3N0YXRlL2FjdGlvblR5cGVzXCI7XG5pbXBvcnQgc2VydmVyVmFsaWRhdGlvbiBmcm9tIFwiLi4vLi4vdmFsaWRhdGlvbi9zZXJ2ZXJFcnJvckFjdGlvbnNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvc2lnbnVwYCwge1xuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBDb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICB9KTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUyxcbiAgICAgICAgdXNlcjogeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0sXG4gICAgICB9KTtcblxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICBcIndlYmNvbVwiLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgZW1haWwsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XG5cbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzOiBlcnJvciwgZGlzcGF0Y2ggfSk7XG4gICAgICB9KTtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9FUlJPUl9SRUNJRVZFRCwgZXJyb3IgfSk7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGVyciA9IGVycm9yO1xuXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQsIGVycm9yIH0pO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL2xvZ2luYCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbi1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIjogXCIqXCIsXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCYXNpYyAke2J0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApfWAsXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLFxuICAgICAgICB1c2VyOiB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSxcbiAgICAgIH0pO1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICBcIndlYmNvbVwiLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgZW1haWwsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XG5cbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzOiBlcnJvciwgZGlzcGF0Y2ggfSk7XG4gICAgICB9KTtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVELCBlcnJvciB9KTtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9FUlJPUl9SRUNJRVZFRCwgZXJyb3IgfSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQgfSk7XG4gIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBjb25maXJtLCBwYXNzd29yZCB9ID0gc3RhdGU7XG4gICAgY29uc3QgeyB0b2tlbiB9ID0gc3RhdGUudXNlcjtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL2NoYW5nZXBhc3NgLCB7XG4gICAgICBtZXRob2Q6IFwicHV0XCIsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGNvbmZpcm0sXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICB0b2tlbixcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XG5cbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXG4gICAgICAgIHVzZXI6IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9LFxuICAgICAgfSk7XG5cbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgXCJ3ZWJjb21cIixcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgIGVtYWlsLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xuXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1czogZXJyb3IsIGRpc3BhdGNoIH0pO1xuICAgICAgfSk7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9FUlJPUl9SRUNJRVZFRCwgZXJyb3IgfSk7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQsIGVycm9yIH0pO1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9yZXF1ZXN0cGFzc2NoYW5nZWAsIHtcbiAgICAgIG1ldGhvZDogXCJwb3N0XCIsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsIH0pLFxuICAgIH0pO1xuXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XG4gICAgICAgIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXM6IGVycm9yLCBkaXNwYXRjaCB9KTtcbiAgICAgIH0pO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVELCBlcnJvciB9KTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXJyID0gZXJyb3I7XG5cbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9FUlJPUl9SRUNJRVZFRCwgZXJyb3IgfSk7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gXCIuL2FjdGlvbnNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5vZGVBdXRoU2VydmljZSh7IGNoaWxkcmVuLCBzdGF0ZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCB7IGxvZ2luLCBzaWdudXAsIGNoYW5nZVBhc3N3b3JkLCByZXF1ZXN0UGFzc0NoYW5nZSB9ID0gc3RhdGU7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobG9naW4pIHtcbiAgICAgIGFjdGlvbnMubG9naW4oeyBkaXNwYXRjaCwgc3RhdGUgfSk7XG4gICAgfVxuICB9LCBbbG9naW5dKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzaWdudXApIHtcbiAgICAgIGFjdGlvbnMuc2lnbnVwKHsgZGlzcGF0Y2gsIHN0YXRlIH0pO1xuICAgIH1cbiAgfSwgW3NpZ251cF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGNoYW5nZVBhc3N3b3JkKSB7XG4gICAgICBhY3Rpb25zLmNoYW5nZVBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlIH0pO1xuICAgIH1cbiAgfSwgW2NoYW5nZVBhc3N3b3JkXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAocmVxdWVzdFBhc3NDaGFuZ2UpIHtcbiAgICAgIGFjdGlvbnMuZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUgfSk7XG4gICAgfVxuICB9LCBbcmVxdWVzdFBhc3NDaGFuZ2VdKTtcbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBQYXJzZUF1dGhTZXJ2aWNlIGZyb20gXCIuLi9zZXJ2aWNlcy9wYXJzZS9QYXJzZUF1dGhTZXJ2aWNlXCI7XG5pbXBvcnQgTm9kZUF1dGhTZXJpY2UgZnJvbSBcIi4uL3NlcnZpY2VzL25vZGVqcy9Ob2RlQXV0aFNlcnZpY2VcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhBZGFwdGVyKHByb3BzKSB7XG4gIGlmIChQUkVBQ1RfQVBQX0JBQ0sgPT09IFwiUFJFQUNUX0FQUF9QQVJTRVwiKSB7XG4gICAgcmV0dXJuIDxQYXJzZUF1dGhTZXJ2aWNlIHsuLi5wcm9wc30gLz47XG4gIH0gZWxzZSBpZiAoUFJFQUNUX0FQUF9CQUNLID09PSBcIlBSRUFDVF9BUFBfTk9ERUpTXCIpIHtcbiAgICByZXR1cm4gPE5vZGVBdXRoU2VyaWNlIHsuLi5wcm9wc30gLz47XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gXCJwcmVhY3QvaG9va3NcIjtcbmltcG9ydCB7IGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tIFwiLi9hdXRoUmVkdWNlclwiO1xuaW1wb3J0IEF1dGhBZGFwdGVyIGZyb20gXCIuL0F1dGhBZGFwdGVyXCI7XG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInVzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyXCIpO1xuICB9XG5cbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xuXG4gIHJldHVybiB7XG4gICAgc3RhdGUsXG4gICAgZGlzcGF0Y2gsXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gKFxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XG4gICAgICA8QXV0aEFkYXB0ZXIgc3RhdGU9e3N0YXRlfSBkaXNwYXRjaD17ZGlzcGF0Y2h9PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L0F1dGhBZGFwdGVyPlxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInByZWFjdC9ob29rc1wiO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tIFwiLi9BdXRoUHJvdmlkZXJcIjtcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tIFwiLi9hY3Rpb25UeXBlc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVVzZXJOYW1lKCkge1xuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbdG9rZW4sIHNldFRva2VuXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbZW1haWwsIHNldEVtYWlsXSA9IHVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbb2JqZWN0SWQsIHNldE9iamVjdElkXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwid2ViY29tXCIpKSB7XG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwsIG9iamVjdElkIH0gPSBKU09OLnBhcnNlKFxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ3ZWJjb21cIilcbiAgICAgICk7XG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XG4gICAgICBzZXRUb2tlbih0b2tlbik7XG4gICAgICBzZXRFbWFpbChlbWFpbCk7XG4gICAgICBzZXRPYmplY3RJZChvYmplY3RJZCk7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSxcbiAgICAgICAgdXNlcjogeyB1c2VybmFtZSwgdG9rZW4sIGVtYWlsLCBvYmplY3RJZCB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc3RhdGUudXNlciAmJiBzdGF0ZS51c2VyLnRva2VuKSB7XG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4sIG9iamVjdElkIH0gPSBzdGF0ZS51c2VyO1xuXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XG4gICAgICBzZXRUb2tlbih0b2tlbik7XG4gICAgICBzZXRFbWFpbChlbWFpbCk7XG4gICAgICBzZXRPYmplY3RJZChvYmplY3RJZCk7XG4gICAgfVxuICB9LCBbc3RhdGUudXNlcl0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLnVzZXIgPT09IG51bGwpIHtcbiAgICAgIHNldFVzZXJuYW1lKG51bGwpO1xuICAgICAgc2V0VG9rZW4obnVsbCk7XG4gICAgICBzZXRFbWFpbChudWxsKTtcbiAgICAgIHNldE9iamVjdElkKG51bGwpO1xuICAgIH1cbiAgfSwgW3N0YXRlXSk7XG5cbiAgcmV0dXJuIHsgdXNlcm5hbWU6IHVzZXJOYW1lLCB0b2tlbiwgZW1haWwgfTtcbn1cbiIsIi8vaXMgc2VudCBieSBjbGllbnRcbmV4cG9ydCBjb25zdCBjbGllbnRDb21tYW5kcyA9IHtcbiAgSU5WSVRFOiBcIklOVklURVwiLFxuICBBQ0NFUFQ6IFwiQUNDRVBUXCIsXG4gIERFQ0xJTkU6IFwiREVDTElORVwiLFxuICBCTE9DSzogXCJCTE9DS1wiLFxuICBVTkJMT0NLOiBcIlVOQkxPQ0tcIixcbiAgTUVTU0FHRTogXCJNRVNTQUdFXCIsXG4gIE9OTElORTogXCJPTkxJTkVcIixcbiAgUkVBRDogXCJSRUFEXCIsXG59O1xuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZU1lbW8sIHVzZVJlZHVjZXIsIHVzZUVmZmVjdCB9IGZyb20gXCJwcmVhY3QvaG9va3NcIjtcbmltcG9ydCB7IHJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gXCIuL3JlZHVjZXJcIjtcbmltcG9ydCB7IHVzZU1lc3NhZ2UgfSBmcm9tIFwiLi91c2VNZXNzYWdlXCI7XG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gXCJmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VVc2VyTmFtZVwiO1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tIFwiLi9hY3Rpb25UeXBlc1wiO1xuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tIFwiLi9jbGllbnRDb21tYW5kc1wiO1xuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEhhbmdvdXRDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlclwiKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuIH0gPSB1c2VVc2VyTmFtZSgpO1xuXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQsIG1lc3NhZ2UgfSA9IHN0YXRlO1xuICBjb25zdCBoYW5kbGVNZXNzYWdlID0gdXNlTWVzc2FnZSh7XG4gICAgbWVzc2FnZSxcbiAgICB1c2VybmFtZSxcbiAgICBkaXNwYXRjaCxcbiAgICBmb2N1c2VkSGFuZ291dDogaGFuZ291dCxcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJBQ0NFUFRFUlwiOlxuICAgICAgICBjYXNlIFwiREVDTElORVJcIjpcbiAgICAgICAgY2FzZSBcIkJMT0NLRVJcIjpcbiAgICAgICAgY2FzZSBcIk1FU1NBTkdFUlwiOlxuICAgICAgICBjYXNlIFwiVU5CTE9DS0VSXCI6XG4gICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsXG4gICAgICAgICAgICBwZW5kaW5nSGFuZ291dDogeyAuLi5oYW5nb3V0LCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5SRUFEIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVRfSEFOR09VVF9UT19JTklUX1NUQVRFIH0pO1xuICAgIH1cbiAgfSwgW3VzZXJuYW1lXSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgdW5yZWFkaGFuZ291dEtleSA9IGAke3VzZXJuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xuICAgIGNvbnN0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0S2V5KSk7XG4gICAgaWYgKHVucmVhZGhhbmdvdXRzICYmIHVucmVhZGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsIHVucmVhZGhhbmdvdXRzIH0pO1xuICAgIH1cbiAgICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYDtcbiAgICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xuXG4gICAgaWYgKCFoYW5nb3V0cykge1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUU19TVEFSVEVEIH0pO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tIFwiLi9BdXRoUHJvdmlkZXJcIjtcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tIFwiLi9hY3Rpb25UeXBlc1wiO1xuaW1wb3J0ICogYXMgY3YgZnJvbSBcIi4uL3ZhbGlkYXRpb24vY29uc3RyYWludFZhbGlkYXRvcnNcIjtcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoKCkge1xuICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgZnVuY3Rpb24gb25DaGFuZ2UoZSkge1xuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0O1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCwgbmFtZSwgdmFsdWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25Mb2dpbigpIHtcbiAgICBpZiAocGFzc3dvcmQgPT09IFwiXCIpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcIlJlcXVpcmVkIGZpZWxkXCIsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogXCJcIixcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICBuYW1lOiBcImVtYWlsb3J1c2VybmFtZVwiLFxuICAgICAgLi4uY3YudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoeyB2YWx1ZTogZW1haWxvcnVzZXJuYW1lIH0pLFxuICAgIH0pO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblNpZ251cCgpIHtcbiAgICAvLyBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3Bhc3N3b3JkJywgLi4uY3YudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB9KVxuICAgIC8vICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2VtYWlsJywgLi4uY3YudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB9KVxuICAgIC8vICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3VzZXJuYW1lJywgLi4uY3YudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB9KVxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UoKSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25QYXNzd29yZENoYW5nZSgpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TaWduT3V0KCkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwid2ViY29tXCIpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uTG9naW5CbHVyKGUpIHtcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xuICAgIGNvbnN0IHsgbmFtZSB9ID0gZS50YXJnZXQ7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgXCJwYXNzd29yZFwiOlxuICAgICAgICBpZiAocGFzc3dvcmQgPT09IFwiXCIpIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiUmVxdWlyZWQgZmllbGRcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJlbWFpbG9ydXNlcm5hbWVcIjpcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixcbiAgICAgICAgICBuYW1lOiBcImVtYWlsb3J1c2VybmFtZVwiLFxuICAgICAgICAgIC4uLmN2LnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWU6IGVtYWlsb3J1c2VybmFtZSB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwib25Mb2dpbkJsdXIgZXJyb3JcIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25TaWdudXBCbHVyKGUpIHtcbiAgICBjb25zdCB7IGVtYWlsLCB1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xuICAgIGNvbnN0IHsgbmFtZSB9ID0gZS50YXJnZXQ7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgXCJwYXNzd29yZFwiOlxuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLFxuICAgICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgICAuLi5jdi52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZW1haWxcIjpcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixcbiAgICAgICAgICBuYW1lOiBcImVtYWlsXCIsXG4gICAgICAgICAgLi4uY3YudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInVzZXJuYW1lXCI6XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sXG4gICAgICAgICAgbmFtZTogXCJ1c2VybmFtZVwiLFxuICAgICAgICAgIC4uLmN2LnZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm9uTG9naW5CbHVyIGVycm9yXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uQ2hhbmdlUGFzc0JsdXIoKSB7fVxuXG4gIGZ1bmN0aW9uIG9uUmVxdWVzdFBhc3NDaGFuZ2VCbHVyKCkge31cblxuICBmdW5jdGlvbiBvbkZvY3VzKGUpIHtcbiAgICBjb25zdCB7IG5hbWUgfSA9IGUudGFyZ2V0O1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixcbiAgICAgIG5hbWUsXG4gICAgICBpc1ZhbGlkOiB1bmRlZmluZWQsXG4gICAgICBtZXNzYWdlOiBcIlwiLFxuICAgIH0pO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VUX0VSUk9SX1RPX05VTEwgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXRlLFxuICAgIG9uRm9jdXMsXG4gICAgb25Mb2dpbkJsdXIsXG4gICAgb25TaWdudXBCbHVyLFxuICAgIG9uQ2hhbmdlUGFzc0JsdXIsXG4gICAgb25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIsXG4gICAgZGlzcGF0Y2gsXG4gICAgb25Mb2dpbixcbiAgICBvblNpZ251cCxcbiAgICBvblJlcXVlc3RQYXNzd29yZENoYW5nZSxcbiAgICBvblBhc3N3b3JkQ2hhbmdlLFxuICAgIG9uQ2hhbmdlLFxuICAgIG9uU2lnbk91dCxcbiAgfTtcbn1cbiIsImltcG9ydHt1c2VTdGF0ZSBhcyBuLHVzZVJlZHVjZXIgYXMgdCx1c2VFZmZlY3QgYXMgZSx1c2VMYXlvdXRFZmZlY3QgYXMgcix1c2VSZWYgYXMgbyx1c2VJbXBlcmF0aXZlSGFuZGxlIGFzIHUsdXNlTWVtbyBhcyBpLHVzZUNhbGxiYWNrIGFzIGYsdXNlQ29udGV4dCBhcyBjLHVzZURlYnVnVmFsdWUgYXMgYX1mcm9tXCJwcmVhY3QvaG9va3NcIjtleHBvcnQqZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e0NvbXBvbmVudCBhcyBsLGNyZWF0ZUVsZW1lbnQgYXMgcyxvcHRpb25zIGFzIHYsdG9DaGlsZEFycmF5IGFzIGgsaHlkcmF0ZSBhcyBwLHJlbmRlciBhcyBkLF91bm1vdW50IGFzIG0sY2xvbmVFbGVtZW50IGFzIHksY3JlYXRlUmVmIGFzIGIsY3JlYXRlQ29udGV4dCBhcyBnLEZyYWdtZW50IGFzIHh9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2NyZWF0ZUVsZW1lbnQsY3JlYXRlQ29udGV4dCxjcmVhdGVSZWYsRnJhZ21lbnQsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2Z1bmN0aW9uIEUobix0KXtmb3IodmFyIGUgaW4gdCluW2VdPXRbZV07cmV0dXJuIG59ZnVuY3Rpb24gdyhuLHQpe2Zvcih2YXIgZSBpbiBuKWlmKFwiX19zb3VyY2VcIiE9PWUmJiEoZSBpbiB0KSlyZXR1cm4hMDtmb3IodmFyIHIgaW4gdClpZihcIl9fc291cmNlXCIhPT1yJiZuW3JdIT09dFtyXSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgQz1mdW5jdGlvbihuKXt2YXIgdCxlO2Z1bmN0aW9uIHIodCl7dmFyIGU7cmV0dXJuKGU9bi5jYWxsKHRoaXMsdCl8fHRoaXMpLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwLGV9cmV0dXJuIGU9biwodD1yKS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Ll9fcHJvdG9fXz1lLHIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuLHQpe3JldHVybiB3KHRoaXMucHJvcHMsbil8fHcodGhpcy5zdGF0ZSx0KX0scn0obCk7ZnVuY3Rpb24gXyhuLHQpe2Z1bmN0aW9uIGUobil7dmFyIGU9dGhpcy5wcm9wcy5yZWYscj1lPT1uLnJlZjtyZXR1cm4hciYmZSYmKGUuY2FsbD9lKG51bGwpOmUuY3VycmVudD1udWxsKSx0PyF0KHRoaXMucHJvcHMsbil8fCFyOncodGhpcy5wcm9wcyxuKX1mdW5jdGlvbiByKHQpe3JldHVybiB0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1lLHMobixFKHt9LHQpKX1yZXR1cm4gci5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD0hMCxyLmRpc3BsYXlOYW1lPVwiTWVtbyhcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIixyLnQ9ITAscn12YXIgQT12Ll9fYjtmdW5jdGlvbiBTKG4pe2Z1bmN0aW9uIHQodCl7dmFyIGU9RSh7fSx0KTtyZXR1cm4gZGVsZXRlIGUucmVmLG4oZSx0LnJlZil9cmV0dXJuIHQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9dC50PSEwLHQuZGlzcGxheU5hbWU9XCJGb3J3YXJkUmVmKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHR9di5fX2I9ZnVuY3Rpb24obil7bi50eXBlJiZuLnR5cGUudCYmbi5yZWYmJihuLnByb3BzLnJlZj1uLnJlZixuLnJlZj1udWxsKSxBJiZBKG4pfTt2YXIgaz1mdW5jdGlvbihuLHQpe3JldHVybiBuP2gobikucmVkdWNlKGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gbi5jb25jYXQodChlLHIpKX0sW10pOm51bGx9LFI9e21hcDprLGZvckVhY2g6ayxjb3VudDpmdW5jdGlvbihuKXtyZXR1cm4gbj9oKG4pLmxlbmd0aDowfSxvbmx5OmZ1bmN0aW9uKG4pe2lmKDEhPT0obj1oKG4pKS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuXCIpO3JldHVybiBuWzBdfSx0b0FycmF5Omh9LEY9di5fX2U7ZnVuY3Rpb24gTihuKXtyZXR1cm4gbiYmKChuPUUoe30sbikpLl9fYz1udWxsLG4uX19rPW4uX19rJiZuLl9fay5tYXAoTikpLG59ZnVuY3Rpb24gVSgpe3RoaXMuX191PTAsdGhpcy5vPW51bGwsdGhpcy5fX2I9bnVsbH1mdW5jdGlvbiBNKG4pe3ZhciB0PW4uX18uX19jO3JldHVybiB0JiZ0LnUmJnQudShuKX1mdW5jdGlvbiBMKG4pe3ZhciB0LGUscjtmdW5jdGlvbiBvKG8pe2lmKHR8fCh0PW4oKSkudGhlbihmdW5jdGlvbihuKXtlPW4uZGVmYXVsdHx8bn0sZnVuY3Rpb24obil7cj1ufSkscil0aHJvdyByO2lmKCFlKXRocm93IHQ7cmV0dXJuIHMoZSxvKX1yZXR1cm4gby5kaXNwbGF5TmFtZT1cIkxhenlcIixvLnQ9ITAsb31mdW5jdGlvbiBPKCl7dGhpcy5pPW51bGwsdGhpcy5sPW51bGx9di5fX2U9ZnVuY3Rpb24obix0LGUpe2lmKG4udGhlbilmb3IodmFyIHIsbz10O289by5fXzspaWYoKHI9by5fX2MpJiZyLl9fYylyZXR1cm4gci5fX2Mobix0Ll9fYyk7RihuLHQsZSl9LChVLnByb3RvdHlwZT1uZXcgbCkuX19jPWZ1bmN0aW9uKG4sdCl7dmFyIGU9dGhpcztudWxsPT1lLm8mJihlLm89W10pLGUuby5wdXNoKHQpO3ZhciByPU0oZS5fX3YpLG89ITEsdT1mdW5jdGlvbigpe298fChvPSEwLHI/cihpKTppKCkpfTt0Ll9fYz10LmNvbXBvbmVudFdpbGxVbm1vdW50LHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1KCksdC5fX2MmJnQuX19jKCl9O3ZhciBpPWZ1bmN0aW9uKCl7dmFyIG47aWYoIS0tZS5fX3UpZm9yKGUuX192Ll9fa1swXT1lLnN0YXRlLnUsZS5zZXRTdGF0ZSh7dTplLl9fYj1udWxsfSk7bj1lLm8ucG9wKCk7KW4uZm9yY2VVcGRhdGUoKX07ZS5fX3UrK3x8ZS5zZXRTdGF0ZSh7dTplLl9fYj1lLl9fdi5fX2tbMF19KSxuLnRoZW4odSx1KX0sVS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMuX19iJiYodGhpcy5fX3YuX19rWzBdPU4odGhpcy5fX2IpLHRoaXMuX19iPW51bGwpLFtzKGwsbnVsbCx0LnU/bnVsbDpuLmNoaWxkcmVuKSx0LnUmJm4uZmFsbGJhY2tdfTt2YXIgUD1mdW5jdGlvbihuLHQsZSl7aWYoKytlWzFdPT09ZVswXSYmbi5sLmRlbGV0ZSh0KSxuLnByb3BzLnJldmVhbE9yZGVyJiYoXCJ0XCIhPT1uLnByb3BzLnJldmVhbE9yZGVyWzBdfHwhbi5sLnNpemUpKWZvcihlPW4uaTtlOyl7Zm9yKDtlLmxlbmd0aD4zOyllLnBvcCgpKCk7aWYoZVsxXTxlWzBdKWJyZWFrO24uaT1lPWVbMl19fTsoTy5wcm90b3R5cGU9bmV3IGwpLnU9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcyxlPU0odC5fX3YpLHI9dC5sLmdldChuKTtyZXR1cm4gclswXSsrLGZ1bmN0aW9uKG8pe3ZhciB1PWZ1bmN0aW9uKCl7dC5wcm9wcy5yZXZlYWxPcmRlcj8oci5wdXNoKG8pLFAodCxuLHIpKTpvKCl9O2U/ZSh1KTp1KCl9fSxPLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obil7dGhpcy5pPW51bGwsdGhpcy5sPW5ldyBNYXA7dmFyIHQ9aChuLmNoaWxkcmVuKTtuLnJldmVhbE9yZGVyJiZcImJcIj09PW4ucmV2ZWFsT3JkZXJbMF0mJnQucmV2ZXJzZSgpO2Zvcih2YXIgZT10Lmxlbmd0aDtlLS07KXRoaXMubC5zZXQodFtlXSx0aGlzLmk9WzEsMCx0aGlzLmldKTtyZXR1cm4gbi5jaGlsZHJlbn0sTy5wcm90b3R5cGUuY29tcG9uZW50RGlkVXBkYXRlPU8ucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50PWZ1bmN0aW9uKCl7dmFyIG49dGhpcztuLmwuZm9yRWFjaChmdW5jdGlvbih0LGUpe1AobixlLHQpfSl9O3ZhciBXPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe312YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0fSx0LnJlbmRlcj1mdW5jdGlvbihuKXtyZXR1cm4gbi5jaGlsZHJlbn0sbn0oKTtmdW5jdGlvbiBqKG4pe3ZhciB0PXRoaXMsZT1uLmNvbnRhaW5lcixyPXMoVyx7Y29udGV4dDp0LmNvbnRleHR9LG4udm5vZGUpO3JldHVybiB0LnMmJnQucyE9PWUmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpLHQucD0hMSksbi52bm9kZT90LnA/KGUuX19rPXQuX19rLGQocixlKSx0Ll9faz1lLl9fayk6KHQudj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSxwKFwiXCIsZSksZS5hcHBlbmRDaGlsZCh0LnYpLHQucD0hMCx0LnM9ZSxkKHIsZSx0LnYpLHQuX19rPXQudi5fX2spOnQucCYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCkpLHQuaD1yLHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpfSxudWxsfWZ1bmN0aW9uIHoobix0KXtyZXR1cm4gcyhqLHt2bm9kZTpuLGNvbnRhaW5lcjp0fSl9dmFyIEQ9L14oPzphY2NlbnR8YWxpZ25tZW50fGFyYWJpY3xiYXNlbGluZXxjYXB8Y2xpcCg/IVBhdGhVKXxjb2xvcnxmaWxsfGZsb29kfGZvbnR8Z2x5cGgoPyFSKXxob3JpenxtYXJrZXIoPyFIfFd8VSl8b3ZlcmxpbmV8cGFpbnR8c3RvcHxzdHJpa2V0aHJvdWdofHN0cm9rZXx0ZXh0KD8hTCl8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZWN0b3J8dmVydHx3b3JkfHdyaXRpbmd8eCg/IUMpKVtBLVpdLztsLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXt9O3ZhciBIPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpfHw2MDEwMztmdW5jdGlvbiBUKG4sdCxlKXtpZihudWxsPT10Ll9faylmb3IoO3QuZmlyc3RDaGlsZDspdC5yZW1vdmVDaGlsZCh0LmZpcnN0Q2hpbGQpO3JldHVybiBkKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH1mdW5jdGlvbiBWKG4sdCxlKXtyZXR1cm4gcChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9dmFyIFo9di5ldmVudDtmdW5jdGlvbiBJKG4sdCl7bltcIlVOU0FGRV9cIit0XSYmIW5bdF0mJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLHQse2NvbmZpZ3VyYWJsZTohMSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tcIlVOU0FGRV9cIit0XX0sc2V0OmZ1bmN0aW9uKG4pe3RoaXNbXCJVTlNBRkVfXCIrdF09bn19KX12LmV2ZW50PWZ1bmN0aW9uKG4pe1omJihuPVoobikpLG4ucGVyc2lzdD1mdW5jdGlvbigpe307dmFyIHQ9ITEsZT0hMSxyPW4uc3RvcFByb3BhZ2F0aW9uO24uc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7ci5jYWxsKG4pLHQ9ITB9O3ZhciBvPW4ucHJldmVudERlZmF1bHQ7cmV0dXJuIG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtvLmNhbGwobiksZT0hMH0sbi5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1mdW5jdGlvbigpe3JldHVybiB0fSxuLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBlfSxuLm5hdGl2ZUV2ZW50PW59O3ZhciAkPXtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xhc3N9fSxxPXYudm5vZGU7di52bm9kZT1mdW5jdGlvbihuKXtuLiQkdHlwZW9mPUg7dmFyIHQ9bi50eXBlLGU9bi5wcm9wcztpZih0KXtpZihlLmNsYXNzIT1lLmNsYXNzTmFtZSYmKCQuZW51bWVyYWJsZT1cImNsYXNzTmFtZVwiaW4gZSxudWxsIT1lLmNsYXNzTmFtZSYmKGUuY2xhc3M9ZS5jbGFzc05hbWUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiY2xhc3NOYW1lXCIsJCkpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpe3ZhciByLG8sdTtmb3IodSBpbiBlLmRlZmF1bHRWYWx1ZSYmdm9pZCAwIT09ZS52YWx1ZSYmKGUudmFsdWV8fDA9PT1lLnZhbHVlfHwoZS52YWx1ZT1lLmRlZmF1bHRWYWx1ZSksZGVsZXRlIGUuZGVmYXVsdFZhbHVlKSxBcnJheS5pc0FycmF5KGUudmFsdWUpJiZlLm11bHRpcGxlJiZcInNlbGVjdFwiPT09dCYmKGgoZS5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbihuKXstMSE9ZS52YWx1ZS5pbmRleE9mKG4ucHJvcHMudmFsdWUpJiYobi5wcm9wcy5zZWxlY3RlZD0hMCl9KSxkZWxldGUgZS52YWx1ZSksZSlpZihyPUQudGVzdCh1KSlicmVhaztpZihyKWZvcih1IGluIG89bi5wcm9wcz17fSxlKW9bRC50ZXN0KHUpP3UucmVwbGFjZSgvW0EtWjAtOV0vLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCk6dV09ZVt1XX0hZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlLHI9bi5wcm9wcztpZihyJiZcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIG89e307Zm9yKHZhciB1IGluIHIpL15vbihBbml8VHJhfFRvdSkvLnRlc3QodSkmJihyW3UudG9Mb3dlckNhc2UoKV09clt1XSxkZWxldGUgclt1XSksb1t1LnRvTG93ZXJDYXNlKCldPXU7aWYoby5vbmRvdWJsZWNsaWNrJiYoci5vbmRibGNsaWNrPXJbby5vbmRvdWJsZWNsaWNrXSxkZWxldGUgcltvLm9uZG91YmxlY2xpY2tdKSxvLm9uYmVmb3JlaW5wdXQmJihyLm9uYmVmb3JlaW5wdXQ9cltvLm9uYmVmb3JlaW5wdXRdLGRlbGV0ZSByW28ub25iZWZvcmVpbnB1dF0pLG8ub25jaGFuZ2UmJihcInRleHRhcmVhXCI9PT1lfHxcImlucHV0XCI9PT1lLnRvTG93ZXJDYXNlKCkmJiEvXmZpbHxjaGV8cmEvaS50ZXN0KHIudHlwZSkpKXt2YXIgaT1vLm9uaW5wdXR8fFwib25pbnB1dFwiO3JbaV18fChyW2ldPXJbby5vbmNoYW5nZV0sZGVsZXRlIHJbby5vbmNoYW5nZV0pfX19KCksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmIXQubSYmdC5wcm90b3R5cGUmJihJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbE1vdW50XCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzXCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsVXBkYXRlXCIpLHQubT0hMCl9cSYmcShuKX07dmFyIEI9XCIxNi44LjBcIjtmdW5jdGlvbiBHKG4pe3JldHVybiBzLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBKKG4pe3JldHVybiEhbiYmbi4kJHR5cGVvZj09PUh9ZnVuY3Rpb24gSyhuKXtyZXR1cm4gSihuKT95LmFwcGx5KG51bGwsYXJndW1lbnRzKTpufWZ1bmN0aW9uIFEobil7cmV0dXJuISFuLl9fayYmKGQobnVsbCxuKSwhMCl9ZnVuY3Rpb24gWChuKXtyZXR1cm4gbiYmKG4uYmFzZXx8MT09PW4ubm9kZVR5cGUmJm4pfHxudWxsfXZhciBZPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4odCl9O2V4cG9ydCBkZWZhdWx0e3VzZVN0YXRlOm4sdXNlUmVkdWNlcjp0LHVzZUVmZmVjdDplLHVzZUxheW91dEVmZmVjdDpyLHVzZVJlZjpvLHVzZUltcGVyYXRpdmVIYW5kbGU6dSx1c2VNZW1vOmksdXNlQ2FsbGJhY2s6Zix1c2VDb250ZXh0OmMsdXNlRGVidWdWYWx1ZTphLHZlcnNpb246XCIxNi44LjBcIixDaGlsZHJlbjpSLHJlbmRlcjpULGh5ZHJhdGU6VCx1bm1vdW50Q29tcG9uZW50QXROb2RlOlEsY3JlYXRlUG9ydGFsOnosY3JlYXRlRWxlbWVudDpzLGNyZWF0ZUNvbnRleHQ6ZyxjcmVhdGVGYWN0b3J5OkcsY2xvbmVFbGVtZW50OkssY3JlYXRlUmVmOmIsRnJhZ21lbnQ6eCxpc1ZhbGlkRWxlbWVudDpKLGZpbmRET01Ob2RlOlgsQ29tcG9uZW50OmwsUHVyZUNvbXBvbmVudDpDLG1lbW86Xyxmb3J3YXJkUmVmOlMsdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXM6WSxTdXNwZW5zZTpVLFN1c3BlbnNlTGlzdDpPLGxhenk6TH07ZXhwb3J0e0IgYXMgdmVyc2lvbixSIGFzIENoaWxkcmVuLFQgYXMgcmVuZGVyLFYgYXMgaHlkcmF0ZSxRIGFzIHVubW91bnRDb21wb25lbnRBdE5vZGUseiBhcyBjcmVhdGVQb3J0YWwsRyBhcyBjcmVhdGVGYWN0b3J5LEsgYXMgY2xvbmVFbGVtZW50LEogYXMgaXNWYWxpZEVsZW1lbnQsWCBhcyBmaW5kRE9NTm9kZSxDIGFzIFB1cmVDb21wb25lbnQsXyBhcyBtZW1vLFMgYXMgZm9yd2FyZFJlZixZIGFzIHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzLFUgYXMgU3VzcGVuc2UsTyBhcyBTdXNwZW5zZUxpc3QsTCBhcyBsYXp5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBhdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tIFwicHJlYWN0L2NvbXBhdFwiO1xuaW1wb3J0IHsgRmVhdHVyZVJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5pbXBvcnQgeyB1c2VBdXRoIH0gZnJvbSBcIi4vc3RhdGUvdXNlQXV0aFwiO1xuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydChcIi4vdWktY29tcG9uZW50cy9Mb2dpblwiKSk7XG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KFwiLi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkXCIpKTtcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL3VpLWNvbXBvbmVudHMvRm9yZ290UGFzc3dvcmRcIikpO1xuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL3VpLWNvbXBvbmVudHMvU2lnbnVwXCIpKTtcbmNvbnN0IFByb2ZpbGUgPSBsYXp5KCgpID0+IGltcG9ydChcIi4vdWktY29tcG9uZW50cy9Qcm9maWxlXCIpKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aEZlYXR1cmVSb3V0ZXMoKSB7XG4gIGNvbnN0IHtcbiAgICBvbkZvY3VzLFxuICAgIG9uTG9naW4sXG4gICAgb25Mb2dpbkJsdXIsXG4gICAgb25TaWdudXBCbHVyLFxuICAgIG9uQ2hhbmdlUGFzc0JsdXIsXG4gICAgb25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIsXG4gICAgb25TaWdudXAsXG4gICAgb25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UsXG4gICAgb25QYXNzd29yZENoYW5nZSxcbiAgICBvbkNoYW5nZSxcbiAgICBzdGF0ZSxcbiAgfSA9IHVzZUF1dGgoKTtcblxuICByZXR1cm4gW1xuICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9jaGFuZ2UtcGFzd29yZFwiPlxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICA8Q2hhbmdlUGFzc3dvcmRcbiAgICAgICAgICB7Li4uc3RhdGV9XG4gICAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICAgICAgICBvbkJsdXI9e29uQ2hhbmdlUGFzc0JsdXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIG9uUGFzc3dvcmRDaGFuZ2U9e29uUGFzc3dvcmRDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICA8L1N1c3BlbnNlPlxuICAgIDwvRmVhdHVyZVJvdXRlPixcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvbG9naW5cIj5cbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgPExvZ2luXG4gICAgICAgICAgey4uLnN0YXRlfVxuICAgICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgICAgb25CbHVyPXtvbkxvZ2luQmx1cn1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgb25Mb2dpbj17b25Mb2dpbn1cbiAgICAgICAgLz5cbiAgICAgIDwvU3VzcGVuc2U+XG4gICAgPC9GZWF0dXJlUm91dGU+LFxuICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9zaWdudXBcIj5cbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgPFNpZ251cFxuICAgICAgICAgIHsuLi5zdGF0ZX1cbiAgICAgICAgICBvbkZvY3VzPXtvbkZvY3VzfVxuICAgICAgICAgIG9uQmx1cj17b25TaWdudXBCbHVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICBvblNpZ251cD17b25TaWdudXB9XG4gICAgICAgIC8+XG4gICAgICA8L1N1c3BlbnNlPlxuICAgIDwvRmVhdHVyZVJvdXRlPixcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvZm9yZ290LXBhc3dvcmRcIj5cbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkXG4gICAgICAgICAgey4uLnN0YXRlfVxuICAgICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgICAgb25CbHVyPXtvblJlcXVlc3RQYXNzQ2hhbmdlQmx1cn1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgb25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2U9e29uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlfVxuICAgICAgICAvPlxuICAgICAgPC9TdXNwZW5zZT5cbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXG4gICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL3Byb2ZpbGVcIj5cbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgPFByb2ZpbGUgLz5cbiAgICAgIDwvU3VzcGVuc2U+XG4gICAgPC9GZWF0dXJlUm91dGU+LFxuICBdO1xufVxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tIFwiLi9hY3Rpb25UeXBlc1wiO1xuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xufVxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldEhhbmdvdXQoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSk7XG59XG5cbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxuLy8gZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4vLyAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xuLy8gfVxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xufVxuXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcbiAgICApO1xuICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCwgdGV4dCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfQ09NTUFORF9TVEFSVEVEIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKHsgaGFuZ291dCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LSR7aGFuZ291dC51c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcbn1cblxuLy9FTkQgc2F2ZUludml0ZXJcbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gXCIuL0hhbmdvdXRzUHJvdmlkZXJcIjtcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSBcImZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uXCI7XG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuaW1wb3J0IHsgY2hhbmdlTWVzc2FnZVRleHQgfSBmcm9tIFwiLi9hY3Rpb25zXCI7XG5cbmltcG9ydCB7XG4gIHVwZGF0ZVVucmVhZCxcbiAgc2F2ZVNlbnRNZXNzYWdlLFxuICBzYXZlSGFuZ291dCxcbiAgdXBkYXRlSGFuZ291dCxcbn0gZnJvbSBcIi4vbG9jYWwtc3RvcmFnZS9jb21tb25cIjtcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSBcIi4vYWN0aW9uVHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgdXNlcm5hbWUgPSBhdXRoQ29udGV4dC5zdGF0ZS51c2VyICYmIGF1dGhDb250ZXh0LnN0YXRlLnVzZXIudXNlcm5hbWU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcbiAgY29uc3QgeyBoYW5nb3V0LCBoYW5nb3V0cywgbWVzc2FnZVRleHQsIG1lc3NhZ2VzLCByZWFkeVN0YXRlIH0gPSBzdGF0ZTtcbiAgZnVuY3Rpb24gb25OYXZpZ2F0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IGlkID0gZS5jdXJyZW50VGFyZ2V0LmlkO1xuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtpZH1gLCByb3V0ZTogXCIvaGFuZ291dHNcIiB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xuICAgIGNvbnN0IHRleHQgPSBlLnRhcmdldC52YWx1ZTtcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IGRpc3BhdGNoLCB0ZXh0IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25JbnZpdGUoKSB7XG4gICAgY29uc3QgeyBlbWFpbCB9ID0gaGFuZ291dDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgbWVzc2FnZVRleHQgIT09IFwiXCIgPyB7IHRleHQ6IG1lc3NhZ2VUZXh0LCB0aW1lc3RhbXAgfSA6IG51bGw7XG4gICAgY29uc3QgaW52aXRhdGlvbiA9IHtcbiAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxuICAgICAgZW1haWwsXG4gICAgICBtZXNzYWdlLFxuICAgICAgY29tbWFuZDogXCJJTlZJVEVcIixcbiAgICAgIHRpbWVzdGFtcCxcbiAgICB9O1xuICAgIHNhdmVIYW5nb3V0KHsgaGFuZ291dDogaW52aXRhdGlvbiwgbmFtZTogdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xuICAgIHNhdmVTZW50TWVzc2FnZSh7XG4gICAgICBoYW5nb3V0OiBpbnZpdGF0aW9uLFxuICAgICAgZGlzcGF0Y2gsXG4gICAgICBuYW1lOiB1c2VybmFtZSxcbiAgICAgIGRTdGF0ZTogXCJwZW5kaW5nXCIsXG4gICAgfSk7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsXG4gICAgICBwZW5kaW5nSGFuZ291dDogaW52aXRhdGlvbixcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkFjY2VwdCgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBlbWFpbCwgdGltZXN0YW1wIH0gPSBoYW5nb3V0O1xuXG4gICAgICBjb25zdCBhY2NlcHQgPSB7XG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxuICAgICAgICBlbWFpbCxcbiAgICAgICAgbWVzc2FnZTogeyB0ZXh0OiBcIkFjY2VwdGVkIHlvdXIgaW52aXRhdGlvblwiLCB0aW1lc3RhbXAgfSxcbiAgICAgICAgY29tbWFuZDogXCJBQ0NFUFRcIixcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgfTtcblxuICAgICAgc2F2ZUhhbmdvdXQoeyBoYW5nb3V0OiBhY2NlcHQsIG5hbWU6IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcbiAgICAgIHNhdmVTZW50TWVzc2FnZSh7XG4gICAgICAgIGhhbmdvdXQ6IGFjY2VwdCxcbiAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgIG5hbWU6IHVzZXJuYW1lLFxuICAgICAgICBkU3RhdGU6IFwicGVuZGluZ1wiLFxuICAgICAgfSk7XG4gICAgICB1cGRhdGVVbnJlYWQoeyBkaXNwYXRjaCwgaGFuZ291dDogYWNjZXB0LCBuYW1lOiB1c2VybmFtZSB9KTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsXG4gICAgICAgIHBlbmRpbmdIYW5nb3V0OiBhY2NlcHQsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9uRGVjbGluZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBlbWFpbCwgdGltZXN0YW1wIH0gPSBoYW5nb3V0O1xuXG4gICAgICBjb25zdCBkZWNsaW5lID0ge1xuICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcbiAgICAgICAgZW1haWwsXG4gICAgICAgIG1lc3NhZ2U6IHsgdGV4dDogXCJZb3VyIGludml0YXRpb24gZGVjbGluZWRcIiwgdGltZXN0YW1wIH0sXG4gICAgICAgIGNvbW1hbmQ6IFwiREVDTElORVwiLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICB9O1xuXG4gICAgICB1cGRhdGVVbnJlYWQoeyBkaXNwYXRjaCwgaGFuZ291dDogZGVjbGluZSwgbmFtZTogdXNlcm5hbWUgfSk7XG4gICAgICBzYXZlU2VudE1lc3NhZ2Uoe1xuICAgICAgICBoYW5nb3V0OiBkZWNsaW5lLFxuICAgICAgICBuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgIGRTdGF0ZTogXCJwZW5kaW5nXCIsXG4gICAgICB9KTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsXG4gICAgICAgIHBlbmRpbmdIYW5nb3V0OiBkZWNsaW5lLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZSgpIHtcbiAgICBjb25zdCB7IGVtYWlsLCBzdGF0ZSB9ID0gaGFuZ291dDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICBtZXNzYWdlVGV4dCAhPT0gXCJcIiA/IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCB9IDogbnVsbDtcbiAgICBjb25zdCBtZXNzYWdpbmcgPSB7XG4gICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcbiAgICAgIGVtYWlsLFxuICAgICAgbWVzc2FnZSxcbiAgICAgIGNvbW1hbmQ6IFwiTUVTU0FHRVwiLFxuICAgICAgdGltZXN0YW1wLFxuICAgIH07XG4gICAgc2F2ZVNlbnRNZXNzYWdlKHtcbiAgICAgIGhhbmdvdXQ6IG1lc3NhZ2luZyxcbiAgICAgIGRpc3BhdGNoLFxuICAgICAgbmFtZTogdXNlcm5hbWUsXG4gICAgICBkU3RhdGU6IFwicGVuZGluZ1wiLFxuICAgIH0pO1xuICAgIGlmIChoYW5nb3V0LnN0YXRlID09PSBcIkJMT0NLRVJcIikge1xuICAgICAgZGVidWdnZXI7XG4gICAgICBzYXZlU2VudE1lc3NhZ2Uoe1xuICAgICAgICBoYW5nb3V0OiB7XG4gICAgICAgICAgLi4uaGFuZ291dCxcbiAgICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgICAuLi5oYW5nb3V0Lm1lc3NhZ2UsXG4gICAgICAgICAgICB0ZXh0OiBcIllvdSBjYW5ub3Qgc2VuZCB0aGlzIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIGJsb2NrZWRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYmxvY2tlclwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGRpc3BhdGNoLFxuICAgICAgICBuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgZFN0YXRlOiBcInBlbmRpbmdcIixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVIYW5nb3V0KHsgaGFuZ291dDogbWVzc2FnaW5nLCBuYW1lOiB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG5cbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsXG4gICAgICAgIHBlbmRpbmdIYW5nb3V0OiBtZXNzYWdpbmcsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25CbG9jaygpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBlbWFpbCB9ID0gaGFuZ291dDtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgICBjb25zdCBibG9jayA9IHtcbiAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXG4gICAgICAgIGVtYWlsLFxuICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgdGV4dDogXCJZb3UgaGF2ZSBibG9ja2VkIHRoaXMgdXNlclwiLFxuICAgICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICB0eXBlOiBcImJsb2NrZWRcIixcbiAgICAgICAgfSxcbiAgICAgICAgY29tbWFuZDogXCJCTE9DS1wiLFxuICAgICAgICB0aW1lc3RhbXAsXG4gICAgICB9O1xuXG4gICAgICB1cGRhdGVIYW5nb3V0KHsgaGFuZ291dDogYmxvY2ssIG5hbWU6IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcbiAgICAgIHNhdmVTZW50TWVzc2FnZSh7XG4gICAgICAgIGhhbmdvdXQ6IGJsb2NrLFxuICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgbmFtZTogdXNlcm5hbWUsXG4gICAgICAgIGRTdGF0ZTogXCJwZW5kaW5nXCIsXG4gICAgICB9KTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsXG4gICAgICAgIHBlbmRpbmdIYW5nb3V0OiBibG9jayxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25VbmJsb2NrKCkge31cblxuICByZXR1cm4ge1xuICAgIG9uSW52aXRlLFxuICAgIG9uQWNjZXB0LFxuICAgIG9uRGVjbGluZSxcbiAgICBvbkJsb2NrLFxuICAgIG9uVW5ibG9jayxcbiAgICBvbk1lc3NhZ2UsXG4gICAgc3RhdGUsXG4gICAgb25OYXZpZ2F0aW9uLFxuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHQsXG4gICAgZGlzcGF0Y2gsXG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICB1c2VybmFtZSxcbiAgICBtZXNzYWdlcyxcbiAgICByZWFkeVN0YXRlLFxuICB9O1xufVxuIiwiLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tIFwiLi4vLi4vc3RhdGUvYWN0aW9uVHlwZXNcIjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYC9oYW5nb3V0cy9maW5kT25lP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXG4gICAgKTtcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIC8vMy5cbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluZEhhbmdvdXRzKHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvaGFuZ291dHMvZmluZEhhbmdvdXRzP3VzZXJuYW1lPSR7dXNlcm5hbWV9YCk7XG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAoaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xuICAgICAgfVxuXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRTX1NVQ0NFU1MgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVFNfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gXCIuLi8uLi9zdGF0ZS91c2VIYW5nb3V0c1wiO1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tIFwiLi9hY3Rpb25zXCI7XG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gXCIuLi8uLi9zdGF0ZS9hY3Rpb25UeXBlc1wiO1xuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tIFwiZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvdXNlVXNlck5hbWVcIjtcbmltcG9ydCB7IHVzZUF1dGggfSBmcm9tIFwiZmVhdHVyZXMvYXV0aGVudGljYXRpb25cIjtcbmV4cG9ydCBmdW5jdGlvbiBXZWJTb2NrZXRDb250YWluZXIocHJvcHMpIHtcbiAgY29uc3QgeyBzdGF0ZTogYXV0aFN0YXRlIH0gPSB1c2VBdXRoKCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuIH0gPSB1c2VVc2VyTmFtZSgpO1xuICBjb25zdCBbc29ja2V0LCBzZXRTb2NrZXRdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgY29uc3QgeyBjaGlsZHJlbiwgc29ja2V0VXJsIH0gPSBwcm9wcztcbiAgY29uc3QgeyBkaXNwYXRjaCwgc3RhdGUgfSA9IHVzZUhhbmdvdXRzKCk7XG4gIGNvbnN0IHsgc2VhcmNoSGFuZ291dHMsIHNlYXJjaCwgcGVuZGluZ0hhbmdvdXQsIGZldGNoSGFuZ291dHMgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lICYmIHNvY2tldCA9PT0gbnVsbCkge1xuICAgICAgc2V0U29ja2V0KG5ldyBXZWJTb2NrZXQoYCR7c29ja2V0VXJsfS9oYW5nb3V0cy8/dXNlcm5hbWU9JHt1c2VybmFtZX1gKSk7XG5cbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZIH0pO1xuICAgIH1cbiAgICBpZiAoIXVzZXJuYW1lICYmIHNvY2tldCkge1xuICAgICAgc29ja2V0LmNsb3NlKCk7XG4gICAgICBzZXRTb2NrZXQobnVsbCk7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFVF9IQU5HT1VUX1RPX0lOSVRfU1RBVEUgfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWUsIHNvY2tldF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNvY2tldCkge1xuICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChzZXJ2ZXJNZXNzYWdlKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2Uoc2VydmVyTWVzc2FnZS5kYXRhKTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVELCBtZXNzYWdlOiBtc2cgfSk7XG4gICAgICB9O1xuICAgICAgc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5PUEVOIH0pO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNMT1NFRCB9KTtcbiAgICAgIH07XG4gICAgICBzb2NrZXQub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUiwgZXJyb3IgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSwgW3NvY2tldF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNlYXJjaEhhbmdvdXRzKSB7XG4gICAgICAvLzIuXG4gICAgICBhY3Rpb25zLnNlYXJjaEhhbmdvdXRzKHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XG4gICAgfVxuICB9LCBbc2VhcmNoSGFuZ291dHNdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChwZW5kaW5nSGFuZ291dCkge1xuICAgICAgc2VuZFBlbmRpbmdIYW5nb3V0KCk7XG4gICAgfVxuICB9LCBbcGVuZGluZ0hhbmdvdXRdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChmZXRjaEhhbmdvdXRzICYmIHVzZXJuYW1lKSB7XG4gICAgICBhY3Rpb25zLmZpbmRIYW5nb3V0cyh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcbiAgICB9XG4gIH0sIFtmZXRjaEhhbmdvdXRzLCB1c2VybmFtZV0pO1xuICBmdW5jdGlvbiBzZW5kUGVuZGluZ0hhbmdvdXQoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHBlbmRpbmdIYW5nb3V0KSk7XG5cbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjaGlsZHJlbjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBQYXJzZVNlcnZlciB9IGZyb20gXCIuLi9zZXJ2aWNlcy9wYXJzZS9QYXJzZVNlcnZlclwiO1xuaW1wb3J0IHsgV2ViU29ja2V0Q29udGFpbmVyIH0gZnJvbSBcIi4uL3NlcnZpY2VzL3dlYnNvY2tldC9XZWJTb2NrZXRDb250YWluZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dEFkYXB0ZXIocHJvcHMpIHtcbiAgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gXCJQUkVBQ1RfQVBQX1BBUlNFXCIpIHtcbiAgICByZXR1cm4gPFBhcnNlU2VydmVyIHsuLi5wcm9wc30gLz47XG4gIH0gZWxzZSBpZiAoUFJFQUNUX0FQUF9CQUNLID09PSBcIlBSRUFDVF9BUFBfTk9ERUpTXCIpIHtcbiAgICByZXR1cm4gPFdlYlNvY2tldENvbnRhaW5lciB7Li4ucHJvcHN9IC8+O1xuICB9IGVsc2UgcmV0dXJuIG51bGw7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBBcHBSb3V0ZVByb3ZpZGVyIGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuaW1wb3J0IEhhbmdvdXRBZGFwdGVyIGZyb20gXCJmZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0QWRhcHRlclwiO1xuaW1wb3J0IEhhbmdvdXRzUHJvdmlkZXIgZnJvbSBcImZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXJcIjtcbmltcG9ydCBBdXRoUHJvdmlkZXIgZnJvbSBcImZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uXCI7XG5leHBvcnQgZnVuY3Rpb24gQXBwUHJvdmlkZXJzKHsgY2hpbGRyZW4gfSkge1xuICByZXR1cm4gKFxuICAgIDxBcHBSb3V0ZVByb3ZpZGVyXG4gICAgICB0aXRsZT1cIldlYmNvbVwiXG4gICAgICBpbml0U3RhdGU9e3sgcm91dGU6IFwiL1wiLCBmZWF0dXJlUm91dGU6IFwiL2hhbmdvdXRzXCIgfX1cbiAgICA+XG4gICAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgICA8SGFuZ291dHNQcm92aWRlcj5cbiAgICAgICAgICA8SGFuZ291dEFkYXB0ZXIgc29ja2V0VXJsPXtgd3NzOi8vJHtpcH06MzAwMGB9PlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgIDwvSGFuZ291dEFkYXB0ZXI+XG4gICAgICAgIDwvSGFuZ291dHNQcm92aWRlcj5cbiAgICAgIDwvQXV0aFByb3ZpZGVyPlxuICAgIDwvQXBwUm91dGVQcm92aWRlcj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gXCJjb21wb25lbnRzL2FwcC1yb3V0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZiYXIocHJvcHMpIHtcbiAgY29uc3QgeyBiZyA9IFwibGlnaHRcIiwgYnJhbmQsIGNoaWxkcmVuIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciBuYXZiYXItZXhwYW5kLWxnIG5hdmJhci0ke2JnfSBiZy0ke2JnfWB9PlxuICAgICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIiNcIj5cbiAgICAgICAge2JyYW5kfVxuICAgICAgPC9hPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlclwiXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJcbiAgICAgICAgZGF0YS10YXJnZXQ9XCIjbmF2YmFyU3VwcG9ydGVkQ29udGVudFwiXG4gICAgICAgIGFyaWEtY29udHJvbHM9XCJuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCJcbiAgICAgICAgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlRvZ2dsZSBuYXZpZ2F0aW9uXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXItaWNvblwiPjwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvbmF2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyQ29sbGFwc2UoeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIj5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5hdkJhck5hdih7IGNoaWxkcmVuIH0pIHtcbiAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1yLWF1dG9cIj57Y2hpbGRyZW59PC91bD47XG59XG4vL1xuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0oeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW1cIj57Y2hpbGRyZW59PC9saT47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOYXZMaW5rKHByb3BzKSB7XG4gIGNvbnN0IHsgYXBwUm91dGUgfSA9IHByb3BzO1xuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XG5cbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCwgcm91dGU6IGFwcFJvdXRlIH0pO1xuICB9XG4gIHJldHVybiA8YSBjbGFzc05hbWU9XCJuYXYtbGlua1wiIGhyZWY9XCIjXCIgb25DbGljaz17aGFuZGxlUm91dGV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tIFwiY29tcG9uZW50cy9hcHAtcm91dGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2KHByb3BzKSB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGhvcml6b250YWxBbGlnbm1lbnQgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPHVsXG4gICAgICBjbGFzc05hbWU9e2BuYXYgJHtob3Jpem9udGFsQWxpZ25tZW50ICYmIGhvcml6b250YWxBbGlnbm1lbnR9YH1cbiAgICAgIHsuLi5wcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC91bD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSBcIi4vYWN0aW9uVHlwZXNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVNlYXJjaCh7IHN0YXRlLCBkaXNwYXRjaCwgb25BcHBSb3V0ZSB9KSB7XG4gIGNvbnN0IHsgc2VhcmNoLCBzZWFyY2hSZXN1bHQgfSA9IHN0YXRlO1xuXG4gIGZ1bmN0aW9uIG9uU2VhcmNoU2VsZWN0KGUpIHtcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcblxuICAgIGNvbnN0IGhhbmdvdXQgPSBzZWFyY2hSZXN1bHQuZmluZCgocykgPT4gcy51c2VybmFtZSA9PT0gaWQpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogXCIvaGFuZ291dHNcIiB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblNlYXJjaElucHV0KGUpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0UsIHNlYXJjaDogZS50YXJnZXQudmFsdWUgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblNlYXJjaCgpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSF9IQU5HT1VUX1NUQVJURUQgfSk7XG4gIH1cblxuICByZXR1cm4geyBvblNlYXJjaCwgb25TZWFyY2hJbnB1dCwgb25TZWFyY2hTZWxlY3QsIHNlYXJjaCwgc2VhcmNoUmVzdWx0IH07XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gXCIuLi8uLi9hY3Rpb25UeXBlc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBmaWx0ZXIsIGRpc3BhdGNoLCBuYW1lIH0pIHtcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcbiAgY29uc3QgbG9jYWxIYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xuXG4gIGlmIChsb2NhbEhhbmdvdXRzICYmIGxvY2FsSGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgIGxldCBmaWx0ZXJlZEhhbmdvdXRzID0gbG9jYWxIYW5nb3V0cy5maWx0ZXIoKGYpID0+XG4gICAgICBmLnVzZXJuYW1lLmluY2x1ZGVzKGZpbHRlcilcbiAgICApO1xuICAgIGlmIChmaWx0ZXJlZEhhbmdvdXRzICYmIGZpbHRlcmVkSGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELFxuICAgICAgICBoYW5nb3V0czogZmlsdGVySGFuZ291dHMsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogW10gfSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gXCIuLi8uLi9hY3Rpb25UeXBlc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZEhhbmdvdXRzKHsgbmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xuICBjb25zdCBsb2NhbEhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XG4gIGlmIChsb2NhbEhhbmdvdXRzICYmIGxvY2FsSGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX0hBTkdPVVRTLCBoYW5nb3V0czogbG9jYWxIYW5nb3V0cyB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tIFwiLi9hY3Rpb25UeXBlc1wiO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSBcInByZWFjdC9ob29rc1wiO1xuaW1wb3J0IGZpbHRlckhhbmdvdXRzIGZyb20gXCIuL2xvY2FsLXN0b3JhZ2UvbG9jYWwvZmlsdGVySGFuZ291dHNcIjtcbmltcG9ydCBsb2FkSGFuZ291dHMgZnJvbSBcIi4vbG9jYWwtc3RvcmFnZS9sb2NhbC9sb2FkSGFuZ291dHNcIjtcbmltcG9ydCB7XG4gIHVwZGF0ZVVucmVhZCxcbiAgdXBkYXRlUmVjaWV2ZWRNZXNzYWdlLFxuICB1cGRhdGVIYW5nb3V0LFxufSBmcm9tIFwiLi9sb2NhbC1zdG9yYWdlL2NvbW1vblwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlRmlsdGVyKHsgc3RhdGUsIGRpc3BhdGNoLCBvbkFwcFJvdXRlLCB1c2VybmFtZSB9KSB7XG4gIGNvbnN0IHsgZmlsdGVyLCBmaWx0ZXJSZXN1bHQgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGZpbHRlci5sZW5ndGggPiAwKSB7XG4gICAgICAvL1xuICAgICAgZmlsdGVySGFuZ291dHMoeyBmaWx0ZXIsIGRpc3BhdGNoLCBuYW1lOiB1c2VybmFtZSB9KTtcbiAgICB9XG4gIH0sIFtmaWx0ZXJdKTtcblxuICBmdW5jdGlvbiBvbkZpbHRlcklucHV0KGUpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSU5QVVRfQ0hBTkdFRCxcbiAgICAgIGZpbHRlcjogZS50YXJnZXQudmFsdWUsXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkZpbHRlclNlbGVjdChlKSB7XG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XG5cbiAgICBjb25zdCBoYW5nb3V0ID0gZmlsdGVyUmVzdWx0LmZpbmQoKHMpID0+IHMudXNlcm5hbWUgPT09IGlkKTtcblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogXCIvaGFuZ291dHNcIiB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTG9hZEhhbmdvdXQoKSB7XG4gICAgbG9hZEhhbmdvdXRzKHsgZGlzcGF0Y2gsIG5hbWU6IHVzZXJuYW1lIH0pO1xuICB9XG5cbiAgcmV0dXJuIHsgZmlsdGVyLCBmaWx0ZXJSZXN1bHQsIG9uRmlsdGVyU2VsZWN0LCBvbkZpbHRlcklucHV0LCBvbkxvYWRIYW5nb3V0IH07XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gXCIuL2FjdGlvblR5cGVzXCI7XG5pbXBvcnQge1xuICB1cGRhdGVVbnJlYWQsXG4gIHVwZGF0ZVJlY2lldmVkTWVzc2FnZSxcbiAgdXBkYXRlSGFuZ291dCxcbn0gZnJvbSBcIi4vbG9jYWwtc3RvcmFnZS9jb21tb25cIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVVucmVhZCh7IHN0YXRlLCBkaXNwYXRjaCwgb25BcHBSb3V0ZSwgdXNlcm5hbWUgfSkge1xuICBjb25zdCB7IHVucmVhZGhhbmdvdXRzIH0gPSBzdGF0ZTtcblxuICBmdW5jdGlvbiBvblVucmVhZFNlbGVjdCh7IGhhbmdvdXQgfSkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcblxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiBcIi9oYW5nb3V0c1wiIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25VbnJlYWRSZW1vdmUoKSB7fVxuXG4gIHJldHVybiB7IHVucmVhZGhhbmdvdXRzLCBvblVucmVhZFNlbGVjdCwgb25VbnJlYWRSZW1vdmUgfTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBsYXp5LCBTdXNwZW5zZSB9IGZyb20gXCJwcmVhY3QvY29tcGF0XCI7XG5pbXBvcnQgeyBGZWF0dXJlUm91dGUsIHVzZUFwcFJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5cbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSBcIi4vc3RhdGUvdXNlSGFuZ291dHNcIjtcbmltcG9ydCB1c2VTZWFyY2ggZnJvbSBcIi4vc3RhdGUvdXNlU2VhcmNoXCI7XG5pbXBvcnQgdXNlRmlsdGVyIGZyb20gXCIuL3N0YXRlL3VzZUZpbHRlclwiO1xuaW1wb3J0IHVzZVVucmVhZCBmcm9tIFwiLi9zdGF0ZS91c2VVbnJlYWRcIjtcbmNvbnN0IEJsb2NrID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL3VpLWNvbXBvbmVudHMvQmxvY2tcIikpO1xuY29uc3QgQmxvY2tlZCA9IGxhenkoKCkgPT4gaW1wb3J0KFwiLi91aS1jb21wb25lbnRzL0Jsb2NrZWRcIikpO1xuY29uc3QgQ29uZmlndXJlID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL3VpLWNvbXBvbmVudHMvQ29uZmlndXJlXCIpKTtcbmNvbnN0IEhhbmdjaGF0ID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL3VpLWNvbXBvbmVudHMvSGFuZ2NoYXRcIikpO1xuY29uc3QgSW52aXRlID0gbGF6eSgoKSA9PiBpbXBvcnQoXCIuL3VpLWNvbXBvbmVudHMvSW52aXRlXCIpKTtcbmNvbnN0IEludml0ZWUgPSBsYXp5KCgpID0+IGltcG9ydChcIi4vdWktY29tcG9uZW50cy9JbnZpdGVlXCIpKTtcbmNvbnN0IEludml0ZXIgPSBsYXp5KCgpID0+IGltcG9ydChcIi4vdWktY29tcG9uZW50cy9JbnZpdGVyXCIpKTtcbmNvbnN0IFNlYXJjaCA9IGxhenkoKCkgPT4gaW1wb3J0KFwiLi91aS1jb21wb25lbnRzL1NlYXJjaFwiKSk7XG5jb25zdCBGaWx0ZXIgPSBsYXp5KCgpID0+IGltcG9ydChcIi4vdWktY29tcG9uZW50cy9GaWx0ZXJcIikpO1xuY29uc3QgVW5yZWFkSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydChcIi4vdWktY29tcG9uZW50cy9VbnJlYWRIYW5nb3V0c1wiKSk7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0c0ZlYXR1cmVSb3V0ZXMocHJvcHMpIHtcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xuICBjb25zdCB7XG4gICAgc3RhdGUsXG4gICAgaGFuZ291dCxcbiAgICBvbkludml0ZSxcbiAgICBvbkFjY2VwdCxcbiAgICBvbkRlY2xpbmUsXG4gICAgb25CbG9jayxcbiAgICBvblVuYmxvY2ssXG4gICAgb25NZXNzYWdlLFxuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHQsXG4gICAgdXNlcm5hbWUsXG4gICAgbWVzc2FnZXMsXG4gICAgZGlzcGF0Y2gsXG4gICAgb25OYXZpZ2F0aW9uLFxuICB9ID0gdXNlSGFuZ291dHMoKTtcbiAgY29uc3Qge1xuICAgIHNlYXJjaCxcbiAgICBvblNlYXJjaElucHV0LFxuICAgIHNlYXJjaFJlc3VsdCxcbiAgICBvblNlYXJjaCxcbiAgICBvblNlYXJjaFNlbGVjdCxcbiAgfSA9IHVzZVNlYXJjaCh7IHN0YXRlLCBkaXNwYXRjaCwgb25BcHBSb3V0ZSB9KTtcbiAgY29uc3Qge1xuICAgIGZpbHRlcixcbiAgICBmaWx0ZXJSZXN1bHQsXG4gICAgb25GaWx0ZXJTZWxlY3QsXG4gICAgb25GaWx0ZXJJbnB1dCxcbiAgICBvbkxvYWRIYW5nb3V0LFxuICB9ID0gdXNlRmlsdGVyKHtcbiAgICBkaXNwYXRjaCxcbiAgICBzdGF0ZSxcbiAgICBvbkFwcFJvdXRlLFxuICAgIHVzZXJuYW1lLFxuICB9KTtcbiAgY29uc3QgeyB1bnJlYWRoYW5nb3V0cywgb25VbnJlYWRTZWxlY3QsIG9uVW5yZWFkUmVtb3ZlIH0gPSB1c2VVbnJlYWQoe1xuICAgIHN0YXRlLFxuICAgIGRpc3BhdGNoLFxuICAgIG9uQXBwUm91dGUsXG4gICAgdXNlcm5hbWUsXG4gIH0pO1xuICBjb25zdCB7IGxvYWRpbmcgfSA9IHN0YXRlO1xuICByZXR1cm4gW1xuICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9iY2t1aVwiPlxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8TG9hZGluZyAvPn0+XG4gICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSBvbkJsb2NrPXtvbkJsb2NrfSAvPlxuICAgICAgPC9TdXNwZW5zZT5cbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXG4gICAgPEZlYXR1cmVSb3V0ZSBwYXRocz17W1wiL1VOQkxPQ0tcIiwgXCIvREVDTElORURcIl19PlxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8TG9hZGluZyAvPn0+XG4gICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxuICAgICAgPC9TdXNwZW5zZT5cbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXG4gICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8TG9hZGluZyAvPn0+XG4gICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259IC8+XG4gICAgICA8L1N1c3BlbnNlPlxuICAgIDwvRmVhdHVyZVJvdXRlPixcbiAgICA8RmVhdHVyZVJvdXRlXG4gICAgICBwYXRocz17W1xuICAgICAgICBcIi9BQ0NFUFRFRFwiLFxuICAgICAgICBcIi9BQ0NFUFRFUlwiLFxuICAgICAgICBcIi9NRVNTQU5HRVJcIixcbiAgICAgICAgXCIvTUVTU0FHRURcIixcbiAgICAgICAgXCIvQkxPQ0tFUlwiLFxuICAgICAgICBcIi9CTE9DS0VEXCIsXG4gICAgICAgIFwiL1VOQkxPQ0tFRFwiLFxuICAgICAgICBcIi9VTkJMT0NLRVJcIixcbiAgICAgICAgXCIvUkVBRFwiLFxuICAgICAgXX1cbiAgICA+XG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxMb2FkaW5nIC8+fT5cbiAgICAgICAgPEhhbmdjaGF0XG4gICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgICBvbk5hdmlnYXRpb249e29uTmF2aWdhdGlvbn1cbiAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxuICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgICAgb25NZXNzYWdlPXtvbk1lc3NhZ2V9XG4gICAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxuICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XG4gICAgICAgICAgZGlzcGF0Y2g9e2Rpc3BhdGNofVxuICAgICAgICAvPlxuICAgICAgPC9TdXNwZW5zZT5cbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXG5cbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvSU5WSVRFXCI+XG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxMb2FkaW5nIC8+fT5cbiAgICAgICAgPEludml0ZVxuICAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cbiAgICAgICAgICBvbkludml0ZT17b25JbnZpdGV9XG4gICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cbiAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XG4gICAgICAgIC8+XG4gICAgICA8L1N1c3BlbnNlPlxuICAgIDwvRmVhdHVyZVJvdXRlPixcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGhzPXtbXCIvSU5WSVRFRFwiLCBcIi9ERUNMSU5FUlwiXX0+XG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxMb2FkaW5nIC8+fT5cbiAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gbG9hZGluZz17bG9hZGluZ30gLz5cbiAgICAgIDwvU3VzcGVuc2U+XG4gICAgPC9GZWF0dXJlUm91dGU+LFxuICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9JTlZJVEVSXCI+XG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxMb2FkaW5nIC8+fT5cbiAgICAgICAgPEludml0ZXJcbiAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XG4gICAgICAgICAgb25BY2NlcHQ9e29uQWNjZXB0fVxuICAgICAgICAgIG9uRGVjbGluZT17b25EZWNsaW5lfVxuICAgICAgICAvPlxuICAgICAgPC9TdXNwZW5zZT5cbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXG4gICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL3VucmVhZFwiPlxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8TG9hZGluZyAvPn0+XG4gICAgICAgIDxVbnJlYWRIYW5nb3V0c1xuICAgICAgICAgIHVucmVhZGhhbmdvdXRzPXt1bnJlYWRoYW5nb3V0c31cbiAgICAgICAgICBvblVucmVhZFNlbGVjdD17b25VbnJlYWRTZWxlY3R9XG4gICAgICAgICAgb25VbnJlYWRSZW1vdmU9e29uVW5yZWFkUmVtb3ZlfVxuICAgICAgICAvPlxuICAgICAgPC9TdXNwZW5zZT5cbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXG4gICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL3NlYXJjaFwiPlxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8TG9hZGluZyAvPn0+XG4gICAgICAgIDxTZWFyY2hcbiAgICAgICAgICBvblNlYXJjaFNlbGVjdD17b25TZWFyY2hTZWxlY3R9XG4gICAgICAgICAgc2VhcmNoUmVzdWx0PXtzZWFyY2hSZXN1bHR9XG4gICAgICAgICAgb25TZWFyY2g9e29uU2VhcmNofVxuICAgICAgICAgIG9uU2VhcmNoSW5wdXQ9e29uU2VhcmNoSW5wdXR9XG4gICAgICAgICAgc2VhcmNoPXtzZWFyY2h9XG4gICAgICAgIC8+XG4gICAgICA8L1N1c3BlbnNlPlxuICAgIDwvRmVhdHVyZVJvdXRlPixcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvZmlsdGVyXCI+XG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxMb2FkaW5nIC8+fT5cbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIG9uTG9hZEhhbmdvdXQ9e29uTG9hZEhhbmdvdXR9XG4gICAgICAgICAgb25OYXZpZ2F0aW9uPXtvbk5hdmlnYXRpb259XG4gICAgICAgICAgZmlsdGVyPXtmaWx0ZXJ9XG4gICAgICAgICAgb25GaWx0ZXJJbnB1dD17b25GaWx0ZXJJbnB1dH1cbiAgICAgICAgICBmaWx0ZXJSZXN1bHQ9e2ZpbHRlclJlc3VsdH1cbiAgICAgICAgICBvbkZpbHRlclNlbGVjdD17b25GaWx0ZXJTZWxlY3R9XG4gICAgICAgIC8+XG4gICAgICA8L1N1c3BlbnNlPlxuICAgIDwvRmVhdHVyZVJvdXRlPixcbiAgXTtcbn1cblxuZnVuY3Rpb24gTG9hZGluZygpIHtcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2FkaW5nXCI+TG9hZGluZzwvZGl2Pjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdlYXJJY29uKHByb3BzKSB7XG4gIGNvbnN0IHsgY29sb3IgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxzdmdcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHdpZHRoPVwiMWVtXCJcbiAgICAgIGhlaWdodD1cIjFlbVwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDE2IDE2XCJcbiAgICAgIGNsYXNzTmFtZT1cImJpIGJpLWdlYXJcIlxuICAgICAgZmlsbD17Y29sb3J9XG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICA+XG4gICAgICA8cGF0aFxuICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgIGZpbGwtcnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICBkPVwiTTguODM3IDEuNjI2Yy0uMjQ2LS44MzUtMS40MjgtLjgzNS0xLjY3NCAwbC0uMDk0LjMxOUExLjg3MyAxLjg3MyAwIDAgMSA0LjM3NyAzLjA2bC0uMjkyLS4xNmMtLjc2NC0uNDE1LTEuNi40Mi0xLjE4NCAxLjE4NWwuMTU5LjI5MmExLjg3MyAxLjg3MyAwIDAgMS0xLjExNSAyLjY5MmwtLjMxOS4wOTRjLS44MzUuMjQ2LS44MzUgMS40MjggMCAxLjY3NGwuMzE5LjA5NGExLjg3MyAxLjg3MyAwIDAgMSAxLjExNSAyLjY5M2wtLjE2LjI5MWMtLjQxNS43NjQuNDIgMS42IDEuMTg1IDEuMTg0bC4yOTItLjE1OWExLjg3MyAxLjg3MyAwIDAgMSAyLjY5MiAxLjExNmwuMDk0LjMxOGMuMjQ2LjgzNSAxLjQyOC44MzUgMS42NzQgMGwuMDk0LS4zMTlhMS44NzMgMS44NzMgMCAwIDEgMi42OTMtMS4xMTVsLjI5MS4xNmMuNzY0LjQxNSAxLjYtLjQyIDEuMTg0LTEuMTg1bC0uMTU5LS4yOTFhMS44NzMgMS44NzMgMCAwIDEgMS4xMTYtMi42OTNsLjMxOC0uMDk0Yy44MzUtLjI0Ni44MzUtMS40MjggMC0xLjY3NGwtLjMxOS0uMDk0YTEuODczIDEuODczIDAgMCAxLTEuMTE1LTIuNjkybC4xNi0uMjkyYy40MTUtLjc2NC0uNDItMS42LTEuMTg1LTEuMTg0bC0uMjkxLjE1OUExLjg3MyAxLjg3MyAwIDAgMSA4LjkzIDEuOTQ1bC0uMDk0LS4zMTl6bS0yLjYzMy0uMjgzYy41MjctMS43OSAzLjA2NS0xLjc5IDMuNTkyIDBsLjA5NC4zMTlhLjg3My44NzMgMCAwIDAgMS4yNTUuNTJsLjI5Mi0uMTZjMS42NC0uODkyIDMuNDM0LjkwMSAyLjU0IDIuNTQxbC0uMTU5LjI5MmEuODczLjg3MyAwIDAgMCAuNTIgMS4yNTVsLjMxOS4wOTRjMS43OS41MjcgMS43OSAzLjA2NSAwIDMuNTkybC0uMzE5LjA5NGEuODczLjg3MyAwIDAgMC0uNTIgMS4yNTVsLjE2LjI5MmMuODkzIDEuNjQtLjkwMiAzLjQzNC0yLjU0MSAyLjU0bC0uMjkyLS4xNTlhLjg3My44NzMgMCAwIDAtMS4yNTUuNTJsLS4wOTQuMzE5Yy0uNTI3IDEuNzktMy4wNjUgMS43OS0zLjU5MiAwbC0uMDk0LS4zMTlhLjg3My44NzMgMCAwIDAtMS4yNTUtLjUybC0uMjkyLjE2Yy0xLjY0Ljg5My0zLjQzMy0uOTAyLTIuNTQtMi41NDFsLjE1OS0uMjkyYS44NzMuODczIDAgMCAwLS41Mi0xLjI1NWwtLjMxOS0uMDk0Yy0xLjc5LS41MjctMS43OS0zLjA2NSAwLTMuNTkybC4zMTktLjA5NGEuODczLjg3MyAwIDAgMCAuNTItMS4yNTVsLS4xNi0uMjkyYy0uODkyLTEuNjQuOTAyLTMuNDMzIDIuNTQxLTIuNTRsLjI5Mi4xNTlhLjg3My44NzMgMCAwIDAgMS4yNTUtLjUybC4wOTQtLjMxOXpcIlxuICAgICAgLz5cbiAgICAgIDxwYXRoXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgZmlsbC1ydWxlPVwiZXZlbm9kZFwiXG4gICAgICAgIGQ9XCJNOCA1Ljc1NGEyLjI0NiAyLjI0NiAwIDEgMCAwIDQuNDkyIDIuMjQ2IDIuMjQ2IDAgMCAwIDAtNC40OTJ6TTQuNzU0IDhhMy4yNDYgMy4yNDYgMCAxIDEgNi40OTIgMCAzLjI0NiAzLjI0NiAwIDAgMS02LjQ5MiAwelwiXG4gICAgICAvPlxuICAgIDwvc3ZnPlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBlcnNvblBsdXNJY29uKHByb3BzKSB7XG4gIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPHN2Z1xuICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICB2aWV3Qm94PVwiMCAwIDE2IDE2XCJcbiAgICAgIGNsYXNzTmFtZT1cImJpIGJpLXBlcnNvbi1wbHVzXCJcbiAgICAgIGZpbGw9XCJ3aGl0ZVwiXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICA+XG4gICAgICA8cGF0aFxuICAgICAgICBmaWxsLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgZD1cIk0xMSAxNHMxIDAgMS0xLTEtNC02LTQtNiAzLTYgNCAxIDEgMSAxaDEwem0tOS45OTUtLjk0NHYtLjAwMi4wMDJ6TTEuMDIyIDEzaDkuOTU2YS4yNzQuMjc0IDAgMCAwIC4wMTQtLjAwMmwuMDA4LS4wMDJjLS4wMDEtLjI0Ni0uMTU0LS45ODYtLjgzMi0xLjY2NEM5LjUxNiAxMC42OCA4LjI4OSAxMCA2IDEwYy0yLjI5IDAtMy41MTYuNjgtNC4xNjggMS4zMzItLjY3OC42NzgtLjgzIDEuNDE4LS44MzIgMS42NjRhMS4wNSAxLjA1IDAgMCAwIC4wMjIuMDA0em05Ljk3NC4wNTZ2LS4wMDIuMDAyek02IDdhMiAyIDAgMSAwIDAtNCAyIDIgMCAwIDAgMCA0em0zLTJhMyAzIDAgMSAxLTYgMCAzIDMgMCAwIDEgNiAwem00LjUgMGEuNS41IDAgMCAxIC41LjV2MmEuNS41IDAgMCAxLS41LjVoLTJhLjUuNSAwIDAgMSAwLTFIMTNWNS41YS41LjUgMCAwIDEgLjUtLjV6XCJcbiAgICAgIC8+XG4gICAgICA8cGF0aFxuICAgICAgICBmaWxsLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgZD1cIk0xMyA3LjVhLjUuNSAwIDAgMSAuNS0uNWgyYS41LjUgMCAwIDEgMCAxSDE0djEuNWEuNS41IDAgMCAxLTEgMHYtMnpcIlxuICAgICAgLz5cbiAgICA8L3N2Zz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgTmF2YmFyLCB7XG4gIE5hdkJhck5hdixcbiAgTmF2SXRlbSxcbiAgTmF2TGluayxcbiAgTmF2QmFyQ29sbGFwc2UsXG59IGZyb20gXCJjb21wb25lbnRzL25hdi1iYXJcIjtcbmltcG9ydCBOYXYgZnJvbSBcImNvbXBvbmVudHMvbmF2XCI7XG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gXCJmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VVc2VyTmFtZVwiO1xuaW1wb3J0IHsgdXNlQXV0aCB9IGZyb20gXCJmZWF0dXJlcy9hdXRoZW50aWNhdGlvblwiO1xuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tIFwiZmVhdHVyZXMvaGFuZ291dHNcIjtcbmltcG9ydCBHZWFySWNvbiBmcm9tIFwiaWNvbnMvYm9vdHN0cmFwL0dlYXJJY29uXCI7XG5pbXBvcnQgUGVyc29uUGx1c0ljb24gZnJvbSBcImljb25zL2Jvb3RzdHJhcC9QZXJzb25QbHVzSWNvblwiO1xuaW1wb3J0IHsgRmVhdHVyZVJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5leHBvcnQgZnVuY3Rpb24gQXBwTmF2aWdhdGlvbigpIHtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcbiAgY29uc3QgeyBvblNpZ25PdXQgfSA9IHVzZUF1dGgoKTtcbiAgY29uc3QgeyBzdGF0ZSwgb25OYXZpZ2F0aW9uIH0gPSB1c2VIYW5nb3V0cygpO1xuICBjb25zdCB7IGhhbmdvdXQsIHVucmVhZGhhbmdvdXRzIH0gPSBzdGF0ZTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPE5hdmJhciBicmFuZD1cIldlYmNvbVwiIGJnPVwiZGFya1wiPlxuICAgICAgICA8TmF2QmFyQ29sbGFwc2U+XG4gICAgICAgICAgPE5hdkJhck5hdj5cbiAgICAgICAgICAgIDxOYXZJdGVtPlxuICAgICAgICAgICAgICB7dXNlcm5hbWUgJiYgKFxuICAgICAgICAgICAgICAgIDxOYXZMaW5rXG4gICAgICAgICAgICAgICAgICBpZD1cImZpbHRlclwiXG4gICAgICAgICAgICAgICAgICBhcHBSb3V0ZT1cIi9oYW5nb3V0c1wiXG4gICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImhhbmdvdXRzLWxpbmtcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIEhhbmdvdXRzXG4gICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9OYXZJdGVtPlxuICAgICAgICAgIDwvTmF2QmFyTmF2PlxuICAgICAgICAgIDxOYXYgaG9yaXpvbnRhbEFsaWdubWVudD1cImp1c3RpZnktY29udGVudC1lbmRcIj5cbiAgICAgICAgICAgIHt1c2VybmFtZSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBpZD1cInVucmVhZFwiXG4gICAgICAgICAgICAgICAgYXBwUm91dGU9XCIvdW5yZWFkXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbk5hdmlnYXRpb259XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ1bnJlYWQtbGlua1wiXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWRhcmtcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgbWVzc2FnZXN7XCIgXCJ9XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1saWdodFwiIGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPlxuICAgICAgICAgICAgICAgICAge3VucmVhZGhhbmdvdXRzID8gdW5yZWFkaGFuZ291dHMubGVuZ3RoIDogMH1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHshdXNlcm5hbWUgJiYgKFxuICAgICAgICAgICAgICA8TmF2SXRlbT5cbiAgICAgICAgICAgICAgICA8TmF2TGluayBpZD1cImxvZ2luXCIgYXBwUm91dGU9XCIvYXV0aFwiIGRhdGEtdGVzdGlkPVwibG9naW4tbGlua1wiPlxuICAgICAgICAgICAgICAgICAgU2lnbiBpblxuICAgICAgICAgICAgICAgIDwvTmF2TGluaz5cbiAgICAgICAgICAgICAgPC9OYXZJdGVtPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHshdXNlcm5hbWUgJiYgKFxuICAgICAgICAgICAgICA8TmF2SXRlbT5cbiAgICAgICAgICAgICAgICA8TmF2TGluayBpZD1cInNpZ251cFwiIGFwcFJvdXRlPVwiL2F1dGhcIiBkYXRhLXRlc3RpZD1cInNpZ251cC1saW5rXCI+XG4gICAgICAgICAgICAgICAgICBTaWduIHVwXG4gICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxuICAgICAgICAgICAgICA8L05hdkl0ZW0+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPE5hdkl0ZW0+XG4gICAgICAgICAgICAgIHt1c2VybmFtZSAmJiAoXG4gICAgICAgICAgICAgICAgPE5hdkxpbmtcbiAgICAgICAgICAgICAgICAgIGlkPVwicHJvZmlsZVwiXG4gICAgICAgICAgICAgICAgICBhcHBSb3V0ZT1cIi9hdXRoXCJcbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicHJvZmlsZS1saW5rXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBXZWxjb21lLCB7dXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgPC9OYXZMaW5rPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9OYXZJdGVtPlxuICAgICAgICAgICAgPE5hdkl0ZW0+XG4gICAgICAgICAgICAgIHt1c2VybmFtZSAmJiAoXG4gICAgICAgICAgICAgICAgPE5hdkxpbmtcbiAgICAgICAgICAgICAgICAgIGlkPVwicHJvZmlsZVwiXG4gICAgICAgICAgICAgICAgICBhcHBSb3V0ZT1cIi9hdXRoXCJcbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2lnbm91dC1saW5rXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uU2lnbk91dH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBTaWduIG91dFxuICAgICAgICAgICAgICAgIDwvTmF2TGluaz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvTmF2SXRlbT5cbiAgICAgICAgICAgIDxOYXZJdGVtPlxuICAgICAgICAgICAgICB7aGFuZ291dCAmJiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuXCJcbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibmF2LWNvbmZpZ1wiXG4gICAgICAgICAgICAgICAgICBpZD1cImNvbmZpZ3VyZVwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbk5hdmlnYXRpb259XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPEdlYXJJY29uIGNvbG9yPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9OYXZJdGVtPlxuICAgICAgICAgICAgPE5hdkl0ZW0+XG4gICAgICAgICAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9maWx0ZXJcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG5cIlxuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2gtbGlua1wiXG4gICAgICAgICAgICAgICAgICBpZD1cInNlYXJjaFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbk5hdmlnYXRpb259XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFBlcnNvblBsdXNJY29uIHdpZHRoPVwiMS41ZW1cIiBoZWlnaHQ9XCIxLjVlbVwiIC8+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvRmVhdHVyZVJvdXRlPlxuICAgICAgICAgICAgPC9OYXZJdGVtPlxuICAgICAgICAgIDwvTmF2PlxuICAgICAgICA8L05hdkJhckNvbGxhcHNlPlxuICAgICAgPC9OYXZiYXI+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gSG9tZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiaG9tZVwiIHN0eWxlPXt7IHBhZGRpbmdUb3A6IDY4IH19PlxuICAgICAgSG9tZVxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSBcInByZWFjdC9jb21wYXRcIjtcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSBcImNvbXBvbmVudHMvYXBwLXJvdXRlXCI7XG5pbXBvcnQgeyBIb21lIH0gZnJvbSBcIi4vSG9tZVwiO1xuaW1wb3J0IHsgQXV0aEZhdHVyZVJvdXRlcyB9IGZyb20gXCJmZWF0dXJlcy9hdXRoZW50aWNhdGlvblwiO1xuXG5jb25zdCBIYW5nb3V0c0ZlYXR1cmVSb3V0ZXMgPSBsYXp5KCgpID0+XG4gIGltcG9ydChcImZlYXR1cmVzL2hhbmdvdXRzL0hhbmdvdXRzRmVhdHVyZVJvdXRlc1wiKVxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlcygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogXCI4NXZoXCIgfX0+XG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9hdXRoXCI+XG4gICAgICAgIDxBdXRoRmF0dXJlUm91dGVzIC8+XG4gICAgICA8L0FwcFJvdXRlPlxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvXCI+XG4gICAgICAgIDxIb21lIC8+XG4gICAgICA8L0FwcFJvdXRlPlxuXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdvdXRzRmVhdHVyZVJvdXRlcyAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9BcHBSb3V0ZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBBcHBOYXZpZ2F0aW9uIH0gZnJvbSBcIi4vQXBwTmF2aWdhdGlvblwiO1xuaW1wb3J0IHsgQXBwUm91dGVzIH0gZnJvbSBcIi4vQXBwUm91dGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcHAoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxBcHBOYXZpZ2F0aW9uIC8+XG4gICAgICA8QXBwUm91dGVzIC8+XG4gICAgICB7XCJcIn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCBcIndoYXR3Zy1mZXRjaFwiO1xuaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgQXBwUHJvdmlkZXJzIH0gZnJvbSBcIi4vQXBwUHJvdmlkZXJzXCI7XG5pbXBvcnQgeyBBcHAgfSBmcm9tIFwiLi9BcHBcIjtcblBhcnNlLmluaXRpYWxpemUoXG4gIFwienR0cG5xVHI4cmVma3RCV05la1poWnhTeHdQYUFBbkVsUTlrN0N1QVwiLFxuICBcIlE3U0hTRkxHNjE4aXpieVNNcEFzRkFxZ25PTGFZZ3hObHdmRmhPQXJcIlxuKTsgLy9QQVNURSBIRVJFIFlPVVIgQmFjazRBcHAgQVBQTElDQVRJT04gSUQgQU5EIFlPVVIgSmF2YVNjcmlwdCBLRVlcblBhcnNlLnNlcnZlclVSTCA9IGBodHRwczovLyR7aXB9OjEzMzcvcGFyc2VgO1xuLy9QYXJzZS5saXZlUXVlcnlTZXJ2ZXJVUkwgPSBgaHR0cHM6Ly8ke2lwfToxMzM3L3BhcnNlYFxuLy9QYXJzZS5zZXJ2ZXJVUkwgPSAnaHR0cHM6Ly9wYXJzZWFwaS5iYWNrNGFwcC5jb20vJ1xuLy9QYXJzZS5saXZlUXVlcnlTZXJ2ZXJVUkwgPSBgd3NzOi8vd2ViYXBpcy5iYWNrNGFwcC5pb2BcbnJlbmRlcihcbiAgPEFwcFByb3ZpZGVycz5cbiAgICA8QXBwIC8+XG4gIDwvQXBwUHJvdmlkZXJzPixcblxuICBkb2N1bWVudC5ib2R5XG4pO1xuIl0sIm5hbWVzIjpbImZldGNoIiwidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJGZWF0dXJlUm91dGUiLCJwcm9wcyIsImNoaWxkcmVuIiwicGF0aCIsInBhdGhzIiwiZGlzcGF0Y2giLCJmaW5kIiwidXNlQXBwUm91dGUiLCJuYW1lIiwib25BcHBSb3V0ZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiQXBwUm91dGUiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInVzZUVmZmVjdCIsImdldEl0ZW0iLCJwYXJzZSIsInZhbHVlIiwidXNlTWVtbyIsIkZFVENIX0hBTkdPVVRTX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUU19TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVFNfRkFJTEVEIiwiU0VBUkNIX0lOUFVUX0NIQU5HRSIsIlNFQVJDSF9IQU5HT1VUX1NUQVJURUQiLCJTRUFSQ0hfSEFOR09VVF9TVUNDRVNTIiwiU0VBUkNIX0hBTkdPVVRfRkFJTEVEIiwiRklMVEVSX0lOUFVUX0NIQU5HRUQiLCJTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRCIsIlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FERURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiQ0xFQVJFRF9IQU5HT1VUIiwiRVJST1JfUkVDSUVWRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEIiwiTUVTU0FHRVNfVVBEQVRFRCIsIkhBTkdPVVRTX1VQREFURUQiLCJIQU5HT1VUX1VQREFURUQiLCJVTlJFQURfSEFOR09VVFNfVVBEQVRFRCIsIkNPTk5FQ1RJTkciLCJPUEVOIiwiQ0xPU0lORyIsIkNMT1NFRCIsIlNPQ0tFVF9SRUFEWSIsIlNPQ0tFVF9FUlJPUiIsIlNFVF9IQU5HT1VUX1RPX0lOSVRfU1RBVEUiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJ1bnJlYWRoYW5nb3V0cyIsIm1lc3NhZ2VzIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJzb2NrZXQiLCJyZWFkeVN0YXRlIiwic29ja2V0TWVzc2FnZSIsInNlYXJjaCIsInNlYXJjaFJlc3VsdCIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVyIiwiZmlsdGVyUmVzdWx0IiwiZmV0Y2hIYW5nb3V0cyIsInBlbmRpbmdIYW5nb3V0IiwibWVzc2FnZSIsInRleHQiLCJoYW5nb3V0U3RhdGVzIiwiSU5WSVRFUiIsIkFDQ0VQVEVSIiwiREVDTElORVIiLCJCTE9DS0VSIiwiVU5CTE9DS0VSIiwiTUVTU0FOR0VSIiwiUkVBREVSIiwiSU5WSVRFRCIsIkFDQ0VQVEVEIiwiREVDTElORUQiLCJCTE9DS0VEIiwiVU5CTE9DS0VEIiwiTUVTU0FHRUQiLCJSRUFEIiwidXBkYXRlVW5yZWFkIiwiZFN0YXRlIiwidXNlcm5hbWUiLCJ0aW1lc3RhbXAiLCJoYW5nb3V0S2V5IiwicmVhZEhhbmdvdXQiLCJsb2NhbEhhbmdvdXRzIiwiaGFuZ291dEluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwic2F2ZVNlbnRNZXNzYWdlIiwibWVzc2FnZUtleSIsImxvY2FsTWVzc2FnZXMiLCJwZW5kaW5nTWVzc2FnZSIsImxlbmd0aCIsInNhdmVSZWNpZXZlZE1lc3NhZ2UiLCJzYXZlVW5yZWFkIiwidW5yZWFkSGFuZ291dCIsInVwZGF0ZVNlbnRNZXNzYWdlIiwidXBkYXRlZE1lc3NhZ2UiLCJtZXNzYWdlSW5kZXgiLCJ1cGRhdGVIYW5nb3V0IiwibCIsInNhdmVIYW5nb3V0IiwicmVtb3ZlVW5yZWFkIiwicmVtb3ZlVW5yZWFkcyIsInJlbW92ZUl0ZW0iLCJ1c2VNZXNzYWdlIiwiZm9jdXNlZEhhbmdvdXQiLCJoYW5kbGVBY2tub3dsZWRnZW1lbnQiLCJvZmZsaW5lIiwic2F2ZVVuYmxvdmtlZCIsIm9uSGFuZ291dCIsImhhbmRsZUhhbmdvdXRzIiwiZm9yRWFjaCIsInVucmVhZCIsIlZBTFVFX0NIQU5HRUQiLCJMT0dJTl9TVEFSVEVEIiwiTE9HSU5fU1VDQ0VTUyIsIkxPR0lOX0ZBSUxFRCIsIkxPR09VVCIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSIsIlNFUlZFUl9FUlJPUl9SRUNJRVZFRCIsIkNPTlNUUkFJTlRfVkFMSURBVElPTiIsIlNFVF9FUlJPUl9UT19OVUxMIiwibG9naW4iLCJzaWdudXAiLCJjaGFuZ2VQYXNzd29yZCIsInJlcXVlc3RQYXNzQ2hhbmdlIiwidmFsaWRhdGlvbiIsImlzVmFsaWQiLCJ1bmRlZmluZWQiLCJlbWFpbCIsInBhc3N3b3JkIiwiY29uZmlybSIsImVtYWlsb3J1c2VybmFtZSIsInN1Y2Nlc3MiLCJjdXJyZW50IiwidG9rZW4iLCJhdXRoRmVlZGJhY2siLCJ1c2VyIiwic2lnbm91dCIsImF1dGhSZWR1Y2VyIiwibmV4dFN0YXRlIiwiYWNjb3VudEFscmVhZHlFeGl0cyIsImNyZWRlbnRpYWxJbnZhbGlkIiwidXNlcm5hbWVJc1Rha2VuIiwiZW1haWxJc1JlZ2lzdGVyZWQiLCJ1c2VybmFtZUludmFsaWQiLCJwYXNzd29yZEludmFsaWQiLCJlbWFpbEludmFsaWQiLCJlbWFpbElzTm90UmVnaXN0ZXJlZCIsImVtcHR5UGFzc3dvcmROb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJJTlZBTElEX1BBU1NXT1JEIiwiSU5WQUxJRF9FTUFJTCIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJJTlZBTElEX1VTRVJOQU1FIiwiSU5WQUxJRF9FTVBUWV9TVFJJTkciLCJJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIlVTRVJOQU1FX1RBS0VOIiwiUkVHSVNURVJFRF9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJBQ0NPVU5UX0FMUkVBRFlfRVhJU1RTIiwiUkVRVUlSRURfRklFTEQiLCJzZXJ2ZXJWYWxpZGF0aW9uIiwiaHR0cFN0YXR1cyIsInZhbGlkYXRpb25NZXNzYWdlcyIsInBhc3N3b3JkUmVnZXgiLCJlbWFpbFJlZ2V4IiwidXNlcm5hbWVSZWdleCIsInZhbGlkYXRlRW1haWxDb25zdHJhaW50IiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSIsInJlc3BvbnNlIiwiYm9keSIsImhlYWRlcnMiLCJDb250ZW50VHlwZSIsIkFjY2VwdCIsIm1ldGhvZCIsInJlc3VsdCIsImpzb24iLCJ3aW5kb3ciLCJlcnJvcnMiLCJmb3JtRGlzcGF0Y2giLCJBdXRob3JpemF0aW9uIiwiYnRvYSIsImZvcmdvdFBhc3N3b3JkIiwiTm9kZUF1dGhTZXJ2aWNlIiwiYWN0aW9ucyIsIkF1dGhBZGFwdGVyIiwiTm9kZUF1dGhTZXJpY2UiLCJBdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwidXNlVXNlck5hbWUiLCJ1c2VyTmFtZSIsInNldFVzZXJuYW1lIiwidXNlU3RhdGUiLCJzZXRUb2tlbiIsInNldEVtYWlsIiwib2JqZWN0SWQiLCJzZXRPYmplY3RJZCIsImNsaWVudENvbW1hbmRzIiwiSU5WSVRFIiwiQUNDRVBUIiwiREVDTElORSIsIkJMT0NLIiwiVU5CTE9DSyIsIk1FU1NBR0UiLCJPTkxJTkUiLCJIYW5nb3V0Q29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiSGFuZ291dHNQcm92aWRlciIsImhhbmRsZU1lc3NhZ2UiLCJjb21tYW5kIiwidW5yZWFkaGFuZ291dEtleSIsInVzZUF1dGgiLCJvbkNoYW5nZSIsInRhcmdldCIsIm9uTG9naW4iLCJjdiIsIm9uU2lnbnVwIiwib25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UiLCJvblBhc3N3b3JkQ2hhbmdlIiwib25TaWduT3V0Iiwib25Mb2dpbkJsdXIiLCJvblNpZ251cEJsdXIiLCJvbkNoYW5nZVBhc3NCbHVyIiwib25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIiLCJvbkZvY3VzIiwiRSIsInciLCJDIiwiQSIsIkYiLCJOIiwiTSIsIlAiLCJoIiwiRCIsIkgiLCIkIiwicSIsIkxvZ2luIiwibGF6eSIsIkNoYW5nZVBhc3N3b3JkIiwiRm9yZ290UGFzc3dvcmQiLCJTaWdudXAiLCJQcm9maWxlIiwiQXV0aEZlYXR1cmVSb3V0ZXMiLCJTdXNwZW5zZSIsImNoYW5nZU1lc3NhZ2VUZXh0IiwidXNlSGFuZ291dHMiLCJhdXRoQ29udGV4dCIsIm9uTmF2aWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsImlkIiwiY3VycmVudFRhcmdldCIsIm9uTWVzc2FnZVRleHQiLCJvbkludml0ZSIsIkRhdGUiLCJub3ciLCJpbnZpdGF0aW9uIiwib25BY2NlcHQiLCJhY2NlcHQiLCJjb25zb2xlIiwib25EZWNsaW5lIiwiZGVjbGluZSIsIm9uTWVzc2FnZSIsIm1lc3NhZ2luZyIsIm9uQmxvY2siLCJibG9jayIsIm9uVW5ibG9jayIsIm9rIiwiZmluZEhhbmdvdXRzIiwiV2ViU29ja2V0Q29udGFpbmVyIiwiYXV0aFN0YXRlIiwic2V0U29ja2V0Iiwic29ja2V0VXJsIiwiV2ViU29ja2V0IiwiY2xvc2UiLCJvbm1lc3NhZ2UiLCJzZXJ2ZXJNZXNzYWdlIiwibXNnIiwiZGF0YSIsIm9ub3BlbiIsIm9uY2xvc2UiLCJvbmVycm9yIiwic2VuZFBlbmRpbmdIYW5nb3V0Iiwic2VuZCIsIkhhbmdvdXRBZGFwdGVyIiwiQXBwUHJvdmlkZXJzIiwiaXAiLCJOYXZiYXIiLCJiZyIsImJyYW5kIiwiTmF2QmFyQ29sbGFwc2UiLCJOYXZCYXJOYXYiLCJOYXZJdGVtIiwiTmF2TGluayIsImFwcFJvdXRlIiwiaGFuZGxlUm91dGUiLCJwcmV2ZW50RGVmYXVsdCIsIk5hdiIsImhvcml6b250YWxBbGlnbm1lbnQiLCJ1c2VTZWFyY2giLCJvblNlYXJjaFNlbGVjdCIsIm9uU2VhcmNoSW5wdXQiLCJvblNlYXJjaCIsImZpbHRlckhhbmdvdXRzIiwiZmlsdGVyZWRIYW5nb3V0cyIsImluY2x1ZGVzIiwibG9hZEhhbmdvdXRzIiwidXNlRmlsdGVyIiwib25GaWx0ZXJJbnB1dCIsIm9uRmlsdGVyU2VsZWN0Iiwib25Mb2FkSGFuZ291dCIsInVzZVVucmVhZCIsIm9uVW5yZWFkU2VsZWN0Iiwib25VbnJlYWRSZW1vdmUiLCJCbG9jayIsIkJsb2NrZWQiLCJDb25maWd1cmUiLCJIYW5nY2hhdCIsIkludml0ZSIsIkludml0ZWUiLCJJbnZpdGVyIiwiU2VhcmNoIiwiRmlsdGVyIiwiVW5yZWFkSGFuZ291dHMiLCJIYW5nb3V0c0ZlYXR1cmVSb3V0ZXMiLCJMb2FkaW5nIiwiR2Vhckljb24iLCJjb2xvciIsIlBlcnNvblBsdXNJY29uIiwid2lkdGgiLCJoZWlnaHQiLCJBcHBOYXZpZ2F0aW9uIiwiSG9tZSIsInBhZGRpbmdUb3AiLCJBcHBSb3V0ZXMiLCJBdXRoRmF0dXJlUm91dGVzIiwiQXBwIiwiUGFyc2UiLCJpbml0aWFsaXplIiwic2VydmVyVVJMIiwicmVuZGVyIiwiZG9jdW1lbnQiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLElBQUksSUFBSTtBQUN6QyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQ3BELEVBQUUsSUFBSTtBQUNOLElBQUksWUFBWSxJQUFJLElBQUk7QUFDeEIsSUFBSSxNQUFNLElBQUksSUFBSTtBQUNsQixJQUFJLENBQUMsV0FBVztBQUNoQixNQUFNLElBQUk7QUFDVixRQUFRLElBQUksSUFBSSxHQUFFO0FBQ2xCLFFBQVEsT0FBTyxJQUFJO0FBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNsQixRQUFRLE9BQU8sS0FBSztBQUNwQixPQUFPO0FBQ1AsS0FBSyxHQUFHO0FBQ1IsRUFBRSxRQUFRLEVBQUUsVUFBVSxJQUFJLElBQUk7QUFDOUIsRUFBRSxXQUFXLEVBQUUsYUFBYSxJQUFJLElBQUk7QUFDcEMsRUFBQztBQUNEO0FBQ0EsU0FBUyxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQ3pCLEVBQUUsT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO0FBQ3JELENBQUM7QUFDRDtBQUNBLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtBQUN6QixFQUFFLElBQUksV0FBVyxHQUFHO0FBQ3BCLElBQUksb0JBQW9CO0FBQ3hCLElBQUkscUJBQXFCO0FBQ3pCLElBQUksNEJBQTRCO0FBQ2hDLElBQUkscUJBQXFCO0FBQ3pCLElBQUksc0JBQXNCO0FBQzFCLElBQUkscUJBQXFCO0FBQ3pCLElBQUksc0JBQXNCO0FBQzFCLElBQUksdUJBQXVCO0FBQzNCLElBQUksdUJBQXVCO0FBQzNCLElBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxpQkFBaUI7QUFDdkIsSUFBSSxXQUFXLENBQUMsTUFBTTtBQUN0QixJQUFJLFNBQVMsR0FBRyxFQUFFO0FBQ2xCLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakYsTUFBSztBQUNMLENBQUM7QUFDRDtBQUNBLFNBQVMsYUFBYSxDQUFDLElBQUksRUFBRTtBQUM3QixFQUFFLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ2hDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUM7QUFDdkIsR0FBRztBQUNILEVBQUUsSUFBSSwyQkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDOUMsSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLHdDQUF3QyxDQUFDO0FBQ2pFLEdBQUc7QUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUMzQixDQUFDO0FBQ0Q7QUFDQSxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUU7QUFDL0IsRUFBRSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUNqQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFDO0FBQ3pCLEdBQUc7QUFDSCxFQUFFLE9BQU8sS0FBSztBQUNkLENBQUM7QUFDRDtBQUNBO0FBQ0EsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQzVCLEVBQUUsSUFBSSxRQUFRLEdBQUc7QUFDakIsSUFBSSxJQUFJLEVBQUUsV0FBVztBQUNyQixNQUFNLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUU7QUFDL0IsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssS0FBSyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztBQUN0RCxLQUFLO0FBQ0wsSUFBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDeEIsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVc7QUFDM0MsTUFBTSxPQUFPLFFBQVE7QUFDckIsTUFBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxRQUFRO0FBQ2pCLENBQUM7QUFDRDtBQUNPLFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUNqQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRTtBQUNmO0FBQ0EsRUFBRSxJQUFJLE9BQU8sWUFBWSxPQUFPLEVBQUU7QUFDbEMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUMxQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBQztBQUM5QixLQUFLLEVBQUUsSUFBSSxFQUFDO0FBQ1osR0FBRyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNyQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxNQUFNLEVBQUU7QUFDckMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDdkMsS0FBSyxFQUFFLElBQUksRUFBQztBQUNaLEdBQUcsTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUN0QixJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLEVBQUU7QUFDL0QsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUM7QUFDdEMsS0FBSyxFQUFFLElBQUksRUFBQztBQUNaLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDakQsRUFBRSxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBQztBQUM1QixFQUFFLEtBQUssR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFDO0FBQy9CLEVBQUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUM7QUFDL0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxNQUFLO0FBQzdELEVBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxJQUFJLEVBQUU7QUFDN0MsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDO0FBQ3RDLEVBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQ3ZDLEVBQUUsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUM7QUFDNUIsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO0FBQy9DLEVBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQ3ZDLEVBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzlDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFDO0FBQ3ZELEVBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUN4RCxFQUFFLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUM3QixJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkMsTUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDeEQsS0FBSztBQUNMLEdBQUc7QUFDSCxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxXQUFXO0FBQ3BDLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRTtBQUNoQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDcEIsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsV0FBVztBQUN0QyxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDaEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQy9CLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDckIsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUN2QyxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDaEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNyQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUM7QUFDN0IsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ3RCLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFPO0FBQ2hFLENBQUM7QUFDRDtBQUNBLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUN4QixFQUFFLElB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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1L1IsSUFBSUMsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXlFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUF1RyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQzs7QUNBdHRFLE1BQU1VLFdBQVcsR0FBRztBQUN6QkMsRUFBQUEsaUJBQWlCLEVBQUUsbUJBRE07O0FBQUEsQ0FBcEI7O0FDRUEsU0FBU0MsT0FBVCxDQUFpQkMsS0FBakIsRUFBd0JDLE1BQXhCLEVBQWdDO0FBQ3JDLFVBQVFBLE1BQU0sQ0FBQ0MsSUFBZjtBQUNFLFNBQUtMLFdBQVcsQ0FBQ0MsaUJBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUdFLEtBREU7QUFFTEcsUUFBQUEsS0FBSyxFQUFFRixNQUFNLENBQUNFLEtBRlQ7QUFHTEMsUUFBQUEsWUFBWSxFQUFFSCxNQUFNLENBQUNHO0FBSGhCLE9BQVA7O0FBS0Y7QUFDRSxhQUFPSixLQUFQO0FBUko7QUFVRDs7QUNURCxNQUFNSyxlQUFlLEdBQUdDLENBQWEsRUFBckM7O0FBRUEsU0FBU0Msa0JBQVQsR0FBOEI7QUFDNUIsUUFBTUMsT0FBTyxHQUFHQyxHQUFVLENBQUNKLGVBQUQsQ0FBMUI7O0FBRUEsTUFBSSxDQUFDRyxPQUFMLEVBQWM7QUFDWixVQUFNLElBQUlFLEtBQUosQ0FBVSx1REFBVixDQUFOO0FBQ0Q7O0FBQ0QsU0FBT0YsT0FBUDtBQUNEOztBQUNNLFNBQVNHLFlBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCO0FBQ2xDLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQSxJQUFaO0FBQWtCQyxJQUFBQTtBQUFsQixNQUE0QkgsS0FBbEM7QUFFQSxRQUFNLENBQUNaLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JULGtCQUFrQixFQUE1QztBQUNBLFFBQU07QUFBRUgsSUFBQUE7QUFBRixNQUFtQkosS0FBekI7O0FBRUEsTUFBSWMsSUFBSSxJQUFJVixZQUFZLEtBQUtVLElBQTdCLEVBQW1DO0FBQ2pDLFdBQU9ELFFBQVA7QUFDRCxHQUZELE1BRU8sSUFBSUUsS0FBSyxJQUFJWCxZQUFZLEtBQUtXLEtBQUssQ0FBQ0UsSUFBTixDQUFZekIsQ0FBRCxJQUFPQSxDQUFDLEtBQUtZLFlBQXhCLENBQTlCLEVBQXFFO0FBQzFFLFdBQU9TLFFBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRDtBQUNNLFNBQVNLLFdBQVQsR0FBdUI7QUFDNUIsUUFBTSxDQUFDbEIsS0FBRCxFQUFRZ0IsUUFBUixJQUFvQlQsa0JBQWtCLEVBQTVDO0FBQ0EsUUFBTTtBQUFFWSxJQUFBQTtBQUFGLE1BQVduQixLQUFqQjs7QUFDQSxXQUFTb0IsVUFBVCxDQUFvQjtBQUFFakIsSUFBQUEsS0FBRjtBQUFTQyxJQUFBQTtBQUFULEdBQXBCLEVBQTZDO0FBQzNDLFFBQUllLElBQUosRUFBVTtBQUNSRSxNQUFBQSxZQUFZLENBQUNDLE9BQWIsQ0FBcUJILElBQXJCLEVBQTJCSSxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUFFckIsUUFBQUEsS0FBRjtBQUFTQyxRQUFBQTtBQUFULE9BQWYsQ0FBM0I7QUFDRDs7QUFFRFksSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsV0FBVyxDQUFDQyxpQkFBcEI7QUFBdUNNLE1BQUFBLFlBQXZDO0FBQXFERCxNQUFBQTtBQUFyRCxLQUFELENBQVI7QUFDRDs7QUFFRCxTQUFPO0FBQUVpQixJQUFBQTtBQUFGLEdBQVA7QUFDRDtBQUVNLFNBQVNLLFFBQVQsQ0FBa0JiLEtBQWxCLEVBQXlCO0FBQzlCLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQSxJQUFaO0FBQWtCQyxJQUFBQTtBQUFsQixNQUE0QkgsS0FBbEM7QUFFQSxRQUFNLENBQUNaLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JULGtCQUFrQixFQUE1QztBQUNBLFFBQU07QUFBRUosSUFBQUE7QUFBRixNQUFZSCxLQUFsQjs7QUFDQSxNQUFJYyxJQUFJLElBQUlYLEtBQUssS0FBS1csSUFBdEIsRUFBNEI7QUFDMUIsV0FBT0QsUUFBUDtBQUNELEdBRkQsTUFFTyxJQUFJRSxLQUFLLElBQUlaLEtBQUssS0FBS1ksS0FBSyxDQUFDRSxJQUFOLENBQVl6QixDQUFELElBQU9BLENBQUMsS0FBS1csS0FBeEIsQ0FBdkIsRUFBdUQ7QUFDNUQsV0FBT1UsUUFBUDtBQUNEOztBQUNELFNBQU8sSUFBUDtBQUNEO0FBQ2MsU0FBU2EsZ0JBQVQsQ0FBMEJkLEtBQTFCLEVBQWlDO0FBQzlDLFFBQU07QUFBRWUsSUFBQUE7QUFBRixNQUFnQmYsS0FBdEI7QUFDQSxRQUFNLENBQUNaLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JZLEdBQVUsQ0FBQzdCLE9BQUQsRUFBVTRCLFNBQVYsQ0FBcEM7QUFFQUUsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJN0IsS0FBSyxJQUFJQSxLQUFLLENBQUNtQixJQUFmLElBQXVCRSxZQUFZLENBQUNTLE9BQWIsQ0FBcUI5QixLQUFLLENBQUNtQixJQUEzQixDQUEzQixFQUE2RDtBQUMzRCxZQUFNO0FBQUVmLFFBQUFBLFlBQUY7QUFBZ0JELFFBQUFBO0FBQWhCLFVBQTBCb0IsSUFBSSxDQUFDUSxLQUFMLENBQzlCVixZQUFZLENBQUNTLE9BQWIsQ0FBcUI5QixLQUFLLENBQUNtQixJQUEzQixDQUQ4QixDQUFoQztBQUdBSCxNQUFBQSxRQUFRLENBQUM7QUFBRWQsUUFBQUEsSUFBSSxFQUFFTCxXQUFXLENBQUNDLGlCQUFwQjtBQUF1Q00sUUFBQUEsWUFBdkM7QUFBcURELFFBQUFBO0FBQXJELE9BQUQsQ0FBUjtBQUNEO0FBQ0YsR0FQUSxFQU9OLEVBUE0sQ0FBVDtBQVNBLFFBQU02QixLQUFLLEdBQUdDLEdBQU8sQ0FBQyxNQUFNLENBQUNqQyxLQUFELEVBQVFnQixRQUFSLENBQVAsRUFBMEIsQ0FBQ2hCLEtBQUQsQ0FBMUIsQ0FBckI7QUFDQSxTQUFPLEVBQUMsZUFBRCxDQUFpQixRQUFqQjtBQUEwQixJQUFBLEtBQUssRUFBRWdDO0FBQWpDLEtBQTRDcEIsS0FBNUMsRUFBUDtBQUNEOztBQ3BFTSxNQUFNZixhQUFXLEdBQUc7QUFDekI7QUFDQXFDLEVBQUFBLHNCQUFzQixFQUFFLHdCQUZDO0FBR3pCQyxFQUFBQSxzQkFBc0IsRUFBRSx3QkFIQztBQUl6QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBSkU7QUFNekI7QUFDQUMsRUFBQUEsbUJBQW1CLEVBQUUscUJBUEk7QUFRekJDLEVBQUFBLHNCQUFzQixFQUFFLHdCQVJDO0FBU3pCQyxFQUFBQSxzQkFBc0IsRUFBRSx3QkFUQztBQVV6QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBVkU7QUFXekI7QUFDQUMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBWkc7QUFjekJDLEVBQUFBLHVCQUF1QixFQUFFLHlCQWRBO0FBZXpCQyxFQUFBQSwwQkFBMEIsRUFBRSw0QkFmSDtBQWlCekJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQWpCRztBQW1CekJDLEVBQUFBLGVBQWUsRUFBRSxpQkFuQlE7QUFvQnpCQyxFQUFBQSxlQUFlLEVBQUUsaUJBcEJRO0FBc0J6QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBdEJPO0FBdUJ6QkMsRUFBQUEsZUFBZSxFQUFFLGlCQXZCUTtBQXlCekJDLEVBQUFBLGNBQWMsRUFBRSxnQkF6QlM7QUEwQnpCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkExQkc7QUE0QnpCQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkE1QkE7QUE4QnpCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkE5Qk87QUErQnpCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkEvQk87QUFnQ3pCQyxFQUFBQSxlQUFlLEVBQUUsaUJBaENRO0FBaUN6QkMsRUFBQUEsdUJBQXVCLEVBQUUseUJBakNBO0FBa0N6QjtBQUVBQyxFQUFBQSxVQUFVLEVBQUUsWUFwQ2E7QUFxQ3pCQyxFQUFBQSxJQUFJLEVBQUUsTUFyQ21CO0FBc0N6QkMsRUFBQUEsT0FBTyxFQUFFLFNBdENnQjtBQXVDekJDLEVBQUFBLE1BQU0sRUFBRSxRQXZDaUI7QUF3Q3pCQyxFQUFBQSxZQUFZLEVBQUUsY0F4Q1c7QUF5Q3pCQyxFQUFBQSxZQUFZLEVBQUUsY0F6Q1c7QUEyQ3pCO0FBQ0FDLEVBQUFBLHlCQUF5QixFQUFFO0FBNUNGLENBQXBCOztBQ0NBLE1BQU1uQyxTQUFTLEdBQUc7QUFDdkJvQyxFQUFBQSxRQUFRLEVBQUUsSUFEYTtBQUV2QkMsRUFBQUEsT0FBTyxFQUFFLElBRmM7QUFHdkJDLEVBQUFBLGNBQWMsRUFBRSxFQUhPO0FBSXZCQyxFQUFBQSxRQUFRLEVBQUUsSUFKYTtBQU12QkMsRUFBQUEsT0FBTyxFQUFFLEtBTmM7QUFPdkJDLEVBQUFBLEtBQUssRUFBRSxJQVBnQjtBQVF2QkMsRUFBQUEsV0FBVyxFQUFFLEVBUlU7QUFTdkJDLEVBQUFBLE1BQU0sRUFBRSxLQVRlO0FBVXZCQyxFQUFBQSxNQUFNLEVBQUUsSUFWZTtBQVd2QkMsRUFBQUEsVUFBVSxFQUFFLENBWFc7QUFZdkJDLEVBQUFBLGFBQWEsRUFBRSxJQVpRO0FBYXZCO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxFQWRlO0FBZXZCQyxFQUFBQSxZQUFZLEVBQUUsRUFmUztBQWdCdkJDLEVBQUFBLGNBQWMsRUFBRSxLQWhCTztBQWtCdkI7QUFDQUMsRUFBQUEsTUFBTSxFQUFFLEVBbkJlO0FBb0J2QkMsRUFBQUEsWUFBWSxFQUFFLEVBcEJTO0FBc0J2QjtBQUNBQyxFQUFBQSxhQUFhLEVBQUUsS0F2QlE7QUF5QnZCQyxFQUFBQSxjQUFjLEVBQUUsSUF6Qk87QUEwQnZCQyxFQUFBQSxPQUFPLEVBQUU7QUExQmMsQ0FBbEI7QUE0QkEsU0FBU2xGLFNBQVQsQ0FBaUJDLEtBQWpCLEVBQXdCQyxNQUF4QixFQUFnQztBQUNyQyxVQUFRQSxNQUFNLENBQUNDLElBQWY7QUFDRSxTQUFLTCxhQUFXLENBQUNpRSx5QkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR25DO0FBQUwsT0FBUDs7QUFDRixTQUFLOUIsYUFBVyxDQUFDcUMsc0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdsQyxLQUFMO0FBQVkrRSxRQUFBQSxhQUFhLEVBQUU7QUFBM0IsT0FBUDs7QUFDRixTQUFLbEYsYUFBVyxDQUFDc0Msc0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUduQyxLQUFMO0FBQVkrRSxRQUFBQSxhQUFhLEVBQUU7QUFBM0IsT0FBUDs7QUFDRixTQUFLbEYsYUFBVyxDQUFDdUMscUJBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdwQyxLQUFMO0FBQVkrRSxRQUFBQSxhQUFhLEVBQUUsS0FBM0I7QUFBa0NYLFFBQUFBLEtBQUssRUFBRW5FLE1BQU0sQ0FBQ21FO0FBQWhELE9BQVA7O0FBQ0YsU0FBS3ZFLGFBQVcsQ0FBQ29ELGNBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdqRCxLQUFMO0FBQVlvRSxRQUFBQSxLQUFLLEVBQUVuRSxNQUFNLENBQUNtRTtBQUExQixPQUFQO0FBQ0Y7O0FBQ0EsU0FBS3ZFLGFBQVcsQ0FBQzhDLDBCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHM0MsS0FBTDtBQUFZZ0YsUUFBQUEsY0FBYyxFQUFFO0FBQTVCLE9BQVA7O0FBQ0YsU0FBS25GLGFBQVcsQ0FBQzZDLHVCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHMUMsS0FBTDtBQUFZZ0YsUUFBQUEsY0FBYyxFQUFFL0UsTUFBTSxDQUFDK0U7QUFBbkMsT0FBUDtBQUNGOztBQUNBLFNBQUtuRixhQUFXLENBQUNtRCxlQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHaEQsS0FBTDtBQUFZZ0UsUUFBQUEsT0FBTyxFQUFFO0FBQXJCLE9BQVA7O0FBQ0YsU0FBS25FLGFBQVcsQ0FBQzBELHVCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHdkQsS0FBTDtBQUFZaUUsUUFBQUEsY0FBYyxFQUFFaEUsTUFBTSxDQUFDZ0U7QUFBbkMsT0FBUDs7QUFDRixTQUFLcEUsYUFBVyxDQUFDeUQsZUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3RELEtBQUw7QUFBWWdFLFFBQUFBLE9BQU8sRUFBRS9ELE1BQU0sQ0FBQytEO0FBQTVCLE9BQVA7O0FBQ0YsU0FBS25FLGFBQVcsQ0FBQ3dELGdCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHckQsS0FBTDtBQUFZK0QsUUFBQUEsUUFBUSxFQUFFOUQsTUFBTSxDQUFDOEQ7QUFBN0IsT0FBUDs7QUFDRixTQUFLbEUsYUFBVyxDQUFDdUQsZ0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdwRCxLQUFMO0FBQVlrRSxRQUFBQSxRQUFRLEVBQUVqRSxNQUFNLENBQUNpRTtBQUE3QixPQUFQOztBQUNGLFNBQUtyRSxhQUFXLENBQUNzRCx1QkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR25ELEtBQUw7QUFBWWlGLFFBQUFBLE9BQU8sRUFBRWhGLE1BQU0sQ0FBQ2dGO0FBQTVCLE9BQVA7O0FBQ0YsU0FBS3BGLGFBQVcsQ0FBQ2lELGVBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUc5QyxLQUFMO0FBQVlrRSxRQUFBQSxRQUFRLEVBQUVqRSxNQUFNLENBQUNpRTtBQUE3QixPQUFQOztBQUNGLFNBQUtyRSxhQUFXLENBQUMrQyxvQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRzVDLEtBQUw7QUFBWXFFLFFBQUFBLFdBQVcsRUFBRXBFLE1BQU0sQ0FBQ2lGO0FBQWhDLE9BQVA7QUFDRjs7QUFDQSxTQUFLckYsYUFBVyxDQUFDeUMsc0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUd0QyxLQUFMO0FBQVltRSxRQUFBQSxPQUFPLEVBQUUsSUFBckI7QUFBMkJTLFFBQUFBLGNBQWMsRUFBRTtBQUEzQyxPQUFQOztBQUNGLFNBQUsvRSxhQUFXLENBQUMwQyxzQkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR3ZDLEtBREU7QUFFTG1FLFFBQUFBLE9BQU8sRUFBRSxLQUZKO0FBR0xRLFFBQUFBLFlBQVksRUFBRTFFLE1BQU0sQ0FBQzhELFFBSGhCO0FBSUxhLFFBQUFBLGNBQWMsRUFBRTtBQUpYLE9BQVA7O0FBTUYsU0FBSy9FLGFBQVcsQ0FBQzJDLHFCQUFqQjtBQUNFLGFBQU8sRUFDTCxHQUFHeEMsS0FERTtBQUVMbUUsUUFBQUEsT0FBTyxFQUFFLEtBRko7QUFHTEMsUUFBQUEsS0FBSyxFQUFFbkUsTUFBTSxDQUFDbUUsS0FIVDtBQUlMUSxRQUFBQSxjQUFjLEVBQUU7QUFKWCxPQUFQOztBQU9GLFNBQUsvRSxhQUFXLENBQUN3QyxtQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3JDLEtBQUw7QUFBWTBFLFFBQUFBLE1BQU0sRUFBRXpFLE1BQU0sQ0FBQ3lFO0FBQTNCLE9BQVA7QUFDRjs7QUFDQSxTQUFLN0UsYUFBVyxDQUFDNEMsb0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUd6QyxLQUFMO0FBQVk2RSxRQUFBQSxNQUFNLEVBQUU1RSxNQUFNLENBQUM0RTtBQUEzQixPQUFQOztBQUNGLFNBQUtoRixhQUFXLENBQUNnRCxlQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHN0MsS0FBTDtBQUFZOEUsUUFBQUEsWUFBWSxFQUFFN0UsTUFBTSxDQUFDOEQ7QUFBakMsT0FBUDs7QUFDRixTQUFLbEUsYUFBVyxDQUFDa0QsZ0JBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUcvQyxLQURFO0FBRUxnRSxRQUFBQSxPQUFPLEVBQUUvRCxNQUFNLENBQUMrRDtBQUZYLE9BQVA7QUFJRjs7QUFDQSxTQUFLbkUsYUFBVyxDQUFDZ0UsWUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRzdELEtBQUw7QUFBWW9FLFFBQUFBLEtBQUssRUFBRW5FLE1BQU0sQ0FBQ21FO0FBQTFCLE9BQVA7O0FBQ0YsU0FBS3ZFLGFBQVcsQ0FBQzJELFVBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUd4RCxLQUFMO0FBQVl3RSxRQUFBQSxVQUFVLEVBQUU7QUFBeEIsT0FBUDs7QUFDRixTQUFLM0UsYUFBVyxDQUFDNEQsSUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3pELEtBQUw7QUFBWXdFLFFBQUFBLFVBQVUsRUFBRTtBQUF4QixPQUFQOztBQUNGLFNBQUszRSxhQUFXLENBQUM2RCxPQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHMUQsS0FBTDtBQUFZd0UsUUFBQUEsVUFBVSxFQUFFO0FBQXhCLE9BQVA7O0FBQ0YsU0FBSzNFLGFBQVcsQ0FBQzhELE1BQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUczRCxLQUFMO0FBQVl3RSxRQUFBQSxVQUFVLEVBQUU7QUFBeEIsT0FBUDs7QUFDRixTQUFLM0UsYUFBVyxDQUFDK0QsWUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRzVELEtBQUw7QUFBWXVFLFFBQUFBLE1BQU0sRUFBRXRFLE1BQU0sQ0FBQ3NFO0FBQTNCLE9BQVA7O0FBQ0Y7QUFDRSxhQUFPdkUsS0FBUDtBQTdFSjtBQStFRDs7QUM3R00sTUFBTW1GLGFBQWEsR0FBRztBQUMzQkMsRUFBQUEsT0FBTyxFQUFFLFNBRGtCO0FBRTNCQyxFQUFBQSxRQUFRLEVBQUUsVUFGaUI7QUFHM0JDLEVBQUFBLFFBQVEsRUFBRSxVQUhpQjtBQUkzQkMsRUFBQUEsT0FBTyxFQUFFLFNBSmtCO0FBSzNCQyxFQUFBQSxTQUFTLEVBQUUsV0FMZ0I7QUFNM0JDLEVBQUFBLFNBQVMsRUFBRSxXQU5nQjtBQU8zQkMsRUFBQUEsTUFBTSxFQUFFLFFBUG1CO0FBUTNCO0FBQ0FDLEVBQUFBLE9BQU8sRUFBRSxTQVRrQjtBQVUzQkMsRUFBQUEsUUFBUSxFQUFFLFVBVmlCO0FBVzNCQyxFQUFBQSxRQUFRLEVBQUUsVUFYaUI7QUFZM0JDLEVBQUFBLE9BQU8sRUFBRSxTQVprQjtBQWEzQkMsRUFBQUEsU0FBUyxFQUFFLFdBYmdCO0FBYzNCQyxFQUFBQSxRQUFRLEVBQUUsVUFkaUI7QUFlM0JDLEVBQUFBLElBQUksRUFBRTtBQWZxQixDQUF0Qjs7QUNFQSxTQUFTQyxZQUFULENBQXNCO0FBQUVsRixFQUFBQSxRQUFGO0FBQVlnRCxFQUFBQSxPQUFaO0FBQXFCN0MsRUFBQUEsSUFBckI7QUFBMkJnRixFQUFBQTtBQUEzQixDQUF0QixFQUEyRDtBQUNoRSxRQUFNO0FBQUVDLElBQUFBLFFBQUY7QUFBWUMsSUFBQUE7QUFBWixNQUEwQnJDLE9BQWhDO0FBQ0EsUUFBTXNDLFVBQVUsR0FBSSxHQUFFbkYsSUFBSyxrQkFBM0I7QUFDQSxRQUFNb0YsV0FBVyxHQUFHLEVBQUUsR0FBR3ZDLE9BQUw7QUFBY21DLElBQUFBO0FBQWQsR0FBcEI7QUFDQSxNQUFJSyxhQUFhLEdBQUdqRixJQUFJLENBQUNRLEtBQUwsQ0FBV1YsWUFBWSxDQUFDUyxPQUFiLENBQXFCd0UsVUFBckIsQ0FBWCxDQUFwQjtBQUNBLFFBQU1HLFlBQVksR0FBR0QsYUFBYSxDQUFDRSxTQUFkLENBQ2xCekgsQ0FBRCxJQUFPQSxDQUFDLENBQUNtSCxRQUFGLEtBQWVBLFFBQWYsSUFBMkJuSCxDQUFDLENBQUNvSCxTQUFGLEtBQWdCQSxTQUQvQixDQUFyQjtBQUdBRyxFQUFBQSxhQUFhLENBQUNHLE1BQWQsQ0FBcUJGLFlBQXJCLEVBQW1DLENBQW5DLEVBQXNDRixXQUF0QztBQUNBbEYsRUFBQUEsWUFBWSxDQUFDQyxPQUFiLENBQXFCZ0YsVUFBckIsRUFBaUMvRSxJQUFJLENBQUNDLFNBQUwsQ0FBZWdGLGFBQWYsQ0FBakM7QUFDQXhGLEVBQUFBLFFBQVEsQ0FBQztBQUNQZCxJQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzBELHVCQURYO0FBRVBVLElBQUFBLGNBQWMsRUFBRXVDO0FBRlQsR0FBRCxDQUFSO0FBSUQ7QUFFTSxTQUFTSSxlQUFULENBQXlCO0FBQUU1QyxFQUFBQSxPQUFGO0FBQVdoRCxFQUFBQSxRQUFYO0FBQXFCRyxFQUFBQSxJQUFyQjtBQUEyQmdGLEVBQUFBO0FBQTNCLENBQXpCLEVBQThEO0FBQ25FLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZbkIsSUFBQUE7QUFBWixNQUF3QmpCLE9BQTlCO0FBQ0EsUUFBTTZDLFVBQVUsR0FBSSxHQUFFMUYsSUFBSyxJQUFHaUYsUUFBUyxXQUF2QztBQUNBLFFBQU1VLGFBQWEsR0FBR3ZGLElBQUksQ0FBQ1EsS0FBTCxDQUFXVixZQUFZLENBQUNTLE9BQWIsQ0FBcUIrRSxVQUFyQixDQUFYLENBQXRCO0FBQ0EsUUFBTUUsY0FBYyxHQUFHLEVBQUUsR0FBRzlCLE9BQUw7QUFBY21CLElBQUFBLFFBQVEsRUFBRWpGLElBQXhCO0FBQThCbkIsSUFBQUEsS0FBSyxFQUFFbUc7QUFBckMsR0FBdkI7O0FBQ0EsTUFBSVcsYUFBYSxJQUFJQSxhQUFhLENBQUNFLE1BQWQsR0FBdUIsQ0FBNUMsRUFBK0M7QUFDN0MzRixJQUFBQSxZQUFZLENBQUNDLE9BQWIsQ0FDRXVGLFVBREYsRUFFRXRGLElBQUksQ0FBQ0MsU0FBTCxDQUFlLENBQUMsR0FBR3NGLGFBQUosRUFBbUJDLGNBQW5CLENBQWYsQ0FGRjtBQUlBL0YsSUFBQUEsUUFBUSxDQUFDO0FBQ1BkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDdUQsZ0JBRFg7QUFFUGMsTUFBQUEsUUFBUSxFQUFFLENBQUMsR0FBRzRDLGFBQUosRUFBbUJDLGNBQW5CO0FBRkgsS0FBRCxDQUFSO0FBSUQsR0FURCxNQVNPO0FBQ0wxRixJQUFBQSxZQUFZLENBQUNDLE9BQWIsQ0FBcUJ1RixVQUFyQixFQUFpQ3RGLElBQUksQ0FBQ0MsU0FBTCxDQUFlLENBQUN1RixjQUFELENBQWYsQ0FBakM7QUFDQS9GLElBQUFBLFFBQVEsQ0FBQztBQUNQZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3VELGdCQURYO0FBRVBjLE1BQUFBLFFBQVEsRUFBRSxDQUFDNkMsY0FBRDtBQUZILEtBQUQsQ0FBUjtBQUlEO0FBQ0Y7QUFDTSxTQUFTRSxtQkFBVCxDQUE2QjtBQUFFakQsRUFBQUEsT0FBRjtBQUFXaEQsRUFBQUEsUUFBWDtBQUFxQkcsRUFBQUEsSUFBckI7QUFBMkJnRixFQUFBQTtBQUEzQixDQUE3QixFQUFrRTtBQUN2RSxRQUFNO0FBQUVDLElBQUFBLFFBQUY7QUFBWW5CLElBQUFBO0FBQVosTUFBd0JqQixPQUE5QjtBQUNBLFFBQU02QyxVQUFVLEdBQUksR0FBRTFGLElBQUssSUFBR2lGLFFBQVMsV0FBdkM7QUFDQSxRQUFNVSxhQUFhLEdBQUd2RixJQUFJLENBQUNRLEtBQUwsQ0FBV1YsWUFBWSxDQUFDUyxPQUFiLENBQXFCK0UsVUFBckIsQ0FBWCxDQUF0QjtBQUNBLFFBQU1FLGNBQWMsR0FBRyxFQUFFLEdBQUc5QixPQUFMO0FBQWNtQixJQUFBQSxRQUFkO0FBQXdCcEcsSUFBQUEsS0FBSyxFQUFFbUc7QUFBL0IsR0FBdkI7O0FBQ0EsTUFBSVcsYUFBYSxJQUFJQSxhQUFhLENBQUNFLE1BQWQsR0FBdUIsQ0FBNUMsRUFBK0M7QUFDN0MzRixJQUFBQSxZQUFZLENBQUNDLE9BQWIsQ0FDRXVGLFVBREYsRUFFRXRGLElBQUksQ0FBQ0MsU0FBTCxDQUFlLENBQUMsR0FBR3NGLGFBQUosRUFBbUJDLGNBQW5CLENBQWYsQ0FGRjtBQUlBL0YsSUFBQUEsUUFBUSxDQUFDO0FBQ1BkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDdUQsZ0JBRFg7QUFFUGMsTUFBQUEsUUFBUSxFQUFFLENBQUMsR0FBRzRDLGFBQUosRUFBbUJDLGNBQW5CO0FBRkgsS0FBRCxDQUFSO0FBSUQsR0FURCxNQVNPO0FBQ0wxRixJQUFBQSxZQUFZLENBQUNDLE9BQWIsQ0FBcUJ1RixVQUFyQixFQUFpQ3RGLElBQUksQ0FBQ0MsU0FBTCxDQUFlLENBQUN1RixjQUFELENBQWYsQ0FBakM7QUFDQS9GLElBQUFBLFFBQVEsQ0FBQztBQUNQZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3VELGdCQURYO0FBRVBjLE1BQUFBLFFBQVEsRUFBRSxDQUFDNkMsY0FBRDtBQUZILEtBQUQsQ0FBUjtBQUlEO0FBQ0Y7QUFDTSxTQUFTRyxVQUFULENBQW9CO0FBQUVsRyxFQUFBQSxRQUFGO0FBQVlHLEVBQUFBLElBQVo7QUFBa0I2QyxFQUFBQSxPQUFsQjtBQUEyQm1DLEVBQUFBO0FBQTNCLENBQXBCLEVBQXlEO0FBQzlELFFBQU1HLFVBQVUsR0FBSSxHQUFFbkYsSUFBSyxrQkFBM0I7QUFDQSxNQUFJcUYsYUFBYSxHQUFHakYsSUFBSSxDQUFDUSxLQUFMLENBQVdWLFlBQVksQ0FBQ1MsT0FBYixDQUFxQndFLFVBQXJCLENBQVgsQ0FBcEI7QUFDQSxRQUFNYSxhQUFhLEdBQUcsRUFBRSxHQUFHbkQsT0FBTDtBQUFjbUMsSUFBQUE7QUFBZCxHQUF0Qjs7QUFDQSxNQUFJSyxhQUFhLElBQUlBLGFBQWEsQ0FBQ1EsTUFBZCxHQUF1QixDQUE1QyxFQUErQztBQUM3QzNGLElBQUFBLFlBQVksQ0FBQ0MsT0FBYixDQUNFZ0YsVUFERixFQUVFL0UsSUFBSSxDQUFDQyxTQUFMLENBQWUsQ0FBQyxHQUFHZ0YsYUFBSixFQUFtQlcsYUFBbkIsQ0FBZixDQUZGO0FBSUFuRyxJQUFBQSxRQUFRLENBQUM7QUFDUGQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwRCx1QkFEWDtBQUVQVSxNQUFBQSxjQUFjLEVBQUUsQ0FBQyxHQUFHdUMsYUFBSixFQUFtQlcsYUFBbkI7QUFGVCxLQUFELENBQVI7QUFJRCxHQVRELE1BU087QUFDTDlGLElBQUFBLFlBQVksQ0FBQ0MsT0FBYixDQUFxQmdGLFVBQXJCLEVBQWlDL0UsSUFBSSxDQUFDQyxTQUFMLENBQWUsQ0FBQzJGLGFBQUQsQ0FBZixDQUFqQztBQUNBbkcsSUFBQUEsUUFBUSxDQUFDO0FBQ1BkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEQsdUJBRFg7QUFFUFUsTUFBQUEsY0FBYyxFQUFFLENBQUNrRCxhQUFEO0FBRlQsS0FBRCxDQUFSO0FBSUQ7QUFDRjtBQUVNLFNBQVNDLGlCQUFULENBQTJCO0FBQUVwRCxFQUFBQSxPQUFGO0FBQVc3QyxFQUFBQSxJQUFYO0FBQWlCSCxFQUFBQSxRQUFqQjtBQUEyQm1GLEVBQUFBO0FBQTNCLENBQTNCLEVBQWdFO0FBQ3JFLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZbkIsSUFBQUE7QUFBWixNQUF3QmpCLE9BQTlCO0FBQ0EsUUFBTTtBQUFFcUMsSUFBQUE7QUFBRixNQUFnQnBCLE9BQXRCO0FBQ0EsUUFBTTRCLFVBQVUsR0FBSSxHQUFFMUYsSUFBSyxJQUFHaUYsUUFBUyxXQUF2QztBQUNBLFFBQU1pQixjQUFjLEdBQUcsRUFBRSxHQUFHcEMsT0FBTDtBQUFjbUIsSUFBQUEsUUFBUSxFQUFFakYsSUFBeEI7QUFBOEJuQixJQUFBQSxLQUFLLEVBQUVtRztBQUFyQyxHQUF2QjtBQUNBLFFBQU1XLGFBQWEsR0FBR3ZGLElBQUksQ0FBQ1EsS0FBTCxDQUFXVixZQUFZLENBQUNTLE9BQWIsQ0FBcUIrRSxVQUFyQixDQUFYLENBQXRCO0FBRUEsTUFBSVMsWUFBWSxHQUFHUixhQUFhLENBQUNKLFNBQWQsQ0FBeUIzSCxDQUFELElBQU87QUFDaERBLElBQUFBLENBQUMsQ0FBQ3FILFFBQUYsS0FBZUEsUUFBZixFQUF5QnJILENBQUMsQ0FBQ3NILFNBQUYsS0FBZ0JBLFNBQXpDO0FBQ0QsR0FGa0IsQ0FBbkI7QUFHQVMsRUFBQUEsYUFBYSxDQUFDSCxNQUFkLENBQXFCVyxZQUFyQixFQUFtQyxDQUFuQyxFQUFzQ0QsY0FBdEM7QUFDQWhHLEVBQUFBLFlBQVksQ0FBQ0MsT0FBYixDQUFxQnVGLFVBQXJCLEVBQWlDdEYsSUFBSSxDQUFDQyxTQUFMLENBQWVzRixhQUFmLENBQWpDO0FBQ0E5RixFQUFBQSxRQUFRLENBQUM7QUFBRWQsSUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUN1RCxnQkFBcEI7QUFBc0NjLElBQUFBLFFBQVEsRUFBRTRDO0FBQWhELEdBQUQsQ0FBUjtBQUNEO0FBd0JNLFNBQVNTLGFBQVQsQ0FBdUI7QUFBRXZHLEVBQUFBLFFBQUY7QUFBWUcsRUFBQUEsSUFBWjtBQUFrQjZDLEVBQUFBO0FBQWxCLENBQXZCLEVBQW9EO0FBQ3pELFFBQU07QUFBRW9DLElBQUFBO0FBQUYsTUFBZXBDLE9BQXJCO0FBRUEsUUFBTXNDLFVBQVUsR0FBSSxHQUFFbkYsSUFBSyxXQUEzQjtBQUNBLE1BQUlxRixhQUFhLEdBQUdqRixJQUFJLENBQUNRLEtBQUwsQ0FBV1YsWUFBWSxDQUFDUyxPQUFiLENBQXFCd0UsVUFBckIsQ0FBWCxDQUFwQjtBQUNBLE1BQUlHLFlBQVksR0FBR0QsYUFBYSxDQUFDRSxTQUFkLENBQXlCYyxDQUFELElBQU9BLENBQUMsQ0FBQ3BCLFFBQUYsS0FBZUEsUUFBOUMsQ0FBbkI7QUFDQUksRUFBQUEsYUFBYSxDQUFDRyxNQUFkLENBQXFCRixZQUFyQixFQUFtQyxDQUFuQyxFQUFzQ3pDLE9BQXRDO0FBQ0EzQyxFQUFBQSxZQUFZLENBQUNDLE9BQWIsQ0FBcUJnRixVQUFyQixFQUFpQy9FLElBQUksQ0FBQ0MsU0FBTCxDQUFlZ0YsYUFBZixDQUFqQztBQUNBeEYsRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDd0QsZ0JBQXBCO0FBQXNDVSxJQUFBQSxRQUFRLEVBQUV5QztBQUFoRCxHQUFELENBQVI7QUFDRDtBQUVNLFNBQVNpQixXQUFULENBQXFCO0FBQUV6RCxFQUFBQSxPQUFGO0FBQVdoRCxFQUFBQSxRQUFYO0FBQXFCRyxFQUFBQTtBQUFyQixDQUFyQixFQUFrRDtBQUN2RCxRQUFNbUYsVUFBVSxHQUFJLEdBQUVuRixJQUFLLFdBQTNCO0FBQ0EsTUFBSXFGLGFBQWEsR0FBR25GLFlBQVksQ0FBQ1MsT0FBYixDQUFxQndFLFVBQXJCLENBQXBCOztBQUVBLE1BQUlFLGFBQWEsSUFBSUEsYUFBYSxDQUFDUSxNQUFkLEdBQXVCLENBQTVDLEVBQStDO0FBQzdDM0YsSUFBQUEsWUFBWSxDQUFDQyxPQUFiLENBQ0VnRixVQURGLEVBRUUvRSxJQUFJLENBQUNDLFNBQUwsQ0FBZSxDQUFDLEdBQUdnRixhQUFKLEVBQW1CeEMsT0FBbkIsQ0FBZixDQUZGO0FBSUFoRCxJQUFBQSxRQUFRLENBQUM7QUFDUGQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUN3RCxnQkFEWDtBQUVQVSxNQUFBQSxRQUFRLEVBQUUsQ0FBQyxHQUFHeUMsYUFBSixFQUFtQnhDLE9BQW5CO0FBRkgsS0FBRCxDQUFSO0FBSUFoRCxJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUN5RCxlQUFwQjtBQUFxQ1UsTUFBQUEsT0FBTyxFQUFFQTtBQUE5QyxLQUFELENBQVI7QUFDRCxHQVZELE1BVU87QUFDTDNDLElBQUFBLFlBQVksQ0FBQ0MsT0FBYixDQUFxQmdGLFVBQXJCLEVBQWlDL0UsSUFBSSxDQUFDQyxTQUFMLENBQWUsQ0FBQ3dDLE9BQUQsQ0FBZixDQUFqQztBQUNBaEQsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDd0QsZ0JBQXBCO0FBQXNDVSxNQUFBQSxRQUFRLEVBQUUsQ0FBQ0MsT0FBRDtBQUFoRCxLQUFELENBQVI7QUFDRDtBQUNGO0FBRU0sU0FBUzBELFlBQVQsQ0FBc0I7QUFBRTFELEVBQUFBLE9BQUY7QUFBV2hELEVBQUFBLFFBQVg7QUFBcUJHLEVBQUFBO0FBQXJCLENBQXRCLEVBQW1EO0FBQ3hELFFBQU07QUFBRWlGLElBQUFBLFFBQUY7QUFBWUMsSUFBQUE7QUFBWixNQUEwQnJDLE9BQWhDO0FBQ0EsUUFBTXNDLFVBQVUsR0FBSSxHQUFFbkYsSUFBSyxrQkFBM0I7QUFDQSxNQUFJcUYsYUFBYSxHQUFHakYsSUFBSSxDQUFDUSxLQUFMLENBQVdWLFlBQVksQ0FBQ1MsT0FBYixDQUFxQndFLFVBQXJCLENBQVgsQ0FBcEI7QUFDQSxRQUFNRyxZQUFZLEdBQUdELGFBQWEsQ0FBQ0UsU0FBZCxDQUNsQnpILENBQUQsSUFBT0EsQ0FBQyxDQUFDbUgsUUFBRixLQUFlQSxRQUFmLElBQTJCbkgsQ0FBQyxDQUFDb0gsU0FBRixLQUFnQkEsU0FEL0IsQ0FBckI7QUFHQUcsRUFBQUEsYUFBYSxDQUFDRyxNQUFkLENBQXFCRixZQUFyQixFQUFtQyxDQUFuQztBQUNBcEYsRUFBQUEsWUFBWSxDQUFDQyxPQUFiLENBQXFCZ0YsVUFBckIsRUFBaUMvRSxJQUFJLENBQUNDLFNBQUwsQ0FBZWdGLGFBQWYsQ0FBakM7QUFDQXhGLEVBQUFBLFFBQVEsQ0FBQztBQUNQZCxJQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzBELHVCQURYO0FBRVBVLElBQUFBLGNBQWMsRUFBRXVDO0FBRlQsR0FBRCxDQUFSO0FBSUQ7QUFFTSxTQUFTbUIsYUFBVCxDQUF1QjtBQUFFM0csRUFBQUEsUUFBRjtBQUFZRyxFQUFBQTtBQUFaLENBQXZCLEVBQTJDO0FBQ2hELFFBQU1tRixVQUFVLEdBQUksR0FBRW5GLElBQUssa0JBQTNCO0FBQ0FFLEVBQUFBLFlBQVksQ0FBQ3VHLFVBQWIsQ0FBd0J0QixVQUF4QjtBQUNBdEYsRUFBQUEsUUFBUSxDQUFDO0FBQ1BkLElBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEQsdUJBRFg7QUFFUFUsSUFBQUEsY0FBYyxFQUFFO0FBRlQsR0FBRCxDQUFSO0FBSUQ7O0FDaEtNLFNBQVM0RCxVQUFULENBQW9CO0FBQUU1QyxFQUFBQSxPQUFGO0FBQVdtQixFQUFBQSxRQUFYO0FBQXFCcEYsRUFBQUEsUUFBckI7QUFBK0I4RyxFQUFBQTtBQUEvQixDQUFwQixFQUFxRTtBQUMxRSxRQUFNO0FBQUUxRyxJQUFBQTtBQUFGLE1BQWlCRixXQUFXLEVBQWxDOztBQUNBLFdBQVM2RyxxQkFBVCxDQUErQjtBQUFFL0QsSUFBQUEsT0FBRjtBQUFXZ0UsSUFBQUE7QUFBWCxHQUEvQixFQUFxRDtBQUNuRCxZQUFRaEUsT0FBTyxDQUFDaEUsS0FBaEI7QUFDRSxXQUFLbUYsYUFBYSxDQUFDWSxTQUFuQjtBQUNFa0MsUUFBQUEsYUFBYSxDQUFDO0FBQ1pqSCxVQUFBQSxRQURZO0FBRVpnRCxVQUFBQSxPQUZZO0FBR1o3QyxVQUFBQSxJQUFJLEVBQUVpRixRQUhNO0FBSVowQixVQUFBQSxjQUpZO0FBS1oxRyxVQUFBQSxVQUxZO0FBTVo0RyxVQUFBQTtBQU5ZLFNBQUQsQ0FBYjtBQVFBOztBQUNGLFdBQUs3QyxhQUFhLENBQUNRLE9BQW5CO0FBQ0U0QixRQUFBQSxhQUFhLENBQUM7QUFBRXZHLFVBQUFBLFFBQUY7QUFBWWdELFVBQUFBLE9BQVo7QUFBcUI3QyxVQUFBQSxJQUFJLEVBQUVpRjtBQUEzQixTQUFELENBQWI7QUFDQWdCLFFBQUFBLGlCQUFpQixDQUFDO0FBQUVwRCxVQUFBQSxPQUFGO0FBQVc3QyxVQUFBQSxJQUFJLEVBQUVpRixRQUFqQjtBQUEyQnBGLFVBQUFBO0FBQTNCLFNBQUQsQ0FBakI7QUFDQUEsUUFBQUEsUUFBUSxDQUFDO0FBQUVkLFVBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDOEM7QUFBcEIsU0FBRCxDQUFSO0FBQ0F2QixRQUFBQSxVQUFVLENBQUM7QUFBRWhCLFVBQUFBLFlBQVksRUFBRyxJQUFHNEQsT0FBTyxDQUFDaEUsS0FBTSxFQUFsQztBQUFxQ0csVUFBQUEsS0FBSyxFQUFFO0FBQTVDLFNBQUQsQ0FBVjtBQUNBOztBQUNGLFdBQUtnRixhQUFhLENBQUNVLFFBQW5CO0FBQ0VLLFFBQUFBLFlBQVksQ0FBQztBQUFFbEYsVUFBQUEsUUFBRjtBQUFZZ0QsVUFBQUEsT0FBWjtBQUFxQjdDLFVBQUFBLElBQUksRUFBRWlGLFFBQTNCO0FBQXFDRCxVQUFBQSxNQUFNLEVBQUU7QUFBN0MsU0FBRCxDQUFaO0FBQ0FpQixRQUFBQSxpQkFBaUIsQ0FBQztBQUFFcEQsVUFBQUEsT0FBRjtBQUFXN0MsVUFBQUEsSUFBSSxFQUFFaUYsUUFBakI7QUFBMkJwRixVQUFBQTtBQUEzQixTQUFELENBQWpCO0FBQ0FBLFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzhDO0FBQXBCLFNBQUQsQ0FBUjtBQUNBdkIsUUFBQUEsVUFBVSxDQUFDO0FBQUVoQixVQUFBQSxZQUFZLEVBQUcsSUFBRzRELE9BQU8sQ0FBQ2hFLEtBQU0sRUFBbEM7QUFBcUNHLFVBQUFBLEtBQUssRUFBRTtBQUE1QyxTQUFELENBQVY7QUFDQTs7QUFDRixXQUFLZ0YsYUFBYSxDQUFDUyxRQUFuQjtBQUNFTSxRQUFBQSxZQUFZLENBQUM7QUFBRWxGLFVBQUFBLFFBQUY7QUFBWWdELFVBQUFBLE9BQVo7QUFBcUI3QyxVQUFBQSxJQUFJLEVBQUVpRixRQUEzQjtBQUFxQ0QsVUFBQUEsTUFBTSxFQUFFO0FBQTdDLFNBQUQsQ0FBWjtBQUNBb0IsUUFBQUEsYUFBYSxDQUFDO0FBQUV2RyxVQUFBQSxRQUFGO0FBQVlnRCxVQUFBQSxPQUFaO0FBQXFCN0MsVUFBQUEsSUFBSSxFQUFFaUY7QUFBM0IsU0FBRCxDQUFiO0FBQ0FnQixRQUFBQSxpQkFBaUIsQ0FBQztBQUFFcEQsVUFBQUEsT0FBRjtBQUFXN0MsVUFBQUEsSUFBSSxFQUFFaUYsUUFBakI7QUFBMkJwRixVQUFBQTtBQUEzQixTQUFELENBQWpCO0FBQ0FBLFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzhDO0FBQXBCLFNBQUQsQ0FBUjtBQUNBdkIsUUFBQUEsVUFBVSxDQUFDO0FBQUVoQixVQUFBQSxZQUFZLEVBQUcsSUFBRzRELE9BQU8sQ0FBQ2hFLEtBQU0sRUFBbEM7QUFBcUNHLFVBQUFBLEtBQUssRUFBRTtBQUE1QyxTQUFELENBQVY7QUFDQTs7QUFDRixXQUFLZ0YsYUFBYSxDQUFDVyxPQUFuQjtBQUNFeUIsUUFBQUEsYUFBYSxDQUFDO0FBQUV2RyxVQUFBQSxRQUFGO0FBQVlnRCxVQUFBQSxPQUFaO0FBQXFCN0MsVUFBQUEsSUFBSSxFQUFFaUY7QUFBM0IsU0FBRCxDQUFiO0FBQ0FnQixRQUFBQSxpQkFBaUIsQ0FBQztBQUFFcEQsVUFBQUEsT0FBRjtBQUFXN0MsVUFBQUEsSUFBSSxFQUFFaUYsUUFBakI7QUFBMkJwRixVQUFBQTtBQUEzQixTQUFELENBQWpCO0FBQ0EyRyxRQUFBQSxhQUFhLENBQUM7QUFBRTNHLFVBQUFBLFFBQUY7QUFBWUcsVUFBQUE7QUFBWixTQUFELENBQWI7QUFDQUgsUUFBQUEsUUFBUSxDQUFDO0FBQUVkLFVBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDeUQsZUFBcEI7QUFBcUNVLFVBQUFBO0FBQXJDLFNBQUQsQ0FBUjtBQUNBaEQsUUFBQUEsUUFBUSxDQUFDO0FBQUVkLFVBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDOEM7QUFBcEIsU0FBRCxDQUFSO0FBQ0F2QixRQUFBQSxVQUFVLENBQUM7QUFBRWhCLFVBQUFBLFlBQVksRUFBRyxJQUFHNEQsT0FBTyxDQUFDaEUsS0FBTSxFQUFsQztBQUFxQ0csVUFBQUEsS0FBSyxFQUFFO0FBQTVDLFNBQUQsQ0FBVjtBQUNBOztBQUNGLFdBQUtnRixhQUFhLENBQUNhLFFBQW5CO0FBQ0V1QixRQUFBQSxhQUFhLENBQUM7QUFBRXZHLFVBQUFBLFFBQUY7QUFBWUcsVUFBQUEsSUFBSSxFQUFFaUYsUUFBbEI7QUFBNEJwQyxVQUFBQTtBQUE1QixTQUFELENBQWI7QUFDQW9ELFFBQUFBLGlCQUFpQixDQUFDO0FBQ2hCcEQsVUFBQUEsT0FEZ0I7QUFFaEI3QyxVQUFBQSxJQUFJLEVBQUVpRixRQUZVO0FBR2hCcEYsVUFBQUEsUUFIZ0I7QUFJaEJtRixVQUFBQSxNQUFNLEVBQUU7QUFKUSxTQUFELENBQWpCO0FBTUFuRixRQUFBQSxRQUFRLENBQUM7QUFBRWQsVUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUM4QztBQUFwQixTQUFELENBQVI7QUFDQTs7QUFDRixXQUFLd0MsYUFBYSxDQUFDYyxJQUFuQjtBQUNFc0IsUUFBQUEsYUFBYSxDQUFDO0FBQUV2RyxVQUFBQSxRQUFGO0FBQVlHLFVBQUFBLElBQUksRUFBRWlGLFFBQWxCO0FBQTRCcEMsVUFBQUE7QUFBNUIsU0FBRCxDQUFiO0FBQ0FoRCxRQUFBQSxRQUFRLENBQUM7QUFBRWQsVUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUM4QztBQUFwQixTQUFELENBQVI7QUFDQStFLFFBQUFBLFlBQVksQ0FBQztBQUFFMUcsVUFBQUEsUUFBRjtBQUFZZ0QsVUFBQUEsT0FBWjtBQUFxQjdDLFVBQUFBLElBQUksRUFBRWlGO0FBQTNCLFNBQUQsQ0FBWjtBQUNBO0FBcERKO0FBd0REOztBQUVELFdBQVM4QixTQUFULENBQW1CO0FBQUVsRSxJQUFBQTtBQUFGLEdBQW5CLEVBQWdDO0FBQzlCLFlBQVFBLE9BQU8sQ0FBQ2hFLEtBQWhCO0FBQ0UsV0FBS21GLGFBQWEsQ0FBQ0UsUUFBbkI7QUFDRWtDLFFBQUFBLGFBQWEsQ0FBQztBQUFFdkcsVUFBQUEsUUFBRjtBQUFZRyxVQUFBQSxJQUFJLEVBQUVpRixRQUFsQjtBQUE0QnBDLFVBQUFBO0FBQTVCLFNBQUQsQ0FBYjtBQUNBaUQsUUFBQUEsbUJBQW1CLENBQUM7QUFDbEJqRCxVQUFBQSxPQURrQjtBQUVsQmhELFVBQUFBLFFBRmtCO0FBR2xCRyxVQUFBQSxJQUFJLEVBQUVpRixRQUhZO0FBSWxCRCxVQUFBQSxNQUFNLEVBQUU7QUFKVSxTQUFELENBQW5CO0FBTUFlLFFBQUFBLFVBQVUsQ0FBQztBQUFFbEcsVUFBQUEsUUFBRjtBQUFZRyxVQUFBQSxJQUFJLEVBQUVpRixRQUFsQjtBQUE0QnBDLFVBQUFBO0FBQTVCLFNBQUQsQ0FBVjtBQUNBOztBQUNGLFdBQUttQixhQUFhLENBQUNJLE9BQW5CO0FBQ0VnQyxRQUFBQSxhQUFhLENBQUM7QUFBRXZHLFVBQUFBLFFBQUY7QUFBWUcsVUFBQUEsSUFBSSxFQUFFaUYsUUFBbEI7QUFBNEJwQyxVQUFBQTtBQUE1QixTQUFELENBQWI7QUFDQTJELFFBQUFBLGFBQWEsQ0FBQztBQUFFM0csVUFBQUEsUUFBRjtBQUFZRyxVQUFBQTtBQUFaLFNBQUQsQ0FBYjtBQUNBOztBQUNGLFdBQUtnRSxhQUFhLENBQUNHLFFBQW5CO0FBQ0VpQyxRQUFBQSxhQUFhLENBQUM7QUFBRXZHLFVBQUFBLFFBQUY7QUFBWUcsVUFBQUEsSUFBSSxFQUFFaUYsUUFBbEI7QUFBNEJwQyxVQUFBQTtBQUE1QixTQUFELENBQWI7QUFDQTs7QUFDRixXQUFLbUIsYUFBYSxDQUFDQyxPQUFuQjtBQUNFOEIsUUFBQUEsVUFBVSxDQUFDO0FBQ1RsRyxVQUFBQSxRQURTO0FBRVRnRCxVQUFBQSxPQUZTO0FBR1Q3QyxVQUFBQSxJQUFJLEVBQUVpRixRQUhHO0FBSVRELFVBQUFBLE1BQU0sRUFBRTtBQUpDLFNBQUQsQ0FBVjtBQU1BYyxRQUFBQSxtQkFBbUIsQ0FBQztBQUNsQmpELFVBQUFBLE9BRGtCO0FBRWxCaEQsVUFBQUEsUUFGa0I7QUFHbEJHLFVBQUFBLElBQUksRUFBRWlGLFFBSFk7QUFJbEJELFVBQUFBLE1BQU0sRUFBRTtBQUpVLFNBQUQsQ0FBbkI7QUFNQTs7QUFDRixXQUFLaEIsYUFBYSxDQUFDTSxTQUFuQjtBQUNFOEIsUUFBQUEsYUFBYSxDQUFDO0FBQUV2RyxVQUFBQSxRQUFGO0FBQVlHLFVBQUFBLElBQUksRUFBRWlGLFFBQWxCO0FBQTRCcEMsVUFBQUE7QUFBNUIsU0FBRCxDQUFiO0FBQ0FrRCxRQUFBQSxVQUFVLENBQUM7QUFDVGxHLFVBQUFBLFFBRFM7QUFFVGdELFVBQUFBLE9BRlM7QUFHVDdDLFVBQUFBLElBQUksRUFBRWlGLFFBSEc7QUFJVEQsVUFBQUEsTUFBTSxFQUFFO0FBSkMsU0FBRCxDQUFWO0FBTUFjLFFBQUFBLG1CQUFtQixDQUFDO0FBQ2xCakQsVUFBQUEsT0FEa0I7QUFFbEJoRCxVQUFBQSxRQUZrQjtBQUdsQkcsVUFBQUEsSUFBSSxFQUFFaUYsUUFIWTtBQUlsQkQsVUFBQUEsTUFBTSxFQUFFO0FBSlUsU0FBRCxDQUFuQjtBQU1BO0FBOUNKO0FBOEREOztBQUVELFdBQVNnQyxjQUFULENBQXdCO0FBQUVwRSxJQUFBQTtBQUFGLEdBQXhCLEVBQXNDO0FBQ3BDQSxJQUFBQSxRQUFRLENBQUNxRSxPQUFULENBQWtCcEUsT0FBRCxJQUFhO0FBQzVCa0UsTUFBQUEsU0FBUyxDQUFDO0FBQUVsRSxRQUFBQSxPQUFGO0FBQVdxRSxRQUFBQSxNQUFNLEVBQUU7QUFBbkIsT0FBRCxDQUFUO0FBQ0QsS0FGRDtBQUdEOztBQUVEeEcsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJb0QsT0FBTyxJQUFJbUIsUUFBZixFQUF5QjtBQUN2QixjQUFRbkIsT0FBTyxDQUFDL0UsSUFBaEI7QUFDRSxhQUFLLGlCQUFMO0FBQ0U2SCxVQUFBQSxxQkFBcUIsQ0FBQztBQUFFL0QsWUFBQUEsT0FBTyxFQUFFaUIsT0FBTyxDQUFDakIsT0FBbkI7QUFBNEJnRSxZQUFBQSxPQUFPLEVBQUU7QUFBckMsV0FBRCxDQUFyQjtBQUNBOztBQUNGLGFBQUssU0FBTDtBQUNFLGNBQ0VGLGNBQWMsSUFDZEEsY0FBYyxDQUFDMUIsUUFBZixLQUE0Qm5CLE9BQU8sQ0FBQ2pCLE9BQVIsQ0FBZ0JvQyxRQUY5QyxFQUdFO0FBQ0E4QixZQUFBQSxTQUFTLENBQUM7QUFBRWxFLGNBQUFBLE9BQU8sRUFBRWlCLE9BQU8sQ0FBQ2pCLE9BQW5CO0FBQTRCcUUsY0FBQUEsTUFBTSxFQUFFO0FBQXBDLGFBQUQsQ0FBVDtBQUNELFdBTEQsTUFLTztBQUNMSCxZQUFBQSxTQUFTLENBQUM7QUFBRWxFLGNBQUFBLE9BQU8sRUFBRWlCLE9BQU8sQ0FBQ2pCLE9BQW5CO0FBQTRCcUUsY0FBQUEsTUFBTSxFQUFFO0FBQXBDLGFBQUQsQ0FBVDtBQUNEOztBQUNEOztBQUNGLGFBQUssaUJBQUw7QUFDRUYsVUFBQUEsY0FBYyxDQUFDO0FBQUVwRSxZQUFBQSxRQUFRLEVBQUVrQixPQUFPLENBQUNsQjtBQUFwQixXQUFELENBQWQ7QUFDQTs7QUFDRixhQUFLLGNBQUw7QUFDRWdFLFVBQUFBLHFCQUFxQixDQUFDO0FBQUUvRCxZQUFBQSxPQUFPLEVBQUVpQixPQUFPLENBQUNqQixPQUFuQjtBQUE0QmdFLFlBQUFBLE9BQU8sRUFBRTtBQUFyQyxXQUFELENBQXJCO0FBQ0E7QUFuQko7QUF1QkQ7QUFDRixHQTFCUSxFQTBCTixDQUFDL0MsT0FBRCxFQUFVbUIsUUFBVixDQTFCTSxDQUFUO0FBNEJBLFNBQU8sRUFBUDtBQUNEOztBQy9LRCxvQkFBZTtBQUNia0MsRUFBQUEsYUFBYSxFQUFFLGVBREY7QUFFYkMsRUFBQUEsYUFBYSxFQUFFLGVBRkY7QUFHYkMsRUFBQUEsYUFBYSxFQUFFLGVBSEY7QUFJYkMsRUFBQUEsWUFBWSxFQUFFLGNBSkQ7QUFNYkMsRUFBQUEsTUFBTSxFQUFFLFFBTks7QUFRYkMsRUFBQUEsY0FBYyxFQUFFLGdCQVJIO0FBU2JDLEVBQUFBLGNBQWMsRUFBRSxnQkFUSDtBQVViQyxFQUFBQSxhQUFhLEVBQUUsZUFWRjtBQVliQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFaWjtBQWFiQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFiWjtBQWNiQyxFQUFBQSxzQkFBc0IsRUFBRSx3QkFkWDtBQWdCYkMsRUFBQUEsMkJBQTJCLEVBQUUsNkJBaEJoQjtBQWlCYkMsRUFBQUEsMkJBQTJCLEVBQUUsNkJBakJoQjtBQWtCYkMsRUFBQUEsMEJBQTBCLEVBQUUsNEJBbEJmO0FBb0JiQyxFQUFBQSxrQkFBa0IsRUFBRSxvQkFwQlA7QUFzQmJDLEVBQUFBLHdCQUF3QixFQUFFLDBCQXRCYjtBQXdCYkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBeEJWO0FBMEJiQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkExQlY7QUE0QmJDLEVBQUFBLGlCQUFpQixFQUFFO0FBNUJOLENBQWY7O0FDQ08sTUFBTTdILFdBQVMsR0FBRztBQUN2QjhILEVBQUFBLEtBQUssRUFBRSxLQURnQjtBQUV2QkMsRUFBQUEsTUFBTSxFQUFFLEtBRmU7QUFHdkJDLEVBQUFBLGNBQWMsRUFBRSxLQUhPO0FBSXZCQyxFQUFBQSxpQkFBaUIsRUFBRSxLQUpJO0FBS3ZCQyxFQUFBQSxVQUFVLEVBQUU7QUFDVnpELElBQUFBLFFBQVEsRUFBRTtBQUFFMEQsTUFBQUEsT0FBTyxFQUFFQyxTQUFYO0FBQXNCOUUsTUFBQUEsT0FBTyxFQUFFO0FBQS9CLEtBREE7QUFFVitFLElBQUFBLEtBQUssRUFBRTtBQUFFRixNQUFBQSxPQUFPLEVBQUVDLFNBQVg7QUFBc0I5RSxNQUFBQSxPQUFPLEVBQUU7QUFBL0IsS0FGRztBQUdWZ0YsSUFBQUEsUUFBUSxFQUFFO0FBQUVILE1BQUFBLE9BQU8sRUFBRUMsU0FBWDtBQUFzQjlFLE1BQUFBLE9BQU8sRUFBRTtBQUEvQixLQUhBO0FBSVZpRixJQUFBQSxPQUFPLEVBQUU7QUFDUEosTUFBQUEsT0FBTyxFQUFFQyxTQURGO0FBRVA5RSxNQUFBQSxPQUFPLEVBQUU7QUFGRixLQUpDO0FBUVZrRixJQUFBQSxlQUFlLEVBQUU7QUFBRUwsTUFBQUEsT0FBTyxFQUFFQyxTQUFYO0FBQXNCOUUsTUFBQUEsT0FBTyxFQUFFO0FBQS9CO0FBUlAsR0FMVztBQWV2QitFLEVBQUFBLEtBQUssRUFBRSxFQWZnQjtBQWdCdkJDLEVBQUFBLFFBQVEsRUFBRSxFQWhCYTtBQWlCdkJHLEVBQUFBLE9BQU8sRUFBRSxLQWpCYztBQWtCdkJoRyxFQUFBQSxLQUFLLEVBQUUsSUFsQmdCO0FBbUJ2QmdDLEVBQUFBLFFBQVEsRUFBRSxFQW5CYTtBQW9CdkJqQyxFQUFBQSxPQUFPLEVBQUUsS0FwQmM7QUFxQnZCK0YsRUFBQUEsT0FBTyxFQUFFLEVBckJjO0FBc0J2QkcsRUFBQUEsT0FBTyxFQUFFLEVBdEJjO0FBdUJ2QkYsRUFBQUEsZUFBZSxFQUFFLEVBdkJNO0FBd0J2QkcsRUFBQUEsS0FBSyxFQUFFLElBeEJnQjtBQXlCdkJDLEVBQUFBLFlBQVksRUFBRSxJQXpCUztBQTBCdkJDLEVBQUFBLElBQUksRUFBRSxJQTFCaUI7QUEyQnZCQyxFQUFBQSxPQUFPLEVBQUU7QUEzQmMsQ0FBbEI7QUE4QkEsU0FBU0MsV0FBVCxDQUFxQjFLLEtBQXJCLEVBQTRCQyxNQUE1QixFQUFvQztBQUN6QyxVQUFRQSxNQUFNLENBQUNDLElBQWY7QUFDRSxTQUFLTCxhQUFXLENBQUMySixpQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3hKLEtBQUw7QUFBWW9FLFFBQUFBLEtBQUssRUFBRTtBQUFuQixPQUFQOztBQUNGLFNBQUt2RSxhQUFXLENBQUN5SixxQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3RKLEtBQUw7QUFBWW9FLFFBQUFBLEtBQUssRUFBRW5FLE1BQU0sQ0FBQ21FO0FBQTFCLE9BQVA7O0FBQ0YsU0FBS3ZFLGFBQVcsQ0FBQzBKLHFCQUFqQjtBQUNFLGFBQU8sRUFDTCxHQUFHdkosS0FERTtBQUVMNkosUUFBQUEsVUFBVSxFQUFFLEVBQ1YsR0FBRzdKLEtBQUssQ0FBQzZKLFVBREM7QUFFVixXQUFDNUosTUFBTSxDQUFDa0IsSUFBUixHQUFlO0FBQUUySSxZQUFBQSxPQUFPLEVBQUU3SixNQUFNLENBQUM2SixPQUFsQjtBQUEyQjdFLFlBQUFBLE9BQU8sRUFBRWhGLE1BQU0sQ0FBQ2dGO0FBQTNDO0FBRkw7QUFGUCxPQUFQOztBQU9GLFNBQUtwRixhQUFXLENBQUN5SSxhQUFqQjtBQUNFLFlBQU1xQyxTQUFTLEdBQUcsRUFDaEIsR0FBRzNLLEtBRGE7QUFFaEIsU0FBQ0MsTUFBTSxDQUFDa0IsSUFBUixHQUFlbEIsTUFBTSxDQUFDK0I7QUFGTixPQUFsQjtBQUtBLGFBQU8ySSxTQUFQOztBQUNGLFNBQUs5SyxhQUFXLENBQUMwSSxhQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHdkksS0FBTDtBQUFZbUUsUUFBQUEsT0FBTyxFQUFFLElBQXJCO0FBQTJCc0YsUUFBQUEsS0FBSyxFQUFFO0FBQWxDLE9BQVA7O0FBQ0YsU0FBSzVKLGFBQVcsQ0FBQzJJLGFBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUd4SSxLQURFO0FBRUxvSyxRQUFBQSxPQUFPLEVBQUUsSUFGSjtBQUdMakcsUUFBQUEsT0FBTyxFQUFFLEtBSEo7QUFJTHFHLFFBQUFBLElBQUksRUFBRXZLLE1BQU0sQ0FBQ3VLLElBSlI7QUFLTFAsUUFBQUEsUUFBUSxFQUFFO0FBTEwsT0FBUDs7QUFPRixTQUFLcEssYUFBVyxDQUFDNEksWUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3pJLEtBQUw7QUFBWW1FLFFBQUFBLE9BQU8sRUFBRSxLQUFyQjtBQUE0QnNGLFFBQUFBLEtBQUssRUFBRTtBQUFuQyxPQUFQOztBQUNGLFNBQUs1SixhQUFXLENBQUM4SSxjQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHM0ksS0FBTDtBQUFZbUUsUUFBQUEsT0FBTyxFQUFFLElBQXJCO0FBQTJCdUYsUUFBQUEsTUFBTSxFQUFFO0FBQW5DLE9BQVA7O0FBQ0YsU0FBSzdKLGFBQVcsQ0FBQytJLGNBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUc1SSxLQURFO0FBRUxtRSxRQUFBQSxPQUFPLEVBQUUsS0FGSjtBQUdMcUcsUUFBQUEsSUFBSSxFQUFFdkssTUFBTSxDQUFDdUs7QUFIUixPQUFQOztBQUtGLFNBQUszSyxhQUFXLENBQUNnSixhQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHN0ksS0FBTDtBQUFZbUUsUUFBQUEsT0FBTyxFQUFFLEtBQXJCO0FBQTRCdUYsUUFBQUEsTUFBTSxFQUFFO0FBQXBDLE9BQVA7O0FBQ0YsU0FBSzdKLGFBQVcsQ0FBQ2lKLHVCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHOUksS0FBTDtBQUFZbUUsUUFBQUEsT0FBTyxFQUFFLElBQXJCO0FBQTJCd0YsUUFBQUEsY0FBYyxFQUFFO0FBQTNDLE9BQVA7O0FBQ0YsU0FBSzlKLGFBQVcsQ0FBQ2tKLHVCQUFqQjtBQUNFLGFBQU8sRUFDTCxHQUFHL0ksS0FERTtBQUVMbUUsUUFBQUEsT0FBTyxFQUFFLEtBRko7QUFHTHFHLFFBQUFBLElBQUksRUFBRXZLLE1BQU0sQ0FBQ3VLLElBSFI7QUFJTGIsUUFBQUEsY0FBYyxFQUFFO0FBSlgsT0FBUDs7QUFNRixTQUFLOUosYUFBVyxDQUFDbUosc0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdoSixLQUFMO0FBQVltRSxRQUFBQSxPQUFPLEVBQUUsS0FBckI7QUFBNEJ3RixRQUFBQSxjQUFjLEVBQUU7QUFBNUMsT0FBUDs7QUFDRixTQUFLOUosYUFBVyxDQUFDb0osMkJBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdqSixLQUFMO0FBQVltRSxRQUFBQSxPQUFPLEVBQUUsSUFBckI7QUFBMkJ5RixRQUFBQSxpQkFBaUIsRUFBRTtBQUE5QyxPQUFQOztBQUNGLFNBQUsvSixhQUFXLENBQUNxSiwyQkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR2xKLEtBREU7QUFFTG1FLFFBQUFBLE9BQU8sRUFBRSxLQUZKO0FBR0x5RixRQUFBQSxpQkFBaUIsRUFBRTtBQUhkLE9BQVA7O0FBS0YsU0FBSy9KLGFBQVcsQ0FBQ3NKLDBCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHbkosS0FBTDtBQUFZbUUsUUFBQUEsT0FBTyxFQUFFLEtBQXJCO0FBQTRCeUYsUUFBQUEsaUJBQWlCLEVBQUU7QUFBL0MsT0FBUDs7QUFDRixTQUFLL0osYUFBVyxDQUFDdUosa0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdwSixLQUFMO0FBQVlzSyxRQUFBQSxLQUFLLEVBQUVySyxNQUFNLENBQUNxSztBQUExQixPQUFQOztBQUNGLFNBQUt6SyxhQUFXLENBQUM2SSxNQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHL0csV0FBTDtBQUFnQjhJLFFBQUFBLE9BQU8sRUFBRTtBQUF6QixPQUFQOztBQUNGLFNBQUs1SyxhQUFXLENBQUN3Six3QkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR3JKLEtBREU7QUFFTHdLLFFBQUFBLElBQUksRUFBRXZLLE1BQU0sQ0FBQ3VLO0FBRlIsT0FBUDs7QUFJRjtBQUNFLGFBQU94SyxLQUFQO0FBekVKO0FBMkVEOztBQzNHRCxpQkFBZTtBQUNiNEssRUFBQUEsbUJBQW1CLEVBQUUsR0FEUjtBQUViO0FBQ0FDLEVBQUFBLGlCQUFpQixFQUFFLEtBSE47QUFJYjtBQUNBQyxFQUFBQSxlQUFlLEVBQUUsS0FMSjtBQU1iQyxFQUFBQSxpQkFBaUIsRUFBRSxLQU5OO0FBT2JDLEVBQUFBLGVBQWUsRUFBRSxLQVBKO0FBUWJDLEVBQUFBLGVBQWUsRUFBRSxLQVJKO0FBUVc7QUFDeEJDLEVBQUFBLFlBQVksRUFBRSxLQVREO0FBVWI7QUFDQUMsRUFBQUEsb0JBQW9CLEVBQUUsS0FYVDtBQVliQyxFQUFBQSxxQkFBcUIsRUFBRSxLQVpWO0FBYWJDLEVBQUFBLHVCQUF1QixFQUFFLEtBYlo7QUFjYkMsRUFBQUEsdUJBQXVCLEVBQUUsS0FkWjtBQWViO0FBQ0FDLEVBQUFBLGtCQUFrQixFQUFFLEtBaEJQO0FBaUJiQyxFQUFBQSxZQUFZLEVBQUUsS0FqQkQ7QUFrQmJDLEVBQUFBLHFCQUFxQixFQUFHQyxNQUFELElBQVk7QUFDakMsUUFBSUEsTUFBTSxJQUFJLEdBQVYsSUFBaUJBLE1BQU0sSUFBSSxHQUEvQixFQUFvQztBQUNsQyxhQUFPLElBQVA7QUFDRDs7QUFDRCxXQUFPLEtBQVA7QUFDRDtBQXZCWSxDQUFmOztBQ0FBLHlCQUFlO0FBQ2JDLEVBQUFBLGdCQUFnQixFQUNkLHFIQUZXO0FBR2JDLEVBQUFBLGFBQWEsRUFBRSwyQkFIRjtBQUliQyxFQUFBQSxvQkFBb0IsRUFBRSx5QkFKVDtBQUtiQyxFQUFBQSx1QkFBdUIsRUFBRSw0QkFMWjtBQU1iQyxFQUFBQSxnQkFBZ0IsRUFDZCw2REFQVztBQVFiQyxFQUFBQSxvQkFBb0IsRUFBRSxnQkFSVDtBQVNiQyxFQUFBQSx5QkFBeUIsRUFBRSxnQ0FUZDtBQVViQyxFQUFBQSxtQkFBbUIsRUFBRSw4QkFWUjtBQVdiQyxFQUFBQSxjQUFjLEVBQUUsMkJBWEg7QUFZYkMsRUFBQUEsZ0JBQWdCLEVBQUUsNkJBWkw7QUFhYkMsRUFBQUEsc0JBQXNCLEVBQUUsd0JBYlg7QUFjYkMsRUFBQUEsc0JBQXNCLEVBQUUsMkNBZFg7QUFlYkMsRUFBQUEsY0FBYyxFQUFFO0FBZkgsQ0FBZjs7QUNHZSxTQUFTQyxnQkFBVCxDQUEwQjtBQUFFZCxFQUFBQSxNQUFNLEdBQUcsQ0FBWDtBQUFjMUssRUFBQUE7QUFBZCxDQUExQixFQUFvRDtBQUNqRSxVQUFRMEssTUFBUjtBQUNFLFNBQUssR0FBTDtBQUNBLFNBQUssR0FBTDtBQUNBLFNBQUtlLFVBQVUsQ0FBQzVCLGlCQUFoQjtBQUNBLFNBQUs0QixVQUFVLENBQUN0QixvQkFBaEI7QUFDQSxTQUFLc0IsVUFBVSxDQUFDcEIsdUJBQWhCO0FBQ0EsU0FBS29CLFVBQVUsQ0FBQ25CLHVCQUFoQjtBQUNFdEssTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFFBQUFBLElBQUksRUFBRSxVQUZDO0FBR1AySSxRQUFBQSxPQUFPLEVBQUUsS0FIRjtBQUlQN0UsUUFBQUEsT0FBTyxFQUFFeUgsa0JBQWtCLENBQUNSO0FBSnJCLE9BQUQsQ0FBUjtBQU1BbEwsTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFFBQUFBLElBQUksRUFBRSxpQkFGQztBQUdQMkksUUFBQUEsT0FBTyxFQUFFLEtBSEY7QUFJUDdFLFFBQUFBLE9BQU8sRUFBRXlILGtCQUFrQixDQUFDUjtBQUpyQixPQUFELENBQVI7QUFNQTs7QUFDRixTQUFLLEdBQUw7QUFDQSxTQUFLLENBQUMsQ0FBTjtBQUNBLFNBQUtPLFVBQVUsQ0FBQ3ZCLFlBQWhCO0FBQ0VsSyxNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSixxQkFEWDtBQUVQcEksUUFBQUEsSUFBSSxFQUFFLE9BRkM7QUFHUDJJLFFBQUFBLE9BQU8sRUFBRSxLQUhGO0FBSVA3RSxRQUFBQSxPQUFPLEVBQUV5SCxrQkFBa0IsQ0FBQ2Q7QUFKckIsT0FBRCxDQUFSO0FBTUE7O0FBQ0YsU0FBS2EsVUFBVSxDQUFDeEIsZUFBaEI7QUFDQSxTQUFLLENBQUMsQ0FBTjtBQUNFakssTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFFBQUFBLElBQUksRUFBRSxVQUZDO0FBR1AySSxRQUFBQSxPQUFPLEVBQUUsS0FIRjtBQUlQN0UsUUFBQUEsT0FBTyxFQUFFeUgsa0JBQWtCLENBQUNmO0FBSnJCLE9BQUQsQ0FBUjtBQU1BOztBQUNGLFNBQUtjLFVBQVUsQ0FBQ3pCLGVBQWhCO0FBQ0VoSyxNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSixxQkFEWDtBQUVQcEksUUFBQUEsSUFBSSxFQUFFLFVBRkM7QUFHUDJJLFFBQUFBLE9BQU8sRUFBRSxLQUhGO0FBSVA3RSxRQUFBQSxPQUFPLEVBQUV5SCxrQkFBa0IsQ0FBQ1g7QUFKckIsT0FBRCxDQUFSO0FBTUE7O0FBQ0YsU0FBSyxHQUFMO0FBQ0EsU0FBS1UsVUFBVSxDQUFDMUIsaUJBQWhCO0FBQ0UvSixNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSixxQkFEWDtBQUVQcEksUUFBQUEsSUFBSSxFQUFFLE9BRkM7QUFHUDJJLFFBQUFBLE9BQU8sRUFBRSxLQUhGO0FBSVA3RSxRQUFBQSxPQUFPLEVBQUV5SCxrQkFBa0IsQ0FBQ047QUFKckIsT0FBRCxDQUFSO0FBTUE7O0FBQ0YsU0FBSyxHQUFMLENBeERGOztBQXlERSxTQUFLSyxVQUFVLENBQUMzQixlQUFoQjtBQUNFOUosTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFFBQUFBLElBQUksRUFBRSxVQUZDO0FBR1AySSxRQUFBQSxPQUFPLEVBQUUsS0FIRjtBQUlQN0UsUUFBQUEsT0FBTyxFQUFFeUgsa0JBQWtCLENBQUNQO0FBSnJCLE9BQUQsQ0FBUjtBQU1BOztBQUNGLFNBQUtNLFVBQVUsQ0FBQ3JCLHFCQUFoQjtBQUNFcEssTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFFBQUFBLElBQUksRUFBRSxVQUZDO0FBR1AySSxRQUFBQSxPQUFPLEVBQUUsS0FIRjtBQUlQN0UsUUFBQUEsT0FBTyxFQUFFeUgsa0JBQWtCLENBQUNIO0FBSnJCLE9BQUQsQ0FBUjtBQU1BOztBQUNGLFNBQUtFLFVBQVUsQ0FBQ2xCLGtCQUFoQjtBQUNFdkssTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFFBQUFBLElBQUksRUFBRSxVQUZDO0FBR1AySSxRQUFBQSxPQUFPLEVBQUUsS0FIRjtBQUlQN0UsUUFBQUEsT0FBTyxFQUFFeUgsa0JBQWtCLENBQUNMO0FBSnJCLE9BQUQsQ0FBUjtBQU1BckwsTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFFBQUFBLElBQUksRUFBRSxTQUZDO0FBR1AySSxRQUFBQSxPQUFPLEVBQUUsS0FIRjtBQUlQN0UsUUFBQUEsT0FBTyxFQUFFeUgsa0JBQWtCLENBQUNMO0FBSnJCLE9BQUQsQ0FBUjtBQU1BOztBQUNGO0FBQ0UsYUFBTyxJQUFQO0FBeEZKO0FBMEZEOztBQzlGTSxNQUFNTSxhQUFhLEdBQUcsc0RBQXRCO0FBRUEsTUFBTUMsVUFBVSxHQUFHLHdJQUFuQjtBQUVBLE1BQU1DLGFBQWEsR0FBRywwQkFBdEI7O0FDRkEsU0FBU0MsdUJBQVQsQ0FBaUM7QUFBRTlDLEVBQUFBO0FBQUYsQ0FBakMsRUFBNEM7QUFDakQsUUFBTStDLGVBQWUsR0FBRyxJQUFJQyxNQUFKLENBQVdKLFVBQVgsQ0FBeEI7O0FBRUEsTUFBSUcsZUFBZSxDQUFDRSxJQUFoQixDQUFxQmpELEtBQXJCLENBQUosRUFBaUM7QUFDL0IsV0FBTztBQUNMRixNQUFBQSxPQUFPLEVBQUUsSUFESjtBQUVMN0UsTUFBQUEsT0FBTyxFQUFFO0FBRkosS0FBUDtBQUlELEdBTEQsTUFLTztBQUNMLFdBQU87QUFDTDZFLE1BQUFBLE9BQU8sRUFBRSxLQURKO0FBRUw3RSxNQUFBQSxPQUFPLEVBQUV5SCxrQkFBa0IsQ0FBQ2Q7QUFGdkIsS0FBUDtBQUlEO0FBQ0Y7QUFFTSxTQUFTc0IsMEJBQVQsQ0FBb0M7QUFBRWpELEVBQUFBO0FBQUYsQ0FBcEMsRUFBa0Q7QUFDdkQsUUFBTWtELGtCQUFrQixHQUFHLElBQUlILE1BQUosQ0FBV0wsYUFBWCxDQUEzQjs7QUFDQSxNQUFJUSxrQkFBa0IsQ0FBQ0YsSUFBbkIsQ0FBd0JoRCxRQUF4QixDQUFKLEVBQXVDO0FBQ3JDLFdBQU87QUFDTEgsTUFBQUEsT0FBTyxFQUFFLElBREo7QUFFTDdFLE1BQUFBLE9BQU8sRUFBRTtBQUZKLEtBQVA7QUFJRCxHQUxELE1BS087QUFDTCxXQUFPO0FBQ0w2RSxNQUFBQSxPQUFPLEVBQUUsS0FESjtBQUVMN0UsTUFBQUEsT0FBTyxFQUFFeUgsa0JBQWtCLENBQUNmO0FBRnZCLEtBQVA7QUFJRDtBQUNGO0FBRU0sU0FBU3lCLDBCQUFULENBQW9DO0FBQUVoSCxFQUFBQTtBQUFGLENBQXBDLEVBQWtEO0FBQ3ZELFFBQU1pSCxrQkFBa0IsR0FBRyxJQUFJTCxNQUFKLENBQVdILGFBQVgsQ0FBM0I7O0FBQ0EsTUFBSVEsa0JBQWtCLENBQUNKLElBQW5CLENBQXdCN0csUUFBeEIsQ0FBSixFQUF1QztBQUNyQyxXQUFPO0FBQ0wwRCxNQUFBQSxPQUFPLEVBQUUsSUFESjtBQUVMN0UsTUFBQUEsT0FBTyxFQUFFO0FBRkosS0FBUDtBQUlELEdBTEQsTUFLTztBQUNMLFdBQU87QUFDTDZFLE1BQUFBLE9BQU8sRUFBRSxLQURKO0FBRUw3RSxNQUFBQSxPQUFPLEVBQUV5SCxrQkFBa0IsQ0FBQ1g7QUFGdkIsS0FBUDtBQUlEO0FBQ0Y7QUFFTSxTQUFTdUIsdUJBQVQsQ0FBaUM7QUFBRXRMLEVBQUFBO0FBQUYsQ0FBakMsRUFBNEM7QUFDakQsUUFBTStLLGVBQWUsR0FBRyxJQUFJQyxNQUFKLENBQVdKLFVBQVgsQ0FBeEI7QUFDQSxRQUFNUyxrQkFBa0IsR0FBRyxJQUFJTCxNQUFKLENBQVdILGFBQVgsQ0FBM0I7O0FBRUEsTUFBSUUsZUFBZSxDQUFDRSxJQUFoQixDQUFxQmpMLEtBQXJCLENBQUosRUFBaUM7QUFDL0IsV0FBTztBQUNMOEgsTUFBQUEsT0FBTyxFQUFFLElBREo7QUFFTDdFLE1BQUFBLE9BQU8sRUFBRTtBQUZKLEtBQVA7QUFJRCxHQUxELE1BS08sSUFBSW9JLGtCQUFrQixDQUFDSixJQUFuQixDQUF3QmpMLEtBQXhCLENBQUosRUFBb0M7QUFDekMsV0FBTztBQUNMOEgsTUFBQUEsT0FBTyxFQUFFLElBREo7QUFFTDdFLE1BQUFBLE9BQU8sRUFBRTtBQUZKLEtBQVA7QUFJRCxHQUxNLE1BS0E7QUFDTCxXQUFPO0FBQ0w2RSxNQUFBQSxPQUFPLEVBQUUsS0FESjtBQUVMN0UsTUFBQUEsT0FBTyxFQUFFeUgsa0JBQWtCLENBQUNUO0FBRnZCLEtBQVA7QUFJRDtBQUNGOztBQ2pFTSxlQUFldkMsTUFBZixDQUFzQjtBQUFFMUksRUFBQUEsUUFBRjtBQUFZaEIsRUFBQUE7QUFBWixDQUF0QixFQUEyQztBQUNoRCxRQUFNO0FBQUVnSyxJQUFBQSxLQUFGO0FBQVNDLElBQUFBLFFBQVQ7QUFBbUI3RCxJQUFBQTtBQUFuQixNQUFnQ3BHLEtBQXRDOztBQUNBLE1BQUk7QUFDRixVQUFNdU4sUUFBUSxHQUFHLE1BQU01TyxLQUFLLENBQUUsY0FBRixFQUFpQjtBQUMzQzZPLE1BQUFBLElBQUksRUFBRWpNLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUV5SSxRQUFBQSxRQUFGO0FBQVlELFFBQUFBLEtBQVo7QUFBbUI1RCxRQUFBQTtBQUFuQixPQUFmLENBRHFDO0FBRTNDcUgsTUFBQUEsT0FBTyxFQUFFO0FBQ1BDLFFBQUFBLFdBQVcsRUFBRSxrQkFETjtBQUVQQyxRQUFBQSxNQUFNLEVBQUU7QUFGRCxPQUZrQztBQU0zQ0MsTUFBQUEsTUFBTSxFQUFFO0FBTm1DLEtBQWpCLENBQTVCO0FBUUEsVUFBTUMsTUFBTSxHQUFHLE1BQU1OLFFBQVEsQ0FBQ08sSUFBVCxFQUFyQjs7QUFDQSxRQUFJUCxRQUFRLENBQUM3QixNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCLFlBQU07QUFBRXBCLFFBQUFBLEtBQUY7QUFBU2xFLFFBQUFBLFFBQVQ7QUFBbUI0RCxRQUFBQTtBQUFuQixVQUE2QjZELE1BQW5DO0FBRUE3TSxNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMrSSxjQURYO0FBRVA0QixRQUFBQSxJQUFJLEVBQUU7QUFBRUYsVUFBQUEsS0FBRjtBQUFTbEUsVUFBQUEsUUFBVDtBQUFtQjRELFVBQUFBO0FBQW5CO0FBRkMsT0FBRCxDQUFSO0FBS0ErRCxNQUFBQSxNQUFNLENBQUMxTSxZQUFQLENBQW9CQyxPQUFwQixDQUNFLFFBREYsRUFFRUMsSUFBSSxDQUFDQyxTQUFMLENBQWU7QUFDYjhJLFFBQUFBLEtBRGE7QUFFYmxFLFFBQUFBLFFBRmE7QUFHYjRELFFBQUFBO0FBSGEsT0FBZixDQUZGO0FBUUQsS0FoQkQsTUFnQk8sSUFBSXVELFFBQVEsQ0FBQzdCLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDbEMsWUFBTTtBQUFFc0MsUUFBQUE7QUFBRixVQUFhSCxNQUFuQjtBQUVBRyxNQUFBQSxNQUFNLENBQUM1RixPQUFQLENBQWdCaEUsS0FBRCxJQUFXO0FBQ3hCb0ksUUFBQUEsZ0JBQWdCLENBQUM7QUFBRWQsVUFBQUEsTUFBTSxFQUFFdEgsS0FBVjtBQUFpQnBELFVBQUFBO0FBQWpCLFNBQUQsQ0FBaEI7QUFDRCxPQUZEO0FBR0FBLE1BQUFBLFFBQVEsQ0FBQztBQUFFZCxRQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ2dKO0FBQXBCLE9BQUQsQ0FBUjtBQUNELEtBUE0sTUFPQSxJQUFJMEUsUUFBUSxDQUFDN0IsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNO0FBQUV0SCxRQUFBQTtBQUFGLFVBQVl5SixNQUFsQjtBQUNBN00sTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDeUoscUJBQXBCO0FBQTJDbEYsUUFBQUE7QUFBM0MsT0FBRCxDQUFSO0FBQ0FwRCxNQUFBQSxRQUFRLENBQUM7QUFBRWQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNnSjtBQUFwQixPQUFELENBQVI7QUFDRDtBQUNGLEdBdENELENBc0NFLE9BQU96RSxLQUFQLEVBQWM7QUFHZHBELElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3lKLHFCQUFwQjtBQUEyQ2xGLE1BQUFBO0FBQTNDLEtBQUQsQ0FBUjtBQUNBcEQsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDZ0o7QUFBcEIsS0FBRCxDQUFSO0FBQ0Q7QUFDRjtBQUVNLGVBQWVZLEtBQWYsQ0FBcUI7QUFBRXpJLEVBQUFBLFFBQUY7QUFBWWhCLEVBQUFBLEtBQVo7QUFBbUJpTyxFQUFBQTtBQUFuQixDQUFyQixFQUF3RDtBQUM3RCxNQUFJO0FBQ0YsVUFBTTtBQUFFOUQsTUFBQUEsZUFBRjtBQUFtQkYsTUFBQUE7QUFBbkIsUUFBZ0NqSyxLQUF0QztBQUVBLFVBQU11TixRQUFRLEdBQUcsTUFBTTVPLEtBQUssQ0FBRSxhQUFGLEVBQWdCO0FBQzFDOE8sTUFBQUEsT0FBTyxFQUFFO0FBQ1AsdUJBQWUsa0JBRFI7QUFFUCx3Q0FBZ0MsR0FGekI7QUFHUFMsUUFBQUEsYUFBYSxFQUFHLFNBQVFDLElBQUksQ0FBRSxHQUFFaEUsZUFBZ0IsSUFBR0YsUUFBUyxFQUFoQyxDQUFtQztBQUh4RCxPQURpQztBQU0xQzJELE1BQUFBLE1BQU0sRUFBRTtBQU5rQyxLQUFoQixDQUE1QjtBQVNBLFVBQU1DLE1BQU0sR0FBRyxNQUFNTixRQUFRLENBQUNPLElBQVQsRUFBckI7O0FBRUEsUUFBSVAsUUFBUSxDQUFDN0IsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQixZQUFNO0FBQUVwQixRQUFBQSxLQUFGO0FBQVNsRSxRQUFBQSxRQUFUO0FBQW1CNEQsUUFBQUE7QUFBbkIsVUFBNkI2RCxNQUFuQztBQUVBN00sTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMkksYUFEWDtBQUVQZ0MsUUFBQUEsSUFBSSxFQUFFO0FBQUVGLFVBQUFBLEtBQUY7QUFBU2xFLFVBQUFBLFFBQVQ7QUFBbUI0RCxVQUFBQTtBQUFuQjtBQUZDLE9BQUQsQ0FBUjtBQUlBK0QsTUFBQUEsTUFBTSxDQUFDMU0sWUFBUCxDQUFvQkMsT0FBcEIsQ0FDRSxRQURGLEVBRUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQ2I4SSxRQUFBQSxLQURhO0FBRWJsRSxRQUFBQSxRQUZhO0FBR2I0RCxRQUFBQTtBQUhhLE9BQWYsQ0FGRjtBQVFELEtBZkQsTUFlTyxJQUFJdUQsUUFBUSxDQUFDN0IsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNO0FBQUVzQyxRQUFBQTtBQUFGLFVBQWFILE1BQW5CO0FBRUFHLE1BQUFBLE1BQU0sQ0FBQzVGLE9BQVAsQ0FBZ0JoRSxLQUFELElBQVc7QUFDeEJvSSxRQUFBQSxnQkFBZ0IsQ0FBQztBQUFFZCxVQUFBQSxNQUFNLEVBQUV0SCxLQUFWO0FBQWlCcEQsVUFBQUE7QUFBakIsU0FBRCxDQUFoQjtBQUNELE9BRkQ7QUFHQUEsTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDNEk7QUFBcEIsT0FBRCxDQUFSO0FBQ0QsS0FQTSxNQU9BLElBQUk4RSxRQUFRLENBQUM3QixNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQ2xDLFlBQU07QUFBRXRILFFBQUFBO0FBQUYsVUFBWXlKLE1BQWxCO0FBQ0E3TSxNQUFBQSxRQUFRLENBQUM7QUFBRWQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUN5SixxQkFBcEI7QUFBMkNsRixRQUFBQTtBQUEzQyxPQUFELENBQVI7QUFDQXBELE1BQUFBLFFBQVEsQ0FBQztBQUFFZCxRQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzRJO0FBQXBCLE9BQUQsQ0FBUjtBQUNEO0FBQ0YsR0F6Q0QsQ0F5Q0UsT0FBT3JFLEtBQVAsRUFBYztBQUNkcEQsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDeUoscUJBQXBCO0FBQTJDbEYsTUFBQUE7QUFBM0MsS0FBRCxDQUFSO0FBQ0FwRCxJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUM0STtBQUFwQixLQUFELENBQVI7QUFDRDtBQUNGO0FBQ00sZUFBZWtCLGNBQWYsQ0FBOEI7QUFBRTNJLEVBQUFBLFFBQUY7QUFBWWhCLEVBQUFBO0FBQVosQ0FBOUIsRUFBbUQ7QUFDeEQsTUFBSTtBQUNGLFVBQU07QUFBRWtLLE1BQUFBLE9BQUY7QUFBV0QsTUFBQUE7QUFBWCxRQUF3QmpLLEtBQTlCO0FBQ0EsVUFBTTtBQUFFc0ssTUFBQUE7QUFBRixRQUFZdEssS0FBSyxDQUFDd0ssSUFBeEI7QUFFQSxVQUFNK0MsUUFBUSxHQUFHLE1BQU01TyxLQUFLLENBQUUsa0JBQUYsRUFBcUI7QUFDL0NpUCxNQUFBQSxNQUFNLEVBQUUsS0FEdUM7QUFFL0NKLE1BQUFBLElBQUksRUFBRWpNLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQ25CMEksUUFBQUEsT0FEbUI7QUFFbkJELFFBQUFBLFFBRm1CO0FBR25CSyxRQUFBQTtBQUhtQixPQUFmO0FBRnlDLEtBQXJCLENBQTVCO0FBU0EsVUFBTXVELE1BQU0sR0FBRyxNQUFNTixRQUFRLENBQUNPLElBQVQsRUFBckI7O0FBQ0EsUUFBSVAsUUFBUSxDQUFDN0IsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQixZQUFNO0FBQUVwQixRQUFBQSxLQUFGO0FBQVNsRSxRQUFBQSxRQUFUO0FBQW1CNEQsUUFBQUE7QUFBbkIsVUFBNkI2RCxNQUFuQztBQUVBN00sTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDa0osdUJBRFg7QUFFUHlCLFFBQUFBLElBQUksRUFBRTtBQUFFRixVQUFBQSxLQUFGO0FBQVNsRSxVQUFBQSxRQUFUO0FBQW1CNEQsVUFBQUE7QUFBbkI7QUFGQyxPQUFELENBQVI7QUFLQStELE1BQUFBLE1BQU0sQ0FBQzFNLFlBQVAsQ0FBb0JDLE9BQXBCLENBQ0UsUUFERixFQUVFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUNiOEksUUFBQUEsS0FEYTtBQUVibEUsUUFBQUEsUUFGYTtBQUdiNEQsUUFBQUE7QUFIYSxPQUFmLENBRkY7QUFRRCxLQWhCRCxNQWdCTyxJQUFJdUQsUUFBUSxDQUFDN0IsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNO0FBQUVzQyxRQUFBQTtBQUFGLFVBQWFILE1BQW5CO0FBRUFHLE1BQUFBLE1BQU0sQ0FBQzVGLE9BQVAsQ0FBZ0JoRSxLQUFELElBQVc7QUFDeEJvSSxRQUFBQSxnQkFBZ0IsQ0FBQztBQUFFZCxVQUFBQSxNQUFNLEVBQUV0SCxLQUFWO0FBQWlCcEQsVUFBQUE7QUFBakIsU0FBRCxDQUFoQjtBQUNELE9BRkQ7QUFHQUEsTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDbUo7QUFEWCxPQUFELENBQVI7QUFHRCxLQVRNLE1BU0EsSUFBSXVFLFFBQVEsQ0FBQzdCLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDbEMsWUFBTTtBQUFFdEgsUUFBQUE7QUFBRixVQUFZeUosTUFBbEI7QUFDQTdNLE1BQUFBLFFBQVEsQ0FBQztBQUFFZCxRQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3lKLHFCQUFwQjtBQUEyQ2xGLFFBQUFBO0FBQTNDLE9BQUQsQ0FBUjtBQUNBcEQsTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDbUo7QUFEWCxPQUFELENBQVI7QUFHRDtBQUNGLEdBOUNELENBOENFLE9BQU81RSxLQUFQLEVBQWM7QUFDZHBELElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3lKLHFCQUFwQjtBQUEyQ2xGLE1BQUFBO0FBQTNDLEtBQUQsQ0FBUjtBQUNBcEQsSUFBQUEsUUFBUSxDQUFDO0FBQ1BkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDbUo7QUFEWCxLQUFELENBQVI7QUFHRDtBQUNGO0FBRU0sZUFBZW9GLGNBQWYsQ0FBOEI7QUFBRXBOLEVBQUFBLFFBQUY7QUFBWWhCLEVBQUFBO0FBQVosQ0FBOUIsRUFBbUQ7QUFDeEQsTUFBSTtBQUNGLFVBQU07QUFBRWdLLE1BQUFBO0FBQUYsUUFBWWhLLEtBQWxCO0FBQ0EsVUFBTXVOLFFBQVEsR0FBRyxNQUFNNU8sS0FBSyxDQUFFLHlCQUFGLEVBQTRCO0FBQ3REaVAsTUFBQUEsTUFBTSxFQUFFLE1BRDhDO0FBRXRESixNQUFBQSxJQUFJLEVBQUVqTSxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUFFd0ksUUFBQUE7QUFBRixPQUFmO0FBRmdELEtBQTVCLENBQTVCOztBQUtBLFFBQUl1RCxRQUFRLENBQUM3QixNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCLFlBQU1tQyxNQUFNLEdBQUcsTUFBTU4sUUFBUSxDQUFDTyxJQUFULEVBQXJCO0FBRUE5TSxNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNxSiwyQkFEWDtBQUVQb0IsUUFBQUEsS0FBSyxFQUFFdUQsTUFBTSxDQUFDdkQ7QUFGUCxPQUFELENBQVI7QUFJRCxLQVBELE1BT08sSUFBSWlELFFBQVEsQ0FBQzdCLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDbEMsWUFBTW1DLE1BQU0sR0FBRyxNQUFNTixRQUFRLENBQUNPLElBQVQsRUFBckI7QUFFQSxZQUFNO0FBQUVFLFFBQUFBO0FBQUYsVUFBYUgsTUFBbkI7QUFDQUcsTUFBQUEsTUFBTSxDQUFDNUYsT0FBUCxDQUFnQmhFLEtBQUQsSUFBVztBQUN4Qm9JLFFBQUFBLGdCQUFnQixDQUFDO0FBQUVkLFVBQUFBLE1BQU0sRUFBRXRILEtBQVY7QUFBaUJwRCxVQUFBQTtBQUFqQixTQUFELENBQWhCO0FBQ0QsT0FGRDtBQUdBQSxNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNzSjtBQURYLE9BQUQsQ0FBUjtBQUdELEtBVk0sTUFVQSxJQUFJb0UsUUFBUSxDQUFDN0IsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNO0FBQUV0SCxRQUFBQTtBQUFGLFVBQVl5SixNQUFsQjtBQUNBN00sTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDeUoscUJBQXBCO0FBQTJDbEYsUUFBQUE7QUFBM0MsT0FBRCxDQUFSO0FBQ0FwRCxNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNzSjtBQURYLE9BQUQsQ0FBUjtBQUdEO0FBQ0YsR0EvQkQsQ0ErQkUsT0FBTy9FLEtBQVAsRUFBYztBQUdkcEQsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDeUoscUJBQXBCO0FBQTJDbEYsTUFBQUE7QUFBM0MsS0FBRCxDQUFSO0FBQ0FwRCxJQUFBQSxRQUFRLENBQUM7QUFDUGQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNzSjtBQURYLEtBQUQsQ0FBUjtBQUdEO0FBQ0Y7O0FDOUxjLFNBQVNrRixlQUFULENBQXlCO0FBQUV4TixFQUFBQSxRQUFGO0FBQVliLEVBQUFBLEtBQVo7QUFBbUJnQixFQUFBQTtBQUFuQixDQUF6QixFQUF3RDtBQUNyRSxRQUFNO0FBQUV5SSxXQUFBQSxPQUFGO0FBQVNDLFlBQUFBLFFBQVQ7QUFBaUJDLG9CQUFBQSxnQkFBakI7QUFBaUNDLElBQUFBO0FBQWpDLE1BQXVENUosS0FBN0Q7QUFFQTZCLEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSTRILE9BQUosRUFBVztBQUNUNkUsTUFBQUEsS0FBQSxDQUFjO0FBQUV0TixRQUFBQSxRQUFGO0FBQVloQixRQUFBQTtBQUFaLE9BQWQ7QUFDRDtBQUNGLEdBSlEsRUFJTixDQUFDeUosT0FBRCxDQUpNLENBQVQ7QUFNQTVILEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSTZILFFBQUosRUFBWTtBQUNWNEUsTUFBQUEsTUFBQSxDQUFlO0FBQUV0TixRQUFBQSxRQUFGO0FBQVloQixRQUFBQTtBQUFaLE9BQWY7QUFDRDtBQUNGLEdBSlEsRUFJTixDQUFDMEosUUFBRCxDQUpNLENBQVQ7QUFNQTdILEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSThILGdCQUFKLEVBQW9CO0FBQ2xCMkUsTUFBQUEsY0FBQSxDQUF1QjtBQUFFdE4sUUFBQUEsUUFBRjtBQUFZaEIsUUFBQUE7QUFBWixPQUF2QjtBQUNEO0FBQ0YsR0FKUSxFQUlOLENBQUMySixnQkFBRCxDQUpNLENBQVQ7QUFNQTlILEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSStILGlCQUFKLEVBQXVCO0FBQ3JCMEUsTUFBQUEsY0FBQSxDQUF1QjtBQUFFdE4sUUFBQUEsUUFBRjtBQUFZaEIsUUFBQUE7QUFBWixPQUF2QjtBQUNEO0FBQ0YsR0FKUSxFQUlOLENBQUM0SixpQkFBRCxDQUpNLENBQVQ7QUFLQSxTQUFPL0ksUUFBUDtBQUNEOztBQzNCYyxTQUFTME4sV0FBVCxDQUFxQjNOLEtBQXJCLEVBQTRCO0FBQ3pDLEVBRW9EO0FBQ2xELFdBQU8sRUFBQzROLGVBQUQsRUFBb0I1TixLQUFwQixDQUFQO0FBQ0Q7QUFHRjs7QUNQRCxNQUFNNk4sV0FBVyxHQUFHbk8sQ0FBYSxFQUFqQztBQUVPLFNBQVNvTyxjQUFULEdBQTBCO0FBQy9CLFFBQU1sTyxPQUFPLEdBQUdDLEdBQVUsQ0FBQ2dPLFdBQUQsQ0FBMUI7O0FBQ0EsTUFBSSxDQUFDak8sT0FBTCxFQUFjO0FBQ1osVUFBTSxJQUFJRSxLQUFKLENBQVUsOENBQVYsQ0FBTjtBQUNEOztBQUVELFFBQU0sQ0FBQ1YsS0FBRCxFQUFRZ0IsUUFBUixJQUFvQlIsT0FBMUI7QUFFQSxTQUFPO0FBQ0xSLElBQUFBLEtBREs7QUFFTGdCLElBQUFBO0FBRkssR0FBUDtBQUlEO0FBRWMsU0FBUzJOLFlBQVQsQ0FBc0IvTixLQUF0QixFQUE2QjtBQUMxQyxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBZUQsS0FBckI7QUFDQSxRQUFNLENBQUNaLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JZLEdBQVUsQ0FBQzhJLFdBQUQsRUFBYy9JLFdBQWQsQ0FBcEM7QUFDQSxRQUFNSyxLQUFLLEdBQUdDLEdBQU8sQ0FBQyxNQUFNLENBQUNqQyxLQUFELEVBQVFnQixRQUFSLENBQVAsRUFBMEIsQ0FBQ2hCLEtBQUQsQ0FBMUIsQ0FBckI7QUFDQSxTQUNFLEVBQUMsV0FBRCxDQUFhLFFBQWI7QUFBc0IsSUFBQSxLQUFLLEVBQUVnQztBQUE3QixLQUF3Q3BCLEtBQXhDLEdBQ0UsRUFBQyxXQUFEO0FBQWEsSUFBQSxLQUFLLEVBQUVaLEtBQXBCO0FBQTJCLElBQUEsUUFBUSxFQUFFZ0I7QUFBckMsS0FDR0gsUUFESCxDQURGLENBREY7QUFPRDs7QUM1Qk0sU0FBUytOLFdBQVQsR0FBdUI7QUFDNUIsUUFBTSxDQUFDQyxRQUFELEVBQVdDLFdBQVgsSUFBMEJDLEdBQVEsQ0FBQyxJQUFELENBQXhDO0FBQ0EsUUFBTSxDQUFDekUsS0FBRCxFQUFRMEUsUUFBUixJQUFvQkQsR0FBUSxDQUFDLElBQUQsQ0FBbEM7QUFDQSxRQUFNLENBQUMvRSxLQUFELEVBQVFpRixRQUFSLElBQW9CRixHQUFRLENBQUMsRUFBRCxDQUFsQztBQUNBLFFBQU0sQ0FBQ0csUUFBRCxFQUFXQyxXQUFYLElBQTBCSixHQUFRLENBQUMsSUFBRCxDQUF4QztBQUNBLFFBQU07QUFBRS9PLElBQUFBLEtBQUY7QUFBU2dCLElBQUFBO0FBQVQsTUFBc0IwTixjQUFjLEVBQTFDO0FBQ0E3TSxFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkLFFBQUlrTSxNQUFNLENBQUMxTSxZQUFQLENBQW9CUyxPQUFwQixDQUE0QixRQUE1QixDQUFKLEVBQTJDO0FBQ3pDLFlBQU07QUFBRXNFLFFBQUFBLFFBQUY7QUFBWWtFLFFBQUFBLEtBQVo7QUFBbUJOLFFBQUFBLEtBQW5CO0FBQTBCa0YsUUFBQUE7QUFBMUIsVUFBdUMzTixJQUFJLENBQUNRLEtBQUwsQ0FDM0NnTSxNQUFNLENBQUMxTSxZQUFQLENBQW9CUyxPQUFwQixDQUE0QixRQUE1QixDQUQyQyxDQUE3QztBQUdBZ04sTUFBQUEsV0FBVyxDQUFDMUksUUFBRCxDQUFYO0FBQ0E0SSxNQUFBQSxRQUFRLENBQUMxRSxLQUFELENBQVI7QUFDQTJFLE1BQUFBLFFBQVEsQ0FBQ2pGLEtBQUQsQ0FBUjtBQUNBbUYsTUFBQUEsV0FBVyxDQUFDRCxRQUFELENBQVg7QUFDQWxPLE1BQUFBLFFBQVEsQ0FBQztBQUNQZCxRQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3dKLHdCQURYO0FBRVBtQixRQUFBQSxJQUFJLEVBQUU7QUFBRXBFLFVBQUFBLFFBQUY7QUFBWWtFLFVBQUFBLEtBQVo7QUFBbUJOLFVBQUFBLEtBQW5CO0FBQTBCa0YsVUFBQUE7QUFBMUI7QUFGQyxPQUFELENBQVI7QUFJRDtBQUNGLEdBZFEsRUFjTixFQWRNLENBQVQ7QUFnQkFyTixFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkLFFBQUk3QixLQUFLLENBQUN3SyxJQUFOLElBQWN4SyxLQUFLLENBQUN3SyxJQUFOLENBQVdGLEtBQTdCLEVBQW9DO0FBQ2xDLFlBQU07QUFBRWxFLFFBQUFBLFFBQUY7QUFBWTRELFFBQUFBLEtBQVo7QUFBbUJNLFFBQUFBLEtBQW5CO0FBQTBCNEUsUUFBQUE7QUFBMUIsVUFBdUNsUCxLQUFLLENBQUN3SyxJQUFuRDtBQUVBc0UsTUFBQUEsV0FBVyxDQUFDMUksUUFBRCxDQUFYO0FBQ0E0SSxNQUFBQSxRQUFRLENBQUMxRSxLQUFELENBQVI7QUFDQTJFLE1BQUFBLFFBQVEsQ0FBQ2pGLEtBQUQsQ0FBUjtBQUNBbUYsTUFBQUEsV0FBVyxDQUFDRCxRQUFELENBQVg7QUFDRDtBQUNGLEdBVFEsRUFTTixDQUFDbFAsS0FBSyxDQUFDd0ssSUFBUCxDQVRNLENBQVQ7QUFXQTNJLEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSTdCLEtBQUssSUFBSUEsS0FBSyxDQUFDd0ssSUFBTixLQUFlLElBQTVCLEVBQWtDO0FBQ2hDc0UsTUFBQUEsV0FBVyxDQUFDLElBQUQsQ0FBWDtBQUNBRSxNQUFBQSxRQUFRLENBQUMsSUFBRCxDQUFSO0FBQ0FDLE1BQUFBLFFBQVEsQ0FBQyxJQUFELENBQVI7QUFDQUUsTUFBQUEsV0FBVyxDQUFDLElBQUQsQ0FBWDtBQUNEO0FBQ0YsR0FQUSxFQU9OLENBQUNuUCxLQUFELENBUE0sQ0FBVDtBQVNBLFNBQU87QUFBRW9HLElBQUFBLFFBQVEsRUFBRXlJLFFBQVo7QUFBc0J2RSxJQUFBQSxLQUF0QjtBQUE2Qk4sSUFBQUE7QUFBN0IsR0FBUDtBQUNEOztBQzlDRDtBQUNPLE1BQU1vRixjQUFjLEdBQUc7QUFDNUJDLEVBQUFBLE1BQU0sRUFBRSxRQURvQjtBQUU1QkMsRUFBQUEsTUFBTSxFQUFFLFFBRm9CO0FBRzVCQyxFQUFBQSxPQUFPLEVBQUUsU0FIbUI7QUFJNUJDLEVBQUFBLEtBQUssRUFBRSxPQUpxQjtBQUs1QkMsRUFBQUEsT0FBTyxFQUFFLFNBTG1CO0FBTTVCQyxFQUFBQSxPQUFPLEVBQUUsU0FObUI7QUFPNUJDLEVBQUFBLE1BQU0sRUFBRSxRQVBvQjtBQVE1QjFKLEVBQUFBLElBQUksRUFBRTtBQVJzQixDQUF2Qjs7QUNNUCxNQUFNMkosY0FBYyxHQUFHdFAsQ0FBYSxFQUFwQztBQUNPLFNBQVN1UCxpQkFBVCxHQUE2QjtBQUNsQyxRQUFNclAsT0FBTyxHQUFHQyxHQUFVLENBQUNtUCxjQUFELENBQTFCOztBQUNBLE1BQUksQ0FBQ3BQLE9BQUwsRUFBYztBQUNaLFVBQU0sSUFBSUUsS0FBSixDQUFVLHNEQUFWLENBQU47QUFDRDs7QUFFRCxTQUFPRixPQUFQO0FBQ0Q7QUFFYyxTQUFTc1AsZ0JBQVQsQ0FBMEJsUCxLQUExQixFQUFpQztBQUM5QyxRQUFNO0FBQUV3RixJQUFBQSxRQUFGO0FBQVlrRSxJQUFBQTtBQUFaLE1BQXNCc0UsV0FBVyxFQUF2QztBQUVBLFFBQU0sQ0FBQzVPLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JZLEdBQVUsQ0FBQzdCLFNBQUQsRUFBVTRCLFNBQVYsQ0FBcEM7QUFDQSxRQUFNO0FBQUVxQyxJQUFBQSxPQUFGO0FBQVdpQixJQUFBQTtBQUFYLE1BQXVCakYsS0FBN0I7QUFDQSxRQUFNK1AsYUFBYSxHQUFHbEksVUFBVSxDQUFDO0FBQy9CNUMsSUFBQUEsT0FEK0I7QUFFL0JtQixJQUFBQSxRQUYrQjtBQUcvQnBGLElBQUFBLFFBSCtCO0FBSS9COEcsSUFBQUEsY0FBYyxFQUFFOUQ7QUFKZSxHQUFELENBQWhDO0FBT0FuQyxFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkLFFBQUltQyxPQUFKLEVBQWE7QUFDWCxjQUFRQSxPQUFPLENBQUNoRSxLQUFoQjtBQUNFLGFBQUssVUFBTDtBQUNBLGFBQUssVUFBTDtBQUNBLGFBQUssU0FBTDtBQUNBLGFBQUssV0FBTDtBQUNBLGFBQUssV0FBTDtBQUNFO0FBQ0FnQixVQUFBQSxRQUFRLENBQUM7QUFDUGQsWUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUM2Qyx1QkFEWDtBQUVQc0MsWUFBQUEsY0FBYyxFQUFFLEVBQUUsR0FBR2hCLE9BQUw7QUFBY2dNLGNBQUFBLE9BQU8sRUFBRVosY0FBYyxDQUFDbko7QUFBdEM7QUFGVCxXQUFELENBQVI7QUFQSjtBQWNEO0FBQ0YsR0FqQlEsRUFpQk4sQ0FBQ2pDLE9BQUQsQ0FqQk0sQ0FBVDtBQW1CQW5DLEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSSxDQUFDdUUsUUFBTCxFQUFlO0FBQ2JwRixNQUFBQSxRQUFRLENBQUM7QUFBRWQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNpRTtBQUFwQixPQUFELENBQVI7QUFDRDtBQUNGLEdBSlEsRUFJTixDQUFDc0MsUUFBRCxDQUpNLENBQVQ7QUFLQXZFLEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsVUFBTW9PLGdCQUFnQixHQUFJLEdBQUU3SixRQUFTLGtCQUFyQztBQUNBLFVBQU1uQyxjQUFjLEdBQUcxQyxJQUFJLENBQUNRLEtBQUwsQ0FBV1YsWUFBWSxDQUFDUyxPQUFiLENBQXFCbU8sZ0JBQXJCLENBQVgsQ0FBdkI7O0FBQ0EsUUFBSWhNLGNBQWMsSUFBSUEsY0FBYyxDQUFDK0MsTUFBZixHQUF3QixDQUE5QyxFQUFpRDtBQUMvQ2hHLE1BQUFBLFFBQVEsQ0FBQztBQUFFZCxRQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzBELHVCQUFwQjtBQUE2Q1UsUUFBQUE7QUFBN0MsT0FBRCxDQUFSO0FBQ0Q7O0FBQ0QsVUFBTXFDLFVBQVUsR0FBSSxHQUFFRixRQUFTLFdBQS9CO0FBQ0EsVUFBTXJDLFFBQVEsR0FBR3hDLElBQUksQ0FBQ1EsS0FBTCxDQUFXVixZQUFZLENBQUNTLE9BQWIsQ0FBcUJ3RSxVQUFyQixDQUFYLENBQWpCOztBQUVBLFFBQUksQ0FBQ3ZDLFFBQUwsRUFBZTtBQUNiL0MsTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDcUM7QUFBcEIsT0FBRCxDQUFSO0FBQ0Q7QUFDRixHQVpRLEVBWU4sRUFaTSxDQUFUO0FBY0EsUUFBTUYsS0FBSyxHQUFHQyxHQUFPLENBQUMsTUFBTSxDQUFDakMsS0FBRCxFQUFRZ0IsUUFBUixDQUFQLEVBQTBCLENBQUNoQixLQUFELENBQTFCLENBQXJCO0FBQ0EsU0FBTyxFQUFDLGNBQUQsQ0FBZ0IsUUFBaEI7QUFBeUIsSUFBQSxLQUFLLEVBQUVnQztBQUFoQyxLQUEyQ3BCLEtBQTNDLEVBQVA7QUFDRDs7QUNsRU0sU0FBU3NQLE9BQVQsR0FBbUI7QUFDeEIsUUFBTTtBQUFFbFEsSUFBQUEsS0FBRjtBQUFTZ0IsSUFBQUE7QUFBVCxNQUFzQjBOLGNBQWMsRUFBMUM7O0FBQ0EsV0FBU3lCLFFBQVQsQ0FBa0JoUixDQUFsQixFQUFxQjtBQUNuQixVQUFNO0FBQUVnQyxNQUFBQSxJQUFGO0FBQVFhLE1BQUFBO0FBQVIsUUFBa0I3QyxDQUFDLENBQUNpUixNQUExQjtBQUNBcFAsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDeUksYUFBcEI7QUFBbUNuSCxNQUFBQSxJQUFuQztBQUF5Q2EsTUFBQUE7QUFBekMsS0FBRCxDQUFSO0FBQ0Q7O0FBQ0QsV0FBU3FPLE9BQVQsR0FBbUI7QUFDakIsUUFBSXBHLFFBQVEsS0FBSyxFQUFqQixFQUFxQjtBQUNuQmpKLE1BQUFBLFFBQVEsQ0FBQztBQUNQZCxRQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzBKLHFCQURYO0FBRVBwSSxRQUFBQSxJQUFJLEVBQUUsVUFGQztBQUdQMkksUUFBQUEsT0FBTyxFQUFFLEtBSEY7QUFJUDdFLFFBQUFBLE9BQU8sRUFBRTtBQUpGLE9BQUQsQ0FBUjtBQU1ELEtBUEQsTUFPTztBQUNMakUsTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFFBQUFBLElBQUksRUFBRSxVQUZDO0FBR1AySSxRQUFBQSxPQUFPLEVBQUUsSUFIRjtBQUlQN0UsUUFBQUEsT0FBTyxFQUFFO0FBSkYsT0FBRCxDQUFSO0FBTUQ7O0FBQ0RqRSxJQUFBQSxRQUFRLENBQUM7QUFDUGQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSixxQkFEWDtBQUVQcEksTUFBQUEsSUFBSSxFQUFFLGlCQUZDO0FBR1AsU0FBR21QLHVCQUFBLENBQTJCO0FBQUV0TyxRQUFBQSxLQUFLLEVBQUVtSTtBQUFULE9BQTNCO0FBSEksS0FBRCxDQUFSO0FBS0FuSixJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSTtBQUFwQixLQUFELENBQVI7QUFDRDs7QUFDRCxXQUFTZ0ksUUFBVCxHQUFvQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQXZQLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzhJO0FBQXBCLEtBQUQsQ0FBUjtBQUNEOztBQUNELFdBQVM2SCx1QkFBVCxHQUFtQztBQUNqQ3hQLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ29KO0FBQXBCLEtBQUQsQ0FBUjtBQUNEOztBQUNELFdBQVN3SCxnQkFBVCxHQUE0QjtBQUMxQnpQLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ2lKO0FBQXBCLEtBQUQsQ0FBUjtBQUNEOztBQUVELFdBQVM0SCxTQUFULEdBQXFCO0FBQ25CclAsSUFBQUEsWUFBWSxDQUFDdUcsVUFBYixDQUF3QixRQUF4QjtBQUNBNUcsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDNkk7QUFBcEIsS0FBRCxDQUFSO0FBQ0Q7O0FBQ0QsV0FBU2lJLFdBQVQsQ0FBcUJ4UixDQUFyQixFQUF3QjtBQUN0QixVQUFNO0FBQUVnTCxNQUFBQSxlQUFGO0FBQW1CRixNQUFBQTtBQUFuQixRQUFnQ2pLLEtBQXRDO0FBQ0EsVUFBTTtBQUFFbUIsTUFBQUE7QUFBRixRQUFXaEMsQ0FBQyxDQUFDaVIsTUFBbkI7O0FBRUEsWUFBUWpQLElBQVI7QUFDRSxXQUFLLFVBQUw7QUFDRSxZQUFJOEksUUFBUSxLQUFLLEVBQWpCLEVBQXFCO0FBQ25CakosVUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFlBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFlBQUFBLElBQUksRUFBRSxVQUZDO0FBR1AySSxZQUFBQSxPQUFPLEVBQUUsS0FIRjtBQUlQN0UsWUFBQUEsT0FBTyxFQUFFO0FBSkYsV0FBRCxDQUFSO0FBTUQsU0FQRCxNQU9PO0FBQ0xqRSxVQUFBQSxRQUFRLENBQUM7QUFDUGQsWUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSixxQkFEWDtBQUVQcEksWUFBQUEsSUFBSSxFQUFFLFVBRkM7QUFHUDJJLFlBQUFBLE9BQU8sRUFBRSxJQUhGO0FBSVA3RSxZQUFBQSxPQUFPLEVBQUU7QUFKRixXQUFELENBQVI7QUFNRDs7QUFDRDs7QUFDRixXQUFLLGlCQUFMO0FBQ0VqRSxRQUFBQSxRQUFRLENBQUM7QUFDUGQsVUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSixxQkFEWDtBQUVQcEksVUFBQUEsSUFBSSxFQUFFLGlCQUZDO0FBR1AsYUFBR21QLHVCQUFBLENBQTJCO0FBQUV0TyxZQUFBQSxLQUFLLEVBQUVtSTtBQUFULFdBQTNCO0FBSEksU0FBRCxDQUFSO0FBS0E7O0FBQ0Y7QUFDRSxjQUFNLElBQUl6SixLQUFKLENBQVUsbUJBQVYsQ0FBTjtBQTFCSjtBQTRCRDs7QUFFRCxXQUFTa1EsWUFBVCxDQUFzQnpSLENBQXRCLEVBQXlCO0FBQ3ZCLFVBQU07QUFBRTZLLE1BQUFBLEtBQUY7QUFBUzVELE1BQUFBLFFBQVQ7QUFBbUI2RCxNQUFBQTtBQUFuQixRQUFnQ2pLLEtBQXRDO0FBQ0EsVUFBTTtBQUFFbUIsTUFBQUE7QUFBRixRQUFXaEMsQ0FBQyxDQUFDaVIsTUFBbkI7O0FBRUEsWUFBUWpQLElBQVI7QUFDRSxXQUFLLFVBQUw7QUFDRUgsUUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFVBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEoscUJBRFg7QUFFUHBJLFVBQUFBLElBQUksRUFBRSxVQUZDO0FBR1AsYUFBR21QLDBCQUFBLENBQThCO0FBQUVyRyxZQUFBQTtBQUFGLFdBQTlCO0FBSEksU0FBRCxDQUFSO0FBS0E7O0FBQ0YsV0FBSyxPQUFMO0FBQ0VqSixRQUFBQSxRQUFRLENBQUM7QUFDUGQsVUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSixxQkFEWDtBQUVQcEksVUFBQUEsSUFBSSxFQUFFLE9BRkM7QUFHUCxhQUFHbVAsdUJBQUEsQ0FBMkI7QUFBRXRHLFlBQUFBO0FBQUYsV0FBM0I7QUFISSxTQUFELENBQVI7QUFLQTs7QUFDRixXQUFLLFVBQUw7QUFDRWhKLFFBQUFBLFFBQVEsQ0FBQztBQUNQZCxVQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzBKLHFCQURYO0FBRVBwSSxVQUFBQSxJQUFJLEVBQUUsVUFGQztBQUdQLGFBQUdtUCwwQkFBQSxDQUE4QjtBQUFFbEssWUFBQUE7QUFBRixXQUE5QjtBQUhJLFNBQUQsQ0FBUjtBQUtBOztBQUNGO0FBQ0UsY0FBTSxJQUFJMUYsS0FBSixDQUFVLG1CQUFWLENBQU47QUF2Qko7QUF5QkQ7O0FBRUQsV0FBU21RLGdCQUFULEdBQTRCOztBQUU1QixXQUFTQyx1QkFBVCxHQUFtQzs7QUFFbkMsV0FBU0MsT0FBVCxDQUFpQjVSLENBQWpCLEVBQW9CO0FBQ2xCLFVBQU07QUFBRWdDLE1BQUFBO0FBQUYsUUFBV2hDLENBQUMsQ0FBQ2lSLE1BQW5CO0FBQ0FwUCxJQUFBQSxRQUFRLENBQUM7QUFDUGQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMwSixxQkFEWDtBQUVQcEksTUFBQUEsSUFGTztBQUdQMkksTUFBQUEsT0FBTyxFQUFFQyxTQUhGO0FBSVA5RSxNQUFBQSxPQUFPLEVBQUU7QUFKRixLQUFELENBQVI7QUFNQWpFLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzJKO0FBQXBCLEtBQUQsQ0FBUjtBQUNEOztBQUVELFNBQU87QUFDTHhKLElBQUFBLEtBREs7QUFFTCtRLElBQUFBLE9BRks7QUFHTEosSUFBQUEsV0FISztBQUlMQyxJQUFBQSxZQUpLO0FBS0xDLElBQUFBLGdCQUxLO0FBTUxDLElBQUFBLHVCQU5LO0FBT0w5UCxJQUFBQSxRQVBLO0FBUUxxUCxJQUFBQSxPQVJLO0FBU0xFLElBQUFBLFFBVEs7QUFVTEMsSUFBQUEsdUJBVks7QUFXTEMsSUFBQUEsZ0JBWEs7QUFZTE4sSUFBQUEsUUFaSztBQWFMTyxJQUFBQTtBQWJLLEdBQVA7QUFlRDs7QUNoSnNlLFNBQVNNLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxJQUFJQyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ELEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFQSxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDekosQ0FBQyxDQUFDLENBQW9ULElBQUkySixHQUFDLENBQUM5UixDQUFDLENBQUMsR0FBRyxDQUErS0EsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM4UixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFJLElBQWlSQyxHQUFDLENBQUMvUixDQUFDLENBQUMsSUFBSSxTQUFTZ1MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDTCxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDSyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU83UixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQ0osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQytSLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUk1SixDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDOEosR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzVSLENBQUMsQ0FBQytILENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSStKLEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSS9KLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOEosR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFvZSxJQUFJRSxHQUFDLENBQUMsa09BQWtPLENBQUNqSyxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxJQUFJa0ssR0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUE2TSxJQUFJLENBQUMsQ0FBQ3JTLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUlzUyxHQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUN2UyxDQUFDLENBQUMsS0FBSyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQ3FTLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUdDLEdBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLEdBQUdILENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUNHLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDOztBQ0kxN00sTUFBTUMsS0FBSyxHQUFHQyxDQUFJLENBQUMsTUFBTSxPQUFPLHFCQUFQLENBQVAsQ0FBbEI7QUFDQSxNQUFNQyxjQUFjLEdBQUdELENBQUksQ0FBQyxNQUFNLE9BQU8sOEJBQVAsQ0FBUCxDQUEzQjtBQUNBLE1BQU1FLGNBQWMsR0FBR0YsQ0FBSSxDQUFDLE1BQU0sT0FBTyw4QkFBUCxDQUFQLENBQTNCO0FBQ0EsTUFBTUcsTUFBTSxHQUFHSCxDQUFJLENBQUMsTUFBTSxPQUFPLHNCQUFQLENBQVAsQ0FBbkI7QUFDQSxNQUFNSSxPQUFPLEdBQUdKLENBQUksQ0FBQyxNQUFNLE9BQU8sdUJBQVAsQ0FBUCxDQUFwQjtBQUVlLFNBQVNLLGlCQUFULEdBQTZCO0FBQzFDLFFBQU07QUFDSnBCLElBQUFBLE9BREk7QUFFSlYsSUFBQUEsT0FGSTtBQUdKTSxJQUFBQSxXQUhJO0FBSUpDLElBQUFBLFlBSkk7QUFLSkMsSUFBQUEsZ0JBTEk7QUFNSkMsSUFBQUEsdUJBTkk7QUFPSlAsSUFBQUEsUUFQSTtBQVFKQyxJQUFBQSx1QkFSSTtBQVNKQyxJQUFBQSxnQkFUSTtBQVVKTixJQUFBQSxRQVZJO0FBV0puUSxJQUFBQTtBQVhJLE1BWUZrUSxPQUFPLEVBWlg7QUFjQSxTQUFPLENBQ0wsRUFBQyxZQUFEO0FBQWMsSUFBQSxJQUFJLEVBQUM7QUFBbkIsS0FDRSxFQUFDa0MsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxjQUFELGVBQ01wUyxLQUROO0FBRUUsSUFBQSxPQUFPLEVBQUUrUSxPQUZYO0FBR0UsSUFBQSxNQUFNLEVBQUVGLGdCQUhWO0FBSUUsSUFBQSxRQUFRLEVBQUVWLFFBSlo7QUFLRSxJQUFBLGdCQUFnQixFQUFFTTtBQUxwQixLQURGLENBREYsQ0FESyxFQVlMLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0UsRUFBQzJCLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRTtBQUFwQixLQUNFLEVBQUMsS0FBRCxlQUNNcFMsS0FETjtBQUVFLElBQUEsT0FBTyxFQUFFK1EsT0FGWDtBQUdFLElBQUEsTUFBTSxFQUFFSixXQUhWO0FBSUUsSUFBQSxRQUFRLEVBQUVSLFFBSlo7QUFLRSxJQUFBLE9BQU8sRUFBRUU7QUFMWCxLQURGLENBREYsQ0FaSyxFQXVCTCxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUMrQixDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLE1BQUQsZUFDTXBTLEtBRE47QUFFRSxJQUFBLE9BQU8sRUFBRStRLE9BRlg7QUFHRSxJQUFBLE1BQU0sRUFBRUgsWUFIVjtBQUlFLElBQUEsUUFBUSxFQUFFVCxRQUpaO0FBS0UsSUFBQSxRQUFRLEVBQUVJO0FBTFosS0FERixDQURGLENBdkJLLEVBa0NMLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0UsRUFBQzZCLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRTtBQUFwQixLQUNFLEVBQUMsY0FBRCxlQUNNcFMsS0FETjtBQUVFLElBQUEsT0FBTyxFQUFFK1EsT0FGWDtBQUdFLElBQUEsTUFBTSxFQUFFRCx1QkFIVjtBQUlFLElBQUEsUUFBUSxFQUFFWCxRQUpaO0FBS0UsSUFBQSx1QkFBdUIsRUFBRUs7QUFMM0IsS0FERixDQURGLENBbENLLEVBNkNMLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0UsRUFBQzRCLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRTtBQUFwQixLQUNFLEVBQUMsT0FBRCxPQURGLENBREYsQ0E3Q0ssQ0FBUDtBQW1ERDs7QUMvQk0sU0FBU0MsaUJBQVQsQ0FBMkI7QUFBRW5OLEVBQUFBLElBQUY7QUFBUWxFLEVBQUFBO0FBQVIsQ0FBM0IsRUFBK0M7QUFDcERBLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQytDLG9CQUFwQjtBQUEwQ3NDLElBQUFBO0FBQTFDLEdBQUQsQ0FBUjtBQUNEOzs7QUNqQ00sU0FBU29OLFdBQVQsR0FBdUI7QUFDNUIsUUFBTTtBQUFFbFIsSUFBQUE7QUFBRixNQUFpQkYsV0FBVyxFQUFsQztBQUNBLFFBQU1xUixXQUFXLEdBQUc3RCxjQUFjLEVBQWxDO0FBQ0EsUUFBTXRJLFFBQVEsR0FBR21NLFdBQVcsQ0FBQ3ZTLEtBQVosQ0FBa0J3SyxJQUFsQixJQUEwQitILFdBQVcsQ0FBQ3ZTLEtBQVosQ0FBa0J3SyxJQUFsQixDQUF1QnBFLFFBQWxFO0FBQ0EsUUFBTSxDQUFDcEcsS0FBRCxFQUFRZ0IsUUFBUixJQUFvQjZPLGlCQUFpQixFQUEzQztBQUNBLFFBQU07QUFBRTdMLElBQUFBLE9BQUY7QUFBV0QsSUFBQUEsUUFBWDtBQUFxQk0sSUFBQUEsV0FBckI7QUFBa0NILElBQUFBLFFBQWxDO0FBQTRDTSxJQUFBQTtBQUE1QyxNQUEyRHhFLEtBQWpFOztBQUNBLFdBQVN3UyxZQUFULENBQXNCclQsQ0FBdEIsRUFBeUI7QUFDdkJBLElBQUFBLENBQUMsQ0FBQ3NULGVBQUY7QUFDQSxVQUFNQyxFQUFFLEdBQUd2VCxDQUFDLENBQUN3VCxhQUFGLENBQWdCRCxFQUEzQjtBQUNBdFIsSUFBQUEsVUFBVSxDQUFDO0FBQUVoQixNQUFBQSxZQUFZLEVBQUcsSUFBR3NTLEVBQUcsRUFBdkI7QUFBMEJ2UyxNQUFBQSxLQUFLLEVBQUU7QUFBakMsS0FBRCxDQUFWO0FBQ0Q7O0FBRUQsV0FBU3lTLGFBQVQsQ0FBdUJ6VCxDQUF2QixFQUEwQjtBQUN4QixVQUFNK0YsSUFBSSxHQUFHL0YsQ0FBQyxDQUFDaVIsTUFBRixDQUFTcE8sS0FBdEI7QUFDQXFRLElBQUFBLGlCQUFpQixDQUFDO0FBQUVyUixNQUFBQSxRQUFGO0FBQVlrRSxNQUFBQTtBQUFaLEtBQUQsQ0FBakI7QUFDRDs7QUFFRCxXQUFTMk4sUUFBVCxHQUFvQjtBQUNsQixVQUFNO0FBQUU3SSxNQUFBQTtBQUFGLFFBQVloRyxPQUFsQjtBQUNBLFVBQU1xQyxTQUFTLEdBQUd5TSxJQUFJLENBQUNDLEdBQUwsRUFBbEI7QUFDQSxVQUFNOU4sT0FBTyxHQUNYWixXQUFXLEtBQUssRUFBaEIsR0FBcUI7QUFBRWEsTUFBQUEsSUFBSSxFQUFFYixXQUFSO0FBQXFCZ0MsTUFBQUE7QUFBckIsS0FBckIsR0FBd0QsSUFEMUQ7QUFFQSxVQUFNMk0sVUFBVSxHQUFHO0FBQ2pCNU0sTUFBQUEsUUFBUSxFQUFFcEMsT0FBTyxDQUFDb0MsUUFERDtBQUVqQjRELE1BQUFBLEtBRmlCO0FBR2pCL0UsTUFBQUEsT0FIaUI7QUFJakIrSyxNQUFBQSxPQUFPLEVBQUUsUUFKUTtBQUtqQjNKLE1BQUFBO0FBTGlCLEtBQW5CO0FBT0FvQixJQUFBQSxXQUFXLENBQUM7QUFBRXpELE1BQUFBLE9BQU8sRUFBRWdQLFVBQVg7QUFBdUI3UixNQUFBQSxJQUFJLEVBQUVpRixRQUE3QjtBQUF1Q3BGLE1BQUFBO0FBQXZDLEtBQUQsQ0FBWDtBQUNBNEYsSUFBQUEsZUFBZSxDQUFDO0FBQ2Q1QyxNQUFBQSxPQUFPLEVBQUVnUCxVQURLO0FBRWRoUyxNQUFBQSxRQUZjO0FBR2RHLE1BQUFBLElBQUksRUFBRWlGLFFBSFE7QUFJZEQsTUFBQUEsTUFBTSxFQUFFO0FBSk0sS0FBRCxDQUFmO0FBTUFuRixJQUFBQSxRQUFRLENBQUM7QUFDUGQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUM2Qyx1QkFEWDtBQUVQc0MsTUFBQUEsY0FBYyxFQUFFZ087QUFGVCxLQUFELENBQVI7QUFJRDs7QUFDRCxXQUFTQyxRQUFULEdBQW9CO0FBQ2xCLFFBQUk7QUFDRixZQUFNO0FBQUVqSixRQUFBQSxLQUFGO0FBQVMzRCxRQUFBQTtBQUFULFVBQXVCckMsT0FBN0I7QUFFQSxZQUFNa1AsTUFBTSxHQUFHO0FBQ2I5TSxRQUFBQSxRQUFRLEVBQUVwQyxPQUFPLENBQUNvQyxRQURMO0FBRWI0RCxRQUFBQSxLQUZhO0FBR2IvRSxRQUFBQSxPQUFPLEVBQUU7QUFBRUMsVUFBQUEsSUFBSSxFQUFFLDBCQUFSO0FBQW9DbUIsVUFBQUE7QUFBcEMsU0FISTtBQUliMkosUUFBQUEsT0FBTyxFQUFFLFFBSkk7QUFLYjNKLFFBQUFBO0FBTGEsT0FBZjtBQVFBb0IsTUFBQUEsV0FBVyxDQUFDO0FBQUV6RCxRQUFBQSxPQUFPLEVBQUVrUCxNQUFYO0FBQW1CL1IsUUFBQUEsSUFBSSxFQUFFaUYsUUFBekI7QUFBbUNwRixRQUFBQTtBQUFuQyxPQUFELENBQVg7QUFDQTRGLE1BQUFBLGVBQWUsQ0FBQztBQUNkNUMsUUFBQUEsT0FBTyxFQUFFa1AsTUFESztBQUVkbFMsUUFBQUEsUUFGYztBQUdkRyxRQUFBQSxJQUFJLEVBQUVpRixRQUhRO0FBSWRELFFBQUFBLE1BQU0sRUFBRTtBQUpNLE9BQUQsQ0FBZjtBQU1BRCxNQUFBQSxZQUFZLENBQUM7QUFBRWxGLFFBQUFBLFFBQUY7QUFBWWdELFFBQUFBLE9BQU8sRUFBRWtQLE1BQXJCO0FBQTZCL1IsUUFBQUEsSUFBSSxFQUFFaUY7QUFBbkMsT0FBRCxDQUFaO0FBQ0FwRixNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUM2Qyx1QkFEWDtBQUVQc0MsUUFBQUEsY0FBYyxFQUFFa087QUFGVCxPQUFELENBQVI7QUFJRCxLQXZCRCxDQXVCRSxPQUFPOU8sS0FBUCxFQUFjO0FBQ2QrTyxNQUFBQSxPQUFPLENBQUMvTyxLQUFSLENBQWNBLEtBQWQ7QUFDRDtBQUNGOztBQUNELFdBQVNnUCxTQUFULEdBQXFCO0FBQ25CLFFBQUk7QUFDRixZQUFNO0FBQUVwSixRQUFBQSxLQUFGO0FBQVMzRCxRQUFBQTtBQUFULFVBQXVCckMsT0FBN0I7QUFFQSxZQUFNcVAsT0FBTyxHQUFHO0FBQ2RqTixRQUFBQSxRQUFRLEVBQUVwQyxPQUFPLENBQUNvQyxRQURKO0FBRWQ0RCxRQUFBQSxLQUZjO0FBR2QvRSxRQUFBQSxPQUFPLEVBQUU7QUFBRUMsVUFBQUEsSUFBSSxFQUFFLDBCQUFSO0FBQW9DbUIsVUFBQUE7QUFBcEMsU0FISztBQUlkMkosUUFBQUEsT0FBTyxFQUFFLFNBSks7QUFLZDNKLFFBQUFBO0FBTGMsT0FBaEI7QUFRQUgsTUFBQUEsWUFBWSxDQUFDO0FBQUVsRixRQUFBQSxRQUFGO0FBQVlnRCxRQUFBQSxPQUFPLEVBQUVxUCxPQUFyQjtBQUE4QmxTLFFBQUFBLElBQUksRUFBRWlGO0FBQXBDLE9BQUQsQ0FBWjtBQUNBUSxNQUFBQSxlQUFlLENBQUM7QUFDZDVDLFFBQUFBLE9BQU8sRUFBRXFQLE9BREs7QUFFZGxTLFFBQUFBLElBQUksRUFBRWlGLFFBRlE7QUFHZHBGLFFBQUFBLFFBSGM7QUFJZG1GLFFBQUFBLE1BQU0sRUFBRTtBQUpNLE9BQUQsQ0FBZjtBQU1BbkYsTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDNkMsdUJBRFg7QUFFUHNDLFFBQUFBLGNBQWMsRUFBRXFPO0FBRlQsT0FBRCxDQUFSO0FBSUQsS0F0QkQsQ0FzQkUsT0FBT2pQLEtBQVAsRUFBYztBQUNkK08sTUFBQUEsT0FBTyxDQUFDL08sS0FBUixDQUFjQSxLQUFkO0FBQ0Q7QUFDRjs7QUFFRCxXQUFTa1AsU0FBVCxHQUFxQjtBQUNuQixVQUFNO0FBQUV0SixNQUFBQSxLQUFGO0FBQVNoSyxNQUFBQTtBQUFULFFBQW1CZ0UsT0FBekI7QUFDQSxVQUFNcUMsU0FBUyxHQUFHeU0sSUFBSSxDQUFDQyxHQUFMLEVBQWxCO0FBRUEsVUFBTTlOLE9BQU8sR0FDWFosV0FBVyxLQUFLLEVBQWhCLEdBQXFCO0FBQUVhLE1BQUFBLElBQUksRUFBRWIsV0FBUjtBQUFxQmdDLE1BQUFBO0FBQXJCLEtBQXJCLEdBQXdELElBRDFEO0FBRUEsVUFBTWtOLFNBQVMsR0FBRztBQUNoQm5OLE1BQUFBLFFBQVEsRUFBRXBDLE9BQU8sQ0FBQ29DLFFBREY7QUFFaEI0RCxNQUFBQSxLQUZnQjtBQUdoQi9FLE1BQUFBLE9BSGdCO0FBSWhCK0ssTUFBQUEsT0FBTyxFQUFFLFNBSk87QUFLaEIzSixNQUFBQTtBQUxnQixLQUFsQjtBQU9BTyxJQUFBQSxlQUFlLENBQUM7QUFDZDVDLE1BQUFBLE9BQU8sRUFBRXVQLFNBREs7QUFFZHZTLE1BQUFBLFFBRmM7QUFHZEcsTUFBQUEsSUFBSSxFQUFFaUYsUUFIUTtBQUlkRCxNQUFBQSxNQUFNLEVBQUU7QUFKTSxLQUFELENBQWY7O0FBTUEsUUFBSW5DLE9BQU8sQ0FBQ2hFLEtBQVIsS0FBa0IsU0FBdEIsRUFBaUM7QUFDL0I7QUFDQTRHLE1BQUFBLGVBQWUsQ0FBQztBQUNkNUMsUUFBQUEsT0FBTyxFQUFFLEVBQ1AsR0FBR0EsT0FESTtBQUVQaUIsVUFBQUEsT0FBTyxFQUFFLEVBQ1AsR0FBR2pCLE9BQU8sQ0FBQ2lCLE9BREo7QUFFUEMsWUFBQUEsSUFBSSxFQUFFLHNEQUZDO0FBR1BoRixZQUFBQSxJQUFJLEVBQUU7QUFIQztBQUZGLFNBREs7QUFTZGMsUUFBQUEsUUFUYztBQVVkRyxRQUFBQSxJQUFJLEVBQUVpRixRQVZRO0FBV2RELFFBQUFBLE1BQU0sRUFBRTtBQVhNLE9BQUQsQ0FBZjtBQWFELEtBZkQsTUFlTztBQUNMb0IsTUFBQUEsYUFBYSxDQUFDO0FBQUV2RCxRQUFBQSxPQUFPLEVBQUV1UCxTQUFYO0FBQXNCcFMsUUFBQUEsSUFBSSxFQUFFaUYsUUFBNUI7QUFBc0NwRixRQUFBQTtBQUF0QyxPQUFELENBQWI7QUFFQUEsTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDNkMsdUJBRFg7QUFFUHNDLFFBQUFBLGNBQWMsRUFBRXVPO0FBRlQsT0FBRCxDQUFSO0FBSUQ7QUFDRjs7QUFDRCxXQUFTQyxPQUFULEdBQW1CO0FBQ2pCLFFBQUk7QUFDRixZQUFNO0FBQUV4SixRQUFBQTtBQUFGLFVBQVloRyxPQUFsQjtBQUNBLFlBQU1xQyxTQUFTLEdBQUd5TSxJQUFJLENBQUNDLEdBQUwsRUFBbEI7QUFDQSxZQUFNVSxLQUFLLEdBQUc7QUFDWnJOLFFBQUFBLFFBQVEsRUFBRXBDLE9BQU8sQ0FBQ29DLFFBRE47QUFFWjRELFFBQUFBLEtBRlk7QUFHWi9FLFFBQUFBLE9BQU8sRUFBRTtBQUNQQyxVQUFBQSxJQUFJLEVBQUUsNEJBREM7QUFFUG1CLFVBQUFBLFNBRk87QUFHUG5HLFVBQUFBLElBQUksRUFBRTtBQUhDLFNBSEc7QUFRWjhQLFFBQUFBLE9BQU8sRUFBRSxPQVJHO0FBU1ozSixRQUFBQTtBQVRZLE9BQWQ7QUFZQWtCLE1BQUFBLGFBQWEsQ0FBQztBQUFFdkQsUUFBQUEsT0FBTyxFQUFFeVAsS0FBWDtBQUFrQnRTLFFBQUFBLElBQUksRUFBRWlGLFFBQXhCO0FBQWtDcEYsUUFBQUE7QUFBbEMsT0FBRCxDQUFiO0FBQ0E0RixNQUFBQSxlQUFlLENBQUM7QUFDZDVDLFFBQUFBLE9BQU8sRUFBRXlQLEtBREs7QUFFZHpTLFFBQUFBLFFBRmM7QUFHZEcsUUFBQUEsSUFBSSxFQUFFaUYsUUFIUTtBQUlkRCxRQUFBQSxNQUFNLEVBQUU7QUFKTSxPQUFELENBQWY7QUFNQW5GLE1BQUFBLFFBQVEsQ0FBQztBQUNQZCxRQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzZDLHVCQURYO0FBRVBzQyxRQUFBQSxjQUFjLEVBQUV5TztBQUZULE9BQUQsQ0FBUjtBQUlELEtBMUJELENBMEJFLE9BQU9yUCxLQUFQLEVBQWM7QUFDZCtPLE1BQUFBLE9BQU8sQ0FBQy9PLEtBQVIsQ0FBY0EsS0FBZDtBQUNEO0FBQ0Y7O0FBQ0QsV0FBU3NQLFNBQVQsR0FBcUI7O0FBRXJCLFNBQU87QUFDTGIsSUFBQUEsUUFESztBQUVMSSxJQUFBQSxRQUZLO0FBR0xHLElBQUFBLFNBSEs7QUFJTEksSUFBQUEsT0FKSztBQUtMRSxJQUFBQSxTQUxLO0FBTUxKLElBQUFBLFNBTks7QUFPTHRULElBQUFBLEtBUEs7QUFRTHdTLElBQUFBLFlBUks7QUFTTEksSUFBQUEsYUFUSztBQVVMdk8sSUFBQUEsV0FWSztBQVdMckQsSUFBQUEsUUFYSztBQVlMZ0QsSUFBQUEsT0FaSztBQWFMRCxJQUFBQSxRQWJLO0FBY0xxQyxJQUFBQSxRQWRLO0FBZUxsQyxJQUFBQSxRQWZLO0FBZ0JMTSxJQUFBQTtBQWhCSyxHQUFQO0FBa0JEOztBQzdNRDtBQUVPLGVBQWVJLGNBQWYsQ0FBOEI7QUFBRUYsRUFBQUEsTUFBRjtBQUFVMUQsRUFBQUEsUUFBVjtBQUFvQm9GLEVBQUFBO0FBQXBCLENBQTlCLEVBQThEO0FBQ25FLE1BQUk7QUFDRixVQUFNbUgsUUFBUSxHQUFHLE1BQU01TyxLQUFLLENBQ3pCLDRCQUEyQitGLE1BQU8sYUFBWTBCLFFBQVMsRUFEOUIsQ0FBNUI7O0FBR0EsUUFBSW1ILFFBQVEsQ0FBQ29HLEVBQWIsRUFBaUI7QUFDZixZQUFNO0FBQUU1UCxRQUFBQTtBQUFGLFVBQWUsTUFBTXdKLFFBQVEsQ0FBQ08sSUFBVCxFQUEzQixDQURlOztBQUdmOU0sTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMEMsc0JBQXBCO0FBQTRDd0IsUUFBQUE7QUFBNUMsT0FBRCxDQUFSO0FBQ0Q7QUFDRixHQVRELENBU0UsT0FBT0ssS0FBUCxFQUFjO0FBQ2RwRCxJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMyQyxxQkFBcEI7QUFBMkM0QixNQUFBQTtBQUEzQyxLQUFELENBQVI7QUFDRDtBQUNGO0FBRU0sZUFBZXdQLFlBQWYsQ0FBNEI7QUFBRTVTLEVBQUFBLFFBQUY7QUFBWW9GLEVBQUFBO0FBQVosQ0FBNUIsRUFBb0Q7QUFDekQsTUFBSTtBQUNGLFVBQU1tSCxRQUFRLEdBQUcsTUFBTTVPLEtBQUssQ0FBRSxtQ0FBa0N5SCxRQUFTLEVBQTdDLENBQTVCOztBQUNBLFFBQUltSCxRQUFRLENBQUNvRyxFQUFiLEVBQWlCO0FBQ2YsWUFBTTtBQUFFNVAsUUFBQUE7QUFBRixVQUFlLE1BQU13SixRQUFRLENBQUNPLElBQVQsRUFBM0I7O0FBQ0EsVUFBSS9KLFFBQVEsQ0FBQ2lELE1BQVQsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIzRixRQUFBQSxZQUFZLENBQUNDLE9BQWIsQ0FBc0IsR0FBRThFLFFBQVMsV0FBakMsRUFBNkM3RSxJQUFJLENBQUNDLFNBQUwsQ0FBZXVDLFFBQWYsQ0FBN0M7QUFDRDs7QUFFRC9DLE1BQUFBLFFBQVEsQ0FBQztBQUFFZCxRQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3NDO0FBQXBCLE9BQUQsQ0FBUjtBQUNEO0FBQ0YsR0FWRCxDQVVFLE9BQU9pQyxLQUFQLEVBQWM7QUFDZHBELElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3VDLHFCQUFwQjtBQUEyQ2dDLE1BQUFBO0FBQTNDLEtBQUQsQ0FBUjtBQUNEO0FBQ0Y7O0FDeEJNLFNBQVN5UCxrQkFBVCxDQUE0QmpULEtBQTVCLEVBQW1DO0FBQ3hDLFFBQU07QUFBRVosSUFBQUEsS0FBSyxFQUFFOFQ7QUFBVCxNQUF1QjVELE9BQU8sRUFBcEM7QUFDQSxRQUFNO0FBQUU5SixJQUFBQSxRQUFGO0FBQVlrRSxJQUFBQTtBQUFaLE1BQXNCc0UsV0FBVyxFQUF2QztBQUNBLFFBQU0sQ0FBQ3JLLE1BQUQsRUFBU3dQLFNBQVQsSUFBc0JoRixHQUFRLENBQUMsSUFBRCxDQUFwQztBQUVBLFFBQU07QUFBRWxPLElBQUFBLFFBQUY7QUFBWW1ULElBQUFBO0FBQVosTUFBMEJwVCxLQUFoQztBQUNBLFFBQU07QUFBRUksSUFBQUEsUUFBRjtBQUFZaEIsSUFBQUE7QUFBWixNQUFzQnNTLFdBQVcsRUFBdkM7QUFDQSxRQUFNO0FBQUUxTixvQkFBQUEsZ0JBQUY7QUFBa0JGLElBQUFBLE1BQWxCO0FBQTBCTSxJQUFBQSxjQUExQjtBQUEwQ0QsSUFBQUE7QUFBMUMsTUFBNEQvRSxLQUFsRTtBQUVBNkIsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJdUUsUUFBUSxJQUFJN0IsTUFBTSxLQUFLLElBQTNCLEVBQWlDO0FBQy9Cd1AsTUFBQUEsU0FBUyxDQUFDLElBQUlFLFNBQUosQ0FBZSxHQUFFRCxTQUFVLHVCQUFzQjVOLFFBQVMsRUFBMUQsQ0FBRCxDQUFUO0FBRUFwRixNQUFBQSxRQUFRLENBQUM7QUFBRWQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUMrRDtBQUFwQixPQUFELENBQVI7QUFDRDs7QUFDRCxRQUFJLENBQUN3QyxRQUFELElBQWE3QixNQUFqQixFQUF5QjtBQUN2QkEsTUFBQUEsTUFBTSxDQUFDMlAsS0FBUDtBQUNBSCxNQUFBQSxTQUFTLENBQUMsSUFBRCxDQUFUO0FBQ0EvUyxNQUFBQSxRQUFRLENBQUM7QUFBRWQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNpRTtBQUFwQixPQUFELENBQVI7QUFDRDtBQUNGLEdBWFEsRUFXTixDQUFDc0MsUUFBRCxFQUFXN0IsTUFBWCxDQVhNLENBQVQ7QUFhQTFDLEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSTBDLE1BQUosRUFBWTtBQUNWQSxNQUFBQSxNQUFNLENBQUM0UCxTQUFQLEdBQW9CQyxhQUFELElBQW1CO0FBQ3BDLGNBQU1DLEdBQUcsR0FBRzlTLElBQUksQ0FBQ1EsS0FBTCxDQUFXcVMsYUFBYSxDQUFDRSxJQUF6QixDQUFaO0FBRUF0VCxRQUFBQSxRQUFRLENBQUM7QUFBRWQsVUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNzRCx1QkFBcEI7QUFBNkM4QixVQUFBQSxPQUFPLEVBQUVvUDtBQUF0RCxTQUFELENBQVI7QUFDRCxPQUpEOztBQUtBOVAsTUFBQUEsTUFBTSxDQUFDZ1EsTUFBUCxHQUFnQixNQUFNO0FBQ3BCdlQsUUFBQUEsUUFBUSxDQUFDO0FBQUVkLFVBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDNEQ7QUFBcEIsU0FBRCxDQUFSO0FBQ0QsT0FGRDs7QUFHQWMsTUFBQUEsTUFBTSxDQUFDaVEsT0FBUCxHQUFpQixNQUFNO0FBQ3JCeFQsUUFBQUEsUUFBUSxDQUFDO0FBQUVkLFVBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDOEQ7QUFBcEIsU0FBRCxDQUFSO0FBQ0QsT0FGRDs7QUFHQVksTUFBQUEsTUFBTSxDQUFDa1EsT0FBUCxHQUFrQnJRLEtBQUQsSUFBVztBQUMxQnBELFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ2dFLFlBQXBCO0FBQWtDTyxVQUFBQTtBQUFsQyxTQUFELENBQVI7QUFDRCxPQUZEO0FBR0Q7QUFDRixHQWpCUSxFQWlCTixDQUFDRyxNQUFELENBakJNLENBQVQ7QUFtQkExQyxFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkLFFBQUkrQyxnQkFBSixFQUFvQjtBQUNsQjtBQUNBMEosTUFBQUEsY0FBQSxDQUF1QjtBQUFFdE4sUUFBQUEsUUFBRjtBQUFZMEQsUUFBQUEsTUFBWjtBQUFvQjBCLFFBQUFBO0FBQXBCLE9BQXZCO0FBQ0Q7QUFDRixHQUxRLEVBS04sQ0FBQ3hCLGdCQUFELENBTE0sQ0FBVDtBQU9BL0MsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJbUQsY0FBSixFQUFvQjtBQUNsQjBQLE1BQUFBLGtCQUFrQjtBQUNuQjtBQUNGLEdBSlEsRUFJTixDQUFDMVAsY0FBRCxDQUpNLENBQVQ7QUFNQW5ELEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSWtELGFBQWEsSUFBSXFCLFFBQXJCLEVBQStCO0FBQzdCa0ksTUFBQUEsWUFBQSxDQUFxQjtBQUFFdE4sUUFBQUEsUUFBRjtBQUFZb0YsUUFBQUE7QUFBWixPQUFyQjtBQUNEO0FBQ0YsR0FKUSxFQUlOLENBQUNyQixhQUFELEVBQWdCcUIsUUFBaEIsQ0FKTSxDQUFUOztBQUtBLFdBQVNzTyxrQkFBVCxHQUE4QjtBQUM1QixRQUFJO0FBQ0ZuUSxNQUFBQSxNQUFNLENBQUNvUSxJQUFQLENBQVlwVCxJQUFJLENBQUNDLFNBQUwsQ0FBZXdELGNBQWYsQ0FBWjtBQUVBaEUsTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDOEM7QUFBcEIsT0FBRCxDQUFSO0FBQ0QsS0FKRCxDQUlFLE9BQU95QixLQUFQLEVBQWM7QUFDZCtPLE1BQUFBLE9BQU8sQ0FBQy9PLEtBQVIsQ0FBY0EsS0FBZDtBQUNEO0FBQ0Y7O0FBRUQsU0FBT3ZELFFBQVA7QUFDRDs7QUN6RWMsU0FBUytULGNBQVQsQ0FBd0JoVSxLQUF4QixFQUErQjtBQUM1QyxFQUVvRDtBQUNsRCxXQUFPLEVBQUMsa0JBQUQsRUFBd0JBLEtBQXhCLENBQVA7QUFDRDtBQUNGOztBQ1ZEO0FBTU8sU0FBU2lVLFlBQVQsQ0FBc0I7QUFBRWhVLEVBQUFBO0FBQUYsQ0FBdEIsRUFBb0M7QUFDekMsU0FDRSxFQUFDLGdCQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUMsUUFEUjtBQUVFLElBQUEsU0FBUyxFQUFFO0FBQUVWLE1BQUFBLEtBQUssRUFBRSxHQUFUO0FBQWNDLE1BQUFBLFlBQVksRUFBRTtBQUE1QjtBQUZiLEtBSUUsRUFBQyxZQUFELFFBQ0UsRUFBQyxnQkFBRCxRQUNFLEVBQUMsY0FBRDtBQUFnQixJQUFBLFNBQVMsRUFBRyxTQUFRMFUsZUFBRztBQUF2QyxLQUNHalUsUUFESCxDQURGLENBREYsQ0FKRixDQURGO0FBY0Q7O0FDbEJjLFNBQVNrVSxNQUFULENBQWdCblUsS0FBaEIsRUFBdUI7QUFDcEMsUUFBTTtBQUFFb1UsSUFBQUEsRUFBRSxHQUFHLE9BQVA7QUFBZ0JDLElBQUFBLEtBQWhCO0FBQXVCcFUsSUFBQUE7QUFBdkIsTUFBb0NELEtBQTFDO0FBQ0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFHLGtDQUFpQ29VLEVBQUcsT0FBTUEsRUFBRztBQUE5RCxLQUNFO0FBQUcsSUFBQSxTQUFTLEVBQUMsY0FBYjtBQUE0QixJQUFBLElBQUksRUFBQztBQUFqQyxLQUNHQyxLQURILENBREYsRUFJRTtBQUNFLElBQUEsU0FBUyxFQUFDLGdCQURaO0FBRUUsSUFBQSxJQUFJLEVBQUMsUUFGUDtBQUdFLG1CQUFZLFVBSGQ7QUFJRSxtQkFBWSx5QkFKZDtBQUtFLHFCQUFjLHdCQUxoQjtBQU1FLHFCQUFjLE9BTmhCO0FBT0Usa0JBQVc7QUFQYixLQVNFO0FBQU0sSUFBQSxTQUFTLEVBQUM7QUFBaEIsSUFURixDQUpGLEVBZUdwVSxRQWZILENBREY7QUFtQkQ7QUFFTSxTQUFTcVUsY0FBVCxDQUF3QjtBQUFFclUsRUFBQUE7QUFBRixDQUF4QixFQUFzQztBQUMzQyxTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUMsMEJBQWY7QUFBMEMsSUFBQSxFQUFFLEVBQUM7QUFBN0MsS0FDR0EsUUFESCxDQURGO0FBS0Q7QUFFTSxTQUFTc1UsU0FBVCxDQUFtQjtBQUFFdFUsRUFBQUE7QUFBRixDQUFuQixFQUFpQztBQUN0QyxTQUFPO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCxLQUFvQ0EsUUFBcEMsQ0FBUDtBQUNEOztBQUVNLFNBQVN1VSxPQUFULENBQWlCO0FBQUV2VSxFQUFBQTtBQUFGLENBQWpCLEVBQStCO0FBQ3BDLFNBQU87QUFBSSxJQUFBLFNBQVMsRUFBQztBQUFkLEtBQTBCQSxRQUExQixDQUFQO0FBQ0Q7QUFFTSxTQUFTd1UsT0FBVCxDQUFpQnpVLEtBQWpCLEVBQXdCO0FBQzdCLFFBQU07QUFBRTBVLElBQUFBO0FBQUYsTUFBZTFVLEtBQXJCO0FBQ0EsUUFBTTtBQUFFUSxJQUFBQTtBQUFGLE1BQWlCRixXQUFXLEVBQWxDOztBQUNBLFdBQVNxVSxXQUFULENBQXFCcFcsQ0FBckIsRUFBd0I7QUFDdEJBLElBQUFBLENBQUMsQ0FBQ3FXLGNBQUY7QUFDQSxVQUFNO0FBQUU5QyxNQUFBQTtBQUFGLFFBQVN2VCxDQUFDLENBQUNpUixNQUFqQjtBQUVBaFAsSUFBQUEsVUFBVSxDQUFDO0FBQUVoQixNQUFBQSxZQUFZLEVBQUcsSUFBR3NTLEVBQUcsRUFBdkI7QUFBMEJ2UyxNQUFBQSxLQUFLLEVBQUVtVjtBQUFqQyxLQUFELENBQVY7QUFDRDs7QUFDRCxTQUFPO0FBQUcsSUFBQSxTQUFTLEVBQUMsVUFBYjtBQUF3QixJQUFBLElBQUksRUFBQyxHQUE3QjtBQUFpQyxJQUFBLE9BQU8sRUFBRUM7QUFBMUMsS0FBMkQzVSxLQUEzRCxFQUFQO0FBQ0Q7O0FDakRjLFNBQVM2VSxHQUFULENBQWE3VSxLQUFiLEVBQW9CO0FBQ2pDLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZNlUsSUFBQUE7QUFBWixNQUFvQzlVLEtBQTFDO0FBRUEsU0FDRTtBQUNFLElBQUEsU0FBUyxFQUFHLE9BQU04VSxtQkFBbUIsSUFBSUEsbUJBQW9CO0FBRC9ELEtBRU05VSxLQUZOLEdBSUdDLFFBSkgsQ0FERjtBQVFEOztBQ2JjLFNBQVM4VSxTQUFULENBQW1CO0FBQUUzVixFQUFBQSxLQUFGO0FBQVNnQixFQUFBQSxRQUFUO0FBQW1CSSxFQUFBQTtBQUFuQixDQUFuQixFQUFvRDtBQUNqRSxRQUFNO0FBQUVzRCxJQUFBQSxNQUFGO0FBQVVDLElBQUFBO0FBQVYsTUFBMkIzRSxLQUFqQzs7QUFFQSxXQUFTNFYsY0FBVCxDQUF3QnpXLENBQXhCLEVBQTJCO0FBQ3pCLFVBQU07QUFBRXVULE1BQUFBO0FBQUYsUUFBU3ZULENBQUMsQ0FBQ2lSLE1BQWpCO0FBRUEsVUFBTXBNLE9BQU8sR0FBR1csWUFBWSxDQUFDMUQsSUFBYixDQUFtQnhCLENBQUQsSUFBT0EsQ0FBQyxDQUFDMkcsUUFBRixLQUFlc00sRUFBeEMsQ0FBaEI7QUFDQTFSLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ2tELGdCQUFwQjtBQUFzQ2lCLE1BQUFBO0FBQXRDLEtBQUQsQ0FBUjtBQUNBNUMsSUFBQUEsVUFBVSxDQUFDO0FBQUVoQixNQUFBQSxZQUFZLEVBQUcsSUFBRzRELE9BQU8sQ0FBQ2hFLEtBQU0sRUFBbEM7QUFBcUNHLE1BQUFBLEtBQUssRUFBRTtBQUE1QyxLQUFELENBQVY7QUFDRDs7QUFDRCxXQUFTMFYsYUFBVCxDQUF1QjFXLENBQXZCLEVBQTBCO0FBQ3hCNkIsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDd0MsbUJBQXBCO0FBQXlDcUMsTUFBQUEsTUFBTSxFQUFFdkYsQ0FBQyxDQUFDaVIsTUFBRixDQUFTcE87QUFBMUQsS0FBRCxDQUFSO0FBQ0Q7O0FBRUQsV0FBUzhULFFBQVQsR0FBb0I7QUFDbEI5VSxJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUN5QztBQUFwQixLQUFELENBQVI7QUFDRDs7QUFFRCxTQUFPO0FBQUV3VCxJQUFBQSxRQUFGO0FBQVlELElBQUFBLGFBQVo7QUFBMkJELElBQUFBLGNBQTNCO0FBQTJDbFIsSUFBQUEsTUFBM0M7QUFBbURDLElBQUFBO0FBQW5ELEdBQVA7QUFDRDs7QUNuQmMsU0FBU29SLGNBQVQsQ0FBd0I7QUFBRWxSLEVBQUFBLE1BQUY7QUFBVTdELEVBQUFBLFFBQVY7QUFBb0JHLEVBQUFBO0FBQXBCLENBQXhCLEVBQW9EO0FBQ2pFLFFBQU1tRixVQUFVLEdBQUksR0FBRW5GLElBQUssV0FBM0I7QUFDQSxRQUFNcUYsYUFBYSxHQUFHakYsSUFBSSxDQUFDUSxLQUFMLENBQVdWLFlBQVksQ0FBQ1MsT0FBYixDQUFxQndFLFVBQXJCLENBQVgsQ0FBdEI7O0FBRUEsTUFBSUUsYUFBYSxJQUFJQSxhQUFhLENBQUNRLE1BQWQsR0FBdUIsQ0FBNUMsRUFBK0M7QUFDN0MsUUFBSWdQLGdCQUFnQixHQUFHeFAsYUFBYSxDQUFDM0IsTUFBZCxDQUFzQjVGLENBQUQsSUFDMUNBLENBQUMsQ0FBQ21ILFFBQUYsQ0FBVzZQLFFBQVgsQ0FBb0JwUixNQUFwQixDQURxQixDQUF2Qjs7QUFHQSxRQUFJbVIsZ0JBQWdCLElBQUlBLGdCQUFnQixDQUFDaFAsTUFBakIsR0FBMEIsQ0FBbEQsRUFBcUQ7QUFDbkRoRyxNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUN3RCxnQkFEWDtBQUVQVSxRQUFBQSxRQUFRLEVBQUVnUztBQUZILE9BQUQsQ0FBUjtBQUlELEtBTEQsTUFLTztBQUNML1UsTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDd0QsZ0JBQXBCO0FBQXNDVSxRQUFBQSxRQUFRLEVBQUU7QUFBaEQsT0FBRCxDQUFSO0FBQ0Q7QUFDRjtBQUNGOztBQ2pCYyxTQUFTbVMsWUFBVCxDQUFzQjtBQUFFL1UsRUFBQUEsSUFBRjtBQUFRSCxFQUFBQTtBQUFSLENBQXRCLEVBQTBDO0FBQ3ZELFFBQU1zRixVQUFVLEdBQUksR0FBRW5GLElBQUssV0FBM0I7QUFDQSxRQUFNcUYsYUFBYSxHQUFHakYsSUFBSSxDQUFDUSxLQUFMLENBQVdWLFlBQVksQ0FBQ1MsT0FBYixDQUFxQndFLFVBQXJCLENBQVgsQ0FBdEI7O0FBQ0EsTUFBSUUsYUFBYSxJQUFJQSxhQUFhLENBQUNRLE1BQWQsR0FBdUIsQ0FBNUMsRUFBK0M7QUFDN0NoRyxJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNnRCxlQUFwQjtBQUFxQ2tCLE1BQUFBLFFBQVEsRUFBRXlDO0FBQS9DLEtBQUQsQ0FBUjtBQUNEO0FBQ0Y7O0FDRWMsU0FBUzJQLFNBQVQsQ0FBbUI7QUFBRW5XLEVBQUFBLEtBQUY7QUFBU2dCLEVBQUFBLFFBQVQ7QUFBbUJJLEVBQUFBLFVBQW5CO0FBQStCZ0YsRUFBQUE7QUFBL0IsQ0FBbkIsRUFBOEQ7QUFDM0UsUUFBTTtBQUFFdkIsSUFBQUEsTUFBRjtBQUFVQyxJQUFBQTtBQUFWLE1BQTJCOUUsS0FBakM7QUFFQTZCLEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSWdELE1BQU0sQ0FBQ21DLE1BQVAsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckI7QUFDQStPLE1BQUFBLGNBQWMsQ0FBQztBQUFFbFIsUUFBQUEsTUFBRjtBQUFVN0QsUUFBQUEsUUFBVjtBQUFvQkcsUUFBQUEsSUFBSSxFQUFFaUY7QUFBMUIsT0FBRCxDQUFkO0FBQ0Q7QUFDRixHQUxRLEVBS04sQ0FBQ3ZCLE1BQUQsQ0FMTSxDQUFUOztBQU9BLFdBQVN1UixhQUFULENBQXVCalgsQ0FBdkIsRUFBMEI7QUFDeEI2QixJQUFBQSxRQUFRLENBQUM7QUFDUGQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUM0QyxvQkFEWDtBQUVQb0MsTUFBQUEsTUFBTSxFQUFFMUYsQ0FBQyxDQUFDaVIsTUFBRixDQUFTcE87QUFGVixLQUFELENBQVI7QUFJRDs7QUFFRCxXQUFTcVUsY0FBVCxDQUF3QmxYLENBQXhCLEVBQTJCO0FBQ3pCLFVBQU07QUFBRXVULE1BQUFBO0FBQUYsUUFBU3ZULENBQUMsQ0FBQ2lSLE1BQWpCO0FBRUEsVUFBTXBNLE9BQU8sR0FBR2MsWUFBWSxDQUFDN0QsSUFBYixDQUFtQnhCLENBQUQsSUFBT0EsQ0FBQyxDQUFDMkcsUUFBRixLQUFlc00sRUFBeEMsQ0FBaEI7QUFFQTFSLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ2tELGdCQUFwQjtBQUFzQ2lCLE1BQUFBO0FBQXRDLEtBQUQsQ0FBUjtBQUNBNUMsSUFBQUEsVUFBVSxDQUFDO0FBQUVoQixNQUFBQSxZQUFZLEVBQUcsSUFBRzRELE9BQU8sQ0FBQ2hFLEtBQU0sRUFBbEM7QUFBcUNHLE1BQUFBLEtBQUssRUFBRTtBQUE1QyxLQUFELENBQVY7QUFDRDs7QUFFRCxXQUFTbVcsYUFBVCxHQUF5QjtBQUN2QkosSUFBQUEsWUFBWSxDQUFDO0FBQUVsVixNQUFBQSxRQUFGO0FBQVlHLE1BQUFBLElBQUksRUFBRWlGO0FBQWxCLEtBQUQsQ0FBWjtBQUNEOztBQUVELFNBQU87QUFBRXZCLElBQUFBLE1BQUY7QUFBVUMsSUFBQUEsWUFBVjtBQUF3QnVSLElBQUFBLGNBQXhCO0FBQXdDRCxJQUFBQSxhQUF4QztBQUF1REUsSUFBQUE7QUFBdkQsR0FBUDtBQUNEOztBQ2xDYyxTQUFTQyxTQUFULENBQW1CO0FBQUV2VyxFQUFBQSxLQUFGO0FBQVNnQixFQUFBQSxRQUFUO0FBQW1CSSxFQUFBQSxVQUFuQjtBQUErQmdGLEVBQUFBO0FBQS9CLENBQW5CLEVBQThEO0FBQzNFLFFBQU07QUFBRW5DLElBQUFBO0FBQUYsTUFBcUJqRSxLQUEzQjs7QUFFQSxXQUFTd1csY0FBVCxDQUF3QjtBQUFFeFMsSUFBQUE7QUFBRixHQUF4QixFQUFxQztBQUNuQ2hELElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ2tELGdCQUFwQjtBQUFzQ2lCLE1BQUFBO0FBQXRDLEtBQUQsQ0FBUjtBQUVBNUMsSUFBQUEsVUFBVSxDQUFDO0FBQUVoQixNQUFBQSxZQUFZLEVBQUcsSUFBRzRELE9BQU8sQ0FBQ2hFLEtBQU0sRUFBbEM7QUFBcUNHLE1BQUFBLEtBQUssRUFBRTtBQUE1QyxLQUFELENBQVY7QUFDRDs7QUFFRCxXQUFTc1csY0FBVCxHQUEwQjs7QUFFMUIsU0FBTztBQUFFeFMsSUFBQUEsY0FBRjtBQUFrQnVTLElBQUFBLGNBQWxCO0FBQWtDQyxJQUFBQTtBQUFsQyxHQUFQO0FBQ0Q7O0FDVkQsTUFBTUMsS0FBSyxHQUFHNUUsQ0FBSSxDQUFDLE1BQU0sT0FBTyxxQkFBUCxDQUFQLENBQWxCO0FBQ0EsTUFBTTZFLE9BQU8sR0FBRzdFLENBQUksQ0FBQyxNQUFNLE9BQU8sdUJBQVAsQ0FBUCxDQUFwQjtBQUNBLE1BQU04RSxTQUFTLEdBQUc5RSxDQUFJLENBQUMsTUFBTSxPQUFPLHlCQUFQLENBQVAsQ0FBdEI7QUFDQSxNQUFNK0UsUUFBUSxHQUFHL0UsQ0FBSSxDQUFDLE1BQU0sT0FBTyx3QkFBUCxDQUFQLENBQXJCO0FBQ0EsTUFBTWdGLE1BQU0sR0FBR2hGLENBQUksQ0FBQyxNQUFNLE9BQU8sc0JBQVAsQ0FBUCxDQUFuQjtBQUNBLE1BQU1pRixPQUFPLEdBQUdqRixDQUFJLENBQUMsTUFBTSxPQUFPLHVCQUFQLENBQVAsQ0FBcEI7QUFDQSxNQUFNa0YsT0FBTyxHQUFHbEYsQ0FBSSxDQUFDLE1BQU0sT0FBTyx1QkFBUCxDQUFQLENBQXBCO0FBQ0EsTUFBTW1GLE1BQU0sR0FBR25GLENBQUksQ0FBQyxNQUFNLE9BQU8sc0JBQVAsQ0FBUCxDQUFuQjtBQUNBLE1BQU1vRixNQUFNLEdBQUdwRixDQUFJLENBQUMsTUFBTSxPQUFPLHNCQUFQLENBQVAsQ0FBbkI7QUFDQSxNQUFNcUYsY0FBYyxHQUFHckYsQ0FBSSxDQUFDLE1BQU0sT0FBTyw4QkFBUCxDQUFQLENBQTNCO0FBQ2UsU0FBU3NGLHFCQUFULENBQStCeFcsS0FBL0IsRUFBc0M7QUFDbkQsUUFBTTtBQUFFUSxJQUFBQTtBQUFGLE1BQWlCRixXQUFXLEVBQWxDO0FBQ0EsUUFBTTtBQUNKbEIsSUFBQUEsS0FESTtBQUVKZ0UsSUFBQUEsT0FGSTtBQUdKNk8sSUFBQUEsUUFISTtBQUlKSSxJQUFBQSxRQUpJO0FBS0pHLElBQUFBLFNBTEk7QUFNSkksSUFBQUEsT0FOSTtBQU9KRSxJQUFBQSxTQVBJO0FBUUpKLElBQUFBLFNBUkk7QUFTSlYsSUFBQUEsYUFUSTtBQVVKdk8sSUFBQUEsV0FWSTtBQVdKK0IsSUFBQUEsUUFYSTtBQVlKbEMsSUFBQUEsUUFaSTtBQWFKbEQsSUFBQUEsUUFiSTtBQWNKd1IsSUFBQUE7QUFkSSxNQWVGRixXQUFXLEVBZmY7QUFnQkEsUUFBTTtBQUNKNU4sSUFBQUEsTUFESTtBQUVKbVIsSUFBQUEsYUFGSTtBQUdKbFIsSUFBQUEsWUFISTtBQUlKbVIsSUFBQUEsUUFKSTtBQUtKRixJQUFBQTtBQUxJLE1BTUZELFNBQVMsQ0FBQztBQUFFM1YsSUFBQUEsS0FBRjtBQUFTZ0IsSUFBQUEsUUFBVDtBQUFtQkksSUFBQUE7QUFBbkIsR0FBRCxDQU5iO0FBT0EsUUFBTTtBQUNKeUQsSUFBQUEsTUFESTtBQUVKQyxJQUFBQSxZQUZJO0FBR0p1UixJQUFBQSxjQUhJO0FBSUpELElBQUFBLGFBSkk7QUFLSkUsSUFBQUE7QUFMSSxNQU1GSCxTQUFTLENBQUM7QUFDWm5WLElBQUFBLFFBRFk7QUFFWmhCLElBQUFBLEtBRlk7QUFHWm9CLElBQUFBLFVBSFk7QUFJWmdGLElBQUFBO0FBSlksR0FBRCxDQU5iO0FBWUEsUUFBTTtBQUFFbkMsSUFBQUEsY0FBRjtBQUFrQnVTLElBQUFBLGNBQWxCO0FBQWtDQyxJQUFBQTtBQUFsQyxNQUFxREYsU0FBUyxDQUFDO0FBQ25FdlcsSUFBQUEsS0FEbUU7QUFFbkVnQixJQUFBQSxRQUZtRTtBQUduRUksSUFBQUEsVUFIbUU7QUFJbkVnRixJQUFBQTtBQUptRSxHQUFELENBQXBFO0FBTUEsUUFBTTtBQUFFakMsSUFBQUE7QUFBRixNQUFjbkUsS0FBcEI7QUFDQSxTQUFPLENBQ0wsRUFBQyxZQUFEO0FBQWMsSUFBQSxJQUFJLEVBQUM7QUFBbkIsS0FDRSxFQUFDb1MsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFLEVBQUMsT0FBRDtBQUFwQixLQUNFLEVBQUMsS0FBRDtBQUFPLElBQUEsT0FBTyxFQUFFcE8sT0FBaEI7QUFBeUIsSUFBQSxPQUFPLEVBQUV3UDtBQUFsQyxJQURGLENBREYsQ0FESyxFQU1MLEVBQUMsWUFBRDtBQUFjLElBQUEsS0FBSyxFQUFFLENBQUMsVUFBRCxFQUFhLFdBQWI7QUFBckIsS0FDRSxFQUFDcEIsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFLEVBQUMsT0FBRDtBQUFwQixLQUNFLEVBQUMsT0FBRDtBQUFTLElBQUEsT0FBTyxFQUFFcE8sT0FBbEI7QUFBMkIsSUFBQSxTQUFTLEVBQUUwUDtBQUF0QyxJQURGLENBREYsQ0FOSyxFQVdMLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0UsRUFBQ3RCLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRSxFQUFDLE9BQUQ7QUFBcEIsS0FDRSxFQUFDLFNBQUQ7QUFBVyxJQUFBLE9BQU8sRUFBRXBPLE9BQXBCO0FBQTZCLElBQUEsWUFBWSxFQUFFd087QUFBM0MsSUFERixDQURGLENBWEssRUFnQkwsRUFBQyxZQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUUsQ0FDTCxXQURLLEVBRUwsV0FGSyxFQUdMLFlBSEssRUFJTCxXQUpLLEVBS0wsVUFMSyxFQU1MLFVBTkssRUFPTCxZQVBLLEVBUUwsWUFSSyxFQVNMLE9BVEs7QUFEVCxLQWFFLEVBQUNKLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRSxFQUFDLE9BQUQ7QUFBcEIsS0FDRSxFQUFDLFFBQUQ7QUFDRSxJQUFBLE9BQU8sRUFBRWpPLE9BRFg7QUFFRSxJQUFBLFlBQVksRUFBRXFPLFlBRmhCO0FBR0UsSUFBQSxPQUFPLEVBQUV4TyxPQUhYO0FBSUUsSUFBQSxhQUFhLEVBQUU0TyxhQUpqQjtBQUtFLElBQUEsU0FBUyxFQUFFVSxTQUxiO0FBTUUsSUFBQSxRQUFRLEVBQUVwUCxRQU5aO0FBT0UsSUFBQSxRQUFRLEVBQUVrQyxRQVBaO0FBUUUsSUFBQSxXQUFXLEVBQUUvQixXQVJmO0FBU0UsSUFBQSxRQUFRLEVBQUVyRDtBQVRaLElBREYsQ0FiRixDQWhCSyxFQTRDTCxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUNvUixDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUUsRUFBQyxPQUFEO0FBQXBCLEtBQ0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxPQUFPLEVBQUVqTyxPQURYO0FBRUUsSUFBQSxPQUFPLEVBQUVILE9BRlg7QUFHRSxJQUFBLFFBQVEsRUFBRTZPLFFBSFo7QUFJRSxJQUFBLGFBQWEsRUFBRUQsYUFKakI7QUFLRSxJQUFBLFdBQVcsRUFBRXZPO0FBTGYsSUFERixDQURGLENBNUNLLEVBdURMLEVBQUMsWUFBRDtBQUFjLElBQUEsS0FBSyxFQUFFLENBQUMsVUFBRCxFQUFhLFdBQWI7QUFBckIsS0FDRSxFQUFDK04sQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFLEVBQUMsT0FBRDtBQUFwQixLQUNFLEVBQUMsT0FBRDtBQUFTLElBQUEsT0FBTyxFQUFFcE8sT0FBbEI7QUFBMkIsSUFBQSxPQUFPLEVBQUVHO0FBQXBDLElBREYsQ0FERixDQXZESyxFQTRETCxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUNpTyxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUUsRUFBQyxPQUFEO0FBQXBCLEtBQ0UsRUFBQyxPQUFEO0FBQ0UsSUFBQSxPQUFPLEVBQUVqTyxPQURYO0FBRUUsSUFBQSxPQUFPLEVBQUVILE9BRlg7QUFHRSxJQUFBLFFBQVEsRUFBRWlQLFFBSFo7QUFJRSxJQUFBLFNBQVMsRUFBRUc7QUFKYixJQURGLENBREYsQ0E1REssRUFzRUwsRUFBQyxZQUFEO0FBQWMsSUFBQSxJQUFJLEVBQUM7QUFBbkIsS0FDRSxFQUFDaEIsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFLEVBQUMsT0FBRDtBQUFwQixLQUNFLEVBQUMsY0FBRDtBQUNFLElBQUEsY0FBYyxFQUFFbk8sY0FEbEI7QUFFRSxJQUFBLGNBQWMsRUFBRXVTLGNBRmxCO0FBR0UsSUFBQSxjQUFjLEVBQUVDO0FBSGxCLElBREYsQ0FERixDQXRFSyxFQStFTCxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUNyRSxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUUsRUFBQyxPQUFEO0FBQXBCLEtBQ0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxjQUFjLEVBQUV3RCxjQURsQjtBQUVFLElBQUEsWUFBWSxFQUFFalIsWUFGaEI7QUFHRSxJQUFBLFFBQVEsRUFBRW1SLFFBSFo7QUFJRSxJQUFBLGFBQWEsRUFBRUQsYUFKakI7QUFLRSxJQUFBLE1BQU0sRUFBRW5SO0FBTFYsSUFERixDQURGLENBL0VLLEVBMEZMLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0UsRUFBQzBOLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRSxFQUFDLE9BQUQ7QUFBcEIsS0FDRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLGFBQWEsRUFBRWtFLGFBRGpCO0FBRUUsSUFBQSxZQUFZLEVBQUU5RCxZQUZoQjtBQUdFLElBQUEsTUFBTSxFQUFFM04sTUFIVjtBQUlFLElBQUEsYUFBYSxFQUFFdVIsYUFKakI7QUFLRSxJQUFBLFlBQVksRUFBRXRSLFlBTGhCO0FBTUUsSUFBQSxjQUFjLEVBQUV1UjtBQU5sQixJQURGLENBREYsQ0ExRkssQ0FBUDtBQXVHRDs7QUFFRCxTQUFTZ0IsT0FBVCxHQUFtQjtBQUNqQixTQUFPO0FBQUssbUJBQVk7QUFBakIsZUFBUDtBQUNEOzs7Ozs7O0FDdktjLFNBQVNDLFFBQVQsQ0FBa0IxVyxLQUFsQixFQUF5QjtBQUN0QyxRQUFNO0FBQUUyVyxJQUFBQTtBQUFGLE1BQVkzVyxLQUFsQjtBQUNBLFNBQ0Usc0JBQ01BLEtBRE47QUFFRSxJQUFBLEtBQUssRUFBQyxLQUZSO0FBR0UsSUFBQSxNQUFNLEVBQUMsS0FIVDtBQUlFLElBQUEsT0FBTyxFQUFDLFdBSlY7QUFLRSxJQUFBLFNBQVMsRUFBQyxZQUxaO0FBTUUsSUFBQSxJQUFJLEVBQUUyVyxLQU5SO0FBT0UsSUFBQSxLQUFLLEVBQUM7QUFQUixNQVNFLHVCQUNNM1csS0FETjtBQUVFLGlCQUFVLFNBRlo7QUFHRSxJQUFBLENBQUMsRUFBQztBQUhKLEtBVEYsRUFjRSx1QkFDTUEsS0FETjtBQUVFLGlCQUFVLFNBRlo7QUFHRSxJQUFBLENBQUMsRUFBQztBQUhKLEtBZEYsQ0FERjtBQXNCRDs7QUN6QmMsU0FBUzRXLGNBQVQsQ0FBd0I1VyxLQUF4QixFQUErQjtBQUM1QyxRQUFNO0FBQUU2VyxJQUFBQSxLQUFGO0FBQVNDLElBQUFBO0FBQVQsTUFBb0I5VyxLQUExQjtBQUNBLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRTZXLEtBRFQ7QUFFRSxJQUFBLE1BQU0sRUFBRUMsTUFGVjtBQUdFLElBQUEsT0FBTyxFQUFDLFdBSFY7QUFJRSxJQUFBLFNBQVMsRUFBQyxtQkFKWjtBQUtFLElBQUEsSUFBSSxFQUFDLE9BTFA7QUFNRSxJQUFBLEtBQUssRUFBQztBQU5SLEtBUUU7QUFDRSxpQkFBVSxTQURaO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQVJGLEVBWUU7QUFDRSxpQkFBVSxTQURaO0FBRUUsSUFBQSxDQUFDLEVBQUM7QUFGSixJQVpGLENBREY7QUFtQkQ7O0FDUk0sU0FBU0MsYUFBVCxHQUF5QjtBQUM5QixRQUFNO0FBQUV2UixJQUFBQTtBQUFGLE1BQWV3SSxXQUFXLEVBQWhDO0FBQ0EsUUFBTTtBQUFFOEIsSUFBQUE7QUFBRixNQUFnQlIsT0FBTyxFQUE3QjtBQUNBLFFBQU07QUFBRWxRLElBQUFBLEtBQUY7QUFBU3dTLElBQUFBO0FBQVQsTUFBMEJGLFdBQVcsRUFBM0M7QUFDQSxRQUFNO0FBQUV0TyxJQUFBQSxPQUFGO0FBQVdDLElBQUFBO0FBQVgsTUFBOEJqRSxLQUFwQztBQUNBLFNBQ0UsZUFDRSxFQUFDLE1BQUQ7QUFBUSxJQUFBLEtBQUssRUFBQyxRQUFkO0FBQXVCLElBQUEsRUFBRSxFQUFDO0FBQTFCLEtBQ0UsRUFBQyxjQUFELFFBQ0UsRUFBQyxTQUFELFFBQ0UsRUFBQyxPQUFELFFBQ0dvRyxRQUFRLElBQ1AsRUFBQyxPQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsUUFETDtBQUVFLElBQUEsUUFBUSxFQUFDLFdBRlg7QUFHRSxtQkFBWTtBQUhkLGdCQUZKLENBREYsQ0FERixFQWNFLEVBQUMsR0FBRDtBQUFLLElBQUEsbUJBQW1CLEVBQUM7QUFBekIsS0FDR0EsUUFBUSxJQUNQO0FBQ0UsSUFBQSxFQUFFLEVBQUMsUUFETDtBQUVFLElBQUEsUUFBUSxFQUFDLFNBRlg7QUFHRSxJQUFBLE9BQU8sRUFBRW9NLFlBSFg7QUFJRSxtQkFBWSxhQUpkO0FBS0UsSUFBQSxJQUFJLEVBQUMsUUFMUDtBQU1FLElBQUEsS0FBSyxFQUFDO0FBTlIsaUJBUVcsR0FSWCxFQVNFO0FBQU0sSUFBQSxLQUFLLEVBQUMsbUJBQVo7QUFBZ0MsbUJBQVk7QUFBNUMsS0FDR3ZPLGNBQWMsR0FBR0EsY0FBYyxDQUFDK0MsTUFBbEIsR0FBMkIsQ0FENUMsQ0FURixDQUZKLEVBZ0JHLENBQUNaLFFBQUQsSUFDQyxFQUFDLE9BQUQsUUFDRSxFQUFDLE9BQUQ7QUFBUyxJQUFBLEVBQUUsRUFBQyxPQUFaO0FBQW9CLElBQUEsUUFBUSxFQUFDLE9BQTdCO0FBQXFDLG1CQUFZO0FBQWpELGVBREYsQ0FqQkosRUF1QkcsQ0FBQ0EsUUFBRCxJQUNDLEVBQUMsT0FBRCxRQUNFLEVBQUMsT0FBRDtBQUFTLElBQUEsRUFBRSxFQUFDLFFBQVo7QUFBcUIsSUFBQSxRQUFRLEVBQUMsT0FBOUI7QUFBc0MsbUJBQVk7QUFBbEQsZUFERixDQXhCSixFQThCRSxFQUFDLE9BQUQsUUFDR0EsUUFBUSxJQUNQLEVBQUMsT0FBRDtBQUNFLElBQUEsRUFBRSxFQUFDLFNBREw7QUFFRSxJQUFBLFFBQVEsRUFBQyxPQUZYO0FBR0UsbUJBQVk7QUFIZCxrQkFLWUEsUUFMWixDQUZKLENBOUJGLEVBeUNFLEVBQUMsT0FBRCxRQUNHQSxRQUFRLElBQ1AsRUFBQyxPQUFEO0FBQ0UsSUFBQSxFQUFFLEVBQUMsU0FETDtBQUVFLElBQUEsUUFBUSxFQUFDLE9BRlg7QUFHRSxtQkFBWSxjQUhkO0FBSUUsSUFBQSxPQUFPLEVBQUVzSztBQUpYLGdCQUZKLENBekNGLEVBcURFLEVBQUMsT0FBRCxRQUNHMU0sT0FBTyxJQUNOO0FBQ0UsSUFBQSxTQUFTLEVBQUMsS0FEWjtBQUVFLG1CQUFZLFlBRmQ7QUFHRSxJQUFBLEVBQUUsRUFBQyxXQUhMO0FBSUUsSUFBQSxPQUFPLEVBQUV3TztBQUpYLEtBTUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxLQUFLLEVBQUM7QUFBaEIsSUFORixDQUZKLENBckRGLEVBaUVFLEVBQUMsT0FBRCxRQUNFLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0U7QUFDRSxJQUFBLFNBQVMsRUFBQyxLQURaO0FBRUUsbUJBQVksYUFGZDtBQUdFLElBQUEsRUFBRSxFQUFDLFFBSEw7QUFJRSxJQUFBLE9BQU8sRUFBRUE7QUFKWCxLQU1FLEVBQUMsY0FBRDtBQUFnQixJQUFBLEtBQUssRUFBQyxPQUF0QjtBQUE4QixJQUFBLE1BQU0sRUFBQztBQUFyQyxJQU5GLENBREYsQ0FERixDQWpFRixDQWRGLENBREYsQ0FERixDQURGO0FBbUdEOztBQ3BITSxTQUFTb0YsSUFBVCxHQUFnQjtBQUNyQixTQUNFO0FBQUssbUJBQVksTUFBakI7QUFBd0IsSUFBQSxLQUFLLEVBQUU7QUFBRUMsTUFBQUEsVUFBVSxFQUFFO0FBQWQ7QUFBL0IsWUFERjtBQUtEOztBQ0ZELE1BQU1ULHVCQUFxQixHQUFHdEYsQ0FBSSxDQUFDLE1BQ2pDLHVFQURnQyxDQUFsQztBQUlPLFNBQVNnRyxTQUFULEdBQXFCO0FBQzFCLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFSixNQUFBQSxNQUFNLEVBQUU7QUFBVjtBQUFaLEtBQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNFLEVBQUNLLGlCQUFELE9BREYsQ0FERixFQUlFLEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDRSxFQUFDLElBQUQsT0FERixDQUpGLEVBUUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNFLEVBQUMzRixDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDZ0YsdUJBQUQsT0FERixDQURGLENBUkYsQ0FERjtBQWdCRDs7QUN2Qk0sU0FBU1ksR0FBVCxHQUFlO0FBQ3BCLFNBQ0UsZUFDRSxFQUFDLGFBQUQsT0FERixFQUVFLEVBQUMsU0FBRCxPQUZGLEVBR0csRUFISCxDQURGO0FBT0Q7O0FDUkRDLEtBQUssQ0FBQ0MsVUFBTixDQUNFLDBDQURGLEVBRUUsMENBRkY7O0FBSUFELEtBQUssQ0FBQ0UsU0FBTixHQUFtQixXQUFVckQsZUFBRyxhQUFoQztBQUVBO0FBQ0E7O0FBQ0FzRCxDQUFNLENBQ0osRUFBQyxZQUFELFFBQ0UsRUFBQyxHQUFELE9BREYsQ0FESSxFQUtKQyxRQUFRLENBQUM3SyxJQUxMLENBQU47Ozs7In0=
