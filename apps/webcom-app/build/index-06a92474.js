var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob:
    'FileReader' in self &&
    'Blob' in self &&
    (function() {
      try {
        new Blob();
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ];

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    };
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value}
    }
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    };
  }

  return iterator
}

function Headers(headers) {
  this.map = {};

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name]);
    }, this);
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)];
};

Headers.prototype.get = function(name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null
};

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
};

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

Headers.prototype.keys = function() {
  var items = [];
  this.forEach(function(value, name) {
    items.push(name);
  });
  return iteratorFor(items)
};

Headers.prototype.values = function() {
  var items = [];
  this.forEach(function(value) {
    items.push(value);
  });
  return iteratorFor(items)
};

Headers.prototype.entries = function() {
  var items = [];
  this.forEach(function(value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items)
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true;
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result);
    };
    reader.onerror = function() {
      reject(reader.error);
    };
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function(body) {
    this._bodyInit = body;
    if (!body) {
      this._bodyText = '';
    } else if (typeof body === 'string') {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer);
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8');
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type);
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
      }
    }
  };

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    };

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    };
  }

  this.text = function() {
    var rejected = consumed(this);
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  };

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    };
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  };

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  options = options || {};
  var body = options.body;

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
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

  this.credentials = options.credentials || this.credentials || 'same-origin';
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }
  this.method = normalizeMethod(options.method || this.method || 'GET');
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal;
  this.referrer = null;

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body);
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
};

function decode(body) {
  var form = new FormData();
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':');
    var key = parts.shift().trim();
    if (key) {
      var value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers
}

Body.call(Request.prototype);

function Response(bodyInit, options) {
  if (!options) {
    options = {};
  }

  this.type = 'default';
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = 'statusText' in options ? options.statusText : 'OK';
  this.headers = new Headers(options.headers);
  this.url = options.url || '';
  this._initBody(bodyInit);
}

Body.call(Response.prototype);

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
};

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''});
  response.type = 'error';
  return response
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
};

var DOMException = self.DOMException;
try {
  new DOMException();
} catch (err) {
  DOMException = function(message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };
  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;
      resolve(new Response(body, options));
    };

    xhr.onerror = function() {
      reject(new TypeError('Network request failed'));
    };

    xhr.ontimeout = function() {
      reject(new TypeError('Network request failed'));
    };

    xhr.onabort = function() {
      reject(new DOMException('Aborted', 'AbortError'));
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob';
    }

    request.headers.forEach(function(value, name) {
      xhr.setRequestHeader(name, value);
    });

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
  })
}

fetch.polyfill = true;

if (!self.fetch) {
  self.fetch = fetch;
  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;
}

var n,u,i,t,o,r,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var i,t=arguments,o={};for(i in l)"key"!==i&&"ref"!==i&&(o[i]=l[i]);if(arguments.length>3)for(u=[u],i=3;i<arguments.length;i++)u.push(t[i]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===o[i]&&(o[i]=n.defaultProps[i]);return p(n,o,l&&l.key,l&&l.ref,null)}function p(l,u,i,t,o){var r={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),n.vnode&&n.vnode(r),r}function d(n){return n.children}function m(n,l){this.props=n,this.context=l;}function w(n,l){if(null==l)return n.__?w(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?w(n):null}function g(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return g(n)}}function k(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!i++||o!==n.debounceRendering)&&((o=n.debounceRendering)||t)(_);}function _(){for(var n;i=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(i=a({},o)).__v=i,t=A(f,o,i,l.__n,void 0!==f.ownerSVGElement,null,u,null==r?w(o):r),T(u,o),t!=r&&g(o)));});}function b(n,l,u,i,t,o,r,f,s){var a,h,p,y,d,m,g,k=u&&u.__k||c,_=k.length;if(f==e&&(f=null!=o?o[0]:_?w(u,0):null),a=0,l.__k=x(l.__k,function(u){if(null!=u){if(u.__=l,u.__b=l.__b+1,null===(p=k[a])||p&&u.key==p.key&&u.type===p.type)k[a]=void 0;else for(h=0;h<_;h++){if((p=k[h])&&u.key==p.key&&u.type===p.type){k[h]=void 0;break}p=null;}if(y=A(n,u,p=p||e,i,t,o,r,f,s),(h=u.ref)&&p.ref!=h&&(g||(g=[]),p.ref&&g.push(p.ref,null,u),g.push(h,u.__c||y,u)),null!=y){var c;if(null==m&&(m=y),void 0!==u.__d)c=u.__d,u.__d=void 0;else if(o==p||y!=f||null==y.parentNode){n:if(null==f||f.parentNode!==n)n.appendChild(y),c=null;else {for(d=f,h=0;(d=d.nextSibling)&&h<_;h+=2)if(d==y)break n;n.insertBefore(y,f),c=f;}"option"==l.type&&(n.value="");}f=void 0!==c?c:y.nextSibling,"function"==typeof l.type&&(l.__d=f);}else f&&p.__e==f&&f.parentNode!=n&&(f=w(p));}return a++,u}),l.__e=m,null!=o&&"function"!=typeof l.type)for(a=o.length;a--;)null!=o[a]&&v(o[a]);for(a=_;a--;)null!=k[a]&&D(k[a],k[a]);if(g)for(a=0;a<g.length;a++)j(g[a],g[++a],g[++a]);}function x(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var i=0;i<n.length;i++)x(n[i],l,u);else u.push(l?l("string"==typeof n||"number"==typeof n?p(null,n,null,null,n):null!=n.__e||null!=n.__c?p(n.type,n.props,n.key,null,n.__v):n):n);return u}function P(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||N(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||N(n,o,l[o],u[o],i);}function C(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===s.test(l)?u+"px":null==u?"":u;}function N(n,l,u,i,t){var o,r,f,e,c;if(t?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else {if("string"==typeof i&&(o.cssText="",i=null),i)for(e in i)u&&e in u||C(o,e,"");if(u)for(c in u)i&&u[c]===i[c]||C(o,c,u[c]);}else "o"===l[0]&&"n"===l[1]?(r=l!==(l=l.replace(/Capture$/,"")),f=l.toLowerCase(),l=(f in n?f:l).slice(2),u?(i||n.addEventListener(l,z,r),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,z,r)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u));}function z(l){this.l[l.type](n.event?n.event(l):l);}function A(l,u,i,t,o,r,f,e,c){var s,v,h,p,y,w,g,k,_,x,P=u.type;if(void 0!==u.constructor)return null;(s=n.__b)&&s(u);try{n:if("function"==typeof P){if(k=u.props,_=(s=P.contextType)&&t[s.__c],x=s?_?_.props.value:s.__:t,i.__c?g=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(k,x):(u.__c=v=new m(k,x),v.constructor=P,v.render=E),_&&_.sub(v),v.props=k,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=a({},v.__s)),a(v.__s,P.getDerivedStateFromProps(k,v.__s))),p=v.props,y=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&k!==p&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(k,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(k,v.__s,x)||u.__v===i.__v&&!v.__){for(v.props=k,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v),s=0;s<u.__k.length;s++)u.__k[s]&&(u.__k[s].__=u);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(k,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(p,y,w);});}v.context=x,v.props=k,v.state=v.__s,(s=n.__r)&&s(u),v.__d=!1,v.__v=u,v.__P=l,s=v.render(v.props,v.state,v.context),u.__k=null!=s&&s.type==d&&null==s.key?s.props.children:Array.isArray(s)?s:[s],null!=v.getChildContext&&(t=a(a({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(w=v.getSnapshotBeforeUpdate(p,y)),b(l,u,i,t,o,r,f,e,c),v.base=u.__e,v.__h.length&&f.push(v),g&&(v.__E=v.__=null),v.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=$(i.__e,u,i,t,o,r,f,c);(s=n.diffed)&&s(u);}catch(l){u.__v=null,n.__e(l,u,i);}return u.__e}function T(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n.__e(l,u.__v);}});}function $(n,l,u,i,t,o,r,f){var s,a,v,h,p,y=u.props,d=l.props;if(t="svg"===l.type||t,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,f=!1;}if(null===l.type)y!==d&&n.data!=d&&(n.data=d);else {if(null!=o&&(o=c.slice.call(n.childNodes)),v=(y=u.props||e).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!f){if(y===e)for(y={},p=0;p<n.attributes.length;p++)y[n.attributes[p].name]=n.attributes[p].value;(h||v)&&(h&&v&&h.__html==v.__html||(n.innerHTML=h&&h.__html||""));}P(n,d,y,t,f),l.__k=l.props.children,h||b(n,l,u,i,"foreignObject"!==l.type&&t,o,r,e,f),f||("value"in d&&void 0!==d.value&&d.value!==n.value&&(n.value=null==d.value?"":d.value),"checked"in d&&void 0!==d.checked&&d.checked!==n.checked&&(n.checked=d.checked));}return n}function j(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,i);}}function D(l,u,i){var t,o,r;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||j(t,null,u)),i||"function"==typeof l.type||(i=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(r=0;r<t.length;r++)t[r]&&D(t[r],u,i);null!=o&&v(o);}function E(n,l,u){return this.constructor(n,u)}function H(l,u,i){var t,o,f;n.__&&n.__(l,u),o=(t=i===r)?null:i&&i.__k||u.__k,l=h(d,null,[l]),f=[],A(u,(t?u:i||u).__k=l,o||e,e,void 0!==u.ownerSVGElement,i&&!t?[i]:o?null:c.slice.call(u.childNodes),f,i||e,t),T(f,l);}function M(n){var l={},u={__c:"__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var i,t=this;return this.getChildContext||(i=[],this.getChildContext=function(){return l[u.__c]=t,l},this.shouldComponentUpdate=function(n){t.props.value!==n.value&&i.some(function(l){l.context=n.value,k(l);});},this.sub=function(n){i.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){i.splice(i.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Consumer.contextType=u,u}n={__e:function(n,l){for(var u,i;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(i=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(i=!0,u.componentDidCatch(n)),i)return k(u.__E=u)}catch(l){n=l;}throw n}},m.prototype.setState=function(n,l){var u;u=this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),k(this));},m.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),k(this));},m.prototype.render=d,u=[],i=0,t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,r=e,f=0;

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

var t$1,r$1,u$1,i$1=[],o$1=n.__r,f$1=n.diffed,c$1=n.__c,e$1=n.unmount;function a$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v$1(n){return m$1(x$1,n)}function m$1(n,u,i){var o=a$1(t$1++);return o.__c||(o.__c=r$1,o.__=[i?i(u):x$1(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p$1(n,u){var i=a$1(t$1++);q(i.__H,u)&&(i.__=n,i.__H=u,r$1.__H.__h.push(i));}function y(n){return s$1(function(){return {current:n}},[])}function s$1(n,r){var u=a$1(t$1++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__;var i=a$1(t$1++);return null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value}function F(){i$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(_$1),t.__H.__h.forEach(g$1),t.__H.__h=[];}catch(r){return t.__H.__h=[],n.__e(r,t.__v),!0}}),i$1=[];}function _$1(n){n.t&&n.t();}function g$1(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o$1&&o$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.__h.forEach(_$1),r$1.__H.__h.forEach(g$1),r$1.__H.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i$1.push(r)&&u$1===n.requestAnimationFrame||((u$1=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_$1),t.__h=t.__h.filter(function(n){return !n.__||g$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c$1&&c$1(t,r);},n.unmount=function(t){e$1&&e$1(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

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

function FeatureRoute(props) {
  const {
    children,
    path,
    paths
  } = props;
  const [state, dispatch] = useAppRouteContext();
  const {
    featureRoute
  } = state;

  if (path && featureRoute === path) {
    return children;
  } else if (paths && featureRoute === paths.find(p => p === featureRoute)) {
    return children;
  }

  return null;
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

const actionTypes$1 = {
  SENDING_HANGOUT_STARTED: 'SENDING_HANGOUT_STARTED',
  SENDING_HANGOUT_FULLFILLED: 'SENDING_HANGOUT_FULLFILLED',
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOADED_MESSAGES: 'LOADED_MESSAGES',
  SEARCH_INPUT_CHANGE: 'SEARCH_INPUT_CHANGE',
  SELECTED_HANGOUT: 'SELECTED_HANGOUT',
  CLEARED_HANGOUT: 'CLEARED_HANGOUT',
  FETCH_HANGOUT_STARTED: 'FETCH_HANGOUT_STARTED',
  FETCH_HANGOUT_SUCCESS: 'FETCH_HANGOUT_SUCCESS',
  FETCH_HANGOUT_FAILED: 'FETCH_HANGOUT_FAILED',
  ERROR_RECIEVED: 'ERROR_RECIEVED',
  ONLINE_STATE_CHANGED: 'ONLINE_STATE_CHANGED',
  SERVER_MESSAGE_RECIEVED: 'SERVER_MESSAGE_RECIEVED',
  MESSAGES_UPDATED: 'MESSAGES_UPDATED',
  HANGOUTS_UPDATED: 'HANGOUTS_UPDATED',
  HANGOUT_UPDATED: 'HANGOUT_UPDATED',
  UNREAD_HANGOUTS_UPDATED: 'UNREAD_HANGOUTS_UPDATED',
  //SOCKET
  CONNECTING: 'CONNECTING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED',
  SOCKET_READY: 'SOCKET_READY',
  SOCKET_ERROR: 'SOCKET_ERROR'
};

const initState = {
  hangouts: null,
  hangout: null,
  unreadhangouts: null,
  messages: null,
  search: '',
  user: [],
  loading: false,
  error: null,
  messageText: '',
  online: false,
  socket: null,
  readyState: 0,
  socketMessage: null,
  fetchHangouts: false,
  pendingHangout: null,
  message: null
};
function reducer$1(state, action) {
  switch (action.type) {
    case actionTypes$1.ERROR_RECIEVED:
      return { ...state,
        error: action.error
      };

    case actionTypes$1.SENDING_HANGOUT_FULLFILLED:
      return { ...state,
        pendingHangout: null
      };

    case actionTypes$1.SENDING_HANGOUT_STARTED:
      return { ...state,
        pendingHangout: action.pendingHangout
      };

    case actionTypes$1.CLEARED_HANGOUT:
      return { ...state,
        hangout: null
      };

    case actionTypes$1.UNREAD_HANGOUTS_UPDATED:
      return { ...state,
        unreadhangouts: action.unreadhangouts
      };

    case actionTypes$1.HANGOUT_UPDATED:
      return { ...state,
        hangout: action.hangout
      };

    case actionTypes$1.HANGOUTS_UPDATED:
      return { ...state,
        hangouts: action.hangouts
      };

    case actionTypes$1.MESSAGES_UPDATED:
      return { ...state,
        messages: action.messages
      };

    case actionTypes$1.SERVER_MESSAGE_RECIEVED:
      return { ...state,
        message: action.message
      };

    case actionTypes$1.LOADED_MESSAGES:
      return { ...state,
        messages: action.messages
      };

    case actionTypes$1.MESSAGE_TEXT_CHANGED:
      return { ...state,
        messageText: action.text
      };

    case actionTypes$1.FETCH_USER_FAILED:
    case actionTypes$1.FETCH_HANGOUT_FAILED:
      return { ...state,
        loading: false,
        error: action.error,
        fetchHangouts: false
      };

    case actionTypes$1.FETCH_HANGOUT_STARTED:
      return { ...state,
        loading: true,
        fetchHangouts: true
      };

    case actionTypes$1.FETCH_HANGOUT_SUCCESS:
      return { ...state,
        loading: false,
        hangouts: action.hangouts,
        fetchHangouts: false
      };

    case actionTypes$1.FILTER_HANGOUTS:
      return { ...state,
        hangouts: state.hangouts.filter(g => g.username.includes(state.search))
      };

    case actionTypes$1.SEARCH_INPUT_CHANGE:
      return { ...state,
        search: action.search
      };

    case actionTypes$1.LOAD_HANGOUTS:
      return { ...state,
        hangouts: action.hangouts
      };

    case actionTypes$1.SELECTED_HANGOUT:
      return { ...state,
        hangout: action.hangout
      };
    //SOCKET

    case actionTypes$1.SOCKET_ERROR:
      return { ...state,
        error: action.error
      };

    case actionTypes$1.CONNECTING:
      return { ...state,
        readyState: 0
      };

    case actionTypes$1.OPEN:
      return { ...state,
        readyState: 1
      };

    case actionTypes$1.CLOSING:
      return { ...state,
        readyState: 2
      };

    case actionTypes$1.CLOSED:
      return { ...state,
        readyState: 3
      };

    case actionTypes$1.SOCKET_READY:
      return { ...state,
        socket: action.socket
      };

    default:
      return state;
  }
}

const hangoutStates = {
  INVITER: 'INVITER',
  ACCEPTER: 'ACCEPTER',
  DECLINER: 'DECLINER',
  BLOCKER: 'BLOCKER',
  UNBLOCKER: 'UNBLOCKER',
  MESSANGER: 'MESSANGER',
  // acknowlegement
  INVITED: 'INVITED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  BLOCKED: 'BLOCKED',
  UNBLOCKED: 'UNBLOCKED',
  MESSAGED: 'MESSAGED'
};

function updateDeliveredHangout({
  name,
  dispatch,
  hangout,
  offline,
  onAppRoute
}) {
  const {
    username,
    message,
    timestamp
  } = hangout;
  const deliveredHangout = { ...hangout,
    delivered: true
  };
  const hangoutKey = `${name}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = hangouts.findIndex(g => g.username === username);
  hangouts.splice(hangoutIndex, 1, deliveredHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
  dispatch({
    type: actionTypes$1.HANGOUTS_UPDATED,
    hangouts
  });
  dispatch({
    type: actionTypes$1.HANGOUT_UPDATED,
    hangout: deliveredHangout
  });

  if (message) {
    updateDeliveredMessage({
      dispatch,
      name,
      deliveredHangout,
      hangout
    });
  }

  if (hangout.state === 'BLOCKED') {
    debugger;
    updateBockedState({
      dispatch,
      name,
      deliveredHangout
    });
  }

  if (offline) {
    //remove offline hangout
    const offlineHangoutKey = `${name}-offline-hangouts`;
    const offlinehangouts = JSON.parse(localStorage.getItem(offlineHangoutKey));

    if (offlinehangouts) {
      const hangoutIndex = offlinehangouts.findIndex(o => o.timestamp === timestamp);
      localStorage.setItem(offlineHangoutKey, JSON.stringify(offlinehangouts.splice(hangoutIndex, 1)));
    }
  }

  if (hangout.state !== 'MESSANGER') {
    onAppRoute({
      featureRoute: `/${hangout.state}`,
      route: '/hangouts'
    });
  }
}
function updateDeliveredMessage({
  dispatch,
  name,
  deliveredHangout
}) {
  const {
    username,
    message
  } = deliveredHangout;
  const deliveredMessage = { ...message,
    username: name,
    delivered: true
  }; // save message to localStorage

  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const hangoutIndex = messages.findIndex(m => m.timestamp === message.timestamp);
  messages.splice(hangoutIndex, 1, deliveredMessage);
  localStorage.setItem(messageKey, JSON.stringify(messages));
  dispatch({
    type: actionTypes$1.MESSAGES_UPDATED,
    messages
  });
}
function updateBockedState({
  dispatch,
  deliveredHangout,
  name
}) {
  debugger;
  const {
    username
  } = deliveredHangout;
  const blockedMessage = {
    timestamp: deliveredHangout.timestamp,
    text: 'you blocked this user',
    username: name,
    type: 'blocked'
  };
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  localStorage.setItem(messageKey, JSON.stringify([...messages, blockedMessage]));
  dispatch({
    type: actionTypes$1.MESSAGES_UPDATED,
    messages: [...messages, blockedMessage]
  });
}

function saveMessaged({
  dispatch,
  hangout,
  name,
  offline,
  onAppRoute
}) {
  updateDeliveredHangout({
    dispatch,
    name,
    hangout,
    offline,
    onAppRoute
  });
}
function saveInvited({
  dispatch,
  hangout,
  name,
  offline,
  onAppRoute
}) {
  updateDeliveredHangout({
    dispatch,
    name,
    hangout,
    offline,
    onAppRoute
  });
}
function saveAccepted({
  dispatch,
  hangout,
  name,
  offline,
  onAppRoute
}) {
  updateDeliveredHangout({
    dispatch,
    name,
    hangout,
    offline,
    onAppRoute
  });
}
function saveDeclined({
  dispatch,
  hangout,
  name,
  offline,
  onAppRoute
}) {
  updateDeliveredHangout({
    dispatch,
    name,
    hangout,
    offline,
    onAppRoute
  });
}
function saveBlocked({
  dispatch,
  hangout,
  name,
  offline,
  onAppRoute
}) {
  updateDeliveredHangout({
    dispatch,
    name,
    hangout,
    offline,
    onAppRoute
  });
}
function saveUnblovked({
  dispatch,
  hangout,
  name,
  offline,
  onAppRoute
}) {
  updateDeliveredHangout({
    dispatch,
    name,
    hangout,
    offline,
    onAppRoute
  });
}

function saveRecievedHangout({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  const {
    username,
    message
  } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));

  if (hangouts) {
    const hangoutExist = hangouts.find(hg => hg.username === username);

    if (hangoutExist) {
      const hangoutIndex = hangouts.findIndex(g => g.username === username);

      if (focusedHangout && focusedHangout.username === username) {
        hangouts.splice(hangoutIndex, 1, { ...hangout,
          read: true
        }); // sync message with reducer state
      } else {
        hangouts.splice(hangoutIndex, 1, { ...hangout,
          read: false
        });
      }

      localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
      dispatch({
        type: actionTypes$1.HANGOUTS_UPDATED,
        hangouts
      });
    } //end of hangout exist
    else {
        let updatedHangouts = null;

        if (focusedHangout && focusedHangout.username === username) {
          updatedHangouts = [...hangouts, { ...hangout,
            read: true
          }];
        } else {
          updatedHangouts = [...hangouts, { ...hangout,
            read: false
          }];
        }

        localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
        dispatch({
          type: actionTypes$1.HANGOUTS_UPDATED,
          hangouts: updatedHangouts
        });
      }
  } else {
    let updatedHangouts = null;

    if (focusedHangout && focusedHangout.username === username) {
      updatedHangouts = [{ ...hangout,
        read: true
      }];
    } else {
      updatedHangouts = [{ ...hangout,
        read: false
      }];
    }

    localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
    dispatch({
      type: actionTypes$1.HANGOUTS_UPDATED,
      hangouts: updatedHangouts
    });
  }

  if (focusedHangout && focusedHangout.username === username) {
    dispatch({
      type: actionTypes$1.SELECTED_HANGOUT,
      username: hangout.username
    });

    if (hangout.state !== 'MESSANGER') {
      onAppRoute({
        featureRoute: `/${hangout.state}`,
        route: '/hangouts'
      });
    }
  }

  if (message) {
    saveRecievedMessage({
      dispatch,
      hangout,
      name,
      focusedHangout
    });
  }

  if (unread) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
      case hangoutStates.INVITER:
      case hangoutStates.MESSANGER:
        saveUnreadHangout({
          name,
          hangout,
          dispatch
        });
        break;
    }
  }
}
function saveRecievedMessage({
  dispatch,
  hangout,
  name,
  focusedHangout
}) {
  const {
    username,
    message
  } = hangout; // save message to localStorage

  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  let updatedMessages = null;

  if (messages) {
    if (focusedHangout && focusedHangout.username === username) {
      updatedMessages = [...messages, { ...message,
        username,
        read: true
      }];
    } else {
      updatedMessages = [...messages, { ...message,
        username,
        read: false
      }];
    }
  } else {
    if (focusedHangout && focusedHangout.username === username) {
      updatedMessages = [{ ...message,
        username,
        read: true
      }];
    } else {
      updatedMessages = [{ ...message,
        username,
        read: false
      }];
    }
  }

  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));

  if (focusedHangout && focusedHangout.username === username) {
    // sync message with reducer state
    dispatch({
      type: actionTypes$1.MESSAGES_UPDATED,
      messages: updatedMessages
    });
  }
}

function saveUnreadHangout({
  name,
  hangout,
  dispatch
}) {
  //update unread hangouts
  let unreadhangoutsKey = `${name}-unread-hangouts`;
  let unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutsKey));
  let updatedunreads = null;

  if (unreadhangouts) {
    updatedunreads = [...unreadhangouts, { ...hangout,
      read: false
    }];
  } else {
    updatedunreads = [{ ...hangout,
      read: false
    }];
  }

  localStorage.setItem(unreadhangoutsKey, JSON.stringify(updatedunreads));
  dispatch({
    type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: updatedunreads
  });
}

function saveInviter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout,
    unread
  });
}
function saveAccepter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout,
    unread
  });
}
function saveBlocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout,
    unread
  });
}
function saveDecliner({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout,
    unread
  });
}
function saveMessanger({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout,
    unread
  });
} // END saveMessanger

function saveUnblocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout,
    unread
  });
}

function useMessage({
  message,
  username,
  dispatch,
  focusedHangout
}) {
  const {
    onAppRoute
  } = useAppRoute();

  function handleAcknowledgement({
    hangout,
    offline
  }) {
    switch (hangout.state) {
      case hangoutStates.INVITED:
        saveInvited({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });
        break;

      case hangoutStates.UNBLOCKED:
        saveUnblovked({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });
        break;

      case hangoutStates.DECLINED:
        saveDeclined({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });
        break;

      case hangoutStates.BLOCKED:
        saveBlocked({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });
        break;

      case hangoutStates.ACCEPTED:
        saveAccepted({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });
        break;

      case hangoutStates.MESSAGED:
        saveMessaged({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });
        break;
    }
  }

  function handleHangout({
    hangout,
    unread
  }) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
        saveAccepter({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          unread
        });
        break;

      case hangoutStates.BLOCKER:
        saveBlocker({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          unread
        });
        break;

      case hangoutStates.DECLINER:
        saveDecliner({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          unread
        });
        break;

      case hangoutStates.INVITER:
        saveInviter({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          unread
        });
        break;

      case hangoutStates.MESSANGER:
        saveMessanger({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          unread
        });
        break;

      case hangoutStates.UNBLOCKER:
        saveUnblocker({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          unread
        });
        break;
    }
  }

  function handleHangouts({
    hangouts
  }) {
    hangouts.forEach(hangout => {
      handleHangout({
        hangout,
        unread: true
      });
    });
  }

  p$1(() => {
    if (message && username) {
      switch (message.type) {
        case 'ACKHOWLEDGEMENT':
          handleAcknowledgement({
            hangout: message.hangout,
            offline: false
          });
          break;

        case 'HANGOUT':
          if (focusedHangout && focusedHangout.username === message.hangout.username) {
            handleHangout({
              hangout: message.hangout,
              unread: false
            });
          } else {
            handleHangout({
              hangout: message.hangout,
              unread: true
            });
          }

          break;

        case 'UNREAD_HANGOUTS':
          handleHangouts({
            hangouts: message.hangouts
          });
          break;

        case 'OFFLINE_ACKN':
          handleAcknowledgement({
            hangout: message.hangout,
            offline: true
          });
          break;
      }
    }
  }, [message, username]);
  return {};
}

function loadHangouts({
  username,
  dispatch
}) {
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));
  dispatch({
    type: actionTypes$1.LOAD_HANGOUTS,
    hangouts
  });
} //select hangout from List
function selectUnread({
  dispatch,
  hangout
}) {
  dispatch({
    type: actionTypes$1.SELECTED_HANGOUT,
    hangout
  });
} //search for hangout by typing into TextInput
function changeMessageText({
  text,
  dispatch
}) {
  dispatch({
    type: actionTypes$1.MESSAGE_TEXT_CHANGED,
    text
  });
}
function loadMessages({
  hangout,
  dispatch,
  username
}) {
  const key = `${username}-${hangout.username}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));
  dispatch({
    type: actionTypes$1.LOADED_MESSAGES,
    messages
  });
} //END saveInviter

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
  GOT_TOKEN_FROM_URL: 'GOT_TOKEN_FROM_URL',
  RECOVER_LOCAL_AUTH_STATE: 'RECOVER_LOCAL_AUTH_STATE'
};

const initState$1 = {
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
  isPasswordChanged: false,
  authFeedback: null,
  user: null
};
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes$2.VALUE_CHANGED:
      const nextState = { ...state,
        [action.payload.propName]: action.payload.value
      };
      return nextState;

    case actionTypes$2.LOGIN_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$2.LOGIN_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        user: action.user,
        isLoggedIn: true,
        password: '',
        successMessage: 'Welcome, '
      };

    case actionTypes$2.LOGIN_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes$2.SIGNUP_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$2.SIGNUP_SUCCESS:
      return { ...state,
        loading: false,
        success: true,
        isLoggedIn: true,
        user: action.user,
        password: '',
        successMessage: 'Welcome'
      };

    case actionTypes$2.SIGNUP_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes$2.CHANGE_PASSWORD_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$2.CHANGE_PASSWORD_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        user: action.user,
        isPasswordChanged: true,
        authFeedback: action.message
      };

    case actionTypes$2.CHANGE_PASSWORD_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes$2.REQUEST_PASS_CHANGE_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$2.REQUEST_PASS_CHANGE_SUCCESS:
      return { ...state,
        loading: false,
        success: true,
        authFeedback: action.message
      };

    case actionTypes$2.REQUEST_PASS_CHANGE_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes$2.GOT_TOKEN_FROM_URL:
      return { ...state,
        token: action.token
      };

    case actionTypes$2.LOGOUT_SUCCESS:
      return { ...initState$1
      };

    case actionTypes$2.RECOVER_LOCAL_AUTH_STATE:
      return { ...state,
        user: action.user
      };

    default:
      return state;
  }
}

const AuthRouteContext = M();

function AuthRouteProvider(props) {
  const {
    initialRoute
  } = props;
  const [authRoute, setAuthRoute] = v$1(initialRoute);
  const value = s$1(() => [authRoute, setAuthRoute], [authRoute]);
  return h(AuthRouteContext.Provider, _extends({
    value: value
  }, props));
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
  const {
    children
  } = props;
  const [state, dispatch] = m$1(authReducer, initState$1);
  const value = s$1(() => [state, dispatch], [state]);
  return h(AuthContext.Provider, _extends({
    value: value
  }, props), h(AuthRouteProvider, null, children));
}

function useUserName() {
  const [userName, setUsername] = v$1(null);
  const [token, setToken] = v$1(null);
  const [email, setEmail] = v$1('');
  const {
    state
  } = useAuthContext();
  p$1(() => {
    if (window.localStorage.getItem('webcom')) {
      const {
        username,
        token,
        email
      } = JSON.parse(window.localStorage.getItem('webcom'));
      setUsername(username);
      setToken(token);
      setEmail(email);
    }
  }, []);
  p$1(() => {
    if (state.user && state.user.token) {
      const {
        username,
        email,
        token
      } = state.user;
      setUsername(username);
      setToken(token);
      setEmail(email);
    }
  }, [state.user]);
  return {
    username: userName,
    token,
    email
  };
}

function updateReadHangouts({
  dispatch,
  name,
  hangout
}) {
  const {
    username,
    message
  } = hangout; // set read to true on unread hangouts

  let unreadhangoutsKey = `${name}-unread-hangouts`;
  const unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutsKey));

  if (unreadhangouts && unreadhangouts.length > 0) {
    let updatedunread = unreadhangouts.map(u => {
      if (u.username === username) {
        return { ...u,
          read: true
        };
      } else {
        return u;
      }
    });
    localStorage.setItem(unreadhangoutsKey, JSON.stringify(updatedunread));
    dispatch({
      type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: updatedunread
    });
  } // set hangout to read


  const hangoutKey = `${name}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = hangouts.findIndex(g => g.username === username);
  hangouts.splice(hangoutIndex, 1, { ...hangout,
    read: true
  }); //

  localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
  dispatch({
    type: actionTypes$1.HANGOUTS_UPDATED,
    hangouts
  });

  if (message) {
    updateReadMesssages({
      dispatch,
      hangout,
      name
    });
  }
}
function updateReadMesssages({
  hangout,
  name,
  dispatch
}) {
  const {
    username
  } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const updatedMessages = messages.map(m => {
    return { ...m,
      read: true
    };
  });
  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  dispatch({
    type: actionTypes$1.MESSAGES_UPDATED,
    messages: updatedMessages
  });
}

const HangoutContext = M();
function useHangoutContext() {
  const context = T$1(HangoutContext);

  if (!context) {
    throw new Error('useHangoutContext must be used with HangoutsProvider');
  }

  return context;
}
function HangoutsProvider(props) {
  const {
    username,
    token
  } = useUserName();
  const [state, dispatch] = m$1(reducer$1, initState);
  const {
    hangout,
    message
  } = state;
  const handleMessage = useMessage({
    message,
    username,
    dispatch,
    focusedHangout: hangout
  });
  p$1(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
  p$1(() => {
    if (username && token) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, []);
  p$1(() => {
    if (hangout && username) {
      //from local storage
      loadMessages({
        dispatch,
        hangout,
        username
      }); //save hangout to localStorage

      const key = `${username}-hangouts`;
      const hangouts = JSON.parse(localStorage.getItem(key));

      if (!hangouts) {
        localStorage.setItem(key, JSON.stringify([hangout]));
      } else {
        const hangoutExist = hangouts.find(g => g.username === hangout.username);

        if (hangoutExist) {
          const updated = hangouts.map(g => {
            if (g.username === hangout.username) {
              return hangout;
            } else {
              return g;
            }
          });
          localStorage.setItem(key, JSON.stringify(updated));
        } else {
          localStorage.setItem(key, JSON.stringify([hangout]));
        }
      }

      if (!hangout.read) {
        updateReadHangouts({
          dispatch,
          hangout,
          name: username
        });
      }
    }
  }, [hangout, username]);
  const value = s$1(() => [state, dispatch], [state]);
  return h(HangoutContext.Provider, _extends({
    value: value
  }, props));
}

function savePendingHangout({
  dispatch,
  name,
  hangout,
  online,
  isBlocker
}) {
  const {
    username,
    message
  } = hangout;
  let hangoutKey = '';
  let messageKey = '';

  if (online) {
    hangoutKey = `${name}-hangouts`;
    messageKey = `${name}-${username}-messages`;
  } else {
    hangoutKey = `${name}-offline-hangouts`;
    messageKey = `${name}-${username}-offline-messages`;
  }

  saveHangout({
    hangoutKey,
    username,
    hangout,
    dispatch
  });

  if (message && message.text !== "") {
    saveMessage({
      messageKey,
      username,
      message,
      dispatch,
      isBlocker
    });
  }
}

function saveHangout({
  hangoutKey,
  username,
  hangout,
  dispatch
}) {
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  let updatedHangouts = null;

  if (hangouts) {
    const hangoutIndex = hangouts.findIndex(g => g.username === username);
    hangouts.splice(hangoutIndex, 1, hangout);
    localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
    dispatch({
      type: actionTypes$1.HANGOUTS_UPDATED,
      hangouts
    });
  } else {
    updatedHangouts = [hangout];
    localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
    dispatch({
      type: actionTypes$1.HANGOUTS_UPDATED,
      hangouts: updatedHangouts
    });
  }
}

function saveMessage({
  messageKey,
  message,
  dispatch,
  isBlocker
}) {
  const messages = JSON.parse(localStorage.getItem(messageKey));
  let updatedMessages = [];

  if (messages) {
    updatedMessages = [...messages, message];
  } else {
    updatedMessages = [message];
  }

  if (isBlocker) {
    const blocker = [...updatedMessages, {
      text: 'You can not send this message because you are blocked.',
      timestamp: Date.now(),
      type: 'blocker',
      username: message.username,
      float: 'right'
    }];
    localStorage.setItem(messageKey, JSON.stringify(blocker));
    dispatch({
      type: actionTypes$1.MESSAGES_UPDATED,
      messages: blocker
    });
  } else {
    localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
    dispatch({
      type: actionTypes$1.MESSAGES_UPDATED,
      messages: updatedMessages
    });
  }
}

function sendOfflineHangouts({
  socket,
  name
}) {
  const offlineHangoutKey = `${name}-offline-hangouts`;
  const offlineHangouts = JSON.parse(localStorage.getItem(offlineHangoutKey));

  if (offlineHangouts) {
    offlineHangouts.foreEach(h => {
      socket.send(JSON.stringify({
        username: h.username,
        email: h.email,
        message: h.message,
        timestamp: h.timestamp,
        command: h.state,
        offline: true
      }));
    });
  }

  return;
}

function removeHangoutFromUnread({
  name,
  hangout,
  dispatch
}) {
  const {
    username
  } = hangout;
  let unreadhangoutsKey = `${name}-unread-hangouts`;
  let unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutsKey));
  debugger;
  const filteredHangouts = unreadhangouts.filter(function (unread) {
    return unread.username !== username;
  });

  if (filteredHangouts.length > 0) {
    debugger;
    localStorage.setItem(unreadhangoutsKey, JSON.stringify(filteredHangouts));
    dispatch({
      type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: filteredHangouts
    });
  } else {
    debugger;
    localStorage.removeItem(unreadhangoutsKey);
    dispatch({
      type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: []
    });
    debugger;
  }
}

function useHangouts() {
  const {
    onAppRoute
  } = useAppRoute();
  const authContext = useAuthContext();
  const username = authContext.state.user && authContext.state.user.username;
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    search,
    users,
    messageText,
    messages,
    readyState,
    unreadhangouts
  } = state;
  p$1(() => {
    if (readyState === 1 && username) {
      sendOfflineHangouts({
        name: username,
        dispatch
      });
    }
  }, [readyState, username]);

  function onRemoveUnread(e) {
    const id = e.currentTarget.id;
    const hangout = hangouts.find(g => g.username === id);
    removeHangoutFromUnread({
      name: username,
      dispatch,
      hangout
    });
  }

  function onNavigation(e) {
    e.stopPropagation(); // const id =e.target.id

    const id = e.currentTarget.id;
    onAppRoute({
      featureRoute: `/${id}`,
      route: '/hangouts'
    });
  }

  function onSelectHangout(e) {
    const username = e.target.id;
    const hangout = hangouts.find(g => g.username === username);
    dispatch({
      type: actionTypes$1.SELECTED_HANGOUT,
      hangout
    });
  }

  function onSelectUnread(e) {
    const username = e.target.id;
    const hangout = hangouts.find(g => g.username === username);
    selectUnread({
      dispatch,
      hangout
    });
    onAppRoute({
      featureRoute: `/${hangout.state}`,
      route: '/hangouts'
    });
  }

  function onSearchInput(e) {
    dispatch({
      type: actionTypes$1.SEARCH_INPUT_CHANGE,
      search: e.target.value
    });
  }

  function onFetchHangouts() {
    dispatch({
      type: actionTypes$1.FETCH_HANGOUT_STARTED
    });
  }

  function onMessageText(e) {
    const text = e.target.value;
    changeMessageText({
      dispatch,
      text
    });
  }

  function onHangout(e) {
    changeMessageText({
      text: '',
      dispatch
    });
    const command = e.target.id;
    const {
      email
    } = hangout;
    const timestamp = Date.now();
    const message = messageText !== '' ? {
      text: messageText,
      timestamp
    } : null;
    let online = true;
    let isBlocker = false; //  if (readyState === 1) {

    if (hangout.state === 'BLOCKER') {
      isBlocker = true;
    }

    const pendingHangout = {
      username: hangout.username,
      email,
      message,
      command,
      timestamp
    };
    dispatch({
      type: actionTypes$1.SENDING_HANGOUT_STARTED,
      pendingHangout
    }); // } else {
    //   online = false;
    // }

    savePendingHangout({
      dispatch,
      name: username,
      hangout: {
        username: hangout.username,
        email,
        state: command,
        message: {
          text: messageText,
          timestamp,
          delivered: false,
          username
        },
        timestamp,
        delivered: false
      },
      online,
      isBlocker
    });
  } //end onHangout


  return {
    state,
    onNavigation,
    onSelectUnread,
    onMessageText,
    messageText,
    onSearchInput,
    onFetchHangouts,
    search,
    onSelectHangout,
    dispatch,
    hangout,
    hangouts,
    users,
    username,
    messages,
    onHangout,
    unreadhangouts,
    readyState,
    onRemoveUnread
  };
}

async function fetchHangouts({
  search,
  dispatch
}) {
  try {
    // search Hangout
    const user = Parse.User.current();
    const query = new Parse.Query("Hangout");
    query.equalTo('userid', user.id);
    query.equalTo('username', search);
    let searchResult = await query.find();

    if (searchResult.length > 0) {
      let mappedHanouts = searchResult.map(s => {
        return {
          username: s.attributes.username,
          email: s.attributes.email,
          state: s.attributes.state
        };
      });
      dispatch({
        type: actionTypes$1.FETCH_HANGOUT_SUCCESS,
        hangouts: mappedHanouts
      });
    } else {
      // search HangoutUser
      const HangoutUser = Parse.Object.extend("HangoutUser");
      const query = new Parse.Query(HangoutUser);
      query.equalTo('username', search);
      let searchResult = await query.find();
      let mappedHanouts = searchResult.map(s => {
        return {
          username: s.attributes.username,
          email: s.attributes.email,
          state: 'INVITE'
        };
      });
      dispatch({
        type: actionTypes$1.FETCH_HANGOUT_SUCCESS,
        hangouts: mappedHanouts
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.ERROR_RECIEVED,
      error
    });
  }
}

//is sent by client
const clientCommands = {
  INVITE: 'INVITE',
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  BLOCK: 'BLOCK',
  UNBLOCK: 'UNBLOCK',
  MESSAGE: 'MESSAGE',
  ONLINE: 'ONLINE'
};

function stateMapper({
  command
}) {
  switch (command) {
    case clientCommands.ACCEPT:
      return {
        senderState: hangoutStates.ACCEPTED,
        targetState: hangoutStates.ACCEPTER
      };

    case clientCommands.BLOCK:
      return {
        senderState: hangoutStates.BLOCKED,
        targetState: hangoutStates.BLOCKER
      };

    case clientCommands.DECLINE:
      return {
        senderState: hangoutStates.DECLINED,
        targetState: hangoutStates.DECLINER
      };

    case clientCommands.INVITE:
      return {
        senderState: hangoutStates.INVITED,
        targetState: hangoutStates.INVITER
      };

    case clientCommands.MESSAGE:
      return {
        senderState: hangoutStates.MESSAGED,
        targetState: hangoutStates.MESSANGER
      };

    case clientCommands.UNBLOCK:
      return {
        senderState: hangoutStates.UNBLOCKED,
        targetState: hangoutStates.UNBLOCKER
      };

    default:
      debugger;
      throw new Error('clientCommand type not specified');
  }
}

function ParseServer(props) {
  const {
    children
  } = props;
  const {
    state,
    dispatch
  } = useHangouts();
  const authContext = useAuthContext();
  const {
    user
  } = authContext.state;
  const {
    fetchHangouts: fetchHangouts$1,
    search,
    pendingHangout
  } = state;
  p$1(() => {
    if (fetchHangouts$1) {
      debugger;
      fetchHangouts({
        dispatch,
        search
      });
    }
  }, [fetchHangouts$1]);
  p$1(() => {
    if (pendingHangout) {
      sendHangout();
    }
  }, [pendingHangout]);
  p$1(() => {
    if (user) {
      subsFirst();
    }
  }, [user]);

  function handleHangout({
    hangout
  }) {
    debugger;

    switch (hangout.state) {
      case 'INVITED':
      case 'ACCEPTED':
      case 'BLOCKED':
      case 'MESSAGED':
      case 'DECLINED':
      case 'UNBLOCKED':
        debugger;
        dispatch({
          type: actionTypes$1.SERVER_MESSAGE_RECIEVED,
          message: {
            hangout,
            type: 'ACKHOWLEDGEMENT'
          }
        });
        break;

      case 'INVITER':
      case 'ACCEPTER':
      case 'BLOCKER':
      case 'MESSANGER':
      case 'UNBLOCKER':
        dispatch({
          type: actionTypes$1.SERVER_MESSAGE_RECIEVED,
          message: {
            hangout,
            type: 'HANGOUT'
          }
        });
        break;
    }
  }

  async function subsFirst() {
    let query = new Parse.Query("Hangout");
    var currentUser = Parse.User.current();
    query.equalTo('userid', currentUser.id);
    let subscription = await query.subscribe();
    subscription.on('create', object => {
      const hangout = object.attributes;
      debugger;
      handleHangout({
        hangout
      });
      console.log('object created');
    });
    subscription.on('update', object => {
      const hangout = object.attributes;
      debugger;
      handleHangout({
        hangout
      });
      console.log('object updated');
    });
    subscription.on('enter', object => {
      debugger;
      console.log('object entered');
    });
    subscription.on('leave', object => {
      debugger;
      const {
        hangouts
      } = object.attributes;
      const hangout = hangouts[0].attributes;
      handleHangout({
        hangout
      });
      debugger;
      console.log('object left');
    });
  }

  async function sendHangout() {
    try {
      debugger;
      const {
        senderState,
        targetState
      } = stateMapper({
        command: pendingHangout.command
      });
      const {
        username,
        email,
        message,
        offline,
        timestamp
      } = pendingHangout;
      const Hangout = Parse.Object.extend("Hangout");
      const SenderUser = Parse.Object.extend("HangoutUser");
      let senderQuery = new Parse.Query(SenderUser);
      senderQuery.equalTo('username', user.username);
      let senderUser = await senderQuery.first();
      debugger;
      const TargetUser = Parse.Object.extend("HangoutUser");
      let targetQuery = new Parse.Query(TargetUser);
      targetQuery.equalTo('username', username);
      let targetUser = await targetQuery.first();
      const sender = new Hangout();
      sender.set('username', username);
      sender.set('email', email);
      sender.set('message', message);
      sender.set('timestamp', timestamp);
      sender.set('state', senderState);
      sender.set('userid', senderUser.attributes.userid);
      const target = new Hangout();
      target.set('username', user.username);
      target.set('email', user.email);
      target.set('message', message);
      target.set('timestamp', timestamp);
      target.set('state', targetState);
      target.set('userid', targetUser.attributes.userid);
      debugger;

      if (pendingHangout.command === clientCommands.INVITE) {
        senderUser.addUnique('hangouts', sender);
        targetUser.addUnique('hangouts', target);
        sender.set('owner', senderUser); //   sender.save()

        target.set('owner', targetUser); // target.save()

        senderUser.save();
        targetUser.save();
      } else {
        debugger;
        let targetQuery = new Parse.Query("Hangout");
        targetQuery.equalTo('userid', targetUser.attributes.userid);
        let targetHangout = await targetQuery.first();
        targetHangout.set('message', message);
        targetHangout.set('timestamp', timestamp);
        targetHangout.set('state', targetState);
        targetHangout.save();
        debugger;
        var currentUser = Parse.User.current();
        let senderQuery = new Parse.Query("Hangout");
        senderQuery.equalTo('userid', currentUser.id);
        let senderHangout = await senderQuery.first();
        senderHangout.set('message', message);
        senderHangout.set('timestamp', timestamp);
        senderHangout.set('state', senderState);
        senderHangout.save();
        debugger;
      }
    } catch (error) {
      debugger;
    }
  }

  return children;
}

function HangoutAdapter(props) {
  {
    return h(ParseServer, props);
  }
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

const NavContext = M();
function NavProvider(props) {
  const [drawerOpen, setDrawerOpen] = v$1(false);
  const value = s$1(() => [drawerOpen, setDrawerOpen], [drawerOpen]);
  return h(NavContext.Provider, _extends({
    value: value
  }, props));
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
  }, h(AuthProvider, null, h(NavProvider, null, h(HangoutsProvider, null, h(HangoutAdapter, {
    socketUrl: `wss://${"localhost"}:3000`
  }, children))))));
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

