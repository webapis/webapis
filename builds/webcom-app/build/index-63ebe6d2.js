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
    case httpStatus.credentialInvalid:
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

    case httpStatus.emailIsNotRegistered:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'emailorusername',
        isValid: false,
        message: validationMessages.EMAIL_NOT_REGISTERED
      });
      break;

    case 202:
    case httpStatus.usernameIsTaken:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'username',
        isValid: false,
        message: validationMessages.USERNAME_TAKEN
      });
      break;

    case 200:
    case httpStatus.emailorusernameNotValid:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'emailorusername',
        isValid: false,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL
      });
      break;

    case httpStatus.usernameIsNotRegistered:
      dispatch({
        type: actionTypes$2.CONSTRAINT_VALIDATION,
        name: 'emailorusername',
        isValid: false,
        message: validationMessages.USERNAME_NOT_REGISTERED
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

async function signup({
  dispatch,
  state
}) {
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
        serverValidation({
          status: error,
          dispatch
        });
      });
      dispatch({
        type: actionTypes$2.SIGNUP_FAILED
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error
      });
      dispatch({
        type: actionTypes$2.SIGNUP_FAILED
      });
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes$2.SERVER_ERROR_RECIEVED,
      error
    });
    dispatch({
      type: actionTypes$2.SIGNUP_FAILED
    });
  }
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
      debugger;
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
      debugger;
      const {
        errors
      } = result;
      errors.forEach(error => {
        debugger;
        serverValidation({
          status: error,
          dispatch
        });
      });
      dispatch({
        type: actionTypes$2.LOGIN_FAILED
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error
      });
      dispatch({
        type: actionTypes$2.LOGIN_FAILED
      });
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes$2.SERVER_ERROR_RECIEVED,
      error
    });
    dispatch({
      type: actionTypes$2.LOGIN_FAILED
    });
  }
}
async function changePassword({
  dispatch,
  state
}) {
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
      debugger;
      errors.forEach(error => {
        serverValidation({
          status: error,
          dispatch
        });
      });
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_FAILED
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error
      });
      dispatch({
        type: actionTypes$2.CHANGE_PASSWORD_FAILED
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$2.SERVER_ERROR_RECIEVED,
      error
    });
    dispatch({
      type: actionTypes$2.CHANGE_PASSWORD_FAILED
    });
  }
}
async function forgotPassword({
  dispatch,
  state
}) {
  debugger;

  try {
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
        token: result.token
      });
    } else if (response.status === 400) {
      const result = await response.json();
      debugger;
      const {
        errors
      } = result;
      errors.forEach(error => {
        serverValidation({
          status: error,
          dispatch
        });
      });
      dispatch({
        type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED
      });
    } else if (response.status === 500) {
      const {
        error
      } = result;
      dispatch({
        type: actionTypes$2.SERVER_ERROR_RECIEVED,
        error
      });
      dispatch({
        type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED
      });
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes$2.SERVER_ERROR_RECIEVED,
      error
    });
    dispatch({
      type: actionTypes$2.REQUEST_PASS_CHANGE_FAILED
    });
  }
}

function NodeAuthService({
  children,
  state,
  dispatch
}) {
  const {
    login: login$1,
    signup: signup$1,
    changePassword: changePassword$1,
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
      signup({
        dispatch,
        state
      });
    }
  }, [signup$1]);
  p$1(() => {
    if (changePassword$1) {
      changePassword({
        dispatch,
        state
      });
    }
  }, [changePassword$1]);
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
    return h(NodeAuthService, props);
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
    debugger;

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

const Login = L(() => import('./Login-45cf1856.js'));
const ChangePassword = L(() => import('./ChangePassword-59556c98.js'));
const ForgotPassword = L(() => import('./ForgotPassword-4942078e.js'));
const Signup = L(() => import('./Signup-d8a7dcb8.js'));
const Profile = L(() => import('./Profile-dd162e10.js'));
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

