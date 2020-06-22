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

    if (hangout.state !== 'MESSANGER' || hangout.state === 'ACCEPTER') {
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

var validationStates = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  INACTIVE: 'INACTIVE'
};

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
  USERNAME_NOT_REGISTERED: 'USERNAME_NOT_REGISTERED'
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
  PASSWORDS_DO_NOT_MATCH: 'passwords do not match'
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

var actionTypes$3 = {
  INIT_FORM_VALIDATION_STATE: 'INIT_FORM_VALIDATION_STATE',
  RESET_VALIDATION_STATE: 'RESET_VALIDATION_STATE',
  INPUT_BLURRED: 'INPUT_BLURRED',
  INPUT_FOCUSED: 'INPUT_FOCUSED',
  SERVER_VALIDATION: 'SERVER_VALIDATION',
  CLIENT_VALIDATION: 'CLIENT_VALIDATION',
  INC_INPUT_COUTN: 'INC_INPUT_COUTN'
};

var httpStatus = {
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
  switch (status) {
    case httpStatus.credentialInvalid:
      return {
        type: actionTypes$3.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID
      };

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
async function login({
  dispatch,
  state,
  formDispatch
}) {
  try {
    const {
      emailorusername,
      password
    } = state;
    dispatch({
      type: actionTypes$2.LOGIN_STARTED
    });
    const response = await fetch(`/auth/login`, {
      headers: {
        'Conten-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`
      },
      method: 'GET'
    });
    const result = await response.json();

    if (response.status === 200) {
      const {
        token,
        username,
        email
      } = result;
      dispatch({
        type: actionTypes$2.LOGIN_SUCCESS,
        token,
        username,
        email
      });
      window.localStorage.setItem('webcom', JSON.stringify({
        token,
        username,
        email
      }));
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      errors.forEach(error => {
        formDispatch(serverValidation({
          status: error
        }));
      });
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes$2.LOGIN_FAILED,
      payload: {
        error
      }
    });
  }
}
async function signup({
  dispatch,
  formDispatch,
  state
}) {
  dispatch({
    type: actionTypes$2.SIGNUP_STARTED
  });
  const {
    email,
    password,
    username
  } = state;

  try {
    const response = await fetch(`/auth/signup`, {
      body: JSON.stringify({
        password,
        email,
        username
      }),
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json'
      },
      method: 'POST'
    });
    const result = await response.json();

    if (response.status === 200) {
      const {
        token,
        username,
        email
      } = result;
      dispatch({
        type: actionTypes$2.SIGNUP_SUCCESS,
        token,
        username,
        email
      });
      window.localStorage.setItem('webcom', JSON.stringify({
        token,
        username,
        email
      }));
    } else if (response.status === 400) {
      debugger;
      const {
        errors
      } = result;
      errors.forEach(error => {
        formDispatch(serverValidation({
          status: error
        }));
      });
    } else {
      throw new Error('Signup failed');
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes$2.SIGNUP_FAILED,
      payload: {
        error
      }
    });
  }
}
function logout() {
  window.localStorage.removeItem('webcom');
  return {
    type: actionTypes$2.LOGOUT_SUCCESS
  };
}
async function changePassword({
  dispatch,
  state,
  formDispatch,
  token
}) {
  dispatch({
    type: actionTypes$2.CHANGE_PASSWORD_STARTED
  });

  try {
    const {
      confirm,
      password
    } = state;
    debugger;
    const response = await fetch(`${"http://192.168.43.49:3000"}/auth/changepass`, {
      method: 'put',
      body: JSON.stringify({
        confirm,
        password,
        token
      })
    });
    const result = await response.json();

    if (response.status === 200) {
      const {
        token,
        username,
        email
      } = result;
      debugger;
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_SUCCESS,
        token,
        username,
        email,
        message: `Password changed successfully.`
      });
      window.localStorage.setItem('webcom', JSON.stringify({
        token,
        username,
        email
      }));
    } else if (response.status === 400) {
      const {
        errors
      } = result;
      debugger;
      errors.forEach(error => {
        formDispatch(serverValidation({
          status: error
        }));
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_FAILED,
        error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.CHANGE_PASSWORD_FAILED,
      payload: {
        error
      }
    });
  }
}
async function forgotPassword({
  dispatch,
  state,
  formDispatch
}) {
  debugger;

  try {
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_STARTED
    });
    const {
      email
    } = state;
    const response = await fetch(`/auth/requestpasschange`, {
      method: 'post',
      body: JSON.stringify({
        email
      })
    });
    debugger;

    if (response.status === 200) {
      const result = await response.json();
      debugger;
      dispatch({
        type: actionTypes$2.REQUEST_PASS_CHANGE_SUCCESS,
        token: result.token,
        message: `A link for password change  has been sent to, ${email}! `
      });
    } else if (response.status === 400) {
      const result = await response.json();
      debugger;
      const {
        errors
      } = result;
      errors.forEach(error => {
        formDispatch(serverValidation({
          status: error
        }));
      });
    } else if (response.status === 500) {
      const result = await response.json();
      debugger;
      const {
        error
      } = result;
      debugger;
      dispatch({
        type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED,
        error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED,
      payload: {
        error
      }
    });
  }
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
    id: "changepassword"
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

const Login = L(() => import('./Login-cd9a4628.js'));
const ChangePassword = L(() => import('./ChangePassword-ded4dd76.js'));
const ForgotPassword = L(() => import('./ForgotPassword-b62e2919.js'));
const Signup = L(() => import('./Signup-c8cd4bdf.js'));
const Profile = L(() => import('./Profile-65e0aa1d.js'));
const AuthFeedback = L(() => import('./AuthFeedback-6707dcf8.js'));
function Authentication({
  children
}) {
  return h("div", {
    style: {
      paddingTop: 68
    }
  }, h(FeatureRoute, {
    path: "/changepassword"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(ChangePassword, null))), h(FeatureRoute, {
    path: "/login"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Login, null))), h(FeatureRoute, {
    path: "/signup"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Signup, null))), h(FeatureRoute, {
    path: "/forgotpassword"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(ForgotPassword, null))), h(FeatureRoute, {
    path: "/profile"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Profile, null))), h(FeatureRoute, {
    path: "/authfeedback"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(AuthFeedback, null))));
}

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

const Hangouts = L(() => import('./index-cdd1f3bb.js'));
const Group = L(() => import('./group-011cc456.js'));
function AppRoutes() {
  return h("div", {
    style: {
      height: '100%'
    }
  }, h(AppRoute, {
    path: "/auth"
  }, h(FormProvider, null, h(Authentication, null))), h(AppRoute, {
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

var css_248z$2 = "* {\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\n/* width */\r\n::-webkit-scrollbar {\r\n  width: 5px;\r\n}\r\n\r\n/* Track */\r\n::-webkit-scrollbar-track {\r\n  background: #f1f1f1;\r\n}\r\n\r\n/* Handle */\r\n::-webkit-scrollbar-thumb {\r\n  background: #888;\r\n}\r\n\r\n/* Handle on hover */\r\n::-webkit-scrollbar-thumb:hover {\r\n  background: #555;\r\n}\r\n\r\n@font-face {\r\n  font-family: \"Roboto\";\r\n  src: url(\"../theme/Roboto/Roboto-Regular.ttf\");\r\n}\r\n\r\nhtml {\r\n  font-family: \"Roboto\", Arial, Helvetica, sans-serif;\r\n}\r\n\r\nbody {\r\n  --bg-color:red;\r\n}";
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
    socketUrl: `wss://${"192.168.43.49"}:3000/hangouts`
  }, children)))));
}

H(h(AppProviders, null, h(App, null)), document.body);

