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

var t$1,r$1,u$1,i$1=[],o$1=n.__r,f$1=n.diffed,c$1=n.__c,e$1=n.unmount;function a$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v$1(n){return m$1(x$1,n)}function m$1(n,u,i){var o=a$1(t$1++);return o.__c||(o.__c=r$1,o.__=[i?i(u):x$1(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p$1(n,u){var i=a$1(t$1++);q(i.__H,u)&&(i.__=n,i.__H=u,r$1.__H.__h.push(i));}function s$1(n,r){var u=a$1(t$1++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__;var i=a$1(t$1++);return null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value}function F(){i$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(_$1),t.__H.__h.forEach(g$1),t.__H.__h=[];}catch(r){return t.__H.__h=[],n.__e(r,t.__v),!0}}),i$1=[];}function _$1(n){n.t&&n.t();}function g$1(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o$1&&o$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.__h.forEach(_$1),r$1.__H.__h.forEach(g$1),r$1.__H.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i$1.push(r)&&u$1===n.requestAnimationFrame||((u$1=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_$1),t.__h=t.__h.filter(function(n){return !n.__||g$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c$1&&c$1(t,r);},n.unmount=function(t){e$1&&e$1(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFoundation = /** @class */ (function () {
    function MDCFoundation(adapter) {
        if (adapter === void 0) { adapter = {}; }
        this.adapter_ = adapter;
    }
    Object.defineProperty(MDCFoundation, "cssClasses", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports every
            // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
            return {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "strings", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
            return {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "numbers", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
            return {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "defaultAdapter", {
        get: function () {
            // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
            // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
            // validation.
            return {};
        },
        enumerable: true,
        configurable: true
    });
    MDCFoundation.prototype.init = function () {
        // Subclasses should override this method to perform initialization routines (registering events, etc.)
    };
    MDCFoundation.prototype.destroy = function () {
        // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
    };
    return MDCFoundation;
}());

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCComponent = /** @class */ (function () {
    function MDCComponent(root, foundation) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.root_ = root;
        this.initialize.apply(this, __spread(args));
        // Note that we initialize foundation here and not within the constructor's default param so that
        // this.root_ is defined and can be used within the foundation class.
        this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;
        this.foundation_.init();
        this.initialSyncWithDOM();
    }
    MDCComponent.attachTo = function (root) {
        // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
        // returns an instantiated component with its root set to that element. Also note that in the cases of
        // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
        // from getDefaultFoundation().
        return new MDCComponent(root, new MDCFoundation({}));
    };
    /* istanbul ignore next: method param only exists for typing purposes; it does not need to be unit tested */
    MDCComponent.prototype.initialize = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        // Subclasses can override this to do any additional setup work that would be considered part of a
        // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
        // initialized. Any additional arguments besides root and foundation will be passed in here.
    };
    MDCComponent.prototype.getDefaultFoundation = function () {
        // Subclasses must override this method to return a properly configured foundation class for the
        // component.
        throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' +
            'foundation class');
    };
    MDCComponent.prototype.initialSyncWithDOM = function () {
        // Subclasses should override this method if they need to perform work to synchronize with a host DOM
        // object. An example of this would be a form control wrapper that needs to synchronize its internal state
        // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
        // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
    };
    MDCComponent.prototype.destroy = function () {
        // Subclasses may implement this method to release any resources / deregister any listeners they have
        // attached. An example of this might be deregistering a resize event from the window object.
        this.foundation_.destroy();
    };
    MDCComponent.prototype.listen = function (evtType, handler, options) {
        this.root_.addEventListener(evtType, handler, options);
    };
    MDCComponent.prototype.unlisten = function (evtType, handler, options) {
        this.root_.removeEventListener(evtType, handler, options);
    };
    /**
     * Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
     */
    MDCComponent.prototype.emit = function (evtType, evtData, shouldBubble) {
        if (shouldBubble === void 0) { shouldBubble = false; }
        var evt;
        if (typeof CustomEvent === 'function') {
            evt = new CustomEvent(evtType, {
                bubbles: shouldBubble,
                detail: evtData,
            });
        }
        else {
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(evtType, shouldBubble, false, evtData);
        }
        this.root_.dispatchEvent(evt);
    };
    return MDCComponent;
}());

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * Determine whether the current browser supports passive event listeners, and
 * if so, use them.
 */
function applyPassive(globalObj) {
    if (globalObj === void 0) { globalObj = window; }
    return supportsPassiveOption(globalObj) ?
        { passive: true } :
        false;
}
function supportsPassiveOption(globalObj) {
    if (globalObj === void 0) { globalObj = window; }
    // See
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    var passiveSupported = false;
    try {
        var options = {
            // This function will be called when the browser
            // attempts to access the passive property.
            get passive() {
                passiveSupported = true;
                return false;
            }
        };
        var handler = function () { };
        globalObj.document.addEventListener('test', handler, options);
        globalObj.document.removeEventListener('test', handler, options);
    }
    catch (err) {
        passiveSupported = false;
    }
    return passiveSupported;
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function matches(element, selector) {
    var nativeMatches = element.matches
        || element.webkitMatchesSelector
        || element.msMatchesSelector;
    return nativeMatches.call(element, selector);
}
/**
 * Used to compute the estimated scroll width of elements. When an element is
 * hidden due to display: none; being applied to a parent element, the width is
 * returned as 0. However, the element will have a true width once no longer
 * inside a display: none context. This method computes an estimated width when
 * the element is hidden or returns the true width when the element is visble.
 * @param {Element} element the element whose width to estimate
 */
function estimateScrollWidth(element) {
    // Check the offsetParent. If the element inherits display: none from any
    // parent, the offsetParent property will be null (see
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
    // This check ensures we only clone the node when necessary.
    var htmlEl = element;
    if (htmlEl.offsetParent !== null) {
        return htmlEl.scrollWidth;
    }
    var clone = htmlEl.cloneNode(true);
    clone.style.setProperty('position', 'absolute');
    clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
    document.documentElement.appendChild(clone);
    var scrollWidth = clone.scrollWidth;
    document.documentElement.removeChild(clone);
    return scrollWidth;
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses = {
    LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',
    LABEL_SHAKE: 'mdc-floating-label--shake',
    ROOT: 'mdc-floating-label',
};

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFloatingLabelFoundation = /** @class */ (function (_super) {
    __extends(MDCFloatingLabelFoundation, _super);
    function MDCFloatingLabelFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCFloatingLabelFoundation.defaultAdapter), adapter)) || this;
        _this.shakeAnimationEndHandler_ = function () { return _this.handleShakeAnimationEnd_(); };
        return _this;
    }
    Object.defineProperty(MDCFloatingLabelFoundation, "cssClasses", {
        get: function () {
            return cssClasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCFloatingLabelFoundation, "defaultAdapter", {
        /**
         * See {@link MDCFloatingLabelAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                getWidth: function () { return 0; },
                registerInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCFloatingLabelFoundation.prototype.init = function () {
        this.adapter_.registerInteractionHandler('animationend', this.shakeAnimationEndHandler_);
    };
    MDCFloatingLabelFoundation.prototype.destroy = function () {
        this.adapter_.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler_);
    };
    /**
     * Returns the width of the label element.
     */
    MDCFloatingLabelFoundation.prototype.getWidth = function () {
        return this.adapter_.getWidth();
    };
    /**
     * Styles the label to produce a shake animation to indicate an error.
     * @param shouldShake If true, adds the shake CSS class; otherwise, removes shake class.
     */
    MDCFloatingLabelFoundation.prototype.shake = function (shouldShake) {
        var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
        if (shouldShake) {
            this.adapter_.addClass(LABEL_SHAKE);
        }
        else {
            this.adapter_.removeClass(LABEL_SHAKE);
        }
    };
    /**
     * Styles the label to float or dock.
     * @param shouldFloat If true, adds the float CSS class; otherwise, removes float and shake classes to dock the label.
     */
    MDCFloatingLabelFoundation.prototype.float = function (shouldFloat) {
        var _a = MDCFloatingLabelFoundation.cssClasses, LABEL_FLOAT_ABOVE = _a.LABEL_FLOAT_ABOVE, LABEL_SHAKE = _a.LABEL_SHAKE;
        if (shouldFloat) {
            this.adapter_.addClass(LABEL_FLOAT_ABOVE);
        }
        else {
            this.adapter_.removeClass(LABEL_FLOAT_ABOVE);
            this.adapter_.removeClass(LABEL_SHAKE);
        }
    };
    MDCFloatingLabelFoundation.prototype.handleShakeAnimationEnd_ = function () {
        var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
        this.adapter_.removeClass(LABEL_SHAKE);
    };
    return MDCFloatingLabelFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFloatingLabel = /** @class */ (function (_super) {
    __extends(MDCFloatingLabel, _super);
    function MDCFloatingLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCFloatingLabel.attachTo = function (root) {
        return new MDCFloatingLabel(root);
    };
    /**
     * Styles the label to produce the label shake for errors.
     * @param shouldShake If true, shakes the label by adding a CSS class; otherwise, stops shaking by removing the class.
     */
    MDCFloatingLabel.prototype.shake = function (shouldShake) {
        this.foundation_.shake(shouldShake);
    };
    /**
     * Styles the label to float/dock.
     * @param shouldFloat If true, floats the label by adding a CSS class; otherwise, docks it by removing the class.
     */
    MDCFloatingLabel.prototype.float = function (shouldFloat) {
        this.foundation_.float(shouldFloat);
    };
    MDCFloatingLabel.prototype.getWidth = function () {
        return this.foundation_.getWidth();
    };
    MDCFloatingLabel.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            getWidth: function () { return estimateScrollWidth(_this.root_); },
            registerInteractionHandler: function (evtType, handler) {
                return _this.listen(evtType, handler);
            },
            deregisterInteractionHandler: function (evtType, handler) {
                return _this.unlisten(evtType, handler);
            },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCFloatingLabelFoundation(adapter);
    };
    return MDCFloatingLabel;
}(MDCComponent));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$1 = {
    LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',
    LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating',
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCLineRippleFoundation = /** @class */ (function (_super) {
    __extends(MDCLineRippleFoundation, _super);
    function MDCLineRippleFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCLineRippleFoundation.defaultAdapter), adapter)) || this;
        _this.transitionEndHandler_ = function (evt) { return _this.handleTransitionEnd(evt); };
        return _this;
    }
    Object.defineProperty(MDCLineRippleFoundation, "cssClasses", {
        get: function () {
            return cssClasses$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCLineRippleFoundation, "defaultAdapter", {
        /**
         * See {@link MDCLineRippleAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                setStyle: function () { return undefined; },
                registerEventHandler: function () { return undefined; },
                deregisterEventHandler: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCLineRippleFoundation.prototype.init = function () {
        this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);
    };
    MDCLineRippleFoundation.prototype.destroy = function () {
        this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);
    };
    MDCLineRippleFoundation.prototype.activate = function () {
        this.adapter_.removeClass(cssClasses$1.LINE_RIPPLE_DEACTIVATING);
        this.adapter_.addClass(cssClasses$1.LINE_RIPPLE_ACTIVE);
    };
    MDCLineRippleFoundation.prototype.setRippleCenter = function (xCoordinate) {
        this.adapter_.setStyle('transform-origin', xCoordinate + "px center");
    };
    MDCLineRippleFoundation.prototype.deactivate = function () {
        this.adapter_.addClass(cssClasses$1.LINE_RIPPLE_DEACTIVATING);
    };
    MDCLineRippleFoundation.prototype.handleTransitionEnd = function (evt) {
        // Wait for the line ripple to be either transparent or opaque
        // before emitting the animation end event
        var isDeactivating = this.adapter_.hasClass(cssClasses$1.LINE_RIPPLE_DEACTIVATING);
        if (evt.propertyName === 'opacity') {
            if (isDeactivating) {
                this.adapter_.removeClass(cssClasses$1.LINE_RIPPLE_ACTIVE);
                this.adapter_.removeClass(cssClasses$1.LINE_RIPPLE_DEACTIVATING);
            }
        }
    };
    return MDCLineRippleFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCLineRipple = /** @class */ (function (_super) {
    __extends(MDCLineRipple, _super);
    function MDCLineRipple() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCLineRipple.attachTo = function (root) {
        return new MDCLineRipple(root);
    };
    /**
     * Activates the line ripple
     */
    MDCLineRipple.prototype.activate = function () {
        this.foundation_.activate();
    };
    /**
     * Deactivates the line ripple
     */
    MDCLineRipple.prototype.deactivate = function () {
        this.foundation_.deactivate();
    };
    /**
     * Sets the transform origin given a user's click location.
     * The `rippleCenter` is the x-coordinate of the middle of the ripple.
     */
    MDCLineRipple.prototype.setRippleCenter = function (xCoordinate) {
        this.foundation_.setRippleCenter(xCoordinate);
    };
    MDCLineRipple.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            setStyle: function (propertyName, value) { return _this.root_.style.setProperty(propertyName, value); },
            registerEventHandler: function (evtType, handler) { return _this.listen(evtType, handler); },
            deregisterEventHandler: function (evtType, handler) { return _this.unlisten(evtType, handler); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCLineRippleFoundation(adapter);
    };
    return MDCLineRipple;
}(MDCComponent));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings = {
    NOTCH_ELEMENT_SELECTOR: '.mdc-notched-outline__notch',
};
var numbers = {
    // This should stay in sync with $mdc-notched-outline-padding * 2.
    NOTCH_ELEMENT_PADDING: 8,
};
var cssClasses$2 = {
    NO_LABEL: 'mdc-notched-outline--no-label',
    OUTLINE_NOTCHED: 'mdc-notched-outline--notched',
    OUTLINE_UPGRADED: 'mdc-notched-outline--upgraded',
};

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCNotchedOutlineFoundation = /** @class */ (function (_super) {
    __extends(MDCNotchedOutlineFoundation, _super);
    function MDCNotchedOutlineFoundation(adapter) {
        return _super.call(this, __assign(__assign({}, MDCNotchedOutlineFoundation.defaultAdapter), adapter)) || this;
    }
    Object.defineProperty(MDCNotchedOutlineFoundation, "strings", {
        get: function () {
            return strings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "cssClasses", {
        get: function () {
            return cssClasses$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "numbers", {
        get: function () {
            return numbers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "defaultAdapter", {
        /**
         * See {@link MDCNotchedOutlineAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                setNotchWidthProperty: function () { return undefined; },
                removeNotchWidthProperty: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds the outline notched selector and updates the notch width calculated based off of notchWidth.
     */
    MDCNotchedOutlineFoundation.prototype.notch = function (notchWidth) {
        var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
        if (notchWidth > 0) {
            notchWidth += numbers.NOTCH_ELEMENT_PADDING; // Add padding from left/right.
        }
        this.adapter_.setNotchWidthProperty(notchWidth);
        this.adapter_.addClass(OUTLINE_NOTCHED);
    };
    /**
     * Removes notched outline selector to close the notch in the outline.
     */
    MDCNotchedOutlineFoundation.prototype.closeNotch = function () {
        var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
        this.adapter_.removeClass(OUTLINE_NOTCHED);
        this.adapter_.removeNotchWidthProperty();
    };
    return MDCNotchedOutlineFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCNotchedOutline = /** @class */ (function (_super) {
    __extends(MDCNotchedOutline, _super);
    function MDCNotchedOutline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCNotchedOutline.attachTo = function (root) {
        return new MDCNotchedOutline(root);
    };
    MDCNotchedOutline.prototype.initialSyncWithDOM = function () {
        this.notchElement_ = this.root_.querySelector(strings.NOTCH_ELEMENT_SELECTOR);
        var label = this.root_.querySelector('.' + MDCFloatingLabelFoundation.cssClasses.ROOT);
        if (label) {
            label.style.transitionDuration = '0s';
            this.root_.classList.add(cssClasses$2.OUTLINE_UPGRADED);
            requestAnimationFrame(function () {
                label.style.transitionDuration = '';
            });
        }
        else {
            this.root_.classList.add(cssClasses$2.NO_LABEL);
        }
    };
    /**
     * Updates classes and styles to open the notch to the specified width.
     * @param notchWidth The notch width in the outline.
     */
    MDCNotchedOutline.prototype.notch = function (notchWidth) {
        this.foundation_.notch(notchWidth);
    };
    /**
     * Updates classes and styles to close the notch.
     */
    MDCNotchedOutline.prototype.closeNotch = function () {
        this.foundation_.closeNotch();
    };
    MDCNotchedOutline.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            setNotchWidthProperty: function (width) { return _this.notchElement_.style.setProperty('width', width + 'px'); },
            removeNotchWidthProperty: function () { return _this.notchElement_.style.removeProperty('width'); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCNotchedOutlineFoundation(adapter);
    };
    return MDCNotchedOutline;
}(MDCComponent));

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$3 = {
    // Ripple is a special case where the "root" component is really a "mixin" of sorts,
    // given that it's an 'upgrade' to an existing component. That being said it is the root
    // CSS class that all other CSS classes derive from.
    BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
    FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
    FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
    ROOT: 'mdc-ripple-upgraded',
    UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
};
var strings$1 = {
    VAR_FG_SCALE: '--mdc-ripple-fg-scale',
    VAR_FG_SIZE: '--mdc-ripple-fg-size',
    VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
    VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
    VAR_LEFT: '--mdc-ripple-left',
    VAR_TOP: '--mdc-ripple-top',
};
var numbers$1 = {
    DEACTIVATION_TIMEOUT_MS: 225,
    FG_DEACTIVATION_MS: 150,
    INITIAL_ORIGIN_SCALE: 0.6,
    PADDING: 10,
    TAP_DELAY_MS: 300,
};

/**
 * Stores result from supportsCssVariables to avoid redundant processing to
 * detect CSS custom variable support.
 */
var supportsCssVariables_;
function supportsCssVariables(windowObj, forceRefresh) {
    if (forceRefresh === void 0) { forceRefresh = false; }
    var CSS = windowObj.CSS;
    var supportsCssVars = supportsCssVariables_;
    if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
        return supportsCssVariables_;
    }
    var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
    if (!supportsFunctionPresent) {
        return false;
    }
    var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
    // See: https://bugs.webkit.org/show_bug.cgi?id=154669
    // See: README section on Safari
    var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
        CSS.supports('color', '#00000000'));
    supportsCssVars =
        explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
    if (!forceRefresh) {
        supportsCssVariables_ = supportsCssVars;
    }
    return supportsCssVars;
}
function getNormalizedEventCoords(evt, pageOffset, clientRect) {
    if (!evt) {
        return { x: 0, y: 0 };
    }
    var x = pageOffset.x, y = pageOffset.y;
    var documentX = x + clientRect.left;
    var documentY = y + clientRect.top;
    var normalizedX;
    var normalizedY;
    // Determine touch point relative to the ripple container.
    if (evt.type === 'touchstart') {
        var touchEvent = evt;
        normalizedX = touchEvent.changedTouches[0].pageX - documentX;
        normalizedY = touchEvent.changedTouches[0].pageY - documentY;
    }
    else {
        var mouseEvent = evt;
        normalizedX = mouseEvent.pageX - documentX;
        normalizedY = mouseEvent.pageY - documentY;
    }
    return { x: normalizedX, y: normalizedY };
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// Activation events registered on the root element of each instance for activation
var ACTIVATION_EVENT_TYPES = [
    'touchstart', 'pointerdown', 'mousedown', 'keydown',
];
// Deactivation events registered on documentElement when a pointer-related down event occurs
var POINTER_DEACTIVATION_EVENT_TYPES = [
    'touchend', 'pointerup', 'mouseup', 'contextmenu',
];
// simultaneous nested activations
var activatedTargets = [];
var MDCRippleFoundation = /** @class */ (function (_super) {
    __extends(MDCRippleFoundation, _super);
    function MDCRippleFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
        _this.activationAnimationHasEnded_ = false;
        _this.activationTimer_ = 0;
        _this.fgDeactivationRemovalTimer_ = 0;
        _this.fgScale_ = '0';
        _this.frame_ = { width: 0, height: 0 };
        _this.initialSize_ = 0;
        _this.layoutFrame_ = 0;
        _this.maxRadius_ = 0;
        _this.unboundedCoords_ = { left: 0, top: 0 };
        _this.activationState_ = _this.defaultActivationState_();
        _this.activationTimerCallback_ = function () {
            _this.activationAnimationHasEnded_ = true;
            _this.runDeactivationUXLogicIfReady_();
        };
        _this.activateHandler_ = function (e) { return _this.activate_(e); };
        _this.deactivateHandler_ = function () { return _this.deactivate_(); };
        _this.focusHandler_ = function () { return _this.handleFocus(); };
        _this.blurHandler_ = function () { return _this.handleBlur(); };
        _this.resizeHandler_ = function () { return _this.layout(); };
        return _this;
    }
    Object.defineProperty(MDCRippleFoundation, "cssClasses", {
        get: function () {
            return cssClasses$3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "strings", {
        get: function () {
            return strings$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "numbers", {
        get: function () {
            return numbers$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClass: function () { return undefined; },
                browserSupportsCssVars: function () { return true; },
                computeBoundingRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                containsEventTarget: function () { return true; },
                deregisterDocumentInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                deregisterResizeHandler: function () { return undefined; },
                getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                isSurfaceActive: function () { return true; },
                isSurfaceDisabled: function () { return true; },
                isUnbounded: function () { return true; },
                registerDocumentInteractionHandler: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
                registerResizeHandler: function () { return undefined; },
                removeClass: function () { return undefined; },
                updateCssVariable: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCRippleFoundation.prototype.init = function () {
        var _this = this;
        var supportsPressRipple = this.supportsPressRipple_();
        this.registerRootHandlers_(supportsPressRipple);
        if (supportsPressRipple) {
            var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter_.addClass(ROOT_1);
                if (_this.adapter_.isUnbounded()) {
                    _this.adapter_.addClass(UNBOUNDED_1);
                    // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                    _this.layoutInternal_();
                }
            });
        }
    };
    MDCRippleFoundation.prototype.destroy = function () {
        var _this = this;
        if (this.supportsPressRipple_()) {
            if (this.activationTimer_) {
                clearTimeout(this.activationTimer_);
                this.activationTimer_ = 0;
                this.adapter_.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
            }
            if (this.fgDeactivationRemovalTimer_) {
                clearTimeout(this.fgDeactivationRemovalTimer_);
                this.fgDeactivationRemovalTimer_ = 0;
                this.adapter_.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
            }
            var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter_.removeClass(ROOT_2);
                _this.adapter_.removeClass(UNBOUNDED_2);
                _this.removeCssVars_();
            });
        }
        this.deregisterRootHandlers_();
        this.deregisterDeactivationHandlers_();
    };
    /**
     * @param evt Optional event containing position information.
     */
    MDCRippleFoundation.prototype.activate = function (evt) {
        this.activate_(evt);
    };
    MDCRippleFoundation.prototype.deactivate = function () {
        this.deactivate_();
    };
    MDCRippleFoundation.prototype.layout = function () {
        var _this = this;
        if (this.layoutFrame_) {
            cancelAnimationFrame(this.layoutFrame_);
        }
        this.layoutFrame_ = requestAnimationFrame(function () {
            _this.layoutInternal_();
            _this.layoutFrame_ = 0;
        });
    };
    MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
        var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
        if (unbounded) {
            this.adapter_.addClass(UNBOUNDED);
        }
        else {
            this.adapter_.removeClass(UNBOUNDED);
        }
    };
    MDCRippleFoundation.prototype.handleFocus = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);
        });
    };
    MDCRippleFoundation.prototype.handleBlur = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);
        });
    };
    /**
     * We compute this property so that we are not querying information about the client
     * until the point in time where the foundation requests it. This prevents scenarios where
     * client-side feature-detection may happen too early, such as when components are rendered on the server
     * and then initialized at mount time on the client.
     */
    MDCRippleFoundation.prototype.supportsPressRipple_ = function () {
        return this.adapter_.browserSupportsCssVars();
    };
    MDCRippleFoundation.prototype.defaultActivationState_ = function () {
        return {
            activationEvent: undefined,
            hasDeactivationUXRun: false,
            isActivated: false,
            isProgrammatic: false,
            wasActivatedByPointer: false,
            wasElementMadeActive: false,
        };
    };
    /**
     * supportsPressRipple Passed from init to save a redundant function call
     */
    MDCRippleFoundation.prototype.registerRootHandlers_ = function (supportsPressRipple) {
        var _this = this;
        if (supportsPressRipple) {
            ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter_.registerInteractionHandler(evtType, _this.activateHandler_);
            });
            if (this.adapter_.isUnbounded()) {
                this.adapter_.registerResizeHandler(this.resizeHandler_);
            }
        }
        this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
        this.adapter_.registerInteractionHandler('blur', this.blurHandler_);
    };
    MDCRippleFoundation.prototype.registerDeactivationHandlers_ = function (evt) {
        var _this = this;
        if (evt.type === 'keydown') {
            this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);
        }
        else {
            POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter_.registerDocumentInteractionHandler(evtType, _this.deactivateHandler_);
            });
        }
    };
    MDCRippleFoundation.prototype.deregisterRootHandlers_ = function () {
        var _this = this;
        ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
            _this.adapter_.deregisterInteractionHandler(evtType, _this.activateHandler_);
        });
        this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
        this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);
        if (this.adapter_.isUnbounded()) {
            this.adapter_.deregisterResizeHandler(this.resizeHandler_);
        }
    };
    MDCRippleFoundation.prototype.deregisterDeactivationHandlers_ = function () {
        var _this = this;
        this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);
        POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
            _this.adapter_.deregisterDocumentInteractionHandler(evtType, _this.deactivateHandler_);
        });
    };
    MDCRippleFoundation.prototype.removeCssVars_ = function () {
        var _this = this;
        var rippleStrings = MDCRippleFoundation.strings;
        var keys = Object.keys(rippleStrings);
        keys.forEach(function (key) {
            if (key.indexOf('VAR_') === 0) {
                _this.adapter_.updateCssVariable(rippleStrings[key], null);
            }
        });
    };
    MDCRippleFoundation.prototype.activate_ = function (evt) {
        var _this = this;
        if (this.adapter_.isSurfaceDisabled()) {
            return;
        }
        var activationState = this.activationState_;
        if (activationState.isActivated) {
            return;
        }
        // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
        var previousActivationEvent = this.previousActivationEvent_;
        var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
        if (isSameInteraction) {
            return;
        }
        activationState.isActivated = true;
        activationState.isProgrammatic = evt === undefined;
        activationState.activationEvent = evt;
        activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
        var hasActivatedChild = evt !== undefined && activatedTargets.length > 0 && activatedTargets.some(function (target) { return _this.adapter_.containsEventTarget(target); });
        if (hasActivatedChild) {
            // Immediately reset activation state, while preserving logic that prevents touch follow-on events
            this.resetActivationState_();
            return;
        }
        if (evt !== undefined) {
            activatedTargets.push(evt.target);
            this.registerDeactivationHandlers_(evt);
        }
        activationState.wasElementMadeActive = this.checkElementMadeActive_(evt);
        if (activationState.wasElementMadeActive) {
            this.animateActivation_();
        }
        requestAnimationFrame(function () {
            // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
            activatedTargets = [];
            if (!activationState.wasElementMadeActive
                && evt !== undefined
                && (evt.key === ' ' || evt.keyCode === 32)) {
                // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                // active states inconsistently when they're called within event handling code:
                // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                // variable is set within a rAF callback for a submit button interaction (#2241).
                activationState.wasElementMadeActive = _this.checkElementMadeActive_(evt);
                if (activationState.wasElementMadeActive) {
                    _this.animateActivation_();
                }
            }
            if (!activationState.wasElementMadeActive) {
                // Reset activation state immediately if element was not made active.
                _this.activationState_ = _this.defaultActivationState_();
            }
        });
    };
    MDCRippleFoundation.prototype.checkElementMadeActive_ = function (evt) {
        return (evt !== undefined && evt.type === 'keydown') ? this.adapter_.isSurfaceActive() : true;
    };
    MDCRippleFoundation.prototype.animateActivation_ = function () {
        var _this = this;
        var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
        var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
        var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
        this.layoutInternal_();
        var translateStart = '';
        var translateEnd = '';
        if (!this.adapter_.isUnbounded()) {
            var _c = this.getFgTranslationCoordinates_(), startPoint = _c.startPoint, endPoint = _c.endPoint;
            translateStart = startPoint.x + "px, " + startPoint.y + "px";
            translateEnd = endPoint.x + "px, " + endPoint.y + "px";
        }
        this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
        this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
        // Cancel any ongoing activation/deactivation animations
        clearTimeout(this.activationTimer_);
        clearTimeout(this.fgDeactivationRemovalTimer_);
        this.rmBoundedActivationClasses_();
        this.adapter_.removeClass(FG_DEACTIVATION);
        // Force layout in order to re-trigger the animation.
        this.adapter_.computeBoundingRect();
        this.adapter_.addClass(FG_ACTIVATION);
        this.activationTimer_ = setTimeout(function () { return _this.activationTimerCallback_(); }, DEACTIVATION_TIMEOUT_MS);
    };
    MDCRippleFoundation.prototype.getFgTranslationCoordinates_ = function () {
        var _a = this.activationState_, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
        var startPoint;
        if (wasActivatedByPointer) {
            startPoint = getNormalizedEventCoords(activationEvent, this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect());
        }
        else {
            startPoint = {
                x: this.frame_.width / 2,
                y: this.frame_.height / 2,
            };
        }
        // Center the element around the start point.
        startPoint = {
            x: startPoint.x - (this.initialSize_ / 2),
            y: startPoint.y - (this.initialSize_ / 2),
        };
        var endPoint = {
            x: (this.frame_.width / 2) - (this.initialSize_ / 2),
            y: (this.frame_.height / 2) - (this.initialSize_ / 2),
        };
        return { startPoint: startPoint, endPoint: endPoint };
    };
    MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady_ = function () {
        var _this = this;
        // This method is called both when a pointing device is released, and when the activation animation ends.
        // The deactivation animation should only run after both of those occur.
        var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
        var _a = this.activationState_, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
        var activationHasEnded = hasDeactivationUXRun || !isActivated;
        if (activationHasEnded && this.activationAnimationHasEnded_) {
            this.rmBoundedActivationClasses_();
            this.adapter_.addClass(FG_DEACTIVATION);
            this.fgDeactivationRemovalTimer_ = setTimeout(function () {
                _this.adapter_.removeClass(FG_DEACTIVATION);
            }, numbers$1.FG_DEACTIVATION_MS);
        }
    };
    MDCRippleFoundation.prototype.rmBoundedActivationClasses_ = function () {
        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
        this.adapter_.removeClass(FG_ACTIVATION);
        this.activationAnimationHasEnded_ = false;
        this.adapter_.computeBoundingRect();
    };
    MDCRippleFoundation.prototype.resetActivationState_ = function () {
        var _this = this;
        this.previousActivationEvent_ = this.activationState_.activationEvent;
        this.activationState_ = this.defaultActivationState_();
        // Touch devices may fire additional events for the same interaction within a short time.
        // Store the previous event until it's safe to assume that subsequent events are for new interactions.
        setTimeout(function () { return _this.previousActivationEvent_ = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
    };
    MDCRippleFoundation.prototype.deactivate_ = function () {
        var _this = this;
        var activationState = this.activationState_;
        // This can happen in scenarios such as when you have a keyup event that blurs the element.
        if (!activationState.isActivated) {
            return;
        }
        var state = __assign({}, activationState);
        if (activationState.isProgrammatic) {
            requestAnimationFrame(function () { return _this.animateDeactivation_(state); });
            this.resetActivationState_();
        }
        else {
            this.deregisterDeactivationHandlers_();
            requestAnimationFrame(function () {
                _this.activationState_.hasDeactivationUXRun = true;
                _this.animateDeactivation_(state);
                _this.resetActivationState_();
            });
        }
    };
    MDCRippleFoundation.prototype.animateDeactivation_ = function (_a) {
        var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
        if (wasActivatedByPointer || wasElementMadeActive) {
            this.runDeactivationUXLogicIfReady_();
        }
    };
    MDCRippleFoundation.prototype.layoutInternal_ = function () {
        var _this = this;
        this.frame_ = this.adapter_.computeBoundingRect();
        var maxDim = Math.max(this.frame_.height, this.frame_.width);
        // Surface diameter is treated differently for unbounded vs. bounded ripples.
        // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
        // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
        // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
        // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
        // `overflow: hidden`.
        var getBoundedRadius = function () {
            var hypotenuse = Math.sqrt(Math.pow(_this.frame_.width, 2) + Math.pow(_this.frame_.height, 2));
            return hypotenuse + MDCRippleFoundation.numbers.PADDING;
        };
        this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius();
        // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
        var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
        // Unbounded ripple size should always be even number to equally center align.
        if (this.adapter_.isUnbounded() && initialSize % 2 !== 0) {
            this.initialSize_ = initialSize - 1;
        }
        else {
            this.initialSize_ = initialSize;
        }
        this.fgScale_ = "" + this.maxRadius_ / this.initialSize_;
        this.updateLayoutCssVars_();
    };
    MDCRippleFoundation.prototype.updateLayoutCssVars_ = function () {
        var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
        this.adapter_.updateCssVariable(VAR_FG_SIZE, this.initialSize_ + "px");
        this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);
        if (this.adapter_.isUnbounded()) {
            this.unboundedCoords_ = {
                left: Math.round((this.frame_.width / 2) - (this.initialSize_ / 2)),
                top: Math.round((this.frame_.height / 2) - (this.initialSize_ / 2)),
            };
            this.adapter_.updateCssVariable(VAR_LEFT, this.unboundedCoords_.left + "px");
            this.adapter_.updateCssVariable(VAR_TOP, this.unboundedCoords_.top + "px");
        }
    };
    return MDCRippleFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCRipple = /** @class */ (function (_super) {
    __extends(MDCRipple, _super);
    function MDCRipple() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.disabled = false;
        return _this;
    }
    MDCRipple.attachTo = function (root, opts) {
        if (opts === void 0) { opts = { isUnbounded: undefined }; }
        var ripple = new MDCRipple(root);
        // Only override unbounded behavior if option is explicitly specified
        if (opts.isUnbounded !== undefined) {
            ripple.unbounded = opts.isUnbounded;
        }
        return ripple;
    };
    MDCRipple.createAdapter = function (instance) {
        return {
            addClass: function (className) { return instance.root_.classList.add(className); },
            browserSupportsCssVars: function () { return supportsCssVariables(window); },
            computeBoundingRect: function () { return instance.root_.getBoundingClientRect(); },
            containsEventTarget: function (target) { return instance.root_.contains(target); },
            deregisterDocumentInteractionHandler: function (evtType, handler) {
                return document.documentElement.removeEventListener(evtType, handler, applyPassive());
            },
            deregisterInteractionHandler: function (evtType, handler) {
                return instance.root_.removeEventListener(evtType, handler, applyPassive());
            },
            deregisterResizeHandler: function (handler) { return window.removeEventListener('resize', handler); },
            getWindowPageOffset: function () { return ({ x: window.pageXOffset, y: window.pageYOffset }); },
            isSurfaceActive: function () { return matches(instance.root_, ':active'); },
            isSurfaceDisabled: function () { return Boolean(instance.disabled); },
            isUnbounded: function () { return Boolean(instance.unbounded); },
            registerDocumentInteractionHandler: function (evtType, handler) {
                return document.documentElement.addEventListener(evtType, handler, applyPassive());
            },
            registerInteractionHandler: function (evtType, handler) {
                return instance.root_.addEventListener(evtType, handler, applyPassive());
            },
            registerResizeHandler: function (handler) { return window.addEventListener('resize', handler); },
            removeClass: function (className) { return instance.root_.classList.remove(className); },
            updateCssVariable: function (varName, value) { return instance.root_.style.setProperty(varName, value); },
        };
    };
    Object.defineProperty(MDCRipple.prototype, "unbounded", {
        get: function () {
            return Boolean(this.unbounded_);
        },
        set: function (unbounded) {
            this.unbounded_ = Boolean(unbounded);
            this.setUnbounded_();
        },
        enumerable: true,
        configurable: true
    });
    MDCRipple.prototype.activate = function () {
        this.foundation_.activate();
    };
    MDCRipple.prototype.deactivate = function () {
        this.foundation_.deactivate();
    };
    MDCRipple.prototype.layout = function () {
        this.foundation_.layout();
    };
    MDCRipple.prototype.getDefaultFoundation = function () {
        return new MDCRippleFoundation(MDCRipple.createAdapter(this));
    };
    MDCRipple.prototype.initialSyncWithDOM = function () {
        var root = this.root_;
        this.unbounded = 'mdcRippleIsUnbounded' in root.dataset;
    };
    /**
     * Closure Compiler throws an access control error when directly accessing a
     * protected or private property inside a getter/setter, like unbounded above.
     * By accessing the protected property inside a method, we solve that problem.
     * That's why this function exists.
     */
    MDCRipple.prototype.setUnbounded_ = function () {
        this.foundation_.setUnbounded(Boolean(this.unbounded_));
    };
    return MDCRipple;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$4 = {
    ROOT: 'mdc-text-field-character-counter',
};
var strings$2 = {
    ROOT_SELECTOR: "." + cssClasses$4.ROOT,
};

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTextFieldCharacterCounterFoundation = /** @class */ (function (_super) {
    __extends(MDCTextFieldCharacterCounterFoundation, _super);
    function MDCTextFieldCharacterCounterFoundation(adapter) {
        return _super.call(this, __assign(__assign({}, MDCTextFieldCharacterCounterFoundation.defaultAdapter), adapter)) || this;
    }
    Object.defineProperty(MDCTextFieldCharacterCounterFoundation, "cssClasses", {
        get: function () {
            return cssClasses$4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldCharacterCounterFoundation, "strings", {
        get: function () {
            return strings$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldCharacterCounterFoundation, "defaultAdapter", {
        /**
         * See {@link MDCTextFieldCharacterCounterAdapter} for typing information on parameters and return types.
         */
        get: function () {
            return {
                setContent: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCTextFieldCharacterCounterFoundation.prototype.setCounterValue = function (currentLength, maxLength) {
        currentLength = Math.min(currentLength, maxLength);
        this.adapter_.setContent(currentLength + " / " + maxLength);
    };
    return MDCTextFieldCharacterCounterFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTextFieldCharacterCounter = /** @class */ (function (_super) {
    __extends(MDCTextFieldCharacterCounter, _super);
    function MDCTextFieldCharacterCounter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTextFieldCharacterCounter.attachTo = function (root) {
        return new MDCTextFieldCharacterCounter(root);
    };
    Object.defineProperty(MDCTextFieldCharacterCounter.prototype, "foundation", {
        get: function () {
            return this.foundation_;
        },
        enumerable: true,
        configurable: true
    });
    MDCTextFieldCharacterCounter.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            setContent: function (content) {
                _this.root_.textContent = content;
            },
        };
        return new MDCTextFieldCharacterCounterFoundation(adapter);
    };
    return MDCTextFieldCharacterCounter;
}(MDCComponent));

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$3 = {
    ARIA_CONTROLS: 'aria-controls',
    INPUT_SELECTOR: '.mdc-text-field__input',
    LABEL_SELECTOR: '.mdc-floating-label',
    LEADING_ICON_SELECTOR: '.mdc-text-field__icon--leading',
    LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
    OUTLINE_SELECTOR: '.mdc-notched-outline',
    PREFIX_SELECTOR: '.mdc-text-field__affix--prefix',
    SUFFIX_SELECTOR: '.mdc-text-field__affix--suffix',
    TRAILING_ICON_SELECTOR: '.mdc-text-field__icon--trailing'
};
var cssClasses$5 = {
    DISABLED: 'mdc-text-field--disabled',
    FOCUSED: 'mdc-text-field--focused',
    FULLWIDTH: 'mdc-text-field--fullwidth',
    HELPER_LINE: 'mdc-text-field-helper-line',
    INVALID: 'mdc-text-field--invalid',
    LABEL_FLOATING: 'mdc-text-field--label-floating',
    NO_LABEL: 'mdc-text-field--no-label',
    OUTLINED: 'mdc-text-field--outlined',
    ROOT: 'mdc-text-field',
    TEXTAREA: 'mdc-text-field--textarea',
    WITH_LEADING_ICON: 'mdc-text-field--with-leading-icon',
    WITH_TRAILING_ICON: 'mdc-text-field--with-trailing-icon',
};
var numbers$2 = {
    LABEL_SCALE: 0.75,
};
/**
 * Whitelist based off of https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation
 * under the "Validation-related attributes" section.
 */
var VALIDATION_ATTR_WHITELIST = [
    'pattern', 'min', 'max', 'required', 'step', 'minlength', 'maxlength',
];
/**
 * Label should always float for these types as they show some UI even if value is empty.
 */
var ALWAYS_FLOAT_TYPES = [
    'color', 'date', 'datetime-local', 'month', 'range', 'time', 'week',
];

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var POINTERDOWN_EVENTS = ['mousedown', 'touchstart'];
var INTERACTION_EVENTS = ['click', 'keydown'];
var MDCTextFieldFoundation = /** @class */ (function (_super) {
    __extends(MDCTextFieldFoundation, _super);
    /**
     * @param adapter
     * @param foundationMap Map from subcomponent names to their subfoundations.
     */
    function MDCTextFieldFoundation(adapter, foundationMap) {
        if (foundationMap === void 0) { foundationMap = {}; }
        var _this = _super.call(this, __assign(__assign({}, MDCTextFieldFoundation.defaultAdapter), adapter)) || this;
        _this.isFocused_ = false;
        _this.receivedUserInput_ = false;
        _this.isValid_ = true;
        _this.useNativeValidation_ = true;
        _this.helperText_ = foundationMap.helperText;
        _this.characterCounter_ = foundationMap.characterCounter;
        _this.leadingIcon_ = foundationMap.leadingIcon;
        _this.trailingIcon_ = foundationMap.trailingIcon;
        _this.inputFocusHandler_ = function () { return _this.activateFocus(); };
        _this.inputBlurHandler_ = function () { return _this.deactivateFocus(); };
        _this.inputInputHandler_ = function () { return _this.handleInput(); };
        _this.setPointerXOffset_ = function (evt) { return _this.setTransformOrigin(evt); };
        _this.textFieldInteractionHandler_ = function () { return _this.handleTextFieldInteraction(); };
        _this.validationAttributeChangeHandler_ = function (attributesList) { return _this.handleValidationAttributeChange(attributesList); };
        return _this;
    }
    Object.defineProperty(MDCTextFieldFoundation, "cssClasses", {
        get: function () {
            return cssClasses$5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation, "strings", {
        get: function () {
            return strings$3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation, "numbers", {
        get: function () {
            return numbers$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldAlwaysFloat_", {
        get: function () {
            var type = this.getNativeInput_().type;
            return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldFloat", {
        get: function () {
            return this.shouldAlwaysFloat_ || this.isFocused_ || !!this.getValue() || this.isBadInput_();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldShake", {
        get: function () {
            return !this.isFocused_ && !this.isValid() && !!this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation, "defaultAdapter", {
        /**
         * See {@link MDCTextFieldAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return true; },
                registerTextFieldInteractionHandler: function () { return undefined; },
                deregisterTextFieldInteractionHandler: function () { return undefined; },
                registerInputInteractionHandler: function () { return undefined; },
                deregisterInputInteractionHandler: function () { return undefined; },
                registerValidationAttributeChangeHandler: function () { return new MutationObserver(function () { return undefined; }); },
                deregisterValidationAttributeChangeHandler: function () { return undefined; },
                getNativeInput: function () { return null; },
                isFocused: function () { return false; },
                activateLineRipple: function () { return undefined; },
                deactivateLineRipple: function () { return undefined; },
                setLineRippleTransformOrigin: function () { return undefined; },
                shakeLabel: function () { return undefined; },
                floatLabel: function () { return undefined; },
                hasLabel: function () { return false; },
                getLabelWidth: function () { return 0; },
                hasOutline: function () { return false; },
                notchOutline: function () { return undefined; },
                closeOutline: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCTextFieldFoundation.prototype.init = function () {
        var _this = this;
        if (this.adapter_.isFocused()) {
            this.inputFocusHandler_();
        }
        else if (this.adapter_.hasLabel() && this.shouldFloat) {
            this.notchOutline(true);
            this.adapter_.floatLabel(true);
            this.styleFloating_(true);
        }
        this.adapter_.registerInputInteractionHandler('focus', this.inputFocusHandler_);
        this.adapter_.registerInputInteractionHandler('blur', this.inputBlurHandler_);
        this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);
        POINTERDOWN_EVENTS.forEach(function (evtType) {
            _this.adapter_.registerInputInteractionHandler(evtType, _this.setPointerXOffset_);
        });
        INTERACTION_EVENTS.forEach(function (evtType) {
            _this.adapter_.registerTextFieldInteractionHandler(evtType, _this.textFieldInteractionHandler_);
        });
        this.validationObserver_ =
            this.adapter_.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler_);
        this.setCharacterCounter_(this.getValue().length);
    };
    MDCTextFieldFoundation.prototype.destroy = function () {
        var _this = this;
        this.adapter_.deregisterInputInteractionHandler('focus', this.inputFocusHandler_);
        this.adapter_.deregisterInputInteractionHandler('blur', this.inputBlurHandler_);
        this.adapter_.deregisterInputInteractionHandler('input', this.inputInputHandler_);
        POINTERDOWN_EVENTS.forEach(function (evtType) {
            _this.adapter_.deregisterInputInteractionHandler(evtType, _this.setPointerXOffset_);
        });
        INTERACTION_EVENTS.forEach(function (evtType) {
            _this.adapter_.deregisterTextFieldInteractionHandler(evtType, _this.textFieldInteractionHandler_);
        });
        this.adapter_.deregisterValidationAttributeChangeHandler(this.validationObserver_);
    };
    /**
     * Handles user interactions with the Text Field.
     */
    MDCTextFieldFoundation.prototype.handleTextFieldInteraction = function () {
        var nativeInput = this.adapter_.getNativeInput();
        if (nativeInput && nativeInput.disabled) {
            return;
        }
        this.receivedUserInput_ = true;
    };
    /**
     * Handles validation attribute changes
     */
    MDCTextFieldFoundation.prototype.handleValidationAttributeChange = function (attributesList) {
        var _this = this;
        attributesList.some(function (attributeName) {
            if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
                _this.styleValidity_(true);
                return true;
            }
            return false;
        });
        if (attributesList.indexOf('maxlength') > -1) {
            this.setCharacterCounter_(this.getValue().length);
        }
    };
    /**
     * Opens/closes the notched outline.
     */
    MDCTextFieldFoundation.prototype.notchOutline = function (openNotch) {
        if (!this.adapter_.hasOutline()) {
            return;
        }
        if (openNotch) {
            var labelWidth = this.adapter_.getLabelWidth() * numbers$2.LABEL_SCALE;
            this.adapter_.notchOutline(labelWidth);
        }
        else {
            this.adapter_.closeOutline();
        }
    };
    /**
     * Activates the text field focus state.
     */
    MDCTextFieldFoundation.prototype.activateFocus = function () {
        this.isFocused_ = true;
        this.styleFocused_(this.isFocused_);
        this.adapter_.activateLineRipple();
        if (this.adapter_.hasLabel()) {
            this.notchOutline(this.shouldFloat);
            this.adapter_.floatLabel(this.shouldFloat);
            this.styleFloating_(this.shouldFloat);
            this.adapter_.shakeLabel(this.shouldShake);
        }
        if (this.helperText_) {
            this.helperText_.showToScreenReader();
        }
    };
    /**
     * Sets the line ripple's transform origin, so that the line ripple activate
     * animation will animate out from the user's click location.
     */
    MDCTextFieldFoundation.prototype.setTransformOrigin = function (evt) {
        var touches = evt.touches;
        var targetEvent = touches ? touches[0] : evt;
        var targetClientRect = targetEvent.target.getBoundingClientRect();
        var normalizedX = targetEvent.clientX - targetClientRect.left;
        this.adapter_.setLineRippleTransformOrigin(normalizedX);
    };
    /**
     * Handles input change of text input and text area.
     */
    MDCTextFieldFoundation.prototype.handleInput = function () {
        this.autoCompleteFocus();
        this.setCharacterCounter_(this.getValue().length);
    };
    /**
     * Activates the Text Field's focus state in cases when the input value
     * changes without user input (e.g. programmatically).
     */
    MDCTextFieldFoundation.prototype.autoCompleteFocus = function () {
        if (!this.receivedUserInput_) {
            this.activateFocus();
        }
    };
    /**
     * Deactivates the Text Field's focus state.
     */
    MDCTextFieldFoundation.prototype.deactivateFocus = function () {
        this.isFocused_ = false;
        this.adapter_.deactivateLineRipple();
        var isValid = this.isValid();
        this.styleValidity_(isValid);
        this.styleFocused_(this.isFocused_);
        if (this.adapter_.hasLabel()) {
            this.notchOutline(this.shouldFloat);
            this.adapter_.floatLabel(this.shouldFloat);
            this.styleFloating_(this.shouldFloat);
            this.adapter_.shakeLabel(this.shouldShake);
        }
        if (!this.shouldFloat) {
            this.receivedUserInput_ = false;
        }
    };
    MDCTextFieldFoundation.prototype.getValue = function () {
        return this.getNativeInput_().value;
    };
    /**
     * @param value The value to set on the input Element.
     */
    MDCTextFieldFoundation.prototype.setValue = function (value) {
        // Prevent Safari from moving the caret to the end of the input when the value has not changed.
        if (this.getValue() !== value) {
            this.getNativeInput_().value = value;
        }
        this.setCharacterCounter_(value.length);
        var isValid = this.isValid();
        this.styleValidity_(isValid);
        if (this.adapter_.hasLabel()) {
            this.notchOutline(this.shouldFloat);
            this.adapter_.floatLabel(this.shouldFloat);
            this.styleFloating_(this.shouldFloat);
            this.adapter_.shakeLabel(this.shouldShake);
        }
    };
    /**
     * @return The custom validity state, if set; otherwise, the result of a native validity check.
     */
    MDCTextFieldFoundation.prototype.isValid = function () {
        return this.useNativeValidation_
            ? this.isNativeInputValid_() : this.isValid_;
    };
    /**
     * @param isValid Sets the custom validity state of the Text Field.
     */
    MDCTextFieldFoundation.prototype.setValid = function (isValid) {
        this.isValid_ = isValid;
        this.styleValidity_(isValid);
        var shouldShake = !isValid && !this.isFocused_ && !!this.getValue();
        if (this.adapter_.hasLabel()) {
            this.adapter_.shakeLabel(shouldShake);
        }
    };
    /**
     * Enables or disables the use of native validation. Use this for custom validation.
     * @param useNativeValidation Set this to false to ignore native input validation.
     */
    MDCTextFieldFoundation.prototype.setUseNativeValidation = function (useNativeValidation) {
        this.useNativeValidation_ = useNativeValidation;
    };
    MDCTextFieldFoundation.prototype.isDisabled = function () {
        return this.getNativeInput_().disabled;
    };
    /**
     * @param disabled Sets the text-field disabled or enabled.
     */
    MDCTextFieldFoundation.prototype.setDisabled = function (disabled) {
        this.getNativeInput_().disabled = disabled;
        this.styleDisabled_(disabled);
    };
    /**
     * @param content Sets the content of the helper text.
     */
    MDCTextFieldFoundation.prototype.setHelperTextContent = function (content) {
        if (this.helperText_) {
            this.helperText_.setContent(content);
        }
    };
    /**
     * Sets the aria label of the leading icon.
     */
    MDCTextFieldFoundation.prototype.setLeadingIconAriaLabel = function (label) {
        if (this.leadingIcon_) {
            this.leadingIcon_.setAriaLabel(label);
        }
    };
    /**
     * Sets the text content of the leading icon.
     */
    MDCTextFieldFoundation.prototype.setLeadingIconContent = function (content) {
        if (this.leadingIcon_) {
            this.leadingIcon_.setContent(content);
        }
    };
    /**
     * Sets the aria label of the trailing icon.
     */
    MDCTextFieldFoundation.prototype.setTrailingIconAriaLabel = function (label) {
        if (this.trailingIcon_) {
            this.trailingIcon_.setAriaLabel(label);
        }
    };
    /**
     * Sets the text content of the trailing icon.
     */
    MDCTextFieldFoundation.prototype.setTrailingIconContent = function (content) {
        if (this.trailingIcon_) {
            this.trailingIcon_.setContent(content);
        }
    };
    /**
     * Sets character counter values that shows characters used and the total character limit.
     */
    MDCTextFieldFoundation.prototype.setCharacterCounter_ = function (currentLength) {
        if (!this.characterCounter_) {
            return;
        }
        var maxLength = this.getNativeInput_().maxLength;
        if (maxLength === -1) {
            throw new Error('MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.');
        }
        this.characterCounter_.setCounterValue(currentLength, maxLength);
    };
    /**
     * @return True if the Text Field input fails in converting the user-supplied value.
     */
    MDCTextFieldFoundation.prototype.isBadInput_ = function () {
        // The badInput property is not supported in IE 11 💩.
        return this.getNativeInput_().validity.badInput || false;
    };
    /**
     * @return The result of native validity checking (ValidityState.valid).
     */
    MDCTextFieldFoundation.prototype.isNativeInputValid_ = function () {
        return this.getNativeInput_().validity.valid;
    };
    /**
     * Styles the component based on the validity state.
     */
    MDCTextFieldFoundation.prototype.styleValidity_ = function (isValid) {
        var INVALID = MDCTextFieldFoundation.cssClasses.INVALID;
        if (isValid) {
            this.adapter_.removeClass(INVALID);
        }
        else {
            this.adapter_.addClass(INVALID);
        }
        if (this.helperText_) {
            this.helperText_.setValidity(isValid);
        }
    };
    /**
     * Styles the component based on the focused state.
     */
    MDCTextFieldFoundation.prototype.styleFocused_ = function (isFocused) {
        var FOCUSED = MDCTextFieldFoundation.cssClasses.FOCUSED;
        if (isFocused) {
            this.adapter_.addClass(FOCUSED);
        }
        else {
            this.adapter_.removeClass(FOCUSED);
        }
    };
    /**
     * Styles the component based on the disabled state.
     */
    MDCTextFieldFoundation.prototype.styleDisabled_ = function (isDisabled) {
        var _a = MDCTextFieldFoundation.cssClasses, DISABLED = _a.DISABLED, INVALID = _a.INVALID;
        if (isDisabled) {
            this.adapter_.addClass(DISABLED);
            this.adapter_.removeClass(INVALID);
        }
        else {
            this.adapter_.removeClass(DISABLED);
        }
        if (this.leadingIcon_) {
            this.leadingIcon_.setDisabled(isDisabled);
        }
        if (this.trailingIcon_) {
            this.trailingIcon_.setDisabled(isDisabled);
        }
    };
    /**
     * Styles the component based on the label floating state.
     */
    MDCTextFieldFoundation.prototype.styleFloating_ = function (isFloating) {
        var LABEL_FLOATING = MDCTextFieldFoundation.cssClasses.LABEL_FLOATING;
        if (isFloating) {
            this.adapter_.addClass(LABEL_FLOATING);
        }
        else {
            this.adapter_.removeClass(LABEL_FLOATING);
        }
    };
    /**
     * @return The native text input element from the host environment, or an object with the same shape for unit tests.
     */
    MDCTextFieldFoundation.prototype.getNativeInput_ = function () {
        // this.adapter_ may be undefined in foundation unit tests. This happens when testdouble is creating a mock object
        // and invokes the shouldShake/shouldFloat getters (which in turn call getValue(), which calls this method) before
        // init() has been called from the MDCTextField constructor. To work around that issue, we return a dummy object.
        var nativeInput = this.adapter_ ? this.adapter_.getNativeInput() : null;
        return nativeInput || {
            disabled: false,
            maxLength: -1,
            type: 'input',
            validity: {
                badInput: false,
                valid: true,
            },
            value: '',
        };
    };
    return MDCTextFieldFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$6 = {
    HELPER_TEXT_PERSISTENT: 'mdc-text-field-helper-text--persistent',
    HELPER_TEXT_VALIDATION_MSG: 'mdc-text-field-helper-text--validation-msg',
    ROOT: 'mdc-text-field-helper-text',
};
var strings$4 = {
    ARIA_HIDDEN: 'aria-hidden',
    ROLE: 'role',
    ROOT_SELECTOR: "." + cssClasses$6.ROOT,
};

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTextFieldHelperTextFoundation = /** @class */ (function (_super) {
    __extends(MDCTextFieldHelperTextFoundation, _super);
    function MDCTextFieldHelperTextFoundation(adapter) {
        return _super.call(this, __assign(__assign({}, MDCTextFieldHelperTextFoundation.defaultAdapter), adapter)) || this;
    }
    Object.defineProperty(MDCTextFieldHelperTextFoundation, "cssClasses", {
        get: function () {
            return cssClasses$6;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldHelperTextFoundation, "strings", {
        get: function () {
            return strings$4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldHelperTextFoundation, "defaultAdapter", {
        /**
         * See {@link MDCTextFieldHelperTextAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                setAttr: function () { return undefined; },
                removeAttr: function () { return undefined; },
                setContent: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the content of the helper text field.
     */
    MDCTextFieldHelperTextFoundation.prototype.setContent = function (content) {
        this.adapter_.setContent(content);
    };
    /**
     * @param isPersistent Sets the persistency of the helper text.
     */
    MDCTextFieldHelperTextFoundation.prototype.setPersistent = function (isPersistent) {
        if (isPersistent) {
            this.adapter_.addClass(cssClasses$6.HELPER_TEXT_PERSISTENT);
        }
        else {
            this.adapter_.removeClass(cssClasses$6.HELPER_TEXT_PERSISTENT);
        }
    };
    /**
     * @param isValidation True to make the helper text act as an error validation message.
     */
    MDCTextFieldHelperTextFoundation.prototype.setValidation = function (isValidation) {
        if (isValidation) {
            this.adapter_.addClass(cssClasses$6.HELPER_TEXT_VALIDATION_MSG);
        }
        else {
            this.adapter_.removeClass(cssClasses$6.HELPER_TEXT_VALIDATION_MSG);
        }
    };
    /**
     * Makes the helper text visible to the screen reader.
     */
    MDCTextFieldHelperTextFoundation.prototype.showToScreenReader = function () {
        this.adapter_.removeAttr(strings$4.ARIA_HIDDEN);
    };
    /**
     * Sets the validity of the helper text based on the input validity.
     */
    MDCTextFieldHelperTextFoundation.prototype.setValidity = function (inputIsValid) {
        var helperTextIsPersistent = this.adapter_.hasClass(cssClasses$6.HELPER_TEXT_PERSISTENT);
        var helperTextIsValidationMsg = this.adapter_.hasClass(cssClasses$6.HELPER_TEXT_VALIDATION_MSG);
        var validationMsgNeedsDisplay = helperTextIsValidationMsg && !inputIsValid;
        if (validationMsgNeedsDisplay) {
            this.adapter_.setAttr(strings$4.ROLE, 'alert');
        }
        else {
            this.adapter_.removeAttr(strings$4.ROLE);
        }
        if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {
            this.hide_();
        }
    };
    /**
     * Hides the help text from screen readers.
     */
    MDCTextFieldHelperTextFoundation.prototype.hide_ = function () {
        this.adapter_.setAttr(strings$4.ARIA_HIDDEN, 'true');
    };
    return MDCTextFieldHelperTextFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTextFieldHelperText = /** @class */ (function (_super) {
    __extends(MDCTextFieldHelperText, _super);
    function MDCTextFieldHelperText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTextFieldHelperText.attachTo = function (root) {
        return new MDCTextFieldHelperText(root);
    };
    Object.defineProperty(MDCTextFieldHelperText.prototype, "foundation", {
        get: function () {
            return this.foundation_;
        },
        enumerable: true,
        configurable: true
    });
    MDCTextFieldHelperText.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            setAttr: function (attr, value) { return _this.root_.setAttribute(attr, value); },
            removeAttr: function (attr) { return _this.root_.removeAttribute(attr); },
            setContent: function (content) {
                _this.root_.textContent = content;
            },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCTextFieldHelperTextFoundation(adapter);
    };
    return MDCTextFieldHelperText;
}(MDCComponent));

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$5 = {
    ICON_EVENT: 'MDCTextField:icon',
    ICON_ROLE: 'button',
};
var cssClasses$7 = {
    ROOT: 'mdc-text-field__icon',
};

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var INTERACTION_EVENTS$1 = ['click', 'keydown'];
var MDCTextFieldIconFoundation = /** @class */ (function (_super) {
    __extends(MDCTextFieldIconFoundation, _super);
    function MDCTextFieldIconFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCTextFieldIconFoundation.defaultAdapter), adapter)) || this;
        _this.savedTabIndex_ = null;
        _this.interactionHandler_ = function (evt) { return _this.handleInteraction(evt); };
        return _this;
    }
    Object.defineProperty(MDCTextFieldIconFoundation, "strings", {
        get: function () {
            return strings$5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldIconFoundation, "cssClasses", {
        get: function () {
            return cssClasses$7;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldIconFoundation, "defaultAdapter", {
        /**
         * See {@link MDCTextFieldIconAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                getAttr: function () { return null; },
                setAttr: function () { return undefined; },
                removeAttr: function () { return undefined; },
                setContent: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                notifyIconAction: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCTextFieldIconFoundation.prototype.init = function () {
        var _this = this;
        this.savedTabIndex_ = this.adapter_.getAttr('tabindex');
        INTERACTION_EVENTS$1.forEach(function (evtType) {
            _this.adapter_.registerInteractionHandler(evtType, _this.interactionHandler_);
        });
    };
    MDCTextFieldIconFoundation.prototype.destroy = function () {
        var _this = this;
        INTERACTION_EVENTS$1.forEach(function (evtType) {
            _this.adapter_.deregisterInteractionHandler(evtType, _this.interactionHandler_);
        });
    };
    MDCTextFieldIconFoundation.prototype.setDisabled = function (disabled) {
        if (!this.savedTabIndex_) {
            return;
        }
        if (disabled) {
            this.adapter_.setAttr('tabindex', '-1');
            this.adapter_.removeAttr('role');
        }
        else {
            this.adapter_.setAttr('tabindex', this.savedTabIndex_);
            this.adapter_.setAttr('role', strings$5.ICON_ROLE);
        }
    };
    MDCTextFieldIconFoundation.prototype.setAriaLabel = function (label) {
        this.adapter_.setAttr('aria-label', label);
    };
    MDCTextFieldIconFoundation.prototype.setContent = function (content) {
        this.adapter_.setContent(content);
    };
    MDCTextFieldIconFoundation.prototype.handleInteraction = function (evt) {
        var isEnterKey = evt.key === 'Enter' || evt.keyCode === 13;
        if (evt.type === 'click' || isEnterKey) {
            evt.preventDefault(); // stop click from causing host label to focus
            // input
            this.adapter_.notifyIconAction();
        }
    };
    return MDCTextFieldIconFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTextFieldIcon = /** @class */ (function (_super) {
    __extends(MDCTextFieldIcon, _super);
    function MDCTextFieldIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTextFieldIcon.attachTo = function (root) {
        return new MDCTextFieldIcon(root);
    };
    Object.defineProperty(MDCTextFieldIcon.prototype, "foundation", {
        get: function () {
            return this.foundation_;
        },
        enumerable: true,
        configurable: true
    });
    MDCTextFieldIcon.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            getAttr: function (attr) { return _this.root_.getAttribute(attr); },
            setAttr: function (attr, value) { return _this.root_.setAttribute(attr, value); },
            removeAttr: function (attr) { return _this.root_.removeAttribute(attr); },
            setContent: function (content) {
                _this.root_.textContent = content;
            },
            registerInteractionHandler: function (evtType, handler) { return _this.listen(evtType, handler); },
            deregisterInteractionHandler: function (evtType, handler) { return _this.unlisten(evtType, handler); },
            notifyIconAction: function () { return _this.emit(MDCTextFieldIconFoundation.strings.ICON_EVENT, {} /* evtData */, true /* shouldBubble */); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCTextFieldIconFoundation(adapter);
    };
    return MDCTextFieldIcon;
}(MDCComponent));

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTextField = /** @class */ (function (_super) {
    __extends(MDCTextField, _super);
    function MDCTextField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTextField.attachTo = function (root) {
        return new MDCTextField(root);
    };
    MDCTextField.prototype.initialize = function (rippleFactory, lineRippleFactory, helperTextFactory, characterCounterFactory, iconFactory, labelFactory, outlineFactory) {
        if (rippleFactory === void 0) { rippleFactory = function (el, foundation) { return new MDCRipple(el, foundation); }; }
        if (lineRippleFactory === void 0) { lineRippleFactory = function (el) { return new MDCLineRipple(el); }; }
        if (helperTextFactory === void 0) { helperTextFactory = function (el) { return new MDCTextFieldHelperText(el); }; }
        if (characterCounterFactory === void 0) { characterCounterFactory = function (el) { return new MDCTextFieldCharacterCounter(el); }; }
        if (iconFactory === void 0) { iconFactory = function (el) { return new MDCTextFieldIcon(el); }; }
        if (labelFactory === void 0) { labelFactory = function (el) { return new MDCFloatingLabel(el); }; }
        if (outlineFactory === void 0) { outlineFactory = function (el) { return new MDCNotchedOutline(el); }; }
        this.input_ = this.root_.querySelector(strings$3.INPUT_SELECTOR);
        var labelElement = this.root_.querySelector(strings$3.LABEL_SELECTOR);
        this.label_ = labelElement ? labelFactory(labelElement) : null;
        var lineRippleElement = this.root_.querySelector(strings$3.LINE_RIPPLE_SELECTOR);
        this.lineRipple_ = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;
        var outlineElement = this.root_.querySelector(strings$3.OUTLINE_SELECTOR);
        this.outline_ = outlineElement ? outlineFactory(outlineElement) : null;
        // Helper text
        var helperTextStrings = MDCTextFieldHelperTextFoundation.strings;
        var nextElementSibling = this.root_.nextElementSibling;
        var hasHelperLine = (nextElementSibling && nextElementSibling.classList.contains(cssClasses$5.HELPER_LINE));
        var helperTextEl = hasHelperLine && nextElementSibling && nextElementSibling.querySelector(helperTextStrings.ROOT_SELECTOR);
        this.helperText_ = helperTextEl ? helperTextFactory(helperTextEl) : null;
        // Character counter
        var characterCounterStrings = MDCTextFieldCharacterCounterFoundation.strings;
        var characterCounterEl = this.root_.querySelector(characterCounterStrings.ROOT_SELECTOR);
        // If character counter is not found in root element search in sibling element.
        if (!characterCounterEl && hasHelperLine && nextElementSibling) {
            characterCounterEl = nextElementSibling.querySelector(characterCounterStrings.ROOT_SELECTOR);
        }
        this.characterCounter_ = characterCounterEl ? characterCounterFactory(characterCounterEl) : null;
        // Leading icon
        var leadingIconEl = this.root_.querySelector(strings$3.LEADING_ICON_SELECTOR);
        this.leadingIcon_ = leadingIconEl ? iconFactory(leadingIconEl) : null;
        // Trailing icon
        var trailingIconEl = this.root_.querySelector(strings$3.TRAILING_ICON_SELECTOR);
        this.trailingIcon_ = trailingIconEl ? iconFactory(trailingIconEl) : null;
        // Prefix and Suffix
        this.prefix_ = this.root_.querySelector(strings$3.PREFIX_SELECTOR);
        this.suffix_ = this.root_.querySelector(strings$3.SUFFIX_SELECTOR);
        this.ripple = this.createRipple_(rippleFactory);
    };
    MDCTextField.prototype.destroy = function () {
        if (this.ripple) {
            this.ripple.destroy();
        }
        if (this.lineRipple_) {
            this.lineRipple_.destroy();
        }
        if (this.helperText_) {
            this.helperText_.destroy();
        }
        if (this.characterCounter_) {
            this.characterCounter_.destroy();
        }
        if (this.leadingIcon_) {
            this.leadingIcon_.destroy();
        }
        if (this.trailingIcon_) {
            this.trailingIcon_.destroy();
        }
        if (this.label_) {
            this.label_.destroy();
        }
        if (this.outline_) {
            this.outline_.destroy();
        }
        _super.prototype.destroy.call(this);
    };
    /**
     * Initializes the Text Field's internal state based on the environment's
     * state.
     */
    MDCTextField.prototype.initialSyncWithDOM = function () {
        this.disabled = this.input_.disabled;
    };
    Object.defineProperty(MDCTextField.prototype, "value", {
        get: function () {
            return this.foundation_.getValue();
        },
        /**
         * @param value The value to set on the input.
         */
        set: function (value) {
            this.foundation_.setValue(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "disabled", {
        get: function () {
            return this.foundation_.isDisabled();
        },
        /**
         * @param disabled Sets the Text Field disabled or enabled.
         */
        set: function (disabled) {
            this.foundation_.setDisabled(disabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "valid", {
        get: function () {
            return this.foundation_.isValid();
        },
        /**
         * @param valid Sets the Text Field valid or invalid.
         */
        set: function (valid) {
            this.foundation_.setValid(valid);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "required", {
        get: function () {
            return this.input_.required;
        },
        /**
         * @param required Sets the Text Field to required.
         */
        set: function (required) {
            this.input_.required = required;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "pattern", {
        get: function () {
            return this.input_.pattern;
        },
        /**
         * @param pattern Sets the input element's validation pattern.
         */
        set: function (pattern) {
            this.input_.pattern = pattern;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "minLength", {
        get: function () {
            return this.input_.minLength;
        },
        /**
         * @param minLength Sets the input element's minLength.
         */
        set: function (minLength) {
            this.input_.minLength = minLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "maxLength", {
        get: function () {
            return this.input_.maxLength;
        },
        /**
         * @param maxLength Sets the input element's maxLength.
         */
        set: function (maxLength) {
            // Chrome throws exception if maxLength is set to a value less than zero
            if (maxLength < 0) {
                this.input_.removeAttribute('maxLength');
            }
            else {
                this.input_.maxLength = maxLength;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "min", {
        get: function () {
            return this.input_.min;
        },
        /**
         * @param min Sets the input element's min.
         */
        set: function (min) {
            this.input_.min = min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "max", {
        get: function () {
            return this.input_.max;
        },
        /**
         * @param max Sets the input element's max.
         */
        set: function (max) {
            this.input_.max = max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "step", {
        get: function () {
            return this.input_.step;
        },
        /**
         * @param step Sets the input element's step.
         */
        set: function (step) {
            this.input_.step = step;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "helperTextContent", {
        /**
         * Sets the helper text element content.
         */
        set: function (content) {
            this.foundation_.setHelperTextContent(content);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "leadingIconAriaLabel", {
        /**
         * Sets the aria label of the leading icon.
         */
        set: function (label) {
            this.foundation_.setLeadingIconAriaLabel(label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "leadingIconContent", {
        /**
         * Sets the text content of the leading icon.
         */
        set: function (content) {
            this.foundation_.setLeadingIconContent(content);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "trailingIconAriaLabel", {
        /**
         * Sets the aria label of the trailing icon.
         */
        set: function (label) {
            this.foundation_.setTrailingIconAriaLabel(label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "trailingIconContent", {
        /**
         * Sets the text content of the trailing icon.
         */
        set: function (content) {
            this.foundation_.setTrailingIconContent(content);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "useNativeValidation", {
        /**
         * Enables or disables the use of native validation. Use this for custom validation.
         * @param useNativeValidation Set this to false to ignore native input validation.
         */
        set: function (useNativeValidation) {
            this.foundation_.setUseNativeValidation(useNativeValidation);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "prefixText", {
        /**
         * Gets the text content of the prefix, or null if it does not exist.
         */
        get: function () {
            return this.prefix_ ? this.prefix_.textContent : null;
        },
        /**
         * Sets the text content of the prefix, if it exists.
         */
        set: function (prefixText) {
            if (this.prefix_) {
                this.prefix_.textContent = prefixText;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCTextField.prototype, "suffixText", {
        /**
         * Gets the text content of the suffix, or null if it does not exist.
         */
        get: function () {
            return this.suffix_ ? this.suffix_.textContent : null;
        },
        /**
         * Sets the text content of the suffix, if it exists.
         */
        set: function (suffixText) {
            if (this.suffix_) {
                this.suffix_.textContent = suffixText;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Focuses the input element.
     */
    MDCTextField.prototype.focus = function () {
        this.input_.focus();
    };
    /**
     * Recomputes the outline SVG path for the outline element.
     */
    MDCTextField.prototype.layout = function () {
        var openNotch = this.foundation_.shouldFloat;
        this.foundation_.notchOutline(openNotch);
    };
    MDCTextField.prototype.getDefaultFoundation = function () {
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = __assign(__assign(__assign(__assign(__assign({}, this.getRootAdapterMethods_()), this.getInputAdapterMethods_()), this.getLabelAdapterMethods_()), this.getLineRippleAdapterMethods_()), this.getOutlineAdapterMethods_());
        // tslint:enable:object-literal-sort-keys
        return new MDCTextFieldFoundation(adapter, this.getFoundationMap_());
    };
    MDCTextField.prototype.getRootAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            registerTextFieldInteractionHandler: function (evtType, handler) { return _this.listen(evtType, handler); },
            deregisterTextFieldInteractionHandler: function (evtType, handler) { return _this.unlisten(evtType, handler); },
            registerValidationAttributeChangeHandler: function (handler) {
                var getAttributesList = function (mutationsList) {
                    return mutationsList
                        .map(function (mutation) { return mutation.attributeName; })
                        .filter(function (attributeName) { return attributeName; });
                };
                var observer = new MutationObserver(function (mutationsList) { return handler(getAttributesList(mutationsList)); });
                var config = { attributes: true };
                observer.observe(_this.input_, config);
                return observer;
            },
            deregisterValidationAttributeChangeHandler: function (observer) { return observer.disconnect(); },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCTextField.prototype.getInputAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            getNativeInput: function () { return _this.input_; },
            isFocused: function () { return document.activeElement === _this.input_; },
            registerInputInteractionHandler: function (evtType, handler) {
                return _this.input_.addEventListener(evtType, handler, applyPassive());
            },
            deregisterInputInteractionHandler: function (evtType, handler) {
                return _this.input_.removeEventListener(evtType, handler, applyPassive());
            },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCTextField.prototype.getLabelAdapterMethods_ = function () {
        var _this = this;
        return {
            floatLabel: function (shouldFloat) { return _this.label_ && _this.label_.float(shouldFloat); },
            getLabelWidth: function () { return _this.label_ ? _this.label_.getWidth() : 0; },
            hasLabel: function () { return Boolean(_this.label_); },
            shakeLabel: function (shouldShake) { return _this.label_ && _this.label_.shake(shouldShake); },
        };
    };
    MDCTextField.prototype.getLineRippleAdapterMethods_ = function () {
        var _this = this;
        return {
            activateLineRipple: function () {
                if (_this.lineRipple_) {
                    _this.lineRipple_.activate();
                }
            },
            deactivateLineRipple: function () {
                if (_this.lineRipple_) {
                    _this.lineRipple_.deactivate();
                }
            },
            setLineRippleTransformOrigin: function (normalizedX) {
                if (_this.lineRipple_) {
                    _this.lineRipple_.setRippleCenter(normalizedX);
                }
            },
        };
    };
    MDCTextField.prototype.getOutlineAdapterMethods_ = function () {
        var _this = this;
        return {
            closeOutline: function () { return _this.outline_ && _this.outline_.closeNotch(); },
            hasOutline: function () { return Boolean(_this.outline_); },
            notchOutline: function (labelWidth) { return _this.outline_ && _this.outline_.notch(labelWidth); },
        };
    };
    /**
     * @return A map of all subcomponents to subfoundations.
     */
    MDCTextField.prototype.getFoundationMap_ = function () {
        return {
            characterCounter: this.characterCounter_ ? this.characterCounter_.foundation : undefined,
            helperText: this.helperText_ ? this.helperText_.foundation : undefined,
            leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
            trailingIcon: this.trailingIcon_ ? this.trailingIcon_.foundation : undefined,
        };
    };
    MDCTextField.prototype.createRipple_ = function (rippleFactory) {
        var _this = this;
        var isTextArea = this.root_.classList.contains(cssClasses$5.TEXTAREA);
        var isOutlined = this.root_.classList.contains(cssClasses$5.OUTLINED);
        if (isTextArea || isOutlined) {
            return null;
        }
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = __assign(__assign({}, MDCRipple.createAdapter(this)), { isSurfaceActive: function () { return matches(_this.input_, ':active'); }, registerInteractionHandler: function (evtType, handler) { return _this.input_.addEventListener(evtType, handler, applyPassive()); }, deregisterInteractionHandler: function (evtType, handler) {
                return _this.input_.removeEventListener(evtType, handler, applyPassive());
            } });
        // tslint:enable:object-literal-sort-keys
        return rippleFactory(this.root_, new MDCRippleFoundation(adapter));
    };
    return MDCTextField;
}(MDCComponent));

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

var css_248z = "/**\n * @license\n * Copyright Google LLC All Rights Reserved.\n *\n * Use of this source code is governed by an MIT-style license that can be\n * found in the LICENSE file at https://github.com/material-components/material-components-web/blob/master/LICENSE\n */\n.mdc-floating-label {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: Roboto, sans-serif;\n  /* @alternate */\n  font-family: var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));\n  font-size: 1rem;\n  /* @alternate */\n  font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n  font-weight: 400;\n  /* @alternate */\n  font-weight: var(--mdc-typography-subtitle1-font-weight, 400);\n  letter-spacing: 0.009375em;\n  /* @alternate */\n  letter-spacing: var(--mdc-typography-subtitle1-letter-spacing, 0.00937em);\n  text-decoration: inherit;\n  /* @alternate */\n  -webkit-text-decoration: var(--mdc-typography-subtitle1-text-decoration, inherit);\n  text-decoration: var(--mdc-typography-subtitle1-text-decoration, inherit);\n  text-transform: inherit;\n  /* @alternate */\n  text-transform: var(--mdc-typography-subtitle1-text-transform, inherit);\n  position: absolute;\n  /* @noflip */\n  left: 0;\n  /* @noflip */\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  line-height: 1.15rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  /* @alternate */\n  will-change: transform;\n  transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1); }\n\n[dir=rtl] .mdc-floating-label, .mdc-floating-label[dir=rtl] {\n  /* @noflip */\n  right: 0;\n  /* @noflip */\n  left: auto;\n  /* @noflip */\n  -webkit-transform-origin: right top;\n  transform-origin: right top;\n  /* @noflip */\n  text-align: right; }\n\n.mdc-floating-label--float-above {\n  cursor: auto; }\n\n.mdc-floating-label--float-above {\n  -webkit-transform: translateY(-106%) scale(0.75);\n  transform: translateY(-106%) scale(0.75); }\n\n.mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-standard 250ms 1;\n  animation: mdc-floating-label-shake-float-above-standard 250ms 1; }\n\n@-webkit-keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-106%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-106%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-106%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-106%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-106%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-106%) scale(0.75); } }\n\n@keyframes mdc-floating-label-shake-float-above-standard {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-106%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-106%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-106%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-106%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-106%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-106%) scale(0.75); } }\n\n.mdc-line-ripple::before, .mdc-line-ripple::after {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  border-bottom-style: solid;\n  content: \"\"; }\n\n.mdc-line-ripple::before {\n  border-bottom-width: 1px;\n  z-index: 1; }\n\n.mdc-line-ripple::after {\n  -webkit-transform: scaleX(0);\n  transform: scaleX(0);\n  border-bottom-width: 2px;\n  opacity: 0;\n  z-index: 2; }\n\n.mdc-line-ripple::after {\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 180ms cubic-bezier(0.4, 0, 0.2, 1); }\n\n.mdc-line-ripple--active::after {\n  -webkit-transform: scaleX(1);\n  transform: scaleX(1);\n  opacity: 1; }\n\n.mdc-line-ripple--deactivating::after {\n  opacity: 0; }\n\n.mdc-notched-outline {\n  display: flex;\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  /* @noflip */\n  text-align: left;\n  pointer-events: none; }\n\n[dir=rtl] .mdc-notched-outline, .mdc-notched-outline[dir=rtl] {\n  /* @noflip */\n  text-align: right; }\n\n.mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing {\n  box-sizing: border-box;\n  height: 100%;\n  border-top: 1px solid;\n  border-bottom: 1px solid;\n  pointer-events: none; }\n\n.mdc-notched-outline__leading {\n  /* @noflip */\n  border-left: 1px solid;\n  /* @noflip */\n  border-right: none;\n  width: 12px; }\n\n[dir=rtl] .mdc-notched-outline__leading, .mdc-notched-outline__leading[dir=rtl] {\n  /* @noflip */\n  border-left: none;\n  /* @noflip */\n  border-right: 1px solid; }\n\n.mdc-notched-outline__trailing {\n  /* @noflip */\n  border-left: none;\n  /* @noflip */\n  border-right: 1px solid;\n  flex-grow: 1; }\n\n[dir=rtl] .mdc-notched-outline__trailing, .mdc-notched-outline__trailing[dir=rtl] {\n  /* @noflip */\n  border-left: 1px solid;\n  /* @noflip */\n  border-right: none; }\n\n.mdc-notched-outline__notch {\n  flex: 0 0 auto;\n  width: auto;\n  max-width: calc(100% - 12px * 2); }\n\n.mdc-notched-outline .mdc-floating-label {\n  display: inline-block;\n  position: relative;\n  max-width: 100%; }\n\n.mdc-notched-outline .mdc-floating-label--float-above {\n  text-overflow: clip; }\n\n.mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  max-width: calc(100% / .75); }\n\n.mdc-notched-outline--notched .mdc-notched-outline__notch {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 8px;\n  border-top: none; }\n\n[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch, .mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl] {\n  /* @noflip */\n  padding-left: 8px;\n  /* @noflip */\n  padding-right: 0; }\n\n.mdc-notched-outline--no-label .mdc-notched-outline__notch {\n  padding: 0; }\n\n.mdc-text-field-helper-text {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: Roboto, sans-serif;\n  /* @alternate */\n  font-family: var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));\n  font-size: 0.75rem;\n  /* @alternate */\n  font-size: var(--mdc-typography-caption-font-size, 0.75rem);\n  line-height: 1.25rem;\n  /* @alternate */\n  line-height: var(--mdc-typography-caption-line-height, 1.25rem);\n  font-weight: 400;\n  /* @alternate */\n  font-weight: var(--mdc-typography-caption-font-weight, 400);\n  letter-spacing: 0.0333333333em;\n  /* @alternate */\n  letter-spacing: var(--mdc-typography-caption-letter-spacing, 0.03333em);\n  text-decoration: inherit;\n  /* @alternate */\n  -webkit-text-decoration: var(--mdc-typography-caption-text-decoration, inherit);\n  text-decoration: var(--mdc-typography-caption-text-decoration, inherit);\n  text-transform: inherit;\n  /* @alternate */\n  text-transform: var(--mdc-typography-caption-text-transform, inherit);\n  display: block;\n  margin-top: 0;\n  /* @alternate */\n  line-height: normal;\n  margin: 0;\n  opacity: 0;\n  will-change: opacity;\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1); }\n\n.mdc-text-field-helper-text::before {\n  display: inline-block;\n  width: 0;\n  height: 16px;\n  content: \"\";\n  vertical-align: 0; }\n\n.mdc-text-field-helper-text--persistent {\n  transition: none;\n  opacity: 1;\n  will-change: initial; }\n\n.mdc-text-field-character-counter {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: Roboto, sans-serif;\n  /* @alternate */\n  font-family: var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));\n  font-size: 0.75rem;\n  /* @alternate */\n  font-size: var(--mdc-typography-caption-font-size, 0.75rem);\n  line-height: 1.25rem;\n  /* @alternate */\n  line-height: var(--mdc-typography-caption-line-height, 1.25rem);\n  font-weight: 400;\n  /* @alternate */\n  font-weight: var(--mdc-typography-caption-font-weight, 400);\n  letter-spacing: 0.0333333333em;\n  /* @alternate */\n  letter-spacing: var(--mdc-typography-caption-letter-spacing, 0.03333em);\n  text-decoration: inherit;\n  /* @alternate */\n  -webkit-text-decoration: var(--mdc-typography-caption-text-decoration, inherit);\n  text-decoration: var(--mdc-typography-caption-text-decoration, inherit);\n  text-transform: inherit;\n  /* @alternate */\n  text-transform: var(--mdc-typography-caption-text-transform, inherit);\n  display: block;\n  margin-top: 0;\n  /* @alternate */\n  line-height: normal;\n  /* @noflip */\n  margin-left: auto;\n  /* @noflip */\n  margin-right: 0;\n  /* @noflip */\n  padding-left: 16px;\n  /* @noflip */\n  padding-right: 0;\n  white-space: nowrap; }\n\n.mdc-text-field-character-counter::before {\n  display: inline-block;\n  width: 0;\n  height: 16px;\n  content: \"\";\n  vertical-align: 0; }\n\n[dir=rtl] .mdc-text-field-character-counter, .mdc-text-field-character-counter[dir=rtl] {\n  /* @noflip */\n  margin-left: 0;\n  /* @noflip */\n  margin-right: auto; }\n\n[dir=rtl] .mdc-text-field-character-counter, .mdc-text-field-character-counter[dir=rtl] {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 16px; }\n\n.mdc-text-field__icon {\n  align-self: center;\n  cursor: pointer; }\n\n.mdc-text-field__icon:not([tabindex]), .mdc-text-field__icon[tabindex=\"-1\"] {\n  cursor: default;\n  pointer-events: none; }\n\n.mdc-text-field__icon--leading {\n  /* @noflip */\n  margin-left: 16px;\n  /* @noflip */\n  margin-right: 8px; }\n\n[dir=rtl] .mdc-text-field__icon--leading, .mdc-text-field__icon--leading[dir=rtl] {\n  /* @noflip */\n  margin-left: 8px;\n  /* @noflip */\n  margin-right: 16px; }\n\n.mdc-text-field__icon--trailing {\n  /* @noflip */\n  margin-left: 12px;\n  /* @noflip */\n  margin-right: 12px; }\n\n[dir=rtl] .mdc-text-field__icon--trailing, .mdc-text-field__icon--trailing[dir=rtl] {\n  /* @noflip */\n  margin-left: 12px;\n  /* @noflip */\n  margin-right: 12px; }\n\n@-webkit-keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n@keyframes mdc-ripple-fg-radius-in {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);\n    transform: translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1); }\n  to {\n    -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n    transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); } }\n\n@-webkit-keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n@keyframes mdc-ripple-fg-opacity-in {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0; }\n  to {\n    opacity: var(--mdc-ripple-fg-opacity, 0); } }\n\n@-webkit-keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n@keyframes mdc-ripple-fg-opacity-out {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: var(--mdc-ripple-fg-opacity, 0); }\n  to {\n    opacity: 0; } }\n\n.mdc-text-field--filled {\n  --mdc-ripple-fg-size: 0;\n  --mdc-ripple-left: 0;\n  --mdc-ripple-top: 0;\n  --mdc-ripple-fg-scale: 1;\n  --mdc-ripple-fg-translate-end: 0;\n  --mdc-ripple-fg-translate-start: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }\n\n.mdc-text-field--filled .mdc-text-field__ripple::before,\n.mdc-text-field--filled .mdc-text-field__ripple::after {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\"; }\n\n.mdc-text-field--filled .mdc-text-field__ripple::before {\n  transition: opacity 15ms linear, background-color 15ms linear;\n  z-index: 1; }\n\n.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::before {\n  -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));\n  transform: scale(var(--mdc-ripple-fg-scale, 1)); }\n\n.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after {\n  top: 0;\n  /* @noflip */\n  left: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: center center;\n  transform-origin: center center; }\n\n.mdc-text-field--filled.mdc-ripple-upgraded--unbounded .mdc-text-field__ripple::after {\n  top: var(--mdc-ripple-top, 0);\n  /* @noflip */\n  left: var(--mdc-ripple-left, 0); }\n\n.mdc-text-field--filled.mdc-ripple-upgraded--foreground-activation .mdc-text-field__ripple::after {\n  -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;\n  animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards; }\n\n.mdc-text-field--filled.mdc-ripple-upgraded--foreground-deactivation .mdc-text-field__ripple::after {\n  -webkit-animation: mdc-ripple-fg-opacity-out 150ms;\n  animation: mdc-ripple-fg-opacity-out 150ms;\n  -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));\n  transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1)); }\n\n.mdc-text-field--filled .mdc-text-field__ripple::before,\n.mdc-text-field--filled .mdc-text-field__ripple::after {\n  top: calc(50% - 100%);\n  /* @noflip */\n  left: calc(50% - 100%);\n  width: 200%;\n  height: 200%; }\n\n.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after {\n  width: var(--mdc-ripple-fg-size, 100%);\n  height: var(--mdc-ripple-fg-size, 100%); }\n\n.mdc-text-field__ripple {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none; }\n\n.mdc-text-field {\n  border-radius: 4px 4px 0 0;\n  padding: 0 16px;\n  display: inline-flex;\n  align-items: baseline;\n  position: relative;\n  box-sizing: border-box;\n  overflow: hidden;\n  /* @alternate */\n  will-change: opacity, transform, color; }\n\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: rgba(0, 0, 0, 0.6); }\n\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  color: rgba(0, 0, 0, 0.87); }\n\n@media all {\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {\n    color: rgba(0, 0, 0, 0.54); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.54); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.54); }\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {\n    color: rgba(0, 0, 0, 0.54); } }\n\n@media all {\n  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.54); } }\n\n.mdc-text-field .mdc-text-field__input {\n  caret-color: #6200ee;\n  /* @alternate */\n  caret-color: var(--mdc-theme-primary, #6200ee); }\n\n.mdc-text-field:not(.mdc-text-field--disabled) + .mdc-text-field-helper-line .mdc-text-field-helper-text {\n  color: rgba(0, 0, 0, 0.6); }\n\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter,\n.mdc-text-field:not(.mdc-text-field--disabled) + .mdc-text-field-helper-line .mdc-text-field-character-counter {\n  color: rgba(0, 0, 0, 0.6); }\n\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--leading {\n  color: rgba(0, 0, 0, 0.54); }\n\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing {\n  color: rgba(0, 0, 0, 0.54); }\n\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--prefix {\n  color: rgba(0, 0, 0, 0.6); }\n\n.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--suffix {\n  color: rgba(0, 0, 0, 0.6); }\n\n.mdc-text-field .mdc-floating-label {\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  transform: translateY(-50%);\n  pointer-events: none; }\n\n.mdc-text-field.mdc-text-field--with-leading-icon {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 16px; }\n\n[dir=rtl] .mdc-text-field.mdc-text-field--with-leading-icon, .mdc-text-field.mdc-text-field--with-leading-icon[dir=rtl] {\n  /* @noflip */\n  padding-left: 16px;\n  /* @noflip */\n  padding-right: 0; }\n\n.mdc-text-field.mdc-text-field--with-trailing-icon {\n  /* @noflip */\n  padding-left: 16px;\n  /* @noflip */\n  padding-right: 0; }\n\n[dir=rtl] .mdc-text-field.mdc-text-field--with-trailing-icon, .mdc-text-field.mdc-text-field--with-trailing-icon[dir=rtl] {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 16px; }\n\n.mdc-text-field.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 0; }\n\n[dir=rtl] .mdc-text-field.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon, .mdc-text-field.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon[dir=rtl] {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 0; }\n\n.mdc-text-field__input {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: Roboto, sans-serif;\n  /* @alternate */\n  font-family: var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));\n  font-size: 1rem;\n  /* @alternate */\n  font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n  font-weight: 400;\n  /* @alternate */\n  font-weight: var(--mdc-typography-subtitle1-font-weight, 400);\n  letter-spacing: 0.009375em;\n  /* @alternate */\n  letter-spacing: var(--mdc-typography-subtitle1-letter-spacing, 0.00937em);\n  text-decoration: inherit;\n  /* @alternate */\n  -webkit-text-decoration: var(--mdc-typography-subtitle1-text-decoration, inherit);\n  text-decoration: var(--mdc-typography-subtitle1-text-decoration, inherit);\n  text-transform: inherit;\n  /* @alternate */\n  text-transform: var(--mdc-typography-subtitle1-text-transform, inherit);\n  height: 28px;\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  width: 100%;\n  min-width: 0;\n  border: none;\n  border-radius: 0;\n  background: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  padding: 0; }\n\n.mdc-text-field__input::-ms-clear {\n  display: none; }\n\n.mdc-text-field__input:focus {\n  outline: none; }\n\n.mdc-text-field__input:invalid {\n  box-shadow: none; }\n\n.mdc-text-field__input:-webkit-autofill {\n  z-index: auto !important; }\n\n@media all {\n  .mdc-text-field__input::-webkit-input-placeholder {\n    transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 0; }\n  .mdc-text-field__input:-ms-input-placeholder {\n    transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 0; }\n  .mdc-text-field__input::-ms-input-placeholder {\n    transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 0; }\n  .mdc-text-field__input::placeholder {\n    transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 0; } }\n\n@media all {\n  .mdc-text-field__input:-ms-input-placeholder {\n    transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n    opacity: 0; } }\n\n@media all {\n  .mdc-text-field--fullwidth .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {\n    transition-delay: 40ms;\n    transition-duration: 110ms;\n    opacity: 1; }\n  .mdc-text-field--fullwidth .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {\n    transition-delay: 40ms;\n    transition-duration: 110ms;\n    opacity: 1; }\n  .mdc-text-field--fullwidth .mdc-text-field__input::-ms-input-placeholder, .mdc-text-field--no-label .mdc-text-field__input::-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-ms-input-placeholder {\n    transition-delay: 40ms;\n    transition-duration: 110ms;\n    opacity: 1; }\n  .mdc-text-field--fullwidth .mdc-text-field__input::placeholder, .mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {\n    transition-delay: 40ms;\n    transition-duration: 110ms;\n    opacity: 1; } }\n\n@media all {\n  .mdc-text-field--fullwidth .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {\n    transition-delay: 40ms;\n    transition-duration: 110ms;\n    opacity: 1; } }\n\n.mdc-text-field__affix {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: Roboto, sans-serif;\n  /* @alternate */\n  font-family: var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));\n  font-size: 1rem;\n  /* @alternate */\n  font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n  font-weight: 400;\n  /* @alternate */\n  font-weight: var(--mdc-typography-subtitle1-font-weight, 400);\n  letter-spacing: 0.009375em;\n  /* @alternate */\n  letter-spacing: var(--mdc-typography-subtitle1-letter-spacing, 0.00937em);\n  text-decoration: inherit;\n  /* @alternate */\n  -webkit-text-decoration: var(--mdc-typography-subtitle1-text-decoration, inherit);\n  text-decoration: var(--mdc-typography-subtitle1-text-decoration, inherit);\n  text-transform: inherit;\n  /* @alternate */\n  text-transform: var(--mdc-typography-subtitle1-text-transform, inherit);\n  height: 28px;\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  white-space: nowrap; }\n\n.mdc-text-field--label-floating .mdc-text-field__affix, .mdc-text-field--no-label .mdc-text-field__affix {\n  opacity: 1; }\n\n.mdc-text-field__affix--prefix {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 2px; }\n\n[dir=rtl] .mdc-text-field__affix--prefix, .mdc-text-field__affix--prefix[dir=rtl] {\n  /* @noflip */\n  padding-left: 2px;\n  /* @noflip */\n  padding-right: 0; }\n\n.mdc-text-field--end-aligned .mdc-text-field__affix--prefix {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 12px; }\n\n[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--prefix, .mdc-text-field--end-aligned .mdc-text-field__affix--prefix[dir=rtl] {\n  /* @noflip */\n  padding-left: 12px;\n  /* @noflip */\n  padding-right: 0; }\n\n.mdc-text-field__affix--suffix {\n  /* @noflip */\n  padding-left: 12px;\n  /* @noflip */\n  padding-right: 0; }\n\n[dir=rtl] .mdc-text-field__affix--suffix, .mdc-text-field__affix--suffix[dir=rtl] {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 12px; }\n\n.mdc-text-field--end-aligned .mdc-text-field__affix--suffix {\n  /* @noflip */\n  padding-left: 2px;\n  /* @noflip */\n  padding-right: 0; }\n\n[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--suffix, .mdc-text-field--end-aligned .mdc-text-field__affix--suffix[dir=rtl] {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 2px; }\n\n.mdc-text-field__input:-webkit-autofill + .mdc-floating-label {\n  -webkit-transform: translateY(-50%) scale(0.75);\n  transform: translateY(-50%) scale(0.75);\n  cursor: auto; }\n\n.mdc-text-field--filled {\n  height: 56px; }\n\n.mdc-text-field--filled .mdc-text-field__ripple::before,\n.mdc-text-field--filled .mdc-text-field__ripple::after {\n  background-color: rgba(0, 0, 0, 0.87); }\n\n.mdc-text-field--filled:hover .mdc-text-field__ripple::before {\n  opacity: 0.04; }\n\n.mdc-text-field--filled.mdc-ripple-upgraded--background-focused .mdc-text-field__ripple::before, .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {\n  transition-duration: 75ms;\n  opacity: 0.12; }\n\n.mdc-text-field--filled::before {\n  display: inline-block;\n  width: 0;\n  height: 40px;\n  content: \"\";\n  vertical-align: 0; }\n\n.mdc-text-field--filled:not(.mdc-text-field--disabled) {\n  background-color: whitesmoke; }\n\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {\n  border-bottom-color: rgba(0, 0, 0, 0.42); }\n\n.mdc-text-field--filled:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before {\n  border-bottom-color: rgba(0, 0, 0, 0.87); }\n\n.mdc-text-field--filled .mdc-line-ripple::after {\n  border-bottom-color: #6200ee;\n  /* @alternate */\n  border-bottom-color: var(--mdc-theme-primary, #6200ee); }\n\n.mdc-text-field--filled .mdc-floating-label {\n  /* @noflip */\n  left: 16px;\n  /* @noflip */\n  right: initial; }\n\n[dir=rtl] .mdc-text-field--filled .mdc-floating-label, .mdc-text-field--filled .mdc-floating-label[dir=rtl] {\n  /* @noflip */\n  left: initial;\n  /* @noflip */\n  right: 16px; }\n\n.mdc-text-field--filled .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-106%) scale(0.75);\n  transform: translateY(-106%) scale(0.75); }\n\n.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {\n  height: 100%; }\n\n.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {\n  display: none; }\n\n.mdc-text-field--filled.mdc-text-field--no-label::before {\n  display: none; }\n\n.mdc-text-field--outlined {\n  height: 56px;\n  overflow: visible; }\n\n.mdc-text-field--outlined .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-37.25px) scale(1);\n  transform: translateY(-37.25px) scale(1); }\n\n.mdc-text-field--outlined .mdc-floating-label--float-above {\n  font-size: 0.75rem; }\n\n.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-34.75px) scale(0.75);\n  transform: translateY(-34.75px) scale(0.75); }\n\n.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem; }\n\n.mdc-text-field--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined 250ms 1; }\n\n@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75); } }\n\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75); } }\n\n.mdc-text-field--outlined .mdc-text-field__input {\n  height: 100%; }\n\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.38); }\n\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.87); }\n\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #6200ee;\n  /* @alternate */\n  border-color: var(--mdc-theme-primary, #6200ee); }\n\n.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {\n  /* @noflip */\n  border-radius: 4px 0 0 4px; }\n\n[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading, .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl] {\n  /* @noflip */\n  border-radius: 0 4px 4px 0; }\n\n.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing {\n  /* @noflip */\n  border-radius: 0 4px 4px 0; }\n\n[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl] {\n  /* @noflip */\n  border-radius: 4px 0 0 4px; }\n\n.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-top: 1px; }\n\n.mdc-text-field--outlined .mdc-text-field__ripple::before,\n.mdc-text-field--outlined .mdc-text-field__ripple::after {\n  content: none; }\n\n.mdc-text-field--outlined .mdc-floating-label {\n  /* @noflip */\n  left: 4px;\n  /* @noflip */\n  right: initial; }\n\n[dir=rtl] .mdc-text-field--outlined .mdc-floating-label, .mdc-text-field--outlined .mdc-floating-label[dir=rtl] {\n  /* @noflip */\n  left: initial;\n  /* @noflip */\n  right: 4px; }\n\n.mdc-text-field--outlined .mdc-text-field__input {\n  display: flex;\n  border: none !important;\n  background-color: transparent;\n  z-index: 1; }\n\n.mdc-text-field--outlined .mdc-text-field__icon {\n  z-index: 2; }\n\n.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-top: 2px; }\n\n.mdc-text-field--textarea {\n  align-items: center;\n  width: auto;\n  height: auto;\n  padding: 0;\n  overflow: visible;\n  transition: none; }\n\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.38); }\n\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.87); }\n\n.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #6200ee;\n  /* @alternate */\n  border-color: var(--mdc-theme-primary, #6200ee); }\n\n.mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading {\n  /* @noflip */\n  border-radius: 4px 0 0 4px; }\n\n[dir=rtl] .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading, .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl] {\n  /* @noflip */\n  border-radius: 0 4px 4px 0; }\n\n.mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing {\n  /* @noflip */\n  border-radius: 0 4px 4px 0; }\n\n[dir=rtl] .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing, .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl] {\n  /* @noflip */\n  border-radius: 4px 0 0 4px; }\n\n.mdc-text-field--textarea .mdc-text-field__ripple::before,\n.mdc-text-field--textarea .mdc-text-field__ripple::after {\n  content: none; }\n\n.mdc-text-field--textarea:not(.mdc-text-field--disabled) {\n  background-color: transparent; }\n\n.mdc-text-field--textarea .mdc-text-field-character-counter {\n  /* @noflip */\n  left: initial;\n  /* @noflip */\n  right: 16px;\n  position: absolute;\n  bottom: 13px; }\n\n[dir=rtl] .mdc-text-field--textarea .mdc-text-field-character-counter, .mdc-text-field--textarea .mdc-text-field-character-counter[dir=rtl] {\n  /* @noflip */\n  left: 16px;\n  /* @noflip */\n  right: initial; }\n\n.mdc-text-field--textarea .mdc-floating-label {\n  /* @noflip */\n  left: 4px;\n  /* @noflip */\n  right: initial;\n  top: 17px;\n  width: auto; }\n\n[dir=rtl] .mdc-text-field--textarea .mdc-floating-label, .mdc-text-field--textarea .mdc-floating-label[dir=rtl] {\n  /* @noflip */\n  left: initial;\n  /* @noflip */\n  right: 4px; }\n\n.mdc-text-field--textarea .mdc-floating-label:not(.mdc-floating-label--float-above) {\n  -webkit-transform: none;\n  transform: none; }\n\n.mdc-text-field--textarea .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-144%) scale(1);\n  transform: translateY(-144%) scale(1); }\n\n.mdc-text-field--textarea .mdc-floating-label--float-above {\n  font-size: 0.75rem; }\n\n.mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-130%) scale(0.75);\n  transform: translateY(-130%) scale(0.75); }\n\n.mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem; }\n\n.mdc-text-field--textarea .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-textarea 250ms 1;\n  animation: mdc-floating-label-shake-float-above-textarea 250ms 1; }\n\n@-webkit-keyframes mdc-floating-label-shake-float-above-textarea {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); } }\n\n@keyframes mdc-floating-label-shake-float-above-textarea {\n  0% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(4% - 0%)) translateY(-130%) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(-4% - 0%)) translateY(-130%) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75);\n    transform: translateX(calc(0 - 0%)) translateY(-130%) scale(0.75); } }\n\n.mdc-text-field--textarea .mdc-text-field__input {\n  height: auto;\n  align-self: stretch;\n  box-sizing: border-box;\n  margin-top: 8px;\n  margin-bottom: 1px;\n  /* @noflip */\n  margin-left: 0;\n  /* @noflip */\n  margin-right: 1px;\n  padding: 0 16px 16px;\n  line-height: 1.75rem; }\n\n[dir=rtl] .mdc-text-field--textarea .mdc-text-field__input, .mdc-text-field--textarea .mdc-text-field__input[dir=rtl] {\n  /* @noflip */\n  margin-left: 1px;\n  /* @noflip */\n  margin-right: 0; }\n\n.mdc-text-field--textarea .mdc-text-field-character-counter + .mdc-text-field__input {\n  margin-bottom: 28px;\n  padding-bottom: 0; }\n\n.mdc-text-field--fullwidth {\n  padding: 0;\n  width: 100%; }\n\n.mdc-text-field--fullwidth:not(.mdc-text-field--disabled) .mdc-line-ripple::before {\n  border-bottom-color: rgba(0, 0, 0, 0.42); }\n\n.mdc-text-field--fullwidth.mdc-text-field--disabled .mdc-line-ripple::before {\n  border-bottom-color: rgba(0, 0, 0, 0.42); }\n\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) {\n  display: flex; }\n\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__input {\n  height: 100%; }\n\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-floating-label {\n  display: none; }\n\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea)::before {\n  display: none; }\n\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__ripple::before,\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__ripple::after {\n  content: none; }\n\n.mdc-text-field--fullwidth:not(.mdc-text-field--textarea):not(.mdc-text-field--disabled) {\n  background-color: transparent; }\n\n.mdc-text-field--fullwidth.mdc-text-field--textarea .mdc-text-field__input {\n  resize: vertical; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label {\n  max-width: calc(100% - 48px);\n  /* @noflip */\n  left: 48px;\n  /* @noflip */\n  right: initial; }\n\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label, .mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label[dir=rtl] {\n  /* @noflip */\n  left: initial;\n  /* @noflip */\n  right: 48px; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label--float-above {\n  max-width: calc(100% / 0.75 - 64px / 0.75); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label {\n  /* @noflip */\n  left: 36px;\n  /* @noflip */\n  right: initial; }\n\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl] {\n  /* @noflip */\n  left: initial;\n  /* @noflip */\n  right: 36px; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch {\n  max-width: calc(100% - 60px); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-37.25px) translateX(-32px) scale(1);\n  transform: translateY(-37.25px) translateX(-32px) scale(1); }\n\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl] {\n  -webkit-transform: translateY(-37.25px) translateX(32px) scale(1);\n  transform: translateY(-37.25px) translateX(32px) scale(1); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {\n  font-size: 0.75rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  -webkit-transform: translateY(-34.75px) translateX(-32px) scale(0.75);\n  transform: translateY(-34.75px) translateX(-32px) scale(0.75); }\n\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl] {\n  -webkit-transform: translateY(-34.75px) translateX(32px) scale(0.75);\n  transform: translateY(-34.75px) translateX(32px) scale(0.75); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem; }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1; }\n\n@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75); } }\n\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {\n  0% {\n    -webkit-transform: translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75); } }\n\n[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake, .mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake {\n  -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1;\n  animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1; }\n\n@-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75); } }\n\n@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl {\n  0% {\n    -webkit-transform: translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75); }\n  33% {\n    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582);\n    -webkit-transform: translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75); }\n  66% {\n    -webkit-animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635);\n    -webkit-transform: translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75); }\n  100% {\n    -webkit-transform: translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75);\n    transform: translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75); } }\n\n.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label {\n  max-width: calc(100% - 64px); }\n\n.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above {\n  max-width: calc(100% / 0.75 - 64px / 0.75); }\n\n.mdc-text-field--with-trailing-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch {\n  max-width: calc(100% - 60px); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label {\n  max-width: calc(100% - 96px); }\n\n.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above {\n  max-width: calc(100% / 0.75 - 96px / 0.75); }\n\n.mdc-text-field__input:required ~ .mdc-floating-label::after,\n.mdc-text-field__input:required ~ .mdc-notched-outline .mdc-floating-label::after {\n  margin-left: 1px;\n  content: \"*\"; }\n\n.mdc-text-field-helper-line {\n  display: flex;\n  justify-content: space-between;\n  box-sizing: border-box; }\n\n.mdc-text-field + .mdc-text-field-helper-line {\n  padding-right: 16px;\n  padding-left: 16px; }\n\n.mdc-form-field > .mdc-text-field + label {\n  align-self: flex-start; }\n\n.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: rgba(98, 0, 238, 0.87); }\n\n.mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-width: 2px; }\n\n.mdc-text-field--focused + .mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg) {\n  opacity: 1; }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before {\n  border-bottom-color: #b00020;\n  /* @alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {\n  border-bottom-color: #b00020;\n  /* @alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: #b00020;\n  /* @alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid + .mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg {\n  color: #b00020;\n  /* @alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid .mdc-text-field__input {\n  caret-color: #b00020;\n  /* @alternate */\n  caret-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing {\n  color: #b00020;\n  /* @alternate */\n  color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before {\n  border-bottom-color: #b00020;\n  /* @alternate */\n  border-bottom-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,\n.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* @alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,\n.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* @alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,\n.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,\n.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {\n  border-color: #b00020;\n  /* @alternate */\n  border-color: var(--mdc-theme-error, #b00020); }\n\n.mdc-text-field--invalid + .mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg {\n  opacity: 1; }\n\n.mdc-text-field--disabled {\n  pointer-events: none; }\n\n.mdc-text-field--disabled .mdc-text-field__input {\n  color: rgba(0, 0, 0, 0.38); }\n\n@media all {\n  .mdc-text-field--disabled .mdc-text-field__input::-webkit-input-placeholder {\n    color: rgba(0, 0, 0, 0.38); }\n  .mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.38); }\n  .mdc-text-field--disabled .mdc-text-field__input::-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.38); }\n  .mdc-text-field--disabled .mdc-text-field__input::placeholder {\n    color: rgba(0, 0, 0, 0.38); } }\n\n@media all {\n  .mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder {\n    color: rgba(0, 0, 0, 0.38); } }\n\n.mdc-text-field--disabled .mdc-floating-label {\n  color: rgba(0, 0, 0, 0.38); }\n\n.mdc-text-field--disabled + .mdc-text-field-helper-line .mdc-text-field-helper-text {\n  color: rgba(0, 0, 0, 0.38); }\n\n.mdc-text-field--disabled .mdc-text-field-character-counter,\n.mdc-text-field--disabled + .mdc-text-field-helper-line .mdc-text-field-character-counter {\n  color: rgba(0, 0, 0, 0.38); }\n\n.mdc-text-field--disabled .mdc-text-field__icon--leading {\n  color: rgba(0, 0, 0, 0.3); }\n\n.mdc-text-field--disabled .mdc-text-field__icon--trailing {\n  color: rgba(0, 0, 0, 0.3); }\n\n.mdc-text-field--disabled .mdc-text-field__affix--prefix {\n  color: rgba(0, 0, 0, 0.38); }\n\n.mdc-text-field--disabled .mdc-text-field__affix--suffix {\n  color: rgba(0, 0, 0, 0.38); }\n\n.mdc-text-field--disabled .mdc-line-ripple::before {\n  border-bottom-color: rgba(0, 0, 0, 0.06); }\n\n.mdc-text-field--disabled .mdc-notched-outline__leading,\n.mdc-text-field--disabled .mdc-notched-outline__notch,\n.mdc-text-field--disabled .mdc-notched-outline__trailing {\n  border-color: rgba(0, 0, 0, 0.06); }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-text-field__input::-webkit-input-placeholder {\n    color: GrayText; }\n  .mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder {\n    color: GrayText; }\n  .mdc-text-field--disabled .mdc-text-field__input::-ms-input-placeholder {\n    color: GrayText; }\n  .mdc-text-field--disabled .mdc-text-field__input::placeholder {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-floating-label {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled + .mdc-text-field-helper-line .mdc-text-field-helper-text {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-text-field-character-counter,\n  .mdc-text-field--disabled + .mdc-text-field-helper-line .mdc-text-field-character-counter {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-text-field__icon--leading {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-text-field__icon--trailing {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-text-field__affix--prefix {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-text-field__affix--suffix {\n    color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-line-ripple::before {\n    border-bottom-color: GrayText; } }\n\n@media screen and (-ms-high-contrast: active) {\n  .mdc-text-field--disabled .mdc-notched-outline__leading,\n  .mdc-text-field--disabled .mdc-notched-outline__notch,\n  .mdc-text-field--disabled .mdc-notched-outline__trailing {\n    border-color: GrayText; } }\n\n.mdc-text-field--disabled .mdc-floating-label {\n  cursor: default; }\n\n.mdc-text-field--disabled.mdc-text-field--filled {\n  background-color: #fafafa; }\n\n.mdc-text-field--end-aligned .mdc-text-field__input {\n  /* @noflip */\n  text-align: right; }\n\n[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__input, .mdc-text-field--end-aligned .mdc-text-field__input[dir=rtl] {\n  /* @noflip */\n  text-align: left; }\n\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix, .mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input,\n.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix {\n  /* @noflip */\n  direction: ltr; }\n\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix, .mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix {\n  /* @noflip */\n  padding-left: 0;\n  /* @noflip */\n  padding-right: 2px; }\n\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix, .mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix {\n  /* @noflip */\n  padding-left: 12px;\n  /* @noflip */\n  padding-right: 0; }\n\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--leading, .mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--leading {\n  order: 1; }\n\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix, .mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix {\n  order: 2; }\n\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input, .mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input {\n  order: 3; }\n\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix, .mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix {\n  order: 4; }\n\n[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--trailing, .mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--trailing {\n  order: 5; }\n\n[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__input, .mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__input {\n  /* @noflip */\n  text-align: right; }\n\n[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--prefix, .mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--prefix {\n  /* @noflip */\n  padding-right: 12px; }\n\n[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--suffix, .mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--suffix {\n  /* @noflip */\n  padding-left: 2px; }\n";
styleInject(css_248z);

function TextInput(props) {
  p$1(() => {
    const username = new MDCTextField(document.querySelector('.mdc-text-field'));
  }, []);
  return h("label", {
    className: "mdc-text-field mdc-text-field--filled inputtext"
  }, h("span", {
    className: "mdc-text-field__ripple"
  }), h("input", {
    type: "text",
    className: "mdc-text-field__input",
    "aria-labelledby": "username-label",
    name: "username",
    required: true
  }), h("span", {
    className: "mdc-floating-label",
    id: "username-label"
  }, "Username"), h("span", {
    className: "mdc-line-ripple"
  }));
}

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

function Button(props) {
  const {
    title,
    style,
    id
  } = props;
  return h("button", _extends({
    className: "btn"
  }, props), title);
}

var actionTypes = {
  INPUT_VALUE_CHANGED: 'INPUT_VALUE_CHANGED',
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
  RECOVER_LOCAL_AUTH_STATE: 'RECOVER_LOCAL_AUTH_STATE',
  SERVER_ERROR_RECIEVED: 'SERVER_ERROR_RECIEVED'
};

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
  isPasswordChanged: false,
  authFeedback: null,
  user: null
};
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes.VALUE_CHANGED:
      const nextState = { ...state,
        [action.payload.propName]: action.payload.value
      };
      return nextState;

    case actionTypes.LOGIN_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.LOGIN_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        user: action.user,
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
        user: action.user,
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
        user: action.user,
        isPasswordChanged: true,
        authFeedback: action.message
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
        success: true,
        authFeedback: action.message
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

    case actionTypes.LOGOUT_SUCCESS:
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
  const [state, dispatch] = m$1(authReducer, initState);
  const value = s$1(() => [state, dispatch], [state]);
  return h(AuthContext.Provider, _extends({
    value: value
  }, props), h(AuthRouteProvider, null, children));
}

function valueChanged({
  propName,
  value
}) {
  return {
    type: actionTypes.VALUE_CHANGED,
    payload: {
      propName,
      value
    }
  };
}
function getTokenFromUrl({
  token
}) {
  return {
    type: actionTypes.GOT_TOKEN_FROM_URL,
    token
  };
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
  boxShadow: `0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)`,
  margin: 8,
  padding: 8
};
function Paper(props) {
  const {
    children
  } = props;
  return h("div", {
    style: style
  }, children);
}

function Grid(props) {
  const {
    children,
    width
  } = props;
  return h("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `auto ${width}% auto`
    }
  }, h("div", null), h("div", null, children), h("div", null));
}

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
function useAppRoute() {
  const [state, dispatch] = useAppRouteContext();
  const {
    name
  } = state;

  function onAppRoute({
    route,
    featureRoute
  }) {
    if (name) {
      localStorage.setItem(name, JSON.stringify({
        route,
        featureRoute
      }));
    }

    dispatch({
      type: actionTypes$1.APP_ROUTE_CHANGED,
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

function useUserName() {
  const [userName, setUsername] = v$1(null);
  const [token, setToken] = v$1(null);
  const [email, setEmail] = v$1('');
  const [objectId, setObjectId] = v$1(null);
  const {
    state
  } = useAuthContext();
  p$1(() => {
    if (window.localStorage.getItem('webcom')) {
      const {
        username,
        token,
        email,
        objectId
      } = JSON.parse(window.localStorage.getItem('webcom'));
      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId);
    }
  }, []);
  p$1(() => {
    if (state.user && state.user.token) {
      const {
        username,
        email,
        token,
        objectId
      } = state.user;
      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId);
    }
  }, [state.user]);
  return {
    username: userName,
    token,
    email
  };
}

function ChangePassword({
  changePassword
}) {
  const {
    state,
    dispatch
  } = useAuthContext();
  const {
    dispatch: formDispatch
  } = useFormContext();
  const {
    token
  } = useUserName();
  const {
    onAppRoute
  } = useAppRoute();
  const {
    device
  } = useMediaQuery();
  const {
    password,
    confirm,
    error
  } = state;
  p$1(() => {
    let url = new URL(window.location.href);
    var urltoken = url.searchParams.get('token');

    if (urltoken) {
      dispatch(getTokenFromUrl({
        token: urltoken
      }));
    }
  }, []);
  p$1(() => {
    if (state.authFeedback) {
      onAppRoute({
        featureRoute: '/authfeedback',
        route: '/auth'
      });
    }
  }, [state.authFeedback]);

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    dispatch(valueChanged({
      propName: name,
      value,
      dispatch,
      state
    }));
  }

  return h(Grid, {
    width: device === 'phone' ? 100 : 25
  }, h(Paper, null, h(TextInput, {
    value: password,
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Enter new password",
    onChange: handleChange //  validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}

  }), h(TextInput, {
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    placeholder: "Confirm new password",
    onChange: handleChange //   validationTypes={[validationTypes.PASSWORDS_MATCH_VALIDATION]}

  }), h(Button, {
    type: "button",
    "data-testid": "change-pass-btn",
    onClick: changePassword
  }, "CHANGE")));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLXBhc3N3b3JkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9kaXN0L3ByZWFjdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2hvb2tzL2Rpc3QvaG9va3MubW9kdWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvYmFzZS9mb3VuZGF0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC9iYXNlL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvZG9tL2V2ZW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvZG9tL3BvbnlmaWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC9mbG9hdGluZy1sYWJlbC9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL2Zsb2F0aW5nLWxhYmVsL2ZvdW5kYXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL2Zsb2F0aW5nLWxhYmVsL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvbGluZS1yaXBwbGUvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC9saW5lLXJpcHBsZS9mb3VuZGF0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC9saW5lLXJpcHBsZS9jb21wb25lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL25vdGNoZWQtb3V0bGluZS9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL25vdGNoZWQtb3V0bGluZS9mb3VuZGF0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC9ub3RjaGVkLW91dGxpbmUvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC9yaXBwbGUvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC9yaXBwbGUvdXRpbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvcmlwcGxlL2ZvdW5kYXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL3JpcHBsZS9jb21wb25lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL3RleHRmaWVsZC9jaGFyYWN0ZXItY291bnRlci9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL3RleHRmaWVsZC9jaGFyYWN0ZXItY291bnRlci9mb3VuZGF0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC90ZXh0ZmllbGQvY2hhcmFjdGVyLWNvdW50ZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC90ZXh0ZmllbGQvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC90ZXh0ZmllbGQvZm91bmRhdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvdGV4dGZpZWxkL2hlbHBlci10ZXh0L2NvbnN0YW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvdGV4dGZpZWxkL2hlbHBlci10ZXh0L2ZvdW5kYXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL3RleHRmaWVsZC9oZWxwZXItdGV4dC9jb21wb25lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1hdGVyaWFsL3RleHRmaWVsZC9pY29uL2NvbnN0YW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvdGV4dGZpZWxkL2ljb24vZm91bmRhdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWF0ZXJpYWwvdGV4dGZpZWxkL2ljb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtYXRlcmlhbC90ZXh0ZmllbGQvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9idXR0b24vaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aC1yb3V0ZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL2F1dGgtY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9sYXlvdXQvUGFwZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9sYXlvdXQvR3JpZC5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvYXBwLXJvdXRlL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL3VzZVVzZXJOYW1lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvQ2hhbmdlUGFzc3dvcmQuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy90aGVtZS90aGVtZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvQXV0aEZlZWRiYWNrLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL2NoYW5nZS1wYXNzd29yZC9jaGFuZ2UtcGFzc3dvcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHN1cHBvcnQgPSB7XG4gIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiZcbiAgICAnQmxvYicgaW4gc2VsZiAmJlxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxufVxuXG5mdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbn1cblxuaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gIF1cblxuICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPVxuICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgfVxuICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5eX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1c1xuICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG59XG5cbkJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICB1cmw6IHRoaXMudXJsXG4gIH0pXG59XG5cblJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG59XG5cbmV4cG9ydCB2YXIgRE9NRXhjZXB0aW9uID0gc2VsZi5ET01FeGNlcHRpb25cbnRyeSB7XG4gIG5ldyBET01FeGNlcHRpb24oKVxufSBjYXRjaCAoZXJyKSB7XG4gIERPTUV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG5hbWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpXG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrXG4gIH1cbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRE9NRXhjZXB0aW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaChpbnB1dCwgaW5pdCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCAmJiByZXF1ZXN0LnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgZnVuY3Rpb24gYWJvcnRYaHIoKSB7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgIH1cblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgfVxuICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgIH1cblxuICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICB9KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsKSB7XG4gICAgICByZXF1ZXN0LnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgcmVxdWVzdC5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gIH0pXG59XG5cbmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxuXG5pZiAoIXNlbGYuZmV0Y2gpIHtcbiAgc2VsZi5mZXRjaCA9IGZldGNoXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2Vcbn1cbiIsInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY3JlYXRlQmluZGluZyhvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG52YXIgTURDRm91bmRhdGlvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNRENGb3VuZGF0aW9uKGFkYXB0ZXIpIHtcbiAgICAgICAgaWYgKGFkYXB0ZXIgPT09IHZvaWQgMCkgeyBhZGFwdGVyID0ge307IH1cbiAgICAgICAgdGhpcy5hZGFwdGVyXyA9IGFkYXB0ZXI7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENGb3VuZGF0aW9uLCBcImNzc0NsYXNzZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIENsYXNzZXMgZXh0ZW5kaW5nIE1EQ0ZvdW5kYXRpb24gc2hvdWxkIGltcGxlbWVudCB0aGlzIG1ldGhvZCB0byByZXR1cm4gYW4gb2JqZWN0IHdoaWNoIGV4cG9ydHMgZXZlcnlcbiAgICAgICAgICAgIC8vIENTUyBjbGFzcyB0aGUgZm91bmRhdGlvbiBjbGFzcyBuZWVkcyBhcyBhIHByb3BlcnR5LiBlLmcuIHtBQ1RJVkU6ICdtZGMtY29tcG9uZW50LS1hY3RpdmUnfVxuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDRm91bmRhdGlvbiwgXCJzdHJpbmdzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBDbGFzc2VzIGV4dGVuZGluZyBNRENGb3VuZGF0aW9uIHNob3VsZCBpbXBsZW1lbnQgdGhpcyBtZXRob2QgdG8gcmV0dXJuIGFuIG9iamVjdCB3aGljaCBleHBvcnRzIGFsbFxuICAgICAgICAgICAgLy8gc2VtYW50aWMgc3RyaW5ncyBhcyBjb25zdGFudHMuIGUuZy4ge0FSSUFfUk9MRTogJ3RhYmxpc3QnfVxuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDRm91bmRhdGlvbiwgXCJudW1iZXJzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBDbGFzc2VzIGV4dGVuZGluZyBNRENGb3VuZGF0aW9uIHNob3VsZCBpbXBsZW1lbnQgdGhpcyBtZXRob2QgdG8gcmV0dXJuIGFuIG9iamVjdCB3aGljaCBleHBvcnRzIGFsbFxuICAgICAgICAgICAgLy8gb2YgaXRzIHNlbWFudGljIG51bWJlcnMgYXMgY29uc3RhbnRzLiBlLmcuIHtBTklNQVRJT05fREVMQVlfTVM6IDM1MH1cbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ0ZvdW5kYXRpb24sIFwiZGVmYXVsdEFkYXB0ZXJcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIENsYXNzZXMgZXh0ZW5kaW5nIE1EQ0ZvdW5kYXRpb24gbWF5IGNob29zZSB0byBpbXBsZW1lbnQgdGhpcyBnZXR0ZXIgaW4gb3JkZXIgdG8gcHJvdmlkZSBhIGNvbnZlbmllbnRcbiAgICAgICAgICAgIC8vIHdheSBvZiB2aWV3aW5nIHRoZSBuZWNlc3NhcnkgbWV0aG9kcyBvZiBhbiBhZGFwdGVyLiBJbiB0aGUgZnV0dXJlLCB0aGlzIGNvdWxkIGFsc28gYmUgdXNlZCBmb3IgYWRhcHRlclxuICAgICAgICAgICAgLy8gdmFsaWRhdGlvbi5cbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTURDRm91bmRhdGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU3ViY2xhc3NlcyBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gcGVyZm9ybSBpbml0aWFsaXphdGlvbiByb3V0aW5lcyAocmVnaXN0ZXJpbmcgZXZlbnRzLCBldGMuKVxuICAgIH07XG4gICAgTURDRm91bmRhdGlvbi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU3ViY2xhc3NlcyBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gcGVyZm9ybSBkZS1pbml0aWFsaXphdGlvbiByb3V0aW5lcyAoZGUtcmVnaXN0ZXJpbmcgZXZlbnRzLCBldGMuKVxuICAgIH07XG4gICAgcmV0dXJuIE1EQ0ZvdW5kYXRpb247XG59KCkpO1xuZXhwb3J0IHsgTURDRm91bmRhdGlvbiB9O1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWRlZmF1bHQtZXhwb3J0IE5lZWRlZCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIE1EQyBXZWIgdjAuNDQuMCBhbmQgZWFybGllci5cbmV4cG9ydCBkZWZhdWx0IE1EQ0ZvdW5kYXRpb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3VuZGF0aW9uLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuaW1wb3J0IHsgX19yZWFkLCBfX3NwcmVhZCB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgTURDRm91bmRhdGlvbiB9IGZyb20gJy4vZm91bmRhdGlvbic7XG52YXIgTURDQ29tcG9uZW50ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1EQ0NvbXBvbmVudChyb290LCBmb3VuZGF0aW9uKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdF8gPSByb290O1xuICAgICAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgX19zcHJlYWQoYXJncykpO1xuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgaW5pdGlhbGl6ZSBmb3VuZGF0aW9uIGhlcmUgYW5kIG5vdCB3aXRoaW4gdGhlIGNvbnN0cnVjdG9yJ3MgZGVmYXVsdCBwYXJhbSBzbyB0aGF0XG4gICAgICAgIC8vIHRoaXMucm9vdF8gaXMgZGVmaW5lZCBhbmQgY2FuIGJlIHVzZWQgd2l0aGluIHRoZSBmb3VuZGF0aW9uIGNsYXNzLlxuICAgICAgICB0aGlzLmZvdW5kYXRpb25fID0gZm91bmRhdGlvbiA9PT0gdW5kZWZpbmVkID8gdGhpcy5nZXREZWZhdWx0Rm91bmRhdGlvbigpIDogZm91bmRhdGlvbjtcbiAgICAgICAgdGhpcy5mb3VuZGF0aW9uXy5pbml0KCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbFN5bmNXaXRoRE9NKCk7XG4gICAgfVxuICAgIE1EQ0NvbXBvbmVudC5hdHRhY2hUbyA9IGZ1bmN0aW9uIChyb290KSB7XG4gICAgICAgIC8vIFN1YmNsYXNzZXMgd2hpY2ggZXh0ZW5kIE1EQ0Jhc2Ugc2hvdWxkIHByb3ZpZGUgYW4gYXR0YWNoVG8oKSBtZXRob2QgdGhhdCB0YWtlcyBhIHJvb3QgZWxlbWVudCBhbmRcbiAgICAgICAgLy8gcmV0dXJucyBhbiBpbnN0YW50aWF0ZWQgY29tcG9uZW50IHdpdGggaXRzIHJvb3Qgc2V0IHRvIHRoYXQgZWxlbWVudC4gQWxzbyBub3RlIHRoYXQgaW4gdGhlIGNhc2VzIG9mXG4gICAgICAgIC8vIHN1YmNsYXNzZXMsIGFuIGV4cGxpY2l0IGZvdW5kYXRpb24gY2xhc3Mgd2lsbCBub3QgaGF2ZSB0byBiZSBwYXNzZWQgaW47IGl0IHdpbGwgc2ltcGx5IGJlIGluaXRpYWxpemVkXG4gICAgICAgIC8vIGZyb20gZ2V0RGVmYXVsdEZvdW5kYXRpb24oKS5cbiAgICAgICAgcmV0dXJuIG5ldyBNRENDb21wb25lbnQocm9vdCwgbmV3IE1EQ0ZvdW5kYXRpb24oe30pKTtcbiAgICB9O1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBtZXRob2QgcGFyYW0gb25seSBleGlzdHMgZm9yIHR5cGluZyBwdXJwb3NlczsgaXQgZG9lcyBub3QgbmVlZCB0byBiZSB1bml0IHRlc3RlZCAqL1xuICAgIE1EQ0NvbXBvbmVudC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBfYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIC8vIFN1YmNsYXNzZXMgY2FuIG92ZXJyaWRlIHRoaXMgdG8gZG8gYW55IGFkZGl0aW9uYWwgc2V0dXAgd29yayB0aGF0IHdvdWxkIGJlIGNvbnNpZGVyZWQgcGFydCBvZiBhXG4gICAgICAgIC8vIFwiY29uc3RydWN0b3JcIi4gRXNzZW50aWFsbHksIGl0IGlzIGEgaG9vayBpbnRvIHRoZSBwYXJlbnQgY29uc3RydWN0b3IgYmVmb3JlIHRoZSBmb3VuZGF0aW9uIGlzXG4gICAgICAgIC8vIGluaXRpYWxpemVkLiBBbnkgYWRkaXRpb25hbCBhcmd1bWVudHMgYmVzaWRlcyByb290IGFuZCBmb3VuZGF0aW9uIHdpbGwgYmUgcGFzc2VkIGluIGhlcmUuXG4gICAgfTtcbiAgICBNRENDb21wb25lbnQucHJvdG90eXBlLmdldERlZmF1bHRGb3VuZGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTdWJjbGFzc2VzIG11c3Qgb3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gcmV0dXJuIGEgcHJvcGVybHkgY29uZmlndXJlZCBmb3VuZGF0aW9uIGNsYXNzIGZvciB0aGVcbiAgICAgICAgLy8gY29tcG9uZW50LlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1YmNsYXNzZXMgbXVzdCBvdmVycmlkZSBnZXREZWZhdWx0Rm91bmRhdGlvbiB0byByZXR1cm4gYSBwcm9wZXJseSBjb25maWd1cmVkICcgK1xuICAgICAgICAgICAgJ2ZvdW5kYXRpb24gY2xhc3MnKTtcbiAgICB9O1xuICAgIE1EQ0NvbXBvbmVudC5wcm90b3R5cGUuaW5pdGlhbFN5bmNXaXRoRE9NID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTdWJjbGFzc2VzIHNob3VsZCBvdmVycmlkZSB0aGlzIG1ldGhvZCBpZiB0aGV5IG5lZWQgdG8gcGVyZm9ybSB3b3JrIHRvIHN5bmNocm9uaXplIHdpdGggYSBob3N0IERPTVxuICAgICAgICAvLyBvYmplY3QuIEFuIGV4YW1wbGUgb2YgdGhpcyB3b3VsZCBiZSBhIGZvcm0gY29udHJvbCB3cmFwcGVyIHRoYXQgbmVlZHMgdG8gc3luY2hyb25pemUgaXRzIGludGVybmFsIHN0YXRlXG4gICAgICAgIC8vIHRvIHNvbWUgcHJvcGVydHkgb3IgYXR0cmlidXRlIG9mIHRoZSBob3N0IERPTS4gUGxlYXNlIG5vdGU6IHRoaXMgaXMgKm5vdCogdGhlIHBsYWNlIHRvIHBlcmZvcm0gRE9NXG4gICAgICAgIC8vIHJlYWRzL3dyaXRlcyB0aGF0IHdvdWxkIGNhdXNlIGxheW91dCAvIHBhaW50LCBhcyB0aGlzIGlzIGNhbGxlZCBzeW5jaHJvbm91c2x5IGZyb20gd2l0aGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICB9O1xuICAgIE1EQ0NvbXBvbmVudC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU3ViY2xhc3NlcyBtYXkgaW1wbGVtZW50IHRoaXMgbWV0aG9kIHRvIHJlbGVhc2UgYW55IHJlc291cmNlcyAvIGRlcmVnaXN0ZXIgYW55IGxpc3RlbmVycyB0aGV5IGhhdmVcbiAgICAgICAgLy8gYXR0YWNoZWQuIEFuIGV4YW1wbGUgb2YgdGhpcyBtaWdodCBiZSBkZXJlZ2lzdGVyaW5nIGEgcmVzaXplIGV2ZW50IGZyb20gdGhlIHdpbmRvdyBvYmplY3QuXG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8uZGVzdHJveSgpO1xuICAgIH07XG4gICAgTURDQ29tcG9uZW50LnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbiAoZXZ0VHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLnJvb3RfLmFkZEV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgfTtcbiAgICBNRENDb21wb25lbnQucHJvdG90eXBlLnVubGlzdGVuID0gZnVuY3Rpb24gKGV2dFR5cGUsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5yb290Xy5yZW1vdmVFdmVudExpc3RlbmVyKGV2dFR5cGUsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRmlyZXMgYSBjcm9zcy1icm93c2VyLWNvbXBhdGlibGUgY3VzdG9tIGV2ZW50IGZyb20gdGhlIGNvbXBvbmVudCByb290IG9mIHRoZSBnaXZlbiB0eXBlLCB3aXRoIHRoZSBnaXZlbiBkYXRhLlxuICAgICAqL1xuICAgIE1EQ0NvbXBvbmVudC5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldnRUeXBlLCBldnREYXRhLCBzaG91bGRCdWJibGUpIHtcbiAgICAgICAgaWYgKHNob3VsZEJ1YmJsZSA9PT0gdm9pZCAwKSB7IHNob3VsZEJ1YmJsZSA9IGZhbHNlOyB9XG4gICAgICAgIHZhciBldnQ7XG4gICAgICAgIGlmICh0eXBlb2YgQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGV2dCA9IG5ldyBDdXN0b21FdmVudChldnRUeXBlLCB7XG4gICAgICAgICAgICAgICAgYnViYmxlczogc2hvdWxkQnViYmxlLFxuICAgICAgICAgICAgICAgIGRldGFpbDogZXZ0RGF0YSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgICAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2dFR5cGUsIHNob3VsZEJ1YmJsZSwgZmFsc2UsIGV2dERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdF8uZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH07XG4gICAgcmV0dXJuIE1EQ0NvbXBvbmVudDtcbn0oKSk7XG5leHBvcnQgeyBNRENDb21wb25lbnQgfTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1kZWZhdWx0LWV4cG9ydCBOZWVkZWQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBNREMgV2ViIHYwLjQ0LjAgYW5kIGVhcmxpZXIuXG5leHBvcnQgZGVmYXVsdCBNRENDb21wb25lbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wb25lbnQuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBjdXJyZW50IGJyb3dzZXIgc3VwcG9ydHMgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMsIGFuZFxuICogaWYgc28sIHVzZSB0aGVtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQYXNzaXZlKGdsb2JhbE9iaikge1xuICAgIGlmIChnbG9iYWxPYmogPT09IHZvaWQgMCkgeyBnbG9iYWxPYmogPSB3aW5kb3c7IH1cbiAgICByZXR1cm4gc3VwcG9ydHNQYXNzaXZlT3B0aW9uKGdsb2JhbE9iaikgP1xuICAgICAgICB7IHBhc3NpdmU6IHRydWUgfSA6XG4gICAgICAgIGZhbHNlO1xufVxuZnVuY3Rpb24gc3VwcG9ydHNQYXNzaXZlT3B0aW9uKGdsb2JhbE9iaikge1xuICAgIGlmIChnbG9iYWxPYmogPT09IHZvaWQgMCkgeyBnbG9iYWxPYmogPSB3aW5kb3c7IH1cbiAgICAvLyBTZWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRXZlbnRUYXJnZXQvYWRkRXZlbnRMaXN0ZW5lclxuICAgIHZhciBwYXNzaXZlU3VwcG9ydGVkID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGJyb3dzZXJcbiAgICAgICAgICAgIC8vIGF0dGVtcHRzIHRvIGFjY2VzcyB0aGUgcGFzc2l2ZSBwcm9wZXJ0eS5cbiAgICAgICAgICAgIGdldCBwYXNzaXZlKCkge1xuICAgICAgICAgICAgICAgIHBhc3NpdmVTdXBwb3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgICAgIGdsb2JhbE9iai5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0ZXN0JywgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgICAgIGdsb2JhbE9iai5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0ZXN0JywgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgcGFzc2l2ZVN1cHBvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcGFzc2l2ZVN1cHBvcnRlZDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV2ZW50cy5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbi8qKlxuICogQGZpbGVvdmVydmlldyBBIFwicG9ueWZpbGxcIiBpcyBhIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBtb2RpZnkgdGhlIGdsb2JhbCBwcm90b3R5cGUgY2hhaW4uXG4gKiBUaGlzIG1ha2VzIHBvbnlmaWxscyBzYWZlciB0aGFuIHRyYWRpdGlvbmFsIHBvbHlmaWxscywgZXNwZWNpYWxseSBmb3IgbGlicmFyaWVzIGxpa2UgTURDLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VzdChlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIGlmIChlbGVtZW50LmNsb3Nlc3QpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuY2xvc2VzdChzZWxlY3Rvcik7XG4gICAgfVxuICAgIHZhciBlbCA9IGVsZW1lbnQ7XG4gICAgd2hpbGUgKGVsKSB7XG4gICAgICAgIGlmIChtYXRjaGVzKGVsLCBzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfVxuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoZXMoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICB2YXIgbmF0aXZlTWF0Y2hlcyA9IGVsZW1lbnQubWF0Y2hlc1xuICAgICAgICB8fCBlbGVtZW50LndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICAgICAgICB8fCBlbGVtZW50Lm1zTWF0Y2hlc1NlbGVjdG9yO1xuICAgIHJldHVybiBuYXRpdmVNYXRjaGVzLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpO1xufVxuLyoqXG4gKiBVc2VkIHRvIGNvbXB1dGUgdGhlIGVzdGltYXRlZCBzY3JvbGwgd2lkdGggb2YgZWxlbWVudHMuIFdoZW4gYW4gZWxlbWVudCBpc1xuICogaGlkZGVuIGR1ZSB0byBkaXNwbGF5OiBub25lOyBiZWluZyBhcHBsaWVkIHRvIGEgcGFyZW50IGVsZW1lbnQsIHRoZSB3aWR0aCBpc1xuICogcmV0dXJuZWQgYXMgMC4gSG93ZXZlciwgdGhlIGVsZW1lbnQgd2lsbCBoYXZlIGEgdHJ1ZSB3aWR0aCBvbmNlIG5vIGxvbmdlclxuICogaW5zaWRlIGEgZGlzcGxheTogbm9uZSBjb250ZXh0LiBUaGlzIG1ldGhvZCBjb21wdXRlcyBhbiBlc3RpbWF0ZWQgd2lkdGggd2hlblxuICogdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIHJldHVybnMgdGhlIHRydWUgd2lkdGggd2hlbiB0aGUgZWxlbWVudCBpcyB2aXNibGUuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgdGhlIGVsZW1lbnQgd2hvc2Ugd2lkdGggdG8gZXN0aW1hdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzdGltYXRlU2Nyb2xsV2lkdGgoZWxlbWVudCkge1xuICAgIC8vIENoZWNrIHRoZSBvZmZzZXRQYXJlbnQuIElmIHRoZSBlbGVtZW50IGluaGVyaXRzIGRpc3BsYXk6IG5vbmUgZnJvbSBhbnlcbiAgICAvLyBwYXJlbnQsIHRoZSBvZmZzZXRQYXJlbnQgcHJvcGVydHkgd2lsbCBiZSBudWxsIChzZWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQvb2Zmc2V0UGFyZW50KS5cbiAgICAvLyBUaGlzIGNoZWNrIGVuc3VyZXMgd2Ugb25seSBjbG9uZSB0aGUgbm9kZSB3aGVuIG5lY2Vzc2FyeS5cbiAgICB2YXIgaHRtbEVsID0gZWxlbWVudDtcbiAgICBpZiAoaHRtbEVsLm9mZnNldFBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gaHRtbEVsLnNjcm9sbFdpZHRoO1xuICAgIH1cbiAgICB2YXIgY2xvbmUgPSBodG1sRWwuY2xvbmVOb2RlKHRydWUpO1xuICAgIGNsb25lLnN0eWxlLnNldFByb3BlcnR5KCdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgIGNsb25lLnN0eWxlLnNldFByb3BlcnR5KCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC05OTk5cHgsIC05OTk5cHgpJyk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB2YXIgc2Nyb2xsV2lkdGggPSBjbG9uZS5zY3JvbGxXaWR0aDtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoY2xvbmUpO1xuICAgIHJldHVybiBzY3JvbGxXaWR0aDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBvbnlmaWxsLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuZXhwb3J0IHZhciBjc3NDbGFzc2VzID0ge1xuICAgIExBQkVMX0ZMT0FUX0FCT1ZFOiAnbWRjLWZsb2F0aW5nLWxhYmVsLS1mbG9hdC1hYm92ZScsXG4gICAgTEFCRUxfU0hBS0U6ICdtZGMtZmxvYXRpbmctbGFiZWwtLXNoYWtlJyxcbiAgICBST09UOiAnbWRjLWZsb2F0aW5nLWxhYmVsJyxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5pbXBvcnQgeyBfX2Fzc2lnbiwgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBNRENGb3VuZGF0aW9uIH0gZnJvbSAnQG1hdGVyaWFsL2Jhc2UvZm91bmRhdGlvbic7XG5pbXBvcnQgeyBjc3NDbGFzc2VzIH0gZnJvbSAnLi9jb25zdGFudHMnO1xudmFyIE1EQ0Zsb2F0aW5nTGFiZWxGb3VuZGF0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbihhZGFwdGVyKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbi5kZWZhdWx0QWRhcHRlciksIGFkYXB0ZXIpKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5zaGFrZUFuaW1hdGlvbkVuZEhhbmRsZXJfID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuaGFuZGxlU2hha2VBbmltYXRpb25FbmRfKCk7IH07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ0Zsb2F0aW5nTGFiZWxGb3VuZGF0aW9uLCBcImNzc0NsYXNzZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjc3NDbGFzc2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDRmxvYXRpbmdMYWJlbEZvdW5kYXRpb24sIFwiZGVmYXVsdEFkYXB0ZXJcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2VlIHtAbGluayBNRENGbG9hdGluZ0xhYmVsQWRhcHRlcn0gZm9yIHR5cGluZyBpbmZvcm1hdGlvbiBvbiBwYXJhbWV0ZXJzIGFuZCByZXR1cm4gdHlwZXMuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5cyBNZXRob2RzIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgYWRhcHRlciBpbnRlcmZhY2UuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFkZENsYXNzOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICBnZXRXaWR0aDogZnVuY3Rpb24gKCkgeyByZXR1cm4gMDsgfSxcbiAgICAgICAgICAgICAgICByZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIGRlcmVnaXN0ZXJJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5c1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5yZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcignYW5pbWF0aW9uZW5kJywgdGhpcy5zaGFrZUFuaW1hdGlvbkVuZEhhbmRsZXJfKTtcbiAgICB9O1xuICAgIE1EQ0Zsb2F0aW5nTGFiZWxGb3VuZGF0aW9uLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLmRlcmVnaXN0ZXJJbnRlcmFjdGlvbkhhbmRsZXIoJ2FuaW1hdGlvbmVuZCcsIHRoaXMuc2hha2VBbmltYXRpb25FbmRIYW5kbGVyXyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgbGFiZWwgZWxlbWVudC5cbiAgICAgKi9cbiAgICBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbi5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXJfLmdldFdpZHRoKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTdHlsZXMgdGhlIGxhYmVsIHRvIHByb2R1Y2UgYSBzaGFrZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgYW4gZXJyb3IuXG4gICAgICogQHBhcmFtIHNob3VsZFNoYWtlIElmIHRydWUsIGFkZHMgdGhlIHNoYWtlIENTUyBjbGFzczsgb3RoZXJ3aXNlLCByZW1vdmVzIHNoYWtlIGNsYXNzLlxuICAgICAqL1xuICAgIE1EQ0Zsb2F0aW5nTGFiZWxGb3VuZGF0aW9uLnByb3RvdHlwZS5zaGFrZSA9IGZ1bmN0aW9uIChzaG91bGRTaGFrZSkge1xuICAgICAgICB2YXIgTEFCRUxfU0hBS0UgPSBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbi5jc3NDbGFzc2VzLkxBQkVMX1NIQUtFO1xuICAgICAgICBpZiAoc2hvdWxkU2hha2UpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoTEFCRUxfU0hBS0UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5yZW1vdmVDbGFzcyhMQUJFTF9TSEFLRSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFN0eWxlcyB0aGUgbGFiZWwgdG8gZmxvYXQgb3IgZG9jay5cbiAgICAgKiBAcGFyYW0gc2hvdWxkRmxvYXQgSWYgdHJ1ZSwgYWRkcyB0aGUgZmxvYXQgQ1NTIGNsYXNzOyBvdGhlcndpc2UsIHJlbW92ZXMgZmxvYXQgYW5kIHNoYWtlIGNsYXNzZXMgdG8gZG9jayB0aGUgbGFiZWwuXG4gICAgICovXG4gICAgTURDRmxvYXRpbmdMYWJlbEZvdW5kYXRpb24ucHJvdG90eXBlLmZsb2F0ID0gZnVuY3Rpb24gKHNob3VsZEZsb2F0KSB7XG4gICAgICAgIHZhciBfYSA9IE1EQ0Zsb2F0aW5nTGFiZWxGb3VuZGF0aW9uLmNzc0NsYXNzZXMsIExBQkVMX0ZMT0FUX0FCT1ZFID0gX2EuTEFCRUxfRkxPQVRfQUJPVkUsIExBQkVMX1NIQUtFID0gX2EuTEFCRUxfU0hBS0U7XG4gICAgICAgIGlmIChzaG91bGRGbG9hdCkge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5hZGRDbGFzcyhMQUJFTF9GTE9BVF9BQk9WRSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZUNsYXNzKExBQkVMX0ZMT0FUX0FCT1ZFKTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoTEFCRUxfU0hBS0UpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbi5wcm90b3R5cGUuaGFuZGxlU2hha2VBbmltYXRpb25FbmRfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgTEFCRUxfU0hBS0UgPSBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbi5jc3NDbGFzc2VzLkxBQkVMX1NIQUtFO1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZUNsYXNzKExBQkVMX1NIQUtFKTtcbiAgICB9O1xuICAgIHJldHVybiBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbjtcbn0oTURDRm91bmRhdGlvbikpO1xuZXhwb3J0IHsgTURDRmxvYXRpbmdMYWJlbEZvdW5kYXRpb24gfTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1kZWZhdWx0LWV4cG9ydCBOZWVkZWQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBNREMgV2ViIHYwLjQ0LjAgYW5kIGVhcmxpZXIuXG5leHBvcnQgZGVmYXVsdCBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvdW5kYXRpb24uanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5pbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE1EQ0NvbXBvbmVudCB9IGZyb20gJ0BtYXRlcmlhbC9iYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBlc3RpbWF0ZVNjcm9sbFdpZHRoIH0gZnJvbSAnQG1hdGVyaWFsL2RvbS9wb255ZmlsbCc7XG5pbXBvcnQgeyBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbiB9IGZyb20gJy4vZm91bmRhdGlvbic7XG52YXIgTURDRmxvYXRpbmdMYWJlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTURDRmxvYXRpbmdMYWJlbCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNRENGbG9hdGluZ0xhYmVsKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIE1EQ0Zsb2F0aW5nTGFiZWwuYXR0YWNoVG8gPSBmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICByZXR1cm4gbmV3IE1EQ0Zsb2F0aW5nTGFiZWwocm9vdCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTdHlsZXMgdGhlIGxhYmVsIHRvIHByb2R1Y2UgdGhlIGxhYmVsIHNoYWtlIGZvciBlcnJvcnMuXG4gICAgICogQHBhcmFtIHNob3VsZFNoYWtlIElmIHRydWUsIHNoYWtlcyB0aGUgbGFiZWwgYnkgYWRkaW5nIGEgQ1NTIGNsYXNzOyBvdGhlcndpc2UsIHN0b3BzIHNoYWtpbmcgYnkgcmVtb3ZpbmcgdGhlIGNsYXNzLlxuICAgICAqL1xuICAgIE1EQ0Zsb2F0aW5nTGFiZWwucHJvdG90eXBlLnNoYWtlID0gZnVuY3Rpb24gKHNob3VsZFNoYWtlKSB7XG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8uc2hha2Uoc2hvdWxkU2hha2UpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU3R5bGVzIHRoZSBsYWJlbCB0byBmbG9hdC9kb2NrLlxuICAgICAqIEBwYXJhbSBzaG91bGRGbG9hdCBJZiB0cnVlLCBmbG9hdHMgdGhlIGxhYmVsIGJ5IGFkZGluZyBhIENTUyBjbGFzczsgb3RoZXJ3aXNlLCBkb2NrcyBpdCBieSByZW1vdmluZyB0aGUgY2xhc3MuXG4gICAgICovXG4gICAgTURDRmxvYXRpbmdMYWJlbC5wcm90b3R5cGUuZmxvYXQgPSBmdW5jdGlvbiAoc2hvdWxkRmxvYXQpIHtcbiAgICAgICAgdGhpcy5mb3VuZGF0aW9uXy5mbG9hdChzaG91bGRGbG9hdCk7XG4gICAgfTtcbiAgICBNRENGbG9hdGluZ0xhYmVsLnByb3RvdHlwZS5nZXRXaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm91bmRhdGlvbl8uZ2V0V2lkdGgoKTtcbiAgICB9O1xuICAgIE1EQ0Zsb2F0aW5nTGFiZWwucHJvdG90eXBlLmdldERlZmF1bHRGb3VuZGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBETyBOT1QgSU5MSU5FIHRoaXMgdmFyaWFibGUuIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBmb3VuZGF0aW9ucyB0YWtlIGEgUGFydGlhbDxNRENGb29BZGFwdGVyPi5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHdlIGRvbid0IGFjY2lkZW50YWxseSBvbWl0IGFueSBtZXRob2RzLCB3ZSBuZWVkIGEgc2VwYXJhdGUsIHN0cm9uZ2x5IHR5cGVkIGFkYXB0ZXIgdmFyaWFibGUuXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5cyBNZXRob2RzIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgYWRhcHRlciBpbnRlcmZhY2UuXG4gICAgICAgIHZhciBhZGFwdGVyID0ge1xuICAgICAgICAgICAgYWRkQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIF90aGlzLnJvb3RfLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTsgfSxcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7IHJldHVybiBfdGhpcy5yb290Xy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7IH0sXG4gICAgICAgICAgICBnZXRXaWR0aDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZXN0aW1hdGVTY3JvbGxXaWR0aChfdGhpcy5yb290Xyk7IH0sXG4gICAgICAgICAgICByZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKGV2dFR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMubGlzdGVuKGV2dFR5cGUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlcmVnaXN0ZXJJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uIChldnRUeXBlLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnVubGlzdGVuKGV2dFR5cGUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICAgICAgcmV0dXJuIG5ldyBNRENGbG9hdGluZ0xhYmVsRm91bmRhdGlvbihhZGFwdGVyKTtcbiAgICB9O1xuICAgIHJldHVybiBNRENGbG9hdGluZ0xhYmVsO1xufShNRENDb21wb25lbnQpKTtcbmV4cG9ydCB7IE1EQ0Zsb2F0aW5nTGFiZWwgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBvbmVudC5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbnZhciBjc3NDbGFzc2VzID0ge1xuICAgIExJTkVfUklQUExFX0FDVElWRTogJ21kYy1saW5lLXJpcHBsZS0tYWN0aXZlJyxcbiAgICBMSU5FX1JJUFBMRV9ERUFDVElWQVRJTkc6ICdtZGMtbGluZS1yaXBwbGUtLWRlYWN0aXZhdGluZycsXG59O1xuZXhwb3J0IHsgY3NzQ2xhc3NlcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uc3RhbnRzLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuaW1wb3J0IHsgX19hc3NpZ24sIF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgTURDRm91bmRhdGlvbiB9IGZyb20gJ0BtYXRlcmlhbC9iYXNlL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgY3NzQ2xhc3NlcyB9IGZyb20gJy4vY29uc3RhbnRzJztcbnZhciBNRENMaW5lUmlwcGxlRm91bmRhdGlvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTURDTGluZVJpcHBsZUZvdW5kYXRpb24sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTURDTGluZVJpcHBsZUZvdW5kYXRpb24oYWRhcHRlcikge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgTURDTGluZVJpcHBsZUZvdW5kYXRpb24uZGVmYXVsdEFkYXB0ZXIpLCBhZGFwdGVyKSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMudHJhbnNpdGlvbkVuZEhhbmRsZXJfID0gZnVuY3Rpb24gKGV2dCkgeyByZXR1cm4gX3RoaXMuaGFuZGxlVHJhbnNpdGlvbkVuZChldnQpOyB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENMaW5lUmlwcGxlRm91bmRhdGlvbiwgXCJjc3NDbGFzc2VzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3NzQ2xhc3NlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ0xpbmVSaXBwbGVGb3VuZGF0aW9uLCBcImRlZmF1bHRBZGFwdGVyXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlZSB7QGxpbmsgTURDTGluZVJpcHBsZUFkYXB0ZXJ9IGZvciB0eXBpbmcgaW5mb3JtYXRpb24gb24gcGFyYW1ldGVycyBhbmQgcmV0dXJuIHR5cGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXMgTWV0aG9kcyBzaG91bGQgYmUgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIGFkYXB0ZXIgaW50ZXJmYWNlLlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgaGFzQ2xhc3M6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuICAgICAgICAgICAgICAgIHNldFN0eWxlOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICBkZXJlZ2lzdGVyRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTURDTGluZVJpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8ucmVnaXN0ZXJFdmVudEhhbmRsZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLnRyYW5zaXRpb25FbmRIYW5kbGVyXyk7XG4gICAgfTtcbiAgICBNRENMaW5lUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5kZXJlZ2lzdGVyRXZlbnRIYW5kbGVyKCd0cmFuc2l0aW9uZW5kJywgdGhpcy50cmFuc2l0aW9uRW5kSGFuZGxlcl8pO1xuICAgIH07XG4gICAgTURDTGluZVJpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZUNsYXNzKGNzc0NsYXNzZXMuTElORV9SSVBQTEVfREVBQ1RJVkFUSU5HKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5hZGRDbGFzcyhjc3NDbGFzc2VzLkxJTkVfUklQUExFX0FDVElWRSk7XG4gICAgfTtcbiAgICBNRENMaW5lUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUuc2V0UmlwcGxlQ2VudGVyID0gZnVuY3Rpb24gKHhDb29yZGluYXRlKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uc2V0U3R5bGUoJ3RyYW5zZm9ybS1vcmlnaW4nLCB4Q29vcmRpbmF0ZSArIFwicHggY2VudGVyXCIpO1xuICAgIH07XG4gICAgTURDTGluZVJpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoY3NzQ2xhc3Nlcy5MSU5FX1JJUFBMRV9ERUFDVElWQVRJTkcpO1xuICAgIH07XG4gICAgTURDTGluZVJpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmhhbmRsZVRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIHRoZSBsaW5lIHJpcHBsZSB0byBiZSBlaXRoZXIgdHJhbnNwYXJlbnQgb3Igb3BhcXVlXG4gICAgICAgIC8vIGJlZm9yZSBlbWl0dGluZyB0aGUgYW5pbWF0aW9uIGVuZCBldmVudFxuICAgICAgICB2YXIgaXNEZWFjdGl2YXRpbmcgPSB0aGlzLmFkYXB0ZXJfLmhhc0NsYXNzKGNzc0NsYXNzZXMuTElORV9SSVBQTEVfREVBQ1RJVkFUSU5HKTtcbiAgICAgICAgaWYgKGV2dC5wcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5Jykge1xuICAgICAgICAgICAgaWYgKGlzRGVhY3RpdmF0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5yZW1vdmVDbGFzcyhjc3NDbGFzc2VzLkxJTkVfUklQUExFX0FDVElWRSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5yZW1vdmVDbGFzcyhjc3NDbGFzc2VzLkxJTkVfUklQUExFX0RFQUNUSVZBVElORyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBNRENMaW5lUmlwcGxlRm91bmRhdGlvbjtcbn0oTURDRm91bmRhdGlvbikpO1xuZXhwb3J0IHsgTURDTGluZVJpcHBsZUZvdW5kYXRpb24gfTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1kZWZhdWx0LWV4cG9ydCBOZWVkZWQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBNREMgV2ViIHYwLjQ0LjAgYW5kIGVhcmxpZXIuXG5leHBvcnQgZGVmYXVsdCBNRENMaW5lUmlwcGxlRm91bmRhdGlvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvdW5kYXRpb24uanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5pbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE1EQ0NvbXBvbmVudCB9IGZyb20gJ0BtYXRlcmlhbC9iYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBNRENMaW5lUmlwcGxlRm91bmRhdGlvbiB9IGZyb20gJy4vZm91bmRhdGlvbic7XG52YXIgTURDTGluZVJpcHBsZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTURDTGluZVJpcHBsZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNRENMaW5lUmlwcGxlKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIE1EQ0xpbmVSaXBwbGUuYXR0YWNoVG8gPSBmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICByZXR1cm4gbmV3IE1EQ0xpbmVSaXBwbGUocm9vdCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0ZXMgdGhlIGxpbmUgcmlwcGxlXG4gICAgICovXG4gICAgTURDTGluZVJpcHBsZS5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8uYWN0aXZhdGUoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERlYWN0aXZhdGVzIHRoZSBsaW5lIHJpcHBsZVxuICAgICAqL1xuICAgIE1EQ0xpbmVSaXBwbGUucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8uZGVhY3RpdmF0ZSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdHJhbnNmb3JtIG9yaWdpbiBnaXZlbiBhIHVzZXIncyBjbGljayBsb2NhdGlvbi5cbiAgICAgKiBUaGUgYHJpcHBsZUNlbnRlcmAgaXMgdGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgbWlkZGxlIG9mIHRoZSByaXBwbGUuXG4gICAgICovXG4gICAgTURDTGluZVJpcHBsZS5wcm90b3R5cGUuc2V0UmlwcGxlQ2VudGVyID0gZnVuY3Rpb24gKHhDb29yZGluYXRlKSB7XG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8uc2V0UmlwcGxlQ2VudGVyKHhDb29yZGluYXRlKTtcbiAgICB9O1xuICAgIE1EQ0xpbmVSaXBwbGUucHJvdG90eXBlLmdldERlZmF1bHRGb3VuZGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBETyBOT1QgSU5MSU5FIHRoaXMgdmFyaWFibGUuIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBmb3VuZGF0aW9ucyB0YWtlIGEgUGFydGlhbDxNRENGb29BZGFwdGVyPi5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHdlIGRvbid0IGFjY2lkZW50YWxseSBvbWl0IGFueSBtZXRob2RzLCB3ZSBuZWVkIGEgc2VwYXJhdGUsIHN0cm9uZ2x5IHR5cGVkIGFkYXB0ZXIgdmFyaWFibGUuXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5cyBNZXRob2RzIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgYWRhcHRlciBpbnRlcmZhY2UuXG4gICAgICAgIHZhciBhZGFwdGVyID0ge1xuICAgICAgICAgICAgYWRkQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIF90aGlzLnJvb3RfLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTsgfSxcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7IHJldHVybiBfdGhpcy5yb290Xy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7IH0sXG4gICAgICAgICAgICBoYXNDbGFzczogZnVuY3Rpb24gKGNsYXNzTmFtZSkgeyByZXR1cm4gX3RoaXMucm9vdF8uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7IH0sXG4gICAgICAgICAgICBzZXRTdHlsZTogZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgdmFsdWUpIHsgcmV0dXJuIF90aGlzLnJvb3RfLnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpOyB9LFxuICAgICAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXI6IGZ1bmN0aW9uIChldnRUeXBlLCBoYW5kbGVyKSB7IHJldHVybiBfdGhpcy5saXN0ZW4oZXZ0VHlwZSwgaGFuZGxlcik7IH0sXG4gICAgICAgICAgICBkZXJlZ2lzdGVyRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiAoZXZ0VHlwZSwgaGFuZGxlcikgeyByZXR1cm4gX3RoaXMudW5saXN0ZW4oZXZ0VHlwZSwgaGFuZGxlcik7IH0sXG4gICAgICAgIH07XG4gICAgICAgIC8vIHRzbGludDplbmFibGU6b2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgIHJldHVybiBuZXcgTURDTGluZVJpcHBsZUZvdW5kYXRpb24oYWRhcHRlcik7XG4gICAgfTtcbiAgICByZXR1cm4gTURDTGluZVJpcHBsZTtcbn0oTURDQ29tcG9uZW50KSk7XG5leHBvcnQgeyBNRENMaW5lUmlwcGxlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wb25lbnQuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG52YXIgc3RyaW5ncyA9IHtcbiAgICBOT1RDSF9FTEVNRU5UX1NFTEVDVE9SOiAnLm1kYy1ub3RjaGVkLW91dGxpbmVfX25vdGNoJyxcbn07XG52YXIgbnVtYmVycyA9IHtcbiAgICAvLyBUaGlzIHNob3VsZCBzdGF5IGluIHN5bmMgd2l0aCAkbWRjLW5vdGNoZWQtb3V0bGluZS1wYWRkaW5nICogMi5cbiAgICBOT1RDSF9FTEVNRU5UX1BBRERJTkc6IDgsXG59O1xudmFyIGNzc0NsYXNzZXMgPSB7XG4gICAgTk9fTEFCRUw6ICdtZGMtbm90Y2hlZC1vdXRsaW5lLS1uby1sYWJlbCcsXG4gICAgT1VUTElORV9OT1RDSEVEOiAnbWRjLW5vdGNoZWQtb3V0bGluZS0tbm90Y2hlZCcsXG4gICAgT1VUTElORV9VUEdSQURFRDogJ21kYy1ub3RjaGVkLW91dGxpbmUtLXVwZ3JhZGVkJyxcbn07XG5leHBvcnQgeyBjc3NDbGFzc2VzLCBudW1iZXJzLCBzdHJpbmdzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5pbXBvcnQgeyBfX2Fzc2lnbiwgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBNRENGb3VuZGF0aW9uIH0gZnJvbSAnQG1hdGVyaWFsL2Jhc2UvZm91bmRhdGlvbic7XG5pbXBvcnQgeyBjc3NDbGFzc2VzLCBudW1iZXJzLCBzdHJpbmdzIH0gZnJvbSAnLi9jb25zdGFudHMnO1xudmFyIE1EQ05vdGNoZWRPdXRsaW5lRm91bmRhdGlvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTURDTm90Y2hlZE91dGxpbmVGb3VuZGF0aW9uLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1EQ05vdGNoZWRPdXRsaW5lRm91bmRhdGlvbihhZGFwdGVyKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgTURDTm90Y2hlZE91dGxpbmVGb3VuZGF0aW9uLmRlZmF1bHRBZGFwdGVyKSwgYWRhcHRlcikpIHx8IHRoaXM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENOb3RjaGVkT3V0bGluZUZvdW5kYXRpb24sIFwic3RyaW5nc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ3M7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENOb3RjaGVkT3V0bGluZUZvdW5kYXRpb24sIFwiY3NzQ2xhc3Nlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNzc0NsYXNzZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENOb3RjaGVkT3V0bGluZUZvdW5kYXRpb24sIFwibnVtYmVyc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlcnM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENOb3RjaGVkT3V0bGluZUZvdW5kYXRpb24sIFwiZGVmYXVsdEFkYXB0ZXJcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2VlIHtAbGluayBNRENOb3RjaGVkT3V0bGluZUFkYXB0ZXJ9IGZvciB0eXBpbmcgaW5mb3JtYXRpb24gb24gcGFyYW1ldGVycyBhbmQgcmV0dXJuIHR5cGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXMgTWV0aG9kcyBzaG91bGQgYmUgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIGFkYXB0ZXIgaW50ZXJmYWNlLlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgc2V0Tm90Y2hXaWR0aFByb3BlcnR5OiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlTm90Y2hXaWR0aFByb3BlcnR5OiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQWRkcyB0aGUgb3V0bGluZSBub3RjaGVkIHNlbGVjdG9yIGFuZCB1cGRhdGVzIHRoZSBub3RjaCB3aWR0aCBjYWxjdWxhdGVkIGJhc2VkIG9mZiBvZiBub3RjaFdpZHRoLlxuICAgICAqL1xuICAgIE1EQ05vdGNoZWRPdXRsaW5lRm91bmRhdGlvbi5wcm90b3R5cGUubm90Y2ggPSBmdW5jdGlvbiAobm90Y2hXaWR0aCkge1xuICAgICAgICB2YXIgT1VUTElORV9OT1RDSEVEID0gTURDTm90Y2hlZE91dGxpbmVGb3VuZGF0aW9uLmNzc0NsYXNzZXMuT1VUTElORV9OT1RDSEVEO1xuICAgICAgICBpZiAobm90Y2hXaWR0aCA+IDApIHtcbiAgICAgICAgICAgIG5vdGNoV2lkdGggKz0gbnVtYmVycy5OT1RDSF9FTEVNRU5UX1BBRERJTkc7IC8vIEFkZCBwYWRkaW5nIGZyb20gbGVmdC9yaWdodC5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkYXB0ZXJfLnNldE5vdGNoV2lkdGhQcm9wZXJ0eShub3RjaFdpZHRoKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5hZGRDbGFzcyhPVVRMSU5FX05PVENIRUQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBub3RjaGVkIG91dGxpbmUgc2VsZWN0b3IgdG8gY2xvc2UgdGhlIG5vdGNoIGluIHRoZSBvdXRsaW5lLlxuICAgICAqL1xuICAgIE1EQ05vdGNoZWRPdXRsaW5lRm91bmRhdGlvbi5wcm90b3R5cGUuY2xvc2VOb3RjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIE9VVExJTkVfTk9UQ0hFRCA9IE1EQ05vdGNoZWRPdXRsaW5lRm91bmRhdGlvbi5jc3NDbGFzc2VzLk9VVExJTkVfTk9UQ0hFRDtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5yZW1vdmVDbGFzcyhPVVRMSU5FX05PVENIRUQpO1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZU5vdGNoV2lkdGhQcm9wZXJ0eSgpO1xuICAgIH07XG4gICAgcmV0dXJuIE1EQ05vdGNoZWRPdXRsaW5lRm91bmRhdGlvbjtcbn0oTURDRm91bmRhdGlvbikpO1xuZXhwb3J0IHsgTURDTm90Y2hlZE91dGxpbmVGb3VuZGF0aW9uIH07XG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZGVmYXVsdC1leHBvcnQgTmVlZGVkIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHdpdGggTURDIFdlYiB2MC40NC4wIGFuZCBlYXJsaWVyLlxuZXhwb3J0IGRlZmF1bHQgTURDTm90Y2hlZE91dGxpbmVGb3VuZGF0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm91bmRhdGlvbi5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbmltcG9ydCB7IF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgTURDQ29tcG9uZW50IH0gZnJvbSAnQG1hdGVyaWFsL2Jhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IE1EQ0Zsb2F0aW5nTGFiZWxGb3VuZGF0aW9uIH0gZnJvbSAnQG1hdGVyaWFsL2Zsb2F0aW5nLWxhYmVsL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgY3NzQ2xhc3Nlcywgc3RyaW5ncyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IE1EQ05vdGNoZWRPdXRsaW5lRm91bmRhdGlvbiB9IGZyb20gJy4vZm91bmRhdGlvbic7XG52YXIgTURDTm90Y2hlZE91dGxpbmUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1EQ05vdGNoZWRPdXRsaW5lLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1EQ05vdGNoZWRPdXRsaW5lKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIE1EQ05vdGNoZWRPdXRsaW5lLmF0dGFjaFRvID0gZnVuY3Rpb24gKHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNRENOb3RjaGVkT3V0bGluZShyb290KTtcbiAgICB9O1xuICAgIE1EQ05vdGNoZWRPdXRsaW5lLnByb3RvdHlwZS5pbml0aWFsU3luY1dpdGhET00gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm90Y2hFbGVtZW50XyA9IHRoaXMucm9vdF8ucXVlcnlTZWxlY3RvcihzdHJpbmdzLk5PVENIX0VMRU1FTlRfU0VMRUNUT1IpO1xuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLnJvb3RfLnF1ZXJ5U2VsZWN0b3IoJy4nICsgTURDRmxvYXRpbmdMYWJlbEZvdW5kYXRpb24uY3NzQ2xhc3Nlcy5ST09UKTtcbiAgICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgICAgICBsYWJlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSAnMHMnO1xuICAgICAgICAgICAgdGhpcy5yb290Xy5jbGFzc0xpc3QuYWRkKGNzc0NsYXNzZXMuT1VUTElORV9VUEdSQURFRCk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxhYmVsLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvb3RfLmNsYXNzTGlzdC5hZGQoY3NzQ2xhc3Nlcy5OT19MQUJFTCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgY2xhc3NlcyBhbmQgc3R5bGVzIHRvIG9wZW4gdGhlIG5vdGNoIHRvIHRoZSBzcGVjaWZpZWQgd2lkdGguXG4gICAgICogQHBhcmFtIG5vdGNoV2lkdGggVGhlIG5vdGNoIHdpZHRoIGluIHRoZSBvdXRsaW5lLlxuICAgICAqL1xuICAgIE1EQ05vdGNoZWRPdXRsaW5lLnByb3RvdHlwZS5ub3RjaCA9IGZ1bmN0aW9uIChub3RjaFdpZHRoKSB7XG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8ubm90Y2gobm90Y2hXaWR0aCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIGNsYXNzZXMgYW5kIHN0eWxlcyB0byBjbG9zZSB0aGUgbm90Y2guXG4gICAgICovXG4gICAgTURDTm90Y2hlZE91dGxpbmUucHJvdG90eXBlLmNsb3NlTm90Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8uY2xvc2VOb3RjaCgpO1xuICAgIH07XG4gICAgTURDTm90Y2hlZE91dGxpbmUucHJvdG90eXBlLmdldERlZmF1bHRGb3VuZGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBETyBOT1QgSU5MSU5FIHRoaXMgdmFyaWFibGUuIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBmb3VuZGF0aW9ucyB0YWtlIGEgUGFydGlhbDxNRENGb29BZGFwdGVyPi5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHdlIGRvbid0IGFjY2lkZW50YWxseSBvbWl0IGFueSBtZXRob2RzLCB3ZSBuZWVkIGEgc2VwYXJhdGUsIHN0cm9uZ2x5IHR5cGVkIGFkYXB0ZXIgdmFyaWFibGUuXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5cyBNZXRob2RzIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgYWRhcHRlciBpbnRlcmZhY2UuXG4gICAgICAgIHZhciBhZGFwdGVyID0ge1xuICAgICAgICAgICAgYWRkQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIF90aGlzLnJvb3RfLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTsgfSxcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7IHJldHVybiBfdGhpcy5yb290Xy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7IH0sXG4gICAgICAgICAgICBzZXROb3RjaFdpZHRoUHJvcGVydHk6IGZ1bmN0aW9uICh3aWR0aCkgeyByZXR1cm4gX3RoaXMubm90Y2hFbGVtZW50Xy5zdHlsZS5zZXRQcm9wZXJ0eSgnd2lkdGgnLCB3aWR0aCArICdweCcpOyB9LFxuICAgICAgICAgICAgcmVtb3ZlTm90Y2hXaWR0aFByb3BlcnR5OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5ub3RjaEVsZW1lbnRfLnN0eWxlLnJlbW92ZVByb3BlcnR5KCd3aWR0aCcpOyB9LFxuICAgICAgICB9O1xuICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5c1xuICAgICAgICByZXR1cm4gbmV3IE1EQ05vdGNoZWRPdXRsaW5lRm91bmRhdGlvbihhZGFwdGVyKTtcbiAgICB9O1xuICAgIHJldHVybiBNRENOb3RjaGVkT3V0bGluZTtcbn0oTURDQ29tcG9uZW50KSk7XG5leHBvcnQgeyBNRENOb3RjaGVkT3V0bGluZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcG9uZW50LmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuZXhwb3J0IHZhciBjc3NDbGFzc2VzID0ge1xuICAgIC8vIFJpcHBsZSBpcyBhIHNwZWNpYWwgY2FzZSB3aGVyZSB0aGUgXCJyb290XCIgY29tcG9uZW50IGlzIHJlYWxseSBhIFwibWl4aW5cIiBvZiBzb3J0cyxcbiAgICAvLyBnaXZlbiB0aGF0IGl0J3MgYW4gJ3VwZ3JhZGUnIHRvIGFuIGV4aXN0aW5nIGNvbXBvbmVudC4gVGhhdCBiZWluZyBzYWlkIGl0IGlzIHRoZSByb290XG4gICAgLy8gQ1NTIGNsYXNzIHRoYXQgYWxsIG90aGVyIENTUyBjbGFzc2VzIGRlcml2ZSBmcm9tLlxuICAgIEJHX0ZPQ1VTRUQ6ICdtZGMtcmlwcGxlLXVwZ3JhZGVkLS1iYWNrZ3JvdW5kLWZvY3VzZWQnLFxuICAgIEZHX0FDVElWQVRJT046ICdtZGMtcmlwcGxlLXVwZ3JhZGVkLS1mb3JlZ3JvdW5kLWFjdGl2YXRpb24nLFxuICAgIEZHX0RFQUNUSVZBVElPTjogJ21kYy1yaXBwbGUtdXBncmFkZWQtLWZvcmVncm91bmQtZGVhY3RpdmF0aW9uJyxcbiAgICBST09UOiAnbWRjLXJpcHBsZS11cGdyYWRlZCcsXG4gICAgVU5CT1VOREVEOiAnbWRjLXJpcHBsZS11cGdyYWRlZC0tdW5ib3VuZGVkJyxcbn07XG5leHBvcnQgdmFyIHN0cmluZ3MgPSB7XG4gICAgVkFSX0ZHX1NDQUxFOiAnLS1tZGMtcmlwcGxlLWZnLXNjYWxlJyxcbiAgICBWQVJfRkdfU0laRTogJy0tbWRjLXJpcHBsZS1mZy1zaXplJyxcbiAgICBWQVJfRkdfVFJBTlNMQVRFX0VORDogJy0tbWRjLXJpcHBsZS1mZy10cmFuc2xhdGUtZW5kJyxcbiAgICBWQVJfRkdfVFJBTlNMQVRFX1NUQVJUOiAnLS1tZGMtcmlwcGxlLWZnLXRyYW5zbGF0ZS1zdGFydCcsXG4gICAgVkFSX0xFRlQ6ICctLW1kYy1yaXBwbGUtbGVmdCcsXG4gICAgVkFSX1RPUDogJy0tbWRjLXJpcHBsZS10b3AnLFxufTtcbmV4cG9ydCB2YXIgbnVtYmVycyA9IHtcbiAgICBERUFDVElWQVRJT05fVElNRU9VVF9NUzogMjI1LFxuICAgIEZHX0RFQUNUSVZBVElPTl9NUzogMTUwLFxuICAgIElOSVRJQUxfT1JJR0lOX1NDQUxFOiAwLjYsXG4gICAgUEFERElORzogMTAsXG4gICAgVEFQX0RFTEFZX01TOiAzMDAsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uc3RhbnRzLmpzLm1hcCIsIi8qKlxuICogU3RvcmVzIHJlc3VsdCBmcm9tIHN1cHBvcnRzQ3NzVmFyaWFibGVzIHRvIGF2b2lkIHJlZHVuZGFudCBwcm9jZXNzaW5nIHRvXG4gKiBkZXRlY3QgQ1NTIGN1c3RvbSB2YXJpYWJsZSBzdXBwb3J0LlxuICovXG52YXIgc3VwcG9ydHNDc3NWYXJpYWJsZXNfO1xuZXhwb3J0IGZ1bmN0aW9uIHN1cHBvcnRzQ3NzVmFyaWFibGVzKHdpbmRvd09iaiwgZm9yY2VSZWZyZXNoKSB7XG4gICAgaWYgKGZvcmNlUmVmcmVzaCA9PT0gdm9pZCAwKSB7IGZvcmNlUmVmcmVzaCA9IGZhbHNlOyB9XG4gICAgdmFyIENTUyA9IHdpbmRvd09iai5DU1M7XG4gICAgdmFyIHN1cHBvcnRzQ3NzVmFycyA9IHN1cHBvcnRzQ3NzVmFyaWFibGVzXztcbiAgICBpZiAodHlwZW9mIHN1cHBvcnRzQ3NzVmFyaWFibGVzXyA9PT0gJ2Jvb2xlYW4nICYmICFmb3JjZVJlZnJlc2gpIHtcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRzQ3NzVmFyaWFibGVzXztcbiAgICB9XG4gICAgdmFyIHN1cHBvcnRzRnVuY3Rpb25QcmVzZW50ID0gQ1NTICYmIHR5cGVvZiBDU1Muc3VwcG9ydHMgPT09ICdmdW5jdGlvbic7XG4gICAgaWYgKCFzdXBwb3J0c0Z1bmN0aW9uUHJlc2VudCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBleHBsaWNpdGx5U3VwcG9ydHNDc3NWYXJzID0gQ1NTLnN1cHBvcnRzKCctLWNzcy12YXJzJywgJ3llcycpO1xuICAgIC8vIFNlZTogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE1NDY2OVxuICAgIC8vIFNlZTogUkVBRE1FIHNlY3Rpb24gb24gU2FmYXJpXG4gICAgdmFyIHdlQXJlRmVhdHVyZURldGVjdGluZ1NhZmFyaTEwcGx1cyA9IChDU1Muc3VwcG9ydHMoJygtLWNzcy12YXJzOiB5ZXMpJykgJiZcbiAgICAgICAgQ1NTLnN1cHBvcnRzKCdjb2xvcicsICcjMDAwMDAwMDAnKSk7XG4gICAgc3VwcG9ydHNDc3NWYXJzID1cbiAgICAgICAgZXhwbGljaXRseVN1cHBvcnRzQ3NzVmFycyB8fCB3ZUFyZUZlYXR1cmVEZXRlY3RpbmdTYWZhcmkxMHBsdXM7XG4gICAgaWYgKCFmb3JjZVJlZnJlc2gpIHtcbiAgICAgICAgc3VwcG9ydHNDc3NWYXJpYWJsZXNfID0gc3VwcG9ydHNDc3NWYXJzO1xuICAgIH1cbiAgICByZXR1cm4gc3VwcG9ydHNDc3NWYXJzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vcm1hbGl6ZWRFdmVudENvb3JkcyhldnQsIHBhZ2VPZmZzZXQsIGNsaWVudFJlY3QpIHtcbiAgICBpZiAoIWV2dCkge1xuICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwIH07XG4gICAgfVxuICAgIHZhciB4ID0gcGFnZU9mZnNldC54LCB5ID0gcGFnZU9mZnNldC55O1xuICAgIHZhciBkb2N1bWVudFggPSB4ICsgY2xpZW50UmVjdC5sZWZ0O1xuICAgIHZhciBkb2N1bWVudFkgPSB5ICsgY2xpZW50UmVjdC50b3A7XG4gICAgdmFyIG5vcm1hbGl6ZWRYO1xuICAgIHZhciBub3JtYWxpemVkWTtcbiAgICAvLyBEZXRlcm1pbmUgdG91Y2ggcG9pbnQgcmVsYXRpdmUgdG8gdGhlIHJpcHBsZSBjb250YWluZXIuXG4gICAgaWYgKGV2dC50eXBlID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgICAgdmFyIHRvdWNoRXZlbnQgPSBldnQ7XG4gICAgICAgIG5vcm1hbGl6ZWRYID0gdG91Y2hFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIGRvY3VtZW50WDtcbiAgICAgICAgbm9ybWFsaXplZFkgPSB0b3VjaEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZIC0gZG9jdW1lbnRZO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIG1vdXNlRXZlbnQgPSBldnQ7XG4gICAgICAgIG5vcm1hbGl6ZWRYID0gbW91c2VFdmVudC5wYWdlWCAtIGRvY3VtZW50WDtcbiAgICAgICAgbm9ybWFsaXplZFkgPSBtb3VzZUV2ZW50LnBhZ2VZIC0gZG9jdW1lbnRZO1xuICAgIH1cbiAgICByZXR1cm4geyB4OiBub3JtYWxpemVkWCwgeTogbm9ybWFsaXplZFkgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5pbXBvcnQgeyBfX2Fzc2lnbiwgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBNRENGb3VuZGF0aW9uIH0gZnJvbSAnQG1hdGVyaWFsL2Jhc2UvZm91bmRhdGlvbic7XG5pbXBvcnQgeyBjc3NDbGFzc2VzLCBudW1iZXJzLCBzdHJpbmdzIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0Tm9ybWFsaXplZEV2ZW50Q29vcmRzIH0gZnJvbSAnLi91dGlsJztcbi8vIEFjdGl2YXRpb24gZXZlbnRzIHJlZ2lzdGVyZWQgb24gdGhlIHJvb3QgZWxlbWVudCBvZiBlYWNoIGluc3RhbmNlIGZvciBhY3RpdmF0aW9uXG52YXIgQUNUSVZBVElPTl9FVkVOVF9UWVBFUyA9IFtcbiAgICAndG91Y2hzdGFydCcsICdwb2ludGVyZG93bicsICdtb3VzZWRvd24nLCAna2V5ZG93bicsXG5dO1xuLy8gRGVhY3RpdmF0aW9uIGV2ZW50cyByZWdpc3RlcmVkIG9uIGRvY3VtZW50RWxlbWVudCB3aGVuIGEgcG9pbnRlci1yZWxhdGVkIGRvd24gZXZlbnQgb2NjdXJzXG52YXIgUE9JTlRFUl9ERUFDVElWQVRJT05fRVZFTlRfVFlQRVMgPSBbXG4gICAgJ3RvdWNoZW5kJywgJ3BvaW50ZXJ1cCcsICdtb3VzZXVwJywgJ2NvbnRleHRtZW51Jyxcbl07XG4vLyBzaW11bHRhbmVvdXMgbmVzdGVkIGFjdGl2YXRpb25zXG52YXIgYWN0aXZhdGVkVGFyZ2V0cyA9IFtdO1xudmFyIE1EQ1JpcHBsZUZvdW5kYXRpb24gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1EQ1JpcHBsZUZvdW5kYXRpb24sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTURDUmlwcGxlRm91bmRhdGlvbihhZGFwdGVyKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBNRENSaXBwbGVGb3VuZGF0aW9uLmRlZmF1bHRBZGFwdGVyKSwgYWRhcHRlcikpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmFjdGl2YXRpb25BbmltYXRpb25IYXNFbmRlZF8gPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuYWN0aXZhdGlvblRpbWVyXyA9IDA7XG4gICAgICAgIF90aGlzLmZnRGVhY3RpdmF0aW9uUmVtb3ZhbFRpbWVyXyA9IDA7XG4gICAgICAgIF90aGlzLmZnU2NhbGVfID0gJzAnO1xuICAgICAgICBfdGhpcy5mcmFtZV8gPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcbiAgICAgICAgX3RoaXMuaW5pdGlhbFNpemVfID0gMDtcbiAgICAgICAgX3RoaXMubGF5b3V0RnJhbWVfID0gMDtcbiAgICAgICAgX3RoaXMubWF4UmFkaXVzXyA9IDA7XG4gICAgICAgIF90aGlzLnVuYm91bmRlZENvb3Jkc18gPSB7IGxlZnQ6IDAsIHRvcDogMCB9O1xuICAgICAgICBfdGhpcy5hY3RpdmF0aW9uU3RhdGVfID0gX3RoaXMuZGVmYXVsdEFjdGl2YXRpb25TdGF0ZV8oKTtcbiAgICAgICAgX3RoaXMuYWN0aXZhdGlvblRpbWVyQ2FsbGJhY2tfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuYWN0aXZhdGlvbkFuaW1hdGlvbkhhc0VuZGVkXyA9IHRydWU7XG4gICAgICAgICAgICBfdGhpcy5ydW5EZWFjdGl2YXRpb25VWExvZ2ljSWZSZWFkeV8oKTtcbiAgICAgICAgfTtcbiAgICAgICAgX3RoaXMuYWN0aXZhdGVIYW5kbGVyXyA9IGZ1bmN0aW9uIChlKSB7IHJldHVybiBfdGhpcy5hY3RpdmF0ZV8oZSk7IH07XG4gICAgICAgIF90aGlzLmRlYWN0aXZhdGVIYW5kbGVyXyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmRlYWN0aXZhdGVfKCk7IH07XG4gICAgICAgIF90aGlzLmZvY3VzSGFuZGxlcl8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5oYW5kbGVGb2N1cygpOyB9O1xuICAgICAgICBfdGhpcy5ibHVySGFuZGxlcl8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5oYW5kbGVCbHVyKCk7IH07XG4gICAgICAgIF90aGlzLnJlc2l6ZUhhbmRsZXJfID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMubGF5b3V0KCk7IH07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1JpcHBsZUZvdW5kYXRpb24sIFwiY3NzQ2xhc3Nlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNzc0NsYXNzZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENSaXBwbGVGb3VuZGF0aW9uLCBcInN0cmluZ3NcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDUmlwcGxlRm91bmRhdGlvbiwgXCJudW1iZXJzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVycztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1JpcHBsZUZvdW5kYXRpb24sIFwiZGVmYXVsdEFkYXB0ZXJcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYWRkQ2xhc3M6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICBicm93c2VyU3VwcG9ydHNDc3NWYXJzOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9LFxuICAgICAgICAgICAgICAgIGNvbXB1dGVCb3VuZGluZ1JlY3Q6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7IHRvcDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCwgbGVmdDogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9KTsgfSxcbiAgICAgICAgICAgICAgICBjb250YWluc0V2ZW50VGFyZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9LFxuICAgICAgICAgICAgICAgIGRlcmVnaXN0ZXJEb2N1bWVudEludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIGRlcmVnaXN0ZXJJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICBkZXJlZ2lzdGVyUmVzaXplSGFuZGxlcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIGdldFdpbmRvd1BhZ2VPZmZzZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7IHg6IDAsIHk6IDAgfSk7IH0sXG4gICAgICAgICAgICAgICAgaXNTdXJmYWNlQWN0aXZlOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9LFxuICAgICAgICAgICAgICAgIGlzU3VyZmFjZURpc2FibGVkOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9LFxuICAgICAgICAgICAgICAgIGlzVW5ib3VuZGVkOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9LFxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyRG9jdW1lbnRJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICByZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyUmVzaXplSGFuZGxlcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlQ3NzVmFyaWFibGU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBzdXBwb3J0c1ByZXNzUmlwcGxlID0gdGhpcy5zdXBwb3J0c1ByZXNzUmlwcGxlXygpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyUm9vdEhhbmRsZXJzXyhzdXBwb3J0c1ByZXNzUmlwcGxlKTtcbiAgICAgICAgaWYgKHN1cHBvcnRzUHJlc3NSaXBwbGUpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IE1EQ1JpcHBsZUZvdW5kYXRpb24uY3NzQ2xhc3NlcywgUk9PVF8xID0gX2EuUk9PVCwgVU5CT1VOREVEXzEgPSBfYS5VTkJPVU5ERUQ7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmFkYXB0ZXJfLmFkZENsYXNzKFJPT1RfMSk7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmFkYXB0ZXJfLmlzVW5ib3VuZGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoVU5CT1VOREVEXzEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBVbmJvdW5kZWQgcmlwcGxlcyBuZWVkIGxheW91dCBsb2dpYyBhcHBsaWVkIGltbWVkaWF0ZWx5IHRvIHNldCBjb29yZGluYXRlcyBmb3IgYm90aCBzaGFkZSBhbmQgcmlwcGxlXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmxheW91dEludGVybmFsXygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBNRENSaXBwbGVGb3VuZGF0aW9uLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5zdXBwb3J0c1ByZXNzUmlwcGxlXygpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmF0aW9uVGltZXJfKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYWN0aXZhdGlvblRpbWVyXyk7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmF0aW9uVGltZXJfID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZUNsYXNzKE1EQ1JpcHBsZUZvdW5kYXRpb24uY3NzQ2xhc3Nlcy5GR19BQ1RJVkFUSU9OKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZnRGVhY3RpdmF0aW9uUmVtb3ZhbFRpbWVyXykge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZnRGVhY3RpdmF0aW9uUmVtb3ZhbFRpbWVyXyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mZ0RlYWN0aXZhdGlvblJlbW92YWxUaW1lcl8gPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoTURDUmlwcGxlRm91bmRhdGlvbi5jc3NDbGFzc2VzLkZHX0RFQUNUSVZBVElPTik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgX2EgPSBNRENSaXBwbGVGb3VuZGF0aW9uLmNzc0NsYXNzZXMsIFJPT1RfMiA9IF9hLlJPT1QsIFVOQk9VTkRFRF8yID0gX2EuVU5CT1VOREVEO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5hZGFwdGVyXy5yZW1vdmVDbGFzcyhST09UXzIpO1xuICAgICAgICAgICAgICAgIF90aGlzLmFkYXB0ZXJfLnJlbW92ZUNsYXNzKFVOQk9VTkRFRF8yKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVDc3NWYXJzXygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXJlZ2lzdGVyUm9vdEhhbmRsZXJzXygpO1xuICAgICAgICB0aGlzLmRlcmVnaXN0ZXJEZWFjdGl2YXRpb25IYW5kbGVyc18oKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBldnQgT3B0aW9uYWwgZXZlbnQgY29udGFpbmluZyBwb3NpdGlvbiBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBNRENSaXBwbGVGb3VuZGF0aW9uLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZV8oZXZ0KTtcbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZV8oKTtcbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmxheW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMubGF5b3V0RnJhbWVfKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmxheW91dEZyYW1lXyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXlvdXRGcmFtZV8gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMubGF5b3V0SW50ZXJuYWxfKCk7XG4gICAgICAgICAgICBfdGhpcy5sYXlvdXRGcmFtZV8gPSAwO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLnNldFVuYm91bmRlZCA9IGZ1bmN0aW9uICh1bmJvdW5kZWQpIHtcbiAgICAgICAgdmFyIFVOQk9VTkRFRCA9IE1EQ1JpcHBsZUZvdW5kYXRpb24uY3NzQ2xhc3Nlcy5VTkJPVU5ERUQ7XG4gICAgICAgIGlmICh1bmJvdW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoVU5CT1VOREVEKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoVU5CT1VOREVEKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTURDUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUuaGFuZGxlRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoTURDUmlwcGxlRm91bmRhdGlvbi5jc3NDbGFzc2VzLkJHX0ZPQ1VTRUQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmhhbmRsZUJsdXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoTURDUmlwcGxlRm91bmRhdGlvbi5jc3NDbGFzc2VzLkJHX0ZPQ1VTRUQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFdlIGNvbXB1dGUgdGhpcyBwcm9wZXJ0eSBzbyB0aGF0IHdlIGFyZSBub3QgcXVlcnlpbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudFxuICAgICAqIHVudGlsIHRoZSBwb2ludCBpbiB0aW1lIHdoZXJlIHRoZSBmb3VuZGF0aW9uIHJlcXVlc3RzIGl0LiBUaGlzIHByZXZlbnRzIHNjZW5hcmlvcyB3aGVyZVxuICAgICAqIGNsaWVudC1zaWRlIGZlYXR1cmUtZGV0ZWN0aW9uIG1heSBoYXBwZW4gdG9vIGVhcmx5LCBzdWNoIGFzIHdoZW4gY29tcG9uZW50cyBhcmUgcmVuZGVyZWQgb24gdGhlIHNlcnZlclxuICAgICAqIGFuZCB0aGVuIGluaXRpYWxpemVkIGF0IG1vdW50IHRpbWUgb24gdGhlIGNsaWVudC5cbiAgICAgKi9cbiAgICBNRENSaXBwbGVGb3VuZGF0aW9uLnByb3RvdHlwZS5zdXBwb3J0c1ByZXNzUmlwcGxlXyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlcl8uYnJvd3NlclN1cHBvcnRzQ3NzVmFycygpO1xuICAgIH07XG4gICAgTURDUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUuZGVmYXVsdEFjdGl2YXRpb25TdGF0ZV8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhY3RpdmF0aW9uRXZlbnQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGhhc0RlYWN0aXZhdGlvblVYUnVuOiBmYWxzZSxcbiAgICAgICAgICAgIGlzQWN0aXZhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGlzUHJvZ3JhbW1hdGljOiBmYWxzZSxcbiAgICAgICAgICAgIHdhc0FjdGl2YXRlZEJ5UG9pbnRlcjogZmFsc2UsXG4gICAgICAgICAgICB3YXNFbGVtZW50TWFkZUFjdGl2ZTogZmFsc2UsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBzdXBwb3J0c1ByZXNzUmlwcGxlIFBhc3NlZCBmcm9tIGluaXQgdG8gc2F2ZSBhIHJlZHVuZGFudCBmdW5jdGlvbiBjYWxsXG4gICAgICovXG4gICAgTURDUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUucmVnaXN0ZXJSb290SGFuZGxlcnNfID0gZnVuY3Rpb24gKHN1cHBvcnRzUHJlc3NSaXBwbGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHN1cHBvcnRzUHJlc3NSaXBwbGUpIHtcbiAgICAgICAgICAgIEFDVElWQVRJT05fRVZFTlRfVFlQRVMuZm9yRWFjaChmdW5jdGlvbiAoZXZ0VHlwZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmFkYXB0ZXJfLnJlZ2lzdGVySW50ZXJhY3Rpb25IYW5kbGVyKGV2dFR5cGUsIF90aGlzLmFjdGl2YXRlSGFuZGxlcl8pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5hZGFwdGVyXy5pc1VuYm91bmRlZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5yZWdpc3RlclJlc2l6ZUhhbmRsZXIodGhpcy5yZXNpemVIYW5kbGVyXyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGFwdGVyXy5yZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcignZm9jdXMnLCB0aGlzLmZvY3VzSGFuZGxlcl8pO1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlZ2lzdGVySW50ZXJhY3Rpb25IYW5kbGVyKCdibHVyJywgdGhpcy5ibHVySGFuZGxlcl8pO1xuICAgIH07XG4gICAgTURDUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUucmVnaXN0ZXJEZWFjdGl2YXRpb25IYW5kbGVyc18gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChldnQudHlwZSA9PT0gJ2tleWRvd24nKSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlZ2lzdGVySW50ZXJhY3Rpb25IYW5kbGVyKCdrZXl1cCcsIHRoaXMuZGVhY3RpdmF0ZUhhbmRsZXJfKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFBPSU5URVJfREVBQ1RJVkFUSU9OX0VWRU5UX1RZUEVTLmZvckVhY2goZnVuY3Rpb24gKGV2dFR5cGUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5hZGFwdGVyXy5yZWdpc3RlckRvY3VtZW50SW50ZXJhY3Rpb25IYW5kbGVyKGV2dFR5cGUsIF90aGlzLmRlYWN0aXZhdGVIYW5kbGVyXyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTURDUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUuZGVyZWdpc3RlclJvb3RIYW5kbGVyc18gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIEFDVElWQVRJT05fRVZFTlRfVFlQRVMuZm9yRWFjaChmdW5jdGlvbiAoZXZ0VHlwZSkge1xuICAgICAgICAgICAgX3RoaXMuYWRhcHRlcl8uZGVyZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcihldnRUeXBlLCBfdGhpcy5hY3RpdmF0ZUhhbmRsZXJfKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uZGVyZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcignZm9jdXMnLCB0aGlzLmZvY3VzSGFuZGxlcl8pO1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLmRlcmVnaXN0ZXJJbnRlcmFjdGlvbkhhbmRsZXIoJ2JsdXInLCB0aGlzLmJsdXJIYW5kbGVyXyk7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXJfLmlzVW5ib3VuZGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uZGVyZWdpc3RlclJlc2l6ZUhhbmRsZXIodGhpcy5yZXNpemVIYW5kbGVyXyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmRlcmVnaXN0ZXJEZWFjdGl2YXRpb25IYW5kbGVyc18gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uZGVyZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcigna2V5dXAnLCB0aGlzLmRlYWN0aXZhdGVIYW5kbGVyXyk7XG4gICAgICAgIFBPSU5URVJfREVBQ1RJVkFUSU9OX0VWRU5UX1RZUEVTLmZvckVhY2goZnVuY3Rpb24gKGV2dFR5cGUpIHtcbiAgICAgICAgICAgIF90aGlzLmFkYXB0ZXJfLmRlcmVnaXN0ZXJEb2N1bWVudEludGVyYWN0aW9uSGFuZGxlcihldnRUeXBlLCBfdGhpcy5kZWFjdGl2YXRlSGFuZGxlcl8pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLnJlbW92ZUNzc1ZhcnNfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcmlwcGxlU3RyaW5ncyA9IE1EQ1JpcHBsZUZvdW5kYXRpb24uc3RyaW5ncztcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhyaXBwbGVTdHJpbmdzKTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkuaW5kZXhPZignVkFSXycpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuYWRhcHRlcl8udXBkYXRlQ3NzVmFyaWFibGUocmlwcGxlU3RyaW5nc1trZXldLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBNRENSaXBwbGVGb3VuZGF0aW9uLnByb3RvdHlwZS5hY3RpdmF0ZV8gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXJfLmlzU3VyZmFjZURpc2FibGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYWN0aXZhdGlvblN0YXRlID0gdGhpcy5hY3RpdmF0aW9uU3RhdGVfO1xuICAgICAgICBpZiAoYWN0aXZhdGlvblN0YXRlLmlzQWN0aXZhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXZvaWQgcmVhY3RpbmcgdG8gZm9sbG93LW9uIGV2ZW50cyBmaXJlZCBieSB0b3VjaCBkZXZpY2UgYWZ0ZXIgYW4gYWxyZWFkeS1wcm9jZXNzZWQgdXNlciBpbnRlcmFjdGlvblxuICAgICAgICB2YXIgcHJldmlvdXNBY3RpdmF0aW9uRXZlbnQgPSB0aGlzLnByZXZpb3VzQWN0aXZhdGlvbkV2ZW50XztcbiAgICAgICAgdmFyIGlzU2FtZUludGVyYWN0aW9uID0gcHJldmlvdXNBY3RpdmF0aW9uRXZlbnQgJiYgZXZ0ICE9PSB1bmRlZmluZWQgJiYgcHJldmlvdXNBY3RpdmF0aW9uRXZlbnQudHlwZSAhPT0gZXZ0LnR5cGU7XG4gICAgICAgIGlmIChpc1NhbWVJbnRlcmFjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGFjdGl2YXRpb25TdGF0ZS5pc0FjdGl2YXRlZCA9IHRydWU7XG4gICAgICAgIGFjdGl2YXRpb25TdGF0ZS5pc1Byb2dyYW1tYXRpYyA9IGV2dCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICBhY3RpdmF0aW9uU3RhdGUuYWN0aXZhdGlvbkV2ZW50ID0gZXZ0O1xuICAgICAgICBhY3RpdmF0aW9uU3RhdGUud2FzQWN0aXZhdGVkQnlQb2ludGVyID0gYWN0aXZhdGlvblN0YXRlLmlzUHJvZ3JhbW1hdGljID8gZmFsc2UgOiBldnQgIT09IHVuZGVmaW5lZCAmJiAoZXZ0LnR5cGUgPT09ICdtb3VzZWRvd24nIHx8IGV2dC50eXBlID09PSAndG91Y2hzdGFydCcgfHwgZXZ0LnR5cGUgPT09ICdwb2ludGVyZG93bicpO1xuICAgICAgICB2YXIgaGFzQWN0aXZhdGVkQ2hpbGQgPSBldnQgIT09IHVuZGVmaW5lZCAmJiBhY3RpdmF0ZWRUYXJnZXRzLmxlbmd0aCA+IDAgJiYgYWN0aXZhdGVkVGFyZ2V0cy5zb21lKGZ1bmN0aW9uICh0YXJnZXQpIHsgcmV0dXJuIF90aGlzLmFkYXB0ZXJfLmNvbnRhaW5zRXZlbnRUYXJnZXQodGFyZ2V0KTsgfSk7XG4gICAgICAgIGlmIChoYXNBY3RpdmF0ZWRDaGlsZCkge1xuICAgICAgICAgICAgLy8gSW1tZWRpYXRlbHkgcmVzZXQgYWN0aXZhdGlvbiBzdGF0ZSwgd2hpbGUgcHJlc2VydmluZyBsb2dpYyB0aGF0IHByZXZlbnRzIHRvdWNoIGZvbGxvdy1vbiBldmVudHNcbiAgICAgICAgICAgIHRoaXMucmVzZXRBY3RpdmF0aW9uU3RhdGVfKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhY3RpdmF0ZWRUYXJnZXRzLnB1c2goZXZ0LnRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRGVhY3RpdmF0aW9uSGFuZGxlcnNfKGV2dCk7XG4gICAgICAgIH1cbiAgICAgICAgYWN0aXZhdGlvblN0YXRlLndhc0VsZW1lbnRNYWRlQWN0aXZlID0gdGhpcy5jaGVja0VsZW1lbnRNYWRlQWN0aXZlXyhldnQpO1xuICAgICAgICBpZiAoYWN0aXZhdGlvblN0YXRlLndhc0VsZW1lbnRNYWRlQWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGVBY3RpdmF0aW9uXygpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBSZXNldCBhcnJheSBvbiBuZXh0IGZyYW1lIGFmdGVyIHRoZSBjdXJyZW50IGV2ZW50IGhhcyBoYWQgYSBjaGFuY2UgdG8gYnViYmxlIHRvIHByZXZlbnQgYW5jZXN0b3IgcmlwcGxlc1xuICAgICAgICAgICAgYWN0aXZhdGVkVGFyZ2V0cyA9IFtdO1xuICAgICAgICAgICAgaWYgKCFhY3RpdmF0aW9uU3RhdGUud2FzRWxlbWVudE1hZGVBY3RpdmVcbiAgICAgICAgICAgICAgICAmJiBldnQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICYmIChldnQua2V5ID09PSAnICcgfHwgZXZ0LmtleUNvZGUgPT09IDMyKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHNwYWNlIHdhcyBwcmVzc2VkLCB0cnkgYWdhaW4gd2l0aGluIGFuIHJBRiBjYWxsIHRvIGRldGVjdCA6YWN0aXZlLCBiZWNhdXNlIGRpZmZlcmVudCBVQXMgcmVwb3J0XG4gICAgICAgICAgICAgICAgLy8gYWN0aXZlIHN0YXRlcyBpbmNvbnNpc3RlbnRseSB3aGVuIHRoZXkncmUgY2FsbGVkIHdpdGhpbiBldmVudCBoYW5kbGluZyBjb2RlOlxuICAgICAgICAgICAgICAgIC8vIC0gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NjM1OTcxXG4gICAgICAgICAgICAgICAgLy8gLSBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xMjkzNzQxXG4gICAgICAgICAgICAgICAgLy8gV2UgdHJ5IGZpcnN0IG91dHNpZGUgckFGIHRvIHN1cHBvcnQgRWRnZSwgd2hpY2ggZG9lcyBub3QgZXhoaWJpdCB0aGlzIHByb2JsZW0sIGJ1dCB3aWxsIGNyYXNoIGlmIGEgQ1NTXG4gICAgICAgICAgICAgICAgLy8gdmFyaWFibGUgaXMgc2V0IHdpdGhpbiBhIHJBRiBjYWxsYmFjayBmb3IgYSBzdWJtaXQgYnV0dG9uIGludGVyYWN0aW9uICgjMjI0MSkuXG4gICAgICAgICAgICAgICAgYWN0aXZhdGlvblN0YXRlLndhc0VsZW1lbnRNYWRlQWN0aXZlID0gX3RoaXMuY2hlY2tFbGVtZW50TWFkZUFjdGl2ZV8oZXZ0KTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZhdGlvblN0YXRlLndhc0VsZW1lbnRNYWRlQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFuaW1hdGVBY3RpdmF0aW9uXygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYWN0aXZhdGlvblN0YXRlLndhc0VsZW1lbnRNYWRlQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgYWN0aXZhdGlvbiBzdGF0ZSBpbW1lZGlhdGVseSBpZiBlbGVtZW50IHdhcyBub3QgbWFkZSBhY3RpdmUuXG4gICAgICAgICAgICAgICAgX3RoaXMuYWN0aXZhdGlvblN0YXRlXyA9IF90aGlzLmRlZmF1bHRBY3RpdmF0aW9uU3RhdGVfKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTURDUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUuY2hlY2tFbGVtZW50TWFkZUFjdGl2ZV8gPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHJldHVybiAoZXZ0ICE9PSB1bmRlZmluZWQgJiYgZXZ0LnR5cGUgPT09ICdrZXlkb3duJykgPyB0aGlzLmFkYXB0ZXJfLmlzU3VyZmFjZUFjdGl2ZSgpIDogdHJ1ZTtcbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmFuaW1hdGVBY3RpdmF0aW9uXyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIF9hID0gTURDUmlwcGxlRm91bmRhdGlvbi5zdHJpbmdzLCBWQVJfRkdfVFJBTlNMQVRFX1NUQVJUID0gX2EuVkFSX0ZHX1RSQU5TTEFURV9TVEFSVCwgVkFSX0ZHX1RSQU5TTEFURV9FTkQgPSBfYS5WQVJfRkdfVFJBTlNMQVRFX0VORDtcbiAgICAgICAgdmFyIF9iID0gTURDUmlwcGxlRm91bmRhdGlvbi5jc3NDbGFzc2VzLCBGR19ERUFDVElWQVRJT04gPSBfYi5GR19ERUFDVElWQVRJT04sIEZHX0FDVElWQVRJT04gPSBfYi5GR19BQ1RJVkFUSU9OO1xuICAgICAgICB2YXIgREVBQ1RJVkFUSU9OX1RJTUVPVVRfTVMgPSBNRENSaXBwbGVGb3VuZGF0aW9uLm51bWJlcnMuREVBQ1RJVkFUSU9OX1RJTUVPVVRfTVM7XG4gICAgICAgIHRoaXMubGF5b3V0SW50ZXJuYWxfKCk7XG4gICAgICAgIHZhciB0cmFuc2xhdGVTdGFydCA9ICcnO1xuICAgICAgICB2YXIgdHJhbnNsYXRlRW5kID0gJyc7XG4gICAgICAgIGlmICghdGhpcy5hZGFwdGVyXy5pc1VuYm91bmRlZCgpKSB7XG4gICAgICAgICAgICB2YXIgX2MgPSB0aGlzLmdldEZnVHJhbnNsYXRpb25Db29yZGluYXRlc18oKSwgc3RhcnRQb2ludCA9IF9jLnN0YXJ0UG9pbnQsIGVuZFBvaW50ID0gX2MuZW5kUG9pbnQ7XG4gICAgICAgICAgICB0cmFuc2xhdGVTdGFydCA9IHN0YXJ0UG9pbnQueCArIFwicHgsIFwiICsgc3RhcnRQb2ludC55ICsgXCJweFwiO1xuICAgICAgICAgICAgdHJhbnNsYXRlRW5kID0gZW5kUG9pbnQueCArIFwicHgsIFwiICsgZW5kUG9pbnQueSArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkYXB0ZXJfLnVwZGF0ZUNzc1ZhcmlhYmxlKFZBUl9GR19UUkFOU0xBVEVfU1RBUlQsIHRyYW5zbGF0ZVN0YXJ0KTtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy51cGRhdGVDc3NWYXJpYWJsZShWQVJfRkdfVFJBTlNMQVRFX0VORCwgdHJhbnNsYXRlRW5kKTtcbiAgICAgICAgLy8gQ2FuY2VsIGFueSBvbmdvaW5nIGFjdGl2YXRpb24vZGVhY3RpdmF0aW9uIGFuaW1hdGlvbnNcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYWN0aXZhdGlvblRpbWVyXyk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZnRGVhY3RpdmF0aW9uUmVtb3ZhbFRpbWVyXyk7XG4gICAgICAgIHRoaXMucm1Cb3VuZGVkQWN0aXZhdGlvbkNsYXNzZXNfKCk7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoRkdfREVBQ1RJVkFUSU9OKTtcbiAgICAgICAgLy8gRm9yY2UgbGF5b3V0IGluIG9yZGVyIHRvIHJlLXRyaWdnZXIgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgdGhpcy5hZGFwdGVyXy5jb21wdXRlQm91bmRpbmdSZWN0KCk7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoRkdfQUNUSVZBVElPTik7XG4gICAgICAgIHRoaXMuYWN0aXZhdGlvblRpbWVyXyA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuYWN0aXZhdGlvblRpbWVyQ2FsbGJhY2tfKCk7IH0sIERFQUNUSVZBVElPTl9USU1FT1VUX01TKTtcbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLmdldEZnVHJhbnNsYXRpb25Db29yZGluYXRlc18gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuYWN0aXZhdGlvblN0YXRlXywgYWN0aXZhdGlvbkV2ZW50ID0gX2EuYWN0aXZhdGlvbkV2ZW50LCB3YXNBY3RpdmF0ZWRCeVBvaW50ZXIgPSBfYS53YXNBY3RpdmF0ZWRCeVBvaW50ZXI7XG4gICAgICAgIHZhciBzdGFydFBvaW50O1xuICAgICAgICBpZiAod2FzQWN0aXZhdGVkQnlQb2ludGVyKSB7XG4gICAgICAgICAgICBzdGFydFBvaW50ID0gZ2V0Tm9ybWFsaXplZEV2ZW50Q29vcmRzKGFjdGl2YXRpb25FdmVudCwgdGhpcy5hZGFwdGVyXy5nZXRXaW5kb3dQYWdlT2Zmc2V0KCksIHRoaXMuYWRhcHRlcl8uY29tcHV0ZUJvdW5kaW5nUmVjdCgpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0UG9pbnQgPSB7XG4gICAgICAgICAgICAgICAgeDogdGhpcy5mcmFtZV8ud2lkdGggLyAyLFxuICAgICAgICAgICAgICAgIHk6IHRoaXMuZnJhbWVfLmhlaWdodCAvIDIsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIENlbnRlciB0aGUgZWxlbWVudCBhcm91bmQgdGhlIHN0YXJ0IHBvaW50LlxuICAgICAgICBzdGFydFBvaW50ID0ge1xuICAgICAgICAgICAgeDogc3RhcnRQb2ludC54IC0gKHRoaXMuaW5pdGlhbFNpemVfIC8gMiksXG4gICAgICAgICAgICB5OiBzdGFydFBvaW50LnkgLSAodGhpcy5pbml0aWFsU2l6ZV8gLyAyKSxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGVuZFBvaW50ID0ge1xuICAgICAgICAgICAgeDogKHRoaXMuZnJhbWVfLndpZHRoIC8gMikgLSAodGhpcy5pbml0aWFsU2l6ZV8gLyAyKSxcbiAgICAgICAgICAgIHk6ICh0aGlzLmZyYW1lXy5oZWlnaHQgLyAyKSAtICh0aGlzLmluaXRpYWxTaXplXyAvIDIpLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4geyBzdGFydFBvaW50OiBzdGFydFBvaW50LCBlbmRQb2ludDogZW5kUG9pbnQgfTtcbiAgICB9O1xuICAgIE1EQ1JpcHBsZUZvdW5kYXRpb24ucHJvdG90eXBlLnJ1bkRlYWN0aXZhdGlvblVYTG9naWNJZlJlYWR5XyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJvdGggd2hlbiBhIHBvaW50aW5nIGRldmljZSBpcyByZWxlYXNlZCwgYW5kIHdoZW4gdGhlIGFjdGl2YXRpb24gYW5pbWF0aW9uIGVuZHMuXG4gICAgICAgIC8vIFRoZSBkZWFjdGl2YXRpb24gYW5pbWF0aW9uIHNob3VsZCBvbmx5IHJ1biBhZnRlciBib3RoIG9mIHRob3NlIG9jY3VyLlxuICAgICAgICB2YXIgRkdfREVBQ1RJVkFUSU9OID0gTURDUmlwcGxlRm91bmRhdGlvbi5jc3NDbGFzc2VzLkZHX0RFQUNUSVZBVElPTjtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5hY3RpdmF0aW9uU3RhdGVfLCBoYXNEZWFjdGl2YXRpb25VWFJ1biA9IF9hLmhhc0RlYWN0aXZhdGlvblVYUnVuLCBpc0FjdGl2YXRlZCA9IF9hLmlzQWN0aXZhdGVkO1xuICAgICAgICB2YXIgYWN0aXZhdGlvbkhhc0VuZGVkID0gaGFzRGVhY3RpdmF0aW9uVVhSdW4gfHwgIWlzQWN0aXZhdGVkO1xuICAgICAgICBpZiAoYWN0aXZhdGlvbkhhc0VuZGVkICYmIHRoaXMuYWN0aXZhdGlvbkFuaW1hdGlvbkhhc0VuZGVkXykge1xuICAgICAgICAgICAgdGhpcy5ybUJvdW5kZWRBY3RpdmF0aW9uQ2xhc3Nlc18oKTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoRkdfREVBQ1RJVkFUSU9OKTtcbiAgICAgICAgICAgIHRoaXMuZmdEZWFjdGl2YXRpb25SZW1vdmFsVGltZXJfID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoRkdfREVBQ1RJVkFUSU9OKTtcbiAgICAgICAgICAgIH0sIG51bWJlcnMuRkdfREVBQ1RJVkFUSU9OX01TKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTURDUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUucm1Cb3VuZGVkQWN0aXZhdGlvbkNsYXNzZXNfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgRkdfQUNUSVZBVElPTiA9IE1EQ1JpcHBsZUZvdW5kYXRpb24uY3NzQ2xhc3Nlcy5GR19BQ1RJVkFUSU9OO1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZUNsYXNzKEZHX0FDVElWQVRJT04pO1xuICAgICAgICB0aGlzLmFjdGl2YXRpb25BbmltYXRpb25IYXNFbmRlZF8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5jb21wdXRlQm91bmRpbmdSZWN0KCk7XG4gICAgfTtcbiAgICBNRENSaXBwbGVGb3VuZGF0aW9uLnByb3RvdHlwZS5yZXNldEFjdGl2YXRpb25TdGF0ZV8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucHJldmlvdXNBY3RpdmF0aW9uRXZlbnRfID0gdGhpcy5hY3RpdmF0aW9uU3RhdGVfLmFjdGl2YXRpb25FdmVudDtcbiAgICAgICAgdGhpcy5hY3RpdmF0aW9uU3RhdGVfID0gdGhpcy5kZWZhdWx0QWN0aXZhdGlvblN0YXRlXygpO1xuICAgICAgICAvLyBUb3VjaCBkZXZpY2VzIG1heSBmaXJlIGFkZGl0aW9uYWwgZXZlbnRzIGZvciB0aGUgc2FtZSBpbnRlcmFjdGlvbiB3aXRoaW4gYSBzaG9ydCB0aW1lLlxuICAgICAgICAvLyBTdG9yZSB0aGUgcHJldmlvdXMgZXZlbnQgdW50aWwgaXQncyBzYWZlIHRvIGFzc3VtZSB0aGF0IHN1YnNlcXVlbnQgZXZlbnRzIGFyZSBmb3IgbmV3IGludGVyYWN0aW9ucy5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5wcmV2aW91c0FjdGl2YXRpb25FdmVudF8gPSB1bmRlZmluZWQ7IH0sIE1EQ1JpcHBsZUZvdW5kYXRpb24ubnVtYmVycy5UQVBfREVMQVlfTVMpO1xuICAgIH07XG4gICAgTURDUmlwcGxlRm91bmRhdGlvbi5wcm90b3R5cGUuZGVhY3RpdmF0ZV8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBhY3RpdmF0aW9uU3RhdGUgPSB0aGlzLmFjdGl2YXRpb25TdGF0ZV87XG4gICAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiBpbiBzY2VuYXJpb3Mgc3VjaCBhcyB3aGVuIHlvdSBoYXZlIGEga2V5dXAgZXZlbnQgdGhhdCBibHVycyB0aGUgZWxlbWVudC5cbiAgICAgICAgaWYgKCFhY3RpdmF0aW9uU3RhdGUuaXNBY3RpdmF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RhdGUgPSBfX2Fzc2lnbih7fSwgYWN0aXZhdGlvblN0YXRlKTtcbiAgICAgICAgaWYgKGFjdGl2YXRpb25TdGF0ZS5pc1Byb2dyYW1tYXRpYykge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmFuaW1hdGVEZWFjdGl2YXRpb25fKHN0YXRlKTsgfSk7XG4gICAgICAgICAgICB0aGlzLnJlc2V0QWN0aXZhdGlvblN0YXRlXygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZXJlZ2lzdGVyRGVhY3RpdmF0aW9uSGFuZGxlcnNfKCk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmFjdGl2YXRpb25TdGF0ZV8uaGFzRGVhY3RpdmF0aW9uVVhSdW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIF90aGlzLmFuaW1hdGVEZWFjdGl2YXRpb25fKHN0YXRlKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZXNldEFjdGl2YXRpb25TdGF0ZV8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBNRENSaXBwbGVGb3VuZGF0aW9uLnByb3RvdHlwZS5hbmltYXRlRGVhY3RpdmF0aW9uXyA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgd2FzQWN0aXZhdGVkQnlQb2ludGVyID0gX2Eud2FzQWN0aXZhdGVkQnlQb2ludGVyLCB3YXNFbGVtZW50TWFkZUFjdGl2ZSA9IF9hLndhc0VsZW1lbnRNYWRlQWN0aXZlO1xuICAgICAgICBpZiAod2FzQWN0aXZhdGVkQnlQb2ludGVyIHx8IHdhc0VsZW1lbnRNYWRlQWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bkRlYWN0aXZhdGlvblVYTG9naWNJZlJlYWR5XygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBNRENSaXBwbGVGb3VuZGF0aW9uLnByb3RvdHlwZS5sYXlvdXRJbnRlcm5hbF8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZnJhbWVfID0gdGhpcy5hZGFwdGVyXy5jb21wdXRlQm91bmRpbmdSZWN0KCk7XG4gICAgICAgIHZhciBtYXhEaW0gPSBNYXRoLm1heCh0aGlzLmZyYW1lXy5oZWlnaHQsIHRoaXMuZnJhbWVfLndpZHRoKTtcbiAgICAgICAgLy8gU3VyZmFjZSBkaWFtZXRlciBpcyB0cmVhdGVkIGRpZmZlcmVudGx5IGZvciB1bmJvdW5kZWQgdnMuIGJvdW5kZWQgcmlwcGxlcy5cbiAgICAgICAgLy8gVW5ib3VuZGVkIHJpcHBsZSBkaWFtZXRlciBpcyBjYWxjdWxhdGVkIHNtYWxsZXIgc2luY2UgdGhlIHN1cmZhY2UgaXMgZXhwZWN0ZWQgdG8gYWxyZWFkeSBiZSBwYWRkZWQgYXBwcm9wcmlhdGVseVxuICAgICAgICAvLyB0byBleHRlbmQgdGhlIGhpdGJveCwgYW5kIHRoZSByaXBwbGUgaXMgZXhwZWN0ZWQgdG8gbWVldCB0aGUgZWRnZXMgb2YgdGhlIHBhZGRlZCBoaXRib3ggKHdoaWNoIGlzIHR5cGljYWxseVxuICAgICAgICAvLyBzcXVhcmUpLiBCb3VuZGVkIHJpcHBsZXMsIG9uIHRoZSBvdGhlciBoYW5kLCBhcmUgZnVsbHkgZXhwZWN0ZWQgdG8gZXhwYW5kIGJleW9uZCB0aGUgc3VyZmFjZSdzIGxvbmdlc3QgZGlhbWV0ZXJcbiAgICAgICAgLy8gKGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlIGRpYWdvbmFsIHBsdXMgYSBjb25zdGFudCBwYWRkaW5nKSwgYW5kIGFyZSBjbGlwcGVkIGF0IHRoZSBzdXJmYWNlJ3MgYm9yZGVyIHZpYVxuICAgICAgICAvLyBgb3ZlcmZsb3c6IGhpZGRlbmAuXG4gICAgICAgIHZhciBnZXRCb3VuZGVkUmFkaXVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGh5cG90ZW51c2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coX3RoaXMuZnJhbWVfLndpZHRoLCAyKSArIE1hdGgucG93KF90aGlzLmZyYW1lXy5oZWlnaHQsIDIpKTtcbiAgICAgICAgICAgIHJldHVybiBoeXBvdGVudXNlICsgTURDUmlwcGxlRm91bmRhdGlvbi5udW1iZXJzLlBBRERJTkc7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubWF4UmFkaXVzXyA9IHRoaXMuYWRhcHRlcl8uaXNVbmJvdW5kZWQoKSA/IG1heERpbSA6IGdldEJvdW5kZWRSYWRpdXMoKTtcbiAgICAgICAgLy8gUmlwcGxlIGlzIHNpemVkIGFzIGEgZnJhY3Rpb24gb2YgdGhlIGxhcmdlc3QgZGltZW5zaW9uIG9mIHRoZSBzdXJmYWNlLCB0aGVuIHNjYWxlcyB1cCB1c2luZyBhIENTUyBzY2FsZSB0cmFuc2Zvcm1cbiAgICAgICAgdmFyIGluaXRpYWxTaXplID0gTWF0aC5mbG9vcihtYXhEaW0gKiBNRENSaXBwbGVGb3VuZGF0aW9uLm51bWJlcnMuSU5JVElBTF9PUklHSU5fU0NBTEUpO1xuICAgICAgICAvLyBVbmJvdW5kZWQgcmlwcGxlIHNpemUgc2hvdWxkIGFsd2F5cyBiZSBldmVuIG51bWJlciB0byBlcXVhbGx5IGNlbnRlciBhbGlnbi5cbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlcl8uaXNVbmJvdW5kZWQoKSAmJiBpbml0aWFsU2l6ZSAlIDIgIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbFNpemVfID0gaW5pdGlhbFNpemUgLSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsU2l6ZV8gPSBpbml0aWFsU2l6ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZnU2NhbGVfID0gXCJcIiArIHRoaXMubWF4UmFkaXVzXyAvIHRoaXMuaW5pdGlhbFNpemVfO1xuICAgICAgICB0aGlzLnVwZGF0ZUxheW91dENzc1ZhcnNfKCk7XG4gICAgfTtcbiAgICBNRENSaXBwbGVGb3VuZGF0aW9uLnByb3RvdHlwZS51cGRhdGVMYXlvdXRDc3NWYXJzXyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hID0gTURDUmlwcGxlRm91bmRhdGlvbi5zdHJpbmdzLCBWQVJfRkdfU0laRSA9IF9hLlZBUl9GR19TSVpFLCBWQVJfTEVGVCA9IF9hLlZBUl9MRUZULCBWQVJfVE9QID0gX2EuVkFSX1RPUCwgVkFSX0ZHX1NDQUxFID0gX2EuVkFSX0ZHX1NDQUxFO1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnVwZGF0ZUNzc1ZhcmlhYmxlKFZBUl9GR19TSVpFLCB0aGlzLmluaXRpYWxTaXplXyArIFwicHhcIik7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8udXBkYXRlQ3NzVmFyaWFibGUoVkFSX0ZHX1NDQUxFLCB0aGlzLmZnU2NhbGVfKTtcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlcl8uaXNVbmJvdW5kZWQoKSkge1xuICAgICAgICAgICAgdGhpcy51bmJvdW5kZWRDb29yZHNfID0ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IE1hdGgucm91bmQoKHRoaXMuZnJhbWVfLndpZHRoIC8gMikgLSAodGhpcy5pbml0aWFsU2l6ZV8gLyAyKSksXG4gICAgICAgICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKCh0aGlzLmZyYW1lXy5oZWlnaHQgLyAyKSAtICh0aGlzLmluaXRpYWxTaXplXyAvIDIpKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnVwZGF0ZUNzc1ZhcmlhYmxlKFZBUl9MRUZULCB0aGlzLnVuYm91bmRlZENvb3Jkc18ubGVmdCArIFwicHhcIik7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnVwZGF0ZUNzc1ZhcmlhYmxlKFZBUl9UT1AsIHRoaXMudW5ib3VuZGVkQ29vcmRzXy50b3AgKyBcInB4XCIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTURDUmlwcGxlRm91bmRhdGlvbjtcbn0oTURDRm91bmRhdGlvbikpO1xuZXhwb3J0IHsgTURDUmlwcGxlRm91bmRhdGlvbiB9O1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWRlZmF1bHQtZXhwb3J0IE5lZWRlZCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIE1EQyBXZWIgdjAuNDQuMCBhbmQgZWFybGllci5cbmV4cG9ydCBkZWZhdWx0IE1EQ1JpcHBsZUZvdW5kYXRpb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3VuZGF0aW9uLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBNRENDb21wb25lbnQgfSBmcm9tICdAbWF0ZXJpYWwvYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgYXBwbHlQYXNzaXZlIH0gZnJvbSAnQG1hdGVyaWFsL2RvbS9ldmVudHMnO1xuaW1wb3J0IHsgbWF0Y2hlcyB9IGZyb20gJ0BtYXRlcmlhbC9kb20vcG9ueWZpbGwnO1xuaW1wb3J0IHsgTURDUmlwcGxlRm91bmRhdGlvbiB9IGZyb20gJy4vZm91bmRhdGlvbic7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCc7XG52YXIgTURDUmlwcGxlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNRENSaXBwbGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTURDUmlwcGxlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBNRENSaXBwbGUuYXR0YWNoVG8gPSBmdW5jdGlvbiAocm9vdCwgb3B0cykge1xuICAgICAgICBpZiAob3B0cyA9PT0gdm9pZCAwKSB7IG9wdHMgPSB7IGlzVW5ib3VuZGVkOiB1bmRlZmluZWQgfTsgfVxuICAgICAgICB2YXIgcmlwcGxlID0gbmV3IE1EQ1JpcHBsZShyb290KTtcbiAgICAgICAgLy8gT25seSBvdmVycmlkZSB1bmJvdW5kZWQgYmVoYXZpb3IgaWYgb3B0aW9uIGlzIGV4cGxpY2l0bHkgc3BlY2lmaWVkXG4gICAgICAgIGlmIChvcHRzLmlzVW5ib3VuZGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJpcHBsZS51bmJvdW5kZWQgPSBvcHRzLmlzVW5ib3VuZGVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByaXBwbGU7XG4gICAgfTtcbiAgICBNRENSaXBwbGUuY3JlYXRlQWRhcHRlciA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWRkQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIGluc3RhbmNlLnJvb3RfLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTsgfSxcbiAgICAgICAgICAgIGJyb3dzZXJTdXBwb3J0c0Nzc1ZhcnM6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHV0aWwuc3VwcG9ydHNDc3NWYXJpYWJsZXMod2luZG93KTsgfSxcbiAgICAgICAgICAgIGNvbXB1dGVCb3VuZGluZ1JlY3Q6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGluc3RhbmNlLnJvb3RfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOyB9LFxuICAgICAgICAgICAgY29udGFpbnNFdmVudFRhcmdldDogZnVuY3Rpb24gKHRhcmdldCkgeyByZXR1cm4gaW5zdGFuY2Uucm9vdF8uY29udGFpbnModGFyZ2V0KTsgfSxcbiAgICAgICAgICAgIGRlcmVnaXN0ZXJEb2N1bWVudEludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKGV2dFR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgaGFuZGxlciwgYXBwbHlQYXNzaXZlKCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlcmVnaXN0ZXJJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uIChldnRUeXBlLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLnJvb3RfLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgaGFuZGxlciwgYXBwbHlQYXNzaXZlKCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlcmVnaXN0ZXJSZXNpemVIYW5kbGVyOiBmdW5jdGlvbiAoaGFuZGxlcikgeyByZXR1cm4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGhhbmRsZXIpOyB9LFxuICAgICAgICAgICAgZ2V0V2luZG93UGFnZU9mZnNldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gKHsgeDogd2luZG93LnBhZ2VYT2Zmc2V0LCB5OiB3aW5kb3cucGFnZVlPZmZzZXQgfSk7IH0sXG4gICAgICAgICAgICBpc1N1cmZhY2VBY3RpdmU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1hdGNoZXMoaW5zdGFuY2Uucm9vdF8sICc6YWN0aXZlJyk7IH0sXG4gICAgICAgICAgICBpc1N1cmZhY2VEaXNhYmxlZDogZnVuY3Rpb24gKCkgeyByZXR1cm4gQm9vbGVhbihpbnN0YW5jZS5kaXNhYmxlZCk7IH0sXG4gICAgICAgICAgICBpc1VuYm91bmRlZDogZnVuY3Rpb24gKCkgeyByZXR1cm4gQm9vbGVhbihpbnN0YW5jZS51bmJvdW5kZWQpOyB9LFxuICAgICAgICAgICAgcmVnaXN0ZXJEb2N1bWVudEludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKGV2dFR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgaGFuZGxlciwgYXBwbHlQYXNzaXZlKCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZ2lzdGVySW50ZXJhY3Rpb25IYW5kbGVyOiBmdW5jdGlvbiAoZXZ0VHlwZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5yb290Xy5hZGRFdmVudExpc3RlbmVyKGV2dFR5cGUsIGhhbmRsZXIsIGFwcGx5UGFzc2l2ZSgpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWdpc3RlclJlc2l6ZUhhbmRsZXI6IGZ1bmN0aW9uIChoYW5kbGVyKSB7IHJldHVybiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlcik7IH0sXG4gICAgICAgICAgICByZW1vdmVDbGFzczogZnVuY3Rpb24gKGNsYXNzTmFtZSkgeyByZXR1cm4gaW5zdGFuY2Uucm9vdF8uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpOyB9LFxuICAgICAgICAgICAgdXBkYXRlQ3NzVmFyaWFibGU6IGZ1bmN0aW9uICh2YXJOYW1lLCB2YWx1ZSkgeyByZXR1cm4gaW5zdGFuY2Uucm9vdF8uc3R5bGUuc2V0UHJvcGVydHkodmFyTmFtZSwgdmFsdWUpOyB9LFxuICAgICAgICB9O1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1JpcHBsZS5wcm90b3R5cGUsIFwidW5ib3VuZGVkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLnVuYm91bmRlZF8pO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh1bmJvdW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMudW5ib3VuZGVkXyA9IEJvb2xlYW4odW5ib3VuZGVkKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VW5ib3VuZGVkXygpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBNRENSaXBwbGUucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmZvdW5kYXRpb25fLmFjdGl2YXRlKCk7XG4gICAgfTtcbiAgICBNRENSaXBwbGUucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8uZGVhY3RpdmF0ZSgpO1xuICAgIH07XG4gICAgTURDUmlwcGxlLnByb3RvdHlwZS5sYXlvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm91bmRhdGlvbl8ubGF5b3V0KCk7XG4gICAgfTtcbiAgICBNRENSaXBwbGUucHJvdG90eXBlLmdldERlZmF1bHRGb3VuZGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1EQ1JpcHBsZUZvdW5kYXRpb24oTURDUmlwcGxlLmNyZWF0ZUFkYXB0ZXIodGhpcykpO1xuICAgIH07XG4gICAgTURDUmlwcGxlLnByb3RvdHlwZS5pbml0aWFsU3luY1dpdGhET00gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5yb290XztcbiAgICAgICAgdGhpcy51bmJvdW5kZWQgPSAnbWRjUmlwcGxlSXNVbmJvdW5kZWQnIGluIHJvb3QuZGF0YXNldDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENsb3N1cmUgQ29tcGlsZXIgdGhyb3dzIGFuIGFjY2VzcyBjb250cm9sIGVycm9yIHdoZW4gZGlyZWN0bHkgYWNjZXNzaW5nIGFcbiAgICAgKiBwcm90ZWN0ZWQgb3IgcHJpdmF0ZSBwcm9wZXJ0eSBpbnNpZGUgYSBnZXR0ZXIvc2V0dGVyLCBsaWtlIHVuYm91bmRlZCBhYm92ZS5cbiAgICAgKiBCeSBhY2Nlc3NpbmcgdGhlIHByb3RlY3RlZCBwcm9wZXJ0eSBpbnNpZGUgYSBtZXRob2QsIHdlIHNvbHZlIHRoYXQgcHJvYmxlbS5cbiAgICAgKiBUaGF0J3Mgd2h5IHRoaXMgZnVuY3Rpb24gZXhpc3RzLlxuICAgICAqL1xuICAgIE1EQ1JpcHBsZS5wcm90b3R5cGUuc2V0VW5ib3VuZGVkXyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5mb3VuZGF0aW9uXy5zZXRVbmJvdW5kZWQoQm9vbGVhbih0aGlzLnVuYm91bmRlZF8pKTtcbiAgICB9O1xuICAgIHJldHVybiBNRENSaXBwbGU7XG59KE1EQ0NvbXBvbmVudCkpO1xuZXhwb3J0IHsgTURDUmlwcGxlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wb25lbnQuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG52YXIgY3NzQ2xhc3NlcyA9IHtcbiAgICBST09UOiAnbWRjLXRleHQtZmllbGQtY2hhcmFjdGVyLWNvdW50ZXInLFxufTtcbnZhciBzdHJpbmdzID0ge1xuICAgIFJPT1RfU0VMRUNUT1I6IFwiLlwiICsgY3NzQ2xhc3Nlcy5ST09ULFxufTtcbmV4cG9ydCB7IHN0cmluZ3MsIGNzc0NsYXNzZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnN0YW50cy5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbmltcG9ydCB7IF9fYXNzaWduLCBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE1EQ0ZvdW5kYXRpb24gfSBmcm9tICdAbWF0ZXJpYWwvYmFzZS9mb3VuZGF0aW9uJztcbmltcG9ydCB7IGNzc0NsYXNzZXMsIHN0cmluZ3MgfSBmcm9tICcuL2NvbnN0YW50cyc7XG52YXIgTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlckZvdW5kYXRpb24gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1EQ1RleHRGaWVsZENoYXJhY3RlckNvdW50ZXJGb3VuZGF0aW9uLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1EQ1RleHRGaWVsZENoYXJhY3RlckNvdW50ZXJGb3VuZGF0aW9uKGFkYXB0ZXIpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyRm91bmRhdGlvbi5kZWZhdWx0QWRhcHRlciksIGFkYXB0ZXIpKSB8fCB0aGlzO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlckZvdW5kYXRpb24sIFwiY3NzQ2xhc3Nlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNzc0NsYXNzZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyRm91bmRhdGlvbiwgXCJzdHJpbmdzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5ncztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZENoYXJhY3RlckNvdW50ZXJGb3VuZGF0aW9uLCBcImRlZmF1bHRBZGFwdGVyXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlZSB7QGxpbmsgTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlckFkYXB0ZXJ9IGZvciB0eXBpbmcgaW5mb3JtYXRpb24gb24gcGFyYW1ldGVycyBhbmQgcmV0dXJuIHR5cGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNldENvbnRlbnQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE1EQ1RleHRGaWVsZENoYXJhY3RlckNvdW50ZXJGb3VuZGF0aW9uLnByb3RvdHlwZS5zZXRDb3VudGVyVmFsdWUgPSBmdW5jdGlvbiAoY3VycmVudExlbmd0aCwgbWF4TGVuZ3RoKSB7XG4gICAgICAgIGN1cnJlbnRMZW5ndGggPSBNYXRoLm1pbihjdXJyZW50TGVuZ3RoLCBtYXhMZW5ndGgpO1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnNldENvbnRlbnQoY3VycmVudExlbmd0aCArIFwiIC8gXCIgKyBtYXhMZW5ndGgpO1xuICAgIH07XG4gICAgcmV0dXJuIE1EQ1RleHRGaWVsZENoYXJhY3RlckNvdW50ZXJGb3VuZGF0aW9uO1xufShNRENGb3VuZGF0aW9uKSk7XG5leHBvcnQgeyBNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyRm91bmRhdGlvbiB9O1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWRlZmF1bHQtZXhwb3J0IE5lZWRlZCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIE1EQyBXZWIgdjAuNDQuMCBhbmQgZWFybGllci5cbmV4cG9ydCBkZWZhdWx0IE1EQ1RleHRGaWVsZENoYXJhY3RlckNvdW50ZXJGb3VuZGF0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm91bmRhdGlvbi5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbmltcG9ydCB7IF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgTURDQ29tcG9uZW50IH0gZnJvbSAnQG1hdGVyaWFsL2Jhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IE1EQ1RleHRGaWVsZENoYXJhY3RlckNvdW50ZXJGb3VuZGF0aW9uIH0gZnJvbSAnLi9mb3VuZGF0aW9uJztcbnZhciBNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1EQ1RleHRGaWVsZENoYXJhY3RlckNvdW50ZXIoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlci5hdHRhY2hUbyA9IGZ1bmN0aW9uIChyb290KSB7XG4gICAgICAgIHJldHVybiBuZXcgTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlcihyb290KTtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyLnByb3RvdHlwZSwgXCJmb3VuZGF0aW9uXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3VuZGF0aW9uXztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlci5wcm90b3R5cGUuZ2V0RGVmYXVsdEZvdW5kYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8vIERPIE5PVCBJTkxJTkUgdGhpcyB2YXJpYWJsZS4gRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIGZvdW5kYXRpb25zIHRha2UgYSBQYXJ0aWFsPE1EQ0Zvb0FkYXB0ZXI+LlxuICAgICAgICAvLyBUbyBlbnN1cmUgd2UgZG9uJ3QgYWNjaWRlbnRhbGx5IG9taXQgYW55IG1ldGhvZHMsIHdlIG5lZWQgYSBzZXBhcmF0ZSwgc3Ryb25nbHkgdHlwZWQgYWRhcHRlciB2YXJpYWJsZS5cbiAgICAgICAgdmFyIGFkYXB0ZXIgPSB7XG4gICAgICAgICAgICBzZXRDb250ZW50OiBmdW5jdGlvbiAoY29udGVudCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnJvb3RfLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXcgTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlckZvdW5kYXRpb24oYWRhcHRlcik7XG4gICAgfTtcbiAgICByZXR1cm4gTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlcjtcbn0oTURDQ29tcG9uZW50KSk7XG5leHBvcnQgeyBNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wb25lbnQuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG52YXIgc3RyaW5ncyA9IHtcbiAgICBBUklBX0NPTlRST0xTOiAnYXJpYS1jb250cm9scycsXG4gICAgSU5QVVRfU0VMRUNUT1I6ICcubWRjLXRleHQtZmllbGRfX2lucHV0JyxcbiAgICBMQUJFTF9TRUxFQ1RPUjogJy5tZGMtZmxvYXRpbmctbGFiZWwnLFxuICAgIExFQURJTkdfSUNPTl9TRUxFQ1RPUjogJy5tZGMtdGV4dC1maWVsZF9faWNvbi0tbGVhZGluZycsXG4gICAgTElORV9SSVBQTEVfU0VMRUNUT1I6ICcubWRjLWxpbmUtcmlwcGxlJyxcbiAgICBPVVRMSU5FX1NFTEVDVE9SOiAnLm1kYy1ub3RjaGVkLW91dGxpbmUnLFxuICAgIFBSRUZJWF9TRUxFQ1RPUjogJy5tZGMtdGV4dC1maWVsZF9fYWZmaXgtLXByZWZpeCcsXG4gICAgU1VGRklYX1NFTEVDVE9SOiAnLm1kYy10ZXh0LWZpZWxkX19hZmZpeC0tc3VmZml4JyxcbiAgICBUUkFJTElOR19JQ09OX1NFTEVDVE9SOiAnLm1kYy10ZXh0LWZpZWxkX19pY29uLS10cmFpbGluZydcbn07XG52YXIgY3NzQ2xhc3NlcyA9IHtcbiAgICBESVNBQkxFRDogJ21kYy10ZXh0LWZpZWxkLS1kaXNhYmxlZCcsXG4gICAgRk9DVVNFRDogJ21kYy10ZXh0LWZpZWxkLS1mb2N1c2VkJyxcbiAgICBGVUxMV0lEVEg6ICdtZGMtdGV4dC1maWVsZC0tZnVsbHdpZHRoJyxcbiAgICBIRUxQRVJfTElORTogJ21kYy10ZXh0LWZpZWxkLWhlbHBlci1saW5lJyxcbiAgICBJTlZBTElEOiAnbWRjLXRleHQtZmllbGQtLWludmFsaWQnLFxuICAgIExBQkVMX0ZMT0FUSU5HOiAnbWRjLXRleHQtZmllbGQtLWxhYmVsLWZsb2F0aW5nJyxcbiAgICBOT19MQUJFTDogJ21kYy10ZXh0LWZpZWxkLS1uby1sYWJlbCcsXG4gICAgT1VUTElORUQ6ICdtZGMtdGV4dC1maWVsZC0tb3V0bGluZWQnLFxuICAgIFJPT1Q6ICdtZGMtdGV4dC1maWVsZCcsXG4gICAgVEVYVEFSRUE6ICdtZGMtdGV4dC1maWVsZC0tdGV4dGFyZWEnLFxuICAgIFdJVEhfTEVBRElOR19JQ09OOiAnbWRjLXRleHQtZmllbGQtLXdpdGgtbGVhZGluZy1pY29uJyxcbiAgICBXSVRIX1RSQUlMSU5HX0lDT046ICdtZGMtdGV4dC1maWVsZC0td2l0aC10cmFpbGluZy1pY29uJyxcbn07XG52YXIgbnVtYmVycyA9IHtcbiAgICBMQUJFTF9TQ0FMRTogMC43NSxcbn07XG4vKipcbiAqIFdoaXRlbGlzdCBiYXNlZCBvZmYgb2YgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvR3VpZGUvSFRNTC9IVE1MNS9Db25zdHJhaW50X3ZhbGlkYXRpb25cbiAqIHVuZGVyIHRoZSBcIlZhbGlkYXRpb24tcmVsYXRlZCBhdHRyaWJ1dGVzXCIgc2VjdGlvbi5cbiAqL1xudmFyIFZBTElEQVRJT05fQVRUUl9XSElURUxJU1QgPSBbXG4gICAgJ3BhdHRlcm4nLCAnbWluJywgJ21heCcsICdyZXF1aXJlZCcsICdzdGVwJywgJ21pbmxlbmd0aCcsICdtYXhsZW5ndGgnLFxuXTtcbi8qKlxuICogTGFiZWwgc2hvdWxkIGFsd2F5cyBmbG9hdCBmb3IgdGhlc2UgdHlwZXMgYXMgdGhleSBzaG93IHNvbWUgVUkgZXZlbiBpZiB2YWx1ZSBpcyBlbXB0eS5cbiAqL1xudmFyIEFMV0FZU19GTE9BVF9UWVBFUyA9IFtcbiAgICAnY29sb3InLCAnZGF0ZScsICdkYXRldGltZS1sb2NhbCcsICdtb250aCcsICdyYW5nZScsICd0aW1lJywgJ3dlZWsnLFxuXTtcbmV4cG9ydCB7IGNzc0NsYXNzZXMsIHN0cmluZ3MsIG51bWJlcnMsIFZBTElEQVRJT05fQVRUUl9XSElURUxJU1QsIEFMV0FZU19GTE9BVF9UWVBFUyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uc3RhbnRzLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuaW1wb3J0IHsgX19hc3NpZ24sIF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgTURDRm91bmRhdGlvbiB9IGZyb20gJ0BtYXRlcmlhbC9iYXNlL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgQUxXQVlTX0ZMT0FUX1RZUEVTLCBjc3NDbGFzc2VzLCBudW1iZXJzLCBzdHJpbmdzLCBWQUxJREFUSU9OX0FUVFJfV0hJVEVMSVNUIH0gZnJvbSAnLi9jb25zdGFudHMnO1xudmFyIFBPSU5URVJET1dOX0VWRU5UUyA9IFsnbW91c2Vkb3duJywgJ3RvdWNoc3RhcnQnXTtcbnZhciBJTlRFUkFDVElPTl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXTtcbnZhciBNRENUZXh0RmllbGRGb3VuZGF0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNRENUZXh0RmllbGRGb3VuZGF0aW9uLCBfc3VwZXIpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBhZGFwdGVyXG4gICAgICogQHBhcmFtIGZvdW5kYXRpb25NYXAgTWFwIGZyb20gc3ViY29tcG9uZW50IG5hbWVzIHRvIHRoZWlyIHN1YmZvdW5kYXRpb25zLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24oYWRhcHRlciwgZm91bmRhdGlvbk1hcCkge1xuICAgICAgICBpZiAoZm91bmRhdGlvbk1hcCA9PT0gdm9pZCAwKSB7IGZvdW5kYXRpb25NYXAgPSB7fTsgfVxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5kZWZhdWx0QWRhcHRlciksIGFkYXB0ZXIpKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5pc0ZvY3VzZWRfID0gZmFsc2U7XG4gICAgICAgIF90aGlzLnJlY2VpdmVkVXNlcklucHV0XyA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5pc1ZhbGlkXyA9IHRydWU7XG4gICAgICAgIF90aGlzLnVzZU5hdGl2ZVZhbGlkYXRpb25fID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMuaGVscGVyVGV4dF8gPSBmb3VuZGF0aW9uTWFwLmhlbHBlclRleHQ7XG4gICAgICAgIF90aGlzLmNoYXJhY3RlckNvdW50ZXJfID0gZm91bmRhdGlvbk1hcC5jaGFyYWN0ZXJDb3VudGVyO1xuICAgICAgICBfdGhpcy5sZWFkaW5nSWNvbl8gPSBmb3VuZGF0aW9uTWFwLmxlYWRpbmdJY29uO1xuICAgICAgICBfdGhpcy50cmFpbGluZ0ljb25fID0gZm91bmRhdGlvbk1hcC50cmFpbGluZ0ljb247XG4gICAgICAgIF90aGlzLmlucHV0Rm9jdXNIYW5kbGVyXyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmFjdGl2YXRlRm9jdXMoKTsgfTtcbiAgICAgICAgX3RoaXMuaW5wdXRCbHVySGFuZGxlcl8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5kZWFjdGl2YXRlRm9jdXMoKTsgfTtcbiAgICAgICAgX3RoaXMuaW5wdXRJbnB1dEhhbmRsZXJfID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuaGFuZGxlSW5wdXQoKTsgfTtcbiAgICAgICAgX3RoaXMuc2V0UG9pbnRlclhPZmZzZXRfID0gZnVuY3Rpb24gKGV2dCkgeyByZXR1cm4gX3RoaXMuc2V0VHJhbnNmb3JtT3JpZ2luKGV2dCk7IH07XG4gICAgICAgIF90aGlzLnRleHRGaWVsZEludGVyYWN0aW9uSGFuZGxlcl8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5oYW5kbGVUZXh0RmllbGRJbnRlcmFjdGlvbigpOyB9O1xuICAgICAgICBfdGhpcy52YWxpZGF0aW9uQXR0cmlidXRlQ2hhbmdlSGFuZGxlcl8gPSBmdW5jdGlvbiAoYXR0cmlidXRlc0xpc3QpIHsgcmV0dXJuIF90aGlzLmhhbmRsZVZhbGlkYXRpb25BdHRyaWJ1dGVDaGFuZ2UoYXR0cmlidXRlc0xpc3QpOyB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGRGb3VuZGF0aW9uLCBcImNzc0NsYXNzZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjc3NDbGFzc2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkRm91bmRhdGlvbiwgXCJzdHJpbmdzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5ncztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZEZvdW5kYXRpb24sIFwibnVtYmVyc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlcnM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGRGb3VuZGF0aW9uLnByb3RvdHlwZSwgXCJzaG91bGRBbHdheXNGbG9hdF9cIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdGhpcy5nZXROYXRpdmVJbnB1dF8oKS50eXBlO1xuICAgICAgICAgICAgcmV0dXJuIEFMV0FZU19GTE9BVF9UWVBFUy5pbmRleE9mKHR5cGUpID49IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGRGb3VuZGF0aW9uLnByb3RvdHlwZSwgXCJzaG91bGRGbG9hdFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdWxkQWx3YXlzRmxvYXRfIHx8IHRoaXMuaXNGb2N1c2VkXyB8fCAhIXRoaXMuZ2V0VmFsdWUoKSB8fCB0aGlzLmlzQmFkSW5wdXRfKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGRGb3VuZGF0aW9uLnByb3RvdHlwZSwgXCJzaG91bGRTaGFrZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLmlzRm9jdXNlZF8gJiYgIXRoaXMuaXNWYWxpZCgpICYmICEhdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkRm91bmRhdGlvbiwgXCJkZWZhdWx0QWRhcHRlclwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWUge0BsaW5rIE1EQ1RleHRGaWVsZEFkYXB0ZXJ9IGZvciB0eXBpbmcgaW5mb3JtYXRpb24gb24gcGFyYW1ldGVycyBhbmQgcmV0dXJuIHR5cGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXMgTWV0aG9kcyBzaG91bGQgYmUgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIGFkYXB0ZXIgaW50ZXJmYWNlLlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgaGFzQ2xhc3M6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0sXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJUZXh0RmllbGRJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICBkZXJlZ2lzdGVyVGV4dEZpZWxkSW50ZXJhY3Rpb25IYW5kbGVyOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJJbnB1dEludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIGRlcmVnaXN0ZXJJbnB1dEludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyVmFsaWRhdGlvbkF0dHJpYnV0ZUNoYW5nZUhhbmRsZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSk7IH0sXG4gICAgICAgICAgICAgICAgZGVyZWdpc3RlclZhbGlkYXRpb25BdHRyaWJ1dGVDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgZ2V0TmF0aXZlSW5wdXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgICAgICAgICAgaXNGb2N1c2VkOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmYWxzZTsgfSxcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZUxpbmVSaXBwbGU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlTGluZVJpcHBsZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHNldExpbmVSaXBwbGVUcmFuc2Zvcm1PcmlnaW46IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICBzaGFrZUxhYmVsOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgZmxvYXRMYWJlbDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIGhhc0xhYmVsOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmYWxzZTsgfSxcbiAgICAgICAgICAgICAgICBnZXRMYWJlbFdpZHRoOiBmdW5jdGlvbiAoKSB7IHJldHVybiAwOyB9LFxuICAgICAgICAgICAgICAgIGhhc091dGxpbmU6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuICAgICAgICAgICAgICAgIG5vdGNoT3V0bGluZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIGNsb3NlT3V0bGluZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIHRzbGludDplbmFibGU6b2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXJfLmlzRm9jdXNlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Rm9jdXNIYW5kbGVyXygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuYWRhcHRlcl8uaGFzTGFiZWwoKSAmJiB0aGlzLnNob3VsZEZsb2F0KSB7XG4gICAgICAgICAgICB0aGlzLm5vdGNoT3V0bGluZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uZmxvYXRMYWJlbCh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVGbG9hdGluZ18odHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGFwdGVyXy5yZWdpc3RlcklucHV0SW50ZXJhY3Rpb25IYW5kbGVyKCdmb2N1cycsIHRoaXMuaW5wdXRGb2N1c0hhbmRsZXJfKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5yZWdpc3RlcklucHV0SW50ZXJhY3Rpb25IYW5kbGVyKCdibHVyJywgdGhpcy5pbnB1dEJsdXJIYW5kbGVyXyk7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8ucmVnaXN0ZXJJbnB1dEludGVyYWN0aW9uSGFuZGxlcignaW5wdXQnLCB0aGlzLmlucHV0SW5wdXRIYW5kbGVyXyk7XG4gICAgICAgIFBPSU5URVJET1dOX0VWRU5UUy5mb3JFYWNoKGZ1bmN0aW9uIChldnRUeXBlKSB7XG4gICAgICAgICAgICBfdGhpcy5hZGFwdGVyXy5yZWdpc3RlcklucHV0SW50ZXJhY3Rpb25IYW5kbGVyKGV2dFR5cGUsIF90aGlzLnNldFBvaW50ZXJYT2Zmc2V0Xyk7XG4gICAgICAgIH0pO1xuICAgICAgICBJTlRFUkFDVElPTl9FVkVOVFMuZm9yRWFjaChmdW5jdGlvbiAoZXZ0VHlwZSkge1xuICAgICAgICAgICAgX3RoaXMuYWRhcHRlcl8ucmVnaXN0ZXJUZXh0RmllbGRJbnRlcmFjdGlvbkhhbmRsZXIoZXZ0VHlwZSwgX3RoaXMudGV4dEZpZWxkSW50ZXJhY3Rpb25IYW5kbGVyXyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZhbGlkYXRpb25PYnNlcnZlcl8gPVxuICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5yZWdpc3RlclZhbGlkYXRpb25BdHRyaWJ1dGVDaGFuZ2VIYW5kbGVyKHRoaXMudmFsaWRhdGlvbkF0dHJpYnV0ZUNoYW5nZUhhbmRsZXJfKTtcbiAgICAgICAgdGhpcy5zZXRDaGFyYWN0ZXJDb3VudGVyXyh0aGlzLmdldFZhbHVlKCkubGVuZ3RoKTtcbiAgICB9O1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uZGVyZWdpc3RlcklucHV0SW50ZXJhY3Rpb25IYW5kbGVyKCdmb2N1cycsIHRoaXMuaW5wdXRGb2N1c0hhbmRsZXJfKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5kZXJlZ2lzdGVySW5wdXRJbnRlcmFjdGlvbkhhbmRsZXIoJ2JsdXInLCB0aGlzLmlucHV0Qmx1ckhhbmRsZXJfKTtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5kZXJlZ2lzdGVySW5wdXRJbnRlcmFjdGlvbkhhbmRsZXIoJ2lucHV0JywgdGhpcy5pbnB1dElucHV0SGFuZGxlcl8pO1xuICAgICAgICBQT0lOVEVSRE9XTl9FVkVOVFMuZm9yRWFjaChmdW5jdGlvbiAoZXZ0VHlwZSkge1xuICAgICAgICAgICAgX3RoaXMuYWRhcHRlcl8uZGVyZWdpc3RlcklucHV0SW50ZXJhY3Rpb25IYW5kbGVyKGV2dFR5cGUsIF90aGlzLnNldFBvaW50ZXJYT2Zmc2V0Xyk7XG4gICAgICAgIH0pO1xuICAgICAgICBJTlRFUkFDVElPTl9FVkVOVFMuZm9yRWFjaChmdW5jdGlvbiAoZXZ0VHlwZSkge1xuICAgICAgICAgICAgX3RoaXMuYWRhcHRlcl8uZGVyZWdpc3RlclRleHRGaWVsZEludGVyYWN0aW9uSGFuZGxlcihldnRUeXBlLCBfdGhpcy50ZXh0RmllbGRJbnRlcmFjdGlvbkhhbmRsZXJfKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uZGVyZWdpc3RlclZhbGlkYXRpb25BdHRyaWJ1dGVDaGFuZ2VIYW5kbGVyKHRoaXMudmFsaWRhdGlvbk9ic2VydmVyXyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHVzZXIgaW50ZXJhY3Rpb25zIHdpdGggdGhlIFRleHQgRmllbGQuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuaGFuZGxlVGV4dEZpZWxkSW50ZXJhY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuYXRpdmVJbnB1dCA9IHRoaXMuYWRhcHRlcl8uZ2V0TmF0aXZlSW5wdXQoKTtcbiAgICAgICAgaWYgKG5hdGl2ZUlucHV0ICYmIG5hdGl2ZUlucHV0LmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWNlaXZlZFVzZXJJbnB1dF8gPSB0cnVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB2YWxpZGF0aW9uIGF0dHJpYnV0ZSBjaGFuZ2VzXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuaGFuZGxlVmFsaWRhdGlvbkF0dHJpYnV0ZUNoYW5nZSA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVzTGlzdCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBhdHRyaWJ1dGVzTGlzdC5zb21lKGZ1bmN0aW9uIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgICAgICBpZiAoVkFMSURBVElPTl9BVFRSX1dISVRFTElTVC5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zdHlsZVZhbGlkaXR5Xyh0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzTGlzdC5pbmRleE9mKCdtYXhsZW5ndGgnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnNldENoYXJhY3RlckNvdW50ZXJfKHRoaXMuZ2V0VmFsdWUoKS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBPcGVucy9jbG9zZXMgdGhlIG5vdGNoZWQgb3V0bGluZS5cbiAgICAgKi9cbiAgICBNRENUZXh0RmllbGRGb3VuZGF0aW9uLnByb3RvdHlwZS5ub3RjaE91dGxpbmUgPSBmdW5jdGlvbiAob3Blbk5vdGNoKSB7XG4gICAgICAgIGlmICghdGhpcy5hZGFwdGVyXy5oYXNPdXRsaW5lKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3Blbk5vdGNoKSB7XG4gICAgICAgICAgICB2YXIgbGFiZWxXaWR0aCA9IHRoaXMuYWRhcHRlcl8uZ2V0TGFiZWxXaWR0aCgpICogbnVtYmVycy5MQUJFTF9TQ0FMRTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ubm90Y2hPdXRsaW5lKGxhYmVsV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5jbG9zZU91dGxpbmUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQWN0aXZhdGVzIHRoZSB0ZXh0IGZpZWxkIGZvY3VzIHN0YXRlLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLmFjdGl2YXRlRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkXyA9IHRydWU7XG4gICAgICAgIHRoaXMuc3R5bGVGb2N1c2VkXyh0aGlzLmlzRm9jdXNlZF8pO1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLmFjdGl2YXRlTGluZVJpcHBsZSgpO1xuICAgICAgICBpZiAodGhpcy5hZGFwdGVyXy5oYXNMYWJlbCgpKSB7XG4gICAgICAgICAgICB0aGlzLm5vdGNoT3V0bGluZSh0aGlzLnNob3VsZEZsb2F0KTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uZmxvYXRMYWJlbCh0aGlzLnNob3VsZEZsb2F0KTtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVGbG9hdGluZ18odGhpcy5zaG91bGRGbG9hdCk7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnNoYWtlTGFiZWwodGhpcy5zaG91bGRTaGFrZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaGVscGVyVGV4dF8pIHtcbiAgICAgICAgICAgIHRoaXMuaGVscGVyVGV4dF8uc2hvd1RvU2NyZWVuUmVhZGVyKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGxpbmUgcmlwcGxlJ3MgdHJhbnNmb3JtIG9yaWdpbiwgc28gdGhhdCB0aGUgbGluZSByaXBwbGUgYWN0aXZhdGVcbiAgICAgKiBhbmltYXRpb24gd2lsbCBhbmltYXRlIG91dCBmcm9tIHRoZSB1c2VyJ3MgY2xpY2sgbG9jYXRpb24uXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuc2V0VHJhbnNmb3JtT3JpZ2luID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICB2YXIgdG91Y2hlcyA9IGV2dC50b3VjaGVzO1xuICAgICAgICB2YXIgdGFyZ2V0RXZlbnQgPSB0b3VjaGVzID8gdG91Y2hlc1swXSA6IGV2dDtcbiAgICAgICAgdmFyIHRhcmdldENsaWVudFJlY3QgPSB0YXJnZXRFdmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBub3JtYWxpemVkWCA9IHRhcmdldEV2ZW50LmNsaWVudFggLSB0YXJnZXRDbGllbnRSZWN0LmxlZnQ7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uc2V0TGluZVJpcHBsZVRyYW5zZm9ybU9yaWdpbihub3JtYWxpemVkWCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGlucHV0IGNoYW5nZSBvZiB0ZXh0IGlucHV0IGFuZCB0ZXh0IGFyZWEuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuaGFuZGxlSW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYXV0b0NvbXBsZXRlRm9jdXMoKTtcbiAgICAgICAgdGhpcy5zZXRDaGFyYWN0ZXJDb3VudGVyXyh0aGlzLmdldFZhbHVlKCkubGVuZ3RoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFjdGl2YXRlcyB0aGUgVGV4dCBGaWVsZCdzIGZvY3VzIHN0YXRlIGluIGNhc2VzIHdoZW4gdGhlIGlucHV0IHZhbHVlXG4gICAgICogY2hhbmdlcyB3aXRob3V0IHVzZXIgaW5wdXQgKGUuZy4gcHJvZ3JhbW1hdGljYWxseSkuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuYXV0b0NvbXBsZXRlRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5yZWNlaXZlZFVzZXJJbnB1dF8pIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVGb2N1cygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEZWFjdGl2YXRlcyB0aGUgVGV4dCBGaWVsZCdzIGZvY3VzIHN0YXRlLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLmRlYWN0aXZhdGVGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc0ZvY3VzZWRfID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uZGVhY3RpdmF0ZUxpbmVSaXBwbGUoKTtcbiAgICAgICAgdmFyIGlzVmFsaWQgPSB0aGlzLmlzVmFsaWQoKTtcbiAgICAgICAgdGhpcy5zdHlsZVZhbGlkaXR5Xyhpc1ZhbGlkKTtcbiAgICAgICAgdGhpcy5zdHlsZUZvY3VzZWRfKHRoaXMuaXNGb2N1c2VkXyk7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXJfLmhhc0xhYmVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMubm90Y2hPdXRsaW5lKHRoaXMuc2hvdWxkRmxvYXQpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5mbG9hdExhYmVsKHRoaXMuc2hvdWxkRmxvYXQpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZUZsb2F0aW5nXyh0aGlzLnNob3VsZEZsb2F0KTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uc2hha2VMYWJlbCh0aGlzLnNob3VsZFNoYWtlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkRmxvYXQpIHtcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZWRVc2VySW5wdXRfID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYXRpdmVJbnB1dF8oKS52YWx1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0IG9uIHRoZSBpbnB1dCBFbGVtZW50LlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIFByZXZlbnQgU2FmYXJpIGZyb20gbW92aW5nIHRoZSBjYXJldCB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCB3aGVuIHRoZSB2YWx1ZSBoYXMgbm90IGNoYW5nZWQuXG4gICAgICAgIGlmICh0aGlzLmdldFZhbHVlKCkgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmdldE5hdGl2ZUlucHV0XygpLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDaGFyYWN0ZXJDb3VudGVyXyh2YWx1ZS5sZW5ndGgpO1xuICAgICAgICB2YXIgaXNWYWxpZCA9IHRoaXMuaXNWYWxpZCgpO1xuICAgICAgICB0aGlzLnN0eWxlVmFsaWRpdHlfKGlzVmFsaWQpO1xuICAgICAgICBpZiAodGhpcy5hZGFwdGVyXy5oYXNMYWJlbCgpKSB7XG4gICAgICAgICAgICB0aGlzLm5vdGNoT3V0bGluZSh0aGlzLnNob3VsZEZsb2F0KTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uZmxvYXRMYWJlbCh0aGlzLnNob3VsZEZsb2F0KTtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVGbG9hdGluZ18odGhpcy5zaG91bGRGbG9hdCk7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnNoYWtlTGFiZWwodGhpcy5zaG91bGRTaGFrZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEByZXR1cm4gVGhlIGN1c3RvbSB2YWxpZGl0eSBzdGF0ZSwgaWYgc2V0OyBvdGhlcndpc2UsIHRoZSByZXN1bHQgb2YgYSBuYXRpdmUgdmFsaWRpdHkgY2hlY2suXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlTmF0aXZlVmFsaWRhdGlvbl9cbiAgICAgICAgICAgID8gdGhpcy5pc05hdGl2ZUlucHV0VmFsaWRfKCkgOiB0aGlzLmlzVmFsaWRfO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlzVmFsaWQgU2V0cyB0aGUgY3VzdG9tIHZhbGlkaXR5IHN0YXRlIG9mIHRoZSBUZXh0IEZpZWxkLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLnNldFZhbGlkID0gZnVuY3Rpb24gKGlzVmFsaWQpIHtcbiAgICAgICAgdGhpcy5pc1ZhbGlkXyA9IGlzVmFsaWQ7XG4gICAgICAgIHRoaXMuc3R5bGVWYWxpZGl0eV8oaXNWYWxpZCk7XG4gICAgICAgIHZhciBzaG91bGRTaGFrZSA9ICFpc1ZhbGlkICYmICF0aGlzLmlzRm9jdXNlZF8gJiYgISF0aGlzLmdldFZhbHVlKCk7XG4gICAgICAgIGlmICh0aGlzLmFkYXB0ZXJfLmhhc0xhYmVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uc2hha2VMYWJlbChzaG91bGRTaGFrZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEVuYWJsZXMgb3IgZGlzYWJsZXMgdGhlIHVzZSBvZiBuYXRpdmUgdmFsaWRhdGlvbi4gVXNlIHRoaXMgZm9yIGN1c3RvbSB2YWxpZGF0aW9uLlxuICAgICAqIEBwYXJhbSB1c2VOYXRpdmVWYWxpZGF0aW9uIFNldCB0aGlzIHRvIGZhbHNlIHRvIGlnbm9yZSBuYXRpdmUgaW5wdXQgdmFsaWRhdGlvbi5cbiAgICAgKi9cbiAgICBNRENUZXh0RmllbGRGb3VuZGF0aW9uLnByb3RvdHlwZS5zZXRVc2VOYXRpdmVWYWxpZGF0aW9uID0gZnVuY3Rpb24gKHVzZU5hdGl2ZVZhbGlkYXRpb24pIHtcbiAgICAgICAgdGhpcy51c2VOYXRpdmVWYWxpZGF0aW9uXyA9IHVzZU5hdGl2ZVZhbGlkYXRpb247XG4gICAgfTtcbiAgICBNRENUZXh0RmllbGRGb3VuZGF0aW9uLnByb3RvdHlwZS5pc0Rpc2FibGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYXRpdmVJbnB1dF8oKS5kaXNhYmxlZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBkaXNhYmxlZCBTZXRzIHRoZSB0ZXh0LWZpZWxkIGRpc2FibGVkIG9yIGVuYWJsZWQuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuc2V0RGlzYWJsZWQgPSBmdW5jdGlvbiAoZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5nZXROYXRpdmVJbnB1dF8oKS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgICB0aGlzLnN0eWxlRGlzYWJsZWRfKGRpc2FibGVkKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjb250ZW50IFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGhlbHBlciB0ZXh0LlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLnNldEhlbHBlclRleHRDb250ZW50ID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaGVscGVyVGV4dF8pIHtcbiAgICAgICAgICAgIHRoaXMuaGVscGVyVGV4dF8uc2V0Q29udGVudChjb250ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgYXJpYSBsYWJlbCBvZiB0aGUgbGVhZGluZyBpY29uLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLnNldExlYWRpbmdJY29uQXJpYUxhYmVsID0gZnVuY3Rpb24gKGxhYmVsKSB7XG4gICAgICAgIGlmICh0aGlzLmxlYWRpbmdJY29uXykge1xuICAgICAgICAgICAgdGhpcy5sZWFkaW5nSWNvbl8uc2V0QXJpYUxhYmVsKGxhYmVsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBsZWFkaW5nIGljb24uXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuc2V0TGVhZGluZ0ljb25Db250ZW50ID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMubGVhZGluZ0ljb25fKSB7XG4gICAgICAgICAgICB0aGlzLmxlYWRpbmdJY29uXy5zZXRDb250ZW50KGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBhcmlhIGxhYmVsIG9mIHRoZSB0cmFpbGluZyBpY29uLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLnNldFRyYWlsaW5nSWNvbkFyaWFMYWJlbCA9IGZ1bmN0aW9uIChsYWJlbCkge1xuICAgICAgICBpZiAodGhpcy50cmFpbGluZ0ljb25fKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWlsaW5nSWNvbl8uc2V0QXJpYUxhYmVsKGxhYmVsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSB0cmFpbGluZyBpY29uLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLnNldFRyYWlsaW5nSWNvbkNvbnRlbnQgPSBmdW5jdGlvbiAoY29udGVudCkge1xuICAgICAgICBpZiAodGhpcy50cmFpbGluZ0ljb25fKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWlsaW5nSWNvbl8uc2V0Q29udGVudChjb250ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0cyBjaGFyYWN0ZXIgY291bnRlciB2YWx1ZXMgdGhhdCBzaG93cyBjaGFyYWN0ZXJzIHVzZWQgYW5kIHRoZSB0b3RhbCBjaGFyYWN0ZXIgbGltaXQuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuc2V0Q2hhcmFjdGVyQ291bnRlcl8gPSBmdW5jdGlvbiAoY3VycmVudExlbmd0aCkge1xuICAgICAgICBpZiAoIXRoaXMuY2hhcmFjdGVyQ291bnRlcl8pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF4TGVuZ3RoID0gdGhpcy5nZXROYXRpdmVJbnB1dF8oKS5tYXhMZW5ndGg7XG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01EQ1RleHRGaWVsZEZvdW5kYXRpb246IEV4cGVjdGVkIG1heGxlbmd0aCBodG1sIHByb3BlcnR5IG9uIHRleHQgaW5wdXQgb3IgdGV4dGFyZWEuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJDb3VudGVyXy5zZXRDb3VudGVyVmFsdWUoY3VycmVudExlbmd0aCwgbWF4TGVuZ3RoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEByZXR1cm4gVHJ1ZSBpZiB0aGUgVGV4dCBGaWVsZCBpbnB1dCBmYWlscyBpbiBjb252ZXJ0aW5nIHRoZSB1c2VyLXN1cHBsaWVkIHZhbHVlLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLmlzQmFkSW5wdXRfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUaGUgYmFkSW5wdXQgcHJvcGVydHkgaXMgbm90IHN1cHBvcnRlZCBpbiBJRSAxMSDwn5KpLlxuICAgICAgICByZXR1cm4gdGhpcy5nZXROYXRpdmVJbnB1dF8oKS52YWxpZGl0eS5iYWRJbnB1dCB8fCBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEByZXR1cm4gVGhlIHJlc3VsdCBvZiBuYXRpdmUgdmFsaWRpdHkgY2hlY2tpbmcgKFZhbGlkaXR5U3RhdGUudmFsaWQpLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLmlzTmF0aXZlSW5wdXRWYWxpZF8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE5hdGl2ZUlucHV0XygpLnZhbGlkaXR5LnZhbGlkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU3R5bGVzIHRoZSBjb21wb25lbnQgYmFzZWQgb24gdGhlIHZhbGlkaXR5IHN0YXRlLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLnN0eWxlVmFsaWRpdHlfID0gZnVuY3Rpb24gKGlzVmFsaWQpIHtcbiAgICAgICAgdmFyIElOVkFMSUQgPSBNRENUZXh0RmllbGRGb3VuZGF0aW9uLmNzc0NsYXNzZXMuSU5WQUxJRDtcbiAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoSU5WQUxJRCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLmFkZENsYXNzKElOVkFMSUQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhlbHBlclRleHRfKSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBlclRleHRfLnNldFZhbGlkaXR5KGlzVmFsaWQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTdHlsZXMgdGhlIGNvbXBvbmVudCBiYXNlZCBvbiB0aGUgZm9jdXNlZCBzdGF0ZS5cbiAgICAgKi9cbiAgICBNRENUZXh0RmllbGRGb3VuZGF0aW9uLnByb3RvdHlwZS5zdHlsZUZvY3VzZWRfID0gZnVuY3Rpb24gKGlzRm9jdXNlZCkge1xuICAgICAgICB2YXIgRk9DVVNFRCA9IE1EQ1RleHRGaWVsZEZvdW5kYXRpb24uY3NzQ2xhc3Nlcy5GT0NVU0VEO1xuICAgICAgICBpZiAoaXNGb2N1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLmFkZENsYXNzKEZPQ1VTRUQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5yZW1vdmVDbGFzcyhGT0NVU0VEKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogU3R5bGVzIHRoZSBjb21wb25lbnQgYmFzZWQgb24gdGhlIGRpc2FibGVkIHN0YXRlLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLnN0eWxlRGlzYWJsZWRfID0gZnVuY3Rpb24gKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgdmFyIF9hID0gTURDVGV4dEZpZWxkRm91bmRhdGlvbi5jc3NDbGFzc2VzLCBESVNBQkxFRCA9IF9hLkRJU0FCTEVELCBJTlZBTElEID0gX2EuSU5WQUxJRDtcbiAgICAgICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoRElTQUJMRUQpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5yZW1vdmVDbGFzcyhJTlZBTElEKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoRElTQUJMRUQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxlYWRpbmdJY29uXykge1xuICAgICAgICAgICAgdGhpcy5sZWFkaW5nSWNvbl8uc2V0RGlzYWJsZWQoaXNEaXNhYmxlZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudHJhaWxpbmdJY29uXykge1xuICAgICAgICAgICAgdGhpcy50cmFpbGluZ0ljb25fLnNldERpc2FibGVkKGlzRGlzYWJsZWQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTdHlsZXMgdGhlIGNvbXBvbmVudCBiYXNlZCBvbiB0aGUgbGFiZWwgZmxvYXRpbmcgc3RhdGUuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkRm91bmRhdGlvbi5wcm90b3R5cGUuc3R5bGVGbG9hdGluZ18gPSBmdW5jdGlvbiAoaXNGbG9hdGluZykge1xuICAgICAgICB2YXIgTEFCRUxfRkxPQVRJTkcgPSBNRENUZXh0RmllbGRGb3VuZGF0aW9uLmNzc0NsYXNzZXMuTEFCRUxfRkxPQVRJTkc7XG4gICAgICAgIGlmIChpc0Zsb2F0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLmFkZENsYXNzKExBQkVMX0ZMT0FUSU5HKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoTEFCRUxfRkxPQVRJTkcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIFRoZSBuYXRpdmUgdGV4dCBpbnB1dCBlbGVtZW50IGZyb20gdGhlIGhvc3QgZW52aXJvbm1lbnQsIG9yIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNoYXBlIGZvciB1bml0IHRlc3RzLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEZvdW5kYXRpb24ucHJvdG90eXBlLmdldE5hdGl2ZUlucHV0XyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcy5hZGFwdGVyXyBtYXkgYmUgdW5kZWZpbmVkIGluIGZvdW5kYXRpb24gdW5pdCB0ZXN0cy4gVGhpcyBoYXBwZW5zIHdoZW4gdGVzdGRvdWJsZSBpcyBjcmVhdGluZyBhIG1vY2sgb2JqZWN0XG4gICAgICAgIC8vIGFuZCBpbnZva2VzIHRoZSBzaG91bGRTaGFrZS9zaG91bGRGbG9hdCBnZXR0ZXJzICh3aGljaCBpbiB0dXJuIGNhbGwgZ2V0VmFsdWUoKSwgd2hpY2ggY2FsbHMgdGhpcyBtZXRob2QpIGJlZm9yZVxuICAgICAgICAvLyBpbml0KCkgaGFzIGJlZW4gY2FsbGVkIGZyb20gdGhlIE1EQ1RleHRGaWVsZCBjb25zdHJ1Y3Rvci4gVG8gd29yayBhcm91bmQgdGhhdCBpc3N1ZSwgd2UgcmV0dXJuIGEgZHVtbXkgb2JqZWN0LlxuICAgICAgICB2YXIgbmF0aXZlSW5wdXQgPSB0aGlzLmFkYXB0ZXJfID8gdGhpcy5hZGFwdGVyXy5nZXROYXRpdmVJbnB1dCgpIDogbnVsbDtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZUlucHV0IHx8IHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG1heExlbmd0aDogLTEsXG4gICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICAgICAgdmFsaWRpdHk6IHtcbiAgICAgICAgICAgICAgICBiYWRJbnB1dDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmFsaWQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIE1EQ1RleHRGaWVsZEZvdW5kYXRpb247XG59KE1EQ0ZvdW5kYXRpb24pKTtcbmV4cG9ydCB7IE1EQ1RleHRGaWVsZEZvdW5kYXRpb24gfTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1kZWZhdWx0LWV4cG9ydCBOZWVkZWQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBNREMgV2ViIHYwLjQ0LjAgYW5kIGVhcmxpZXIuXG5leHBvcnQgZGVmYXVsdCBNRENUZXh0RmllbGRGb3VuZGF0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm91bmRhdGlvbi5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbnZhciBjc3NDbGFzc2VzID0ge1xuICAgIEhFTFBFUl9URVhUX1BFUlNJU1RFTlQ6ICdtZGMtdGV4dC1maWVsZC1oZWxwZXItdGV4dC0tcGVyc2lzdGVudCcsXG4gICAgSEVMUEVSX1RFWFRfVkFMSURBVElPTl9NU0c6ICdtZGMtdGV4dC1maWVsZC1oZWxwZXItdGV4dC0tdmFsaWRhdGlvbi1tc2cnLFxuICAgIFJPT1Q6ICdtZGMtdGV4dC1maWVsZC1oZWxwZXItdGV4dCcsXG59O1xudmFyIHN0cmluZ3MgPSB7XG4gICAgQVJJQV9ISURERU46ICdhcmlhLWhpZGRlbicsXG4gICAgUk9MRTogJ3JvbGUnLFxuICAgIFJPT1RfU0VMRUNUT1I6IFwiLlwiICsgY3NzQ2xhc3Nlcy5ST09ULFxufTtcbmV4cG9ydCB7IHN0cmluZ3MsIGNzc0NsYXNzZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnN0YW50cy5qcy5tYXAiLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbmltcG9ydCB7IF9fYXNzaWduLCBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE1EQ0ZvdW5kYXRpb24gfSBmcm9tICdAbWF0ZXJpYWwvYmFzZS9mb3VuZGF0aW9uJztcbmltcG9ydCB7IGNzc0NsYXNzZXMsIHN0cmluZ3MgfSBmcm9tICcuL2NvbnN0YW50cyc7XG52YXIgTURDVGV4dEZpZWxkSGVscGVyVGV4dEZvdW5kYXRpb24gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1EQ1RleHRGaWVsZEhlbHBlclRleHRGb3VuZGF0aW9uLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1EQ1RleHRGaWVsZEhlbHBlclRleHRGb3VuZGF0aW9uKGFkYXB0ZXIpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBNRENUZXh0RmllbGRIZWxwZXJUZXh0Rm91bmRhdGlvbi5kZWZhdWx0QWRhcHRlciksIGFkYXB0ZXIpKSB8fCB0aGlzO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkSGVscGVyVGV4dEZvdW5kYXRpb24sIFwiY3NzQ2xhc3Nlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNzc0NsYXNzZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGRIZWxwZXJUZXh0Rm91bmRhdGlvbiwgXCJzdHJpbmdzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5ncztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZEhlbHBlclRleHRGb3VuZGF0aW9uLCBcImRlZmF1bHRBZGFwdGVyXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlZSB7QGxpbmsgTURDVGV4dEZpZWxkSGVscGVyVGV4dEFkYXB0ZXJ9IGZvciB0eXBpbmcgaW5mb3JtYXRpb24gb24gcGFyYW1ldGVycyBhbmQgcmV0dXJuIHR5cGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXMgTWV0aG9kcyBzaG91bGQgYmUgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIGFkYXB0ZXIgaW50ZXJmYWNlLlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgaGFzQ2xhc3M6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuICAgICAgICAgICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICByZW1vdmVBdHRyOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgc2V0Q29udGVudDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIHRzbGludDplbmFibGU6b2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGhlbHBlciB0ZXh0IGZpZWxkLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEhlbHBlclRleHRGb3VuZGF0aW9uLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5hZGFwdGVyXy5zZXRDb250ZW50KGNvbnRlbnQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlzUGVyc2lzdGVudCBTZXRzIHRoZSBwZXJzaXN0ZW5jeSBvZiB0aGUgaGVscGVyIHRleHQuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkSGVscGVyVGV4dEZvdW5kYXRpb24ucHJvdG90eXBlLnNldFBlcnNpc3RlbnQgPSBmdW5jdGlvbiAoaXNQZXJzaXN0ZW50KSB7XG4gICAgICAgIGlmIChpc1BlcnNpc3RlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoY3NzQ2xhc3Nlcy5IRUxQRVJfVEVYVF9QRVJTSVNURU5UKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQ2xhc3MoY3NzQ2xhc3Nlcy5IRUxQRVJfVEVYVF9QRVJTSVNURU5UKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlzVmFsaWRhdGlvbiBUcnVlIHRvIG1ha2UgdGhlIGhlbHBlciB0ZXh0IGFjdCBhcyBhbiBlcnJvciB2YWxpZGF0aW9uIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkSGVscGVyVGV4dEZvdW5kYXRpb24ucHJvdG90eXBlLnNldFZhbGlkYXRpb24gPSBmdW5jdGlvbiAoaXNWYWxpZGF0aW9uKSB7XG4gICAgICAgIGlmIChpc1ZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uYWRkQ2xhc3MoY3NzQ2xhc3Nlcy5IRUxQRVJfVEVYVF9WQUxJREFUSU9OX01TRyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZUNsYXNzKGNzc0NsYXNzZXMuSEVMUEVSX1RFWFRfVkFMSURBVElPTl9NU0cpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNYWtlcyB0aGUgaGVscGVyIHRleHQgdmlzaWJsZSB0byB0aGUgc2NyZWVuIHJlYWRlci5cbiAgICAgKi9cbiAgICBNRENUZXh0RmllbGRIZWxwZXJUZXh0Rm91bmRhdGlvbi5wcm90b3R5cGUuc2hvd1RvU2NyZWVuUmVhZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZUF0dHIoc3RyaW5ncy5BUklBX0hJRERFTik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWxpZGl0eSBvZiB0aGUgaGVscGVyIHRleHQgYmFzZWQgb24gdGhlIGlucHV0IHZhbGlkaXR5LlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZEhlbHBlclRleHRGb3VuZGF0aW9uLnByb3RvdHlwZS5zZXRWYWxpZGl0eSA9IGZ1bmN0aW9uIChpbnB1dElzVmFsaWQpIHtcbiAgICAgICAgdmFyIGhlbHBlclRleHRJc1BlcnNpc3RlbnQgPSB0aGlzLmFkYXB0ZXJfLmhhc0NsYXNzKGNzc0NsYXNzZXMuSEVMUEVSX1RFWFRfUEVSU0lTVEVOVCk7XG4gICAgICAgIHZhciBoZWxwZXJUZXh0SXNWYWxpZGF0aW9uTXNnID0gdGhpcy5hZGFwdGVyXy5oYXNDbGFzcyhjc3NDbGFzc2VzLkhFTFBFUl9URVhUX1ZBTElEQVRJT05fTVNHKTtcbiAgICAgICAgdmFyIHZhbGlkYXRpb25Nc2dOZWVkc0Rpc3BsYXkgPSBoZWxwZXJUZXh0SXNWYWxpZGF0aW9uTXNnICYmICFpbnB1dElzVmFsaWQ7XG4gICAgICAgIGlmICh2YWxpZGF0aW9uTXNnTmVlZHNEaXNwbGF5KSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnNldEF0dHIoc3RyaW5ncy5ST0xFLCAnYWxlcnQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8ucmVtb3ZlQXR0cihzdHJpbmdzLlJPTEUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGVscGVyVGV4dElzUGVyc2lzdGVudCAmJiAhdmFsaWRhdGlvbk1zZ05lZWRzRGlzcGxheSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlXygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIaWRlcyB0aGUgaGVscCB0ZXh0IGZyb20gc2NyZWVuIHJlYWRlcnMuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkSGVscGVyVGV4dEZvdW5kYXRpb24ucHJvdG90eXBlLmhpZGVfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnNldEF0dHIoc3RyaW5ncy5BUklBX0hJRERFTiwgJ3RydWUnKTtcbiAgICB9O1xuICAgIHJldHVybiBNRENUZXh0RmllbGRIZWxwZXJUZXh0Rm91bmRhdGlvbjtcbn0oTURDRm91bmRhdGlvbikpO1xuZXhwb3J0IHsgTURDVGV4dEZpZWxkSGVscGVyVGV4dEZvdW5kYXRpb24gfTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1kZWZhdWx0LWV4cG9ydCBOZWVkZWQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBNREMgV2ViIHYwLjQ0LjAgYW5kIGVhcmxpZXIuXG5leHBvcnQgZGVmYXVsdCBNRENUZXh0RmllbGRIZWxwZXJUZXh0Rm91bmRhdGlvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvdW5kYXRpb24uanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5pbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE1EQ0NvbXBvbmVudCB9IGZyb20gJ0BtYXRlcmlhbC9iYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBNRENUZXh0RmllbGRIZWxwZXJUZXh0Rm91bmRhdGlvbiB9IGZyb20gJy4vZm91bmRhdGlvbic7XG52YXIgTURDVGV4dEZpZWxkSGVscGVyVGV4dCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTURDVGV4dEZpZWxkSGVscGVyVGV4dCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNRENUZXh0RmllbGRIZWxwZXJUZXh0KCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIE1EQ1RleHRGaWVsZEhlbHBlclRleHQuYXR0YWNoVG8gPSBmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICByZXR1cm4gbmV3IE1EQ1RleHRGaWVsZEhlbHBlclRleHQocm9vdCk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkSGVscGVyVGV4dC5wcm90b3R5cGUsIFwiZm91bmRhdGlvblwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm91bmRhdGlvbl87XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE1EQ1RleHRGaWVsZEhlbHBlclRleHQucHJvdG90eXBlLmdldERlZmF1bHRGb3VuZGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBETyBOT1QgSU5MSU5FIHRoaXMgdmFyaWFibGUuIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBmb3VuZGF0aW9ucyB0YWtlIGEgUGFydGlhbDxNRENGb29BZGFwdGVyPi5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHdlIGRvbid0IGFjY2lkZW50YWxseSBvbWl0IGFueSBtZXRob2RzLCB3ZSBuZWVkIGEgc2VwYXJhdGUsIHN0cm9uZ2x5IHR5cGVkIGFkYXB0ZXIgdmFyaWFibGUuXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5cyBNZXRob2RzIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgYWRhcHRlciBpbnRlcmZhY2UuXG4gICAgICAgIHZhciBhZGFwdGVyID0ge1xuICAgICAgICAgICAgYWRkQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIF90aGlzLnJvb3RfLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTsgfSxcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7IHJldHVybiBfdGhpcy5yb290Xy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7IH0sXG4gICAgICAgICAgICBoYXNDbGFzczogZnVuY3Rpb24gKGNsYXNzTmFtZSkgeyByZXR1cm4gX3RoaXMucm9vdF8uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7IH0sXG4gICAgICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbiAoYXR0ciwgdmFsdWUpIHsgcmV0dXJuIF90aGlzLnJvb3RfLnNldEF0dHJpYnV0ZShhdHRyLCB2YWx1ZSk7IH0sXG4gICAgICAgICAgICByZW1vdmVBdHRyOiBmdW5jdGlvbiAoYXR0cikgeyByZXR1cm4gX3RoaXMucm9vdF8ucmVtb3ZlQXR0cmlidXRlKGF0dHIpOyB9LFxuICAgICAgICAgICAgc2V0Q29udGVudDogZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb290Xy50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5c1xuICAgICAgICByZXR1cm4gbmV3IE1EQ1RleHRGaWVsZEhlbHBlclRleHRGb3VuZGF0aW9uKGFkYXB0ZXIpO1xuICAgIH07XG4gICAgcmV0dXJuIE1EQ1RleHRGaWVsZEhlbHBlclRleHQ7XG59KE1EQ0NvbXBvbmVudCkpO1xuZXhwb3J0IHsgTURDVGV4dEZpZWxkSGVscGVyVGV4dCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcG9uZW50LmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xudmFyIHN0cmluZ3MgPSB7XG4gICAgSUNPTl9FVkVOVDogJ01EQ1RleHRGaWVsZDppY29uJyxcbiAgICBJQ09OX1JPTEU6ICdidXR0b24nLFxufTtcbnZhciBjc3NDbGFzc2VzID0ge1xuICAgIFJPT1Q6ICdtZGMtdGV4dC1maWVsZF9faWNvbicsXG59O1xuZXhwb3J0IHsgc3RyaW5ncywgY3NzQ2xhc3NlcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uc3RhbnRzLmpzLm1hcCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuaW1wb3J0IHsgX19hc3NpZ24sIF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgTURDRm91bmRhdGlvbiB9IGZyb20gJ0BtYXRlcmlhbC9iYXNlL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgY3NzQ2xhc3Nlcywgc3RyaW5ncyB9IGZyb20gJy4vY29uc3RhbnRzJztcbnZhciBJTlRFUkFDVElPTl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXTtcbnZhciBNRENUZXh0RmllbGRJY29uRm91bmRhdGlvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTURDVGV4dEZpZWxkSWNvbkZvdW5kYXRpb24sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTURDVGV4dEZpZWxkSWNvbkZvdW5kYXRpb24oYWRhcHRlcikge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgTURDVGV4dEZpZWxkSWNvbkZvdW5kYXRpb24uZGVmYXVsdEFkYXB0ZXIpLCBhZGFwdGVyKSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuc2F2ZWRUYWJJbmRleF8gPSBudWxsO1xuICAgICAgICBfdGhpcy5pbnRlcmFjdGlvbkhhbmRsZXJfID0gZnVuY3Rpb24gKGV2dCkgeyByZXR1cm4gX3RoaXMuaGFuZGxlSW50ZXJhY3Rpb24oZXZ0KTsgfTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkSWNvbkZvdW5kYXRpb24sIFwic3RyaW5nc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ3M7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGRJY29uRm91bmRhdGlvbiwgXCJjc3NDbGFzc2VzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3NzQ2xhc3NlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZEljb25Gb3VuZGF0aW9uLCBcImRlZmF1bHRBZGFwdGVyXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlZSB7QGxpbmsgTURDVGV4dEZpZWxkSWNvbkFkYXB0ZXJ9IGZvciB0eXBpbmcgaW5mb3JtYXRpb24gb24gcGFyYW1ldGVycyBhbmQgcmV0dXJuIHR5cGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXMgTWV0aG9kcyBzaG91bGQgYmUgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIGFkYXB0ZXIgaW50ZXJmYWNlLlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRBdHRyOiBmdW5jdGlvbiAoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICAgICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgICAgICByZW1vdmVBdHRyOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgc2V0Q29udGVudDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIHJlZ2lzdGVySW50ZXJhY3Rpb25IYW5kbGVyOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICAgICAgZGVyZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgICAgICAgICAgICAgIG5vdGlmeUljb25BY3Rpb246IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5c1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBNRENUZXh0RmllbGRJY29uRm91bmRhdGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5zYXZlZFRhYkluZGV4XyA9IHRoaXMuYWRhcHRlcl8uZ2V0QXR0cigndGFiaW5kZXgnKTtcbiAgICAgICAgSU5URVJBQ1RJT05fRVZFTlRTLmZvckVhY2goZnVuY3Rpb24gKGV2dFR5cGUpIHtcbiAgICAgICAgICAgIF90aGlzLmFkYXB0ZXJfLnJlZ2lzdGVySW50ZXJhY3Rpb25IYW5kbGVyKGV2dFR5cGUsIF90aGlzLmludGVyYWN0aW9uSGFuZGxlcl8pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE1EQ1RleHRGaWVsZEljb25Gb3VuZGF0aW9uLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBJTlRFUkFDVElPTl9FVkVOVFMuZm9yRWFjaChmdW5jdGlvbiAoZXZ0VHlwZSkge1xuICAgICAgICAgICAgX3RoaXMuYWRhcHRlcl8uZGVyZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcihldnRUeXBlLCBfdGhpcy5pbnRlcmFjdGlvbkhhbmRsZXJfKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBNRENUZXh0RmllbGRJY29uRm91bmRhdGlvbi5wcm90b3R5cGUuc2V0RGlzYWJsZWQgPSBmdW5jdGlvbiAoZGlzYWJsZWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNhdmVkVGFiSW5kZXhfKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnNldEF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJfLnJlbW92ZUF0dHIoJ3JvbGUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uc2V0QXR0cigndGFiaW5kZXgnLCB0aGlzLnNhdmVkVGFiSW5kZXhfKTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlcl8uc2V0QXR0cigncm9sZScsIHN0cmluZ3MuSUNPTl9ST0xFKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTURDVGV4dEZpZWxkSWNvbkZvdW5kYXRpb24ucHJvdG90eXBlLnNldEFyaWFMYWJlbCA9IGZ1bmN0aW9uIChsYWJlbCkge1xuICAgICAgICB0aGlzLmFkYXB0ZXJfLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCBsYWJlbCk7XG4gICAgfTtcbiAgICBNRENUZXh0RmllbGRJY29uRm91bmRhdGlvbi5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gICAgICAgIHRoaXMuYWRhcHRlcl8uc2V0Q29udGVudChjb250ZW50KTtcbiAgICB9O1xuICAgIE1EQ1RleHRGaWVsZEljb25Gb3VuZGF0aW9uLnByb3RvdHlwZS5oYW5kbGVJbnRlcmFjdGlvbiA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgdmFyIGlzRW50ZXJLZXkgPSBldnQua2V5ID09PSAnRW50ZXInIHx8IGV2dC5rZXlDb2RlID09PSAxMztcbiAgICAgICAgaWYgKGV2dC50eXBlID09PSAnY2xpY2snIHx8IGlzRW50ZXJLZXkpIHtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBzdG9wIGNsaWNrIGZyb20gY2F1c2luZyBob3N0IGxhYmVsIHRvIGZvY3VzXG4gICAgICAgICAgICAvLyBpbnB1dFxuICAgICAgICAgICAgdGhpcy5hZGFwdGVyXy5ub3RpZnlJY29uQWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBNRENUZXh0RmllbGRJY29uRm91bmRhdGlvbjtcbn0oTURDRm91bmRhdGlvbikpO1xuZXhwb3J0IHsgTURDVGV4dEZpZWxkSWNvbkZvdW5kYXRpb24gfTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1kZWZhdWx0LWV4cG9ydCBOZWVkZWQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBNREMgV2ViIHYwLjQ0LjAgYW5kIGVhcmxpZXIuXG5leHBvcnQgZGVmYXVsdCBNRENUZXh0RmllbGRJY29uRm91bmRhdGlvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvdW5kYXRpb24uanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5pbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE1EQ0NvbXBvbmVudCB9IGZyb20gJ0BtYXRlcmlhbC9iYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBNRENUZXh0RmllbGRJY29uRm91bmRhdGlvbiB9IGZyb20gJy4vZm91bmRhdGlvbic7XG52YXIgTURDVGV4dEZpZWxkSWNvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTURDVGV4dEZpZWxkSWNvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNRENUZXh0RmllbGRJY29uKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIE1EQ1RleHRGaWVsZEljb24uYXR0YWNoVG8gPSBmdW5jdGlvbiAocm9vdCkge1xuICAgICAgICByZXR1cm4gbmV3IE1EQ1RleHRGaWVsZEljb24ocm9vdCk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkSWNvbi5wcm90b3R5cGUsIFwiZm91bmRhdGlvblwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm91bmRhdGlvbl87XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE1EQ1RleHRGaWVsZEljb24ucHJvdG90eXBlLmdldERlZmF1bHRGb3VuZGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBETyBOT1QgSU5MSU5FIHRoaXMgdmFyaWFibGUuIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBmb3VuZGF0aW9ucyB0YWtlIGEgUGFydGlhbDxNRENGb29BZGFwdGVyPi5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHdlIGRvbid0IGFjY2lkZW50YWxseSBvbWl0IGFueSBtZXRob2RzLCB3ZSBuZWVkIGEgc2VwYXJhdGUsIHN0cm9uZ2x5IHR5cGVkIGFkYXB0ZXIgdmFyaWFibGUuXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5cyBNZXRob2RzIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgYWRhcHRlciBpbnRlcmZhY2UuXG4gICAgICAgIHZhciBhZGFwdGVyID0ge1xuICAgICAgICAgICAgZ2V0QXR0cjogZnVuY3Rpb24gKGF0dHIpIHsgcmV0dXJuIF90aGlzLnJvb3RfLmdldEF0dHJpYnV0ZShhdHRyKTsgfSxcbiAgICAgICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChhdHRyLCB2YWx1ZSkgeyByZXR1cm4gX3RoaXMucm9vdF8uc2V0QXR0cmlidXRlKGF0dHIsIHZhbHVlKTsgfSxcbiAgICAgICAgICAgIHJlbW92ZUF0dHI6IGZ1bmN0aW9uIChhdHRyKSB7IHJldHVybiBfdGhpcy5yb290Xy5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7IH0sXG4gICAgICAgICAgICBzZXRDb250ZW50OiBmdW5jdGlvbiAoY29udGVudCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnJvb3RfLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWdpc3RlckludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKGV2dFR5cGUsIGhhbmRsZXIpIHsgcmV0dXJuIF90aGlzLmxpc3RlbihldnRUeXBlLCBoYW5kbGVyKTsgfSxcbiAgICAgICAgICAgIGRlcmVnaXN0ZXJJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uIChldnRUeXBlLCBoYW5kbGVyKSB7IHJldHVybiBfdGhpcy51bmxpc3RlbihldnRUeXBlLCBoYW5kbGVyKTsgfSxcbiAgICAgICAgICAgIG5vdGlmeUljb25BY3Rpb246IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmVtaXQoTURDVGV4dEZpZWxkSWNvbkZvdW5kYXRpb24uc3RyaW5ncy5JQ09OX0VWRU5ULCB7fSAvKiBldnREYXRhICovLCB0cnVlIC8qIHNob3VsZEJ1YmJsZSAqLyk7IH0sXG4gICAgICAgIH07XG4gICAgICAgIC8vIHRzbGludDplbmFibGU6b2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgIHJldHVybiBuZXcgTURDVGV4dEZpZWxkSWNvbkZvdW5kYXRpb24oYWRhcHRlcik7XG4gICAgfTtcbiAgICByZXR1cm4gTURDVGV4dEZpZWxkSWNvbjtcbn0oTURDQ29tcG9uZW50KSk7XG5leHBvcnQgeyBNRENUZXh0RmllbGRJY29uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wb25lbnQuanMubWFwIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5pbXBvcnQgeyBfX2Fzc2lnbiwgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBNRENDb21wb25lbnQgfSBmcm9tICdAbWF0ZXJpYWwvYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgYXBwbHlQYXNzaXZlIH0gZnJvbSAnQG1hdGVyaWFsL2RvbS9ldmVudHMnO1xuaW1wb3J0ICogYXMgcG9ueWZpbGwgZnJvbSAnQG1hdGVyaWFsL2RvbS9wb255ZmlsbCc7XG5pbXBvcnQgeyBNRENGbG9hdGluZ0xhYmVsIH0gZnJvbSAnQG1hdGVyaWFsL2Zsb2F0aW5nLWxhYmVsL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBNRENMaW5lUmlwcGxlIH0gZnJvbSAnQG1hdGVyaWFsL2xpbmUtcmlwcGxlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBNRENOb3RjaGVkT3V0bGluZSB9IGZyb20gJ0BtYXRlcmlhbC9ub3RjaGVkLW91dGxpbmUvY29tcG9uZW50JztcbmltcG9ydCB7IE1EQ1JpcHBsZSB9IGZyb20gJ0BtYXRlcmlhbC9yaXBwbGUvY29tcG9uZW50JztcbmltcG9ydCB7IE1EQ1JpcHBsZUZvdW5kYXRpb24gfSBmcm9tICdAbWF0ZXJpYWwvcmlwcGxlL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlciwgfSBmcm9tICcuL2NoYXJhY3Rlci1jb3VudGVyL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyRm91bmRhdGlvbiB9IGZyb20gJy4vY2hhcmFjdGVyLWNvdW50ZXIvZm91bmRhdGlvbic7XG5pbXBvcnQgeyBjc3NDbGFzc2VzLCBzdHJpbmdzIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgTURDVGV4dEZpZWxkRm91bmRhdGlvbiB9IGZyb20gJy4vZm91bmRhdGlvbic7XG5pbXBvcnQgeyBNRENUZXh0RmllbGRIZWxwZXJUZXh0LCB9IGZyb20gJy4vaGVscGVyLXRleHQvY29tcG9uZW50JztcbmltcG9ydCB7IE1EQ1RleHRGaWVsZEhlbHBlclRleHRGb3VuZGF0aW9uIH0gZnJvbSAnLi9oZWxwZXItdGV4dC9mb3VuZGF0aW9uJztcbmltcG9ydCB7IE1EQ1RleHRGaWVsZEljb24gfSBmcm9tICcuL2ljb24vY29tcG9uZW50JztcbnZhciBNRENUZXh0RmllbGQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1EQ1RleHRGaWVsZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNRENUZXh0RmllbGQoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgTURDVGV4dEZpZWxkLmF0dGFjaFRvID0gZnVuY3Rpb24gKHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNRENUZXh0RmllbGQocm9vdCk7XG4gICAgfTtcbiAgICBNRENUZXh0RmllbGQucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAocmlwcGxlRmFjdG9yeSwgbGluZVJpcHBsZUZhY3RvcnksIGhlbHBlclRleHRGYWN0b3J5LCBjaGFyYWN0ZXJDb3VudGVyRmFjdG9yeSwgaWNvbkZhY3RvcnksIGxhYmVsRmFjdG9yeSwgb3V0bGluZUZhY3RvcnkpIHtcbiAgICAgICAgaWYgKHJpcHBsZUZhY3RvcnkgPT09IHZvaWQgMCkgeyByaXBwbGVGYWN0b3J5ID0gZnVuY3Rpb24gKGVsLCBmb3VuZGF0aW9uKSB7IHJldHVybiBuZXcgTURDUmlwcGxlKGVsLCBmb3VuZGF0aW9uKTsgfTsgfVxuICAgICAgICBpZiAobGluZVJpcHBsZUZhY3RvcnkgPT09IHZvaWQgMCkgeyBsaW5lUmlwcGxlRmFjdG9yeSA9IGZ1bmN0aW9uIChlbCkgeyByZXR1cm4gbmV3IE1EQ0xpbmVSaXBwbGUoZWwpOyB9OyB9XG4gICAgICAgIGlmIChoZWxwZXJUZXh0RmFjdG9yeSA9PT0gdm9pZCAwKSB7IGhlbHBlclRleHRGYWN0b3J5ID0gZnVuY3Rpb24gKGVsKSB7IHJldHVybiBuZXcgTURDVGV4dEZpZWxkSGVscGVyVGV4dChlbCk7IH07IH1cbiAgICAgICAgaWYgKGNoYXJhY3RlckNvdW50ZXJGYWN0b3J5ID09PSB2b2lkIDApIHsgY2hhcmFjdGVyQ291bnRlckZhY3RvcnkgPSBmdW5jdGlvbiAoZWwpIHsgcmV0dXJuIG5ldyBNRENUZXh0RmllbGRDaGFyYWN0ZXJDb3VudGVyKGVsKTsgfTsgfVxuICAgICAgICBpZiAoaWNvbkZhY3RvcnkgPT09IHZvaWQgMCkgeyBpY29uRmFjdG9yeSA9IGZ1bmN0aW9uIChlbCkgeyByZXR1cm4gbmV3IE1EQ1RleHRGaWVsZEljb24oZWwpOyB9OyB9XG4gICAgICAgIGlmIChsYWJlbEZhY3RvcnkgPT09IHZvaWQgMCkgeyBsYWJlbEZhY3RvcnkgPSBmdW5jdGlvbiAoZWwpIHsgcmV0dXJuIG5ldyBNRENGbG9hdGluZ0xhYmVsKGVsKTsgfTsgfVxuICAgICAgICBpZiAob3V0bGluZUZhY3RvcnkgPT09IHZvaWQgMCkgeyBvdXRsaW5lRmFjdG9yeSA9IGZ1bmN0aW9uIChlbCkgeyByZXR1cm4gbmV3IE1EQ05vdGNoZWRPdXRsaW5lKGVsKTsgfTsgfVxuICAgICAgICB0aGlzLmlucHV0XyA9IHRoaXMucm9vdF8ucXVlcnlTZWxlY3RvcihzdHJpbmdzLklOUFVUX1NFTEVDVE9SKTtcbiAgICAgICAgdmFyIGxhYmVsRWxlbWVudCA9IHRoaXMucm9vdF8ucXVlcnlTZWxlY3RvcihzdHJpbmdzLkxBQkVMX1NFTEVDVE9SKTtcbiAgICAgICAgdGhpcy5sYWJlbF8gPSBsYWJlbEVsZW1lbnQgPyBsYWJlbEZhY3RvcnkobGFiZWxFbGVtZW50KSA6IG51bGw7XG4gICAgICAgIHZhciBsaW5lUmlwcGxlRWxlbWVudCA9IHRoaXMucm9vdF8ucXVlcnlTZWxlY3RvcihzdHJpbmdzLkxJTkVfUklQUExFX1NFTEVDVE9SKTtcbiAgICAgICAgdGhpcy5saW5lUmlwcGxlXyA9IGxpbmVSaXBwbGVFbGVtZW50ID8gbGluZVJpcHBsZUZhY3RvcnkobGluZVJpcHBsZUVsZW1lbnQpIDogbnVsbDtcbiAgICAgICAgdmFyIG91dGxpbmVFbGVtZW50ID0gdGhpcy5yb290Xy5xdWVyeVNlbGVjdG9yKHN0cmluZ3MuT1VUTElORV9TRUxFQ1RPUik7XG4gICAgICAgIHRoaXMub3V0bGluZV8gPSBvdXRsaW5lRWxlbWVudCA/IG91dGxpbmVGYWN0b3J5KG91dGxpbmVFbGVtZW50KSA6IG51bGw7XG4gICAgICAgIC8vIEhlbHBlciB0ZXh0XG4gICAgICAgIHZhciBoZWxwZXJUZXh0U3RyaW5ncyA9IE1EQ1RleHRGaWVsZEhlbHBlclRleHRGb3VuZGF0aW9uLnN0cmluZ3M7XG4gICAgICAgIHZhciBuZXh0RWxlbWVudFNpYmxpbmcgPSB0aGlzLnJvb3RfLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgdmFyIGhhc0hlbHBlckxpbmUgPSAobmV4dEVsZW1lbnRTaWJsaW5nICYmIG5leHRFbGVtZW50U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoY3NzQ2xhc3Nlcy5IRUxQRVJfTElORSkpO1xuICAgICAgICB2YXIgaGVscGVyVGV4dEVsID0gaGFzSGVscGVyTGluZSAmJiBuZXh0RWxlbWVudFNpYmxpbmcgJiYgbmV4dEVsZW1lbnRTaWJsaW5nLnF1ZXJ5U2VsZWN0b3IoaGVscGVyVGV4dFN0cmluZ3MuUk9PVF9TRUxFQ1RPUik7XG4gICAgICAgIHRoaXMuaGVscGVyVGV4dF8gPSBoZWxwZXJUZXh0RWwgPyBoZWxwZXJUZXh0RmFjdG9yeShoZWxwZXJUZXh0RWwpIDogbnVsbDtcbiAgICAgICAgLy8gQ2hhcmFjdGVyIGNvdW50ZXJcbiAgICAgICAgdmFyIGNoYXJhY3RlckNvdW50ZXJTdHJpbmdzID0gTURDVGV4dEZpZWxkQ2hhcmFjdGVyQ291bnRlckZvdW5kYXRpb24uc3RyaW5ncztcbiAgICAgICAgdmFyIGNoYXJhY3RlckNvdW50ZXJFbCA9IHRoaXMucm9vdF8ucXVlcnlTZWxlY3RvcihjaGFyYWN0ZXJDb3VudGVyU3RyaW5ncy5ST09UX1NFTEVDVE9SKTtcbiAgICAgICAgLy8gSWYgY2hhcmFjdGVyIGNvdW50ZXIgaXMgbm90IGZvdW5kIGluIHJvb3QgZWxlbWVudCBzZWFyY2ggaW4gc2libGluZyBlbGVtZW50LlxuICAgICAgICBpZiAoIWNoYXJhY3RlckNvdW50ZXJFbCAmJiBoYXNIZWxwZXJMaW5lICYmIG5leHRFbGVtZW50U2libGluZykge1xuICAgICAgICAgICAgY2hhcmFjdGVyQ291bnRlckVsID0gbmV4dEVsZW1lbnRTaWJsaW5nLnF1ZXJ5U2VsZWN0b3IoY2hhcmFjdGVyQ291bnRlclN0cmluZ3MuUk9PVF9TRUxFQ1RPUik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJDb3VudGVyXyA9IGNoYXJhY3RlckNvdW50ZXJFbCA/IGNoYXJhY3RlckNvdW50ZXJGYWN0b3J5KGNoYXJhY3RlckNvdW50ZXJFbCkgOiBudWxsO1xuICAgICAgICAvLyBMZWFkaW5nIGljb25cbiAgICAgICAgdmFyIGxlYWRpbmdJY29uRWwgPSB0aGlzLnJvb3RfLnF1ZXJ5U2VsZWN0b3Ioc3RyaW5ncy5MRUFESU5HX0lDT05fU0VMRUNUT1IpO1xuICAgICAgICB0aGlzLmxlYWRpbmdJY29uXyA9IGxlYWRpbmdJY29uRWwgPyBpY29uRmFjdG9yeShsZWFkaW5nSWNvbkVsKSA6IG51bGw7XG4gICAgICAgIC8vIFRyYWlsaW5nIGljb25cbiAgICAgICAgdmFyIHRyYWlsaW5nSWNvbkVsID0gdGhpcy5yb290Xy5xdWVyeVNlbGVjdG9yKHN0cmluZ3MuVFJBSUxJTkdfSUNPTl9TRUxFQ1RPUik7XG4gICAgICAgIHRoaXMudHJhaWxpbmdJY29uXyA9IHRyYWlsaW5nSWNvbkVsID8gaWNvbkZhY3RvcnkodHJhaWxpbmdJY29uRWwpIDogbnVsbDtcbiAgICAgICAgLy8gUHJlZml4IGFuZCBTdWZmaXhcbiAgICAgICAgdGhpcy5wcmVmaXhfID0gdGhpcy5yb290Xy5xdWVyeVNlbGVjdG9yKHN0cmluZ3MuUFJFRklYX1NFTEVDVE9SKTtcbiAgICAgICAgdGhpcy5zdWZmaXhfID0gdGhpcy5yb290Xy5xdWVyeVNlbGVjdG9yKHN0cmluZ3MuU1VGRklYX1NFTEVDVE9SKTtcbiAgICAgICAgdGhpcy5yaXBwbGUgPSB0aGlzLmNyZWF0ZVJpcHBsZV8ocmlwcGxlRmFjdG9yeSk7XG4gICAgfTtcbiAgICBNRENUZXh0RmllbGQucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnJpcHBsZSkge1xuICAgICAgICAgICAgdGhpcy5yaXBwbGUuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxpbmVSaXBwbGVfKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVSaXBwbGVfLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5oZWxwZXJUZXh0Xykge1xuICAgICAgICAgICAgdGhpcy5oZWxwZXJUZXh0Xy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2hhcmFjdGVyQ291bnRlcl8pIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyQ291bnRlcl8uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxlYWRpbmdJY29uXykge1xuICAgICAgICAgICAgdGhpcy5sZWFkaW5nSWNvbl8uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRyYWlsaW5nSWNvbl8pIHtcbiAgICAgICAgICAgIHRoaXMudHJhaWxpbmdJY29uXy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubGFiZWxfKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsXy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3V0bGluZV8pIHtcbiAgICAgICAgICAgIHRoaXMub3V0bGluZV8uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIFRleHQgRmllbGQncyBpbnRlcm5hbCBzdGF0ZSBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnQnc1xuICAgICAqIHN0YXRlLlxuICAgICAqL1xuICAgIE1EQ1RleHRGaWVsZC5wcm90b3R5cGUuaW5pdGlhbFN5bmNXaXRoRE9NID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdGhpcy5pbnB1dF8uZGlzYWJsZWQ7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkLnByb3RvdHlwZSwgXCJ2YWx1ZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm91bmRhdGlvbl8uZ2V0VmFsdWUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0IG9uIHRoZSBpbnB1dC5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmZvdW5kYXRpb25fLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZC5wcm90b3R5cGUsIFwiZGlzYWJsZWRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvdW5kYXRpb25fLmlzRGlzYWJsZWQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSBkaXNhYmxlZCBTZXRzIHRoZSBUZXh0IEZpZWxkIGRpc2FibGVkIG9yIGVuYWJsZWQuXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChkaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5mb3VuZGF0aW9uXy5zZXREaXNhYmxlZChkaXNhYmxlZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGQucHJvdG90eXBlLCBcInZhbGlkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3VuZGF0aW9uXy5pc1ZhbGlkKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gdmFsaWQgU2V0cyB0aGUgVGV4dCBGaWVsZCB2YWxpZCBvciBpbnZhbGlkLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZm91bmRhdGlvbl8uc2V0VmFsaWQodmFsaWQpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkLnByb3RvdHlwZSwgXCJyZXF1aXJlZFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRfLnJlcXVpcmVkO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHJlcXVpcmVkIFNldHMgdGhlIFRleHQgRmllbGQgdG8gcmVxdWlyZWQuXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChyZXF1aXJlZCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dF8ucmVxdWlyZWQgPSByZXF1aXJlZDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZC5wcm90b3R5cGUsIFwicGF0dGVyblwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRfLnBhdHRlcm47XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gcGF0dGVybiBTZXRzIHRoZSBpbnB1dCBlbGVtZW50J3MgdmFsaWRhdGlvbiBwYXR0ZXJuLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICAgICAgdGhpcy5pbnB1dF8ucGF0dGVybiA9IHBhdHRlcm47XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGQucHJvdG90eXBlLCBcIm1pbkxlbmd0aFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRfLm1pbkxlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSBtaW5MZW5ndGggU2V0cyB0aGUgaW5wdXQgZWxlbWVudCdzIG1pbkxlbmd0aC5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG1pbkxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dF8ubWluTGVuZ3RoID0gbWluTGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkLnByb3RvdHlwZSwgXCJtYXhMZW5ndGhcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlucHV0Xy5tYXhMZW5ndGg7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gbWF4TGVuZ3RoIFNldHMgdGhlIGlucHV0IGVsZW1lbnQncyBtYXhMZW5ndGguXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChtYXhMZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIENocm9tZSB0aHJvd3MgZXhjZXB0aW9uIGlmIG1heExlbmd0aCBpcyBzZXQgdG8gYSB2YWx1ZSBsZXNzIHRoYW4gemVyb1xuICAgICAgICAgICAgaWYgKG1heExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Xy5yZW1vdmVBdHRyaWJ1dGUoJ21heExlbmd0aCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dF8ubWF4TGVuZ3RoID0gbWF4TGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkLnByb3RvdHlwZSwgXCJtaW5cIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlucHV0Xy5taW47XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gbWluIFNldHMgdGhlIGlucHV0IGVsZW1lbnQncyBtaW4uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChtaW4pIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRfLm1pbiA9IG1pbjtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZC5wcm90b3R5cGUsIFwibWF4XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnB1dF8ubWF4O1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIG1heCBTZXRzIHRoZSBpbnB1dCBlbGVtZW50J3MgbWF4LlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobWF4KSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Xy5tYXggPSBtYXg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNRENUZXh0RmllbGQucHJvdG90eXBlLCBcInN0ZXBcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlucHV0Xy5zdGVwO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHN0ZXAgU2V0cyB0aGUgaW5wdXQgZWxlbWVudCdzIHN0ZXAuXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Xy5zdGVwID0gc3RlcDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZC5wcm90b3R5cGUsIFwiaGVscGVyVGV4dENvbnRlbnRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgaGVscGVyIHRleHQgZWxlbWVudCBjb250ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoY29udGVudCkge1xuICAgICAgICAgICAgdGhpcy5mb3VuZGF0aW9uXy5zZXRIZWxwZXJUZXh0Q29udGVudChjb250ZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZC5wcm90b3R5cGUsIFwibGVhZGluZ0ljb25BcmlhTGFiZWxcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYXJpYSBsYWJlbCBvZiB0aGUgbGVhZGluZyBpY29uLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMuZm91bmRhdGlvbl8uc2V0TGVhZGluZ0ljb25BcmlhTGFiZWwobGFiZWwpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkLnByb3RvdHlwZSwgXCJsZWFkaW5nSWNvbkNvbnRlbnRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBsZWFkaW5nIGljb24uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gICAgICAgICAgICB0aGlzLmZvdW5kYXRpb25fLnNldExlYWRpbmdJY29uQ29udGVudChjb250ZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZC5wcm90b3R5cGUsIFwidHJhaWxpbmdJY29uQXJpYUxhYmVsXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGFyaWEgbGFiZWwgb2YgdGhlIHRyYWlsaW5nIGljb24uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChsYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5mb3VuZGF0aW9uXy5zZXRUcmFpbGluZ0ljb25BcmlhTGFiZWwobGFiZWwpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkLnByb3RvdHlwZSwgXCJ0cmFpbGluZ0ljb25Db250ZW50XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHRleHQgY29udGVudCBvZiB0aGUgdHJhaWxpbmcgaWNvbi5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZm91bmRhdGlvbl8uc2V0VHJhaWxpbmdJY29uQ29udGVudChjb250ZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZC5wcm90b3R5cGUsIFwidXNlTmF0aXZlVmFsaWRhdGlvblwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbmFibGVzIG9yIGRpc2FibGVzIHRoZSB1c2Ugb2YgbmF0aXZlIHZhbGlkYXRpb24uIFVzZSB0aGlzIGZvciBjdXN0b20gdmFsaWRhdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHVzZU5hdGl2ZVZhbGlkYXRpb24gU2V0IHRoaXMgdG8gZmFsc2UgdG8gaWdub3JlIG5hdGl2ZSBpbnB1dCB2YWxpZGF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodXNlTmF0aXZlVmFsaWRhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5mb3VuZGF0aW9uXy5zZXRVc2VOYXRpdmVWYWxpZGF0aW9uKHVzZU5hdGl2ZVZhbGlkYXRpb24pO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTURDVGV4dEZpZWxkLnByb3RvdHlwZSwgXCJwcmVmaXhUZXh0XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIHRleHQgY29udGVudCBvZiB0aGUgcHJlZml4LCBvciBudWxsIGlmIGl0IGRvZXMgbm90IGV4aXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXhfID8gdGhpcy5wcmVmaXhfLnRleHRDb250ZW50IDogbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHRleHQgY29udGVudCBvZiB0aGUgcHJlZml4LCBpZiBpdCBleGlzdHMuXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwcmVmaXhUZXh0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmVmaXhfKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVmaXhfLnRleHRDb250ZW50ID0gcHJlZml4VGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1EQ1RleHRGaWVsZC5wcm90b3R5cGUsIFwic3VmZml4VGV4dFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIHRoZSB0ZXh0IGNvbnRlbnQgb2YgdGhlIHN1ZmZpeCwgb3IgbnVsbCBpZiBpdCBkb2VzIG5vdCBleGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VmZml4XyA/IHRoaXMuc3VmZml4Xy50ZXh0Q29udGVudCA6IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSB0ZXh0IGNvbnRlbnQgb2YgdGhlIHN1ZmZpeCwgaWYgaXQgZXhpc3RzLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoc3VmZml4VGV4dCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3VmZml4Xykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VmZml4Xy50ZXh0Q29udGVudCA9IHN1ZmZpeFRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEZvY3VzZXMgdGhlIGlucHV0IGVsZW1lbnQuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbnB1dF8uZm9jdXMoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlY29tcHV0ZXMgdGhlIG91dGxpbmUgU1ZHIHBhdGggZm9yIHRoZSBvdXRsaW5lIGVsZW1lbnQuXG4gICAgICovXG4gICAgTURDVGV4dEZpZWxkLnByb3RvdHlwZS5sYXlvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvcGVuTm90Y2ggPSB0aGlzLmZvdW5kYXRpb25fLnNob3VsZEZsb2F0O1xuICAgICAgICB0aGlzLmZvdW5kYXRpb25fLm5vdGNoT3V0bGluZShvcGVuTm90Y2gpO1xuICAgIH07XG4gICAgTURDVGV4dEZpZWxkLnByb3RvdHlwZS5nZXREZWZhdWx0Rm91bmRhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRE8gTk9UIElOTElORSB0aGlzIHZhcmlhYmxlLiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgZm91bmRhdGlvbnMgdGFrZSBhIFBhcnRpYWw8TURDRm9vQWRhcHRlcj4uXG4gICAgICAgIC8vIFRvIGVuc3VyZSB3ZSBkb24ndCBhY2NpZGVudGFsbHkgb21pdCBhbnkgbWV0aG9kcywgd2UgbmVlZCBhIHNlcGFyYXRlLCBzdHJvbmdseSB0eXBlZCBhZGFwdGVyIHZhcmlhYmxlLlxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXMgTWV0aG9kcyBzaG91bGQgYmUgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIGFkYXB0ZXIgaW50ZXJmYWNlLlxuICAgICAgICB2YXIgYWRhcHRlciA9IF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLmdldFJvb3RBZGFwdGVyTWV0aG9kc18oKSksIHRoaXMuZ2V0SW5wdXRBZGFwdGVyTWV0aG9kc18oKSksIHRoaXMuZ2V0TGFiZWxBZGFwdGVyTWV0aG9kc18oKSksIHRoaXMuZ2V0TGluZVJpcHBsZUFkYXB0ZXJNZXRob2RzXygpKSwgdGhpcy5nZXRPdXRsaW5lQWRhcHRlck1ldGhvZHNfKCkpO1xuICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5c1xuICAgICAgICByZXR1cm4gbmV3IE1EQ1RleHRGaWVsZEZvdW5kYXRpb24oYWRhcHRlciwgdGhpcy5nZXRGb3VuZGF0aW9uTWFwXygpKTtcbiAgICB9O1xuICAgIE1EQ1RleHRGaWVsZC5wcm90b3R5cGUuZ2V0Um9vdEFkYXB0ZXJNZXRob2RzXyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6b2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzIE1ldGhvZHMgc2hvdWxkIGJlIGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZSBhZGFwdGVyIGludGVyZmFjZS5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFkZENsYXNzOiBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7IHJldHVybiBfdGhpcy5yb290Xy5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7IH0sXG4gICAgICAgICAgICByZW1vdmVDbGFzczogZnVuY3Rpb24gKGNsYXNzTmFtZSkgeyByZXR1cm4gX3RoaXMucm9vdF8uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpOyB9LFxuICAgICAgICAgICAgaGFzQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIF90aGlzLnJvb3RfLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpOyB9LFxuICAgICAgICAgICAgcmVnaXN0ZXJUZXh0RmllbGRJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uIChldnRUeXBlLCBoYW5kbGVyKSB7IHJldHVybiBfdGhpcy5saXN0ZW4oZXZ0VHlwZSwgaGFuZGxlcik7IH0sXG4gICAgICAgICAgICBkZXJlZ2lzdGVyVGV4dEZpZWxkSW50ZXJhY3Rpb25IYW5kbGVyOiBmdW5jdGlvbiAoZXZ0VHlwZSwgaGFuZGxlcikgeyByZXR1cm4gX3RoaXMudW5saXN0ZW4oZXZ0VHlwZSwgaGFuZGxlcik7IH0sXG4gICAgICAgICAgICByZWdpc3RlclZhbGlkYXRpb25BdHRyaWJ1dGVDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHZhciBnZXRBdHRyaWJ1dGVzTGlzdCA9IGZ1bmN0aW9uIChtdXRhdGlvbnNMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtdXRhdGlvbnNMaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChtdXRhdGlvbikgeyByZXR1cm4gbXV0YXRpb24uYXR0cmlidXRlTmFtZTsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZU5hbWUpIHsgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7IH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9uc0xpc3QpIHsgcmV0dXJuIGhhbmRsZXIoZ2V0QXR0cmlidXRlc0xpc3QobXV0YXRpb25zTGlzdCkpOyB9KTtcbiAgICAgICAgICAgICAgICB2YXIgY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShfdGhpcy5pbnB1dF8sIGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlcmVnaXN0ZXJWYWxpZGF0aW9uQXR0cmlidXRlQ2hhbmdlSGFuZGxlcjogZnVuY3Rpb24gKG9ic2VydmVyKSB7IHJldHVybiBvYnNlcnZlci5kaXNjb25uZWN0KCk7IH0sXG4gICAgICAgIH07XG4gICAgICAgIC8vIHRzbGludDplbmFibGU6b2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgfTtcbiAgICBNRENUZXh0RmllbGQucHJvdG90eXBlLmdldElucHV0QWRhcHRlck1ldGhvZHNfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXMgTWV0aG9kcyBzaG91bGQgYmUgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIGFkYXB0ZXIgaW50ZXJmYWNlLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0TmF0aXZlSW5wdXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmlucHV0XzsgfSxcbiAgICAgICAgICAgIGlzRm9jdXNlZDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gX3RoaXMuaW5wdXRfOyB9LFxuICAgICAgICAgICAgcmVnaXN0ZXJJbnB1dEludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKGV2dFR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuaW5wdXRfLmFkZEV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgaGFuZGxlciwgYXBwbHlQYXNzaXZlKCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlcmVnaXN0ZXJJbnB1dEludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKGV2dFR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuaW5wdXRfLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgaGFuZGxlciwgYXBwbHlQYXNzaXZlKCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICB9O1xuICAgIE1EQ1RleHRGaWVsZC5wcm90b3R5cGUuZ2V0TGFiZWxBZGFwdGVyTWV0aG9kc18gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmbG9hdExhYmVsOiBmdW5jdGlvbiAoc2hvdWxkRmxvYXQpIHsgcmV0dXJuIF90aGlzLmxhYmVsXyAmJiBfdGhpcy5sYWJlbF8uZmxvYXQoc2hvdWxkRmxvYXQpOyB9LFxuICAgICAgICAgICAgZ2V0TGFiZWxXaWR0aDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMubGFiZWxfID8gX3RoaXMubGFiZWxfLmdldFdpZHRoKCkgOiAwOyB9LFxuICAgICAgICAgICAgaGFzTGFiZWw6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEJvb2xlYW4oX3RoaXMubGFiZWxfKTsgfSxcbiAgICAgICAgICAgIHNoYWtlTGFiZWw6IGZ1bmN0aW9uIChzaG91bGRTaGFrZSkgeyByZXR1cm4gX3RoaXMubGFiZWxfICYmIF90aGlzLmxhYmVsXy5zaGFrZShzaG91bGRTaGFrZSk7IH0sXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBNRENUZXh0RmllbGQucHJvdG90eXBlLmdldExpbmVSaXBwbGVBZGFwdGVyTWV0aG9kc18gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhY3RpdmF0ZUxpbmVSaXBwbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMubGluZVJpcHBsZV8pIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubGluZVJpcHBsZV8uYWN0aXZhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVhY3RpdmF0ZUxpbmVSaXBwbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMubGluZVJpcHBsZV8pIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubGluZVJpcHBsZV8uZGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRMaW5lUmlwcGxlVHJhbnNmb3JtT3JpZ2luOiBmdW5jdGlvbiAobm9ybWFsaXplZFgpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMubGluZVJpcHBsZV8pIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubGluZVJpcHBsZV8uc2V0UmlwcGxlQ2VudGVyKG5vcm1hbGl6ZWRYKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH07XG4gICAgTURDVGV4dEZpZWxkLnByb3RvdHlwZS5nZXRPdXRsaW5lQWRhcHRlck1ldGhvZHNfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2xvc2VPdXRsaW5lOiBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5vdXRsaW5lXyAmJiBfdGhpcy5vdXRsaW5lXy5jbG9zZU5vdGNoKCk7IH0sXG4gICAgICAgICAgICBoYXNPdXRsaW5lOiBmdW5jdGlvbiAoKSB7IHJldHVybiBCb29sZWFuKF90aGlzLm91dGxpbmVfKTsgfSxcbiAgICAgICAgICAgIG5vdGNoT3V0bGluZTogZnVuY3Rpb24gKGxhYmVsV2lkdGgpIHsgcmV0dXJuIF90aGlzLm91dGxpbmVfICYmIF90aGlzLm91dGxpbmVfLm5vdGNoKGxhYmVsV2lkdGgpOyB9LFxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHJldHVybiBBIG1hcCBvZiBhbGwgc3ViY29tcG9uZW50cyB0byBzdWJmb3VuZGF0aW9ucy5cbiAgICAgKi9cbiAgICBNRENUZXh0RmllbGQucHJvdG90eXBlLmdldEZvdW5kYXRpb25NYXBfID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hhcmFjdGVyQ291bnRlcjogdGhpcy5jaGFyYWN0ZXJDb3VudGVyXyA/IHRoaXMuY2hhcmFjdGVyQ291bnRlcl8uZm91bmRhdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGhlbHBlclRleHQ6IHRoaXMuaGVscGVyVGV4dF8gPyB0aGlzLmhlbHBlclRleHRfLmZvdW5kYXRpb24gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBsZWFkaW5nSWNvbjogdGhpcy5sZWFkaW5nSWNvbl8gPyB0aGlzLmxlYWRpbmdJY29uXy5mb3VuZGF0aW9uIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHJhaWxpbmdJY29uOiB0aGlzLnRyYWlsaW5nSWNvbl8gPyB0aGlzLnRyYWlsaW5nSWNvbl8uZm91bmRhdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIE1EQ1RleHRGaWVsZC5wcm90b3R5cGUuY3JlYXRlUmlwcGxlXyA9IGZ1bmN0aW9uIChyaXBwbGVGYWN0b3J5KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBpc1RleHRBcmVhID0gdGhpcy5yb290Xy5jbGFzc0xpc3QuY29udGFpbnMoY3NzQ2xhc3Nlcy5URVhUQVJFQSk7XG4gICAgICAgIHZhciBpc091dGxpbmVkID0gdGhpcy5yb290Xy5jbGFzc0xpc3QuY29udGFpbnMoY3NzQ2xhc3Nlcy5PVVRMSU5FRCk7XG4gICAgICAgIGlmIChpc1RleHRBcmVhIHx8IGlzT3V0bGluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIERPIE5PVCBJTkxJTkUgdGhpcyB2YXJpYWJsZS4gRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIGZvdW5kYXRpb25zIHRha2UgYSBQYXJ0aWFsPE1EQ0Zvb0FkYXB0ZXI+LlxuICAgICAgICAvLyBUbyBlbnN1cmUgd2UgZG9uJ3QgYWNjaWRlbnRhbGx5IG9taXQgYW55IG1ldGhvZHMsIHdlIG5lZWQgYSBzZXBhcmF0ZSwgc3Ryb25nbHkgdHlwZWQgYWRhcHRlciB2YXJpYWJsZS5cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6b2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzIE1ldGhvZHMgc2hvdWxkIGJlIGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZSBhZGFwdGVyIGludGVyZmFjZS5cbiAgICAgICAgdmFyIGFkYXB0ZXIgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgTURDUmlwcGxlLmNyZWF0ZUFkYXB0ZXIodGhpcykpLCB7IGlzU3VyZmFjZUFjdGl2ZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gcG9ueWZpbGwubWF0Y2hlcyhfdGhpcy5pbnB1dF8sICc6YWN0aXZlJyk7IH0sIHJlZ2lzdGVySW50ZXJhY3Rpb25IYW5kbGVyOiBmdW5jdGlvbiAoZXZ0VHlwZSwgaGFuZGxlcikgeyByZXR1cm4gX3RoaXMuaW5wdXRfLmFkZEV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgaGFuZGxlciwgYXBwbHlQYXNzaXZlKCkpOyB9LCBkZXJlZ2lzdGVySW50ZXJhY3Rpb25IYW5kbGVyOiBmdW5jdGlvbiAoZXZ0VHlwZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5pbnB1dF8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnRUeXBlLCBoYW5kbGVyLCBhcHBseVBhc3NpdmUoKSk7XG4gICAgICAgICAgICB9IH0pO1xuICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm9iamVjdC1saXRlcmFsLXNvcnQta2V5c1xuICAgICAgICByZXR1cm4gcmlwcGxlRmFjdG9yeSh0aGlzLnJvb3RfLCBuZXcgTURDUmlwcGxlRm91bmRhdGlvbihhZGFwdGVyKSk7XG4gICAgfTtcbiAgICByZXR1cm4gTURDVGV4dEZpZWxkO1xufShNRENDb21wb25lbnQpKTtcbmV4cG9ydCB7IE1EQ1RleHRGaWVsZCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcG9uZW50LmpzLm1hcCIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHtNRENUZXh0RmllbGR9IGZyb20gJ0BtYXRlcmlhbC90ZXh0ZmllbGQnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLnNjc3MnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUZXh0SW5wdXQocHJvcHMpIHtcclxudXNlRWZmZWN0KCgpPT57XHJcbiAgY29uc3QgdXNlcm5hbWUgPSBuZXcgTURDVGV4dEZpZWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGMtdGV4dC1maWVsZCcpKTtcclxuIFxyXG59LFtdKVxyXG4gIHJldHVybiAoXHJcbjxsYWJlbCBjbGFzc05hbWU9XCJtZGMtdGV4dC1maWVsZCBtZGMtdGV4dC1maWVsZC0tZmlsbGVkIGlucHV0dGV4dFwiPlxyXG4gIDxzcGFuIGNsYXNzTmFtZT1cIm1kYy10ZXh0LWZpZWxkX19yaXBwbGVcIj48L3NwYW4+XHJcbiAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwibWRjLXRleHQtZmllbGRfX2lucHV0XCIgYXJpYS1sYWJlbGxlZGJ5PVwidXNlcm5hbWUtbGFiZWxcIiBuYW1lPVwidXNlcm5hbWVcIiByZXF1aXJlZC8+XHJcbiAgPHNwYW4gY2xhc3NOYW1lPVwibWRjLWZsb2F0aW5nLWxhYmVsXCIgaWQ9XCJ1c2VybmFtZS1sYWJlbFwiPlVzZXJuYW1lPC9zcGFuPlxyXG4gIDxzcGFuIGNsYXNzTmFtZT1cIm1kYy1saW5lLXJpcHBsZVwiPjwvc3Bhbj5cclxuPC9sYWJlbD5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0aXRsZSxzdHlsZSxpZCB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgey4uLnByb3BzfT5cclxuICAgICAge3RpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSU5QVVRfVkFMVUVfQ0hBTkdFRDonSU5QVVRfVkFMVUVfQ0hBTkdFRCcsXHJcbiAgVkFMVUVfQ0hBTkdFRDogJ1ZBTFVFX0NIQU5HRUQnLFxyXG4gIExPR0lOX1NUQVJURUQ6ICdMT0dJTl9TVEFSVEVEJyxcclxuICBMT0dJTl9TVUNDRVNTOiAnTE9HSU5fU1VDQ0VTUycsXHJcbiAgTE9HSU5fRkFJTEVEOiAnTE9HSU5fRkFJTEVEJyxcclxuXHJcbiAgTE9HT1VUX1NUQVJURUQ6ICdMT0dPVVRfU1RBUlRFRCcsXHJcbiAgTE9HT1VUX0ZBSUxFRDogJ0xPR09VVF9GQUlMRUQnLFxyXG4gIExPR09VVF9TVUNDRVNTOiAnTE9HT1VUX1NVQ0NFU1MnLFxyXG5cclxuICBTSUdOVVBfU1RBUlRFRDogJ1NJR05VUF9TVEFSVEVEJyxcclxuICBTSUdOVVBfU1VDQ0VTUzogJ1NJR05VUF9TVUNDRVNTJyxcclxuICBTSUdOVVBfRkFJTEVEOiAnU0lHTlVQX0ZBSUxFRCcsXHJcblxyXG4gIENIQU5HRV9QQVNTV09SRF9TVEFSVEVEOiAnQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9TVUNDRVNTOiAnQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9GQUlMRUQ6ICdDSEFOR0VfUEFTU1dPUkRfRkFJTEVEJyxcclxuXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQnLFxyXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogJ0dPVF9UT0tFTl9GUk9NX1VSTCcsXHJcblxyXG4gIFJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTogJ1JFQ09WRVJfTE9DQUxfQVVUSF9TVEFURScsXHJcbiAgXHJcbiAgU0VSVkVSX0VSUk9SX1JFQ0lFVkVEOidTRVJWRVJfRVJST1JfUkVDSUVWRUQnXHJcbn07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBlbWFpbDogJycsXHJcbiAgcGFzc3dvcmQ6ICcnLFxyXG4gIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIHVzZXJuYW1lOiAnJyxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBjb25maXJtOiAnJyxcclxuICBjdXJyZW50OiAnJyxcclxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxyXG4gIHRva2VuOiBudWxsLFxyXG4gIGlzTG9nZ2VkSW46IGZhbHNlLFxyXG4gIGlzUGFzc3dvcmRDaGFuZ2VkOiBmYWxzZSxcclxuICBhdXRoRmVlZGJhY2s6IG51bGwsXHJcbiAgdXNlcjpudWxsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXV0aFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRDpcclxuICAgICAgY29uc3QgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIFthY3Rpb24ucGF5bG9hZC5wcm9wTmFtZV06IGFjdGlvbi5wYXlsb2FkLnZhbHVlLFxyXG4gICAgICB9O1xyXG4gIFxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjphY3Rpb24udXNlcixcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUsICcsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcclxuICAgICAgIHVzZXI6YWN0aW9uLnVzZXIsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZScsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXI6YWN0aW9uLnVzZXIsXHJcbiAgICAgICAgaXNQYXNzd29yZENoYW5nZWQ6IHRydWUsXHJcbiAgICAgICAgYXV0aEZlZWRiYWNrOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgYXV0aEZlZWRiYWNrOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHRva2VuOiBhY3Rpb24udG9rZW4gfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HT1VUX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7IC4uLmluaXRTdGF0ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICB1c2VyOmFjdGlvbi51c2VyXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBBdXRoUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbYXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgaWYgKGF1dGhSb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmsocHJvcHMpIHtcclxuICBjb25zdCB7IHRvLCBpZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRSb3V0ZSh0byk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8YVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgICAgaHJlZj17dG99XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxyXG4gICAgICBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnIH19XHJcbiAgICAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhSb3V0ZUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEF1dGhSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGluaXRpYWxSb3V0ZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZVN0YXRlKGluaXRpYWxSb3V0ZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdLCBbYXV0aFJvdXRlXSk7XHJcblxyXG4gIHJldHVybiA8QXV0aFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vYXV0aFJlZHVjZXInO1xyXG5pbXBvcnQgeyBBdXRoUm91dGVQcm92aWRlciB9IGZyb20gJy4vYXV0aC1yb3V0ZS1jb250ZXh0JztcclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9PlxyXG4gICAgICA8QXV0aFJvdXRlUHJvdmlkZXI+e2NoaWxkcmVufTwvQXV0aFJvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZUF1dGhDb250ZXh0IH07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgcHJvcE5hbWUsXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd3ZWJjb20nKTtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUyB9O1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkwsXHJcbiAgICB0b2tlbixcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHsgdXNlciwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFLCB1c2VyIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IGRldmljZVR5cGUgZnJvbSAnLi9kZXZpY2VUeXBlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KCkge1xyXG4gIGNvbnN0IFt3aWR0aCwgc2V0V2lkdGhdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hlaWdodCwgc2V0SGVpZ2h0XSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtvcmllbnRhdGlvbiwgc2V0T3JpZW50YXRpb25dID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtkZXZpY2UsIHNldERldmljZV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlVmlld3BvcnRTaXplKCkge1xyXG4gICBcclxuICAgICAgc2V0V2lkdGgod2luZG93LmlubmVyV2lkdGgpO1xyXG4gICAgICBzZXRIZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKSB7XHJcbiAgICBzZXRPcmllbnRhdGlvbih3aW5kb3cuc2NyZWVuLm9yaWVudGF0aW9uKTtcclxuICB9XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh3aWR0aCA+IDApIHtcclxuICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA2MDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3Bob25lJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDc2ODpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDk5MjpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDEyMDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3RhYmxldCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdsYXB0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPiAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdkZXNrdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFt3aWR0aF0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2RldmljZScsIGRldmljZSk7XHJcbiAgfSwgW2RldmljZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBoYW5kbGVWaWV3cG9ydFNpemUoKTtcclxuICAgIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gaGFuZGxlVmlld3BvcnRTaXplKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB9O1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24sIGRldmljZSB9O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgYm94U2hhZG93OiBgMHB4IDNweCAzcHggLTJweCByZ2JhKDAsIDAsIDAsIDAuMiksXHJcbiAgICAwcHggM3B4IDRweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDFweCA4cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xMilgLFxyXG4gIG1hcmdpbjogOCxcclxuICBwYWRkaW5nOiA4LFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFBhcGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfT57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEdyaWQocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCB3aWR0aCB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogYGF1dG8gJHt3aWR0aH0lIGF1dG9gLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgICA8ZGl2PntjaGlsZHJlbn08L2Rpdj5cclxuICAgICAgPGRpdj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID17XHJcbiAgICBBUFBfUk9VVEVfQ0hBTkdFRDonQVBQX1JPVVRFX0NIQU5HRUQnLFxyXG4gIC8vICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuICBjb25zdCB7bmFtZX09c3RhdGVcclxuICBmdW5jdGlvbiBvbkFwcFJvdXRlKHtyb3V0ZSxmZWF0dXJlUm91dGV9KXtcclxuICAgIGlmKG5hbWUpe1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShuYW1lLEpTT04uc3RyaW5naWZ5KHtyb3V0ZSxmZWF0dXJlUm91dGV9KSlcclxuICAgIH1cclxuICAgXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3Qge2luaXRTdGF0ZX09cHJvcHNcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZVJlZHVjZXIocmVkdWNlcixpbml0U3RhdGUpXHJcblxyXG4gIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgaWYoc3RhdGUgJiYgc3RhdGUubmFtZSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdGF0ZS5uYW1lKSl7XHJcbiBcclxuICAgICAgICBjb25zdCB7ZmVhdHVyZVJvdXRlLHJvdXRlfT0gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSkpXHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgICB9XHJcblxyXG4gIH0sW10pXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VVc2VyTmFtZSgpIHtcclxuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW29iamVjdElkLCBzZXRPYmplY3RJZF0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgXHJcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG5cclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgdG9rZW4sIGVtYWlsLG9iamVjdElkIH0gPSBKU09OLnBhcnNlKFxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJylcclxuICAgICAgKTtcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgICAgc2V0T2JqZWN0SWQob2JqZWN0SWQpXHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLnVzZXIgJiYgc3RhdGUudXNlci50b2tlbikge1xyXG4gIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4sb2JqZWN0SWQgfSA9c3RhdGUudXNlcjtcclxuICBcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgICAgc2V0T2JqZWN0SWQob2JqZWN0SWQpXHJcbiAgICB9XHJcbiAgfSwgW3N0YXRlLnVzZXJdKTtcclxuXHJcbiAgcmV0dXJuIHsgdXNlcm5hbWU6IHVzZXJOYW1lLCB0b2tlbiwgZW1haWwgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuLy9pbXBvcnQgJy4vY3NzL3N0eWxlLnNjc3MnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5cclxuaW1wb3J0IEJ1dHRvbiBmcm9tICdjb250cm9scy9idXR0b24nO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL3N0YXRlL2F1dGgtY29udGV4dCc7XHJcblxyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4uL3N0YXRlL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCB7IFBhcGVyIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvUGFwZXInO1xyXG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvR3JpZCc7XHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uL3N0YXRlL3VzZVVzZXJOYW1lJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQoe2NoYW5nZVBhc3N3b3JkfSkge1xyXG4gIGNvbnN0IHsgc3RhdGUsIGRpc3BhdGNoIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgZGlzcGF0Y2g6IGZvcm1EaXNwYXRjaCB9ID0gdXNlRm9ybUNvbnRleHQoKTtcclxuICBjb25zdCB7IHRva2VuIH0gPSB1c2VVc2VyTmFtZSgpO1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgZXJyb3IgfSA9IHN0YXRlO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgdmFyIHVybHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XHJcblxyXG4gICAgaWYgKHVybHRva2VuKSB7XHJcbiAgICAgIGRpc3BhdGNoKGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW46IHVybHRva2VuIH0pKTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUuYXV0aEZlZWRiYWNrKSB7XHJcbiAgICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTogJy9hdXRoZmVlZGJhY2snLHJvdXRlOicvYXV0aCd9KTtcclxuICAgIH1cclxuICB9LCBbc3RhdGUuYXV0aEZlZWRiYWNrXSk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldDtcclxuICAgIGRpc3BhdGNoKFxyXG4gICAgICBhY3Rpb25zLnZhbHVlQ2hhbmdlZCh7XHJcbiAgICAgICAgcHJvcE5hbWU6IG5hbWUsXHJcbiAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuIFxyXG4gIHJldHVybiAoXHJcbiAgICA8R3JpZCB3aWR0aD17ZGV2aWNlID09PSAncGhvbmUnID8gMTAwIDogMjV9PlxyXG4gICAgICA8UGFwZXI+XHJcbiAgICBcclxuICAgICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICBuYW1lPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0VudGVyIG5ldyBwYXNzd29yZCdcclxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgIC8vICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT05dfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgICAgdmFsdWU9e2NvbmZpcm19XHJcbiAgICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICBpZD0nY29uZmlybSdcclxuICAgICAgICAgICAgbmFtZT0nY29uZmlybSdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0NvbmZpcm0gbmV3IHBhc3N3b3JkJ1xyXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAvLyAgIHZhbGlkYXRpb25UeXBlcz17W3ZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTl19XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgXHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPSdjaGFuZ2UtcGFzcy1idG4nXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2NoYW5nZVBhc3N3b3JkfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICA+Q0hBTkdFPC9CdXR0b24+XHJcbiAgIFxyXG4gICAgICA8L1BhcGVyPlxyXG4gICAgPC9HcmlkPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFRoZW1lQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZVRoZW1lQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xyXG5cclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFRoZW1lUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGhlbWVQcm92aWRlcihwcm9wcykge1xyXG4gIFxyXG4gIGNvbnN0IHsgaW5pdFN0YXRlIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0U3RhdGUpO1xyXG5cclxuICByZXR1cm4gPFRoZW1lQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17c3RhdGV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9O1xyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi9zdGF0ZS9hdXRoLWNvbnRleHQnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoRmVlZGJhY2soeyBtZXNzYWdlLCBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICBoZWlnaHQ6IDMwMCxcclxuICAgICAgICBmb250U2l6ZTogMTYsXHJcbiAgICAgIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPSdhdXRoLWZlZWRiYWNrJ1xyXG4gICAgPlxyXG4gICAgICA8ZGl2PntzdGF0ZS5hdXRoRmVlZGJhY2t9PC9kaXY+XHJcblxyXG4gICAgICA8ZGl2PiB7Y2hpbGRyZW59PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTG9naW5MaW5rKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8YSBocmVmPXtgJHthcGlfdXJsfWB9PkxvZ2luPC9hPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgJ3doYXR3Zy1mZXRjaCc7XHJcbmltcG9ydCB7IGgsIHJlbmRlciB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICcuLi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkJztcclxuaW1wb3J0ICBBdXRoUHJvdmlkZXIgIGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL2F1dGgtY29udGV4dCc7XHJcblxyXG5pbXBvcnQgQXBwUm91dGVQcm92aWRlcix7IEFwcFJvdXRlfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuaW1wb3J0ICBUaGVtZVByb3ZpZGVyICBmcm9tICdjb21wb25lbnRzL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5pbXBvcnQgQXV0aEZlZWRiYWNrLCB7IExvZ2luTGluayB9IGZyb20gJy4uL3VpLWNvbXBvbmVudHMvQXV0aEZlZWRiYWNrJztcclxucmVuZGVyKFxyXG4gIDxkaXY+XHJcblxyXG4gICAgICA8QXV0aFByb3ZpZGVyPlxyXG4gICAgICAgIDxUaGVtZVByb3ZpZGVyXHJcbiAgICAgICAgICBpbml0U3RhdGU9e3tcclxuICAgICAgICAgICAgcHJpbWFyeToge1xyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcclxuICAgICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPEFwcFJvdXRlUHJvdmlkZXIgaW5pdFN0YXRlPXt7cm91dGU6Jy8nLGZlYXR1cmVSb3V0ZTonLyd9fT5cclxuICAgICAgICAgICAgPEFwcFJvdXRlIHBhdGg9Jy8nPlxyXG4gICAgICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCAvPlxyXG4gICAgICAgICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICAgICAgICA8QXBwUm91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XHJcbiAgICAgICAgICAgICAgPEF1dGhGZWVkYmFjaz5cclxuICAgICAgICAgICAgICAgIDxMb2dpbkxpbmsgLz5cclxuICAgICAgICAgICAgICA8L0F1dGhGZWVkYmFjaz5cclxuICAgICAgICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgICAgIDwvQXBwUm91dGVQcm92aWRlcj5cclxuICAgICAgICA8L1RoZW1lUHJvdmlkZXI+XHJcbiAgICAgIDwvQXV0aFByb3ZpZGVyPlxyXG5cclxuICA8L2Rpdj4sXHJcbiAgZG9jdW1lbnQuYm9keVxyXG4pO1xyXG4iXSwibmFtZXMiOlsidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJjc3NDbGFzc2VzIiwic3RyaW5ncyIsIm51bWJlcnMiLCJ1dGlsLnN1cHBvcnRzQ3NzVmFyaWFibGVzIiwiSU5URVJBQ1RJT05fRVZFTlRTIiwicG9ueWZpbGwubWF0Y2hlcyIsIlRleHRJbnB1dCIsInByb3BzIiwidXNlRWZmZWN0IiwidXNlcm5hbWUiLCJNRENUZXh0RmllbGQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJCdXR0b24iLCJ0aXRsZSIsInN0eWxlIiwiaWQiLCJJTlBVVF9WQUxVRV9DSEFOR0VEIiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJTRVJWRVJfRVJST1JfUkVDSUVWRUQiLCJpbml0U3RhdGUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImVycm9yIiwibG9hZGluZyIsImNvbmZpcm0iLCJjdXJyZW50IiwiZW1haWxvcnVzZXJuYW1lIiwidG9rZW4iLCJpc0xvZ2dlZEluIiwiaXNQYXNzd29yZENoYW5nZWQiLCJhdXRoRmVlZGJhY2siLCJ1c2VyIiwiYXV0aFJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJhY3Rpb25UeXBlcyIsIm5leHRTdGF0ZSIsInBheWxvYWQiLCJwcm9wTmFtZSIsInZhbHVlIiwic3VjY2Vzc01lc3NhZ2UiLCJtZXNzYWdlIiwiQXV0aFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJBdXRoUm91dGVQcm92aWRlciIsImluaXRpYWxSb3V0ZSIsImF1dGhSb3V0ZSIsInNldEF1dGhSb3V0ZSIsInVzZVN0YXRlIiwidXNlTWVtbyIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiZGlzcGF0Y2giLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZVJlZHVjZXIiLCJ2YWx1ZUNoYW5nZWQiLCJnZXRUb2tlbkZyb21VcmwiLCJ1c2VNZWRpYVF1ZXJ5Iiwid2lkdGgiLCJzZXRXaWR0aCIsImhlaWdodCIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJkZXZpY2UiLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsImNvbnNvbGUiLCJsb2ciLCJhZGRFdmVudExpc3RlbmVyIiwiYm94U2hhZG93IiwibWFyZ2luIiwicGFkZGluZyIsIlBhcGVyIiwiR3JpZCIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiQVBQX1JPVVRFX0NIQU5HRUQiLCJyZWR1Y2VyIiwicm91dGUiLCJmZWF0dXJlUm91dGUiLCJBcHBSb3V0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZSIsIm5hbWUiLCJvbkFwcFJvdXRlIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJBcHBSb3V0ZSIsInBhdGgiLCJwYXRocyIsImZpbmQiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiZ2V0SXRlbSIsInBhcnNlIiwidXNlVXNlck5hbWUiLCJ1c2VyTmFtZSIsInNldFVzZXJuYW1lIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsIm9iamVjdElkIiwic2V0T2JqZWN0SWQiLCJDaGFuZ2VQYXNzd29yZCIsImNoYW5nZVBhc3N3b3JkIiwiZm9ybURpc3BhdGNoIiwidXNlRm9ybUNvbnRleHQiLCJ1cmwiLCJVUkwiLCJsb2NhdGlvbiIsImhyZWYiLCJ1cmx0b2tlbiIsInNlYXJjaFBhcmFtcyIsImdldCIsImFjdGlvbnMiLCJoYW5kbGVDaGFuZ2UiLCJ0YXJnZXQiLCJUaGVtZUNvbnRleHQiLCJUaGVtZVByb3ZpZGVyIiwic2V0U3RhdGUiLCJBdXRoRmVlZGJhY2siLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJmb250U2l6ZSIsIkxvZ2luTGluayIsImFwaV91cmwiLCJyZW5kZXIiLCJwcmltYXJ5IiwiYmFja2dyb3VuZCIsImNvbG9yIiwiZm9udEZhbWlseSIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLElBQUksSUFBSTtBQUN6QyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQ3BELEVBQUUsSUFBSTtBQUNOLElBQUksWUFBWSxJQUFJLElBQUk7QUFDeEIsSUFBSSxNQUFNLElBQUksSUFBSTtBQUNsQixJQUFJLENBQUMsV0FBVztBQUNoQixNQUFNLElBQUk7QUFD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LENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQ0E1L1IsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXdPLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENB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
