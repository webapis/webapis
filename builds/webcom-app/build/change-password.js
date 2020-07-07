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

function TextInput(props) {
  const {
    label,
    name,
    type,
    isValid,
    message
  } = props;
  return h("div", {
    className: "form-group p-0"
  }, h("label", {
    for: name
  }, label), h("input", _extends({
    type: type,
    className: `form-control ${isValid && 'is-valid'} ${!isValid && isValid !== undefined && 'is-invalid'}`,
    id: name,
    "aria-describedby": name
  }, props)), !isValid && h("small", {
    id: "emailHelp",
    className: `${!isValid && 'invalid-feedback'}`,
    "data-testid": `message-${name}`
  }, message));
}

function Button(props) {
  const {
    title,
    bg = "light",
    outline,
    size,
    loading = false
  } = props;
  return h("button", _extends({
    className: `${bg && !outline && `btn btn-${bg}`} ${outline && `btn btn-outline-${bg}`} ${size && `btn btn-${size}`}`
  }, props, {
    disabled: loading
  }), loading && h("span", {
    class: "spinner-border spinner-border-sm",
    role: "status",
    "aria-hidden": "true"
  }), loading ? 'wait...' : title);
}

function Alert(props) {
  const {
    alert,
    message
  } = props;
  return h("div", {
    className: `alert alert-${alert}`,
    role: "alert",
    "data-testid": "alert"
  }, message, h("button", {
    type: "button",
    class: "close",
    "data-dismiss": "alert",
    "aria-label": "Close"
  }, h("span", {
    "aria-hidden": "true"
  }, "\xD7")));
}

function ChangePassword(props) {
  const {
    password,
    confirm,
    validation,
    onChange,
    onPasswordChange,
    loading,
    error
  } = props; // useEffect(() => {
  //   let url = new URL(window.location.href);
  //   var urltoken = url.searchParams.get('token');
  //   if (urltoken) {
  //     dispatch(actions.getTokenFromUrl({ token: urltoken }));
  //   }
  // }, []);

  return h("div", {
    className: "col-md-4 border mx-auto rounded",
    style: {
      margin: 15,
      padding: 16
    }
  }, loading && h("div", {
    className: "progress",
    style: "height: 5px;"
  }, h("div", {
    className: "progress-bar progress-bar-striped progress-bar-animated",
    role: "progressbar",
    "aria-valuenow": "100",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    style: "width: 100%"
  })), error && h(Alert, {
    alert: "danger",
    message: error.message
  }), h(TextInput, {
    label: "Password",
    value: password,
    type: "password",
    id: "password",
    name: "password",
    onChange: onChange,
    isValid: validation && validation['password'].isValid,
    message: validation && validation['password'].message
  }), h(TextInput, {
    label: "Confirm",
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    onChange: onChange,
    isValid: validation && validation['confirm'].isValid,
    message: validation && validation['confirm'].message
  }), h(Button, {
    type: "button",
    loading: loading,
    "data-testid": "change-pass-btn",
    onClick: onPasswordChange,
    title: "Change",
    bg: "primary"
  }));
}

var t$1,r$1,u$1,i$1=[],o$1=n.__r,f$1=n.diffed,c$1=n.__c,e$1=n.unmount;function a$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v$1(n){return m$1(x$1,n)}function m$1(n,u,i){var o=a$1(t$1++);return o.__c||(o.__c=r$1,o.__=[i?i(u):x$1(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p$1(n,u){var i=a$1(t$1++);q(i.__H,u)&&(i.__=n,i.__H=u,r$1.__H.__h.push(i));}function s$1(n,r){var u=a$1(t$1++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__;var i=a$1(t$1++);return null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value}function F(){i$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(_$1),t.__H.__h.forEach(g$1),t.__H.__h=[];}catch(r){return t.__H.__h=[],n.__e(r,t.__v),!0}}),i$1=[];}function _$1(n){n.t&&n.t();}function g$1(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o$1&&o$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.__h.forEach(_$1),r$1.__H.__h.forEach(g$1),r$1.__H.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i$1.push(r)&&u$1===n.requestAnimationFrame||((u$1=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_$1),t.__h=t.__h.filter(function(n){return !n.__||g$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c$1&&c$1(t,r);},n.unmount=function(t){e$1&&e$1(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

var actionTypes = {
  VALUE_CHANGED: 'VALUE_CHANGED',
  LOGIN_STARTED: 'LOGIN_STARTED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
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
  RECOVER_LOCAL_AUTH_STATE: 'RECOVER_LOCAL_AUTH_STATE',
  SERVER_ERROR_RECIEVED: 'SERVER_ERROR_RECIEVED',
  CONSTRAINT_VALIDATION: 'CONSTRAINT_VALIDATION'
};

const initState = {
  login: false,
  signup: false,
  changePassword: false,
  requestPassChange: false,
  validation: {
    username: {
      isValid: undefined,
      message: ''
    },
    email: {
      isValid: undefined,
      message: ''
    },
    password: {
      isValid: undefined,
      message: ''
    },
    confirm: {
      isValid: undefined,
      message: ''
    },
    emailorusername: {
      isValid: undefined,
      message: ''
    }
  },
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
  authFeedback: null,
  user: null
};
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes.SERVER_ERROR_RECIEVED:
      return { ...state,
        error: action.error
      };

    case actionTypes.CONSTRAINT_VALIDATION:
      return { ...state,
        validation: { ...state.validation,
          [action.name]: {
            isValid: action.isValid,
            message: action.message
          }
        }
      };

    case actionTypes.VALUE_CHANGED:
      const nextState = { ...state,
        [action.name]: action.value
      };
      return nextState;

    case actionTypes.LOGIN_STARTED:
      return { ...state,
        loading: true,
        login: true
      };

    case actionTypes.LOGIN_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        user: action.user,
        password: ''
      };

    case actionTypes.LOGIN_FAILED:
      return { ...state,
        loading: false,
        login: false
      };

    case actionTypes.SIGNUP_STARTED:
      return { ...state,
        loading: true,
        signup: true
      };

    case actionTypes.SIGNUP_SUCCESS:
      return { ...state,
        loading: false,
        user: action.user,
        password: '',
        signup: false
      };

    case actionTypes.SIGNUP_FAILED:
      return { ...state,
        loading: false,
        signup: false
      };

    case actionTypes.CHANGE_PASSWORD_STARTED:
      return { ...state,
        loading: true,
        changePassword: true
      };

    case actionTypes.CHANGE_PASSWORD_SUCCESS:
      return { ...state,
        loading: false,
        user: action.user,
        changePassword: false
      };

    case actionTypes.CHANGE_PASSWORD_FAILED:
      return { ...state,
        loading: false,
        changePassword: false
      };

    case actionTypes.REQUEST_PASS_CHANGE_STARTED:
      return { ...state,
        loading: true,
        requestPassChange: true
      };

    case actionTypes.REQUEST_PASS_CHANGE_SUCCESS:
      return { ...state,
        loading: false,
        requestPassChange: false
      };

    case actionTypes.REQUEST_PASS_CHANGE_FAILED:
      return { ...state,
        loading: false,
        requestPassChange: false
      };

    case actionTypes.GOT_TOKEN_FROM_URL:
      return { ...state,
        token: action.token
      };

    case actionTypes.LOGOUT:
      return { ...initState
      };

    case actionTypes.RECOVER_LOCAL_AUTH_STATE:
      return { ...state,
        user: action.user
      };

    default:
      return state;
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
  emptyPasswordNotValid: '409',
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

var validationMessages = {
  INVALID_PASSWORD: 'at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, Can contain special characters',
  INVALID_EMAIL: 'email format is not valid',
  EMAIL_NOT_REGISTERED: 'email is not registered',
  USERNAME_NOT_REGISTERED: 'username is not registered',
  INVALID_USERNAME: 'only Letters a-z or A-Z and the Symbols - and _ are allowed',
  INVALID_EMPTY_STRING: 'Required field',
  INVALID_USERNAME_OR_EMAIL: 'email or username is not valid',
  INVALID_CREDENTIALS: 'invalid credentials provided',
  USERNAME_TAKEN: 'username is already taken',
  REGISTERED_EMAIL: 'email is already registered',
  PASSWORDS_DO_NOT_MATCH: 'passwords do not match',
  ACCOUNT_ALREADY_EXISTS: 'Account already exists for this username.',
  REQUIRED_FIELD: 'Required field'
};

function serverValidation({
  status = 0,
  dispatch
}) {
  debugger;

  switch (status) {
    case 101:
    case 200:
    case httpStatus.credentialInvalid:
    case httpStatus.emailIsNotRegistered:
    case httpStatus.emailorusernameNotValid:
    case httpStatus.usernameIsNotRegistered:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'password',
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS
      });
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'emailorusername',
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS
      });
      break;

    case 125:
    case -3:
    case httpStatus.emailInvalid:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'email',
        isValid: false,
        message: validationMessages.INVALID_EMAIL
      });
      break;

    case httpStatus.passwordInvalid:
    case -4:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'password',
        isValid: false,
        message: validationMessages.INVALID_PASSWORD
      });
      break;

    case httpStatus.usernameInvalid:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'username',
        isValid: false,
        message: validationMessages.INVALID_USERNAME
      });
      break;

    case 203:
    case httpStatus.emailIsRegistered:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'email',
        isValid: false,
        message: validationMessages.REGISTERED_EMAIL
      });
      break;

    case 202: //parse

    case httpStatus.usernameIsTaken:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'username',
        isValid: false,
        message: validationMessages.USERNAME_TAKEN
      });
      break;

    case httpStatus.emptyPasswordNotValid:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'password',
        isValid: false,
        message: validationMessages.REQUIRED_FIELD
      });
      break;

    case httpStatus.passwordDoNotMatch:
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'password',
        isValid: false,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH
      });
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: 'confirm',
        isValid: false,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH
      });
      break;

    default:
      return null;
  }
}

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
const usernameRegex = /[a-zA-Z]+[-_]*[a-zA-Z]+/g;

function validateEmailConstraint({
  email
}) {
  const emailConstraint = new RegExp(emailRegex);

  if (emailConstraint.test(email)) {
    return {
      isValid: true,
      message: ''
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_EMAIL
    };
  }
}
function validatePasswordConstraint({
  password
}) {
  const passwordConstraint = new RegExp(passwordRegex);

  if (passwordConstraint.test(password)) {
    return {
      isValid: true,
      message: ''
    };
  } else {
    return {
      isValid: false,
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
      isValid: true,
      message: ''
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_USERNAME
    };
  }
}
function validateEmptyString({
  value
}) {
  if (value.length === 0) {
    return {
      message: validationMessages.REQUIRED_FIELD,
      isValid: false
    };
  } else {
    return {
      message: '',
      isValid: true
    };
  }
}

