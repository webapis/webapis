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

var t$1,r$1,u$1,i$1=[],o$1=n.__r,f$1=n.diffed,c$1=n.__c,e$1=n.unmount;function a$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v$1(n){return m$1(x$1,n)}function m$1(n,u,i){var o=a$1(t$1++);return o.__c||(o.__c=r$1,o.__=[i?i(u):x$1(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p$1(n,u){var i=a$1(t$1++);q(i.__H,u)&&(i.__=n,i.__H=u,r$1.__H.__h.push(i));}function s$1(n,r){var u=a$1(t$1++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__;var i=a$1(t$1++);return null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value}function F(){i$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(_$1),t.__H.__h.forEach(g$1),t.__H.__h=[];}catch(r){return t.__H.__h=[],n.__e(r,t.__v),!0}}),i$1=[];}function _$1(n){n.t&&n.t();}function g$1(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o$1&&o$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.__h.forEach(_$1),r$1.__H.__h.forEach(g$1),r$1.__H.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i$1.push(r)&&u$1===n.requestAnimationFrame||((u$1=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_$1),t.__h=t.__h.filter(function(n){return !n.__||g$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c$1&&c$1(t,r);},n.unmount=function(t){e$1&&e$1(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

const actionTypes = {
  APP_ROUTE_CHANGED: 'APP_ROUTE_CHANGED' //  FEATURE_ROUTE_CHANGED:'FEATURE_ROUTE_CHANGED'

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
  p$1(() => {
    if (state && state.name && localStorage.getItem(state.name)) {
      const {
        featureRoute,
        route
      } = JSON.parse(localStorage.getItem(state.name));
      dispatch({
        type: actionTypes.APP_ROUTE_CHANGED,
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

const initState$1 = {
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
    case actionTypes$2.SERVER_ERROR_RECIEVED:
      return { ...state,
        error: action.error
      };

    case actionTypes$2.CONSTRAINT_VALIDATION:
      return { ...state,
        validation: { ...state.validation,
          [action.name]: {
            isValid: action.isValid,
            message: action.message
          }
        }
      };

    case actionTypes$2.VALUE_CHANGED:
      const nextState = { ...state,
        [action.name]: action.value
      };
      return nextState;

    case actionTypes$2.LOGIN_STARTED:
      return { ...state,
        loading: true,
        login: true
      };

    case actionTypes$2.LOGIN_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        user: action.user,
        password: ''
      };

    case actionTypes$2.LOGIN_FAILED:
      return { ...state,
        loading: false,
        login: false
      };

    case actionTypes$2.SIGNUP_STARTED:
      return { ...state,
        loading: true,
        signup: true
      };

    case actionTypes$2.SIGNUP_SUCCESS:
      return { ...state,
        loading: false,
        user: action.user,
        password: '',
        signup: false
      };

    case actionTypes$2.SIGNUP_FAILED:
      return { ...state,
        loading: false,
        signup: false
      };

    case actionTypes$2.CHANGE_PASSWORD_STARTED:
      return { ...state,
        loading: true,
        changePassword: true
      };

    case actionTypes$2.CHANGE_PASSWORD_SUCCESS:
      return { ...state,
        loading: false,
        user: action.user,
        changePassword: false
      };

    case actionTypes$2.CHANGE_PASSWORD_FAILED:
      return { ...state,
        loading: false,
        changePassword: false
      };

    case actionTypes$2.REQUEST_PASS_CHANGE_STARTED:
      return { ...state,
        loading: true,
        requestPassChange: true
      };

    case actionTypes$2.REQUEST_PASS_CHANGE_SUCCESS:
      return { ...state,
        loading: false,
        requestPassChange: false
      };

    case actionTypes$2.REQUEST_PASS_CHANGE_FAILED:
      return { ...state,
        loading: false,
        requestPassChange: false
      };

    case actionTypes$2.GOT_TOKEN_FROM_URL:
      return { ...state,
        token: action.token
      };

    case actionTypes$2.LOGOUT:
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
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'password',
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS
      });
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'emailorusername',
        isValid: false,
        message: validationMessages.INVALID_CREDENTIALS
      });
      break;

    case 125:
    case -3:
    case httpStatus.emailInvalid:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'email',
        isValid: false,
        message: validationMessages.INVALID_EMAIL
      });
      break;

    case httpStatus.passwordInvalid:
    case -4:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'password',
        isValid: false,
        message: validationMessages.INVALID_PASSWORD
      });
      break;

    case httpStatus.usernameInvalid:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'username',
        isValid: false,
        message: validationMessages.INVALID_USERNAME
      });
      break;

    case 203:
    case httpStatus.emailIsRegistered:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'email',
        isValid: false,
        message: validationMessages.REGISTERED_EMAIL
      });
      break;

    case 202: //parse

    case httpStatus.usernameIsTaken:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'username',
        isValid: false,
        message: validationMessages.USERNAME_TAKEN
      });
      break;

    case httpStatus.emptyPasswordNotValid:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'password',
        isValid: false,
        message: validationMessages.REQUIRED_FIELD
      });
      break;

    case httpStatus.passwordDoNotMatch:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'password',
        isValid: false,
        message: validationMessages.PASSWORDS_DO_NOT_MATCH
      });
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
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
function validateEmailOrUsername({
  value
}) {
  const emailConstraint = new RegExp(emailRegex);
  const usernameConstraint = new RegExp(usernameRegex);

  if (emailConstraint.test(value)) {
    return {
      isValid: true,
      message: ''
    };
  } else if (usernameConstraint.test(value)) {
    return {
      isValid: true,
      message: ''
    };
  } else {
    return {
      isValid: false,
      message: validationMessages.INVALID_USERNAME_OR_EMAIL
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
        type: actionTypes$2.SIGNUP_SUCCESS,
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
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error
      });
      dispatch({
        type: actionTypes$2.SIGNUP_FAILED
      });
    }
  } else {
    debugger;
    dispatch({
      type: actionTypes$2.CONSTRAINT_VALIDATION,
      name: 'username',
      ...validateUserNameConstraint({
        username
      })
    });
    dispatch({
      type: actionTypes$2.CONSTRAINT_VALIDATION,
      name: 'email',
      ...validateEmailConstraint({
        email
      })
    });
    dispatch({
      type: actionTypes$2.CONSTRAINT_VALIDATION,
      name: 'password',
      ...validatePasswordConstraint({
        password
      })
    });
    dispatch({
      type: actionTypes$2.SIGNUP_FAILED
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
        type: actionTypes$2.LOGIN_SUCCESS,
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
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error
      });
      dispatch({
        type: actionTypes$2.LOGIN_FAILED
      });
    });
  } else {
    //empty emailorusername or password
    dispatch({
      type: actionTypes$2.CONSTRAINT_VALIDATION,
      name: 'emailorusername',
      ...validateEmptyString({
        value: emailorusername
      })
    });
    dispatch({
      type: actionTypes$2.CONSTRAINT_VALIDATION,
      name: 'password',
      ...validateEmptyString({
        value: password
      })
    });
    dispatch({
      type: actionTypes$2.LOGIN_FAILED
    });
  }
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
  const [state, dispatch] = m$1(authReducer, initState$1);
  const value = s$1(() => [state, dispatch], [state]);
  return h(AuthContext.Provider, _extends({
    value: value
  }, props), h(AuthAdapter, {
    state: state,
    dispatch: dispatch
  }, children));
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
      debugger;
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

