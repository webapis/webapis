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

var actionTypes$3 = {
  FETCH_HANGOUT_STARTED: 'FETCH_HANGOUT_STARTED',
  FETCH_HANGOUT_SUCCESS: 'FETCH_HANGOUT_SUCCESS',
  FETCH_HANGOUT_FAILED: 'FETCH_HANGOUT_FAILED',
  SEARCH_INPUT_CHANGED: 'SEARCH_INPUT_CHANGED',
  MESSAGE_RECIEVED: "MESSAGE_RECIEVED",
  SOCKET_ERROR: 'SOCKET_ERROR',
  CONNECTING: 'CONNECTING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED',
  SOCKET_READY: 'SOCKET_READY'
};

//fetch hangout from server if not found in local hangouts
async function fetchHangouts$1({
  search,
  dispatch,
  username
}) {
  try {
    dispatch({
      type: actionTypes$3.FETCH_HANGOUT_STARTED
    });
    const response = await fetch(`/hangouts/find?search=${search}&username=${username}`);

    if (response.ok) {
      const {
        hangouts
      } = await response.json();
      dispatch({
        type: actionTypes$3.FETCH_HANGOUT_SUCCESS,
        hangouts
      });
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes$3.FETCH_HANGOUT_FAILED,
      error
    });
  }
} //search for hangout by typing into TextInput