async function signup({
  dispatch,
  state
}) {
  debugger;
  const {
    username,
    password,
    email
  } = state;

  if (username && password && email && validateUserNameConstraint({
    username
  }) && validateEmailConstraint({
    email
  }) && validatePasswordConstraint({
    password
  })) {
    try {
      debugger; // Create a new instance of the user class

      var user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("email", email);
      let success = await user.signUp();
      window.localStorage.setItem(username, JSON.stringify({
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
        type: actionTypes.SIGNUP_SUCCESS,
        user: {
          username,
          email,
          token: success.get('sessionToken'),
          objectId: success.id
        }
      });
    } catch (error) {
      debugger;
      serverValidation({
        status: error.code,
        dispatch
      });
      dispatch({
        type: actionTypes.SERVER_ERROR_RECIEVED,
        error
      });
      dispatch({
        type: actionTypes.SIGNUP_FAILED
      });
    }
  } else {
    debugger;
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: 'username',
      ...validateUserNameConstraint({
        username
      })
    });
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: 'email',
      ...validateEmailConstraint({
        email
      })
    });
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: 'password',
      ...validatePasswordConstraint({
        password
      })
    });
    dispatch({
      type: actionTypes.SIGNUP_FAILED
    });
  }
}
function login({
  dispatch,
  state
}) {
  const {
    emailorusername,
    password
  } = state;

  if (emailorusername && password) {
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
        type: actionTypes.LOGIN_SUCCESS,
        user: {
          username,
          email,
          token,
          objectId: user.id
        }
      });
      console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
    }).catch(function (error) {
      debugger;
      serverValidation({
        status: error.code,
        dispatch
      });
      dispatch({
        type: actionTypes.SERVER_ERROR_RECIEVED,
        error
      });
      dispatch({
        type: actionTypes.LOGIN_FAILED
      });
    });
  } else {
    //empty emailorusername or password
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: 'emailorusername',
      ...validateEmptyString({
        value: emailorusername
      })
    });
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name: 'password',
      ...validateEmptyString({
        value: password
      })
    });
    dispatch({
      type: actionTypes.LOGIN_FAILED
    });
  }
}
function forgotPassword({
  dispatch,
  state,
  formDispatch
}) {
  dispatch({
    type: actionTypes.REQUEST_PASS_CHANGE_STARTED
  });
  const {
    email
  } = state;
  Parse.User.requestPasswordReset(email).then(function (result) {
    dispatch({
      type: actionTypes.REQUEST_PASS_CHANGE_SUCCESS,
      token: result.token,
      message: `A link for password change  has been sent to, ${email}! `
    });
    console.log("Password reset request was sent successfully");
  }).catch(function (error) {
    // formDispatch(serverValidation({status:error.code}))
    console.log("The login failed with error: " + error.code + " " + error.message);
  });
}

function ParseAuthService({
  children,
  state,
  dispatch
}) {
  const {
    login: login$1,
    signup: signup$1,
    changePassword,
    requestPassChange
  } = state;
  p$1(() => {
    if (login$1) {
      login({
        dispatch,
        state
      });
    }
  }, [login$1]);
  p$1(() => {
    if (signup$1) {
      debugger;
      signup({
        dispatch,
        state
      });
    }
  }, [signup$1]);
  p$1(() => {
    if (requestPassChange) {
      forgotPassword({
        dispatch,
        state
      });
    }
  }, [requestPassChange]);
  return children;
}

