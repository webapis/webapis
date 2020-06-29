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
      debugger;
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
  debugger;
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
          debugger;
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
  debugger;
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
}
//END saveInviter

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

function sendOfflineHangouts({
  dispatch,
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
    debugger;
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
    let isBlocker = false;
    debugger; //  if (readyState === 1) {

    debugger;

    if (hangout.state === 'BLOCKER') {
      debugger;
      isBlocker = true;
    } else {
      debugger;
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
    let {
      username
    } = user.attributes;
    const query = new Parse.Query("Hangout");
    query.equalTo('userid', user.id);
    query.equalTo('username', search);
    let searchResult = await query.find();
    debugger;

    if (searchResult.length > 0) {
      let mappedHanouts = searchResult.map(s => {
        return {
          username: s.attributes.username,
          email: s.attributes.email,
          state: s.attributes.state
        };
      });
      debugger;
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
      debugger;
    }
  } catch (error) {
    debugger;
  }
}

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

function useNavContext() {
  const context = T$1(NavContext);

  if (!context) {
    throw new Error('useNavContext must be used with NavProvider');
  }

  return context;
}

function useNavigation() {
  const [drawerOpen, setDrawerOpen] = useNavContext();

  function toggleDrawer() {
    setDrawerOpen(prev => !prev);
  }

  return {
    drawerOpen,
    toggleDrawer
  };
}
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
    socketUrl: `wss://${"192.168.43.49"}:3000`
  }, children))))));
}

