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
  CONSTRAINT_VALIDATION: 'CONSTRAINT_VALIDATION',
  SET_ERROR_TO_NULL: 'SET_ERROR_TO_NULL'
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
    case actionTypes$2.SET_ERROR_TO_NULL:
      return { ...state,
        error: null
      };

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
    dispatch({
      type: actionTypes$2.SET_ERROR_TO_NULL
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

const Login = L(() => import('./Login-eeebc483.js'));
const ChangePassword = L(() => import('./ChangePassword-5af57d36.js'));
const ForgotPassword = L(() => import('./ForgotPassword-076a7a61.js'));
const Signup = L(() => import('./Signup-d66e5bbd.js'));
const Profile = L(() => import('./Profile-6fd7a394.js'));
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
    socketUrl: `wss://${"192.168.43.49"}:3000`
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

const Hangouts = L(() => import('./Hangout-06b5a9bc.js'));
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

Parse.serverURL = `https://${"192.168.43.49"}:1337/parse`; //Parse.liveQueryServerURL = `https://${"192.168.43.49"}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
//Parse.liveQueryServerURL = `wss://webapis.back4app.io`

H(h(AppProviders, null, h(App, null)), document.body);

export { _extends as _, h, useAppRoute as u };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYTQyNmY5ODkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2FwcC1yb3V0ZS9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvdXBkYXRlRGVsaXZlcmVkSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3NhdmVSZWNpZXZlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS91c2VNZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdmFsaWRhdGlvbi9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3ZhbGlkYXRpb25NZXNzYWdlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3NlcnZlckVycm9yQWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3ZhbGlkYXRpb25SZWdleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL2NvbnN0cmFpbnRWYWxpZGF0b3JzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3NlcnZpY2VzL3BhcnNlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc2VydmljZXMvcGFyc2UvUGFyc2VBdXRoU2VydmljZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9BdXRoQWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9BdXRoUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvdXNlVXNlck5hbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy91cGRhdGVSZWFkSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VBdXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9jb21wYXQvZGlzdC9jb21wYXQubW9kdWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL0F1dGhGZWF0dXJlUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc2VydmljZXMvcGFyc2UvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9zdGF0ZU1hcHBlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zZXJ2aWNlcy9wYXJzZS9QYXJzZVNlcnZlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0QWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwUHJvdmlkZXJzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbmF2LWJhci9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL25hdi9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwTmF2aWdhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvSG9tZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9BcHAuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwcy93ZWJjb20tYXBwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBzdXBwb3J0ID0ge1xuICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICBibG9iOlxuICAgICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmXG4gICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbn1cblxuZnVuY3Rpb24gaXNEYXRhVmlldyhvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG59XG5cbmlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICBdXG5cbiAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICBBcnJheUJ1ZmZlci5pc1ZpZXcgfHxcbiAgICBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gIH1cbiAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgfVxuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG5mdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvclxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpdGVyYXRvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gIHRoaXMubWFwID0ge31cblxuICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICB9LCB0aGlzKVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSArICcsICcgKyB2YWx1ZSA6IHZhbHVlXG59XG5cbkhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2gobmFtZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaXRlbXMucHVzaCh2YWx1ZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5pZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xufVxuXG5mdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICB9XG4gIGJvZHkuYm9keVVzZWQgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICB9XG4gICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICB9XG4gIHJldHVybiBjaGFycy5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgaWYgKGJ1Zi5zbGljZSkge1xuICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgfSBlbHNlIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gIH1cbn1cblxuZnVuY3Rpb24gQm9keSgpIHtcbiAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5ID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbnZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICByZXR1cm4gbWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEgPyB1cGNhc2VkIDogbWV0aG9kXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICB9XG4gICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgdGhpcy5zaWduYWwgPSBpbnB1dC5zaWduYWxcbiAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgfVxuXG4gIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJ1xuICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIH1cbiAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICB0aGlzLnNpZ25hbCA9IG9wdGlvbnMuc2lnbmFsIHx8IHRoaXMuc2lnbmFsXG4gIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgfVxuICB0aGlzLl9pbml0Qm9keShib2R5KVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywge2JvZHk6IHRoaXMuX2JvZHlJbml0fSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICBib2R5XG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnJicpXG4gICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gIHJldHVybiBmb3JtXG59XG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMwI3NlY3Rpb24tMy4yXG4gIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGhlYWRlcnNcbn1cblxuQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxufVxuXG5Cb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgdXJsOiB0aGlzLnVybFxuICB9KVxufVxuXG5SZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cblJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxufVxuXG5leHBvcnQgdmFyIERPTUV4Y2VwdGlvbiA9IHNlbGYuRE9NRXhjZXB0aW9uXG50cnkge1xuICBuZXcgRE9NRXhjZXB0aW9uKClcbn0gY2F0Y2ggKGVycikge1xuICBET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB2YXIgZXJyb3IgPSBFcnJvcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFja1xuICB9XG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERPTUV4Y2VwdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwgJiYgcmVxdWVzdC5zaWduYWwuYWJvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICB9XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICB9XG5cbiAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgfSlcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCkge1xuICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBET05FIChzdWNjZXNzIG9yIGZhaWx1cmUpXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICB9KVxufVxuXG5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcblxuaWYgKCFzZWxmLmZldGNoKSB7XG4gIHNlbGYuZmV0Y2ggPSBmZXRjaFxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG59XG4iLCJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xyXG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcclxuICAvLyAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcbiAgY29uc3Qge25hbWV9PXN0YXRlXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBpZihuYW1lKXtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obmFtZSxKU09OLnN0cmluZ2lmeSh7cm91dGUsZmVhdHVyZVJvdXRlfSkpXHJcbiAgICB9XHJcbiAgIFxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGlmKHN0YXRlICYmIHN0YXRlLm5hbWUgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSkpe1xyXG4gXHJcbiAgICAgICAgY29uc3Qge2ZlYXR1cmVSb3V0ZSxyb3V0ZX09IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0YXRlLm5hbWUpKVxyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gICAgfVxyXG5cclxuICB9LFtdKVxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xyXG4gICAgU0VORElOR19IQU5HT1VUX1NUQVJURUQ6J1NFTkRJTkdfSEFOR09VVF9TVEFSVEVEJyxcclxuICAgIFNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEOidTRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRCcsXHJcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxyXG5cclxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcclxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXHJcbiBcclxuICAgIFNFQVJDSF9JTlBVVF9DSEFOR0U6ICdTRUFSQ0hfSU5QVVRfQ0hBTkdFJyxcclxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcclxuICAgIENMRUFSRURfSEFOR09VVDonQ0xFQVJFRF9IQU5HT1VUJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXHJcbiAgICBFUlJPUl9SRUNJRVZFRDonRVJST1JfUkVDSUVWRUQnLFxyXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXHJcblxyXG4gICAgU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQ6J1NFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEJyxcclxuXHJcbiAgICBcclxuICAgIE1FU1NBR0VTX1VQREFURUQ6J01FU1NBR0VTX1VQREFURUQnLFxyXG4gICAgSEFOR09VVFNfVVBEQVRFRDonSEFOR09VVFNfVVBEQVRFRCcsXHJcbiAgICBIQU5HT1VUX1VQREFURUQ6J0hBTkdPVVRfVVBEQVRFRCcsXHJcbiAgICBVTlJFQURfSEFOR09VVFNfVVBEQVRFRDonVU5SRUFEX0hBTkdPVVRTX1VQREFURUQnLFxyXG4gICAgLy9TT0NLRVRcclxuXHJcbiAgICBDT05ORUNUSU5HOidDT05ORUNUSU5HJyxcclxuICAgIE9QRU46J09QRU4nLFxyXG4gICAgQ0xPU0lORzonQ0xPU0lORycsXHJcbiAgICBDTE9TRUQ6J0NMT1NFRCcsXHJcbiAgICBTT0NLRVRfUkVBRFk6J1NPQ0tFVF9SRUFEWScsXHJcbiAgICBTT0NLRVRfRVJST1I6J1NPQ0tFVF9FUlJPUidcclxuXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGhhbmdvdXRzOiBudWxsLFxyXG4gIGhhbmdvdXQ6IG51bGwsXHJcbiAgdW5yZWFkaGFuZ291dHM6IG51bGwsXHJcbiAgbWVzc2FnZXM6IG51bGwsXHJcbiAgc2VhcmNoOiAnJyxcclxuICB1c2VyOiBbXSxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICBtZXNzYWdlVGV4dDogJycsXHJcbiAgb25saW5lOiBmYWxzZSxcclxuICBzb2NrZXQ6IG51bGwsXHJcbiAgcmVhZHlTdGF0ZTogMCxcclxuICBzb2NrZXRNZXNzYWdlOiBudWxsLFxyXG4gIGZldGNoSGFuZ291dHM6IGZhbHNlLFxyXG4gIHBlbmRpbmdIYW5nb3V0Om51bGwsXHJcbiAgbWVzc2FnZTogbnVsbFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5FUlJPUl9SRUNJRVZFRDpcclxuICAgICAgcmV0dXJuey4uLnN0YXRlLGVycm9yOmFjdGlvbi5lcnJvcn1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQ6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUscGVuZGluZ0hhbmdvdXQ6bnVsbH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHBlbmRpbmdIYW5nb3V0OmFjdGlvbi5wZW5kaW5nSGFuZ291dH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUOlxyXG4gICAgIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogbnVsbCB9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVEOlxyXG5cclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHVucmVhZGhhbmdvdXRzOiBhY3Rpb24udW5yZWFkaGFuZ291dHMgfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQ6XHJcblxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRDpcclxuICAgICBcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQ6XHJcbiAgXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogYWN0aW9uLm1lc3NhZ2VzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yLCBmZXRjaEhhbmdvdXRzOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBmZXRjaEhhbmdvdXRzOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzLCBmZXRjaEhhbmdvdXRzOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cclxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxyXG4gICAgICAgICksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0U6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzZWFyY2g6IGFjdGlvbi5zZWFyY2ggfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxyXG4gICAgICB9O1xyXG4gICAgLy9TT0NLRVRcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX0VSUk9SOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DT05ORUNUSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWTpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJcclxuICBleHBvcnQgY29uc3QgaGFuZ291dFN0YXRlcyA9IHtcclxuICAgIElOVklURVI6ICdJTlZJVEVSJyxcclxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxyXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXHJcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXHJcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxyXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJyxcclxuICAgLy8gYWNrbm93bGVnZW1lbnRcclxuICAgIElOVklURUQ6ICdJTlZJVEVEJyxcclxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxyXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXHJcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXHJcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxyXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCcsXHJcbiAgfTsiLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBuYW1lLCBkaXNwYXRjaCwgaGFuZ291dCwgb2ZmbGluZSwgb25BcHBSb3V0ZSB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSwgdGltZXN0YW1wIH0gPSBoYW5nb3V0O1xyXG5cclxuICBjb25zdCBkZWxpdmVyZWRIYW5nb3V0ID0geyAuLi5oYW5nb3V0LCBkZWxpdmVyZWQ6IHRydWUgfTtcclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkSGFuZ291dCk7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9VUERBVEVELCBoYW5nb3V0OiBkZWxpdmVyZWRIYW5nb3V0IH0pO1xyXG4gIGlmIChtZXNzYWdlKSB7XHJcblxyXG4gICAgdXBkYXRlRGVsaXZlcmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBuYW1lLCBkZWxpdmVyZWRIYW5nb3V0LGhhbmdvdXQgfSk7XHJcbiAgfVxyXG4gIGlmKGhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCcpe1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsbmFtZSxkZWxpdmVyZWRIYW5nb3V0fSlcclxuICB9XHJcbiAgaWYgKG9mZmxpbmUpIHtcclxuICAgIC8vcmVtb3ZlIG9mZmxpbmUgaGFuZ291dFxyXG4gICAgY29uc3Qgb2ZmbGluZUhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcclxuICAgIGNvbnN0IG9mZmxpbmVoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0ob2ZmbGluZUhhbmdvdXRLZXkpKTtcclxuXHJcbiAgICBpZiAob2ZmbGluZWhhbmdvdXRzKSB7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IG9mZmxpbmVoYW5nb3V0cy5maW5kSW5kZXgoXHJcbiAgICAgICAgKG8pID0+IG8udGltZXN0YW1wID09PSB0aW1lc3RhbXBcclxuICAgICAgKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgb2ZmbGluZUhhbmdvdXRLZXksXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkob2ZmbGluZWhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEpKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGVsaXZlcmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBuYW1lLCBkZWxpdmVyZWRIYW5nb3V0IH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xyXG5cclxuICBjb25zdCBkZWxpdmVyZWRNZXNzYWdlID0geyAuLi5tZXNzYWdlLCB1c2VybmFtZTogbmFtZSwgZGVsaXZlcmVkOiB0cnVlIH1cclxuXHJcbiAgLy8gc2F2ZSBtZXNzYWdlIHRvIGxvY2FsU3RvcmFnZVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBtZXNzYWdlcy5maW5kSW5kZXgoXHJcbiAgICAobSkgPT4gbS50aW1lc3RhbXAgPT09IG1lc3NhZ2UudGltZXN0YW1wXHJcbiAgKTtcclxuICBtZXNzYWdlcy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRNZXNzYWdlKTtcclxuICBcclxuXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJvY2tlZFN0YXRlKHtkaXNwYXRjaCxkZWxpdmVyZWRIYW5nb3V0LG5hbWV9KXtcclxuICBkZWJ1Z2dlcjtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xyXG4gIGNvbnN0IGJsb2NrZWRNZXNzYWdlID0geyB0aW1lc3RhbXA6ZGVsaXZlcmVkSGFuZ291dC50aW1lc3RhbXAsIHRleHQ6ICd5b3UgYmxvY2tlZCB0aGlzIHVzZXInLCB1c2VybmFtZTogbmFtZSwgdHlwZTogJ2Jsb2NrZWQnIH1cclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkoIFsuLi5tZXNzYWdlcyxibG9ja2VkTWVzc2FnZV0pKTtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczpbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdIH0pO1xyXG59IiwiaW1wb3J0IHsgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCB9IGZyb20gJy4vdXBkYXRlRGVsaXZlcmVkSGFuZ291dCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3NhZ2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZX0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWNjZXB0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb3ZrZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7aGFuZ291dFN0YXRlc30gIGZyb20gJ3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJ1xyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2lldmVkSGFuZ291dCh7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkLFxyXG59KSB7XHJcblxyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcblxyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcblxyXG4gXHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKGhnPT4gaGcudXNlcm5hbWU9PT11c2VybmFtZSlcclxuICAgIGlmKGhhbmdvdXRFeGlzdCl7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xyXG4gICAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcclxuICAgICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG4gICAgfS8vZW5kIG9mIGhhbmdvdXQgZXhpc3RcclxuZWxzZXtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbLi4uaGFuZ291dHMsXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbLi4uaGFuZ291dHMsXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogdXBkYXRlZEhhbmdvdXRzIH0pO1xyXG59XHJcblxyXG59ZWxzZXtcclxuXHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuXHJcbn1cclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULFxyXG4gICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgIH0pO1xyXG4gICAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XHJcbiAgICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuICAgIHNhdmVSZWNpZXZlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAodW5yZWFkKSB7XHJcblxyXG4gICAgc3dpdGNoKGhhbmdvdXQuc3RhdGUpe1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVSOlxyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSOlxyXG4gICAgICAgIHNhdmVVbnJlYWRIYW5nb3V0KHsgbmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiBcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2lldmVkTWVzc2FnZSh7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG59KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgLy8gc2F2ZSBtZXNzYWdlIHRvIGxvY2FsU3RvcmFnZVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gbnVsbDtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiBmYWxzZSB9XTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogdHJ1ZSB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFt7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiBmYWxzZSB9XTtcclxuICAgIH1cclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcblxyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIC8vIHN5bmMgbWVzc2FnZSB3aXRoIHJlZHVjZXIgc3RhdGVcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVVbnJlYWRIYW5nb3V0KHsgbmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcbiAgXHJcbiAgLy91cGRhdGUgdW5yZWFkIGhhbmdvdXRzXHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcclxuICBsZXQgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWR1bnJlYWRzID0gbnVsbDtcclxuICBpZiAodW5yZWFkaGFuZ291dHMpIHtcclxuICAgIHVwZGF0ZWR1bnJlYWRzID0gWy4uLnVucmVhZGhhbmdvdXRzLCB7Li4uaGFuZ291dCxyZWFkOmZhbHNlfV07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWR1bnJlYWRzID0gW3suLi5oYW5nb3V0LHJlYWQ6ZmFsc2V9XTtcclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWR1bnJlYWRzKSk7XHJcblxyXG4gIGRpc3BhdGNoKHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxyXG4gICAgdW5yZWFkaGFuZ291dHM6IHVwZGF0ZWR1bnJlYWRzLFxyXG4gIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IHNhdmVSZWNpZXZlZEhhbmdvdXQgfSBmcm9tICcuL3NhdmVSZWNpZXZlZEhhbmdvdXQnO1xyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcblxyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3Nhbmdlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCB9KSB7XHJcblxyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59IC8vIEVORCBzYXZlTWVzc2FuZ2VyXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVVuYmxvY2tlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuICBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJ3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJztcclxuaW1wb3J0IHtcclxuICBzYXZlSW52aXRlZCxcclxuICBzYXZlVW5ibG92a2VkLFxyXG4gIHNhdmVEZWNsaW5lZCxcclxuICBzYXZlQmxvY2tlZCxcclxuICBzYXZlQWNjZXB0ZWQsXHJcbiAgc2F2ZU1lc3NhZ2VkLFxyXG59IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMnO1xyXG5pbXBvcnQge1xyXG4gIHNhdmVBY2NlcHRlcixcclxuICBzYXZlQmxvY2tlcixcclxuICBzYXZlRGVjbGluZXIsXHJcbiAgc2F2ZUludml0ZXIsXHJcbiAgc2F2ZU1lc3NhbmdlcixcclxuICBzYXZlVW5ibG9ja2VyLFxyXG59IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZXNzYWdlKHtcclxuICBtZXNzYWdlLFxyXG4gIHVzZXJuYW1lLFxyXG4gIGRpc3BhdGNoLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG59KSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQsb2ZmbGluZSB9KSB7XHJcbiAgICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURUQ6XHJcbiAgICAgXHJcbiAgICAgICAgc2F2ZUludml0ZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRDpcclxuICAgICAgICBzYXZlVW5ibG92a2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FRDpcclxuICAgICAgICBzYXZlRGVjbGluZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRUQ6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZUJsb2NrZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVEOlxyXG4gICAgICAgIHNhdmVBY2NlcHRlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxyXG4gICAgICAgXHJcbiAgICAgICAgc2F2ZU1lc3NhZ2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCwgdW5yZWFkIH0pIHtcclxuICAgIFxyXG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFUjpcclxuICAgICAgICBzYXZlQWNjZXB0ZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFUjpcclxuICAgICAgIFxyXG4gICAgICAgIHNhdmVCbG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FUjpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlRGVjbGluZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XHJcbiAgICAgICAgc2F2ZUludml0ZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcclxuICAgICAgICBzYXZlTWVzc2FuZ2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRVI6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZVVuYmxvY2tlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0cyB9KSB7XHJcbiAgICBoYW5nb3V0cy5mb3JFYWNoKChoYW5nb3V0KSA9PiB7XHJcbiAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0LHVucmVhZDp0cnVlIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKG1lc3NhZ2UgJiYgdXNlcm5hbWUpIHtcclxuIFxyXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ0FDS0hPV0xFREdFTUVOVCc6XHJcblxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6ZmFsc2UgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdIQU5HT1VUJzpcclxuXHJcbiAgICAgICAgICBpZihmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT1tZXNzYWdlLmhhbmdvdXQudXNlcm5hbWUpe1xyXG4gICBcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCx1bnJlYWQ6ZmFsc2UgfSk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgIFxyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LHVucmVhZDp0cnVlIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1VOUkVBRF9IQU5HT1VUUyc6XHJcbiAgIFxyXG4gICAgICAgICAgaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0czogbWVzc2FnZS5oYW5nb3V0cyB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ09GRkxJTkVfQUNLTic6XHJcbiAgICAgICBcclxuICAgICAgICAgIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCxvZmZsaW5lOnRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbbWVzc2FnZSwgdXNlcm5hbWVdKTtcclxuXHJcbiAgcmV0dXJuIHt9O1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xyXG5cclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XHJcbn1cclxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCB9KSB7XHJcblxyXG4gXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCBoYW5nb3V0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pe1xyXG4gIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNMRUFSRURfSEFOR09VVH0pXHJcbn0gXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHtkaXNwYXRjaCxoYW5nb3V0fSl7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcclxufVxyXG5cclxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4vLyAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xyXG4vLyB9XHJcbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XHJcbn1cclxuXHJcbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcclxuICAgICk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcclxuICBcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tJHtoYW5nb3V0LnVzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy9FTkQgc2F2ZUludml0ZXJcclxuXHJcblxyXG5cclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuXHJcbiAgVkFMVUVfQ0hBTkdFRDogJ1ZBTFVFX0NIQU5HRUQnLFxyXG4gIExPR0lOX1NUQVJURUQ6ICdMT0dJTl9TVEFSVEVEJyxcclxuICBMT0dJTl9TVUNDRVNTOiAnTE9HSU5fU1VDQ0VTUycsXHJcbiAgTE9HSU5fRkFJTEVEOiAnTE9HSU5fRkFJTEVEJyxcclxuXHJcbiAgTE9HT1VUOiAnTE9HT1VUJyxcclxuXHJcblxyXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxyXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxyXG4gIFNJR05VUF9GQUlMRUQ6ICdTSUdOVVBfRkFJTEVEJyxcclxuXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6ICdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxyXG5cclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXHJcblxyXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogJ0dPVF9UT0tFTl9GUk9NX1VSTCcsXHJcblxyXG4gIFJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTogJ1JFQ09WRVJfTE9DQUxfQVVUSF9TVEFURScsXHJcbiAgXHJcbiAgU0VSVkVSX0VSUk9SX1JFQ0lFVkVEOidTRVJWRVJfRVJST1JfUkVDSUVWRUQnLFxyXG5cclxuICBDT05TVFJBSU5UX1ZBTElEQVRJT046J0NPTlNUUkFJTlRfVkFMSURBVElPTicsXHJcbiAgXHJcbiAgU0VUX0VSUk9SX1RPX05VTEw6J1NFVF9FUlJPUl9UT19OVUxMJ1xyXG59O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgbG9naW46IGZhbHNlLFxyXG4gIHNpZ251cDogZmFsc2UsXHJcbiAgY2hhbmdlUGFzc3dvcmQ6IGZhbHNlLFxyXG4gIHJlcXVlc3RQYXNzQ2hhbmdlOiBmYWxzZSxcclxuICB2YWxpZGF0aW9uOiB7XHJcbiAgICB1c2VybmFtZTogeyBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnIH0sXHJcbiAgICBlbWFpbDogeyBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnIH0sXHJcbiAgICBwYXNzd29yZDogeyBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnIH0sXHJcbiAgICBjb25maXJtOiB7XHJcbiAgICAgIGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogJycsXHJcbiAgICAgXHJcbiAgICB9LCBlbWFpbG9ydXNlcm5hbWU6IHsgaXNWYWxpZDogdW5kZWZpbmVkLCBtZXNzYWdlOiAnJyB9XHJcbiAgfSxcclxuICBlbWFpbDogJycsXHJcbiAgcGFzc3dvcmQ6ICcnLFxyXG4gIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIHVzZXJuYW1lOiAnJyxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBjb25maXJtOiAnJyxcclxuICBjdXJyZW50OiAnJyxcclxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxyXG4gIHRva2VuOiBudWxsLFxyXG4gIGF1dGhGZWVkYmFjazogbnVsbCxcclxuICB1c2VyOiBudWxsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXV0aFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VUX0VSUk9SX1RPX05VTEw6XHJcbiAgICAgIHJldHVybnsuLi5zdGF0ZSxlcnJvcjpudWxsfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIGVycm9yOmFjdGlvbi5lcnJvcn1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsaWRhdGlvbjp7Li4uc3RhdGUudmFsaWRhdGlvbiwgW2FjdGlvbi5uYW1lXTogeyBpc1ZhbGlkOiBhY3Rpb24uaXNWYWxpZCwgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UgfSB9fVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VEOlxyXG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgW2FjdGlvbi5uYW1lXTogYWN0aW9uLnZhbHVlLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIGxvZ2luOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyOiBhY3Rpb24udXNlcixcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBsb2dpbjogZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBzaWdudXA6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjogYWN0aW9uLnVzZXIsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHNpZ251cDpmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2Usc2lnbnVwOmZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSwgY2hhbmdlUGFzc3dvcmQ6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjogYWN0aW9uLnVzZXIsXHJcbiAgICAgICAgY2hhbmdlUGFzc3dvcmQ6ZmFsc2VcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLGNoYW5nZVBhc3N3b3JkOmZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIHJlcXVlc3RQYXNzQ2hhbmdlOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICByZXF1ZXN0UGFzc0NoYW5nZTogZmFsc2UsXHJcbiAgICAgXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsICAgcmVxdWVzdFBhc3NDaGFuZ2U6IGZhbHNlLH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHRva2VuOiBhY3Rpb24udG9rZW4gfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HT1VUOlxyXG4gICAgICByZXR1cm4geyAuLi5pbml0U3RhdGUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHVzZXI6IGFjdGlvbi51c2VyXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBhY2NvdW50QWxyZWFkeUV4aXRzOjIwMixcclxuICAvL2xvZ2luXHJcbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxyXG4gIC8vc2lnbnVwXHJcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcclxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXHJcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcclxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxyXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXHJcbiAgLy9sb2dpblxyXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcclxuICBlbXB0eVBhc3N3b3JkTm90VmFsaWQ6ICc0MDknLFxyXG4gIGVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOic0MTAnLFxyXG4gIHVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOic0MTEnLFxyXG4vL2NoYW5nZSBwYXNzd29yZFxyXG4gIHBhc3N3b3JkRG9Ob3RNYXRjaDonNDEyJyxcclxuICB0b2tlbkV4cGlyZWQ6JzQxMycsXHJcbiAgc2VydmVyVmFsaWRhdGlvblJhbmdlOiBzdGF0dXMgPT4ge1xyXG4gICAgaWYgKHN0YXR1cyA+PSA0MDAgJiYgc3RhdHVzIDw9IDQxMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlZBTElEX1BBU1NXT1JEOlxyXG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxyXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FOlxyXG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcclxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ1JlcXVpcmVkIGZpZWxkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMOiAnZW1haWwgb3IgdXNlcm5hbWUgaXMgbm90IHZhbGlkJyxcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICd1c2VybmFtZSBpcyBhbHJlYWR5IHRha2VuJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnZW1haWwgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyxcclxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcsXHJcbiAgQUNDT1VOVF9BTFJFQURZX0VYSVNUUzonQWNjb3VudCBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyB1c2VybmFtZS4nLFxyXG4gIFJFUVVJUkVEX0ZJRUxEOidSZXF1aXJlZCBmaWVsZCdcclxufTtcclxuIiwiXHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4uL3N0YXRlL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzID0gMCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRlYnVnZ2VyXHJcbiAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgIGNhc2UgMTAxOlxyXG4gICAgY2FzZSAyMDA6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuY3JlZGVudGlhbEludmFsaWQ6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMgfSlcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdlbWFpbG9ydXNlcm5hbWUnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDEyNTpcclxuICAgIGNhc2UgLTM6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2VtYWlsJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcclxuICAgIGNhc2UgLTQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3VzZXJuYW1lJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAyMDM6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnZW1haWwnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFR0lTVEVSRURfRU1BSUwgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDIwMjovL3BhcnNlXHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3VzZXJuYW1lJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTiB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVBhc3N3b3JkTm90VmFsaWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFUVVJUkVEX0ZJRUxEIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCB9KVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2NvbmZpcm0nLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0ggfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlthLXpBLVpdKS57OCx9JC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/L2c7XHJcblxyXG5leHBvcnQgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9bYS16QS1aXStbLV9dKlthLXpBLVpdKy9nO1xyXG4iLCJcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkge1xyXG4gIGNvbnN0IHBhc3N3b3JkQ29uc3RyYWludCA9IG5ldyBSZWdFeHAocGFzc3dvcmRSZWdleCk7XHJcbiAgaWYgKHBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuZWxzZXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgXHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgIH07XHJcbiAgXHJcbn19XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuICBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodXNlcm5hbWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgXHJcbiAgICAgIGlzVmFsaWQ6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoeyB2YWx1ZSB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gIFxyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcblxyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pIHtcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID1hdXRoO1xyXG5cclxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nICh7dmFsdWV9KXtcclxuICBpZih2YWx1ZS5sZW5ndGg9PT0wKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRVFVSVJFRF9GSUVMRCxcclxuICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICB9O1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWVzc2FnZTonJyxcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgIH07XHJcbiAgfVxyXG59IiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4uLy4uL3N0YXRlL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHNlcnZlclZhbGlkYXRpb24gZnJvbSAnLi4vLi4vdmFsaWRhdGlvbi9zZXJ2ZXJFcnJvckFjdGlvbnMnXHJcbmltcG9ydCAqIGFzIGN2IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vY29uc3RyYWludFZhbGlkYXRvcnMnXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWdudXAoeyBkaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCB9ID0gc3RhdGVcclxuICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQgJiYgZW1haWwgJiYgY3YudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSAmJiBjdi52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pICYmIGN2LnZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkpIHtcclxuICAgIHRyeSB7XHJcbmRlYnVnZ2VyO1xyXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHVzZXIgY2xhc3NcclxuICAgICAgdmFyIHVzZXIgPSBuZXcgUGFyc2UuVXNlcigpO1xyXG4gICAgICB1c2VyLnNldChcInVzZXJuYW1lXCIsIHVzZXJuYW1lKTtcclxuICAgICAgdXNlci5zZXQoXCJwYXNzd29yZFwiLCBwYXNzd29yZCk7XHJcbiAgICAgIHVzZXIuc2V0KFwiZW1haWxcIiwgZW1haWwpO1xyXG4gICAgICBsZXQgc3VjY2VzcyA9IGF3YWl0IHVzZXIuc2lnblVwKClcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuOiBzdWNjZXNzLmdldCgnc2Vzc2lvblRva2VuJyksXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgb2JqZWN0SWQ6IHN1Y2Nlc3MuaWRcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgY29uc3QgSGFuZ291dFVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRVc2VyID0gbmV3IEhhbmdvdXRVc2VyKCk7XHJcbiAgICAgIGhhbmdvdXRVc2VyLnNldCgndXNlcm5hbWUnLCB1c2VybmFtZSlcclxuICAgICAgaGFuZ291dFVzZXIuc2V0KCdlbWFpbCcsIGVtYWlsKVxyXG4gICAgICBoYW5nb3V0VXNlci5zZXQoJ3VzZXJpZCcsIHN1Y2Nlc3MuaWQpXHJcbiAgICAgIGF3YWl0IGhhbmdvdXRVc2VyLnNhdmUoKVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTLCB1c2VyOiB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW46IHN1Y2Nlc3MuZ2V0KCdzZXNzaW9uVG9rZW4nKSwgb2JqZWN0SWQ6IHN1Y2Nlc3MuaWQgfSB9KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgZGVidWdnZXJcclxuICAgICAgc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGUsZGlzcGF0Y2h9KVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9FUlJPUl9SRUNJRVZFRCxlcnJvciB9KTtcclxuICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRH0pXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6J3VzZXJuYW1lJywuLi5jdi52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7dXNlcm5hbWV9KX0pXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sbmFtZTonZW1haWwnLC4uLmN2LnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtlbWFpbH0pfSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTixuYW1lOidwYXNzd29yZCcsLi4uY3YudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoe3Bhc3N3b3JkfSl9KVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRH0pXHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZVxyXG5cclxuICBpZihlbWFpbG9ydXNlcm5hbWUgJiYgcGFzc3dvcmQpe1xyXG4gICAgZGVidWdnZXJcclxuICAgIC8vIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgdXNlciBjbGFzc1xyXG4gICAgUGFyc2UuVXNlci5sb2dJbihlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgIGxldCB1c2VybmFtZSA9IHVzZXIuZ2V0KFwidXNlcm5hbWVcIilcclxuICAgICAgbGV0IGVtYWlsID0gdXNlci5nZXQoXCJlbWFpbFwiKVxyXG4gICAgICBsZXQgdG9rZW4gPSB1c2VyLmdldCgnc2Vzc2lvblRva2VuJylcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICAgIG9iamVjdElkOiB1c2VyLmlkXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICBcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB1c2VyOiB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4sIG9iamVjdElkOiB1c2VyLmlkIH0gfSlcclxuICAgICAgY29uc29sZS5sb2coJ1VzZXIgY3JlYXRlZCBzdWNjZXNzZnVsIHdpdGggbmFtZTogJyArIHVzZXIuZ2V0KFwidXNlcm5hbWVcIikgKyAnIGFuZCBlbWFpbDogJyArIHVzZXIuZ2V0KFwiZW1haWxcIikpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6ZXJyb3IuY29kZSxkaXNwYXRjaH0pXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVELGVycm9yIH0pO1xyXG4gICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUR9KVxyXG4gICAgfSk7XHJcbiAgfWVsc2V7XHJcbiAgICAvL2VtcHR5IGVtYWlsb3J1c2VybmFtZSBvciBwYXNzd29yZFxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLG5hbWU6J2VtYWlsb3J1c2VybmFtZScsLi4uY3YudmFsaWRhdGVFbXB0eVN0cmluZyh7dmFsdWU6ZW1haWxvcnVzZXJuYW1lfSl9KVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLG5hbWU6J3Bhc3N3b3JkJywuLi5jdi52YWxpZGF0ZUVtcHR5U3RyaW5nKHt2YWx1ZTpwYXNzd29yZH0pfSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRH0pXHJcblxyXG4gIH1cclxuIFxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG5cclxuICBQYXJzZS5Vc2VyLnJlcXVlc3RQYXNzd29yZFJlc2V0KGVtYWlsKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyxcclxuICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgbWVzc2FnZTogYEEgbGluayBmb3IgcGFzc3dvcmQgY2hhbmdlICBoYXMgYmVlbiBzZW50IHRvLCAke2VtYWlsfSEgYCxcclxuICAgIH0pO1xyXG4gICAgY29uc29sZS5sb2coXCJQYXNzd29yZCByZXNldCByZXF1ZXN0IHdhcyBzZW50IHN1Y2Nlc3NmdWxseVwiKTtcclxuICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIC8vIGZvcm1EaXNwYXRjaChzZXJ2ZXJWYWxpZGF0aW9uKHtzdGF0dXM6ZXJyb3IuY29kZX0pKVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiVGhlIGxvZ2luIGZhaWxlZCB3aXRoIGVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gIH0pO1xyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYXJzZUF1dGhTZXJ2aWNlICh7Y2hpbGRyZW4sc3RhdGUsZGlzcGF0Y2h9KXtcclxuY29uc3QgeyBsb2dpbixzaWdudXAsIGNoYW5nZVBhc3N3b3JkLHJlcXVlc3RQYXNzQ2hhbmdlfSA9c3RhdGVcclxuXHJcbiAgICB1c2VFZmZlY3QoKCk9PntcclxuICAgICAgICBpZihsb2dpbil7XHJcbiAgICAgICAgICAgIGFjdGlvbnMubG9naW4oe2Rpc3BhdGNoLHN0YXRlfSlcclxuICAgICAgICB9XHJcbiAgICB9LFtsb2dpbl0pXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICAgICAgaWYoc2lnbnVwKXtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2lnbnVwKHtkaXNwYXRjaCxzdGF0ZX0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxbc2lnbnVwXSlcclxuXHJcbiAgXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICAgICAgaWYocmVxdWVzdFBhc3NDaGFuZ2Upe1xyXG4gICAgICAgICAgICBhY3Rpb25zLmZvcmdvdFBhc3N3b3JkKHtkaXNwYXRjaCxzdGF0ZX0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxbcmVxdWVzdFBhc3NDaGFuZ2VdKVxyXG4gICAgcmV0dXJuIGNoaWxkcmVuXHJcblxyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBQYXJzZUF1dGhTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL3BhcnNlL1BhcnNlQXV0aFNlcnZpY2UnXHJcbmltcG9ydCBOb2RlQXV0aFNlcmljZSBmcm9tICcuLi9zZXJ2aWNlcy9ub2RlanMvTm9kZUF1dGhTZXJ2aWNlJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoQWRhcHRlciAocHJvcHMpe1xyXG4gICAgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfUEFSU0UnKSB7XHJcbiAgICAgICAgcmV0dXJuIDxQYXJzZUF1dGhTZXJ2aWNlIHsuLi5wcm9wc30gLz5cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfTk9ERUpTJykge1xyXG4gICAgICAgIHJldHVybiA8Tm9kZUF1dGhTZXJpY2Ugey4uLnByb3BzfSAvPlxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsXHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XHJcbmltcG9ydCBBdXRoQWRhcHRlciBmcm9tICcuL0F1dGhBZGFwdGVyJ1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XHJcbiAgICAgIDxBdXRoQWRhcHRlciBzdGF0ZT17c3RhdGV9IGRpc3BhdGNoPXtkaXNwYXRjaH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgPC9BdXRoQWRhcHRlcj5cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vQXV0aFByb3ZpZGVyJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVzZXJOYW1lKCkge1xyXG4gIGNvbnN0IFt1c2VyTmFtZSwgc2V0VXNlcm5hbWVdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbZW1haWwsIHNldEVtYWlsXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbb2JqZWN0SWQsIHNldE9iamVjdElkXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IHsgc3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICBcclxuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcblxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwsb2JqZWN0SWQgfSA9IEpTT04ucGFyc2UoXHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxyXG4gICAgICApO1xyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgICBzZXRPYmplY3RJZChvYmplY3RJZClcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUudXNlciAmJiBzdGF0ZS51c2VyLnRva2VuKSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0b2tlbixvYmplY3RJZCB9ID1zdGF0ZS51c2VyO1xyXG4gIFxyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgICBzZXRPYmplY3RJZChvYmplY3RJZClcclxuICAgIH1cclxuICB9LCBbc3RhdGUudXNlcl0pO1xyXG5cclxudXNlRWZmZWN0KCgpPT57XHJcbiAgaWYoc3RhdGUgJiYgc3RhdGUudXNlcj09PW51bGwpe1xyXG4gICAgc2V0VXNlcm5hbWUobnVsbCk7XHJcbiAgICBzZXRUb2tlbihudWxsKTtcclxuICAgIHNldEVtYWlsKG51bGwpO1xyXG4gICAgc2V0T2JqZWN0SWQobnVsbClcclxuICB9XHJcbn0sW3N0YXRlXSlcclxuICByZXR1cm4geyB1c2VybmFtZTogdXNlck5hbWUsIHRva2VuLCBlbWFpbCB9O1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUmVhZEhhbmdvdXRzKHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIC8vIHNldCByZWFkIHRvIHRydWUgb24gdW5yZWFkIGhhbmdvdXRzXHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcclxuICBjb25zdCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuXHJcbiAgaWYgKHVucmVhZGhhbmdvdXRzJiYgdW5yZWFkaGFuZ291dHMubGVuZ3RoPjApIHtcclxuICAgIFxyXG4gICAgbGV0IHVwZGF0ZWR1bnJlYWQgPSB1bnJlYWRoYW5nb3V0cy5tYXAodSA9PiB7XHJcbiAgICAgIGlmICh1LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7IC4uLnUsIHJlYWQ6IHRydWUgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWR1bnJlYWQpKTtcclxuZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsdW5yZWFkaGFuZ291dHM6dXBkYXRlZHVucmVhZH0pXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8vIHNldCBoYW5nb3V0IHRvIHJlYWRcclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgeyAuLi5oYW5nb3V0LCByZWFkOiB0cnVlIH0pO1xyXG4gIC8vXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG5cclxuICBpZiAobWVzc2FnZSkge1xyXG4gICAgIHVwZGF0ZVJlYWRNZXNzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWFkTWVzc3NhZ2VzKHsgaGFuZ291dCwgbmFtZSwgZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGNvbnN0IHVwZGF0ZWRNZXNzYWdlcyA9IG1lc3NhZ2VzLm1hcCgobSkgPT4ge1xyXG4gICAgcmV0dXJuIHsgLi4ubSwgcmVhZDogdHJ1ZSB9O1xyXG4gIH0pO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHtcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZU1lbW8sXHJcbiAgdXNlUmVkdWNlcixcclxuICB1c2VFZmZlY3QsXHJcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcclxuaW1wb3J0IHt1c2VNZXNzYWdlfSBmcm9tICcuL3VzZU1lc3NhZ2UnXHJcblxyXG5pbXBvcnQge1xyXG4gIGxvYWRIYW5nb3V0cyxcclxuICBsb2FkTWVzc2FnZXMsIFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7dXNlVXNlck5hbWV9IGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL3VzZVVzZXJOYW1lJ1xyXG5pbXBvcnQgeyB1cGRhdGVSZWFkSGFuZ291dHMgfSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvdXBkYXRlUmVhZEhhbmdvdXRzJztcclxuXHJcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dENvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VIYW5nb3V0Q29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBIYW5nb3V0c1Byb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xyXG4gY29uc3Qge3VzZXJuYW1lLHRva2VufT11c2VVc2VyTmFtZSgpXHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHsgaGFuZ291dCxtZXNzYWdlIH0gPSBzdGF0ZTtcclxuICBjb25zdCBoYW5kbGVNZXNzYWdlID11c2VNZXNzYWdlKHttZXNzYWdlLHVzZXJuYW1lLGRpc3BhdGNoLGZvY3VzZWRIYW5nb3V0OmhhbmdvdXR9KVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodXNlcm5hbWUpIHtcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFt1c2VybmFtZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodXNlcm5hbWUgJiYgdG9rZW4pIHtcclxuICAgICBcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGhhbmdvdXQgJiYgdXNlcm5hbWUpIHtcclxuICBcclxuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgbG9hZE1lc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xyXG5cclxuICAgICAgLy9zYXZlIGhhbmdvdXQgdG8gbG9jYWxTdG9yYWdlXHJcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgaWYgKCFoYW5nb3V0cykge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChcclxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoaGFuZ291dEV4aXN0KSB7XHJcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghaGFuZ291dC5yZWFkKSB7XHJcbiAgICAgXHJcbiAgICAgXHJcbiAgICAgICAgdXBkYXRlUmVhZEhhbmdvdXRzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWU6IHVzZXJuYW1lIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW2hhbmdvdXQsIHVzZXJuYW1lXSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL0F1dGhQcm92aWRlcidcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmltcG9ydCAqIGFzIGN2IGZyb20gJy4uL3ZhbGlkYXRpb24vY29uc3RyYWludFZhbGlkYXRvcnMnXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoKCkge1xyXG4gICAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KClcclxuICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKGUpIHtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldFxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCwgbmFtZSwgdmFsdWUgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG9uTG9naW4oKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEIH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBvblNpZ251cCgpIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBvblJlcXVlc3RQYXNzd29yZENoYW5nZSgpIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb25QYXNzd29yZENoYW5nZSgpIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25TaWduT3V0KCkge1xyXG4gICAgICAgXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVQgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG9uTG9naW5CbHVyKGUpIHtcclxuICAgICAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlXHJcbiAgICAgICAgY29uc3QgeyBuYW1lIH0gPSBlLnRhcmdldFxyXG4gICAgICAgXHJcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Bhc3N3b3JkJzpcclxuICAgICAgICAgICAgICAgIGlmIChwYXNzd29yZCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3Bhc3N3b3JkJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdSZXF1aXJlZCBmaWVsZCcgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlbWFpbG9ydXNlcm5hbWUnOlxyXG4gICAgICAgICAgICAgICAvLyBpZiAoZW1haWxvcnVzZXJuYW1lID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnZW1haWxvcnVzZXJuYW1lJywgLi4uY3YudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe3ZhbHVlOmVtYWlsb3J1c2VybmFtZX0pIH0pXHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbkxvZ2luQmx1ciBlcnJvcicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uU2lnbnVwQmx1cihlKSB7XHJcbiAgICAgICAgY29uc3QgeyBlbWFpbCwgdXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZVxyXG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gZS50YXJnZXRcclxuICAgICBcclxuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSAncGFzc3dvcmQnOlxyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCAuLi5jdi52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2VtYWlsJzpcclxuXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2VtYWlsJywgLi4uY3YudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd1c2VybmFtZSc6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3VzZXJuYW1lJywgLi4uY3YudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB9KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uTG9naW5CbHVyIGVycm9yJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25DaGFuZ2VQYXNzQmx1cigpIHsgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uUmVxdWVzdFBhc3NDaGFuZ2VCbHVyKCkgeyB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Gb2N1cyhlKSB7XHJcbiAgICAgICAgY29uc3QgeyBuYW1lIH0gPSBlLnRhcmdldFxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lLCBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnIH0pXHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VUX0VSUk9SX1RPX05VTEx9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IHN0YXRlLCBvbkZvY3VzLCBvbkxvZ2luQmx1ciwgb25TaWdudXBCbHVyLCBvbkNoYW5nZVBhc3NCbHVyLCBvblJlcXVlc3RQYXNzQ2hhbmdlQmx1ciwgZGlzcGF0Y2gsIG9uTG9naW4sIG9uU2lnbnVwLCBvblJlcXVlc3RQYXNzd29yZENoYW5nZSwgb25QYXNzd29yZENoYW5nZSwgb25DaGFuZ2UsIG9uU2lnbk91dCB9XHJcbn0iLCJpbXBvcnR7dXNlU3RhdGUgYXMgbix1c2VSZWR1Y2VyIGFzIHQsdXNlRWZmZWN0IGFzIGUsdXNlTGF5b3V0RWZmZWN0IGFzIHIsdXNlUmVmIGFzIG8sdXNlSW1wZXJhdGl2ZUhhbmRsZSBhcyB1LHVzZU1lbW8gYXMgaSx1c2VDYWxsYmFjayBhcyBmLHVzZUNvbnRleHQgYXMgYyx1c2VEZWJ1Z1ZhbHVlIGFzIGF9ZnJvbVwicHJlYWN0L2hvb2tzXCI7ZXhwb3J0KmZyb21cInByZWFjdC9ob29rc1wiO2ltcG9ydHtDb21wb25lbnQgYXMgbCxjcmVhdGVFbGVtZW50IGFzIHMsb3B0aW9ucyBhcyB2LHRvQ2hpbGRBcnJheSBhcyBoLGh5ZHJhdGUgYXMgcCxyZW5kZXIgYXMgZCxfdW5tb3VudCBhcyBtLGNsb25lRWxlbWVudCBhcyB5LGNyZWF0ZVJlZiBhcyBiLGNyZWF0ZUNvbnRleHQgYXMgZyxGcmFnbWVudCBhcyB4fWZyb21cInByZWFjdFwiO2V4cG9ydHtjcmVhdGVFbGVtZW50LGNyZWF0ZUNvbnRleHQsY3JlYXRlUmVmLEZyYWdtZW50LENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtmdW5jdGlvbiBFKG4sdCl7Zm9yKHZhciBlIGluIHQpbltlXT10W2VdO3JldHVybiBufWZ1bmN0aW9uIHcobix0KXtmb3IodmFyIGUgaW4gbilpZihcIl9fc291cmNlXCIhPT1lJiYhKGUgaW4gdCkpcmV0dXJuITA7Zm9yKHZhciByIGluIHQpaWYoXCJfX3NvdXJjZVwiIT09ciYmbltyXSE9PXRbcl0pcmV0dXJuITA7cmV0dXJuITF9dmFyIEM9ZnVuY3Rpb24obil7dmFyIHQsZTtmdW5jdGlvbiByKHQpe3ZhciBlO3JldHVybihlPW4uY2FsbCh0aGlzLHQpfHx0aGlzKS5pc1B1cmVSZWFjdENvbXBvbmVudD0hMCxlfXJldHVybiBlPW4sKHQ9cikucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5fX3Byb3RvX189ZSxyLnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obix0KXtyZXR1cm4gdyh0aGlzLnByb3BzLG4pfHx3KHRoaXMuc3RhdGUsdCl9LHJ9KGwpO2Z1bmN0aW9uIF8obix0KXtmdW5jdGlvbiBlKG4pe3ZhciBlPXRoaXMucHJvcHMucmVmLHI9ZT09bi5yZWY7cmV0dXJuIXImJmUmJihlLmNhbGw/ZShudWxsKTplLmN1cnJlbnQ9bnVsbCksdD8hdCh0aGlzLnByb3BzLG4pfHwhcjp3KHRoaXMucHJvcHMsbil9ZnVuY3Rpb24gcih0KXtyZXR1cm4gdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZSxzKG4sRSh7fSx0KSl9cmV0dXJuIHIucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9ITAsci5kaXNwbGF5TmFtZT1cIk1lbW8oXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsci50PSEwLHJ9dmFyIEE9di5fX2I7ZnVuY3Rpb24gUyhuKXtmdW5jdGlvbiB0KHQpe3ZhciBlPUUoe30sdCk7cmV0dXJuIGRlbGV0ZSBlLnJlZixuKGUsdC5yZWYpfXJldHVybiB0LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXQudD0hMCx0LmRpc3BsYXlOYW1lPVwiRm9yd2FyZFJlZihcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIix0fXYuX19iPWZ1bmN0aW9uKG4pe24udHlwZSYmbi50eXBlLnQmJm4ucmVmJiYobi5wcm9wcy5yZWY9bi5yZWYsbi5yZWY9bnVsbCksQSYmQShuKX07dmFyIGs9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9oKG4pLnJlZHVjZShmdW5jdGlvbihuLGUscil7cmV0dXJuIG4uY29uY2F0KHQoZSxyKSl9LFtdKTpudWxsfSxSPXttYXA6ayxmb3JFYWNoOmssY291bnQ6ZnVuY3Rpb24obil7cmV0dXJuIG4/aChuKS5sZW5ndGg6MH0sb25seTpmdW5jdGlvbihuKXtpZigxIT09KG49aChuKSkubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNoaWxkcmVuLm9ubHkoKSBleHBlY3RzIG9ubHkgb25lIGNoaWxkLlwiKTtyZXR1cm4gblswXX0sdG9BcnJheTpofSxGPXYuX19lO2Z1bmN0aW9uIE4obil7cmV0dXJuIG4mJigobj1FKHt9LG4pKS5fX2M9bnVsbCxuLl9faz1uLl9fayYmbi5fX2subWFwKE4pKSxufWZ1bmN0aW9uIFUoKXt0aGlzLl9fdT0wLHRoaXMubz1udWxsLHRoaXMuX19iPW51bGx9ZnVuY3Rpb24gTShuKXt2YXIgdD1uLl9fLl9fYztyZXR1cm4gdCYmdC51JiZ0LnUobil9ZnVuY3Rpb24gTChuKXt2YXIgdCxlLHI7ZnVuY3Rpb24gbyhvKXtpZih0fHwodD1uKCkpLnRoZW4oZnVuY3Rpb24obil7ZT1uLmRlZmF1bHR8fG59LGZ1bmN0aW9uKG4pe3I9bn0pLHIpdGhyb3cgcjtpZighZSl0aHJvdyB0O3JldHVybiBzKGUsbyl9cmV0dXJuIG8uZGlzcGxheU5hbWU9XCJMYXp5XCIsby50PSEwLG99ZnVuY3Rpb24gTygpe3RoaXMuaT1udWxsLHRoaXMubD1udWxsfXYuX19lPWZ1bmN0aW9uKG4sdCxlKXtpZihuLnRoZW4pZm9yKHZhciByLG89dDtvPW8uX187KWlmKChyPW8uX19jKSYmci5fX2MpcmV0dXJuIHIuX19jKG4sdC5fX2MpO0Yobix0LGUpfSwoVS5wcm90b3R5cGU9bmV3IGwpLl9fYz1mdW5jdGlvbihuLHQpe3ZhciBlPXRoaXM7bnVsbD09ZS5vJiYoZS5vPVtdKSxlLm8ucHVzaCh0KTt2YXIgcj1NKGUuX192KSxvPSExLHU9ZnVuY3Rpb24oKXtvfHwobz0hMCxyP3IoaSk6aSgpKX07dC5fX2M9dC5jb21wb25lbnRXaWxsVW5tb3VudCx0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dSgpLHQuX19jJiZ0Ll9fYygpfTt2YXIgaT1mdW5jdGlvbigpe3ZhciBuO2lmKCEtLWUuX191KWZvcihlLl9fdi5fX2tbMF09ZS5zdGF0ZS51LGUuc2V0U3RhdGUoe3U6ZS5fX2I9bnVsbH0pO249ZS5vLnBvcCgpOyluLmZvcmNlVXBkYXRlKCl9O2UuX191Kyt8fGUuc2V0U3RhdGUoe3U6ZS5fX2I9ZS5fX3YuX19rWzBdfSksbi50aGVuKHUsdSl9LFUucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuLHQpe3JldHVybiB0aGlzLl9fYiYmKHRoaXMuX192Ll9fa1swXT1OKHRoaXMuX19iKSx0aGlzLl9fYj1udWxsKSxbcyhsLG51bGwsdC51P251bGw6bi5jaGlsZHJlbiksdC51JiZuLmZhbGxiYWNrXX07dmFyIFA9ZnVuY3Rpb24obix0LGUpe2lmKCsrZVsxXT09PWVbMF0mJm4ubC5kZWxldGUodCksbi5wcm9wcy5yZXZlYWxPcmRlciYmKFwidFwiIT09bi5wcm9wcy5yZXZlYWxPcmRlclswXXx8IW4ubC5zaXplKSlmb3IoZT1uLmk7ZTspe2Zvcig7ZS5sZW5ndGg+MzspZS5wb3AoKSgpO2lmKGVbMV08ZVswXSlicmVhaztuLmk9ZT1lWzJdfX07KE8ucHJvdG90eXBlPW5ldyBsKS51PWZ1bmN0aW9uKG4pe3ZhciB0PXRoaXMsZT1NKHQuX192KSxyPXQubC5nZXQobik7cmV0dXJuIHJbMF0rKyxmdW5jdGlvbihvKXt2YXIgdT1mdW5jdGlvbigpe3QucHJvcHMucmV2ZWFsT3JkZXI/KHIucHVzaChvKSxQKHQsbixyKSk6bygpfTtlP2UodSk6dSgpfX0sTy5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4pe3RoaXMuaT1udWxsLHRoaXMubD1uZXcgTWFwO3ZhciB0PWgobi5jaGlsZHJlbik7bi5yZXZlYWxPcmRlciYmXCJiXCI9PT1uLnJldmVhbE9yZGVyWzBdJiZ0LnJldmVyc2UoKTtmb3IodmFyIGU9dC5sZW5ndGg7ZS0tOyl0aGlzLmwuc2V0KHRbZV0sdGhpcy5pPVsxLDAsdGhpcy5pXSk7cmV0dXJuIG4uY2hpbGRyZW59LE8ucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZT1PLnByb3RvdHlwZS5jb21wb25lbnREaWRNb3VudD1mdW5jdGlvbigpe3ZhciBuPXRoaXM7bi5sLmZvckVhY2goZnVuY3Rpb24odCxlKXtQKG4sZSx0KX0pfTt2YXIgVz1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9dmFyIHQ9bi5wcm90b3R5cGU7cmV0dXJuIHQuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dH0sdC5yZW5kZXI9ZnVuY3Rpb24obil7cmV0dXJuIG4uY2hpbGRyZW59LG59KCk7ZnVuY3Rpb24gaihuKXt2YXIgdD10aGlzLGU9bi5jb250YWluZXIscj1zKFcse2NvbnRleHQ6dC5jb250ZXh0fSxuLnZub2RlKTtyZXR1cm4gdC5zJiZ0LnMhPT1lJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSx0LnA9ITEpLG4udm5vZGU/dC5wPyhlLl9faz10Ll9fayxkKHIsZSksdC5fX2s9ZS5fX2spOih0LnY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikscChcIlwiLGUpLGUuYXBwZW5kQ2hpbGQodC52KSx0LnA9ITAsdC5zPWUsZChyLGUsdC52KSx0Ll9faz10LnYuX19rKTp0LnAmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpKSx0Lmg9cix0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKX0sbnVsbH1mdW5jdGlvbiB6KG4sdCl7cmV0dXJuIHMoaix7dm5vZGU6bixjb250YWluZXI6dH0pfXZhciBEPS9eKD86YWNjZW50fGFsaWdubWVudHxhcmFiaWN8YmFzZWxpbmV8Y2FwfGNsaXAoPyFQYXRoVSl8Y29sb3J8ZmlsbHxmbG9vZHxmb250fGdseXBoKD8hUil8aG9yaXp8bWFya2VyKD8hSHxXfFUpfG92ZXJsaW5lfHBhaW50fHN0b3B8c3RyaWtldGhyb3VnaHxzdHJva2V8dGV4dCg/IUwpfHVuZGVybGluZXx1bmljb2RlfHVuaXRzfHZ8dmVjdG9yfHZlcnR8d29yZHx3cml0aW5nfHgoPyFDKSlbQS1aXS87bC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTt2YXIgSD1cInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yJiZTeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKXx8NjAxMDM7ZnVuY3Rpb24gVChuLHQsZSl7aWYobnVsbD09dC5fX2spZm9yKDt0LmZpcnN0Q2hpbGQ7KXQucmVtb3ZlQ2hpbGQodC5maXJzdENoaWxkKTtyZXR1cm4gZChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9ZnVuY3Rpb24gVihuLHQsZSl7cmV0dXJuIHAobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfXZhciBaPXYuZXZlbnQ7ZnVuY3Rpb24gSShuLHQpe25bXCJVTlNBRkVfXCIrdF0mJiFuW3RdJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobix0LHtjb25maWd1cmFibGU6ITEsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbXCJVTlNBRkVfXCIrdF19LHNldDpmdW5jdGlvbihuKXt0aGlzW1wiVU5TQUZFX1wiK3RdPW59fSl9di5ldmVudD1mdW5jdGlvbihuKXtaJiYobj1aKG4pKSxuLnBlcnNpc3Q9ZnVuY3Rpb24oKXt9O3ZhciB0PSExLGU9ITEscj1uLnN0b3BQcm9wYWdhdGlvbjtuLnN0b3BQcm9wYWdhdGlvbj1mdW5jdGlvbigpe3IuY2FsbChuKSx0PSEwfTt2YXIgbz1uLnByZXZlbnREZWZhdWx0O3JldHVybiBuLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7by5jYWxsKG4pLGU9ITB9LG4uaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sbi5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gZX0sbi5uYXRpdmVFdmVudD1ufTt2YXIgJD17Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNsYXNzfX0scT12LnZub2RlO3Yudm5vZGU9ZnVuY3Rpb24obil7bi4kJHR5cGVvZj1IO3ZhciB0PW4udHlwZSxlPW4ucHJvcHM7aWYodCl7aWYoZS5jbGFzcyE9ZS5jbGFzc05hbWUmJigkLmVudW1lcmFibGU9XCJjbGFzc05hbWVcImluIGUsbnVsbCE9ZS5jbGFzc05hbWUmJihlLmNsYXNzPWUuY2xhc3NOYW1lKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImNsYXNzTmFtZVwiLCQpKSxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXt2YXIgcixvLHU7Zm9yKHUgaW4gZS5kZWZhdWx0VmFsdWUmJnZvaWQgMCE9PWUudmFsdWUmJihlLnZhbHVlfHwwPT09ZS52YWx1ZXx8KGUudmFsdWU9ZS5kZWZhdWx0VmFsdWUpLGRlbGV0ZSBlLmRlZmF1bHRWYWx1ZSksQXJyYXkuaXNBcnJheShlLnZhbHVlKSYmZS5tdWx0aXBsZSYmXCJzZWxlY3RcIj09PXQmJihoKGUuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24obil7LTEhPWUudmFsdWUuaW5kZXhPZihuLnByb3BzLnZhbHVlKSYmKG4ucHJvcHMuc2VsZWN0ZWQ9ITApfSksZGVsZXRlIGUudmFsdWUpLGUpaWYocj1ELnRlc3QodSkpYnJlYWs7aWYocilmb3IodSBpbiBvPW4ucHJvcHM9e30sZSlvW0QudGVzdCh1KT91LnJlcGxhY2UoL1tBLVowLTldLyxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpOnVdPWVbdV19IWZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSxyPW4ucHJvcHM7aWYociYmXCJzdHJpbmdcIj09dHlwZW9mIGUpe3ZhciBvPXt9O2Zvcih2YXIgdSBpbiByKS9eb24oQW5pfFRyYXxUb3UpLy50ZXN0KHUpJiYoclt1LnRvTG93ZXJDYXNlKCldPXJbdV0sZGVsZXRlIHJbdV0pLG9bdS50b0xvd2VyQ2FzZSgpXT11O2lmKG8ub25kb3VibGVjbGljayYmKHIub25kYmxjbGljaz1yW28ub25kb3VibGVjbGlja10sZGVsZXRlIHJbby5vbmRvdWJsZWNsaWNrXSksby5vbmJlZm9yZWlucHV0JiYoci5vbmJlZm9yZWlucHV0PXJbby5vbmJlZm9yZWlucHV0XSxkZWxldGUgcltvLm9uYmVmb3JlaW5wdXRdKSxvLm9uY2hhbmdlJiYoXCJ0ZXh0YXJlYVwiPT09ZXx8XCJpbnB1dFwiPT09ZS50b0xvd2VyQ2FzZSgpJiYhL15maWx8Y2hlfHJhL2kudGVzdChyLnR5cGUpKSl7dmFyIGk9by5vbmlucHV0fHxcIm9uaW5wdXRcIjtyW2ldfHwocltpXT1yW28ub25jaGFuZ2VdLGRlbGV0ZSByW28ub25jaGFuZ2VdKX19fSgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJiF0Lm0mJnQucHJvdG90eXBlJiYoSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxNb3VudFwiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wc1wiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFVwZGF0ZVwiKSx0Lm09ITApfXEmJnEobil9O3ZhciBCPVwiMTYuOC4wXCI7ZnVuY3Rpb24gRyhuKXtyZXR1cm4gcy5iaW5kKG51bGwsbil9ZnVuY3Rpb24gSihuKXtyZXR1cm4hIW4mJm4uJCR0eXBlb2Y9PT1IfWZ1bmN0aW9uIEsobil7cmV0dXJuIEoobik/eS5hcHBseShudWxsLGFyZ3VtZW50cyk6bn1mdW5jdGlvbiBRKG4pe3JldHVybiEhbi5fX2smJihkKG51bGwsbiksITApfWZ1bmN0aW9uIFgobil7cmV0dXJuIG4mJihuLmJhc2V8fDE9PT1uLm5vZGVUeXBlJiZuKXx8bnVsbH12YXIgWT1mdW5jdGlvbihuLHQpe3JldHVybiBuKHQpfTtleHBvcnQgZGVmYXVsdHt1c2VTdGF0ZTpuLHVzZVJlZHVjZXI6dCx1c2VFZmZlY3Q6ZSx1c2VMYXlvdXRFZmZlY3Q6cix1c2VSZWY6byx1c2VJbXBlcmF0aXZlSGFuZGxlOnUsdXNlTWVtbzppLHVzZUNhbGxiYWNrOmYsdXNlQ29udGV4dDpjLHVzZURlYnVnVmFsdWU6YSx2ZXJzaW9uOlwiMTYuOC4wXCIsQ2hpbGRyZW46UixyZW5kZXI6VCxoeWRyYXRlOlQsdW5tb3VudENvbXBvbmVudEF0Tm9kZTpRLGNyZWF0ZVBvcnRhbDp6LGNyZWF0ZUVsZW1lbnQ6cyxjcmVhdGVDb250ZXh0OmcsY3JlYXRlRmFjdG9yeTpHLGNsb25lRWxlbWVudDpLLGNyZWF0ZVJlZjpiLEZyYWdtZW50OngsaXNWYWxpZEVsZW1lbnQ6SixmaW5kRE9NTm9kZTpYLENvbXBvbmVudDpsLFB1cmVDb21wb25lbnQ6QyxtZW1vOl8sZm9yd2FyZFJlZjpTLHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzOlksU3VzcGVuc2U6VSxTdXNwZW5zZUxpc3Q6TyxsYXp5Okx9O2V4cG9ydHtCIGFzIHZlcnNpb24sUiBhcyBDaGlsZHJlbixUIGFzIHJlbmRlcixWIGFzIGh5ZHJhdGUsUSBhcyB1bm1vdW50Q29tcG9uZW50QXROb2RlLHogYXMgY3JlYXRlUG9ydGFsLEcgYXMgY3JlYXRlRmFjdG9yeSxLIGFzIGNsb25lRWxlbWVudCxKIGFzIGlzVmFsaWRFbGVtZW50LFggYXMgZmluZERPTU5vZGUsQyBhcyBQdXJlQ29tcG9uZW50LF8gYXMgbWVtbyxTIGFzIGZvcndhcmRSZWYsWSBhcyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyxVIGFzIFN1c3BlbnNlLE8gYXMgU3VzcGVuc2VMaXN0LEwgYXMgbGF6eX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wYXQubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgRmVhdHVyZVJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnXHJcbmltcG9ydCB7dXNlQXV0aH0gZnJvbSAnLi9zdGF0ZS91c2VBdXRoJ1xyXG5jb25zdCBMb2dpbiA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3VpLWNvbXBvbmVudHMvTG9naW4nKSk7XHJcbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9DaGFuZ2VQYXNzd29yZCcpKTtcclxuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkJykpO1xyXG5jb25zdCBTaWdudXAgPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL1NpZ251cCcpKTtcclxuY29uc3QgUHJvZmlsZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3VpLWNvbXBvbmVudHMvUHJvZmlsZScpKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhGZWF0dXJlUm91dGVzKCkge1xyXG4gIGNvbnN0IHtvbkZvY3VzLG9uTG9naW4sb25Mb2dpbkJsdXIsb25TaWdudXBCbHVyLG9uQ2hhbmdlUGFzc0JsdXIsb25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIsb25TaWdudXAsb25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2Usb25QYXNzd29yZENoYW5nZSwgb25DaGFuZ2Usc3RhdGV9PXVzZUF1dGgoKVxyXG4gXHJcbiAgcmV0dXJuIFtcclxuICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9jaGFuZ2UtcGFzd29yZFwiPlxyXG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgPENoYW5nZVBhc3N3b3JkICB7Li4uc3RhdGV9IG9uRm9jdXM9e29uRm9jdXN9IG9uQmx1cj17b25DaGFuZ2VQYXNzQmx1cn0gb25DaGFuZ2U9e29uQ2hhbmdlfSBvblBhc3N3b3JkQ2hhbmdlPXtvblBhc3N3b3JkQ2hhbmdlfS8+XHJcbiAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvbG9naW5cIj5cclxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgIDxMb2dpbiB7Li4uc3RhdGV9IG9uRm9jdXM9e29uRm9jdXN9IG9uQmx1cj17b25Mb2dpbkJsdXJ9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gb25Mb2dpbj17b25Mb2dpbn0gLz5cclxuICAgICAgPC9TdXNwZW5zZT5cclxuICAgIDwvRmVhdHVyZVJvdXRlPixcclxuICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9zaWdudXBcIj5cclxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgIDxTaWdudXAgey4uLnN0YXRlfSBvbkZvY3VzPXtvbkZvY3VzfSBvbkJsdXI9e29uU2lnbnVwQmx1cn0gb25DaGFuZ2U9e29uQ2hhbmdlfW9uU2lnbnVwPXtvblNpZ251cH0gLz5cclxuICAgICAgPC9TdXNwZW5zZT5cclxuICAgIDwvRmVhdHVyZVJvdXRlPixcclxuICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9mb3Jnb3QtcGFzd29yZFwiPlxyXG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgPEZvcmdvdFBhc3N3b3JkIHsuLi5zdGF0ZX0gb25Gb2N1cz17b25Gb2N1c30gb25CbHVyPXtvblJlcXVlc3RQYXNzQ2hhbmdlQmx1cn0gb25DaGFuZ2U9e29uQ2hhbmdlfSBvblJlcXVlc3RQYXNzd29yZENoYW5nZT17b25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2V9Lz5cclxuICAgICAgPC9TdXNwZW5zZT5cclxuICAgIDwvRmVhdHVyZVJvdXRlPixcclxuICAgIDxGZWF0dXJlUm91dGUgcGF0aD1cIi9wcm9maWxlXCI+XHJcbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICA8UHJvZmlsZSAvPlxyXG4gICAgICA8L1N1c3BlbnNlPlxyXG4gICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgXVxyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUGVuZGluZ0hhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb25saW5lLGlzQmxvY2tlciB9KSB7XHJcblxyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcbiAgbGV0IGhhbmdvdXRLZXkgPSAnJztcclxuICBsZXQgbWVzc2FnZUtleSA9ICcnO1xyXG4gIGlmIChvbmxpbmUpIHtcclxuICAgIFxyXG4gICAgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICAgIG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgaGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xyXG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW9mZmxpbmUtbWVzc2FnZXNgO1xyXG4gIH1cclxuXHJcbiAgc2F2ZUhhbmdvdXQoeyBoYW5nb3V0S2V5LCB1c2VybmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KTtcclxuICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnRleHQgIT09XCJcIikge1xyXG4gICAgc2F2ZU1lc3NhZ2UoeyBtZXNzYWdlS2V5LCB1c2VybmFtZSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgXHJcbiAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBoYW5nb3V0KTtcclxuICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW2hhbmdvdXRdO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcbiAgfVxyXG4gXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIG1lc3NhZ2UsZGlzcGF0Y2gsaXNCbG9ja2VyIH0pIHtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBbXTtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuIFxyXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCBtZXNzYWdlXTtcclxuICB9IGVsc2Uge1xyXG5cclxuICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFttZXNzYWdlXTtcclxuICB9XHJcbiAgaWYoaXNCbG9ja2VyKXtcclxuIFxyXG4gICAgY29uc3QgYmxvY2tlciA9Wy4uLnVwZGF0ZWRNZXNzYWdlcyx7dGV4dDonWW91IGNhbiBub3Qgc2VuZCB0aGlzIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIGJsb2NrZWQuJ1xyXG4gICAgLHRpbWVzdGFtcDogRGF0ZS5ub3coKSx0eXBlOidibG9ja2VyJyx1c2VybmFtZTptZXNzYWdlLnVzZXJuYW1lLGZsb2F0OidyaWdodCd9XVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkoYmxvY2tlcikpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogYmxvY2tlciB9KTtcclxuICBcclxuICB9XHJcbiAgZWxzZXtcclxuICBcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG4gIH1cclxuIFxyXG5cclxufVxyXG4iLCJcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBzb2NrZXQsIG5hbWUgfSkge1xyXG4gIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xyXG4gIGlmIChvZmZsaW5lSGFuZ291dHMpIHtcclxuICAgIG9mZmxpbmVIYW5nb3V0cy5mb3JlRWFjaCgoaCkgPT4ge1xyXG4gICAgICBzb2NrZXQuc2VuZChcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB1c2VybmFtZTogaC51c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsOiBoLmVtYWlsLFxyXG4gICAgICAgICAgbWVzc2FnZTogaC5tZXNzYWdlLFxyXG4gICAgICAgICAgdGltZXN0YW1wOiBoLnRpbWVzdGFtcCxcclxuICAgICAgICAgIGNvbW1hbmQ6IGguc3RhdGUsXHJcbiAgICAgICAgICBvZmZsaW5lOiB0cnVlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQoe25hbWUsIGhhbmdvdXQsZGlzcGF0Y2h9KXtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XHJcbiAgICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gICAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gICBcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgIGNvbnN0IGZpbHRlcmVkSGFuZ291dHMgPSB1bnJlYWRoYW5nb3V0cy5maWx0ZXIoZnVuY3Rpb24odW5yZWFkKSAge1xyXG4gICAgICAgICAgICByZXR1cm4gIHVucmVhZC51c2VybmFtZSAhPT0gdXNlcm5hbWV9KTtcclxuICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGZpbHRlcmVkSGFuZ291dHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeShmaWx0ZXJlZEhhbmdvdXRzKSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0czogZmlsdGVyZWRIYW5nb3V0cyxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh1bnJlYWRoYW5nb3V0c0tleSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgIFxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbic7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgeyBzYXZlUGVuZGluZ0hhbmdvdXQgfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dCc7XHJcbmltcG9ydCB7XHJcblxyXG4gIHNlbGVjdFVucmVhZCxcclxuICBcclxuXHJcbiAgY2hhbmdlTWVzc2FnZVRleHQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgc2VuZE9mZmxpbmVIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2VuZE9mZmxpbmVIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVtb3ZlSGFuZ291dEZyb21VbnJlYWR9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9yZW1vdmVIYW5nb3V0RnJvbVVucmVhZCdcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgIHVzZXJuYW1lICA9IGF1dGhDb250ZXh0LnN0YXRlLnVzZXIgJiZhdXRoQ29udGV4dC5zdGF0ZS51c2VyLnVzZXJuYW1lO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuICBjb25zdCB7XHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICByZWFkeVN0YXRlLFxyXG4gIFxyXG4gICAgdW5yZWFkaGFuZ291dHMsXHJcbiAgfSA9IHN0YXRlO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCByZWFkeVN0YXRlID09PSAxICYmIHVzZXJuYW1lKSB7XHJcbiAgICAgIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBuYW1lOiB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3JlYWR5U3RhdGUsIHVzZXJuYW1lXSk7XHJcblxyXG4gIGZ1bmN0aW9uIG9uUmVtb3ZlVW5yZWFkKGUpe1xyXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGlkKTtcclxuICAgXHJcbiAgICByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZTp1c2VybmFtZSxkaXNwYXRjaCxoYW5nb3V0fSlcclxuICB9XHJcbiAgZnVuY3Rpb24gb25OYXZpZ2F0aW9uKGUpe1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAvLyBjb25zdCBpZCA9ZS50YXJnZXQuaWRcclxuICAgIGNvbnN0IGlkID1lLmN1cnJlbnRUYXJnZXQuaWRcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBvblNlbGVjdEhhbmdvdXQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSlcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIFxyXG4gXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSk7XHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblNlYXJjaElucHV0KGUpIHtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0UsIHNlYXJjaDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbkZldGNoSGFuZ291dHMoKXtcclxuXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUR9KVxyXG4gIH1cclxuXHJcbiBcclxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcclxuICAgIGNvbnN0IHRleHQgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uSGFuZ291dChlKSB7XHJcbiAgICBcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dDogJycsIGRpc3BhdGNoIH0pO1xyXG4gICAgY29uc3QgY29tbWFuZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gaGFuZ291dDtcclxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCBtZXNzYWdlID1cclxuICAgICAgbWVzc2FnZVRleHQgIT09ICcnID8geyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wIH0gOiBudWxsO1xyXG5cclxuICAgIGxldCBvbmxpbmUgPSB0cnVlO1xyXG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcclxuICAgIFxyXG4gIC8vICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICAgICBcclxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xyXG4gICAgICAgXHJcbiAgICAgICAgaXNCbG9ja2VyPXRydWVcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBwZW5kaW5nSGFuZ291dD0ge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgY29tbWFuZCxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgIH1cclxuICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsIHBlbmRpbmdIYW5nb3V0fSlcclxuICAgIC8vIH0gZWxzZSB7XHJcbiAgICAvLyAgIG9ubGluZSA9IGZhbHNlO1xyXG4gICAgLy8gfVxyXG4gICBcclxuIFxyXG4gICAgc2F2ZVBlbmRpbmdIYW5nb3V0KHtcclxuICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgIG5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICBoYW5nb3V0OiB7XHJcbiAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgc3RhdGU6IGNvbW1hbmQsXHJcbiAgICAgICAgbWVzc2FnZTogeyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wLCBkZWxpdmVyZWQ6IGZhbHNlLCB1c2VybmFtZSB9LFxyXG4gICAgICAgIHRpbWVzdGFtcCxcclxuICAgICAgICBkZWxpdmVyZWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgICBvbmxpbmUsXHJcbiAgICAgIGlzQmxvY2tlclxyXG4gICAgfSk7XHJcbiAgfS8vZW5kIG9uSGFuZ291dFxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIG9uTmF2aWdhdGlvbixcclxuICAgIG9uU2VsZWN0VW5yZWFkLFxyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgb25TZWFyY2hJbnB1dCxcclxuICAgIG9uRmV0Y2hIYW5nb3V0cyxcclxuICAgIHNlYXJjaCxcclxuICAgIG9uU2VsZWN0SGFuZ291dCxcclxuICAgIGRpc3BhdGNoLFxyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgdXNlcnMsXHJcbiAgICB1c2VybmFtZSxcclxuICAgIG1lc3NhZ2VzLFxyXG4gICAgb25IYW5nb3V0LFxyXG4gICAgdW5yZWFkaGFuZ291dHMsXHJcbiAgICByZWFkeVN0YXRlLFxyXG4gICAgb25SZW1vdmVVbnJlYWRcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vc3RhdGUvYWN0aW9uVHlwZXMnXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCx1c2VySWQgfSkge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gc2VhcmNoIEhhbmdvdXRcclxuICAgICBcclxuICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkhhbmdvdXRcIik7XHJcbiAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcmlkJyx1c2VySWQpXHJcbiAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLHNlYXJjaClcclxuICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gYXdhaXQgcXVlcnkuZmluZCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHNlYXJjaFJlc3VsdC5sZW5ndGg+MCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBtYXBwZWRIYW5vdXRzID0gc2VhcmNoUmVzdWx0Lm1hcChzPT57cmV0dXJuIHt1c2VybmFtZTpzLmF0dHJpYnV0ZXMudXNlcm5hbWUsIGVtYWlsOnMuYXR0cmlidXRlcy5lbWFpbCxzdGF0ZTpzLmF0dHJpYnV0ZXMuc3RhdGV9fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzOm1hcHBlZEhhbm91dHMgfSlcclxuICAgICAgICB9ICBcclxuICAgICAgICBlbHNle1xyXG4gICAgICBcclxuICAgICAgICAgICAgLy8gc2VhcmNoIEhhbmdvdXRVc2VyXHJcbiAgICAgICAgICAgIGNvbnN0IEhhbmdvdXRVc2VyID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkhhbmdvdXRVc2VyXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShIYW5nb3V0VXNlcik7XHJcbiAgICAgICAgICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJuYW1lJyxzZWFyY2gpXHJcbiAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHQgPSBhd2FpdCBxdWVyeS5maW5kKCk7XHJcbiAgICAgICAgICAgIGxldCBtYXBwZWRIYW5vdXRzID0gc2VhcmNoUmVzdWx0Lm1hcChzPT57cmV0dXJuIHt1c2VybmFtZTpzLmF0dHJpYnV0ZXMudXNlcm5hbWUsIGVtYWlsOnMuYXR0cmlidXRlcy5lbWFpbCxzdGF0ZTonSU5WSVRFJ319KVxyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHM6bWFwcGVkSGFub3V0cyB9KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkVSUk9SX1JFQ0lFVkVELGVycm9yfSlcclxuICAgIH1cclxuXHJcbn0iLCJcclxuLy9pcyBzZW50IGJ5IGNsaWVudFxyXG5leHBvcnQgY29uc3QgY2xpZW50Q29tbWFuZHMgPSB7XHJcbiAgSU5WSVRFOiAnSU5WSVRFJyxcclxuICBBQ0NFUFQ6ICdBQ0NFUFQnLFxyXG4gIERFQ0xJTkU6ICdERUNMSU5FJyxcclxuICBCTE9DSzogJ0JMT0NLJyxcclxuICBVTkJMT0NLOiAnVU5CTE9DSycsXHJcbiAgTUVTU0FHRTogJ01FU1NBR0UnLFxyXG4gIE9OTElORTonT05MSU5FJ1xyXG59O1xyXG5cclxuIiwiaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4vaGFuZ291dFN0YXRlcydcclxuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvY2xpZW50Q29tbWFuZHMnXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGF0ZU1hcHBlcih7IGNvbW1hbmQgfSkge1xyXG4gICAgc3dpdGNoIChjb21tYW5kKSB7XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5BQ0NFUFQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5BQ0NFUFRFRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLkJMT0NLOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLkJMT0NLRVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuREVDTElORTpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuREVDTElORVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuSU5WSVRFOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuSU5WSVRFRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLklOVklURVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuTUVTU0FHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLk1FU1NBR0VELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSXHJcbiAgICAgICAgICAgIH1cclxuICAgXHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5VTkJMT0NLOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VSXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbGllbnRDb21tYW5kIHR5cGUgbm90IHNwZWNpZmllZCcpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi4vLi4vc3RhdGUvdXNlSGFuZ291dHMnXHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJ1xyXG5pbXBvcnQgeyBzdGF0ZU1hcHBlciB9IGZyb20gJ3NlcnZlci9oYW5nb3V0cy9zdGF0ZU1hcHBlcidcclxuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcydcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbidcclxuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9zdGF0ZS9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGZ1bmN0aW9uIFBhcnNlU2VydmVyKHByb3BzKSB7XHJcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wc1xyXG4gICAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUhhbmdvdXRzKClcclxuICAgIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKVxyXG4gICAgY29uc3QgeyB1c2VyIH0gPSBhdXRoQ29udGV4dC5zdGF0ZVxyXG4gICAgY29uc3QgeyBmZXRjaEhhbmdvdXRzLCBzZWFyY2gsIHBlbmRpbmdIYW5nb3V0IH0gPSBzdGF0ZVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGZldGNoSGFuZ291dHMpIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICBhY3Rpb25zLmZldGNoSGFuZ291dHMoeyBkaXNwYXRjaCwgc2VhcmNoLCB1c2VySWQ6IHVzZXIub2JqZWN0SWQgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgW2ZldGNoSGFuZ291dHNdKVxyXG5cclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGlmIChwZW5kaW5nSGFuZ291dCkge1xyXG5cclxuICAgICAgICAgICAgc2VuZEhhbmdvdXQoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCBbcGVuZGluZ0hhbmdvdXRdKVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdWJTY3JpYmVUb1VucmVhZEhhbmdvdXQoKVxyXG4gICAgICAgICAgICBzdWJTY3JpYmVUb0hhbmdvdXQoKVxyXG5cclxuICAgICAgICAgICAgUGFyc2UuTGl2ZVF1ZXJ5Lm9uKCdvcGVuJywgYXN5bmMoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJVbnJlYWRIYW5nb3V0XCIpO1xyXG4gICAgICAgICAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcmlkJywgdXNlci5vYmplY3RJZClcclxuICAgICAgICAgICAgICAgIGxldCB1bnJlYWRoYW5nb3V0cyA9IGF3YWl0IHF1ZXJ5LmZpbmQoKTtcclxuICAgICAgICAgICAgICAgIGlmKHVucmVhZGhhbmdvdXRzKXtcclxuICAgICAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0cy5mb3JFYWNoKGg9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdW5yZWFkaGFuZ291dCA9aC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHtoYW5nb3V0OnVucmVhZGhhbmdvdXR9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVVbnJlYWRIYW5nb3V0KHtoYW5nb3V0OnVucmVhZGhhbmdvdXQsb2JqZWN0SWQ6aC5pZH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyOyAgIFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NvY2tldCBjb25uZWN0aW9uIGVzdGFibGlzaGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCBbdXNlcl0pXHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQgfSkge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlICdJTlZJVEVEJzpcclxuICAgICAgICAgICAgY2FzZSAnQUNDRVBURUQnOlxyXG4gICAgICAgICAgICBjYXNlICdCTE9DS0VEJzpcclxuICAgICAgICAgICAgY2FzZSAnTUVTU0FHRUQnOlxyXG4gICAgICAgICAgICBjYXNlICdERUNMSU5FRCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ1VOQkxPQ0tFRCc6XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQsIG1lc3NhZ2U6IHsgaGFuZ291dCwgdHlwZTogJ0FDS0hPV0xFREdFTUVOVCcgfSB9KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ0lOVklURVInOlxyXG4gICAgICAgICAgICBjYXNlICdBQ0NFUFRFUic6XHJcbiAgICAgICAgICAgIGNhc2UgJ0JMT0NLRVInOlxyXG4gICAgICAgICAgICBjYXNlICdNRVNTQU5HRVInOlxyXG4gICAgICAgICAgICBjYXNlICdVTkJMT0NLRVInOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfTUVTU0FHRV9SRUNJRVZFRCwgbWVzc2FnZTogeyBoYW5nb3V0LCB0eXBlOiAnSEFOR09VVCcgfSB9KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlVW5yZWFkSGFuZ291dCh7IGhhbmdvdXQsb2JqZWN0SWQgfSkge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBVbnJlYWRIYW5nb3V0ID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIlVucmVhZEhhbmdvdXRcIik7XHJcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShVbnJlYWRIYW5nb3V0KTtcclxuICAgICAgICAgICAgbGV0IHVucmVhZGhhbmdvdXQgPSBhd2FpdCBxdWVyeS5nZXQob2JqZWN0SWQpXHJcbiAgICAgICAgICAgIGF3YWl0IHVucmVhZGhhbmdvdXQuZGVzdHJveSgpXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkVSUk9SX1JFQ0lFVkVELCBlcnJvciB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gc3ViU2NyaWJlVG9IYW5nb3V0KCkge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkhhbmdvdXRcIik7XHJcbiAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcmlkJywgdXNlci5vYmplY3RJZClcclxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gYXdhaXQgcXVlcnkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgc3Vic2NyaXB0aW9uLm9uKCdjcmVhdGUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5nb3V0ID0gb2JqZWN0LmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0IH0pXHJcbiAgICAgIFxyXG5cclxuICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdWJzY3JpcHRpb24ub24oJ3VwZGF0ZScsIChvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmdvdXQgPSBvYmplY3QuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQgfSlcclxuICAgICAgICAgICBcclxuICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN1YnNjcmlwdGlvbi5vbignZW50ZXInLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3Vic2NyaXB0aW9uLm9uKCdsZWF2ZScsIChvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IG9iamVjdC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0c1swXS5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0IH0pXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gc3ViU2NyaWJlVG9VbnJlYWRIYW5nb3V0KCkge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIlVucmVhZEhhbmdvdXRcIik7XHJcbiAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcmlkJywgdXNlci5vYmplY3RJZClcclxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gYXdhaXQgcXVlcnkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgc3Vic2NyaXB0aW9uLm9uKCdjcmVhdGUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5nb3V0ID0gb2JqZWN0LmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0IH0pXHJcbiAgICAgICAgICAgIHJlbW92ZVVucmVhZEhhbmdvdXQoe2hhbmdvdXR9KVxyXG5cclxuICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdWJzY3JpcHRpb24ub24oJ3VwZGF0ZScsIChvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmdvdXQgPSBvYmplY3QuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQgfSlcclxuICAgICAgICAgICAgcmVtb3ZlVW5yZWFkSGFuZ291dCh7aGFuZ291dH0pXHJcbiAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdWJzY3JpcHRpb24ub24oJ2VudGVyJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN1YnNjcmlwdGlvbi5vbignbGVhdmUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBvYmplY3QuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHNbMF0uYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCB9KVxyXG4gICAgICAgICAgICByZW1vdmVVbnJlYWRIYW5nb3V0KHtoYW5nb3V0fSlcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHNlbmRIYW5nb3V0KCkge1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgY29uc3QgeyBzZW5kZXJTdGF0ZSwgdGFyZ2V0U3RhdGUgfSA9IHN0YXRlTWFwcGVyKHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IHBlbmRpbmdIYW5nb3V0LmNvbW1hbmQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgbWVzc2FnZSwgb2ZmbGluZSwgdGltZXN0YW1wIH0gPSBwZW5kaW5nSGFuZ291dDtcclxuICAgICAgICAgICAgY29uc3QgSGFuZ291dCA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0XCIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgU2VuZGVyVXNlciA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0VXNlclwiKTtcclxuICAgICAgICAgICAgbGV0IHNlbmRlclF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFNlbmRlclVzZXIpO1xyXG4gICAgICAgICAgICBzZW5kZXJRdWVyeS5lcXVhbFRvKCd1c2VybmFtZScsIHVzZXIudXNlcm5hbWUpXHJcbiAgICAgICAgICAgIGxldCBzZW5kZXJVc2VyID0gYXdhaXQgc2VuZGVyUXVlcnkuZmlyc3QoKVxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IFRhcmdldFVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRRdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShUYXJnZXRVc2VyKTtcclxuICAgICAgICAgICAgdGFyZ2V0UXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLCB1c2VybmFtZSlcclxuICAgICAgICAgICAgbGV0IHRhcmdldFVzZXIgPSBhd2FpdCB0YXJnZXRRdWVyeS5maXJzdCgpXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAvL0hBTkdPVVRcclxuICAgICAgICAgICAgY29uc3Qgc2VuZGVyID0gbmV3IEhhbmdvdXQoKVxyXG4gICAgICAgICAgICBzZW5kZXIuc2V0KCd1c2VybmFtZScsIHVzZXJuYW1lKVxyXG4gICAgICAgICAgICBzZW5kZXIuc2V0KCdlbWFpbCcsIGVtYWlsKVxyXG4gICAgICAgICAgICBzZW5kZXIuc2V0KCdtZXNzYWdlJywgbWVzc2FnZSlcclxuICAgICAgICAgICAgc2VuZGVyLnNldCgndGltZXN0YW1wJywgdGltZXN0YW1wKVxyXG4gICAgICAgICAgICBzZW5kZXIuc2V0KCdzdGF0ZScsIHNlbmRlclN0YXRlKVxyXG4gICAgICAgICAgICBzZW5kZXIuc2V0KCd1c2VyaWQnLCBzZW5kZXJVc2VyLmF0dHJpYnV0ZXMudXNlcmlkKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gbmV3IEhhbmdvdXQoKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCd1c2VybmFtZScsIHVzZXIudXNlcm5hbWUpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ2VtYWlsJywgdXNlci5lbWFpbClcclxuICAgICAgICAgICAgdGFyZ2V0LnNldCgnbWVzc2FnZScsIG1lc3NhZ2UpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgdGFyZ2V0LnNldCgnc3RhdGUnLCB0YXJnZXRTdGF0ZSlcclxuICAgICAgICAgICAgdGFyZ2V0LnNldCgndXNlcmlkJywgdGFyZ2V0VXNlci5hdHRyaWJ1dGVzLnVzZXJpZClcclxuXHJcblxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgaWYgKHBlbmRpbmdIYW5nb3V0LmNvbW1hbmQgPT09IGNsaWVudENvbW1hbmRzLklOVklURSkge1xyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJVc2VyLmFkZFVuaXF1ZSgnaGFuZ291dHMnLCBzZW5kZXIpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRVc2VyLmFkZFVuaXF1ZSgnaGFuZ291dHMnLCB0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBzZW5kZXIuc2V0KCdvd25lcicsIHNlbmRlclVzZXIpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2V0KCdvd25lcicsIHRhcmdldFVzZXIpXHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0UXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJIYW5nb3V0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UXVlcnkuZXF1YWxUbygndXNlcmlkJywgdGFyZ2V0VXNlci5hdHRyaWJ1dGVzLnVzZXJpZClcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRIYW5nb3V0ID0gYXdhaXQgdGFyZ2V0UXVlcnkuZmlyc3QoKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGFuZ291dC5zZXQoJ21lc3NhZ2UnLCBtZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGFuZ291dC5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2V0KCdzdGF0ZScsIHRhcmdldFN0YXRlKVxyXG4gICAgICAgICAgICAgICAvLyB0YXJnZXRIYW5nb3V0LnNhdmUoKVxyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNlbmRlclF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFwiSGFuZ291dFwiKTtcclxuICAgICAgICAgICAgICAgIHNlbmRlclF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsIHVzZXIub2JqZWN0SWQpXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VuZGVySGFuZ291dCA9IGF3YWl0IHNlbmRlclF1ZXJ5LmZpcnN0KClcclxuICAgICAgICAgICAgICAgIHNlbmRlckhhbmdvdXQuc2V0KCdtZXNzYWdlJywgbWVzc2FnZSlcclxuICAgICAgICAgICAgICAgIHNlbmRlckhhbmdvdXQuc2V0KCd0aW1lc3RhbXAnLCB0aW1lc3RhbXApXHJcbiAgICAgICAgICAgICAgICBzZW5kZXJIYW5nb3V0LnNldCgnc3RhdGUnLCBzZW5kZXJTdGF0ZSlcclxuICAgICAgICAgICAgICAgIHNlbmRlckhhbmdvdXQuc2F2ZSgpXHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1VOUkVBREhBTkdPVVRcclxuICAgICAgICAgICAgY29uc3QgVW5yZWFkSGFuZ291dCA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJVbnJlYWRIYW5nb3V0XCIpO1xyXG4gICAgICAgICAgICBjb25zdCB1bnJlYWRUYXJnZXQgPSBuZXcgVW5yZWFkSGFuZ291dCgpXHJcbiAgICAgICAgICAgIHVucmVhZFRhcmdldC5zZXQoJ3VzZXJuYW1lJywgdXNlci51c2VybmFtZSlcclxuICAgICAgICAgICAgdW5yZWFkVGFyZ2V0LnNldCgnZW1haWwnLCB1c2VyLmVtYWlsKVxyXG4gICAgICAgICAgICB1bnJlYWRUYXJnZXQuc2V0KCdtZXNzYWdlJywgbWVzc2FnZSlcclxuICAgICAgICAgICAgdW5yZWFkVGFyZ2V0LnNldCgndGltZXN0YW1wJywgdGltZXN0YW1wKVxyXG4gICAgICAgICAgICB1bnJlYWRUYXJnZXQuc2V0KCdzdGF0ZScsIHRhcmdldFN0YXRlKVxyXG4gICAgICAgICAgICB1bnJlYWRUYXJnZXQuc2V0KCd1c2VyaWQnLCB0YXJnZXRVc2VyLmF0dHJpYnV0ZXMudXNlcmlkKVxyXG4gICAgICAgICAgICB0YXJnZXRVc2VyLmFkZFVuaXF1ZSgndW5yZWFkaGFuZ291dHMnLCB1bnJlYWRUYXJnZXQpXHJcbiAgICAgICAgICAgIHVucmVhZFRhcmdldC5zZXQoJ293bmVyJywgdGFyZ2V0VXNlcilcclxuICAgICAgICAgICAgLy9TQVZFIEhBTkdPVVRVU0VSXHJcbiAgICAgICAgICAgIHNlbmRlclVzZXIuc2F2ZSgpXHJcbiAgICAgICAgICAgIHRhcmdldFVzZXIuc2F2ZSgpXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyBQYXJzZVNlcnZlciB9IGZyb20gJy4uL3NlcnZpY2VzL3BhcnNlL1BhcnNlU2VydmVyJ1xyXG5pbXBvcnQgeyBXZWJTb2NrZXRDb250YWluZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy93ZWJzb2NrZXQvV2ViU29ja2V0Q29udGFpbmVyJ1xyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0QWRhcHRlcihwcm9wcykge1xyXG4gICAgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfUEFSU0UnKSB7XHJcbiAgICAgICAgcmV0dXJuIDxQYXJzZVNlcnZlciB7Li4ucHJvcHN9IC8+XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChQUkVBQ1RfQVBQX0JBQ0sgPT09ICdQUkVBQ1RfQVBQX05PREVKUycpIHtcclxuICAgICAgICByZXR1cm4gPFdlYlNvY2tldENvbnRhaW5lciB7Li4ucHJvcHN9IC8+XHJcbiAgICB9XHJcblxyXG4gICAgZWxzZSByZXR1cm4gbnVsbDtcclxufSIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgQXBwUm91dGVQcm92aWRlciBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSc7XHJcbmltcG9ydCBIYW5nb3V0QWRhcHRlciBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0QWRhcHRlcic7XHJcbmltcG9ydCBIYW5nb3V0c1Byb3ZpZGVyIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInXHJcbmltcG9ydCBBdXRoUHJvdmlkZXIgZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24nO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwUHJvdmlkZXJzKHsgY2hpbGRyZW4gfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXBwUm91dGVQcm92aWRlclxyXG4gICAgICB0aXRsZT1cIldlYmNvbVwiXHJcbiAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnIH19XHJcbiAgICA+XHJcbiAgICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgICAgPEhhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgICAgICA8SGFuZ291dEFkYXB0ZXIgc29ja2V0VXJsPXtgd3NzOi8vJHtpcH06MzAwMGB9PlxyXG4gICAgICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgICA8L0hhbmdvdXRBZGFwdGVyPlxyXG4gICAgICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuICAgICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgICA8L0FwcFJvdXRlUHJvdmlkZXI+XHJcblxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZiYXIocHJvcHMpIHtcclxuICAgIGNvbnN0IHsgYmcgPSAnbGlnaHQnLCBicmFuZCwgY2hpbGRyZW4gfSA9IHByb3BzXHJcbiAgICByZXR1cm4gPG5hdiBjbGFzc05hbWU9e2BuYXZiYXIgbmF2YmFyLWV4cGFuZC1sZyBuYXZiYXItJHtiZ30gYmctJHtiZ31gfT5cclxuICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiI1wiPnticmFuZH08L2E+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlclwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIjbmF2YmFyU3VwcG9ydGVkQ29udGVudFwiIGFyaWEtY29udHJvbHM9XCJuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1sYWJlbD1cIlRvZ2dsZSBuYXZpZ2F0aW9uXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVyLWljb25cIj48L3NwYW4+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICBcclxuICAgIDwvbmF2PlxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkJhckNvbGxhcHNlKHtjaGlsZHJlbn0pe1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCIgaWQ9XCJuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCI+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkJhck5hdih7IGNoaWxkcmVuIH0pIHtcclxuICAgIHJldHVybiA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLW5hdiBtci1hdXRvXCI+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgPC91bD5cclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gTmF2SXRlbSh7IGNoaWxkcmVuIH0pIHtcclxuICBcclxuICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW1cIj57Y2hpbGRyZW59PC9saT5cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZMaW5rKHByb3BzKSB7XHJcbiAgICBjb25zdCB7YXBwUm91dGV9PXByb3BzXHJcbiAgICBjb25zdCB7b25BcHBSb3V0ZX09dXNlQXBwUm91dGUoKVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgXHJcbiAgICAgICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOmAvJHtpZH1gLHJvdXRlOmFwcFJvdXRlfSlcclxuICAgICAgfVxyXG4gICAgcmV0dXJuIDxhIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgaHJlZj1cIiNcIiBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gIHsuLi5wcm9wc30vPlxyXG59IiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2IChwcm9wcyl7XHJcbiAgICBjb25zdCB7Y2hpbGRyZW4saG9yaXpvbnRhbEFsaWdubWVudH09cHJvcHNcclxuXHJcbnJldHVybiA8dWwgY2xhc3NOYW1lPXtgbmF2ICR7aG9yaXpvbnRhbEFsaWdubWVudCAmJiBob3Jpem9udGFsQWxpZ25tZW50fWB9IHsuLi5wcm9wc30+e2NoaWxkcmVufTwvdWw+XHJcbn1cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBOYXZiYXIsIHsgTmF2QmFyTmF2LCBOYXZJdGVtLCBOYXZMaW5rLCBOYXZCYXJDb2xsYXBzZSB9IGZyb20gJ2NvbXBvbmVudHMvbmF2LWJhcidcclxuaW1wb3J0IE5hdiBmcm9tICdjb21wb25lbnRzL25hdidcclxuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VVc2VyTmFtZSdcclxuaW1wb3J0IHsgdXNlQXV0aCB9IGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uJ1xyXG5pbXBvcnQgTmF2RHJvcGRvd24sIHsgRHJvcGRvd25NZW51LCBEcm9wZG93bkl0ZW0gfSBmcm9tICdjb21wb25lbnRzL25hdi1iYXIvbmF2LWRyb3Bkb3duJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcE5hdmlnYXRpb24oKSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gdXNlVXNlck5hbWUoKVxyXG4gIGNvbnN0IHsgb25TaWduT3V0IH0gPSB1c2VBdXRoKClcclxuICByZXR1cm4gPGRpdiA+XHJcbiAgICA8TmF2YmFyIGJyYW5kPVwiV2ViY29tXCIgYmc9XCJkYXJrXCI+XHJcbiAgICAgIDxOYXZCYXJDb2xsYXBzZT5cclxuICAgICAgICA8TmF2QmFyTmF2PlxyXG4gICAgICAgICAgPE5hdkl0ZW0+XHJcbiAgICAgICAgICAgIHt1c2VybmFtZSAmJiA8TmF2TGluayBpZD1cImhhbmdvdXRcIiBhcHBSb3V0ZT1cIi9oYW5nb3V0c1wiPkhhbmdvdXRzPC9OYXZMaW5rPn1cclxuICAgICAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgICA8L05hdkJhck5hdj5cclxuICAgICAgICA8TmF2IGhvcml6b250YWxBbGlnbm1lbnQ9XCJqdXN0aWZ5LWNvbnRlbnQtZW5kXCI+XHJcbiAgICAgICAgICB7IXVzZXJuYW1lICYmIDxOYXZJdGVtPlxyXG4gICAgICAgICAgICA8TmF2TGluayBpZD1cImxvZ2luXCIgYXBwUm91dGU9XCIvYXV0aFwiIGRhdGEtdGVzdGlkPVwibG9naW4tbGlua1wiPlNpZ24gaW48L05hdkxpbms+XHJcbiAgICAgICAgICA8L05hdkl0ZW0+fVxyXG4gICAgICAgICAgeyF1c2VybmFtZSAmJiA8TmF2SXRlbT5cclxuICAgICAgICAgICAgPE5hdkxpbmsgaWQ9XCJzaWdudXBcIiBhcHBSb3V0ZT1cIi9hdXRoXCIgZGF0YS10ZXN0aWQ9XCJzaWdudXAtbGlua1wiPlNpZ24gdXA8L05hdkxpbms+XHJcbiAgICAgICAgICA8L05hdkl0ZW0+fVxyXG4gICAgICAgICAgPE5hdkl0ZW0+XHJcbiAgICAgICAgICAgIHt1c2VybmFtZSAmJiA8TmF2TGluayBpZD1cInByb2ZpbGVcIiBhcHBSb3V0ZT1cIi9hdXRoXCIgZGF0YS10ZXN0aWQ9XCJwcm9maWxlLWxpbmtcIj5XZWxjb21lLCB7dXNlcm5hbWV9PC9OYXZMaW5rPn1cclxuICAgICAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgICAgIDxOYXZJdGVtPlxyXG4gICAgICAgICAgICB7dXNlcm5hbWUgJiYgPE5hdkxpbmsgaWQ9XCJwcm9maWxlXCIgYXBwUm91dGU9XCIvYXV0aFwiIGRhdGEtdGVzdGlkPVwic2lnbm91dC1saW5rXCIgb25DbGljaz17b25TaWduT3V0fT5TaWduIG91dDwvTmF2TGluaz59XHJcbiAgICAgICAgICA8L05hdkl0ZW0+XHJcbiAgICAgICAgPC9OYXY+XHJcbiAgICAgIDwvTmF2QmFyQ29sbGFwc2U+XHJcbiAgICA8L05hdmJhcj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhvbWUoKSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9J2hvbWUnIHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PkhvbWU8L2Rpdj47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnLi9Ib21lJztcclxuaW1wb3J0IHtBdXRoRmF0dXJlUm91dGVzfSBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbidcclxuXHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ291dCcpKTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVzKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzEwMCUnfX0+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2F1dGhcIj5cclxuXHJcbiAgICA8QXV0aEZhdHVyZVJvdXRlcy8+XHJcbiAgIFxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9cIj5cclxuICAgICAgICA8SG9tZSAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SGFuZ291dHMgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gIFxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgQXBwTmF2aWdhdGlvbiB9IGZyb20gJy4vQXBwTmF2aWdhdGlvbidcclxuaW1wb3J0IHsgQXBwUm91dGVzIH0gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcCgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiA+XHJcbiAgICAgIDxBcHBOYXZpZ2F0aW9uIC8+XHJcbiAgICAgIDxBcHBSb3V0ZXMgLz5cclxuICAgICAgeycnfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgJ3doYXR3Zy1mZXRjaCc7XHJcbmltcG9ydCB7IGgsIHJlbmRlciB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEFwcFByb3ZpZGVycyB9IGZyb20gJy4vQXBwUHJvdmlkZXJzJztcclxuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi9BcHAnO1xyXG5QYXJzZS5pbml0aWFsaXplKFwienR0cG5xVHI4cmVma3RCV05la1poWnhTeHdQYUFBbkVsUTlrN0N1QVwiLFwiUTdTSFNGTEc2MThpemJ5U01wQXNGQXFnbk9MYVlneE5sd2ZGaE9BclwiKTsgLy9QQVNURSBIRVJFIFlPVVIgQmFjazRBcHAgQVBQTElDQVRJT04gSUQgQU5EIFlPVVIgSmF2YVNjcmlwdCBLRVlcclxuUGFyc2Uuc2VydmVyVVJMID0gYGh0dHBzOi8vJHtpcH06MTMzNy9wYXJzZWBcclxuLy9QYXJzZS5saXZlUXVlcnlTZXJ2ZXJVUkwgPSBgaHR0cHM6Ly8ke2lwfToxMzM3L3BhcnNlYFxyXG4vL1BhcnNlLnNlcnZlclVSTCA9ICdodHRwczovL3BhcnNlYXBpLmJhY2s0YXBwLmNvbS8nXHJcbi8vUGFyc2UubGl2ZVF1ZXJ5U2VydmVyVVJMID0gYHdzczovL3dlYmFwaXMuYmFjazRhcHAuaW9gXHJcbnJlbmRlcihcclxuICA8QXBwUHJvdmlkZXJzPlxyXG4gICAgPEFwcCAvPlxyXG4gIDwvQXBwUHJvdmlkZXJzPixcclxuXHJcbiAgZG9jdW1lbnQuYm9keVxyXG4pO1xyXG4iXSwibmFtZXMiOlsidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJGZWF0dXJlUm91dGUiLCJwcm9wcyIsImNoaWxkcmVuIiwicGF0aCIsInBhdGhzIiwiZGlzcGF0Y2giLCJmaW5kIiwidXNlQXBwUm91dGUiLCJuYW1lIiwib25BcHBSb3V0ZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiQXBwUm91dGUiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInVzZUVmZmVjdCIsImdldEl0ZW0iLCJwYXJzZSIsInZhbHVlIiwidXNlTWVtbyIsIlNFTkRJTkdfSEFOR09VVF9TVEFSVEVEIiwiU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQiLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTRUFSQ0hfSU5QVVRfQ0hBTkdFIiwiU0VMRUNURURfSEFOR09VVCIsIkNMRUFSRURfSEFOR09VVCIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRVJST1JfUkVDSUVWRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEIiwiTUVTU0FHRVNfVVBEQVRFRCIsIkhBTkdPVVRTX1VQREFURUQiLCJIQU5HT1VUX1VQREFURUQiLCJVTlJFQURfSEFOR09VVFNfVVBEQVRFRCIsIkNPTk5FQ1RJTkciLCJPUEVOIiwiQ0xPU0lORyIsIkNMT1NFRCIsIlNPQ0tFVF9SRUFEWSIsIlNPQ0tFVF9FUlJPUiIsImhhbmdvdXRzIiwiaGFuZ291dCIsInVucmVhZGhhbmdvdXRzIiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJzb2NrZXQiLCJyZWFkeVN0YXRlIiwic29ja2V0TWVzc2FnZSIsImZldGNoSGFuZ291dHMiLCJwZW5kaW5nSGFuZ291dCIsIm1lc3NhZ2UiLCJ0ZXh0IiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJGSUxURVJfSEFOR09VVFMiLCJmaWx0ZXIiLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiaGFuZ291dFN0YXRlcyIsIklOVklURVIiLCJBQ0NFUFRFUiIsIkRFQ0xJTkVSIiwiQkxPQ0tFUiIsIlVOQkxPQ0tFUiIsIk1FU1NBTkdFUiIsIklOVklURUQiLCJBQ0NFUFRFRCIsIkRFQ0xJTkVEIiwiQkxPQ0tFRCIsIlVOQkxPQ0tFRCIsIk1FU1NBR0VEIiwidXBkYXRlRGVsaXZlcmVkSGFuZ291dCIsIm9mZmxpbmUiLCJ0aW1lc3RhbXAiLCJkZWxpdmVyZWRIYW5nb3V0IiwiZGVsaXZlcmVkIiwiaGFuZ291dEtleSIsImhhbmdvdXRJbmRleCIsImZpbmRJbmRleCIsInNwbGljZSIsInVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UiLCJ1cGRhdGVCb2NrZWRTdGF0ZSIsIm9mZmxpbmVIYW5nb3V0S2V5Iiwib2ZmbGluZWhhbmdvdXRzIiwiZGVsaXZlcmVkTWVzc2FnZSIsIm1lc3NhZ2VLZXkiLCJibG9ja2VkTWVzc2FnZSIsInNhdmVNZXNzYWdlZCIsInNhdmVJbnZpdGVkIiwic2F2ZUFjY2VwdGVkIiwic2F2ZURlY2xpbmVkIiwic2F2ZUJsb2NrZWQiLCJzYXZlVW5ibG92a2VkIiwic2F2ZVJlY2lldmVkSGFuZ291dCIsImZvY3VzZWRIYW5nb3V0IiwidW5yZWFkIiwiaGFuZ291dEV4aXN0IiwiaGciLCJyZWFkIiwidXBkYXRlZEhhbmdvdXRzIiwic2F2ZVJlY2lldmVkTWVzc2FnZSIsInNhdmVVbnJlYWRIYW5nb3V0IiwidXBkYXRlZE1lc3NhZ2VzIiwidW5yZWFkaGFuZ291dHNLZXkiLCJ1cGRhdGVkdW5yZWFkcyIsInNhdmVJbnZpdGVyIiwic2F2ZUFjY2VwdGVyIiwic2F2ZUJsb2NrZXIiLCJzYXZlRGVjbGluZXIiLCJzYXZlTWVzc2FuZ2VyIiwic2F2ZVVuYmxvY2tlciIsInVzZU1lc3NhZ2UiLCJoYW5kbGVBY2tub3dsZWRnZW1lbnQiLCJoYW5kbGVIYW5nb3V0IiwiaGFuZGxlSGFuZ291dHMiLCJmb3JFYWNoIiwibG9hZEhhbmdvdXRzIiwic2VsZWN0VW5yZWFkIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJWQUxVRV9DSEFOR0VEIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJMT0dJTl9GQUlMRUQiLCJMT0dPVVQiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJTRVJWRVJfRVJST1JfUkVDSUVWRUQiLCJDT05TVFJBSU5UX1ZBTElEQVRJT04iLCJTRVRfRVJST1JfVE9fTlVMTCIsImxvZ2luIiwic2lnbnVwIiwiY2hhbmdlUGFzc3dvcmQiLCJyZXF1ZXN0UGFzc0NoYW5nZSIsInZhbGlkYXRpb24iLCJpc1ZhbGlkIiwidW5kZWZpbmVkIiwiZW1haWwiLCJwYXNzd29yZCIsImNvbmZpcm0iLCJlbWFpbG9ydXNlcm5hbWUiLCJzdWNjZXNzIiwiY3VycmVudCIsInRva2VuIiwiYXV0aEZlZWRiYWNrIiwiYXV0aFJlZHVjZXIiLCJuZXh0U3RhdGUiLCJhY2NvdW50QWxyZWFkeUV4aXRzIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlQYXNzd29yZE5vdFZhbGlkIiwiZW1haWxvcnVzZXJuYW1lTm90VmFsaWQiLCJ1c2VybmFtZUlzTm90UmVnaXN0ZXJlZCIsInBhc3N3b3JkRG9Ob3RNYXRjaCIsInRva2VuRXhwaXJlZCIsInNlcnZlclZhbGlkYXRpb25SYW5nZSIsInN0YXR1cyIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIklOVkFMSURfVVNFUk5BTUUiLCJJTlZBTElEX0VNUFRZX1NUUklORyIsIklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwiLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiUEFTU1dPUkRTX0RPX05PVF9NQVRDSCIsIkFDQ09VTlRfQUxSRUFEWV9FWElTVFMiLCJSRVFVSVJFRF9GSUVMRCIsInNlcnZlclZhbGlkYXRpb24iLCJodHRwU3RhdHVzIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwicGFzc3dvcmRSZWdleCIsImVtYWlsUmVnZXgiLCJ1c2VybmFtZVJlZ2V4IiwidmFsaWRhdGVFbWFpbENvbnN0cmFpbnQiLCJlbWFpbENvbnN0cmFpbnQiLCJSZWdFeHAiLCJ0ZXN0IiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsaWRhdGVFbXB0eVN0cmluZyIsImxlbmd0aCIsImN2IiwiUGFyc2UiLCJVc2VyIiwic2V0Iiwic2lnblVwIiwid2luZG93IiwiZ2V0Iiwib2JqZWN0SWQiLCJpZCIsIkhhbmdvdXRVc2VyIiwiT2JqZWN0IiwiZXh0ZW5kIiwiaGFuZ291dFVzZXIiLCJzYXZlIiwiY29kZSIsImxvZ0luIiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJjYXRjaCIsImZvcmdvdFBhc3N3b3JkIiwiZm9ybURpc3BhdGNoIiwicmVxdWVzdFBhc3N3b3JkUmVzZXQiLCJyZXN1bHQiLCJQYXJzZUF1dGhTZXJ2aWNlIiwiYWN0aW9ucyIsIkF1dGhBZGFwdGVyIiwiQXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsIkF1dGhQcm92aWRlciIsInVzZVVzZXJOYW1lIiwidXNlck5hbWUiLCJzZXRVc2VybmFtZSIsInVzZVN0YXRlIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsInNldE9iamVjdElkIiwidXBkYXRlUmVhZEhhbmdvdXRzIiwidXBkYXRlZHVucmVhZCIsIm1hcCIsInVwZGF0ZVJlYWRNZXNzc2FnZXMiLCJIYW5nb3V0Q29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiSGFuZ291dHNQcm92aWRlciIsImhhbmRsZU1lc3NhZ2UiLCJ1cGRhdGVkIiwidXNlQXV0aCIsIm9uQ2hhbmdlIiwidGFyZ2V0Iiwib25Mb2dpbiIsIm9uU2lnbnVwIiwib25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UiLCJvblBhc3N3b3JkQ2hhbmdlIiwib25TaWduT3V0IiwicmVtb3ZlSXRlbSIsIm9uTG9naW5CbHVyIiwib25TaWdudXBCbHVyIiwib25DaGFuZ2VQYXNzQmx1ciIsIm9uUmVxdWVzdFBhc3NDaGFuZ2VCbHVyIiwib25Gb2N1cyIsIkUiLCJ3IiwiQyIsImwiLCJBIiwiRiIsIk4iLCJNIiwiUCIsImgiLCJEIiwiSCIsIiQiLCJxIiwiTG9naW4iLCJsYXp5IiwiQ2hhbmdlUGFzc3dvcmQiLCJGb3Jnb3RQYXNzd29yZCIsIlNpZ251cCIsIlByb2ZpbGUiLCJBdXRoRmVhdHVyZVJvdXRlcyIsIlN1c3BlbnNlIiwic2F2ZVBlbmRpbmdIYW5nb3V0IiwiaXNCbG9ja2VyIiwic2F2ZUhhbmdvdXQiLCJzYXZlTWVzc2FnZSIsImJsb2NrZXIiLCJEYXRlIiwibm93IiwiZmxvYXQiLCJzZW5kT2ZmbGluZUhhbmdvdXRzIiwib2ZmbGluZUhhbmdvdXRzIiwiZm9yZUVhY2giLCJzZW5kIiwiY29tbWFuZCIsInJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkIiwiZmlsdGVyZWRIYW5nb3V0cyIsInVzZUhhbmdvdXRzIiwiYXV0aENvbnRleHQiLCJ1c2VycyIsIm9uUmVtb3ZlVW5yZWFkIiwiY3VycmVudFRhcmdldCIsIm9uTmF2aWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsIm9uU2VsZWN0SGFuZ291dCIsIm9uU2VsZWN0VW5yZWFkIiwib25TZWFyY2hJbnB1dCIsIm9uRmV0Y2hIYW5nb3V0cyIsIm9uTWVzc2FnZVRleHQiLCJvbkhhbmdvdXQiLCJ1c2VySWQiLCJxdWVyeSIsIlF1ZXJ5IiwiZXF1YWxUbyIsInNlYXJjaFJlc3VsdCIsIm1hcHBlZEhhbm91dHMiLCJhdHRyaWJ1dGVzIiwiY2xpZW50Q29tbWFuZHMiLCJJTlZJVEUiLCJBQ0NFUFQiLCJERUNMSU5FIiwiQkxPQ0siLCJVTkJMT0NLIiwiTUVTU0FHRSIsIk9OTElORSIsInN0YXRlTWFwcGVyIiwic2VuZGVyU3RhdGUiLCJ0YXJnZXRTdGF0ZSIsIlBhcnNlU2VydmVyIiwic2VuZEhhbmdvdXQiLCJzdWJTY3JpYmVUb1VucmVhZEhhbmdvdXQiLCJzdWJTY3JpYmVUb0hhbmdvdXQiLCJMaXZlUXVlcnkiLCJvbiIsInVucmVhZGhhbmdvdXQiLCJyZW1vdmVVbnJlYWRIYW5nb3V0IiwiVW5yZWFkSGFuZ291dCIsImRlc3Ryb3kiLCJzdWJzY3JpcHRpb24iLCJzdWJzY3JpYmUiLCJvYmplY3QiLCJIYW5nb3V0IiwiU2VuZGVyVXNlciIsInNlbmRlclF1ZXJ5Iiwic2VuZGVyVXNlciIsImZpcnN0IiwiVGFyZ2V0VXNlciIsInRhcmdldFF1ZXJ5IiwidGFyZ2V0VXNlciIsInNlbmRlciIsInVzZXJpZCIsImFkZFVuaXF1ZSIsInRhcmdldEhhbmdvdXQiLCJzZW5kZXJIYW5nb3V0IiwidW5yZWFkVGFyZ2V0IiwiSGFuZ291dEFkYXB0ZXIiLCJBcHBQcm92aWRlcnMiLCJpcCIsIk5hdmJhciIsImJnIiwiYnJhbmQiLCJOYXZCYXJDb2xsYXBzZSIsIk5hdkJhck5hdiIsIk5hdkl0ZW0iLCJOYXZMaW5rIiwiYXBwUm91dGUiLCJoYW5kbGVSb3V0ZSIsInByZXZlbnREZWZhdWx0IiwiTmF2IiwiaG9yaXpvbnRhbEFsaWdubWVudCIsIkFwcE5hdmlnYXRpb24iLCJIb21lIiwicGFkZGluZ1RvcCIsIkhhbmdvdXRzIiwiQXBwUm91dGVzIiwiaGVpZ2h0IiwiQXV0aEZhdHVyZVJvdXRlcyIsIkFwcCIsImluaXRpYWxpemUiLCJzZXJ2ZXJVUkwiLCJyZW5kZXIiLCJkb2N1bWVudCIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLElBQUksSUFBSTtBQUN6QyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQ3BELEVBQUUsSUFBSTtBQUNOLElBQUksWUFBWSxJQUFJLElBQUk7QUFDeEIsSUFBSSxNQUFNLElBQUksSUFBSTtBQUNsQixJQUFJLENBQUMsV0FBVztBQUNoQixNQUFNLElBQUk7QUFDVixRQUFRLElBQUksSUFBSSxHQUFFO0FBQ2xCLFFBQVEsT0FBTyxJQUFJO0FBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNsQixRQUFRLE9BQU8sS0FBSztBQUNwQixPQUFPO0FBQ1AsS0FBSyxHQUFHO0FBQ1IsRUFBRSxRQUFRLEVBQUUsVUFBVSxJQUFJLElBQUk7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SUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1L1IsSUFBSUEsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXdPLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMs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aEs7QUFBMEtNLElBQUFBO0FBQTFLLEdBQVA7QUFDSDs7QUNqRnNlLFNBQVNPLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxJQUFJQyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ELEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFQSxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsQ0FBb1QsSUFBSUMsR0FBQyxDQUFDM1MsQ0FBQyxDQUFDLEdBQUcsQ0FBK0tBLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDMlMsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBSSxJQUFpUkMsR0FBQyxDQUFDNVMsQ0FBQyxDQUFDLElBQUksU0FBUzZTLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ04sR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQ00sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPMVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUNKLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM0UyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJRixDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNELEdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDelMsQ0FBQyxDQUFDc1MsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJSyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUlMLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQW9lLElBQUlFLEdBQUMsQ0FBQyxrT0FBa08sQ0FBQ1AsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsSUFBSVEsR0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUE2TSxJQUFJLENBQUMsQ0FBQ2xULENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUltVCxHQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUNwVCxDQUFDLENBQUMsS0FBSyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQ2tULEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUdDLEdBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLEdBQUdILENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMs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