function NavItem(props) {
  const {
    children
  } = props;
  return h("div", _extends({
    className: "nav-item"
  }, props), children);
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

const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBBsILS1Yf9JIAAADoElEQVRo3r2ZS0hUURjHf3Mti9BSM2lR0tPJhEjSViEE1aKNlRUVJFEQFFEkbu21K7GINhFFRA+CliUtatNL3ITRNKERBlELdUbH7KGmc1vcrjPjzL33fGfu+H2LgXvO9/9995wz53UDSK2MOqpYQwXFFFEA/CTGED10E+YV/WJFZavlMiHimC4eJ0QbNX6j59PMR1fwdA/TTKE/8BLOMyiC2z7IOYqzgwdopF8LbnuUUxi6+FW8yQpu+2tW6uB3MuQL3sTkB/tkcIMrvsFtb1Pvinwe+I43MbnPbDV8e07wJiZPvFMIcCdneBOTB14d4X/fT/dWN/yenONNTPY74VcSm5EEYqzI3Pv+TDsq/pJAAmvbEW7KJgu+8pAeIMh+lgpjD3En9UEJA6J3+EMTeVPReTTzRxTfR1FqAhdE4WNsT3unrcIUziQHzxcuuMcyNutxkUY0eb/QLArtSBo5qcO4U6TTlAgNiQJ3OQ4t2TwStsNqRWG/yHdMIJ9fIq1qMMB5ZspoHYw7lo3TKdI6YCWwTRTU61r6RaS1BQzKWCsKirmWRkVa6yg1qHMY0042x7V0rkjLoM6gShQCS1xLy4VqVQZBYUitS1lAfCYKGlQIQ8qpdiyr8WifdKswKBWGwEnHkhNirVKIiKYOE5MJh4beyIRYawDGxEEmn1mUhi+jV0NpVC8Bk24qU/CVdGvpjOp0gR26eAo/T7gXSOoCg5/igWPZp6S7kN981FQZMYhohP3lOpuIJz3ZzE0mNJQiiM+Bo9xwOG6v5pZ4RN2Ds4LqcR6yzPWNlvNIlEALNChXjlGv1Kz1DCtr7oQyj3sv278JJu1KvitpTlrz8HuFqmMuK0Am28C4gmqXtSN6riDYRpcogbdcUaj1zPqpURj5C0V4gEUK/4j1duWwR8V2MR7gqYdqCPh/X3HbQ6pDK4E3HuVJ1EKPo1mDVgLux5QIBYkWGOGaq1RMKwH3qKvWKmTviIvpybDG2zaiNc/Pcrmu7iPIcOqjw6IpNFs/mJ5TgNczhn+R+SwyU5dUQ5kvqQB2z0gCzsd7oC3n+IvuIzfA7Zzi73vfmc/O4WX1Y7X78lncygn+rhre6ohWn+FxLgqvAdih+a0skw+zVwa3bAUvfcG/YLkO3uqKRvqygkc5Km366VbEGaJa8AgtLMgOblsBTXwQwUOcttZ7P62aVt4x6QqepItLib2eSi9LrZQ61lJJBSVJn+8Hpz7fC8+a/wC1ZAXs3UhUHAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNC0yN1QwODo0NTo0NSswMDowMBawSVQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDQtMjdUMDg6NDU6NDUrMDA6MDBn7fHoAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==";

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
function logout() {
  window.localStorage.removeItem('webcom');
  return {
    type: actionTypes$2.LOGOUT_SUCCESS
  };
}
function getTokenFromUrl({
  token
}) {
  return {
    type: actionTypes$2.GOT_TOKEN_FROM_URL,
    token
  };
}
function recoverLocalAuthState({
  user,
  dispatch
}) {
  dispatch({
    type: actionTypes$2.RECOVER_LOCAL_AUTH_STATE,
    user
  });
}

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

const style = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 5% auto',
    justifyItems: 'center',
    padding: 16
  }
};
function AuthDrawerContent({
  toggleDrawer
}) {
  const {
    device
  } = useMediaQuery();
  const {
    state
  } = useAuthContext();
  const {
    onAppRoute
  } = useAppRoute();

  function handleRoute(e) {
    e.preventDefault();
    const {
      id
    } = e.target;
    onAppRoute({
      featureRoute: `/${id}`,
      route: '/auth'
    });

    if (device === 'phone') {
      toggleDrawer();
    }
  }

  return h("div", {
    style: {
      paddingTop: 10
    }
  }, !state.user && h(UnAuthedState, {
    handleRoute: handleRoute
  }), state.user && h(AuthedState, {
    onAppRoute: onAppRoute,
    handleRoute: handleRoute,
    userName: state.user.username
  }), h("hr", {
    style: {
      height: 1
    }
  }));
}
function AuthedState({
  handleRoute,
  userName,
  onAppRoute
}) {
  function handleLogOut() {
    onAppRoute({
      featureRoute: '/',
      route: '/home'
    });
    logout();
  }

  return h("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    }
  }, h("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, h("div", null, h("img", {
    src: img,
    style: {
      paddingRight: 5
    }
  })), h("div", null, h("a", {
    href: "/",
    onClick: handleLogOut,
    id: "logout",
    "data-testid": "logout"
  }, "Logout"))), h("div", {
    style: {
      marginBottom: 8
    }
  }, "Welcome, ", userName), h(List, null, h(ListItem, {
    onClick: handleRoute,
    id: "changepassword",
    "data-testid": "changepassword"
  }, "Change Password")));
}
function UnAuthedState({
  handleRoute
}) {
  return h("div", null, h("div", {
    style: style.grid
  }, h("a", {
    href: "/",
    onClick: handleRoute,
    id: "login",
    "data-testid": "login"
  }, "Login"), h("div", null, "|"), h("a", {
    href: "/",
    onClick: handleRoute,
    id: "signup",
    "data-testid": "signup"
  }, "Signup")));
}

