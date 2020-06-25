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

const Login = L(() => import('./Login-4ba6ca1d.js'));
const ChangePassword = L(() => import('./ChangePassword-849c1f14.js'));
const ForgotPassword = L(() => import('./ForgotPassword-0154a86b.js'));
const Signup = L(() => import('./Signup-5bfcccae.js'));
const Profile = L(() => import('./Profile-cc7edbd1.js'));
const AuthFeedback = L(() => import('./AuthFeedback-a664a4f0.js'));
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

const Hangouts = L(() => import('./index-ecb22457.js'));
const Group = L(() => import('./group-086168cd.js'));
function AppRoutes() {
  return h("div", {
    style: {
      height: '100%'
    }
  }, h(AppRoute, {
    path: "/auth"
  }, h(FormProvider, null, h(ParseAuthentication, null))), h(AppRoute, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYTk4MzczMzguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3JlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9zYXZlUmVjaWV2ZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0TWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlV2ViU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvTmF2UHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2NvbXBhdC9kaXN0L2NvbXBhdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZJdGVtLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2ljb25zL3VzZXI2NC5wbmciLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvQXV0aERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9uYXYvSGFuZ291dERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvTWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9pY29ucy9TZXR0xLFuZ3MuanMiLCIuLi8uLi8uLi9jbGllbnQvaWNvbnMvb25saW5lU3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbmF2L0hhbmdvdXRUb3BNZW51LmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9zdHlsZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvRHJhd2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9BcHBCYXIuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L2ljb25zL01lbnVXaGl0ZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvTWVudS5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcE5hdmlnYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9Ib21lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uU3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybVJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9mb3JtLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uUmVnZXguanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9jb25zdHJhaW50VmFsaWRhdG9ycy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2h0dHAtc3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9wYXJzZS9hdXRoLWFjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvcGFyc2UvdXNlUGFyc2VBdXRoLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvUGFyc2VBdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcFJvdXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcC5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcFByb3ZpZGVycy5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBzdXBwb3J0ID0ge1xuICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICBibG9iOlxuICAgICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmXG4gICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbn1cblxuZnVuY3Rpb24gaXNEYXRhVmlldyhvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG59XG5cbmlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICBdXG5cbiAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICBBcnJheUJ1ZmZlci5pc1ZpZXcgfHxcbiAgICBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gIH1cbiAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgfVxuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG5mdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvclxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpdGVyYXRvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gIHRoaXMubWFwID0ge31cblxuICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICB9LCB0aGlzKVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSArICcsICcgKyB2YWx1ZSA6IHZhbHVlXG59XG5cbkhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2gobmFtZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaXRlbXMucHVzaCh2YWx1ZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5pZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xufVxuXG5mdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICB9XG4gIGJvZHkuYm9keVVzZWQgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICB9XG4gICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICB9XG4gIHJldHVybiBjaGFycy5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgaWYgKGJ1Zi5zbGljZSkge1xuICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgfSBlbHNlIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gIH1cbn1cblxuZnVuY3Rpb24gQm9keSgpIHtcbiAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5ID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbnZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICByZXR1cm4gbWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEgPyB1cGNhc2VkIDogbWV0aG9kXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICB9XG4gICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgdGhpcy5zaWduYWwgPSBpbnB1dC5zaWduYWxcbiAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgfVxuXG4gIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJ1xuICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIH1cbiAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICB0aGlzLnNpZ25hbCA9IG9wdGlvbnMuc2lnbmFsIHx8IHRoaXMuc2lnbmFsXG4gIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgfVxuICB0aGlzLl9pbml0Qm9keShib2R5KVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywge2JvZHk6IHRoaXMuX2JvZHlJbml0fSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICBib2R5XG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnJicpXG4gICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gIHJldHVybiBmb3JtXG59XG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMwI3NlY3Rpb24tMy4yXG4gIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGhlYWRlcnNcbn1cblxuQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxufVxuXG5Cb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgdXJsOiB0aGlzLnVybFxuICB9KVxufVxuXG5SZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cblJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxufVxuXG5leHBvcnQgdmFyIERPTUV4Y2VwdGlvbiA9IHNlbGYuRE9NRXhjZXB0aW9uXG50cnkge1xuICBuZXcgRE9NRXhjZXB0aW9uKClcbn0gY2F0Y2ggKGVycikge1xuICBET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB2YXIgZXJyb3IgPSBFcnJvcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFja1xuICB9XG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERPTUV4Y2VwdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwgJiYgcmVxdWVzdC5zaWduYWwuYWJvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICB9XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICB9XG5cbiAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgfSlcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCkge1xuICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBET05FIChzdWNjZXNzIG9yIGZhaWx1cmUpXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICB9KVxufVxuXG5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcblxuaWYgKCFzZWxmLmZldGNoKSB7XG4gIHNlbGYuZmV0Y2ggPSBmZXRjaFxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG59XG4iLCJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xyXG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcclxuICAgIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByb3V0ZTogYWN0aW9uLnJvdXRlLGZlYXR1cmVSb3V0ZTogYWN0aW9uLmZlYXR1cmVSb3V0ZSB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVJlZHVjZXIsdXNlTWVtbyx1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQge3JlZHVjZXJ9IGZyb20gJy4vcmVkdWNlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuY29uc3QgQXBwUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuIGZ1bmN0aW9uIHVzZUFwcFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBSb3V0ZUNvbnRleHQpO1xyXG4gIFxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBcHBSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge2ZlYXR1cmVSb3V0ZX09c3RhdGVcclxuXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcFJvdXRlQ29udGV4dCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uQXBwUm91dGUoe3JvdXRlLGZlYXR1cmVSb3V0ZX0pe1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge29uQXBwUm91dGV9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7cm91dGV9PXN0YXRlXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPSB7XHJcblxyXG4gICAgTUVTU0FHRV9URVhUX0NIQU5HRUQ6J01FU1NBR0VfVEVYVF9DSEFOR0VEJyxcclxuXHJcbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXHJcbiAgICBMT0FERURfTUVTU0FHRVM6ICdMT0FERURfTUVTU0FHRVMnLFxyXG4gXHJcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXHJcbiAgICBDTEVBUkVEX0hBTkdPVVQ6J0NMRUFSRURfSEFOR09VVCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcclxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxyXG4gICAgXHJcbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcclxuXHJcbiAgICBTT0NLRVRfTUVTU0FHRV9SRUNJRVZFRDonU09DS0VUX01FU1NBR0VfUkVDSUVWRUQnLFxyXG5cclxuICAgIFxyXG4gICAgTUVTU0FHRVNfVVBEQVRFRDonTUVTU0FHRVNfVVBEQVRFRCcsXHJcbiAgICBIQU5HT1VUU19VUERBVEVEOidIQU5HT1VUU19VUERBVEVEJyxcclxuICAgIEhBTkdPVVRfVVBEQVRFRDonSEFOR09VVF9VUERBVEVEJyxcclxuICAgIFVOUkVBRF9IQU5HT1VUU19VUERBVEVEOidVTlJFQURfSEFOR09VVFNfVVBEQVRFRCcsXHJcbiAgICAvL1NPQ0tFVFxyXG5cclxuICAgIENPTk5FQ1RJTkc6J0NPTk5FQ1RJTkcnLFxyXG4gICAgT1BFTjonT1BFTicsXHJcbiAgICBDTE9TSU5HOidDTE9TSU5HJyxcclxuICAgIENMT1NFRDonQ0xPU0VEJyxcclxuICAgIFNPQ0tFVF9SRUFEWTonU09DS0VUX1JFQURZJyxcclxuICAgIFNPQ0tFVF9FUlJPUjonU09DS0VUX0VSUk9SJ1xyXG5cclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgaGFuZ291dHM6IG51bGwsXHJcbiAgaGFuZ291dDogbnVsbCxcclxuICB1bnJlYWRoYW5nb3V0czogbnVsbCxcclxuICBtZXNzYWdlczogbnVsbCxcclxuICBzZWFyY2g6ICcnLFxyXG4gIHVzZXI6IFtdLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIG1lc3NhZ2VUZXh0OiAnJyxcclxuICBvbmxpbmU6IGZhbHNlLFxyXG4gIHNvY2tldDogbnVsbCxcclxuICByZWFkeVN0YXRlOiAwLFxyXG4gIHNvY2tldE1lc3NhZ2U6IG51bGwsXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMRUFSRURfSEFOR09VVDpcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsaGFuZ291dDpudWxsfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRDpcclxuICAgICBcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHVucmVhZGhhbmdvdXRzOiBhY3Rpb24udW5yZWFkaGFuZ291dHMgfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQ6XHJcblxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRDpcclxuZGVidWdnZXJcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX01FU1NBR0VfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzb2NrZXRNZXNzYWdlOiBhY3Rpb24uc29ja2V0TWVzc2FnZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogYWN0aW9uLm1lc3NhZ2VzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5maWx0ZXIoKGcpID0+XHJcbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcclxuICAgICAgICApLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcclxuICAgICAgfTtcclxuICAgIC8vU09DS0VUXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ09OTkVDVElORzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuT1BFTjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDEgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0lORzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDIgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfUkVBRFk6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzb2NrZXQ6IGFjdGlvbi5zb2NrZXQgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHsgcmVkdWNlclVucmVhZGhhbmdvdXRzIH0gZnJvbSAnLi9yZWR1Y2VVbnJlYWRoYW5nb3V0cyc7XHJcbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcclxufVxyXG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCB1c2VybmFtZSB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SGFuZ291dCh7ZGlzcGF0Y2h9KXtcclxuICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5DTEVBUkVEX0hBTkdPVVR9KVxyXG59IFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVucmVhZCh7ZGlzcGF0Y2gsdXNlcm5hbWV9KXtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xyXG59XHJcblxyXG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcclxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XHJcbn1cclxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcclxufVxyXG5cclxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAvaGFuZ291dHMvZmluZD9zZWFyY2g9JHtzZWFyY2h9JnVzZXJuYW1lPSR7dXNlcm5hbWV9YFxyXG4gICAgKTtcclxuICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCwgdGV4dCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9DT01NQU5EX1NUQVJURUQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkTWVzc2FnZXMoeyBoYW5nb3V0LCBkaXNwYXRjaCx1c2VybmFtZSB9KSB7XHJcbiAgXHJcbiAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LSR7aGFuZ291dC51c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUywgbWVzc2FnZXMgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VVbnJlYWQoeyB1bnJlYWRoYW5nb3V0cywgZGlzcGF0Y2ggfSkge1xyXG4gIC8vIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuLCB1bnJlYWRoYW5nb3V0czogcmVkdWNlclVucmVhZGhhbmdvdXRzKHsgdW5yZWFkaGFuZ291dHMgfSkgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vL0VORCBzYXZlSW52aXRlclxyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgLy8gc2V0IHJlYWQgdG8gdHJ1ZSBvbiB1bnJlYWQgaGFuZ291dHNcclxuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gIGNvbnN0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gIGRlYnVnZ2VyXHJcbiAgaWYgKHVucmVhZGhhbmdvdXRzJiYgdW5yZWFkaGFuZ291dHMubGVuZ3RoPjApIHtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgbGV0IHVwZGF0ZWR1bnJlYWQgPSB1bnJlYWRoYW5nb3V0cy5tYXAodSA9PiB7XHJcbiAgICAgIGlmICh1LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHJldHVybiB7IC4uLnUsIHJlYWQ6IHRydWUgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbmRlYnVnZ2VyXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZHVucmVhZCkpO1xyXG5kaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCx1bnJlYWRoYW5nb3V0czp1cGRhdGVkdW5yZWFkfSlcclxuICAgIGRlYnVnZ2VyO1xyXG4gIH1cclxuZGVidWdnZXI7XHJcbiAgLy8gc2V0IGhhbmdvdXQgdG8gcmVhZFxyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7IC4uLmhhbmdvdXQsIHJlYWQ6IHRydWUgfSk7XHJcbiAgLy9cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcblxyXG4gIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgdXBkYXRlUmVhZE1lc3NzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlYWRNZXNzc2FnZXMoeyBoYW5nb3V0LCBuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgY29uc3QgdXBkYXRlZE1lc3NhZ2VzID0gbWVzc2FnZXMubWFwKChtKSA9PiB7XHJcbiAgICByZXR1cm4geyAuLi5tLCByZWFkOiB0cnVlIH07XHJcbiAgfSk7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG59XHJcbiIsIlxyXG4gIGV4cG9ydCBjb25zdCBoYW5nb3V0U3RhdGVzID0ge1xyXG4gICAgSU5WSVRFUjogJ0lOVklURVInLFxyXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXHJcbiAgICBERUNMSU5FUjogJ0RFQ0xJTkVSJyxcclxuICAgIEJMT0NLRVI6ICdCTE9DS0VSJyxcclxuICAgIFVOQkxPQ0tFUjogJ1VOQkxPQ0tFUicsXHJcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInLFxyXG4gICAvLyBhY2tub3dsZWdlbWVudFxyXG4gICAgSU5WSVRFRDogJ0lOVklURUQnLFxyXG4gICAgQUNDRVBURUQ6ICdBQ0NFUFRFRCcsXHJcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcclxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcclxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXHJcbiAgICBNRVNTQUdFRDogJ01FU1NBR0VEJyxcclxuICB9OyIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IG5hbWUsIGRpc3BhdGNoLCBoYW5nb3V0LCBvZmZsaW5lLCBvbkFwcFJvdXRlIH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlLCB0aW1lc3RhbXAgfSA9IGhhbmdvdXQ7XHJcbmRlYnVnZ2VyO1xyXG4gIGNvbnN0IGRlbGl2ZXJlZEhhbmdvdXQgPSB7IC4uLmhhbmdvdXQsIGRlbGl2ZXJlZDogdHJ1ZSB9O1xyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRIYW5nb3V0KTtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQsIGhhbmdvdXQ6IGRlbGl2ZXJlZEhhbmdvdXQgfSk7XHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuXHJcbiAgICB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQsaGFuZ291dCB9KTtcclxuICB9XHJcbiAgaWYoaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJyl7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHVwZGF0ZUJvY2tlZFN0YXRlKHtkaXNwYXRjaCxuYW1lLGRlbGl2ZXJlZEhhbmdvdXR9KVxyXG4gIH1cclxuICBpZiAob2ZmbGluZSkge1xyXG4gICAgLy9yZW1vdmUgb2ZmbGluZSBoYW5nb3V0XHJcbiAgICBjb25zdCBvZmZsaW5lSGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xyXG4gICAgY29uc3Qgb2ZmbGluZWhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xyXG5cclxuICAgIGlmIChvZmZsaW5laGFuZ291dHMpIHtcclxuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gb2ZmbGluZWhhbmdvdXRzLmZpbmRJbmRleChcclxuICAgICAgICAobykgPT4gby50aW1lc3RhbXAgPT09IHRpbWVzdGFtcFxyXG4gICAgICApO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICBvZmZsaW5lSGFuZ291dEtleSxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeShvZmZsaW5laGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSkpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoaGFuZ291dC5zdGF0ZSAhPT0gJ01FU1NBTkdFUicpIHtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGRlbGl2ZXJlZEhhbmdvdXQ7XHJcblxyXG4gIGNvbnN0IGRlbGl2ZXJlZE1lc3NhZ2UgPSB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lOiBuYW1lLCBkZWxpdmVyZWQ6IHRydWUgfVxyXG5cclxuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IG1lc3NhZ2VzLmZpbmRJbmRleChcclxuICAgIChtKSA9PiBtLnRpbWVzdGFtcCA9PT0gbWVzc2FnZS50aW1lc3RhbXBcclxuICApO1xyXG4gIG1lc3NhZ2VzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGRlbGl2ZXJlZE1lc3NhZ2UpO1xyXG4gIFxyXG5cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xyXG5cclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQm9ja2VkU3RhdGUoe2Rpc3BhdGNoLGRlbGl2ZXJlZEhhbmdvdXQsbmFtZX0pe1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGRlbGl2ZXJlZEhhbmdvdXQ7XHJcbiAgY29uc3QgYmxvY2tlZE1lc3NhZ2UgPSB7IHRpbWVzdGFtcDpkZWxpdmVyZWRIYW5nb3V0LnRpbWVzdGFtcCwgdGV4dDogJ3lvdSBibG9ja2VkIHRoaXMgdXNlcicsIHVzZXJuYW1lOiBuYW1lLCB0eXBlOiAnYmxvY2tlZCcgfVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSggWy4uLm1lc3NhZ2VzLGJsb2NrZWRNZXNzYWdlXSkpO1xyXG5cclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOlsuLi5tZXNzYWdlcyxibG9ja2VkTWVzc2FnZV0gfSk7XHJcbn0iLCJpbXBvcnQgeyB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0IH0gZnJvbSAnLi91cGRhdGVEZWxpdmVyZWRIYW5nb3V0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVJbnZpdGVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY2NlcHRlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURlY2xpbmVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQmxvY2tlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5kZWJ1Z2dlcjtcclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVVuYmxvdmtlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHtoYW5nb3V0U3RhdGVzfSAgZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMnXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRIYW5nb3V0KHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWQsXHJcbn0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG4gZGVidWdnZXI7XHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuXHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuXHJcbiBcclxuICBpZiAoaGFuZ291dHMpIHtcclxuICAgIGNvbnN0IGhhbmdvdXRFeGlzdCA9IGhhbmdvdXRzLmZpbmQoaGc9PiBoZy51c2VybmFtZT09PXVzZXJuYW1lKVxyXG4gICAgaWYoaGFuZ291dEV4aXN0KXtcclxuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7XHJcbiAgICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xyXG4gICAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgICB9Ly9lbmQgb2YgaGFuZ291dCBleGlzdFxyXG5lbHNle1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFsuLi5oYW5nb3V0cyxcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFsuLi5oYW5nb3V0cyxcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcbn1cclxuXHJcbn1lbHNle1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcblxyXG59XHJcblxyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCxcclxuICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICB9KTtcclxuICAgIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xyXG4gICAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtZXNzYWdlKSB7XHJcbiAgICBzYXZlUmVjaWV2ZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0IH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHVucmVhZCkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBzd2l0Y2goaGFuZ291dC5zdGF0ZSl7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFUjpcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XHJcbiAgICAgICAgc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuIFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRNZXNzYWdlKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbn0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBudWxsO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IHRydWUgfV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFt7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xyXG4gICAgfVxyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuICBcclxuICAvL3VwZGF0ZSB1bnJlYWQgaGFuZ291dHNcclxuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuICBsZXQgdXBkYXRlZHVucmVhZHMgPSBudWxsO1xyXG4gIGlmICh1bnJlYWRoYW5nb3V0cykge1xyXG4gICAgdXBkYXRlZHVucmVhZHMgPSBbLi4udW5yZWFkaGFuZ291dHMsIHsuLi5oYW5nb3V0LHJlYWQ6ZmFsc2V9XTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZHVucmVhZHMgPSBbey4uLmhhbmdvdXQscmVhZDpmYWxzZX1dO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZHVucmVhZHMpKTtcclxuXHJcbiAgZGlzcGF0Y2goe1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICB1bnJlYWRoYW5nb3V0czogdXBkYXRlZHVucmVhZHMsXHJcbiAgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgc2F2ZVJlY2lldmVkSGFuZ291dCB9IGZyb20gJy4vc2F2ZVJlY2lldmVkSGFuZ291dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuXHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWNjZXB0ZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiAgXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FuZ2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkIH0pIHtcclxuXHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn0gLy8gRU5EIHNhdmVNZXNzYW5nZXJcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlVW5ibG9ja2VyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBoYW5nb3V0U3RhdGVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMnO1xyXG5pbXBvcnQge1xyXG4gIHNhdmVJbnZpdGVkLFxyXG4gIHNhdmVVbmJsb3ZrZWQsXHJcbiAgc2F2ZURlY2xpbmVkLFxyXG4gIHNhdmVCbG9ja2VkLFxyXG4gIHNhdmVBY2NlcHRlZCxcclxuICBzYXZlTWVzc2FnZWQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucyc7XHJcbmltcG9ydCB7XHJcbiAgc2F2ZUFjY2VwdGVyLFxyXG4gIHNhdmVCbG9ja2VyLFxyXG4gIHNhdmVEZWNsaW5lcixcclxuICBzYXZlSW52aXRlcixcclxuICBzYXZlTWVzc2FuZ2VyLFxyXG4gIHNhdmVVbmJsb2NrZXIsXHJcbn0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldE1lc3NhZ2Uoe1xyXG4gIHNvY2tldE1lc3NhZ2UsXHJcbiAgdXNlcm5hbWUsXHJcbiAgZGlzcGF0Y2gsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbn0pIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dCxvZmZsaW5lIH0pIHtcclxuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFRDpcclxuICAgICAgICBzYXZlSW52aXRlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VEOlxyXG4gICAgICAgIHNhdmVVbmJsb3ZrZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxyXG4gICAgICAgIHNhdmVEZWNsaW5lZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRDpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlQmxvY2tlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XHJcbiAgICAgICAgc2F2ZUFjY2VwdGVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQ6XHJcbiAgICAgICBcclxuICAgICAgICBzYXZlTWVzc2FnZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0LCB1bnJlYWQgfSkge1xyXG4gICAgXHJcbiAgICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxyXG4gICAgICAgIHNhdmVBY2NlcHRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VSOlxyXG4gICAgICAgXHJcbiAgICAgICAgc2F2ZUJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVEZWNsaW5lcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgICBzYXZlSW52aXRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSOlxyXG4gICAgICAgIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFUjpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlVW5ibG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzIH0pIHtcclxuICAgIGhhbmdvdXRzLmZvckVhY2goKGhhbmdvdXQpID0+IHtcclxuICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc29ja2V0TWVzc2FnZSAgJiYgdXNlcm5hbWUpIHtcclxuICAgIFxyXG4gICAgICBzd2l0Y2ggKHNvY2tldE1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ0FDS0hPV0xFREdFTUVOVCc6XHJcblxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogc29ja2V0TWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6ZmFsc2UgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdIQU5HT1VUJzpcclxuZGVidWdnZXI7XHJcbiAgICAgICAgICBpZihmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT1zb2NrZXRNZXNzYWdlLmhhbmdvdXQudXNlcm5hbWUpe1xyXG4gICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsdW5yZWFkOmZhbHNlIH0pO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnVU5SRUFEX0hBTkdPVVRTJzpcclxuICAgXHJcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzOiBzb2NrZXRNZXNzYWdlLmhhbmdvdXRzIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnT0ZGTElORV9BQ0tOJzpcclxuICAgICAgIFxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogc29ja2V0TWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6dHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFtzb2NrZXRNZXNzYWdlLCB1c2VybmFtZV0pO1xyXG5cclxuICByZXR1cm4ge307XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTFVFX0NIQU5HRUQ6ICdWQUxVRV9DSEFOR0VEJyxcclxuICBMT0dJTl9TVEFSVEVEOiAnTE9HSU5fU1RBUlRFRCcsXHJcbiAgTE9HSU5fU1VDQ0VTUzogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gIExPR0lOX0ZBSUxFRDogJ0xPR0lOX0ZBSUxFRCcsXHJcblxyXG4gIExPR09VVF9TVEFSVEVEOiAnTE9HT1VUX1NUQVJURUQnLFxyXG4gIExPR09VVF9GQUlMRUQ6ICdMT0dPVVRfRkFJTEVEJyxcclxuICBMT0dPVVRfU1VDQ0VTUzogJ0xPR09VVF9TVUNDRVNTJyxcclxuXHJcbiAgU0lHTlVQX1NUQVJURUQ6ICdTSUdOVVBfU1RBUlRFRCcsXHJcbiAgU0lHTlVQX1NVQ0NFU1M6ICdTSUdOVVBfU1VDQ0VTUycsXHJcbiAgU0lHTlVQX0ZBSUxFRDogJ1NJR05VUF9GQUlMRUQnLFxyXG5cclxuICBDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDogJ0NIQU5HRV9QQVNTV09SRF9TVEFSVEVEJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzogJ0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfRkFJTEVEOiAnQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCcsXHJcblxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCcsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEJyxcclxuICBHT1RfVE9LRU5fRlJPTV9VUkw6ICdHT1RfVE9LRU5fRlJPTV9VUkwnLFxyXG5cclxuICBSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6ICdSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUnLFxyXG59O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgZW1haWw6ICcnLFxyXG4gIHBhc3N3b3JkOiAnJyxcclxuICBzdWNjZXNzOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICB1c2VybmFtZTogJycsXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgY29uZmlybTogJycsXHJcbiAgY3VycmVudDogJycsXHJcbiAgZW1haWxvcnVzZXJuYW1lOiAnJyxcclxuICB0b2tlbjogbnVsbCxcclxuICBpc0xvZ2dlZEluOiBmYWxzZSxcclxuICBpc1Bhc3N3b3JkQ2hhbmdlZDogZmFsc2UsXHJcbiAgYXV0aEZlZWRiYWNrOiBudWxsLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XHJcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBbYWN0aW9uLnBheWxvYWQucHJvcE5hbWVdOiBhY3Rpb24ucGF5bG9hZC52YWx1ZSxcclxuICAgICAgfTtcclxuICBcclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZSwgJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi5lbWFpbCxcclxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXIudXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi51c2VyLmVtYWlsLFxyXG4gICAgICAgIHRva2VuOmFjdGlvbi51c2VyLnRva2VuXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBBdXRoUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbYXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgaWYgKGF1dGhSb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmsocHJvcHMpIHtcclxuICBjb25zdCB7IHRvLCBpZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRSb3V0ZSh0byk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8YVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgICAgaHJlZj17dG99XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxyXG4gICAgICBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnIH19XHJcbiAgICAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhSb3V0ZUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEF1dGhSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGluaXRpYWxSb3V0ZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZVN0YXRlKGluaXRpYWxSb3V0ZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdLCBbYXV0aFJvdXRlXSk7XHJcblxyXG4gIHJldHVybiA8QXV0aFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vYXV0aFJlZHVjZXInO1xyXG5pbXBvcnQgeyBBdXRoUm91dGVQcm92aWRlciB9IGZyb20gJy4vYXV0aC1yb3V0ZS1jb250ZXh0JztcclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9PlxyXG4gICAgICA8QXV0aFJvdXRlUHJvdmlkZXI+e2NoaWxkcmVufTwvQXV0aFJvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZUF1dGhDb250ZXh0LCBBdXRoUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlV2ViU29ja2V0KHsgc29ja2V0VXJsLCB1c2VybmFtZSwgZGlzcGF0Y2gsdG9rZW4gfSkge1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodG9rZW4pIHtcclxuICAgICAgZGVidWdnZXJcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHNvY2sgPSBuZXcgV2ViU29ja2V0KGAke3NvY2tldFVybH0vP3VzZXJuYW1lPSR7dXNlcm5hbWV9YCk7XHJcbiAgICAgIHNvY2sub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX01FU1NBR0VfUkVDSUVWRUQsIHNvY2tldE1lc3NhZ2U6IG1zZyB9KTtcclxuICAgXHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2sub25vcGVuID0gKCkgPT4ge1xyXG4gICAgIFxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT1BFTiB9KTtcclxuICAgICAgfTtcclxuICAgICAgc29jay5vbmNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xPU0VEIH0pO1xyXG4gICAgICB9O1xyXG4gICAgICBzb2NrLm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUiwgZXJyb3IgfSk7XHJcbiAgICAgIH07XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZLCBzb2NrZXQ6IHNvY2sgfSk7XHJcbiAgICB9XHJcbiAgfSwgW3Rva2VuXSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7XHJcbiAgdXNlQ29udGV4dCxcclxuICB1c2VTdGF0ZSxcclxuICB1c2VNZW1vLFxyXG4gIHVzZVJlZHVjZXIsXHJcbiAgdXNlRWZmZWN0LFxyXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XHJcblxyXG5pbXBvcnQge1xyXG4gIGxvYWRIYW5nb3V0cyxcclxuICBmaWx0ZXJIYW5nb3V0cyxcclxuICBmZXRjaEhhbmdvdXQsXHJcbiAgbG9hZE1lc3NhZ2VzLFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVwZGF0ZVJlYWRIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy91cGRhdGVSZWFkSGFuZ291dHMnO1xyXG5pbXBvcnQgeyB1c2VTb2NrZXRNZXNzYWdlIH0gZnJvbSAnLi91c2VTb2NrZXRNZXNzYWdlJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZVdlYlNvY2tldCB9IGZyb20gJy4vdXNlV2ViU29ja2V0JztcclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgc29ja2V0VXJsIH0gPSBwcm9wcztcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgeyB1c2VybmFtZSx0b2tlbiB9ID0gYXV0aENvbnRleHQuc3RhdGU7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgeyBoYW5nb3V0LCBzb2NrZXRNZXNzYWdlIH0gPSBzdGF0ZTtcclxuICBjb25zdCB3ZWJzb2NrZXRIYW5kbGVyID0gdXNlV2ViU29ja2V0KHsgdXNlcm5hbWUsIGRpc3BhdGNoLCBzb2NrZXRVcmwsdG9rZW4gfSk7XHJcbiAgY29uc3QgaGFuZGxlVXNlU29ja2V0TWVzc2FnZSA9IHVzZVNvY2tldE1lc3NhZ2Uoe1xyXG4gICAgdXNlcm5hbWUsXHJcbiAgIFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgICBzb2NrZXRNZXNzYWdlLFxyXG4gICAgZm9jdXNlZEhhbmdvdXQ6IGhhbmdvdXQsXHJcbiAgfSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3VzZXJuYW1lXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSAmJiB0b2tlbikge1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGhhbmdvdXQgJiYgdXNlcm5hbWUpIHtcclxuICBcclxuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgbG9hZE1lc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xyXG5cclxuICAgICAgLy9zYXZlIGhhbmdvdXQgdG8gbG9jYWxTdG9yYWdlXHJcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgaWYgKCFoYW5nb3V0cykge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChcclxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoaGFuZ291dEV4aXN0KSB7XHJcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghaGFuZ291dC5yZWFkKSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZTogdXNlcm5hbWUgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbaGFuZ291dCwgdXNlcm5hbWVdKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUaGVtZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggVGhlbWVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgXHJcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRTdGF0ZSk7XHJcblxyXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0LCBUaGVtZVByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBOYXZDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlTmF2Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChOYXZDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZU5hdkNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggTmF2UHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTmF2aWdhdGlvbigpIHtcclxuICBjb25zdCBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0gPSB1c2VOYXZDb250ZXh0KCk7XHJcbiAgICBmdW5jdGlvbiB0b2dnbGVEcmF3ZXIoKXtcclxuICAgICAgICBzZXREcmF3ZXJPcGVuKHByZXY9PiFwcmV2KVxyXG4gICAgfVxyXG4gIHJldHVybiB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2UHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0sIFtkcmF3ZXJPcGVuXSk7XHJcbiAgcmV0dXJuIDxOYXZDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnR7dXNlU3RhdGUgYXMgbix1c2VSZWR1Y2VyIGFzIHQsdXNlRWZmZWN0IGFzIGUsdXNlTGF5b3V0RWZmZWN0IGFzIHIsdXNlUmVmIGFzIG8sdXNlSW1wZXJhdGl2ZUhhbmRsZSBhcyB1LHVzZU1lbW8gYXMgaSx1c2VDYWxsYmFjayBhcyBmLHVzZUNvbnRleHQgYXMgYyx1c2VEZWJ1Z1ZhbHVlIGFzIGF9ZnJvbVwicHJlYWN0L2hvb2tzXCI7ZXhwb3J0KmZyb21cInByZWFjdC9ob29rc1wiO2ltcG9ydHtDb21wb25lbnQgYXMgbCxjcmVhdGVFbGVtZW50IGFzIHMsb3B0aW9ucyBhcyB2LHRvQ2hpbGRBcnJheSBhcyBoLGh5ZHJhdGUgYXMgcCxyZW5kZXIgYXMgZCxfdW5tb3VudCBhcyBtLGNsb25lRWxlbWVudCBhcyB5LGNyZWF0ZVJlZiBhcyBiLGNyZWF0ZUNvbnRleHQgYXMgZyxGcmFnbWVudCBhcyB4fWZyb21cInByZWFjdFwiO2V4cG9ydHtjcmVhdGVFbGVtZW50LGNyZWF0ZUNvbnRleHQsY3JlYXRlUmVmLEZyYWdtZW50LENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtmdW5jdGlvbiBFKG4sdCl7Zm9yKHZhciBlIGluIHQpbltlXT10W2VdO3JldHVybiBufWZ1bmN0aW9uIHcobix0KXtmb3IodmFyIGUgaW4gbilpZihcIl9fc291cmNlXCIhPT1lJiYhKGUgaW4gdCkpcmV0dXJuITA7Zm9yKHZhciByIGluIHQpaWYoXCJfX3NvdXJjZVwiIT09ciYmbltyXSE9PXRbcl0pcmV0dXJuITA7cmV0dXJuITF9dmFyIEM9ZnVuY3Rpb24obil7dmFyIHQsZTtmdW5jdGlvbiByKHQpe3ZhciBlO3JldHVybihlPW4uY2FsbCh0aGlzLHQpfHx0aGlzKS5pc1B1cmVSZWFjdENvbXBvbmVudD0hMCxlfXJldHVybiBlPW4sKHQ9cikucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5fX3Byb3RvX189ZSxyLnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obix0KXtyZXR1cm4gdyh0aGlzLnByb3BzLG4pfHx3KHRoaXMuc3RhdGUsdCl9LHJ9KGwpO2Z1bmN0aW9uIF8obix0KXtmdW5jdGlvbiBlKG4pe3ZhciBlPXRoaXMucHJvcHMucmVmLHI9ZT09bi5yZWY7cmV0dXJuIXImJmUmJihlLmNhbGw/ZShudWxsKTplLmN1cnJlbnQ9bnVsbCksdD8hdCh0aGlzLnByb3BzLG4pfHwhcjp3KHRoaXMucHJvcHMsbil9ZnVuY3Rpb24gcih0KXtyZXR1cm4gdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZSxzKG4sRSh7fSx0KSl9cmV0dXJuIHIucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9ITAsci5kaXNwbGF5TmFtZT1cIk1lbW8oXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsci50PSEwLHJ9dmFyIEE9di5fX2I7ZnVuY3Rpb24gUyhuKXtmdW5jdGlvbiB0KHQpe3ZhciBlPUUoe30sdCk7cmV0dXJuIGRlbGV0ZSBlLnJlZixuKGUsdC5yZWYpfXJldHVybiB0LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXQudD0hMCx0LmRpc3BsYXlOYW1lPVwiRm9yd2FyZFJlZihcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIix0fXYuX19iPWZ1bmN0aW9uKG4pe24udHlwZSYmbi50eXBlLnQmJm4ucmVmJiYobi5wcm9wcy5yZWY9bi5yZWYsbi5yZWY9bnVsbCksQSYmQShuKX07dmFyIGs9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9oKG4pLnJlZHVjZShmdW5jdGlvbihuLGUscil7cmV0dXJuIG4uY29uY2F0KHQoZSxyKSl9LFtdKTpudWxsfSxSPXttYXA6ayxmb3JFYWNoOmssY291bnQ6ZnVuY3Rpb24obil7cmV0dXJuIG4/aChuKS5sZW5ndGg6MH0sb25seTpmdW5jdGlvbihuKXtpZigxIT09KG49aChuKSkubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNoaWxkcmVuLm9ubHkoKSBleHBlY3RzIG9ubHkgb25lIGNoaWxkLlwiKTtyZXR1cm4gblswXX0sdG9BcnJheTpofSxGPXYuX19lO2Z1bmN0aW9uIE4obil7cmV0dXJuIG4mJigobj1FKHt9LG4pKS5fX2M9bnVsbCxuLl9faz1uLl9fayYmbi5fX2subWFwKE4pKSxufWZ1bmN0aW9uIFUoKXt0aGlzLl9fdT0wLHRoaXMubz1udWxsLHRoaXMuX19iPW51bGx9ZnVuY3Rpb24gTShuKXt2YXIgdD1uLl9fLl9fYztyZXR1cm4gdCYmdC51JiZ0LnUobil9ZnVuY3Rpb24gTChuKXt2YXIgdCxlLHI7ZnVuY3Rpb24gbyhvKXtpZih0fHwodD1uKCkpLnRoZW4oZnVuY3Rpb24obil7ZT1uLmRlZmF1bHR8fG59LGZ1bmN0aW9uKG4pe3I9bn0pLHIpdGhyb3cgcjtpZighZSl0aHJvdyB0O3JldHVybiBzKGUsbyl9cmV0dXJuIG8uZGlzcGxheU5hbWU9XCJMYXp5XCIsby50PSEwLG99ZnVuY3Rpb24gTygpe3RoaXMuaT1udWxsLHRoaXMubD1udWxsfXYuX19lPWZ1bmN0aW9uKG4sdCxlKXtpZihuLnRoZW4pZm9yKHZhciByLG89dDtvPW8uX187KWlmKChyPW8uX19jKSYmci5fX2MpcmV0dXJuIHIuX19jKG4sdC5fX2MpO0Yobix0LGUpfSwoVS5wcm90b3R5cGU9bmV3IGwpLl9fYz1mdW5jdGlvbihuLHQpe3ZhciBlPXRoaXM7bnVsbD09ZS5vJiYoZS5vPVtdKSxlLm8ucHVzaCh0KTt2YXIgcj1NKGUuX192KSxvPSExLHU9ZnVuY3Rpb24oKXtvfHwobz0hMCxyP3IoaSk6aSgpKX07dC5fX2M9dC5jb21wb25lbnRXaWxsVW5tb3VudCx0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dSgpLHQuX19jJiZ0Ll9fYygpfTt2YXIgaT1mdW5jdGlvbigpe3ZhciBuO2lmKCEtLWUuX191KWZvcihlLl9fdi5fX2tbMF09ZS5zdGF0ZS51LGUuc2V0U3RhdGUoe3U6ZS5fX2I9bnVsbH0pO249ZS5vLnBvcCgpOyluLmZvcmNlVXBkYXRlKCl9O2UuX191Kyt8fGUuc2V0U3RhdGUoe3U6ZS5fX2I9ZS5fX3YuX19rWzBdfSksbi50aGVuKHUsdSl9LFUucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuLHQpe3JldHVybiB0aGlzLl9fYiYmKHRoaXMuX192Ll9fa1swXT1OKHRoaXMuX19iKSx0aGlzLl9fYj1udWxsKSxbcyhsLG51bGwsdC51P251bGw6bi5jaGlsZHJlbiksdC51JiZuLmZhbGxiYWNrXX07dmFyIFA9ZnVuY3Rpb24obix0LGUpe2lmKCsrZVsxXT09PWVbMF0mJm4ubC5kZWxldGUodCksbi5wcm9wcy5yZXZlYWxPcmRlciYmKFwidFwiIT09bi5wcm9wcy5yZXZlYWxPcmRlclswXXx8IW4ubC5zaXplKSlmb3IoZT1uLmk7ZTspe2Zvcig7ZS5sZW5ndGg+MzspZS5wb3AoKSgpO2lmKGVbMV08ZVswXSlicmVhaztuLmk9ZT1lWzJdfX07KE8ucHJvdG90eXBlPW5ldyBsKS51PWZ1bmN0aW9uKG4pe3ZhciB0PXRoaXMsZT1NKHQuX192KSxyPXQubC5nZXQobik7cmV0dXJuIHJbMF0rKyxmdW5jdGlvbihvKXt2YXIgdT1mdW5jdGlvbigpe3QucHJvcHMucmV2ZWFsT3JkZXI/KHIucHVzaChvKSxQKHQsbixyKSk6bygpfTtlP2UodSk6dSgpfX0sTy5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4pe3RoaXMuaT1udWxsLHRoaXMubD1uZXcgTWFwO3ZhciB0PWgobi5jaGlsZHJlbik7bi5yZXZlYWxPcmRlciYmXCJiXCI9PT1uLnJldmVhbE9yZGVyWzBdJiZ0LnJldmVyc2UoKTtmb3IodmFyIGU9dC5sZW5ndGg7ZS0tOyl0aGlzLmwuc2V0KHRbZV0sdGhpcy5pPVsxLDAsdGhpcy5pXSk7cmV0dXJuIG4uY2hpbGRyZW59LE8ucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZT1PLnByb3RvdHlwZS5jb21wb25lbnREaWRNb3VudD1mdW5jdGlvbigpe3ZhciBuPXRoaXM7bi5sLmZvckVhY2goZnVuY3Rpb24odCxlKXtQKG4sZSx0KX0pfTt2YXIgVz1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9dmFyIHQ9bi5wcm90b3R5cGU7cmV0dXJuIHQuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dH0sdC5yZW5kZXI9ZnVuY3Rpb24obil7cmV0dXJuIG4uY2hpbGRyZW59LG59KCk7ZnVuY3Rpb24gaihuKXt2YXIgdD10aGlzLGU9bi5jb250YWluZXIscj1zKFcse2NvbnRleHQ6dC5jb250ZXh0fSxuLnZub2RlKTtyZXR1cm4gdC5zJiZ0LnMhPT1lJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSx0LnA9ITEpLG4udm5vZGU/dC5wPyhlLl9faz10Ll9fayxkKHIsZSksdC5fX2s9ZS5fX2spOih0LnY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikscChcIlwiLGUpLGUuYXBwZW5kQ2hpbGQodC52KSx0LnA9ITAsdC5zPWUsZChyLGUsdC52KSx0Ll9faz10LnYuX19rKTp0LnAmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpKSx0Lmg9cix0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKX0sbnVsbH1mdW5jdGlvbiB6KG4sdCl7cmV0dXJuIHMoaix7dm5vZGU6bixjb250YWluZXI6dH0pfXZhciBEPS9eKD86YWNjZW50fGFsaWdubWVudHxhcmFiaWN8YmFzZWxpbmV8Y2FwfGNsaXAoPyFQYXRoVSl8Y29sb3J8ZmlsbHxmbG9vZHxmb250fGdseXBoKD8hUil8aG9yaXp8bWFya2VyKD8hSHxXfFUpfG92ZXJsaW5lfHBhaW50fHN0b3B8c3RyaWtldGhyb3VnaHxzdHJva2V8dGV4dCg/IUwpfHVuZGVybGluZXx1bmljb2RlfHVuaXRzfHZ8dmVjdG9yfHZlcnR8d29yZHx3cml0aW5nfHgoPyFDKSlbQS1aXS87bC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTt2YXIgSD1cInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yJiZTeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKXx8NjAxMDM7ZnVuY3Rpb24gVChuLHQsZSl7aWYobnVsbD09dC5fX2spZm9yKDt0LmZpcnN0Q2hpbGQ7KXQucmVtb3ZlQ2hpbGQodC5maXJzdENoaWxkKTtyZXR1cm4gZChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9ZnVuY3Rpb24gVihuLHQsZSl7cmV0dXJuIHAobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfXZhciBaPXYuZXZlbnQ7ZnVuY3Rpb24gSShuLHQpe25bXCJVTlNBRkVfXCIrdF0mJiFuW3RdJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobix0LHtjb25maWd1cmFibGU6ITEsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbXCJVTlNBRkVfXCIrdF19LHNldDpmdW5jdGlvbihuKXt0aGlzW1wiVU5TQUZFX1wiK3RdPW59fSl9di5ldmVudD1mdW5jdGlvbihuKXtaJiYobj1aKG4pKSxuLnBlcnNpc3Q9ZnVuY3Rpb24oKXt9O3ZhciB0PSExLGU9ITEscj1uLnN0b3BQcm9wYWdhdGlvbjtuLnN0b3BQcm9wYWdhdGlvbj1mdW5jdGlvbigpe3IuY2FsbChuKSx0PSEwfTt2YXIgbz1uLnByZXZlbnREZWZhdWx0O3JldHVybiBuLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7by5jYWxsKG4pLGU9ITB9LG4uaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sbi5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gZX0sbi5uYXRpdmVFdmVudD1ufTt2YXIgJD17Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNsYXNzfX0scT12LnZub2RlO3Yudm5vZGU9ZnVuY3Rpb24obil7bi4kJHR5cGVvZj1IO3ZhciB0PW4udHlwZSxlPW4ucHJvcHM7aWYodCl7aWYoZS5jbGFzcyE9ZS5jbGFzc05hbWUmJigkLmVudW1lcmFibGU9XCJjbGFzc05hbWVcImluIGUsbnVsbCE9ZS5jbGFzc05hbWUmJihlLmNsYXNzPWUuY2xhc3NOYW1lKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImNsYXNzTmFtZVwiLCQpKSxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXt2YXIgcixvLHU7Zm9yKHUgaW4gZS5kZWZhdWx0VmFsdWUmJnZvaWQgMCE9PWUudmFsdWUmJihlLnZhbHVlfHwwPT09ZS52YWx1ZXx8KGUudmFsdWU9ZS5kZWZhdWx0VmFsdWUpLGRlbGV0ZSBlLmRlZmF1bHRWYWx1ZSksQXJyYXkuaXNBcnJheShlLnZhbHVlKSYmZS5tdWx0aXBsZSYmXCJzZWxlY3RcIj09PXQmJihoKGUuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24obil7LTEhPWUudmFsdWUuaW5kZXhPZihuLnByb3BzLnZhbHVlKSYmKG4ucHJvcHMuc2VsZWN0ZWQ9ITApfSksZGVsZXRlIGUudmFsdWUpLGUpaWYocj1ELnRlc3QodSkpYnJlYWs7aWYocilmb3IodSBpbiBvPW4ucHJvcHM9e30sZSlvW0QudGVzdCh1KT91LnJlcGxhY2UoL1tBLVowLTldLyxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpOnVdPWVbdV19IWZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSxyPW4ucHJvcHM7aWYociYmXCJzdHJpbmdcIj09dHlwZW9mIGUpe3ZhciBvPXt9O2Zvcih2YXIgdSBpbiByKS9eb24oQW5pfFRyYXxUb3UpLy50ZXN0KHUpJiYoclt1LnRvTG93ZXJDYXNlKCldPXJbdV0sZGVsZXRlIHJbdV0pLG9bdS50b0xvd2VyQ2FzZSgpXT11O2lmKG8ub25kb3VibGVjbGljayYmKHIub25kYmxjbGljaz1yW28ub25kb3VibGVjbGlja10sZGVsZXRlIHJbby5vbmRvdWJsZWNsaWNrXSksby5vbmJlZm9yZWlucHV0JiYoci5vbmJlZm9yZWlucHV0PXJbby5vbmJlZm9yZWlucHV0XSxkZWxldGUgcltvLm9uYmVmb3JlaW5wdXRdKSxvLm9uY2hhbmdlJiYoXCJ0ZXh0YXJlYVwiPT09ZXx8XCJpbnB1dFwiPT09ZS50b0xvd2VyQ2FzZSgpJiYhL15maWx8Y2hlfHJhL2kudGVzdChyLnR5cGUpKSl7dmFyIGk9by5vbmlucHV0fHxcIm9uaW5wdXRcIjtyW2ldfHwocltpXT1yW28ub25jaGFuZ2VdLGRlbGV0ZSByW28ub25jaGFuZ2VdKX19fSgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJiF0Lm0mJnQucHJvdG90eXBlJiYoSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxNb3VudFwiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wc1wiKSxJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFVwZGF0ZVwiKSx0Lm09ITApfXEmJnEobil9O3ZhciBCPVwiMTYuOC4wXCI7ZnVuY3Rpb24gRyhuKXtyZXR1cm4gcy5iaW5kKG51bGwsbil9ZnVuY3Rpb24gSihuKXtyZXR1cm4hIW4mJm4uJCR0eXBlb2Y9PT1IfWZ1bmN0aW9uIEsobil7cmV0dXJuIEoobik/eS5hcHBseShudWxsLGFyZ3VtZW50cyk6bn1mdW5jdGlvbiBRKG4pe3JldHVybiEhbi5fX2smJihkKG51bGwsbiksITApfWZ1bmN0aW9uIFgobil7cmV0dXJuIG4mJihuLmJhc2V8fDE9PT1uLm5vZGVUeXBlJiZuKXx8bnVsbH12YXIgWT1mdW5jdGlvbihuLHQpe3JldHVybiBuKHQpfTtleHBvcnQgZGVmYXVsdHt1c2VTdGF0ZTpuLHVzZVJlZHVjZXI6dCx1c2VFZmZlY3Q6ZSx1c2VMYXlvdXRFZmZlY3Q6cix1c2VSZWY6byx1c2VJbXBlcmF0aXZlSGFuZGxlOnUsdXNlTWVtbzppLHVzZUNhbGxiYWNrOmYsdXNlQ29udGV4dDpjLHVzZURlYnVnVmFsdWU6YSx2ZXJzaW9uOlwiMTYuOC4wXCIsQ2hpbGRyZW46UixyZW5kZXI6VCxoeWRyYXRlOlQsdW5tb3VudENvbXBvbmVudEF0Tm9kZTpRLGNyZWF0ZVBvcnRhbDp6LGNyZWF0ZUVsZW1lbnQ6cyxjcmVhdGVDb250ZXh0OmcsY3JlYXRlRmFjdG9yeTpHLGNsb25lRWxlbWVudDpLLGNyZWF0ZVJlZjpiLEZyYWdtZW50OngsaXNWYWxpZEVsZW1lbnQ6SixmaW5kRE9NTm9kZTpYLENvbXBvbmVudDpsLFB1cmVDb21wb25lbnQ6QyxtZW1vOl8sZm9yd2FyZFJlZjpTLHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzOlksU3VzcGVuc2U6VSxTdXNwZW5zZUxpc3Q6TyxsYXp5Okx9O2V4cG9ydHtCIGFzIHZlcnNpb24sUiBhcyBDaGlsZHJlbixUIGFzIHJlbmRlcixWIGFzIGh5ZHJhdGUsUSBhcyB1bm1vdW50Q29tcG9uZW50QXROb2RlLHogYXMgY3JlYXRlUG9ydGFsLEcgYXMgY3JlYXRlRmFjdG9yeSxLIGFzIGNsb25lRWxlbWVudCxKIGFzIGlzVmFsaWRFbGVtZW50LFggYXMgZmluZERPTU5vZGUsQyBhcyBQdXJlQ29tcG9uZW50LF8gYXMgbWVtbyxTIGFzIGZvcndhcmRSZWYsWSBhcyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyxVIGFzIFN1c3BlbnNlLE8gYXMgU3VzcGVuc2VMaXN0LEwgYXMgbGF6eX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wYXQubW9kdWxlLmpzLm1hcFxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcydcclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0gKHByb3BzKXtcclxuY29uc3Qge2NoaWxkcmVufT1wcm9wc1xyXG5yZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiey4uLnByb3BzfT57Y2hpbGRyZW59PC9kaXY+XHJcbn0iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuXHJcblxyXG5cclxuIGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0XCIgey4uLnByb3BzfS8+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0SXRlbShwcm9wcykge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWl0ZW1cIiB7Li4ucHJvcHN9IC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHtMaXN0LExpc3RJdGVtfSIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FRQUFBQUFZTGxWQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQW1KTFIwUUFBS3FOSXpJQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFIZEVsTlJRZmtCQnNJTFMxWWY5SklBQUFEb0VsRVFWUm8zcjJaUzBoVVVSakhmM010aTlCU00ybFIwdFBKaEVqU1ZpRUUxYUtObFJVVkpGRVFGRkVrYnUyMUs3R0lOaEZGUkErQ2xpVXRhdE5MM0lUUk5LRVJCbEVMZFViSDdLR21jMXZjcmpQanpMMzNmR2Z1K0gyTGdYdk85Lzk5OTV3ejUzVURTSzJNT3FwWVF3WEZGRkVBL0NUR0VEMTBFK1lWL1dKRlphdmxNaUhpbUM0ZUowUWJOWDZqNTlQTVIxZndkQS9UVEtFLzhCTE9NeWlDMno3SU9ZcXpnd2RvcEY4TGJudVVVeGk2K0ZXOHlRcHUrMnRXNnVCM011UUwzc1RrQi90a2NJTXJ2c0Z0YjFQdmlud2UrSTQzTWJuUGJEVjhlMDd3SmlaUHZGTUljQ2RuZUJPVEIxNGQ0WC9mVC9kV04veWVuT05OVFBZNzRWY1NtNUVFWXF6STNQditURHNxL3BKQUFtdmJFVzdLSmd1KzhwQWVJTWgrbGdwakQzRW45VUVKQTZKMytFTVRlVlBSZVRUelJ4VGZSMUZxQWhkRTRXTnNUM3VucmNJVXppUUh6eGN1dU1jeU51dHhrVVkwZWIvUUxBcnRTQm81cWNPNFU2VFRsQWdOaVFKM09RNHQyVHdTdHNOcVJXRy95SGRNSUo5ZklxMXFNTUI1WnNwb0hZdzdsbzNUS2RJNllDV3dUUlRVNjFyNlJhUzFCUXpLV0NzS2lybVdSa1ZhNnlnMXFITVkwMDQyeDdWMHJrakxvTTZnU2hRQ1MxeEx5NFZxVlFaQllVaXRTMWxBZkNZS0dsUUlROHFwZGl5cjhXaWZkS3N3S0JXR3dFbkhraE5pclZLSWlLWU9FNU1KaDRiZXlJUllhd0RHeEVFbW4xbVVoaStqVjBOcFZDOEJrMjRxVS9DVmRHdnBqT3AwZ1IyNmVBby9UN2dYU09vQ2c1L2lnV1BacDZTN2tOOTgxRlFaTVlob2hQM2xPcHVJSnozWnpFMG1OSlFpaU0rQm85eHdPRzZ2NXBaNFJOMkRzNExxY1I2eXpQV05sdk5JbEVBTE5DaFhqbEd2MUt6MURDdHI3b1F5ajNzdjI3OEpKdTFLdml0cFRscno4SHVGcW1NdUswQW0yOEM0Z21xWHRTTjZyaURZUnBjb2diZGNVYWoxelBxcFVSajVDMFY0Z0VVSy80ajFkdVd3UjhWMk1SN2dxWWRxQ1BoL1gzSGJRNnBESzRFM0h1VkoxRUtQbzFtRFZnTHV4NVFJQllrV0dPR2FxMVJNS3dIM3FLdldLbVR2aUl2cHliREcyemFpTmMvUGNybXU3aVBJY09xanc2SXBORnMvbUo1VGdOY3pobitSK1N3eVU1ZFVRNWt2cVFCMnowZ0N6c2Q3b0MzbitJdnVJemZBN1p6aTczdmZtYy9PNFdYMVk3WDc4bG5jeWduK3JocmU2b2hXbitGeExncXZBZGloK2Ewc2t3K3pWd2EzYkFVdmZjRy9ZTGtPM3VxS1J2cXlna2M1S20zNjZWYkVHYUphOEFndExNZ09ibHNCVFh3UXdVT2N0dFo3UDYyYVZ0NHg2UXFlcEl0TGliMmVTaTlMclpRNjFsSkpCU1ZKbis4SHB6N2ZDOCthL3dDMVpBWHMzVWhVSEFBQUFDVjBSVmgwWkdGMFpUcGpjbVZoZEdVQU1qQXlNQzB3TkMweU4xUXdPRG8wTlRvME5Tc3dNRG93TUJhd1NWUUFBQUFsZEVWWWRHUmhkR1U2Ylc5a2FXWjVBREl3TWpBdE1EUXRNamRVTURnNk5EVTZORFVyTURBNk1EQm43ZkhvQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUIzZDNjdWFXNXJjMk5oY0dVdWIzSm5tKzQ4R2dBQUFBQkpSVTVFcmtKZ2dnPT1cIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgcHJvcE5hbWUsXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd3ZWJjb20nKTtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUyB9O1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkwsXHJcbiAgICB0b2tlbixcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHsgdXNlciwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFLCB1c2VyIH0pO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9saXN0JztcclxuaW1wb3J0IHVzZXJJY29uIGZyb20gJy4vaWNvbnMvdXNlcjY0LnBuZyc7XHJcbmltcG9ydCB7IGxvZ291dCB9IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBncmlkOiB7XHJcbiAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnYXV0byA1JSBhdXRvJyxcclxuICAgIGp1c3RpZnlJdGVtczogJ2NlbnRlcicsXHJcbiAgICBwYWRkaW5nOjE2XHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoRHJhd2VyQ29udGVudCgpIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfSA9IHVzZUFwcFJvdXRlKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCxyb3V0ZTonL2F1dGgnfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nVG9wOiAxMCB9fT5cclxuICAgICAgeyFzdGF0ZS51c2VybmFtZSAmJiA8VW5BdXRoZWRTdGF0ZSBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9IC8+fVxyXG4gICAgICB7c3RhdGUudXNlcm5hbWUgJiYgKFxyXG4gICAgICAgIDxBdXRoZWRTdGF0ZVxyXG4gICAgICAgIG9uQXBwUm91dGU9e29uQXBwUm91dGV9XHJcbiAgICAgICAgICBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9XHJcbiAgICAgICAgICB1c2VyTmFtZT17c3RhdGUudXNlcm5hbWV9XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuICAgICAgPGhyIHN0eWxlPXt7IGhlaWdodDogMSB9fSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUsIHVzZXJOYW1lICxvbkFwcFJvdXRlfSkge1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ091dCgpIHtcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6Jy8nLHJvdXRlOicvaG9tZSd9KTtcclxuICAgIGxvZ291dCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8aW1nIHNyYz17dXNlckljb259IHN0eWxlPXt7IHBhZGRpbmdSaWdodDogNSB9fSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlTG9nT3V0fSBpZD0nbG9nb3V0JyBkYXRhLXRlc3RpZD0nbG9nb3V0Jz5cclxuICAgICAgICAgICAgTG9nb3V0XHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogOCB9fT5XZWxjb21lLCB7dXNlck5hbWV9PC9kaXY+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2NoYW5nZXBhc3N3b3JkJ2RhdGEtdGVzdGlkPSdjaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgICBDaGFuZ2UgUGFzc3dvcmRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5BdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuZ3JpZH0+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdsb2dpbicgZGF0YS10ZXN0aWQ9J2xvZ2luJz5cclxuICAgICAgICAgIExvZ2luXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgIDxkaXY+fDwvZGl2PlxyXG4gICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nc2lnbnVwJyBkYXRhLXRlc3RpZD0nc2lnbnVwJz5cclxuICAgICAgICAgIFNpZ251cFxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VVc2VyTmFtZSgpIHtcclxuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgeyBzdGF0ZSxkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIFxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpIHtcclxuIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwgfSA9IEpTT04ucGFyc2UoXHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxyXG4gICAgICApO1xyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzdGF0ZS50b2tlbikge1xyXG4gIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4gfSA9c3RhdGU7XHJcbiAgICAgIC8vIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgLy8gICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgIC8vICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICB9XHJcbiAgfSwgW3N0YXRlXSk7XHJcblxyXG4gIHJldHVybiB7IHVzZXJOYW1lLCB0b2tlbiwgZW1haWwgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2xpc3QnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uLy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dERyYXdlckNvbnRlbnQoKSB7XHJcblxyXG5jb25zdCB7b25BcHBSb3V0ZX0gPXVzZUFwcFJvdXRlKClcclxuXHJcbiAgY29uc3QgeyB1c2VyTmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBpZiAodXNlck5hbWUpIHtcclxuXHJcbiAgICAgIG9uQXBwUm91dGUoe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTonL2hhbmdvdXRzJyxyb3V0ZTonL2hhbmdvdXRzJ30pXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgb25BcHBSb3V0ZSh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlOicvbG9naW4nLHJvdXRlOicvYXV0aCd9KVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBkYXRhLXRlc3RpZD0naGFuZ291dHMnPlxyXG4gICAgICAgICAgSGFuZ291dFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiBcclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IG1lc3NhZ2VJY29uIGZyb20gJy4vbWVzc2FnZS5wbmcnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBjb3VudDoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcclxuICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgdGV4dEFsaWduOidjZW50ZXInLFxyXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxyXG4gICAgZGlzcGxheTonZmxleCcsXHJcbiAgICBhbGlnbkl0ZW1zOidjZW50ZXInLFxyXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcclxuICB9LFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cclxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuY291bnR9IGRhdGEtdGVzdGlkPVwibWVzc2FnZS1jb3VudFwiPntjb3VudH08L2Rpdj4gXHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFNldHRpbmdzKHByb3BzKSB7XHJcblxyXG4gIGNvbnN0IHsgaGVpZ2h0ID0gMjQsXHJcbiAgICB3aWR0aCA9IDI0LFxyXG4gICAgZmlsbCA9ICdub25lJyxcclxuICAgIGNvbG9yID0gJ2JsYWNrJyxvbkNsaWNrICxpZH09cHJvcHNcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPHN2ZyBoZWlnaHQ9e2hlaWdodH0gdmlld0JveD0nMCAwIDI0IDI0JyB3aWR0aD17d2lkdGh9ICBpZD17aWR9PlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDBWMHonIGZpbGw9e2ZpbGx9IGlkPXtpZH0vPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBpZD17aWR9XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICAgIGNvbG9yPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2Yy0uMTItLjIyLS4zOS0uMy0uNjEtLjIybC0yLjQ5IDFjLS41Mi0uNC0xLjA4LS43My0xLjY5LS45OGwtLjM4LTIuNjVDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJoLTRjLS4yNSAwLS40Ni4xOC0uNDkuNDJsLS4zOCAyLjY1Yy0uNjEuMjUtMS4xNy41OS0xLjY5Ljk4bC0yLjQ5LTFjLS4yMy0uMDktLjQ5IDAtLjYxLjIybC0yIDMuNDZjLS4xMy4yMi0uMDcuNDkuMTIuNjRsMi4xMSAxLjY1Yy0uMDQuMzItLjA3LjY1LS4wNy45OHMuMDMuNjYuMDcuOThsLTIuMTEgMS42NWMtLjE5LjE1LS4yNC40Mi0uMTIuNjRsMiAzLjQ2Yy4xMi4yMi4zOS4zLjYxLjIybDIuNDktMWMuNTIuNCAxLjA4LjczIDEuNjkuOThsLjM4IDIuNjVjLjAzLjI0LjI0LjQyLjQ5LjQyaDRjLjI1IDAgLjQ2LS4xOC40OS0uNDJsLjM4LTIuNjVjLjYxLS4yNSAxLjE3LS41OSAxLjY5LS45OGwyLjQ5IDFjLjIzLjA5LjQ5IDAgLjYxLS4yMmwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NGwtMi4xMS0xLjY1ek0xMiAxNS41Yy0xLjkzIDAtMy41LTEuNTctMy41LTMuNXMxLjU3LTMuNSAzLjUtMy41IDMuNSAxLjU3IDMuNSAzLjUtMS41NyAzLjUtMy41IDMuNXonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICB3aWR0aDogMTUsXHJcbiAgaGVpZ2h0OiAxNSxcclxuXHJcbiAgYm9yZGVyOiAnd2hpdGUgMnB4IHNvbGlkJyxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xyXG4gIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XHJcbiAgICByZXR1cm4gPElzT25saW5lIC8+O1xyXG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xyXG4gICAgcmV0dXJuIDxDb25uZWN0aW5nIC8+O1xyXG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMikge1xyXG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xyXG4gIH1cclxuICByZXR1cm4gPElzT2ZmbGluZSAvPjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT25saW5lKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBJc09mZmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3JlZCcgfX1cclxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcclxuICAgID48L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ29ubmVjdGluZygpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDbG9zaW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdwaW5rJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUGVuZGluZ0hhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb25saW5lLGlzQmxvY2tlciB9KSB7XHJcbmRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHN0YXRlLCBlbWFpbCB9ID0gaGFuZ291dDtcclxuICBsZXQgaGFuZ291dEtleSA9ICcnO1xyXG4gIGxldCBtZXNzYWdlS2V5ID0gJyc7XHJcbiAgaWYgKG9ubGluZSkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tb2ZmbGluZS1tZXNzYWdlc2A7XHJcbiAgfVxyXG5cclxuICBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudGV4dCAhPT1cIlwiKSB7XHJcbiAgICBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIHVzZXJuYW1lLCBtZXNzYWdlLGRpc3BhdGNoLGlzQmxvY2tlciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGhhbmdvdXQpO1xyXG4gICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbaGFuZ291dF07XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuICB9XHJcbiBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSkge1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IFtdO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gXHJcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIG1lc3NhZ2VdO1xyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gW21lc3NhZ2VdO1xyXG4gIH1cclxuICBpZihpc0Jsb2NrZXIpe1xyXG4gXHJcbiAgICBjb25zdCBibG9ja2VyID1bLi4udXBkYXRlZE1lc3NhZ2VzLHt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIHRoaXMgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZC4nXHJcbiAgICAsdGltZXN0YW1wOiBEYXRlLm5vdygpLHR5cGU6J2Jsb2NrZXInLHVzZXJuYW1lOm1lc3NhZ2UudXNlcm5hbWUsZmxvYXQ6J3JpZ2h0J31dXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShibG9ja2VyKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiBibG9ja2VyIH0pO1xyXG4gIFxyXG4gIH1cclxuICBlbHNle1xyXG4gIFxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbiAgfVxyXG4gXHJcblxyXG59XHJcbiIsImltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnLi4vLi4vY2xpZW50Q29tbWFuZHMnO1xyXG5leHBvcnQgZnVuY3Rpb24gc2VuZE9mZmxpbmVIYW5nb3V0cyh7IGRpc3BhdGNoLCBzb2NrZXQsIG5hbWUgfSkge1xyXG4gIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xyXG4gIGlmIChvZmZsaW5lSGFuZ291dHMpIHtcclxuICAgIG9mZmxpbmVIYW5nb3V0cy5mb3JlRWFjaCgoaCkgPT4ge1xyXG4gICAgICBzb2NrZXQuc2VuZChcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB1c2VybmFtZTogaC51c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsOiBoLmVtYWlsLFxyXG4gICAgICAgICAgbWVzc2FnZTogaC5tZXNzYWdlLFxyXG4gICAgICAgICAgdGltZXN0YW1wOiBoLnRpbWVzdGFtcCxcclxuICAgICAgICAgIGNvbW1hbmQ6IGguc3RhdGUsXHJcbiAgICAgICAgICBvZmZsaW5lOiB0cnVlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuO1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQoe25hbWUsIGhhbmdvdXQsZGlzcGF0Y2h9KXtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGhhbmdvdXQ7XHJcbiAgICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gICAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG4gICBcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgIGNvbnN0IGZpbHRlcmVkSGFuZ291dHMgPSB1bnJlYWRoYW5nb3V0cy5maWx0ZXIoZnVuY3Rpb24odW5yZWFkKSAge1xyXG4gICAgICAgICAgICByZXR1cm4gIHVucmVhZC51c2VybmFtZSAhPT0gdXNlcm5hbWV9KTtcclxuICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGZpbHRlcmVkSGFuZ291dHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeShmaWx0ZXJlZEhhbmdvdXRzKSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0czogZmlsdGVyZWRIYW5nb3V0cyxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh1bnJlYWRoYW5nb3V0c0tleSk7XHJcbiAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgIFxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xyXG5pbXBvcnQgeyB1cGRhdGVMb2NhbEhhbmdvdXRzIH0gZnJvbSAnLi91cGRhdGVMb2NhbEhhbmdvdXRzJztcclxuaW1wb3J0IHsgc2F2ZVBlbmRpbmdIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnO1xyXG5pbXBvcnQge1xyXG4gIHNlbGVjdEhhbmdvdXQsXHJcbiAgc2VsZWN0VW5yZWFkLFxyXG4gIHNlYXJjaEhhbmdvdXRzLFxyXG4gIGZpbHRlckhhbmdvdXRzLFxyXG4gIGZldGNoSGFuZ291dCxcclxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcclxuXHJcbiAgc3RhcnRDbGllbnRDb21tYW5kLFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHNlbmRPZmZsaW5lSGFuZ291dHMgfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMnO1xyXG5pbXBvcnQge3JlbW92ZUhhbmdvdXRGcm9tVW5yZWFkfSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQnXHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuICBjb25zdCB7XHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICBzb2NrZXRNZXNzYWdlLFxyXG4gICAgcmVhZHlTdGF0ZSxcclxuICAgIHNvY2tldCxcclxuICAgIHVucmVhZGhhbmdvdXRzLFxyXG4gIH0gPSBzdGF0ZTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzb2NrZXQgJiYgcmVhZHlTdGF0ZSA9PT0gMSAmJiB1c2VybmFtZSkge1xyXG4gICAgICBzZW5kT2ZmbGluZUhhbmdvdXRzKHsgbmFtZTogdXNlcm5hbWUsIGRpc3BhdGNoLCBzb2NrZXQgfSk7XHJcbiAgICB9XHJcbiAgfSwgW3NvY2tldCwgcmVhZHlTdGF0ZSwgdXNlcm5hbWVdKTtcclxuXHJcbiAgZnVuY3Rpb24gb25SZW1vdmVVbnJlYWQoZSl7XHJcbiAgICBjb25zdCBpZCA9ZS5jdXJyZW50VGFyZ2V0LmlkXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gaWQpO1xyXG4gICBkZWJ1Z2dlcjtcclxuICAgIHJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkKHtuYW1lOnVzZXJuYW1lLGRpc3BhdGNoLGhhbmdvdXR9KVxyXG4gIH1cclxuICBmdW5jdGlvbiBvbk5hdmlnYXRpb24oZSl7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgIC8vIGNvbnN0IGlkID1lLnRhcmdldC5pZFxyXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxyXG4gICBkZWJ1Z2dlcjtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtpZH1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xyXG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XHJcbiAgICBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaDogZS50YXJnZXQudmFsdWUsIGRpc3BhdGNoIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TdGFydFNlYXJjaChlKSB7XHJcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xyXG4gICAgY29uc3QgdGV4dCA9IGUudGFyZ2V0LnZhbHVlO1xyXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dCB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25IYW5nb3V0KGUpIHtcclxuICAgZGVidWdnZXI7XHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQ6ICcnLCBkaXNwYXRjaCB9KTtcclxuICAgIGNvbnN0IGNvbW1hbmQgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IGhhbmdvdXQ7XHJcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgbWVzc2FnZSA9XHJcbiAgICAgIG1lc3NhZ2VUZXh0ICE9PSAnJyA/IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCB9IDogbnVsbDtcclxuXHJcbiAgICBjb25zdCBvbmxpbmUgPSB0cnVlO1xyXG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcclxuICAgIGlmIChzb2NrZXQgJiYgcmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICBcclxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xyXG4gICAgICAgXHJcbiAgICAgICAgaXNCbG9ja2VyPXRydWVcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICBcclxuICAgICAgICBzb2NrZXQuc2VuZChcclxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICBjb21tYW5kLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIFxyXG4gICAgICB9XHJcbiAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9ubGluZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XHJcbiAgICAgIGRpc3BhdGNoLFxyXG4gICAgICBuYW1lOiB1c2VybmFtZSxcclxuICAgICAgaGFuZ291dDoge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIHN0YXRlOiBjb21tYW5kLFxyXG4gICAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCwgZGVsaXZlcmVkOiBmYWxzZSwgdXNlcm5hbWUgfSxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgZGVsaXZlcmVkOiBmYWxzZSxcclxuICAgICAgICBcclxuICAgICAgfSxcclxuICAgICAgb25saW5lLFxyXG4gICAgICBpc0Jsb2NrZXJcclxuICAgIH0pO1xyXG5cclxuICAgXHJcblxyXG5cclxuICB9Ly9lbmQgb25IYW5nb3V0XHJcbiAgcmV0dXJuIHtcclxuICAgIG9uTmF2aWdhdGlvbixcclxuICAgIG9uU2VsZWN0VW5yZWFkLFxyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgb25TdGFydFNlYXJjaCxcclxuICAgIG9uU2VhcmNoLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICB1c2VycyxcclxuICAgIHVzZXJuYW1lLFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICBvbkhhbmdvdXQsXHJcbiAgICB1bnJlYWRoYW5nb3V0cyxcclxuICAgIHJlYWR5U3RhdGUsXHJcbiAgICBvblJlbW92ZVVucmVhZFxyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IE5hdkl0ZW0gfSBmcm9tICcuLi8uLi9uYXYvTmF2SXRlbSc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi8uLi9pY29ucy9NZXNzYWdlJztcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuLi8uLi9pY29ucy9TZXR0xLFuZ3MnO1xyXG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi8uLi9pY29ucy9vbmxpbmVTdGF0dXMnO1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4uL3N0YXRlL3VzZUhhbmdvdXRzJztcclxuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tICcuLi8uLi9hdXRoL3VzZVVzZXJOYW1lJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dFRvcE1lbnUoKSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG4gIGNvbnN0IHsgdXNlck5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XHJcbiAgY29uc3QgeyByZWFkeVN0YXRlLCB1bnJlYWRoYW5nb3V0cywgb25OYXZpZ2F0aW9uLCBoYW5nb3V0IH0gPSB1c2VIYW5nb3V0cygpO1xyXG5cclxuICBmdW5jdGlvbiBuYXZUb1VucmVhZCgpIHtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6ICcvVU5SRUFEJywgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XHJcbiAgICAgIDxOYXZJdGVtPnt1c2VyTmFtZX08L05hdkl0ZW0+XHJcbiAgICAgIDxOYXZJdGVtPlxyXG4gICAgICAgIDxPbmxpbmVTdGF0dXMgcmVhZHlTdGF0ZT17cmVhZHlTdGF0ZX0gLz5cclxuICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICA8TmF2SXRlbSBvbkNsaWNrPXtuYXZUb1VucmVhZH0gZGF0YS10ZXN0aWQ9XCJuYXYtdW5yZWFkc1wiPlxyXG4gICAgICAgIHt1bnJlYWRoYW5nb3V0cyAmJiA8TWVzc2FnZSBjb3VudD17dW5yZWFkaGFuZ291dHMuZmlsdGVyKGY9PmYucmVhZD09PWZhbHNlKS5sZW5ndGh9IC8+fXsnICd9XHJcbiAgICAgIDwvTmF2SXRlbT5cclxuICAgICAge2hhbmdvdXQgJiYgKFxyXG4gICAgICAgIDxOYXZJdGVtICAgIG9uQ2xpY2s9e29uTmF2aWdhdGlvbn0gZGF0YS10ZXN0aWQ9XCJuYXYtY29uZmlnXCIgaWQ9XCJjb25maWd1cmVcIiA+XHJcbiAgICAgICAgICA8U2V0dGluZ3NcclxuICAgICAgICAgICAgZmlsbD1cIndoaXRlXCJcclxuICAgICAgICAgICAgd2lkdGg9XCIzMFwiXHJcbiAgICAgICAgICAgIGhlaWdodD1cIjMwXCJcclxuICAgICAgICAgXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuLy9cclxuIiwiZXhwb3J0IGNvbnN0IGRyYXdlciA9IHtcclxuICBib3hTaGFkb3c6IGAwcHggM3B4IDNweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSwwcHggM3B4IDRweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDFweCA4cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xMilgLFxyXG5cclxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICBsZWZ0OiAwLFxyXG4gIHRvcDogMCxcclxuICB6SW5kZXg6IDEwLFxyXG4gIGhlaWdodDogJzEwMHZoJyxcclxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjVmNWY1JyxcclxufTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tICcuL2RldmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKSB7XHJcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW29yaWVudGF0aW9uLCBzZXRPcmllbnRhdGlvbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2RldmljZSwgc2V0RGV2aWNlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XHJcbiAgIFxyXG4gICAgICBzZXRXaWR0aCh3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbiAgICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpIHtcclxuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xyXG4gIH1cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoID4gMCkge1xyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDYwMDpcclxuICAgICAgICAgIHNldERldmljZSgncGhvbmUnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNzY4OlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gOTkyOlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcclxuICAgICAgICAgIHNldERldmljZSgndGFibGV0Jyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2xhcHRvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2Rlc2t0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3dpZHRoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2aWNlJywgZGV2aWNlKTtcclxuICB9LCBbZGV2aWNlXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGhhbmRsZVZpZXdwb3J0U2l6ZSgpO1xyXG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBkcmF3ZXIgfSBmcm9tICcuL3N0eWxlJztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJy4uL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGlvbiB9IGZyb20gJy4vTmF2UHJvdmlkZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmF3ZXIocHJvcHMpIHtcclxuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7IG9wZW4sIG9uQ2xpY2ssIGNoaWxkcmVuIH0gPSBwcm9wcztcclxuICBjb25zdCB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9ID0gdXNlTmF2aWdhdGlvbigpO1xyXG5cclxuICBpZiAoZHJhd2VyT3BlbilcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17eyAuLi5kcmF3ZXIgfX1cclxuICAgICAgICBjbGFzc05hbWU9e2BkcmF3ZXItJHtkZXZpY2V9LXdpZHRoYH1cclxuICAgICAgICBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9XHJcbiAgICAgID5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwQmFyKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAuLi50aGVtZS5wcmltYXJ5LFxyXG4gICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAvLyBsZWZ0OiAwLFxyXG4gICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgbWluSGVpZ2h0OiA2NCxcclxuICAgICAgIC8vIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgIC8vIHBhZGRpbmdSaWdodDogMTYsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICBkaXNwbGF5OidmbGV4J1xyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCAnLi4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBNZW51V2hpdGUoeyBvbkNsaWNrLCBpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBjbGFzc05hbWU9XCJtZW51LXdoaXRlXCJcclxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgIGZpbGw9XCJ3aGl0ZVwiXHJcbiAgICAgIHdpZHRoPVwiMjRweFwiXHJcbiAgICAgIGhlaWdodD1cIjI0cHhcIlxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPHBhdGggZD1cIk0zIDE4aDE4di0ySDN2MnptMC01aDE4di0ySDN2MnptMC03djJoMThWNkgzelwiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnLi9OYXZQcm92aWRlcic7XHJcbmltcG9ydCB7IE1lbnVXaGl0ZSB9IGZyb20gJy4vaWNvbnMvTWVudVdoaXRlJztcclxuZXhwb3J0IGZ1bmN0aW9uIE1lbnUoKSB7XHJcbiAgY29uc3QgeyBkcmF3ZXJPcGVuLCB0b2dnbGVEcmF3ZXIgfSA9IHVzZU5hdmlnYXRpb24oKTtcclxuXHJcbiAgcmV0dXJuIDxNZW51V2hpdGUgb25DbGljaz17dG9nZ2xlRHJhd2VyfSBpZD1cIm1lbnVcIiAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgTmF2SXRlbSB9IGZyb20gJy4uL25hdi9OYXZJdGVtJztcclxuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEF1dGhEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vYXV0aC9BdXRoRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCB7IEhhbmdvdXREcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vaGFuZ291dHMvbmF2L0hhbmdvdXREcmF3ZXJDb250ZW50JztcclxuaW1wb3J0IHsgSGFuZ291dFRvcE1lbnUgfSBmcm9tICcuLi9oYW5nb3V0cy9uYXYvSGFuZ291dFRvcE1lbnUnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgcmVjb3ZlckxvY2FsQXV0aFN0YXRlIH0gZnJvbSAnLi4vYXV0aC9hY3Rpb25zJztcclxuaW1wb3J0IERyYXdlciBmcm9tICcuLi9uYXYvRHJhd2VyJztcclxuaW1wb3J0IHsgQXBwQmFyIH0gZnJvbSAnLi4vbmF2L0FwcEJhcic7XHJcbmltcG9ydCB7IE1lbnUgfSBmcm9tICcuLi9uYXYvTWVudSc7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBOYXZpZ2F0aW9uKCkge1xyXG4gICAgY29uc3QgeyBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcbiAgICAgICAgICByZWNvdmVyTG9jYWxBdXRoU3RhdGUoe1xyXG4gICAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgICAgdXNlcjogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxBcHBCYXI+XHJcbiAgICAgICAgPE1lbnUgLz5cclxuICAgICAgICA8TmF2SXRlbSBzdHlsZT17eyBmbGV4OiA1IH19PldFQiBDT008L05hdkl0ZW0+XHJcbiAgICAgICAgPEhhbmdvdXRUb3BNZW51IC8+XHJcbiAgICAgIDwvQXBwQmFyPlxyXG4gICAgICA8RHJhd2VyPlxyXG4gICAgICAgIDxBdXRoRHJhd2VyQ29udGVudCAvPlxyXG4gICAgICAgIDxIYW5nb3V0RHJhd2VyQ29udGVudCAvPlxyXG4gICAgICA8L0RyYXdlcj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSG9tZSgpIHtcclxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD0naG9tZScgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+SG9tZTwvZGl2PjtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTogJ0lOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIFJFU0VUX1ZBTElEQVRJT05fU1RBVEU6ICdSRVNFVF9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIElOUFVUX0JMVVJSRUQ6ICdJTlBVVF9CTFVSUkVEJyxcclxuICAgIElOUFVUX0ZPQ1VTRUQ6ICdJTlBVVF9GT0NVU0VEJyxcclxuICBcclxuICAgIFNFUlZFUl9WQUxJREFUSU9OOiAnU0VSVkVSX1ZBTElEQVRJT04nLFxyXG4gICAgQ0xJRU5UX1ZBTElEQVRJT046J0NMSUVOVF9WQUxJREFUSU9OJyxcclxuICBcclxuICAgIElOQ19JTlBVVF9DT1VUTiA6J0lOQ19JTlBVVF9DT1VUTidcclxuICB9O1xyXG4gICIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxJRDogJ1ZBTElEJyxcclxuICBJTlZBTElEOiAnSU5WQUxJRCcsXHJcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRSdcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0geyB2YWxpZGF0aW9uOiB7fSB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuXHJcbiAgbGV0IG5leHRTdGF0ZSA9IG51bGw7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5kZWJ1Z2dlcjtcclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG5cclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5QVVRfRk9DVVNFRDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICBbYWN0aW9uLnByb3BOYW1lXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE46XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2Zvcm1SZWR1Y2VyJztcclxuY29uc3QgRm9ybUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9ybUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRm9ybUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VGb3JtQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBGb3JtUHJvdmlkZXInKTtcclxuICB9XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4geyBzdGF0ZSwgZGlzcGF0Y2ggfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1Qcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihmb3JtUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8Rm9ybUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2NvbnN0cmFpbnRcclxuICBFTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjogJ1BBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBFTVBUWV9TVFJJTkdfVkFMSURBVElPTjogJ0VNUFRZX1NUUklOR19WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjogJ1BBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OJyxcclxuICAvL2F1dGhcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnSU5WQUxJRF9DUkVERU5USUFMUycsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICdVU0VSTkFNRV9UQUtFTicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ1JFR0lTVEVSRURfRU1BSUwnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnRU1BSUxfTk9UX1JFR0lTVEVSRUQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOidVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCcsXHJcbiAgQUNDT1VOVF9BTFJFQURZX0VYSVNUUzonQUNDT1VOVF9BTFJFQURZX0VYSVNUUydcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIElOVkFMSURfUEFTU1dPUkQ6XHJcbiAgICAnYXQgbGVhc3QgOCBjaGFyYWN0ZXJzLCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMSB1cHBlcmNhc2UgbGV0dGVyLCAxIGxvd2VyY2FzZSBsZXR0ZXIsIENhbiBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycycsXHJcbiAgSU5WQUxJRF9FTUFJTDogJ2VtYWlsIGZvcm1hdCBpcyBub3QgdmFsaWQnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnZW1haWwgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOiAndXNlcm5hbWUgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUU6XHJcbiAgICAnb25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWQnLFxyXG4gIElOVkFMSURfRU1QVFlfU1RSSU5HOiAnZW1wdHkgc3RyaW5nIGlzIG5vdCBhbGxvd2VkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMOiAnZW1haWwgb3IgdXNlcm5hbWUgaXMgbm90IHZhbGlkJyxcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICd1c2VybmFtZSBpcyBhbHJlYWR5IHRha2VuJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnZW1haWwgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyxcclxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcsXHJcbiAgXHJcbiAgQUNDT1VOVF9BTFJFQURZX0VYSVNUUzonQWNjb3VudCBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyB1c2VybmFtZS4nXHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBwYXNzd29yZFJlZ2V4ID0gL14oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbYS16QS1aXSkuezgsfSQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcclxuIiwiaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNDbGllbnRWYWxpZGF0aW9uVHlwZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIHtcclxuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xyXG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG4gIGlmICghcGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHVzZXJuYW1lKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWUgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KSB7XHJcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pIHtcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID1hdXRoO1xyXG5kZWJ1Z2dlcjtcclxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBhY2NvdW50QWxyZWFkeUV4aXRzOjIwMixcclxuICAvL2xvZ2luXHJcbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxyXG4gIC8vc2lnbnVwXHJcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcclxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXHJcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcclxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxyXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXHJcbiAgLy9sb2dpblxyXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcclxuICBlbXB0eVN0cmluZ05vdFZhbGlkOiAnNDA5JyxcclxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcclxuICB1c2VybmFtZUlzTm90UmVnaXN0ZXJlZDonNDExJyxcclxuLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXHJcbiAgdG9rZW5FeHBpcmVkOic0MTMnLFxyXG4gIHNlcnZlclZhbGlkYXRpb25SYW5nZTogc3RhdHVzID0+IHtcclxuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG4iLCJcclxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbnMgZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBjb25zdFZhbFR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZSwgdmFsdWUsIHN0YXRlLGF1dGggfSkge1xyXG5cclxuICBsZXQgdmFsaWRhdGlvbiA9IG51bGw7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoe1xyXG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe1xyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICBcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTiwgLi4udmFsaWRhdGlvbiB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdEZvcm1WYWxpZGF0aW9uU3RhdGUoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURSwgdmFsaWRhdGlvblR5cGUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluY0lucHV0Q291bnQoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROIH07XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAgfSkge1xyXG5kZWJ1Z2dlclxyXG4gIHN3aXRjaCAoc3RhdHVzKSB7XHJcbiAgICBjYXNlIDEwMTpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5jcmVkZW50aWFsSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIDEyNTpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSAyMDM6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIDIwMjpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzVGFrZW46XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlTdHJpbmdOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSAyMDA6XHJcbiAgICAgIFxyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi4vYXV0aC9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7c2VydmVyVmFsaWRhdGlvbn0gZnJvbSAnLi4vZm9ybS9hY3Rpb25zJ1xyXG5leHBvcnQgZnVuY3Rpb24gc2lnblVwKHtkaXNwYXRjaCxzdGF0ZSxmb3JtRGlzcGF0Y2h9KSB7XHJcbiAgICBjb25zdCB7dXNlcm5hbWUscGFzc3dvcmQsZW1haWx9PXN0YXRlXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRH0pXHJcbiAgICAvLyBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHVzZXIgY2xhc3NcclxuICAgIHZhciB1c2VyID0gbmV3IFBhcnNlLlVzZXIoKTtcclxuICAgIHVzZXIuc2V0KFwidXNlcm5hbWVcIiwgdXNlcm5hbWUpO1xyXG4gICAgdXNlci5zZXQoXCJwYXNzd29yZFwiLCBwYXNzd29yZCk7XHJcbiAgICB1c2VyLnNldChcImVtYWlsXCIsIGVtYWlsKTtcclxuICBkZWJ1Z2dlcjtcclxuICAgIC8vIG90aGVyIGZpZWxkcyBjYW4gYmUgc2V0IGp1c3QgbGlrZSB3aXRoIFBhcnNlLk9iamVjdFxyXG4gICAgdXNlci5zaWduVXAoKS50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICBsZXQgdXNlcm5hbWUgPSB1c2VyLmdldChcInVzZXJuYW1lXCIpXHJcbiAgICAgICAgbGV0IGVtYWlsID11c2VyLmdldChcImVtYWlsXCIpXHJcbiAgICAgICAgbGV0IHRva2VuID11c2VyLmdldCgnc2Vzc2lvblRva2VuJykgXHJcbiAgICAgICAgY29uc3QgdXMgPXVzZXI7XHJcbiAgICAgICAgZGVidWdnZXJcclxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUyx1c2VybmFtZSxlbWFpbCx0b2tlbn0pXHJcbiAgICAgICAgY29uc29sZS5sb2coJ1VzZXIgY3JlYXRlZCBzdWNjZXNzZnVsIHdpdGggbmFtZTogJyArIHVzZXIuZ2V0KFwidXNlcm5hbWVcIikgKyAnIGFuZCBlbWFpbDogJyArIHVzZXIuZ2V0KFwiZW1haWxcIiksK3VzZXIuZ2V0KCdzZXNzaW9uVG9rZW4nKSk7XHJcblxyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIGNvbnN0IGVyciA9ZXJyb3JcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGV9KSlcclxuICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgZXJyb3IuY29kZSArIFwiIFwiICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9naW4oe2Rpc3BhdGNoLHN0YXRlLGZvcm1EaXNwYXRjaH0pIHtcclxuICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZH09IHN0YXRlXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEfSlcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSB1c2VyIGNsYXNzXHJcbiAgICB2YXIgdXNlciA9ICBQYXJzZS5Vc2VyLmxvZ0luKGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIGxldCB1c2VybmFtZSA9IHVzZXIuZ2V0KFwidXNlcm5hbWVcIilcclxuICAgICAgICBsZXQgZW1haWwgPXVzZXIuZ2V0KFwiZW1haWxcIilcclxuICAgICAgICBsZXQgdG9rZW4gPXVzZXIuZ2V0KCdzZXNzaW9uVG9rZW4nKSBcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLHVzZXJuYW1lLGVtYWlsLHRva2VufSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1VzZXIgY3JlYXRlZCBzdWNjZXNzZnVsIHdpdGggbmFtZTogJyArIHVzZXIuZ2V0KFwidXNlcm5hbWVcIikgKyAnIGFuZCBlbWFpbDogJyArIHVzZXIuZ2V0KFwiZW1haWxcIikpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIGNvbnN0IGVyciA9ZXJyb3JcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goc2VydmVyVmFsaWRhdGlvbih7c3RhdHVzOmVycm9yLmNvZGV9KSlcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoe2Rpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNofSkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgUGFyc2UuVXNlci5yZXF1ZXN0UGFzc3dvcmRSZXNldChlbWFpbCkudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyxcclxuICAgICAgICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgICAgICAgbWVzc2FnZTogYEEgbGluayBmb3IgcGFzc3dvcmQgY2hhbmdlICBoYXMgYmVlbiBzZW50IHRvLCAke2VtYWlsfSEgYCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlBhc3N3b3JkIHJlc2V0IHJlcXVlc3Qgd2FzIHNlbnQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zdCBlcnI9ZXJyb3I7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGxvZ2luIGZhaWxlZCB3aXRoIGVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbn0iLCJpbXBvcnQge3VzZUF1dGhDb250ZXh0fSBmcm9tICcuLi9hdXRoL2F1dGgtY29udGV4dCdcclxuaW1wb3J0IHt1c2VGb3JtQ29udGV4dH0gZnJvbSAnLi4vZm9ybS9mb3JtLWNvbnRleHQnXHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hdXRoLWFjdGlvbnMnXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VQYXJzZUF1dGgoKXtcclxuY29uc3Qge3N0YXRlLGRpc3BhdGNofT0gdXNlQXV0aENvbnRleHQoKVxyXG5jb25zdCB7ZGlzcGF0Y2g6Zm9ybURpc3BhdGNofT0gdXNlRm9ybUNvbnRleHQoKVxyXG4gICAgZnVuY3Rpb24gc2lnbnVwKCl7XHJcbiAgICAgICAgYWN0aW9ucy5zaWduVXAoe3N0YXRlLGRpc3BhdGNoLGZvcm1EaXNwYXRjaH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBsb2dpbiAoKXtcclxuICAgICAgICBhY3Rpb25zLmxvZ2luKHtzdGF0ZSxkaXNwYXRjaCxmb3JtRGlzcGF0Y2h9KSAgXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCgpe1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGFjdGlvbnMuZm9yZ290UGFzc3dvcmQoe3N0YXRlLGRpc3BhdGNoLGZvcm1EaXNwYXRjaH0pICBcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKCl7XHJcblxyXG4gICAgfVxyXG4gICBcclxuXHJcbiAgICByZXR1cm4ge3NpZ251cCxsb2dpbixjaGFuZ2VQYXNzd29yZCxmb3Jnb3RQYXNzd29yZH1cclxuXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuXHJcbmltcG9ydCB7RmVhdHVyZVJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHt1c2VQYXJzZUF1dGh9IGZyb20gJy4uL3BhcnNlL3VzZVBhcnNlQXV0aCdcclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi9Mb2dpbicpKTtcclxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9DaGFuZ2VQYXNzd29yZCcpKTtcclxuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vU2lnbnVwJykpO1xyXG5jb25zdCBQcm9maWxlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vUHJvZmlsZScpKTtcclxuY29uc3QgQXV0aEZlZWRiYWNrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vQXV0aEZlZWRiYWNrJykpO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYXJzZUF1dGhlbnRpY2F0aW9uKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IHtzaWdudXAsbG9naW4sY2hhbmdlUGFzc3dvcmQsZm9yZ290UGFzc3dvcmR9PXVzZVBhcnNlQXV0aCgpXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgY2hhbmdlUGFzc3dvcmQ9e2NoYW5nZVBhc3N3b3JkfSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9sb2dpbic+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPExvZ2luIGxvZ2luPXtsb2dpbn0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvc2lnbnVwJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8U2lnbnVwIHNpZ251cD17c2lnbnVwfS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9mb3Jnb3RwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkICBmb3Jnb3RQYXNzd29yZD17Zm9yZ290UGFzc3dvcmR9Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3Byb2ZpbGUnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQcm9maWxlIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEF1dGhGZWVkYmFjayAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgQXBwUm91dGUgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IEhvbWUgfSBmcm9tICcuL0hvbWUnO1xyXG5pbXBvcnQgUGFyc2VBdXRoZW50aWNhdGlvbiBmcm9tICcuLi9hdXRoL1BhcnNlQXV0aGVudGljYXRpb24nO1xyXG5pbXBvcnQgeyBGb3JtUHJvdmlkZXIgfSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCc7XHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2hhbmdvdXRzJykpO1xyXG5jb25zdCBHcm91cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9ncm91cC9ncm91cCcpKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZXMoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMTAwJScgfX0+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2F1dGhcIj5cclxuICAgICAgICA8Rm9ybVByb3ZpZGVyPlxyXG4gICAgICAgICAgPFBhcnNlQXV0aGVudGljYXRpb24gLz5cclxuICAgICAgICA8L0Zvcm1Qcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvXCI+XHJcbiAgICAgICAgPEhvbWUgLz5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuXHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BcHBSb3V0ZT5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvZ3JvdXBcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8R3JvdXAgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuXHJcbmltcG9ydCB7QXBwTmF2aWdhdGlvbn0gZnJvbSAnLi9BcHBOYXZpZ2F0aW9uJ1xyXG5pbXBvcnQge0FwcFJvdXRlc30gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcbmltcG9ydCAnLi9jc3MvYXBwLmNzcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzk1dmgnIH19PlxyXG4gICAgIDxBcHBOYXZpZ2F0aW9uLz5cclxuICAgICAgPEFwcFJvdXRlcy8+XHJcbiAgICAgIHsnJ31cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlUHJvdmlkZXIgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XHJcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSAnLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnLi4vdGhlbWUvdGhlbWUtY29udGV4dCc7XHJcbmltcG9ydCB7IE5hdlByb3ZpZGVyIH0gZnJvbSAnLi4vbmF2L05hdlByb3ZpZGVyJztcclxuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi9BcHAnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwUHJvdmlkZXJzKHsgY2hpbGRyZW4gfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8VGhlbWVQcm92aWRlclxyXG4gICAgICBpbml0U3RhdGU9e3tcclxuICAgICAgICBwcmltYXJ5OiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXHJcbiAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgSGVsdmV0aWNhLCBcIkFyaWFsXCInLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxBcHBSb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgdGl0bGU9XCJXZWJjb21cIlxyXG4gICAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnIH19XHJcbiAgICAgID5cclxuICAgICAgICA8QXV0aFByb3ZpZGVyPlxyXG4gICAgICAgICAgPE5hdlByb3ZpZGVyPlxyXG4gICAgICAgICAgICA8SGFuZ291dHNQcm92aWRlciBzb2NrZXRVcmw9e2B3c3M6Ly8ke2lwfTozMDAwL2hhbmdvdXRzYH0+XHJcbiAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgICAgICA8L05hdlByb3ZpZGVyPlxyXG4gICAgICAgIDwvQXV0aFByb3ZpZGVyPlxyXG4gICAgICA8L0FwcFJvdXRlUHJvdmlkZXI+XHJcbiAgICA8L1RoZW1lUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgJ3doYXR3Zy1mZXRjaCc7XHJcbmltcG9ydCB7IGgsIHJlbmRlciB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEFwcFByb3ZpZGVycyB9IGZyb20gJy4vQXBwUHJvdmlkZXJzJztcclxuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi9BcHAnO1xyXG5QYXJzZS5pbml0aWFsaXplKFwienR0cG5xVHI4cmVma3RCV05la1poWnhTeHdQYUFBbkVsUTlrN0N1QVwiLFwiUTdTSFNGTEc2MThpemJ5U01wQXNGQXFnbk9MYVlneE5sd2ZGaE9BclwiKTsgLy9QQVNURSBIRVJFIFlPVVIgQmFjazRBcHAgQVBQTElDQVRJT04gSUQgQU5EIFlPVVIgSmF2YVNjcmlwdCBLRVlcclxuUGFyc2Uuc2VydmVyVVJMID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9wYXJzZSdcclxucmVuZGVyKFxyXG4gIDxBcHBQcm92aWRlcnM+XHJcbiAgICA8QXBwIC8+XHJcbiAgPC9BcHBQcm92aWRlcnM+LFxyXG5cclxuICBkb2N1bWVudC5ib2R5XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJmZXRjaCIsInQiLCJyIiwidSIsImkiLCJvIiwiZiIsImMiLCJlIiwiYSIsInYiLCJtIiwieCIsInAiLCJzIiwiVCIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiRmVhdHVyZVJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImRpc3BhdGNoIiwiZmluZCIsInVzZUFwcFJvdXRlIiwib25BcHBSb3V0ZSIsIkFwcFJvdXRlIiwiQXBwUm91dGVQcm92aWRlciIsImluaXRTdGF0ZSIsInVzZVJlZHVjZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIkNMRUFSRURfSEFOR09VVCIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJTT0NLRVRfTUVTU0FHRV9SRUNJRVZFRCIsIk1FU1NBR0VTX1VQREFURUQiLCJIQU5HT1VUU19VUERBVEVEIiwiSEFOR09VVF9VUERBVEVEIiwiVU5SRUFEX0hBTkdPVVRTX1VQREFURUQiLCJDT05ORUNUSU5HIiwiT1BFTiIsIkNMT1NJTkciLCJDTE9TRUQiLCJTT0NLRVRfUkVBRFkiLCJTT0NLRVRfRVJST1IiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJ1bnJlYWRoYW5nb3V0cyIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwic29ja2V0IiwicmVhZHlTdGF0ZSIsInNvY2tldE1lc3NhZ2UiLCJ0ZXh0IiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJGSUxURVJfSEFOR09VVFMiLCJmaWx0ZXIiLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwibG9hZEhhbmdvdXRzIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJyZXNldEhhbmdvdXQiLCJzZWxlY3RVbnJlYWQiLCJzZWFyY2hIYW5nb3V0cyIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJjaGFuZ2VNZXNzYWdlVGV4dCIsImxvYWRNZXNzYWdlcyIsImtleSIsInVwZGF0ZVJlYWRIYW5nb3V0cyIsIm5hbWUiLCJtZXNzYWdlIiwidW5yZWFkaGFuZ291dHNLZXkiLCJsZW5ndGgiLCJ1cGRhdGVkdW5yZWFkIiwibWFwIiwicmVhZCIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJoYW5nb3V0S2V5IiwiaGFuZ291dEluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwidXBkYXRlUmVhZE1lc3NzYWdlcyIsIm1lc3NhZ2VLZXkiLCJ1cGRhdGVkTWVzc2FnZXMiLCJoYW5nb3V0U3RhdGVzIiwiSU5WSVRFUiIsIkFDQ0VQVEVSIiwiREVDTElORVIiLCJCTE9DS0VSIiwiVU5CTE9DS0VSIiwiTUVTU0FOR0VSIiwiSU5WSVRFRCIsIkFDQ0VQVEVEIiwiREVDTElORUQiLCJCTE9DS0VEIiwiVU5CTE9DS0VEIiwiTUVTU0FHRUQiLCJ1cGRhdGVEZWxpdmVyZWRIYW5nb3V0Iiwib2ZmbGluZSIsInRpbWVzdGFtcCIsImRlbGl2ZXJlZEhhbmdvdXQiLCJkZWxpdmVyZWQiLCJ1cGRhdGVEZWxpdmVyZWRNZXNzYWdlIiwidXBkYXRlQm9ja2VkU3RhdGUiLCJvZmZsaW5lSGFuZ291dEtleSIsIm9mZmxpbmVoYW5nb3V0cyIsImRlbGl2ZXJlZE1lc3NhZ2UiLCJibG9ja2VkTWVzc2FnZSIsInNhdmVNZXNzYWdlZCIsInNhdmVJbnZpdGVkIiwic2F2ZUFjY2VwdGVkIiwic2F2ZURlY2xpbmVkIiwic2F2ZUJsb2NrZWQiLCJzYXZlVW5ibG92a2VkIiwic2F2ZVJlY2lldmVkSGFuZ291dCIsImZvY3VzZWRIYW5nb3V0IiwidW5yZWFkIiwiaGFuZ291dEV4aXN0IiwiaGciLCJ1cGRhdGVkSGFuZ291dHMiLCJzYXZlUmVjaWV2ZWRNZXNzYWdlIiwic2F2ZVVucmVhZEhhbmdvdXQiLCJ1cGRhdGVkdW5yZWFkcyIsInNhdmVJbnZpdGVyIiwic2F2ZUFjY2VwdGVyIiwic2F2ZUJsb2NrZXIiLCJzYXZlRGVjbGluZXIiLCJzYXZlTWVzc2FuZ2VyIiwic2F2ZVVuYmxvY2tlciIsInVzZVNvY2tldE1lc3NhZ2UiLCJoYW5kbGVBY2tub3dsZWRnZW1lbnQiLCJoYW5kbGVIYW5nb3V0IiwiaGFuZGxlSGFuZ291dHMiLCJmb3JFYWNoIiwidXNlRWZmZWN0IiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImNvbmZpcm0iLCJjdXJyZW50IiwiZW1haWxvcnVzZXJuYW1lIiwidG9rZW4iLCJpc0xvZ2dlZEluIiwiaXNQYXNzd29yZENoYW5nZWQiLCJhdXRoRmVlZGJhY2siLCJhdXRoUmVkdWNlciIsIm5leHRTdGF0ZSIsInBheWxvYWQiLCJwcm9wTmFtZSIsInN1Y2Nlc3NNZXNzYWdlIiwiQXV0aFJvdXRlQ29udGV4dCIsIkF1dGhSb3V0ZVByb3ZpZGVyIiwiaW5pdGlhbFJvdXRlIiwiYXV0aFJvdXRlIiwic2V0QXV0aFJvdXRlIiwidXNlU3RhdGUiLCJBdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwidXNlV2ViU29ja2V0Iiwic29ja2V0VXJsIiwic29jayIsIldlYlNvY2tldCIsIm9ubWVzc2FnZSIsIm1zZyIsImRhdGEiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIkhhbmdvdXRDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJIYW5nb3V0c1Byb3ZpZGVyIiwiYXV0aENvbnRleHQiLCJ3ZWJzb2NrZXRIYW5kbGVyIiwiaGFuZGxlVXNlU29ja2V0TWVzc2FnZSIsInVwZGF0ZWQiLCJUaGVtZUNvbnRleHQiLCJ1c2VUaGVtZUNvbnRleHQiLCJUaGVtZVByb3ZpZGVyIiwic2V0U3RhdGUiLCJOYXZDb250ZXh0IiwidXNlTmF2Q29udGV4dCIsInVzZU5hdmlnYXRpb24iLCJkcmF3ZXJPcGVuIiwic2V0RHJhd2VyT3BlbiIsInRvZ2dsZURyYXdlciIsInByZXYiLCJOYXZQcm92aWRlciIsIkUiLCJ3IiwiQyIsImwiLCJBIiwiRiIsIk4iLCJNIiwiUCIsImgiLCJEIiwiSCIsIiQiLCJxIiwiTmF2SXRlbSIsIkxpc3QiLCJMaXN0SXRlbSIsInZhbHVlQ2hhbmdlZCIsImxvZ291dCIsIndpbmRvdyIsInJlbW92ZUl0ZW0iLCJnZXRUb2tlbkZyb21VcmwiLCJyZWNvdmVyTG9jYWxBdXRoU3RhdGUiLCJzdHlsZSIsImdyaWQiLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImp1c3RpZnlJdGVtcyIsInBhZGRpbmciLCJBdXRoRHJhd2VyQ29udGVudCIsImhhbmRsZVJvdXRlIiwicHJldmVudERlZmF1bHQiLCJpZCIsInRhcmdldCIsInBhZGRpbmdUb3AiLCJoZWlnaHQiLCJBdXRoZWRTdGF0ZSIsInVzZXJOYW1lIiwiaGFuZGxlTG9nT3V0IiwiYWxpZ25JdGVtcyIsImZsZXhEaXJlY3Rpb24iLCJ1c2VySWNvbiIsInBhZGRpbmdSaWdodCIsIm1hcmdpbkJvdHRvbSIsIlVuQXV0aGVkU3RhdGUiLCJ1c2VVc2VyTmFtZSIsInNldFVzZXJuYW1lIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsIkhhbmdvdXREcmF3ZXJDb250ZW50IiwiY291bnQiLCJ3aWR0aCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwidGV4dEFsaWduIiwiYm9yZGVyUmFkaXVzIiwianVzdGlmeUNvbnRlbnQiLCJNZXNzYWdlIiwiU2V0dGluZ3MiLCJmaWxsIiwib25DbGljayIsImJvcmRlciIsIk9ubGluZVN0YXR1cyIsIklzT25saW5lIiwiSXNPZmZsaW5lIiwiQ29ubmVjdGluZyIsIkNsb3NpbmciLCJzYXZlUGVuZGluZ0hhbmdvdXQiLCJpc0Jsb2NrZXIiLCJzYXZlSGFuZ291dCIsInNhdmVNZXNzYWdlIiwiYmxvY2tlciIsIkRhdGUiLCJub3ciLCJmbG9hdCIsInNlbmRPZmZsaW5lSGFuZ291dHMiLCJvZmZsaW5lSGFuZ291dHMiLCJmb3JlRWFjaCIsInNlbmQiLCJjb21tYW5kIiwicmVtb3ZlSGFuZ291dEZyb21VbnJlYWQiLCJmaWx0ZXJlZEhhbmdvdXRzIiwidXNlSGFuZ291dHMiLCJ1c2VycyIsIm9uUmVtb3ZlVW5yZWFkIiwiY3VycmVudFRhcmdldCIsIm9uTmF2aWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsIm9uU2VsZWN0SGFuZ291dCIsIm9uU2VsZWN0VW5yZWFkIiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwib25NZXNzYWdlVGV4dCIsIm9uSGFuZ291dCIsIkhhbmdvdXRUb3BNZW51IiwibmF2VG9VbnJlYWQiLCJkcmF3ZXIiLCJib3hTaGFkb3ciLCJwb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJ6SW5kZXgiLCJ1c2VNZWRpYVF1ZXJ5Iiwic2V0V2lkdGgiLCJzZXRIZWlnaHQiLCJvcmllbnRhdGlvbiIsInNldE9yaWVudGF0aW9uIiwiZGV2aWNlIiwic2V0RGV2aWNlIiwiaGFuZGxlVmlld3BvcnRTaXplIiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwiaGFuZGxlU2NyZWVuT3JpZW50YXRpb24iLCJzY3JlZW4iLCJjb25zb2xlIiwibG9nIiwiYWRkRXZlbnRMaXN0ZW5lciIsIkRyYXdlciIsIm9wZW4iLCJBcHBCYXIiLCJ0aGVtZSIsInByaW1hcnkiLCJtaW5IZWlnaHQiLCJNZW51V2hpdGUiLCJNZW51IiwiQXBwTmF2aWdhdGlvbiIsImZsZXgiLCJIb21lIiwiSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUiLCJSRVNFVF9WQUxJREFUSU9OX1NUQVRFIiwiSU5QVVRfQkxVUlJFRCIsIklOUFVUX0ZPQ1VTRUQiLCJTRVJWRVJfVkFMSURBVElPTiIsIkNMSUVOVF9WQUxJREFUSU9OIiwiSU5DX0lOUFVUX0NPVVROIiwiVkFMSUQiLCJJTlZBTElEIiwiSU5BQ1RJVkUiLCJ2YWxpZGF0aW9uIiwiZm9ybVJlZHVjZXIiLCJ2YWxpZGF0aW9uVHlwZSIsInZhbGlkYXRpb25TdGF0ZSIsImZvcm1TdGF0ZSIsIkZvcm1Db250ZXh0IiwidXNlRm9ybUNvbnRleHQiLCJGb3JtUHJvdmlkZXIiLCJFTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIkFDQ09VTlRfQUxSRUFEWV9FWElTVFMiLCJJTlZBTElEX1BBU1NXT1JEIiwiSU5WQUxJRF9FTUFJTCIsIklOVkFMSURfVVNFUk5BTUUiLCJJTlZBTElEX0VNUFRZX1NUUklORyIsIklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwiLCJQQVNTV09SRFNfRE9fTk9UX01BVENIIiwicGFzc3dvcmRSZWdleCIsImVtYWlsUmVnZXgiLCJ1c2VybmFtZVJlZ2V4IiwidmFsaWRhdGVFbWFpbENvbnN0cmFpbnQiLCJlbWFpbENvbnN0cmFpbnQiLCJSZWdFeHAiLCJ0ZXN0IiwidmFsaWRhdGlvblR5cGVzIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwiaXNDbGllbnRWYWxpZGF0aW9uVHlwZSIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSIsInZhbGlkYXRlRW1wdHlTdHJpbmciLCJ2YWxpZGF0ZVBhc3N3b3JkTWF0Y2giLCJhdXRoIiwiYWNjb3VudEFscmVhZHlFeGl0cyIsImNyZWRlbnRpYWxJbnZhbGlkIiwidXNlcm5hbWVJc1Rha2VuIiwiZW1haWxJc1JlZ2lzdGVyZWQiLCJ1c2VybmFtZUludmFsaWQiLCJwYXNzd29yZEludmFsaWQiLCJlbWFpbEludmFsaWQiLCJlbWFpbElzTm90UmVnaXN0ZXJlZCIsImVtcHR5U3RyaW5nTm90VmFsaWQiLCJlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZCIsInVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkIiwicGFzc3dvcmREb05vdE1hdGNoIiwidG9rZW5FeHBpcmVkIiwic2VydmVyVmFsaWRhdGlvblJhbmdlIiwic3RhdHVzIiwiY2xpZW50VmFsaWRhdGlvbiIsImNvbnN0VmFsVHlwZXMiLCJ2YWxpZGF0aW9ucyIsInJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUiLCJzZXJ2ZXJWYWxpZGF0aW9uIiwiaHR0cFN0YXR1cyIsInZhbGlkYXRpb25TdGF0ZXMiLCJzaWduVXAiLCJmb3JtRGlzcGF0Y2giLCJQYXJzZSIsIlVzZXIiLCJzZXQiLCJ0aGVuIiwiZ2V0IiwiY2F0Y2giLCJjb2RlIiwibG9naW4iLCJsb2dJbiIsImZvcmdvdFBhc3N3b3JkIiwicmVxdWVzdFBhc3N3b3JkUmVzZXQiLCJyZXN1bHQiLCJ1c2VQYXJzZUF1dGgiLCJzaWdudXAiLCJhY3Rpb25zIiwiY2hhbmdlUGFzc3dvcmQiLCJMb2dpbiIsImxhenkiLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwiUHJvZmlsZSIsIkF1dGhGZWVkYmFjayIsIlBhcnNlQXV0aGVudGljYXRpb24iLCJTdXNwZW5zZSIsIkhhbmdvdXRzIiwiR3JvdXAiLCJBcHBSb3V0ZXMiLCJBcHAiLCJBcHBQcm92aWRlcnMiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsImlwIiwiaW5pdGlhbGl6ZSIsInNlcnZlclVSTCIsInJlbmRlciIsImRvY3VtZW50IiwiYm9keSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxPQUFPLEdBQUc7QUFDZCxFQUFFLFlBQVksRUFBRSxpQkFBaUIsSUFBSSxJ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R0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLE1BQUs7QUFDN0QsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLElBQUksRUFBRTtBQUM3QyxFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUM7QUFDdEMsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxJQUFJLEVBQUU7QUFDdkMsRUFBRSxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBQztBQUM1QixFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7QUFDL0MsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxJQUFJLEVBQUU7QUFDdkMsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRCxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDOUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUM7QUFDdkQsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ3hELEVBQUUsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQzdCLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QyxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENB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LENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBeUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXVHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBa0QsU0FBU2MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUF5TixTQUFTLENBQUMsRUFBRSxDQUFDRSxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDYixHQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTTCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDUCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0osR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2MsR0FBQyxDQUFDLENBQUNkLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUNmLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDSSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRCxHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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Q0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ELEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFQSxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsQ0FBb1QsSUFBSUMsR0FBQyxDQUFDOU8sQ0FBQyxDQUFDLEdBQUcsQ0FBK0tBLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOE8sR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBSSxJQUFpUkMsR0FBQyxDQUFDL08sQ0FBQyxDQUFDLElBQUksU0FBU2dQLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ04sR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQ00sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPN08sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUNKLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMrTyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJRixDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNELEdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDNU8sQ0FBQyxDQUFDeU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJSyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUlMLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQW9lLElBQUlFLEdBQUMsQ0FBQyxrT0FBa08sQ0FBQ1AsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsSUFBSVEsR0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUE2TSxJQUFJLENBQUMsQ0FBQ3JQLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUlzUCxHQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUN2UCxDQUFDLENBQUMsS0FBSyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQ3FQLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUdDLEdBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLEdBQUdILENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFD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