function E$1(n,t){for(var e in t)n[e]=t[e];return n}function w$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var C$1=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return w$1(this.props,n)||w$1(this.state,t)},r}(m);var A$1=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),A$1&&A$1(n);};var F$1=n.__e;function N$1(n){return n&&((n=E$1({},n)).__c=null,n.__k=n.__k&&n.__k.map(N$1)),n}function U(){this.__u=0,this.o=null,this.__b=null;}function M$1(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function L(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function O(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);F$1(n,t,e);},(U.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=M$1(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},U.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=N$1(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var P$1=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(O.prototype=new m).u=function(n){var t=this,e=M$1(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),P$1(t,n,r)):o();};e?e(u):u();}},O.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},O.prototype.componentDidUpdate=O.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){P$1(n,e,t);});};var W=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var D$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var H$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var Z=n.event;function I(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){Z&&(n=Z(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var $$1={configurable:!0,get:function(){return this.class}},q$1=n.vnode;n.vnode=function(n){n.$$typeof=H$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&($$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",$$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=D$1.test(u))break;if(r)for(u in o=n.props={},e)o[D$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&(I(t.prototype,"componentWillMount"),I(t.prototype,"componentWillReceiveProps"),I(t.prototype,"componentWillUpdate"),t.m=!0);}q$1&&q$1(n);};

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

const style = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 5% auto',
    justifyItems: 'center',
    padding: 16
  }
};
function AuthDrawerContent() {
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

function HangoutDrawerContent() {
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

function Drawer(props) {
  const {
    width,
    height,
    orientation,
    device
  } = useMediaQuery();
  const {
    open,
    onClick,
    children
  } = props;
  const {
    drawerOpen,
    toggleDrawer
  } = useNavigation();
  if (drawerOpen) return h("div", {
    style: { ...drawer
    },
    className: `drawer-${device}-width`,
    onClick: toggleDrawer
  }, children);
  return null;
}

function AppBar({
  children
}) {
  const theme = useThemeContext();
  return h("div", {
    style: { ...theme.primary,
      position: 'fixed',
      // left: 0,
      top: 0,
      minHeight: 64,
      // paddingLeft: 16,
      // paddingRight: 16,
      width: '100%',
      display: 'flex'
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

function Menu() {
  const {
    drawerOpen,
    toggleDrawer
  } = useNavigation();
  return h(MenuWhite, {
    onClick: toggleDrawer,
    id: "menu"
  });
}

function AppNavigation() {
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
  return h("div", null, h(AppBar, null, h(Menu, null), h(NavItem, {
    style: {
      flex: 5
    }
  }, "WEB COM"), h(HangoutTopMenu, null)), h(Drawer, null, h(AuthDrawerContent, null), h(HangoutDrawerContent, null)));
}

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
    case httpStatus.emailInvalid:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordInvalid:
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

Parse.serverURL = `https://${"192.168.43.49"}:1337/parse`; //Parse.liveQueryServerURL = `https://${"192.168.43.49"}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'

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
      email
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

  var user = Parse.User.logIn(emailorusername, password).then(function (user) {
    let username = user.get("username");
    let email = user.get("email");
    let token = user.get('sessionToken');
    window.localStorage.setItem('webcom', JSON.stringify({
      token,
      username,
      email
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
    console.log("Error: " + error.code + " " + error.message);
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
  debugger;
  Parse.User.requestPasswordReset(email).then(function () {
    debugger;
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_SUCCESS,
      token: result.token,
      message: `A link for password change  has been sent to, ${email}! `
    });
    console.log("Password reset request was sent successfully");
  }).catch(function (error) {
    debugger;
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

const Login = L(() => import('./Login-60277804.js'));
const ChangePassword = L(() => import('./ChangePassword-02d9b81d.js'));
const ForgotPassword = L(() => import('./ForgotPassword-413d45bf.js'));
const Signup = L(() => import('./Signup-5b45d79b.js'));
const Profile = L(() => import('./Profile-abf523dc.js'));
const AuthFeedback = L(() => import('./AuthFeedback-245edd93.js'));
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

const Login$1 = L(() => import('./Login-60277804.js'));
const ChangePassword$1 = L(() => import('./ChangePassword-02d9b81d.js'));
const ForgotPassword$1 = L(() => import('./ForgotPassword-413d45bf.js'));
const Signup$1 = L(() => import('./Signup-5b45d79b.js'));
const Profile$1 = L(() => import('./Profile-abf523dc.js'));
const AuthFeedback$1 = L(() => import('./AuthFeedback-245edd93.js'));

const Hangouts = L(() => import('./index-365fbdcf.js'));
const Group = L(() => import('./group-cab9fbb1.js'));
function AppRoutes() {
  return h("div", {
    style: {
      height: '100%'
    }
  }, h(AppRoute, {
    path: "/auth"
  }, h(FormProvider, null,  h(ParseAuthentication, null), "PREACT_APP_PARSE" === 'PREACT_APP_NODEJS' )), h(AppRoute, {
    path: "/"
  }, h(Home, null)), h(AppRoute, {
    path: "/hangouts"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Hangouts, null))), h(AppRoute, {
    path: "/group"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Group, null))));
}

var css_248z$2 = "* {\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\n/* width */\r\n::-webkit-scrollbar {\r\n  width: 5px;\r\n}\r\n\r\n/* Track */\r\n::-webkit-scrollbar-track {\r\n  background: #f1f1f1;\r\n}\r\n\r\n/* Handle */\r\n::-webkit-scrollbar-thumb {\r\n  background: #888;\r\n}\r\n\r\n/* Handle on hover */\r\n::-webkit-scrollbar-thumb:hover {\r\n  background: #555;\r\n}\r\n\r\n@font-face{\r\n  font-family: \"Roboto\";\r\n  src: url('../../../assets/fonts/Roboto/Roboto-Regular.ttf');\r\n}\r\n\r\nhtml {\r\n  font-family: \"Roboto\", Arial, Helvetica, sans-serif;\r\n}\r\n\r\nbody {\r\n  --bg-color:red;\r\n}\r\n*{\r\n  box-sizing: border-box;\r\n}";
styleInject(css_248z$2);

function App() {
  return h("div", {
    style: {
      height: '95vh'
    }
  }, h(AppNavigation, null), h(AppRoutes, null), '');
}

//Parse.serverURL = 'http://localhost:1337/parse'

H(h(AppProviders, null, h(App, null)), document.body);

export { FeatureRoute as F, L, U, _extends as _, useAppRoute as a, useMediaQuery as b, useAuthContext as c, useFormContext as d, valueChanged as e, validationStates as f, clientValidation as g, h, isClientValidationType as i, v$1 as j, useThemeContext as k, useUserName as l, getTokenFromUrl as m, List as n, ListItem as o, p$1 as p, resetInputValidationState as r, styleInject as s, useHangouts as u, validationTypes as v, y };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYzM1ZGVhOWMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3JlZHVjZXIuanMiLCIuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy91cGRhdGVEZWxpdmVyZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvc2F2ZVJlY2lldmVkSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZU1lc3NhZ2UuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvcGFyc2UvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9zdGF0ZU1hcHBlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9wYXJzZS9QYXJzZVNlcnZlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0QWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC90aGVtZS90aGVtZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcFByb3ZpZGVycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvY29tcGF0L2Rpc3QvY29tcGF0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L05hdkl0ZW0uanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9saXN0L2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvaWNvbnMvdXNlcjY0LnBuZyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoRHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9uYXYvSGFuZ291dERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9TZXR0xLFuZ3MuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL25hdi9IYW5nb3V0VG9wTWVudS5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvc3R5bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L0RyYXdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvQXBwQmFyLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9pY29ucy9NZW51V2hpdGUuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L01lbnUuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9BcHBOYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvSG9tZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm1SZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvcGFyc2UvYXV0aC1hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L3BhcnNlL3VzZVBhcnNlQXV0aC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL1BhcnNlQXV0aGVudGljYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9Ob2RlQXV0aGVudGljYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9BcHBSb3V0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9BcHAuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3VwcG9ydCA9IHtcbiAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgYmxvYjpcbiAgICAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJlxuICAgICdCbG9iJyBpbiBzZWxmICYmXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG59XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXcob2JqKSB7XG4gIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxufVxuXG5pZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgXVxuXG4gIHZhciBpc0FycmF5QnVmZmVyVmlldyA9XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3IHx8XG4gICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICB9XG4gIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gIH1cbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG4vLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgdmFyIGl0ZXJhdG9yID0ge1xuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXRlcmF0b3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICB0aGlzLm1hcCA9IHt9XG5cbiAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVycykpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgfSwgdGhpcylcbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCAnICsgdmFsdWUgOiB2YWx1ZVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICB9XG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKG5hbWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIGl0ZW1zLnB1c2godmFsdWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbn1cblxuZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgfVxuICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxufVxuXG5mdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgfVxuICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgfVxuICByZXR1cm4gY2hhcnMuam9pbignJylcbn1cblxuZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gIGlmIChidWYuc2xpY2UpIHtcbiAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gIH0gZWxzZSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICB9XG59XG5cbmZ1bmN0aW9uIEJvZHkoKSB7XG4gIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgIGlmICghYm9keSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChib2R5KVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG52YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG5mdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgcmV0dXJuIG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xID8gdXBjYXNlZCA6IG1ldGhvZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgfVxuICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgIHRoaXMuc2lnbmFsID0gaW5wdXQuc2lnbmFsXG4gICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gIH1cblxuICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdzYW1lLW9yaWdpbidcbiAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB9XG4gIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgdGhpcy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbCB8fCB0aGlzLnNpZ25hbFxuICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gIH1cbiAgdGhpcy5faW5pdEJvZHkoYm9keSlcbn1cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHtib2R5OiB0aGlzLl9ib2R5SW5pdH0pXG59XG5cbmZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgYm9keVxuICAgIC50cmltKClcbiAgICAuc3BsaXQoJyYnKVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICByZXR1cm4gZm9ybVxufVxuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgLy8gUmVwbGFjZSBpbnN0YW5jZXMgb2YgXFxyXFxuIGFuZCBcXG4gZm9sbG93ZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlIG9yIGhvcml6b250YWwgdGFiIHdpdGggYSBzcGFjZVxuICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKVxuICBwcmVQcm9jZXNzZWRIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBoZWFkZXJzXG59XG5cbkJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzXG4gIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbn1cblxuQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgIHVybDogdGhpcy51cmxcbiAgfSlcbn1cblxuUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG5SZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbn1cblxuZXhwb3J0IHZhciBET01FeGNlcHRpb24gPSBzZWxmLkRPTUV4Y2VwdGlvblxudHJ5IHtcbiAgbmV3IERPTUV4Y2VwdGlvbigpXG59IGNhdGNoIChlcnIpIHtcbiAgRE9NRXhjZXB0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgbmFtZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdmFyIGVycm9yID0gRXJyb3IobWVzc2FnZSlcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgfVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpXG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBET01FeGNlcHRpb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKGlucHV0LCBpbml0KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICBmdW5jdGlvbiBhYm9ydFhocigpIHtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICB9XG4gICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgfVxuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnb21pdCcpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgfVxuXG4gICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgIH0pXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgIHJlcXVlc3Quc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRE9ORSAoc3VjY2VzcyBvciBmYWlsdXJlKVxuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICByZXF1ZXN0LnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgfSlcbn1cblxuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG5cbmlmICghc2VsZi5mZXRjaCkge1xuICBzZWxmLmZldGNoID0gZmV0Y2hcbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxufVxuIiwidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcclxuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXHJcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPSB7XHJcbiAgICBTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRDonU0VORElOR19IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQ6J1NFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEJyxcclxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXHJcblxyXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxyXG4gICAgTE9BREVEX01FU1NBR0VTOiAnTE9BREVEX01FU1NBR0VTJyxcclxuIFxyXG4gICAgU0VBUkNIX0lOUFVUX0NIQU5HRTogJ1NFQVJDSF9JTlBVVF9DSEFOR0UnLFxyXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxyXG4gICAgQ0xFQVJFRF9IQU5HT1VUOidDTEVBUkVEX0hBTkdPVVQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXHJcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcclxuICAgIFxyXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXHJcblxyXG4gICAgU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQ6J1NFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEJyxcclxuXHJcbiAgICBcclxuICAgIE1FU1NBR0VTX1VQREFURUQ6J01FU1NBR0VTX1VQREFURUQnLFxyXG4gICAgSEFOR09VVFNfVVBEQVRFRDonSEFOR09VVFNfVVBEQVRFRCcsXHJcbiAgICBIQU5HT1VUX1VQREFURUQ6J0hBTkdPVVRfVVBEQVRFRCcsXHJcbiAgICBVTlJFQURfSEFOR09VVFNfVVBEQVRFRDonVU5SRUFEX0hBTkdPVVRTX1VQREFURUQnLFxyXG4gICAgLy9TT0NLRVRcclxuXHJcbiAgICBDT05ORUNUSU5HOidDT05ORUNUSU5HJyxcclxuICAgIE9QRU46J09QRU4nLFxyXG4gICAgQ0xPU0lORzonQ0xPU0lORycsXHJcbiAgICBDTE9TRUQ6J0NMT1NFRCcsXHJcbiAgICBTT0NLRVRfUkVBRFk6J1NPQ0tFVF9SRUFEWScsXHJcbiAgICBTT0NLRVRfRVJST1I6J1NPQ0tFVF9FUlJPUidcclxuXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGhhbmdvdXRzOiBudWxsLFxyXG4gIGhhbmdvdXQ6IG51bGwsXHJcbiAgdW5yZWFkaGFuZ291dHM6IG51bGwsXHJcbiAgbWVzc2FnZXM6IG51bGwsXHJcbiAgc2VhcmNoOiAnJyxcclxuICB1c2VyOiBbXSxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICBtZXNzYWdlVGV4dDogJycsXHJcbiAgb25saW5lOiBmYWxzZSxcclxuICBzb2NrZXQ6IG51bGwsXHJcbiAgcmVhZHlTdGF0ZTogMCxcclxuICBzb2NrZXRNZXNzYWdlOiBudWxsLFxyXG4gIGZldGNoSGFuZ291dHM6IGZhbHNlLFxyXG4gIHBlbmRpbmdIYW5nb3V0Om51bGwsXHJcbiAgbWVzc2FnZTogbnVsbFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSxwZW5kaW5nSGFuZ291dDpudWxsfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgcGVuZGluZ0hhbmdvdXQ6YWN0aW9uLnBlbmRpbmdIYW5nb3V0fVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTEVBUkVEX0hBTkdPVVQ6XHJcbiAgICAgXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBudWxsIH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQ6XHJcblxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdW5yZWFkaGFuZ291dHM6IGFjdGlvbi51bnJlYWRoYW5nb3V0cyB9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRDpcclxuXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVEOlxyXG4gICAgIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfTUVTU0FHRV9SRUNJRVZFRDpcclxuICBcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlVGV4dDogYWN0aW9uLnRleHQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IsIGZldGNoSGFuZ291dHM6IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIGZldGNoSGFuZ291dHM6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMsIGZldGNoSGFuZ291dHM6IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxyXG4gICAgICAgICAgZy51c2VybmFtZS5pbmNsdWRlcyhzdGF0ZS5zZWFyY2gpXHJcbiAgICAgICAgKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VBUkNIX0lOUFVUX0NIQU5HRTpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcclxuICAgICAgfTtcclxuICAgIC8vU09DS0VUXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ09OTkVDVElORzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuT1BFTjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDEgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0lORzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDIgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfUkVBRFk6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzb2NrZXQ6IGFjdGlvbi5zb2NrZXQgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiXHJcbiAgZXhwb3J0IGNvbnN0IGhhbmdvdXRTdGF0ZXMgPSB7XHJcbiAgICBJTlZJVEVSOiAnSU5WSVRFUicsXHJcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcclxuICAgIERFQ0xJTkVSOiAnREVDTElORVInLFxyXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxyXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcclxuICAgIE1FU1NBTkdFUjogJ01FU1NBTkdFUicsXHJcbiAgIC8vIGFja25vd2xlZ2VtZW50XHJcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXHJcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcclxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxyXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxyXG4gICAgVU5CTE9DS0VEOiAnVU5CTE9DS0VEJyxcclxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnLFxyXG4gIH07IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgbmFtZSwgZGlzcGF0Y2gsIGhhbmdvdXQsIG9mZmxpbmUsIG9uQXBwUm91dGUgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHRpbWVzdGFtcCB9ID0gaGFuZ291dDtcclxuXHJcbiAgY29uc3QgZGVsaXZlcmVkSGFuZ291dCA9IHsgLi4uaGFuZ291dCwgZGVsaXZlcmVkOiB0cnVlIH07XHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGRlbGl2ZXJlZEhhbmdvdXQpO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRCwgaGFuZ291dDogZGVsaXZlcmVkSGFuZ291dCB9KTtcclxuICBpZiAobWVzc2FnZSkge1xyXG5cclxuICAgIHVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgbmFtZSwgZGVsaXZlcmVkSGFuZ291dCxoYW5nb3V0IH0pO1xyXG4gIH1cclxuICBpZihoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnKXtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgdXBkYXRlQm9ja2VkU3RhdGUoe2Rpc3BhdGNoLG5hbWUsZGVsaXZlcmVkSGFuZ291dH0pXHJcbiAgfVxyXG4gIGlmIChvZmZsaW5lKSB7XHJcbiAgICAvL3JlbW92ZSBvZmZsaW5lIGhhbmdvdXRcclxuICAgIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBjb25zdCBvZmZsaW5laGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG9mZmxpbmVIYW5nb3V0S2V5KSk7XHJcblxyXG4gICAgaWYgKG9mZmxpbmVoYW5nb3V0cykge1xyXG4gICAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBvZmZsaW5laGFuZ291dHMuZmluZEluZGV4KFxyXG4gICAgICAgIChvKSA9PiBvLnRpbWVzdGFtcCA9PT0gdGltZXN0YW1wXHJcbiAgICAgICk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIG9mZmxpbmVIYW5nb3V0S2V5LFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxKSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgbmFtZSwgZGVsaXZlcmVkSGFuZ291dCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gZGVsaXZlcmVkSGFuZ291dDtcclxuXHJcbiAgY29uc3QgZGVsaXZlcmVkTWVzc2FnZSA9IHsgLi4ubWVzc2FnZSwgdXNlcm5hbWU6IG5hbWUsIGRlbGl2ZXJlZDogdHJ1ZSB9XHJcblxyXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gbWVzc2FnZXMuZmluZEluZGV4KFxyXG4gICAgKG0pID0+IG0udGltZXN0YW1wID09PSBtZXNzYWdlLnRpbWVzdGFtcFxyXG4gICk7XHJcbiAgbWVzc2FnZXMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkTWVzc2FnZSk7XHJcbiAgXHJcblxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXMgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsZGVsaXZlcmVkSGFuZ291dCxuYW1lfSl7XHJcbiAgZGVidWdnZXI7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gZGVsaXZlcmVkSGFuZ291dDtcclxuICBjb25zdCBibG9ja2VkTWVzc2FnZSA9IHsgdGltZXN0YW1wOmRlbGl2ZXJlZEhhbmdvdXQudGltZXN0YW1wLCB0ZXh0OiAneW91IGJsb2NrZWQgdGhpcyB1c2VyJywgdXNlcm5hbWU6IG5hbWUsIHR5cGU6ICdibG9ja2VkJyB9XHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIFxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KCBbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6Wy4uLm1lc3NhZ2VzLGJsb2NrZWRNZXNzYWdlXSB9KTtcclxufSIsImltcG9ydCB7IHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQgfSBmcm9tICcuL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGV9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcbmRlYnVnZ2VyO1xyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlVW5ibG92a2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQge2hhbmdvdXRTdGF0ZXN9ICBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcydcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWNpZXZlZEhhbmdvdXQoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZCxcclxufSkge1xyXG5cclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG5cclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG5cclxuIFxyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChoZz0+IGhnLnVzZXJuYW1lPT09dXNlcm5hbWUpXHJcbiAgICBpZihoYW5nb3V0RXhpc3Qpe1xyXG4gICAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcclxuICAgICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHN5bmMgbWVzc2FnZSB3aXRoIHJlZHVjZXIgc3RhdGVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7XHJcbiAgICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICAgIH0vL2VuZCBvZiBoYW5nb3V0IGV4aXN0XHJcbmVsc2V7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxufVxyXG5cclxufWVsc2V7XHJcblxyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcblxyXG59XHJcblxyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCxcclxuICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICB9KTtcclxuICAgIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xyXG4gICAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtZXNzYWdlKSB7XHJcbiAgICBzYXZlUmVjaWV2ZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0IH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHVucmVhZCkge1xyXG5cclxuICAgIHN3aXRjaChoYW5nb3V0LnN0YXRlKXtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcclxuICAgICAgICBzYXZlVW5yZWFkSGFuZ291dCh7IG5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWNpZXZlZE1lc3NhZ2Uoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxufSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IG51bGw7XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogdHJ1ZSB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogZmFsc2UgfV07XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IHRydWUgfV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogZmFsc2UgfV07XHJcbiAgICB9XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG5cclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlVW5yZWFkSGFuZ291dCh7IG5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG4gIFxyXG4gIC8vdXBkYXRlIHVucmVhZCBoYW5nb3V0c1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gIGxldCB1cGRhdGVkdW5yZWFkcyA9IG51bGw7XHJcbiAgaWYgKHVucmVhZGhhbmdvdXRzKSB7XHJcbiAgICB1cGRhdGVkdW5yZWFkcyA9IFsuLi51bnJlYWRoYW5nb3V0cywgey4uLmhhbmdvdXQscmVhZDpmYWxzZX1dO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB1cGRhdGVkdW5yZWFkcyA9IFt7Li4uaGFuZ291dCxyZWFkOmZhbHNlfV07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkdW5yZWFkcykpO1xyXG5cclxuICBkaXNwYXRjaCh7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgIHVucmVhZGhhbmdvdXRzOiB1cGRhdGVkdW5yZWFkcyxcclxuICB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBzYXZlUmVjaWV2ZWRIYW5nb3V0IH0gZnJvbSAnLi9zYXZlUmVjaWV2ZWRIYW5nb3V0JztcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVJbnZpdGVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG5cclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY2NlcHRlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQmxvY2tlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuICBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURlY2xpbmVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSkge1xyXG5cclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufSAvLyBFTkQgc2F2ZU1lc3NhbmdlclxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb2NrZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiAgXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IGhhbmdvdXRTdGF0ZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcyc7XHJcbmltcG9ydCB7XHJcbiAgc2F2ZUludml0ZWQsXHJcbiAgc2F2ZVVuYmxvdmtlZCxcclxuICBzYXZlRGVjbGluZWQsXHJcbiAgc2F2ZUJsb2NrZWQsXHJcbiAgc2F2ZUFjY2VwdGVkLFxyXG4gIHNhdmVNZXNzYWdlZCxcclxufSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zJztcclxuaW1wb3J0IHtcclxuICBzYXZlQWNjZXB0ZXIsXHJcbiAgc2F2ZUJsb2NrZXIsXHJcbiAgc2F2ZURlY2xpbmVyLFxyXG4gIHNhdmVJbnZpdGVyLFxyXG4gIHNhdmVNZXNzYW5nZXIsXHJcbiAgc2F2ZVVuYmxvY2tlcixcclxufSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVzc2FnZSh7XHJcbiAgbWVzc2FnZSxcclxuICB1c2VybmFtZSxcclxuICBkaXNwYXRjaCxcclxuICBmb2N1c2VkSGFuZ291dCxcclxufSkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0LG9mZmxpbmUgfSkge1xyXG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVEOlxyXG4gICAgIFxyXG4gICAgICAgIHNhdmVJbnZpdGVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRUQ6XHJcbiAgICAgICAgc2F2ZVVuYmxvdmtlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORUQ6XHJcbiAgICAgICAgc2F2ZURlY2xpbmVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VEOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVCbG9ja2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFRDpcclxuICAgICAgICBzYXZlQWNjZXB0ZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQUdFRDpcclxuICAgICAgIFxyXG4gICAgICAgIHNhdmVNZXNzYWdlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsIHVucmVhZCB9KSB7XHJcbiAgICBcclxuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XHJcbiAgICAgICAgc2F2ZUFjY2VwdGVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRVI6XHJcbiAgICAgICBcclxuICAgICAgICBzYXZlQmxvY2tlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORVI6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZURlY2xpbmVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVSOlxyXG4gICAgICAgIHNhdmVJbnZpdGVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XHJcbiAgICAgICAgc2F2ZU1lc3Nhbmdlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VSOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVVbmJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRzKHsgaGFuZ291dHMgfSkge1xyXG4gICAgaGFuZ291dHMuZm9yRWFjaCgoaGFuZ291dCkgPT4ge1xyXG4gICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCx1bnJlYWQ6dHJ1ZSB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChtZXNzYWdlICYmIHVzZXJuYW1lKSB7XHJcbiBcclxuICAgICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdBQ0tIT1dMRURHRU1FTlQnOlxyXG5kZWJ1Z2dlcjtcclxuICAgICAgICAgIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCxvZmZsaW5lOmZhbHNlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnSEFOR09VVCc6XHJcblxyXG4gICAgICAgICAgaWYoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09bWVzc2FnZS5oYW5nb3V0LnVzZXJuYW1lKXtcclxuICAgXHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsdW5yZWFkOmZhbHNlIH0pO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICBcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCx1bnJlYWQ6dHJ1ZSB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdVTlJFQURfSEFOR09VVFMnOlxyXG4gICBcclxuICAgICAgICAgIGhhbmRsZUhhbmdvdXRzKHsgaGFuZ291dHM6IG1lc3NhZ2UuaGFuZ291dHMgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdPRkZMSU5FX0FDS04nOlxyXG4gICAgICAgXHJcbiAgICAgICAgICBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsb2ZmbGluZTp0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW21lc3NhZ2UsIHVzZXJuYW1lXSk7XHJcblxyXG4gIHJldHVybiB7fTtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyByZWR1Y2VyVW5yZWFkaGFuZ291dHMgfSBmcm9tICcuL3JlZHVjZVVucmVhZGhhbmdvdXRzJztcclxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xyXG59XHJcbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SGFuZ291dCh7ZGlzcGF0Y2h9KXtcclxuICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DTEVBUkVEX0hBTkdPVVR9KVxyXG59IFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVucmVhZCh7ZGlzcGF0Y2gsaGFuZ291dH0pe1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcclxufVxyXG5cclxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4vLyAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xyXG4vLyB9XHJcbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XHJcbn1cclxuXHJcbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcclxuICAgICk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfQ09NTUFORF9TVEFSVEVEIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKHsgaGFuZ291dCwgZGlzcGF0Y2gsdXNlcm5hbWUgfSkge1xyXG4gIFxyXG4gIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS0ke2hhbmdvdXQudXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVMsIG1lc3NhZ2VzIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlVW5yZWFkKHsgdW5yZWFkaGFuZ291dHMsIGRpc3BhdGNoIH0pIHtcclxuICAvLyBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLiwgdW5yZWFkaGFuZ291dHM6IHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzIH0pIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLy9FTkQgc2F2ZUludml0ZXJcclxuXHJcblxyXG5cclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxVRV9DSEFOR0VEOiAnVkFMVUVfQ0hBTkdFRCcsXHJcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxyXG4gIExPR0lOX1NVQ0NFU1M6ICdMT0dJTl9TVUNDRVNTJyxcclxuICBMT0dJTl9GQUlMRUQ6ICdMT0dJTl9GQUlMRUQnLFxyXG5cclxuICBMT0dPVVRfU1RBUlRFRDogJ0xPR09VVF9TVEFSVEVEJyxcclxuICBMT0dPVVRfRkFJTEVEOiAnTE9HT1VUX0ZBSUxFRCcsXHJcbiAgTE9HT1VUX1NVQ0NFU1M6ICdMT0dPVVRfU1VDQ0VTUycsXHJcblxyXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxyXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxyXG4gIFNJR05VUF9GQUlMRUQ6ICdTSUdOVVBfRkFJTEVEJyxcclxuXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6ICdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxyXG5cclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXHJcbiAgR09UX1RPS0VOX0ZST01fVVJMOiAnR09UX1RPS0VOX0ZST01fVVJMJyxcclxuXHJcbiAgUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOiAnUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFJyxcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGVtYWlsOiAnJyxcclxuICBwYXNzd29yZDogJycsXHJcbiAgc3VjY2VzczogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgdXNlcm5hbWU6ICcnLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGNvbmZpcm06ICcnLFxyXG4gIGN1cnJlbnQ6ICcnLFxyXG4gIGVtYWlsb3J1c2VybmFtZTogJycsXHJcbiAgdG9rZW46IG51bGwsXHJcbiAgaXNMb2dnZWRJbjogZmFsc2UsXHJcbiAgaXNQYXNzd29yZENoYW5nZWQ6IGZhbHNlLFxyXG4gIGF1dGhGZWVkYmFjazogbnVsbCxcclxuICB1c2VyOm51bGxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhdXRoUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VEOlxyXG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgW2FjdGlvbi5wYXlsb2FkLnByb3BOYW1lXTogYWN0aW9uLnBheWxvYWQudmFsdWUsXHJcbiAgICAgIH07XHJcbiAgXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyOmFjdGlvbi51c2VyLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZSwgJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgdXNlcjphY3Rpb24udXNlcixcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjphY3Rpb24udXNlcixcclxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgIHVzZXI6YWN0aW9uLnVzZXJcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IEF1dGhSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFthdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG5cclxuICBpZiAoYXV0aFJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xyXG4gIGNvbnN0IHsgdG8sIGlkIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldFJvdXRlKHRvKTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxhXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgey4uLnByb3BzfVxyXG4gICAgICBocmVmPXt0b31cclxuICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9XHJcbiAgICAgIHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiAnaW5oZXJpdCcgfX1cclxuICAgIC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGhSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aFJvdXRlQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXV0aFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgaW5pdGlhbFJvdXRlIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlU3RhdGUoaW5pdGlhbFJvdXRlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0sIFthdXRoUm91dGVdKTtcclxuXHJcbiAgcmV0dXJuIDxBdXRoUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XHJcbmltcG9ydCB7IEF1dGhSb3V0ZVByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLXJvdXRlLWNvbnRleHQnO1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXRlLFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XHJcbiAgICAgIDxBdXRoUm91dGVQcm92aWRlcj57Y2hpbGRyZW59PC9BdXRoUm91dGVQcm92aWRlcj5cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlQXV0aENvbnRleHQsIEF1dGhQcm92aWRlciB9O1xyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VVc2VyTmFtZSgpIHtcclxuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIFxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpIHtcclxuXHJcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLnVzZXIgJiYgc3RhdGUudXNlci50b2tlbikge1xyXG4gIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4gfSA9c3RhdGUudXNlcjtcclxuICBcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgIH1cclxuICB9LCBbc3RhdGUudXNlcl0pO1xyXG5cclxuICByZXR1cm4geyB1c2VybmFtZTogdXNlck5hbWUsIHRva2VuLCBlbWFpbCB9O1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUmVhZEhhbmdvdXRzKHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIC8vIHNldCByZWFkIHRvIHRydWUgb24gdW5yZWFkIGhhbmdvdXRzXHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcclxuICBjb25zdCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuXHJcbiAgaWYgKHVucmVhZGhhbmdvdXRzJiYgdW5yZWFkaGFuZ291dHMubGVuZ3RoPjApIHtcclxuICAgIFxyXG4gICAgbGV0IHVwZGF0ZWR1bnJlYWQgPSB1bnJlYWRoYW5nb3V0cy5tYXAodSA9PiB7XHJcbiAgICAgIGlmICh1LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7IC4uLnUsIHJlYWQ6IHRydWUgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWR1bnJlYWQpKTtcclxuZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsdW5yZWFkaGFuZ291dHM6dXBkYXRlZHVucmVhZH0pXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8vIHNldCBoYW5nb3V0IHRvIHJlYWRcclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgeyAuLi5oYW5nb3V0LCByZWFkOiB0cnVlIH0pO1xyXG4gIC8vXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG5cclxuICBpZiAobWVzc2FnZSkge1xyXG4gICAgIHVwZGF0ZVJlYWRNZXNzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWFkTWVzc3NhZ2VzKHsgaGFuZ291dCwgbmFtZSwgZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGNvbnN0IHVwZGF0ZWRNZXNzYWdlcyA9IG1lc3NhZ2VzLm1hcCgobSkgPT4ge1xyXG4gICAgcmV0dXJuIHsgLi4ubSwgcmVhZDogdHJ1ZSB9O1xyXG4gIH0pO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHtcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZU1lbW8sXHJcbiAgdXNlUmVkdWNlcixcclxuICB1c2VFZmZlY3QsXHJcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcclxuaW1wb3J0IHt1c2VNZXNzYWdlfSBmcm9tICcuL3VzZU1lc3NhZ2UnXHJcblxyXG5pbXBvcnQge1xyXG4gIGxvYWRIYW5nb3V0cyxcclxuICBsb2FkTWVzc2FnZXMsIFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7dXNlVXNlck5hbWV9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnXHJcbmltcG9ydCB7IHVwZGF0ZVJlYWRIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy91cGRhdGVSZWFkSGFuZ291dHMnO1xyXG5cclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xyXG4gY29uc3Qge3VzZXJuYW1lLHRva2VufT11c2VVc2VyTmFtZSgpXHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHsgaGFuZ291dCxtZXNzYWdlIH0gPSBzdGF0ZTtcclxuICBjb25zdCBoYW5kbGVNZXNzYWdlID11c2VNZXNzYWdlKHttZXNzYWdlLHVzZXJuYW1lLGRpc3BhdGNoLGZvY3VzZWRIYW5nb3V0OmhhbmdvdXR9KVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodXNlcm5hbWUpIHtcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFt1c2VybmFtZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodXNlcm5hbWUgJiYgdG9rZW4pIHtcclxuICAgICBcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGhhbmdvdXQgJiYgdXNlcm5hbWUpIHtcclxuICBcclxuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgbG9hZE1lc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xyXG5cclxuICAgICAgLy9zYXZlIGhhbmdvdXQgdG8gbG9jYWxTdG9yYWdlXHJcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgaWYgKCFoYW5nb3V0cykge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChcclxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoaGFuZ291dEV4aXN0KSB7XHJcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghaGFuZ291dC5yZWFkKSB7XHJcbiAgICAgXHJcbiAgICAgXHJcbiAgICAgICAgdXBkYXRlUmVhZEhhbmdvdXRzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWU6IHVzZXJuYW1lIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW2hhbmdvdXQsIHVzZXJuYW1lXSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUGVuZGluZ0hhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb25saW5lLGlzQmxvY2tlciB9KSB7XHJcblxyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcbiAgbGV0IGhhbmdvdXRLZXkgPSAnJztcclxuICBsZXQgbWVzc2FnZUtleSA9ICcnO1xyXG4gIGlmIChvbmxpbmUpIHtcclxuICAgIFxyXG4gICAgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICAgIG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgaGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xyXG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW9mZmxpbmUtbWVzc2FnZXNgO1xyXG4gIH1cclxuXHJcbiAgc2F2ZUhhbmdvdXQoeyBoYW5nb3V0S2V5LCB1c2VybmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KTtcclxuICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnRleHQgIT09XCJcIikge1xyXG4gICAgc2F2ZU1lc3NhZ2UoeyBtZXNzYWdlS2V5LCB1c2VybmFtZSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgXHJcbiAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBoYW5nb3V0KTtcclxuICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW2hhbmdvdXRdO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcbiAgfVxyXG4gXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIG1lc3NhZ2UsZGlzcGF0Y2gsaXNCbG9ja2VyIH0pIHtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBbXTtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuIFxyXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCBtZXNzYWdlXTtcclxuICB9IGVsc2Uge1xyXG5cclxuICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFttZXNzYWdlXTtcclxuICB9XHJcbiAgaWYoaXNCbG9ja2VyKXtcclxuIFxyXG4gICAgY29uc3QgYmxvY2tlciA9Wy4uLnVwZGF0ZWRNZXNzYWdlcyx7dGV4dDonWW91IGNhbiBub3Qgc2VuZCB0aGlzIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIGJsb2NrZWQuJ1xyXG4gICAgLHRpbWVzdGFtcDogRGF0ZS5ub3coKSx0eXBlOidibG9ja2VyJyx1c2VybmFtZTptZXNzYWdlLnVzZXJuYW1lLGZsb2F0OidyaWdodCd9XVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkoYmxvY2tlcikpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogYmxvY2tlciB9KTtcclxuICBcclxuICB9XHJcbiAgZWxzZXtcclxuICBcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG4gIH1cclxuIFxyXG5cclxufVxyXG4iLCJcclxuLy9pcyBzZW50IGJ5IGNsaWVudFxyXG5leHBvcnQgY29uc3QgY2xpZW50Q29tbWFuZHMgPSB7XHJcbiAgSU5WSVRFOiAnSU5WSVRFJyxcclxuICBBQ0NFUFQ6ICdBQ0NFUFQnLFxyXG4gIERFQ0xJTkU6ICdERUNMSU5FJyxcclxuICBCTE9DSzogJ0JMT0NLJyxcclxuICBVTkJMT0NLOiAnVU5CTE9DSycsXHJcbiAgTUVTU0FHRTogJ01FU1NBR0UnLFxyXG4gIE9OTElORTonT05MSU5FJ1xyXG59O1xyXG5cclxuIiwiaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuLi8uLi9jbGllbnRDb21tYW5kcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzZW5kT2ZmbGluZUhhbmdvdXRzKHsgZGlzcGF0Y2gsIHNvY2tldCwgbmFtZSB9KSB7XHJcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcclxuICBjb25zdCBvZmZsaW5lSGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG9mZmxpbmVIYW5nb3V0S2V5KSk7XHJcbiAgaWYgKG9mZmxpbmVIYW5nb3V0cykge1xyXG4gICAgb2ZmbGluZUhhbmdvdXRzLmZvcmVFYWNoKChoKSA9PiB7XHJcbiAgICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHVzZXJuYW1lOiBoLnVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWw6IGguZW1haWwsXHJcbiAgICAgICAgICBtZXNzYWdlOiBoLm1lc3NhZ2UsXHJcbiAgICAgICAgICB0aW1lc3RhbXA6IGgudGltZXN0YW1wLFxyXG4gICAgICAgICAgY29tbWFuZDogaC5zdGF0ZSxcclxuICAgICAgICAgIG9mZmxpbmU6IHRydWUsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICByZXR1cm47XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZSwgaGFuZ291dCxkaXNwYXRjaH0pe1xyXG4gICAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcclxuICAgIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgICBsZXQgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcbiAgIFxyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgY29uc3QgZmlsdGVyZWRIYW5nb3V0cyA9IHVucmVhZGhhbmdvdXRzLmZpbHRlcihmdW5jdGlvbih1bnJlYWQpICB7XHJcbiAgICAgICAgICAgIHJldHVybiAgdW5yZWFkLnVzZXJuYW1lICE9PSB1c2VybmFtZX0pO1xyXG4gICAgICAgICBcclxuICAgICAgICAgICAgaWYoZmlsdGVyZWRIYW5nb3V0cy5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KGZpbHRlcmVkSGFuZ291dHMpKTtcclxuICAgICAgICAgICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgICAgICAgICAgICAgIHVucmVhZGhhbmdvdXRzOiBmaWx0ZXJlZEhhbmdvdXRzLFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHVucmVhZGhhbmdvdXRzS2V5KTtcclxuICAgICAgICAgICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxyXG4gICAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0czogW10sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuICAgICAgXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IHNhdmVQZW5kaW5nSGFuZ291dCB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2F2ZVBlbmRpbmdIYW5nb3V0JztcclxuaW1wb3J0IHtcclxuICBzZWxlY3RIYW5nb3V0LFxyXG4gIHNlbGVjdFVucmVhZCxcclxuICBcclxuICBmaWx0ZXJIYW5nb3V0cyxcclxuICBmZXRjaEhhbmdvdXQsXHJcbiAgY2hhbmdlTWVzc2FnZVRleHQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgc2VuZE9mZmxpbmVIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2VuZE9mZmxpbmVIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVtb3ZlSGFuZ291dEZyb21VbnJlYWR9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9yZW1vdmVIYW5nb3V0RnJvbVVucmVhZCdcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgIHVzZXJuYW1lICA9IGF1dGhDb250ZXh0LnN0YXRlLnVzZXIgJiZhdXRoQ29udGV4dC5zdGF0ZS51c2VyLnVzZXJuYW1lO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuICBjb25zdCB7XHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICByZWFkeVN0YXRlLFxyXG4gIFxyXG4gICAgdW5yZWFkaGFuZ291dHMsXHJcbiAgfSA9IHN0YXRlO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCByZWFkeVN0YXRlID09PSAxICYmIHVzZXJuYW1lKSB7XHJcbiAgICAgIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBuYW1lOiB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3JlYWR5U3RhdGUsIHVzZXJuYW1lXSk7XHJcblxyXG4gIGZ1bmN0aW9uIG9uUmVtb3ZlVW5yZWFkKGUpe1xyXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGlkKTtcclxuICAgXHJcbiAgICByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZTp1c2VybmFtZSxkaXNwYXRjaCxoYW5nb3V0fSlcclxuICB9XHJcbiAgZnVuY3Rpb24gb25OYXZpZ2F0aW9uKGUpe1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAvLyBjb25zdCBpZCA9ZS50YXJnZXQuaWRcclxuICAgIGNvbnN0IGlkID1lLmN1cnJlbnRUYXJnZXQuaWRcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBvblNlbGVjdEhhbmdvdXQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSlcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIFxyXG4gXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSk7XHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblNlYXJjaElucHV0KGUpIHtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0UsIHNlYXJjaDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbkZldGNoSGFuZ291dHMoKXtcclxuXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUR9KVxyXG4gIH1cclxuXHJcbiBcclxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcclxuICAgIGNvbnN0IHRleHQgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uSGFuZ291dChlKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dDogJycsIGRpc3BhdGNoIH0pO1xyXG4gICAgY29uc3QgY29tbWFuZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gaGFuZ291dDtcclxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCBtZXNzYWdlID1cclxuICAgICAgbWVzc2FnZVRleHQgIT09ICcnID8geyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wIH0gOiBudWxsO1xyXG5cclxuICAgIGxldCBvbmxpbmUgPSB0cnVlO1xyXG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcclxuICAgIGRlYnVnZ2VyO1xyXG4gIC8vICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xyXG4gICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgaXNCbG9ja2VyPXRydWVcclxuICAgICAgfWVsc2V7XHJcbiAgIGRlYnVnZ2VyO1xyXG4gICAgXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcGVuZGluZ0hhbmdvdXQ9IHtcclxuICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgIGNvbW1hbmQsXHJcbiAgICAgICAgdGltZXN0YW1wLFxyXG4gICAgICB9XHJcbiAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9TVEFSVEVELCBwZW5kaW5nSGFuZ291dH0pXHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgLy8gICBvbmxpbmUgPSBmYWxzZTtcclxuICAgIC8vIH1cclxuICAgXHJcbiBcclxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XHJcbiAgICAgIGRpc3BhdGNoLFxyXG4gICAgICBuYW1lOiB1c2VybmFtZSxcclxuICAgICAgaGFuZ291dDoge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIHN0YXRlOiBjb21tYW5kLFxyXG4gICAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCwgZGVsaXZlcmVkOiBmYWxzZSwgdXNlcm5hbWUgfSxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgZGVsaXZlcmVkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgb25saW5lLFxyXG4gICAgICBpc0Jsb2NrZXJcclxuICAgIH0pO1xyXG4gIH0vL2VuZCBvbkhhbmdvdXRcclxuICByZXR1cm4ge1xyXG4gICAgc3RhdGUsXHJcbiAgICBvbk5hdmlnYXRpb24sXHJcbiAgICBvblNlbGVjdFVucmVhZCxcclxuICAgIG9uTWVzc2FnZVRleHQsXHJcbiAgICBtZXNzYWdlVGV4dCxcclxuICAgIG9uU2VhcmNoSW5wdXQsXHJcbiAgICBvbkZldGNoSGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgICBkaXNwYXRjaCxcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIHVzZXJzLFxyXG4gICAgdXNlcm5hbWUsXHJcbiAgICBtZXNzYWdlcyxcclxuICAgIG9uSGFuZ291dCxcclxuICAgIHVucmVhZGhhbmdvdXRzLFxyXG4gICAgcmVhZHlTdGF0ZSxcclxuICAgIG9uUmVtb3ZlVW5yZWFkXHJcbiAgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gc2VhcmNoIEhhbmdvdXRcclxuICAgICAgICBjb25zdCB1c2VyID0gUGFyc2UuVXNlci5jdXJyZW50KCk7XHJcbiAgICAgICAgbGV0IHt1c2VybmFtZX0gPXVzZXIuYXR0cmlidXRlc1xyXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFwiSGFuZ291dFwiKTtcclxuICAgICAgICBxdWVyeS5lcXVhbFRvKCd1c2VyaWQnLHVzZXIuaWQpXHJcbiAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLHNlYXJjaClcclxuICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gYXdhaXQgcXVlcnkuZmluZCgpO1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGlmKHNlYXJjaFJlc3VsdC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgIGxldCBtYXBwZWRIYW5vdXRzID0gc2VhcmNoUmVzdWx0Lm1hcChzPT57cmV0dXJuIHt1c2VybmFtZTpzLmF0dHJpYnV0ZXMudXNlcm5hbWUsIGVtYWlsOnMuYXR0cmlidXRlcy5lbWFpbCxzdGF0ZTpzLmF0dHJpYnV0ZXMuc3RhdGV9fSlcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzOm1hcHBlZEhhbm91dHMgfSlcclxuICAgICAgICB9ICBcclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAvLyBzZWFyY2ggSGFuZ291dFVzZXJcclxuICAgICAgICAgICAgY29uc3QgSGFuZ291dFVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KEhhbmdvdXRVc2VyKTtcclxuICAgICAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLHNlYXJjaClcclxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IGF3YWl0IHF1ZXJ5LmZpbmQoKTtcclxuICAgICAgICAgICAgbGV0IG1hcHBlZEhhbm91dHMgPSBzZWFyY2hSZXN1bHQubWFwKHM9PntyZXR1cm4ge3VzZXJuYW1lOnMuYXR0cmlidXRlcy51c2VybmFtZSwgZW1haWw6cy5hdHRyaWJ1dGVzLmVtYWlsLHN0YXRlOidJTlZJVEUnfX0pXHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0czptYXBwZWRIYW5vdXRzIH0pXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc3QgZXJyID0gZXJyb3JcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBoYW5nb3V0U3RhdGVzIH0gZnJvbSAnLi9oYW5nb3V0U3RhdGVzJ1xyXG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcydcclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXRlTWFwcGVyKHsgY29tbWFuZCB9KSB7XHJcbiAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLkFDQ0VQVDpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuQUNDRVBURVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuQkxPQ0s6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5CTE9DS0VELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuQkxPQ0tFUlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5ERUNMSU5FOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuREVDTElORUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5ERUNMSU5FUlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5JTlZJVEU6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5JTlZJVEVELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuSU5WSVRFUlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5NRVNTQUdFOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5NRVNTQU5HRVJcclxuICAgICAgICAgICAgfVxyXG4gICBcclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLlVOQkxPQ0s6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5VTkJMT0NLRUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5VTkJMT0NLRVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsaWVudENvbW1hbmQgdHlwZSBub3Qgc3BlY2lmaWVkJylcclxuICAgIH1cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuLi91c2VIYW5nb3V0cydcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXHJcbmltcG9ydCB7IHN0YXRlTWFwcGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL3N0YXRlTWFwcGVyJ1xyXG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4uLy4uLy4uL2hhbmdvdXRzL3N0YXRlL2NsaWVudENvbW1hbmRzJ1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0J1xyXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgZnVuY3Rpb24gUGFyc2VTZXJ2ZXIocHJvcHMpIHtcclxuICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzXHJcbiAgICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlSGFuZ291dHMoKVxyXG4gICAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpXHJcbiAgICBjb25zdCB7IHVzZXIgfSA9IGF1dGhDb250ZXh0LnN0YXRlXHJcbiAgICBjb25zdCB7IGZldGNoSGFuZ291dHMsIHNlYXJjaCwgcGVuZGluZ0hhbmdvdXQgfSA9IHN0YXRlXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAoZmV0Y2hIYW5nb3V0cykge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgYWN0aW9ucy5mZXRjaEhhbmdvdXRzKHsgZGlzcGF0Y2gsIHNlYXJjaCB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCBbZmV0Y2hIYW5nb3V0c10pXHJcblxyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHBlbmRpbmdIYW5nb3V0KSB7XHJcblxyXG4gICAgICAgICAgICBzZW5kSGFuZ291dCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIFtwZW5kaW5nSGFuZ291dF0pXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAodXNlcikge1xyXG4gICAgICAgICAgc3Vic0ZpcnN0KClcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgW3VzZXJdKVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXQgKHtoYW5nb3V0fSl7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ0lOVklURUQnOlxyXG4gICAgICAgICAgICBjYXNlICdBQ0NFUFRFRCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ0JMT0NLRUQnOlxyXG4gICAgICAgICAgICBjYXNlICdNRVNTQUdFRCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ0RFQ0xJTkVEJzpcclxuICAgICAgICAgICAgY2FzZSAnVU5CTE9DS0VEJzpcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfTUVTU0FHRV9SRUNJRVZFRCwgbWVzc2FnZTogeyBoYW5nb3V0LCB0eXBlOiAnQUNLSE9XTEVER0VNRU5UJyB9IH0pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnSU5WSVRFUic6XHJcbiAgICAgICAgICAgIGNhc2UgJ0FDQ0VQVEVSJzpcclxuICAgICAgICAgICAgY2FzZSAnQkxPQ0tFUic6XHJcbiAgICAgICAgICAgIGNhc2UgJ01FU1NBTkdFUic6XHJcbiAgICAgICAgICAgIGNhc2UgJ1VOQkxPQ0tFUic6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVELCBtZXNzYWdlOiB7IGhhbmdvdXQsIHR5cGU6ICdIQU5HT1VUJyB9IH0pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBzdWJzRmlyc3QoKXtcclxuICAgIGxldCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkhhbmdvdXRcIik7XHJcbiAgICB2YXIgY3VycmVudFVzZXIgPSBQYXJzZS5Vc2VyLmN1cnJlbnQoKTtcclxuICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsIGN1cnJlbnRVc2VyLmlkKVxyXG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9IGF3YWl0IHF1ZXJ5LnN1YnNjcmliZSgpO1xyXG4gICAgc3Vic2NyaXB0aW9uLm9uKCdjcmVhdGUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZ291dCA9IG9iamVjdC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgaGFuZGxlSGFuZ291dCh7aGFuZ291dH0pXHJcbiAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmplY3QgY3JlYXRlZCcpO1xyXG4gICAgfSk7XHJcbiAgICBzdWJzY3JpcHRpb24ub24oJ3VwZGF0ZScsIChvYmplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0ID0gb2JqZWN0LmF0dHJpYnV0ZXNcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBoYW5kbGVIYW5nb3V0KHtoYW5nb3V0fSlcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ29iamVjdCB1cGRhdGVkJyk7XHJcbiAgICB9KTtcclxuICAgIHN1YnNjcmlwdGlvbi5vbignZW50ZXInLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ29iamVjdCBlbnRlcmVkJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzdWJzY3JpcHRpb24ub24oJ2xlYXZlJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICBjb25zdCB7aGFuZ291dHN9PW9iamVjdC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICBjb25zdCBoYW5nb3V0ID1oYW5nb3V0c1swXS5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0KHtoYW5nb3V0fSlcclxuICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmplY3QgbGVmdCcpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICAgXHJcbiAgXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gc2VuZEhhbmdvdXQoKSB7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBjb25zdCB7IHNlbmRlclN0YXRlLCB0YXJnZXRTdGF0ZSB9ID0gc3RhdGVNYXBwZXIoe1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZDogcGVuZGluZ0hhbmdvdXQuY29tbWFuZCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCBtZXNzYWdlLCBvZmZsaW5lLCB0aW1lc3RhbXAgfSA9IHBlbmRpbmdIYW5nb3V0O1xyXG4gICAgICAgICAgICBjb25zdCBIYW5nb3V0ID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkhhbmdvdXRcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IFNlbmRlclVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgICAgICAgIGxldCBzZW5kZXJRdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShTZW5kZXJVc2VyKTtcclxuICAgICAgICAgICAgc2VuZGVyUXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLCB1c2VyLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICBsZXQgc2VuZGVyVXNlciA9IGF3YWl0IHNlbmRlclF1ZXJ5LmZpcnN0KClcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcblxyXG5cclxuICAgICAgICAgICAgY29uc3QgVGFyZ2V0VXNlciA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0VXNlclwiKTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldFF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFRhcmdldFVzZXIpO1xyXG4gICAgICAgICAgICB0YXJnZXRRdWVyeS5lcXVhbFRvKCd1c2VybmFtZScsIHVzZXJuYW1lKVxyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0VXNlciA9IGF3YWl0IHRhcmdldFF1ZXJ5LmZpcnN0KClcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlciA9IG5ldyBIYW5nb3V0KClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgndXNlcm5hbWUnLCB1c2VybmFtZSlcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnZW1haWwnLCBlbWFpbClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnbWVzc2FnZScsIG1lc3NhZ2UpXHJcbiAgICAgICAgICAgIHNlbmRlci5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnc3RhdGUnLCBzZW5kZXJTdGF0ZSlcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgndXNlcmlkJywgc2VuZGVyVXNlci5hdHRyaWJ1dGVzLnVzZXJpZClcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IG5ldyBIYW5nb3V0KClcclxuICAgICAgICAgICAgdGFyZ2V0LnNldCgndXNlcm5hbWUnLCB1c2VyLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCdlbWFpbCcsIHVzZXIuZW1haWwpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ21lc3NhZ2UnLCBtZXNzYWdlKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCd0aW1lc3RhbXAnLCB0aW1lc3RhbXApXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ3N0YXRlJywgdGFyZ2V0U3RhdGUpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ3VzZXJpZCcsIHRhcmdldFVzZXIuYXR0cmlidXRlcy51c2VyaWQpXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBpZiAocGVuZGluZ0hhbmdvdXQuY29tbWFuZCA9PT0gY2xpZW50Q29tbWFuZHMuSU5WSVRFKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VuZGVyVXNlci5hZGRVbmlxdWUoJ2hhbmdvdXRzJywgc2VuZGVyKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXNlci5hZGRVbmlxdWUoJ2hhbmdvdXRzJywgdGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgc2VuZGVyLnNldCgnb3duZXInLHNlbmRlclVzZXIpXHJcbiAgICAgICAgICAgICAvLyAgIHNlbmRlci5zYXZlKClcclxuICAgICAgICAgICAgICAgIHRhcmdldC5zZXQoJ293bmVyJyx0YXJnZXRVc2VyKVxyXG4gICAgICAgICAgICAgICAvLyB0YXJnZXQuc2F2ZSgpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJVc2VyLnNhdmUoKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXNlci5zYXZlKClcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRRdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkhhbmdvdXRcIik7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVyeS5lcXVhbFRvKCd1c2VyaWQnLHRhcmdldFVzZXIuYXR0cmlidXRlcy51c2VyaWQpXHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SGFuZ291dCA9IGF3YWl0IHRhcmdldFF1ZXJ5LmZpcnN0KClcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2V0KCdtZXNzYWdlJyxtZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGFuZ291dC5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2V0KCdzdGF0ZScsIHRhcmdldFN0YXRlKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGFuZ291dC5zYXZlKClcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gUGFyc2UuVXNlci5jdXJyZW50KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VuZGVyUXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJIYW5nb3V0XCIpO1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyUXVlcnkuZXF1YWxUbygndXNlcmlkJyxjdXJyZW50VXNlci5pZClcclxuICAgICAgICAgICAgICAgIGxldCBzZW5kZXJIYW5nb3V0ID0gYXdhaXQgc2VuZGVyUXVlcnkuZmlyc3QoKVxyXG4gICAgICAgICAgICAgICAgc2VuZGVySGFuZ291dC5zZXQoJ21lc3NhZ2UnLG1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJIYW5nb3V0LnNldCgndGltZXN0YW1wJywgdGltZXN0YW1wKVxyXG4gICAgICAgICAgICAgICAgc2VuZGVySGFuZ291dC5zZXQoJ3N0YXRlJywgc2VuZGVyU3RhdGUpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJIYW5nb3V0LnNhdmUoKVxyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjaGlsZHJlblxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgUGFyc2VTZXJ2ZXIgfSBmcm9tICcuL3BhcnNlL1BhcnNlU2VydmVyJ1xyXG5pbXBvcnQgeyBXZWJTb2NrZXRDb250YWluZXIgfSBmcm9tICcuL3dlYnNvY2tldC9XZWJTb2NrZXRDb250YWluZXInXHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0QWRhcHRlcihwcm9wcykge1xyXG4gICAgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfUEFSU0UnKSB7XHJcbiAgICAgICAgcmV0dXJuIDxQYXJzZVNlcnZlciB7Li4ucHJvcHN9IC8+XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChQUkVBQ1RfQVBQX0JBQ0sgPT09ICdQUkVBQ1RfQVBQX05PREVKUycpIHtcclxuICAgICAgICByZXR1cm4gPFdlYlNvY2tldENvbnRhaW5lciB7Li4ucHJvcHN9IC8+XHJcbiAgICB9XHJcblxyXG4gICAgZWxzZSByZXR1cm4gbnVsbDtcclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IE5hdkNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VOYXZDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KE5hdkNvbnRleHQpO1xyXG5cclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlTmF2Q29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBOYXZQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VOYXZpZ2F0aW9uKCkge1xyXG4gIGNvbnN0IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSA9IHVzZU5hdkNvbnRleHQoKTtcclxuICAgIGZ1bmN0aW9uIHRvZ2dsZURyYXdlcigpe1xyXG4gICAgICAgIHNldERyYXdlck9wZW4ocHJldj0+IXByZXYpXHJcbiAgICB9XHJcbiAgcmV0dXJuIHsgZHJhd2VyT3BlbiwgdG9nZ2xlRHJhd2VyIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSwgW2RyYXdlck9wZW5dKTtcclxuICByZXR1cm4gPE5hdkNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBSb3V0ZVByb3ZpZGVyIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBIYW5nb3V0QWRhcHRlciB9IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRBZGFwdGVyJztcclxuaW1wb3J0IHtIYW5nb3V0c1Byb3ZpZGVyfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJ1xyXG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuaW1wb3J0IHsgTmF2UHJvdmlkZXIgfSBmcm9tICcuLi9uYXYvTmF2UHJvdmlkZXInO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxUaGVtZVByb3ZpZGVyXHJcbiAgICAgIGluaXRTdGF0ZT17e1xyXG4gICAgICAgIHByaW1hcnk6IHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcclxuICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBIZWx2ZXRpY2EsIFwiQXJpYWxcIicsXHJcbiAgICAgICAgfSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPEFwcFJvdXRlUHJvdmlkZXJcclxuICAgICAgICB0aXRsZT1cIldlYmNvbVwiXHJcbiAgICAgICAgaW5pdFN0YXRlPXt7IHJvdXRlOiAnLycsIGZlYXR1cmVSb3V0ZTogJy9oYW5nb3V0cycgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgICAgICA8TmF2UHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICAgICAgICA8SGFuZ291dEFkYXB0ZXIgc29ja2V0VXJsPXtgd3NzOi8vJHtpcH06MzAwMGB9PlxyXG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgICAgPC9IYW5nb3V0QWRhcHRlcj5cclxuICAgICAgICAgICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICAgIFxyXG4gICAgICAgICAgPC9OYXZQcm92aWRlcj5cclxuICAgICAgICA8L0F1dGhQcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9UaGVtZVByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0e3VzZVN0YXRlIGFzIG4sdXNlUmVkdWNlciBhcyB0LHVzZUVmZmVjdCBhcyBlLHVzZUxheW91dEVmZmVjdCBhcyByLHVzZVJlZiBhcyBvLHVzZUltcGVyYXRpdmVIYW5kbGUgYXMgdSx1c2VNZW1vIGFzIGksdXNlQ2FsbGJhY2sgYXMgZix1c2VDb250ZXh0IGFzIGMsdXNlRGVidWdWYWx1ZSBhcyBhfWZyb21cInByZWFjdC9ob29rc1wiO2V4cG9ydCpmcm9tXCJwcmVhY3QvaG9va3NcIjtpbXBvcnR7Q29tcG9uZW50IGFzIGwsY3JlYXRlRWxlbWVudCBhcyBzLG9wdGlvbnMgYXMgdix0b0NoaWxkQXJyYXkgYXMgaCxoeWRyYXRlIGFzIHAscmVuZGVyIGFzIGQsX3VubW91bnQgYXMgbSxjbG9uZUVsZW1lbnQgYXMgeSxjcmVhdGVSZWYgYXMgYixjcmVhdGVDb250ZXh0IGFzIGcsRnJhZ21lbnQgYXMgeH1mcm9tXCJwcmVhY3RcIjtleHBvcnR7Y3JlYXRlRWxlbWVudCxjcmVhdGVDb250ZXh0LGNyZWF0ZVJlZixGcmFnbWVudCxDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7ZnVuY3Rpb24gRShuLHQpe2Zvcih2YXIgZSBpbiB0KW5bZV09dFtlXTtyZXR1cm4gbn1mdW5jdGlvbiB3KG4sdCl7Zm9yKHZhciBlIGluIG4paWYoXCJfX3NvdXJjZVwiIT09ZSYmIShlIGluIHQpKXJldHVybiEwO2Zvcih2YXIgciBpbiB0KWlmKFwiX19zb3VyY2VcIiE9PXImJm5bcl0hPT10W3JdKXJldHVybiEwO3JldHVybiExfXZhciBDPWZ1bmN0aW9uKG4pe3ZhciB0LGU7ZnVuY3Rpb24gcih0KXt2YXIgZTtyZXR1cm4oZT1uLmNhbGwodGhpcyx0KXx8dGhpcykuaXNQdXJlUmVhY3RDb21wb25lbnQ9ITAsZX1yZXR1cm4gZT1uLCh0PXIpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuX19wcm90b19fPWUsci5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHcodGhpcy5wcm9wcyxuKXx8dyh0aGlzLnN0YXRlLHQpfSxyfShsKTtmdW5jdGlvbiBfKG4sdCl7ZnVuY3Rpb24gZShuKXt2YXIgZT10aGlzLnByb3BzLnJlZixyPWU9PW4ucmVmO3JldHVybiFyJiZlJiYoZS5jYWxsP2UobnVsbCk6ZS5jdXJyZW50PW51bGwpLHQ/IXQodGhpcy5wcm9wcyxuKXx8IXI6dyh0aGlzLnByb3BzLG4pfWZ1bmN0aW9uIHIodCl7cmV0dXJuIHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWUscyhuLEUoe30sdCkpfXJldHVybiByLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PSEwLHIuZGlzcGxheU5hbWU9XCJNZW1vKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHIudD0hMCxyfXZhciBBPXYuX19iO2Z1bmN0aW9uIFMobil7ZnVuY3Rpb24gdCh0KXt2YXIgZT1FKHt9LHQpO3JldHVybiBkZWxldGUgZS5yZWYsbihlLHQucmVmKX1yZXR1cm4gdC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD10LnQ9ITAsdC5kaXNwbGF5TmFtZT1cIkZvcndhcmRSZWYoXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsdH12Ll9fYj1mdW5jdGlvbihuKXtuLnR5cGUmJm4udHlwZS50JiZuLnJlZiYmKG4ucHJvcHMucmVmPW4ucmVmLG4ucmVmPW51bGwpLEEmJkEobil9O3ZhciBrPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/aChuKS5yZWR1Y2UoZnVuY3Rpb24obixlLHIpe3JldHVybiBuLmNvbmNhdCh0KGUscikpfSxbXSk6bnVsbH0sUj17bWFwOmssZm9yRWFjaDprLGNvdW50OmZ1bmN0aW9uKG4pe3JldHVybiBuP2gobikubGVuZ3RoOjB9LG9ubHk6ZnVuY3Rpb24obil7aWYoMSE9PShuPWgobikpLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZHJlbi5vbmx5KCkgZXhwZWN0cyBvbmx5IG9uZSBjaGlsZC5cIik7cmV0dXJuIG5bMF19LHRvQXJyYXk6aH0sRj12Ll9fZTtmdW5jdGlvbiBOKG4pe3JldHVybiBuJiYoKG49RSh7fSxuKSkuX19jPW51bGwsbi5fX2s9bi5fX2smJm4uX19rLm1hcChOKSksbn1mdW5jdGlvbiBVKCl7dGhpcy5fX3U9MCx0aGlzLm89bnVsbCx0aGlzLl9fYj1udWxsfWZ1bmN0aW9uIE0obil7dmFyIHQ9bi5fXy5fX2M7cmV0dXJuIHQmJnQudSYmdC51KG4pfWZ1bmN0aW9uIEwobil7dmFyIHQsZSxyO2Z1bmN0aW9uIG8obyl7aWYodHx8KHQ9bigpKS50aGVuKGZ1bmN0aW9uKG4pe2U9bi5kZWZhdWx0fHxufSxmdW5jdGlvbihuKXtyPW59KSxyKXRocm93IHI7aWYoIWUpdGhyb3cgdDtyZXR1cm4gcyhlLG8pfXJldHVybiBvLmRpc3BsYXlOYW1lPVwiTGF6eVwiLG8udD0hMCxvfWZ1bmN0aW9uIE8oKXt0aGlzLmk9bnVsbCx0aGlzLmw9bnVsbH12Ll9fZT1mdW5jdGlvbihuLHQsZSl7aWYobi50aGVuKWZvcih2YXIgcixvPXQ7bz1vLl9fOylpZigocj1vLl9fYykmJnIuX19jKXJldHVybiByLl9fYyhuLHQuX19jKTtGKG4sdCxlKX0sKFUucHJvdG90eXBlPW5ldyBsKS5fX2M9ZnVuY3Rpb24obix0KXt2YXIgZT10aGlzO251bGw9PWUubyYmKGUubz1bXSksZS5vLnB1c2godCk7dmFyIHI9TShlLl9fdiksbz0hMSx1PWZ1bmN0aW9uKCl7b3x8KG89ITAscj9yKGkpOmkoKSl9O3QuX19jPXQuY29tcG9uZW50V2lsbFVubW91bnQsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3UoKSx0Ll9fYyYmdC5fX2MoKX07dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbjtpZighLS1lLl9fdSlmb3IoZS5fX3YuX19rWzBdPWUuc3RhdGUudSxlLnNldFN0YXRlKHt1OmUuX19iPW51bGx9KTtuPWUuby5wb3AoKTspbi5mb3JjZVVwZGF0ZSgpfTtlLl9fdSsrfHxlLnNldFN0YXRlKHt1OmUuX19iPWUuX192Ll9fa1swXX0pLG4udGhlbih1LHUpfSxVLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obix0KXtyZXR1cm4gdGhpcy5fX2ImJih0aGlzLl9fdi5fX2tbMF09Tih0aGlzLl9fYiksdGhpcy5fX2I9bnVsbCksW3MobCxudWxsLHQudT9udWxsOm4uY2hpbGRyZW4pLHQudSYmbi5mYWxsYmFja119O3ZhciBQPWZ1bmN0aW9uKG4sdCxlKXtpZigrK2VbMV09PT1lWzBdJiZuLmwuZGVsZXRlKHQpLG4ucHJvcHMucmV2ZWFsT3JkZXImJihcInRcIiE9PW4ucHJvcHMucmV2ZWFsT3JkZXJbMF18fCFuLmwuc2l6ZSkpZm9yKGU9bi5pO2U7KXtmb3IoO2UubGVuZ3RoPjM7KWUucG9wKCkoKTtpZihlWzFdPGVbMF0pYnJlYWs7bi5pPWU9ZVsyXX19OyhPLnByb3RvdHlwZT1uZXcgbCkudT1mdW5jdGlvbihuKXt2YXIgdD10aGlzLGU9TSh0Ll9fdikscj10LmwuZ2V0KG4pO3JldHVybiByWzBdKyssZnVuY3Rpb24obyl7dmFyIHU9ZnVuY3Rpb24oKXt0LnByb3BzLnJldmVhbE9yZGVyPyhyLnB1c2gobyksUCh0LG4scikpOm8oKX07ZT9lKHUpOnUoKX19LE8ucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuKXt0aGlzLmk9bnVsbCx0aGlzLmw9bmV3IE1hcDt2YXIgdD1oKG4uY2hpbGRyZW4pO24ucmV2ZWFsT3JkZXImJlwiYlwiPT09bi5yZXZlYWxPcmRlclswXSYmdC5yZXZlcnNlKCk7Zm9yKHZhciBlPXQubGVuZ3RoO2UtLTspdGhpcy5sLnNldCh0W2VdLHRoaXMuaT1bMSwwLHRoaXMuaV0pO3JldHVybiBuLmNoaWxkcmVufSxPLnByb3RvdHlwZS5jb21wb25lbnREaWRVcGRhdGU9Ty5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQ9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO24ubC5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7UChuLGUsdCl9KX07dmFyIFc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7fXZhciB0PW4ucHJvdG90eXBlO3JldHVybiB0LmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnByb3BzLmNvbnRleHR9LHQucmVuZGVyPWZ1bmN0aW9uKG4pe3JldHVybiBuLmNoaWxkcmVufSxufSgpO2Z1bmN0aW9uIGoobil7dmFyIHQ9dGhpcyxlPW4uY29udGFpbmVyLHI9cyhXLHtjb250ZXh0OnQuY29udGV4dH0sbi52bm9kZSk7cmV0dXJuIHQucyYmdC5zIT09ZSYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCksdC5wPSExKSxuLnZub2RlP3QucD8oZS5fX2s9dC5fX2ssZChyLGUpLHQuX19rPWUuX19rKToodC52PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpLHAoXCJcIixlKSxlLmFwcGVuZENoaWxkKHQudiksdC5wPSEwLHQucz1lLGQocixlLHQudiksdC5fX2s9dC52Ll9fayk6dC5wJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSksdC5oPXIsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Qudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCl9LG51bGx9ZnVuY3Rpb24geihuLHQpe3JldHVybiBzKGose3Zub2RlOm4sY29udGFpbmVyOnR9KX12YXIgRD0vXig/OmFjY2VudHxhbGlnbm1lbnR8YXJhYmljfGJhc2VsaW5lfGNhcHxjbGlwKD8hUGF0aFUpfGNvbG9yfGZpbGx8Zmxvb2R8Zm9udHxnbHlwaCg/IVIpfGhvcml6fG1hcmtlcig/IUh8V3xVKXxvdmVybGluZXxwYWludHxzdG9wfHN0cmlrZXRocm91Z2h8c3Ryb2tlfHRleHQoPyFMKXx1bmRlcmxpbmV8dW5pY29kZXx1bml0c3x2fHZlY3Rvcnx2ZXJ0fHdvcmR8d3JpdGluZ3x4KD8hQykpW0EtWl0vO2wucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9e307dmFyIEg9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvciYmU3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIil8fDYwMTAzO2Z1bmN0aW9uIFQobix0LGUpe2lmKG51bGw9PXQuX19rKWZvcig7dC5maXJzdENoaWxkOyl0LnJlbW92ZUNoaWxkKHQuZmlyc3RDaGlsZCk7cmV0dXJuIGQobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfWZ1bmN0aW9uIFYobix0LGUpe3JldHVybiBwKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH12YXIgWj12LmV2ZW50O2Z1bmN0aW9uIEkobix0KXtuW1wiVU5TQUZFX1wiK3RdJiYhblt0XSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sdCx7Y29uZmlndXJhYmxlOiExLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzW1wiVU5TQUZFX1wiK3RdfSxzZXQ6ZnVuY3Rpb24obil7dGhpc1tcIlVOU0FGRV9cIit0XT1ufX0pfXYuZXZlbnQ9ZnVuY3Rpb24obil7WiYmKG49WihuKSksbi5wZXJzaXN0PWZ1bmN0aW9uKCl7fTt2YXIgdD0hMSxlPSExLHI9bi5zdG9wUHJvcGFnYXRpb247bi5zdG9wUHJvcGFnYXRpb249ZnVuY3Rpb24oKXtyLmNhbGwobiksdD0hMH07dmFyIG89bi5wcmV2ZW50RGVmYXVsdDtyZXR1cm4gbi5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe28uY2FsbChuKSxlPSEwfSxuLmlzUHJvcGFnYXRpb25TdG9wcGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LG4uaXNEZWZhdWx0UHJldmVudGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGV9LG4ubmF0aXZlRXZlbnQ9bn07dmFyICQ9e2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGFzc319LHE9di52bm9kZTt2LnZub2RlPWZ1bmN0aW9uKG4pe24uJCR0eXBlb2Y9SDt2YXIgdD1uLnR5cGUsZT1uLnByb3BzO2lmKHQpe2lmKGUuY2xhc3MhPWUuY2xhc3NOYW1lJiYoJC5lbnVtZXJhYmxlPVwiY2xhc3NOYW1lXCJpbiBlLG51bGwhPWUuY2xhc3NOYW1lJiYoZS5jbGFzcz1lLmNsYXNzTmFtZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJjbGFzc05hbWVcIiwkKSksXCJmdW5jdGlvblwiIT10eXBlb2YgdCl7dmFyIHIsbyx1O2Zvcih1IGluIGUuZGVmYXVsdFZhbHVlJiZ2b2lkIDAhPT1lLnZhbHVlJiYoZS52YWx1ZXx8MD09PWUudmFsdWV8fChlLnZhbHVlPWUuZGVmYXVsdFZhbHVlKSxkZWxldGUgZS5kZWZhdWx0VmFsdWUpLEFycmF5LmlzQXJyYXkoZS52YWx1ZSkmJmUubXVsdGlwbGUmJlwic2VsZWN0XCI9PT10JiYoaChlLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uKG4pey0xIT1lLnZhbHVlLmluZGV4T2Yobi5wcm9wcy52YWx1ZSkmJihuLnByb3BzLnNlbGVjdGVkPSEwKX0pLGRlbGV0ZSBlLnZhbHVlKSxlKWlmKHI9RC50ZXN0KHUpKWJyZWFrO2lmKHIpZm9yKHUgaW4gbz1uLnByb3BzPXt9LGUpb1tELnRlc3QodSk/dS5yZXBsYWNlKC9bQS1aMC05XS8sXCItJCZcIikudG9Mb3dlckNhc2UoKTp1XT1lW3VdfSFmdW5jdGlvbih0KXt2YXIgZT1uLnR5cGUscj1uLnByb3BzO2lmKHImJlwic3RyaW5nXCI9PXR5cGVvZiBlKXt2YXIgbz17fTtmb3IodmFyIHUgaW4gcikvXm9uKEFuaXxUcmF8VG91KS8udGVzdCh1KSYmKHJbdS50b0xvd2VyQ2FzZSgpXT1yW3VdLGRlbGV0ZSByW3VdKSxvW3UudG9Mb3dlckNhc2UoKV09dTtpZihvLm9uZG91YmxlY2xpY2smJihyLm9uZGJsY2xpY2s9cltvLm9uZG91YmxlY2xpY2tdLGRlbGV0ZSByW28ub25kb3VibGVjbGlja10pLG8ub25iZWZvcmVpbnB1dCYmKHIub25iZWZvcmVpbnB1dD1yW28ub25iZWZvcmVpbnB1dF0sZGVsZXRlIHJbby5vbmJlZm9yZWlucHV0XSksby5vbmNoYW5nZSYmKFwidGV4dGFyZWFcIj09PWV8fFwiaW5wdXRcIj09PWUudG9Mb3dlckNhc2UoKSYmIS9eZmlsfGNoZXxyYS9pLnRlc3Qoci50eXBlKSkpe3ZhciBpPW8ub25pbnB1dHx8XCJvbmlucHV0XCI7cltpXXx8KHJbaV09cltvLm9uY2hhbmdlXSxkZWxldGUgcltvLm9uY2hhbmdlXSl9fX0oKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYhdC5tJiZ0LnByb3RvdHlwZSYmKEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsTW91bnRcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHNcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxVcGRhdGVcIiksdC5tPSEwKX1xJiZxKG4pfTt2YXIgQj1cIjE2LjguMFwiO2Z1bmN0aW9uIEcobil7cmV0dXJuIHMuYmluZChudWxsLG4pfWZ1bmN0aW9uIEoobil7cmV0dXJuISFuJiZuLiQkdHlwZW9mPT09SH1mdW5jdGlvbiBLKG4pe3JldHVybiBKKG4pP3kuYXBwbHkobnVsbCxhcmd1bWVudHMpOm59ZnVuY3Rpb24gUShuKXtyZXR1cm4hIW4uX19rJiYoZChudWxsLG4pLCEwKX1mdW5jdGlvbiBYKG4pe3JldHVybiBuJiYobi5iYXNlfHwxPT09bi5ub2RlVHlwZSYmbil8fG51bGx9dmFyIFk9ZnVuY3Rpb24obix0KXtyZXR1cm4gbih0KX07ZXhwb3J0IGRlZmF1bHR7dXNlU3RhdGU6bix1c2VSZWR1Y2VyOnQsdXNlRWZmZWN0OmUsdXNlTGF5b3V0RWZmZWN0OnIsdXNlUmVmOm8sdXNlSW1wZXJhdGl2ZUhhbmRsZTp1LHVzZU1lbW86aSx1c2VDYWxsYmFjazpmLHVzZUNvbnRleHQ6Yyx1c2VEZWJ1Z1ZhbHVlOmEsdmVyc2lvbjpcIjE2LjguMFwiLENoaWxkcmVuOlIscmVuZGVyOlQsaHlkcmF0ZTpULHVubW91bnRDb21wb25lbnRBdE5vZGU6USxjcmVhdGVQb3J0YWw6eixjcmVhdGVFbGVtZW50OnMsY3JlYXRlQ29udGV4dDpnLGNyZWF0ZUZhY3Rvcnk6RyxjbG9uZUVsZW1lbnQ6SyxjcmVhdGVSZWY6YixGcmFnbWVudDp4LGlzVmFsaWRFbGVtZW50OkosZmluZERPTU5vZGU6WCxDb21wb25lbnQ6bCxQdXJlQ29tcG9uZW50OkMsbWVtbzpfLGZvcndhcmRSZWY6Uyx1bnN0YWJsZV9iYXRjaGVkVXBkYXRlczpZLFN1c3BlbnNlOlUsU3VzcGVuc2VMaXN0Ok8sbGF6eTpMfTtleHBvcnR7QiBhcyB2ZXJzaW9uLFIgYXMgQ2hpbGRyZW4sVCBhcyByZW5kZXIsViBhcyBoeWRyYXRlLFEgYXMgdW5tb3VudENvbXBvbmVudEF0Tm9kZSx6IGFzIGNyZWF0ZVBvcnRhbCxHIGFzIGNyZWF0ZUZhY3RvcnksSyBhcyBjbG9uZUVsZW1lbnQsSiBhcyBpc1ZhbGlkRWxlbWVudCxYIGFzIGZpbmRET01Ob2RlLEMgYXMgUHVyZUNvbXBvbmVudCxfIGFzIG1lbW8sUyBhcyBmb3J3YXJkUmVmLFkgYXMgdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMsVSBhcyBTdXNwZW5zZSxPIGFzIFN1c3BlbnNlTGlzdCxMIGFzIGxhenl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGF0Lm1vZHVsZS5qcy5tYXBcbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtIChwcm9wcyl7XHJcbmNvbnN0IHtjaGlsZHJlbn09cHJvcHNcclxucmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibmF2LWl0ZW1cInsuLi5wcm9wc30+e2NoaWxkcmVufTwvZGl2PlxyXG59IiwiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcblxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0KHByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdFwiIHsuLi5wcm9wc30vPlxyXG4gICk7XHJcbn1cclxuXHJcblxyXG4gZnVuY3Rpb24gTGlzdEl0ZW0ocHJvcHMpIHtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1pdGVtXCIgey4uLnByb3BzfSAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7TGlzdCxMaXN0SXRlbX0iLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBUUFBQUFBWUxsVkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQUFtSkxSMFFBQUtxTkl6SUFBQUFKY0VoWmN3QUFEc1FBQUE3RUFaVXJEaHNBQUFBSGRFbE5SUWZrQkJzSUxTMVlmOUpJQUFBRG9FbEVRVlJvM3IyWlMwaFVVUmpIZjNNdGk5QlNNMmxSMHRQSmhFalNWaUVFMWFLTmxSVVZKRkVRRkZFa2J1MjFLN0dJTmhGRlJBK0NsaVV0YXROTDNJVFJOS0VSQmxFTGRVYkg3S0dtYzF2Y3JqUGp6TDMzZkdmdStIMkxnWHZPOS85OTk1d3o1M1VEU0syTU9xcFlRd1hGRkZFQS9DVEdFRDEwRStZVi9XSkZaYXZsTWlIaW1DNGVKMFFiTlg2ajU5UE1SMWZ3ZEEvVFRLRS84QkxPTXlpQzJ6N0lPWXF6Z3dkb3BGOExibnVVVXhpNitGVzh5UXB1KzJ0VzZ1QjNNdVFMM3NUa0IvdGtjSU1ydnNGdGIxUHZpbndlK0k0M01iblBiRFY4ZTA3d0ppWlB2Rk1JY0NkbmVCT1RCMTRkNFgvZlQvZFdOL3llbk9OTlRQWTc0VmNTbTVFRVlxekkzUHYrVERzcS9wSkFBbXZiRVc3S0pndSs4cEFlSU1oK2xncGpEM0VuOVVFSkE2SjMrRU1UZVZQUmVUVHpSeFRmUjFGcUFoZEU0V05zVDN1bnJjSVV6aVFIenhjdXVNY3lOdXR4a1VZMGViL1FMQXJ0U0JvNXFjTzRVNlRUbEFnTmlRSjNPUTR0MlR3U3RzTnFSV0cveUhkTUlKOWZJcTFxTU1CNVpzcG9IWXc3bG8zVEtkSTZZQ1d3VFJUVTYxcjZSYVMxQlF6S1dDc0tpcm1XUmtWYTZ5ZzFxSE1ZMDA0Mng3VjBya2pMb002Z1NoUUNTMXhMeTRWcVZRWkJZVWl0UzFsQWZDWUtHbFFJUThxcGRpeXI4V2lmZEtzd0tCV0d3RW5Ia2hOaXJWS0lpS1lPRTVNSmg0YmV5SVJZYXdER3hFRW1uMW1VaGkralYwTnBWQzhCazI0cVUvQ1ZkR3Zwak9wMGdSMjZlQW8vVDdnWFNPb0NnNS9pZ1dQWnA2UzdrTjk4MUZRWk1ZaG9oUDNsT3B1SUp6M1p6RTBtTkpRaWlNK0JvOXh3T0c2djVwWjRSTjJEczRMcWNSNnl6UFdObHZOSWxFQUxOQ2hYamxHdjFLejFEQ3RyN29ReWozc3YyNzhKSnUxS3ZpdHBUbHJ6OEh1RnFtTXVLMEFtMjhDNGdtcVh0U042cmlEWVJwY29nYmRjVWFqMXpQcXBVUmo1QzBWNGdFVUsvNGoxZHVXd1I4VjJNUjdncVlkcUNQaC9YM0hiUTZwREs0RTNIdVZKMUVLUG8xbURWZ0x1eDVRSUJZa1dHT0dhcTFSTUt3SDNxS3ZXS21UdmlJdnB5YkRHMnphaU5jL1Bjcm11N2lQSWNPcWp3NklwTkZzL21KNVRnTmN6aG4rUitTd3lVNWRVUTVrdnFRQjJ6MGdDenNkN29DM24rSXZ1SXpmQTdaemk3M3ZmbWMvTzRXWDFZN1g3OGxuY3lnbityaHJlNm9oV24rRnhMZ3F2QWRpaCthMHNrdyt6VndhM2JBVXZmY0cvWUxrTzN1cUtSdnF5Z2tjNUttMzY2VmJFR2FKYThBZ3RMTWdPYmxzQlRYd1F3VU9jdHRaN1A2MmFWdDR4NlFxZXBJdExpYjJlU2k5THJaUTYxbEpKQlNWSm4rOEhwejdmQzgrYS93QzFaQVhzM1VoVUhBQUFBQ1YwUlZoMFpHRjBaVHBqY21WaGRHVUFNakF5TUMwd05DMHlOMVF3T0RvME5UbzBOU3N3TURvd01CYXdTVlFBQUFBbGRFVllkR1JoZEdVNmJXOWthV1o1QURJd01qQXRNRFF0TWpkVU1EZzZORFU2TkRVck1EQTZNREJuN2ZIb0FBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCM2QzY3VhVzVyYzJOaGNHVXViM0pubSs0OEdnQUFBQUJKUlU1RXJrSmdnZz09XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQsXHJcbiAgICBwYXlsb2FkOiB7XHJcbiAgICAgIHByb3BOYW1lLFxyXG4gICAgICB2YWx1ZSxcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2ViY29tJyk7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX1NVQ0NFU1MgfTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxyXG4gICAgdG9rZW4sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY292ZXJMb2NhbEF1dGhTdGF0ZSh7IHVzZXIsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSwgdXNlciB9KTtcclxufVxyXG4iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2NvbXBvbmVudHMvbGlzdCc7XHJcbmltcG9ydCB1c2VySWNvbiBmcm9tICcuL2ljb25zL3VzZXI2NC5wbmcnO1xyXG5pbXBvcnQgeyBsb2dvdXQgfSBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgZ3JpZDoge1xyXG4gICAgZGlzcGxheTogJ2dyaWQnLFxyXG4gICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ2F1dG8gNSUgYXV0bycsXHJcbiAgICBqdXN0aWZ5SXRlbXM6ICdjZW50ZXInLFxyXG4gICAgcGFkZGluZzoxNlxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aERyYXdlckNvbnRlbnQoKSB7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCB7b25BcHBSb3V0ZX0gPSB1c2VBcHBSb3V0ZSgpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTogYC8ke2lkfWAscm91dGU6Jy9hdXRoJ30pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZ1RvcDogMTAgfX0+XHJcbiAgICAgIHshc3RhdGUudXNlciAmJiA8VW5BdXRoZWRTdGF0ZSBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9IC8+fVxyXG4gICAgICB7c3RhdGUudXNlciAmJiAoXHJcbiAgICAgICAgPEF1dGhlZFN0YXRlXHJcbiAgICAgICAgb25BcHBSb3V0ZT17b25BcHBSb3V0ZX1cclxuICAgICAgICAgIGhhbmRsZVJvdXRlPXtoYW5kbGVSb3V0ZX1cclxuICAgICAgICAgIHVzZXJOYW1lPXtzdGF0ZS51c2VyLnVzZXJuYW1lfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICl9XHJcbiAgICAgIDxociBzdHlsZT17eyBoZWlnaHQ6IDEgfX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlLCB1c2VyTmFtZSAsb25BcHBSb3V0ZX0pIHtcclxuICBmdW5jdGlvbiBoYW5kbGVMb2dPdXQoKSB7XHJcbiAgIFxyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOicvJyxyb3V0ZTonL2hvbWUnfSk7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGltZyBzcmM9e3VzZXJJY29ufSBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDUgfX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZUxvZ091dH0gaWQ9J2xvZ291dCcgZGF0YS10ZXN0aWQ9J2xvZ291dCc+XHJcbiAgICAgICAgICAgIExvZ291dFxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDggfX0+V2VsY29tZSwge3VzZXJOYW1lfTwvZGl2PlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdjaGFuZ2VwYXNzd29yZCdkYXRhLXRlc3RpZD0nY2hhbmdlcGFzc3dvcmQnPlxyXG4gICAgICAgICAgQ2hhbmdlIFBhc3N3b3JkXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFVuQXV0aGVkU3RhdGUoeyBoYW5kbGVSb3V0ZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmdyaWR9PlxyXG4gICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nbG9naW4nIGRhdGEtdGVzdGlkPSdsb2dpbic+XHJcbiAgICAgICAgICBMb2dpblxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICA8ZGl2Pnw8L2Rpdj5cclxuICAgICAgICA8YSBocmVmPScvJyBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J3NpZ251cCcgZGF0YS10ZXN0aWQ9J3NpZ251cCc+XHJcbiAgICAgICAgICBTaWdudXBcclxuICAgICAgICA8L2E+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9saXN0JztcclxuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tICcuLi8uLi9hdXRoL3VzZVVzZXJOYW1lJztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGZ1bmN0aW9uIEhhbmdvdXREcmF3ZXJDb250ZW50KCkge1xyXG5cclxuY29uc3Qge29uQXBwUm91dGV9ID11c2VBcHBSb3V0ZSgpXHJcblxyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgaWYgKHVzZXJuYW1lKSB7XHJcblxyXG4gICAgICBvbkFwcFJvdXRlKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGU6Jy9oYW5nb3V0cycscm91dGU6Jy9oYW5nb3V0cyd9KVxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIG9uQXBwUm91dGUoe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTonL2xvZ2luJyxyb3V0ZTonL2F1dGgnfSlcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gZGF0YS10ZXN0aWQ9J2hhbmdvdXRzJz5cclxuICAgICAgICAgIEhhbmdvdXRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gXHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBtZXNzYWdlSWNvbiBmcm9tICcuL21lc3NhZ2UucG5nJztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgY291bnQ6IHtcclxuICAgIHdpZHRoOiAzMCxcclxuICAgIGhlaWdodDogMzAsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicsXHJcbiAgICBjb2xvcjogJ3doaXRlJyxcclxuICAgIHRleHRBbGlnbjonY2VudGVyJyxcclxuICAgIGJvcmRlclJhZGl1czoxNSxcclxuICAgIGRpc3BsYXk6J2ZsZXgnLFxyXG4gICAgYWxpZ25JdGVtczonY2VudGVyJyxcclxuICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInXHJcbiAgfSxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UoeyBjb3VudD0wIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XHJcbiAgICAgICAgICA8ZGl2Pm1lc3NhZ2U6PC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmNvdW50fSBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtY291bnRcIj57Y291bnR9PC9kaXY+IFxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBTZXR0aW5ncyhwcm9wcykge1xyXG5cclxuICBjb25zdCB7IGhlaWdodCA9IDI0LFxyXG4gICAgd2lkdGggPSAyNCxcclxuICAgIGZpbGwgPSAnbm9uZScsXHJcbiAgICBjb2xvciA9ICdibGFjaycsb25DbGljayAsaWR9PXByb3BzXHJcbiAgXHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmcgaGVpZ2h0PXtoZWlnaHR9IHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9e3dpZHRofSAgaWQ9e2lkfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgwVjB6JyBmaWxsPXtmaWxsfSBpZD17aWR9Lz5cclxuICAgICAgPHBhdGhcclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgaWQ9e2lkfVxyXG4gICAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgICBjb2xvcj17Y29sb3J9XHJcbiAgICAgICAgZD0nTTE5LjQzIDEyLjk4Yy4wNC0uMzIuMDctLjY0LjA3LS45OHMtLjAzLS42Ni0uMDctLjk4bDIuMTEtMS42NWMuMTktLjE1LjI0LS40Mi4xMi0uNjRsLTItMy40NmMtLjEyLS4yMi0uMzktLjMtLjYxLS4yMmwtMi40OSAxYy0uNTItLjQtMS4wOC0uNzMtMS42OS0uOThsLS4zOC0yLjY1QzE0LjQ2IDIuMTggMTQuMjUgMiAxNCAyaC00Yy0uMjUgMC0uNDYuMTgtLjQ5LjQybC0uMzggMi42NWMtLjYxLjI1LTEuMTcuNTktMS42OS45OGwtMi40OS0xYy0uMjMtLjA5LS40OSAwLS42MS4yMmwtMiAzLjQ2Yy0uMTMuMjItLjA3LjQ5LjEyLjY0bDIuMTEgMS42NWMtLjA0LjMyLS4wNy42NS0uMDcuOThzLjAzLjY2LjA3Ljk4bC0yLjExIDEuNjVjLS4xOS4xNS0uMjQuNDItLjEyLjY0bDIgMy40NmMuMTIuMjIuMzkuMy42MS4yMmwyLjQ5LTFjLjUyLjQgMS4wOC43MyAxLjY5Ljk4bC4zOCAyLjY1Yy4wMy4yNC4yNC40Mi40OS40Mmg0Yy4yNSAwIC40Ni0uMTguNDktLjQybC4zOC0yLjY1Yy42MS0uMjUgMS4xNy0uNTkgMS42OS0uOThsMi40OSAxYy4yMy4wOS40OSAwIC42MS0uMjJsMi0zLjQ2Yy4xMi0uMjIuMDctLjQ5LS4xMi0uNjRsLTIuMTEtMS42NXpNMTIgMTUuNWMtMS45MyAwLTMuNS0xLjU3LTMuNS0zLjVzMS41Ny0zLjUgMy41LTMuNSAzLjUgMS41NyAzLjUgMy41LTEuNTcgMy41LTMuNSAzLjV6J1xyXG4gICAgICAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgd2lkdGg6IDE1LFxyXG4gIGhlaWdodDogMTUsXHJcblxyXG4gIGJvcmRlcjogJ3doaXRlIDJweCBzb2xpZCcsXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBPbmxpbmVTdGF0dXMoeyByZWFkeVN0YXRlIH0pIHtcclxuICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICAgcmV0dXJuIDxJc09ubGluZSAvPjtcclxuICB9IGVsc2UgaWYgKHJlYWR5U3RhdGUgPT09IDApIHtcclxuICAgIHJldHVybiA8Q29ubmVjdGluZyAvPjtcclxuICB9IGVsc2UgaWYgKHJlYWR5U3RhdGUgPT09IDIpIHtcclxuICAgIHJldHVybiA8Q2xvc2luZyAvPjtcclxuICB9XHJcbiAgcmV0dXJuIDxJc09mZmxpbmUgLz47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBJc09ubGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwib25saW5lXCJcclxuICAgID48L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPZmZsaW5lKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwib2ZmbGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENvbm5lY3RpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJjb25uZWN0aW5nXCJcclxuICAgID48L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ2xvc2luZygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncGluaycgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJjbG9zaW5nXCJcclxuICAgID48L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBOYXZJdGVtIH0gZnJvbSAnLi4vLi4vbmF2L05hdkl0ZW0nO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vLi4vaWNvbnMvTWVzc2FnZSc7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSAnLi4vLi4vaWNvbnMvU2V0dMSxbmdzJztcclxuaW1wb3J0IHsgT25saW5lU3RhdHVzIH0gZnJvbSAnLi4vLi4vaWNvbnMvb25saW5lU3RhdHVzJztcclxuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuLi9zdGF0ZS91c2VIYW5nb3V0cyc7XHJcbmltcG9ydCB7IHVzZVVzZXJOYW1lIH0gZnJvbSAnLi4vLi4vYXV0aC91c2VVc2VyTmFtZSc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhhbmdvdXRUb3BNZW51KCkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSB1c2VVc2VyTmFtZSgpO1xyXG4gIGNvbnN0IHsgcmVhZHlTdGF0ZSwgdW5yZWFkaGFuZ291dHMsIG9uTmF2aWdhdGlvbiwgaGFuZ291dCB9ID0gdXNlSGFuZ291dHMoKTtcclxuXHJcbiAgZnVuY3Rpb24gbmF2VG9VbnJlYWQoKSB7XHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiAnL1VOUkVBRCcsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PlxyXG4gICAgICA8TmF2SXRlbT57dXNlcm5hbWV9PC9OYXZJdGVtPlxyXG4gICAgICA8TmF2SXRlbT5cclxuICAgICAgICA8T25saW5lU3RhdHVzIHJlYWR5U3RhdGU9e3JlYWR5U3RhdGV9IC8+XHJcbiAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgPE5hdkl0ZW0gb25DbGljaz17bmF2VG9VbnJlYWR9IGRhdGEtdGVzdGlkPVwibmF2LXVucmVhZHNcIj5cclxuICAgICAgICB7dW5yZWFkaGFuZ291dHMgJiYgPE1lc3NhZ2UgY291bnQ9e3VucmVhZGhhbmdvdXRzLmZpbHRlcihmPT5mLnJlYWQ9PT1mYWxzZSkubGVuZ3RofSAvPn17JyAnfVxyXG4gICAgICA8L05hdkl0ZW0+XHJcbiAgICAgIHtoYW5nb3V0ICYmIChcclxuICAgICAgICA8TmF2SXRlbSAgICBvbkNsaWNrPXtvbk5hdmlnYXRpb259IGRhdGEtdGVzdGlkPVwibmF2LWNvbmZpZ1wiIGlkPVwiY29uZmlndXJlXCIgPlxyXG4gICAgICAgICAgPFNldHRpbmdzXHJcbiAgICAgICAgICAgIGZpbGw9XCJ3aGl0ZVwiXHJcbiAgICAgICAgICAgIHdpZHRoPVwiMzBcIlxyXG4gICAgICAgICAgICBoZWlnaHQ9XCIzMFwiXHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L05hdkl0ZW0+XHJcbiAgICAgICl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbi8vXHJcbiIsImV4cG9ydCBjb25zdCBkcmF3ZXIgPSB7XHJcbiAgYm94U2hhZG93OiBgMHB4IDNweCAzcHggLTJweCByZ2JhKDAsIDAsIDAsIDAuMiksMHB4IDNweCA0cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xNCksIDBweCAxcHggOHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTIpYCxcclxuXHJcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgbGVmdDogMCxcclxuICB0b3A6IDAsXHJcbiAgekluZGV4OiAxMCxcclxuICBoZWlnaHQ6ICcxMDB2aCcsXHJcbiAgYmFja2dyb3VuZENvbG9yOiAnI2Y1ZjVmNScsXHJcbn07XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IGRldmljZVR5cGUgZnJvbSAnLi9kZXZpY2VUeXBlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KCkge1xyXG4gIGNvbnN0IFt3aWR0aCwgc2V0V2lkdGhdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hlaWdodCwgc2V0SGVpZ2h0XSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtvcmllbnRhdGlvbiwgc2V0T3JpZW50YXRpb25dID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtkZXZpY2UsIHNldERldmljZV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlVmlld3BvcnRTaXplKCkge1xyXG4gICBcclxuICAgICAgc2V0V2lkdGgod2luZG93LmlubmVyV2lkdGgpO1xyXG4gICAgICBzZXRIZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKSB7XHJcbiAgICBzZXRPcmllbnRhdGlvbih3aW5kb3cuc2NyZWVuLm9yaWVudGF0aW9uKTtcclxuICB9XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh3aWR0aCA+IDApIHtcclxuICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA2MDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3Bob25lJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDc2ODpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDk5MjpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDEyMDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3RhYmxldCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdsYXB0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPiAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdkZXNrdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFt3aWR0aF0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2RldmljZScsIGRldmljZSk7XHJcbiAgfSwgW2RldmljZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBoYW5kbGVWaWV3cG9ydFNpemUoKTtcclxuICAgIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gaGFuZGxlVmlld3BvcnRTaXplKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB9O1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24sIGRldmljZSB9O1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgZHJhd2VyIH0gZnJvbSAnLi9zdHlsZSc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRpb24gfSBmcm9tICcuL05hdlByb3ZpZGVyJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRHJhd2VyKHByb3BzKSB7XHJcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgY29uc3QgeyBvcGVuLCBvbkNsaWNrLCBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgeyBkcmF3ZXJPcGVuLCB0b2dnbGVEcmF3ZXIgfSA9IHVzZU5hdmlnYXRpb24oKTtcclxuXHJcbiAgaWYgKGRyYXdlck9wZW4pXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3sgLi4uZHJhd2VyIH19XHJcbiAgICAgICAgY2xhc3NOYW1lPXtgZHJhd2VyLSR7ZGV2aWNlfS13aWR0aGB9XHJcbiAgICAgICAgb25DbGljaz17dG9nZ2xlRHJhd2VyfVxyXG4gICAgICA+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VUaGVtZUNvbnRleHQgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuZXhwb3J0IGZ1bmN0aW9uIEFwcEJhcih7IGNoaWxkcmVuIH0pIHtcclxuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lQ29udGV4dCgpO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgLi4udGhlbWUucHJpbWFyeSxcclxuICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgLy8gbGVmdDogMCxcclxuICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgIG1pbkhlaWdodDogNjQsXHJcbiAgICAgICAvLyBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAvLyBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgZGlzcGxheTonZmxleCdcclxuICAgICAgfX1cclxuICAgID5cclxuICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgJy4uL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudVdoaXRlKHsgb25DbGljaywgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPVwibWVudS13aGl0ZVwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICBmaWxsPVwid2hpdGVcIlxyXG4gICAgICB3aWR0aD1cIjI0cHhcIlxyXG4gICAgICBoZWlnaHQ9XCIyNHB4XCJcclxuICAgID5cclxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMyAxOGgxOHYtMkgzdjJ6bTAtNWgxOHYtMkgzdjJ6bTAtN3YyaDE4VjZIM3pcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGlvbiB9IGZyb20gJy4vTmF2UHJvdmlkZXInO1xyXG5pbXBvcnQgeyBNZW51V2hpdGUgfSBmcm9tICcuL2ljb25zL01lbnVXaGl0ZSc7XHJcbmV4cG9ydCBmdW5jdGlvbiBNZW51KCkge1xyXG4gIGNvbnN0IHsgZHJhd2VyT3BlbiwgdG9nZ2xlRHJhd2VyIH0gPSB1c2VOYXZpZ2F0aW9uKCk7XHJcblxyXG4gIHJldHVybiA8TWVudVdoaXRlIG9uQ2xpY2s9e3RvZ2dsZURyYXdlcn0gaWQ9XCJtZW51XCIgLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IE5hdkl0ZW0gfSBmcm9tICcuLi9uYXYvTmF2SXRlbSc7XHJcbmltcG9ydCB7IEF1dGhEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vYXV0aC9BdXRoRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEhhbmdvdXREcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vaGFuZ291dHMvbmF2L0hhbmdvdXREcmF3ZXJDb250ZW50JztcclxuaW1wb3J0IHsgSGFuZ291dFRvcE1lbnUgfSBmcm9tICcuLi9oYW5nb3V0cy9uYXYvSGFuZ291dFRvcE1lbnUnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgcmVjb3ZlckxvY2FsQXV0aFN0YXRlIH0gZnJvbSAnLi4vYXV0aC9hY3Rpb25zJztcclxuaW1wb3J0IERyYXdlciBmcm9tICcuLi9uYXYvRHJhd2VyJztcclxuaW1wb3J0IHsgQXBwQmFyIH0gZnJvbSAnLi4vbmF2L0FwcEJhcic7XHJcbmltcG9ydCB7IE1lbnUgfSBmcm9tICcuLi9uYXYvTWVudSc7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBOYXZpZ2F0aW9uKCkge1xyXG4gICAgY29uc3QgeyBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcbiAgICAgICAgIFxyXG4gICAgICAgY29uc3QgdXNlciA9SlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpXHJcbiAgICBcclxuICAgICAgICAgIHJlY292ZXJMb2NhbEF1dGhTdGF0ZSh7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgICB1c2VyXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFtdKTtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPEFwcEJhcj5cclxuICAgICAgICA8TWVudSAvPlxyXG4gICAgICAgIDxOYXZJdGVtIHN0eWxlPXt7IGZsZXg6IDUgfX0+V0VCIENPTTwvTmF2SXRlbT5cclxuICAgICAgICA8SGFuZ291dFRvcE1lbnUgLz5cclxuICAgICAgPC9BcHBCYXI+XHJcbiAgICAgIDxEcmF3ZXI+XHJcbiAgICAgICAgPEF1dGhEcmF3ZXJDb250ZW50IC8+XHJcbiAgICAgICAgPEhhbmdvdXREcmF3ZXJDb250ZW50IC8+XHJcbiAgICAgIDwvRHJhd2VyPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIb21lKCkge1xyXG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPSdob21lJyBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5Ib21lPC9kaXY+O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIElOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOiAnSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUnLFxyXG4gICAgUkVTRVRfVkFMSURBVElPTl9TVEFURTogJ1JFU0VUX1ZBTElEQVRJT05fU1RBVEUnLFxyXG4gICAgSU5QVVRfQkxVUlJFRDogJ0lOUFVUX0JMVVJSRUQnLFxyXG4gICAgSU5QVVRfRk9DVVNFRDogJ0lOUFVUX0ZPQ1VTRUQnLFxyXG4gIFxyXG4gICAgU0VSVkVSX1ZBTElEQVRJT046ICdTRVJWRVJfVkFMSURBVElPTicsXHJcbiAgICBDTElFTlRfVkFMSURBVElPTjonQ0xJRU5UX1ZBTElEQVRJT04nLFxyXG4gIFxyXG4gICAgSU5DX0lOUFVUX0NPVVROIDonSU5DX0lOUFVUX0NPVVROJ1xyXG4gIH07XHJcbiAgIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTElEOiAnVkFMSUQnLFxyXG4gIElOVkFMSUQ6ICdJTlZBTElEJyxcclxuICBJTkFDVElWRTogJ0lOQUNUSVZFJ1xyXG59O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7IHZhbGlkYXRpb246IHt9IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybVJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG5cclxuICBsZXQgbmV4dFN0YXRlID0gbnVsbDtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbmRlYnVnZ2VyO1xyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcblxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTlBVVF9GT0NVU0VEOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgIFthY3Rpb24ucHJvcE5hbWVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGNvdW50OiBzdGF0ZS5jb3VudCArIDEgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgZm9ybVJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vZm9ybVJlZHVjZXInO1xyXG5jb25zdCBGb3JtQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VGb3JtQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChGb3JtQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUZvcm1Db250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEZvcm1Qcm92aWRlcicpO1xyXG4gIH1cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9ybVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxGb3JtQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIC8vY29uc3RyYWludFxyXG4gIEVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOiAnUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIEVNUFRZX1NUUklOR19WQUxJREFUSU9OOiAnRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOiAnUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04nLFxyXG4gIC8vYXV0aFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdJTlZBTElEX0NSRURFTlRJQUxTJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ1VTRVJOQU1FX1RBS0VOJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnUkVHSVNURVJFRF9FTUFJTCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdFTUFJTF9OT1RfUkVHSVNURVJFRCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6J1VTRVJOQU1FX05PVF9SRUdJU1RFUkVEJyxcclxuICBBQ0NPVU5UX0FMUkVBRFlfRVhJU1RTOidBQ0NPVU5UX0FMUkVBRFlfRVhJU1RTJ1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSU5WQUxJRF9QQVNTV09SRDpcclxuICAgICdhdCBsZWFzdCA4IGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBhdCBsZWFzdCAxIHVwcGVyY2FzZSBsZXR0ZXIsIDEgbG93ZXJjYXNlIGxldHRlciwgQ2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzJyxcclxuICBJTlZBTElEX0VNQUlMOiAnZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6ICd1c2VybmFtZSBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRTpcclxuICAgICdvbmx5IExldHRlcnMgYS16IG9yIEEtWiBhbmQgdGhlIFN5bWJvbHMgLSBhbmQgXyBhcmUgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9FTVBUWV9TVFJJTkc6ICdlbXB0eSBzdHJpbmcgaXMgbm90IGFsbG93ZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUw6ICdlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWQnLFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdpbnZhbGlkIGNyZWRlbnRpYWxzIHByb3ZpZGVkJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ3VzZXJuYW1lIGlzIGFscmVhZHkgdGFrZW4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnLFxyXG4gIFBBU1NXT1JEU19ET19OT1RfTUFUQ0g6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJyxcclxuICBcclxuICBBQ0NPVU5UX0FMUkVBRFlfRVhJU1RTOidBY2NvdW50IGFscmVhZHkgZXhpc3RzIGZvciB0aGlzIHVzZXJuYW1lLidcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlthLXpBLVpdKS57OCx9JC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/L2c7XHJcblxyXG5leHBvcnQgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9bYS16QS1aXStbLV9dKlthLXpBLVpdKy9nO1xyXG4iLCJpbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuaW1wb3J0IHsgZW1haWxSZWdleCwgcGFzc3dvcmRSZWdleCwgdXNlcm5hbWVSZWdleCB9IGZyb20gJy4vdmFsaWRhdGlvblJlZ2V4JztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxDb25zdHJhaW50KHsgZW1haWwgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdChlbWFpbCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkge1xyXG4gIGNvbnN0IHBhc3N3b3JkQ29uc3RyYWludCA9IG5ldyBSZWdFeHAocGFzc3dvcmRSZWdleCk7XHJcbiAgaWYgKHBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbiAgaWYgKCFwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pIHtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodXNlcm5hbWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoeyB2YWx1ZSB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pIHtcclxuICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSkge1xyXG5cclxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtIH0gPWF1dGg7XHJcblxyXG4gIGlmIChwYXNzd29yZCA9PT0gJycgfHwgcGFzc3dvcmQgIT09IGNvbmZpcm0pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIGFjY291bnRBbHJlYWR5RXhpdHM6MjAyLFxyXG4gIC8vbG9naW5cclxuICBjcmVkZW50aWFsSW52YWxpZDogJzQwMScsXHJcbiAgLy9zaWdudXBcclxuICB1c2VybmFtZUlzVGFrZW46ICc0MDInLFxyXG4gIGVtYWlsSXNSZWdpc3RlcmVkOiAnNDAzJyxcclxuICB1c2VybmFtZUludmFsaWQ6ICc0MDUnLFxyXG4gIHBhc3N3b3JkSW52YWxpZDogJzQwNicsIC8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgZW1haWxJbnZhbGlkOiAnNDA3JyxcclxuICAvL2xvZ2luXHJcbiAgZW1haWxJc05vdFJlZ2lzdGVyZWQ6ICc0MDgnLFxyXG4gIGVtcHR5U3RyaW5nTm90VmFsaWQ6ICc0MDknLFxyXG4gIGVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOic0MTAnLFxyXG4gIHVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOic0MTEnLFxyXG4vL2NoYW5nZSBwYXNzd29yZFxyXG4gIHBhc3N3b3JkRG9Ob3RNYXRjaDonNDEyJyxcclxuICB0b2tlbkV4cGlyZWQ6JzQxMycsXHJcbiAgc2VydmVyVmFsaWRhdGlvblJhbmdlOiBzdGF0dXMgPT4ge1xyXG4gICAgaWYgKHN0YXR1cyA+PSA0MDAgJiYgc3RhdHVzIDw9IDQxMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgKiBhcyB2YWxpZGF0aW9ucyBmcm9tICcuL2NvbnN0cmFpbnRWYWxpZGF0b3JzJztcclxuaW1wb3J0IGNvbnN0VmFsVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuL2h0dHAtc3RhdHVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xpZW50VmFsaWRhdGlvbih7IHZhbGlkYXRpb25UeXBlLCB2YWx1ZSwgc3RhdGUsYXV0aCB9KSB7XHJcblxyXG4gIGxldCB2YWxpZGF0aW9uID0gbnVsbDtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7XHJcbiAgICAgICAgZW1haWw6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7XHJcbiAgICAgICAgdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHtcclxuICAgICAgICBwYXNzd29yZDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHtcclxuICAgICAgICB1c2VybmFtZTogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgIFxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OLCAuLi52YWxpZGF0aW9uIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0Rm9ybVZhbGlkYXRpb25TdGF0ZSgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFLCB2YWxpZGF0aW9uVHlwZSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5jSW5wdXRDb3VudCgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE4gfTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzID0gMCB9KSB7XHJcbmRlYnVnZ2VyXHJcbiAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgIGNhc2UgMTAxOlxyXG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgMTI1OlxyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgICBjYXNlIDIwMzpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzUmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlJFR0lTVEVSRURfRU1BSUwsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFR0lTVEVSRURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgMjAyOlxyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNUYWtlbjpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVN0cmluZ05vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgICBjYXNlIDIwMDpcclxuICAgICAgXHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuLi9hdXRoL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHtzZXJ2ZXJWYWxpZGF0aW9ufSBmcm9tICcuLi9mb3JtL2FjdGlvbnMnXHJcblBhcnNlLmluaXRpYWxpemUoXCJ6dHRwbnFUcjhyZWZrdEJXTmVrWmhaeFN4d1BhQUFuRWxROWs3Q3VBXCIsXCJRN1NIU0ZMRzYxOGl6YnlTTXBBc0ZBcWduT0xhWWd4Tmx3ZkZoT0FyXCIpOyAvL1BBU1RFIEhFUkUgWU9VUiBCYWNrNEFwcCBBUFBMSUNBVElPTiBJRCBBTkQgWU9VUiBKYXZhU2NyaXB0IEtFWVxyXG5QYXJzZS5zZXJ2ZXJVUkwgPSBgaHR0cHM6Ly8ke2lwfToxMzM3L3BhcnNlYFxyXG4vL1BhcnNlLmxpdmVRdWVyeVNlcnZlclVSTCA9IGBodHRwczovLyR7aXB9OjEzMzcvcGFyc2VgXHJcbi8vUGFyc2Uuc2VydmVyVVJMID0gJ2h0dHBzOi8vcGFyc2VhcGkuYmFjazRhcHAuY29tLydcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ25VcCh7ZGlzcGF0Y2gsc3RhdGUsZm9ybURpc3BhdGNofSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7dXNlcm5hbWUscGFzc3dvcmQsZW1haWx9PXN0YXRlXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRH0pXHJcbiAgICAvLyBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHVzZXIgY2xhc3NcclxuICAgIHZhciB1c2VyID0gbmV3IFBhcnNlLlVzZXIoKTtcclxuICAgIHVzZXIuc2V0KFwidXNlcm5hbWVcIiwgdXNlcm5hbWUpO1xyXG4gICAgdXNlci5zZXQoXCJwYXNzd29yZFwiLCBwYXNzd29yZCk7XHJcbiAgICB1c2VyLnNldChcImVtYWlsXCIsIGVtYWlsKTtcclxuICAgIGxldCBzdWNjZXNzID0gYXdhaXQgdXNlci5zaWduVXAoKVxyXG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAnd2ViY29tJyxcclxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIHRva2VuIDpzdWNjZXNzLmdldCgnc2Vzc2lvblRva2VuJyksXHJcbiAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gICAgY29uc3QgSGFuZ291dFVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICBjb25zdCBoYW5nb3V0VXNlciA9IG5ldyBIYW5nb3V0VXNlcigpO1xyXG4gICAgaGFuZ291dFVzZXIuc2V0KCd1c2VybmFtZScsdXNlcm5hbWUpXHJcbiAgICBoYW5nb3V0VXNlci5zZXQoJ2VtYWlsJyxlbWFpbClcclxuICAgIGhhbmdvdXRVc2VyLnNldCgndXNlcmlkJyxzdWNjZXNzLmlkKVxyXG4gICAgYXdhaXQgIGhhbmdvdXRVc2VyLnNhdmUoKVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsdXNlcjp7dXNlcm5hbWUsZW1haWwsdG9rZW46c3VjY2Vzcy5nZXQoJ3Nlc3Npb25Ub2tlbicpfX0pXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGZvcm1EaXNwYXRjaChzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6ZXJyb3IuY29kZX0pKVxyXG4gIH1cclxuICBcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9naW4oe2Rpc3BhdGNoLHN0YXRlLGZvcm1EaXNwYXRjaH0pIHtcclxuICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZH09IHN0YXRlXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEfSlcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSB1c2VyIGNsYXNzXHJcbiAgICB2YXIgdXNlciA9ICBQYXJzZS5Vc2VyLmxvZ0luKGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIGxldCB1c2VybmFtZSA9IHVzZXIuZ2V0KFwidXNlcm5hbWVcIilcclxuICAgICAgICBsZXQgZW1haWwgPXVzZXIuZ2V0KFwiZW1haWxcIilcclxuICAgICAgICBsZXQgdG9rZW4gPXVzZXIuZ2V0KCdzZXNzaW9uVG9rZW4nKSBcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsdXNlcjp7dXNlcm5hbWUsZW1haWwsdG9rZW59fSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1VzZXIgY3JlYXRlZCBzdWNjZXNzZnVsIHdpdGggbmFtZTogJyArIHVzZXIuZ2V0KFwidXNlcm5hbWVcIikgKyAnIGFuZCBlbWFpbDogJyArIHVzZXIuZ2V0KFwiZW1haWxcIikpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIGNvbnN0IGVyciA9ZXJyb3JcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGV9KSlcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoe2Rpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNofSkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgUGFyc2UuVXNlci5yZXF1ZXN0UGFzc3dvcmRSZXNldChlbWFpbCkudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyxcclxuICAgICAgICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgICAgICAgbWVzc2FnZTogYEEgbGluayBmb3IgcGFzc3dvcmQgY2hhbmdlICBoYXMgYmVlbiBzZW50IHRvLCAke2VtYWlsfSEgYCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlBhc3N3b3JkIHJlc2V0IHJlcXVlc3Qgd2FzIHNlbnQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zdCBlcnI9ZXJyb3I7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGxvZ2luIGZhaWxlZCB3aXRoIGVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbn0iLCJpbXBvcnQge3VzZUF1dGhDb250ZXh0fSBmcm9tICcuLi9hdXRoL2F1dGgtY29udGV4dCdcclxuaW1wb3J0IHt1c2VGb3JtQ29udGV4dH0gZnJvbSAnLi4vZm9ybS9mb3JtLWNvbnRleHQnXHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hdXRoLWFjdGlvbnMnXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VQYXJzZUF1dGgoKXtcclxuY29uc3Qge3N0YXRlLGRpc3BhdGNofT0gdXNlQXV0aENvbnRleHQoKVxyXG5jb25zdCB7ZGlzcGF0Y2g6Zm9ybURpc3BhdGNofT0gdXNlRm9ybUNvbnRleHQoKVxyXG4gICAgZnVuY3Rpb24gc2lnbnVwKCl7XHJcbiAgICAgICAgYWN0aW9ucy5zaWduVXAoe3N0YXRlLGRpc3BhdGNoLGZvcm1EaXNwYXRjaH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBsb2dpbiAoKXtcclxuICAgICAgICBhY3Rpb25zLmxvZ2luKHtzdGF0ZSxkaXNwYXRjaCxmb3JtRGlzcGF0Y2h9KSAgXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCgpe1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGFjdGlvbnMuZm9yZ290UGFzc3dvcmQoe3N0YXRlLGRpc3BhdGNoLGZvcm1EaXNwYXRjaH0pICBcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKCl7XHJcblxyXG4gICAgfVxyXG4gICBcclxuXHJcbiAgICByZXR1cm4ge3NpZ251cCxsb2dpbixjaGFuZ2VQYXNzd29yZCxmb3Jnb3RQYXNzd29yZH1cclxuXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuXHJcbmltcG9ydCB7RmVhdHVyZVJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHt1c2VQYXJzZUF1dGh9IGZyb20gJy4uL3BhcnNlL3VzZVBhcnNlQXV0aCdcclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi9Mb2dpbicpKTtcclxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9DaGFuZ2VQYXNzd29yZCcpKTtcclxuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vU2lnbnVwJykpO1xyXG5jb25zdCBQcm9maWxlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vUHJvZmlsZScpKTtcclxuY29uc3QgQXV0aEZlZWRiYWNrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vQXV0aEZlZWRiYWNrJykpO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYXJzZUF1dGhlbnRpY2F0aW9uKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IHtzaWdudXAsbG9naW4sY2hhbmdlUGFzc3dvcmQsZm9yZ290UGFzc3dvcmR9PXVzZVBhcnNlQXV0aCgpXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgY2hhbmdlUGFzc3dvcmQ9e2NoYW5nZVBhc3N3b3JkfSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9sb2dpbic+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPExvZ2luIGxvZ2luPXtsb2dpbn0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvc2lnbnVwJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8U2lnbnVwIHNpZ251cD17c2lnbnVwfS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9mb3Jnb3RwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkICBmb3Jnb3RQYXNzd29yZD17Zm9yZ290UGFzc3dvcmR9Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3Byb2ZpbGUnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQcm9maWxlIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEF1dGhGZWVkYmFjayAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuXHJcbmltcG9ydCB7RmVhdHVyZVJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHt1c2VOb2RlQXV0aH0gZnJvbSAnLi9ub2RlLWpzLWF1dGgvdXNlTm9kZUF1dGgnXHJcbmNvbnN0IExvZ2luID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vTG9naW4nKSk7XHJcbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vQ2hhbmdlUGFzc3dvcmQnKSk7XHJcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vRm9yZ290UGFzc3dvcmQnKSk7XHJcbmNvbnN0IFNpZ251cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1NpZ251cCcpKTtcclxuY29uc3QgUHJvZmlsZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1Byb2ZpbGUnKSk7XHJcbmNvbnN0IEF1dGhGZWVkYmFjayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0F1dGhGZWVkYmFjaycpKTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTm9kZUF1dGhlbnRpY2F0aW9uKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IHtzaWdudXAsbG9naW4sY2hhbmdlUGFzc3dvcmQsZm9yZ290UGFzc3dvcmR9PXVzZU5vZGVBdXRoKClcclxuXHJcblxyXG4gICBcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9jaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPENoYW5nZVBhc3N3b3JkIGNoYW5nZVBhc3N3b3JkPXtjaGFuZ2VQYXNzd29yZH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvbG9naW4nPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxMb2dpbiBsb2dpbj17bG9naW59Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3NpZ251cCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFNpZ251cCBzaWdudXA9e3NpZ251cH0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvZm9yZ290cGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAgZm9yZ290UGFzc3dvcmQ9e2ZvcmdvdFBhc3N3b3JkfS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9wcm9maWxlJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8UHJvZmlsZSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9hdXRoZmVlZGJhY2snPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxBdXRoRmVlZGJhY2sgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnLi9Ib21lJztcclxuaW1wb3J0IFBhcnNlQXV0aGVudGljYXRpb24gZnJvbSAnLi4vYXV0aC9QYXJzZUF1dGhlbnRpY2F0aW9uJztcclxuaW1wb3J0IE5vZGVBdXRoZW50aWNhdGlvbiBmcm9tICcuLi9hdXRoL05vZGVBdXRoZW50aWNhdGlvbic7XHJcbmltcG9ydCB7IEZvcm1Qcm92aWRlciB9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0JztcclxuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vaGFuZ291dHMnKSk7XHJcbmNvbnN0IEdyb3VwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2dyb3VwL2dyb3VwJykpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlcygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDAlJyB9fT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYXV0aFwiPlxyXG4gICAgICAgIDxGb3JtUHJvdmlkZXI+XHJcbiAgICAgICAgICB7UFJFQUNUX0FQUF9CQUNLID09PSdQUkVBQ1RfQVBQX1BBUlNFJyAmJiA8UGFyc2VBdXRoZW50aWNhdGlvbi8+fVxyXG4gICAgICAgICAge1BSRUFDVF9BUFBfQkFDSyA9PT0nUFJFQUNUX0FQUF9OT0RFSlMnICYmIDxOb2RlQXV0aGVudGljYXRpb24vPn1cclxuICAgICAgICA8L0Zvcm1Qcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvXCI+XHJcbiAgICAgICAgPEhvbWUgLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuXHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvZ3JvdXBcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8R3JvdXAgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuXHJcbmltcG9ydCB7QXBwTmF2aWdhdGlvbn0gZnJvbSAnLi9BcHBOYXZpZ2F0aW9uJ1xyXG5pbXBvcnQge0FwcFJvdXRlc30gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcbmltcG9ydCAnLi9jc3MvYXBwLmNzcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzk1dmgnIH19PlxyXG4gICAgIDxBcHBOYXZpZ2F0aW9uLz5cclxuICAgICAgPEFwcFJvdXRlcy8+XHJcbiAgICAgIHsnJ31cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlcnMgfSBmcm9tICcuL0FwcFByb3ZpZGVycyc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxuLy9QYXJzZS5pbml0aWFsaXplKFwienR0cG5xVHI4cmVma3RCV05la1poWnhTeHdQYUFBbkVsUTlrN0N1QVwiLFwiUTdTSFNGTEc2MThpemJ5U01wQXNGQXFnbk9MYVlneE5sd2ZGaE9BclwiKTsgLy9QQVNURSBIRVJFIFlPVVIgQmFjazRBcHAgQVBQTElDQVRJT04gSUQgQU5EIFlPVVIgSmF2YVNjcmlwdCBLRVlcclxuLy9QYXJzZS5zZXJ2ZXJVUkwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L3BhcnNlJ1xyXG5yZW5kZXIoXHJcbiAgPEFwcFByb3ZpZGVycz5cclxuICAgIDxBcHAgLz5cclxuICA8L0FwcFByb3ZpZGVycz4sXHJcblxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiRmVhdHVyZVJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImRpc3BhdGNoIiwiZmluZCIsInVzZUFwcFJvdXRlIiwib25BcHBSb3V0ZSIsIkFwcFJvdXRlIiwiQXBwUm91dGVQcm92aWRlciIsImluaXRTdGF0ZSIsInVzZVJlZHVjZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRCIsIlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BREVEX01FU1NBR0VTIiwiU0VBUkNIX0lOUFVUX0NIQU5HRSIsIlNFTEVDVEVEX0hBTkdPVVQiLCJDTEVBUkVEX0hBTkdPVVQiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQiLCJNRVNTQUdFU19VUERBVEVEIiwiSEFOR09VVFNfVVBEQVRFRCIsIkhBTkdPVVRfVVBEQVRFRCIsIlVOUkVBRF9IQU5HT1VUU19VUERBVEVEIiwiQ09OTkVDVElORyIsIk9QRU4iLCJDTE9TSU5HIiwiQ0xPU0VEIiwiU09DS0VUX1JFQURZIiwiU09DS0VUX0VSUk9SIiwiaGFuZ291dHMiLCJoYW5nb3V0IiwidW5yZWFkaGFuZ291dHMiLCJtZXNzYWdlcyIsInNlYXJjaCIsInVzZXIiLCJsb2FkaW5nIiwiZXJyb3IiLCJtZXNzYWdlVGV4dCIsIm9ubGluZSIsInNvY2tldCIsInJlYWR5U3RhdGUiLCJzb2NrZXRNZXNzYWdlIiwiZmV0Y2hIYW5nb3V0cyIsInBlbmRpbmdIYW5nb3V0IiwibWVzc2FnZSIsInRleHQiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIkZJTFRFUl9IQU5HT1VUUyIsImZpbHRlciIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJoYW5nb3V0U3RhdGVzIiwiSU5WSVRFUiIsIkFDQ0VQVEVSIiwiREVDTElORVIiLCJCTE9DS0VSIiwiVU5CTE9DS0VSIiwiTUVTU0FOR0VSIiwiSU5WSVRFRCIsIkFDQ0VQVEVEIiwiREVDTElORUQiLCJCTE9DS0VEIiwiVU5CTE9DS0VEIiwiTUVTU0FHRUQiLCJ1cGRhdGVEZWxpdmVyZWRIYW5nb3V0IiwibmFtZSIsIm9mZmxpbmUiLCJ0aW1lc3RhbXAiLCJkZWxpdmVyZWRIYW5nb3V0IiwiZGVsaXZlcmVkIiwiaGFuZ291dEtleSIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJoYW5nb3V0SW5kZXgiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlRGVsaXZlcmVkTWVzc2FnZSIsInVwZGF0ZUJvY2tlZFN0YXRlIiwib2ZmbGluZUhhbmdvdXRLZXkiLCJvZmZsaW5laGFuZ291dHMiLCJkZWxpdmVyZWRNZXNzYWdlIiwibWVzc2FnZUtleSIsImJsb2NrZWRNZXNzYWdlIiwic2F2ZU1lc3NhZ2VkIiwic2F2ZUludml0ZWQiLCJzYXZlQWNjZXB0ZWQiLCJzYXZlRGVjbGluZWQiLCJzYXZlQmxvY2tlZCIsInNhdmVVbmJsb3ZrZWQiLCJzYXZlUmVjaWV2ZWRIYW5nb3V0IiwiZm9jdXNlZEhhbmdvdXQiLCJ1bnJlYWQiLCJoYW5nb3V0RXhpc3QiLCJoZyIsInJlYWQiLCJ1cGRhdGVkSGFuZ291dHMiLCJzYXZlUmVjaWV2ZWRNZXNzYWdlIiwic2F2ZVVucmVhZEhhbmdvdXQiLCJ1cGRhdGVkTWVzc2FnZXMiLCJ1bnJlYWRoYW5nb3V0c0tleSIsInVwZGF0ZWR1bnJlYWRzIiwic2F2ZUludml0ZXIiLCJzYXZlQWNjZXB0ZXIiLCJzYXZlQmxvY2tlciIsInNhdmVEZWNsaW5lciIsInNhdmVNZXNzYW5nZXIiLCJzYXZlVW5ibG9ja2VyIiwidXNlTWVzc2FnZSIsImhhbmRsZUFja25vd2xlZGdlbWVudCIsImhhbmRsZUhhbmdvdXQiLCJoYW5kbGVIYW5nb3V0cyIsImZvckVhY2giLCJ1c2VFZmZlY3QiLCJsb2FkSGFuZ291dHMiLCJzZWxlY3RVbnJlYWQiLCJjaGFuZ2VNZXNzYWdlVGV4dCIsImxvYWRNZXNzYWdlcyIsImtleSIsIlZBTFVFX0NIQU5HRUQiLCJMT0dJTl9TVEFSVEVEIiwiTE9HSU5fU1VDQ0VTUyIsIkxPR0lOX0ZBSUxFRCIsIkxPR09VVF9TVEFSVEVEIiwiTE9HT1VUX0ZBSUxFRCIsIkxPR09VVF9TVUNDRVNTIiwiU0lHTlVQX1NUQVJURUQiLCJTSUdOVVBfU1VDQ0VTUyIsIlNJR05VUF9GQUlMRUQiLCJDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCIsIkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTIiwiQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyIsIlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEIiwiR09UX1RPS0VOX0ZST01fVVJMIiwiUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFIiwiZW1haWwiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJjb25maXJtIiwiY3VycmVudCIsImVtYWlsb3J1c2VybmFtZSIsInRva2VuIiwiaXNMb2dnZWRJbiIsImlzUGFzc3dvcmRDaGFuZ2VkIiwiYXV0aEZlZWRiYWNrIiwiYXV0aFJlZHVjZXIiLCJuZXh0U3RhdGUiLCJwYXlsb2FkIiwicHJvcE5hbWUiLCJzdWNjZXNzTWVzc2FnZSIsIkF1dGhSb3V0ZUNvbnRleHQiLCJBdXRoUm91dGVQcm92aWRlciIsImluaXRpYWxSb3V0ZSIsImF1dGhSb3V0ZSIsInNldEF1dGhSb3V0ZSIsInVzZVN0YXRlIiwiQXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsIkF1dGhQcm92aWRlciIsInVzZVVzZXJOYW1lIiwidXNlck5hbWUiLCJzZXRVc2VybmFtZSIsInNldFRva2VuIiwic2V0RW1haWwiLCJ3aW5kb3ciLCJ1cGRhdGVSZWFkSGFuZ291dHMiLCJsZW5ndGgiLCJ1cGRhdGVkdW5yZWFkIiwibWFwIiwidXBkYXRlUmVhZE1lc3NzYWdlcyIsIkhhbmdvdXRDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJIYW5nb3V0c1Byb3ZpZGVyIiwiaGFuZGxlTWVzc2FnZSIsInVwZGF0ZWQiLCJzYXZlUGVuZGluZ0hhbmdvdXQiLCJpc0Jsb2NrZXIiLCJzYXZlSGFuZ291dCIsInNhdmVNZXNzYWdlIiwiYmxvY2tlciIsIkRhdGUiLCJub3ciLCJmbG9hdCIsImNsaWVudENvbW1hbmRzIiwiSU5WSVRFIiwiQUNDRVBUIiwiREVDTElORSIsIkJMT0NLIiwiVU5CTE9DSyIsIk1FU1NBR0UiLCJPTkxJTkUiLCJzZW5kT2ZmbGluZUhhbmdvdXRzIiwib2ZmbGluZUhhbmdvdXRzIiwiZm9yZUVhY2giLCJoIiwic2VuZCIsImNvbW1hbmQiLCJyZW1vdmVIYW5nb3V0RnJvbVVucmVhZCIsImZpbHRlcmVkSGFuZ291dHMiLCJyZW1vdmVJdGVtIiwidXNlSGFuZ291dHMiLCJhdXRoQ29udGV4dCIsInVzZXJzIiwib25SZW1vdmVVbnJlYWQiLCJpZCIsImN1cnJlbnRUYXJnZXQiLCJvbk5hdmlnYXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJvblNlbGVjdEhhbmdvdXQiLCJ0YXJnZXQiLCJvblNlbGVjdFVucmVhZCIsIm9uU2VhcmNoSW5wdXQiLCJvbkZldGNoSGFuZ291dHMiLCJvbk1lc3NhZ2VUZXh0Iiwib25IYW5nb3V0IiwiUGFyc2UiLCJVc2VyIiwiYXR0cmlidXRlcyIsInF1ZXJ5IiwiUXVlcnkiLCJlcXVhbFRvIiwic2VhcmNoUmVzdWx0IiwibWFwcGVkSGFub3V0cyIsIkhhbmdvdXRVc2VyIiwiT2JqZWN0IiwiZXh0ZW5kIiwic3RhdGVNYXBwZXIiLCJzZW5kZXJTdGF0ZSIsInRhcmdldFN0YXRlIiwiUGFyc2VTZXJ2ZXIiLCJhY3Rpb25zIiwic2VuZEhhbmdvdXQiLCJzdWJzRmlyc3QiLCJjdXJyZW50VXNlciIsInN1YnNjcmlwdGlvbiIsInN1YnNjcmliZSIsIm9uIiwib2JqZWN0IiwiY29uc29sZSIsImxvZyIsIkhhbmdvdXQiLCJTZW5kZXJVc2VyIiwic2VuZGVyUXVlcnkiLCJzZW5kZXJVc2VyIiwiZmlyc3QiLCJUYXJnZXRVc2VyIiwidGFyZ2V0UXVlcnkiLCJ0YXJnZXRVc2VyIiwic2VuZGVyIiwic2V0IiwidXNlcmlkIiwiYWRkVW5pcXVlIiwic2F2ZSIsInRhcmdldEhhbmdvdXQiLCJzZW5kZXJIYW5nb3V0IiwiSGFuZ291dEFkYXB0ZXIiLCJUaGVtZUNvbnRleHQiLCJ1c2VUaGVtZUNvbnRleHQiLCJUaGVtZVByb3ZpZGVyIiwic2V0U3RhdGUiLCJOYXZDb250ZXh0IiwidXNlTmF2Q29udGV4dCIsInVzZU5hdmlnYXRpb24iLCJkcmF3ZXJPcGVuIiwic2V0RHJhd2VyT3BlbiIsInRvZ2dsZURyYXdlciIsInByZXYiLCJOYXZQcm92aWRlciIsIkFwcFByb3ZpZGVycyIsInByaW1hcnkiLCJiYWNrZ3JvdW5kIiwiY29sb3IiLCJmb250RmFtaWx5IiwiaXAiLCJFIiwidyIsIkMiLCJsIiwiQSIsIkYiLCJOIiwiTSIsIlAiLCJEIiwiSCIsIiQiLCJxIiwiTmF2SXRlbSIsIkxpc3QiLCJMaXN0SXRlbSIsInZhbHVlQ2hhbmdlZCIsImxvZ291dCIsImdldFRva2VuRnJvbVVybCIsInJlY292ZXJMb2NhbEF1dGhTdGF0ZSIsInN0eWxlIiwiZ3JpZCIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwianVzdGlmeUl0ZW1zIiwicGFkZGluZyIsIkF1dGhEcmF3ZXJDb250ZW50IiwiaGFuZGxlUm91dGUiLCJwcmV2ZW50RGVmYXVsdCIsInBhZGRpbmdUb3AiLCJoZWlnaHQiLCJBdXRoZWRTdGF0ZSIsImhhbmRsZUxvZ091dCIsImFsaWduSXRlbXMiLCJmbGV4RGlyZWN0aW9uIiwidXNlckljb24iLCJwYWRkaW5nUmlnaHQiLCJtYXJnaW5Cb3R0b20iLCJVbkF1dGhlZFN0YXRlIiwiSGFuZ291dERyYXdlckNvbnRlbnQiLCJjb3VudCIsIndpZHRoIiwiYmFja2dyb3VuZENvbG9yIiwidGV4dEFsaWduIiwiYm9yZGVyUmFkaXVzIiwianVzdGlmeUNvbnRlbnQiLCJNZXNzYWdlIiwiU2V0dGluZ3MiLCJmaWxsIiwib25DbGljayIsImJvcmRlciIsIk9ubGluZVN0YXR1cyIsIklzT25saW5lIiwiSXNPZmZsaW5lIiwiQ29ubmVjdGluZyIsIkNsb3NpbmciLCJIYW5nb3V0VG9wTWVudSIsIm5hdlRvVW5yZWFkIiwiZHJhd2VyIiwiYm94U2hhZG93IiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwiekluZGV4IiwidXNlTWVkaWFRdWVyeSIsInNldFdpZHRoIiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwiYWRkRXZlbnRMaXN0ZW5lciIsIkRyYXdlciIsIm9wZW4iLCJBcHBCYXIiLCJ0aGVtZSIsIm1pbkhlaWdodCIsIk1lbnVXaGl0ZSIsIk1lbnUiLCJBcHBOYXZpZ2F0aW9uIiwiZmxleCIsIkhvbWUiLCJJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSIsIlJFU0VUX1ZBTElEQVRJT05fU1RBVEUiLCJJTlBVVF9CTFVSUkVEIiwiSU5QVVRfRk9DVVNFRCIsIlNFUlZFUl9WQUxJREFUSU9OIiwiQ0xJRU5UX1ZBTElEQVRJT04iLCJJTkNfSU5QVVRfQ09VVE4iLCJWQUxJRCIsIklOVkFMSUQiLCJJTkFDVElWRSIsInZhbGlkYXRpb24iLCJmb3JtUmVkdWNlciIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblN0YXRlIiwiZm9ybVN0YXRlIiwiRm9ybUNvbnRleHQiLCJ1c2VGb3JtQ29udGV4dCIsIkZvcm1Qcm92aWRlciIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiQUNDT1VOVF9BTFJFQURZX0VYSVNUUyIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0aW9uVHlwZXMiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJpc0NsaWVudFZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsaWRhdGVFbXB0eVN0cmluZyIsInZhbGlkYXRlUGFzc3dvcmRNYXRjaCIsImF1dGgiLCJhY2NvdW50QWxyZWFkeUV4aXRzIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwiY29uc3RWYWxUeXBlcyIsInZhbGlkYXRpb25zIiwicmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSIsInNlcnZlclZhbGlkYXRpb24iLCJodHRwU3RhdHVzIiwidmFsaWRhdGlvblN0YXRlcyIsImluaXRpYWxpemUiLCJzZXJ2ZXJVUkwiLCJzaWduVXAiLCJmb3JtRGlzcGF0Y2giLCJnZXQiLCJoYW5nb3V0VXNlciIsImNvZGUiLCJsb2dpbiIsImxvZ0luIiwidGhlbiIsImNhdGNoIiwiZm9yZ290UGFzc3dvcmQiLCJyZXF1ZXN0UGFzc3dvcmRSZXNldCIsInJlc3VsdCIsInVzZVBhcnNlQXV0aCIsInNpZ251cCIsImNoYW5nZVBhc3N3b3JkIiwiTG9naW4iLCJsYXp5IiwiQ2hhbmdlUGFzc3dvcmQiLCJGb3Jnb3RQYXNzd29yZCIsIlNpZ251cCIsIlByb2ZpbGUiLCJBdXRoRmVlZGJhY2siLCJQYXJzZUF1dGhlbnRpY2F0aW9uIiwiU3VzcGVuc2UiLCJIYW5nb3V0cyIsIkdyb3VwIiwiQXBwUm91dGVzIiwiUFJFQUNUX0FQUF9CQUNLIiwiQXBwIiwicmVuZGVyIiwiZG9jdW1lbnQiLCJib2R5Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE9BQU8sR0FBRztBQUNkLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixJQUFJLElBQUk7QUFDekMsRUFBRSxRQUFRLEVBQUUsUUFBUSxJQUFJLElBQUksSUFBSSxVQUFVLElBQUksTUFBTTtBQUNwRCxFQUFFLElBQUk7QUFDTixJQUFJLFlBQVksSUFBSSxJQUFJO0FBQ3hCLElBQUksTUFBTSxJQUFJLElBQUk7QUFDbEIsSUFBSSxDQUFDLFdBQVc7QUFD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QyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLHlCQUF5QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBNEssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQXVELENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBNS9SLElBQUlBLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxFQUFFLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNQLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDQSxHQUFDLENBQUMsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUF5RSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPWSxHQUFDLENBQUMsVUFBVSxDQUFDLE9BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBdUcsU0FBU0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0wsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFrRCxTQUFTYyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNiLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDTyxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQXlOLFNBQVMsQ0FBQyxFQUFFLENBQUNFLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNiLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNQLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDSixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYyxHQUFDLENBQUMsQ0FBQ2QsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZSxHQUFDLENBQUMsQ0FBQ2YsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUdGLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUVELEdBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUVDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1YsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FB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QUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxJQUFJQyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ELEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFQSxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsQ0FBb1QsSUFBSUMsR0FBQyxDQUFDM1QsQ0FBQyxDQUFDLEdBQUcsQ0FBK0tBLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDMlQsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBSSxJQUFpUkMsR0FBQyxDQUFDNVQsQ0FBQyxDQUFDLElBQUksU0FBUzZULEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ04sR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQ00sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPMVQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUNKLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM0VCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJRixDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNELEdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDelQsQ0FBQyxDQUFDc1QsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJSyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUlMLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDeEYsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDd0YsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBb2UsSUFBSUMsR0FBQyxDQUFDLGtPQUFrTyxDQUFDTixDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxJQUFJTyxHQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLENBQTZNLElBQUksQ0FBQyxDQUFDalUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSWtVLEdBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQ25VLENBQUMsQ0FBQyxLQUFLLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDaVUsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBR0MsR0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLENBQUMsR0FBRzNGLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUN5RixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJ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