function AuthAdapter(props) {
  {
    return h(ParseAuthService, props);
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
  const {
    children
  } = props;
  const [state, dispatch] = m$1(authReducer, initState);
  const value = s$1(() => [state, dispatch], [state]);
  return h(AuthContext.Provider, _extends({
    value: value
  }, props), h(AuthAdapter, {
    state: state,
    dispatch: dispatch
  }, children));
}

function E$1(n,t){for(var e in t)n[e]=t[e];return n}function w$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var C$1=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return w$1(this.props,n)||w$1(this.state,t)},r}(m);var A$1=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),A$1&&A$1(n);};var F$1=n.__e;function N$1(n){return n&&((n=E$1({},n)).__c=null,n.__k=n.__k&&n.__k.map(N$1)),n}function U(){this.__u=0,this.o=null,this.__b=null;}function M$1(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function O(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);F$1(n,t,e);},(U.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=M$1(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},U.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=N$1(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var P$1=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(O.prototype=new m).u=function(n){var t=this,e=M$1(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),P$1(t,n,r)):o();};e?e(u):u();}},O.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},O.prototype.componentDidUpdate=O.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){P$1(n,e,t);});};var W=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var D$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var H$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var Z=n.event;function I(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){Z&&(n=Z(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var $$1={configurable:!0,get:function(){return this.class}},q$1=n.vnode;n.vnode=function(n){n.$$typeof=H$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&($$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",$$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=D$1.test(u))break;if(r)for(u in o=n.props={},e)o[D$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&(I(t.prototype,"componentWillMount"),I(t.prototype,"componentWillReceiveProps"),I(t.prototype,"componentWillUpdate"),t.m=!0);}q$1&&q$1(n);};

const actionTypes$1 = {
  APP_ROUTE_CHANGED: 'APP_ROUTE_CHANGED' //  FEATURE_ROUTE_CHANGED:'FEATURE_ROUTE_CHANGED'

};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes$1.APP_ROUTE_CHANGED:
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
  p$1(() => {
    if (state && state.name && localStorage.getItem(state.name)) {
      const {
        featureRoute,
        route
      } = JSON.parse(localStorage.getItem(state.name));
      dispatch({
        type: actionTypes$1.APP_ROUTE_CHANGED,
        featureRoute,
        route
      });
    }
  }, []);
  const value = s$1(() => [state, dispatch], [state]);
  return h(AppRouteContext.Provider, _extends({
    value: value
  }, props));
}

const ThemeContext = M();

function ThemeProvider(props) {
  const {
    initState
  } = props;
  const [state, setState] = v$1(initState);
  return h(ThemeContext.Provider, _extends({
    value: state
  }, props));
}

function AuthFeedback({
  message,
  children
}) {
  const {
    state
  } = useAuthContext();
  return h("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 300,
      fontSize: 16
    },
    "data-testid": "auth-feedback"
  }, h("div", null, state.authFeedback), h("div", null, " ", children));
}
function LoginLink() {
  return h("div", null, h("a", {
    href: `${api_url}`
  }, "Login"));
}

H(h("div", null, h(AuthProvider, null, h(ThemeProvider, {
  initState: {
    primary: {
      background: '#6200EE',
      color: '#ffffff',
      fontFamily: 'Roboto, Helvetica, "Arial"'
    }
  }
}, h(AppRouteProvider, {
  initState: {
    route: '/',
    featureRoute: '/'
  }
}, h(AppRoute, {
  path: "/"
}, h(ChangePassword, null)), h(AppRoute, {
  path: "/authfeedback"
}, h(AuthFeedback, null, h(LoginLink, null))))))), document.body);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLXBhc3N3b3JkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9kaXN0L3ByZWFjdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy90ZXh0LWlucHV0L2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvY29udHJvbHMvYnV0dG9uL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvY29udHJvbHMvYWxlcnQvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9DaGFuZ2VQYXNzd29yZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdmFsaWRhdGlvbi9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3ZhbGlkYXRpb25NZXNzYWdlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3NlcnZlckVycm9yQWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3ZhbGlkYXRpb25SZWdleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL2NvbnN0cmFpbnRWYWxpZGF0b3JzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3NlcnZpY2VzL3BhcnNlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc2VydmljZXMvcGFyc2UvUGFyc2VBdXRoU2VydmljZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9BdXRoQWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9BdXRoUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2NvbXBhdC9kaXN0L2NvbXBhdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2FwcC1yb3V0ZS9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL3RoZW1lL3RoZW1lLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9BdXRoRmVlZGJhY2suanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vY2hhbmdlLXBhc3N3b3JkL2NoYW5nZS1wYXNzd29yZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3VwcG9ydCA9IHtcbiAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgYmxvYjpcbiAgICAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJlxuICAgICdCbG9iJyBpbiBzZWxmICYmXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG59XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXcob2JqKSB7XG4gIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxufVxuXG5pZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgXVxuXG4gIHZhciBpc0FycmF5QnVmZmVyVmlldyA9XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3IHx8XG4gICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICB9XG4gIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gIH1cbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG4vLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgdmFyIGl0ZXJhdG9yID0ge1xuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXRlcmF0b3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICB0aGlzLm1hcCA9IHt9XG5cbiAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVycykpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgfSwgdGhpcylcbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCAnICsgdmFsdWUgOiB2YWx1ZVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICB9XG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKG5hbWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIGl0ZW1zLnB1c2godmFsdWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbn1cblxuZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgfVxuICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxufVxuXG5mdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgfVxuICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgfVxuICByZXR1cm4gY2hhcnMuam9pbignJylcbn1cblxuZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gIGlmIChidWYuc2xpY2UpIHtcbiAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gIH0gZWxzZSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICB9XG59XG5cbmZ1bmN0aW9uIEJvZHkoKSB7XG4gIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgIGlmICghYm9keSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChib2R5KVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG52YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG5mdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgcmV0dXJuIG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xID8gdXBjYXNlZCA6IG1ldGhvZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgfVxuICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgIHRoaXMuc2lnbmFsID0gaW5wdXQuc2lnbmFsXG4gICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gIH1cblxuICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdzYW1lLW9yaWdpbidcbiAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB9XG4gIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgdGhpcy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbCB8fCB0aGlzLnNpZ25hbFxuICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gIH1cbiAgdGhpcy5faW5pdEJvZHkoYm9keSlcbn1cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHtib2R5OiB0aGlzLl9ib2R5SW5pdH0pXG59XG5cbmZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgYm9keVxuICAgIC50cmltKClcbiAgICAuc3BsaXQoJyYnKVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICByZXR1cm4gZm9ybVxufVxuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgLy8gUmVwbGFjZSBpbnN0YW5jZXMgb2YgXFxyXFxuIGFuZCBcXG4gZm9sbG93ZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlIG9yIGhvcml6b250YWwgdGFiIHdpdGggYSBzcGFjZVxuICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKVxuICBwcmVQcm9jZXNzZWRIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBoZWFkZXJzXG59XG5cbkJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzXG4gIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbn1cblxuQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgIHVybDogdGhpcy51cmxcbiAgfSlcbn1cblxuUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG5SZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbn1cblxuZXhwb3J0IHZhciBET01FeGNlcHRpb24gPSBzZWxmLkRPTUV4Y2VwdGlvblxudHJ5IHtcbiAgbmV3IERPTUV4Y2VwdGlvbigpXG59IGNhdGNoIChlcnIpIHtcbiAgRE9NRXhjZXB0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgbmFtZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdmFyIGVycm9yID0gRXJyb3IobWVzc2FnZSlcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgfVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpXG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBET01FeGNlcHRpb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKGlucHV0LCBpbml0KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICBmdW5jdGlvbiBhYm9ydFhocigpIHtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICB9XG4gICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgfVxuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnb21pdCcpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgfVxuXG4gICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgIH0pXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgIHJlcXVlc3Quc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRE9ORSAoc3VjY2VzcyBvciBmYWlsdXJlKVxuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICByZXF1ZXN0LnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgfSlcbn1cblxuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG5cbmlmICghc2VsZi5mZXRjaCkge1xuICBzZWxmLmZldGNoID0gZmV0Y2hcbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxufVxuIiwidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHAobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHAobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24geSgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBnKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gZyhuKX19ZnVuY3Rpb24gayhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1hKHt9LG8pKS5fX3Y9aSx0PUEoZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmZyhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYscyl7dmFyIGEsaCxwLHksZCxtLGcsaz11JiZ1Ll9fa3x8YyxfPWsubGVuZ3RoO2lmKGY9PWUmJihmPW51bGwhPW8/b1swXTpfP3codSwwKTpudWxsKSxhPTAsbC5fX2s9eChsLl9fayxmdW5jdGlvbih1KXtpZihudWxsIT11KXtpZih1Ll9fPWwsdS5fX2I9bC5fX2IrMSxudWxsPT09KHA9a1thXSl8fHAmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKWtbYV09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPF87aCsrKXtpZigocD1rW2hdKSYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpe2tbaF09dm9pZCAwO2JyZWFrfXA9bnVsbH1pZih5PUEobix1LHA9cHx8ZSxpLHQsbyxyLGYscyksKGg9dS5yZWYpJiZwLnJlZiE9aCYmKGd8fChnPVtdKSxwLnJlZiYmZy5wdXNoKHAucmVmLG51bGwsdSksZy5wdXNoKGgsdS5fX2N8fHksdSkpLG51bGwhPXkpe3ZhciBjO2lmKG51bGw9PW0mJihtPXkpLHZvaWQgMCE9PXUuX19kKWM9dS5fX2QsdS5fX2Q9dm9pZCAwO2Vsc2UgaWYobz09cHx8eSE9Znx8bnVsbD09eS5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWZ8fGYucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZCh5KSxjPW51bGw7ZWxzZXtmb3IoZD1mLGg9MDsoZD1kLm5leHRTaWJsaW5nKSYmaDxfO2grPTIpaWYoZD09eSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKHksZiksYz1mfVwib3B0aW9uXCI9PWwudHlwZSYmKG4udmFsdWU9XCJcIil9Zj12b2lkIDAhPT1jP2M6eS5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGUmJihsLl9fZD1mKX1lbHNlIGYmJnAuX19lPT1mJiZmLnBhcmVudE5vZGUhPW4mJihmPXcocCkpfXJldHVybiBhKyssdX0pLGwuX19lPW0sbnVsbCE9byYmXCJmdW5jdGlvblwiIT10eXBlb2YgbC50eXBlKWZvcihhPW8ubGVuZ3RoO2EtLTspbnVsbCE9b1thXSYmdihvW2FdKTtmb3IoYT1fO2EtLTspbnVsbCE9a1thXSYmRChrW2FdLGtbYV0pO2lmKGcpZm9yKGE9MDthPGcubGVuZ3RoO2ErKylqKGdbYV0sZ1srK2FdLGdbKythXSl9ZnVuY3Rpb24geChuLGwsdSl7aWYobnVsbD09dSYmKHU9W10pLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2YgbilsJiZ1LnB1c2gobChudWxsKSk7ZWxzZSBpZihBcnJheS5pc0FycmF5KG4pKWZvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXgobltpXSxsLHUpO2Vsc2UgdS5wdXNoKGw/bChcInN0cmluZ1wiPT10eXBlb2Ygbnx8XCJudW1iZXJcIj09dHlwZW9mIG4/cChudWxsLG4sbnVsbCxudWxsLG4pOm51bGwhPW4uX19lfHxudWxsIT1uLl9fYz9wKG4udHlwZSxuLnByb3BzLG4ua2V5LG51bGwsbi5fX3YpOm4pOm4pO3JldHVybiB1fWZ1bmN0aW9uIFAobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fE4obixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxOKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gQyhuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PXMudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBOKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fEMobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8QyhvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwseixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwseixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24geihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24gQShsLHUsaSx0LG8scixmLGUsYyl7dmFyIHMsdixoLHAseSx3LGcsayxfLHgsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsocz1uLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoaz11LnByb3BzLF89KHM9UC5jb250ZXh0VHlwZSkmJnRbcy5fX2NdLHg9cz9fP18ucHJvcHMudmFsdWU6cy5fXzp0LGkuX19jP2c9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoayx4KToodS5fX2M9dj1uZXcgbShrLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWssdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoayx2Ll9fcykpKSxwPXYucHJvcHMseT12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmayE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGsseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShrLHYuX19zLHgpfHx1Ll9fdj09PWkuX192JiYhdi5fXyl7Zm9yKHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxzPTA7czx1Ll9fay5sZW5ndGg7cysrKXUuX19rW3NdJiYodS5fX2tbc10uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShrLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUocCx5LHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsKHM9bi5fX3IpJiZzKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxzPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLHUuX19rPW51bGwhPXMmJnMudHlwZT09ZCYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpBcnJheS5pc0FycmF5KHMpP3M6W3NdLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1hKGEoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCx5KSksYihsLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGcmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KHM9bi5kaWZmZWQpJiZzKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIHMsYSx2LGgscCx5PXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihzPTA7czxvLmxlbmd0aDtzKyspaWYobnVsbCE9KGE9b1tzXSkmJigobnVsbD09PWwudHlwZT8zPT09YS5ub2RlVHlwZTphLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PWEpKXtuPWEsb1tzXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXkhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0oeT11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKHk9PT1lKWZvcih5PXt9LHA9MDtwPG4uYXR0cmlidXRlcy5sZW5ndGg7cCsrKXlbbi5hdHRyaWJ1dGVzW3BdLm5hbWVdPW4uYXR0cmlidXRlc1twXS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfVAobixkLHksdCxmKSxsLl9faz1sLnByb3BzLmNoaWxkcmVuLGh8fGIobixsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09ZC52YWx1ZSYmZC52YWx1ZSE9PW4udmFsdWUmJihuLnZhbHVlPW51bGw9PWQudmFsdWU/XCJcIjpkLnZhbHVlKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PWQuY2hlY2tlZCYmZC5jaGVja2VkIT09bi5jaGVja2VkJiYobi5jaGVja2VkPWQuY2hlY2tlZCkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLEEodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOmMuc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXtyZXR1cm4gbD1hKGEoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSxwKG4udHlwZSxsLGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGsobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gayh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksayh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCx5IGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xyXG4gIGNvbnN0IHsgbGFiZWwsIG5hbWUsIHR5cGUsIGlzVmFsaWQsIG1lc3NhZ2UgfSA9IHByb3BzXHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBwLTBcIj5cclxuICAgIDxsYWJlbCBmb3I9e25hbWV9ID57bGFiZWx9PC9sYWJlbD5cclxuICAgIDxpbnB1dCB0eXBlPXt0eXBlfSBjbGFzc05hbWU9e2Bmb3JtLWNvbnRyb2wgJHtpc1ZhbGlkICYmICdpcy12YWxpZCd9ICR7IWlzVmFsaWQgJiYgaXNWYWxpZCAhPT0gdW5kZWZpbmVkICYmICdpcy1pbnZhbGlkJ31gfSBpZD17bmFtZX0gYXJpYS1kZXNjcmliZWRieT17bmFtZX17Li4ucHJvcHN9IC8+XHJcbnshaXNWYWxpZCAmJiA8c21hbGwgaWQ9XCJlbWFpbEhlbHBcIiBjbGFzc05hbWU9e2AkeyFpc1ZhbGlkICYmICdpbnZhbGlkLWZlZWRiYWNrJ31gfSBkYXRhLXRlc3RpZD17YG1lc3NhZ2UtJHtuYW1lfWB9PnttZXNzYWdlfTwvc21hbGw+fVxyXG4gIDwvZGl2PlxyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0aXRsZSwgYmc9XCJsaWdodFwiLG91dGxpbmUsIHNpemUsbG9hZGluZz1mYWxzZX0gPSBwcm9wcztcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9IHtgJHtiZyAmJiAhb3V0bGluZSYmYGJ0biBidG4tJHtiZ31gfSAke291dGxpbmUmJmBidG4gYnRuLW91dGxpbmUtJHtiZ31gfSAke3NpemUmJmBidG4gYnRuLSR7c2l6ZX1gfWB9IHsuLi5wcm9wc30gZGlzYWJsZWQ9e2xvYWRpbmd9PlxyXG4gICAgICAgIHtsb2FkaW5nICYmIDxzcGFuIGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc21cIiByb2xlPVwic3RhdHVzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPn0gXHJcbiAgICAgICAgeyBsb2FkaW5nID8gJ3dhaXQuLi4nOnRpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQgKHByb3BzKXtcclxuY29uc3Qge2FsZXJ0LG1lc3NhZ2V9PXByb3BzXHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e2BhbGVydCBhbGVydC0ke2FsZXJ0fWB9IHJvbGU9XCJhbGVydFwiIGRhdGEtdGVzdGlkPVwiYWxlcnRcIj5cclxuICAgIHttZXNzYWdlfVxyXG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XHJcbiAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxyXG4gIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnY29udHJvbHMvYnV0dG9uJztcclxuaW1wb3J0IEFsZXJ0IGZyb20gJ2NvbnRyb2xzL2FsZXJ0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQocHJvcHMpIHtcclxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtLCB2YWxpZGF0aW9uLCBvbkNoYW5nZSwgb25QYXNzd29yZENoYW5nZSwgbG9hZGluZyxlcnJvciB9ID0gcHJvcHM7XHJcblxyXG4gIC8vIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgLy8gICBsZXQgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgLy8gICB2YXIgdXJsdG9rZW4gPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgndG9rZW4nKTtcclxuXHJcbiAgLy8gICBpZiAodXJsdG9rZW4pIHtcclxuICAvLyAgICAgZGlzcGF0Y2goYWN0aW9ucy5nZXRUb2tlbkZyb21VcmwoeyB0b2tlbjogdXJsdG9rZW4gfSkpO1xyXG4gIC8vICAgfVxyXG4gIC8vIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIGxhYmVsPVwiUGFzc3dvcmRcIlxyXG4gICAgICAgIHZhbHVlPXtwYXNzd29yZH1cclxuICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICAgICBpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgbmFtZT0ncGFzc3dvcmQnXHJcbiAgICAgICBcclxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydwYXNzd29yZCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydwYXNzd29yZCddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvPlxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgbGFiZWw9XCJDb25maXJtXCJcclxuICAgICAgICB2YWx1ZT17Y29uZmlybX1cclxuICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICAgICBpZD0nY29uZmlybSdcclxuICAgICAgICBuYW1lPSdjb25maXJtJ1xyXG4gICAgICAgXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnY29uZmlybSddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydjb25maXJtJ10ubWVzc2FnZX1cclxuXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICBkYXRhLXRlc3RpZD0nY2hhbmdlLXBhc3MtYnRuJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uUGFzc3dvcmRDaGFuZ2V9XHJcbiAgICAgICAgdGl0bGU9XCJDaGFuZ2VcIiBiZz1cInByaW1hcnlcIiAvPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCxyLHUsaT1bXSxvPW4uX19yLGY9bi5kaWZmZWQsYz1uLl9fYyxlPW4udW5tb3VudDtmdW5jdGlvbiBhKHQpe24uX19oJiZuLl9faChyKTt2YXIgdT1yLl9fSHx8KHIuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49dS5fXy5sZW5ndGgmJnUuX18ucHVzaCh7fSksdS5fX1t0XX1mdW5jdGlvbiB2KG4pe3JldHVybiBtKHgsbil9ZnVuY3Rpb24gbShuLHUsaSl7dmFyIG89YSh0KyspO3JldHVybiBvLl9fY3x8KG8uX19jPXIsby5fXz1baT9pKHUpOngodm9pZCAwLHUpLGZ1bmN0aW9uKHQpe3ZhciByPW4oby5fX1swXSx0KTtvLl9fWzBdIT09ciYmKG8uX19bMF09cixvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gcChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIGwobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19oLnB1c2goaSkpfWZ1bmN0aW9uIHkobil7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIGQobix0LHIpe2woZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXI/cjpyLmNvbmNhdChuKSl9ZnVuY3Rpb24gcyhuLHIpe3ZhciB1PWEodCsrKTtyZXR1cm4gcSh1Ll9fSCxyKT8odS5fX0g9cix1Ll9faD1uLHUuX189bigpKTp1Ll9ffWZ1bmN0aW9uIGgobix0KXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiBUKG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY107aWYoIXUpcmV0dXJuIG4uX187dmFyIGk9YSh0KyspO3JldHVybiBudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZX1mdW5jdGlvbiB3KHQscil7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUocj9yKHQpOnQpfWZ1bmN0aW9uIEEobil7dmFyIHU9YSh0KyspLGk9digpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7dS5fXyYmdS5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBGKCl7aS5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChfKSx0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2g9W119Y2F0Y2gocil7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZShyLHQuX192KSwhMH19KSxpPVtdfWZ1bmN0aW9uIF8obil7bi50JiZuLnQoKX1mdW5jdGlvbiBnKG4pe3ZhciB0PW4uX18oKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobi50PXQpfWZ1bmN0aW9uIHEobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24geChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe28mJm8obiksdD0wLChyPW4uX19jKS5fX0gmJihyLl9fSC5fX2guZm9yRWFjaChfKSxyLl9fSC5fX2guZm9yRWFjaChnKSxyLl9fSC5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciBvPXIuX19IO28mJm8uX19oLmxlbmd0aCYmKDEhPT1pLnB1c2gocikmJnU9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KCh1PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZShyKSl9KShGKSl9fSxuLl9fYz1mdW5jdGlvbih0LHIpe3Iuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChfKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fGcobil9KX1jYXRjaCh1KXtyLnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSxyPVtdLG4uX19lKHUsdC5fX3YpfX0pLGMmJmModCxyKX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2UmJmUodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIHU9ci5fX0g7aWYodSl0cnl7dS5fXy5mb3JFYWNoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnQmJm4udCgpfSl9Y2F0Y2godCl7bi5fX2UodCxyLl9fdil9fX07ZXhwb3J0e3YgYXMgdXNlU3RhdGUsbSBhcyB1c2VSZWR1Y2VyLHAgYXMgdXNlRWZmZWN0LGwgYXMgdXNlTGF5b3V0RWZmZWN0LHkgYXMgdXNlUmVmLGQgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxzIGFzIHVzZU1lbW8saCBhcyB1c2VDYWxsYmFjayxUIGFzIHVzZUNvbnRleHQsdyBhcyB1c2VEZWJ1Z1ZhbHVlLEEgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcblxyXG4gIFZBTFVFX0NIQU5HRUQ6ICdWQUxVRV9DSEFOR0VEJyxcclxuICBMT0dJTl9TVEFSVEVEOiAnTE9HSU5fU1RBUlRFRCcsXHJcbiAgTE9HSU5fU1VDQ0VTUzogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gIExPR0lOX0ZBSUxFRDogJ0xPR0lOX0ZBSUxFRCcsXHJcblxyXG4gIExPR09VVDogJ0xPR09VVCcsXHJcblxyXG5cclxuICBTSUdOVVBfU1RBUlRFRDogJ1NJR05VUF9TVEFSVEVEJyxcclxuICBTSUdOVVBfU1VDQ0VTUzogJ1NJR05VUF9TVUNDRVNTJyxcclxuICBTSUdOVVBfRkFJTEVEOiAnU0lHTlVQX0ZBSUxFRCcsXHJcblxyXG4gIENIQU5HRV9QQVNTV09SRF9TVEFSVEVEOiAnQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9TVUNDRVNTOiAnQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9GQUlMRUQ6ICdDSEFOR0VfUEFTU1dPUkRfRkFJTEVEJyxcclxuXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQnLFxyXG5cclxuICBHT1RfVE9LRU5fRlJPTV9VUkw6ICdHT1RfVE9LRU5fRlJPTV9VUkwnLFxyXG5cclxuICBSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6ICdSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUnLFxyXG4gIFxyXG4gIFNFUlZFUl9FUlJPUl9SRUNJRVZFRDonU0VSVkVSX0VSUk9SX1JFQ0lFVkVEJyxcclxuXHJcbiAgQ09OU1RSQUlOVF9WQUxJREFUSU9OOidDT05TVFJBSU5UX1ZBTElEQVRJT04nXHJcbn07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBsb2dpbjogZmFsc2UsXHJcbiAgc2lnbnVwOiBmYWxzZSxcclxuICBjaGFuZ2VQYXNzd29yZDogZmFsc2UsXHJcbiAgcmVxdWVzdFBhc3NDaGFuZ2U6IGZhbHNlLFxyXG4gIHZhbGlkYXRpb246IHtcclxuICAgIHVzZXJuYW1lOiB7IGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogJycgfSxcclxuICAgIGVtYWlsOiB7IGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogJycgfSxcclxuICAgIHBhc3N3b3JkOiB7IGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogJycgfSxcclxuICAgIGNvbmZpcm06IHtcclxuICAgICAgaXNWYWxpZDogdW5kZWZpbmVkLCBtZXNzYWdlOiAnJyxcclxuICAgICBcclxuICAgIH0sIGVtYWlsb3J1c2VybmFtZTogeyBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnIH1cclxuICB9LFxyXG4gIGVtYWlsOiAnJyxcclxuICBwYXNzd29yZDogJycsXHJcbiAgc3VjY2VzczogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgdXNlcm5hbWU6ICcnLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGNvbmZpcm06ICcnLFxyXG4gIGN1cnJlbnQ6ICcnLFxyXG4gIGVtYWlsb3J1c2VybmFtZTogJycsXHJcbiAgdG9rZW46IG51bGwsXHJcbiAgYXV0aEZlZWRiYWNrOiBudWxsLFxyXG4gIHVzZXI6IG51bGxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhdXRoUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIGVycm9yOmFjdGlvbi5lcnJvcn1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsaWRhdGlvbjp7Li4uc3RhdGUudmFsaWRhdGlvbiwgW2FjdGlvbi5uYW1lXTogeyBpc1ZhbGlkOiBhY3Rpb24uaXNWYWxpZCwgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UgfSB9fVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VEOlxyXG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgW2FjdGlvbi5uYW1lXTogYWN0aW9uLnZhbHVlLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIGxvZ2luOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyOiBhY3Rpb24udXNlcixcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBsb2dpbjogZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBzaWdudXA6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjogYWN0aW9uLnVzZXIsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHNpZ251cDpmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2Usc2lnbnVwOmZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSwgY2hhbmdlUGFzc3dvcmQ6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjogYWN0aW9uLnVzZXIsXHJcbiAgICAgICAgY2hhbmdlUGFzc3dvcmQ6ZmFsc2VcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLGNoYW5nZVBhc3N3b3JkOmZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIHJlcXVlc3RQYXNzQ2hhbmdlOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICByZXF1ZXN0UGFzc0NoYW5nZTogZmFsc2UsXHJcbiAgICAgXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsICAgcmVxdWVzdFBhc3NDaGFuZ2U6IGZhbHNlLH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHRva2VuOiBhY3Rpb24udG9rZW4gfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HT1VUOlxyXG4gICAgICByZXR1cm4geyAuLi5pbml0U3RhdGUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHVzZXI6IGFjdGlvbi51c2VyXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBhY2NvdW50QWxyZWFkeUV4aXRzOjIwMixcclxuICAvL2xvZ2luXHJcbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxyXG4gIC8vc2lnbnVwXHJcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcclxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXHJcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcclxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxyXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXHJcbiAgLy9sb2dpblxyXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcclxuICBlbXB0eVBhc3N3b3JkTm90VmFsaWQ6ICc0MDknLFxyXG4gIGVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOic0MTAnLFxyXG4gIHVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOic0MTEnLFxyXG4vL2NoYW5nZSBwYXNzd29yZFxyXG4gIHBhc3N3b3JkRG9Ob3RNYXRjaDonNDEyJyxcclxuICB0b2tlbkV4cGlyZWQ6JzQxMycsXHJcbiAgc2VydmVyVmFsaWRhdGlvblJhbmdlOiBzdGF0dXMgPT4ge1xyXG4gICAgaWYgKHN0YXR1cyA+PSA0MDAgJiYgc3RhdHVzIDw9IDQxMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlZBTElEX1BBU1NXT1JEOlxyXG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxyXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FOlxyXG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcclxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ1JlcXVpcmVkIGZpZWxkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMOiAnZW1haWwgb3IgdXNlcm5hbWUgaXMgbm90IHZhbGlkJyxcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICd1c2VybmFtZSBpcyBhbHJlYWR5IHRha2VuJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnZW1haWwgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyxcclxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcsXHJcbiAgQUNDT1VOVF9BTFJFQURZX0VYSVNUUzonQWNjb3VudCBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyB1c2VybmFtZS4nLFxyXG4gIFJFUVVJUkVEX0ZJRUxEOidSZXF1aXJlZCBmaWVsZCdcclxufTtcclxuIiwiXHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4uL3N0YXRlL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzID0gMCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRlYnVnZ2VyXHJcbiAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgIGNhc2UgMTAxOlxyXG4gICAgY2FzZSAyMDA6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuY3JlZGVudGlhbEludmFsaWQ6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMgfSlcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdlbWFpbG9ydXNlcm5hbWUnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDEyNTpcclxuICAgIGNhc2UgLTM6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2VtYWlsJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcclxuICAgIGNhc2UgLTQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3VzZXJuYW1lJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAyMDM6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnZW1haWwnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFR0lTVEVSRURfRU1BSUwgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDIwMjovL3BhcnNlXHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3VzZXJuYW1lJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTiB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVBhc3N3b3JkTm90VmFsaWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFUVVJUkVEX0ZJRUxEIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCB9KVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2NvbmZpcm0nLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0ggfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlthLXpBLVpdKS57OCx9JC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/L2c7XHJcblxyXG5leHBvcnQgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9bYS16QS1aXStbLV9dKlthLXpBLVpdKy9nO1xyXG4iLCJcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkge1xyXG4gIGNvbnN0IHBhc3N3b3JkQ29uc3RyYWludCA9IG5ldyBSZWdFeHAocGFzc3dvcmRSZWdleCk7XHJcbiAgaWYgKHBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuZWxzZXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgXHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgIH07XHJcbiAgXHJcbn19XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuICBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodXNlcm5hbWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgXHJcbiAgICAgIGlzVmFsaWQ6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoeyB2YWx1ZSB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gIFxyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcblxyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pIHtcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID1hdXRoO1xyXG5cclxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nICh7dmFsdWV9KXtcclxuICBpZih2YWx1ZS5sZW5ndGg9PT0wKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRVFVSVJFRF9GSUVMRCxcclxuICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICB9O1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWVzc2FnZTonJyxcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgIH07XHJcbiAgfVxyXG59IiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4uLy4uL3N0YXRlL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHNlcnZlclZhbGlkYXRpb24gZnJvbSAnLi4vLi4vdmFsaWRhdGlvbi9zZXJ2ZXJFcnJvckFjdGlvbnMnXHJcbmltcG9ydCAqIGFzIGN2IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vY29uc3RyYWludFZhbGlkYXRvcnMnXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWdudXAoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCB9ID0gc3RhdGVcclxuICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQgJiYgZW1haWwgJiYgY3YudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSAmJiBjdi52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pICYmIGN2LnZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkpIHtcclxuICAgIHRyeSB7XHJcbmRlYnVnZ2VyO1xyXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHVzZXIgY2xhc3NcclxuICAgICAgdmFyIHVzZXIgPSBuZXcgUGFyc2UuVXNlcigpO1xyXG4gICAgICB1c2VyLnNldChcInVzZXJuYW1lXCIsIHVzZXJuYW1lKTtcclxuICAgICAgdXNlci5zZXQoXCJwYXNzd29yZFwiLCBwYXNzd29yZCk7XHJcbiAgICAgIHVzZXIuc2V0KFwiZW1haWxcIiwgZW1haWwpO1xyXG4gICAgICBsZXQgc3VjY2VzcyA9IGF3YWl0IHVzZXIuc2lnblVwKClcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuOiBzdWNjZXNzLmdldCgnc2Vzc2lvblRva2VuJyksXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgb2JqZWN0SWQ6IHN1Y2Nlc3MuaWRcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgY29uc3QgSGFuZ291dFVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRVc2VyID0gbmV3IEhhbmdvdXRVc2VyKCk7XHJcbiAgICAgIGhhbmdvdXRVc2VyLnNldCgndXNlcm5hbWUnLCB1c2VybmFtZSlcclxuICAgICAgaGFuZ291dFVzZXIuc2V0KCdlbWFpbCcsIGVtYWlsKVxyXG4gICAgICBoYW5nb3V0VXNlci5zZXQoJ3VzZXJpZCcsIHN1Y2Nlc3MuaWQpXHJcbiAgICAgIGF3YWl0IGhhbmdvdXRVc2VyLnNhdmUoKVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTLCB1c2VyOiB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW46IHN1Y2Nlc3MuZ2V0KCdzZXNzaW9uVG9rZW4nKSwgb2JqZWN0SWQ6IHN1Y2Nlc3MuaWQgfSB9KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgZGVidWdnZXJcclxuICAgICAgc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGUsZGlzcGF0Y2h9KVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9FUlJPUl9SRUNJRVZFRCxlcnJvciB9KTtcclxuICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRH0pXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6J3VzZXJuYW1lJywuLi5jdi52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7dXNlcm5hbWV9KX0pXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sbmFtZTonZW1haWwnLC4uLmN2LnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtlbWFpbH0pfSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixuYW1lOidwYXNzd29yZCcsLi4uY3YudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoe3Bhc3N3b3JkfSl9KVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRH0pXHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZVxyXG5cclxuICBpZihlbWFpbG9ydXNlcm5hbWUgJiYgcGFzc3dvcmQpe1xyXG4gICAgZGVidWdnZXJcclxuICAgIC8vIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgdXNlciBjbGFzc1xyXG4gICAgUGFyc2UuVXNlci5sb2dJbihlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgIGxldCB1c2VybmFtZSA9IHVzZXIuZ2V0KFwidXNlcm5hbWVcIilcclxuICAgICAgbGV0IGVtYWlsID0gdXNlci5nZXQoXCJlbWFpbFwiKVxyXG4gICAgICBsZXQgdG9rZW4gPSB1c2VyLmdldCgnc2Vzc2lvblRva2VuJylcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICAgIG9iamVjdElkOiB1c2VyLmlkXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICBcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB1c2VyOiB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4sIG9iamVjdElkOiB1c2VyLmlkIH0gfSlcclxuICAgICAgY29uc29sZS5sb2coJ1VzZXIgY3JlYXRlZCBzdWNjZXNzZnVsIHdpdGggbmFtZTogJyArIHVzZXIuZ2V0KFwidXNlcm5hbWVcIikgKyAnIGFuZCBlbWFpbDogJyArIHVzZXIuZ2V0KFwiZW1haWxcIikpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6ZXJyb3IuY29kZSxkaXNwYXRjaH0pXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVELGVycm9yIH0pO1xyXG4gICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUR9KVxyXG4gICAgfSk7XHJcbiAgfWVsc2V7XHJcbiAgICAvL2VtcHR5IGVtYWlsb3J1c2VybmFtZSBvciBwYXNzd29yZFxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLG5hbWU6J2VtYWlsb3J1c2VybmFtZScsLi4uY3YudmFsaWRhdGVFbXB0eVN0cmluZyh7dmFsdWU6ZW1haWxvcnVzZXJuYW1lfSl9KVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLG5hbWU6J3Bhc3N3b3JkJywuLi5jdi52YWxpZGF0ZUVtcHR5U3RyaW5nKHt2YWx1ZTpwYXNzd29yZH0pfSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRH0pXHJcblxyXG4gIH1cclxuIFxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG5cclxuICBQYXJzZS5Vc2VyLnJlcXVlc3RQYXNzd29yZFJlc2V0KGVtYWlsKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyxcclxuICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgbWVzc2FnZTogYEEgbGluayBmb3IgcGFzc3dvcmQgY2hhbmdlICBoYXMgYmVlbiBzZW50IHRvLCAke2VtYWlsfSEgYCxcclxuICAgIH0pO1xyXG4gICAgY29uc29sZS5sb2coXCJQYXNzd29yZCByZXNldCByZXF1ZXN0IHdhcyBzZW50IHN1Y2Nlc3NmdWxseVwiKTtcclxuICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIC8vIGZvcm1EaXNwYXRjaChzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6ZXJyb3IuY29kZX0pKVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiVGhlIGxvZ2luIGZhaWxlZCB3aXRoIGVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gIH0pO1xyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYXJzZUF1dGhTZXJ2aWNlICh7Y2hpbGRyZW4sc3RhdGUsZGlzcGF0Y2h9KXtcclxuY29uc3QgeyBsb2dpbixzaWdudXAsIGNoYW5nZVBhc3N3b3JkLHJlcXVlc3RQYXNzQ2hhbmdlfSA9c3RhdGVcclxuXHJcbiAgICB1c2VFZmZlY3QoKCk9PntcclxuICAgICAgICBpZihsb2dpbil7XHJcbiAgICAgICAgICAgIGFjdGlvbnMubG9naW4oe2Rpc3BhdGNoLHN0YXRlfSlcclxuICAgICAgICB9XHJcbiAgICB9LFtsb2dpbl0pXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICAgICAgaWYoc2lnbnVwKXtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2lnbnVwKHtkaXNwYXRjaCxzdGF0ZX0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxbc2lnbnVwXSlcclxuXHJcbiAgXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICAgICAgaWYocmVxdWVzdFBhc3NDaGFuZ2Upe1xyXG4gICAgICAgICAgICBhY3Rpb25zLmZvcmdvdFBhc3N3b3JkKHtkaXNwYXRjaCxzdGF0ZX0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxbcmVxdWVzdFBhc3NDaGFuZ2VdKVxyXG4gICAgcmV0dXJuIGNoaWxkcmVuXHJcblxyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBQYXJzZUF1dGhTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL3BhcnNlL1BhcnNlQXV0aFNlcnZpY2UnXHJcbmltcG9ydCBOb2RlQXV0aFNlcmljZSBmcm9tICcuLi9zZXJ2aWNlcy9ub2RlanMvTm9kZUF1dGhTZXJ2aWNlJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoQWRhcHRlciAocHJvcHMpe1xyXG4gICAgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfUEFSU0UnKSB7XHJcbiAgICAgICAgcmV0dXJuIDxQYXJzZUF1dGhTZXJ2aWNlIHsuLi5wcm9wc30gLz5cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfTk9ERUpTJykge1xyXG4gICAgICAgIHJldHVybiA8Tm9kZUF1dGhTZXJpY2Ugey4uLnByb3BzfSAvPlxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsXHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XHJcbmltcG9ydCBBdXRoQWRhcHRlciBmcm9tICcuL0F1dGhBZGFwdGVyJ1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XHJcbiAgICAgIDxBdXRoQWRhcHRlciBzdGF0ZT17c3RhdGV9IGRpc3BhdGNoPXtkaXNwYXRjaH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgPC9BdXRoQWRhcHRlcj5cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiIsImltcG9ydHt1c2VTdGF0ZSBhcyBuLHVzZVJlZHVjZXIgYXMgdCx1c2VFZmZlY3QgYXMgZSx1c2VMYXlvdXRFZmZlY3QgYXMgcix1c2VSZWYgYXMgbyx1c2VJbXBlcmF0aXZlSGFuZGxlIGFzIHUsdXNlTWVtbyBhcyBpLHVzZUNhbGxiYWNrIGFzIGYsdXNlQ29udGV4dCBhcyBjLHVzZURlYnVnVmFsdWUgYXMgYX1mcm9tXCJwcmVhY3QvaG9va3NcIjtleHBvcnQqZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e0NvbXBvbmVudCBhcyBsLGNyZWF0ZUVsZW1lbnQgYXMgcyxvcHRpb25zIGFzIHYsdG9DaGlsZEFycmF5IGFzIGgsaHlkcmF0ZSBhcyBwLHJlbmRlciBhcyBkLF91bm1vdW50IGFzIG0sY2xvbmVFbGVtZW50IGFzIHksY3JlYXRlUmVmIGFzIGIsY3JlYXRlQ29udGV4dCBhcyBnLEZyYWdtZW50IGFzIHh9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2NyZWF0ZUVsZW1lbnQsY3JlYXRlQ29udGV4dCxjcmVhdGVSZWYsRnJhZ21lbnQsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2Z1bmN0aW9uIEUobix0KXtmb3IodmFyIGUgaW4gdCluW2VdPXRbZV07cmV0dXJuIG59ZnVuY3Rpb24gdyhuLHQpe2Zvcih2YXIgZSBpbiBuKWlmKFwiX19zb3VyY2VcIiE9PWUmJiEoZSBpbiB0KSlyZXR1cm4hMDtmb3IodmFyIHIgaW4gdClpZihcIl9fc291cmNlXCIhPT1yJiZuW3JdIT09dFtyXSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgQz1mdW5jdGlvbihuKXt2YXIgdCxlO2Z1bmN0aW9uIHIodCl7dmFyIGU7cmV0dXJuKGU9bi5jYWxsKHRoaXMsdCl8fHRoaXMpLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwLGV9cmV0dXJuIGU9biwodD1yKS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Ll9fcHJvdG9fXz1lLHIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuLHQpe3JldHVybiB3KHRoaXMucHJvcHMsbil8fHcodGhpcy5zdGF0ZSx0KX0scn0obCk7ZnVuY3Rpb24gXyhuLHQpe2Z1bmN0aW9uIGUobil7dmFyIGU9dGhpcy5wcm9wcy5yZWYscj1lPT1uLnJlZjtyZXR1cm4hciYmZSYmKGUuY2FsbD9lKG51bGwpOmUuY3VycmVudD1udWxsKSx0PyF0KHRoaXMucHJvcHMsbil8fCFyOncodGhpcy5wcm9wcyxuKX1mdW5jdGlvbiByKHQpe3JldHVybiB0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1lLHMobixFKHt9LHQpKX1yZXR1cm4gci5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD0hMCxyLmRpc3BsYXlOYW1lPVwiTWVtbyhcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIixyLnQ9ITAscn12YXIgQT12Ll9fYjtmdW5jdGlvbiBTKG4pe2Z1bmN0aW9uIHQodCl7dmFyIGU9RSh7fSx0KTtyZXR1cm4gZGVsZXRlIGUucmVmLG4oZSx0LnJlZil9cmV0dXJuIHQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9dC50PSEwLHQuZGlzcGxheU5hbWU9XCJGb3J3YXJkUmVmKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHR9di5fX2I9ZnVuY3Rpb24obil7bi50eXBlJiZuLnR5cGUudCYmbi5yZWYmJihuLnByb3BzLnJlZj1uLnJlZixuLnJlZj1udWxsKSxBJiZBKG4pfTt2YXIgaz1mdW5jdGlvbihuLHQpe3JldHVybiBuP2gobikucmVkdWNlKGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gbi5jb25jYXQodChlLHIpKX0sW10pOm51bGx9LFI9e21hcDprLGZvckVhY2g6ayxjb3VudDpmdW5jdGlvbihuKXtyZXR1cm4gbj9oKG4pLmxlbmd0aDowfSxvbmx5OmZ1bmN0aW9uKG4pe2lmKDEhPT0obj1oKG4pKS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuXCIpO3JldHVybiBuWzBdfSx0b0FycmF5Omh9LEY9di5fX2U7ZnVuY3Rpb24gTihuKXtyZXR1cm4gbiYmKChuPUUoe30sbikpLl9fYz1udWxsLG4uX19rPW4uX19rJiZuLl9fay5tYXAoTikpLG59ZnVuY3Rpb24gVSgpe3RoaXMuX191PTAsdGhpcy5vPW51bGwsdGhpcy5fX2I9bnVsbH1mdW5jdGlvbiBNKG4pe3ZhciB0PW4uX18uX19jO3JldHVybiB0JiZ0LnUmJnQudShuKX1mdW5jdGlvbiBMKG4pe3ZhciB0LGUscjtmdW5jdGlvbiBvKG8pe2lmKHR8fCh0PW4oKSkudGhlbihmdW5jdGlvbihuKXtlPW4uZGVmYXVsdHx8bn0sZnVuY3Rpb24obil7cj1ufSkscil0aHJvdyByO2lmKCFlKXRocm93IHQ7cmV0dXJuIHMoZSxvKX1yZXR1cm4gby5kaXNwbGF5TmFtZT1cIkxhenlcIixvLnQ9ITAsb31mdW5jdGlvbiBPKCl7dGhpcy5pPW51bGwsdGhpcy5sPW51bGx9di5fX2U9ZnVuY3Rpb24obix0LGUpe2lmKG4udGhlbilmb3IodmFyIHIsbz10O289by5fXzspaWYoKHI9by5fX2MpJiZyLl9fYylyZXR1cm4gci5fX2Mobix0Ll9fYyk7RihuLHQsZSl9LChVLnByb3RvdHlwZT1uZXcgbCkuX19jPWZ1bmN0aW9uKG4sdCl7dmFyIGU9dGhpcztudWxsPT1lLm8mJihlLm89W10pLGUuby5wdXNoKHQpO3ZhciByPU0oZS5fX3YpLG89ITEsdT1mdW5jdGlvbigpe298fChvPSEwLHI/cihpKTppKCkpfTt0Ll9fYz10LmNvbXBvbmVudFdpbGxVbm1vdW50LHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1KCksdC5fX2MmJnQuX19jKCl9O3ZhciBpPWZ1bmN0aW9uKCl7dmFyIG47aWYoIS0tZS5fX3UpZm9yKGUuX192Ll9fa1swXT1lLnN0YXRlLnUsZS5zZXRTdGF0ZSh7dTplLl9fYj1udWxsfSk7bj1lLm8ucG9wKCk7KW4uZm9yY2VVcGRhdGUoKX07ZS5fX3UrK3x8ZS5zZXRTdGF0ZSh7dTplLl9fYj1lLl9fdi5fX2tbMF19KSxuLnRoZW4odSx1KX0sVS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMuX19iJiYodGhpcy5fX3YuX19rWzBdPU4odGhpcy5fX2IpLHRoaXMuX19iPW51bGwpLFtzKGwsbnVsbCx0LnU/bnVsbDpuLmNoaWxkcmVuKSx0LnUmJm4uZmFsbGJhY2tdfTt2YXIgUD1mdW5jdGlvbihuLHQsZSl7aWYoKytlWzFdPT09ZVswXSYmbi5sLmRlbGV0ZSh0KSxuLnByb3BzLnJldmVhbE9yZGVyJiYoXCJ0XCIhPT1uLnByb3BzLnJldmVhbE9yZGVyWzBdfHwhbi5sLnNpemUpKWZvcihlPW4uaTtlOyl7Zm9yKDtlLmxlbmd0aD4zOyllLnBvcCgpKCk7aWYoZVsxXTxlWzBdKWJyZWFrO24uaT1lPWVbMl19fTsoTy5wcm90b3R5cGU9bmV3IGwpLnU9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcyxlPU0odC5fX3YpLHI9dC5sLmdldChuKTtyZXR1cm4gclswXSsrLGZ1bmN0aW9uKG8pe3ZhciB1PWZ1bmN0aW9uKCl7dC5wcm9wcy5yZXZlYWxPcmRlcj8oci5wdXNoKG8pLFAodCxuLHIpKTpvKCl9O2U/ZSh1KTp1KCl9fSxPLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obil7dGhpcy5pPW51bGwsdGhpcy5sPW5ldyBNYXA7dmFyIHQ9aChuLmNoaWxkcmVuKTtuLnJldmVhbE9yZGVyJiZcImJcIj09PW4ucmV2ZWFsT3JkZXJbMF0mJnQucmV2ZXJzZSgpO2Zvcih2YXIgZT10Lmxlbmd0aDtlLS07KXRoaXMubC5zZXQodFtlXSx0aGlzLmk9WzEsMCx0aGlzLmldKTtyZXR1cm4gbi5jaGlsZHJlbn0sTy5wcm90b3R5cGUuY29tcG9uZW50RGlkVXBkYXRlPU8ucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50PWZ1bmN0aW9uKCl7dmFyIG49dGhpcztuLmwuZm9yRWFjaChmdW5jdGlvbih0LGUpe1AobixlLHQpfSl9O3ZhciBXPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe312YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0fSx0LnJlbmRlcj1mdW5jdGlvbihuKXtyZXR1cm4gbi5jaGlsZHJlbn0sbn0oKTtmdW5jdGlvbiBqKG4pe3ZhciB0PXRoaXMsZT1uLmNvbnRhaW5lcixyPXMoVyx7Y29udGV4dDp0LmNvbnRleHR9LG4udm5vZGUpO3JldHVybiB0LnMmJnQucyE9PWUmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpLHQucD0hMSksbi52bm9kZT90LnA/KGUuX19rPXQuX19rLGQocixlKSx0Ll9faz1lLl9fayk6KHQudj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSxwKFwiXCIsZSksZS5hcHBlbmRDaGlsZCh0LnYpLHQucD0hMCx0LnM9ZSxkKHIsZSx0LnYpLHQuX19rPXQudi5fX2spOnQucCYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCkpLHQuaD1yLHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpfSxudWxsfWZ1bmN0aW9uIHoobix0KXtyZXR1cm4gcyhqLHt2bm9kZTpuLGNvbnRhaW5lcjp0fSl9dmFyIEQ9L14oPzphY2NlbnR8YWxpZ25tZW50fGFyYWJpY3xiYXNlbGluZXxjYXB8Y2xpcCg/IVBhdGhVKXxjb2xvcnxmaWxsfGZsb29kfGZvbnR8Z2x5cGgoPyFSKXxob3JpenxtYXJrZXIoPyFIfFd8VSl8b3ZlcmxpbmV8cGFpbnR8c3RvcHxzdHJpa2V0aHJvdWdofHN0cm9rZXx0ZXh0KD8hTCl8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZWN0b3J8dmVydHx3b3JkfHdyaXRpbmd8eCg/IUMpKVtBLVpdLztsLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXt9O3ZhciBIPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpfHw2MDEwMztmdW5jdGlvbiBUKG4sdCxlKXtpZihudWxsPT10Ll9faylmb3IoO3QuZmlyc3RDaGlsZDspdC5yZW1vdmVDaGlsZCh0LmZpcnN0Q2hpbGQpO3JldHVybiBkKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH1mdW5jdGlvbiBWKG4sdCxlKXtyZXR1cm4gcChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9dmFyIFo9di5ldmVudDtmdW5jdGlvbiBJKG4sdCl7bltcIlVOU0FGRV9cIit0XSYmIW5bdF0mJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLHQse2NvbmZpZ3VyYWJsZTohMSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tcIlVOU0FGRV9cIit0XX0sc2V0OmZ1bmN0aW9uKG4pe3RoaXNbXCJVTlNBRkVfXCIrdF09bn19KX12LmV2ZW50PWZ1bmN0aW9uKG4pe1omJihuPVoobikpLG4ucGVyc2lzdD1mdW5jdGlvbigpe307dmFyIHQ9ITEsZT0hMSxyPW4uc3RvcFByb3BhZ2F0aW9uO24uc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7ci5jYWxsKG4pLHQ9ITB9O3ZhciBvPW4ucHJldmVudERlZmF1bHQ7cmV0dXJuIG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtvLmNhbGwobiksZT0hMH0sbi5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1mdW5jdGlvbigpe3JldHVybiB0fSxuLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBlfSxuLm5hdGl2ZUV2ZW50PW59O3ZhciAkPXtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xhc3N9fSxxPXYudm5vZGU7di52bm9kZT1mdW5jdGlvbihuKXtuLiQkdHlwZW9mPUg7dmFyIHQ9bi50eXBlLGU9bi5wcm9wcztpZih0KXtpZihlLmNsYXNzIT1lLmNsYXNzTmFtZSYmKCQuZW51bWVyYWJsZT1cImNsYXNzTmFtZVwiaW4gZSxudWxsIT1lLmNsYXNzTmFtZSYmKGUuY2xhc3M9ZS5jbGFzc05hbWUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiY2xhc3NOYW1lXCIsJCkpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpe3ZhciByLG8sdTtmb3IodSBpbiBlLmRlZmF1bHRWYWx1ZSYmdm9pZCAwIT09ZS52YWx1ZSYmKGUudmFsdWV8fDA9PT1lLnZhbHVlfHwoZS52YWx1ZT1lLmRlZmF1bHRWYWx1ZSksZGVsZXRlIGUuZGVmYXVsdFZhbHVlKSxBcnJheS5pc0FycmF5KGUudmFsdWUpJiZlLm11bHRpcGxlJiZcInNlbGVjdFwiPT09dCYmKGgoZS5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbihuKXstMSE9ZS52YWx1ZS5pbmRleE9mKG4ucHJvcHMudmFsdWUpJiYobi5wcm9wcy5zZWxlY3RlZD0hMCl9KSxkZWxldGUgZS52YWx1ZSksZSlpZihyPUQudGVzdCh1KSlicmVhaztpZihyKWZvcih1IGluIG89bi5wcm9wcz17fSxlKW9bRC50ZXN0KHUpP3UucmVwbGFjZSgvW0EtWjAtOV0vLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCk6dV09ZVt1XX0hZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlLHI9bi5wcm9wcztpZihyJiZcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIG89e307Zm9yKHZhciB1IGluIHIpL15vbihBbml8VHJhfFRvdSkvLnRlc3QodSkmJihyW3UudG9Mb3dlckNhc2UoKV09clt1XSxkZWxldGUgclt1XSksb1t1LnRvTG93ZXJDYXNlKCldPXU7aWYoby5vbmRvdWJsZWNsaWNrJiYoci5vbmRibGNsaWNrPXJbby5vbmRvdWJsZWNsaWNrXSxkZWxldGUgcltvLm9uZG91YmxlY2xpY2tdKSxvLm9uYmVmb3JlaW5wdXQmJihyLm9uYmVmb3JlaW5wdXQ9cltvLm9uYmVmb3JlaW5wdXRdLGRlbGV0ZSByW28ub25iZWZvcmVpbnB1dF0pLG8ub25jaGFuZ2UmJihcInRleHRhcmVhXCI9PT1lfHxcImlucHV0XCI9PT1lLnRvTG93ZXJDYXNlKCkmJiEvXmZpbHxjaGV8cmEvaS50ZXN0KHIudHlwZSkpKXt2YXIgaT1vLm9uaW5wdXR8fFwib25pbnB1dFwiO3JbaV18fChyW2ldPXJbby5vbmNoYW5nZV0sZGVsZXRlIHJbby5vbmNoYW5nZV0pfX19KCksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmIXQubSYmdC5wcm90b3R5cGUmJihJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbE1vdW50XCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzXCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsVXBkYXRlXCIpLHQubT0hMCl9cSYmcShuKX07dmFyIEI9XCIxNi44LjBcIjtmdW5jdGlvbiBHKG4pe3JldHVybiBzLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBKKG4pe3JldHVybiEhbiYmbi4kJHR5cGVvZj09PUh9ZnVuY3Rpb24gSyhuKXtyZXR1cm4gSihuKT95LmFwcGx5KG51bGwsYXJndW1lbnRzKTpufWZ1bmN0aW9uIFEobil7cmV0dXJuISFuLl9fayYmKGQobnVsbCxuKSwhMCl9ZnVuY3Rpb24gWChuKXtyZXR1cm4gbiYmKG4uYmFzZXx8MT09PW4ubm9kZVR5cGUmJm4pfHxudWxsfXZhciBZPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4odCl9O2V4cG9ydCBkZWZhdWx0e3VzZVN0YXRlOm4sdXNlUmVkdWNlcjp0LHVzZUVmZmVjdDplLHVzZUxheW91dEVmZmVjdDpyLHVzZVJlZjpvLHVzZUltcGVyYXRpdmVIYW5kbGU6dSx1c2VNZW1vOmksdXNlQ2FsbGJhY2s6Zix1c2VDb250ZXh0OmMsdXNlRGVidWdWYWx1ZTphLHZlcnNpb246XCIxNi44LjBcIixDaGlsZHJlbjpSLHJlbmRlcjpULGh5ZHJhdGU6VCx1bm1vdW50Q29tcG9uZW50QXROb2RlOlEsY3JlYXRlUG9ydGFsOnosY3JlYXRlRWxlbWVudDpzLGNyZWF0ZUNvbnRleHQ6ZyxjcmVhdGVGYWN0b3J5OkcsY2xvbmVFbGVtZW50OkssY3JlYXRlUmVmOmIsRnJhZ21lbnQ6eCxpc1ZhbGlkRWxlbWVudDpKLGZpbmRET01Ob2RlOlgsQ29tcG9uZW50OmwsUHVyZUNvbXBvbmVudDpDLG1lbW86Xyxmb3J3YXJkUmVmOlMsdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXM6WSxTdXNwZW5zZTpVLFN1c3BlbnNlTGlzdDpPLGxhenk6TH07ZXhwb3J0e0IgYXMgdmVyc2lvbixSIGFzIENoaWxkcmVuLFQgYXMgcmVuZGVyLFYgYXMgaHlkcmF0ZSxRIGFzIHVubW91bnRDb21wb25lbnRBdE5vZGUseiBhcyBjcmVhdGVQb3J0YWwsRyBhcyBjcmVhdGVGYWN0b3J5LEsgYXMgY2xvbmVFbGVtZW50LEogYXMgaXNWYWxpZEVsZW1lbnQsWCBhcyBmaW5kRE9NTm9kZSxDIGFzIFB1cmVDb21wb25lbnQsXyBhcyBtZW1vLFMgYXMgZm9yd2FyZFJlZixZIGFzIHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzLFUgYXMgU3VzcGVuc2UsTyBhcyBTdXNwZW5zZUxpc3QsTCBhcyBsYXp5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBhdC5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcclxuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXHJcbiAgLy8gIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByb3V0ZTogYWN0aW9uLnJvdXRlLGZlYXR1cmVSb3V0ZTogYWN0aW9uLmZlYXR1cmVSb3V0ZSB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVJlZHVjZXIsdXNlTWVtbywgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHtyZWR1Y2VyfSBmcm9tICcuL3JlZHVjZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmNvbnN0IEFwcFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbiBmdW5jdGlvbiB1c2VBcHBSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwUm91dGVDb250ZXh0KTtcclxuICBcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZVJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtmZWF0dXJlUm91dGV9PXN0YXRlXHJcblxyXG4gIGlmIChwYXRoICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aCkge1xyXG5cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gZmVhdHVyZVJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwUm91dGUgKCl7XHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VBcHBSb3V0ZUNvbnRleHQoKVxyXG4gIGNvbnN0IHtuYW1lfT1zdGF0ZVxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgaWYobmFtZSl7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG5hbWUsSlNPTi5zdHJpbmdpZnkoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pKVxyXG4gICAgfVxyXG4gICBcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtvbkFwcFJvdXRlfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge3JvdXRlfT1zdGF0ZVxyXG4gIGlmIChwYXRoICYmIHJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiByb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gcm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcbiAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICBpZihzdGF0ZSAmJiBzdGF0ZS5uYW1lICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpKXtcclxuIFxyXG4gICAgICAgIGNvbnN0IHtmZWF0dXJlUm91dGUscm91dGV9PSBKU09OLnBhcnNlKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdGF0ZS5uYW1lKSlcclxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICAgIH1cclxuXHJcbiAgfSxbXSlcclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24nO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoRmVlZGJhY2soeyBtZXNzYWdlLCBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICBoZWlnaHQ6IDMwMCxcclxuICAgICAgICBmb250U2l6ZTogMTYsXHJcbiAgICAgIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPSdhdXRoLWZlZWRiYWNrJ1xyXG4gICAgPlxyXG4gICAgICA8ZGl2PntzdGF0ZS5hdXRoRmVlZGJhY2t9PC9kaXY+XHJcblxyXG4gICAgICA8ZGl2PiB7Y2hpbGRyZW59PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTG9naW5MaW5rKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8YSBocmVmPXtgJHthcGlfdXJsfWB9PkxvZ2luPC9hPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgJ3doYXR3Zy1mZXRjaCc7XHJcbmltcG9ydCB7IGgsIHJlbmRlciB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICcuLi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkJztcclxuaW1wb3J0ICBBdXRoUHJvdmlkZXIgIGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uJztcclxuXHJcbmltcG9ydCBBcHBSb3V0ZVByb3ZpZGVyLHsgQXBwUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5pbXBvcnQgIFRoZW1lUHJvdmlkZXIgIGZyb20gJ2NvbXBvbmVudHMvdGhlbWUvdGhlbWUtY29udGV4dCc7XHJcbmltcG9ydCBBdXRoRmVlZGJhY2ssIHsgTG9naW5MaW5rIH0gZnJvbSAnLi4vdWktY29tcG9uZW50cy9BdXRoRmVlZGJhY2snO1xyXG5yZW5kZXIoXHJcbiAgPGRpdj5cclxuXHJcbiAgICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgICAgPFRoZW1lUHJvdmlkZXJcclxuICAgICAgICAgIGluaXRTdGF0ZT17e1xyXG4gICAgICAgICAgICBwcmltYXJ5OiB7XHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyM2MjAwRUUnLFxyXG4gICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgSGVsdmV0aWNhLCBcIkFyaWFsXCInLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8QXBwUm91dGVQcm92aWRlciBpbml0U3RhdGU9e3tyb3V0ZTonLycsZmVhdHVyZVJvdXRlOicvJ319PlxyXG4gICAgICAgICAgICA8QXBwUm91dGUgcGF0aD0nLyc+XHJcbiAgICAgICAgICAgICAgPENoYW5nZVBhc3N3b3JkIC8+XHJcbiAgICAgICAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPScvYXV0aGZlZWRiYWNrJz5cclxuICAgICAgICAgICAgICA8QXV0aEZlZWRiYWNrPlxyXG4gICAgICAgICAgICAgICAgPExvZ2luTGluayAvPlxyXG4gICAgICAgICAgICAgIDwvQXV0aEZlZWRiYWNrPlxyXG4gICAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gICAgICAgIDwvVGhlbWVQcm92aWRlcj5cclxuICAgICAgPC9BdXRoUHJvdmlkZXI+XHJcblxyXG4gIDwvZGl2PixcclxuICBkb2N1bWVudC5ib2R5XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJUZXh0SW5wdXQiLCJwcm9wcyIsImxhYmVsIiwibmFtZSIsInR5cGUiLCJpc1ZhbGlkIiwibWVzc2FnZSIsInVuZGVmaW5lZCIsIkJ1dHRvbiIsInRpdGxlIiwiYmciLCJvdXRsaW5lIiwic2l6ZSIsImxvYWRpbmciLCJBbGVydCIsImFsZXJ0IiwiQ2hhbmdlUGFzc3dvcmQiLCJwYXNzd29yZCIsImNvbmZpcm0iLCJ2YWxpZGF0aW9uIiwib25DaGFuZ2UiLCJvblBhc3N3b3JkQ2hhbmdlIiwiZXJyb3IiLCJtYXJnaW4iLCJwYWRkaW5nIiwidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJWQUxVRV9DSEFOR0VEIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJMT0dJTl9GQUlMRUQiLCJMT0dPVVQiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJTRVJWRVJfRVJST1JfUkVDSUVWRUQiLCJDT05TVFJBSU5UX1ZBTElEQVRJT04iLCJpbml0U3RhdGUiLCJsb2dpbiIsInNpZ251cCIsImNoYW5nZVBhc3N3b3JkIiwicmVxdWVzdFBhc3NDaGFuZ2UiLCJ1c2VybmFtZSIsImVtYWlsIiwiZW1haWxvcnVzZXJuYW1lIiwic3VjY2VzcyIsImN1cnJlbnQiLCJ0b2tlbiIsImF1dGhGZWVkYmFjayIsInVzZXIiLCJhdXRoUmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwiYWN0aW9uVHlwZXMiLCJuZXh0U3RhdGUiLCJ2YWx1ZSIsImFjY291bnRBbHJlYWR5RXhpdHMiLCJjcmVkZW50aWFsSW52YWxpZCIsInVzZXJuYW1lSXNUYWtlbiIsImVtYWlsSXNSZWdpc3RlcmVkIiwidXNlcm5hbWVJbnZhbGlkIiwicGFzc3dvcmRJbnZhbGlkIiwiZW1haWxJbnZhbGlkIiwiZW1haWxJc05vdFJlZ2lzdGVyZWQiLCJlbXB0eVBhc3N3b3JkTm90VmFsaWQiLCJlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZCIsInVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkIiwicGFzc3dvcmREb05vdE1hdGNoIiwidG9rZW5FeHBpcmVkIiwic2VydmVyVmFsaWRhdGlvblJhbmdlIiwic3RhdHVzIiwiSU5WQUxJRF9QQVNTV09SRCIsIklOVkFMSURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJQQVNTV09SRFNfRE9fTk9UX01BVENIIiwiQUNDT1VOVF9BTFJFQURZX0VYSVNUUyIsIlJFUVVJUkVEX0ZJRUxEIiwic2VydmVyVmFsaWRhdGlvbiIsImRpc3BhdGNoIiwiaHR0cFN0YXR1cyIsInZhbGlkYXRpb25NZXNzYWdlcyIsInBhc3N3b3JkUmVnZXgiLCJlbWFpbFJlZ2V4IiwidXNlcm5hbWVSZWdleCIsInZhbGlkYXRlRW1haWxDb25zdHJhaW50IiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtcHR5U3RyaW5nIiwibGVuZ3RoIiwiY3YiLCJQYXJzZSIsIlVzZXIiLCJzZXQiLCJzaWduVXAiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldCIsIm9iamVjdElkIiwiaWQiLCJIYW5nb3V0VXNlciIsIk9iamVjdCIsImV4dGVuZCIsImhhbmdvdXRVc2VyIiwic2F2ZSIsImNvZGUiLCJsb2dJbiIsInRoZW4iLCJjb25zb2xlIiwibG9nIiwiY2F0Y2giLCJmb3Jnb3RQYXNzd29yZCIsImZvcm1EaXNwYXRjaCIsInJlcXVlc3RQYXNzd29yZFJlc2V0IiwicmVzdWx0IiwiUGFyc2VBdXRoU2VydmljZSIsImNoaWxkcmVuIiwidXNlRWZmZWN0IiwiYWN0aW9ucyIsIkF1dGhBZGFwdGVyIiwiQXV0aENvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiQXV0aFByb3ZpZGVyIiwidXNlUmVkdWNlciIsInVzZU1lbW8iLCJFIiwidyIsIkMiLCJsIiwiQSIsIkYiLCJOIiwiTSIsIlAiLCJoIiwiRCIsIkgiLCIkIiwicSIsIkFQUF9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwidXNlQXBwUm91dGVDb250ZXh0IiwiQXBwUm91dGUiLCJwYXRoIiwicGF0aHMiLCJmaW5kIiwiQXBwUm91dGVQcm92aWRlciIsImdldEl0ZW0iLCJwYXJzZSIsIlRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJzZXRTdGF0ZSIsInVzZVN0YXRlIiwiQXV0aEZlZWRiYWNrIiwiZGlzcGxheSIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsImhlaWdodCIsImZvbnRTaXplIiwiTG9naW5MaW5rIiwiYXBpX3VybCIsInJlbmRlciIsInByaW1hcnkiLCJiYWNrZ3JvdW5kIiwiY29sb3IiLCJmb250RmFtaWx5IiwiZG9jdW1lbnQiLCJib2R5Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE9BQU8sR0FBRztBQUNkLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixJQUFJLElBQUk7QUFDekMsRUFBRSxRQUFRLEVBQUUsUUFBUSxJQUFJLElBQUksSUFBSSxVQUFVLElBQUksTUFBTTtBQUNwRCxFQUFFLElBQUk7QUFDTixJQUFJLFlBQVksSUFBSSxJQUFJO0FBQ3hCLElBQUksTUFBTSxJQUFJLElBQUk7QUFDbEIsSUFBSSxDQUFDLFdBQVc7QUFDaEIsTUFBTSxJQUFJO0FBQ1YsUUFBUSxJQUFJLElBQUksR0FBRTtBQUNsQixRQUFRLE9BQU8sSUFBSTtBQUNuQixPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDbEIsUUFBUSxPQUFPLEtBQUs7QUFDcEIsT0FBTztBQUNQLEtBQUssR0FBRztBQUNSLEVBQUUsUUFBUSxFQUFFLFVBQVUsSUFBSSxJQUFJO0FBQzlCLEVBQUUsV0FBVyxFQUFFLGFBQWEsSUFBSSxJQUFJO0FBQ3BDLEVBQUM7QUFDRDtBQUNBLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUN6QixFQUFFLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztBQUNyRCxDQUFDO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7QUFDekIsRUFBRSxJQUFJLFdBQVcsR0FBRztBQUNwQixJQUFJLG9CQUFvQjtBQUN4QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLDRCQUE0QjtBQUNoQyxJQUFJLHFCQUFxQjtBQUN6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QUFDcEIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQU87QUFDeEIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQU87QUFDeEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVE7QUFDMUI7O0FDbmdCRyxJQUFDLENBQUMsQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDhEQUE4RCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLHlCQUF5QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBNEssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQXVELENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENB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LENBQUMsQ0FBQyxHQUFHLENBQUNQLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDQSxHQUFDLENBQUMsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUF3TyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQzs7QUNBN3RFLGtCQUFlO0FBRWJVLEVBQUFBLGFBQWEsRUFBRSxlQUZGO0FB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QUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlDLEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0QsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUVBLEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNFLENBQUMsQ0FBQyxDQUFvVCxJQUFJQyxHQUFDLENBQUN4SSxDQUFDLENBQUMsR0FBRyxDQUErS0EsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUN3SSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFJLElBQWlSQyxHQUFDLENBQUN6SSxDQUFDLENBQUMsSUFBSSxTQUFTMEksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDTixHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDTSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQW1MLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMzSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDeUksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUYsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ3RJLENBQUMsQ0FBQ21JLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSUssR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJTCxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFvZSxJQUFJRSxHQUFDLENBQUMsa09BQWtPLENBQUNQLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLElBQUlRLEdBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBNk0sSUFBSSxDQUFDLENBQUMvSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJZ0osR0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDakosQ0FBQyxDQUFDLEtBQUssQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMrSSxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHQyxHQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsQ0FBQyxHQUFHSCxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFF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
