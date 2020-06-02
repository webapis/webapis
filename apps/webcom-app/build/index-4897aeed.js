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

var t$1,u$1,r$1,i$1=0,o$1=[],c$1=n.__r,f$1=n.diffed,e$1=n.__c,a$1=n.unmount;function v$1(t,r){n.__h&&n.__h(u$1,t,i$1||r),i$1=0;var o=u$1.__H||(u$1.__H={__:[],__h:[]});return t>=o.__.length&&o.__.push({}),o.__[t]}function m$1(n){return i$1=1,p(E$1,n)}function p(n,r,i){var o=v$1(t$1++,2);return o.t=n,o.__c||(o.__c=u$1,o.__=[i?i(r):E$1(void 0,r),function(n){var t=o.t(o.__[0],n);o.__[0]!==t&&(o.__[0]=t,o.__c.setState({}));}]),o.__}function l(r,i){var o=v$1(t$1++,3);!n.__s&&x$1(o.__H,i)&&(o.__=r,o.__H=i,u$1.__H.__h.push(o));}function h$1(n,u){var r=v$1(t$1++,7);return x$1(r.__H,u)?(r.__H=u,r.__h=n,r.__=n()):r.__}function w$1(n){var r=u$1.context[n.__c],i=v$1(t$1++,9);return i.__c=n,r?(null==i.__&&(i.__=!0,r.sub(u$1)),r.props.value):n.__}function _$1(){o$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(g$1),t.__H.__h.forEach(q),t.__H.__h=[];}catch(u){return t.__H.__h=[],n.__e(u,t.__v),!0}}),o$1=[];}function g$1(n){"function"==typeof n.u&&n.u();}function q(n){n.u=n.__();}function x$1(n,t){return !n||t.some(function(t,u){return t!==n[u]})}function E$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){c$1&&c$1(n),t$1=0;var r=(u$1=n.__c).__H;r&&(r.__h.forEach(g$1),r.__h.forEach(q),r.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var u=t.__c;u&&u.__H&&u.__H.__h.length&&(1!==o$1.push(u)&&r$1===n.requestAnimationFrame||((r$1=n.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(r),cancelAnimationFrame(t),setTimeout(n);},r=setTimeout(u,100);"undefined"!=typeof window&&(t=requestAnimationFrame(u));})(_$1));},n.__c=function(t,u){u.some(function(t){try{t.__h.forEach(g$1),t.__h=t.__h.filter(function(n){return !n.__||q(n)});}catch(r){u.some(function(n){n.__h&&(n.__h=[]);}),u=[],n.__e(r,t.__v);}}),e$1&&e$1(t,u);},n.unmount=function(t){a$1&&a$1(t);var u=t.__c;if(u&&u.__H)try{u.__H.__.forEach(g$1);}catch(t){n.__e(t,u.__v);}};

function w$2(n,t){for(var e in t)n[e]=t[e];return n}function x$2(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var E$2=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return x$2(this.props,n)||x$2(this.state,t)},r}(m);var _$2=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),_$2&&_$2(n);};var N$1=n.__e;function U(n){return n&&((n=w$2({},n)).__c=null,n.__k=n.__k&&n.__k.map(U)),n}function M$1(){this.__u=0,this.o=null,this.__b=null;}function L(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function O(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function P$1(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);N$1(n,t,e);},(M$1.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=L(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},M$1.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=U(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var W=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(P$1.prototype=new m).u=function(n){var t=this,e=L(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),W(t,n,r)):o();};e?e(u):u();}},P$1.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},P$1.prototype.componentDidUpdate=P$1.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){W(n,e,t);});};var j$1=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var H$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var T$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var I=n.event;function $$1(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){I&&(n=I(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var q$1={configurable:!0,get:function(){return this.class}},B=n.vnode;n.vnode=function(n){n.$$typeof=T$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&(q$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",q$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=H$1.test(u))break;if(r)for(u in o=n.props={},e)o[H$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&($$1(t.prototype,"componentWillMount"),$$1(t.prototype,"componentWillReceiveProps"),$$1(t.prototype,"componentWillUpdate"),t.m=!0);}B&&B(n);};

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

const RootRouteContext = M();
function RootRoute(props) {
  const {
    children,
    path
  } = props;
  const [rootRoute, setRootRoute] = useRootRouteContext();

  if (rootRoute === path) {
    return children;
  }

  return null;
}
function useRootRouteContext() {
  const context = w$1(RootRouteContext);

  if (!context) {
    throw new Error('useRootRouteContext must be used with RootRouteProvider');
  }

  return context;
} //

function RootRouteProvider(props) {
  const {
    initialRoute
  } = props;
  const [rootRoute, setRootRoute] = m$1(initialRoute);
  const value = h$1(() => [rootRoute, setRootRoute], [rootRoute]);
  return h(RootRouteContext.Provider, _extends({
    value: value
  }, props));
}

const RouteContext = M();
function Route(props) {
  const {
    children,
    path
  } = props;
  const [route] = useRouteContext();

  if (route === path) {
    return children;
  }

  return null;
}
function useRouteContext() {
  const context = w$1(RouteContext);

  if (!context) {
    throw new Error('useRouteContext must be used with RouteProvider');
  }

  return context;
} //

function RouteProvider(props) {
  const {
    initialRoute
  } = props;
  const [route, setRoute] = m$1(initialRoute);
  const value = h$1(() => [route, setRoute], [route]);
  return h(RouteContext.Provider, _extends({
    value: value
  }, props));
}

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

var actionTypes = {
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
    case actionTypes.VALUE_CHANGED:
      const nextState = { ...state,
        [action.payload.propName]: action.payload.value
      };
      return nextState;

    case actionTypes.LOGIN_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.LOGIN_SUCCESS:
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

    case actionTypes.LOGIN_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes.SIGNUP_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.SIGNUP_SUCCESS:
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

    case actionTypes.SIGNUP_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes.CHANGE_PASSWORD_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.CHANGE_PASSWORD_SUCCESS:
      return { ...state,
        success: true,
        loading: false,
        token: action.token,
        username: action.username,
        email: action.email,
        isPasswordChanged: true,
        authFeedback: action.message
      };

    case actionTypes.CHANGE_PASSWORD_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes.REQUEST_PASS_CHANGE_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.REQUEST_PASS_CHANGE_SUCCESS:
      return { ...state,
        loading: false,
        success: true,
        authFeedback: action.message
      };

    case actionTypes.REQUEST_PASS_CHANGE_FAILED:
      return { ...state,
        loading: false,
        error: action.payload.error
      };

    case actionTypes.GOT_TOKEN_FROM_URL:
      return { ...state,
        token: action.token
      };

    case actionTypes.LOGOUT_SUCCESS:
      return { ...initState
      };

    case actionTypes.RECOVER_LOCAL_AUTH_STATE:
      return { ...state,
        username: action.user.username,
        email: action.user.email
      };

    default:
      return state;
  }
}

const AuthRouteContext = M();
function AuthRoute(props) {
  const {
    children,
    path
  } = props;
  const [authRoute] = useAuthRouteContext();

  if (authRoute === path) {
    return children;
  }

  return null;
}
function useAuthRouteContext() {
  const context = w$1(AuthRouteContext);

  if (!context) {
    throw new Error('useAuthRouteContext must be used with AuthRouteProvider');
  }

  return context;
} //

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

var actionTypes$1 = {
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
    type: actionTypes$1.CLIENT_VALIDATION,
    ...validation
  };
}
function resetInputValidationState({
  validationType
}) {
  return {
    type: actionTypes$1.RESET_VALIDATION_STATE,
    validationType
  };
}
function serverValidation({
  status = 0
}) {
  switch (status) {
    case httpStatus.credentialInvalid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.INVALID_CREDENTIALS,
        message: validationMessages.INVALID_CREDENTIALS,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailInvalid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordInvalid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.PASSWORD_FORMAT_VALIDATION,
        message: validationMessages.INVALID_PASSWORD,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameInvalid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsRegistered:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.REGISTERED_EMAIL,
        message: validationMessages.REGISTERED_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailIsNotRegistered:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.EMAIL_NOT_REGISTERED,
        message: validationMessages.EMAIL_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsTaken:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_TAKEN,
        message: validationMessages.USERNAME_TAKEN,
        validationState: validationStates.INVALID
      };

    case httpStatus.emptyStringNotValid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.EMPTY_STRING_VALIDATION,
        message: validationMessages.INVALID_EMPTY_STRING,
        validationState: validationStates.INVALID
      };

    case httpStatus.emailorusernameNotValid:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
        message: validationMessages.INVALID_USERNAME_OR_EMAIL,
        validationState: validationStates.INVALID
      };

    case httpStatus.usernameIsNotRegistered:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
        validationType: validationTypes.USERNAME_NOT_REGISTERED,
        message: validationMessages.USERNAME_NOT_REGISTERED,
        validationState: validationStates.INVALID
      };

    case httpStatus.passwordDoNotMatch:
      return {
        type: actionTypes$1.SERVER_VALIDATION,
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
    type: actionTypes.VALUE_CHANGED,
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
      type: actionTypes.LOGIN_STARTED
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
        type: actionTypes.LOGIN_SUCCESS,
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
      type: actionTypes.LOGIN_FAILED,
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
    type: actionTypes.SIGNUP_STARTED
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
        type: actionTypes.SIGNUP_SUCCESS,
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
      type: actionTypes.SIGNUP_FAILED,
      payload: {
        error
      }
    });
  }
}
function logout() {
  window.localStorage.removeItem('webcom');
  return {
    type: actionTypes.LOGOUT_SUCCESS
  };
}
async function changePassword({
  dispatch,
  state,
  formDispatch,
  token
}) {
  dispatch({
    type: actionTypes.CHANGE_PASSWORD_STARTED
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
        type: actionTypes.CHANGE_PASSWORD_SUCCESS,
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
        type: actionTypes.CHANGE_PASSWORD_FAILED,
        error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes.CHANGE_PASSWORD_FAILED,
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
      type: actionTypes.REQUEST_PASS_CHANGE_STARTED
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
        type: actionTypes.REQUEST_PASS_CHANGE_SUCCESS,
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
        type: actionTypes.REQUEST_PASS_CHANGE_FAILED,
        error
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes.REQUEST_PASS_CHANGE_FAILED,
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
    type: actionTypes.GOT_TOKEN_FROM_URL,
    token
  };
}
function recoverLocalAuthState({
  user,
  dispatch
}) {
  dispatch({
    type: actionTypes.RECOVER_LOCAL_AUTH_STATE,
    user
  });
}

const PhoneDrawer = O(() => import('./PhoneDrawer-cac85f08.js'));
const TabletDrawer = O(() => import('./TabletDrawer-cd637dc1.js'));
const LaptopDrawer = O(() => import('./LapTopDrawer-b3a6315c.js'));
const DesktopDrawer = O(() => import('./DesktopDrawer-52ee77ae.js'));
function Navigation(props) {
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
  }), children, h(NavItem, null, userName)));
}
function NavItem(props) {
  const {
    children
  } = props;
  return h("div", {
    className: "nav-item"
  }, children);
}

