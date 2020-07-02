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

var t$1,r$1,u$1,i$1=[],o$1=n.__r,f$1=n.diffed,c$1=n.__c,e$1=n.unmount;function a$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v$1(n){return m$1(x$1,n)}function m$1(n,u,i){var o=a$1(t$1++);return o.__c||(o.__c=r$1,o.__=[i?i(u):x$1(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p$1(n,u){var i=a$1(t$1++);q(i.__H,u)&&(i.__=n,i.__H=u,r$1.__H.__h.push(i));}function s$1(n,r){var u=a$1(t$1++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__;var i=a$1(t$1++);return null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value}function F(){i$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(_$1),t.__H.__h.forEach(g$1),t.__H.__h=[];}catch(r){return t.__H.__h=[],n.__e(r,t.__v),!0}}),i$1=[];}function _$1(n){n.t&&n.t();}function g$1(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o$1&&o$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.__h.forEach(_$1),r$1.__H.__h.forEach(g$1),r$1.__H.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i$1.push(r)&&u$1===n.requestAnimationFrame||((u$1=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_$1),t.__h=t.__h.filter(function(n){return !n.__||g$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c$1&&c$1(t,r);},n.unmount=function(t){e$1&&e$1(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

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
async function fetchHangouts({
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
    fetchHangouts: fetchHangouts$1,
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
    if (fetchHangouts$1) {
      fetchHangouts({
        dispatch,
        search,
        username
      });
    }
  }, [fetchHangouts$1]);
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
  {
    return h(WebSocketContainer, props);
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
function NavigationProvider(props) {
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
  }, h(AuthProvider, null, h(NavigationProvider, null, h(HangoutsProvider, null, h(HangoutAdapter, {
    socketUrl: `wss://${"localhost"}:3000`
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 5% auto',
    justifyItems: 'center',
    padding: 16
  }
};
function AuthDrawerContent({
  toggleDrawer
}) {
  const {
    device
  } = useMediaQuery();
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

    if (device === 'phone') {
      toggleDrawer();
    }
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

function HangoutDrawerContent({
  toggleDrawer
}) {
  const {
    device
  } = useMediaQuery();
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

    if (device === 'phone') {
      toggleDrawer();
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

function E$1(n,t){for(var e in t)n[e]=t[e];return n}function w$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var C$1=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return w$1(this.props,n)||w$1(this.state,t)},r}(m);var A$1=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),A$1&&A$1(n);};var F$1=n.__e;function N$1(n){return n&&((n=E$1({},n)).__c=null,n.__k=n.__k&&n.__k.map(N$1)),n}function U(){this.__u=0,this.o=null,this.__b=null;}function M$1(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function L(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function O(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);F$1(n,t,e);},(U.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=M$1(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},U.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=N$1(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var P$1=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(O.prototype=new m).u=function(n){var t=this,e=M$1(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),P$1(t,n,r)):o();};e?e(u):u();}},O.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},O.prototype.componentDidUpdate=O.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){P$1(n,e,t);});};var W=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var D$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var H$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var Z=n.event;function I(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){Z&&(n=Z(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var $$1={configurable:!0,get:function(){return this.class}},q$1=n.vnode;n.vnode=function(n){n.$$typeof=H$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&($$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",$$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=D$1.test(u))break;if(r)for(u in o=n.props={},e)o[D$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&(I(t.prototype,"componentWillMount"),I(t.prototype,"componentWillReceiveProps"),I(t.prototype,"componentWillUpdate"),t.m=!0);}q$1&&q$1(n);};

function Home() {
  return h("div", {
    "data-testid": "home",
    style: {
      paddingTop: 68
    }
  }, "Home");
}

const Login = L(() => import('./Login-6d30df0f.js'));
const ChangePassword = L(() => import('./ChangePassword-51da4eb4.js'));
const ForgotPassword = L(() => import('./ForgotPassword-feaced8e.js'));
const Signup = L(() => import('./Signup-f07529f7.js'));
const Profile = L(() => import('./Profile-c3908f26.js'));
const AuthFeedback = L(() => import('./AuthFeedback-e6aa54a4.js'));

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
      dispatch({
        type: actionTypes$2.LOGIN_FAILED
      });
      errors.forEach(error => {// formDispatch(
        //   serverValidation({
        //     status: error,
        //   })
        // );
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
      errors.forEach(error => {// formDispatch(
        //   serverValidation({
        //     status: error,
        //   })
        // );
      });
      dispatch({
        type: actionTypes$2.SIGNUP_FAILED
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
      errors.forEach(error => {// formDispatch(
        //   serverValidation({
        //     status: error,
        //   })
        // );
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
      errors.forEach(error => {// formDispatch(
        //   serverValidation({
        //     status: error,
        //   })
        // );
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

  function login$1() {
    login({
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

  function forgotPassword$1() {
    forgotPassword({
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
    login: login$1,
    forgotPassword: forgotPassword$1,
    changePassword: changePassword$1
  };
}

const Login$1 = L(() => import('./Login-6d30df0f.js'));
const ChangePassword$1 = L(() => import('./ChangePassword-51da4eb4.js'));
const ForgotPassword$1 = L(() => import('./ForgotPassword-feaced8e.js'));
const Signup$1 = L(() => import('./Signup-f07529f7.js'));
const Profile$1 = L(() => import('./Profile-c3908f26.js'));
const AuthFeedback$1 = L(() => import('./AuthFeedback-e6aa54a4.js'));
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

const Hangouts = L(() => import('./Hangout-b2feed49.js'));
function AppRoutes() {
  return h("div", {
    style: {
      height: '100%',
      backgroundColor: 'yellow'
    }
  }, h(AppRoute, {
    path: "/auth"
  }, "PREACT_APP_NODEJS" === 'PREACT_APP_PARSE' ,  h(NodeAuthentication, null)), h(AppRoute, {
    path: "/"
  }, h(Home, null)), h(AppRoute, {
    path: "/hangouts"
  }, h(U, {
    fallback: h("div", null, "loading...")
  }, h(Hangouts, null))));
}

function AppNavigation() {
  const [drawerIsOpen, setDrawerState] = v$1(false);
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

  function toggleDrawer() {
    setDrawerState(prev => !prev);
  }

  return h("div", {
    style: {
      display: 'flex',
      width: '100%',
      height: '100%'
    }
  }, drawerIsOpen && h(Drawer, {
    style: {
      position: 'absolute'
    },
    toggleDrawer: toggleDrawer
  }, h(AuthDrawerContent, {
    toggleDrawer: toggleDrawer
  }), h(HangoutDrawerContent, {
    toggleDrawer: toggleDrawer
  })), h("div", {
    style: {
      flex: 1
    }
  }, h(AppBar, null, h(Menu, {
    onClick: toggleDrawer
  }), h(NavItem, {
    style: {
      flex: 5
    }
  }, "WEB COM"), h(HangoutTopMenu, null)), h(AppRoutes, null)));
}

var css_248z$2 = "* {\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\n/* width */\r\n::-webkit-scrollbar {\r\n  width: 5px;\r\n}\r\n\r\n/* Track */\r\n::-webkit-scrollbar-track {\r\n  background: #f1f1f1;\r\n}\r\n\r\n/* Handle */\r\n::-webkit-scrollbar-thumb {\r\n  background: #888;\r\n}\r\n\r\n/* Handle on hover */\r\n::-webkit-scrollbar-thumb:hover {\r\n  background: #555;\r\n}\r\n\r\n@font-face{\r\n  font-family: \"Roboto\";\r\n  src: url('./Roboto-Regular.ttf');\r\n}\r\n\r\nhtml {\r\n  font-family: \"Roboto\", Arial, Helvetica, sans-serif;\r\n}\r\n\r\nbody {\r\n  --bg-color:red;\r\n}\r\n*{\r\n  box-sizing: border-box;\r\n}";
styleInject(css_248z$2);

function App() {
  return h("div", {
    style: {
      height: '95vh'
    }
  }, h(AppNavigation, null), '');
}

Parse.initialize("zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA", "Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY

Parse.serverURL = `https://${"localhost"}:1337/parse`; //Parse.liveQueryServerURL = `https://${"localhost"}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
//Parse.liveQueryServerURL = `wss://webapis.back4app.io`

H(h(AppProviders, null, h(App, null)), document.body);

export { List as L, _extends as _, ListItem as a, useMediaQuery as b, useAuthContext as c, v$1 as d, useUserName as e, getTokenFromUrl as g, h, p$1 as p, styleInject as s, useAppRoute as u, valueChanged as v };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtNGU5ODA2MDEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2FwcC1yb3V0ZS9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvdXBkYXRlRGVsaXZlcmVkSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3NhdmVSZWNpZXZlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS91c2VNZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aC1yb3V0ZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL2F1dGgtY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zZW5kT2ZmbGluZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc2VydmljZXMvd2Vic29ja2V0L2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3NlcnZpY2VzL3dlYnNvY2tldC9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3NlcnZpY2VzL3dlYnNvY2tldC9XZWJTb2NrZXRDb250YWluZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvSGFuZ291dEFkYXB0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy90aGVtZS90aGVtZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvY29udHJvbHMvbmF2aWdhdGlvbi9OYXZpZ2F0aW9uUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwcy93ZWJjb20tYXBwL0FwcFByb3ZpZGVycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9uYXZpZ2F0aW9uL05hdkl0ZW0uanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9saXN0L2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL2ljb25zL3VzZXI2NC5wbmciLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5LmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3VpLWNvbXBvbmVudHMvQXV0aERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9uYXYvSGFuZ291dERyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9pY29ucy9NZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvaWNvbnMvU2V0dGluZ3MuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9pY29ucy9vbmxpbmVTdGF0dXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9uYXYvSGFuZ291dFRvcE1lbnUuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9uYXZpZ2F0aW9uL3N0eWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvY29udHJvbHMvbmF2aWdhdGlvbi9EcmF3ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9uYXZpZ2F0aW9uL0FwcEJhci5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL25hdmlnYXRpb24vaWNvbnMvTWVudVdoaXRlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvY29udHJvbHMvbmF2aWdhdGlvbi9NZW51LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9jb21wYXQvZGlzdC9jb21wYXQubW9kdWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9Ib21lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL1BhcnNlQXV0aGVudGljYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc2VydmljZXMvbm9kZS1qcy1hdXRoL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc2VydmljZXMvbm9kZS1qcy1hdXRoL3VzZU5vZGVBdXRoLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL05vZGVBdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvQXBwUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9BcHBOYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9BcHAuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwcy93ZWJjb20tYXBwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBzdXBwb3J0ID0ge1xuICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICBibG9iOlxuICAgICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmXG4gICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbn1cblxuZnVuY3Rpb24gaXNEYXRhVmlldyhvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG59XG5cbmlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICBdXG5cbiAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICBBcnJheUJ1ZmZlci5pc1ZpZXcgfHxcbiAgICBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gIH1cbiAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgfVxuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG5mdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvclxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpdGVyYXRvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gIHRoaXMubWFwID0ge31cblxuICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICB9LCB0aGlzKVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSArICcsICcgKyB2YWx1ZSA6IHZhbHVlXG59XG5cbkhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2gobmFtZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaXRlbXMucHVzaCh2YWx1ZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5pZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xufVxuXG5mdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICB9XG4gIGJvZHkuYm9keVVzZWQgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICB9XG4gICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICB9XG4gIHJldHVybiBjaGFycy5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgaWYgKGJ1Zi5zbGljZSkge1xuICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgfSBlbHNlIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gIH1cbn1cblxuZnVuY3Rpb24gQm9keSgpIHtcbiAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5ID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbnZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICByZXR1cm4gbWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEgPyB1cGNhc2VkIDogbWV0aG9kXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICB9XG4gICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgdGhpcy5zaWduYWwgPSBpbnB1dC5zaWduYWxcbiAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgfVxuXG4gIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJ1xuICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIH1cbiAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICB0aGlzLnNpZ25hbCA9IG9wdGlvbnMuc2lnbmFsIHx8IHRoaXMuc2lnbmFsXG4gIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgfVxuICB0aGlzLl9pbml0Qm9keShib2R5KVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywge2JvZHk6IHRoaXMuX2JvZHlJbml0fSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICBib2R5XG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnJicpXG4gICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gIHJldHVybiBmb3JtXG59XG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMwI3NlY3Rpb24tMy4yXG4gIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGhlYWRlcnNcbn1cblxuQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxufVxuXG5Cb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgdXJsOiB0aGlzLnVybFxuICB9KVxufVxuXG5SZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cblJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxufVxuXG5leHBvcnQgdmFyIERPTUV4Y2VwdGlvbiA9IHNlbGYuRE9NRXhjZXB0aW9uXG50cnkge1xuICBuZXcgRE9NRXhjZXB0aW9uKClcbn0gY2F0Y2ggKGVycikge1xuICBET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB2YXIgZXJyb3IgPSBFcnJvcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFja1xuICB9XG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERPTUV4Y2VwdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwgJiYgcmVxdWVzdC5zaWduYWwuYWJvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICB9XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICB9XG5cbiAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgfSlcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCkge1xuICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBET05FIChzdWNjZXNzIG9yIGZhaWx1cmUpXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICB9KVxufVxuXG5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcblxuaWYgKCFzZWxmLmZldGNoKSB7XG4gIHNlbGYuZmV0Y2ggPSBmZXRjaFxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG59XG4iLCJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4gcChuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24gcChsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiB5KCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGcobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBnKG4pfX1mdW5jdGlvbiBrKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPWEoe30sbykpLl9fdj1pLHQ9QShmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZnKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixzKXt2YXIgYSxoLHAseSxkLG0sZyxrPXUmJnUuX19rfHxjLF89ay5sZW5ndGg7aWYoZj09ZSYmKGY9bnVsbCE9bz9vWzBdOl8/dyh1LDApOm51bGwpLGE9MCxsLl9faz14KGwuX19rLGZ1bmN0aW9uKHUpe2lmKG51bGwhPXUpe2lmKHUuX189bCx1Ll9fYj1sLl9fYisxLG51bGw9PT0ocD1rW2FdKXx8cCYmdS5rZXk9PXAua2V5JiZ1LnR5cGU9PT1wLnR5cGUpa1thXT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8XztoKyspe2lmKChwPWtbaF0pJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSl7a1toXT12b2lkIDA7YnJlYWt9cD1udWxsfWlmKHk9QShuLHUscD1wfHxlLGksdCxvLHIsZixzKSwoaD11LnJlZikmJnAucmVmIT1oJiYoZ3x8KGc9W10pLHAucmVmJiZnLnB1c2gocC5yZWYsbnVsbCx1KSxnLnB1c2goaCx1Ll9fY3x8eSx1KSksbnVsbCE9eSl7dmFyIGM7aWYobnVsbD09bSYmKG09eSksdm9pZCAwIT09dS5fX2QpYz11Ll9fZCx1Ll9fZD12b2lkIDA7ZWxzZSBpZihvPT1wfHx5IT1mfHxudWxsPT15LnBhcmVudE5vZGUpe246aWYobnVsbD09Znx8Zi5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKHkpLGM9bnVsbDtlbHNle2ZvcihkPWYsaD0wOyhkPWQubmV4dFNpYmxpbmcpJiZoPF87aCs9MilpZihkPT15KWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoeSxmKSxjPWZ9XCJvcHRpb25cIj09bC50eXBlJiYobi52YWx1ZT1cIlwiKX1mPXZvaWQgMCE9PWM/Yzp5Lm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZSYmKGwuX19kPWYpfWVsc2UgZiYmcC5fX2U9PWYmJmYucGFyZW50Tm9kZSE9biYmKGY9dyhwKSl9cmV0dXJuIGErKyx1fSksbC5fX2U9bSxudWxsIT1vJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLnR5cGUpZm9yKGE9by5sZW5ndGg7YS0tOyludWxsIT1vW2FdJiZ2KG9bYV0pO2ZvcihhPV87YS0tOyludWxsIT1rW2FdJiZEKGtbYV0sa1thXSk7aWYoZylmb3IoYT0wO2E8Zy5sZW5ndGg7YSsrKWooZ1thXSxnWysrYV0sZ1srK2FdKX1mdW5jdGlvbiB4KG4sbCx1KXtpZihudWxsPT11JiYodT1bXSksbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuKWwmJnUucHVzaChsKG51bGwpKTtlbHNlIGlmKEFycmF5LmlzQXJyYXkobikpZm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspeChuW2ldLGwsdSk7ZWxzZSB1LnB1c2gobD9sKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2Ygbj9wKG51bGwsbixudWxsLG51bGwsbik6bnVsbCE9bi5fX2V8fG51bGwhPW4uX19jP3Aobi50eXBlLG4ucHJvcHMsbi5rZXksbnVsbCxuLl9fdik6bik6bik7cmV0dXJuIHV9ZnVuY3Rpb24gUChuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8TihuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fE4obixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBDKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09cy50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIE4obixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8QyhvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxDKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCx6LHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCx6LHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiB6KGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiBBKGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgcyx2LGgscCx5LHcsZyxrLF8seCxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhzPW4uX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihrPXUucHJvcHMsXz0ocz1QLmNvbnRleHRUeXBlKSYmdFtzLl9fY10seD1zP18/Xy5wcm9wcy52YWx1ZTpzLl9fOnQsaS5fX2M/Zz0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChrLHgpOih1Ll9fYz12PW5ldyBtKGsseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9ayx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1hKHt9LHYuX19zKSksYSh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhrLHYuX19zKSkpLHA9di5wcm9wcyx5PXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZrIT09cCYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoayx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGssdi5fX3MseCl8fHUuX192PT09aS5fX3YmJiF2Ll9fKXtmb3Iodi5wcm9wcz1rLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLHM9MDtzPHUuX19rLmxlbmd0aDtzKyspdS5fX2tbc10mJih1Ll9fa1tzXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGssdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLHksdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWssdi5zdGF0ZT12Ll9fcywocz1uLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdS5fX2s9bnVsbCE9cyYmcy50eXBlPT1kJiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOkFycmF5LmlzQXJyYXkocyk/czpbc10sbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PWEoYSh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwLHkpKSxiKGwsdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksZyYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsocz1uLmRpZmZlZCkmJnModSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgcyxhLHYsaCxwLHk9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKHM9MDtzPG8ubGVuZ3RoO3MrKylpZihudWxsIT0oYT1vW3NdKSYmKChudWxsPT09bC50eXBlPzM9PT1hLm5vZGVUeXBlOmEubG9jYWxOYW1lPT09bC50eXBlKXx8bj09YSkpe249YSxvW3NdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpeSE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PSh5PXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYoeT09PWUpZm9yKHk9e30scD0wO3A8bi5hdHRyaWJ1dGVzLmxlbmd0aDtwKyspeVtuLmF0dHJpYnV0ZXNbcF0ubmFtZV09bi5hdHRyaWJ1dGVzW3BdLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9UChuLGQseSx0LGYpLGwuX19rPWwucHJvcHMuY2hpbGRyZW4saHx8YihuLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT1kLnZhbHVlJiZkLnZhbHVlIT09bi52YWx1ZSYmKG4udmFsdWU9bnVsbD09ZC52YWx1ZT9cIlwiOmQudmFsdWUpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09ZC5jaGVja2VkJiZkLmNoZWNrZWQhPT1uLmNoZWNrZWQmJihuLmNoZWNrZWQ9ZC5jaGVja2VkKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10sQSh1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6Yy5zbGljZS5jYWxsKHUuY2hpbGROb2RlcyksZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWEoYSh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHAobi50eXBlLGwsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsayhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBrKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxrKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGsodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHkgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpPVtdLG89bi5fX3IsZj1uLmRpZmZlZCxjPW4uX19jLGU9bi51bm1vdW50O2Z1bmN0aW9uIGEodCl7bi5fX2gmJm4uX19oKHIpO3ZhciB1PXIuX19IfHwoci5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj11Ll9fLmxlbmd0aCYmdS5fXy5wdXNoKHt9KSx1Ll9fW3RdfWZ1bmN0aW9uIHYobil7cmV0dXJuIG0oeCxuKX1mdW5jdGlvbiBtKG4sdSxpKXt2YXIgbz1hKHQrKyk7cmV0dXJuIG8uX19jfHwoby5fX2M9cixvLl9fPVtpP2kodSk6eCh2b2lkIDAsdSksZnVuY3Rpb24odCl7dmFyIHI9bihvLl9fWzBdLHQpO28uX19bMF0hPT1yJiYoby5fX1swXT1yLG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBwKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gbChuLHUpe3ZhciBpPWEodCsrKTtxKGkuX19ILHUpJiYoaS5fXz1uLGkuX19IPXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24geShuKXtyZXR1cm4gcyhmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gZChuLHQscil7bChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBzKG4scil7dmFyIHU9YSh0KyspO3JldHVybiBxKHUuX19ILHIpPyh1Ll9fSD1yLHUuX19oPW4sdS5fXz1uKCkpOnUuX199ZnVuY3Rpb24gaChuLHQpe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIFQobil7dmFyIHU9ci5jb250ZXh0W24uX19jXTtpZighdSlyZXR1cm4gbi5fXzt2YXIgaT1hKHQrKyk7cmV0dXJuIG51bGw9PWkuX18mJihpLl9fPSEwLHUuc3ViKHIpKSx1LnByb3BzLnZhbHVlfWZ1bmN0aW9uIHcodCxyKXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZShyP3IodCk6dCl9ZnVuY3Rpb24gQShuKXt2YXIgdT1hKHQrKyksaT12KCk7cmV0dXJuIHUuX189bixyLmNvbXBvbmVudERpZENhdGNofHwoci5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXt1Ll9fJiZ1Ll9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIEYoKXtpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKF8pLHQuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faD1bXX1jYXRjaChyKXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHIsdC5fX3YpLCEwfX0pLGk9W119ZnVuY3Rpb24gXyhuKXtuLnQmJm4udCgpfWZ1bmN0aW9uIGcobil7dmFyIHQ9bi5fXygpO1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuLnQ9dCl9ZnVuY3Rpb24gcShuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7byYmbyhuKSx0PTAsKHI9bi5fX2MpLl9fSCYmKHIuX19ILl9faC5mb3JFYWNoKF8pLHIuX19ILl9faC5mb3JFYWNoKGcpLHIuX19ILl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHI9dC5fX2M7aWYocil7dmFyIG89ci5fX0g7byYmby5fX2gubGVuZ3RoJiYoMSE9PWkucHVzaChyKSYmdT09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHU9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX0pKEYpKX19LG4uX19jPWZ1bmN0aW9uKHQscil7ci5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKF8pLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8ZyhuKX0pfWNhdGNoKHUpe3Iuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHI9W10sbi5fX2UodSx0Ll9fdil9fSksYyYmYyh0LHIpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7ZSYmZSh0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgdT1yLl9fSDtpZih1KXRyeXt1Ll9fLmZvckVhY2goZnVuY3Rpb24obil7cmV0dXJuIG4udCYmbi50KCl9KX1jYXRjaCh0KXtuLl9fZSh0LHIuX192KX19fTtleHBvcnR7diBhcyB1c2VTdGF0ZSxtIGFzIHVzZVJlZHVjZXIscCBhcyB1c2VFZmZlY3QsbCBhcyB1c2VMYXlvdXRFZmZlY3QseSBhcyB1c2VSZWYsZCBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLHMgYXMgdXNlTWVtbyxoIGFzIHVzZUNhbGxiYWNrLFQgYXMgdXNlQ29udGV4dCx3IGFzIHVzZURlYnVnVmFsdWUsQSBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xyXG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcclxuICAgIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByb3V0ZTogYWN0aW9uLnJvdXRlLGZlYXR1cmVSb3V0ZTogYWN0aW9uLmZlYXR1cmVSb3V0ZSB9XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVJlZHVjZXIsdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3Qge2luaXRTdGF0ZX09cHJvcHNcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZVJlZHVjZXIocmVkdWNlcixpbml0U3RhdGUpXHJcblxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xyXG4gICAgU0VORElOR19IQU5HT1VUX1NUQVJURUQ6J1NFTkRJTkdfSEFOR09VVF9TVEFSVEVEJyxcclxuICAgIFNFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEOidTRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRCcsXHJcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxyXG5cclxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcclxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXHJcbiBcclxuICAgIFNFQVJDSF9JTlBVVF9DSEFOR0U6ICdTRUFSQ0hfSU5QVVRfQ0hBTkdFJyxcclxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcclxuICAgIENMRUFSRURfSEFOR09VVDonQ0xFQVJFRF9IQU5HT1VUJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXHJcbiAgICBFUlJPUl9SRUNJRVZFRDonRVJST1JfUkVDSUVWRUQnLFxyXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXHJcblxyXG4gICAgU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQ6J1NFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEJyxcclxuXHJcbiAgICBcclxuICAgIE1FU1NBR0VTX1VQREFURUQ6J01FU1NBR0VTX1VQREFURUQnLFxyXG4gICAgSEFOR09VVFNfVVBEQVRFRDonSEFOR09VVFNfVVBEQVRFRCcsXHJcbiAgICBIQU5HT1VUX1VQREFURUQ6J0hBTkdPVVRfVVBEQVRFRCcsXHJcbiAgICBVTlJFQURfSEFOR09VVFNfVVBEQVRFRDonVU5SRUFEX0hBTkdPVVRTX1VQREFURUQnLFxyXG4gICAgLy9TT0NLRVRcclxuXHJcbiAgICBDT05ORUNUSU5HOidDT05ORUNUSU5HJyxcclxuICAgIE9QRU46J09QRU4nLFxyXG4gICAgQ0xPU0lORzonQ0xPU0lORycsXHJcbiAgICBDTE9TRUQ6J0NMT1NFRCcsXHJcbiAgICBTT0NLRVRfUkVBRFk6J1NPQ0tFVF9SRUFEWScsXHJcbiAgICBTT0NLRVRfRVJST1I6J1NPQ0tFVF9FUlJPUidcclxuXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGhhbmdvdXRzOiBudWxsLFxyXG4gIGhhbmdvdXQ6IG51bGwsXHJcbiAgdW5yZWFkaGFuZ291dHM6IG51bGwsXHJcbiAgbWVzc2FnZXM6IG51bGwsXHJcbiAgc2VhcmNoOiAnJyxcclxuICB1c2VyOiBbXSxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICBtZXNzYWdlVGV4dDogJycsXHJcbiAgb25saW5lOiBmYWxzZSxcclxuICBzb2NrZXQ6IG51bGwsXHJcbiAgcmVhZHlTdGF0ZTogMCxcclxuICBzb2NrZXRNZXNzYWdlOiBudWxsLFxyXG4gIGZldGNoSGFuZ291dHM6IGZhbHNlLFxyXG4gIHBlbmRpbmdIYW5nb3V0Om51bGwsXHJcbiAgbWVzc2FnZTogbnVsbFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5FUlJPUl9SRUNJRVZFRDpcclxuICAgICAgcmV0dXJuey4uLnN0YXRlLGVycm9yOmFjdGlvbi5lcnJvcn1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQ6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUscGVuZGluZ0hhbmdvdXQ6bnVsbH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHBlbmRpbmdIYW5nb3V0OmFjdGlvbi5wZW5kaW5nSGFuZ291dH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUOlxyXG4gICAgIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogbnVsbCB9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVEOlxyXG5cclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHVucmVhZGhhbmdvdXRzOiBhY3Rpb24udW5yZWFkaGFuZ291dHMgfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQ6XHJcblxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRDpcclxuICAgICBcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQ6XHJcbiAgXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogYWN0aW9uLm1lc3NhZ2VzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yLCBmZXRjaEhhbmdvdXRzOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBmZXRjaEhhbmdvdXRzOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzLCBmZXRjaEhhbmdvdXRzOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cclxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxyXG4gICAgICAgICksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0U6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzZWFyY2g6IGFjdGlvbi5zZWFyY2ggfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxyXG4gICAgICB9O1xyXG4gICAgLy9TT0NLRVRcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX0VSUk9SOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DT05ORUNUSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TSU5HOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWTpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJcclxuICBleHBvcnQgY29uc3QgaGFuZ291dFN0YXRlcyA9IHtcclxuICAgIElOVklURVI6ICdJTlZJVEVSJyxcclxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxyXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXHJcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXHJcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxyXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJyxcclxuICAgLy8gYWNrbm93bGVnZW1lbnRcclxuICAgIElOVklURUQ6ICdJTlZJVEVEJyxcclxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxyXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXHJcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXHJcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxyXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCcsXHJcbiAgfTsiLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBuYW1lLCBkaXNwYXRjaCwgaGFuZ291dCwgb2ZmbGluZSwgb25BcHBSb3V0ZSB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSwgdGltZXN0YW1wIH0gPSBoYW5nb3V0O1xyXG5cclxuICBjb25zdCBkZWxpdmVyZWRIYW5nb3V0ID0geyAuLi5oYW5nb3V0LCBkZWxpdmVyZWQ6IHRydWUgfTtcclxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkSGFuZ291dCk7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9VUERBVEVELCBoYW5nb3V0OiBkZWxpdmVyZWRIYW5nb3V0IH0pO1xyXG4gIGlmIChtZXNzYWdlKSB7XHJcblxyXG4gICAgdXBkYXRlRGVsaXZlcmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBuYW1lLCBkZWxpdmVyZWRIYW5nb3V0LGhhbmdvdXQgfSk7XHJcbiAgfVxyXG4gIGlmKGhhbmdvdXQuc3RhdGU9PT0nQkxPQ0tFRCcpe1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsbmFtZSxkZWxpdmVyZWRIYW5nb3V0fSlcclxuICB9XHJcbiAgaWYgKG9mZmxpbmUpIHtcclxuICAgIC8vcmVtb3ZlIG9mZmxpbmUgaGFuZ291dFxyXG4gICAgY29uc3Qgb2ZmbGluZUhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcclxuICAgIGNvbnN0IG9mZmxpbmVoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0ob2ZmbGluZUhhbmdvdXRLZXkpKTtcclxuXHJcbiAgICBpZiAob2ZmbGluZWhhbmdvdXRzKSB7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IG9mZmxpbmVoYW5nb3V0cy5maW5kSW5kZXgoXHJcbiAgICAgICAgKG8pID0+IG8udGltZXN0YW1wID09PSB0aW1lc3RhbXBcclxuICAgICAgKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgb2ZmbGluZUhhbmdvdXRLZXksXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkob2ZmbGluZWhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEpKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGVsaXZlcmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBuYW1lLCBkZWxpdmVyZWRIYW5nb3V0IH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xyXG5cclxuICBjb25zdCBkZWxpdmVyZWRNZXNzYWdlID0geyAuLi5tZXNzYWdlLCB1c2VybmFtZTogbmFtZSwgZGVsaXZlcmVkOiB0cnVlIH1cclxuXHJcbiAgLy8gc2F2ZSBtZXNzYWdlIHRvIGxvY2FsU3RvcmFnZVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBtZXNzYWdlcy5maW5kSW5kZXgoXHJcbiAgICAobSkgPT4gbS50aW1lc3RhbXAgPT09IG1lc3NhZ2UudGltZXN0YW1wXHJcbiAgKTtcclxuICBtZXNzYWdlcy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRNZXNzYWdlKTtcclxuICBcclxuXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJvY2tlZFN0YXRlKHtkaXNwYXRjaCxkZWxpdmVyZWRIYW5nb3V0LG5hbWV9KXtcclxuICBkZWJ1Z2dlcjtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xyXG4gIGNvbnN0IGJsb2NrZWRNZXNzYWdlID0geyB0aW1lc3RhbXA6ZGVsaXZlcmVkSGFuZ291dC50aW1lc3RhbXAsIHRleHQ6ICd5b3UgYmxvY2tlZCB0aGlzIHVzZXInLCB1c2VybmFtZTogbmFtZSwgdHlwZTogJ2Jsb2NrZWQnIH1cclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkoIFsuLi5tZXNzYWdlcyxibG9ja2VkTWVzc2FnZV0pKTtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczpbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdIH0pO1xyXG59IiwiaW1wb3J0IHsgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCB9IGZyb20gJy4vdXBkYXRlRGVsaXZlcmVkSGFuZ291dCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3NhZ2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZX0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWNjZXB0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb3ZrZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7aGFuZ291dFN0YXRlc30gIGZyb20gJ3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJ1xyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2lldmVkSGFuZ291dCh7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkLFxyXG59KSB7XHJcblxyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcblxyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcblxyXG4gXHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKGhnPT4gaGcudXNlcm5hbWU9PT11c2VybmFtZSlcclxuICAgIGlmKGhhbmdvdXRFeGlzdCl7XHJcbiAgICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xyXG4gICAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcclxuICAgICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG4gICAgfS8vZW5kIG9mIGhhbmdvdXQgZXhpc3RcclxuZWxzZXtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbLi4uaGFuZ291dHMsXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbLi4uaGFuZ291dHMsXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogdXBkYXRlZEhhbmdvdXRzIH0pO1xyXG59XHJcblxyXG59ZWxzZXtcclxuXHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfVxyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuXHJcbn1cclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULFxyXG4gICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgIH0pO1xyXG4gICAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XHJcbiAgICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuICAgIHNhdmVSZWNpZXZlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAodW5yZWFkKSB7XHJcblxyXG4gICAgc3dpdGNoKGhhbmdvdXQuc3RhdGUpe1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVSOlxyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSOlxyXG4gICAgICAgIHNhdmVVbnJlYWRIYW5nb3V0KHsgbmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiBcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2lldmVkTWVzc2FnZSh7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG59KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgLy8gc2F2ZSBtZXNzYWdlIHRvIGxvY2FsU3RvcmFnZVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gbnVsbDtcclxuICBpZiAobWVzc2FnZXMpIHtcclxuICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiBmYWxzZSB9XTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogdHJ1ZSB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFt7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiBmYWxzZSB9XTtcclxuICAgIH1cclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcblxyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIC8vIHN5bmMgbWVzc2FnZSB3aXRoIHJlZHVjZXIgc3RhdGVcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVVbnJlYWRIYW5nb3V0KHsgbmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcbiAgXHJcbiAgLy91cGRhdGUgdW5yZWFkIGhhbmdvdXRzXHJcbiAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcclxuICBsZXQgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWR1bnJlYWRzID0gbnVsbDtcclxuICBpZiAodW5yZWFkaGFuZ291dHMpIHtcclxuICAgIHVwZGF0ZWR1bnJlYWRzID0gWy4uLnVucmVhZGhhbmdvdXRzLCB7Li4uaGFuZ291dCxyZWFkOmZhbHNlfV07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWR1bnJlYWRzID0gW3suLi5oYW5nb3V0LHJlYWQ6ZmFsc2V9XTtcclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWR1bnJlYWRzKSk7XHJcblxyXG4gIGRpc3BhdGNoKHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxyXG4gICAgdW5yZWFkaGFuZ291dHM6IHVwZGF0ZWR1bnJlYWRzLFxyXG4gIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IHNhdmVSZWNpZXZlZEhhbmdvdXQgfSBmcm9tICcuL3NhdmVSZWNpZXZlZEhhbmdvdXQnO1xyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcblxyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3Nhbmdlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCB9KSB7XHJcblxyXG5cclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59IC8vIEVORCBzYXZlTWVzc2FuZ2VyXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVVuYmxvY2tlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuICBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJ3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJztcclxuaW1wb3J0IHtcclxuICBzYXZlSW52aXRlZCxcclxuICBzYXZlVW5ibG92a2VkLFxyXG4gIHNhdmVEZWNsaW5lZCxcclxuICBzYXZlQmxvY2tlZCxcclxuICBzYXZlQWNjZXB0ZWQsXHJcbiAgc2F2ZU1lc3NhZ2VkLFxyXG59IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMnO1xyXG5pbXBvcnQge1xyXG4gIHNhdmVBY2NlcHRlcixcclxuICBzYXZlQmxvY2tlcixcclxuICBzYXZlRGVjbGluZXIsXHJcbiAgc2F2ZUludml0ZXIsXHJcbiAgc2F2ZU1lc3NhbmdlcixcclxuICBzYXZlVW5ibG9ja2VyLFxyXG59IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZXNzYWdlKHtcclxuICBtZXNzYWdlLFxyXG4gIHVzZXJuYW1lLFxyXG4gIGRpc3BhdGNoLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG59KSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQsb2ZmbGluZSB9KSB7XHJcbiAgICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURUQ6XHJcbiAgICAgXHJcbiAgICAgICAgc2F2ZUludml0ZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRDpcclxuICAgICAgICBzYXZlVW5ibG92a2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FRDpcclxuICAgICAgICBzYXZlRGVjbGluZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRUQ6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZUJsb2NrZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVEOlxyXG4gICAgICAgIHNhdmVBY2NlcHRlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxyXG4gICAgICAgXHJcbiAgICAgICAgc2F2ZU1lc3NhZ2VkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCwgdW5yZWFkIH0pIHtcclxuICAgIFxyXG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFUjpcclxuICAgICAgICBzYXZlQWNjZXB0ZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFUjpcclxuICAgICAgIFxyXG4gICAgICAgIHNhdmVCbG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FUjpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlRGVjbGluZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XHJcbiAgICAgICAgc2F2ZUludml0ZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcclxuICAgICAgICBzYXZlTWVzc2FuZ2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRVI6XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2F2ZVVuYmxvY2tlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0cyB9KSB7XHJcbiAgICBoYW5nb3V0cy5mb3JFYWNoKChoYW5nb3V0KSA9PiB7XHJcbiAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0LHVucmVhZDp0cnVlIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKG1lc3NhZ2UgJiYgdXNlcm5hbWUpIHtcclxuIFxyXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ0FDS0hPV0xFREdFTUVOVCc6XHJcblxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6ZmFsc2UgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdIQU5HT1VUJzpcclxuXHJcbiAgICAgICAgICBpZihmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT1tZXNzYWdlLmhhbmdvdXQudXNlcm5hbWUpe1xyXG4gICBcclxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCx1bnJlYWQ6ZmFsc2UgfSk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgIFxyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LHVucmVhZDp0cnVlIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1VOUkVBRF9IQU5HT1VUUyc6XHJcbiAgIFxyXG4gICAgICAgICAgaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0czogbWVzc2FnZS5oYW5nb3V0cyB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ09GRkxJTkVfQUNLTic6XHJcbiAgICAgICBcclxuICAgICAgICAgIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQ6IG1lc3NhZ2UuaGFuZ291dCxvZmZsaW5lOnRydWUgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbbWVzc2FnZSwgdXNlcm5hbWVdKTtcclxuXHJcbiAgcmV0dXJuIHt9O1xyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xyXG5cclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XHJcbn1cclxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCB9KSB7XHJcblxyXG4gXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCBoYW5nb3V0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRIYW5nb3V0KHtkaXNwYXRjaH0pe1xyXG4gIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkNMRUFSRURfSEFOR09VVH0pXHJcbn0gXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHtkaXNwYXRjaCxoYW5nb3V0fSl7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgaGFuZ291dCB9KTtcclxufVxyXG5cclxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4vLyAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xyXG4vLyB9XHJcbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XHJcbn1cclxuXHJcbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcclxuICAgICk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcclxuICBcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tJHtoYW5nb3V0LnVzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy9FTkQgc2F2ZUludml0ZXJcclxuXHJcblxyXG5cclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlBVVF9WQUxVRV9DSEFOR0VEOidJTlBVVF9WQUxVRV9DSEFOR0VEJyxcclxuICBWQUxVRV9DSEFOR0VEOiAnVkFMVUVfQ0hBTkdFRCcsXHJcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxyXG4gIExPR0lOX1NVQ0NFU1M6ICdMT0dJTl9TVUNDRVNTJyxcclxuICBMT0dJTl9GQUlMRUQ6ICdMT0dJTl9GQUlMRUQnLFxyXG5cclxuICBMT0dPVVRfU1RBUlRFRDogJ0xPR09VVF9TVEFSVEVEJyxcclxuICBMT0dPVVRfRkFJTEVEOiAnTE9HT1VUX0ZBSUxFRCcsXHJcbiAgTE9HT1VUX1NVQ0NFU1M6ICdMT0dPVVRfU1VDQ0VTUycsXHJcblxyXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxyXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxyXG4gIFNJR05VUF9GQUlMRUQ6ICdTSUdOVVBfRkFJTEVEJyxcclxuXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6ICdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxyXG5cclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXHJcbiAgR09UX1RPS0VOX0ZST01fVVJMOiAnR09UX1RPS0VOX0ZST01fVVJMJyxcclxuXHJcbiAgUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOiAnUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFJyxcclxuICBcclxuICBTRVJWRVJfRVJST1JfUkVDSUVWRUQ6J1NFUlZFUl9FUlJPUl9SRUNJRVZFRCdcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGVtYWlsOiAnJyxcclxuICBwYXNzd29yZDogJycsXHJcbiAgc3VjY2VzczogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgdXNlcm5hbWU6ICcnLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGNvbmZpcm06ICcnLFxyXG4gIGN1cnJlbnQ6ICcnLFxyXG4gIGVtYWlsb3J1c2VybmFtZTogJycsXHJcbiAgdG9rZW46IG51bGwsXHJcbiAgaXNMb2dnZWRJbjogZmFsc2UsXHJcbiAgaXNQYXNzd29yZENoYW5nZWQ6IGZhbHNlLFxyXG4gIGF1dGhGZWVkYmFjazogbnVsbCxcclxuICB1c2VyOm51bGxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhdXRoUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VEOlxyXG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgW2FjdGlvbi5wYXlsb2FkLnByb3BOYW1lXTogYWN0aW9uLnBheWxvYWQudmFsdWUsXHJcbiAgICAgIH07XHJcbiAgXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyOmFjdGlvbi51c2VyLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZSwgJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgdXNlcjphY3Rpb24udXNlcixcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjphY3Rpb24udXNlcixcclxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgIHVzZXI6YWN0aW9uLnVzZXJcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IEF1dGhSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFthdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG5cclxuICBpZiAoYXV0aFJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xyXG4gIGNvbnN0IHsgdG8sIGlkIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldFJvdXRlKHRvKTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxhXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgey4uLnByb3BzfVxyXG4gICAgICBocmVmPXt0b31cclxuICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9XHJcbiAgICAgIHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiAnaW5oZXJpdCcgfX1cclxuICAgIC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGhSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aFJvdXRlQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXV0aFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgaW5pdGlhbFJvdXRlIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlU3RhdGUoaW5pdGlhbFJvdXRlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0sIFthdXRoUm91dGVdKTtcclxuXHJcbiAgcmV0dXJuIDxBdXRoUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XHJcbmltcG9ydCB7IEF1dGhSb3V0ZVByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLXJvdXRlLWNvbnRleHQnO1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXRlLFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XHJcbiAgICAgIDxBdXRoUm91dGVQcm92aWRlcj57Y2hpbGRyZW59PC9BdXRoUm91dGVQcm92aWRlcj5cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlQXV0aENvbnRleHQgfTtcclxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlVXNlck5hbWUoKSB7XHJcbiAgY29uc3QgW3VzZXJOYW1lLCBzZXRVc2VybmFtZV0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbdG9rZW4sIHNldFRva2VuXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtvYmplY3RJZCwgc2V0T2JqZWN0SWRdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIFxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpIHtcclxuXHJcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCxvYmplY3RJZCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICAgIHNldE9iamVjdElkKG9iamVjdElkKVxyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzdGF0ZS51c2VyICYmIHN0YXRlLnVzZXIudG9rZW4pIHtcclxuICBcclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwsIHRva2VuLG9iamVjdElkIH0gPXN0YXRlLnVzZXI7XHJcbiAgXHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICAgIHNldE9iamVjdElkKG9iamVjdElkKVxyXG4gICAgfVxyXG4gIH0sIFtzdGF0ZS51c2VyXSk7XHJcblxyXG4gIHJldHVybiB7IHVzZXJuYW1lOiB1c2VyTmFtZSwgdG9rZW4sIGVtYWlsIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgLy8gc2V0IHJlYWQgdG8gdHJ1ZSBvbiB1bnJlYWQgaGFuZ291dHNcclxuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gIGNvbnN0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xyXG5cclxuICBpZiAodW5yZWFkaGFuZ291dHMmJiB1bnJlYWRoYW5nb3V0cy5sZW5ndGg+MCkge1xyXG4gICAgXHJcbiAgICBsZXQgdXBkYXRlZHVucmVhZCA9IHVucmVhZGhhbmdvdXRzLm1hcCh1ID0+IHtcclxuICAgICAgaWYgKHUudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHsgLi4udSwgcmVhZDogdHJ1ZSB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZHVucmVhZCkpO1xyXG5kaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCx1bnJlYWRoYW5nb3V0czp1cGRhdGVkdW5yZWFkfSlcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgLy8gc2V0IGhhbmdvdXQgdG8gcmVhZFxyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7IC4uLmhhbmdvdXQsIHJlYWQ6IHRydWUgfSk7XHJcbiAgLy9cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcblxyXG4gIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgdXBkYXRlUmVhZE1lc3NzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlYWRNZXNzc2FnZXMoeyBoYW5nb3V0LCBuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcclxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgY29uc3QgdXBkYXRlZE1lc3NhZ2VzID0gbWVzc2FnZXMubWFwKChtKSA9PiB7XHJcbiAgICByZXR1cm4geyAuLi5tLCByZWFkOiB0cnVlIH07XHJcbiAgfSk7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge1xyXG4gIHVzZUNvbnRleHQsXHJcbiAgdXNlTWVtbyxcclxuICB1c2VSZWR1Y2VyLFxyXG4gIHVzZUVmZmVjdCxcclxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xyXG5pbXBvcnQge3VzZU1lc3NhZ2V9IGZyb20gJy4vdXNlTWVzc2FnZSdcclxuXHJcbmltcG9ydCB7XHJcbiAgbG9hZEhhbmdvdXRzLFxyXG4gIGxvYWRNZXNzYWdlcywgXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHt1c2VVc2VyTmFtZX0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvdXNlVXNlck5hbWUnXHJcbmltcG9ydCB7IHVwZGF0ZVJlYWRIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy91cGRhdGVSZWFkSGFuZ291dHMnO1xyXG5cclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XHJcbiBjb25zdCB7dXNlcm5hbWUsdG9rZW59PXVzZVVzZXJOYW1lKClcclxuXHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgeyBoYW5nb3V0LG1lc3NhZ2UgfSA9IHN0YXRlO1xyXG4gIGNvbnN0IGhhbmRsZU1lc3NhZ2UgPXVzZU1lc3NhZ2Uoe21lc3NhZ2UsdXNlcm5hbWUsZGlzcGF0Y2gsZm9jdXNlZEhhbmdvdXQ6aGFuZ291dH0pXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3VzZXJuYW1lXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSAmJiB0b2tlbikge1xyXG4gICAgIFxyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaGFuZ291dCAmJiB1c2VybmFtZSkge1xyXG4gIFxyXG4gICAgICAvL2Zyb20gbG9jYWwgc3RvcmFnZVxyXG4gICAgICBsb2FkTWVzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XHJcblxyXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcclxuICAgICAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYDtcclxuICAgICAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxyXG4gICAgICAgICAgKGcpID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWVcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcclxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFoYW5nb3V0LnJlYWQpIHtcclxuICAgICBcclxuICAgICBcclxuICAgICAgICB1cGRhdGVSZWFkSGFuZ291dHMoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZTogdXNlcm5hbWUgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbaGFuZ291dCwgdXNlcm5hbWVdKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVQZW5kaW5nSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvbmxpbmUsaXNCbG9ja2VyIH0pIHtcclxuXHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuICBsZXQgaGFuZ291dEtleSA9ICcnO1xyXG4gIGxldCBtZXNzYWdlS2V5ID0gJyc7XHJcbiAgaWYgKG9ubGluZSkge1xyXG4gICAgXHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xyXG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICB9IGVsc2Uge1xyXG4gICAgXHJcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XHJcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tb2ZmbGluZS1tZXNzYWdlc2A7XHJcbiAgfVxyXG5cclxuICBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UudGV4dCAhPT1cIlwiKSB7XHJcbiAgICBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIHVzZXJuYW1lLCBtZXNzYWdlLGRpc3BhdGNoLGlzQmxvY2tlciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBcclxuICAgIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGhhbmdvdXQpO1xyXG4gICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgXHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbaGFuZ291dF07XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcclxuICB9XHJcbiBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgbWVzc2FnZSxkaXNwYXRjaCxpc0Jsb2NrZXIgfSkge1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XHJcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IFtdO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gXHJcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIG1lc3NhZ2VdO1xyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gW21lc3NhZ2VdO1xyXG4gIH1cclxuICBpZihpc0Jsb2NrZXIpe1xyXG4gXHJcbiAgICBjb25zdCBibG9ja2VyID1bLi4udXBkYXRlZE1lc3NhZ2VzLHt0ZXh0OidZb3UgY2FuIG5vdCBzZW5kIHRoaXMgbWVzc2FnZSBiZWNhdXNlIHlvdSBhcmUgYmxvY2tlZC4nXHJcbiAgICAsdGltZXN0YW1wOiBEYXRlLm5vdygpLHR5cGU6J2Jsb2NrZXInLHVzZXJuYW1lOm1lc3NhZ2UudXNlcm5hbWUsZmxvYXQ6J3JpZ2h0J31dXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShibG9ja2VyKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiBibG9ja2VyIH0pO1xyXG4gIFxyXG4gIH1cclxuICBlbHNle1xyXG4gIFxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbiAgfVxyXG4gXHJcblxyXG59XHJcbiIsIlxyXG5leHBvcnQgZnVuY3Rpb24gc2VuZE9mZmxpbmVIYW5nb3V0cyh7IHNvY2tldCwgbmFtZSB9KSB7XHJcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcclxuICBjb25zdCBvZmZsaW5lSGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG9mZmxpbmVIYW5nb3V0S2V5KSk7XHJcbiAgaWYgKG9mZmxpbmVIYW5nb3V0cykge1xyXG4gICAgb2ZmbGluZUhhbmdvdXRzLmZvcmVFYWNoKChoKSA9PiB7XHJcbiAgICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHVzZXJuYW1lOiBoLnVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWw6IGguZW1haWwsXHJcbiAgICAgICAgICBtZXNzYWdlOiBoLm1lc3NhZ2UsXHJcbiAgICAgICAgICB0aW1lc3RhbXA6IGgudGltZXN0YW1wLFxyXG4gICAgICAgICAgY29tbWFuZDogaC5zdGF0ZSxcclxuICAgICAgICAgIG9mZmxpbmU6IHRydWUsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICByZXR1cm47XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZSwgaGFuZ291dCxkaXNwYXRjaH0pe1xyXG4gICAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcclxuICAgIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgICBsZXQgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcbiAgIFxyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgY29uc3QgZmlsdGVyZWRIYW5nb3V0cyA9IHVucmVhZGhhbmdvdXRzLmZpbHRlcihmdW5jdGlvbih1bnJlYWQpICB7XHJcbiAgICAgICAgICAgIHJldHVybiAgdW5yZWFkLnVzZXJuYW1lICE9PSB1c2VybmFtZX0pO1xyXG4gICAgICAgICBcclxuICAgICAgICAgICAgaWYoZmlsdGVyZWRIYW5nb3V0cy5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KGZpbHRlcmVkSGFuZ291dHMpKTtcclxuICAgICAgICAgICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRCxcclxuICAgICAgICAgICAgICAgIHVucmVhZGhhbmdvdXRzOiBmaWx0ZXJlZEhhbmdvdXRzLFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHVucmVhZGhhbmdvdXRzS2V5KTtcclxuICAgICAgICAgICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxyXG4gICAgICAgICAgICAgICAgICB1bnJlYWRoYW5nb3V0czogW10sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuICAgICAgXHJcbn0iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgeyBzYXZlUGVuZGluZ0hhbmdvdXQgfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NhdmVQZW5kaW5nSGFuZ291dCc7XHJcbmltcG9ydCB7XHJcblxyXG4gIHNlbGVjdFVucmVhZCxcclxuICBcclxuXHJcbiAgY2hhbmdlTWVzc2FnZVRleHQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgc2VuZE9mZmxpbmVIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2VuZE9mZmxpbmVIYW5nb3V0cyc7XHJcbmltcG9ydCB7cmVtb3ZlSGFuZ291dEZyb21VbnJlYWR9IGZyb20gJy4vYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9yZW1vdmVIYW5nb3V0RnJvbVVucmVhZCdcclxuaW1wb3J0IHthY3Rpb25UeXBlc30gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xyXG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgIHVzZXJuYW1lICA9IGF1dGhDb250ZXh0LnN0YXRlLnVzZXIgJiZhdXRoQ29udGV4dC5zdGF0ZS51c2VyLnVzZXJuYW1lO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuICBjb25zdCB7XHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZXMsXHJcbiAgICByZWFkeVN0YXRlLFxyXG4gIFxyXG4gICAgdW5yZWFkaGFuZ291dHMsXHJcbiAgfSA9IHN0YXRlO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCByZWFkeVN0YXRlID09PSAxICYmIHVzZXJuYW1lKSB7XHJcbiAgICAgIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBuYW1lOiB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3JlYWR5U3RhdGUsIHVzZXJuYW1lXSk7XHJcblxyXG4gIGZ1bmN0aW9uIG9uUmVtb3ZlVW5yZWFkKGUpe1xyXG4gICAgY29uc3QgaWQgPWUuY3VycmVudFRhcmdldC5pZFxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGlkKTtcclxuICAgXHJcbiAgICByZW1vdmVIYW5nb3V0RnJvbVVucmVhZCh7bmFtZTp1c2VybmFtZSxkaXNwYXRjaCxoYW5nb3V0fSlcclxuICB9XHJcbiAgZnVuY3Rpb24gb25OYXZpZ2F0aW9uKGUpe1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAvLyBjb25zdCBpZCA9ZS50YXJnZXQuaWRcclxuICAgIGNvbnN0IGlkID1lLmN1cnJlbnRUYXJnZXQuaWRcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBvblNlbGVjdEhhbmdvdXQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSlcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSlcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIFxyXG4gXHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSk7XHJcbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblNlYXJjaElucHV0KGUpIHtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0UsIHNlYXJjaDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbkZldGNoSGFuZ291dHMoKXtcclxuXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUR9KVxyXG4gIH1cclxuXHJcbiBcclxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcclxuICAgIGNvbnN0IHRleHQgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uSGFuZ291dChlKSB7XHJcbiAgICBcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dDogJycsIGRpc3BhdGNoIH0pO1xyXG4gICAgY29uc3QgY29tbWFuZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gaGFuZ291dDtcclxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCBtZXNzYWdlID1cclxuICAgICAgbWVzc2FnZVRleHQgIT09ICcnID8geyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wIH0gOiBudWxsO1xyXG5cclxuICAgIGxldCBvbmxpbmUgPSB0cnVlO1xyXG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcclxuICAgIFxyXG4gIC8vICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICAgICBcclxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xyXG4gICAgICAgXHJcbiAgICAgICAgaXNCbG9ja2VyPXRydWVcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBwZW5kaW5nSGFuZ291dD0ge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgY29tbWFuZCxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgIH1cclxuICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX1NUQVJURUQsIHBlbmRpbmdIYW5nb3V0fSlcclxuICAgIC8vIH0gZWxzZSB7XHJcbiAgICAvLyAgIG9ubGluZSA9IGZhbHNlO1xyXG4gICAgLy8gfVxyXG4gICBcclxuIFxyXG4gICAgc2F2ZVBlbmRpbmdIYW5nb3V0KHtcclxuICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgIG5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICBoYW5nb3V0OiB7XHJcbiAgICAgICAgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgc3RhdGU6IGNvbW1hbmQsXHJcbiAgICAgICAgbWVzc2FnZTogeyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wLCBkZWxpdmVyZWQ6IGZhbHNlLCB1c2VybmFtZSB9LFxyXG4gICAgICAgIHRpbWVzdGFtcCxcclxuICAgICAgICBkZWxpdmVyZWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgICBvbmxpbmUsXHJcbiAgICAgIGlzQmxvY2tlclxyXG4gICAgfSk7XHJcbiAgfS8vZW5kIG9uSGFuZ291dFxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIG9uTmF2aWdhdGlvbixcclxuICAgIG9uU2VsZWN0VW5yZWFkLFxyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgb25TZWFyY2hJbnB1dCxcclxuICAgIG9uRmV0Y2hIYW5nb3V0cyxcclxuICAgIHNlYXJjaCxcclxuICAgIG9uU2VsZWN0SGFuZ291dCxcclxuICAgIGRpc3BhdGNoLFxyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgdXNlcnMsXHJcbiAgICB1c2VybmFtZSxcclxuICAgIG1lc3NhZ2VzLFxyXG4gICAgb25IYW5nb3V0LFxyXG4gICAgdW5yZWFkaGFuZ291dHMsXHJcbiAgICByZWFkeVN0YXRlLFxyXG4gICAgb25SZW1vdmVVbnJlYWRcclxuICB9O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXHJcblxyXG4gICAgU0VBUkNIX0lOUFVUX0NIQU5HRUQ6ICdTRUFSQ0hfSU5QVVRfQ0hBTkdFRCcsXHJcblxyXG4gICAgXHJcbiAgICBNRVNTQUdFX1JFQ0lFVkVEOiBcIk1FU1NBR0VfUkVDSUVWRURcIixcclxuICAgIFNPQ0tFVF9FUlJPUjogJ1NPQ0tFVF9FUlJPUicsXHJcbiAgICBDT05ORUNUSU5HOiAnQ09OTkVDVElORycsXHJcbiAgICBPUEVOOiAnT1BFTicsXHJcbiAgICBDTE9TSU5HOiAnQ0xPU0lORycsXHJcbiAgICBDTE9TRUQ6ICdDTE9TRUQnLFxyXG4gICAgU09DS0VUX1JFQURZOiAnU09DS0VUX1JFQURZJyxcclxufVxyXG4iLCIvL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcclxuICAgICAgKTtcclxuICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hJbnB1dCh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIX0lOUFVUX0NIQU5HRUQsIHNlYXJjaCB9KTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgdXNlRWZmZWN0LHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4uLy4uL3N0YXRlL3VzZUhhbmdvdXRzJ1xyXG5pbXBvcnQgICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vc3RhdGUvYWN0aW9uVHlwZXMnXHJcbmltcG9ydCB7dXNlVXNlck5hbWV9IGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL3VzZVVzZXJOYW1lJ1xyXG5leHBvcnQgZnVuY3Rpb24gV2ViU29ja2V0Q29udGFpbmVyKHByb3BzKSB7XHJcbiAgICBjb25zdCB7dXNlcm5hbWUsdG9rZW59PXVzZVVzZXJOYW1lKClcclxuICAgIGNvbnN0IFtzb2NrZXQsc2V0U29ja2V0XT11c2VTdGF0ZSgpXHJcblxyXG5cclxuICAgIGNvbnN0IHsgY2hpbGRyZW4sc29ja2V0VXJsIH0gPSBwcm9wc1xyXG4gICAgY29uc3QgeyBkaXNwYXRjaCwgc3RhdGUgfSA9IHVzZUhhbmdvdXRzKClcclxuICAgIGNvbnN0IHsgZmV0Y2hIYW5nb3V0cyxzZWFyY2gscGVuZGluZ0hhbmdvdXQgfSA9IHN0YXRlXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHVzZXJuYW1lKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHNvY2sgPSBuZXcgV2ViU29ja2V0KGAke3NvY2tldFVybH0vaGFuZ291dHMvP3VzZXJuYW1lPSR7dXNlcm5hbWV9YCk7XHJcbiAgICAgICAgICAgIHNvY2sub25tZXNzYWdlID0gKHNlcnZlck1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2Uoc2VydmVyTWVzc2FnZS5kYXRhKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVELCBtZXNzYWdlOiBtc2cgfSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc29jay5vbm9wZW4gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5PUEVOIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzb2NrLm9uY2xvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTE9TRUQgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNvY2sub25lcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUiwgZXJyb3IgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZLCBzb2NrZXQ6IHNvY2sgfSk7XHJcbiAgICAgICAgICAgIHNldFNvY2tldChzb2NrKTtcclxuICAgICAgICB9XHJcbiAgICB9LCBbdXNlcm5hbWVdKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCk9PntcclxuICAgICAgICBpZihmZXRjaEhhbmdvdXRzKXtcclxuICAgICAgICBcclxuICAgICAgICAgICAgYWN0aW9ucy5mZXRjaEhhbmdvdXRzKHtkaXNwYXRjaCxzZWFyY2gsdXNlcm5hbWV9KVxyXG4gICAgICAgIH1cclxuICAgIH0sW2ZldGNoSGFuZ291dHNdKVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgICAgIGlmKHBlbmRpbmdIYW5nb3V0KXtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgc2VuZEhhbmdvdXQoKVxyXG4gICAgICAgIH1cclxuICAgIH0sW3BlbmRpbmdIYW5nb3V0XSlcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gc2VuZEhhbmdvdXQoKXtcclxuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShwZW5kaW5nSGFuZ291dCkpXHJcbiAgICBcclxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuXHJcblxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHsgUGFyc2VTZXJ2ZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9wYXJzZS9QYXJzZVNlcnZlcidcclxuaW1wb3J0IHsgV2ViU29ja2V0Q29udGFpbmVyIH0gZnJvbSAnLi4vc2VydmljZXMvd2Vic29ja2V0L1dlYlNvY2tldENvbnRhaW5lcidcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGFuZ291dEFkYXB0ZXIocHJvcHMpIHtcclxuICAgIGlmIChQUkVBQ1RfQVBQX0JBQ0sgPT09ICdQUkVBQ1RfQVBQX1BBUlNFJykge1xyXG4gICAgICAgIHJldHVybiA8UGFyc2VTZXJ2ZXIgey4uLnByb3BzfSAvPlxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoUFJFQUNUX0FQUF9CQUNLID09PSAnUFJFQUNUX0FQUF9OT0RFSlMnKSB7XHJcbiAgICAgICAgcmV0dXJuIDxXZWJTb2NrZXRDb250YWluZXIgey4uLnByb3BzfSAvPlxyXG4gICAgfVxyXG5cclxuICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUaGVtZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggVGhlbWVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgXHJcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRTdGF0ZSk7XHJcblxyXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0IH07XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBOYXZDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlTmF2Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChOYXZDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZU5hdkNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggTmF2UHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTmF2aWdhdGlvbigpIHtcclxuICBjb25zdCBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0gPSB1c2VOYXZDb250ZXh0KCk7XHJcbiAgICBmdW5jdGlvbiB0b2dnbGVEcmF3ZXIoKXtcclxuICAgICAgICBzZXREcmF3ZXJPcGVuKHByZXY9PiFwcmV2KVxyXG4gICAgfVxyXG4gIHJldHVybiB7IGRyYXdlck9wZW4sIHRvZ2dsZURyYXdlciB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZpZ2F0aW9uUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0sIFtkcmF3ZXJPcGVuXSk7XHJcbiAgcmV0dXJuIDxOYXZDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xyXG5pbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICBBcHBSb3V0ZVByb3ZpZGVyICBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSc7XHJcbmltcG9ydCAgSGFuZ291dEFkYXB0ZXIgIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRBZGFwdGVyJztcclxuaW1wb3J0IEhhbmdvdXRzUHJvdmlkZXIgIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInXHJcbmltcG9ydCAgQXV0aFByb3ZpZGVyICBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS9hdXRoLWNvbnRleHQnO1xyXG5pbXBvcnQgIFRoZW1lUHJvdmlkZXIgIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvdGhlbWUvdGhlbWUtY29udGV4dCc7XHJcbmltcG9ydCAgTmF2aWdhdGlvblByb3ZpZGVyICBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbnRyb2xzL25hdmlnYXRpb24vTmF2aWdhdGlvblByb3ZpZGVyJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUHJvdmlkZXJzKHsgY2hpbGRyZW4gfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8VGhlbWVQcm92aWRlclxyXG4gICAgICBpbml0U3RhdGU9e3tcclxuICAgICAgICBwcmltYXJ5OiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXHJcbiAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgSGVsdmV0aWNhLCBcIkFyaWFsXCInLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxBcHBSb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgdGl0bGU9XCJXZWJjb21cIlxyXG4gICAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnIH19XHJcbiAgICAgID5cclxuICAgICAgICA8QXV0aFByb3ZpZGVyPlxyXG4gICAgICAgICAgPE5hdmlnYXRpb25Qcm92aWRlcj5cclxuICAgICAgICAgICAgPEhhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDxIYW5nb3V0QWRhcHRlciBzb2NrZXRVcmw9e2B3c3M6Ly8ke2lwfTozMDAwYH0+XHJcbiAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgICA8L0hhbmdvdXRBZGFwdGVyPlxyXG4gICAgICAgICAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgICAgXHJcbiAgICAgICAgICA8L05hdmlnYXRpb25Qcm92aWRlcj5cclxuICAgICAgICA8L0F1dGhQcm92aWRlcj5cclxuICAgICAgPC9BcHBSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9UaGVtZVByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcydcclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0gKHByb3BzKXtcclxuY29uc3Qge2NoaWxkcmVufT1wcm9wc1xyXG5yZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiey4uLnByb3BzfT57Y2hpbGRyZW59PC9kaXY+XHJcbn0iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuXHJcblxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExpc3QocHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0XCIgey4uLnByb3BzfS8+XHJcbiAgKTtcclxufVxyXG5cclxuXHJcbiBmdW5jdGlvbiBMaXN0SXRlbShwcm9wcykge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWl0ZW1cIiB7Li4ucHJvcHN9IC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHtMaXN0SXRlbX0iLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBUUFBQUFBWUxsVkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQUFtSkxSMFFBQUtxTkl6SUFBQUFKY0VoWmN3QUFEc1FBQUE3RUFaVXJEaHNBQUFBSGRFbE5SUWZrQkJzSUxTMVlmOUpJQUFBRG9FbEVRVlJvM3IyWlMwaFVVUmpIZjNNdGk5QlNNMmxSMHRQSmhFalNWaUVFMWFLTmxSVVZKRkVRRkZFa2J1MjFLN0dJTmhGRlJBK0NsaVV0YXROTDNJVFJOS0VSQmxFTGRVYkg3S0dtYzF2Y3JqUGp6TDMzZkdmdStIMkxnWHZPOS85OTk1d3o1M1VEU0syTU9xcFlRd1hGRkZFQS9DVEdFRDEwRStZVi9XSkZaYXZsTWlIaW1DNGVKMFFiTlg2ajU5UE1SMWZ3ZEEvVFRLRS84QkxPTXlpQzJ6N0lPWXF6Z3dkb3BGOExibnVVVXhpNitGVzh5UXB1KzJ0VzZ1QjNNdVFMM3NUa0IvdGtjSU1ydnNGdGIxUHZpbndlK0k0M01iblBiRFY4ZTA3d0ppWlB2Rk1JY0NkbmVCT1RCMTRkNFgvZlQvZFdOL3llbk9OTlRQWTc0VmNTbTVFRVlxekkzUHYrVERzcS9wSkFBbXZiRVc3S0pndSs4cEFlSU1oK2xncGpEM0VuOVVFSkE2SjMrRU1UZVZQUmVUVHpSeFRmUjFGcUFoZEU0V05zVDN1bnJjSVV6aVFIenhjdXVNY3lOdXR4a1VZMGViL1FMQXJ0U0JvNXFjTzRVNlRUbEFnTmlRSjNPUTR0MlR3U3RzTnFSV0cveUhkTUlKOWZJcTFxTU1CNVpzcG9IWXc3bG8zVEtkSTZZQ1d3VFJUVTYxcjZSYVMxQlF6S1dDc0tpcm1XUmtWYTZ5ZzFxSE1ZMDA0Mng3VjBya2pMb002Z1NoUUNTMXhMeTRWcVZRWkJZVWl0UzFsQWZDWUtHbFFJUThxcGRpeXI4V2lmZEtzd0tCV0d3RW5Ia2hOaXJWS0lpS1lPRTVNSmg0YmV5SVJZYXdER3hFRW1uMW1VaGkralYwTnBWQzhCazI0cVUvQ1ZkR3Zwak9wMGdSMjZlQW8vVDdnWFNPb0NnNS9pZ1dQWnA2UzdrTjk4MUZRWk1ZaG9oUDNsT3B1SUp6M1p6RTBtTkpRaWlNK0JvOXh3T0c2djVwWjRSTjJEczRMcWNSNnl6UFdObHZOSWxFQUxOQ2hYamxHdjFLejFEQ3RyN29ReWozc3YyNzhKSnUxS3ZpdHBUbHJ6OEh1RnFtTXVLMEFtMjhDNGdtcVh0U042cmlEWVJwY29nYmRjVWFqMXpQcXBVUmo1QzBWNGdFVUsvNGoxZHVXd1I4VjJNUjdncVlkcUNQaC9YM0hiUTZwREs0RTNIdVZKMUVLUG8xbURWZ0x1eDVRSUJZa1dHT0dhcTFSTUt3SDNxS3ZXS21UdmlJdnB5YkRHMnphaU5jL1Bjcm11N2lQSWNPcWp3NklwTkZzL21KNVRnTmN6aG4rUitTd3lVNWRVUTVrdnFRQjJ6MGdDenNkN29DM24rSXZ1SXpmQTdaemk3M3ZmbWMvTzRXWDFZN1g3OGxuY3lnbityaHJlNm9oV24rRnhMZ3F2QWRpaCthMHNrdyt6VndhM2JBVXZmY0cvWUxrTzN1cUtSdnF5Z2tjNUttMzY2VmJFR2FKYThBZ3RMTWdPYmxzQlRYd1F3VU9jdHRaN1A2MmFWdDR4NlFxZXBJdExpYjJlU2k5THJaUTYxbEpKQlNWSm4rOEhwejdmQzgrYS93QzFaQVhzM1VoVUhBQUFBQ1YwUlZoMFpHRjBaVHBqY21WaGRHVUFNakF5TUMwd05DMHlOMVF3T0RvME5UbzBOU3N3TURvd01CYXdTVlFBQUFBbGRFVllkR1JoZEdVNmJXOWthV1o1QURJd01qQXRNRFF0TWpkVU1EZzZORFU2TkRVck1EQTZNREJuN2ZIb0FBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCM2QzY3VhVzVyYzJOaGNHVXViM0pubSs0OEdnQUFBQUJKUlU1RXJrSmdnZz09XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQsXHJcbiAgICBwYXlsb2FkOiB7XHJcbiAgICAgIHByb3BOYW1lLFxyXG4gICAgICB2YWx1ZSxcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2ViY29tJyk7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX1NVQ0NFU1MgfTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxyXG4gICAgdG9rZW4sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY292ZXJMb2NhbEF1dGhTdGF0ZSh7IHVzZXIsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSwgdXNlciB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJcclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnXHJcbmltcG9ydCBMaXN0LCB7IExpc3RJdGVtIH0gZnJvbSAnY29udHJvbHMvbGlzdCc7XHJcbmltcG9ydCB1c2VySWNvbiBmcm9tICcuLi9pY29ucy91c2VyNjQucG5nJztcclxuaW1wb3J0IHsgbG9nb3V0IH0gZnJvbSAnLi4vc3RhdGUvYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vc3RhdGUvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGdyaWQ6IHtcclxuICAgIGRpc3BsYXk6ICdncmlkJyxcclxuICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdhdXRvIDUlIGF1dG8nLFxyXG4gICAganVzdGlmeUl0ZW1zOiAnY2VudGVyJyxcclxuICAgIHBhZGRpbmc6IDE2XHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoRHJhd2VyQ29udGVudCh7IHRvZ2dsZURyYXdlciB9KSB7XHJcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKVxyXG4gIGNvbnN0IHsgc3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtpZH1gLCByb3V0ZTogJy9hdXRoJyB9KTtcclxuICAgIGlmIChkZXZpY2UgPT09ICdwaG9uZScpIHtcclxuICAgICAgdG9nZ2xlRHJhd2VyKClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmdUb3A6IDEwIH19PlxyXG4gICAgICB7IXN0YXRlLnVzZXIgJiYgPFVuQXV0aGVkU3RhdGUgaGFuZGxlUm91dGU9e2hhbmRsZVJvdXRlfSAvPn1cclxuICAgICAge3N0YXRlLnVzZXIgJiYgKFxyXG4gICAgICAgIDxBdXRoZWRTdGF0ZVxyXG4gICAgICAgICAgb25BcHBSb3V0ZT17b25BcHBSb3V0ZX1cclxuICAgICAgICAgIGhhbmRsZVJvdXRlPXtoYW5kbGVSb3V0ZX1cclxuICAgICAgICAgIHVzZXJOYW1lPXtzdGF0ZS51c2VyLnVzZXJuYW1lfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICl9XHJcbiAgICAgIDxociBzdHlsZT17eyBoZWlnaHQ6IDEgfX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlLCB1c2VyTmFtZSwgb25BcHBSb3V0ZSB9KSB7XHJcbiAgZnVuY3Rpb24gaGFuZGxlTG9nT3V0KCkge1xyXG5cclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6ICcvJywgcm91dGU6ICcvaG9tZScgfSk7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGltZyBzcmM9e3VzZXJJY29ufSBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDUgfX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZUxvZ091dH0gaWQ9J2xvZ291dCcgZGF0YS10ZXN0aWQ9J2xvZ291dCc+XHJcbiAgICAgICAgICAgIExvZ291dFxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDggfX0+V2VsY29tZSwge3VzZXJOYW1lfTwvZGl2PlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdjaGFuZ2VwYXNzd29yZCcgZGF0YS10ZXN0aWQ9J2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICAgIENoYW5nZSBQYXNzd29yZFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBVbkF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5ncmlkfT5cclxuICAgICAgICA8YSBocmVmPScvJyBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2xvZ2luJyBkYXRhLXRlc3RpZD0nbG9naW4nPlxyXG4gICAgICAgICAgTG9naW5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgPGRpdj58PC9kaXY+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdzaWdudXAnIGRhdGEtdGVzdGlkPSdzaWdudXAnPlxyXG4gICAgICAgICAgU2lnbnVwXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgTGlzdCwgeyBMaXN0SXRlbSB9IGZyb20gJ2NvbnRyb2xzL2xpc3QnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL3VzZVVzZXJOYW1lJztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlL2FjdGlvblR5cGVzJ1xyXG5pbXBvcnQge3VzZU1lZGlhUXVlcnl9IGZyb20gJ2NvbXBvbmVudHMvbGF5b3V0L3VzZU1lZGlhUXVlcnknXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXREcmF3ZXJDb250ZW50KHt0b2dnbGVEcmF3ZXJ9KSB7XHJcbmNvbnN0IHtkZXZpY2V9PXVzZU1lZGlhUXVlcnkoKVxyXG5jb25zdCB7b25BcHBSb3V0ZX0gPXVzZUFwcFJvdXRlKClcclxuXHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBpZiAodXNlcm5hbWUpIHtcclxuXHJcbiAgICAgIG9uQXBwUm91dGUoe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTonL2hhbmdvdXRzJyxyb3V0ZTonL2hhbmdvdXRzJ30pXHJcbiAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBvbkFwcFJvdXRlKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGU6Jy9sb2dpbicscm91dGU6Jy9hdXRoJ30pXHJcbiAgICB9XHJcblxyXG4gICAgaWYoZGV2aWNlPT09J3Bob25lJyl7XHJcbiAgICAgIHRvZ2dsZURyYXdlcigpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGRhdGEtdGVzdGlkPSdoYW5nb3V0cyc+XHJcbiAgICAgICAgICBIYW5nb3V0XHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuIFxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgbWVzc2FnZUljb24gZnJvbSAnLi9tZXNzYWdlLnBuZyc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIGNvdW50OiB7XHJcbiAgICB3aWR0aDogMzAsXHJcbiAgICBoZWlnaHQ6IDMwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nLFxyXG4gICAgY29sb3I6ICd3aGl0ZScsXHJcbiAgICB0ZXh0QWxpZ246J2NlbnRlcicsXHJcbiAgICBib3JkZXJSYWRpdXM6MTUsXHJcbiAgICBkaXNwbGF5OidmbGV4JyxcclxuICAgIGFsaWduSXRlbXM6J2NlbnRlcicsXHJcbiAgICBqdXN0aWZ5Q29udGVudDonY2VudGVyJ1xyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBNZXNzYWdlKHsgY291bnQ9MCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJ319PlxyXG4gICAgICAgICAgPGRpdj5tZXNzYWdlOjwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5jb3VudH0gZGF0YS10ZXN0aWQ9XCJtZXNzYWdlLWNvdW50XCI+e2NvdW50fTwvZGl2PiBcclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gU2V0dGluZ3MocHJvcHMpIHtcclxuXHJcbiAgY29uc3QgeyBoZWlnaHQgPSAyNCxcclxuICAgIHdpZHRoID0gMjQsXHJcbiAgICBmaWxsID0gJ25vbmUnLFxyXG4gICAgY29sb3IgPSAnYmxhY2snLG9uQ2xpY2sgLGlkfT1wcm9wc1xyXG4gIFxyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gIGlkPXtpZH0+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMFYweicgZmlsbD17ZmlsbH0gaWQ9e2lkfS8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGlkPXtpZH1cclxuICAgICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgICAgY29sb3I9e2NvbG9yfVxyXG4gICAgICAgIGQ9J00xOS40MyAxMi45OGMuMDQtLjMyLjA3LS42NC4wNy0uOThzLS4wMy0uNjYtLjA3LS45OGwyLjExLTEuNjVjLjE5LS4xNS4yNC0uNDIuMTItLjY0bC0yLTMuNDZjLS4xMi0uMjItLjM5LS4zLS42MS0uMjJsLTIuNDkgMWMtLjUyLS40LTEuMDgtLjczLTEuNjktLjk4bC0uMzgtMi42NUMxNC40NiAyLjE4IDE0LjI1IDIgMTQgMmgtNGMtLjI1IDAtLjQ2LjE4LS40OS40MmwtLjM4IDIuNjVjLS42MS4yNS0xLjE3LjU5LTEuNjkuOThsLTIuNDktMWMtLjIzLS4wOS0uNDkgMC0uNjEuMjJsLTIgMy40NmMtLjEzLjIyLS4wNy40OS4xMi42NGwyLjExIDEuNjVjLS4wNC4zMi0uMDcuNjUtLjA3Ljk4cy4wMy42Ni4wNy45OGwtMi4xMSAxLjY1Yy0uMTkuMTUtLjI0LjQyLS4xMi42NGwyIDMuNDZjLjEyLjIyLjM5LjMuNjEuMjJsMi40OS0xYy41Mi40IDEuMDguNzMgMS42OS45OGwuMzggMi42NWMuMDMuMjQuMjQuNDIuNDkuNDJoNGMuMjUgMCAuNDYtLjE4LjQ5LS40MmwuMzgtMi42NWMuNjEtLjI1IDEuMTctLjU5IDEuNjktLjk4bDIuNDkgMWMuMjMuMDkuNDkgMCAuNjEtLjIybDItMy40NmMuMTItLjIyLjA3LS40OS0uMTItLjY0bC0yLjExLTEuNjV6TTEyIDE1LjVjLTEuOTMgMC0zLjUtMS41Ny0zLjUtMy41czEuNTctMy41IDMuNS0zLjUgMy41IDEuNTcgMy41IDMuNS0xLjU3IDMuNS0zLjUgMy41eidcclxuICAgICAgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHdpZHRoOiAxNSxcclxuICBoZWlnaHQ6IDE1LFxyXG5cclxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XHJcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XHJcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XHJcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XHJcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XHJcbiAgfVxyXG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxyXG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxyXG4gICAgPjwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XHJcbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXHJcbiAgICA+PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTmF2SXRlbSB9IGZyb20gJ2NvbnRyb2xzL25hdmlnYXRpb24vTmF2SXRlbSc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICdpY29ucy9NZXNzYWdlJztcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICdpY29ucy9TZXR0aW5ncyc7XHJcbmltcG9ydCB7IE9ubGluZVN0YXR1cyB9IGZyb20gJ2ljb25zL29ubGluZVN0YXR1cyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi4vLi4vc3RhdGUvdXNlSGFuZ291dHMnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL3VzZVVzZXJOYW1lJztcclxuaW1wb3J0IHsgdXNlQXBwUm91dGUgfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dFRvcE1lbnUoKSB7XHJcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XHJcbiAgY29uc3QgeyByZWFkeVN0YXRlLCB1bnJlYWRoYW5nb3V0cywgb25OYXZpZ2F0aW9uLCBoYW5nb3V0IH0gPSB1c2VIYW5nb3V0cygpO1xyXG5cclxuICBmdW5jdGlvbiBuYXZUb1VucmVhZCgpIHtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6ICcvVU5SRUFEJywgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XHJcbiAgICAgIDxOYXZJdGVtPnt1c2VybmFtZX08L05hdkl0ZW0+XHJcbiAgICAgIDxOYXZJdGVtPlxyXG4gICAgICAgIDxPbmxpbmVTdGF0dXMgcmVhZHlTdGF0ZT17cmVhZHlTdGF0ZX0gLz5cclxuICAgICAgPC9OYXZJdGVtPlxyXG4gICAgICA8TmF2SXRlbSBvbkNsaWNrPXtuYXZUb1VucmVhZH0gZGF0YS10ZXN0aWQ9XCJuYXYtdW5yZWFkc1wiPlxyXG4gICAgICAgIHt1bnJlYWRoYW5nb3V0cyAmJiA8TWVzc2FnZSBjb3VudD17dW5yZWFkaGFuZ291dHMuZmlsdGVyKGY9PmYucmVhZD09PWZhbHNlKS5sZW5ndGh9IC8+fXsnICd9XHJcbiAgICAgIDwvTmF2SXRlbT5cclxuICAgICAge2hhbmdvdXQgJiYgKFxyXG4gICAgICAgIDxOYXZJdGVtICAgIG9uQ2xpY2s9e29uTmF2aWdhdGlvbn0gZGF0YS10ZXN0aWQ9XCJuYXYtY29uZmlnXCIgaWQ9XCJjb25maWd1cmVcIiA+XHJcbiAgICAgICAgICA8U2V0dGluZ3NcclxuICAgICAgICAgICAgZmlsbD1cIndoaXRlXCJcclxuICAgICAgICAgICAgd2lkdGg9XCIzMFwiXHJcbiAgICAgICAgICAgIGhlaWdodD1cIjMwXCJcclxuICAgICAgICAgXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuLy9cclxuIiwiZXhwb3J0IGNvbnN0IGRyYXdlciA9IHtcclxuICBib3hTaGFkb3c6IGAwcHggM3B4IDNweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSwwcHggM3B4IDRweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE0KSwgMHB4IDFweCA4cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xMilgLFxyXG5cclxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICBsZWZ0OiAwLFxyXG4gIHRvcDogMCxcclxuICB6SW5kZXg6IDEwLFxyXG4gIGhlaWdodDogJzEwMHZoJyxcclxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjVmNWY1JyxcclxufTtcclxuIiwiXHJcbmltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge3VzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgZHJhd2VyIH0gZnJvbSAnLi9zdHlsZSc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERyYXdlcihwcm9wcykge1xyXG4gIGNvbnN0IFtwaW5uZWQsc2V0UGlubmVkXT11c2VTdGF0ZShmYWxzZSlcclxuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7IG9wZW4sIG9uQ2xpY2ssIGNoaWxkcmVuLHN0eWxlIH0gPSBwcm9wcztcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXZcclxuICAgICAgIHN0eWxlPXt7Li4uZHJhd2VyLHBvc2l0aW9uOiBkZXZpY2U9PT1cInBob25lXCIgPyAnZml4ZWQnOidyZWxhdGl2ZSd9fVxyXG4gICAgICAgIGNsYXNzTmFtZT17YGRyYXdlci0ke2RldmljZX0td2lkdGhgfVxyXG4gICAgICA+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uLy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwQmFyKHsgY2hpbGRyZW4sc3R5bGUgfSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAuLi50aGVtZS5wcmltYXJ5LFxyXG4gICAgICAgLy8gIHBvc2l0aW9uOiAnZml4ZWQnLFxyXG4gICAgICAgIC8vIGxlZnQ6IDAsXHJcbiAgICAgICAvLyAgdG9wOiAwLFxyXG4gICAgICAgIG1pbkhlaWdodDogNjQsXHJcbiAgICAgICAvLyBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAvLyBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgZGlzcGxheTonZmxleCcsLi4uc3R5bGVcclxuICAgICAgfX1cclxuICAgID5cclxuICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5pbXBvcnQgJy4uL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudVdoaXRlKHsgb25DbGljaywgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPVwibWVudS13aGl0ZVwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICBmaWxsPVwid2hpdGVcIlxyXG4gICAgICB3aWR0aD1cIjI0cHhcIlxyXG4gICAgICBoZWlnaHQ9XCIyNHB4XCJcclxuICAgID5cclxuICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMyAxOGgxOHYtMkgzdjJ6bTAtNWgxOHYtMkgzdjJ6bTAtN3YyaDE4VjZIM3pcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTWVudVdoaXRlIH0gZnJvbSAnLi9pY29ucy9NZW51V2hpdGUnO1xyXG5leHBvcnQgZnVuY3Rpb24gTWVudSh7b25DbGlja30pIHtcclxuXHJcblxyXG4gIHJldHVybiA8TWVudVdoaXRlIG9uQ2xpY2s9e29uQ2xpY2t9IGlkPVwibWVudVwiIC8+O1xyXG59XHJcbiIsImltcG9ydHt1c2VTdGF0ZSBhcyBuLHVzZVJlZHVjZXIgYXMgdCx1c2VFZmZlY3QgYXMgZSx1c2VMYXlvdXRFZmZlY3QgYXMgcix1c2VSZWYgYXMgbyx1c2VJbXBlcmF0aXZlSGFuZGxlIGFzIHUsdXNlTWVtbyBhcyBpLHVzZUNhbGxiYWNrIGFzIGYsdXNlQ29udGV4dCBhcyBjLHVzZURlYnVnVmFsdWUgYXMgYX1mcm9tXCJwcmVhY3QvaG9va3NcIjtleHBvcnQqZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e0NvbXBvbmVudCBhcyBsLGNyZWF0ZUVsZW1lbnQgYXMgcyxvcHRpb25zIGFzIHYsdG9DaGlsZEFycmF5IGFzIGgsaHlkcmF0ZSBhcyBwLHJlbmRlciBhcyBkLF91bm1vdW50IGFzIG0sY2xvbmVFbGVtZW50IGFzIHksY3JlYXRlUmVmIGFzIGIsY3JlYXRlQ29udGV4dCBhcyBnLEZyYWdtZW50IGFzIHh9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2NyZWF0ZUVsZW1lbnQsY3JlYXRlQ29udGV4dCxjcmVhdGVSZWYsRnJhZ21lbnQsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2Z1bmN0aW9uIEUobix0KXtmb3IodmFyIGUgaW4gdCluW2VdPXRbZV07cmV0dXJuIG59ZnVuY3Rpb24gdyhuLHQpe2Zvcih2YXIgZSBpbiBuKWlmKFwiX19zb3VyY2VcIiE9PWUmJiEoZSBpbiB0KSlyZXR1cm4hMDtmb3IodmFyIHIgaW4gdClpZihcIl9fc291cmNlXCIhPT1yJiZuW3JdIT09dFtyXSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgQz1mdW5jdGlvbihuKXt2YXIgdCxlO2Z1bmN0aW9uIHIodCl7dmFyIGU7cmV0dXJuKGU9bi5jYWxsKHRoaXMsdCl8fHRoaXMpLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwLGV9cmV0dXJuIGU9biwodD1yKS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Ll9fcHJvdG9fXz1lLHIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuLHQpe3JldHVybiB3KHRoaXMucHJvcHMsbil8fHcodGhpcy5zdGF0ZSx0KX0scn0obCk7ZnVuY3Rpb24gXyhuLHQpe2Z1bmN0aW9uIGUobil7dmFyIGU9dGhpcy5wcm9wcy5yZWYscj1lPT1uLnJlZjtyZXR1cm4hciYmZSYmKGUuY2FsbD9lKG51bGwpOmUuY3VycmVudD1udWxsKSx0PyF0KHRoaXMucHJvcHMsbil8fCFyOncodGhpcy5wcm9wcyxuKX1mdW5jdGlvbiByKHQpe3JldHVybiB0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1lLHMobixFKHt9LHQpKX1yZXR1cm4gci5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD0hMCxyLmRpc3BsYXlOYW1lPVwiTWVtbyhcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIixyLnQ9ITAscn12YXIgQT12Ll9fYjtmdW5jdGlvbiBTKG4pe2Z1bmN0aW9uIHQodCl7dmFyIGU9RSh7fSx0KTtyZXR1cm4gZGVsZXRlIGUucmVmLG4oZSx0LnJlZil9cmV0dXJuIHQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9dC50PSEwLHQuZGlzcGxheU5hbWU9XCJGb3J3YXJkUmVmKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHR9di5fX2I9ZnVuY3Rpb24obil7bi50eXBlJiZuLnR5cGUudCYmbi5yZWYmJihuLnByb3BzLnJlZj1uLnJlZixuLnJlZj1udWxsKSxBJiZBKG4pfTt2YXIgaz1mdW5jdGlvbihuLHQpe3JldHVybiBuP2gobikucmVkdWNlKGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gbi5jb25jYXQodChlLHIpKX0sW10pOm51bGx9LFI9e21hcDprLGZvckVhY2g6ayxjb3VudDpmdW5jdGlvbihuKXtyZXR1cm4gbj9oKG4pLmxlbmd0aDowfSxvbmx5OmZ1bmN0aW9uKG4pe2lmKDEhPT0obj1oKG4pKS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuXCIpO3JldHVybiBuWzBdfSx0b0FycmF5Omh9LEY9di5fX2U7ZnVuY3Rpb24gTihuKXtyZXR1cm4gbiYmKChuPUUoe30sbikpLl9fYz1udWxsLG4uX19rPW4uX19rJiZuLl9fay5tYXAoTikpLG59ZnVuY3Rpb24gVSgpe3RoaXMuX191PTAsdGhpcy5vPW51bGwsdGhpcy5fX2I9bnVsbH1mdW5jdGlvbiBNKG4pe3ZhciB0PW4uX18uX19jO3JldHVybiB0JiZ0LnUmJnQudShuKX1mdW5jdGlvbiBMKG4pe3ZhciB0LGUscjtmdW5jdGlvbiBvKG8pe2lmKHR8fCh0PW4oKSkudGhlbihmdW5jdGlvbihuKXtlPW4uZGVmYXVsdHx8bn0sZnVuY3Rpb24obil7cj1ufSkscil0aHJvdyByO2lmKCFlKXRocm93IHQ7cmV0dXJuIHMoZSxvKX1yZXR1cm4gby5kaXNwbGF5TmFtZT1cIkxhenlcIixvLnQ9ITAsb31mdW5jdGlvbiBPKCl7dGhpcy5pPW51bGwsdGhpcy5sPW51bGx9di5fX2U9ZnVuY3Rpb24obix0LGUpe2lmKG4udGhlbilmb3IodmFyIHIsbz10O289by5fXzspaWYoKHI9by5fX2MpJiZyLl9fYylyZXR1cm4gci5fX2Mobix0Ll9fYyk7RihuLHQsZSl9LChVLnByb3RvdHlwZT1uZXcgbCkuX19jPWZ1bmN0aW9uKG4sdCl7dmFyIGU9dGhpcztudWxsPT1lLm8mJihlLm89W10pLGUuby5wdXNoKHQpO3ZhciByPU0oZS5fX3YpLG89ITEsdT1mdW5jdGlvbigpe298fChvPSEwLHI/cihpKTppKCkpfTt0Ll9fYz10LmNvbXBvbmVudFdpbGxVbm1vdW50LHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1KCksdC5fX2MmJnQuX19jKCl9O3ZhciBpPWZ1bmN0aW9uKCl7dmFyIG47aWYoIS0tZS5fX3UpZm9yKGUuX192Ll9fa1swXT1lLnN0YXRlLnUsZS5zZXRTdGF0ZSh7dTplLl9fYj1udWxsfSk7bj1lLm8ucG9wKCk7KW4uZm9yY2VVcGRhdGUoKX07ZS5fX3UrK3x8ZS5zZXRTdGF0ZSh7dTplLl9fYj1lLl9fdi5fX2tbMF19KSxuLnRoZW4odSx1KX0sVS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMuX19iJiYodGhpcy5fX3YuX19rWzBdPU4odGhpcy5fX2IpLHRoaXMuX19iPW51bGwpLFtzKGwsbnVsbCx0LnU/bnVsbDpuLmNoaWxkcmVuKSx0LnUmJm4uZmFsbGJhY2tdfTt2YXIgUD1mdW5jdGlvbihuLHQsZSl7aWYoKytlWzFdPT09ZVswXSYmbi5sLmRlbGV0ZSh0KSxuLnByb3BzLnJldmVhbE9yZGVyJiYoXCJ0XCIhPT1uLnByb3BzLnJldmVhbE9yZGVyWzBdfHwhbi5sLnNpemUpKWZvcihlPW4uaTtlOyl7Zm9yKDtlLmxlbmd0aD4zOyllLnBvcCgpKCk7aWYoZVsxXTxlWzBdKWJyZWFrO24uaT1lPWVbMl19fTsoTy5wcm90b3R5cGU9bmV3IGwpLnU9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcyxlPU0odC5fX3YpLHI9dC5sLmdldChuKTtyZXR1cm4gclswXSsrLGZ1bmN0aW9uKG8pe3ZhciB1PWZ1bmN0aW9uKCl7dC5wcm9wcy5yZXZlYWxPcmRlcj8oci5wdXNoKG8pLFAodCxuLHIpKTpvKCl9O2U/ZSh1KTp1KCl9fSxPLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obil7dGhpcy5pPW51bGwsdGhpcy5sPW5ldyBNYXA7dmFyIHQ9aChuLmNoaWxkcmVuKTtuLnJldmVhbE9yZGVyJiZcImJcIj09PW4ucmV2ZWFsT3JkZXJbMF0mJnQucmV2ZXJzZSgpO2Zvcih2YXIgZT10Lmxlbmd0aDtlLS07KXRoaXMubC5zZXQodFtlXSx0aGlzLmk9WzEsMCx0aGlzLmldKTtyZXR1cm4gbi5jaGlsZHJlbn0sTy5wcm90b3R5cGUuY29tcG9uZW50RGlkVXBkYXRlPU8ucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50PWZ1bmN0aW9uKCl7dmFyIG49dGhpcztuLmwuZm9yRWFjaChmdW5jdGlvbih0LGUpe1AobixlLHQpfSl9O3ZhciBXPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe312YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0fSx0LnJlbmRlcj1mdW5jdGlvbihuKXtyZXR1cm4gbi5jaGlsZHJlbn0sbn0oKTtmdW5jdGlvbiBqKG4pe3ZhciB0PXRoaXMsZT1uLmNvbnRhaW5lcixyPXMoVyx7Y29udGV4dDp0LmNvbnRleHR9LG4udm5vZGUpO3JldHVybiB0LnMmJnQucyE9PWUmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpLHQucD0hMSksbi52bm9kZT90LnA/KGUuX19rPXQuX19rLGQocixlKSx0Ll9faz1lLl9fayk6KHQudj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSxwKFwiXCIsZSksZS5hcHBlbmRDaGlsZCh0LnYpLHQucD0hMCx0LnM9ZSxkKHIsZSx0LnYpLHQuX19rPXQudi5fX2spOnQucCYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCkpLHQuaD1yLHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpfSxudWxsfWZ1bmN0aW9uIHoobix0KXtyZXR1cm4gcyhqLHt2bm9kZTpuLGNvbnRhaW5lcjp0fSl9dmFyIEQ9L14oPzphY2NlbnR8YWxpZ25tZW50fGFyYWJpY3xiYXNlbGluZXxjYXB8Y2xpcCg/IVBhdGhVKXxjb2xvcnxmaWxsfGZsb29kfGZvbnR8Z2x5cGgoPyFSKXxob3JpenxtYXJrZXIoPyFIfFd8VSl8b3ZlcmxpbmV8cGFpbnR8c3RvcHxzdHJpa2V0aHJvdWdofHN0cm9rZXx0ZXh0KD8hTCl8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZWN0b3J8dmVydHx3b3JkfHdyaXRpbmd8eCg/IUMpKVtBLVpdLztsLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXt9O3ZhciBIPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpfHw2MDEwMztmdW5jdGlvbiBUKG4sdCxlKXtpZihudWxsPT10Ll9faylmb3IoO3QuZmlyc3RDaGlsZDspdC5yZW1vdmVDaGlsZCh0LmZpcnN0Q2hpbGQpO3JldHVybiBkKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH1mdW5jdGlvbiBWKG4sdCxlKXtyZXR1cm4gcChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9dmFyIFo9di5ldmVudDtmdW5jdGlvbiBJKG4sdCl7bltcIlVOU0FGRV9cIit0XSYmIW5bdF0mJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLHQse2NvbmZpZ3VyYWJsZTohMSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tcIlVOU0FGRV9cIit0XX0sc2V0OmZ1bmN0aW9uKG4pe3RoaXNbXCJVTlNBRkVfXCIrdF09bn19KX12LmV2ZW50PWZ1bmN0aW9uKG4pe1omJihuPVoobikpLG4ucGVyc2lzdD1mdW5jdGlvbigpe307dmFyIHQ9ITEsZT0hMSxyPW4uc3RvcFByb3BhZ2F0aW9uO24uc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7ci5jYWxsKG4pLHQ9ITB9O3ZhciBvPW4ucHJldmVudERlZmF1bHQ7cmV0dXJuIG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtvLmNhbGwobiksZT0hMH0sbi5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1mdW5jdGlvbigpe3JldHVybiB0fSxuLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBlfSxuLm5hdGl2ZUV2ZW50PW59O3ZhciAkPXtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xhc3N9fSxxPXYudm5vZGU7di52bm9kZT1mdW5jdGlvbihuKXtuLiQkdHlwZW9mPUg7dmFyIHQ9bi50eXBlLGU9bi5wcm9wcztpZih0KXtpZihlLmNsYXNzIT1lLmNsYXNzTmFtZSYmKCQuZW51bWVyYWJsZT1cImNsYXNzTmFtZVwiaW4gZSxudWxsIT1lLmNsYXNzTmFtZSYmKGUuY2xhc3M9ZS5jbGFzc05hbWUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiY2xhc3NOYW1lXCIsJCkpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpe3ZhciByLG8sdTtmb3IodSBpbiBlLmRlZmF1bHRWYWx1ZSYmdm9pZCAwIT09ZS52YWx1ZSYmKGUudmFsdWV8fDA9PT1lLnZhbHVlfHwoZS52YWx1ZT1lLmRlZmF1bHRWYWx1ZSksZGVsZXRlIGUuZGVmYXVsdFZhbHVlKSxBcnJheS5pc0FycmF5KGUudmFsdWUpJiZlLm11bHRpcGxlJiZcInNlbGVjdFwiPT09dCYmKGgoZS5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbihuKXstMSE9ZS52YWx1ZS5pbmRleE9mKG4ucHJvcHMudmFsdWUpJiYobi5wcm9wcy5zZWxlY3RlZD0hMCl9KSxkZWxldGUgZS52YWx1ZSksZSlpZihyPUQudGVzdCh1KSlicmVhaztpZihyKWZvcih1IGluIG89bi5wcm9wcz17fSxlKW9bRC50ZXN0KHUpP3UucmVwbGFjZSgvW0EtWjAtOV0vLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCk6dV09ZVt1XX0hZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlLHI9bi5wcm9wcztpZihyJiZcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIG89e307Zm9yKHZhciB1IGluIHIpL15vbihBbml8VHJhfFRvdSkvLnRlc3QodSkmJihyW3UudG9Mb3dlckNhc2UoKV09clt1XSxkZWxldGUgclt1XSksb1t1LnRvTG93ZXJDYXNlKCldPXU7aWYoby5vbmRvdWJsZWNsaWNrJiYoci5vbmRibGNsaWNrPXJbby5vbmRvdWJsZWNsaWNrXSxkZWxldGUgcltvLm9uZG91YmxlY2xpY2tdKSxvLm9uYmVmb3JlaW5wdXQmJihyLm9uYmVmb3JlaW5wdXQ9cltvLm9uYmVmb3JlaW5wdXRdLGRlbGV0ZSByW28ub25iZWZvcmVpbnB1dF0pLG8ub25jaGFuZ2UmJihcInRleHRhcmVhXCI9PT1lfHxcImlucHV0XCI9PT1lLnRvTG93ZXJDYXNlKCkmJiEvXmZpbHxjaGV8cmEvaS50ZXN0KHIudHlwZSkpKXt2YXIgaT1vLm9uaW5wdXR8fFwib25pbnB1dFwiO3JbaV18fChyW2ldPXJbby5vbmNoYW5nZV0sZGVsZXRlIHJbby5vbmNoYW5nZV0pfX19KCksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmIXQubSYmdC5wcm90b3R5cGUmJihJKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbE1vdW50XCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzXCIpLEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsVXBkYXRlXCIpLHQubT0hMCl9cSYmcShuKX07dmFyIEI9XCIxNi44LjBcIjtmdW5jdGlvbiBHKG4pe3JldHVybiBzLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBKKG4pe3JldHVybiEhbiYmbi4kJHR5cGVvZj09PUh9ZnVuY3Rpb24gSyhuKXtyZXR1cm4gSihuKT95LmFwcGx5KG51bGwsYXJndW1lbnRzKTpufWZ1bmN0aW9uIFEobil7cmV0dXJuISFuLl9fayYmKGQobnVsbCxuKSwhMCl9ZnVuY3Rpb24gWChuKXtyZXR1cm4gbiYmKG4uYmFzZXx8MT09PW4ubm9kZVR5cGUmJm4pfHxudWxsfXZhciBZPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4odCl9O2V4cG9ydCBkZWZhdWx0e3VzZVN0YXRlOm4sdXNlUmVkdWNlcjp0LHVzZUVmZmVjdDplLHVzZUxheW91dEVmZmVjdDpyLHVzZVJlZjpvLHVzZUltcGVyYXRpdmVIYW5kbGU6dSx1c2VNZW1vOmksdXNlQ2FsbGJhY2s6Zix1c2VDb250ZXh0OmMsdXNlRGVidWdWYWx1ZTphLHZlcnNpb246XCIxNi44LjBcIixDaGlsZHJlbjpSLHJlbmRlcjpULGh5ZHJhdGU6VCx1bm1vdW50Q29tcG9uZW50QXROb2RlOlEsY3JlYXRlUG9ydGFsOnosY3JlYXRlRWxlbWVudDpzLGNyZWF0ZUNvbnRleHQ6ZyxjcmVhdGVGYWN0b3J5OkcsY2xvbmVFbGVtZW50OkssY3JlYXRlUmVmOmIsRnJhZ21lbnQ6eCxpc1ZhbGlkRWxlbWVudDpKLGZpbmRET01Ob2RlOlgsQ29tcG9uZW50OmwsUHVyZUNvbXBvbmVudDpDLG1lbW86Xyxmb3J3YXJkUmVmOlMsdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXM6WSxTdXNwZW5zZTpVLFN1c3BlbnNlTGlzdDpPLGxhenk6TH07ZXhwb3J0e0IgYXMgdmVyc2lvbixSIGFzIENoaWxkcmVuLFQgYXMgcmVuZGVyLFYgYXMgaHlkcmF0ZSxRIGFzIHVubW91bnRDb21wb25lbnRBdE5vZGUseiBhcyBjcmVhdGVQb3J0YWwsRyBhcyBjcmVhdGVGYWN0b3J5LEsgYXMgY2xvbmVFbGVtZW50LEogYXMgaXNWYWxpZEVsZW1lbnQsWCBhcyBmaW5kRE9NTm9kZSxDIGFzIFB1cmVDb21wb25lbnQsXyBhcyBtZW1vLFMgYXMgZm9yd2FyZFJlZixZIGFzIHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzLFUgYXMgU3VzcGVuc2UsTyBhcyBTdXNwZW5zZUxpc3QsTCBhcyBsYXp5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBhdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIb21lKCkge1xyXG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPSdob21lJyBzdHlsZT17e3BhZGRpbmdUb3A6Njh9fT5Ib21lPC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5cclxuaW1wb3J0IHtGZWF0dXJlUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5pbXBvcnQge3VzZVBhcnNlQXV0aH0gZnJvbSAnLi9zZXJ2aWNlcy9wYXJzZS91c2VQYXJzZUF1dGgnXHJcbmNvbnN0IExvZ2luID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9Mb2dpbicpKTtcclxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkJykpO1xyXG5jb25zdCBGb3Jnb3RQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3VpLWNvbXBvbmVudHMvRm9yZ290UGFzc3dvcmQnKSk7XHJcbmNvbnN0IFNpZ251cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3VpLWNvbXBvbmVudHMvU2lnbnVwJykpO1xyXG5jb25zdCBQcm9maWxlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9Qcm9maWxlJykpO1xyXG5jb25zdCBBdXRoRmVlZGJhY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL0F1dGhGZWVkYmFjaycpKTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGFyc2VBdXRoZW50aWNhdGlvbih7IGNoaWxkcmVuIH0pIHtcclxuICBjb25zdCB7c2lnbnVwLGxvZ2luLGNoYW5nZVBhc3N3b3JkLGZvcmdvdFBhc3N3b3JkfT11c2VQYXJzZUF1dGgoKVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9jaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPENoYW5nZVBhc3N3b3JkIGNoYW5nZVBhc3N3b3JkPXtjaGFuZ2VQYXNzd29yZH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvbG9naW4nPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxMb2dpbiBsb2dpbj17bG9naW59Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3NpZ251cCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFNpZ251cCBzaWdudXA9e3NpZ251cH0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvZm9yZ290cGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAgZm9yZ290UGFzc3dvcmQ9e2ZvcmdvdFBhc3N3b3JkfS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9wcm9maWxlJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8UHJvZmlsZSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9hdXRoZmVlZGJhY2snPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxBdXRoRmVlZGJhY2sgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4uLy4uL3N0YXRlL2FjdGlvblR5cGVzJztcclxuLy9pbXBvcnQgeyBzZXJ2ZXJWYWxpZGF0aW9uIH0gZnJvbSAnLi4vLi4vZm9ybS9hY3Rpb25zJztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlQ2hhbmdlZCh7IHByb3BOYW1lLCB2YWx1ZSB9KSB7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBwcm9wTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL2xvZ2luYCwge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJyonLFxyXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCYXNpYyAke2J0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApfWAsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiBcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsIHVzZXI6e3Rva2VuLHVzZXJuYW1lLGVtYWlsfSB9KTtcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUR9KVxyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAvLyBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgLy8gICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAvLyAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAvLyAgIH0pXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICBcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2dpbiBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBmb3JtRGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3NpZ251cGAsIHtcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHVzZXI6e3Rva2VuLHVzZXJuYW1lLGVtYWlsfSB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIFxyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAvLyBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgLy8gICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAvLyAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAvLyAgIH0pXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUR9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWdudXAgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIH0pO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGNvbmZpcm0sIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHt0b2tlbn09c3RhdGUudXNlclxyXG4gICAgZGVidWdnZXI7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9jaGFuZ2VwYXNzYCwge1xyXG4gICAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgY29uZmlybSxcclxuICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICB0b2tlbixcclxuICAgICAgfSksXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXHJcbiAgICAgICAgdXNlcjp7dG9rZW4sdXNlcm5hbWUsZW1haWx9LFxyXG4gICAgICAgIG1lc3NhZ2U6IGBQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS5gLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIC8vIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAvLyAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgIC8vICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgIC8vICAgfSlcclxuICAgICAgICAvLyApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3JlcXVlc3RwYXNzY2hhbmdlYCwge1xyXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcclxuICAgIH0pO1xyXG4gICAgZGVidWdnZXI7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MsXHJcbiAgICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgICBtZXNzYWdlOiBgQSBsaW5rIGZvciBwYXNzd29yZCBjaGFuZ2UgIGhhcyBiZWVuIHNlbnQgdG8sICR7ZW1haWx9ISBgLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgLy8gZm9ybURpc3BhdGNoKFxyXG4gICAgICAgIC8vICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgLy8gICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgLy8gICB9KVxyXG4gICAgICAgIC8vICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXHJcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3IgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vc3RhdGUvYXV0aC1jb250ZXh0J1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlTm9kZUF1dGgoKSB7XHJcbiAgICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKVxyXG4gICAgY29uc3QgeyBkaXNwYXRjaDogZm9ybURpc3BhdGNoIH0gPSB1c2VGb3JtQ29udGV4dCgpXHJcbiAgICBmdW5jdGlvbiBsb2dpbigpIHtcclxuICAgICAgICBhY3Rpb25zLmxvZ2luKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaWdudXAoKSB7XHJcbiAgICAgICAgYWN0aW9ucy5zaWdudXAoeyBkaXNwYXRjaCwgZm9ybURpc3BhdGNoLCBzdGF0ZSB9KVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoKSB7XHJcbiAgICAgICAgYWN0aW9ucy5mb3Jnb3RQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQoKSB7XHJcbiAgICAgICAgYWN0aW9ucy5jaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pXHJcbiAgICB9XHJcblxyXG4gICBcclxuICBcclxuXHJcbiAgICByZXR1cm4geyBzaWdudXAsIGxvZ2luLCBmb3Jnb3RQYXNzd29yZCwgY2hhbmdlUGFzc3dvcmQgfVxyXG5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5cclxuaW1wb3J0IHtGZWF0dXJlUm91dGV9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5pbXBvcnQge3VzZU5vZGVBdXRofSBmcm9tICcuL3NlcnZpY2VzL25vZGUtanMtYXV0aC91c2VOb2RlQXV0aCdcclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL0xvZ2luJykpO1xyXG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3VpLWNvbXBvbmVudHMvQ2hhbmdlUGFzc3dvcmQnKSk7XHJcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9TaWdudXAnKSk7XHJcbmNvbnN0IFByb2ZpbGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL1Byb2ZpbGUnKSk7XHJcbmNvbnN0IEF1dGhGZWVkYmFjayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3VpLWNvbXBvbmVudHMvQXV0aEZlZWRiYWNrJykpO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOb2RlQXV0aGVudGljYXRpb24oeyBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3Qge3NpZ251cCxsb2dpbixjaGFuZ2VQYXNzd29yZCxmb3Jnb3RQYXNzd29yZH09dXNlTm9kZUF1dGgoKVxyXG5cclxuXHJcbiAgIFxyXG5cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgY2hhbmdlUGFzc3dvcmQ9e2NoYW5nZVBhc3N3b3JkfSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9sb2dpbic+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPExvZ2luIGxvZ2luPXtsb2dpbn0vPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvc2lnbnVwJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8U2lnbnVwIHNpZ251cD17c2lnbnVwfS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9mb3Jnb3RwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkICBmb3Jnb3RQYXNzd29yZD17Zm9yZ290UGFzc3dvcmR9Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3Byb2ZpbGUnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQcm9maWxlIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEF1dGhGZWVkYmFjayAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgQXBwUm91dGUgfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSc7XHJcbmltcG9ydCB7IEhvbWUgfSBmcm9tICcuL0hvbWUnO1xyXG5pbXBvcnQgUGFyc2VBdXRoZW50aWNhdGlvbiBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9QYXJzZUF1dGhlbnRpY2F0aW9uJztcclxuaW1wb3J0IE5vZGVBdXRoZW50aWNhdGlvbiBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9Ob2RlQXV0aGVudGljYXRpb24nO1xyXG5cclxuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnZmVhdHVyZXMvaGFuZ291dHMvdWktY29tcG9uZW50cy9IYW5nb3V0JykpO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZXMoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMTAwJScsYmFja2dyb3VuZENvbG9yOid5ZWxsb3cnIH19PlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9hdXRoXCI+XHJcblxyXG4gICAgICAgICAge1BSRUFDVF9BUFBfQkFDSyA9PT0nUFJFQUNUX0FQUF9QQVJTRScgJiYgPFBhcnNlQXV0aGVudGljYXRpb24vPn1cclxuICAgICAgICAgIHtQUkVBQ1RfQVBQX0JBQ0sgPT09J1BSRUFDVF9BUFBfTk9ERUpTJyAmJiA8Tm9kZUF1dGhlbnRpY2F0aW9uLz59XHJcbiAgIFxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9cIj5cclxuICAgICAgICA8SG9tZSAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SGFuZ291dHMgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gIFxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHt1c2VFZmZlY3QsdXNlU3RhdGV9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgTmF2SXRlbSB9IGZyb20gJ2NvbnRyb2xzL25hdmlnYXRpb24vTmF2SXRlbSc7XHJcbmltcG9ydCB7IEF1dGhEcmF3ZXJDb250ZW50IH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9BdXRoRHJhd2VyQ29udGVudCc7XHJcbmltcG9ydCAgSGFuZ291dERyYXdlckNvbnRlbnQgIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvbmF2L0hhbmdvdXREcmF3ZXJDb250ZW50JztcclxuaW1wb3J0IHsgSGFuZ291dFRvcE1lbnUgfSBmcm9tICdmZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL25hdi9IYW5nb3V0VG9wTWVudSc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgcmVjb3ZlckxvY2FsQXV0aFN0YXRlIH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYWN0aW9ucyc7XHJcbmltcG9ydCBEcmF3ZXIgZnJvbSAnY29udHJvbHMvbmF2aWdhdGlvbi9EcmF3ZXInO1xyXG5pbXBvcnQgeyBBcHBCYXIgfSBmcm9tICdjb250cm9scy9uYXZpZ2F0aW9uL0FwcEJhcic7XHJcbmltcG9ydCB7IE1lbnUgfSBmcm9tICdjb250cm9scy9uYXZpZ2F0aW9uL01lbnUnO1xyXG5pbXBvcnQge0FwcFJvdXRlc30gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcblxyXG5cclxuZXhwb3J0ICBmdW5jdGlvbiBBcHBOYXZpZ2F0aW9uKCkge1xyXG4gIGNvbnN0IFtkcmF3ZXJJc09wZW4sc2V0RHJhd2VyU3RhdGVdPXVzZVN0YXRlKGZhbHNlKVxyXG5cclxuICBcclxuICBjb25zdCB7IGRpc3BhdGNoIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG5cclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG4gICAgICAgXHJcbiAgICAgY29uc3QgdXNlciA9SlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpXHJcbiAgICAgICAgcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgdXNlclxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCBbXSk7XHJcbiAgZnVuY3Rpb24gdG9nZ2xlRHJhd2VyKCl7XHJcblxyXG4gICAgICBzZXREcmF3ZXJTdGF0ZShwcmV2PT4hcHJldilcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4Jyx3aWR0aDonMTAwJScsaGVpZ2h0OicxMDAlJ319PlxyXG4gICAgICAgIHtkcmF3ZXJJc09wZW4gJiYgIDxEcmF3ZXIgIHN0eWxlPXt7cG9zaXRpb246J2Fic29sdXRlJ319IHRvZ2dsZURyYXdlcj17dG9nZ2xlRHJhd2VyfT5cclxuXHJcbiAgICAgICAgICAgICAgPEF1dGhEcmF3ZXJDb250ZW50ICB0b2dnbGVEcmF3ZXI9e3RvZ2dsZURyYXdlcn0gLz5cclxuICAgICAgICAgICAgICA8SGFuZ291dERyYXdlckNvbnRlbnQgIHRvZ2dsZURyYXdlcj17dG9nZ2xlRHJhd2VyfSAvPlxyXG4gICAgICAgICAgPC9EcmF3ZXI+IH1cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjF9fSA+XHJcbiAgICAgICAgICA8QXBwQmFyID5cclxuICAgICAgICAgICAgICA8TWVudSBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9IC8+XHJcbiAgICAgICAgICAgICAgPE5hdkl0ZW0gc3R5bGU9e3sgZmxleDogNSB9fT5XRUIgQ09NPC9OYXZJdGVtPlxyXG4gICAgICAgICAgICAgPEhhbmdvdXRUb3BNZW51IC8+XHJcbiAgICAgICAgICA8L0FwcEJhcj5cclxuICAgICAgICAgXHJcbiAgICAgICAgICA8QXBwUm91dGVzLz5cclxuICAgICAgXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgKVxyXG59IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7QXBwTmF2aWdhdGlvbn0gZnJvbSAnLi9BcHBOYXZpZ2F0aW9uJ1xyXG5pbXBvcnQge0FwcFJvdXRlc30gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcbmltcG9ydCAnLi9jc3MvYXBwLmNzcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzk1dmgnIH19PlxyXG4gICAgIDxBcHBOYXZpZ2F0aW9uLz5cclxuXHJcbiAgICAgIHsnJ31cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlcnMgfSBmcm9tICcuL0FwcFByb3ZpZGVycyc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxuUGFyc2UuaW5pdGlhbGl6ZShcInp0dHBucVRyOHJlZmt0QldOZWtaaFp4U3h3UGFBQW5FbFE5azdDdUFcIixcIlE3U0hTRkxHNjE4aXpieVNNcEFzRkFxZ25PTGFZZ3hObHdmRmhPQXJcIik7IC8vUEFTVEUgSEVSRSBZT1VSIEJhY2s0QXBwIEFQUExJQ0FUSU9OIElEIEFORCBZT1VSIEphdmFTY3JpcHQgS0VZXHJcblBhcnNlLnNlcnZlclVSTCA9IGBodHRwczovLyR7aXB9OjEzMzcvcGFyc2VgXHJcbi8vUGFyc2UubGl2ZVF1ZXJ5U2VydmVyVVJMID0gYGh0dHBzOi8vJHtpcH06MTMzNy9wYXJzZWBcclxuLy9QYXJzZS5zZXJ2ZXJVUkwgPSAnaHR0cHM6Ly9wYXJzZWFwaS5iYWNrNGFwcC5jb20vJ1xyXG4vL1BhcnNlLmxpdmVRdWVyeVNlcnZlclVSTCA9IGB3c3M6Ly93ZWJhcGlzLmJhY2s0YXBwLmlvYFxyXG5yZW5kZXIoXHJcbiAgPEFwcFByb3ZpZGVycz5cclxuICAgIDxBcHAgLz5cclxuICA8L0FwcFByb3ZpZGVycz4sXHJcblxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbImZldGNoIiwidCIsInIiLCJ1IiwiaSIsIm8iLCJmIiwiYyIsImUiLCJhIiwidiIsIm0iLCJ4IiwicCIsInMiLCJUIiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwiRkVBVFVSRV9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwUm91dGVDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUFwcFJvdXRlQ29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJGZWF0dXJlUm91dGUiLCJwcm9wcyIsImNoaWxkcmVuIiwicGF0aCIsInBhdGhzIiwiZGlzcGF0Y2giLCJmaW5kIiwidXNlQXBwUm91dGUiLCJvbkFwcFJvdXRlIiwiQXBwUm91dGUiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInZhbHVlIiwidXNlTWVtbyIsIlNFTkRJTkdfSEFOR09VVF9TVEFSVEVEIiwiU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQiLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTRUFSQ0hfSU5QVVRfQ0hBTkdFIiwiU0VMRUNURURfSEFOR09VVCIsIkNMRUFSRURfSEFOR09VVCIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRVJST1JfUkVDSUVWRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIlNFUlZFUl9NRVNTQUdFX1JFQ0lFVkVEIiwiTUVTU0FHRVNfVVBEQVRFRCIsIkhBTkdPVVRTX1VQREFURUQiLCJIQU5HT1VUX1VQREFURUQiLCJVTlJFQURfSEFOR09VVFNfVVBEQVRFRCIsIkNPTk5FQ1RJTkciLCJPUEVOIiwiQ0xPU0lORyIsIkNMT1NFRCIsIlNPQ0tFVF9SRUFEWSIsIlNPQ0tFVF9FUlJPUiIsImhhbmdvdXRzIiwiaGFuZ291dCIsInVucmVhZGhhbmdvdXRzIiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJzb2NrZXQiLCJyZWFkeVN0YXRlIiwic29ja2V0TWVzc2FnZSIsImZldGNoSGFuZ291dHMiLCJwZW5kaW5nSGFuZ291dCIsIm1lc3NhZ2UiLCJ0ZXh0IiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJGSUxURVJfSEFOR09VVFMiLCJmaWx0ZXIiLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiaGFuZ291dFN0YXRlcyIsIklOVklURVIiLCJBQ0NFUFRFUiIsIkRFQ0xJTkVSIiwiQkxPQ0tFUiIsIlVOQkxPQ0tFUiIsIk1FU1NBTkdFUiIsIklOVklURUQiLCJBQ0NFUFRFRCIsIkRFQ0xJTkVEIiwiQkxPQ0tFRCIsIlVOQkxPQ0tFRCIsIk1FU1NBR0VEIiwidXBkYXRlRGVsaXZlcmVkSGFuZ291dCIsIm5hbWUiLCJvZmZsaW5lIiwidGltZXN0YW1wIiwiZGVsaXZlcmVkSGFuZ291dCIsImRlbGl2ZXJlZCIsImhhbmdvdXRLZXkiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiaGFuZ291dEluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UiLCJ1cGRhdGVCb2NrZWRTdGF0ZSIsIm9mZmxpbmVIYW5nb3V0S2V5Iiwib2ZmbGluZWhhbmdvdXRzIiwiZGVsaXZlcmVkTWVzc2FnZSIsIm1lc3NhZ2VLZXkiLCJibG9ja2VkTWVzc2FnZSIsInNhdmVNZXNzYWdlZCIsInNhdmVJbnZpdGVkIiwic2F2ZUFjY2VwdGVkIiwic2F2ZURlY2xpbmVkIiwic2F2ZUJsb2NrZWQiLCJzYXZlVW5ibG92a2VkIiwic2F2ZVJlY2lldmVkSGFuZ291dCIsImZvY3VzZWRIYW5nb3V0IiwidW5yZWFkIiwiaGFuZ291dEV4aXN0IiwiaGciLCJyZWFkIiwidXBkYXRlZEhhbmdvdXRzIiwic2F2ZVJlY2lldmVkTWVzc2FnZSIsInNhdmVVbnJlYWRIYW5nb3V0IiwidXBkYXRlZE1lc3NhZ2VzIiwidW5yZWFkaGFuZ291dHNLZXkiLCJ1cGRhdGVkdW5yZWFkcyIsInNhdmVJbnZpdGVyIiwic2F2ZUFjY2VwdGVyIiwic2F2ZUJsb2NrZXIiLCJzYXZlRGVjbGluZXIiLCJzYXZlTWVzc2FuZ2VyIiwic2F2ZVVuYmxvY2tlciIsInVzZU1lc3NhZ2UiLCJoYW5kbGVBY2tub3dsZWRnZW1lbnQiLCJoYW5kbGVIYW5nb3V0IiwiaGFuZGxlSGFuZ291dHMiLCJmb3JFYWNoIiwidXNlRWZmZWN0IiwibG9hZEhhbmdvdXRzIiwic2VsZWN0VW5yZWFkIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJJTlBVVF9WQUxVRV9DSEFOR0VEIiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJTRVJWRVJfRVJST1JfUkVDSUVWRUQiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImNvbmZpcm0iLCJjdXJyZW50IiwiZW1haWxvcnVzZXJuYW1lIiwidG9rZW4iLCJpc0xvZ2dlZEluIiwiaXNQYXNzd29yZENoYW5nZWQiLCJhdXRoRmVlZGJhY2siLCJhdXRoUmVkdWNlciIsIm5leHRTdGF0ZSIsInBheWxvYWQiLCJwcm9wTmFtZSIsInN1Y2Nlc3NNZXNzYWdlIiwiQXV0aFJvdXRlQ29udGV4dCIsIkF1dGhSb3V0ZVByb3ZpZGVyIiwiaW5pdGlhbFJvdXRlIiwiYXV0aFJvdXRlIiwic2V0QXV0aFJvdXRlIiwidXNlU3RhdGUiLCJBdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwidXNlVXNlck5hbWUiLCJ1c2VyTmFtZSIsInNldFVzZXJuYW1lIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsIm9iamVjdElkIiwic2V0T2JqZWN0SWQiLCJ3aW5kb3ciLCJ1cGRhdGVSZWFkSGFuZ291dHMiLCJsZW5ndGgiLCJ1cGRhdGVkdW5yZWFkIiwibWFwIiwidXBkYXRlUmVhZE1lc3NzYWdlcyIsIkhhbmdvdXRDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJIYW5nb3V0c1Byb3ZpZGVyIiwiaGFuZGxlTWVzc2FnZSIsInVwZGF0ZWQiLCJzYXZlUGVuZGluZ0hhbmdvdXQiLCJpc0Jsb2NrZXIiLCJzYXZlSGFuZ291dCIsInNhdmVNZXNzYWdlIiwiYmxvY2tlciIsIkRhdGUiLCJub3ciLCJmbG9hdCIsInNlbmRPZmZsaW5lSGFuZ291dHMiLCJvZmZsaW5lSGFuZ291dHMiLCJmb3JlRWFjaCIsImgiLCJzZW5kIiwiY29tbWFuZCIsInJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkIiwiZmlsdGVyZWRIYW5nb3V0cyIsInJlbW92ZUl0ZW0iLCJ1c2VIYW5nb3V0cyIsImF1dGhDb250ZXh0IiwidXNlcnMiLCJvblJlbW92ZVVucmVhZCIsImlkIiwiY3VycmVudFRhcmdldCIsIm9uTmF2aWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsIm9uU2VsZWN0SGFuZ291dCIsInRhcmdldCIsIm9uU2VsZWN0VW5yZWFkIiwib25TZWFyY2hJbnB1dCIsIm9uRmV0Y2hIYW5nb3V0cyIsIm9uTWVzc2FnZVRleHQiLCJvbkhhbmdvdXQiLCJTRUFSQ0hfSU5QVVRfQ0hBTkdFRCIsIk1FU1NBR0VfUkVDSUVWRUQiLCJyZXNwb25zZSIsIm9rIiwianNvbiIsIldlYlNvY2tldENvbnRhaW5lciIsInNldFNvY2tldCIsInNvY2tldFVybCIsInNvY2siLCJXZWJTb2NrZXQiLCJvbm1lc3NhZ2UiLCJzZXJ2ZXJNZXNzYWdlIiwibXNnIiwiZGF0YSIsIm9ub3BlbiIsIm9uY2xvc2UiLCJvbmVycm9yIiwiYWN0aW9ucyIsInNlbmRIYW5nb3V0IiwiSGFuZ291dEFkYXB0ZXIiLCJUaGVtZUNvbnRleHQiLCJ1c2VUaGVtZUNvbnRleHQiLCJUaGVtZVByb3ZpZGVyIiwic2V0U3RhdGUiLCJOYXZDb250ZXh0IiwiTmF2aWdhdGlvblByb3ZpZGVyIiwiZHJhd2VyT3BlbiIsInNldERyYXdlck9wZW4iLCJBcHBQcm92aWRlcnMiLCJwcmltYXJ5IiwiYmFja2dyb3VuZCIsImNvbG9yIiwiZm9udEZhbWlseSIsImlwIiwiTmF2SXRlbSIsIkxpc3QiLCJMaXN0SXRlbSIsInZhbHVlQ2hhbmdlZCIsImxvZ291dCIsImdldFRva2VuRnJvbVVybCIsInJlY292ZXJMb2NhbEF1dGhTdGF0ZSIsInVzZU1lZGlhUXVlcnkiLCJ3aWR0aCIsInNldFdpZHRoIiwiaGVpZ2h0Iiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdHlsZSIsImdyaWQiLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImp1c3RpZnlJdGVtcyIsInBhZGRpbmciLCJBdXRoRHJhd2VyQ29udGVudCIsInRvZ2dsZURyYXdlciIsImhhbmRsZVJvdXRlIiwicHJldmVudERlZmF1bHQiLCJwYWRkaW5nVG9wIiwiQXV0aGVkU3RhdGUiLCJoYW5kbGVMb2dPdXQiLCJhbGlnbkl0ZW1zIiwiZmxleERpcmVjdGlvbiIsInVzZXJJY29uIiwicGFkZGluZ1JpZ2h0IiwibWFyZ2luQm90dG9tIiwiVW5BdXRoZWRTdGF0ZSIsIkhhbmdvdXREcmF3ZXJDb250ZW50IiwiY291bnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJqdXN0aWZ5Q29udGVudCIsIk1lc3NhZ2UiLCJTZXR0aW5ncyIsImZpbGwiLCJvbkNsaWNrIiwiYm9yZGVyIiwiT25saW5lU3RhdHVzIiwiSXNPbmxpbmUiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsIkhhbmdvdXRUb3BNZW51IiwibmF2VG9VbnJlYWQiLCJkcmF3ZXIiLCJib3hTaGFkb3ciLCJwb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJ6SW5kZXgiLCJEcmF3ZXIiLCJwaW5uZWQiLCJzZXRQaW5uZWQiLCJvcGVuIiwiQXBwQmFyIiwidGhlbWUiLCJtaW5IZWlnaHQiLCJNZW51V2hpdGUiLCJNZW51IiwiRSIsInciLCJDIiwibCIsIkEiLCJGIiwiTiIsIk0iLCJQIiwiRCIsIkgiLCIkIiwicSIsIkhvbWUiLCJMb2dpbiIsImxhenkiLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwiUHJvZmlsZSIsIkF1dGhGZWVkYmFjayIsImxvZ2luIiwiZm9ybURpc3BhdGNoIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwibWV0aG9kIiwicmVzdWx0Iiwic3RhdHVzIiwiZXJyb3JzIiwic2lnbnVwIiwiYm9keSIsIkNvbnRlbnRUeXBlIiwiQWNjZXB0IiwiY2hhbmdlUGFzc3dvcmQiLCJmb3Jnb3RQYXNzd29yZCIsInVzZU5vZGVBdXRoIiwidXNlRm9ybUNvbnRleHQiLCJOb2RlQXV0aGVudGljYXRpb24iLCJTdXNwZW5zZSIsIkhhbmdvdXRzIiwiQXBwUm91dGVzIiwiUFJFQUNUX0FQUF9CQUNLIiwiQXBwTmF2aWdhdGlvbiIsImRyYXdlcklzT3BlbiIsInNldERyYXdlclN0YXRlIiwicHJldiIsImZsZXgiLCJBcHAiLCJQYXJzZSIsImluaXRpYWxpemUiLCJzZXJ2ZXJVUkwiLCJyZW5kZXIiLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxPQUFPLEdBQUc7QUFDZCxFQUFFLFlBQVksRUFBRSxpQkFBaUIsSUFBSSxJQUFJO0FBQ3pDLEVBQUUsUUFBUSxFQUFFLFFBQVEsSUFBSSxJQUFJLElBQUksVUFBVSxJQUFJLE1BQU07QUFDcEQsRUFBRSxJQUFJO0FBQ04sSUFBSSxZQUFZLElBQUksSUFBSTtBQUN4QixJQUFJLE1BQU0sSUFBSSxJQUFJO0FBQ2xCLElBQUksQ0FBQyxXQUFXO0FBQ2hCLE1BQU0sSUFBSTtBQUNW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QVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQTRLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUF1RCxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTUvUixJQUFJQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUCxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0osR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBd08sU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0wsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFrRCxTQUFTYyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNiLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDTyxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQXlOLFNBQVMsQ0FBQyxFQUFFLENBQUNFLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNiLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNQLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDSixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYyxHQUFDLENBQUMsQ0FBQ2QsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZSxHQUFDLENBQUMsQ0FBQ2YsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUdGLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUVELEdBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDYSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUVDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1YsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDQyxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENB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QUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlDLEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0QsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUVBLEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNFLENBQUMsQ0FBQyxDQUFvVCxJQUFJQyxHQUFDLENBQUMzVyxDQUFDLENBQUMsR0FBRyxDQUErS0EsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMyVyxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFJLElBQWlSQyxHQUFDLENBQUM1VyxDQUFDLENBQUMsSUFBSSxTQUFTNlcsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDTixHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDTSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8xVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQ0osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzRXLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUlGLENBQUMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNJLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQ0QsR0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUN6VyxDQUFDLENBQUNzVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUlLLEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUwsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMzSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMySSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFvZSxJQUFJQyxHQUFDLENBQUMsa09BQWtPLENBQUNOLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLElBQUlPLEdBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBNk0sSUFBSSxDQUFDLENBQUNqWCxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJa1gsR0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDblgsQ0FBQyxDQUFDLEtBQUssQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNpWCxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHQyxHQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsQ0FBQyxHQUFHOUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzRJLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FB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