function WebSocketContainer(props) {
  const {
    username,
    token
  } = useUserName();
  const [socket, setSocket] = v$1();
  const {
    children,
    socketUrl
  } = props;
  const {
    dispatch,
    state
  } = useHangouts();
  const {
    fetchHangouts,
    search,
    pendingHangout
  } = state;
  p$1(() => {
    if (username) {
      const sock = new WebSocket(`${socketUrl}/hangouts/?username=${username}`);

      sock.onmessage = serverMessage => {
        const msg = JSON.parse(serverMessage.data);
        dispatch({
          type: actionTypes$1.SERVER_MESSAGE_RECIEVED,
          message: msg
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
        debugger;
        dispatch({
          type: actionTypes$1.SOCKET_ERROR,
          error
        });
      };

      dispatch({
        type: actionTypes$1.SOCKET_READY,
        socket: sock
      });
      setSocket(sock);
    }
  }, [username]);
  p$1(() => {
    if (fetchHangouts) {
      fetchHangouts$1({
        dispatch,
        search,
        username
      });
    }
  }, [fetchHangouts]);
  p$1(() => {
    if (pendingHangout) {
      sendHangout();
    }
  }, [pendingHangout]);

  function sendHangout() {
    socket.send(JSON.stringify(pendingHangout));
    dispatch({
      type: actionTypes$1.SENDING_HANGOUT_FULLFILLED
    });
  }

  return children;
}

function HangoutAdapter(props) {
  if (PREACT_APP_PARSE === 'PREACT_APP_PARSE') {
    return h(ParseServer, props);
  } else if (PREACT_APP_PARSE === 'PREACT_APP_NODEJS') {
    return h(WebSocketContainer, props);
  } else return null;
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
    socketUrl: `wss://${"192.168.43.49"}:3000`
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

function E$1(n,t){for(var e in t)n[e]=t[e];return n}function w$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var C$1=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return w$1(this.props,n)||w$1(this.state,t)},r}(m);var A$1=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),A$1&&A$1(n);};var F$1=n.__e;function N$1(n){return n&&((n=E$1({},n)).__c=null,n.__k=n.__k&&n.__k.map(N$1)),n}function U(){this.__u=0,this.o=null,this.__b=null;}function M$1(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function L(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function O(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);F$1(n,t,e);},(U.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=M$1(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},U.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=N$1(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var P$1=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(O.prototype=new m).u=function(n){var t=this,e=M$1(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),P$1(t,n,r)):o();};e?e(u):u();}},O.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},O.prototype.componentDidUpdate=O.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){P$1(n,e,t);});};var W=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var D$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var H$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var Z=n.event;function I(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){Z&&(n=Z(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var $$1={configurable:!0,get:function(){return this.class}},q$1=n.vnode;n.vnode=function(n){n.$$typeof=H$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&($$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",$$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=D$1.test(u))break;if(r)for(u in o=n.props={},e)o[D$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&(I(t.prototype,"componentWillMount"),I(t.prototype,"componentWillReceiveProps"),I(t.prototype,"componentWillUpdate"),t.m=!0);}q$1&&q$1(n);};

function Home() {
  return h("div", {
    "data-testid": "home",
    style: {
      paddingTop: 68
    }
  }, "Home");
}

var actionTypes$4 = {
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
    case actionTypes$4.SERVER_VALIDATION:
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

    case actionTypes$4.CLIENT_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes$4.RESET_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$4.INPUT_FOCUSED:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE,
          [action.propName]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$4.INIT_FORM_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE
        }
      };

    case actionTypes$4.INC_INPUT_COUTN:
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
    type: actionTypes$4.CLIENT_VALIDATION,
    ...validation
  };
}
function resetInputValidationState({
  validationType
}) {
  return {
    type: actionTypes$4.RESET_VALIDATION_STATE,
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
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID
      };

    case 125:
    case httpStatus.emailInvalid:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordInvalid:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
        message: validationMessages.INVALID_PASSWORD,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameInvalid:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME,
        validationState: validationStates.INVALID
      };

    case 203:
    case httpStatus.emailIsRegistered:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.REGISTERED_EMAIL,
        message: validationMessages.REGISTERED_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsNotRegistered:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_NOT_REGISTERED,
        message: validationMessages.EMAIL_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case 202:
    case httpStatus.usernameIsTaken:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_TAKEN,
        message: validationMessages.USERNAME_TAKEN,
        validationState: validationStates.INVALID
      };

    case httpStatus.emptyStringNotValid:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.EMPTY_STRING_VALIDATION,
        message: validationMessages.INVALID_EMPTY_STRING,
        validationState: validationStates.INVALID
      };

    case 200:
    case httpStatus.emailorusernameNotValid:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsNotRegistered:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_NOT_REGISTERED,
        message: validationMessages.USERNAME_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordDoNotMatch:
      return {
        type: actionTypes$4.SERVER_VALIDATION,
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
  }); // Create a new instance of the user class

  Parse.User.logIn(emailorusername, password).then(function (user) {
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
    formDispatch(serverValidation({
      status: error.code
    }));
    dispatch({
      type: actionTypes$2
    });
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

const Login = L(() => import('./Login-5db195df.js'));
const ChangePassword = L(() => import('./ChangePassword-cb6e30a4.js'));
const ForgotPassword = L(() => import('./ForgotPassword-f2def3e8.js'));
const Signup = L(() => import('./Signup-e412dcdd.js'));
const Profile = L(() => import('./Profile-a17d531c.js'));
const AuthFeedback = L(() => import('./AuthFeedback-210f5643.js'));
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

async function login$1({
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
        user: {
          token,
          username,
          email
        }
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
        user: {
          token,
          username,
          email
        }
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
async function changePassword({
  dispatch,
  state,
  formDispatch
}) {
  dispatch({
    type: actionTypes$2.CHANGE_PASSWORD_STARTED
  });

  try {
    const {
      confirm,
      password
    } = state;
    const {
      token
    } = state.user;
    debugger;
    const response = await fetch(`/auth/changepass`, {
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
        user: {
          token,
          username,
          email
        },
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
async function forgotPassword$1({
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

function useNodeAuth() {
  const {
    state,
    dispatch
  } = useAuthContext();
  const {
    dispatch: formDispatch
  } = useFormContext();

  function login() {
    login$1({
      dispatch,
      state,
      formDispatch
    });
  }

  function signup$1() {
    signup({
      dispatch,
      formDispatch,
      state
    });
  }

  function forgotPassword() {
    forgotPassword$1({
      dispatch,
      state,
      formDispatch
    });
  }

  function changePassword$1() {
    changePassword({
      dispatch,
      state,
      formDispatch
    });
  }

  return {
    signup: signup$1,
    login,
    forgotPassword,
    changePassword: changePassword$1
  };
}

const Login$1 = L(() => import('./Login-5db195df.js'));
const ChangePassword$1 = L(() => import('./ChangePassword-cb6e30a4.js'));
const ForgotPassword$1 = L(() => import('./ForgotPassword-f2def3e8.js'));
const Signup$1 = L(() => import('./Signup-e412dcdd.js'));
const Profile$1 = L(() => import('./Profile-a17d531c.js'));
const AuthFeedback$1 = L(() => import('./AuthFeedback-210f5643.js'));
function NodeAuthentication({
  children
}) {
  const {
    signup,
    login,
    changePassword,
    forgotPassword
  } = useNodeAuth();
  return h("div", {
    style: {
      paddingTop: 68
    }
  }, h(FeatureRoute, {
    path: "/changepassword"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(ChangePassword$1, {
    changePassword: changePassword
  }))), h(FeatureRoute, {
    path: "/login"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Login$1, {
    login: login
  }))), h(FeatureRoute, {
    path: "/signup"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Signup$1, {
    signup: signup
  }))), h(FeatureRoute, {
    path: "/forgotpassword"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(ForgotPassword$1, {
    forgotPassword: forgotPassword
  }))), h(FeatureRoute, {
    path: "/profile"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Profile$1, null))), h(FeatureRoute, {
    path: "/authfeedback"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(AuthFeedback$1, null))));
}

const Hangouts = L(() => import('./index-134ad4cd.js'));
function AppRoutes() {
  return h("div", {
    style: {
      height: '100%'
    }
  }, h(AppRoute, {
    path: "/auth"
  }, h(FormProvider, null, PREACT_APP_PARSE === 'PREACT_APP_PARSE' && h(ParseAuthentication, null), PREACT_APP_PARSE === 'PREACT_APP_NODEJS' && h(NodeAuthentication, null))), h(AppRoute, {
    path: "/"
  }, h(Home, null)), h(AppRoute, {
    path: "/hangouts"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Hangouts, null))));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtOWM2ZjZiYTcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3JlZHVjZXIuanMiLCIuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy91cGRhdGVEZWxpdmVyZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvc2F2ZVJlY2lldmVkSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZU1lc3NhZ2UuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvcGFyc2UvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9zdGF0ZU1hcHBlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9wYXJzZS9QYXJzZVNlcnZlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS93ZWJzb2NrZXQvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvd2Vic29ja2V0L2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvd2Vic29ja2V0L1dlYlNvY2tldENvbnRhaW5lci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0QWRhcHRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC90aGVtZS90aGVtZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcFByb3ZpZGVycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L05hdkl0ZW0uanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9saXN0L2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvaWNvbnMvdXNlcjY0LnBuZyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoRHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9uYXYvSGFuZ291dERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9TZXR0xLFuZ3MuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL25hdi9IYW5nb3V0VG9wTWVudS5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvc3R5bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L0RyYXdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvQXBwQmFyLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9pY29ucy9NZW51V2hpdGUuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L01lbnUuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9BcHBOYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9jb21wYXQvZGlzdC9jb21wYXQubW9kdWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvSG9tZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm1SZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvcGFyc2UvYXV0aC1hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L3BhcnNlL3VzZVBhcnNlQXV0aC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL1BhcnNlQXV0aGVudGljYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9ub2RlLWpzLWF1dGgvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL25vZGUtanMtYXV0aC91c2VOb2RlQXV0aC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL05vZGVBdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcFJvdXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcC5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBzdXBwb3J0ID0ge1xuICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICBibG9iOlxuICAgICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmXG4gICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbn1cblxuZnVuY3Rpb24gaXNEYXRhVmlldyhvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG59XG5cbmlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICBdXG5cbiAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICBBcnJheUJ1ZmZlci5pc1ZpZXcgfHxcbiAgICBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gIH1cbiAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgfVxuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG5mdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvclxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpdGVyYXRvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gIHRoaXMubWFwID0ge31cblxuICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICB9LCB0aGlzKVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSArICcsICcgKyB2YWx1ZSA6IHZhbHVlXG59XG5cbkhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2gobmFtZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaXRlbXMucHVzaCh2YWx1ZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5pZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xufVxuXG5mdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICB9XG4gIGJvZHkuYm9keVVzZWQgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICB9XG4gICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICB9XG4gIHJldHVybiBjaGFycy5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgaWYgKGJ1Zi5zbGljZSkge1xuICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgfSBlbHNlIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gIH1cbn1cblxuZnVuY3Rpb24gQm9keSgpIHtcbiAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5ID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbnZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICByZXR1cm4gbWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEgPyB1cGNhc2VkIDogbWV0aG9kXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICB9XG4gICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgdGhpcy5zaWduYWwgPSBpbnB1dC5zaWduYWxcbiAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgfVxuXG4gIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJ1xuICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIH1cbiAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICB0aGlzLnNpZ25hbCA9IG9wdGlvbnMuc2lnbmFsIHx8IHRoaXMuc2lnbmFsXG4gIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgfVxuICB0aGlzLl9pbml0Qm9keShib2R5KVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywge2JvZHk6IHRoaXMuX2JvZHlJbml0fSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICBib2R5XG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnJicpXG4gICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gIHJldHVybiBmb3JtXG59XG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMwI3NlY3Rpb24tMy4yXG4gIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGhlYWRlcnNcbn1cblxuQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxufVxuXG5Cb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgdXJsOiB0aGlzLnVybFxuICB9KVxufVxuXG5SZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cblJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxufVxuXG5leHBvcnQgdmFyIERPTUV4Y2VwdGlvbiA9IHNlbGYuRE9NRXhjZXB0aW9uXG50cnkge1xuICBuZXcgRE9NRXhjZXB0aW9uKClcbn0gY2F0Y2ggKGVycikge1xuICBET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB2YXIgZXJyb3IgPSBFcnJvcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFja1xuICB9XG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERPTUV4Y2VwdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwgJiYgcmVxdWVzdC5zaWduYWwuYWJvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICB9XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICB9XG5cbiAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgfSlcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCkge1xuICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBET05FIChzdWNjZXNzIG9yIGZhaWx1cmUpXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICB9KVxufVxuXG5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcblxuaWYgKCFzZWxmLmZldGNoKSB7XG4gIHNlbGYuZmV0Y2ggPSBmZXRjaFxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG59XG4iLCJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xyXG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcclxuICAgIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByb3V0ZTogYWN0aW9uLnJvdXRlLGZlYXR1cmVSb3V0ZTogYWN0aW9uLmZlYXR1cmVSb3V0ZSB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVJlZHVjZXIsdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcclxuICAgIFNFTkRJTkdfSEFOR09VVF9TVEFSVEVEOidTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBTRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRDonU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQnLFxyXG4gICAgTUVTU0FHRV9URVhUX0NIQU5HRUQ6J01FU1NBR0VfVEVYVF9DSEFOR0VEJyxcclxuXHJcbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXHJcbiAgICBMT0FERURfTUVTU0FHRVM6ICdMT0FERURfTUVTU0FHRVMnLFxyXG4gXHJcbiAgICBTRUFSQ0hfSU5QVVRfQ0hBTkdFOiAnU0VBUkNIX0lOUFVUX0NIQU5HRScsXHJcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXHJcbiAgICBDTEVBUkVEX0hBTkdPVVQ6J0NMRUFSRURfSEFOR09VVCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcclxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxyXG4gICAgRVJST1JfUkVDSUVWRUQ6J0VSUk9SX1JFQ0lFVkVEJyxcclxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxyXG5cclxuICAgIFNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEOidTRVJWRVJfTUVTU0FHRV9SRUNJRVZFRCcsXHJcblxyXG4gICAgXHJcbiAgICBNRVNTQUdFU19VUERBVEVEOidNRVNTQUdFU19VUERBVEVEJyxcclxuICAgIEhBTkdPVVRTX1VQREFURUQ6J0hBTkdPVVRTX1VQREFURUQnLFxyXG4gICAgSEFOR09VVF9VUERBVEVEOidIQU5HT1VUX1VQREFURUQnLFxyXG4gICAgVU5SRUFEX0hBTkdPVVRTX1VQREFURUQ6J1VOUkVBRF9IQU5HT1VUU19VUERBVEVEJyxcclxuICAgIC8vU09DS0VUXHJcblxyXG4gICAgQ09OTkVDVElORzonQ09OTkVDVElORycsXHJcbiAgICBPUEVOOidPUEVOJyxcclxuICAgIENMT1NJTkc6J0NMT1NJTkcnLFxyXG4gICAgQ0xPU0VEOidDTE9TRUQnLFxyXG4gICAgU09DS0VUX1JFQURZOidTT0NLRVRfUkVBRFknLFxyXG4gICAgU09DS0VUX0VSUk9SOidTT0NLRVRfRVJST1InXHJcblxyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBoYW5nb3V0czogbnVsbCxcclxuICBoYW5nb3V0OiBudWxsLFxyXG4gIHVucmVhZGhhbmdvdXRzOiBudWxsLFxyXG4gIG1lc3NhZ2VzOiBudWxsLFxyXG4gIHNlYXJjaDogJycsXHJcbiAgdXNlcjogW10sXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgbWVzc2FnZVRleHQ6ICcnLFxyXG4gIG9ubGluZTogZmFsc2UsXHJcbiAgc29ja2V0OiBudWxsLFxyXG4gIHJlYWR5U3RhdGU6IDAsXHJcbiAgc29ja2V0TWVzc2FnZTogbnVsbCxcclxuICBmZXRjaEhhbmdvdXRzOiBmYWxzZSxcclxuICBwZW5kaW5nSGFuZ291dDpudWxsLFxyXG4gIG1lc3NhZ2U6IG51bGxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRVJST1JfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybnsuLi5zdGF0ZSxlcnJvcjphY3Rpb24uZXJyb3J9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLHBlbmRpbmdIYW5nb3V0Om51bGx9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBwZW5kaW5nSGFuZ291dDphY3Rpb24ucGVuZGluZ0hhbmdvdXR9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMRUFSRURfSEFOR09VVDpcclxuICAgICBcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXQ6IG51bGwgfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRDpcclxuXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB1bnJlYWRoYW5nb3V0czogYWN0aW9uLnVucmVhZGhhbmdvdXRzIH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9VUERBVEVEOlxyXG5cclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQ6XHJcbiAgICAgXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogYWN0aW9uLm1lc3NhZ2VzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEOlxyXG4gIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VUZXh0OiBhY3Rpb24udGV4dCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciwgZmV0Y2hIYW5nb3V0czogZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSwgZmV0Y2hIYW5nb3V0czogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cywgZmV0Y2hIYW5nb3V0czogZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5maWx0ZXIoKGcpID0+XHJcbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcclxuICAgICAgICApLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hfSU5QVVRfQ0hBTkdFOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XHJcbiAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcclxuICAgICAgfTtcclxuICAgIC8vU09DS0VUXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ09OTkVDVElORzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuT1BFTjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDEgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0lORzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDIgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfUkVBRFk6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzb2NrZXQ6IGFjdGlvbi5zb2NrZXQgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiXHJcbiAgZXhwb3J0IGNvbnN0IGhhbmdvdXRTdGF0ZXMgPSB7XHJcbiAgICBJTlZJVEVSOiAnSU5WSVRFUicsXHJcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcclxuICAgIERFQ0xJTkVSOiAnREVDTElORVInLFxyXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxyXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcclxuICAgIE1FU1NBTkdFUjogJ01FU1NBTkdFUicsXHJcbiAgIC8vIGFja25vd2xlZ2VtZW50XHJcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXHJcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcclxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxyXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxyXG4gICAgVU5CTE9DS0VEOiAnVU5CTE9DS0VEJyxcclxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnLFxyXG4gIH07IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgbmFtZSwgZGlzcGF0Y2gsIGhhbmdvdXQsIG9mZmxpbmUsIG9uQXBwUm91dGUgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHRpbWVzdGFtcCB9ID0gaGFuZ291dDtcclxuXHJcbiAgY29uc3QgZGVsaXZlcmVkSGFuZ291dCA9IHsgLi4uaGFuZ291dCwgZGVsaXZlcmVkOiB0cnVlIH07XHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGRlbGl2ZXJlZEhhbmdvdXQpO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRCwgaGFuZ291dDogZGVsaXZlcmVkSGFuZ291dCB9KTtcclxuICBpZiAobWVzc2FnZSkge1xyXG5cclxuICAgIHVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgbmFtZSwgZGVsaXZlcmVkSGFuZ291dCxoYW5nb3V0IH0pO1xyXG4gIH1cclxuICBpZihoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnKXtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgdXBkYXRlQm9ja2VkU3RhdGUoe2Rpc3BhdGNoLG5hbWUsZGVsaXZlcmVkSGFuZ291dH0pXHJcbiAgfVxyXG4gIGlmIChvZmZsaW5lKSB7XHJcbiAgICAvL3JlbW92ZSBvZmZsaW5lIGhhbmdvdXRcclxuICAgIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBjb25zdCBvZmZsaW5laGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG9mZmxpbmVIYW5nb3V0S2V5KSk7XHJcblxyXG4gICAgaWYgKG9mZmxpbmVoYW5nb3V0cykge1xyXG4gICAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBvZmZsaW5laGFuZ291dHMuZmluZEluZGV4KFxyXG4gICAgICAgIChvKSA9PiBvLnRpbWVzdGFtcCA9PT0gdGltZXN0YW1wXHJcbiAgICAgICk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIG9mZmxpbmVIYW5nb3V0S2V5LFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxKSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgbmFtZSwgZGVsaXZlcmVkSGFuZ291dCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gZGVsaXZlcmVkSGFuZ291dDtcclxuXHJcbiAgY29uc3QgZGVsaXZlcmVkTWVzc2FnZSA9IHsgLi4ubWVzc2FnZSwgdXNlcm5hbWU6IG5hbWUsIGRlbGl2ZXJlZDogdHJ1ZSB9XHJcblxyXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gbWVzc2FnZXMuZmluZEluZGV4KFxyXG4gICAgKG0pID0+IG0udGltZXN0YW1wID09PSBtZXNzYWdlLnRpbWVzdGFtcFxyXG4gICk7XHJcbiAgbWVzc2FnZXMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkTWVzc2FnZSk7XHJcbiAgXHJcblxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXMgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsZGVsaXZlcmVkSGFuZ291dCxuYW1lfSl7XHJcbiAgZGVidWdnZXI7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gZGVsaXZlcmVkSGFuZ291dDtcclxuICBjb25zdCBibG9ja2VkTWVzc2FnZSA9IHsgdGltZXN0YW1wOmRlbGl2ZXJlZEhhbmdvdXQudGltZXN0YW1wLCB0ZXh0OiAneW91IGJsb2NrZWQgdGhpcyB1c2VyJywgdXNlcm5hbWU6IG5hbWUsIHR5cGU6ICdibG9ja2VkJyB9XHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIFxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KCBbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6Wy4uLm1lc3NhZ2VzLGJsb2NrZWRNZXNzYWdlXSB9KTtcclxufSIsImltcG9ydCB7IHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQgfSBmcm9tICcuL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGV9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlVW5ibG92a2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQge2hhbmdvdXRTdGF0ZXN9ICBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcydcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWNpZXZlZEhhbmdvdXQoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZCxcclxufSkge1xyXG5cclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG5cclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG5cclxuIFxyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChoZz0+IGhnLnVzZXJuYW1lPT09dXNlcm5hbWUpXHJcbiAgICBpZihoYW5nb3V0RXhpc3Qpe1xyXG4gICAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcclxuICAgICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHN5bmMgbWVzc2FnZSB3aXRoIHJlZHVjZXIgc3RhdGVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7XHJcbiAgICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICAgIH0vL2VuZCBvZiBoYW5nb3V0IGV4aXN0XHJcbmVsc2V7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gWy4uLmhhbmdvdXRzLFxyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxufVxyXG5cclxufWVsc2V7XHJcblxyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcblxyXG59XHJcblxyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCxcclxuICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICB9KTtcclxuICAgIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xyXG4gICAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtZXNzYWdlKSB7XHJcbiAgICBzYXZlUmVjaWV2ZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0IH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHVucmVhZCkge1xyXG5cclxuICAgIHN3aXRjaChoYW5nb3V0LnN0YXRlKXtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcclxuICAgICAgICBzYXZlVW5yZWFkSGFuZ291dCh7IG5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWNpZXZlZE1lc3NhZ2Uoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxufSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IG51bGw7XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogdHJ1ZSB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogZmFsc2UgfV07XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IHRydWUgfV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogZmFsc2UgfV07XHJcbiAgICB9XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG5cclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlVW5yZWFkSGFuZ291dCh7IG5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG4gIFxyXG4gIC8vdXBkYXRlIHVucmVhZCBoYW5nb3V0c1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gIGxldCB1cGRhdGVkdW5yZWFkcyA9IG51bGw7XHJcbiAgaWYgKHVucmVhZGhhbmdvdXRzKSB7XHJcbiAgICB1cGRhdGVkdW5yZWFkcyA9IFsuLi51bnJlYWRoYW5nb3V0cywgey4uLmhhbmdvdXQscmVhZDpmYWxzZX1dO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB1cGRhdGVkdW5yZWFkcyA9IFt7Li4uaGFuZ291dCxyZWFkOmZhbHNlfV07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkdW5yZWFkcykpO1xyXG5cclxuICBkaXNwYXRjaCh7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgIHVucmVhZGhhbmdvdXRzOiB1cGRhdGVkdW5yZWFkcyxcclxuICB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBzYXZlUmVjaWV2ZWRIYW5nb3V0IH0gZnJvbSAnLi9zYXZlUmVjaWV2ZWRIYW5nb3V0JztcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVJbnZpdGVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG5cclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY2NlcHRlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQmxvY2tlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuICBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURlY2xpbmVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSkge1xyXG5cclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufSAvLyBFTkQgc2F2ZU1lc3NhbmdlclxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb2NrZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiAgXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IGhhbmdvdXRTdGF0ZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcyc7XHJcbmltcG9ydCB7XHJcbiAgc2F2ZUludml0ZWQsXHJcbiAgc2F2ZVVuYmxvdmtlZCxcclxuICBzYXZlRGVjbGluZWQsXHJcbiAgc2F2ZUJsb2NrZWQsXHJcbiAgc2F2ZUFjY2VwdGVkLFxyXG4gIHNhdmVNZXNzYWdlZCxcclxufSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zJztcclxuaW1wb3J0IHtcclxuICBzYXZlQWNjZXB0ZXIsXHJcbiAgc2F2ZUJsb2NrZXIsXHJcbiAgc2F2ZURlY2xpbmVyLFxyXG4gIHNhdmVJbnZpdGVyLFxyXG4gIHNhdmVNZXNzYW5nZXIsXHJcbiAgc2F2ZVVuYmxvY2tlcixcclxufSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVzc2FnZSh7XHJcbiAgbWVzc2FnZSxcclxuICB1c2VybmFtZSxcclxuICBkaXNwYXRjaCxcclxuICBmb2N1c2VkSGFuZ291dCxcclxufSkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0LG9mZmxpbmUgfSkge1xyXG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVEOlxyXG4gICAgIFxyXG4gICAgICAgIHNhdmVJbnZpdGVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRUQ6XHJcbiAgICAgICAgc2F2ZVVuYmxvdmtlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORUQ6XHJcbiAgICAgICAgc2F2ZURlY2xpbmVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VEOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVCbG9ja2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFRDpcclxuICAgICAgICBzYXZlQWNjZXB0ZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQUdFRDpcclxuICAgICAgIFxyXG4gICAgICAgIHNhdmVNZXNzYWdlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsIHVucmVhZCB9KSB7XHJcbiAgICBcclxuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XHJcbiAgICAgICAgc2F2ZUFjY2VwdGVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRVI6XHJcbiAgICAgICBcclxuICAgICAgICBzYXZlQmxvY2tlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORVI6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZURlY2xpbmVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVSOlxyXG4gICAgICAgIHNhdmVJbnZpdGVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XHJcbiAgICAgICAgc2F2ZU1lc3Nhbmdlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VSOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVVbmJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRzKHsgaGFuZ291dHMgfSkge1xyXG4gICAgaGFuZ291dHMuZm9yRWFjaCgoaGFuZ291dCkgPT4ge1xyXG4gICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCx1bnJlYWQ6dHJ1ZSB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChtZXNzYWdlICYmIHVzZXJuYW1lKSB7XHJcbiBcclxuICAgICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdBQ0tIT1dMRURHRU1FTlQnOlxyXG5cclxuICAgICAgICAgIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCxvZmZsaW5lOmZhbHNlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnSEFOR09VVCc6XHJcblxyXG4gICAgICAgICAgaWYoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09bWVzc2FnZS5oYW5nb3V0LnVzZXJuYW1lKXtcclxuICAgXHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsdW5yZWFkOmZhbHNlIH0pO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICBcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCx1bnJlYWQ6dHJ1ZSB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdVTlJFQURfSEFOR09VVFMnOlxyXG4gICBcclxuICAgICAgICAgIGhhbmRsZUhhbmdvdXRzKHsgaGFuZ291dHM6IG1lc3NhZ2UuaGFuZ291dHMgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdPRkZMSU5FX0FDS04nOlxyXG4gICAgICAgXHJcbiAgICAgICAgICBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsb2ZmbGluZTp0cnVlIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW21lc3NhZ2UsIHVzZXJuYW1lXSk7XHJcblxyXG4gIHJldHVybiB7fTtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG4vL3JldHJpZXZlcyBoYW5nb3V0cyBmcm9tIGxvY2FsU3RvcmFnZVxyXG5leHBvcnQgZnVuY3Rpb24gbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcclxuXHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xyXG59XHJcbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SGFuZ291dCh7ZGlzcGF0Y2h9KXtcclxuICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DTEVBUkVEX0hBTkdPVVR9KVxyXG59IFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVucmVhZCh7ZGlzcGF0Y2gsaGFuZ291dH0pe1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcclxufVxyXG5cclxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4vLyAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xyXG4vLyB9XHJcbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XHJcbn1cclxuXHJcbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcclxuICAgICk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcclxuICBcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tJHtoYW5nb3V0LnVzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy9FTkQgc2F2ZUludml0ZXJcclxuXHJcblxyXG5cclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxVRV9DSEFOR0VEOiAnVkFMVUVfQ0hBTkdFRCcsXHJcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxyXG4gIExPR0lOX1NVQ0NFU1M6ICdMT0dJTl9TVUNDRVNTJyxcclxuICBMT0dJTl9GQUlMRUQ6ICdMT0dJTl9GQUlMRUQnLFxyXG5cclxuICBMT0dPVVRfU1RBUlRFRDogJ0xPR09VVF9TVEFSVEVEJyxcclxuICBMT0dPVVRfRkFJTEVEOiAnTE9HT1VUX0ZBSUxFRCcsXHJcbiAgTE9HT1VUX1NVQ0NFU1M6ICdMT0dPVVRfU1VDQ0VTUycsXHJcblxyXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxyXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxyXG4gIFNJR05VUF9GQUlMRUQ6ICdTSUdOVVBfRkFJTEVEJyxcclxuXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6ICdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxyXG5cclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXHJcbiAgR09UX1RPS0VOX0ZST01fVVJMOiAnR09UX1RPS0VOX0ZST01fVVJMJyxcclxuXHJcbiAgUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOiAnUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFJyxcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGVtYWlsOiAnJyxcclxuICBwYXNzd29yZDogJycsXHJcbiAgc3VjY2VzczogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgdXNlcm5hbWU6ICcnLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGNvbmZpcm06ICcnLFxyXG4gIGN1cnJlbnQ6ICcnLFxyXG4gIGVtYWlsb3J1c2VybmFtZTogJycsXHJcbiAgdG9rZW46IG51bGwsXHJcbiAgaXNMb2dnZWRJbjogZmFsc2UsXHJcbiAgaXNQYXNzd29yZENoYW5nZWQ6IGZhbHNlLFxyXG4gIGF1dGhGZWVkYmFjazogbnVsbCxcclxuICB1c2VyOm51bGxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhdXRoUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VEOlxyXG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgW2FjdGlvbi5wYXlsb2FkLnByb3BOYW1lXTogYWN0aW9uLnBheWxvYWQudmFsdWUsXHJcbiAgICAgIH07XHJcbiAgXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyOmFjdGlvbi51c2VyLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZSwgJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgdXNlcjphY3Rpb24udXNlcixcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjphY3Rpb24udXNlcixcclxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgIHVzZXI6YWN0aW9uLnVzZXJcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IEF1dGhSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFthdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG5cclxuICBpZiAoYXV0aFJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xyXG4gIGNvbnN0IHsgdG8sIGlkIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldFJvdXRlKHRvKTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxhXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgey4uLnByb3BzfVxyXG4gICAgICBocmVmPXt0b31cclxuICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9XHJcbiAgICAgIHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiAnaW5oZXJpdCcgfX1cclxuICAgIC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGhSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aFJvdXRlQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXV0aFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgaW5pdGlhbFJvdXRlIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlU3RhdGUoaW5pdGlhbFJvdXRlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0sIFthdXRoUm91dGVdKTtcclxuXHJcbiAgcmV0dXJuIDxBdXRoUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XHJcbmltcG9ydCB7IEF1dGhSb3V0ZVByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLXJvdXRlLWNvbnRleHQnO1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXRlLFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XHJcbiAgICAgIDxBdXRoUm91dGVQcm92aWRlcj57Y2hpbGRyZW59PC9BdXRoUm91dGVQcm92aWRlcj5cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlQXV0aENvbnRleHQsIEF1dGhQcm92aWRlciB9O1xyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VVc2VyTmFtZSgpIHtcclxuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIFxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpIHtcclxuXHJcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLnVzZXIgJiYgc3RhdGUudXNlci50b2tlbikge1xyXG4gIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4gfSA9c3RhdGUudXNlcjtcclxuICBcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgIH1cclxuICB9LCBbc3RhdGUudXNlcl0pO1xyXG5cclxuICByZXR1cm4geyB1c2VybmFtZTogdXNlck5hbWUsIHRva2VuLCBlbWFpbCB9O1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUmVhZEhhbmdvdXRzKHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIC8vIHNldCByZWFkIHRvIHRydWUgb24gdW5yZWFkIGhhbmdvdXRzXHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcclxuICBjb25zdCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuXHJcbiAgaWYgKHVucmVhZGhhbmdvdXRzJiYgdW5yZWFkaGFuZ291dHMubGVuZ3RoPjApIHtcclxuICAgIFxyXG4gICAgbGV0IHVwZGF0ZWR1bnJlYWQgPSB1bnJlYWRoYW5nb3V0cy5tYXAodSA9PiB7XHJcbiAgICAgIGlmICh1LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7IC4uLnUsIHJlYWQ6IHRydWUgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWR1bnJlYWQpKTtcclxuZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsdW5yZWFkaGFuZ291dHM6dXBkYXRlZHVucmVhZH0pXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8vIHNldCBoYW5nb3V0IHRvIHJlYWRcclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgeyAuLi5oYW5nb3V0LCByZWFkOiB0cnVlIH0pO1xyXG4gIC8vXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG5cclxuICBpZiAobWVzc2FnZSkge1xyXG4gICAgIHVwZGF0ZVJlYWRNZXNzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWFkTWVzc3NhZ2VzKHsgaGFuZ291dCwgbmFtZSwgZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGNvbnN0IHVwZGF0ZWRNZXNzYWdlcyA9IG1lc3NhZ2VzLm1hcCgobSkgPT4ge1xyXG4gICAgcmV0dXJuIHsgLi4ubSwgcmVhZDogdHJ1ZSB9O1xyXG4gIH0pO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHtcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZU1lbW8sXHJcbiAgdXNlUmVkdWNlcixcclxuICB1c2VFZmZlY3QsXHJcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcclxuaW1wb3J0IHt1c2VNZXNzYWdlfSBmcm9tICcuL3VzZU1lc3NhZ2UnXHJcblxyXG5pbXBvcnQge1xyXG4gIGxvYWRIYW5nb3V0cyxcclxuICBsb2FkTWVzc2FnZXMsIFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7dXNlVXNlck5hbWV9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnXHJcbmltcG9ydCB7IHVwZGF0ZVJlYWRIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy91cGRhdGVSZWFkSGFuZ291dHMnO1xyXG5cclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xyXG4gY29uc3Qge3VzZXJuYW1lLHRva2VufT11c2VVc2VyTmFtZSgpXHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHsgaGFuZ291dCxtZXNzYWdlIH0gPSBzdGF0ZTtcclxuICBjb25zdCBoYW5kbGVNZXNzYWdlID11c2VNZXNzYWdlKHttZXNzYWdlLHVzZXJuYW1lLGRpc3BhdGNoLGZvY3VzZWRIYW5nb3V0OmhhbmdvdXR9KVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodXNlcm5hbWUpIHtcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFt1c2VybmFtZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodXNlcm5hbWUgJiYgdG9rZW4pIHtcclxuICAgICBcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGhhbmdvdXQgJiYgdXNlcm5hbWUpIHtcclxuICBcclxuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgbG9hZE1lc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xyXG5cclxuICAgICAgLy9zYXZlIGhhbmdvdXQgdG8gbG9jYWxTdG9yYWdlXHJcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgaWYgKCFoYW5nb3V0cykge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChcclxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoaGFuZ291dEV4aXN0KSB7XHJcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghaGFuZ291dC5yZWFkKSB7XHJcbiAgICAgXHJcbiAgICAgXHJcbiAgICAgICAgdXBkYXRlUmVhZEhhbmdvdXRzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWU6IHVzZXJuYW1lIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW2hhbmdvdXQsIHVzZXJuYW1lXSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUGVuZGluZ0hhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb25saW5lLGlzQmxvY2tlciB9KSB7XHJcblxyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcbiAgbGV0IGhhbmdvdXRLZXkgPSAnJztcclxuICBsZXQgbWVzc2FnZUtleSA9ICcnO1xyXG4gIGlmIChvbmxpbmUpIHtcclxuICAgIFxyXG4gICAgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICAgIG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgaGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xyXG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW9mZmxpbmUtbWVzc2FnZXNgO1xyXG4gIH1cclxuXHJcbiAgc2F2ZUhhbmdvdXQoeyBoYW5nb3V0S2V5LCB1c2VybmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KTtcclxuICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnRleHQgIT09XCJcIikge1xyXG4gICAgc2F2ZU1lc3NhZ2UoeyBtZXNzYWdlS2V5LCB1c2VybmFtZSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgXHJcbiAgICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBoYW5nb3V0KTtcclxuICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW2hhbmdvdXRdO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcbiAgfVxyXG4gXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIG1lc3NhZ2UsZGlzcGF0Y2gsaXNCbG9ja2VyIH0pIHtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBbXTtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuIFxyXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCBtZXNzYWdlXTtcclxuICB9IGVsc2Uge1xyXG5cclxuICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFttZXNzYWdlXTtcclxuICB9XHJcbiAgaWYoaXNCbG9ja2VyKXtcclxuIFxyXG4gICAgY29uc3QgYmxvY2tlciA9Wy4uLnVwZGF0ZWRNZXNzYWdlcyx7dGV4dDonWW91IGNhbiBub3Qgc2VuZCB0aGlzIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIGJsb2NrZWQuJ1xyXG4gICAgLHRpbWVzdGFtcDogRGF0ZS5ub3coKSx0eXBlOidibG9ja2VyJyx1c2VybmFtZTptZXNzYWdlLnVzZXJuYW1lLGZsb2F0OidyaWdodCd9XVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkoYmxvY2tlcikpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogYmxvY2tlciB9KTtcclxuICBcclxuICB9XHJcbiAgZWxzZXtcclxuICBcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG4gIH1cclxuIFxyXG5cclxufVxyXG4iLCJcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBzb2NrZXQsIG5hbWUgfSkge1xyXG4gIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xyXG4gIGlmIChvZmZsaW5lSGFuZ291dHMpIHtcclxuICAgIG9mZmxpbmVIYW5nb3V0cy5mb3JlRWFjaCgoaCkgPT4ge1xyXG4gICAgICBzb2NrZXQuc2VuZChcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB1c2VybmFtZTogaC51c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsOiBoLmVtYWlsLFxyXG4gICAgICAgICAgbWVzc2FnZTogaC5tZXNzYWdlLFxyXG4gICAgICAgICAgdGltZXN0YW1wOiBoLnRpbWVzdGFtcCxcclxuICAgICAgICAgIGNvbW1hbmQ6IGguc3RhdGUsXHJcbiAgICAgICAgICBvZmZsaW5lOiB0cnVlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQoe25hbWUsIGhhbmdvdXQsZGlzcGF0Y2h9KXtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XHJcbiAgICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gICAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gICBcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgIGNvbnN0IGZpbHRlcmVkSGFuZ291dHMgPSB1bnJlYWRoYW5nb3V0cy5maWx0ZXIoZnVuY3Rpb24odW5yZWFkKSAge1xyXG4gICAgICAgICAgICByZXR1cm4gIHVucmVhZC51c2VybmFtZSAhPT0gdXNlcm5hbWV9KTtcclxuICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGZpbHRlcmVkSGFuZ291dHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeShmaWx0ZXJlZEhhbmdvdXRzKSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0czogZmlsdGVyZWRIYW5nb3V0cyxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh1bnJlYWRoYW5nb3V0c0tleSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgIFxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBzYXZlUGVuZGluZ0hhbmdvdXQgfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dCc7XHJcbmltcG9ydCB7XHJcblxyXG4gIHNlbGVjdFVucmVhZCxcclxuICBcclxuICBmZXRjaEhhbmdvdXQsXHJcbiAgY2hhbmdlTWVzc2FnZVRleHQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgc2VuZE9mZmxpbmVIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2VuZE9mZmxpbmVIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVtb3ZlSGFuZ291dEZyb21VbnJlYWR9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9yZW1vdmVIYW5nb3V0RnJvbVVucmVhZCdcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgIHVzZXJuYW1lICA9IGF1dGhDb250ZXh0LnN0YXRlLnVzZXIgJiZhdXRoQ29udGV4dC5zdGF0ZS51c2VyLnVzZXJuYW1lO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuICBjb25zdCB7XHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICByZWFkeVN0YXRlLFxyXG4gIFxyXG4gICAgdW5yZWFkaGFuZ291dHMsXHJcbiAgfSA9IHN0YXRlO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCByZWFkeVN0YXRlID09PSAxICYmIHVzZXJuYW1lKSB7XHJcbiAgICAgIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBuYW1lOiB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3JlYWR5U3RhdGUsIHVzZXJuYW1lXSk7XHJcblxyXG4gIGZ1bmN0aW9uIG9uUmVtb3ZlVW5yZWFkKGUpe1xyXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGlkKTtcclxuICAgXHJcbiAgICByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZTp1c2VybmFtZSxkaXNwYXRjaCxoYW5nb3V0fSlcclxuICB9XHJcbiAgZnVuY3Rpb24gb25OYXZpZ2F0aW9uKGUpe1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAvLyBjb25zdCBpZCA9ZS50YXJnZXQuaWRcclxuICAgIGNvbnN0IGlkID1lLmN1cnJlbnRUYXJnZXQuaWRcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBvblNlbGVjdEhhbmdvdXQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSlcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIFxyXG4gXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSk7XHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblNlYXJjaElucHV0KGUpIHtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0UsIHNlYXJjaDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbkZldGNoSGFuZ291dHMoKXtcclxuXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUR9KVxyXG4gIH1cclxuXHJcbiBcclxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcclxuICAgIGNvbnN0IHRleHQgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uSGFuZ291dChlKSB7XHJcbiAgICBcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dDogJycsIGRpc3BhdGNoIH0pO1xyXG4gICAgY29uc3QgY29tbWFuZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gaGFuZ291dDtcclxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCBtZXNzYWdlID1cclxuICAgICAgbWVzc2FnZVRleHQgIT09ICcnID8geyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wIH0gOiBudWxsO1xyXG5cclxuICAgIGxldCBvbmxpbmUgPSB0cnVlO1xyXG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcclxuICAgIFxyXG4gIC8vICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICAgICBcclxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xyXG4gICAgICAgXHJcbiAgICAgICAgaXNCbG9ja2VyPXRydWVcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBwZW5kaW5nSGFuZ291dD0ge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgY29tbWFuZCxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgIH1cclxuICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsIHBlbmRpbmdIYW5nb3V0fSlcclxuICAgIC8vIH0gZWxzZSB7XHJcbiAgICAvLyAgIG9ubGluZSA9IGZhbHNlO1xyXG4gICAgLy8gfVxyXG4gICBcclxuIFxyXG4gICAgc2F2ZVBlbmRpbmdIYW5nb3V0KHtcclxuICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgIG5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICBoYW5nb3V0OiB7XHJcbiAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgc3RhdGU6IGNvbW1hbmQsXHJcbiAgICAgICAgbWVzc2FnZTogeyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wLCBkZWxpdmVyZWQ6IGZhbHNlLCB1c2VybmFtZSB9LFxyXG4gICAgICAgIHRpbWVzdGFtcCxcclxuICAgICAgICBkZWxpdmVyZWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgICBvbmxpbmUsXHJcbiAgICAgIGlzQmxvY2tlclxyXG4gICAgfSk7XHJcbiAgfS8vZW5kIG9uSGFuZ291dFxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIG9uTmF2aWdhdGlvbixcclxuICAgIG9uU2VsZWN0VW5yZWFkLFxyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgb25TZWFyY2hJbnB1dCxcclxuICAgIG9uRmV0Y2hIYW5nb3V0cyxcclxuICAgIHNlYXJjaCxcclxuICAgIG9uU2VsZWN0SGFuZ291dCxcclxuICAgIGRpc3BhdGNoLFxyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgdXNlcnMsXHJcbiAgICB1c2VybmFtZSxcclxuICAgIG1lc3NhZ2VzLFxyXG4gICAgb25IYW5nb3V0LFxyXG4gICAgdW5yZWFkaGFuZ291dHMsXHJcbiAgICByZWFkeVN0YXRlLFxyXG4gICAgb25SZW1vdmVVbnJlYWRcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vYWN0aW9uVHlwZXMnXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICAvLyBzZWFyY2ggSGFuZ291dFxyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBQYXJzZS5Vc2VyLmN1cnJlbnQoKTtcclxuICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkhhbmdvdXRcIik7XHJcbiAgICAgICAgcXVlcnkuZXF1YWxUbygndXNlcmlkJyx1c2VyLmlkKVxyXG4gICAgICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJuYW1lJyxzZWFyY2gpXHJcbiAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IGF3YWl0IHF1ZXJ5LmZpbmQoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihzZWFyY2hSZXN1bHQubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICBsZXQgbWFwcGVkSGFub3V0cyA9IHNlYXJjaFJlc3VsdC5tYXAocz0+e3JldHVybiB7dXNlcm5hbWU6cy5hdHRyaWJ1dGVzLnVzZXJuYW1lLCBlbWFpbDpzLmF0dHJpYnV0ZXMuZW1haWwsc3RhdGU6cy5hdHRyaWJ1dGVzLnN0YXRlfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0czptYXBwZWRIYW5vdXRzIH0pXHJcbiAgICAgICAgfSAgXHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgLy8gc2VhcmNoIEhhbmdvdXRVc2VyXHJcbiAgICAgICAgICAgIGNvbnN0IEhhbmdvdXRVc2VyID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkhhbmdvdXRVc2VyXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShIYW5nb3V0VXNlcik7XHJcbiAgICAgICAgICAgIHF1ZXJ5LmVxdWFsVG8oJ3VzZXJuYW1lJyxzZWFyY2gpXHJcbiAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHQgPSBhd2FpdCBxdWVyeS5maW5kKCk7XHJcbiAgICAgICAgICAgIGxldCBtYXBwZWRIYW5vdXRzID0gc2VhcmNoUmVzdWx0Lm1hcChzPT57cmV0dXJuIHt1c2VybmFtZTpzLmF0dHJpYnV0ZXMudXNlcm5hbWUsIGVtYWlsOnMuYXR0cmlidXRlcy5lbWFpbCxzdGF0ZTonSU5WSVRFJ319KVxyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHM6bWFwcGVkSGFub3V0cyB9KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkVSUk9SX1JFQ0lFVkVELGVycm9yfSlcclxuICAgIH1cclxuXHJcbn0iLCJcclxuLy9pcyBzZW50IGJ5IGNsaWVudFxyXG5leHBvcnQgY29uc3QgY2xpZW50Q29tbWFuZHMgPSB7XHJcbiAgSU5WSVRFOiAnSU5WSVRFJyxcclxuICBBQ0NFUFQ6ICdBQ0NFUFQnLFxyXG4gIERFQ0xJTkU6ICdERUNMSU5FJyxcclxuICBCTE9DSzogJ0JMT0NLJyxcclxuICBVTkJMT0NLOiAnVU5CTE9DSycsXHJcbiAgTUVTU0FHRTogJ01FU1NBR0UnLFxyXG4gIE9OTElORTonT05MSU5FJ1xyXG59O1xyXG5cclxuIiwiaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4vaGFuZ291dFN0YXRlcydcclxuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvY2xpZW50Q29tbWFuZHMnXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGF0ZU1hcHBlcih7IGNvbW1hbmQgfSkge1xyXG4gICAgc3dpdGNoIChjb21tYW5kKSB7XHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5BQ0NFUFQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kZXJTdGF0ZTogaGFuZ291dFN0YXRlcy5BQ0NFUFRFRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIGNsaWVudENvbW1hbmRzLkJMT0NLOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLkJMT0NLRVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuREVDTElORTpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuREVDTElORVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuSU5WSVRFOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuSU5WSVRFRCxcclxuICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlOiBoYW5nb3V0U3RhdGVzLklOVklURVJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgY2xpZW50Q29tbWFuZHMuTUVTU0FHRTpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmRlclN0YXRlOiBoYW5nb3V0U3RhdGVzLk1FU1NBR0VELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSXHJcbiAgICAgICAgICAgIH1cclxuICAgXHJcbiAgICAgICAgY2FzZSBjbGllbnRDb21tYW5kcy5VTkJMT0NLOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyU3RhdGU6IGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VELFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGU6IGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VSXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbGllbnRDb21tYW5kIHR5cGUgbm90IHNwZWNpZmllZCcpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi4vdXNlSGFuZ291dHMnXHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJ1xyXG5pbXBvcnQgeyBzdGF0ZU1hcHBlciB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9zdGF0ZU1hcHBlcidcclxuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuLi8uLi8uLi9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcydcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi8uLi9hdXRoL2F1dGgtY29udGV4dCdcclxuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGZ1bmN0aW9uIFBhcnNlU2VydmVyKHByb3BzKSB7XHJcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wc1xyXG4gICAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUhhbmdvdXRzKClcclxuICAgIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKVxyXG4gICAgY29uc3QgeyB1c2VyIH0gPSBhdXRoQ29udGV4dC5zdGF0ZVxyXG4gICAgY29uc3QgeyBmZXRjaEhhbmdvdXRzLCBzZWFyY2gsIHBlbmRpbmdIYW5nb3V0IH0gPSBzdGF0ZVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGZldGNoSGFuZ291dHMpIHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGFjdGlvbnMuZmV0Y2hIYW5nb3V0cyh7IGRpc3BhdGNoLCBzZWFyY2ggfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgW2ZldGNoSGFuZ291dHNdKVxyXG5cclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGlmIChwZW5kaW5nSGFuZ291dCkge1xyXG5cclxuICAgICAgICAgICAgc2VuZEhhbmdvdXQoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCBbcGVuZGluZ0hhbmdvdXRdKVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICAgIHN1YnNGaXJzdCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIFt1c2VyXSlcclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0ICh7aGFuZ291dH0pe1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlICdJTlZJVEVEJzpcclxuICAgICAgICAgICAgY2FzZSAnQUNDRVBURUQnOlxyXG4gICAgICAgICAgICBjYXNlICdCTE9DS0VEJzpcclxuICAgICAgICAgICAgY2FzZSAnTUVTU0FHRUQnOlxyXG4gICAgICAgICAgICBjYXNlICdERUNMSU5FRCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ1VOQkxPQ0tFRCc6XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQsIG1lc3NhZ2U6IHsgaGFuZ291dCwgdHlwZTogJ0FDS0hPV0xFREdFTUVOVCcgfSB9KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ0lOVklURVInOlxyXG4gICAgICAgICAgICBjYXNlICdBQ0NFUFRFUic6XHJcbiAgICAgICAgICAgIGNhc2UgJ0JMT0NLRVInOlxyXG4gICAgICAgICAgICBjYXNlICdNRVNTQU5HRVInOlxyXG4gICAgICAgICAgICBjYXNlICdVTkJMT0NLRVInOlxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfTUVTU0FHRV9SRUNJRVZFRCwgbWVzc2FnZTogeyBoYW5nb3V0LCB0eXBlOiAnSEFOR09VVCcgfSB9KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gc3Vic0ZpcnN0KCl7XHJcbiAgICBsZXQgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJIYW5nb3V0XCIpO1xyXG4gICAgdmFyIGN1cnJlbnRVc2VyID0gUGFyc2UuVXNlci5jdXJyZW50KCk7XHJcbiAgICBxdWVyeS5lcXVhbFRvKCd1c2VyaWQnLCBjdXJyZW50VXNlci5pZClcclxuICAgIGxldCBzdWJzY3JpcHRpb24gPSBhd2FpdCBxdWVyeS5zdWJzY3JpYmUoKTtcclxuICAgIHN1YnNjcmlwdGlvbi5vbignY3JlYXRlJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmdvdXQgPSBvYmplY3QuYXR0cmlidXRlc1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGhhbmRsZUhhbmdvdXQoe2hhbmdvdXR9KVxyXG4gICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZygnb2JqZWN0IGNyZWF0ZWQnKTtcclxuICAgIH0pO1xyXG4gICAgc3Vic2NyaXB0aW9uLm9uKCd1cGRhdGUnLCAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZ291dCA9IG9iamVjdC5hdHRyaWJ1dGVzXHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgaGFuZGxlSGFuZ291dCh7aGFuZ291dH0pXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmplY3QgdXBkYXRlZCcpO1xyXG4gICAgfSk7XHJcbiAgICBzdWJzY3JpcHRpb24ub24oJ2VudGVyJywgKG9iamVjdCkgPT4ge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmplY3QgZW50ZXJlZCcpO1xyXG4gICAgICB9KTtcclxuICAgICAgc3Vic2NyaXB0aW9uLm9uKCdsZWF2ZScsIChvYmplY3QpID0+IHtcclxuICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgY29uc3Qge2hhbmdvdXRzfT1vYmplY3QuYXR0cmlidXRlc1xyXG4gICAgICAgICAgY29uc3QgaGFuZ291dCA9aGFuZ291dHNbMF0uYXR0cmlidXRlc1xyXG4gICAgICAgICAgaGFuZGxlSGFuZ291dCh7aGFuZ291dH0pXHJcbiAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBjb25zb2xlLmxvZygnb2JqZWN0IGxlZnQnKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgIFxyXG4gIFxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHNlbmRIYW5nb3V0KCkge1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgY29uc3QgeyBzZW5kZXJTdGF0ZSwgdGFyZ2V0U3RhdGUgfSA9IHN0YXRlTWFwcGVyKHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IHBlbmRpbmdIYW5nb3V0LmNvbW1hbmQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgbWVzc2FnZSwgb2ZmbGluZSwgdGltZXN0YW1wIH0gPSBwZW5kaW5nSGFuZ291dDtcclxuICAgICAgICAgICAgY29uc3QgSGFuZ291dCA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0XCIpO1xyXG4gICAgICAgICAgICBjb25zdCBTZW5kZXJVc2VyID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkhhbmdvdXRVc2VyXCIpO1xyXG4gICAgICAgICAgICBsZXQgc2VuZGVyUXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoU2VuZGVyVXNlcik7XHJcbiAgICAgICAgICAgIHNlbmRlclF1ZXJ5LmVxdWFsVG8oJ3VzZXJuYW1lJywgdXNlci51c2VybmFtZSlcclxuICAgICAgICAgICAgbGV0IHNlbmRlclVzZXIgPSBhd2FpdCBzZW5kZXJRdWVyeS5maXJzdCgpXHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IFRhcmdldFVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFuZ291dFVzZXJcIik7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRRdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShUYXJnZXRVc2VyKTtcclxuICAgICAgICAgICAgdGFyZ2V0UXVlcnkuZXF1YWxUbygndXNlcm5hbWUnLCB1c2VybmFtZSlcclxuICAgICAgICAgICAgbGV0IHRhcmdldFVzZXIgPSBhd2FpdCB0YXJnZXRRdWVyeS5maXJzdCgpXHJcblxyXG4gICAgICAgICAgICBjb25zdCBzZW5kZXIgPSBuZXcgSGFuZ291dCgpXHJcbiAgICAgICAgICAgIHNlbmRlci5zZXQoJ3VzZXJuYW1lJywgdXNlcm5hbWUpXHJcbiAgICAgICAgICAgIHNlbmRlci5zZXQoJ2VtYWlsJywgZW1haWwpXHJcbiAgICAgICAgICAgIHNlbmRlci5zZXQoJ21lc3NhZ2UnLCBtZXNzYWdlKVxyXG4gICAgICAgICAgICBzZW5kZXIuc2V0KCd0aW1lc3RhbXAnLCB0aW1lc3RhbXApXHJcbiAgICAgICAgICAgIHNlbmRlci5zZXQoJ3N0YXRlJywgc2VuZGVyU3RhdGUpXHJcbiAgICAgICAgICAgIHNlbmRlci5zZXQoJ3VzZXJpZCcsIHNlbmRlclVzZXIuYXR0cmlidXRlcy51c2VyaWQpXHJcblxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBuZXcgSGFuZ291dCgpXHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoJ3VzZXJuYW1lJywgdXNlci51c2VybmFtZSlcclxuICAgICAgICAgICAgdGFyZ2V0LnNldCgnZW1haWwnLCB1c2VyLmVtYWlsKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCdtZXNzYWdlJywgbWVzc2FnZSlcclxuICAgICAgICAgICAgdGFyZ2V0LnNldCgndGltZXN0YW1wJywgdGltZXN0YW1wKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCdzdGF0ZScsIHRhcmdldFN0YXRlKVxyXG4gICAgICAgICAgICB0YXJnZXQuc2V0KCd1c2VyaWQnLCB0YXJnZXRVc2VyLmF0dHJpYnV0ZXMudXNlcmlkKVxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgaWYgKHBlbmRpbmdIYW5nb3V0LmNvbW1hbmQgPT09IGNsaWVudENvbW1hbmRzLklOVklURSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbmRlclVzZXIuYWRkVW5pcXVlKCdoYW5nb3V0cycsIHNlbmRlcilcclxuICAgICAgICAgICAgICAgIHRhcmdldFVzZXIuYWRkVW5pcXVlKCdoYW5nb3V0cycsIHRhcmdldClcclxuICAgICAgICAgICAgICAgIHNlbmRlci5zZXQoJ293bmVyJyxzZW5kZXJVc2VyKVxyXG4gICAgICAgICAgICAgLy8gICBzZW5kZXIuc2F2ZSgpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2V0KCdvd25lcicsdGFyZ2V0VXNlcilcclxuICAgICAgICAgICAgICAgLy8gdGFyZ2V0LnNhdmUoKVxyXG4gICAgICAgICAgICAgICAgc2VuZGVyVXNlci5zYXZlKClcclxuICAgICAgICAgICAgICAgIHRhcmdldFVzZXIuc2F2ZSgpXHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0UXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJIYW5nb3V0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UXVlcnkuZXF1YWxUbygndXNlcmlkJyx0YXJnZXRVc2VyLmF0dHJpYnV0ZXMudXNlcmlkKVxyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldEhhbmdvdXQgPSBhd2FpdCB0YXJnZXRRdWVyeS5maXJzdCgpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRIYW5nb3V0LnNldCgnbWVzc2FnZScsbWVzc2FnZSlcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2V0KCd0aW1lc3RhbXAnLCB0aW1lc3RhbXApXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRIYW5nb3V0LnNldCgnc3RhdGUnLCB0YXJnZXRTdGF0ZSlcclxuICAgICAgICAgICAgICAgIHRhcmdldEhhbmdvdXQuc2F2ZSgpXHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9IFBhcnNlLlVzZXIuY3VycmVudCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbmRlclF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFwiSGFuZ291dFwiKTtcclxuICAgICAgICAgICAgICAgIHNlbmRlclF1ZXJ5LmVxdWFsVG8oJ3VzZXJpZCcsY3VycmVudFVzZXIuaWQpXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VuZGVySGFuZ291dCA9IGF3YWl0IHNlbmRlclF1ZXJ5LmZpcnN0KClcclxuICAgICAgICAgICAgICAgIHNlbmRlckhhbmdvdXQuc2V0KCdtZXNzYWdlJyxtZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgc2VuZGVySGFuZ291dC5zZXQoJ3RpbWVzdGFtcCcsIHRpbWVzdGFtcClcclxuICAgICAgICAgICAgICAgIHNlbmRlckhhbmdvdXQuc2V0KCdzdGF0ZScsIHNlbmRlclN0YXRlKVxyXG4gICAgICAgICAgICAgICAgc2VuZGVySGFuZ291dC5zYXZlKClcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW5cclxufSIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXHJcblxyXG4gICAgU0VBUkNIX0lOUFVUX0NIQU5HRUQ6ICdTRUFSQ0hfSU5QVVRfQ0hBTkdFRCcsXHJcblxyXG4gICAgXHJcbiAgICBNRVNTQUdFX1JFQ0lFVkVEOiBcIk1FU1NBR0VfUkVDSUVWRURcIixcclxuICAgIFNPQ0tFVF9FUlJPUjogJ1NPQ0tFVF9FUlJPUicsXHJcbiAgICBDT05ORUNUSU5HOiAnQ09OTkVDVElORycsXHJcbiAgICBPUEVOOiAnT1BFTicsXHJcbiAgICBDTE9TSU5HOiAnQ0xPU0lORycsXHJcbiAgICBDTE9TRUQ6ICdDTE9TRUQnLFxyXG4gICAgU09DS0VUX1JFQURZOiAnU09DS0VUX1JFQURZJyxcclxufVxyXG4iLCIvL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcclxuICAgICAgKTtcclxuICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hJbnB1dCh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIX0lOUFVUX0NIQU5HRUQsIHNlYXJjaCB9KTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgdXNlRWZmZWN0LHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4uL3VzZUhhbmdvdXRzJ1xyXG5pbXBvcnQgICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vYWN0aW9uVHlwZXMnXHJcbmltcG9ydCB7dXNlVXNlck5hbWV9IGZyb20gJy4uLy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJTb2NrZXRDb250YWluZXIocHJvcHMpIHtcclxuICAgIGNvbnN0IHt1c2VybmFtZSx0b2tlbn09dXNlVXNlck5hbWUoKVxyXG4gICAgY29uc3QgW3NvY2tldCxzZXRTb2NrZXRdPXVzZVN0YXRlKClcclxuXHJcblxyXG4gICAgY29uc3QgeyBjaGlsZHJlbixzb2NrZXRVcmwgfSA9IHByb3BzXHJcbiAgICBjb25zdCB7IGRpc3BhdGNoLCBzdGF0ZSB9ID0gdXNlSGFuZ291dHMoKVxyXG4gICAgY29uc3QgeyBmZXRjaEhhbmdvdXRzLHNlYXJjaCxwZW5kaW5nSGFuZ291dCB9ID0gc3RhdGVcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAodXNlcm5hbWUpIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3Qgc29jayA9IG5ldyBXZWJTb2NrZXQoYCR7c29ja2V0VXJsfS9oYW5nb3V0cy8/dXNlcm5hbWU9JHt1c2VybmFtZX1gKTtcclxuICAgICAgICAgICAgc29jay5vbm1lc3NhZ2UgPSAoc2VydmVyTWVzc2FnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gSlNPTi5wYXJzZShzZXJ2ZXJNZXNzYWdlLmRhdGEpO1xyXG4gICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQsIG1lc3NhZ2U6IG1zZyB9KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzb2NrLm9ub3BlbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk9QRU4gfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNvY2sub25jbG9zZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNMT1NFRCB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc29jay5vbmVycm9yID0gKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX0VSUk9SLCBlcnJvciB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfUkVBRFksIHNvY2tldDogc29jayB9KTtcclxuICAgICAgICAgICAgc2V0U29ja2V0KHNvY2spO1xyXG4gICAgICAgIH1cclxuICAgIH0sIFt1c2VybmFtZV0pO1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgICAgIGlmKGZldGNoSGFuZ291dHMpe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBhY3Rpb25zLmZldGNoSGFuZ291dHMoe2Rpc3BhdGNoLHNlYXJjaCx1c2VybmFtZX0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxbZmV0Y2hIYW5nb3V0c10pXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICAgICAgaWYocGVuZGluZ0hhbmdvdXQpe1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBzZW5kSGFuZ291dCgpXHJcbiAgICAgICAgfVxyXG4gICAgfSxbcGVuZGluZ0hhbmdvdXRdKVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBzZW5kSGFuZ291dCgpe1xyXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHBlbmRpbmdIYW5nb3V0KSlcclxuICAgIFxyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW5cclxuXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyBQYXJzZVNlcnZlciB9IGZyb20gJy4vcGFyc2UvUGFyc2VTZXJ2ZXInXHJcbmltcG9ydCB7IFdlYlNvY2tldENvbnRhaW5lciB9IGZyb20gJy4vd2Vic29ja2V0L1dlYlNvY2tldENvbnRhaW5lcidcclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhhbmdvdXRBZGFwdGVyKHByb3BzKSB7XHJcbiAgICBpZiAoUFJFQUNUX0FQUF9CQUNLID09PSAnUFJFQUNUX0FQUF9QQVJTRScpIHtcclxuICAgICAgICByZXR1cm4gPFBhcnNlU2VydmVyIHsuLi5wcm9wc30gLz5cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfTk9ERUpTJykge1xyXG4gICAgICAgIHJldHVybiA8V2ViU29ja2V0Q29udGFpbmVyIHsuLi5wcm9wc30gLz5cclxuICAgIH1cclxuXHJcbiAgICBlbHNlIHJldHVybiBudWxsO1xyXG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFRoZW1lQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZVRoZW1lQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpO1xyXG5cclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFRoZW1lUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gVGhlbWVQcm92aWRlcihwcm9wcykge1xyXG4gIFxyXG4gIGNvbnN0IHsgaW5pdFN0YXRlIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0U3RhdGUpO1xyXG5cclxuICByZXR1cm4gPFRoZW1lQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17c3RhdGV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZVRoZW1lQ29udGV4dCwgVGhlbWVQcm92aWRlciB9O1xyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgTmF2Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZU5hdkNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoTmF2Q29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VOYXZDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIE5hdlByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU5hdmlnYXRpb24oKSB7XHJcbiAgY29uc3QgW2RyYXdlck9wZW4sIHNldERyYXdlck9wZW5dID0gdXNlTmF2Q29udGV4dCgpO1xyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRHJhd2VyKCl7XHJcbiAgICAgICAgc2V0RHJhd2VyT3BlbihwcmV2PT4hcHJldilcclxuICAgIH1cclxuICByZXR1cm4geyBkcmF3ZXJPcGVuLCB0b2dnbGVEcmF3ZXIgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdlByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgW2RyYXdlck9wZW4sIHNldERyYXdlck9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW2RyYXdlck9wZW4sIHNldERyYXdlck9wZW5dLCBbZHJhd2VyT3Blbl0pO1xyXG4gIHJldHVybiA8TmF2Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlUHJvdmlkZXIgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IEhhbmdvdXRBZGFwdGVyIH0gZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUvSGFuZ291dEFkYXB0ZXInO1xyXG5pbXBvcnQge0hhbmdvdXRzUHJvdmlkZXJ9IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInXHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBOYXZQcm92aWRlciB9IGZyb20gJy4uL25hdi9OYXZQcm92aWRlcic7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFByb3ZpZGVycyh7IGNoaWxkcmVuIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPFRoZW1lUHJvdmlkZXJcclxuICAgICAgaW5pdFN0YXRlPXt7XHJcbiAgICAgICAgcHJpbWFyeToge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogJyM2MjAwRUUnLFxyXG4gICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8QXBwUm91dGVQcm92aWRlclxyXG4gICAgICAgIHRpdGxlPVwiV2ViY29tXCJcclxuICAgICAgICBpbml0U3RhdGU9e3sgcm91dGU6ICcvJywgZmVhdHVyZVJvdXRlOiAnL2hhbmdvdXRzJyB9fVxyXG4gICAgICA+XHJcbiAgICAgICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgICAgIDxOYXZQcm92aWRlcj5cclxuICAgICAgICAgICAgPEhhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDxIYW5nb3V0QWRhcHRlciBzb2NrZXRVcmw9e2B3c3M6Ly8ke2lwfTozMDAwYH0+XHJcbiAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgICA8L0hhbmdvdXRBZGFwdGVyPlxyXG4gICAgICAgICAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgICAgXHJcbiAgICAgICAgICA8L05hdlByb3ZpZGVyPlxyXG4gICAgICAgIDwvQXV0aFByb3ZpZGVyPlxyXG4gICAgICA8L0FwcFJvdXRlUHJvdmlkZXI+XHJcbiAgICA8L1RoZW1lUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJ1xyXG5leHBvcnQgZnVuY3Rpb24gTmF2SXRlbSAocHJvcHMpe1xyXG5jb25zdCB7Y2hpbGRyZW59PXByb3BzXHJcbnJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1pdGVtXCJ7Li4ucHJvcHN9PntjaGlsZHJlbn08L2Rpdj5cclxufSIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5cclxuXHJcblxyXG4gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGlzdChwcm9wcykge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3RcIiB7Li4ucHJvcHN9Lz5cclxuICApO1xyXG59XHJcblxyXG5cclxuIGZ1bmN0aW9uIExpc3RJdGVtKHByb3BzKSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtaXRlbVwiIHsuLi5wcm9wc30gLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQge0xpc3RJdGVtfSIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FRQUFBQUFZTGxWQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQW1KTFIwUUFBS3FOSXpJQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFIZEVsTlJRZmtCQnNJTFMxWWY5SklBQUFEb0VsRVFWUm8zcjJaUzBoVVVSakhmM010aTlCU00ybFIwdFBKaEVqU1ZpRUUxYUtObFJVVkpGRVFGRkVrYnUyMUs3R0lOaEZGUkErQ2xpVXRhdE5MM0lUUk5LRVJCbEVMZFViSDdLR21jMXZjcmpQanpMMzNmR2Z1K0gyTGdYdk85Lzk5OTV3ejUzVURTSzJNT3FwWVF3WEZGRkVBL0NUR0VEMTBFK1lWL1dKRlphdmxNaUhpbUM0ZUowUWJOWDZqNTlQTVIxZndkQS9UVEtFLzhCTE9NeWlDMno3SU9ZcXpnd2RvcEY4TGJudVVVeGk2K0ZXOHlRcHUrMnRXNnVCM011UUwzc1RrQi90a2NJTXJ2c0Z0YjFQdmlud2UrSTQzTWJuUGJEVjhlMDd3SmlaUHZGTUljQ2RuZUJPVEIxNGQ0WC9mVC9kV04veWVuT05OVFBZNzRWY1NtNUVFWXF6STNQditURHNxL3BKQUFtdmJFVzdLSmd1KzhwQWVJTWgrbGdwakQzRW45VUVKQTZKMytFTVRlVlBSZVRUelJ4VGZSMUZxQWhkRTRXTnNUM3VucmNJVXppUUh6eGN1dU1jeU51dHhrVVkwZWIvUUxBcnRTQm81cWNPNFU2VFRsQWdOaVFKM09RNHQyVHdTdHNOcVJXRy95SGRNSUo5ZklxMXFNTUI1WnNwb0hZdzdsbzNUS2RJNllDV3dUUlRVNjFyNlJhUzFCUXpLV0NzS2lybVdSa1ZhNnlnMXFITVkwMDQyeDdWMHJrakxvTTZnU2hRQ1MxeEx5NFZxVlFaQllVaXRTMWxBZkNZS0dsUUlROHFwZGl5cjhXaWZkS3N3S0JXR3dFbkhraE5pclZLSWlLWU9FNU1KaDRiZXlJUllhd0RHeEVFbW4xbVVoaStqVjBOcFZDOEJrMjRxVS9DVmRHdnBqT3AwZ1IyNmVBby9UN2dYU09vQ2c1L2lnV1BacDZTN2tOOTgxRlFaTVlob2hQM2xPcHVJSnozWnpFMG1OSlFpaU0rQm85eHdPRzZ2NXBaNFJOMkRzNExxY1I2eXpQV05sdk5JbEVBTE5DaFhqbEd2MUt6MURDdHI3b1F5ajNzdjI3OEpKdTFLdml0cFRscno4SHVGcW1NdUswQW0yOEM0Z21xWHRTTjZyaURZUnBjb2diZGNVYWoxelBxcFVSajVDMFY0Z0VVSy80ajFkdVd3UjhWMk1SN2dxWWRxQ1BoL1gzSGJRNnBESzRFM0h1VkoxRUtQbzFtRFZnTHV4NVFJQllrV0dPR2FxMVJNS3dIM3FLdldLbVR2aUl2cHliREcyemFpTmMvUGNybXU3aVBJY09xanc2SXBORnMvbUo1VGdOY3pobitSK1N3eVU1ZFVRNWt2cVFCMnowZ0N6c2Q3b0MzbitJdnVJemZBN1p6aTczdmZtYy9PNFdYMVk3WDc4bG5jeWduK3JocmU2b2hXbitGeExncXZBZGloK2Ewc2t3K3pWd2EzYkFVdmZjRy9ZTGtPM3VxS1J2cXlna2M1S20zNjZWYkVHYUphOEFndExNZ09ibHNCVFh3UXdVT2N0dFo3UDYyYVZ0NHg2UXFlcEl0TGliMmVTaTlMclpRNjFsSkpCU1ZKbis4SHB6N2ZDOCthL3dDMVpBWHMzVWhVSEFBQUFDVjBSVmgwWkdGMFpUcGpjbVZoZEdVQU1qQXlNQzB3TkMweU4xUXdPRG8wTlRvME5Tc3dNRG93TUJhd1NWUUFBQUFsZEVWWWRHUmhkR1U2Ylc5a2FXWjVBREl3TWpBdE1EUXRNamRVTURnNk5EVTZORFVyTURBNk1EQm43ZkhvQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUIzZDNjdWFXNXJjMk5oY0dVdWIzSm5tKzQ4R2dBQUFBQkpSVTVFcmtKZ2dnPT1cIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgcHJvcE5hbWUsXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd3ZWJjb20nKTtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUyB9O1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkwsXHJcbiAgICB0b2tlbixcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHsgdXNlciwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFLCB1c2VyIH0pO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCAgTGlzdCx7IExpc3RJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9saXN0JztcclxuaW1wb3J0IHVzZXJJY29uIGZyb20gJy4vaWNvbnMvdXNlcjY0LnBuZyc7XHJcbmltcG9ydCB7IGxvZ291dCB9IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBncmlkOiB7XHJcbiAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnYXV0byA1JSBhdXRvJyxcclxuICAgIGp1c3RpZnlJdGVtczogJ2NlbnRlcicsXHJcbiAgICBwYWRkaW5nOjE2XHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoRHJhd2VyQ29udGVudCgpIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfSA9IHVzZUFwcFJvdXRlKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCxyb3V0ZTonL2F1dGgnfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nVG9wOiAxMCB9fT5cclxuICAgICAgeyFzdGF0ZS51c2VyICYmIDxVbkF1dGhlZFN0YXRlIGhhbmRsZVJvdXRlPXtoYW5kbGVSb3V0ZX0gLz59XHJcbiAgICAgIHtzdGF0ZS51c2VyICYmIChcclxuICAgICAgICA8QXV0aGVkU3RhdGVcclxuICAgICAgICBvbkFwcFJvdXRlPXtvbkFwcFJvdXRlfVxyXG4gICAgICAgICAgaGFuZGxlUm91dGU9e2hhbmRsZVJvdXRlfVxyXG4gICAgICAgICAgdXNlck5hbWU9e3N0YXRlLnVzZXIudXNlcm5hbWV9XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuICAgICAgPGhyIHN0eWxlPXt7IGhlaWdodDogMSB9fSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUsIHVzZXJOYW1lICxvbkFwcFJvdXRlfSkge1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ091dCgpIHtcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6Jy8nLHJvdXRlOicvaG9tZSd9KTtcclxuICAgIGxvZ291dCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8aW1nIHNyYz17dXNlckljb259IHN0eWxlPXt7IHBhZGRpbmdSaWdodDogNSB9fSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlTG9nT3V0fSBpZD0nbG9nb3V0JyBkYXRhLXRlc3RpZD0nbG9nb3V0Jz5cclxuICAgICAgICAgICAgTG9nb3V0XHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogOCB9fT5XZWxjb21lLCB7dXNlck5hbWV9PC9kaXY+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2NoYW5nZXBhc3N3b3JkJ2RhdGEtdGVzdGlkPSdjaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgICBDaGFuZ2UgUGFzc3dvcmRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5BdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuZ3JpZH0+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdsb2dpbicgZGF0YS10ZXN0aWQ9J2xvZ2luJz5cclxuICAgICAgICAgIExvZ2luXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgIDxkaXY+fDwvZGl2PlxyXG4gICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nc2lnbnVwJyBkYXRhLXRlc3RpZD0nc2lnbnVwJz5cclxuICAgICAgICAgIFNpZ251cFxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IExpc3QsIHsgTGlzdEl0ZW0gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2xpc3QvaW5kZXgnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0RHJhd2VyQ29udGVudCgpIHtcclxuXHJcbmNvbnN0IHtvbkFwcFJvdXRlfSA9dXNlQXBwUm91dGUoKVxyXG5cclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSB1c2VVc2VyTmFtZSgpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG5cclxuICAgICAgb25BcHBSb3V0ZSh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlOicvaGFuZ291dHMnLHJvdXRlOicvaGFuZ291dHMnfSlcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBvbkFwcFJvdXRlKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGU6Jy9sb2dpbicscm91dGU6Jy9hdXRoJ30pXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGRhdGEtdGVzdGlkPSdoYW5nb3V0cyc+XHJcbiAgICAgICAgICBIYW5nb3V0XHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuIFxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgbWVzc2FnZUljb24gZnJvbSAnLi9tZXNzYWdlLnBuZyc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGNvdW50OiB7XHJcbiAgICB3aWR0aDogMzAsXHJcbiAgICBoZWlnaHQ6IDMwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nLFxyXG4gICAgY29sb3I6ICd3aGl0ZScsXHJcbiAgICB0ZXh0QWxpZ246J2NlbnRlcicsXHJcbiAgICBib3JkZXJSYWRpdXM6MTUsXHJcbiAgICBkaXNwbGF5OidmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6J2NlbnRlcicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDonY2VudGVyJ1xyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHsgY291bnQ9MCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJ319PlxyXG4gICAgICAgICAgPGRpdj5tZXNzYWdlOjwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jb3VudH0gZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWNvdW50XCI+e2NvdW50fTwvZGl2PiBcclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gU2V0dGluZ3MocHJvcHMpIHtcclxuXHJcbiAgY29uc3QgeyBoZWlnaHQgPSAyNCxcclxuICAgIHdpZHRoID0gMjQsXHJcbiAgICBmaWxsID0gJ25vbmUnLFxyXG4gICAgY29sb3IgPSAnYmxhY2snLG9uQ2xpY2sgLGlkfT1wcm9wc1xyXG4gIFxyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gIGlkPXtpZH0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMFYweicgZmlsbD17ZmlsbH0gaWQ9e2lkfS8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGlkPXtpZH1cclxuICAgICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgICAgY29sb3I9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xOS40MyAxMi45OGMuMDQtLjMyLjA3LS42NC4wNy0uOThzLS4wMy0uNjYtLjA3LS45OGwyLjExLTEuNjVjLjE5LS4xNS4yNC0uNDIuMTItLjY0bC0yLTMuNDZjLS4xMi0uMjItLjM5LS4zLS42MS0uMjJsLTIuNDkgMWMtLjUyLS40LTEuMDgtLjczLTEuNjktLjk4bC0uMzgtMi42NUMxNC40NiAyLjE4IDE0LjI1IDIgMTQgMmgtNGMtLjI1IDAtLjQ2LjE4LS40OS40MmwtLjM4IDIuNjVjLS42MS4yNS0xLjE3LjU5LTEuNjkuOThsLTIuNDktMWMtLjIzLS4wOS0uNDkgMC0uNjEuMjJsLTIgMy40NmMtLjEzLjIyLS4wNy40OS4xMi42NGwyLjExIDEuNjVjLS4wNC4zMi0uMDcuNjUtLjA3Ljk4cy4wMy42Ni4wNy45OGwtMi4xMSAxLjY1Yy0uMTkuMTUtLjI0LjQyLS4xMi42NGwyIDMuNDZjLjEyLjIyLjM5LjMuNjEuMjJsMi40OS0xYy41Mi40IDEuMDguNzMgMS42OS45OGwuMzggMi42NWMuMDMuMjQuMjQuNDIuNDkuNDJoNGMuMjUgMCAuNDYtLjE4LjQ5LS40MmwuMzgtMi42NWMuNjEtLjI1IDEuMTctLjU5IDEuNjktLjk4bDIuNDkgMWMuMjMuMDkuNDkgMCAuNjEtLjIybDItMy40NmMuMTItLjIyLjA3LS40OS0uMTItLjY0bC0yLjExLTEuNjV6TTEyIDE1LjVjLTEuOTMgMC0zLjUtMS41Ny0zLjUtMy41czEuNTctMy41IDMuNS0zLjUgMy41IDEuNTcgMy41IDMuNS0xLjU3IDMuNS0zLjUgMy41eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTmF2SXRlbSB9IGZyb20gJy4uLy4uL25hdi9OYXZJdGVtJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uLy4uL2ljb25zL01lc3NhZ2UnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4uLy4uL2ljb25zL1NldHTEsW5ncyc7XHJcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJy4uLy4uL2ljb25zL29ubGluZVN0YXR1cyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi4vc3RhdGUvdXNlSGFuZ291dHMnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0VG9wTWVudSgpIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuICBjb25zdCB7IHJlYWR5U3RhdGUsIHVucmVhZGhhbmdvdXRzLCBvbk5hdmlnYXRpb24sIGhhbmdvdXQgfSA9IHVzZUhhbmdvdXRzKCk7XHJcblxyXG4gIGZ1bmN0aW9uIG5hdlRvVW5yZWFkKCkge1xyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogJy9VTlJFQUQnLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT5cclxuICAgICAgPE5hdkl0ZW0+e3VzZXJuYW1lfTwvTmF2SXRlbT5cclxuICAgICAgPE5hdkl0ZW0+XHJcbiAgICAgICAgPE9ubGluZVN0YXR1cyByZWFkeVN0YXRlPXtyZWFkeVN0YXRlfSAvPlxyXG4gICAgICA8L05hdkl0ZW0+XHJcbiAgICAgIDxOYXZJdGVtIG9uQ2xpY2s9e25hdlRvVW5yZWFkfSBkYXRhLXRlc3RpZD1cIm5hdi11bnJlYWRzXCI+XHJcbiAgICAgICAge3VucmVhZGhhbmdvdXRzICYmIDxNZXNzYWdlIGNvdW50PXt1bnJlYWRoYW5nb3V0cy5maWx0ZXIoZj0+Zi5yZWFkPT09ZmFsc2UpLmxlbmd0aH0gLz59eycgJ31cclxuICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICB7aGFuZ291dCAmJiAoXHJcbiAgICAgICAgPE5hdkl0ZW0gICAgb25DbGljaz17b25OYXZpZ2F0aW9ufSBkYXRhLXRlc3RpZD1cIm5hdi1jb25maWdcIiBpZD1cImNvbmZpZ3VyZVwiID5cclxuICAgICAgICAgIDxTZXR0aW5nc1xyXG4gICAgICAgICAgICBmaWxsPVwid2hpdGVcIlxyXG4gICAgICAgICAgICB3aWR0aD1cIjMwXCJcclxuICAgICAgICAgICAgaGVpZ2h0PVwiMzBcIlxyXG4gICAgICAgICBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICApfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4vL1xyXG4iLCJleHBvcnQgY29uc3QgZHJhd2VyID0ge1xyXG4gIGJveFNoYWRvdzogYDBweCAzcHggM3B4IC0ycHggcmdiYSgwLCAwLCAwLCAwLjIpLDBweCAzcHggNHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTQpLCAwcHggMXB4IDhweCAwcHggcmdiYSgwLCAwLCAwLCAwLjEyKWAsXHJcblxyXG4gIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gIGxlZnQ6IDAsXHJcbiAgdG9wOiAwLFxyXG4gIHpJbmRleDogMTAsXHJcbiAgaGVpZ2h0OiAnMTAwdmgnLFxyXG4gIGJhY2tncm91bmRDb2xvcjogJyNmNWY1ZjUnLFxyXG59O1xyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCx1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGRyYXdlciB9IGZyb20gJy4vc3R5bGUnO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG5pbXBvcnQgeyB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnLi9OYXZQcm92aWRlcic7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERyYXdlcihwcm9wcykge1xyXG4gIGNvbnN0IFtwaW5uZWQsc2V0UGlubmVkXT11c2VTdGF0ZShmYWxzZSlcclxuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7IG9wZW4sIG9uQ2xpY2ssIGNoaWxkcmVuLHN0eWxlIH0gPSBwcm9wcztcclxuIFxyXG4gIFxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdlxyXG4gICAgICAgc3R5bGU9e3suLi5kcmF3ZXIscG9zaXRpb246IGRldmljZT09PVwicGhvbmVcIiA/ICdmaXhlZCc6J3JlbGF0aXZlJ319XHJcbiAgICAgICAgY2xhc3NOYW1lPXtgZHJhd2VyLSR7ZGV2aWNlfS13aWR0aGB9XHJcbiAgICBcclxuICAgICAgPlxyXG5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgXHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwQmFyKHsgY2hpbGRyZW4sc3R5bGUgfSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAuLi50aGVtZS5wcmltYXJ5LFxyXG4gICAgICAgLy8gIHBvc2l0aW9uOiAnZml4ZWQnLFxyXG4gICAgICAgIC8vIGxlZnQ6IDAsXHJcbiAgICAgICAvLyAgdG9wOiAwLFxyXG4gICAgICAgIG1pbkhlaWdodDogNjQsXHJcbiAgICAgICAvLyBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAvLyBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgZGlzcGxheTonZmxleCcsLi4uc3R5bGVcclxuICAgICAgfX1cclxuICAgID5cclxuICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgJy4uL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudVdoaXRlKHsgb25DbGljaywgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPVwibWVudS13aGl0ZVwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICBmaWxsPVwid2hpdGVcIlxyXG4gICAgICB3aWR0aD1cIjI0cHhcIlxyXG4gICAgICBoZWlnaHQ9XCIyNHB4XCJcclxuICAgID5cclxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMyAxOGgxOHYtMkgzdjJ6bTAtNWgxOHYtMkgzdjJ6bTAtN3YyaDE4VjZIM3pcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGlvbiB9IGZyb20gJy4vTmF2UHJvdmlkZXInO1xyXG5pbXBvcnQgeyBNZW51V2hpdGUgfSBmcm9tICcuL2ljb25zL01lbnVXaGl0ZSc7XHJcbmV4cG9ydCBmdW5jdGlvbiBNZW51KHtvbkNsaWNrfSkge1xyXG5cclxuXHJcbiAgcmV0dXJuIDxNZW51V2hpdGUgb25DbGljaz17b25DbGlja30gaWQ9XCJtZW51XCIgLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlRWZmZWN0fSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IE5hdkl0ZW0gfSBmcm9tICcuLi9uYXYvTmF2SXRlbSc7XHJcbmltcG9ydCB7IEF1dGhEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vYXV0aC9BdXRoRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCAgSGFuZ291dERyYXdlckNvbnRlbnQgIGZyb20gJy4uL2hhbmdvdXRzL25hdi9IYW5nb3V0RHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEhhbmdvdXRUb3BNZW51IH0gZnJvbSAnLi4vaGFuZ291dHMvbmF2L0hhbmdvdXRUb3BNZW51JztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHJlY292ZXJMb2NhbEF1dGhTdGF0ZSB9IGZyb20gJy4uL2F1dGgvYWN0aW9ucyc7XHJcbmltcG9ydCBEcmF3ZXIgZnJvbSAnLi4vbmF2L0RyYXdlcic7XHJcbmltcG9ydCB7IEFwcEJhciB9IGZyb20gJy4uL25hdi9BcHBCYXInO1xyXG5pbXBvcnQgeyBNZW51IH0gZnJvbSAnLi4vbmF2L01lbnUnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwTmF2aWdhdGlvbigpIHtcclxuICAgIGNvbnN0IHsgZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcblxyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG4gICAgICAgICBcclxuICAgICAgIGNvbnN0IHVzZXIgPUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKVxyXG4gICAgXHJcbiAgICAgICAgICByZWNvdmVyTG9jYWxBdXRoU3RhdGUoe1xyXG4gICAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgICAgdXNlclxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxBcHBCYXI+XHJcbiAgICAgICAgPE1lbnUgLz5cclxuICAgICAgICA8TmF2SXRlbSBzdHlsZT17eyBmbGV4OiA1IH19PldFQiBDT008L05hdkl0ZW0+XHJcbiAgICAgICAgPEhhbmdvdXRUb3BNZW51IC8+XHJcbiAgICAgIDwvQXBwQmFyPlxyXG4gICAgICA8RHJhd2VyPlxyXG4gICAgICAgIDxBdXRoRHJhd2VyQ29udGVudCAvPlxyXG4gICAgICAgIDxIYW5nb3V0RHJhd2VyQ29udGVudCAvPlxyXG4gICAgICA8L0RyYXdlcj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0e3VzZVN0YXRlIGFzIG4sdXNlUmVkdWNlciBhcyB0LHVzZUVmZmVjdCBhcyBlLHVzZUxheW91dEVmZmVjdCBhcyByLHVzZVJlZiBhcyBvLHVzZUltcGVyYXRpdmVIYW5kbGUgYXMgdSx1c2VNZW1vIGFzIGksdXNlQ2FsbGJhY2sgYXMgZix1c2VDb250ZXh0IGFzIGMsdXNlRGVidWdWYWx1ZSBhcyBhfWZyb21cInByZWFjdC9ob29rc1wiO2V4cG9ydCpmcm9tXCJwcmVhY3QvaG9va3NcIjtpbXBvcnR7Q29tcG9uZW50IGFzIGwsY3JlYXRlRWxlbWVudCBhcyBzLG9wdGlvbnMgYXMgdix0b0NoaWxkQXJyYXkgYXMgaCxoeWRyYXRlIGFzIHAscmVuZGVyIGFzIGQsX3VubW91bnQgYXMgbSxjbG9uZUVsZW1lbnQgYXMgeSxjcmVhdGVSZWYgYXMgYixjcmVhdGVDb250ZXh0IGFzIGcsRnJhZ21lbnQgYXMgeH1mcm9tXCJwcmVhY3RcIjtleHBvcnR7Y3JlYXRlRWxlbWVudCxjcmVhdGVDb250ZXh0LGNyZWF0ZVJlZixGcmFnbWVudCxDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7ZnVuY3Rpb24gRShuLHQpe2Zvcih2YXIgZSBpbiB0KW5bZV09dFtlXTtyZXR1cm4gbn1mdW5jdGlvbiB3KG4sdCl7Zm9yKHZhciBlIGluIG4paWYoXCJfX3NvdXJjZVwiIT09ZSYmIShlIGluIHQpKXJldHVybiEwO2Zvcih2YXIgciBpbiB0KWlmKFwiX19zb3VyY2VcIiE9PXImJm5bcl0hPT10W3JdKXJldHVybiEwO3JldHVybiExfXZhciBDPWZ1bmN0aW9uKG4pe3ZhciB0LGU7ZnVuY3Rpb24gcih0KXt2YXIgZTtyZXR1cm4oZT1uLmNhbGwodGhpcyx0KXx8dGhpcykuaXNQdXJlUmVhY3RDb21wb25lbnQ9ITAsZX1yZXR1cm4gZT1uLCh0PXIpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuX19wcm90b19fPWUsci5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHcodGhpcy5wcm9wcyxuKXx8dyh0aGlzLnN0YXRlLHQpfSxyfShsKTtmdW5jdGlvbiBfKG4sdCl7ZnVuY3Rpb24gZShuKXt2YXIgZT10aGlzLnByb3BzLnJlZixyPWU9PW4ucmVmO3JldHVybiFyJiZlJiYoZS5jYWxsP2UobnVsbCk6ZS5jdXJyZW50PW51bGwpLHQ/IXQodGhpcy5wcm9wcyxuKXx8IXI6dyh0aGlzLnByb3BzLG4pfWZ1bmN0aW9uIHIodCl7cmV0dXJuIHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWUscyhuLEUoe30sdCkpfXJldHVybiByLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PSEwLHIuZGlzcGxheU5hbWU9XCJNZW1vKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHIudD0hMCxyfXZhciBBPXYuX19iO2Z1bmN0aW9uIFMobil7ZnVuY3Rpb24gdCh0KXt2YXIgZT1FKHt9LHQpO3JldHVybiBkZWxldGUgZS5yZWYsbihlLHQucmVmKX1yZXR1cm4gdC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD10LnQ9ITAsdC5kaXNwbGF5TmFtZT1cIkZvcndhcmRSZWYoXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsdH12Ll9fYj1mdW5jdGlvbihuKXtuLnR5cGUmJm4udHlwZS50JiZuLnJlZiYmKG4ucHJvcHMucmVmPW4ucmVmLG4ucmVmPW51bGwpLEEmJkEobil9O3ZhciBrPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/aChuKS5yZWR1Y2UoZnVuY3Rpb24obixlLHIpe3JldHVybiBuLmNvbmNhdCh0KGUscikpfSxbXSk6bnVsbH0sUj17bWFwOmssZm9yRWFjaDprLGNvdW50OmZ1bmN0aW9uKG4pe3JldHVybiBuP2gobikubGVuZ3RoOjB9LG9ubHk6ZnVuY3Rpb24obil7aWYoMSE9PShuPWgobikpLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZHJlbi5vbmx5KCkgZXhwZWN0cyBvbmx5IG9uZSBjaGlsZC5cIik7cmV0dXJuIG5bMF19LHRvQXJyYXk6aH0sRj12Ll9fZTtmdW5jdGlvbiBOKG4pe3JldHVybiBuJiYoKG49RSh7fSxuKSkuX19jPW51bGwsbi5fX2s9bi5fX2smJm4uX19rLm1hcChOKSksbn1mdW5jdGlvbiBVKCl7dGhpcy5fX3U9MCx0aGlzLm89bnVsbCx0aGlzLl9fYj1udWxsfWZ1bmN0aW9uIE0obil7dmFyIHQ9bi5fXy5fX2M7cmV0dXJuIHQmJnQudSYmdC51KG4pfWZ1bmN0aW9uIEwobil7dmFyIHQsZSxyO2Z1bmN0aW9uIG8obyl7aWYodHx8KHQ9bigpKS50aGVuKGZ1bmN0aW9uKG4pe2U9bi5kZWZhdWx0fHxufSxmdW5jdGlvbihuKXtyPW59KSxyKXRocm93IHI7aWYoIWUpdGhyb3cgdDtyZXR1cm4gcyhlLG8pfXJldHVybiBvLmRpc3BsYXlOYW1lPVwiTGF6eVwiLG8udD0hMCxvfWZ1bmN0aW9uIE8oKXt0aGlzLmk9bnVsbCx0aGlzLmw9bnVsbH12Ll9fZT1mdW5jdGlvbihuLHQsZSl7aWYobi50aGVuKWZvcih2YXIgcixvPXQ7bz1vLl9fOylpZigocj1vLl9fYykmJnIuX19jKXJldHVybiByLl9fYyhuLHQuX19jKTtGKG4sdCxlKX0sKFUucHJvdG90eXBlPW5ldyBsKS5fX2M9ZnVuY3Rpb24obix0KXt2YXIgZT10aGlzO251bGw9PWUubyYmKGUubz1bXSksZS5vLnB1c2godCk7dmFyIHI9TShlLl9fdiksbz0hMSx1PWZ1bmN0aW9uKCl7b3x8KG89ITAscj9yKGkpOmkoKSl9O3QuX19jPXQuY29tcG9uZW50V2lsbFVubW91bnQsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3UoKSx0Ll9fYyYmdC5fX2MoKX07dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbjtpZighLS1lLl9fdSlmb3IoZS5fX3YuX19rWzBdPWUuc3RhdGUudSxlLnNldFN0YXRlKHt1OmUuX19iPW51bGx9KTtuPWUuby5wb3AoKTspbi5mb3JjZVVwZGF0ZSgpfTtlLl9fdSsrfHxlLnNldFN0YXRlKHt1OmUuX19iPWUuX192Ll9fa1swXX0pLG4udGhlbih1LHUpfSxVLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obix0KXtyZXR1cm4gdGhpcy5fX2ImJih0aGlzLl9fdi5fX2tbMF09Tih0aGlzLl9fYiksdGhpcy5fX2I9bnVsbCksW3MobCxudWxsLHQudT9udWxsOm4uY2hpbGRyZW4pLHQudSYmbi5mYWxsYmFja119O3ZhciBQPWZ1bmN0aW9uKG4sdCxlKXtpZigrK2VbMV09PT1lWzBdJiZuLmwuZGVsZXRlKHQpLG4ucHJvcHMucmV2ZWFsT3JkZXImJihcInRcIiE9PW4ucHJvcHMucmV2ZWFsT3JkZXJbMF18fCFuLmwuc2l6ZSkpZm9yKGU9bi5pO2U7KXtmb3IoO2UubGVuZ3RoPjM7KWUucG9wKCkoKTtpZihlWzFdPGVbMF0pYnJlYWs7bi5pPWU9ZVsyXX19OyhPLnByb3RvdHlwZT1uZXcgbCkudT1mdW5jdGlvbihuKXt2YXIgdD10aGlzLGU9TSh0Ll9fdikscj10LmwuZ2V0KG4pO3JldHVybiByWzBdKyssZnVuY3Rpb24obyl7dmFyIHU9ZnVuY3Rpb24oKXt0LnByb3BzLnJldmVhbE9yZGVyPyhyLnB1c2gobyksUCh0LG4scikpOm8oKX07ZT9lKHUpOnUoKX19LE8ucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuKXt0aGlzLmk9bnVsbCx0aGlzLmw9bmV3IE1hcDt2YXIgdD1oKG4uY2hpbGRyZW4pO24ucmV2ZWFsT3JkZXImJlwiYlwiPT09bi5yZXZlYWxPcmRlclswXSYmdC5yZXZlcnNlKCk7Zm9yKHZhciBlPXQubGVuZ3RoO2UtLTspdGhpcy5sLnNldCh0W2VdLHRoaXMuaT1bMSwwLHRoaXMuaV0pO3JldHVybiBuLmNoaWxkcmVufSxPLnByb3RvdHlwZS5jb21wb25lbnREaWRVcGRhdGU9Ty5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQ9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO24ubC5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7UChuLGUsdCl9KX07dmFyIFc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7fXZhciB0PW4ucHJvdG90eXBlO3JldHVybiB0LmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnByb3BzLmNvbnRleHR9LHQucmVuZGVyPWZ1bmN0aW9uKG4pe3JldHVybiBuLmNoaWxkcmVufSxufSgpO2Z1bmN0aW9uIGoobil7dmFyIHQ9dGhpcyxlPW4uY29udGFpbmVyLHI9cyhXLHtjb250ZXh0OnQuY29udGV4dH0sbi52bm9kZSk7cmV0dXJuIHQucyYmdC5zIT09ZSYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCksdC5wPSExKSxuLnZub2RlP3QucD8oZS5fX2s9dC5fX2ssZChyLGUpLHQuX19rPWUuX19rKToodC52PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpLHAoXCJcIixlKSxlLmFwcGVuZENoaWxkKHQudiksdC5wPSEwLHQucz1lLGQocixlLHQudiksdC5fX2s9dC52Ll9fayk6dC5wJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSksdC5oPXIsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Qudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCl9LG51bGx9ZnVuY3Rpb24geihuLHQpe3JldHVybiBzKGose3Zub2RlOm4sY29udGFpbmVyOnR9KX12YXIgRD0vXig/OmFjY2VudHxhbGlnbm1lbnR8YXJhYmljfGJhc2VsaW5lfGNhcHxjbGlwKD8hUGF0aFUpfGNvbG9yfGZpbGx8Zmxvb2R8Zm9udHxnbHlwaCg/IVIpfGhvcml6fG1hcmtlcig/IUh8V3xVKXxvdmVybGluZXxwYWludHxzdG9wfHN0cmlrZXRocm91Z2h8c3Ryb2tlfHRleHQoPyFMKXx1bmRlcmxpbmV8dW5pY29kZXx1bml0c3x2fHZlY3Rvcnx2ZXJ0fHdvcmR8d3JpdGluZ3x4KD8hQykpW0EtWl0vO2wucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9e307dmFyIEg9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvciYmU3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIil8fDYwMTAzO2Z1bmN0aW9uIFQobix0LGUpe2lmKG51bGw9PXQuX19rKWZvcig7dC5maXJzdENoaWxkOyl0LnJlbW92ZUNoaWxkKHQuZmlyc3RDaGlsZCk7cmV0dXJuIGQobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfWZ1bmN0aW9uIFYobix0LGUpe3JldHVybiBwKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH12YXIgWj12LmV2ZW50O2Z1bmN0aW9uIEkobix0KXtuW1wiVU5TQUZFX1wiK3RdJiYhblt0XSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sdCx7Y29uZmlndXJhYmxlOiExLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzW1wiVU5TQUZFX1wiK3RdfSxzZXQ6ZnVuY3Rpb24obil7dGhpc1tcIlVOU0FGRV9cIit0XT1ufX0pfXYuZXZlbnQ9ZnVuY3Rpb24obil7WiYmKG49WihuKSksbi5wZXJzaXN0PWZ1bmN0aW9uKCl7fTt2YXIgdD0hMSxlPSExLHI9bi5zdG9wUHJvcGFnYXRpb247bi5zdG9wUHJvcGFnYXRpb249ZnVuY3Rpb24oKXtyLmNhbGwobiksdD0hMH07dmFyIG89bi5wcmV2ZW50RGVmYXVsdDtyZXR1cm4gbi5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe28uY2FsbChuKSxlPSEwfSxuLmlzUHJvcGFnYXRpb25TdG9wcGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LG4uaXNEZWZhdWx0UHJldmVudGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGV9LG4ubmF0aXZlRXZlbnQ9bn07dmFyICQ9e2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGFzc319LHE9di52bm9kZTt2LnZub2RlPWZ1bmN0aW9uKG4pe24uJCR0eXBlb2Y9SDt2YXIgdD1uLnR5cGUsZT1uLnByb3BzO2lmKHQpe2lmKGUuY2xhc3MhPWUuY2xhc3NOYW1lJiYoJC5lbnVtZXJhYmxlPVwiY2xhc3NOYW1lXCJpbiBlLG51bGwhPWUuY2xhc3NOYW1lJiYoZS5jbGFzcz1lLmNsYXNzTmFtZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJjbGFzc05hbWVcIiwkKSksXCJmdW5jdGlvblwiIT10eXBlb2YgdCl7dmFyIHIsbyx1O2Zvcih1IGluIGUuZGVmYXVsdFZhbHVlJiZ2b2lkIDAhPT1lLnZhbHVlJiYoZS52YWx1ZXx8MD09PWUudmFsdWV8fChlLnZhbHVlPWUuZGVmYXVsdFZhbHVlKSxkZWxldGUgZS5kZWZhdWx0VmFsdWUpLEFycmF5LmlzQXJyYXkoZS52YWx1ZSkmJmUubXVsdGlwbGUmJlwic2VsZWN0XCI9PT10JiYoaChlLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uKG4pey0xIT1lLnZhbHVlLmluZGV4T2Yobi5wcm9wcy52YWx1ZSkmJihuLnByb3BzLnNlbGVjdGVkPSEwKX0pLGRlbGV0ZSBlLnZhbHVlKSxlKWlmKHI9RC50ZXN0KHUpKWJyZWFrO2lmKHIpZm9yKHUgaW4gbz1uLnByb3BzPXt9LGUpb1tELnRlc3QodSk/dS5yZXBsYWNlKC9bQS1aMC05XS8sXCItJCZcIikudG9Mb3dlckNhc2UoKTp1XT1lW3VdfSFmdW5jdGlvbih0KXt2YXIgZT1uLnR5cGUscj1uLnByb3BzO2lmKHImJlwic3RyaW5nXCI9PXR5cGVvZiBlKXt2YXIgbz17fTtmb3IodmFyIHUgaW4gcikvXm9uKEFuaXxUcmF8VG91KS8udGVzdCh1KSYmKHJbdS50b0xvd2VyQ2FzZSgpXT1yW3VdLGRlbGV0ZSByW3VdKSxvW3UudG9Mb3dlckNhc2UoKV09dTtpZihvLm9uZG91YmxlY2xpY2smJihyLm9uZGJsY2xpY2s9cltvLm9uZG91YmxlY2xpY2tdLGRlbGV0ZSByW28ub25kb3VibGVjbGlja10pLG8ub25iZWZvcmVpbnB1dCYmKHIub25iZWZvcmVpbnB1dD1yW28ub25iZWZvcmVpbnB1dF0sZGVsZXRlIHJbby5vbmJlZm9yZWlucHV0XSksby5vbmNoYW5nZSYmKFwidGV4dGFyZWFcIj09PWV8fFwiaW5wdXRcIj09PWUudG9Mb3dlckNhc2UoKSYmIS9eZmlsfGNoZXxyYS9pLnRlc3Qoci50eXBlKSkpe3ZhciBpPW8ub25pbnB1dHx8XCJvbmlucHV0XCI7cltpXXx8KHJbaV09cltvLm9uY2hhbmdlXSxkZWxldGUgcltvLm9uY2hhbmdlXSl9fX0oKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYhdC5tJiZ0LnByb3RvdHlwZSYmKEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsTW91bnRcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHNcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxVcGRhdGVcIiksdC5tPSEwKX1xJiZxKG4pfTt2YXIgQj1cIjE2LjguMFwiO2Z1bmN0aW9uIEcobil7cmV0dXJuIHMuYmluZChudWxsLG4pfWZ1bmN0aW9uIEoobil7cmV0dXJuISFuJiZuLiQkdHlwZW9mPT09SH1mdW5jdGlvbiBLKG4pe3JldHVybiBKKG4pP3kuYXBwbHkobnVsbCxhcmd1bWVudHMpOm59ZnVuY3Rpb24gUShuKXtyZXR1cm4hIW4uX19rJiYoZChudWxsLG4pLCEwKX1mdW5jdGlvbiBYKG4pe3JldHVybiBuJiYobi5iYXNlfHwxPT09bi5ub2RlVHlwZSYmbil8fG51bGx9dmFyIFk9ZnVuY3Rpb24obix0KXtyZXR1cm4gbih0KX07ZXhwb3J0IGRlZmF1bHR7dXNlU3RhdGU6bix1c2VSZWR1Y2VyOnQsdXNlRWZmZWN0OmUsdXNlTGF5b3V0RWZmZWN0OnIsdXNlUmVmOm8sdXNlSW1wZXJhdGl2ZUhhbmRsZTp1LHVzZU1lbW86aSx1c2VDYWxsYmFjazpmLHVzZUNvbnRleHQ6Yyx1c2VEZWJ1Z1ZhbHVlOmEsdmVyc2lvbjpcIjE2LjguMFwiLENoaWxkcmVuOlIscmVuZGVyOlQsaHlkcmF0ZTpULHVubW91bnRDb21wb25lbnRBdE5vZGU6USxjcmVhdGVQb3J0YWw6eixjcmVhdGVFbGVtZW50OnMsY3JlYXRlQ29udGV4dDpnLGNyZWF0ZUZhY3Rvcnk6RyxjbG9uZUVsZW1lbnQ6SyxjcmVhdGVSZWY6YixGcmFnbWVudDp4LGlzVmFsaWRFbGVtZW50OkosZmluZERPTU5vZGU6WCxDb21wb25lbnQ6bCxQdXJlQ29tcG9uZW50OkMsbWVtbzpfLGZvcndhcmRSZWY6Uyx1bnN0YWJsZV9iYXRjaGVkVXBkYXRlczpZLFN1c3BlbnNlOlUsU3VzcGVuc2VMaXN0Ok8sbGF6eTpMfTtleHBvcnR7QiBhcyB2ZXJzaW9uLFIgYXMgQ2hpbGRyZW4sVCBhcyByZW5kZXIsViBhcyBoeWRyYXRlLFEgYXMgdW5tb3VudENvbXBvbmVudEF0Tm9kZSx6IGFzIGNyZWF0ZVBvcnRhbCxHIGFzIGNyZWF0ZUZhY3RvcnksSyBhcyBjbG9uZUVsZW1lbnQsSiBhcyBpc1ZhbGlkRWxlbWVudCxYIGFzIGZpbmRET01Ob2RlLEMgYXMgUHVyZUNvbXBvbmVudCxfIGFzIG1lbW8sUyBhcyBmb3J3YXJkUmVmLFkgYXMgdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMsVSBhcyBTdXNwZW5zZSxPIGFzIFN1c3BlbnNlTGlzdCxMIGFzIGxhenl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGF0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhvbWUoKSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9J2hvbWUnIHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PkhvbWU8L2Rpdj47XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6ICdJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBSRVNFVF9WQUxJREFUSU9OX1NUQVRFOiAnUkVTRVRfVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBJTlBVVF9CTFVSUkVEOiAnSU5QVVRfQkxVUlJFRCcsXHJcbiAgICBJTlBVVF9GT0NVU0VEOiAnSU5QVVRfRk9DVVNFRCcsXHJcbiAgXHJcbiAgICBTRVJWRVJfVkFMSURBVElPTjogJ1NFUlZFUl9WQUxJREFUSU9OJyxcclxuICAgIENMSUVOVF9WQUxJREFUSU9OOidDTElFTlRfVkFMSURBVElPTicsXHJcbiAgXHJcbiAgICBJTkNfSU5QVVRfQ09VVE4gOidJTkNfSU5QVVRfQ09VVE4nXHJcbiAgfTtcclxuICAiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgVkFMSUQ6ICdWQUxJRCcsXHJcbiAgSU5WQUxJRDogJ0lOVkFMSUQnLFxyXG4gIElOQUNUSVZFOiAnSU5BQ1RJVkUnXHJcbn07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHsgdmFsaWRhdGlvbjoge30gfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcblxyXG4gIGxldCBuZXh0U3RhdGUgPSBudWxsO1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuZGVidWdnZXI7XHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOUFVUX0ZPQ1VTRUQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgW2FjdGlvbi5wcm9wTmFtZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgY291bnQ6IHN0YXRlLmNvdW50ICsgMSB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBmb3JtUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9mb3JtUmVkdWNlcic7XHJcbmNvbnN0IEZvcm1Db250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1Db250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZvcm1Db250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlRm9ybUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggRm9ybVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHsgc3RhdGUsIGRpc3BhdGNoIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGb3JtUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoZm9ybVJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEZvcm1Db250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9jb25zdHJhaW50XHJcbiAgRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdFTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046ICdQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046ICdFTVBUWV9TVFJJTkdfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046ICdQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTicsXHJcbiAgLy9hdXRoXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAnVVNFUk5BTUVfVEFLRU4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdSRUdJU1RFUkVEX0VNQUlMJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ0VNQUlMX05PVF9SRUdJU1RFUkVEJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDonVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQnLFxyXG4gIEFDQ09VTlRfQUxSRUFEWV9FWElTVFM6J0FDQ09VTlRfQUxSRUFEWV9FWElTVFMnXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlZBTElEX1BBU1NXT1JEOlxyXG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxyXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FOlxyXG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcclxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ2VtcHR5IHN0cmluZyBpcyBub3QgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogJ2VtYWlsIG9yIHVzZXJuYW1lIGlzIG5vdCB2YWxpZCcsXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ2ludmFsaWQgY3JlZGVudGlhbHMgcHJvdmlkZWQnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ2VtYWlsIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcsXHJcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnLFxyXG4gIFxyXG4gIEFDQ09VTlRfQUxSRUFEWV9FWElTVFM6J0FjY291bnQgYWxyZWFkeSBleGlzdHMgZm9yIHRoaXMgdXNlcm5hbWUuJ1xyXG59O1xyXG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VybmFtZVJlZ2V4ID0gL1thLXpBLVpdK1stX10qW2EtekEtWl0rL2c7XHJcbiIsImltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSAnLi92YWxpZGF0aW9uUmVnZXgnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XHJcbiAgY29uc3QgcGFzc3dvcmRDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChwYXNzd29yZFJlZ2V4KTtcclxuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuICBpZiAoIXBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSkge1xyXG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KSB7XHJcblxyXG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9YXV0aDtcclxuXHJcbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgYWNjb3VudEFscmVhZHlFeGl0czoyMDIsXHJcbiAgLy9sb2dpblxyXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcclxuICAvL3NpZ251cFxyXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXHJcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxyXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXHJcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxyXG4gIC8vbG9naW5cclxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXHJcbiAgZW1wdHlTdHJpbmdOb3RWYWxpZDogJzQwOScsXHJcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXHJcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXHJcbi8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxyXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcclxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XHJcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuIiwiXHJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xyXG5pbXBvcnQgY29uc3RWYWxUeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGUsIHZhbHVlLCBzdGF0ZSxhdXRoIH0pIHtcclxuXHJcbiAgbGV0IHZhbGlkYXRpb24gPSBudWxsO1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtcclxuICAgICAgICBlbWFpbDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgXHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT04sIC4uLnZhbGlkYXRpb24gfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXRGb3JtVmFsaWRhdGlvblN0YXRlKCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTiB9O1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwIH0pIHtcclxuZGVidWdnZXJcclxuICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgY2FzZSAxMDE6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuY3JlZGVudGlhbEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSAxMjU6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICAgIGNhc2UgMjAzOlxyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSAyMDI6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtcHR5U3RyaW5nTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICAgIGNhc2UgMjAwOlxyXG4gICAgICBcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmREb05vdE1hdGNoOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4uL2F1dGgvYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQge3NlcnZlclZhbGlkYXRpb259IGZyb20gJy4uL2Zvcm0vYWN0aW9ucydcclxuUGFyc2UuaW5pdGlhbGl6ZShcInp0dHBucVRyOHJlZmt0QldOZWtaaFp4U3h3UGFBQW5FbFE5azdDdUFcIixcIlE3U0hTRkxHNjE4aXpieVNNcEFzRkFxZ25PTGFZZ3hObHdmRmhPQXJcIik7IC8vUEFTVEUgSEVSRSBZT1VSIEJhY2s0QXBwIEFQUExJQ0FUSU9OIElEIEFORCBZT1VSIEphdmFTY3JpcHQgS0VZXHJcblBhcnNlLnNlcnZlclVSTCA9IGBodHRwczovLyR7aXB9OjEzMzcvcGFyc2VgXHJcbi8vUGFyc2UubGl2ZVF1ZXJ5U2VydmVyVVJMID0gYGh0dHBzOi8vJHtpcH06MTMzNy9wYXJzZWBcclxuLy9QYXJzZS5zZXJ2ZXJVUkwgPSAnaHR0cHM6Ly9wYXJzZWFwaS5iYWNrNGFwcC5jb20vJ1xyXG4vL1BhcnNlLmxpdmVRdWVyeVNlcnZlclVSTCA9IGB3c3M6Ly93ZWJhcGlzLmJhY2s0YXBwLmlvYFxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnblVwKHtkaXNwYXRjaCxzdGF0ZSxmb3JtRGlzcGF0Y2h9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHt1c2VybmFtZSxwYXNzd29yZCxlbWFpbH09c3RhdGVcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEfSlcclxuICAgIC8vIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgdXNlciBjbGFzc1xyXG4gICAgdmFyIHVzZXIgPSBuZXcgUGFyc2UuVXNlcigpO1xyXG4gICAgdXNlci5zZXQoXCJ1c2VybmFtZVwiLCB1c2VybmFtZSk7XHJcbiAgICB1c2VyLnNldChcInBhc3N3b3JkXCIsIHBhc3N3b3JkKTtcclxuICAgIHVzZXIuc2V0KFwiZW1haWxcIiwgZW1haWwpO1xyXG4gICAgbGV0IHN1Y2Nlc3MgPSBhd2FpdCB1c2VyLnNpZ25VcCgpXHJcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICd3ZWJjb20nLFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgdG9rZW4gOnN1Y2Nlc3MuZ2V0KCdzZXNzaW9uVG9rZW4nKSxcclxuICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgICBjb25zdCBIYW5nb3V0VXNlciA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIYW5nb3V0VXNlclwiKTtcclxuICAgIGNvbnN0IGhhbmdvdXRVc2VyID0gbmV3IEhhbmdvdXRVc2VyKCk7XHJcbiAgICBoYW5nb3V0VXNlci5zZXQoJ3VzZXJuYW1lJyx1c2VybmFtZSlcclxuICAgIGhhbmdvdXRVc2VyLnNldCgnZW1haWwnLGVtYWlsKVxyXG4gICAgaGFuZ291dFVzZXIuc2V0KCd1c2VyaWQnLHN1Y2Nlc3MuaWQpXHJcbiAgICBhd2FpdCAgaGFuZ291dFVzZXIuc2F2ZSgpXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUyx1c2VyOnt1c2VybmFtZSxlbWFpbCx0b2tlbjpzdWNjZXNzLmdldCgnc2Vzc2lvblRva2VuJyl9fSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZm9ybURpc3BhdGNoKHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvci5jb2RlfSkpXHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dpbih7ZGlzcGF0Y2gsc3RhdGUsZm9ybURpc3BhdGNofSkge1xyXG4gICAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkfT0gc3RhdGVcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUR9KVxyXG4gICAgXHJcbiAgICAvLyBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHVzZXIgY2xhc3NcclxuICAgICAgIFBhcnNlLlVzZXIubG9nSW4oZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCkudGhlbihmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgbGV0IHVzZXJuYW1lID0gdXNlci5nZXQoXCJ1c2VybmFtZVwiKVxyXG4gICAgICAgIGxldCBlbWFpbCA9dXNlci5nZXQoXCJlbWFpbFwiKVxyXG4gICAgICAgIGxldCB0b2tlbiA9dXNlci5nZXQoJ3Nlc3Npb25Ub2tlbicpIFxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgICAgICBlbWFpbCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUyx1c2VyOnt1c2VybmFtZSxlbWFpbCx0b2tlbn19KVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVXNlciBjcmVhdGVkIHN1Y2Nlc3NmdWwgd2l0aCBuYW1lOiAnICsgdXNlci5nZXQoXCJ1c2VybmFtZVwiKSArICcgYW5kIGVtYWlsOiAnICsgdXNlci5nZXQoXCJlbWFpbFwiKSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBmb3JtRGlzcGF0Y2goc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGV9KSlcclxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlc30pXHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCh7ZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2h9KSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG4gICAgXHJcbiAgICBQYXJzZS5Vc2VyLnJlcXVlc3RQYXNzd29yZFJlc2V0KGVtYWlsKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxyXG4gICAgICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBgQSBsaW5rIGZvciBwYXNzd29yZCBjaGFuZ2UgIGhhcyBiZWVuIHNlbnQgdG8sICR7ZW1haWx9ISBgLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiUGFzc3dvcmQgcmVzZXQgcmVxdWVzdCB3YXMgc2VudCBzdWNjZXNzZnVsbHlcIik7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICBmb3JtRGlzcGF0Y2goc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGV9KSlcclxuICAgICAgICBcclxuICAgICAgY29uc29sZS5sb2coXCJUaGUgbG9naW4gZmFpbGVkIHdpdGggZXJyb3I6IFwiICsgZXJyb3IuY29kZSArIFwiIFwiICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9KTtcclxufSIsImltcG9ydCB7dXNlQXV0aENvbnRleHR9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0J1xyXG5pbXBvcnQge3VzZUZvcm1Db250ZXh0fSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCdcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2F1dGgtYWN0aW9ucydcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVBhcnNlQXV0aCgpe1xyXG5jb25zdCB7c3RhdGUsZGlzcGF0Y2h9PSB1c2VBdXRoQ29udGV4dCgpXHJcbmNvbnN0IHtkaXNwYXRjaDpmb3JtRGlzcGF0Y2h9PSB1c2VGb3JtQ29udGV4dCgpXHJcbiAgICBmdW5jdGlvbiBzaWdudXAoKXtcclxuICAgICAgICBhY3Rpb25zLnNpZ25VcCh7c3RhdGUsZGlzcGF0Y2gsZm9ybURpc3BhdGNofSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGxvZ2luICgpe1xyXG4gICAgICAgIGFjdGlvbnMubG9naW4oe3N0YXRlLGRpc3BhdGNoLGZvcm1EaXNwYXRjaH0pICBcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKCl7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgYWN0aW9ucy5mb3Jnb3RQYXNzd29yZCh7c3RhdGUsZGlzcGF0Y2gsZm9ybURpc3BhdGNofSkgIFxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQoKXtcclxuXHJcbiAgICB9XHJcbiAgIFxyXG5cclxuICAgIHJldHVybiB7c2lnbnVwLGxvZ2luLGNoYW5nZVBhc3N3b3JkLGZvcmdvdFBhc3N3b3JkfVxyXG5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5cclxuaW1wb3J0IHtGZWF0dXJlUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQge3VzZVBhcnNlQXV0aH0gZnJvbSAnLi4vcGFyc2UvdXNlUGFyc2VBdXRoJ1xyXG5jb25zdCBMb2dpbiA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0xvZ2luJykpO1xyXG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0NoYW5nZVBhc3N3b3JkJykpO1xyXG5jb25zdCBGb3Jnb3RQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0ZvcmdvdFBhc3N3b3JkJykpO1xyXG5jb25zdCBTaWdudXAgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9TaWdudXAnKSk7XHJcbmNvbnN0IFByb2ZpbGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9Qcm9maWxlJykpO1xyXG5jb25zdCBBdXRoRmVlZGJhY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9BdXRoRmVlZGJhY2snKSk7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBhcnNlQXV0aGVudGljYXRpb24oeyBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3Qge3NpZ251cCxsb2dpbixjaGFuZ2VQYXNzd29yZCxmb3Jnb3RQYXNzd29yZH09dXNlUGFyc2VBdXRoKClcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvY2hhbmdlcGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCBjaGFuZ2VQYXNzd29yZD17Y2hhbmdlUGFzc3dvcmR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2xvZ2luJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8TG9naW4gbG9naW49e2xvZ2lufS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9zaWdudXAnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxTaWdudXAgc2lnbnVwPXtzaWdudXB9Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2ZvcmdvdHBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Rm9yZ290UGFzc3dvcmQgIGZvcmdvdFBhc3N3b3JkPXtmb3Jnb3RQYXNzd29yZH0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvcHJvZmlsZSc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFByb2ZpbGUgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvYXV0aGZlZWRiYWNrJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8QXV0aEZlZWRiYWNrIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7IHNlcnZlclZhbGlkYXRpb24gfSBmcm9tICcuLi8uLi9mb3JtL2FjdGlvbnMnO1xyXG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuLi8uLi9mb3JtL2h0dHAtc3RhdHVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlQ2hhbmdlZCh7IHByb3BOYW1lLCB2YWx1ZSB9KSB7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBwcm9wTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL2xvZ2luYCwge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJyonLFxyXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCYXNpYyAke2J0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApfWAsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiBcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsIHVzZXI6e3Rva2VuLHVzZXJuYW1lLGVtYWlsfSB9KTtcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgIFxyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICBcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2dpbiBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBmb3JtRGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3NpZ251cGAsIHtcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHVzZXI6e3Rva2VuLHVzZXJuYW1lLGVtYWlsfSB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbnVwIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBjb25maXJtLCBwYXNzd29yZCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCB7dG9rZW59PXN0YXRlLnVzZXJcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvY2hhbmdlcGFzc2AsIHtcclxuICAgICAgbWV0aG9kOiAncHV0JyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIGNvbmZpcm0sXHJcbiAgICAgICAgcGFzc3dvcmQsXHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgIH0pLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxyXG4gICAgICAgIHVzZXI6e3Rva2VuLHVzZXJuYW1lLGVtYWlsfSxcclxuICAgICAgICBtZXNzYWdlOiBgUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuYCxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9yZXF1ZXN0cGFzc2NoYW5nZWAsIHtcclxuICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXHJcbiAgICB9KTtcclxuICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXHJcbiAgICAgICAgbWVzc2FnZTogYEEgbGluayBmb3IgcGFzc3dvcmQgY2hhbmdlICBoYXMgYmVlbiBzZW50IHRvLCAke2VtYWlsfSEgYCxcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJ1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgtY29udGV4dCdcclxuaW1wb3J0IHsgdXNlRm9ybUNvbnRleHQgfSBmcm9tICcuLi8uLi9mb3JtL2Zvcm0tY29udGV4dCdcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU5vZGVBdXRoKCkge1xyXG4gICAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KClcclxuICAgIGNvbnN0IHsgZGlzcGF0Y2g6IGZvcm1EaXNwYXRjaCB9ID0gdXNlRm9ybUNvbnRleHQoKVxyXG4gICAgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICAgICAgYWN0aW9ucy5sb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2lnbnVwKCkge1xyXG4gICAgICAgIGFjdGlvbnMuc2lnbnVwKHsgZGlzcGF0Y2gsIGZvcm1EaXNwYXRjaCwgc3RhdGUgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKCkge1xyXG4gICAgICAgIGFjdGlvbnMuZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKCkge1xyXG4gICAgICAgIGFjdGlvbnMuY2hhbmdlUGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KVxyXG4gICAgfVxyXG5cclxuICAgXHJcbiAgXHJcblxyXG4gICAgcmV0dXJuIHsgc2lnbnVwLCBsb2dpbiwgZm9yZ290UGFzc3dvcmQsIGNoYW5nZVBhc3N3b3JkIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuXHJcbmltcG9ydCB7RmVhdHVyZVJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHt1c2VOb2RlQXV0aH0gZnJvbSAnLi9ub2RlLWpzLWF1dGgvdXNlTm9kZUF1dGgnXHJcbmNvbnN0IExvZ2luID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vTG9naW4nKSk7XHJcbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vQ2hhbmdlUGFzc3dvcmQnKSk7XHJcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vRm9yZ290UGFzc3dvcmQnKSk7XHJcbmNvbnN0IFNpZ251cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1NpZ251cCcpKTtcclxuY29uc3QgUHJvZmlsZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1Byb2ZpbGUnKSk7XHJcbmNvbnN0IEF1dGhGZWVkYmFjayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0F1dGhGZWVkYmFjaycpKTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTm9kZUF1dGhlbnRpY2F0aW9uKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IHtzaWdudXAsbG9naW4sY2hhbmdlUGFzc3dvcmQsZm9yZ290UGFzc3dvcmR9PXVzZU5vZGVBdXRoKClcclxuXHJcblxyXG4gICBcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9jaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPENoYW5nZVBhc3N3b3JkIGNoYW5nZVBhc3N3b3JkPXtjaGFuZ2VQYXNzd29yZH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvbG9naW4nPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxMb2dpbiBsb2dpbj17bG9naW59Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3NpZ251cCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFNpZ251cCBzaWdudXA9e3NpZ251cH0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvZm9yZ290cGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAgZm9yZ290UGFzc3dvcmQ9e2ZvcmdvdFBhc3N3b3JkfS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9wcm9maWxlJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8UHJvZmlsZSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9hdXRoZmVlZGJhY2snPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxBdXRoRmVlZGJhY2sgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnLi9Ib21lJztcclxuaW1wb3J0IFBhcnNlQXV0aGVudGljYXRpb24gZnJvbSAnLi4vYXV0aC9QYXJzZUF1dGhlbnRpY2F0aW9uJztcclxuaW1wb3J0IE5vZGVBdXRoZW50aWNhdGlvbiBmcm9tICcuLi9hdXRoL05vZGVBdXRoZW50aWNhdGlvbic7XHJcbmltcG9ydCB7IEZvcm1Qcm92aWRlciB9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0JztcclxuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vaGFuZ291dHMnKSk7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlcygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDAlJyB9fT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYXV0aFwiPlxyXG4gICAgICAgIDxGb3JtUHJvdmlkZXI+XHJcbiAgICAgICAgICB7UFJFQUNUX0FQUF9CQUNLID09PSdQUkVBQ1RfQVBQX1BBUlNFJyAmJiA8UGFyc2VBdXRoZW50aWNhdGlvbi8+fVxyXG4gICAgICAgICAge1BSRUFDVF9BUFBfQkFDSyA9PT0nUFJFQUNUX0FQUF9OT0RFSlMnICYmIDxOb2RlQXV0aGVudGljYXRpb24vPn1cclxuICAgICAgICA8L0Zvcm1Qcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvXCI+XHJcbiAgICAgICAgPEhvbWUgLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuXHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICBcclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7QXBwTmF2aWdhdGlvbn0gZnJvbSAnLi9BcHBOYXZpZ2F0aW9uJ1xyXG5pbXBvcnQge0FwcFJvdXRlc30gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcbmltcG9ydCAnLi9jc3MvYXBwLmNzcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzk1dmgnIH19PlxyXG4gICAgIDxBcHBOYXZpZ2F0aW9uLz5cclxuICAgICAgPEFwcFJvdXRlcy8+XHJcbiAgICAgIHsnJ31cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlcnMgfSBmcm9tICcuL0FwcFByb3ZpZGVycyc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxuLy9QYXJzZS5pbml0aWFsaXplKFwienR0cG5xVHI4cmVma3RCV05la1poWnhTeHdQYUFBbkVsUTlrN0N1QVwiLFwiUTdTSFNGTEc2MThpemJ5U01wQXNGQXFnbk9MYVlneE5sd2ZGaE9BclwiKTsgLy9QQVNURSBIRVJFIFlPVVIgQmFjazRBcHAgQVBQTElDQVRJT04gSUQgQU5EIFlPVVIgSmF2YVNjcmlwdCBLRVlcclxuLy9QYXJzZS5zZXJ2ZXJVUkwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L3BhcnNlJ1xyXG5yZW5kZXIoXHJcbiAgPEFwcFByb3ZpZGVycz5cclxuICAgIDxBcHAgLz5cclxuICA8L0FwcFByb3ZpZGVycz4sXHJcblxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbImZldGNoIiwidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwiRkVBVFVSRV9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJGZWF0dXJlUm91dGUiLCJwcm9wcyIsImNoaWxkcmVuIiwicGF0aCIsInBhdGhzIiwiZGlzcGF0Y2giLCJmaW5kIiwidXNlQXBwUm91dGUiLCJvbkFwcFJvdXRlIiwiQXBwUm91dGUiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInZhbHVlIiwidXNlTWVtbyIsIlNFTkRJTkdfSEFOR09VVF9TVEFSVEVEIiwiU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQiLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTRUFSQ0hfSU5QVVRfQ0hBTkdFIiwiU0VMRUNURURfSEFOR09VVCIsIkNMRUFSRURfSEFOR09VVCIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRVJST1JfUkVDSUVWRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEIiwiTUVTU0FHRVNfVVBEQVRFRCIsIkhBTkdPVVRTX1VQREFURUQiLCJIQU5HT1VUX1VQREFURUQiLCJVTlJFQURfSEFOR09VVFNfVVBEQVRFRCIsIkNPTk5FQ1RJTkciLCJPUEVOIiwiQ0xPU0lORyIsIkNMT1NFRCIsIlNPQ0tFVF9SRUFEWSIsIlNPQ0tFVF9FUlJPUiIsImhhbmdvdXRzIiwiaGFuZ291dCIsInVucmVhZGhhbmdvdXRzIiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJzb2NrZXQiLCJyZWFkeVN0YXRlIiwic29ja2V0TWVzc2FnZSIsImZldGNoSGFuZ291dHMiLCJwZW5kaW5nSGFuZ291dCIsIm1lc3NhZ2UiLCJ0ZXh0IiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJGSUxURVJfSEFOR09VVFMiLCJmaWx0ZXIiLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiaGFuZ291dFN0YXRlcyIsIklOVklURVIiLCJBQ0NFUFRFUiIsIkRFQ0xJTkVSIiwiQkxPQ0tFUiIsIlVOQkxPQ0tFUiIsIk1FU1NBTkdFUiIsIklOVklURUQiLCJBQ0NFUFRFRCIsIkRFQ0xJTkVEIiwiQkxPQ0tFRCIsIlVOQkxPQ0tFRCIsIk1FU1NBR0VEIiwidXBkYXRlRGVsaXZlcmVkSGFuZ291dCIsIm5hbWUiLCJvZmZsaW5lIiwidGltZXN0YW1wIiwiZGVsaXZlcmVkSGFuZ291dCIsImRlbGl2ZXJlZCIsImhhbmdvdXRLZXkiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiaGFuZ291dEluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UiLCJ1cGRhdGVCb2NrZWRTdGF0ZSIsIm9mZmxpbmVIYW5nb3V0S2V5Iiwib2ZmbGluZWhhbmdvdXRzIiwiZGVsaXZlcmVkTWVzc2FnZSIsIm1lc3NhZ2VLZXkiLCJibG9ja2VkTWVzc2FnZSIsInNhdmVNZXNzYWdlZCIsInNhdmVJbnZpdGVkIiwic2F2ZUFjY2VwdGVkIiwic2F2ZURlY2xpbmVkIiwic2F2ZUJsb2NrZWQiLCJzYXZlVW5ibG92a2VkIiwic2F2ZVJlY2lldmVkSGFuZ291dCIsImZvY3VzZWRIYW5nb3V0IiwidW5yZWFkIiwiaGFuZ291dEV4aXN0IiwiaGciLCJyZWFkIiwidXBkYXRlZEhhbmdvdXRzIiwic2F2ZVJlY2lldmVkTWVzc2FnZSIsInNhdmVVbnJlYWRIYW5nb3V0IiwidXBkYXRlZE1lc3NhZ2VzIiwidW5yZWFkaGFuZ291dHNLZXkiLCJ1cGRhdGVkdW5yZWFkcyIsInNhdmVJbnZpdGVyIiwic2F2ZUFjY2VwdGVyIiwic2F2ZUJsb2NrZXIiLCJzYXZlRGVjbGluZXIiLCJzYXZlTWVzc2FuZ2VyIiwic2F2ZVVuYmxvY2tlciIsInVzZU1lc3NhZ2UiLCJoYW5kbGVBY2tub3dsZWRnZW1lbnQiLCJoYW5kbGVIYW5nb3V0IiwiaGFuZGxlSGFuZ291dHMiLCJmb3JFYWNoIiwidXNlRWZmZWN0IiwibG9hZEhhbmdvdXRzIiwic2VsZWN0VW5yZWFkIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJWQUxVRV9DSEFOR0VEIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJMT0dJTl9GQUlMRUQiLCJMT0dPVVRfU1RBUlRFRCIsIkxPR09VVF9GQUlMRUQiLCJMT0dPVVRfU1VDQ0VTUyIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSIsImVtYWlsIiwicGFzc3dvcmQiLCJzdWNjZXNzIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImlzTG9nZ2VkSW4iLCJpc1Bhc3N3b3JkQ2hhbmdlZCIsImF1dGhGZWVkYmFjayIsImF1dGhSZWR1Y2VyIiwibmV4dFN0YXRlIiwicGF5bG9hZCIsInByb3BOYW1lIiwic3VjY2Vzc01lc3NhZ2UiLCJBdXRoUm91dGVDb250ZXh0IiwiQXV0aFJvdXRlUHJvdmlkZXIiLCJpbml0aWFsUm91dGUiLCJhdXRoUm91dGUiLCJzZXRBdXRoUm91dGUiLCJ1c2VTdGF0ZSIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJ1c2VVc2VyTmFtZSIsInVzZXJOYW1lIiwic2V0VXNlcm5hbWUiLCJzZXRUb2tlbiIsInNldEVtYWlsIiwid2luZG93IiwidXBkYXRlUmVhZEhhbmdvdXRzIiwibGVuZ3RoIiwidXBkYXRlZHVucmVhZCIsIm1hcCIsInVwZGF0ZVJlYWRNZXNzc2FnZXMiLCJIYW5nb3V0Q29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiSGFuZ291dHNQcm92aWRlciIsImhhbmRsZU1lc3NhZ2UiLCJ1cGRhdGVkIiwic2F2ZVBlbmRpbmdIYW5nb3V0IiwiaXNCbG9ja2VyIiwic2F2ZUhhbmdvdXQiLCJzYXZlTWVzc2FnZSIsImJsb2NrZXIiLCJEYXRlIiwibm93IiwiZmxvYXQiLCJzZW5kT2ZmbGluZUhhbmdvdXRzIiwib2ZmbGluZUhhbmdvdXRzIiwiZm9yZUVhY2giLCJoIiwic2VuZCIsImNvbW1hbmQiLCJyZW1vdmVIYW5nb3V0RnJvbVVucmVhZCIsImZpbHRlcmVkSGFuZ291dHMiLCJyZW1vdmVJdGVtIiwidXNlSGFuZ291dHMiLCJhdXRoQ29udGV4dCIsInVzZXJzIiwib25SZW1vdmVVbnJlYWQiLCJpZCIsImN1cnJlbnRUYXJnZXQiLCJvbk5hdmlnYXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJvblNlbGVjdEhhbmdvdXQiLCJ0YXJnZXQiLCJvblNlbGVjdFVucmVhZCIsIm9uU2VhcmNoSW5wdXQiLCJvbkZldGNoSGFuZ291dHMiLCJvbk1lc3NhZ2VUZXh0Iiwib25IYW5nb3V0IiwiUGFyc2UiLCJVc2VyIiwicXVlcnkiLCJRdWVyeSIsImVxdWFsVG8iLCJzZWFyY2hSZXN1bHQiLCJtYXBwZWRIYW5vdXRzIiwiYXR0cmlidXRlcyIsIkhhbmdvdXRVc2VyIiwiT2JqZWN0IiwiZXh0ZW5kIiwiY2xpZW50Q29tbWFuZHMiLCJJTlZJVEUiLCJBQ0NFUFQiLCJERUNMSU5FIiwiQkxPQ0siLCJVTkJMT0NLIiwiTUVTU0FHRSIsIk9OTElORSIsInN0YXRlTWFwcGVyIiwic2VuZGVyU3RhdGUiLCJ0YXJnZXRTdGF0ZSIsIlBhcnNlU2VydmVyIiwiYWN0aW9ucyIsInNlbmRIYW5nb3V0Iiwic3Vic0ZpcnN0IiwiY3VycmVudFVzZXIiLCJzdWJzY3JpcHRpb24iLCJzdWJzY3JpYmUiLCJvbiIsIm9iamVjdCIsImNvbnNvbGUiLCJsb2ciLCJIYW5nb3V0IiwiU2VuZGVyVXNlciIsInNlbmRlclF1ZXJ5Iiwic2VuZGVyVXNlciIsImZpcnN0IiwiVGFyZ2V0VXNlciIsInRhcmdldFF1ZXJ5IiwidGFyZ2V0VXNlciIsInNlbmRlciIsInNldCIsInVzZXJpZCIsImFkZFVuaXF1ZSIsInNhdmUiLCJ0YXJnZXRIYW5nb3V0Iiwic2VuZGVySGFuZ291dCIsIlNFQVJDSF9JTlBVVF9DSEFOR0VEIiwiTUVTU0FHRV9SRUNJRVZFRCIsInJlc3BvbnNlIiwib2siLCJqc29uIiwiV2ViU29ja2V0Q29udGFpbmVyIiwic2V0U29ja2V0Iiwic29ja2V0VXJsIiwic29jayIsIldlYlNvY2tldCIsIm9ubWVzc2FnZSIsInNlcnZlck1lc3NhZ2UiLCJtc2ciLCJkYXRhIiwib25vcGVuIiwib25jbG9zZSIsIm9uZXJyb3IiLCJIYW5nb3V0QWRhcHRlciIsIlBSRUFDVF9BUFBfQkFDSyIsIlRoZW1lQ29udGV4dCIsInVzZVRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJzZXRTdGF0ZSIsIk5hdkNvbnRleHQiLCJOYXZQcm92aWRlciIsImRyYXdlck9wZW4iLCJzZXREcmF3ZXJPcGVuIiwiQXBwUHJvdmlkZXJzIiwicHJpbWFyeSIsImJhY2tncm91bmQiLCJjb2xvciIsImZvbnRGYW1pbHkiLCJpcCIsIk5hdkl0ZW0iLCJMaXN0IiwiTGlzdEl0ZW0iLCJ2YWx1ZUNoYW5nZWQiLCJsb2dvdXQiLCJnZXRUb2tlbkZyb21VcmwiLCJyZWNvdmVyTG9jYWxBdXRoU3RhdGUiLCJzdHlsZSIsImdyaWQiLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImp1c3RpZnlJdGVtcyIsInBhZGRpbmciLCJBdXRoRHJhd2VyQ29udGVudCIsImhhbmRsZVJvdXRlIiwicHJldmVudERlZmF1bHQiLCJwYWRkaW5nVG9wIiwiaGVpZ2h0IiwiQXV0aGVkU3RhdGUiLCJoYW5kbGVMb2dPdXQiLCJhbGlnbkl0ZW1zIiwiZmxleERpcmVjdGlvbiIsInVzZXJJY29uIiwicGFkZGluZ1JpZ2h0IiwibWFyZ2luQm90dG9tIiwiVW5BdXRoZWRTdGF0ZSIsIkhhbmdvdXREcmF3ZXJDb250ZW50IiwiY291bnQiLCJ3aWR0aCIsImJhY2tncm91bmRDb2xvciIsInRleHRBbGlnbiIsImJvcmRlclJhZGl1cyIsImp1c3RpZnlDb250ZW50IiwiTWVzc2FnZSIsIlNldHRpbmdzIiwiZmlsbCIsIm9uQ2xpY2siLCJib3JkZXIiLCJPbmxpbmVTdGF0dXMiLCJJc09ubGluZSIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwiSGFuZ291dFRvcE1lbnUiLCJuYXZUb1VucmVhZCIsImRyYXdlciIsImJveFNoYWRvdyIsInBvc2l0aW9uIiwibGVmdCIsInRvcCIsInpJbmRleCIsInVzZU1lZGlhUXVlcnkiLCJzZXRXaWR0aCIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJkZXZpY2UiLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJEcmF3ZXIiLCJwaW5uZWQiLCJzZXRQaW5uZWQiLCJvcGVuIiwiQXBwQmFyIiwidGhlbWUiLCJtaW5IZWlnaHQiLCJNZW51V2hpdGUiLCJNZW51IiwiQXBwTmF2aWdhdGlvbiIsImZsZXgiLCJFIiwidyIsIkMiLCJsIiwiQSIsIkYiLCJOIiwiTSIsIlAiLCJEIiwiSCIsIiQiLCJxIiwiSG9tZSIsIklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIiwiUkVTRVRfVkFMSURBVElPTl9TVEFURSIsIklOUFVUX0JMVVJSRUQiLCJJTlBVVF9GT0NVU0VEIiwiU0VSVkVSX1ZBTElEQVRJT04iLCJDTElFTlRfVkFMSURBVElPTiIsIklOQ19JTlBVVF9DT1VUTiIsIlZBTElEIiwiSU5WQUxJRCIsIklOQUNUSVZFIiwidmFsaWRhdGlvbiIsImZvcm1SZWR1Y2VyIiwidmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0aW9uU3RhdGUiLCJmb3JtU3RhdGUiLCJGb3JtQ29udGV4dCIsInVzZUZvcm1Db250ZXh0IiwiRm9ybVByb3ZpZGVyIiwiRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiIsIlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIlVTRVJOQU1FX1RBS0VOIiwiUkVHSVNURVJFRF9FTUFJTCIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJBQ0NPVU5UX0FMUkVBRFlfRVhJU1RTIiwiSU5WQUxJRF9QQVNTV09SRCIsIklOVkFMSURfRU1BSUwiLCJJTlZBTElEX1VTRVJOQU1FIiwiSU5WQUxJRF9FTVBUWV9TVFJJTkciLCJJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMIiwiUEFTU1dPUkRTX0RPX05PVF9NQVRDSCIsInBhc3N3b3JkUmVnZXgiLCJlbWFpbFJlZ2V4IiwidXNlcm5hbWVSZWdleCIsInZhbGlkYXRlRW1haWxDb25zdHJhaW50IiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRpb25UeXBlcyIsInZhbGlkYXRpb25NZXNzYWdlcyIsImlzQ2xpZW50VmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCIsInBhc3N3b3JkQ29uc3RyYWludCIsInZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50IiwidXNlcm5hbWVDb25zdHJhaW50IiwidmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUiLCJ2YWxpZGF0ZUVtcHR5U3RyaW5nIiwidmFsaWRhdGVQYXNzd29yZE1hdGNoIiwiYXV0aCIsImFjY291bnRBbHJlYWR5RXhpdHMiLCJjcmVkZW50aWFsSW52YWxpZCIsInVzZXJuYW1lSXNUYWtlbiIsImVtYWlsSXNSZWdpc3RlcmVkIiwidXNlcm5hbWVJbnZhbGlkIiwicGFzc3dvcmRJbnZhbGlkIiwiZW1haWxJbnZhbGlkIiwiZW1haWxJc05vdFJlZ2lzdGVyZWQiLCJlbXB0eVN0cmluZ05vdFZhbGlkIiwiZW1haWxvcnVzZXJuYW1lTm90VmFsaWQiLCJ1c2VybmFtZUlzTm90UmVnaXN0ZXJlZCIsInBhc3N3b3JkRG9Ob3RNYXRjaCIsInRva2VuRXhwaXJlZCIsInNlcnZlclZhbGlkYXRpb25SYW5nZSIsInN0YXR1cyIsImNsaWVudFZhbGlkYXRpb24iLCJjb25zdFZhbFR5cGVzIiwidmFsaWRhdGlvbnMiLCJyZXNldElucHV0VmFsaWRhdGlvblN0YXRlIiwic2VydmVyVmFsaWRhdGlvbiIsImh0dHBTdGF0dXMiLCJ2YWxpZGF0aW9uU3RhdGVzIiwiaW5pdGlhbGl6ZSIsInNlcnZlclVSTCIsInNpZ25VcCIsImZvcm1EaXNwYXRjaCIsImdldCIsImhhbmdvdXRVc2VyIiwiY29kZSIsImxvZ2luIiwibG9nSW4iLCJ0aGVuIiwiY2F0Y2giLCJmb3Jnb3RQYXNzd29yZCIsInJlcXVlc3RQYXNzd29yZFJlc2V0IiwicmVzdWx0IiwidXNlUGFyc2VBdXRoIiwic2lnbnVwIiwiY2hhbmdlUGFzc3dvcmQiLCJMb2dpbiIsImxhenkiLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwiUHJvZmlsZSIsIkF1dGhGZWVkYmFjayIsIlBhcnNlQXV0aGVudGljYXRpb24iLCJTdXNwZW5zZSIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYnRvYSIsIm1ldGhvZCIsImVycm9ycyIsImJvZHkiLCJDb250ZW50VHlwZSIsIkFjY2VwdCIsInVzZU5vZGVBdXRoIiwiTm9kZUF1dGhlbnRpY2F0aW9uIiwiSGFuZ291dHMiLCJBcHBSb3V0ZXMiLCJBcHAiLCJyZW5kZXIiLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxPQUFPLEdBQUc7QUFDZCxFQUFFLFlBQVksRUFBRSxpQkFBaUIsSUFBSSxJQUFJO0FBQ3pDLEVBQUUsUUFBUSxFQUFFLFFBQVEsSUFBSSxJQUFJLElBQUksVUFBVSxJQUFJLE1BQU07QUFDcEQsRUFBRSxJQUFJO0FBQ04sSUFBSSxZQUFZLElBQUksSUFBSTtBQUN4QixJQUFJLE1BQU0sSUFBSSxJQUFJO0FBQ2xCLElBQUksQ0FBQyxXQUFXO0FBQ2hCLE1BQU0sSUFBSTtBQUNWLFFBQVEsSUFBSSxJQUFJLEdBQUU7QUFDbEIsUUFBUSxPQUFPLElBQUk7QUFDbkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsT0FBTyxLQUFLO0FBQ3BCLE9BQU87QUFDUCxLQUFLLEdBQUc7QUFDUixFQUFFLFFBQVEsRUFBRSxVQUFVLElBQUksSUFBSTtBQUM5QixFQUFFLFdBQVcsRUFBRSxhQUFhLElBQUksSUFBSTtBQUNwQyxFQUFDO0FBQ0Q7QUFDQSxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7QUFDekIsRUFBRSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDckQsQ0FBQztBQUNEO0FBQ0EsSUFBSSxPQUFPLENB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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBeUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXVHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNWLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxF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QUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSUMsR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPRCxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRUEsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0UsQ0FBQyxDQUFDLENBQW9ULElBQUlDLEdBQUMsQ0FBQ3JaLENBQUMsQ0FBQyxHQUFHLENBQStLQSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ3FaLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUksSUFBaVJDLEdBQUMsQ0FBQ3RaLENBQUMsQ0FBQyxJQUFJLFNBQVN1WixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNOLEdBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUNNLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBT3BaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDSixDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDc1osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUYsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxHQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ25aLENBQUMsQ0FBQ2daLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSUssR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJTCxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ3pMLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ3lMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQW9lLElBQUlDLEdBQUMsQ0FBQyxrT0FBa08sQ0FBQ04sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsSUFBSU8sR0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUE2TSxJQUFJLENBQUMsQ0FBQzNaLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk0WixHQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUM3WixDQUFDLENBQUMsS0FBSyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzJaLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUdDLEdBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLEdBQUc1TCxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDMEwsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQSxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxTQUFT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
