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

var n,u,i,t,o,r,f,e={},c=[],a=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var i,t=arguments,o={};for(i in l)"key"!==i&&"ref"!==i&&(o[i]=l[i]);if(arguments.length>3)for(u=[u],i=3;i<arguments.length;i++)u.push(t[i]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===o[i]&&(o[i]=n.defaultProps[i]);return y(n,o,l&&l.key,l&&l.ref,null)}function y(l,u,i,t,o){var r={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),n.vnode&&n.vnode(r),r}function d(n){return n.children}function m(n,l){this.props=n,this.context=l;}function w(n,l){if(null==l)return n.__?w(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?w(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k(n)}}function g(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!i++||o!==n.debounceRendering)&&((o=n.debounceRendering)||t)(_);}function _(){for(var n;i=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(i=s({},o)).__v=i,t=z(f,o,i,l.__n,void 0!==f.ownerSVGElement,null,u,null==r?w(o):r),T(u,o),t!=r&&k(o)));});}function b(n,l,u,i,t,o,r,f,a,s){var h,p,m,k,g,_,b,x,A,P=i&&i.__k||c,C=P.length;for(a==e&&(a=null!=r?r[0]:C?w(i,0):null),u.__k=[],h=0;h<l.length;h++)if(null!=(k=u.__k[h]=null==(k=l[h])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k?y(null,k,null,null,k):Array.isArray(k)?y(d,{children:k},null,null,null):null!=k.__e||null!=k.__c?y(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(m=P[h])||m&&k.key==m.key&&k.type===m.type)P[h]=void 0;else for(p=0;p<C;p++){if((m=P[p])&&k.key==m.key&&k.type===m.type){P[p]=void 0;break}m=null;}if(g=z(n,k,m=m||e,t,o,r,f,a,s),(p=k.ref)&&m.ref!=p&&(x||(x=[]),m.ref&&x.push(m.ref,null,k),x.push(p,k.__c||g,k)),null!=g){if(null==b&&(b=g),A=void 0,void 0!==k.__d)A=k.__d,k.__d=void 0;else if(r==m||g!=a||null==g.parentNode){n:if(null==a||a.parentNode!==n)n.appendChild(g),A=null;else {for(_=a,p=0;(_=_.nextSibling)&&p<C;p+=2)if(_==g)break n;n.insertBefore(g,a),A=a;}"option"==u.type&&(n.value="");}a=void 0!==A?A:g.nextSibling,"function"==typeof u.type&&(u.__d=a);}else a&&m.__e==a&&a.parentNode!=n&&(a=w(m));}if(u.__e=b,null!=r&&"function"!=typeof u.type)for(h=r.length;h--;)null!=r[h]&&v(r[h]);for(h=C;h--;)null!=P[h]&&D(P[h],P[h]);if(x)for(h=0;h<x.length;h++)j(x[h],x[++h],x[++h]);}function x(n){return null==n||"boolean"==typeof n?[]:Array.isArray(n)?c.concat.apply([],n.map(x)):[n]}function A(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||C(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||C(n,o,l[o],u[o],i);}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===a.test(l)?u+"px":null==u?"":u;}function C(n,l,u,i,t){var o,r,f,e,c;if(t?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else {if("string"==typeof i&&(o.cssText="",i=null),i)for(e in i)u&&e in u||P(o,e,"");if(u)for(c in u)i&&u[c]===i[c]||P(o,c,u[c]);}else "o"===l[0]&&"n"===l[1]?(r=l!==(l=l.replace(/Capture$/,"")),f=l.toLowerCase(),l=(f in n?f:l).slice(2),u?(i||n.addEventListener(l,N,r),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,N,r)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u));}function N(l){this.l[l.type](n.event?n.event(l):l);}function z(l,u,i,t,o,r,f,e,c){var a,v,h,y,p,w,k,g,_,x,A,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(g=u.props,_=(a=P.contextType)&&t[a.__c],x=a?_?_.props.value:a.__:t,i.__c?k=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(g,x):(u.__c=v=new m(g,x),v.constructor=P,v.render=E),_&&_.sub(v),v.props=g,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=s({},v.__s)),s(v.__s,P.getDerivedStateFromProps(g,v.__s))),y=v.props,p=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&g!==y&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(g,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(g,v.__s,x)||u.__v===i.__v){for(v.props=g,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v),a=0;a<u.__k.length;a++)u.__k[a]&&(u.__k[a].__=u);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(g,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(y,p,w);});}v.context=x,v.props=g,v.state=v.__s,(a=n.__r)&&a(u),v.__d=!1,v.__v=u,v.__P=l,a=v.render(v.props,v.state,v.context),null!=v.getChildContext&&(t=s(s({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(w=v.getSnapshotBeforeUpdate(y,p)),A=null!=a&&a.type==d&&null==a.key?a.props.children:a,b(l,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),v.base=u.__e,v.__h.length&&f.push(v),k&&(v.__E=v.__=null),v.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=$(i.__e,u,i,t,o,r,f,c);(a=n.diffed)&&a(u);}catch(l){u.__v=null,n.__e(l,u,i);}return u.__e}function T(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n.__e(l,u.__v);}});}function $(n,l,u,i,t,o,r,f){var a,s,v,h,y,p=u.props,d=l.props;if(t="svg"===l.type||t,null!=o)for(a=0;a<o.length;a++)if(null!=(s=o[a])&&((null===l.type?3===s.nodeType:s.localName===l.type)||n==s)){n=s,o[a]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,f=!1;}if(null===l.type)p!==d&&n.data!=d&&(n.data=d);else {if(null!=o&&(o=c.slice.call(n.childNodes)),v=(p=u.props||e).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!f){if(null!=o)for(p={},y=0;y<n.attributes.length;y++)p[n.attributes[y].name]=n.attributes[y].value;(h||v)&&(h&&v&&h.__html==v.__html||(n.innerHTML=h&&h.__html||""));}A(n,d,p,t,f),h?l.__k=[]:(a=l.props.children,b(n,Array.isArray(a)?a:[a],l,u,i,"foreignObject"!==l.type&&t,o,r,e,f)),f||("value"in d&&void 0!==(a=d.value)&&a!==n.value&&C(n,"value",a,p.value,!1),"checked"in d&&void 0!==(a=d.checked)&&a!==n.checked&&C(n,"checked",a,p.checked,!1));}return n}function j(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,i);}}function D(l,u,i){var t,o,r;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||j(t,null,u)),i||"function"==typeof l.type||(i=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(r=0;r<t.length;r++)t[r]&&D(t[r],u,i);null!=o&&v(o);}function E(n,l,u){return this.constructor(n,u)}function H(l,u,i){var t,o,f;n.__&&n.__(l,u),o=(t=i===r)?null:i&&i.__k||u.__k,l=h(d,null,[l]),f=[],z(u,(t?u:i||u).__k=l,o||e,e,void 0!==u.ownerSVGElement,i&&!t?[i]:o?null:u.childNodes.length?c.slice.call(u.childNodes):null,f,i||e,t),T(f,l);}function M(n){var l={},u={__c:"__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var i,t=this;return this.getChildContext||(i=[],this.getChildContext=function(){return l[u.__c]=t,l},this.shouldComponentUpdate=function(n){t.props.value!==n.value&&i.some(function(l){l.context=n.value,g(l);});},this.sub=function(n){i.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){i.splice(i.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Consumer.contextType=u,u.Provider.__=u,u}n={__e:function(n,l){for(var u,i;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(i=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(i=!0,u.componentDidCatch(n)),i)return g(u.__E=u)}catch(l){n=l;}throw n}},m.prototype.setState=function(n,l){var u;u=this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),g(this));},m.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),g(this));},m.prototype.render=d,u=[],i=0,t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,r=e,f=0;

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

var t$1,u$1,r$1,i$1=0,o$1=[],c$1=n.__r,f$1=n.diffed,e$1=n.__c,a$1=n.unmount;function v$1(t,r){n.__h&&n.__h(u$1,t,i$1||r),i$1=0;var o=u$1.__H||(u$1.__H={__:[],__h:[]});return t>=o.__.length&&o.__.push({}),o.__[t]}function m$1(n){return i$1=1,p(E$1,n)}function p(n,r,i){var o=v$1(t$1++,2);return o.t=n,o.__c||(o.__c=u$1,o.__=[i?i(r):E$1(void 0,r),function(n){var t=o.t(o.__[0],n);o.__[0]!==t&&(o.__[0]=t,o.__c.setState({}));}]),o.__}function l(r,i){var o=v$1(t$1++,3);!n.__s&&x$1(o.__H,i)&&(o.__=r,o.__H=i,u$1.__H.__h.push(o));}function d$1(n){return i$1=5,h$1(function(){return {current:n}},[])}function h$1(n,u){var r=v$1(t$1++,7);return x$1(r.__H,u)?(r.__H=u,r.__h=n,r.__=n()):r.__}function w$1(n){var r=u$1.context[n.__c],i=v$1(t$1++,9);return i.__c=n,r?(null==i.__&&(i.__=!0,r.sub(u$1)),r.props.value):n.__}function _$1(){o$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(g$1),t.__H.__h.forEach(q),t.__H.__h=[];}catch(u){return t.__H.__h=[],n.__e(u,t.__v),!0}}),o$1=[];}function g$1(n){"function"==typeof n.u&&n.u();}function q(n){n.u=n.__();}function x$1(n,t){return !n||t.some(function(t,u){return t!==n[u]})}function E$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){c$1&&c$1(n),t$1=0;var r=(u$1=n.__c).__H;r&&(r.__h.forEach(g$1),r.__h.forEach(q),r.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var u=t.__c;u&&u.__H&&u.__H.__h.length&&(1!==o$1.push(u)&&r$1===n.requestAnimationFrame||((r$1=n.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(r),cancelAnimationFrame(t),setTimeout(n);},r=setTimeout(u,100);"undefined"!=typeof window&&(t=requestAnimationFrame(u));})(_$1));},n.__c=function(t,u){u.some(function(t){try{t.__h.forEach(g$1),t.__h=t.__h.filter(function(n){return !n.__||q(n)});}catch(r){u.some(function(n){n.__h&&(n.__h=[]);}),u=[],n.__e(r,t.__v);}}),e$1&&e$1(t,u);},n.unmount=function(t){a$1&&a$1(t);var u=t.__c;if(u&&u.__H)try{u.__H.__.forEach(g$1);}catch(t){n.__e(t,u.__v);}};

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
  const context = w$1(AppRouteContext);

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
  const [state, dispatch] = p(reducer, initState);
  const value = h$1(() => [state, dispatch], [state]);
  return h(AppRouteContext.Provider, _extends({
    value: value
  }, props));
}