const Hangouts = L(() => import('./Hangout-de68ae74.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtNjNlYmU2ZDIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9hcHAtcm91dGUvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2FwcC1yb3V0ZS9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvdXBkYXRlRGVsaXZlcmVkSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3NhdmVSZWNpZXZlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS91c2VNZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdmFsaWRhdGlvbi9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3ZhbGlkYXRpb25NZXNzYWdlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi92YWxpZGF0aW9uL3NlcnZlckVycm9yQWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zZXJ2aWNlcy9ub2RlanMvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zZXJ2aWNlcy9ub2RlanMvTm9kZUF1dGhTZXJ2aWNlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL0F1dGhBZGFwdGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL0F1dGhQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3ZhbGlkYXRpb24vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3ZhbGlkYXRpb24vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vc3RhdGUvdXNlQXV0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvY29tcGF0L2Rpc3QvY29tcGF0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9BdXRoRmVhdHVyZVJvdXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2VuZE9mZmxpbmVIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3JlbW92ZUhhbmdvdXRGcm9tVW5yZWFkLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL3VzZUhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3NlcnZpY2VzL3dlYnNvY2tldC9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zZXJ2aWNlcy93ZWJzb2NrZXQvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy9zZXJ2aWNlcy93ZWJzb2NrZXQvV2ViU29ja2V0Q29udGFpbmVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRBZGFwdGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9BcHBQcm92aWRlcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9uYXYtYmFyL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2NvbXBvbmVudHMvbmF2L2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9BcHBOYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9Ib21lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcHMvd2ViY29tLWFwcC9BcHBSb3V0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwcy93ZWJjb20tYXBwL0FwcC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHBzL3dlYmNvbS1hcHAvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHN1cHBvcnQgPSB7XG4gIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiZcbiAgICAnQmxvYicgaW4gc2VsZiAmJlxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxufVxuXG5mdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbn1cblxuaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gIF1cblxuICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPVxuICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgfVxuICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5eX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1c1xuICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG59XG5cbkJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICB1cmw6IHRoaXMudXJsXG4gIH0pXG59XG5cblJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG59XG5cbmV4cG9ydCB2YXIgRE9NRXhjZXB0aW9uID0gc2VsZi5ET01FeGNlcHRpb25cbnRyeSB7XG4gIG5ldyBET01FeGNlcHRpb24oKVxufSBjYXRjaCAoZXJyKSB7XG4gIERPTUV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG5hbWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpXG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrXG4gIH1cbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRE9NRXhjZXB0aW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaChpbnB1dCwgaW5pdCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCAmJiByZXF1ZXN0LnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgZnVuY3Rpb24gYWJvcnRYaHIoKSB7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgIH1cblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgfVxuICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgIH1cblxuICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICB9KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsKSB7XG4gICAgICByZXF1ZXN0LnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgcmVxdWVzdC5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gIH0pXG59XG5cbmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxuXG5pZiAoIXNlbGYuZmV0Y2gpIHtcbiAgc2VsZi5mZXRjaCA9IGZldGNoXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2Vcbn1cbiIsInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiBwKG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiBwKGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHkoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gZyhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGcobil9fWZ1bmN0aW9uIGsobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9YSh7fSxvKSkuX192PWksdD1BKGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmcobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLHMpe3ZhciBhLGgscCx5LGQsbSxnLGs9dSYmdS5fX2t8fGMsXz1rLmxlbmd0aDtpZihmPT1lJiYoZj1udWxsIT1vP29bMF06Xz93KHUsMCk6bnVsbCksYT0wLGwuX19rPXgobC5fX2ssZnVuY3Rpb24odSl7aWYobnVsbCE9dSl7aWYodS5fXz1sLHUuX19iPWwuX19iKzEsbnVsbD09PShwPWtbYV0pfHxwJiZ1LmtleT09cC5rZXkmJnUudHlwZT09PXAudHlwZSlrW2FdPXZvaWQgMDtlbHNlIGZvcihoPTA7aDxfO2grKyl7aWYoKHA9a1toXSkmJnUua2V5PT1wLmtleSYmdS50eXBlPT09cC50eXBlKXtrW2hdPXZvaWQgMDticmVha31wPW51bGx9aWYoeT1BKG4sdSxwPXB8fGUsaSx0LG8scixmLHMpLChoPXUucmVmKSYmcC5yZWYhPWgmJihnfHwoZz1bXSkscC5yZWYmJmcucHVzaChwLnJlZixudWxsLHUpLGcucHVzaChoLHUuX19jfHx5LHUpKSxudWxsIT15KXt2YXIgYztpZihudWxsPT1tJiYobT15KSx2b2lkIDAhPT11Ll9fZCljPXUuX19kLHUuX19kPXZvaWQgMDtlbHNlIGlmKG89PXB8fHkhPWZ8fG51bGw9PXkucGFyZW50Tm9kZSl7bjppZihudWxsPT1mfHxmLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoeSksYz1udWxsO2Vsc2V7Zm9yKGQ9ZixoPTA7KGQ9ZC5uZXh0U2libGluZykmJmg8XztoKz0yKWlmKGQ9PXkpYnJlYWsgbjtuLmluc2VydEJlZm9yZSh5LGYpLGM9Zn1cIm9wdGlvblwiPT1sLnR5cGUmJihuLnZhbHVlPVwiXCIpfWY9dm9pZCAwIT09Yz9jOnkubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlJiYobC5fX2Q9Zil9ZWxzZSBmJiZwLl9fZT09ZiYmZi5wYXJlbnROb2RlIT1uJiYoZj13KHApKX1yZXR1cm4gYSsrLHV9KSxsLl9fZT1tLG51bGwhPW8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwudHlwZSlmb3IoYT1vLmxlbmd0aDthLS07KW51bGwhPW9bYV0mJnYob1thXSk7Zm9yKGE9XzthLS07KW51bGwhPWtbYV0mJkQoa1thXSxrW2FdKTtpZihnKWZvcihhPTA7YTxnLmxlbmd0aDthKyspaihnW2FdLGdbKythXSxnWysrYV0pfWZ1bmN0aW9uIHgobixsLHUpe2lmKG51bGw9PXUmJih1PVtdKSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4pbCYmdS5wdXNoKGwobnVsbCkpO2Vsc2UgaWYoQXJyYXkuaXNBcnJheShuKSlmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl4KG5baV0sbCx1KTtlbHNlIHUucHVzaChsP2woXCJzdHJpbmdcIj09dHlwZW9mIG58fFwibnVtYmVyXCI9PXR5cGVvZiBuP3AobnVsbCxuLG51bGwsbnVsbCxuKTpudWxsIT1uLl9fZXx8bnVsbCE9bi5fX2M/cChuLnR5cGUsbi5wcm9wcyxuLmtleSxudWxsLG4uX192KTpuKTpuKTtyZXR1cm4gdX1mdW5jdGlvbiBQKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxOKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8TihuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIEMobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1zLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gTihuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxDKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fEMobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHosciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHoscikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIHoobCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIEEobCx1LGksdCxvLHIsZixlLGMpe3ZhciBzLHYsaCxwLHksdyxnLGssXyx4LFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KHM9bi5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGs9dS5wcm9wcyxfPShzPVAuY29udGV4dFR5cGUpJiZ0W3MuX19jXSx4PXM/Xz9fLnByb3BzLnZhbHVlOnMuX186dCxpLl9fYz9nPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGsseCk6KHUuX19jPXY9bmV3IG0oayx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1rLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGssdi5fX3MpKSkscD12LnByb3BzLHk9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmshPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhrLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoayx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdiYmIXYuX18pe2Zvcih2LnByb3BzPWssdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godikscz0wO3M8dS5fX2subGVuZ3RoO3MrKyl1Ll9fa1tzXSYmKHUuX19rW3NdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoayx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAseSx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9ayx2LnN0YXRlPXYuX19zLChzPW4uX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwscz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx1Ll9faz1udWxsIT1zJiZzLnR5cGU9PWQmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46QXJyYXkuaXNBcnJheShzKT9zOltzXSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9YShhKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAseSkpLGIobCx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxnJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhzPW4uZGlmZmVkKSYmcyh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBzLGEsdixoLHAseT11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3Iocz0wO3M8by5sZW5ndGg7cysrKWlmKG51bGwhPShhPW9bc10pJiYoKG51bGw9PT1sLnR5cGU/Mz09PWEubm9kZVR5cGU6YS5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1hKSl7bj1hLG9bc109bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSl5IT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHk9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZih5PT09ZSlmb3IoeT17fSxwPTA7cDxuLmF0dHJpYnV0ZXMubGVuZ3RoO3ArKyl5W24uYXR0cmlidXRlc1twXS5uYW1lXT1uLmF0dHJpYnV0ZXNbcF0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1QKG4sZCx5LHQsZiksbC5fX2s9bC5wcm9wcy5jaGlsZHJlbixofHxiKG4sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZiksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PWQudmFsdWUmJmQudmFsdWUhPT1uLnZhbHVlJiYobi52YWx1ZT1udWxsPT1kLnZhbHVlP1wiXCI6ZC52YWx1ZSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT1kLmNoZWNrZWQmJmQuY2hlY2tlZCE9PW4uY2hlY2tlZCYmKG4uY2hlY2tlZD1kLmNoZWNrZWQpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSxBKHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDpjLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKSxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7cmV0dXJuIGw9YShhKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSkscChuLnR5cGUsbCxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxrKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGsodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGsodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksayh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQseSBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQscix1LGk9W10sbz1uLl9fcixmPW4uZGlmZmVkLGM9bi5fX2MsZT1uLnVubW91bnQ7ZnVuY3Rpb24gYSh0KXtuLl9faCYmbi5fX2gocik7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bdF19ZnVuY3Rpb24gdihuKXtyZXR1cm4gbSh4LG4pfWZ1bmN0aW9uIG0obix1LGkpe3ZhciBvPWEodCsrKTtyZXR1cm4gby5fX2N8fChvLl9fYz1yLG8uX189W2k/aSh1KTp4KHZvaWQgMCx1KSxmdW5jdGlvbih0KXt2YXIgcj1uKG8uX19bMF0sdCk7by5fX1swXSE9PXImJihvLl9fWzBdPXIsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIHAobix1KXt2YXIgaT1hKHQrKyk7cShpLl9fSCx1KSYmKGkuX189bixpLl9fSD11LHIuX19ILl9faC5wdXNoKGkpKX1mdW5jdGlvbiBsKG4sdSl7dmFyIGk9YSh0KyspO3EoaS5fX0gsdSkmJihpLl9fPW4saS5fX0g9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiB5KG4pe3JldHVybiBzKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBkKG4sdCxyKXtsKGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIHMobixyKXt2YXIgdT1hKHQrKyk7cmV0dXJuIHEodS5fX0gscik/KHUuX19IPXIsdS5fX2g9bix1Ll9fPW4oKSk6dS5fX31mdW5jdGlvbiBoKG4sdCl7cmV0dXJuIHMoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gVChuKXt2YXIgdT1yLmNvbnRleHRbbi5fX2NdO2lmKCF1KXJldHVybiBuLl9fO3ZhciBpPWEodCsrKTtyZXR1cm4gbnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWV9ZnVuY3Rpb24gdyh0LHIpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHI/cih0KTp0KX1mdW5jdGlvbiBBKG4pe3ZhciB1PWEodCsrKSxpPXYoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3UuX18mJnUuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gRigpe2kuc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goXyksdC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oPVtdfWNhdGNoKHIpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2Uocix0Ll9fdiksITB9fSksaT1bXX1mdW5jdGlvbiBfKG4pe24udCYmbi50KCl9ZnVuY3Rpb24gZyhuKXt2YXIgdD1uLl9fKCk7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmKG4udD10KX1mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHIpe3JldHVybiB0IT09bltyXX0pfWZ1bmN0aW9uIHgobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtvJiZvKG4pLHQ9MCwocj1uLl9fYykuX19IJiYoci5fX0guX19oLmZvckVhY2goXyksci5fX0guX19oLmZvckVhY2goZyksci5fX0guX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgcj10Ll9fYztpZihyKXt2YXIgbz1yLl9fSDtvJiZvLl9faC5sZW5ndGgmJigxIT09aS5wdXNoKHIpJiZ1PT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgodT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHI9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQodSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0sdT1zZXRUaW1lb3V0KHIsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfSkoRikpfX0sbi5fX2M9ZnVuY3Rpb24odCxyKXtyLnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goXyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxnKG4pfSl9Y2F0Y2godSl7ci5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSkscj1bXSxuLl9fZSh1LHQuX192KX19KSxjJiZjKHQscil9LG4udW5tb3VudD1mdW5jdGlvbih0KXtlJiZlKHQpO3ZhciByPXQuX19jO2lmKHIpe3ZhciB1PXIuX19IO2lmKHUpdHJ5e3UuX18uZm9yRWFjaChmdW5jdGlvbihuKXtyZXR1cm4gbi50JiZuLnQoKX0pfWNhdGNoKHQpe24uX19lKHQsci5fX3YpfX19O2V4cG9ydHt2IGFzIHVzZVN0YXRlLG0gYXMgdXNlUmVkdWNlcixwIGFzIHVzZUVmZmVjdCxsIGFzIHVzZUxheW91dEVmZmVjdCx5IGFzIHVzZVJlZixkIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUscyBhcyB1c2VNZW1vLGggYXMgdXNlQ2FsbGJhY2ssVCBhcyB1c2VDb250ZXh0LHcgYXMgdXNlRGVidWdWYWx1ZSxBIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID17XHJcbiAgICBBUFBfUk9VVEVfQ0hBTkdFRDonQVBQX1JPVVRFX0NIQU5HRUQnLFxyXG4gIC8vICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuICBjb25zdCB7bmFtZX09c3RhdGVcclxuICBmdW5jdGlvbiBvbkFwcFJvdXRlKHtyb3V0ZSxmZWF0dXJlUm91dGV9KXtcclxuICAgIGlmKG5hbWUpe1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShuYW1lLEpTT04uc3RyaW5naWZ5KHtyb3V0ZSxmZWF0dXJlUm91dGV9KSlcclxuICAgIH1cclxuICAgXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3Qge2luaXRTdGF0ZX09cHJvcHNcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZVJlZHVjZXIocmVkdWNlcixpbml0U3RhdGUpXHJcblxyXG4gIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgaWYoc3RhdGUgJiYgc3RhdGUubmFtZSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdGF0ZS5uYW1lKSl7XHJcbiBcclxuICAgICAgICBjb25zdCB7ZmVhdHVyZVJvdXRlLHJvdXRlfT0gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RhdGUubmFtZSkpXHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZSxyb3V0ZX0pXHJcbiAgICB9XHJcblxyXG4gIH0sW10pXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPSB7XHJcbiAgICBTRU5ESU5HX0hBTkdPVVRfU1RBUlRFRDonU0VORElOR19IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUQ6J1NFTkRJTkdfSEFOR09VVF9GVUxMRklMTEVEJyxcclxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXHJcblxyXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxyXG4gICAgTE9BREVEX01FU1NBR0VTOiAnTE9BREVEX01FU1NBR0VTJyxcclxuIFxyXG4gICAgU0VBUkNIX0lOUFVUX0NIQU5HRTogJ1NFQVJDSF9JTlBVVF9DSEFOR0UnLFxyXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxyXG4gICAgQ0xFQVJFRF9IQU5HT1VUOidDTEVBUkVEX0hBTkdPVVQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXHJcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcclxuICAgIEVSUk9SX1JFQ0lFVkVEOidFUlJPUl9SRUNJRVZFRCcsXHJcbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcclxuXHJcbiAgICBTRVJWRVJfTUVTU0FHRV9SRUNJRVZFRDonU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQnLFxyXG5cclxuICAgIFxyXG4gICAgTUVTU0FHRVNfVVBEQVRFRDonTUVTU0FHRVNfVVBEQVRFRCcsXHJcbiAgICBIQU5HT1VUU19VUERBVEVEOidIQU5HT1VUU19VUERBVEVEJyxcclxuICAgIEhBTkdPVVRfVVBEQVRFRDonSEFOR09VVF9VUERBVEVEJyxcclxuICAgIFVOUkVBRF9IQU5HT1VUU19VUERBVEVEOidVTlJFQURfSEFOR09VVFNfVVBEQVRFRCcsXHJcbiAgICAvL1NPQ0tFVFxyXG5cclxuICAgIENPTk5FQ1RJTkc6J0NPTk5FQ1RJTkcnLFxyXG4gICAgT1BFTjonT1BFTicsXHJcbiAgICBDTE9TSU5HOidDTE9TSU5HJyxcclxuICAgIENMT1NFRDonQ0xPU0VEJyxcclxuICAgIFNPQ0tFVF9SRUFEWTonU09DS0VUX1JFQURZJyxcclxuICAgIFNPQ0tFVF9FUlJPUjonU09DS0VUX0VSUk9SJ1xyXG5cclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgaGFuZ291dHM6IG51bGwsXHJcbiAgaGFuZ291dDogbnVsbCxcclxuICB1bnJlYWRoYW5nb3V0czogbnVsbCxcclxuICBtZXNzYWdlczogbnVsbCxcclxuICBzZWFyY2g6ICcnLFxyXG4gIHVzZXI6IFtdLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIG1lc3NhZ2VUZXh0OiAnJyxcclxuICBvbmxpbmU6IGZhbHNlLFxyXG4gIHNvY2tldDogbnVsbCxcclxuICByZWFkeVN0YXRlOiAwLFxyXG4gIHNvY2tldE1lc3NhZ2U6IG51bGwsXHJcbiAgZmV0Y2hIYW5nb3V0czogZmFsc2UsXHJcbiAgcGVuZGluZ0hhbmdvdXQ6bnVsbCxcclxuICBtZXNzYWdlOiBudWxsXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkVSUk9SX1JFQ0lFVkVEOlxyXG4gICAgICByZXR1cm57Li4uc3RhdGUsZXJyb3I6YWN0aW9uLmVycm9yfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSxwZW5kaW5nSGFuZ291dDpudWxsfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRU5ESU5HX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgcGVuZGluZ0hhbmdvdXQ6YWN0aW9uLnBlbmRpbmdIYW5nb3V0fVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTEVBUkVEX0hBTkdPVVQ6XHJcbiAgICAgXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBudWxsIH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQ6XHJcblxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdW5yZWFkaGFuZ291dHM6IGFjdGlvbi51bnJlYWRoYW5nb3V0cyB9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRDpcclxuXHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVEOlxyXG4gICAgIFxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfTUVTU0FHRV9SRUNJRVZFRDpcclxuICBcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlVGV4dDogYWN0aW9uLnRleHQgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IsIGZldGNoSGFuZ291dHM6IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIGZldGNoSGFuZ291dHM6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMsIGZldGNoSGFuZ291dHM6IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxyXG4gICAgICAgICAgZy51c2VybmFtZS5pbmNsdWRlcyhzdGF0ZS5zZWFyY2gpXHJcbiAgICAgICAgKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VBUkNIX0lOUFVUX0NIQU5HRTpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXHJcbiAgICAgIH07XHJcbiAgICAvL1NPQ0tFVFxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfRVJST1I6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNPTk5FQ1RJTkc6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAwIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9QRU46XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAxIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMT1NJTkc6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAyIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMT1NFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc29ja2V0OiBhY3Rpb24uc29ja2V0IH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsIlxyXG4gIGV4cG9ydCBjb25zdCBoYW5nb3V0U3RhdGVzID0ge1xyXG4gICAgSU5WSVRFUjogJ0lOVklURVInLFxyXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXHJcbiAgICBERUNMSU5FUjogJ0RFQ0xJTkVSJyxcclxuICAgIEJMT0NLRVI6ICdCTE9DS0VSJyxcclxuICAgIFVOQkxPQ0tFUjogJ1VOQkxPQ0tFUicsXHJcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInLFxyXG4gICAvLyBhY2tub3dsZWdlbWVudFxyXG4gICAgSU5WSVRFRDogJ0lOVklURUQnLFxyXG4gICAgQUNDRVBURUQ6ICdBQ0NFUFRFRCcsXHJcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcclxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcclxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXHJcbiAgICBNRVNTQUdFRDogJ01FU1NBR0VEJyxcclxuICB9OyIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IG5hbWUsIGRpc3BhdGNoLCBoYW5nb3V0LCBvZmZsaW5lLCBvbkFwcFJvdXRlIH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlLCB0aW1lc3RhbXAgfSA9IGhhbmdvdXQ7XHJcblxyXG4gIGNvbnN0IGRlbGl2ZXJlZEhhbmdvdXQgPSB7IC4uLmhhbmdvdXQsIGRlbGl2ZXJlZDogdHJ1ZSB9O1xyXG4gIGNvbnN0IGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRIYW5nb3V0KTtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeShoYW5nb3V0cykpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQsIGhhbmdvdXQ6IGRlbGl2ZXJlZEhhbmdvdXQgfSk7XHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuXHJcbiAgICB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQsaGFuZ291dCB9KTtcclxuICB9XHJcbiAgaWYoaGFuZ291dC5zdGF0ZT09PSdCTE9DS0VEJyl7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHVwZGF0ZUJvY2tlZFN0YXRlKHtkaXNwYXRjaCxuYW1lLGRlbGl2ZXJlZEhhbmdvdXR9KVxyXG4gIH1cclxuICBpZiAob2ZmbGluZSkge1xyXG4gICAgLy9yZW1vdmUgb2ZmbGluZSBoYW5nb3V0XHJcbiAgICBjb25zdCBvZmZsaW5lSGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xyXG4gICAgY29uc3Qgb2ZmbGluZWhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xyXG5cclxuICAgIGlmIChvZmZsaW5laGFuZ291dHMpIHtcclxuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gb2ZmbGluZWhhbmdvdXRzLmZpbmRJbmRleChcclxuICAgICAgICAobykgPT4gby50aW1lc3RhbXAgPT09IHRpbWVzdGFtcFxyXG4gICAgICApO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICBvZmZsaW5lSGFuZ291dEtleSxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeShvZmZsaW5laGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSkpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoaGFuZ291dC5zdGF0ZSAhPT0gJ01FU1NBTkdFUicpIHtcclxuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6IGAvJHtoYW5nb3V0LnN0YXRlfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQgfSkge1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UgfSA9IGRlbGl2ZXJlZEhhbmdvdXQ7XHJcblxyXG4gIGNvbnN0IGRlbGl2ZXJlZE1lc3NhZ2UgPSB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lOiBuYW1lLCBkZWxpdmVyZWQ6IHRydWUgfVxyXG5cclxuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IG1lc3NhZ2VzLmZpbmRJbmRleChcclxuICAgIChtKSA9PiBtLnRpbWVzdGFtcCA9PT0gbWVzc2FnZS50aW1lc3RhbXBcclxuICApO1xyXG4gIG1lc3NhZ2VzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGRlbGl2ZXJlZE1lc3NhZ2UpO1xyXG4gIFxyXG5cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xyXG5cclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQm9ja2VkU3RhdGUoe2Rpc3BhdGNoLGRlbGl2ZXJlZEhhbmdvdXQsbmFtZX0pe1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGRlbGl2ZXJlZEhhbmdvdXQ7XHJcbiAgY29uc3QgYmxvY2tlZE1lc3NhZ2UgPSB7IHRpbWVzdGFtcDpkZWxpdmVyZWRIYW5nb3V0LnRpbWVzdGFtcCwgdGV4dDogJ3lvdSBibG9ja2VkIHRoaXMgdXNlcicsIHVzZXJuYW1lOiBuYW1lLCB0eXBlOiAnYmxvY2tlZCcgfVxyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSggWy4uLm1lc3NhZ2VzLGJsb2NrZWRNZXNzYWdlXSkpO1xyXG5cclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOlsuLi5tZXNzYWdlcyxibG9ja2VkTWVzc2FnZV0gfSk7XHJcbn0iLCJpbXBvcnQgeyB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0IH0gZnJvbSAnLi91cGRhdGVEZWxpdmVyZWRIYW5nb3V0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcclxuXHJcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVJbnZpdGVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY2NlcHRlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURlY2xpbmVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XHJcblxyXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQmxvY2tlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVVuYmxvdmtlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xyXG5cclxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHtoYW5nb3V0U3RhdGVzfSAgZnJvbSAnc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMnXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRIYW5nb3V0KHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWQsXHJcbn0pIHtcclxuXHJcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcclxuXHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuXHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuXHJcbiBcclxuICBpZiAoaGFuZ291dHMpIHtcclxuICAgIGNvbnN0IGhhbmdvdXRFeGlzdCA9IGhhbmdvdXRzLmZpbmQoaGc9PiBoZy51c2VybmFtZT09PXVzZXJuYW1lKVxyXG4gICAgaWYoaGFuZ291dEV4aXN0KXtcclxuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCB7XHJcbiAgICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xyXG4gICAgICAgICAgLi4uaGFuZ291dCxcclxuICAgICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHMgfSk7XHJcbiAgICB9Ly9lbmQgb2YgaGFuZ291dCBleGlzdFxyXG5lbHNle1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xyXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFsuLi5oYW5nb3V0cyxcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFsuLi5oYW5nb3V0cyxcclxuICAgICAge1xyXG4gICAgICAgIC4uLmhhbmdvdXQsXHJcbiAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XHJcbn1cclxuXHJcbn1lbHNle1xyXG5cclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB1cGRhdGVkSGFuZ291dHMgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5oYW5nb3V0LFxyXG4gICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogdXBkYXRlZEhhbmdvdXRzIH0pO1xyXG5cclxufVxyXG5cclxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsXHJcbiAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgfSk7XHJcbiAgICBpZiAoaGFuZ291dC5zdGF0ZSAhPT0gJ01FU1NBTkdFUicpIHtcclxuICAgICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWVzc2FnZSkge1xyXG4gICAgc2F2ZVJlY2lldmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBmb2N1c2VkSGFuZ291dCB9KTtcclxuICB9XHJcblxyXG4gIGlmICh1bnJlYWQpIHtcclxuXHJcbiAgICBzd2l0Y2goaGFuZ291dC5zdGF0ZSl7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFUjpcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XHJcbiAgICAgICAgc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuIFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRNZXNzYWdlKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbn0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXHJcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xyXG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBudWxsO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IHRydWUgfV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XHJcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFt7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xyXG4gICAgfVxyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuXHJcbiAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xyXG4gICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pIHtcclxuICBcclxuICAvL3VwZGF0ZSB1bnJlYWQgaGFuZ291dHNcclxuICBsZXQgdW5yZWFkaGFuZ291dHNLZXkgPSBgJHtuYW1lfS11bnJlYWQtaGFuZ291dHNgO1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuICBsZXQgdXBkYXRlZHVucmVhZHMgPSBudWxsO1xyXG4gIGlmICh1bnJlYWRoYW5nb3V0cykge1xyXG4gICAgdXBkYXRlZHVucmVhZHMgPSBbLi4udW5yZWFkaGFuZ291dHMsIHsuLi5oYW5nb3V0LHJlYWQ6ZmFsc2V9XTtcclxuICB9IGVsc2Uge1xyXG4gICAgdXBkYXRlZHVucmVhZHMgPSBbey4uLmhhbmdvdXQscmVhZDpmYWxzZX1dO1xyXG4gIH1cclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZHVucmVhZHMpKTtcclxuXHJcbiAgZGlzcGF0Y2goe1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICB1bnJlYWRoYW5nb3V0czogdXBkYXRlZHVucmVhZHMsXHJcbiAgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgc2F2ZVJlY2lldmVkSGFuZ291dCB9IGZyb20gJy4vc2F2ZVJlY2lldmVkSGFuZ291dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuXHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWNjZXB0ZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiBcclxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrZXIoe1xyXG4gIGRpc3BhdGNoLFxyXG4gIGhhbmdvdXQsXHJcbiAgbmFtZSxcclxuICBmb2N1c2VkSGFuZ291dCxcclxuICBvbkFwcFJvdXRlLFxyXG4gIHVucmVhZFxyXG59KSB7XHJcbiAgXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lcih7XHJcbiAgZGlzcGF0Y2gsXHJcbiAgaGFuZ291dCxcclxuICBuYW1lLFxyXG4gIGZvY3VzZWRIYW5nb3V0LFxyXG4gIG9uQXBwUm91dGUsXHJcbiAgdW5yZWFkXHJcbn0pIHtcclxuXHJcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FuZ2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkIH0pIHtcclxuXHJcblxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn0gLy8gRU5EIHNhdmVNZXNzYW5nZXJcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlVW5ibG9ja2VyKHtcclxuICBkaXNwYXRjaCxcclxuICBoYW5nb3V0LFxyXG4gIG5hbWUsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgb25BcHBSb3V0ZSxcclxuICB1bnJlYWRcclxufSkge1xyXG4gIFxyXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgeyBoYW5nb3V0U3RhdGVzIH0gZnJvbSAnc2VydmVyL2hhbmdvdXRzL2hhbmdvdXRTdGF0ZXMnO1xyXG5pbXBvcnQge1xyXG4gIHNhdmVJbnZpdGVkLFxyXG4gIHNhdmVVbmJsb3ZrZWQsXHJcbiAgc2F2ZURlY2xpbmVkLFxyXG4gIHNhdmVCbG9ja2VkLFxyXG4gIHNhdmVBY2NlcHRlZCxcclxuICBzYXZlTWVzc2FnZWQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucyc7XHJcbmltcG9ydCB7XHJcbiAgc2F2ZUFjY2VwdGVyLFxyXG4gIHNhdmVCbG9ja2VyLFxyXG4gIHNhdmVEZWNsaW5lcixcclxuICBzYXZlSW52aXRlcixcclxuICBzYXZlTWVzc2FuZ2VyLFxyXG4gIHNhdmVVbmJsb2NrZXIsXHJcbn0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lc3NhZ2Uoe1xyXG4gIG1lc3NhZ2UsXHJcbiAgdXNlcm5hbWUsXHJcbiAgZGlzcGF0Y2gsXHJcbiAgZm9jdXNlZEhhbmdvdXQsXHJcbn0pIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dCxvZmZsaW5lIH0pIHtcclxuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFRDpcclxuICAgICBcclxuICAgICAgICBzYXZlSW52aXRlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VEOlxyXG4gICAgICAgIHNhdmVVbmJsb3ZrZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxyXG4gICAgICAgIHNhdmVEZWNsaW5lZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRDpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlQmxvY2tlZCh7XHJcbiAgICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICAgIGhhbmdvdXQsXHJcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxyXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXHJcbiAgICAgICAgICBvbkFwcFJvdXRlLFxyXG4gICAgICAgICAgb2ZmbGluZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XHJcbiAgICAgICAgc2F2ZUFjY2VwdGVkKHtcclxuICAgICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgICAgaGFuZ291dCxcclxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXHJcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcclxuICAgICAgICAgIG9uQXBwUm91dGUsXHJcbiAgICAgICAgICBvZmZsaW5lXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQ6XHJcbiAgICAgICBcclxuICAgICAgICBzYXZlTWVzc2FnZWQoe1xyXG4gICAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgICBoYW5nb3V0LFxyXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcclxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxyXG4gICAgICAgICAgb25BcHBSb3V0ZSxcclxuICAgICAgICAgIG9mZmxpbmVcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0LCB1bnJlYWQgfSkge1xyXG4gICAgXHJcbiAgICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxyXG4gICAgICAgIHNhdmVBY2NlcHRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VSOlxyXG4gICAgICAgXHJcbiAgICAgICAgc2F2ZUJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSOlxyXG4gICAgICAgIFxyXG4gICAgICAgIHNhdmVEZWNsaW5lcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgICBzYXZlSW52aXRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FOR0VSOlxyXG4gICAgICAgIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUsdW5yZWFkICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFUjpcclxuICAgICAgICBcclxuICAgICAgICBzYXZlVW5ibG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzIH0pIHtcclxuICAgIGhhbmdvdXRzLmZvckVhY2goKGhhbmdvdXQpID0+IHtcclxuICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobWVzc2FnZSAmJiB1c2VybmFtZSkge1xyXG4gXHJcbiAgICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnQUNLSE9XTEVER0VNRU5UJzpcclxuXHJcbiAgICAgICAgICBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsb2ZmbGluZTpmYWxzZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0hBTkdPVVQnOlxyXG5cclxuICAgICAgICAgIGlmKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PW1lc3NhZ2UuaGFuZ291dC51c2VybmFtZSl7XHJcbiAgIFxyXG4gICAgICAgICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LHVucmVhZDpmYWxzZSB9KTtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgXHJcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBtZXNzYWdlLmhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnVU5SRUFEX0hBTkdPVVRTJzpcclxuICAgXHJcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzOiBtZXNzYWdlLmhhbmdvdXRzIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnT0ZGTElORV9BQ0tOJzpcclxuICAgICAgIFxyXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogbWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6dHJ1ZSB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFttZXNzYWdlLCB1c2VybmFtZV0pO1xyXG5cclxuICByZXR1cm4ge307XHJcbn1cclxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcblxyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcclxufVxyXG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0IH0pIHtcclxuXHJcbiBcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldEhhbmdvdXQoe2Rpc3BhdGNofSl7XHJcbiAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ0xFQVJFRF9IQU5HT1VUfSlcclxufSBcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RVbnJlYWQoe2Rpc3BhdGNoLGhhbmdvdXR9KXtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCBoYW5nb3V0IH0pO1xyXG59XHJcblxyXG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcclxuLy8gZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XHJcbi8vICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XHJcbi8vIH1cclxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcclxufVxyXG5cclxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAvaGFuZ291dHMvZmluZD9zZWFyY2g9JHtzZWFyY2h9JnVzZXJuYW1lPSR7dXNlcm5hbWV9YFxyXG4gICAgKTtcclxuICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfQ09NTUFORF9TVEFSVEVEIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKHsgaGFuZ291dCwgZGlzcGF0Y2gsdXNlcm5hbWUgfSkge1xyXG4gIFxyXG4gIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS0ke2hhbmdvdXQudXNlcm5hbWV9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVMsIG1lc3NhZ2VzIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vL0VORCBzYXZlSW52aXRlclxyXG5cclxuXHJcblxyXG5cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG5cclxuICBWQUxVRV9DSEFOR0VEOiAnVkFMVUVfQ0hBTkdFRCcsXHJcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxyXG4gIExPR0lOX1NVQ0NFU1M6ICdMT0dJTl9TVUNDRVNTJyxcclxuICBMT0dJTl9GQUlMRUQ6ICdMT0dJTl9GQUlMRUQnLFxyXG5cclxuICBMT0dPVVQ6ICdMT0dPVVQnLFxyXG5cclxuXHJcbiAgU0lHTlVQX1NUQVJURUQ6ICdTSUdOVVBfU1RBUlRFRCcsXHJcbiAgU0lHTlVQX1NVQ0NFU1M6ICdTSUdOVVBfU1VDQ0VTUycsXHJcbiAgU0lHTlVQX0ZBSUxFRDogJ1NJR05VUF9GQUlMRUQnLFxyXG5cclxuICBDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDogJ0NIQU5HRV9QQVNTV09SRF9TVEFSVEVEJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzogJ0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfRkFJTEVEOiAnQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCcsXHJcblxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCcsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEJyxcclxuXHJcbiAgR09UX1RPS0VOX0ZST01fVVJMOiAnR09UX1RPS0VOX0ZST01fVVJMJyxcclxuXHJcbiAgUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOiAnUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFJyxcclxuICBcclxuICBTRVJWRVJfRVJST1JfUkVDSUVWRUQ6J1NFUlZFUl9FUlJPUl9SRUNJRVZFRCcsXHJcblxyXG4gIENPTlNUUkFJTlRfVkFMSURBVElPTjonQ09OU1RSQUlOVF9WQUxJREFUSU9OJ1xyXG59O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgbG9naW46IGZhbHNlLFxyXG4gIHNpZ251cDogZmFsc2UsXHJcbiAgY2hhbmdlUGFzc3dvcmQ6IGZhbHNlLFxyXG4gIHJlcXVlc3RQYXNzQ2hhbmdlOiBmYWxzZSxcclxuICB2YWxpZGF0aW9uOiB7XHJcbiAgICB1c2VybmFtZTogeyBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnIH0sXHJcbiAgICBlbWFpbDogeyBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnIH0sXHJcbiAgICBwYXNzd29yZDogeyBpc1ZhbGlkOiB1bmRlZmluZWQsIG1lc3NhZ2U6ICcnIH0sXHJcbiAgICBjb25maXJtOiB7XHJcbiAgICAgIGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogJycsXHJcbiAgICAgXHJcbiAgICB9LCBlbWFpbG9ydXNlcm5hbWU6IHsgaXNWYWxpZDogdW5kZWZpbmVkLCBtZXNzYWdlOiAnJyB9XHJcbiAgfSxcclxuICBlbWFpbDogJycsXHJcbiAgcGFzc3dvcmQ6ICcnLFxyXG4gIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIHVzZXJuYW1lOiAnJyxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBjb25maXJtOiAnJyxcclxuICBjdXJyZW50OiAnJyxcclxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxyXG4gIHRva2VuOiBudWxsLFxyXG4gIGF1dGhGZWVkYmFjazogbnVsbCxcclxuICB1c2VyOiBudWxsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXV0aFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVEOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBlcnJvcjphY3Rpb24uZXJyb3J9XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbGlkYXRpb246ey4uLnN0YXRlLnZhbGlkYXRpb24sIFthY3Rpb24ubmFtZV06IHsgaXNWYWxpZDogYWN0aW9uLmlzVmFsaWQsIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlIH0gfX1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRDpcclxuICAgICAgY29uc3QgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIFthY3Rpb24ubmFtZV06IGFjdGlvbi52YWx1ZSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCBsb2dpbjogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdXNlcjogYWN0aW9uLnVzZXIsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gIFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgbG9naW46IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSwgc2lnbnVwOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXI6IGFjdGlvbi51c2VyLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzaWdudXA6ZmFsc2VcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLHNpZ251cDpmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUsIGNoYW5nZVBhc3N3b3JkOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXI6IGFjdGlvbi51c2VyLFxyXG4gICAgICAgIGNoYW5nZVBhc3N3b3JkOmZhbHNlXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSxjaGFuZ2VQYXNzd29yZDpmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlLCByZXF1ZXN0UGFzc0NoYW5nZTogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgcmVxdWVzdFBhc3NDaGFuZ2U6IGZhbHNlLFxyXG4gICAgIFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCAgIHJlcXVlc3RQYXNzQ2hhbmdlOiBmYWxzZSx9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkw6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR09VVDpcclxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB1c2VyOiBhY3Rpb24udXNlclxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgYWNjb3VudEFscmVhZHlFeGl0czoyMDIsXHJcbiAgLy9sb2dpblxyXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcclxuICAvL3NpZ251cFxyXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXHJcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxyXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXHJcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxyXG4gIC8vbG9naW5cclxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXHJcbiAgZW1wdHlQYXNzd29yZE5vdFZhbGlkOiAnNDA5JyxcclxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcclxuICB1c2VybmFtZUlzTm90UmVnaXN0ZXJlZDonNDExJyxcclxuLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXHJcbiAgdG9rZW5FeHBpcmVkOic0MTMnLFxyXG4gIHNlcnZlclZhbGlkYXRpb25SYW5nZTogc3RhdHVzID0+IHtcclxuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSU5WQUxJRF9QQVNTV09SRDpcclxuICAgICdhdCBsZWFzdCA4IGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBhdCBsZWFzdCAxIHVwcGVyY2FzZSBsZXR0ZXIsIDEgbG93ZXJjYXNlIGxldHRlciwgQ2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzJyxcclxuICBJTlZBTElEX0VNQUlMOiAnZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6ICd1c2VybmFtZSBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRTpcclxuICAgICdvbmx5IExldHRlcnMgYS16IG9yIEEtWiBhbmQgdGhlIFN5bWJvbHMgLSBhbmQgXyBhcmUgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9FTVBUWV9TVFJJTkc6ICdSZXF1aXJlZCBmaWVsZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogJ2VtYWlsIG9yIHVzZXJuYW1lIGlzIG5vdCB2YWxpZCcsXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ2ludmFsaWQgY3JlZGVudGlhbHMgcHJvdmlkZWQnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ2VtYWlsIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcsXHJcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnLFxyXG4gIEFDQ09VTlRfQUxSRUFEWV9FWElTVFM6J0FjY291bnQgYWxyZWFkeSBleGlzdHMgZm9yIHRoaXMgdXNlcm5hbWUuJyxcclxuICBSRVFVSVJFRF9GSUVMRDonUmVxdWlyZWQgZmllbGQnXHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuL2h0dHAtc3RhdHVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuLi9zdGF0ZS9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAsIGRpc3BhdGNoIH0pIHtcclxuICBkZWJ1Z2dlclxyXG4gIHN3aXRjaCAoc3RhdHVzKSB7XHJcbiAgICBjYXNlIDEwMTpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5jcmVkZW50aWFsSW52YWxpZDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9DUkVERU5USUFMUyB9KVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2VtYWlsb3J1c2VybmFtZScsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9DUkVERU5USUFMUyB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMTI1OlxyXG4gICAgY2FzZSAtMzpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbEludmFsaWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnZW1haWwnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxyXG4gICAgY2FzZSAtNDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUludmFsaWQ6XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAndXNlcm5hbWUnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDIwMzpcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzUmVnaXN0ZXJlZDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdlbWFpbCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdlbWFpbG9ydXNlcm5hbWUnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLkVNQUlMX05PVF9SRUdJU1RFUkVEIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAyMDI6XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3VzZXJuYW1lJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTiB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMjAwOlxyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOlxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2VtYWlsb3J1c2VybmFtZScsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCB9KVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdlbWFpbG9ydXNlcm5hbWUnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlQYXNzd29yZE5vdFZhbGlkOlxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAncGFzc3dvcmQnLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFUVVJUkVEX0ZJRUxEICB9KVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIGlzVmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCB9KVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ2NvbmZpcm0nLCBpc1ZhbGlkOiBmYWxzZSwgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0ggfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4uLy4uL3N0YXRlL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHNlcnZlclZhbGlkYXRpb24gZnJvbSAnLi4vLi4vdmFsaWRhdGlvbi9zZXJ2ZXJFcnJvckFjdGlvbnMnXHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiBcclxuXHJcbiAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIHVzZXJuYW1lIH0gPSBzdGF0ZTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvc2lnbnVwYCwge1xyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhc3N3b3JkLCBlbWFpbCwgdXNlcm5hbWUgfSksXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICBDb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUywgdXNlcjp7dG9rZW4sdXNlcm5hbWUsZW1haWx9IH0pO1xyXG5cclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgXHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvcixkaXNwYXRjaH0pXHJcbiAgICAgIH0pO1xyXG4gICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEfSlcclxuICAgIH0gZWxzZSBpZihyZXNwb25zZS5zdGF0dXMgPT09IDUwMCl7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQsZXJyb3IgfSk7XHJcbiAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUR9KVxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQsZXJyb3IgfSk7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEfSlcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuIFxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvbG9naW5gLCB7XHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVuLVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnKicsXHJcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJhc2ljICR7YnRvYShgJHtlbWFpbG9ydXNlcm5hbWV9OiR7cGFzc3dvcmR9YCl9YCxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB1c2VyOnt0b2tlbix1c2VybmFtZSxlbWFpbH0gfSk7XHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgXHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvcixkaXNwYXRjaH0pXHJcbiAgICAgIH0pO1xyXG4gICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUR9KVxyXG4gICAgfSBlbHNlIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKXtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9FUlJPUl9SRUNJRVZFRCxlcnJvciB9KTtcclxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUR9KVxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVELGVycm9yIH0pO1xyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEfSlcclxuICB9XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuIFxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGNvbmZpcm0sIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHt0b2tlbn09c3RhdGUudXNlclxyXG4gICAgZGVidWdnZXI7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9jaGFuZ2VwYXNzYCwge1xyXG4gICAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgY29uZmlybSxcclxuICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICB0b2tlbixcclxuICAgICAgfSksXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXHJcbiAgICAgICAgdXNlcjp7dG9rZW4sdXNlcm5hbWUsZW1haWx9LFxyXG4gICAgICAgIFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvcixkaXNwYXRjaH0pXHJcbiAgICAgIH0pO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRFxyXG4gICAgICB9KTtcclxuICAgIH0gIGVsc2UgaWYocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApe1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVELGVycm9yIH0pO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQsZXJyb3IgfSk7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRURcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICB0cnkge1xyXG4gIFxyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9yZXF1ZXN0cGFzc2NoYW5nZWAsIHtcclxuICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXHJcbiAgICB9KTtcclxuICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW5cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIHNlcnZlclZhbGlkYXRpb24oe3N0YXR1czplcnJvcixkaXNwYXRjaH0pXHJcbiAgICAgIH0pO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRURcclxuICAgICAgfSk7XHJcbiAgICB9ZWxzZSBpZihyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9yfSA9IHJlc3VsdDtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfRVJST1JfUkVDSUVWRUQsZXJyb3IgfSk7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX0VSUk9SX1JFQ0lFVkVELGVycm9yIH0pO1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5vZGVBdXRoU2VydmljZSAoe2NoaWxkcmVuLHN0YXRlLGRpc3BhdGNofSl7XHJcbmNvbnN0IHsgbG9naW4sc2lnbnVwLCBjaGFuZ2VQYXNzd29yZCxyZXF1ZXN0UGFzc0NoYW5nZX0gPXN0YXRlXHJcblxyXG4gICAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICAgICAgaWYobG9naW4pe1xyXG4gICAgICAgICAgICBhY3Rpb25zLmxvZ2luKHtkaXNwYXRjaCxzdGF0ZX0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxbbG9naW5dKVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgICAgIGlmKHNpZ251cCl7XHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2lnbnVwKHtkaXNwYXRjaCxzdGF0ZX0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxbc2lnbnVwXSlcclxuXHJcbiAgICB1c2VFZmZlY3QoKCk9PntcclxuICAgICAgICBpZihjaGFuZ2VQYXNzd29yZCl7XHJcbiAgICAgICAgICAgIGFjdGlvbnMuY2hhbmdlUGFzc3dvcmQoe2Rpc3BhdGNoLHN0YXRlfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxbY2hhbmdlUGFzc3dvcmRdKVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKT0+e1xyXG4gICAgICAgIGlmKHJlcXVlc3RQYXNzQ2hhbmdlKXtcclxuICAgICAgICAgICAgYWN0aW9ucy5mb3Jnb3RQYXNzd29yZCh7ZGlzcGF0Y2gsc3RhdGV9KVxyXG4gICAgICAgIH1cclxuICAgIH0sW3JlcXVlc3RQYXNzQ2hhbmdlXSlcclxuICAgIHJldHVybiBjaGlsZHJlblxyXG5cclxufSIsImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgUGFyc2VBdXRoU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlcy9wYXJzZS9QYXJzZUF1dGhTZXJ2aWNlJ1xyXG5pbXBvcnQgTm9kZUF1dGhTZXJpY2UgZnJvbSAnLi4vc2VydmljZXMvbm9kZWpzL05vZGVBdXRoU2VydmljZSdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aEFkYXB0ZXIgKHByb3BzKXtcclxuICAgIGlmIChQUkVBQ1RfQVBQX0JBQ0sgPT09ICdQUkVBQ1RfQVBQX1BBUlNFJykge1xyXG4gICAgICAgIHJldHVybiA8UGFyc2VBdXRoU2VydmljZSB7Li4ucHJvcHN9IC8+XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChQUkVBQ1RfQVBQX0JBQ0sgPT09ICdQUkVBQ1RfQVBQX05PREVKUycpIHtcclxuICAgICAgICByZXR1cm4gPE5vZGVBdXRoU2VyaWNlIHsuLi5wcm9wc30gLz5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbFxyXG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vYXV0aFJlZHVjZXInO1xyXG5pbXBvcnQgQXV0aEFkYXB0ZXIgZnJvbSAnLi9BdXRoQWRhcHRlcidcclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aENvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc3RhdGUsXHJcbiAgICBkaXNwYXRjaCxcclxuICB9O1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9PlxyXG4gICAgICA8QXV0aEFkYXB0ZXIgc3RhdGU9e3N0YXRlfSBkaXNwYXRjaD17ZGlzcGF0Y2h9PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICAgIDwvQXV0aEFkYXB0ZXI+XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcblxyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL0F1dGhQcm92aWRlcic7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VVc2VyTmFtZSgpIHtcclxuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW29iamVjdElkLCBzZXRPYmplY3RJZF0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgXHJcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG5cclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgdG9rZW4sIGVtYWlsLG9iamVjdElkIH0gPSBKU09OLnBhcnNlKFxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJylcclxuICAgICAgKTtcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgICAgc2V0T2JqZWN0SWQob2JqZWN0SWQpXHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLnVzZXIgJiYgc3RhdGUudXNlci50b2tlbikge1xyXG4gIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4sb2JqZWN0SWQgfSA9c3RhdGUudXNlcjtcclxuICBcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgICAgc2V0T2JqZWN0SWQob2JqZWN0SWQpXHJcbiAgICB9XHJcbiAgfSwgW3N0YXRlLnVzZXJdKTtcclxuXHJcbnVzZUVmZmVjdCgoKT0+e1xyXG4gIGlmKHN0YXRlICYmIHN0YXRlLnVzZXI9PT1udWxsKXtcclxuICAgIHNldFVzZXJuYW1lKG51bGwpO1xyXG4gICAgc2V0VG9rZW4obnVsbCk7XHJcbiAgICBzZXRFbWFpbChudWxsKTtcclxuICAgIHNldE9iamVjdElkKG51bGwpXHJcbiAgfVxyXG59LFtzdGF0ZV0pXHJcbiAgcmV0dXJuIHsgdXNlcm5hbWU6IHVzZXJOYW1lLCB0b2tlbiwgZW1haWwgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlYWRIYW5nb3V0cyh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0IH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG5cclxuICAvLyBzZXQgcmVhZCB0byB0cnVlIG9uIHVucmVhZCBoYW5nb3V0c1xyXG4gIGxldCB1bnJlYWRoYW5nb3V0c0tleSA9IGAke25hbWV9LXVucmVhZC1oYW5nb3V0c2A7XHJcbiAgY29uc3QgdW5yZWFkaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5KSk7XHJcblxyXG4gIGlmICh1bnJlYWRoYW5nb3V0cyYmIHVucmVhZGhhbmdvdXRzLmxlbmd0aD4wKSB7XHJcbiAgICBcclxuICAgIGxldCB1cGRhdGVkdW5yZWFkID0gdW5yZWFkaGFuZ291dHMubWFwKHUgPT4ge1xyXG4gICAgICBpZiAodS51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geyAuLi51LCByZWFkOiB0cnVlIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHVucmVhZGhhbmdvdXRzS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkdW5yZWFkKSk7XHJcbmRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELHVucmVhZGhhbmdvdXRzOnVwZGF0ZWR1bnJlYWR9KVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAvLyBzZXQgaGFuZ291dCB0byByZWFkXHJcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xyXG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xyXG4gIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHsgLi4uaGFuZ291dCwgcmVhZDogdHJ1ZSB9KTtcclxuICAvL1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0cyB9KTtcclxuXHJcbiAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICB1cGRhdGVSZWFkTWVzc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUmVhZE1lc3NzYWdlcyh7IGhhbmdvdXQsIG5hbWUsIGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xyXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBjb25zdCB1cGRhdGVkTWVzc2FnZXMgPSBtZXNzYWdlcy5tYXAoKG0pID0+IHtcclxuICAgIHJldHVybiB7IC4uLm0sIHJlYWQ6IHRydWUgfTtcclxuICB9KTtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQsIG1lc3NhZ2VzOiB1cGRhdGVkTWVzc2FnZXMgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7XHJcbiAgdXNlQ29udGV4dCxcclxuICB1c2VNZW1vLFxyXG4gIHVzZVJlZHVjZXIsXHJcbiAgdXNlRWZmZWN0LFxyXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XHJcbmltcG9ydCB7dXNlTWVzc2FnZX0gZnJvbSAnLi91c2VNZXNzYWdlJ1xyXG5cclxuaW1wb3J0IHtcclxuICBsb2FkSGFuZ291dHMsXHJcbiAgbG9hZE1lc3NhZ2VzLCBcclxufSBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQge3VzZVVzZXJOYW1lfSBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VVc2VyTmFtZSdcclxuaW1wb3J0IHsgdXBkYXRlUmVhZEhhbmdvdXRzIH0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL3VwZGF0ZVJlYWRIYW5nb3V0cyc7XHJcblxyXG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEhhbmdvdXRDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXRzUHJvdmlkZXIocHJvcHMpIHtcclxuIGNvbnN0IHt1c2VybmFtZSx0b2tlbn09dXNlVXNlck5hbWUoKVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB7IGhhbmdvdXQsbWVzc2FnZSB9ID0gc3RhdGU7XHJcbiAgY29uc3QgaGFuZGxlTWVzc2FnZSA9dXNlTWVzc2FnZSh7bWVzc2FnZSx1c2VybmFtZSxkaXNwYXRjaCxmb2N1c2VkSGFuZ291dDpoYW5nb3V0fSlcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHVzZXJuYW1lKSB7XHJcbiAgICAgIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICB9LCBbdXNlcm5hbWVdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHVzZXJuYW1lICYmIHRva2VuKSB7XHJcbiAgICAgXHJcbiAgICAgIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChoYW5nb3V0ICYmIHVzZXJuYW1lKSB7XHJcbiAgXHJcbiAgICAgIC8vZnJvbSBsb2NhbCBzdG9yYWdlXHJcbiAgICAgIGxvYWRNZXNzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0LCB1c2VybmFtZSB9KTtcclxuXHJcbiAgICAgIC8vc2F2ZSBoYW5nb3V0IHRvIGxvY2FsU3RvcmFnZVxyXG4gICAgICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0taGFuZ291dHNgO1xyXG4gICAgICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgICAgIGlmICghaGFuZ291dHMpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGhhbmdvdXRFeGlzdCA9IGhhbmdvdXRzLmZpbmQoXHJcbiAgICAgICAgICAoZykgPT4gZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKGhhbmdvdXRFeGlzdCkge1xyXG4gICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGhhbmdvdXRzLm1hcCgoZykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBoYW5nb3V0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJldHVybiBnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoIWhhbmdvdXQucmVhZCkge1xyXG4gICAgIFxyXG4gICAgIFxyXG4gICAgICAgIHVwZGF0ZVJlYWRIYW5nb3V0cyh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lOiB1c2VybmFtZSB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFtoYW5nb3V0LCB1c2VybmFtZV0pO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBwYXNzd29yZFJlZ2V4ID0gL14oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbYS16QS1aXSkuezgsfSQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcclxuIiwiXHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSAnLi92YWxpZGF0aW9uUmVnZXgnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIHtcclxuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xyXG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlzVmFsaWQ6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbmVsc2V7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgIFxyXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICB9O1xyXG4gIFxyXG59fVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcbiAgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHVzZXJuYW1lKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgIFxyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcblxyXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWUgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICBcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KSB7XHJcblxyXG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9YXV0aDtcclxuXHJcbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgIFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL0F1dGhQcm92aWRlcidcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmltcG9ydCAqIGFzIGN2IGZyb20gJy4uL3ZhbGlkYXRpb24vY29uc3RyYWludFZhbGlkYXRvcnMnXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoKCkge1xyXG4gICAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KClcclxuICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKGUpIHtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldFxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCwgbmFtZSwgdmFsdWUgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG9uTG9naW4oKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEIH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBvblNpZ251cCgpIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBvblJlcXVlc3RQYXNzd29yZENoYW5nZSgpIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb25QYXNzd29yZENoYW5nZSgpIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25TaWduT3V0KCkge1xyXG4gICAgICAgXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVQgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG9uTG9naW5CbHVyKGUpIHtcclxuICAgICAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlXHJcbiAgICAgICAgY29uc3QgeyBuYW1lIH0gPSBlLnRhcmdldFxyXG4gICAgICAgXHJcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Bhc3N3b3JkJzpcclxuICAgICAgICAgICAgICAgIGlmIChwYXNzd29yZCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTlNUUkFJTlRfVkFMSURBVElPTiwgbmFtZTogJ3Bhc3N3b3JkJywgaXNWYWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdSZXF1aXJlZCBmaWVsZCcgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlbWFpbG9ydXNlcm5hbWUnOlxyXG4gICAgICAgICAgICAgICAvLyBpZiAoZW1haWxvcnVzZXJuYW1lID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnZW1haWxvcnVzZXJuYW1lJywgLi4uY3YudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe3ZhbHVlOmVtYWlsb3J1c2VybmFtZX0pIH0pXHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbkxvZ2luQmx1ciBlcnJvcicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uU2lnbnVwQmx1cihlKSB7XHJcbiAgICAgICAgY29uc3QgeyBlbWFpbCwgdXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZVxyXG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gZS50YXJnZXRcclxuICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdwYXNzd29yZCc6XHJcblxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWU6ICdwYXNzd29yZCcsIC4uLmN2LnZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxyXG5cclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAnZW1haWwnLCAuLi5jdi52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3VzZXJuYW1lJzpcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ09OU1RSQUlOVF9WQUxJREFUSU9OLCBuYW1lOiAndXNlcm5hbWUnLCAuLi5jdi52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pIH0pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb25Mb2dpbkJsdXIgZXJyb3InKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbkNoYW5nZVBhc3NCbHVyKCkgeyB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIoKSB7IH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbkZvY3VzKGUpIHtcclxuICAgICAgICBjb25zdCB7IG5hbWUgfSA9IGUudGFyZ2V0XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DT05TVFJBSU5UX1ZBTElEQVRJT04sIG5hbWUsIGlzVmFsaWQ6IHVuZGVmaW5lZCwgbWVzc2FnZTogJycgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyBzdGF0ZSwgb25Gb2N1cywgb25Mb2dpbkJsdXIsIG9uU2lnbnVwQmx1ciwgb25DaGFuZ2VQYXNzQmx1ciwgb25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIsIGRpc3BhdGNoLCBvbkxvZ2luLCBvblNpZ251cCwgb25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UsIG9uUGFzc3dvcmRDaGFuZ2UsIG9uQ2hhbmdlLCBvblNpZ25PdXQgfVxyXG59IiwiaW1wb3J0e3VzZVN0YXRlIGFzIG4sdXNlUmVkdWNlciBhcyB0LHVzZUVmZmVjdCBhcyBlLHVzZUxheW91dEVmZmVjdCBhcyByLHVzZVJlZiBhcyBvLHVzZUltcGVyYXRpdmVIYW5kbGUgYXMgdSx1c2VNZW1vIGFzIGksdXNlQ2FsbGJhY2sgYXMgZix1c2VDb250ZXh0IGFzIGMsdXNlRGVidWdWYWx1ZSBhcyBhfWZyb21cInByZWFjdC9ob29rc1wiO2V4cG9ydCpmcm9tXCJwcmVhY3QvaG9va3NcIjtpbXBvcnR7Q29tcG9uZW50IGFzIGwsY3JlYXRlRWxlbWVudCBhcyBzLG9wdGlvbnMgYXMgdix0b0NoaWxkQXJyYXkgYXMgaCxoeWRyYXRlIGFzIHAscmVuZGVyIGFzIGQsX3VubW91bnQgYXMgbSxjbG9uZUVsZW1lbnQgYXMgeSxjcmVhdGVSZWYgYXMgYixjcmVhdGVDb250ZXh0IGFzIGcsRnJhZ21lbnQgYXMgeH1mcm9tXCJwcmVhY3RcIjtleHBvcnR7Y3JlYXRlRWxlbWVudCxjcmVhdGVDb250ZXh0LGNyZWF0ZVJlZixGcmFnbWVudCxDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7ZnVuY3Rpb24gRShuLHQpe2Zvcih2YXIgZSBpbiB0KW5bZV09dFtlXTtyZXR1cm4gbn1mdW5jdGlvbiB3KG4sdCl7Zm9yKHZhciBlIGluIG4paWYoXCJfX3NvdXJjZVwiIT09ZSYmIShlIGluIHQpKXJldHVybiEwO2Zvcih2YXIgciBpbiB0KWlmKFwiX19zb3VyY2VcIiE9PXImJm5bcl0hPT10W3JdKXJldHVybiEwO3JldHVybiExfXZhciBDPWZ1bmN0aW9uKG4pe3ZhciB0LGU7ZnVuY3Rpb24gcih0KXt2YXIgZTtyZXR1cm4oZT1uLmNhbGwodGhpcyx0KXx8dGhpcykuaXNQdXJlUmVhY3RDb21wb25lbnQ9ITAsZX1yZXR1cm4gZT1uLCh0PXIpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuX19wcm90b19fPWUsci5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHcodGhpcy5wcm9wcyxuKXx8dyh0aGlzLnN0YXRlLHQpfSxyfShsKTtmdW5jdGlvbiBfKG4sdCl7ZnVuY3Rpb24gZShuKXt2YXIgZT10aGlzLnByb3BzLnJlZixyPWU9PW4ucmVmO3JldHVybiFyJiZlJiYoZS5jYWxsP2UobnVsbCk6ZS5jdXJyZW50PW51bGwpLHQ/IXQodGhpcy5wcm9wcyxuKXx8IXI6dyh0aGlzLnByb3BzLG4pfWZ1bmN0aW9uIHIodCl7cmV0dXJuIHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWUscyhuLEUoe30sdCkpfXJldHVybiByLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PSEwLHIuZGlzcGxheU5hbWU9XCJNZW1vKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHIudD0hMCxyfXZhciBBPXYuX19iO2Z1bmN0aW9uIFMobil7ZnVuY3Rpb24gdCh0KXt2YXIgZT1FKHt9LHQpO3JldHVybiBkZWxldGUgZS5yZWYsbihlLHQucmVmKX1yZXR1cm4gdC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD10LnQ9ITAsdC5kaXNwbGF5TmFtZT1cIkZvcndhcmRSZWYoXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsdH12Ll9fYj1mdW5jdGlvbihuKXtuLnR5cGUmJm4udHlwZS50JiZuLnJlZiYmKG4ucHJvcHMucmVmPW4ucmVmLG4ucmVmPW51bGwpLEEmJkEobil9O3ZhciBrPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/aChuKS5yZWR1Y2UoZnVuY3Rpb24obixlLHIpe3JldHVybiBuLmNvbmNhdCh0KGUscikpfSxbXSk6bnVsbH0sUj17bWFwOmssZm9yRWFjaDprLGNvdW50OmZ1bmN0aW9uKG4pe3JldHVybiBuP2gobikubGVuZ3RoOjB9LG9ubHk6ZnVuY3Rpb24obil7aWYoMSE9PShuPWgobikpLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZHJlbi5vbmx5KCkgZXhwZWN0cyBvbmx5IG9uZSBjaGlsZC5cIik7cmV0dXJuIG5bMF19LHRvQXJyYXk6aH0sRj12Ll9fZTtmdW5jdGlvbiBOKG4pe3JldHVybiBuJiYoKG49RSh7fSxuKSkuX19jPW51bGwsbi5fX2s9bi5fX2smJm4uX19rLm1hcChOKSksbn1mdW5jdGlvbiBVKCl7dGhpcy5fX3U9MCx0aGlzLm89bnVsbCx0aGlzLl9fYj1udWxsfWZ1bmN0aW9uIE0obil7dmFyIHQ9bi5fXy5fX2M7cmV0dXJuIHQmJnQudSYmdC51KG4pfWZ1bmN0aW9uIEwobil7dmFyIHQsZSxyO2Z1bmN0aW9uIG8obyl7aWYodHx8KHQ9bigpKS50aGVuKGZ1bmN0aW9uKG4pe2U9bi5kZWZhdWx0fHxufSxmdW5jdGlvbihuKXtyPW59KSxyKXRocm93IHI7aWYoIWUpdGhyb3cgdDtyZXR1cm4gcyhlLG8pfXJldHVybiBvLmRpc3BsYXlOYW1lPVwiTGF6eVwiLG8udD0hMCxvfWZ1bmN0aW9uIE8oKXt0aGlzLmk9bnVsbCx0aGlzLmw9bnVsbH12Ll9fZT1mdW5jdGlvbihuLHQsZSl7aWYobi50aGVuKWZvcih2YXIgcixvPXQ7bz1vLl9fOylpZigocj1vLl9fYykmJnIuX19jKXJldHVybiByLl9fYyhuLHQuX19jKTtGKG4sdCxlKX0sKFUucHJvdG90eXBlPW5ldyBsKS5fX2M9ZnVuY3Rpb24obix0KXt2YXIgZT10aGlzO251bGw9PWUubyYmKGUubz1bXSksZS5vLnB1c2godCk7dmFyIHI9TShlLl9fdiksbz0hMSx1PWZ1bmN0aW9uKCl7b3x8KG89ITAscj9yKGkpOmkoKSl9O3QuX19jPXQuY29tcG9uZW50V2lsbFVubW91bnQsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3UoKSx0Ll9fYyYmdC5fX2MoKX07dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbjtpZighLS1lLl9fdSlmb3IoZS5fX3YuX19rWzBdPWUuc3RhdGUudSxlLnNldFN0YXRlKHt1OmUuX19iPW51bGx9KTtuPWUuby5wb3AoKTspbi5mb3JjZVVwZGF0ZSgpfTtlLl9fdSsrfHxlLnNldFN0YXRlKHt1OmUuX19iPWUuX192Ll9fa1swXX0pLG4udGhlbih1LHUpfSxVLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obix0KXtyZXR1cm4gdGhpcy5fX2ImJih0aGlzLl9fdi5fX2tbMF09Tih0aGlzLl9fYiksdGhpcy5fX2I9bnVsbCksW3MobCxudWxsLHQudT9udWxsOm4uY2hpbGRyZW4pLHQudSYmbi5mYWxsYmFja119O3ZhciBQPWZ1bmN0aW9uKG4sdCxlKXtpZigrK2VbMV09PT1lWzBdJiZuLmwuZGVsZXRlKHQpLG4ucHJvcHMucmV2ZWFsT3JkZXImJihcInRcIiE9PW4ucHJvcHMucmV2ZWFsT3JkZXJbMF18fCFuLmwuc2l6ZSkpZm9yKGU9bi5pO2U7KXtmb3IoO2UubGVuZ3RoPjM7KWUucG9wKCkoKTtpZihlWzFdPGVbMF0pYnJlYWs7bi5pPWU9ZVsyXX19OyhPLnByb3RvdHlwZT1uZXcgbCkudT1mdW5jdGlvbihuKXt2YXIgdD10aGlzLGU9TSh0Ll9fdikscj10LmwuZ2V0KG4pO3JldHVybiByWzBdKyssZnVuY3Rpb24obyl7dmFyIHU9ZnVuY3Rpb24oKXt0LnByb3BzLnJldmVhbE9yZGVyPyhyLnB1c2gobyksUCh0LG4scikpOm8oKX07ZT9lKHUpOnUoKX19LE8ucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuKXt0aGlzLmk9bnVsbCx0aGlzLmw9bmV3IE1hcDt2YXIgdD1oKG4uY2hpbGRyZW4pO24ucmV2ZWFsT3JkZXImJlwiYlwiPT09bi5yZXZlYWxPcmRlclswXSYmdC5yZXZlcnNlKCk7Zm9yKHZhciBlPXQubGVuZ3RoO2UtLTspdGhpcy5sLnNldCh0W2VdLHRoaXMuaT1bMSwwLHRoaXMuaV0pO3JldHVybiBuLmNoaWxkcmVufSxPLnByb3RvdHlwZS5jb21wb25lbnREaWRVcGRhdGU9Ty5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQ9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO24ubC5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7UChuLGUsdCl9KX07dmFyIFc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7fXZhciB0PW4ucHJvdG90eXBlO3JldHVybiB0LmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnByb3BzLmNvbnRleHR9LHQucmVuZGVyPWZ1bmN0aW9uKG4pe3JldHVybiBuLmNoaWxkcmVufSxufSgpO2Z1bmN0aW9uIGoobil7dmFyIHQ9dGhpcyxlPW4uY29udGFpbmVyLHI9cyhXLHtjb250ZXh0OnQuY29udGV4dH0sbi52bm9kZSk7cmV0dXJuIHQucyYmdC5zIT09ZSYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCksdC5wPSExKSxuLnZub2RlP3QucD8oZS5fX2s9dC5fX2ssZChyLGUpLHQuX19rPWUuX19rKToodC52PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpLHAoXCJcIixlKSxlLmFwcGVuZENoaWxkKHQudiksdC5wPSEwLHQucz1lLGQocixlLHQudiksdC5fX2s9dC52Ll9fayk6dC5wJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSksdC5oPXIsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Qudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCl9LG51bGx9ZnVuY3Rpb24geihuLHQpe3JldHVybiBzKGose3Zub2RlOm4sY29udGFpbmVyOnR9KX12YXIgRD0vXig/OmFjY2VudHxhbGlnbm1lbnR8YXJhYmljfGJhc2VsaW5lfGNhcHxjbGlwKD8hUGF0aFUpfGNvbG9yfGZpbGx8Zmxvb2R8Zm9udHxnbHlwaCg/IVIpfGhvcml6fG1hcmtlcig/IUh8V3xVKXxvdmVybGluZXxwYWludHxzdG9wfHN0cmlrZXRocm91Z2h8c3Ryb2tlfHRleHQoPyFMKXx1bmRlcmxpbmV8dW5pY29kZXx1bml0c3x2fHZlY3Rvcnx2ZXJ0fHdvcmR8d3JpdGluZ3x4KD8hQykpW0EtWl0vO2wucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9e307dmFyIEg9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvciYmU3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIil8fDYwMTAzO2Z1bmN0aW9uIFQobix0LGUpe2lmKG51bGw9PXQuX19rKWZvcig7dC5maXJzdENoaWxkOyl0LnJlbW92ZUNoaWxkKHQuZmlyc3RDaGlsZCk7cmV0dXJuIGQobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfWZ1bmN0aW9uIFYobix0LGUpe3JldHVybiBwKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH12YXIgWj12LmV2ZW50O2Z1bmN0aW9uIEkobix0KXtuW1wiVU5TQUZFX1wiK3RdJiYhblt0XSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sdCx7Y29uZmlndXJhYmxlOiExLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzW1wiVU5TQUZFX1wiK3RdfSxzZXQ6ZnVuY3Rpb24obil7dGhpc1tcIlVOU0FGRV9cIit0XT1ufX0pfXYuZXZlbnQ9ZnVuY3Rpb24obil7WiYmKG49WihuKSksbi5wZXJzaXN0PWZ1bmN0aW9uKCl7fTt2YXIgdD0hMSxlPSExLHI9bi5zdG9wUHJvcGFnYXRpb247bi5zdG9wUHJvcGFnYXRpb249ZnVuY3Rpb24oKXtyLmNhbGwobiksdD0hMH07dmFyIG89bi5wcmV2ZW50RGVmYXVsdDtyZXR1cm4gbi5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe28uY2FsbChuKSxlPSEwfSxuLmlzUHJvcGFnYXRpb25TdG9wcGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LG4uaXNEZWZhdWx0UHJldmVudGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGV9LG4ubmF0aXZlRXZlbnQ9bn07dmFyICQ9e2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGFzc319LHE9di52bm9kZTt2LnZub2RlPWZ1bmN0aW9uKG4pe24uJCR0eXBlb2Y9SDt2YXIgdD1uLnR5cGUsZT1uLnByb3BzO2lmKHQpe2lmKGUuY2xhc3MhPWUuY2xhc3NOYW1lJiYoJC5lbnVtZXJhYmxlPVwiY2xhc3NOYW1lXCJpbiBlLG51bGwhPWUuY2xhc3NOYW1lJiYoZS5jbGFzcz1lLmNsYXNzTmFtZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJjbGFzc05hbWVcIiwkKSksXCJmdW5jdGlvblwiIT10eXBlb2YgdCl7dmFyIHIsbyx1O2Zvcih1IGluIGUuZGVmYXVsdFZhbHVlJiZ2b2lkIDAhPT1lLnZhbHVlJiYoZS52YWx1ZXx8MD09PWUudmFsdWV8fChlLnZhbHVlPWUuZGVmYXVsdFZhbHVlKSxkZWxldGUgZS5kZWZhdWx0VmFsdWUpLEFycmF5LmlzQXJyYXkoZS52YWx1ZSkmJmUubXVsdGlwbGUmJlwic2VsZWN0XCI9PT10JiYoaChlLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uKG4pey0xIT1lLnZhbHVlLmluZGV4T2Yobi5wcm9wcy52YWx1ZSkmJihuLnByb3BzLnNlbGVjdGVkPSEwKX0pLGRlbGV0ZSBlLnZhbHVlKSxlKWlmKHI9RC50ZXN0KHUpKWJyZWFrO2lmKHIpZm9yKHUgaW4gbz1uLnByb3BzPXt9LGUpb1tELnRlc3QodSk/dS5yZXBsYWNlKC9bQS1aMC05XS8sXCItJCZcIikudG9Mb3dlckNhc2UoKTp1XT1lW3VdfSFmdW5jdGlvbih0KXt2YXIgZT1uLnR5cGUscj1uLnByb3BzO2lmKHImJlwic3RyaW5nXCI9PXR5cGVvZiBlKXt2YXIgbz17fTtmb3IodmFyIHUgaW4gcikvXm9uKEFuaXxUcmF8VG91KS8udGVzdCh1KSYmKHJbdS50b0xvd2VyQ2FzZSgpXT1yW3VdLGRlbGV0ZSByW3VdKSxvW3UudG9Mb3dlckNhc2UoKV09dTtpZihvLm9uZG91YmxlY2xpY2smJihyLm9uZGJsY2xpY2s9cltvLm9uZG91YmxlY2xpY2tdLGRlbGV0ZSByW28ub25kb3VibGVjbGlja10pLG8ub25iZWZvcmVpbnB1dCYmKHIub25iZWZvcmVpbnB1dD1yW28ub25iZWZvcmVpbnB1dF0sZGVsZXRlIHJbby5vbmJlZm9yZWlucHV0XSksby5vbmNoYW5nZSYmKFwidGV4dGFyZWFcIj09PWV8fFwiaW5wdXRcIj09PWUudG9Mb3dlckNhc2UoKSYmIS9eZmlsfGNoZXxyYS9pLnRlc3Qoci50eXBlKSkpe3ZhciBpPW8ub25pbnB1dHx8XCJvbmlucHV0XCI7cltpXXx8KHJbaV09cltvLm9uY2hhbmdlXSxkZWxldGUgcltvLm9uY2hhbmdlXSl9fX0oKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYhdC5tJiZ0LnByb3RvdHlwZSYmKEkodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsTW91bnRcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHNcIiksSSh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxVcGRhdGVcIiksdC5tPSEwKX1xJiZxKG4pfTt2YXIgQj1cIjE2LjguMFwiO2Z1bmN0aW9uIEcobil7cmV0dXJuIHMuYmluZChudWxsLG4pfWZ1bmN0aW9uIEoobil7cmV0dXJuISFuJiZuLiQkdHlwZW9mPT09SH1mdW5jdGlvbiBLKG4pe3JldHVybiBKKG4pP3kuYXBwbHkobnVsbCxhcmd1bWVudHMpOm59ZnVuY3Rpb24gUShuKXtyZXR1cm4hIW4uX19rJiYoZChudWxsLG4pLCEwKX1mdW5jdGlvbiBYKG4pe3JldHVybiBuJiYobi5iYXNlfHwxPT09bi5ub2RlVHlwZSYmbil8fG51bGx9dmFyIFk9ZnVuY3Rpb24obix0KXtyZXR1cm4gbih0KX07ZXhwb3J0IGRlZmF1bHR7dXNlU3RhdGU6bix1c2VSZWR1Y2VyOnQsdXNlRWZmZWN0OmUsdXNlTGF5b3V0RWZmZWN0OnIsdXNlUmVmOm8sdXNlSW1wZXJhdGl2ZUhhbmRsZTp1LHVzZU1lbW86aSx1c2VDYWxsYmFjazpmLHVzZUNvbnRleHQ6Yyx1c2VEZWJ1Z1ZhbHVlOmEsdmVyc2lvbjpcIjE2LjguMFwiLENoaWxkcmVuOlIscmVuZGVyOlQsaHlkcmF0ZTpULHVubW91bnRDb21wb25lbnRBdE5vZGU6USxjcmVhdGVQb3J0YWw6eixjcmVhdGVFbGVtZW50OnMsY3JlYXRlQ29udGV4dDpnLGNyZWF0ZUZhY3Rvcnk6RyxjbG9uZUVsZW1lbnQ6SyxjcmVhdGVSZWY6YixGcmFnbWVudDp4LGlzVmFsaWRFbGVtZW50OkosZmluZERPTU5vZGU6WCxDb21wb25lbnQ6bCxQdXJlQ29tcG9uZW50OkMsbWVtbzpfLGZvcndhcmRSZWY6Uyx1bnN0YWJsZV9iYXRjaGVkVXBkYXRlczpZLFN1c3BlbnNlOlUsU3VzcGVuc2VMaXN0Ok8sbGF6eTpMfTtleHBvcnR7QiBhcyB2ZXJzaW9uLFIgYXMgQ2hpbGRyZW4sVCBhcyByZW5kZXIsViBhcyBoeWRyYXRlLFEgYXMgdW5tb3VudENvbXBvbmVudEF0Tm9kZSx6IGFzIGNyZWF0ZVBvcnRhbCxHIGFzIGNyZWF0ZUZhY3RvcnksSyBhcyBjbG9uZUVsZW1lbnQsSiBhcyBpc1ZhbGlkRWxlbWVudCxYIGFzIGZpbmRET01Ob2RlLEMgYXMgUHVyZUNvbXBvbmVudCxfIGFzIG1lbW8sUyBhcyBmb3J3YXJkUmVmLFkgYXMgdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMsVSBhcyBTdXNwZW5zZSxPIGFzIFN1c3BlbnNlTGlzdCxMIGFzIGxhenl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGF0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEZlYXR1cmVSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJ1xyXG5pbXBvcnQge3VzZUF1dGh9IGZyb20gJy4vc3RhdGUvdXNlQXV0aCdcclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL0xvZ2luJykpO1xyXG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3VpLWNvbXBvbmVudHMvQ2hhbmdlUGFzc3dvcmQnKSk7XHJcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vdWktY29tcG9uZW50cy9TaWdudXAnKSk7XHJcbmNvbnN0IFByb2ZpbGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi91aS1jb21wb25lbnRzL1Byb2ZpbGUnKSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoRmVhdHVyZVJvdXRlcygpIHtcclxuICBjb25zdCB7b25Gb2N1cyxvbkxvZ2luLG9uTG9naW5CbHVyLG9uU2lnbnVwQmx1cixvbkNoYW5nZVBhc3NCbHVyLG9uUmVxdWVzdFBhc3NDaGFuZ2VCbHVyLG9uU2lnbnVwLG9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlLG9uUGFzc3dvcmRDaGFuZ2UsIG9uQ2hhbmdlLHN0YXRlfT11c2VBdXRoKClcclxuIFxyXG4gIHJldHVybiBbXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvY2hhbmdlLXBhc3dvcmRcIj5cclxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgIDxDaGFuZ2VQYXNzd29yZCAgey4uLnN0YXRlfSBvbkZvY3VzPXtvbkZvY3VzfSBvbkJsdXI9e29uQ2hhbmdlUGFzc0JsdXJ9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gb25QYXNzd29yZENoYW5nZT17b25QYXNzd29yZENoYW5nZX0vPlxyXG4gICAgICA8L1N1c3BlbnNlPlxyXG4gICAgPC9GZWF0dXJlUm91dGU+LFxyXG4gICAgPEZlYXR1cmVSb3V0ZSBwYXRoPVwiL2xvZ2luXCI+XHJcbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICA8TG9naW4gey4uLnN0YXRlfSBvbkZvY3VzPXtvbkZvY3VzfSBvbkJsdXI9e29uTG9naW5CbHVyfSBvbkNoYW5nZT17b25DaGFuZ2V9IG9uTG9naW49e29uTG9naW59IC8+XHJcbiAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvc2lnbnVwXCI+XHJcbiAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICA8U2lnbnVwIHsuLi5zdGF0ZX0gb25Gb2N1cz17b25Gb2N1c30gb25CbHVyPXtvblNpZ251cEJsdXJ9IG9uQ2hhbmdlPXtvbkNoYW5nZX1vblNpZ251cD17b25TaWdudXB9IC8+XHJcbiAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvZm9yZ290LXBhc3dvcmRcIj5cclxuICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgIDxGb3Jnb3RQYXNzd29yZCB7Li4uc3RhdGV9IG9uRm9jdXM9e29uRm9jdXN9IG9uQmx1cj17b25SZXF1ZXN0UGFzc0NoYW5nZUJsdXJ9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gb25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2U9e29uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlfS8+XHJcbiAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICA8L0ZlYXR1cmVSb3V0ZT4sXHJcbiAgICA8RmVhdHVyZVJvdXRlIHBhdGg9XCIvcHJvZmlsZVwiPlxyXG4gICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgPFByb2ZpbGUgLz5cclxuICAgICAgPC9TdXNwZW5zZT5cclxuICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gIF1cclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBlbmRpbmdIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9ubGluZSxpc0Jsb2NrZXIgfSkge1xyXG5cclxuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xyXG4gIGxldCBoYW5nb3V0S2V5ID0gJyc7XHJcbiAgbGV0IG1lc3NhZ2VLZXkgPSAnJztcclxuICBpZiAob25saW5lKSB7XHJcbiAgICBcclxuICAgIGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XHJcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBcclxuICAgIGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcclxuICAgIG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1vZmZsaW5lLW1lc3NhZ2VzYDtcclxuICB9XHJcblxyXG4gIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSk7XHJcbiAgaWYgKG1lc3NhZ2UgJiYgbWVzc2FnZS50ZXh0ICE9PVwiXCIpIHtcclxuICAgIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgdXNlcm5hbWUsIG1lc3NhZ2UsZGlzcGF0Y2gsaXNCbG9ja2VyIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZUhhbmdvdXQoeyBoYW5nb3V0S2V5LCB1c2VybmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcclxuICBpZiAoaGFuZ291dHMpIHtcclxuICAgIFxyXG4gICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XHJcbiAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgaGFuZ291dCk7XHJcbiAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcclxuICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBcclxuICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtoYW5nb3V0XTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogdXBkYXRlZEhhbmdvdXRzIH0pO1xyXG4gIH1cclxuIFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3NhZ2UoeyBtZXNzYWdlS2V5LCBtZXNzYWdlLGRpc3BhdGNoLGlzQmxvY2tlciB9KSB7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcclxuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gW107XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiBcclxuICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgbWVzc2FnZV07XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbbWVzc2FnZV07XHJcbiAgfVxyXG4gIGlmKGlzQmxvY2tlcil7XHJcbiBcclxuICAgIGNvbnN0IGJsb2NrZXIgPVsuLi51cGRhdGVkTWVzc2FnZXMse3RleHQ6J1lvdSBjYW4gbm90IHNlbmQgdGhpcyBtZXNzYWdlIGJlY2F1c2UgeW91IGFyZSBibG9ja2VkLidcclxuICAgICx0aW1lc3RhbXA6IERhdGUubm93KCksdHlwZTonYmxvY2tlcicsdXNlcm5hbWU6bWVzc2FnZS51c2VybmFtZSxmbG9hdDoncmlnaHQnfV1cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KGJsb2NrZXIpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IGJsb2NrZXIgfSk7XHJcbiAgXHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcclxuICB9XHJcbiBcclxuXHJcbn1cclxuIiwiXHJcbmV4cG9ydCBmdW5jdGlvbiBzZW5kT2ZmbGluZUhhbmdvdXRzKHsgc29ja2V0LCBuYW1lIH0pIHtcclxuICBjb25zdCBvZmZsaW5lSGFuZ291dEtleSA9IGAke25hbWV9LW9mZmxpbmUtaGFuZ291dHNgO1xyXG4gIGNvbnN0IG9mZmxpbmVIYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0ob2ZmbGluZUhhbmdvdXRLZXkpKTtcclxuICBpZiAob2ZmbGluZUhhbmdvdXRzKSB7XHJcbiAgICBvZmZsaW5lSGFuZ291dHMuZm9yZUVhY2goKGgpID0+IHtcclxuICAgICAgc29ja2V0LnNlbmQoXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdXNlcm5hbWU6IGgudXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbDogaC5lbWFpbCxcclxuICAgICAgICAgIG1lc3NhZ2U6IGgubWVzc2FnZSxcclxuICAgICAgICAgIHRpbWVzdGFtcDogaC50aW1lc3RhbXAsXHJcbiAgICAgICAgICBjb21tYW5kOiBoLnN0YXRlLFxyXG4gICAgICAgICAgb2ZmbGluZTogdHJ1ZSxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJldHVybjtcclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUhhbmdvdXRGcm9tVW5yZWFkKHtuYW1lLCBoYW5nb3V0LGRpc3BhdGNofSl7XHJcbiAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xyXG4gICAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcclxuICAgIGxldCB1bnJlYWRoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odW5yZWFkaGFuZ291dHNLZXkpKTtcclxuICAgXHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICBjb25zdCBmaWx0ZXJlZEhhbmdvdXRzID0gdW5yZWFkaGFuZ291dHMuZmlsdGVyKGZ1bmN0aW9uKHVucmVhZCkgIHtcclxuICAgICAgICAgICAgcmV0dXJuICB1bnJlYWQudXNlcm5hbWUgIT09IHVzZXJuYW1lfSk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihmaWx0ZXJlZEhhbmdvdXRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSwgSlNPTi5zdHJpbmdpZnkoZmlsdGVyZWRIYW5nb3V0cykpO1xyXG4gICAgICAgICAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxyXG4gICAgICAgICAgICAgICAgdW5yZWFkaGFuZ291dHM6IGZpbHRlcmVkSGFuZ291dHMsXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odW5yZWFkaGFuZ291dHNLZXkpO1xyXG4gICAgICAgICAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuVU5SRUFEX0hBTkdPVVRTX1VQREFURUQsXHJcbiAgICAgICAgICAgICAgICAgIHVucmVhZGhhbmdvdXRzOiBbXSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIFxyXG4gICAgICBcclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24nO1xyXG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IHsgc2F2ZVBlbmRpbmdIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnO1xyXG5pbXBvcnQge1xyXG5cclxuICBzZWxlY3RVbnJlYWQsXHJcbiAgXHJcblxyXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHNlbmRPZmZsaW5lSGFuZ291dHMgfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMnO1xyXG5pbXBvcnQge3JlbW92ZUhhbmdvdXRGcm9tVW5yZWFkfSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQnXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XHJcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0ICB1c2VybmFtZSAgPSBhdXRoQ29udGV4dC5zdGF0ZS51c2VyICYmYXV0aENvbnRleHQuc3RhdGUudXNlci51c2VybmFtZTtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XHJcbiAgY29uc3Qge1xyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgdXNlcnMsXHJcbiAgICBtZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VzLFxyXG4gICAgcmVhZHlTdGF0ZSxcclxuICBcclxuICAgIHVucmVhZGhhbmdvdXRzLFxyXG4gIH0gPSBzdGF0ZTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICggcmVhZHlTdGF0ZSA9PT0gMSAmJiB1c2VybmFtZSkge1xyXG4gICAgICBzZW5kT2ZmbGluZUhhbmdvdXRzKHsgbmFtZTogdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtyZWFkeVN0YXRlLCB1c2VybmFtZV0pO1xyXG5cclxuICBmdW5jdGlvbiBvblJlbW92ZVVucmVhZChlKXtcclxuICAgIGNvbnN0IGlkID1lLmN1cnJlbnRUYXJnZXQuaWRcclxuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBpZCk7XHJcbiAgIFxyXG4gICAgcmVtb3ZlSGFuZ291dEZyb21VbnJlYWQoe25hbWU6dXNlcm5hbWUsZGlzcGF0Y2gsaGFuZ291dH0pXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uTmF2aWdhdGlvbihlKXtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgLy8gY29uc3QgaWQgPWUudGFyZ2V0LmlkXHJcbiAgICBjb25zdCBpZCA9ZS5jdXJyZW50VGFyZ2V0LmlkXHJcbiAgIFxyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2lkfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XHJcbiAgICBjb25zdCBoYW5nb3V0ID0gaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpXHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCBoYW5nb3V0IH0pXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0VW5yZWFkKGUpIHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XHJcbiAgICBcclxuIFxyXG4gICAgY29uc3QgaGFuZ291dCA9IGhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcclxuICAgIHNlbGVjdFVucmVhZCh7IGRpc3BhdGNoLCBoYW5nb3V0IH0pO1xyXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TZWFyY2hJbnB1dChlKSB7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TRUFSQ0hfSU5QVVRfQ0hBTkdFLCBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25GZXRjaEhhbmdvdXRzKCl7XHJcblxyXG4gICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEfSlcclxuICB9XHJcblxyXG4gXHJcbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XHJcbiAgICBjb25zdCB0ZXh0ID0gZS50YXJnZXQudmFsdWU7XHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IGRpc3BhdGNoLCB0ZXh0IH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBvbkhhbmdvdXQoZSkge1xyXG4gICAgXHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQ6ICcnLCBkaXNwYXRjaCB9KTtcclxuICAgIGNvbnN0IGNvbW1hbmQgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IGhhbmdvdXQ7XHJcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgbWVzc2FnZSA9XHJcbiAgICAgIG1lc3NhZ2VUZXh0ICE9PSAnJyA/IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCB9IDogbnVsbDtcclxuXHJcbiAgICBsZXQgb25saW5lID0gdHJ1ZTtcclxuICAgIGxldCBpc0Jsb2NrZXIgPWZhbHNlXHJcbiAgICBcclxuICAvLyAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgICAgXHJcbiAgICAgIGlmKGhhbmdvdXQuc3RhdGUgPT09J0JMT0NLRVInKXtcclxuICAgICAgIFxyXG4gICAgICAgIGlzQmxvY2tlcj10cnVlXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcGVuZGluZ0hhbmdvdXQ9IHtcclxuICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgIGNvbW1hbmQsXHJcbiAgICAgICAgdGltZXN0YW1wLFxyXG4gICAgICB9XHJcbiAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTkRJTkdfSEFOR09VVF9TVEFSVEVELCBwZW5kaW5nSGFuZ291dH0pXHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgLy8gICBvbmxpbmUgPSBmYWxzZTtcclxuICAgIC8vIH1cclxuICAgXHJcbiBcclxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XHJcbiAgICAgIGRpc3BhdGNoLFxyXG4gICAgICBuYW1lOiB1c2VybmFtZSxcclxuICAgICAgaGFuZ291dDoge1xyXG4gICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIHN0YXRlOiBjb21tYW5kLFxyXG4gICAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCwgZGVsaXZlcmVkOiBmYWxzZSwgdXNlcm5hbWUgfSxcclxuICAgICAgICB0aW1lc3RhbXAsXHJcbiAgICAgICAgZGVsaXZlcmVkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgb25saW5lLFxyXG4gICAgICBpc0Jsb2NrZXJcclxuICAgIH0pO1xyXG4gIH0vL2VuZCBvbkhhbmdvdXRcclxuICByZXR1cm4ge1xyXG4gICAgc3RhdGUsXHJcbiAgICBvbk5hdmlnYXRpb24sXHJcbiAgICBvblNlbGVjdFVucmVhZCxcclxuICAgIG9uTWVzc2FnZVRleHQsXHJcbiAgICBtZXNzYWdlVGV4dCxcclxuICAgIG9uU2VhcmNoSW5wdXQsXHJcbiAgICBvbkZldGNoSGFuZ291dHMsXHJcbiAgICBzZWFyY2gsXHJcbiAgICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgICBkaXNwYXRjaCxcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIHVzZXJzLFxyXG4gICAgdXNlcm5hbWUsXHJcbiAgICBtZXNzYWdlcyxcclxuICAgIG9uSGFuZ291dCxcclxuICAgIHVucmVhZGhhbmdvdXRzLFxyXG4gICAgcmVhZHlTdGF0ZSxcclxuICAgIG9uUmVtb3ZlVW5yZWFkXHJcbiAgfTtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcclxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxyXG5cclxuICAgIFNFQVJDSF9JTlBVVF9DSEFOR0VEOiAnU0VBUkNIX0lOUFVUX0NIQU5HRUQnLFxyXG5cclxuICAgIFxyXG4gICAgTUVTU0FHRV9SRUNJRVZFRDogXCJNRVNTQUdFX1JFQ0lFVkVEXCIsXHJcbiAgICBTT0NLRVRfRVJST1I6ICdTT0NLRVRfRVJST1InLFxyXG4gICAgQ09OTkVDVElORzogJ0NPTk5FQ1RJTkcnLFxyXG4gICAgT1BFTjogJ09QRU4nLFxyXG4gICAgQ0xPU0lORzogJ0NMT1NJTkcnLFxyXG4gICAgQ0xPU0VEOiAnQ0xPU0VEJyxcclxuICAgIFNPQ0tFVF9SRUFEWTogJ1NPQ0tFVF9SRUFEWScsXHJcbn1cclxuIiwiLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXHJcbiAgICAgICk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxyXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSW5wdXQoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSF9JTlBVVF9DSEFOR0VELCBzZWFyY2ggfSk7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IHVzZUVmZmVjdCx1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuLi8uLi9zdGF0ZS91c2VIYW5nb3V0cydcclxuaW1wb3J0ICAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJ1xyXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL3N0YXRlL2FjdGlvblR5cGVzJ1xyXG5pbXBvcnQge3VzZVVzZXJOYW1lfSBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbi9zdGF0ZS91c2VVc2VyTmFtZSdcclxuZXhwb3J0IGZ1bmN0aW9uIFdlYlNvY2tldENvbnRhaW5lcihwcm9wcykge1xyXG4gICAgY29uc3Qge3VzZXJuYW1lLHRva2VufT11c2VVc2VyTmFtZSgpXHJcbiAgICBjb25zdCBbc29ja2V0LHNldFNvY2tldF09dXNlU3RhdGUoKVxyXG5cclxuXHJcbiAgICBjb25zdCB7IGNoaWxkcmVuLHNvY2tldFVybCB9ID0gcHJvcHNcclxuICAgIGNvbnN0IHsgZGlzcGF0Y2gsIHN0YXRlIH0gPSB1c2VIYW5nb3V0cygpXHJcbiAgICBjb25zdCB7IGZldGNoSGFuZ291dHMsc2VhcmNoLHBlbmRpbmdIYW5nb3V0IH0gPSBzdGF0ZVxyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBzb2NrID0gbmV3IFdlYlNvY2tldChgJHtzb2NrZXRVcmx9L2hhbmdvdXRzLz91c2VybmFtZT0ke3VzZXJuYW1lfWApO1xyXG4gICAgICAgICAgICBzb2NrLm9ubWVzc2FnZSA9IChzZXJ2ZXJNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKHNlcnZlck1lc3NhZ2UuZGF0YSk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfTUVTU0FHRV9SRUNJRVZFRCwgbWVzc2FnZTogbXNnIH0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNvY2sub25vcGVuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT1BFTiB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc29jay5vbmNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xPU0VEIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzb2NrLm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfRVJST1IsIGVycm9yIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWSwgc29ja2V0OiBzb2NrIH0pO1xyXG4gICAgICAgICAgICBzZXRTb2NrZXQoc29jayk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW3VzZXJuYW1lXSk7XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpPT57XHJcbiAgICAgICAgaWYoZmV0Y2hIYW5nb3V0cyl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZmV0Y2hIYW5nb3V0cyh7ZGlzcGF0Y2gsc2VhcmNoLHVzZXJuYW1lfSlcclxuICAgICAgICB9XHJcbiAgICB9LFtmZXRjaEhhbmdvdXRzXSlcclxuXHJcbiAgICB1c2VFZmZlY3QoKCk9PntcclxuICAgICAgICBpZihwZW5kaW5nSGFuZ291dCl7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNlbmRIYW5nb3V0KClcclxuICAgICAgICB9XHJcbiAgICB9LFtwZW5kaW5nSGFuZ291dF0pXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHNlbmRIYW5nb3V0KCl7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkocGVuZGluZ0hhbmdvdXQpKVxyXG4gICAgXHJcbiAgICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VORElOR19IQU5HT1VUX0ZVTExGSUxMRUR9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjaGlsZHJlblxyXG5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCB7IFBhcnNlU2VydmVyIH0gZnJvbSAnLi4vc2VydmljZXMvcGFyc2UvUGFyc2VTZXJ2ZXInXHJcbmltcG9ydCB7IFdlYlNvY2tldENvbnRhaW5lciB9IGZyb20gJy4uL3NlcnZpY2VzL3dlYnNvY2tldC9XZWJTb2NrZXRDb250YWluZXInXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhhbmdvdXRBZGFwdGVyKHByb3BzKSB7XHJcbiAgICBpZiAoUFJFQUNUX0FQUF9CQUNLID09PSAnUFJFQUNUX0FQUF9QQVJTRScpIHtcclxuICAgICAgICByZXR1cm4gPFBhcnNlU2VydmVyIHsuLi5wcm9wc30gLz5cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKFBSRUFDVF9BUFBfQkFDSyA9PT0gJ1BSRUFDVF9BUFBfTk9ERUpTJykge1xyXG4gICAgICAgIHJldHVybiA8V2ViU29ja2V0Q29udGFpbmVyIHsuLi5wcm9wc30gLz5cclxuICAgIH1cclxuXHJcbiAgICBlbHNlIHJldHVybiBudWxsO1xyXG59IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBBcHBSb3V0ZVByb3ZpZGVyIGZyb20gJ2NvbXBvbmVudHMvYXBwLXJvdXRlJztcclxuaW1wb3J0IEhhbmdvdXRBZGFwdGVyIGZyb20gJ2ZlYXR1cmVzL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRBZGFwdGVyJztcclxuaW1wb3J0IEhhbmdvdXRzUHJvdmlkZXIgZnJvbSAnZmVhdHVyZXMvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlcidcclxuaW1wb3J0IEF1dGhQcm92aWRlciBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbic7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBcHBSb3V0ZVByb3ZpZGVyXHJcbiAgICAgIHRpdGxlPVwiV2ViY29tXCJcclxuICAgICAgaW5pdFN0YXRlPXt7IHJvdXRlOiAnLycsIGZlYXR1cmVSb3V0ZTogJy9oYW5nb3V0cycgfX1cclxuICAgID5cclxuICAgICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgICA8SGFuZ291dHNQcm92aWRlcj5cclxuICAgICAgICAgIDxIYW5nb3V0QWRhcHRlciBzb2NrZXRVcmw9e2B3c3M6Ly8ke2lwfTozMDAwYH0+XHJcbiAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICAgIDwvSGFuZ291dEFkYXB0ZXI+XHJcbiAgICAgICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICA8L0F1dGhQcm92aWRlcj5cclxuICAgIDwvQXBwUm91dGVQcm92aWRlcj5cclxuXHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICdjb21wb25lbnRzL2FwcC1yb3V0ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdmJhcihwcm9wcykge1xyXG4gICAgY29uc3QgeyBiZyA9ICdsaWdodCcsIGJyYW5kLCBjaGlsZHJlbiB9ID0gcHJvcHNcclxuICAgIHJldHVybiA8bmF2IGNsYXNzTmFtZT17YG5hdmJhciBuYXZiYXItZXhwYW5kLWxnIG5hdmJhci0ke2JnfSBiZy0ke2JnfWB9PlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIjXCI+e2JyYW5kfTwvYT5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCIgYXJpYS1jb250cm9scz1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiVG9nZ2xlIG5hdmlnYXRpb25cIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXItaWNvblwiPjwvc3Bhbj5cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgIFxyXG4gICAgPC9uYXY+XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyQ29sbGFwc2Uoe2NoaWxkcmVufSl7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2QmFyTmF2KHsgY2hpbGRyZW4gfSkge1xyXG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1yLWF1dG9cIj5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L3VsPlxyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHsgY2hpbGRyZW4gfSkge1xyXG4gIFxyXG4gICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPntjaGlsZHJlbn08L2xpPlxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE5hdkxpbmsocHJvcHMpIHtcclxuICAgIGNvbnN0IHthcHBSb3V0ZX09cHJvcHNcclxuICAgIGNvbnN0IHtvbkFwcFJvdXRlfT11c2VBcHBSb3V0ZSgpXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBcclxuICAgICAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6YC8ke2lkfWAscm91dGU6YXBwUm91dGV9KVxyXG4gICAgICB9XHJcbiAgICByZXR1cm4gPGEgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBocmVmPVwiI1wiIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSAgey4uLnByb3BzfS8+XHJcbn0iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXYgKHByb3BzKXtcclxuICAgIGNvbnN0IHtjaGlsZHJlbixob3Jpem9udGFsQWxpZ25tZW50fT1wcm9wc1xyXG5cclxucmV0dXJuIDx1bCBjbGFzc05hbWU9e2BuYXYgJHtob3Jpem9udGFsQWxpZ25tZW50ICYmIGhvcml6b250YWxBbGlnbm1lbnR9YH0gey4uLnByb3BzfT57Y2hpbGRyZW59PC91bD5cclxufVxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IE5hdmJhciwgeyBOYXZCYXJOYXYsIE5hdkl0ZW0sIE5hdkxpbmssIE5hdkJhckNvbGxhcHNlIH0gZnJvbSAnY29tcG9uZW50cy9uYXYtYmFyJ1xyXG5pbXBvcnQgTmF2IGZyb20gJ2NvbXBvbmVudHMvbmF2J1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJ2ZlYXR1cmVzL2F1dGhlbnRpY2F0aW9uL3N0YXRlL3VzZVVzZXJOYW1lJ1xyXG5pbXBvcnQgeyB1c2VBdXRoIH0gZnJvbSAnZmVhdHVyZXMvYXV0aGVudGljYXRpb24nXHJcbmltcG9ydCBOYXZEcm9wZG93biwgeyBEcm9wZG93bk1lbnUsIERyb3Bkb3duSXRlbSB9IGZyb20gJ2NvbXBvbmVudHMvbmF2LWJhci9uYXYtZHJvcGRvd24nXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwTmF2aWdhdGlvbigpIHtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSB1c2VVc2VyTmFtZSgpXHJcbiAgY29uc3QgeyBvblNpZ25PdXQgfSA9IHVzZUF1dGgoKVxyXG4gIHJldHVybiA8ZGl2ID5cclxuICAgIDxOYXZiYXIgYnJhbmQ9XCJXZWJjb21cIiBiZz1cImRhcmtcIj5cclxuICAgICAgPE5hdkJhckNvbGxhcHNlPlxyXG4gICAgICAgIDxOYXZCYXJOYXY+XHJcbiAgICAgICAgICA8TmF2SXRlbT5cclxuICAgICAgICAgICAge3VzZXJuYW1lICYmIDxOYXZMaW5rIGlkPVwiaGFuZ291dFwiIGFwcFJvdXRlPVwiL2hhbmdvdXRzXCI+SGFuZ291dHM8L05hdkxpbms+fVxyXG4gICAgICAgICAgPC9OYXZJdGVtPlxyXG5cclxuICAgICAgICA8L05hdkJhck5hdj5cclxuICAgICAgICA8TmF2IGhvcml6b250YWxBbGlnbm1lbnQ9XCJqdXN0aWZ5LWNvbnRlbnQtZW5kXCI+XHJcbiAgICAgICAgICB7IXVzZXJuYW1lICYmIDxOYXZJdGVtPlxyXG4gICAgICAgICAgICA8TmF2TGluayBpZD1cImxvZ2luXCIgYXBwUm91dGU9XCIvYXV0aFwiIGRhdGEtdGVzdGlkPVwibG9naW4tbGlua1wiPlNpZ24gaW48L05hdkxpbms+XHJcbiAgICAgICAgICA8L05hdkl0ZW0+fVxyXG4gICAgICAgICAgeyF1c2VybmFtZSAmJiA8TmF2SXRlbT5cclxuICAgICAgICAgICAgPE5hdkxpbmsgaWQ9XCJzaWdudXBcIiBhcHBSb3V0ZT1cIi9hdXRoXCIgZGF0YS10ZXN0aWQ9XCJzaWdudXAtbGlua1wiPlNpZ24gdXA8L05hdkxpbms+XHJcbiAgICAgICAgICA8L05hdkl0ZW0+fVxyXG4gICAgICAgICAgPE5hdkl0ZW0+XHJcbiAgICAgICAgICAgIHt1c2VybmFtZSAmJiA8TmF2TGluayBpZD1cInByb2ZpbGVcIiBhcHBSb3V0ZT1cIi9hdXRoXCIgZGF0YS10ZXN0aWQ9XCJwcm9maWxlLWxpbmtcIj5XZWxjb21lLCB7dXNlcm5hbWV9PC9OYXZMaW5rPn1cclxuICAgICAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgICAgIDxOYXZJdGVtPlxyXG4gICAgICAgICAgICB7dXNlcm5hbWUgJiYgPE5hdkxpbmsgaWQ9XCJwcm9maWxlXCIgYXBwUm91dGU9XCIvYXV0aFwiIGRhdGEtdGVzdGlkPVwic2lnbm91dC1saW5rXCIgb25DbGljaz17b25TaWduT3V0fT5TaWduIG91dDwvTmF2TGluaz59XHJcbiAgICAgICAgICA8L05hdkl0ZW0+XHJcbiAgICAgICAgPC9OYXY+XHJcbiAgICAgIDwvTmF2QmFyQ29sbGFwc2U+XHJcbiAgICA8L05hdmJhcj5cclxuICA8L2Rpdj5cclxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhvbWUoKSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9J2hvbWUnIHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PkhvbWU8L2Rpdj47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnO1xyXG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnLi9Ib21lJztcclxuaW1wb3J0IHtBdXRoRmF0dXJlUm91dGVzfSBmcm9tICdmZWF0dXJlcy9hdXRoZW50aWNhdGlvbidcclxuXHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJ2ZlYXR1cmVzL2hhbmdvdXRzL3VpLWNvbXBvbmVudHMvSGFuZ291dCcpKTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVzKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzEwMCUnfX0+XHJcbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2F1dGhcIj5cclxuXHJcbiAgICA8QXV0aEZhdHVyZVJvdXRlcy8+XHJcbiAgIFxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9cIj5cclxuICAgICAgICA8SG9tZSAvPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG5cclxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SGFuZ291dHMgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0FwcFJvdXRlPlxyXG4gIFxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgQXBwTmF2aWdhdGlvbiB9IGZyb20gJy4vQXBwTmF2aWdhdGlvbidcclxuaW1wb3J0IHsgQXBwUm91dGVzIH0gZnJvbSAnLi9BcHBSb3V0ZXMnXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcCgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiA+XHJcbiAgICAgIDxBcHBOYXZpZ2F0aW9uIC8+XHJcbiAgICAgIDxBcHBSb3V0ZXMgLz5cclxuICAgICAgeycnfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgJ3doYXR3Zy1mZXRjaCc7XHJcbmltcG9ydCB7IGgsIHJlbmRlciB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IEFwcFByb3ZpZGVycyB9IGZyb20gJy4vQXBwUHJvdmlkZXJzJztcclxuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi9BcHAnO1xyXG5QYXJzZS5pbml0aWFsaXplKFwienR0cG5xVHI4cmVma3RCV05la1poWnhTeHdQYUFBbkVsUTlrN0N1QVwiLFwiUTdTSFNGTEc2MThpemJ5U01wQXNGQXFnbk9MYVlneE5sd2ZGaE9BclwiKTsgLy9QQVNURSBIRVJFIFlPVVIgQmFjazRBcHAgQVBQTElDQVRJT04gSUQgQU5EIFlPVVIgSmF2YVNjcmlwdCBLRVlcclxuUGFyc2Uuc2VydmVyVVJMID0gYGh0dHBzOi8vJHtpcH06MTMzNy9wYXJzZWBcclxuLy9QYXJzZS5saXZlUXVlcnlTZXJ2ZXJVUkwgPSBgaHR0cHM6Ly8ke2lwfToxMzM3L3BhcnNlYFxyXG4vL1BhcnNlLnNlcnZlclVSTCA9ICdodHRwczovL3BhcnNlYXBpLmJhY2s0YXBwLmNvbS8nXHJcbi8vUGFyc2UubGl2ZVF1ZXJ5U2VydmVyVVJMID0gYHdzczovL3dlYmFwaXMuYmFjazRhcHAuaW9gXHJcbnJlbmRlcihcclxuICA8QXBwUHJvdmlkZXJzPlxyXG4gICAgPEFwcCAvPlxyXG4gIDwvQXBwUHJvdmlkZXJzPixcclxuXHJcbiAgZG9jdW1lbnQuYm9keVxyXG4pO1xyXG4iXSwibmFtZXMiOlsiZmV0Y2giLCJ0IiwiciIsInUiLCJpIiwibyIsImYiLCJjIiwiZSIsImEiLCJ2IiwibSIsIngiLCJwIiwicyIsIlQiLCJfIiwiZyIsImFjdGlvblR5cGVzIiwiQVBQX1JPVVRFX0NIQU5HRUQiLCJyZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwicm91dGUiLCJmZWF0dXJlUm91dGUiLCJBcHBSb3V0ZUNvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlQXBwUm91dGVDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkZlYXR1cmVSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJkaXNwYXRjaCIsImZpbmQiLCJ1c2VBcHBSb3V0ZSIsIm5hbWUiLCJvbkFwcFJvdXRlIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJBcHBSb3V0ZSIsIkFwcFJvdXRlUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwiZ2V0SXRlbSIsInBhcnNlIiwidmFsdWUiLCJ1c2VNZW1vIiwiU0VORElOR19IQU5HT1VUX1NUQVJURUQiLCJTRU5ESU5HX0hBTkdPVVRfRlVMTEZJTExFRCIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURFRF9NRVNTQUdFUyIsIlNFQVJDSF9JTlBVVF9DSEFOR0UiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiQ0xFQVJFRF9IQU5HT1VUIiwiRkVUQ0hfSEFOR09VVF9TVEFSVEVEIiwiRkVUQ0hfSEFOR09VVF9TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVF9GQUlMRUQiLCJFUlJPUl9SRUNJRVZFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiU0VSVkVSX01FU1NBR0VfUkVDSUVWRUQiLCJNRVNTQUdFU19VUERBVEVEIiwiSEFOR09VVFNfVVBEQVRFRCIsIkhBTkdPVVRfVVBEQVRFRCIsIlVOUkVBRF9IQU5HT1VUU19VUERBVEVEIiwiQ09OTkVDVElORyIsIk9QRU4iLCJDTE9TSU5HIiwiQ0xPU0VEIiwiU09DS0VUX1JFQURZIiwiU09DS0VUX0VSUk9SIiwiaGFuZ291dHMiLCJoYW5nb3V0IiwidW5yZWFkaGFuZ291dHMiLCJtZXNzYWdlcyIsInNlYXJjaCIsInVzZXIiLCJsb2FkaW5nIiwiZXJyb3IiLCJtZXNzYWdlVGV4dCIsIm9ubGluZSIsInNvY2tldCIsInJlYWR5U3RhdGUiLCJzb2NrZXRNZXNzYWdlIiwiZmV0Y2hIYW5nb3V0cyIsInBlbmRpbmdIYW5nb3V0IiwibWVzc2FnZSIsInRleHQiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIkZJTFRFUl9IQU5HT1VUUyIsImZpbHRlciIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJoYW5nb3V0U3RhdGVzIiwiSU5WSVRFUiIsIkFDQ0VQVEVSIiwiREVDTElORVIiLCJCTE9DS0VSIiwiVU5CTE9DS0VSIiwiTUVTU0FOR0VSIiwiSU5WSVRFRCIsIkFDQ0VQVEVEIiwiREVDTElORUQiLCJCTE9DS0VEIiwiVU5CTE9DS0VEIiwiTUVTU0FHRUQiLCJ1cGRhdGVEZWxpdmVyZWRIYW5nb3V0Iiwib2ZmbGluZSIsInRpbWVzdGFtcCIsImRlbGl2ZXJlZEhhbmdvdXQiLCJkZWxpdmVyZWQiLCJoYW5nb3V0S2V5IiwiaGFuZ291dEluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwidXBkYXRlRGVsaXZlcmVkTWVzc2FnZSIsInVwZGF0ZUJvY2tlZFN0YXRlIiwib2ZmbGluZUhhbmdvdXRLZXkiLCJvZmZsaW5laGFuZ291dHMiLCJkZWxpdmVyZWRNZXNzYWdlIiwibWVzc2FnZUtleSIsImJsb2NrZWRNZXNzYWdlIiwic2F2ZU1lc3NhZ2VkIiwic2F2ZUludml0ZWQiLCJzYXZlQWNjZXB0ZWQiLCJzYXZlRGVjbGluZWQiLCJzYXZlQmxvY2tlZCIsInNhdmVVbmJsb3ZrZWQiLCJzYXZlUmVjaWV2ZWRIYW5nb3V0IiwiZm9jdXNlZEhhbmdvdXQiLCJ1bnJlYWQiLCJoYW5nb3V0RXhpc3QiLCJoZyIsInJlYWQiLCJ1cGRhdGVkSGFuZ291dHMiLCJzYXZlUmVjaWV2ZWRNZXNzYWdlIiwic2F2ZVVucmVhZEhhbmdvdXQiLCJ1cGRhdGVkTWVzc2FnZXMiLCJ1bnJlYWRoYW5nb3V0c0tleSIsInVwZGF0ZWR1bnJlYWRzIiwic2F2ZUludml0ZXIiLCJzYXZlQWNjZXB0ZXIiLCJzYXZlQmxvY2tlciIsInNhdmVEZWNsaW5lciIsInNhdmVNZXNzYW5nZXIiLCJzYXZlVW5ibG9ja2VyIiwidXNlTWVzc2FnZSIsImhhbmRsZUFja25vd2xlZGdlbWVudCIsImhhbmRsZUhhbmdvdXQiLCJoYW5kbGVIYW5nb3V0cyIsImZvckVhY2giLCJsb2FkSGFuZ291dHMiLCJzZWxlY3RVbnJlYWQiLCJjaGFuZ2VNZXNzYWdlVGV4dCIsImxvYWRNZXNzYWdlcyIsImtleSIsIlZBTFVFX0NIQU5HRUQiLCJMT0dJTl9TVEFSVEVEIiwiTE9HSU5fU1VDQ0VTUyIsIkxPR0lOX0ZBSUxFRCIsIkxPR09VVCIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSIsIlNFUlZFUl9FUlJPUl9SRUNJRVZFRCIsIkNPTlNUUkFJTlRfVkFMSURBVElPTiIsImxvZ2luIiwic2lnbnVwIiwiY2hhbmdlUGFzc3dvcmQiLCJyZXF1ZXN0UGFzc0NoYW5nZSIsInZhbGlkYXRpb24iLCJpc1ZhbGlkIiwidW5kZWZpbmVkIiwiZW1haWwiLCJwYXNzd29yZCIsImNvbmZpcm0iLCJlbWFpbG9ydXNlcm5hbWUiLCJzdWNjZXNzIiwiY3VycmVudCIsInRva2VuIiwiYXV0aEZlZWRiYWNrIiwiYXV0aFJlZHVjZXIiLCJuZXh0U3RhdGUiLCJhY2NvdW50QWxyZWFkeUV4aXRzIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlQYXNzd29yZE5vdFZhbGlkIiwiZW1haWxvcnVzZXJuYW1lTm90VmFsaWQiLCJ1c2VybmFtZUlzTm90UmVnaXN0ZXJlZCIsInBhc3N3b3JkRG9Ob3RNYXRjaCIsInRva2VuRXhwaXJlZCIsInNlcnZlclZhbGlkYXRpb25SYW5nZSIsInN0YXR1cyIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIklOVkFMSURfVVNFUk5BTUUiLCJJTlZBTElEX0VNUFRZX1NUUklORyIsIklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwiLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiUEFTU1dPUkRTX0RPX05PVF9NQVRDSCIsIkFDQ09VTlRfQUxSRUFEWV9FWElTVFMiLCJSRVFVSVJFRF9GSUVMRCIsInNlcnZlclZhbGlkYXRpb24iLCJodHRwU3RhdHVzIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwicmVzcG9uc2UiLCJib2R5IiwiaGVhZGVycyIsIkNvbnRlbnRUeXBlIiwiQWNjZXB0IiwibWV0aG9kIiwicmVzdWx0IiwianNvbiIsIndpbmRvdyIsImVycm9ycyIsImZvcm1EaXNwYXRjaCIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwiZm9yZ290UGFzc3dvcmQiLCJOb2RlQXV0aFNlcnZpY2UiLCJhY3Rpb25zIiwiQXV0aEFkYXB0ZXIiLCJOb2RlQXV0aFNlcmljZSIsIkF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJ1c2VVc2VyTmFtZSIsInVzZXJOYW1lIiwic2V0VXNlcm5hbWUiLCJ1c2VTdGF0ZSIsInNldFRva2VuIiwic2V0RW1haWwiLCJvYmplY3RJZCIsInNldE9iamVjdElkIiwidXBkYXRlUmVhZEhhbmdvdXRzIiwibGVuZ3RoIiwidXBkYXRlZHVucmVhZCIsIm1hcCIsInVwZGF0ZVJlYWRNZXNzc2FnZXMiLCJIYW5nb3V0Q29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiSGFuZ291dHNQcm92aWRlciIsImhhbmRsZU1lc3NhZ2UiLCJ1cGRhdGVkIiwicGFzc3dvcmRSZWdleCIsImVtYWlsUmVnZXgiLCJ1c2VybmFtZVJlZ2V4IiwidmFsaWRhdGVFbWFpbENvbnN0cmFpbnQiLCJlbWFpbENvbnN0cmFpbnQiLCJSZWdFeHAiLCJ0ZXN0IiwidmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQiLCJwYXNzd29yZENvbnN0cmFpbnQiLCJ2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCIsInVzZXJuYW1lQ29uc3RyYWludCIsInZhbGlkYXRlRW1haWxPclVzZXJuYW1lIiwidXNlQXV0aCIsIm9uQ2hhbmdlIiwidGFyZ2V0Iiwib25Mb2dpbiIsIm9uU2lnbnVwIiwib25SZXF1ZXN0UGFzc3dvcmRDaGFuZ2UiLCJvblBhc3N3b3JkQ2hhbmdlIiwib25TaWduT3V0IiwicmVtb3ZlSXRlbSIsIm9uTG9naW5CbHVyIiwiY3YiLCJvblNpZ251cEJsdXIiLCJvbkNoYW5nZVBhc3NCbHVyIiwib25SZXF1ZXN0UGFzc0NoYW5nZUJsdXIiLCJvbkZvY3VzIiwiRSIsInciLCJDIiwibCIsIkEiLCJGIiwiTiIsIk0iLCJQIiwiaCIsIkQiLCJIIiwiJCIsInEiLCJMb2dpbiIsImxhenkiLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwiUHJvZmlsZSIsIkF1dGhGZWF0dXJlUm91dGVzIiwiU3VzcGVuc2UiLCJzYXZlUGVuZGluZ0hhbmdvdXQiLCJpc0Jsb2NrZXIiLCJzYXZlSGFuZ291dCIsInNhdmVNZXNzYWdlIiwiYmxvY2tlciIsIkRhdGUiLCJub3ciLCJmbG9hdCIsInNlbmRPZmZsaW5lSGFuZ291dHMiLCJvZmZsaW5lSGFuZ291dHMiLCJmb3JlRWFjaCIsInNlbmQiLCJjb21tYW5kIiwicmVtb3ZlSGFuZ291dEZyb21VbnJlYWQiLCJmaWx0ZXJlZEhhbmdvdXRzIiwidXNlSGFuZ291dHMiLCJhdXRoQ29udGV4dCIsInVzZXJzIiwib25SZW1vdmVVbnJlYWQiLCJpZCIsImN1cnJlbnRUYXJnZXQiLCJvbk5hdmlnYXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJvblNlbGVjdEhhbmdvdXQiLCJvblNlbGVjdFVucmVhZCIsIm9uU2VhcmNoSW5wdXQiLCJvbkZldGNoSGFuZ291dHMiLCJvbk1lc3NhZ2VUZXh0Iiwib25IYW5nb3V0IiwiU0VBUkNIX0lOUFVUX0NIQU5HRUQiLCJNRVNTQUdFX1JFQ0lFVkVEIiwib2siLCJXZWJTb2NrZXRDb250YWluZXIiLCJzZXRTb2NrZXQiLCJzb2NrZXRVcmwiLCJzb2NrIiwiV2ViU29ja2V0Iiwib25tZXNzYWdlIiwic2VydmVyTWVzc2FnZSIsIm1zZyIsImRhdGEiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsInNlbmRIYW5nb3V0IiwiSGFuZ291dEFkYXB0ZXIiLCJBcHBQcm92aWRlcnMiLCJpcCIsIk5hdmJhciIsImJnIiwiYnJhbmQiLCJOYXZCYXJDb2xsYXBzZSIsIk5hdkJhck5hdiIsIk5hdkl0ZW0iLCJOYXZMaW5rIiwiYXBwUm91dGUiLCJoYW5kbGVSb3V0ZSIsInByZXZlbnREZWZhdWx0IiwiTmF2IiwiaG9yaXpvbnRhbEFsaWdubWVudCIsIkFwcE5hdmlnYXRpb24iLCJIb21lIiwicGFkZGluZ1RvcCIsIkhhbmdvdXRzIiwiQXBwUm91dGVzIiwiaGVpZ2h0IiwiQXV0aEZhdHVyZVJvdXRlcyIsIkFwcCIsIlBhcnNlIiwiaW5pdGlhbGl6ZSIsInNlcnZlclVSTCIsInJlbmRlciIsImRvY3VtZW50Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE9BQU8sR0FBRztBQUNkLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixJQUFJLElBQUk7QUFDekMsRUFBRSxRQUFRLEVBQUUsUUFBUSxJQUFJLElBQUksSUFBSSxVQUFVLElBQUksTUFBTTtBQUNwRCxFQUFFLElBQUk7QUFDTixJQUFJLFlBQVksSUFBSSxJQUFJO0FBQ3hCLElBQUksTUFBTSxJQUFJLElBQUk7QUFDbEIsSUFBSSxDQUFDLFdBQVc7QUFDaEIsTUFBTSxJQUFJO0FBQ1YsUUFBUSxJQUFJLElBQUksR0FBRTtBQUNsQixRQUFRLE9BQU8sSUFBSTtBQUNuQixPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDbEIsUUFBUSxPQUFPLEtBQUs7QUFDcEIsT0FBTztBQUNQLEtBQUssR0FBRztBQUNSLEVBQUUsUUFBUSxFQUFFLFVBQVUsSUFBSSxJQUFJO0FBQzlCLEVBQUUsV0FBVyxFQUFFLGFBQWEsSUFBSSxJQUFJO0FBQ3BDLEVBQUM7QUFDRDtBQUNBLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUN6QixFQUFFLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztBQUNyRCxDQUFDO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7QUFDekIsRUFBRSxJQUFJLFdBQVcsR0FBRztBQUNwQixJQUFJLG9CQUFvQjtBQUN4QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLDRCQUE0QjtBQUNoQyxJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHNCQUFzQjtBQUMxQixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHNCQUFzQjtBQUMxQixJQUFJLHVCQUF1QjtBQUMzQixJQUFJLHVCQUF1QjtBQUMzQixJQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksaUJBQWlCO0FBQ3ZCLElBQUksV0FBVyxDQUFDLE1BQU07QUFDdEIsSUFBSSxTQUFTLEdBQUcsRUFBRTtBQUNsQixNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pGLE1BQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLGFBQWEsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsRUFBRSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNoQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFDO0FBQ3ZCLEdBQUc7QUFDSCxFQUFFLElBQUksMkJBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlDLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQztBQUNqRSxHQUFHO0FBQ0gsRUFBRSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDM0IsQ0FBQztBQUNEO0FBQ0EsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFFO0FBQy9CLEVBQUUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDakMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBQztBQUN6QixHQUFHO0FBQ0gsRUFBRSxPQUFPLEtBQUs7QUFDZCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRTtBQUM1QixFQUFFLElBQUksUUFBUSxHQUFHO0FBQ2pCLElBQUksSUFBSSxFQUFFLFdBQVc7QUFDckIsTUFBTSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFFO0FBQy9CLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEtBQUssU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7QUFDdEQsS0FBSztBQUNMLElBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ3hCLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXO0FBQzNDLE1BQU0sT0FBTyxRQUFRO0FBQ3JCLE1BQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sUUFBUTtBQUNqQixDQUFDO0FBQ0Q7QUFDTyxTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDakMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUU7QUFDZjtBQUNBLEVBQUUsSUFBSSxPQUFPLFlBQVksT0FBTyxFQUFFO0FBQ2xDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDMUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUM7QUFDOUIsS0FBSyxFQUFFLElBQUksRUFBQztBQUNaLEdBQUcsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDckMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsTUFBTSxFQUFFO0FBQ3JDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3ZDLEtBQUssRUFBRSxJQUFJLEVBQUM7QUFDWixHQUFHLE1BQU0sSUFBSSxPQUFPLEVBQUU7QUFDdEIsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxFQUFFO0FBQy9ELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDO0FBQ3RDLEtBQUssRUFBRSxJQUFJLEVBQUM7QUFDWixHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2pELEVBQUUsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUM7QUFDNUIsRUFBRSxLQUFLLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBQztBQUMvQixFQUFFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDO0FBQy9CLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUcsTUFBSztBQUM3RCxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQzdDLEVBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQztBQUN0QyxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLElBQUksRUFBRTtBQUN2QyxFQUFFLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxFQUFDO0FBQzVCLEVBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtBQUMvQyxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLElBQUksRUFBRTtBQUN2QyxFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JELEVBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUM5QyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBQztBQUN2RCxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDeEQsRUFBRSxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDN0IsSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZDLE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQ3hELEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsV0FBVztBQUNwQyxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDaEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNyQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQ3BCLEdBQUcsRUFBQztBQUNKLEVBQUUsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDO0FBQzNCLEVBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFdBQVc7QUFDdEMsRUFBRSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ2hCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssRUFBRTtBQUMvQixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDO0FBQ3JCLEdBQUcsRUFBQztBQUNKLEVBQUUsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDO0FBQzNCLEVBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFdBQVc7QUFDdkMsRUFBRSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ2hCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDckMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFDO0FBQzdCLEdBQUcsRUFBQztBQUNKLEVBQUUsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDO0FBQzNCLEVBQUM7QUFDRDtBQUNBLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUN0QixFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBTztBQUNoRSxDQUFDO0FBQ0Q7QUFDQSxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDeEIsRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDckIsSUFBSSxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEQsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFJO0FBQ3RCLENBQUM7QUFDRDtBQUNBLFNBQVMsZUFBZSxDQUFDLE1BQU0sRUFBRTtBQUNqQyxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9DLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXO0FBQy9CLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUM7QUFDNUIsTUFBSztBQUNMLElBQUksTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXO0FBQ2hDLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUM7QUFDMUIsTUFBSztBQUNMLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRDtBQUNBLFNBQVMscUJBQXFCLENBQUMsSUFBSSxFQUFFO0FBQ3JDLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEdBQUU7QUFDL0IsRUFBRSxJQUFJLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFDO0FBQ3ZDLEVBQUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBQztBQUNoQyxFQUFFLE9BQU8sT0FBTztBQUNoQixDQUFDO0FBQ0Q7QUFDQSxTQUFTLGNBQWMsQ0FBQyxJQUFJLEVBQUU7QUFDOUIsRUFBRSxJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsR0FBRTtBQUMvQixFQUFFLElBQUksT0FBTyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUM7QUFDdkMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBQztBQUN6QixFQUFFLE9BQU8sT0FBTztBQUNoQixDQUFDO0FBQ0Q7QUFDQSxTQUFTLHFCQUFxQixDQUFDLEdBQUcsRUFBRTtBQUNwQyxFQUFFLElBQUksSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsRUFBQztBQUNoQyxFQUFFLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUM7QUFDcEM7QUFDQSxFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQzNDLEdBQUc7QUFDSCxFQUFFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDdkIsQ0FBQztBQUNEO0FBQ0EsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQzFCLEVBQUUsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO0FBQ2pCLElBQUksT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2QixHQUFHLE1BQU07QUFDVCxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUM7QUFDN0MsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFDO0FBQ2pDLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTTtBQUN0QixHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsU0FBUyxJQUFJLEdBQUc7QUFDaEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQUs7QUFDdkI7QUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLEVBQUU7QUFDbEMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUk7QUFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2YsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUU7QUFDekIsS0FBSyxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ3pDLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFJO0FBQzNCLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbkUsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUk7QUFDM0IsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMzRSxNQUFNLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSTtBQUMvQixLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsWUFBWSxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3RGLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFFO0FBQ3RDLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDeEUsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUM7QUFDdEQ7QUFDQSxNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBQztBQUN4RCxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDOUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBQztBQUMvQyxLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDbEUsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDM0MsTUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNwQyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSwwQkFBMEIsRUFBQztBQUNwRSxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ3hELFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFDO0FBQzdELE9BQU8sTUFBTSxJQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDeEYsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsaURBQWlELEVBQUM7QUFDM0YsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtBQUNwQixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVztBQUMzQixNQUFNLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUM7QUFDbkMsTUFBTSxJQUFJLFFBQVEsRUFBRTtBQUNwQixRQUFRLE9BQU8sUUFBUTtBQUN2QixPQUFPO0FBQ1A7QUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUMxQixRQUFRLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQzlDLE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUN4QyxRQUFRLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDakUsT0FBTyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNyQyxRQUFRLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUM7QUFDL0QsT0FBTyxNQUFNO0FBQ2IsUUFBUSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUMxRCxPQUFPO0FBQ1AsTUFBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVc7QUFDbEMsTUFBTSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUNqQyxRQUFRLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sTUFBTTtBQUNiLFFBQVEsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDO0FBQ3RELE9BQU87QUFDUCxNQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVc7QUFDekIsSUFBSSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFDO0FBQ2pDLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDbEIsTUFBTSxPQUFPLFFBQVE7QUFDckIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDeEIsTUFBTSxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQzNDLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUN0QyxNQUFNLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMxRSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ25DLE1BQU0sTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQztBQUM3RCxLQUFLLE1BQU07QUFDWCxNQUFNLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQzVDLEtBQUs7QUFDTCxJQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUN4QixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVztBQUMvQixNQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDckMsTUFBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXO0FBQ3pCLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkMsSUFBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLElBQUk7QUFDYixDQUFDO0FBQ0Q7QUFDQTtBQUNBLElBQUksT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7QUFDakU7QUFDQSxTQUFTLGVBQWUsQ0FBQyxNQUFNLEVBQUU7QUFDakMsRUFBRSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFFO0FBQ3BDLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxNQUFNO0FBQ3pELENBQUM7QUFDRDtBQUNPLFNBQVMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDeEMsRUFBRSxPQUFPLEdBQUcsT0FBTyxJQUFJLEdBQUU7QUFDekIsRUFBRSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSTtBQUN6QjtBQUNBLEVBQUUsSUFBSSxLQUFLLFlBQVksT0FBTyxFQUFFO0FBQ2hDLElBQUksSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ3hCLE1BQU0sTUFBTSxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7QUFDekMsS0FBSztBQUNMLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBRztBQUN4QixJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFlBQVc7QUFDeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUMxQixNQUFNLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBQztBQUMvQyxLQUFLO0FBQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFNO0FBQzlCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSTtBQUMxQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU07QUFDOUIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO0FBQzFDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFTO0FBQzVCLE1BQU0sS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFJO0FBQzNCLEtBQUs7QUFDTCxHQUFHLE1BQU07QUFDVCxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBQztBQUM1QixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLGNBQWE7QUFDN0UsRUFBRSxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFDO0FBQy9DLEdBQUc7QUFDSCxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUM7QUFDdkUsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxLQUFJO0FBQy9DLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFNO0FBQzdDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFJO0FBQ3RCO0FBQ0EsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ2pFLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQywyQ0FBMkMsQ0FBQztBQUNwRSxHQUFHO0FBQ0gsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBQztBQUN0QixDQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxXQUFXO0FBQ3JDLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xELEVBQUM7QUFDRDtBQUNBLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUN0QixFQUFFLElBQUksSUFBSSxHQUFHLElBQUksUUFBUSxHQUFFO0FBQzNCLEVBQUUsSUFBSTtBQUNOLEtBQUssSUFBSSxFQUFFO0FBQ1gsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ2YsS0FBSyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUU7QUFDN0IsTUFBTSxJQUFJLEtBQUssRUFBRTtBQUNqQixRQUFRLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFDO0FBQ3BDLFFBQVEsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO0FBQ3BELFFBQVEsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztBQUN2RCxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUM7QUFDeEUsT0FBTztBQUNQLEtBQUssRUFBQztBQUNOLEVBQUUsT0FBTyxJQUFJO0FBQ2IsQ0FBQztBQUNEO0FBQ0EsU0FBUyxZQUFZLENBQUMsVUFBVSxFQUFFO0FBQ2xDLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLEdBQUU7QUFDN0I7QUFDQTtBQUNBLEVBQUUsSUFBSSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUM7QUFDbkUsRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxFQUFFO0FBQzVELElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxHQUFFO0FBQ2xDLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDYixNQUFNLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFFO0FBQ3hDLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFDO0FBQ2hDLEtBQUs7QUFDTCxHQUFHLEVBQUM7QUFDSixFQUFFLE9BQU8sT0FBTztBQUNoQixDQUFDO0FBQ0Q7QUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUM7QUFDNUI7QUFDTyxTQUFTLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQzVDLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixJQUFJLE9BQU8sR0FBRyxHQUFFO0FBQ2hCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFTO0FBQ3ZCLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxLQUFLLFNBQVMsR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU07QUFDbkUsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBRztBQUNuRCxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxHQUFHLEtBQUk7QUFDdkUsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUM7QUFDN0MsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRTtBQUM5QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFDO0FBQzFCLENBQUM7QUFDRDtBQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBQztBQUM3QjtBQUNBLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVc7QUFDdEMsRUFBRSxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDdEMsSUFBSSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07QUFDdkIsSUFBSSxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7QUFDL0IsSUFBSSxPQUFPLEVBQUUsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUN0QyxJQUFJLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztBQUNqQixHQUFHLENBQUM7QUFDSixFQUFDO0FBQ0Q7QUFDQSxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVc7QUFDNUIsRUFBRSxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBQztBQUNoRSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBTztBQUN6QixFQUFFLE9BQU8sUUFBUTtBQUNqQixFQUFDO0FBQ0Q7QUFDQSxJQUFJLGdCQUFnQixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBQztBQUNoRDtBQUNBLFFBQVEsQ0FBQyxRQUFRLEdBQUcsU0FBUyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQzFDLEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDL0MsSUFBSSxNQUFNLElBQUksVUFBVSxDQUFDLHFCQUFxQixDQUFDO0FBQy9DLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLEVBQUM7QUFDRDtBQUNPLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFZO0FBQzNDLElBQUk7QUFDSixFQUFFLElBQUksWUFBWSxHQUFFO0FBQ3BCLENBQUMsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNkLEVBQUUsWUFBWSxHQUFHLFNBQVMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUN6QyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBTztBQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSTtBQUNwQixJQUFJLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUM7QUFDOUIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFLO0FBQzVCLElBQUc7QUFDSCxFQUFFLFlBQVksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFDO0FBQ3pELEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsYUFBWTtBQUNuRCxDQUFDO0FBQ0Q7QUFDTyxTQUFTQSxPQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNuQyxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9DLElBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksRUFBQztBQUMxQztBQUNBLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ2xELE1BQU0sT0FBTyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzlELEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEdBQUU7QUFDbEM7QUFDQSxJQUFJLFNBQVMsUUFBUSxHQUFHO0FBQ3hCLE1BQU0sR0FBRyxDQUFDLEtBQUssR0FBRTtBQUNqQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsV0FBVztBQUM1QixNQUFNLElBQUksT0FBTyxHQUFHO0FBQ3BCLFFBQVEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO0FBQzFCLFFBQVEsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVO0FBQ2xDLFFBQVEsT0FBTyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDaEUsUUFBTztBQUNQLE1BQU0sT0FBTyxDQUFDLEdBQUcsR0FBRyxhQUFhLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFDO0FBQ2pHLE1BQU0sSUFBSSxJQUFJLEdBQUcsVUFBVSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxhQUFZO0FBQ3BFLE1BQU0sT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBQztBQUMxQyxNQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUM3QixNQUFNLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFDO0FBQ3JELE1BQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLFNBQVMsR0FBRyxXQUFXO0FBQy9CLE1BQU0sTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLEVBQUM7QUFDckQsTUFBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsT0FBTyxHQUFHLFdBQVc7QUFDN0IsTUFBTSxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxFQUFDO0FBQ3ZELE1BQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFDO0FBQy9DO0FBQ0EsSUFBSSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO0FBQzNDLE1BQU0sR0FBRyxDQUFDLGVBQWUsR0FBRyxLQUFJO0FBQ2hDLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssTUFBTSxFQUFFO0FBQy9DLE1BQU0sR0FBRyxDQUFDLGVBQWUsR0FBRyxNQUFLO0FBQ2pDLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxjQUFjLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDL0MsTUFBTSxHQUFHLENBQUMsWUFBWSxHQUFHLE9BQU07QUFDL0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDbEQsTUFBTSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBQztBQUN2QyxLQUFLLEVBQUM7QUFDTjtBQUNBLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3hCLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFDO0FBQ3hEO0FBQ0EsTUFBTSxHQUFHLENBQUMsa0JBQWtCLEdBQUcsV0FBVztBQUMxQztBQUNBLFFBQVEsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtBQUNsQyxVQUFVLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQztBQUMvRCxTQUFTO0FBQ1QsUUFBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLE9BQU8sQ0FBQyxTQUFTLEtBQUssV0FBVyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFDO0FBQ2pGLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRDtBQUNBQSxPQUFLLENBQUMsUUFBUSxHQUFHLEtBQUk7QUFDckI7QUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNqQixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUdBLFFBQUs7QUFDcEIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQU87QUFDeEIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQU87QUFDeEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVE7QUFDMUI7O0FDbmdCRyxJQUFDLENBQUMsQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDhEQUE4RCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLHlCQUF5QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBNEssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQXVELENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBNS9SLElBQUlDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxFQUFFLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNQLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDQSxHQUFDLENBQUMsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDUixHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSixHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUF3TyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNSLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQWtELFNBQVNjLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUNPLEdBQUMsQ0FBQ1IsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBeU4sU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1AsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHQSxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNjLEdBQUMsQ0FBQyxDQUFDZCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNlLEdBQUMsQ0FBQyxDQUFDZixHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUQsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxF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SSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxJQUFJQyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ELEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFQSxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDRSxDQUFDLENBQUMsQ0FBb1QsSUFBSUMsR0FBQyxDQUFDbFMsQ0FBQyxDQUFDLEdBQUcsQ0FBK0tBLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDa1MsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBSSxJQUFpUkMsR0FBQyxDQUFDblMsQ0FBQyxDQUFDLElBQUksU0FBU29TLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ04sR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQ00sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxTQUFTQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPalMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUNKLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUNtUyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJRixDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNELEdBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDaFMsQ0FBQyxDQUFDNlIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJSyxHQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUlMLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDSSxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNELEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQW9lLElBQUlFLEdBQUMsQ0FBQyxrT0FBa08sQ0FBQ1AsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsSUFBSVEsR0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUE2TSxJQUFJLENBQUMsQ0FBQ3pTLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUkwUyxHQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMzUyxDQUFDLENBQUMsS0FBSyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQ3lTLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUdDLEdBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLEdBQUdILENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUNHLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDOztBQ0kxN00sTUFBTUMsS0FBSyxHQUFHQyxDQUFJLENBQUMsTUFBTSxPQUFPLHFCQUFQLENBQVAsQ0FBbEI7QUFDQSxNQUFNQyxjQUFjLEdBQUdELENBQUksQ0FBQyxNQUFNLE9BQU8sOEJBQVAsQ0FBUCxDQUEzQjtBQUNBLE1BQU1FLGNBQWMsR0FBR0YsQ0FBSSxDQUFDLE1BQU0sT0FBTyw4QkFBUCxDQUFQLENBQTNCO0FBQ0EsTUFBTUcsTUFBTSxHQUFHSCxDQUFJLENBQUMsTUFBTSxPQUFPLHNCQUFQLENBQVAsQ0FBbkI7QUFDQSxNQUFNSSxPQUFPLEdBQUdKLENBQUksQ0FBQyxNQUFNLE9BQU8sdUJBQVAsQ0FBUCxDQUFwQjtBQUVlLFNBQVNLLGlCQUFULEdBQTZCO0FBQzFDLFFBQU07QUFBQ3JCLElBQUFBLE9BQUQ7QUFBU1gsSUFBQUEsT0FBVDtBQUFpQk0sSUFBQUEsV0FBakI7QUFBNkJFLElBQUFBLFlBQTdCO0FBQTBDQyxJQUFBQSxnQkFBMUM7QUFBMkRDLElBQUFBLHVCQUEzRDtBQUFtRlQsSUFBQUEsUUFBbkY7QUFBNEZDLElBQUFBLHVCQUE1RjtBQUFvSEMsSUFBQUEsZ0JBQXBIO0FBQXNJTCxJQUFBQSxRQUF0STtBQUErSXJRLElBQUFBO0FBQS9JLE1BQXNKb1EsT0FBTyxFQUFuSztBQUVBLFNBQU8sQ0FDTCxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUNvQyxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLGNBQUQsZUFBcUJ4UyxLQUFyQjtBQUE0QixJQUFBLE9BQU8sRUFBRWtSLE9BQXJDO0FBQThDLElBQUEsTUFBTSxFQUFFRixnQkFBdEQ7QUFBd0UsSUFBQSxRQUFRLEVBQUVYLFFBQWxGO0FBQTRGLElBQUEsZ0JBQWdCLEVBQUVLO0FBQTlHLEtBREYsQ0FERixDQURLLEVBTUwsRUFBQyxZQUFEO0FBQWMsSUFBQSxJQUFJLEVBQUM7QUFBbkIsS0FDRSxFQUFDOEIsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxLQUFELGVBQVd4UyxLQUFYO0FBQWtCLElBQUEsT0FBTyxFQUFFa1IsT0FBM0I7QUFBb0MsSUFBQSxNQUFNLEVBQUVMLFdBQTVDO0FBQXlELElBQUEsUUFBUSxFQUFFUixRQUFuRTtBQUE2RSxJQUFBLE9BQU8sRUFBRUU7QUFBdEYsS0FERixDQURGLENBTkssRUFXTCxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUNpQyxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLE1BQUQsZUFBWXhTLEtBQVo7QUFBbUIsSUFBQSxPQUFPLEVBQUVrUixPQUE1QjtBQUFxQyxJQUFBLE1BQU0sRUFBRUgsWUFBN0M7QUFBMkQsSUFBQSxRQUFRLEVBQUVWLFFBQXJFO0FBQThFLElBQUEsUUFBUSxFQUFFRztBQUF4RixLQURGLENBREYsQ0FYSyxFQWdCTCxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUNnQyxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLGNBQUQsZUFBb0J4UyxLQUFwQjtBQUEyQixJQUFBLE9BQU8sRUFBRWtSLE9BQXBDO0FBQTZDLElBQUEsTUFBTSxFQUFFRCx1QkFBckQ7QUFBOEUsSUFBQSxRQUFRLEVBQUVaLFFBQXhGO0FBQWtHLElBQUEsdUJBQXVCLEVBQUVJO0FBQTNILEtBREYsQ0FERixDQWhCSyxFQXFCTCxFQUFDLFlBQUQ7QUFBYyxJQUFBLElBQUksRUFBQztBQUFuQixLQUNFLEVBQUMrQixDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLE9BQUQsT0FERixDQURGLENBckJLLENBQVA7QUEyQkQ7O0FDdkNNLFNBQVNDLGtCQUFULENBQTRCO0FBQUV6UixFQUFBQSxRQUFGO0FBQVlHLEVBQUFBLElBQVo7QUFBa0J3QyxFQUFBQSxPQUFsQjtBQUEyQlEsRUFBQUEsTUFBM0I7QUFBa0N1TyxFQUFBQTtBQUFsQyxDQUE1QixFQUEyRTtBQUVoRixRQUFNO0FBQUU1TixJQUFBQSxRQUFGO0FBQVlMLElBQUFBO0FBQVosTUFBd0JkLE9BQTlCO0FBQ0EsTUFBSXVDLFVBQVUsR0FBRyxFQUFqQjtBQUNBLE1BQUlTLFVBQVUsR0FBRyxFQUFqQjs7QUFDQSxNQUFJeEMsTUFBSixFQUFZO0FBRVYrQixJQUFBQSxVQUFVLEdBQUksR0FBRS9FLElBQUssV0FBckI7QUFDQXdGLElBQUFBLFVBQVUsR0FBSSxHQUFFeEYsSUFBSyxJQUFHMkQsUUFBUyxXQUFqQztBQUNELEdBSkQsTUFJTztBQUVMb0IsSUFBQUEsVUFBVSxHQUFJLEdBQUUvRSxJQUFLLG1CQUFyQjtBQUNBd0YsSUFBQUEsVUFBVSxHQUFJLEdBQUV4RixJQUFLLElBQUcyRCxRQUFTLG1CQUFqQztBQUNEOztBQUVENk4sRUFBQUEsV0FBVyxDQUFDO0FBQUV6TSxJQUFBQSxVQUFGO0FBQWNwQixJQUFBQSxRQUFkO0FBQXdCbkIsSUFBQUEsT0FBeEI7QUFBZ0MzQyxJQUFBQTtBQUFoQyxHQUFELENBQVg7O0FBQ0EsTUFBSXlELE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxJQUFSLEtBQWdCLEVBQS9CLEVBQW1DO0FBQ2pDa08sSUFBQUEsV0FBVyxDQUFDO0FBQUVqTSxNQUFBQSxVQUFGO0FBQWM3QixNQUFBQSxRQUFkO0FBQXdCTCxNQUFBQSxPQUF4QjtBQUFnQ3pELE1BQUFBLFFBQWhDO0FBQXlDMFIsTUFBQUE7QUFBekMsS0FBRCxDQUFYO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTQyxXQUFULENBQXFCO0FBQUV6TSxFQUFBQSxVQUFGO0FBQWNwQixFQUFBQSxRQUFkO0FBQXdCbkIsRUFBQUEsT0FBeEI7QUFBZ0MzQyxFQUFBQTtBQUFoQyxDQUFyQixFQUFpRTtBQUMvRCxRQUFNMEMsUUFBUSxHQUFHbkMsSUFBSSxDQUFDUSxLQUFMLENBQVdWLFlBQVksQ0FBQ1MsT0FBYixDQUFxQm9FLFVBQXJCLENBQVgsQ0FBakI7QUFDQSxNQUFJdUIsZUFBZSxHQUFHLElBQXRCOztBQUNBLE1BQUkvRCxRQUFKLEVBQWM7QUFFWixVQUFNeUMsWUFBWSxHQUFHekMsUUFBUSxDQUFDMEMsU0FBVCxDQUFvQnhHLENBQUQsSUFBT0EsQ0FBQyxDQUFDa0YsUUFBRixLQUFlQSxRQUF6QyxDQUFyQjtBQUNDcEIsSUFBQUEsUUFBUSxDQUFDMkMsTUFBVCxDQUFnQkYsWUFBaEIsRUFBOEIsQ0FBOUIsRUFBaUN4QyxPQUFqQztBQUNBdEMsSUFBQUEsWUFBWSxDQUFDQyxPQUFiLENBQXFCNEUsVUFBckIsRUFBaUMzRSxJQUFJLENBQUNDLFNBQUwsQ0FBZWtDLFFBQWYsQ0FBakM7QUFDQTFDLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ29ELGdCQUFwQjtBQUFzQ1MsTUFBQUE7QUFBdEMsS0FBRCxDQUFSO0FBQ0YsR0FORCxNQU1PO0FBRUwrRCxJQUFBQSxlQUFlLEdBQUcsQ0FBQzlELE9BQUQsQ0FBbEI7QUFDQXRDLElBQUFBLFlBQVksQ0FBQ0MsT0FBYixDQUFxQjRFLFVBQXJCLEVBQWlDM0UsSUFBSSxDQUFDQyxTQUFMLENBQWVpRyxlQUFmLENBQWpDO0FBQ0F6RyxJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUNvRCxnQkFBcEI7QUFBc0NTLE1BQUFBLFFBQVEsRUFBRStEO0FBQWhELEtBQUQsQ0FBUjtBQUNEO0FBRUY7O0FBRU0sU0FBU21MLFdBQVQsQ0FBcUI7QUFBRWpNLEVBQUFBLFVBQUY7QUFBY2xDLEVBQUFBLE9BQWQ7QUFBc0J6RCxFQUFBQSxRQUF0QjtBQUErQjBSLEVBQUFBO0FBQS9CLENBQXJCLEVBQWlFO0FBQ3RFLFFBQU03TyxRQUFRLEdBQUd0QyxJQUFJLENBQUNRLEtBQUwsQ0FBV1YsWUFBWSxDQUFDUyxPQUFiLENBQXFCNkUsVUFBckIsQ0FBWCxDQUFqQjtBQUNBLE1BQUlpQixlQUFlLEdBQUcsRUFBdEI7O0FBQ0EsTUFBSS9ELFFBQUosRUFBYztBQUVaK0QsSUFBQUEsZUFBZSxHQUFHLENBQUMsR0FBRy9ELFFBQUosRUFBY1ksT0FBZCxDQUFsQjtBQUNELEdBSEQsTUFHTztBQUVMbUQsSUFBQUEsZUFBZSxHQUFHLENBQUNuRCxPQUFELENBQWxCO0FBQ0Q7O0FBQ0QsTUFBR2lPLFNBQUgsRUFBYTtBQUVYLFVBQU1HLE9BQU8sR0FBRSxDQUFDLEdBQUdqTCxlQUFKLEVBQW9CO0FBQUNsRCxNQUFBQSxJQUFJLEVBQUMsd0RBQU47QUFDbENxQixNQUFBQSxTQUFTLEVBQUUrTSxJQUFJLENBQUNDLEdBQUwsRUFEdUI7QUFDWjdTLE1BQUFBLElBQUksRUFBQyxTQURPO0FBQ0c0RSxNQUFBQSxRQUFRLEVBQUNMLE9BQU8sQ0FBQ0ssUUFEcEI7QUFDNkJrTyxNQUFBQSxLQUFLLEVBQUM7QUFEbkMsS0FBcEIsQ0FBZjtBQUVBM1IsSUFBQUEsWUFBWSxDQUFDQyxPQUFiLENBQXFCcUYsVUFBckIsRUFBaUNwRixJQUFJLENBQUNDLFNBQUwsQ0FBZXFSLE9BQWYsQ0FBakM7QUFDQTdSLElBQUFBLFFBQVEsQ0FBQztBQUFFZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ21ELGdCQUFwQjtBQUFzQ2EsTUFBQUEsUUFBUSxFQUFFZ1A7QUFBaEQsS0FBRCxDQUFSO0FBRUQsR0FQRCxNQVFJO0FBRUZ4UixJQUFBQSxZQUFZLENBQUNDLE9BQWIsQ0FBcUJxRixVQUFyQixFQUFpQ3BGLElBQUksQ0FBQ0MsU0FBTCxDQUFlb0csZUFBZixDQUFqQztBQUNBNUcsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDbUQsZ0JBQXBCO0FBQXNDYSxNQUFBQSxRQUFRLEVBQUUrRDtBQUFoRCxLQUFELENBQVI7QUFDRDtBQUdGOztBQ2hFTSxTQUFTcUwsbUJBQVQsQ0FBNkI7QUFBRTdPLEVBQUFBLE1BQUY7QUFBVWpELEVBQUFBO0FBQVYsQ0FBN0IsRUFBK0M7QUFDcEQsUUFBTXFGLGlCQUFpQixHQUFJLEdBQUVyRixJQUFLLG1CQUFsQztBQUNBLFFBQU0rUixlQUFlLEdBQUczUixJQUFJLENBQUNRLEtBQUwsQ0FBV1YsWUFBWSxDQUFDUyxPQUFiLENBQXFCMEUsaUJBQXJCLENBQVgsQ0FBeEI7O0FBQ0EsTUFBSTBNLGVBQUosRUFBcUI7QUFDbkJBLElBQUFBLGVBQWUsQ0FBQ0MsUUFBaEIsQ0FBMEJ2QixDQUFELElBQU87QUFDOUJ4TixNQUFBQSxNQUFNLENBQUNnUCxJQUFQLENBQ0U3UixJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUNic0QsUUFBQUEsUUFBUSxFQUFFOE0sQ0FBQyxDQUFDOU0sUUFEQztBQUViMEYsUUFBQUEsS0FBSyxFQUFFb0gsQ0FBQyxDQUFDcEgsS0FGSTtBQUdiL0YsUUFBQUEsT0FBTyxFQUFFbU4sQ0FBQyxDQUFDbk4sT0FIRTtBQUlic0IsUUFBQUEsU0FBUyxFQUFFNkwsQ0FBQyxDQUFDN0wsU0FKQTtBQUtic04sUUFBQUEsT0FBTyxFQUFFekIsQ0FBQyxDQUFDNVIsS0FMRTtBQU1iOEYsUUFBQUEsT0FBTyxFQUFFO0FBTkksT0FBZixDQURGO0FBVUQsS0FYRDtBQVlEOztBQUNEO0FBQ0Q7O0FDbEJNLFNBQVN3Tix1QkFBVCxDQUFpQztBQUFDblMsRUFBQUEsSUFBRDtBQUFPd0MsRUFBQUEsT0FBUDtBQUFlM0MsRUFBQUE7QUFBZixDQUFqQyxFQUEwRDtBQUM3RCxRQUFNO0FBQUU4RCxJQUFBQTtBQUFGLE1BQWVuQixPQUFyQjtBQUNBLE1BQUlrRSxpQkFBaUIsR0FBSSxHQUFFMUcsSUFBSyxrQkFBaEM7QUFDQSxNQUFJeUMsY0FBYyxHQUFHckMsSUFBSSxDQUFDUSxLQUFMLENBQVdWLFlBQVksQ0FBQ1MsT0FBYixDQUFxQitGLGlCQUFyQixDQUFYLENBQXJCO0FBRUk7QUFDRSxRQUFNMEwsZ0JBQWdCLEdBQUczUCxjQUFjLENBQUNpQixNQUFmLENBQXNCLFVBQVN3QyxNQUFULEVBQWtCO0FBQy9ELFdBQVFBLE1BQU0sQ0FBQ3ZDLFFBQVAsS0FBb0JBLFFBQTVCO0FBQXFDLEdBRGQsQ0FBekI7O0FBR0UsTUFBR3lPLGdCQUFnQixDQUFDeEUsTUFBakIsR0FBd0IsQ0FBM0IsRUFBNkI7QUFDM0I7QUFDQTFOLElBQUFBLFlBQVksQ0FBQ0MsT0FBYixDQUFxQnVHLGlCQUFyQixFQUF3Q3RHLElBQUksQ0FBQ0MsU0FBTCxDQUFlK1IsZ0JBQWYsQ0FBeEM7QUFDQXZTLElBQUFBLFFBQVEsQ0FBQztBQUNQZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3NELHVCQURYO0FBRVBTLE1BQUFBLGNBQWMsRUFBRTJQO0FBRlQsS0FBRCxDQUFSO0FBSUQsR0FQRCxNQVNJO0FBQ0Y7QUFDQWxTLElBQUFBLFlBQVksQ0FBQ3VQLFVBQWIsQ0FBd0IvSSxpQkFBeEI7QUFDQTdHLElBQUFBLFFBQVEsQ0FBQztBQUNMZCxNQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ3NELHVCQURiO0FBRUxTLE1BQUFBLGNBQWMsRUFBRTtBQUZYLEtBQUQsQ0FBUjtBQUlFO0FBR0g7QUFHWjs7QUNkTSxTQUFTNFAsV0FBVCxHQUF1QjtBQUM1QixRQUFNO0FBQUVwUyxJQUFBQTtBQUFGLE1BQWlCRixXQUFXLEVBQWxDO0FBQ0EsUUFBTXVTLFdBQVcsR0FBR3JGLGNBQWMsRUFBbEM7QUFDQSxRQUFPdEosUUFBUSxHQUFJMk8sV0FBVyxDQUFDelQsS0FBWixDQUFrQitELElBQWxCLElBQXlCMFAsV0FBVyxDQUFDelQsS0FBWixDQUFrQitELElBQWxCLENBQXVCZSxRQUFuRTtBQUNBLFFBQU0sQ0FBQzlFLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JvTyxpQkFBaUIsRUFBM0M7QUFDQSxRQUFNO0FBQ0p6TCxJQUFBQSxPQURJO0FBRUpELElBQUFBLFFBRkk7QUFHSkksSUFBQUEsTUFISTtBQUlKNFAsSUFBQUEsS0FKSTtBQUtKeFAsSUFBQUEsV0FMSTtBQU1KTCxJQUFBQSxRQU5JO0FBT0pRLElBQUFBLFVBUEk7QUFTSlQsSUFBQUE7QUFUSSxNQVVGNUQsS0FWSjtBQVlBNkIsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFDZCxRQUFLd0MsVUFBVSxLQUFLLENBQWYsSUFBb0JTLFFBQXpCLEVBQW1DO0FBQ2pDbU8sTUFBQUEsbUJBQW1CLENBQUM7QUFBRTlSLFFBQUFBLElBQUksRUFBRTJELFFBQVI7QUFBa0I5RCxRQUFBQTtBQUFsQixPQUFELENBQW5CO0FBQ0Q7QUFDRixHQUpRLEVBSU4sQ0FBQ3FELFVBQUQsRUFBYVMsUUFBYixDQUpNLENBQVQ7O0FBTUEsV0FBUzZPLGNBQVQsQ0FBd0J4VSxDQUF4QixFQUEwQjtBQUN4QixVQUFNeVUsRUFBRSxHQUFFelUsQ0FBQyxDQUFDMFUsYUFBRixDQUFnQkQsRUFBMUI7QUFDQSxVQUFNalEsT0FBTyxHQUFHRCxRQUFRLENBQUN6QyxJQUFULENBQWVyQixDQUFELElBQU9BLENBQUMsQ0FBQ2tGLFFBQUYsS0FBZThPLEVBQXBDLENBQWhCO0FBRUFOLElBQUFBLHVCQUF1QixDQUFDO0FBQUNuUyxNQUFBQSxJQUFJLEVBQUMyRCxRQUFOO0FBQWU5RCxNQUFBQSxRQUFmO0FBQXdCMkMsTUFBQUE7QUFBeEIsS0FBRCxDQUF2QjtBQUNEOztBQUNELFdBQVNtUSxZQUFULENBQXNCM1UsQ0FBdEIsRUFBd0I7QUFDdEJBLElBQUFBLENBQUMsQ0FBQzRVLGVBQUYsR0FEc0I7O0FBR3RCLFVBQU1ILEVBQUUsR0FBRXpVLENBQUMsQ0FBQzBVLGFBQUYsQ0FBZ0JELEVBQTFCO0FBRUF4UyxJQUFBQSxVQUFVLENBQUM7QUFBRWhCLE1BQUFBLFlBQVksRUFBRyxJQUFHd1QsRUFBRyxFQUF2QjtBQUEwQnpULE1BQUFBLEtBQUssRUFBRTtBQUFqQyxLQUFELENBQVY7QUFDRDs7QUFFRCxXQUFTNlQsZUFBVCxDQUF5QjdVLENBQXpCLEVBQTRCO0FBQzFCLFVBQU0yRixRQUFRLEdBQUczRixDQUFDLENBQUNtUixNQUFGLENBQVNzRCxFQUExQjtBQUNBLFVBQU1qUSxPQUFPLEdBQUdELFFBQVEsQ0FBQ3pDLElBQVQsQ0FBZXJCLENBQUQsSUFBT0EsQ0FBQyxDQUFDa0YsUUFBRixLQUFlQSxRQUFwQyxDQUFoQjtBQUNBOUQsSUFBQUEsUUFBUSxDQUFDO0FBQUNkLE1BQUFBLElBQUksRUFBQ0wsYUFBVyxDQUFDMkMsZ0JBQWxCO0FBQW9DbUIsTUFBQUE7QUFBcEMsS0FBRCxDQUFSO0FBQ0Q7O0FBQ0QsV0FBU3NRLGNBQVQsQ0FBd0I5VSxDQUF4QixFQUEyQjtBQUN6QixVQUFNMkYsUUFBUSxHQUFHM0YsQ0FBQyxDQUFDbVIsTUFBRixDQUFTc0QsRUFBMUI7QUFHQSxVQUFNalEsT0FBTyxHQUFHRCxRQUFRLENBQUN6QyxJQUFULENBQWVyQixDQUFELElBQU9BLENBQUMsQ0FBQ2tGLFFBQUYsS0FBZUEsUUFBcEMsQ0FBaEI7QUFDQTZELElBQUFBLFlBQVksQ0FBQztBQUFFM0gsTUFBQUEsUUFBRjtBQUFZMkMsTUFBQUE7QUFBWixLQUFELENBQVo7QUFDQXZDLElBQUFBLFVBQVUsQ0FBQztBQUFFaEIsTUFBQUEsWUFBWSxFQUFHLElBQUd1RCxPQUFPLENBQUMzRCxLQUFNLEVBQWxDO0FBQXFDRyxNQUFBQSxLQUFLLEVBQUU7QUFBNUMsS0FBRCxDQUFWO0FBQ0Q7O0FBRUQsV0FBUytULGFBQVQsQ0FBdUIvVSxDQUF2QixFQUEwQjtBQUN4QjZCLElBQUFBLFFBQVEsQ0FBQztBQUFDZCxNQUFBQSxJQUFJLEVBQUNMLGFBQVcsQ0FBQzBDLG1CQUFsQjtBQUF1Q3VCLE1BQUFBLE1BQU0sRUFBRTNFLENBQUMsQ0FBQ21SLE1BQUYsQ0FBU3RPO0FBQXhELEtBQUQsQ0FBUjtBQUNEOztBQUVELFdBQVNtUyxlQUFULEdBQTBCO0FBRXhCblQsSUFBQUEsUUFBUSxDQUFDO0FBQUNkLE1BQUFBLElBQUksRUFBQ0wsYUFBVyxDQUFDNkM7QUFBbEIsS0FBRCxDQUFSO0FBQ0Q7O0FBR0QsV0FBUzBSLGFBQVQsQ0FBdUJqVixDQUF2QixFQUEwQjtBQUN4QixVQUFNdUYsSUFBSSxHQUFHdkYsQ0FBQyxDQUFDbVIsTUFBRixDQUFTdE8sS0FBdEI7QUFDQTRHLElBQUFBLGlCQUFpQixDQUFDO0FBQUU1SCxNQUFBQSxRQUFGO0FBQVkwRCxNQUFBQTtBQUFaLEtBQUQsQ0FBakI7QUFDRDs7QUFDRCxXQUFTMlAsU0FBVCxDQUFtQmxWLENBQW5CLEVBQXNCO0FBRXBCeUosSUFBQUEsaUJBQWlCLENBQUM7QUFBRWxFLE1BQUFBLElBQUksRUFBRSxFQUFSO0FBQVkxRCxNQUFBQTtBQUFaLEtBQUQsQ0FBakI7QUFDQSxVQUFNcVMsT0FBTyxHQUFHbFUsQ0FBQyxDQUFDbVIsTUFBRixDQUFTc0QsRUFBekI7QUFDQSxVQUFNO0FBQUVwSixNQUFBQTtBQUFGLFFBQVk3RyxPQUFsQjtBQUNBLFVBQU1vQyxTQUFTLEdBQUcrTSxJQUFJLENBQUNDLEdBQUwsRUFBbEI7QUFDQSxVQUFNdE8sT0FBTyxHQUNYUCxXQUFXLEtBQUssRUFBaEIsR0FBcUI7QUFBRVEsTUFBQUEsSUFBSSxFQUFFUixXQUFSO0FBQXFCNkIsTUFBQUE7QUFBckIsS0FBckIsR0FBd0QsSUFEMUQ7QUFHQSxRQUFJNUIsTUFBTSxHQUFHLElBQWI7QUFDQSxRQUFJdU8sU0FBUyxHQUFFLEtBQWYsQ0FWb0I7O0FBY2xCLFFBQUcvTyxPQUFPLENBQUMzRCxLQUFSLEtBQWlCLFNBQXBCLEVBQThCO0FBRTVCMFMsTUFBQUEsU0FBUyxHQUFDLElBQVY7QUFDRDs7QUFDRCxVQUFNbE8sY0FBYyxHQUFFO0FBQ3BCTSxNQUFBQSxRQUFRLEVBQUVuQixPQUFPLENBQUNtQixRQURFO0FBRXBCMEYsTUFBQUEsS0FGb0I7QUFHcEIvRixNQUFBQSxPQUhvQjtBQUlwQjRPLE1BQUFBLE9BSm9CO0FBS3BCdE4sTUFBQUE7QUFMb0IsS0FBdEI7QUFPQS9FLElBQUFBLFFBQVEsQ0FBQztBQUFDZCxNQUFBQSxJQUFJLEVBQUNMLGFBQVcsQ0FBQ3FDLHVCQUFsQjtBQUEyQ3NDLE1BQUFBO0FBQTNDLEtBQUQsQ0FBUixDQXpCa0I7QUEyQnBCO0FBQ0E7O0FBR0FpTyxJQUFBQSxrQkFBa0IsQ0FBQztBQUNqQnpSLE1BQUFBLFFBRGlCO0FBRWpCRyxNQUFBQSxJQUFJLEVBQUUyRCxRQUZXO0FBR2pCbkIsTUFBQUEsT0FBTyxFQUFFO0FBQ1BtQixRQUFBQSxRQUFRLEVBQUVuQixPQUFPLENBQUNtQixRQURYO0FBRVAwRixRQUFBQSxLQUZPO0FBR1B4SyxRQUFBQSxLQUFLLEVBQUVxVCxPQUhBO0FBSVA1TyxRQUFBQSxPQUFPLEVBQUU7QUFBRUMsVUFBQUEsSUFBSSxFQUFFUixXQUFSO0FBQXFCNkIsVUFBQUEsU0FBckI7QUFBZ0NFLFVBQUFBLFNBQVMsRUFBRSxLQUEzQztBQUFrRG5CLFVBQUFBO0FBQWxELFNBSkY7QUFLUGlCLFFBQUFBLFNBTE87QUFNUEUsUUFBQUEsU0FBUyxFQUFFO0FBTkosT0FIUTtBQVdqQjlCLE1BQUFBLE1BWGlCO0FBWWpCdU8sTUFBQUE7QUFaaUIsS0FBRCxDQUFsQjtBQWNELEdBOUcyQjs7O0FBK0c1QixTQUFPO0FBQ0wxUyxJQUFBQSxLQURLO0FBRUw4VCxJQUFBQSxZQUZLO0FBR0xHLElBQUFBLGNBSEs7QUFJTEcsSUFBQUEsYUFKSztBQUtMbFEsSUFBQUEsV0FMSztBQU1MZ1EsSUFBQUEsYUFOSztBQU9MQyxJQUFBQSxlQVBLO0FBUUxyUSxJQUFBQSxNQVJLO0FBU0xrUSxJQUFBQSxlQVRLO0FBVUxoVCxJQUFBQSxRQVZLO0FBV0wyQyxJQUFBQSxPQVhLO0FBWUxELElBQUFBLFFBWks7QUFhTGdRLElBQUFBLEtBYks7QUFjTDVPLElBQUFBLFFBZEs7QUFlTGpCLElBQUFBLFFBZks7QUFnQkx3USxJQUFBQSxTQWhCSztBQWlCTHpRLElBQUFBLGNBakJLO0FBa0JMUyxJQUFBQSxVQWxCSztBQW1CTHNQLElBQUFBO0FBbkJLLEdBQVA7QUFxQkQ7O0FDdEpELG9CQUFlO0FBQ1hqUixFQUFBQSxxQkFBcUIsRUFBRSx1QkFEWjtBQUVYQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFGWjtBQUdYQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFIWDtBQUtYMFIsRUFBQUEsb0JBQW9CLEVBQUUsc0JBTFg7QUFRWEMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBUlA7QUFTWDlRLEVBQUFBLFlBQVksRUFBRSxjQVRIO0FBVVhMLEVBQUFBLFVBQVUsRUFBRSxZQVZEO0FBV1hDLEVBQUFBLElBQUksRUFBRSxNQVhLO0FBWVhDLEVBQUFBLE9BQU8sRUFBRSxTQVpFO0FBYVhDLEVBQUFBLE1BQU0sRUFBRSxRQWJHO0FBY1hDLEVBQUFBLFlBQVksRUFBRTtBQWRILENBQWY7O0FDQUE7QUFFTyxlQUFlZSxhQUFmLENBQTZCO0FBQUVULEVBQUFBLE1BQUY7QUFBVTlDLEVBQUFBLFFBQVY7QUFBb0I4RCxFQUFBQTtBQUFwQixDQUE3QixFQUE2RDtBQUVoRSxNQUFJO0FBQ0Y5RCxJQUFBQSxRQUFRLENBQUM7QUFBRWQsTUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUM2QztBQUFwQixLQUFELENBQVI7QUFDQSxVQUFNdUssUUFBUSxHQUFHLE1BQU10TyxLQUFLLENBQ3pCLHlCQUF3Qm1GLE1BQU8sYUFBWWdCLFFBQVMsRUFEM0IsQ0FBNUI7O0FBR0EsUUFBSW1JLFFBQVEsQ0FBQ3VILEVBQWIsRUFBaUI7QUFDZixZQUFNO0FBQUU5USxRQUFBQTtBQUFGLFVBQWUsTUFBTXVKLFFBQVEsQ0FBQ08sSUFBVCxFQUEzQjtBQUVBeE0sTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDOEMscUJBQXBCO0FBQTJDZSxRQUFBQTtBQUEzQyxPQUFELENBQVI7QUFDRDtBQUNGLEdBVkQsQ0FVRSxPQUFPTyxLQUFQLEVBQWM7QUFFZDtBQUNBakQsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDK0Msb0JBQXBCO0FBQTBDcUIsTUFBQUE7QUFBMUMsS0FBRCxDQUFSO0FBQ0Q7QUFDRjs7QUNiSSxTQUFTd1Esa0JBQVQsQ0FBNEI3VCxLQUE1QixFQUFtQztBQUN0QyxRQUFNO0FBQUNrRSxJQUFBQSxRQUFEO0FBQVVnRyxJQUFBQTtBQUFWLE1BQWlCd0QsV0FBVyxFQUFsQztBQUNBLFFBQU0sQ0FBQ2xLLE1BQUQsRUFBUXNRLFNBQVIsSUFBbUJqRyxHQUFRLEVBQWpDO0FBR0EsUUFBTTtBQUFFNU4sSUFBQUEsUUFBRjtBQUFXOFQsSUFBQUE7QUFBWCxNQUF5Qi9ULEtBQS9CO0FBQ0EsUUFBTTtBQUFFSSxJQUFBQSxRQUFGO0FBQVloQixJQUFBQTtBQUFaLE1BQXNCd1QsV0FBVyxFQUF2QztBQUNBLFFBQU07QUFBRWpQLG1CQUFBQSxlQUFGO0FBQWdCVCxJQUFBQSxNQUFoQjtBQUF1QlUsSUFBQUE7QUFBdkIsTUFBMEN4RSxLQUFoRDtBQUVBNkIsRUFBQUEsR0FBUyxDQUFDLE1BQU07QUFFWixRQUFJaUQsUUFBSixFQUFjO0FBRVYsWUFBTThQLElBQUksR0FBRyxJQUFJQyxTQUFKLENBQWUsR0FBRUYsU0FBVSx1QkFBc0I3UCxRQUFTLEVBQTFELENBQWI7O0FBQ0E4UCxNQUFBQSxJQUFJLENBQUNFLFNBQUwsR0FBa0JDLGFBQUQsSUFBbUI7QUFDaEMsY0FBTUMsR0FBRyxHQUFHelQsSUFBSSxDQUFDUSxLQUFMLENBQVdnVCxhQUFhLENBQUNFLElBQXpCLENBQVo7QUFFQWpVLFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQ2tELHVCQUFwQjtBQUE2QzBCLFVBQUFBLE9BQU8sRUFBRXVRO0FBQXRELFNBQUQsQ0FBUjtBQUNILE9BSkQ7O0FBS0FKLE1BQUFBLElBQUksQ0FBQ00sTUFBTCxHQUFjLE1BQU07QUFFaEJsVSxRQUFBQSxRQUFRLENBQUM7QUFBRWQsVUFBQUEsSUFBSSxFQUFFTCxhQUFXLENBQUN3RDtBQUFwQixTQUFELENBQVI7QUFDSCxPQUhEOztBQUlBdVIsTUFBQUEsSUFBSSxDQUFDTyxPQUFMLEdBQWUsTUFBTTtBQUVqQm5VLFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzBEO0FBQXBCLFNBQUQsQ0FBUjtBQUNILE9BSEQ7O0FBSUFxUixNQUFBQSxJQUFJLENBQUNRLE9BQUwsR0FBZ0JuUixLQUFELElBQVc7QUFDdEI7QUFDQWpELFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVMLGFBQVcsQ0FBQzRELFlBQXBCO0FBQWtDUSxVQUFBQTtBQUFsQyxTQUFELENBQVI7QUFDSCxPQUhEOztBQUlBakQsTUFBQUEsUUFBUSxDQUFDO0FBQUVkLFFBQUFBLElBQUksRUFBRUwsYUFBVyxDQUFDMkQsWUFBcEI7QUFBa0NZLFFBQUFBLE1BQU0sRUFBRXdRO0FBQTFDLE9BQUQsQ0FBUjtBQUNBRixNQUFBQSxTQUFTLENBQUNFLElBQUQsQ0FBVDtBQUNIO0FBQ0osR0F6QlEsRUF5Qk4sQ0FBQzlQLFFBQUQsQ0F6Qk0sQ0FBVDtBQTJCQWpELEVBQUFBLEdBQVMsQ0FBQyxNQUFJO0FBQ1YsUUFBRzBDLGVBQUgsRUFBaUI7QUFFYnlKLE1BQUFBLGFBQUEsQ0FBc0I7QUFBQ2hOLFFBQUFBLFFBQUQ7QUFBVThDLFFBQUFBLE1BQVY7QUFBaUJnQixRQUFBQTtBQUFqQixPQUF0QjtBQUNIO0FBQ0osR0FMUSxFQUtQLENBQUNQLGVBQUQsQ0FMTyxDQUFUO0FBT0ExQyxFQUFBQSxHQUFTLENBQUMsTUFBSTtBQUNWLFFBQUcyQyxjQUFILEVBQWtCO0FBRWQ2USxNQUFBQSxXQUFXO0FBQ2Q7QUFDSixHQUxRLEVBS1AsQ0FBQzdRLGNBQUQsQ0FMTyxDQUFUOztBQVFBLFdBQVM2USxXQUFULEdBQXNCO0FBQ2xCalIsSUFBQUEsTUFBTSxDQUFDZ1AsSUFBUCxDQUFZN1IsSUFBSSxDQUFDQyxTQUFMLENBQWVnRCxjQUFmLENBQVo7QUFFQXhELElBQUFBLFFBQVEsQ0FBQztBQUFDZCxNQUFBQSxJQUFJLEVBQUNMLGFBQVcsQ0FBQ3NDO0FBQWxCLEtBQUQsQ0FBUjtBQUNIOztBQUVELFNBQU90QixRQUFQO0FBRUg7O0FDM0RjLFNBQVN5VSxjQUFULENBQXdCMVUsS0FBeEIsRUFBK0I7QUFDMUMsRUFHa0Q7QUFDOUMsV0FBTyxFQUFDLGtCQUFELEVBQXdCQSxLQUF4QixDQUFQO0FBQ0g7QUFHSjs7QUNmRDtBQU1PLFNBQVMyVSxZQUFULENBQXNCO0FBQUUxVSxFQUFBQTtBQUFGLENBQXRCLEVBQW9DO0FBQ3pDLFNBQ0UsRUFBQyxnQkFBRDtBQUNFLElBQUEsS0FBSyxFQUFDLFFBRFI7QUFFRSxJQUFBLFNBQVMsRUFBRTtBQUFFVixNQUFBQSxLQUFLLEVBQUUsR0FBVDtBQUFjQyxNQUFBQSxZQUFZLEVBQUU7QUFBNUI7QUFGYixLQUlFLEVBQUMsWUFBRCxRQUNFLEVBQUMsZ0JBQUQsUUFDRSxFQUFDLGNBQUQ7QUFBZ0IsSUFBQSxTQUFTLEVBQUcsU0FBUW9WLFdBQUc7QUFBdkMsS0FDRzNVLFFBREgsQ0FERixDQURGLENBSkYsQ0FERjtBQWVEOztBQ25CYyxTQUFTNFUsTUFBVCxDQUFnQjdVLEtBQWhCLEVBQXVCO0FBQ2xDLFFBQU07QUFBRThVLElBQUFBLEVBQUUsR0FBRyxPQUFQO0FBQWdCQyxJQUFBQSxLQUFoQjtBQUF1QjlVLElBQUFBO0FBQXZCLE1BQW9DRCxLQUExQztBQUNBLFNBQU87QUFBSyxJQUFBLFNBQVMsRUFBRyxrQ0FBaUM4VSxFQUFHLE9BQU1BLEVBQUc7QUFBOUQsS0FDSDtBQUFHLElBQUEsU0FBUyxFQUFDLGNBQWI7QUFBNEIsSUFBQSxJQUFJLEVBQUM7QUFBakMsS0FBc0NDLEtBQXRDLENBREcsRUFFSDtBQUFRLElBQUEsU0FBUyxFQUFDLGdCQUFsQjtBQUFtQyxJQUFBLElBQUksRUFBQyxRQUF4QztBQUFpRCxtQkFBWSxVQUE3RDtBQUF3RSxtQkFBWSx5QkFBcEY7QUFBOEcscUJBQWMsd0JBQTVIO0FBQXFKLHFCQUFjLE9BQW5LO0FBQTJLLGtCQUFXO0FBQXRMLEtBQ0k7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixJQURKLENBRkcsRUFLRTlVLFFBTEYsQ0FBUDtBQVFIO0FBR00sU0FBUytVLGNBQVQsQ0FBd0I7QUFBQy9VLEVBQUFBO0FBQUQsQ0FBeEIsRUFBbUM7QUFDdEMsU0FBTztBQUFLLElBQUEsU0FBUyxFQUFDLDBCQUFmO0FBQTBDLElBQUEsRUFBRSxFQUFDO0FBQTdDLEtBQ0ZBLFFBREUsQ0FBUDtBQUdIO0FBSU0sU0FBU2dWLFNBQVQsQ0FBbUI7QUFBRWhWLEVBQUFBO0FBQUYsQ0FBbkIsRUFBaUM7QUFDcEMsU0FBTztBQUFJLElBQUEsU0FBUyxFQUFDO0FBQWQsS0FDRkEsUUFERSxDQUFQO0FBR0g7O0FBRU0sU0FBU2lWLE9BQVQsQ0FBaUI7QUFBRWpWLEVBQUFBO0FBQUYsQ0FBakIsRUFBK0I7QUFFbEMsU0FBTztBQUFJLElBQUEsU0FBUyxFQUFDO0FBQWQsS0FBMEJBLFFBQTFCLENBQVA7QUFDSDtBQUdNLFNBQVNrVixPQUFULENBQWlCblYsS0FBakIsRUFBd0I7QUFDM0IsUUFBTTtBQUFDb1YsSUFBQUE7QUFBRCxNQUFXcFYsS0FBakI7QUFDQSxRQUFNO0FBQUNRLElBQUFBO0FBQUQsTUFBYUYsV0FBVyxFQUE5Qjs7QUFDQSxXQUFTK1UsV0FBVCxDQUFxQjlXLENBQXJCLEVBQXdCO0FBQ3BCQSxJQUFBQSxDQUFDLENBQUMrVyxjQUFGO0FBQ0EsVUFBTTtBQUFFdEMsTUFBQUE7QUFBRixRQUFTelUsQ0FBQyxDQUFDbVIsTUFBakI7QUFFQWxQLElBQUFBLFVBQVUsQ0FBQztBQUFDaEIsTUFBQUEsWUFBWSxFQUFFLElBQUd3VCxFQUFHLEVBQXJCO0FBQXVCelQsTUFBQUEsS0FBSyxFQUFDNlY7QUFBN0IsS0FBRCxDQUFWO0FBQ0Q7O0FBQ0gsU0FBTztBQUFHLElBQUEsU0FBUyxFQUFDLFVBQWI7QUFBd0IsSUFBQSxJQUFJLEVBQUMsR0FBN0I7QUFBaUMsSUFBQSxPQUFPLEVBQUVDO0FBQTFDLEtBQTREclYsS0FBNUQsRUFBUDtBQUNIOztBQzNDYyxTQUFTdVYsR0FBVCxDQUFjdlYsS0FBZCxFQUFvQjtBQUMvQixRQUFNO0FBQUNDLElBQUFBLFFBQUQ7QUFBVXVWLElBQUFBO0FBQVYsTUFBK0J4VixLQUFyQztBQUVKLFNBQU87QUFBSSxJQUFBLFNBQVMsRUFBRyxPQUFNd1YsbUJBQW1CLElBQUlBLG1CQUFvQjtBQUFqRSxLQUF3RXhWLEtBQXhFLEdBQWdGQyxRQUFoRixDQUFQO0FBQ0M7O0FDQU0sU0FBU3dWLGFBQVQsR0FBeUI7QUFDOUIsUUFBTTtBQUFFdlIsSUFBQUE7QUFBRixNQUFld0osV0FBVyxFQUFoQztBQUNBLFFBQU07QUFBRXFDLElBQUFBO0FBQUYsTUFBZ0JQLE9BQU8sRUFBN0I7QUFDQSxTQUFPLGVBQ0wsRUFBQyxNQUFEO0FBQVEsSUFBQSxLQUFLLEVBQUMsUUFBZDtBQUF1QixJQUFBLEVBQUUsRUFBQztBQUExQixLQUNFLEVBQUMsY0FBRCxRQUNFLEVBQUMsU0FBRCxRQUNFLEVBQUMsT0FBRCxRQUNHdEwsUUFBUSxJQUFJLEVBQUMsT0FBRDtBQUFTLElBQUEsRUFBRSxFQUFDLFNBQVo7QUFBc0IsSUFBQSxRQUFRLEVBQUM7QUFBL0IsZ0JBRGYsQ0FERixDQURGLEVBT0UsRUFBQyxHQUFEO0FBQUssSUFBQSxtQkFBbUIsRUFBQztBQUF6QixLQUNHLENBQUNBLFFBQUQsSUFBYSxFQUFDLE9BQUQsUUFDWixFQUFDLE9BQUQ7QUFBUyxJQUFBLEVBQUUsRUFBQyxPQUFaO0FBQW9CLElBQUEsUUFBUSxFQUFDLE9BQTdCO0FBQXFDLG1CQUFZO0FBQWpELGVBRFksQ0FEaEIsRUFJRyxDQUFDQSxRQUFELElBQWEsRUFBQyxPQUFELFFBQ1osRUFBQyxPQUFEO0FBQVMsSUFBQSxFQUFFLEVBQUMsUUFBWjtBQUFxQixJQUFBLFFBQVEsRUFBQyxPQUE5QjtBQUFzQyxtQkFBWTtBQUFsRCxlQURZLENBSmhCLEVBT0UsRUFBQyxPQUFELFFBQ0dBLFFBQVEsSUFBSSxFQUFDLE9BQUQ7QUFBUyxJQUFBLEVBQUUsRUFBQyxTQUFaO0FBQXNCLElBQUEsUUFBUSxFQUFDLE9BQS9CO0FBQXVDLG1CQUFZO0FBQW5ELGtCQUE0RUEsUUFBNUUsQ0FEZixDQVBGLEVBVUUsRUFBQyxPQUFELFFBQ0dBLFFBQVEsSUFBSSxFQUFDLE9BQUQ7QUFBUyxJQUFBLEVBQUUsRUFBQyxTQUFaO0FBQXNCLElBQUEsUUFBUSxFQUFDLE9BQS9CO0FBQXVDLG1CQUFZLGNBQW5EO0FBQWtFLElBQUEsT0FBTyxFQUFFNkw7QUFBM0UsZ0JBRGYsQ0FWRixDQVBGLENBREYsQ0FESyxDQUFQO0FBMEJEOztBQ2xDTSxTQUFTMkYsSUFBVCxHQUFnQjtBQUNyQixTQUFPO0FBQUssbUJBQVksTUFBakI7QUFBd0IsSUFBQSxLQUFLLEVBQUU7QUFBQ0MsTUFBQUEsVUFBVSxFQUFDO0FBQVo7QUFBL0IsWUFBUDtBQUNEOztBQ0VELE1BQU1DLFFBQVEsR0FBR3RFLENBQUksQ0FBQyxNQUFNLE9BQU8sdUJBQVAsQ0FBUCxDQUFyQjtBQUdPLFNBQVN1RSxTQUFULEdBQXFCO0FBQzFCLFNBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFFQyxNQUFBQSxNQUFNLEVBQUU7QUFBVjtBQUFaLEtBQ0UsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUVGLEVBQUNDLGlCQUFELE9BRkUsQ0FERixFQU1FLEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFDO0FBQWYsS0FDRSxFQUFDLElBQUQsT0FERixDQU5GLEVBVUUsRUFBQyxRQUFEO0FBQVUsSUFBQSxJQUFJLEVBQUM7QUFBZixLQUNFLEVBQUNuRSxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLFFBQUQsT0FERixDQURGLENBVkYsQ0FERjtBQW1CRDs7QUN4Qk0sU0FBU29FLEdBQVQsR0FBZTtBQUNwQixTQUNFLGVBQ0UsRUFBQyxhQUFELE9BREYsRUFFRSxFQUFDLFNBQUQsT0FGRixFQUdHLEVBSEgsQ0FERjtBQU9EOztBQ1REQyxLQUFLLENBQUNDLFVBQU4sQ0FBaUIsMENBQWpCLEVBQTRELDBDQUE1RDs7QUFDQUQsS0FBSyxDQUFDRSxTQUFOLEdBQW1CLFdBQVV2QixXQUFHLGFBQWhDO0FBRUE7QUFDQTs7QUFDQXdCLENBQU0sQ0FDSixFQUFDLFlBQUQsUUFDRSxFQUFDLEdBQUQsT0FERixDQURJLEVBS0pDLFFBQVEsQ0FBQy9KLElBTEwsQ0FBTjs7OzsifQ==