export { FeatureRoute as F, L, U, _extends as _, useAppRoute as a, useMediaQuery as b, useAuthContext as c, useFormContext as d, valueChanged as e, validationStates as f, clientValidation as g, h, isClientValidationType as i, v$1 as j, useThemeContext as k, login as l, useUserName as m, getTokenFromUrl as n, changePassword as o, p$1 as p, forgotPassword as q, resetInputValidationState as r, styleInject as s, signup as t, useHangouts as u, validationTypes as v, List as w, ListItem as x, resetHangout as y, y as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtM2ViZWM1NTkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3JlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9zYXZlUmVjaWV2ZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0TWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlV2ViU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvTmF2UHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2NvbXBhdC9kaXN0L2NvbXBhdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZJdGVtLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2ljb25zL3VzZXI2NC5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uU3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2h0dHAtc3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoRHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL3VzZVVzZXJOYW1lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL25hdi9IYW5nb3V0RHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9NZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ljb25zL1NldHTEsW5ncy5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2F2ZVBlbmRpbmdIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9yZW1vdmVIYW5nb3V0RnJvbVVucmVhZC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9uYXYvSGFuZ291dFRvcE1lbnUuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L3N0eWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC91c2VNZWRpYVF1ZXJ5LmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9EcmF3ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L0FwcEJhci5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvaWNvbnMvTWVudVdoaXRlLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9NZW51LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwTmF2aWdhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0hvbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm1SZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwUHJvdmlkZXJzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHN1cHBvcnQgPSB7XG4gIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiZcbiAgICAnQmxvYicgaW4gc2VsZiAmJlxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxufVxuXG5mdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbn1cblxuaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gIF1cblxuICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPVxuICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgfVxuICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5eX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1c1xuICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG59XG5cbkJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICB1cmw6IHRoaXMudXJsXG4gIH0pXG59XG5cblJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG59XG5cbmV4cG9ydCB2YXIgRE9NRXhjZXB0aW9uID0gc2VsZi5ET01FeGNlcHRpb25cbnRyeSB7XG4gIG5ldyBET01FeGNlcHRpb24oKVxufSBjYXRjaCAoZXJyKSB7XG4gIERPTUV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG5hbWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpXG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrXG4gIH1cbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRE9NRXhjZXB0aW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaChpbnB1dCwgaW5pdCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCAmJiByZXF1ZXN0LnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgZnVuY3Rpb24gYWJvcnRYaHIoKSB7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgIH1cblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgfVxuICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgIH1cblxuICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICB9KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsKSB7XG4gICAgICByZXF1ZXN0LnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgcmVxdWVzdC5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gIH0pXG59XG5cbmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxuXG5pZiAoIXNlbGYuZmV0Y2gpIHtcbiAgc2VsZi5mZXRjaCA9IGZldGNoXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2Vcbn1cbiIsInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID17XHJcbiAgICBBUFBfUk9VVEVfQ0hBTkdFRDonQVBQX1JPVVRFX0NIQU5HRUQnLFxyXG4gICAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcclxuXHJcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxyXG5cclxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcclxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXHJcbiBcclxuICAgIFNFQVJDSEVEX0hBTkdPVVQ6ICdTRUFSQ0hFRF9IQU5HT1VUJyxcclxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcclxuICAgIENMRUFSRURfSEFOR09VVDonQ0xFQVJFRF9IQU5HT1VUJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXHJcbiAgICBcclxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxyXG5cclxuICAgIFNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEOidTT0NLRVRfTUVTU0FHRV9SRUNJRVZFRCcsXHJcblxyXG4gICAgXHJcbiAgICBNRVNTQUdFU19VUERBVEVEOidNRVNTQUdFU19VUERBVEVEJyxcclxuICAgIEhBTkdPVVRTX1VQREFURUQ6J0hBTkdPVVRTX1VQREFURUQnLFxyXG4gICAgSEFOR09VVF9VUERBVEVEOidIQU5HT1VUX1VQREFURUQnLFxyXG4gICAgVU5SRUFEX0hBTkdPVVRTX1VQREFURUQ6J1VOUkVBRF9IQU5HT1VUU19VUERBVEVEJyxcclxuICAgIC8vU09DS0VUXHJcblxyXG4gICAgQ09OTkVDVElORzonQ09OTkVDVElORycsXHJcbiAgICBPUEVOOidPUEVOJyxcclxuICAgIENMT1NJTkc6J0NMT1NJTkcnLFxyXG4gICAgQ0xPU0VEOidDTE9TRUQnLFxyXG4gICAgU09DS0VUX1JFQURZOidTT0NLRVRfUkVBRFknLFxyXG4gICAgU09DS0VUX0VSUk9SOidTT0NLRVRfRVJST1InXHJcblxyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBoYW5nb3V0czogbnVsbCxcclxuICBoYW5nb3V0OiBudWxsLFxyXG4gIHVucmVhZGhhbmdvdXRzOiBudWxsLFxyXG4gIG1lc3NhZ2VzOiBudWxsLFxyXG4gIHNlYXJjaDogJycsXHJcbiAgdXNlcjogW10sXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgbWVzc2FnZVRleHQ6ICcnLFxyXG4gIG9ubGluZTogZmFsc2UsXHJcbiAgc29ja2V0OiBudWxsLFxyXG4gIHJlYWR5U3RhdGU6IDAsXHJcbiAgc29ja2V0TWVzc2FnZTogbnVsbCxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUOlxyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSxoYW5nb3V0Om51bGx9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVEOlxyXG4gICAgIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdW5yZWFkaGFuZ291dHM6IGFjdGlvbi51bnJlYWRoYW5nb3V0cyB9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRDpcclxuXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVEOlxyXG5kZWJ1Z2dlclxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfTUVTU0FHRV9SRUNJRVZFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldE1lc3NhZ2U6IGFjdGlvbi5zb2NrZXRNZXNzYWdlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlVGV4dDogYWN0aW9uLnRleHQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cclxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxyXG4gICAgICAgICksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzZWFyY2g6IGFjdGlvbi5zZWFyY2ggfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0OiBzdGF0ZS5oYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBhY3Rpb24udXNlcm5hbWUpLFxyXG4gICAgICB9O1xyXG4gICAgLy9TT0NLRVRcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX0VSUk9SOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DT05ORUNUSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWTpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyByZWR1Y2VyVW5yZWFkaGFuZ291dHMgfSBmcm9tICcuL3JlZHVjZVVucmVhZGhhbmdvdXRzJztcclxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xyXG59XHJcbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pe1xyXG4gIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNMRUFSRURfSEFOR09VVH0pXHJcbn0gXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHtkaXNwYXRjaCx1c2VybmFtZX0pe1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XHJcbn1cclxuXHJcbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxyXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcclxufVxyXG4vL2ZpbHRlciBoYW5nb3V0IGFmdGVyIHNlYXJjaCBzdGF0ZSBjaGFuZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xyXG59XHJcblxyXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXHJcbiAgICApO1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcclxuICBcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tJHtoYW5nb3V0LnVzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZVVucmVhZCh7IHVucmVhZGhhbmdvdXRzLCBkaXNwYXRjaCB9KSB7XHJcbiAgLy8gZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy4sIHVucmVhZGhhbmdvdXRzOiByZWR1Y2VyVW5yZWFkaGFuZ291dHMoeyB1bnJlYWRoYW5nb3V0cyB9KSB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vRU5EIHNhdmVJbnZpdGVyXHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlYWRIYW5nb3V0cyh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0IH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICAvLyBzZXQgcmVhZCB0byB0cnVlIG9uIHVucmVhZCBoYW5nb3V0c1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgY29uc3QgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcbiAgZGVidWdnZXJcclxuICBpZiAodW5yZWFkaGFuZ291dHMmJiB1bnJlYWRoYW5nb3V0cy5sZW5ndGg+MCkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBsZXQgdXBkYXRlZHVucmVhZCA9IHVucmVhZGhhbmdvdXRzLm1hcCh1ID0+IHtcclxuICAgICAgaWYgKHUudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4udSwgcmVhZDogdHJ1ZSB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuZGVidWdnZXJcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkdW5yZWFkKSk7XHJcbmRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELHVucmVhZGhhbmdvdXRzOnVwZGF0ZWR1bnJlYWR9KVxyXG4gICAgZGVidWdnZXI7XHJcbiAgfVxyXG5kZWJ1Z2dlcjtcclxuICAvLyBzZXQgaGFuZ291dCB0byByZWFkXHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHsgLi4uaGFuZ291dCwgcmVhZDogdHJ1ZSB9KTtcclxuICAvL1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuXHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICB1cGRhdGVSZWFkTWVzc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUmVhZE1lc3NzYWdlcyh7IGhhbmdvdXQsIG5hbWUsIGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBjb25zdCB1cGRhdGVkTWVzc2FnZXMgPSBtZXNzYWdlcy5tYXAoKG0pID0+IHtcclxuICAgIHJldHVybiB7IC4uLm0sIHJlYWQ6IHRydWUgfTtcclxuICB9KTtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbn1cclxuIiwiXHJcbiAgZXhwb3J0IGNvbnN0IGhhbmdvdXRTdGF0ZXMgPSB7XHJcbiAgICBJTlZJVEVSOiAnSU5WSVRFUicsXHJcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcclxuICAgIERFQ0xJTkVSOiAnREVDTElORVInLFxyXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxyXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcclxuICAgIE1FU1NBTkdFUjogJ01FU1NBTkdFUicsXHJcbiAgIC8vIGFja25vd2xlZ2VtZW50XHJcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXHJcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcclxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxyXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxyXG4gICAgVU5CTE9DS0VEOiAnVU5CTE9DS0VEJyxcclxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnLFxyXG4gIH07IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgbmFtZSwgZGlzcGF0Y2gsIGhhbmdvdXQsIG9mZmxpbmUsIG9uQXBwUm91dGUgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHRpbWVzdGFtcCB9ID0gaGFuZ291dDtcclxuZGVidWdnZXI7XHJcbiAgY29uc3QgZGVsaXZlcmVkSGFuZ291dCA9IHsgLi4uaGFuZ291dCwgZGVsaXZlcmVkOiB0cnVlIH07XHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGRlbGl2ZXJlZEhhbmdvdXQpO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRCwgaGFuZ291dDogZGVsaXZlcmVkSGFuZ291dCB9KTtcclxuICBpZiAobWVzc2FnZSkge1xyXG5cclxuICAgIHVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgbmFtZSwgZGVsaXZlcmVkSGFuZ291dCxoYW5nb3V0IH0pO1xyXG4gIH1cclxuICBpZihoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnKXtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgdXBkYXRlQm9ja2VkU3RhdGUoe2Rpc3BhdGNoLG5hbWUsZGVsaXZlcmVkSGFuZ291dH0pXHJcbiAgfVxyXG4gIGlmIChvZmZsaW5lKSB7XHJcbiAgICAvL3JlbW92ZSBvZmZsaW5lIGhhbmdvdXRcclxuICAgIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBjb25zdCBvZmZsaW5laGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG9mZmxpbmVIYW5nb3V0S2V5KSk7XHJcblxyXG4gICAgaWYgKG9mZmxpbmVoYW5nb3V0cykge1xyXG4gICAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBvZmZsaW5laGFuZ291dHMuZmluZEluZGV4KFxyXG4gICAgICAgIChvKSA9PiBvLnRpbWVzdGFtcCA9PT0gdGltZXN0YW1wXHJcbiAgICAgICk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIG9mZmxpbmVIYW5nb3V0S2V5LFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxKSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgbmFtZSwgZGVsaXZlcmVkSGFuZ291dCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gZGVsaXZlcmVkSGFuZ291dDtcclxuXHJcbiAgY29uc3QgZGVsaXZlcmVkTWVzc2FnZSA9IHsgLi4ubWVzc2FnZSwgdXNlcm5hbWU6IG5hbWUsIGRlbGl2ZXJlZDogdHJ1ZSB9XHJcblxyXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gbWVzc2FnZXMuZmluZEluZGV4KFxyXG4gICAgKG0pID0+IG0udGltZXN0YW1wID09PSBtZXNzYWdlLnRpbWVzdGFtcFxyXG4gICk7XHJcbiAgbWVzc2FnZXMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkTWVzc2FnZSk7XHJcbiAgXHJcblxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXMgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsZGVsaXZlcmVkSGFuZ291dCxuYW1lfSl7XHJcbiAgZGVidWdnZXI7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gZGVsaXZlcmVkSGFuZ291dDtcclxuICBjb25zdCBibG9ja2VkTWVzc2FnZSA9IHsgdGltZXN0YW1wOmRlbGl2ZXJlZEhhbmdvdXQudGltZXN0YW1wLCB0ZXh0OiAneW91IGJsb2NrZWQgdGhpcyB1c2VyJywgdXNlcm5hbWU6IG5hbWUsIHR5cGU6ICdibG9ja2VkJyB9XHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIFxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KCBbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6Wy4uLm1lc3NhZ2VzLGJsb2NrZWRNZXNzYWdlXSB9KTtcclxufSIsImltcG9ydCB7IHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQgfSBmcm9tICcuL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGV9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcbmRlYnVnZ2VyO1xyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlVW5ibG92a2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQge2hhbmdvdXRTdGF0ZXN9ICBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcydcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWNpZXZlZEhhbmdvdXQoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZCxcclxufSkge1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcbiBkZWJ1Z2dlcjtcclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG5cclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG5cclxuIFxyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChoZz0+IGhnLnVzZXJuYW1lPT09dXNlcm5hbWUpXHJcbiAgICBpZihoYW5nb3V0RXhpc3Qpe1xyXG4gICAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcclxuICAgICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHN5bmMgbWVzc2FnZSB3aXRoIHJlZHVjZXIgc3RhdGVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7XHJcbiAgICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICAgIH0vL2VuZCBvZiBoYW5nb3V0IGV4aXN0XHJcbmVsc2V7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxufVxyXG5cclxufWVsc2V7XHJcbiAgZGVidWdnZXI7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuXHJcbn1cclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULFxyXG4gICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgIH0pO1xyXG4gICAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInIHx8ICBoYW5nb3V0LnN0YXRlPT09J0FDQ0VQVEVSJykge1xyXG4gICAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtZXNzYWdlKSB7XHJcbiAgICBzYXZlUmVjaWV2ZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0IH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHVucmVhZCkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBzd2l0Y2goaGFuZ291dC5zdGF0ZSl7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFUjpcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XHJcbiAgICAgICAgc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuIFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRNZXNzYWdlKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbn0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBudWxsO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IHRydWUgfV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFt7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xyXG4gICAgfVxyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuICBcclxuICAvL3VwZGF0ZSB1bnJlYWQgaGFuZ291dHNcclxuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuICBsZXQgdXBkYXRlZHVucmVhZHMgPSBudWxsO1xyXG4gIGlmICh1bnJlYWRoYW5nb3V0cykge1xyXG4gICAgdXBkYXRlZHVucmVhZHMgPSBbLi4udW5yZWFkaGFuZ291dHMsIHsuLi5oYW5nb3V0LHJlYWQ6ZmFsc2V9XTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZHVucmVhZHMgPSBbey4uLmhhbmdvdXQscmVhZDpmYWxzZX1dO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZHVucmVhZHMpKTtcclxuXHJcbiAgZGlzcGF0Y2goe1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICB1bnJlYWRoYW5nb3V0czogdXBkYXRlZHVucmVhZHMsXHJcbiAgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgc2F2ZVJlY2lldmVkSGFuZ291dCB9IGZyb20gJy4vc2F2ZVJlY2lldmVkSGFuZ291dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuXHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWNjZXB0ZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiAgXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FuZ2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkIH0pIHtcclxuXHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn0gLy8gRU5EIHNhdmVNZXNzYW5nZXJcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlVW5ibG9ja2VyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBoYW5nb3V0U3RhdGVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMnO1xyXG5pbXBvcnQge1xyXG4gIHNhdmVJbnZpdGVkLFxyXG4gIHNhdmVVbmJsb3ZrZWQsXHJcbiAgc2F2ZURlY2xpbmVkLFxyXG4gIHNhdmVCbG9ja2VkLFxyXG4gIHNhdmVBY2NlcHRlZCxcclxuICBzYXZlTWVzc2FnZWQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucyc7XHJcbmltcG9ydCB7XHJcbiAgc2F2ZUFjY2VwdGVyLFxyXG4gIHNhdmVCbG9ja2VyLFxyXG4gIHNhdmVEZWNsaW5lcixcclxuICBzYXZlSW52aXRlcixcclxuICBzYXZlTWVzc2FuZ2VyLFxyXG4gIHNhdmVVbmJsb2NrZXIsXHJcbn0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldE1lc3NhZ2Uoe1xyXG4gIHNvY2tldE1lc3NhZ2UsXHJcbiAgdXNlcm5hbWUsXHJcbiAgZGlzcGF0Y2gsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbn0pIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dCxvZmZsaW5lIH0pIHtcclxuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFRDpcclxuICAgICAgICBzYXZlSW52aXRlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VEOlxyXG4gICAgICAgIHNhdmVVbmJsb3ZrZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxyXG4gICAgICAgIHNhdmVEZWNsaW5lZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRDpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlQmxvY2tlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XHJcbiAgICAgICAgc2F2ZUFjY2VwdGVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQ6XHJcbiAgICAgICBcclxuICAgICAgICBzYXZlTWVzc2FnZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0LCB1bnJlYWQgfSkge1xyXG4gICAgXHJcbiAgICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxyXG4gICAgICAgIHNhdmVBY2NlcHRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VSOlxyXG4gICAgICAgXHJcbiAgICAgICAgc2F2ZUJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVEZWNsaW5lcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgICBzYXZlSW52aXRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSOlxyXG4gICAgICAgIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFUjpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlVW5ibG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzIH0pIHtcclxuICAgIGhhbmdvdXRzLmZvckVhY2goKGhhbmdvdXQpID0+IHtcclxuICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc29ja2V0TWVzc2FnZSAgJiYgdXNlcm5hbWUpIHtcclxuICAgIFxyXG4gICAgICBzd2l0Y2ggKHNvY2tldE1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ0FDS0hPV0xFREdFTUVOVCc6XHJcblxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogc29ja2V0TWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6ZmFsc2UgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdIQU5HT1VUJzpcclxuZGVidWdnZXI7XHJcbiAgICAgICAgICBpZihmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT1zb2NrZXRNZXNzYWdlLmhhbmdvdXQudXNlcm5hbWUpe1xyXG4gICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsdW5yZWFkOmZhbHNlIH0pO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnVU5SRUFEX0hBTkdPVVRTJzpcclxuICAgXHJcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzOiBzb2NrZXRNZXNzYWdlLmhhbmdvdXRzIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnT0ZGTElORV9BQ0tOJzpcclxuICAgICAgIFxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogc29ja2V0TWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6dHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFtzb2NrZXRNZXNzYWdlLCB1c2VybmFtZV0pO1xyXG5cclxuICByZXR1cm4ge307XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTFVFX0NIQU5HRUQ6ICdWQUxVRV9DSEFOR0VEJyxcclxuICBMT0dJTl9TVEFSVEVEOiAnTE9HSU5fU1RBUlRFRCcsXHJcbiAgTE9HSU5fU1VDQ0VTUzogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gIExPR0lOX0ZBSUxFRDogJ0xPR0lOX0ZBSUxFRCcsXHJcblxyXG4gIExPR09VVF9TVEFSVEVEOiAnTE9HT1VUX1NUQVJURUQnLFxyXG4gIExPR09VVF9GQUlMRUQ6ICdMT0dPVVRfRkFJTEVEJyxcclxuICBMT0dPVVRfU1VDQ0VTUzogJ0xPR09VVF9TVUNDRVNTJyxcclxuXHJcbiAgU0lHTlVQX1NUQVJURUQ6ICdTSUdOVVBfU1RBUlRFRCcsXHJcbiAgU0lHTlVQX1NVQ0NFU1M6ICdTSUdOVVBfU1VDQ0VTUycsXHJcbiAgU0lHTlVQX0ZBSUxFRDogJ1NJR05VUF9GQUlMRUQnLFxyXG5cclxuICBDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDogJ0NIQU5HRV9QQVNTV09SRF9TVEFSVEVEJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzogJ0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfRkFJTEVEOiAnQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCcsXHJcblxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCcsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEJyxcclxuICBHT1RfVE9LRU5fRlJPTV9VUkw6ICdHT1RfVE9LRU5fRlJPTV9VUkwnLFxyXG5cclxuICBSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6ICdSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUnLFxyXG59O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgZW1haWw6ICcnLFxyXG4gIHBhc3N3b3JkOiAnJyxcclxuICBzdWNjZXNzOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICB1c2VybmFtZTogJycsXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgY29uZmlybTogJycsXHJcbiAgY3VycmVudDogJycsXHJcbiAgZW1haWxvcnVzZXJuYW1lOiAnJyxcclxuICB0b2tlbjogbnVsbCxcclxuICBpc0xvZ2dlZEluOiBmYWxzZSxcclxuICBpc1Bhc3N3b3JkQ2hhbmdlZDogZmFsc2UsXHJcbiAgYXV0aEZlZWRiYWNrOiBudWxsLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XHJcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBbYWN0aW9uLnBheWxvYWQucHJvcE5hbWVdOiBhY3Rpb24ucGF5bG9hZC52YWx1ZSxcclxuICAgICAgfTtcclxuICBcclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZSwgJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi5lbWFpbCxcclxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXIudXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi51c2VyLmVtYWlsLFxyXG4gICAgICAgIHRva2VuOmFjdGlvbi51c2VyLnRva2VuXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBBdXRoUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbYXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgaWYgKGF1dGhSb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmsocHJvcHMpIHtcclxuICBjb25zdCB7IHRvLCBpZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRSb3V0ZSh0byk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8YVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgICAgaHJlZj17dG99XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxyXG4gICAgICBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnIH19XHJcbiAgICAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhSb3V0ZUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEF1dGhSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGluaXRpYWxSb3V0ZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZVN0YXRlKGluaXRpYWxSb3V0ZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdLCBbYXV0aFJvdXRlXSk7XHJcblxyXG4gIHJldHVybiA8QXV0aFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vYXV0aFJlZHVjZXInO1xyXG5pbXBvcnQgeyBBdXRoUm91dGVQcm92aWRlciB9IGZyb20gJy4vYXV0aC1yb3V0ZS1jb250ZXh0JztcclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9PlxyXG4gICAgICA8QXV0aFJvdXRlUHJvdmlkZXI+e2NoaWxkcmVufTwvQXV0aFJvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZUF1dGhDb250ZXh0LCBBdXRoUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlV2ViU29ja2V0KHsgc29ja2V0VXJsLCB1c2VybmFtZSwgZGlzcGF0Y2gsdG9rZW4gfSkge1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodG9rZW4pIHtcclxuICAgICAgZGVidWdnZXJcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHNvY2sgPSBuZXcgV2ViU29ja2V0KGAke3NvY2tldFVybH0vP3VzZXJuYW1lPSR7dXNlcm5hbWV9YCk7XHJcbiAgICAgIHNvY2sub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX01FU1NBR0VfUkVDSUVWRUQsIHNvY2tldE1lc3NhZ2U6IG1zZyB9KTtcclxuICAgXHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2sub25vcGVuID0gKCkgPT4ge1xyXG4gICAgIFxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT1BFTiB9KTtcclxuICAgICAgfTtcclxuICAgICAgc29jay5vbmNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xPU0VEIH0pO1xyXG4gICAgICB9O1xyXG4gICAgICBzb2NrLm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUiwgZXJyb3IgfSk7XHJcbiAgICAgIH07XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZLCBzb2NrZXQ6IHNvY2sgfSk7XHJcbiAgICB9XHJcbiAgfSwgW3Rva2VuXSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7XHJcbiAgdXNlQ29udGV4dCxcclxuICB1c2VTdGF0ZSxcclxuICB1c2VNZW1vLFxyXG4gIHVzZVJlZHVjZXIsXHJcbiAgdXNlRWZmZWN0LFxyXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XHJcblxyXG5pbXBvcnQge1xyXG4gIGxvYWRIYW5nb3V0cyxcclxuICBmaWx0ZXJIYW5nb3V0cyxcclxuICBmZXRjaEhhbmdvdXQsXHJcbiAgbG9hZE1lc3NhZ2VzLFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVwZGF0ZVJlYWRIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy91cGRhdGVSZWFkSGFuZ291dHMnO1xyXG5pbXBvcnQgeyB1c2VTb2NrZXRNZXNzYWdlIH0gZnJvbSAnLi91c2VTb2NrZXRNZXNzYWdlJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZVdlYlNvY2tldCB9IGZyb20gJy4vdXNlV2ViU29ja2V0JztcclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgc29ja2V0VXJsIH0gPSBwcm9wcztcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgeyB1c2VybmFtZSx0b2tlbiB9ID0gYXV0aENvbnRleHQuc3RhdGU7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgeyBoYW5nb3V0LCBzb2NrZXRNZXNzYWdlIH0gPSBzdGF0ZTtcclxuICBjb25zdCB3ZWJzb2NrZXRIYW5kbGVyID0gdXNlV2ViU29ja2V0KHsgdXNlcm5hbWUsIGRpc3BhdGNoLCBzb2NrZXRVcmwsdG9rZW4gfSk7XHJcbiAgY29uc3QgaGFuZGxlVXNlU29ja2V0TWVzc2FnZSA9IHVzZVNvY2tldE1lc3NhZ2Uoe1xyXG4gICAgdXNlcm5hbWUsXHJcbiAgIFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgICBzb2NrZXRNZXNzYWdlLFxyXG4gICAgZm9jdXNlZEhhbmdvdXQ6IGhhbmdvdXQsXHJcbiAgfSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3VzZXJuYW1lXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSAmJiB0b2tlbikge1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGhhbmdvdXQgJiYgdXNlcm5hbWUpIHtcclxuICBcclxuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgbG9hZE1lc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xyXG5cclxuICAgICAgLy9zYXZlIGhhbmdvdXQgdG8gbG9jYWxTdG9yYWdlXHJcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgaWYgKCFoYW5nb3V0cykge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChcclxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoaGFuZ291dEV4aXN0KSB7XHJcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghaGFuZ291dC5yZWFkKSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZTogdXNlcm5hbWUgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbaGFuZ291dCwgdXNlcm5hbWVdKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUaGVtZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggVGhlbWVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgXHJcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRTdGF0ZSk7XHJcblxyXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0LCBUaGVtZVByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBOYXZDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlTmF2Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChOYXZDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZU5hdkNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggTmF2UHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTmF2aWdhdGlvbigpIHtcclxuICBjb25zdCBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0gPSB1c2VOYXZDb250ZXh0KCk7XHJcbiAgICBmdW5jdGlvbiB0b2dnbGVEcmF3ZXIoKXtcclxuICAgICAgICBzZXREcmF3ZXJPcGVuKHByZXY9PiFwcmV2KVxyXG4gICAgfVxyXG4gIHJldHVybiB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2UHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0sIFtkcmF3ZXJPcGVuXSk7XHJcbiAgcmV0dXJuIDxOYXZDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnR7dXNlU3RhdGUgYXMgbix1c2VSZWR1Y2VyIGFzIHQsdXNlRWZmZWN0IGFzIGUsdXNlTGF5b3V0RWZmZWN0IGFzIHIsdXNlUmVmIGFzIG8sdXNlSW1wZXJhdGl2ZUhhbmRsZSBhcyB1LHVzZU1lbW8gYXMgaSx1c2VDYWxsYmFjayBhcyBmLHVzZUNvbnRleHQgYXMgYyx1c2VEZWJ1Z1ZhbHVlIGFzIGF9ZnJvbVwicHJlYWN0L2hvb2tzXCI7ZXhwb3J0KmZyb21cInByZWFjdC9ob29rc1wiO2ltcG9ydHtDb21wb25lbnQgYXMgbCxjcmVhdGVFbGVtZW50IGFzIHMsb3B0aW9ucyBhcyB2LHRvQ2hpbGRBcnJheSBhcyBoLGh5ZHJhdGUgYXMgcCxyZW5kZXIgYXMgZCxfdW5tb3VudCBhcyBtLGNsb25lRWxlbWVudCBhcyB5LGNyZWF0ZVJlZiBhcyBiLGNyZWF0ZUNvbnRleHQgYXMgZyxGcmFnbWVudCBhcyB4fWZyb21cInByZWFjdFwiO2V4cG9ydHtjcmVhdGVFbGVtZW50LGNyZWF0ZUNvbnRleHQsY3JlYXRlUmVmLEZyYWdtZW50LENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtmdW5jdGlvbiBFKG4sdCl7Zm9yKHZhciBlIGluIHQpbltlXT10W2VdO3JldHVybiBufWZ1bmN0aW9uIHcobix0KXtmb3IodmFyIGUgaW4gbilpZihcIl9fc291cmNlXCIhPT1lJiYhKGUgaW4gdCkpcmV0dXJuITA7Zm9yKHZhciByIGluIHQpaWYoXCJfX3NvdXJjZVwiIT09ciYmbltyXSE9PXRbcl0pcmV0dXJuITA7cmV0dXJuITF9dmFyIEM9ZnVuY3Rpb24obil7dmFyIHQsZTtmdW5jdGlvbiByKHQpe3ZhciBlO3JldHVybihlPW4uY2FsbCh0aGlzLHQpfHx0aGlzKS5pc1B1cmVSZWFjdENvbXBvbmVudD0hMCxlfXJldHVybiBlPW4sKHQ9cikucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5fX3Byb3RvX189ZSxyLnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obix0KXtyZXR1cm4gdyh0aGlzLnByb3BzLG4pfHx3KHRoaXMuc3RhdGUsdCl9LHJ9KGwpO2Z1bmN0aW9uIF8obix0KXtmdW5jdGlvbiBlKG4pe3ZhciBlPXRoaXMucHJvcHMucmVmLHI9ZT09bi5yZWY7cmV0dXJuIXImJmUmJihlLmNhbGw/ZShudWxsKTplLmN1cnJlbnQ9bnVsbCksdD8hdCh0aGlzLnByb3BzLG4pfHwhcjp3KHRoaXMucHJvcHMsbil9ZnVuY3Rpb24gcih0KXtyZXR1cm4gdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZSxzKG4sRSh7fSx0KSl9cmV0dXJuIHIucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9ITAsci5kaXNwbGF5TmFtZT1cIk1lbW8oXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsci50PSEwLHJ9dmFyIEE9di5fX2I7ZnVuY3Rpb24gUyhuKXtmdW5jdGlvbiB0KHQpe3ZhciBlPUUoe30sdCk7cmV0dXJuIGRlbGV0ZSBlLnJlZixuKGUsdC5yZWYpfXJldHVybiB0LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXQudD0hMCx0LmRpc3BsYXlOYW1lPVwiRm9yd2FyZFJlZihcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIix0fXYuX19iPWZ1bmN0aW9uKG4pe24udHlwZSYmbi50eXBlLnQmJm4ucmVmJiYobi5wcm9wcy5yZWY9bi5yZWYsbi5yZWY9bnVsbCksQSYmQShuKX07dmFyIGs9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9oKG4pLnJlZHVjZShmdW5jdGlvbihuLGUscil7cmV0dXJuIG4uY29uY2F0KHQoZSxyKSl9LFtdKTpudWxsfSxSPXttYXA6ayxmb3JFYWNoOmssY291bnQ6ZnVuY3Rpb24obil7cmV0dXJuIG4/aChuKS5sZW5ndGg6MH0sb25seTpmdW5jdGlvbihuKXtpZigxIT09KG49aChuKSkubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNoaWxkcmVuLm9ubHkoKSBleHBlY3RzIG9ubHkgb25lIGNoaWxkLlwiKTtyZXR1cm4gblswXX0sdG9BcnJheTpofSxGPXYuX19lO2Z1bmN0aW9uIE4obil7cmV0dXJuIG4mJigobj1FKHt9LG4pKS5fX2M9bnVsbCxuLl9faz1uLl9fayYmbi5fX2subWFwKE4pKSxufWZ1bmN0aW9uIFUoKXt0aGlzLl9fdT0wLHRoaXMubz1udWxsLHRoaXMuX19iPW51bGx9ZnVuY3Rpb24gTShuKXt2YXIgdD1uLl9fLl9fYztyZXR1cm4gdCYmdC51JiZ0LnUobil9ZnVuY3Rpb24gTChuKXt2YXIgdCxlLHI7ZnVuY3Rpb24gbyhvKXtpZih0fHwodD1uKCkpLnRoZW4oZnVuY3Rpb24obil7ZT1uLmRlZmF1bHR8fG59LGZ1bmN0aW9uKG4pe3I9bn0pLHIpdGhyb3cgcjtpZighZSl0aHJvdyB0O3JldHVybiBzKGUsbyl9cmV0dXJuIG8uZGlzcGxheU5hbWU9XCJMYXp5XCIsby50PSEwLG99ZnVuY3Rpb24gTygpe3RoaXMuaT1udWxsLHRoaXMubD1udWxsfXYuX19lPWZ1bmN0aW9uKG4sdCxlKXtpZihuLnRoZW4pZm9yKHZhciByLG89dDtvPW8uX187KWlmKChyPW8uX19jKSYmci5fX2MpcmV0dXJuIHIuX19jKG4sdC5fX2MpO0Yobix0LGUpfSwoVS5wcm90b3R5cGU9bmV3IGwpLl9fYz1mdW5jdGlvbihuLHQpe3ZhciBlPXRoaXM7bnVsbD09ZS5vJiYoZS5vPVtdKSxlLm8ucHVzaCh0KTt2YXIgcj1NKGUuX192KSxvPSExLHU9ZnVuY3Rpb24oKXtvfHwobz0hMCxyP3IoaSk6aSgpKX07dC5fX2M9dC5jb21wb25lbnRXaWxsVW5tb3VudCx0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dSgpLHQuX19jJiZ0Ll9fYygpfTt2YXIgaT1mdW5jdGlvbigpe3ZhciBuO2lmKCEtLWUuX191KWZvcihlLl9fdi5fX2tbMF09ZS5zdGF0ZS51LGUuc2V0U3RhdGUoe3U6ZS5fX2I9bnVsbH0pO249ZS5vLnBvcCgpOyluLmZvcmNlVXBkYXRlKCl9O2UuX191Kyt8fGUuc2V0U3RhdGUoe3U6ZS5fX2I9ZS5fX3YuX19rWzBdfSksbi50aGVuKHUsdSl9LFUucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuLHQpe3JldHVybiB0aGlzLl9fYiYmKHRoaXMuX192Ll9fa1swXT1OKHRoaXMuX19iKSx0aGlzLl9fYj1udWxsKSxbcyhsLG51bGwsdC51P251bGw6bi5jaGlsZHJlbiksdC51JiZuLmZhbGxiYWNrXX07dmFyIFA9ZnVuY3Rpb24obix0LGUpe2lmKCsrZVsxXT09PWVbMF0mJm4ubC5kZWxldGUodCksbi5wcm9wcy5yZXZlYWxPcmRlciYmKFwidFwiIT09bi5wcm9wcy5yZXZlYWxPcmRlclswXXx8IW4ubC5zaXplKSlmb3IoZT1uLmk7ZTspe2Zvcig7ZS5sZW5ndGg+MzspZS5wb3AoKSgpO2lmKGVbMV08ZVswXSlicmVhaztuLmk9ZT1lWzJdfX07KE8ucHJvdG90eXBlPW5ldyBsKS51PWZ1bmN0aW9uKG4pe3ZhciB0PXRoaXMsZT1NKHQuX192KSxyPXQubC5nZXQobik7cmV0dXJuIHJbMF0rKyxmdW5jdGlvbihvKXt2YXIgdT1mdW5jdGlvbigpe3QucHJvcHMucmV2ZWFsT3JkZXI/KHIucHVzaChvKSxQKHQsbixyKSk6bygpfTtlP2UodSk6dSgpfX0sTy5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4pe3RoaXMuaT1udWxsLHRoaXMubD1uZXcgTWFwO3ZhciB0PWgobi5jaGlsZHJlbik7bi5yZXZlYWxPcmRlciYmXCJiXCI9PT1uLnJldmVhbE9yZGVyWzBdJiZ0LnJldmVyc2UoKTtmb3IodmFyIGU9dC5sZW5ndGg7ZS0tOyl0aGlzLmwuc2V0KHRbZV0sdGhpcy5pPVsxLDAsdGhpcy5pXSk7cmV0dXJuIG4uY2hpbGRyZW59LE8ucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZT1PLnByb3RvdHlwZS5jb21wb25lbnREaWRNb3VudD1mdW5jdGlvbigpe3ZhciBuPXRoaXM7bi5sLmZvckVhY2goZnVuY3Rpb24odCxlKXtQKG4sZSx0KX0pfTt2YXIgVz1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9dmFyIHQ9bi5wcm90b3R5cGU7cmV0dXJuIHQuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dH0sdC5yZW5kZXI9ZnVuY3Rpb24obil7cmV0dXJuIG4uY2hpbGRyZW59LG59KCk7ZnVuY3Rpb24gaihuKXt2YXIgdD10aGlzLGU9bi5jb250YWluZXIscj1zKFcse2NvbnRleHQ6dC5jb250ZXh0fSxuLnZub2RlKTtyZXR1cm4gdC5zJiZ0LnMhPT1lJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSx0LnA9ITEpLG4udm5vZGU/dC5wPyhlLl9faz10Ll9fayxkKHIsZSksdC5fX2s9ZS5fX2spOih0LnY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikscChcIlwiLGUpLGUuYXBwZW5kQ2hpbGQodC52KSx0LnA9ITAsdC5zPWUsZChyLGUsdC52KSx0Ll9faz10LnYuX19rKTp0LnAmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpKSx0Lmg9cix0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKX0sbnVsbH1mdW5jdGlvbiB6KG4sdCl7cmV0dXJuIHMoaix7dm5vZGU6bixjb250YWluZXI6dH0pfXZhciBEPS9eKD86YWNjZW50fGFsaWdubWVudHxhcmFiaWN8YmFzZWxpbmV8Y2FwfGNsaXAoPyFQYXRoVSl8Y29sb3J8ZmlsbHxmbG9vZHxmb250fGdseXBoKD8hUil8aG9yaXp8bWFya2VyKD8hSHxXfFUpfG92ZXJsaW5lfHBhaW50fHN0b3B8c3RyaWtldGhyb3VnaHxzdHJva2V8dGV4dCg/IUwpfHVuZGVybGluZXx1bmljb2RlfHVuaXRzfHZ8dmVjdG9yfHZlcnR8d29yZHx3cml0aW5nfHgoPyFDKSlbQS1aXS87bC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTt2YXIgSD1cInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yJiZTeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKXx8NjAxMDM7ZnVuY3Rpb24gVChuLHQsZSl7aWYobnVsbD09dC5fX2spZm9yKDt0LmZpcnN0Q2hpbGQ7KXQucmVtb3ZlQ2hpbGQodC5maXJzdENoaWxkKTtyZXR1cm4gZChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9ZnVuY3Rpb24gVihuLHQsZSl7cmV0dXJuIHAobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfXZhciBaPXYuZXZlbnQ7ZnVuY3Rpb24gSShuLHQpe25bXCJVTlNBRkVfXCIrdF0mJiFuW3RdJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobix0LHtjb25maWd1cmFibGU6ITEsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbXCJVTlNBRkVfXCIrdF19LHNldDpmdW5jdGlvbihuKXt0aGlzW1wiVU5TQUZFX1wiK3RdPW59fSl9di5ldmVudD1mdW5jdGlvbihuKXtaJiYobj1aKG4pKSxuLnBlcnNpc3Q9ZnVuY3Rpb24oKXt9O3ZhciB0PSExLGU9ITEscj1uLnN0b3BQcm9wYWdhdGlvbjtuLnN0b3BQcm9wYWdhdGlvbj1mdW5jdGlvbigpe3IuY2FsbChuKSx0PSEwfTt2YXIgbz1uLnByZXZlbnREZWZhdWx0O3JldHVybiBuLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7by5jYWxsKG4pLGU9ITB9LG4uaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sbi5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gZX0sbi5uYXRpdmVFdmVudD1ufTt2YXIgJD17Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNsYXNzfX0scT12LnZub2RlO3Yudm5vZGU9ZnVuY3Rpb24obil7bi4kJHR5cGVvZj1IO3ZhciB0PW4udHlwZSxlPW4ucHJvcHM7aWYodCl7aWYoZS5jbGFzcyE9ZS5jbGFzc05hbWUmJigkLmVudW1lcmFibGU9XCJjbGFzc05hbWVcImluIGUsbnVsbCE9ZS5jbGFzc05hbWUmJihlLmNsYXNzPWUuY2xhc3NOYW1lKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImNsYXNzTmFtZVwiLCQpKSxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXt2YXIgcixvLHU7Zm9yKHUgaW4gZS5kZWZhdWx0VmFsdWUmJnZvaWQgMCE9PWUudmFsdWUmJihlLnZhbHVlfHwwPT09ZS52YWx1ZXx8KGUudmFsdWU9ZS5kZWZhdWx0VmFsdWUpLGRlbGV0ZSBlLmRlZmF1bHRWYWx1ZSksQXJyYXkuaXNBcnJheShlLnZhbHVlKSYmZS5tdWx0aXBsZSYmXCJzZWxlY3RcIj09PXQmJihoKGUuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24obil7LTEhPWUudmFsdWUuaW5kZXhPZihuLnByb3BzLnZhbHVlKSYmKG4ucHJvcHMuc2VsZWN0ZWQ9ITApfSksZGVsZXRlIGUudmFsdWUpLGUpaWYocj1ELnRlc3QodSkpYnJlYWs7aWYocilmb3IodSBpbiBvPW4ucHJvcHM9e30sZSlvW0QudGVzdCh1KT91LnJlcGxhY2UoL1tBLVowLTldLyxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpOnVdPWVbdV19IWZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSxyPW4ucHJvcHM7aWYociYmXCJzdHJpbmdcIj09dHlwZW9mIGUpe3ZhciBvPXt9O2Zvcih2YXIgdSBpbiByKS9eb24oQW5pfFRyYXxUb3UpLy50ZXN0KHUpJiYoclt1LnRvTG93ZXJDYXNlKCldPXJbdV0sZGVsZXRlIHJbdV0pLG9bdS50b0xvd2VyQ2FzZSgpXT11O2lmKG8ub25kb3VibGVjbGljayYmKHIub25kYmxjbGljaz1yW28ub25kb3VibGVjbGlja10sZGVsZXRlIHJbby5vbmRvdWJsZWNsaWNrXSksby5vbmJlZm9yZWlucHV0JiYoci5vbmJlZm9yZWlucHV0PXJbby5vbmJlZm9yZWlucHV0XSxkZWxldGUgcltvLm9uYmVmb3JlaW5wdXRdKSxvLm9uY2hhbmdlJiYoXCJ0ZXh0YXJlYVwiPT09ZXx8XCJpbnB1dFwiPT09ZS50b0xvd2VyQ2FzZSgpJiYhL15maWx8Y2hlfHJhL2kudGVzdChyLnR5cGUpKSl7dmFyIGk9by5vbmlucHV0fHxcIm9uaW5wdXRcIjtyW2ldfHwocltpXT1yW28ub25jaGFuZ2VdLGRlbGV0ZSByW28ub25jaGFuZ2VdKX19fSgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJiF0Lm0mJnQucHJvdG90eXBlJiYoSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxNb3VudFwiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wc1wiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFVwZGF0ZVwiKSx0Lm09ITApfXEmJnEobil9O3ZhciBCPVwiMTYuOC4wXCI7ZnVuY3Rpb24gRyhuKXtyZXR1cm4gcy5iaW5kKG51bGwsbil9ZnVuY3Rpb24gSihuKXtyZXR1cm4hIW4mJm4uJCR0eXBlb2Y9PT1IfWZ1bmN0aW9uIEsobil7cmV0dXJuIEoobik/eS5hcHBseShudWxsLGFyZ3VtZW50cyk6bn1mdW5jdGlvbiBRKG4pe3JldHVybiEhbi5fX2smJihkKG51bGwsbiksITApfWZ1bmN0aW9uIFgobil7cmV0dXJuIG4mJihuLmJhc2V8fDE9PT1uLm5vZGVUeXBlJiZuKXx8bnVsbH12YXIgWT1mdW5jdGlvbihuLHQpe3JldHVybiBuKHQpfTtleHBvcnQgZGVmYXVsdHt1c2VTdGF0ZTpuLHVzZVJlZHVjZXI6dCx1c2VFZmZlY3Q6ZSx1c2VMYXlvdXRFZmZlY3Q6cix1c2VSZWY6byx1c2VJbXBlcmF0aXZlSGFuZGxlOnUsdXNlTWVtbzppLHVzZUNhbGxiYWNrOmYsdXNlQ29udGV4dDpjLHVzZURlYnVnVmFsdWU6YSx2ZXJzaW9uOlwiMTYuOC4wXCIsQ2hpbGRyZW46UixyZW5kZXI6VCxoeWRyYXRlOlQsdW5tb3VudENvbXBvbmVudEF0Tm9kZTpRLGNyZWF0ZVBvcnRhbDp6LGNyZWF0ZUVsZW1lbnQ6cyxjcmVhdGVDb250ZXh0OmcsY3JlYXRlRmFjdG9yeTpHLGNsb25lRWxlbWVudDpLLGNyZWF0ZVJlZjpiLEZyYWdtZW50OngsaXNWYWxpZEVsZW1lbnQ6SixmaW5kRE9NTm9kZTpYLENvbXBvbmVudDpsLFB1cmVDb21wb25lbnQ6QyxtZW1vOl8sZm9yd2FyZFJlZjpTLHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzOlksU3VzcGVuc2U6VSxTdXNwZW5zZUxpc3Q6TyxsYXp5Okx9O2V4cG9ydHtCIGFzIHZlcnNpb24sUiBhcyBDaGlsZHJlbixUIGFzIHJlbmRlcixWIGFzIGh5ZHJhdGUsUSBhcyB1bm1vdW50Q29tcG9uZW50QXROb2RlLHogYXMgY3JlYXRlUG9ydGFsLEcgYXMgY3JlYXRlRmFjdG9yeSxLIGFzIGNsb25lRWxlbWVudCxKIGFzIGlzVmFsaWRFbGVtZW50LFggYXMgZmluZERPTU5vZGUsQyBhcyBQdXJlQ29tcG9uZW50LF8gYXMgbWVtbyxTIGFzIGZvcndhcmRSZWYsWSBhcyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyxVIGFzIFN1c3BlbnNlLE8gYXMgU3VzcGVuc2VMaXN0LEwgYXMgbGF6eX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wYXQubW9kdWxlLmpzLm1hcFxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcydcclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0gKHByb3BzKXtcclxuY29uc3Qge2NoaWxkcmVufT1wcm9wc1xyXG5yZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiey4uLnByb3BzfT57Y2hpbGRyZW59PC9kaXY+XHJcbn0iLCJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuXG5cblxuIGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3RcIiB7Li4ucHJvcHN9Lz5cbiAgKTtcbn1cblxuXG4gZnVuY3Rpb24gTGlzdEl0ZW0ocHJvcHMpIHtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1pdGVtXCIgey4uLnByb3BzfSAvPlxuICApO1xufVxuXG5leHBvcnQge0xpc3QsTGlzdEl0ZW19IiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVFBQUFBQVlMbFZBQUFBQkdkQlRVRUFBTEdQQy94aEJRQUFBQ0JqU0ZKTkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFBbUpMUjBRQUFLcU5JeklBQUFBSmNFaFpjd0FBRHNRQUFBN0VBWlVyRGhzQUFBQUhkRWxOUlFma0JCc0lMUzFZZjlKSUFBQURvRWxFUVZSbzNyMlpTMGhVVVJqSGYzTXRpOUJTTTJsUjB0UEpoRWpTVmlFRTFhS05sUlVWSkZFUUZGRWtidTIxSzdHSU5oRkZSQStDbGlVdGF0TkwzSVRSTktFUkJsRUxkVWJIN0tHbWMxdmNyalBqekwzM2ZHZnUrSDJMZ1h2TzkvOTk5NXd6NTNVRFNLMk1PcXBZUXdYRkZGRUEvQ1RHRUQxMEUrWVYvV0pGWmF2bE1pSGltQzRlSjBRYk5YNmo1OVBNUjFmd2RBL1RUS0UvOEJMT015aUMyejdJT1lxemd3ZG9wRjhMYm51VVV4aTYrRlc4eVFwdSsydFc2dUIzTXVRTDNzVGtCL3RrY0lNcnZzRnRiMVB2aW53ZStJNDNNYm5QYkRWOGUwN3dKaVpQdkZNSWNDZG5lQk9UQjE0ZDRYL2ZUL2RXTi95ZW5PTk5UUFk3NFZjU201RUVZcXpJM1B2K1REc3EvcEpBQW12YkVXN0tKZ3UrOHBBZUlNaCtsZ3BqRDNFbjlVRUpBNkozK0VNVGVWUFJlVFR6UnhUZlIxRnFBaGRFNFdOc1QzdW5yY0lVemlRSHp4Y3V1TWN5TnV0eGtVWTBlYi9RTEFydFNCbzVxY080VTZUVGxBZ05pUUozT1E0dDJUd1N0c05xUldHL3lIZE1JSjlmSXExcU1NQjVac3BvSFl3N2xvM1RLZEk2WUNXd1RSVFU2MXI2UmFTMUJRektXQ3NLaXJtV1JrVmE2eWcxcUhNWTAwNDJ4N1YwcmtqTG9NNmdTaFFDUzF4THk0VnFWUVpCWVVpdFMxbEFmQ1lLR2xRSVE4cXBkaXlyOFdpZmRLc3dLQldHd0VuSGtoTmlyVktJaUtZT0U1TUpoNGJleUlSWWF3REd4RUVtbjFtVWhpK2pWME5wVkM4QmsyNHFVL0NWZEd2cGpPcDBnUjI2ZUFvL1Q3Z1hTT29DZzUvaWdXUFpwNlM3a045ODFGUVpNWWhvaFAzbE9wdUlKejNaekUwbU5KUWlpTStCbzl4d09HNnY1cFo0Uk4yRHM0THFjUjZ5elBXTmx2TklsRUFMTkNoWGpsR3YxS3oxREN0cjdvUXlqM3N2Mjc4Skp1MUt2aXRwVGxyejhIdUZxbU11SzBBbTI4QzRnbXFYdFNONnJpRFlScGNvZ2JkY1VhajF6UHFwVVJqNUMwVjRnRVVLLzRqMWR1V3dSOFYyTVI3Z3FZZHFDUGgvWDNIYlE2cERLNEUzSHVWSjFFS1BvMW1EVmdMdXg1UUlCWWtXR09HYXExUk1Ld0gzcUt2V0ttVHZpSXZweWJERzJ6YWlOYy9QY3JtdTdpUEljT3FqdzZJcE5Gcy9tSjVUZ05jemhuK1IrU3d5VTVkVVE1a3ZxUUIyejBnQ3pzZDdvQzNuK0l2dUl6ZkE3WnppNzN2Zm1jL080V1gxWTdYNzhsbmN5Z24rcmhyZTZvaFduK0Z4TGdxdkFkaWgrYTBza3crelZ3YTNiQVV2ZmNHL1lMa08zdXFLUnZxeWdrYzVLbTM2NlZiRUdhSmE4QWd0TE1nT2Jsc0JUWHdRd1VPY3R0WjdQNjJhVnQ0eDZRcWVwSXRMaWIyZVNpOUxyWlE2MWxKSkJTVkpuKzhIcHo3ZkM4K2Evd0MxWkFYczNVaFVIQUFBQUNWMFJWaDBaR0YwWlRwamNtVmhkR1VBTWpBeU1DMHdOQzB5TjFRd09EbzBOVG8wTlNzd01Eb3dNQmF3U1ZRQUFBQWxkRVZZZEdSaGRHVTZiVzlrYVdaNUFESXdNakF0TURRdE1qZFVNRGc2TkRVNk5EVXJNREE2TURCbjdmSG9BQUFBR1hSRldIUlRiMlowZDJGeVpRQjNkM2N1YVc1cmMyTmhjR1V1YjNKbm0rNDhHZ0FBQUFCSlJVNUVya0pnZ2c9PVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTElEOiAnVkFMSUQnLFxyXG4gIElOVkFMSUQ6ICdJTlZBTElEJyxcclxuICBJTkFDVElWRTogJ0lOQUNUSVZFJ1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9jb25zdHJhaW50XHJcbiAgRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdFTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046ICdQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046ICdFTVBUWV9TVFJJTkdfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046ICdQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTicsXHJcbiAgLy9hdXRoXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAnVVNFUk5BTUVfVEFLRU4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdSRUdJU1RFUkVEX0VNQUlMJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ0VNQUlMX05PVF9SRUdJU1RFUkVEJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDonVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQnXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlZBTElEX1BBU1NXT1JEOlxyXG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxyXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FOlxyXG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcclxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ2VtcHR5IHN0cmluZyBpcyBub3QgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogJ2VtYWlsIG9yIHVzZXJuYW1lIGlzIG5vdCB2YWxpZCcsXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ2ludmFsaWQgY3JlZGVudGlhbHMgcHJvdmlkZWQnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ2VtYWlsIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcsXHJcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnXHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBwYXNzd29yZFJlZ2V4ID0gL14oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbYS16QS1aXSkuezgsfSQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcclxuIiwiaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNDbGllbnRWYWxpZGF0aW9uVHlwZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIHtcclxuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xyXG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG4gIGlmICghcGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHVzZXJuYW1lKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWUgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KSB7XHJcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pIHtcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID1hdXRoO1xyXG5kZWJ1Z2dlcjtcclxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIElOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOiAnSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUnLFxyXG4gICAgUkVTRVRfVkFMSURBVElPTl9TVEFURTogJ1JFU0VUX1ZBTElEQVRJT05fU1RBVEUnLFxyXG4gICAgSU5QVVRfQkxVUlJFRDogJ0lOUFVUX0JMVVJSRUQnLFxyXG4gICAgSU5QVVRfRk9DVVNFRDogJ0lOUFVUX0ZPQ1VTRUQnLFxyXG4gIFxyXG4gICAgU0VSVkVSX1ZBTElEQVRJT046ICdTRVJWRVJfVkFMSURBVElPTicsXHJcbiAgICBDTElFTlRfVkFMSURBVElPTjonQ0xJRU5UX1ZBTElEQVRJT04nLFxyXG4gIFxyXG4gICAgSU5DX0lOUFVUX0NPVVROIDonSU5DX0lOUFVUX0NPVVROJ1xyXG4gIH07XHJcbiAgIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIC8vbG9naW5cclxuICBjcmVkZW50aWFsSW52YWxpZDogJzQwMScsXHJcbiAgLy9zaWdudXBcclxuICB1c2VybmFtZUlzVGFrZW46ICc0MDInLFxyXG4gIGVtYWlsSXNSZWdpc3RlcmVkOiAnNDAzJyxcclxuICB1c2VybmFtZUludmFsaWQ6ICc0MDUnLFxyXG4gIHBhc3N3b3JkSW52YWxpZDogJzQwNicsIC8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgZW1haWxJbnZhbGlkOiAnNDA3JyxcclxuICAvL2xvZ2luXHJcbiAgZW1haWxJc05vdFJlZ2lzdGVyZWQ6ICc0MDgnLFxyXG4gIGVtcHR5U3RyaW5nTm90VmFsaWQ6ICc0MDknLFxyXG4gIGVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOic0MTAnLFxyXG4gIHVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOic0MTEnLFxyXG4vL2NoYW5nZSBwYXNzd29yZFxyXG4gIHBhc3N3b3JkRG9Ob3RNYXRjaDonNDEyJyxcclxuICB0b2tlbkV4cGlyZWQ6JzQxMycsXHJcbiAgc2VydmVyVmFsaWRhdGlvblJhbmdlOiBzdGF0dXMgPT4ge1xyXG4gICAgaWYgKHN0YXR1cyA+PSA0MDAgJiYgc3RhdHVzIDw9IDQxMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgKiBhcyB2YWxpZGF0aW9ucyBmcm9tICcuL2NvbnN0cmFpbnRWYWxpZGF0b3JzJztcclxuaW1wb3J0IGNvbnN0VmFsVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuL2h0dHAtc3RhdHVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xpZW50VmFsaWRhdGlvbih7IHZhbGlkYXRpb25UeXBlLCB2YWx1ZSwgc3RhdGUsYXV0aCB9KSB7XHJcblxyXG4gIGxldCB2YWxpZGF0aW9uID0gbnVsbDtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7XHJcbiAgICAgICAgZW1haWw6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7XHJcbiAgICAgICAgdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHtcclxuICAgICAgICBwYXNzd29yZDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHtcclxuICAgICAgICB1c2VybmFtZTogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgIFxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OLCAuLi52YWxpZGF0aW9uIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0Rm9ybVZhbGlkYXRpb25TdGF0ZSgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFLCB2YWxpZGF0aW9uVHlwZSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5jSW5wdXRDb3VudCgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE4gfTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzID0gMCB9KSB7XHJcblxyXG4gIHN3aXRjaCAoc3RhdHVzKSB7XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuY3JlZGVudGlhbEludmFsaWQ6XHJcbiAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtcHR5U3RyaW5nTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHsgc2VydmVyVmFsaWRhdGlvbiB9IGZyb20gJy4uL2Zvcm0vYWN0aW9ucyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4uL2Zvcm0vaHR0cC1zdGF0dXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQsXHJcbiAgICBwYXlsb2FkOiB7XHJcbiAgICAgIHByb3BOYW1lLFxyXG4gICAgICB2YWx1ZSxcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ2luKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvbG9naW5gLCB7XHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVuLVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnKicsXHJcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJhc2ljICR7YnRvYShgJHtlbWFpbG9ydXNlcm5hbWV9OiR7cGFzc3dvcmR9YCl9YCxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuIFxyXG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUywgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9KTtcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgIFxyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICBcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2dpbiBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBmb3JtRGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3NpZ251cGAsIHtcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSk7XHJcblxyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ251cCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2ViY29tJyk7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX1NVQ0NFU1MgfTtcclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCwgdG9rZW4gfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQgfSk7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgY29uZmlybSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaV91cmx9L2F1dGgvY2hhbmdlcGFzc2AsIHtcclxuICAgICAgbWV0aG9kOiAncHV0JyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIGNvbmZpcm0sXHJcbiAgICAgICAgcGFzc3dvcmQsXHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgIH0pLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuLFxyXG4gICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIG1lc3NhZ2U6IGBQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS5gLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3JlcXVlc3RwYXNzY2hhbmdlYCwge1xyXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcclxuICAgIH0pO1xyXG4gICAgZGVidWdnZXI7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MsXHJcbiAgICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgICBtZXNzYWdlOiBgQSBsaW5rIGZvciBwYXNzd29yZCBjaGFuZ2UgIGhhcyBiZWVuIHNlbnQgdG8sICR7ZW1haWx9ISBgLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXHJcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3IgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxyXG4gICAgdG9rZW4sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY292ZXJMb2NhbEF1dGhTdGF0ZSh7IHVzZXIsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSwgdXNlciB9KTtcclxufVxyXG4iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2NvbXBvbmVudHMvbGlzdCc7XHJcbmltcG9ydCB1c2VySWNvbiBmcm9tICcuL2ljb25zL3VzZXI2NC5wbmcnO1xyXG5pbXBvcnQgeyBsb2dvdXQgfSBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgZ3JpZDoge1xyXG4gICAgZGlzcGxheTogJ2dyaWQnLFxyXG4gICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ2F1dG8gNSUgYXV0bycsXHJcbiAgICBqdXN0aWZ5SXRlbXM6ICdjZW50ZXInLFxyXG4gICAgcGFkZGluZzoxNlxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aERyYXdlckNvbnRlbnQoKSB7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCB7b25BcHBSb3V0ZX0gPSB1c2VBcHBSb3V0ZSgpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTogYC8ke2lkfWAscm91dGU6Jy9hdXRoJ30pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZ1RvcDogMTAgfX0+XHJcbiAgICAgIHshc3RhdGUudXNlcm5hbWUgJiYgPFVuQXV0aGVkU3RhdGUgaGFuZGxlUm91dGU9e2hhbmRsZVJvdXRlfSAvPn1cclxuICAgICAge3N0YXRlLnVzZXJuYW1lICYmIChcclxuICAgICAgICA8QXV0aGVkU3RhdGVcclxuICAgICAgICBvbkFwcFJvdXRlPXtvbkFwcFJvdXRlfVxyXG4gICAgICAgICAgaGFuZGxlUm91dGU9e2hhbmRsZVJvdXRlfVxyXG4gICAgICAgICAgdXNlck5hbWU9e3N0YXRlLnVzZXJuYW1lfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICl9XHJcbiAgICAgIDxociBzdHlsZT17eyBoZWlnaHQ6IDEgfX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlLCB1c2VyTmFtZSAsb25BcHBSb3V0ZX0pIHtcclxuICBmdW5jdGlvbiBoYW5kbGVMb2dPdXQoKSB7XHJcbiAgIFxyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOicvJyxyb3V0ZTonL2hvbWUnfSk7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGltZyBzcmM9e3VzZXJJY29ufSBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDUgfX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZUxvZ091dH0gaWQ9J2xvZ291dCcgZGF0YS10ZXN0aWQ9J2xvZ291dCc+XHJcbiAgICAgICAgICAgIExvZ291dFxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDggfX0+V2VsY29tZSwge3VzZXJOYW1lfTwvZGl2PlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdjaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgICBDaGFuZ2UgUGFzc3dvcmRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5BdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuZ3JpZH0+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdsb2dpbicgZGF0YS10ZXN0aWQ9J2xvZ2luJz5cclxuICAgICAgICAgIExvZ2luXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgIDxkaXY+fDwvZGl2PlxyXG4gICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nc2lnbnVwJyBkYXRhLXRlc3RpZD0nc2lnbnVwJz5cclxuICAgICAgICAgIFNpZ251cFxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VVc2VyTmFtZSgpIHtcclxuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgeyBzdGF0ZSxkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIFxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpIHtcclxuIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwgfSA9IEpTT04ucGFyc2UoXHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxyXG4gICAgICApO1xyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzdGF0ZS50b2tlbikge1xyXG4gIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4gfSA9c3RhdGU7XHJcbiAgICAgIC8vIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgLy8gICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgIC8vICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICB9XHJcbiAgfSwgW3N0YXRlXSk7XHJcblxyXG4gIHJldHVybiB7IHVzZXJOYW1lLCB0b2tlbiwgZW1haWwgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2xpc3QnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dERyYXdlckNvbnRlbnQoKSB7XHJcblxyXG5jb25zdCB7b25BcHBSb3V0ZX0gPXVzZUFwcFJvdXRlKClcclxuXHJcbiAgY29uc3QgeyB1c2VyTmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBpZiAodXNlck5hbWUpIHtcclxuXHJcbiAgICAgIG9uQXBwUm91dGUoe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTonL2hhbmdvdXRzJyxyb3V0ZTonL2hhbmdvdXRzJ30pXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgb25BcHBSb3V0ZSh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlOicvbG9naW4nLHJvdXRlOicvYXV0aCd9KVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBkYXRhLXRlc3RpZD0naGFuZ291dHMnPlxyXG4gICAgICAgICAgSGFuZ291dFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiBcclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFNldHRpbmdzKHByb3BzKSB7XHJcblxyXG4gIGNvbnN0IHsgaGVpZ2h0ID0gMjQsXHJcbiAgICB3aWR0aCA9IDI0LFxyXG4gICAgZmlsbCA9ICdub25lJyxcclxuICAgIGNvbG9yID0gJ2JsYWNrJyxvbkNsaWNrICxpZH09cHJvcHNcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9ICBpZD17aWR9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDBWMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0vPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIGNvbG9yPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2Yy0uMTItLjIyLS4zOS0uMy0uNjEtLjIybC0yLjQ5IDFjLS41Mi0uNC0xLjA4LS43My0xLjY5LS45OGwtLjM4LTIuNjVDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJoLTRjLS4yNSAwLS40Ni4xOC0uNDkuNDJsLS4zOCAyLjY1Yy0uNjEuMjUtMS4xNy41OS0xLjY5Ljk4bC0yLjQ5LTFjLS4yMy0uMDktLjQ5IDAtLjYxLjIybC0yIDMuNDZjLS4xMy4yMi0uMDcuNDkuMTIuNjRsMi4xMSAxLjY1Yy0uMDQuMzItLjA3LjY1LS4wNy45OHMuMDMuNjYuMDcuOThsLTIuMTEgMS42NWMtLjE5LjE1LS4yNC40Mi0uMTIuNjRsMiAzLjQ2Yy4xMi4yMi4zOS4zLjYxLjIybDIuNDktMWMuNTIuNCAxLjA4LjczIDEuNjkuOThsLjM4IDIuNjVjLjAzLjI0LjI0LjQyLjQ5LjQyaDRjLjI1IDAgLjQ2LS4xOC40OS0uNDJsLjM4LTIuNjVjLjYxLS4yNSAxLjE3LS41OSAxLjY5LS45OGwyLjQ5IDFjLjIzLjA5LjQ5IDAgLjYxLS4yMmwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NGwtMi4xMS0xLjY1ek0xMiAxNS41Yy0xLjkzIDAtMy41LTEuNTctMy41LTMuNXMxLjU3LTMuNSAzLjUtMy41IDMuNSAxLjU3IDMuNSAzLjUtMS41NyAzLjUtMy41IDMuNXonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICB3aWR0aDogMTUsXHJcbiAgaGVpZ2h0OiAxNSxcclxuXHJcbiAgYm9yZGVyOiAnd2hpdGUgMnB4IHNvbGlkJyxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xyXG4gIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XHJcbiAgICByZXR1cm4gPElzT25saW5lIC8+O1xyXG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xyXG4gICAgcmV0dXJuIDxDb25uZWN0aW5nIC8+O1xyXG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMikge1xyXG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xyXG4gIH1cclxuICByZXR1cm4gPElzT2ZmbGluZSAvPjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT25saW5lKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBJc09mZmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3JlZCcgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcclxuICAgID48L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ29ubmVjdGluZygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDbG9zaW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdwaW5rJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUGVuZGluZ0hhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb25saW5lLGlzQmxvY2tlciB9KSB7XHJcbmRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHN0YXRlLCBlbWFpbCB9ID0gaGFuZ291dDtcclxuICBsZXQgaGFuZ291dEtleSA9ICcnO1xyXG4gIGxldCBtZXNzYWdlS2V5ID0gJyc7XHJcbiAgaWYgKG9ubGluZSkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tb2ZmbGluZS1tZXNzYWdlc2A7XHJcbiAgfVxyXG5cclxuICBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudGV4dCAhPT1cIlwiKSB7XHJcbiAgICBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIHVzZXJuYW1lLCBtZXNzYWdlLGRpc3BhdGNoLGlzQmxvY2tlciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGhhbmdvdXQpO1xyXG4gICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbaGFuZ291dF07XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuICB9XHJcbiBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSkge1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IFtdO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gXHJcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIG1lc3NhZ2VdO1xyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gW21lc3NhZ2VdO1xyXG4gIH1cclxuICBpZihpc0Jsb2NrZXIpe1xyXG4gXHJcbiAgICBjb25zdCBibG9ja2VyID1bLi4udXBkYXRlZE1lc3NhZ2VzLHt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIHRoaXMgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZC4nXHJcbiAgICAsdGltZXN0YW1wOiBEYXRlLm5vdygpLHR5cGU6J2Jsb2NrZXInLHVzZXJuYW1lOm1lc3NhZ2UudXNlcm5hbWUsZmxvYXQ6J3JpZ2h0J31dXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShibG9ja2VyKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiBibG9ja2VyIH0pO1xyXG4gIFxyXG4gIH1cclxuICBlbHNle1xyXG4gIFxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbiAgfVxyXG4gXHJcblxyXG59XHJcbiIsImltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnLi4vLi4vY2xpZW50Q29tbWFuZHMnO1xyXG5leHBvcnQgZnVuY3Rpb24gc2VuZE9mZmxpbmVIYW5nb3V0cyh7IGRpc3BhdGNoLCBzb2NrZXQsIG5hbWUgfSkge1xyXG4gIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xyXG4gIGlmIChvZmZsaW5lSGFuZ291dHMpIHtcclxuICAgIG9mZmxpbmVIYW5nb3V0cy5mb3JlRWFjaCgoaCkgPT4ge1xyXG4gICAgICBzb2NrZXQuc2VuZChcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB1c2VybmFtZTogaC51c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsOiBoLmVtYWlsLFxyXG4gICAgICAgICAgbWVzc2FnZTogaC5tZXNzYWdlLFxyXG4gICAgICAgICAgdGltZXN0YW1wOiBoLnRpbWVzdGFtcCxcclxuICAgICAgICAgIGNvbW1hbmQ6IGguc3RhdGUsXHJcbiAgICAgICAgICBvZmZsaW5lOiB0cnVlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQoe25hbWUsIGhhbmdvdXQsZGlzcGF0Y2h9KXtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XHJcbiAgICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gICAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gICBcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgIGNvbnN0IGZpbHRlcmVkSGFuZ291dHMgPSB1bnJlYWRoYW5nb3V0cy5maWx0ZXIoZnVuY3Rpb24odW5yZWFkKSAge1xyXG4gICAgICAgICAgICByZXR1cm4gIHVucmVhZC51c2VybmFtZSAhPT0gdXNlcm5hbWV9KTtcclxuICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGZpbHRlcmVkSGFuZ291dHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeShmaWx0ZXJlZEhhbmdvdXRzKSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0czogZmlsdGVyZWRIYW5nb3V0cyxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh1bnJlYWRoYW5nb3V0c0tleSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgIFxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyB1cGRhdGVMb2NhbEhhbmdvdXRzIH0gZnJvbSAnLi91cGRhdGVMb2NhbEhhbmdvdXRzJztcclxuaW1wb3J0IHsgc2F2ZVBlbmRpbmdIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnO1xyXG5pbXBvcnQge1xyXG4gIHNlbGVjdEhhbmdvdXQsXHJcbiAgc2VsZWN0VW5yZWFkLFxyXG4gIHNlYXJjaEhhbmdvdXRzLFxyXG4gIGZpbHRlckhhbmdvdXRzLFxyXG4gIGZldGNoSGFuZ291dCxcclxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcclxuXHJcbiAgc3RhcnRDbGllbnRDb21tYW5kLFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHNlbmRPZmZsaW5lSGFuZ291dHMgfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMnO1xyXG5pbXBvcnQge3JlbW92ZUhhbmdvdXRGcm9tVW5yZWFkfSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQnXHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuICBjb25zdCB7XHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICBzb2NrZXRNZXNzYWdlLFxyXG4gICAgcmVhZHlTdGF0ZSxcclxuICAgIHNvY2tldCxcclxuICAgIHVucmVhZGhhbmdvdXRzLFxyXG4gIH0gPSBzdGF0ZTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzb2NrZXQgJiYgcmVhZHlTdGF0ZSA9PT0gMSAmJiB1c2VybmFtZSkge1xyXG4gICAgICBzZW5kT2ZmbGluZUhhbmdvdXRzKHsgbmFtZTogdXNlcm5hbWUsIGRpc3BhdGNoLCBzb2NrZXQgfSk7XHJcbiAgICB9XHJcbiAgfSwgW3NvY2tldCwgcmVhZHlTdGF0ZSwgdXNlcm5hbWVdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25SZW1vdmVVbnJlYWQoZSl7XHJcbiAgICBjb25zdCBpZCA9ZS5jdXJyZW50VGFyZ2V0LmlkXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gaWQpO1xyXG4gICBkZWJ1Z2dlcjtcclxuICAgIHJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkKHtuYW1lOnVzZXJuYW1lLGRpc3BhdGNoLGhhbmdvdXR9KVxyXG4gIH1cclxuICBmdW5jdGlvbiBvbk5hdmlnYXRpb24oZSl7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgIC8vIGNvbnN0IGlkID1lLnRhcmdldC5pZFxyXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxyXG4gICBkZWJ1Z2dlcjtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtpZH1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xyXG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XHJcbiAgICBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaDogZS50YXJnZXQudmFsdWUsIGRpc3BhdGNoIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TdGFydFNlYXJjaChlKSB7XHJcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xyXG4gICAgY29uc3QgdGV4dCA9IGUudGFyZ2V0LnZhbHVlO1xyXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dCB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25IYW5nb3V0KGUpIHtcclxuICAgZGVidWdnZXI7XHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQ6ICcnLCBkaXNwYXRjaCB9KTtcclxuICAgIGNvbnN0IGNvbW1hbmQgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IGhhbmdvdXQ7XHJcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgbWVzc2FnZSA9XHJcbiAgICAgIG1lc3NhZ2VUZXh0ICE9PSAnJyA/IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCB9IDogbnVsbDtcclxuXHJcbiAgICBjb25zdCBvbmxpbmUgPSB0cnVlO1xyXG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcclxuICAgIGlmIChzb2NrZXQgJiYgcmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICBcclxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xyXG4gICAgICAgXHJcbiAgICAgICAgaXNCbG9ja2VyPXRydWVcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICBcclxuICAgICAgICBzb2NrZXQuc2VuZChcclxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICBjb21tYW5kLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIFxyXG4gICAgICB9XHJcbiAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9ubGluZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XHJcbiAgICAgIGRpc3BhdGNoLFxyXG4gICAgICBuYW1lOiB1c2VybmFtZSxcclxuICAgICAgaGFuZ291dDoge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIHN0YXRlOiBjb21tYW5kLFxyXG4gICAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCwgZGVsaXZlcmVkOiBmYWxzZSwgdXNlcm5hbWUgfSxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgZGVsaXZlcmVkOiBmYWxzZSxcclxuICAgICAgICBcclxuICAgICAgfSxcclxuICAgICAgb25saW5lLFxyXG4gICAgICBpc0Jsb2NrZXJcclxuICAgIH0pO1xyXG5cclxuICAgXHJcblxyXG5cclxuICB9Ly9lbmQgb25IYW5nb3V0XHJcbiAgcmV0dXJuIHtcclxuICAgIG9uTmF2aWdhdGlvbixcclxuICAgIG9uU2VsZWN0VW5yZWFkLFxyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgb25TdGFydFNlYXJjaCxcclxuICAgIG9uU2VhcmNoLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICB1c2VycyxcclxuICAgIHVzZXJuYW1lLFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICBvbkhhbmdvdXQsXHJcbiAgICB1bnJlYWRoYW5nb3V0cyxcclxuICAgIHJlYWR5U3RhdGUsXHJcbiAgICBvblJlbW92ZVVucmVhZFxyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IE5hdkl0ZW0gfSBmcm9tICcuLi8uLi9uYXYvTmF2SXRlbSc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi8uLi9pY29ucy9NZXNzYWdlJztcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuLi8uLi9pY29ucy9TZXR0xLFuZ3MnO1xyXG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi8uLi9pY29ucy9vbmxpbmVTdGF0dXMnO1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4uL3N0YXRlL3VzZUhhbmdvdXRzJztcclxuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tICcuLi8uLi9hdXRoL3VzZVVzZXJOYW1lJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dFRvcE1lbnUoKSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG4gIGNvbnN0IHsgdXNlck5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XHJcbiAgY29uc3QgeyByZWFkeVN0YXRlLCB1bnJlYWRoYW5nb3V0cywgb25OYXZpZ2F0aW9uLCBoYW5nb3V0IH0gPSB1c2VIYW5nb3V0cygpO1xyXG5cclxuICBmdW5jdGlvbiBuYXZUb1VucmVhZCgpIHtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6ICcvVU5SRUFEJywgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XHJcbiAgICAgIDxOYXZJdGVtPnt1c2VyTmFtZX08L05hdkl0ZW0+XHJcbiAgICAgIDxOYXZJdGVtPlxyXG4gICAgICAgIDxPbmxpbmVTdGF0dXMgcmVhZHlTdGF0ZT17cmVhZHlTdGF0ZX0gLz5cclxuICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICA8TmF2SXRlbSBvbkNsaWNrPXtuYXZUb1VucmVhZH0gZGF0YS10ZXN0aWQ9XCJuYXYtdW5yZWFkc1wiPlxyXG4gICAgICAgIHt1bnJlYWRoYW5nb3V0cyAmJiA8TWVzc2FnZSBjb3VudD17dW5yZWFkaGFuZ291dHMuZmlsdGVyKGY9PmYucmVhZD09PWZhbHNlKS5sZW5ndGh9IC8+fXsnICd9XHJcbiAgICAgIDwvTmF2SXRlbT5cclxuICAgICAge2hhbmdvdXQgJiYgKFxyXG4gICAgICAgIDxOYXZJdGVtICAgIG9uQ2xpY2s9e29uTmF2aWdhdGlvbn0gZGF0YS10ZXN0aWQ9XCJuYXYtY29uZmlnXCIgaWQ9XCJjb25maWd1cmVcIiA+XHJcbiAgICAgICAgICA8U2V0dGluZ3NcclxuICAgICAgICAgICAgZmlsbD1cIndoaXRlXCJcclxuICAgICAgICAgICAgd2lkdGg9XCIzMFwiXHJcbiAgICAgICAgICAgIGhlaWdodD1cIjMwXCJcclxuICAgICAgICAgXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuLy9cclxuIiwiZXhwb3J0IGNvbnN0IGRyYXdlciA9IHtcclxuICBib3hTaGFkb3c6IGAwcHggM3B4IDNweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSwwcHggM3B4IDRweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDFweCA4cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xMilgLFxyXG5cclxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICBsZWZ0OiAwLFxyXG4gIHRvcDogMCxcclxuICB6SW5kZXg6IDEwLFxyXG4gIGhlaWdodDogJzEwMHZoJyxcclxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjVmNWY1JyxcclxufTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tICcuL2RldmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKSB7XHJcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW29yaWVudGF0aW9uLCBzZXRPcmllbnRhdGlvbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2RldmljZSwgc2V0RGV2aWNlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XHJcbiAgIFxyXG4gICAgICBzZXRXaWR0aCh3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbiAgICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpIHtcclxuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xyXG4gIH1cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoID4gMCkge1xyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDYwMDpcclxuICAgICAgICAgIHNldERldmljZSgncGhvbmUnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNzY4OlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gOTkyOlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcclxuICAgICAgICAgIHNldERldmljZSgndGFibGV0Jyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2xhcHRvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2Rlc2t0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3dpZHRoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2aWNlJywgZGV2aWNlKTtcclxuICB9LCBbZGV2aWNlXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGhhbmRsZVZpZXdwb3J0U2l6ZSgpO1xyXG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XHJcbn1cclxuIiwiXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBkcmF3ZXIgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XG5pbXBvcnQgeyB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnLi9OYXZQcm92aWRlcic7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmF3ZXIocHJvcHMpIHtcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XG4gIGNvbnN0IHsgb3Blbiwgb25DbGljaywgY2hpbGRyZW4gfSA9IHByb3BzO1xuICBjb25zdCB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9ID0gdXNlTmF2aWdhdGlvbigpO1xuXG4gIGlmIChkcmF3ZXJPcGVuKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7IC4uLmRyYXdlciB9fVxuICAgICAgICBjbGFzc05hbWU9e2BkcmF3ZXItJHtkZXZpY2V9LXdpZHRoYH1cbiAgICAgICAgb25DbGljaz17dG9nZ2xlRHJhd2VyfVxuICAgICAgPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICByZXR1cm4gbnVsbDtcbn1cblxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwQmFyKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAuLi50aGVtZS5wcmltYXJ5LFxyXG4gICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAvLyBsZWZ0OiAwLFxyXG4gICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgbWluSGVpZ2h0OiA2NCxcclxuICAgICAgIC8vIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgIC8vIHBhZGRpbmdSaWdodDogMTYsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICBkaXNwbGF5OidmbGV4J1xyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCAnLi4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBNZW51V2hpdGUoeyBvbkNsaWNrLCBpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBjbGFzc05hbWU9XCJtZW51LXdoaXRlXCJcclxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgIGZpbGw9XCJ3aGl0ZVwiXHJcbiAgICAgIHdpZHRoPVwiMjRweFwiXHJcbiAgICAgIGhlaWdodD1cIjI0cHhcIlxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPHBhdGggZD1cIk0zIDE4aDE4di0ySDN2MnptMC01aDE4di0ySDN2MnptMC03djJoMThWNkgzelwiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnLi9OYXZQcm92aWRlcic7XHJcbmltcG9ydCB7IE1lbnVXaGl0ZSB9IGZyb20gJy4vaWNvbnMvTWVudVdoaXRlJztcclxuZXhwb3J0IGZ1bmN0aW9uIE1lbnUoKSB7XHJcbiAgY29uc3QgeyBkcmF3ZXJPcGVuLCB0b2dnbGVEcmF3ZXIgfSA9IHVzZU5hdmlnYXRpb24oKTtcclxuXHJcbiAgcmV0dXJuIDxNZW51V2hpdGUgb25DbGljaz17dG9nZ2xlRHJhd2VyfSBpZD1cIm1lbnVcIiAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgTmF2SXRlbSB9IGZyb20gJy4uL25hdi9OYXZJdGVtJztcclxuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEF1dGhEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vYXV0aC9BdXRoRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEhhbmdvdXREcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vaGFuZ291dHMvbmF2L0hhbmdvdXREcmF3ZXJDb250ZW50JztcclxuaW1wb3J0IHsgSGFuZ291dFRvcE1lbnUgfSBmcm9tICcuLi9oYW5nb3V0cy9uYXYvSGFuZ291dFRvcE1lbnUnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgcmVjb3ZlckxvY2FsQXV0aFN0YXRlIH0gZnJvbSAnLi4vYXV0aC9hY3Rpb25zJztcclxuaW1wb3J0IERyYXdlciBmcm9tICcuLi9uYXYvRHJhd2VyJztcclxuaW1wb3J0IHsgQXBwQmFyIH0gZnJvbSAnLi4vbmF2L0FwcEJhcic7XHJcbmltcG9ydCB7IE1lbnUgfSBmcm9tICcuLi9uYXYvTWVudSc7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBOYXZpZ2F0aW9uKCkge1xyXG4gICAgY29uc3QgeyBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcbiAgICAgICAgICByZWNvdmVyTG9jYWxBdXRoU3RhdGUoe1xyXG4gICAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgICAgdXNlcjogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxBcHBCYXI+XHJcbiAgICAgICAgPE1lbnUgLz5cclxuICAgICAgICA8TmF2SXRlbSBzdHlsZT17eyBmbGV4OiA1IH19PldFQiBDT008L05hdkl0ZW0+XHJcbiAgICAgICAgPEhhbmdvdXRUb3BNZW51IC8+XHJcbiAgICAgIDwvQXBwQmFyPlxyXG4gICAgICA8RHJhd2VyPlxyXG4gICAgICAgIDxBdXRoRHJhd2VyQ29udGVudCAvPlxyXG4gICAgICAgIDxIYW5nb3V0RHJhd2VyQ29udGVudCAvPlxyXG4gICAgICA8L0RyYXdlcj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSG9tZSgpIHtcclxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD0naG9tZScgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+SG9tZTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuXHJcbmltcG9ydCB7RmVhdHVyZVJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9Mb2dpbicpKTtcclxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9DaGFuZ2VQYXNzd29yZCcpKTtcclxuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvU2lnbnVwJykpO1xyXG5jb25zdCBQcm9maWxlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvUHJvZmlsZScpKTtcclxuY29uc3QgQXV0aEZlZWRiYWNrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvQXV0aEZlZWRiYWNrJykpO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoZW50aWNhdGlvbih7IGNoaWxkcmVuIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvY2hhbmdlcGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9sb2dpbic+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPExvZ2luIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9zaWdudXAnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxTaWdudXAgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2ZvcmdvdHBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Rm9yZ290UGFzc3dvcmQgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3Byb2ZpbGUnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQcm9maWxlIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEF1dGhGZWVkYmFjayAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7IHZhbGlkYXRpb246IHt9IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybVJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG5cclxuICBsZXQgbmV4dFN0YXRlID0gbnVsbDtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcblxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTlBVVF9GT0NVU0VEOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgIFthY3Rpb24ucHJvcE5hbWVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGNvdW50OiBzdGF0ZS5jb3VudCArIDEgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgZm9ybVJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vZm9ybVJlZHVjZXInO1xyXG5jb25zdCBGb3JtQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VGb3JtQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChGb3JtQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUZvcm1Db250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEZvcm1Qcm92aWRlcicpO1xyXG4gIH1cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9ybVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxGb3JtQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnLi9Ib21lJztcclxuaW1wb3J0IEF1dGhlbnRpY2F0aW9uIGZyb20gJy4uL2F1dGgvQXV0aGVudGljYXRpb24nO1xyXG5pbXBvcnQgeyBGb3JtUHJvdmlkZXIgfSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCc7XHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2hhbmdvdXRzJykpO1xyXG5jb25zdCBHcm91cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9ncm91cC9ncm91cCcpKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZXMoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3toZWlnaHQ6JzEwMCUnfX0+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2F1dGhcIj5cclxuICAgICAgICA8Rm9ybVByb3ZpZGVyPlxyXG4gICAgICAgICAgPEF1dGhlbnRpY2F0aW9uIC8+XHJcbiAgICAgICAgPC9Gb3JtUHJvdmlkZXI+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL1wiPlxyXG4gICAgICAgIDxIb21lIC8+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcblxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxIYW5nb3V0cyAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvQXBwUm91dGU+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2dyb3VwXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEdyb3VwIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcblxyXG5pbXBvcnQge0FwcE5hdmlnYXRpb259IGZyb20gJy4vQXBwTmF2aWdhdGlvbidcclxuaW1wb3J0IHtBcHBSb3V0ZXN9IGZyb20gJy4vQXBwUm91dGVzJ1xyXG5pbXBvcnQgJy4vY3NzL2FwcC5jc3MnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcCgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICc5NXZoJyB9fT5cclxuICAgICA8QXBwTmF2aWdhdGlvbi8+XHJcbiAgICAgIDxBcHBSb3V0ZXMvPlxyXG4gICAgICB7Jyd9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBSb3V0ZVByb3ZpZGVyIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBIYW5nb3V0c1Byb3ZpZGVyIH0gZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBOYXZQcm92aWRlciB9IGZyb20gJy4uL25hdi9OYXZQcm92aWRlcic7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFByb3ZpZGVycyh7IGNoaWxkcmVuIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPFRoZW1lUHJvdmlkZXJcclxuICAgICAgaW5pdFN0YXRlPXt7XHJcbiAgICAgICAgcHJpbWFyeToge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogJyM2MjAwRUUnLFxyXG4gICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8QXBwUm91dGVQcm92aWRlclxyXG4gICAgICAgIHRpdGxlPVwiV2ViY29tXCJcclxuICAgICAgICBpbml0U3RhdGU9e3sgcm91dGU6ICcvJywgZmVhdHVyZVJvdXRlOiAnL2hhbmdvdXRzJyB9fVxyXG4gICAgICA+XHJcbiAgICAgICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgICAgIDxOYXZQcm92aWRlcj5cclxuICAgICAgICAgICAgPEhhbmdvdXRzUHJvdmlkZXIgc29ja2V0VXJsPXtgd3NzOi8vJHtpcH06MzAwMC9oYW5nb3V0c2B9PlxyXG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICAgICAgPC9OYXZQcm92aWRlcj5cclxuICAgICAgICA8L0F1dGhQcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9UaGVtZVByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlcnMgfSBmcm9tICcuL0FwcFByb3ZpZGVycyc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxucmVuZGVyKFxyXG4gIDxBcHBQcm92aWRlcnM+XHJcbiAgICA8QXBwIC8+XHJcbiAgPC9BcHBQcm92aWRlcnM+LFxyXG5cclxuICBkb2N1bWVudC5ib2R5XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJmZXRjaCIsInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiRmVhdHVyZVJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImRpc3BhdGNoIiwiZmluZCIsInVzZUFwcFJvdXRlIiwib25BcHBSb3V0ZSIsIkFwcFJvdXRlIiwiQXBwUm91dGVQcm92aWRlciIsImluaXRTdGF0ZSIsInVzZVJlZHVjZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIkNMRUFSRURfSEFOR09VVCIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJTT0NLRVRfTUVTU0FHRV9SRUNJRVZFRCIsIk1FU1NBR0VTX1VQREFURUQiLCJIQU5HT1VUU19VUERBVEVEIiwiSEFOR09VVF9VUERBVEVEIiwiVU5SRUFEX0hBTkdPVVRTX1VQREFURUQiLCJDT05ORUNUSU5HIiwiT1BFTiIsIkNMT1NJTkciLCJDTE9TRUQiLCJTT0NLRVRfUkVBRFkiLCJTT0NLRVRfRVJST1IiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJ1bnJlYWRoYW5nb3V0cyIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwic29ja2V0IiwicmVhZHlTdGF0ZSIsInNvY2tldE1lc3NhZ2UiLCJ0ZXh0IiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJGSUxURVJfSEFOR09VVFMiLCJmaWx0ZXIiLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwibG9hZEhhbmdvdXRzIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJyZXNldEhhbmdvdXQiLCJzZWxlY3RVbnJlYWQiLCJzZWFyY2hIYW5nb3V0cyIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJjaGFuZ2VNZXNzYWdlVGV4dCIsImxvYWRNZXNzYWdlcyIsImtleSIsInVwZGF0ZVJlYWRIYW5nb3V0cyIsIm5hbWUiLCJtZXNzYWdlIiwidW5yZWFkaGFuZ291dHNLZXkiLCJsZW5ndGgiLCJ1cGRhdGVkdW5yZWFkIiwibWFwIiwicmVhZCIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJoYW5nb3V0S2V5IiwiaGFuZ291dEluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwidXBkYXRlUmVhZE1lc3NzYWdlcyIsIm1lc3NhZ2VLZXkiLCJ1cGRhdGVkTWVzc2FnZXMiLCJoYW5nb3V0U3RhdGVzIiwiSU5WSVRFUiIsIkFDQ0VQVEVSIiwiREVDTElORVIiLCJCTE9DS0VSIiwiVU5CTE9DS0VSIiwiTUVTU0FOR0VSIiwiSU5WSVRFRCIsIkFDQ0VQVEVEIiwiREVDTElORUQiLCJCTE9DS0VEIiwiVU5CTE9DS0VEIiwiTUVTU0FHRUQiLCJ1cGRhdGVEZWxpdmVyZWRIYW5nb3V0Iiwib2ZmbGluZSIsInRpbWVzdGFtcCIsImRlbGl2ZXJlZEhhbmdvdXQiLCJkZWxpdmVyZWQiLCJ1cGRhdGVEZWxpdmVyZWRNZXNzYWdlIiwidXBkYXRlQm9ja2VkU3RhdGUiLCJvZmZsaW5lSGFuZ291dEtleSIsIm9mZmxpbmVoYW5nb3V0cyIsImRlbGl2ZXJlZE1lc3NhZ2UiLCJibG9ja2VkTWVzc2FnZSIsInNhdmVNZXNzYWdlZCIsInNhdmVJbnZpdGVkIiwic2F2ZUFjY2VwdGVkIiwic2F2ZURlY2xpbmVkIiwic2F2ZUJsb2NrZWQiLCJzYXZlVW5ibG92a2VkIiwic2F2ZVJlY2lldmVkSGFuZ291dCIsImZvY3VzZWRIYW5nb3V0IiwidW5yZWFkIiwiaGFuZ291dEV4aXN0IiwiaGciLCJ1cGRhdGVkSGFuZ291dHMiLCJzYXZlUmVjaWV2ZWRNZXNzYWdlIiwic2F2ZVVucmVhZEhhbmdvdXQiLCJ1cGRhdGVkdW5yZWFkcyIsInNhdmVJbnZpdGVyIiwic2F2ZUFjY2VwdGVyIiwic2F2ZUJsb2NrZXIiLCJzYXZlRGVjbGluZXIiLCJzYXZlTWVzc2FuZ2VyIiwic2F2ZVVuYmxvY2tlciIsInVzZVNvY2tldE1lc3NhZ2UiLCJoYW5kbGVBY2tub3dsZWRnZW1lbnQiLCJoYW5kbGVIYW5nb3V0IiwiaGFuZGxlSGFuZ291dHMiLCJmb3JFYWNoIiwidXNlRWZmZWN0IiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImNvbmZpcm0iLCJjdXJyZW50IiwiZW1haWxvcnVzZXJuYW1lIiwidG9rZW4iLCJpc0xvZ2dlZEluIiwiaXNQYXNzd29yZENoYW5nZWQiLCJhdXRoRmVlZGJhY2siLCJhdXRoUmVkdWNlciIsIm5leHRTdGF0ZSIsInBheWxvYWQiLCJwcm9wTmFtZSIsInN1Y2Nlc3NNZXNzYWdlIiwiQXV0aFJvdXRlQ29udGV4dCIsIkF1dGhSb3V0ZVByb3ZpZGVyIiwiaW5pdGlhbFJvdXRlIiwiYXV0aFJvdXRlIiwic2V0QXV0aFJvdXRlIiwidXNlU3RhdGUiLCJBdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwidXNlV2ViU29ja2V0Iiwic29ja2V0VXJsIiwic29jayIsIldlYlNvY2tldCIsIm9ubWVzc2FnZSIsIm1zZyIsImRhdGEiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIkhhbmdvdXRDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJIYW5nb3V0c1Byb3ZpZGVyIiwiYXV0aENvbnRleHQiLCJ3ZWJzb2NrZXRIYW5kbGVyIiwiaGFuZGxlVXNlU29ja2V0TWVzc2FnZSIsInVwZGF0ZWQiLCJUaGVtZUNvbnRleHQiLCJ1c2VUaGVtZUNvbnRleHQiLCJUaGVtZVByb3ZpZGVyIiwic2V0U3RhdGUiLCJOYXZDb250ZXh0IiwidXNlTmF2Q29udGV4dCIsInVzZU5hdmlnYXRpb24iLCJkcmF3ZXJPcGVuIiwic2V0RHJhd2VyT3BlbiIsInRvZ2dsZURyYXdlciIsInByZXYiLCJOYXZQcm92aWRlciIsIkUiLCJ3IiwiQyIsImwiLCJBIiwiRiIsIk4iLCJNIiwiUCIsImgiLCJEIiwiSCIsIiQiLCJxIiwiTmF2SXRlbSIsIkxpc3QiLCJMaXN0SXRlbSIsIlZBTElEIiwiSU5WQUxJRCIsIklOQUNUSVZFIiwiRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiIsIlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIlVTRVJOQU1FX1RBS0VOIiwiUkVHSVNURVJFRF9FTUFJTCIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJJTlZBTElEX1BBU1NXT1JEIiwiSU5WQUxJRF9FTUFJTCIsIklOVkFMSURfVVNFUk5BTUUiLCJJTlZBTElEX0VNUFRZX1NUUklORyIsIklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwiLCJQQVNTV09SRFNfRE9fTk9UX01BVENIIiwicGFzc3dvcmRSZWdleCIsImVtYWlsUmVnZXgiLCJ1c2VybmFtZVJlZ2V4IiwidmFsaWRhdGVFbWFpbENvbnN0cmFpbnQiLCJlbWFpbENvbnN0cmFpbnQiLCJSZWdFeHAiLCJ0ZXN0IiwidmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0aW9uVHlwZXMiLCJ2YWxpZGF0aW9uU3RhdGUiLCJ2YWxpZGF0aW9uTWVzc2FnZXMiLCJpc0NsaWVudFZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidmFsaWRhdGVFbXB0eVN0cmluZyIsInZhbGlkYXRlUGFzc3dvcmRNYXRjaCIsImF1dGgiLCJJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSIsIlJFU0VUX1ZBTElEQVRJT05fU1RBVEUiLCJJTlBVVF9CTFVSUkVEIiwiSU5QVVRfRk9DVVNFRCIsIlNFUlZFUl9WQUxJREFUSU9OIiwiQ0xJRU5UX1ZBTElEQVRJT04iLCJJTkNfSU5QVVRfQ09VVE4iLCJjcmVkZW50aWFsSW52YWxpZCIsInVzZXJuYW1lSXNUYWtlbiIsImVtYWlsSXNSZWdpc3RlcmVkIiwidXNlcm5hbWVJbnZhbGlkIiwicGFzc3dvcmRJbnZhbGlkIiwiZW1haWxJbnZhbGlkIiwiZW1haWxJc05vdFJlZ2lzdGVyZWQiLCJlbXB0eVN0cmluZ05vdFZhbGlkIiwiZW1haWxvcnVzZXJuYW1lTm90VmFsaWQiLCJ1c2VybmFtZUlzTm90UmVnaXN0ZXJlZCIsInBhc3N3b3JkRG9Ob3RNYXRjaCIsInRva2VuRXhwaXJlZCIsInNlcnZlclZhbGlkYXRpb25SYW5nZSIsInN0YXR1cyIsImNsaWVudFZhbGlkYXRpb24iLCJ2YWxpZGF0aW9uIiwiY29uc3RWYWxUeXBlcyIsInZhbGlkYXRpb25zIiwicmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSIsInNlcnZlclZhbGlkYXRpb24iLCJodHRwU3RhdHVzIiwidmFsaWRhdGlvblN0YXRlcyIsInZhbHVlQ2hhbmdlZCIsImxvZ2luIiwiZm9ybURpc3BhdGNoIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwibWV0aG9kIiwicmVzdWx0Iiwid2luZG93IiwiZXJyb3JzIiwic2lnbnVwIiwiYm9keSIsIkNvbnRlbnRUeXBlIiwiQWNjZXB0IiwibG9nb3V0IiwicmVtb3ZlSXRlbSIsImNoYW5nZVBhc3N3b3JkIiwiYXBpX3VybCIsImZvcmdvdFBhc3N3b3JkIiwiZ2V0VG9rZW5Gcm9tVXJsIiwicmVjb3ZlckxvY2FsQXV0aFN0YXRlIiwic3R5bGUiLCJncmlkIiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJqdXN0aWZ5SXRlbXMiLCJwYWRkaW5nIiwiQXV0aERyYXdlckNvbnRlbnQiLCJoYW5kbGVSb3V0ZSIsInByZXZlbnREZWZhdWx0IiwiaWQiLCJ0YXJnZXQiLCJwYWRkaW5nVG9wIiwiaGVpZ2h0IiwiQXV0aGVkU3RhdGUiLCJ1c2VyTmFtZSIsImhhbmRsZUxvZ091dCIsImFsaWduSXRlbXMiLCJmbGV4RGlyZWN0aW9uIiwidXNlckljb24iLCJwYWRkaW5nUmlnaHQiLCJtYXJnaW5Cb3R0b20iLCJVbkF1dGhlZFN0YXRlIiwidXNlVXNlck5hbWUiLCJzZXRVc2VybmFtZSIsInNldFRva2VuIiwic2V0RW1haWwiLCJIYW5nb3V0RHJhd2VyQ29udGVudCIsImNvdW50Iiwid2lkdGgiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjb2xvciIsInRleHRBbGlnbiIsImJvcmRlclJhZGl1cyIsImp1c3RpZnlDb250ZW50IiwiTWVzc2FnZSIsIlNldHRpbmdzIiwiZmlsbCIsIm9uQ2xpY2siLCJib3JkZXIiLCJPbmxpbmVTdGF0dXMiLCJJc09ubGluZSIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwic2F2ZVBlbmRpbmdIYW5nb3V0IiwiaXNCbG9ja2VyIiwic2F2ZUhhbmdvdXQiLCJzYXZlTWVzc2FnZSIsImJsb2NrZXIiLCJEYXRlIiwibm93IiwiZmxvYXQiLCJzZW5kT2ZmbGluZUhhbmdvdXRzIiwib2ZmbGluZUhhbmdvdXRzIiwiZm9yZUVhY2giLCJzZW5kIiwiY29tbWFuZCIsInJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkIiwiZmlsdGVyZWRIYW5nb3V0cyIsInVzZUhhbmdvdXRzIiwidXNlcnMiLCJvblJlbW92ZVVucmVhZCIsImN1cnJlbnRUYXJnZXQiLCJvbk5hdmlnYXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJvblNlbGVjdEhhbmdvdXQiLCJvblNlbGVjdFVucmVhZCIsIm9uU2VhcmNoIiwib25TdGFydFNlYXJjaCIsIm9uTWVzc2FnZVRleHQiLCJvbkhhbmdvdXQiLCJIYW5nb3V0VG9wTWVudSIsIm5hdlRvVW5yZWFkIiwiZHJhd2VyIiwiYm94U2hhZG93IiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwiekluZGV4IiwidXNlTWVkaWFRdWVyeSIsInNldFdpZHRoIiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJEcmF3ZXIiLCJvcGVuIiwiQXBwQmFyIiwidGhlbWUiLCJwcmltYXJ5IiwibWluSGVpZ2h0IiwiTWVudVdoaXRlIiwiTWVudSIsIkFwcE5hdmlnYXRpb24iLCJmbGV4IiwiSG9tZSIsIkxvZ2luIiwibGF6eSIsIkNoYW5nZVBhc3N3b3JkIiwiRm9yZ290UGFzc3dvcmQiLCJTaWdudXAiLCJQcm9maWxlIiwiQXV0aEZlZWRiYWNrIiwiQXV0aGVudGljYXRpb24iLCJTdXNwZW5zZSIsImZvcm1SZWR1Y2VyIiwiZm9ybVN0YXRlIiwiRm9ybUNvbnRleHQiLCJ1c2VGb3JtQ29udGV4dCIsIkZvcm1Qcm92aWRlciIsIkhhbmdvdXRzIiwiR3JvdXAiLCJBcHBSb3V0ZXMiLCJBcHAiLCJBcHBQcm92aWRlcnMiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsImlwIiwicmVuZGVyIiwiZG9jdW1lbnQiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLElBQUksSUFBSTtBQUN6QyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQ3BELEVBQUUsSUFBSTtBQUNOLElBQUksWUFBWSxJQUFJLElBQUk7QUFDeEIsSUFBSSxNQUFNLElBQUksSUFBSTtBQUNsQixJQUFJLENBQUMsV0FBVztBQUNoQixNQUFNLElBQUk7QUFDVixRQUFRLElBQUksSUFBSSxHQUFFO0FBQ2xCLFFBQVEsT0FBTyxJQUFJO0FBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNsQixRQUFRLE9BQU8sS0FBSztBQUNwQixPQUFPO0FBQ1AsS0FBSyxHQUFHO0FBQ1IsRUFBRSxRQUFRLEVBQUUsVUFBVSxJQUFJLElBQUk7QUFDOUIsRUFBRSxXQUFXLEVBQUUsYUFBYSxJQUFJLElBQUk7QUFDcEMsRUFBQztBQUNEO0FBQ0EsU0FBUyxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQ3pCLEVBQUUsT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO0FBQ3JELENBQUM7QUFDRDtBQUNBLElBQUksT0FBTyxD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QUksS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDMUMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVM7QUFDNUIsTUFBTSxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUk7QUFDM0IsS0FBSztBQUNMLEdBQUcsTUFBTTtBQUNULElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksY0FBYTtBQUM3RSxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUM7QUFDL0MsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBQztBQUN2RSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUk7QUFDL0MsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU07QUFDN0MsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUk7QUFDdEI7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDakUsSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLDJDQUEyQyxDQUFDO0FBQ3BFLEdBQUc7QUFDSCxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFDO0FBQ3RCLENBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxT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QUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUE0SyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1L1IsSUFBSUMsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1AsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNKLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXlFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUF1RyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcs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LENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlDLEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0QsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUVBLEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNFLENBQUMsQ0FBQyxDQUFvVCxJQUFJQyxHQUFDLENBQUM5TyxDQUFDLENBQUMsR0FBRyxDQUErS0EsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM4TyxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFJLElBQWlSQyxHQUFDLENBQUMvTyxDQUFDLENBQUMsSUFBSSxTQUFTZ1AsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDTixHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDTSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU83TyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQ0osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQytPLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUlGLENBQUMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNJLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQ0QsR0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM1TyxDQUFDLENBQUN5TyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUlLLEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUwsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUNDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBb2UsSUFBSUUsR0FBQyxDQUFDLGtPQUFrTyxDQUFDUCxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxJQUFJUSxHQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLENBQTZNLElBQUksQ0FBQyxDQUFDclAsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSXNQLEdBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQ3ZQLENBQUMsQ0FBQyxLQUFLLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDcVAsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBR0MsR0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLENBQUMsR0FBR0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQSxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQ0csR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7O0FDQTE3TSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQy9CLEVBQUUsS0FBSyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqQyxFQUFFLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDOUI7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQzFEO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxFQUFFLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztBQUMxQjtBQUNBLEVBQUUsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO0FBQzFCLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3pCLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QixLQUFLO0FBQ0wsR0FBRyxNQUFNO0FBQ1QsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO0FBQ3hCLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ25DLEdBQUcsTUFBTTtBQUNULElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEQsR0FBRztBQUNIOzs7OztBQ3ZCTyxTQUFTQyxPQUFULENBQWtCaE8sS0FBbEIsRUFBd0I7QUFDL0IsUUFBTTtBQUFDQyxJQUFBQTtBQUFELE1BQVdELEtBQWpCO0FBQ0EsU0FBTztBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FBNkJBLEtBQTdCLEdBQXFDQyxRQUFyQyxDQUFQO0FBQ0M7Ozs7O0FDQ0EsU0FBU2dPLElBQVQsQ0FBY2pPLEtBQWQsRUFBcUI7QUFDcEIsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FBMEJBLEtBQTFCLEVBREY7QUFHRDs7QUFHQSxTQUFTa08sUUFBVCxDQUFrQmxPLEtBQWxCLEVBQXlCO0FBRXhCLFNBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQStCQSxLQUEvQixFQURGO0FBR0Q7O0FDbEJELE1BQU0sR0FBRyxHQUFHLHdvREFBd29EOztBQ0FwcEQsdUJBQWU7QUFDYm1PLEVBQUFBLEtBQUssRUFBRSxPQURNO0FBRWJDLEVBQUFBLE9BQU8sRUFBRSxTQUZJO0FBR2JDLEVBQUFBLFFBQVEsRUFBRTtBQUhHLENBQWY7O0FDQUEsc0JBQWU7QUFDYjtBQUNBQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFGWjtBQUdiQyxFQUFBQSwwQkFBMEIsRUFBRSw0QkFIZjtBQUliQyxFQUFBQSwwQkFBMEIsRUFBRSw0QkFKZjtBQUtiQyxFQUFBQSxtQ0FBbUMsRUFBRSxxQ0FMeEI7QUFNYkMsRUFBQUEsdUJBQXVCLEVBQUUseUJBTlo7QUFPYkMsRUFBQUEsMEJBQTBCLEVBQUUsNEJBUGY7QUFRYjtBQUNBQyxFQUFBQSxtQkFBbUIsRUFBRSxxQkFUUjtBQVViQyxFQUFBQSxjQUFjLEVBQUUsZ0JBVkg7QUFXYkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBWEw7QUFZYkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBWlQ7QUFhYkMsRUFBQUEsdUJBQXVCLEVBQUM7QUFiWCxDQUFmOztBQ0FBLHlCQUFlO0FBQ2JDLEVBQUFBLGdCQUFnQixFQUNkLHFIQUZXO0FBR2JDLEVBQUFBLGFBQWEsRUFBRSwyQkFIRjtBQUliSCxFQUFBQSxvQkFBb0IsRUFBRSx5QkFKVDtBQUtiQyxFQUFBQSx1QkFBdUIsRUFBRSw0QkFMWjtBQU1iRyxFQUFBQSxnQkFBZ0IsRUFDZCw2REFQVztBQVFiQyxFQUFBQSxvQkFBb0IsRUFBRSw2QkFSVDtBQVNiQyxFQUFBQSx5QkFBeUIsRUFBRSxnQ0FUZDtBQVViVCxFQUFBQSxtQkFBbUIsRUFBRSw4QkFWUjtBQVdiQyxFQUFBQSxjQUFjLEVBQUUsMkJBWEg7QUFZYkMsRUFBQUEsZ0JBQWdCLEVBQUUsNkJBWkw7QUFhYlEsRUFBQUEsc0JBQXNCLEVBQUU7QUFiWCxDQUFmOztBQ0FPLE1BQU1DLGFBQWEsR0FBRyxzREFBdEI7QUFFQSxNQUFNQyxVQUFVLEdBQUcsd0lBQW5CO0FBRUEsTUFBTUMsYUFBYSxHQUFHLDBCQUF0Qjs7QUNBQSxTQUFTQyx1QkFBVCxDQUFpQztBQUFFN0YsRUFBQUE7QUFBRixDQUFqQyxFQUE0QztBQUNqRCxRQUFNOEYsZUFBZSxHQUFHLElBQUlDLE1BQUosQ0FBV0osVUFBWCxDQUF4Qjs7QUFFQSxNQUFJRyxlQUFlLENBQUNFLElBQWhCLENBQXFCaEcsS0FBckIsQ0FBSixFQUFpQztBQUMvQixXQUFPO0FBQ0xpRyxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3pCLHVCQUQzQjtBQUVMMEIsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDN0IsS0FGNUI7QUFHTDFKLE1BQUFBLE9BQU8sRUFBRTtBQUhKLEtBQVA7QUFLRCxHQU5ELE1BTU87QUFDTCxXQUFPO0FBQ0xxTCxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3pCLHVCQUQzQjtBQUVMMEIsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDNUIsT0FGNUI7QUFHTDNKLE1BQUFBLE9BQU8sRUFBRXdMLGtCQUFrQixDQUFDZjtBQUh2QixLQUFQO0FBS0Q7QUFDRjtBQUVNLFNBQVNnQixzQkFBVCxDQUFnQztBQUFFSixFQUFBQTtBQUFGLENBQWhDLEVBQW9EO0FBQ3pELFVBQVFBLGNBQVI7QUFDRSxTQUFLQyxlQUFlLENBQUN4QiwwQkFBckI7QUFDRSxhQUFPLElBQVA7O0FBQ0YsU0FBS3dCLGVBQWUsQ0FBQ3pCLHVCQUFyQjtBQUNFLGFBQU8sSUFBUDs7QUFDRixTQUFLeUIsZUFBZSxDQUFDdEIsbUNBQXJCO0FBQ0UsYUFBTyxJQUFQOztBQUNGLFNBQUtzQixlQUFlLENBQUNyQix1QkFBckI7QUFDRSxhQUFPLElBQVA7O0FBQ0YsU0FBS3FCLGVBQWUsQ0FBQ3BCLDBCQUFyQjtBQUNFLGFBQU8sSUFBUDs7QUFDRixTQUFLb0IsZUFBZSxDQUFDdkIsMEJBQXJCO0FBQ0UsYUFBTyxJQUFQOztBQUNGO0FBQ0UsYUFBTyxLQUFQO0FBZEo7QUFnQkQ7QUFDTSxTQUFTMkIsMEJBQVQsQ0FBb0M7QUFBRXJHLEVBQUFBO0FBQUYsQ0FBcEMsRUFBa0Q7QUFDdkQsUUFBTXNHLGtCQUFrQixHQUFHLElBQUlSLE1BQUosQ0FBV0wsYUFBWCxDQUEzQjs7QUFDQSxNQUFJYSxrQkFBa0IsQ0FBQ1AsSUFBbkIsQ0FBd0IvRixRQUF4QixDQUFKLEVBQXVDO0FBQ3JDLFdBQU87QUFDTGdHLE1BQUFBLGNBQWMsRUFBRUMsZUFBZSxDQUFDeEIsMEJBRDNCO0FBRUx5QixNQUFBQSxlQUFlLEVBQUVBLGdCQUFlLENBQUM3QixLQUY1QjtBQUdMMUosTUFBQUEsT0FBTyxFQUFFO0FBSEosS0FBUDtBQUtEOztBQUNELE1BQUksQ0FBQzJMLGtCQUFrQixDQUFDUCxJQUFuQixDQUF3Qi9GLFFBQXhCLENBQUwsRUFBd0M7QUFDdEMsV0FBTztBQUNMZ0csTUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUN4QiwwQkFEM0I7QUFFTHlCLE1BQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzVCLE9BRjVCO0FBR0wzSixNQUFBQSxPQUFPLEVBQUV3TCxrQkFBa0IsQ0FBQ2hCO0FBSHZCLEtBQVA7QUFLRDtBQUNGO0FBRU0sU0FBU29CLDBCQUFULENBQW9DO0FBQUVqTixFQUFBQTtBQUFGLENBQXBDLEVBQWtEO0FBQ3ZELFFBQU1rTixrQkFBa0IsR0FBRyxJQUFJVixNQUFKLENBQVdILGFBQVgsQ0FBM0I7O0FBRUEsTUFBSWEsa0JBQWtCLENBQUNULElBQW5CLENBQXdCek0sUUFBeEIsQ0FBSixFQUF1QztBQUNyQyxXQUFPO0FBQ0wwTSxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3ZCLDBCQUQzQjtBQUVMd0IsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDN0IsS0FGNUI7QUFHTDFKLE1BQUFBLE9BQU8sRUFBRTtBQUhKLEtBQVA7QUFLRCxHQU5ELE1BTU87QUFDTCxXQUFPO0FBQ0xxTCxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3ZCLDBCQUQzQjtBQUVMd0IsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDNUIsT0FGNUI7QUFHTDNKLE1BQUFBLE9BQU8sRUFBRXdMLGtCQUFrQixDQUFDZDtBQUh2QixLQUFQO0FBS0Q7QUFDRjtBQUVNLFNBQVNvQix1QkFBVCxDQUFpQztBQUFFM1AsRUFBQUE7QUFBRixDQUFqQyxFQUE0QztBQUNqRCxRQUFNK08sZUFBZSxHQUFHLElBQUlDLE1BQUosQ0FBV0osVUFBWCxDQUF4QjtBQUNBLFFBQU1jLGtCQUFrQixHQUFHLElBQUlWLE1BQUosQ0FBV0gsYUFBWCxDQUEzQjs7QUFFQSxNQUFJRSxlQUFlLENBQUNFLElBQWhCLENBQXFCalAsS0FBckIsQ0FBSixFQUFpQztBQUMvQixXQUFPO0FBQ0xrUCxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3RCLG1DQUQzQjtBQUVMdUIsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDN0IsS0FGNUI7QUFHTDFKLE1BQUFBLE9BQU8sRUFBRTtBQUhKLEtBQVA7QUFLRCxHQU5ELE1BTU8sSUFBSTZMLGtCQUFrQixDQUFDVCxJQUFuQixDQUF3QmpQLEtBQXhCLENBQUosRUFBb0M7QUFDekMsV0FBTztBQUNMa1AsTUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUN0QixtQ0FEM0I7QUFFTHVCLE1BQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzdCLEtBRjVCO0FBR0wxSixNQUFBQSxPQUFPLEVBQUU7QUFISixLQUFQO0FBS0QsR0FOTSxNQU1BO0FBQ0wsV0FBTztBQUNMcUwsTUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUN0QixtQ0FEM0I7QUFFTHVCLE1BQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzVCLE9BRjVCO0FBR0wzSixNQUFBQSxPQUFPLEVBQUV3TCxrQkFBa0IsQ0FBQ1o7QUFIdkIsS0FBUDtBQUtEO0FBQ0Y7QUFFTSxTQUFTbUIsbUJBQVQsQ0FBNkI7QUFBRTVQLEVBQUFBO0FBQUYsQ0FBN0IsRUFBd0M7QUFDN0MsTUFBSUEsS0FBSyxDQUFDK0QsTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUN0QixXQUFPO0FBQ0xtTCxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3JCLHVCQUQzQjtBQUVMc0IsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDNUIsT0FGNUI7QUFHTDNKLE1BQUFBLE9BQU8sRUFBRXdMLGtCQUFrQixDQUFDYjtBQUh2QixLQUFQO0FBS0QsR0FORCxNQU1PO0FBQ0wsV0FBTztBQUNMVSxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3JCLHVCQUQzQjtBQUVMc0IsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDN0IsS0FGNUI7QUFHTDFKLE1BQUFBLE9BQU8sRUFBRTtBQUhKLEtBQVA7QUFLRDtBQUNGO0FBRU0sU0FBU2dNLHFCQUFULENBQStCO0FBQUVDLEVBQUFBO0FBQUYsQ0FBL0IsRUFBeUM7QUFFOUMsUUFBTTtBQUFFNUcsSUFBQUEsUUFBRjtBQUFZRSxJQUFBQTtBQUFaLE1BQXVCMEcsSUFBN0I7QUFDRjs7QUFDRSxNQUFJNUcsUUFBUSxLQUFLLEVBQWIsSUFBbUJBLFFBQVEsS0FBS0UsT0FBcEMsRUFBNkM7QUFDM0MsV0FBTztBQUNMZ0csTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDNUIsT0FENUI7QUFFTDNKLE1BQUFBLE9BQU8sRUFBRXdMLGtCQUFrQixDQUFDWCxzQkFGdkI7QUFHTFEsTUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUNwQjtBQUgzQixLQUFQO0FBS0QsR0FORCxNQU1PO0FBQ0wsV0FBTztBQUNMcUIsTUFBQUEsZUFBZSxFQUFFQSxnQkFBZSxDQUFDN0IsS0FENUI7QUFFTDFKLE1BQUFBLE9BQU8sRUFBRSxFQUZKO0FBR0xxTCxNQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3BCO0FBSDNCLEtBQVA7QUFLRDtBQUNGOztBQ3RJRCxvQkFBZTtBQUNYZ0MsRUFBQUEsMEJBQTBCLEVBQUUsNEJBRGpCO0FBRVhDLEVBQUFBLHNCQUFzQixFQUFFLHdCQUZiO0FBR1hDLEVBQUFBLGFBQWEsRUFBRSxlQUhKO0FBSVhDLEVBQUFBLGFBQWEsRUFBRSxlQUpKO0FBTVhDLEVBQUFBLGlCQUFpQixFQUFFLG1CQU5SO0FBT1hDLEVBQUFBLGlCQUFpQixFQUFDLG1CQVBQO0FBU1hDLEVBQUFBLGVBQWUsRUFBRTtBQVROLENBQWY7O0FDQUEsaUJBQWU7QUFDYjtBQUNBQyxFQUFBQSxpQkFBaUIsRUFBRSxLQUZOO0FBR2I7QUFDQUMsRUFBQUEsZUFBZSxFQUFFLEtBSko7QUFLYkMsRUFBQUEsaUJBQWlCLEVBQUUsS0FMTjtBQU1iQyxFQUFBQSxlQUFlLEVBQUUsS0FOSjtBQU9iQyxFQUFBQSxlQUFlLEVBQUUsS0FQSjtBQU9XO0FBQ3hCQyxFQUFBQSxZQUFZLEVBQUUsS0FSRDtBQVNiO0FBQ0FDLEVBQUFBLG9CQUFvQixFQUFFLEtBVlQ7QUFXYkMsRUFBQUEsbUJBQW1CLEVBQUUsS0FYUjtBQVliQyxFQUFBQSx1QkFBdUIsRUFBQyxLQVpYO0FBYWJDLEVBQUFBLHVCQUF1QixFQUFDLEtBYlg7QUFjZjtBQUNFQyxFQUFBQSxrQkFBa0IsRUFBQyxLQWZOO0FBZ0JiQyxFQUFBQSxZQUFZLEVBQUMsS0FoQkE7QUFpQmJDLEVBQUFBLHFCQUFxQixFQUFFQyxNQUFNLElBQUk7QUFDL0IsUUFBSUEsTUFBTSxJQUFJLEdBQVYsSUFBaUJBLE1BQU0sSUFBSSxHQUEvQixFQUFvQztBQUNsQyxhQUFPLElBQVA7QUFDRDs7QUFDRCxXQUFPLEtBQVA7QUFDRDtBQXRCWSxDQUFmOztBQ1NPLFNBQVNDLGdCQUFULENBQTBCO0FBQUVsQyxFQUFBQSxjQUFGO0FBQWtCbFAsRUFBQUEsS0FBbEI7QUFBeUJ4QixFQUFBQSxLQUF6QjtBQUErQnNSLEVBQUFBO0FBQS9CLENBQTFCLEVBQWlFO0FBRXRFLE1BQUl1QixVQUFVLEdBQUcsSUFBakI7O0FBQ0EsVUFBUW5DLGNBQVI7QUFDRSxTQUFLb0MsZUFBYSxDQUFDNUQsdUJBQW5CO0FBQ0UyRCxNQUFBQSxVQUFVLEdBQUdFLHVCQUFBLENBQW9DO0FBQy9DdEksUUFBQUEsS0FBSyxFQUFFako7QUFEd0MsT0FBcEMsQ0FBYjtBQUdBOztBQUNGLFNBQUtzUixlQUFhLENBQUN6RCxtQ0FBbkI7QUFDRXdELE1BQUFBLFVBQVUsR0FBR0UsdUJBQUEsQ0FBb0M7QUFDL0N2UixRQUFBQTtBQUQrQyxPQUFwQyxDQUFiO0FBR0E7O0FBQ0YsU0FBS3NSLGVBQWEsQ0FBQzNELDBCQUFuQjtBQUNFMEQsTUFBQUEsVUFBVSxHQUFHRSwwQkFBQSxDQUF1QztBQUNsRHJJLFFBQUFBLFFBQVEsRUFBRWxKO0FBRHdDLE9BQXZDLENBQWI7QUFHQTs7QUFDRixTQUFLc1IsZUFBYSxDQUFDMUQsMEJBQW5CO0FBQ0V5RCxNQUFBQSxVQUFVLEdBQUdFLDBCQUFBLENBQXVDO0FBQ2xEL08sUUFBQUEsUUFBUSxFQUFFeEM7QUFEd0MsT0FBdkMsQ0FBYjtBQUdBOztBQUNGLFNBQUtzUixlQUFhLENBQUN4RCx1QkFBbkI7QUFDRXVELE1BQUFBLFVBQVUsR0FBR0UsbUJBQUEsQ0FBZ0M7QUFBRXZSLFFBQUFBO0FBQUYsT0FBaEMsQ0FBYjtBQUNBOztBQUNGLFNBQUtzUixlQUFhLENBQUN2RCwwQkFBbkI7QUFFRXNELE1BQUFBLFVBQVUsR0FBR0UscUJBQUEsQ0FBa0M7QUFBRXpCLFFBQUFBO0FBQUYsT0FBbEMsQ0FBYjtBQUNBO0FBM0JKOztBQWdDQSxTQUFPO0FBQUVwUixJQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ2dTLGlCQUFwQjtBQUF1QyxPQUFHaUI7QUFBMUMsR0FBUDtBQUNEO0FBTU0sU0FBU0cseUJBQVQsQ0FBbUM7QUFBRXRDLEVBQUFBO0FBQUYsQ0FBbkMsRUFBdUQ7QUFDNUQsU0FBTztBQUFFeFEsSUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUM0UixzQkFBcEI7QUFBNENkLElBQUFBO0FBQTVDLEdBQVA7QUFDRDtBQU9NLFNBQVN1QyxnQkFBVCxDQUEwQjtBQUFFTixFQUFBQSxNQUFNLEdBQUc7QUFBWCxDQUExQixFQUEwQztBQUUvQyxVQUFRQSxNQUFSO0FBQ0UsU0FBS08sVUFBVSxDQUFDcEIsaUJBQWhCO0FBRUUsYUFBTztBQUNMNVIsUUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUMrUixpQkFEYjtBQUVMakIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUNuQixtQkFGM0I7QUFHTG5LLFFBQUFBLE9BQU8sRUFBRXdMLGtCQUFrQixDQUFDckIsbUJBSHZCO0FBSUxvQixRQUFBQSxlQUFlLEVBQUV1QyxnQkFBZ0IsQ0FBQ25FO0FBSjdCLE9BQVA7O0FBTUYsU0FBS2tFLFVBQVUsQ0FBQ2YsWUFBaEI7QUFDRSxhQUFPO0FBQ0xqUyxRQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQytSLGlCQURiO0FBRUxqQixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3pCLHVCQUYzQjtBQUdMN0osUUFBQUEsT0FBTyxFQUFFd0wsa0JBQWtCLENBQUNmLGFBSHZCO0FBSUxjLFFBQUFBLGVBQWUsRUFBRXVDLGdCQUFnQixDQUFDbkU7QUFKN0IsT0FBUDs7QUFNRixTQUFLa0UsVUFBVSxDQUFDaEIsZUFBaEI7QUFDRSxhQUFPO0FBQ0xoUyxRQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQytSLGlCQURiO0FBRUxqQixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3hCLDBCQUYzQjtBQUdMOUosUUFBQUEsT0FBTyxFQUFFd0wsa0JBQWtCLENBQUNoQixnQkFIdkI7QUFJTGUsUUFBQUEsZUFBZSxFQUFFdUMsZ0JBQWdCLENBQUNuRTtBQUo3QixPQUFQOztBQU1GLFNBQUtrRSxVQUFVLENBQUNqQixlQUFoQjtBQUNFLGFBQU87QUFDTC9SLFFBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDK1IsaUJBRGI7QUFFTGpCLFFBQUFBLGNBQWMsRUFBRUMsZUFBZSxDQUFDdkIsMEJBRjNCO0FBR0wvSixRQUFBQSxPQUFPLEVBQUV3TCxrQkFBa0IsQ0FBQ2QsZ0JBSHZCO0FBSUxhLFFBQUFBLGVBQWUsRUFBRXVDLGdCQUFnQixDQUFDbkU7QUFKN0IsT0FBUDs7QUFNRixTQUFLa0UsVUFBVSxDQUFDbEIsaUJBQWhCO0FBQ0UsYUFBTztBQUNMOVIsUUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUMrUixpQkFEYjtBQUVMakIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUNqQixnQkFGM0I7QUFHTHJLLFFBQUFBLE9BQU8sRUFBRXdMLGtCQUFrQixDQUFDbkIsZ0JBSHZCO0FBSUxrQixRQUFBQSxlQUFlLEVBQUV1QyxnQkFBZ0IsQ0FBQ25FO0FBSjdCLE9BQVA7O0FBTUYsU0FBS2tFLFVBQVUsQ0FBQ2Qsb0JBQWhCO0FBRUUsYUFBTztBQUNMbFMsUUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUMrUixpQkFEYjtBQUVMakIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUNoQixvQkFGM0I7QUFHTHRLLFFBQUFBLE9BQU8sRUFBRXdMLGtCQUFrQixDQUFDbEIsb0JBSHZCO0FBSUxpQixRQUFBQSxlQUFlLEVBQUV1QyxnQkFBZ0IsQ0FBQ25FO0FBSjdCLE9BQVA7O0FBTUYsU0FBS2tFLFVBQVUsQ0FBQ25CLGVBQWhCO0FBQ0UsYUFBTztBQUNMN1IsUUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUMrUixpQkFEYjtBQUVMakIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUNsQixjQUYzQjtBQUdMcEssUUFBQUEsT0FBTyxFQUFFd0wsa0JBQWtCLENBQUNwQixjQUh2QjtBQUlMbUIsUUFBQUEsZUFBZSxFQUFFdUMsZ0JBQWdCLENBQUNuRTtBQUo3QixPQUFQOztBQU1GLFNBQUtrRSxVQUFVLENBQUNiLG1CQUFoQjtBQUNFLGFBQU87QUFDTG5TLFFBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDK1IsaUJBRGI7QUFFTGpCLFFBQUFBLGNBQWMsRUFBRUMsZUFBZSxDQUFDckIsdUJBRjNCO0FBR0xqSyxRQUFBQSxPQUFPLEVBQUV3TCxrQkFBa0IsQ0FBQ2Isb0JBSHZCO0FBSUxZLFFBQUFBLGVBQWUsRUFBRXVDLGdCQUFnQixDQUFDbkU7QUFKN0IsT0FBUDs7QUFNRixTQUFLa0UsVUFBVSxDQUFDWix1QkFBaEI7QUFDRSxhQUFPO0FBQ0xwUyxRQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQytSLGlCQURiO0FBRUxqQixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3RCLG1DQUYzQjtBQUdMaEssUUFBQUEsT0FBTyxFQUFFd0wsa0JBQWtCLENBQUNaLHlCQUh2QjtBQUlMVyxRQUFBQSxlQUFlLEVBQUV1QyxnQkFBZ0IsQ0FBQ25FO0FBSjdCLE9BQVA7O0FBTUYsU0FBS2tFLFVBQVUsQ0FBQ1gsdUJBQWhCO0FBQ0UsYUFBTztBQUNMclMsUUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUMrUixpQkFEYjtBQUVMakIsUUFBQUEsY0FBYyxFQUFFQyxlQUFlLENBQUNmLHVCQUYzQjtBQUdMdkssUUFBQUEsT0FBTyxFQUFFd0wsa0JBQWtCLENBQUNqQix1QkFIdkI7QUFJTGdCLFFBQUFBLGVBQWUsRUFBRXVDLGdCQUFnQixDQUFDbkU7QUFKN0IsT0FBUDs7QUFNQSxTQUFLa0UsVUFBVSxDQUFDVixrQkFBaEI7QUFDQSxhQUFPO0FBQ0x0UyxRQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQytSLGlCQURiO0FBRUxqQixRQUFBQSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ3BCLDBCQUYzQjtBQUdMbEssUUFBQUEsT0FBTyxFQUFFd0wsa0JBQWtCLENBQUNYLHNCQUh2QjtBQUlMVSxRQUFBQSxlQUFlLEVBQUV1QyxnQkFBZ0IsQ0FBQ25FO0FBSjdCLE9BQVA7O0FBTUY7QUFDRSxhQUFPLElBQVA7QUFqRko7QUFtRkQ7O0FDOUlNLFNBQVNvRSxZQUFULENBQXNCO0FBQUU5SCxFQUFBQSxRQUFGO0FBQVk5SixFQUFBQTtBQUFaLENBQXRCLEVBQTJDO0FBRWhELFNBQU87QUFDTHRCLElBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDMkosYUFEYjtBQUVMOEIsSUFBQUEsT0FBTyxFQUFFO0FBQ1BDLE1BQUFBLFFBRE87QUFFUDlKLE1BQUFBO0FBRk87QUFGSixHQUFQO0FBT0Q7QUFFTSxlQUFlNlIsS0FBZixDQUFxQjtBQUFFclMsRUFBQUEsUUFBRjtBQUFZaEIsRUFBQUEsS0FBWjtBQUFtQnNULEVBQUFBO0FBQW5CLENBQXJCLEVBQXdEO0FBQzdELE1BQUk7QUFDRixVQUFNO0FBQUV4SSxNQUFBQSxlQUFGO0FBQW1CSixNQUFBQTtBQUFuQixRQUFnQzFLLEtBQXRDO0FBQ0FnQixJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUM0SjtBQUFwQixLQUFELENBQVI7QUFDQSxVQUFNM0UsUUFBUSxHQUFHLE1BQU1uRyxLQUFLLENBQUUsYUFBRixFQUFnQjtBQUMxQzZVLE1BQUFBLE9BQU8sRUFBRTtBQUNQLHVCQUFlLGtCQURSO0FBRVAsd0NBQWdDLEdBRnpCO0FBR1BDLFFBQUFBLGFBQWEsRUFBRyxTQUFRQyxJQUFJLENBQUUsR0FBRTNJLGVBQWdCLElBQUdKLFFBQVMsRUFBaEMsQ0FBbUM7QUFIeEQsT0FEaUM7QUFNMUNnSixNQUFBQSxNQUFNLEVBQUU7QUFOa0MsS0FBaEIsQ0FBNUI7QUFTQSxVQUFNQyxNQUFNLEdBQUcsTUFBTTlPLFFBQVEsQ0FBQ0UsSUFBVCxFQUFyQjs7QUFFQSxRQUFJRixRQUFRLENBQUM4TixNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBRTNCLFlBQU07QUFBRTVILFFBQUFBLEtBQUY7QUFBUy9HLFFBQUFBLFFBQVQ7QUFBbUJ5RyxRQUFBQTtBQUFuQixVQUE2QmtKLE1BQW5DO0FBRUEzUyxNQUFBQSxRQUFRLENBQUM7QUFBRWQsUUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUM2SixhQUFwQjtBQUFtQ3NCLFFBQUFBLEtBQW5DO0FBQTBDL0csUUFBQUEsUUFBMUM7QUFBb0R5RyxRQUFBQTtBQUFwRCxPQUFELENBQVI7QUFDQW1KLE1BQUFBLE1BQU0sQ0FBQ3ZQLFlBQVAsQ0FBb0JzQixPQUFwQixDQUNFLFFBREYsRUFFRXhCLElBQUksQ0FBQ3lCLFNBQUwsQ0FBZTtBQUNibUYsUUFBQUEsS0FEYTtBQUViL0csUUFBQUEsUUFGYTtBQUdieUcsUUFBQUE7QUFIYSxPQUFmLENBRkY7QUFRRCxLQWJELE1BYU8sSUFBSTVGLFFBQVEsQ0FBQzhOLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDbEMsWUFBTTtBQUFFa0IsUUFBQUE7QUFBRixVQUFhRixNQUFuQjtBQUVBRSxNQUFBQSxNQUFNLENBQUN4SyxPQUFQLENBQWdCL0YsS0FBRCxJQUFXO0FBQ3hCZ1EsUUFBQUEsWUFBWSxDQUNWTCxnQkFBZ0IsQ0FBQztBQUNmTixVQUFBQSxNQUFNLEVBQUVyUDtBQURPLFNBQUQsQ0FETixDQUFaO0FBS0QsT0FORDtBQU9ELEtBVk0sTUFVQTtBQUVMLFlBQU0sSUFBSTVDLEtBQUosQ0FBVSxjQUFWLENBQU47QUFDRDtBQUNGLEdBekNELENBeUNFLE9BQU80QyxLQUFQLEVBQWM7QUFDZDtBQUNBdEMsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDOEosWUFBcEI7QUFBa0MyQixNQUFBQSxPQUFPLEVBQUU7QUFBRS9ILFFBQUFBO0FBQUY7QUFBM0MsS0FBRCxDQUFSO0FBQ0Q7QUFDRjtBQUVNLGVBQWV3USxNQUFmLENBQXNCO0FBQUU5UyxFQUFBQSxRQUFGO0FBQVlzUyxFQUFBQSxZQUFaO0FBQTBCdFQsRUFBQUE7QUFBMUIsQ0FBdEIsRUFBeUQ7QUFDOURnQixFQUFBQSxRQUFRLENBQUM7QUFBRWQsSUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUNrSztBQUFwQixHQUFELENBQVI7QUFDQSxRQUFNO0FBQUVXLElBQUFBLEtBQUY7QUFBU0MsSUFBQUEsUUFBVDtBQUFtQjFHLElBQUFBO0FBQW5CLE1BQWdDaEUsS0FBdEM7O0FBQ0EsTUFBSTtBQUNGLFVBQU02RSxRQUFRLEdBQUcsTUFBTW5HLEtBQUssQ0FBRSxjQUFGLEVBQWlCO0FBQzNDcVYsTUFBQUEsSUFBSSxFQUFFNVAsSUFBSSxDQUFDeUIsU0FBTCxDQUFlO0FBQUU4RSxRQUFBQSxRQUFGO0FBQVlELFFBQUFBLEtBQVo7QUFBbUJ6RyxRQUFBQTtBQUFuQixPQUFmLENBRHFDO0FBRTNDdVAsTUFBQUEsT0FBTyxFQUFFO0FBQ1BTLFFBQUFBLFdBQVcsRUFBRSxrQkFETjtBQUVQQyxRQUFBQSxNQUFNLEVBQUU7QUFGRCxPQUZrQztBQU0zQ1AsTUFBQUEsTUFBTSxFQUFFO0FBTm1DLEtBQWpCLENBQTVCO0FBUUEsVUFBTUMsTUFBTSxHQUFHLE1BQU05TyxRQUFRLENBQUNFLElBQVQsRUFBckI7O0FBQ0EsUUFBSUYsUUFBUSxDQUFDOE4sTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQixZQUFNO0FBQUU1SCxRQUFBQSxLQUFGO0FBQVMvRyxRQUFBQSxRQUFUO0FBQW1CeUcsUUFBQUE7QUFBbkIsVUFBNkJrSixNQUFuQztBQUVBM1MsTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDbUssY0FBcEI7QUFBb0NnQixRQUFBQSxLQUFwQztBQUEyQy9HLFFBQUFBLFFBQTNDO0FBQXFEeUcsUUFBQUE7QUFBckQsT0FBRCxDQUFSO0FBRUFtSixNQUFBQSxNQUFNLENBQUN2UCxZQUFQLENBQW9Cc0IsT0FBcEIsQ0FDRSxRQURGLEVBRUV4QixJQUFJLENBQUN5QixTQUFMLENBQWU7QUFDYm1GLFFBQUFBLEtBRGE7QUFFYi9HLFFBQUFBLFFBRmE7QUFHYnlHLFFBQUFBO0FBSGEsT0FBZixDQUZGO0FBUUQsS0FiRCxNQWFPLElBQUk1RixRQUFRLENBQUM4TixNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQ2xDO0FBQ0EsWUFBTTtBQUFFa0IsUUFBQUE7QUFBRixVQUFhRixNQUFuQjtBQUNBRSxNQUFBQSxNQUFNLENBQUN4SyxPQUFQLENBQWdCL0YsS0FBRCxJQUFXO0FBQ3hCZ1EsUUFBQUEsWUFBWSxDQUNWTCxnQkFBZ0IsQ0FBQztBQUNmTixVQUFBQSxNQUFNLEVBQUVyUDtBQURPLFNBQUQsQ0FETixDQUFaO0FBS0QsT0FORDtBQU9ELEtBVk0sTUFVQTtBQUNMLFlBQU0sSUFBSTVDLEtBQUosQ0FBVSxlQUFWLENBQU47QUFDRDtBQUNGLEdBcENELENBb0NFLE9BQU80QyxLQUFQLEVBQWM7QUFFZDtBQUNBdEMsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDb0ssYUFBcEI7QUFBbUNxQixNQUFBQSxPQUFPLEVBQUU7QUFBRS9ILFFBQUFBO0FBQUY7QUFBNUMsS0FBRCxDQUFSO0FBQ0Q7QUFDRjtBQUNNLFNBQVM0USxNQUFULEdBQWtCO0FBQ3ZCTixFQUFBQSxNQUFNLENBQUN2UCxZQUFQLENBQW9COFAsVUFBcEIsQ0FBK0IsUUFBL0I7QUFDQSxTQUFPO0FBQUVqVSxJQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ2lLO0FBQXBCLEdBQVA7QUFDRDtBQUNNLGVBQWV1SyxjQUFmLENBQThCO0FBQUVwVCxFQUFBQSxRQUFGO0FBQVloQixFQUFBQSxLQUFaO0FBQW1Cc1QsRUFBQUEsWUFBbkI7QUFBaUN2SSxFQUFBQTtBQUFqQyxDQUE5QixFQUF3RTtBQUM3RS9KLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ3FLO0FBQXBCLEdBQUQsQ0FBUjs7QUFDQSxNQUFJO0FBQ0YsVUFBTTtBQUFFVyxNQUFBQSxPQUFGO0FBQVdGLE1BQUFBO0FBQVgsUUFBd0IxSyxLQUE5QjtBQUNBO0FBQ0EsVUFBTTZFLFFBQVEsR0FBRyxNQUFNbkcsS0FBSyxDQUFFLEdBQUUyViwyQkFBUSxrQkFBWixFQUErQjtBQUN6RFgsTUFBQUEsTUFBTSxFQUFFLEtBRGlEO0FBRXpESyxNQUFBQSxJQUFJLEVBQUU1UCxJQUFJLENBQUN5QixTQUFMLENBQWU7QUFDbkJnRixRQUFBQSxPQURtQjtBQUVuQkYsUUFBQUEsUUFGbUI7QUFHbkJLLFFBQUFBO0FBSG1CLE9BQWY7QUFGbUQsS0FBL0IsQ0FBNUI7QUFTQSxVQUFNNEksTUFBTSxHQUFHLE1BQU05TyxRQUFRLENBQUNFLElBQVQsRUFBckI7O0FBQ0EsUUFBSUYsUUFBUSxDQUFDOE4sTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQixZQUFNO0FBQUU1SCxRQUFBQSxLQUFGO0FBQVMvRyxRQUFBQSxRQUFUO0FBQW1CeUcsUUFBQUE7QUFBbkIsVUFBNkJrSixNQUFuQztBQUNBO0FBQ0EzUyxNQUFBQSxRQUFRLENBQUM7QUFDUGQsUUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUNzSyx1QkFEWDtBQUVQYSxRQUFBQSxLQUZPO0FBR1AvRyxRQUFBQSxRQUhPO0FBSVB5RyxRQUFBQSxLQUpPO0FBS1BwRixRQUFBQSxPQUFPLEVBQUc7QUFMSCxPQUFELENBQVI7QUFRQXVPLE1BQUFBLE1BQU0sQ0FBQ3ZQLFlBQVAsQ0FBb0JzQixPQUFwQixDQUNFLFFBREYsRUFFRXhCLElBQUksQ0FBQ3lCLFNBQUwsQ0FBZTtBQUNibUYsUUFBQUEsS0FEYTtBQUViL0csUUFBQUEsUUFGYTtBQUdieUcsUUFBQUE7QUFIYSxPQUFmLENBRkY7QUFRRCxLQW5CRCxNQW1CTyxJQUFJNUYsUUFBUSxDQUFDOE4sTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNO0FBQUVrQixRQUFBQTtBQUFGLFVBQWFGLE1BQW5CO0FBQ0E7QUFDQUUsTUFBQUEsTUFBTSxDQUFDeEssT0FBUCxDQUFnQi9GLEtBQUQsSUFBVztBQUN4QmdRLFFBQUFBLFlBQVksQ0FDVkwsZ0JBQWdCLENBQUM7QUFDZk4sVUFBQUEsTUFBTSxFQUFFclA7QUFETyxTQUFELENBRE4sQ0FBWjtBQUtELE9BTkQ7QUFPRCxLQVZNLE1BVUEsSUFBSXVCLFFBQVEsQ0FBQzhOLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDbEMsWUFBTTtBQUFFclAsUUFBQUE7QUFBRixVQUFZcVEsTUFBbEI7QUFFQTNTLE1BQUFBLFFBQVEsQ0FBQztBQUNQZCxRQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ3VLLHNCQURYO0FBRVA3RyxRQUFBQTtBQUZPLE9BQUQsQ0FBUjtBQUlELEtBUE0sTUFPQTtBQUNMLFlBQU0sSUFBSTVDLEtBQUosQ0FBVSwwQkFBVixDQUFOO0FBQ0Q7QUFDRixHQXBERCxDQW9ERSxPQUFPNEMsS0FBUCxFQUFjO0FBQ2R0QyxJQUFBQSxRQUFRLENBQUM7QUFDUGQsTUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUN1SyxzQkFEWDtBQUVQa0IsTUFBQUEsT0FBTyxFQUFFO0FBQUUvSCxRQUFBQTtBQUFGO0FBRkYsS0FBRCxDQUFSO0FBSUQ7QUFDRjtBQUVNLGVBQWVnUixjQUFmLENBQThCO0FBQUV0VCxFQUFBQSxRQUFGO0FBQVloQixFQUFBQSxLQUFaO0FBQW1Cc1QsRUFBQUE7QUFBbkIsQ0FBOUIsRUFBaUU7QUFDdEU7O0FBQ0EsTUFBSTtBQUNGdFMsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDd0s7QUFBcEIsS0FBRCxDQUFSO0FBQ0EsVUFBTTtBQUFFSyxNQUFBQTtBQUFGLFFBQVl6SyxLQUFsQjtBQUNBLFVBQU02RSxRQUFRLEdBQUcsTUFBTW5HLEtBQUssQ0FBRSx5QkFBRixFQUE0QjtBQUN0RGdWLE1BQUFBLE1BQU0sRUFBRSxNQUQ4QztBQUV0REssTUFBQUEsSUFBSSxFQUFFNVAsSUFBSSxDQUFDeUIsU0FBTCxDQUFlO0FBQUU2RSxRQUFBQTtBQUFGLE9BQWY7QUFGZ0QsS0FBNUIsQ0FBNUI7QUFJQTs7QUFFQSxRQUFJNUYsUUFBUSxDQUFDOE4sTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQixZQUFNZ0IsTUFBTSxHQUFHLE1BQU05TyxRQUFRLENBQUNFLElBQVQsRUFBckI7QUFDQTtBQUNBL0QsTUFBQUEsUUFBUSxDQUFDO0FBQ1BkLFFBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDeUssMkJBRFg7QUFFUFUsUUFBQUEsS0FBSyxFQUFFNEksTUFBTSxDQUFDNUksS0FGUDtBQUdQMUYsUUFBQUEsT0FBTyxFQUFHLGlEQUFnRG9GLEtBQU07QUFIekQsT0FBRCxDQUFSO0FBS0QsS0FSRCxNQVFPLElBQUk1RixRQUFRLENBQUM4TixNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQ2xDLFlBQU1nQixNQUFNLEdBQUcsTUFBTTlPLFFBQVEsQ0FBQ0UsSUFBVCxFQUFyQjtBQUNBO0FBQ0EsWUFBTTtBQUFFOE8sUUFBQUE7QUFBRixVQUFhRixNQUFuQjtBQUNBRSxNQUFBQSxNQUFNLENBQUN4SyxPQUFQLENBQWdCL0YsS0FBRCxJQUFXO0FBQ3hCZ1EsUUFBQUEsWUFBWSxDQUNWTCxnQkFBZ0IsQ0FBQztBQUNmTixVQUFBQSxNQUFNLEVBQUVyUDtBQURPLFNBQUQsQ0FETixDQUFaO0FBS0QsT0FORDtBQU9ELEtBWE0sTUFXQSxJQUFJdUIsUUFBUSxDQUFDOE4sTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUNsQyxZQUFNZ0IsTUFBTSxHQUFHLE1BQU05TyxRQUFRLENBQUNFLElBQVQsRUFBckI7QUFDQTtBQUNBLFlBQU07QUFBRXpCLFFBQUFBO0FBQUYsVUFBWXFRLE1BQWxCO0FBQ0E7QUFDQTNTLE1BQUFBLFFBQVEsQ0FBQztBQUNQZCxRQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQzBLLDBCQURYO0FBRVBoSCxRQUFBQTtBQUZPLE9BQUQsQ0FBUjtBQUlELEtBVE0sTUFTQTtBQUNMLFlBQU0sSUFBSTVDLEtBQUosQ0FBVSwwQkFBVixDQUFOO0FBQ0Q7QUFDRixHQXhDRCxDQXdDRSxPQUFPNEMsS0FBUCxFQUFjO0FBRWQ7QUFDQXRDLElBQUFBLFFBQVEsQ0FBQztBQUNQZCxNQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQzBLLDBCQURYO0FBRVBlLE1BQUFBLE9BQU8sRUFBRTtBQUFFL0gsUUFBQUE7QUFBRjtBQUZGLEtBQUQsQ0FBUjtBQUlEO0FBQ0Y7QUFFTSxTQUFTaVIsZUFBVCxDQUF5QjtBQUFFeEosRUFBQUE7QUFBRixDQUF6QixFQUFvQztBQUN6QyxTQUFPO0FBQ0w3SyxJQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQzJLLGtCQURiO0FBRUxRLElBQUFBO0FBRkssR0FBUDtBQUlEO0FBRU0sU0FBU3lKLHFCQUFULENBQStCO0FBQUVwUixFQUFBQSxJQUFGO0FBQVFwQyxFQUFBQTtBQUFSLENBQS9CLEVBQW1EO0FBQ3hEQSxFQUFBQSxRQUFRLENBQUM7QUFBRWQsSUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUM0Syx3QkFBcEI7QUFBOENwSCxJQUFBQTtBQUE5QyxHQUFELENBQVI7QUFDRDs7QUNuT0QsTUFBTXFSLEtBQUssR0FBRztBQUNaQyxFQUFBQSxJQUFJLEVBQUU7QUFDSkMsSUFBQUEsT0FBTyxFQUFFLE1BREw7QUFFSkMsSUFBQUEsbUJBQW1CLEVBQUUsY0FGakI7QUFHSkMsSUFBQUEsWUFBWSxFQUFFLFFBSFY7QUFJSkMsSUFBQUEsT0FBTyxFQUFDO0FBSko7QUFETSxDQUFkO0FBU08sU0FBU0MsaUJBQVQsR0FBNkI7QUFDbEMsUUFBTTtBQUFFL1UsSUFBQUE7QUFBRixNQUFZK0wsY0FBYyxFQUFoQztBQUNBLFFBQU07QUFBQzVLLElBQUFBO0FBQUQsTUFBZUQsV0FBVyxFQUFoQzs7QUFFQSxXQUFTOFQsV0FBVCxDQUFxQjlWLENBQXJCLEVBQXdCO0FBQ3RCQSxJQUFBQSxDQUFDLENBQUMrVixjQUFGO0FBQ0EsVUFBTTtBQUFFQyxNQUFBQTtBQUFGLFFBQVNoVyxDQUFDLENBQUNpVyxNQUFqQjtBQUNBaFUsSUFBQUEsVUFBVSxDQUFDO0FBQUNmLE1BQUFBLFlBQVksRUFBRyxJQUFHOFUsRUFBRyxFQUF0QjtBQUF3Qi9VLE1BQUFBLEtBQUssRUFBQztBQUE5QixLQUFELENBQVY7QUFDRDs7QUFFRCxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRWlWLE1BQUFBLFVBQVUsRUFBRTtBQUFkO0FBQVosS0FDRyxDQUFDcFYsS0FBSyxDQUFDZ0UsUUFBUCxJQUFtQixFQUFDLGFBQUQ7QUFBZSxJQUFBLFdBQVcsRUFBRWdSO0FBQTVCLElBRHRCLEVBRUdoVixLQUFLLENBQUNnRSxRQUFOLElBQ0MsRUFBQyxXQUFEO0FBQ0EsSUFBQSxVQUFVLEVBQUU3QyxVQURaO0FBRUUsSUFBQSxXQUFXLEVBQUU2VCxXQUZmO0FBR0UsSUFBQSxRQUFRLEVBQUVoVixLQUFLLENBQUNnRTtBQUhsQixJQUhKLEVBU0U7QUFBSSxJQUFBLEtBQUssRUFBRTtBQUFFcVIsTUFBQUEsTUFBTSxFQUFFO0FBQVY7QUFBWCxJQVRGLENBREY7QUFhRDtBQUVNLFNBQVNDLFdBQVQsQ0FBcUI7QUFBRU4sRUFBQUEsV0FBRjtBQUFlTyxFQUFBQSxRQUFmO0FBQXlCcFUsRUFBQUE7QUFBekIsQ0FBckIsRUFBMkQ7QUFDaEUsV0FBU3FVLFlBQVQsR0FBd0I7QUFFdEJyVSxJQUFBQSxVQUFVLENBQUM7QUFBQ2YsTUFBQUEsWUFBWSxFQUFDLEdBQWQ7QUFBa0JELE1BQUFBLEtBQUssRUFBQztBQUF4QixLQUFELENBQVY7QUFDQStULElBQUFBLE1BQU07QUFDUDs7QUFFRCxTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTFMsTUFBQUEsT0FBTyxFQUFFLE1BREo7QUFFTGMsTUFBQUEsVUFBVSxFQUFFLFFBRlA7QUFHTEMsTUFBQUEsYUFBYSxFQUFFO0FBSFY7QUFEVCxLQU9FO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTGYsTUFBQUEsT0FBTyxFQUFFLE1BREo7QUFFTGMsTUFBQUEsVUFBVSxFQUFFO0FBRlA7QUFEVCxLQU1FLGVBQ0U7QUFBSyxJQUFBLEdBQUcsRUFBRUUsR0FBVjtBQUFvQixJQUFBLEtBQUssRUFBRTtBQUFFQyxNQUFBQSxZQUFZLEVBQUU7QUFBaEI7QUFBM0IsSUFERixDQU5GLEVBVUUsZUFDRTtBQUFHLElBQUEsSUFBSSxFQUFDLEdBQVI7QUFBWSxJQUFBLE9BQU8sRUFBRUosWUFBckI7QUFBbUMsSUFBQSxFQUFFLEVBQUMsUUFBdEM7QUFBK0MsbUJBQVk7QUFBM0QsY0FERixDQVZGLENBUEYsRUF1QkU7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFSyxNQUFBQSxZQUFZLEVBQUU7QUFBaEI7QUFBWixrQkFBMkNOLFFBQTNDLENBdkJGLEVBd0JFLEVBQUMsSUFBRCxRQUNFLEVBQUMsUUFBRDtBQUFVLElBQUEsT0FBTyxFQUFFUCxXQUFuQjtBQUFnQyxJQUFBLEVBQUUsRUFBQztBQUFuQyx1QkFERixDQXhCRixDQURGO0FBZ0NEO0FBRU0sU0FBU2MsYUFBVCxDQUF1QjtBQUFFZCxFQUFBQTtBQUFGLENBQXZCLEVBQXdDO0FBQzdDLFNBQ0UsZUFDRTtBQUFLLElBQUEsS0FBSyxFQUFFUCxLQUFLLENBQUNDO0FBQWxCLEtBQ0U7QUFBRyxJQUFBLElBQUksRUFBQyxHQUFSO0FBQVksSUFBQSxPQUFPLEVBQUVNLFdBQXJCO0FBQWtDLElBQUEsRUFBRSxFQUFDLE9BQXJDO0FBQTZDLG1CQUFZO0FBQXpELGFBREYsRUFJRSxtQkFKRixFQUtFO0FBQUcsSUFBQSxJQUFJLEVBQUMsR0FBUjtBQUFZLElBQUEsT0FBTyxFQUFFQSxXQUFyQjtBQUFrQyxJQUFBLEVBQUUsRUFBQyxRQUFyQztBQUE4QyxtQkFBWTtBQUExRCxjQUxGLENBREYsQ0FERjtBQWFEOztBQzlGTSxTQUFTZSxXQUFULEdBQXVCO0FBQzVCLFFBQU0sQ0FBQ1IsUUFBRCxFQUFXUyxXQUFYLElBQTBCbkssR0FBUSxDQUFDLElBQUQsQ0FBeEM7QUFDQSxRQUFNLENBQUNkLEtBQUQsRUFBUWtMLFFBQVIsSUFBb0JwSyxHQUFRLENBQUMsSUFBRCxDQUFsQztBQUNBLFFBQU0sQ0FBQ3BCLEtBQUQsRUFBUXlMLFFBQVIsSUFBb0JySyxHQUFRLENBQUMsRUFBRCxDQUFsQztBQUNBLFFBQU07QUFBRTdMLElBQUFBLEtBQUY7QUFBUWdCLElBQUFBO0FBQVIsTUFBcUIrSyxjQUFjLEVBQXpDO0FBQ0F6QyxFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUVkLFFBQUlzSyxNQUFNLENBQUN2UCxZQUFQLENBQW9CQyxPQUFwQixDQUE0QixRQUE1QixDQUFKLEVBQTJDO0FBRXpDLFlBQU07QUFBRU4sUUFBQUEsUUFBRjtBQUFZK0csUUFBQUEsS0FBWjtBQUFtQk4sUUFBQUE7QUFBbkIsVUFBNkJ0RyxJQUFJLENBQUNDLEtBQUwsQ0FDakN3UCxNQUFNLENBQUN2UCxZQUFQLENBQW9CQyxPQUFwQixDQUE0QixRQUE1QixDQURpQyxDQUFuQztBQUdBMFIsTUFBQUEsV0FBVyxDQUFDaFMsUUFBRCxDQUFYO0FBQ0FpUyxNQUFBQSxRQUFRLENBQUNsTCxLQUFELENBQVI7QUFDQW1MLE1BQUFBLFFBQVEsQ0FBQ3pMLEtBQUQsQ0FBUjtBQUNEO0FBQ0YsR0FYUSxFQVdOLEVBWE0sQ0FBVDtBQWFBbkIsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJdEosS0FBSyxDQUFDK0ssS0FBVixFQUFpQjtBQUVmLFlBQU07QUFBRS9HLFFBQUFBLFFBQUY7QUFBWXlHLFFBQUFBLEtBQVo7QUFBbUJNLFFBQUFBO0FBQW5CLFVBQTRCL0ssS0FBbEMsQ0FGZTtBQUlmO0FBQ0E7O0FBQ0FnVyxNQUFBQSxXQUFXLENBQUNoUyxRQUFELENBQVg7QUFDQWlTLE1BQUFBLFFBQVEsQ0FBQ2xMLEtBQUQsQ0FBUjtBQUNBbUwsTUFBQUEsUUFBUSxDQUFDekwsS0FBRCxDQUFSO0FBQ0Q7QUFDRixHQVhRLEVBV04sQ0FBQ3pLLEtBQUQsQ0FYTSxDQUFUO0FBYUEsU0FBTztBQUFFdVYsSUFBQUEsUUFBRjtBQUFZeEssSUFBQUEsS0FBWjtBQUFtQk4sSUFBQUE7QUFBbkIsR0FBUDtBQUNEOztBQzdCTSxTQUFTMEwsb0JBQVQsR0FBZ0M7QUFFdkMsUUFBTTtBQUFDaFYsSUFBQUE7QUFBRCxNQUFjRCxXQUFXLEVBQS9CO0FBRUUsUUFBTTtBQUFFcVUsSUFBQUE7QUFBRixNQUFlUSxXQUFXLEVBQWhDOztBQUVBLFdBQVNmLFdBQVQsQ0FBcUI5VixDQUFyQixFQUF3QjtBQUN0QkEsSUFBQUEsQ0FBQyxDQUFDK1YsY0FBRjtBQUNBLFVBQU07QUFBRUMsTUFBQUE7QUFBRixRQUFTaFcsQ0FBQyxDQUFDaVcsTUFBakI7O0FBQ0EsUUFBSUksUUFBSixFQUFjO0FBRVpwVSxNQUFBQSxVQUFVLENBQUM7QUFBQ2pCLFFBQUFBLElBQUksRUFBQ04sV0FBVyxDQUFDQyxpQkFBbEI7QUFBcUNPLFFBQUFBLFlBQVksRUFBQyxXQUFsRDtBQUE4REQsUUFBQUEsS0FBSyxFQUFDO0FBQXBFLE9BQUQsQ0FBVjtBQUNELEtBSEQsTUFHTztBQUVMZ0IsTUFBQUEsVUFBVSxDQUFDO0FBQUNqQixRQUFBQSxJQUFJLEVBQUNOLFdBQVcsQ0FBQ0MsaUJBQWxCO0FBQXFDTyxRQUFBQSxZQUFZLEVBQUMsUUFBbEQ7QUFBMkRELFFBQUFBLEtBQUssRUFBQztBQUFqRSxPQUFELENBQVY7QUFDRDtBQUNGOztBQUNELFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMd1UsTUFBQUEsT0FBTyxFQUFFLE1BREo7QUFFTGMsTUFBQUEsVUFBVSxFQUFFLFFBRlA7QUFHTEMsTUFBQUEsYUFBYSxFQUFFO0FBSFY7QUFEVCxLQU9FLEVBQUMsSUFBRCxRQUNFLEVBQUMsUUFBRDtBQUFVLElBQUEsT0FBTyxFQUFFVixXQUFuQjtBQUFnQyxtQkFBWTtBQUE1QyxlQURGLENBUEYsQ0FERjtBQWdCRDs7QUNwQ0QsTUFBTVAsT0FBSyxHQUFHO0FBQ1oyQixFQUFBQSxLQUFLLEVBQUU7QUFDTEMsSUFBQUEsS0FBSyxFQUFFLEVBREY7QUFFTGhCLElBQUFBLE1BQU0sRUFBRSxFQUZIO0FBR0xpQixJQUFBQSxlQUFlLEVBQUUsT0FIWjtBQUlMQyxJQUFBQSxLQUFLLEVBQUUsT0FKRjtBQUtMQyxJQUFBQSxTQUFTLEVBQUMsUUFMTDtBQU1MQyxJQUFBQSxZQUFZLEVBQUMsRUFOUjtBQU9MOUIsSUFBQUEsT0FBTyxFQUFDLE1BUEg7QUFRTGMsSUFBQUEsVUFBVSxFQUFDLFFBUk47QUFTTGlCLElBQUFBLGNBQWMsRUFBQztBQVRWO0FBREssQ0FBZDtBQWFPLFNBQVNDLE9BQVQsQ0FBaUI7QUFBRVAsRUFBQUEsS0FBSyxHQUFDO0FBQVIsQ0FBakIsRUFBOEI7QUFDbkMsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUN6QixNQUFBQSxPQUFPLEVBQUMsTUFBVDtBQUFpQmMsTUFBQUEsVUFBVSxFQUFDO0FBQTVCO0FBQVosS0FDTSwwQkFETixFQUVFO0FBQUssSUFBQSxLQUFLLEVBQUVoQixPQUFLLENBQUMyQixLQUFsQjtBQUF5QixtQkFBWTtBQUFyQyxLQUFzREEsS0FBdEQsQ0FGRixDQURGO0FBTUQ7O0FDcEJNLFNBQVNRLFFBQVQsQ0FBa0JoVyxLQUFsQixFQUF5QjtBQUU5QixRQUFNO0FBQUV5VSxJQUFBQSxNQUFNLEdBQUcsRUFBWDtBQUNKZ0IsSUFBQUEsS0FBSyxHQUFHLEVBREo7QUFFSlEsSUFBQUEsSUFBSSxHQUFHLE1BRkg7QUFHSk4sSUFBQUEsS0FBSyxHQUFHLE9BSEo7QUFHWU8sSUFBQUEsT0FIWjtBQUdxQjVCLElBQUFBO0FBSHJCLE1BR3lCdFUsS0FIL0I7QUFLQSxTQUNFO0FBQUssSUFBQSxNQUFNLEVBQUV5VSxNQUFiO0FBQXFCLElBQUEsT0FBTyxFQUFDLFdBQTdCO0FBQXlDLElBQUEsS0FBSyxFQUFFZ0IsS0FBaEQ7QUFBd0QsSUFBQSxFQUFFLEVBQUVuQjtBQUE1RCxLQUNFO0FBQU0sSUFBQSxDQUFDLEVBQUMsaUJBQVI7QUFBMEIsSUFBQSxJQUFJLEVBQUUyQixJQUFoQztBQUFzQyxJQUFBLEVBQUUsRUFBRTNCO0FBQTFDLElBREYsRUFFRTtBQUNBLElBQUEsT0FBTyxFQUFFNEIsT0FEVDtBQUVBLElBQUEsRUFBRSxFQUFFNUIsRUFGSjtBQUdFLG1CQUFhQSxFQUhmO0FBSUUsSUFBQSxLQUFLLEVBQUVxQixLQUpUO0FBS0UsSUFBQSxDQUFDLEVBQUM7QUFMSixJQUZGLENBREY7QUFZRDs7QUNwQkQsTUFBTTlCLE9BQUssR0FBRztBQUNaNEIsRUFBQUEsS0FBSyxFQUFFLEVBREs7QUFFWmhCLEVBQUFBLE1BQU0sRUFBRSxFQUZJO0FBSVowQixFQUFBQSxNQUFNLEVBQUU7QUFKSSxDQUFkO0FBTU8sU0FBU0MsWUFBVCxDQUFzQjtBQUFFdFQsRUFBQUE7QUFBRixDQUF0QixFQUFzQztBQUMzQyxNQUFJQSxVQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDcEIsV0FBTyxFQUFDLFFBQUQsT0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJQSxVQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDM0IsV0FBTyxFQUFDLFVBQUQsT0FBUDtBQUNELEdBRk0sTUFFQSxJQUFJQSxVQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDM0IsV0FBTyxFQUFDLE9BQUQsT0FBUDtBQUNEOztBQUNELFNBQU8sRUFBQyxTQUFELE9BQVA7QUFDRDtBQUVNLFNBQVN1VCxRQUFULEdBQW9CO0FBQ3pCLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUd4QyxPQUFMO0FBQVk2QixNQUFBQSxlQUFlLEVBQUU7QUFBN0IsS0FEVDtBQUVFLG1CQUFZO0FBRmQsSUFERjtBQU1EO0FBRU0sU0FBU1ksU0FBVCxHQUFxQjtBQUMxQixTQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUUsRUFBRSxHQUFHekMsT0FBTDtBQUFZNkIsTUFBQUEsZUFBZSxFQUFFO0FBQTdCLEtBRFQ7QUFFRSxtQkFBWTtBQUZkLElBREY7QUFNRDtBQUVNLFNBQVNhLFVBQVQsR0FBc0I7QUFDM0IsU0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBRzFDLE9BQUw7QUFBWTZCLE1BQUFBLGVBQWUsRUFBRTtBQUE3QixLQURUO0FBRUUsbUJBQVk7QUFGZCxJQURGO0FBTUQ7QUFFTSxTQUFTYyxPQUFULEdBQW1CO0FBQ3hCLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxFQUFFLEdBQUczQyxPQUFMO0FBQVk2QixNQUFBQSxlQUFlLEVBQUU7QUFBN0IsS0FEVDtBQUVFLG1CQUFZO0FBRmQsSUFERjtBQU1EOztBQ25ETSxTQUFTZSxrQkFBVCxDQUE0QjtBQUFFclcsRUFBQUEsUUFBRjtBQUFZb0UsRUFBQUEsSUFBWjtBQUFrQnBDLEVBQUFBLE9BQWxCO0FBQTJCUSxFQUFBQSxNQUEzQjtBQUFrQzhULEVBQUFBO0FBQWxDLENBQTVCLEVBQTJFO0FBQ2xGO0FBQ0UsUUFBTTtBQUFFdFQsSUFBQUEsUUFBRjtBQUFZcUIsSUFBQUEsT0FBWjtBQUFxQnJGLElBQUFBLEtBQXJCO0FBQTRCeUssSUFBQUE7QUFBNUIsTUFBc0N6SCxPQUE1QztBQUNBLE1BQUk2QyxVQUFVLEdBQUcsRUFBakI7QUFDQSxNQUFJSyxVQUFVLEdBQUcsRUFBakI7O0FBQ0EsTUFBSTFDLE1BQUosRUFBWTtBQUNWO0FBQ0FxQyxJQUFBQSxVQUFVLEdBQUksR0FBRVQsSUFBSyxXQUFyQjtBQUNBYyxJQUFBQSxVQUFVLEdBQUksR0FBRWQsSUFBSyxJQUFHcEIsUUFBUyxXQUFqQztBQUNELEdBSkQsTUFJTztBQUNMO0FBQ0E2QixJQUFBQSxVQUFVLEdBQUksR0FBRVQsSUFBSyxtQkFBckI7QUFDQWMsSUFBQUEsVUFBVSxHQUFJLEdBQUVkLElBQUssSUFBR3BCLFFBQVMsbUJBQWpDO0FBQ0Q7O0FBRUR1VCxFQUFBQSxXQUFXLENBQUM7QUFBRTFSLElBQUFBLFVBQUY7QUFBYzdCLElBQUFBLFFBQWQ7QUFBd0JoQixJQUFBQSxPQUF4QjtBQUFnQ2hDLElBQUFBO0FBQWhDLEdBQUQsQ0FBWDs7QUFDQSxNQUFJcUUsT0FBTyxJQUFJQSxPQUFPLENBQUN6QixJQUFSLEtBQWdCLEVBQS9CLEVBQW1DO0FBQ2pDNFQsSUFBQUEsV0FBVyxDQUFDO0FBQUV0UixNQUFBQSxVQUFGO0FBQWNsQyxNQUFBQSxRQUFkO0FBQXdCcUIsTUFBQUEsT0FBeEI7QUFBZ0NyRSxNQUFBQSxRQUFoQztBQUF5Q3NXLE1BQUFBO0FBQXpDLEtBQUQsQ0FBWDtBQUNEO0FBQ0Y7O0FBRUQsU0FBU0MsV0FBVCxDQUFxQjtBQUFFMVIsRUFBQUEsVUFBRjtBQUFjN0IsRUFBQUEsUUFBZDtBQUF3QmhCLEVBQUFBLE9BQXhCO0FBQWdDaEMsRUFBQUE7QUFBaEMsQ0FBckIsRUFBaUU7QUFDL0QsUUFBTStCLFFBQVEsR0FBR29CLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUJ1QixVQUFyQixDQUFYLENBQWpCO0FBQ0EsTUFBSTBDLGVBQWUsR0FBRyxJQUF0Qjs7QUFDQSxNQUFJeEYsUUFBSixFQUFjO0FBQ1o7QUFDQSxVQUFNK0MsWUFBWSxHQUFHL0MsUUFBUSxDQUFDZ0QsU0FBVCxDQUFvQnBHLENBQUQsSUFBT0EsQ0FBQyxDQUFDcUUsUUFBRixLQUFlQSxRQUF6QyxDQUFyQjtBQUNDakIsSUFBQUEsUUFBUSxDQUFDaUQsTUFBVCxDQUFnQkYsWUFBaEIsRUFBOEIsQ0FBOUIsRUFBaUM5QyxPQUFqQztBQUNBcUIsSUFBQUEsWUFBWSxDQUFDc0IsT0FBYixDQUFxQkUsVUFBckIsRUFBaUMxQixJQUFJLENBQUN5QixTQUFMLENBQWU3QyxRQUFmLENBQWpDO0FBQ0EvQixJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUMwQyxnQkFBcEI7QUFBc0NTLE1BQUFBO0FBQXRDLEtBQUQsQ0FBUjtBQUNGLEdBTkQsTUFNTztBQUNMO0FBQ0F3RixJQUFBQSxlQUFlLEdBQUcsQ0FBQ3ZGLE9BQUQsQ0FBbEI7QUFDQXFCLElBQUFBLFlBQVksQ0FBQ3NCLE9BQWIsQ0FBcUJFLFVBQXJCLEVBQWlDMUIsSUFBSSxDQUFDeUIsU0FBTCxDQUFlMkMsZUFBZixDQUFqQztBQUNBdkgsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDMEMsZ0JBQXBCO0FBQXNDUyxNQUFBQSxRQUFRLEVBQUV3RjtBQUFoRCxLQUFELENBQVI7QUFDRDtBQUVGOztBQUVNLFNBQVNpUCxXQUFULENBQXFCO0FBQUV0UixFQUFBQSxVQUFGO0FBQWNiLEVBQUFBLE9BQWQ7QUFBc0JyRSxFQUFBQSxRQUF0QjtBQUErQnNXLEVBQUFBO0FBQS9CLENBQXJCLEVBQWlFO0FBQ3RFLFFBQU1wVSxRQUFRLEdBQUdpQixJQUFJLENBQUNDLEtBQUwsQ0FBV0MsWUFBWSxDQUFDQyxPQUFiLENBQXFCNEIsVUFBckIsQ0FBWCxDQUFqQjtBQUNBLE1BQUlDLGVBQWUsR0FBRyxFQUF0Qjs7QUFDQSxNQUFJakQsUUFBSixFQUFjO0FBRVppRCxJQUFBQSxlQUFlLEdBQUcsQ0FBQyxHQUFHakQsUUFBSixFQUFjbUMsT0FBZCxDQUFsQjtBQUNELEdBSEQsTUFHTztBQUVMYyxJQUFBQSxlQUFlLEdBQUcsQ0FBQ2QsT0FBRCxDQUFsQjtBQUNEOztBQUNELE1BQUdpUyxTQUFILEVBQWE7QUFFWCxVQUFNRyxPQUFPLEdBQUUsQ0FBQyxHQUFHdFIsZUFBSixFQUFvQjtBQUFDdkMsTUFBQUEsSUFBSSxFQUFDLHdEQUFOO0FBQ2xDdUQsTUFBQUEsU0FBUyxFQUFFdVEsSUFBSSxDQUFDQyxHQUFMLEVBRHVCO0FBQ1p6WCxNQUFBQSxJQUFJLEVBQUMsU0FETztBQUNHOEQsTUFBQUEsUUFBUSxFQUFDcUIsT0FBTyxDQUFDckIsUUFEcEI7QUFDNkI0VCxNQUFBQSxLQUFLLEVBQUM7QUFEbkMsS0FBcEIsQ0FBZjtBQUVBdlQsSUFBQUEsWUFBWSxDQUFDc0IsT0FBYixDQUFxQk8sVUFBckIsRUFBaUMvQixJQUFJLENBQUN5QixTQUFMLENBQWU2UixPQUFmLENBQWpDO0FBQ0F6VyxJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUN5QyxnQkFBcEI7QUFBc0NhLE1BQUFBLFFBQVEsRUFBRXVVO0FBQWhELEtBQUQsQ0FBUjtBQUVELEdBUEQsTUFRSTtBQUVGcFQsSUFBQUEsWUFBWSxDQUFDc0IsT0FBYixDQUFxQk8sVUFBckIsRUFBaUMvQixJQUFJLENBQUN5QixTQUFMLENBQWVPLGVBQWYsQ0FBakM7QUFDQW5GLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ3lDLGdCQUFwQjtBQUFzQ2EsTUFBQUEsUUFBUSxFQUFFaUQ7QUFBaEQsS0FBRCxDQUFSO0FBQ0Q7QUFHRjs7QUNoRU0sU0FBUzBSLG1CQUFULENBQTZCO0FBQUU3VyxFQUFBQSxRQUFGO0FBQVl5QyxFQUFBQSxNQUFaO0FBQW9CMkIsRUFBQUE7QUFBcEIsQ0FBN0IsRUFBeUQ7QUFDOUQsUUFBTW9DLGlCQUFpQixHQUFJLEdBQUVwQyxJQUFLLG1CQUFsQztBQUNBLFFBQU0wUyxlQUFlLEdBQUczVCxJQUFJLENBQUNDLEtBQUwsQ0FBV0MsWUFBWSxDQUFDQyxPQUFiLENBQXFCa0QsaUJBQXJCLENBQVgsQ0FBeEI7O0FBQ0EsTUFBSXNRLGVBQUosRUFBcUI7QUFDbkJBLElBQUFBLGVBQWUsQ0FBQ0MsUUFBaEIsQ0FBMEJ4SixDQUFELElBQU87QUFDOUI5SyxNQUFBQSxNQUFNLENBQUN1VSxJQUFQLENBQ0U3VCxJQUFJLENBQUN5QixTQUFMLENBQWU7QUFDYjVCLFFBQUFBLFFBQVEsRUFBRXVLLENBQUMsQ0FBQ3ZLLFFBREM7QUFFYnlHLFFBQUFBLEtBQUssRUFBRThELENBQUMsQ0FBQzlELEtBRkk7QUFHYnBGLFFBQUFBLE9BQU8sRUFBRWtKLENBQUMsQ0FBQ2xKLE9BSEU7QUFJYjhCLFFBQUFBLFNBQVMsRUFBRW9ILENBQUMsQ0FBQ3BILFNBSkE7QUFLYjhRLFFBQUFBLE9BQU8sRUFBRTFKLENBQUMsQ0FBQ3ZPLEtBTEU7QUFNYmtILFFBQUFBLE9BQU8sRUFBRTtBQU5JLE9BQWYsQ0FERjtBQVVELEtBWEQ7QUFZRDs7QUFDRDtBQUNEOztBQ2xCTSxTQUFTZ1IsdUJBQVQsQ0FBaUM7QUFBQzlTLEVBQUFBLElBQUQ7QUFBT3BDLEVBQUFBLE9BQVA7QUFBZWhDLEVBQUFBO0FBQWYsQ0FBakMsRUFBMEQ7QUFDN0QsUUFBTTtBQUFFZ0QsSUFBQUE7QUFBRixNQUFlaEIsT0FBckI7QUFDQSxNQUFJc0MsaUJBQWlCLEdBQUksR0FBRUYsSUFBSyxrQkFBaEM7QUFDQSxNQUFJbkMsY0FBYyxHQUFHa0IsSUFBSSxDQUFDQyxLQUFMLENBQVdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQmdCLGlCQUFyQixDQUFYLENBQXJCO0FBRUk7QUFDRSxRQUFNNlMsZ0JBQWdCLEdBQUdsVixjQUFjLENBQUNjLE1BQWYsQ0FBc0IsVUFBU3FFLE1BQVQsRUFBa0I7QUFDL0QsV0FBUUEsTUFBTSxDQUFDcEUsUUFBUCxLQUFvQkEsUUFBNUI7QUFBcUMsR0FEZCxDQUF6Qjs7QUFHRSxNQUFHbVUsZ0JBQWdCLENBQUM1UyxNQUFqQixHQUF3QixDQUEzQixFQUE2QjtBQUMzQjtBQUNBbEIsSUFBQUEsWUFBWSxDQUFDc0IsT0FBYixDQUFxQkwsaUJBQXJCLEVBQXdDbkIsSUFBSSxDQUFDeUIsU0FBTCxDQUFldVMsZ0JBQWYsQ0FBeEM7QUFDQW5YLElBQUFBLFFBQVEsQ0FBQztBQUNQZCxNQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQzRDLHVCQURYO0FBRVBTLE1BQUFBLGNBQWMsRUFBRWtWO0FBRlQsS0FBRCxDQUFSO0FBSUQsR0FQRCxNQVNJO0FBQ0Y7QUFDQTlULElBQUFBLFlBQVksQ0FBQzhQLFVBQWIsQ0FBd0I3TyxpQkFBeEI7QUFDQXRFLElBQUFBLFFBQVEsQ0FBQztBQUNMZCxNQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQzRDLHVCQURiO0FBRUxTLE1BQUFBLGNBQWMsRUFBRTtBQUZYLEtBQUQsQ0FBUjtBQUlFO0FBR0g7QUFHWjs7QUNYTSxTQUFTbVYsV0FBVCxHQUF1QjtBQUM1QixRQUFNO0FBQUVqWCxJQUFBQTtBQUFGLE1BQWlCRCxXQUFXLEVBQWxDO0FBQ0EsUUFBTTRMLFdBQVcsR0FBR2YsY0FBYyxFQUFsQztBQUNBLFFBQU07QUFBRS9ILElBQUFBO0FBQUYsTUFBZThJLFdBQVcsQ0FBQzlNLEtBQWpDO0FBQ0EsUUFBTSxDQUFDQSxLQUFELEVBQVFnQixRQUFSLElBQW9CNEwsaUJBQWlCLEVBQTNDO0FBQ0EsUUFBTTtBQUNKNUosSUFBQUEsT0FESTtBQUVKRCxJQUFBQSxRQUZJO0FBR0pJLElBQUFBLE1BSEk7QUFJSmtWLElBQUFBLEtBSkk7QUFLSjlVLElBQUFBLFdBTEk7QUFNSkwsSUFBQUEsUUFOSTtBQU9KUyxJQUFBQSxhQVBJO0FBUUpELElBQUFBLFVBUkk7QUFTSkQsSUFBQUEsTUFUSTtBQVVKUixJQUFBQTtBQVZJLE1BV0ZqRCxLQVhKO0FBYUFzSixFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkLFFBQUk3RixNQUFNLElBQUlDLFVBQVUsS0FBSyxDQUF6QixJQUE4Qk0sUUFBbEMsRUFBNEM7QUFDMUM2VCxNQUFBQSxtQkFBbUIsQ0FBQztBQUFFelMsUUFBQUEsSUFBSSxFQUFFcEIsUUFBUjtBQUFrQmhELFFBQUFBLFFBQWxCO0FBQTRCeUMsUUFBQUE7QUFBNUIsT0FBRCxDQUFuQjtBQUNEO0FBQ0YsR0FKUSxFQUlOLENBQUNBLE1BQUQsRUFBU0MsVUFBVCxFQUFxQk0sUUFBckIsQ0FKTSxDQUFUOztBQU1BLFdBQVNzVSxjQUFULENBQXdCcFosQ0FBeEIsRUFBMEI7QUFDeEIsVUFBTWdXLEVBQUUsR0FBRWhXLENBQUMsQ0FBQ3FaLGFBQUYsQ0FBZ0JyRCxFQUExQjtBQUNBLFVBQU1sUyxPQUFPLEdBQUdELFFBQVEsQ0FBQzlCLElBQVQsQ0FBZXRCLENBQUQsSUFBT0EsQ0FBQyxDQUFDcUUsUUFBRixLQUFla1IsRUFBcEMsQ0FBaEI7QUFDRDtBQUNDZ0QsSUFBQUEsdUJBQXVCLENBQUM7QUFBQzlTLE1BQUFBLElBQUksRUFBQ3BCLFFBQU47QUFBZWhELE1BQUFBLFFBQWY7QUFBd0JnQyxNQUFBQTtBQUF4QixLQUFELENBQXZCO0FBQ0Q7O0FBQ0QsV0FBU3dWLFlBQVQsQ0FBc0J0WixDQUF0QixFQUF3QjtBQUN0QkEsSUFBQUEsQ0FBQyxDQUFDdVosZUFBRixHQURzQjs7QUFHdEIsVUFBTXZELEVBQUUsR0FBRWhXLENBQUMsQ0FBQ3FaLGFBQUYsQ0FBZ0JyRCxFQUExQjtBQUNEO0FBQ0MvVCxJQUFBQSxVQUFVLENBQUM7QUFBRWYsTUFBQUEsWUFBWSxFQUFHLElBQUc4VSxFQUFHLEVBQXZCO0FBQTBCL1UsTUFBQUEsS0FBSyxFQUFFO0FBQWpDLEtBQUQsQ0FBVjtBQUNEOztBQUVELFdBQVN1WSxlQUFULENBQXlCeFosQ0FBekIsRUFBNEI7QUFDMUIsVUFBTThFLFFBQVEsR0FBRzlFLENBQUMsQ0FBQ2lXLE1BQUYsQ0FBU0QsRUFBMUI7QUFDQTNRLElBQUFBLGFBQWEsQ0FBQztBQUFFdkQsTUFBQUEsUUFBRjtBQUFZZ0QsTUFBQUE7QUFBWixLQUFELENBQWI7QUFDRDs7QUFDRCxXQUFTMlUsY0FBVCxDQUF3QnpaLENBQXhCLEVBQTJCO0FBQ3pCLFVBQU04RSxRQUFRLEdBQUc5RSxDQUFDLENBQUNpVyxNQUFGLENBQVNELEVBQTFCO0FBQ0E7QUFDQXpRLElBQUFBLFlBQVksQ0FBQztBQUFFekQsTUFBQUEsUUFBRjtBQUFZZ0QsTUFBQUE7QUFBWixLQUFELENBQVo7QUFDQSxVQUFNaEIsT0FBTyxHQUFHRCxRQUFRLENBQUM5QixJQUFULENBQWV0QixDQUFELElBQU9BLENBQUMsQ0FBQ3FFLFFBQUYsS0FBZUEsUUFBcEMsQ0FBaEI7QUFFQTdDLElBQUFBLFVBQVUsQ0FBQztBQUFFZixNQUFBQSxZQUFZLEVBQUcsSUFBRzRDLE9BQU8sQ0FBQ2hELEtBQU0sRUFBbEM7QUFBcUNHLE1BQUFBLEtBQUssRUFBRTtBQUE1QyxLQUFELENBQVY7QUFDRDs7QUFFRCxXQUFTeVksUUFBVCxDQUFrQjFaLENBQWxCLEVBQXFCO0FBQ25Cd0YsSUFBQUEsY0FBYyxDQUFDO0FBQUV2QixNQUFBQSxNQUFNLEVBQUVqRSxDQUFDLENBQUNpVyxNQUFGLENBQVMzVCxLQUFuQjtBQUEwQlIsTUFBQUE7QUFBMUIsS0FBRCxDQUFkO0FBQ0Q7O0FBRUQsV0FBUzZYLGFBQVQsQ0FBdUIzWixDQUF2QixFQUEwQjtBQUN4QixRQUFJNkQsUUFBUSxJQUFJQSxRQUFRLENBQUN3QyxNQUFULEdBQWtCLENBQWxDLEVBQXFDO0FBQ25DWixNQUFBQSxjQUFjLENBQUM7QUFBRTNELFFBQUFBO0FBQUYsT0FBRCxDQUFkO0FBQ0Q7O0FBQ0Q0RCxJQUFBQSxZQUFZLENBQUM7QUFBRTVELE1BQUFBLFFBQUY7QUFBWW1DLE1BQUFBLE1BQVo7QUFBb0JhLE1BQUFBO0FBQXBCLEtBQUQsQ0FBWjtBQUNEOztBQUNELFdBQVM4VSxhQUFULENBQXVCNVosQ0FBdkIsRUFBMEI7QUFDeEIsVUFBTTBFLElBQUksR0FBRzFFLENBQUMsQ0FBQ2lXLE1BQUYsQ0FBUzNULEtBQXRCO0FBQ0F3RCxJQUFBQSxpQkFBaUIsQ0FBQztBQUFFaEUsTUFBQUEsUUFBRjtBQUFZNEMsTUFBQUE7QUFBWixLQUFELENBQWpCO0FBQ0Q7O0FBQ0QsV0FBU21WLFNBQVQsQ0FBbUI3WixDQUFuQixFQUFzQjtBQUNyQjtBQUNDOEYsSUFBQUEsaUJBQWlCLENBQUM7QUFBRXBCLE1BQUFBLElBQUksRUFBRSxFQUFSO0FBQVk1QyxNQUFBQTtBQUFaLEtBQUQsQ0FBakI7QUFDQSxVQUFNaVgsT0FBTyxHQUFHL1ksQ0FBQyxDQUFDaVcsTUFBRixDQUFTRCxFQUF6QjtBQUNBLFVBQU07QUFBRXpLLE1BQUFBO0FBQUYsUUFBWXpILE9BQWxCO0FBQ0EsVUFBTW1FLFNBQVMsR0FBR3VRLElBQUksQ0FBQ0MsR0FBTCxFQUFsQjtBQUNBLFVBQU10UyxPQUFPLEdBQ1g5QixXQUFXLEtBQUssRUFBaEIsR0FBcUI7QUFBRUssTUFBQUEsSUFBSSxFQUFFTCxXQUFSO0FBQXFCNEQsTUFBQUE7QUFBckIsS0FBckIsR0FBd0QsSUFEMUQ7QUFHQSxVQUFNM0QsTUFBTSxHQUFHLElBQWY7QUFDQSxRQUFJOFQsU0FBUyxHQUFFLEtBQWY7O0FBQ0EsUUFBSTdULE1BQU0sSUFBSUMsVUFBVSxLQUFLLENBQTdCLEVBQWdDO0FBRTlCLFVBQUdWLE9BQU8sQ0FBQ2hELEtBQVIsS0FBaUIsU0FBcEIsRUFBOEI7QUFFNUJzWCxRQUFBQSxTQUFTLEdBQUMsSUFBVjtBQUNELE9BSEQsTUFHSztBQUVIN1QsUUFBQUEsTUFBTSxDQUFDdVUsSUFBUCxDQUNFN1QsSUFBSSxDQUFDeUIsU0FBTCxDQUFlO0FBQ2I1QixVQUFBQSxRQUFRLEVBQUVoQixPQUFPLENBQUNnQixRQURMO0FBRWJ5RyxVQUFBQSxLQUZhO0FBR2JwRixVQUFBQSxPQUhhO0FBSWI0UyxVQUFBQSxPQUphO0FBS2I5USxVQUFBQTtBQUxhLFNBQWYsQ0FERjtBQVVEO0FBRUYsS0FuQkQsTUFtQk87QUFDTDNELE1BQUFBLE1BQU0sR0FBRyxLQUFUO0FBQ0Q7O0FBRUQ2VCxJQUFBQSxrQkFBa0IsQ0FBQztBQUNqQnJXLE1BQUFBLFFBRGlCO0FBRWpCb0UsTUFBQUEsSUFBSSxFQUFFcEIsUUFGVztBQUdqQmhCLE1BQUFBLE9BQU8sRUFBRTtBQUNQZ0IsUUFBQUEsUUFBUSxFQUFFaEIsT0FBTyxDQUFDZ0IsUUFEWDtBQUVQeUcsUUFBQUEsS0FGTztBQUdQekssUUFBQUEsS0FBSyxFQUFFaVksT0FIQTtBQUlQNVMsUUFBQUEsT0FBTyxFQUFFO0FBQUV6QixVQUFBQSxJQUFJLEVBQUVMLFdBQVI7QUFBcUI0RCxVQUFBQSxTQUFyQjtBQUFnQ0UsVUFBQUEsU0FBUyxFQUFFLEtBQTNDO0FBQWtEckQsVUFBQUE7QUFBbEQsU0FKRjtBQUtQbUQsUUFBQUEsU0FMTztBQU1QRSxRQUFBQSxTQUFTLEVBQUU7QUFOSixPQUhRO0FBWWpCN0QsTUFBQUEsTUFaaUI7QUFhakI4VCxNQUFBQTtBQWJpQixLQUFELENBQWxCO0FBbUJELEdBdEgyQjs7O0FBdUg1QixTQUFPO0FBQ0xrQixJQUFBQSxZQURLO0FBRUxHLElBQUFBLGNBRks7QUFHTEcsSUFBQUEsYUFISztBQUlMdlYsSUFBQUEsV0FKSztBQUtMc1YsSUFBQUEsYUFMSztBQU1MRCxJQUFBQSxRQU5LO0FBT0x6VixJQUFBQSxNQVBLO0FBUUx1VixJQUFBQSxlQVJLO0FBU0wxWCxJQUFBQSxRQVRLO0FBVUxnQyxJQUFBQSxPQVZLO0FBV0xELElBQUFBLFFBWEs7QUFZTHNWLElBQUFBLEtBWks7QUFhTHJVLElBQUFBLFFBYks7QUFjTGQsSUFBQUEsUUFkSztBQWVMNlYsSUFBQUEsU0FmSztBQWdCTDlWLElBQUFBLGNBaEJLO0FBaUJMUyxJQUFBQSxVQWpCSztBQWtCTDRVLElBQUFBO0FBbEJLLEdBQVA7QUFvQkQ7O0FDdkpNLFNBQVNVLGNBQVQsR0FBMEI7QUFDL0IsUUFBTTtBQUFFN1gsSUFBQUE7QUFBRixNQUFpQkQsV0FBVyxFQUFsQztBQUNBLFFBQU07QUFBRXFVLElBQUFBO0FBQUYsTUFBZVEsV0FBVyxFQUFoQztBQUNBLFFBQU07QUFBRXJTLElBQUFBLFVBQUY7QUFBY1QsSUFBQUEsY0FBZDtBQUE4QnVWLElBQUFBLFlBQTlCO0FBQTRDeFYsSUFBQUE7QUFBNUMsTUFBd0RvVixXQUFXLEVBQXpFOztBQUVBLFdBQVNhLFdBQVQsR0FBdUI7QUFDckI5WCxJQUFBQSxVQUFVLENBQUM7QUFBRWYsTUFBQUEsWUFBWSxFQUFFLFNBQWhCO0FBQTJCRCxNQUFBQSxLQUFLLEVBQUU7QUFBbEMsS0FBRCxDQUFWO0FBQ0Q7O0FBQ0QsU0FDRTtBQUFLLElBQUEsS0FBSyxFQUFFO0FBQUV3VSxNQUFBQSxPQUFPLEVBQUU7QUFBWDtBQUFaLEtBQ0UsRUFBQyxPQUFELFFBQVVZLFFBQVYsQ0FERixFQUVFLEVBQUMsT0FBRCxRQUNFLEVBQUMsWUFBRDtBQUFjLElBQUEsVUFBVSxFQUFFN1I7QUFBMUIsSUFERixDQUZGLEVBS0UsRUFBQyxPQUFEO0FBQVMsSUFBQSxPQUFPLEVBQUV1VixXQUFsQjtBQUErQixtQkFBWTtBQUEzQyxLQUNHaFcsY0FBYyxJQUFJLEVBQUMsT0FBRDtBQUFTLElBQUEsS0FBSyxFQUFFQSxjQUFjLENBQUNjLE1BQWYsQ0FBc0IvRSxDQUFDLElBQUVBLENBQUMsQ0FBQzBHLElBQUYsS0FBUyxLQUFsQyxFQUF5Q0g7QUFBekQsSUFEckIsRUFDMEYsR0FEMUYsQ0FMRixFQVFHdkMsT0FBTyxJQUNOLEVBQUMsT0FBRDtBQUFZLElBQUEsT0FBTyxFQUFFd1YsWUFBckI7QUFBbUMsbUJBQVksWUFBL0M7QUFBNEQsSUFBQSxFQUFFLEVBQUM7QUFBL0QsS0FDRSxFQUFDLFFBQUQ7QUFDRSxJQUFBLElBQUksRUFBQyxPQURQO0FBRUUsSUFBQSxLQUFLLEVBQUMsSUFGUjtBQUdFLElBQUEsTUFBTSxFQUFDO0FBSFQsSUFERixDQVRKLENBREY7QUFxQkQ7O0FDdENNLE1BQU1VLE1BQU0sR0FBRztBQUNwQkMsRUFBQUEsU0FBUyxFQUFHLDhHQURRO0FBR3BCQyxFQUFBQSxRQUFRLEVBQUUsVUFIVTtBQUlwQkMsRUFBQUEsSUFBSSxFQUFFLENBSmM7QUFLcEJDLEVBQUFBLEdBQUcsRUFBRSxDQUxlO0FBTXBCQyxFQUFBQSxNQUFNLEVBQUUsRUFOWTtBQU9wQmxFLEVBQUFBLE1BQU0sRUFBRSxPQVBZO0FBUXBCaUIsRUFBQUEsZUFBZSxFQUFFO0FBUkcsQ0FBZjs7QUNJQSxTQUFTa0QsYUFBVCxHQUF5QjtBQUM5QixRQUFNLENBQUNuRCxLQUFELEVBQVFvRCxRQUFSLElBQW9CNU4sR0FBUSxDQUFDLENBQUQsQ0FBbEM7QUFDQSxRQUFNLENBQUN3SixNQUFELEVBQVNxRSxTQUFULElBQXNCN04sR0FBUSxDQUFDLENBQUQsQ0FBcEM7QUFDQSxRQUFNLENBQUM4TixXQUFELEVBQWNDLGNBQWQsSUFBZ0MvTixHQUFRLENBQUMsRUFBRCxDQUE5QztBQUNBLFFBQU0sQ0FBQ2dPLE1BQUQsRUFBU0MsU0FBVCxJQUFzQmpPLEdBQVEsQ0FBQyxFQUFELENBQXBDOztBQUNBLFdBQVNrTyxrQkFBVCxHQUE4QjtBQUUxQk4sSUFBQUEsUUFBUSxDQUFDN0YsTUFBTSxDQUFDb0csVUFBUixDQUFSO0FBQ0FOLElBQUFBLFNBQVMsQ0FBQzlGLE1BQU0sQ0FBQ3FHLFdBQVIsQ0FBVDtBQUVIOztBQUVELFdBQVNDLHVCQUFULEdBQW1DO0FBQ2pDTixJQUFBQSxjQUFjLENBQUNoRyxNQUFNLENBQUN1RyxNQUFQLENBQWNSLFdBQWYsQ0FBZDtBQUNEOztBQUNEclEsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJK00sS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiLGNBQVEsSUFBUjtBQUNFLGFBQUtBLEtBQUssSUFBSSxHQUFkO0FBQ0V5RCxVQUFBQSxTQUFTLENBQUMsT0FBRCxDQUFUO0FBQ0E7O0FBQ0YsYUFBS3pELEtBQUssSUFBSSxHQUFkO0FBQ0EsYUFBS0EsS0FBSyxJQUFJLEdBQWQ7QUFDQSxhQUFLQSxLQUFLLElBQUksSUFBZDtBQUNFeUQsVUFBQUEsU0FBUyxDQUFDLFFBQUQsQ0FBVDtBQUNBOztBQUNGLGFBQUt6RCxLQUFLLElBQUksSUFBZDtBQUNFeUQsVUFBQUEsU0FBUyxDQUFDLFFBQUQsQ0FBVDtBQUNBOztBQUNGLGFBQUt6RCxLQUFLLEdBQUcsSUFBYjtBQUNFeUQsVUFBQUEsU0FBUyxDQUFDLFNBQUQsQ0FBVDtBQUNBOztBQUNGO0FBQ0VBLFVBQUFBLFNBQVMsQ0FBQyxFQUFELENBQVQ7QUFoQko7QUFrQkQ7QUFDRixHQXJCUSxFQXFCTixDQUFDekQsS0FBRCxDQXJCTSxDQUFUO0FBdUJBL00sRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZDhRLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFFBQVosRUFBc0JSLE1BQXRCO0FBQ0QsR0FGUSxFQUVOLENBQUNBLE1BQUQsQ0FGTSxDQUFUO0FBR0F2USxFQUFBQSxHQUFTLENBQUMsTUFBTTtBQUNkeVEsSUFBQUEsa0JBQWtCO0FBQ2xCRyxJQUFBQSx1QkFBdUI7QUFDdkJ0RyxJQUFBQSxNQUFNLENBQUMwRyxnQkFBUCxDQUF3QixtQkFBeEIsRUFBNkNKLHVCQUE3QztBQUNBdEcsSUFBQUEsTUFBTSxDQUFDMEcsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsTUFBTVAsa0JBQXhDO0FBRUEsV0FBTyxNQUFNO0FBRVg7QUFDRCxLQUhEO0FBSUQsR0FWUSxFQVVOLEVBVk0sQ0FBVDtBQVlBLFNBQU87QUFBRTFELElBQUFBLEtBQUY7QUFBU2hCLElBQUFBLE1BQVQ7QUFBaUJzRSxJQUFBQSxXQUFqQjtBQUE4QkUsSUFBQUE7QUFBOUIsR0FBUDtBQUNEOztBQ3BEYyxTQUFTVSxNQUFULENBQWdCM1osS0FBaEIsRUFBdUI7QUFDcEMsUUFBTTtBQUFFeVYsSUFBQUEsS0FBRjtBQUFTaEIsSUFBQUEsTUFBVDtBQUFpQnNFLElBQUFBLFdBQWpCO0FBQThCRSxJQUFBQTtBQUE5QixNQUF5Q0wsYUFBYSxFQUE1RDtBQUNBLFFBQU07QUFBRWdCLElBQUFBLElBQUY7QUFBUTFELElBQUFBLE9BQVI7QUFBaUJqVyxJQUFBQTtBQUFqQixNQUE4QkQsS0FBcEM7QUFDQSxRQUFNO0FBQUU2TSxJQUFBQSxVQUFGO0FBQWNFLElBQUFBO0FBQWQsTUFBK0JILGFBQWEsRUFBbEQ7QUFFQSxNQUFJQyxVQUFKLEVBQ0UsT0FDRTtBQUNFLElBQUEsS0FBSyxFQUFFLEVBQUUsR0FBR3lMO0FBQUwsS0FEVDtBQUVFLElBQUEsU0FBUyxFQUFHLFVBQVNXLE1BQU8sUUFGOUI7QUFHRSxJQUFBLE9BQU8sRUFBRWxNO0FBSFgsS0FLRzlNLFFBTEgsQ0FERjtBQVNGLFNBQU8sSUFBUDtBQUNEOztBQ3BCTSxTQUFTNFosTUFBVCxDQUFnQjtBQUFFNVosRUFBQUE7QUFBRixDQUFoQixFQUE4QjtBQUNuQyxRQUFNNlosS0FBSyxHQUFHdk4sZUFBZSxFQUE3QjtBQUNBLFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxFQUNMLEdBQUd1TixLQUFLLENBQUNDLE9BREo7QUFFSnZCLE1BQUFBLFFBQVEsRUFBRSxPQUZOO0FBR0w7QUFDQ0UsTUFBQUEsR0FBRyxFQUFFLENBSkQ7QUFLTHNCLE1BQUFBLFNBQVMsRUFBRSxFQUxOO0FBTU47QUFDQTtBQUNDdkUsTUFBQUEsS0FBSyxFQUFFLE1BUkY7QUFTTDFCLE1BQUFBLE9BQU8sRUFBQztBQVRIO0FBRFQsS0FhQzlULFFBYkQsQ0FERjtBQWlCRDs7QUNsQk0sU0FBU2dhLFNBQVQsQ0FBbUI7QUFBRS9ELEVBQUFBLE9BQUY7QUFBVzVCLEVBQUFBO0FBQVgsQ0FBbkIsRUFBb0M7QUFDekMsU0FDRTtBQUNFLG1CQUFhQSxFQURmO0FBRUUsSUFBQSxPQUFPLEVBQUU0QixPQUZYO0FBR0UsSUFBQSxTQUFTLEVBQUMsWUFIWjtBQUlFLElBQUEsT0FBTyxFQUFDLFdBSlY7QUFLRSxJQUFBLElBQUksRUFBQyxPQUxQO0FBTUUsSUFBQSxLQUFLLEVBQUMsTUFOUjtBQU9FLElBQUEsTUFBTSxFQUFDO0FBUFQsS0FTRTtBQUFNLElBQUEsQ0FBQyxFQUFDLGVBQVI7QUFBd0IsSUFBQSxJQUFJLEVBQUM7QUFBN0IsSUFURixFQVVFO0FBQU0sSUFBQSxDQUFDLEVBQUM7QUFBUixJQVZGLENBREY7QUFjRDs7QUNmTSxTQUFTZ0UsSUFBVCxHQUFnQjtBQUNyQixRQUFNO0FBQUVyTixJQUFBQSxVQUFGO0FBQWNFLElBQUFBO0FBQWQsTUFBK0JILGFBQWEsRUFBbEQ7QUFFQSxTQUFPLEVBQUMsU0FBRDtBQUFXLElBQUEsT0FBTyxFQUFFRyxZQUFwQjtBQUFrQyxJQUFBLEVBQUUsRUFBQztBQUFyQyxJQUFQO0FBQ0Q7O0FDTU0sU0FBU29OLGFBQVQsR0FBeUI7QUFDNUIsUUFBTTtBQUFFL1osSUFBQUE7QUFBRixNQUFlK0ssY0FBYyxFQUFuQztBQUdBekMsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDWixRQUFJakYsWUFBWSxDQUFDQyxPQUFiLENBQXFCLFFBQXJCLENBQUosRUFBb0M7QUFDbENrUSxNQUFBQSxxQkFBcUIsQ0FBQztBQUNwQnhULFFBQUFBLFFBRG9CO0FBRXBCb0MsUUFBQUEsSUFBSSxFQUFFZSxJQUFJLENBQUNDLEtBQUwsQ0FBV0MsWUFBWSxDQUFDQyxPQUFiLENBQXFCLFFBQXJCLENBQVg7QUFGYyxPQUFELENBQXJCO0FBSUQ7QUFDRixHQVBNLEVBT0osRUFQSSxDQUFUO0FBUUYsU0FDRSxlQUNFLEVBQUMsTUFBRCxRQUNFLEVBQUMsSUFBRCxPQURGLEVBRUUsRUFBQyxPQUFEO0FBQVMsSUFBQSxLQUFLLEVBQUU7QUFBRTBXLE1BQUFBLElBQUksRUFBRTtBQUFSO0FBQWhCLGVBRkYsRUFHRSxFQUFDLGNBQUQsT0FIRixDQURGLEVBTUUsRUFBQyxNQUFELFFBQ0UsRUFBQyxpQkFBRCxPQURGLEVBRUUsRUFBQyxvQkFBRCxPQUZGLENBTkYsQ0FERjtBQWFEOztBQ3BDTSxTQUFTQyxJQUFULEdBQWdCO0FBQ3JCLFNBQU87QUFBSyxtQkFBWSxNQUFqQjtBQUF3QixJQUFBLEtBQUssRUFBRTtBQUFDN0YsTUFBQUEsVUFBVSxFQUFDO0FBQVo7QUFBL0IsWUFBUDtBQUNEOztBQ0NELE1BQU04RixLQUFLLEdBQUdDLENBQUksQ0FBQyxNQUFNLE9BQU8scUJBQVAsQ0FBUCxDQUFsQjtBQUNBLE1BQU1DLGNBQWMsR0FBR0QsQ0FBSSxDQUFDLE1BQU0sT0FBTyw4QkFBUCxDQUFQLENBQTNCO0FBQ0EsTUFBTUUsY0FBYyxHQUFHRixDQUFJLENBQUMsTUFBTSxPQUFPLDhCQUFQLENBQVAsQ0FBM0I7QUFDQSxNQUFNRyxNQUFNLEdBQUdILENBQUksQ0FBQyxNQUFNLE9BQU8sc0JBQVAsQ0FBUCxDQUFuQjtBQUNBLE1BQU1JLE9BQU8sR0FBR0osQ0FBSSxDQUFDLE1BQU0sT0FBTyx1QkFBUCxDQUFQLENBQXBCO0FBQ0EsTUFBTUssWUFBWSxHQUFHTCxDQUFJLENBQUMsTUFBTSxPQUFPLDRCQUFQLENBQVAsQ0FBekI7QUFDZSxTQUFTTSxjQUFULENBQXdCO0FBQUU1YSxFQUFBQTtBQUFGLENBQXhCLEVBQXNDO0FBQ25ELFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFDdVUsTUFBQUEsVUFBVSxFQUFDO0FBQVo7QUFBWixLQUNFLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0UsRUFBQ3NHLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRTtBQUFwQixLQUNFLEVBQUMsY0FBRCxPQURGLENBREYsQ0FERixFQU1FLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0UsRUFBQ0EsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxLQUFELE9BREYsQ0FERixDQU5GLEVBWUUsRUFBQyxZQUFEO0FBQWMsSUFBQSxJQUFJLEVBQUM7QUFBbkIsS0FDRSxFQUFDQSxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLE1BQUQsT0FERixDQURGLENBWkYsRUFrQkUsRUFBQyxZQUFEO0FBQWMsSUFBQSxJQUFJLEVBQUM7QUFBbkIsS0FDRSxFQUFDQSxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLGNBQUQsT0FERixDQURGLENBbEJGLEVBd0JFLEVBQUMsWUFBRDtBQUFjLElBQUEsSUFBSSxFQUFDO0FBQW5CLEtBQ0UsRUFBQ0EsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxPQUFELE9BREYsQ0FERixDQXhCRixFQTZCRSxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUNBLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRTtBQUFwQixLQUNFLEVBQUMsWUFBRCxPQURGLENBREYsQ0E3QkYsQ0FERjtBQXFDRDs7QUM5Q00sTUFBTXBhLFdBQVMsR0FBRztBQUFFdVIsRUFBQUEsVUFBVSxFQUFFO0FBQWQsQ0FBbEI7QUFFQSxTQUFTOEksV0FBVCxDQUFxQjNiLEtBQXJCLEVBQTRCQyxNQUE1QixFQUFvQztBQUV6QyxNQUFJbUwsU0FBUyxHQUFHLElBQWhCOztBQUNBLFVBQVFuTCxNQUFNLENBQUNDLElBQWY7QUFDRSxTQUFLTixhQUFXLENBQUMrUixpQkFBakI7QUFDRXZHLE1BQUFBLFNBQVMsR0FBRyxFQUNWLEdBQUdwTCxLQURPO0FBRVY2UyxRQUFBQSxVQUFVLEVBQUUsRUFDVixHQUFHN1MsS0FBSyxDQUFDNlMsVUFEQztBQUVWLFdBQUM1UyxNQUFNLENBQUN5USxjQUFSLEdBQXlCO0FBQ3ZCRSxZQUFBQSxlQUFlLEVBQUUzUSxNQUFNLENBQUMyUSxlQUREO0FBRXZCdkwsWUFBQUEsT0FBTyxFQUFFcEYsTUFBTSxDQUFDb0Y7QUFGTztBQUZmO0FBRkYsT0FBWjtBQVdBLGFBQU8rRixTQUFQOztBQUNGLFNBQUt4TCxhQUFXLENBQUNnUyxpQkFBakI7QUFDRXhHLE1BQUFBLFNBQVMsR0FBRyxFQUNWLEdBQUdwTCxLQURPO0FBRVY2UyxRQUFBQSxVQUFVLEVBQUUsRUFDVixHQUFHN1MsS0FBSyxDQUFDNlMsVUFEQztBQUdWLFdBQUM1UyxNQUFNLENBQUN5USxjQUFSLEdBQXlCO0FBQ3ZCRSxZQUFBQSxlQUFlLEVBQUUzUSxNQUFNLENBQUMyUSxlQUREO0FBRXZCdkwsWUFBQUEsT0FBTyxFQUFFcEYsTUFBTSxDQUFDb0Y7QUFGTztBQUhmO0FBRkYsT0FBWjtBQVlBLGFBQU8rRixTQUFQOztBQUVGLFNBQUt4TCxhQUFXLENBQUM0UixzQkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR3hSLEtBREU7QUFFTDZTLFFBQUFBLFVBQVUsRUFBRSxFQUNWLEdBQUc3UyxLQUFLLENBQUM2UyxVQURDO0FBRVYsV0FBQzVTLE1BQU0sQ0FBQ3lRLGNBQVIsR0FBeUI7QUFDdkJFLFlBQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzNCLFFBRFY7QUFFdkI1SixZQUFBQSxPQUFPLEVBQUU7QUFGYztBQUZmO0FBRlAsT0FBUDs7QUFXRixTQUFLekYsYUFBVyxDQUFDOFIsYUFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBRzFSLEtBREU7QUFFTDZTLFFBQUFBLFVBQVUsRUFBRSxFQUNWLEdBQUc3UyxLQUFLLENBQUM2UyxVQURDO0FBRVYrSSxVQUFBQSxTQUFTLEVBQUVoTCxnQkFBZSxDQUFDM0IsUUFGakI7QUFHVixXQUFDaFAsTUFBTSxDQUFDcUwsUUFBUixHQUFtQjtBQUNqQnNGLFlBQUFBLGVBQWUsRUFBRUEsZ0JBQWUsQ0FBQzNCLFFBRGhCO0FBRWpCNUosWUFBQUEsT0FBTyxFQUFFO0FBRlE7QUFIVDtBQUZQLE9BQVA7O0FBV0YsU0FBS3pGLGFBQVcsQ0FBQzJSLDBCQUFqQjtBQUNFLGFBQU8sRUFDTCxHQUFHdlIsS0FERTtBQUVMNlMsUUFBQUEsVUFBVSxFQUFFLEVBQ1YsR0FBRzdTLEtBQUssQ0FBQzZTLFVBREM7QUFFVitJLFVBQUFBLFNBQVMsRUFBRWhMLGdCQUFlLENBQUMzQjtBQUZqQjtBQUZQLE9BQVA7O0FBT0YsU0FBS3JQLGFBQVcsQ0FBQ2lTLGVBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUc3UixLQUFMO0FBQVlvVyxRQUFBQSxLQUFLLEVBQUVwVyxLQUFLLENBQUNvVyxLQUFOLEdBQWM7QUFBakMsT0FBUDs7QUFDRjtBQUNFLGFBQU9wVyxLQUFQO0FBaEVKO0FBa0VEOztBQ3ZFRCxNQUFNNmIsV0FBVyxHQUFHdmIsQ0FBYSxFQUFqQztBQUVPLFNBQVN3YixjQUFULEdBQTBCO0FBQy9CLFFBQU10YixPQUFPLEdBQUdDLEdBQVUsQ0FBQ29iLFdBQUQsQ0FBMUI7O0FBQ0EsTUFBSSxDQUFDcmIsT0FBTCxFQUFjO0FBQ1osVUFBTSxJQUFJRSxLQUFKLENBQVUsK0NBQVYsQ0FBTjtBQUNEOztBQUNELFFBQU0sQ0FBQ1YsS0FBRCxFQUFRZ0IsUUFBUixJQUFvQlIsT0FBMUI7QUFFQSxTQUFPO0FBQUVSLElBQUFBLEtBQUY7QUFBU2dCLElBQUFBO0FBQVQsR0FBUDtBQUNEO0FBRU0sU0FBUythLFlBQVQsQ0FBc0JuYixLQUF0QixFQUE2QjtBQUNsQyxRQUFNLENBQUNaLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JPLEdBQVUsQ0FBQ29hLFdBQUQsRUFBY3JhLFdBQWQsQ0FBcEM7QUFDQSxRQUFNRSxLQUFLLEdBQUdDLEdBQU8sQ0FBQyxNQUFNLENBQUN6QixLQUFELEVBQVFnQixRQUFSLENBQVAsRUFBMEIsQ0FBQ2hCLEtBQUQsQ0FBMUIsQ0FBckI7QUFDQSxTQUFPLEVBQUMsV0FBRCxDQUFhLFFBQWI7QUFBc0IsSUFBQSxLQUFLLEVBQUV3QjtBQUE3QixLQUF3Q1osS0FBeEMsRUFBUDtBQUNEOztBQ2JELE1BQU1vYixRQUFRLEdBQUdiLENBQUksQ0FBQyxNQUFNLE9BQU8scUJBQVAsQ0FBUCxDQUFyQjtBQUNBLE1BQU1jLEtBQUssR0FBR2QsQ0FBSSxDQUFDLE1BQU0sT0FBTyxxQkFBUCxDQUFQLENBQWxCO0FBRU8sU0FBU2UsU0FBVCxHQUFxQjtBQUMxQixTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBQzdHLE1BQUFBLE1BQU0sRUFBQztBQUFSO0FBQVosS0FDRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLElBQUksRUFBQztBQUFmLEtBQ0UsRUFBQyxZQUFELFFBQ0UsRUFBQyxjQUFELE9BREYsQ0FERixDQURGLEVBTUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNFLEVBQUMsSUFBRCxPQURGLENBTkYsRUFVRSxFQUFDLFFBQUQ7QUFBVSxJQUFBLElBQUksRUFBQztBQUFmLEtBQ0UsRUFBQ3FHLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRTtBQUFwQixLQUNFLEVBQUMsUUFBRCxPQURGLENBREYsQ0FWRixFQWVFLEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDRSxFQUFDQSxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLEtBQUQsT0FERixDQURGLENBZkYsQ0FERjtBQXVCRDs7Ozs7QUMxQk0sU0FBU1MsR0FBVCxHQUFlO0FBQ3BCLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFOUcsTUFBQUEsTUFBTSxFQUFFO0FBQVY7QUFBWixLQUNDLEVBQUMsYUFBRCxPQURELEVBRUUsRUFBQyxTQUFELE9BRkYsRUFHRyxFQUhILENBREY7QUFPRDs7QUNSTSxTQUFTK0csWUFBVCxDQUFzQjtBQUFFdmIsRUFBQUE7QUFBRixDQUF0QixFQUFvQztBQUN6QyxTQUNFLEVBQUMsYUFBRDtBQUNFLElBQUEsU0FBUyxFQUFFO0FBQ1Q4WixNQUFBQSxPQUFPLEVBQUU7QUFDUDBCLFFBQUFBLFVBQVUsRUFBRSxTQURMO0FBRVA5RixRQUFBQSxLQUFLLEVBQUUsU0FGQTtBQUdQK0YsUUFBQUEsVUFBVSxFQUFFO0FBSEw7QUFEQTtBQURiLEtBU0UsRUFBQyxnQkFBRDtBQUNFLElBQUEsS0FBSyxFQUFDLFFBRFI7QUFFRSxJQUFBLFNBQVMsRUFBRTtBQUFFbmMsTUFBQUEsS0FBSyxFQUFFLEdBQVQ7QUFBY0MsTUFBQUEsWUFBWSxFQUFFO0FBQTVCO0FBRmIsS0FJRSxFQUFDLFlBQUQsUUFDRSxFQUFDLFdBQUQsUUFDRSxFQUFDLGdCQUFEO0FBQWtCLElBQUEsU0FBUyxFQUFHLFNBQVFtYyxlQUFHO0FBQXpDLEtBQ0cxYixRQURILENBREYsQ0FERixDQUpGLENBVEYsQ0FERjtBQXdCRDs7QUM1QkQyYixDQUFNLENBQ0osRUFBQyxZQUFELFFBQ0UsRUFBQyxHQUFELE9BREYsQ0FESSxFQUtKQyxRQUFRLENBQUMxSSxJQUxMLENBQU47Ozs7In0=