function HangoutDrawerContent({
  toggleDrawer
}) {
  const {
    device
  } = useMediaQuery();
  const {
    onAppRoute
  } = useAppRoute();
  const {
    username
  } = useUserName();

  function handleRoute(e) {
    e.preventDefault();
    const {
      id
    } = e.target;

    if (username) {
      onAppRoute({
        type: actionTypes.APP_ROUTE_CHANGED,
        featureRoute: '/hangouts',
        route: '/hangouts'
      });
    } else {
      onAppRoute({
        type: actionTypes.APP_ROUTE_CHANGED,
        featureRoute: '/login',
        route: '/auth'
      });
    }

    if (device === 'phone') {
      toggleDrawer();
    }
  }

  return h("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    }
  }, h(List, null, h(ListItem, {
    onClick: handleRoute,
    "data-testid": "hangouts"
  }, "Hangout")));
}

const style$1 = {
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
function Message({
  count = 0
}) {
  return h("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, h("div", null, "message:"), h("div", {
    style: style$1.count,
    "data-testid": "message-count"
  }, count));
}

function Settings(props) {
  const {
    height = 24,
    width = 24,
    fill = 'none',
    color = 'black',
    onClick,
    id
  } = props;
  return h("svg", {
    height: height,
    viewBox: "0 0 24 24",
    width: width,
    id: id
  }, h("path", {
    d: "M0 0h24v24H0V0z",
    fill: fill,
    id: id
  }), h("path", {
    onClick: onClick,
    id: id,
    "data-testid": id,
    color: color,
    d: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
  }));
}

const style$2 = {
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
    style: { ...style$2,
      backgroundColor: 'green'
    },
    "data-testid": "online"
  });
}
function IsOffline() {
  return h("div", {
    style: { ...style$2,
      backgroundColor: 'red'
    },
    "data-testid": "offline"
  });
}
function Connecting() {
  return h("div", {
    style: { ...style$2,
      backgroundColor: 'orange'
    },
    "data-testid": "connecting"
  });
}
function Closing() {
  return h("div", {
    style: { ...style$2,
      backgroundColor: 'pink'
    },
    "data-testid": "closing"
  });
}

function HangoutTopMenu() {
  const {
    onAppRoute
  } = useAppRoute();
  const {
    username
  } = useUserName();
  const {
    readyState,
    unreadhangouts,
    onNavigation,
    hangout
  } = useHangouts();

  function navToUnread() {
    onAppRoute({
      featureRoute: '/UNREAD',
      route: '/hangouts'
    });
  }

  return h("div", {
    style: {
      display: 'flex'
    }
  }, h(NavItem, null, username), h(NavItem, null, h(OnlineStatus, {
    readyState: readyState
  })), h(NavItem, {
    onClick: navToUnread,
    "data-testid": "nav-unreads"
  }, unreadhangouts && h(Message, {
    count: unreadhangouts.filter(f => f.read === false).length
  }), ' '), hangout && h(NavItem, {
    onClick: onNavigation,
    "data-testid": "nav-config",
    id: "configure"
  }, h(Settings, {
    fill: "white",
    width: "30",
    height: "30"
  })));
} //

const drawer = {
  boxShadow: `0px 3px 3px -2px rgba(0, 0, 0, 0.2),0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)`,
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 10,
  height: '100vh',
  backgroundColor: '#f5f5f5'
};

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

function E$1(n,t){for(var e in t)n[e]=t[e];return n}function w$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var C$1=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return w$1(this.props,n)||w$1(this.state,t)},r}(m);var A$1=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),A$1&&A$1(n);};var F$1=n.__e;function N$1(n){return n&&((n=E$1({},n)).__c=null,n.__k=n.__k&&n.__k.map(N$1)),n}function U(){this.__u=0,this.o=null,this.__b=null;}function M$1(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function L(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function O(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);F$1(n,t,e);},(U.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=M$1(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},U.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=N$1(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var P$1=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(O.prototype=new m).u=function(n){var t=this,e=M$1(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),P$1(t,n,r)):o();};e?e(u):u();}},O.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},O.prototype.componentDidUpdate=O.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){P$1(n,e,t);});};var W=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var D$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var H$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var Z=n.event;function I(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){Z&&(n=Z(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var $$1={configurable:!0,get:function(){return this.class}},q$1=n.vnode;n.vnode=function(n){n.$$typeof=H$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&($$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",$$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=D$1.test(u))break;if(r)for(u in o=n.props={},e)o[D$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&(I(t.prototype,"componentWillMount"),I(t.prototype,"componentWillReceiveProps"),I(t.prototype,"componentWillUpdate"),t.m=!0);}q$1&&q$1(n);};

function Home() {
  return h("div", {
    "data-testid": "home",
    style: {
      paddingTop: 68
    }
  }, "Home");
}

var actionTypes$3 = {
  INIT_FORM_VALIDATION_STATE: 'INIT_FORM_VALIDATION_STATE',
  RESET_VALIDATION_STATE: 'RESET_VALIDATION_STATE',
  INPUT_BLURRED: 'INPUT_BLURRED',
  INPUT_FOCUSED: 'INPUT_FOCUSED',
  SERVER_VALIDATION: 'SERVER_VALIDATION',
  CLIENT_VALIDATION: 'CLIENT_VALIDATION',
  INC_INPUT_COUTN: 'INC_INPUT_COUTN'
};

var validationStates = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  INACTIVE: 'INACTIVE'
};

const initState$2 = {
  validation: {}
};
function formReducer(state, action) {
  let nextState = null;

  switch (action.type) {
    case actionTypes$3.SERVER_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      debugger;
      return nextState;

    case actionTypes$3.CLIENT_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes$3.RESET_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$3.INPUT_FOCUSED:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE,
          [action.propName]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$3.INIT_FORM_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE
        }
      };

    case actionTypes$3.INC_INPUT_COUTN:
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
    throw new Error('useFormContext must be used with FormProvider');
  }

  const [state, dispatch] = context;
  return {
    state,
    dispatch
  };
}
function FormProvider(props) {
  const [state, dispatch] = m$1(formReducer, initState$2);
  const value = s$1(() => [state, dispatch], [state]);
  return h(FormContext.Provider, _extends({
    value: value
  }, props));
}

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
  USERNAME_NOT_REGISTERED: 'USERNAME_NOT_REGISTERED',
  ACCOUNT_ALREADY_EXISTS: 'ACCOUNT_ALREADY_EXISTS'
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
  PASSWORDS_DO_NOT_MATCH: 'passwords do not match',
  ACCOUNT_ALREADY_EXISTS: 'Account already exists for this username.'
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
  auth
}) {
  const {
    password,
    confirm
  } = auth;

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

var httpStatus = {
  accountAlreadyExits: 202,
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
  state,
  auth
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
      validation = validatePasswordMatch({
        auth
      });
      break;
  }

  return {
    type: actionTypes$3.CLIENT_VALIDATION,
    ...validation
  };
}
function resetInputValidationState({
  validationType
}) {
  return {
    type: actionTypes$3.RESET_VALIDATION_STATE,
    validationType
  };
}
function serverValidation({
  status = 0
}) {
  debugger;

  switch (status) {
    case 101:
    case httpStatus.credentialInvalid:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID
      };

    case 125:
    case -3:
    case httpStatus.emailInvalid:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordInvalid:
    case -4:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
        message: validationMessages.INVALID_PASSWORD,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameInvalid:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME,
        validationState: validationStates.INVALID
      };

    case 203:
    case httpStatus.emailIsRegistered:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.REGISTERED_EMAIL,
        message: validationMessages.REGISTERED_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsNotRegistered:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_NOT_REGISTERED,
        message: validationMessages.EMAIL_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case 202:
    case httpStatus.usernameIsTaken:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_TAKEN,
        message: validationMessages.USERNAME_TAKEN,
        validationState: validationStates.INVALID
      };

    case httpStatus.emptyStringNotValid:
    case -1:
    case 201:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.EMPTY_STRING_VALIDATION,
        message: validationMessages.INVALID_EMPTY_STRING,
        validationState: validationStates.INVALID
      };

    case 200:
    case httpStatus.emailorusernameNotValid:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsNotRegistered:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_NOT_REGISTERED,
        message: validationMessages.USERNAME_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordDoNotMatch:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORDS_MATCH_VALIDATION,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH,
        validationState: validationStates.INVALID
      };

    default:
      return null;
  }
}

Parse.initialize("zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA", "Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY

Parse.serverURL = `https://${"localhost"}:1337/parse`; //Parse.liveQueryServerURL = `https://${"localhost"}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
//Parse.liveQueryServerURL = `wss://webapis.back4app.io`

async function signUp({
  dispatch,
  state,
  formDispatch
}) {
  try {
    const {
      username,
      password,
      email
    } = state;

    if (email === '') {
      formDispatch(serverValidation({
        status: -3
      }));
      throw new Error('Email cannot be emty');
    } else if (password === '') {
      formDispatch(serverValidation({
        status: -4
      }));
      throw new Error('Password cannot be emty');
    }

    debugger;
    dispatch({
      type: actionTypes$2.SIGNUP_STARTED
    }); // Create a new instance of the user class

    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    let success = await user.signUp();
    window.localStorage.setItem('webcom', JSON.stringify({
      token: success.get('sessionToken'),
      username,
      email,
      objectId: success.id
    }));
    const HangoutUser = Parse.Object.extend("HangoutUser");
    const hangoutUser = new HangoutUser();
    hangoutUser.set('username', username);
    hangoutUser.set('email', email);
    hangoutUser.set('userid', success.id);
    await hangoutUser.save();
    dispatch({
      type: actionTypes$2.SIGNUP_SUCCESS,
      user: {
        username,
        email,
        token: success.get('sessionToken')
      }
    });
  } catch (error) {
    debugger;
    formDispatch(serverValidation({
      status: error.code
    }));
  }
}
function login({
  dispatch,
  state,
  formDispatch
}) {
  const {
    emailorusername,
    password
  } = state;
  dispatch({
    type: actionTypes$2.LOGIN_STARTED
  });
  debugger; // Create a new instance of the user class

  Parse.User.logIn(emailorusername, password).then(function (user) {
    let username = user.get("username");
    let email = user.get("email");
    let token = user.get('sessionToken');
    window.localStorage.setItem('webcom', JSON.stringify({
      token,
      username,
      email,
      objectId: user.id
    }));
    dispatch({
      type: actionTypes$2.LOGIN_SUCCESS,
      user: {
        username,
        email,
        token
      }
    });
    console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
  }).catch(function (error) {
    debugger;
    formDispatch(serverValidation({
      status: error.code
    }));
  });
}
function forgotPassword({
  dispatch,
  state,
  formDispatch
}) {
  dispatch({
    type: actionTypes$2.REQUEST_PASS_CHANGE_STARTED
  });
  const {
    email
  } = state;
  Parse.User.requestPasswordReset(email).then(function (result) {
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_SUCCESS,
      token: result.token,
      message: `A link for password change  has been sent to, ${email}! `
    });
    console.log("Password reset request was sent successfully");
  }).catch(function (error) {
    formDispatch(serverValidation({
      status: error.code
    }));
    console.log("The login failed with error: " + error.code + " " + error.message);
  });
}

function useParseAuth() {
  const {
    state,
    dispatch
  } = useAuthContext();
  const {
    dispatch: formDispatch
  } = useFormContext();

  function signup() {
    signUp({
      state,
      dispatch,
      formDispatch
    });
  }

  function login$1() {
    login({
      state,
      dispatch,
      formDispatch
    });
  }

  function forgotPassword$1() {
    debugger;
    forgotPassword({
      state,
      dispatch,
      formDispatch
    });
  }

  function changePassword() {}

  return {
    signup,
    login: login$1,
    changePassword,
    forgotPassword: forgotPassword$1
  };
}

const Login = L(() => import('./Login-b1a3e03b.js'));
const ChangePassword = L(() => import('./ChangePassword-254429f3.js'));
const ForgotPassword = L(() => import('./ForgotPassword-2353383d.js'));
const Signup = L(() => import('./Signup-8fd9c45c.js'));
const Profile = L(() => import('./Profile-eee06869.js'));
const AuthFeedback = L(() => import('./AuthFeedback-b5809a56.js'));
function ParseAuthentication({
  children
}) {
  const {
    signup,
    login,
    changePassword,
    forgotPassword
  } = useParseAuth();
  return h("div", {
    style: {
      paddingTop: 68
    }
  }, h(FeatureRoute, {
    path: "/changepassword"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(ChangePassword, {
    changePassword: changePassword
  }))), h(FeatureRoute, {
    path: "/login"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Login, {
    login: login
  }))), h(FeatureRoute, {
    path: "/signup"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Signup, {
    signup: signup
  }))), h(FeatureRoute, {
    path: "/forgotpassword"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(ForgotPassword, {
    forgotPassword: forgotPassword
  }))), h(FeatureRoute, {
    path: "/profile"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Profile, null))), h(FeatureRoute, {
    path: "/authfeedback"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(AuthFeedback, null))));
}

const Login$1 = L(() => import('./Login-b1a3e03b.js'));
const ChangePassword$1 = L(() => import('./ChangePassword-254429f3.js'));
const ForgotPassword$1 = L(() => import('./ForgotPassword-2353383d.js'));
const Signup$1 = L(() => import('./Signup-8fd9c45c.js'));
const Profile$1 = L(() => import('./Profile-eee06869.js'));
const AuthFeedback$1 = L(() => import('./AuthFeedback-b5809a56.js'));

const Hangouts = L(() => import('./index-a1bde45c.js'));
function AppRoutes() {
  return h("div", {
    style: {
      height: '100%',
      backgroundColor: 'yellow'
    }
  }, h(AppRoute, {
    path: "/auth"
  }, h(FormProvider, null,  h(ParseAuthentication, null), "PREACT_APP_PARSE" === 'PREACT_APP_NODEJS' )), h(AppRoute, {
    path: "/"
  }, h(Home, null)), h(AppRoute, {
    path: "/hangouts"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Hangouts, null))));
}

function AppNavigation() {
  const [drawerIsOpen, setDrawerState] = v$1(false);
  const {
    dispatch
  } = useAuthContext();
  p$1(() => {
    if (localStorage.getItem('webcom')) {
      const user = JSON.parse(localStorage.getItem('webcom'));
      recoverLocalAuthState({
        dispatch,
        user
      });
    }
  }, []);

  function toggleDrawer() {
    setDrawerState(prev => !prev);
  }

  return h("div", {
    style: {
      display: 'flex',
      width: '100%',
      height: '100%'
    }
  }, drawerIsOpen && h(Drawer, {
    style: {
      position: 'absolute'
    },
    toggleDrawer: toggleDrawer
  }, h(AuthDrawerContent, {
    toggleDrawer: toggleDrawer
  }), h(HangoutDrawerContent, {
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
  }, "WEB COM"), h(HangoutTopMenu, null)), h(AppRoutes, null)));
}

var css_248z$2 = "* {\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\n/* width */\r\n::-webkit-scrollbar {\r\n  width: 5px;\r\n}\r\n\r\n/* Track */\r\n::-webkit-scrollbar-track {\r\n  background: #f1f1f1;\r\n}\r\n\r\n/* Handle */\r\n::-webkit-scrollbar-thumb {\r\n  background: #888;\r\n}\r\n\r\n/* Handle on hover */\r\n::-webkit-scrollbar-thumb:hover {\r\n  background: #555;\r\n}\r\n\r\n@font-face{\r\n  font-family: \"Roboto\";\r\n  src: url('./Roboto-Regular.ttf');\r\n}\r\n\r\nhtml {\r\n  font-family: \"Roboto\", Arial, Helvetica, sans-serif;\r\n}\r\n\r\nbody {\r\n  --bg-color:red;\r\n}\r\n*{\r\n  box-sizing: border-box;\r\n}";
styleInject(css_248z$2);

function App() {
  return h("div", {
    style: {
      height: '95vh'
    }
  }, h(AppNavigation, null), '');
}

//Parse.serverURL = 'http://localhost:1337/parse'

H(h(AppProviders, null, h(App, null)), document.body);