function w$2(n,t){for(var e in t)n[e]=t[e];return n}function x$2(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var E$2=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return x$2(this.props,n)||x$2(this.state,t)},r}(m);var _$2=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),_$2&&_$2(n);};var N$1=n.__e;function U(n){return n&&((n=w$2({},n)).__c=null,n.__k=n.__k&&n.__k.map(U)),n}function M$1(){this.__u=0,this.o=null,this.__b=null;}function L(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function O(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function P$1(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);N$1(n,t,e);},(M$1.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=L(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},M$1.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=U(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var W=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(P$1.prototype=new m).u=function(n){var t=this,e=L(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),W(t,n,r)):o();};e?e(u):u();}},P$1.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},P$1.prototype.componentDidUpdate=P$1.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){W(n,e,t);});};var j$1=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var H$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var T$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var I=n.event;function $$1(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){I&&(n=I(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var q$1={configurable:!0,get:function(){return this.class}},B=n.vnode;n.vnode=function(n){n.$$typeof=T$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&(q$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",q$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=H$1.test(u))break;if(r)for(u in o=n.props={},e)o[H$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&($$1(t.prototype,"componentWillMount"),$$1(t.prototype,"componentWillReceiveProps"),$$1(t.prototype,"componentWillUpdate"),t.m=!0);}B&&B(n);};

const ThemeContext = M();

function useThemeContext() {
  const context = w$1(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used with ThemeProvider');
  }

  return context;
}

function ThemeProvider(props) {
  const {
    initState
  } = props;
  const [state, setState] = m$1(initState);
  return h(ThemeContext.Provider, _extends({
    value: state
  }, props));
}

const style = {
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
    style: { ...style,
      backgroundColor: 'green'
    },
    "data-testid": "online"
  });
}
function IsOffline() {
  return h("div", {
    style: { ...style,
      backgroundColor: 'red'
    },
    "data-testid": "offline"
  });
}
function Connecting() {
  return h("div", {
    style: { ...style,
      backgroundColor: 'orange'
    },
    "data-testid": "connecting"
  });
}
function Closing() {
  return h("div", {
    style: { ...style,
      backgroundColor: 'pink'
    },
    "data-testid": "closing"
  });
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

var css_248z = ".nav-item:hover {\n  background-color: #3700b3;\n  border-radius: 4px;\n}\n\n.nav-item {\n  color: #ffffff;\n  min-height: 36px;\n  padding-left: 16px;\n  padding-right: 16px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.menu-white {\n  min-height: 36px;\n  min-width: 36px;\n  padding: 8px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.menu-white:hover {\n  background-color: #3700b3;\n  border-radius: 50%;\n}\n\nbody {\n  padding-top: 80px;\n}";
styleInject(css_248z);

function MenuWhite({
  onClick,
  device,
  id
}) {
  function handleOnClick() {
    console.log('dev', device);

    switch (device) {
      case 'phone':
        onClick('/phone');
        break;

      case 'tablet':
        onClick('/tablet');
        break;

      case 'laptop':
        onClick('/laptop');
        break;

      case 'desktop':
        onClick('/desktop');
        break;
    }
  }

  return h("svg", {
    "data-testid": id,
    onClick: handleOnClick,
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

function AppShell({
  children
}) {
  return h("div", null, children);
}

function AppBar({
  children
}) {
  const theme = useThemeContext();
  return h("div", {
    style: { ...theme.primary,
      // position: 'fixed',
      // left: 0,
      // top: 0,
      minHeight: 64,
      paddingLeft: 16,
      paddingRight: 16,
      width: '100%'
    }
  }, h("div", {
    style: {
      display: 'flex'
    }
  }, children));
}

function useMediaQuery() {
  const [width, setWidth] = m$1(0);
  const [height, setHeight] = m$1(0);
  const [orientation, setOrientation] = m$1('');
  const [device, setDevice] = m$1('');

  function handleViewportSize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  function handleScreenOrientation() {
    setOrientation(window.screen.orientation);
  }

  l(() => {
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
  l(() => {
    console.log('device', device);
  }, [device]);
  l(() => {
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

var actionTypes$1 = {
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
  authFeedback: null
};
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes$1.VALUE_CHANGED:
      const nextState = { ...state,
        [action.payload.propName]: action.payload.value
      };
      return nextState;

    case actionTypes$1.LOGIN_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$1.LOGIN_SUCCESS:
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

    case actionTypes$1.LOGIN_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes$1.SIGNUP_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$1.SIGNUP_SUCCESS:
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

    case actionTypes$1.SIGNUP_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes$1.CHANGE_PASSWORD_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$1.CHANGE_PASSWORD_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        token: action.token,
        username: action.username,
        email: action.email,
        isPasswordChanged: true,
        authFeedback: action.message
      };

    case actionTypes$1.CHANGE_PASSWORD_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes$1.REQUEST_PASS_CHANGE_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$1.REQUEST_PASS_CHANGE_SUCCESS:
      return { ...state,
        loading: false,
        success: true,
        authFeedback: action.message
      };

    case actionTypes$1.REQUEST_PASS_CHANGE_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes$1.GOT_TOKEN_FROM_URL:
      return { ...state,
        token: action.token
      };

    case actionTypes$1.LOGOUT_SUCCESS:
      return { ...initState
      };

    case actionTypes$1.RECOVER_LOCAL_AUTH_STATE:
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
  const [authRoute, setAuthRoute] = m$1(initialRoute);
  const value = h$1(() => [authRoute, setAuthRoute], [authRoute]);
  return h(AuthRouteContext.Provider, _extends({
    value: value
  }, props));
}

const AuthContext = M();

function useAuthContext() {
  const context = w$1(AuthContext);

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
  const [state, dispatch] = p(authReducer, initState);
  const value = h$1(() => [state, dispatch], [state]);
  return h(AuthContext.Provider, _extends({
    value: value
  }, props), h(AuthRouteProvider, null, children));
}

function useUserName() {
  const [userName, setUsername] = m$1(null);
  const [token, setToken] = m$1(null);
  const [email, setEmail] = m$1('');
  const {
    state,
    dispatch
  } = useAuthContext();
  l(() => {
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
  l(() => {
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

var actionTypes$2 = {
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
    type: actionTypes$2.CLIENT_VALIDATION,
    ...validation
  };
}
function resetInputValidationState({
  validationType
}) {
  return {
    type: actionTypes$2.RESET_VALIDATION_STATE,
    validationType
  };
}
function serverValidation({
  status = 0
}) {
  switch (status) {
    case httpStatus.credentialInvalid:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailInvalid:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordInvalid:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
        message: validationMessages.INVALID_PASSWORD,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameInvalid:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsRegistered:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.REGISTERED_EMAIL,
        message: validationMessages.REGISTERED_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsNotRegistered:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_NOT_REGISTERED,
        message: validationMessages.EMAIL_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsTaken:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_TAKEN,
        message: validationMessages.USERNAME_TAKEN,
        validationState: validationStates.INVALID
      };

    case httpStatus.emptyStringNotValid:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.EMPTY_STRING_VALIDATION,
        message: validationMessages.INVALID_EMPTY_STRING,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailorusernameNotValid:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsNotRegistered:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_NOT_REGISTERED,
        message: validationMessages.USERNAME_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordDoNotMatch:
      return {
        type: actionTypes$2.SERVER_VALIDATION,
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
    type: actionTypes$1.VALUE_CHANGED,
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
      type: actionTypes$1.LOGIN_STARTED
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
        type: actionTypes$1.LOGIN_SUCCESS,
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
      type: actionTypes$1.LOGIN_FAILED,
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
    type: actionTypes$1.SIGNUP_STARTED
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
        type: actionTypes$1.SIGNUP_SUCCESS,
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
      type: actionTypes$1.SIGNUP_FAILED,
      payload: {
        error
      }
    });
  }
}
function logout() {
  window.localStorage.removeItem('webcom');
  return {
    type: actionTypes$1.LOGOUT_SUCCESS
  };
}
async function changePassword({
  dispatch,
  state,
  formDispatch,
  token
}) {
  dispatch({
    type: actionTypes$1.CHANGE_PASSWORD_STARTED
  });

  try {
    const {
      confirm,
      password
    } = state;
    debugger;
    const response = await fetch(`${"http://localhost:3000"}/auth/changepass`, {
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
        type: actionTypes$1.CHANGE_PASSWORD_SUCCESS,
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
        type: actionTypes$1.CHANGE_PASSWORD_FAILED,
        error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes$1.CHANGE_PASSWORD_FAILED,
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
      type: actionTypes$1.REQUEST_PASS_CHANGE_STARTED
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
        type: actionTypes$1.REQUEST_PASS_CHANGE_SUCCESS,
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
        type: actionTypes$1.REQUEST_PASS_CHANGE_FAILED,
        error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes$1.REQUEST_PASS_CHANGE_FAILED,
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
    type: actionTypes$1.GOT_TOKEN_FROM_URL,
    token
  };
}
function recoverLocalAuthState({
  user,
  dispatch
}) {
  dispatch({
    type: actionTypes$1.RECOVER_LOCAL_AUTH_STATE,
    user
  });
}

const actionTypes$3 = {
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
  //SOCKET
  CONNECTING: 'CONNECTING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED',
  SOCKET_READY: 'SOCKET_READY',
  SOCKET_ERROR: 'SOCKET_ERROR'
};

const initState$1 = {
  hangouts: null,
  hangout: null,
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
    case actionTypes$3.HANGOUT_UPDATED:
      return { ...state,
        hangout: action.hangout
      };

    case actionTypes$3.HANGOUTS_UPDATED:
      return { ...state,
        hangouts: action.hangouts
      };

    case actionTypes$3.MESSAGES_UPDATED:
      return { ...state,
        messages: action.messages
      };

    case actionTypes$3.SOCKET_MESSAGE_RECIEVED:
      return { ...state,
        socketMessage: action.socketMessage
      };

    case actionTypes$3.LOADED_MESSAGES:
      return { ...state,
        messages: action.messages
      };

    case actionTypes$3.MESSAGE_TEXT_CHANGED:
      return { ...state,
        messageText: action.text
      };

    case actionTypes$3.FETCH_USER_FAILED:
    case actionTypes$3.FETCH_HANGOUT_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes$3.FETCH_HANGOUT_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$3.FETCH_HANGOUT_SUCCESS:
      return { ...state,
        loading: false,
        hangouts: action.hangouts
      };

    case actionTypes$3.FILTER_HANGOUTS:
      return { ...state,
        hangouts: state.hangouts.filter(g => g.username.includes(state.search))
      };

    case actionTypes$3.SEARCHED_HANGOUT:
      return { ...state,
        search: action.search
      };

    case actionTypes$3.LOAD_HANGOUTS:
      return { ...state,
        hangouts: action.hangouts
      };

    case actionTypes$3.SELECTED_HANGOUT:
      return { ...state,
        hangout: state.hangouts.find(g => g.username === action.username)
      };
    //SOCKET

    case actionTypes$3.SOCKET_ERROR:
      return { ...state,
        error: action.error
      };

    case actionTypes$3.CONNECTING:
      return { ...state,
        readyState: 0
      };

    case actionTypes$3.OPEN:
      return { ...state,
        readyState: 1
      };

    case actionTypes$3.CLOSING:
      return { ...state,
        readyState: 2
      };

    case actionTypes$3.CLOSED:
      return { ...state,
        readyState: 3
      };

    case actionTypes$3.SOCKET_READY:
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
    type: actionTypes$3.LOAD_HANGOUTS,
    hangouts
  });
} //select hangout from List

function selectHangout({
  dispatch,
  username
}) {
  dispatch({
    type: actionTypes$3.SELECTED_HANGOUT,
    username
  });
}
function selectUser({
  dispatch,
  user,
  username
}) {
  // save selected user to hangouts
  const hangout = { ...user,
    state: 'INVITE'
  };
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));

  if (hangouts) {
    localStorage.setItem(`${username}-hangouts`, JSON.stringify([...hangouts, hangout]));
  } else {
    localStorage.setItem(`${username}-hangouts`, JSON.stringify([hangout]));
  }

  dispatch({
    type: actionTypes$3.SELECTED_USER,
    hangout
  });
} //search for hangout by typing into TextInput

function searchHangouts({
  search,
  dispatch
}) {
  dispatch({
    type: actionTypes$3.SEARCHED_HANGOUT,
    search
  });
} //filter hangout after search state change

function filterHangouts({
  dispatch
}) {
  dispatch({
    type: actionTypes$3.FILTER_HANGOUTS
  });
} //fetch hangout from server if not found in local hangouts

async function fetchHangout({
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
      debugger;
      dispatch({
        type: actionTypes$3.FETCH_HANGOUT_SUCCESS,
        hangouts
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$3.FETCH_HANGOUT_FAILED,
      error
    });
  }
}
function changeMessageText({
  text,
  dispatch
}) {
  dispatch({
    type: actionTypes$3.MESSAGE_TEXT_CHANGED,
    text
  });
}
function loadMessages({
  hangout,
  dispatch
}) {
  const {
    username
  } = hangout;
  const key = `${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));
  dispatch({
    type: actionTypes$3.LOADED_MESSAGES,
    messages
  });
}
//END saveInviter

function useWebSocket({
  socketUrl,
  username,
  dispatch
}) {
  l(() => {
    if (username) {
      const sock = new WebSocket(`${socketUrl}/?username=${username}`);

      sock.onmessage = message => {
        const msg = JSON.parse(message.data);
        dispatch({
          type: actionTypes$3.SOCKET_MESSAGE_RECIEVED,
          socketMessage: msg
        });
      };

      sock.onopen = () => {
        dispatch({
          type: actionTypes$3.OPEN
        });
      };

      sock.onclose = () => {
        dispatch({
          type: actionTypes$3.CLOSED
        });
      };

      sock.onerror = error => {
        dispatch({
          type: actionTypes$3.SOCKET_ERROR,
          error
        });
      };

      dispatch({
        type: actionTypes$3.SOCKET_READY,
        socket: sock
      });
    }
  }, [username]);
}

const HangoutContext = M();
function useHangoutContext() {
  const context = w$1(HangoutContext);

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
  const [state, dispatch] = p(reducer$1, initState$1);
  const {
    hangout
  } = state;
  const websocketHandler = useWebSocket({
    username,
    dispatch,
    socketUrl
  });
  l(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
  l(() => {
    if (hangout) {
      //from local storage
      loadMessages({
        dispatch,
        hangout
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
    }
  }, [hangout]);
  const value = h$1(() => [state, dispatch], [state]);
  return h(HangoutContext.Provider, _extends({
    value: value
  }, props));
}

function savePendingHangout({
  dispatch,
  name,
  hangout,
  online
}) {
  const {
    username,
    message,
    state,
    email
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

  if (message) {
    saveMessage({
      messageKey,
      username,
      message,
      dispatch
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
    updatedHangouts = hangouts.splice(hangoutIndex, 1, hangout);
  } else {
    updatedHangouts = [hangout];
  }

  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({
    type: actionTypes$3.HANGOUTS_UPDATED,
    hangouts: updatedHangouts
  });
}

function saveMessage({
  messageKey,
  username,
  message,
  dispatch
}) {
  const messages = JSON.parse(localStorage.getItem(messageKey));
  let updatedMessages = null;

  if (messages) {
    updatedMessages = [...messages, message];
  } else {
    updatedMessages = [message];
  }

  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  dispatch({
    type: actionTypes$3.MESSAGES_UPDATED,
    messages: updatedMessages
  });
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
  let updatedHangouts = null;
  updatedHangouts = hangouts.splice(hangoutIndex, 1, deliveredHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({
    type: actionTypes$3.HANGOUTS_UPDATED,
    hangouts: updatedHangouts
  });
  dispatch({
    type: actionTypes$3.HANGOUT_UPDATED,
    hangout: deliveredHangout
  });

  if (message) {
    updateDeliveredMessage({
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
  } = deliveredHangout; // save message to localStorage

  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const hangoutIndex = messages.findIndex(m => m.timestamp === message.timestamp);
  let updatedMessages = messages.splice(hangoutIndex, 1, deliveredHangout);
  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  dispatch({
    type: actionTypes$3.MESSAGES_UPDATED,
    messages: updatedMessages
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
  onAppRoute
}) {
  debugger;
  const {
    username,
    message
  } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = hangouts.findIndex(g => g.username === username);
  let updatedHangouts = null;

  if (hangouts) {
    if (focusedHangout.username === username) {
      updatedHangouts = hangouts.splice(hangoutIndex, 1, { ...hangout,
        read: true
      }); // sync message with reducer state
    } else {
      updatedHangouts = hangouts.splice(hangoutIndex, 1, { ...hangout,
        read: false
      });
    }
  } else {
    if (focusedHangout.username === username) {
      updatedHangouts = [{ ...hangout,
        read: true
      }];
    } else {
      updatedHangouts = [{ ...hangout,
        read: false
      }];
    }
  }

  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({
    type: actionTypes$3.HANGOUTS_UPDATED,
    hangouts: updatedHangouts
  });

  if (focusedHangout.username === username) {
    dispatch({
      type: actionTypes$3.SELECTED_HANGOUT,
      hangout
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
}
function saveRecievedMessage({
  dispatch,
  hangout,
  name,
  focusedHangout
}) {
  const {
    username,
    message,
    state,
    email
  } = hangout; // save message to localStorage

  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  let updatedMessages = null;

  if (messages) {
    if (focusedHangout.username === username) {
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
    if (focusedHangout.username === username) {
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

  if (focusedHangout.username === username) {
    // sync message with reducer state
    dispatch({
      type: actionTypes$3.MESSAGES_UPDATED,
      messages: updatedMessages
    });
  }
}

function saveInviter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute
}) {
  debugger;
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout
  });
}
function saveAccepter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout
  });
}
function saveBlocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout
  });
}
function saveDecliner(dispatch, hangout, name, focusedHangout, onAppRoute) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout
  });
}
function saveMessanger({
  dispatch,
  hangout,
  name,
  focusedHangout
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout
  });
} // END saveMessanger

function saveUnblocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute
}) {
  saveRecievedHangout({
    dispatch,
    hangout,
    name,
    onAppRoute,
    focusedHangout
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

      case hangoutStates.UNBLOCKED:
        saveUnblovked({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });

      case hangoutStates.DECLINED:
        saveDeclined({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });

      case hangoutStates.BLOCKED:
        saveBlocked({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline
        });

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
    hangout
  }) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
        saveAccepter({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute
        });
        break;

      case hangoutStates.BLOCKER:
        saveBlocker({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute
        });
        break;

      case hangoutStates.DECLINER:
        saveDecliner({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute
        });
        break;

      case hangoutStates.INVITER:
        saveInviter({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute
        });
        break;

      case hangoutStates.MESSANGER:
        saveMessanger({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute
        });
        break;

      case hangoutStates.UNBLOCKER:
        saveUnblocker({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute
        });
        break;
    }
  }

  function handleHangouts({
    hangouts
  }) {
    hangouts.forEach(hangout => {
      handleHangout({
        hangout
      });
    });
  }

  l(() => {
    if (socketMessage && username && focusedHangout) {
      switch (socketMessage.type) {
        case 'ACKHOWLEDGEMENT':
          handleAcknowledgement({
            hangout: socketMessage.hangout,
            offline: false
          });
          break;

        case 'HANGOUT':
          handleHangout({
            hangout: socketMessage.hangout
          });
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
  }, [socketMessage, username, focusedHangout]);
  return {};
}

function useHangouts() {
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
    socket
  } = state;
  const handleMessageRouter = useSocketMessage({
    dispatch,
    socketMessage,
    username,
    focusedHangout: hangout
  });
  l(() => {
    if (socket && readyState === 1 && username) {
      sendOfflineHangouts({
        name: username,
        dispatch,
        socket
      });
    }
  }, [socket, readyState, username]);

  function onSelectHangout(e) {
    const username = e.target.id;
    selectHangout({
      dispatch,
      username
    });
  }

  function onSelectUser(e) {
    const uname = e.target.id;
    const user = users.find(u => u.username === uname);
    selectUser({
      dispatch,
      user,
      username
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
    const command = e.target.id;
    const {
      email
    } = hangout;
    const timestamp = Date.now();
    const online = true;

    if (socket && readyState === 1) {
      socket.send(JSON.stringify({
        username: hangout.username,
        email,
        message: {
          text: messageText,
          timestamp
        },
        command,
        timestamp
      }));
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
      online
    });
  }

  return {
    onMessageText,
    messageText,
    onStartSearch,
    onSearch,
    search,
    onSelectHangout,
    onSelectUser,
    hangout,
    hangouts,
    users,
    username,
    messages,
    onHangout,
    readyState
  };
}

const PhoneDrawer = O(() => import('./PhoneDrawer-1a0a906b.js'));
const TabletDrawer = O(() => import('./TabletDrawer-f24ca55a.js'));
const LaptopDrawer = O(() => import('./LapTopDrawer-7e1a25ca.js'));
const DesktopDrawer = O(() => import('./DesktopDrawer-ef5582c6.js'));
function Navigation(props) {
  const {
    onAppRoute
  } = useAppRoute();
  const {
    readyState
  } = useHangouts();
  const [route, setRoute] = m$1('');
  const {
    userName
  } = useUserName();
  const {
    width,
    height,
    orientation,
    device
  } = useMediaQuery();
  const [open, setOpen] = m$1(false);
  const {
    children,
    drawerContent
  } = props;
  const theme = useThemeContext();

  function toggleDrawer(to) {
    setRoute(to);
    setOpen(prev => !prev);
  }

  const {
    dispatch
  } = useAuthContext();
  l(() => {
    if (localStorage.getItem('webcom')) {
      recoverLocalAuthState({
        dispatch,
        user: JSON.parse(localStorage.getItem('webcom'))
      });
    }
  }, []);

  function navToUnread() {
    debugger;
    onAppRoute({
      featureRoute: '/UNREAD',
      route: '/hangouts'
    });
  }

  return h(AppShell, null, route === '/phone' && open ? h(M$1, {
    fallback: h("div", null, "Loading...")
  }, h(PhoneDrawer, {
    onClick: toggleDrawer
  }, drawerContent)) : null, route === '/tablet' && open ? h(M$1, {
    fallback: h("div", null, "Loading...")
  }, h(TabletDrawer, {
    onClick: toggleDrawer
  }, drawerContent)) : null, route === '/laptop' && open ? h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(LaptopDrawer, {
    onClick: toggleDrawer
  }, drawerContent)) : null, route === '/desktop' && open ? h(M$1, {
    fallback: h("div", null, "Loading...")
  }, h(DesktopDrawer, {
    onClick: toggleDrawer
  }, drawerContent), ' ') : null, h(AppBar, null, h(MenuWhite, {
    onClick: toggleDrawer,
    device: device,
    id: "menu"
  }), children, h(NavItem, null, userName), h(NavItem, {
    onClick: navToUnread
  }, "Unread"), h(NavItem, null, h(OnlineStatus, {
    readyState: readyState
  }))));
}
function NavItem(props) {
  const {
    children
  } = props;
  return h("div", _extends({
    className: "nav-item"
  }, props), children);
}

const Login = O(() => import('./Login-4794244a.js'));
const ChangePassword = O(() => import('./ChangePassword-ffc236e0.js'));
const ForgotPassword = O(() => import('./ForgotPassword-28b6a1cd.js'));
const Signup = O(() => import('./Signup-0983746c.js'));
const Profile = O(() => import('./Profile-fc041fd9.js'));
const AuthFeedback = O(() => import('./AuthFeedback-fc896f02.js'));
function Authentication({
  children
}) {
  return h("div", null, h(FeatureRoute, {
    path: "/changepassword"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(ChangePassword, null))), h(FeatureRoute, {
    path: "/login"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Login, null))), h(FeatureRoute, {
    path: "/signup"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Signup, null))), h(FeatureRoute, {
    path: "/forgotpassword"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(ForgotPassword, null))), h(FeatureRoute, {
    path: "/profile"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Profile, null))), h(FeatureRoute, {
    path: "/authfeedback"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(AuthFeedback, null))));
}

function DrawerContent({
  authContent,
  otherContent
}) {
  return h("div", null, h("div", null, authContent), h("div", null, otherContent));
}

var css_248z$1 = ".drawer-list-item:hover {\n  background-color: #f5f5f5;\n  cursor: pointer;\n}\n\n.drawer-list-item * {\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n}\n\n.btn {\n  padding: 6px 16px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: none;\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n  min-width: 64px;\n  font-weight: 500;\n  font-size: 0.875rem;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}";
styleInject(css_248z$1);

function List({
  children,
  id
}) {
  return h("div", {
    "data-testid": id,
    style: {
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      paddingTop: 8,
      paddingBottom: 8,
      width: '100%'
    }
  }, children);
}
function ListItem({
  children,
  onClick,
  id
}) {
  return h("div", {
    id: id,
    "data-testid": id,
    onClick: onClick,
    className: "drawer-list-item",
    style: {
      boxSizing: 'border-box',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      display: 'flex'
    }
  }, children);
}

const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBBsILS1Yf9JIAAADoElEQVRo3r2ZS0hUURjHf3Mti9BSM2lR0tPJhEjSViEE1aKNlRUVJFEQFFEkbu21K7GINhFFRA+CliUtatNL3ITRNKERBlELdUbH7KGmc1vcrjPjzL33fGfu+H2LgXvO9/9995wz53UDSK2MOqpYQwXFFFEA/CTGED10E+YV/WJFZavlMiHimC4eJ0QbNX6j59PMR1fwdA/TTKE/8BLOMyiC2z7IOYqzgwdopF8LbnuUUxi6+FW8yQpu+2tW6uB3MuQL3sTkB/tkcIMrvsFtb1Pvinwe+I43MbnPbDV8e07wJiZPvFMIcCdneBOTB14d4X/fT/dWN/yenONNTPY74VcSm5EEYqzI3Pv+TDsq/pJAAmvbEW7KJgu+8pAeIMh+lgpjD3En9UEJA6J3+EMTeVPReTTzRxTfR1FqAhdE4WNsT3unrcIUziQHzxcuuMcyNutxkUY0eb/QLArtSBo5qcO4U6TTlAgNiQJ3OQ4t2TwStsNqRWG/yHdMIJ9fIq1qMMB5ZspoHYw7lo3TKdI6YCWwTRTU61r6RaS1BQzKWCsKirmWRkVa6yg1qHMY0042x7V0rkjLoM6gShQCS1xLy4VqVQZBYUitS1lAfCYKGlQIQ8qpdiyr8WifdKswKBWGwEnHkhNirVKIiKYOE5MJh4beyIRYawDGxEEmn1mUhi+jV0NpVC8Bk24qU/CVdGvpjOp0gR26eAo/T7gXSOoCg5/igWPZp6S7kN981FQZMYhohP3lOpuIJz3ZzE0mNJQiiM+Bo9xwOG6v5pZ4RN2Ds4LqcR6yzPWNlvNIlEALNChXjlGv1Kz1DCtr7oQyj3sv278JJu1KvitpTlrz8HuFqmMuK0Am28C4gmqXtSN6riDYRpcogbdcUaj1zPqpURj5C0V4gEUK/4j1duWwR8V2MR7gqYdqCPh/X3HbQ6pDK4E3HuVJ1EKPo1mDVgLux5QIBYkWGOGaq1RMKwH3qKvWKmTviIvpybDG2zaiNc/Pcrmu7iPIcOqjw6IpNFs/mJ5TgNczhn+R+SwyU5dUQ5kvqQB2z0gCzsd7oC3n+IvuIzfA7Zzi73vfmc/O4WX1Y7X78lncygn+rhre6ohWn+FxLgqvAdih+a0skw+zVwa3bAUvfcG/YLkO3uqKRvqygkc5Km366VbEGaJa8AgtLMgOblsBTXwQwUOcttZ7P62aVt4x6QqepItLib2eSi9LrZQ61lJJBSVJn+8Hpz7fC8+a/wC1ZAXs3UhUHAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNC0yN1QwODo0NTo0NSswMDowMBawSVQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDQtMjdUMDg6NDU6NDUrMDA6MDBn7fHoAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==";

const style$1 = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 5% auto',
    justifyItems: 'center'
  }
};
function AuthContent() {
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
    style: style$1.grid
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

const initState$2 = {
  validation: {}
};
function formReducer(state, action) {
  let nextState = null;

  switch (action.type) {
    case actionTypes$2.SERVER_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes$2.CLIENT_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes$2.RESET_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$2.INPUT_FOCUSED:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE,
          [action.propName]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$2.INIT_FORM_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE
        }
      };

    case actionTypes$2.INC_INPUT_COUTN:
      return { ...state,
        count: state.count + 1
      };

    default:
      return state;
  }
}

const FormContext = M();
function useFormContext() {
  const context = w$1(FormContext);

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
  const [state, dispatch] = p(formReducer, initState$2);
  const value = h$1(() => [state, dispatch], [state]);
  return h(FormContext.Provider, _extends({
    value: value
  }, props));
}

function OtherContent() {
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
    id: "chat"
  }, "Chat"), h(ListItem, null, "Item Two"), h(ListItem, {
    onClick: handleRoute,
    id: "hangouts"
  }, "Hangout"), h(ListItem, {
    onClick: handleRoute,
    id: "group"
  }, "Group")));
}

function Home() {
  return h("div", {
    "data-testid": "home"
  }, "Home");
}

const Hangouts = O(() => import('./index-05f43969.js'));
const Group = O(() => import('./group-9b0116f9.js'));
function App() {
  return h(AuthProvider, null, h(HangoutsProvider, {
    socketUrl: "ws://localhost:3000/hangouts"
  }, h(FormProvider, null, h(ThemeProvider, {
    initState: {
      primary: {
        background: '#6200EE',
        color: '#ffffff',
        fontFamily: 'Roboto, Helvetica, "Arial"'
      }
    }
  }, h(Navigation, {
    drawerContent: h(DrawerContent, {
      authContent: h(AuthContent, null),
      otherContent: h(OtherContent, null)
    })
  }, h(NavItem, null, "WEB COM")), h(AppRoute, {
    path: "/auth"
  }, h(Authentication, null)), h(AppRoute, {
    path: "/"
  }, h(Home, null)), h(AppRoute, {
    path: "/hangouts"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Hangouts, null))), h(AppRoute, {
    path: "/group"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Group, null))), ''))));
}

H(h(AppRouteProvider, {
  title: "Webcom",
  initState: {
    route: '/hangouts',
    featureRoute: '/hangouts'
  }
}, h(App, null)), document.body);

export { FeatureRoute as F, List as L, M$1 as M, O, _extends as _, useAppRoute as a, useMediaQuery as b, useAuthContext as c, useFormContext as d, valueChanged as e, login as f, validationStates as g, h, isClientValidationType as i, clientValidation as j, useThemeContext as k, l, m$1 as m, useUserName as n, getTokenFromUrl as o, changePassword as p, forgotPassword as q, resetInputValidationState as r, styleInject as s, signup as t, useHangouts as u, validationTypes as v, ListItem as w, d$1 as x };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMDdkMGJlZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9jb21wYXQvZGlzdC9jb21wYXQubW9kdWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L3RoZW1lL3RoZW1lLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L2ljb25zL29ubGluZVN0YXR1cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L2ljb25zL01lbnVXaGl0ZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvQXBwU2hlbGwuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L0FwcEJhci5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC91c2VVc2VyTmFtZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25TdGF0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uUmVnZXguanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9jb25zdHJhaW50VmFsaWRhdG9ycy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vaHR0cC1zdGF0dXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlV2ViU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2F2ZVBlbmRpbmdIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMuanMiLCIuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy91cGRhdGVEZWxpdmVyZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvc2F2ZVJlY2lldmVkSGFuZ291dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldE1lc3NhZ2UuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L05hdmlnYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvRHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvTmF2TGlzdC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2ljb25zL3VzZXI2NC5wbmciLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm1SZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvT3RoZXJDb250ZW50LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvSG9tZS5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0FwcC5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBzdXBwb3J0ID0ge1xuICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICBibG9iOlxuICAgICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmXG4gICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbn1cblxuZnVuY3Rpb24gaXNEYXRhVmlldyhvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBEYXRhVmlldy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihvYmopXG59XG5cbmlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICBdXG5cbiAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICBBcnJheUJ1ZmZlci5pc1ZpZXcgfHxcbiAgICBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gIH1cbiAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgfVxuICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG5mdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpdGVyYXRvclxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpdGVyYXRvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gIHRoaXMubWFwID0ge31cblxuICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbihoZWFkZXIpIHtcbiAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0sIHRoaXMpXG4gIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICB9LCB0aGlzKVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIHZhciBvbGRWYWx1ZSA9IHRoaXMubWFwW25hbWVdXG4gIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSArICcsICcgKyB2YWx1ZSA6IHZhbHVlXG59XG5cbkhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMubWFwW25hbWVdLCBuYW1lLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2gobmFtZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaXRlbXMucHVzaCh2YWx1ZSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSlcbiAgfSlcbiAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxufVxuXG5pZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xufVxuXG5mdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpKVxuICB9XG4gIGJvZHkuYm9keVVzZWQgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICB9XG4gICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgIGNoYXJzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2aWV3W2ldKVxuICB9XG4gIHJldHVybiBjaGFycy5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgaWYgKGJ1Zi5zbGljZSkge1xuICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgfSBlbHNlIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZikpXG4gICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gIH1cbn1cblxuZnVuY3Rpb24gQm9keSgpIHtcbiAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUZvcm1EYXRhID0gYm9keVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgdGhpcy5fYm9keUluaXQgPSBuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5ID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbnZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICByZXR1cm4gbWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEgPyB1cGNhc2VkIDogbWV0aG9kXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICB9XG4gICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgdGhpcy5zaWduYWwgPSBpbnB1dC5zaWduYWxcbiAgICBpZiAoIWJvZHkgJiYgaW5wdXQuX2JvZHlJbml0ICE9IG51bGwpIHtcbiAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgfVxuXG4gIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJ1xuICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIH1cbiAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICB0aGlzLnNpZ25hbCA9IG9wdGlvbnMuc2lnbmFsIHx8IHRoaXMuc2lnbmFsXG4gIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgfVxuICB0aGlzLl9pbml0Qm9keShib2R5KVxufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywge2JvZHk6IHRoaXMuX2JvZHlJbml0fSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKVxuICBib2R5XG4gICAgLnRyaW0oKVxuICAgIC5zcGxpdCgnJicpXG4gICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gIHJldHVybiBmb3JtXG59XG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMwI3NlY3Rpb24tMy4yXG4gIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gIHByZVByb2Nlc3NlZEhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICBpZiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGhlYWRlcnNcbn1cblxuQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxufVxuXG5Cb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgdXJsOiB0aGlzLnVybFxuICB9KVxufVxuXG5SZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cblJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxufVxuXG5leHBvcnQgdmFyIERPTUV4Y2VwdGlvbiA9IHNlbGYuRE9NRXhjZXB0aW9uXG50cnkge1xuICBuZXcgRE9NRXhjZXB0aW9uKClcbn0gY2F0Y2ggKGVycikge1xuICBET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB2YXIgZXJyb3IgPSBFcnJvcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFja1xuICB9XG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERPTUV4Y2VwdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwgJiYgcmVxdWVzdC5zaWduYWwuYWJvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICB9XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICB9XG5cbiAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgfSlcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCkge1xuICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBET05FIChzdWNjZXNzIG9yIGZhaWx1cmUpXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICB9KVxufVxuXG5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcblxuaWYgKCFzZWxmLmZldGNoKSB7XG4gIHNlbGYuZmV0Y2ggPSBmZXRjaFxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG59XG4iLCJ2YXIgbixsLHUsaSx0LG8scixmLGU9e30sYz1bXSxhPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkfGl0ZXJhL2k7ZnVuY3Rpb24gcyhuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobixsLHUpe3ZhciBpLHQ9YXJndW1lbnRzLG89e307Zm9yKGkgaW4gbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJihvW2ldPWxbaV0pO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mylmb3IodT1bdV0saT0zO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspdS5wdXNoKHRbaV0pO2lmKG51bGwhPXUmJihvLmNoaWxkcmVuPXUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm51bGwhPW4uZGVmYXVsdFByb3BzKWZvcihpIGluIG4uZGVmYXVsdFByb3BzKXZvaWQgMD09PW9baV0mJihvW2ldPW4uZGVmYXVsdFByb3BzW2ldKTtyZXR1cm4geShuLG8sbCYmbC5rZXksbCYmbC5yZWYsbnVsbCl9ZnVuY3Rpb24geShsLHUsaSx0LG8pe3ZhciByPXt0eXBlOmwscHJvcHM6dSxrZXk6aSxyZWY6dCxfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpvfTtyZXR1cm4gbnVsbD09byYmKHIuX192PXIpLG4udm5vZGUmJm4udm5vZGUocikscn1mdW5jdGlvbiBwKCl7cmV0dXJue319ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBtKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIHcobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP3cobi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/dyhuKTpudWxsfWZ1bmN0aW9uIGsobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBrKG4pfX1mdW5jdGlvbiBnKGwpeyghbC5fX2QmJihsLl9fZD0hMCkmJnUucHVzaChsKSYmIWkrK3x8byE9PW4uZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bi5kZWJvdW5jZVJlbmRlcmluZyl8fHQpKF8pfWZ1bmN0aW9uIF8oKXtmb3IodmFyIG47aT11Lmxlbmd0aDspbj11LnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLHU9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsaSx0LG8scixmO24uX19kJiYocj0obz0obD1uKS5fX3YpLl9fZSwoZj1sLl9fUCkmJih1PVtdLChpPXMoe30sbykpLl9fdj1pLHQ9eihmLG8saSxsLl9fbix2b2lkIDAhPT1mLm93bmVyU1ZHRWxlbWVudCxudWxsLHUsbnVsbD09cj93KG8pOnIpLFQodSxvKSx0IT1yJiZrKG8pKSl9KX1mdW5jdGlvbiBiKG4sbCx1LGksdCxvLHIsZixhLHMpe3ZhciBoLHAsbSxrLGcsXyxiLHgsQSxQPWkmJmkuX19rfHxjLEM9UC5sZW5ndGg7Zm9yKGE9PWUmJihhPW51bGwhPXI/clswXTpDP3coaSwwKTpudWxsKSx1Ll9faz1bXSxoPTA7aDxsLmxlbmd0aDtoKyspaWYobnVsbCE9KGs9dS5fX2tbaF09bnVsbD09KGs9bFtoXSl8fFwiYm9vbGVhblwiPT10eXBlb2Ygaz9udWxsOlwic3RyaW5nXCI9PXR5cGVvZiBrfHxcIm51bWJlclwiPT10eXBlb2Ygaz95KG51bGwsayxudWxsLG51bGwsayk6QXJyYXkuaXNBcnJheShrKT95KGQse2NoaWxkcmVuOmt9LG51bGwsbnVsbCxudWxsKTpudWxsIT1rLl9fZXx8bnVsbCE9ay5fX2M/eShrLnR5cGUsay5wcm9wcyxrLmtleSxudWxsLGsuX192KTprKSl7aWYoay5fXz11LGsuX19iPXUuX19iKzEsbnVsbD09PShtPVBbaF0pfHxtJiZrLmtleT09bS5rZXkmJmsudHlwZT09PW0udHlwZSlQW2hdPXZvaWQgMDtlbHNlIGZvcihwPTA7cDxDO3ArKyl7aWYoKG09UFtwXSkmJmsua2V5PT1tLmtleSYmay50eXBlPT09bS50eXBlKXtQW3BdPXZvaWQgMDticmVha31tPW51bGx9aWYoZz16KG4sayxtPW18fGUsdCxvLHIsZixhLHMpLChwPWsucmVmKSYmbS5yZWYhPXAmJih4fHwoeD1bXSksbS5yZWYmJngucHVzaChtLnJlZixudWxsLGspLHgucHVzaChwLGsuX19jfHxnLGspKSxudWxsIT1nKXtpZihudWxsPT1iJiYoYj1nKSxBPXZvaWQgMCx2b2lkIDAhPT1rLl9fZClBPWsuX19kLGsuX19kPXZvaWQgMDtlbHNlIGlmKHI9PW18fGchPWF8fG51bGw9PWcucGFyZW50Tm9kZSl7bjppZihudWxsPT1hfHxhLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoZyksQT1udWxsO2Vsc2V7Zm9yKF89YSxwPTA7KF89Xy5uZXh0U2libGluZykmJnA8QztwKz0yKWlmKF89PWcpYnJlYWsgbjtuLmluc2VydEJlZm9yZShnLGEpLEE9YX1cIm9wdGlvblwiPT11LnR5cGUmJihuLnZhbHVlPVwiXCIpfWE9dm9pZCAwIT09QT9BOmcubmV4dFNpYmxpbmcsXCJmdW5jdGlvblwiPT10eXBlb2YgdS50eXBlJiYodS5fX2Q9YSl9ZWxzZSBhJiZtLl9fZT09YSYmYS5wYXJlbnROb2RlIT1uJiYoYT13KG0pKX1pZih1Ll9fZT1iLG51bGwhPXImJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUudHlwZSlmb3IoaD1yLmxlbmd0aDtoLS07KW51bGwhPXJbaF0mJnYocltoXSk7Zm9yKGg9QztoLS07KW51bGwhPVBbaF0mJkQoUFtoXSxQW2hdKTtpZih4KWZvcihoPTA7aDx4Lmxlbmd0aDtoKyspaih4W2hdLHhbKytoXSx4WysraF0pfWZ1bmN0aW9uIHgobil7cmV0dXJuIG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2Ygbj9bXTpBcnJheS5pc0FycmF5KG4pP2MuY29uY2F0LmFwcGx5KFtdLG4ubWFwKHgpKTpbbl19ZnVuY3Rpb24gQShuLGwsdSxpLHQpe3ZhciBvO2ZvcihvIGluIHUpXCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fG8gaW4gbHx8QyhuLG8sbnVsbCx1W29dLGkpO2ZvcihvIGluIGwpdCYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtvXXx8XCJjaGlsZHJlblwiPT09b3x8XCJrZXlcIj09PW98fFwidmFsdWVcIj09PW98fFwiY2hlY2tlZFwiPT09b3x8dVtvXT09PWxbb118fEMobixvLGxbb10sdVtvXSxpKX1mdW5jdGlvbiBQKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09XCJudW1iZXJcIj09dHlwZW9mIHUmJiExPT09YS50ZXN0KGwpP3UrXCJweFwiOm51bGw9PXU/XCJcIjp1fWZ1bmN0aW9uIEMobixsLHUsaSx0KXt2YXIgbyxyLGYsZSxjO2lmKHQ/XCJjbGFzc05hbWVcIj09PWwmJihsPVwiY2xhc3NcIik6XCJjbGFzc1wiPT09bCYmKGw9XCJjbGFzc05hbWVcIiksXCJzdHlsZVwiPT09bClpZihvPW4uc3R5bGUsXCJzdHJpbmdcIj09dHlwZW9mIHUpby5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgaSYmKG8uY3NzVGV4dD1cIlwiLGk9bnVsbCksaSlmb3IoZSBpbiBpKXUmJmUgaW4gdXx8UChvLGUsXCJcIik7aWYodSlmb3IoYyBpbiB1KWkmJnVbY109PT1pW2NdfHxQKG8sYyx1W2NdKX1lbHNlXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0/KHI9bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxmPWwudG9Mb3dlckNhc2UoKSxsPShmIGluIG4/ZjpsKS5zbGljZSgyKSx1PyhpfHxuLmFkZEV2ZW50TGlzdGVuZXIobCxOLHIpLChuLmx8fChuLmw9e30pKVtsXT11KTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCxOLHIpKTpcImxpc3RcIiE9PWwmJlwidGFnTmFtZVwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInR5cGVcIiE9PWwmJlwic2l6ZVwiIT09bCYmIXQmJmwgaW4gbj9uW2xdPW51bGw9PXU/XCJcIjp1OlwiZnVuY3Rpb25cIiE9dHlwZW9mIHUmJlwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwmJihsIT09KGw9bC5yZXBsYWNlKC9eeGxpbms6Py8sXCJcIikpP251bGw9PXV8fCExPT09dT9uLnJlbW92ZUF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSk6bi5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCksdSk6bnVsbD09dXx8ITE9PT11JiYhL15hci8udGVzdChsKT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLHUpKX1mdW5jdGlvbiBOKGwpe3RoaXMubFtsLnR5cGVdKG4uZXZlbnQ/bi5ldmVudChsKTpsKX1mdW5jdGlvbiB6KGwsdSxpLHQsbyxyLGYsZSxjKXt2YXIgYSx2LGgseSxwLHcsayxnLF8seCxBLFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7KGE9bi5fX2IpJiZhKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGc9dS5wcm9wcyxfPShhPVAuY29udGV4dFR5cGUpJiZ0W2EuX19jXSx4PWE/Xz9fLnByb3BzLnZhbHVlOmEuX186dCxpLl9fYz9rPSh2PXUuX19jPWkuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGcseCk6KHUuX19jPXY9bmV3IG0oZyx4KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9RSksXyYmXy5zdWIodiksdi5wcm9wcz1nLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9eCx2Ll9fbj10LGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPXMoe30sdi5fX3MpKSxzKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGcsdi5fX3MpKSkseT12LnByb3BzLHA9di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmchPT15JiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhnLHgpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoZyx2Ll9fcyx4KXx8dS5fX3Y9PT1pLl9fdil7Zm9yKHYucHJvcHM9Zyx2LnN0YXRlPXYuX19zLHUuX192IT09aS5fX3YmJih2Ll9fZD0hMSksdi5fX3Y9dSx1Ll9fZT1pLl9fZSx1Ll9faz1pLl9fayx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxhPTA7YTx1Ll9fay5sZW5ndGg7YSsrKXUuX19rW2FdJiYodS5fX2tbYV0uX189dSk7YnJlYWsgbn1udWxsIT12LmNvbXBvbmVudFdpbGxVcGRhdGUmJnYuY29tcG9uZW50V2lsbFVwZGF0ZShnLHYuX19zLHgpLG51bGwhPXYuY29tcG9uZW50RGlkVXBkYXRlJiZ2Ll9faC5wdXNoKGZ1bmN0aW9uKCl7di5jb21wb25lbnREaWRVcGRhdGUoeSxwLHcpfSl9di5jb250ZXh0PXgsdi5wcm9wcz1nLHYuc3RhdGU9di5fX3MsKGE9bi5fX3IpJiZhKHUpLHYuX19kPSExLHYuX192PXUsdi5fX1A9bCxhPXYucmVuZGVyKHYucHJvcHMsdi5zdGF0ZSx2LmNvbnRleHQpLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYodD1zKHMoe30sdCksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fCh3PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUoeSxwKSksQT1udWxsIT1hJiZhLnR5cGU9PWQmJm51bGw9PWEua2V5P2EucHJvcHMuY2hpbGRyZW46YSxiKGwsQXJyYXkuaXNBcnJheShBKT9BOltBXSx1LGksdCxvLHIsZixlLGMpLHYuYmFzZT11Ll9fZSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSxrJiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09aS5fX3Y/KHUuX19rPWkuX19rLHUuX19lPWkuX19lKTp1Ll9fZT0kKGkuX19lLHUsaSx0LG8scixmLGMpOyhhPW4uZGlmZmVkKSYmYSh1KX1jYXRjaChsKXt1Ll9fdj1udWxsLG4uX19lKGwsdSxpKX1yZXR1cm4gdS5fX2V9ZnVuY3Rpb24gVChsLHUpe24uX19jJiZuLl9fYyh1LGwpLGwuc29tZShmdW5jdGlvbih1KXt0cnl7bD11Ll9faCx1Ll9faD1bXSxsLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobCl7bi5fX2UobCx1Ll9fdil9fSl9ZnVuY3Rpb24gJChuLGwsdSxpLHQsbyxyLGYpe3ZhciBhLHMsdixoLHkscD11LnByb3BzLGQ9bC5wcm9wcztpZih0PVwic3ZnXCI9PT1sLnR5cGV8fHQsbnVsbCE9bylmb3IoYT0wO2E8by5sZW5ndGg7YSsrKWlmKG51bGwhPShzPW9bYV0pJiYoKG51bGw9PT1sLnR5cGU/Mz09PXMubm9kZVR5cGU6cy5sb2NhbE5hbWU9PT1sLnR5cGUpfHxuPT1zKSl7bj1zLG9bYV09bnVsbDticmVha31pZihudWxsPT1uKXtpZihudWxsPT09bC50eXBlKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKTtuPXQ/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixsLnR5cGUpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobC50eXBlLGQuaXMmJntpczpkLmlzfSksbz1udWxsLGY9ITF9aWYobnVsbD09PWwudHlwZSlwIT09ZCYmbi5kYXRhIT1kJiYobi5kYXRhPWQpO2Vsc2V7aWYobnVsbCE9byYmKG89Yy5zbGljZS5jYWxsKG4uY2hpbGROb2RlcykpLHY9KHA9dS5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD1kLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFmKXtpZihudWxsIT1vKWZvcihwPXt9LHk9MDt5PG4uYXR0cmlidXRlcy5sZW5ndGg7eSsrKXBbbi5hdHRyaWJ1dGVzW3ldLm5hbWVdPW4uYXR0cmlidXRlc1t5XS52YWx1ZTsoaHx8dikmJihoJiZ2JiZoLl9faHRtbD09di5fX2h0bWx8fChuLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfUEobixkLHAsdCxmKSxoP2wuX19rPVtdOihhPWwucHJvcHMuY2hpbGRyZW4sYihuLEFycmF5LmlzQXJyYXkoYSk/YTpbYV0sbCx1LGksXCJmb3JlaWduT2JqZWN0XCIhPT1sLnR5cGUmJnQsbyxyLGUsZikpLGZ8fChcInZhbHVlXCJpbiBkJiZ2b2lkIDAhPT0oYT1kLnZhbHVlKSYmYSE9PW4udmFsdWUmJkMobixcInZhbHVlXCIsYSxwLnZhbHVlLCExKSxcImNoZWNrZWRcImluIGQmJnZvaWQgMCE9PShhPWQuY2hlY2tlZCkmJmEhPT1uLmNoZWNrZWQmJkMobixcImNoZWNrZWRcIixhLHAuY2hlY2tlZCwhMSkpfXJldHVybiBufWZ1bmN0aW9uIGoobCx1LGkpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP2wodSk6bC5jdXJyZW50PXV9Y2F0Y2gobCl7bi5fX2UobCxpKX19ZnVuY3Rpb24gRChsLHUsaSl7dmFyIHQsbyxyO2lmKG4udW5tb3VudCYmbi51bm1vdW50KGwpLCh0PWwucmVmKSYmKHQuY3VycmVudCYmdC5jdXJyZW50IT09bC5fX2V8fGoodCxudWxsLHUpKSxpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnR5cGV8fChpPW51bGwhPShvPWwuX19lKSksbC5fX2U9bC5fX2Q9dm9pZCAwLG51bGwhPSh0PWwuX19jKSl7aWYodC5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7dC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGwpe24uX19lKGwsdSl9dC5iYXNlPXQuX19QPW51bGx9aWYodD1sLl9faylmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXRbcl0mJkQodFtyXSx1LGkpO251bGwhPW8mJnYobyl9ZnVuY3Rpb24gRShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBIKGwsdSxpKXt2YXIgdCxvLGY7bi5fXyYmbi5fXyhsLHUpLG89KHQ9aT09PXIpP251bGw6aSYmaS5fX2t8fHUuX19rLGw9aChkLG51bGwsW2xdKSxmPVtdLHoodSwodD91Oml8fHUpLl9faz1sLG98fGUsZSx2b2lkIDAhPT11Lm93bmVyU1ZHRWxlbWVudCxpJiYhdD9baV06bz9udWxsOnUuY2hpbGROb2Rlcy5sZW5ndGg/Yy5zbGljZS5jYWxsKHUuY2hpbGROb2Rlcyk6bnVsbCxmLGl8fGUsdCksVChmLGwpfWZ1bmN0aW9uIEkobixsKXtIKG4sbCxyKX1mdW5jdGlvbiBMKG4sbCl7dmFyIHUsaTtmb3IoaSBpbiBsPXMocyh7fSxuLnByb3BzKSxsKSxhcmd1bWVudHMubGVuZ3RoPjImJihsLmNoaWxkcmVuPWMuc2xpY2UuY2FsbChhcmd1bWVudHMsMikpLHU9e30sbClcImtleVwiIT09aSYmXCJyZWZcIiE9PWkmJih1W2ldPWxbaV0pO3JldHVybiB5KG4udHlwZSx1LGwua2V5fHxuLmtleSxsLnJlZnx8bi5yZWYsbnVsbCl9ZnVuY3Rpb24gTShuKXt2YXIgbD17fSx1PXtfX2M6XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIGksdD10aGlzO3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KGk9W10sdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbFt1Ll9fY109dCxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0LnByb3BzLnZhbHVlIT09bi52YWx1ZSYmaS5zb21lKGZ1bmN0aW9uKGwpe2wuY29udGV4dD1uLnZhbHVlLGcobCl9KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7aS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe2kuc3BsaWNlKGkuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LkNvbnN1bWVyLmNvbnRleHRUeXBlPXUsdS5Qcm92aWRlci5fXz11LHV9bj17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZih1LmNvbnN0cnVjdG9yJiZudWxsIT11LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKGk9ITAsdS5zZXRTdGF0ZSh1LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSkpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJihpPSEwLHUuY29tcG9uZW50RGlkQ2F0Y2gobikpLGkpcmV0dXJuIGcodS5fX0U9dSl9Y2F0Y2gobCl7bj1sfXRocm93IG59fSxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxtLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9dGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPXMoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bih1LHRoaXMucHJvcHMpKSxuJiZzKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLGcodGhpcykpfSxtLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksZyh0aGlzKSl9LG0ucHJvdG90eXBlLnJlbmRlcj1kLHU9W10saT0wLHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQscj1lLGY9MDtleHBvcnR7SCBhcyByZW5kZXIsSSBhcyBoeWRyYXRlLGggYXMgY3JlYXRlRWxlbWVudCxoLGQgYXMgRnJhZ21lbnQscCBhcyBjcmVhdGVSZWYsbCBhcyBpc1ZhbGlkRWxlbWVudCxtIGFzIENvbXBvbmVudCxMIGFzIGNsb25lRWxlbWVudCxNIGFzIGNyZWF0ZUNvbnRleHQseCBhcyB0b0NoaWxkQXJyYXksRCBhcyBfdW5tb3VudCxuIGFzIG9wdGlvbnN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIG59ZnJvbVwicHJlYWN0XCI7dmFyIHQsdSxyLGk9MCxvPVtdLGM9bi5fX3IsZj1uLmRpZmZlZCxlPW4uX19jLGE9bi51bm1vdW50O2Z1bmN0aW9uIHYodCxyKXtuLl9faCYmbi5fX2godSx0LGl8fHIpLGk9MDt2YXIgbz11Ll9fSHx8KHUuX19IPXtfXzpbXSxfX2g6W119KTtyZXR1cm4gdD49by5fXy5sZW5ndGgmJm8uX18ucHVzaCh7fSksby5fX1t0XX1mdW5jdGlvbiBtKG4pe3JldHVybiBpPTEscChFLG4pfWZ1bmN0aW9uIHAobixyLGkpe3ZhciBvPXYodCsrLDIpO3JldHVybiBvLnQ9bixvLl9fY3x8KG8uX19jPXUsby5fXz1baT9pKHIpOkUodm9pZCAwLHIpLGZ1bmN0aW9uKG4pe3ZhciB0PW8udChvLl9fWzBdLG4pO28uX19bMF0hPT10JiYoby5fX1swXT10LG8uX19jLnNldFN0YXRlKHt9KSl9XSksby5fX31mdW5jdGlvbiBsKHIsaSl7dmFyIG89dih0KyssMyk7IW4uX19zJiZ4KG8uX19ILGkpJiYoby5fXz1yLG8uX19IPWksdS5fX0guX19oLnB1c2gobykpfWZ1bmN0aW9uIHkocixpKXt2YXIgbz12KHQrKyw0KTshbi5fX3MmJngoby5fX0gsaSkmJihvLl9fPXIsby5fX0g9aSx1Ll9faC5wdXNoKG8pKX1mdW5jdGlvbiBkKG4pe3JldHVybiBpPTUsaChmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gcyhuLHQsdSl7aT02LHkoZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odCgpKTpuJiYobi5jdXJyZW50PXQoKSl9LG51bGw9PXU/dTp1LmNvbmNhdChuKSl9ZnVuY3Rpb24gaChuLHUpe3ZhciByPXYodCsrLDcpO3JldHVybiB4KHIuX19ILHUpPyhyLl9fSD11LHIuX19oPW4sci5fXz1uKCkpOnIuX199ZnVuY3Rpb24gVChuLHQpe3JldHVybiBpPTgsaChmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiB3KG4pe3ZhciByPXUuY29udGV4dFtuLl9fY10saT12KHQrKyw5KTtyZXR1cm4gaS5fX2M9bixyPyhudWxsPT1pLl9fJiYoaS5fXz0hMCxyLnN1Yih1KSksci5wcm9wcy52YWx1ZSk6bi5fX31mdW5jdGlvbiBBKHQsdSl7bi51c2VEZWJ1Z1ZhbHVlJiZuLnVzZURlYnVnVmFsdWUodT91KHQpOnQpfWZ1bmN0aW9uIEYobil7dmFyIHI9dih0KyssMTApLGk9bSgpO3JldHVybiByLl9fPW4sdS5jb21wb25lbnREaWRDYXRjaHx8KHUuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obil7ci5fXyYmci5fXyhuKSxpWzFdKG4pfSksW2lbMF0sZnVuY3Rpb24oKXtpWzFdKHZvaWQgMCl9XX1mdW5jdGlvbiBfKCl7by5zb21lKGZ1bmN0aW9uKHQpe2lmKHQuX19QKXRyeXt0Ll9fSC5fX2guZm9yRWFjaChnKSx0Ll9fSC5fX2guZm9yRWFjaChxKSx0Ll9fSC5fX2g9W119Y2F0Y2godSl7cmV0dXJuIHQuX19ILl9faD1bXSxuLl9fZSh1LHQuX192KSwhMH19KSxvPVtdfWZ1bmN0aW9uIGcobil7XCJmdW5jdGlvblwiPT10eXBlb2Ygbi51JiZuLnUoKX1mdW5jdGlvbiBxKG4pe24udT1uLl9fKCl9ZnVuY3Rpb24geChuLHQpe3JldHVybiFufHx0LnNvbWUoZnVuY3Rpb24odCx1KXtyZXR1cm4gdCE9PW5bdV19KX1mdW5jdGlvbiBFKG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9bi5fX3I9ZnVuY3Rpb24obil7YyYmYyhuKSx0PTA7dmFyIHI9KHU9bi5fX2MpLl9fSDtyJiYoci5fX2guZm9yRWFjaChnKSxyLl9faC5mb3JFYWNoKHEpLHIuX19oPVtdKX0sbi5kaWZmZWQ9ZnVuY3Rpb24odCl7ZiYmZih0KTt2YXIgdT10Ll9fYzt1JiZ1Ll9fSCYmdS5fX0guX19oLmxlbmd0aCYmKDEhPT1vLnB1c2godSkmJnI9PT1uLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8KChyPW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXx8ZnVuY3Rpb24obil7dmFyIHQsdT1mdW5jdGlvbigpe2NsZWFyVGltZW91dChyKSxjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSxyPXNldFRpbWVvdXQodSwxMDApO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJih0PXJlcXVlc3RBbmltYXRpb25GcmFtZSh1KSl9KShfKSl9LG4uX19jPWZ1bmN0aW9uKHQsdSl7dS5zb21lKGZ1bmN0aW9uKHQpe3RyeXt0Ll9faC5mb3JFYWNoKGcpLHQuX19oPXQuX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8cShuKX0pfWNhdGNoKHIpe3Uuc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHU9W10sbi5fX2Uocix0Ll9fdil9fSksZSYmZSh0LHUpfSxuLnVubW91bnQ9ZnVuY3Rpb24odCl7YSYmYSh0KTt2YXIgdT10Ll9fYztpZih1JiZ1Ll9fSCl0cnl7dS5fX0guX18uZm9yRWFjaChnKX1jYXRjaCh0KXtuLl9fZSh0LHUuX192KX19O2V4cG9ydHttIGFzIHVzZVN0YXRlLHAgYXMgdXNlUmVkdWNlcixsIGFzIHVzZUVmZmVjdCx5IGFzIHVzZUxheW91dEVmZmVjdCxkIGFzIHVzZVJlZixzIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUsaCBhcyB1c2VNZW1vLFQgYXMgdXNlQ2FsbGJhY2ssdyBhcyB1c2VDb250ZXh0LEEgYXMgdXNlRGVidWdWYWx1ZSxGIGFzIHVzZUVycm9yQm91bmRhcnl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9va3MubW9kdWxlLmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID17XG4gICAgQVBQX1JPVVRFX0NIQU5HRUQ6J0FQUF9ST1VURV9DSEFOR0VEJyxcbiAgICBGRUFUVVJFX1JPVVRFX0NIQU5HRUQ6J0ZFQVRVUkVfUk9VVEVfQ0hBTkdFRCdcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgYWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQ6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm91dGU6IGFjdGlvbi5yb3V0ZSxmZWF0dXJlUm91dGU6IGFjdGlvbi5mZWF0dXJlUm91dGUgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlUmVkdWNlcix1c2VNZW1vLHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7cmVkdWNlcn0gZnJvbSAnLi9yZWR1Y2VyJ1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5jb25zdCBBcHBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG4gZnVuY3Rpb24gdXNlQXBwUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwcFJvdXRlQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwcFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGgsIHBhdGhzIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXSA9IHVzZUFwcFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCB7ZmVhdHVyZVJvdXRlfT1zdGF0ZVxyXG5cclxuICBpZiAocGF0aCAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiBmZWF0dXJlUm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IGZlYXR1cmVSb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcFJvdXRlICgpe1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlQXBwUm91dGVDb250ZXh0KClcclxuXHJcbiAgZnVuY3Rpb24gb25BcHBSb3V0ZSh7cm91dGUsZmVhdHVyZVJvdXRlfSl7XHJcbiAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlLHJvdXRlfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7b25BcHBSb3V0ZX1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHtpbml0U3RhdGV9PXByb3BzXHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VSZWR1Y2VyKHJlZHVjZXIsaW5pdFN0YXRlKVxyXG5cclxuXHJcbmNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxBcHBSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydHt1c2VTdGF0ZSBhcyBuLHVzZVJlZHVjZXIgYXMgdCx1c2VFZmZlY3QgYXMgZSx1c2VMYXlvdXRFZmZlY3QgYXMgcix1c2VSZWYgYXMgbyx1c2VJbXBlcmF0aXZlSGFuZGxlIGFzIHUsdXNlTWVtbyBhcyBpLHVzZUNhbGxiYWNrIGFzIGYsdXNlQ29udGV4dCBhcyBjLHVzZURlYnVnVmFsdWUgYXMgYX1mcm9tXCJwcmVhY3QvaG9va3NcIjtleHBvcnQqZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e0NvbXBvbmVudCBhcyBsLGNyZWF0ZUVsZW1lbnQgYXMgcyxvcHRpb25zIGFzIHYsdG9DaGlsZEFycmF5IGFzIGgsaHlkcmF0ZSBhcyBkLHJlbmRlciBhcyBwLF91bm1vdW50IGFzIG0sY2xvbmVFbGVtZW50IGFzIHksY3JlYXRlUmVmIGFzIGIsY3JlYXRlQ29udGV4dCBhcyBTLEZyYWdtZW50IGFzIGd9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2NyZWF0ZUVsZW1lbnQsY3JlYXRlQ29udGV4dCxjcmVhdGVSZWYsRnJhZ21lbnQsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2Z1bmN0aW9uIHcobix0KXtmb3IodmFyIGUgaW4gdCluW2VdPXRbZV07cmV0dXJuIG59ZnVuY3Rpb24geChuLHQpe2Zvcih2YXIgZSBpbiBuKWlmKFwiX19zb3VyY2VcIiE9PWUmJiEoZSBpbiB0KSlyZXR1cm4hMDtmb3IodmFyIHIgaW4gdClpZihcIl9fc291cmNlXCIhPT1yJiZuW3JdIT09dFtyXSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgRT1mdW5jdGlvbihuKXt2YXIgdCxlO2Z1bmN0aW9uIHIodCl7dmFyIGU7cmV0dXJuKGU9bi5jYWxsKHRoaXMsdCl8fHRoaXMpLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwLGV9cmV0dXJuIGU9biwodD1yKS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Ll9fcHJvdG9fXz1lLHIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuLHQpe3JldHVybiB4KHRoaXMucHJvcHMsbil8fHgodGhpcy5zdGF0ZSx0KX0scn0obCk7ZnVuY3Rpb24gQyhuLHQpe2Z1bmN0aW9uIGUobil7dmFyIGU9dGhpcy5wcm9wcy5yZWYscj1lPT1uLnJlZjtyZXR1cm4hciYmZSYmKGUuY2FsbD9lKG51bGwpOmUuY3VycmVudD1udWxsKSx0PyF0KHRoaXMucHJvcHMsbil8fCFyOngodGhpcy5wcm9wcyxuKX1mdW5jdGlvbiByKHQpe3JldHVybiB0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1lLHMobix0KX1yZXR1cm4gci5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD0hMCxyLmRpc3BsYXlOYW1lPVwiTWVtbyhcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIixyLnQ9ITAscn12YXIgXz12Ll9fYjt2Ll9fYj1mdW5jdGlvbihuKXtuLnR5cGUmJm4udHlwZS50JiZuLnJlZiYmKG4ucHJvcHMucmVmPW4ucmVmLG4ucmVmPW51bGwpLF8mJl8obil9O3ZhciBBPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5mb3J3YXJkX3JlZlwiKXx8MzkxMTtmdW5jdGlvbiBrKG4pe2Z1bmN0aW9uIHQodCxlKXt2YXIgcj13KHt9LHQpO3JldHVybiBkZWxldGUgci5yZWYsbihyLHQucmVmfHxlKX1yZXR1cm4gdC4kJHR5cGVvZj1BLHQucmVuZGVyPXQsdC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD10LnQ9ITAsdC5kaXNwbGF5TmFtZT1cIkZvcndhcmRSZWYoXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsdH12YXIgUj1mdW5jdGlvbihuLHQpe3JldHVybiBuP2gobikucmVkdWNlKGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gbi5jb25jYXQodChlLHIpKX0sW10pOm51bGx9LEY9e21hcDpSLGZvckVhY2g6Uixjb3VudDpmdW5jdGlvbihuKXtyZXR1cm4gbj9oKG4pLmxlbmd0aDowfSxvbmx5OmZ1bmN0aW9uKG4pe2lmKDEhPT0obj1oKG4pKS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuXCIpO3JldHVybiBuWzBdfSx0b0FycmF5Omh9LE49di5fX2U7ZnVuY3Rpb24gVShuKXtyZXR1cm4gbiYmKChuPXcoe30sbikpLl9fYz1udWxsLG4uX19rPW4uX19rJiZuLl9fay5tYXAoVSkpLG59ZnVuY3Rpb24gTSgpe3RoaXMuX191PTAsdGhpcy5vPW51bGwsdGhpcy5fX2I9bnVsbH1mdW5jdGlvbiBMKG4pe3ZhciB0PW4uX18uX19jO3JldHVybiB0JiZ0LnUmJnQudShuKX1mdW5jdGlvbiBPKG4pe3ZhciB0LGUscjtmdW5jdGlvbiBvKG8pe2lmKHR8fCh0PW4oKSkudGhlbihmdW5jdGlvbihuKXtlPW4uZGVmYXVsdHx8bn0sZnVuY3Rpb24obil7cj1ufSkscil0aHJvdyByO2lmKCFlKXRocm93IHQ7cmV0dXJuIHMoZSxvKX1yZXR1cm4gby5kaXNwbGF5TmFtZT1cIkxhenlcIixvLnQ9ITAsb31mdW5jdGlvbiBQKCl7dGhpcy5pPW51bGwsdGhpcy5sPW51bGx9di5fX2U9ZnVuY3Rpb24obix0LGUpe2lmKG4udGhlbilmb3IodmFyIHIsbz10O289by5fXzspaWYoKHI9by5fX2MpJiZyLl9fYylyZXR1cm4gci5fX2Mobix0Ll9fYyk7TihuLHQsZSl9LChNLnByb3RvdHlwZT1uZXcgbCkuX19jPWZ1bmN0aW9uKG4sdCl7dmFyIGU9dGhpcztudWxsPT1lLm8mJihlLm89W10pLGUuby5wdXNoKHQpO3ZhciByPUwoZS5fX3YpLG89ITEsdT1mdW5jdGlvbigpe298fChvPSEwLHI/cihpKTppKCkpfTt0Ll9fYz10LmNvbXBvbmVudFdpbGxVbm1vdW50LHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1KCksdC5fX2MmJnQuX19jKCl9O3ZhciBpPWZ1bmN0aW9uKCl7dmFyIG47aWYoIS0tZS5fX3UpZm9yKGUuX192Ll9fa1swXT1lLnN0YXRlLnUsZS5zZXRTdGF0ZSh7dTplLl9fYj1udWxsfSk7bj1lLm8ucG9wKCk7KW4uZm9yY2VVcGRhdGUoKX07ZS5fX3UrK3x8ZS5zZXRTdGF0ZSh7dTplLl9fYj1lLl9fdi5fX2tbMF19KSxuLnRoZW4odSx1KX0sTS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMuX19iJiYodGhpcy5fX3YuX19rWzBdPVUodGhpcy5fX2IpLHRoaXMuX19iPW51bGwpLFtzKGwsbnVsbCx0LnU/bnVsbDpuLmNoaWxkcmVuKSx0LnUmJm4uZmFsbGJhY2tdfTt2YXIgVz1mdW5jdGlvbihuLHQsZSl7aWYoKytlWzFdPT09ZVswXSYmbi5sLmRlbGV0ZSh0KSxuLnByb3BzLnJldmVhbE9yZGVyJiYoXCJ0XCIhPT1uLnByb3BzLnJldmVhbE9yZGVyWzBdfHwhbi5sLnNpemUpKWZvcihlPW4uaTtlOyl7Zm9yKDtlLmxlbmd0aD4zOyllLnBvcCgpKCk7aWYoZVsxXTxlWzBdKWJyZWFrO24uaT1lPWVbMl19fTsoUC5wcm90b3R5cGU9bmV3IGwpLnU9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcyxlPUwodC5fX3YpLHI9dC5sLmdldChuKTtyZXR1cm4gclswXSsrLGZ1bmN0aW9uKG8pe3ZhciB1PWZ1bmN0aW9uKCl7dC5wcm9wcy5yZXZlYWxPcmRlcj8oci5wdXNoKG8pLFcodCxuLHIpKTpvKCl9O2U/ZSh1KTp1KCl9fSxQLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obil7dGhpcy5pPW51bGwsdGhpcy5sPW5ldyBNYXA7dmFyIHQ9aChuLmNoaWxkcmVuKTtuLnJldmVhbE9yZGVyJiZcImJcIj09PW4ucmV2ZWFsT3JkZXJbMF0mJnQucmV2ZXJzZSgpO2Zvcih2YXIgZT10Lmxlbmd0aDtlLS07KXRoaXMubC5zZXQodFtlXSx0aGlzLmk9WzEsMCx0aGlzLmldKTtyZXR1cm4gbi5jaGlsZHJlbn0sUC5wcm90b3R5cGUuY29tcG9uZW50RGlkVXBkYXRlPVAucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50PWZ1bmN0aW9uKCl7dmFyIG49dGhpcztuLmwuZm9yRWFjaChmdW5jdGlvbih0LGUpe1cobixlLHQpfSl9O3ZhciBqPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe312YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0fSx0LnJlbmRlcj1mdW5jdGlvbihuKXtyZXR1cm4gbi5jaGlsZHJlbn0sbn0oKTtmdW5jdGlvbiB6KG4pe3ZhciB0PXRoaXMsZT1uLmNvbnRhaW5lcixyPXMoaix7Y29udGV4dDp0LmNvbnRleHR9LG4udm5vZGUpO3JldHVybiB0LnMmJnQucyE9PWUmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpLHQucD0hMSksbi52bm9kZT90LnA/KGUuX19rPXQuX19rLHAocixlKSx0Ll9faz1lLl9fayk6KHQudj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSxkKFwiXCIsZSksZS5hcHBlbmRDaGlsZCh0LnYpLHQucD0hMCx0LnM9ZSxwKHIsZSx0LnYpLHQuX19rPXQudi5fX2spOnQucCYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCkpLHQuaD1yLHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpfSxudWxsfWZ1bmN0aW9uIEQobix0KXtyZXR1cm4gcyh6LHt2bm9kZTpuLGNvbnRhaW5lcjp0fSl9dmFyIEg9L14oPzphY2NlbnR8YWxpZ25tZW50fGFyYWJpY3xiYXNlbGluZXxjYXB8Y2xpcCg/IVBhdGhVKXxjb2xvcnxmaWxsfGZsb29kfGZvbnR8Z2x5cGgoPyFSKXxob3JpenxtYXJrZXIoPyFIfFd8VSl8b3ZlcmxpbmV8cGFpbnR8c3RvcHxzdHJpa2V0aHJvdWdofHN0cm9rZXx0ZXh0KD8hTCl8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZWN0b3J8dmVydHx3b3JkfHdyaXRpbmd8eCg/IUMpKVtBLVpdLztsLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXt9O3ZhciBUPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpfHw2MDEwMztmdW5jdGlvbiBWKG4sdCxlKXtpZihudWxsPT10Ll9faylmb3IoO3QuZmlyc3RDaGlsZDspdC5yZW1vdmVDaGlsZCh0LmZpcnN0Q2hpbGQpO3JldHVybiBwKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH1mdW5jdGlvbiBaKG4sdCxlKXtyZXR1cm4gZChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9dmFyIEk9di5ldmVudDtmdW5jdGlvbiAkKG4sdCl7bltcIlVOU0FGRV9cIit0XSYmIW5bdF0mJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLHQse2NvbmZpZ3VyYWJsZTohMSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tcIlVOU0FGRV9cIit0XX0sc2V0OmZ1bmN0aW9uKG4pe3RoaXNbXCJVTlNBRkVfXCIrdF09bn19KX12LmV2ZW50PWZ1bmN0aW9uKG4pe0kmJihuPUkobikpLG4ucGVyc2lzdD1mdW5jdGlvbigpe307dmFyIHQ9ITEsZT0hMSxyPW4uc3RvcFByb3BhZ2F0aW9uO24uc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7ci5jYWxsKG4pLHQ9ITB9O3ZhciBvPW4ucHJldmVudERlZmF1bHQ7cmV0dXJuIG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtvLmNhbGwobiksZT0hMH0sbi5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1mdW5jdGlvbigpe3JldHVybiB0fSxuLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBlfSxuLm5hdGl2ZUV2ZW50PW59O3ZhciBxPXtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xhc3N9fSxCPXYudm5vZGU7di52bm9kZT1mdW5jdGlvbihuKXtuLiQkdHlwZW9mPVQ7dmFyIHQ9bi50eXBlLGU9bi5wcm9wcztpZih0KXtpZihlLmNsYXNzIT1lLmNsYXNzTmFtZSYmKHEuZW51bWVyYWJsZT1cImNsYXNzTmFtZVwiaW4gZSxudWxsIT1lLmNsYXNzTmFtZSYmKGUuY2xhc3M9ZS5jbGFzc05hbWUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiY2xhc3NOYW1lXCIscSkpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpe3ZhciByLG8sdTtmb3IodSBpbiBlLmRlZmF1bHRWYWx1ZSYmdm9pZCAwIT09ZS52YWx1ZSYmKGUudmFsdWV8fDA9PT1lLnZhbHVlfHwoZS52YWx1ZT1lLmRlZmF1bHRWYWx1ZSksZGVsZXRlIGUuZGVmYXVsdFZhbHVlKSxBcnJheS5pc0FycmF5KGUudmFsdWUpJiZlLm11bHRpcGxlJiZcInNlbGVjdFwiPT09dCYmKGgoZS5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbihuKXstMSE9ZS52YWx1ZS5pbmRleE9mKG4ucHJvcHMudmFsdWUpJiYobi5wcm9wcy5zZWxlY3RlZD0hMCl9KSxkZWxldGUgZS52YWx1ZSksZSlpZihyPUgudGVzdCh1KSlicmVhaztpZihyKWZvcih1IGluIG89bi5wcm9wcz17fSxlKW9bSC50ZXN0KHUpP3UucmVwbGFjZSgvW0EtWjAtOV0vLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCk6dV09ZVt1XX0hZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlLHI9bi5wcm9wcztpZihyJiZcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIG89e307Zm9yKHZhciB1IGluIHIpL15vbihBbml8VHJhfFRvdSkvLnRlc3QodSkmJihyW3UudG9Mb3dlckNhc2UoKV09clt1XSxkZWxldGUgclt1XSksb1t1LnRvTG93ZXJDYXNlKCldPXU7aWYoby5vbmRvdWJsZWNsaWNrJiYoci5vbmRibGNsaWNrPXJbby5vbmRvdWJsZWNsaWNrXSxkZWxldGUgcltvLm9uZG91YmxlY2xpY2tdKSxvLm9uYmVmb3JlaW5wdXQmJihyLm9uYmVmb3JlaW5wdXQ9cltvLm9uYmVmb3JlaW5wdXRdLGRlbGV0ZSByW28ub25iZWZvcmVpbnB1dF0pLG8ub25jaGFuZ2UmJihcInRleHRhcmVhXCI9PT1lfHxcImlucHV0XCI9PT1lLnRvTG93ZXJDYXNlKCkmJiEvXmZpbHxjaGV8cmEvaS50ZXN0KHIudHlwZSkpKXt2YXIgaT1vLm9uaW5wdXR8fFwib25pbnB1dFwiO3JbaV18fChyW2ldPXJbby5vbmNoYW5nZV0sZGVsZXRlIHJbby5vbmNoYW5nZV0pfX19KCksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmIXQubSYmdC5wcm90b3R5cGUmJigkKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbE1vdW50XCIpLCQodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzXCIpLCQodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsVXBkYXRlXCIpLHQubT0hMCl9QiYmQihuKX07dmFyIEc9XCIxNi44LjBcIjtmdW5jdGlvbiBKKG4pe3JldHVybiBzLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBLKG4pe3JldHVybiEhbiYmbi4kJHR5cGVvZj09PVR9ZnVuY3Rpb24gUShuKXtyZXR1cm4gSyhuKT95LmFwcGx5KG51bGwsYXJndW1lbnRzKTpufWZ1bmN0aW9uIFgobil7cmV0dXJuISFuLl9fayYmKHAobnVsbCxuKSwhMCl9ZnVuY3Rpb24gWShuKXtyZXR1cm4gbiYmKG4uYmFzZXx8MT09PW4ubm9kZVR5cGUmJm4pfHxudWxsfXZhciBubj1mdW5jdGlvbihuLHQpe3JldHVybiBuKHQpfSx0bj1nO2V4cG9ydCBkZWZhdWx0e3VzZVN0YXRlOm4sdXNlUmVkdWNlcjp0LHVzZUVmZmVjdDplLHVzZUxheW91dEVmZmVjdDpyLHVzZVJlZjpvLHVzZUltcGVyYXRpdmVIYW5kbGU6dSx1c2VNZW1vOmksdXNlQ2FsbGJhY2s6Zix1c2VDb250ZXh0OmMsdXNlRGVidWdWYWx1ZTphLHZlcnNpb246XCIxNi44LjBcIixDaGlsZHJlbjpGLHJlbmRlcjpWLGh5ZHJhdGU6Wix1bm1vdW50Q29tcG9uZW50QXROb2RlOlgsY3JlYXRlUG9ydGFsOkQsY3JlYXRlRWxlbWVudDpzLGNyZWF0ZUNvbnRleHQ6UyxjcmVhdGVGYWN0b3J5OkosY2xvbmVFbGVtZW50OlEsY3JlYXRlUmVmOmIsRnJhZ21lbnQ6Zyxpc1ZhbGlkRWxlbWVudDpLLGZpbmRET01Ob2RlOlksQ29tcG9uZW50OmwsUHVyZUNvbXBvbmVudDpFLG1lbW86Qyxmb3J3YXJkUmVmOmssdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXM6bm4sU3RyaWN0TW9kZTpnLFN1c3BlbnNlOk0sU3VzcGVuc2VMaXN0OlAsbGF6eTpPfTtleHBvcnR7RyBhcyB2ZXJzaW9uLEYgYXMgQ2hpbGRyZW4sViBhcyByZW5kZXIsWiBhcyBoeWRyYXRlLFggYXMgdW5tb3VudENvbXBvbmVudEF0Tm9kZSxEIGFzIGNyZWF0ZVBvcnRhbCxKIGFzIGNyZWF0ZUZhY3RvcnksUSBhcyBjbG9uZUVsZW1lbnQsSyBhcyBpc1ZhbGlkRWxlbWVudCxZIGFzIGZpbmRET01Ob2RlLEUgYXMgUHVyZUNvbXBvbmVudCxDIGFzIG1lbW8sayBhcyBmb3J3YXJkUmVmLG5uIGFzIHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzLHRuIGFzIFN0cmljdE1vZGUsTSBhcyBTdXNwZW5zZSxQIGFzIFN1c3BlbnNlTGlzdCxPIGFzIGxhenl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGF0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5jb25zdCBzdHlsZSA9IHtcbiAgd2lkdGg6IDE1LFxuICBoZWlnaHQ6IDE1LFxuXG4gIGJvcmRlcjogJ3doaXRlIDJweCBzb2xpZCcsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIE9ubGluZVN0YXR1cyh7IHJlYWR5U3RhdGUgfSkge1xuICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgIHJldHVybiA8SXNPbmxpbmUgLz47XG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMCkge1xuICAgIHJldHVybiA8Q29ubmVjdGluZyAvPjtcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAyKSB7XG4gICAgcmV0dXJuIDxDbG9zaW5nIC8+O1xuICB9XG4gIHJldHVybiA8SXNPZmZsaW5lIC8+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNPbmxpbmUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvbmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT2ZmbGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncmVkJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJvZmZsaW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb25uZWN0aW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3RpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENsb3NpbmcoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3BpbmsnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cImNsb3NpbmdcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCAnLi4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBNZW51V2hpdGUoeyBvbkNsaWNrLCBkZXZpY2UsIGlkIH0pIHtcclxuICBmdW5jdGlvbiBoYW5kbGVPbkNsaWNrKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2RldicsIGRldmljZSk7XHJcbiAgICBzd2l0Y2ggKGRldmljZSkge1xyXG4gICAgICBjYXNlICdwaG9uZSc6XHJcbiAgICAgICAgb25DbGljaygnL3Bob25lJyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3RhYmxldCc6XHJcbiAgICAgICAgb25DbGljaygnL3RhYmxldCcpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdsYXB0b3AnOlxyXG4gICAgICAgIG9uQ2xpY2soJy9sYXB0b3AnKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnZGVza3RvcCc6XHJcbiAgICAgICAgb25DbGljaygnL2Rlc2t0b3AnKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBvbkNsaWNrPXtoYW5kbGVPbkNsaWNrfVxyXG4gICAgICBjbGFzc05hbWU9J21lbnUtd2hpdGUnXHJcbiAgICAgIHZpZXdCb3g9JzAgMCAyNCAyNCdcclxuICAgICAgZmlsbD0nd2hpdGUnXHJcbiAgICAgIHdpZHRoPScyNHB4J1xyXG4gICAgICBoZWlnaHQ9JzI0cHgnXHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9J00wIDBoMjR2MjRIMHonIGZpbGw9J25vbmUnIC8+XHJcbiAgICAgIDxwYXRoIGQ9J00zIDE4aDE4di0ySDN2MnptMC01aDE4di0ySDN2MnptMC03djJoMThWNkgzeicgLz5cclxuICAgIDwvc3ZnPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBTaGVsbCh7IGNoaWxkcmVuIH0pIHtcclxuICByZXR1cm4gPGRpdiA+e2NoaWxkcmVufTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlVGhlbWVDb250ZXh0IH0gZnJvbSAnLi4vdGhlbWUvdGhlbWUtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBCYXIoeyBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZUNvbnRleHQoKTtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIC4uLnRoZW1lLnByaW1hcnksXHJcbiAgICAgICAgLy8gcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgLy8gbGVmdDogMCxcclxuICAgICAgICAvLyB0b3A6IDAsXHJcbiAgICAgICAgbWluSGVpZ2h0OiA2NCxcclxuICAgICAgICBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiAxNixcclxuICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JyB9fT57Y2hpbGRyZW59PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IGRldmljZVR5cGUgZnJvbSAnLi9kZXZpY2VUeXBlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KCkge1xyXG4gIGNvbnN0IFt3aWR0aCwgc2V0V2lkdGhdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2hlaWdodCwgc2V0SGVpZ2h0XSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtvcmllbnRhdGlvbiwgc2V0T3JpZW50YXRpb25dID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtkZXZpY2UsIHNldERldmljZV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlVmlld3BvcnRTaXplKCkge1xyXG4gICBcclxuICAgICAgc2V0V2lkdGgod2luZG93LmlubmVyV2lkdGgpO1xyXG4gICAgICBzZXRIZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKSB7XHJcbiAgICBzZXRPcmllbnRhdGlvbih3aW5kb3cuc2NyZWVuLm9yaWVudGF0aW9uKTtcclxuICB9XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh3aWR0aCA+IDApIHtcclxuICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA2MDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3Bob25lJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDc2ODpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDk5MjpcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDEyMDA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ3RhYmxldCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdsYXB0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPiAyNTYwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdkZXNrdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFt3aWR0aF0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2RldmljZScsIGRldmljZSk7XHJcbiAgfSwgW2RldmljZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBoYW5kbGVWaWV3cG9ydFNpemUoKTtcclxuICAgIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gaGFuZGxlVmlld3BvcnRTaXplKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihoYW5kbGVTY3JlZW5PcmllbnRhdGlvbik7XHJcbiAgICB9O1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24sIGRldmljZSB9O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxVRV9DSEFOR0VEOiAnVkFMVUVfQ0hBTkdFRCcsXHJcbiAgTE9HSU5fU1RBUlRFRDogJ0xPR0lOX1NUQVJURUQnLFxyXG4gIExPR0lOX1NVQ0NFU1M6ICdMT0dJTl9TVUNDRVNTJyxcclxuICBMT0dJTl9GQUlMRUQ6ICdMT0dJTl9GQUlMRUQnLFxyXG5cclxuICBMT0dPVVRfU1RBUlRFRDogJ0xPR09VVF9TVEFSVEVEJyxcclxuICBMT0dPVVRfRkFJTEVEOiAnTE9HT1VUX0ZBSUxFRCcsXHJcbiAgTE9HT1VUX1NVQ0NFU1M6ICdMT0dPVVRfU1VDQ0VTUycsXHJcblxyXG4gIFNJR05VUF9TVEFSVEVEOiAnU0lHTlVQX1NUQVJURUQnLFxyXG4gIFNJR05VUF9TVUNDRVNTOiAnU0lHTlVQX1NVQ0NFU1MnLFxyXG4gIFNJR05VUF9GQUlMRUQ6ICdTSUdOVVBfRkFJTEVEJyxcclxuXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6ICdDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCcsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6ICdDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUycsXHJcbiAgQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDogJ0NIQU5HRV9QQVNTV09SRF9GQUlMRUQnLFxyXG5cclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUycsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCcsXHJcbiAgR09UX1RPS0VOX0ZST01fVVJMOiAnR09UX1RPS0VOX0ZST01fVVJMJyxcclxuXHJcbiAgUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOiAnUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFJyxcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGVtYWlsOiAnJyxcclxuICBwYXNzd29yZDogJycsXHJcbiAgc3VjY2VzczogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgdXNlcm5hbWU6ICcnLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGNvbmZpcm06ICcnLFxyXG4gIGN1cnJlbnQ6ICcnLFxyXG4gIGVtYWlsb3J1c2VybmFtZTogJycsXHJcbiAgdG9rZW46IG51bGwsXHJcbiAgaXNMb2dnZWRJbjogZmFsc2UsXHJcbiAgaXNQYXNzd29yZENoYW5nZWQ6IGZhbHNlLFxyXG4gIGF1dGhGZWVkYmFjazogbnVsbCxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhdXRoUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VEOlxyXG4gICAgICBjb25zdCBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgW2FjdGlvbi5wYXlsb2FkLnByb3BOYW1lXTogYWN0aW9uLnBheWxvYWQudmFsdWUsXHJcbiAgICAgIH07XHJcbiAgXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi5lbWFpbCxcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUsICcsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcclxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi5lbWFpbCxcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXHJcbiAgICAgICAgaXNQYXNzd29yZENoYW5nZWQ6IHRydWUsXHJcbiAgICAgICAgYXV0aEZlZWRiYWNrOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgYXV0aEZlZWRiYWNrOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHRva2VuOiBhY3Rpb24udG9rZW4gfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HT1VUX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7IC4uLmluaXRTdGF0ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VyLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24udXNlci5lbWFpbCxcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IEF1dGhSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFthdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG5cclxuICBpZiAoYXV0aFJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xyXG4gIGNvbnN0IHsgdG8sIGlkIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldFJvdXRlKHRvKTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxhXHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgey4uLnByb3BzfVxyXG4gICAgICBocmVmPXt0b31cclxuICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9XHJcbiAgICAgIHN0eWxlPXt7IHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiAnaW5oZXJpdCcgfX1cclxuICAgIC8+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGhSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aFJvdXRlQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhSb3V0ZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXV0aFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgaW5pdGlhbFJvdXRlIH0gPSBwcm9wcztcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlU3RhdGUoaW5pdGlhbFJvdXRlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0sIFthdXRoUm91dGVdKTtcclxuXHJcbiAgcmV0dXJuIDxBdXRoUm91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBhdXRoUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9hdXRoUmVkdWNlcic7XHJcbmltcG9ydCB7IEF1dGhSb3V0ZVByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLXJvdXRlLWNvbnRleHQnO1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZUF1dGhDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggQXBwUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXRlLFxyXG4gICAgZGlzcGF0Y2gsXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30+XHJcbiAgICAgIDxBdXRoUm91dGVQcm92aWRlcj57Y2hpbGRyZW59PC9BdXRoUm91dGVQcm92aWRlcj5cclxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlQXV0aENvbnRleHQsIEF1dGhQcm92aWRlciB9O1xyXG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VVc2VyTmFtZSgpIHtcclxuICBjb25zdCBbdXNlck5hbWUsIHNldFVzZXJuYW1lXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgeyBzdGF0ZSxkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIFxyXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpIHtcclxuIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwgfSA9IEpTT04ucGFyc2UoXHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxyXG4gICAgICApO1xyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzdGF0ZS50b2tlbikge1xyXG4gIFxyXG4gICAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdG9rZW4gfSA9c3RhdGU7XHJcbiAgICAgIC8vIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgLy8gICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgIC8vICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICB9XHJcbiAgfSwgW3N0YXRlXSk7XHJcblxyXG4gIHJldHVybiB7IHVzZXJOYW1lLCB0b2tlbiwgZW1haWwgfTtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgVkFMSUQ6ICdWQUxJRCcsXHJcbiAgSU5WQUxJRDogJ0lOVkFMSUQnLFxyXG4gIElOQUNUSVZFOiAnSU5BQ1RJVkUnXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2NvbnN0cmFpbnRcclxuICBFTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjogJ1BBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjogJ1VTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OJyxcclxuICBFTVBUWV9TVFJJTkdfVkFMSURBVElPTjogJ0VNUFRZX1NUUklOR19WQUxJREFUSU9OJyxcclxuICBQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjogJ1BBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OJyxcclxuICAvL2F1dGhcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnSU5WQUxJRF9DUkVERU5USUFMUycsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICdVU0VSTkFNRV9UQUtFTicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ1JFR0lTVEVSRURfRU1BSUwnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnRU1BSUxfTk9UX1JFR0lTVEVSRUQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOidVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIElOVkFMSURfUEFTU1dPUkQ6XHJcbiAgICAnYXQgbGVhc3QgOCBjaGFyYWN0ZXJzLCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMSB1cHBlcmNhc2UgbGV0dGVyLCAxIGxvd2VyY2FzZSBsZXR0ZXIsIENhbiBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycycsXHJcbiAgSU5WQUxJRF9FTUFJTDogJ2VtYWlsIGZvcm1hdCBpcyBub3QgdmFsaWQnLFxyXG4gIEVNQUlMX05PVF9SRUdJU1RFUkVEOiAnZW1haWwgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIFVTRVJOQU1FX05PVF9SRUdJU1RFUkVEOiAndXNlcm5hbWUgaXMgbm90IHJlZ2lzdGVyZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUU6XHJcbiAgICAnb25seSBMZXR0ZXJzIGEteiBvciBBLVogYW5kIHRoZSBTeW1ib2xzIC0gYW5kIF8gYXJlIGFsbG93ZWQnLFxyXG4gIElOVkFMSURfRU1QVFlfU1RSSU5HOiAnZW1wdHkgc3RyaW5nIGlzIG5vdCBhbGxvd2VkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMOiAnZW1haWwgb3IgdXNlcm5hbWUgaXMgbm90IHZhbGlkJyxcclxuICBJTlZBTElEX0NSRURFTlRJQUxTOiAnaW52YWxpZCBjcmVkZW50aWFscyBwcm92aWRlZCcsXHJcbiAgVVNFUk5BTUVfVEFLRU46ICd1c2VybmFtZSBpcyBhbHJlYWR5IHRha2VuJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnZW1haWwgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyxcclxuICBQQVNTV09SRFNfRE9fTk9UX01BVENIOiAncGFzc3dvcmRzIGRvIG5vdCBtYXRjaCdcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlthLXpBLVpdKS57OCx9JC9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/L2c7XHJcblxyXG5leHBvcnQgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9bYS16QS1aXStbLV9dKlthLXpBLVpdKy9nO1xyXG4iLCJpbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuaW1wb3J0IHsgZW1haWxSZWdleCwgcGFzc3dvcmRSZWdleCwgdXNlcm5hbWVSZWdleCB9IGZyb20gJy4vdmFsaWRhdGlvblJlZ2V4JztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxDb25zdHJhaW50KHsgZW1haWwgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdChlbWFpbCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0NsaWVudFZhbGlkYXRpb25UeXBlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHsgcGFzc3dvcmQgfSkge1xyXG4gIGNvbnN0IHBhc3N3b3JkQ29uc3RyYWludCA9IG5ldyBSZWdFeHAocGFzc3dvcmRSZWdleCk7XHJcbiAgaWYgKHBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbiAgaWYgKCFwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7IHVzZXJuYW1lIH0pIHtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodXNlcm5hbWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoeyB2YWx1ZSB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuICBjb25zdCB1c2VybmFtZUNvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHVzZXJuYW1lUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAodXNlcm5hbWVDb25zdHJhaW50LnRlc3QodmFsdWUpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pIHtcclxuICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSkge1xyXG5cclxuICBjb25zdCB7IHBhc3N3b3JkLCBjb25maXJtIH0gPWF1dGg7XHJcbmRlYnVnZ2VyO1xyXG4gIGlmIChwYXNzd29yZCA9PT0gJycgfHwgcGFzc3dvcmQgIT09IGNvbmZpcm0pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6ICdJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBSRVNFVF9WQUxJREFUSU9OX1NUQVRFOiAnUkVTRVRfVkFMSURBVElPTl9TVEFURScsXHJcbiAgICBJTlBVVF9CTFVSUkVEOiAnSU5QVVRfQkxVUlJFRCcsXHJcbiAgICBJTlBVVF9GT0NVU0VEOiAnSU5QVVRfRk9DVVNFRCcsXHJcbiAgXHJcbiAgICBTRVJWRVJfVkFMSURBVElPTjogJ1NFUlZFUl9WQUxJREFUSU9OJyxcclxuICAgIENMSUVOVF9WQUxJREFUSU9OOidDTElFTlRfVkFMSURBVElPTicsXHJcbiAgXHJcbiAgICBJTkNfSU5QVVRfQ09VVE4gOidJTkNfSU5QVVRfQ09VVE4nXHJcbiAgfTtcclxuICAiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9sb2dpblxyXG4gIGNyZWRlbnRpYWxJbnZhbGlkOiAnNDAxJyxcclxuICAvL3NpZ251cFxyXG4gIHVzZXJuYW1lSXNUYWtlbjogJzQwMicsXHJcbiAgZW1haWxJc1JlZ2lzdGVyZWQ6ICc0MDMnLFxyXG4gIHVzZXJuYW1lSW52YWxpZDogJzQwNScsXHJcbiAgcGFzc3dvcmRJbnZhbGlkOiAnNDA2JywgLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBlbWFpbEludmFsaWQ6ICc0MDcnLFxyXG4gIC8vbG9naW5cclxuICBlbWFpbElzTm90UmVnaXN0ZXJlZDogJzQwOCcsXHJcbiAgZW1wdHlTdHJpbmdOb3RWYWxpZDogJzQwOScsXHJcbiAgZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6JzQxMCcsXHJcbiAgdXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6JzQxMScsXHJcbi8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmREb05vdE1hdGNoOic0MTInLFxyXG4gIHRva2VuRXhwaXJlZDonNDEzJyxcclxuICBzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2U6IHN0YXR1cyA9PiB7XHJcbiAgICBpZiAoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPD0gNDEwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuIiwiXHJcbmltcG9ydCAqIGFzIHZhbGlkYXRpb25zIGZyb20gJy4vY29uc3RyYWludFZhbGlkYXRvcnMnO1xyXG5pbXBvcnQgY29uc3RWYWxUeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGVzIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4vaHR0cC1zdGF0dXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvbk1lc3NhZ2VzIGZyb20gJy4vdmFsaWRhdGlvbk1lc3NhZ2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGllbnRWYWxpZGF0aW9uKHsgdmFsaWRhdGlvblR5cGUsIHZhbHVlLCBzdGF0ZSxhdXRoIH0pIHtcclxuXHJcbiAgbGV0IHZhbGlkYXRpb24gPSBudWxsO1xyXG4gIHN3aXRjaCAodmFsaWRhdGlvblR5cGUpIHtcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxDb25zdHJhaW50KHtcclxuICAgICAgICBlbWFpbDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHtcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbXB0eVN0cmluZyh7IHZhbHVlIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgXHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT04sIC4uLnZhbGlkYXRpb24gfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXRGb3JtVmFsaWRhdGlvblN0YXRlKCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldElucHV0VmFsaWRhdGlvblN0YXRlKHsgdmFsaWRhdGlvblR5cGUgfSkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEUsIHZhbGlkYXRpb25UeXBlIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNJbnB1dENvdW50KCkge1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTiB9O1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlclZhbGlkYXRpb24oeyBzdGF0dXMgPSAwIH0pIHtcclxuXHJcbiAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5jcmVkZW50aWFsSW52YWxpZDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZEludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUludmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRSxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzUmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlJFR0lTVEVSRURfRU1BSUwsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlJFR0lTVEVSRURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzVGFrZW46XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1wdHlTdHJpbmdOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmREb05vdE1hdGNoOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyBzZXJ2ZXJWYWxpZGF0aW9uIH0gZnJvbSAnLi4vZm9ybS9hY3Rpb25zJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi4vZm9ybS9odHRwLXN0YXR1cyc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUgfSkge1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRCxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgcHJvcE5hbWUsXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCB9ID0gc3RhdGU7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9sb2dpbmAsIHtcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICdDb250ZW4tVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICcqJyxcclxuICAgICAgICBBdXRob3JpemF0aW9uOiBgQmFzaWMgJHtidG9hKGAke2VtYWlsb3J1c2VybmFtZX06JHtwYXNzd29yZH1gKX1gLFxyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gXHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTLCB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0pO1xyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgXHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgIFxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvZ2luIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbnVwKHsgZGlzcGF0Y2gsIGZvcm1EaXNwYXRjaCwgc3RhdGUgfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NUQVJURUQgfSk7XHJcbiAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIHVzZXJuYW1lIH0gPSBzdGF0ZTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvc2lnbnVwYCwge1xyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhc3N3b3JkLCBlbWFpbCwgdXNlcm5hbWUgfSksXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICBDb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUywgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbnVwIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVELCBwYXlsb2FkOiB7IGVycm9yIH0gfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd3ZWJjb20nKTtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUyB9O1xyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoLCB0b2tlbiB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCB9KTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBjb25maXJtLCBwYXNzd29yZCB9ID0gc3RhdGU7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpX3VybH0vYXV0aC9jaGFuZ2VwYXNzYCwge1xyXG4gICAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgY29uZmlybSxcclxuICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICB0b2tlbixcclxuICAgICAgfSksXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MsXHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgbWVzc2FnZTogYFBhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LmAsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgICBlcnJvcixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3IgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvcmdvdFBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkge1xyXG4gIGRlYnVnZ2VyO1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvcmVxdWVzdHBhc3NjaGFuZ2VgLCB7XHJcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVtYWlsIH0pLFxyXG4gICAgfSk7XHJcbiAgICBkZWJ1Z2dlcjtcclxuXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyxcclxuICAgICAgICB0b2tlbjogcmVzdWx0LnRva2VuLFxyXG4gICAgICAgIG1lc3NhZ2U6IGBBIGxpbmsgZm9yIHBhc3N3b3JkIGNoYW5nZSAgaGFzIGJlZW4gc2VudCB0bywgJHtlbWFpbH0hIGAsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCxcclxuICAgICAgICBlcnJvcixcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoYW5naW5nIHBhc3N3b3JkIGZhaWxlZCcpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW4gfSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkwsXHJcbiAgICB0b2tlbixcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjb3ZlckxvY2FsQXV0aFN0YXRlKHsgdXNlciwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFLCB1c2VyIH0pO1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcblxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXG5cbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXG4gICAgTE9BREVEX01FU1NBR0VTOiAnTE9BREVEX01FU1NBR0VTJyxcbiBcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxuXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxuICAgIFxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxuXG4gICAgU09DS0VUX01FU1NBR0VfUkVDSUVWRUQ6J1NPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEJyxcblxuICAgIFxuICAgIE1FU1NBR0VTX1VQREFURUQ6J01FU1NBR0VTX1VQREFURUQnLFxuICAgIEhBTkdPVVRTX1VQREFURUQ6J0hBTkdPVVRTX1VQREFURUQnLFxuICAgIEhBTkdPVVRfVVBEQVRFRDonSEFOR09VVF9VUERBVEVEJyxcbiAgICAvL1NPQ0tFVFxuXG4gICAgQ09OTkVDVElORzonQ09OTkVDVElORycsXG4gICAgT1BFTjonT1BFTicsXG4gICAgQ0xPU0lORzonQ0xPU0lORycsXG4gICAgQ0xPU0VEOidDTE9TRUQnLFxuICAgIFNPQ0tFVF9SRUFEWTonU09DS0VUX1JFQURZJyxcbiAgICBTT0NLRVRfRVJST1I6J1NPQ0tFVF9FUlJPUidcblxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xuICBoYW5nb3V0czogbnVsbCxcbiAgaGFuZ291dDogbnVsbCxcbiAgbWVzc2FnZXM6IG51bGwsXG4gIHNlYXJjaDogJycsXG4gIHVzZXI6IFtdLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgZXJyb3I6IG51bGwsXG4gIG1lc3NhZ2VUZXh0OiAnJyxcbiAgb25saW5lOiBmYWxzZSxcbiAgc29ja2V0OiBudWxsLFxuICByZWFkeVN0YXRlOiAwLFxuICBzb2NrZXRNZXNzYWdlOiBudWxsLFxufTtcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9VUERBVEVEOlxuICAgIFxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VTX1VQREFURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX01FU1NBR0VfUkVDSUVWRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc29ja2V0TWVzc2FnZTogYWN0aW9uLnNvY2tldE1lc3NhZ2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogYWN0aW9uLm1lc3NhZ2VzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlVGV4dDogYWN0aW9uLnRleHQgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcbiAgICAgIH07XG4gICAgLy9TT0NLRVRcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUjpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DT05ORUNUSU5HOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9QRU46XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0lORzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAyIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU09DS0VUX1JFQURZOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyByZWR1Y2VyVW5yZWFkaGFuZ291dHMgfSBmcm9tICcuL3JlZHVjZVVucmVhZGhhbmdvdXRzJztcbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXG5leHBvcnQgZnVuY3Rpb24gbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcbn1cbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pIHtcbiAgLy8gc2F2ZSBzZWxlY3RlZCB1c2VyIHRvIGhhbmdvdXRzXG4gIGNvbnN0IGhhbmdvdXQgPSB7IC4uLnVzZXIsIHN0YXRlOiAnSU5WSVRFJyB9O1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuXG4gIGlmIChoYW5nb3V0cykge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCxcbiAgICAgIEpTT04uc3RyaW5naWZ5KFsuLi5oYW5nb3V0cywgaGFuZ291dF0pXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcbiAgfVxuXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUiwgaGFuZ291dCB9KTtcbn1cbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xufVxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xufVxuXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcbiAgICApO1xuICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuZGVidWdnZXI7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGVyciA9IGVycm9yO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCwgdGV4dCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfQ09NTUFORF9TVEFSVEVEIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKHsgaGFuZ291dCwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZVVucmVhZCh7IHVucmVhZGhhbmdvdXRzLCBkaXNwYXRjaCB9KSB7XG4gIC8vIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuLCB1bnJlYWRoYW5nb3V0czogcmVkdWNlclVucmVhZGhhbmdvdXRzKHsgdW5yZWFkaGFuZ291dHMgfSkgfSk7XG59XG5cblxuXG5cblxuLy9FTkQgc2F2ZUludml0ZXJcblxuXG5cblxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdlYlNvY2tldCh7IHNvY2tldFVybCwgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodXNlcm5hbWUpIHtcbiAgICAgIGNvbnN0IHNvY2sgPSBuZXcgV2ViU29ja2V0KGAke3NvY2tldFVybH0vP3VzZXJuYW1lPSR7dXNlcm5hbWV9YCk7XG4gICAgICBzb2NrLm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVELCBzb2NrZXRNZXNzYWdlOiBtc2cgfSk7XG4gICBcbiAgICAgIH07XG4gICAgICBzb2NrLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT1BFTiB9KTtcbiAgICAgIH07XG4gICAgICBzb2NrLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xPU0VEIH0pO1xuICAgICAgfTtcbiAgICAgIHNvY2sub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUiwgZXJyb3IgfSk7XG4gICAgICB9O1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfUkVBRFksIHNvY2tldDogc29jayB9KTtcbiAgICB9XG4gIH0sIFt1c2VybmFtZV0pO1xufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge1xuICB1c2VDb250ZXh0LFxuICB1c2VTdGF0ZSxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlRWZmZWN0LFxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuaW1wb3J0IHtcbiAgbG9hZEhhbmdvdXRzLFxuICBmaWx0ZXJIYW5nb3V0cyxcbiAgZmV0Y2hIYW5nb3V0LFxuICBsb2FkTWVzc2FnZXMsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IHVzZVdlYlNvY2tldCB9IGZyb20gJy4vdXNlV2ViU29ja2V0JztcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IHsgc29ja2V0VXJsIH0gPSBwcm9wcztcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XG4gIGNvbnN0IHsgaGFuZ291dCB9ID0gc3RhdGU7XG4gIGNvbnN0IHdlYnNvY2tldEhhbmRsZXIgPSB1c2VXZWJTb2NrZXQoeyB1c2VybmFtZSwgZGlzcGF0Y2gsIHNvY2tldFVybCB9KTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodXNlcm5hbWUpIHtcbiAgICAgIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcbiAgICB9XG4gIH0sIFt1c2VybmFtZV0pO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChoYW5nb3V0KSB7XG4gICAgICAvL2Zyb20gbG9jYWwgc3RvcmFnZVxuICAgICAgbG9hZE1lc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSk7XG5cbiAgICAgIC8vc2F2ZSBoYW5nb3V0IHRvIGxvY2FsU3RvcmFnZVxuICAgICAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYDtcbiAgICAgIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcbiAgICAgIGlmICghaGFuZ291dHMpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGhhbmdvdXRFeGlzdCA9IGhhbmdvdXRzLmZpbmQoXG4gICAgICAgICAgKGcpID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWVcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGhhbmdvdXRFeGlzdCkge1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5nb3V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwgW2hhbmdvdXRdKTtcblxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIHNhdmVQZW5kaW5nSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvbmxpbmUgfSkge1xuXG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHN0YXRlLCBlbWFpbCB9ID0gaGFuZ291dDtcbiAgbGV0IGhhbmdvdXRLZXkgPSAnJztcbiAgbGV0IG1lc3NhZ2VLZXkgPSAnJztcbiAgaWYgKG9ubGluZSkge1xuICAgIGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1oYW5nb3V0c2A7XG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgfSBlbHNlIHtcbiAgICBoYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XG4gICAgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW9mZmxpbmUtbWVzc2FnZXNgO1xuICB9XG5cbiAgc2F2ZUhhbmdvdXQoeyBoYW5nb3V0S2V5LCB1c2VybmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KTtcbiAgaWYgKG1lc3NhZ2UpIHtcbiAgICBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIHVzZXJuYW1lLCBtZXNzYWdlLGRpc3BhdGNoIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG4gICAgdXBkYXRlZEhhbmdvdXRzID0gaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgaGFuZ291dCk7XG4gIH0gZWxzZSB7XG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW2hhbmdvdXRdO1xuICB9XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XG59XG5cbmZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgdXNlcm5hbWUsIG1lc3NhZ2UsZGlzcGF0Y2ggfSkge1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gbnVsbDtcbiAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCBtZXNzYWdlXTtcbiAgfSBlbHNlIHtcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbbWVzc2FnZV07XG4gIH1cbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcbn1cbiIsImltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnLi4vLi4vY2xpZW50Q29tbWFuZHMnO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBkaXNwYXRjaCwgc29ja2V0LCBuYW1lIH0pIHtcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xuICBpZiAob2ZmbGluZUhhbmdvdXRzKSB7XG4gICAgb2ZmbGluZUhhbmdvdXRzLmZvcmVFYWNoKChoKSA9PiB7XG4gICAgICBzb2NrZXQuc2VuZChcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHVzZXJuYW1lOiBoLnVzZXJuYW1lLFxuICAgICAgICAgIGVtYWlsOiBoLmVtYWlsLFxuICAgICAgICAgIG1lc3NhZ2U6IGgubWVzc2FnZSxcbiAgICAgICAgICB0aW1lc3RhbXA6IGgudGltZXN0YW1wLFxuICAgICAgICAgIGNvbW1hbmQ6IGguc3RhdGUsXG4gICAgICAgICAgb2ZmbGluZTogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuO1xufVxuIiwiXG4gIGV4cG9ydCBjb25zdCBoYW5nb3V0U3RhdGVzID0ge1xuICAgIElOVklURVI6ICdJTlZJVEVSJyxcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcbiAgICBERUNMSU5FUjogJ0RFQ0xJTkVSJyxcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInLFxuICAgLy8gYWNrbm93bGVnZW1lbnRcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXG4gICAgQUNDRVBURUQ6ICdBQ0NFUFRFRCcsXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCcsXG4gIH07IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IG5hbWUsIGRpc3BhdGNoLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlLCB0aW1lc3RhbXAgfSA9IGhhbmdvdXQ7XG4gIGNvbnN0IGRlbGl2ZXJlZEhhbmdvdXQgPSB7IC4uLmhhbmdvdXQsIGRlbGl2ZXJlZDogdHJ1ZSB9O1xuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xuICBjb25zdCBoYW5nb3V0SW5kZXggPSBoYW5nb3V0cy5maW5kSW5kZXgoKGcpID0+IGcudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0cyA9IG51bGw7XG4gIHVwZGF0ZWRIYW5nb3V0cyA9IGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIGRlbGl2ZXJlZEhhbmdvdXQpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUU19VUERBVEVELCBoYW5nb3V0czogdXBkYXRlZEhhbmdvdXRzIH0pO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfVVBEQVRFRCwgaGFuZ291dDogZGVsaXZlcmVkSGFuZ291dCB9KTtcbiAgaWYgKG1lc3NhZ2UpIHtcbiAgICB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQgfSk7XG4gIH1cblxuICBpZiAob2ZmbGluZSkge1xuICAgIC8vcmVtb3ZlIG9mZmxpbmUgaGFuZ291dFxuICAgIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XG4gICAgY29uc3Qgb2ZmbGluZWhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xuXG4gICAgaWYgKG9mZmxpbmVoYW5nb3V0cykge1xuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gb2ZmbGluZWhhbmdvdXRzLmZpbmRJbmRleChcbiAgICAgICAgKG8pID0+IG8udGltZXN0YW1wID09PSB0aW1lc3RhbXBcbiAgICAgICk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgb2ZmbGluZUhhbmdvdXRLZXksXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxKSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQgfSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IG1lc3NhZ2VzLmZpbmRJbmRleChcbiAgICAobSkgPT4gbS50aW1lc3RhbXAgPT09IG1lc3NhZ2UudGltZXN0YW1wXG4gICk7XG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBtZXNzYWdlcy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRIYW5nb3V0KTtcblxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xufVxuIiwiaW1wb3J0IHsgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCB9IGZyb20gJy4vdXBkYXRlRGVsaXZlcmVkSGFuZ291dCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGV9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWNjZXB0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZURlY2xpbmVkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb3ZrZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRIYW5nb3V0KHtcbiAgZGlzcGF0Y2gsXG4gIGhhbmdvdXQsXG4gIG5hbWUsXG4gIGZvY3VzZWRIYW5nb3V0LFxuICBvbkFwcFJvdXRlXG59KSB7XG4gIGRlYnVnZ2VyO1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xuXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XG4gIGNvbnN0IGhhbmdvdXRJbmRleCA9IGhhbmdvdXRzLmZpbmRJbmRleCgoZykgPT4gZy51c2VybmFtZSA9PT0gdXNlcm5hbWUpO1xuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgdXBkYXRlZEhhbmdvdXRzID0gaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xuICAgICAgICAuLi5oYW5nb3V0LFxuICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgfSk7XG4gICAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZWRIYW5nb3V0cyA9IGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcbiAgICAgICAgLi4uaGFuZ291dCxcbiAgICAgICAgcmVhZDogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgdXBkYXRlZEhhbmdvdXRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgLi4uaGFuZ291dCxcbiAgICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlZEhhbmdvdXRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgLi4uaGFuZ291dCxcbiAgICAgICAgICByZWFkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICB9XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XG4gIGlmIChmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIGhhbmdvdXQgfSk7XG4gICAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XG4gICAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XG4gICAgfVxuICB9XG4gIGlmIChtZXNzYWdlKSB7XG4gICAgc2F2ZVJlY2lldmVkTWVzc2FnZSh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLGZvY3VzZWRIYW5nb3V0IH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVjaWV2ZWRNZXNzYWdlKHtcbiAgZGlzcGF0Y2gsXG4gIGhhbmdvdXQsXG4gIG5hbWUsXG4gIGZvY3VzZWRIYW5nb3V0LFxufSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlLCBzdGF0ZSwgZW1haWwgfSA9IGhhbmdvdXQ7XG5cbiAgLy8gc2F2ZSBtZXNzYWdlIHRvIGxvY2FsU3RvcmFnZVxuICBjb25zdCBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obWVzc2FnZUtleSkpO1xuICBsZXQgdXBkYXRlZE1lc3NhZ2VzID0gbnVsbDtcbiAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogdHJ1ZSB9XTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlZE1lc3NhZ2VzID0gW3sgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IGZhbHNlIH1dO1xuICAgIH1cbiAgfVxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWVzc2FnZXMpKTtcblxuICBpZiAoZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgLy8gc3luYyBtZXNzYWdlIHdpdGggcmVkdWNlciBzdGF0ZVxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRCwgbWVzc2FnZXM6IHVwZGF0ZWRNZXNzYWdlcyB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgc2F2ZVJlY2lldmVkSGFuZ291dCB9IGZyb20gJy4vc2F2ZVJlY2lldmVkSGFuZ291dCc7XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZXIoe1xuICBkaXNwYXRjaCxcbiAgaGFuZ291dCxcbiAgbmFtZSxcbiAgZm9jdXNlZEhhbmdvdXQsXG4gIG9uQXBwUm91dGUsXG59KSB7XG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHN0YXRlLCBlbWFpbCB9ID0gaGFuZ291dDtcbmRlYnVnZ2VyO1xuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0IH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVyKHtcbiAgZGlzcGF0Y2gsXG4gIGhhbmdvdXQsXG4gIG5hbWUsXG4gIGZvY3VzZWRIYW5nb3V0LFxuICBvbkFwcFJvdXRlLFxufSkge1xuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0IH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrZXIoe1xuICBkaXNwYXRjaCxcbiAgaGFuZ291dCxcbiAgbmFtZSxcbiAgZm9jdXNlZEhhbmdvdXQsXG4gIG9uQXBwUm91dGUsXG59KSB7XG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZXIoXG4gIGRpc3BhdGNoLFxuICBoYW5nb3V0LFxuICBuYW1lLFxuICBmb2N1c2VkSGFuZ291dCxcbiAgb25BcHBSb3V0ZVxuKSB7XG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FuZ2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIGZvY3VzZWRIYW5nb3V0IH0pIHtcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCB9KTtcbn0gLy8gRU5EIHNhdmVNZXNzYW5nZXJcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb2NrZXIoe1xuICBkaXNwYXRjaCxcbiAgaGFuZ291dCxcbiAgbmFtZSxcbiAgZm9jdXNlZEhhbmdvdXQsXG4gIG9uQXBwUm91dGUsXG59KSB7XG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQgfSk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcbmltcG9ydCB7IGhhbmdvdXRTdGF0ZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcyc7XG5pbXBvcnQge1xuICBzYXZlSW52aXRlZCxcbiAgc2F2ZVVuYmxvdmtlZCxcbiAgc2F2ZURlY2xpbmVkLFxuICBzYXZlQmxvY2tlZCxcbiAgc2F2ZUFjY2VwdGVkLFxuICBzYXZlTWVzc2FnZWQsXG59IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMnO1xuaW1wb3J0IHtcbiAgc2F2ZUFjY2VwdGVyLFxuICBzYXZlQmxvY2tlcixcbiAgc2F2ZURlY2xpbmVyLFxuICBzYXZlSW52aXRlcixcbiAgc2F2ZU1lc3NhbmdlcixcbiAgc2F2ZVVuYmxvY2tlcixcbn0gZnJvbSAnLi9hY3Rpb25zL3JlY2lldmluZy1hY3Rpb25zJztcbmV4cG9ydCBmdW5jdGlvbiB1c2VTb2NrZXRNZXNzYWdlKHtcbiAgc29ja2V0TWVzc2FnZSxcbiAgdXNlcm5hbWUsXG4gIGRpc3BhdGNoLFxuICBmb2N1c2VkSGFuZ291dCxcbn0pIHtcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xuICBmdW5jdGlvbiBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0LG9mZmxpbmUgfSkge1xuICAgIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURUQ6XG4gICAgICAgIHNhdmVJbnZpdGVkKHtcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXG4gICAgICAgICAgb25BcHBSb3V0ZSxcbiAgICAgICAgICBvZmZsaW5lXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRDpcbiAgICAgICAgc2F2ZVVuYmxvdmtlZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxuICAgICAgICAgIG9uQXBwUm91dGUsXG4gICAgICAgICAgb2ZmbGluZVxuICAgICAgICB9KTtcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FRDpcbiAgICAgICAgc2F2ZURlY2xpbmVkKHtcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXG4gICAgICAgICAgb25BcHBSb3V0ZSxcbiAgICAgICAgICBvZmZsaW5lXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRUQ6XG4gICAgICAgIHNhdmVCbG9ja2VkKHtcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXG4gICAgICAgICAgb25BcHBSb3V0ZSxcbiAgICAgICAgICBvZmZsaW5lXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVEOlxuICAgICAgICBzYXZlQWNjZXB0ZWQoe1xuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgIGhhbmdvdXQsXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcbiAgICAgICAgICBvbkFwcFJvdXRlLFxuICAgICAgICAgIG9mZmxpbmVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQ6XG4gICAgICAgIHNhdmVNZXNzYWdlZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxuICAgICAgICAgIG9uQXBwUm91dGUsXG4gICAgICAgICAgb2ZmbGluZVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCB9KSB7XG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XG4gICAgICAgIHNhdmVBY2NlcHRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFUjpcbiAgICAgICAgc2F2ZUJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FUjpcbiAgICAgICAgc2F2ZURlY2xpbmVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcbiAgICAgICAgc2F2ZUludml0ZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XG4gICAgICAgIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRVI6XG4gICAgICAgIHNhdmVVbmJsb2NrZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgIG5hbWU6dXNlcm5hbWUsIGZvY3VzZWRIYW5nb3V0LG9uQXBwUm91dGUgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRzKHsgaGFuZ291dHMgfSkge1xuICAgIGhhbmdvdXRzLmZvckVhY2goKGhhbmdvdXQpID0+IHtcbiAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0IH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc29ja2V0TWVzc2FnZSAgJiYgdXNlcm5hbWUgJiYgZm9jdXNlZEhhbmdvdXQpIHtcbiAgICBcbiAgICAgIHN3aXRjaCAoc29ja2V0TWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ0FDS0hPV0xFREdFTUVOVCc6XG4gICAgICBcbiAgICAgICAgICBoYW5kbGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsb2ZmbGluZTpmYWxzZSB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnSEFOR09VVCc6XG4gICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IHNvY2tldE1lc3NhZ2UuaGFuZ291dCB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnVU5SRUFEX0hBTkdPVVRTJzpcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzOiBzb2NrZXRNZXNzYWdlLmhhbmdvdXRzIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdPRkZMSU5FX0FDS04nOlxuICAgICAgICAgIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQ6IHNvY2tldE1lc3NhZ2UuaGFuZ291dCxvZmZsaW5lOnRydWUgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9LCBbc29ja2V0TWVzc2FnZSwgdXNlcm5hbWUsZm9jdXNlZEhhbmdvdXRdKTtcbiAgcmV0dXJuIHt9O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgeyB1cGRhdGVMb2NhbEhhbmdvdXRzIH0gZnJvbSAnLi91cGRhdGVMb2NhbEhhbmdvdXRzJztcbmltcG9ydCB7IHNhdmVQZW5kaW5nSGFuZ291dCB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2F2ZVBlbmRpbmdIYW5nb3V0JztcbmltcG9ydCB7XG4gIHNlbGVjdEhhbmdvdXQsXG4gIHNlYXJjaEhhbmdvdXRzLFxuICBmaWx0ZXJIYW5nb3V0cyxcbiAgZmV0Y2hIYW5nb3V0LFxuICBzZWxlY3RVc2VyLFxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcbiAgc3RhcnRDbGllbnRDb21tYW5kLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHtzZW5kT2ZmbGluZUhhbmdvdXRzfSBmcm9tICcuL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3NlbmRPZmZsaW5lSGFuZ291dHMnXG5pbXBvcnQgeyB1c2VTb2NrZXRNZXNzYWdlIH0gZnJvbSAnLi91c2VTb2NrZXRNZXNzYWdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHNlYXJjaCxcbiAgICB1c2VycyxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlcyxcbiAgICBzb2NrZXRNZXNzYWdlLFxuICAgIHJlYWR5U3RhdGUsXG4gICAgc29ja2V0LFxuICB9ID0gc3RhdGU7XG4gIGNvbnN0IGhhbmRsZU1lc3NhZ2VSb3V0ZXIgPSB1c2VTb2NrZXRNZXNzYWdlKHtcbiAgICBkaXNwYXRjaCxcbiAgICBzb2NrZXRNZXNzYWdlLFxuICAgIHVzZXJuYW1lLFxuICAgIGZvY3VzZWRIYW5nb3V0OiBoYW5nb3V0LFxuICB9KTtcblxuXG4gIHVzZUVmZmVjdCgoKT0+e1xuICAgIGlmKHNvY2tldCAmJiByZWFkeVN0YXRlPT09MSAmJiB1c2VybmFtZSl7XG4gICAgICBzZW5kT2ZmbGluZUhhbmdvdXRzKHtuYW1lOnVzZXJuYW1lLGRpc3BhdGNoLHNvY2tldH0pXG4gICAgfVxuICB9LFtzb2NrZXQscmVhZHlTdGF0ZSx1c2VybmFtZV0pXG5cbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblNlbGVjdFVzZXIoZSkge1xuICAgIGNvbnN0IHVuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQoKHUpID0+IHUudXNlcm5hbWUgPT09IHVuYW1lKTtcbiAgICBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xuICAgIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoOiBlLnRhcmdldC52YWx1ZSwgZGlzcGF0Y2ggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblN0YXJ0U2VhcmNoKGUpIHtcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcbiAgICB9XG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XG4gICAgY29uc3QgdGV4dCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25IYW5nb3V0KGUpIHtcbiAgICBjb25zdCBjb21tYW5kID0gZS50YXJnZXQuaWQ7XG4gICAgY29uc3QgeyBlbWFpbCB9ID0gaGFuZ291dDtcbiAgIFxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgY29uc3Qgb25saW5lID0gdHJ1ZTtcblxuICAgIGlmIChzb2NrZXQgJiYgcmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICBcbiAgICAgIHNvY2tldC5zZW5kKFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgdXNlcm5hbWU6aGFuZ291dC51c2VybmFtZSxcbiAgICAgICAgICBlbWFpbCxcbiAgICAgICAgICBtZXNzYWdlOiB7IHRleHQ6IG1lc3NhZ2VUZXh0LCB0aW1lc3RhbXAgfSxcbiAgICAgICAgICBjb21tYW5kLFxuICAgICAgICAgIHRpbWVzdGFtcFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICBcbiAgICAgIG9ubGluZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XG4gICAgICBkaXNwYXRjaCxcbiAgICAgIG5hbWU6IHVzZXJuYW1lLFxuICAgICAgaGFuZ291dDoge1xuICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHN0YXRlOmNvbW1hbmQsXG4gICAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCxkZWxpdmVyZWQ6ZmFsc2UsdXNlcm5hbWUgfSxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICBkZWxpdmVyZWQ6ZmFsc2VcbiAgICAgIH0sXG4gICAgICBvbmxpbmVcbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHQsXG4gICAgb25TdGFydFNlYXJjaCxcbiAgICBvblNlYXJjaCxcbiAgICBzZWFyY2gsXG4gICAgb25TZWxlY3RIYW5nb3V0LFxuICAgIG9uU2VsZWN0VXNlcixcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICAgIG1lc3NhZ2VzLFxuICAgIG9uSGFuZ291dCxcbiAgICByZWFkeVN0YXRlLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZHVjZXIgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VUaGVtZUNvbnRleHQgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuaW1wb3J0IHtPbmxpbmVTdGF0dXN9IGZyb20gJy4uL2xheW91dC9pY29ucy9vbmxpbmVTdGF0dXMnXHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuaW1wb3J0IHsgTWVudVdoaXRlIH0gZnJvbSAnLi9pY29ucy9NZW51V2hpdGUnO1xyXG5pbXBvcnQgeyBBcHBTaGVsbCB9IGZyb20gJy4uL2xheW91dC9BcHBTaGVsbCc7XHJcbmltcG9ydCB7IEFwcEJhciB9IGZyb20gJy4uL2xheW91dC9BcHBCYXInO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgcmVjb3ZlckxvY2FsQXV0aFN0YXRlIH0gZnJvbSAnLi4vYXV0aC9hY3Rpb25zJztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcydcclxuaW1wb3J0IHt1c2VIYW5nb3V0c30gZnJvbSAnLi4vaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMnXHJcbmNvbnN0IFBob25lRHJhd2VyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vUGhvbmVEcmF3ZXInKSk7XHJcbmNvbnN0IFRhYmxldERyYXdlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1RhYmxldERyYXdlcicpKTtcclxuY29uc3QgTGFwdG9wRHJhd2VyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vTGFwVG9wRHJhd2VyJykpO1xyXG5jb25zdCBEZXNrdG9wRHJhd2VyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vRGVza3RvcERyYXdlcicpKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdmlnYXRpb24ocHJvcHMpIHtcclxuY29uc3Qge29uQXBwUm91dGV9ID11c2VBcHBSb3V0ZSgpXHJcbiBjb25zdCB7cmVhZHlTdGF0ZX09dXNlSGFuZ291dHMoKVxyXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IHsgdXNlck5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XHJcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIGRyYXdlckNvbnRlbnQgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lQ29udGV4dCgpO1xyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVEcmF3ZXIodG8pIHtcclxuICAgIHNldFJvdXRlKHRvKTtcclxuICAgIHNldE9wZW4oKHByZXYpID0+ICFwcmV2KTtcclxuICB9XHJcbiAgY29uc3QgeyBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG4gIFxyXG4gICAgICByZWNvdmVyTG9jYWxBdXRoU3RhdGUoe1xyXG4gICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgIHVzZXI6IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG5cclxuZnVuY3Rpb24gbmF2VG9VbnJlYWQgKCl7XHJcbiAgZGVidWdnZXI7XHJcbiAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTonL1VOUkVBRCcscm91dGU6Jy9oYW5nb3V0cyd9KVxyXG59XHJcbiAgcmV0dXJuIChcclxuICAgIDxBcHBTaGVsbD5cclxuICAgICAge3JvdXRlID09PSAnL3Bob25lJyAmJiBvcGVuID8gKFxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQaG9uZURyYXdlciBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9PntkcmF3ZXJDb250ZW50fTwvUGhvbmVEcmF3ZXI+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgKSA6IG51bGx9XHJcbiAgICAgIHtyb3V0ZSA9PT0gJy90YWJsZXQnICYmIG9wZW4gPyAoXHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFRhYmxldERyYXdlciBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9PntkcmF3ZXJDb250ZW50fTwvVGFibGV0RHJhd2VyPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgICkgOiBudWxsfVxyXG4gICAgICB7cm91dGUgPT09ICcvbGFwdG9wJyAmJiBvcGVuID8gKFxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxMYXB0b3BEcmF3ZXIgb25DbGljaz17dG9nZ2xlRHJhd2VyfT57ZHJhd2VyQ29udGVudH08L0xhcHRvcERyYXdlcj5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICApIDogbnVsbH1cclxuICAgICAge3JvdXRlID09PSAnL2Rlc2t0b3AnICYmIG9wZW4gPyAoXHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPERlc2t0b3BEcmF3ZXIgb25DbGljaz17dG9nZ2xlRHJhd2VyfT57ZHJhd2VyQ29udGVudH08L0Rlc2t0b3BEcmF3ZXI+eycgJ31cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICApIDogbnVsbH1cclxuICAgICAgPEFwcEJhcj5cclxuICAgICAgICA8TWVudVdoaXRlIG9uQ2xpY2s9e3RvZ2dsZURyYXdlcn0gZGV2aWNlPXtkZXZpY2V9IGlkPSdtZW51JyAvPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICA8TmF2SXRlbT57dXNlck5hbWV9PC9OYXZJdGVtPlxyXG4gICAgICAgIDxOYXZJdGVtIG9uQ2xpY2s9e25hdlRvVW5yZWFkfT5VbnJlYWQ8L05hdkl0ZW0+XHJcbiAgICAgICAgPE5hdkl0ZW0+XHJcbiAgICAgICAgICA8T25saW5lU3RhdHVzIHJlYWR5U3RhdGU9e3JlYWR5U3RhdGV9Lz5cclxuICAgICAgICA8L05hdkl0ZW0+XHJcbiAgICAgIDwvQXBwQmFyPlxyXG4gICAgPC9BcHBTaGVsbD5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTmF2SXRlbShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nbmF2LWl0ZW0ney4uLnByb3BzfT57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5cclxuaW1wb3J0IHtGZWF0dXJlUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5jb25zdCBMb2dpbiA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL0xvZ2luJykpO1xyXG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL0NoYW5nZVBhc3N3b3JkJykpO1xyXG5jb25zdCBGb3Jnb3RQYXNzd29yZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL0ZvcmdvdFBhc3N3b3JkJykpO1xyXG5jb25zdCBTaWdudXAgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9TaWdudXAnKSk7XHJcbmNvbnN0IFByb2ZpbGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9Qcm9maWxlJykpO1xyXG5jb25zdCBBdXRoRmVlZGJhY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9BdXRoRmVlZGJhY2snKSk7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEF1dGhlbnRpY2F0aW9uKHsgY2hpbGRyZW4gfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9jaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPENoYW5nZVBhc3N3b3JkIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2xvZ2luJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8TG9naW4gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuXHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL3NpZ251cCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFNpZ251cCAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvZm9yZ290cGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxGb3Jnb3RQYXNzd29yZCAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvcHJvZmlsZSc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFByb2ZpbGUgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvYXV0aGZlZWRiYWNrJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8QXV0aEZlZWRiYWNrIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgcm9vdDoge30sXHJcbiAgdG9wOiB7fSxcclxuICBib3R0b206IHt9LFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERyYXdlckNvbnRlbnQoeyBhdXRoQ29udGVudCwgb3RoZXJDb250ZW50IH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdj5cclxuICAgICAgIFxyXG4gICAgICAgIHthdXRoQ29udGVudH1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXY+XHJcbiAgICBcclxuICAgICAgICB7b3RoZXJDb250ZW50fVxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGZ1bmN0aW9uIExpc3QoeyBjaGlsZHJlbiwgaWQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXHJcblxyXG4gICAgICAgIHBhZGRpbmdUb3A6IDgsXHJcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogOCxcclxuICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGlzdEl0ZW0oeyBjaGlsZHJlbiwgb25DbGljaywgaWQgfSkge1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBpZD17aWR9XHJcbiAgICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgb25DbGljaz17b25DbGlja31cclxuICAgICAgY2xhc3NOYW1lPSdkcmF3ZXItbGlzdC1pdGVtJ1xyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgICAgIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgICBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHBhZGRpbmdUb3A6IDgsXHJcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogOCxcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiY29uc3QgaW1nID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQkFDQVFBQUFBQVlMbFZBQUFBQkdkQlRVRUFBTEdQQy94aEJRQUFBQ0JqU0ZKTkFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUFBbUpMUjBRQUFLcU5JeklBQUFBSmNFaFpjd0FBRHNRQUFBN0VBWlVyRGhzQUFBQUhkRWxOUlFma0JCc0lMUzFZZjlKSUFBQURvRWxFUVZSbzNyMlpTMGhVVVJqSGYzTXRpOUJTTTJsUjB0UEpoRWpTVmlFRTFhS05sUlVWSkZFUUZGRWtidTIxSzdHSU5oRkZSQStDbGlVdGF0TkwzSVRSTktFUkJsRUxkVWJIN0tHbWMxdmNyalBqekwzM2ZHZnUrSDJMZ1h2TzkvOTk5NXd6NTNVRFNLMk1PcXBZUXdYRkZGRUEvQ1RHRUQxMEUrWVYvV0pGWmF2bE1pSGltQzRlSjBRYk5YNmo1OVBNUjFmd2RBL1RUS0UvOEJMT015aUMyejdJT1lxemd3ZG9wRjhMYm51VVV4aTYrRlc4eVFwdSsydFc2dUIzTXVRTDNzVGtCL3RrY0lNcnZzRnRiMVB2aW53ZStJNDNNYm5QYkRWOGUwN3dKaVpQdkZNSWNDZG5lQk9UQjE0ZDRYL2ZUL2RXTi95ZW5PTk5UUFk3NFZjU201RUVZcXpJM1B2K1REc3EvcEpBQW12YkVXN0tKZ3UrOHBBZUlNaCtsZ3BqRDNFbjlVRUpBNkozK0VNVGVWUFJlVFR6UnhUZlIxRnFBaGRFNFdOc1QzdW5yY0lVemlRSHp4Y3V1TWN5TnV0eGtVWTBlYi9RTEFydFNCbzVxY080VTZUVGxBZ05pUUozT1E0dDJUd1N0c05xUldHL3lIZE1JSjlmSXExcU1NQjVac3BvSFl3N2xvM1RLZEk2WUNXd1RSVFU2MXI2UmFTMUJRektXQ3NLaXJtV1JrVmE2eWcxcUhNWTAwNDJ4N1YwcmtqTG9NNmdTaFFDUzF4THk0VnFWUVpCWVVpdFMxbEFmQ1lLR2xRSVE4cXBkaXlyOFdpZmRLc3dLQldHd0VuSGtoTmlyVktJaUtZT0U1TUpoNGJleUlSWWF3REd4RUVtbjFtVWhpK2pWME5wVkM4QmsyNHFVL0NWZEd2cGpPcDBnUjI2ZUFvL1Q3Z1hTT29DZzUvaWdXUFpwNlM3a045ODFGUVpNWWhvaFAzbE9wdUlKejNaekUwbU5KUWlpTStCbzl4d09HNnY1cFo0Uk4yRHM0THFjUjZ5elBXTmx2TklsRUFMTkNoWGpsR3YxS3oxREN0cjdvUXlqM3N2Mjc4Skp1MUt2aXRwVGxyejhIdUZxbU11SzBBbTI4QzRnbXFYdFNONnJpRFlScGNvZ2JkY1VhajF6UHFwVVJqNUMwVjRnRVVLLzRqMWR1V3dSOFYyTVI3Z3FZZHFDUGgvWDNIYlE2cERLNEUzSHVWSjFFS1BvMW1EVmdMdXg1UUlCWWtXR09HYXExUk1Ld0gzcUt2V0ttVHZpSXZweWJERzJ6YWlOYy9QY3JtdTdpUEljT3FqdzZJcE5Gcy9tSjVUZ05jemhuK1IrU3d5VTVkVVE1a3ZxUUIyejBnQ3pzZDdvQzNuK0l2dUl6ZkE3WnppNzN2Zm1jL080V1gxWTdYNzhsbmN5Z24rcmhyZTZvaFduK0Z4TGdxdkFkaWgrYTBza3crelZ3YTNiQVV2ZmNHL1lMa08zdXFLUnZxeWdrYzVLbTM2NlZiRUdhSmE4QWd0TE1nT2Jsc0JUWHdRd1VPY3R0WjdQNjJhVnQ0eDZRcWVwSXRMaWIyZVNpOUxyWlE2MWxKSkJTVkpuKzhIcHo3ZkM4K2Evd0MxWkFYczNVaFVIQUFBQUNWMFJWaDBaR0YwWlRwamNtVmhkR1VBTWpBeU1DMHdOQzB5TjFRd09EbzBOVG8wTlNzd01Eb3dNQmF3U1ZRQUFBQWxkRVZZZEdSaGRHVTZiVzlrYVdaNUFESXdNakF0TURRdE1qZFVNRGc2TkRVNk5EVXJNREE2TURCbjdmSG9BQUFBR1hSRldIUlRiMlowZDJGeVpRQjNkM2N1YVc1cmMyTmhjR1V1YjNKbm0rNDhHZ0FBQUFCSlJVNUVya0pnZ2c9PVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcclxuaW1wb3J0IHVzZXJJY29uIGZyb20gJy4vaWNvbnMvdXNlcjY0LnBuZyc7XHJcbmltcG9ydCB7IGxvZ291dCB9IGZyb20gJy4uL2F1dGgvYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBncmlkOiB7XHJcbiAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnYXV0byA1JSBhdXRvJyxcclxuICAgIGp1c3RpZnlJdGVtczogJ2NlbnRlcicsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoQ29udGVudCgpIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfSA9IHVzZUFwcFJvdXRlKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCxyb3V0ZTonL2F1dGgnfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nVG9wOiAxMCB9fT5cclxuICAgICAgeyFzdGF0ZS51c2VybmFtZSAmJiA8VW5BdXRoZWRTdGF0ZSBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9IC8+fVxyXG4gICAgICB7c3RhdGUudXNlcm5hbWUgJiYgKFxyXG4gICAgICAgIDxBdXRoZWRTdGF0ZVxyXG4gICAgICAgIG9uQXBwUm91dGU9e29uQXBwUm91dGV9XHJcbiAgICAgICAgICBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9XHJcbiAgICAgICAgICB1c2VyTmFtZT17c3RhdGUudXNlcm5hbWV9XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuICAgICAgPGhyIHN0eWxlPXt7IGhlaWdodDogMSB9fSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUsIHVzZXJOYW1lICxvbkFwcFJvdXRlfSkge1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ091dCgpIHtcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6Jy8nLHJvdXRlOicvaG9tZSd9KTtcclxuICAgIGxvZ291dCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8aW1nIHNyYz17dXNlckljb259IHN0eWxlPXt7IHBhZGRpbmdSaWdodDogNSB9fSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlTG9nT3V0fSBpZD0nbG9nb3V0JyBkYXRhLXRlc3RpZD0nbG9nb3V0Jz5cclxuICAgICAgICAgICAgTG9nb3V0XHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogOCB9fT5XZWxjb21lLCB7dXNlck5hbWV9PC9kaXY+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICAgIENoYW5nZSBQYXNzd29yZFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBVbkF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5ncmlkfT5cclxuICAgICAgICA8YSBocmVmPScvJyBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2xvZ2luJyBkYXRhLXRlc3RpZD0nbG9naW4nPlxyXG4gICAgICAgICAgTG9naW5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgPGRpdj58PC9kaXY+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdzaWdudXAnIGRhdGEtdGVzdGlkPSdzaWdudXAnPlxyXG4gICAgICAgICAgU2lnbnVwXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0geyB2YWxpZGF0aW9uOiB7fSB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuXHJcbiAgbGV0IG5leHRTdGF0ZSA9IG51bGw7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG5cclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5QVVRfRk9DVVNFRDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICBbYWN0aW9uLnByb3BOYW1lXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE46XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2Zvcm1SZWR1Y2VyJztcclxuY29uc3QgRm9ybUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9ybUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRm9ybUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VGb3JtQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBGb3JtUHJvdmlkZXInKTtcclxuICB9XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4geyBzdGF0ZSwgZGlzcGF0Y2ggfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1Qcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihmb3JtUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8Rm9ybUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcclxuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tICcuLi9hdXRoL3VzZVVzZXJOYW1lJztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGZ1bmN0aW9uIE90aGVyQ29udGVudCgpIHtcclxuXHJcbmNvbnN0IHtvbkFwcFJvdXRlfSA9dXNlQXBwUm91dGUoKVxyXG5cclxuICBjb25zdCB7IHVzZXJOYW1lIH0gPSB1c2VVc2VyTmFtZSgpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIGlmICh1c2VyTmFtZSkge1xyXG5cclxuICAgICAgb25BcHBSb3V0ZSh7dHlwZTphY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRCwgZmVhdHVyZVJvdXRlOicvaGFuZ291dHMnLHJvdXRlOicvaGFuZ291dHMnfSlcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBvbkFwcFJvdXRlKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGU6Jy9sb2dpbicscm91dGU6Jy9hdXRoJ30pXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdjaGF0Jz5cclxuICAgICAgICAgIENoYXRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbT5JdGVtIFR3bzwvTGlzdEl0ZW0+XHJcblxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2hhbmdvdXRzJz5cclxuICAgICAgICAgIEhhbmdvdXRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2dyb3VwJz5cclxuICAgICAgICAgIEdyb3VwXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIb21lKCkge1xyXG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPSdob21lJz5Ib21lPC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCBOYXZpZ2F0aW9uLCB7IE5hdkl0ZW0gfSBmcm9tICcuLi9uYXYvTmF2aWdhdGlvbic7XG5pbXBvcnQgQXV0aGVudGljYXRpb24gZnJvbSAnLi4vYXV0aC9BdXRoZW50aWNhdGlvbic7XG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnLi4vdGhlbWUvdGhlbWUtY29udGV4dCc7XG5pbXBvcnQgeyBEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vbGF5b3V0L0RyYXdlckNvbnRlbnQnO1xuaW1wb3J0IHsgQXV0aENvbnRlbnQgfSBmcm9tICcuLi9hdXRoL0F1dGhDb250ZW50JztcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IEZvcm1Qcm92aWRlciB9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0JztcbmltcG9ydCB7IE90aGVyQ29udGVudCB9IGZyb20gJy4vT3RoZXJDb250ZW50JztcbmltcG9ydCB7IEhvbWUgfSBmcm9tICcuL0hvbWUnO1xuaW1wb3J0IHsgSGFuZ291dHNQcm92aWRlciB9IGZyb20gJy4uL2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInO1xuaW1wb3J0IHsgQXBwUm91dGUgfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcic7XG5jb25zdCBIYW5nb3V0cyA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9oYW5nb3V0cycpKTtcbmNvbnN0IEdyb3VwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2dyb3VwL2dyb3VwJykpO1xuZXhwb3J0IGZ1bmN0aW9uIEFwcCgpIHtcbiAgcmV0dXJuIChcbiAgICA8QXV0aFByb3ZpZGVyPlxuICBcbiAgICAgICAgPEhhbmdvdXRzUHJvdmlkZXIgc29ja2V0VXJsPVwid3M6Ly9sb2NhbGhvc3Q6MzAwMC9oYW5nb3V0c1wiPlxuICAgICAgICAgIDxGb3JtUHJvdmlkZXI+XG4gICAgICAgICAgICA8VGhlbWVQcm92aWRlclxuICAgICAgICAgICAgICBpbml0U3RhdGU9e3tcbiAgICAgICAgICAgICAgICBwcmltYXJ5OiB7XG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgSGVsdmV0aWNhLCBcIkFyaWFsXCInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxOYXZpZ2F0aW9uXG4gICAgICAgICAgICAgICAgZHJhd2VyQ29udGVudD17XG4gICAgICAgICAgICAgICAgICA8RHJhd2VyQ29udGVudFxuICAgICAgICAgICAgICAgICAgICBhdXRoQ29udGVudD17PEF1dGhDb250ZW50IC8+fVxuICAgICAgICAgICAgICAgICAgICBvdGhlckNvbnRlbnQ9ezxPdGhlckNvbnRlbnQgLz59XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxOYXZJdGVtPldFQiBDT008L05hdkl0ZW0+XG4gICAgICAgICAgICAgIDwvTmF2aWdhdGlvbj5cbiAgICAgICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvYXV0aFwiPlxuICAgICAgICAgICAgICAgIDxBdXRoZW50aWNhdGlvbiAvPlxuICAgICAgICAgICAgICA8L0FwcFJvdXRlPlxuXG4gICAgICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL1wiPlxuICAgICAgICAgICAgICAgIDxIb21lIC8+XG4gICAgICAgICAgICAgIDwvQXBwUm91dGU+XG5cbiAgICAgICAgICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cbiAgICAgICAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgICAgICAgICA8SGFuZ291dHMgLz5cbiAgICAgICAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgICAgICA8L0FwcFJvdXRlPlxuICAgICAgICAgICAgICA8QXBwUm91dGUgcGF0aD1cIi9ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICAgICAgICAgIDxHcm91cCAvPlxuICAgICAgICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgICAgICAgIHsnJ31cbiAgICAgICAgICAgIDwvVGhlbWVQcm92aWRlcj5cbiAgICAgICAgICA8L0Zvcm1Qcm92aWRlcj5cbiAgICAgICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxuICBcbiAgICA8L0F1dGhQcm92aWRlcj5cbiAgKTtcbn1cbiIsImltcG9ydCAnd2hhdHdnLWZldGNoJztcclxuaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgQXBwUm91dGVQcm92aWRlciB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcclxuaW1wb3J0IHtBcHB9IGZyb20gJy4vQXBwJ1xyXG5yZW5kZXIoXHJcbiAgPEFwcFJvdXRlUHJvdmlkZXIgdGl0bGU9J1dlYmNvbScgaW5pdFN0YXRlPXt7cm91dGU6Jy9oYW5nb3V0cycsZmVhdHVyZVJvdXRlOicvaGFuZ291dHMnfX0+XHJcbiAgICA8QXBwLz5cclxuICA8L0FwcFJvdXRlUHJvdmlkZXI+LFxyXG4gIGRvY3VtZW50LmJvZHlcclxuKTtcclxuIl0sIm5hbWVzIjpbImZldGNoIiwidCIsInUiLCJyIiwiaSIsIm8iLCJjIiwiZiIsImUiLCJhIiwidiIsIm0iLCJFIiwieCIsImQiLCJoIiwidyIsIl8iLCJnIiwiYWN0aW9uVHlwZXMiLCJBUFBfUk9VVEVfQ0hBTkdFRCIsIkZFQVRVUkVfUk9VVEVfQ0hBTkdFRCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJyb3V0ZSIsImZlYXR1cmVSb3V0ZSIsIkFwcFJvdXRlQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBSb3V0ZUNvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiRmVhdHVyZVJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJwYXRocyIsImRpc3BhdGNoIiwiZmluZCIsInAiLCJ1c2VBcHBSb3V0ZSIsIm9uQXBwUm91dGUiLCJBcHBSb3V0ZSIsIkFwcFJvdXRlUHJvdmlkZXIiLCJpbml0U3RhdGUiLCJ1c2VSZWR1Y2VyIiwidmFsdWUiLCJ1c2VNZW1vIiwibCIsIk4iLCJNIiwicyIsIlAiLCJqIiwiSCIsIlQiLCIkIiwicSIsIlRoZW1lQ29udGV4dCIsInVzZVRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJzZXRTdGF0ZSIsInVzZVN0YXRlIiwic3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlciIsIk9ubGluZVN0YXR1cyIsInJlYWR5U3RhdGUiLCJJc09ubGluZSIsImJhY2tncm91bmRDb2xvciIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwiTWVudVdoaXRlIiwib25DbGljayIsImRldmljZSIsImlkIiwiaGFuZGxlT25DbGljayIsImNvbnNvbGUiLCJsb2ciLCJBcHBTaGVsbCIsIkFwcEJhciIsInRoZW1lIiwicHJpbWFyeSIsIm1pbkhlaWdodCIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0IiwiZGlzcGxheSIsInVzZU1lZGlhUXVlcnkiLCJzZXRXaWR0aCIsInNldEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2V0T3JpZW50YXRpb24iLCJzZXREZXZpY2UiLCJoYW5kbGVWaWV3cG9ydFNpemUiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJoYW5kbGVTY3JlZW5PcmllbnRhdGlvbiIsInNjcmVlbiIsInVzZUVmZmVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJWQUxVRV9DSEFOR0VEIiwiTE9HSU5fU1RBUlRFRCIsIkxPR0lOX1NVQ0NFU1MiLCJMT0dJTl9GQUlMRUQiLCJMT0dPVVRfU1RBUlRFRCIsIkxPR09VVF9GQUlMRUQiLCJMT0dPVVRfU1VDQ0VTUyIsIlNJR05VUF9TVEFSVEVEIiwiU0lHTlVQX1NVQ0NFU1MiLCJTSUdOVVBfRkFJTEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQiLCJDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyIsIkNIQU5HRV9QQVNTV09SRF9GQUlMRUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MiLCJSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRCIsIkdPVF9UT0tFTl9GUk9NX1VSTCIsIlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSIsImVtYWlsIiwicGFzc3dvcmQiLCJzdWNjZXNzIiwiZXJyb3IiLCJ1c2VybmFtZSIsImxvYWRpbmciLCJjb25maXJtIiwiY3VycmVudCIsImVtYWlsb3J1c2VybmFtZSIsInRva2VuIiwiaXNMb2dnZWRJbiIsImlzUGFzc3dvcmRDaGFuZ2VkIiwiYXV0aEZlZWRiYWNrIiwiYXV0aFJlZHVjZXIiLCJuZXh0U3RhdGUiLCJwYXlsb2FkIiwicHJvcE5hbWUiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJ1c2VyIiwiQXV0aFJvdXRlQ29udGV4dCIsIkF1dGhSb3V0ZVByb3ZpZGVyIiwiaW5pdGlhbFJvdXRlIiwiYXV0aFJvdXRlIiwic2V0QXV0aFJvdXRlIiwiQXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsIkF1dGhQcm92aWRlciIsInVzZVVzZXJOYW1lIiwidXNlck5hbWUiLCJzZXRVc2VybmFtZSIsInNldFRva2VuIiwic2V0RW1haWwiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwiVkFMSUQiLCJJTlZBTElEIiwiSU5BQ1RJVkUiLCJFTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiVVNFUk5BTUVfVEFLRU4iLCJSRUdJU1RFUkVEX0VNQUlMIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIklOVkFMSURfUEFTU1dPUkQiLCJJTlZBTElEX0VNQUlMIiwiSU5WQUxJRF9VU0VSTkFNRSIsIklOVkFMSURfRU1QVFlfU1RSSU5HIiwiSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCIsIlBBU1NXT1JEU19ET19OT1RfTUFUQ0giLCJwYXNzd29yZFJlZ2V4IiwiZW1haWxSZWdleCIsInVzZXJuYW1lUmVnZXgiLCJ2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCIsImVtYWlsQ29uc3RyYWludCIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0aW9uVHlwZSIsInZhbGlkYXRpb25UeXBlcyIsInZhbGlkYXRpb25TdGF0ZSIsInZhbGlkYXRpb25NZXNzYWdlcyIsImlzQ2xpZW50VmFsaWRhdGlvblR5cGUiLCJ2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCIsInBhc3N3b3JkQ29uc3RyYWludCIsInZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50IiwidXNlcm5hbWVDb25zdHJhaW50IiwidmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUiLCJ2YWxpZGF0ZUVtcHR5U3RyaW5nIiwibGVuZ3RoIiwidmFsaWRhdGVQYXNzd29yZE1hdGNoIiwiYXV0aCIsIklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFIiwiUkVTRVRfVkFMSURBVElPTl9TVEFURSIsIklOUFVUX0JMVVJSRUQiLCJJTlBVVF9GT0NVU0VEIiwiU0VSVkVSX1ZBTElEQVRJT04iLCJDTElFTlRfVkFMSURBVElPTiIsIklOQ19JTlBVVF9DT1VUTiIsImNyZWRlbnRpYWxJbnZhbGlkIiwidXNlcm5hbWVJc1Rha2VuIiwiZW1haWxJc1JlZ2lzdGVyZWQiLCJ1c2VybmFtZUludmFsaWQiLCJwYXNzd29yZEludmFsaWQiLCJlbWFpbEludmFsaWQiLCJlbWFpbElzTm90UmVnaXN0ZXJlZCIsImVtcHR5U3RyaW5nTm90VmFsaWQiLCJlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZCIsInVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkIiwicGFzc3dvcmREb05vdE1hdGNoIiwidG9rZW5FeHBpcmVkIiwic2VydmVyVmFsaWRhdGlvblJhbmdlIiwic3RhdHVzIiwiY2xpZW50VmFsaWRhdGlvbiIsInZhbGlkYXRpb24iLCJjb25zdFZhbFR5cGVzIiwidmFsaWRhdGlvbnMiLCJyZXNldElucHV0VmFsaWRhdGlvblN0YXRlIiwic2VydmVyVmFsaWRhdGlvbiIsImh0dHBTdGF0dXMiLCJ2YWxpZGF0aW9uU3RhdGVzIiwidmFsdWVDaGFuZ2VkIiwibG9naW4iLCJmb3JtRGlzcGF0Y2giLCJyZXNwb25zZSIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYnRvYSIsIm1ldGhvZCIsInJlc3VsdCIsImpzb24iLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiZXJyb3JzIiwiZm9yRWFjaCIsInNpZ251cCIsImJvZHkiLCJDb250ZW50VHlwZSIsIkFjY2VwdCIsImxvZ291dCIsInJlbW92ZUl0ZW0iLCJjaGFuZ2VQYXNzd29yZCIsImFwaV91cmwiLCJmb3Jnb3RQYXNzd29yZCIsImdldFRva2VuRnJvbVVybCIsInJlY292ZXJMb2NhbEF1dGhTdGF0ZSIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURFRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiRkVUQ0hfSEFOR09VVF9TVEFSVEVEIiwiRkVUQ0hfSEFOR09VVF9TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVF9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIlNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEIiwiTUVTU0FHRVNfVVBEQVRFRCIsIkhBTkdPVVRTX1VQREFURUQiLCJIQU5HT1VUX1VQREFURUQiLCJDT05ORUNUSU5HIiwiT1BFTiIsIkNMT1NJTkciLCJDTE9TRUQiLCJTT0NLRVRfUkVBRFkiLCJTT0NLRVRfRVJST1IiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJtZXNzYWdlcyIsInNlYXJjaCIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwic29ja2V0Iiwic29ja2V0TWVzc2FnZSIsInRleHQiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIkZJTFRFUl9IQU5HT1VUUyIsImZpbHRlciIsImluY2x1ZGVzIiwibG9hZEhhbmdvdXRzIiwic2VsZWN0SGFuZ291dCIsInNlbGVjdFVzZXIiLCJTRUxFQ1RFRF9VU0VSIiwic2VhcmNoSGFuZ291dHMiLCJmaWx0ZXJIYW5nb3V0cyIsImZldGNoSGFuZ291dCIsIm9rIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJ1c2VXZWJTb2NrZXQiLCJzb2NrZXRVcmwiLCJzb2NrIiwiV2ViU29ja2V0Iiwib25tZXNzYWdlIiwibXNnIiwiZGF0YSIsIm9ub3BlbiIsIm9uY2xvc2UiLCJvbmVycm9yIiwiSGFuZ291dENvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsIkhhbmdvdXRzUHJvdmlkZXIiLCJhdXRoQ29udGV4dCIsIndlYnNvY2tldEhhbmRsZXIiLCJoYW5nb3V0RXhpc3QiLCJ1cGRhdGVkIiwibWFwIiwic2F2ZVBlbmRpbmdIYW5nb3V0IiwibmFtZSIsImhhbmdvdXRLZXkiLCJtZXNzYWdlS2V5Iiwic2F2ZUhhbmdvdXQiLCJzYXZlTWVzc2FnZSIsInVwZGF0ZWRIYW5nb3V0cyIsImhhbmdvdXRJbmRleCIsImZpbmRJbmRleCIsInNwbGljZSIsInVwZGF0ZWRNZXNzYWdlcyIsInNlbmRPZmZsaW5lSGFuZ291dHMiLCJvZmZsaW5lSGFuZ291dEtleSIsIm9mZmxpbmVIYW5nb3V0cyIsImZvcmVFYWNoIiwic2VuZCIsInRpbWVzdGFtcCIsImNvbW1hbmQiLCJvZmZsaW5lIiwiaGFuZ291dFN0YXRlcyIsIklOVklURVIiLCJBQ0NFUFRFUiIsIkRFQ0xJTkVSIiwiQkxPQ0tFUiIsIlVOQkxPQ0tFUiIsIk1FU1NBTkdFUiIsIklOVklURUQiLCJBQ0NFUFRFRCIsIkRFQ0xJTkVEIiwiQkxPQ0tFRCIsIlVOQkxPQ0tFRCIsIk1FU1NBR0VEIiwidXBkYXRlRGVsaXZlcmVkSGFuZ291dCIsImRlbGl2ZXJlZEhhbmdvdXQiLCJkZWxpdmVyZWQiLCJ1cGRhdGVEZWxpdmVyZWRNZXNzYWdlIiwib2ZmbGluZWhhbmdvdXRzIiwic2F2ZU1lc3NhZ2VkIiwic2F2ZUludml0ZWQiLCJzYXZlQWNjZXB0ZWQiLCJzYXZlRGVjbGluZWQiLCJzYXZlQmxvY2tlZCIsInNhdmVVbmJsb3ZrZWQiLCJzYXZlUmVjaWV2ZWRIYW5nb3V0IiwiZm9jdXNlZEhhbmdvdXQiLCJyZWFkIiwic2F2ZVJlY2lldmVkTWVzc2FnZSIsInNhdmVJbnZpdGVyIiwic2F2ZUFjY2VwdGVyIiwic2F2ZUJsb2NrZXIiLCJzYXZlRGVjbGluZXIiLCJzYXZlTWVzc2FuZ2VyIiwic2F2ZVVuYmxvY2tlciIsInVzZVNvY2tldE1lc3NhZ2UiLCJoYW5kbGVBY2tub3dsZWRnZW1lbnQiLCJoYW5kbGVIYW5nb3V0IiwiaGFuZGxlSGFuZ291dHMiLCJ1c2VIYW5nb3V0cyIsInVzZXJzIiwiaGFuZGxlTWVzc2FnZVJvdXRlciIsIm9uU2VsZWN0SGFuZ291dCIsInRhcmdldCIsIm9uU2VsZWN0VXNlciIsInVuYW1lIiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwib25NZXNzYWdlVGV4dCIsIm9uSGFuZ291dCIsIkRhdGUiLCJub3ciLCJQaG9uZURyYXdlciIsImxhenkiLCJUYWJsZXREcmF3ZXIiLCJMYXB0b3BEcmF3ZXIiLCJEZXNrdG9wRHJhd2VyIiwiTmF2aWdhdGlvbiIsInNldFJvdXRlIiwib3BlbiIsInNldE9wZW4iLCJkcmF3ZXJDb250ZW50IiwidG9nZ2xlRHJhd2VyIiwidG8iLCJwcmV2IiwibmF2VG9VbnJlYWQiLCJTdXNwZW5zZSIsIk5hdkl0ZW0iLCJMb2dpbiIsIkNoYW5nZVBhc3N3b3JkIiwiRm9yZ290UGFzc3dvcmQiLCJTaWdudXAiLCJQcm9maWxlIiwiQXV0aEZlZWRiYWNrIiwiQXV0aGVudGljYXRpb24iLCJEcmF3ZXJDb250ZW50IiwiYXV0aENvbnRlbnQiLCJvdGhlckNvbnRlbnQiLCJMaXN0IiwiYm94U2l6aW5nIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJMaXN0SXRlbSIsImdyaWQiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwianVzdGlmeUl0ZW1zIiwiQXV0aENvbnRlbnQiLCJoYW5kbGVSb3V0ZSIsInByZXZlbnREZWZhdWx0IiwiQXV0aGVkU3RhdGUiLCJoYW5kbGVMb2dPdXQiLCJhbGlnbkl0ZW1zIiwiZmxleERpcmVjdGlvbiIsInVzZXJJY29uIiwibWFyZ2luQm90dG9tIiwiVW5BdXRoZWRTdGF0ZSIsImZvcm1SZWR1Y2VyIiwiZm9ybVN0YXRlIiwiY291bnQiLCJGb3JtQ29udGV4dCIsInVzZUZvcm1Db250ZXh0IiwiRm9ybVByb3ZpZGVyIiwiT3RoZXJDb250ZW50IiwiSG9tZSIsIkhhbmdvdXRzIiwiR3JvdXAiLCJBcHAiLCJiYWNrZ3JvdW5kIiwiY29sb3IiLCJmb250RmFtaWx5IiwicmVuZGVyIiwiZG9jdW1lbnQiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLElBQUksSUFBSTtBQUN6QyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQ3BELEVBQUUsSUFBSTtBQUNOLElBQUksWUFBWSxJQUFJLElBQUk7QUFDeEIsSUFBSSxNQUFNLElBQUksSUFBSTtBQUNsQixJQUFJLENBQUMsV0FBVztBQUNoQixNQUFNLElBQUk7QUFDVixRQUFRLElBQUksSUFBSSxHQUFFO0FBQ2xCLFFBQVEsT0FBTyxJQUFJO0FBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNsQixRQUFRLE9BQU8sS0FBSztBQUNwQixPQUFPO0FBQ1AsS0FBSyxHQUFHO0FBQ1IsRUFBRSxRQUFRLEVBQUUsVUFBVSxJQUFJLElBQUk7QUFDOUIsRUFBRSxXQUFXLEVBQUUsYUFBYSxJQUFJLElBQUk7QUFDcEMsRUFBQztBQUNEO0FBQ0EsU0FBUyxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQ3pCLEVBQUUsT0FB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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXNPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1b1MsSUFBSUMsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNSLEdBQUMsQ0FBQyxDQUFDLENBQUNFLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1AsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRVksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNYLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFtRixTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1YsR0FBQyxDQUFDLENBQUMsQ0FBQ1csR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQTJHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFzRCxTQUFTRyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNkLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQ1EsR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBNE4sU0FBU2UsR0FBQyxFQUFFLENBQUNaLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTYSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFFLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDTixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZ0IsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1gsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRixHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFYyxHQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FB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QyxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSUQsR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPQyxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRUEsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ3FDLENBQUMsQ0FBQyxDQUE4UyxJQUFJakMsR0FBQyxDQUFDUCxDQUFDLENBQUMsR0FBRyxDQUFDQSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBbVMsSUFBaVJrQyxHQUFDLENBQUN6QyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ00sR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTb0MsR0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0MsR0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUM1QyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDeUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsU0FBUyxDQUFDLElBQUlGLENBQUMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUNFLEdBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUosQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQ3VDLEdBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUNBLEdBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJQyxHQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBb2UsSUFBSUMsR0FBQyxDQUFDLGtPQUFrTyxDQUFDTixDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxJQUFJTyxHQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLENBQTZNLElBQUksQ0FBQyxDQUFDL0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTZ0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDaEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSWlELEdBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDakQsQ0FBQyxDQUFDLEtBQUssQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMrQyxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHRSxHQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsQ0FBQyxHQUFHNUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQ3lDLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMs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