const Login = O(() => import('./Login-ae98fab0.js'));
const ChangePassword = O(() => import('./ChangePassword-4f60af8f.js'));
const ForgotPassword = O(() => import('./ForgotPassword-45abaeea.js'));
const Signup = O(() => import('./Signup-0be7726a.js'));
const Profile = O(() => import('./Profile-2bba7077.js'));
const AuthFeedback = O(() => import('./AuthFeedback-5f8baab9.js'));
function Authentication({
  children
}) {
  return h("div", null, h(AuthRoute, {
    path: "/changepassword"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(ChangePassword, null))), h(AuthRoute, {
    path: "/login"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Login, null))), h(AuthRoute, {
    path: "/signup"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Signup, null))), h(AuthRoute, {
    path: "/forgotpassword"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(ForgotPassword, null))), h(AuthRoute, {
    path: "/profile"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Profile, null))), h(AuthRoute, {
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

const style = {
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
  const [authRoute, setAuthRoute] = useAuthRouteContext();
  const [rootRoute, setRootRoute] = useRootRouteContext();

  function handleRoute(e) {
    e.preventDefault();
    const {
      id
    } = e.target;
    setRootRoute(`/auth`);
    setAuthRoute(`/${id}`);
  }

  return h("div", {
    style: {
      paddingTop: 10
    }
  }, !state.username && h(UnAuthedState, {
    handleRoute: handleRoute
  }), state.username && h(AuthedState, {
    setRootRoute: setRootRoute,
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
  setRootRoute
}) {
  function handleLogOut() {
    setRootRoute('/home');
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

const initState$1 = {
  validation: {}
};
function formReducer(state, action) {
  let nextState = null;

  switch (action.type) {
    case actionTypes$1.SERVER_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes$1.CLIENT_VALIDATION:
      nextState = { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: action.validationState,
            message: action.message
          }
        }
      };
      return nextState;

    case actionTypes$1.RESET_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          [action.validationType]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$1.INPUT_FOCUSED:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE,
          [action.propName]: {
            validationState: validationStates.INACTIVE,
            message: ''
          }
        }
      };

    case actionTypes$1.INIT_FORM_VALIDATION_STATE:
      return { ...state,
        validation: { ...state.validation,
          formState: validationStates.INACTIVE
        }
      };

    case actionTypes$1.INC_INPUT_COUTN:
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
  const [state, dispatch] = p(formReducer, initState$1);
  const value = h$1(() => [state, dispatch], [state]);
  return h(FormContext.Provider, _extends({
    value: value
  }, props));
}

function OtherContent() {
  const [rootRoute, setRootRoute] = useRootRouteContext();
  const {
    userName
  } = useUserName();

  function handleRoute(e) {
    e.preventDefault();
    const {
      id
    } = e.target;

    if (userName) {
      setRootRoute(`/${id}`);
    } else {
      setRootRoute('/auth');
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

const img$1 = "data:image/png;base64,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";

const AppContext = M();

function AppProvider(props) {
  const {
    title,
    accept_inv_img = img$1
  } = props;
  return h(AppContext.Provider, _extends({
    value: {
      title,
      accept_inv_img
    }
  }, props));
}

function Home() {
  return h("div", {
    "data-testid": "home"
  }, "Home");
}

const Hangouts = O(() => import('./index-ffcac364.js'));
const Group = O(() => import('./group-51240f57.js'));
H(h(AppProvider, {
  title: "Webcom",
  accept_inv_img: img$1
}, h(AuthProvider, null, h(RootRouteProvider, {
  initialRoute: "/"
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
}, h(NavItem, null, "WEB COM")), h(RootRoute, {
  path: "/auth"
}, h(RouteProvider, {
  initialRoute: "/login"
}, h(Authentication, null))), h(RootRoute, {
  path: "/"
}, h(Home, null)), h(RootRoute, {
  path: "/hangouts"
}, h(M$1, {
  fallback: h("div", null, "loading...")
}, h(Hangouts, null))), h(RootRoute, {
  path: "/group"
}, h(M$1, {
  fallback: h("div", null, "loading...")
}, h(Group, null))), ''))))), document.body);

export { forgotPassword as A, signup as B, ListItem as C, List as L, M, O, Route as R, _extends as _, h as a, useRouteContext as b, M$1 as c, RouteProvider as d, useRootRouteContext as e, useAuthRouteContext as f, useMediaQuery as g, h$1 as h, useFormContext as i, valueChanged as j, login as k, l, validationStates as m, isClientValidationType as n, clientValidation as o, p, m$1 as q, resetInputValidationState as r, styleInject as s, useThemeContext as t, useAuthContext as u, validationTypes as v, w$1 as w, useUserName as x, getTokenFromUrl as y, changePassword as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtNDg5N2FlZWQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2NvbXBhdC9kaXN0L2NvbXBhdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvcm91dGUvcm9vdC1yb3V0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvcm91dGUvcm91dGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3RoZW1lL3RoZW1lLWNvbnRleHQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9pY29ucy9NZW51V2hpdGUuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L0FwcFNoZWxsLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9BcHBCYXIuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L3VzZU1lZGlhUXVlcnkuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2F1dGhSZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aC1yb3V0ZS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aC1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvdXNlVXNlck5hbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uU3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvbk1lc3NhZ2VzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblJlZ2V4LmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vY29uc3RyYWludFZhbGlkYXRvcnMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2h0dHAtc3RhdHVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L05hdmlnYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvRHJhd2VyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvTmF2TGlzdC5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2ljb25zL3VzZXI2NC5wbmciLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm1SZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvT3RoZXJDb250ZW50LmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1jb250ZXh0L2ltZy9hY2NlcHRfaW52aXRhdGlvbi5wbmciLCIuLi8uLi8uLi9jbGllbnQvYXBwLWNvbnRleHQvYXBwLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9Ib21lLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHN1cHBvcnQgPSB7XG4gIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiZcbiAgICAnQmxvYicgaW4gc2VsZiAmJlxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxufVxuXG5mdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbn1cblxuaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gIF1cblxuICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPVxuICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgfVxuICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5eX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1c1xuICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG59XG5cbkJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICB1cmw6IHRoaXMudXJsXG4gIH0pXG59XG5cblJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG59XG5cbmV4cG9ydCB2YXIgRE9NRXhjZXB0aW9uID0gc2VsZi5ET01FeGNlcHRpb25cbnRyeSB7XG4gIG5ldyBET01FeGNlcHRpb24oKVxufSBjYXRjaCAoZXJyKSB7XG4gIERPTUV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG5hbWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpXG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrXG4gIH1cbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRE9NRXhjZXB0aW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaChpbnB1dCwgaW5pdCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCAmJiByZXF1ZXN0LnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgZnVuY3Rpb24gYWJvcnRYaHIoKSB7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgIH1cblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgfVxuICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgIH1cblxuICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICB9KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsKSB7XG4gICAgICByZXF1ZXN0LnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgcmVxdWVzdC5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gIH0pXG59XG5cbmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxuXG5pZiAoIXNlbGYuZmV0Y2gpIHtcbiAgc2VsZi5mZXRjaCA9IGZldGNoXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2Vcbn1cbiIsInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLGE9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmR8aXRlcmEvaTtmdW5jdGlvbiBzKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiB5KG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiB5KGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHAoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gayhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGsobil9fWZ1bmN0aW9uIGcobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9cyh7fSxvKSkuX192PWksdD16KGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmsobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLGEscyl7dmFyIGgscCxtLGssZyxfLGIseCxBLFA9aSYmaS5fX2t8fGMsQz1QLmxlbmd0aDtmb3IoYT09ZSYmKGE9bnVsbCE9cj9yWzBdOkM/dyhpLDApOm51bGwpLHUuX19rPVtdLGg9MDtoPGwubGVuZ3RoO2grKylpZihudWxsIT0oaz11Ll9fa1toXT1udWxsPT0oaz1sW2hdKXx8XCJib29sZWFuXCI9PXR5cGVvZiBrP251bGw6XCJzdHJpbmdcIj09dHlwZW9mIGt8fFwibnVtYmVyXCI9PXR5cGVvZiBrP3kobnVsbCxrLG51bGwsbnVsbCxrKTpBcnJheS5pc0FycmF5KGspP3koZCx7Y2hpbGRyZW46a30sbnVsbCxudWxsLG51bGwpOm51bGwhPWsuX19lfHxudWxsIT1rLl9fYz95KGsudHlwZSxrLnByb3BzLGsua2V5LG51bGwsay5fX3YpOmspKXtpZihrLl9fPXUsay5fX2I9dS5fX2IrMSxudWxsPT09KG09UFtoXSl8fG0mJmsua2V5PT1tLmtleSYmay50eXBlPT09bS50eXBlKVBbaF09dm9pZCAwO2Vsc2UgZm9yKHA9MDtwPEM7cCsrKXtpZigobT1QW3BdKSYmay5rZXk9PW0ua2V5JiZrLnR5cGU9PT1tLnR5cGUpe1BbcF09dm9pZCAwO2JyZWFrfW09bnVsbH1pZihnPXoobixrLG09bXx8ZSx0LG8scixmLGEscyksKHA9ay5yZWYpJiZtLnJlZiE9cCYmKHh8fCh4PVtdKSxtLnJlZiYmeC5wdXNoKG0ucmVmLG51bGwsaykseC5wdXNoKHAsay5fX2N8fGcsaykpLG51bGwhPWcpe2lmKG51bGw9PWImJihiPWcpLEE9dm9pZCAwLHZvaWQgMCE9PWsuX19kKUE9ay5fX2Qsay5fX2Q9dm9pZCAwO2Vsc2UgaWYocj09bXx8ZyE9YXx8bnVsbD09Zy5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWF8fGEucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZChnKSxBPW51bGw7ZWxzZXtmb3IoXz1hLHA9MDsoXz1fLm5leHRTaWJsaW5nKSYmcDxDO3ArPTIpaWYoXz09ZylicmVhayBuO24uaW5zZXJ0QmVmb3JlKGcsYSksQT1hfVwib3B0aW9uXCI9PXUudHlwZSYmKG4udmFsdWU9XCJcIil9YT12b2lkIDAhPT1BP0E6Zy5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LnR5cGUmJih1Ll9fZD1hKX1lbHNlIGEmJm0uX19lPT1hJiZhLnBhcmVudE5vZGUhPW4mJihhPXcobSkpfWlmKHUuX19lPWIsbnVsbCE9ciYmXCJmdW5jdGlvblwiIT10eXBlb2YgdS50eXBlKWZvcihoPXIubGVuZ3RoO2gtLTspbnVsbCE9cltoXSYmdihyW2hdKTtmb3IoaD1DO2gtLTspbnVsbCE9UFtoXSYmRChQW2hdLFBbaF0pO2lmKHgpZm9yKGg9MDtoPHgubGVuZ3RoO2grKylqKHhbaF0seFsrK2hdLHhbKytoXSl9ZnVuY3Rpb24geChuKXtyZXR1cm4gbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuP1tdOkFycmF5LmlzQXJyYXkobik/Yy5jb25jYXQuYXBwbHkoW10sbi5tYXAoeCkpOltuXX1mdW5jdGlvbiBBKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxDKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8QyhuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIFAobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1hLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gQyhuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxQKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fFAobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLE4sciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLE4scikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIE4obCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIHoobCx1LGksdCxvLHIsZixlLGMpe3ZhciBhLHYsaCx5LHAsdyxrLGcsXyx4LEEsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsoYT1uLl9fYikmJmEodSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoZz11LnByb3BzLF89KGE9UC5jb250ZXh0VHlwZSkmJnRbYS5fX2NdLHg9YT9fP18ucHJvcHMudmFsdWU6YS5fXzp0LGkuX19jP2s9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoZyx4KToodS5fX2M9dj1uZXcgbShnLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWcsdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9cyh7fSx2Ll9fcykpLHModi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoZyx2Ll9fcykpKSx5PXYucHJvcHMscD12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmZyE9PXkmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGcseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShnLHYuX19zLHgpfHx1Ll9fdj09PWkuX192KXtmb3Iodi5wcm9wcz1nLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGE9MDthPHUuX19rLmxlbmd0aDthKyspdS5fX2tbYV0mJih1Ll9fa1thXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGcsdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZSh5LHAsdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWcsdi5zdGF0ZT12Ll9fcywoYT1uLl9fcikmJmEodSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLGE9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PXMocyh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSh5LHApKSxBPW51bGwhPWEmJmEudHlwZT09ZCYmbnVsbD09YS5rZXk/YS5wcm9wcy5jaGlsZHJlbjphLGIobCxBcnJheS5pc0FycmF5KEEpP0E6W0FdLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGsmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KGE9bi5kaWZmZWQpJiZhKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIGEscyx2LGgseSxwPXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihhPTA7YTxvLmxlbmd0aDthKyspaWYobnVsbCE9KHM9b1thXSkmJigobnVsbD09PWwudHlwZT8zPT09cy5ub2RlVHlwZTpzLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PXMpKXtuPXMsb1thXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXAhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0ocD11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKG51bGwhPW8pZm9yKHA9e30seT0wO3k8bi5hdHRyaWJ1dGVzLmxlbmd0aDt5KyspcFtuLmF0dHJpYnV0ZXNbeV0ubmFtZV09bi5hdHRyaWJ1dGVzW3ldLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9QShuLGQscCx0LGYpLGg/bC5fX2s9W106KGE9bC5wcm9wcy5jaGlsZHJlbixiKG4sQXJyYXkuaXNBcnJheShhKT9hOlthXSxsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PShhPWQudmFsdWUpJiZhIT09bi52YWx1ZSYmQyhuLFwidmFsdWVcIixhLHAudmFsdWUsITEpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09KGE9ZC5jaGVja2VkKSYmYSE9PW4uY2hlY2tlZCYmQyhuLFwiY2hlY2tlZFwiLGEscC5jaGVja2VkLCExKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10seih1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6dS5jaGlsZE5vZGVzLmxlbmd0aD9jLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKTpudWxsLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXt2YXIgdSxpO2ZvcihpIGluIGw9cyhzKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSksdT17fSxsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKHVbaV09bFtpXSk7cmV0dXJuIHkobi50eXBlLHUsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsZyhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1LlByb3ZpZGVyLl9fPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gZyh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9cyh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJnModSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksZyh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxnKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCxwIGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCx1LHIsaT0wLG89W10sYz1uLl9fcixmPW4uZGlmZmVkLGU9bi5fX2MsYT1uLnVubW91bnQ7ZnVuY3Rpb24gdih0LHIpe24uX19oJiZuLl9faCh1LHQsaXx8ciksaT0wO3ZhciBvPXUuX19IfHwodS5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj1vLl9fLmxlbmd0aCYmby5fXy5wdXNoKHt9KSxvLl9fW3RdfWZ1bmN0aW9uIG0obil7cmV0dXJuIGk9MSxwKEUsbil9ZnVuY3Rpb24gcChuLHIsaSl7dmFyIG89dih0KyssMik7cmV0dXJuIG8udD1uLG8uX19jfHwoby5fX2M9dSxvLl9fPVtpP2kocik6RSh2b2lkIDAsciksZnVuY3Rpb24obil7dmFyIHQ9by50KG8uX19bMF0sbik7by5fX1swXSE9PXQmJihvLl9fWzBdPXQsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIGwocixpKXt2YXIgbz12KHQrKywzKTshbi5fX3MmJngoby5fX0gsaSkmJihvLl9fPXIsby5fX0g9aSx1Ll9fSC5fX2gucHVzaChvKSl9ZnVuY3Rpb24geShyLGkpe3ZhciBvPXYodCsrLDQpOyFuLl9fcyYmeChvLl9fSCxpKSYmKG8uX189cixvLl9fSD1pLHUuX19oLnB1c2gobykpfWZ1bmN0aW9uIGQobil7cmV0dXJuIGk9NSxoKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBzKG4sdCx1KXtpPTYseShmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09dT91OnUuY29uY2F0KG4pKX1mdW5jdGlvbiBoKG4sdSl7dmFyIHI9dih0KyssNyk7cmV0dXJuIHgoci5fX0gsdSk/KHIuX19IPXUsci5fX2g9bixyLl9fPW4oKSk6ci5fX31mdW5jdGlvbiBUKG4sdCl7cmV0dXJuIGk9OCxoKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIHcobil7dmFyIHI9dS5jb250ZXh0W24uX19jXSxpPXYodCsrLDkpO3JldHVybiBpLl9fYz1uLHI/KG51bGw9PWkuX18mJihpLl9fPSEwLHIuc3ViKHUpKSxyLnByb3BzLnZhbHVlKTpuLl9ffWZ1bmN0aW9uIEEodCx1KXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZSh1P3UodCk6dCl9ZnVuY3Rpb24gRihuKXt2YXIgcj12KHQrKywxMCksaT1tKCk7cmV0dXJuIHIuX189bix1LmNvbXBvbmVudERpZENhdGNofHwodS5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXtyLl9fJiZyLl9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIF8oKXtvLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faC5mb3JFYWNoKHEpLHQuX19ILl9faD1bXX1jYXRjaCh1KXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHUsdC5fX3YpLCEwfX0pLG89W119ZnVuY3Rpb24gZyhuKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnUmJm4udSgpfWZ1bmN0aW9uIHEobil7bi51PW4uX18oKX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHUpe3JldHVybiB0IT09blt1XX0pfWZ1bmN0aW9uIEUobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtjJiZjKG4pLHQ9MDt2YXIgcj0odT1uLl9fYykuX19IO3ImJihyLl9faC5mb3JFYWNoKGcpLHIuX19oLmZvckVhY2gocSksci5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciB1PXQuX19jO3UmJnUuX19IJiZ1Ll9fSC5fX2gubGVuZ3RoJiYoMSE9PW8ucHVzaCh1KSYmcj09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHI9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCx1PWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHI9c2V0VGltZW91dCh1LDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHUpKX0pKF8pKX0sbi5fX2M9ZnVuY3Rpb24odCx1KXt1LnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goZyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxxKG4pfSl9Y2F0Y2gocil7dS5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSksdT1bXSxuLl9fZShyLHQuX192KX19KSxlJiZlKHQsdSl9LG4udW5tb3VudD1mdW5jdGlvbih0KXthJiZhKHQpO3ZhciB1PXQuX19jO2lmKHUmJnUuX19IKXRyeXt1Ll9fSC5fXy5mb3JFYWNoKGcpfWNhdGNoKHQpe24uX19lKHQsdS5fX3YpfX07ZXhwb3J0e20gYXMgdXNlU3RhdGUscCBhcyB1c2VSZWR1Y2VyLGwgYXMgdXNlRWZmZWN0LHkgYXMgdXNlTGF5b3V0RWZmZWN0LGQgYXMgdXNlUmVmLHMgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxoIGFzIHVzZU1lbW8sVCBhcyB1c2VDYWxsYmFjayx3IGFzIHVzZUNvbnRleHQsQSBhcyB1c2VEZWJ1Z1ZhbHVlLEYgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7dXNlU3RhdGUgYXMgbix1c2VSZWR1Y2VyIGFzIHQsdXNlRWZmZWN0IGFzIGUsdXNlTGF5b3V0RWZmZWN0IGFzIHIsdXNlUmVmIGFzIG8sdXNlSW1wZXJhdGl2ZUhhbmRsZSBhcyB1LHVzZU1lbW8gYXMgaSx1c2VDYWxsYmFjayBhcyBmLHVzZUNvbnRleHQgYXMgYyx1c2VEZWJ1Z1ZhbHVlIGFzIGF9ZnJvbVwicHJlYWN0L2hvb2tzXCI7ZXhwb3J0KmZyb21cInByZWFjdC9ob29rc1wiO2ltcG9ydHtDb21wb25lbnQgYXMgbCxjcmVhdGVFbGVtZW50IGFzIHMsb3B0aW9ucyBhcyB2LHRvQ2hpbGRBcnJheSBhcyBoLGh5ZHJhdGUgYXMgZCxyZW5kZXIgYXMgcCxfdW5tb3VudCBhcyBtLGNsb25lRWxlbWVudCBhcyB5LGNyZWF0ZVJlZiBhcyBiLGNyZWF0ZUNvbnRleHQgYXMgUyxGcmFnbWVudCBhcyBnfWZyb21cInByZWFjdFwiO2V4cG9ydHtjcmVhdGVFbGVtZW50LGNyZWF0ZUNvbnRleHQsY3JlYXRlUmVmLEZyYWdtZW50LENvbXBvbmVudH1mcm9tXCJwcmVhY3RcIjtmdW5jdGlvbiB3KG4sdCl7Zm9yKHZhciBlIGluIHQpbltlXT10W2VdO3JldHVybiBufWZ1bmN0aW9uIHgobix0KXtmb3IodmFyIGUgaW4gbilpZihcIl9fc291cmNlXCIhPT1lJiYhKGUgaW4gdCkpcmV0dXJuITA7Zm9yKHZhciByIGluIHQpaWYoXCJfX3NvdXJjZVwiIT09ciYmbltyXSE9PXRbcl0pcmV0dXJuITA7cmV0dXJuITF9dmFyIEU9ZnVuY3Rpb24obil7dmFyIHQsZTtmdW5jdGlvbiByKHQpe3ZhciBlO3JldHVybihlPW4uY2FsbCh0aGlzLHQpfHx0aGlzKS5pc1B1cmVSZWFjdENvbXBvbmVudD0hMCxlfXJldHVybiBlPW4sKHQ9cikucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5fX3Byb3RvX189ZSxyLnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obix0KXtyZXR1cm4geCh0aGlzLnByb3BzLG4pfHx4KHRoaXMuc3RhdGUsdCl9LHJ9KGwpO2Z1bmN0aW9uIEMobix0KXtmdW5jdGlvbiBlKG4pe3ZhciBlPXRoaXMucHJvcHMucmVmLHI9ZT09bi5yZWY7cmV0dXJuIXImJmUmJihlLmNhbGw/ZShudWxsKTplLmN1cnJlbnQ9bnVsbCksdD8hdCh0aGlzLnByb3BzLG4pfHwhcjp4KHRoaXMucHJvcHMsbil9ZnVuY3Rpb24gcih0KXtyZXR1cm4gdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZSxzKG4sdCl9cmV0dXJuIHIucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9ITAsci5kaXNwbGF5TmFtZT1cIk1lbW8oXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsci50PSEwLHJ9dmFyIF89di5fX2I7di5fX2I9ZnVuY3Rpb24obil7bi50eXBlJiZuLnR5cGUudCYmbi5yZWYmJihuLnByb3BzLnJlZj1uLnJlZixuLnJlZj1udWxsKSxfJiZfKG4pfTt2YXIgQT1cInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yJiZTeW1ib2wuZm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIil8fDM5MTE7ZnVuY3Rpb24gayhuKXtmdW5jdGlvbiB0KHQsZSl7dmFyIHI9dyh7fSx0KTtyZXR1cm4gZGVsZXRlIHIucmVmLG4ocix0LnJlZnx8ZSl9cmV0dXJuIHQuJCR0eXBlb2Y9QSx0LnJlbmRlcj10LHQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9dC50PSEwLHQuZGlzcGxheU5hbWU9XCJGb3J3YXJkUmVmKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHR9dmFyIFI9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9oKG4pLnJlZHVjZShmdW5jdGlvbihuLGUscil7cmV0dXJuIG4uY29uY2F0KHQoZSxyKSl9LFtdKTpudWxsfSxGPXttYXA6Uixmb3JFYWNoOlIsY291bnQ6ZnVuY3Rpb24obil7cmV0dXJuIG4/aChuKS5sZW5ndGg6MH0sb25seTpmdW5jdGlvbihuKXtpZigxIT09KG49aChuKSkubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNoaWxkcmVuLm9ubHkoKSBleHBlY3RzIG9ubHkgb25lIGNoaWxkLlwiKTtyZXR1cm4gblswXX0sdG9BcnJheTpofSxOPXYuX19lO2Z1bmN0aW9uIFUobil7cmV0dXJuIG4mJigobj13KHt9LG4pKS5fX2M9bnVsbCxuLl9faz1uLl9fayYmbi5fX2subWFwKFUpKSxufWZ1bmN0aW9uIE0oKXt0aGlzLl9fdT0wLHRoaXMubz1udWxsLHRoaXMuX19iPW51bGx9ZnVuY3Rpb24gTChuKXt2YXIgdD1uLl9fLl9fYztyZXR1cm4gdCYmdC51JiZ0LnUobil9ZnVuY3Rpb24gTyhuKXt2YXIgdCxlLHI7ZnVuY3Rpb24gbyhvKXtpZih0fHwodD1uKCkpLnRoZW4oZnVuY3Rpb24obil7ZT1uLmRlZmF1bHR8fG59LGZ1bmN0aW9uKG4pe3I9bn0pLHIpdGhyb3cgcjtpZighZSl0aHJvdyB0O3JldHVybiBzKGUsbyl9cmV0dXJuIG8uZGlzcGxheU5hbWU9XCJMYXp5XCIsby50PSEwLG99ZnVuY3Rpb24gUCgpe3RoaXMuaT1udWxsLHRoaXMubD1udWxsfXYuX19lPWZ1bmN0aW9uKG4sdCxlKXtpZihuLnRoZW4pZm9yKHZhciByLG89dDtvPW8uX187KWlmKChyPW8uX19jKSYmci5fX2MpcmV0dXJuIHIuX19jKG4sdC5fX2MpO04obix0LGUpfSwoTS5wcm90b3R5cGU9bmV3IGwpLl9fYz1mdW5jdGlvbihuLHQpe3ZhciBlPXRoaXM7bnVsbD09ZS5vJiYoZS5vPVtdKSxlLm8ucHVzaCh0KTt2YXIgcj1MKGUuX192KSxvPSExLHU9ZnVuY3Rpb24oKXtvfHwobz0hMCxyP3IoaSk6aSgpKX07dC5fX2M9dC5jb21wb25lbnRXaWxsVW5tb3VudCx0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dSgpLHQuX19jJiZ0Ll9fYygpfTt2YXIgaT1mdW5jdGlvbigpe3ZhciBuO2lmKCEtLWUuX191KWZvcihlLl9fdi5fX2tbMF09ZS5zdGF0ZS51LGUuc2V0U3RhdGUoe3U6ZS5fX2I9bnVsbH0pO249ZS5vLnBvcCgpOyluLmZvcmNlVXBkYXRlKCl9O2UuX191Kyt8fGUuc2V0U3RhdGUoe3U6ZS5fX2I9ZS5fX3YuX19rWzBdfSksbi50aGVuKHUsdSl9LE0ucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuLHQpe3JldHVybiB0aGlzLl9fYiYmKHRoaXMuX192Ll9fa1swXT1VKHRoaXMuX19iKSx0aGlzLl9fYj1udWxsKSxbcyhsLG51bGwsdC51P251bGw6bi5jaGlsZHJlbiksdC51JiZuLmZhbGxiYWNrXX07dmFyIFc9ZnVuY3Rpb24obix0LGUpe2lmKCsrZVsxXT09PWVbMF0mJm4ubC5kZWxldGUodCksbi5wcm9wcy5yZXZlYWxPcmRlciYmKFwidFwiIT09bi5wcm9wcy5yZXZlYWxPcmRlclswXXx8IW4ubC5zaXplKSlmb3IoZT1uLmk7ZTspe2Zvcig7ZS5sZW5ndGg+MzspZS5wb3AoKSgpO2lmKGVbMV08ZVswXSlicmVhaztuLmk9ZT1lWzJdfX07KFAucHJvdG90eXBlPW5ldyBsKS51PWZ1bmN0aW9uKG4pe3ZhciB0PXRoaXMsZT1MKHQuX192KSxyPXQubC5nZXQobik7cmV0dXJuIHJbMF0rKyxmdW5jdGlvbihvKXt2YXIgdT1mdW5jdGlvbigpe3QucHJvcHMucmV2ZWFsT3JkZXI/KHIucHVzaChvKSxXKHQsbixyKSk6bygpfTtlP2UodSk6dSgpfX0sUC5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4pe3RoaXMuaT1udWxsLHRoaXMubD1uZXcgTWFwO3ZhciB0PWgobi5jaGlsZHJlbik7bi5yZXZlYWxPcmRlciYmXCJiXCI9PT1uLnJldmVhbE9yZGVyWzBdJiZ0LnJldmVyc2UoKTtmb3IodmFyIGU9dC5sZW5ndGg7ZS0tOyl0aGlzLmwuc2V0KHRbZV0sdGhpcy5pPVsxLDAsdGhpcy5pXSk7cmV0dXJuIG4uY2hpbGRyZW59LFAucHJvdG90eXBlLmNvbXBvbmVudERpZFVwZGF0ZT1QLnByb3RvdHlwZS5jb21wb25lbnREaWRNb3VudD1mdW5jdGlvbigpe3ZhciBuPXRoaXM7bi5sLmZvckVhY2goZnVuY3Rpb24odCxlKXtXKG4sZSx0KX0pfTt2YXIgaj1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9dmFyIHQ9bi5wcm90b3R5cGU7cmV0dXJuIHQuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dH0sdC5yZW5kZXI9ZnVuY3Rpb24obil7cmV0dXJuIG4uY2hpbGRyZW59LG59KCk7ZnVuY3Rpb24geihuKXt2YXIgdD10aGlzLGU9bi5jb250YWluZXIscj1zKGose2NvbnRleHQ6dC5jb250ZXh0fSxuLnZub2RlKTtyZXR1cm4gdC5zJiZ0LnMhPT1lJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSx0LnA9ITEpLG4udm5vZGU/dC5wPyhlLl9faz10Ll9fayxwKHIsZSksdC5fX2s9ZS5fX2spOih0LnY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIiksZChcIlwiLGUpLGUuYXBwZW5kQ2hpbGQodC52KSx0LnA9ITAsdC5zPWUscChyLGUsdC52KSx0Ll9faz10LnYuX19rKTp0LnAmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpKSx0Lmg9cix0LmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKX0sbnVsbH1mdW5jdGlvbiBEKG4sdCl7cmV0dXJuIHMoeix7dm5vZGU6bixjb250YWluZXI6dH0pfXZhciBIPS9eKD86YWNjZW50fGFsaWdubWVudHxhcmFiaWN8YmFzZWxpbmV8Y2FwfGNsaXAoPyFQYXRoVSl8Y29sb3J8ZmlsbHxmbG9vZHxmb250fGdseXBoKD8hUil8aG9yaXp8bWFya2VyKD8hSHxXfFUpfG92ZXJsaW5lfHBhaW50fHN0b3B8c3RyaWtldGhyb3VnaHxzdHJva2V8dGV4dCg/IUwpfHVuZGVybGluZXx1bmljb2RlfHVuaXRzfHZ8dmVjdG9yfHZlcnR8d29yZHx3cml0aW5nfHgoPyFDKSlbQS1aXS87bC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTt2YXIgVD1cInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yJiZTeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKXx8NjAxMDM7ZnVuY3Rpb24gVihuLHQsZSl7aWYobnVsbD09dC5fX2spZm9yKDt0LmZpcnN0Q2hpbGQ7KXQucmVtb3ZlQ2hpbGQodC5maXJzdENoaWxkKTtyZXR1cm4gcChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9ZnVuY3Rpb24gWihuLHQsZSl7cmV0dXJuIGQobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfXZhciBJPXYuZXZlbnQ7ZnVuY3Rpb24gJChuLHQpe25bXCJVTlNBRkVfXCIrdF0mJiFuW3RdJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobix0LHtjb25maWd1cmFibGU6ITEsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbXCJVTlNBRkVfXCIrdF19LHNldDpmdW5jdGlvbihuKXt0aGlzW1wiVU5TQUZFX1wiK3RdPW59fSl9di5ldmVudD1mdW5jdGlvbihuKXtJJiYobj1JKG4pKSxuLnBlcnNpc3Q9ZnVuY3Rpb24oKXt9O3ZhciB0PSExLGU9ITEscj1uLnN0b3BQcm9wYWdhdGlvbjtuLnN0b3BQcm9wYWdhdGlvbj1mdW5jdGlvbigpe3IuY2FsbChuKSx0PSEwfTt2YXIgbz1uLnByZXZlbnREZWZhdWx0O3JldHVybiBuLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7by5jYWxsKG4pLGU9ITB9LG4uaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sbi5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gZX0sbi5uYXRpdmVFdmVudD1ufTt2YXIgcT17Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNsYXNzfX0sQj12LnZub2RlO3Yudm5vZGU9ZnVuY3Rpb24obil7bi4kJHR5cGVvZj1UO3ZhciB0PW4udHlwZSxlPW4ucHJvcHM7aWYodCl7aWYoZS5jbGFzcyE9ZS5jbGFzc05hbWUmJihxLmVudW1lcmFibGU9XCJjbGFzc05hbWVcImluIGUsbnVsbCE9ZS5jbGFzc05hbWUmJihlLmNsYXNzPWUuY2xhc3NOYW1lKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImNsYXNzTmFtZVwiLHEpKSxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXt2YXIgcixvLHU7Zm9yKHUgaW4gZS5kZWZhdWx0VmFsdWUmJnZvaWQgMCE9PWUudmFsdWUmJihlLnZhbHVlfHwwPT09ZS52YWx1ZXx8KGUudmFsdWU9ZS5kZWZhdWx0VmFsdWUpLGRlbGV0ZSBlLmRlZmF1bHRWYWx1ZSksQXJyYXkuaXNBcnJheShlLnZhbHVlKSYmZS5tdWx0aXBsZSYmXCJzZWxlY3RcIj09PXQmJihoKGUuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24obil7LTEhPWUudmFsdWUuaW5kZXhPZihuLnByb3BzLnZhbHVlKSYmKG4ucHJvcHMuc2VsZWN0ZWQ9ITApfSksZGVsZXRlIGUudmFsdWUpLGUpaWYocj1ILnRlc3QodSkpYnJlYWs7aWYocilmb3IodSBpbiBvPW4ucHJvcHM9e30sZSlvW0gudGVzdCh1KT91LnJlcGxhY2UoL1tBLVowLTldLyxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpOnVdPWVbdV19IWZ1bmN0aW9uKHQpe3ZhciBlPW4udHlwZSxyPW4ucHJvcHM7aWYociYmXCJzdHJpbmdcIj09dHlwZW9mIGUpe3ZhciBvPXt9O2Zvcih2YXIgdSBpbiByKS9eb24oQW5pfFRyYXxUb3UpLy50ZXN0KHUpJiYoclt1LnRvTG93ZXJDYXNlKCldPXJbdV0sZGVsZXRlIHJbdV0pLG9bdS50b0xvd2VyQ2FzZSgpXT11O2lmKG8ub25kb3VibGVjbGljayYmKHIub25kYmxjbGljaz1yW28ub25kb3VibGVjbGlja10sZGVsZXRlIHJbby5vbmRvdWJsZWNsaWNrXSksby5vbmJlZm9yZWlucHV0JiYoci5vbmJlZm9yZWlucHV0PXJbby5vbmJlZm9yZWlucHV0XSxkZWxldGUgcltvLm9uYmVmb3JlaW5wdXRdKSxvLm9uY2hhbmdlJiYoXCJ0ZXh0YXJlYVwiPT09ZXx8XCJpbnB1dFwiPT09ZS50b0xvd2VyQ2FzZSgpJiYhL15maWx8Y2hlfHJhL2kudGVzdChyLnR5cGUpKSl7dmFyIGk9by5vbmlucHV0fHxcIm9uaW5wdXRcIjtyW2ldfHwocltpXT1yW28ub25jaGFuZ2VdLGRlbGV0ZSByW28ub25jaGFuZ2VdKX19fSgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJiF0Lm0mJnQucHJvdG90eXBlJiYoJCh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxNb3VudFwiKSwkKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wc1wiKSwkKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbFVwZGF0ZVwiKSx0Lm09ITApfUImJkIobil9O3ZhciBHPVwiMTYuOC4wXCI7ZnVuY3Rpb24gSihuKXtyZXR1cm4gcy5iaW5kKG51bGwsbil9ZnVuY3Rpb24gSyhuKXtyZXR1cm4hIW4mJm4uJCR0eXBlb2Y9PT1UfWZ1bmN0aW9uIFEobil7cmV0dXJuIEsobik/eS5hcHBseShudWxsLGFyZ3VtZW50cyk6bn1mdW5jdGlvbiBYKG4pe3JldHVybiEhbi5fX2smJihwKG51bGwsbiksITApfWZ1bmN0aW9uIFkobil7cmV0dXJuIG4mJihuLmJhc2V8fDE9PT1uLm5vZGVUeXBlJiZuKXx8bnVsbH12YXIgbm49ZnVuY3Rpb24obix0KXtyZXR1cm4gbih0KX0sdG49ZztleHBvcnQgZGVmYXVsdHt1c2VTdGF0ZTpuLHVzZVJlZHVjZXI6dCx1c2VFZmZlY3Q6ZSx1c2VMYXlvdXRFZmZlY3Q6cix1c2VSZWY6byx1c2VJbXBlcmF0aXZlSGFuZGxlOnUsdXNlTWVtbzppLHVzZUNhbGxiYWNrOmYsdXNlQ29udGV4dDpjLHVzZURlYnVnVmFsdWU6YSx2ZXJzaW9uOlwiMTYuOC4wXCIsQ2hpbGRyZW46RixyZW5kZXI6VixoeWRyYXRlOlosdW5tb3VudENvbXBvbmVudEF0Tm9kZTpYLGNyZWF0ZVBvcnRhbDpELGNyZWF0ZUVsZW1lbnQ6cyxjcmVhdGVDb250ZXh0OlMsY3JlYXRlRmFjdG9yeTpKLGNsb25lRWxlbWVudDpRLGNyZWF0ZVJlZjpiLEZyYWdtZW50OmcsaXNWYWxpZEVsZW1lbnQ6SyxmaW5kRE9NTm9kZTpZLENvbXBvbmVudDpsLFB1cmVDb21wb25lbnQ6RSxtZW1vOkMsZm9yd2FyZFJlZjprLHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzOm5uLFN0cmljdE1vZGU6ZyxTdXNwZW5zZTpNLFN1c3BlbnNlTGlzdDpQLGxhenk6T307ZXhwb3J0e0cgYXMgdmVyc2lvbixGIGFzIENoaWxkcmVuLFYgYXMgcmVuZGVyLFogYXMgaHlkcmF0ZSxYIGFzIHVubW91bnRDb21wb25lbnRBdE5vZGUsRCBhcyBjcmVhdGVQb3J0YWwsSiBhcyBjcmVhdGVGYWN0b3J5LFEgYXMgY2xvbmVFbGVtZW50LEsgYXMgaXNWYWxpZEVsZW1lbnQsWSBhcyBmaW5kRE9NTm9kZSxFIGFzIFB1cmVDb21wb25lbnQsQyBhcyBtZW1vLGsgYXMgZm9yd2FyZFJlZixubiBhcyB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyx0biBhcyBTdHJpY3RNb2RlLE0gYXMgU3VzcGVuc2UsUCBhcyBTdXNwZW5zZUxpc3QsTyBhcyBsYXp5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBhdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgUm9vdFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBSb290Um91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoIH0gPSBwcm9wcztcclxuICBjb25zdCBbcm9vdFJvdXRlLHNldFJvb3RSb3V0ZV0gPSB1c2VSb290Um91dGVDb250ZXh0KCk7XHJcblxyXG4gIGlmIChyb290Um91dGUgPT09IHBhdGgpIHtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTGluayhwcm9wcykge1xyXG4gIGNvbnN0IHsgdG8sIGlkIH0gPSBwcm9wcztcclxuICBjb25zdCBbcm9vdFJvdXRlLCBzZXRSb290Um91dGVdID0gdXNlUm9vdFJvdXRlQ29udGV4dCgpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldFJvb3RSb3V0ZSh0byk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8YVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgICAgaHJlZj17dG99XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxyXG4gICAgICBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnIH19XHJcbiAgICAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VSb290Um91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFJvb3RSb3V0ZUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VSb290Um91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFJvb3RSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gUm9vdFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGluaXRpYWxSb3V0ZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3Jvb3RSb3V0ZSwgc2V0Um9vdFJvdXRlXSA9IHVzZVN0YXRlKGluaXRpYWxSb3V0ZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbcm9vdFJvdXRlLCBzZXRSb290Um91dGVdLCBbcm9vdFJvdXRlXSk7XHJcblxyXG4gIHJldHVybiA8Um9vdFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbcm91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XHJcblxyXG4gIGlmIChyb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmsocHJvcHMpIHtcclxuICBjb25zdCB7IHRvLCBpZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRSb3V0ZSh0byk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8YVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgICAgaHJlZj17dG99XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxyXG4gICAgICBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnIH19XHJcbiAgICAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoUm91dGVDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBpbml0aWFsUm91dGUgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoaW5pdGlhbFJvdXRlKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtyb3V0ZSwgc2V0Um91dGVdLCBbcm91dGVdKTtcclxuXHJcbiAgcmV0dXJuIDxSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VUaGVtZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcclxuXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBUaGVtZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcclxuICBcclxuICBjb25zdCB7IGluaXRTdGF0ZSB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoaW5pdFN0YXRlKTtcclxuXHJcbiAgcmV0dXJuIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VUaGVtZUNvbnRleHQsIFRoZW1lUHJvdmlkZXIgfTtcclxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0ICcuLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGZ1bmN0aW9uIE1lbnVXaGl0ZSh7IG9uQ2xpY2ssIGRldmljZSwgaWQgfSkge1xyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uQ2xpY2soKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2JywgZGV2aWNlKTtcclxuICAgIHN3aXRjaCAoZGV2aWNlKSB7XHJcbiAgICAgIGNhc2UgJ3Bob25lJzpcclxuICAgICAgICBvbkNsaWNrKCcvcGhvbmUnKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAndGFibGV0JzpcclxuICAgICAgICBvbkNsaWNrKCcvdGFibGV0Jyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2xhcHRvcCc6XHJcbiAgICAgICAgb25DbGljaygnL2xhcHRvcCcpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdkZXNrdG9wJzpcclxuICAgICAgICBvbkNsaWNrKCcvZGVza3RvcCcpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPHN2Z1xyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZU9uQ2xpY2t9XHJcbiAgICAgIGNsYXNzTmFtZT0nbWVudS13aGl0ZSdcclxuICAgICAgdmlld0JveD0nMCAwIDI0IDI0J1xyXG4gICAgICBmaWxsPSd3aGl0ZSdcclxuICAgICAgd2lkdGg9JzI0cHgnXHJcbiAgICAgIGhlaWdodD0nMjRweCdcclxuICAgID5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD0nbm9uZScgLz5cclxuICAgICAgPHBhdGggZD0nTTMgMThoMTh2LTJIM3Yyem0wLTVoMTh2LTJIM3Yyem0wLTd2MmgxOFY2SDN6JyAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFNoZWxsKHsgY2hpbGRyZW4gfSkge1xyXG4gIHJldHVybiA8ZGl2ID57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VUaGVtZUNvbnRleHQgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuZXhwb3J0IGZ1bmN0aW9uIEFwcEJhcih7IGNoaWxkcmVuIH0pIHtcclxuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lQ29udGV4dCgpO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgLi4udGhlbWUucHJpbWFyeSxcclxuICAgICAgICAvLyBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAvLyBsZWZ0OiAwLFxyXG4gICAgICAgIC8vIHRvcDogMCxcclxuICAgICAgICBtaW5IZWlnaHQ6IDY0LFxyXG4gICAgICAgIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgICBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PntjaGlsZHJlbn08L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tICcuL2RldmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKSB7XHJcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW29yaWVudGF0aW9uLCBzZXRPcmllbnRhdGlvbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2RldmljZSwgc2V0RGV2aWNlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XHJcbiAgIFxyXG4gICAgICBzZXRXaWR0aCh3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbiAgICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpIHtcclxuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xyXG4gIH1cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoID4gMCkge1xyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDYwMDpcclxuICAgICAgICAgIHNldERldmljZSgncGhvbmUnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNzY4OlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gOTkyOlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcclxuICAgICAgICAgIHNldERldmljZSgndGFibGV0Jyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2xhcHRvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2Rlc2t0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3dpZHRoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2aWNlJywgZGV2aWNlKTtcclxuICB9LCBbZGV2aWNlXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGhhbmRsZVZpZXdwb3J0U2l6ZSgpO1xyXG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTFVFX0NIQU5HRUQ6ICdWQUxVRV9DSEFOR0VEJyxcclxuICBMT0dJTl9TVEFSVEVEOiAnTE9HSU5fU1RBUlRFRCcsXHJcbiAgTE9HSU5fU1VDQ0VTUzogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gIExPR0lOX0ZBSUxFRDogJ0xPR0lOX0ZBSUxFRCcsXHJcblxyXG4gIExPR09VVF9TVEFSVEVEOiAnTE9HT1VUX1NUQVJURUQnLFxyXG4gIExPR09VVF9GQUlMRUQ6ICdMT0dPVVRfRkFJTEVEJyxcclxuICBMT0dPVVRfU1VDQ0VTUzogJ0xPR09VVF9TVUNDRVNTJyxcclxuXHJcbiAgU0lHTlVQX1NUQVJURUQ6ICdTSUdOVVBfU1RBUlRFRCcsXHJcbiAgU0lHTlVQX1NVQ0NFU1M6ICdTSUdOVVBfU1VDQ0VTUycsXHJcbiAgU0lHTlVQX0ZBSUxFRDogJ1NJR05VUF9GQUlMRUQnLFxyXG5cclxuICBDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDogJ0NIQU5HRV9QQVNTV09SRF9TVEFSVEVEJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzogJ0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTJyxcclxuICBDSEFOR0VfUEFTU1dPUkRfRkFJTEVEOiAnQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCcsXHJcblxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCcsXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDogJ1JFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEJyxcclxuICBHT1RfVE9LRU5fRlJPTV9VUkw6ICdHT1RfVE9LRU5fRlJPTV9VUkwnLFxyXG5cclxuICBSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEU6ICdSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUnLFxyXG59O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgZW1haWw6ICcnLFxyXG4gIHBhc3N3b3JkOiAnJyxcclxuICBzdWNjZXNzOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxuICB1c2VybmFtZTogJycsXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgY29uZmlybTogJycsXHJcbiAgY3VycmVudDogJycsXHJcbiAgZW1haWxvcnVzZXJuYW1lOiAnJyxcclxuICB0b2tlbjogbnVsbCxcclxuICBpc0xvZ2dlZEluOiBmYWxzZSxcclxuICBpc1Bhc3N3b3JkQ2hhbmdlZDogZmFsc2UsXHJcbiAgYXV0aEZlZWRiYWNrOiBudWxsLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQ6XHJcbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBbYWN0aW9uLnBheWxvYWQucHJvcE5hbWVdOiBhY3Rpb24ucGF5bG9hZC52YWx1ZSxcclxuICAgICAgfTtcclxuICBcclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZSwgJyxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9HSU5fRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBpc0xvZ2dlZEluOiB0cnVlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ1dlbGNvbWUnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB0b2tlbjogYWN0aW9uLnRva2VuLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi5lbWFpbCxcclxuICAgICAgICBpc1Bhc3N3b3JkQ2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICBhdXRoRmVlZGJhY2s6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLnBheWxvYWQuZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdG9rZW46IGFjdGlvbi50b2tlbiB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uaW5pdFN0YXRlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXIudXNlcm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGFjdGlvbi51c2VyLmVtYWlsLFxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgQXV0aFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoIH0gPSBwcm9wcztcclxuXHJcbiAgY29uc3QgW2F1dGhSb3V0ZV0gPSB1c2VBdXRoUm91dGVDb250ZXh0KCk7XHJcblxyXG4gIGlmIChhdXRoUm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMaW5rKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0bywgaWQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0gPSB1c2VBdXRoUm91dGVDb250ZXh0KCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2V0Um91dGUodG8pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGFcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICB7Li4ucHJvcHN9XHJcbiAgICAgIGhyZWY9e3RvfVxyXG4gICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja31cclxuICAgICAgc3R5bGU9e3sgdGV4dERlY29yYXRpb246ICdub25lJywgY29sb3I6ICdpbmhlcml0JyB9fVxyXG4gICAgLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoUm91dGVDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBdXRoUm91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBpbml0aWFsUm91dGUgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0gPSB1c2VTdGF0ZShpbml0aWFsUm91dGUpO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSwgW2F1dGhSb3V0ZV0pO1xyXG5cclxuICByZXR1cm4gPEF1dGhSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGF1dGhSZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2F1dGhSZWR1Y2VyJztcclxuaW1wb3J0IHsgQXV0aFJvdXRlUHJvdmlkZXIgfSBmcm9tICcuL2F1dGgtcm91dGUtY29udGV4dCc7XHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlQXV0aENvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc3RhdGUsXHJcbiAgICBkaXNwYXRjaCxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBBdXRoUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuIH0gPSBwcm9wcztcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfT5cclxuICAgICAgPEF1dGhSb3V0ZVByb3ZpZGVyPntjaGlsZHJlbn08L0F1dGhSb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VBdXRoQ29udGV4dCwgQXV0aFByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVzZXJOYW1lKCkge1xyXG4gIGNvbnN0IFt1c2VyTmFtZSwgc2V0VXNlcm5hbWVdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbZW1haWwsIHNldEVtYWlsXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCB7IHN0YXRlLGRpc3BhdGNoIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgXHJcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG4gXHJcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIHRva2VuLCBlbWFpbCB9ID0gSlNPTi5wYXJzZShcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpXHJcbiAgICAgICk7XHJcbiAgICAgIHNldFVzZXJuYW1lKHVzZXJuYW1lKTtcclxuICAgICAgc2V0VG9rZW4odG9rZW4pO1xyXG4gICAgICBzZXRFbWFpbChlbWFpbCk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLnRva2VuKSB7XHJcbiAgXHJcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0b2tlbiB9ID1zdGF0ZTtcclxuICAgICAgLy8gY29uc3QgeyB1c2VybmFtZSwgdG9rZW4sIGVtYWlsIH0gPSBKU09OLnBhcnNlKFxyXG4gICAgICAvLyAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJylcclxuICAgICAgLy8gKTtcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgIH1cclxuICB9LCBbc3RhdGVdKTtcclxuXHJcbiAgcmV0dXJuIHsgdXNlck5hbWUsIHRva2VuLCBlbWFpbCB9O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxJRDogJ1ZBTElEJyxcclxuICBJTlZBTElEOiAnSU5WQUxJRCcsXHJcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRSdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIC8vY29uc3RyYWludFxyXG4gIEVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOiAnUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIEVNUFRZX1NUUklOR19WQUxJREFUSU9OOiAnRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOiAnUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04nLFxyXG4gIC8vYXV0aFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdJTlZBTElEX0NSRURFTlRJQUxTJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ1VTRVJOQU1FX1RBS0VOJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnUkVHSVNURVJFRF9FTUFJTCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdFTUFJTF9OT1RfUkVHSVNURVJFRCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6J1VTRVJOQU1FX05PVF9SRUdJU1RFUkVEJ1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSU5WQUxJRF9QQVNTV09SRDpcclxuICAgICdhdCBsZWFzdCA4IGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBhdCBsZWFzdCAxIHVwcGVyY2FzZSBsZXR0ZXIsIDEgbG93ZXJjYXNlIGxldHRlciwgQ2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzJyxcclxuICBJTlZBTElEX0VNQUlMOiAnZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6ICd1c2VybmFtZSBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRTpcclxuICAgICdvbmx5IExldHRlcnMgYS16IG9yIEEtWiBhbmQgdGhlIFN5bWJvbHMgLSBhbmQgXyBhcmUgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9FTVBUWV9TVFJJTkc6ICdlbXB0eSBzdHJpbmcgaXMgbm90IGFsbG93ZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUw6ICdlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWQnLFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdpbnZhbGlkIGNyZWRlbnRpYWxzIHByb3ZpZGVkJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ3VzZXJuYW1lIGlzIGFscmVhZHkgdGFrZW4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnLFxyXG4gIFBBU1NXT1JEU19ET19OT1RfTUFUQ0g6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJ1xyXG59O1xyXG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VybmFtZVJlZ2V4ID0gL1thLXpBLVpdK1stX10qW2EtekEtWl0rL2c7XHJcbiIsImltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSAnLi92YWxpZGF0aW9uUmVnZXgnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XHJcbiAgY29uc3QgcGFzc3dvcmRDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChwYXNzd29yZFJlZ2V4KTtcclxuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuICBpZiAoIXBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSkge1xyXG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KSB7XHJcblxyXG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9YXV0aDtcclxuZGVidWdnZXI7XHJcbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTogJ0lOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIFJFU0VUX1ZBTElEQVRJT05fU1RBVEU6ICdSRVNFVF9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIElOUFVUX0JMVVJSRUQ6ICdJTlBVVF9CTFVSUkVEJyxcclxuICAgIElOUFVUX0ZPQ1VTRUQ6ICdJTlBVVF9GT0NVU0VEJyxcclxuICBcclxuICAgIFNFUlZFUl9WQUxJREFUSU9OOiAnU0VSVkVSX1ZBTElEQVRJT04nLFxyXG4gICAgQ0xJRU5UX1ZBTElEQVRJT046J0NMSUVOVF9WQUxJREFUSU9OJyxcclxuICBcclxuICAgIElOQ19JTlBVVF9DT1VUTiA6J0lOQ19JTlBVVF9DT1VUTidcclxuICB9O1xyXG4gICIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2xvZ2luXHJcbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxyXG4gIC8vc2lnbnVwXHJcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcclxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXHJcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcclxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxyXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXHJcbiAgLy9sb2dpblxyXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcclxuICBlbXB0eVN0cmluZ05vdFZhbGlkOiAnNDA5JyxcclxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcclxuICB1c2VybmFtZUlzTm90UmVnaXN0ZXJlZDonNDExJyxcclxuLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXHJcbiAgdG9rZW5FeHBpcmVkOic0MTMnLFxyXG4gIHNlcnZlclZhbGlkYXRpb25SYW5nZTogc3RhdHVzID0+IHtcclxuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG4iLCJcclxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbnMgZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBjb25zdFZhbFR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZSwgdmFsdWUsIHN0YXRlLGF1dGggfSkge1xyXG5cclxuICBsZXQgdmFsaWRhdGlvbiA9IG51bGw7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoe1xyXG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe1xyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICBcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTiwgLi4udmFsaWRhdGlvbiB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdEZvcm1WYWxpZGF0aW9uU3RhdGUoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURSwgdmFsaWRhdGlvblR5cGUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluY0lucHV0Q291bnQoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROIH07XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAgfSkge1xyXG5cclxuICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNUYWtlbjpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVN0cmluZ05vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7IHNlcnZlclZhbGlkYXRpb24gfSBmcm9tICcuLi9mb3JtL2FjdGlvbnMnO1xyXG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuLi9mb3JtL2h0dHAtc3RhdHVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlQ2hhbmdlZCh7IHByb3BOYW1lLCB2YWx1ZSB9KSB7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBwcm9wTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL2xvZ2luYCwge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJyonLFxyXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCYXNpYyAke2J0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApfWAsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiBcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsIHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSk7XHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICBcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTG9naW4gZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWdudXAoeyBkaXNwYXRjaCwgZm9ybURpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRCB9KTtcclxuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCwgdXNlcm5hbWUgfSA9IHN0YXRlO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9zaWdudXBgLCB7XHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGFzc3dvcmQsIGVtYWlsLCB1c2VybmFtZSB9KSxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIENvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTLCB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0pO1xyXG5cclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWdudXAgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3dlYmNvbScpO1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVF9TVUNDRVNTIH07XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2gsIHRva2VuIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIH0pO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGNvbmZpcm0sIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlfdXJsfS9hdXRoL2NoYW5nZXBhc3NgLCB7XHJcbiAgICAgIG1ldGhvZDogJ3B1dCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBjb25maXJtLFxyXG4gICAgICAgIHBhc3N3b3JkLFxyXG4gICAgICAgIHRva2VuLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyxcclxuICAgICAgICB0b2tlbixcclxuICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICBtZXNzYWdlOiBgUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuYCxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9yZXF1ZXN0cGFzc2NoYW5nZWAsIHtcclxuICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXHJcbiAgICB9KTtcclxuICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXHJcbiAgICAgICAgbWVzc2FnZTogYEEgbGluayBmb3IgcGFzc3dvcmQgY2hhbmdlICBoYXMgYmVlbiBzZW50IHRvLCAke2VtYWlsfSEgYCxcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUb2tlbkZyb21VcmwoeyB0b2tlbiB9KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTCxcclxuICAgIHRva2VuLFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNvdmVyTG9jYWxBdXRoU3RhdGUoeyB1c2VyLCBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUsIHVzZXIgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZHVjZXIgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VUaGVtZUNvbnRleHQgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5pbXBvcnQgeyBNZW51V2hpdGUgfSBmcm9tICcuL2ljb25zL01lbnVXaGl0ZSc7XHJcbmltcG9ydCB7IEFwcFNoZWxsIH0gZnJvbSAnLi4vbGF5b3V0L0FwcFNoZWxsJztcclxuaW1wb3J0IHsgQXBwQmFyIH0gZnJvbSAnLi4vbGF5b3V0L0FwcEJhcic7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCB7IHVzZVVzZXJOYW1lIH0gZnJvbSAnLi4vYXV0aC91c2VVc2VyTmFtZSc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5pbXBvcnQgeyByZWNvdmVyTG9jYWxBdXRoU3RhdGUgfSBmcm9tICcuLi9hdXRoL2FjdGlvbnMnO1xyXG5cclxuY29uc3QgUGhvbmVEcmF3ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9QaG9uZURyYXdlcicpKTtcclxuY29uc3QgVGFibGV0RHJhd2VyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vVGFibGV0RHJhd2VyJykpO1xyXG5jb25zdCBMYXB0b3BEcmF3ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9MYXBUb3BEcmF3ZXInKSk7XHJcbmNvbnN0IERlc2t0b3BEcmF3ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9EZXNrdG9wRHJhd2VyJykpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2aWdhdGlvbihwcm9wcykge1xyXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IHsgdXNlck5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XHJcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIGRyYXdlckNvbnRlbnQgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lQ29udGV4dCgpO1xyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVEcmF3ZXIodG8pIHtcclxuICAgIHNldFJvdXRlKHRvKTtcclxuICAgIHNldE9wZW4oKHByZXYpID0+ICFwcmV2KTtcclxuICB9XHJcbiAgY29uc3QgeyBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xyXG4gIFxyXG4gICAgICByZWNvdmVyTG9jYWxBdXRoU3RhdGUoe1xyXG4gICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgIHVzZXI6IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXBwU2hlbGw+XHJcbiAgICAgIHtyb3V0ZSA9PT0gJy9waG9uZScgJiYgb3BlbiA/IChcclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8UGhvbmVEcmF3ZXIgb25DbGljaz17dG9nZ2xlRHJhd2VyfT57ZHJhd2VyQ29udGVudH08L1Bob25lRHJhd2VyPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgICkgOiBudWxsfVxyXG4gICAgICB7cm91dGUgPT09ICcvdGFibGV0JyAmJiBvcGVuID8gKFxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxUYWJsZXREcmF3ZXIgb25DbGljaz17dG9nZ2xlRHJhd2VyfT57ZHJhd2VyQ29udGVudH08L1RhYmxldERyYXdlcj5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICApIDogbnVsbH1cclxuICAgICAge3JvdXRlID09PSAnL2xhcHRvcCcgJiYgb3BlbiA/IChcclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8TGFwdG9wRHJhd2VyIG9uQ2xpY2s9e3RvZ2dsZURyYXdlcn0+e2RyYXdlckNvbnRlbnR9PC9MYXB0b3BEcmF3ZXI+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgKSA6IG51bGx9XHJcbiAgICAgIHtyb3V0ZSA9PT0gJy9kZXNrdG9wJyAmJiBvcGVuID8gKFxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxEZXNrdG9wRHJhd2VyIG9uQ2xpY2s9e3RvZ2dsZURyYXdlcn0+e2RyYXdlckNvbnRlbnR9PC9EZXNrdG9wRHJhd2VyPnsnICd9XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgKSA6IG51bGx9XHJcbiAgICAgIDxBcHBCYXI+XHJcbiAgICAgICAgPE1lbnVXaGl0ZSBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9IGRldmljZT17ZGV2aWNlfSBpZD0nbWVudScgLz5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgPE5hdkl0ZW0+e3VzZXJOYW1lfTwvTmF2SXRlbT5cclxuICAgICAgPC9BcHBCYXI+XHJcbiAgICA8L0FwcFNoZWxsPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSduYXYtaXRlbSc+e2NoaWxkcmVufTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgQXV0aFJvdXRlIH0gZnJvbSAnLi9hdXRoLXJvdXRlLWNvbnRleHQnO1xyXG5cclxuY29uc3QgTG9naW4gPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9Mb2dpbicpKTtcclxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9DaGFuZ2VQYXNzd29yZCcpKTtcclxuY29uc3QgRm9yZ290UGFzc3dvcmQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vYXV0aC9Gb3Jnb3RQYXNzd29yZCcpKTtcclxuY29uc3QgU2lnbnVwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvU2lnbnVwJykpO1xyXG5jb25zdCBQcm9maWxlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvUHJvZmlsZScpKTtcclxuY29uc3QgQXV0aEZlZWRiYWNrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvQXV0aEZlZWRiYWNrJykpO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBdXRoZW50aWNhdGlvbih7IGNoaWxkcmVuIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPEF1dGhSb3V0ZSBwYXRoPScvY2hhbmdlcGFzc3dvcmQnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDaGFuZ2VQYXNzd29yZCAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvQXV0aFJvdXRlPlxyXG4gICAgICA8QXV0aFJvdXRlIHBhdGg9Jy9sb2dpbic+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPExvZ2luIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BdXRoUm91dGU+XHJcblxyXG4gICAgICA8QXV0aFJvdXRlIHBhdGg9Jy9zaWdudXAnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxTaWdudXAgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0F1dGhSb3V0ZT5cclxuXHJcbiAgICAgIDxBdXRoUm91dGUgcGF0aD0nL2ZvcmdvdHBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Rm9yZ290UGFzc3dvcmQgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0F1dGhSb3V0ZT5cclxuXHJcbiAgICAgIDxBdXRoUm91dGUgcGF0aD0nL3Byb2ZpbGUnPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxQcm9maWxlIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BdXRoUm91dGU+XHJcbiAgICAgIDxBdXRoUm91dGUgcGF0aD0nL2F1dGhmZWVkYmFjayc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEF1dGhGZWVkYmFjayAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvQXV0aFJvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmNvbnN0IHN0eWxlID0ge1xyXG4gIHJvb3Q6IHt9LFxyXG4gIHRvcDoge30sXHJcbiAgYm90dG9tOiB7fSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBEcmF3ZXJDb250ZW50KHsgYXV0aENvbnRlbnQsIG90aGVyQ29udGVudCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICBcclxuICAgICAgICB7YXV0aENvbnRlbnR9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgXHJcbiAgICAgICAge290aGVyQ29udGVudH1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBMaXN0KHsgY2hpbGRyZW4sIGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxyXG5cclxuICAgICAgICBwYWRkaW5nVG9wOiA4LFxyXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpc3RJdGVtKHsgY2hpbGRyZW4sIG9uQ2xpY2ssIGlkIH0pIHtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgaWQ9e2lkfVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGNsYXNzTmFtZT0nZHJhd2VyLWxpc3QtaXRlbSdcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgICAgICBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiAxNixcclxuICAgICAgICBwYWRkaW5nVG9wOiA4LFxyXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FRQUFBQUFZTGxWQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQW1KTFIwUUFBS3FOSXpJQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFIZEVsTlJRZmtCQnNJTFMxWWY5SklBQUFEb0VsRVFWUm8zcjJaUzBoVVVSakhmM010aTlCU00ybFIwdFBKaEVqU1ZpRUUxYUtObFJVVkpGRVFGRkVrYnUyMUs3R0lOaEZGUkErQ2xpVXRhdE5MM0lUUk5LRVJCbEVMZFViSDdLR21jMXZjcmpQanpMMzNmR2Z1K0gyTGdYdk85Lzk5OTV3ejUzVURTSzJNT3FwWVF3WEZGRkVBL0NUR0VEMTBFK1lWL1dKRlphdmxNaUhpbUM0ZUowUWJOWDZqNTlQTVIxZndkQS9UVEtFLzhCTE9NeWlDMno3SU9ZcXpnd2RvcEY4TGJudVVVeGk2K0ZXOHlRcHUrMnRXNnVCM011UUwzc1RrQi90a2NJTXJ2c0Z0YjFQdmlud2UrSTQzTWJuUGJEVjhlMDd3SmlaUHZGTUljQ2RuZUJPVEIxNGQ0WC9mVC9kV04veWVuT05OVFBZNzRWY1NtNUVFWXF6STNQditURHNxL3BKQUFtdmJFVzdLSmd1KzhwQWVJTWgrbGdwakQzRW45VUVKQTZKMytFTVRlVlBSZVRUelJ4VGZSMUZxQWhkRTRXTnNUM3VucmNJVXppUUh6eGN1dU1jeU51dHhrVVkwZWIvUUxBcnRTQm81cWNPNFU2VFRsQWdOaVFKM09RNHQyVHdTdHNOcVJXRy95SGRNSUo5ZklxMXFNTUI1WnNwb0hZdzdsbzNUS2RJNllDV3dUUlRVNjFyNlJhUzFCUXpLV0NzS2lybVdSa1ZhNnlnMXFITVkwMDQyeDdWMHJrakxvTTZnU2hRQ1MxeEx5NFZxVlFaQllVaXRTMWxBZkNZS0dsUUlROHFwZGl5cjhXaWZkS3N3S0JXR3dFbkhraE5pclZLSWlLWU9FNU1KaDRiZXlJUllhd0RHeEVFbW4xbVVoaStqVjBOcFZDOEJrMjRxVS9DVmRHdnBqT3AwZ1IyNmVBby9UN2dYU09vQ2c1L2lnV1BacDZTN2tOOTgxRlFaTVlob2hQM2xPcHVJSnozWnpFMG1OSlFpaU0rQm85eHdPRzZ2NXBaNFJOMkRzNExxY1I2eXpQV05sdk5JbEVBTE5DaFhqbEd2MUt6MURDdHI3b1F5ajNzdjI3OEpKdTFLdml0cFRscno4SHVGcW1NdUswQW0yOEM0Z21xWHRTTjZyaURZUnBjb2diZGNVYWoxelBxcFVSajVDMFY0Z0VVSy80ajFkdVd3UjhWMk1SN2dxWWRxQ1BoL1gzSGJRNnBESzRFM0h1VkoxRUtQbzFtRFZnTHV4NVFJQllrV0dPR2FxMVJNS3dIM3FLdldLbVR2aUl2cHliREcyemFpTmMvUGNybXU3aVBJY09xanc2SXBORnMvbUo1VGdOY3pobitSK1N3eVU1ZFVRNWt2cVFCMnowZ0N6c2Q3b0MzbitJdnVJemZBN1p6aTczdmZtYy9PNFdYMVk3WDc4bG5jeWduK3JocmU2b2hXbitGeExncXZBZGloK2Ewc2t3K3pWd2EzYkFVdmZjRy9ZTGtPM3VxS1J2cXlna2M1S20zNjZWYkVHYUphOEFndExNZ09ibHNCVFh3UXdVT2N0dFo3UDYyYVZ0NHg2UXFlcEl0TGliMmVTaTlMclpRNjFsSkpCU1ZKbis4SHB6N2ZDOCthL3dDMVpBWHMzVWhVSEFBQUFDVjBSVmgwWkdGMFpUcGpjbVZoZEdVQU1qQXlNQzB3TkMweU4xUXdPRG8wTlRvME5Tc3dNRG93TUJhd1NWUUFBQUFsZEVWWWRHUmhkR1U2Ylc5a2FXWjVBREl3TWpBdE1EUXRNamRVTURnNk5EVTZORFVyTURBNk1EQm43ZkhvQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUIzZDNjdWFXNXJjMk5oY0dVdWIzSm5tKzQ4R2dBQUFBQkpSVTVFcmtKZ2dnPT1cIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSb290Um91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm9vdC1yb3V0ZXInO1xyXG5pbXBvcnQgeyB1c2VBdXRoUm91dGVDb250ZXh0IH0gZnJvbSAnLi9hdXRoLXJvdXRlLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcclxuaW1wb3J0IHVzZXJJY29uIGZyb20gJy4vaWNvbnMvdXNlcjY0LnBuZyc7XHJcbmltcG9ydCB7IGxvZ291dCB9IGZyb20gJy4uL2F1dGgvYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBncmlkOiB7XHJcbiAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnYXV0byA1JSBhdXRvJyxcclxuICAgIGp1c3RpZnlJdGVtczogJ2NlbnRlcicsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoQ29udGVudCgpIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IFthdXRoUm91dGUsIHNldEF1dGhSb3V0ZV0gPSB1c2VBdXRoUm91dGVDb250ZXh0KCk7XHJcbiAgY29uc3QgW3Jvb3RSb3V0ZSwgc2V0Um9vdFJvdXRlXSA9IHVzZVJvb3RSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCB7IGlkIH0gPSBlLnRhcmdldDtcclxuICAgIHNldFJvb3RSb3V0ZShgL2F1dGhgKTtcclxuICAgIHNldEF1dGhSb3V0ZShgLyR7aWR9YCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nVG9wOiAxMCB9fT5cclxuICAgICAgeyFzdGF0ZS51c2VybmFtZSAmJiA8VW5BdXRoZWRTdGF0ZSBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9IC8+fVxyXG4gICAgICB7c3RhdGUudXNlcm5hbWUgJiYgKFxyXG4gICAgICAgIDxBdXRoZWRTdGF0ZVxyXG4gICAgICAgICAgc2V0Um9vdFJvdXRlPXtzZXRSb290Um91dGV9XHJcbiAgICAgICAgICBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9XHJcbiAgICAgICAgICB1c2VyTmFtZT17c3RhdGUudXNlcm5hbWV9XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuICAgICAgPGhyIHN0eWxlPXt7IGhlaWdodDogMSB9fSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUsIHVzZXJOYW1lLCBzZXRSb290Um91dGUgfSkge1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ091dCgpIHtcclxuICAgXHJcbiAgICBzZXRSb290Um91dGUoJy9ob21lJyk7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGltZyBzcmM9e3VzZXJJY29ufSBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDUgfX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZUxvZ091dH0gaWQ9J2xvZ291dCcgZGF0YS10ZXN0aWQ9J2xvZ291dCc+XHJcbiAgICAgICAgICAgIExvZ291dFxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDggfX0+V2VsY29tZSwge3VzZXJOYW1lfTwvZGl2PlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdjaGFuZ2VwYXNzd29yZCc+XHJcbiAgICAgICAgICBDaGFuZ2UgUGFzc3dvcmRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5BdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGUuZ3JpZH0+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdsb2dpbicgZGF0YS10ZXN0aWQ9J2xvZ2luJz5cclxuICAgICAgICAgIExvZ2luXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgIDxkaXY+fDwvZGl2PlxyXG4gICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nc2lnbnVwJyBkYXRhLXRlc3RpZD0nc2lnbnVwJz5cclxuICAgICAgICAgIFNpZ251cFxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHsgdmFsaWRhdGlvbjoge30gfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcblxyXG4gIGxldCBuZXh0U3RhdGUgPSBudWxsO1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFU0VUX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOUFVUX0ZPQ1VTRUQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgW2FjdGlvbi5wcm9wTmFtZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgY291bnQ6IHN0YXRlLmNvdW50ICsgMSB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBmb3JtUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9mb3JtUmVkdWNlcic7XHJcbmNvbnN0IEZvcm1Db250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1Db250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZvcm1Db250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlRm9ybUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggRm9ybVByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gY29udGV4dDtcclxuXHJcbiAgcmV0dXJuIHsgc3RhdGUsIGRpc3BhdGNoIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGb3JtUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoZm9ybVJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEZvcm1Db250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XHJcbmltcG9ydCB7IHVzZVVzZXJOYW1lIH0gZnJvbSAnLi4vYXV0aC91c2VVc2VyTmFtZSc7XHJcbmltcG9ydCB7IHVzZVJvb3RSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb290LXJvdXRlcic7XHJcbmV4cG9ydCBmdW5jdGlvbiBPdGhlckNvbnRlbnQoKSB7XHJcbiAgY29uc3QgW3Jvb3RSb3V0ZSwgc2V0Um9vdFJvdXRlXSA9IHVzZVJvb3RSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgY29uc3QgeyB1c2VyTmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBpZiAodXNlck5hbWUpIHtcclxuICAgICAgc2V0Um9vdFJvdXRlKGAvJHtpZH1gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNldFJvb3RSb3V0ZSgnL2F1dGgnKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2NoYXQnPlxyXG4gICAgICAgICAgQ2hhdFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtPkl0ZW0gVHdvPC9MaXN0SXRlbT5cclxuXHJcbiAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0naGFuZ291dHMnPlxyXG4gICAgICAgICAgSGFuZ291dFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nZ3JvdXAnPlxyXG4gICAgICAgICAgR3JvdXBcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICA8L0xpc3Q+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFPRUFBQURoQ0FNQUFBQUpiU0pJQUFBQkdsQk1WRVgvLy84QXdOS24yZjk5WkdsVHpOK0pibmlsMSt0clVsWEk1dnJUN1ArWW83dWkxLzhBdk0rMDN2L0c1ZnFuMnY5c1NVcWszZkZhdTh5cDN2L1A2di8xKy8rcjJPeTA1L0NIWm01V3l0Mjg0ditpMXVxSWFuT0JaMjUyVzJDNzRmL2s4Lys0My9ORHlkdmc4Zjl6VjEzRzV2L0E2L0dacXNSblRFL2M5UGN3eHRpTDIrWFE4UFNLY24yYXJjaVBocGV0bjZlUmphQ2h4dWVHMGVXZXZOdkp3c1dodytTams1enc3L0NSZjRUU3p0QmhSRWVMMHVacDA5K2M0ZWx6MWVHUG1LeUVlSVBlM04rY2lwUzFxNjdBdUx5VWZvamk1KzdHemR1MHZNN2w2TzYwcjdtd29xaWhsSmFscjcyKzArU290Y041Y0hpTW5hcWR3dFI2ZFgyUnFybUVpNVozbTZnM3I3NWZmWWRxWDJOVGw2UnZ0c1psUFQ5aS9aTzZBQUFSeVVsRVFWUjRuTjJkQ1h2YU9CckhnWVFFZ3NITmdoMEk1b1ljcENSTlNOS2NKVTFDcCswbXN6c3puVDI2dTkvL2E2d2tYN0l1eTdLNThuK2VtUWxZbHZUVCsrcDlKUm1ZVkdybU1veDJMMThaN0JhQmREMmo2L0NQM1VFbDMyc2J4dXlibjZtTVhxVlZ6QlNRTXFTY3Q0dXRTbThsT1kzZW9NZ0Vvd1dMRlFjcmhXbmtXeGs1dUFCbXBwVmZDY3IyUUk4SWgyUHFnL2FpQVlReWVxMm90bVBZc3JXMERndnhZdEg1bEszZW9tRm90WGNUd25NaGw4eGQ4OFVrOFJ6SVluN1JXSzZNUWFMbXd4Z0xnMldZa1VaU3M0L04yRm8wWTNzRzdrbEFGdHR2bW0reGpNQS81OENIR0JmaXF5Qyt6SWtQTWM0LzV1Um5HRitZaUlYNTVvNjJQbDgreEtpMzV3ZW80cUFnOElOTmNDekxGd1p6NHVzcGRkTmVhY2FidllYQ1hOYXJ1eW9HTEhxM3R5WDN4WnlLZG1mTzE4Nm9kSzlJVktLZVJ3dVo5bXdCMVp5c1FJWDZYWFZMem5RMkdvcGp6M0N0ZkM4L1VISUg2UEl6eTQwOTFWSG54WWVlV24zOENtT3Fvbno4d2g5ejJmTTRzc2JLTEFCanJFSjNCNzUyZzdnOUF4N3VSRWRzSmM1bkpMU0tZUzYrMmdxSWVzS1RVYUVQYkJXWjFSc3FucG9vWW1LQWhUYTdnYndLSXFjdUZha0dVWVo0VGFpMGtGeElGUTV3dEdESWRsS2dsZ0loZTFJclNKZ2xXb05LWlNEZnZaYkIwVUNGTUtHc0lRQXNGUE8yS2tYbmpWQjdGamhTQWt3R2tRc0luekRrUGNIVURmSmVaYkE3MzgxeGZFUXVZQkc0Wng0VGNGYm5yNEcrU29pOElGTVk1UG1xekpNd1pyamhSdEdpQUhDVkVQbUpYbVJDb04yNG5jN0FUelhJVG1qMTFDOVlTN1YyUGJVWXRER04yTEpuK0VCMk82cTZnSk5jTEJaMkdVWlVEemFGZ3U1SE1Oa3NxWWdvMjBzUVZDa1ZGZm5BQW1LQWgyalpVeE5kQlZCKzE1WllBaTlXS0dlUW5ORXErMFhsSGIyNmRGYlFrcnczZWxwTWJMOFVRYlFGSTRUbHFBRlZaVXNxMVErQkM3TnpyTFF2Ull3MnFwRkMzSWZNYnI3WDd2R1NRSXRKS0w4MzV1N01XSnJGSkN4a3ZMV0h3WDR5VUdSS3ZvRUlVM0VXa3pBWTdSSThOY0NhYUVzVE11N1d5MEF4Tmcza1dieWhYcFZBc29DVUR3Rzg4NGVUazlQemNsbWgyUUpZNHhXcGZOV0c3eVpzU2RrblU2UUg2ZVhNVnFQWmJGaFdkWFNzWUVmQmVSRm5RaXBMOG15S3VLdXNiNjAxMTliV0dsbWc2dWV6aUdZTWlYQXF4NGdpeVFBR2w0TGw4akhpQTRLRVdhdTZGYzJNWVZrcTJZOTB5RHg2QzhSUnZYemVjUGdjUW1ER2s0eThHU1YycDBrQ1NzVlQzRURsc3hPUHp5UE1XbGw1VDVWWWFFUTVSeXp1RGxvaEcrUFFYUVkyTC9UeUZzYTN0bWE1aU5ucXNUUmlLS0Q4VEhTUDlzUkRFdVkxL25wVUwxODJBb0IycUhFUUgyUW5JM3VkRW5uUlVpZ09CdDVaZ3ZnRUljUnR2SGxmenB3RytRS0UwU1pqYk9uRjREbUNNRHFKZzQxclF0MlBvR3pDU0pNeHBoaW5KRUlIRWhyUmVRQlJQdnRNOFJHRXdJejdjVlp4a2dKYkxkYXVVYnhwRk96MzdVeFIxaDhZZkJRaDh0VFpNaGJvZzNWYllrSkJ4b0NUSHFiQU5Rc3MwWUFuTm9Eb2JPRjdhblZMbnlrajdaOXlLMW51T2dxWUVLeEJUNnNraVkxSm1oQ1pjYlIvVmxaYWprdDFsT0dmVWpkeWpWZ0U4ZkdoYWpGSStMS3Exc21zSm1STCtaaVNZMFJEejJ4bG8vRTVsanlkRWFMeU1TVW5uTGEyTEJVK2lIZ3l4K1FvSmVaRzhYdEUveVNzdUdpbW9KaEcvS0FPaUpaeGk0WUtpTG13NmNjaGhQbC8wVlM0eW1jMDRMVEp6QWZ5aU9kUkVRdndLODh6T1hrR2k4N3FsQ0ljOFhLZU5HTFVoU3JhS3lnL3BSSUliR3VyMlJFSitOaG5MODJpS0NPZk00RHAvR1ZLc25ZRUJvUTVvZnBJRUw0MmVjdFBlWTFrRWNtSHFtb2ZGMktybkRsQml6THJBeGxubUp2NWFMSmsweUsxM2t6dU9LcDg3aTVhckNEZ1JXQTNvV3BHMlp3UmNjTW5MNzM4NEsycXJac0E0VlBJVGtrV1VTNW4wQ2NaeVJDQ2ZhM3ZmOVlURG5qVlh5T2w1cXJSYzBaeWdqa0M3M1gxaXV1a2JET0N2YUlNNHR3T055aEFjdDluWFFpY2xHWnNTSHR2aEp5UnBNcG5JOEx0Y0RjMW1LY1dHQSsyMDIrRXVhOTB6a2hTZW5tZjJyaG5MWC81ZlVOUFEzdzJOb2czeFlhVXpobXFMUEJCSmpHSWJoSU1xdUZIMDQ4Y0d5S2NNUCtsTk11dGxGN083SjgrSEo5bEFvOXJ5MmZNblR1VzlQbDhmSEFSNHRhc0VNdVpMYXRxV2RWcTlnUWRFT2syOVJiRGdGRGUydlE3MTBtRjRrL0lHVzJseXZxK2Z3b0JTRStSTGN0blh6aUEyZXAzaDNBcWNGSTFRODRpTGVybDh4R1JEcUF0VDAvNVp4TmV2bmhTQkJRd0pvNm9veTBSQTBKMHRtUjlWSitHb1l3SlovN294NXhRamJWWTB6Q0UwWElRZFYybm8zdEVnZldZd2pFbnlBTDk3OXdsVzN4R0s0dmc5TXpaK2Y3V2VaeG5jWHI1OGpNdmxvandnSnIyUlB3UW01RE5PTXFjWFI1dk9UcFhYZW1nNXd4UkRlZ204ZVlySWh6RkIyUXlXdFlXcmt1bGczR1FBWlg1Z0ViVTlqNVp4bEVBY1o4SVBucjQ3Q3h6SmlCNktzYUpvb0ZGV0I4Q1BpWkZTRE5hUVVUTVZXSDR5WnlKbnorQ1NYdzhZazFBajRHQlR2U28vNWhJb09FemtvZ3c1Tmp4eDU2aCs1Y2twTzVhRnE1QVdYeWlCNXIwR2hxRm11Y2tDU2xHRW5Ici9DeHplVTR3ZTBZcjYyZVhsM0RCQ2RaaUR4WmpQNFF6aFBNQnd1ZDRLeG9wUmhLUjB2RVpNaHN3MnZGSnRnbzAyanArR0RIaVN4REJFbHp6OVpSWUtCVXdoaUtDR0FRLzMzbGFkYWxZU3pHcklXaUR4MmNIMCtRQnlmYkRFUUVreTJnaUJDays0S2JNWTdiRUdSL0MrRTdFaXpJR2doVGVXblB6OWlySlpNRmx0TVNJSjBJODBqMERkUXY1K3B1Ym03ZVBxWnRrUXltekgxbnJWSldQZ3hDT0Ird0hkWHVUVkRwczJtSXpXbGIxSkVrK1NOaVE0UU9FRjVIU0lVRG93My82QVJUd2V1MzY1ZUxtNW1MNmN0M0VyNkh5VnZiTHg0OVBvODhKOG9WcjA5WEJTK3BGaWhEMTlmcDErbmgxQllMVDQ4VnJvNDlzMXU4M25wNXY4T1B6cTR2WFVSK3BjZjFoZXZQb1hidjY1ZkhydDE4eHZJZlBJRDF3RVVOc0pPN3Rway80bW5wRi9VZXYralJzc3duWHVLUHJEODgzMzFNQlhkMU1YNTR2QW5EWXhhc3I5Z1Y0N2Zzdlg3OSsvZmJ0cnk4dno5UG5EMSt5ZEpxd3JFYXpUN3U4clBxYkFjSW5EQmdvV0czL21kdlI1UFE0ZmZKdENlQ3EyYWVYS2ZSNTZDZ0tnQUdlemVzVThVYUFFYTNxWXN2STUzSjU1OWVQT1QvQ2J0eThmSUVMdHV5WER4ZVBXSkdyaXlmY2xIWWNpQVM0dVpacWtvVHdYVWVOQ3Z4aGVFZHRJS1d2MitaTHVWeXVsTFAvTEpWeWVjN1B6UWM4MjNDL0cyTGN2UGI3OXBRZnZVNUJQSnRlaXpJNGhkTk1NUUJkUXphLzVVcUV4SWhHTHRlalJ3RUNBa1R3ZnR2NUV5bnYvYWkxd2JpcGtzTmVQRTZmcDlpTWYyeHc3Y2l3RjRjUU1ZNHFPVW9rVXcvN0hYV2poSHFmQy80ZXQrRmc1VjFXVjZDb1hRTGRGRFJzdTVSM3hxek5Hc3ByRGlMTElibUVJQXo5U2hPV2dwLzE3MEZqNUZ3TGxQeXVBd081M1hVTUIyNmxhek53STVjOFVBUGNrM2RHaCswMldXbEFFZUZ0aWVvU25FK1l6WEp1MzVBaDgzaDVaRXVFM21OVmd4TWFnUUsyQytjUUlicENmbjhDL3I4azhuOWpHSkhKSnlJOCtFd1B1czJZdDQzV0x1SGQ2dEVrZGxlSnQwc2RJTmVzUm9vN0JCRE1Mb1NNQ3JFTWUxUmhwWlZmQ2NSbW44ZkJKN3o5ZThYdVpnZnJrOS96Zkk2Y1ZmQmZHMmFIYnpKVXJMNnhzVkd2bXlXNzgzQ2MyRGVVUEtjb3VXWXQ1ZHR0N3pyc1l0OVpEZlA5VUd6RFRzYzBRV2NjYlhTRVBiZTFBYnN2cERRM2JOVkxOcUhCSzFvaWg5Qm1SZi9KUVNQZUNya2tDQTkrMjk0SXFCNk8yS2s3UmNGNHNFdVg2bTUxSm56VlMrSFhPclpDR3dFdUFNWlFFbEJBK1BzR29Yb29vWW1YQnFaa2RHOERKd1N6elg0WGVndDBGM1NqS1c3RXFYNzc5d05Kd3ArY0MrLytvQWpGTXd3M2tBdnB1S3R2ZnV3cVJrM2N4eDQ5cC9XT1YvaGRUTUlEd2tsOU55MlpST1R4dWxvbmI3RkhCYnpQR0FQdVhhNnZkSUJkUFQ4d1hkTjZmckw5UThxSVAxTS9PSUEvS0VJMzFwaDFOTk5NQ3RPazdyQkh4ZlRNMzhFdXVSbURHaGFuc0cxWjV3VXNSWHJCbjFKRy9DMzF5aDRKZWhxNlV5Zm5kWWtNS1BRZGFGUmc3MGdEK0Q3UEdKVVNUdDV4aDhaMm9SSldVSVlRN29EWmhQUTBkTHNaOUNwZ1M5ZVNEQ2RGSFVUdkU0UGorVHpMc3pzQmMzdEQweUZNdnYyYmhKc0N3aGRPTVVadi9jWVlQUXE2WUlEUTd6Vk55TGpGdnVLOUtybGNKbG1GVERROWVFbGRNRE1ubFExOVF0NzdyR21JZXV1U0VpVkladFBFN3ZGdGhWNmhZbldTOEE4Sk43MjlTTjJ3Q1JuVEVCdE9RaDNTQlhGQzV3WnFjTXpnUFdadGVJZFY1enRFeHgwYU95N2pWVWpZOFBZbTljZ2t2UDJUUjhqeVJUY25NTlJ4M29kRmlNRUpWbmFYVHFmclByc1pLR2UzMGlHYTMrWmxPaHprTVhYRkpIekg2bTI5dy9GRjFDZm1OTnpvVkV5dlNMQkV2VlBCZmJRTENMdW1XeFFiakxyM2lpTDhSN2dSYjY5U0JyUFVtdHN3bE45ZFRrcEFGbUtpZ3hyY1AraGJBM2Vrb2NadVVUeXR1RzVBMmhaa3hIRENBN0Rsb2c3Yk5sRytOODE2L1c0OHJnSFYzV3BObmkvQ0syeEFyQWpieUk3R2lEQnRUN2hPb0JYVE14eEpLQkZxNEtlaVdJdWZnMy9XdW1sZlk5TnJndE5Cb2xPUlpkYnNsbW9zVDNBYmhaNFN2QkpLZVBBREVENHpDTi85S3gyVXc5anhPd0J0akh0d1BKbHVRNnh4OGhycEVBRjdPOVJMRCtDSjc1UVJhdDZsU1EzSFpxRE5NYkx4c0RZZTF6ZGtPYzNnck1aMTU3VWpySXNJeCtHTDcxdjRXUXhXdXZoSkVTSkdOeXpXYThFcnRmR2QySjdnSXBqVU5hVHgzZDBkTWo4dWYwN1U3R0Z3VHhhQ2NuekkzTGhEc1NFOG1ONmk3M2ZSaEFmLzlqdGZXeC82cmNONlNUNk1FOW1UQkFWdjNBVm10WGREdDF0ejFBMitENGFoVklKbkZoMkVaQWJkcDQ3OEJ3MTQ2THJ0RmgzUDBYbnozWCtjeHU3UU44UnoyMDZrMDlMZDhYaWR5WWQxenphb0l3NmRXRm9OMjdHWTBPNWoyKzRid0JIOFltTXpMRjBjL0VTRTlPN0NEVFRiN3BGd3BYS1hIcTVQeGhNQUthZWhiWnhoZUVtR2FvRnp6RXFOMitoL1E0THBnZjNaeE9uLzNoSDZueFlFaE0za2JIT0tMYWd1WVBudGJUdDhwWWZFV1h1ZTZ3VWExWFVDeFA2dTdPRmZLTUhoWDc5alBMYklWY2JyQ3FvUkx3bXR3OWtBSzg5dncxZlVDZFkyZVlNbnV1dEJIZHJuNUp4ZXNRQ2h6M1M3S3BBaVRmeW13S3V4Y3hKZDhzNktTOG8xTzA4Q0pxeHJYZGE1WlFrZU8rL3Q3Unl0SjBuWjdYaUUwRVhRSHEzU2E3ZmI3cE9RU2kyOEVxWW1EdUVPNjJKdG15SC9VZGRPa29oWUMyTzdZZmZ4VDhkK2wya0RDZTA0MVJ4SzlyYTdoejBDT2xKc05GcERzbDNqMUhQbzFqT1VxMmVDQWNac08wUitNN0dxNlhyVjNNTk1IWDdEWkFkWHJMYWxHN3FQVTgrUlI3aUg4cCtrSlZkSDJLd3kzRVhEOE8xUWRvZHBEWHRBamk4YTNnQmwxMTRzK3RNUXhINXk1VGRNUHEzUFI5Mmh0eFRXZGpCQ2c3bTJYUzFyZGpFNG16RHdLUTdCRG1lNDlQYWsyTktVa3pMY2RCVkFJUmwvZXhad1VpRFpmUjhnWFRScVYwem1FUVlCVS9mU2lEZ3JnSjBQclUwVlpUK3QzUk9FNzZNVGtyU0lOeWxnV0JXQ1Vqc2xBSVR2Q2NLVWFrMENEUVBxc2hRb2tXempKR0RxVXp3akxwdTBUeFNoZkt4WkNaRnhCbXJ5bGhDMUNZUHc4RTBSSGpJSTRTN3h6WWhNRllra2pHVVNuU3BtbGpBV0pEcFZ2REVqOGt3bzNHR3NsTG84d0xkaVJMNEozNG9SK1NaOEl6bVJuUXRkdllHRkRYTTU0OHRZZFA4U1VNalh6MVoraThIYVZBUzE2QjdHVmhqZ3FtY01VYVp3cFhCaXN6eWlUbWZlbnAvS0FFcWNuUzZ0dEwxd3ZKWDJVemtmVGExeVVwVCtKdmJlYWhwUjFrZWhqbFlSVVRzS0IvTzFpdHQ5M3NhZUxmWUR4YVdXRnZIbkVGWnVLa2FaaExaV2JDcEdtNFMydXF1RXFJbjI5Vnl0VXJTSkZtVmNyVkMwaVJwbFhLM01Sa3BteThUV2lnVFU2R0hVMTBxY2FZU2ZXNnc0WWp6QUZVaUxLb2x3cFJEakF5NDVZaEtBUzQyWURPQVNoNXU0UWNiWGtwNU5rWi9OaTZPbFRQMXhFajJ0OTR2R1lVaDVxY2FXSWYyOXZQbElrejlYazlaUzdSZlY5b05oV3FLc2tWU1dJTFczYURCWHljWVlYTVp3R2N5b0RaT2ZncjZXNERsL3lIUDYyTnBiY0V6VjBqUHpVRmZHUXA5TWFmZXo5RkJYTzlxaUdMVWsxMmxDTGNpTTBvOEhFOUQ3QlFSVmJaandNaTFFbitic3FscHlPeVZaR1hOTkhOcGtIaEdHMU9IY1ZxcmF1dkREZURQVSs3a3dhdDM1VHNCNU15NldEekd1enpEbWFOcjZvdm1nRGljell0UzB5YUxtSDZWUHc4UWhOVzA0OS93ZzFQdjdSQmsxN1g0WjNKUFFUamNoU0UzcnptdjlHVlVHaEl4SHFVRzhSV1IzYVJsN2s3UXlKTGh4c3JmVWVJNE9QNjJubzlvU2xsLy90RFNoVTBLSE94UG9zVEtZc0ZoM3NyTktkSjRPZDQ3Z1Q0eEFVSW9WdlFmK05ld2VyU1ljSnVOd2IrZlQwZVRlKzUwQStNWHUrOG5ScDUyOXd6bE11djhEZmhBNVNuSm5RUnNBQUFBQVNVVk9SSzVDWUlJPVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgYWNjZXB0X2ludl9pbWdfcG5nIGZyb20gJy4vaW1nL2FjY2VwdF9pbnZpdGF0aW9uLnBuZyc7XHJcbmNvbnN0IEFwcENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xyXG4gIH1cclxuICBjb25zdCB7IHRpdGxlLCBhY2NlcHRfaW52X2ltZyB9ID0gY29udGV4dDtcclxuICByZXR1cm4geyB0aXRsZSwgYWNjZXB0X2ludl9pbWcgfTtcclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IHRpdGxlLCBhY2NlcHRfaW52X2ltZyA9IGFjY2VwdF9pbnZfaW1nX3BuZyB9ID0gcHJvcHM7XHJcblxyXG4gIHJldHVybiA8QXBwQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17eyB0aXRsZSwgYWNjZXB0X2ludl9pbWcgfX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIb21lKCkge1xyXG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPSdob21lJz5Ib21lPC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCAnd2hhdHdnLWZldGNoJztcclxuaW1wb3J0IHsgaCwgcmVuZGVyIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgUm9vdFJvdXRlUHJvdmlkZXIsIFJvb3RSb3V0ZSB9IGZyb20gJy4uL3JvdXRlL3Jvb3Qtcm91dGVyJztcclxuaW1wb3J0IHsgUm91dGVQcm92aWRlciwgUm91dGUgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5pbXBvcnQgTmF2aWdhdGlvbiwgeyBOYXZJdGVtIH0gZnJvbSAnLi4vbmF2L05hdmlnYXRpb24nO1xyXG5pbXBvcnQgQXV0aGVudGljYXRpb24gZnJvbSAnLi4vYXV0aC9BdXRoZW50aWNhdGlvbic7XHJcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4uL2xheW91dC9EcmF3ZXJDb250ZW50JztcclxuaW1wb3J0IHsgQXV0aENvbnRlbnQgfSBmcm9tICcuLi9hdXRoL0F1dGhDb250ZW50JztcclxuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSAnLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBGb3JtUHJvdmlkZXIgfSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCc7XHJcbmltcG9ydCB7IE90aGVyQ29udGVudCB9IGZyb20gJy4vT3RoZXJDb250ZW50JztcclxuaW1wb3J0IHsgQXBwUHJvdmlkZXIgfSBmcm9tICcuLi9hcHAtY29udGV4dC9hcHAtY29udGV4dCc7XHJcbmltcG9ydCB7IEhvbWUgfSBmcm9tICcuL0hvbWUnO1xyXG5pbXBvcnQgYWNjZXB0X2ludl9pbWcgZnJvbSAnLi4vYXBwLWNvbnRleHQvaW1nL2FjY2VwdF9pbnZpdGF0aW9uLnBuZyc7XHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2hhbmdvdXRzJykpO1xyXG5jb25zdCBHcm91cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9ncm91cC9ncm91cCcpKTtcclxucmVuZGVyKFxyXG4gIDxBcHBQcm92aWRlciB0aXRsZT0nV2ViY29tJyBhY2NlcHRfaW52X2ltZz17YWNjZXB0X2ludl9pbWd9PlxyXG4gICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgPFJvb3RSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT0nLyc+XHJcbiAgICAgICAgPEZvcm1Qcm92aWRlcj5cclxuICAgICAgICAgIDxUaGVtZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIGluaXRTdGF0ZT17e1xyXG4gICAgICAgICAgICAgIHByaW1hcnk6IHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjNjIwMEVFJyxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBIZWx2ZXRpY2EsIFwiQXJpYWxcIicsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPE5hdmlnYXRpb25cclxuICAgICAgICAgICAgICBkcmF3ZXJDb250ZW50PXtcclxuICAgICAgICAgICAgICAgIDxEcmF3ZXJDb250ZW50XHJcbiAgICAgICAgICAgICAgICAgIGF1dGhDb250ZW50PXs8QXV0aENvbnRlbnQgLz59XHJcbiAgICAgICAgICAgICAgICAgIG90aGVyQ29udGVudD17PE90aGVyQ29udGVudCAvPn1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPE5hdkl0ZW0+V0VCIENPTTwvTmF2SXRlbT5cclxuICAgICAgICAgICAgPC9OYXZpZ2F0aW9uPlxyXG4gICAgICAgICAgICA8Um9vdFJvdXRlIHBhdGg9Jy9hdXRoJz5cclxuICAgICAgICAgICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9Jy9sb2dpbic+XHJcbiAgICAgICAgICAgICAgICA8QXV0aGVudGljYXRpb24gLz5cclxuICAgICAgICAgICAgICA8L1JvdXRlUHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDwvUm9vdFJvdXRlPlxyXG5cclxuICAgICAgICAgICAgPFJvb3RSb3V0ZSBwYXRoPScvJz5cclxuICAgICAgICAgICAgICA8SG9tZSAvPlxyXG4gICAgICAgICAgICA8L1Jvb3RSb3V0ZT5cclxuXHJcbiAgICAgICAgICAgIDxSb290Um91dGUgcGF0aD0nL2hhbmdvdXRzJz5cclxuICAgICAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICAgICAgICA8SGFuZ291dHMgLz5cclxuICAgICAgICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICAgICAgICA8L1Jvb3RSb3V0ZT5cclxuICAgICAgICAgICAgPFJvb3RSb3V0ZSBwYXRoPScvZ3JvdXAnPlxyXG4gICAgICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgICAgICAgIDxHcm91cCAvPlxyXG4gICAgICAgICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgICAgICAgIDwvUm9vdFJvdXRlPlxyXG4gICAgICAgICAgICB7Jyd9XHJcbiAgICAgICAgICA8L1RoZW1lUHJvdmlkZXI+XHJcbiAgICAgICAgPC9Gb3JtUHJvdmlkZXI+XHJcbiAgICAgIDwvUm9vdFJvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0F1dGhQcm92aWRlcj5cclxuICA8L0FwcFByb3ZpZGVyPixcclxuICBkb2N1bWVudC5ib2R5XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJmZXRjaCIsInQiLCJ1IiwiciIsImkiLCJvIiwiYyIsImYiLCJlIiwiYSIsInYiLCJtIiwiRSIsIngiLCJoIiwidyIsIl8iLCJnIiwibCIsIk4iLCJNIiwicyIsIlAiLCJqIiwiSCIsIlQiLCIkIiwicSIsIlJvb3RSb3V0ZUNvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwiUm9vdFJvdXRlIiwicHJvcHMiLCJjaGlsZHJlbiIsInBhdGgiLCJyb290Um91dGUiLCJzZXRSb290Um91dGUiLCJ1c2VSb290Um91dGVDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIlJvb3RSb3V0ZVByb3ZpZGVyIiwiaW5pdGlhbFJvdXRlIiwidXNlU3RhdGUiLCJ2YWx1ZSIsInVzZU1lbW8iLCJSb3V0ZUNvbnRleHQiLCJSb3V0ZSIsInJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiUm91dGVQcm92aWRlciIsInNldFJvdXRlIiwiVGhlbWVDb250ZXh0IiwidXNlVGhlbWVDb250ZXh0IiwiVGhlbWVQcm92aWRlciIsImluaXRTdGF0ZSIsInN0YXRlIiwic2V0U3RhdGUiLCJNZW51V2hpdGUiLCJvbkNsaWNrIiwiZGV2aWNlIiwiaWQiLCJoYW5kbGVPbkNsaWNrIiwiY29uc29sZSIsImxvZyIsIkFwcFNoZWxsIiwiQXBwQmFyIiwidGhlbWUiLCJwcmltYXJ5IiwibWluSGVpZ2h0IiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJ3aWR0aCIsImRpc3BsYXkiLCJ1c2VNZWRpYVF1ZXJ5Iiwic2V0V2lkdGgiLCJoZWlnaHQiLCJzZXRIZWlnaHQiLCJvcmllbnRhdGlvbiIsInNldE9yaWVudGF0aW9uIiwic2V0RGV2aWNlIiwiaGFuZGxlVmlld3BvcnRTaXplIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwiaGFuZGxlU2NyZWVuT3JpZW50YXRpb24iLCJzY3JlZW4iLCJ1c2VFZmZlY3QiLCJhZGRFdmVudExpc3RlbmVyIiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsImVycm9yIiwidXNlcm5hbWUiLCJsb2FkaW5nIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImlzTG9nZ2VkSW4iLCJpc1Bhc3N3b3JkQ2hhbmdlZCIsImF1dGhGZWVkYmFjayIsImF1dGhSZWR1Y2VyIiwiYWN0aW9uIiwidHlwZSIsImFjdGlvblR5cGVzIiwibmV4dFN0YXRlIiwicGF5bG9hZCIsInByb3BOYW1lIiwic3VjY2Vzc01lc3NhZ2UiLCJtZXNzYWdlIiwidXNlciIsIkF1dGhSb3V0ZUNvbnRleHQiLCJBdXRoUm91dGUiLCJhdXRoUm91dGUiLCJ1c2VBdXRoUm91dGVDb250ZXh0IiwiQXV0aFJvdXRlUHJvdmlkZXIiLCJzZXRBdXRoUm91dGUiLCJBdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwiZGlzcGF0Y2giLCJBdXRoUHJvdmlkZXIiLCJ1c2VSZWR1Y2VyIiwidXNlVXNlck5hbWUiLCJ1c2VyTmFtZSIsInNldFVzZXJuYW1lIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJWQUxJRCIsIklOVkFMSUQiLCJJTkFDVElWRSIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiSU5WQUxJRF9QQVNTV09SRCIsIklOVkFMSURfRU1BSUwiLCJJTlZBTElEX1VTRVJOQU1FIiwiSU5WQUxJRF9FTVBUWV9TVFJJTkciLCJJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMIiwiUEFTU1dPUkRTX0RPX05PVF9NQVRDSCIsInBhc3N3b3JkUmVnZXgiLCJlbWFpbFJlZ2V4IiwidXNlcm5hbWVSZWdleCIsInZhbGlkYXRlRW1haWxDb25zdHJhaW50IiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblR5cGVzIiwidmFsaWRhdGlvblN0YXRlIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwiaXNDbGllbnRWYWxpZGF0aW9uVHlwZSIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSIsInZhbGlkYXRlRW1wdHlTdHJpbmciLCJsZW5ndGgiLCJ2YWxpZGF0ZVBhc3N3b3JkTWF0Y2giLCJhdXRoIiwiSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUiLCJSRVNFVF9WQUxJREFUSU9OX1NUQVRFIiwiSU5QVVRfQkxVUlJFRCIsIklOUFVUX0ZPQ1VTRUQiLCJTRVJWRVJfVkFMSURBVElPTiIsIkNMSUVOVF9WQUxJREFUSU9OIiwiSU5DX0lOUFVUX0NPVVROIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwidmFsaWRhdGlvbiIsImNvbnN0VmFsVHlwZXMiLCJ2YWxpZGF0aW9ucyIsInJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUiLCJzZXJ2ZXJWYWxpZGF0aW9uIiwiaHR0cFN0YXR1cyIsInZhbGlkYXRpb25TdGF0ZXMiLCJ2YWx1ZUNoYW5nZWQiLCJsb2dpbiIsImZvcm1EaXNwYXRjaCIsInJlc3BvbnNlIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwibWV0aG9kIiwicmVzdWx0IiwianNvbiIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJlcnJvcnMiLCJmb3JFYWNoIiwic2lnbnVwIiwiYm9keSIsIkNvbnRlbnRUeXBlIiwiQWNjZXB0IiwibG9nb3V0IiwicmVtb3ZlSXRlbSIsImNoYW5nZVBhc3N3b3JkIiwiYXBpX3VybCIsImZvcmdvdFBhc3N3b3JkIiwiZ2V0VG9rZW5Gcm9tVXJsIiwicmVjb3ZlckxvY2FsQXV0aFN0YXRlIiwiUGhvbmVEcmF3ZXIiLCJsYXp5IiwiVGFibGV0RHJhd2VyIiwiTGFwdG9wRHJhd2VyIiwiRGVza3RvcERyYXdlciIsIk5hdmlnYXRpb24iLCJvcGVuIiwic2V0T3BlbiIsImRyYXdlckNvbnRlbnQiLCJ0b2dnbGVEcmF3ZXIiLCJ0byIsInByZXYiLCJTdXNwZW5zZSIsIk5hdkl0ZW0iLCJMb2dpbiIsIkNoYW5nZVBhc3N3b3JkIiwiRm9yZ290UGFzc3dvcmQiLCJTaWdudXAiLCJQcm9maWxlIiwiQXV0aEZlZWRiYWNrIiwiQXV0aGVudGljYXRpb24iLCJEcmF3ZXJDb250ZW50IiwiYXV0aENvbnRlbnQiLCJvdGhlckNvbnRlbnQiLCJMaXN0IiwiYm94U2l6aW5nIiwiYmFja2dyb3VuZENvbG9yIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJMaXN0SXRlbSIsInN0eWxlIiwiZ3JpZCIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJqdXN0aWZ5SXRlbXMiLCJBdXRoQ29udGVudCIsImhhbmRsZVJvdXRlIiwicHJldmVudERlZmF1bHQiLCJ0YXJnZXQiLCJBdXRoZWRTdGF0ZSIsImhhbmRsZUxvZ091dCIsImFsaWduSXRlbXMiLCJmbGV4RGlyZWN0aW9uIiwidXNlckljb24iLCJtYXJnaW5Cb3R0b20iLCJVbkF1dGhlZFN0YXRlIiwiZm9ybVJlZHVjZXIiLCJmb3JtU3RhdGUiLCJjb3VudCIsIkZvcm1Db250ZXh0IiwidXNlRm9ybUNvbnRleHQiLCJGb3JtUHJvdmlkZXIiLCJPdGhlckNvbnRlbnQiLCJpbWciLCJBcHBDb250ZXh0IiwiQXBwUHJvdmlkZXIiLCJ0aXRsZSIsImFjY2VwdF9pbnZfaW1nIiwiYWNjZXB0X2ludl9pbWdfcG5nIiwiSG9tZSIsIkhhbmdvdXRzIiwiR3JvdXAiLCJyZW5kZXIiLCJiYWNrZ3JvdW5kIiwiY29sb3IiLCJmb250RmFtaWx5IiwiZG9jdW1lbnQiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlC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R0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDeEQsS0FBSztBQUNMLEdBQUc7QUFDSCxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxXQUFXO0FBQ3BDLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRTtBQUNoQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDcEIsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsV0FBVztBQUN0QyxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDaEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQy9CLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDckIsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUN2QyxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDaEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNyQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUM7QUFDN0IsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ3RCLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFPO0FBQ2hFLENBQUM7QUFDRDtBQUNBLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUN4QixFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNyQixJQUFJLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN4RCxHQUFHO0FBQ0gsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUk7QUFDdEIsQ0FBQztBQUNEO0FBQ0EsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQ2pDLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0MsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVc7QUFDL0IsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQztBQUM1QixNQUFLO0FBQ0wsSUFBSSxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVc7QUFDaEMsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBQztBQUMxQixNQUFLO0FBQ0wsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0EsU0FBUyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUU7QUFDckMsRUFBRSxJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsR0FBRTtBQUMvQixFQUFFLElBQUksT0FBTyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUM7QUFDdkMsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFDO0FBQ2hDLEVBQUUsT0FBTyxPQUFPO0FBQ2hCLENBQUM7QUFDRDtBQUNBLFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRTtBQUM5QixFQUFFLElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxHQUFFO0FBQy9CLEVBQUUsSUFBSSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBQztBQUN2QyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDO0FBQ3pCLEVBQUUsT0FBTyxPQUFPO0FBQ2hCLENBQUM7QUFDRDtBQUNBLFNBQVMscUJBQXFCLENBQUMsR0FBRyxFQUFFO0FBQ3BDLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFDO0FBQ2hDLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQztBQUNwQztBQUNBLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDM0MsR0FBRztBQUNILEVBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBQ0Q7QUFDQSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDMUIsRUFBRSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7QUFDakIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEdBQUcsTUFBTTtBQUNULElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBQztBQUM3QyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUM7QUFDakMsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNO0FBQ3RCLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLElBQUksR0FBRztBQUNoQixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBSztBQUN2QjtBQUNBLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLElBQUksRUFBRTtBQUNsQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSTtBQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDZixNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRTtBQUN6QixLQUFLLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDekMsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUk7QUFDM0IsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNuRSxNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSTtBQUMzQixLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzNFLE1BQU0sSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFJO0FBQy9CLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdEYsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUU7QUFDdEMsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN4RSxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQztBQUN0RDtBQUNBLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDO0FBQ3hELEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUM5RyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFDO0FBQy9DLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQztBQUNsRSxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUMzQyxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ3BDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLDBCQUEwQixFQUFDO0FBQ3BFLE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7QUFDeEQsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUM7QUFDN0QsT0FBTyxNQUFNLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxlQUFlLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN4RixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxpREFBaUQsRUFBQztBQUMzRixPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXO0FBQzNCLE1BQU0sSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBQztBQUNuQyxNQUFNLElBQUksUUFBUSxFQUFFO0FBQ3BCLFFBQVEsT0FBTyxRQUFRO0FBQ3ZCLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQzFCLFFBQVEsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDOUMsT0FBTyxNQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO0FBQ3hDLFFBQVEsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUNqRSxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3JDLFFBQVEsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQztBQUMvRCxPQUFPLE1BQU07QUFDYixRQUFRLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQzFELE9BQU87QUFDUCxNQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVztBQUNsQyxNQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO0FBQ2pDLFFBQVEsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxNQUFNO0FBQ2IsUUFBUSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUM7QUFDdEQsT0FBTztBQUNQLE1BQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVztBQUN6QixJQUFJLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUM7QUFDakMsSUFBSSxJQUFJLFFBQVEsRUFBRTtBQUNsQixNQUFNLE9BQU8sUUFBUTtBQUNyQixLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN4QixNQUFNLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDM0MsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO0FBQ3RDLE1BQU0sT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFFLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDbkMsTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDO0FBQzdELEtBQUssTUFBTTtBQUNYLE1BQU0sT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDNUMsS0FBSztBQUNMLElBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXO0FBQy9CLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNyQyxNQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVc7QUFDekIsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN2QyxJQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sSUFBSTtBQUNiLENBQUM7QUFDRDtBQUNBO0FBQ0EsSUFBSSxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztBQUNqRTtBQUNBLFNBQVMsZUFBZSxDQUFDLE1BQU0sRUFBRTtBQUNqQyxFQUFFLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUU7QUFDcEMsRUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLE1BQU07QUFDekQsQ0FBQztBQUNEO0FBQ08sU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUN4QyxFQUFFLE9BQU8sR0FBRyxPQUFPLElBQUksR0FBRTtBQUN6QixFQUFFLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFJO0FBQ3pCO0FBQ0EsRUFBRSxJQUFJLEtBQUssWUFBWSxPQUFPLEVBQUU7QUFDaEMsSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDeEIsTUFBTSxNQUFNLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUN6QyxLQUFLO0FBQ0wsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFHO0FBQ3hCLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsWUFBVztBQUN4QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQzFCLE1BQU0sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFDO0FBQy9DLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU07QUFDOUIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFJO0FBQzFCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTTtBQUM5QixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7QUFDMUMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVM7QUFDNUIsTUFBTSxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUk7QUFDM0IsS0FBSztBQUNMLEdBQUcsTUFBTTtBQUNULElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksY0FBYTtBQUM3RSxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUM7QUFDL0MsR0FBRztBQUNILEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBQztBQUN2RSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUk7QUFDL0MsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU07QUFDN0MsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUk7QUFDdEI7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDakUsSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLDJDQUEyQyxDQUFDO0FBQ3BFLEdBQUc7QUFDSCxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFDO0FBQ3RCLENBQUM7QUFDRDtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVc7QUFDckMsRUFBRSxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEQsRUFBQztBQUNEO0FBQ0EsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3RCLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLEdBQUU7QUFDM0IsRUFBRSxJQUFJO0FBQ04sS0FBSyxJQUFJLEVBQUU7QUFDWCxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDZixLQUFLLE9BQU8sQ0FBQyxTQUFTLEtBQUssRUFBRTtBQUM3QixNQUFNLElBQUksS0FBSyxFQUFFO0FBQ2pCLFFBQVEsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUM7QUFDcEMsUUFBUSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7QUFDcEQsUUFBUSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO0FBQ3ZELFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsRUFBQztBQUN4RSxPQUFPO0FBQ1AsS0FBSyxFQUFDO0FBQ04sRUFBRSxPQUFPLElBQUk7QUFDYixDQUFDO0FBQ0Q7QUFDQSxTQUFTLFlBQVksQ0FBQyxVQUFVLEVBQUU7QUFDbEMsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sR0FBRTtBQUM3QjtBQUNBO0FBQ0EsRUFBRSxJQUFJLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBQztBQUNuRSxFQUFFLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLEVBQUU7QUFDNUQsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQztBQUMvQixJQUFJLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEdBQUU7QUFDbEMsSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUNiLE1BQU0sSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUU7QUFDeEMsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUM7QUFDaEMsS0FBSztBQUNMLEdBQUcsRUFBQztBQUNKLEVBQUUsT0FBTyxPQUFPO0FBQ2hCLENBQUM7QUFDRDtBQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBQztBQUM1QjtBQUNPLFNBQVMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDNUMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLElBQUksT0FBTyxHQUFHLEdBQUU7QUFDaEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVM7QUFDdkIsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTTtBQUNuRSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFHO0FBQ25ELEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSTtBQUN2RSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQztBQUM3QyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFFO0FBQzlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUM7QUFDMUIsQ0FBQztBQUNEO0FBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFDO0FBQzdCO0FBQ0EsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsV0FBVztBQUN0QyxFQUFFLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN0QyxJQUFJLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtBQUN2QixJQUFJLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUMvQixJQUFJLE9BQU8sRUFBRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ3RDLElBQUksR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO0FBQ2pCLEdBQUcsQ0FBQztBQUNKLEVBQUM7QUFDRDtBQUNBLFFBQVEsQ0FBQyxLQUFLLEdBQUcsV0FBVztBQUM1QixFQUFFLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFDO0FBQ2hFLEVBQUUsUUFBUSxDQUFDLElBQUksR0FBRyxRQUFPO0FBQ3pCLEVBQUUsT0FBTyxRQUFRO0FBQ2pCLEVBQUM7QUFDRDtBQUNBLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDO0FBQ2hEO0FBQ0EsUUFBUSxDQUFDLFFBQVEsR0FBRyxTQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDMUMsRUFBRSxJQUFJLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMvQyxJQUFJLE1BQU0sSUFBSSxVQUFVLENBQUMscUJBQXFCLENBQUM7QUFDL0MsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkUsRUFBQztBQUNEO0FBQ08sSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQVk7QUFDM0MsSUFBSTtBQUNKLEVBQUUsSUFBSSxZQUFZLEdBQUU7QUFDcEIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQ2QsRUFBRSxZQUFZLEdBQUcsU0FBUyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQ3pDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFPO0FBQzFCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxLQUFJO0FBQ3BCLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBQztBQUM5QixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQUs7QUFDNUIsSUFBRztBQUNILEVBQUUsWUFBWSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUM7QUFDekQsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxhQUFZO0FBQ25ELENBQUM7QUFDRDtBQUNPLFNBQVNBLE9BQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ25DLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0MsSUFBSSxJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFDO0FBQzFDO0FBQ0EsSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDbEQsTUFBTSxPQUFPLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDOUQsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLGNBQWMsR0FBRTtBQUNsQztBQUNBLElBQUksU0FBUyxRQUFRLEdBQUc7QUFDeEIsTUFBTSxHQUFHLENBQUMsS0FBSyxHQUFFO0FBQ2pCLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxXQUFXO0FBQzVCLE1BQU0sSUFBSSxPQUFPLEdBQUc7QUFDcEIsUUFBUSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07QUFDMUIsUUFBUSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVU7QUFDbEMsUUFBUSxPQUFPLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNoRSxRQUFPO0FBQ1AsTUFBTSxPQUFPLENBQUMsR0FBRyxHQUFHLGFBQWEsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUM7QUFDakcsTUFBTSxJQUFJLElBQUksR0FBRyxVQUFVLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQVk7QUFDcEUsTUFBTSxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUFDO0FBQzFDLE1BQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLE9BQU8sR0FBRyxXQUFXO0FBQzdCLE1BQU0sTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDLEVBQUM7QUFDckQsTUFBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsU0FBUyxHQUFHLFdBQVc7QUFDL0IsTUFBTSxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsRUFBQztBQUNyRCxNQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUM3QixNQUFNLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEVBQUM7QUFDdkQsTUFBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUM7QUFDL0M7QUFDQSxJQUFJLElBQUksT0FBTyxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7QUFDM0MsTUFBTSxHQUFHLENBQUMsZUFBZSxHQUFHLEtBQUk7QUFDaEMsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLFdBQVcsS0FBSyxNQUFNLEVBQUU7QUFDL0MsTUFBTSxHQUFHLENBQUMsZUFBZSxHQUFHLE1BQUs7QUFDakMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLGNBQWMsSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtBQUMvQyxNQUFNLEdBQUcsQ0FBQyxZQUFZLEdBQUcsT0FBTTtBQUMvQixLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNsRCxNQUFNLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFDO0FBQ3ZDLEtBQUssRUFBQztBQUNOO0FBQ0EsSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDeEIsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUM7QUFDeEQ7QUFDQSxNQUFNLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxXQUFXO0FBQzFDO0FBQ0EsUUFBUSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFO0FBQ2xDLFVBQVUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFDO0FBQy9ELFNBQVM7QUFDVCxRQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sT0FBTyxDQUFDLFNBQVMsS0FBSyxXQUFXLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUM7QUFDakYsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0FBLE9BQUssQ0FBQyxRQUFRLEdBQUcsS0FBSTtBQUNyQjtBQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2pCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBR0EsUUFBSztBQUNwQixFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBTztBQUN4QixFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBTztBQUN4QixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUTtBQUMxQjs7QUNuZ0JHLElBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsb0VBQW9FLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXNPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQ0E1b1MsSUFBSUMsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNSLEdBQUMsQ0FBQyxDQUFDLENBQUNFLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1AsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRVksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNYLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUEwUCxTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDSixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBc0QsU0FBU0UsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDYixHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQTROLFNBQVNjLEdBQUMsRUFBRSxDQUFDWCxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNZLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNaLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRSxDQUFDLFNBQVNKLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ04sR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2UsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1YsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRixHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFYSxHQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVCxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDUSxHQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDOztBQ0F6dkQsU0FBU0YsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVNGLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlELEdBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT0MsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUVBLEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNLLENBQUMsQ0FBQyxDQUE4UyxJQUFJRixHQUFDLENBQUNOLENBQUMsQ0FBQyxHQUFHLENBQUNBLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDTSxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFtUyxJQUFpUkcsR0FBQyxDQUFDVCxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0ssR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTSyxHQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU9DLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTQyxHQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQ1osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQ1MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsU0FBUyxDQUFDLElBQUlGLENBQUMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUNFLEdBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUosQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ1IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDUSxHQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDQSxHQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSUMsR0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQW9lLElBQUlDLEdBQUMsQ0FBQyxrT0FBa08sQ0FBQ04sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsSUFBSU8sR0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUE2TSxJQUFJLENBQUMsQ0FBQ2YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTZ0IsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDaEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSWlCLEdBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDakIsQ0FBQyxDQUFDLEtBQUssQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNlLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUdFLEdBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLEdBQUdiLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUks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