export { FeatureRoute as F, L, U, _extends as _, useAppRoute as a, useMediaQuery as b, useAuthContext as c, useFormContext as d, valueChanged as e, validationStates as f, clientValidation as g, h, isClientValidationType as i, v$1 as j, useThemeContext as k, useUserName as l, getTokenFromUrl as m, List as n, ListItem as o, p$1 as p, resetInputValidationState as r, styleInject as s, useHangouts as u, validationTypes as v, y };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMDZhOTI0NzQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3JlZHVjZXIuanMiLCIuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy91cGRhdGVEZWxpdmVyZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvc2F2ZVJlY2lldmVkSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZU1lc3NhZ2UuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvcGFyc2UvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9zdGF0ZU1hcHBlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9wYXJzZS9QYXJzZVNlcnZlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0QWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC90aGVtZS90aGVtZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcFByb3ZpZGVycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L05hdkl0ZW0uanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9saXN0L2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvaWNvbnMvdXNlcjY0LnBuZyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoRHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9uYXYvSGFuZ291dERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9TZXR0xLFuZ3MuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL25hdi9IYW5nb3V0VG9wTWVudS5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvc3R5bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L0RyYXdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvQXBwQmFyLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9pY29ucy9NZW51V2hpdGUuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L01lbnUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2NvbXBhdC9kaXN0L2NvbXBhdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9Ib21lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uU3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybVJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9mb3JtLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uUmVnZXguanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9jb25zdHJhaW50VmFsaWRhdG9ycy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2h0dHAtc3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9wYXJzZS9hdXRoLWFjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvcGFyc2UvdXNlUGFyc2VBdXRoLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvUGFyc2VBdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL05vZGVBdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcFJvdXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcE5hdmlnYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9BcHAuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3VwcG9ydCA9IHtcbiAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgYmxvYjpcbiAgICAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJlxuICAgICdCbG9iJyBpbiBzZWxmICYmXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG59XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXcob2JqKSB7XG4gIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxufVxuXG5pZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgXVxuXG4gIHZhciBpc0FycmF5QnVmZmVyVmlldyA9XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3IHx8XG4gICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICB9XG4gIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gIH1cbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG4vLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgdmFyIGl0ZXJhdG9yID0ge1xuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXRlcmF0b3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICB0aGlzLm1hcCA9IHt9XG5cbiAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVycykpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgfSwgdGhpcylcbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCAnICsgdmFsdWUgOiB2YWx1ZVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICB9XG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKG5hbWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIGl0ZW1zLnB1c2godmFsdWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbn1cblxuZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgfVxuICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxufVxuXG5mdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgfVxuICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgfVxuICByZXR1cm4gY2hhcnMuam9pbignJylcbn1cblxuZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gIGlmIChidWYuc2xpY2UpIHtcbiAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gIH0gZWxzZSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICB9XG59XG5cbmZ1bmN0aW9uIEJvZHkoKSB7XG4gIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgIGlmICghYm9keSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChib2R5KVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG52YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG5mdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgcmV0dXJuIG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xID8gdXBjYXNlZCA6IG1ldGhvZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgfVxuICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgIHRoaXMuc2lnbmFsID0gaW5wdXQuc2lnbmFsXG4gICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gIH1cblxuICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdzYW1lLW9yaWdpbidcbiAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB9XG4gIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgdGhpcy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbCB8fCB0aGlzLnNpZ25hbFxuICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gIH1cbiAgdGhpcy5faW5pdEJvZHkoYm9keSlcbn1cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHtib2R5OiB0aGlzLl9ib2R5SW5pdH0pXG59XG5cbmZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgYm9keVxuICAgIC50cmltKClcbiAgICAuc3BsaXQoJyYnKVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICByZXR1cm4gZm9ybVxufVxuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgLy8gUmVwbGFjZSBpbnN0YW5jZXMgb2YgXFxyXFxuIGFuZCBcXG4gZm9sbG93ZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlIG9yIGhvcml6b250YWwgdGFiIHdpdGggYSBzcGFjZVxuICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKVxuICBwcmVQcm9jZXNzZWRIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBoZWFkZXJzXG59XG5cbkJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzXG4gIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbn1cblxuQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgIHVybDogdGhpcy51cmxcbiAgfSlcbn1cblxuUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG5SZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbn1cblxuZXhwb3J0IHZhciBET01FeGNlcHRpb24gPSBzZWxmLkRPTUV4Y2VwdGlvblxudHJ5IHtcbiAgbmV3IERPTUV4Y2VwdGlvbigpXG59IGNhdGNoIChlcnIpIHtcbiAgRE9NRXhjZXB0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgbmFtZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdmFyIGVycm9yID0gRXJyb3IobWVzc2FnZSlcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgfVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpXG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBET01FeGNlcHRpb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKGlucHV0LCBpbml0KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICBmdW5jdGlvbiBhYm9ydFhocigpIHtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICB9XG4gICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgfVxuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnb21pdCcpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgfVxuXG4gICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgIH0pXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgIHJlcXVlc3Quc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRE9ORSAoc3VjY2VzcyBvciBmYWlsdXJlKVxuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICByZXF1ZXN0LnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgfSlcbn1cblxuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG5cbmlmICghc2VsZi5mZXRjaCkge1xuICBzZWxmLmZldGNoID0gZmV0Y2hcbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxufVxuIiwidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcclxuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXHJcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPSB7XHJcbiAgICBTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRDonU0VORElOR19IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQ6J1NFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEJyxcclxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXHJcblxyXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxyXG4gICAgTE9BREVEX01FU1NBR0VTOiAnTE9BREVEX01FU1NBR0VTJyxcclxuIFxyXG4gICAgU0VBUkNIX0lOUFVUX0NIQU5HRTogJ1NFQVJDSF9JTlBVVF9DSEFOR0UnLFxyXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxyXG4gICAgQ0xFQVJFRF9IQU5HT1VUOidDTEVBUkVEX0hBTkdPVVQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXHJcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcclxuICAgIEVSUk9SX1JFQ0lFVkVEOidFUlJPUl9SRUNJRVZFRCcsXHJcbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcclxuXHJcbiAgICBTRVJWRVJfTUVTU0FHRV9SRUNJRVZFRDonU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQnLFxyXG5cclxuICAgIFxyXG4gICAgTUVTU0FHRVNfVVBEQVRFRDonTUVTU0FHRVNfVVBEQVRFRCcsXHJcbiAgICBIQU5HT1VUU19VUERBVEVEOidIQU5HT1VUU19VUERBVEVEJyxcclxuICAgIEhBTkdPVVRfVVBEQVRFRDonSEFOR09VVF9VUERBVEVEJyxcclxuICAgIFVOUkVBRF9IQU5HT1VUU19VUERBVEVEOidVTlJFQURfSEFOR09VVFNfVVBEQVRFRCcsXHJcbiAgICAvL1NPQ0tFVFxyXG5cclxuICAgIENPTk5FQ1RJTkc6J0NPTk5FQ1RJTkcnLFxyXG4gICAgT1BFTjonT1BFTicsXHJcbiAgICBDTE9TSU5HOidDTE9TSU5HJyxcclxuICAgIENMT1NFRDonQ0xPU0VEJyxcclxuICAgIFNPQ0tFVF9SRUFEWTonU09DS0VUX1JFQURZJyxcclxuICAgIFNPQ0tFVF9FUlJPUjonU09DS0VUX0VSUk9SJ1xyXG5cclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgaGFuZ291dHM6IG51bGwsXHJcbiAgaGFuZ291dDogbnVsbCxcclxuICB1bnJlYWRoYW5nb3V0czogbnVsbCxcclxuICBtZXNzYWdlczogbnVsbCxcclxuICBzZWFyY2g6ICcnLFxyXG4gIHVzZXI6IFtdLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIG1lc3NhZ2VUZXh0OiAnJyxcclxuICBvbmxpbmU6IGZhbHNlLFxyXG4gIHNvY2tldDogbnVsbCxcclxuICByZWFkeVN0YXRlOiAwLFxyXG4gIHNvY2tldE1lc3NhZ2U6IG51bGwsXHJcbiAgZmV0Y2hIYW5nb3V0czogZmFsc2UsXHJcbiAgcGVuZGluZ0hhbmdvdXQ6bnVsbCxcclxuICBtZXNzYWdlOiBudWxsXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkVSUk9SX1JFQ0lFVkVEOlxyXG4gICAgICByZXR1cm57Li4uc3RhdGUsZXJyb3I6YWN0aW9uLmVycm9yfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSxwZW5kaW5nSGFuZ291dDpudWxsfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgcGVuZGluZ0hhbmdvdXQ6YWN0aW9uLnBlbmRpbmdIYW5nb3V0fVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTEVBUkVEX0hBTkdPVVQ6XHJcbiAgICAgXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBudWxsIH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQ6XHJcblxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdW5yZWFkaGFuZ291dHM6IGFjdGlvbi51bnJlYWRoYW5nb3V0cyB9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRDpcclxuXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVEOlxyXG4gICAgIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfTUVTU0FHRV9SRUNJRVZFRDpcclxuICBcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlVGV4dDogYWN0aW9uLnRleHQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IsIGZldGNoSGFuZ291dHM6IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIGZldGNoSGFuZ291dHM6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMsIGZldGNoSGFuZ291dHM6IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxyXG4gICAgICAgICAgZy51c2VybmFtZS5pbmNsdWRlcyhzdGF0ZS5zZWFyY2gpXHJcbiAgICAgICAgKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VBUkNIX0lOUFVUX0NIQU5HRTpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXHJcbiAgICAgIH07XHJcbiAgICAvL1NPQ0tFVFxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfRVJST1I6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNPTk5FQ1RJTkc6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAwIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9QRU46XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAxIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMT1NJTkc6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAyIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMT1NFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc29ja2V0OiBhY3Rpb24uc29ja2V0IH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsIlxyXG4gIGV4cG9ydCBjb25zdCBoYW5nb3V0U3RhdGVzID0ge1xyXG4gICAgSU5WSVRFUjogJ0lOVklURVInLFxyXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXHJcbiAgICBERUNMSU5FUjogJ0RFQ0xJTkVSJyxcclxuICAgIEJMT0NLRVI6ICdCTE9DS0VSJyxcclxuICAgIFVOQkxPQ0tFUjogJ1VOQkxPQ0tFUicsXHJcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInLFxyXG4gICAvLyBhY2tub3dsZWdlbWVudFxyXG4gICAgSU5WSVRFRDogJ0lOVklURUQnLFxyXG4gICAgQUNDRVBURUQ6ICdBQ0NFUFRFRCcsXHJcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcclxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcclxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXHJcbiAgICBNRVNTQUdFRDogJ01FU1NBR0VEJyxcclxuICB9OyIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IG5hbWUsIGRpc3BhdGNoLCBoYW5nb3V0LCBvZmZsaW5lLCBvbkFwcFJvdXRlIH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlLCB0aW1lc3RhbXAgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIGNvbnN0IGRlbGl2ZXJlZEhhbmdvdXQgPSB7IC4uLmhhbmdvdXQsIGRlbGl2ZXJlZDogdHJ1ZSB9O1xyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRIYW5nb3V0KTtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQsIGhhbmdvdXQ6IGRlbGl2ZXJlZEhhbmdvdXQgfSk7XHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuXHJcbiAgICB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQsaGFuZ291dCB9KTtcclxuICB9XHJcbiAgaWYoaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJyl7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHVwZGF0ZUJvY2tlZFN0YXRlKHtkaXNwYXRjaCxuYW1lLGRlbGl2ZXJlZEhhbmdvdXR9KVxyXG4gIH1cclxuICBpZiAob2ZmbGluZSkge1xyXG4gICAgLy9yZW1vdmUgb2ZmbGluZSBoYW5nb3V0XHJcbiAgICBjb25zdCBvZmZsaW5lSGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xyXG4gICAgY29uc3Qgb2ZmbGluZWhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xyXG5cclxuICAgIGlmIChvZmZsaW5laGFuZ291dHMpIHtcclxuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gb2ZmbGluZWhhbmdvdXRzLmZpbmRJbmRleChcclxuICAgICAgICAobykgPT4gby50aW1lc3RhbXAgPT09IHRpbWVzdGFtcFxyXG4gICAgICApO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICBvZmZsaW5lSGFuZ291dEtleSxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeShvZmZsaW5laGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSkpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoaGFuZ291dC5zdGF0ZSAhPT0gJ01FU1NBTkdFUicpIHtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGRlbGl2ZXJlZEhhbmdvdXQ7XHJcblxyXG4gIGNvbnN0IGRlbGl2ZXJlZE1lc3NhZ2UgPSB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lOiBuYW1lLCBkZWxpdmVyZWQ6IHRydWUgfVxyXG5cclxuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IG1lc3NhZ2VzLmZpbmRJbmRleChcclxuICAgIChtKSA9PiBtLnRpbWVzdGFtcCA9PT0gbWVzc2FnZS50aW1lc3RhbXBcclxuICApO1xyXG4gIG1lc3NhZ2VzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGRlbGl2ZXJlZE1lc3NhZ2UpO1xyXG4gIFxyXG5cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xyXG5cclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQm9ja2VkU3RhdGUoe2Rpc3BhdGNoLGRlbGl2ZXJlZEhhbmdvdXQsbmFtZX0pe1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGRlbGl2ZXJlZEhhbmdvdXQ7XHJcbiAgY29uc3QgYmxvY2tlZE1lc3NhZ2UgPSB7IHRpbWVzdGFtcDpkZWxpdmVyZWRIYW5nb3V0LnRpbWVzdGFtcCwgdGV4dDogJ3lvdSBibG9ja2VkIHRoaXMgdXNlcicsIHVzZXJuYW1lOiBuYW1lLCB0eXBlOiAnYmxvY2tlZCcgfVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSggWy4uLm1lc3NhZ2VzLGJsb2NrZWRNZXNzYWdlXSkpO1xyXG5cclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOlsuLi5tZXNzYWdlcyxibG9ja2VkTWVzc2FnZV0gfSk7XHJcbn0iLCJpbXBvcnQgeyB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0IH0gZnJvbSAnLi91cGRhdGVEZWxpdmVyZWRIYW5nb3V0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVJbnZpdGVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY2NlcHRlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURlY2xpbmVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQmxvY2tlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVVuYmxvdmtlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHtoYW5nb3V0U3RhdGVzfSAgZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMnXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRIYW5nb3V0KHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWQsXHJcbn0pIHtcclxuXHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuXHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuXHJcbiBcclxuICBpZiAoaGFuZ291dHMpIHtcclxuICAgIGNvbnN0IGhhbmdvdXRFeGlzdCA9IGhhbmdvdXRzLmZpbmQoaGc9PiBoZy51c2VybmFtZT09PXVzZXJuYW1lKVxyXG4gICAgaWYoaGFuZ291dEV4aXN0KXtcclxuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7XHJcbiAgICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xyXG4gICAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgICB9Ly9lbmQgb2YgaGFuZ291dCBleGlzdFxyXG5lbHNle1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFsuLi5oYW5nb3V0cyxcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFsuLi5oYW5nb3V0cyxcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcbn1cclxuXHJcbn1lbHNle1xyXG5cclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogdXBkYXRlZEhhbmdvdXRzIH0pO1xyXG5cclxufVxyXG5cclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsXHJcbiAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgfSk7XHJcbiAgICBpZiAoaGFuZ291dC5zdGF0ZSAhPT0gJ01FU1NBTkdFUicpIHtcclxuICAgICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWVzc2FnZSkge1xyXG4gICAgc2F2ZVJlY2lldmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBmb2N1c2VkSGFuZ291dCB9KTtcclxuICB9XHJcblxyXG4gIGlmICh1bnJlYWQpIHtcclxuXHJcbiAgICBzd2l0Y2goaGFuZ291dC5zdGF0ZSl7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFUjpcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XHJcbiAgICAgICAgc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuIFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRNZXNzYWdlKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbn0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBudWxsO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IHRydWUgfV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFt7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xyXG4gICAgfVxyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuICBcclxuICAvL3VwZGF0ZSB1bnJlYWQgaGFuZ291dHNcclxuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuICBsZXQgdXBkYXRlZHVucmVhZHMgPSBudWxsO1xyXG4gIGlmICh1bnJlYWRoYW5nb3V0cykge1xyXG4gICAgdXBkYXRlZHVucmVhZHMgPSBbLi4udW5yZWFkaGFuZ291dHMsIHsuLi5oYW5nb3V0LHJlYWQ6ZmFsc2V9XTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZHVucmVhZHMgPSBbey4uLmhhbmdvdXQscmVhZDpmYWxzZX1dO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZHVucmVhZHMpKTtcclxuXHJcbiAgZGlzcGF0Y2goe1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICB1bnJlYWRoYW5nb3V0czogdXBkYXRlZHVucmVhZHMsXHJcbiAgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgc2F2ZVJlY2lldmVkSGFuZ291dCB9IGZyb20gJy4vc2F2ZVJlY2lldmVkSGFuZ291dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuXHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWNjZXB0ZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiAgXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FuZ2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkIH0pIHtcclxuXHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn0gLy8gRU5EIHNhdmVNZXNzYW5nZXJcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlVW5ibG9ja2VyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBoYW5nb3V0U3RhdGVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMnO1xyXG5pbXBvcnQge1xyXG4gIHNhdmVJbnZpdGVkLFxyXG4gIHNhdmVVbmJsb3ZrZWQsXHJcbiAgc2F2ZURlY2xpbmVkLFxyXG4gIHNhdmVCbG9ja2VkLFxyXG4gIHNhdmVBY2NlcHRlZCxcclxuICBzYXZlTWVzc2FnZWQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucyc7XHJcbmltcG9ydCB7XHJcbiAgc2F2ZUFjY2VwdGVyLFxyXG4gIHNhdmVCbG9ja2VyLFxyXG4gIHNhdmVEZWNsaW5lcixcclxuICBzYXZlSW52aXRlcixcclxuICBzYXZlTWVzc2FuZ2VyLFxyXG4gIHNhdmVVbmJsb2NrZXIsXHJcbn0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lc3NhZ2Uoe1xyXG4gIG1lc3NhZ2UsXHJcbiAgdXNlcm5hbWUsXHJcbiAgZGlzcGF0Y2gsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbn0pIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dCxvZmZsaW5lIH0pIHtcclxuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFRDpcclxuICAgICBcclxuICAgICAgICBzYXZlSW52aXRlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VEOlxyXG4gICAgICAgIHNhdmVVbmJsb3ZrZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxyXG4gICAgICAgIHNhdmVEZWNsaW5lZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRDpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlQmxvY2tlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XHJcbiAgICAgICAgc2F2ZUFjY2VwdGVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQ6XHJcbiAgICAgICBcclxuICAgICAgICBzYXZlTWVzc2FnZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0LCB1bnJlYWQgfSkge1xyXG4gICAgXHJcbiAgICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxyXG4gICAgICAgIHNhdmVBY2NlcHRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VSOlxyXG4gICAgICAgXHJcbiAgICAgICAgc2F2ZUJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVEZWNsaW5lcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgICBzYXZlSW52aXRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSOlxyXG4gICAgICAgIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFUjpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlVW5ibG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzIH0pIHtcclxuICAgIGhhbmdvdXRzLmZvckVhY2goKGhhbmdvdXQpID0+IHtcclxuICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobWVzc2FnZSAmJiB1c2VybmFtZSkge1xyXG4gXHJcbiAgICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnQUNLSE9XTEVER0VNRU5UJzpcclxuXHJcbiAgICAgICAgICBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsb2ZmbGluZTpmYWxzZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0hBTkdPVVQnOlxyXG5cclxuICAgICAgICAgIGlmKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PW1lc3NhZ2UuaGFuZ291dC51c2VybmFtZSl7XHJcbiAgIFxyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LHVucmVhZDpmYWxzZSB9KTtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgXHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnVU5SRUFEX0hBTkdPVVRTJzpcclxuICAgXHJcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzOiBtZXNzYWdlLmhhbmdvdXRzIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnT0ZGTElORV9BQ0tOJzpcclxuICAgICAgIFxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6dHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFttZXNzYWdlLCB1c2VybmFtZV0pO1xyXG5cclxuICByZXR1cm4ge307XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcblxyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcclxufVxyXG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0IH0pIHtcclxuXHJcbiBcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldEhhbmdvdXQoe2Rpc3BhdGNofSl7XHJcbiAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUfSlcclxufSBcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RVbnJlYWQoe2Rpc3BhdGNoLGhhbmdvdXR9KXtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCBoYW5nb3V0IH0pO1xyXG59XHJcblxyXG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcclxuLy8gZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XHJcbi8vICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XHJcbi8vIH1cclxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcclxufVxyXG5cclxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAvaGFuZ291dHMvZmluZD9zZWFyY2g9JHtzZWFyY2h9JnVzZXJuYW1lPSR7dXNlcm5hbWV9YFxyXG4gICAgKTtcclxuICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfQ09NTUFORF9TVEFSVEVEIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKHsgaGFuZ291dCwgZGlzcGF0Y2gsdXNlcm5hbWUgfSkge1xyXG4gIFxyXG4gIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS0ke2hhbmdvdXQudXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVMsIG1lc3NhZ2VzIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vL0VORCBzYXZlSW52aXRlclxyXG5cclxuXHJcblxyXG5cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTFVFX0NIQU5HRUQ6ICdWQUxVRV9DSEFOR0VEJyxcclxuICBMT0dJTl9TVEFSVEVEOiAnTE9HSU5fU1RBUlRFRCcsXHJcbiAgTE9HSU5fU1VDQ0VTUzogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gIExPR0lOX0ZBSUxFRDogJ0xPR0lOX0ZBSUxFRCcsXHJcblxyXG4gIExPR09VVF9TVEFSVEVEOiAnTE9HT1VUX1NUQVJURUQnLFxyXG4gIExPR09VVF9GQUlMRUQ6ICdMT0dPVVRfRkFJTEVEJyxcclxuICBMT0dPVVRfU1VDQ0VTUzogJ0xPR09VVF9TVUNDRVNTJyxcclxuXHJcbiAgU0lHTlVQX1NUQVJURUQ6ICdTSUdOVVBfU1RBUlRFRCcsXHJcbiAgU0lHTlVQX1NVQ0NFU1M6ICdTSUdOVVBfU1VDQ0VTUycsXHJcbiAgU0lHTlVQX0ZBSUxFRDogJ1NJR05VUF9GQUlMRUQnLFxyXG5cclxuICBDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDogJ0NIQU5HRV9QQVNTV09SRF9TVEFSVEVEJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzogJ0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfRkFJTEVEOiAnQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCcsXHJcblxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCcsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEJyxcclxuICBHT1RfVE9LRU5fRlJPTV9VUkw6ICdHT1RfVE9LRU5fRlJPTV9VUkwnLFxyXG5cclxuICBSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6ICdSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUnLFxyXG59O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgZW1haWw6ICcnLFxyXG4gIHBhc3N3b3JkOiAnJyxcclxuICBzdWNjZXNzOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICB1c2VybmFtZTogJycsXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgY29uZmlybTogJycsXHJcbiAgY3VycmVudDogJycsXHJcbiAgZW1haWxvcnVzZXJuYW1lOiAnJyxcclxuICB0b2tlbjogbnVsbCxcclxuICBpc0xvZ2dlZEluOiBmYWxzZSxcclxuICBpc1Bhc3N3b3JkQ2hhbmdlZDogZmFsc2UsXHJcbiAgYXV0aEZlZWRiYWNrOiBudWxsLFxyXG4gIHVzZXI6bnVsbFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XHJcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBbYWN0aW9uLnBheWxvYWQucHJvcE5hbWVdOiBhY3Rpb24ucGF5bG9hZC52YWx1ZSxcclxuICAgICAgfTtcclxuICBcclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXI6YWN0aW9uLnVzZXIsXHJcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lLCAnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICB1c2VyOmFjdGlvbi51c2VyLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyOmFjdGlvbi51c2VyLFxyXG4gICAgICAgIGlzUGFzc3dvcmRDaGFuZ2VkOiB0cnVlLFxyXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkw6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5pbml0U3RhdGUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgdXNlcjphY3Rpb24udXNlclxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgQXV0aFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW2F1dGhSb3V0ZV0gPSB1c2VBdXRoUm91dGVDb250ZXh0KCk7XHJcblxyXG4gIGlmIChhdXRoUm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMaW5rKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0bywgaWQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0gPSB1c2VBdXRoUm91dGVDb250ZXh0KCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2V0Um91dGUodG8pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGFcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICB7Li4ucHJvcHN9XHJcbiAgICAgIGhyZWY9e3RvfVxyXG4gICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja31cclxuICAgICAgc3R5bGU9e3sgdGV4dERlY29yYXRpb246ICdub25lJywgY29sb3I6ICdpbmhlcml0JyB9fVxyXG4gICAgLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoUm91dGVDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBdXRoUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBpbml0aWFsUm91dGUgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0gPSB1c2VTdGF0ZShpbml0aWFsUm91dGUpO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSwgW2F1dGhSb3V0ZV0pO1xyXG5cclxuICByZXR1cm4gPEF1dGhSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2F1dGhSZWR1Y2VyJztcclxuaW1wb3J0IHsgQXV0aFJvdXRlUHJvdmlkZXIgfSBmcm9tICcuL2F1dGgtcm91dGUtY29udGV4dCc7XHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlQXV0aENvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc3RhdGUsXHJcbiAgICBkaXNwYXRjaCxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBBdXRoUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfT5cclxuICAgICAgPEF1dGhSb3V0ZVByb3ZpZGVyPntjaGlsZHJlbn08L0F1dGhSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VBdXRoQ29udGV4dCwgQXV0aFByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVzZXJOYW1lKCkge1xyXG4gIGNvbnN0IFt1c2VyTmFtZSwgc2V0VXNlcm5hbWVdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbZW1haWwsIHNldEVtYWlsXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgXHJcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG5cclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgdG9rZW4sIGVtYWlsIH0gPSBKU09OLnBhcnNlKFxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJylcclxuICAgICAgKTtcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUudXNlciAmJiBzdGF0ZS51c2VyLnRva2VuKSB7XHJcbiAgXHJcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0b2tlbiB9ID1zdGF0ZS51c2VyO1xyXG4gIFxyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgfVxyXG4gIH0sIFtzdGF0ZS51c2VyXSk7XHJcblxyXG4gIHJldHVybiB7IHVzZXJuYW1lOiB1c2VyTmFtZSwgdG9rZW4sIGVtYWlsIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgLy8gc2V0IHJlYWQgdG8gdHJ1ZSBvbiB1bnJlYWQgaGFuZ291dHNcclxuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gIGNvbnN0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG5cclxuICBpZiAodW5yZWFkaGFuZ291dHMmJiB1bnJlYWRoYW5nb3V0cy5sZW5ndGg+MCkge1xyXG4gICAgXHJcbiAgICBsZXQgdXBkYXRlZHVucmVhZCA9IHVucmVhZGhhbmdvdXRzLm1hcCh1ID0+IHtcclxuICAgICAgaWYgKHUudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHsgLi4udSwgcmVhZDogdHJ1ZSB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZHVucmVhZCkpO1xyXG5kaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCx1bnJlYWRoYW5nb3V0czp1cGRhdGVkdW5yZWFkfSlcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgLy8gc2V0IGhhbmdvdXQgdG8gcmVhZFxyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7IC4uLmhhbmdvdXQsIHJlYWQ6IHRydWUgfSk7XHJcbiAgLy9cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcblxyXG4gIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgdXBkYXRlUmVhZE1lc3NzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlYWRNZXNzc2FnZXMoeyBoYW5nb3V0LCBuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgY29uc3QgdXBkYXRlZE1lc3NhZ2VzID0gbWVzc2FnZXMubWFwKChtKSA9PiB7XHJcbiAgICByZXR1cm4geyAuLi5tLCByZWFkOiB0cnVlIH07XHJcbiAgfSk7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge1xyXG4gIHVzZUNvbnRleHQsXHJcbiAgdXNlTWVtbyxcclxuICB1c2VSZWR1Y2VyLFxyXG4gIHVzZUVmZmVjdCxcclxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xyXG5pbXBvcnQge3VzZU1lc3NhZ2V9IGZyb20gJy4vdXNlTWVzc2FnZSdcclxuXHJcbmltcG9ydCB7XHJcbiAgbG9hZEhhbmdvdXRzLFxyXG4gIGxvYWRNZXNzYWdlcywgXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHt1c2VVc2VyTmFtZX0gZnJvbSAnLi4vLi4vYXV0aC91c2VVc2VyTmFtZSdcclxuaW1wb3J0IHsgdXBkYXRlUmVhZEhhbmdvdXRzIH0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cyc7XHJcblxyXG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEhhbmdvdXRDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XHJcbiBjb25zdCB7dXNlcm5hbWUsdG9rZW59PXVzZVVzZXJOYW1lKClcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgeyBoYW5nb3V0LG1lc3NhZ2UgfSA9IHN0YXRlO1xyXG4gIGNvbnN0IGhhbmRsZU1lc3NhZ2UgPXVzZU1lc3NhZ2Uoe21lc3NhZ2UsdXNlcm5hbWUsZGlzcGF0Y2gsZm9jdXNlZEhhbmdvdXQ6aGFuZ291dH0pXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3VzZXJuYW1lXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSAmJiB0b2tlbikge1xyXG4gICAgIFxyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaGFuZ291dCAmJiB1c2VybmFtZSkge1xyXG4gIFxyXG4gICAgICAvL2Zyb20gbG9jYWwgc3RvcmFnZVxyXG4gICAgICBsb2FkTWVzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XHJcblxyXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcclxuICAgICAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYDtcclxuICAgICAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxyXG4gICAgICAgICAgKGcpID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWVcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcclxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFoYW5nb3V0LnJlYWQpIHtcclxuICAgICBcclxuICAgICBcclxuICAgICAgICB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZTogdXNlcm5hbWUgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbaGFuZ291dCwgdXNlcm5hbWVdKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVQZW5kaW5nSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvbmxpbmUsaXNCbG9ja2VyIH0pIHtcclxuXHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuICBsZXQgaGFuZ291dEtleSA9ICcnO1xyXG4gIGxldCBtZXNzYWdlS2V5ID0gJyc7XHJcbiAgaWYgKG9ubGluZSkge1xyXG4gICAgXHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICB9IGVsc2Uge1xyXG4gICAgXHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tb2ZmbGluZS1tZXNzYWdlc2A7XHJcbiAgfVxyXG5cclxuICBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudGV4dCAhPT1cIlwiKSB7XHJcbiAgICBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIHVzZXJuYW1lLCBtZXNzYWdlLGRpc3BhdGNoLGlzQmxvY2tlciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBcclxuICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGhhbmdvdXQpO1xyXG4gICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgXHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbaGFuZ291dF07XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuICB9XHJcbiBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSkge1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IFtdO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gXHJcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIG1lc3NhZ2VdO1xyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gW21lc3NhZ2VdO1xyXG4gIH1cclxuICBpZihpc0Jsb2NrZXIpe1xyXG4gXHJcbiAgICBjb25zdCBibG9ja2VyID1bLi4udXBkYXRlZE1lc3NhZ2VzLHt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIHRoaXMgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZC4nXHJcbiAgICAsdGltZXN0YW1wOiBEYXRlLm5vdygpLHR5cGU6J2Jsb2NrZXInLHVzZXJuYW1lOm1lc3NhZ2UudXNlcm5hbWUsZmxvYXQ6J3JpZ2h0J31dXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShibG9ja2VyKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiBibG9ja2VyIH0pO1xyXG4gIFxyXG4gIH1cclxuICBlbHNle1xyXG4gIFxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbiAgfVxyXG4gXHJcblxyXG59XHJcbiIsIlxyXG5leHBvcnQgZnVuY3Rpb24gc2VuZE9mZmxpbmVIYW5nb3V0cyh7IHNvY2tldCwgbmFtZSB9KSB7XHJcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcclxuICBjb25zdCBvZmZsaW5lSGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG9mZmxpbmVIYW5nb3V0S2V5KSk7XHJcbiAgaWYgKG9mZmxpbmVIYW5nb3V0cykge1xyXG4gICAgb2ZmbGluZUhhbmdvdXRzLmZvcmVFYWNoKChoKSA9PiB7XHJcbiAgICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHVzZXJuYW1lOiBoLnVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWw6IGguZW1haWwsXHJcbiAgICAgICAgICBtZXNzYWdlOiBoLm1lc3NhZ2UsXHJcbiAgICAgICAgICB0aW1lc3RhbXA6IGgudGltZXN0YW1wLFxyXG4gICAgICAgICAgY29tbWFuZDogaC5zdGF0ZSxcclxuICAgICAgICAgIG9mZmxpbmU6IHRydWUsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICByZXR1cm47XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZSwgaGFuZ291dCxkaXNwYXRjaH0pe1xyXG4gICAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcclxuICAgIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgICBsZXQgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcbiAgIFxyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgY29uc3QgZmlsdGVyZWRIYW5nb3V0cyA9IHVucmVhZGhhbmdvdXRzLmZpbHRlcihmdW5jdGlvbih1bnJlYWQpICB7XHJcbiAgICAgICAgICAgIHJldHVybiAgdW5yZWFkLnVzZXJuYW1lICE9PSB1c2VybmFtZX0pO1xyXG4gICAgICAgICBcclxuICAgICAgICAgICAgaWYoZmlsdGVyZWRIYW5nb3V0cy5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KGZpbHRlcmVkSGFuZ291dHMpKTtcclxuICAgICAgICAgICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgICAgICAgICAgICAgIHVucmVhZGhhbmdvdXRzOiBmaWx0ZXJlZEhhbmdvdXRzLFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHVucmVhZGhhbmdvdXRzS2V5KTtcclxuICAgICAgICAgICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxyXG4gICAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0czogW10sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuICAgICAgXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IHNhdmVQZW5kaW5nSGFuZ291dCB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2F2ZVBlbmRpbmdIYW5nb3V0JztcclxuaW1wb3J0IHtcclxuXHJcbiAgc2VsZWN0VW5yZWFkLFxyXG4gIFxyXG4gIGZldGNoSGFuZ291dCxcclxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcclxufSBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyBzZW5kT2ZmbGluZUhhbmdvdXRzIH0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzJztcclxuaW1wb3J0IHtyZW1vdmVIYW5nb3V0RnJvbVVucmVhZH0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3JlbW92ZUhhbmdvdXRGcm9tVW5yZWFkJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCAgdXNlcm5hbWUgID0gYXV0aENvbnRleHQuc3RhdGUudXNlciAmJmF1dGhDb250ZXh0LnN0YXRlLnVzZXIudXNlcm5hbWU7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VIYW5nb3V0Q29udGV4dCgpO1xyXG4gIGNvbnN0IHtcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIHNlYXJjaCxcclxuICAgIHVzZXJzLFxyXG4gICAgbWVzc2FnZVRleHQsXHJcbiAgICBtZXNzYWdlcyxcclxuICAgIHJlYWR5U3RhdGUsXHJcbiAgXHJcbiAgICB1bnJlYWRoYW5nb3V0cyxcclxuICB9ID0gc3RhdGU7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIHJlYWR5U3RhdGUgPT09IDEgJiYgdXNlcm5hbWUpIHtcclxuICAgICAgc2VuZE9mZmxpbmVIYW5nb3V0cyh7IG5hbWU6IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICB9LCBbcmVhZHlTdGF0ZSwgdXNlcm5hbWVdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25SZW1vdmVVbnJlYWQoZSl7XHJcbiAgICBjb25zdCBpZCA9ZS5jdXJyZW50VGFyZ2V0LmlkXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gaWQpO1xyXG4gICBcclxuICAgIHJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkKHtuYW1lOnVzZXJuYW1lLGRpc3BhdGNoLGhhbmdvdXR9KVxyXG4gIH1cclxuICBmdW5jdGlvbiBvbk5hdmlnYXRpb24oZSl7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgIC8vIGNvbnN0IGlkID1lLnRhcmdldC5pZFxyXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxyXG4gICBcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtpZH1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KVxyXG4gIH1cclxuICBmdW5jdGlvbiBvblNlbGVjdFVucmVhZChlKSB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xyXG4gICAgXHJcbiBcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgICBzZWxlY3RVbnJlYWQoeyBkaXNwYXRjaCwgaGFuZ291dCB9KTtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uU2VhcmNoSW5wdXQoZSkge1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VBUkNIX0lOUFVUX0NIQU5HRSwgc2VhcmNoOiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uRmV0Y2hIYW5nb3V0cygpe1xyXG5cclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRH0pXHJcbiAgfVxyXG5cclxuIFxyXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xyXG4gICAgY29uc3QgdGV4dCA9IGUudGFyZ2V0LnZhbHVlO1xyXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dCB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25IYW5nb3V0KGUpIHtcclxuICAgIFxyXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0OiAnJywgZGlzcGF0Y2ggfSk7XHJcbiAgICBjb25zdCBjb21tYW5kID0gZS50YXJnZXQuaWQ7XHJcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBoYW5nb3V0O1xyXG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcclxuICAgIGNvbnN0IG1lc3NhZ2UgPVxyXG4gICAgICBtZXNzYWdlVGV4dCAhPT0gJycgPyB7IHRleHQ6IG1lc3NhZ2VUZXh0LCB0aW1lc3RhbXAgfSA6IG51bGw7XHJcblxyXG4gICAgbGV0IG9ubGluZSA9IHRydWU7XHJcbiAgICBsZXQgaXNCbG9ja2VyID1mYWxzZVxyXG4gICAgXHJcbiAgLy8gIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XHJcbiAgICAgIFxyXG4gICAgICBpZihoYW5nb3V0LnN0YXRlID09PSdCTE9DS0VSJyl7XHJcbiAgICAgICBcclxuICAgICAgICBpc0Jsb2NrZXI9dHJ1ZVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHBlbmRpbmdIYW5nb3V0PSB7XHJcbiAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICBjb21tYW5kLFxyXG4gICAgICAgIHRpbWVzdGFtcCxcclxuICAgICAgfVxyXG4gICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfU1RBUlRFRCwgcGVuZGluZ0hhbmdvdXR9KVxyXG4gICAgLy8gfSBlbHNlIHtcclxuICAgIC8vICAgb25saW5lID0gZmFsc2U7XHJcbiAgICAvLyB9XHJcbiAgIFxyXG4gXHJcbiAgICBzYXZlUGVuZGluZ0hhbmdvdXQoe1xyXG4gICAgICBkaXNwYXRjaCxcclxuICAgICAgbmFtZTogdXNlcm5hbWUsXHJcbiAgICAgIGhhbmdvdXQ6IHtcclxuICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICBzdGF0ZTogY29tbWFuZCxcclxuICAgICAgICBtZXNzYWdlOiB7IHRleHQ6IG1lc3NhZ2VUZXh0LCB0aW1lc3RhbXAsIGRlbGl2ZXJlZDogZmFsc2UsIHVzZXJuYW1lIH0sXHJcbiAgICAgICAgdGltZXN0YW1wLFxyXG4gICAgICAgIGRlbGl2ZXJlZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICAgIG9ubGluZSxcclxuICAgICAgaXNCbG9ja2VyXHJcbiAgICB9KTtcclxuICB9Ly9lbmQgb25IYW5nb3V0XHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXRlLFxyXG4gICAgb25OYXZpZ2F0aW9uLFxyXG4gICAgb25TZWxlY3RVbnJlYWQsXHJcbiAgICBvbk1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZVRleHQsXHJcbiAgICBvblNlYXJjaElucHV0LFxyXG4gICAgb25GZXRjaEhhbmdvdXRzLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICB1c2VycyxcclxuICAgIHVzZXJuYW1lLFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICBvbkhhbmdvdXQsXHJcbiAgICB1bnJlYWRoYW5nb3V0cyxcclxuICAgIHJlYWR5U3RhdGUsXHJcbiAgICBvblJlbW92ZVVucmVhZFxyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIHNlYXJjaCBIYW5nb3V0XHJcbiAgICAgICAgY29uc3QgdXNlciA9IFBhcnNlLlVzZXIuY3VycmVudCgpO1xyXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFwiSGFuZ291dFwiKTtcclxuICAgICAgICBxdWVyeS5lcXVhbFRvKCd1c2VyaWQnLHVzZXIuaWQpXHJcbiAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLHNlYXJjaClcclxuICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gYXdhaXQgcXVlcnkuZmluZCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHNlYXJjaFJlc3VsdC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgIGxldCBtYXBwZWRIYW5vdXRzID0gc2VhcmNoUmVzdWx0Lm1hcChzPT57cmV0dXJuIHt1c2VybmFtZTpzLmF0dHJpYnV0ZXMudXNlcm5hbWUsIGVtYWlsOnMuYXR0cmlidXRlcy5lbWFpbCxzdGF0ZTpzLmF0dHJpYnV0ZXMuc3RhdGV9fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzOm1hcHBlZEhhbm91dHMgfSlcclxuICAgICAgICB9ICBcclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAvLyBzZWFyY2ggSGFuZ291dFVzZXJcclxuICAgICAgICAgICAgY29uc3QgSGFuZ291dFVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KEhhbmdvdXRVc2VyKTtcclxuICAgICAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLHNlYXJjaClcclxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IGF3YWl0IHF1ZXJ5LmZpbmQoKTtcclxuICAgICAgICAgICAgbGV0IG1hcHBlZEhhbm91dHMgPSBzZWFyY2hSZXN1bHQubWFwKHM9PntyZXR1cm4ge3VzZXJuYW1lOnMuYXR0cmlidXRlcy51c2VybmFtZSwgZW1haWw6cy5hdHRyaWJ1dGVzLmVtYWlsLHN0YXRlOidJTlZJVEUnfX0pXHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0czptYXBwZWRIYW5vdXRzIH0pXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuRVJST1JfUkVDSUVWRUQsZXJyb3J9KVxyXG4gICAgfVxyXG5cclxufSIsIlxyXG4vL2lzIHNlbnQgYnkgY2xpZW50XHJcbmV4cG9ydCBjb25zdCBjbGllbnRDb21tYW5kcyA9IHtcclxuICBJTlZJVEU6ICdJTlZJVEUnLFxyXG4gIEFDQ0VQVDogJ0FDQ0VQVCcsXHJcbiAgREVDTElORTogJ0RFQ0xJTkUnLFxyXG4gIEJMT0NLOiAnQkxPQ0snLFxyXG4gIFVOQkxPQ0s6ICdVTkJMT0NLJyxcclxuICBNRVNTQUdFOiAnTUVTU0FHRScsXHJcbiAgT05MSU5FOidPTkxJTkUnXHJcbn07XHJcblxyXG4iLCJpbXBvcnQgeyBoYW5nb3V0U3RhdGVzIH0gZnJvbSAnLi9oYW5nb3V0U3RhdGVzJ1xyXG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcydcclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXRlTWFwcGVyKHsgY29tbWFuZCB9KSB7XHJcbiAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLkFDQ0VQVDpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuQUNDRVBURVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuQkxPQ0s6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5CTE9DS0VELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuQkxPQ0tFUlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5ERUNMSU5FOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuREVDTElORUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5ERUNMSU5FUlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5JTlZJVEU6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5JTlZJVEVELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuSU5WSVRFUlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5NRVNTQUdFOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5NRVNTQU5HRVJcclxuICAgICAgICAgICAgfVxyXG4gICBcclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLlVOQkxPQ0s6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5VTkJMT0NLRUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5VTkJMT0NLRVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsaWVudENvbW1hbmQgdHlwZSBub3Qgc3BlY2lmaWVkJylcclxuICAgIH1cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuLi91c2VIYW5nb3V0cydcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXHJcbmltcG9ydCB7IHN0YXRlTWFwcGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL3N0YXRlTWFwcGVyJ1xyXG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4uLy4uLy4uL2hhbmdvdXRzL3N0YXRlL2NsaWVudENvbW1hbmRzJ1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0J1xyXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgZnVuY3Rpb24gUGFyc2VTZXJ2ZXIocHJvcHMpIHtcclxuICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzXHJcbiAgICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlSGFuZ291dHMoKVxyXG4gICAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpXHJcbiAgICBjb25zdCB7IHVzZXIgfSA9IGF1dGhDb250ZXh0LnN0YXRlXHJcbiAgICBjb25zdCB7IGZldGNoSGFuZ291dHMsIHNlYXJjaCwgcGVuZGluZ0hhbmdvdXQgfSA9IHN0YXRlXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAoZmV0Y2hIYW5nb3V0cykge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgYWN0aW9ucy5mZXRjaEhhbmdvdXRzKHsgZGlzcGF0Y2gsIHNlYXJjaCB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCBbZmV0Y2hIYW5nb3V0c10pXHJcblxyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHBlbmRpbmdIYW5nb3V0KSB7XHJcblxyXG4gICAgICAgICAgICBzZW5kSGFuZ291dCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIFtwZW5kaW5nSGFuZ291dF0pXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAodXNlcikge1xyXG4gICAgICAgICAgc3Vic0ZpcnN0KClcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgW3VzZXJdKVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXQgKHtoYW5nb3V0fSl7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ0lOVklURUQnOlxyXG4gICAgICAgICAgICBjYXNlICdBQ0NFUFRFRCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ0JMT0NLRUQnOlxyXG4gICAgICAgICAgICBjYXNlICdNRVNTQUdFRCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ0RFQ0xJTkVEJzpcclxuICAgICAgICAgICAgY2FzZSAnVU5CTE9DS0VEJzpcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfTUVTU0FHRV9SRUNJRVZFRCwgbWVzc2FnZTogeyBoYW5nb3V0LCB0eXBlOiAnQUNLSE9XTEVER0VNRU5UJyB9IH0pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnSU5WSVRFUic6XHJcbiAgICAgICAgICAgIGNhc2UgJ0FDQ0VQVEVSJzpcclxuICAgICAgICAgICAgY2FzZSAnQkxPQ0tFUic6XHJcbiAgICAgICAgICAgIGNhc2UgJ01FU1NBTkdFUic6XHJcbiAgICAgICAgICAgIGNhc2UgJ1VOQkxPQ0tFUic6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVELCBtZXNzYWdlOiB7IGhhbmdvdXQsIHR5cGU6ICdIQU5HT1VUJyB9IH0pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBzdWJzRmlyc3QoKXtcclxuICAgIGxldCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkhhbmdvdXRcIik7XHJcbiAgICB2YXIgY3VycmVudFVzZXIgPSBQYXJzZS5Vc2VyLmN1cnJlbnQoKTtcclxuICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsIGN1cnJlbnRVc2VyLmlkKVxyXG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9IGF3YWl0IHF1ZXJ5LnN1YnNjcmliZSgpO1xyXG4gICAgc3Vic2NyaXB0aW9uLm9uKCdjcmVhdGUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZ291dCA9IG9iamVjdC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgaGFuZGxlSGFuZ291dCh7aGFuZ291dH0pXHJcbiAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmplY3QgY3JlYXRlZCcpO1xyXG4gICAgfSk7XHJcbiAgICBzdWJzY3JpcHRpb24ub24oJ3VwZGF0ZScsIChvYmplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0ID0gb2JqZWN0LmF0dHJpYnV0ZXNcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBoYW5kbGVIYW5nb3V0KHtoYW5nb3V0fSlcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ29iamVjdCB1cGRhdGVkJyk7XHJcbiAgICB9KTtcclxuICAgIHN1YnNjcmlwdGlvbi5vbignZW50ZXInLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ29iamVjdCBlbnRlcmVkJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzdWJzY3JpcHRpb24ub24oJ2xlYXZlJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICBjb25zdCB7aGFuZ291dHN9PW9iamVjdC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICBjb25zdCBoYW5nb3V0ID1oYW5nb3V0c1swXS5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0KHtoYW5nb3V0fSlcclxuICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmplY3QgbGVmdCcpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICAgXHJcbiAgXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gc2VuZEhhbmdvdXQoKSB7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBjb25zdCB7IHNlbmRlclN0YXRlLCB0YXJnZXRTdGF0ZSB9ID0gc3RhdGVNYXBwZXIoe1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZDogcGVuZGluZ0hhbmdvdXQuY29tbWFuZCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCBtZXNzYWdlLCBvZmZsaW5lLCB0aW1lc3RhbXAgfSA9IHBlbmRpbmdIYW5nb3V0O1xyXG4gICAgICAgICAgICBjb25zdCBIYW5nb3V0ID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkhhbmdvdXRcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IFNlbmRlclVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgICAgICAgIGxldCBzZW5kZXJRdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShTZW5kZXJVc2VyKTtcclxuICAgICAgICAgICAgc2VuZGVyUXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLCB1c2VyLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICBsZXQgc2VuZGVyVXNlciA9IGF3YWl0IHNlbmRlclF1ZXJ5LmZpcnN0KClcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcblxyXG5cclxuICAgICAgICAgICAgY29uc3QgVGFyZ2V0VXNlciA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0VXNlclwiKTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldFF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFRhcmdldFVzZXIpO1xyXG4gICAgICAgICAgICB0YXJnZXRRdWVyeS5lcXVhbFRvKCd1c2VybmFtZScsIHVzZXJuYW1lKVxyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0VXNlciA9IGF3YWl0IHRhcmdldFF1ZXJ5LmZpcnN0KClcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlciA9IG5ldyBIYW5nb3V0KClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgndXNlcm5hbWUnLCB1c2VybmFtZSlcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnZW1haWwnLCBlbWFpbClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnbWVzc2FnZScsIG1lc3NhZ2UpXHJcbiAgICAgICAgICAgIHNlbmRlci5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnc3RhdGUnLCBzZW5kZXJTdGF0ZSlcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgndXNlcmlkJywgc2VuZGVyVXNlci5hdHRyaWJ1dGVzLnVzZXJpZClcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IG5ldyBIYW5nb3V0KClcclxuICAgICAgICAgICAgdGFyZ2V0LnNldCgndXNlcm5hbWUnLCB1c2VyLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCdlbWFpbCcsIHVzZXIuZW1haWwpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ21lc3NhZ2UnLCBtZXNzYWdlKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCd0aW1lc3RhbXAnLCB0aW1lc3RhbXApXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ3N0YXRlJywgdGFyZ2V0U3RhdGUpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ3VzZXJpZCcsIHRhcmdldFVzZXIuYXR0cmlidXRlcy51c2VyaWQpXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBpZiAocGVuZGluZ0hhbmdvdXQuY29tbWFuZCA9PT0gY2xpZW50Q29tbWFuZHMuSU5WSVRFKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VuZGVyVXNlci5hZGRVbmlxdWUoJ2hhbmdvdXRzJywgc2VuZGVyKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXNlci5hZGRVbmlxdWUoJ2hhbmdvdXRzJywgdGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgc2VuZGVyLnNldCgnb3duZXInLHNlbmRlclVzZXIpXHJcbiAgICAgICAgICAgICAvLyAgIHNlbmRlci5zYXZlKClcclxuICAgICAgICAgICAgICAgIHRhcmdldC5zZXQoJ293bmVyJyx0YXJnZXRVc2VyKVxyXG4gICAgICAgICAgICAgICAvLyB0YXJnZXQuc2F2ZSgpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJVc2VyLnNhdmUoKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXNlci5zYXZlKClcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRRdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkhhbmdvdXRcIik7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVyeS5lcXVhbFRvKCd1c2VyaWQnLHRhcmdldFVzZXIuYXR0cmlidXRlcy51c2VyaWQpXHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SGFuZ291dCA9IGF3YWl0IHRhcmdldFF1ZXJ5LmZpcnN0KClcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2V0KCdtZXNzYWdlJyxtZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGFuZ291dC5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2V0KCdzdGF0ZScsIHRhcmdldFN0YXRlKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGFuZ291dC5zYXZlKClcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gUGFyc2UuVXNlci5jdXJyZW50KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VuZGVyUXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJIYW5nb3V0XCIpO1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyUXVlcnkuZXF1YWxUbygndXNlcmlkJyxjdXJyZW50VXNlci5pZClcclxuICAgICAgICAgICAgICAgIGxldCBzZW5kZXJIYW5nb3V0ID0gYXdhaXQgc2VuZGVyUXVlcnkuZmlyc3QoKVxyXG4gICAgICAgICAgICAgICAgc2VuZGVySGFuZ291dC5zZXQoJ21lc3NhZ2UnLG1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJIYW5nb3V0LnNldCgndGltZXN0YW1wJywgdGltZXN0YW1wKVxyXG4gICAgICAgICAgICAgICAgc2VuZGVySGFuZ291dC5zZXQoJ3N0YXRlJywgc2VuZGVyU3RhdGUpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJIYW5nb3V0LnNhdmUoKVxyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjaGlsZHJlblxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgUGFyc2VTZXJ2ZXIgfSBmcm9tICcuL3BhcnNlL1BhcnNlU2VydmVyJ1xyXG5pbXBvcnQgeyBXZWJTb2NrZXRDb250YWluZXIgfSBmcm9tICcuL3dlYnNvY2tldC9XZWJTb2NrZXRDb250YWluZXInXHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0QWRhcHRlcihwcm9wcykge1xyXG4gICAgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfUEFSU0UnKSB7XHJcbiAgICAgICAgcmV0dXJuIDxQYXJzZVNlcnZlciB7Li4ucHJvcHN9IC8+XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChQUkVBQ1RfQVBQX0JBQ0sgPT09ICdQUkVBQ1RfQVBQX05PREVKUycpIHtcclxuICAgICAgICByZXR1cm4gPFdlYlNvY2tldENvbnRhaW5lciB7Li4ucHJvcHN9IC8+XHJcbiAgICB9XHJcblxyXG4gICAgZWxzZSByZXR1cm4gbnVsbDtcclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IE5hdkNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VOYXZDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KE5hdkNvbnRleHQpO1xyXG5cclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlTmF2Q29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBOYXZQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VOYXZpZ2F0aW9uKCkge1xyXG4gIGNvbnN0IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSA9IHVzZU5hdkNvbnRleHQoKTtcclxuICAgIGZ1bmN0aW9uIHRvZ2dsZURyYXdlcigpe1xyXG4gICAgICAgIHNldERyYXdlck9wZW4ocHJldj0+IXByZXYpXHJcbiAgICB9XHJcbiAgcmV0dXJuIHsgZHJhd2VyT3BlbiwgdG9nZ2xlRHJhd2VyIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSwgW2RyYXdlck9wZW5dKTtcclxuICByZXR1cm4gPE5hdkNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBSb3V0ZVByb3ZpZGVyIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBIYW5nb3V0QWRhcHRlciB9IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRBZGFwdGVyJztcclxuaW1wb3J0IHtIYW5nb3V0c1Byb3ZpZGVyfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJ1xyXG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuaW1wb3J0IHsgTmF2UHJvdmlkZXIgfSBmcm9tICcuLi9uYXYvTmF2UHJvdmlkZXInO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxUaGVtZVByb3ZpZGVyXHJcbiAgICAgIGluaXRTdGF0ZT17e1xyXG4gICAgICAgIHByaW1hcnk6IHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcclxuICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBIZWx2ZXRpY2EsIFwiQXJpYWxcIicsXHJcbiAgICAgICAgfSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPEFwcFJvdXRlUHJvdmlkZXJcclxuICAgICAgICB0aXRsZT1cIldlYmNvbVwiXHJcbiAgICAgICAgaW5pdFN0YXRlPXt7IHJvdXRlOiAnLycsIGZlYXR1cmVSb3V0ZTogJy9oYW5nb3V0cycgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgICAgICA8TmF2UHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICAgICAgICA8SGFuZ291dEFkYXB0ZXIgc29ja2V0VXJsPXtgd3NzOi8vJHtpcH06MzAwMGB9PlxyXG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgICAgPC9IYW5nb3V0QWRhcHRlcj5cclxuICAgICAgICAgICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICAgIFxyXG4gICAgICAgICAgPC9OYXZQcm92aWRlcj5cclxuICAgICAgICA8L0F1dGhQcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9UaGVtZVByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcydcclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0gKHByb3BzKXtcclxuY29uc3Qge2NoaWxkcmVufT1wcm9wc1xyXG5yZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiey4uLnByb3BzfT57Y2hpbGRyZW59PC9kaXY+XHJcbn0iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuXHJcblxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0XCIgey4uLnByb3BzfS8+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0SXRlbShwcm9wcykge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWl0ZW1cIiB7Li4ucHJvcHN9IC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHtMaXN0SXRlbX0iLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBUUFBQUFBWUxsVkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQUFtSkxSMFFBQUtxTkl6SUFBQUFKY0VoWmN3QUFEc1FBQUE3RUFaVXJEaHNBQUFBSGRFbE5SUWZrQkJzSUxTMVlmOUpJQUFBRG9FbEVRVlJvM3IyWlMwaFVVUmpIZjNNdGk5QlNNMmxSMHRQSmhFalNWaUVFMWFLTmxSVVZKRkVRRkZFa2J1MjFLN0dJTmhGRlJBK0NsaVV0YXROTDNJVFJOS0VSQmxFTGRVYkg3S0dtYzF2Y3JqUGp6TDMzZkdmdStIMkxnWHZPOS85OTk1d3o1M1VEU0syTU9xcFlRd1hGRkZFQS9DVEdFRDEwRStZVi9XSkZaYXZsTWlIaW1DNGVKMFFiTlg2ajU5UE1SMWZ3ZEEvVFRLRS84QkxPTXlpQzJ6N0lPWXF6Z3dkb3BGOExibnVVVXhpNitGVzh5UXB1KzJ0VzZ1QjNNdVFMM3NUa0IvdGtjSU1ydnNGdGIxUHZpbndlK0k0M01iblBiRFY4ZTA3d0ppWlB2Rk1JY0NkbmVCT1RCMTRkNFgvZlQvZFdOL3llbk9OTlRQWTc0VmNTbTVFRVlxekkzUHYrVERzcS9wSkFBbXZiRVc3S0pndSs4cEFlSU1oK2xncGpEM0VuOVVFSkE2SjMrRU1UZVZQUmVUVHpSeFRmUjFGcUFoZEU0V05zVDN1bnJjSVV6aVFIenhjdXVNY3lOdXR4a1VZMGViL1FMQXJ0U0JvNXFjTzRVNlRUbEFnTmlRSjNPUTR0MlR3U3RzTnFSV0cveUhkTUlKOWZJcTFxTU1CNVpzcG9IWXc3bG8zVEtkSTZZQ1d3VFJUVTYxcjZSYVMxQlF6S1dDc0tpcm1XUmtWYTZ5ZzFxSE1ZMDA0Mng3VjBya2pMb002Z1NoUUNTMXhMeTRWcVZRWkJZVWl0UzFsQWZDWUtHbFFJUThxcGRpeXI4V2lmZEtzd0tCV0d3RW5Ia2hOaXJWS0lpS1lPRTVNSmg0YmV5SVJZYXdER3hFRW1uMW1VaGkralYwTnBWQzhCazI0cVUvQ1ZkR3Zwak9wMGdSMjZlQW8vVDdnWFNPb0NnNS9pZ1dQWnA2UzdrTjk4MUZRWk1ZaG9oUDNsT3B1SUp6M1p6RTBtTkpRaWlNK0JvOXh3T0c2djVwWjRSTjJEczRMcWNSNnl6UFdObHZOSWxFQUxOQ2hYamxHdjFLejFEQ3RyN29ReWozc3YyNzhKSnUxS3ZpdHBUbHJ6OEh1RnFtTXVLMEFtMjhDNGdtcVh0U042cmlEWVJwY29nYmRjVWFqMXpQcXBVUmo1QzBWNGdFVUsvNGoxZHVXd1I4VjJNUjdncVlkcUNQaC9YM0hiUTZwREs0RTNIdVZKMUVLUG8xbURWZ0x1eDVRSUJZa1dHT0dhcTFSTUt3SDNxS3ZXS21UdmlJdnB5YkRHMnphaU5jL1Bjcm11N2lQSWNPcWp3NklwTkZzL21KNVRnTmN6aG4rUitTd3lVNWRVUTVrdnFRQjJ6MGdDenNkN29DM24rSXZ1SXpmQTdaemk3M3ZmbWMvTzRXWDFZN1g3OGxuY3lnbityaHJlNm9oV24rRnhMZ3F2QWRpaCthMHNrdyt6VndhM2JBVXZmY0cvWUxrTzN1cUtSdnF5Z2tjNUttMzY2VmJFR2FKYThBZ3RMTWdPYmxzQlRYd1F3VU9jdHRaN1A2MmFWdDR4NlFxZXBJdExpYjJlU2k5THJaUTYxbEpKQlNWSm4rOEhwejdmQzgrYS93QzFaQVhzM1VoVUhBQUFBQ1YwUlZoMFpHRjBaVHBqY21WaGRHVUFNakF5TUMwd05DMHlOMVF3T0RvME5UbzBOU3N3TURvd01CYXdTVlFBQUFBbGRFVllkR1JoZEdVNmJXOWthV1o1QURJd01qQXRNRFF0TWpkVU1EZzZORFU2TkRVck1EQTZNREJuN2ZIb0FBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCM2QzY3VhVzVyYzJOaGNHVXViM0pubSs0OEdnQUFBQUJKUlU1RXJrSmdnZz09XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQsXHJcbiAgICBwYXlsb2FkOiB7XHJcbiAgICAgIHByb3BOYW1lLFxyXG4gICAgICB2YWx1ZSxcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2ViY29tJyk7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX1NVQ0NFU1MgfTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxyXG4gICAgdG9rZW4sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY292ZXJMb2NhbEF1dGhTdGF0ZSh7IHVzZXIsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSwgdXNlciB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCBMaXN0LCB7IExpc3RJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9saXN0JztcclxuaW1wb3J0IHVzZXJJY29uIGZyb20gJy4vaWNvbnMvdXNlcjY0LnBuZyc7XHJcbmltcG9ydCB7IGxvZ291dCB9IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGdyaWQ6IHtcclxuICAgIGRpc3BsYXk6ICdncmlkJyxcclxuICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdhdXRvIDUlIGF1dG8nLFxyXG4gICAganVzdGlmeUl0ZW1zOiAnY2VudGVyJyxcclxuICAgIHBhZGRpbmc6IDE2XHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoRHJhd2VyQ29udGVudCh7IHRvZ2dsZURyYXdlciB9KSB7XHJcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKVxyXG4gIGNvbnN0IHsgc3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtpZH1gLCByb3V0ZTogJy9hdXRoJyB9KTtcclxuICAgIGlmIChkZXZpY2UgPT09ICdwaG9uZScpIHtcclxuICAgICAgdG9nZ2xlRHJhd2VyKClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmdUb3A6IDEwIH19PlxyXG4gICAgICB7IXN0YXRlLnVzZXIgJiYgPFVuQXV0aGVkU3RhdGUgaGFuZGxlUm91dGU9e2hhbmRsZVJvdXRlfSAvPn1cclxuICAgICAge3N0YXRlLnVzZXIgJiYgKFxyXG4gICAgICAgIDxBdXRoZWRTdGF0ZVxyXG4gICAgICAgICAgb25BcHBSb3V0ZT17b25BcHBSb3V0ZX1cclxuICAgICAgICAgIGhhbmRsZVJvdXRlPXtoYW5kbGVSb3V0ZX1cclxuICAgICAgICAgIHVzZXJOYW1lPXtzdGF0ZS51c2VyLnVzZXJuYW1lfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICl9XHJcbiAgICAgIDxociBzdHlsZT17eyBoZWlnaHQ6IDEgfX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlLCB1c2VyTmFtZSwgb25BcHBSb3V0ZSB9KSB7XHJcbiAgZnVuY3Rpb24gaGFuZGxlTG9nT3V0KCkge1xyXG5cclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6ICcvJywgcm91dGU6ICcvaG9tZScgfSk7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGltZyBzcmM9e3VzZXJJY29ufSBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDUgfX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZUxvZ091dH0gaWQ9J2xvZ291dCcgZGF0YS10ZXN0aWQ9J2xvZ291dCc+XHJcbiAgICAgICAgICAgIExvZ291dFxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDggfX0+V2VsY29tZSwge3VzZXJOYW1lfTwvZGl2PlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdjaGFuZ2VwYXNzd29yZCcgZGF0YS10ZXN0aWQ9J2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICAgIENoYW5nZSBQYXNzd29yZFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBVbkF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5ncmlkfT5cclxuICAgICAgICA8YSBocmVmPScvJyBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2xvZ2luJyBkYXRhLXRlc3RpZD0nbG9naW4nPlxyXG4gICAgICAgICAgTG9naW5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgPGRpdj58PC9kaXY+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdzaWdudXAnIGRhdGEtdGVzdGlkPSdzaWdudXAnPlxyXG4gICAgICAgICAgU2lnbnVwXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgTGlzdCwgeyBMaXN0SXRlbSB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbGlzdC9pbmRleCc7XHJcbmltcG9ydCB7IHVzZVVzZXJOYW1lIH0gZnJvbSAnLi4vLi4vYXV0aC91c2VVc2VyTmFtZSc7XHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvYWN0aW9uVHlwZXMnXHJcbmltcG9ydCB7dXNlTWVkaWFRdWVyeX0gZnJvbSAnLi4vLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXREcmF3ZXJDb250ZW50KHt0b2dnbGVEcmF3ZXJ9KSB7XHJcbmNvbnN0IHtkZXZpY2V9PXVzZU1lZGlhUXVlcnkoKVxyXG5jb25zdCB7b25BcHBSb3V0ZX0gPXVzZUFwcFJvdXRlKClcclxuXHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBpZiAodXNlcm5hbWUpIHtcclxuXHJcbiAgICAgIG9uQXBwUm91dGUoe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTonL2hhbmdvdXRzJyxyb3V0ZTonL2hhbmdvdXRzJ30pXHJcbiAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBvbkFwcFJvdXRlKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGU6Jy9sb2dpbicscm91dGU6Jy9hdXRoJ30pXHJcbiAgICB9XHJcblxyXG4gICAgaWYoZGV2aWNlPT09J3Bob25lJyl7XHJcbiAgICAgIHRvZ2dsZURyYXdlcigpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGRhdGEtdGVzdGlkPSdoYW5nb3V0cyc+XHJcbiAgICAgICAgICBIYW5nb3V0XHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuIFxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgbWVzc2FnZUljb24gZnJvbSAnLi9tZXNzYWdlLnBuZyc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGNvdW50OiB7XHJcbiAgICB3aWR0aDogMzAsXHJcbiAgICBoZWlnaHQ6IDMwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nLFxyXG4gICAgY29sb3I6ICd3aGl0ZScsXHJcbiAgICB0ZXh0QWxpZ246J2NlbnRlcicsXHJcbiAgICBib3JkZXJSYWRpdXM6MTUsXHJcbiAgICBkaXNwbGF5OidmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6J2NlbnRlcicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDonY2VudGVyJ1xyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHsgY291bnQ9MCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJ319PlxyXG4gICAgICAgICAgPGRpdj5tZXNzYWdlOjwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jb3VudH0gZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWNvdW50XCI+e2NvdW50fTwvZGl2PiBcclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gU2V0dGluZ3MocHJvcHMpIHtcclxuXHJcbiAgY29uc3QgeyBoZWlnaHQgPSAyNCxcclxuICAgIHdpZHRoID0gMjQsXHJcbiAgICBmaWxsID0gJ25vbmUnLFxyXG4gICAgY29sb3IgPSAnYmxhY2snLG9uQ2xpY2sgLGlkfT1wcm9wc1xyXG4gIFxyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gIGlkPXtpZH0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMFYweicgZmlsbD17ZmlsbH0gaWQ9e2lkfS8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGlkPXtpZH1cclxuICAgICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgICAgY29sb3I9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xOS40MyAxMi45OGMuMDQtLjMyLjA3LS42NC4wNy0uOThzLS4wMy0uNjYtLjA3LS45OGwyLjExLTEuNjVjLjE5LS4xNS4yNC0uNDIuMTItLjY0bC0yLTMuNDZjLS4xMi0uMjItLjM5LS4zLS42MS0uMjJsLTIuNDkgMWMtLjUyLS40LTEuMDgtLjczLTEuNjktLjk4bC0uMzgtMi42NUMxNC40NiAyLjE4IDE0LjI1IDIgMTQgMmgtNGMtLjI1IDAtLjQ2LjE4LS40OS40MmwtLjM4IDIuNjVjLS42MS4yNS0xLjE3LjU5LTEuNjkuOThsLTIuNDktMWMtLjIzLS4wOS0uNDkgMC0uNjEuMjJsLTIgMy40NmMtLjEzLjIyLS4wNy40OS4xMi42NGwyLjExIDEuNjVjLS4wNC4zMi0uMDcuNjUtLjA3Ljk4cy4wMy42Ni4wNy45OGwtMi4xMSAxLjY1Yy0uMTkuMTUtLjI0LjQyLS4xMi42NGwyIDMuNDZjLjEyLjIyLjM5LjMuNjEuMjJsMi40OS0xYy41Mi40IDEuMDguNzMgMS42OS45OGwuMzggMi42NWMuMDMuMjQuMjQuNDIuNDkuNDJoNGMuMjUgMCAuNDYtLjE4LjQ5LS40MmwuMzgtMi42NWMuNjEtLjI1IDEuMTctLjU5IDEuNjktLjk4bDIuNDkgMWMuMjMuMDkuNDkgMCAuNjEtLjIybDItMy40NmMuMTItLjIyLjA3LS40OS0uMTItLjY0bC0yLjExLTEuNjV6TTEyIDE1LjVjLTEuOTMgMC0zLjUtMS41Ny0zLjUtMy41czEuNTctMy41IDMuNS0zLjUgMy41IDEuNTcgMy41IDMuNS0xLjU3IDMuNS0zLjUgMy41eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTmF2SXRlbSB9IGZyb20gJy4uLy4uL25hdi9OYXZJdGVtJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uLy4uL2ljb25zL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4uLy4uL2ljb25zL1NldHTEsW5ncyc7XHJcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJy4uLy4uL2ljb25zL29ubGluZVN0YXR1cyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi4vc3RhdGUvdXNlSGFuZ291dHMnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0VG9wTWVudSgpIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuICBjb25zdCB7IHJlYWR5U3RhdGUsIHVucmVhZGhhbmdvdXRzLCBvbk5hdmlnYXRpb24sIGhhbmdvdXQgfSA9IHVzZUhhbmdvdXRzKCk7XHJcblxyXG4gIGZ1bmN0aW9uIG5hdlRvVW5yZWFkKCkge1xyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogJy9VTlJFQUQnLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cclxuICAgICAgPE5hdkl0ZW0+e3VzZXJuYW1lfTwvTmF2SXRlbT5cclxuICAgICAgPE5hdkl0ZW0+XHJcbiAgICAgICAgPE9ubGluZVN0YXR1cyByZWFkeVN0YXRlPXtyZWFkeVN0YXRlfSAvPlxyXG4gICAgICA8L05hdkl0ZW0+XHJcbiAgICAgIDxOYXZJdGVtIG9uQ2xpY2s9e25hdlRvVW5yZWFkfSBkYXRhLXRlc3RpZD1cIm5hdi11bnJlYWRzXCI+XHJcbiAgICAgICAge3VucmVhZGhhbmdvdXRzICYmIDxNZXNzYWdlIGNvdW50PXt1bnJlYWRoYW5nb3V0cy5maWx0ZXIoZj0+Zi5yZWFkPT09ZmFsc2UpLmxlbmd0aH0gLz59eycgJ31cclxuICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICB7aGFuZ291dCAmJiAoXHJcbiAgICAgICAgPE5hdkl0ZW0gICAgb25DbGljaz17b25OYXZpZ2F0aW9ufSBkYXRhLXRlc3RpZD1cIm5hdi1jb25maWdcIiBpZD1cImNvbmZpZ3VyZVwiID5cclxuICAgICAgICAgIDxTZXR0aW5nc1xyXG4gICAgICAgICAgICBmaWxsPVwid2hpdGVcIlxyXG4gICAgICAgICAgICB3aWR0aD1cIjMwXCJcclxuICAgICAgICAgICAgaGVpZ2h0PVwiMzBcIlxyXG4gICAgICAgICBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICApfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4vL1xyXG4iLCJleHBvcnQgY29uc3QgZHJhd2VyID0ge1xyXG4gIGJveFNoYWRvdzogYDBweCAzcHggM3B4IC0ycHggcmdiYSgwLCAwLCAwLCAwLjIpLDBweCAzcHggNHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTQpLCAwcHggMXB4IDhweCAwcHggcmdiYSgwLCAwLCAwLCAwLjEyKWAsXHJcblxyXG4gIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gIGxlZnQ6IDAsXHJcbiAgdG9wOiAwLFxyXG4gIHpJbmRleDogMTAsXHJcbiAgaGVpZ2h0OiAnMTAwdmgnLFxyXG4gIGJhY2tncm91bmRDb2xvcjogJyNmNWY1ZjUnLFxyXG59O1xyXG4iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCx1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGRyYXdlciB9IGZyb20gJy4vc3R5bGUnO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG5pbXBvcnQgeyB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnLi9OYXZQcm92aWRlcic7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERyYXdlcihwcm9wcykge1xyXG4gIGNvbnN0IFtwaW5uZWQsc2V0UGlubmVkXT11c2VTdGF0ZShmYWxzZSlcclxuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7IG9wZW4sIG9uQ2xpY2ssIGNoaWxkcmVuLHN0eWxlIH0gPSBwcm9wcztcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXZcclxuICAgICAgIHN0eWxlPXt7Li4uZHJhd2VyLHBvc2l0aW9uOiBkZXZpY2U9PT1cInBob25lXCIgPyAnZml4ZWQnOidyZWxhdGl2ZSd9fVxyXG4gICAgICAgIGNsYXNzTmFtZT17YGRyYXdlci0ke2RldmljZX0td2lkdGhgfVxyXG4gICAgICA+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwQmFyKHsgY2hpbGRyZW4sc3R5bGUgfSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAuLi50aGVtZS5wcmltYXJ5LFxyXG4gICAgICAgLy8gIHBvc2l0aW9uOiAnZml4ZWQnLFxyXG4gICAgICAgIC8vIGxlZnQ6IDAsXHJcbiAgICAgICAvLyAgdG9wOiAwLFxyXG4gICAgICAgIG1pbkhlaWdodDogNjQsXHJcbiAgICAgICAvLyBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAvLyBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgZGlzcGxheTonZmxleCcsLi4uc3R5bGVcclxuICAgICAgfX1cclxuICAgID5cclxuICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgJy4uL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudVdoaXRlKHsgb25DbGljaywgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPVwibWVudS13aGl0ZVwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICBmaWxsPVwid2hpdGVcIlxyXG4gICAgICB3aWR0aD1cIjI0cHhcIlxyXG4gICAgICBoZWlnaHQ9XCIyNHB4XCJcclxuICAgID5cclxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMyAxOGgxOHYtMkgzdjJ6bTAtNWgxOHYtMkgzdjJ6bTAtN3YyaDE4VjZIM3pcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGlvbiB9IGZyb20gJy4vTmF2UHJvdmlkZXInO1xyXG5pbXBvcnQgeyBNZW51V2hpdGUgfSBmcm9tICcuL2ljb25zL01lbnVXaGl0ZSc7XHJcbmV4cG9ydCBmdW5jdGlvbiBNZW51KHtvbkNsaWNrfSkge1xyXG5cclxuXHJcbiAgcmV0dXJuIDxNZW51V2hpdGUgb25DbGljaz17b25DbGlja30gaWQ9XCJtZW51XCIgLz47XHJcbn1cclxuIiwiaW1wb3J0e3VzZVN0YXRlIGFzIG4sdXNlUmVkdWNlciBhcyB0LHVzZUVmZmVjdCBhcyBlLHVzZUxheW91dEVmZmVjdCBhcyByLHVzZVJlZiBhcyBvLHVzZUltcGVyYXRpdmVIYW5kbGUgYXMgdSx1c2VNZW1vIGFzIGksdXNlQ2FsbGJhY2sgYXMgZix1c2VDb250ZXh0IGFzIGMsdXNlRGVidWdWYWx1ZSBhcyBhfWZyb21cInByZWFjdC9ob29rc1wiO2V4cG9ydCpmcm9tXCJwcmVhY3QvaG9va3NcIjtpbXBvcnR7Q29tcG9uZW50IGFzIGwsY3JlYXRlRWxlbWVudCBhcyBzLG9wdGlvbnMgYXMgdix0b0NoaWxkQXJyYXkgYXMgaCxoeWRyYXRlIGFzIHAscmVuZGVyIGFzIGQsX3VubW91bnQgYXMgbSxjbG9uZUVsZW1lbnQgYXMgeSxjcmVhdGVSZWYgYXMgYixjcmVhdGVDb250ZXh0IGFzIGcsRnJhZ21lbnQgYXMgeH1mcm9tXCJwcmVhY3RcIjtleHBvcnR7Y3JlYXRlRWxlbWVudCxjcmVhdGVDb250ZXh0LGNyZWF0ZVJlZixGcmFnbWVudCxDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7ZnVuY3Rpb24gRShuLHQpe2Zvcih2YXIgZSBpbiB0KW5bZV09dFtlXTtyZXR1cm4gbn1mdW5jdGlvbiB3KG4sdCl7Zm9yKHZhciBlIGluIG4paWYoXCJfX3NvdXJjZVwiIT09ZSYmIShlIGluIHQpKXJldHVybiEwO2Zvcih2YXIgciBpbiB0KWlmKFwiX19zb3VyY2VcIiE9PXImJm5bcl0hPT10W3JdKXJldHVybiEwO3JldHVybiExfXZhciBDPWZ1bmN0aW9uKG4pe3ZhciB0LGU7ZnVuY3Rpb24gcih0KXt2YXIgZTtyZXR1cm4oZT1uLmNhbGwodGhpcyx0KXx8dGhpcykuaXNQdXJlUmVhY3RDb21wb25lbnQ9ITAsZX1yZXR1cm4gZT1uLCh0PXIpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuX19wcm90b19fPWUsci5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHcodGhpcy5wcm9wcyxuKXx8dyh0aGlzLnN0YXRlLHQpfSxyfShsKTtmdW5jdGlvbiBfKG4sdCl7ZnVuY3Rpb24gZShuKXt2YXIgZT10aGlzLnByb3BzLnJlZixyPWU9PW4ucmVmO3JldHVybiFyJiZlJiYoZS5jYWxsP2UobnVsbCk6ZS5jdXJyZW50PW51bGwpLHQ/IXQodGhpcy5wcm9wcyxuKXx8IXI6dyh0aGlzLnByb3BzLG4pfWZ1bmN0aW9uIHIodCl7cmV0dXJuIHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWUscyhuLEUoe30sdCkpfXJldHVybiByLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PSEwLHIuZGlzcGxheU5hbWU9XCJNZW1vKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHIudD0hMCxyfXZhciBBPXYuX19iO2Z1bmN0aW9uIFMobil7ZnVuY3Rpb24gdCh0KXt2YXIgZT1FKHt9LHQpO3JldHVybiBkZWxldGUgZS5yZWYsbihlLHQucmVmKX1yZXR1cm4gdC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD10LnQ9ITAsdC5kaXNwbGF5TmFtZT1cIkZvcndhcmRSZWYoXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsdH12Ll9fYj1mdW5jdGlvbihuKXtuLnR5cGUmJm4udHlwZS50JiZuLnJlZiYmKG4ucHJvcHMucmVmPW4ucmVmLG4ucmVmPW51bGwpLEEmJkEobil9O3ZhciBrPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/aChuKS5yZWR1Y2UoZnVuY3Rpb24obixlLHIpe3JldHVybiBuLmNvbmNhdCh0KGUscikpfSxbXSk6bnVsbH0sUj17bWFwOmssZm9yRWFjaDprLGNvdW50OmZ1bmN0aW9uKG4pe3JldHVybiBuP2gobikubGVuZ3RoOjB9LG9ubHk6ZnVuY3Rpb24obil7aWYoMSE9PShuPWgobikpLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZHJlbi5vbmx5KCkgZXhwZWN0cyBvbmx5IG9uZSBjaGlsZC5cIik7cmV0dXJuIG5bMF19LHRvQXJyYXk6aH0sRj12Ll9fZTtmdW5jdGlvbiBOKG4pe3JldHVybiBuJiYoKG49RSh7fSxuKSkuX19jPW51bGwsbi5fX2s9bi5fX2smJm4uX19rLm1hcChOKSksbn1mdW5jdGlvbiBVKCl7dGhpcy5fX3U9MCx0aGlzLm89bnVsbCx0aGlzLl9fYj1udWxsfWZ1bmN0aW9uIE0obil7dmFyIHQ9bi5fXy5fX2M7cmV0dXJuIHQmJnQudSYmdC51KG4pfWZ1bmN0aW9uIEwobil7dmFyIHQsZSxyO2Z1bmN0aW9uIG8obyl7aWYodHx8KHQ9bigpKS50aGVuKGZ1bmN0aW9uKG4pe2U9bi5kZWZhdWx0fHxufSxmdW5jdGlvbihuKXtyPW59KSxyKXRocm93IHI7aWYoIWUpdGhyb3cgdDtyZXR1cm4gcyhlLG8pfXJldHVybiBvLmRpc3BsYXlOYW1lPVwiTGF6eVwiLG8udD0hMCxvfWZ1bmN0aW9uIE8oKXt0aGlzLmk9bnVsbCx0aGlzLmw9bnVsbH12Ll9fZT1mdW5jdGlvbihuLHQsZSl7aWYobi50aGVuKWZvcih2YXIgcixvPXQ7bz1vLl9fOylpZigocj1vLl9fYykmJnIuX19jKXJldHVybiByLl9fYyhuLHQuX19jKTtGKG4sdCxlKX0sKFUucHJvdG90eXBlPW5ldyBsKS5fX2M9ZnVuY3Rpb24obix0KXt2YXIgZT10aGlzO251bGw9PWUubyYmKGUubz1bXSksZS5vLnB1c2godCk7dmFyIHI9TShlLl9fdiksbz0hMSx1PWZ1bmN0aW9uKCl7b3x8KG89ITAscj9yKGkpOmkoKSl9O3QuX19jPXQuY29tcG9uZW50V2lsbFVubW91bnQsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3UoKSx0Ll9fYyYmdC5fX2MoKX07dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbjtpZighLS1lLl9fdSlmb3IoZS5fX3YuX19rWzBdPWUuc3RhdGUudSxlLnNldFN0YXRlKHt1OmUuX19iPW51bGx9KTtuPWUuby5wb3AoKTspbi5mb3JjZVVwZGF0ZSgpfTtlLl9fdSsrfHxlLnNldFN0YXRlKHt1OmUuX19iPWUuX192Ll9fa1swXX0pLG4udGhlbih1LHUpfSxVLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obix0KXtyZXR1cm4gdGhpcy5fX2ImJih0aGlzLl9fdi5fX2tbMF09Tih0aGlzLl9fYiksdGhpcy5fX2I9bnVsbCksW3MobCxudWxsLHQudT9udWxsOm4uY2hpbGRyZW4pLHQudSYmbi5mYWxsYmFja119O3ZhciBQPWZ1bmN0aW9uKG4sdCxlKXtpZigrK2VbMV09PT1lWzBdJiZuLmwuZGVsZXRlKHQpLG4ucHJvcHMucmV2ZWFsT3JkZXImJihcInRcIiE9PW4ucHJvcHMucmV2ZWFsT3JkZXJbMF18fCFuLmwuc2l6ZSkpZm9yKGU9bi5pO2U7KXtmb3IoO2UubGVuZ3RoPjM7KWUucG9wKCkoKTtpZihlWzFdPGVbMF0pYnJlYWs7bi5pPWU9ZVsyXX19OyhPLnByb3RvdHlwZT1uZXcgbCkudT1mdW5jdGlvbihuKXt2YXIgdD10aGlzLGU9TSh0Ll9fdikscj10LmwuZ2V0KG4pO3JldHVybiByWzBdKyssZnVuY3Rpb24obyl7dmFyIHU9ZnVuY3Rpb24oKXt0LnByb3BzLnJldmVhbE9yZGVyPyhyLnB1c2gobyksUCh0LG4scikpOm8oKX07ZT9lKHUpOnUoKX19LE8ucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuKXt0aGlzLmk9bnVsbCx0aGlzLmw9bmV3IE1hcDt2YXIgdD1oKG4uY2hpbGRyZW4pO24ucmV2ZWFsT3JkZXImJlwiYlwiPT09bi5yZXZlYWxPcmRlclswXSYmdC5yZXZlcnNlKCk7Zm9yKHZhciBlPXQubGVuZ3RoO2UtLTspdGhpcy5sLnNldCh0W2VdLHRoaXMuaT1bMSwwLHRoaXMuaV0pO3JldHVybiBuLmNoaWxkcmVufSxPLnByb3RvdHlwZS5jb21wb25lbnREaWRVcGRhdGU9Ty5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQ9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO24ubC5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7UChuLGUsdCl9KX07dmFyIFc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7fXZhciB0PW4ucHJvdG90eXBlO3JldHVybiB0LmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnByb3BzLmNvbnRleHR9LHQucmVuZGVyPWZ1bmN0aW9uKG4pe3JldHVybiBuLmNoaWxkcmVufSxufSgpO2Z1bmN0aW9uIGoobil7dmFyIHQ9dGhpcyxlPW4uY29udGFpbmVyLHI9cyhXLHtjb250ZXh0OnQuY29udGV4dH0sbi52bm9kZSk7cmV0dXJuIHQucyYmdC5zIT09ZSYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCksdC5wPSExKSxuLnZub2RlP3QucD8oZS5fX2s9dC5fX2ssZChyLGUpLHQuX19rPWUuX19rKToodC52PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpLHAoXCJcIixlKSxlLmFwcGVuZENoaWxkKHQudiksdC5wPSEwLHQucz1lLGQocixlLHQudiksdC5fX2s9dC52Ll9fayk6dC5wJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSksdC5oPXIsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Qudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCl9LG51bGx9ZnVuY3Rpb24geihuLHQpe3JldHVybiBzKGose3Zub2RlOm4sY29udGFpbmVyOnR9KX12YXIgRD0vXig/OmFjY2VudHxhbGlnbm1lbnR8YXJhYmljfGJhc2VsaW5lfGNhcHxjbGlwKD8hUGF0aFUpfGNvbG9yfGZpbGx8Zmxvb2R8Zm9udHxnbHlwaCg/IVIpfGhvcml6fG1hcmtlcig/IUh8V3xVKXxvdmVybGluZXxwYWludHxzdG9wfHN0cmlrZXRocm91Z2h8c3Ryb2tlfHRleHQoPyFMKXx1bmRlcmxpbmV8dW5pY29kZXx1bml0c3x2fHZlY3Rvcnx2ZXJ0fHdvcmR8d3JpdGluZ3x4KD8hQykpW0EtWl0vO2wucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9e307dmFyIEg9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvciYmU3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIil8fDYwMTAzO2Z1bmN0aW9uIFQobix0LGUpe2lmKG51bGw9PXQuX19rKWZvcig7dC5maXJzdENoaWxkOyl0LnJlbW92ZUNoaWxkKHQuZmlyc3RDaGlsZCk7cmV0dXJuIGQobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfWZ1bmN0aW9uIFYobix0LGUpe3JldHVybiBwKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH12YXIgWj12LmV2ZW50O2Z1bmN0aW9uIEkobix0KXtuW1wiVU5TQUZFX1wiK3RdJiYhblt0XSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sdCx7Y29uZmlndXJhYmxlOiExLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzW1wiVU5TQUZFX1wiK3RdfSxzZXQ6ZnVuY3Rpb24obil7dGhpc1tcIlVOU0FGRV9cIit0XT1ufX0pfXYuZXZlbnQ9ZnVuY3Rpb24obil7WiYmKG49WihuKSksbi5wZXJzaXN0PWZ1bmN0aW9uKCl7fTt2YXIgdD0hMSxlPSExLHI9bi5zdG9wUHJvcGFnYXRpb247bi5zdG9wUHJvcGFnYXRpb249ZnVuY3Rpb24oKXtyLmNhbGwobiksdD0hMH07dmFyIG89bi5wcmV2ZW50RGVmYXVsdDtyZXR1cm4gbi5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe28uY2FsbChuKSxlPSEwfSxuLmlzUHJvcGFnYXRpb25TdG9wcGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LG4uaXNEZWZhdWx0UHJldmVudGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGV9LG4ubmF0aXZlRXZlbnQ9bn07dmFyICQ9e2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGFzc319LHE9di52bm9kZTt2LnZub2RlPWZ1bmN0aW9uKG4pe24uJCR0eXBlb2Y9SDt2YXIgdD1uLnR5cGUsZT1uLnByb3BzO2lmKHQpe2lmKGUuY2xhc3MhPWUuY2xhc3NOYW1lJiYoJC5lbnVtZXJhYmxlPVwiY2xhc3NOYW1lXCJpbiBlLG51bGwhPWUuY2xhc3NOYW1lJiYoZS5jbGFzcz1lLmNsYXNzTmFtZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJjbGFzc05hbWVcIiwkKSksXCJmdW5jdGlvblwiIT10eXBlb2YgdCl7dmFyIHIsbyx1O2Zvcih1IGluIGUuZGVmYXVsdFZhbHVlJiZ2b2lkIDAhPT1lLnZhbHVlJiYoZS52YWx1ZXx8MD09PWUudmFsdWV8fChlLnZhbHVlPWUuZGVmYXVsdFZhbHVlKSxkZWxldGUgZS5kZWZhdWx0VmFsdWUpLEFycmF5LmlzQXJyYXkoZS52YWx1ZSkmJmUubXVsdGlwbGUmJlwic2VsZWN0XCI9PT10JiYoaChlLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uKG4pey0xIT1lLnZhbHVlLmluZGV4T2Yobi5wcm9wcy52YWx1ZSkmJihuLnByb3BzLnNlbGVjdGVkPSEwKX0pLGRlbGV0ZSBlLnZhbHVlKSxlKWlmKHI9RC50ZXN0KHUpKWJyZWFrO2lmKHIpZm9yKHUgaW4gbz1uLnByb3BzPXt9LGUpb1tELnRlc3QodSk/dS5yZXBsYWNlKC9bQS1aMC05XS8sXCItJCZcIikudG9Mb3dlckNhc2UoKTp1XT1lW3VdfSFmdW5jdGlvbih0KXt2YXIgZT1uLnR5cGUscj1uLnByb3BzO2lmKHImJlwic3RyaW5nXCI9PXR5cGVvZiBlKXt2YXIgbz17fTtmb3IodmFyIHUgaW4gcikvXm9uKEFuaXxUcmF8VG91KS8udGVzdCh1KSYmKHJbdS50b0xvd2VyQ2FzZSgpXT1yW3VdLGRlbGV0ZSByW3VdKSxvW3UudG9Mb3dlckNhc2UoKV09dTtpZihvLm9uZG91YmxlY2xpY2smJihyLm9uZGJsY2xpY2s9cltvLm9uZG91YmxlY2xpY2tdLGRlbGV0ZSByW28ub25kb3VibGVjbGlja10pLG8ub25iZWZvcmVpbnB1dCYmKHIub25iZWZvcmVpbnB1dD1yW28ub25iZWZvcmVpbnB1dF0sZGVsZXRlIHJbby5vbmJlZm9yZWlucHV0XSksby5vbmNoYW5nZSYmKFwidGV4dGFyZWFcIj09PWV8fFwiaW5wdXRcIj09PWUudG9Mb3dlckNhc2UoKSYmIS9eZmlsfGNoZXxyYS9pLnRlc3Qoci50eXBlKSkpe3ZhciBpPW8ub25pbnB1dHx8XCJvbmlucHV0XCI7cltpXXx8KHJbaV09cltvLm9uY2hhbmdlXSxkZWxldGUgcltvLm9uY2hhbmdlXSl9fX0oKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYhdC5tJiZ0LnByb3RvdHlwZSYmKEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsTW91bnRcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHNcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxVcGRhdGVcIiksdC5tPSEwKX1xJiZxKG4pfTt2YXIgQj1cIjE2LjguMFwiO2Z1bmN0aW9uIEcobil7cmV0dXJuIHMuYmluZChudWxsLG4pfWZ1bmN0aW9uIEoobil7cmV0dXJuISFuJiZuLiQkdHlwZW9mPT09SH1mdW5jdGlvbiBLKG4pe3JldHVybiBKKG4pP3kuYXBwbHkobnVsbCxhcmd1bWVudHMpOm59ZnVuY3Rpb24gUShuKXtyZXR1cm4hIW4uX19rJiYoZChudWxsLG4pLCEwKX1mdW5jdGlvbiBYKG4pe3JldHVybiBuJiYobi5iYXNlfHwxPT09bi5ub2RlVHlwZSYmbil8fG51bGx9dmFyIFk9ZnVuY3Rpb24obix0KXtyZXR1cm4gbih0KX07ZXhwb3J0IGRlZmF1bHR7dXNlU3RhdGU6bix1c2VSZWR1Y2VyOnQsdXNlRWZmZWN0OmUsdXNlTGF5b3V0RWZmZWN0OnIsdXNlUmVmOm8sdXNlSW1wZXJhdGl2ZUhhbmRsZTp1LHVzZU1lbW86aSx1c2VDYWxsYmFjazpmLHVzZUNvbnRleHQ6Yyx1c2VEZWJ1Z1ZhbHVlOmEsdmVyc2lvbjpcIjE2LjguMFwiLENoaWxkcmVuOlIscmVuZGVyOlQsaHlkcmF0ZTpULHVubW91bnRDb21wb25lbnRBdE5vZGU6USxjcmVhdGVQb3J0YWw6eixjcmVhdGVFbGVtZW50OnMsY3JlYXRlQ29udGV4dDpnLGNyZWF0ZUZhY3Rvcnk6RyxjbG9uZUVsZW1lbnQ6SyxjcmVhdGVSZWY6YixGcmFnbWVudDp4LGlzVmFsaWRFbGVtZW50OkosZmluZERPTU5vZGU6WCxDb21wb25lbnQ6bCxQdXJlQ29tcG9uZW50OkMsbWVtbzpfLGZvcndhcmRSZWY6Uyx1bnN0YWJsZV9iYXRjaGVkVXBkYXRlczpZLFN1c3BlbnNlOlUsU3VzcGVuc2VMaXN0Ok8sbGF6eTpMfTtleHBvcnR7QiBhcyB2ZXJzaW9uLFIgYXMgQ2hpbGRyZW4sVCBhcyByZW5kZXIsViBhcyBoeWRyYXRlLFEgYXMgdW5tb3VudENvbXBvbmVudEF0Tm9kZSx6IGFzIGNyZWF0ZVBvcnRhbCxHIGFzIGNyZWF0ZUZhY3RvcnksSyBhcyBjbG9uZUVsZW1lbnQsSiBhcyBpc1ZhbGlkRWxlbWVudCxYIGFzIGZpbmRET01Ob2RlLEMgYXMgUHVyZUNvbXBvbmVudCxfIGFzIG1lbW8sUyBhcyBmb3J3YXJkUmVmLFkgYXMgdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMsVSBhcyBTdXNwZW5zZSxPIGFzIFN1c3BlbnNlTGlzdCxMIGFzIGxhenl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGF0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhvbWUoKSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9J2hvbWUnIHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PkhvbWU8L2Rpdj47XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6ICdJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBSRVNFVF9WQUxJREFUSU9OX1NUQVRFOiAnUkVTRVRfVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBJTlBVVF9CTFVSUkVEOiAnSU5QVVRfQkxVUlJFRCcsXHJcbiAgICBJTlBVVF9GT0NVU0VEOiAnSU5QVVRfRk9DVVNFRCcsXHJcbiAgXHJcbiAgICBTRVJWRVJfVkFMSURBVElPTjogJ1NFUlZFUl9WQUxJREFUSU9OJyxcclxuICAgIENMSUVOVF9WQUxJREFUSU9OOidDTElFTlRfVkFMSURBVElPTicsXHJcbiAgXHJcbiAgICBJTkNfSU5QVVRfQ09VVE4gOidJTkNfSU5QVVRfQ09VVE4nXHJcbiAgfTtcclxuICAiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgVkFMSUQ6ICdWQUxJRCcsXHJcbiAgSU5WQUxJRDogJ0lOVkFMSUQnLFxyXG4gIElOQUNUSVZFOiAnSU5BQ1RJVkUnXHJcbn07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHsgdmFsaWRhdGlvbjoge30gfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcblxyXG4gIGxldCBuZXh0U3RhdGUgPSBudWxsO1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuZGVidWdnZXI7XHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOUFVUX0ZPQ1VTRUQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgW2FjdGlvbi5wcm9wTmFtZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgY291bnQ6IHN0YXRlLmNvdW50ICsgMSB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBmb3JtUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9mb3JtUmVkdWNlcic7XHJcbmNvbnN0IEZvcm1Db250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1Db250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZvcm1Db250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlRm9ybUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggRm9ybVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHsgc3RhdGUsIGRpc3BhdGNoIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGb3JtUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoZm9ybVJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEZvcm1Db250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9jb25zdHJhaW50XHJcbiAgRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdFTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046ICdQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046ICdFTVBUWV9TVFJJTkdfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046ICdQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTicsXHJcbiAgLy9hdXRoXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAnVVNFUk5BTUVfVEFLRU4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdSRUdJU1RFUkVEX0VNQUlMJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ0VNQUlMX05PVF9SRUdJU1RFUkVEJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDonVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQnLFxyXG4gIEFDQ09VTlRfQUxSRUFEWV9FWElTVFM6J0FDQ09VTlRfQUxSRUFEWV9FWElTVFMnXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlZBTElEX1BBU1NXT1JEOlxyXG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxyXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FOlxyXG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcclxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ2VtcHR5IHN0cmluZyBpcyBub3QgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogJ2VtYWlsIG9yIHVzZXJuYW1lIGlzIG5vdCB2YWxpZCcsXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ2ludmFsaWQgY3JlZGVudGlhbHMgcHJvdmlkZWQnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ2VtYWlsIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcsXHJcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnLFxyXG4gIFxyXG4gIEFDQ09VTlRfQUxSRUFEWV9FWElTVFM6J0FjY291bnQgYWxyZWFkeSBleGlzdHMgZm9yIHRoaXMgdXNlcm5hbWUuJ1xyXG59O1xyXG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VybmFtZVJlZ2V4ID0gL1thLXpBLVpdK1stX10qW2EtekEtWl0rL2c7XHJcbiIsImltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSAnLi92YWxpZGF0aW9uUmVnZXgnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XHJcbiAgY29uc3QgcGFzc3dvcmRDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChwYXNzd29yZFJlZ2V4KTtcclxuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuICBpZiAoIXBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSkge1xyXG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KSB7XHJcblxyXG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9YXV0aDtcclxuXHJcbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgYWNjb3VudEFscmVhZHlFeGl0czoyMDIsXHJcbiAgLy9sb2dpblxyXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcclxuICAvL3NpZ251cFxyXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXHJcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxyXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXHJcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxyXG4gIC8vbG9naW5cclxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXHJcbiAgZW1wdHlTdHJpbmdOb3RWYWxpZDogJzQwOScsXHJcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXHJcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXHJcbi8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxyXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcclxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XHJcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuIiwiXHJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xyXG5pbXBvcnQgY29uc3RWYWxUeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGUsIHZhbHVlLCBzdGF0ZSxhdXRoIH0pIHtcclxuXHJcbiAgbGV0IHZhbGlkYXRpb24gPSBudWxsO1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtcclxuICAgICAgICBlbWFpbDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgXHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT04sIC4uLnZhbGlkYXRpb24gfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXRGb3JtVmFsaWRhdGlvblN0YXRlKCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTiB9O1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwIH0pIHtcclxuZGVidWdnZXJcclxuICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgY2FzZSAxMDE6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuY3JlZGVudGlhbEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSAxMjU6XHJcbiAgICAgIGNhc2UgLTM6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxyXG4gICAgICBjYXNlICAtNDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgICBjYXNlIDIwMzpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzUmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlJFR0lTVEVSRURfRU1BSUwsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFR0lTVEVSRURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc05vdFJlZ2lzdGVyZWQ6XHJcbiBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgMjAyOlxyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNUYWtlbjpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVN0cmluZ05vdFZhbGlkOlxyXG4gICAgICBjYXNlIC0xOlxyXG4gICAgICBjYXNlIDIwMTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSAyMDA6XHJcbiAgICAgIFxyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi4vYXV0aC9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7c2VydmVyVmFsaWRhdGlvbn0gZnJvbSAnLi4vZm9ybS9hY3Rpb25zJ1xyXG5QYXJzZS5pbml0aWFsaXplKFwienR0cG5xVHI4cmVma3RCV05la1poWnhTeHdQYUFBbkVsUTlrN0N1QVwiLFwiUTdTSFNGTEc2MThpemJ5U01wQXNGQXFnbk9MYVlneE5sd2ZGaE9BclwiKTsgLy9QQVNURSBIRVJFIFlPVVIgQmFjazRBcHAgQVBQTElDQVRJT04gSUQgQU5EIFlPVVIgSmF2YVNjcmlwdCBLRVlcclxuUGFyc2Uuc2VydmVyVVJMID0gYGh0dHBzOi8vJHtpcH06MTMzNy9wYXJzZWBcclxuLy9QYXJzZS5saXZlUXVlcnlTZXJ2ZXJVUkwgPSBgaHR0cHM6Ly8ke2lwfToxMzM3L3BhcnNlYFxyXG4vL1BhcnNlLnNlcnZlclVSTCA9ICdodHRwczovL3BhcnNlYXBpLmJhY2s0YXBwLmNvbS8nXHJcbi8vUGFyc2UubGl2ZVF1ZXJ5U2VydmVyVVJMID0gYHdzczovL3dlYmFwaXMuYmFjazRhcHAuaW9gXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWduVXAoe2Rpc3BhdGNoLHN0YXRlLGZvcm1EaXNwYXRjaH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qge3VzZXJuYW1lLHBhc3N3b3JkLGVtYWlsfT1zdGF0ZVxyXG4gICAgaWYoZW1haWw9PT0nJyl7XHJcbiAgICAgIGZvcm1EaXNwYXRjaChzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6LTN9KSlcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbWFpbCBjYW5ub3QgYmUgZW10eScpXHJcbiAgICB9XHJcbiAgICBlbHNlICAgaWYocGFzc3dvcmQ9PT0nJyl7XHJcbiAgICAgIGZvcm1EaXNwYXRjaChzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6LTR9KSlcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXNzd29yZCBjYW5ub3QgYmUgZW10eScpXHJcbiAgICB9XHJcbiAgICBkZWJ1Z2dlclxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUR9KVxyXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSB1c2VyIGNsYXNzXHJcbiAgICB2YXIgdXNlciA9IG5ldyBQYXJzZS5Vc2VyKCk7XHJcbiAgICB1c2VyLnNldChcInVzZXJuYW1lXCIsIHVzZXJuYW1lKTtcclxuICAgIHVzZXIuc2V0KFwicGFzc3dvcmRcIiwgcGFzc3dvcmQpO1xyXG4gICAgdXNlci5zZXQoXCJlbWFpbFwiLCBlbWFpbCk7XHJcbiAgICBsZXQgc3VjY2VzcyA9IGF3YWl0IHVzZXIuc2lnblVwKClcclxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgJ3dlYmNvbScsXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICB0b2tlbiA6c3VjY2Vzcy5nZXQoJ3Nlc3Npb25Ub2tlbicpLFxyXG4gICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIG9iamVjdElkOnN1Y2Nlc3MuaWRcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgICBjb25zdCBIYW5nb3V0VXNlciA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0VXNlclwiKTtcclxuICAgIGNvbnN0IGhhbmdvdXRVc2VyID0gbmV3IEhhbmdvdXRVc2VyKCk7XHJcbiAgICBoYW5nb3V0VXNlci5zZXQoJ3VzZXJuYW1lJyx1c2VybmFtZSlcclxuICAgIGhhbmdvdXRVc2VyLnNldCgnZW1haWwnLGVtYWlsKVxyXG4gICAgaGFuZ291dFVzZXIuc2V0KCd1c2VyaWQnLHN1Y2Nlc3MuaWQpXHJcbiAgICBhd2FpdCAgaGFuZ291dFVzZXIuc2F2ZSgpXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUyx1c2VyOnt1c2VybmFtZSxlbWFpbCx0b2tlbjpzdWNjZXNzLmdldCgnc2Vzc2lvblRva2VuJyl9fSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGVidWdnZXJcclxuICAgIGZvcm1EaXNwYXRjaChzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6ZXJyb3IuY29kZX0pKVxyXG4gIH1cclxuICBcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9naW4oe2Rpc3BhdGNoLHN0YXRlLGZvcm1EaXNwYXRjaH0pIHtcclxuICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZH09IHN0YXRlXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEfSlcclxuICAgICAgZGVidWdnZXJcclxuICAgIC8vIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgdXNlciBjbGFzc1xyXG4gICAgICAgUGFyc2UuVXNlci5sb2dJbihlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICBsZXQgdXNlcm5hbWUgPSB1c2VyLmdldChcInVzZXJuYW1lXCIpXHJcbiAgICAgICAgbGV0IGVtYWlsID11c2VyLmdldChcImVtYWlsXCIpXHJcbiAgICAgICAgbGV0IHRva2VuID11c2VyLmdldCgnc2Vzc2lvblRva2VuJykgXHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgICAgIG9iamVjdElkOnVzZXIuaWRcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUyx1c2VyOnt1c2VybmFtZSxlbWFpbCx0b2tlbn19KVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVXNlciBjcmVhdGVkIHN1Y2Nlc3NmdWwgd2l0aCBuYW1lOiAnICsgdXNlci5nZXQoXCJ1c2VybmFtZVwiKSArICcgYW5kIGVtYWlsOiAnICsgdXNlci5nZXQoXCJlbWFpbFwiKSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICBcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGV9KSlcclxuXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCh7ZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2h9KSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG4gICAgXHJcbiAgICBQYXJzZS5Vc2VyLnJlcXVlc3RQYXNzd29yZFJlc2V0KGVtYWlsKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxyXG4gICAgICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBgQSBsaW5rIGZvciBwYXNzd29yZCBjaGFuZ2UgIGhhcyBiZWVuIHNlbnQgdG8sICR7ZW1haWx9ISBgLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiUGFzc3dvcmQgcmVzZXQgcmVxdWVzdCB3YXMgc2VudCBzdWNjZXNzZnVsbHlcIik7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICBmb3JtRGlzcGF0Y2goc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGV9KSlcclxuICAgICAgICBcclxuICAgICAgY29uc29sZS5sb2coXCJUaGUgbG9naW4gZmFpbGVkIHdpdGggZXJyb3I6IFwiICsgZXJyb3IuY29kZSArIFwiIFwiICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9KTtcclxufSIsImltcG9ydCB7dXNlQXV0aENvbnRleHR9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0J1xyXG5pbXBvcnQge3VzZUZvcm1Db250ZXh0fSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCdcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2F1dGgtYWN0aW9ucydcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVBhcnNlQXV0aCgpe1xyXG5jb25zdCB7c3RhdGUsZGlzcGF0Y2h9PSB1c2VBdXRoQ29udGV4dCgpXHJcbmNvbnN0IHtkaXNwYXRjaDpmb3JtRGlzcGF0Y2h9PSB1c2VGb3JtQ29udGV4dCgpXHJcbiAgICBmdW5jdGlvbiBzaWdudXAoKXtcclxuICAgICAgICBhY3Rpb25zLnNpZ25VcCh7c3RhdGUsZGlzcGF0Y2gsZm9ybURpc3BhdGNofSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGxvZ2luICgpe1xyXG4gICAgICAgIGFjdGlvbnMubG9naW4oe3N0YXRlLGRpc3BhdGNoLGZvcm1EaXNwYXRjaH0pICBcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKCl7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgYWN0aW9ucy5mb3Jnb3RQYXNzd29yZCh7c3RhdGUsZGlzcGF0Y2gsZm9ybURpc3BhdGNofSkgIFxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQoKXtcclxuXHJcbiAgICB9XHJcbiAgIFxyXG5cclxuICAgIHJldHVybiB7c2lnbnVwLGxvZ2luLGNoYW5nZVBhc3N3b3JkLGZvcmdvdFBhc3N3b3JkfVxyXG5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5cclxuaW1wb3J0IHtGZWF0dXJlUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQge3VzZVBhcnNlQXV0aH0gZnJvbSAnLi4vcGFyc2UvdXNlUGFyc2VBdXRoJ1xyXG5jb25zdCBMb2dpbiA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0xvZ2luJykpO1xyXG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0NoYW5nZVBhc3N3b3JkJykpO1xyXG5jb25zdCBGb3Jnb3RQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0ZvcmdvdFBhc3N3b3JkJykpO1xyXG5jb25zdCBTaWdudXAgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9TaWdudXAnKSk7XHJcbmNvbnN0IFByb2ZpbGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9Qcm9maWxlJykpO1xyXG5jb25zdCBBdXRoRmVlZGJhY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9BdXRoRmVlZGJhY2snKSk7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBhcnNlQXV0aGVudGljYXRpb24oeyBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3Qge3NpZ251cCxsb2dpbixjaGFuZ2VQYXNzd29yZCxmb3Jnb3RQYXNzd29yZH09dXNlUGFyc2VBdXRoKClcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvY2hhbmdlcGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCBjaGFuZ2VQYXNzd29yZD17Y2hhbmdlUGFzc3dvcmR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2xvZ2luJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8TG9naW4gbG9naW49e2xvZ2lufS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9zaWdudXAnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxTaWdudXAgc2lnbnVwPXtzaWdudXB9Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2ZvcmdvdHBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Rm9yZ290UGFzc3dvcmQgIGZvcmdvdFBhc3N3b3JkPXtmb3Jnb3RQYXNzd29yZH0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvcHJvZmlsZSc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFByb2ZpbGUgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvYXV0aGZlZWRiYWNrJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8QXV0aEZlZWRiYWNrIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5cclxuaW1wb3J0IHtGZWF0dXJlUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQge3VzZU5vZGVBdXRofSBmcm9tICcuL25vZGUtanMtYXV0aC91c2VOb2RlQXV0aCdcclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi9Mb2dpbicpKTtcclxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9DaGFuZ2VQYXNzd29yZCcpKTtcclxuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vU2lnbnVwJykpO1xyXG5jb25zdCBQcm9maWxlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vUHJvZmlsZScpKTtcclxuY29uc3QgQXV0aEZlZWRiYWNrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vQXV0aEZlZWRiYWNrJykpO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOb2RlQXV0aGVudGljYXRpb24oeyBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3Qge3NpZ251cCxsb2dpbixjaGFuZ2VQYXNzd29yZCxmb3Jnb3RQYXNzd29yZH09dXNlTm9kZUF1dGgoKVxyXG5cclxuXHJcbiAgIFxyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgY2hhbmdlUGFzc3dvcmQ9e2NoYW5nZVBhc3N3b3JkfSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9sb2dpbic+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPExvZ2luIGxvZ2luPXtsb2dpbn0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvc2lnbnVwJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8U2lnbnVwIHNpZ251cD17c2lnbnVwfS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9mb3Jnb3RwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkICBmb3Jnb3RQYXNzd29yZD17Zm9yZ290UGFzc3dvcmR9Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3Byb2ZpbGUnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQcm9maWxlIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEF1dGhGZWVkYmFjayAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgQXBwUm91dGUgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IEhvbWUgfSBmcm9tICcuL0hvbWUnO1xyXG5pbXBvcnQgUGFyc2VBdXRoZW50aWNhdGlvbiBmcm9tICcuLi9hdXRoL1BhcnNlQXV0aGVudGljYXRpb24nO1xyXG5pbXBvcnQgTm9kZUF1dGhlbnRpY2F0aW9uIGZyb20gJy4uL2F1dGgvTm9kZUF1dGhlbnRpY2F0aW9uJztcclxuaW1wb3J0IHsgRm9ybVByb3ZpZGVyIH0gZnJvbSAnLi4vZm9ybS9mb3JtLWNvbnRleHQnO1xyXG5jb25zdCBIYW5nb3V0cyA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9oYW5nb3V0cycpKTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVzKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzEwMCUnLGJhY2tncm91bmRDb2xvcjoneWVsbG93JyB9fT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYXV0aFwiPlxyXG4gICAgICAgIDxGb3JtUHJvdmlkZXI+XHJcbiAgICAgICAgICB7UFJFQUNUX0FQUF9CQUNLID09PSdQUkVBQ1RfQVBQX1BBUlNFJyAmJiA8UGFyc2VBdXRoZW50aWNhdGlvbi8+fVxyXG4gICAgICAgICAge1BSRUFDVF9BUFBfQkFDSyA9PT0nUFJFQUNUX0FQUF9OT0RFSlMnICYmIDxOb2RlQXV0aGVudGljYXRpb24vPn1cclxuICAgICAgICA8L0Zvcm1Qcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvXCI+XHJcbiAgICAgICAgPEhvbWUgLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuXHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICBcclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0LHVzZVN0YXRlfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IE5hdkl0ZW0gfSBmcm9tICcuLi9uYXYvTmF2SXRlbSc7XHJcbmltcG9ydCB7IEF1dGhEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vYXV0aC9BdXRoRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCAgSGFuZ291dERyYXdlckNvbnRlbnQgIGZyb20gJy4uL2hhbmdvdXRzL25hdi9IYW5nb3V0RHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEhhbmdvdXRUb3BNZW51IH0gZnJvbSAnLi4vaGFuZ291dHMvbmF2L0hhbmdvdXRUb3BNZW51JztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHJlY292ZXJMb2NhbEF1dGhTdGF0ZSB9IGZyb20gJy4uL2F1dGgvYWN0aW9ucyc7XHJcbmltcG9ydCBEcmF3ZXIgZnJvbSAnLi4vbmF2L0RyYXdlcic7XHJcbmltcG9ydCB7IEFwcEJhciB9IGZyb20gJy4uL25hdi9BcHBCYXInO1xyXG5pbXBvcnQgeyBNZW51IH0gZnJvbSAnLi4vbmF2L01lbnUnO1xyXG5pbXBvcnQge0FwcFJvdXRlc30gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcblxyXG5cclxuZXhwb3J0ICBmdW5jdGlvbiBBcHBOYXZpZ2F0aW9uKCkge1xyXG4gIGNvbnN0IFtkcmF3ZXJJc09wZW4sc2V0RHJhd2VyU3RhdGVdPXVzZVN0YXRlKGZhbHNlKVxyXG5cclxuICBcclxuICBjb25zdCB7IGRpc3BhdGNoIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG5cclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG4gICAgICAgXHJcbiAgICAgY29uc3QgdXNlciA9SlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpXHJcbiAgICAgICAgcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgdXNlclxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCBbXSk7XHJcbiAgZnVuY3Rpb24gdG9nZ2xlRHJhd2VyKCl7XHJcblxyXG4gICAgICBzZXREcmF3ZXJTdGF0ZShwcmV2PT4hcHJldilcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4Jyx3aWR0aDonMTAwJScsaGVpZ2h0OicxMDAlJ319PlxyXG4gICAgICAgIHtkcmF3ZXJJc09wZW4gJiYgIDxEcmF3ZXIgIHN0eWxlPXt7cG9zaXRpb246J2Fic29sdXRlJ319IHRvZ2dsZURyYXdlcj17dG9nZ2xlRHJhd2VyfT5cclxuXHJcbiAgICAgICAgICAgICAgPEF1dGhEcmF3ZXJDb250ZW50ICB0b2dnbGVEcmF3ZXI9e3RvZ2dsZURyYXdlcn0gLz5cclxuICAgICAgICAgICAgICA8SGFuZ291dERyYXdlckNvbnRlbnQgIHRvZ2dsZURyYXdlcj17dG9nZ2xlRHJhd2VyfSAvPlxyXG4gICAgICAgICAgPC9EcmF3ZXI+IH1cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjF9fSA+XHJcbiAgICAgICAgICA8QXBwQmFyID5cclxuICAgICAgICAgICAgICA8TWVudSBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9IC8+XHJcbiAgICAgICAgICAgICAgPE5hdkl0ZW0gc3R5bGU9e3sgZmxleDogNSB9fT5XRUIgQ09NPC9OYXZJdGVtPlxyXG4gICAgICAgICAgICAgPEhhbmdvdXRUb3BNZW51IC8+XHJcbiAgICAgICAgICA8L0FwcEJhcj5cclxuICAgICAgICAgXHJcbiAgICAgICAgICA8QXBwUm91dGVzLz5cclxuICAgICAgXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgKVxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7QXBwTmF2aWdhdGlvbn0gZnJvbSAnLi9BcHBOYXZpZ2F0aW9uJ1xyXG5pbXBvcnQge0FwcFJvdXRlc30gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcbmltcG9ydCAnLi9jc3MvYXBwLmNzcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzk1dmgnIH19PlxyXG4gICAgIDxBcHBOYXZpZ2F0aW9uLz5cclxuXHJcbiAgICAgIHsnJ31cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlcnMgfSBmcm9tICcuL0FwcFByb3ZpZGVycyc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxuLy9QYXJzZS5pbml0aWFsaXplKFwienR0cG5xVHI4cmVma3RCV05la1poWnhTeHdQYUFBbkVsUTlrN0N1QVwiLFwiUTdTSFNGTEc2MThpemJ5U01wQXNGQXFnbk9MYVlneE5sd2ZGaE9BclwiKTsgLy9QQVNURSBIRVJFIFlPVVIgQmFjazRBcHAgQVBQTElDQVRJT04gSUQgQU5EIFlPVVIgSmF2YVNjcmlwdCBLRVlcclxuLy9QYXJzZS5zZXJ2ZXJVUkwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L3BhcnNlJ1xyXG5yZW5kZXIoXHJcbiAgPEFwcFByb3ZpZGVycz5cclxuICAgIDxBcHAgLz5cclxuICA8L0FwcFByb3ZpZGVycz4sXHJcblxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiRmVhdHVyZVJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImRpc3BhdGNoIiwiZmluZCIsInVzZUFwcFJvdXRlIiwib25BcHBSb3V0ZSIsIkFwcFJvdXRlIiwiQXBwUm91dGVQcm92aWRlciIsImluaXRTdGF0ZSIsInVzZVJlZHVjZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRCIsIlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BREVEX01FU1NBR0VTIiwiU0VBUkNIX0lOUFVUX0NIQU5HRSIsIlNFTEVDVEVEX0hBTkdPVVQiLCJDTEVBUkVEX0hBTkdPVVQiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkVSUk9SX1JFQ0lFVkVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJTRVJWRVJfTUVTU0FHRV9SRUNJRVZFRCIsIk1FU1NBR0VTX1VQREFURUQiLCJIQU5HT1VUU19VUERBVEVEIiwiSEFOR09VVF9VUERBVEVEIiwiVU5SRUFEX0hBTkdPVVRTX1VQREFURUQiLCJDT05ORUNUSU5HIiwiT1BFTiIsIkNMT1NJTkciLCJDTE9TRUQiLCJTT0NLRVRfUkVBRFkiLCJTT0NLRVRfRVJST1IiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJ1bnJlYWRoYW5nb3V0cyIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwic29ja2V0IiwicmVhZHlTdGF0ZSIsInNvY2tldE1lc3NhZ2UiLCJmZXRjaEhhbmdvdXRzIiwicGVuZGluZ0hhbmdvdXQiLCJtZXNzYWdlIiwidGV4dCIsIkZFVENIX1VTRVJfRkFJTEVEIiwiRklMVEVSX0hBTkdPVVRTIiwiZmlsdGVyIiwidXNlcm5hbWUiLCJpbmNsdWRlcyIsImhhbmdvdXRTdGF0ZXMiLCJJTlZJVEVSIiwiQUNDRVBURVIiLCJERUNMSU5FUiIsIkJMT0NLRVIiLCJVTkJMT0NLRVIiLCJNRVNTQU5HRVIiLCJJTlZJVEVEIiwiQUNDRVBURUQiLCJERUNMSU5FRCIsIkJMT0NLRUQiLCJVTkJMT0NLRUQiLCJNRVNTQUdFRCIsInVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQiLCJuYW1lIiwib2ZmbGluZSIsInRpbWVzdGFtcCIsImRlbGl2ZXJlZEhhbmdvdXQiLCJkZWxpdmVyZWQiLCJoYW5nb3V0S2V5IiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImhhbmdvdXRJbmRleCIsImZpbmRJbmRleCIsInNwbGljZSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJ1cGRhdGVEZWxpdmVyZWRNZXNzYWdlIiwidXBkYXRlQm9ja2VkU3RhdGUiLCJvZmZsaW5lSGFuZ291dEtleSIsIm9mZmxpbmVoYW5nb3V0cyIsImRlbGl2ZXJlZE1lc3NhZ2UiLCJtZXNzYWdlS2V5IiwiYmxvY2tlZE1lc3NhZ2UiLCJzYXZlTWVzc2FnZWQiLCJzYXZlSW52aXRlZCIsInNhdmVBY2NlcHRlZCIsInNhdmVEZWNsaW5lZCIsInNhdmVCbG9ja2VkIiwic2F2ZVVuYmxvdmtlZCIsInNhdmVSZWNpZXZlZEhhbmdvdXQiLCJmb2N1c2VkSGFuZ291dCIsInVucmVhZCIsImhhbmdvdXRFeGlzdCIsImhnIiwicmVhZCIsInVwZGF0ZWRIYW5nb3V0cyIsInNhdmVSZWNpZXZlZE1lc3NhZ2UiLCJzYXZlVW5yZWFkSGFuZ291dCIsInVwZGF0ZWRNZXNzYWdlcyIsInVucmVhZGhhbmdvdXRzS2V5IiwidXBkYXRlZHVucmVhZHMiLCJzYXZlSW52aXRlciIsInNhdmVBY2NlcHRlciIsInNhdmVCbG9ja2VyIiwic2F2ZURlY2xpbmVyIiwic2F2ZU1lc3NhbmdlciIsInNhdmVVbmJsb2NrZXIiLCJ1c2VNZXNzYWdlIiwiaGFuZGxlQWNrbm93bGVkZ2VtZW50IiwiaGFuZGxlSGFuZ291dCIsImhhbmRsZUhhbmdvdXRzIiwiZm9yRWFjaCIsInVzZUVmZmVjdCIsImxvYWRIYW5nb3V0cyIsInNlbGVjdFVucmVhZCIsImNoYW5nZU1lc3NhZ2VUZXh0IiwibG9hZE1lc3NhZ2VzIiwia2V5IiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImNvbmZpcm0iLCJjdXJyZW50IiwiZW1haWxvcnVzZXJuYW1lIiwidG9rZW4iLCJpc0xvZ2dlZEluIiwiaXNQYXNzd29yZENoYW5nZWQiLCJhdXRoRmVlZGJhY2siLCJhdXRoUmVkdWNlciIsIm5leHRTdGF0ZSIsInBheWxvYWQiLCJwcm9wTmFtZSIsInN1Y2Nlc3NNZXNzYWdlIiwiQXV0aFJvdXRlQ29udGV4dCIsIkF1dGhSb3V0ZVByb3ZpZGVyIiwiaW5pdGlhbFJvdXRlIiwiYXV0aFJvdXRlIiwic2V0QXV0aFJvdXRlIiwidXNlU3RhdGUiLCJBdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwidXNlVXNlck5hbWUiLCJ1c2VyTmFtZSIsInNldFVzZXJuYW1lIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsIndpbmRvdyIsInVwZGF0ZVJlYWRIYW5nb3V0cyIsImxlbmd0aCIsInVwZGF0ZWR1bnJlYWQiLCJtYXAiLCJ1cGRhdGVSZWFkTWVzc3NhZ2VzIiwiSGFuZ291dENvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsIkhhbmdvdXRzUHJvdmlkZXIiLCJoYW5kbGVNZXNzYWdlIiwidXBkYXRlZCIsInNhdmVQZW5kaW5nSGFuZ291dCIsImlzQmxvY2tlciIsInNhdmVIYW5nb3V0Iiwic2F2ZU1lc3NhZ2UiLCJibG9ja2VyIiwiRGF0ZSIsIm5vdyIsImZsb2F0Iiwic2VuZE9mZmxpbmVIYW5nb3V0cyIsIm9mZmxpbmVIYW5nb3V0cyIsImZvcmVFYWNoIiwiaCIsInNlbmQiLCJjb21tYW5kIiwicmVtb3ZlSGFuZ291dEZyb21VbnJlYWQiLCJmaWx0ZXJlZEhhbmdvdXRzIiwicmVtb3ZlSXRlbSIsInVzZUhhbmdvdXRzIiwiYXV0aENvbnRleHQiLCJ1c2VycyIsIm9uUmVtb3ZlVW5yZWFkIiwiaWQiLCJjdXJyZW50VGFyZ2V0Iiwib25OYXZpZ2F0aW9uIiwic3RvcFByb3BhZ2F0aW9uIiwib25TZWxlY3RIYW5nb3V0IiwidGFyZ2V0Iiwib25TZWxlY3RVbnJlYWQiLCJvblNlYXJjaElucHV0Iiwib25GZXRjaEhhbmdvdXRzIiwib25NZXNzYWdlVGV4dCIsIm9uSGFuZ291dCIsIlBhcnNlIiwiVXNlciIsInF1ZXJ5IiwiUXVlcnkiLCJlcXVhbFRvIiwic2VhcmNoUmVzdWx0IiwibWFwcGVkSGFub3V0cyIsImF0dHJpYnV0ZXMiLCJIYW5nb3V0VXNlciIsIk9iamVjdCIsImV4dGVuZCIsImNsaWVudENvbW1hbmRzIiwiSU5WSVRFIiwiQUNDRVBUIiwiREVDTElORSIsIkJMT0NLIiwiVU5CTE9DSyIsIk1FU1NBR0UiLCJPTkxJTkUiLCJzdGF0ZU1hcHBlciIsInNlbmRlclN0YXRlIiwidGFyZ2V0U3RhdGUiLCJQYXJzZVNlcnZlciIsImFjdGlvbnMiLCJzZW5kSGFuZ291dCIsInN1YnNGaXJzdCIsImN1cnJlbnRVc2VyIiwic3Vic2NyaXB0aW9uIiwic3Vic2NyaWJlIiwib24iLCJvYmplY3QiLCJjb25zb2xlIiwibG9nIiwiSGFuZ291dCIsIlNlbmRlclVzZXIiLCJzZW5kZXJRdWVyeSIsInNlbmRlclVzZXIiLCJmaXJzdCIsIlRhcmdldFVzZXIiLCJ0YXJnZXRRdWVyeSIsInRhcmdldFVzZXIiLCJzZW5kZXIiLCJzZXQiLCJ1c2VyaWQiLCJhZGRVbmlxdWUiLCJzYXZlIiwidGFyZ2V0SGFuZ291dCIsInNlbmRlckhhbmdvdXQiLCJIYW5nb3V0QWRhcHRlciIsIlRoZW1lQ29udGV4dCIsInVzZVRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJzZXRTdGF0ZSIsIk5hdkNvbnRleHQiLCJOYXZQcm92aWRlciIsImRyYXdlck9wZW4iLCJzZXREcmF3ZXJPcGVuIiwiQXBwUHJvdmlkZXJzIiwicHJpbWFyeSIsImJhY2tncm91bmQiLCJjb2xvciIsImZvbnRGYW1pbHkiLCJpcCIsIk5hdkl0ZW0iLCJMaXN0IiwiTGlzdEl0ZW0iLCJ2YWx1ZUNoYW5nZWQiLCJsb2dvdXQiLCJnZXRUb2tlbkZyb21VcmwiLCJyZWNvdmVyTG9jYWxBdXRoU3RhdGUiLCJ1c2VNZWRpYVF1ZXJ5Iiwid2lkdGgiLCJzZXRXaWR0aCIsImhlaWdodCIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJkZXZpY2UiLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdHlsZSIsImdyaWQiLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImp1c3RpZnlJdGVtcyIsInBhZGRpbmciLCJBdXRoRHJhd2VyQ29udGVudCIsInRvZ2dsZURyYXdlciIsImhhbmRsZVJvdXRlIiwicHJldmVudERlZmF1bHQiLCJwYWRkaW5nVG9wIiwiQXV0aGVkU3RhdGUiLCJoYW5kbGVMb2dPdXQiLCJhbGlnbkl0ZW1zIiwiZmxleERpcmVjdGlvbiIsInVzZXJJY29uIiwicGFkZGluZ1JpZ2h0IiwibWFyZ2luQm90dG9tIiwiVW5BdXRoZWRTdGF0ZSIsIkhhbmdvdXREcmF3ZXJDb250ZW50IiwiY291bnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJqdXN0aWZ5Q29udGVudCIsIk1lc3NhZ2UiLCJTZXR0aW5ncyIsImZpbGwiLCJvbkNsaWNrIiwiYm9yZGVyIiwiT25saW5lU3RhdHVzIiwiSXNPbmxpbmUiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsIkhhbmdvdXRUb3BNZW51IiwibmF2VG9VbnJlYWQiLCJkcmF3ZXIiLCJib3hTaGFkb3ciLCJwb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJ6SW5kZXgiLCJEcmF3ZXIiLCJwaW5uZWQiLCJzZXRQaW5uZWQiLCJvcGVuIiwiQXBwQmFyIiwidGhlbWUiLCJtaW5IZWlnaHQiLCJNZW51V2hpdGUiLCJNZW51IiwiRSIsInciLCJDIiwibCIsIkEiLCJGIiwiTiIsIk0iLCJQIiwiRCIsIkgiLCIkIiwicSIsIkhvbWUiLCJJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSIsIlJFU0VUX1ZBTElEQVRJT05fU1RBVEUiLCJJTlBVVF9CTFVSUkVEIiwiSU5QVVRfRk9DVVNFRCIsIlNFUlZFUl9WQUxJREFUSU9OIiwiQ0xJRU5UX1ZBTElEQVRJT04iLCJJTkNfSU5QVVRfQ09VVE4iLCJWQUxJRCIsIklOVkFMSUQiLCJJTkFDVElWRSIsInZhbGlkYXRpb24iLCJmb3JtUmVkdWNlciIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblN0YXRlIiwiZm9ybVN0YXRlIiwiRm9ybUNvbnRleHQiLCJ1c2VGb3JtQ29udGV4dCIsIkZvcm1Qcm92aWRlciIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiQUNDT1VOVF9BTFJFQURZX0VYSVNUUyIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0aW9uVHlwZXMiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJpc0NsaWVudFZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsaWRhdGVFbXB0eVN0cmluZyIsInZhbGlkYXRlUGFzc3dvcmRNYXRjaCIsImF1dGgiLCJhY2NvdW50QWxyZWFkeUV4aXRzIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwiY29uc3RWYWxUeXBlcyIsInZhbGlkYXRpb25zIiwicmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSIsInNlcnZlclZhbGlkYXRpb24iLCJodHRwU3RhdHVzIiwidmFsaWRhdGlvblN0YXRlcyIsImluaXRpYWxpemUiLCJzZXJ2ZXJVUkwiLCJzaWduVXAiLCJmb3JtRGlzcGF0Y2giLCJnZXQiLCJvYmplY3RJZCIsImhhbmdvdXRVc2VyIiwiY29kZSIsImxvZ2luIiwibG9nSW4iLCJ0aGVuIiwiY2F0Y2giLCJmb3Jnb3RQYXNzd29yZCIsInJlcXVlc3RQYXNzd29yZFJlc2V0IiwicmVzdWx0IiwidXNlUGFyc2VBdXRoIiwic2lnbnVwIiwiY2hhbmdlUGFzc3dvcmQiLCJMb2dpbiIsImxhenkiLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwiUHJvZmlsZSIsIkF1dGhGZWVkYmFjayIsIlBhcnNlQXV0aGVudGljYXRpb24iLCJTdXNwZW5zZSIsIkhhbmdvdXRzIiwiQXBwUm91dGVzIiwiUFJFQUNUX0FQUF9CQUNLIiwiQXBwTmF2aWdhdGlvbiIsImRyYXdlcklzT3BlbiIsInNldERyYXdlclN0YXRlIiwicHJldiIsImZsZXgiLCJBcHAiLCJyZW5kZXIiLCJkb2N1bWVudCIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLElBQUksSUFBSTtBQUN6QyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQ3BELEVBQUUsSUFBSTtBQUNOLElBQUksWUFBWSxJQUFJLElBQUk7QUFDeEIsSUFBSSxNQUFNLElBQUksSUFBSTtBQUNsQixJQUFJLENBQUMsV0FBVztBQUNoQixNQUFNLElBQUk7QUFDVixRQUFRLElBQUksSUFBSSxHQUFFO0FBQ2xCLFFBQVEsT0FBTyxJQUFJO0FBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNsQixRQUFRLE9BQU8sS0FBSztBQUNwQixPQUFPO0FBQ1AsS0FBSyxHQUFHO0FBQ1IsRUFB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UyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1L1IsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXlFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUF1RyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxD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QUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ELEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFQSxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsQ0FBb1QsSUFBSUMsR0FBQyxDQUFDbFksQ0FBQyxDQUFDLEdBQUcsQ0FBK0tBLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDa1ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBSSxJQUFpUkMsR0FBQyxDQUFDblksQ0FBQyxDQUFDLElBQUksU0FBU29ZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ04sR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQ00sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPalksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUNKLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUNtWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJRixDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNELEdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDaFksQ0FBQyxDQUFDNlgsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJSyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUlMLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDdEssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDc0ssR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBb2UsSUFBSUMsR0FBQyxDQUFDLGtPQUFrTyxDQUFDTixDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxJQUFJTyxHQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLENBQTZNLElBQUksQ0FBQyxDQUFDeFksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSXlZLEdBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQzFZLENBQUMsQ0FBQyxLQUFLLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDd1ksR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBR0MsR0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLENBQUMsR0FBR3pLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUN1SyxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMs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