function useAuth() {
  const {
    state,
    dispatch
  } = useAuthContext();

  function onChange(e) {
    const {
      name,
      value
    } = e.target;
    dispatch({
      type: actionTypes$2.VALUE_CHANGED,
      name,
      value
    });
  }

  function onLogin() {
    dispatch({
      type: actionTypes$2.LOGIN_STARTED
    });
  }

  function onSignup() {
    dispatch({
      type: actionTypes$2.SIGNUP_STARTED
    });
  }

  function onRequestPasswordChange() {
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_STARTED
    });
  }

  function onPasswordChange() {
    dispatch({
      type: actionTypes$2.CHANGE_PASSWORD_STARTED
    });
  }

  function onSignOut() {
    localStorage.removeItem('webcom');
    dispatch({
      type: actionTypes$2.LOGOUT
    });
  }

  function onLoginBlur(e) {
    const {
      emailorusername,
      password
    } = state;
    const {
      name
    } = e.target;

    switch (name) {
      case 'password':
        if (password === '') {
          dispatch({
            type: actionTypes$2.CONSTRAINT_VALIDATION,
            name: 'password',
            isValid: false,
            message: 'Required field'
          });
        }

        break;

      case 'emailorusername':
        // if (emailorusername === '') {
        dispatch({
          type: actionTypes$2.CONSTRAINT_VALIDATION,
          name: 'emailorusername',
          ...validateEmailOrUsername({
            value: emailorusername
          })
        }); //}

        break;

      default:
        throw new Error('onLoginBlur error');
    }
  }

  function onSignupBlur(e) {
    const {
      email,
      username,
      password
    } = state;
    const {
      name
    } = e.target;

    switch (name) {
      case 'password':
        dispatch({
          type: actionTypes$2.CONSTRAINT_VALIDATION,
          name: 'password',
          ...validatePasswordConstraint({
            password
          })
        });
        break;

      case 'email':
        dispatch({
          type: actionTypes$2.CONSTRAINT_VALIDATION,
          name: 'email',
          ...validateEmailConstraint({
            email
          })
        });
        break;

      case 'username':
        dispatch({
          type: actionTypes$2.CONSTRAINT_VALIDATION,
          name: 'username',
          ...validateUserNameConstraint({
            username
          })
        });
        break;

      default:
        throw new Error('onLoginBlur error');
    }
  }

  function onChangePassBlur() {}

  function onRequestPassChangeBlur() {}

  function onFocus(e) {
    const {
      name
    } = e.target;
    dispatch({
      type: actionTypes$2.CONSTRAINT_VALIDATION,
      name,
      isValid: undefined,
      message: ''
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
    onSignOut
  };
}

function E$1(n,t){for(var e in t)n[e]=t[e];return n}function w$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var C$1=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return w$1(this.props,n)||w$1(this.state,t)},r}(m);var A$1=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),A$1&&A$1(n);};var F$1=n.__e;function N$1(n){return n&&((n=E$1({},n)).__c=null,n.__k=n.__k&&n.__k.map(N$1)),n}function U(){this.__u=0,this.o=null,this.__b=null;}function M$1(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function L(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function O(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);F$1(n,t,e);},(U.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=M$1(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},U.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=N$1(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var P$1=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(O.prototype=new m).u=function(n){var t=this,e=M$1(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),P$1(t,n,r)):o();};e?e(u):u();}},O.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},O.prototype.componentDidUpdate=O.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){P$1(n,e,t);});};var W=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var D$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var H$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var Z=n.event;function I(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){Z&&(n=Z(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var $$1={configurable:!0,get:function(){return this.class}},q$1=n.vnode;n.vnode=function(n){n.$$typeof=H$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&($$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",$$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=D$1.test(u))break;if(r)for(u in o=n.props={},e)o[D$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&(I(t.prototype,"componentWillMount"),I(t.prototype,"componentWillReceiveProps"),I(t.prototype,"componentWillUpdate"),t.m=!0);}q$1&&q$1(n);};

const Login = L(() => import('./Login-ec47c5fa.js'));
const ChangePassword = L(() => import('./ChangePassword-d677c80f.js'));
const ForgotPassword = L(() => import('./ForgotPassword-05d9937e.js'));
const Signup = L(() => import('./Signup-48ca7cc5.js'));
const Profile = L(() => import('./Profile-42d979b6.js'));
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
    state
  } = useAuth();
  return [h(FeatureRoute, {
    path: "/change-pasword"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(ChangePassword, _extends({}, state, {
    onFocus: onFocus,
    onBlur: onChangePassBlur,
    onChange: onChange,
    onPasswordChange: onPasswordChange
  })))), h(FeatureRoute, {
    path: "/login"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Login, _extends({}, state, {
    onFocus: onFocus,
    onBlur: onLoginBlur,
    onChange: onChange,
    onLogin: onLogin
  })))), h(FeatureRoute, {
    path: "/signup"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Signup, _extends({}, state, {
    onFocus: onFocus,
    onBlur: onSignupBlur,
    onChange: onChange,
    onSignup: onSignup
  })))), h(FeatureRoute, {
    path: "/forgot-pasword"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(ForgotPassword, _extends({}, state, {
    onFocus: onFocus,
    onBlur: onRequestPassChangeBlur,
    onChange: onChange,
    onRequestPasswordChange: onRequestPasswordChange
  })))), h(FeatureRoute, {
    path: "/profile"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Profile, null)))];
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
  dispatch,
  userId
}) {
  try {
    // search Hangout
    const query = new Parse.Query("Hangout");
    query.equalTo('userid', userId);
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
    debugger;
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
      fetchHangouts({
        dispatch,
        search,
        userId: user.objectId
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
      subScribeToUnreadHangout();
      subScribeToHangout();
      Parse.LiveQuery.on('open', async () => {
        let query = new Parse.Query("UnreadHangout");
        query.equalTo('userid', user.objectId);
        let unreadhangouts = await query.find();

        if (unreadhangouts) {
          unreadhangouts.forEach(h => {
            const unreadhangout = h.attributes;
            debugger;
            handleHangout({
              hangout: unreadhangout
            });
            removeUnreadHangout({
              hangout: unreadhangout,
              objectId: h.id
            });
          });
        }

        debugger;
        console.log('socket connection established');
      });
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

  async function removeUnreadHangout({
    hangout,
    objectId
  }) {
    debugger;

    try {
      let UnreadHangout = Parse.Object.extend("UnreadHangout");
      let query = new Parse.Query(UnreadHangout);
      let unreadhangout = await query.get(objectId);
      await unreadhangout.destroy();
      debugger;
    } catch (error) {
      debugger;
      dispatch({
        type: actionTypes$1.ERROR_RECIEVED,
        error
      });
    }
  }

  async function subScribeToHangout() {
    let query = new Parse.Query("Hangout");
    query.equalTo('userid', user.objectId);
    let subscription = await query.subscribe();
    subscription.on('create', object => {
      debugger;
      const hangout = object.attributes;
      debugger;
      handleHangout({
        hangout
      });
    });
    subscription.on('update', object => {
      debugger;
      const hangout = object.attributes;
      debugger;
      handleHangout({
        hangout
      });
    });
    subscription.on('enter', object => {
      debugger;
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
    });
  }

  async function subScribeToUnreadHangout() {
    let query = new Parse.Query("UnreadHangout");
    query.equalTo('userid', user.objectId);
    let subscription = await query.subscribe();
    subscription.on('create', object => {
      debugger;
      const hangout = object.attributes;
      debugger;
      handleHangout({
        hangout
      });
      removeUnreadHangout({
        hangout
      });
    });
    subscription.on('update', object => {
      debugger;
      const hangout = object.attributes;
      debugger;
      handleHangout({
        hangout
      });
      removeUnreadHangout({
        hangout
      });
    });
    subscription.on('enter', object => {
      debugger;
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
      removeUnreadHangout({
        hangout
      });
      debugger;
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
      debugger; //HANGOUT

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
        debugger;
        senderUser.addUnique('hangouts', sender);
        targetUser.addUnique('hangouts', target);
        sender.set('owner', senderUser);
        target.set('owner', targetUser);
      } else {
        debugger;
        let targetQuery = new Parse.Query("Hangout");
        targetQuery.equalTo('userid', targetUser.attributes.userid);
        let targetHangout = await targetQuery.first();
        targetHangout.set('message', message);
        targetHangout.set('timestamp', timestamp);
        targetHangout.set('state', targetState); // targetHangout.save()

        debugger;
        let senderQuery = new Parse.Query("Hangout");
        senderQuery.equalTo('userid', user.objectId);
        let senderHangout = await senderQuery.first();
        senderHangout.set('message', message);
        senderHangout.set('timestamp', timestamp);
        senderHangout.set('state', senderState);
        senderHangout.save();
        debugger;
      } //UNREADHANGOUT


      const UnreadHangout = Parse.Object.extend("UnreadHangout");
      const unreadTarget = new UnreadHangout();
      unreadTarget.set('username', user.username);
      unreadTarget.set('email', user.email);
      unreadTarget.set('message', message);
      unreadTarget.set('timestamp', timestamp);
      unreadTarget.set('state', targetState);
      unreadTarget.set('userid', targetUser.attributes.userid);
      targetUser.addUnique('unreadhangouts', unreadTarget);
      unreadTarget.set('owner', targetUser); //SAVE HANGOUTUSER

      senderUser.save();
      targetUser.save();
      debugger;
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

/* eslint-disable no-undef */
function AppProviders({
  children
}) {
  return h(AppRouteProvider, {
    title: "Webcom",
    initState: {
      route: '/',
      featureRoute: '/hangouts'
    }
  }, h(AuthProvider, null, h(HangoutsProvider, null, h(HangoutAdapter, {
    socketUrl: `wss://${"localhost"}:3000`
  }, children))));
}

function Navbar(props) {
  const {
    bg = 'light',
    brand,
    children
  } = props;
  return h("nav", {
    className: `navbar navbar-expand-lg navbar-${bg} bg-${bg}`
  }, h("a", {
    className: "navbar-brand",
    href: "#"
  }, brand), h("button", {
    className: "navbar-toggler",
    type: "button",
    "data-toggle": "collapse",
    "data-target": "#navbarSupportedContent",
    "aria-controls": "navbarSupportedContent",
    "aria-expanded": "false",
    "aria-label": "Toggle navigation"
  }, h("span", {
    className: "navbar-toggler-icon"
  })), children);
}
function NavBarCollapse({
  children
}) {
  return h("div", {
    className: "collapse navbar-collapse",
    id: "navbarSupportedContent"
  }, children);
}
function NavBarNav({
  children
}) {
  return h("ul", {
    className: "navbar-nav mr-auto"
  }, children);
} //

function NavItem({
  children
}) {
  return h("li", {
    className: "nav-item"
  }, children);
}
function NavLink(props) {
  const {
    appRoute
  } = props;
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
      route: appRoute
    });
  }

  return h("a", _extends({
    className: "nav-link",
    href: "#",
    onClick: handleRoute
  }, props));
}

function Nav(props) {
  const {
    children,
    horizontalAlignment
  } = props;
  return h("ul", _extends({
    className: `nav ${horizontalAlignment && horizontalAlignment}`
  }, props), children);
}

function AppNavigation() {
  const {
    username
  } = useUserName();
  const {
    onSignOut
  } = useAuth();
  return h("div", null, h(Navbar, {
    brand: "Webcom",
    bg: "dark"
  }, h(NavBarCollapse, null, h(NavBarNav, null, h(NavItem, null, username && h(NavLink, {
    id: "hangout",
    appRoute: "/hangouts"
  }, "Hangouts"))), h(Nav, {
    horizontalAlignment: "justify-content-end"
  }, !username && h(NavItem, null, h(NavLink, {
    id: "login",
    appRoute: "/auth",
    "data-testid": "login-link"
  }, "Sign in")), !username && h(NavItem, null, h(NavLink, {
    id: "signup",
    appRoute: "/auth",
    "data-testid": "signup-link"
  }, "Sign up")), h(NavItem, null, username && h(NavLink, {
    id: "profile",
    appRoute: "/auth",
    "data-testid": "profile-link"
  }, "Welcome, ", username)), h(NavItem, null, username && h(NavLink, {
    id: "profile",
    appRoute: "/auth",
    "data-testid": "signout-link",
    onClick: onSignOut
  }, "Sign out"))))));
}

function Home() {
  return h("div", {
    "data-testid": "home",
    style: {
      paddingTop: 68
    }
  }, "Home");
}

const Hangouts = L(() => import('./Hangout-89fad6fe.js'));
function AppRoutes() {
  return h("div", {
    style: {
      height: '100%'
    }
  }, h(AppRoute, {
    path: "/auth"
  }, h(AuthFeatureRoutes, null)), h(AppRoute, {
    path: "/"
  }, h(Home, null)), h(AppRoute, {
    path: "/hangouts"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Hangouts, null))));
}

function App() {
  return h("div", null, h(AppNavigation, null), h(AppRoutes, null), '');
}

Parse.initialize("zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA", "Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY

Parse.serverURL = `https://${"localhost"}:1337/parse`; //Parse.liveQueryServerURL = `https://${"localhost"}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
//Parse.liveQueryServerURL = `wss://webapis.back4app.io`

H(h(AppProviders, null, h(App, null)), document.body);

export { _extends as _, h, useAppRoute as u };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtNTM2MTc0MWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2FwcC1yb3V0ZS9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvdXBkYXRlRGVsaXZlcmVkSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3NhdmVSZWNpZXZlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS91c2VNZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdmFsaWRhdGlvbi9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3ZhbGlkYXRpb25NZXNzYWdlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3NlcnZlckVycm9yQWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3ZhbGlkYXRpb25SZWdleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL2NvbnN0cmFpbnRWYWxpZGF0b3JzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3NlcnZpY2VzL3BhcnNlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc2VydmljZXMvcGFyc2UvUGFyc2VBdXRoU2VydmljZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9BdXRoQWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9BdXRoUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvdXNlVXNlck5hbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy91cGRhdGVSZWFkSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VBdXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9jb21wYXQvZGlzdC9jb21wYXQubW9kdWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL0F1dGhGZWF0dXJlUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc2VydmljZXMvcGFyc2UvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9zdGF0ZU1hcHBlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zZXJ2aWNlcy9wYXJzZS9QYXJzZVNlcnZlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0QWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwUHJvdmlkZXJzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbmF2LWJhci9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL25hdi9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwTmF2aWdhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvSG9tZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9BcHAuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwcy93ZWJjb20tYXBwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBzdXBwb3J0ID0ge1xuICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICBibG9iOlxuICAgICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmXG4gICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbn1cblxuZnVuY3Rpb24gaXNEYXRhVmlldyhvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG59XG5cbmlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICBdXG5cbiAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICBBcnJheUJ1ZmZlci5pc1ZpZXcgfHxcbiAgICBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gIH1cbiAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgfVxuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG5mdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvclxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpdGVyYXRvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gIHRoaXMubWFwID0ge31cblxuICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICB9LCB0aGlzKVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSArICcsICcgKyB2YWx1ZSA6IHZhbHVlXG59XG5cbkhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2gobmFtZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaXRlbXMucHVzaCh2YWx1ZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5pZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xufVxuXG5mdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICB9XG4gIGJvZHkuYm9keVVzZWQgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICB9XG4gICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICB9XG4gIHJldHVybiBjaGFycy5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgaWYgKGJ1Zi5zbGljZSkge1xuICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgfSBlbHNlIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gIH1cbn1cblxuZnVuY3Rpb24gQm9keSgpIHtcbiAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5ID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbnZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICByZXR1cm4gbWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEgPyB1cGNhc2VkIDogbWV0aG9kXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICB9XG4gICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgdGhpcy5zaWduYWwgPSBpbnB1dC5zaWduYWxcbiAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgfVxuXG4gIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJ1xuICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIH1cbiAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICB0aGlzLnNpZ25hbCA9IG9wdGlvbnMuc2lnbmFsIHx8IHRoaXMuc2lnbmFsXG4gIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgfVxuICB0aGlzLl9pbml0Qm9keShib2R5KVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywge2JvZHk6IHRoaXMuX2JvZHlJbml0fSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICBib2R5XG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnJicpXG4gICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gIHJldHVybiBmb3JtXG59XG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMwI3NlY3Rpb24tMy4yXG4gIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGhlYWRlcnNcbn1cblxuQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxufVxuXG5Cb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgdXJsOiB0aGlzLnVybFxuICB9KVxufVxuXG5SZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cblJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxufVxuXG5leHBvcnQgdmFyIERPTUV4Y2VwdGlvbiA9IHNlbGYuRE9NRXhjZXB0aW9uXG50cnkge1xuICBuZXcgRE9NRXhjZXB0aW9uKClcbn0gY2F0Y2ggKGVycikge1xuICBET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB2YXIgZXJyb3IgPSBFcnJvcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFja1xuICB9XG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERPTUV4Y2VwdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwgJiYgcmVxdWVzdC5zaWduYWwuYWJvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICB9XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICB9XG5cbiAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgfSlcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCkge1xuICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBET05FIChzdWNjZXNzIG9yIGZhaWx1cmUpXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICB9KVxufVxuXG5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcblxuaWYgKCFzZWxmLmZldGNoKSB7XG4gIHNlbGYuZmV0Y2ggPSBmZXRjaFxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG59XG4iLCJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xyXG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcclxuICAvLyAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcbiAgY29uc3Qge25hbWV9PXN0YXRlXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBpZihuYW1lKXtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obmFtZSxKU09OLnN0cmluZ2lmeSh7cm91dGUsZmVhdHVyZVJvdXRlfSkpXHJcbiAgICB9XHJcbiAgIFxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGlmKHN0YXRlICYmIHN0YXRlLm5hbWUgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSkpe1xyXG4gXHJcbiAgICAgICAgY29uc3Qge2ZlYXR1cmVSb3V0ZSxyb3V0ZX09IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpKVxyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gICAgfVxyXG5cclxuICB9LFtdKVxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xyXG4gICAgU0VORElOR19IQU5HT1VUX1NUQVJURUQ6J1NFTkRJTkdfSEFOR09VVF9TVEFSVEVEJyxcclxuICAgIFNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEOidTRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRCcsXHJcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxyXG5cclxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcclxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXHJcbiBcclxuICAgIFNFQVJDSF9JTlBVVF9DSEFOR0U6ICdTRUFSQ0hfSU5QVVRfQ0hBTkdFJyxcclxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcclxuICAgIENMRUFSRURfSEFOR09VVDonQ0xFQVJFRF9IQU5HT1VUJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXHJcbiAgICBFUlJPUl9SRUNJRVZFRDonRVJST1JfUkVDSUVWRUQnLFxyXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXHJcblxyXG4gICAgU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQ6J1NFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEJyxcclxuXHJcbiAgICBcclxuICAgIE1FU1NBR0VTX1VQREFURUQ6J01FU1NBR0VTX1VQREFURUQnLFxyXG4gICAgSEFOR09VVFNfVVBEQVRFRDonSEFOR09VVFNfVVBEQVRFRCcsXHJcbiAgICBIQU5HT1VUX1VQREFURUQ6J0hBTkdPVVRfVVBEQVRFRCcsXHJcbiAgICBVTlJFQURfSEFOR09VVFNfVVBEQVRFRDonVU5SRUFEX0hBTkdPVVRTX1VQREFURUQnLFxyXG4gICAgLy9TT0NLRVRcclxuXHJcbiAgICBDT05ORUNUSU5HOidDT05ORUNUSU5HJyxcclxuICAgIE9QRU46J09QRU4nLFxyXG4gICAgQ0xPU0lORzonQ0xPU0lORycsXHJcbiAgICBDTE9TRUQ6J0NMT1NFRCcsXHJcbiAgICBTT0NLRVRfUkVBRFk6J1NPQ0tFVF9SRUFEWScsXHJcbiAgICBTT0NLRVRfRVJST1I6J1NPQ0tFVF9FUlJPUidcclxuXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGhhbmdvdXRzOiBudWxsLFxyXG4gIGhhbmdvdXQ6IG51bGwsXHJcbiAgdW5yZWFkaGFuZ291dHM6IG51bGwsXHJcbiAgbWVzc2FnZXM6IG51bGwsXHJcbiAgc2VhcmNoOiAnJyxcclxuICB1c2VyOiBbXSxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICBtZXNzYWdlVGV4dDogJycsXHJcbiAgb25saW5lOiBmYWxzZSxcclxuICBzb2NrZXQ6IG51bGwsXHJcbiAgcmVhZHlTdGF0ZTogMCxcclxuICBzb2NrZXRNZXNzYWdlOiBudWxsLFxyXG4gIGZldGNoSGFuZ291dHM6IGZhbHNlLFxyXG4gIHBlbmRpbmdIYW5nb3V0Om51bGwsXHJcbiAgbWVzc2FnZTogbnVsbFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5FUlJPUl9SRUNJRVZFRDpcclxuICAgICAgcmV0dXJuey4uLnN0YXRlLGVycm9yOmFjdGlvbi5lcnJvcn1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQ6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUscGVuZGluZ0hhbmdvdXQ6bnVsbH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHBlbmRpbmdIYW5nb3V0OmFjdGlvbi5wZW5kaW5nSGFuZ291dH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUOlxyXG4gICAgIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogbnVsbCB9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVEOlxyXG5cclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHVucmVhZGhhbmdvdXRzOiBhY3Rpb24udW5yZWFkaGFuZ291dHMgfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQ6XHJcblxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRDpcclxuICAgICBcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQ6XHJcbiAgXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogYWN0aW9uLm1lc3NhZ2VzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yLCBmZXRjaEhhbmdvdXRzOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBmZXRjaEhhbmdvdXRzOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzLCBmZXRjaEhhbmdvdXRzOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cclxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxyXG4gICAgICAgICksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0U6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzZWFyY2g6IGFjdGlvbi5zZWFyY2ggfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxyXG4gICAgICB9O1xyXG4gICAgLy9TT0NLRVRcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX0VSUk9SOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DT05ORUNUSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWTpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJcclxuICBleHBvcnQgY29uc3QgaGFuZ291dFN0YXRlcyA9IHtcclxuICAgIElOVklURVI6ICdJTlZJVEVSJyxcclxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxyXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXHJcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXHJcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxyXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJyxcclxuICAgLy8gYWNrbm93bGVnZW1lbnRcclxuICAgIElOVklURUQ6ICdJTlZJVEVEJyxcclxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxyXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXHJcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXHJcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxyXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCcsXHJcbiAgfTsiLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBuYW1lLCBkaXNwYXRjaCwgaGFuZ291dCwgb2ZmbGluZSwgb25BcHBSb3V0ZSB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSwgdGltZXN0YW1wIH0gPSBoYW5nb3V0O1xyXG5cclxuICBjb25zdCBkZWxpdmVyZWRIYW5nb3V0ID0geyAuLi5oYW5nb3V0LCBkZWxpdmVyZWQ6IHRydWUgfTtcclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkSGFuZ291dCk7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9VUERBVEVELCBoYW5nb3V0OiBkZWxpdmVyZWRIYW5nb3V0IH0pO1xyXG4gIGlmIChtZXNzYWdlKSB7XHJcblxyXG4gICAgdXBkYXRlRGVsaXZlcmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBuYW1lLCBkZWxpdmVyZWRIYW5nb3V0LGhhbmdvdXQgfSk7XHJcbiAgfVxyXG4gIGlmKGhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCcpe1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsbmFtZSxkZWxpdmVyZWRIYW5nb3V0fSlcclxuICB9XHJcbiAgaWYgKG9mZmxpbmUpIHtcclxuICAgIC8vcmVtb3ZlIG9mZmxpbmUgaGFuZ291dFxyXG4gICAgY29uc3Qgb2ZmbGluZUhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcclxuICAgIGNvbnN0IG9mZmxpbmVoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0ob2ZmbGluZUhhbmdvdXRLZXkpKTtcclxuXHJcbiAgICBpZiAob2ZmbGluZWhhbmdvdXRzKSB7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IG9mZmxpbmVoYW5nb3V0cy5maW5kSW5kZXgoXHJcbiAgICAgICAgKG8pID0+IG8udGltZXN0YW1wID09PSB0aW1lc3RhbXBcclxuICAgICAgKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgb2ZmbGluZUhhbmdvdXRLZXksXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkob2ZmbGluZWhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEpKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGVsaXZlcmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBuYW1lLCBkZWxpdmVyZWRIYW5nb3V0IH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xyXG5cclxuICBjb25zdCBkZWxpdmVyZWRNZXNzYWdlID0geyAuLi5tZXNzYWdlLCB1c2VybmFtZTogbmFtZSwgZGVsaXZlcmVkOiB0cnVlIH1cclxuXHJcbiAgLy8gc2F2ZSBtZXNzYWdlIHRvIGxvY2FsU3RvcmFnZVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBtZXNzYWdlcy5maW5kSW5kZXgoXHJcbiAgICAobSkgPT4gbS50aW1lc3RhbXAgPT09IG1lc3NhZ2UudGltZXN0YW1wXHJcbiAgKTtcclxuICBtZXNzYWdlcy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRNZXNzYWdlKTtcclxuICBcclxuXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJvY2tlZFN0YXRlKHtkaXNwYXRjaCxkZWxpdmVyZWRIYW5nb3V0LG5hbWV9KXtcclxuICBkZWJ1Z2dlcjtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xyXG4gIGNvbnN0IGJsb2NrZWRNZXNzYWdlID0geyB0aW1lc3RhbXA6ZGVsaXZlcmVkSGFuZ291dC50aW1lc3RhbXAsIHRleHQ6ICd5b3UgYmxvY2tlZCB0aGlzIHVzZXInLCB1c2VybmFtZTogbmFtZSwgdHlwZTogJ2Jsb2NrZWQnIH1cclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkoIFsuLi5tZXNzYWdlcyxibG9ja2VkTWVzc2FnZV0pKTtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczpbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdIH0pO1xyXG59IiwiaW1wb3J0IHsgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCB9IGZyb20gJy4vdXBkYXRlRGVsaXZlcmVkSGFuZ291dCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3NhZ2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZX0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWNjZXB0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb3ZrZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7aGFuZ291dFN0YXRlc30gIGZyb20gJ3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJ1xyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2lldmVkSGFuZ291dCh7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkLFxyXG59KSB7XHJcblxyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcblxyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcblxyXG4gXHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKGhnPT4gaGcudXNlcm5hbWU9PT11c2VybmFtZSlcclxuICAgIGlmKGhhbmdvdXRFeGlzdCl7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xyXG4gICAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcclxuICAgICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG4gICAgfS8vZW5kIG9mIGhhbmdvdXQgZXhpc3RcclxuZWxzZXtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbLi4uaGFuZ291dHMsXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbLi4uaGFuZ291dHMsXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogdXBkYXRlZEhhbmdvdXRzIH0pO1xyXG59XHJcblxyXG59ZWxzZXtcclxuXHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuXHJcbn1cclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULFxyXG4gICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgIH0pO1xyXG4gICAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XHJcbiAgICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuICAgIHNhdmVSZWNpZXZlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAodW5yZWFkKSB7XHJcblxyXG4gICAgc3dpdGNoKGhhbmdvdXQuc3RhdGUpe1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVSOlxyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSOlxyXG4gICAgICAgIHNhdmVVbnJlYWRIYW5nb3V0KHsgbmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiBcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2lldmVkTWVzc2FnZSh7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG59KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgLy8gc2F2ZSBtZXNzYWdlIHRvIGxvY2FsU3RvcmFnZVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gbnVsbDtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiBmYWxzZSB9XTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogdHJ1ZSB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFt7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiBmYWxzZSB9XTtcclxuICAgIH1cclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcblxyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIC8vIHN5bmMgbWVzc2FnZSB3aXRoIHJlZHVjZXIgc3RhdGVcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVVbnJlYWRIYW5nb3V0KHsgbmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcbiAgXHJcbiAgLy91cGRhdGUgdW5yZWFkIGhhbmdvdXRzXHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcclxuICBsZXQgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWR1bnJlYWRzID0gbnVsbDtcclxuICBpZiAodW5yZWFkaGFuZ291dHMpIHtcclxuICAgIHVwZGF0ZWR1bnJlYWRzID0gWy4uLnVucmVhZGhhbmdvdXRzLCB7Li4uaGFuZ291dCxyZWFkOmZhbHNlfV07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWR1bnJlYWRzID0gW3suLi5oYW5nb3V0LHJlYWQ6ZmFsc2V9XTtcclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWR1bnJlYWRzKSk7XHJcblxyXG4gIGRpc3BhdGNoKHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxyXG4gICAgdW5yZWFkaGFuZ291dHM6IHVwZGF0ZWR1bnJlYWRzLFxyXG4gIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IHNhdmVSZWNpZXZlZEhhbmdvdXQgfSBmcm9tICcuL3NhdmVSZWNpZXZlZEhhbmdvdXQnO1xyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcblxyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3Nhbmdlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCB9KSB7XHJcblxyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59IC8vIEVORCBzYXZlTWVzc2FuZ2VyXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVVuYmxvY2tlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuICBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJ3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJztcclxuaW1wb3J0IHtcclxuICBzYXZlSW52aXRlZCxcclxuICBzYXZlVW5ibG92a2VkLFxyXG4gIHNhdmVEZWNsaW5lZCxcclxuICBzYXZlQmxvY2tlZCxcclxuICBzYXZlQWNjZXB0ZWQsXHJcbiAgc2F2ZU1lc3NhZ2VkLFxyXG59IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMnO1xyXG5pbXBvcnQge1xyXG4gIHNhdmVBY2NlcHRlcixcclxuICBzYXZlQmxvY2tlcixcclxuICBzYXZlRGVjbGluZXIsXHJcbiAgc2F2ZUludml0ZXIsXHJcbiAgc2F2ZU1lc3NhbmdlcixcclxuICBzYXZlVW5ibG9ja2VyLFxyXG59IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZXNzYWdlKHtcclxuICBtZXNzYWdlLFxyXG4gIHVzZXJuYW1lLFxyXG4gIGRpc3BhdGNoLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG59KSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQsb2ZmbGluZSB9KSB7XHJcbiAgICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURUQ6XHJcbiAgICAgXHJcbiAgICAgICAgc2F2ZUludml0ZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRDpcclxuICAgICAgICBzYXZlVW5ibG92a2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FRDpcclxuICAgICAgICBzYXZlRGVjbGluZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRUQ6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZUJsb2NrZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVEOlxyXG4gICAgICAgIHNhdmVBY2NlcHRlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxyXG4gICAgICAgXHJcbiAgICAgICAgc2F2ZU1lc3NhZ2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCwgdW5yZWFkIH0pIHtcclxuICAgIFxyXG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFUjpcclxuICAgICAgICBzYXZlQWNjZXB0ZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFUjpcclxuICAgICAgIFxyXG4gICAgICAgIHNhdmVCbG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FUjpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlRGVjbGluZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XHJcbiAgICAgICAgc2F2ZUludml0ZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcclxuICAgICAgICBzYXZlTWVzc2FuZ2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRVI6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZVVuYmxvY2tlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0cyB9KSB7XHJcbiAgICBoYW5nb3V0cy5mb3JFYWNoKChoYW5nb3V0KSA9PiB7XHJcbiAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0LHVucmVhZDp0cnVlIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKG1lc3NhZ2UgJiYgdXNlcm5hbWUpIHtcclxuIFxyXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ0FDS0hPV0xFREdFTUVOVCc6XHJcblxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6ZmFsc2UgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdIQU5HT1VUJzpcclxuXHJcbiAgICAgICAgICBpZihmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT1tZXNzYWdlLmhhbmdvdXQudXNlcm5hbWUpe1xyXG4gICBcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCx1bnJlYWQ6ZmFsc2UgfSk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgIFxyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LHVucmVhZDp0cnVlIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1VOUkVBRF9IQU5HT1VUUyc6XHJcbiAgIFxyXG4gICAgICAgICAgaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0czogbWVzc2FnZS5oYW5nb3V0cyB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ09GRkxJTkVfQUNLTic6XHJcbiAgICAgICBcclxuICAgICAgICAgIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCxvZmZsaW5lOnRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbbWVzc2FnZSwgdXNlcm5hbWVdKTtcclxuXHJcbiAgcmV0dXJuIHt9O1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xyXG5cclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XHJcbn1cclxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCB9KSB7XHJcblxyXG4gXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCBoYW5nb3V0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pe1xyXG4gIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNMRUFSRURfSEFOR09VVH0pXHJcbn0gXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHtkaXNwYXRjaCxoYW5nb3V0fSl7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcclxufVxyXG5cclxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4vLyAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xyXG4vLyB9XHJcbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XHJcbn1cclxuXHJcbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcclxuICAgICk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcclxuICBcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tJHtoYW5nb3V0LnVzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy9FTkQgc2F2ZUludml0ZXJcclxuXHJcblxyXG5cclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuXHJcbiAgVkFMVUVfQ0hBTkdFRDogJ1ZBTFVFX0NIQU5HRUQnLFxyXG4gIExPR0lOX1NUQVJURUQ6ICdMT0dJTl9TVEFSVEVEJyxcclxuICBMT0dJTl9TVUNDRVNTOiAnTE9HSU5fU1VDQ0VTUycsXHJcbiAgTE9HSU5fRkFJTEVEOiAnTE9HSU5fRkFJTEVEJyxcclxuXHJcbiAgTE9HT1VUOiAnTE9HT1VUJyxcclxuXHJcblxyXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxyXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxyXG4gIFNJR05VUF9GQUlMRUQ6ICdTSUdOVVBfRkFJTEVEJyxcclxuXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6ICdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxyXG5cclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXHJcblxyXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogJ0dPVF9UT0tFTl9GUk9NX1VSTCcsXHJcblxyXG4gIFJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTogJ1JFQ09WRVJfTE9DQUxfQVVUSF9TVEFURScsXHJcbiAgXHJcbiAgU0VSVkVSX0VSUk9SX1JFQ0lFVkVEOidTRVJWRVJfRVJST1JfUkVDSUVWRUQnLFxyXG5cclxuICBDT05TVFJBSU5UX1ZBTElEQVRJT046J0NPTlNUUkFJTlRfVkFMSURBVElPTidcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGxvZ2luOiBmYWxzZSxcclxuICBzaWdudXA6IGZhbHNlLFxyXG4gIGNoYW5nZVBhc3N3b3JkOiBmYWxzZSxcclxuICByZXF1ZXN0UGFzc0NoYW5nZTogZmFsc2UsXHJcbiAgdmFsaWRhdGlvbjoge1xyXG4gICAgdXNlcm5hbWU6IHsgaXNWYWxpZDogdW5kZWZpbmVkLCBtZXNzYWdlOiAnJyB9LFxyXG4gICAgZW1haWw6IHsgaXNWYWxpZDogdW5kZWZpbmVkLCBtZXNzYWdlOiAnJyB9LFxyXG4gICAgcGFzc3dvcmQ6IHsgaXNWYWxpZDogdW5kZWZpbmVkLCBtZXNzYWdlOiAnJyB9LFxyXG4gICAgY29uZmlybToge1xyXG4gICAgICBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnLFxyXG4gICAgIFxyXG4gICAgfSwgZW1haWxvcnVzZXJuYW1lOiB7IGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogJycgfVxyXG4gIH0sXHJcbiAgZW1haWw6ICcnLFxyXG4gIHBhc3N3b3JkOiAnJyxcclxuICBzdWNjZXNzOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICB1c2VybmFtZTogJycsXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgY29uZmlybTogJycsXHJcbiAgY3VycmVudDogJycsXHJcbiAgZW1haWxvcnVzZXJuYW1lOiAnJyxcclxuICB0b2tlbjogbnVsbCxcclxuICBhdXRoRmVlZGJhY2s6IG51bGwsXHJcbiAgdXNlcjogbnVsbFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9FUlJPUl9SRUNJRVZFRDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgZXJyb3I6YWN0aW9uLmVycm9yfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWxpZGF0aW9uOnsuLi5zdGF0ZS52YWxpZGF0aW9uLCBbYWN0aW9uLm5hbWVdOiB7IGlzVmFsaWQ6IGFjdGlvbi5pc1ZhbGlkLCBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSB9IH19XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XHJcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBbYWN0aW9uLm5hbWVdOiBhY3Rpb24udmFsdWUsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSwgbG9naW46IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXI6IGFjdGlvbi51c2VyLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICBcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGxvZ2luOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIHNpZ251cDogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyOiBhY3Rpb24udXNlcixcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc2lnbnVwOmZhbHNlXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSxzaWdudXA6ZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBjaGFuZ2VQYXNzd29yZDogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyOiBhY3Rpb24udXNlcixcclxuICAgICAgICBjaGFuZ2VQYXNzd29yZDpmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsY2hhbmdlUGFzc3dvcmQ6ZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSwgcmVxdWVzdFBhc3NDaGFuZ2U6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHJlcXVlc3RQYXNzQ2hhbmdlOiBmYWxzZSxcclxuICAgICBcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgICByZXF1ZXN0UGFzc0NoYW5nZTogZmFsc2UsfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVQ6XHJcbiAgICAgIHJldHVybiB7IC4uLmluaXRTdGF0ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdXNlcjogYWN0aW9uLnVzZXJcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIGFjY291bnRBbHJlYWR5RXhpdHM6MjAyLFxyXG4gIC8vbG9naW5cclxuICBjcmVkZW50aWFsSW52YWxpZDogJzQwMScsXHJcbiAgLy9zaWdudXBcclxuICB1c2VybmFtZUlzVGFrZW46ICc0MDInLFxyXG4gIGVtYWlsSXNSZWdpc3RlcmVkOiAnNDAzJyxcclxuICB1c2VybmFtZUludmFsaWQ6ICc0MDUnLFxyXG4gIHBhc3N3b3JkSW52YWxpZDogJzQwNicsIC8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgZW1haWxJbnZhbGlkOiAnNDA3JyxcclxuICAvL2xvZ2luXHJcbiAgZW1haWxJc05vdFJlZ2lzdGVyZWQ6ICc0MDgnLFxyXG4gIGVtcHR5UGFzc3dvcmROb3RWYWxpZDogJzQwOScsXHJcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXHJcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXHJcbi8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxyXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcclxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XHJcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIElOVkFMSURfUEFTU1dPUkQ6XHJcbiAgICAnYXQgbGVhc3QgOCBjaGFyYWN0ZXJzLCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMSB1cHBlcmNhc2UgbGV0dGVyLCAxIGxvd2VyY2FzZSBsZXR0ZXIsIENhbiBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycycsXHJcbiAgSU5WQUxJRF9FTUFJTDogJ2VtYWlsIGZvcm1hdCBpcyBub3QgdmFsaWQnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnZW1haWwgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOiAndXNlcm5hbWUgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUU6XHJcbiAgICAnb25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWQnLFxyXG4gIElOVkFMSURfRU1QVFlfU1RSSU5HOiAnUmVxdWlyZWQgZmllbGQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUw6ICdlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWQnLFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdpbnZhbGlkIGNyZWRlbnRpYWxzIHByb3ZpZGVkJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ3VzZXJuYW1lIGlzIGFscmVhZHkgdGFrZW4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnLFxyXG4gIFBBU1NXT1JEU19ET19OT1RfTUFUQ0g6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJyxcclxuICBBQ0NPVU5UX0FMUkVBRFlfRVhJU1RTOidBY2NvdW50IGFscmVhZHkgZXhpc3RzIGZvciB0aGlzIHVzZXJuYW1lLicsXHJcbiAgUkVRVUlSRURfRklFTEQ6J1JlcXVpcmVkIGZpZWxkJ1xyXG59O1xyXG4iLCJcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi4vc3RhdGUvYWN0aW9uVHlwZXMnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwLCBkaXNwYXRjaCB9KSB7XHJcbiAgZGVidWdnZXJcclxuICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgY2FzZSAxMDE6XHJcbiAgICBjYXNlIDIwMDpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5jcmVkZW50aWFsSW52YWxpZDpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9DUkVERU5USUFMUyB9KVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2VtYWlsb3J1c2VybmFtZScsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9DUkVERU5USUFMUyB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMTI1OlxyXG4gICAgY2FzZSAtMzpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbEludmFsaWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnZW1haWwnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxyXG4gICAgY2FzZSAtNDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUludmFsaWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAndXNlcm5hbWUnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDIwMzpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzUmVnaXN0ZXJlZDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdlbWFpbCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMjAyOi8vcGFyc2VcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzVGFrZW46XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAndXNlcm5hbWUnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX1RBS0VOIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtcHR5UGFzc3dvcmROb3RWYWxpZDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVRVUlSRURfRklFTEQgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmREb05vdE1hdGNoOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3Bhc3N3b3JkJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENIIH0pXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnY29uZmlybScsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VybmFtZVJlZ2V4ID0gL1thLXpBLVpdK1stX10qW2EtekEtWl0rL2c7XHJcbiIsIlxyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuaW1wb3J0IHsgZW1haWxSZWdleCwgcGFzc3dvcmRSZWdleCwgdXNlcm5hbWVSZWdleCB9IGZyb20gJy4vdmFsaWRhdGlvblJlZ2V4JztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxDb25zdHJhaW50KHsgZW1haWwgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdChlbWFpbCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlzVmFsaWQ6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XHJcbiAgY29uc3QgcGFzc3dvcmRDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChwYXNzd29yZFJlZ2V4KTtcclxuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG5lbHNle1xyXG4gICAgcmV0dXJuIHtcclxuICAgICBcclxuICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgfTtcclxuICBcclxufX1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pIHtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICBcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgXHJcbiAgICAgIGlzVmFsaWQ6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgIGlzVmFsaWQ6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSkge1xyXG5cclxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtIH0gPWF1dGg7XHJcblxyXG4gIGlmIChwYXNzd29yZCA9PT0gJycgfHwgcGFzc3dvcmQgIT09IGNvbmZpcm0pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlzVmFsaWQ6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICBcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1wdHlTdHJpbmcgKHt2YWx1ZX0pe1xyXG4gIGlmKHZhbHVlLmxlbmd0aD09PTApe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFUVVJUkVEX0ZJRUxELFxyXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgIH07XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBtZXNzYWdlOicnLFxyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgfTtcclxuICB9XHJcbn0iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi4vLi4vc3RhdGUvYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgc2VydmVyVmFsaWRhdGlvbiBmcm9tICcuLi8uLi92YWxpZGF0aW9uL3NlcnZlckVycm9yQWN0aW9ucydcclxuaW1wb3J0ICogYXMgY3YgZnJvbSAnLi4vLi4vdmFsaWRhdGlvbi9jb25zdHJhaW50VmFsaWRhdG9ycydcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgcGFzc3dvcmQsIGVtYWlsIH0gPSBzdGF0ZVxyXG4gIGlmICh1c2VybmFtZSAmJiBwYXNzd29yZCAmJiBlbWFpbCAmJiBjdi52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pICYmIGN2LnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHsgZW1haWwgfSkgJiYgY3YudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSkge1xyXG4gICAgdHJ5IHtcclxuZGVidWdnZXI7XHJcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgdXNlciBjbGFzc1xyXG4gICAgICB2YXIgdXNlciA9IG5ldyBQYXJzZS5Vc2VyKCk7XHJcbiAgICAgIHVzZXIuc2V0KFwidXNlcm5hbWVcIiwgdXNlcm5hbWUpO1xyXG4gICAgICB1c2VyLnNldChcInBhc3N3b3JkXCIsIHBhc3N3b3JkKTtcclxuICAgICAgdXNlci5zZXQoXCJlbWFpbFwiLCBlbWFpbCk7XHJcbiAgICAgIGxldCBzdWNjZXNzID0gYXdhaXQgdXNlci5zaWduVXAoKVxyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW46IHN1Y2Nlc3MuZ2V0KCdzZXNzaW9uVG9rZW4nKSxcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgICBvYmplY3RJZDogc3VjY2Vzcy5pZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBjb25zdCBIYW5nb3V0VXNlciA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0VXNlclwiKTtcclxuICAgICAgY29uc3QgaGFuZ291dFVzZXIgPSBuZXcgSGFuZ291dFVzZXIoKTtcclxuICAgICAgaGFuZ291dFVzZXIuc2V0KCd1c2VybmFtZScsIHVzZXJuYW1lKVxyXG4gICAgICBoYW5nb3V0VXNlci5zZXQoJ2VtYWlsJywgZW1haWwpXHJcbiAgICAgIGhhbmdvdXRVc2VyLnNldCgndXNlcmlkJywgc3VjY2Vzcy5pZClcclxuICAgICAgYXdhaXQgaGFuZ291dFVzZXIuc2F2ZSgpXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHVzZXI6IHsgdXNlcm5hbWUsIGVtYWlsLCB0b2tlbjogc3VjY2Vzcy5nZXQoJ3Nlc3Npb25Ub2tlbicpLCBvYmplY3RJZDogc3VjY2Vzcy5pZCB9IH0pXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBkZWJ1Z2dlclxyXG4gICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6ZXJyb3IuY29kZSxkaXNwYXRjaH0pXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVELGVycm9yIH0pO1xyXG4gICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEfSlcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTondXNlcm5hbWUnLC4uLmN2LnZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHt1c2VybmFtZX0pfSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixuYW1lOidlbWFpbCcsLi4uY3YudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoe2VtYWlsfSl9KVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLG5hbWU6J3Bhc3N3b3JkJywuLi5jdi52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7cGFzc3dvcmR9KX0pXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEfSlcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlXHJcblxyXG4gIGlmKGVtYWlsb3J1c2VybmFtZSAmJiBwYXNzd29yZCl7XHJcbiAgICBkZWJ1Z2dlclxyXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSB1c2VyIGNsYXNzXHJcbiAgICBQYXJzZS5Vc2VyLmxvZ0luKGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgbGV0IHVzZXJuYW1lID0gdXNlci5nZXQoXCJ1c2VybmFtZVwiKVxyXG4gICAgICBsZXQgZW1haWwgPSB1c2VyLmdldChcImVtYWlsXCIpXHJcbiAgICAgIGxldCB0b2tlbiA9IHVzZXIuZ2V0KCdzZXNzaW9uVG9rZW4nKVxyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgb2JqZWN0SWQ6IHVzZXIuaWRcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gIFxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsIHVzZXI6IHsgdXNlcm5hbWUsIGVtYWlsLCB0b2tlbiwgb2JqZWN0SWQ6IHVzZXIuaWQgfSB9KVxyXG4gICAgICBjb25zb2xlLmxvZygnVXNlciBjcmVhdGVkIHN1Y2Nlc3NmdWwgd2l0aCBuYW1lOiAnICsgdXNlci5nZXQoXCJ1c2VybmFtZVwiKSArICcgYW5kIGVtYWlsOiAnICsgdXNlci5nZXQoXCJlbWFpbFwiKSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvci5jb2RlLGRpc3BhdGNofSlcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQsZXJyb3IgfSk7XHJcbiAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRH0pXHJcbiAgICB9KTtcclxuICB9ZWxzZXtcclxuICAgIC8vZW1wdHkgZW1haWxvcnVzZXJuYW1lIG9yIHBhc3N3b3JkXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sbmFtZTonZW1haWxvcnVzZXJuYW1lJywuLi5jdi52YWxpZGF0ZUVtcHR5U3RyaW5nKHt2YWx1ZTplbWFpbG9ydXNlcm5hbWV9KX0pXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sbmFtZToncGFzc3dvcmQnLC4uLmN2LnZhbGlkYXRlRW1wdHlTdHJpbmcoe3ZhbHVlOnBhc3N3b3JkfSl9KVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEfSlcclxuXHJcbiAgfVxyXG4gXHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XHJcbiAgY29uc3QgeyBlbWFpbCB9ID0gc3RhdGU7XHJcblxyXG4gIFBhcnNlLlVzZXIucmVxdWVzdFBhc3N3b3JkUmVzZXQoZW1haWwpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxyXG4gICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICBtZXNzYWdlOiBgQSBsaW5rIGZvciBwYXNzd29yZCBjaGFuZ2UgIGhhcyBiZWVuIHNlbnQgdG8sICR7ZW1haWx9ISBgLFxyXG4gICAgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIlBhc3N3b3JkIHJlc2V0IHJlcXVlc3Qgd2FzIHNlbnQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgLy8gZm9ybURpc3BhdGNoKHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvci5jb2RlfSkpXHJcblxyXG4gICAgY29uc29sZS5sb2coXCJUaGUgbG9naW4gZmFpbGVkIHdpdGggZXJyb3I6IFwiICsgZXJyb3IuY29kZSArIFwiIFwiICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgfSk7XHJcbn0iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBhcnNlQXV0aFNlcnZpY2UgKHtjaGlsZHJlbixzdGF0ZSxkaXNwYXRjaH0pe1xyXG5jb25zdCB7IGxvZ2luLHNpZ251cCwgY2hhbmdlUGFzc3dvcmQscmVxdWVzdFBhc3NDaGFuZ2V9ID1zdGF0ZVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgICAgIGlmKGxvZ2luKXtcclxuICAgICAgICAgICAgYWN0aW9ucy5sb2dpbih7ZGlzcGF0Y2gsc3RhdGV9KVxyXG4gICAgICAgIH1cclxuICAgIH0sW2xvZ2luXSlcclxuXHJcbiAgICB1c2VFZmZlY3QoKCk9PntcclxuICAgICAgICBpZihzaWdudXApe1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgYWN0aW9ucy5zaWdudXAoe2Rpc3BhdGNoLHN0YXRlfSlcclxuICAgICAgICB9XHJcbiAgICB9LFtzaWdudXBdKVxyXG5cclxuICBcclxuXHJcbiAgICB1c2VFZmZlY3QoKCk9PntcclxuICAgICAgICBpZihyZXF1ZXN0UGFzc0NoYW5nZSl7XHJcbiAgICAgICAgICAgIGFjdGlvbnMuZm9yZ290UGFzc3dvcmQoe2Rpc3BhdGNoLHN0YXRlfSlcclxuICAgICAgICB9XHJcbiAgICB9LFtyZXF1ZXN0UGFzc0NoYW5nZV0pXHJcbiAgICByZXR1cm4gY2hpbGRyZW5cclxuXHJcbn0iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IFBhcnNlQXV0aFNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvcGFyc2UvUGFyc2VBdXRoU2VydmljZSdcclxuaW1wb3J0IE5vZGVBdXRoU2VyaWNlIGZyb20gJy4uL3NlcnZpY2VzL25vZGVqcy9Ob2RlQXV0aFNlcnZpY2UnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhBZGFwdGVyIChwcm9wcyl7XHJcbiAgICBpZiAoUFJFQUNUX0FQUF9CQUNLID09PSAnUFJFQUNUX0FQUF9QQVJTRScpIHtcclxuICAgICAgICByZXR1cm4gPFBhcnNlQXV0aFNlcnZpY2Ugey4uLnByb3BzfSAvPlxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoUFJFQUNUX0FQUF9CQUNLID09PSAnUFJFQUNUX0FQUF9OT0RFSlMnKSB7XHJcbiAgICAgICAgcmV0dXJuIDxOb2RlQXV0aFNlcmljZSB7Li4ucHJvcHN9IC8+XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGxcclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2F1dGhSZWR1Y2VyJztcclxuaW1wb3J0IEF1dGhBZGFwdGVyIGZyb20gJy4vQXV0aEFkYXB0ZXInXHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXRlLFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgfTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfT5cclxuICAgICAgPEF1dGhBZGFwdGVyIHN0YXRlPXtzdGF0ZX0gZGlzcGF0Y2g9e2Rpc3BhdGNofT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgICA8L0F1dGhBZGFwdGVyPlxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5cclxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9BdXRoUHJvdmlkZXInO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlVXNlck5hbWUoKSB7XHJcbiAgY29uc3QgW3VzZXJOYW1lLCBzZXRVc2VybmFtZV0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbdG9rZW4sIHNldFRva2VuXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtvYmplY3RJZCwgc2V0T2JqZWN0SWRdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIFxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpIHtcclxuXHJcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCxvYmplY3RJZCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICAgIHNldE9iamVjdElkKG9iamVjdElkKVxyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzdGF0ZS51c2VyICYmIHN0YXRlLnVzZXIudG9rZW4pIHtcclxuICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwsIHRva2VuLG9iamVjdElkIH0gPXN0YXRlLnVzZXI7XHJcbiAgXHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICAgIHNldE9iamVjdElkKG9iamVjdElkKVxyXG4gICAgfVxyXG4gIH0sIFtzdGF0ZS51c2VyXSk7XHJcblxyXG51c2VFZmZlY3QoKCk9PntcclxuICBpZihzdGF0ZSAmJiBzdGF0ZS51c2VyPT09bnVsbCl7XHJcbiAgICBzZXRVc2VybmFtZShudWxsKTtcclxuICAgIHNldFRva2VuKG51bGwpO1xyXG4gICAgc2V0RW1haWwobnVsbCk7XHJcbiAgICBzZXRPYmplY3RJZChudWxsKVxyXG4gIH1cclxufSxbc3RhdGVdKVxyXG4gIHJldHVybiB7IHVzZXJuYW1lOiB1c2VyTmFtZSwgdG9rZW4sIGVtYWlsIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgLy8gc2V0IHJlYWQgdG8gdHJ1ZSBvbiB1bnJlYWQgaGFuZ291dHNcclxuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gIGNvbnN0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG5cclxuICBpZiAodW5yZWFkaGFuZ291dHMmJiB1bnJlYWRoYW5nb3V0cy5sZW5ndGg+MCkge1xyXG4gICAgXHJcbiAgICBsZXQgdXBkYXRlZHVucmVhZCA9IHVucmVhZGhhbmdvdXRzLm1hcCh1ID0+IHtcclxuICAgICAgaWYgKHUudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHsgLi4udSwgcmVhZDogdHJ1ZSB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZHVucmVhZCkpO1xyXG5kaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCx1bnJlYWRoYW5nb3V0czp1cGRhdGVkdW5yZWFkfSlcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgLy8gc2V0IGhhbmdvdXQgdG8gcmVhZFxyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7IC4uLmhhbmdvdXQsIHJlYWQ6IHRydWUgfSk7XHJcbiAgLy9cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcblxyXG4gIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgdXBkYXRlUmVhZE1lc3NzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlYWRNZXNzc2FnZXMoeyBoYW5nb3V0LCBuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgY29uc3QgdXBkYXRlZE1lc3NhZ2VzID0gbWVzc2FnZXMubWFwKChtKSA9PiB7XHJcbiAgICByZXR1cm4geyAuLi5tLCByZWFkOiB0cnVlIH07XHJcbiAgfSk7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge1xyXG4gIHVzZUNvbnRleHQsXHJcbiAgdXNlTWVtbyxcclxuICB1c2VSZWR1Y2VyLFxyXG4gIHVzZUVmZmVjdCxcclxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xyXG5pbXBvcnQge3VzZU1lc3NhZ2V9IGZyb20gJy4vdXNlTWVzc2FnZSdcclxuXHJcbmltcG9ydCB7XHJcbiAgbG9hZEhhbmdvdXRzLFxyXG4gIGxvYWRNZXNzYWdlcywgXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHt1c2VVc2VyTmFtZX0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvdXNlVXNlck5hbWUnXHJcbmltcG9ydCB7IHVwZGF0ZVJlYWRIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy91cGRhdGVSZWFkSGFuZ291dHMnO1xyXG5cclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XHJcbiBjb25zdCB7dXNlcm5hbWUsdG9rZW59PXVzZVVzZXJOYW1lKClcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgeyBoYW5nb3V0LG1lc3NhZ2UgfSA9IHN0YXRlO1xyXG4gIGNvbnN0IGhhbmRsZU1lc3NhZ2UgPXVzZU1lc3NhZ2Uoe21lc3NhZ2UsdXNlcm5hbWUsZGlzcGF0Y2gsZm9jdXNlZEhhbmdvdXQ6aGFuZ291dH0pXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3VzZXJuYW1lXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSAmJiB0b2tlbikge1xyXG4gICAgIFxyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaGFuZ291dCAmJiB1c2VybmFtZSkge1xyXG4gIFxyXG4gICAgICAvL2Zyb20gbG9jYWwgc3RvcmFnZVxyXG4gICAgICBsb2FkTWVzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XHJcblxyXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcclxuICAgICAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYDtcclxuICAgICAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxyXG4gICAgICAgICAgKGcpID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWVcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcclxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFoYW5nb3V0LnJlYWQpIHtcclxuICAgICBcclxuICAgICBcclxuICAgICAgICB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZTogdXNlcm5hbWUgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbaGFuZ291dCwgdXNlcm5hbWVdKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vQXV0aFByb3ZpZGVyJ1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuaW1wb3J0ICogYXMgY3YgZnJvbSAnLi4vdmFsaWRhdGlvbi9jb25zdHJhaW50VmFsaWRhdG9ycydcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGgoKSB7XHJcbiAgICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKVxyXG4gICAgZnVuY3Rpb24gb25DaGFuZ2UoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELCBuYW1lLCB2YWx1ZSB9KVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb25Mb2dpbigpIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG9uU2lnbnVwKCkge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlKCkge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBvblBhc3N3b3JkQ2hhbmdlKCkge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvblNpZ25PdXQoKSB7XHJcbiAgICAgICBcclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2ViY29tJylcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVCB9KVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb25Mb2dpbkJsdXIoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCB9ID0gc3RhdGVcclxuICAgICAgICBjb25zdCB7IG5hbWUgfSA9IGUudGFyZ2V0XHJcbiAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSAncGFzc3dvcmQnOlxyXG4gICAgICAgICAgICAgICAgaWYgKHBhc3N3b3JkID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogJ1JlcXVpcmVkIGZpZWxkJyB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2VtYWlsb3J1c2VybmFtZSc6XHJcbiAgICAgICAgICAgICAgIC8vIGlmIChlbWFpbG9ydXNlcm5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdlbWFpbG9ydXNlcm5hbWUnLCAuLi5jdi52YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7dmFsdWU6ZW1haWxvcnVzZXJuYW1lfSkgfSlcclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uTG9naW5CbHVyIGVycm9yJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25TaWdudXBCbHVyKGUpIHtcclxuICAgICAgICBjb25zdCB7IGVtYWlsLCB1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlXHJcbiAgICAgICAgY29uc3QgeyBuYW1lIH0gPSBlLnRhcmdldFxyXG4gICAgIFxyXG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdwYXNzd29yZCc6XHJcblxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIC4uLmN2LnZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnZW1haWwnLCAuLi5jdi52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3VzZXJuYW1lJzpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAndXNlcm5hbWUnLCAuLi5jdi52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pIH0pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb25Mb2dpbkJsdXIgZXJyb3InKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbkNoYW5nZVBhc3NCbHVyKCkgeyB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIoKSB7IH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbkZvY3VzKGUpIHtcclxuICAgICAgICBjb25zdCB7IG5hbWUgfSA9IGUudGFyZ2V0XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWUsIGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogJycgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyBzdGF0ZSwgb25Gb2N1cywgb25Mb2dpbkJsdXIsIG9uU2lnbnVwQmx1ciwgb25DaGFuZ2VQYXNzQmx1ciwgb25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIsIGRpc3BhdGNoLCBvbkxvZ2luLCBvblNpZ251cCwgb25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UsIG9uUGFzc3dvcmRDaGFuZ2UsIG9uQ2hhbmdlLCBvblNpZ25PdXQgfVxyXG59IiwiaW1wb3J0e3VzZVN0YXRlIGFzIG4sdXNlUmVkdWNlciBhcyB0LHVzZUVmZmVjdCBhcyBlLHVzZUxheW91dEVmZmVjdCBhcyByLHVzZVJlZiBhcyBvLHVzZUltcGVyYXRpdmVIYW5kbGUgYXMgdSx1c2VNZW1vIGFzIGksdXNlQ2FsbGJhY2sgYXMgZix1c2VDb250ZXh0IGFzIGMsdXNlRGVidWdWYWx1ZSBhcyBhfWZyb21cInByZWFjdC9ob29rc1wiO2V4cG9ydCpmcm9tXCJwcmVhY3QvaG9va3NcIjtpbXBvcnR7Q29tcG9uZW50IGFzIGwsY3JlYXRlRWxlbWVudCBhcyBzLG9wdGlvbnMgYXMgdix0b0NoaWxkQXJyYXkgYXMgaCxoeWRyYXRlIGFzIHAscmVuZGVyIGFzIGQsX3VubW91bnQgYXMgbSxjbG9uZUVsZW1lbnQgYXMgeSxjcmVhdGVSZWYgYXMgYixjcmVhdGVDb250ZXh0IGFzIGcsRnJhZ21lbnQgYXMgeH1mcm9tXCJwcmVhY3RcIjtleHBvcnR7Y3JlYXRlRWxlbWVudCxjcmVhdGVDb250ZXh0LGNyZWF0ZVJlZixGcmFnbWVudCxDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7ZnVuY3Rpb24gRShuLHQpe2Zvcih2YXIgZSBpbiB0KW5bZV09dFtlXTtyZXR1cm4gbn1mdW5jdGlvbiB3KG4sdCl7Zm9yKHZhciBlIGluIG4paWYoXCJfX3NvdXJjZVwiIT09ZSYmIShlIGluIHQpKXJldHVybiEwO2Zvcih2YXIgciBpbiB0KWlmKFwiX19zb3VyY2VcIiE9PXImJm5bcl0hPT10W3JdKXJldHVybiEwO3JldHVybiExfXZhciBDPWZ1bmN0aW9uKG4pe3ZhciB0LGU7ZnVuY3Rpb24gcih0KXt2YXIgZTtyZXR1cm4oZT1uLmNhbGwodGhpcyx0KXx8dGhpcykuaXNQdXJlUmVhY3RDb21wb25lbnQ9ITAsZX1yZXR1cm4gZT1uLCh0PXIpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuX19wcm90b19fPWUsci5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHcodGhpcy5wcm9wcyxuKXx8dyh0aGlzLnN0YXRlLHQpfSxyfShsKTtmdW5jdGlvbiBfKG4sdCl7ZnVuY3Rpb24gZShuKXt2YXIgZT10aGlzLnByb3BzLnJlZixyPWU9PW4ucmVmO3JldHVybiFyJiZlJiYoZS5jYWxsP2UobnVsbCk6ZS5jdXJyZW50PW51bGwpLHQ/IXQodGhpcy5wcm9wcyxuKXx8IXI6dyh0aGlzLnByb3BzLG4pfWZ1bmN0aW9uIHIodCl7cmV0dXJuIHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWUscyhuLEUoe30sdCkpfXJldHVybiByLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PSEwLHIuZGlzcGxheU5hbWU9XCJNZW1vKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHIudD0hMCxyfXZhciBBPXYuX19iO2Z1bmN0aW9uIFMobil7ZnVuY3Rpb24gdCh0KXt2YXIgZT1FKHt9LHQpO3JldHVybiBkZWxldGUgZS5yZWYsbihlLHQucmVmKX1yZXR1cm4gdC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD10LnQ9ITAsdC5kaXNwbGF5TmFtZT1cIkZvcndhcmRSZWYoXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsdH12Ll9fYj1mdW5jdGlvbihuKXtuLnR5cGUmJm4udHlwZS50JiZuLnJlZiYmKG4ucHJvcHMucmVmPW4ucmVmLG4ucmVmPW51bGwpLEEmJkEobil9O3ZhciBrPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/aChuKS5yZWR1Y2UoZnVuY3Rpb24obixlLHIpe3JldHVybiBuLmNvbmNhdCh0KGUscikpfSxbXSk6bnVsbH0sUj17bWFwOmssZm9yRWFjaDprLGNvdW50OmZ1bmN0aW9uKG4pe3JldHVybiBuP2gobikubGVuZ3RoOjB9LG9ubHk6ZnVuY3Rpb24obil7aWYoMSE9PShuPWgobikpLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZHJlbi5vbmx5KCkgZXhwZWN0cyBvbmx5IG9uZSBjaGlsZC5cIik7cmV0dXJuIG5bMF19LHRvQXJyYXk6aH0sRj12Ll9fZTtmdW5jdGlvbiBOKG4pe3JldHVybiBuJiYoKG49RSh7fSxuKSkuX19jPW51bGwsbi5fX2s9bi5fX2smJm4uX19rLm1hcChOKSksbn1mdW5jdGlvbiBVKCl7dGhpcy5fX3U9MCx0aGlzLm89bnVsbCx0aGlzLl9fYj1udWxsfWZ1bmN0aW9uIE0obil7dmFyIHQ9bi5fXy5fX2M7cmV0dXJuIHQmJnQudSYmdC51KG4pfWZ1bmN0aW9uIEwobil7dmFyIHQsZSxyO2Z1bmN0aW9uIG8obyl7aWYodHx8KHQ9bigpKS50aGVuKGZ1bmN0aW9uKG4pe2U9bi5kZWZhdWx0fHxufSxmdW5jdGlvbihuKXtyPW59KSxyKXRocm93IHI7aWYoIWUpdGhyb3cgdDtyZXR1cm4gcyhlLG8pfXJldHVybiBvLmRpc3BsYXlOYW1lPVwiTGF6eVwiLG8udD0hMCxvfWZ1bmN0aW9uIE8oKXt0aGlzLmk9bnVsbCx0aGlzLmw9bnVsbH12Ll9fZT1mdW5jdGlvbihuLHQsZSl7aWYobi50aGVuKWZvcih2YXIgcixvPXQ7bz1vLl9fOylpZigocj1vLl9fYykmJnIuX19jKXJldHVybiByLl9fYyhuLHQuX19jKTtGKG4sdCxlKX0sKFUucHJvdG90eXBlPW5ldyBsKS5fX2M9ZnVuY3Rpb24obix0KXt2YXIgZT10aGlzO251bGw9PWUubyYmKGUubz1bXSksZS5vLnB1c2godCk7dmFyIHI9TShlLl9fdiksbz0hMSx1PWZ1bmN0aW9uKCl7b3x8KG89ITAscj9yKGkpOmkoKSl9O3QuX19jPXQuY29tcG9uZW50V2lsbFVubW91bnQsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3UoKSx0Ll9fYyYmdC5fX2MoKX07dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbjtpZighLS1lLl9fdSlmb3IoZS5fX3YuX19rWzBdPWUuc3RhdGUudSxlLnNldFN0YXRlKHt1OmUuX19iPW51bGx9KTtuPWUuby5wb3AoKTspbi5mb3JjZVVwZGF0ZSgpfTtlLl9fdSsrfHxlLnNldFN0YXRlKHt1OmUuX19iPWUuX192Ll9fa1swXX0pLG4udGhlbih1LHUpfSxVLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obix0KXtyZXR1cm4gdGhpcy5fX2ImJih0aGlzLl9fdi5fX2tbMF09Tih0aGlzLl9fYiksdGhpcy5fX2I9bnVsbCksW3MobCxudWxsLHQudT9udWxsOm4uY2hpbGRyZW4pLHQudSYmbi5mYWxsYmFja119O3ZhciBQPWZ1bmN0aW9uKG4sdCxlKXtpZigrK2VbMV09PT1lWzBdJiZuLmwuZGVsZXRlKHQpLG4ucHJvcHMucmV2ZWFsT3JkZXImJihcInRcIiE9PW4ucHJvcHMucmV2ZWFsT3JkZXJbMF18fCFuLmwuc2l6ZSkpZm9yKGU9bi5pO2U7KXtmb3IoO2UubGVuZ3RoPjM7KWUucG9wKCkoKTtpZihlWzFdPGVbMF0pYnJlYWs7bi5pPWU9ZVsyXX19OyhPLnByb3RvdHlwZT1uZXcgbCkudT1mdW5jdGlvbihuKXt2YXIgdD10aGlzLGU9TSh0Ll9fdikscj10LmwuZ2V0KG4pO3JldHVybiByWzBdKyssZnVuY3Rpb24obyl7dmFyIHU9ZnVuY3Rpb24oKXt0LnByb3BzLnJldmVhbE9yZGVyPyhyLnB1c2gobyksUCh0LG4scikpOm8oKX07ZT9lKHUpOnUoKX19LE8ucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuKXt0aGlzLmk9bnVsbCx0aGlzLmw9bmV3IE1hcDt2YXIgdD1oKG4uY2hpbGRyZW4pO24ucmV2ZWFsT3JkZXImJlwiYlwiPT09bi5yZXZlYWxPcmRlclswXSYmdC5yZXZlcnNlKCk7Zm9yKHZhciBlPXQubGVuZ3RoO2UtLTspdGhpcy5sLnNldCh0W2VdLHRoaXMuaT1bMSwwLHRoaXMuaV0pO3JldHVybiBuLmNoaWxkcmVufSxPLnByb3RvdHlwZS5jb21wb25lbnREaWRVcGRhdGU9Ty5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQ9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO24ubC5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7UChuLGUsdCl9KX07dmFyIFc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7fXZhciB0PW4ucHJvdG90eXBlO3JldHVybiB0LmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnByb3BzLmNvbnRleHR9LHQucmVuZGVyPWZ1bmN0aW9uKG4pe3JldHVybiBuLmNoaWxkcmVufSxufSgpO2Z1bmN0aW9uIGoobil7dmFyIHQ9dGhpcyxlPW4uY29udGFpbmVyLHI9cyhXLHtjb250ZXh0OnQuY29udGV4dH0sbi52bm9kZSk7cmV0dXJuIHQucyYmdC5zIT09ZSYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCksdC5wPSExKSxuLnZub2RlP3QucD8oZS5fX2s9dC5fX2ssZChyLGUpLHQuX19rPWUuX19rKToodC52PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpLHAoXCJcIixlKSxlLmFwcGVuZENoaWxkKHQudiksdC5wPSEwLHQucz1lLGQocixlLHQudiksdC5fX2s9dC52Ll9fayk6dC5wJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSksdC5oPXIsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Qudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCl9LG51bGx9ZnVuY3Rpb24geihuLHQpe3JldHVybiBzKGose3Zub2RlOm4sY29udGFpbmVyOnR9KX12YXIgRD0vXig/OmFjY2VudHxhbGlnbm1lbnR8YXJhYmljfGJhc2VsaW5lfGNhcHxjbGlwKD8hUGF0aFUpfGNvbG9yfGZpbGx8Zmxvb2R8Zm9udHxnbHlwaCg/IVIpfGhvcml6fG1hcmtlcig/IUh8V3xVKXxvdmVybGluZXxwYWludHxzdG9wfHN0cmlrZXRocm91Z2h8c3Ryb2tlfHRleHQoPyFMKXx1bmRlcmxpbmV8dW5pY29kZXx1bml0c3x2fHZlY3Rvcnx2ZXJ0fHdvcmR8d3JpdGluZ3x4KD8hQykpW0EtWl0vO2wucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9e307dmFyIEg9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvciYmU3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIil8fDYwMTAzO2Z1bmN0aW9uIFQobix0LGUpe2lmKG51bGw9PXQuX19rKWZvcig7dC5maXJzdENoaWxkOyl0LnJlbW92ZUNoaWxkKHQuZmlyc3RDaGlsZCk7cmV0dXJuIGQobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfWZ1bmN0aW9uIFYobix0LGUpe3JldHVybiBwKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH12YXIgWj12LmV2ZW50O2Z1bmN0aW9uIEkobix0KXtuW1wiVU5TQUZFX1wiK3RdJiYhblt0XSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sdCx7Y29uZmlndXJhYmxlOiExLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzW1wiVU5TQUZFX1wiK3RdfSxzZXQ6ZnVuY3Rpb24obil7dGhpc1tcIlVOU0FGRV9cIit0XT1ufX0pfXYuZXZlbnQ9ZnVuY3Rpb24obil7WiYmKG49WihuKSksbi5wZXJzaXN0PWZ1bmN0aW9uKCl7fTt2YXIgdD0hMSxlPSExLHI9bi5zdG9wUHJvcGFnYXRpb247bi5zdG9wUHJvcGFnYXRpb249ZnVuY3Rpb24oKXtyLmNhbGwobiksdD0hMH07dmFyIG89bi5wcmV2ZW50RGVmYXVsdDtyZXR1cm4gbi5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe28uY2FsbChuKSxlPSEwfSxuLmlzUHJvcGFnYXRpb25TdG9wcGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LG4uaXNEZWZhdWx0UHJldmVudGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGV9LG4ubmF0aXZlRXZlbnQ9bn07dmFyICQ9e2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGFzc319LHE9di52bm9kZTt2LnZub2RlPWZ1bmN0aW9uKG4pe24uJCR0eXBlb2Y9SDt2YXIgdD1uLnR5cGUsZT1uLnByb3BzO2lmKHQpe2lmKGUuY2xhc3MhPWUuY2xhc3NOYW1lJiYoJC5lbnVtZXJhYmxlPVwiY2xhc3NOYW1lXCJpbiBlLG51bGwhPWUuY2xhc3NOYW1lJiYoZS5jbGFzcz1lLmNsYXNzTmFtZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJjbGFzc05hbWVcIiwkKSksXCJmdW5jdGlvblwiIT10eXBlb2YgdCl7dmFyIHIsbyx1O2Zvcih1IGluIGUuZGVmYXVsdFZhbHVlJiZ2b2lkIDAhPT1lLnZhbHVlJiYoZS52YWx1ZXx8MD09PWUudmFsdWV8fChlLnZhbHVlPWUuZGVmYXVsdFZhbHVlKSxkZWxldGUgZS5kZWZhdWx0VmFsdWUpLEFycmF5LmlzQXJyYXkoZS52YWx1ZSkmJmUubXVsdGlwbGUmJlwic2VsZWN0XCI9PT10JiYoaChlLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uKG4pey0xIT1lLnZhbHVlLmluZGV4T2Yobi5wcm9wcy52YWx1ZSkmJihuLnByb3BzLnNlbGVjdGVkPSEwKX0pLGRlbGV0ZSBlLnZhbHVlKSxlKWlmKHI9RC50ZXN0KHUpKWJyZWFrO2lmKHIpZm9yKHUgaW4gbz1uLnByb3BzPXt9LGUpb1tELnRlc3QodSk/dS5yZXBsYWNlKC9bQS1aMC05XS8sXCItJCZcIikudG9Mb3dlckNhc2UoKTp1XT1lW3VdfSFmdW5jdGlvbih0KXt2YXIgZT1uLnR5cGUscj1uLnByb3BzO2lmKHImJlwic3RyaW5nXCI9PXR5cGVvZiBlKXt2YXIgbz17fTtmb3IodmFyIHUgaW4gcikvXm9uKEFuaXxUcmF8VG91KS8udGVzdCh1KSYmKHJbdS50b0xvd2VyQ2FzZSgpXT1yW3VdLGRlbGV0ZSByW3VdKSxvW3UudG9Mb3dlckNhc2UoKV09dTtpZihvLm9uZG91YmxlY2xpY2smJihyLm9uZGJsY2xpY2s9cltvLm9uZG91YmxlY2xpY2tdLGRlbGV0ZSByW28ub25kb3VibGVjbGlja10pLG8ub25iZWZvcmVpbnB1dCYmKHIub25iZWZvcmVpbnB1dD1yW28ub25iZWZvcmVpbnB1dF0sZGVsZXRlIHJbby5vbmJlZm9yZWlucHV0XSksby5vbmNoYW5nZSYmKFwidGV4dGFyZWFcIj09PWV8fFwiaW5wdXRcIj09PWUudG9Mb3dlckNhc2UoKSYmIS9eZmlsfGNoZXxyYS9pLnRlc3Qoci50eXBlKSkpe3ZhciBpPW8ub25pbnB1dHx8XCJvbmlucHV0XCI7cltpXXx8KHJbaV09cltvLm9uY2hhbmdlXSxkZWxldGUgcltvLm9uY2hhbmdlXSl9fX0oKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYhdC5tJiZ0LnByb3RvdHlwZSYmKEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsTW91bnRcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHNcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxVcGRhdGVcIiksdC5tPSEwKX1xJiZxKG4pfTt2YXIgQj1cIjE2LjguMFwiO2Z1bmN0aW9uIEcobil7cmV0dXJuIHMuYmluZChudWxsLG4pfWZ1bmN0aW9uIEoobil7cmV0dXJuISFuJiZuLiQkdHlwZW9mPT09SH1mdW5jdGlvbiBLKG4pe3JldHVybiBKKG4pP3kuYXBwbHkobnVsbCxhcmd1bWVudHMpOm59ZnVuY3Rpb24gUShuKXtyZXR1cm4hIW4uX19rJiYoZChudWxsLG4pLCEwKX1mdW5jdGlvbiBYKG4pe3JldHVybiBuJiYobi5iYXNlfHwxPT09bi5ub2RlVHlwZSYmbil8fG51bGx9dmFyIFk9ZnVuY3Rpb24obix0KXtyZXR1cm4gbih0KX07ZXhwb3J0IGRlZmF1bHR7dXNlU3RhdGU6bix1c2VSZWR1Y2VyOnQsdXNlRWZmZWN0OmUsdXNlTGF5b3V0RWZmZWN0OnIsdXNlUmVmOm8sdXNlSW1wZXJhdGl2ZUhhbmRsZTp1LHVzZU1lbW86aSx1c2VDYWxsYmFjazpmLHVzZUNvbnRleHQ6Yyx1c2VEZWJ1Z1ZhbHVlOmEsdmVyc2lvbjpcIjE2LjguMFwiLENoaWxkcmVuOlIscmVuZGVyOlQsaHlkcmF0ZTpULHVubW91bnRDb21wb25lbnRBdE5vZGU6USxjcmVhdGVQb3J0YWw6eixjcmVhdGVFbGVtZW50OnMsY3JlYXRlQ29udGV4dDpnLGNyZWF0ZUZhY3Rvcnk6RyxjbG9uZUVsZW1lbnQ6SyxjcmVhdGVSZWY6YixGcmFnbWVudDp4LGlzVmFsaWRFbGVtZW50OkosZmluZERPTU5vZGU6WCxDb21wb25lbnQ6bCxQdXJlQ29tcG9uZW50OkMsbWVtbzpfLGZvcndhcmRSZWY6Uyx1bnN0YWJsZV9iYXRjaGVkVXBkYXRlczpZLFN1c3BlbnNlOlUsU3VzcGVuc2VMaXN0Ok8sbGF6eTpMfTtleHBvcnR7QiBhcyB2ZXJzaW9uLFIgYXMgQ2hpbGRyZW4sVCBhcyByZW5kZXIsViBhcyBoeWRyYXRlLFEgYXMgdW5tb3VudENvbXBvbmVudEF0Tm9kZSx6IGFzIGNyZWF0ZVBvcnRhbCxHIGFzIGNyZWF0ZUZhY3RvcnksSyBhcyBjbG9uZUVsZW1lbnQsSiBhcyBpc1ZhbGlkRWxlbWVudCxYIGFzIGZpbmRET01Ob2RlLEMgYXMgUHVyZUNvbXBvbmVudCxfIGFzIG1lbW8sUyBhcyBmb3J3YXJkUmVmLFkgYXMgdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMsVSBhcyBTdXNwZW5zZSxPIGFzIFN1c3BlbnNlTGlzdCxMIGFzIGxhenl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGF0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEZlYXR1cmVSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5pbXBvcnQge3VzZUF1dGh9IGZyb20gJy4vc3RhdGUvdXNlQXV0aCdcclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL0xvZ2luJykpO1xyXG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3VpLWNvbXBvbmVudHMvQ2hhbmdlUGFzc3dvcmQnKSk7XHJcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9TaWdudXAnKSk7XHJcbmNvbnN0IFByb2ZpbGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL1Byb2ZpbGUnKSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoRmVhdHVyZVJvdXRlcygpIHtcclxuICBjb25zdCB7b25Gb2N1cyxvbkxvZ2luLG9uTG9naW5CbHVyLG9uU2lnbnVwQmx1cixvbkNoYW5nZVBhc3NCbHVyLG9uUmVxdWVzdFBhc3NDaGFuZ2VCbHVyLG9uU2lnbnVwLG9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlLG9uUGFzc3dvcmRDaGFuZ2UsIG9uQ2hhbmdlLHN0YXRlfT11c2VBdXRoKClcclxuIFxyXG4gIHJldHVybiBbXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvY2hhbmdlLXBhc3dvcmRcIj5cclxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgIDxDaGFuZ2VQYXNzd29yZCAgey4uLnN0YXRlfSBvbkZvY3VzPXtvbkZvY3VzfSBvbkJsdXI9e29uQ2hhbmdlUGFzc0JsdXJ9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gb25QYXNzd29yZENoYW5nZT17b25QYXNzd29yZENoYW5nZX0vPlxyXG4gICAgICA8L1N1c3BlbnNlPlxyXG4gICAgPC9GZWF0dXJlUm91dGU+LFxyXG4gICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL2xvZ2luXCI+XHJcbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICA8TG9naW4gey4uLnN0YXRlfSBvbkZvY3VzPXtvbkZvY3VzfSBvbkJsdXI9e29uTG9naW5CbHVyfSBvbkNoYW5nZT17b25DaGFuZ2V9IG9uTG9naW49e29uTG9naW59IC8+XHJcbiAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvc2lnbnVwXCI+XHJcbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICA8U2lnbnVwIHsuLi5zdGF0ZX0gb25Gb2N1cz17b25Gb2N1c30gb25CbHVyPXtvblNpZ251cEJsdXJ9IG9uQ2hhbmdlPXtvbkNoYW5nZX1vblNpZ251cD17b25TaWdudXB9IC8+XHJcbiAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvZm9yZ290LXBhc3dvcmRcIj5cclxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgIDxGb3Jnb3RQYXNzd29yZCB7Li4uc3RhdGV9IG9uRm9jdXM9e29uRm9jdXN9IG9uQmx1cj17b25SZXF1ZXN0UGFzc0NoYW5nZUJsdXJ9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gb25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2U9e29uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlfS8+XHJcbiAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvcHJvZmlsZVwiPlxyXG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgPFByb2ZpbGUgLz5cclxuICAgICAgPC9TdXNwZW5zZT5cclxuICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gIF1cclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBlbmRpbmdIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9ubGluZSxpc0Jsb2NrZXIgfSkge1xyXG5cclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG4gIGxldCBoYW5nb3V0S2V5ID0gJyc7XHJcbiAgbGV0IG1lc3NhZ2VLZXkgPSAnJztcclxuICBpZiAob25saW5lKSB7XHJcbiAgICBcclxuICAgIGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBcclxuICAgIGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcclxuICAgIG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1vZmZsaW5lLW1lc3NhZ2VzYDtcclxuICB9XHJcblxyXG4gIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSk7XHJcbiAgaWYgKG1lc3NhZ2UgJiYgbWVzc2FnZS50ZXh0ICE9PVwiXCIpIHtcclxuICAgIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgdXNlcm5hbWUsIG1lc3NhZ2UsZGlzcGF0Y2gsaXNCbG9ja2VyIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZUhhbmdvdXQoeyBoYW5nb3V0S2V5LCB1c2VybmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBpZiAoaGFuZ291dHMpIHtcclxuICAgIFxyXG4gICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgaGFuZ291dCk7XHJcbiAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtoYW5nb3V0XTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogdXBkYXRlZEhhbmdvdXRzIH0pO1xyXG4gIH1cclxuIFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3NhZ2UoeyBtZXNzYWdlS2V5LCBtZXNzYWdlLGRpc3BhdGNoLGlzQmxvY2tlciB9KSB7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gW107XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiBcclxuICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgbWVzc2FnZV07XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbbWVzc2FnZV07XHJcbiAgfVxyXG4gIGlmKGlzQmxvY2tlcil7XHJcbiBcclxuICAgIGNvbnN0IGJsb2NrZXIgPVsuLi51cGRhdGVkTWVzc2FnZXMse3RleHQ6J1lvdSBjYW4gbm90IHNlbmQgdGhpcyBtZXNzYWdlIGJlY2F1c2UgeW91IGFyZSBibG9ja2VkLidcclxuICAgICx0aW1lc3RhbXA6IERhdGUubm93KCksdHlwZTonYmxvY2tlcicsdXNlcm5hbWU6bWVzc2FnZS51c2VybmFtZSxmbG9hdDoncmlnaHQnfV1cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KGJsb2NrZXIpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IGJsb2NrZXIgfSk7XHJcbiAgXHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcclxuICB9XHJcbiBcclxuXHJcbn1cclxuIiwiXHJcbmV4cG9ydCBmdW5jdGlvbiBzZW5kT2ZmbGluZUhhbmdvdXRzKHsgc29ja2V0LCBuYW1lIH0pIHtcclxuICBjb25zdCBvZmZsaW5lSGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xyXG4gIGNvbnN0IG9mZmxpbmVIYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0ob2ZmbGluZUhhbmdvdXRLZXkpKTtcclxuICBpZiAob2ZmbGluZUhhbmdvdXRzKSB7XHJcbiAgICBvZmZsaW5lSGFuZ291dHMuZm9yZUVhY2goKGgpID0+IHtcclxuICAgICAgc29ja2V0LnNlbmQoXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdXNlcm5hbWU6IGgudXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbDogaC5lbWFpbCxcclxuICAgICAgICAgIG1lc3NhZ2U6IGgubWVzc2FnZSxcclxuICAgICAgICAgIHRpbWVzdGFtcDogaC50aW1lc3RhbXAsXHJcbiAgICAgICAgICBjb21tYW5kOiBoLnN0YXRlLFxyXG4gICAgICAgICAgb2ZmbGluZTogdHJ1ZSxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJldHVybjtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkKHtuYW1lLCBoYW5nb3V0LGRpc3BhdGNofSl7XHJcbiAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xyXG4gICAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcclxuICAgIGxldCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuICAgXHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICBjb25zdCBmaWx0ZXJlZEhhbmdvdXRzID0gdW5yZWFkaGFuZ291dHMuZmlsdGVyKGZ1bmN0aW9uKHVucmVhZCkgIHtcclxuICAgICAgICAgICAgcmV0dXJuICB1bnJlYWQudXNlcm5hbWUgIT09IHVzZXJuYW1lfSk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihmaWx0ZXJlZEhhbmdvdXRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkoZmlsdGVyZWRIYW5nb3V0cykpO1xyXG4gICAgICAgICAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxyXG4gICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHM6IGZpbHRlcmVkSGFuZ291dHMsXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odW5yZWFkaGFuZ291dHNLZXkpO1xyXG4gICAgICAgICAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICAgICAgICAgICAgICAgIHVucmVhZGhhbmdvdXRzOiBbXSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIFxyXG4gICAgICBcclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24nO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IHsgc2F2ZVBlbmRpbmdIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnO1xyXG5pbXBvcnQge1xyXG5cclxuICBzZWxlY3RVbnJlYWQsXHJcbiAgXHJcblxyXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHNlbmRPZmZsaW5lSGFuZ291dHMgfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMnO1xyXG5pbXBvcnQge3JlbW92ZUhhbmdvdXRGcm9tVW5yZWFkfSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQnXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0ICB1c2VybmFtZSAgPSBhdXRoQ29udGV4dC5zdGF0ZS51c2VyICYmYXV0aENvbnRleHQuc3RhdGUudXNlci51c2VybmFtZTtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XHJcbiAgY29uc3Qge1xyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgdXNlcnMsXHJcbiAgICBtZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VzLFxyXG4gICAgcmVhZHlTdGF0ZSxcclxuICBcclxuICAgIHVucmVhZGhhbmdvdXRzLFxyXG4gIH0gPSBzdGF0ZTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICggcmVhZHlTdGF0ZSA9PT0gMSAmJiB1c2VybmFtZSkge1xyXG4gICAgICBzZW5kT2ZmbGluZUhhbmdvdXRzKHsgbmFtZTogdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtyZWFkeVN0YXRlLCB1c2VybmFtZV0pO1xyXG5cclxuICBmdW5jdGlvbiBvblJlbW92ZVVucmVhZChlKXtcclxuICAgIGNvbnN0IGlkID1lLmN1cnJlbnRUYXJnZXQuaWRcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBpZCk7XHJcbiAgIFxyXG4gICAgcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQoe25hbWU6dXNlcm5hbWUsZGlzcGF0Y2gsaGFuZ291dH0pXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uTmF2aWdhdGlvbihlKXtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgLy8gY29uc3QgaWQgPWUudGFyZ2V0LmlkXHJcbiAgICBjb25zdCBpZCA9ZS5jdXJyZW50VGFyZ2V0LmlkXHJcbiAgIFxyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2lkfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCBoYW5nb3V0IH0pXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0VW5yZWFkKGUpIHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XHJcbiAgICBcclxuIFxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgIHNlbGVjdFVucmVhZCh7IGRpc3BhdGNoLCBoYW5nb3V0IH0pO1xyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TZWFyY2hJbnB1dChlKSB7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TRUFSQ0hfSU5QVVRfQ0hBTkdFLCBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25GZXRjaEhhbmdvdXRzKCl7XHJcblxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEfSlcclxuICB9XHJcblxyXG4gXHJcbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XHJcbiAgICBjb25zdCB0ZXh0ID0gZS50YXJnZXQudmFsdWU7XHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IGRpc3BhdGNoLCB0ZXh0IH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBvbkhhbmdvdXQoZSkge1xyXG4gICAgXHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQ6ICcnLCBkaXNwYXRjaCB9KTtcclxuICAgIGNvbnN0IGNvbW1hbmQgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IGhhbmdvdXQ7XHJcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgbWVzc2FnZSA9XHJcbiAgICAgIG1lc3NhZ2VUZXh0ICE9PSAnJyA/IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCB9IDogbnVsbDtcclxuXHJcbiAgICBsZXQgb25saW5lID0gdHJ1ZTtcclxuICAgIGxldCBpc0Jsb2NrZXIgPWZhbHNlXHJcbiAgICBcclxuICAvLyAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgICAgXHJcbiAgICAgIGlmKGhhbmdvdXQuc3RhdGUgPT09J0JMT0NLRVInKXtcclxuICAgICAgIFxyXG4gICAgICAgIGlzQmxvY2tlcj10cnVlXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcGVuZGluZ0hhbmdvdXQ9IHtcclxuICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgIGNvbW1hbmQsXHJcbiAgICAgICAgdGltZXN0YW1wLFxyXG4gICAgICB9XHJcbiAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9TVEFSVEVELCBwZW5kaW5nSGFuZ291dH0pXHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgLy8gICBvbmxpbmUgPSBmYWxzZTtcclxuICAgIC8vIH1cclxuICAgXHJcbiBcclxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XHJcbiAgICAgIGRpc3BhdGNoLFxyXG4gICAgICBuYW1lOiB1c2VybmFtZSxcclxuICAgICAgaGFuZ291dDoge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIHN0YXRlOiBjb21tYW5kLFxyXG4gICAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCwgZGVsaXZlcmVkOiBmYWxzZSwgdXNlcm5hbWUgfSxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgZGVsaXZlcmVkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgb25saW5lLFxyXG4gICAgICBpc0Jsb2NrZXJcclxuICAgIH0pO1xyXG4gIH0vL2VuZCBvbkhhbmdvdXRcclxuICByZXR1cm4ge1xyXG4gICAgc3RhdGUsXHJcbiAgICBvbk5hdmlnYXRpb24sXHJcbiAgICBvblNlbGVjdFVucmVhZCxcclxuICAgIG9uTWVzc2FnZVRleHQsXHJcbiAgICBtZXNzYWdlVGV4dCxcclxuICAgIG9uU2VhcmNoSW5wdXQsXHJcbiAgICBvbkZldGNoSGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgICBkaXNwYXRjaCxcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIHVzZXJzLFxyXG4gICAgdXNlcm5hbWUsXHJcbiAgICBtZXNzYWdlcyxcclxuICAgIG9uSGFuZ291dCxcclxuICAgIHVucmVhZGhhbmdvdXRzLFxyXG4gICAgcmVhZHlTdGF0ZSxcclxuICAgIG9uUmVtb3ZlVW5yZWFkXHJcbiAgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL3N0YXRlL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2gsdXNlcklkIH0pIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIHNlYXJjaCBIYW5nb3V0XHJcbiAgICAgXHJcbiAgICAgICAgY29uc3QgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJIYW5nb3V0XCIpO1xyXG4gICAgICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsdXNlcklkKVxyXG4gICAgICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJuYW1lJyxzZWFyY2gpXHJcbiAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IGF3YWl0IHF1ZXJ5LmZpbmQoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihzZWFyY2hSZXN1bHQubGVuZ3RoPjApe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgbWFwcGVkSGFub3V0cyA9IHNlYXJjaFJlc3VsdC5tYXAocz0+e3JldHVybiB7dXNlcm5hbWU6cy5hdHRyaWJ1dGVzLnVzZXJuYW1lLCBlbWFpbDpzLmF0dHJpYnV0ZXMuZW1haWwsc3RhdGU6cy5hdHRyaWJ1dGVzLnN0YXRlfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0czptYXBwZWRIYW5vdXRzIH0pXHJcbiAgICAgICAgfSAgXHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgXHJcbiAgICAgICAgICAgIC8vIHNlYXJjaCBIYW5nb3V0VXNlclxyXG4gICAgICAgICAgICBjb25zdCBIYW5nb3V0VXNlciA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0VXNlclwiKTtcclxuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoSGFuZ291dFVzZXIpO1xyXG4gICAgICAgICAgICBxdWVyeS5lcXVhbFRvKCd1c2VybmFtZScsc2VhcmNoKVxyXG4gICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gYXdhaXQgcXVlcnkuZmluZCgpO1xyXG4gICAgICAgICAgICBsZXQgbWFwcGVkSGFub3V0cyA9IHNlYXJjaFJlc3VsdC5tYXAocz0+e3JldHVybiB7dXNlcm5hbWU6cy5hdHRyaWJ1dGVzLnVzZXJuYW1lLCBlbWFpbDpzLmF0dHJpYnV0ZXMuZW1haWwsc3RhdGU6J0lOVklURSd9fSlcclxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzOm1hcHBlZEhhbm91dHMgfSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5FUlJPUl9SRUNJRVZFRCxlcnJvcn0pXHJcbiAgICB9XHJcblxyXG59IiwiXHJcbi8vaXMgc2VudCBieSBjbGllbnRcclxuZXhwb3J0IGNvbnN0IGNsaWVudENvbW1hbmRzID0ge1xyXG4gIElOVklURTogJ0lOVklURScsXHJcbiAgQUNDRVBUOiAnQUNDRVBUJyxcclxuICBERUNMSU5FOiAnREVDTElORScsXHJcbiAgQkxPQ0s6ICdCTE9DSycsXHJcbiAgVU5CTE9DSzogJ1VOQkxPQ0snLFxyXG4gIE1FU1NBR0U6ICdNRVNTQUdFJyxcclxuICBPTkxJTkU6J09OTElORSdcclxufTtcclxuXHJcbiIsImltcG9ydCB7IGhhbmdvdXRTdGF0ZXMgfSBmcm9tICcuL2hhbmdvdXRTdGF0ZXMnXHJcbmltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2NsaWVudENvbW1hbmRzJ1xyXG5leHBvcnQgZnVuY3Rpb24gc3RhdGVNYXBwZXIoeyBjb21tYW5kIH0pIHtcclxuICAgIHN3aXRjaCAoY29tbWFuZCkge1xyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuQUNDRVBUOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5BQ0NFUFRFUlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5CTE9DSzpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLkJMT0NLRUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5CTE9DS0VSXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLkRFQ0xJTkU6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5ERUNMSU5FRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLklOVklURTpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLklOVklURUQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZTogaGFuZ291dFN0YXRlcy5JTlZJVEVSXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLk1FU1NBR0U6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5NRVNTQUdFRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUlxyXG4gICAgICAgICAgICB9XHJcbiAgIFxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuVU5CTE9DSzpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFUlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2xpZW50Q29tbWFuZCB0eXBlIG5vdCBzcGVjaWZpZWQnKVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4uLy4uL3N0YXRlL3VzZUhhbmdvdXRzJ1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucydcclxuaW1wb3J0IHsgc3RhdGVNYXBwZXIgfSBmcm9tICdzZXJ2ZXIvaGFuZ291dHMvc3RhdGVNYXBwZXInXHJcbmltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvY2xpZW50Q29tbWFuZHMnXHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24nXHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vc3RhdGUvYWN0aW9uVHlwZXMnXHJcbmV4cG9ydCBmdW5jdGlvbiBQYXJzZVNlcnZlcihwcm9wcykge1xyXG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHNcclxuICAgIGNvbnN0IHsgc3RhdGUsIGRpc3BhdGNoIH0gPSB1c2VIYW5nb3V0cygpXHJcbiAgICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KClcclxuICAgIGNvbnN0IHsgdXNlciB9ID0gYXV0aENvbnRleHQuc3RhdGVcclxuICAgIGNvbnN0IHsgZmV0Y2hIYW5nb3V0cywgc2VhcmNoLCBwZW5kaW5nSGFuZ291dCB9ID0gc3RhdGVcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGlmIChmZXRjaEhhbmdvdXRzKSB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgYWN0aW9ucy5mZXRjaEhhbmdvdXRzKHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcklkOiB1c2VyLm9iamVjdElkIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIFtmZXRjaEhhbmdvdXRzXSlcclxuXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAocGVuZGluZ0hhbmdvdXQpIHtcclxuXHJcbiAgICAgICAgICAgIHNlbmRIYW5nb3V0KClcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgW3BlbmRpbmdIYW5nb3V0XSlcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgc3ViU2NyaWJlVG9VbnJlYWRIYW5nb3V0KClcclxuICAgICAgICAgICAgc3ViU2NyaWJlVG9IYW5nb3V0KClcclxuXHJcbiAgICAgICAgICAgIFBhcnNlLkxpdmVRdWVyeS5vbignb3BlbicsIGFzeW5jKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFwiVW5yZWFkSGFuZ291dFwiKTtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsIHVzZXIub2JqZWN0SWQpXHJcbiAgICAgICAgICAgICAgICBsZXQgdW5yZWFkaGFuZ291dHMgPSBhd2FpdCBxdWVyeS5maW5kKCk7XHJcbiAgICAgICAgICAgICAgICBpZih1bnJlYWRoYW5nb3V0cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHMuZm9yRWFjaChoPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVucmVhZGhhbmdvdXQgPWguYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7aGFuZ291dDp1bnJlYWRoYW5nb3V0fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlVW5yZWFkSGFuZ291dCh7aGFuZ291dDp1bnJlYWRoYW5nb3V0LG9iamVjdElkOmguaWR9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjsgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzb2NrZXQgY29ubmVjdGlvbiBlc3RhYmxpc2hlZCcpO1xyXG5cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgW3VzZXJdKVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0IH0pIHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnSU5WSVRFRCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ0FDQ0VQVEVEJzpcclxuICAgICAgICAgICAgY2FzZSAnQkxPQ0tFRCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ01FU1NBR0VEJzpcclxuICAgICAgICAgICAgY2FzZSAnREVDTElORUQnOlxyXG4gICAgICAgICAgICBjYXNlICdVTkJMT0NLRUQnOlxyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVELCBtZXNzYWdlOiB7IGhhbmdvdXQsIHR5cGU6ICdBQ0tIT1dMRURHRU1FTlQnIH0gfSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdJTlZJVEVSJzpcclxuICAgICAgICAgICAgY2FzZSAnQUNDRVBURVInOlxyXG4gICAgICAgICAgICBjYXNlICdCTE9DS0VSJzpcclxuICAgICAgICAgICAgY2FzZSAnTUVTU0FOR0VSJzpcclxuICAgICAgICAgICAgY2FzZSAnVU5CTE9DS0VSJzpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQsIG1lc3NhZ2U6IHsgaGFuZ291dCwgdHlwZTogJ0hBTkdPVVQnIH0gfSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHJlbW92ZVVucmVhZEhhbmdvdXQoeyBoYW5nb3V0LG9iamVjdElkIH0pIHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgVW5yZWFkSGFuZ291dCA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJVbnJlYWRIYW5nb3V0XCIpO1xyXG4gICAgICAgICAgICBsZXQgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoVW5yZWFkSGFuZ291dCk7XHJcbiAgICAgICAgICAgIGxldCB1bnJlYWRoYW5nb3V0ID0gYXdhaXQgcXVlcnkuZ2V0KG9iamVjdElkKVxyXG4gICAgICAgICAgICBhd2FpdCB1bnJlYWRoYW5nb3V0LmRlc3Ryb3koKVxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5FUlJPUl9SRUNJRVZFRCwgZXJyb3IgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHN1YlNjcmliZVRvSGFuZ291dCgpIHtcclxuICAgICAgICBsZXQgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJIYW5nb3V0XCIpO1xyXG4gICAgICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsIHVzZXIub2JqZWN0SWQpXHJcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IGF3YWl0IHF1ZXJ5LnN1YnNjcmliZSgpO1xyXG4gICAgICAgIHN1YnNjcmlwdGlvbi5vbignY3JlYXRlJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgY29uc3QgaGFuZ291dCA9IG9iamVjdC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCB9KVxyXG4gICAgICBcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3Vic2NyaXB0aW9uLm9uKCd1cGRhdGUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5nb3V0ID0gb2JqZWN0LmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0IH0pXHJcbiAgICAgICAgICAgXHJcbiAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdWJzY3JpcHRpb24ub24oJ2VudGVyJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN1YnNjcmlwdGlvbi5vbignbGVhdmUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBvYmplY3QuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHNbMF0uYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCB9KVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIHN1YlNjcmliZVRvVW5yZWFkSGFuZ291dCgpIHtcclxuICAgICAgICBsZXQgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJVbnJlYWRIYW5nb3V0XCIpO1xyXG4gICAgICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsIHVzZXIub2JqZWN0SWQpXHJcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IGF3YWl0IHF1ZXJ5LnN1YnNjcmliZSgpO1xyXG4gICAgICAgIHN1YnNjcmlwdGlvbi5vbignY3JlYXRlJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgY29uc3QgaGFuZ291dCA9IG9iamVjdC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCB9KVxyXG4gICAgICAgICAgICByZW1vdmVVbnJlYWRIYW5nb3V0KHtoYW5nb3V0fSlcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3Vic2NyaXB0aW9uLm9uKCd1cGRhdGUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5nb3V0ID0gb2JqZWN0LmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0IH0pXHJcbiAgICAgICAgICAgIHJlbW92ZVVucmVhZEhhbmdvdXQoe2hhbmdvdXR9KVxyXG4gICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3Vic2NyaXB0aW9uLm9uKCdlbnRlcicsIChvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdWJzY3JpcHRpb24ub24oJ2xlYXZlJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gb2JqZWN0LmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzWzBdLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQgfSlcclxuICAgICAgICAgICAgcmVtb3ZlVW5yZWFkSGFuZ291dCh7aGFuZ291dH0pXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBzZW5kSGFuZ291dCgpIHtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2VuZGVyU3RhdGUsIHRhcmdldFN0YXRlIH0gPSBzdGF0ZU1hcHBlcih7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBwZW5kaW5nSGFuZ291dC5jb21tYW5kLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwsIG1lc3NhZ2UsIG9mZmxpbmUsIHRpbWVzdGFtcCB9ID0gcGVuZGluZ0hhbmdvdXQ7XHJcbiAgICAgICAgICAgIGNvbnN0IEhhbmdvdXQgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFwiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IFNlbmRlclVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgICAgICAgIGxldCBzZW5kZXJRdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShTZW5kZXJVc2VyKTtcclxuICAgICAgICAgICAgc2VuZGVyUXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLCB1c2VyLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICBsZXQgc2VuZGVyVXNlciA9IGF3YWl0IHNlbmRlclF1ZXJ5LmZpcnN0KClcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBUYXJnZXRVc2VyID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkhhbmdvdXRVc2VyXCIpO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0UXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoVGFyZ2V0VXNlcik7XHJcbiAgICAgICAgICAgIHRhcmdldFF1ZXJ5LmVxdWFsVG8oJ3VzZXJuYW1lJywgdXNlcm5hbWUpXHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRVc2VyID0gYXdhaXQgdGFyZ2V0UXVlcnkuZmlyc3QoKVxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgLy9IQU5HT1VUXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlciA9IG5ldyBIYW5nb3V0KClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgndXNlcm5hbWUnLCB1c2VybmFtZSlcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnZW1haWwnLCBlbWFpbClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnbWVzc2FnZScsIG1lc3NhZ2UpXHJcbiAgICAgICAgICAgIHNlbmRlci5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgnc3RhdGUnLCBzZW5kZXJTdGF0ZSlcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgndXNlcmlkJywgc2VuZGVyVXNlci5hdHRyaWJ1dGVzLnVzZXJpZClcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IG5ldyBIYW5nb3V0KClcclxuICAgICAgICAgICAgdGFyZ2V0LnNldCgndXNlcm5hbWUnLCB1c2VyLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCdlbWFpbCcsIHVzZXIuZW1haWwpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ21lc3NhZ2UnLCBtZXNzYWdlKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCd0aW1lc3RhbXAnLCB0aW1lc3RhbXApXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ3N0YXRlJywgdGFyZ2V0U3RhdGUpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ3VzZXJpZCcsIHRhcmdldFVzZXIuYXR0cmlidXRlcy51c2VyaWQpXHJcblxyXG5cclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGlmIChwZW5kaW5nSGFuZ291dC5jb21tYW5kID09PSBjbGllbnRDb21tYW5kcy5JTlZJVEUpIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyVXNlci5hZGRVbmlxdWUoJ2hhbmdvdXRzJywgc2VuZGVyKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXNlci5hZGRVbmlxdWUoJ2hhbmdvdXRzJywgdGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgc2VuZGVyLnNldCgnb3duZXInLCBzZW5kZXJVc2VyKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNldCgnb3duZXInLCB0YXJnZXRVc2VyKVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldFF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFwiSGFuZ291dFwiKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldFF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsIHRhcmdldFVzZXIuYXR0cmlidXRlcy51c2VyaWQpXHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SGFuZ291dCA9IGF3YWl0IHRhcmdldFF1ZXJ5LmZpcnN0KClcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2V0KCdtZXNzYWdlJywgbWVzc2FnZSlcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2V0KCd0aW1lc3RhbXAnLCB0aW1lc3RhbXApXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRIYW5nb3V0LnNldCgnc3RhdGUnLCB0YXJnZXRTdGF0ZSlcclxuICAgICAgICAgICAgICAgLy8gdGFyZ2V0SGFuZ291dC5zYXZlKClcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZW5kZXJRdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkhhbmdvdXRcIik7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJRdWVyeS5lcXVhbFRvKCd1c2VyaWQnLCB1c2VyLm9iamVjdElkKVxyXG4gICAgICAgICAgICAgICAgbGV0IHNlbmRlckhhbmdvdXQgPSBhd2FpdCBzZW5kZXJRdWVyeS5maXJzdCgpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJIYW5nb3V0LnNldCgnbWVzc2FnZScsIG1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJIYW5nb3V0LnNldCgndGltZXN0YW1wJywgdGltZXN0YW1wKVxyXG4gICAgICAgICAgICAgICAgc2VuZGVySGFuZ291dC5zZXQoJ3N0YXRlJywgc2VuZGVyU3RhdGUpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJIYW5nb3V0LnNhdmUoKVxyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9VTlJFQURIQU5HT1VUXHJcbiAgICAgICAgICAgIGNvbnN0IFVucmVhZEhhbmdvdXQgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiVW5yZWFkSGFuZ291dFwiKTtcclxuICAgICAgICAgICAgY29uc3QgdW5yZWFkVGFyZ2V0ID0gbmV3IFVucmVhZEhhbmdvdXQoKVxyXG4gICAgICAgICAgICB1bnJlYWRUYXJnZXQuc2V0KCd1c2VybmFtZScsIHVzZXIudXNlcm5hbWUpXHJcbiAgICAgICAgICAgIHVucmVhZFRhcmdldC5zZXQoJ2VtYWlsJywgdXNlci5lbWFpbClcclxuICAgICAgICAgICAgdW5yZWFkVGFyZ2V0LnNldCgnbWVzc2FnZScsIG1lc3NhZ2UpXHJcbiAgICAgICAgICAgIHVucmVhZFRhcmdldC5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgdW5yZWFkVGFyZ2V0LnNldCgnc3RhdGUnLCB0YXJnZXRTdGF0ZSlcclxuICAgICAgICAgICAgdW5yZWFkVGFyZ2V0LnNldCgndXNlcmlkJywgdGFyZ2V0VXNlci5hdHRyaWJ1dGVzLnVzZXJpZClcclxuICAgICAgICAgICAgdGFyZ2V0VXNlci5hZGRVbmlxdWUoJ3VucmVhZGhhbmdvdXRzJywgdW5yZWFkVGFyZ2V0KVxyXG4gICAgICAgICAgICB1bnJlYWRUYXJnZXQuc2V0KCdvd25lcicsIHRhcmdldFVzZXIpXHJcbiAgICAgICAgICAgIC8vU0FWRSBIQU5HT1VUVVNFUlxyXG4gICAgICAgICAgICBzZW5kZXJVc2VyLnNhdmUoKVxyXG4gICAgICAgICAgICB0YXJnZXRVc2VyLnNhdmUoKVxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjaGlsZHJlblxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgUGFyc2VTZXJ2ZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9wYXJzZS9QYXJzZVNlcnZlcidcclxuaW1wb3J0IHsgV2ViU29ja2V0Q29udGFpbmVyIH0gZnJvbSAnLi4vc2VydmljZXMvd2Vic29ja2V0L1dlYlNvY2tldENvbnRhaW5lcidcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dEFkYXB0ZXIocHJvcHMpIHtcclxuICAgIGlmIChQUkVBQ1RfQVBQX0JBQ0sgPT09ICdQUkVBQ1RfQVBQX1BBUlNFJykge1xyXG4gICAgICAgIHJldHVybiA8UGFyc2VTZXJ2ZXIgey4uLnByb3BzfSAvPlxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoUFJFQUNUX0FQUF9CQUNLID09PSAnUFJFQUNUX0FQUF9OT0RFSlMnKSB7XHJcbiAgICAgICAgcmV0dXJuIDxXZWJTb2NrZXRDb250YWluZXIgey4uLnByb3BzfSAvPlxyXG4gICAgfVxyXG5cclxuICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcbn0iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IEFwcFJvdXRlUHJvdmlkZXIgZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgSGFuZ291dEFkYXB0ZXIgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvSGFuZ291dEFkYXB0ZXInO1xyXG5pbXBvcnQgSGFuZ291dHNQcm92aWRlciBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJ1xyXG5pbXBvcnQgQXV0aFByb3ZpZGVyIGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uJztcclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFByb3ZpZGVycyh7IGNoaWxkcmVuIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEFwcFJvdXRlUHJvdmlkZXJcclxuICAgICAgdGl0bGU9XCJXZWJjb21cIlxyXG4gICAgICBpbml0U3RhdGU9e3sgcm91dGU6ICcvJywgZmVhdHVyZVJvdXRlOiAnL2hhbmdvdXRzJyB9fVxyXG4gICAgPlxyXG4gICAgICA8QXV0aFByb3ZpZGVyPlxyXG4gICAgICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICAgICAgPEhhbmdvdXRBZGFwdGVyIHNvY2tldFVybD17YHdzczovLyR7aXB9OjMwMDBgfT5cclxuICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgPC9IYW5nb3V0QWRhcHRlcj5cclxuICAgICAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgIDwvQXV0aFByb3ZpZGVyPlxyXG4gICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2YmFyKHByb3BzKSB7XHJcbiAgICBjb25zdCB7IGJnID0gJ2xpZ2h0JywgYnJhbmQsIGNoaWxkcmVuIH0gPSBwcm9wc1xyXG4gICAgcmV0dXJuIDxuYXYgY2xhc3NOYW1lPXtgbmF2YmFyIG5hdmJhci1leHBhbmQtbGcgbmF2YmFyLSR7Ymd9IGJnLSR7Ymd9YH0+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIiNcIj57YnJhbmR9PC9hPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXJcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiI25hdmJhclN1cHBvcnRlZENvbnRlbnRcIiBhcmlhLWNvbnRyb2xzPVwibmF2YmFyU3VwcG9ydGVkQ29udGVudFwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtbGFiZWw9XCJUb2dnbGUgbmF2aWdhdGlvblwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlci1pY29uXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgXHJcbiAgICA8L25hdj5cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZCYXJDb2xsYXBzZSh7Y2hpbGRyZW59KXtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZVwiIGlkPVwibmF2YmFyU3VwcG9ydGVkQ29udGVudFwiPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZCYXJOYXYoeyBjaGlsZHJlbiB9KSB7XHJcbiAgICByZXR1cm4gPHVsIGNsYXNzTmFtZT1cIm5hdmJhci1uYXYgbXItYXV0b1wiPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvdWw+XHJcbn1cclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0oeyBjaGlsZHJlbiB9KSB7XHJcbiAgXHJcbiAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+e2NoaWxkcmVufTwvbGk+XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2TGluayhwcm9wcykge1xyXG4gICAgY29uc3Qge2FwcFJvdXRlfT1wcm9wc1xyXG4gICAgY29uc3Qge29uQXBwUm91dGV9PXVzZUFwcFJvdXRlKClcclxuICAgIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIFxyXG4gICAgICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTpgLyR7aWR9YCxyb3V0ZTphcHBSb3V0ZX0pXHJcbiAgICAgIH1cclxuICAgIHJldHVybiA8YSBjbGFzc05hbWU9XCJuYXYtbGlua1wiIGhyZWY9XCIjXCIgb25DbGljaz17aGFuZGxlUm91dGV9ICB7Li4ucHJvcHN9Lz5cclxufSIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdiAocHJvcHMpe1xyXG4gICAgY29uc3Qge2NoaWxkcmVuLGhvcml6b250YWxBbGlnbm1lbnR9PXByb3BzXHJcblxyXG5yZXR1cm4gPHVsIGNsYXNzTmFtZT17YG5hdiAke2hvcml6b250YWxBbGlnbm1lbnQgJiYgaG9yaXpvbnRhbEFsaWdubWVudH1gfSB7Li4ucHJvcHN9PntjaGlsZHJlbn08L3VsPlxyXG59XHJcblxyXG5cclxuXHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgTmF2YmFyLCB7IE5hdkJhck5hdiwgTmF2SXRlbSwgTmF2TGluaywgTmF2QmFyQ29sbGFwc2UgfSBmcm9tICdjb21wb25lbnRzL25hdi1iYXInXHJcbmltcG9ydCBOYXYgZnJvbSAnY29tcG9uZW50cy9uYXYnXHJcbmltcG9ydCB7IHVzZVVzZXJOYW1lIH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvdXNlVXNlck5hbWUnXHJcbmltcG9ydCB7IHVzZUF1dGggfSBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbidcclxuaW1wb3J0IE5hdkRyb3Bkb3duLCB7IERyb3Bkb3duTWVudSwgRHJvcGRvd25JdGVtIH0gZnJvbSAnY29tcG9uZW50cy9uYXYtYmFyL25hdi1kcm9wZG93bidcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBOYXZpZ2F0aW9uKCkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHVzZVVzZXJOYW1lKClcclxuICBjb25zdCB7IG9uU2lnbk91dCB9ID0gdXNlQXV0aCgpXHJcbiAgcmV0dXJuIDxkaXYgPlxyXG4gICAgPE5hdmJhciBicmFuZD1cIldlYmNvbVwiIGJnPVwiZGFya1wiPlxyXG4gICAgICA8TmF2QmFyQ29sbGFwc2U+XHJcbiAgICAgICAgPE5hdkJhck5hdj5cclxuICAgICAgICAgIDxOYXZJdGVtPlxyXG4gICAgICAgICAgICB7dXNlcm5hbWUgJiYgPE5hdkxpbmsgaWQ9XCJoYW5nb3V0XCIgYXBwUm91dGU9XCIvaGFuZ291dHNcIj5IYW5nb3V0czwvTmF2TGluaz59XHJcbiAgICAgICAgICA8L05hdkl0ZW0+XHJcbiAgICAgICAgPC9OYXZCYXJOYXY+XHJcbiAgICAgICAgPE5hdiBob3Jpem9udGFsQWxpZ25tZW50PVwianVzdGlmeS1jb250ZW50LWVuZFwiPlxyXG4gICAgICAgICAgeyF1c2VybmFtZSAmJiA8TmF2SXRlbT5cclxuICAgICAgICAgICAgPE5hdkxpbmsgaWQ9XCJsb2dpblwiIGFwcFJvdXRlPVwiL2F1dGhcIiBkYXRhLXRlc3RpZD1cImxvZ2luLWxpbmtcIj5TaWduIGluPC9OYXZMaW5rPlxyXG4gICAgICAgICAgPC9OYXZJdGVtPn1cclxuICAgICAgICAgIHshdXNlcm5hbWUgJiYgPE5hdkl0ZW0+XHJcbiAgICAgICAgICAgIDxOYXZMaW5rIGlkPVwic2lnbnVwXCIgYXBwUm91dGU9XCIvYXV0aFwiIGRhdGEtdGVzdGlkPVwic2lnbnVwLWxpbmtcIj5TaWduIHVwPC9OYXZMaW5rPlxyXG4gICAgICAgICAgPC9OYXZJdGVtPn1cclxuICAgICAgICAgIDxOYXZJdGVtPlxyXG4gICAgICAgICAgICB7dXNlcm5hbWUgJiYgPE5hdkxpbmsgaWQ9XCJwcm9maWxlXCIgYXBwUm91dGU9XCIvYXV0aFwiIGRhdGEtdGVzdGlkPVwicHJvZmlsZS1saW5rXCI+V2VsY29tZSwge3VzZXJuYW1lfTwvTmF2TGluaz59XHJcbiAgICAgICAgICA8L05hdkl0ZW0+XHJcbiAgICAgICAgICA8TmF2SXRlbT5cclxuICAgICAgICAgICAge3VzZXJuYW1lICYmIDxOYXZMaW5rIGlkPVwicHJvZmlsZVwiIGFwcFJvdXRlPVwiL2F1dGhcIiBkYXRhLXRlc3RpZD1cInNpZ25vdXQtbGlua1wiIG9uQ2xpY2s9e29uU2lnbk91dH0+U2lnbiBvdXQ8L05hdkxpbms+fVxyXG4gICAgICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICAgIDwvTmF2PlxyXG4gICAgICA8L05hdkJhckNvbGxhcHNlPlxyXG4gICAgPC9OYXZiYXI+XHJcbiAgPC9kaXY+XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIb21lKCkge1xyXG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPSdob21lJyBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5Ib21lPC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5pbXBvcnQgeyBBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IHsgSG9tZSB9IGZyb20gJy4vSG9tZSc7XHJcbmltcG9ydCB7QXV0aEZhdHVyZVJvdXRlc30gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24nXHJcblxyXG5jb25zdCBIYW5nb3V0cyA9IGxhenkoKCkgPT4gaW1wb3J0KCdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL0hhbmdvdXQnKSk7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlcygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDAlJ319PlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9hdXRoXCI+XHJcblxyXG4gICAgPEF1dGhGYXR1cmVSb3V0ZXMvPlxyXG4gICBcclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvXCI+XHJcbiAgICAgICAgPEhvbWUgLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuXHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICBcclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEFwcE5hdmlnYXRpb24gfSBmcm9tICcuL0FwcE5hdmlnYXRpb24nXHJcbmltcG9ydCB7IEFwcFJvdXRlcyB9IGZyb20gJy4vQXBwUm91dGVzJ1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgPlxyXG4gICAgICA8QXBwTmF2aWdhdGlvbiAvPlxyXG4gICAgICA8QXBwUm91dGVzIC8+XHJcbiAgICAgIHsnJ31cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlcnMgfSBmcm9tICcuL0FwcFByb3ZpZGVycyc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxuUGFyc2UuaW5pdGlhbGl6ZShcInp0dHBucVRyOHJlZmt0QldOZWtaaFp4U3h3UGFBQW5FbFE5azdDdUFcIixcIlE3U0hTRkxHNjE4aXpieVNNcEFzRkFxZ25PTGFZZ3hObHdmRmhPQXJcIik7IC8vUEFTVEUgSEVSRSBZT1VSIEJhY2s0QXBwIEFQUExJQ0FUSU9OIElEIEFORCBZT1VSIEphdmFTY3JpcHQgS0VZXHJcblBhcnNlLnNlcnZlclVSTCA9IGBodHRwczovLyR7aXB9OjEzMzcvcGFyc2VgXHJcbi8vUGFyc2UubGl2ZVF1ZXJ5U2VydmVyVVJMID0gYGh0dHBzOi8vJHtpcH06MTMzNy9wYXJzZWBcclxuLy9QYXJzZS5zZXJ2ZXJVUkwgPSAnaHR0cHM6Ly9wYXJzZWFwaS5iYWNrNGFwcC5jb20vJ1xyXG4vL1BhcnNlLmxpdmVRdWVyeVNlcnZlclVSTCA9IGB3c3M6Ly93ZWJhcGlzLmJhY2s0YXBwLmlvYFxyXG5yZW5kZXIoXHJcbiAgPEFwcFByb3ZpZGVycz5cclxuICAgIDxBcHAgLz5cclxuICA8L0FwcFByb3ZpZGVycz4sXHJcblxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiRmVhdHVyZVJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImRpc3BhdGNoIiwiZmluZCIsInVzZUFwcFJvdXRlIiwibmFtZSIsIm9uQXBwUm91dGUiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsIkFwcFJvdXRlIiwiQXBwUm91dGVQcm92aWRlciIsImluaXRTdGF0ZSIsInVzZVJlZHVjZXIiLCJ1c2VFZmZlY3QiLCJnZXRJdGVtIiwicGFyc2UiLCJ2YWx1ZSIsInVzZU1lbW8iLCJTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRCIsIlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BREVEX01FU1NBR0VTIiwiU0VBUkNIX0lOUFVUX0NIQU5HRSIsIlNFTEVDVEVEX0hBTkdPVVQiLCJDTEVBUkVEX0hBTkdPVVQiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkVSUk9SX1JFQ0lFVkVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJTRVJWRVJfTUVTU0FHRV9SRUNJRVZFRCIsIk1FU1NBR0VTX1VQREFURUQiLCJIQU5HT1VUU19VUERBVEVEIiwiSEFOR09VVF9VUERBVEVEIiwiVU5SRUFEX0hBTkdPVVRTX1VQREFURUQiLCJDT05ORUNUSU5HIiwiT1BFTiIsIkNMT1NJTkciLCJDTE9TRUQiLCJTT0NLRVRfUkVBRFkiLCJTT0NLRVRfRVJST1IiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJ1bnJlYWRoYW5nb3V0cyIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwic29ja2V0IiwicmVhZHlTdGF0ZSIsInNvY2tldE1lc3NhZ2UiLCJmZXRjaEhhbmdvdXRzIiwicGVuZGluZ0hhbmdvdXQiLCJtZXNzYWdlIiwidGV4dCIsIkZFVENIX1VTRVJfRkFJTEVEIiwiRklMVEVSX0hBTkdPVVRTIiwiZmlsdGVyIiwidXNlcm5hbWUiLCJpbmNsdWRlcyIsImhhbmdvdXRTdGF0ZXMiLCJJTlZJVEVSIiwiQUNDRVBURVIiLCJERUNMSU5FUiIsIkJMT0NLRVIiLCJVTkJMT0NLRVIiLCJNRVNTQU5HRVIiLCJJTlZJVEVEIiwiQUNDRVBURUQiLCJERUNMSU5FRCIsIkJMT0NLRUQiLCJVTkJMT0NLRUQiLCJNRVNTQUdFRCIsInVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQiLCJvZmZsaW5lIiwidGltZXN0YW1wIiwiZGVsaXZlcmVkSGFuZ291dCIsImRlbGl2ZXJlZCIsImhhbmdvdXRLZXkiLCJoYW5nb3V0SW5kZXgiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJ1cGRhdGVEZWxpdmVyZWRNZXNzYWdlIiwidXBkYXRlQm9ja2VkU3RhdGUiLCJvZmZsaW5lSGFuZ291dEtleSIsIm9mZmxpbmVoYW5nb3V0cyIsImRlbGl2ZXJlZE1lc3NhZ2UiLCJtZXNzYWdlS2V5IiwiYmxvY2tlZE1lc3NhZ2UiLCJzYXZlTWVzc2FnZWQiLCJzYXZlSW52aXRlZCIsInNhdmVBY2NlcHRlZCIsInNhdmVEZWNsaW5lZCIsInNhdmVCbG9ja2VkIiwic2F2ZVVuYmxvdmtlZCIsInNhdmVSZWNpZXZlZEhhbmdvdXQiLCJmb2N1c2VkSGFuZ291dCIsInVucmVhZCIsImhhbmdvdXRFeGlzdCIsImhnIiwicmVhZCIsInVwZGF0ZWRIYW5nb3V0cyIsInNhdmVSZWNpZXZlZE1lc3NhZ2UiLCJzYXZlVW5yZWFkSGFuZ291dCIsInVwZGF0ZWRNZXNzYWdlcyIsInVucmVhZGhhbmdvdXRzS2V5IiwidXBkYXRlZHVucmVhZHMiLCJzYXZlSW52aXRlciIsInNhdmVBY2NlcHRlciIsInNhdmVCbG9ja2VyIiwic2F2ZURlY2xpbmVyIiwic2F2ZU1lc3NhbmdlciIsInNhdmVVbmJsb2NrZXIiLCJ1c2VNZXNzYWdlIiwiaGFuZGxlQWNrbm93bGVkZ2VtZW50IiwiaGFuZGxlSGFuZ291dCIsImhhbmRsZUhhbmdvdXRzIiwiZm9yRWFjaCIsImxvYWRIYW5nb3V0cyIsInNlbGVjdFVucmVhZCIsImNoYW5nZU1lc3NhZ2VUZXh0IiwibG9hZE1lc3NhZ2VzIiwia2V5IiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUIiwiU0lHTlVQX1NUQVJURUQiLCJTSUdOVVBfU1VDQ0VTUyIsIlNJR05VUF9GQUlMRUQiLCJDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCIsIkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTIiwiQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyIsIlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEIiwiR09UX1RPS0VOX0ZST01fVVJMIiwiUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFIiwiU0VSVkVSX0VSUk9SX1JFQ0lFVkVEIiwiQ09OU1RSQUlOVF9WQUxJREFUSU9OIiwibG9naW4iLCJzaWdudXAiLCJjaGFuZ2VQYXNzd29yZCIsInJlcXVlc3RQYXNzQ2hhbmdlIiwidmFsaWRhdGlvbiIsImlzVmFsaWQiLCJ1bmRlZmluZWQiLCJlbWFpbCIsInBhc3N3b3JkIiwiY29uZmlybSIsImVtYWlsb3J1c2VybmFtZSIsInN1Y2Nlc3MiLCJjdXJyZW50IiwidG9rZW4iLCJhdXRoRmVlZGJhY2siLCJhdXRoUmVkdWNlciIsIm5leHRTdGF0ZSIsImFjY291bnRBbHJlYWR5RXhpdHMiLCJjcmVkZW50aWFsSW52YWxpZCIsInVzZXJuYW1lSXNUYWtlbiIsImVtYWlsSXNSZWdpc3RlcmVkIiwidXNlcm5hbWVJbnZhbGlkIiwicGFzc3dvcmRJbnZhbGlkIiwiZW1haWxJbnZhbGlkIiwiZW1haWxJc05vdFJlZ2lzdGVyZWQiLCJlbXB0eVBhc3N3b3JkTm90VmFsaWQiLCJlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZCIsInVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkIiwicGFzc3dvcmREb05vdE1hdGNoIiwidG9rZW5FeHBpcmVkIiwic2VydmVyVmFsaWRhdGlvblJhbmdlIiwic3RhdHVzIiwiSU5WQUxJRF9QQVNTV09SRCIsIklOVkFMSURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJQQVNTV09SRFNfRE9fTk9UX01BVENIIiwiQUNDT1VOVF9BTFJFQURZX0VYSVNUUyIsIlJFUVVJUkVEX0ZJRUxEIiwic2VydmVyVmFsaWRhdGlvbiIsImh0dHBTdGF0dXMiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCIsInBhc3N3b3JkQ29uc3RyYWludCIsInZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50IiwidXNlcm5hbWVDb25zdHJhaW50IiwidmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUiLCJ2YWxpZGF0ZUVtcHR5U3RyaW5nIiwibGVuZ3RoIiwiY3YiLCJQYXJzZSIsIlVzZXIiLCJzZXQiLCJzaWduVXAiLCJ3aW5kb3ciLCJnZXQiLCJvYmplY3RJZCIsImlkIiwiSGFuZ291dFVzZXIiLCJPYmplY3QiLCJleHRlbmQiLCJoYW5nb3V0VXNlciIsInNhdmUiLCJjb2RlIiwibG9nSW4iLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwiZm9yZ290UGFzc3dvcmQiLCJmb3JtRGlzcGF0Y2giLCJyZXF1ZXN0UGFzc3dvcmRSZXNldCIsInJlc3VsdCIsIlBhcnNlQXV0aFNlcnZpY2UiLCJhY3Rpb25zIiwiQXV0aEFkYXB0ZXIiLCJBdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwidXNlVXNlck5hbWUiLCJ1c2VyTmFtZSIsInNldFVzZXJuYW1lIiwidXNlU3RhdGUiLCJzZXRUb2tlbiIsInNldEVtYWlsIiwic2V0T2JqZWN0SWQiLCJ1cGRhdGVSZWFkSGFuZ291dHMiLCJ1cGRhdGVkdW5yZWFkIiwibWFwIiwidXBkYXRlUmVhZE1lc3NzYWdlcyIsIkhhbmdvdXRDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJIYW5nb3V0c1Byb3ZpZGVyIiwiaGFuZGxlTWVzc2FnZSIsInVwZGF0ZWQiLCJ1c2VBdXRoIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJvbkxvZ2luIiwib25TaWdudXAiLCJvblJlcXVlc3RQYXNzd29yZENoYW5nZSIsIm9uUGFzc3dvcmRDaGFuZ2UiLCJvblNpZ25PdXQiLCJyZW1vdmVJdGVtIiwib25Mb2dpbkJsdXIiLCJvblNpZ251cEJsdXIiLCJvbkNoYW5nZVBhc3NCbHVyIiwib25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIiLCJvbkZvY3VzIiwiRSIsInciLCJDIiwibCIsIkEiLCJGIiwiTiIsIk0iLCJQIiwiaCIsIkQiLCJIIiwiJCIsInEiLCJMb2dpbiIsImxhenkiLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwiUHJvZmlsZSIsIkF1dGhGZWF0dXJlUm91dGVzIiwiU3VzcGVuc2UiLCJzYXZlUGVuZGluZ0hhbmdvdXQiLCJpc0Jsb2NrZXIiLCJzYXZlSGFuZ291dCIsInNhdmVNZXNzYWdlIiwiYmxvY2tlciIsIkRhdGUiLCJub3ciLCJmbG9hdCIsInNlbmRPZmZsaW5lSGFuZ291dHMiLCJvZmZsaW5lSGFuZ291dHMiLCJmb3JlRWFjaCIsInNlbmQiLCJjb21tYW5kIiwicmVtb3ZlSGFuZ291dEZyb21VbnJlYWQiLCJmaWx0ZXJlZEhhbmdvdXRzIiwidXNlSGFuZ291dHMiLCJhdXRoQ29udGV4dCIsInVzZXJzIiwib25SZW1vdmVVbnJlYWQiLCJjdXJyZW50VGFyZ2V0Iiwib25OYXZpZ2F0aW9uIiwic3RvcFByb3BhZ2F0aW9uIiwib25TZWxlY3RIYW5nb3V0Iiwib25TZWxlY3RVbnJlYWQiLCJvblNlYXJjaElucHV0Iiwib25GZXRjaEhhbmdvdXRzIiwib25NZXNzYWdlVGV4dCIsIm9uSGFuZ291dCIsInVzZXJJZCIsInF1ZXJ5IiwiUXVlcnkiLCJlcXVhbFRvIiwic2VhcmNoUmVzdWx0IiwibWFwcGVkSGFub3V0cyIsImF0dHJpYnV0ZXMiLCJjbGllbnRDb21tYW5kcyIsIklOVklURSIsIkFDQ0VQVCIsIkRFQ0xJTkUiLCJCTE9DSyIsIlVOQkxPQ0siLCJNRVNTQUdFIiwiT05MSU5FIiwic3RhdGVNYXBwZXIiLCJzZW5kZXJTdGF0ZSIsInRhcmdldFN0YXRlIiwiUGFyc2VTZXJ2ZXIiLCJzZW5kSGFuZ291dCIsInN1YlNjcmliZVRvVW5yZWFkSGFuZ291dCIsInN1YlNjcmliZVRvSGFuZ291dCIsIkxpdmVRdWVyeSIsIm9uIiwidW5yZWFkaGFuZ291dCIsInJlbW92ZVVucmVhZEhhbmdvdXQiLCJVbnJlYWRIYW5nb3V0IiwiZGVzdHJveSIsInN1YnNjcmlwdGlvbiIsInN1YnNjcmliZSIsIm9iamVjdCIsIkhhbmdvdXQiLCJTZW5kZXJVc2VyIiwic2VuZGVyUXVlcnkiLCJzZW5kZXJVc2VyIiwiZmlyc3QiLCJUYXJnZXRVc2VyIiwidGFyZ2V0UXVlcnkiLCJ0YXJnZXRVc2VyIiwic2VuZGVyIiwidXNlcmlkIiwiYWRkVW5pcXVlIiwidGFyZ2V0SGFuZ291dCIsInNlbmRlckhhbmdvdXQiLCJ1bnJlYWRUYXJnZXQiLCJIYW5nb3V0QWRhcHRlciIsIkFwcFByb3ZpZGVycyIsImlwIiwiTmF2YmFyIiwiYmciLCJicmFuZCIsIk5hdkJhckNvbGxhcHNlIiwiTmF2QmFyTmF2IiwiTmF2SXRlbSIsIk5hdkxpbmsiLCJhcHBSb3V0ZSIsImhhbmRsZVJvdXRlIiwicHJldmVudERlZmF1bHQiLCJOYXYiLCJob3Jpem9udGFsQWxpZ25tZW50IiwiQXBwTmF2aWdhdGlvbiIsIkhvbWUiLCJwYWRkaW5nVG9wIiwiSGFuZ291dHMiLCJBcHBSb3V0ZXMiLCJoZWlnaHQiLCJBdXRoRmF0dXJlUm91dGVzIiwiQXBwIiwiaW5pdGlhbGl6ZSIsInNlcnZlclVSTCIsInJlbmRlciIsImRvY3VtZW50IiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxPQUFPLEdBQUc7QUFDZCxFQUFFLFlBQVksRUFBRSxpQkFBaUIsSUFBSSxJQUFJO0FBQ3pDLEVBQUUsUUFBUSxFQUFFLFFBQVEsSUFBSSxJQUFJLElBQUksVUFBVSxJQUFJLE1BQU07QUFDcEQsRUFBRSxJQUFJO0FBQ04sSUFBSSxZQUFZLElBQUksSUFBSTtBQUN4QixJQUFJLE1BQU0sSUFBSSxJQUFJO0FBQ2xCLElBQUksQ0FBQyxXQUFXO0FBQ2hCLE1BQU0sSUFBSTtBQUNWLFFBQVEsSUFBSSxJQUFJLEdBQUU7QUFDbEIsUUFBUSxPQUFPLElBQUk7QUFDbkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsT0FBTyxLQUFLO0FBQ3BCLE9BQU87QUFDUCxLQUFLLEdBQUc7QUFDUixFQUFFLFFBQVEsRUFBRSxVQUFVLElBQUksSUFBSTtBQUM5QixFQUFFLFdBQVcsRUFBRSxhQUFhLElBQUksSUFBSTtBQUNwQyxFQUFDO0FBQ0Q7QUFDQSxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7QUFDekIsRUFBRSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDckQsQ0FBQztBQUNEO0FBQ0EsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO0FBQ3pCLEVBQUUsSUFBSSxXQUFXLEdBQUc7QUFDcEIsSUFBSSxvQkFBb0I7QUFDeEIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSw0QkFBNEI7QUFDaEMsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxzQkFBc0I7QUFDMUIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxzQkFBc0I7QUFDMUIsSUFBSSx1QkFBdUI7QUFDM0IsSUFBSSx1QkFBdUI7QUFDM0IsSUFBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLGlCQUFpQjtBQUN2QixJQUFJLFdBQVcsQ0FBQyxNQUFNO0FBQ3RCLElBQUksU0FBUyxHQUFHLEVBQUU7QUFDbEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRixNQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0EsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQzdCLEVBQUUsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDaEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBQztBQUN2QixHQUFHO0FBQ0gsRUFBRSxJQUFJLDJCQUEyQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM5QyxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsd0NBQXdDLENBQUM7QUFDakUsR0FBRztBQUNILEVBQUUsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQzNCLENBQUM7QUFDRDtBQUNBLFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRTtBQUMvQixFQUFFLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO0FBQ2pDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUM7QUFDekIsR0FBRztBQUNILEVBQUUsT0FBTyxLQUFLO0FBQ2QsQ0FBQztBQUNEO0FBQ0E7QUFDQSxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDNUIsRUFBRSxJQUFJLFFBQVEsR0FBRztBQUNqQixJQUFJLElBQUksRUFBRSxXQUFXO0FBQ3JCLE1BQU0sSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRTtBQUMvQixNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO0FBQ3RELEtBQUs7QUFDTCxJQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUN4QixJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVztBQUMzQyxNQUFNLE9BQU8sUUFBUTtBQUNyQixNQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLFFBQVE7QUFDakIsQ0FBQztBQUNEO0FBQ08sU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ2pDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFFO0FBQ2Y7QUFDQSxFQUFFLElBQUksT0FBTyxZQUFZLE9BQU8sRUFBRTtBQUNsQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQzFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFDO0FBQzlCLEtBQUssRUFBRSxJQUFJLEVBQUM7QUFDWixHQUFHLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLE1BQU0sRUFBRTtBQUNyQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN2QyxLQUFLLEVBQUUsSUFBSSxFQUFDO0FBQ1osR0FBRyxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ3RCLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRTtBQUMvRCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBQztBQUN0QyxLQUFLLEVBQUUsSUFBSSxFQUFDO0FBQ1osR0FBRztBQUNILENBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNqRCxFQUFFLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxFQUFDO0FBQzVCLEVBQUUsS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUM7QUFDL0IsRUFBRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQztBQUMvQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLE1BQUs7QUFDN0QsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLElBQUksRUFBRTtBQUM3QyxFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUM7QUFDdEMsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxJQUFJLEVBQUU7QUFDdkMsRUFBRSxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBQztBQUM1QixFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7QUFDL0MsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxJQUFJLEVBQUU7QUFDdkMsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRCxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDOUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUM7QUFDdkQsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ3hELEVBQUUsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQzdCLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QyxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUN4RCxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFdBQVc7QUFDcEMsRUFBRSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ2hCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDckMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQztBQUNwQixHQUFHLEVBQUM7QUFDSixFQUFFLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQztBQUMzQixFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxXQUFXO0FBQ3RDLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRTtBQUNoQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUU7QUFDL0IsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQztBQUNyQixHQUFHLEVBQUM7QUFDSixFQUFFLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQztBQUMzQixFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxXQUFXO0FBQ3ZDLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRTtBQUNoQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBQztBQUM3QixHQUFHLEVBQUM7QUFDSixFQUFFLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQztBQUMzQixFQUFDO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDdEIsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQU87QUFDaEUsQ0FBQztBQUNEO0FBQ0EsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQ3hCLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3JCLElBQUksT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3hELEdBQUc7QUFDSCxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSTtBQUN0QixDQUFDO0FBQ0Q7QUFDQSxTQUFTLGVBQWUsQ0FBQyxNQUFNLEVBQUU7QUFDakMsRUFBRSxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVztBQUMvQixNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDO0FBQzVCLE1BQUs7QUFDTCxJQUFJLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUNoQyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDO0FBQzFCLE1BQUs7QUFDTCxHQUFHLENBQUM7QUFDSixDQUFDO0FBQ0Q7QUFDQSxTQUFTLHFCQUFxQixDQUFDLElBQUksRUFBRTtBQUNyQyxFQUFFLElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxHQUFFO0FBQy9CLEVBQUUsSUFBSSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBQztBQUN2QyxFQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUM7QUFDaEMsRUFBRSxPQUFPLE9BQU87QUFDaEIsQ0FBQztBQUNEO0FBQ0EsU0FBUyxjQUFjLENBQUMsSUFBSSxFQUFFO0FBQzlCLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEdBQUU7QUFDL0IsRUFBRSxJQUFJLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFDO0FBQ3ZDLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUM7QUFDekIsRUFBRSxPQUFPLE9BQU87QUFDaEIsQ0FBQztBQUNEO0FBQ0EsU0FBUyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7QUFDcEMsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUM7QUFDaEMsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDO0FBQ3BDO0FBQ0EsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQztBQUMzQyxHQUFHO0FBQ0gsRUFBRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFDRDtBQUNBLFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUMxQixFQUFFLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtBQUNqQixJQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkIsR0FBRyxNQUFNO0FBQ1QsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFDO0FBQzdDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBQztBQUNqQyxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU07QUFDdEIsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBLFNBQVMsSUFBSSxHQUFHO0FBQ2hCLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFLO0FBQ3ZCO0FBQ0EsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQ2xDLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFJO0FBQ3pCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNmLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFFO0FBQ3pCLEtBQUssTUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUN6QyxNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSTtBQUMzQixLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ25FLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFJO0FBQzNCLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDM0UsTUFBTSxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUk7QUFDL0IsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxlQUFlLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN0RixNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRTtBQUN0QyxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3hFLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDO0FBQ3REO0FBQ0EsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUM7QUFDeEQsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQzlHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUM7QUFDL0MsS0FBSyxNQUFNO0FBQ1gsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQ2xFLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUFFO0FBQzNDLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDcEMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsMEJBQTBCLEVBQUM7QUFDcEUsT0FBTyxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtBQUN4RCxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBQztBQUM3RCxPQUFPLE1BQU0sSUFBSSxPQUFPLENBQUMsWUFBWSxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3hGLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGlEQUFpRCxFQUFDO0FBQzNGLE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDcEIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVc7QUFDM0IsTUFBTSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFDO0FBQ25DLE1BQU0sSUFBSSxRQUFRLEVBQUU7QUFDcEIsUUFBUSxPQUFPLFFBQVE7QUFDdkIsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDMUIsUUFBUSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUM5QyxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDeEMsUUFBUSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDckMsUUFBUSxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDO0FBQy9ELE9BQU8sTUFBTTtBQUNiLFFBQVEsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsT0FBTztBQUNQLE1BQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXO0FBQ2xDLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDakMsUUFBUSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLE1BQU07QUFDYixRQUFRLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPO0FBQ1AsTUFBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXO0FBQ3pCLElBQUksSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBQztBQUNqQyxJQUFJLElBQUksUUFBUSxFQUFFO0FBQ2xCLE1BQU0sT0FBTyxRQUFRO0FBQ3JCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ3hCLE1BQU0sT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUMzQyxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDdEMsTUFBTSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUUsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNuQyxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUM7QUFDN0QsS0FBSyxNQUFNO0FBQ1gsTUFBTSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUM1QyxLQUFLO0FBQ0wsSUFBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDeEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVc7QUFDL0IsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3JDLE1BQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVztBQUN6QixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLElBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxJQUFJO0FBQ2IsQ0FBQztBQUNEO0FBQ0E7QUFDQSxJQUFJLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO0FBQ2pFO0FBQ0EsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQ2pDLEVBQUUsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRTtBQUNwQyxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsTUFBTTtBQUN6RCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ3hDLEVBQUUsT0FBTyxHQUFHLE9BQU8sSUFBSSxHQUFFO0FBQ3pCLEVBQUUsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUk7QUFDekI7QUFDQSxFQUFFLElBQUksS0FBSyxZQUFZLE9BQU8sRUFBRTtBQUNoQyxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUN4QixNQUFNLE1BQU0sSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDO0FBQ3pDLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUc7QUFDeEIsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxZQUFXO0FBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDMUIsTUFBTSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUM7QUFDL0MsS0FBSztBQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTTtBQUM5QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUk7QUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFNO0FBQzlCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtBQUMxQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsVUFBUztBQUM1QixNQUFNLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSTtBQUMzQixLQUFLO0FBQ0wsR0FBRyxNQUFNO0FBQ1QsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUM7QUFDNUIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxjQUFhO0FBQzdFLEVBQUUsSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUN4QyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQztBQUMvQyxHQUFHO0FBQ0gsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFDO0FBQ3ZFLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSTtBQUMvQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTTtBQUM3QyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSTtBQUN0QjtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssTUFBTSxLQUFLLElBQUksRUFBRTtBQUNqRSxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsMkNBQTJDLENBQUM7QUFDcEUsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUM7QUFDdEIsQ0FBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsV0FBVztBQUNyQyxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsRCxFQUFDO0FBQ0Q7QUFDQSxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDdEIsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsR0FBRTtBQUMzQixFQUFFLElBQUk7QUFDTixLQUFLLElBQUksRUFBRTtBQUNYLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUNmLEtBQUssT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQzdCLE1BQU0sSUFBSSxLQUFLLEVBQUU7QUFDakIsUUFBUSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQztBQUNwQyxRQUFRLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztBQUNwRCxRQUFRLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7QUFDdkQsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFDO0FBQ3hFLE9BQU87QUFDUCxLQUFLLEVBQUM7QUFDTixFQUFFLE9BQU8sSUFBSTtBQUNiLENBQUM7QUFDRDtBQUNBLFNBQVMsWUFBWSxDQUFDLFVBQVUsRUFBRTtBQUNsQyxFQUFFLElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxHQUFFO0FBQzdCO0FBQ0E7QUFDQSxFQUFFLElBQUksbUJBQW1CLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFDO0FBQ25FLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRTtBQUM1RCxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksR0FBRTtBQUNsQyxJQUFJLElBQUksR0FBRyxFQUFFO0FBQ2IsTUFBTSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRTtBQUN4QyxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBQztBQUNoQyxLQUFLO0FBQ0wsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLE9BQU87QUFDaEIsQ0FBQztBQUNEO0FBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFDO0FBQzVCO0FBQ08sU0FBUyxRQUFRLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUM1QyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsSUFBSSxPQUFPLEdBQUcsR0FBRTtBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBUztBQUN2QixFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sS0FBSyxTQUFTLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFNO0FBQ25FLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUc7QUFDbkQsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFJO0FBQ3ZFLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFDO0FBQzdDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUU7QUFDOUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBQztBQUMxQixDQUFDO0FBQ0Q7QUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUM7QUFDN0I7QUFDQSxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxXQUFXO0FBQ3RDLEVBQUUsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ3RDLElBQUksTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ3ZCLElBQUksVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQy9CLElBQUksT0FBTyxFQUFFLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDdEMsSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7QUFDakIsR0FBRyxDQUFDO0FBQ0osRUFBQztBQUNEO0FBQ0EsUUFBUSxDQUFDLEtBQUssR0FBRyxXQUFXO0FBQzVCLEVBQUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUM7QUFDaEUsRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQU87QUFDekIsRUFBRSxPQUFPLFFBQVE7QUFDakIsRUFBQztBQUNEO0FBQ0EsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUM7QUFDaEQ7QUFDQSxRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUMxQyxFQUFFLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQy9DLElBQUksTUFBTSxJQUFJLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztBQUMvQyxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2RSxFQUFDO0FBQ0Q7QUFDTyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBWTtBQUMzQyxJQUFJO0FBQ0osRUFBRSxJQUFJLFlBQVksR0FBRTtBQUNwQixDQUFDLENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDZCxFQUFFLFlBQVksR0FBRyxTQUFTLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDekMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQU87QUFDMUIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUk7QUFDcEIsSUFBSSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFDO0FBQzlCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBSztBQUM1QixJQUFHO0FBQ0gsRUFBRSxZQUFZLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBQztBQUN6RCxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLGFBQVk7QUFDbkQsQ0FBQztBQUNEO0FBQ08sU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNuQyxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9DLElBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksRUFBQztBQUMxQztBQUNBLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ2xELE1BQU0sT0FBTyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzlELEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEdBQUU7QUFDbEM7QUFDQSxJQUFJLFNBQVMsUUFBUSxHQUFHO0FBQ3hCLE1BQU0sR0FBRyxDQUFDLEtBQUssR0FBRTtBQUNqQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsV0FBVztBQUM1QixNQUFNLElBQUksT0FBTyxHQUFHO0FBQ3BCLFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO0FBQzFCLFFBQVEsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVO0FBQ2xDLFFBQVEsT0FBTyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDaEUsUUFBTztBQUNQLE1BQU0sT0FBTyxDQUFDLEdBQUcsR0FBRyxhQUFhLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFDO0FBQ2pHLE1BQU0sSUFBSSxJQUFJLEdBQUcsVUFBVSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxhQUFZO0FBQ3BFLE1BQU0sT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBQztBQUMxQyxNQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUM3QixNQUFNLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFDO0FBQ3JELE1BQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLFNBQVMsR0FBRyxXQUFXO0FBQy9CLE1BQU0sTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLEVBQUM7QUFDckQsTUFBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsT0FBTyxHQUFHLFdBQVc7QUFDN0IsTUFBTSxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxFQUFDO0FBQ3ZELE1BQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFDO0FBQy9DO0FBQ0EsSUFBSSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO0FBQzNDLE1BQU0sR0FBRyxDQUFDLGVBQWUsR0FBRyxLQUFJO0FBQ2hDLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssTUFBTSxFQUFFO0FBQy9DLE1BQU0sR0FBRyxDQUFDLGVBQWUsR0FBRyxNQUFLO0FBQ2pDLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxjQUFjLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDL0MsTUFBTSxHQUFHLENBQUMsWUFBWSxHQUFHLE9BQU07QUFDL0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDbEQsTUFBTSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBQztBQUN2QyxLQUFLLEVBQUM7QUFDTjtBQUNBLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3hCLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFDO0FBQ3hEO0FBQ0EsTUFBTSxHQUFHLENBQUMsa0JBQWtCLEdBQUcsV0FBVztBQUMxQztBQUNBLFFBQVEsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtBQUNsQyxVQUFVLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQztBQUMvRCxTQUFTO0FBQ1QsUUFBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLE9BQU8sQ0FBQyxTQUFTLEtBQUssV0FBVyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFDO0FBQ2pGLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRDtBQUNBLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSTtBQUNyQjtBQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2pCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFLO0FBQ3BCLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFPO0FBQ3hCLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFPO0FBQ3hCLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFRO0FBQzFCOztBQ25nQkcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyw4REFBOEQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQSxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBd08sU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0wsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFrRCxTQUFTYyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNiLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDTyxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQXlOLFNBQVMsQ0FBQyxFQUFFLENBQUNFLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNiLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNQLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDSixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYyxHQUFDLENBQUMsQ0FBQ2QsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZSxHQUFDLENBQUMsQ0FBQ2YsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUdGLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUVELEdBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FB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Q0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSUMsR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPRCxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRUEsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0UsQ0FBQyxDQUFDLENBQW9ULElBQUlDLEdBQUMsQ0FBQzFTLENBQUMsQ0FBQyxHQUFHLENBQStLQSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzBTLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUksSUFBaVJDLEdBQUMsQ0FBQzNTLENBQUMsQ0FBQyxJQUFJLFNBQVM0UyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNOLEdBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUNNLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBT3pTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDSixDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDMlMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUYsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ3hTLENBQUMsQ0FBQ3FTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSUssR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJTCxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFvZSxJQUFJRSxHQUFDLENBQUMsa09BQWtPLENBQUNQLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLElBQUlRLEdBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBNk0sSUFBSSxDQUFDLENBQUNqVCxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJa1QsR0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDblQsQ0FBQyxDQUFDLEtBQUssQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNpVCxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHQyxHQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsQ0FBQyxHQUFHSCxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENB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
