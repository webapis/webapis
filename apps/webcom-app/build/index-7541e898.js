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
          if (focusedHangout && focusedHangout.username === socketMessage.hangout.username) {
            handleHangout({
              hangout: socketMessage.hangout,
              unread: false
            });
          } else {
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
        email: action.user.email
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
  dispatch
}) {
  p$1(() => {
    if (username) {
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
  }, [username]);
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
    username
  } = authContext.state;
  const [state, dispatch] = m$1(reducer$1, initState);
  const {
    hangout,
    socketMessage
  } = state;
  const websocketHandler = useWebSocket({
    username,
    dispatch,
    socketUrl
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

var css_248z = ".nav-item:hover {\n  background-color: #3700b3;\n  border-radius: 4px;\n}\n\n.nav-item {\n  color: #ffffff;\n  min-height: 36px;\n  padding-left: 16px;\n  padding-right: 16px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n}\n\n.menu-white {\n  min-height: 36px;\n  min-width: 36px;\n  padding: 8px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.menu-white:hover {\n  border-radius: 50%;\n}\n\n.drawer-phone-width {\n  width: 90%;\n}\n\n.drawer-tablet-width {\n  width: 30%;\n}\n\n.drawer-laptop-width {\n  width: 20%;\n}\n\n.drawer-desktop-width {\n  width: 20%;\n}";
styleInject(css_248z);

function NavItem(props) {
  const {
    children
  } = props;
  return h("div", _extends({
    className: "nav-item"
  }, props), children);
}

var css_248z$1 = ".list {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  background-color: #fff;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  width: 100%;\n}\n\n.list-item {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding-left: 16px;\n  padding-right: 16px;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n}\n\n.list-item:hover {\n  background-color: #f5f5f5;\n  cursor: pointer;\n}";
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
    const response = await fetch(`${"https://localhost:3000"}/auth/changepass`, {
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

const Login = L(() => import('./Login-d1942f0b.js'));
const ChangePassword = L(() => import('./ChangePassword-f2c01090.js'));
const ForgotPassword = L(() => import('./ForgotPassword-e152f193.js'));
const Signup = L(() => import('./Signup-f3091ebf.js'));
const Profile = L(() => import('./Profile-47454630.js'));
const AuthFeedback = L(() => import('./AuthFeedback-ccd635ee.js'));
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

const Hangouts = L(() => import('./index-a140f5f3.js'));
const Group = L(() => import('./group-906466dc.js'));
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

var css_248z$2 = "* {\n  padding: 0;\n  margin: 0;\n}\n\n/* width */\n::-webkit-scrollbar {\n  width: 5px;\n}\n\n/* Track */\n::-webkit-scrollbar-track {\n  background: #f1f1f1;\n}\n\n/* Handle */\n::-webkit-scrollbar-thumb {\n  background: #888;\n}\n\n/* Handle on hover */\n::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(\"../theme/Roboto/Roboto-Regular.ttf\");\n}\n\nhtml {\n  font-family: \"Roboto\", Arial, Helvetica, sans-serif;\n}\n\nbody {\n  --bg-color:red;\n}";
styleInject(css_248z$2);

function App() {
  return h("div", {
    style: {
      height: '100vh'
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

H(h(AppProviders, null, h(App, null)), document.body);

export { FeatureRoute as F, L, U, _extends as _, useAppRoute as a, useMediaQuery as b, useAuthContext as c, useFormContext as d, valueChanged as e, validationStates as f, clientValidation as g, h, isClientValidationType as i, v$1 as j, useThemeContext as k, login as l, useUserName as m, getTokenFromUrl as n, changePassword as o, p$1 as p, forgotPassword as q, resetInputValidationState as r, styleInject as s, signup as t, useHangouts as u, validationTypes as v, List as w, ListItem as x, y };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtNzU0MWU4OTguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3JlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9zYXZlUmVjaWV2ZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0TWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlV2ViU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvTmF2UHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2NvbXBhdC9kaXN0L2NvbXBhdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZJdGVtLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2ljb25zL3VzZXI2NC5wbmciLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uU3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2h0dHAtc3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoRHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL3VzZVVzZXJOYW1lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL25hdi9IYW5nb3V0RHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9NZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ljb25zL1NldHTEsW5ncy5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2F2ZVBlbmRpbmdIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9yZW1vdmVIYW5nb3V0RnJvbVVucmVhZC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9uYXYvSGFuZ291dFRvcE1lbnUuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L3N0eWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC91c2VNZWRpYVF1ZXJ5LmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9EcmF3ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L0FwcEJhci5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvaWNvbnMvTWVudVdoaXRlLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9NZW51LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwTmF2aWdhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0hvbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm1SZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwUHJvdmlkZXJzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHN1cHBvcnQgPSB7XG4gIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiZcbiAgICAnQmxvYicgaW4gc2VsZiAmJlxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxufVxuXG5mdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbn1cblxuaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gIF1cblxuICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPVxuICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgfVxuICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5eX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1c1xuICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG59XG5cbkJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICB1cmw6IHRoaXMudXJsXG4gIH0pXG59XG5cblJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG59XG5cbmV4cG9ydCB2YXIgRE9NRXhjZXB0aW9uID0gc2VsZi5ET01FeGNlcHRpb25cbnRyeSB7XG4gIG5ldyBET01FeGNlcHRpb24oKVxufSBjYXRjaCAoZXJyKSB7XG4gIERPTUV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG5hbWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpXG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrXG4gIH1cbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRE9NRXhjZXB0aW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaChpbnB1dCwgaW5pdCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCAmJiByZXF1ZXN0LnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgZnVuY3Rpb24gYWJvcnRYaHIoKSB7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgIH1cblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgfVxuICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgIH1cblxuICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICB9KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsKSB7XG4gICAgICByZXF1ZXN0LnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgcmVxdWVzdC5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gIH0pXG59XG5cbmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxuXG5pZiAoIXNlbGYuZmV0Y2gpIHtcbiAgc2VsZi5mZXRjaCA9IGZldGNoXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2Vcbn1cbiIsInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID17XG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcblxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXG5cbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXG4gICAgTE9BREVEX01FU1NBR0VTOiAnTE9BREVEX01FU1NBR0VTJyxcbiBcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxuXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxuICAgIFxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxuXG4gICAgU09DS0VUX01FU1NBR0VfUkVDSUVWRUQ6J1NPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEJyxcblxuICAgIFxuICAgIE1FU1NBR0VTX1VQREFURUQ6J01FU1NBR0VTX1VQREFURUQnLFxuICAgIEhBTkdPVVRTX1VQREFURUQ6J0hBTkdPVVRTX1VQREFURUQnLFxuICAgIEhBTkdPVVRfVVBEQVRFRDonSEFOR09VVF9VUERBVEVEJyxcbiAgICBVTlJFQURfSEFOR09VVFNfVVBEQVRFRDonVU5SRUFEX0hBTkdPVVRTX1VQREFURUQnLFxuICAgIC8vU09DS0VUXG5cbiAgICBDT05ORUNUSU5HOidDT05ORUNUSU5HJyxcbiAgICBPUEVOOidPUEVOJyxcbiAgICBDTE9TSU5HOidDTE9TSU5HJyxcbiAgICBDTE9TRUQ6J0NMT1NFRCcsXG4gICAgU09DS0VUX1JFQURZOidTT0NLRVRfUkVBRFknLFxuICAgIFNPQ0tFVF9FUlJPUjonU09DS0VUX0VSUk9SJ1xuXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGhhbmdvdXRzOiBudWxsLFxuICBoYW5nb3V0OiBudWxsLFxuICB1bnJlYWRoYW5nb3V0czogbnVsbCxcbiAgbWVzc2FnZXM6IG51bGwsXG4gIHNlYXJjaDogJycsXG4gIHVzZXI6IFtdLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgZXJyb3I6IG51bGwsXG4gIG1lc3NhZ2VUZXh0OiAnJyxcbiAgb25saW5lOiBmYWxzZSxcbiAgc29ja2V0OiBudWxsLFxuICByZWFkeVN0YXRlOiAwLFxuICBzb2NrZXRNZXNzYWdlOiBudWxsLFxufTtcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQ6XG4gICAgIFxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHVucmVhZGhhbmdvdXRzOiBhY3Rpb24udW5yZWFkaGFuZ291dHMgfVxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9VUERBVEVEOlxuXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRDpcblxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldE1lc3NhZ2U6IGFjdGlvbi5zb2NrZXRNZXNzYWdlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXQ6IHN0YXRlLmhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGFjdGlvbi51c2VybmFtZSksXG4gICAgICB9O1xuICAgIC8vU09DS0VUXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfRVJST1I6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ09OTkVDVElORzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAwIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDEgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMT1NJTkc6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMiB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0VEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWTpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzb2NrZXQ6IGFjdGlvbi5zb2NrZXQgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IHsgcmVkdWNlclVucmVhZGhhbmdvdXRzIH0gZnJvbSAnLi9yZWR1Y2VVbnJlYWRoYW5nb3V0cyc7XG4vL3JldHJpZXZlcyBoYW5nb3V0cyBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XG59XG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHtkaXNwYXRjaCx1c2VybmFtZX0pe1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcbn1cbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcbn1cblxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXG4gICAgKTtcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcbiAgXG4gIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS0ke2hhbmdvdXQudXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUywgbWVzc2FnZXMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VVbnJlYWQoeyB1bnJlYWRoYW5nb3V0cywgZGlzcGF0Y2ggfSkge1xuICAvLyBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLiwgdW5yZWFkaGFuZ291dHM6IHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzIH0pIH0pO1xufVxuXG5cblxuXG5cbi8vRU5EIHNhdmVJbnZpdGVyXG5cblxuXG5cbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlYWRIYW5nb3V0cyh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0IH0pIHtcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcblxuICAvLyBzZXQgcmVhZCB0byB0cnVlIG9uIHVucmVhZCBoYW5nb3V0c1xuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xuICBjb25zdCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcbiAgZGVidWdnZXJcbiAgaWYgKHVucmVhZGhhbmdvdXRzJiYgdW5yZWFkaGFuZ291dHMubGVuZ3RoPjApIHtcbiAgICBkZWJ1Z2dlcjtcbiAgICBsZXQgdXBkYXRlZHVucmVhZCA9IHVucmVhZGhhbmdvdXRzLm1hcCh1ID0+IHtcbiAgICAgIGlmICh1LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgcmV0dXJuIHsgLi4udSwgcmVhZDogdHJ1ZSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHU7XG4gICAgICB9XG4gICAgfSk7XG5kZWJ1Z2dlclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkdW5yZWFkKSk7XG5kaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCx1bnJlYWRoYW5nb3V0czp1cGRhdGVkdW5yZWFkfSlcbiAgICBkZWJ1Z2dlcjtcbiAgfVxuZGVidWdnZXI7XG4gIC8vIHNldCBoYW5nb3V0IHRvIHJlYWRcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG4gIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHsgLi4uaGFuZ291dCwgcmVhZDogdHJ1ZSB9KTtcbiAgLy9cbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcblxuICBpZiAobWVzc2FnZSkge1xuICAgIC8vIHVwZGF0ZVJlYWRNZXNzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUmVhZE1lc3NzYWdlcyh7IGhhbmdvdXQsIG5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcbiAgY29uc3QgdXBkYXRlZE1lc3NhZ2VzID0gbWVzc2FnZXMubWFwKChtKSA9PiB7XG4gICAgcmV0dXJuIHsgLi4ubSwgcmVhZDogdHJ1ZSB9O1xuICB9KTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcbn1cbiIsIlxuICBleHBvcnQgY29uc3QgaGFuZ291dFN0YXRlcyA9IHtcbiAgICBJTlZJVEVSOiAnSU5WSVRFUicsXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxuICAgIFVOQkxPQ0tFUjogJ1VOQkxPQ0tFUicsXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJyxcbiAgIC8vIGFja25vd2xlZ2VtZW50XG4gICAgSU5WSVRFRDogJ0lOVklURUQnLFxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnLFxuICB9OyIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBuYW1lLCBkaXNwYXRjaCwgaGFuZ291dCwgb2ZmbGluZSwgb25BcHBSb3V0ZSB9KSB7XG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHRpbWVzdGFtcCB9ID0gaGFuZ291dDtcbmRlYnVnZ2VyO1xuICBjb25zdCBkZWxpdmVyZWRIYW5nb3V0ID0geyAuLi5oYW5nb3V0LCBkZWxpdmVyZWQ6IHRydWUgfTtcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xuICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRIYW5nb3V0KTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQsIGhhbmdvdXQ6IGRlbGl2ZXJlZEhhbmdvdXQgfSk7XG4gIGlmIChtZXNzYWdlKSB7XG5cbiAgICB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQsaGFuZ291dCB9KTtcbiAgfVxuICBpZihoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnKXtcbiAgICBkZWJ1Z2dlcjtcbiAgICB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsbmFtZSxkZWxpdmVyZWRIYW5nb3V0fSlcbiAgfVxuICBpZiAob2ZmbGluZSkge1xuICAgIC8vcmVtb3ZlIG9mZmxpbmUgaGFuZ291dFxuICAgIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XG4gICAgY29uc3Qgb2ZmbGluZWhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xuXG4gICAgaWYgKG9mZmxpbmVoYW5nb3V0cykge1xuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gb2ZmbGluZWhhbmdvdXRzLmZpbmRJbmRleChcbiAgICAgICAgKG8pID0+IG8udGltZXN0YW1wID09PSB0aW1lc3RhbXBcbiAgICAgICk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgb2ZmbGluZUhhbmdvdXRLZXksXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxKSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQgfSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xuXG4gIGNvbnN0IGRlbGl2ZXJlZE1lc3NhZ2UgPSB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lOiBuYW1lLCBkZWxpdmVyZWQ6IHRydWUgfVxuXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gbWVzc2FnZXMuZmluZEluZGV4KFxuICAgIChtKSA9PiBtLnRpbWVzdGFtcCA9PT0gbWVzc2FnZS50aW1lc3RhbXBcbiAgKTtcbiAgbWVzc2FnZXMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkTWVzc2FnZSk7XG4gIFxuXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlcyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJvY2tlZFN0YXRlKHtkaXNwYXRjaCxkZWxpdmVyZWRIYW5nb3V0LG5hbWV9KXtcbiAgZGVidWdnZXI7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGRlbGl2ZXJlZEhhbmdvdXQ7XG4gIGNvbnN0IGJsb2NrZWRNZXNzYWdlID0geyB0aW1lc3RhbXA6ZGVsaXZlcmVkSGFuZ291dC50aW1lc3RhbXAsIHRleHQ6ICd5b3UgYmxvY2tlZCB0aGlzIHVzZXInLCB1c2VybmFtZTogbmFtZSwgdHlwZTogJ2Jsb2NrZWQnIH1cbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcbiAgXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KCBbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdKSk7XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczpbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdIH0pO1xufSIsImltcG9ydCB7IHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQgfSBmcm9tICcuL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3NhZ2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XG5cbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcblxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZX0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY2NlcHRlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xuXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xuXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XG5kZWJ1Z2dlcjtcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZVVuYmxvdmtlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xuXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xufVxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQge2hhbmdvdXRTdGF0ZXN9ICBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcydcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRIYW5nb3V0KHtcbiAgZGlzcGF0Y2gsXG4gIGhhbmdvdXQsXG4gIG5hbWUsXG4gIGZvY3VzZWRIYW5nb3V0LFxuICBvbkFwcFJvdXRlLFxuICB1bnJlYWQsXG59KSB7XG4gIGRlYnVnZ2VyO1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xuIGRlYnVnZ2VyO1xuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xuXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XG5cbiBcbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChoZz0+IGhnLnVzZXJuYW1lPT09dXNlcm5hbWUpXG4gICAgaWYoaGFuZ291dEV4aXN0KXtcbiAgICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xuICAgICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7XG4gICAgICAgICAgLi4uaGFuZ291dCxcbiAgICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xuICAgICAgICAgIC4uLmhhbmdvdXQsXG4gICAgICAgICAgcmVhZDogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XG4gICAgfS8vZW5kIG9mIGhhbmdvdXQgZXhpc3RcbmVsc2V7XG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxuICAgICAge1xuICAgICAgICAuLi5oYW5nb3V0LFxuICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgfSxcbiAgICBdO1xuICB9IGVsc2Uge1xuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFsuLi5oYW5nb3V0cyxcbiAgICAgIHtcbiAgICAgICAgLi4uaGFuZ291dCxcbiAgICAgICAgcmVhZDogZmFsc2UsXG4gICAgICB9LFxuICAgIF07XG4gIH1cbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcbn1cblxufWVsc2V7XG4gIGRlYnVnZ2VyO1xuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcbiAgICAgIHtcbiAgICAgICAgLi4uaGFuZ291dCxcbiAgICAgICAgcmVhZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfSBlbHNlIHtcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbXG4gICAgICB7XG4gICAgICAgIC4uLmhhbmdvdXQsXG4gICAgICAgIHJlYWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdO1xuICB9XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XG5cbn1cblxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCxcbiAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxuICAgIH0pO1xuICAgIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xuICAgICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xuICAgIH1cbiAgfVxuICBpZiAobWVzc2FnZSkge1xuICAgIHNhdmVSZWNpZXZlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQgfSk7XG4gIH1cblxuICBpZiAodW5yZWFkKSB7XG4gICAgZGVidWdnZXI7XG4gICAgc3dpdGNoKGhhbmdvdXQuc3RhdGUpe1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSOlxuICAgICAgICBzYXZlVW5yZWFkSGFuZ291dCh7IG5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgfVxuIFxufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWNpZXZlZE1lc3NhZ2Uoe1xuICBkaXNwYXRjaCxcbiAgaGFuZ291dCxcbiAgbmFtZSxcbiAgZm9jdXNlZEhhbmdvdXQsXG59KSB7XG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XG5cbiAgLy8gc2F2ZSBtZXNzYWdlIHRvIGxvY2FsU3RvcmFnZVxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gbnVsbDtcbiAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogdHJ1ZSB9XTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xuICAgIH1cbiAgfVxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcblxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzYXZlVW5yZWFkSGFuZ291dCh7IG5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xuICBcbiAgLy91cGRhdGUgdW5yZWFkIGhhbmdvdXRzXG4gIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XG4gIGxldCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcbiAgbGV0IHVwZGF0ZWR1bnJlYWRzID0gbnVsbDtcbiAgaWYgKHVucmVhZGhhbmdvdXRzKSB7XG4gICAgdXBkYXRlZHVucmVhZHMgPSBbLi4udW5yZWFkaGFuZ291dHMsIHsuLi5oYW5nb3V0LHJlYWQ6ZmFsc2V9XTtcbiAgfSBlbHNlIHtcbiAgICB1cGRhdGVkdW5yZWFkcyA9IFt7Li4uaGFuZ291dCxyZWFkOmZhbHNlfV07XG4gIH1cbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWR1bnJlYWRzKSk7XG5cbiAgZGlzcGF0Y2goe1xuICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxuICAgIHVucmVhZGhhbmdvdXRzOiB1cGRhdGVkdW5yZWFkcyxcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBzYXZlUmVjaWV2ZWRIYW5nb3V0IH0gZnJvbSAnLi9zYXZlUmVjaWV2ZWRIYW5nb3V0JztcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlcih7XG4gIGRpc3BhdGNoLFxuICBoYW5nb3V0LFxuICBuYW1lLFxuICBmb2N1c2VkSGFuZ291dCxcbiAgb25BcHBSb3V0ZSxcbiAgdW5yZWFkXG59KSB7XG5cblxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVyKHtcbiAgZGlzcGF0Y2gsXG4gIGhhbmdvdXQsXG4gIG5hbWUsXG4gIGZvY3VzZWRIYW5nb3V0LFxuICBvbkFwcFJvdXRlLFxuICB1bnJlYWRcbn0pIHtcbiBcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VyKHtcbiAgZGlzcGF0Y2gsXG4gIGhhbmdvdXQsXG4gIG5hbWUsXG4gIGZvY3VzZWRIYW5nb3V0LFxuICBvbkFwcFJvdXRlLFxuICB1bnJlYWRcbn0pIHtcbiAgXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZXIoe1xuICBkaXNwYXRjaCxcbiAgaGFuZ291dCxcbiAgbmFtZSxcbiAgZm9jdXNlZEhhbmdvdXQsXG4gIG9uQXBwUm91dGUsXG4gIHVucmVhZFxufSkge1xuXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSkge1xuXG5cbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcbn0gLy8gRU5EIHNhdmVNZXNzYW5nZXJcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb2NrZXIoe1xuICBkaXNwYXRjaCxcbiAgaGFuZ291dCxcbiAgbmFtZSxcbiAgZm9jdXNlZEhhbmdvdXQsXG4gIG9uQXBwUm91dGUsXG4gIHVucmVhZFxufSkge1xuICBcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJztcbmltcG9ydCB7XG4gIHNhdmVJbnZpdGVkLFxuICBzYXZlVW5ibG92a2VkLFxuICBzYXZlRGVjbGluZWQsXG4gIHNhdmVCbG9ja2VkLFxuICBzYXZlQWNjZXB0ZWQsXG4gIHNhdmVNZXNzYWdlZCxcbn0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucyc7XG5pbXBvcnQge1xuICBzYXZlQWNjZXB0ZXIsXG4gIHNhdmVCbG9ja2VyLFxuICBzYXZlRGVjbGluZXIsXG4gIHNhdmVJbnZpdGVyLFxuICBzYXZlTWVzc2FuZ2VyLFxuICBzYXZlVW5ibG9ja2VyLFxufSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldE1lc3NhZ2Uoe1xuICBzb2NrZXRNZXNzYWdlLFxuICB1c2VybmFtZSxcbiAgZGlzcGF0Y2gsXG4gIGZvY3VzZWRIYW5nb3V0LFxufSkge1xuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XG4gIGZ1bmN0aW9uIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQsb2ZmbGluZSB9KSB7XG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFRDpcbiAgICAgICAgc2F2ZUludml0ZWQoe1xuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgIGhhbmdvdXQsXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcbiAgICAgICAgICBvbkFwcFJvdXRlLFxuICAgICAgICAgIG9mZmxpbmVcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRDpcbiAgICAgICAgc2F2ZVVuYmxvdmtlZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxuICAgICAgICAgIG9uQXBwUm91dGUsXG4gICAgICAgICAgb2ZmbGluZVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORUQ6XG4gICAgICAgIHNhdmVEZWNsaW5lZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxuICAgICAgICAgIG9uQXBwUm91dGUsXG4gICAgICAgICAgb2ZmbGluZVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRDpcbiAgICAgICAgXG4gICAgICAgIHNhdmVCbG9ja2VkKHtcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXG4gICAgICAgICAgb25BcHBSb3V0ZSxcbiAgICAgICAgICBvZmZsaW5lXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFRDpcbiAgICAgICAgc2F2ZUFjY2VwdGVkKHtcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXG4gICAgICAgICAgb25BcHBSb3V0ZSxcbiAgICAgICAgICBvZmZsaW5lXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxuICAgICAgIFxuICAgICAgICBzYXZlTWVzc2FnZWQoe1xuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgIGhhbmdvdXQsXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcbiAgICAgICAgICBvbkFwcFJvdXRlLFxuICAgICAgICAgIG9mZmxpbmVcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsIHVucmVhZCB9KSB7XG4gICAgXG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XG4gICAgICAgIHNhdmVBY2NlcHRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRVI6XG4gICAgICAgXG4gICAgICAgIHNhdmVCbG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSOlxuICAgICAgICBcbiAgICAgICAgc2F2ZURlY2xpbmVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XG4gICAgICAgIHNhdmVJbnZpdGVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcbiAgICAgICAgc2F2ZU1lc3Nhbmdlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRVI6XG4gICAgICAgIFxuICAgICAgICBzYXZlVW5ibG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0cyB9KSB7XG4gICAgaGFuZ291dHMuZm9yRWFjaCgoaGFuZ291dCkgPT4ge1xuICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XG4gICAgfSk7XG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzb2NrZXRNZXNzYWdlICAmJiB1c2VybmFtZSkge1xuICAgIFxuICAgICAgc3dpdGNoIChzb2NrZXRNZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnQUNLSE9XTEVER0VNRU5UJzpcblxuICAgICAgICAgIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQ6IHNvY2tldE1lc3NhZ2UuaGFuZ291dCxvZmZsaW5lOmZhbHNlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdIQU5HT1VUJzpcbiAgICAgICAgICBcbiAgICAgICAgICBpZihmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT1zb2NrZXRNZXNzYWdlLmhhbmdvdXQudXNlcm5hbWUpe1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsdW5yZWFkOmZhbHNlIH0pO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dDogc29ja2V0TWVzc2FnZS5oYW5nb3V0LHVucmVhZDp0cnVlIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdVTlJFQURfSEFOR09VVFMnOlxuICAgXG4gICAgICAgICAgaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0czogc29ja2V0TWVzc2FnZS5oYW5nb3V0cyB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnT0ZGTElORV9BQ0tOJzpcbiAgICAgICBcbiAgICAgICAgICBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsb2ZmbGluZTp0cnVlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW3NvY2tldE1lc3NhZ2UsIHVzZXJuYW1lXSk7XG5cbiAgcmV0dXJuIHt9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTFVFX0NIQU5HRUQ6ICdWQUxVRV9DSEFOR0VEJyxcclxuICBMT0dJTl9TVEFSVEVEOiAnTE9HSU5fU1RBUlRFRCcsXHJcbiAgTE9HSU5fU1VDQ0VTUzogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gIExPR0lOX0ZBSUxFRDogJ0xPR0lOX0ZBSUxFRCcsXHJcblxyXG4gIExPR09VVF9TVEFSVEVEOiAnTE9HT1VUX1NUQVJURUQnLFxyXG4gIExPR09VVF9GQUlMRUQ6ICdMT0dPVVRfRkFJTEVEJyxcclxuICBMT0dPVVRfU1VDQ0VTUzogJ0xPR09VVF9TVUNDRVNTJyxcclxuXHJcbiAgU0lHTlVQX1NUQVJURUQ6ICdTSUdOVVBfU1RBUlRFRCcsXHJcbiAgU0lHTlVQX1NVQ0NFU1M6ICdTSUdOVVBfU1VDQ0VTUycsXHJcbiAgU0lHTlVQX0ZBSUxFRDogJ1NJR05VUF9GQUlMRUQnLFxyXG5cclxuICBDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDogJ0NIQU5HRV9QQVNTV09SRF9TVEFSVEVEJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzogJ0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfRkFJTEVEOiAnQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCcsXHJcblxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCcsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEJyxcclxuICBHT1RfVE9LRU5fRlJPTV9VUkw6ICdHT1RfVE9LRU5fRlJPTV9VUkwnLFxyXG5cclxuICBSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6ICdSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUnLFxyXG59O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgZW1haWw6ICcnLFxyXG4gIHBhc3N3b3JkOiAnJyxcclxuICBzdWNjZXNzOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICB1c2VybmFtZTogJycsXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgY29uZmlybTogJycsXHJcbiAgY3VycmVudDogJycsXHJcbiAgZW1haWxvcnVzZXJuYW1lOiAnJyxcclxuICB0b2tlbjogbnVsbCxcclxuICBpc0xvZ2dlZEluOiBmYWxzZSxcclxuICBpc1Bhc3N3b3JkQ2hhbmdlZDogZmFsc2UsXHJcbiAgYXV0aEZlZWRiYWNrOiBudWxsLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XHJcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBbYWN0aW9uLnBheWxvYWQucHJvcE5hbWVdOiBhY3Rpb24ucGF5bG9hZC52YWx1ZSxcclxuICAgICAgfTtcclxuICBcclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZSwgJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi5lbWFpbCxcclxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXIudXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi51c2VyLmVtYWlsLFxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgQXV0aFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW2F1dGhSb3V0ZV0gPSB1c2VBdXRoUm91dGVDb250ZXh0KCk7XHJcblxyXG4gIGlmIChhdXRoUm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMaW5rKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0bywgaWQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0gPSB1c2VBdXRoUm91dGVDb250ZXh0KCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2V0Um91dGUodG8pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGFcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICB7Li4ucHJvcHN9XHJcbiAgICAgIGhyZWY9e3RvfVxyXG4gICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja31cclxuICAgICAgc3R5bGU9e3sgdGV4dERlY29yYXRpb246ICdub25lJywgY29sb3I6ICdpbmhlcml0JyB9fVxyXG4gICAgLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoUm91dGVDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBdXRoUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBpbml0aWFsUm91dGUgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0gPSB1c2VTdGF0ZShpbml0aWFsUm91dGUpO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSwgW2F1dGhSb3V0ZV0pO1xyXG5cclxuICByZXR1cm4gPEF1dGhSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2F1dGhSZWR1Y2VyJztcclxuaW1wb3J0IHsgQXV0aFJvdXRlUHJvdmlkZXIgfSBmcm9tICcuL2F1dGgtcm91dGUtY29udGV4dCc7XHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlQXV0aENvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc3RhdGUsXHJcbiAgICBkaXNwYXRjaCxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBBdXRoUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfT5cclxuICAgICAgPEF1dGhSb3V0ZVByb3ZpZGVyPntjaGlsZHJlbn08L0F1dGhSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VBdXRoQ29udGV4dCwgQXV0aFByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VXZWJTb2NrZXQoeyBzb2NrZXRVcmwsIHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBjb25zdCBzb2NrID0gbmV3IFdlYlNvY2tldChgJHtzb2NrZXRVcmx9Lz91c2VybmFtZT0ke3VzZXJuYW1lfWApO1xuICAgICAgc29jay5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG5cbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfTUVTU0FHRV9SRUNJRVZFRCwgc29ja2V0TWVzc2FnZTogbXNnIH0pO1xuICAgXG4gICAgICB9O1xuICAgICAgc29jay5vbm9wZW4gPSAoKSA9PiB7XG4gICAgIFxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk9QRU4gfSk7XG4gICAgICB9O1xuICAgICAgc29jay5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNMT1NFRCB9KTtcbiAgICAgIH07XG4gICAgICBzb2NrLm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfRVJST1IsIGVycm9yIH0pO1xuICAgICAgfTtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZLCBzb2NrZXQ6IHNvY2sgfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcbn1cbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHtcbiAgdXNlQ29udGV4dCxcbiAgdXNlU3RhdGUsXG4gIHVzZU1lbW8sXG4gIHVzZVJlZHVjZXIsXG4gIHVzZUVmZmVjdCxcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5cbmltcG9ydCB7XG4gIGxvYWRIYW5nb3V0cyxcbiAgZmlsdGVySGFuZ291dHMsXG4gIGZldGNoSGFuZ291dCxcbiAgbG9hZE1lc3NhZ2VzLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXBkYXRlUmVhZEhhbmdvdXRzIH0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cyc7XG5pbXBvcnQgeyB1c2VTb2NrZXRNZXNzYWdlIH0gZnJvbSAnLi91c2VTb2NrZXRNZXNzYWdlJztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuaW1wb3J0IHsgdXNlV2ViU29ja2V0IH0gZnJvbSAnLi91c2VXZWJTb2NrZXQnO1xuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEhhbmdvdXRDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VIYW5nb3V0Q29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBIYW5nb3V0c1Byb3ZpZGVyJyk7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhhbmdvdXRzUHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgeyBzb2NrZXRVcmwgfSA9IHByb3BzO1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgeyBoYW5nb3V0LCBzb2NrZXRNZXNzYWdlIH0gPSBzdGF0ZTtcbiAgY29uc3Qgd2Vic29ja2V0SGFuZGxlciA9IHVzZVdlYlNvY2tldCh7IHVzZXJuYW1lLCBkaXNwYXRjaCwgc29ja2V0VXJsIH0pO1xuICBjb25zdCBoYW5kbGVVc2VTb2NrZXRNZXNzYWdlID0gdXNlU29ja2V0TWVzc2FnZSh7XG4gICAgdXNlcm5hbWUsXG4gICAgZGlzcGF0Y2gsXG4gICAgc29ja2V0TWVzc2FnZSxcbiAgICBmb2N1c2VkSGFuZ291dDogaGFuZ291dCxcbiAgfSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCAmJiB1c2VybmFtZSkge1xuICBcbiAgICAgIC8vZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgICBsb2FkTWVzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XG5cbiAgICAgIC8vc2F2ZSBoYW5nb3V0IHRvIGxvY2FsU3RvcmFnZVxuICAgICAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYDtcbiAgICAgIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcbiAgICAgIGlmICghaGFuZ291dHMpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGhhbmdvdXRFeGlzdCA9IGhhbmdvdXRzLmZpbmQoXG4gICAgICAgICAgKGcpID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWVcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhhbmdvdXRFeGlzdCkge1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5nb3V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFoYW5nb3V0LnJlYWQpIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgZGVidWdnZXI7XG4gICAgICAgIHVwZGF0ZVJlYWRIYW5nb3V0cyh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lOiB1c2VybmFtZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtoYW5nb3V0LCB1c2VybmFtZV0pO1xuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFRoZW1lQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZVRoZW1lQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xyXG5cclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFRoZW1lUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gVGhlbWVQcm92aWRlcihwcm9wcykge1xyXG4gIFxyXG4gIGNvbnN0IHsgaW5pdFN0YXRlIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0U3RhdGUpO1xyXG5cclxuICByZXR1cm4gPFRoZW1lQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17c3RhdGV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZVRoZW1lQ29udGV4dCwgVGhlbWVQcm92aWRlciB9O1xyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcblxuY29uc3QgTmF2Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZnVuY3Rpb24gdXNlTmF2Q29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoTmF2Q29udGV4dCk7XG5cbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VOYXZDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIE5hdlByb3ZpZGVyJyk7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU5hdmlnYXRpb24oKSB7XG4gIGNvbnN0IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSA9IHVzZU5hdkNvbnRleHQoKTtcbiAgICBmdW5jdGlvbiB0b2dnbGVEcmF3ZXIoKXtcbiAgICAgICAgc2V0RHJhd2VyT3BlbihwcmV2PT4hcHJldilcbiAgICB9XG4gIHJldHVybiB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTmF2UHJvdmlkZXIocHJvcHMpIHtcbiAgY29uc3QgW2RyYXdlck9wZW4sIHNldERyYXdlck9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0sIFtkcmF3ZXJPcGVuXSk7XG4gIHJldHVybiA8TmF2Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnR7dXNlU3RhdGUgYXMgbix1c2VSZWR1Y2VyIGFzIHQsdXNlRWZmZWN0IGFzIGUsdXNlTGF5b3V0RWZmZWN0IGFzIHIsdXNlUmVmIGFzIG8sdXNlSW1wZXJhdGl2ZUhhbmRsZSBhcyB1LHVzZU1lbW8gYXMgaSx1c2VDYWxsYmFjayBhcyBmLHVzZUNvbnRleHQgYXMgYyx1c2VEZWJ1Z1ZhbHVlIGFzIGF9ZnJvbVwicHJlYWN0L2hvb2tzXCI7ZXhwb3J0KmZyb21cInByZWFjdC9ob29rc1wiO2ltcG9ydHtDb21wb25lbnQgYXMgbCxjcmVhdGVFbGVtZW50IGFzIHMsb3B0aW9ucyBhcyB2LHRvQ2hpbGRBcnJheSBhcyBoLGh5ZHJhdGUgYXMgcCxyZW5kZXIgYXMgZCxfdW5tb3VudCBhcyBtLGNsb25lRWxlbWVudCBhcyB5LGNyZWF0ZVJlZiBhcyBiLGNyZWF0ZUNvbnRleHQgYXMgZyxGcmFnbWVudCBhcyB4fWZyb21cInByZWFjdFwiO2V4cG9ydHtjcmVhdGVFbGVtZW50LGNyZWF0ZUNvbnRleHQsY3JlYXRlUmVmLEZyYWdtZW50LENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtmdW5jdGlvbiBFKG4sdCl7Zm9yKHZhciBlIGluIHQpbltlXT10W2VdO3JldHVybiBufWZ1bmN0aW9uIHcobix0KXtmb3IodmFyIGUgaW4gbilpZihcIl9fc291cmNlXCIhPT1lJiYhKGUgaW4gdCkpcmV0dXJuITA7Zm9yKHZhciByIGluIHQpaWYoXCJfX3NvdXJjZVwiIT09ciYmbltyXSE9PXRbcl0pcmV0dXJuITA7cmV0dXJuITF9dmFyIEM9ZnVuY3Rpb24obil7dmFyIHQsZTtmdW5jdGlvbiByKHQpe3ZhciBlO3JldHVybihlPW4uY2FsbCh0aGlzLHQpfHx0aGlzKS5pc1B1cmVSZWFjdENvbXBvbmVudD0hMCxlfXJldHVybiBlPW4sKHQ9cikucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5fX3Byb3RvX189ZSxyLnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obix0KXtyZXR1cm4gdyh0aGlzLnByb3BzLG4pfHx3KHRoaXMuc3RhdGUsdCl9LHJ9KGwpO2Z1bmN0aW9uIF8obix0KXtmdW5jdGlvbiBlKG4pe3ZhciBlPXRoaXMucHJvcHMucmVmLHI9ZT09bi5yZWY7cmV0dXJuIXImJmUmJihlLmNhbGw/ZShudWxsKTplLmN1cnJlbnQ9bnVsbCksdD8hdCh0aGlzLnByb3BzLG4pfHwhcjp3KHRoaXMucHJvcHMsbil9ZnVuY3Rpb24gcih0KXtyZXR1cm4gdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZSxzKG4sRSh7fSx0KSl9cmV0dXJuIHIucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9ITAsci5kaXNwbGF5TmFtZT1cIk1lbW8oXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsci50PSEwLHJ9dmFyIEE9di5fX2I7ZnVuY3Rpb24gUyhuKXtmdW5jdGlvbiB0KHQpe3ZhciBlPUUoe30sdCk7cmV0dXJuIGRlbGV0ZSBlLnJlZixuKGUsdC5yZWYpfXJldHVybiB0LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXQudD0hMCx0LmRpc3BsYXlOYW1lPVwiRm9yd2FyZFJlZihcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIix0fXYuX19iPWZ1bmN0aW9uKG4pe24udHlwZSYmbi50eXBlLnQmJm4ucmVmJiYobi5wcm9wcy5yZWY9bi5yZWYsbi5yZWY9bnVsbCksQSYmQShuKX07dmFyIGs9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9oKG4pLnJlZHVjZShmdW5jdGlvbihuLGUscil7cmV0dXJuIG4uY29uY2F0KHQoZSxyKSl9LFtdKTpudWxsfSxSPXttYXA6ayxmb3JFYWNoOmssY291bnQ6ZnVuY3Rpb24obil7cmV0dXJuIG4/aChuKS5sZW5ndGg6MH0sb25seTpmdW5jdGlvbihuKXtpZigxIT09KG49aChuKSkubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNoaWxkcmVuLm9ubHkoKSBleHBlY3RzIG9ubHkgb25lIGNoaWxkLlwiKTtyZXR1cm4gblswXX0sdG9BcnJheTpofSxGPXYuX19lO2Z1bmN0aW9uIE4obil7cmV0dXJuIG4mJigobj1FKHt9LG4pKS5fX2M9bnVsbCxuLl9faz1uLl9fayYmbi5fX2subWFwKE4pKSxufWZ1bmN0aW9uIFUoKXt0aGlzLl9fdT0wLHRoaXMubz1udWxsLHRoaXMuX19iPW51bGx9ZnVuY3Rpb24gTShuKXt2YXIgdD1uLl9fLl9fYztyZXR1cm4gdCYmdC51JiZ0LnUobil9ZnVuY3Rpb24gTChuKXt2YXIgdCxlLHI7ZnVuY3Rpb24gbyhvKXtpZih0fHwodD1uKCkpLnRoZW4oZnVuY3Rpb24obil7ZT1uLmRlZmF1bHR8fG59LGZ1bmN0aW9uKG4pe3I9bn0pLHIpdGhyb3cgcjtpZighZSl0aHJvdyB0O3JldHVybiBzKGUsbyl9cmV0dXJuIG8uZGlzcGxheU5hbWU9XCJMYXp5XCIsby50PSEwLG99ZnVuY3Rpb24gTygpe3RoaXMuaT1udWxsLHRoaXMubD1udWxsfXYuX19lPWZ1bmN0aW9uKG4sdCxlKXtpZihuLnRoZW4pZm9yKHZhciByLG89dDtvPW8uX187KWlmKChyPW8uX19jKSYmci5fX2MpcmV0dXJuIHIuX19jKG4sdC5fX2MpO0Yobix0LGUpfSwoVS5wcm90b3R5cGU9bmV3IGwpLl9fYz1mdW5jdGlvbihuLHQpe3ZhciBlPXRoaXM7bnVsbD09ZS5vJiYoZS5vPVtdKSxlLm8ucHVzaCh0KTt2YXIgcj1NKGUuX192KSxvPSExLHU9ZnVuY3Rpb24oKXtvfHwobz0hMCxyP3IoaSk6aSgpKX07dC5fX2M9dC5jb21wb25lbnRXaWxsVW5tb3VudCx0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dSgpLHQuX19jJiZ0Ll9fYygpfTt2YXIgaT1mdW5jdGlvbigpe3ZhciBuO2lmKCEtLWUuX191KWZvcihlLl9fdi5fX2tbMF09ZS5zdGF0ZS51LGUuc2V0U3RhdGUoe3U6ZS5fX2I9bnVsbH0pO249ZS5vLnBvcCgpOyluLmZvcmNlVXBkYXRlKCl9O2UuX191Kyt8fGUuc2V0U3RhdGUoe3U6ZS5fX2I9ZS5fX3YuX19rWzBdfSksbi50aGVuKHUsdSl9LFUucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuLHQpe3JldHVybiB0aGlzLl9fYiYmKHRoaXMuX192Ll9fa1swXT1OKHRoaXMuX19iKSx0aGlzLl9fYj1udWxsKSxbcyhsLG51bGwsdC51P251bGw6bi5jaGlsZHJlbiksdC51JiZuLmZhbGxiYWNrXX07dmFyIFA9ZnVuY3Rpb24obix0LGUpe2lmKCsrZVsxXT09PWVbMF0mJm4ubC5kZWxldGUodCksbi5wcm9wcy5yZXZlYWxPcmRlciYmKFwidFwiIT09bi5wcm9wcy5yZXZlYWxPcmRlclswXXx8IW4ubC5zaXplKSlmb3IoZT1uLmk7ZTspe2Zvcig7ZS5sZW5ndGg+MzspZS5wb3AoKSgpO2lmKGVbMV08ZVswXSlicmVhaztuLmk9ZT1lWzJdfX07KE8ucHJvdG90eXBlPW5ldyBsKS51PWZ1bmN0aW9uKG4pe3ZhciB0PXRoaXMsZT1NKHQuX192KSxyPXQubC5nZXQobik7cmV0dXJuIHJbMF0rKyxmdW5jdGlvbihvKXt2YXIgdT1mdW5jdGlvbigpe3QucHJvcHMucmV2ZWFsT3JkZXI/KHIucHVzaChvKSxQKHQsbixyKSk6bygpfTtlP2UodSk6dSgpfX0sTy5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4pe3RoaXMuaT1udWxsLHRoaXMubD1uZXcgTWFwO3ZhciB0PWgobi5jaGlsZHJlbik7bi5yZXZlYWxPcmRlciYmXCJiXCI9PT1uLnJldmVhbE9yZGVyWzBdJiZ0LnJldmVyc2UoKTtmb3IodmFyIGU9dC5sZW5ndGg7ZS0tOyl0aGlzLmwuc2V0KHRbZV0sdGhpcy5pPVsxLDAsdGhpcy5pXSk7cmV0dXJuIG4uY2hpbGRyZW59LE8ucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZT1PLnByb3RvdHlwZS5jb21wb25lbnREaWRNb3VudD1mdW5jdGlvbigpe3ZhciBuPXRoaXM7bi5sLmZvckVhY2goZnVuY3Rpb24odCxlKXtQKG4sZSx0KX0pfTt2YXIgVz1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9dmFyIHQ9bi5wcm90b3R5cGU7cmV0dXJuIHQuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dH0sdC5yZW5kZXI9ZnVuY3Rpb24obil7cmV0dXJuIG4uY2hpbGRyZW59LG59KCk7ZnVuY3Rpb24gaihuKXt2YXIgdD10aGlzLGU9bi5jb250YWluZXIscj1zKFcse2NvbnRleHQ6dC5jb250ZXh0fSxuLnZub2RlKTtyZXR1cm4gdC5zJiZ0LnMhPT1lJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSx0LnA9ITEpLG4udm5vZGU/dC5wPyhlLl9faz10Ll9fayxkKHIsZSksdC5fX2s9ZS5fX2spOih0LnY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikscChcIlwiLGUpLGUuYXBwZW5kQ2hpbGQodC52KSx0LnA9ITAsdC5zPWUsZChyLGUsdC52KSx0Ll9faz10LnYuX19rKTp0LnAmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpKSx0Lmg9cix0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKX0sbnVsbH1mdW5jdGlvbiB6KG4sdCl7cmV0dXJuIHMoaix7dm5vZGU6bixjb250YWluZXI6dH0pfXZhciBEPS9eKD86YWNjZW50fGFsaWdubWVudHxhcmFiaWN8YmFzZWxpbmV8Y2FwfGNsaXAoPyFQYXRoVSl8Y29sb3J8ZmlsbHxmbG9vZHxmb250fGdseXBoKD8hUil8aG9yaXp8bWFya2VyKD8hSHxXfFUpfG92ZXJsaW5lfHBhaW50fHN0b3B8c3RyaWtldGhyb3VnaHxzdHJva2V8dGV4dCg/IUwpfHVuZGVybGluZXx1bmljb2RlfHVuaXRzfHZ8dmVjdG9yfHZlcnR8d29yZHx3cml0aW5nfHgoPyFDKSlbQS1aXS87bC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTt2YXIgSD1cInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yJiZTeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKXx8NjAxMDM7ZnVuY3Rpb24gVChuLHQsZSl7aWYobnVsbD09dC5fX2spZm9yKDt0LmZpcnN0Q2hpbGQ7KXQucmVtb3ZlQ2hpbGQodC5maXJzdENoaWxkKTtyZXR1cm4gZChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9ZnVuY3Rpb24gVihuLHQsZSl7cmV0dXJuIHAobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfXZhciBaPXYuZXZlbnQ7ZnVuY3Rpb24gSShuLHQpe25bXCJVTlNBRkVfXCIrdF0mJiFuW3RdJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobix0LHtjb25maWd1cmFibGU6ITEsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbXCJVTlNBRkVfXCIrdF19LHNldDpmdW5jdGlvbihuKXt0aGlzW1wiVU5TQUZFX1wiK3RdPW59fSl9di5ldmVudD1mdW5jdGlvbihuKXtaJiYobj1aKG4pKSxuLnBlcnNpc3Q9ZnVuY3Rpb24oKXt9O3ZhciB0PSExLGU9ITEscj1uLnN0b3BQcm9wYWdhdGlvbjtuLnN0b3BQcm9wYWdhdGlvbj1mdW5jdGlvbigpe3IuY2FsbChuKSx0PSEwfTt2YXIgbz1uLnByZXZlbnREZWZhdWx0O3JldHVybiBuLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7by5jYWxsKG4pLGU9ITB9LG4uaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sbi5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gZX0sbi5uYXRpdmVFdmVudD1ufTt2YXIgJD17Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNsYXNzfX0scT12LnZub2RlO3Yudm5vZGU9ZnVuY3Rpb24obil7bi4kJHR5cGVvZj1IO3ZhciB0PW4udHlwZSxlPW4ucHJvcHM7aWYodCl7aWYoZS5jbGFzcyE9ZS5jbGFzc05hbWUmJigkLmVudW1lcmFibGU9XCJjbGFzc05hbWVcImluIGUsbnVsbCE9ZS5jbGFzc05hbWUmJihlLmNsYXNzPWUuY2xhc3NOYW1lKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImNsYXNzTmFtZVwiLCQpKSxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXt2YXIgcixvLHU7Zm9yKHUgaW4gZS5kZWZhdWx0VmFsdWUmJnZvaWQgMCE9PWUudmFsdWUmJihlLnZhbHVlfHwwPT09ZS52YWx1ZXx8KGUudmFsdWU9ZS5kZWZhdWx0VmFsdWUpLGRlbGV0ZSBlLmRlZmF1bHRWYWx1ZSksQXJyYXkuaXNBcnJheShlLnZhbHVlKSYmZS5tdWx0aXBsZSYmXCJzZWxlY3RcIj09PXQmJihoKGUuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24obil7LTEhPWUudmFsdWUuaW5kZXhPZihuLnByb3BzLnZhbHVlKSYmKG4ucHJvcHMuc2VsZWN0ZWQ9ITApfSksZGVsZXRlIGUudmFsdWUpLGUpaWYocj1ELnRlc3QodSkpYnJlYWs7aWYocilmb3IodSBpbiBvPW4ucHJvcHM9e30sZSlvW0QudGVzdCh1KT91LnJlcGxhY2UoL1tBLVowLTldLyxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpOnVdPWVbdV19IWZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSxyPW4ucHJvcHM7aWYociYmXCJzdHJpbmdcIj09dHlwZW9mIGUpe3ZhciBvPXt9O2Zvcih2YXIgdSBpbiByKS9eb24oQW5pfFRyYXxUb3UpLy50ZXN0KHUpJiYoclt1LnRvTG93ZXJDYXNlKCldPXJbdV0sZGVsZXRlIHJbdV0pLG9bdS50b0xvd2VyQ2FzZSgpXT11O2lmKG8ub25kb3VibGVjbGljayYmKHIub25kYmxjbGljaz1yW28ub25kb3VibGVjbGlja10sZGVsZXRlIHJbby5vbmRvdWJsZWNsaWNrXSksby5vbmJlZm9yZWlucHV0JiYoci5vbmJlZm9yZWlucHV0PXJbby5vbmJlZm9yZWlucHV0XSxkZWxldGUgcltvLm9uYmVmb3JlaW5wdXRdKSxvLm9uY2hhbmdlJiYoXCJ0ZXh0YXJlYVwiPT09ZXx8XCJpbnB1dFwiPT09ZS50b0xvd2VyQ2FzZSgpJiYhL15maWx8Y2hlfHJhL2kudGVzdChyLnR5cGUpKSl7dmFyIGk9by5vbmlucHV0fHxcIm9uaW5wdXRcIjtyW2ldfHwocltpXT1yW28ub25jaGFuZ2VdLGRlbGV0ZSByW28ub25jaGFuZ2VdKX19fSgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJiF0Lm0mJnQucHJvdG90eXBlJiYoSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxNb3VudFwiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wc1wiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFVwZGF0ZVwiKSx0Lm09ITApfXEmJnEobil9O3ZhciBCPVwiMTYuOC4wXCI7ZnVuY3Rpb24gRyhuKXtyZXR1cm4gcy5iaW5kKG51bGwsbil9ZnVuY3Rpb24gSihuKXtyZXR1cm4hIW4mJm4uJCR0eXBlb2Y9PT1IfWZ1bmN0aW9uIEsobil7cmV0dXJuIEoobik/eS5hcHBseShudWxsLGFyZ3VtZW50cyk6bn1mdW5jdGlvbiBRKG4pe3JldHVybiEhbi5fX2smJihkKG51bGwsbiksITApfWZ1bmN0aW9uIFgobil7cmV0dXJuIG4mJihuLmJhc2V8fDE9PT1uLm5vZGVUeXBlJiZuKXx8bnVsbH12YXIgWT1mdW5jdGlvbihuLHQpe3JldHVybiBuKHQpfTtleHBvcnQgZGVmYXVsdHt1c2VTdGF0ZTpuLHVzZVJlZHVjZXI6dCx1c2VFZmZlY3Q6ZSx1c2VMYXlvdXRFZmZlY3Q6cix1c2VSZWY6byx1c2VJbXBlcmF0aXZlSGFuZGxlOnUsdXNlTWVtbzppLHVzZUNhbGxiYWNrOmYsdXNlQ29udGV4dDpjLHVzZURlYnVnVmFsdWU6YSx2ZXJzaW9uOlwiMTYuOC4wXCIsQ2hpbGRyZW46UixyZW5kZXI6VCxoeWRyYXRlOlQsdW5tb3VudENvbXBvbmVudEF0Tm9kZTpRLGNyZWF0ZVBvcnRhbDp6LGNyZWF0ZUVsZW1lbnQ6cyxjcmVhdGVDb250ZXh0OmcsY3JlYXRlRmFjdG9yeTpHLGNsb25lRWxlbWVudDpLLGNyZWF0ZVJlZjpiLEZyYWdtZW50OngsaXNWYWxpZEVsZW1lbnQ6SixmaW5kRE9NTm9kZTpYLENvbXBvbmVudDpsLFB1cmVDb21wb25lbnQ6QyxtZW1vOl8sZm9yd2FyZFJlZjpTLHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzOlksU3VzcGVuc2U6VSxTdXNwZW5zZUxpc3Q6TyxsYXp5Okx9O2V4cG9ydHtCIGFzIHZlcnNpb24sUiBhcyBDaGlsZHJlbixUIGFzIHJlbmRlcixWIGFzIGh5ZHJhdGUsUSBhcyB1bm1vdW50Q29tcG9uZW50QXROb2RlLHogYXMgY3JlYXRlUG9ydGFsLEcgYXMgY3JlYXRlRmFjdG9yeSxLIGFzIGNsb25lRWxlbWVudCxKIGFzIGlzVmFsaWRFbGVtZW50LFggYXMgZmluZERPTU5vZGUsQyBhcyBQdXJlQ29tcG9uZW50LF8gYXMgbWVtbyxTIGFzIGZvcndhcmRSZWYsWSBhcyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyxVIGFzIFN1c3BlbnNlLE8gYXMgU3VzcGVuc2VMaXN0LEwgYXMgbGF6eX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wYXQubW9kdWxlLmpzLm1hcFxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnXG5leHBvcnQgZnVuY3Rpb24gTmF2SXRlbSAocHJvcHMpe1xuY29uc3Qge2NoaWxkcmVufT1wcm9wc1xucmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibmF2LWl0ZW1cInsuLi5wcm9wc30+e2NoaWxkcmVufTwvZGl2PlxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcblxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0KHByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdFwiIHsuLi5wcm9wc30vPlxyXG4gICk7XHJcbn1cclxuXHJcblxyXG4gZnVuY3Rpb24gTGlzdEl0ZW0ocHJvcHMpIHtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1pdGVtXCIgey4uLnByb3BzfSAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7TGlzdCxMaXN0SXRlbX0iLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBUUFBQUFBWUxsVkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQUFtSkxSMFFBQUtxTkl6SUFBQUFKY0VoWmN3QUFEc1FBQUE3RUFaVXJEaHNBQUFBSGRFbE5SUWZrQkJzSUxTMVlmOUpJQUFBRG9FbEVRVlJvM3IyWlMwaFVVUmpIZjNNdGk5QlNNMmxSMHRQSmhFalNWaUVFMWFLTmxSVVZKRkVRRkZFa2J1MjFLN0dJTmhGRlJBK0NsaVV0YXROTDNJVFJOS0VSQmxFTGRVYkg3S0dtYzF2Y3JqUGp6TDMzZkdmdStIMkxnWHZPOS85OTk1d3o1M1VEU0syTU9xcFlRd1hGRkZFQS9DVEdFRDEwRStZVi9XSkZaYXZsTWlIaW1DNGVKMFFiTlg2ajU5UE1SMWZ3ZEEvVFRLRS84QkxPTXlpQzJ6N0lPWXF6Z3dkb3BGOExibnVVVXhpNitGVzh5UXB1KzJ0VzZ1QjNNdVFMM3NUa0IvdGtjSU1ydnNGdGIxUHZpbndlK0k0M01iblBiRFY4ZTA3d0ppWlB2Rk1JY0NkbmVCT1RCMTRkNFgvZlQvZFdOL3llbk9OTlRQWTc0VmNTbTVFRVlxekkzUHYrVERzcS9wSkFBbXZiRVc3S0pndSs4cEFlSU1oK2xncGpEM0VuOVVFSkE2SjMrRU1UZVZQUmVUVHpSeFRmUjFGcUFoZEU0V05zVDN1bnJjSVV6aVFIenhjdXVNY3lOdXR4a1VZMGViL1FMQXJ0U0JvNXFjTzRVNlRUbEFnTmlRSjNPUTR0MlR3U3RzTnFSV0cveUhkTUlKOWZJcTFxTU1CNVpzcG9IWXc3bG8zVEtkSTZZQ1d3VFJUVTYxcjZSYVMxQlF6S1dDc0tpcm1XUmtWYTZ5ZzFxSE1ZMDA0Mng3VjBya2pMb002Z1NoUUNTMXhMeTRWcVZRWkJZVWl0UzFsQWZDWUtHbFFJUThxcGRpeXI4V2lmZEtzd0tCV0d3RW5Ia2hOaXJWS0lpS1lPRTVNSmg0YmV5SVJZYXdER3hFRW1uMW1VaGkralYwTnBWQzhCazI0cVUvQ1ZkR3Zwak9wMGdSMjZlQW8vVDdnWFNPb0NnNS9pZ1dQWnA2UzdrTjk4MUZRWk1ZaG9oUDNsT3B1SUp6M1p6RTBtTkpRaWlNK0JvOXh3T0c2djVwWjRSTjJEczRMcWNSNnl6UFdObHZOSWxFQUxOQ2hYamxHdjFLejFEQ3RyN29ReWozc3YyNzhKSnUxS3ZpdHBUbHJ6OEh1RnFtTXVLMEFtMjhDNGdtcVh0U042cmlEWVJwY29nYmRjVWFqMXpQcXBVUmo1QzBWNGdFVUsvNGoxZHVXd1I4VjJNUjdncVlkcUNQaC9YM0hiUTZwREs0RTNIdVZKMUVLUG8xbURWZ0x1eDVRSUJZa1dHT0dhcTFSTUt3SDNxS3ZXS21UdmlJdnB5YkRHMnphaU5jL1Bjcm11N2lQSWNPcWp3NklwTkZzL21KNVRnTmN6aG4rUitTd3lVNWRVUTVrdnFRQjJ6MGdDenNkN29DM24rSXZ1SXpmQTdaemk3M3ZmbWMvTzRXWDFZN1g3OGxuY3lnbityaHJlNm9oV24rRnhMZ3F2QWRpaCthMHNrdyt6VndhM2JBVXZmY0cvWUxrTzN1cUtSdnF5Z2tjNUttMzY2VmJFR2FKYThBZ3RMTWdPYmxzQlRYd1F3VU9jdHRaN1A2MmFWdDR4NlFxZXBJdExpYjJlU2k5THJaUTYxbEpKQlNWSm4rOEhwejdmQzgrYS93QzFaQVhzM1VoVUhBQUFBQ1YwUlZoMFpHRjBaVHBqY21WaGRHVUFNakF5TUMwd05DMHlOMVF3T0RvME5UbzBOU3N3TURvd01CYXdTVlFBQUFBbGRFVllkR1JoZEdVNmJXOWthV1o1QURJd01qQXRNRFF0TWpkVU1EZzZORFU2TkRVck1EQTZNREJuN2ZIb0FBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCM2QzY3VhVzVyYzJOaGNHVXViM0pubSs0OEdnQUFBQUJKUlU1RXJrSmdnZz09XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgVkFMSUQ6ICdWQUxJRCcsXHJcbiAgSU5WQUxJRDogJ0lOVkFMSUQnLFxyXG4gIElOQUNUSVZFOiAnSU5BQ1RJVkUnXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2NvbnN0cmFpbnRcclxuICBFTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjogJ1BBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBFTVBUWV9TVFJJTkdfVkFMSURBVElPTjogJ0VNUFRZX1NUUklOR19WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjogJ1BBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OJyxcclxuICAvL2F1dGhcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnSU5WQUxJRF9DUkVERU5USUFMUycsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICdVU0VSTkFNRV9UQUtFTicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ1JFR0lTVEVSRURfRU1BSUwnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnRU1BSUxfTk9UX1JFR0lTVEVSRUQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOidVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIElOVkFMSURfUEFTU1dPUkQ6XHJcbiAgICAnYXQgbGVhc3QgOCBjaGFyYWN0ZXJzLCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMSB1cHBlcmNhc2UgbGV0dGVyLCAxIGxvd2VyY2FzZSBsZXR0ZXIsIENhbiBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycycsXHJcbiAgSU5WQUxJRF9FTUFJTDogJ2VtYWlsIGZvcm1hdCBpcyBub3QgdmFsaWQnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnZW1haWwgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOiAndXNlcm5hbWUgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUU6XHJcbiAgICAnb25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWQnLFxyXG4gIElOVkFMSURfRU1QVFlfU1RSSU5HOiAnZW1wdHkgc3RyaW5nIGlzIG5vdCBhbGxvd2VkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMOiAnZW1haWwgb3IgdXNlcm5hbWUgaXMgbm90IHZhbGlkJyxcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICd1c2VybmFtZSBpcyBhbHJlYWR5IHRha2VuJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnZW1haWwgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyxcclxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCdcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlthLXpBLVpdKS57OCx9JC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/L2c7XHJcblxyXG5leHBvcnQgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9bYS16QS1aXStbLV9dKlthLXpBLVpdKy9nO1xyXG4iLCJpbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuaW1wb3J0IHsgZW1haWxSZWdleCwgcGFzc3dvcmRSZWdleCwgdXNlcm5hbWVSZWdleCB9IGZyb20gJy4vdmFsaWRhdGlvblJlZ2V4JztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxDb25zdHJhaW50KHsgZW1haWwgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdChlbWFpbCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkge1xyXG4gIGNvbnN0IHBhc3N3b3JkQ29uc3RyYWludCA9IG5ldyBSZWdFeHAocGFzc3dvcmRSZWdleCk7XHJcbiAgaWYgKHBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbiAgaWYgKCFwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pIHtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodXNlcm5hbWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoeyB2YWx1ZSB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pIHtcclxuICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSkge1xyXG5cclxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtIH0gPWF1dGg7XHJcbmRlYnVnZ2VyO1xyXG4gIGlmIChwYXNzd29yZCA9PT0gJycgfHwgcGFzc3dvcmQgIT09IGNvbmZpcm0pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6ICdJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBSRVNFVF9WQUxJREFUSU9OX1NUQVRFOiAnUkVTRVRfVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBJTlBVVF9CTFVSUkVEOiAnSU5QVVRfQkxVUlJFRCcsXHJcbiAgICBJTlBVVF9GT0NVU0VEOiAnSU5QVVRfRk9DVVNFRCcsXHJcbiAgXHJcbiAgICBTRVJWRVJfVkFMSURBVElPTjogJ1NFUlZFUl9WQUxJREFUSU9OJyxcclxuICAgIENMSUVOVF9WQUxJREFUSU9OOidDTElFTlRfVkFMSURBVElPTicsXHJcbiAgXHJcbiAgICBJTkNfSU5QVVRfQ09VVE4gOidJTkNfSU5QVVRfQ09VVE4nXHJcbiAgfTtcclxuICAiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9sb2dpblxyXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcclxuICAvL3NpZ251cFxyXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXHJcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxyXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXHJcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxyXG4gIC8vbG9naW5cclxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXHJcbiAgZW1wdHlTdHJpbmdOb3RWYWxpZDogJzQwOScsXHJcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXHJcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXHJcbi8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxyXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcclxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XHJcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuIiwiXHJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xyXG5pbXBvcnQgY29uc3RWYWxUeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGUsIHZhbHVlLCBzdGF0ZSxhdXRoIH0pIHtcclxuXHJcbiAgbGV0IHZhbGlkYXRpb24gPSBudWxsO1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtcclxuICAgICAgICBlbWFpbDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgXHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT04sIC4uLnZhbGlkYXRpb24gfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXRGb3JtVmFsaWRhdGlvblN0YXRlKCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTiB9O1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwIH0pIHtcclxuXHJcbiAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5jcmVkZW50aWFsSW52YWxpZDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzUmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlJFR0lTVEVSRURfRU1BSUwsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFR0lTVEVSRURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzVGFrZW46XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlTdHJpbmdOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmREb05vdE1hdGNoOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyBzZXJ2ZXJWYWxpZGF0aW9uIH0gZnJvbSAnLi4vZm9ybS9hY3Rpb25zJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi4vZm9ybS9odHRwLXN0YXR1cyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgcHJvcE5hbWUsXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCB9ID0gc3RhdGU7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9sb2dpbmAsIHtcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICdDb250ZW4tVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICcqJyxcclxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmFzaWMgJHtidG9hKGAke2VtYWlsb3J1c2VybmFtZX06JHtwYXNzd29yZH1gKX1gLFxyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gXHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0pO1xyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgXHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgIFxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvZ2luIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbnVwKHsgZGlzcGF0Y2gsIGZvcm1EaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQgfSk7XHJcbiAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIHVzZXJuYW1lIH0gPSBzdGF0ZTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvc2lnbnVwYCwge1xyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhc3N3b3JkLCBlbWFpbCwgdXNlcm5hbWUgfSksXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICBDb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUywgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbnVwIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd3ZWJjb20nKTtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUyB9O1xyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoLCB0b2tlbiB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBjb25maXJtLCBwYXNzd29yZCB9ID0gc3RhdGU7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpX3VybH0vYXV0aC9jaGFuZ2VwYXNzYCwge1xyXG4gICAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgY29uZmlybSxcclxuICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICB0b2tlbixcclxuICAgICAgfSksXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgbWVzc2FnZTogYFBhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LmAsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgICBlcnJvcixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3IgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkge1xyXG4gIGRlYnVnZ2VyO1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvcmVxdWVzdHBhc3NjaGFuZ2VgLCB7XHJcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsIH0pLFxyXG4gICAgfSk7XHJcbiAgICBkZWJ1Z2dlcjtcclxuXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyxcclxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICAgIG1lc3NhZ2U6IGBBIGxpbmsgZm9yIHBhc3N3b3JkIGNoYW5nZSAgaGFzIGJlZW4gc2VudCB0bywgJHtlbWFpbH0hIGAsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCxcclxuICAgICAgICBlcnJvcixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkwsXHJcbiAgICB0b2tlbixcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHsgdXNlciwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFLCB1c2VyIH0pO1xyXG59XHJcbiIsIlxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9saXN0JztcbmltcG9ydCB1c2VySWNvbiBmcm9tICcuL2ljb25zL3VzZXI2NC5wbmcnO1xuaW1wb3J0IHsgbG9nb3V0IH0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIGdyaWQ6IHtcbiAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ2F1dG8gNSUgYXV0bycsXG4gICAganVzdGlmeUl0ZW1zOiAnY2VudGVyJyxcbiAgICBwYWRkaW5nOjE2XG4gIH0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQXV0aERyYXdlckNvbnRlbnQoKSB7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHtvbkFwcFJvdXRlfSA9IHVzZUFwcFJvdXRlKCk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6IGAvJHtpZH1gLHJvdXRlOicvYXV0aCd9KTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nVG9wOiAxMCB9fT5cbiAgICAgIHshc3RhdGUudXNlcm5hbWUgJiYgPFVuQXV0aGVkU3RhdGUgaGFuZGxlUm91dGU9e2hhbmRsZVJvdXRlfSAvPn1cbiAgICAgIHtzdGF0ZS51c2VybmFtZSAmJiAoXG4gICAgICAgIDxBdXRoZWRTdGF0ZVxuICAgICAgICBvbkFwcFJvdXRlPXtvbkFwcFJvdXRlfVxuICAgICAgICAgIGhhbmRsZVJvdXRlPXtoYW5kbGVSb3V0ZX1cbiAgICAgICAgICB1c2VyTmFtZT17c3RhdGUudXNlcm5hbWV9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAgPGhyIHN0eWxlPXt7IGhlaWdodDogMSB9fSAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQXV0aGVkU3RhdGUoeyBoYW5kbGVSb3V0ZSwgdXNlck5hbWUgLG9uQXBwUm91dGV9KSB7XG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ091dCgpIHtcbiAgIFxuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTonLycscm91dGU6Jy9ob21lJ30pO1xuICAgIGxvZ291dCgpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aW1nIHNyYz17dXNlckljb259IHN0eWxlPXt7IHBhZGRpbmdSaWdodDogNSB9fSAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZUxvZ091dH0gaWQ9J2xvZ291dCcgZGF0YS10ZXN0aWQ9J2xvZ291dCc+XG4gICAgICAgICAgICBMb2dvdXRcbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogOCB9fT5XZWxjb21lLCB7dXNlck5hbWV9PC9kaXY+XG4gICAgICA8TGlzdD5cbiAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nY2hhbmdlcGFzc3dvcmQnPlxuICAgICAgICAgIENoYW5nZSBQYXNzd29yZFxuICAgICAgICA8L0xpc3RJdGVtPlxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVW5BdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuZ3JpZH0+XG4gICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nbG9naW4nIGRhdGEtdGVzdGlkPSdsb2dpbic+XG4gICAgICAgICAgTG9naW5cbiAgICAgICAgPC9hPlxuICAgICAgICA8ZGl2Pnw8L2Rpdj5cbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdzaWdudXAnIGRhdGEtdGVzdGlkPSdzaWdudXAnPlxuICAgICAgICAgIFNpZ251cFxuICAgICAgICA8L2E+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlVXNlck5hbWUoKSB7XHJcbiAgY29uc3QgW3VzZXJOYW1lLCBzZXRVc2VybmFtZV0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbdG9rZW4sIHNldFRva2VuXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IHsgc3RhdGUsZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICBcclxuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcbiBcclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgdG9rZW4sIGVtYWlsIH0gPSBKU09OLnBhcnNlKFxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJylcclxuICAgICAgKTtcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUudG9rZW4pIHtcclxuICBcclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwsIHRva2VuIH0gPXN0YXRlO1xyXG4gICAgICAvLyBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwgfSA9IEpTT04ucGFyc2UoXHJcbiAgICAgIC8vICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxyXG4gICAgICAvLyApO1xyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgfVxyXG4gIH0sIFtzdGF0ZV0pO1xyXG5cclxuICByZXR1cm4geyB1c2VyTmFtZSwgdG9rZW4sIGVtYWlsIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbGlzdCc7XG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnO1xuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvYWN0aW9uVHlwZXMnXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dERyYXdlckNvbnRlbnQoKSB7XG5cbmNvbnN0IHtvbkFwcFJvdXRlfSA9dXNlQXBwUm91dGUoKVxuXG4gIGNvbnN0IHsgdXNlck5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcbiAgICBpZiAodXNlck5hbWUpIHtcblxuICAgICAgb25BcHBSb3V0ZSh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlOicvaGFuZ291dHMnLHJvdXRlOicvaGFuZ291dHMnfSlcbiAgICB9IGVsc2Uge1xuXG4gICAgICBvbkFwcFJvdXRlKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGU6Jy9sb2dpbicscm91dGU6Jy9hdXRoJ30pXG4gICAgfVxuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxMaXN0PlxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGRhdGEtdGVzdGlkPSdoYW5nb3V0cyc+XG4gICAgICAgICAgSGFuZ291dFxuICAgICAgICA8L0xpc3RJdGVtPlxuIFxuICAgICAgPC9MaXN0PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgbWVzc2FnZUljb24gZnJvbSAnLi9tZXNzYWdlLnBuZyc7XG5jb25zdCBzdHlsZSA9IHtcbiAgY291bnQ6IHtcbiAgICB3aWR0aDogMzAsXG4gICAgaGVpZ2h0OiAzMCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicsXG4gICAgY29sb3I6ICd3aGl0ZScsXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxuICAgIGJvcmRlclJhZGl1czoxNSxcbiAgICBkaXNwbGF5OidmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OidjZW50ZXInXG4gIH0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE1lc3NhZ2UoeyBjb3VudD0wIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cbiAgICAgICAgICA8ZGl2Pm1lc3NhZ2U6PC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jb3VudH0gZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWNvdW50XCI+e2NvdW50fTwvZGl2PiBcbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFNldHRpbmdzKHByb3BzKSB7XHJcblxyXG4gIGNvbnN0IHsgaGVpZ2h0ID0gMjQsXHJcbiAgICB3aWR0aCA9IDI0LFxyXG4gICAgZmlsbCA9ICdub25lJyxcclxuICAgIGNvbG9yID0gJ2JsYWNrJyxvbkNsaWNrICxpZH09cHJvcHNcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9ICBpZD17aWR9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDBWMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0vPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIGNvbG9yPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2Yy0uMTItLjIyLS4zOS0uMy0uNjEtLjIybC0yLjQ5IDFjLS41Mi0uNC0xLjA4LS43My0xLjY5LS45OGwtLjM4LTIuNjVDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJoLTRjLS4yNSAwLS40Ni4xOC0uNDkuNDJsLS4zOCAyLjY1Yy0uNjEuMjUtMS4xNy41OS0xLjY5Ljk4bC0yLjQ5LTFjLS4yMy0uMDktLjQ5IDAtLjYxLjIybC0yIDMuNDZjLS4xMy4yMi0uMDcuNDkuMTIuNjRsMi4xMSAxLjY1Yy0uMDQuMzItLjA3LjY1LS4wNy45OHMuMDMuNjYuMDcuOThsLTIuMTEgMS42NWMtLjE5LjE1LS4yNC40Mi0uMTIuNjRsMiAzLjQ2Yy4xMi4yMi4zOS4zLjYxLjIybDIuNDktMWMuNTIuNCAxLjA4LjczIDEuNjkuOThsLjM4IDIuNjVjLjAzLjI0LjI0LjQyLjQ5LjQyaDRjLjI1IDAgLjQ2LS4xOC40OS0uNDJsLjM4LTIuNjVjLjYxLS4yNSAxLjE3LS41OSAxLjY5LS45OGwyLjQ5IDFjLjIzLjA5LjQ5IDAgLjYxLS4yMmwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NGwtMi4xMS0xLjY1ek0xMiAxNS41Yy0xLjkzIDAtMy41LTEuNTctMy41LTMuNXMxLjU3LTMuNSAzLjUtMy41IDMuNSAxLjU3IDMuNSAzLjUtMS41NyAzLjUtMy41IDMuNXonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHdpZHRoOiAxNSxcbiAgaGVpZ2h0OiAxNSxcblxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBPbmxpbmVTdGF0dXMoeyByZWFkeVN0YXRlIH0pIHtcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICByZXR1cm4gPElzT25saW5lIC8+O1xuICB9IGVsc2UgaWYgKHJlYWR5U3RhdGUgPT09IDApIHtcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMikge1xuICAgIHJldHVybiA8Q2xvc2luZyAvPjtcbiAgfVxuICByZXR1cm4gPElzT2ZmbGluZSAvPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT25saW5lKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwib25saW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc09mZmxpbmUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3JlZCcgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwib2ZmbGluZVwiXG4gICAgPjwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29ubmVjdGluZygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJjb25uZWN0aW5nXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDbG9zaW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdwaW5rJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJjbG9zaW5nXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUGVuZGluZ0hhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb25saW5lLGlzQmxvY2tlciB9KSB7XG5kZWJ1Z2dlcjtcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSwgc3RhdGUsIGVtYWlsIH0gPSBoYW5nb3V0O1xuICBsZXQgaGFuZ291dEtleSA9ICcnO1xuICBsZXQgbWVzc2FnZUtleSA9ICcnO1xuICBpZiAob25saW5lKSB7XG4gICAgZGVidWdnZXI7XG4gICAgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICB9IGVsc2Uge1xuICAgIGRlYnVnZ2VyO1xuICAgIGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tb2ZmbGluZS1tZXNzYWdlc2A7XG4gIH1cblxuICBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xuICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnRleHQgIT09XCJcIikge1xuICAgIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgdXNlcm5hbWUsIG1lc3NhZ2UsZGlzcGF0Y2gsaXNCbG9ja2VyIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgZGVidWdnZXI7XG4gICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG4gICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGhhbmdvdXQpO1xuICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xuICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xuICB9IGVsc2Uge1xuICAgIGRlYnVnZ2VyO1xuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtoYW5nb3V0XTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XG4gIH1cbiBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSkge1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gW107XG4gIGlmIChtZXNzYWdlcykge1xuIFxuICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgbWVzc2FnZV07XG4gIH0gZWxzZSB7XG5cbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbbWVzc2FnZV07XG4gIH1cbiAgaWYoaXNCbG9ja2VyKXtcbiBcbiAgICBjb25zdCBibG9ja2VyID1bLi4udXBkYXRlZE1lc3NhZ2VzLHt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIHRoaXMgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZC4nXG4gICAgLHRpbWVzdGFtcDogRGF0ZS5ub3coKSx0eXBlOidibG9ja2VyJyx1c2VybmFtZTptZXNzYWdlLnVzZXJuYW1lLGZsb2F0OidyaWdodCd9XVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KGJsb2NrZXIpKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiBibG9ja2VyIH0pO1xuICBcbiAgfVxuICBlbHNle1xuICBcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XG4gIH1cbiBcblxufVxuIiwiaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuLi8uLi9jbGllbnRDb21tYW5kcyc7XG5leHBvcnQgZnVuY3Rpb24gc2VuZE9mZmxpbmVIYW5nb3V0cyh7IGRpc3BhdGNoLCBzb2NrZXQsIG5hbWUgfSkge1xuICBjb25zdCBvZmZsaW5lSGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xuICBjb25zdCBvZmZsaW5lSGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG9mZmxpbmVIYW5nb3V0S2V5KSk7XG4gIGlmIChvZmZsaW5lSGFuZ291dHMpIHtcbiAgICBvZmZsaW5lSGFuZ291dHMuZm9yZUVhY2goKGgpID0+IHtcbiAgICAgIHNvY2tldC5zZW5kKFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgdXNlcm5hbWU6IGgudXNlcm5hbWUsXG4gICAgICAgICAgZW1haWw6IGguZW1haWwsXG4gICAgICAgICAgbWVzc2FnZTogaC5tZXNzYWdlLFxuICAgICAgICAgIHRpbWVzdGFtcDogaC50aW1lc3RhbXAsXG4gICAgICAgICAgY29tbWFuZDogaC5zdGF0ZSxcbiAgICAgICAgICBvZmZsaW5lOiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm47XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZSwgaGFuZ291dCxkaXNwYXRjaH0pe1xuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XG4gICAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcbiAgICBsZXQgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XG4gICBcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgY29uc3QgZmlsdGVyZWRIYW5nb3V0cyA9IHVucmVhZGhhbmdvdXRzLmZpbHRlcihmdW5jdGlvbih1bnJlYWQpICB7XG4gICAgICAgICAgICByZXR1cm4gIHVucmVhZC51c2VybmFtZSAhPT0gdXNlcm5hbWV9KTtcbiAgICAgICAgIFxuICAgICAgICAgICAgaWYoZmlsdGVyZWRIYW5nb3V0cy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkoZmlsdGVyZWRIYW5nb3V0cykpO1xuICAgICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXG4gICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHM6IGZpbHRlcmVkSGFuZ291dHMsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odW5yZWFkaGFuZ291dHNLZXkpO1xuICAgICAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcbiAgICAgICAgICAgICAgICAgIHVucmVhZGhhbmdvdXRzOiBbXSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgIFxuICAgICAgXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcbmltcG9ydCB7IHVwZGF0ZUxvY2FsSGFuZ291dHMgfSBmcm9tICcuL3VwZGF0ZUxvY2FsSGFuZ291dHMnO1xuaW1wb3J0IHsgc2F2ZVBlbmRpbmdIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnO1xuaW1wb3J0IHtcbiAgc2VsZWN0SGFuZ291dCxcbiAgc2VsZWN0VW5yZWFkLFxuICBzZWFyY2hIYW5nb3V0cyxcbiAgZmlsdGVySGFuZ291dHMsXG4gIGZldGNoSGFuZ291dCxcbiAgY2hhbmdlTWVzc2FnZVRleHQsXG5cbiAgc3RhcnRDbGllbnRDb21tYW5kLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgc2VuZE9mZmxpbmVIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2VuZE9mZmxpbmVIYW5nb3V0cyc7XG5pbXBvcnQge3JlbW92ZUhhbmdvdXRGcm9tVW5yZWFkfSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQnXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHNlYXJjaCxcbiAgICB1c2VycyxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlcyxcbiAgICBzb2NrZXRNZXNzYWdlLFxuICAgIHJlYWR5U3RhdGUsXG4gICAgc29ja2V0LFxuICAgIHVucmVhZGhhbmdvdXRzLFxuICB9ID0gc3RhdGU7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc29ja2V0ICYmIHJlYWR5U3RhdGUgPT09IDEgJiYgdXNlcm5hbWUpIHtcbiAgICAgIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBuYW1lOiB1c2VybmFtZSwgZGlzcGF0Y2gsIHNvY2tldCB9KTtcbiAgICB9XG4gIH0sIFtzb2NrZXQsIHJlYWR5U3RhdGUsIHVzZXJuYW1lXSk7XG5cbiAgZnVuY3Rpb24gb25SZW1vdmVVbnJlYWQoZSl7XG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBpZCk7XG4gICBkZWJ1Z2dlcjtcbiAgICByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZTp1c2VybmFtZSxkaXNwYXRjaCxoYW5nb3V0fSlcbiAgfVxuICBmdW5jdGlvbiBvbk5hdmlnYXRpb24oZSl7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgLy8gY29uc3QgaWQgPWUudGFyZ2V0LmlkXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxuICAgZGVidWdnZXI7XG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2lkfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgZGVidWdnZXI7XG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG5cbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XG4gICAgc2VhcmNoSGFuZ291dHMoeyBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlLCBkaXNwYXRjaCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU3RhcnRTZWFyY2goZSkge1xuICAgIGlmIChoYW5nb3V0cyAmJiBoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgICBmZXRjaEhhbmdvdXQoeyBkaXNwYXRjaCwgc2VhcmNoLCB1c2VybmFtZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcbiAgICBjb25zdCB0ZXh0ID0gZS50YXJnZXQudmFsdWU7XG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkhhbmdvdXQoZSkge1xuICAgXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0OiAnJywgZGlzcGF0Y2ggfSk7XG4gICAgY29uc3QgY29tbWFuZCA9IGUudGFyZ2V0LmlkO1xuICAgIGNvbnN0IHsgZW1haWwgfSA9IGhhbmdvdXQ7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgIG1lc3NhZ2VUZXh0ICE9PSAnJyA/IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCB9IDogbnVsbDtcblxuICAgIGNvbnN0IG9ubGluZSA9IHRydWU7XG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcbiAgICBpZiAoc29ja2V0ICYmIHJlYWR5U3RhdGUgPT09IDEpIHtcbiAgIFxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xuICAgICAgIFxuICAgICAgICBpc0Jsb2NrZXI9dHJ1ZVxuICAgICAgfWVsc2V7XG4gICAgICAgXG4gICAgICAgIHNvY2tldC5zZW5kKFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxuICAgICAgICAgICAgZW1haWwsXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgY29tbWFuZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgXG4gICAgICB9XG4gICAgXG4gICAgfSBlbHNlIHtcbiAgICAgIG9ubGluZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XG4gICAgICBkaXNwYXRjaCxcbiAgICAgIG5hbWU6IHVzZXJuYW1lLFxuICAgICAgaGFuZ291dDoge1xuICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHN0YXRlOiBjb21tYW5kLFxuICAgICAgICBtZXNzYWdlOiB7IHRleHQ6IG1lc3NhZ2VUZXh0LCB0aW1lc3RhbXAsIGRlbGl2ZXJlZDogZmFsc2UsIHVzZXJuYW1lIH0sXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgZGVsaXZlcmVkOiBmYWxzZSxcbiAgICAgICAgXG4gICAgICB9LFxuICAgICAgb25saW5lLFxuICAgICAgaXNCbG9ja2VyXG4gICAgfSk7XG5cbiAgIFxuXG5cbiAgfS8vZW5kIG9uSGFuZ291dFxuICByZXR1cm4ge1xuICAgIG9uTmF2aWdhdGlvbixcbiAgICBvblNlbGVjdFVucmVhZCxcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25TZWFyY2gsXG4gICAgc2VhcmNoLFxuICAgIG9uU2VsZWN0SGFuZ291dCxcbiAgICBkaXNwYXRjaCxcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICAgIG1lc3NhZ2VzLFxuICAgIG9uSGFuZ291dCxcbiAgICB1bnJlYWRoYW5nb3V0cyxcbiAgICByZWFkeVN0YXRlLFxuICAgIG9uUmVtb3ZlVW5yZWFkXG4gIH07XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IE5hdkl0ZW0gfSBmcm9tICcuLi8uLi9uYXYvTmF2SXRlbSc7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vLi4vaWNvbnMvTWVzc2FnZSc7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4uLy4uL2ljb25zL1NldHTEsW5ncyc7XG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi8uLi9pY29ucy9vbmxpbmVTdGF0dXMnO1xuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuLi9zdGF0ZS91c2VIYW5nb3V0cyc7XG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnO1xuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0VG9wTWVudSgpIHtcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xuICBjb25zdCB7IHVzZXJOYW1lIH0gPSB1c2VVc2VyTmFtZSgpO1xuICBjb25zdCB7IHJlYWR5U3RhdGUsIHVucmVhZGhhbmdvdXRzLCBvbk5hdmlnYXRpb24sIGhhbmdvdXQgfSA9IHVzZUhhbmdvdXRzKCk7XG5cbiAgZnVuY3Rpb24gbmF2VG9VbnJlYWQoKSB7XG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogJy9VTlJFQUQnLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cbiAgICAgIDxOYXZJdGVtPnt1c2VyTmFtZX08L05hdkl0ZW0+XG4gICAgICA8TmF2SXRlbT5cbiAgICAgICAgPE9ubGluZVN0YXR1cyByZWFkeVN0YXRlPXtyZWFkeVN0YXRlfSAvPlxuICAgICAgPC9OYXZJdGVtPlxuICAgICAgPE5hdkl0ZW0gb25DbGljaz17bmF2VG9VbnJlYWR9IGRhdGEtdGVzdGlkPVwibmF2LXVucmVhZHNcIj5cbiAgICAgICAge3VucmVhZGhhbmdvdXRzICYmIDxNZXNzYWdlIGNvdW50PXt1bnJlYWRoYW5nb3V0cy5maWx0ZXIoZj0+Zi5yZWFkPT09ZmFsc2UpLmxlbmd0aH0gLz59eycgJ31cbiAgICAgIDwvTmF2SXRlbT5cbiAgICAgIHtoYW5nb3V0ICYmIChcbiAgICAgICAgPE5hdkl0ZW0gICAgb25DbGljaz17b25OYXZpZ2F0aW9ufSBkYXRhLXRlc3RpZD1cIm5hdi1jb25maWdcIiBpZD1cImNvbmZpZ3VyZVwiID5cbiAgICAgICAgICA8U2V0dGluZ3NcbiAgICAgICAgICAgIGZpbGw9XCJ3aGl0ZVwiXG4gICAgICAgICAgICB3aWR0aD1cIjMwXCJcbiAgICAgICAgICAgIGhlaWdodD1cIjMwXCJcbiAgICAgICAgIFxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTmF2SXRlbT5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG4vL1xuIiwiZXhwb3J0IGNvbnN0IGRyYXdlciA9IHtcclxuICBib3hTaGFkb3c6IGAwcHggM3B4IDNweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSwwcHggM3B4IDRweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDFweCA4cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xMilgLFxyXG5cclxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICBsZWZ0OiAwLFxyXG4gIHRvcDogMCxcclxuICB6SW5kZXg6IDEwLFxyXG4gIGhlaWdodDogJzEwMHZoJyxcclxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjVmNWY1JyxcclxufTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tICcuL2RldmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKSB7XHJcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW29yaWVudGF0aW9uLCBzZXRPcmllbnRhdGlvbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2RldmljZSwgc2V0RGV2aWNlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XHJcbiAgIFxyXG4gICAgICBzZXRXaWR0aCh3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbiAgICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpIHtcclxuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xyXG4gIH1cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoID4gMCkge1xyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDYwMDpcclxuICAgICAgICAgIHNldERldmljZSgncGhvbmUnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNzY4OlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gOTkyOlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcclxuICAgICAgICAgIHNldERldmljZSgndGFibGV0Jyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2xhcHRvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2Rlc2t0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3dpZHRoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2aWNlJywgZGV2aWNlKTtcclxuICB9LCBbZGV2aWNlXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGhhbmRsZVZpZXdwb3J0U2l6ZSgpO1xyXG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XHJcbn1cclxuIiwiXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBkcmF3ZXIgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XG5pbXBvcnQgeyB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnLi9OYXZQcm92aWRlcic7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmF3ZXIocHJvcHMpIHtcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XG4gIGNvbnN0IHsgb3Blbiwgb25DbGljaywgY2hpbGRyZW4gfSA9IHByb3BzO1xuICBjb25zdCB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9ID0gdXNlTmF2aWdhdGlvbigpO1xuXG4gIGlmIChkcmF3ZXJPcGVuKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7IC4uLmRyYXdlciB9fVxuICAgICAgICBjbGFzc05hbWU9e2BkcmF3ZXItJHtkZXZpY2V9LXdpZHRoYH1cbiAgICAgICAgb25DbGljaz17dG9nZ2xlRHJhd2VyfVxuICAgICAgPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICByZXR1cm4gbnVsbDtcbn1cblxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VUaGVtZUNvbnRleHQgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcbmV4cG9ydCBmdW5jdGlvbiBBcHBCYXIoeyBjaGlsZHJlbiB9KSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgLi4udGhlbWUucHJpbWFyeSxcbiAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAvLyBsZWZ0OiAwLFxuICAgICAgICAgdG9wOiAwLFxuICAgICAgICBtaW5IZWlnaHQ6IDY0LFxuICAgICAgIC8vIHBhZGRpbmdMZWZ0OiAxNixcbiAgICAgICAvLyBwYWRkaW5nUmlnaHQ6IDE2LFxuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBkaXNwbGF5OidmbGV4J1xuICAgICAgfX1cbiAgICA+XG4gICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgJy4uL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudVdoaXRlKHsgb25DbGljaywgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPVwibWVudS13aGl0ZVwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICBmaWxsPVwid2hpdGVcIlxyXG4gICAgICB3aWR0aD1cIjI0cHhcIlxyXG4gICAgICBoZWlnaHQ9XCIyNHB4XCJcclxuICAgID5cclxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMyAxOGgxOHYtMkgzdjJ6bTAtNWgxOHYtMkgzdjJ6bTAtN3YyaDE4VjZIM3pcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZU5hdmlnYXRpb24gfSBmcm9tICcuL05hdlByb3ZpZGVyJztcbmltcG9ydCB7IE1lbnVXaGl0ZSB9IGZyb20gJy4vaWNvbnMvTWVudVdoaXRlJztcbmV4cG9ydCBmdW5jdGlvbiBNZW51KCkge1xuICBjb25zdCB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9ID0gdXNlTmF2aWdhdGlvbigpO1xuXG4gIHJldHVybiA8TWVudVdoaXRlIG9uQ2xpY2s9e3RvZ2dsZURyYXdlcn0gaWQ9XCJtZW51XCIgLz47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xuaW1wb3J0IHsgTmF2SXRlbSB9IGZyb20gJy4uL25hdi9OYXZJdGVtJztcbmltcG9ydCB7IERyYXdlckNvbnRlbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL0RyYXdlckNvbnRlbnQnO1xuaW1wb3J0IHsgQXV0aERyYXdlckNvbnRlbnQgfSBmcm9tICcuLi9hdXRoL0F1dGhEcmF3ZXJDb250ZW50JztcbmltcG9ydCB7IEhhbmdvdXREcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vaGFuZ291dHMvbmF2L0hhbmdvdXREcmF3ZXJDb250ZW50JztcbmltcG9ydCB7IEhhbmdvdXRUb3BNZW51IH0gZnJvbSAnLi4vaGFuZ291dHMvbmF2L0hhbmdvdXRUb3BNZW51JztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuaW1wb3J0IHsgcmVjb3ZlckxvY2FsQXV0aFN0YXRlIH0gZnJvbSAnLi4vYXV0aC9hY3Rpb25zJztcbmltcG9ydCBEcmF3ZXIgZnJvbSAnLi4vbmF2L0RyYXdlcic7XG5pbXBvcnQgeyBBcHBCYXIgfSBmcm9tICcuLi9uYXYvQXBwQmFyJztcbmltcG9ydCB7IE1lbnUgfSBmcm9tICcuLi9uYXYvTWVudSc7XG5leHBvcnQgZnVuY3Rpb24gQXBwTmF2aWdhdGlvbigpIHtcbiAgICBjb25zdCB7IGRpc3BhdGNoIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xuXG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XG4gICAgICAgICAgcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHtcbiAgICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgICAgdXNlcjogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCBbXSk7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxBcHBCYXI+XG4gICAgICAgIDxNZW51IC8+XG4gICAgICAgIDxOYXZJdGVtIHN0eWxlPXt7IGZsZXg6IDUgfX0+V0VCIENPTTwvTmF2SXRlbT5cbiAgICAgICAgPEhhbmdvdXRUb3BNZW51IC8+XG4gICAgICA8L0FwcEJhcj5cbiAgICAgIDxEcmF3ZXI+XG4gICAgICAgIDxBdXRoRHJhd2VyQ29udGVudCAvPlxuICAgICAgICA8SGFuZ291dERyYXdlckNvbnRlbnQgLz5cbiAgICAgIDwvRHJhd2VyPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSG9tZSgpIHtcclxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD0naG9tZScgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+SG9tZTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuXHJcbmltcG9ydCB7RmVhdHVyZVJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9Mb2dpbicpKTtcclxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9DaGFuZ2VQYXNzd29yZCcpKTtcclxuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvU2lnbnVwJykpO1xyXG5jb25zdCBQcm9maWxlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvUHJvZmlsZScpKTtcclxuY29uc3QgQXV0aEZlZWRiYWNrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvQXV0aEZlZWRiYWNrJykpO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoZW50aWNhdGlvbih7IGNoaWxkcmVuIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvY2hhbmdlcGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9sb2dpbic+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPExvZ2luIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9zaWdudXAnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxTaWdudXAgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2ZvcmdvdHBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Rm9yZ290UGFzc3dvcmQgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3Byb2ZpbGUnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQcm9maWxlIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEF1dGhGZWVkYmFjayAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7IHZhbGlkYXRpb246IHt9IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybVJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG5cclxuICBsZXQgbmV4dFN0YXRlID0gbnVsbDtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcblxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTlBVVF9GT0NVU0VEOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgIFthY3Rpb24ucHJvcE5hbWVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGNvdW50OiBzdGF0ZS5jb3VudCArIDEgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgZm9ybVJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vZm9ybVJlZHVjZXInO1xyXG5jb25zdCBGb3JtQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VGb3JtQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChGb3JtQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUZvcm1Db250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEZvcm1Qcm92aWRlcicpO1xyXG4gIH1cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9ybVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxGb3JtQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xuaW1wb3J0IHsgQXBwUm91dGUgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnLi9Ib21lJztcbmltcG9ydCBBdXRoZW50aWNhdGlvbiBmcm9tICcuLi9hdXRoL0F1dGhlbnRpY2F0aW9uJztcbmltcG9ydCB7IEZvcm1Qcm92aWRlciB9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0JztcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2hhbmdvdXRzJykpO1xuY29uc3QgR3JvdXAgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vZ3JvdXAvZ3JvdXAnKSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZXMoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e2hlaWdodDonMTAwJSd9fT5cbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2F1dGhcIj5cbiAgICAgICAgPEZvcm1Qcm92aWRlcj5cbiAgICAgICAgICA8QXV0aGVudGljYXRpb24gLz5cbiAgICAgICAgPC9Gb3JtUHJvdmlkZXI+XG4gICAgICA8L0FwcFJvdXRlPlxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvXCI+XG4gICAgICAgIDxIb21lIC8+XG4gICAgICA8L0FwcFJvdXRlPlxuXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdvdXRzIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L0FwcFJvdXRlPlxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvZ3JvdXBcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxHcm91cCAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9BcHBSb3V0ZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcblxuaW1wb3J0IHtBcHBOYXZpZ2F0aW9ufSBmcm9tICcuL0FwcE5hdmlnYXRpb24nXG5pbXBvcnQge0FwcFJvdXRlc30gZnJvbSAnLi9BcHBSb3V0ZXMnXG5pbXBvcnQgJy4vY3NzL2FwcC5jc3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMTAwdmgnIH19PlxuICAgICA8QXBwTmF2aWdhdGlvbi8+XG4gICAgICA8QXBwUm91dGVzLz5cbiAgICAgIHsnJ31cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgQXBwUm91dGVQcm92aWRlciB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJztcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcbmltcG9ydCB7IE5hdlByb3ZpZGVyIH0gZnJvbSAnLi4vbmF2L05hdlByb3ZpZGVyJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcbmV4cG9ydCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPFRoZW1lUHJvdmlkZXJcbiAgICAgIGluaXRTdGF0ZT17e1xuICAgICAgICBwcmltYXJ5OiB7XG4gICAgICAgICAgYmFja2dyb3VuZDogJyM2MjAwRUUnLFxuICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgSGVsdmV0aWNhLCBcIkFyaWFsXCInLFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8QXBwUm91dGVQcm92aWRlclxuICAgICAgICB0aXRsZT1cIldlYmNvbVwiXG4gICAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnIH19XG4gICAgICA+XG4gICAgICAgIDxBdXRoUHJvdmlkZXI+XG4gICAgICAgICAgPE5hdlByb3ZpZGVyPlxuICAgICAgICAgICAgPEhhbmdvdXRzUHJvdmlkZXIgc29ja2V0VXJsPXtgd3NzOi8vJHtpcH06MzAwMC9oYW5nb3V0c2B9PlxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XG4gICAgICAgICAgPC9OYXZQcm92aWRlcj5cbiAgICAgICAgPC9BdXRoUHJvdmlkZXI+XG4gICAgICA8L0FwcFJvdXRlUHJvdmlkZXI+XG4gICAgPC9UaGVtZVByb3ZpZGVyPlxuICApO1xufVxuIiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlcnMgfSBmcm9tICcuL0FwcFByb3ZpZGVycyc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxucmVuZGVyKFxyXG4gIDxBcHBQcm92aWRlcnM+XHJcbiAgICA8QXBwIC8+XHJcbiAgPC9BcHBQcm92aWRlcnM+LFxyXG5cclxuICBkb2N1bWVudC5ib2R5XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJmZXRjaCIsInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiRmVhdHVyZVJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImRpc3BhdGNoIiwiZmluZCIsInVzZUFwcFJvdXRlIiwib25BcHBSb3V0ZSIsIkFwcFJvdXRlIiwiQXBwUm91dGVQcm92aWRlciIsImluaXRTdGF0ZSIsInVzZVJlZHVjZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJTT0NLRVRfTUVTU0FHRV9SRUNJRVZFRCIsIk1FU1NBR0VTX1VQREFURUQiLCJIQU5HT1VUU19VUERBVEVEIiwiSEFOR09VVF9VUERBVEVEIiwiVU5SRUFEX0hBTkdPVVRTX1VQREFURUQiLCJDT05ORUNUSU5HIiwiT1BFTiIsIkNMT1NJTkciLCJDTE9TRUQiLCJTT0NLRVRfUkVBRFkiLCJTT0NLRVRfRVJST1IiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJ1bnJlYWRoYW5nb3V0cyIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwic29ja2V0IiwicmVhZHlTdGF0ZSIsInNvY2tldE1lc3NhZ2UiLCJ0ZXh0IiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJGSUxURVJfSEFOR09VVFMiLCJmaWx0ZXIiLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwibG9hZEhhbmdvdXRzIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWxlY3RVbnJlYWQiLCJzZWFyY2hIYW5nb3V0cyIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJjaGFuZ2VNZXNzYWdlVGV4dCIsImxvYWRNZXNzYWdlcyIsImtleSIsInVwZGF0ZVJlYWRIYW5nb3V0cyIsIm5hbWUiLCJtZXNzYWdlIiwidW5yZWFkaGFuZ291dHNLZXkiLCJsZW5ndGgiLCJ1cGRhdGVkdW5yZWFkIiwibWFwIiwicmVhZCIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJoYW5nb3V0S2V5IiwiaGFuZ291dEluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwiaGFuZ291dFN0YXRlcyIsIklOVklURVIiLCJBQ0NFUFRFUiIsIkRFQ0xJTkVSIiwiQkxPQ0tFUiIsIlVOQkxPQ0tFUiIsIk1FU1NBTkdFUiIsIklOVklURUQiLCJBQ0NFUFRFRCIsIkRFQ0xJTkVEIiwiQkxPQ0tFRCIsIlVOQkxPQ0tFRCIsIk1FU1NBR0VEIiwidXBkYXRlRGVsaXZlcmVkSGFuZ291dCIsIm9mZmxpbmUiLCJ0aW1lc3RhbXAiLCJkZWxpdmVyZWRIYW5nb3V0IiwiZGVsaXZlcmVkIiwidXBkYXRlRGVsaXZlcmVkTWVzc2FnZSIsInVwZGF0ZUJvY2tlZFN0YXRlIiwib2ZmbGluZUhhbmdvdXRLZXkiLCJvZmZsaW5laGFuZ291dHMiLCJkZWxpdmVyZWRNZXNzYWdlIiwibWVzc2FnZUtleSIsImJsb2NrZWRNZXNzYWdlIiwic2F2ZU1lc3NhZ2VkIiwic2F2ZUludml0ZWQiLCJzYXZlQWNjZXB0ZWQiLCJzYXZlRGVjbGluZWQiLCJzYXZlQmxvY2tlZCIsInNhdmVVbmJsb3ZrZWQiLCJzYXZlUmVjaWV2ZWRIYW5nb3V0IiwiZm9jdXNlZEhhbmdvdXQiLCJ1bnJlYWQiLCJoYW5nb3V0RXhpc3QiLCJoZyIsInVwZGF0ZWRIYW5nb3V0cyIsInNhdmVSZWNpZXZlZE1lc3NhZ2UiLCJzYXZlVW5yZWFkSGFuZ291dCIsInVwZGF0ZWRNZXNzYWdlcyIsInVwZGF0ZWR1bnJlYWRzIiwic2F2ZUludml0ZXIiLCJzYXZlQWNjZXB0ZXIiLCJzYXZlQmxvY2tlciIsInNhdmVEZWNsaW5lciIsInNhdmVNZXNzYW5nZXIiLCJzYXZlVW5ibG9ja2VyIiwidXNlU29ja2V0TWVzc2FnZSIsImhhbmRsZUFja25vd2xlZGdlbWVudCIsImhhbmRsZUhhbmdvdXQiLCJoYW5kbGVIYW5nb3V0cyIsImZvckVhY2giLCJ1c2VFZmZlY3QiLCJWQUxVRV9DSEFOR0VEIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJMT0dJTl9GQUlMRUQiLCJMT0dPVVRfU1RBUlRFRCIsIkxPR09VVF9GQUlMRUQiLCJMT0dPVVRfU1VDQ0VTUyIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSIsImVtYWlsIiwicGFzc3dvcmQiLCJzdWNjZXNzIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImlzTG9nZ2VkSW4iLCJpc1Bhc3N3b3JkQ2hhbmdlZCIsImF1dGhGZWVkYmFjayIsImF1dGhSZWR1Y2VyIiwibmV4dFN0YXRlIiwicGF5bG9hZCIsInByb3BOYW1lIiwic3VjY2Vzc01lc3NhZ2UiLCJBdXRoUm91dGVDb250ZXh0IiwiQXV0aFJvdXRlUHJvdmlkZXIiLCJpbml0aWFsUm91dGUiLCJhdXRoUm91dGUiLCJzZXRBdXRoUm91dGUiLCJ1c2VTdGF0ZSIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJ1c2VXZWJTb2NrZXQiLCJzb2NrZXRVcmwiLCJzb2NrIiwiV2ViU29ja2V0Iiwib25tZXNzYWdlIiwibXNnIiwiZGF0YSIsIm9ub3BlbiIsIm9uY2xvc2UiLCJvbmVycm9yIiwiSGFuZ291dENvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsIkhhbmdvdXRzUHJvdmlkZXIiLCJhdXRoQ29udGV4dCIsIndlYnNvY2tldEhhbmRsZXIiLCJoYW5kbGVVc2VTb2NrZXRNZXNzYWdlIiwidXBkYXRlZCIsIlRoZW1lQ29udGV4dCIsInVzZVRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJzZXRTdGF0ZSIsIk5hdkNvbnRleHQiLCJ1c2VOYXZDb250ZXh0IiwidXNlTmF2aWdhdGlvbiIsImRyYXdlck9wZW4iLCJzZXREcmF3ZXJPcGVuIiwidG9nZ2xlRHJhd2VyIiwicHJldiIsIk5hdlByb3ZpZGVyIiwiRSIsInciLCJDIiwibCIsIkEiLCJGIiwiTiIsIk0iLCJQIiwiaCIsIkQiLCJIIiwiJCIsInEiLCJOYXZJdGVtIiwiTGlzdCIsIkxpc3RJdGVtIiwiVkFMSUQiLCJJTlZBTElEIiwiSU5BQ1RJVkUiLCJFTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0aW9uVHlwZSIsInZhbGlkYXRpb25UeXBlcyIsInZhbGlkYXRpb25TdGF0ZSIsInZhbGlkYXRpb25NZXNzYWdlcyIsImlzQ2xpZW50VmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCIsInBhc3N3b3JkQ29uc3RyYWludCIsInZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50IiwidXNlcm5hbWVDb25zdHJhaW50IiwidmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUiLCJ2YWxpZGF0ZUVtcHR5U3RyaW5nIiwidmFsaWRhdGVQYXNzd29yZE1hdGNoIiwiYXV0aCIsIklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIiwiUkVTRVRfVkFMSURBVElPTl9TVEFURSIsIklOUFVUX0JMVVJSRUQiLCJJTlBVVF9GT0NVU0VEIiwiU0VSVkVSX1ZBTElEQVRJT04iLCJDTElFTlRfVkFMSURBVElPTiIsIklOQ19JTlBVVF9DT1VUTiIsImNyZWRlbnRpYWxJbnZhbGlkIiwidXNlcm5hbWVJc1Rha2VuIiwiZW1haWxJc1JlZ2lzdGVyZWQiLCJ1c2VybmFtZUludmFsaWQiLCJwYXNzd29yZEludmFsaWQiLCJlbWFpbEludmFsaWQiLCJlbWFpbElzTm90UmVnaXN0ZXJlZCIsImVtcHR5U3RyaW5nTm90VmFsaWQiLCJlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZCIsInVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkIiwicGFzc3dvcmREb05vdE1hdGNoIiwidG9rZW5FeHBpcmVkIiwic2VydmVyVmFsaWRhdGlvblJhbmdlIiwic3RhdHVzIiwiY2xpZW50VmFsaWRhdGlvbiIsInZhbGlkYXRpb24iLCJjb25zdFZhbFR5cGVzIiwidmFsaWRhdGlvbnMiLCJyZXNldElucHV0VmFsaWRhdGlvblN0YXRlIiwic2VydmVyVmFsaWRhdGlvbiIsImh0dHBTdGF0dXMiLCJ2YWxpZGF0aW9uU3RhdGVzIiwidmFsdWVDaGFuZ2VkIiwibG9naW4iLCJmb3JtRGlzcGF0Y2giLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsImJ0b2EiLCJtZXRob2QiLCJyZXN1bHQiLCJ3aW5kb3ciLCJlcnJvcnMiLCJzaWdudXAiLCJib2R5IiwiQ29udGVudFR5cGUiLCJBY2NlcHQiLCJsb2dvdXQiLCJyZW1vdmVJdGVtIiwiY2hhbmdlUGFzc3dvcmQiLCJhcGlfdXJsIiwiZm9yZ290UGFzc3dvcmQiLCJnZXRUb2tlbkZyb21VcmwiLCJyZWNvdmVyTG9jYWxBdXRoU3RhdGUiLCJzdHlsZSIsImdyaWQiLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImp1c3RpZnlJdGVtcyIsInBhZGRpbmciLCJBdXRoRHJhd2VyQ29udGVudCIsImhhbmRsZVJvdXRlIiwicHJldmVudERlZmF1bHQiLCJpZCIsInRhcmdldCIsInBhZGRpbmdUb3AiLCJoZWlnaHQiLCJBdXRoZWRTdGF0ZSIsInVzZXJOYW1lIiwiaGFuZGxlTG9nT3V0IiwiYWxpZ25JdGVtcyIsImZsZXhEaXJlY3Rpb24iLCJ1c2VySWNvbiIsInBhZGRpbmdSaWdodCIsIm1hcmdpbkJvdHRvbSIsIlVuQXV0aGVkU3RhdGUiLCJ1c2VVc2VyTmFtZSIsInNldFVzZXJuYW1lIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsIkhhbmdvdXREcmF3ZXJDb250ZW50IiwiY291bnQiLCJ3aWR0aCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwidGV4dEFsaWduIiwiYm9yZGVyUmFkaXVzIiwianVzdGlmeUNvbnRlbnQiLCJNZXNzYWdlIiwiU2V0dGluZ3MiLCJmaWxsIiwib25DbGljayIsImJvcmRlciIsIk9ubGluZVN0YXR1cyIsIklzT25saW5lIiwiSXNPZmZsaW5lIiwiQ29ubmVjdGluZyIsIkNsb3NpbmciLCJzYXZlUGVuZGluZ0hhbmdvdXQiLCJpc0Jsb2NrZXIiLCJzYXZlSGFuZ291dCIsInNhdmVNZXNzYWdlIiwiYmxvY2tlciIsIkRhdGUiLCJub3ciLCJmbG9hdCIsInNlbmRPZmZsaW5lSGFuZ291dHMiLCJvZmZsaW5lSGFuZ291dHMiLCJmb3JlRWFjaCIsInNlbmQiLCJjb21tYW5kIiwicmVtb3ZlSGFuZ291dEZyb21VbnJlYWQiLCJmaWx0ZXJlZEhhbmdvdXRzIiwidXNlSGFuZ291dHMiLCJ1c2VycyIsIm9uUmVtb3ZlVW5yZWFkIiwiY3VycmVudFRhcmdldCIsIm9uTmF2aWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsIm9uU2VsZWN0SGFuZ291dCIsIm9uU2VsZWN0VW5yZWFkIiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwib25NZXNzYWdlVGV4dCIsIm9uSGFuZ291dCIsIkhhbmdvdXRUb3BNZW51IiwibmF2VG9VbnJlYWQiLCJkcmF3ZXIiLCJib3hTaGFkb3ciLCJwb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJ6SW5kZXgiLCJ1c2VNZWRpYVF1ZXJ5Iiwic2V0V2lkdGgiLCJzZXRIZWlnaHQiLCJvcmllbnRhdGlvbiIsInNldE9yaWVudGF0aW9uIiwiZGV2aWNlIiwic2V0RGV2aWNlIiwiaGFuZGxlVmlld3BvcnRTaXplIiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwiaGFuZGxlU2NyZWVuT3JpZW50YXRpb24iLCJzY3JlZW4iLCJjb25zb2xlIiwibG9nIiwiYWRkRXZlbnRMaXN0ZW5lciIsIkRyYXdlciIsIm9wZW4iLCJBcHBCYXIiLCJ0aGVtZSIsInByaW1hcnkiLCJtaW5IZWlnaHQiLCJNZW51V2hpdGUiLCJNZW51IiwiQXBwTmF2aWdhdGlvbiIsImZsZXgiLCJIb21lIiwiTG9naW4iLCJsYXp5IiwiQ2hhbmdlUGFzc3dvcmQiLCJGb3Jnb3RQYXNzd29yZCIsIlNpZ251cCIsIlByb2ZpbGUiLCJBdXRoRmVlZGJhY2siLCJBdXRoZW50aWNhdGlvbiIsIlN1c3BlbnNlIiwiZm9ybVJlZHVjZXIiLCJmb3JtU3RhdGUiLCJGb3JtQ29udGV4dCIsInVzZUZvcm1Db250ZXh0IiwiRm9ybVByb3ZpZGVyIiwiSGFuZ291dHMiLCJHcm91cCIsIkFwcFJvdXRlcyIsIkFwcCIsIkFwcFByb3ZpZGVycyIsImJhY2tncm91bmQiLCJmb250RmFtaWx5IiwiaXAiLCJyZW5kZXIiLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxPQUFPLEdBQUc7QUFDZCxFQUFFLFlBQVksRUFBRSxpQkFBaUIsSUFBSSxJQUFJO0FBQ3pDLEVBQUUsUUFBUSxFQUFFLFFBQVEsSUFBSSxJQUFJLElBQUksVUFBVSxJQUFJLE1BQU07QUFDcEQsRUFBRSxJQUFJO0FBQ04sSUFBSSxZQUFZLElBQUksSUFBSTtBQUN4QixJQUFJLE1BQU0sSUFBSSxJQUFJO0FBQ2xCLElBQUksQ0FBQyxXQUFXO0FBQ2hCLE1BQU0sSUFBSTtBQUNWLFFBQVEsSUFBSSxJQUFJLEdBQUU7QUFDbEIsUUFBUSxPQUFPLElBQUk7QUFDbkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsT0FBTyxLQUFLO0FBQ3BCLE9BQU87QUFDUCxLQUFLLEdBQUc7QUFDUixFQUFFLFFBQVEsRUFBRSxVQUFVLElBQUksSUFBSTtBQUM5QixFQUFFLFdBQVcsRUFBRSxhQUFhLElBQUksSUFBSTtBQUNwQyxFQUFDO0FBQ0Q7QUFDQSxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7QUFDekIsRUFBRSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDckQsQ0FBQztBQUNEO0FBQ0EsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO0FBQ3pCLEVBQUUsSUFBSSxXQUFXLEdBQUc7QUFDcEIsSUFBSSxvQkFBb0I7QUFDeEIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSw0QkFBNEI7QUFDaEMsSUFBSSxx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SyxHQUFHQSxRQUFLO0FBQ3BCLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFPO0FBQ3hCLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFPO0FBQ3hCLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFRO0FBQzFCOztBQ25nQkcsSUFBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyw4REFBOEQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBeUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXVHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDOztBQ0F0dEUsTUFBTVUsV0FBVyxHQUFFO0FBQ3RCQyxFQUFBQSxpQkFBaUIsRUFBQyxtQkFESTtBQUV0QkMsRUFBQUEscUJBQXFCLEVBQUM7QUFGQSxDQUFuQjs7QUNFQSxTQUFTQyxPQUFULENBQWlCQyxLQUFqQixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFDbkMsVUFBUUEsTUFBTSxDQUFDQyxJQUFmO0FBQ0ksU0FBS04sV0FBVyxDQUFDQyxpQkFBakI7QUFDSSxhQUFPLEVBQUUsR0FBR0csS0FBTDtBQUFZRyxRQUFBQSxLQUFLLEVBQUVGLE1BQU0sQ0FBQ0UsS0FBMUI7QUFBZ0NDLFFBQUFBLFlBQVksRUFBRUgsTUFBTSxDQUFDRztBQUFyRCxPQUFQOztBQUNKO0FBQ0ksYUFBT0osS0FBUDtBQUpSO0FBTUg7O0FDTEQsTUFBTUssZUFBZSxHQUFHQyxDQUFhLEVBQXJDOztBQUVDLFNBQVNDLGtCQUFULEdBQThCO0FBQzdCLFFBQU1DLE9BQU8sR0FBR0MsR0FBVSxDQUFDSixlQUFELENBQTFCOztBQUVBLE1BQUksQ0FBQ0csT0FBTCxFQUFjO0FBQ1osVUFBTSxJQUFJRSxLQUFKLENBQVUsdURBQVYsQ0FBTjtBQUNEOztBQUNELFNBQU9GLE9BQVA7QUFDRDs7QUFDTSxTQUFTRyxZQUFULENBQXNCQyxLQUF0QixFQUE2QjtBQUNsQyxRQUFNO0FBQUVDLElBQUFBLFFBQUY7QUFBWUMsSUFBQUEsSUFBWjtBQUFrQkMsSUFBQUE7QUFBbEIsTUFBNEJILEtBQWxDO0FBRUEsUUFBTSxDQUFDWixLQUFELEVBQU9nQixRQUFQLElBQW1CVCxrQkFBa0IsRUFBM0M7QUFDRixRQUFNO0FBQUNILElBQUFBO0FBQUQsTUFBZUosS0FBckI7O0FBRUUsTUFBSWMsSUFBSSxJQUFJVixZQUFZLEtBQUtVLElBQTdCLEVBQW1DO0FBRWpDLFdBQU9ELFFBQVA7QUFDRCxHQUhELE1BR08sSUFBSUUsS0FBSyxJQUFJWCxZQUFZLEtBQUtXLEtBQUssQ0FBQ0UsSUFBTixDQUFZMUIsQ0FBRCxJQUFPQSxDQUFDLEtBQUthLFlBQXhCLENBQTlCLEVBQXFFO0FBQzFFLFdBQU9TLFFBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRDtBQUNNLFNBQVNLLFdBQVQsR0FBdUI7QUFDNUIsUUFBTSxDQUFDbEIsS0FBRCxFQUFPZ0IsUUFBUCxJQUFpQlQsa0JBQWtCLEVBQXpDOztBQUVBLFdBQVNZLFVBQVQsQ0FBb0I7QUFBQ2hCLElBQUFBLEtBQUQ7QUFBT0MsSUFBQUE7QUFBUCxHQUFwQixFQUF5QztBQUN2Q1ksSUFBQUEsUUFBUSxDQUFDO0FBQUNkLE1BQUFBLElBQUksRUFBQ04sV0FBVyxDQUFDQyxpQkFBbEI7QUFBcUNPLE1BQUFBLFlBQXJDO0FBQWtERCxNQUFBQTtBQUFsRCxLQUFELENBQVI7QUFDRDs7QUFFRCxTQUFPO0FBQUNnQixJQUFBQTtBQUFELEdBQVA7QUFDRDtBQUVNLFNBQVNDLFFBQVQsQ0FBa0JSLEtBQWxCLEVBQXlCO0FBQzlCLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQSxJQUFaO0FBQWtCQyxJQUFBQTtBQUFsQixNQUE0QkgsS0FBbEM7QUFFQSxRQUFNLENBQUNaLEtBQUQsRUFBT2dCLFFBQVAsSUFBbUJULGtCQUFrQixFQUEzQztBQUNGLFFBQU07QUFBQ0osSUFBQUE7QUFBRCxNQUFRSCxLQUFkOztBQUNFLE1BQUljLElBQUksSUFBSVgsS0FBSyxLQUFLVyxJQUF0QixFQUE0QjtBQUMxQixXQUFPRCxRQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUlFLEtBQUssSUFBSVosS0FBSyxLQUFLWSxLQUFLLENBQUNFLElBQU4sQ0FBWTFCLENBQUQsSUFBT0EsQ0FBQyxLQUFLWSxLQUF4QixDQUF2QixFQUF1RDtBQUM1RCxXQUFPVSxRQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7QUFDTSxTQUFTUSxnQkFBVCxDQUEwQlQsS0FBMUIsRUFBaUM7QUFDdEMsUUFBTTtBQUFDVSxJQUFBQTtBQUFELE1BQVlWLEtBQWxCO0FBQ0EsUUFBTSxDQUFDWixLQUFELEVBQU9nQixRQUFQLElBQWlCTyxHQUFVLENBQUN4QixPQUFELEVBQVN1QixTQUFULENBQWpDO0FBR0YsUUFBTUUsS0FBSyxHQUFHQyxHQUFPLENBQUMsTUFBTSxDQUFDekIsS0FBRCxFQUFRZ0IsUUFBUixDQUFQLEVBQTBCLENBQUNoQixLQUFELENBQTFCLENBQXJCO0FBQ0UsU0FBTyxFQUFDLGVBQUQsQ0FBaUIsUUFBakI7QUFBMEIsSUFBQSxLQUFLLEVBQUV3QjtBQUFqQyxLQUE0Q1osS0FBNUMsRUFBUDtBQUNEOztBQ3pETSxNQUFNaEIsYUFBVyxHQUFHO0FBRXZCOEIsRUFBQUEsb0JBQW9CLEVBQUMsc0JBRkU7QUFJdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUpRO0FBS3ZCQyxFQUFBQSxlQUFlLEVBQUUsaUJBTE07QUFPdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQVBLO0FBUXZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFSSztBQVV2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBVkE7QUFXdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQVhBO0FBWXZCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFaQztBQWN2QkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBZEM7QUFnQnZCQyxFQUFBQSx1QkFBdUIsRUFBQyx5QkFoQkQ7QUFtQnZCQyxFQUFBQSxnQkFBZ0IsRUFBQyxrQkFuQk07QUFvQnZCQyxFQUFBQSxnQkFBZ0IsRUFBQyxrQkFwQk07QUFxQnZCQyxFQUFBQSxlQUFlLEVBQUMsaUJBckJPO0FBc0J2QkMsRUFBQUEsdUJBQXVCLEVBQUMseUJBdEJEO0FBdUJ2QjtBQUVBQyxFQUFBQSxVQUFVLEVBQUMsWUF6Qlk7QUEwQnZCQyxFQUFBQSxJQUFJLEVBQUMsTUExQmtCO0FBMkJ2QkMsRUFBQUEsT0FBTyxFQUFDLFNBM0JlO0FBNEJ2QkMsRUFBQUEsTUFBTSxFQUFDLFFBNUJnQjtBQTZCdkJDLEVBQUFBLFlBQVksRUFBQyxjQTdCVTtBQThCdkJDLEVBQUFBLFlBQVksRUFBQztBQTlCVSxDQUFwQjs7QUNDQSxNQUFNdkIsU0FBUyxHQUFHO0FBQ3ZCd0IsRUFBQUEsUUFBUSxFQUFFLElBRGE7QUFFdkJDLEVBQUFBLE9BQU8sRUFBRSxJQUZjO0FBR3ZCQyxFQUFBQSxjQUFjLEVBQUUsSUFITztBQUl2QkMsRUFBQUEsUUFBUSxFQUFFLElBSmE7QUFLdkJDLEVBQUFBLE1BQU0sRUFBRSxFQUxlO0FBTXZCQyxFQUFBQSxJQUFJLEVBQUUsRUFOaUI7QUFPdkJDLEVBQUFBLE9BQU8sRUFBRSxLQVBjO0FBUXZCQyxFQUFBQSxLQUFLLEVBQUUsSUFSZ0I7QUFTdkJDLEVBQUFBLFdBQVcsRUFBRSxFQVRVO0FBVXZCQyxFQUFBQSxNQUFNLEVBQUUsS0FWZTtBQVd2QkMsRUFBQUEsTUFBTSxFQUFFLElBWGU7QUFZdkJDLEVBQUFBLFVBQVUsRUFBRSxDQVpXO0FBYXZCQyxFQUFBQSxhQUFhLEVBQUU7QUFiUSxDQUFsQjtBQWVBLFNBQVMzRCxTQUFULENBQWlCQyxLQUFqQixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFDckMsVUFBUUEsTUFBTSxDQUFDQyxJQUFmO0FBQ0UsU0FBS04sYUFBVyxDQUFDMkMsdUJBQWpCO0FBRUUsYUFBTyxFQUFFLEdBQUd2QyxLQUFMO0FBQVlnRCxRQUFBQSxjQUFjLEVBQUUvQyxNQUFNLENBQUMrQztBQUFuQyxPQUFQOztBQUNGLFNBQUtwRCxhQUFXLENBQUMwQyxlQUFqQjtBQUVFLGFBQU8sRUFBRSxHQUFHdEMsS0FBTDtBQUFZK0MsUUFBQUEsT0FBTyxFQUFFOUMsTUFBTSxDQUFDOEM7QUFBNUIsT0FBUDs7QUFDRixTQUFLbkQsYUFBVyxDQUFDeUMsZ0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdyQyxLQUFMO0FBQVk4QyxRQUFBQSxRQUFRLEVBQUU3QyxNQUFNLENBQUM2QztBQUE3QixPQUFQOztBQUNGLFNBQUtsRCxhQUFXLENBQUN3QyxnQkFBakI7QUFFRSxhQUFPLEVBQUUsR0FBR3BDLEtBQUw7QUFBWWlELFFBQUFBLFFBQVEsRUFBRWhELE1BQU0sQ0FBQ2dEO0FBQTdCLE9BQVA7O0FBQ0YsU0FBS3JELGFBQVcsQ0FBQ3VDLHVCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHbkMsS0FBTDtBQUFZMEQsUUFBQUEsYUFBYSxFQUFFekQsTUFBTSxDQUFDeUQ7QUFBbEMsT0FBUDs7QUFDRixTQUFLOUQsYUFBVyxDQUFDZ0MsZUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRzVCLEtBQUw7QUFBWWlELFFBQUFBLFFBQVEsRUFBRWhELE1BQU0sQ0FBQ2dEO0FBQTdCLE9BQVA7O0FBQ0YsU0FBS3JELGFBQVcsQ0FBQzhCLG9CQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHMUIsS0FBTDtBQUFZc0QsUUFBQUEsV0FBVyxFQUFFckQsTUFBTSxDQUFDMEQ7QUFBaEMsT0FBUDs7QUFDRixTQUFLL0QsYUFBVyxDQUFDZ0UsaUJBQWpCO0FBQ0EsU0FBS2hFLGFBQVcsQ0FBQ3FDLG9CQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHakMsS0FBTDtBQUFZb0QsUUFBQUEsT0FBTyxFQUFFLEtBQXJCO0FBQTRCQyxRQUFBQSxLQUFLLEVBQUVwRCxNQUFNLENBQUNvRDtBQUExQyxPQUFQOztBQUNGLFNBQUt6RCxhQUFXLENBQUNtQyxxQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRy9CLEtBQUw7QUFBWW9ELFFBQUFBLE9BQU8sRUFBRTtBQUFyQixPQUFQOztBQUNGLFNBQUt4RCxhQUFXLENBQUNvQyxxQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR2hDLEtBQUw7QUFBWW9ELFFBQUFBLE9BQU8sRUFBRSxLQUFyQjtBQUE0Qk4sUUFBQUEsUUFBUSxFQUFFN0MsTUFBTSxDQUFDNkM7QUFBN0MsT0FBUDs7QUFDRixTQUFLbEQsYUFBVyxDQUFDaUUsZUFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBRzdELEtBREU7QUFFTDhDLFFBQUFBLFFBQVEsRUFBRTlDLEtBQUssQ0FBQzhDLFFBQU4sQ0FBZWdCLE1BQWYsQ0FBdUJuRSxDQUFELElBQzlCQSxDQUFDLENBQUNvRSxRQUFGLENBQVdDLFFBQVgsQ0FBb0JoRSxLQUFLLENBQUNrRCxNQUExQixDQURRO0FBRkwsT0FBUDs7QUFNRixTQUFLdEQsYUFBVyxDQUFDaUMsZ0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUc3QixLQUFMO0FBQVlrRCxRQUFBQSxNQUFNLEVBQUVqRCxNQUFNLENBQUNpRDtBQUEzQixPQUFQOztBQUNGLFNBQUt0RCxhQUFXLENBQUMrQixhQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHM0IsS0FBTDtBQUFZOEMsUUFBQUEsUUFBUSxFQUFFN0MsTUFBTSxDQUFDNkM7QUFBN0IsT0FBUDs7QUFDRixTQUFLbEQsYUFBVyxDQUFDa0MsZ0JBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUc5QixLQURFO0FBRUwrQyxRQUFBQSxPQUFPLEVBQUUvQyxLQUFLLENBQUM4QyxRQUFOLENBQWU3QixJQUFmLENBQXFCdEIsQ0FBRCxJQUFPQSxDQUFDLENBQUNvRSxRQUFGLEtBQWU5RCxNQUFNLENBQUM4RCxRQUFqRDtBQUZKLE9BQVA7QUFJRjs7QUFDQSxTQUFLbkUsYUFBVyxDQUFDaUQsWUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRzdDLEtBQUw7QUFBWXFELFFBQUFBLEtBQUssRUFBRXBELE1BQU0sQ0FBQ29EO0FBQTFCLE9BQVA7O0FBQ0YsU0FBS3pELGFBQVcsQ0FBQzRDLFVBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUd4QyxLQUFMO0FBQVl5RCxRQUFBQSxVQUFVLEVBQUU7QUFBeEIsT0FBUDs7QUFDRixTQUFLN0QsYUFBVyxDQUFDNkMsSUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3pDLEtBQUw7QUFBWXlELFFBQUFBLFVBQVUsRUFBRTtBQUF4QixPQUFQOztBQUNGLFNBQUs3RCxhQUFXLENBQUM4QyxPQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHMUMsS0FBTDtBQUFZeUQsUUFBQUEsVUFBVSxFQUFFO0FBQXhCLE9BQVA7O0FBQ0YsU0FBSzdELGFBQVcsQ0FBQytDLE1BQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUczQyxLQUFMO0FBQVl5RCxRQUFBQSxVQUFVLEVBQUU7QUFBeEIsT0FBUDs7QUFDRixTQUFLN0QsYUFBVyxDQUFDZ0QsWUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRzVDLEtBQUw7QUFBWXdELFFBQUFBLE1BQU0sRUFBRXZELE1BQU0sQ0FBQ3VEO0FBQTNCLE9BQVA7O0FBQ0Y7QUFDRSxhQUFPeEQsS0FBUDtBQXZESjtBQXlERDs7QUN2RU0sU0FBU2lFLFlBQVQsQ0FBc0I7QUFBRUYsRUFBQUEsUUFBRjtBQUFZL0MsRUFBQUE7QUFBWixDQUF0QixFQUE4QztBQUNuRCxRQUFNOEIsUUFBUSxHQUFHb0IsSUFBSSxDQUFDQyxLQUFMLENBQVdDLFlBQVksQ0FBQ0MsT0FBYixDQUFzQixHQUFFTixRQUFTLFdBQWpDLENBQVgsQ0FBakI7QUFDQS9DLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQytCLGFBQXBCO0FBQW1DbUIsSUFBQUE7QUFBbkMsR0FBRCxDQUFSO0FBQ0Q7O0FBRU0sU0FBU3dCLGFBQVQsQ0FBdUI7QUFBRXRELEVBQUFBLFFBQUY7QUFBWStDLEVBQUFBO0FBQVosQ0FBdkIsRUFBK0M7QUFDcEQvQyxFQUFBQSxRQUFRLENBQUM7QUFBRWQsSUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUNrQyxnQkFBcEI7QUFBc0NpQyxJQUFBQTtBQUF0QyxHQUFELENBQVI7QUFDRDtBQUVNLFNBQVNRLFlBQVQsQ0FBc0I7QUFBQ3ZELEVBQUFBLFFBQUQ7QUFBVStDLEVBQUFBO0FBQVYsQ0FBdEIsRUFBMEM7QUFDL0MvQyxFQUFBQSxRQUFRLENBQUM7QUFBRWQsSUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUNrQyxnQkFBcEI7QUFBc0NpQyxJQUFBQTtBQUF0QyxHQUFELENBQVI7QUFDRDs7QUFHTSxTQUFTUyxjQUFULENBQXdCO0FBQUV0QixFQUFBQSxNQUFGO0FBQVVsQyxFQUFBQTtBQUFWLENBQXhCLEVBQThDO0FBQ25EQSxFQUFBQSxRQUFRLENBQUM7QUFBRWQsSUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUNpQyxnQkFBcEI7QUFBc0NxQixJQUFBQTtBQUF0QyxHQUFELENBQVI7QUFDRDs7QUFFTSxTQUFTdUIsY0FBVCxDQUF3QjtBQUFFekQsRUFBQUE7QUFBRixDQUF4QixFQUFzQztBQUMzQ0EsRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDaUU7QUFBcEIsR0FBRCxDQUFSO0FBQ0Q7O0FBR00sZUFBZWEsWUFBZixDQUE0QjtBQUFFeEIsRUFBQUEsTUFBRjtBQUFVbEMsRUFBQUEsUUFBVjtBQUFvQitDLEVBQUFBO0FBQXBCLENBQTVCLEVBQTREO0FBQ2pFLE1BQUk7QUFDRi9DLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ21DO0FBQXBCLEtBQUQsQ0FBUjtBQUNBLFVBQU00QyxRQUFRLEdBQUcsTUFBTWpHLEtBQUssQ0FDekIseUJBQXdCd0UsTUFBTyxhQUFZYSxRQUFTLEVBRDNCLENBQTVCOztBQUdBLFFBQUlZLFFBQVEsQ0FBQ0MsRUFBYixFQUFpQjtBQUNmLFlBQU07QUFBRTlCLFFBQUFBO0FBQUYsVUFBZSxNQUFNNkIsUUFBUSxDQUFDRSxJQUFULEVBQTNCO0FBRUE3RCxNQUFBQSxRQUFRLENBQUM7QUFBRWQsUUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUNvQyxxQkFBcEI7QUFBMkNjLFFBQUFBO0FBQTNDLE9BQUQsQ0FBUjtBQUNEO0FBQ0YsR0FWRCxDQVVFLE9BQU9PLEtBQVAsRUFBYztBQUVkckMsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDcUMsb0JBQXBCO0FBQTBDb0IsTUFBQUE7QUFBMUMsS0FBRCxDQUFSO0FBQ0Q7QUFDRjtBQUVNLFNBQVN5QixpQkFBVCxDQUEyQjtBQUFFbkIsRUFBQUEsSUFBRjtBQUFRM0MsRUFBQUE7QUFBUixDQUEzQixFQUErQztBQUNwREEsRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDOEIsb0JBQXBCO0FBQTBDaUMsSUFBQUE7QUFBMUMsR0FBRCxDQUFSO0FBQ0Q7QUFNTSxTQUFTb0IsWUFBVCxDQUFzQjtBQUFFaEMsRUFBQUEsT0FBRjtBQUFXL0IsRUFBQUEsUUFBWDtBQUFvQitDLEVBQUFBO0FBQXBCLENBQXRCLEVBQXNEO0FBRTNELFFBQU1pQixHQUFHLEdBQUksR0FBRWpCLFFBQVMsSUFBR2hCLE9BQU8sQ0FBQ2dCLFFBQVMsV0FBNUM7QUFDQSxRQUFNZCxRQUFRLEdBQUdpQixJQUFJLENBQUNDLEtBQUwsQ0FBV0MsWUFBWSxDQUFDQyxPQUFiLENBQXFCVyxHQUFyQixDQUFYLENBQWpCO0FBQ0FoRSxFQUFBQSxRQUFRLENBQUM7QUFBRWQsSUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUNnQyxlQUFwQjtBQUFxQ3FCLElBQUFBO0FBQXJDLEdBQUQsQ0FBUjtBQUNEO0FBVUQ7O0FDakVPLFNBQVNnQyxrQkFBVCxDQUE0QjtBQUFFakUsRUFBQUEsUUFBRjtBQUFZa0UsRUFBQUEsSUFBWjtBQUFrQm5DLEVBQUFBO0FBQWxCLENBQTVCLEVBQXlEO0FBQzlELFFBQU07QUFBRWdCLElBQUFBLFFBQUY7QUFBWW9CLElBQUFBO0FBQVosTUFBd0JwQyxPQUE5QixDQUQ4RDs7QUFJOUQsTUFBSXFDLGlCQUFpQixHQUFJLEdBQUVGLElBQUssa0JBQWhDO0FBQ0EsUUFBTWxDLGNBQWMsR0FBR2tCLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUJlLGlCQUFyQixDQUFYLENBQXZCO0FBQ0E7O0FBQ0EsTUFBSXBDLGNBQWMsSUFBR0EsY0FBYyxDQUFDcUMsTUFBZixHQUFzQixDQUEzQyxFQUE4QztBQUM1QztBQUNBLFFBQUlDLGFBQWEsR0FBR3RDLGNBQWMsQ0FBQ3VDLEdBQWYsQ0FBbUIxRyxDQUFDLElBQUk7QUFDMUMsVUFBSUEsQ0FBQyxDQUFDa0YsUUFBRixLQUFlQSxRQUFuQixFQUE2QjtBQUMzQjtBQUNBLGVBQU8sRUFBRSxHQUFHbEYsQ0FBTDtBQUFRMkcsVUFBQUEsSUFBSSxFQUFFO0FBQWQsU0FBUDtBQUNELE9BSEQsTUFHTztBQUNMLGVBQU8zRyxDQUFQO0FBQ0Q7QUFDRixLQVBtQixDQUFwQjtBQVFKO0FBQ0l1RixJQUFBQSxZQUFZLENBQUNxQixPQUFiLENBQXFCTCxpQkFBckIsRUFBd0NsQixJQUFJLENBQUN3QixTQUFMLENBQWVKLGFBQWYsQ0FBeEM7QUFDSnRFLElBQUFBLFFBQVEsQ0FBQztBQUFDZCxNQUFBQSxJQUFJLEVBQUNOLGFBQVcsQ0FBQzJDLHVCQUFsQjtBQUEwQ1MsTUFBQUEsY0FBYyxFQUFDc0M7QUFBekQsS0FBRCxDQUFSO0FBQ0k7QUFDRDs7QUFDSCxXQXRCZ0U7O0FBd0I5RCxRQUFNSyxVQUFVLEdBQUksR0FBRVQsSUFBSyxXQUEzQjtBQUNBLFFBQU1wQyxRQUFRLEdBQUdvQixJQUFJLENBQUNDLEtBQUwsQ0FBV0MsWUFBWSxDQUFDQyxPQUFiLENBQXFCc0IsVUFBckIsQ0FBWCxDQUFqQjtBQUNBLFFBQU1DLFlBQVksR0FBRzlDLFFBQVEsQ0FBQytDLFNBQVQsQ0FBb0JsRyxDQUFELElBQU9BLENBQUMsQ0FBQ29FLFFBQUYsS0FBZUEsUUFBekMsQ0FBckI7QUFDQWpCLEVBQUFBLFFBQVEsQ0FBQ2dELE1BQVQsQ0FBZ0JGLFlBQWhCLEVBQThCLENBQTlCLEVBQWlDLEVBQUUsR0FBRzdDLE9BQUw7QUFBY3lDLElBQUFBLElBQUksRUFBRTtBQUFwQixHQUFqQyxFQTNCOEQ7O0FBNkI5RHBCLEVBQUFBLFlBQVksQ0FBQ3FCLE9BQWIsQ0FBcUJFLFVBQXJCLEVBQWlDekIsSUFBSSxDQUFDd0IsU0FBTCxDQUFlNUMsUUFBZixDQUFqQztBQUNBOUIsRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDeUMsZ0JBQXBCO0FBQXNDUyxJQUFBQTtBQUF0QyxHQUFELENBQVI7QUFLRDs7QUNuQ1EsTUFBTWlELGFBQWEsR0FBRztBQUMzQkMsRUFBQUEsT0FBTyxFQUFFLFNBRGtCO0FBRTNCQyxFQUFBQSxRQUFRLEVBQUUsVUFGaUI7QUFHM0JDLEVBQUFBLFFBQVEsRUFBRSxVQUhpQjtBQUkzQkMsRUFBQUEsT0FBTyxFQUFFLFNBSmtCO0FBSzNCQyxFQUFBQSxTQUFTLEVBQUUsV0FMZ0I7QUFNM0JDLEVBQUFBLFNBQVMsRUFBRSxXQU5nQjtBQU81QjtBQUNDQyxFQUFBQSxPQUFPLEVBQUUsU0FSa0I7QUFTM0JDLEVBQUFBLFFBQVEsRUFBRSxVQVRpQjtBQVUzQkMsRUFBQUEsUUFBUSxFQUFFLFVBVmlCO0FBVzNCQyxFQUFBQSxPQUFPLEVBQUUsU0FYa0I7QUFZM0JDLEVBQUFBLFNBQVMsRUFBRSxXQVpnQjtBQWEzQkMsRUFBQUEsUUFBUSxFQUFFO0FBYmlCLENBQXRCOztBQ0FGLFNBQVNDLHNCQUFULENBQWdDO0FBQUUxQixFQUFBQSxJQUFGO0FBQVFsRSxFQUFBQSxRQUFSO0FBQWtCK0IsRUFBQUEsT0FBbEI7QUFBMkI4RCxFQUFBQSxPQUEzQjtBQUFvQzFGLEVBQUFBO0FBQXBDLENBQWhDLEVBQWtGO0FBQ3ZGLFFBQU07QUFBRTRDLElBQUFBLFFBQUY7QUFBWW9CLElBQUFBLE9BQVo7QUFBcUIyQixJQUFBQTtBQUFyQixNQUFtQy9ELE9BQXpDO0FBQ0Y7QUFDRSxRQUFNZ0UsZ0JBQWdCLEdBQUcsRUFBRSxHQUFHaEUsT0FBTDtBQUFjaUUsSUFBQUEsU0FBUyxFQUFFO0FBQXpCLEdBQXpCO0FBQ0EsUUFBTXJCLFVBQVUsR0FBSSxHQUFFVCxJQUFLLFdBQTNCO0FBQ0EsUUFBTXBDLFFBQVEsR0FBR29CLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUJzQixVQUFyQixDQUFYLENBQWpCO0FBQ0EsUUFBTUMsWUFBWSxHQUFHOUMsUUFBUSxDQUFDK0MsU0FBVCxDQUFvQmxHLENBQUQsSUFBT0EsQ0FBQyxDQUFDb0UsUUFBRixLQUFlQSxRQUF6QyxDQUFyQjtBQUVBakIsRUFBQUEsUUFBUSxDQUFDZ0QsTUFBVCxDQUFnQkYsWUFBaEIsRUFBOEIsQ0FBOUIsRUFBaUNtQixnQkFBakM7QUFDQTNDLEVBQUFBLFlBQVksQ0FBQ3FCLE9BQWIsQ0FBcUJFLFVBQXJCLEVBQWlDekIsSUFBSSxDQUFDd0IsU0FBTCxDQUFlNUMsUUFBZixDQUFqQztBQUNBOUIsRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDeUMsZ0JBQXBCO0FBQXNDUyxJQUFBQTtBQUF0QyxHQUFELENBQVI7QUFDQTlCLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQzBDLGVBQXBCO0FBQXFDUyxJQUFBQSxPQUFPLEVBQUVnRTtBQUE5QyxHQUFELENBQVI7O0FBQ0EsTUFBSTVCLE9BQUosRUFBYTtBQUVYOEIsSUFBQUEsc0JBQXNCLENBQUM7QUFBRWpHLE1BQUFBLFFBQUY7QUFBWWtFLE1BQUFBLElBQVo7QUFBa0I2QixNQUFBQSxnQkFBbEI7QUFBbUNoRSxNQUFBQTtBQUFuQyxLQUFELENBQXRCO0FBQ0Q7O0FBQ0QsTUFBR0EsT0FBTyxDQUFDL0MsS0FBUixLQUFnQixTQUFuQixFQUE2QjtBQUMzQjtBQUNBa0gsSUFBQUEsaUJBQWlCLENBQUM7QUFBQ2xHLE1BQUFBLFFBQUQ7QUFBVWtFLE1BQUFBLElBQVY7QUFBZTZCLE1BQUFBO0FBQWYsS0FBRCxDQUFqQjtBQUNEOztBQUNELE1BQUlGLE9BQUosRUFBYTtBQUNYO0FBQ0EsVUFBTU0saUJBQWlCLEdBQUksR0FBRWpDLElBQUssbUJBQWxDO0FBQ0EsVUFBTWtDLGVBQWUsR0FBR2xELElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUI4QyxpQkFBckIsQ0FBWCxDQUF4Qjs7QUFFQSxRQUFJQyxlQUFKLEVBQXFCO0FBQ25CLFlBQU14QixZQUFZLEdBQUd3QixlQUFlLENBQUN2QixTQUFoQixDQUNsQjlHLENBQUQsSUFBT0EsQ0FBQyxDQUFDK0gsU0FBRixLQUFnQkEsU0FESixDQUFyQjtBQUdBMUMsTUFBQUEsWUFBWSxDQUFDcUIsT0FBYixDQUNFMEIsaUJBREYsRUFFRWpELElBQUksQ0FBQ3dCLFNBQUwsQ0FBZTBCLGVBQWUsQ0FBQ3RCLE1BQWhCLENBQXVCRixZQUF2QixFQUFxQyxDQUFyQyxDQUFmLENBRkY7QUFJRDtBQUNGOztBQUVELE1BQUk3QyxPQUFPLENBQUMvQyxLQUFSLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDbUIsSUFBQUEsVUFBVSxDQUFDO0FBQUVmLE1BQUFBLFlBQVksRUFBRyxJQUFHMkMsT0FBTyxDQUFDL0MsS0FBTSxFQUFsQztBQUFxQ0csTUFBQUEsS0FBSyxFQUFFO0FBQTVDLEtBQUQsQ0FBVjtBQUNEO0FBQ0Y7QUFFTSxTQUFTOEcsc0JBQVQsQ0FBZ0M7QUFBRWpHLEVBQUFBLFFBQUY7QUFBWWtFLEVBQUFBLElBQVo7QUFBa0I2QixFQUFBQTtBQUFsQixDQUFoQyxFQUFzRTtBQUMzRSxRQUFNO0FBQUVoRCxJQUFBQSxRQUFGO0FBQVlvQixJQUFBQTtBQUFaLE1BQXdCNEIsZ0JBQTlCO0FBRUEsUUFBTU0sZ0JBQWdCLEdBQUcsRUFBRSxHQUFHbEMsT0FBTDtBQUFjcEIsSUFBQUEsUUFBUSxFQUFFbUIsSUFBeEI7QUFBOEI4QixJQUFBQSxTQUFTLEVBQUU7QUFBekMsR0FBekIsQ0FIMkU7O0FBTTNFLFFBQU1NLFVBQVUsR0FBSSxHQUFFcEMsSUFBSyxJQUFHbkIsUUFBUyxXQUF2QztBQUNBLFFBQU1kLFFBQVEsR0FBR2lCLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUJpRCxVQUFyQixDQUFYLENBQWpCO0FBQ0EsUUFBTTFCLFlBQVksR0FBRzNDLFFBQVEsQ0FBQzRDLFNBQVQsQ0FDbEJ4RyxDQUFELElBQU9BLENBQUMsQ0FBQ3lILFNBQUYsS0FBZ0IzQixPQUFPLENBQUMyQixTQURaLENBQXJCO0FBR0E3RCxFQUFBQSxRQUFRLENBQUM2QyxNQUFULENBQWdCRixZQUFoQixFQUE4QixDQUE5QixFQUFpQ3lCLGdCQUFqQztBQUdBakQsRUFBQUEsWUFBWSxDQUFDcUIsT0FBYixDQUFxQjZCLFVBQXJCLEVBQWlDcEQsSUFBSSxDQUFDd0IsU0FBTCxDQUFlekMsUUFBZixDQUFqQztBQUVBakMsRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDd0MsZ0JBQXBCO0FBQXNDYSxJQUFBQTtBQUF0QyxHQUFELENBQVI7QUFDRDtBQUVNLFNBQVNpRSxpQkFBVCxDQUEyQjtBQUFDbEcsRUFBQUEsUUFBRDtBQUFVK0YsRUFBQUEsZ0JBQVY7QUFBMkI3QixFQUFBQTtBQUEzQixDQUEzQixFQUE0RDtBQUNqRTtBQUNBLFFBQU07QUFBRW5CLElBQUFBO0FBQUYsTUFBZWdELGdCQUFyQjtBQUNBLFFBQU1RLGNBQWMsR0FBRztBQUFFVCxJQUFBQSxTQUFTLEVBQUNDLGdCQUFnQixDQUFDRCxTQUE3QjtBQUF3Q25ELElBQUFBLElBQUksRUFBRSx1QkFBOUM7QUFBdUVJLElBQUFBLFFBQVEsRUFBRW1CLElBQWpGO0FBQXVGaEYsSUFBQUEsSUFBSSxFQUFFO0FBQTdGLEdBQXZCO0FBQ0EsUUFBTW9ILFVBQVUsR0FBSSxHQUFFcEMsSUFBSyxJQUFHbkIsUUFBUyxXQUF2QztBQUNBLFFBQU1kLFFBQVEsR0FBR2lCLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUJpRCxVQUFyQixDQUFYLENBQWpCO0FBRUFsRCxFQUFBQSxZQUFZLENBQUNxQixPQUFiLENBQXFCNkIsVUFBckIsRUFBaUNwRCxJQUFJLENBQUN3QixTQUFMLENBQWdCLENBQUMsR0FBR3pDLFFBQUosRUFBYXNFLGNBQWIsQ0FBaEIsQ0FBakM7QUFFQXZHLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ3dDLGdCQUFwQjtBQUFzQ2EsSUFBQUEsUUFBUSxFQUFDLENBQUMsR0FBR0EsUUFBSixFQUFhc0UsY0FBYjtBQUEvQyxHQUFELENBQVI7QUFDRDs7QUNyRU0sU0FBU0MsWUFBVCxDQUFzQjtBQUFFeEcsRUFBQUEsUUFBRjtBQUFZK0IsRUFBQUEsT0FBWjtBQUFxQm1DLEVBQUFBLElBQXJCO0FBQTJCMkIsRUFBQUEsT0FBM0I7QUFBbUMxRixFQUFBQTtBQUFuQyxDQUF0QixFQUF1RTtBQUU1RXlGLEVBQUFBLHNCQUFzQixDQUFDO0FBQUU1RixJQUFBQSxRQUFGO0FBQVlrRSxJQUFBQSxJQUFaO0FBQWtCbkMsSUFBQUEsT0FBbEI7QUFBMkI4RCxJQUFBQSxPQUEzQjtBQUFtQzFGLElBQUFBO0FBQW5DLEdBQUQsQ0FBdEI7QUFDRDtBQUNNLFNBQVNzRyxXQUFULENBQXFCO0FBQUV6RyxFQUFBQSxRQUFGO0FBQVkrQixFQUFBQSxPQUFaO0FBQXFCbUMsRUFBQUEsSUFBckI7QUFBMkIyQixFQUFBQSxPQUEzQjtBQUFtQzFGLEVBQUFBO0FBQW5DLENBQXJCLEVBQXNFO0FBRTNFeUYsRUFBQUEsc0JBQXNCLENBQUM7QUFBRTVGLElBQUFBLFFBQUY7QUFBWWtFLElBQUFBLElBQVo7QUFBa0JuQyxJQUFBQSxPQUFsQjtBQUEyQjhELElBQUFBLE9BQTNCO0FBQW1DMUYsSUFBQUE7QUFBbkMsR0FBRCxDQUF0QjtBQUNEO0FBQ00sU0FBU3VHLFlBQVQsQ0FBc0I7QUFBRTFHLEVBQUFBLFFBQUY7QUFBWStCLEVBQUFBLE9BQVo7QUFBcUJtQyxFQUFBQSxJQUFyQjtBQUEyQjJCLEVBQUFBLE9BQTNCO0FBQW1DMUYsRUFBQUE7QUFBbkMsQ0FBdEIsRUFBdUU7QUFFNUV5RixFQUFBQSxzQkFBc0IsQ0FBQztBQUFFNUYsSUFBQUEsUUFBRjtBQUFZa0UsSUFBQUEsSUFBWjtBQUFrQm5DLElBQUFBLE9BQWxCO0FBQTJCOEQsSUFBQUEsT0FBM0I7QUFBbUMxRixJQUFBQTtBQUFuQyxHQUFELENBQXRCO0FBQ0Q7QUFDTSxTQUFTd0csWUFBVCxDQUFzQjtBQUFFM0csRUFBQUEsUUFBRjtBQUFZK0IsRUFBQUEsT0FBWjtBQUFxQm1DLEVBQUFBLElBQXJCO0FBQTJCMkIsRUFBQUEsT0FBM0I7QUFBbUMxRixFQUFBQTtBQUFuQyxDQUF0QixFQUF1RTtBQUU1RXlGLEVBQUFBLHNCQUFzQixDQUFDO0FBQUU1RixJQUFBQSxRQUFGO0FBQVlrRSxJQUFBQSxJQUFaO0FBQWtCbkMsSUFBQUEsT0FBbEI7QUFBMkI4RCxJQUFBQSxPQUEzQjtBQUFtQzFGLElBQUFBO0FBQW5DLEdBQUQsQ0FBdEI7QUFDRDtBQUNNLFNBQVN5RyxXQUFULENBQXFCO0FBQUU1RyxFQUFBQSxRQUFGO0FBQVkrQixFQUFBQSxPQUFaO0FBQXFCbUMsRUFBQUEsSUFBckI7QUFBMkIyQixFQUFBQSxPQUEzQjtBQUFtQzFGLEVBQUFBO0FBQW5DLENBQXJCLEVBQXNFO0FBQzdFO0FBQ0V5RixFQUFBQSxzQkFBc0IsQ0FBQztBQUFFNUYsSUFBQUEsUUFBRjtBQUFZa0UsSUFBQUEsSUFBWjtBQUFrQm5DLElBQUFBLE9BQWxCO0FBQTJCOEQsSUFBQUEsT0FBM0I7QUFBbUMxRixJQUFBQTtBQUFuQyxHQUFELENBQXRCO0FBQ0Q7QUFDTSxTQUFTMEcsYUFBVCxDQUF1QjtBQUFFN0csRUFBQUEsUUFBRjtBQUFZK0IsRUFBQUEsT0FBWjtBQUFxQm1DLEVBQUFBLElBQXJCO0FBQTJCMkIsRUFBQUEsT0FBM0I7QUFBbUMxRixFQUFBQTtBQUFuQyxDQUF2QixFQUF3RTtBQUU3RXlGLEVBQUFBLHNCQUFzQixDQUFDO0FBQUU1RixJQUFBQSxRQUFGO0FBQVlrRSxJQUFBQSxJQUFaO0FBQWtCbkMsSUFBQUEsT0FBbEI7QUFBMkI4RCxJQUFBQSxPQUEzQjtBQUFtQzFGLElBQUFBO0FBQW5DLEdBQUQsQ0FBdEI7QUFDRDs7QUN2Qk0sU0FBUzJHLG1CQUFULENBQTZCO0FBQ2xDOUcsRUFBQUEsUUFEa0M7QUFFbEMrQixFQUFBQSxPQUZrQztBQUdsQ21DLEVBQUFBLElBSGtDO0FBSWxDNkMsRUFBQUEsY0FKa0M7QUFLbEM1RyxFQUFBQSxVQUxrQztBQU1sQzZHLEVBQUFBO0FBTmtDLENBQTdCLEVBT0o7QUFDRDtBQUNBLFFBQU07QUFBRWpFLElBQUFBLFFBQUY7QUFBWW9CLElBQUFBO0FBQVosTUFBd0JwQyxPQUE5QjtBQUNEO0FBQ0MsUUFBTTRDLFVBQVUsR0FBSSxHQUFFVCxJQUFLLFdBQTNCO0FBRUEsUUFBTXBDLFFBQVEsR0FBR29CLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUJzQixVQUFyQixDQUFYLENBQWpCOztBQUdBLE1BQUk3QyxRQUFKLEVBQWM7QUFDWixVQUFNbUYsWUFBWSxHQUFHbkYsUUFBUSxDQUFDN0IsSUFBVCxDQUFjaUgsRUFBRSxJQUFHQSxFQUFFLENBQUNuRSxRQUFILEtBQWNBLFFBQWpDLENBQXJCOztBQUNBLFFBQUdrRSxZQUFILEVBQWdCO0FBQ2QsWUFBTXJDLFlBQVksR0FBRzlDLFFBQVEsQ0FBQytDLFNBQVQsQ0FBb0JsRyxDQUFELElBQU9BLENBQUMsQ0FBQ29FLFFBQUYsS0FBZUEsUUFBekMsQ0FBckI7O0FBQ0EsVUFBSWdFLGNBQWMsSUFBSUEsY0FBYyxDQUFDaEUsUUFBZixLQUE0QkEsUUFBbEQsRUFBNEQ7QUFDMURqQixRQUFBQSxRQUFRLENBQUNnRCxNQUFULENBQWdCRixZQUFoQixFQUE4QixDQUE5QixFQUFpQyxFQUMvQixHQUFHN0MsT0FENEI7QUFFL0J5QyxVQUFBQSxJQUFJLEVBQUU7QUFGeUIsU0FBakMsRUFEMEQ7QUFNM0QsT0FORCxNQU1PO0FBQ0wxQyxRQUFBQSxRQUFRLENBQUNnRCxNQUFULENBQWdCRixZQUFoQixFQUE4QixDQUE5QixFQUFpQyxFQUMvQixHQUFHN0MsT0FENEI7QUFFL0J5QyxVQUFBQSxJQUFJLEVBQUU7QUFGeUIsU0FBakM7QUFJRDs7QUFDRHBCLE1BQUFBLFlBQVksQ0FBQ3FCLE9BQWIsQ0FBcUJFLFVBQXJCLEVBQWlDekIsSUFBSSxDQUFDd0IsU0FBTCxDQUFlNUMsUUFBZixDQUFqQztBQUNBOUIsTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDeUMsZ0JBQXBCO0FBQXNDUyxRQUFBQTtBQUF0QyxPQUFELENBQVI7QUFDRCxLQWhCRDtBQUFBLFNBaUJBO0FBQ0YsWUFBSXFGLGVBQWUsR0FBRyxJQUF0Qjs7QUFDQSxZQUFJSixjQUFjLElBQUlBLGNBQWMsQ0FBQ2hFLFFBQWYsS0FBNEJBLFFBQWxELEVBQTREO0FBQzFEb0UsVUFBQUEsZUFBZSxHQUFHLENBQUMsR0FBR3JGLFFBQUosRUFDaEIsRUFDRSxHQUFHQyxPQURMO0FBRUV5QyxZQUFBQSxJQUFJLEVBQUU7QUFGUixXQURnQixDQUFsQjtBQU1ELFNBUEQsTUFPTztBQUNMMkMsVUFBQUEsZUFBZSxHQUFHLENBQUMsR0FBR3JGLFFBQUosRUFDaEIsRUFDRSxHQUFHQyxPQURMO0FBRUV5QyxZQUFBQSxJQUFJLEVBQUU7QUFGUixXQURnQixDQUFsQjtBQU1EOztBQUNEcEIsUUFBQUEsWUFBWSxDQUFDcUIsT0FBYixDQUFxQkUsVUFBckIsRUFBaUN6QixJQUFJLENBQUN3QixTQUFMLENBQWV5QyxlQUFmLENBQWpDO0FBQ0FuSCxRQUFBQSxRQUFRLENBQUM7QUFBRWQsVUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUN5QyxnQkFBcEI7QUFBc0NTLFVBQUFBLFFBQVEsRUFBRXFGO0FBQWhELFNBQUQsQ0FBUjtBQUNEO0FBRUEsR0F4Q0MsTUF3Q0c7QUFDSDtBQUNBLFFBQUlBLGVBQWUsR0FBRyxJQUF0Qjs7QUFDQSxRQUFJSixjQUFjLElBQUlBLGNBQWMsQ0FBQ2hFLFFBQWYsS0FBNEJBLFFBQWxELEVBQTREO0FBQzFEb0UsTUFBQUEsZUFBZSxHQUFHLENBQ2hCLEVBQ0UsR0FBR3BGLE9BREw7QUFFRXlDLFFBQUFBLElBQUksRUFBRTtBQUZSLE9BRGdCLENBQWxCO0FBTUQsS0FQRCxNQU9PO0FBQ0wyQyxNQUFBQSxlQUFlLEdBQUcsQ0FDaEIsRUFDRSxHQUFHcEYsT0FETDtBQUVFeUMsUUFBQUEsSUFBSSxFQUFFO0FBRlIsT0FEZ0IsQ0FBbEI7QUFNRDs7QUFDRHBCLElBQUFBLFlBQVksQ0FBQ3FCLE9BQWIsQ0FBcUJFLFVBQXJCLEVBQWlDekIsSUFBSSxDQUFDd0IsU0FBTCxDQUFleUMsZUFBZixDQUFqQztBQUNBbkgsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDeUMsZ0JBQXBCO0FBQXNDUyxNQUFBQSxRQUFRLEVBQUVxRjtBQUFoRCxLQUFELENBQVI7QUFFRDs7QUFFQyxNQUFJSixjQUFjLElBQUlBLGNBQWMsQ0FBQ2hFLFFBQWYsS0FBNEJBLFFBQWxELEVBQTREO0FBQzFEL0MsSUFBQUEsUUFBUSxDQUFDO0FBQ1BkLE1BQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDa0MsZ0JBRFg7QUFFUGlDLE1BQUFBLFFBQVEsRUFBRWhCLE9BQU8sQ0FBQ2dCO0FBRlgsS0FBRCxDQUFSOztBQUlBLFFBQUloQixPQUFPLENBQUMvQyxLQUFSLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDbUIsTUFBQUEsVUFBVSxDQUFDO0FBQUVmLFFBQUFBLFlBQVksRUFBRyxJQUFHMkMsT0FBTyxDQUFDL0MsS0FBTSxFQUFsQztBQUFxQ0csUUFBQUEsS0FBSyxFQUFFO0FBQTVDLE9BQUQsQ0FBVjtBQUNEO0FBQ0Y7O0FBQ0QsTUFBSWdGLE9BQUosRUFBYTtBQUNYaUQsSUFBQUEsbUJBQW1CLENBQUM7QUFBRXBILE1BQUFBLFFBQUY7QUFBWStCLE1BQUFBLE9BQVo7QUFBcUJtQyxNQUFBQSxJQUFyQjtBQUEyQjZDLE1BQUFBO0FBQTNCLEtBQUQsQ0FBbkI7QUFDRDs7QUFFRCxNQUFJQyxNQUFKLEVBQVk7QUFDVjs7QUFDQSxZQUFPakYsT0FBTyxDQUFDL0MsS0FBZjtBQUNFLFdBQUsrRixhQUFhLENBQUNFLFFBQW5CO0FBQ0EsV0FBS0YsYUFBYSxDQUFDQyxPQUFuQjtBQUNBLFdBQUtELGFBQWEsQ0FBQ00sU0FBbkI7QUFDRWdDLFFBQUFBLGlCQUFpQixDQUFDO0FBQUVuRCxVQUFBQSxJQUFGO0FBQVFuQyxVQUFBQSxPQUFSO0FBQWdCL0IsVUFBQUE7QUFBaEIsU0FBRCxDQUFqQjtBQUNBO0FBTEo7QUFVQztBQUVKO0FBQ00sU0FBU29ILG1CQUFULENBQTZCO0FBQ2xDcEgsRUFBQUEsUUFEa0M7QUFFbEMrQixFQUFBQSxPQUZrQztBQUdsQ21DLEVBQUFBLElBSGtDO0FBSWxDNkMsRUFBQUE7QUFKa0MsQ0FBN0IsRUFLSjtBQUNELFFBQU07QUFBRWhFLElBQUFBLFFBQUY7QUFBWW9CLElBQUFBO0FBQVosTUFBd0JwQyxPQUE5QixDQURDOztBQUlELFFBQU11RSxVQUFVLEdBQUksR0FBRXBDLElBQUssSUFBR25CLFFBQVMsV0FBdkM7QUFDQSxRQUFNZCxRQUFRLEdBQUdpQixJQUFJLENBQUNDLEtBQUwsQ0FBV0MsWUFBWSxDQUFDQyxPQUFiLENBQXFCaUQsVUFBckIsQ0FBWCxDQUFqQjtBQUNBLE1BQUlnQixlQUFlLEdBQUcsSUFBdEI7O0FBQ0EsTUFBSXJGLFFBQUosRUFBYztBQUNaLFFBQUk4RSxjQUFjLElBQUlBLGNBQWMsQ0FBQ2hFLFFBQWYsS0FBNEJBLFFBQWxELEVBQTREO0FBQzFEdUUsTUFBQUEsZUFBZSxHQUFHLENBQUMsR0FBR3JGLFFBQUosRUFBYyxFQUFFLEdBQUdrQyxPQUFMO0FBQWNwQixRQUFBQSxRQUFkO0FBQXdCeUIsUUFBQUEsSUFBSSxFQUFFO0FBQTlCLE9BQWQsQ0FBbEI7QUFDRCxLQUZELE1BRU87QUFDTDhDLE1BQUFBLGVBQWUsR0FBRyxDQUFDLEdBQUdyRixRQUFKLEVBQWMsRUFBRSxHQUFHa0MsT0FBTDtBQUFjcEIsUUFBQUEsUUFBZDtBQUF3QnlCLFFBQUFBLElBQUksRUFBRTtBQUE5QixPQUFkLENBQWxCO0FBQ0Q7QUFDRixHQU5ELE1BTU87QUFDTCxRQUFJdUMsY0FBYyxJQUFJQSxjQUFjLENBQUNoRSxRQUFmLEtBQTRCQSxRQUFsRCxFQUE0RDtBQUMxRHVFLE1BQUFBLGVBQWUsR0FBRyxDQUFDLEVBQUUsR0FBR25ELE9BQUw7QUFBY3BCLFFBQUFBLFFBQWQ7QUFBd0J5QixRQUFBQSxJQUFJLEVBQUU7QUFBOUIsT0FBRCxDQUFsQjtBQUNELEtBRkQsTUFFTztBQUNMOEMsTUFBQUEsZUFBZSxHQUFHLENBQUMsRUFBRSxHQUFHbkQsT0FBTDtBQUFjcEIsUUFBQUEsUUFBZDtBQUF3QnlCLFFBQUFBLElBQUksRUFBRTtBQUE5QixPQUFELENBQWxCO0FBQ0Q7QUFDRjs7QUFDRHBCLEVBQUFBLFlBQVksQ0FBQ3FCLE9BQWIsQ0FBcUI2QixVQUFyQixFQUFpQ3BELElBQUksQ0FBQ3dCLFNBQUwsQ0FBZTRDLGVBQWYsQ0FBakM7O0FBRUEsTUFBSVAsY0FBYyxJQUFJQSxjQUFjLENBQUNoRSxRQUFmLEtBQTRCQSxRQUFsRCxFQUE0RDtBQUMxRDtBQUNBL0MsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRU4sYUFBVyxDQUFDd0MsZ0JBQXBCO0FBQXNDYSxNQUFBQSxRQUFRLEVBQUVxRjtBQUFoRCxLQUFELENBQVI7QUFDRDtBQUNGOztBQUVELFNBQVNELGlCQUFULENBQTJCO0FBQUVuRCxFQUFBQSxJQUFGO0FBQVFuQyxFQUFBQSxPQUFSO0FBQWdCL0IsRUFBQUE7QUFBaEIsQ0FBM0IsRUFBdUQ7QUFFckQ7QUFDQSxNQUFJb0UsaUJBQWlCLEdBQUksR0FBRUYsSUFBSyxrQkFBaEM7QUFDQSxNQUFJbEMsY0FBYyxHQUFHa0IsSUFBSSxDQUFDQyxLQUFMLENBQVdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQmUsaUJBQXJCLENBQVgsQ0FBckI7QUFDQSxNQUFJbUQsY0FBYyxHQUFHLElBQXJCOztBQUNBLE1BQUl2RixjQUFKLEVBQW9CO0FBQ2xCdUYsSUFBQUEsY0FBYyxHQUFHLENBQUMsR0FBR3ZGLGNBQUosRUFBb0IsRUFBQyxHQUFHRCxPQUFKO0FBQVl5QyxNQUFBQSxJQUFJLEVBQUM7QUFBakIsS0FBcEIsQ0FBakI7QUFDRCxHQUZELE1BRU87QUFDTCtDLElBQUFBLGNBQWMsR0FBRyxDQUFDLEVBQUMsR0FBR3hGLE9BQUo7QUFBWXlDLE1BQUFBLElBQUksRUFBQztBQUFqQixLQUFELENBQWpCO0FBQ0Q7O0FBQ0RwQixFQUFBQSxZQUFZLENBQUNxQixPQUFiLENBQXFCTCxpQkFBckIsRUFBd0NsQixJQUFJLENBQUN3QixTQUFMLENBQWU2QyxjQUFmLENBQXhDO0FBRUF2SCxFQUFBQSxRQUFRLENBQUM7QUFDUGQsSUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUMyQyx1QkFEWDtBQUVQUyxJQUFBQSxjQUFjLEVBQUV1RjtBQUZULEdBQUQsQ0FBUjtBQUlEOztBQzlKTSxTQUFTQyxXQUFULENBQXFCO0FBQzFCeEgsRUFBQUEsUUFEMEI7QUFFMUIrQixFQUFBQSxPQUYwQjtBQUcxQm1DLEVBQUFBLElBSDBCO0FBSTFCNkMsRUFBQUEsY0FKMEI7QUFLMUI1RyxFQUFBQSxVQUwwQjtBQU0xQjZHLEVBQUFBO0FBTjBCLENBQXJCLEVBT0o7QUFHREYsRUFBQUEsbUJBQW1CLENBQUM7QUFBRTlHLElBQUFBLFFBQUY7QUFBWStCLElBQUFBLE9BQVo7QUFBcUJtQyxJQUFBQSxJQUFyQjtBQUEyQi9ELElBQUFBLFVBQTNCO0FBQXVDNEcsSUFBQUEsY0FBdkM7QUFBd0RDLElBQUFBO0FBQXhELEdBQUQsQ0FBbkI7QUFDRDtBQUVNLFNBQVNTLFlBQVQsQ0FBc0I7QUFDM0J6SCxFQUFBQSxRQUQyQjtBQUUzQitCLEVBQUFBLE9BRjJCO0FBRzNCbUMsRUFBQUEsSUFIMkI7QUFJM0I2QyxFQUFBQSxjQUoyQjtBQUszQjVHLEVBQUFBLFVBTDJCO0FBTTNCNkcsRUFBQUE7QUFOMkIsQ0FBdEIsRUFPSjtBQUVERixFQUFBQSxtQkFBbUIsQ0FBQztBQUFFOUcsSUFBQUEsUUFBRjtBQUFZK0IsSUFBQUEsT0FBWjtBQUFxQm1DLElBQUFBLElBQXJCO0FBQTJCL0QsSUFBQUEsVUFBM0I7QUFBdUM0RyxJQUFBQSxjQUF2QztBQUF3REMsSUFBQUE7QUFBeEQsR0FBRCxDQUFuQjtBQUNEO0FBRU0sU0FBU1UsV0FBVCxDQUFxQjtBQUMxQjFILEVBQUFBLFFBRDBCO0FBRTFCK0IsRUFBQUEsT0FGMEI7QUFHMUJtQyxFQUFBQSxJQUgwQjtBQUkxQjZDLEVBQUFBLGNBSjBCO0FBSzFCNUcsRUFBQUEsVUFMMEI7QUFNMUI2RyxFQUFBQTtBQU4wQixDQUFyQixFQU9KO0FBRURGLEVBQUFBLG1CQUFtQixDQUFDO0FBQUU5RyxJQUFBQSxRQUFGO0FBQVkrQixJQUFBQSxPQUFaO0FBQXFCbUMsSUFBQUEsSUFBckI7QUFBMkIvRCxJQUFBQSxVQUEzQjtBQUF1QzRHLElBQUFBLGNBQXZDO0FBQXdEQyxJQUFBQTtBQUF4RCxHQUFELENBQW5CO0FBQ0Q7QUFFTSxTQUFTVyxZQUFULENBQXNCO0FBQzNCM0gsRUFBQUEsUUFEMkI7QUFFM0IrQixFQUFBQSxPQUYyQjtBQUczQm1DLEVBQUFBLElBSDJCO0FBSTNCNkMsRUFBQUEsY0FKMkI7QUFLM0I1RyxFQUFBQSxVQUwyQjtBQU0zQjZHLEVBQUFBO0FBTjJCLENBQXRCLEVBT0o7QUFFREYsRUFBQUEsbUJBQW1CLENBQUM7QUFBRTlHLElBQUFBLFFBQUY7QUFBWStCLElBQUFBLE9BQVo7QUFBcUJtQyxJQUFBQSxJQUFyQjtBQUEyQi9ELElBQUFBLFVBQTNCO0FBQXVDNEcsSUFBQUEsY0FBdkM7QUFBd0RDLElBQUFBO0FBQXhELEdBQUQsQ0FBbkI7QUFFRDtBQUVNLFNBQVNZLGFBQVQsQ0FBdUI7QUFBRTVILEVBQUFBLFFBQUY7QUFBWStCLEVBQUFBLE9BQVo7QUFBcUJtQyxFQUFBQSxJQUFyQjtBQUEyQjZDLEVBQUFBLGNBQTNCO0FBQTBDNUcsRUFBQUEsVUFBMUM7QUFBcUQ2RyxFQUFBQTtBQUFyRCxDQUF2QixFQUFzRjtBQUczRkYsRUFBQUEsbUJBQW1CLENBQUM7QUFBRTlHLElBQUFBLFFBQUY7QUFBWStCLElBQUFBLE9BQVo7QUFBcUJtQyxJQUFBQSxJQUFyQjtBQUEyQi9ELElBQUFBLFVBQTNCO0FBQXVDNEcsSUFBQUEsY0FBdkM7QUFBd0RDLElBQUFBO0FBQXhELEdBQUQsQ0FBbkI7QUFDRDs7QUFFTSxTQUFTYSxhQUFULENBQXVCO0FBQzVCN0gsRUFBQUEsUUFENEI7QUFFNUIrQixFQUFBQSxPQUY0QjtBQUc1Qm1DLEVBQUFBLElBSDRCO0FBSTVCNkMsRUFBQUEsY0FKNEI7QUFLNUI1RyxFQUFBQSxVQUw0QjtBQU01QjZHLEVBQUFBO0FBTjRCLENBQXZCLEVBT0o7QUFFREYsRUFBQUEsbUJBQW1CLENBQUM7QUFBRTlHLElBQUFBLFFBQUY7QUFBWStCLElBQUFBLE9BQVo7QUFBcUJtQyxJQUFBQSxJQUFyQjtBQUEyQi9ELElBQUFBLFVBQTNCO0FBQXVDNEcsSUFBQUEsY0FBdkM7QUFBd0RDLElBQUFBO0FBQXhELEdBQUQsQ0FBbkI7QUFDRDs7QUMvQ00sU0FBU2MsZ0JBQVQsQ0FBMEI7QUFDL0JwRixFQUFBQSxhQUQrQjtBQUUvQkssRUFBQUEsUUFGK0I7QUFHL0IvQyxFQUFBQSxRQUgrQjtBQUkvQitHLEVBQUFBO0FBSitCLENBQTFCLEVBS0o7QUFDRCxRQUFNO0FBQUU1RyxJQUFBQTtBQUFGLE1BQWlCRCxXQUFXLEVBQWxDOztBQUNBLFdBQVM2SCxxQkFBVCxDQUErQjtBQUFFaEcsSUFBQUEsT0FBRjtBQUFVOEQsSUFBQUE7QUFBVixHQUEvQixFQUFvRDtBQUNsRCxZQUFROUQsT0FBTyxDQUFDL0MsS0FBaEI7QUFDRSxXQUFLK0YsYUFBYSxDQUFDTyxPQUFuQjtBQUNFbUIsUUFBQUEsV0FBVyxDQUFDO0FBQ1Z6RyxVQUFBQSxRQURVO0FBRVYrQixVQUFBQSxPQUZVO0FBR1ZtQyxVQUFBQSxJQUFJLEVBQUNuQixRQUhLO0FBSVZnRSxVQUFBQSxjQUpVO0FBS1Y1RyxVQUFBQSxVQUxVO0FBTVYwRixVQUFBQTtBQU5VLFNBQUQsQ0FBWDtBQVFBOztBQUNGLFdBQUtkLGFBQWEsQ0FBQ1csU0FBbkI7QUFDRW1CLFFBQUFBLGFBQWEsQ0FBQztBQUNaN0csVUFBQUEsUUFEWTtBQUVaK0IsVUFBQUEsT0FGWTtBQUdabUMsVUFBQUEsSUFBSSxFQUFDbkIsUUFITztBQUlaZ0UsVUFBQUEsY0FKWTtBQUtaNUcsVUFBQUEsVUFMWTtBQU1aMEYsVUFBQUE7QUFOWSxTQUFELENBQWI7QUFRQTs7QUFDRixXQUFLZCxhQUFhLENBQUNTLFFBQW5CO0FBQ0VtQixRQUFBQSxZQUFZLENBQUM7QUFDWDNHLFVBQUFBLFFBRFc7QUFFWCtCLFVBQUFBLE9BRlc7QUFHWG1DLFVBQUFBLElBQUksRUFBQ25CLFFBSE07QUFJWGdFLFVBQUFBLGNBSlc7QUFLWDVHLFVBQUFBLFVBTFc7QUFNWDBGLFVBQUFBO0FBTlcsU0FBRCxDQUFaO0FBUUE7O0FBQ0YsV0FBS2QsYUFBYSxDQUFDVSxPQUFuQjtBQUVFbUIsUUFBQUEsV0FBVyxDQUFDO0FBQ1Y1RyxVQUFBQSxRQURVO0FBRVYrQixVQUFBQSxPQUZVO0FBR1ZtQyxVQUFBQSxJQUFJLEVBQUNuQixRQUhLO0FBSVZnRSxVQUFBQSxjQUpVO0FBS1Y1RyxVQUFBQSxVQUxVO0FBTVYwRixVQUFBQTtBQU5VLFNBQUQsQ0FBWDtBQVFBOztBQUNGLFdBQUtkLGFBQWEsQ0FBQ1EsUUFBbkI7QUFDRW1CLFFBQUFBLFlBQVksQ0FBQztBQUNYMUcsVUFBQUEsUUFEVztBQUVYK0IsVUFBQUEsT0FGVztBQUdYbUMsVUFBQUEsSUFBSSxFQUFDbkIsUUFITTtBQUlYZ0UsVUFBQUEsY0FKVztBQUtYNUcsVUFBQUEsVUFMVztBQU1YMEYsVUFBQUE7QUFOVyxTQUFELENBQVo7QUFTQTs7QUFDRixXQUFLZCxhQUFhLENBQUNZLFFBQW5CO0FBRUVhLFFBQUFBLFlBQVksQ0FBQztBQUNYeEcsVUFBQUEsUUFEVztBQUVYK0IsVUFBQUEsT0FGVztBQUdYbUMsVUFBQUEsSUFBSSxFQUFDbkIsUUFITTtBQUlYZ0UsVUFBQUEsY0FKVztBQUtYNUcsVUFBQUEsVUFMVztBQU1YMEYsVUFBQUE7QUFOVyxTQUFELENBQVo7QUFRQTtBQS9ESjtBQW1FRDs7QUFFRCxXQUFTbUMsYUFBVCxDQUF1QjtBQUFFakcsSUFBQUEsT0FBRjtBQUFXaUYsSUFBQUE7QUFBWCxHQUF2QixFQUE0QztBQUUxQyxZQUFRakYsT0FBTyxDQUFDL0MsS0FBaEI7QUFDRSxXQUFLK0YsYUFBYSxDQUFDRSxRQUFuQjtBQUNFd0MsUUFBQUEsWUFBWSxDQUFDO0FBQUV6SCxVQUFBQSxRQUFGO0FBQVkrQixVQUFBQSxPQUFaO0FBQXNCbUMsVUFBQUEsSUFBSSxFQUFDbkIsUUFBM0I7QUFBcUNnRSxVQUFBQSxjQUFyQztBQUFvRDVHLFVBQUFBLFVBQXBEO0FBQStENkcsVUFBQUE7QUFBL0QsU0FBRCxDQUFaO0FBQ0E7O0FBQ0YsV0FBS2pDLGFBQWEsQ0FBQ0ksT0FBbkI7QUFFRXVDLFFBQUFBLFdBQVcsQ0FBQztBQUFFMUgsVUFBQUEsUUFBRjtBQUFZK0IsVUFBQUEsT0FBWjtBQUFzQm1DLFVBQUFBLElBQUksRUFBQ25CLFFBQTNCO0FBQXFDZ0UsVUFBQUEsY0FBckM7QUFBb0Q1RyxVQUFBQSxVQUFwRDtBQUErRDZHLFVBQUFBO0FBQS9ELFNBQUQsQ0FBWDtBQUNBOztBQUNGLFdBQUtqQyxhQUFhLENBQUNHLFFBQW5CO0FBRUV5QyxRQUFBQSxZQUFZLENBQUM7QUFBRTNILFVBQUFBLFFBQUY7QUFBWStCLFVBQUFBLE9BQVo7QUFBc0JtQyxVQUFBQSxJQUFJLEVBQUNuQixRQUEzQjtBQUFxQ2dFLFVBQUFBLGNBQXJDO0FBQW9ENUcsVUFBQUEsVUFBcEQ7QUFBK0Q2RyxVQUFBQTtBQUEvRCxTQUFELENBQVo7QUFDQTs7QUFDRixXQUFLakMsYUFBYSxDQUFDQyxPQUFuQjtBQUNFd0MsUUFBQUEsV0FBVyxDQUFDO0FBQUV4SCxVQUFBQSxRQUFGO0FBQVkrQixVQUFBQSxPQUFaO0FBQXNCbUMsVUFBQUEsSUFBSSxFQUFDbkIsUUFBM0I7QUFBcUNnRSxVQUFBQSxjQUFyQztBQUFvRDVHLFVBQUFBLFVBQXBEO0FBQStENkcsVUFBQUE7QUFBL0QsU0FBRCxDQUFYO0FBQ0E7O0FBQ0YsV0FBS2pDLGFBQWEsQ0FBQ00sU0FBbkI7QUFDRXVDLFFBQUFBLGFBQWEsQ0FBQztBQUFFNUgsVUFBQUEsUUFBRjtBQUFZK0IsVUFBQUEsT0FBWjtBQUFzQm1DLFVBQUFBLElBQUksRUFBQ25CLFFBQTNCO0FBQXFDZ0UsVUFBQUEsY0FBckM7QUFBb0Q1RyxVQUFBQSxVQUFwRDtBQUErRDZHLFVBQUFBO0FBQS9ELFNBQUQsQ0FBYjtBQUNBOztBQUNGLFdBQUtqQyxhQUFhLENBQUNLLFNBQW5CO0FBRUV5QyxRQUFBQSxhQUFhLENBQUM7QUFBRTdILFVBQUFBLFFBQUY7QUFBWStCLFVBQUFBLE9BQVo7QUFBc0JtQyxVQUFBQSxJQUFJLEVBQUNuQixRQUEzQjtBQUFxQ2dFLFVBQUFBLGNBQXJDO0FBQW9ENUcsVUFBQUEsVUFBcEQ7QUFBK0Q2RyxVQUFBQTtBQUEvRCxTQUFELENBQWI7QUFDQTtBQXJCSjtBQXlCRDs7QUFFRCxXQUFTaUIsY0FBVCxDQUF3QjtBQUFFbkcsSUFBQUE7QUFBRixHQUF4QixFQUFzQztBQUNwQ0EsSUFBQUEsUUFBUSxDQUFDb0csT0FBVCxDQUFrQm5HLE9BQUQsSUFBYTtBQUM1QmlHLE1BQUFBLGFBQWEsQ0FBQztBQUFFakcsUUFBQUEsT0FBRjtBQUFVaUYsUUFBQUEsTUFBTSxFQUFDO0FBQWpCLE9BQUQsQ0FBYjtBQUNELEtBRkQ7QUFHRDs7QUFFRG1CLEVBQUFBLEdBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSXpGLGFBQWEsSUFBS0ssUUFBdEIsRUFBZ0M7QUFFOUIsY0FBUUwsYUFBYSxDQUFDeEQsSUFBdEI7QUFDRSxhQUFLLGlCQUFMO0FBRUU2SSxVQUFBQSxxQkFBcUIsQ0FBQztBQUFFaEcsWUFBQUEsT0FBTyxFQUFFVyxhQUFhLENBQUNYLE9BQXpCO0FBQWlDOEQsWUFBQUEsT0FBTyxFQUFDO0FBQXpDLFdBQUQsQ0FBckI7QUFDQTs7QUFDRixhQUFLLFNBQUw7QUFFRSxjQUFHa0IsY0FBYyxJQUFJQSxjQUFjLENBQUNoRSxRQUFmLEtBQTJCTCxhQUFhLENBQUNYLE9BQWQsQ0FBc0JnQixRQUF0RSxFQUErRTtBQUU3RWlGLFlBQUFBLGFBQWEsQ0FBQztBQUFFakcsY0FBQUEsT0FBTyxFQUFFVyxhQUFhLENBQUNYLE9BQXpCO0FBQWlDaUYsY0FBQUEsTUFBTSxFQUFDO0FBQXhDLGFBQUQsQ0FBYjtBQUNELFdBSEQsTUFHSztBQUVIZ0IsWUFBQUEsYUFBYSxDQUFDO0FBQUVqRyxjQUFBQSxPQUFPLEVBQUVXLGFBQWEsQ0FBQ1gsT0FBekI7QUFBaUNpRixjQUFBQSxNQUFNLEVBQUM7QUFBeEMsYUFBRCxDQUFiO0FBQ0Q7O0FBRUQ7O0FBQ0YsYUFBSyxpQkFBTDtBQUVFaUIsVUFBQUEsY0FBYyxDQUFDO0FBQUVuRyxZQUFBQSxRQUFRLEVBQUVZLGFBQWEsQ0FBQ1o7QUFBMUIsV0FBRCxDQUFkO0FBQ0E7O0FBQ0YsYUFBSyxjQUFMO0FBRUVpRyxVQUFBQSxxQkFBcUIsQ0FBQztBQUFFaEcsWUFBQUEsT0FBTyxFQUFFVyxhQUFhLENBQUNYLE9BQXpCO0FBQWlDOEQsWUFBQUEsT0FBTyxFQUFDO0FBQXpDLFdBQUQsQ0FBckI7QUFDQTtBQXZCSjtBQTJCRDtBQUNGLEdBL0JRLEVBK0JOLENBQUNuRCxhQUFELEVBQWdCSyxRQUFoQixDQS9CTSxDQUFUO0FBaUNBLFNBQU8sRUFBUDtBQUNEOztBQ3RLRCxvQkFBZTtBQUNicUYsRUFBQUEsYUFBYSxFQUFFLGVBREY7QUFFYkMsRUFBQUEsYUFBYSxFQUFFLGVBRkY7QUFHYkMsRUFBQUEsYUFBYSxFQUFFLGVBSEY7QUFJYkMsRUFBQUEsWUFBWSxFQUFFLGNBSkQ7QUFNYkMsRUFBQUEsY0FBYyxFQUFFLGdCQU5IO0FBT2JDLEVBQUFBLGFBQWEsRUFBRSxlQVBGO0FBUWJDLEVBQUFBLGNBQWMsRUFBRSxnQkFSSDtBQVViQyxFQUFBQSxjQUFjLEVBQUUsZ0JBVkg7QUFXYkMsRUFBQUEsY0FBYyxFQUFFLGdCQVhIO0FBWWJDLEVBQUFBLGFBQWEsRUFBRSxlQVpGO0FBY2JDLEVBQUFBLHVCQUF1QixFQUFFLHlCQWRaO0FBZWJDLEVBQUFBLHVCQUF1QixFQUFFLHlCQWZaO0FBZ0JiQyxFQUFBQSxzQkFBc0IsRUFBRSx3QkFoQlg7QUFrQmJDLEVBQUFBLDJCQUEyQixFQUFFLDZCQWxCaEI7QUFtQmJDLEVBQUFBLDJCQUEyQixFQUFFLDZCQW5CaEI7QUFvQmJDLEVBQUFBLDBCQUEwQixFQUFFLDRCQXBCZjtBQXFCYkMsRUFBQUEsa0JBQWtCLEVBQUUsb0JBckJQO0FBdUJiQyxFQUFBQSx3QkFBd0IsRUFBRTtBQXZCYixDQUFmOztBQ0NPLE1BQU0vSSxXQUFTLEdBQUc7QUFDdkJnSixFQUFBQSxLQUFLLEVBQUUsRUFEZ0I7QUFFdkJDLEVBQUFBLFFBQVEsRUFBRSxFQUZhO0FBR3ZCQyxFQUFBQSxPQUFPLEVBQUUsS0FIYztBQUl2Qm5ILEVBQUFBLEtBQUssRUFBRSxJQUpnQjtBQUt2QlUsRUFBQUEsUUFBUSxFQUFFLEVBTGE7QUFNdkJYLEVBQUFBLE9BQU8sRUFBRSxLQU5jO0FBT3ZCcUgsRUFBQUEsT0FBTyxFQUFFLEVBUGM7QUFRdkJDLEVBQUFBLE9BQU8sRUFBRSxFQVJjO0FBU3ZCQyxFQUFBQSxlQUFlLEVBQUUsRUFUTTtBQVV2QkMsRUFBQUEsS0FBSyxFQUFFLElBVmdCO0FBV3ZCQyxFQUFBQSxVQUFVLEVBQUUsS0FYVztBQVl2QkMsRUFBQUEsaUJBQWlCLEVBQUUsS0FaSTtBQWF2QkMsRUFBQUEsWUFBWSxFQUFFO0FBYlMsQ0FBbEI7QUFnQkEsU0FBU0MsV0FBVCxDQUFxQmhMLEtBQXJCLEVBQTRCQyxNQUE1QixFQUFvQztBQUN6QyxVQUFRQSxNQUFNLENBQUNDLElBQWY7QUFDRSxTQUFLTixhQUFXLENBQUN3SixhQUFqQjtBQUNFLFlBQU02QixTQUFTLEdBQUcsRUFDaEIsR0FBR2pMLEtBRGE7QUFFaEIsU0FBQ0MsTUFBTSxDQUFDaUwsT0FBUCxDQUFlQyxRQUFoQixHQUEyQmxMLE1BQU0sQ0FBQ2lMLE9BQVAsQ0FBZTFKO0FBRjFCLE9BQWxCO0FBS0EsYUFBT3lKLFNBQVA7O0FBQ0YsU0FBS3JMLGFBQVcsQ0FBQ3lKLGFBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdySixLQUFMO0FBQVlvRCxRQUFBQSxPQUFPLEVBQUU7QUFBckIsT0FBUDs7QUFDRixTQUFLeEQsYUFBVyxDQUFDMEosYUFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR3RKLEtBREU7QUFFTHdLLFFBQUFBLE9BQU8sRUFBRSxJQUZKO0FBR0xwSCxRQUFBQSxPQUFPLEVBQUUsS0FISjtBQUlMd0gsUUFBQUEsS0FBSyxFQUFFM0ssTUFBTSxDQUFDMkssS0FKVDtBQUtMN0csUUFBQUEsUUFBUSxFQUFFOUQsTUFBTSxDQUFDOEQsUUFMWjtBQU1MdUcsUUFBQUEsS0FBSyxFQUFFckssTUFBTSxDQUFDcUssS0FOVDtBQU9MTyxRQUFBQSxVQUFVLEVBQUUsSUFQUDtBQVFMTixRQUFBQSxRQUFRLEVBQUUsRUFSTDtBQVNMYSxRQUFBQSxjQUFjLEVBQUU7QUFUWCxPQUFQOztBQVdGLFNBQUt4TCxhQUFXLENBQUMySixZQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHdkosS0FBTDtBQUFZb0QsUUFBQUEsT0FBTyxFQUFFLEtBQXJCO0FBQTRCQyxRQUFBQSxLQUFLLEVBQUVwRCxNQUFNLENBQUNpTCxPQUFQLENBQWU3SDtBQUFsRCxPQUFQOztBQUNGLFNBQUt6RCxhQUFXLENBQUMrSixjQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHM0osS0FBTDtBQUFZb0QsUUFBQUEsT0FBTyxFQUFFO0FBQXJCLE9BQVA7O0FBQ0YsU0FBS3hELGFBQVcsQ0FBQ2dLLGNBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUc1SixLQURFO0FBRUxvRCxRQUFBQSxPQUFPLEVBQUUsS0FGSjtBQUdMb0gsUUFBQUEsT0FBTyxFQUFFLElBSEo7QUFJTEssUUFBQUEsVUFBVSxFQUFFLElBSlA7QUFLTEQsUUFBQUEsS0FBSyxFQUFFM0ssTUFBTSxDQUFDMkssS0FMVDtBQU1MN0csUUFBQUEsUUFBUSxFQUFFOUQsTUFBTSxDQUFDOEQsUUFOWjtBQU9MdUcsUUFBQUEsS0FBSyxFQUFFckssTUFBTSxDQUFDcUssS0FQVDtBQVFMQyxRQUFBQSxRQUFRLEVBQUUsRUFSTDtBQVNMYSxRQUFBQSxjQUFjLEVBQUU7QUFUWCxPQUFQOztBQVdGLFNBQUt4TCxhQUFXLENBQUNpSyxhQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHN0osS0FBTDtBQUFZb0QsUUFBQUEsT0FBTyxFQUFFLEtBQXJCO0FBQTRCQyxRQUFBQSxLQUFLLEVBQUVwRCxNQUFNLENBQUNpTCxPQUFQLENBQWU3SDtBQUFsRCxPQUFQOztBQUNGLFNBQUt6RCxhQUFXLENBQUNrSyx1QkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRzlKLEtBQUw7QUFBWW9ELFFBQUFBLE9BQU8sRUFBRTtBQUFyQixPQUFQOztBQUNGLFNBQUt4RCxhQUFXLENBQUNtSyx1QkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBRy9KLEtBREU7QUFFTHdLLFFBQUFBLE9BQU8sRUFBRSxJQUZKO0FBR0xwSCxRQUFBQSxPQUFPLEVBQUUsS0FISjtBQUlMd0gsUUFBQUEsS0FBSyxFQUFFM0ssTUFBTSxDQUFDMkssS0FKVDtBQUtMN0csUUFBQUEsUUFBUSxFQUFFOUQsTUFBTSxDQUFDOEQsUUFMWjtBQU1MdUcsUUFBQUEsS0FBSyxFQUFFckssTUFBTSxDQUFDcUssS0FOVDtBQU9MUSxRQUFBQSxpQkFBaUIsRUFBRSxJQVBkO0FBUUxDLFFBQUFBLFlBQVksRUFBRTlLLE1BQU0sQ0FBQ2tGO0FBUmhCLE9BQVA7O0FBVUYsU0FBS3ZGLGFBQVcsQ0FBQ29LLHNCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHaEssS0FBTDtBQUFZb0QsUUFBQUEsT0FBTyxFQUFFLEtBQXJCO0FBQTRCQyxRQUFBQSxLQUFLLEVBQUVwRCxNQUFNLENBQUNvRDtBQUExQyxPQUFQOztBQUNGLFNBQUt6RCxhQUFXLENBQUNxSywyQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR2pLLEtBQUw7QUFBWW9ELFFBQUFBLE9BQU8sRUFBRTtBQUFyQixPQUFQOztBQUNGLFNBQUt4RCxhQUFXLENBQUNzSywyQkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR2xLLEtBREU7QUFFTG9ELFFBQUFBLE9BQU8sRUFBRSxLQUZKO0FBR0xvSCxRQUFBQSxPQUFPLEVBQUUsSUFISjtBQUlMTyxRQUFBQSxZQUFZLEVBQUU5SyxNQUFNLENBQUNrRjtBQUpoQixPQUFQOztBQU1GLFNBQUt2RixhQUFXLENBQUN1SywwQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR25LLEtBQUw7QUFBWW9ELFFBQUFBLE9BQU8sRUFBRSxLQUFyQjtBQUE0QkMsUUFBQUEsS0FBSyxFQUFFcEQsTUFBTSxDQUFDaUwsT0FBUCxDQUFlN0g7QUFBbEQsT0FBUDs7QUFDRixTQUFLekQsYUFBVyxDQUFDd0ssa0JBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdwSyxLQUFMO0FBQVk0SyxRQUFBQSxLQUFLLEVBQUUzSyxNQUFNLENBQUMySztBQUExQixPQUFQOztBQUNGLFNBQUtoTCxhQUFXLENBQUM4SixjQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHcEk7QUFBTCxPQUFQOztBQUNGLFNBQUsxQixhQUFXLENBQUN5Syx3QkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR3JLLEtBREU7QUFFTCtELFFBQUFBLFFBQVEsRUFBRTlELE1BQU0sQ0FBQ2tELElBQVAsQ0FBWVksUUFGakI7QUFHTHVHLFFBQUFBLEtBQUssRUFBRXJLLE1BQU0sQ0FBQ2tELElBQVAsQ0FBWW1IO0FBSGQsT0FBUDs7QUFLRjtBQUNFLGFBQU90SyxLQUFQO0FBN0VKO0FBK0VEOztBQzlGRCxNQUFNcUwsZ0JBQWdCLEdBQUcvSyxDQUFhLEVBQXRDOztBQXdDTyxTQUFTZ0wsaUJBQVQsQ0FBMkIxSyxLQUEzQixFQUFrQztBQUN2QyxRQUFNO0FBQUUySyxJQUFBQTtBQUFGLE1BQW1CM0ssS0FBekI7QUFDQSxRQUFNLENBQUM0SyxTQUFELEVBQVlDLFlBQVosSUFBNEJDLEdBQVEsQ0FBQ0gsWUFBRCxDQUExQztBQUVBLFFBQU0vSixLQUFLLEdBQUdDLEdBQU8sQ0FBQyxNQUFNLENBQUMrSixTQUFELEVBQVlDLFlBQVosQ0FBUCxFQUFrQyxDQUFDRCxTQUFELENBQWxDLENBQXJCO0FBRUEsU0FBTyxFQUFDLGdCQUFELENBQWtCLFFBQWxCO0FBQTJCLElBQUEsS0FBSyxFQUFFaEs7QUFBbEMsS0FBNkNaLEtBQTdDLEVBQVA7QUFDRDs7QUM5Q0QsTUFBTStLLFdBQVcsR0FBR3JMLENBQWEsRUFBakM7O0FBRUEsU0FBU3NMLGNBQVQsR0FBMEI7QUFDeEIsUUFBTXBMLE9BQU8sR0FBR0MsR0FBVSxDQUFDa0wsV0FBRCxDQUExQjs7QUFDQSxNQUFJLENBQUNuTCxPQUFMLEVBQWM7QUFDWixVQUFNLElBQUlFLEtBQUosQ0FBVSw4Q0FBVixDQUFOO0FBQ0Q7O0FBRUQsUUFBTSxDQUFDVixLQUFELEVBQVFnQixRQUFSLElBQW9CUixPQUExQjtBQUVBLFNBQU87QUFDTFIsSUFBQUEsS0FESztBQUVMZ0IsSUFBQUE7QUFGSyxHQUFQO0FBSUQ7O0FBRUQsU0FBUzZLLFlBQVQsQ0FBc0JqTCxLQUF0QixFQUE2QjtBQUMzQixRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBZUQsS0FBckI7QUFDQSxRQUFNLENBQUNaLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JPLEdBQVUsQ0FBQ3lKLFdBQUQsRUFBYzFKLFdBQWQsQ0FBcEM7QUFDQSxRQUFNRSxLQUFLLEdBQUdDLEdBQU8sQ0FBQyxNQUFNLENBQUN6QixLQUFELEVBQVFnQixRQUFSLENBQVAsRUFBMEIsQ0FBQ2hCLEtBQUQsQ0FBMUIsQ0FBckI7QUFDQSxTQUNFLEVBQUMsV0FBRCxDQUFhLFFBQWI7QUFBc0IsSUFBQSxLQUFLLEVBQUV3QjtBQUE3QixLQUF3Q1osS0FBeEMsR0FDRSxFQUFDLGlCQUFELFFBQW9CQyxRQUFwQixDQURGLENBREY7QUFLRDs7QUN6Qk0sU0FBU2lMLFlBQVQsQ0FBc0I7QUFBRUMsRUFBQUEsU0FBRjtBQUFhaEksRUFBQUEsUUFBYjtBQUF1Qi9DLEVBQUFBO0FBQXZCLENBQXRCLEVBQXlEO0FBQzlEbUksRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJcEYsUUFBSixFQUFjO0FBQ1osWUFBTWlJLElBQUksR0FBRyxJQUFJQyxTQUFKLENBQWUsR0FBRUYsU0FBVSxjQUFhaEksUUFBUyxFQUFqRCxDQUFiOztBQUNBaUksTUFBQUEsSUFBSSxDQUFDRSxTQUFMLEdBQWtCL0csT0FBRCxJQUFhO0FBQzVCLGNBQU1nSCxHQUFHLEdBQUdqSSxJQUFJLENBQUNDLEtBQUwsQ0FBV2dCLE9BQU8sQ0FBQ2lILElBQW5CLENBQVo7QUFFQXBMLFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ3VDLHVCQUFwQjtBQUE2Q3VCLFVBQUFBLGFBQWEsRUFBRXlJO0FBQTVELFNBQUQsQ0FBUjtBQUVELE9BTEQ7O0FBTUFILE1BQUFBLElBQUksQ0FBQ0ssTUFBTCxHQUFjLE1BQU07QUFFbEJyTCxRQUFBQSxRQUFRLENBQUM7QUFBRWQsVUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUM2QztBQUFwQixTQUFELENBQVI7QUFDRCxPQUhEOztBQUlBdUosTUFBQUEsSUFBSSxDQUFDTSxPQUFMLEdBQWUsTUFBTTtBQUNuQnRMLFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQytDO0FBQXBCLFNBQUQsQ0FBUjtBQUNELE9BRkQ7O0FBR0FxSixNQUFBQSxJQUFJLENBQUNPLE9BQUwsR0FBZ0JsSixLQUFELElBQVc7QUFDeEJyQyxRQUFBQSxRQUFRLENBQUM7QUFBRWQsVUFBQUEsSUFBSSxFQUFFTixhQUFXLENBQUNpRCxZQUFwQjtBQUFrQ1EsVUFBQUE7QUFBbEMsU0FBRCxDQUFSO0FBQ0QsT0FGRDs7QUFHQXJDLE1BQUFBLFFBQVEsQ0FBQztBQUFFZCxRQUFBQSxJQUFJLEVBQUVOLGFBQVcsQ0FBQ2dELFlBQXBCO0FBQWtDWSxRQUFBQSxNQUFNLEVBQUV3STtBQUExQyxPQUFELENBQVI7QUFDRDtBQUNGLEdBckJRLEVBcUJOLENBQUNqSSxRQUFELENBckJNLENBQVQ7QUFzQkQ7O0FDUEQsTUFBTXlJLGNBQWMsR0FBR2xNLENBQWEsRUFBcEM7QUFDTyxTQUFTbU0saUJBQVQsR0FBNkI7QUFDbEMsUUFBTWpNLE9BQU8sR0FBR0MsR0FBVSxDQUFDK0wsY0FBRCxDQUExQjs7QUFDQSxNQUFJLENBQUNoTSxPQUFMLEVBQWM7QUFDWixVQUFNLElBQUlFLEtBQUosQ0FBVSxzREFBVixDQUFOO0FBQ0Q7O0FBRUQsU0FBT0YsT0FBUDtBQUNEO0FBRU0sU0FBU2tNLGdCQUFULENBQTBCOUwsS0FBMUIsRUFBaUM7QUFDdEMsUUFBTTtBQUFFbUwsSUFBQUE7QUFBRixNQUFnQm5MLEtBQXRCO0FBQ0EsUUFBTStMLFdBQVcsR0FBR2YsY0FBYyxFQUFsQztBQUNBLFFBQU07QUFBRTdILElBQUFBO0FBQUYsTUFBZTRJLFdBQVcsQ0FBQzNNLEtBQWpDO0FBQ0EsUUFBTSxDQUFDQSxLQUFELEVBQVFnQixRQUFSLElBQW9CTyxHQUFVLENBQUN4QixTQUFELEVBQVV1QixTQUFWLENBQXBDO0FBQ0EsUUFBTTtBQUFFeUIsSUFBQUEsT0FBRjtBQUFXVyxJQUFBQTtBQUFYLE1BQTZCMUQsS0FBbkM7QUFDQSxRQUFNNE0sZ0JBQWdCLEdBQUdkLFlBQVksQ0FBQztBQUFFL0gsSUFBQUEsUUFBRjtBQUFZL0MsSUFBQUEsUUFBWjtBQUFzQitLLElBQUFBO0FBQXRCLEdBQUQsQ0FBckM7QUFDQSxRQUFNYyxzQkFBc0IsR0FBRy9ELGdCQUFnQixDQUFDO0FBQzlDL0UsSUFBQUEsUUFEOEM7QUFFOUMvQyxJQUFBQSxRQUY4QztBQUc5QzBDLElBQUFBLGFBSDhDO0FBSTlDcUUsSUFBQUEsY0FBYyxFQUFFaEY7QUFKOEIsR0FBRCxDQUEvQztBQU1Bb0csRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJcEYsUUFBSixFQUFjO0FBQ1pFLE1BQUFBLFlBQVksQ0FBQztBQUFFRixRQUFBQSxRQUFGO0FBQVkvQyxRQUFBQTtBQUFaLE9BQUQsQ0FBWjtBQUNEO0FBQ0YsR0FKUSxFQUlOLENBQUMrQyxRQUFELENBSk0sQ0FBVDtBQUtBb0YsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJcEcsT0FBTyxJQUFJZ0IsUUFBZixFQUF5QjtBQUV2QjtBQUNBZ0IsTUFBQUEsWUFBWSxDQUFDO0FBQUUvRCxRQUFBQSxRQUFGO0FBQVkrQixRQUFBQSxPQUFaO0FBQXFCZ0IsUUFBQUE7QUFBckIsT0FBRCxDQUFaLENBSHVCOztBQU12QixZQUFNaUIsR0FBRyxHQUFJLEdBQUVqQixRQUFTLFdBQXhCO0FBQ0EsWUFBTWpCLFFBQVEsR0FBR29CLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUJXLEdBQXJCLENBQVgsQ0FBakI7O0FBQ0EsVUFBSSxDQUFDbEMsUUFBTCxFQUFlO0FBQ2JzQixRQUFBQSxZQUFZLENBQUNxQixPQUFiLENBQXFCVCxHQUFyQixFQUEwQmQsSUFBSSxDQUFDd0IsU0FBTCxDQUFlLENBQUMzQyxPQUFELENBQWYsQ0FBMUI7QUFDRCxPQUZELE1BRU87QUFDTCxjQUFNa0YsWUFBWSxHQUFHbkYsUUFBUSxDQUFDN0IsSUFBVCxDQUNsQnRCLENBQUQsSUFBT0EsQ0FBQyxDQUFDb0UsUUFBRixLQUFlaEIsT0FBTyxDQUFDZ0IsUUFEWCxDQUFyQjs7QUFHQSxZQUFJa0UsWUFBSixFQUFrQjtBQUNoQixnQkFBTTZFLE9BQU8sR0FBR2hLLFFBQVEsQ0FBQ3lDLEdBQVQsQ0FBYzVGLENBQUQsSUFBTztBQUNsQyxnQkFBSUEsQ0FBQyxDQUFDb0UsUUFBRixLQUFlaEIsT0FBTyxDQUFDZ0IsUUFBM0IsRUFBcUM7QUFDbkMscUJBQU9oQixPQUFQO0FBQ0QsYUFGRCxNQUVPO0FBQ0wscUJBQU9wRCxDQUFQO0FBQ0Q7QUFDRixXQU5lLENBQWhCO0FBT0F5RSxVQUFBQSxZQUFZLENBQUNxQixPQUFiLENBQXFCVCxHQUFyQixFQUEwQmQsSUFBSSxDQUFDd0IsU0FBTCxDQUFlb0gsT0FBZixDQUExQjtBQUNELFNBVEQsTUFTTztBQUNMMUksVUFBQUEsWUFBWSxDQUFDcUIsT0FBYixDQUFxQlQsR0FBckIsRUFBMEJkLElBQUksQ0FBQ3dCLFNBQUwsQ0FBZSxDQUFDM0MsT0FBRCxDQUFmLENBQTFCO0FBQ0Q7QUFDRjs7QUFDRCxVQUFJLENBQUNBLE9BQU8sQ0FBQ3lDLElBQWIsRUFBbUI7QUFDakI7QUFDRDtBQUNDUCxRQUFBQSxrQkFBa0IsQ0FBQztBQUFFakUsVUFBQUEsUUFBRjtBQUFZK0IsVUFBQUEsT0FBWjtBQUFxQm1DLFVBQUFBLElBQUksRUFBRW5CO0FBQTNCLFNBQUQsQ0FBbEI7QUFDRDtBQUNGO0FBQ0YsR0FsQ1EsRUFrQ04sQ0FBQ2hCLE9BQUQsRUFBVWdCLFFBQVYsQ0FsQ00sQ0FBVDtBQW9DQSxRQUFNdkMsS0FBSyxHQUFHQyxHQUFPLENBQUMsTUFBTSxDQUFDekIsS0FBRCxFQUFRZ0IsUUFBUixDQUFQLEVBQTBCLENBQUNoQixLQUFELENBQTFCLENBQXJCO0FBQ0EsU0FBTyxFQUFDLGNBQUQsQ0FBZ0IsUUFBaEI7QUFBeUIsSUFBQSxLQUFLLEVBQUV3QjtBQUFoQyxLQUEyQ1osS0FBM0MsRUFBUDtBQUNEOztBQ25GRCxNQUFNbU0sWUFBWSxHQUFHek0sQ0FBYSxFQUFsQzs7QUFFQSxTQUFTME0sZUFBVCxHQUEyQjtBQUN6QixRQUFNeE0sT0FBTyxHQUFHQyxHQUFVLENBQUNzTSxZQUFELENBQTFCOztBQUVBLE1BQUksQ0FBQ3ZNLE9BQUwsRUFBYztBQUNaLFVBQU0sSUFBSUUsS0FBSixDQUFVLGlEQUFWLENBQU47QUFDRDs7QUFHRCxTQUFPRixPQUFQO0FBQ0Q7O0FBR0QsU0FBU3lNLGFBQVQsQ0FBdUJyTSxLQUF2QixFQUE4QjtBQUU1QixRQUFNO0FBQUVVLElBQUFBO0FBQUYsTUFBZ0JWLEtBQXRCO0FBRUEsUUFBTSxDQUFDWixLQUFELEVBQVFrTixRQUFSLElBQW9CeEIsR0FBUSxDQUFDcEssU0FBRCxDQUFsQztBQUVBLFNBQU8sRUFBQyxZQUFELENBQWMsUUFBZDtBQUF1QixJQUFBLEtBQUssRUFBRXRCO0FBQTlCLEtBQXlDWSxLQUF6QyxFQUFQO0FBQ0Q7O0FDckJELE1BQU11TSxVQUFVLEdBQUc3TSxDQUFhLEVBQWhDOztBQUVBLFNBQVM4TSxhQUFULEdBQXlCO0FBQ3ZCLFFBQU01TSxPQUFPLEdBQUdDLEdBQVUsQ0FBQzBNLFVBQUQsQ0FBMUI7O0FBRUEsTUFBSSxDQUFDM00sT0FBTCxFQUFjO0FBQ1osVUFBTSxJQUFJRSxLQUFKLENBQVUsNkNBQVYsQ0FBTjtBQUNEOztBQUVELFNBQU9GLE9BQVA7QUFDRDs7QUFFTSxTQUFTNk0sYUFBVCxHQUF5QjtBQUM5QixRQUFNLENBQUNDLFVBQUQsRUFBYUMsYUFBYixJQUE4QkgsYUFBYSxFQUFqRDs7QUFDRSxXQUFTSSxZQUFULEdBQXVCO0FBQ25CRCxJQUFBQSxhQUFhLENBQUNFLElBQUksSUFBRSxDQUFDQSxJQUFSLENBQWI7QUFDSDs7QUFDSCxTQUFPO0FBQUVILElBQUFBLFVBQUY7QUFBY0UsSUFBQUE7QUFBZCxHQUFQO0FBQ0Q7QUFFTSxTQUFTRSxXQUFULENBQXFCOU0sS0FBckIsRUFBNEI7QUFDakMsUUFBTSxDQUFDME0sVUFBRCxFQUFhQyxhQUFiLElBQThCN0IsR0FBUSxDQUFDLEtBQUQsQ0FBNUM7QUFFQSxRQUFNbEssS0FBSyxHQUFHQyxHQUFPLENBQUMsTUFBTSxDQUFDNkwsVUFBRCxFQUFhQyxhQUFiLENBQVAsRUFBb0MsQ0FBQ0QsVUFBRCxDQUFwQyxDQUFyQjtBQUNBLFNBQU8sRUFBQyxVQUFELENBQVksUUFBWjtBQUFxQixJQUFBLEtBQUssRUFBRTlMO0FBQTVCLEtBQXVDWixLQUF2QyxFQUFQO0FBQ0Q7O0FDNUJzZSxTQUFTK00sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlDLEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0QsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUVBLEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNFLENBQUMsQ0FBQyxDQUFvVCxJQUFJQyxHQUFDLENBQUMzTyxDQUFDLENBQUMsR0FBRyxDQUErS0EsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMyTyxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFJLElBQWlSQyxHQUFDLENBQUM1TyxDQUFDLENBQUMsSUFBSSxTQUFTNk8sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDTixHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDTSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8xTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQ0osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzRPLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUlGLENBQUMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNJLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQ0QsR0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUN6TyxDQUFDLENBQUNzTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUlLLEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUwsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUNDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBb2UsSUFBSUUsR0FBQyxDQUFDLGtPQUFrTyxDQUFDUCxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxJQUFJUSxHQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLENBQTZNLElBQUksQ0FBQyxDQUFDbFAsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSW1QLEdBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQ3BQLENBQUMsQ0FBQyxLQUFLLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDa1AsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBR0MsR0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLENBQUMsR0FBR0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQSxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQ0csR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7O0FDQTE3TSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FB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
