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

function fetch$1(input, init) {
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

fetch$1.polyfill = true;

if (!self.fetch) {
  self.fetch = fetch$1;
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
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOADED_MESSAGES: 'LOADED_MESSAGES',
  SEARCHED_HANGOUT: 'SEARCHED_HANGOUT',
  SELECTED_HANGOUT: 'SELECTED_HANGOUT',
  CLEARED_HANGOUT: 'CLEARED_HANGOUT',
  FETCH_HANGOUT_STARTED: 'FETCH_HANGOUT_STARTED',
  FETCH_HANGOUT_SUCCESS: 'FETCH_HANGOUT_SUCCESS',
  FETCH_HANGOUT_FAILED: 'FETCH_HANGOUT_FAILED',
  ONLINE_STATE_CHANGED: 'ONLINE_STATE_CHANGED',
  SOCKET_MESSAGE_RECIEVED: 'SOCKET_MESSAGE_RECIEVED',
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
  socketMessage: null
};
function reducer$1(state, action) {
  switch (action.type) {
    case actionTypes$1.CLEARED_HANGOUT:
      debugger;
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
      debugger;
      return { ...state,
        messages: action.messages
      };

    case actionTypes$1.SOCKET_MESSAGE_RECIEVED:
      return { ...state,
        socketMessage: action.socketMessage
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
        error: action.error
      };

    case actionTypes$1.FETCH_HANGOUT_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$1.FETCH_HANGOUT_SUCCESS:
      return { ...state,
        loading: false,
        hangouts: action.hangouts
      };

    case actionTypes$1.FILTER_HANGOUTS:
      return { ...state,
        hangouts: state.hangouts.filter(g => g.username.includes(state.search))
      };

    case actionTypes$1.SEARCHED_HANGOUT:
      return { ...state,
        search: action.search
      };

    case actionTypes$1.LOAD_HANGOUTS:
      return { ...state,
        hangouts: action.hangouts
      };

    case actionTypes$1.SELECTED_HANGOUT:
      return { ...state,
        hangout: state.hangouts.find(g => g.username === action.username)
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

function selectHangout({
  dispatch,
  username
}) {
  dispatch({
    type: actionTypes$1.SELECTED_HANGOUT,
    username
  });
}
function resetHangout({
  dispatch
}) {
  dispatch({
    type: actionTypes$1.CLEARED_HANGOUT
  });
}
function selectUnread({
  dispatch,
  username
}) {
  dispatch({
    type: actionTypes$1.SELECTED_HANGOUT,
    username
  });
} //search for hangout by typing into TextInput

function searchHangouts({
  search,
  dispatch
}) {
  dispatch({
    type: actionTypes$1.SEARCHED_HANGOUT,
    search
  });
} //filter hangout after search state change

function filterHangouts({
  dispatch
}) {
  dispatch({
    type: actionTypes$1.FILTER_HANGOUTS
  });
} //fetch hangout from server if not found in local hangouts

async function fetchHangout({
  search,
  dispatch,
  username
}) {
  try {
    dispatch({
      type: actionTypes$1.FETCH_HANGOUT_STARTED
    });
    const response = await fetch(`/hangouts/find?search=${search}&username=${username}`);

    if (response.ok) {
      const {
        hangouts
      } = await response.json();
      dispatch({
        type: actionTypes$1.FETCH_HANGOUT_SUCCESS,
        hangouts
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.FETCH_HANGOUT_FAILED,
      error
    });
  }
}
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
  debugger;

  if (unreadhangouts && unreadhangouts.length > 0) {
    debugger;
    let updatedunread = unreadhangouts.map(u => {
      if (u.username === username) {
        debugger;
        return { ...u,
          read: true
        };
      } else {
        return u;
      }
    });
    debugger;
    localStorage.setItem(unreadhangoutsKey, JSON.stringify(updatedunread));
    dispatch({
      type: actionTypes$1.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: updatedunread
    });
    debugger;
  }

  debugger; // set hangout to read

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
  debugger;
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
  debugger;
  const {
    username,
    message
  } = hangout;
  debugger;
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
    debugger;
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
    debugger;

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

function useSocketMessage({
  socketMessage,
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
    if (socketMessage && username) {
      switch (socketMessage.type) {
        case 'ACKHOWLEDGEMENT':
          handleAcknowledgement({
            hangout: socketMessage.hangout,
            offline: false
          });
          break;

        case 'HANGOUT':
          debugger;

          if (focusedHangout && focusedHangout.username === socketMessage.hangout.username) {
            debugger;
            handleHangout({
              hangout: socketMessage.hangout,
              unread: false
            });
          } else {
            debugger;
            handleHangout({
              hangout: socketMessage.hangout,
              unread: true
            });
          }

          break;

        case 'UNREAD_HANGOUTS':
          handleHangouts({
            hangouts: socketMessage.hangouts
          });
          break;

        case 'OFFLINE_ACKN':
          handleAcknowledgement({
            hangout: socketMessage.hangout,
            offline: true
          });
          break;
      }
    }
  }, [socketMessage, username]);
  return {};
}

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
  authFeedback: null
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
        token: action.token,
        username: action.username,
        email: action.email,
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
        token: action.token,
        username: action.username,
        email: action.email,
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
        token: action.token,
        username: action.username,
        email: action.email,
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
        username: action.user.username,
        email: action.user.email,
        token: action.user.token
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

function useWebSocket({
  socketUrl,
  username,
  dispatch,
  token
}) {
  p$1(() => {
    if (token) {
      debugger;
      debugger;
      const sock = new WebSocket(`${socketUrl}/?username=${username}`);

      sock.onmessage = message => {
        const msg = JSON.parse(message.data);
        dispatch({
          type: actionTypes$1.SOCKET_MESSAGE_RECIEVED,
          socketMessage: msg
        });
      };

      sock.onopen = () => {
        dispatch({
          type: actionTypes$1.OPEN
        });
      };

      sock.onclose = () => {
        dispatch({
          type: actionTypes$1.CLOSED
        });
      };

      sock.onerror = error => {
        dispatch({
          type: actionTypes$1.SOCKET_ERROR,
          error
        });
      };

      dispatch({
        type: actionTypes$1.SOCKET_READY,
        socket: sock
      });
    }
  }, [token]);
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
    socketUrl
  } = props;
  const authContext = useAuthContext();
  const {
    username,
    token
  } = authContext.state;
  const [state, dispatch] = m$1(reducer$1, initState);
  const {
    hangout,
    socketMessage
  } = state;
  const websocketHandler = useWebSocket({
    username,
    dispatch,
    socketUrl,
    token
  });
  const handleUseSocketMessage = useSocketMessage({
    username,
    dispatch,
    socketMessage,
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
      debugger;
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
        debugger;
        debugger;
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
  }, !state.username && h(UnAuthedState, {
    handleRoute: handleRoute
  }), state.username && h(AuthedState, {
    onAppRoute: onAppRoute,
    handleRoute: handleRoute,
    userName: state.username
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

function useUserName() {
  const [userName, setUsername] = v$1(null);
  const [token, setToken] = v$1(null);
  const [email, setEmail] = v$1('');
  const {
    state,
    dispatch
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
    if (state.token) {
      const {
        username,
        email,
        token
      } = state; // const { username, token, email } = JSON.parse(
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
    email
  };
}

function HangoutDrawerContent() {
  const {
    onAppRoute
  } = useAppRoute();
  const {
    userName
  } = useUserName();

  function handleRoute(e) {
    e.preventDefault();
    const {
      id
    } = e.target;

    if (userName) {
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

function savePendingHangout({
  dispatch,
  name,
  hangout,
  online,
  isBlocker
}) {
  debugger;
  const {
    username,
    message,
    state,
    email
  } = hangout;
  let hangoutKey = '';
  let messageKey = '';

  if (online) {
    debugger;
    hangoutKey = `${name}-hangouts`;
    messageKey = `${name}-${username}-messages`;
  } else {
    debugger;
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
    debugger;
    const hangoutIndex = hangouts.findIndex(g => g.username === username);
    hangouts.splice(hangoutIndex, 1, hangout);
    localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
    dispatch({
      type: actionTypes$1.HANGOUTS_UPDATED,
      hangouts
    });
  } else {
    debugger;
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
  const {
    username
  } = authContext.state;
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    search,
    users,
    messageText,
    messages,
    socketMessage,
    readyState,
    socket,
    unreadhangouts
  } = state;
  p$1(() => {
    if (socket && readyState === 1 && username) {
      sendOfflineHangouts({
        name: username,
        dispatch,
        socket
      });
    }
  }, [socket, readyState, username]);

  function onRemoveUnread(e) {
    const id = e.currentTarget.id;
    const hangout = hangouts.find(g => g.username === id);
    debugger;
    removeHangoutFromUnread({
      name: username,
      dispatch,
      hangout
    });
  }

  function onNavigation(e) {
    e.stopPropagation(); // const id =e.target.id

    const id = e.currentTarget.id;
    debugger;
    onAppRoute({
      featureRoute: `/${id}`,
      route: '/hangouts'
    });
  }

  function onSelectHangout(e) {
    const username = e.target.id;
    selectHangout({
      dispatch,
      username
    });
  }

  function onSelectUnread(e) {
    const username = e.target.id;
    debugger;
    selectUnread({
      dispatch,
      username
    });
    const hangout = hangouts.find(g => g.username === username);
    onAppRoute({
      featureRoute: `/${hangout.state}`,
      route: '/hangouts'
    });
  }

  function onSearch(e) {
    searchHangouts({
      search: e.target.value,
      dispatch
    });
  }

  function onStartSearch(e) {
    if (hangouts && hangouts.length > 0) {
      filterHangouts({
        dispatch
      });
    }

    fetchHangout({
      dispatch,
      search,
      username
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
    const online = true;
    let isBlocker = false;

    if (socket && readyState === 1) {
      if (hangout.state === 'BLOCKER') {
        isBlocker = true;
      } else {
        socket.send(JSON.stringify({
          username: hangout.username,
          email,
          message,
          command,
          timestamp
        }));
      }
    } else {
      online = false;
    }

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
    onNavigation,
    onSelectUnread,
    onMessageText,
    messageText,
    onStartSearch,
    onSearch,
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

function HangoutTopMenu() {
  const {
    onAppRoute
  } = useAppRoute();
  const {
    userName
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
  }, h(NavItem, null, userName), h(NavItem, null, h(OnlineStatus, {
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
      recoverLocalAuthState({
        dispatch,
        user: JSON.parse(localStorage.getItem('webcom'))
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
  debugger;

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

function signUp({
  dispatch,
  state,
  formDispatch
}) {
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
  debugger; // other fields can be set just like with Parse.Object

  user.signUp().then(function (user) {
    let username = user.get("username");
    let email = user.get("email");
    let token = user.get('sessionToken');
    debugger;
    dispatch({
      type: actionTypes$2.SIGNUP_SUCCESS,
      username,
      email,
      token
    });
    console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"), +user.get('sessionToken'));
  }).catch(function (error) {
    debugger;
    formDispatch(serverValidation({
      status: error.code
    }));
    console.log("Error: " + error.code + " " + error.message);
  });
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
    debugger;
    dispatch({
      type: actionTypes$2.LOGIN_SUCCESS,
      username,
      email,
      token
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

function useApp4backAuth() {
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

  function changepassword() {}

  function forgotpassword() {}

  return {
    signup,
    login: login$1,
    changepassword,
    forgotpassword
  };
}

const Login = L(() => import('./Login-e38a94e3.js'));
const ChangePassword = L(() => import('./ChangePassword-c86df0b2.js'));
const ForgotPassword = L(() => import('./ForgotPassword-53ca401b.js'));
const Signup = L(() => import('./Signup-31b19bec.js'));
const Profile = L(() => import('./Profile-04b8196a.js'));
const AuthFeedback = L(() => import('./AuthFeedback-fdb79f59.js'));
function App4backAuthentication({
  children
}) {
  const {
    signup,
    login,
    changePassword,
    forgotPassword
  } = useApp4backAuth();
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

const Hangouts = L(() => import('./index-66fdd808.js'));
const Group = L(() => import('./group-4aeb3064.js'));
function AppRoutes() {
  return h("div", {
    style: {
      height: '100%'
    }
  }, h(AppRoute, {
    path: "/auth"
  }, h(FormProvider, null, h(App4backAuthentication, null))), h(AppRoute, {
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

var css_248z$2 = "* {\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\n/* width */\r\n::-webkit-scrollbar {\r\n  width: 5px;\r\n}\r\n\r\n/* Track */\r\n::-webkit-scrollbar-track {\r\n  background: #f1f1f1;\r\n}\r\n\r\n/* Handle */\r\n::-webkit-scrollbar-thumb {\r\n  background: #888;\r\n}\r\n\r\n/* Handle on hover */\r\n::-webkit-scrollbar-thumb:hover {\r\n  background: #555;\r\n}\r\n\r\n@font-face {\r\n  font-family: \"Roboto\";\r\n  src: url(\"../theme/Roboto/Roboto-Regular.ttf\");\r\n}\r\n\r\nhtml {\r\n  font-family: \"Roboto\", Arial, Helvetica, sans-serif;\r\n}\r\n\r\nbody {\r\n  --bg-color:red;\r\n}\r\n*{\r\n  box-sizing: border-box;\r\n}";
styleInject(css_248z$2);

function App() {
  return h("div", {
    style: {
      height: '95vh'
    }
  }, h(AppNavigation, null), h(AppRoutes, null), '');
}

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
  }, h(AuthProvider, null, h(NavProvider, null, h(HangoutsProvider, {
    socketUrl: `wss://${"localhost"}:3000/hangouts`
  }, children)))));
}

Parse.initialize("zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA", "Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY

Parse.serverURL = 'http://localhost:1337/parse';
H(h(AppProviders, null, h(App, null)), document.body);

export { FeatureRoute as F, L, U, _extends as _, useAppRoute as a, useMediaQuery as b, useAuthContext as c, useFormContext as d, valueChanged as e, validationStates as f, clientValidation as g, h, isClientValidationType as i, v$1 as j, useThemeContext as k, useUserName as l, getTokenFromUrl as m, List as n, ListItem as o, p$1 as p, resetHangout as q, resetInputValidationState as r, styleInject as s, useHangouts as u, validationTypes as v, y };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMGE5MjY4YWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3JlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9zYXZlUmVjaWV2ZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0TWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlV2ViU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvTmF2UHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2NvbXBhdC9kaXN0L2NvbXBhdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZJdGVtLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2ljb25zL3VzZXI2NC5wbmciLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvQXV0aERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9uYXYvSGFuZ291dERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9TZXR0xLFuZ3MuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbmF2L0hhbmdvdXRUb3BNZW51LmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9zdHlsZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvRHJhd2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9BcHBCYXIuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L2ljb25zL01lbnVXaGl0ZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvTWVudS5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcE5hdmlnYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9Ib21lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uU3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybVJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9mb3JtLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uUmVnZXguanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9jb25zdHJhaW50VmFsaWRhdG9ycy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2h0dHAtc3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FwcDRiYWNrL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hcHA0YmFjay91c2VBcHA0YmFja0F1dGguanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BcHA0YmFja0F1dGhlbnRpY2F0aW9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwUHJvdmlkZXJzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHN1cHBvcnQgPSB7XG4gIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiZcbiAgICAnQmxvYicgaW4gc2VsZiAmJlxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxufVxuXG5mdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbn1cblxuaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gIF1cblxuICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPVxuICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgfVxuICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5eX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1c1xuICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG59XG5cbkJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICB1cmw6IHRoaXMudXJsXG4gIH0pXG59XG5cblJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG59XG5cbmV4cG9ydCB2YXIgRE9NRXhjZXB0aW9uID0gc2VsZi5ET01FeGNlcHRpb25cbnRyeSB7XG4gIG5ldyBET01FeGNlcHRpb24oKVxufSBjYXRjaCAoZXJyKSB7XG4gIERPTUV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG5hbWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpXG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrXG4gIH1cbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRE9NRXhjZXB0aW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaChpbnB1dCwgaW5pdCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCAmJiByZXF1ZXN0LnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgZnVuY3Rpb24gYWJvcnRYaHIoKSB7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgIH1cblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgfVxuICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgIH1cblxuICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICB9KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsKSB7XG4gICAgICByZXF1ZXN0LnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgcmVxdWVzdC5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gIH0pXG59XG5cbmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxuXG5pZiAoIXNlbGYuZmV0Y2gpIHtcbiAgc2VsZi5mZXRjaCA9IGZldGNoXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2Vcbn1cbiIsInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID17XHJcbiAgICBBUFBfUk9VVEVfQ0hBTkdFRDonQVBQX1JPVVRFX0NIQU5HRUQnLFxyXG4gICAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcclxuXHJcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxyXG5cclxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcclxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXHJcbiBcclxuICAgIFNFQVJDSEVEX0hBTkdPVVQ6ICdTRUFSQ0hFRF9IQU5HT1VUJyxcclxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcclxuICAgIENMRUFSRURfSEFOR09VVDonQ0xFQVJFRF9IQU5HT1VUJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXHJcbiAgICBcclxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxyXG5cclxuICAgIFNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEOidTT0NLRVRfTUVTU0FHRV9SRUNJRVZFRCcsXHJcblxyXG4gICAgXHJcbiAgICBNRVNTQUdFU19VUERBVEVEOidNRVNTQUdFU19VUERBVEVEJyxcclxuICAgIEhBTkdPVVRTX1VQREFURUQ6J0hBTkdPVVRTX1VQREFURUQnLFxyXG4gICAgSEFOR09VVF9VUERBVEVEOidIQU5HT1VUX1VQREFURUQnLFxyXG4gICAgVU5SRUFEX0hBTkdPVVRTX1VQREFURUQ6J1VOUkVBRF9IQU5HT1VUU19VUERBVEVEJyxcclxuICAgIC8vU09DS0VUXHJcblxyXG4gICAgQ09OTkVDVElORzonQ09OTkVDVElORycsXHJcbiAgICBPUEVOOidPUEVOJyxcclxuICAgIENMT1NJTkc6J0NMT1NJTkcnLFxyXG4gICAgQ0xPU0VEOidDTE9TRUQnLFxyXG4gICAgU09DS0VUX1JFQURZOidTT0NLRVRfUkVBRFknLFxyXG4gICAgU09DS0VUX0VSUk9SOidTT0NLRVRfRVJST1InXHJcblxyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBoYW5nb3V0czogbnVsbCxcclxuICBoYW5nb3V0OiBudWxsLFxyXG4gIHVucmVhZGhhbmdvdXRzOiBudWxsLFxyXG4gIG1lc3NhZ2VzOiBudWxsLFxyXG4gIHNlYXJjaDogJycsXHJcbiAgdXNlcjogW10sXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgbWVzc2FnZVRleHQ6ICcnLFxyXG4gIG9ubGluZTogZmFsc2UsXHJcbiAgc29ja2V0OiBudWxsLFxyXG4gIHJlYWR5U3RhdGU6IDAsXHJcbiAgc29ja2V0TWVzc2FnZTogbnVsbCxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUOlxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSxoYW5nb3V0Om51bGx9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVEOlxyXG4gICAgIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdW5yZWFkaGFuZ291dHM6IGFjdGlvbi51bnJlYWRoYW5nb3V0cyB9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRDpcclxuXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVEOlxyXG5kZWJ1Z2dlclxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfTUVTU0FHRV9SRUNJRVZFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldE1lc3NhZ2U6IGFjdGlvbi5zb2NrZXRNZXNzYWdlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlVGV4dDogYWN0aW9uLnRleHQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cclxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxyXG4gICAgICAgICksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzZWFyY2g6IGFjdGlvbi5zZWFyY2ggfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0OiBzdGF0ZS5oYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBhY3Rpb24udXNlcm5hbWUpLFxyXG4gICAgICB9O1xyXG4gICAgLy9TT0NLRVRcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX0VSUk9SOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DT05ORUNUSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWTpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyByZWR1Y2VyVW5yZWFkaGFuZ291dHMgfSBmcm9tICcuL3JlZHVjZVVucmVhZGhhbmdvdXRzJztcclxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xyXG59XHJcbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pe1xyXG4gIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNMRUFSRURfSEFOR09VVH0pXHJcbn0gXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHtkaXNwYXRjaCx1c2VybmFtZX0pe1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XHJcbn1cclxuXHJcbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxyXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcclxufVxyXG4vL2ZpbHRlciBoYW5nb3V0IGFmdGVyIHNlYXJjaCBzdGF0ZSBjaGFuZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xyXG59XHJcblxyXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXHJcbiAgICApO1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcclxuICBcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tJHtoYW5nb3V0LnVzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZVVucmVhZCh7IHVucmVhZGhhbmdvdXRzLCBkaXNwYXRjaCB9KSB7XHJcbiAgLy8gZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy4sIHVucmVhZGhhbmdvdXRzOiByZWR1Y2VyVW5yZWFkaGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyB9KSB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vRU5EIHNhdmVJbnZpdGVyXHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlYWRIYW5nb3V0cyh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0IH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICAvLyBzZXQgcmVhZCB0byB0cnVlIG9uIHVucmVhZCBoYW5nb3V0c1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgY29uc3QgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcbiAgZGVidWdnZXJcclxuICBpZiAodW5yZWFkaGFuZ291dHMmJiB1bnJlYWRoYW5nb3V0cy5sZW5ndGg+MCkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBsZXQgdXBkYXRlZHVucmVhZCA9IHVucmVhZGhhbmdvdXRzLm1hcCh1ID0+IHtcclxuICAgICAgaWYgKHUudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4udSwgcmVhZDogdHJ1ZSB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuZGVidWdnZXJcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkdW5yZWFkKSk7XHJcbmRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELHVucmVhZGhhbmdvdXRzOnVwZGF0ZWR1bnJlYWR9KVxyXG4gICAgZGVidWdnZXI7XHJcbiAgfVxyXG5kZWJ1Z2dlcjtcclxuICAvLyBzZXQgaGFuZ291dCB0byByZWFkXHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHsgLi4uaGFuZ291dCwgcmVhZDogdHJ1ZSB9KTtcclxuICAvL1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuXHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICB1cGRhdGVSZWFkTWVzc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUmVhZE1lc3NzYWdlcyh7IGhhbmdvdXQsIG5hbWUsIGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBjb25zdCB1cGRhdGVkTWVzc2FnZXMgPSBtZXNzYWdlcy5tYXAoKG0pID0+IHtcclxuICAgIHJldHVybiB7IC4uLm0sIHJlYWQ6IHRydWUgfTtcclxuICB9KTtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbn1cclxuIiwiXHJcbiAgZXhwb3J0IGNvbnN0IGhhbmdvdXRTdGF0ZXMgPSB7XHJcbiAgICBJTlZJVEVSOiAnSU5WSVRFUicsXHJcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcclxuICAgIERFQ0xJTkVSOiAnREVDTElORVInLFxyXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxyXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcclxuICAgIE1FU1NBTkdFUjogJ01FU1NBTkdFUicsXHJcbiAgIC8vIGFja25vd2xlZ2VtZW50XHJcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXHJcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcclxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxyXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxyXG4gICAgVU5CTE9DS0VEOiAnVU5CTE9DS0VEJyxcclxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnLFxyXG4gIH07IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgbmFtZSwgZGlzcGF0Y2gsIGhhbmdvdXQsIG9mZmxpbmUsIG9uQXBwUm91dGUgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHRpbWVzdGFtcCB9ID0gaGFuZ291dDtcclxuZGVidWdnZXI7XHJcbiAgY29uc3QgZGVsaXZlcmVkSGFuZ291dCA9IHsgLi4uaGFuZ291dCwgZGVsaXZlcmVkOiB0cnVlIH07XHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGRlbGl2ZXJlZEhhbmdvdXQpO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRCwgaGFuZ291dDogZGVsaXZlcmVkSGFuZ291dCB9KTtcclxuICBpZiAobWVzc2FnZSkge1xyXG5cclxuICAgIHVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgbmFtZSwgZGVsaXZlcmVkSGFuZ291dCxoYW5nb3V0IH0pO1xyXG4gIH1cclxuICBpZihoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnKXtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgdXBkYXRlQm9ja2VkU3RhdGUoe2Rpc3BhdGNoLG5hbWUsZGVsaXZlcmVkSGFuZ291dH0pXHJcbiAgfVxyXG4gIGlmIChvZmZsaW5lKSB7XHJcbiAgICAvL3JlbW92ZSBvZmZsaW5lIGhhbmdvdXRcclxuICAgIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBjb25zdCBvZmZsaW5laGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG9mZmxpbmVIYW5nb3V0S2V5KSk7XHJcblxyXG4gICAgaWYgKG9mZmxpbmVoYW5nb3V0cykge1xyXG4gICAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBvZmZsaW5laGFuZ291dHMuZmluZEluZGV4KFxyXG4gICAgICAgIChvKSA9PiBvLnRpbWVzdGFtcCA9PT0gdGltZXN0YW1wXHJcbiAgICAgICk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIG9mZmxpbmVIYW5nb3V0S2V5LFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxKSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgbmFtZSwgZGVsaXZlcmVkSGFuZ291dCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gZGVsaXZlcmVkSGFuZ291dDtcclxuXHJcbiAgY29uc3QgZGVsaXZlcmVkTWVzc2FnZSA9IHsgLi4ubWVzc2FnZSwgdXNlcm5hbWU6IG5hbWUsIGRlbGl2ZXJlZDogdHJ1ZSB9XHJcblxyXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gbWVzc2FnZXMuZmluZEluZGV4KFxyXG4gICAgKG0pID0+IG0udGltZXN0YW1wID09PSBtZXNzYWdlLnRpbWVzdGFtcFxyXG4gICk7XHJcbiAgbWVzc2FnZXMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkTWVzc2FnZSk7XHJcbiAgXHJcblxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXMgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsZGVsaXZlcmVkSGFuZ291dCxuYW1lfSl7XHJcbiAgZGVidWdnZXI7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gZGVsaXZlcmVkSGFuZ291dDtcclxuICBjb25zdCBibG9ja2VkTWVzc2FnZSA9IHsgdGltZXN0YW1wOmRlbGl2ZXJlZEhhbmdvdXQudGltZXN0YW1wLCB0ZXh0OiAneW91IGJsb2NrZWQgdGhpcyB1c2VyJywgdXNlcm5hbWU6IG5hbWUsIHR5cGU6ICdibG9ja2VkJyB9XHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIFxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KCBbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6Wy4uLm1lc3NhZ2VzLGJsb2NrZWRNZXNzYWdlXSB9KTtcclxufSIsImltcG9ydCB7IHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQgfSBmcm9tICcuL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGV9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcbmRlYnVnZ2VyO1xyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlVW5ibG92a2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQge2hhbmdvdXRTdGF0ZXN9ICBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcydcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWNpZXZlZEhhbmdvdXQoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZCxcclxufSkge1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcbiBkZWJ1Z2dlcjtcclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG5cclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG5cclxuIFxyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChoZz0+IGhnLnVzZXJuYW1lPT09dXNlcm5hbWUpXHJcbiAgICBpZihoYW5nb3V0RXhpc3Qpe1xyXG4gICAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcclxuICAgICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHN5bmMgbWVzc2FnZSB3aXRoIHJlZHVjZXIgc3RhdGVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7XHJcbiAgICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICAgIH0vL2VuZCBvZiBoYW5nb3V0IGV4aXN0XHJcbmVsc2V7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxufVxyXG5cclxufWVsc2V7XHJcbiAgZGVidWdnZXI7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuXHJcbn1cclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULFxyXG4gICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgIH0pO1xyXG4gICAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XHJcbiAgICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuICAgIHNhdmVSZWNpZXZlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAodW5yZWFkKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHN3aXRjaChoYW5nb3V0LnN0YXRlKXtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcclxuICAgICAgICBzYXZlVW5yZWFkSGFuZ291dCh7IG5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWNpZXZlZE1lc3NhZ2Uoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxufSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IG51bGw7XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogdHJ1ZSB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogZmFsc2UgfV07XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IHRydWUgfV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogZmFsc2UgfV07XHJcbiAgICB9XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG5cclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlVW5yZWFkSGFuZ291dCh7IG5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG4gIFxyXG4gIC8vdXBkYXRlIHVucmVhZCBoYW5nb3V0c1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gIGxldCB1cGRhdGVkdW5yZWFkcyA9IG51bGw7XHJcbiAgaWYgKHVucmVhZGhhbmdvdXRzKSB7XHJcbiAgICB1cGRhdGVkdW5yZWFkcyA9IFsuLi51bnJlYWRoYW5nb3V0cywgey4uLmhhbmdvdXQscmVhZDpmYWxzZX1dO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB1cGRhdGVkdW5yZWFkcyA9IFt7Li4uaGFuZ291dCxyZWFkOmZhbHNlfV07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkdW5yZWFkcykpO1xyXG5cclxuICBkaXNwYXRjaCh7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgIHVucmVhZGhhbmdvdXRzOiB1cGRhdGVkdW5yZWFkcyxcclxuICB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBzYXZlUmVjaWV2ZWRIYW5nb3V0IH0gZnJvbSAnLi9zYXZlUmVjaWV2ZWRIYW5nb3V0JztcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVJbnZpdGVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG5cclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY2NlcHRlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQmxvY2tlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuICBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURlY2xpbmVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSkge1xyXG5cclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufSAvLyBFTkQgc2F2ZU1lc3NhbmdlclxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb2NrZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiAgXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IGhhbmdvdXRTdGF0ZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcyc7XHJcbmltcG9ydCB7XHJcbiAgc2F2ZUludml0ZWQsXHJcbiAgc2F2ZVVuYmxvdmtlZCxcclxuICBzYXZlRGVjbGluZWQsXHJcbiAgc2F2ZUJsb2NrZWQsXHJcbiAgc2F2ZUFjY2VwdGVkLFxyXG4gIHNhdmVNZXNzYWdlZCxcclxufSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zJztcclxuaW1wb3J0IHtcclxuICBzYXZlQWNjZXB0ZXIsXHJcbiAgc2F2ZUJsb2NrZXIsXHJcbiAgc2F2ZURlY2xpbmVyLFxyXG4gIHNhdmVJbnZpdGVyLFxyXG4gIHNhdmVNZXNzYW5nZXIsXHJcbiAgc2F2ZVVuYmxvY2tlcixcclxufSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlU29ja2V0TWVzc2FnZSh7XHJcbiAgc29ja2V0TWVzc2FnZSxcclxuICB1c2VybmFtZSxcclxuICBkaXNwYXRjaCxcclxuICBmb2N1c2VkSGFuZ291dCxcclxufSkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0LG9mZmxpbmUgfSkge1xyXG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVEOlxyXG4gICAgICAgIHNhdmVJbnZpdGVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRUQ6XHJcbiAgICAgICAgc2F2ZVVuYmxvdmtlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORUQ6XHJcbiAgICAgICAgc2F2ZURlY2xpbmVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VEOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVCbG9ja2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFRDpcclxuICAgICAgICBzYXZlQWNjZXB0ZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQUdFRDpcclxuICAgICAgIFxyXG4gICAgICAgIHNhdmVNZXNzYWdlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsIHVucmVhZCB9KSB7XHJcbiAgICBcclxuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XHJcbiAgICAgICAgc2F2ZUFjY2VwdGVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRVI6XHJcbiAgICAgICBcclxuICAgICAgICBzYXZlQmxvY2tlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORVI6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZURlY2xpbmVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVSOlxyXG4gICAgICAgIHNhdmVJbnZpdGVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XHJcbiAgICAgICAgc2F2ZU1lc3Nhbmdlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VSOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVVbmJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRzKHsgaGFuZ291dHMgfSkge1xyXG4gICAgaGFuZ291dHMuZm9yRWFjaCgoaGFuZ291dCkgPT4ge1xyXG4gICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCx1bnJlYWQ6dHJ1ZSB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzb2NrZXRNZXNzYWdlICAmJiB1c2VybmFtZSkge1xyXG4gICAgXHJcbiAgICAgIHN3aXRjaCAoc29ja2V0TWVzc2FnZS50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnQUNLSE9XTEVER0VNRU5UJzpcclxuXHJcbiAgICAgICAgICBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsb2ZmbGluZTpmYWxzZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0hBTkdPVVQnOlxyXG5kZWJ1Z2dlcjtcclxuICAgICAgICAgIGlmKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PXNvY2tldE1lc3NhZ2UuaGFuZ291dC51c2VybmFtZSl7XHJcbiAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IHNvY2tldE1lc3NhZ2UuaGFuZ291dCx1bnJlYWQ6ZmFsc2UgfSk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IHNvY2tldE1lc3NhZ2UuaGFuZ291dCx1bnJlYWQ6dHJ1ZSB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdVTlJFQURfSEFOR09VVFMnOlxyXG4gICBcclxuICAgICAgICAgIGhhbmRsZUhhbmdvdXRzKHsgaGFuZ291dHM6IHNvY2tldE1lc3NhZ2UuaGFuZ291dHMgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdPRkZMSU5FX0FDS04nOlxyXG4gICAgICAgXHJcbiAgICAgICAgICBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsb2ZmbGluZTp0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3NvY2tldE1lc3NhZ2UsIHVzZXJuYW1lXSk7XHJcblxyXG4gIHJldHVybiB7fTtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgVkFMVUVfQ0hBTkdFRDogJ1ZBTFVFX0NIQU5HRUQnLFxyXG4gIExPR0lOX1NUQVJURUQ6ICdMT0dJTl9TVEFSVEVEJyxcclxuICBMT0dJTl9TVUNDRVNTOiAnTE9HSU5fU1VDQ0VTUycsXHJcbiAgTE9HSU5fRkFJTEVEOiAnTE9HSU5fRkFJTEVEJyxcclxuXHJcbiAgTE9HT1VUX1NUQVJURUQ6ICdMT0dPVVRfU1RBUlRFRCcsXHJcbiAgTE9HT1VUX0ZBSUxFRDogJ0xPR09VVF9GQUlMRUQnLFxyXG4gIExPR09VVF9TVUNDRVNTOiAnTE9HT1VUX1NVQ0NFU1MnLFxyXG5cclxuICBTSUdOVVBfU1RBUlRFRDogJ1NJR05VUF9TVEFSVEVEJyxcclxuICBTSUdOVVBfU1VDQ0VTUzogJ1NJR05VUF9TVUNDRVNTJyxcclxuICBTSUdOVVBfRkFJTEVEOiAnU0lHTlVQX0ZBSUxFRCcsXHJcblxyXG4gIENIQU5HRV9QQVNTV09SRF9TVEFSVEVEOiAnQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9TVUNDRVNTOiAnQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9GQUlMRUQ6ICdDSEFOR0VfUEFTU1dPUkRfRkFJTEVEJyxcclxuXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQnLFxyXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogJ0dPVF9UT0tFTl9GUk9NX1VSTCcsXHJcblxyXG4gIFJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTogJ1JFQ09WRVJfTE9DQUxfQVVUSF9TVEFURScsXHJcbn07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBlbWFpbDogJycsXHJcbiAgcGFzc3dvcmQ6ICcnLFxyXG4gIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIHVzZXJuYW1lOiAnJyxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBjb25maXJtOiAnJyxcclxuICBjdXJyZW50OiAnJyxcclxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxyXG4gIHRva2VuOiBudWxsLFxyXG4gIGlzTG9nZ2VkSW46IGZhbHNlLFxyXG4gIGlzUGFzc3dvcmRDaGFuZ2VkOiBmYWxzZSxcclxuICBhdXRoRmVlZGJhY2s6IG51bGwsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXV0aFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRDpcclxuICAgICAgY29uc3QgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIFthY3Rpb24ucGF5bG9hZC5wcm9wTmFtZV06IGFjdGlvbi5wYXlsb2FkLnZhbHVlLFxyXG4gICAgICB9O1xyXG4gIFxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXHJcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lLCAnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZScsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIGlzUGFzc3dvcmRDaGFuZ2VkOiB0cnVlLFxyXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkw6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5pbml0U3RhdGUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlci51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLnVzZXIuZW1haWwsXHJcbiAgICAgICAgdG9rZW46YWN0aW9uLnVzZXIudG9rZW5cclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IEF1dGhSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFthdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG5cclxuICBpZiAoYXV0aFJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xyXG4gIGNvbnN0IHsgdG8sIGlkIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldFJvdXRlKHRvKTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxhXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgey4uLnByb3BzfVxyXG4gICAgICBocmVmPXt0b31cclxuICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9XHJcbiAgICAgIHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiAnaW5oZXJpdCcgfX1cclxuICAgIC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGhSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aFJvdXRlQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXV0aFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgaW5pdGlhbFJvdXRlIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlU3RhdGUoaW5pdGlhbFJvdXRlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0sIFthdXRoUm91dGVdKTtcclxuXHJcbiAgcmV0dXJuIDxBdXRoUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XHJcbmltcG9ydCB7IEF1dGhSb3V0ZVByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLXJvdXRlLWNvbnRleHQnO1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXRlLFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XHJcbiAgICAgIDxBdXRoUm91dGVQcm92aWRlcj57Y2hpbGRyZW59PC9BdXRoUm91dGVQcm92aWRlcj5cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlQXV0aENvbnRleHQsIEF1dGhQcm92aWRlciB9O1xyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VXZWJTb2NrZXQoeyBzb2NrZXRVcmwsIHVzZXJuYW1lLCBkaXNwYXRjaCx0b2tlbiB9KSB7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh0b2tlbikge1xyXG4gICAgICBkZWJ1Z2dlclxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3Qgc29jayA9IG5ldyBXZWJTb2NrZXQoYCR7c29ja2V0VXJsfS8/dXNlcm5hbWU9JHt1c2VybmFtZX1gKTtcclxuICAgICAgc29jay5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfTUVTU0FHRV9SRUNJRVZFRCwgc29ja2V0TWVzc2FnZTogbXNnIH0pO1xyXG4gICBcclxuICAgICAgfTtcclxuICAgICAgc29jay5vbm9wZW4gPSAoKSA9PiB7XHJcbiAgICAgXHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5PUEVOIH0pO1xyXG4gICAgICB9O1xyXG4gICAgICBzb2NrLm9uY2xvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTE9TRUQgfSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2sub25lcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX0VSUk9SLCBlcnJvciB9KTtcclxuICAgICAgfTtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfUkVBRFksIHNvY2tldDogc29jayB9KTtcclxuICAgIH1cclxuICB9LCBbdG9rZW5dKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHtcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZVN0YXRlLFxyXG4gIHVzZU1lbW8sXHJcbiAgdXNlUmVkdWNlcixcclxuICB1c2VFZmZlY3QsXHJcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcclxuXHJcbmltcG9ydCB7XHJcbiAgbG9hZEhhbmdvdXRzLFxyXG4gIGZpbHRlckhhbmdvdXRzLFxyXG4gIGZldGNoSGFuZ291dCxcclxuICBsb2FkTWVzc2FnZXMsXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgdXBkYXRlUmVhZEhhbmdvdXRzIH0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cyc7XHJcbmltcG9ydCB7IHVzZVNvY2tldE1lc3NhZ2UgfSBmcm9tICcuL3VzZVNvY2tldE1lc3NhZ2UnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlV2ViU29ja2V0IH0gZnJvbSAnLi91c2VXZWJTb2NrZXQnO1xyXG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEhhbmdvdXRDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBzb2NrZXRVcmwgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCB7IHVzZXJuYW1lLHRva2VuIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB7IGhhbmdvdXQsIHNvY2tldE1lc3NhZ2UgfSA9IHN0YXRlO1xyXG4gIGNvbnN0IHdlYnNvY2tldEhhbmRsZXIgPSB1c2VXZWJTb2NrZXQoeyB1c2VybmFtZSwgZGlzcGF0Y2gsIHNvY2tldFVybCx0b2tlbiB9KTtcclxuICBjb25zdCBoYW5kbGVVc2VTb2NrZXRNZXNzYWdlID0gdXNlU29ja2V0TWVzc2FnZSh7XHJcbiAgICB1c2VybmFtZSxcclxuICAgXHJcbiAgICBkaXNwYXRjaCxcclxuICAgIHNvY2tldE1lc3NhZ2UsXHJcbiAgICBmb2N1c2VkSGFuZ291dDogaGFuZ291dCxcclxuICB9KTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHVzZXJuYW1lKSB7XHJcbiAgICAgIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICB9LCBbdXNlcm5hbWVdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHVzZXJuYW1lICYmIHRva2VuKSB7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaGFuZ291dCAmJiB1c2VybmFtZSkge1xyXG4gIFxyXG4gICAgICAvL2Zyb20gbG9jYWwgc3RvcmFnZVxyXG4gICAgICBsb2FkTWVzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XHJcblxyXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcclxuICAgICAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYDtcclxuICAgICAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxyXG4gICAgICAgICAgKGcpID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWVcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcclxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFoYW5nb3V0LnJlYWQpIHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHVwZGF0ZVJlYWRIYW5nb3V0cyh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lOiB1c2VybmFtZSB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFtoYW5nb3V0LCB1c2VybmFtZV0pO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IE5hdkNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VOYXZDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KE5hdkNvbnRleHQpO1xyXG5cclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlTmF2Q29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBOYXZQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VOYXZpZ2F0aW9uKCkge1xyXG4gIGNvbnN0IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSA9IHVzZU5hdkNvbnRleHQoKTtcclxuICAgIGZ1bmN0aW9uIHRvZ2dsZURyYXdlcigpe1xyXG4gICAgICAgIHNldERyYXdlck9wZW4ocHJldj0+IXByZXYpXHJcbiAgICB9XHJcbiAgcmV0dXJuIHsgZHJhd2VyT3BlbiwgdG9nZ2xlRHJhd2VyIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSwgW2RyYXdlck9wZW5dKTtcclxuICByZXR1cm4gPE5hdkNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydHt1c2VTdGF0ZSBhcyBuLHVzZVJlZHVjZXIgYXMgdCx1c2VFZmZlY3QgYXMgZSx1c2VMYXlvdXRFZmZlY3QgYXMgcix1c2VSZWYgYXMgbyx1c2VJbXBlcmF0aXZlSGFuZGxlIGFzIHUsdXNlTWVtbyBhcyBpLHVzZUNhbGxiYWNrIGFzIGYsdXNlQ29udGV4dCBhcyBjLHVzZURlYnVnVmFsdWUgYXMgYX1mcm9tXCJwcmVhY3QvaG9va3NcIjtleHBvcnQqZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e0NvbXBvbmVudCBhcyBsLGNyZWF0ZUVsZW1lbnQgYXMgcyxvcHRpb25zIGFzIHYsdG9DaGlsZEFycmF5IGFzIGgsaHlkcmF0ZSBhcyBwLHJlbmRlciBhcyBkLF91bm1vdW50IGFzIG0sY2xvbmVFbGVtZW50IGFzIHksY3JlYXRlUmVmIGFzIGIsY3JlYXRlQ29udGV4dCBhcyBnLEZyYWdtZW50IGFzIHh9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2NyZWF0ZUVsZW1lbnQsY3JlYXRlQ29udGV4dCxjcmVhdGVSZWYsRnJhZ21lbnQsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2Z1bmN0aW9uIEUobix0KXtmb3IodmFyIGUgaW4gdCluW2VdPXRbZV07cmV0dXJuIG59ZnVuY3Rpb24gdyhuLHQpe2Zvcih2YXIgZSBpbiBuKWlmKFwiX19zb3VyY2VcIiE9PWUmJiEoZSBpbiB0KSlyZXR1cm4hMDtmb3IodmFyIHIgaW4gdClpZihcIl9fc291cmNlXCIhPT1yJiZuW3JdIT09dFtyXSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgQz1mdW5jdGlvbihuKXt2YXIgdCxlO2Z1bmN0aW9uIHIodCl7dmFyIGU7cmV0dXJuKGU9bi5jYWxsKHRoaXMsdCl8fHRoaXMpLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwLGV9cmV0dXJuIGU9biwodD1yKS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Ll9fcHJvdG9fXz1lLHIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuLHQpe3JldHVybiB3KHRoaXMucHJvcHMsbil8fHcodGhpcy5zdGF0ZSx0KX0scn0obCk7ZnVuY3Rpb24gXyhuLHQpe2Z1bmN0aW9uIGUobil7dmFyIGU9dGhpcy5wcm9wcy5yZWYscj1lPT1uLnJlZjtyZXR1cm4hciYmZSYmKGUuY2FsbD9lKG51bGwpOmUuY3VycmVudD1udWxsKSx0PyF0KHRoaXMucHJvcHMsbil8fCFyOncodGhpcy5wcm9wcyxuKX1mdW5jdGlvbiByKHQpe3JldHVybiB0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1lLHMobixFKHt9LHQpKX1yZXR1cm4gci5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD0hMCxyLmRpc3BsYXlOYW1lPVwiTWVtbyhcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIixyLnQ9ITAscn12YXIgQT12Ll9fYjtmdW5jdGlvbiBTKG4pe2Z1bmN0aW9uIHQodCl7dmFyIGU9RSh7fSx0KTtyZXR1cm4gZGVsZXRlIGUucmVmLG4oZSx0LnJlZil9cmV0dXJuIHQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9dC50PSEwLHQuZGlzcGxheU5hbWU9XCJGb3J3YXJkUmVmKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHR9di5fX2I9ZnVuY3Rpb24obil7bi50eXBlJiZuLnR5cGUudCYmbi5yZWYmJihuLnByb3BzLnJlZj1uLnJlZixuLnJlZj1udWxsKSxBJiZBKG4pfTt2YXIgaz1mdW5jdGlvbihuLHQpe3JldHVybiBuP2gobikucmVkdWNlKGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gbi5jb25jYXQodChlLHIpKX0sW10pOm51bGx9LFI9e21hcDprLGZvckVhY2g6ayxjb3VudDpmdW5jdGlvbihuKXtyZXR1cm4gbj9oKG4pLmxlbmd0aDowfSxvbmx5OmZ1bmN0aW9uKG4pe2lmKDEhPT0obj1oKG4pKS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuXCIpO3JldHVybiBuWzBdfSx0b0FycmF5Omh9LEY9di5fX2U7ZnVuY3Rpb24gTihuKXtyZXR1cm4gbiYmKChuPUUoe30sbikpLl9fYz1udWxsLG4uX19rPW4uX19rJiZuLl9fay5tYXAoTikpLG59ZnVuY3Rpb24gVSgpe3RoaXMuX191PTAsdGhpcy5vPW51bGwsdGhpcy5fX2I9bnVsbH1mdW5jdGlvbiBNKG4pe3ZhciB0PW4uX18uX19jO3JldHVybiB0JiZ0LnUmJnQudShuKX1mdW5jdGlvbiBMKG4pe3ZhciB0LGUscjtmdW5jdGlvbiBvKG8pe2lmKHR8fCh0PW4oKSkudGhlbihmdW5jdGlvbihuKXtlPW4uZGVmYXVsdHx8bn0sZnVuY3Rpb24obil7cj1ufSkscil0aHJvdyByO2lmKCFlKXRocm93IHQ7cmV0dXJuIHMoZSxvKX1yZXR1cm4gby5kaXNwbGF5TmFtZT1cIkxhenlcIixvLnQ9ITAsb31mdW5jdGlvbiBPKCl7dGhpcy5pPW51bGwsdGhpcy5sPW51bGx9di5fX2U9ZnVuY3Rpb24obix0LGUpe2lmKG4udGhlbilmb3IodmFyIHIsbz10O289by5fXzspaWYoKHI9by5fX2MpJiZyLl9fYylyZXR1cm4gci5fX2Mobix0Ll9fYyk7RihuLHQsZSl9LChVLnByb3RvdHlwZT1uZXcgbCkuX19jPWZ1bmN0aW9uKG4sdCl7dmFyIGU9dGhpcztudWxsPT1lLm8mJihlLm89W10pLGUuby5wdXNoKHQpO3ZhciByPU0oZS5fX3YpLG89ITEsdT1mdW5jdGlvbigpe298fChvPSEwLHI/cihpKTppKCkpfTt0Ll9fYz10LmNvbXBvbmVudFdpbGxVbm1vdW50LHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1KCksdC5fX2MmJnQuX19jKCl9O3ZhciBpPWZ1bmN0aW9uKCl7dmFyIG47aWYoIS0tZS5fX3UpZm9yKGUuX192Ll9fa1swXT1lLnN0YXRlLnUsZS5zZXRTdGF0ZSh7dTplLl9fYj1udWxsfSk7bj1lLm8ucG9wKCk7KW4uZm9yY2VVcGRhdGUoKX07ZS5fX3UrK3x8ZS5zZXRTdGF0ZSh7dTplLl9fYj1lLl9fdi5fX2tbMF19KSxuLnRoZW4odSx1KX0sVS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMuX19iJiYodGhpcy5fX3YuX19rWzBdPU4odGhpcy5fX2IpLHRoaXMuX19iPW51bGwpLFtzKGwsbnVsbCx0LnU/bnVsbDpuLmNoaWxkcmVuKSx0LnUmJm4uZmFsbGJhY2tdfTt2YXIgUD1mdW5jdGlvbihuLHQsZSl7aWYoKytlWzFdPT09ZVswXSYmbi5sLmRlbGV0ZSh0KSxuLnByb3BzLnJldmVhbE9yZGVyJiYoXCJ0XCIhPT1uLnByb3BzLnJldmVhbE9yZGVyWzBdfHwhbi5sLnNpemUpKWZvcihlPW4uaTtlOyl7Zm9yKDtlLmxlbmd0aD4zOyllLnBvcCgpKCk7aWYoZVsxXTxlWzBdKWJyZWFrO24uaT1lPWVbMl19fTsoTy5wcm90b3R5cGU9bmV3IGwpLnU9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcyxlPU0odC5fX3YpLHI9dC5sLmdldChuKTtyZXR1cm4gclswXSsrLGZ1bmN0aW9uKG8pe3ZhciB1PWZ1bmN0aW9uKCl7dC5wcm9wcy5yZXZlYWxPcmRlcj8oci5wdXNoKG8pLFAodCxuLHIpKTpvKCl9O2U/ZSh1KTp1KCl9fSxPLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obil7dGhpcy5pPW51bGwsdGhpcy5sPW5ldyBNYXA7dmFyIHQ9aChuLmNoaWxkcmVuKTtuLnJldmVhbE9yZGVyJiZcImJcIj09PW4ucmV2ZWFsT3JkZXJbMF0mJnQucmV2ZXJzZSgpO2Zvcih2YXIgZT10Lmxlbmd0aDtlLS07KXRoaXMubC5zZXQodFtlXSx0aGlzLmk9WzEsMCx0aGlzLmldKTtyZXR1cm4gbi5jaGlsZHJlbn0sTy5wcm90b3R5cGUuY29tcG9uZW50RGlkVXBkYXRlPU8ucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50PWZ1bmN0aW9uKCl7dmFyIG49dGhpcztuLmwuZm9yRWFjaChmdW5jdGlvbih0LGUpe1AobixlLHQpfSl9O3ZhciBXPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe312YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0fSx0LnJlbmRlcj1mdW5jdGlvbihuKXtyZXR1cm4gbi5jaGlsZHJlbn0sbn0oKTtmdW5jdGlvbiBqKG4pe3ZhciB0PXRoaXMsZT1uLmNvbnRhaW5lcixyPXMoVyx7Y29udGV4dDp0LmNvbnRleHR9LG4udm5vZGUpO3JldHVybiB0LnMmJnQucyE9PWUmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpLHQucD0hMSksbi52bm9kZT90LnA/KGUuX19rPXQuX19rLGQocixlKSx0Ll9faz1lLl9fayk6KHQudj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSxwKFwiXCIsZSksZS5hcHBlbmRDaGlsZCh0LnYpLHQucD0hMCx0LnM9ZSxkKHIsZSx0LnYpLHQuX19rPXQudi5fX2spOnQucCYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCkpLHQuaD1yLHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpfSxudWxsfWZ1bmN0aW9uIHoobix0KXtyZXR1cm4gcyhqLHt2bm9kZTpuLGNvbnRhaW5lcjp0fSl9dmFyIEQ9L14oPzphY2NlbnR8YWxpZ25tZW50fGFyYWJpY3xiYXNlbGluZXxjYXB8Y2xpcCg/IVBhdGhVKXxjb2xvcnxmaWxsfGZsb29kfGZvbnR8Z2x5cGgoPyFSKXxob3JpenxtYXJrZXIoPyFIfFd8VSl8b3ZlcmxpbmV8cGFpbnR8c3RvcHxzdHJpa2V0aHJvdWdofHN0cm9rZXx0ZXh0KD8hTCl8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZWN0b3J8dmVydHx3b3JkfHdyaXRpbmd8eCg/IUMpKVtBLVpdLztsLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXt9O3ZhciBIPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpfHw2MDEwMztmdW5jdGlvbiBUKG4sdCxlKXtpZihudWxsPT10Ll9faylmb3IoO3QuZmlyc3RDaGlsZDspdC5yZW1vdmVDaGlsZCh0LmZpcnN0Q2hpbGQpO3JldHVybiBkKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH1mdW5jdGlvbiBWKG4sdCxlKXtyZXR1cm4gcChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9dmFyIFo9di5ldmVudDtmdW5jdGlvbiBJKG4sdCl7bltcIlVOU0FGRV9cIit0XSYmIW5bdF0mJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLHQse2NvbmZpZ3VyYWJsZTohMSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tcIlVOU0FGRV9cIit0XX0sc2V0OmZ1bmN0aW9uKG4pe3RoaXNbXCJVTlNBRkVfXCIrdF09bn19KX12LmV2ZW50PWZ1bmN0aW9uKG4pe1omJihuPVoobikpLG4ucGVyc2lzdD1mdW5jdGlvbigpe307dmFyIHQ9ITEsZT0hMSxyPW4uc3RvcFByb3BhZ2F0aW9uO24uc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7ci5jYWxsKG4pLHQ9ITB9O3ZhciBvPW4ucHJldmVudERlZmF1bHQ7cmV0dXJuIG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtvLmNhbGwobiksZT0hMH0sbi5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1mdW5jdGlvbigpe3JldHVybiB0fSxuLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBlfSxuLm5hdGl2ZUV2ZW50PW59O3ZhciAkPXtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xhc3N9fSxxPXYudm5vZGU7di52bm9kZT1mdW5jdGlvbihuKXtuLiQkdHlwZW9mPUg7dmFyIHQ9bi50eXBlLGU9bi5wcm9wcztpZih0KXtpZihlLmNsYXNzIT1lLmNsYXNzTmFtZSYmKCQuZW51bWVyYWJsZT1cImNsYXNzTmFtZVwiaW4gZSxudWxsIT1lLmNsYXNzTmFtZSYmKGUuY2xhc3M9ZS5jbGFzc05hbWUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiY2xhc3NOYW1lXCIsJCkpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpe3ZhciByLG8sdTtmb3IodSBpbiBlLmRlZmF1bHRWYWx1ZSYmdm9pZCAwIT09ZS52YWx1ZSYmKGUudmFsdWV8fDA9PT1lLnZhbHVlfHwoZS52YWx1ZT1lLmRlZmF1bHRWYWx1ZSksZGVsZXRlIGUuZGVmYXVsdFZhbHVlKSxBcnJheS5pc0FycmF5KGUudmFsdWUpJiZlLm11bHRpcGxlJiZcInNlbGVjdFwiPT09dCYmKGgoZS5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbihuKXstMSE9ZS52YWx1ZS5pbmRleE9mKG4ucHJvcHMudmFsdWUpJiYobi5wcm9wcy5zZWxlY3RlZD0hMCl9KSxkZWxldGUgZS52YWx1ZSksZSlpZihyPUQudGVzdCh1KSlicmVhaztpZihyKWZvcih1IGluIG89bi5wcm9wcz17fSxlKW9bRC50ZXN0KHUpP3UucmVwbGFjZSgvW0EtWjAtOV0vLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCk6dV09ZVt1XX0hZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlLHI9bi5wcm9wcztpZihyJiZcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIG89e307Zm9yKHZhciB1IGluIHIpL15vbihBbml8VHJhfFRvdSkvLnRlc3QodSkmJihyW3UudG9Mb3dlckNhc2UoKV09clt1XSxkZWxldGUgclt1XSksb1t1LnRvTG93ZXJDYXNlKCldPXU7aWYoby5vbmRvdWJsZWNsaWNrJiYoci5vbmRibGNsaWNrPXJbby5vbmRvdWJsZWNsaWNrXSxkZWxldGUgcltvLm9uZG91YmxlY2xpY2tdKSxvLm9uYmVmb3JlaW5wdXQmJihyLm9uYmVmb3JlaW5wdXQ9cltvLm9uYmVmb3JlaW5wdXRdLGRlbGV0ZSByW28ub25iZWZvcmVpbnB1dF0pLG8ub25jaGFuZ2UmJihcInRleHRhcmVhXCI9PT1lfHxcImlucHV0XCI9PT1lLnRvTG93ZXJDYXNlKCkmJiEvXmZpbHxjaGV8cmEvaS50ZXN0KHIudHlwZSkpKXt2YXIgaT1vLm9uaW5wdXR8fFwib25pbnB1dFwiO3JbaV18fChyW2ldPXJbby5vbmNoYW5nZV0sZGVsZXRlIHJbby5vbmNoYW5nZV0pfX19KCksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmIXQubSYmdC5wcm90b3R5cGUmJihJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbE1vdW50XCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzXCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsVXBkYXRlXCIpLHQubT0hMCl9cSYmcShuKX07dmFyIEI9XCIxNi44LjBcIjtmdW5jdGlvbiBHKG4pe3JldHVybiBzLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBKKG4pe3JldHVybiEhbiYmbi4kJHR5cGVvZj09PUh9ZnVuY3Rpb24gSyhuKXtyZXR1cm4gSihuKT95LmFwcGx5KG51bGwsYXJndW1lbnRzKTpufWZ1bmN0aW9uIFEobil7cmV0dXJuISFuLl9fayYmKGQobnVsbCxuKSwhMCl9ZnVuY3Rpb24gWChuKXtyZXR1cm4gbiYmKG4uYmFzZXx8MT09PW4ubm9kZVR5cGUmJm4pfHxudWxsfXZhciBZPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4odCl9O2V4cG9ydCBkZWZhdWx0e3VzZVN0YXRlOm4sdXNlUmVkdWNlcjp0LHVzZUVmZmVjdDplLHVzZUxheW91dEVmZmVjdDpyLHVzZVJlZjpvLHVzZUltcGVyYXRpdmVIYW5kbGU6dSx1c2VNZW1vOmksdXNlQ2FsbGJhY2s6Zix1c2VDb250ZXh0OmMsdXNlRGVidWdWYWx1ZTphLHZlcnNpb246XCIxNi44LjBcIixDaGlsZHJlbjpSLHJlbmRlcjpULGh5ZHJhdGU6VCx1bm1vdW50Q29tcG9uZW50QXROb2RlOlEsY3JlYXRlUG9ydGFsOnosY3JlYXRlRWxlbWVudDpzLGNyZWF0ZUNvbnRleHQ6ZyxjcmVhdGVGYWN0b3J5OkcsY2xvbmVFbGVtZW50OkssY3JlYXRlUmVmOmIsRnJhZ21lbnQ6eCxpc1ZhbGlkRWxlbWVudDpKLGZpbmRET01Ob2RlOlgsQ29tcG9uZW50OmwsUHVyZUNvbXBvbmVudDpDLG1lbW86Xyxmb3J3YXJkUmVmOlMsdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXM6WSxTdXNwZW5zZTpVLFN1c3BlbnNlTGlzdDpPLGxhenk6TH07ZXhwb3J0e0IgYXMgdmVyc2lvbixSIGFzIENoaWxkcmVuLFQgYXMgcmVuZGVyLFYgYXMgaHlkcmF0ZSxRIGFzIHVubW91bnRDb21wb25lbnRBdE5vZGUseiBhcyBjcmVhdGVQb3J0YWwsRyBhcyBjcmVhdGVGYWN0b3J5LEsgYXMgY2xvbmVFbGVtZW50LEogYXMgaXNWYWxpZEVsZW1lbnQsWCBhcyBmaW5kRE9NTm9kZSxDIGFzIFB1cmVDb21wb25lbnQsXyBhcyBtZW1vLFMgYXMgZm9yd2FyZFJlZixZIGFzIHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzLFUgYXMgU3VzcGVuc2UsTyBhcyBTdXNwZW5zZUxpc3QsTCBhcyBsYXp5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBhdC5tb2R1bGUuanMubWFwXG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJ1xyXG5leHBvcnQgZnVuY3Rpb24gTmF2SXRlbSAocHJvcHMpe1xyXG5jb25zdCB7Y2hpbGRyZW59PXByb3BzXHJcbnJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1pdGVtXCJ7Li4ucHJvcHN9PntjaGlsZHJlbn08L2Rpdj5cclxufSIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5cclxuXHJcblxyXG4gZnVuY3Rpb24gTGlzdChwcm9wcykge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3RcIiB7Li4ucHJvcHN9Lz5cclxuICApO1xyXG59XHJcblxyXG5cclxuIGZ1bmN0aW9uIExpc3RJdGVtKHByb3BzKSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtaXRlbVwiIHsuLi5wcm9wc30gLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQge0xpc3QsTGlzdEl0ZW19IiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVFBQUFBQVlMbFZBQUFBQkdkQlRVRUFBTEdQQy94aEJRQUFBQ0JqU0ZKTkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFBbUpMUjBRQUFLcU5JeklBQUFBSmNFaFpjd0FBRHNRQUFBN0VBWlVyRGhzQUFBQUhkRWxOUlFma0JCc0lMUzFZZjlKSUFBQURvRWxFUVZSbzNyMlpTMGhVVVJqSGYzTXRpOUJTTTJsUjB0UEpoRWpTVmlFRTFhS05sUlVWSkZFUUZGRWtidTIxSzdHSU5oRkZSQStDbGlVdGF0TkwzSVRSTktFUkJsRUxkVWJIN0tHbWMxdmNyalBqekwzM2ZHZnUrSDJMZ1h2TzkvOTk5NXd6NTNVRFNLMk1PcXBZUXdYRkZGRUEvQ1RHRUQxMEUrWVYvV0pGWmF2bE1pSGltQzRlSjBRYk5YNmo1OVBNUjFmd2RBL1RUS0UvOEJMT015aUMyejdJT1lxemd3ZG9wRjhMYm51VVV4aTYrRlc4eVFwdSsydFc2dUIzTXVRTDNzVGtCL3RrY0lNcnZzRnRiMVB2aW53ZStJNDNNYm5QYkRWOGUwN3dKaVpQdkZNSWNDZG5lQk9UQjE0ZDRYL2ZUL2RXTi95ZW5PTk5UUFk3NFZjU201RUVZcXpJM1B2K1REc3EvcEpBQW12YkVXN0tKZ3UrOHBBZUlNaCtsZ3BqRDNFbjlVRUpBNkozK0VNVGVWUFJlVFR6UnhUZlIxRnFBaGRFNFdOc1QzdW5yY0lVemlRSHp4Y3V1TWN5TnV0eGtVWTBlYi9RTEFydFNCbzVxY080VTZUVGxBZ05pUUozT1E0dDJUd1N0c05xUldHL3lIZE1JSjlmSXExcU1NQjVac3BvSFl3N2xvM1RLZEk2WUNXd1RSVFU2MXI2UmFTMUJRektXQ3NLaXJtV1JrVmE2eWcxcUhNWTAwNDJ4N1YwcmtqTG9NNmdTaFFDUzF4THk0VnFWUVpCWVVpdFMxbEFmQ1lLR2xRSVE4cXBkaXlyOFdpZmRLc3dLQldHd0VuSGtoTmlyVktJaUtZT0U1TUpoNGJleUlSWWF3REd4RUVtbjFtVWhpK2pWME5wVkM4QmsyNHFVL0NWZEd2cGpPcDBnUjI2ZUFvL1Q3Z1hTT29DZzUvaWdXUFpwNlM3a045ODFGUVpNWWhvaFAzbE9wdUlKejNaekUwbU5KUWlpTStCbzl4d09HNnY1cFo0Uk4yRHM0THFjUjZ5elBXTmx2TklsRUFMTkNoWGpsR3YxS3oxREN0cjdvUXlqM3N2Mjc4Skp1MUt2aXRwVGxyejhIdUZxbU11SzBBbTI4QzRnbXFYdFNONnJpRFlScGNvZ2JkY1VhajF6UHFwVVJqNUMwVjRnRVVLLzRqMWR1V3dSOFYyTVI3Z3FZZHFDUGgvWDNIYlE2cERLNEUzSHVWSjFFS1BvMW1EVmdMdXg1UUlCWWtXR09HYXExUk1Ld0gzcUt2V0ttVHZpSXZweWJERzJ6YWlOYy9QY3JtdTdpUEljT3FqdzZJcE5Gcy9tSjVUZ05jemhuK1IrU3d5VTVkVVE1a3ZxUUIyejBnQ3pzZDdvQzNuK0l2dUl6ZkE3WnppNzN2Zm1jL080V1gxWTdYNzhsbmN5Z24rcmhyZTZvaFduK0Z4TGdxdkFkaWgrYTBza3crelZ3YTNiQVV2ZmNHL1lMa08zdXFLUnZxeWdrYzVLbTM2NlZiRUdhSmE4QWd0TE1nT2Jsc0JUWHdRd1VPY3R0WjdQNjJhVnQ0eDZRcWVwSXRMaWIyZVNpOUxyWlE2MWxKSkJTVkpuKzhIcHo3ZkM4K2Evd0MxWkFYczNVaFVIQUFBQUNWMFJWaDBaR0YwWlRwamNtVmhkR1VBTWpBeU1DMHdOQzB5TjFRd09EbzBOVG8wTlNzd01Eb3dNQmF3U1ZRQUFBQWxkRVZZZEdSaGRHVTZiVzlrYVdaNUFESXdNakF0TURRdE1qZFVNRGc2TkRVNk5EVXJNREE2TURCbjdmSG9BQUFBR1hSRldIUlRiMlowZDJGeVpRQjNkM2N1YVc1cmMyTmhjR1V1YjNKbm0rNDhHZ0FBQUFCSlJVNUVya0pnZ2c9PVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlQ2hhbmdlZCh7IHByb3BOYW1lLCB2YWx1ZSB9KSB7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBwcm9wTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd3ZWJjb20nKTtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUyB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkwsXHJcbiAgICB0b2tlbixcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHsgdXNlciwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFLCB1c2VyIH0pO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9saXN0JztcclxuaW1wb3J0IHVzZXJJY29uIGZyb20gJy4vaWNvbnMvdXNlcjY0LnBuZyc7XHJcbmltcG9ydCB7IGxvZ291dCB9IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBncmlkOiB7XHJcbiAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnYXV0byA1JSBhdXRvJyxcclxuICAgIGp1c3RpZnlJdGVtczogJ2NlbnRlcicsXHJcbiAgICBwYWRkaW5nOjE2XHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoRHJhd2VyQ29udGVudCgpIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfSA9IHVzZUFwcFJvdXRlKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCxyb3V0ZTonL2F1dGgnfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nVG9wOiAxMCB9fT5cclxuICAgICAgeyFzdGF0ZS51c2VybmFtZSAmJiA8VW5BdXRoZWRTdGF0ZSBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9IC8+fVxyXG4gICAgICB7c3RhdGUudXNlcm5hbWUgJiYgKFxyXG4gICAgICAgIDxBdXRoZWRTdGF0ZVxyXG4gICAgICAgIG9uQXBwUm91dGU9e29uQXBwUm91dGV9XHJcbiAgICAgICAgICBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9XHJcbiAgICAgICAgICB1c2VyTmFtZT17c3RhdGUudXNlcm5hbWV9XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuICAgICAgPGhyIHN0eWxlPXt7IGhlaWdodDogMSB9fSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUsIHVzZXJOYW1lICxvbkFwcFJvdXRlfSkge1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ091dCgpIHtcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6Jy8nLHJvdXRlOicvaG9tZSd9KTtcclxuICAgIGxvZ291dCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8aW1nIHNyYz17dXNlckljb259IHN0eWxlPXt7IHBhZGRpbmdSaWdodDogNSB9fSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlTG9nT3V0fSBpZD0nbG9nb3V0JyBkYXRhLXRlc3RpZD0nbG9nb3V0Jz5cclxuICAgICAgICAgICAgTG9nb3V0XHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogOCB9fT5XZWxjb21lLCB7dXNlck5hbWV9PC9kaXY+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2NoYW5nZXBhc3N3b3JkJ2RhdGEtdGVzdGlkPSdjaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgICBDaGFuZ2UgUGFzc3dvcmRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5BdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuZ3JpZH0+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdsb2dpbicgZGF0YS10ZXN0aWQ9J2xvZ2luJz5cclxuICAgICAgICAgIExvZ2luXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgIDxkaXY+fDwvZGl2PlxyXG4gICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nc2lnbnVwJyBkYXRhLXRlc3RpZD0nc2lnbnVwJz5cclxuICAgICAgICAgIFNpZ251cFxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VVc2VyTmFtZSgpIHtcclxuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgeyBzdGF0ZSxkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIFxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpIHtcclxuIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwgfSA9IEpTT04ucGFyc2UoXHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxyXG4gICAgICApO1xyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzdGF0ZS50b2tlbikge1xyXG4gIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4gfSA9c3RhdGU7XHJcbiAgICAgIC8vIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgLy8gICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgIC8vICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICB9XHJcbiAgfSwgW3N0YXRlXSk7XHJcblxyXG4gIHJldHVybiB7IHVzZXJOYW1lLCB0b2tlbiwgZW1haWwgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2xpc3QnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dERyYXdlckNvbnRlbnQoKSB7XHJcblxyXG5jb25zdCB7b25BcHBSb3V0ZX0gPXVzZUFwcFJvdXRlKClcclxuXHJcbiAgY29uc3QgeyB1c2VyTmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBpZiAodXNlck5hbWUpIHtcclxuXHJcbiAgICAgIG9uQXBwUm91dGUoe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTonL2hhbmdvdXRzJyxyb3V0ZTonL2hhbmdvdXRzJ30pXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgb25BcHBSb3V0ZSh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlOicvbG9naW4nLHJvdXRlOicvYXV0aCd9KVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBkYXRhLXRlc3RpZD0naGFuZ291dHMnPlxyXG4gICAgICAgICAgSGFuZ291dFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiBcclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFNldHRpbmdzKHByb3BzKSB7XHJcblxyXG4gIGNvbnN0IHsgaGVpZ2h0ID0gMjQsXHJcbiAgICB3aWR0aCA9IDI0LFxyXG4gICAgZmlsbCA9ICdub25lJyxcclxuICAgIGNvbG9yID0gJ2JsYWNrJyxvbkNsaWNrICxpZH09cHJvcHNcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9ICBpZD17aWR9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDBWMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0vPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIGNvbG9yPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2Yy0uMTItLjIyLS4zOS0uMy0uNjEtLjIybC0yLjQ5IDFjLS41Mi0uNC0xLjA4LS43My0xLjY5LS45OGwtLjM4LTIuNjVDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJoLTRjLS4yNSAwLS40Ni4xOC0uNDkuNDJsLS4zOCAyLjY1Yy0uNjEuMjUtMS4xNy41OS0xLjY5Ljk4bC0yLjQ5LTFjLS4yMy0uMDktLjQ5IDAtLjYxLjIybC0yIDMuNDZjLS4xMy4yMi0uMDcuNDkuMTIuNjRsMi4xMSAxLjY1Yy0uMDQuMzItLjA3LjY1LS4wNy45OHMuMDMuNjYuMDcuOThsLTIuMTEgMS42NWMtLjE5LjE1LS4yNC40Mi0uMTIuNjRsMiAzLjQ2Yy4xMi4yMi4zOS4zLjYxLjIybDIuNDktMWMuNTIuNCAxLjA4LjczIDEuNjkuOThsLjM4IDIuNjVjLjAzLjI0LjI0LjQyLjQ5LjQyaDRjLjI1IDAgLjQ2LS4xOC40OS0uNDJsLjM4LTIuNjVjLjYxLS4yNSAxLjE3LS41OSAxLjY5LS45OGwyLjQ5IDFjLjIzLjA5LjQ5IDAgLjYxLS4yMmwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NGwtMi4xMS0xLjY1ek0xMiAxNS41Yy0xLjkzIDAtMy41LTEuNTctMy41LTMuNXMxLjU3LTMuNSAzLjUtMy41IDMuNSAxLjU3IDMuNSAzLjUtMS41NyAzLjUtMy41IDMuNXonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICB3aWR0aDogMTUsXHJcbiAgaGVpZ2h0OiAxNSxcclxuXHJcbiAgYm9yZGVyOiAnd2hpdGUgMnB4IHNvbGlkJyxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xyXG4gIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XHJcbiAgICByZXR1cm4gPElzT25saW5lIC8+O1xyXG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xyXG4gICAgcmV0dXJuIDxDb25uZWN0aW5nIC8+O1xyXG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMikge1xyXG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xyXG4gIH1cclxuICByZXR1cm4gPElzT2ZmbGluZSAvPjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT25saW5lKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBJc09mZmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3JlZCcgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcclxuICAgID48L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ29ubmVjdGluZygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDbG9zaW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdwaW5rJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUGVuZGluZ0hhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb25saW5lLGlzQmxvY2tlciB9KSB7XHJcbmRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHN0YXRlLCBlbWFpbCB9ID0gaGFuZ291dDtcclxuICBsZXQgaGFuZ291dEtleSA9ICcnO1xyXG4gIGxldCBtZXNzYWdlS2V5ID0gJyc7XHJcbiAgaWYgKG9ubGluZSkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tb2ZmbGluZS1tZXNzYWdlc2A7XHJcbiAgfVxyXG5cclxuICBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudGV4dCAhPT1cIlwiKSB7XHJcbiAgICBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIHVzZXJuYW1lLCBtZXNzYWdlLGRpc3BhdGNoLGlzQmxvY2tlciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGhhbmdvdXQpO1xyXG4gICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbaGFuZ291dF07XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuICB9XHJcbiBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSkge1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IFtdO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gXHJcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIG1lc3NhZ2VdO1xyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gW21lc3NhZ2VdO1xyXG4gIH1cclxuICBpZihpc0Jsb2NrZXIpe1xyXG4gXHJcbiAgICBjb25zdCBibG9ja2VyID1bLi4udXBkYXRlZE1lc3NhZ2VzLHt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIHRoaXMgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZC4nXHJcbiAgICAsdGltZXN0YW1wOiBEYXRlLm5vdygpLHR5cGU6J2Jsb2NrZXInLHVzZXJuYW1lOm1lc3NhZ2UudXNlcm5hbWUsZmxvYXQ6J3JpZ2h0J31dXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShibG9ja2VyKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiBibG9ja2VyIH0pO1xyXG4gIFxyXG4gIH1cclxuICBlbHNle1xyXG4gIFxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbiAgfVxyXG4gXHJcblxyXG59XHJcbiIsImltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnLi4vLi4vY2xpZW50Q29tbWFuZHMnO1xyXG5leHBvcnQgZnVuY3Rpb24gc2VuZE9mZmxpbmVIYW5nb3V0cyh7IGRpc3BhdGNoLCBzb2NrZXQsIG5hbWUgfSkge1xyXG4gIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xyXG4gIGlmIChvZmZsaW5lSGFuZ291dHMpIHtcclxuICAgIG9mZmxpbmVIYW5nb3V0cy5mb3JlRWFjaCgoaCkgPT4ge1xyXG4gICAgICBzb2NrZXQuc2VuZChcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB1c2VybmFtZTogaC51c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsOiBoLmVtYWlsLFxyXG4gICAgICAgICAgbWVzc2FnZTogaC5tZXNzYWdlLFxyXG4gICAgICAgICAgdGltZXN0YW1wOiBoLnRpbWVzdGFtcCxcclxuICAgICAgICAgIGNvbW1hbmQ6IGguc3RhdGUsXHJcbiAgICAgICAgICBvZmZsaW5lOiB0cnVlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQoe25hbWUsIGhhbmdvdXQsZGlzcGF0Y2h9KXtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XHJcbiAgICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gICAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gICBcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgIGNvbnN0IGZpbHRlcmVkSGFuZ291dHMgPSB1bnJlYWRoYW5nb3V0cy5maWx0ZXIoZnVuY3Rpb24odW5yZWFkKSAge1xyXG4gICAgICAgICAgICByZXR1cm4gIHVucmVhZC51c2VybmFtZSAhPT0gdXNlcm5hbWV9KTtcclxuICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGZpbHRlcmVkSGFuZ291dHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeShmaWx0ZXJlZEhhbmdvdXRzKSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0czogZmlsdGVyZWRIYW5nb3V0cyxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh1bnJlYWRoYW5nb3V0c0tleSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgIFxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyB1cGRhdGVMb2NhbEhhbmdvdXRzIH0gZnJvbSAnLi91cGRhdGVMb2NhbEhhbmdvdXRzJztcclxuaW1wb3J0IHsgc2F2ZVBlbmRpbmdIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnO1xyXG5pbXBvcnQge1xyXG4gIHNlbGVjdEhhbmdvdXQsXHJcbiAgc2VsZWN0VW5yZWFkLFxyXG4gIHNlYXJjaEhhbmdvdXRzLFxyXG4gIGZpbHRlckhhbmdvdXRzLFxyXG4gIGZldGNoSGFuZ291dCxcclxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcclxuXHJcbiAgc3RhcnRDbGllbnRDb21tYW5kLFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHNlbmRPZmZsaW5lSGFuZ291dHMgfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMnO1xyXG5pbXBvcnQge3JlbW92ZUhhbmdvdXRGcm9tVW5yZWFkfSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQnXHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuICBjb25zdCB7XHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICBzb2NrZXRNZXNzYWdlLFxyXG4gICAgcmVhZHlTdGF0ZSxcclxuICAgIHNvY2tldCxcclxuICAgIHVucmVhZGhhbmdvdXRzLFxyXG4gIH0gPSBzdGF0ZTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzb2NrZXQgJiYgcmVhZHlTdGF0ZSA9PT0gMSAmJiB1c2VybmFtZSkge1xyXG4gICAgICBzZW5kT2ZmbGluZUhhbmdvdXRzKHsgbmFtZTogdXNlcm5hbWUsIGRpc3BhdGNoLCBzb2NrZXQgfSk7XHJcbiAgICB9XHJcbiAgfSwgW3NvY2tldCwgcmVhZHlTdGF0ZSwgdXNlcm5hbWVdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25SZW1vdmVVbnJlYWQoZSl7XHJcbiAgICBjb25zdCBpZCA9ZS5jdXJyZW50VGFyZ2V0LmlkXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gaWQpO1xyXG4gICBkZWJ1Z2dlcjtcclxuICAgIHJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkKHtuYW1lOnVzZXJuYW1lLGRpc3BhdGNoLGhhbmdvdXR9KVxyXG4gIH1cclxuICBmdW5jdGlvbiBvbk5hdmlnYXRpb24oZSl7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgIC8vIGNvbnN0IGlkID1lLnRhcmdldC5pZFxyXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxyXG4gICBkZWJ1Z2dlcjtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtpZH1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xyXG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XHJcbiAgICBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaDogZS50YXJnZXQudmFsdWUsIGRpc3BhdGNoIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TdGFydFNlYXJjaChlKSB7XHJcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xyXG4gICAgY29uc3QgdGV4dCA9IGUudGFyZ2V0LnZhbHVlO1xyXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dCB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25IYW5nb3V0KGUpIHtcclxuICAgZGVidWdnZXI7XHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQ6ICcnLCBkaXNwYXRjaCB9KTtcclxuICAgIGNvbnN0IGNvbW1hbmQgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IGhhbmdvdXQ7XHJcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgbWVzc2FnZSA9XHJcbiAgICAgIG1lc3NhZ2VUZXh0ICE9PSAnJyA/IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCB9IDogbnVsbDtcclxuXHJcbiAgICBjb25zdCBvbmxpbmUgPSB0cnVlO1xyXG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcclxuICAgIGlmIChzb2NrZXQgJiYgcmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICBcclxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xyXG4gICAgICAgXHJcbiAgICAgICAgaXNCbG9ja2VyPXRydWVcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICBcclxuICAgICAgICBzb2NrZXQuc2VuZChcclxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICBjb21tYW5kLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIFxyXG4gICAgICB9XHJcbiAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9ubGluZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XHJcbiAgICAgIGRpc3BhdGNoLFxyXG4gICAgICBuYW1lOiB1c2VybmFtZSxcclxuICAgICAgaGFuZ291dDoge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIHN0YXRlOiBjb21tYW5kLFxyXG4gICAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCwgZGVsaXZlcmVkOiBmYWxzZSwgdXNlcm5hbWUgfSxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgZGVsaXZlcmVkOiBmYWxzZSxcclxuICAgICAgICBcclxuICAgICAgfSxcclxuICAgICAgb25saW5lLFxyXG4gICAgICBpc0Jsb2NrZXJcclxuICAgIH0pO1xyXG5cclxuICAgXHJcblxyXG5cclxuICB9Ly9lbmQgb25IYW5nb3V0XHJcbiAgcmV0dXJuIHtcclxuICAgIG9uTmF2aWdhdGlvbixcclxuICAgIG9uU2VsZWN0VW5yZWFkLFxyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgb25TdGFydFNlYXJjaCxcclxuICAgIG9uU2VhcmNoLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICB1c2VycyxcclxuICAgIHVzZXJuYW1lLFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICBvbkhhbmdvdXQsXHJcbiAgICB1bnJlYWRoYW5nb3V0cyxcclxuICAgIHJlYWR5U3RhdGUsXHJcbiAgICBvblJlbW92ZVVucmVhZFxyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IE5hdkl0ZW0gfSBmcm9tICcuLi8uLi9uYXYvTmF2SXRlbSc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi8uLi9pY29ucy9NZXNzYWdlJztcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuLi8uLi9pY29ucy9TZXR0xLFuZ3MnO1xyXG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi8uLi9pY29ucy9vbmxpbmVTdGF0dXMnO1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4uL3N0YXRlL3VzZUhhbmdvdXRzJztcclxuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tICcuLi8uLi9hdXRoL3VzZVVzZXJOYW1lJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dFRvcE1lbnUoKSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG4gIGNvbnN0IHsgdXNlck5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XHJcbiAgY29uc3QgeyByZWFkeVN0YXRlLCB1bnJlYWRoYW5nb3V0cywgb25OYXZpZ2F0aW9uLCBoYW5nb3V0IH0gPSB1c2VIYW5nb3V0cygpO1xyXG5cclxuICBmdW5jdGlvbiBuYXZUb1VucmVhZCgpIHtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6ICcvVU5SRUFEJywgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XHJcbiAgICAgIDxOYXZJdGVtPnt1c2VyTmFtZX08L05hdkl0ZW0+XHJcbiAgICAgIDxOYXZJdGVtPlxyXG4gICAgICAgIDxPbmxpbmVTdGF0dXMgcmVhZHlTdGF0ZT17cmVhZHlTdGF0ZX0gLz5cclxuICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICA8TmF2SXRlbSBvbkNsaWNrPXtuYXZUb1VucmVhZH0gZGF0YS10ZXN0aWQ9XCJuYXYtdW5yZWFkc1wiPlxyXG4gICAgICAgIHt1bnJlYWRoYW5nb3V0cyAmJiA8TWVzc2FnZSBjb3VudD17dW5yZWFkaGFuZ291dHMuZmlsdGVyKGY9PmYucmVhZD09PWZhbHNlKS5sZW5ndGh9IC8+fXsnICd9XHJcbiAgICAgIDwvTmF2SXRlbT5cclxuICAgICAge2hhbmdvdXQgJiYgKFxyXG4gICAgICAgIDxOYXZJdGVtICAgIG9uQ2xpY2s9e29uTmF2aWdhdGlvbn0gZGF0YS10ZXN0aWQ9XCJuYXYtY29uZmlnXCIgaWQ9XCJjb25maWd1cmVcIiA+XHJcbiAgICAgICAgICA8U2V0dGluZ3NcclxuICAgICAgICAgICAgZmlsbD1cIndoaXRlXCJcclxuICAgICAgICAgICAgd2lkdGg9XCIzMFwiXHJcbiAgICAgICAgICAgIGhlaWdodD1cIjMwXCJcclxuICAgICAgICAgXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuLy9cclxuIiwiZXhwb3J0IGNvbnN0IGRyYXdlciA9IHtcclxuICBib3hTaGFkb3c6IGAwcHggM3B4IDNweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSwwcHggM3B4IDRweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDFweCA4cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xMilgLFxyXG5cclxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICBsZWZ0OiAwLFxyXG4gIHRvcDogMCxcclxuICB6SW5kZXg6IDEwLFxyXG4gIGhlaWdodDogJzEwMHZoJyxcclxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjVmNWY1JyxcclxufTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tICcuL2RldmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKSB7XHJcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW29yaWVudGF0aW9uLCBzZXRPcmllbnRhdGlvbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2RldmljZSwgc2V0RGV2aWNlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XHJcbiAgIFxyXG4gICAgICBzZXRXaWR0aCh3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbiAgICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpIHtcclxuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xyXG4gIH1cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoID4gMCkge1xyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDYwMDpcclxuICAgICAgICAgIHNldERldmljZSgncGhvbmUnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNzY4OlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gOTkyOlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcclxuICAgICAgICAgIHNldERldmljZSgndGFibGV0Jyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2xhcHRvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2Rlc2t0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3dpZHRoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2aWNlJywgZGV2aWNlKTtcclxuICB9LCBbZGV2aWNlXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGhhbmRsZVZpZXdwb3J0U2l6ZSgpO1xyXG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBkcmF3ZXIgfSBmcm9tICcuL3N0eWxlJztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGlvbiB9IGZyb20gJy4vTmF2UHJvdmlkZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmF3ZXIocHJvcHMpIHtcclxuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7IG9wZW4sIG9uQ2xpY2ssIGNoaWxkcmVuIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9ID0gdXNlTmF2aWdhdGlvbigpO1xyXG5cclxuICBpZiAoZHJhd2VyT3BlbilcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17eyAuLi5kcmF3ZXIgfX1cclxuICAgICAgICBjbGFzc05hbWU9e2BkcmF3ZXItJHtkZXZpY2V9LXdpZHRoYH1cclxuICAgICAgICBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9XHJcbiAgICAgID5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwQmFyKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAuLi50aGVtZS5wcmltYXJ5LFxyXG4gICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAvLyBsZWZ0OiAwLFxyXG4gICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgbWluSGVpZ2h0OiA2NCxcclxuICAgICAgIC8vIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgIC8vIHBhZGRpbmdSaWdodDogMTYsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICBkaXNwbGF5OidmbGV4J1xyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCAnLi4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBNZW51V2hpdGUoeyBvbkNsaWNrLCBpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBjbGFzc05hbWU9XCJtZW51LXdoaXRlXCJcclxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgIGZpbGw9XCJ3aGl0ZVwiXHJcbiAgICAgIHdpZHRoPVwiMjRweFwiXHJcbiAgICAgIGhlaWdodD1cIjI0cHhcIlxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPHBhdGggZD1cIk0zIDE4aDE4di0ySDN2MnptMC01aDE4di0ySDN2MnptMC03djJoMThWNkgzelwiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnLi9OYXZQcm92aWRlcic7XHJcbmltcG9ydCB7IE1lbnVXaGl0ZSB9IGZyb20gJy4vaWNvbnMvTWVudVdoaXRlJztcclxuZXhwb3J0IGZ1bmN0aW9uIE1lbnUoKSB7XHJcbiAgY29uc3QgeyBkcmF3ZXJPcGVuLCB0b2dnbGVEcmF3ZXIgfSA9IHVzZU5hdmlnYXRpb24oKTtcclxuXHJcbiAgcmV0dXJuIDxNZW51V2hpdGUgb25DbGljaz17dG9nZ2xlRHJhd2VyfSBpZD1cIm1lbnVcIiAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgTmF2SXRlbSB9IGZyb20gJy4uL25hdi9OYXZJdGVtJztcclxuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEF1dGhEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vYXV0aC9BdXRoRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEhhbmdvdXREcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vaGFuZ291dHMvbmF2L0hhbmdvdXREcmF3ZXJDb250ZW50JztcclxuaW1wb3J0IHsgSGFuZ291dFRvcE1lbnUgfSBmcm9tICcuLi9oYW5nb3V0cy9uYXYvSGFuZ291dFRvcE1lbnUnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgcmVjb3ZlckxvY2FsQXV0aFN0YXRlIH0gZnJvbSAnLi4vYXV0aC9hY3Rpb25zJztcclxuaW1wb3J0IERyYXdlciBmcm9tICcuLi9uYXYvRHJhd2VyJztcclxuaW1wb3J0IHsgQXBwQmFyIH0gZnJvbSAnLi4vbmF2L0FwcEJhcic7XHJcbmltcG9ydCB7IE1lbnUgfSBmcm9tICcuLi9uYXYvTWVudSc7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBOYXZpZ2F0aW9uKCkge1xyXG4gICAgY29uc3QgeyBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcbiAgICAgICAgICByZWNvdmVyTG9jYWxBdXRoU3RhdGUoe1xyXG4gICAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgICAgdXNlcjogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxBcHBCYXI+XHJcbiAgICAgICAgPE1lbnUgLz5cclxuICAgICAgICA8TmF2SXRlbSBzdHlsZT17eyBmbGV4OiA1IH19PldFQiBDT008L05hdkl0ZW0+XHJcbiAgICAgICAgPEhhbmdvdXRUb3BNZW51IC8+XHJcbiAgICAgIDwvQXBwQmFyPlxyXG4gICAgICA8RHJhd2VyPlxyXG4gICAgICAgIDxBdXRoRHJhd2VyQ29udGVudCAvPlxyXG4gICAgICAgIDxIYW5nb3V0RHJhd2VyQ29udGVudCAvPlxyXG4gICAgICA8L0RyYXdlcj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSG9tZSgpIHtcclxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD0naG9tZScgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+SG9tZTwvZGl2PjtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTogJ0lOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIFJFU0VUX1ZBTElEQVRJT05fU1RBVEU6ICdSRVNFVF9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIElOUFVUX0JMVVJSRUQ6ICdJTlBVVF9CTFVSUkVEJyxcclxuICAgIElOUFVUX0ZPQ1VTRUQ6ICdJTlBVVF9GT0NVU0VEJyxcclxuICBcclxuICAgIFNFUlZFUl9WQUxJREFUSU9OOiAnU0VSVkVSX1ZBTElEQVRJT04nLFxyXG4gICAgQ0xJRU5UX1ZBTElEQVRJT046J0NMSUVOVF9WQUxJREFUSU9OJyxcclxuICBcclxuICAgIElOQ19JTlBVVF9DT1VUTiA6J0lOQ19JTlBVVF9DT1VUTidcclxuICB9O1xyXG4gICIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxJRDogJ1ZBTElEJyxcclxuICBJTlZBTElEOiAnSU5WQUxJRCcsXHJcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRSdcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0geyB2YWxpZGF0aW9uOiB7fSB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuXHJcbiAgbGV0IG5leHRTdGF0ZSA9IG51bGw7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5kZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG5cclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5QVVRfRk9DVVNFRDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICBbYWN0aW9uLnByb3BOYW1lXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE46XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2Zvcm1SZWR1Y2VyJztcclxuY29uc3QgRm9ybUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9ybUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRm9ybUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VGb3JtQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBGb3JtUHJvdmlkZXInKTtcclxuICB9XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4geyBzdGF0ZSwgZGlzcGF0Y2ggfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1Qcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihmb3JtUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8Rm9ybUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2NvbnN0cmFpbnRcclxuICBFTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjogJ1BBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBFTVBUWV9TVFJJTkdfVkFMSURBVElPTjogJ0VNUFRZX1NUUklOR19WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjogJ1BBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OJyxcclxuICAvL2F1dGhcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnSU5WQUxJRF9DUkVERU5USUFMUycsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICdVU0VSTkFNRV9UQUtFTicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ1JFR0lTVEVSRURfRU1BSUwnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnRU1BSUxfTk9UX1JFR0lTVEVSRUQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOidVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCcsXHJcbiAgQUNDT1VOVF9BTFJFQURZX0VYSVNUUzonQUNDT1VOVF9BTFJFQURZX0VYSVNUUydcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIElOVkFMSURfUEFTU1dPUkQ6XHJcbiAgICAnYXQgbGVhc3QgOCBjaGFyYWN0ZXJzLCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMSB1cHBlcmNhc2UgbGV0dGVyLCAxIGxvd2VyY2FzZSBsZXR0ZXIsIENhbiBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycycsXHJcbiAgSU5WQUxJRF9FTUFJTDogJ2VtYWlsIGZvcm1hdCBpcyBub3QgdmFsaWQnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnZW1haWwgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOiAndXNlcm5hbWUgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUU6XHJcbiAgICAnb25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWQnLFxyXG4gIElOVkFMSURfRU1QVFlfU1RSSU5HOiAnZW1wdHkgc3RyaW5nIGlzIG5vdCBhbGxvd2VkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMOiAnZW1haWwgb3IgdXNlcm5hbWUgaXMgbm90IHZhbGlkJyxcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICd1c2VybmFtZSBpcyBhbHJlYWR5IHRha2VuJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnZW1haWwgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyxcclxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcsXHJcbiAgXHJcbiAgQUNDT1VOVF9BTFJFQURZX0VYSVNUUzonQWNjb3VudCBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyB1c2VybmFtZS4nXHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBwYXNzd29yZFJlZ2V4ID0gL14oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbYS16QS1aXSkuezgsfSQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcclxuIiwiaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNDbGllbnRWYWxpZGF0aW9uVHlwZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIHtcclxuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xyXG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG4gIGlmICghcGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHVzZXJuYW1lKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWUgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KSB7XHJcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pIHtcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID1hdXRoO1xyXG5kZWJ1Z2dlcjtcclxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBhY2NvdW50QWxyZWFkeUV4aXRzOjIwMixcclxuICAvL2xvZ2luXHJcbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxyXG4gIC8vc2lnbnVwXHJcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcclxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXHJcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcclxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxyXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXHJcbiAgLy9sb2dpblxyXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcclxuICBlbXB0eVN0cmluZ05vdFZhbGlkOiAnNDA5JyxcclxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcclxuICB1c2VybmFtZUlzTm90UmVnaXN0ZXJlZDonNDExJyxcclxuLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXHJcbiAgdG9rZW5FeHBpcmVkOic0MTMnLFxyXG4gIHNlcnZlclZhbGlkYXRpb25SYW5nZTogc3RhdHVzID0+IHtcclxuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG4iLCJcclxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbnMgZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBjb25zdFZhbFR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZSwgdmFsdWUsIHN0YXRlLGF1dGggfSkge1xyXG5cclxuICBsZXQgdmFsaWRhdGlvbiA9IG51bGw7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoe1xyXG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe1xyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICBcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTiwgLi4udmFsaWRhdGlvbiB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdEZvcm1WYWxpZGF0aW9uU3RhdGUoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURSwgdmFsaWRhdGlvblR5cGUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluY0lucHV0Q291bnQoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROIH07XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAgfSkge1xyXG5kZWJ1Z2dlclxyXG4gIHN3aXRjaCAoc3RhdHVzKSB7XHJcbiAgICBjYXNlIDEwMTpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5jcmVkZW50aWFsSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIDEyNTpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSAyMDM6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIDIwMjpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzVGFrZW46XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlTdHJpbmdOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSAyMDA6XHJcbiAgICAgIFxyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQge3NlcnZlclZhbGlkYXRpb259IGZyb20gJy4uLy4uL2Zvcm0vYWN0aW9ucydcclxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25VcCh7ZGlzcGF0Y2gsc3RhdGUsZm9ybURpc3BhdGNofSkge1xyXG4gICAgY29uc3Qge3VzZXJuYW1lLHBhc3N3b3JkLGVtYWlsfT1zdGF0ZVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUR9KVxyXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSB1c2VyIGNsYXNzXHJcbiAgICB2YXIgdXNlciA9IG5ldyBQYXJzZS5Vc2VyKCk7XHJcbiAgICB1c2VyLnNldChcInVzZXJuYW1lXCIsIHVzZXJuYW1lKTtcclxuICAgIHVzZXIuc2V0KFwicGFzc3dvcmRcIiwgcGFzc3dvcmQpO1xyXG4gICAgdXNlci5zZXQoXCJlbWFpbFwiLCBlbWFpbCk7XHJcbiAgZGVidWdnZXI7XHJcbiAgICAvLyBvdGhlciBmaWVsZHMgY2FuIGJlIHNldCBqdXN0IGxpa2Ugd2l0aCBQYXJzZS5PYmplY3RcclxuICAgIHVzZXIuc2lnblVwKCkudGhlbihmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgbGV0IHVzZXJuYW1lID0gdXNlci5nZXQoXCJ1c2VybmFtZVwiKVxyXG4gICAgICAgIGxldCBlbWFpbCA9dXNlci5nZXQoXCJlbWFpbFwiKVxyXG4gICAgICAgIGxldCB0b2tlbiA9dXNlci5nZXQoJ3Nlc3Npb25Ub2tlbicpIFxyXG4gICAgICAgIGNvbnN0IHVzID11c2VyO1xyXG4gICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsdXNlcm5hbWUsZW1haWwsdG9rZW59KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdVc2VyIGNyZWF0ZWQgc3VjY2Vzc2Z1bCB3aXRoIG5hbWU6ICcgKyB1c2VyLmdldChcInVzZXJuYW1lXCIpICsgJyBhbmQgZW1haWw6ICcgKyB1c2VyLmdldChcImVtYWlsXCIpLCt1c2VyLmdldCgnc2Vzc2lvblRva2VuJykpO1xyXG5cclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICBjb25zdCBlcnIgPWVycm9yXHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvci5jb2RlfSkpXHJcbiAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luKHtkaXNwYXRjaCxzdGF0ZSxmb3JtRGlzcGF0Y2h9KSB7XHJcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmR9PSBzdGF0ZVxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRH0pXHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIC8vIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgdXNlciBjbGFzc1xyXG4gICAgdmFyIHVzZXIgPSAgUGFyc2UuVXNlci5sb2dJbihlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICBsZXQgdXNlcm5hbWUgPSB1c2VyLmdldChcInVzZXJuYW1lXCIpXHJcbiAgICAgICAgbGV0IGVtYWlsID11c2VyLmdldChcImVtYWlsXCIpXHJcbiAgICAgICAgbGV0IHRva2VuID11c2VyLmdldCgnc2Vzc2lvblRva2VuJykgXHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUyx1c2VybmFtZSxlbWFpbCx0b2tlbn0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVc2VyIGNyZWF0ZWQgc3VjY2Vzc2Z1bCB3aXRoIG5hbWU6ICcgKyB1c2VyLmdldChcInVzZXJuYW1lXCIpICsgJyBhbmQgZW1haWw6ICcgKyB1c2VyLmdldChcImVtYWlsXCIpKTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICBjb25zdCBlcnIgPWVycm9yXHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvci5jb2RlfSkpXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlcnJvci5jb2RlICsgXCIgXCIgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0UGFzc3dvcmQoKSB7XHJcbiAgICBQYXJzZS5Vc2VyLnJlcXVlc3RQYXNzd29yZFJlc2V0KFwiZW1haWxAZXhhbXBsZS5jb21cIikudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJQYXNzd29yZCByZXNldCByZXF1ZXN0IHdhcyBzZW50IHN1Y2Nlc3NmdWxseVwiKTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGxvZ2luIGZhaWxlZCB3aXRoIGVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbn0iLCJpbXBvcnQge3VzZUF1dGhDb250ZXh0fSBmcm9tICcuLi9hdXRoLWNvbnRleHQnXHJcbmltcG9ydCB7dXNlRm9ybUNvbnRleHR9IGZyb20gJy4uLy4uL2Zvcm0vZm9ybS1jb250ZXh0J1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucydcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcDRiYWNrQXV0aCgpe1xyXG5jb25zdCB7c3RhdGUsZGlzcGF0Y2h9PSB1c2VBdXRoQ29udGV4dCgpXHJcbmNvbnN0IHtkaXNwYXRjaDpmb3JtRGlzcGF0Y2h9PSB1c2VGb3JtQ29udGV4dCgpXHJcbiAgICBmdW5jdGlvbiBzaWdudXAoKXtcclxuICAgICAgICBhY3Rpb25zLnNpZ25VcCh7c3RhdGUsZGlzcGF0Y2gsZm9ybURpc3BhdGNofSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGxvZ2luICgpe1xyXG4gICAgICAgIGFjdGlvbnMubG9naW4oe3N0YXRlLGRpc3BhdGNoLGZvcm1EaXNwYXRjaH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VwYXNzd29yZCgpe31cclxuICAgIGZ1bmN0aW9uIGZvcmdvdHBhc3N3b3JkKCl7fVxyXG5cclxuICAgIHJldHVybiB7c2lnbnVwLGxvZ2luLGNoYW5nZXBhc3N3b3JkLGZvcmdvdHBhc3N3b3JkfVxyXG5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5cclxuaW1wb3J0IHtGZWF0dXJlUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQge3VzZUFwcDRiYWNrQXV0aH0gZnJvbSAnLi9hcHA0YmFjay91c2VBcHA0YmFja0F1dGgnXHJcbmNvbnN0IExvZ2luID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vTG9naW4nKSk7XHJcbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vQ2hhbmdlUGFzc3dvcmQnKSk7XHJcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vRm9yZ290UGFzc3dvcmQnKSk7XHJcbmNvbnN0IFNpZ251cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1NpZ251cCcpKTtcclxuY29uc3QgUHJvZmlsZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1Byb2ZpbGUnKSk7XHJcbmNvbnN0IEF1dGhGZWVkYmFjayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0F1dGhGZWVkYmFjaycpKTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwNGJhY2tBdXRoZW50aWNhdGlvbih7IGNoaWxkcmVuIH0pIHtcclxuICBjb25zdCB7c2lnbnVwLGxvZ2luLGNoYW5nZVBhc3N3b3JkLGZvcmdvdFBhc3N3b3JkfT11c2VBcHA0YmFja0F1dGgoKVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9jaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPENoYW5nZVBhc3N3b3JkIGNoYW5nZVBhc3N3b3JkPXtjaGFuZ2VQYXNzd29yZH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvbG9naW4nPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxMb2dpbiBsb2dpbj17bG9naW59Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3NpZ251cCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFNpZ251cCBzaWdudXA9e3NpZ251cH0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvZm9yZ290cGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAgZm9yZ290UGFzc3dvcmQ9e2ZvcmdvdFBhc3N3b3JkfS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9wcm9maWxlJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8UHJvZmlsZSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9hdXRoZmVlZGJhY2snPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxBdXRoRmVlZGJhY2sgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnLi9Ib21lJztcclxuaW1wb3J0IE5vZGVBdXRoZW50aWNhdGlvbiBmcm9tICcuLi9hdXRoL0FwcDRiYWNrQXV0aGVudGljYXRpb24nO1xyXG5pbXBvcnQgeyBGb3JtUHJvdmlkZXIgfSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCc7XHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2hhbmdvdXRzJykpO1xyXG5jb25zdCBHcm91cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9ncm91cC9ncm91cCcpKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZXMoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMTAwJScgfX0+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2F1dGhcIj5cclxuICAgICAgICA8Rm9ybVByb3ZpZGVyPlxyXG4gICAgICAgICAgPE5vZGVBdXRoZW50aWNhdGlvbiAvPlxyXG4gICAgICAgIDwvRm9ybVByb3ZpZGVyPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9cIj5cclxuICAgICAgICA8SG9tZSAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SGFuZ291dHMgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9ncm91cFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxHcm91cCAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5cclxuaW1wb3J0IHtBcHBOYXZpZ2F0aW9ufSBmcm9tICcuL0FwcE5hdmlnYXRpb24nXHJcbmltcG9ydCB7QXBwUm91dGVzfSBmcm9tICcuL0FwcFJvdXRlcydcclxuaW1wb3J0ICcuL2Nzcy9hcHAuY3NzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnOTV2aCcgfX0+XHJcbiAgICAgPEFwcE5hdmlnYXRpb24vPlxyXG4gICAgICA8QXBwUm91dGVzLz5cclxuICAgICAgeycnfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgQXBwUm91dGVQcm92aWRlciB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcclxuaW1wb3J0IHsgSGFuZ291dHNQcm92aWRlciB9IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuaW1wb3J0IHsgTmF2UHJvdmlkZXIgfSBmcm9tICcuLi9uYXYvTmF2UHJvdmlkZXInO1xyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL0FwcCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxUaGVtZVByb3ZpZGVyXHJcbiAgICAgIGluaXRTdGF0ZT17e1xyXG4gICAgICAgIHByaW1hcnk6IHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcclxuICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBIZWx2ZXRpY2EsIFwiQXJpYWxcIicsXHJcbiAgICAgICAgfSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPEFwcFJvdXRlUHJvdmlkZXJcclxuICAgICAgICB0aXRsZT1cIldlYmNvbVwiXHJcbiAgICAgICAgaW5pdFN0YXRlPXt7IHJvdXRlOiAnLycsIGZlYXR1cmVSb3V0ZTogJy9oYW5nb3V0cycgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgICAgICA8TmF2UHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDxIYW5nb3V0c1Byb3ZpZGVyIHNvY2tldFVybD17YHdzczovLyR7aXB9OjMwMDAvaGFuZ291dHNgfT5cclxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuICAgICAgICAgIDwvTmF2UHJvdmlkZXI+XHJcbiAgICAgICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgICAgIDwvQXBwUm91dGVQcm92aWRlcj5cclxuICAgIDwvVGhlbWVQcm92aWRlcj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCAnd2hhdHdnLWZldGNoJztcclxuaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgQXBwUHJvdmlkZXJzIH0gZnJvbSAnLi9BcHBQcm92aWRlcnMnO1xyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL0FwcCc7XHJcblBhcnNlLmluaXRpYWxpemUoXCJ6dHRwbnFUcjhyZWZrdEJXTmVrWmhaeFN4d1BhQUFuRWxROWs3Q3VBXCIsXCJRN1NIU0ZMRzYxOGl6YnlTTXBBc0ZBcWduT0xhWWd4Tmx3ZkZoT0FyXCIpOyAvL1BBU1RFIEhFUkUgWU9VUiBCYWNrNEFwcCBBUFBMSUNBVElPTiBJRCBBTkQgWU9VUiBKYXZhU2NyaXB0IEtFWVxyXG5QYXJzZS5zZXJ2ZXJVUkwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L3BhcnNlJ1xyXG5yZW5kZXIoXHJcbiAgPEFwcFByb3ZpZGVycz5cclxuICAgIDxBcHAgLz5cclxuICA8L0FwcFByb3ZpZGVycz4sXHJcblxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbImZldGNoIiwidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwiRkVBVFVSRV9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJGZWF0dXJlUm91dGUiLCJwcm9wcyIsImNoaWxkcmVuIiwicGF0aCIsInBhdGhzIiwiZGlzcGF0Y2giLCJmaW5kIiwidXNlQXBwUm91dGUiLCJvbkFwcFJvdXRlIiwiQXBwUm91dGUiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInZhbHVlIiwidXNlTWVtbyIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURFRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiQ0xFQVJFRF9IQU5HT1VUIiwiRkVUQ0hfSEFOR09VVF9TVEFSVEVEIiwiRkVUQ0hfSEFOR09VVF9TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVF9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIlNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEIiwiTUVTU0FHRVNfVVBEQVRFRCIsIkhBTkdPVVRTX1VQREFURUQiLCJIQU5HT1VUX1VQREFURUQiLCJVTlJFQURfSEFOR09VVFNfVVBEQVRFRCIsIkNPTk5FQ1RJTkciLCJPUEVOIiwiQ0xPU0lORyIsIkNMT1NFRCIsIlNPQ0tFVF9SRUFEWSIsIlNPQ0tFVF9FUlJPUiIsImhhbmdvdXRzIiwiaGFuZ291dCIsInVucmVhZGhhbmdvdXRzIiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJzb2NrZXQiLCJyZWFkeVN0YXRlIiwic29ja2V0TWVzc2FnZSIsInRleHQiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIkZJTFRFUl9IQU5HT1VUUyIsImZpbHRlciIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJsb2FkSGFuZ291dHMiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2VsZWN0SGFuZ291dCIsInJlc2V0SGFuZ291dCIsInNlbGVjdFVucmVhZCIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsIm9rIiwianNvbiIsImNoYW5nZU1lc3NhZ2VUZXh0IiwibG9hZE1lc3NhZ2VzIiwia2V5IiwidXBkYXRlUmVhZEhhbmdvdXRzIiwibmFtZSIsIm1lc3NhZ2UiLCJ1bnJlYWRoYW5nb3V0c0tleSIsImxlbmd0aCIsInVwZGF0ZWR1bnJlYWQiLCJtYXAiLCJyZWFkIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImhhbmdvdXRLZXkiLCJoYW5nb3V0SW5kZXgiLCJmaW5kSW5kZXgiLCJzcGxpY2UiLCJ1cGRhdGVSZWFkTWVzc3NhZ2VzIiwibWVzc2FnZUtleSIsInVwZGF0ZWRNZXNzYWdlcyIsImhhbmdvdXRTdGF0ZXMiLCJJTlZJVEVSIiwiQUNDRVBURVIiLCJERUNMSU5FUiIsIkJMT0NLRVIiLCJVTkJMT0NLRVIiLCJNRVNTQU5HRVIiLCJJTlZJVEVEIiwiQUNDRVBURUQiLCJERUNMSU5FRCIsIkJMT0NLRUQiLCJVTkJMT0NLRUQiLCJNRVNTQUdFRCIsInVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQiLCJvZmZsaW5lIiwidGltZXN0YW1wIiwiZGVsaXZlcmVkSGFuZ291dCIsImRlbGl2ZXJlZCIsInVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UiLCJ1cGRhdGVCb2NrZWRTdGF0ZSIsIm9mZmxpbmVIYW5nb3V0S2V5Iiwib2ZmbGluZWhhbmdvdXRzIiwiZGVsaXZlcmVkTWVzc2FnZSIsImJsb2NrZWRNZXNzYWdlIiwic2F2ZU1lc3NhZ2VkIiwic2F2ZUludml0ZWQiLCJzYXZlQWNjZXB0ZWQiLCJzYXZlRGVjbGluZWQiLCJzYXZlQmxvY2tlZCIsInNhdmVVbmJsb3ZrZWQiLCJzYXZlUmVjaWV2ZWRIYW5nb3V0IiwiZm9jdXNlZEhhbmdvdXQiLCJ1bnJlYWQiLCJoYW5nb3V0RXhpc3QiLCJoZyIsInVwZGF0ZWRIYW5nb3V0cyIsInNhdmVSZWNpZXZlZE1lc3NhZ2UiLCJzYXZlVW5yZWFkSGFuZ291dCIsInVwZGF0ZWR1bnJlYWRzIiwic2F2ZUludml0ZXIiLCJzYXZlQWNjZXB0ZXIiLCJzYXZlQmxvY2tlciIsInNhdmVEZWNsaW5lciIsInNhdmVNZXNzYW5nZXIiLCJzYXZlVW5ibG9ja2VyIiwidXNlU29ja2V0TWVzc2FnZSIsImhhbmRsZUFja25vd2xlZGdlbWVudCIsImhhbmRsZUhhbmdvdXQiLCJoYW5kbGVIYW5nb3V0cyIsImZvckVhY2giLCJ1c2VFZmZlY3QiLCJWQUxVRV9DSEFOR0VEIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJMT0dJTl9GQUlMRUQiLCJMT0dPVVRfU1RBUlRFRCIsIkxPR09VVF9GQUlMRUQiLCJMT0dPVVRfU1VDQ0VTUyIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSIsImVtYWlsIiwicGFzc3dvcmQiLCJzdWNjZXNzIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImlzTG9nZ2VkSW4iLCJpc1Bhc3N3b3JkQ2hhbmdlZCIsImF1dGhGZWVkYmFjayIsImF1dGhSZWR1Y2VyIiwibmV4dFN0YXRlIiwicGF5bG9hZCIsInByb3BOYW1lIiwic3VjY2Vzc01lc3NhZ2UiLCJBdXRoUm91dGVDb250ZXh0IiwiQXV0aFJvdXRlUHJvdmlkZXIiLCJpbml0aWFsUm91dGUiLCJhdXRoUm91dGUiLCJzZXRBdXRoUm91dGUiLCJ1c2VTdGF0ZSIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJ1c2VXZWJTb2NrZXQiLCJzb2NrZXRVcmwiLCJzb2NrIiwiV2ViU29ja2V0Iiwib25tZXNzYWdlIiwibXNnIiwiZGF0YSIsIm9ub3BlbiIsIm9uY2xvc2UiLCJvbmVycm9yIiwiSGFuZ291dENvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsIkhhbmdvdXRzUHJvdmlkZXIiLCJhdXRoQ29udGV4dCIsIndlYnNvY2tldEhhbmRsZXIiLCJoYW5kbGVVc2VTb2NrZXRNZXNzYWdlIiwidXBkYXRlZCIsIlRoZW1lQ29udGV4dCIsInVzZVRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJzZXRTdGF0ZSIsIk5hdkNvbnRleHQiLCJ1c2VOYXZDb250ZXh0IiwidXNlTmF2aWdhdGlvbiIsImRyYXdlck9wZW4iLCJzZXREcmF3ZXJPcGVuIiwidG9nZ2xlRHJhd2VyIiwicHJldiIsIk5hdlByb3ZpZGVyIiwiRSIsInciLCJDIiwibCIsIkEiLCJGIiwiTiIsIk0iLCJQIiwiaCIsIkQiLCJIIiwiJCIsInEiLCJOYXZJdGVtIiwiTGlzdCIsIkxpc3RJdGVtIiwidmFsdWVDaGFuZ2VkIiwibG9nb3V0Iiwid2luZG93IiwicmVtb3ZlSXRlbSIsImdldFRva2VuRnJvbVVybCIsInJlY292ZXJMb2NhbEF1dGhTdGF0ZSIsInN0eWxlIiwiZ3JpZCIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwianVzdGlmeUl0ZW1zIiwicGFkZGluZyIsIkF1dGhEcmF3ZXJDb250ZW50IiwiaGFuZGxlUm91dGUiLCJwcmV2ZW50RGVmYXVsdCIsImlkIiwidGFyZ2V0IiwicGFkZGluZ1RvcCIsImhlaWdodCIsIkF1dGhlZFN0YXRlIiwidXNlck5hbWUiLCJoYW5kbGVMb2dPdXQiLCJhbGlnbkl0ZW1zIiwiZmxleERpcmVjdGlvbiIsInVzZXJJY29uIiwicGFkZGluZ1JpZ2h0IiwibWFyZ2luQm90dG9tIiwiVW5BdXRoZWRTdGF0ZSIsInVzZVVzZXJOYW1lIiwic2V0VXNlcm5hbWUiLCJzZXRUb2tlbiIsInNldEVtYWlsIiwiSGFuZ291dERyYXdlckNvbnRlbnQiLCJjb3VudCIsIndpZHRoIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJqdXN0aWZ5Q29udGVudCIsIk1lc3NhZ2UiLCJTZXR0aW5ncyIsImZpbGwiLCJvbkNsaWNrIiwiYm9yZGVyIiwiT25saW5lU3RhdHVzIiwiSXNPbmxpbmUiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsInNhdmVQZW5kaW5nSGFuZ291dCIsImlzQmxvY2tlciIsInNhdmVIYW5nb3V0Iiwic2F2ZU1lc3NhZ2UiLCJibG9ja2VyIiwiRGF0ZSIsIm5vdyIsImZsb2F0Iiwic2VuZE9mZmxpbmVIYW5nb3V0cyIsIm9mZmxpbmVIYW5nb3V0cyIsImZvcmVFYWNoIiwic2VuZCIsImNvbW1hbmQiLCJyZW1vdmVIYW5nb3V0RnJvbVVucmVhZCIsImZpbHRlcmVkSGFuZ291dHMiLCJ1c2VIYW5nb3V0cyIsInVzZXJzIiwib25SZW1vdmVVbnJlYWQiLCJjdXJyZW50VGFyZ2V0Iiwib25OYXZpZ2F0aW9uIiwic3RvcFByb3BhZ2F0aW9uIiwib25TZWxlY3RIYW5nb3V0Iiwib25TZWxlY3RVbnJlYWQiLCJvblNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJvbk1lc3NhZ2VUZXh0Iiwib25IYW5nb3V0IiwiSGFuZ291dFRvcE1lbnUiLCJuYXZUb1VucmVhZCIsImRyYXdlciIsImJveFNoYWRvdyIsInBvc2l0aW9uIiwibGVmdCIsInRvcCIsInpJbmRleCIsInVzZU1lZGlhUXVlcnkiLCJzZXRXaWR0aCIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJkZXZpY2UiLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsImNvbnNvbGUiLCJsb2ciLCJhZGRFdmVudExpc3RlbmVyIiwiRHJhd2VyIiwib3BlbiIsIkFwcEJhciIsInRoZW1lIiwicHJpbWFyeSIsIm1pbkhlaWdodCIsIk1lbnVXaGl0ZSIsIk1lbnUiLCJBcHBOYXZpZ2F0aW9uIiwiZmxleCIsIkhvbWUiLCJJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSIsIlJFU0VUX1ZBTElEQVRJT05fU1RBVEUiLCJJTlBVVF9CTFVSUkVEIiwiSU5QVVRfRk9DVVNFRCIsIlNFUlZFUl9WQUxJREFUSU9OIiwiQ0xJRU5UX1ZBTElEQVRJT04iLCJJTkNfSU5QVVRfQ09VVE4iLCJWQUxJRCIsIklOVkFMSUQiLCJJTkFDVElWRSIsInZhbGlkYXRpb24iLCJmb3JtUmVkdWNlciIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblN0YXRlIiwiZm9ybVN0YXRlIiwiRm9ybUNvbnRleHQiLCJ1c2VGb3JtQ29udGV4dCIsIkZvcm1Qcm92aWRlciIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiQUNDT1VOVF9BTFJFQURZX0VYSVNUUyIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0aW9uVHlwZXMiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJpc0NsaWVudFZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsaWRhdGVFbXB0eVN0cmluZyIsInZhbGlkYXRlUGFzc3dvcmRNYXRjaCIsImF1dGgiLCJhY2NvdW50QWxyZWFkeUV4aXRzIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwiY29uc3RWYWxUeXBlcyIsInZhbGlkYXRpb25zIiwicmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSIsInNlcnZlclZhbGlkYXRpb24iLCJodHRwU3RhdHVzIiwidmFsaWRhdGlvblN0YXRlcyIsInNpZ25VcCIsImZvcm1EaXNwYXRjaCIsIlBhcnNlIiwiVXNlciIsInNldCIsInRoZW4iLCJnZXQiLCJjYXRjaCIsImNvZGUiLCJsb2dpbiIsImxvZ0luIiwidXNlQXBwNGJhY2tBdXRoIiwic2lnbnVwIiwiYWN0aW9ucyIsImNoYW5nZXBhc3N3b3JkIiwiZm9yZ290cGFzc3dvcmQiLCJMb2dpbiIsImxhenkiLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwiUHJvZmlsZSIsIkF1dGhGZWVkYmFjayIsIkFwcDRiYWNrQXV0aGVudGljYXRpb24iLCJjaGFuZ2VQYXNzd29yZCIsImZvcmdvdFBhc3N3b3JkIiwiU3VzcGVuc2UiLCJIYW5nb3V0cyIsIkdyb3VwIiwiQXBwUm91dGVzIiwiTm9kZUF1dGhlbnRpY2F0aW9uIiwiQXBwIiwiQXBwUHJvdmlkZXJzIiwiYmFja2dyb3VuZCIsImZvbnRGYW1pbHkiLCJpcCIsImluaXRpYWxpemUiLCJzZXJ2ZXJVUkwiLCJyZW5kZXIiLCJkb2N1bWVudCIsImJvZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLElBQUksSUFBSTtBQUN6QyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQ3BELEVBQUUsSUFBSTtBQUNOLElBQUksWUFBWSxJQUFJLElBQUk7QUFDeEIsSUFBSSxNQUFNLElBQUksSUFBSTtBQUNsQixJQUFJLENBQUMsV0FBVztBQUNoQixNQUFNLElBQUk7QUFDVixRQUFRLElBQUksSUFBSSxHQUFFO0FBQ2xCLFFBQVEsT0FBTyxJQUFJO0FBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNsQixRQUFRLE9BQU8sS0FBSztBQUNwQixPQUFPO0FBQ1AsS0FBSyxHQUFHO0FBQ1IsRUFBRSxRQUFRLEVBQUUsVUFBVSxJQUFJLElBQUk7QUFDOUIsRUFBRSxXQUFXLEVBQUUsYUFBYSxJQUFJLElBQUk7QUFDcEMsRUFBQztBQUNEO0FBQ0EsU0FBUyxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQ3pCLEVBQUUsT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO0FBQ3JELENBQUM7QUFDRDtBQUNBLElBQUksT0FBTyxDQUFD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S0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDMUMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVM7QUFDNUIsTUFBTSxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUk7QUFDM0IsS0FBSztBQUNMLEdBQUcsTUFBTTtBQUNULElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksY0FBYTtBQUM3RSxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUM7QUFDL0MsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBQztBQUN2RSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUk7QUFDL0MsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU07QUFDN0MsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUk7QUFDdEI7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDakUsSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLDJDQUEyQyxDQUFDO0FBQ3BFLEdBQUc7QUFDSCxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFDO0FBQ3RCLENBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFT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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1L1IsSUFBSUMsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXlFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUF1RyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFB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LElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSUMsR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPRCxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRUEsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0UsQ0FBQyxDQUFDLENBQW9ULElBQUlDLEdBQUMsQ0FBQzlPLENBQUMsQ0FBQyxHQUFHLENBQStLQSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzhPLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUksSUFBaVJDLEdBQUMsQ0FBQy9PLENBQUMsQ0FBQyxJQUFJLFNBQVNnUCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNOLEdBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUNNLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTzdPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDSixDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDK08sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUYsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzVPLENBQUMsQ0FBQ3lPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSUssR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJTCxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFvZSxJQUFJRSxHQUFDLENBQUMsa09BQWtPLENBQUNQLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLElBQUlRLEdBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBNk0sSUFBSSxDQUFDLENBQUNyUCxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJc1AsR0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDdlAsQ0FBQyxDQUFDLEtBQUssQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNxUCxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHQyxHQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsQ0FBQyxHQUFHSCxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxD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
