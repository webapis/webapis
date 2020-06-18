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
    type: actionTypes$1.HANGOUTS_UPDATED,
    hangouts: updatedHangouts
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
  const {
    username,
    message
  } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));

  if (hangouts) {
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
    saveUnreadHangout({
      name,
      hangout,
      dispatch
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
    updatedunreads = [unreadhangouts, hangout];
  } else {
    updatedunreads = [hangout];
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

  l(() => {
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
  const [state, dispatch] = p(authReducer, initState$1);
  const value = h$1(() => [state, dispatch], [state]);
  return h(AuthContext.Provider, _extends({
    value: value
  }, props), h(AuthRouteProvider, null, children));
}

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
  const [state, dispatch] = p(reducer$1, initState);
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
  l(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
  l(() => {
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
    }
  }, [hangout, username]);
  const value = h$1(() => [state, dispatch], [state]);
  return h(HangoutContext.Provider, _extends({
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

const NavContext = M();

function useNavContext() {
  const context = w$1(NavContext);

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
  const [drawerOpen, setDrawerOpen] = m$1(false);
  const value = h$1(() => [drawerOpen, setDrawerOpen], [drawerOpen]);
  return h(NavContext.Provider, _extends({
    value: value
  }, props));
}

function w$2(n,t){for(var e in t)n[e]=t[e];return n}function x$2(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var E$2=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return x$2(this.props,n)||x$2(this.state,t)},r}(m);var _$2=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),_$2&&_$2(n);};var N$1=n.__e;function U(n){return n&&((n=w$2({},n)).__c=null,n.__k=n.__k&&n.__k.map(U)),n}function M$1(){this.__u=0,this.o=null,this.__b=null;}function L(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function O(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function P$1(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);N$1(n,t,e);},(M$1.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=L(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},M$1.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=U(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var W=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(P$1.prototype=new m).u=function(n){var t=this,e=L(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),W(t,n,r)):o();};e?e(u):u();}},P$1.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},P$1.prototype.componentDidUpdate=P$1.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){W(n,e,t);});};var j$1=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var H$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var T$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var I=n.event;function $$1(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){I&&(n=I(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var q$1={configurable:!0,get:function(){return this.class}},B=n.vnode;n.vnode=function(n){n.$$typeof=T$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&(q$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",q$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=H$1.test(u))break;if(r)for(u in o=n.props={},e)o[H$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&($$1(t.prototype,"componentWillMount"),$$1(t.prototype,"componentWillReceiveProps"),$$1(t.prototype,"componentWillUpdate"),t.m=!0);}B&&B(n);};

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
  return h("div", {
    className: "nav-item"
  }, children);
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
    id: "hangouts"
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
    onClick: onClick,
    id: id
  }, h("path", {
    d: "M0 0h24v24H0V0z",
    fill: fill,
    id: id
  }), h("path", {
    id: id,
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
    updatedHangouts = hangouts.splice(hangoutIndex, 1, hangout);
  } else {
    updatedHangouts = [hangout];
  }

  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({
    type: actionTypes$1.HANGOUTS_UPDATED,
    hangouts: updatedHangouts
  });
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
  l(() => {
    if (socket && readyState === 1 && username) {
      sendOfflineHangouts({
        name: username,
        dispatch,
        socket
      });
    }
  }, [socket, readyState, username]);

  function onNavigation(e) {
    const id = e.target.id;
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
    readyState
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
    count: unreadhangouts.length
  }), ' '), hangout && h(NavItem, {
    id: "configure",
    "data-testid": "nav-config"
  }, h(Settings, {
    id: "configure",
    fill: "white",
    width: "30",
    height: "30",
    onClick: onNavigation
  })));
}

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
  l(() => {
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

const Login = O(() => import('./Login-8ae1ec23.js'));
const ChangePassword = O(() => import('./ChangePassword-33ded519.js'));
const ForgotPassword = O(() => import('./ForgotPassword-7ff88e68.js'));
const Signup = O(() => import('./Signup-dd5e47da.js'));
const Profile = O(() => import('./Profile-a0bc306d.js'));
const AuthFeedback = O(() => import('./AuthFeedback-dd50bbee.js'));
function Authentication({
  children
}) {
  return h("div", {
    style: {
      paddingTop: 68
    }
  }, h(FeatureRoute, {
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

const Hangouts = O(() => import('./index-ee19f872.js'));
const Group = O(() => import('./group-39c437ac.js'));
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
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Hangouts, null))), h(AppRoute, {
    path: "/group"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Group, null))));
}

var css_248z$2 = "*{\n    padding: 0;\n    margin: 0;\n}\n\n/* width */\n::-webkit-scrollbar {\n    width: 5px;\n  }\n  \n  /* Track */\n  ::-webkit-scrollbar-track {\n    background: #f1f1f1;\n  }\n  \n  /* Handle */\n  ::-webkit-scrollbar-thumb {\n    background: #888;\n  }\n  \n  /* Handle on hover */\n  ::-webkit-scrollbar-thumb:hover {\n    background: #555;\n  }";
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

export { FeatureRoute as F, List as L, M$1 as M, O, _extends as _, useAppRoute as a, useMediaQuery as b, useAuthContext as c, useFormContext as d, valueChanged as e, login as f, validationStates as g, h, isClientValidationType as i, clientValidation as j, useThemeContext as k, l, m$1 as m, useUserName as n, getTokenFromUrl as o, changePassword as p, forgotPassword as q, resetInputValidationState as r, styleInject as s, signup as t, useHangouts as u, validationTypes as v, ListItem as w, d$1 as x };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZGZkYmQxNDQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLXJvdXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3JlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvZGVsaXZlcmluZy1hY3Rpb25zL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9yZWNpZXZpbmctYWN0aW9ucy9zYXZlUmVjaWV2ZWRIYW5nb3V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0TWVzc2FnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlV2ViU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvTmF2UHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2NvbXBhdC9kaXN0L2NvbXBhdC5tb2R1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZJdGVtLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9OYXZMaXN0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvaWNvbnMvdXNlcjY0LnBuZyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25TdGF0ZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uTWVzc2FnZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS92YWxpZGF0aW9uUmVnZXguanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9jb25zdHJhaW50VmFsaWRhdG9ycy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vaHR0cC1zdGF0dXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYWN0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL0F1dGhEcmF3ZXJDb250ZW50LmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvdXNlVXNlck5hbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbmF2L0hhbmdvdXREcmF3ZXJDb250ZW50LmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9pY29ucy9NZXNzYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9pY29ucy9TZXR0xLFuZ3MuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L2ljb25zL29ubGluZVN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2VuZE9mZmxpbmVIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9uYXYvSGFuZ291dFRvcE1lbnUuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L3N0eWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC91c2VNZWRpYVF1ZXJ5LmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9EcmF3ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L0FwcEJhci5qcyIsIi4uLy4uLy4uL2NsaWVudC9uYXYvaWNvbnMvTWVudVdoaXRlLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9NZW51LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwTmF2aWdhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0hvbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9BdXRoZW50aWNhdGlvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm1SZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vZm9ybS1jb250ZXh0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwUm91dGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvQXBwUHJvdmlkZXJzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dlYmNvbS1hcHAvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHN1cHBvcnQgPSB7XG4gIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiZcbiAgICAnQmxvYicgaW4gc2VsZiAmJlxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxufVxuXG5mdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbn1cblxuaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gIF1cblxuICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPVxuICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB2aWV3Q2xhc3Nlcy5pbmRleE9mKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSA+IC0xXG4gICAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgfVxuICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5eX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1c1xuICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG59XG5cbkJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICB1cmw6IHRoaXMudXJsXG4gIH0pXG59XG5cblJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG59XG5cbmV4cG9ydCB2YXIgRE9NRXhjZXB0aW9uID0gc2VsZi5ET01FeGNlcHRpb25cbnRyeSB7XG4gIG5ldyBET01FeGNlcHRpb24oKVxufSBjYXRjaCAoZXJyKSB7XG4gIERPTUV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG5hbWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpXG4gICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrXG4gIH1cbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRE9NRXhjZXB0aW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaChpbnB1dCwgaW5pdCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcblxuICAgIGlmIChyZXF1ZXN0LnNpZ25hbCAmJiByZXF1ZXN0LnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgZnVuY3Rpb24gYWJvcnRYaHIoKSB7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgIH1cblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgfVxuICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgIH1cblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgIH1cblxuICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICB9KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsKSB7XG4gICAgICByZXF1ZXN0LnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgcmVxdWVzdC5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gIH0pXG59XG5cbmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxuXG5pZiAoIXNlbGYuZmV0Y2gpIHtcbiAgc2VsZi5mZXRjaCA9IGZldGNoXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2Vcbn1cbiIsInZhciBuLGwsdSxpLHQsbyxyLGYsZT17fSxjPVtdLGE9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmR8aXRlcmEvaTtmdW5jdGlvbiBzKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHYobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gaChuLGwsdSl7dmFyIGksdD1hcmd1bWVudHMsbz17fTtmb3IoaSBpbiBsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKG9baV09bFtpXSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKWZvcih1PVt1XSxpPTM7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl1LnB1c2godFtpXSk7aWYobnVsbCE9dSYmKG8uY2hpbGRyZW49dSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmbnVsbCE9bi5kZWZhdWx0UHJvcHMpZm9yKGkgaW4gbi5kZWZhdWx0UHJvcHMpdm9pZCAwPT09b1tpXSYmKG9baV09bi5kZWZhdWx0UHJvcHNbaV0pO3JldHVybiB5KG4sbyxsJiZsLmtleSxsJiZsLnJlZixudWxsKX1mdW5jdGlvbiB5KGwsdSxpLHQsbyl7dmFyIHI9e3R5cGU6bCxwcm9wczp1LGtleTppLHJlZjp0LF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om99O3JldHVybiBudWxsPT1vJiYoci5fX3Y9ciksbi52bm9kZSYmbi52bm9kZShyKSxyfWZ1bmN0aW9uIHAoKXtyZXR1cm57fX1mdW5jdGlvbiBkKG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIG0obixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gdyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/dyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT93KG4pOm51bGx9ZnVuY3Rpb24gayhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGsobil9fWZ1bmN0aW9uIGcobCl7KCFsLl9fZCYmKGwuX19kPSEwKSYmdS5wdXNoKGwpJiYhaSsrfHxvIT09bi5kZWJvdW5jZVJlbmRlcmluZykmJigobz1uLmRlYm91bmNlUmVuZGVyaW5nKXx8dCkoXyl9ZnVuY3Rpb24gXygpe2Zvcih2YXIgbjtpPXUubGVuZ3RoOyluPXUuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksdT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSxpLHQsbyxyLGY7bi5fX2QmJihyPShvPShsPW4pLl9fdikuX19lLChmPWwuX19QKSYmKHU9W10sKGk9cyh7fSxvKSkuX192PWksdD16KGYsbyxpLGwuX19uLHZvaWQgMCE9PWYub3duZXJTVkdFbGVtZW50LG51bGwsdSxudWxsPT1yP3cobyk6ciksVCh1LG8pLHQhPXImJmsobykpKX0pfWZ1bmN0aW9uIGIobixsLHUsaSx0LG8scixmLGEscyl7dmFyIGgscCxtLGssZyxfLGIseCxBLFA9aSYmaS5fX2t8fGMsQz1QLmxlbmd0aDtmb3IoYT09ZSYmKGE9bnVsbCE9cj9yWzBdOkM/dyhpLDApOm51bGwpLHUuX19rPVtdLGg9MDtoPGwubGVuZ3RoO2grKylpZihudWxsIT0oaz11Ll9fa1toXT1udWxsPT0oaz1sW2hdKXx8XCJib29sZWFuXCI9PXR5cGVvZiBrP251bGw6XCJzdHJpbmdcIj09dHlwZW9mIGt8fFwibnVtYmVyXCI9PXR5cGVvZiBrP3kobnVsbCxrLG51bGwsbnVsbCxrKTpBcnJheS5pc0FycmF5KGspP3koZCx7Y2hpbGRyZW46a30sbnVsbCxudWxsLG51bGwpOm51bGwhPWsuX19lfHxudWxsIT1rLl9fYz95KGsudHlwZSxrLnByb3BzLGsua2V5LG51bGwsay5fX3YpOmspKXtpZihrLl9fPXUsay5fX2I9dS5fX2IrMSxudWxsPT09KG09UFtoXSl8fG0mJmsua2V5PT1tLmtleSYmay50eXBlPT09bS50eXBlKVBbaF09dm9pZCAwO2Vsc2UgZm9yKHA9MDtwPEM7cCsrKXtpZigobT1QW3BdKSYmay5rZXk9PW0ua2V5JiZrLnR5cGU9PT1tLnR5cGUpe1BbcF09dm9pZCAwO2JyZWFrfW09bnVsbH1pZihnPXoobixrLG09bXx8ZSx0LG8scixmLGEscyksKHA9ay5yZWYpJiZtLnJlZiE9cCYmKHh8fCh4PVtdKSxtLnJlZiYmeC5wdXNoKG0ucmVmLG51bGwsaykseC5wdXNoKHAsay5fX2N8fGcsaykpLG51bGwhPWcpe2lmKG51bGw9PWImJihiPWcpLEE9dm9pZCAwLHZvaWQgMCE9PWsuX19kKUE9ay5fX2Qsay5fX2Q9dm9pZCAwO2Vsc2UgaWYocj09bXx8ZyE9YXx8bnVsbD09Zy5wYXJlbnROb2RlKXtuOmlmKG51bGw9PWF8fGEucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZChnKSxBPW51bGw7ZWxzZXtmb3IoXz1hLHA9MDsoXz1fLm5leHRTaWJsaW5nKSYmcDxDO3ArPTIpaWYoXz09ZylicmVhayBuO24uaW5zZXJ0QmVmb3JlKGcsYSksQT1hfVwib3B0aW9uXCI9PXUudHlwZSYmKG4udmFsdWU9XCJcIil9YT12b2lkIDAhPT1BP0E6Zy5uZXh0U2libGluZyxcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LnR5cGUmJih1Ll9fZD1hKX1lbHNlIGEmJm0uX19lPT1hJiZhLnBhcmVudE5vZGUhPW4mJihhPXcobSkpfWlmKHUuX19lPWIsbnVsbCE9ciYmXCJmdW5jdGlvblwiIT10eXBlb2YgdS50eXBlKWZvcihoPXIubGVuZ3RoO2gtLTspbnVsbCE9cltoXSYmdihyW2hdKTtmb3IoaD1DO2gtLTspbnVsbCE9UFtoXSYmRChQW2hdLFBbaF0pO2lmKHgpZm9yKGg9MDtoPHgubGVuZ3RoO2grKylqKHhbaF0seFsrK2hdLHhbKytoXSl9ZnVuY3Rpb24geChuKXtyZXR1cm4gbnVsbD09bnx8XCJib29sZWFuXCI9PXR5cGVvZiBuP1tdOkFycmF5LmlzQXJyYXkobik/Yy5jb25jYXQuYXBwbHkoW10sbi5tYXAoeCkpOltuXX1mdW5jdGlvbiBBKG4sbCx1LGksdCl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxDKG4sbyxudWxsLHVbb10saSk7Zm9yKG8gaW4gbCl0JiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8QyhuLG8sbFtvXSx1W29dLGkpfWZ1bmN0aW9uIFAobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1cIm51bWJlclwiPT10eXBlb2YgdSYmITE9PT1hLnRlc3QobCk/dStcInB4XCI6bnVsbD09dT9cIlwiOnV9ZnVuY3Rpb24gQyhuLGwsdSxpLHQpe3ZhciBvLHIsZixlLGM7aWYodD9cImNsYXNzTmFtZVwiPT09bCYmKGw9XCJjbGFzc1wiKTpcImNsYXNzXCI9PT1sJiYobD1cImNsYXNzTmFtZVwiKSxcInN0eWxlXCI9PT1sKWlmKG89bi5zdHlsZSxcInN0cmluZ1wiPT10eXBlb2YgdSlvLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpJiYoby5jc3NUZXh0PVwiXCIsaT1udWxsKSxpKWZvcihlIGluIGkpdSYmZSBpbiB1fHxQKG8sZSxcIlwiKTtpZih1KWZvcihjIGluIHUpaSYmdVtjXT09PWlbY118fFAobyxjLHVbY10pfWVsc2VcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXT8ocj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGY9bC50b0xvd2VyQ2FzZSgpLGw9KGYgaW4gbj9mOmwpLnNsaWNlKDIpLHU/KGl8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLE4sciksKG4ubHx8KG4ubD17fSkpW2xdPXUpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLE4scikpOlwibGlzdFwiIT09bCYmXCJ0YWdOYW1lXCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidHlwZVwiIT09bCYmXCJzaXplXCIhPT1sJiYhdCYmbCBpbiBuP25bbF09bnVsbD09dT9cIlwiOnU6XCJmdW5jdGlvblwiIT10eXBlb2YgdSYmXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmKGwhPT0obD1sLnJlcGxhY2UoL154bGluazo/LyxcIlwiKSk/bnVsbD09dXx8ITE9PT11P24ucmVtb3ZlQXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpKTpuLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLGwudG9Mb3dlckNhc2UoKSx1KTpudWxsPT11fHwhMT09PXUmJiEvXmFyLy50ZXN0KGwpP24ucmVtb3ZlQXR0cmlidXRlKGwpOm4uc2V0QXR0cmlidXRlKGwsdSkpfWZ1bmN0aW9uIE4obCl7dGhpcy5sW2wudHlwZV0obi5ldmVudD9uLmV2ZW50KGwpOmwpfWZ1bmN0aW9uIHoobCx1LGksdCxvLHIsZixlLGMpe3ZhciBhLHYsaCx5LHAsdyxrLGcsXyx4LEEsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsoYT1uLl9fYikmJmEodSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoZz11LnByb3BzLF89KGE9UC5jb250ZXh0VHlwZSkmJnRbYS5fX2NdLHg9YT9fP18ucHJvcHMudmFsdWU6YS5fXzp0LGkuX19jP2s9KHY9dS5fX2M9aS5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoZyx4KToodS5fX2M9dj1uZXcgbShnLHgpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1FKSxfJiZfLnN1Yih2KSx2LnByb3BzPWcsdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD14LHYuX19uPXQsaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9cyh7fSx2Ll9fcykpLHModi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoZyx2Ll9fcykpKSx5PXYucHJvcHMscD12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmZyE9PXkmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGcseCksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShnLHYuX19zLHgpfHx1Ll9fdj09PWkuX192KXtmb3Iodi5wcm9wcz1nLHYuc3RhdGU9di5fX3MsdS5fX3YhPT1pLl9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPWkuX19lLHUuX19rPWkuX19rLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGE9MDthPHUuX19rLmxlbmd0aDthKyspdS5fX2tbYV0mJih1Ll9fa1thXS5fXz11KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGcsdi5fX3MseCksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZSh5LHAsdyl9KX12LmNvbnRleHQ9eCx2LnByb3BzPWcsdi5zdGF0ZT12Ll9fcywoYT1uLl9fcikmJmEodSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1sLGE9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksbnVsbCE9di5nZXRDaGlsZENvbnRleHQmJih0PXMocyh7fSx0KSx2LmdldENoaWxkQ29udGV4dCgpKSksaHx8bnVsbD09di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KHc9di5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSh5LHApKSxBPW51bGwhPWEmJmEudHlwZT09ZCYmbnVsbD09YS5rZXk/YS5wcm9wcy5jaGlsZHJlbjphLGIobCxBcnJheS5pc0FycmF5KEEpP0E6W0FdLHUsaSx0LG8scixmLGUsYyksdi5iYXNlPXUuX19lLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpLGsmJih2Ll9fRT12Ll9fPW51bGwpLHYuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT1pLl9fdj8odS5fX2s9aS5fX2ssdS5fX2U9aS5fX2UpOnUuX19lPSQoaS5fX2UsdSxpLHQsbyxyLGYsYyk7KGE9bi5kaWZmZWQpJiZhKHUpfWNhdGNoKGwpe3UuX192PW51bGwsbi5fX2UobCx1LGkpfXJldHVybiB1Ll9fZX1mdW5jdGlvbiBUKGwsdSl7bi5fX2MmJm4uX19jKHUsbCksbC5zb21lKGZ1bmN0aW9uKHUpe3RyeXtsPXUuX19oLHUuX19oPVtdLGwuc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChsKXtuLl9fZShsLHUuX192KX19KX1mdW5jdGlvbiAkKG4sbCx1LGksdCxvLHIsZil7dmFyIGEscyx2LGgseSxwPXUucHJvcHMsZD1sLnByb3BzO2lmKHQ9XCJzdmdcIj09PWwudHlwZXx8dCxudWxsIT1vKWZvcihhPTA7YTxvLmxlbmd0aDthKyspaWYobnVsbCE9KHM9b1thXSkmJigobnVsbD09PWwudHlwZT8zPT09cy5ub2RlVHlwZTpzLmxvY2FsTmFtZT09PWwudHlwZSl8fG49PXMpKXtuPXMsb1thXT1udWxsO2JyZWFrfWlmKG51bGw9PW4pe2lmKG51bGw9PT1sLnR5cGUpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpO249dD9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGwudHlwZSk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChsLnR5cGUsZC5pcyYme2lzOmQuaXN9KSxvPW51bGwsZj0hMX1pZihudWxsPT09bC50eXBlKXAhPT1kJiZuLmRhdGEhPWQmJihuLmRhdGE9ZCk7ZWxzZXtpZihudWxsIT1vJiYobz1jLnNsaWNlLmNhbGwobi5jaGlsZE5vZGVzKSksdj0ocD11LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCxoPWQuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWYpe2lmKG51bGwhPW8pZm9yKHA9e30seT0wO3k8bi5hdHRyaWJ1dGVzLmxlbmd0aDt5KyspcFtuLmF0dHJpYnV0ZXNbeV0ubmFtZV09bi5hdHRyaWJ1dGVzW3ldLnZhbHVlOyhofHx2KSYmKGgmJnYmJmguX19odG1sPT12Ll9faHRtbHx8KG4uaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9QShuLGQscCx0LGYpLGg/bC5fX2s9W106KGE9bC5wcm9wcy5jaGlsZHJlbixiKG4sQXJyYXkuaXNBcnJheShhKT9hOlthXSxsLHUsaSxcImZvcmVpZ25PYmplY3RcIiE9PWwudHlwZSYmdCxvLHIsZSxmKSksZnx8KFwidmFsdWVcImluIGQmJnZvaWQgMCE9PShhPWQudmFsdWUpJiZhIT09bi52YWx1ZSYmQyhuLFwidmFsdWVcIixhLHAudmFsdWUsITEpLFwiY2hlY2tlZFwiaW4gZCYmdm9pZCAwIT09KGE9ZC5jaGVja2VkKSYmYSE9PW4uY2hlY2tlZCYmQyhuLFwiY2hlY2tlZFwiLGEscC5jaGVja2VkLCExKSl9cmV0dXJuIG59ZnVuY3Rpb24gaihsLHUsaSl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGw/bCh1KTpsLmN1cnJlbnQ9dX1jYXRjaChsKXtuLl9fZShsLGkpfX1mdW5jdGlvbiBEKGwsdSxpKXt2YXIgdCxvLHI7aWYobi51bm1vdW50JiZuLnVubW91bnQobCksKHQ9bC5yZWYpJiYodC5jdXJyZW50JiZ0LmN1cnJlbnQhPT1sLl9fZXx8aih0LG51bGwsdSkpLGl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGwudHlwZXx8KGk9bnVsbCE9KG89bC5fX2UpKSxsLl9fZT1sLl9fZD12b2lkIDAsbnVsbCE9KHQ9bC5fX2MpKXtpZih0LmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXt0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobCl7bi5fX2UobCx1KX10LmJhc2U9dC5fX1A9bnVsbH1pZih0PWwuX19rKWZvcihyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXSYmRCh0W3JdLHUsaSk7bnVsbCE9byYmdihvKX1mdW5jdGlvbiBFKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEgobCx1LGkpe3ZhciB0LG8sZjtuLl9fJiZuLl9fKGwsdSksbz0odD1pPT09cik/bnVsbDppJiZpLl9fa3x8dS5fX2ssbD1oKGQsbnVsbCxbbF0pLGY9W10seih1LCh0P3U6aXx8dSkuX19rPWwsb3x8ZSxlLHZvaWQgMCE9PXUub3duZXJTVkdFbGVtZW50LGkmJiF0P1tpXTpvP251bGw6dS5jaGlsZE5vZGVzLmxlbmd0aD9jLnNsaWNlLmNhbGwodS5jaGlsZE5vZGVzKTpudWxsLGYsaXx8ZSx0KSxUKGYsbCl9ZnVuY3Rpb24gSShuLGwpe0gobixsLHIpfWZ1bmN0aW9uIEwobixsKXt2YXIgdSxpO2ZvcihpIGluIGw9cyhzKHt9LG4ucHJvcHMpLGwpLGFyZ3VtZW50cy5sZW5ndGg+MiYmKGwuY2hpbGRyZW49Yy5zbGljZS5jYWxsKGFyZ3VtZW50cywyKSksdT17fSxsKVwia2V5XCIhPT1pJiZcInJlZlwiIT09aSYmKHVbaV09bFtpXSk7cmV0dXJuIHkobi50eXBlLHUsbC5rZXl8fG4ua2V5LGwucmVmfHxuLnJlZixudWxsKX1mdW5jdGlvbiBNKG4pe3ZhciBsPXt9LHU9e19fYzpcIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgaSx0PXRoaXM7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwoaT1bXSx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiBsW3UuX19jXT10LGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3QucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZpLnNvbWUoZnVuY3Rpb24obCl7bC5jb250ZXh0PW4udmFsdWUsZyhsKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXtpLnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7aS5zcGxpY2UoaS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuQ29uc3VtZXIuY29udGV4dFR5cGU9dSx1LlByb3ZpZGVyLl9fPXUsdX1uPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKHUuY29uc3RydWN0b3ImJm51bGwhPXUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaT0hMCx1LnNldFN0YXRlKHUuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKGk9ITAsdS5jb21wb25lbnREaWRDYXRjaChuKSksaSlyZXR1cm4gZyh1Ll9fRT11KX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LG0ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT10aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9cyh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHUsdGhpcy5wcm9wcykpLG4mJnModSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCksZyh0aGlzKSl9LG0ucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSxnKHRoaXMpKX0sbS5wcm90b3R5cGUucmVuZGVyPWQsdT1bXSxpPTAsdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxyPWUsZj0wO2V4cG9ydHtIIGFzIHJlbmRlcixJIGFzIGh5ZHJhdGUsaCBhcyBjcmVhdGVFbGVtZW50LGgsZCBhcyBGcmFnbWVudCxwIGFzIGNyZWF0ZVJlZixsIGFzIGlzVmFsaWRFbGVtZW50LG0gYXMgQ29tcG9uZW50LEwgYXMgY2xvbmVFbGVtZW50LE0gYXMgY3JlYXRlQ29udGV4dCx4IGFzIHRvQ2hpbGRBcnJheSxEIGFzIF91bm1vdW50LG4gYXMgb3B0aW9uc307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0e29wdGlvbnMgYXMgbn1mcm9tXCJwcmVhY3RcIjt2YXIgdCx1LHIsaT0wLG89W10sYz1uLl9fcixmPW4uZGlmZmVkLGU9bi5fX2MsYT1uLnVubW91bnQ7ZnVuY3Rpb24gdih0LHIpe24uX19oJiZuLl9faCh1LHQsaXx8ciksaT0wO3ZhciBvPXUuX19IfHwodS5fX0g9e19fOltdLF9faDpbXX0pO3JldHVybiB0Pj1vLl9fLmxlbmd0aCYmby5fXy5wdXNoKHt9KSxvLl9fW3RdfWZ1bmN0aW9uIG0obil7cmV0dXJuIGk9MSxwKEUsbil9ZnVuY3Rpb24gcChuLHIsaSl7dmFyIG89dih0KyssMik7cmV0dXJuIG8udD1uLG8uX19jfHwoby5fX2M9dSxvLl9fPVtpP2kocik6RSh2b2lkIDAsciksZnVuY3Rpb24obil7dmFyIHQ9by50KG8uX19bMF0sbik7by5fX1swXSE9PXQmJihvLl9fWzBdPXQsby5fX2Muc2V0U3RhdGUoe30pKX1dKSxvLl9ffWZ1bmN0aW9uIGwocixpKXt2YXIgbz12KHQrKywzKTshbi5fX3MmJngoby5fX0gsaSkmJihvLl9fPXIsby5fX0g9aSx1Ll9fSC5fX2gucHVzaChvKSl9ZnVuY3Rpb24geShyLGkpe3ZhciBvPXYodCsrLDQpOyFuLl9fcyYmeChvLl9fSCxpKSYmKG8uX189cixvLl9fSD1pLHUuX19oLnB1c2gobykpfWZ1bmN0aW9uIGQobil7cmV0dXJuIGk9NSxoKGZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bn19LFtdKX1mdW5jdGlvbiBzKG4sdCx1KXtpPTYseShmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih0KCkpOm4mJihuLmN1cnJlbnQ9dCgpKX0sbnVsbD09dT91OnUuY29uY2F0KG4pKX1mdW5jdGlvbiBoKG4sdSl7dmFyIHI9dih0KyssNyk7cmV0dXJuIHgoci5fX0gsdSk/KHIuX19IPXUsci5fX2g9bixyLl9fPW4oKSk6ci5fX31mdW5jdGlvbiBUKG4sdCl7cmV0dXJuIGk9OCxoKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIHcobil7dmFyIHI9dS5jb250ZXh0W24uX19jXSxpPXYodCsrLDkpO3JldHVybiBpLl9fYz1uLHI/KG51bGw9PWkuX18mJihpLl9fPSEwLHIuc3ViKHUpKSxyLnByb3BzLnZhbHVlKTpuLl9ffWZ1bmN0aW9uIEEodCx1KXtuLnVzZURlYnVnVmFsdWUmJm4udXNlRGVidWdWYWx1ZSh1P3UodCk6dCl9ZnVuY3Rpb24gRihuKXt2YXIgcj12KHQrKywxMCksaT1tKCk7cmV0dXJuIHIuX189bix1LmNvbXBvbmVudERpZENhdGNofHwodS5jb21wb25lbnREaWRDYXRjaD1mdW5jdGlvbihuKXtyLl9fJiZyLl9fKG4pLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIF8oKXtvLnNvbWUoZnVuY3Rpb24odCl7aWYodC5fX1ApdHJ5e3QuX19ILl9faC5mb3JFYWNoKGcpLHQuX19ILl9faC5mb3JFYWNoKHEpLHQuX19ILl9faD1bXX1jYXRjaCh1KXtyZXR1cm4gdC5fX0guX19oPVtdLG4uX19lKHUsdC5fX3YpLCEwfX0pLG89W119ZnVuY3Rpb24gZyhuKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnUmJm4udSgpfWZ1bmN0aW9uIHEobil7bi51PW4uX18oKX1mdW5jdGlvbiB4KG4sdCl7cmV0dXJuIW58fHQuc29tZShmdW5jdGlvbih0LHUpe3JldHVybiB0IT09blt1XX0pfWZ1bmN0aW9uIEUobix0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Qobik6dH1uLl9fcj1mdW5jdGlvbihuKXtjJiZjKG4pLHQ9MDt2YXIgcj0odT1uLl9fYykuX19IO3ImJihyLl9faC5mb3JFYWNoKGcpLHIuX19oLmZvckVhY2gocSksci5fX2g9W10pfSxuLmRpZmZlZD1mdW5jdGlvbih0KXtmJiZmKHQpO3ZhciB1PXQuX19jO3UmJnUuX19IJiZ1Ll9fSC5fX2gubGVuZ3RoJiYoMSE9PW8ucHVzaCh1KSYmcj09PW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKHI9bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHxmdW5jdGlvbihuKXt2YXIgdCx1PWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpLGNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHI9c2V0VGltZW91dCh1LDEwMCk7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHUpKX0pKF8pKX0sbi5fX2M9ZnVuY3Rpb24odCx1KXt1LnNvbWUoZnVuY3Rpb24odCl7dHJ5e3QuX19oLmZvckVhY2goZyksdC5fX2g9dC5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxxKG4pfSl9Y2F0Y2gocil7dS5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSksdT1bXSxuLl9fZShyLHQuX192KX19KSxlJiZlKHQsdSl9LG4udW5tb3VudD1mdW5jdGlvbih0KXthJiZhKHQpO3ZhciB1PXQuX19jO2lmKHUmJnUuX19IKXRyeXt1Ll9fSC5fXy5mb3JFYWNoKGcpfWNhdGNoKHQpe24uX19lKHQsdS5fX3YpfX07ZXhwb3J0e20gYXMgdXNlU3RhdGUscCBhcyB1c2VSZWR1Y2VyLGwgYXMgdXNlRWZmZWN0LHkgYXMgdXNlTGF5b3V0RWZmZWN0LGQgYXMgdXNlUmVmLHMgYXMgdXNlSW1wZXJhdGl2ZUhhbmRsZSxoIGFzIHVzZU1lbW8sVCBhcyB1c2VDYWxsYmFjayx3IGFzIHVzZUNvbnRleHQsQSBhcyB1c2VEZWJ1Z1ZhbHVlLEYgYXMgdXNlRXJyb3JCb3VuZGFyeX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJleHBvcnQgY29uc3QgYWN0aW9uVHlwZXMgPXtcbiAgICBBUFBfUk9VVEVfQ0hBTkdFRDonQVBQX1JPVVRFX0NIQU5HRUQnLFxuICAgIEZFQVRVUkVfUk9VVEVfQ0hBTkdFRDonRkVBVFVSRV9ST1VURV9DSEFOR0VEJ1xufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5BUFBfUk9VVEVfQ0hBTkdFRDpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByb3V0ZTogYWN0aW9uLnJvdXRlLGZlYXR1cmVSb3V0ZTogYWN0aW9uLmZlYXR1cmVSb3V0ZSB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8sdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHtyZWR1Y2VyfSBmcm9tICcuL3JlZHVjZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmNvbnN0IEFwcFJvdXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbiBmdW5jdGlvbiB1c2VBcHBSb3V0ZUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXBwUm91dGVDb250ZXh0KTtcclxuICBcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFJvdXRlUHJvdmlkZXInKTtcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHRcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZVJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCwgcGF0aHMgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdID0gdXNlQXBwUm91dGVDb250ZXh0KCk7XHJcbmNvbnN0IHtmZWF0dXJlUm91dGV9PXN0YXRlXHJcblxyXG4gIGlmIChwYXRoICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aCkge1xyXG5cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIGZlYXR1cmVSb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gZmVhdHVyZVJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwUm91dGUgKCl7XHJcbiAgY29uc3QgW3N0YXRlLGRpc3BhdGNoXT11c2VBcHBSb3V0ZUNvbnRleHQoKVxyXG5cclxuICBmdW5jdGlvbiBvbkFwcFJvdXRlKHtyb3V0ZSxmZWF0dXJlUm91dGV9KXtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtvbkFwcFJvdXRlfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBSb3V0ZUNvbnRleHQoKTtcclxuY29uc3Qge3JvdXRlfT1zdGF0ZVxyXG4gIGlmIChwYXRoICYmIHJvdXRlID09PSBwYXRoKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfSBlbHNlIGlmIChwYXRocyAmJiByb3V0ZSA9PT0gcGF0aHMuZmluZCgocCkgPT4gcCA9PT0gcm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBBcHBSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3Qge2luaXRTdGF0ZX09cHJvcHNcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZVJlZHVjZXIocmVkdWNlcixpbml0U3RhdGUpXHJcblxyXG5cclxuY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEFwcFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xuXG4gICAgTUVTU0FHRV9URVhUX0NIQU5HRUQ6J01FU1NBR0VfVEVYVF9DSEFOR0VEJyxcblxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcbiAgICBMT0FERURfTUVTU0FHRVM6ICdMT0FERURfTUVTU0FHRVMnLFxuIFxuICAgIFNFQVJDSEVEX0hBTkdPVVQ6ICdTRUFSQ0hFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXG5cbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXG4gICAgXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXG5cbiAgICBTT0NLRVRfTUVTU0FHRV9SRUNJRVZFRDonU09DS0VUX01FU1NBR0VfUkVDSUVWRUQnLFxuXG4gICAgXG4gICAgTUVTU0FHRVNfVVBEQVRFRDonTUVTU0FHRVNfVVBEQVRFRCcsXG4gICAgSEFOR09VVFNfVVBEQVRFRDonSEFOR09VVFNfVVBEQVRFRCcsXG4gICAgSEFOR09VVF9VUERBVEVEOidIQU5HT1VUX1VQREFURUQnLFxuICAgIFVOUkVBRF9IQU5HT1VUU19VUERBVEVEOidVTlJFQURfSEFOR09VVFNfVVBEQVRFRCcsXG4gICAgLy9TT0NLRVRcblxuICAgIENPTk5FQ1RJTkc6J0NPTk5FQ1RJTkcnLFxuICAgIE9QRU46J09QRU4nLFxuICAgIENMT1NJTkc6J0NMT1NJTkcnLFxuICAgIENMT1NFRDonQ0xPU0VEJyxcbiAgICBTT0NLRVRfUkVBRFk6J1NPQ0tFVF9SRUFEWScsXG4gICAgU09DS0VUX0VSUk9SOidTT0NLRVRfRVJST1InXG5cbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgaGFuZ291dHM6IG51bGwsXG4gIGhhbmdvdXQ6IG51bGwsXG4gIHVucmVhZGhhbmdvdXRzOiBudWxsLFxuICBtZXNzYWdlczogbnVsbCxcbiAgc2VhcmNoOiAnJyxcbiAgdXNlcjogW10sXG4gIGxvYWRpbmc6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgbWVzc2FnZVRleHQ6ICcnLFxuICBvbmxpbmU6IGZhbHNlLFxuICBzb2NrZXQ6IG51bGwsXG4gIHJlYWR5U3RhdGU6IDAsXG4gIHNvY2tldE1lc3NhZ2U6IG51bGwsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5VTlJFQURfSEFOR09VVFNfVVBEQVRFRDpcbiAgICAgIFxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHVucmVhZGhhbmdvdXRzOiBhY3Rpb24udW5yZWFkaGFuZ291dHMgfVxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9VUERBVEVEOlxuXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRVNfVVBEQVRFRDpcblxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldE1lc3NhZ2U6IGFjdGlvbi5zb2NrZXRNZXNzYWdlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXQ6IHN0YXRlLmhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGFjdGlvbi51c2VybmFtZSksXG4gICAgICB9O1xuICAgIC8vU09DS0VUXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfRVJST1I6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ09OTkVDVElORzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAwIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDEgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMT1NJTkc6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMiB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0VEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWTpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzb2NrZXQ6IGFjdGlvbi5zb2NrZXQgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IHsgcmVkdWNlclVucmVhZGhhbmdvdXRzIH0gZnJvbSAnLi9yZWR1Y2VVbnJlYWRoYW5nb3V0cyc7XG4vL3JldHJpZXZlcyBoYW5nb3V0cyBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XG59XG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VW5yZWFkKHtkaXNwYXRjaCx1c2VybmFtZX0pe1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcbn1cbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcbn1cblxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXG4gICAgKTtcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcbiAgXG4gIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS0ke2hhbmdvdXQudXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUywgbWVzc2FnZXMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VVbnJlYWQoeyB1bnJlYWRoYW5nb3V0cywgZGlzcGF0Y2ggfSkge1xuICAvLyBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLiwgdW5yZWFkaGFuZ291dHM6IHJlZHVjZXJVbnJlYWRoYW5nb3V0cyh7IHVucmVhZGhhbmdvdXRzIH0pIH0pO1xufVxuXG5cblxuXG5cbi8vRU5EIHNhdmVJbnZpdGVyXG5cblxuXG5cbiIsIlxuICBleHBvcnQgY29uc3QgaGFuZ291dFN0YXRlcyA9IHtcbiAgICBJTlZJVEVSOiAnSU5WSVRFUicsXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxuICAgIFVOQkxPQ0tFUjogJ1VOQkxPQ0tFUicsXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJyxcbiAgIC8vIGFja25vd2xlZ2VtZW50XG4gICAgSU5WSVRFRDogJ0lOVklURUQnLFxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnLFxuICB9OyIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi4vLi4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBuYW1lLCBkaXNwYXRjaCwgaGFuZ291dCwgb2ZmbGluZSwgb25BcHBSb3V0ZSB9KSB7XG4gIGNvbnN0IHsgdXNlcm5hbWUsIG1lc3NhZ2UsIHRpbWVzdGFtcCB9ID0gaGFuZ291dDtcblxuICBjb25zdCBkZWxpdmVyZWRIYW5nb3V0ID0geyAuLi5oYW5nb3V0LCBkZWxpdmVyZWQ6IHRydWUgfTtcbiAgY29uc3QgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGhhbmdvdXRLZXkpKTtcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG4gIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xuICB1cGRhdGVkSGFuZ291dHMgPSBoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxLCBkZWxpdmVyZWRIYW5nb3V0KTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXRzKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVFNfVVBEQVRFRCwgaGFuZ291dHM6IHVwZGF0ZWRIYW5nb3V0cyB9KTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX1VQREFURUQsIGhhbmdvdXQ6IGRlbGl2ZXJlZEhhbmdvdXQgfSk7XG4gIGlmIChtZXNzYWdlKSB7XG5cbiAgICB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQsaGFuZ291dCB9KTtcbiAgfVxuICBpZihoYW5nb3V0LnN0YXRlPT09J0JMT0NLRUQnKXtcbiAgICBkZWJ1Z2dlcjtcbiAgICB1cGRhdGVCb2NrZWRTdGF0ZSh7ZGlzcGF0Y2gsbmFtZSxkZWxpdmVyZWRIYW5nb3V0fSlcbiAgfVxuICBpZiAob2ZmbGluZSkge1xuICAgIC8vcmVtb3ZlIG9mZmxpbmUgaGFuZ291dFxuICAgIGNvbnN0IG9mZmxpbmVIYW5nb3V0S2V5ID0gYCR7bmFtZX0tb2ZmbGluZS1oYW5nb3V0c2A7XG4gICAgY29uc3Qgb2ZmbGluZWhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xuXG4gICAgaWYgKG9mZmxpbmVoYW5nb3V0cykge1xuICAgICAgY29uc3QgaGFuZ291dEluZGV4ID0gb2ZmbGluZWhhbmdvdXRzLmZpbmRJbmRleChcbiAgICAgICAgKG8pID0+IG8udGltZXN0YW1wID09PSB0aW1lc3RhbXBcbiAgICAgICk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgb2ZmbGluZUhhbmdvdXRLZXksXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVoYW5nb3V0cy5zcGxpY2UoaGFuZ291dEluZGV4LCAxKSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGhhbmdvdXQuc3RhdGUgIT09ICdNRVNTQU5HRVInKSB7XG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZWxpdmVyZWRNZXNzYWdlKHsgZGlzcGF0Y2gsIG5hbWUsIGRlbGl2ZXJlZEhhbmdvdXQgfSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBkZWxpdmVyZWRIYW5nb3V0O1xuXG4gIGNvbnN0IGRlbGl2ZXJlZE1lc3NhZ2UgPSB7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lOiBuYW1lLCBkZWxpdmVyZWQ6IHRydWUgfVxuXG4gIC8vIHNhdmUgbWVzc2FnZSB0byBsb2NhbFN0b3JhZ2VcbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcbiAgY29uc3QgaGFuZ291dEluZGV4ID0gbWVzc2FnZXMuZmluZEluZGV4KFxuICAgIChtKSA9PiBtLnRpbWVzdGFtcCA9PT0gbWVzc2FnZS50aW1lc3RhbXBcbiAgKTtcbiAgbWVzc2FnZXMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgZGVsaXZlcmVkTWVzc2FnZSk7XG4gIFxuXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlcyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJvY2tlZFN0YXRlKHtkaXNwYXRjaCxkZWxpdmVyZWRIYW5nb3V0LG5hbWV9KXtcbiAgZGVidWdnZXI7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGRlbGl2ZXJlZEhhbmdvdXQ7XG4gIGNvbnN0IGJsb2NrZWRNZXNzYWdlID0geyB0aW1lc3RhbXA6ZGVsaXZlcmVkSGFuZ291dC50aW1lc3RhbXAsIHRleHQ6ICd5b3UgYmxvY2tlZCB0aGlzIHVzZXInLCB1c2VybmFtZTogbmFtZSwgdHlwZTogJ2Jsb2NrZWQnIH1cbiAgY29uc3QgbWVzc2FnZUtleSA9IGAke25hbWV9LSR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcbiAgXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KCBbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdKSk7XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczpbLi4ubWVzc2FnZXMsYmxvY2tlZE1lc3NhZ2VdIH0pO1xufSIsImltcG9ydCB7IHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQgfSBmcm9tICcuL3VwZGF0ZURlbGl2ZXJlZEhhbmdvdXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1lc3NhZ2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XG5cbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUludml0ZWQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pIHtcblxuICB1cGRhdGVEZWxpdmVyZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIG5hbWUsIGhhbmdvdXQsIG9mZmxpbmUsb25BcHBSb3V0ZX0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY2NlcHRlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xuXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEZWNsaW5lZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xuXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VkKHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9mZmxpbmUsb25BcHBSb3V0ZSB9KSB7XG5kZWJ1Z2dlcjtcbiAgdXBkYXRlRGVsaXZlcmVkSGFuZ291dCh7IGRpc3BhdGNoLCBuYW1lLCBoYW5nb3V0LCBvZmZsaW5lLG9uQXBwUm91dGUgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZVVuYmxvdmtlZCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvZmZsaW5lLG9uQXBwUm91dGUgfSkge1xuXG4gIHVwZGF0ZURlbGl2ZXJlZEhhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb2ZmbGluZSxvbkFwcFJvdXRlIH0pO1xufVxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuLi8uLi9hY3Rpb25UeXBlcyc7XG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2lldmVkSGFuZ291dCh7XG4gIGRpc3BhdGNoLFxuICBoYW5nb3V0LFxuICBuYW1lLFxuICBmb2N1c2VkSGFuZ291dCxcbiAgb25BcHBSb3V0ZSxcbiAgdW5yZWFkLFxufSkge1xuICBjb25zdCB7IHVzZXJuYW1lLCBtZXNzYWdlIH0gPSBoYW5nb3V0O1xuIFxuICBjb25zdCBoYW5nb3V0S2V5ID0gYCR7bmFtZX0taGFuZ291dHNgO1xuXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShoYW5nb3V0S2V5KSk7XG5cbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG4gICAgaWYgKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PSB1c2VybmFtZSkge1xuICAgICAgaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwge1xuICAgICAgICAuLi5oYW5nb3V0LFxuICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgfSk7XG4gICAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmdvdXRzLnNwbGljZShoYW5nb3V0SW5kZXgsIDEsIHtcbiAgICAgICAgLi4uaGFuZ291dCxcbiAgICAgICAgcmVhZDogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaGFuZ291dEtleSwgSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMpKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzIH0pO1xuICB9IGVsc2Uge1xuICAgIGxldCB1cGRhdGVkSGFuZ291dHMgPSBudWxsO1xuICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIC4uLmhhbmdvdXQsXG4gICAgICAgICAgcmVhZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZWRIYW5nb3V0cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIC4uLmhhbmdvdXQsXG4gICAgICAgICAgcmVhZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShoYW5nb3V0S2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkSGFuZ291dHMpKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XG4gIH1cblxuICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCxcbiAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxuICAgIH0pO1xuICAgIGlmIChoYW5nb3V0LnN0YXRlICE9PSAnTUVTU0FOR0VSJykge1xuICAgICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2hhbmdvdXQuc3RhdGV9YCwgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xuICAgIH1cbiAgfVxuICBpZiAobWVzc2FnZSkge1xuICAgIHNhdmVSZWNpZXZlZE1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQgfSk7XG4gIH1cblxuICBpZiAodW5yZWFkKSB7XG4gICAgc2F2ZVVucmVhZEhhbmdvdXQoeyBuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2lldmVkTWVzc2FnZSh7XG4gIGRpc3BhdGNoLFxuICBoYW5nb3V0LFxuICBuYW1lLFxuICBmb2N1c2VkSGFuZ291dCxcbn0pIHtcbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSB9ID0gaGFuZ291dDtcblxuICAvLyBzYXZlIG1lc3NhZ2UgdG8gbG9jYWxTdG9yYWdlXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSBgJHtuYW1lfS0ke3VzZXJuYW1lfS1tZXNzYWdlc2A7XG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShtZXNzYWdlS2V5KSk7XG4gIGxldCB1cGRhdGVkTWVzc2FnZXMgPSBudWxsO1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICBpZiAoZm9jdXNlZEhhbmdvdXQgJiYgZm9jdXNlZEhhbmdvdXQudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIHsgLi4ubWVzc2FnZSwgdXNlcm5hbWUsIHJlYWQ6IHRydWUgfV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogZmFsc2UgfV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICAgIHVwZGF0ZWRNZXNzYWdlcyA9IFt7IC4uLm1lc3NhZ2UsIHVzZXJuYW1lLCByZWFkOiB0cnVlIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVkTWVzc2FnZXMgPSBbeyAuLi5tZXNzYWdlLCB1c2VybmFtZSwgcmVhZDogZmFsc2UgfV07XG4gICAgfVxuICB9XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1lc3NhZ2VLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNZXNzYWdlcykpO1xuXG4gIGlmIChmb2N1c2VkSGFuZ291dCAmJiBmb2N1c2VkSGFuZ291dC51c2VybmFtZSA9PT0gdXNlcm5hbWUpIHtcbiAgICAvLyBzeW5jIG1lc3NhZ2Ugd2l0aCByZWR1Y2VyIHN0YXRlXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhdmVVbnJlYWRIYW5nb3V0KHsgbmFtZSwgaGFuZ291dCxkaXNwYXRjaCB9KSB7XG4gIFxuICAvL3VwZGF0ZSB1bnJlYWQgaGFuZ291dHNcbiAgbGV0IHVucmVhZGhhbmdvdXRzS2V5ID0gYCR7bmFtZX0tdW5yZWFkLWhhbmdvdXRzYDtcbiAgbGV0IHVucmVhZGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh1bnJlYWRoYW5nb3V0c0tleSkpO1xuICBsZXQgdXBkYXRlZHVucmVhZHMgPSBudWxsO1xuICBpZiAodW5yZWFkaGFuZ291dHMpIHtcbiAgICB1cGRhdGVkdW5yZWFkcyA9IFt1bnJlYWRoYW5nb3V0cywgaGFuZ291dF07XG4gIH0gZWxzZSB7XG4gICAgdXBkYXRlZHVucmVhZHMgPSBbaGFuZ291dF07XG4gIH1cbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odW5yZWFkaGFuZ291dHNLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWR1bnJlYWRzKSk7XG5cbiAgZGlzcGF0Y2goe1xuICAgIHR5cGU6IGFjdGlvblR5cGVzLlVOUkVBRF9IQU5HT1VUU19VUERBVEVELFxuICAgIHVucmVhZGhhbmdvdXRzOiB1cGRhdGVkdW5yZWFkcyxcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBzYXZlUmVjaWV2ZWRIYW5nb3V0IH0gZnJvbSAnLi9zYXZlUmVjaWV2ZWRIYW5nb3V0JztcbmV4cG9ydCBmdW5jdGlvbiBzYXZlSW52aXRlcih7XG4gIGRpc3BhdGNoLFxuICBoYW5nb3V0LFxuICBuYW1lLFxuICBmb2N1c2VkSGFuZ291dCxcbiAgb25BcHBSb3V0ZSxcbiAgdW5yZWFkXG59KSB7XG5cblxuICBzYXZlUmVjaWV2ZWRIYW5nb3V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIG5hbWUsIG9uQXBwUm91dGUsIGZvY3VzZWRIYW5nb3V0LCAgdW5yZWFkIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjY2VwdGVyKHtcbiAgZGlzcGF0Y2gsXG4gIGhhbmdvdXQsXG4gIG5hbWUsXG4gIGZvY3VzZWRIYW5nb3V0LFxuICBvbkFwcFJvdXRlLFxuICB1bnJlYWRcbn0pIHtcbiBcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVCbG9ja2VyKHtcbiAgZGlzcGF0Y2gsXG4gIGhhbmdvdXQsXG4gIG5hbWUsXG4gIGZvY3VzZWRIYW5nb3V0LFxuICBvbkFwcFJvdXRlLFxuICB1bnJlYWRcbn0pIHtcbiAgXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGVjbGluZXIoe1xuICBkaXNwYXRjaCxcbiAgaGFuZ291dCxcbiAgbmFtZSxcbiAgZm9jdXNlZEhhbmdvdXQsXG4gIG9uQXBwUm91dGUsXG4gIHVucmVhZFxufSkge1xuXG4gIHNhdmVSZWNpZXZlZEhhbmdvdXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgb25BcHBSb3V0ZSwgZm9jdXNlZEhhbmdvdXQsICB1bnJlYWQgfSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYW5nZXIoeyBkaXNwYXRjaCwgaGFuZ291dCwgbmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSkge1xuXG5cbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcbn0gLy8gRU5EIHNhdmVNZXNzYW5nZXJcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVVbmJsb2NrZXIoe1xuICBkaXNwYXRjaCxcbiAgaGFuZ291dCxcbiAgbmFtZSxcbiAgZm9jdXNlZEhhbmdvdXQsXG4gIG9uQXBwUm91dGUsXG4gIHVucmVhZFxufSkge1xuICBcbiAgc2F2ZVJlY2lldmVkSGFuZ291dCh7IGRpc3BhdGNoLCBoYW5nb3V0LCBuYW1lLCBvbkFwcFJvdXRlLCBmb2N1c2VkSGFuZ291dCwgIHVucmVhZCB9KTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJztcbmltcG9ydCB7XG4gIHNhdmVJbnZpdGVkLFxuICBzYXZlVW5ibG92a2VkLFxuICBzYXZlRGVjbGluZWQsXG4gIHNhdmVCbG9ja2VkLFxuICBzYXZlQWNjZXB0ZWQsXG4gIHNhdmVNZXNzYWdlZCxcbn0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucyc7XG5pbXBvcnQge1xuICBzYXZlQWNjZXB0ZXIsXG4gIHNhdmVCbG9ja2VyLFxuICBzYXZlRGVjbGluZXIsXG4gIHNhdmVJbnZpdGVyLFxuICBzYXZlTWVzc2FuZ2VyLFxuICBzYXZlVW5ibG9ja2VyLFxufSBmcm9tICcuL2FjdGlvbnMvcmVjaWV2aW5nLWFjdGlvbnMnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldE1lc3NhZ2Uoe1xuICBzb2NrZXRNZXNzYWdlLFxuICB1c2VybmFtZSxcbiAgZGlzcGF0Y2gsXG4gIGZvY3VzZWRIYW5nb3V0LFxufSkge1xuICBjb25zdCB7IG9uQXBwUm91dGUgfSA9IHVzZUFwcFJvdXRlKCk7XG4gIGZ1bmN0aW9uIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQsb2ZmbGluZSB9KSB7XG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFRDpcbiAgICAgICAgc2F2ZUludml0ZWQoe1xuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgIGhhbmdvdXQsXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcbiAgICAgICAgICBvbkFwcFJvdXRlLFxuICAgICAgICAgIG9mZmxpbmVcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRDpcbiAgICAgICAgc2F2ZVVuYmxvdmtlZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxuICAgICAgICAgIG9uQXBwUm91dGUsXG4gICAgICAgICAgb2ZmbGluZVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORUQ6XG4gICAgICAgIHNhdmVEZWNsaW5lZCh7XG4gICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgaGFuZ291dCxcbiAgICAgICAgICBuYW1lOnVzZXJuYW1lLFxuICAgICAgICAgIGZvY3VzZWRIYW5nb3V0LFxuICAgICAgICAgIG9uQXBwUm91dGUsXG4gICAgICAgICAgb2ZmbGluZVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRDpcbiAgICAgICAgXG4gICAgICAgIHNhdmVCbG9ja2VkKHtcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXG4gICAgICAgICAgb25BcHBSb3V0ZSxcbiAgICAgICAgICBvZmZsaW5lXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5BQ0NFUFRFRDpcbiAgICAgICAgc2F2ZUFjY2VwdGVkKHtcbiAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICBoYW5nb3V0LFxuICAgICAgICAgIG5hbWU6dXNlcm5hbWUsXG4gICAgICAgICAgZm9jdXNlZEhhbmdvdXQsXG4gICAgICAgICAgb25BcHBSb3V0ZSxcbiAgICAgICAgICBvZmZsaW5lXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxuICAgICAgIFxuICAgICAgICBzYXZlTWVzc2FnZWQoe1xuICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgIGhhbmdvdXQsXG4gICAgICAgICAgbmFtZTp1c2VybmFtZSxcbiAgICAgICAgICBmb2N1c2VkSGFuZ291dCxcbiAgICAgICAgICBvbkFwcFJvdXRlLFxuICAgICAgICAgIG9mZmxpbmVcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQsIHVucmVhZCB9KSB7XG4gICAgXG4gICAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XG4gICAgICAgIHNhdmVBY2NlcHRlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRVI6XG4gICAgICAgXG4gICAgICAgIHNhdmVCbG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSOlxuICAgICAgICBcbiAgICAgICAgc2F2ZURlY2xpbmVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XG4gICAgICAgIHNhdmVJbnZpdGVyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcbiAgICAgICAgc2F2ZU1lc3Nhbmdlcih7IGRpc3BhdGNoLCBoYW5nb3V0LCAgbmFtZTp1c2VybmFtZSwgZm9jdXNlZEhhbmdvdXQsb25BcHBSb3V0ZSx1bnJlYWQgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRVI6XG4gICAgICAgIFxuICAgICAgICBzYXZlVW5ibG9ja2VyKHsgZGlzcGF0Y2gsIGhhbmdvdXQsICBuYW1lOnVzZXJuYW1lLCBmb2N1c2VkSGFuZ291dCxvbkFwcFJvdXRlLHVucmVhZCAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSGFuZ291dHMoeyBoYW5nb3V0cyB9KSB7XG4gICAgaGFuZ291dHMuZm9yRWFjaCgoaGFuZ291dCkgPT4ge1xuICAgICAgXG4gICAgICBoYW5kbGVIYW5nb3V0KHsgaGFuZ291dCx1bnJlYWQ6dHJ1ZSB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNvY2tldE1lc3NhZ2UgICYmIHVzZXJuYW1lKSB7XG4gICAgXG4gICAgICBzd2l0Y2ggKHNvY2tldE1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlICdBQ0tIT1dMRURHRU1FTlQnOlxuXG4gICAgICAgICAgaGFuZGxlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dDogc29ja2V0TWVzc2FnZS5oYW5nb3V0LG9mZmxpbmU6ZmFsc2UgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0hBTkdPVVQnOlxuICAgICAgICAgIFxuICAgICAgICAgIGlmKGZvY3VzZWRIYW5nb3V0ICYmIGZvY3VzZWRIYW5nb3V0LnVzZXJuYW1lID09PXNvY2tldE1lc3NhZ2UuaGFuZ291dC51c2VybmFtZSl7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgaGFuZGxlSGFuZ291dCh7IGhhbmdvdXQ6IHNvY2tldE1lc3NhZ2UuaGFuZ291dCx1bnJlYWQ6ZmFsc2UgfSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGhhbmRsZUhhbmdvdXQoeyBoYW5nb3V0OiBzb2NrZXRNZXNzYWdlLmhhbmdvdXQsdW5yZWFkOnRydWUgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1VOUkVBRF9IQU5HT1VUUyc6XG4gICBcbiAgICAgICAgICBoYW5kbGVIYW5nb3V0cyh7IGhhbmdvdXRzOiBzb2NrZXRNZXNzYWdlLmhhbmdvdXRzIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdPRkZMSU5FX0FDS04nOlxuICAgICAgIFxuICAgICAgICAgIGhhbmRsZUFja25vd2xlZGdlbWVudCh7IGhhbmdvdXQ6IHNvY2tldE1lc3NhZ2UuaGFuZ291dCxvZmZsaW5lOnRydWUgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9LCBbc29ja2V0TWVzc2FnZSwgdXNlcm5hbWVdKTtcblxuICByZXR1cm4ge307XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgVkFMVUVfQ0hBTkdFRDogJ1ZBTFVFX0NIQU5HRUQnLFxyXG4gIExPR0lOX1NUQVJURUQ6ICdMT0dJTl9TVEFSVEVEJyxcclxuICBMT0dJTl9TVUNDRVNTOiAnTE9HSU5fU1VDQ0VTUycsXHJcbiAgTE9HSU5fRkFJTEVEOiAnTE9HSU5fRkFJTEVEJyxcclxuXHJcbiAgTE9HT1VUX1NUQVJURUQ6ICdMT0dPVVRfU1RBUlRFRCcsXHJcbiAgTE9HT1VUX0ZBSUxFRDogJ0xPR09VVF9GQUlMRUQnLFxyXG4gIExPR09VVF9TVUNDRVNTOiAnTE9HT1VUX1NVQ0NFU1MnLFxyXG5cclxuICBTSUdOVVBfU1RBUlRFRDogJ1NJR05VUF9TVEFSVEVEJyxcclxuICBTSUdOVVBfU1VDQ0VTUzogJ1NJR05VUF9TVUNDRVNTJyxcclxuICBTSUdOVVBfRkFJTEVEOiAnU0lHTlVQX0ZBSUxFRCcsXHJcblxyXG4gIENIQU5HRV9QQVNTV09SRF9TVEFSVEVEOiAnQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9TVUNDRVNTOiAnQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9GQUlMRUQ6ICdDSEFOR0VfUEFTU1dPUkRfRkFJTEVEJyxcclxuXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQnLFxyXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogJ0dPVF9UT0tFTl9GUk9NX1VSTCcsXHJcblxyXG4gIFJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTogJ1JFQ09WRVJfTE9DQUxfQVVUSF9TVEFURScsXHJcbn07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBlbWFpbDogJycsXHJcbiAgcGFzc3dvcmQ6ICcnLFxyXG4gIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIHVzZXJuYW1lOiAnJyxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBjb25maXJtOiAnJyxcclxuICBjdXJyZW50OiAnJyxcclxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxyXG4gIHRva2VuOiBudWxsLFxyXG4gIGlzTG9nZ2VkSW46IGZhbHNlLFxyXG4gIGlzUGFzc3dvcmRDaGFuZ2VkOiBmYWxzZSxcclxuICBhdXRoRmVlZGJhY2s6IG51bGwsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXV0aFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRDpcclxuICAgICAgY29uc3QgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIFthY3Rpb24ucGF5bG9hZC5wcm9wTmFtZV06IGFjdGlvbi5wYXlsb2FkLnZhbHVlLFxyXG4gICAgICB9O1xyXG4gIFxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXHJcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lLCAnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZScsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIGlzUGFzc3dvcmRDaGFuZ2VkOiB0cnVlLFxyXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkw6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5pbml0U3RhdGUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlci51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLnVzZXIuZW1haWwsXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBBdXRoUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbYXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgaWYgKGF1dGhSb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmsocHJvcHMpIHtcclxuICBjb25zdCB7IHRvLCBpZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRSb3V0ZSh0byk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8YVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgICAgaHJlZj17dG99XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxyXG4gICAgICBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnIH19XHJcbiAgICAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhSb3V0ZUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEF1dGhSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGluaXRpYWxSb3V0ZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZVN0YXRlKGluaXRpYWxSb3V0ZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdLCBbYXV0aFJvdXRlXSk7XHJcblxyXG4gIHJldHVybiA8QXV0aFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vYXV0aFJlZHVjZXInO1xyXG5pbXBvcnQgeyBBdXRoUm91dGVQcm92aWRlciB9IGZyb20gJy4vYXV0aC1yb3V0ZS1jb250ZXh0JztcclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9PlxyXG4gICAgICA8QXV0aFJvdXRlUHJvdmlkZXI+e2NoaWxkcmVufTwvQXV0aFJvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZUF1dGhDb250ZXh0LCBBdXRoUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdlYlNvY2tldCh7IHNvY2tldFVybCwgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodXNlcm5hbWUpIHtcbiAgICAgIGNvbnN0IHNvY2sgPSBuZXcgV2ViU29ja2V0KGAke3NvY2tldFVybH0vP3VzZXJuYW1lPSR7dXNlcm5hbWV9YCk7XG4gICAgICBzb2NrLm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVELCBzb2NrZXRNZXNzYWdlOiBtc2cgfSk7XG4gICBcbiAgICAgIH07XG4gICAgICBzb2NrLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT1BFTiB9KTtcbiAgICAgIH07XG4gICAgICBzb2NrLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xPU0VEIH0pO1xuICAgICAgfTtcbiAgICAgIHNvY2sub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUiwgZXJyb3IgfSk7XG4gICAgICB9O1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfUkVBRFksIHNvY2tldDogc29jayB9KTtcbiAgICB9XG4gIH0sIFt1c2VybmFtZV0pO1xufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge1xuICB1c2VDb250ZXh0LFxuICB1c2VTdGF0ZSxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlRWZmZWN0LFxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuaW1wb3J0IHtcbiAgbG9hZEhhbmdvdXRzLFxuICBmaWx0ZXJIYW5nb3V0cyxcbiAgZmV0Y2hIYW5nb3V0LFxuICBsb2FkTWVzc2FnZXMsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQge3VzZVNvY2tldE1lc3NhZ2V9ZnJvbSAnLi91c2VTb2NrZXRNZXNzYWdlJ1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgeyB1c2VXZWJTb2NrZXQgfSBmcm9tICcuL3VzZVdlYlNvY2tldCc7XG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xuICBjb25zdCB7IHNvY2tldFVybCB9ID0gcHJvcHM7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQsc29ja2V0TWVzc2FnZSB9ID0gc3RhdGU7XG4gIGNvbnN0IHdlYnNvY2tldEhhbmRsZXIgPSB1c2VXZWJTb2NrZXQoeyB1c2VybmFtZSwgZGlzcGF0Y2gsIHNvY2tldFVybCB9KTtcbiAgY29uc3QgaGFuZGxlVXNlU29ja2V0TWVzc2FnZSA9dXNlU29ja2V0TWVzc2FnZSh7dXNlcm5hbWUsZGlzcGF0Y2gsc29ja2V0TWVzc2FnZSwgICBmb2N1c2VkSGFuZ291dDogaGFuZ291dH0pXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCAmJiB1c2VybmFtZSkge1xuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGxvYWRNZXNzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0LHVzZXJuYW1lIH0pO1xuXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XG4gICAgICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXG4gICAgICAgICk7XG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIFtoYW5nb3V0LHVzZXJuYW1lXSk7XG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUaGVtZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggVGhlbWVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgXHJcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRTdGF0ZSk7XHJcblxyXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0LCBUaGVtZVByb3ZpZGVyIH07XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuXG5jb25zdCBOYXZDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuXG5mdW5jdGlvbiB1c2VOYXZDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChOYXZDb250ZXh0KTtcblxuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZU5hdkNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggTmF2UHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlTmF2aWdhdGlvbigpIHtcbiAgY29uc3QgW2RyYXdlck9wZW4sIHNldERyYXdlck9wZW5dID0gdXNlTmF2Q29udGV4dCgpO1xuICAgIGZ1bmN0aW9uIHRvZ2dsZURyYXdlcigpe1xuICAgICAgICBzZXREcmF3ZXJPcGVuKHByZXY9PiFwcmV2KVxuICAgIH1cbiAgcmV0dXJuIHsgZHJhd2VyT3BlbiwgdG9nZ2xlRHJhd2VyIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOYXZQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBbZHJhd2VyT3Blbiwgc2V0RHJhd2VyT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtkcmF3ZXJPcGVuLCBzZXREcmF3ZXJPcGVuXSwgW2RyYXdlck9wZW5dKTtcbiAgcmV0dXJuIDxOYXZDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImltcG9ydHt1c2VTdGF0ZSBhcyBuLHVzZVJlZHVjZXIgYXMgdCx1c2VFZmZlY3QgYXMgZSx1c2VMYXlvdXRFZmZlY3QgYXMgcix1c2VSZWYgYXMgbyx1c2VJbXBlcmF0aXZlSGFuZGxlIGFzIHUsdXNlTWVtbyBhcyBpLHVzZUNhbGxiYWNrIGFzIGYsdXNlQ29udGV4dCBhcyBjLHVzZURlYnVnVmFsdWUgYXMgYX1mcm9tXCJwcmVhY3QvaG9va3NcIjtleHBvcnQqZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e0NvbXBvbmVudCBhcyBsLGNyZWF0ZUVsZW1lbnQgYXMgcyxvcHRpb25zIGFzIHYsdG9DaGlsZEFycmF5IGFzIGgsaHlkcmF0ZSBhcyBkLHJlbmRlciBhcyBwLF91bm1vdW50IGFzIG0sY2xvbmVFbGVtZW50IGFzIHksY3JlYXRlUmVmIGFzIGIsY3JlYXRlQ29udGV4dCBhcyBTLEZyYWdtZW50IGFzIGd9ZnJvbVwicHJlYWN0XCI7ZXhwb3J0e2NyZWF0ZUVsZW1lbnQsY3JlYXRlQ29udGV4dCxjcmVhdGVSZWYsRnJhZ21lbnQsQ29tcG9uZW50fWZyb21cInByZWFjdFwiO2Z1bmN0aW9uIHcobix0KXtmb3IodmFyIGUgaW4gdCluW2VdPXRbZV07cmV0dXJuIG59ZnVuY3Rpb24geChuLHQpe2Zvcih2YXIgZSBpbiBuKWlmKFwiX19zb3VyY2VcIiE9PWUmJiEoZSBpbiB0KSlyZXR1cm4hMDtmb3IodmFyIHIgaW4gdClpZihcIl9fc291cmNlXCIhPT1yJiZuW3JdIT09dFtyXSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgRT1mdW5jdGlvbihuKXt2YXIgdCxlO2Z1bmN0aW9uIHIodCl7dmFyIGU7cmV0dXJuKGU9bi5jYWxsKHRoaXMsdCl8fHRoaXMpLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwLGV9cmV0dXJuIGU9biwodD1yKS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Ll9fcHJvdG9fXz1lLHIucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuLHQpe3JldHVybiB4KHRoaXMucHJvcHMsbil8fHgodGhpcy5zdGF0ZSx0KX0scn0obCk7ZnVuY3Rpb24gQyhuLHQpe2Z1bmN0aW9uIGUobil7dmFyIGU9dGhpcy5wcm9wcy5yZWYscj1lPT1uLnJlZjtyZXR1cm4hciYmZSYmKGUuY2FsbD9lKG51bGwpOmUuY3VycmVudD1udWxsKSx0PyF0KHRoaXMucHJvcHMsbil8fCFyOngodGhpcy5wcm9wcyxuKX1mdW5jdGlvbiByKHQpe3JldHVybiB0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1lLHMobix0KX1yZXR1cm4gci5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD0hMCxyLmRpc3BsYXlOYW1lPVwiTWVtbyhcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIixyLnQ9ITAscn12YXIgXz12Ll9fYjt2Ll9fYj1mdW5jdGlvbihuKXtuLnR5cGUmJm4udHlwZS50JiZuLnJlZiYmKG4ucHJvcHMucmVmPW4ucmVmLG4ucmVmPW51bGwpLF8mJl8obil9O3ZhciBBPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5mb3J3YXJkX3JlZlwiKXx8MzkxMTtmdW5jdGlvbiBrKG4pe2Z1bmN0aW9uIHQodCxlKXt2YXIgcj13KHt9LHQpO3JldHVybiBkZWxldGUgci5yZWYsbihyLHQucmVmfHxlKX1yZXR1cm4gdC4kJHR5cGVvZj1BLHQucmVuZGVyPXQsdC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD10LnQ9ITAsdC5kaXNwbGF5TmFtZT1cIkZvcndhcmRSZWYoXCIrKG4uZGlzcGxheU5hbWV8fG4ubmFtZSkrXCIpXCIsdH12YXIgUj1mdW5jdGlvbihuLHQpe3JldHVybiBuP2gobikucmVkdWNlKGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gbi5jb25jYXQodChlLHIpKX0sW10pOm51bGx9LEY9e21hcDpSLGZvckVhY2g6Uixjb3VudDpmdW5jdGlvbihuKXtyZXR1cm4gbj9oKG4pLmxlbmd0aDowfSxvbmx5OmZ1bmN0aW9uKG4pe2lmKDEhPT0obj1oKG4pKS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuXCIpO3JldHVybiBuWzBdfSx0b0FycmF5Omh9LE49di5fX2U7ZnVuY3Rpb24gVShuKXtyZXR1cm4gbiYmKChuPXcoe30sbikpLl9fYz1udWxsLG4uX19rPW4uX19rJiZuLl9fay5tYXAoVSkpLG59ZnVuY3Rpb24gTSgpe3RoaXMuX191PTAsdGhpcy5vPW51bGwsdGhpcy5fX2I9bnVsbH1mdW5jdGlvbiBMKG4pe3ZhciB0PW4uX18uX19jO3JldHVybiB0JiZ0LnUmJnQudShuKX1mdW5jdGlvbiBPKG4pe3ZhciB0LGUscjtmdW5jdGlvbiBvKG8pe2lmKHR8fCh0PW4oKSkudGhlbihmdW5jdGlvbihuKXtlPW4uZGVmYXVsdHx8bn0sZnVuY3Rpb24obil7cj1ufSkscil0aHJvdyByO2lmKCFlKXRocm93IHQ7cmV0dXJuIHMoZSxvKX1yZXR1cm4gby5kaXNwbGF5TmFtZT1cIkxhenlcIixvLnQ9ITAsb31mdW5jdGlvbiBQKCl7dGhpcy5pPW51bGwsdGhpcy5sPW51bGx9di5fX2U9ZnVuY3Rpb24obix0LGUpe2lmKG4udGhlbilmb3IodmFyIHIsbz10O289by5fXzspaWYoKHI9by5fX2MpJiZyLl9fYylyZXR1cm4gci5fX2Mobix0Ll9fYyk7TihuLHQsZSl9LChNLnByb3RvdHlwZT1uZXcgbCkuX19jPWZ1bmN0aW9uKG4sdCl7dmFyIGU9dGhpcztudWxsPT1lLm8mJihlLm89W10pLGUuby5wdXNoKHQpO3ZhciByPUwoZS5fX3YpLG89ITEsdT1mdW5jdGlvbigpe298fChvPSEwLHI/cihpKTppKCkpfTt0Ll9fYz10LmNvbXBvbmVudFdpbGxVbm1vdW50LHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1KCksdC5fX2MmJnQuX19jKCl9O3ZhciBpPWZ1bmN0aW9uKCl7dmFyIG47aWYoIS0tZS5fX3UpZm9yKGUuX192Ll9fa1swXT1lLnN0YXRlLnUsZS5zZXRTdGF0ZSh7dTplLl9fYj1udWxsfSk7bj1lLm8ucG9wKCk7KW4uZm9yY2VVcGRhdGUoKX07ZS5fX3UrK3x8ZS5zZXRTdGF0ZSh7dTplLl9fYj1lLl9fdi5fX2tbMF19KSxuLnRoZW4odSx1KX0sTS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMuX19iJiYodGhpcy5fX3YuX19rWzBdPVUodGhpcy5fX2IpLHRoaXMuX19iPW51bGwpLFtzKGwsbnVsbCx0LnU/bnVsbDpuLmNoaWxkcmVuKSx0LnUmJm4uZmFsbGJhY2tdfTt2YXIgVz1mdW5jdGlvbihuLHQsZSl7aWYoKytlWzFdPT09ZVswXSYmbi5sLmRlbGV0ZSh0KSxuLnByb3BzLnJldmVhbE9yZGVyJiYoXCJ0XCIhPT1uLnByb3BzLnJldmVhbE9yZGVyWzBdfHwhbi5sLnNpemUpKWZvcihlPW4uaTtlOyl7Zm9yKDtlLmxlbmd0aD4zOyllLnBvcCgpKCk7aWYoZVsxXTxlWzBdKWJyZWFrO24uaT1lPWVbMl19fTsoUC5wcm90b3R5cGU9bmV3IGwpLnU9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcyxlPUwodC5fX3YpLHI9dC5sLmdldChuKTtyZXR1cm4gclswXSsrLGZ1bmN0aW9uKG8pe3ZhciB1PWZ1bmN0aW9uKCl7dC5wcm9wcy5yZXZlYWxPcmRlcj8oci5wdXNoKG8pLFcodCxuLHIpKTpvKCl9O2U/ZSh1KTp1KCl9fSxQLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obil7dGhpcy5pPW51bGwsdGhpcy5sPW5ldyBNYXA7dmFyIHQ9aChuLmNoaWxkcmVuKTtuLnJldmVhbE9yZGVyJiZcImJcIj09PW4ucmV2ZWFsT3JkZXJbMF0mJnQucmV2ZXJzZSgpO2Zvcih2YXIgZT10Lmxlbmd0aDtlLS07KXRoaXMubC5zZXQodFtlXSx0aGlzLmk9WzEsMCx0aGlzLmldKTtyZXR1cm4gbi5jaGlsZHJlbn0sUC5wcm90b3R5cGUuY29tcG9uZW50RGlkVXBkYXRlPVAucHJvdG90eXBlLmNvbXBvbmVudERpZE1vdW50PWZ1bmN0aW9uKCl7dmFyIG49dGhpcztuLmwuZm9yRWFjaChmdW5jdGlvbih0LGUpe1cobixlLHQpfSl9O3ZhciBqPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe312YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9wcy5jb250ZXh0fSx0LnJlbmRlcj1mdW5jdGlvbihuKXtyZXR1cm4gbi5jaGlsZHJlbn0sbn0oKTtmdW5jdGlvbiB6KG4pe3ZhciB0PXRoaXMsZT1uLmNvbnRhaW5lcixyPXMoaix7Y29udGV4dDp0LmNvbnRleHR9LG4udm5vZGUpO3JldHVybiB0LnMmJnQucyE9PWUmJih0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpLHQucD0hMSksbi52bm9kZT90LnA/KGUuX19rPXQuX19rLHAocixlKSx0Ll9faz1lLl9fayk6KHQudj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSxkKFwiXCIsZSksZS5hcHBlbmRDaGlsZCh0LnYpLHQucD0hMCx0LnM9ZSxwKHIsZSx0LnYpLHQuX19rPXQudi5fX2spOnQucCYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCkpLHQuaD1yLHQuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt0LnYucGFyZW50Tm9kZSYmdC5zLnJlbW92ZUNoaWxkKHQudiksbSh0LmgpfSxudWxsfWZ1bmN0aW9uIEQobix0KXtyZXR1cm4gcyh6LHt2bm9kZTpuLGNvbnRhaW5lcjp0fSl9dmFyIEg9L14oPzphY2NlbnR8YWxpZ25tZW50fGFyYWJpY3xiYXNlbGluZXxjYXB8Y2xpcCg/IVBhdGhVKXxjb2xvcnxmaWxsfGZsb29kfGZvbnR8Z2x5cGgoPyFSKXxob3JpenxtYXJrZXIoPyFIfFd8VSl8b3ZlcmxpbmV8cGFpbnR8c3RvcHxzdHJpa2V0aHJvdWdofHN0cm9rZXx0ZXh0KD8hTCl8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZWN0b3J8dmVydHx3b3JkfHdyaXRpbmd8eCg/IUMpKVtBLVpdLztsLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXt9O3ZhciBUPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3ImJlN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpfHw2MDEwMztmdW5jdGlvbiBWKG4sdCxlKXtpZihudWxsPT10Ll9faylmb3IoO3QuZmlyc3RDaGlsZDspdC5yZW1vdmVDaGlsZCh0LmZpcnN0Q2hpbGQpO3JldHVybiBwKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH1mdW5jdGlvbiBaKG4sdCxlKXtyZXR1cm4gZChuLHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJmUoKSxuP24uX19jOm51bGx9dmFyIEk9di5ldmVudDtmdW5jdGlvbiAkKG4sdCl7bltcIlVOU0FGRV9cIit0XSYmIW5bdF0mJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLHQse2NvbmZpZ3VyYWJsZTohMSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tcIlVOU0FGRV9cIit0XX0sc2V0OmZ1bmN0aW9uKG4pe3RoaXNbXCJVTlNBRkVfXCIrdF09bn19KX12LmV2ZW50PWZ1bmN0aW9uKG4pe0kmJihuPUkobikpLG4ucGVyc2lzdD1mdW5jdGlvbigpe307dmFyIHQ9ITEsZT0hMSxyPW4uc3RvcFByb3BhZ2F0aW9uO24uc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7ci5jYWxsKG4pLHQ9ITB9O3ZhciBvPW4ucHJldmVudERlZmF1bHQ7cmV0dXJuIG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtvLmNhbGwobiksZT0hMH0sbi5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1mdW5jdGlvbigpe3JldHVybiB0fSxuLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBlfSxuLm5hdGl2ZUV2ZW50PW59O3ZhciBxPXtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xhc3N9fSxCPXYudm5vZGU7di52bm9kZT1mdW5jdGlvbihuKXtuLiQkdHlwZW9mPVQ7dmFyIHQ9bi50eXBlLGU9bi5wcm9wcztpZih0KXtpZihlLmNsYXNzIT1lLmNsYXNzTmFtZSYmKHEuZW51bWVyYWJsZT1cImNsYXNzTmFtZVwiaW4gZSxudWxsIT1lLmNsYXNzTmFtZSYmKGUuY2xhc3M9ZS5jbGFzc05hbWUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiY2xhc3NOYW1lXCIscSkpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpe3ZhciByLG8sdTtmb3IodSBpbiBlLmRlZmF1bHRWYWx1ZSYmdm9pZCAwIT09ZS52YWx1ZSYmKGUudmFsdWV8fDA9PT1lLnZhbHVlfHwoZS52YWx1ZT1lLmRlZmF1bHRWYWx1ZSksZGVsZXRlIGUuZGVmYXVsdFZhbHVlKSxBcnJheS5pc0FycmF5KGUudmFsdWUpJiZlLm11bHRpcGxlJiZcInNlbGVjdFwiPT09dCYmKGgoZS5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbihuKXstMSE9ZS52YWx1ZS5pbmRleE9mKG4ucHJvcHMudmFsdWUpJiYobi5wcm9wcy5zZWxlY3RlZD0hMCl9KSxkZWxldGUgZS52YWx1ZSksZSlpZihyPUgudGVzdCh1KSlicmVhaztpZihyKWZvcih1IGluIG89bi5wcm9wcz17fSxlKW9bSC50ZXN0KHUpP3UucmVwbGFjZSgvW0EtWjAtOV0vLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCk6dV09ZVt1XX0hZnVuY3Rpb24odCl7dmFyIGU9bi50eXBlLHI9bi5wcm9wcztpZihyJiZcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIG89e307Zm9yKHZhciB1IGluIHIpL15vbihBbml8VHJhfFRvdSkvLnRlc3QodSkmJihyW3UudG9Mb3dlckNhc2UoKV09clt1XSxkZWxldGUgclt1XSksb1t1LnRvTG93ZXJDYXNlKCldPXU7aWYoby5vbmRvdWJsZWNsaWNrJiYoci5vbmRibGNsaWNrPXJbby5vbmRvdWJsZWNsaWNrXSxkZWxldGUgcltvLm9uZG91YmxlY2xpY2tdKSxvLm9uYmVmb3JlaW5wdXQmJihyLm9uYmVmb3JlaW5wdXQ9cltvLm9uYmVmb3JlaW5wdXRdLGRlbGV0ZSByW28ub25iZWZvcmVpbnB1dF0pLG8ub25jaGFuZ2UmJihcInRleHRhcmVhXCI9PT1lfHxcImlucHV0XCI9PT1lLnRvTG93ZXJDYXNlKCkmJiEvXmZpbHxjaGV8cmEvaS50ZXN0KHIudHlwZSkpKXt2YXIgaT1vLm9uaW5wdXR8fFwib25pbnB1dFwiO3JbaV18fChyW2ldPXJbby5vbmNoYW5nZV0sZGVsZXRlIHJbby5vbmNoYW5nZV0pfX19KCksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmIXQubSYmdC5wcm90b3R5cGUmJigkKHQucHJvdG90eXBlLFwiY29tcG9uZW50V2lsbE1vdW50XCIpLCQodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzXCIpLCQodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsVXBkYXRlXCIpLHQubT0hMCl9QiYmQihuKX07dmFyIEc9XCIxNi44LjBcIjtmdW5jdGlvbiBKKG4pe3JldHVybiBzLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBLKG4pe3JldHVybiEhbiYmbi4kJHR5cGVvZj09PVR9ZnVuY3Rpb24gUShuKXtyZXR1cm4gSyhuKT95LmFwcGx5KG51bGwsYXJndW1lbnRzKTpufWZ1bmN0aW9uIFgobil7cmV0dXJuISFuLl9fayYmKHAobnVsbCxuKSwhMCl9ZnVuY3Rpb24gWShuKXtyZXR1cm4gbiYmKG4uYmFzZXx8MT09PW4ubm9kZVR5cGUmJm4pfHxudWxsfXZhciBubj1mdW5jdGlvbihuLHQpe3JldHVybiBuKHQpfSx0bj1nO2V4cG9ydCBkZWZhdWx0e3VzZVN0YXRlOm4sdXNlUmVkdWNlcjp0LHVzZUVmZmVjdDplLHVzZUxheW91dEVmZmVjdDpyLHVzZVJlZjpvLHVzZUltcGVyYXRpdmVIYW5kbGU6dSx1c2VNZW1vOmksdXNlQ2FsbGJhY2s6Zix1c2VDb250ZXh0OmMsdXNlRGVidWdWYWx1ZTphLHZlcnNpb246XCIxNi44LjBcIixDaGlsZHJlbjpGLHJlbmRlcjpWLGh5ZHJhdGU6Wix1bm1vdW50Q29tcG9uZW50QXROb2RlOlgsY3JlYXRlUG9ydGFsOkQsY3JlYXRlRWxlbWVudDpzLGNyZWF0ZUNvbnRleHQ6UyxjcmVhdGVGYWN0b3J5OkosY2xvbmVFbGVtZW50OlEsY3JlYXRlUmVmOmIsRnJhZ21lbnQ6Zyxpc1ZhbGlkRWxlbWVudDpLLGZpbmRET01Ob2RlOlksQ29tcG9uZW50OmwsUHVyZUNvbXBvbmVudDpFLG1lbW86Qyxmb3J3YXJkUmVmOmssdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXM6bm4sU3RyaWN0TW9kZTpnLFN1c3BlbnNlOk0sU3VzcGVuc2VMaXN0OlAsbGF6eTpPfTtleHBvcnR7RyBhcyB2ZXJzaW9uLEYgYXMgQ2hpbGRyZW4sViBhcyByZW5kZXIsWiBhcyBoeWRyYXRlLFggYXMgdW5tb3VudENvbXBvbmVudEF0Tm9kZSxEIGFzIGNyZWF0ZVBvcnRhbCxKIGFzIGNyZWF0ZUZhY3RvcnksUSBhcyBjbG9uZUVsZW1lbnQsSyBhcyBpc1ZhbGlkRWxlbWVudCxZIGFzIGZpbmRET01Ob2RlLEUgYXMgUHVyZUNvbXBvbmVudCxDIGFzIG1lbW8sayBhcyBmb3J3YXJkUmVmLG5uIGFzIHVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzLHRuIGFzIFN0cmljdE1vZGUsTSBhcyBTdXNwZW5zZSxQIGFzIFN1c3BlbnNlTGlzdCxPIGFzIGxhenl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGF0Lm1vZHVsZS5qcy5tYXBcbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQge2h9IGZyb20gJ3ByZWFjdCdcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJ1xuZXhwb3J0IGZ1bmN0aW9uIE5hdkl0ZW0gKHByb3BzKXtcbmNvbnN0IHtjaGlsZHJlbn09cHJvcHNcbnJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+e2NoaWxkcmVufTwvZGl2PlxufSIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBMaXN0KHsgY2hpbGRyZW4sIGlkIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxyXG5cclxuICAgICAgICBwYWRkaW5nVG9wOiA4LFxyXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpc3RJdGVtKHsgY2hpbGRyZW4sIG9uQ2xpY2ssIGlkIH0pIHtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgaWQ9e2lkfVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XHJcbiAgICAgIGNsYXNzTmFtZT0nZHJhd2VyLWxpc3QtaXRlbSdcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgICAgICBwYWRkaW5nTGVmdDogMTYsXHJcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiAxNixcclxuICAgICAgICBwYWRkaW5nVG9wOiA4LFxyXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDgsXHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImNvbnN0IGltZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUJBQ0FRQUFBQUFZTGxWQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBQW1KTFIwUUFBS3FOSXpJQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFIZEVsTlJRZmtCQnNJTFMxWWY5SklBQUFEb0VsRVFWUm8zcjJaUzBoVVVSakhmM010aTlCU00ybFIwdFBKaEVqU1ZpRUUxYUtObFJVVkpGRVFGRkVrYnUyMUs3R0lOaEZGUkErQ2xpVXRhdE5MM0lUUk5LRVJCbEVMZFViSDdLR21jMXZjcmpQanpMMzNmR2Z1K0gyTGdYdk85Lzk5OTV3ejUzVURTSzJNT3FwWVF3WEZGRkVBL0NUR0VEMTBFK1lWL1dKRlphdmxNaUhpbUM0ZUowUWJOWDZqNTlQTVIxZndkQS9UVEtFLzhCTE9NeWlDMno3SU9ZcXpnd2RvcEY4TGJudVVVeGk2K0ZXOHlRcHUrMnRXNnVCM011UUwzc1RrQi90a2NJTXJ2c0Z0YjFQdmlud2UrSTQzTWJuUGJEVjhlMDd3SmlaUHZGTUljQ2RuZUJPVEIxNGQ0WC9mVC9kV04veWVuT05OVFBZNzRWY1NtNUVFWXF6STNQditURHNxL3BKQUFtdmJFVzdLSmd1KzhwQWVJTWgrbGdwakQzRW45VUVKQTZKMytFTVRlVlBSZVRUelJ4VGZSMUZxQWhkRTRXTnNUM3VucmNJVXppUUh6eGN1dU1jeU51dHhrVVkwZWIvUUxBcnRTQm81cWNPNFU2VFRsQWdOaVFKM09RNHQyVHdTdHNOcVJXRy95SGRNSUo5ZklxMXFNTUI1WnNwb0hZdzdsbzNUS2RJNllDV3dUUlRVNjFyNlJhUzFCUXpLV0NzS2lybVdSa1ZhNnlnMXFITVkwMDQyeDdWMHJrakxvTTZnU2hRQ1MxeEx5NFZxVlFaQllVaXRTMWxBZkNZS0dsUUlROHFwZGl5cjhXaWZkS3N3S0JXR3dFbkhraE5pclZLSWlLWU9FNU1KaDRiZXlJUllhd0RHeEVFbW4xbVVoaStqVjBOcFZDOEJrMjRxVS9DVmRHdnBqT3AwZ1IyNmVBby9UN2dYU09vQ2c1L2lnV1BacDZTN2tOOTgxRlFaTVlob2hQM2xPcHVJSnozWnpFMG1OSlFpaU0rQm85eHdPRzZ2NXBaNFJOMkRzNExxY1I2eXpQV05sdk5JbEVBTE5DaFhqbEd2MUt6MURDdHI3b1F5ajNzdjI3OEpKdTFLdml0cFRscno4SHVGcW1NdUswQW0yOEM0Z21xWHRTTjZyaURZUnBjb2diZGNVYWoxelBxcFVSajVDMFY0Z0VVSy80ajFkdVd3UjhWMk1SN2dxWWRxQ1BoL1gzSGJRNnBESzRFM0h1VkoxRUtQbzFtRFZnTHV4NVFJQllrV0dPR2FxMVJNS3dIM3FLdldLbVR2aUl2cHliREcyemFpTmMvUGNybXU3aVBJY09xanc2SXBORnMvbUo1VGdOY3pobitSK1N3eVU1ZFVRNWt2cVFCMnowZ0N6c2Q3b0MzbitJdnVJemZBN1p6aTczdmZtYy9PNFdYMVk3WDc4bG5jeWduK3JocmU2b2hXbitGeExncXZBZGloK2Ewc2t3K3pWd2EzYkFVdmZjRy9ZTGtPM3VxS1J2cXlna2M1S20zNjZWYkVHYUphOEFndExNZ09ibHNCVFh3UXdVT2N0dFo3UDYyYVZ0NHg2UXFlcEl0TGliMmVTaTlMclpRNjFsSkpCU1ZKbis4SHB6N2ZDOCthL3dDMVpBWHMzVWhVSEFBQUFDVjBSVmgwWkdGMFpUcGpjbVZoZEdVQU1qQXlNQzB3TkMweU4xUXdPRG8wTlRvME5Tc3dNRG93TUJhd1NWUUFBQUFsZEVWWWRHUmhkR1U2Ylc5a2FXWjVBREl3TWpBdE1EUXRNamRVTURnNk5EVTZORFVyTURBNk1EQm43ZkhvQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUIzZDNjdWFXNXJjMk5oY0dVdWIzSm5tKzQ4R2dBQUFBQkpSVTVFcmtKZ2dnPT1cIjtcbiAgZXhwb3J0IGRlZmF1bHQgaW1nOyIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBWQUxJRDogJ1ZBTElEJyxcclxuICBJTlZBTElEOiAnSU5WQUxJRCcsXHJcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRSdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIC8vY29uc3RyYWludFxyXG4gIEVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OOiAnUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIFVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOiAnVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04nLFxyXG4gIEVNUFRZX1NUUklOR19WQUxJREFUSU9OOiAnRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04nLFxyXG4gIFBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOiAnUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04nLFxyXG4gIC8vYXV0aFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdJTlZBTElEX0NSRURFTlRJQUxTJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ1VTRVJOQU1FX1RBS0VOJyxcclxuICBSRUdJU1RFUkVEX0VNQUlMOiAnUkVHSVNURVJFRF9FTUFJTCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdFTUFJTF9OT1RfUkVHSVNURVJFRCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6J1VTRVJOQU1FX05PVF9SRUdJU1RFUkVEJ1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSU5WQUxJRF9QQVNTV09SRDpcclxuICAgICdhdCBsZWFzdCA4IGNoYXJhY3RlcnMsIG11c3QgY29udGFpbiBhdCBsZWFzdCAxIHVwcGVyY2FzZSBsZXR0ZXIsIDEgbG93ZXJjYXNlIGxldHRlciwgQ2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzJyxcclxuICBJTlZBTElEX0VNQUlMOiAnZW1haWwgZm9ybWF0IGlzIG5vdCB2YWxpZCcsXHJcbiAgRU1BSUxfTk9UX1JFR0lTVEVSRUQ6ICdlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQ6ICd1c2VybmFtZSBpcyBub3QgcmVnaXN0ZXJlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRTpcclxuICAgICdvbmx5IExldHRlcnMgYS16IG9yIEEtWiBhbmQgdGhlIFN5bWJvbHMgLSBhbmQgXyBhcmUgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9FTVBUWV9TVFJJTkc6ICdlbXB0eSBzdHJpbmcgaXMgbm90IGFsbG93ZWQnLFxyXG4gIElOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUw6ICdlbWFpbCBvciB1c2VybmFtZSBpcyBub3QgdmFsaWQnLFxyXG4gIElOVkFMSURfQ1JFREVOVElBTFM6ICdpbnZhbGlkIGNyZWRlbnRpYWxzIHByb3ZpZGVkJyxcclxuICBVU0VSTkFNRV9UQUtFTjogJ3VzZXJuYW1lIGlzIGFscmVhZHkgdGFrZW4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdlbWFpbCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnLFxyXG4gIFBBU1NXT1JEU19ET19OT1RfTUFUQ0g6ICdwYXNzd29yZHMgZG8gbm90IG1hdGNoJ1xyXG59O1xyXG4iLCJleHBvcnQgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipcXGQpKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qW2EtekEtWl0pLns4LH0kL2c7XHJcblxyXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT8vZztcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VybmFtZVJlZ2V4ID0gL1thLXpBLVpdK1stX10qW2EtekEtWl0rL2c7XHJcbiIsImltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBlbWFpbFJlZ2V4LCBwYXNzd29yZFJlZ2V4LCB1c2VybmFtZVJlZ2V4IH0gZnJvbSAnLi92YWxpZGF0aW9uUmVnZXgnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoeyBlbWFpbCB9KSB7XHJcbiAgY29uc3QgZW1haWxDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChlbWFpbFJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KGVtYWlsKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpZW50VmFsaWRhdGlvblR5cGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZENvbnN0cmFpbnQoeyBwYXNzd29yZCB9KSB7XHJcbiAgY29uc3QgcGFzc3dvcmRDb25zdHJhaW50ID0gbmV3IFJlZ0V4cChwYXNzd29yZFJlZ2V4KTtcclxuICBpZiAocGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuICBpZiAoIXBhc3N3b3JkQ29uc3RyYWludC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHsgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh1c2VybmFtZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7IHZhbHVlIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG4gIGNvbnN0IHVzZXJuYW1lQ29uc3RyYWludCA9IG5ldyBSZWdFeHAodXNlcm5hbWVSZWdleCk7XHJcblxyXG4gIGlmIChlbWFpbENvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICh1c2VybmFtZUNvbnN0cmFpbnQudGVzdCh2YWx1ZSkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSkge1xyXG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNUFRZX1NUUklORyxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KSB7XHJcblxyXG4gIGNvbnN0IHsgcGFzc3dvcmQsIGNvbmZpcm0gfSA9YXV0aDtcclxuZGVidWdnZXI7XHJcbiAgaWYgKHBhc3N3b3JkID09PSAnJyB8fCBwYXNzd29yZCAhPT0gY29uZmlybSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlBBU1NXT1JEU19ET19OT1RfTUFUQ0gsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBJTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURTogJ0lOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIFJFU0VUX1ZBTElEQVRJT05fU1RBVEU6ICdSRVNFVF9WQUxJREFUSU9OX1NUQVRFJyxcclxuICAgIElOUFVUX0JMVVJSRUQ6ICdJTlBVVF9CTFVSUkVEJyxcclxuICAgIElOUFVUX0ZPQ1VTRUQ6ICdJTlBVVF9GT0NVU0VEJyxcclxuICBcclxuICAgIFNFUlZFUl9WQUxJREFUSU9OOiAnU0VSVkVSX1ZBTElEQVRJT04nLFxyXG4gICAgQ0xJRU5UX1ZBTElEQVRJT046J0NMSUVOVF9WQUxJREFUSU9OJyxcclxuICBcclxuICAgIElOQ19JTlBVVF9DT1VUTiA6J0lOQ19JTlBVVF9DT1VUTidcclxuICB9O1xyXG4gICIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAvL2xvZ2luXHJcbiAgY3JlZGVudGlhbEludmFsaWQ6ICc0MDEnLFxyXG4gIC8vc2lnbnVwXHJcbiAgdXNlcm5hbWVJc1Rha2VuOiAnNDAyJyxcclxuICBlbWFpbElzUmVnaXN0ZXJlZDogJzQwMycsXHJcbiAgdXNlcm5hbWVJbnZhbGlkOiAnNDA1JyxcclxuICBwYXNzd29yZEludmFsaWQ6ICc0MDYnLCAvL2NoYW5nZSBwYXNzd29yZFxyXG4gIGVtYWlsSW52YWxpZDogJzQwNycsXHJcbiAgLy9sb2dpblxyXG4gIGVtYWlsSXNOb3RSZWdpc3RlcmVkOiAnNDA4JyxcclxuICBlbXB0eVN0cmluZ05vdFZhbGlkOiAnNDA5JyxcclxuICBlbWFpbG9ydXNlcm5hbWVOb3RWYWxpZDonNDEwJyxcclxuICB1c2VybmFtZUlzTm90UmVnaXN0ZXJlZDonNDExJyxcclxuLy9jaGFuZ2UgcGFzc3dvcmRcclxuICBwYXNzd29yZERvTm90TWF0Y2g6JzQxMicsXHJcbiAgdG9rZW5FeHBpcmVkOic0MTMnLFxyXG4gIHNlcnZlclZhbGlkYXRpb25SYW5nZTogc3RhdHVzID0+IHtcclxuICAgIGlmIChzdGF0dXMgPj0gNDAwICYmIHN0YXR1cyA8PSA0MTApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG4iLCJcclxuaW1wb3J0ICogYXMgdmFsaWRhdGlvbnMgZnJvbSAnLi9jb25zdHJhaW50VmFsaWRhdG9ycyc7XHJcbmltcG9ydCBjb25zdFZhbFR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25TdGF0ZXMgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuL3ZhbGlkYXRpb25UeXBlcyc7XHJcbmltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IGh0dHBTdGF0dXMgZnJvbSAnLi9odHRwLXN0YXR1cyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uTWVzc2FnZXMgZnJvbSAnLi92YWxpZGF0aW9uTWVzc2FnZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudFZhbGlkYXRpb24oeyB2YWxpZGF0aW9uVHlwZSwgdmFsdWUsIHN0YXRlLGF1dGggfSkge1xyXG5cclxuICBsZXQgdmFsaWRhdGlvbiA9IG51bGw7XHJcbiAgc3dpdGNoICh2YWxpZGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbENvbnN0cmFpbnQoe1xyXG4gICAgICAgIGVtYWlsOiB2YWx1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OOlxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVFbWFpbE9yVXNlcm5hbWUoe1xyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZVVzZXJOYW1lQ29uc3RyYWludCh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtcHR5U3RyaW5nKHsgdmFsdWUgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBjb25zdFZhbFR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OOlxyXG4gICBcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRNYXRjaCh7IGF1dGggfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTiwgLi4udmFsaWRhdGlvbiB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdEZvcm1WYWxpZGF0aW9uU3RhdGUoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUoeyB2YWxpZGF0aW9uVHlwZSB9KSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURSwgdmFsaWRhdGlvblR5cGUgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluY0lucHV0Q291bnQoKSB7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuSU5DX0lOUFVUX0NPVVROIH07XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VydmVyVmFsaWRhdGlvbih7IHN0YXR1cyA9IDAgfSkge1xyXG5cclxuICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmNyZWRlbnRpYWxJbnZhbGlkOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1BBU1NXT1JELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSW52YWxpZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5JTlZBTElEX1VTRVJOQU1FLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNSZWdpc3RlcmVkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUkVHSVNURVJFRF9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbWFpbElzTm90UmVnaXN0ZXJlZDpcclxuICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLnVzZXJuYW1lSXNUYWtlbjpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9UQUtFTixcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy5lbXB0eVN0cmluZ05vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICAgIGNhc2UgaHR0cFN0YXR1cy5wYXNzd29yZERvTm90TWF0Y2g6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7IHNlcnZlclZhbGlkYXRpb24gfSBmcm9tICcuLi9mb3JtL2FjdGlvbnMnO1xyXG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuLi9mb3JtL2h0dHAtc3RhdHVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlQ2hhbmdlZCh7IHByb3BOYW1lLCB2YWx1ZSB9KSB7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBhY3Rpb25UeXBlcy5WQUxVRV9DSEFOR0VELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBwcm9wTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL2xvZ2luYCwge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ0NvbnRlbi1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJyonLFxyXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCYXNpYyAke2J0b2EoYCR7ZW1haWxvcnVzZXJuYW1lfToke3Bhc3N3b3JkfWApfWAsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiBcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX1NVQ0NFU1MsIHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSk7XHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICBcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTG9naW4gZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWdudXAoeyBkaXNwYXRjaCwgZm9ybURpc3BhdGNoLCBzdGF0ZSB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TSUdOVVBfU1RBUlRFRCB9KTtcclxuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCwgdXNlcm5hbWUgfSA9IHN0YXRlO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9zaWdudXBgLCB7XHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGFzc3dvcmQsIGVtYWlsLCB1c2VybmFtZSB9KSxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIENvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc3QgeyB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0gPSByZXN1bHQ7XHJcblxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVUNDRVNTLCB0b2tlbiwgdXNlcm5hbWUsIGVtYWlsIH0pO1xyXG5cclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWdudXAgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQsIHBheWxvYWQ6IHsgZXJyb3IgfSB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3dlYmNvbScpO1xyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkxPR09VVF9TVUNDRVNTIH07XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2gsIHRva2VuIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIH0pO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGNvbmZpcm0sIHBhc3N3b3JkIH0gPSBzdGF0ZTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlfdXJsfS9hdXRoL2NoYW5nZXBhc3NgLCB7XHJcbiAgICAgIG1ldGhvZDogJ3B1dCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBjb25maXJtLFxyXG4gICAgICAgIHBhc3N3b3JkLFxyXG4gICAgICAgIHRva2VuLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUyxcclxuICAgICAgICB0b2tlbixcclxuICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICBtZXNzYWdlOiBgUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuYCxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNTAwKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCxcclxuICAgICAgcGF5bG9hZDogeyBlcnJvciB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCB9KSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgeyBlbWFpbCB9ID0gc3RhdGU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXV0aC9yZXF1ZXN0cGFzc2NoYW5nZWAsIHtcclxuICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwgfSksXHJcbiAgICB9KTtcclxuICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuOiByZXN1bHQudG9rZW4sXHJcbiAgICAgICAgbWVzc2FnZTogYEEgbGluayBmb3IgcGFzc3dvcmQgY2hhbmdlICBoYXMgYmVlbiBzZW50IHRvLCAke2VtYWlsfSEgYCxcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSByZXN1bHQ7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICAgIGVycm9yLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hhbmdpbmcgcGFzc3dvcmQgZmFpbGVkJyk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVyciA9IGVycm9yO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUb2tlbkZyb21VcmwoeyB0b2tlbiB9KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLkdPVF9UT0tFTl9GUk9NX1VSTCxcclxuICAgIHRva2VuLFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNvdmVyTG9jYWxBdXRoU3RhdGUoeyB1c2VyLCBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUsIHVzZXIgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7dXNlQXBwUm91dGV9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJ1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uL2xheW91dC9OYXZMaXN0JztcclxuaW1wb3J0IHVzZXJJY29uIGZyb20gJy4vaWNvbnMvdXNlcjY0LnBuZyc7XHJcbmltcG9ydCB7IGxvZ291dCB9IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5jb25zdCBzdHlsZSA9IHtcclxuICBncmlkOiB7XHJcbiAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnYXV0byA1JSBhdXRvJyxcclxuICAgIGp1c3RpZnlJdGVtczogJ2NlbnRlcicsXHJcbiAgICBwYWRkaW5nOjE2XHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoRHJhd2VyQ29udGVudCgpIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHtvbkFwcFJvdXRlfSA9IHVzZUFwcFJvdXRlKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOiBgLyR7aWR9YCxyb3V0ZTonL2F1dGgnfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nVG9wOiAxMCB9fT5cclxuICAgICAgeyFzdGF0ZS51c2VybmFtZSAmJiA8VW5BdXRoZWRTdGF0ZSBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9IC8+fVxyXG4gICAgICB7c3RhdGUudXNlcm5hbWUgJiYgKFxyXG4gICAgICAgIDxBdXRoZWRTdGF0ZVxyXG4gICAgICAgIG9uQXBwUm91dGU9e29uQXBwUm91dGV9XHJcbiAgICAgICAgICBoYW5kbGVSb3V0ZT17aGFuZGxlUm91dGV9XHJcbiAgICAgICAgICB1c2VyTmFtZT17c3RhdGUudXNlcm5hbWV9XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuICAgICAgPGhyIHN0eWxlPXt7IGhlaWdodDogMSB9fSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUsIHVzZXJOYW1lICxvbkFwcFJvdXRlfSkge1xyXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ091dCgpIHtcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6Jy8nLHJvdXRlOicvaG9tZSd9KTtcclxuICAgIGxvZ291dCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8aW1nIHNyYz17dXNlckljb259IHN0eWxlPXt7IHBhZGRpbmdSaWdodDogNSB9fSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlTG9nT3V0fSBpZD0nbG9nb3V0JyBkYXRhLXRlc3RpZD0nbG9nb3V0Jz5cclxuICAgICAgICAgICAgTG9nb3V0XHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogOCB9fT5XZWxjb21lLCB7dXNlck5hbWV9PC9kaXY+XHJcbiAgICAgIDxMaXN0PlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICAgIENoYW5nZSBQYXNzd29yZFxyXG4gICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgIDwvTGlzdD5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBVbkF1dGhlZFN0YXRlKHsgaGFuZGxlUm91dGUgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZS5ncmlkfT5cclxuICAgICAgICA8YSBocmVmPScvJyBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2xvZ2luJyBkYXRhLXRlc3RpZD0nbG9naW4nPlxyXG4gICAgICAgICAgTG9naW5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgPGRpdj58PC9kaXY+XHJcbiAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdzaWdudXAnIGRhdGEtdGVzdGlkPSdzaWdudXAnPlxyXG4gICAgICAgICAgU2lnbnVwXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlVXNlck5hbWUoKSB7XHJcbiAgY29uc3QgW3VzZXJOYW1lLCBzZXRVc2VybmFtZV0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbdG9rZW4sIHNldFRva2VuXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IHsgc3RhdGUsZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICBcclxuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcbiBcclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgdG9rZW4sIGVtYWlsIH0gPSBKU09OLnBhcnNlKFxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJylcclxuICAgICAgKTtcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUudG9rZW4pIHtcclxuICBcclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwsIHRva2VuIH0gPXN0YXRlO1xyXG4gICAgICAvLyBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwgfSA9IEpTT04ucGFyc2UoXHJcbiAgICAgIC8vICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxyXG4gICAgICAvLyApO1xyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgfVxyXG4gIH0sIFtzdGF0ZV0pO1xyXG5cclxuICByZXR1cm4geyB1c2VyTmFtZSwgdG9rZW4sIGVtYWlsIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uLy4uL2xheW91dC9OYXZMaXN0JztcbmltcG9ydCB7IHVzZVVzZXJOYW1lIH0gZnJvbSAnLi4vLi4vYXV0aC91c2VVc2VyTmFtZSc7XG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi8uLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcydcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0RHJhd2VyQ29udGVudCgpIHtcblxuY29uc3Qge29uQXBwUm91dGV9ID11c2VBcHBSb3V0ZSgpXG5cbiAgY29uc3QgeyB1c2VyTmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcblxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xuICAgIGlmICh1c2VyTmFtZSkge1xuXG4gICAgICBvbkFwcFJvdXRlKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGU6Jy9oYW5nb3V0cycscm91dGU6Jy9oYW5nb3V0cyd9KVxuICAgIH0gZWxzZSB7XG5cbiAgICAgIG9uQXBwUm91dGUoe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTonL2xvZ2luJyxyb3V0ZTonL2F1dGgnfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPExpc3Q+XG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2hhbmdvdXRzJz5cbiAgICAgICAgICBIYW5nb3V0XG4gICAgICAgIDwvTGlzdEl0ZW0+XG4gXG4gICAgICA8L0xpc3Q+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCBtZXNzYWdlSWNvbiBmcm9tICcuL21lc3NhZ2UucG5nJztcbmNvbnN0IHN0eWxlID0ge1xuICBjb3VudDoge1xuICAgIHdpZHRoOiAzMCxcbiAgICBoZWlnaHQ6IDMwLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZWVuJyxcbiAgICBjb2xvcjogJ3doaXRlJyxcbiAgICB0ZXh0QWxpZ246J2NlbnRlcicsXG4gICAgYm9yZGVyUmFkaXVzOjE1LFxuICAgIGRpc3BsYXk6J2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6J2NlbnRlcicsXG4gICAganVzdGlmeUNvbnRlbnQ6J2NlbnRlcidcbiAgfSxcbn07XG5leHBvcnQgZnVuY3Rpb24gTWVzc2FnZSh7IGNvdW50PTAgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJ319PlxuICAgICAgICAgIDxkaXY+bWVzc2FnZTo8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmNvdW50fSBkYXRhLXRlc3RpZD1cIm1lc3NhZ2UtY291bnRcIj57Y291bnR9PC9kaXY+IFxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gU2V0dGluZ3MocHJvcHMpIHtcclxuXHJcbiAgY29uc3QgeyBoZWlnaHQgPSAyNCxcclxuICAgIHdpZHRoID0gMjQsXHJcbiAgICBmaWxsID0gJ25vbmUnLFxyXG4gICAgY29sb3IgPSAnYmxhY2snLG9uQ2xpY2sgLGlkfT1wcm9wc1xyXG4gIFxyXG4gIHJldHVybiAoXHJcbiAgICA8c3ZnIGhlaWdodD17aGVpZ2h0fSB2aWV3Qm94PScwIDAgMjQgMjQnIHdpZHRoPXt3aWR0aH0gb25DbGljaz17b25DbGlja30gaWQ9e2lkfT5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgwVjB6JyBmaWxsPXtmaWxsfSBpZD17aWR9Lz5cclxuICAgICAgPHBhdGhcclxuICAgICAgaWQ9e2lkfVxyXG4gICAgICAgIGNvbG9yPXtjb2xvcn1cclxuICAgICAgICBkPSdNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2Yy0uMTItLjIyLS4zOS0uMy0uNjEtLjIybC0yLjQ5IDFjLS41Mi0uNC0xLjA4LS43My0xLjY5LS45OGwtLjM4LTIuNjVDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJoLTRjLS4yNSAwLS40Ni4xOC0uNDkuNDJsLS4zOCAyLjY1Yy0uNjEuMjUtMS4xNy41OS0xLjY5Ljk4bC0yLjQ5LTFjLS4yMy0uMDktLjQ5IDAtLjYxLjIybC0yIDMuNDZjLS4xMy4yMi0uMDcuNDkuMTIuNjRsMi4xMSAxLjY1Yy0uMDQuMzItLjA3LjY1LS4wNy45OHMuMDMuNjYuMDcuOThsLTIuMTEgMS42NWMtLjE5LjE1LS4yNC40Mi0uMTIuNjRsMiAzLjQ2Yy4xMi4yMi4zOS4zLjYxLjIybDIuNDktMWMuNTIuNCAxLjA4LjczIDEuNjkuOThsLjM4IDIuNjVjLjAzLjI0LjI0LjQyLjQ5LjQyaDRjLjI1IDAgLjQ2LS4xOC40OS0uNDJsLjM4LTIuNjVjLjYxLS4yNSAxLjE3LS41OSAxLjY5LS45OGwyLjQ5IDFjLjIzLjA5LjQ5IDAgLjYxLS4yMmwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NGwtMi4xMS0xLjY1ek0xMiAxNS41Yy0xLjkzIDAtMy41LTEuNTctMy41LTMuNXMxLjU3LTMuNSAzLjUtMy41IDMuNSAxLjU3IDMuNSAzLjUtMS41NyAzLjUtMy41IDMuNXonXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuY29uc3Qgc3R5bGUgPSB7XG4gIHdpZHRoOiAxNSxcbiAgaGVpZ2h0OiAxNSxcblxuICBib3JkZXI6ICd3aGl0ZSAycHggc29saWQnLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBPbmxpbmVTdGF0dXMoeyByZWFkeVN0YXRlIH0pIHtcbiAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICByZXR1cm4gPElzT25saW5lIC8+O1xuICB9IGVsc2UgaWYgKHJlYWR5U3RhdGUgPT09IDApIHtcbiAgICByZXR1cm4gPENvbm5lY3RpbmcgLz47XG4gIH0gZWxzZSBpZiAocmVhZHlTdGF0ZSA9PT0gMikge1xuICAgIHJldHVybiA8Q2xvc2luZyAvPjtcbiAgfVxuICByZXR1cm4gPElzT2ZmbGluZSAvPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzT25saW5lKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwib25saW5lXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc09mZmxpbmUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ3JlZCcgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwib2ZmbGluZVwiXG4gICAgPjwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29ubmVjdGluZygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJjb25uZWN0aW5nXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDbG9zaW5nKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdwaW5rJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJjbG9zaW5nXCJcbiAgICA+PC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FjdGlvblR5cGVzJztcbmV4cG9ydCBmdW5jdGlvbiBzYXZlUGVuZGluZ0hhbmdvdXQoeyBkaXNwYXRjaCwgbmFtZSwgaGFuZ291dCwgb25saW5lLGlzQmxvY2tlciB9KSB7XG5cbiAgY29uc3QgeyB1c2VybmFtZSwgbWVzc2FnZSwgc3RhdGUsIGVtYWlsIH0gPSBoYW5nb3V0O1xuICBsZXQgaGFuZ291dEtleSA9ICcnO1xuICBsZXQgbWVzc2FnZUtleSA9ICcnO1xuICBpZiAob25saW5lKSB7XG4gICAgaGFuZ291dEtleSA9IGAke25hbWV9LWhhbmdvdXRzYDtcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICB9IGVsc2Uge1xuICAgIGhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcbiAgICBtZXNzYWdlS2V5ID0gYCR7bmFtZX0tJHt1c2VybmFtZX0tb2ZmbGluZS1tZXNzYWdlc2A7XG4gIH1cblxuICBzYXZlSGFuZ291dCh7IGhhbmdvdXRLZXksIHVzZXJuYW1lLCBoYW5nb3V0LGRpc3BhdGNoIH0pO1xuICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnRleHQgIT09XCJcIikge1xuICAgIHNhdmVNZXNzYWdlKHsgbWVzc2FnZUtleSwgdXNlcm5hbWUsIG1lc3NhZ2UsZGlzcGF0Y2gsaXNCbG9ja2VyIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhdmVIYW5nb3V0KHsgaGFuZ291dEtleSwgdXNlcm5hbWUsIGhhbmdvdXQsZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaGFuZ291dEtleSkpO1xuICBsZXQgdXBkYXRlZEhhbmdvdXRzID0gbnVsbDtcbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgY29uc3QgaGFuZ291dEluZGV4ID0gaGFuZ291dHMuZmluZEluZGV4KChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG4gICAgdXBkYXRlZEhhbmdvdXRzID0gaGFuZ291dHMuc3BsaWNlKGhhbmdvdXRJbmRleCwgMSwgaGFuZ291dCk7XG4gIH0gZWxzZSB7XG4gICAgdXBkYXRlZEhhbmdvdXRzID0gW2hhbmdvdXRdO1xuICB9XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGhhbmdvdXRLZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0cykpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRTX1VQREFURUQsIGhhbmdvdXRzOiB1cGRhdGVkSGFuZ291dHMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZSh7IG1lc3NhZ2VLZXksIG1lc3NhZ2UsZGlzcGF0Y2gsaXNCbG9ja2VyIH0pIHtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG1lc3NhZ2VLZXkpKTtcbiAgbGV0IHVwZGF0ZWRNZXNzYWdlcyA9IFtdO1xuICBpZiAobWVzc2FnZXMpIHtcbiBcbiAgICB1cGRhdGVkTWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIG1lc3NhZ2VdO1xuICB9IGVsc2Uge1xuXG4gICAgdXBkYXRlZE1lc3NhZ2VzID0gW21lc3NhZ2VdO1xuICB9XG4gIGlmKGlzQmxvY2tlcil7XG4gXG4gICAgY29uc3QgYmxvY2tlciA9Wy4uLnVwZGF0ZWRNZXNzYWdlcyx7dGV4dDonWW91IGNhbiBub3Qgc2VuZCB0aGlzIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIGJsb2NrZWQuJ1xuICAgICx0aW1lc3RhbXA6IERhdGUubm93KCksdHlwZTonYmxvY2tlcicsdXNlcm5hbWU6bWVzc2FnZS51c2VybmFtZSxmbG9hdDoncmlnaHQnfV1cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShtZXNzYWdlS2V5LCBKU09OLnN0cmluZ2lmeShibG9ja2VyKSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogYmxvY2tlciB9KTtcbiAgXG4gIH1cbiAgZWxzZXtcbiAgXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obWVzc2FnZUtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1lc3NhZ2VzKSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFU19VUERBVEVELCBtZXNzYWdlczogdXBkYXRlZE1lc3NhZ2VzIH0pO1xuICB9XG4gXG5cbn1cbiIsImltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnLi4vLi4vY2xpZW50Q29tbWFuZHMnO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBkaXNwYXRjaCwgc29ja2V0LCBuYW1lIH0pIHtcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRLZXkgPSBgJHtuYW1lfS1vZmZsaW5lLWhhbmdvdXRzYDtcbiAgY29uc3Qgb2ZmbGluZUhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShvZmZsaW5lSGFuZ291dEtleSkpO1xuICBpZiAob2ZmbGluZUhhbmdvdXRzKSB7XG4gICAgb2ZmbGluZUhhbmdvdXRzLmZvcmVFYWNoKChoKSA9PiB7XG4gICAgICBzb2NrZXQuc2VuZChcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHVzZXJuYW1lOiBoLnVzZXJuYW1lLFxuICAgICAgICAgIGVtYWlsOiBoLmVtYWlsLFxuICAgICAgICAgIG1lc3NhZ2U6IGgubWVzc2FnZSxcbiAgICAgICAgICB0aW1lc3RhbXA6IGgudGltZXN0YW1wLFxuICAgICAgICAgIGNvbW1hbmQ6IGguc3RhdGUsXG4gICAgICAgICAgb2ZmbGluZTogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgeyB1c2VBcHBSb3V0ZSB9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcbmltcG9ydCB7IHVwZGF0ZUxvY2FsSGFuZ291dHMgfSBmcm9tICcuL3VwZGF0ZUxvY2FsSGFuZ291dHMnO1xuaW1wb3J0IHsgc2F2ZVBlbmRpbmdIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zL2RlbGl2ZXJpbmctYWN0aW9ucy9zYXZlUGVuZGluZ0hhbmdvdXQnO1xuaW1wb3J0IHtcbiAgc2VsZWN0SGFuZ291dCxcbiAgc2VsZWN0VW5yZWFkLFxuICBzZWFyY2hIYW5nb3V0cyxcbiAgZmlsdGVySGFuZ291dHMsXG4gIGZldGNoSGFuZ291dCxcbiAgY2hhbmdlTWVzc2FnZVRleHQsXG5cbiAgc3RhcnRDbGllbnRDb21tYW5kLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgc2VuZE9mZmxpbmVIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucy9kZWxpdmVyaW5nLWFjdGlvbnMvc2VuZE9mZmxpbmVIYW5nb3V0cyc7XG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4uLy4uL2FwcC1yb3V0ZS9hY3Rpb25UeXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcbiAgY29uc3QgeyBvbkFwcFJvdXRlIH0gPSB1c2VBcHBSb3V0ZSgpO1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHNlYXJjaCxcbiAgICB1c2VycyxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlcyxcbiAgICBzb2NrZXRNZXNzYWdlLFxuICAgIHJlYWR5U3RhdGUsXG4gICAgc29ja2V0LFxuICAgIHVucmVhZGhhbmdvdXRzLFxuICB9ID0gc3RhdGU7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc29ja2V0ICYmIHJlYWR5U3RhdGUgPT09IDEgJiYgdXNlcm5hbWUpIHtcbiAgICAgIHNlbmRPZmZsaW5lSGFuZ291dHMoeyBuYW1lOiB1c2VybmFtZSwgZGlzcGF0Y2gsIHNvY2tldCB9KTtcbiAgICB9XG4gIH0sIFtzb2NrZXQsIHJlYWR5U3RhdGUsIHVzZXJuYW1lXSk7XG5cbiAgZnVuY3Rpb24gb25OYXZpZ2F0aW9uKGUpe1xuICAgIGNvbnN0IGlkID1lLnRhcmdldC5pZFxuICAgXG4gICAgb25BcHBSb3V0ZSh7IGZlYXR1cmVSb3V0ZTogYC8ke2lkfWAsIHJvdXRlOiAnL2hhbmdvdXRzJyB9KTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25TZWxlY3RVbnJlYWQoZSkge1xuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgc2VsZWN0VW5yZWFkKHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xuICAgIGNvbnN0IGhhbmdvdXQgPSBoYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG5cbiAgICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOiBgLyR7aGFuZ291dC5zdGF0ZX1gLCByb3V0ZTogJy9oYW5nb3V0cycgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XG4gICAgc2VhcmNoSGFuZ291dHMoeyBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlLCBkaXNwYXRjaCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU3RhcnRTZWFyY2goZSkge1xuICAgIGlmIChoYW5nb3V0cyAmJiBoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgICBmZXRjaEhhbmdvdXQoeyBkaXNwYXRjaCwgc2VhcmNoLCB1c2VybmFtZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcbiAgICBjb25zdCB0ZXh0ID0gZS50YXJnZXQudmFsdWU7XG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkhhbmdvdXQoZSkge1xuICAgXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0OiAnJywgZGlzcGF0Y2ggfSk7XG4gICAgY29uc3QgY29tbWFuZCA9IGUudGFyZ2V0LmlkO1xuICAgIGNvbnN0IHsgZW1haWwgfSA9IGhhbmdvdXQ7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgIG1lc3NhZ2VUZXh0ICE9PSAnJyA/IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcCB9IDogbnVsbDtcblxuICAgIGNvbnN0IG9ubGluZSA9IHRydWU7XG4gICAgbGV0IGlzQmxvY2tlciA9ZmFsc2VcbiAgICBpZiAoc29ja2V0ICYmIHJlYWR5U3RhdGUgPT09IDEpIHtcbiAgIFxuICAgICAgaWYoaGFuZ291dC5zdGF0ZSA9PT0nQkxPQ0tFUicpe1xuICAgICAgIFxuICAgICAgICBpc0Jsb2NrZXI9dHJ1ZVxuICAgICAgfWVsc2V7XG4gICAgICAgXG4gICAgICAgIHNvY2tldC5zZW5kKFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLFxuICAgICAgICAgICAgZW1haWwsXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgY29tbWFuZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgXG4gICAgICB9XG4gICAgXG4gICAgfSBlbHNlIHtcbiAgICAgIG9ubGluZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHNhdmVQZW5kaW5nSGFuZ291dCh7XG4gICAgICBkaXNwYXRjaCxcbiAgICAgIG5hbWU6IHVzZXJuYW1lLFxuICAgICAgaGFuZ291dDoge1xuICAgICAgICB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSxcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHN0YXRlOiBjb21tYW5kLFxuICAgICAgICBtZXNzYWdlOiB7IHRleHQ6IG1lc3NhZ2VUZXh0LCB0aW1lc3RhbXAsIGRlbGl2ZXJlZDogZmFsc2UsIHVzZXJuYW1lIH0sXG4gICAgICAgIHRpbWVzdGFtcCxcbiAgICAgICAgZGVsaXZlcmVkOiBmYWxzZSxcbiAgICAgICAgXG4gICAgICB9LFxuICAgICAgb25saW5lLFxuICAgICAgaXNCbG9ja2VyXG4gICAgfSk7XG5cbiAgIFxuXG5cbiAgfS8vZW5kIG9uSGFuZ291dFxuICByZXR1cm4ge1xuICAgIG9uTmF2aWdhdGlvbixcbiAgICBvblNlbGVjdFVucmVhZCxcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25TZWFyY2gsXG4gICAgc2VhcmNoLFxuICAgIG9uU2VsZWN0SGFuZ291dCxcbiAgICBkaXNwYXRjaCxcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICAgIG1lc3NhZ2VzLFxuICAgIG9uSGFuZ291dCxcbiAgICB1bnJlYWRoYW5nb3V0cyxcbiAgICByZWFkeVN0YXRlLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyBOYXZJdGVtIH0gZnJvbSAnLi4vLi4vbmF2L05hdkl0ZW0nO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9NZXNzYWdlJztcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSAnLi4vLi4vbGF5b3V0L2ljb25zL1NldHTEsW5ncyc7XG5pbXBvcnQgeyBPbmxpbmVTdGF0dXMgfSBmcm9tICcuLi8uLi9sYXlvdXQvaWNvbnMvb25saW5lU3RhdHVzJztcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi4vc3RhdGUvdXNlSGFuZ291dHMnO1xuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tICcuLi8uLi9hdXRoL3VzZVVzZXJOYW1lJztcbmltcG9ydCB7IHVzZUFwcFJvdXRlIH0gZnJvbSAnLi4vLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dFRvcE1lbnUoKSB7XG4gIGNvbnN0IHsgb25BcHBSb3V0ZSB9ID0gdXNlQXBwUm91dGUoKTtcbiAgY29uc3QgeyB1c2VyTmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcbiAgY29uc3QgeyByZWFkeVN0YXRlLCB1bnJlYWRoYW5nb3V0cywgb25OYXZpZ2F0aW9uLCBoYW5nb3V0IH0gPSB1c2VIYW5nb3V0cygpO1xuXG4gIGZ1bmN0aW9uIG5hdlRvVW5yZWFkKCkge1xuICAgIG9uQXBwUm91dGUoeyBmZWF0dXJlUm91dGU6ICcvVU5SRUFEJywgcm91dGU6ICcvaGFuZ291dHMnIH0pO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0+XG4gICAgICA8TmF2SXRlbT57dXNlck5hbWV9PC9OYXZJdGVtPlxuICAgICAgPE5hdkl0ZW0+XG4gICAgICAgIDxPbmxpbmVTdGF0dXMgcmVhZHlTdGF0ZT17cmVhZHlTdGF0ZX0gLz5cbiAgICAgIDwvTmF2SXRlbT5cbiAgICAgIDxOYXZJdGVtIG9uQ2xpY2s9e25hdlRvVW5yZWFkfSBkYXRhLXRlc3RpZD1cIm5hdi11bnJlYWRzXCI+XG4gICAgICAgIHt1bnJlYWRoYW5nb3V0cyAmJiA8TWVzc2FnZSBjb3VudD17dW5yZWFkaGFuZ291dHMubGVuZ3RofSAvPn17JyAnfVxuICAgICAgPC9OYXZJdGVtPlxuICAgICAge2hhbmdvdXQgJiYgKFxuICAgICAgICA8TmF2SXRlbSBpZD1cImNvbmZpZ3VyZVwiIGRhdGEtdGVzdGlkPVwibmF2LWNvbmZpZ1wiPlxuICAgICAgICAgIDxTZXR0aW5nc1xuICAgICAgICAgICAgaWQ9XCJjb25maWd1cmVcIlxuICAgICAgICAgICAgZmlsbD1cIndoaXRlXCJcbiAgICAgICAgICAgIHdpZHRoPVwiMzBcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiMzBcIlxuICAgICAgICAgICAgb25DbGljaz17b25OYXZpZ2F0aW9ufVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTmF2SXRlbT5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJleHBvcnQgY29uc3QgZHJhd2VyID0ge1xyXG4gIGJveFNoYWRvdzogYDBweCAzcHggM3B4IC0ycHggcmdiYSgwLCAwLCAwLCAwLjIpLDBweCAzcHggNHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTQpLCAwcHggMXB4IDhweCAwcHggcmdiYSgwLCAwLCAwLCAwLjEyKWAsXHJcblxyXG4gIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gIGxlZnQ6IDAsXHJcbiAgdG9wOiAwLFxyXG4gIHpJbmRleDogMTAsXHJcbiAgaGVpZ2h0OiAnMTAwdmgnLFxyXG4gIGJhY2tncm91bmRDb2xvcjogJyNmNWY1ZjUnLFxyXG59O1xyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCBkZXZpY2VUeXBlIGZyb20gJy4vZGV2aWNlVHlwZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpIHtcclxuICBjb25zdCBbd2lkdGgsIHNldFdpZHRoXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbb3JpZW50YXRpb24sIHNldE9yaWVudGF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGV2aWNlLCBzZXREZXZpY2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGZ1bmN0aW9uIGhhbmRsZVZpZXdwb3J0U2l6ZSgpIHtcclxuICAgXHJcbiAgICAgIHNldFdpZHRoKHdpbmRvdy5pbm5lcldpZHRoKTtcclxuICAgICAgc2V0SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKCkge1xyXG4gICAgc2V0T3JpZW50YXRpb24od2luZG93LnNjcmVlbi5vcmllbnRhdGlvbik7XHJcbiAgfVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCdwaG9uZScpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA3Njg6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSA5OTI6XHJcbiAgICAgICAgY2FzZSB3aWR0aCA8PSAxMjAwOlxyXG4gICAgICAgICAgc2V0RGV2aWNlKCd0YWJsZXQnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnbGFwdG9wJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoID4gMjU2MDpcclxuICAgICAgICAgIHNldERldmljZSgnZGVza3RvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHNldERldmljZSgnJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCBbd2lkdGhdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkZXZpY2UnLCBkZXZpY2UpO1xyXG4gIH0sIFtkZXZpY2VdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaGFuZGxlVmlld3BvcnRTaXplKCk7XHJcbiAgICBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhbmRsZVZpZXdwb3J0U2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgLy8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlU2NyZWVuT3JpZW50YXRpb24pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgZHJhd2VyIH0gZnJvbSAnLi9zdHlsZSc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRpb24gfSBmcm9tICcuL05hdlByb3ZpZGVyJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRHJhd2VyKHByb3BzKSB7XHJcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgY29uc3QgeyBvcGVuLCBvbkNsaWNrLCBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgY29uc3QgeyBkcmF3ZXJPcGVuLCB0b2dnbGVEcmF3ZXIgfSA9IHVzZU5hdmlnYXRpb24oKTtcclxuXHJcbiAgaWYgKGRyYXdlck9wZW4pXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3sgLi4uZHJhd2VyIH19XHJcbiAgICAgICAgY2xhc3NOYW1lPXtgZHJhd2VyLSR7ZGV2aWNlfS13aWR0aGB9XHJcbiAgICAgICAgb25DbGljaz17dG9nZ2xlRHJhd2VyfVxyXG4gICAgICA+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gQXBwQmFyKHsgY2hpbGRyZW4gfSkge1xyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICAuLi50aGVtZS5wcmltYXJ5LFxyXG4gICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAvLyBsZWZ0OiAwLFxyXG4gICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgbWluSGVpZ2h0OiA2NCxcclxuICAgICAgIC8vIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgIC8vIHBhZGRpbmdSaWdodDogMTYsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICBkaXNwbGF5OidmbGV4J1xyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmltcG9ydCAnLi4vY3NzL3N0eWxlLmNzcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBNZW51V2hpdGUoeyBvbkNsaWNrLCBpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBjbGFzc05hbWU9XCJtZW51LXdoaXRlXCJcclxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgIGZpbGw9XCJ3aGl0ZVwiXHJcbiAgICAgIHdpZHRoPVwiMjRweFwiXHJcbiAgICAgIGhlaWdodD1cIjI0cHhcIlxyXG4gICAgPlxyXG4gICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPHBhdGggZD1cIk0zIDE4aDE4di0ySDN2MnptMC01aDE4di0ySDN2MnptMC03djJoMThWNkgzelwiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlTmF2aWdhdGlvbiB9IGZyb20gJy4vTmF2UHJvdmlkZXInO1xuaW1wb3J0IHsgTWVudVdoaXRlIH0gZnJvbSAnLi9pY29ucy9NZW51V2hpdGUnO1xuZXhwb3J0IGZ1bmN0aW9uIE1lbnUoKSB7XG4gIGNvbnN0IHsgZHJhd2VyT3BlbiwgdG9nZ2xlRHJhd2VyIH0gPSB1c2VOYXZpZ2F0aW9uKCk7XG5cbiAgcmV0dXJuIDxNZW51V2hpdGUgb25DbGljaz17dG9nZ2xlRHJhd2VyfSBpZD1cIm1lbnVcIiAvPjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHt1c2VFZmZlY3R9IGZyb20gJ3ByZWFjdC9ob29rcydcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5pbXBvcnQgeyBOYXZJdGVtIH0gZnJvbSAnLi4vbmF2L05hdkl0ZW0nO1xuaW1wb3J0IHsgRHJhd2VyQ29udGVudCB9IGZyb20gJy4uL2xheW91dC9EcmF3ZXJDb250ZW50JztcbmltcG9ydCB7IEF1dGhEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vYXV0aC9BdXRoRHJhd2VyQ29udGVudCc7XG5pbXBvcnQgeyBIYW5nb3V0RHJhd2VyQ29udGVudCB9IGZyb20gJy4uL2hhbmdvdXRzL25hdi9IYW5nb3V0RHJhd2VyQ29udGVudCc7XG5pbXBvcnQgeyBIYW5nb3V0VG9wTWVudSB9IGZyb20gJy4uL2hhbmdvdXRzL25hdi9IYW5nb3V0VG9wTWVudSc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IHJlY292ZXJMb2NhbEF1dGhTdGF0ZSB9IGZyb20gJy4uL2F1dGgvYWN0aW9ucyc7XG5pbXBvcnQgRHJhd2VyIGZyb20gJy4uL25hdi9EcmF3ZXInO1xuaW1wb3J0IHsgQXBwQmFyIH0gZnJvbSAnLi4vbmF2L0FwcEJhcic7XG5pbXBvcnQgeyBNZW51IH0gZnJvbSAnLi4vbmF2L01lbnUnO1xuZXhwb3J0IGZ1bmN0aW9uIEFwcE5hdmlnYXRpb24oKSB7XG4gICAgY29uc3QgeyBkaXNwYXRjaCB9ID0gdXNlQXV0aENvbnRleHQoKTtcblxuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKSkge1xuICAgICAgICAgIHJlY292ZXJMb2NhbEF1dGhTdGF0ZSh7XG4gICAgICAgICAgICBkaXNwYXRjaCxcbiAgICAgICAgICAgIHVzZXI6IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwgW10pO1xuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8QXBwQmFyPlxuICAgICAgICA8TWVudSAvPlxuICAgICAgICA8TmF2SXRlbSBzdHlsZT17eyBmbGV4OiA1IH19PldFQiBDT008L05hdkl0ZW0+XG4gICAgICAgIDxIYW5nb3V0VG9wTWVudSAvPlxuICAgICAgPC9BcHBCYXI+XG4gICAgICA8RHJhd2VyPlxuICAgICAgICA8QXV0aERyYXdlckNvbnRlbnQgLz5cbiAgICAgICAgPEhhbmdvdXREcmF3ZXJDb250ZW50IC8+XG4gICAgICA8L0RyYXdlcj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhvbWUoKSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9J2hvbWUnIHN0eWxlPXt7cGFkZGluZ1RvcDo2OH19PkhvbWU8L2Rpdj47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcblxyXG5pbXBvcnQge0ZlYXR1cmVSb3V0ZX0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInXHJcbmNvbnN0IExvZ2luID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvTG9naW4nKSk7XHJcbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvQ2hhbmdlUGFzc3dvcmQnKSk7XHJcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvRm9yZ290UGFzc3dvcmQnKSk7XHJcbmNvbnN0IFNpZ251cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL1NpZ251cCcpKTtcclxuY29uc3QgUHJvZmlsZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL1Byb2ZpbGUnKSk7XHJcbmNvbnN0IEF1dGhGZWVkYmFjayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL0F1dGhGZWVkYmFjaycpKTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aGVudGljYXRpb24oeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nVG9wOjY4fX0+XHJcbiAgICAgIDxGZWF0dXJlUm91dGUgcGF0aD0nL2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvbG9naW4nPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxMb2dpbiAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG5cclxuICAgICAgPEZlYXR1cmVSb3V0ZSBwYXRoPScvc2lnbnVwJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8U2lnbnVwIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9mb3Jnb3RwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9GZWF0dXJlUm91dGU+XHJcblxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9wcm9maWxlJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8UHJvZmlsZSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvRmVhdHVyZVJvdXRlPlxyXG4gICAgICA8RmVhdHVyZVJvdXRlIHBhdGg9Jy9hdXRoZmVlZGJhY2snPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxBdXRoRmVlZGJhY2sgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0ZlYXR1cmVSb3V0ZT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlIGZyb20gJy4vdmFsaWRhdGlvblN0YXRlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0geyB2YWxpZGF0aW9uOiB7fSB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuXHJcbiAgbGV0IG5leHRTdGF0ZSA9IG51bGw7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IGFjdGlvbi52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFjdGlvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xJRU5UX1ZBTElEQVRJT046XHJcbiAgICAgIG5leHRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG5cclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVTRVRfVkFMSURBVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5QVVRfRk9DVVNFRDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZS52YWxpZGF0aW9uLFxyXG4gICAgICAgICAgZm9ybVN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5BQ1RJVkUsXHJcbiAgICAgICAgICBbYWN0aW9uLnByb3BOYW1lXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE46XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL2Zvcm1SZWR1Y2VyJztcclxuY29uc3QgRm9ybUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9ybUNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRm9ybUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VGb3JtQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBGb3JtUHJvdmlkZXInKTtcclxuICB9XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4geyBzdGF0ZSwgZGlzcGF0Y2ggfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1Qcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihmb3JtUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8Rm9ybUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCB7IEFwcFJvdXRlIH0gZnJvbSAnLi4vYXBwLXJvdXRlL0FwcFJvdXRlUHJvdmlkZXInO1xuaW1wb3J0IHsgSG9tZSB9IGZyb20gJy4vSG9tZSc7XG5pbXBvcnQgQXV0aGVudGljYXRpb24gZnJvbSAnLi4vYXV0aC9BdXRoZW50aWNhdGlvbic7XG5pbXBvcnQgeyBGb3JtUHJvdmlkZXIgfSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCc7XG5jb25zdCBIYW5nb3V0cyA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9oYW5nb3V0cycpKTtcbmNvbnN0IEdyb3VwID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2dyb3VwL2dyb3VwJykpO1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGVzKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3toZWlnaHQ6JzEwMCUnfX0+XG4gICAgICA8QXBwUm91dGUgcGF0aD1cIi9hdXRoXCI+XG4gICAgICAgIDxGb3JtUHJvdmlkZXI+XG4gICAgICAgICAgPEF1dGhlbnRpY2F0aW9uIC8+XG4gICAgICAgIDwvRm9ybVByb3ZpZGVyPlxuICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL1wiPlxuICAgICAgICA8SG9tZSAvPlxuICAgICAgPC9BcHBSb3V0ZT5cblxuICAgICAgPEFwcFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nb3V0cyAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgIDxBcHBSb3V0ZSBwYXRoPVwiL2dyb3VwXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8R3JvdXAgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvQXBwUm91dGU+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5cbmltcG9ydCB7QXBwTmF2aWdhdGlvbn0gZnJvbSAnLi9BcHBOYXZpZ2F0aW9uJ1xuaW1wb3J0IHtBcHBSb3V0ZXN9IGZyb20gJy4vQXBwUm91dGVzJ1xuaW1wb3J0ICcuL2FwcC5jc3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMTAwdmgnIH19PlxuICAgICA8QXBwTmF2aWdhdGlvbi8+XG4gICAgICA8QXBwUm91dGVzLz5cbiAgICAgIHsnJ31cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgQXBwUm91dGVQcm92aWRlciB9IGZyb20gJy4uL2FwcC1yb3V0ZS9BcHBSb3V0ZVByb3ZpZGVyJztcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJztcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcbmltcG9ydCB7IE5hdlByb3ZpZGVyIH0gZnJvbSAnLi4vbmF2L05hdlByb3ZpZGVyJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcbmV4cG9ydCBmdW5jdGlvbiBBcHBQcm92aWRlcnMoeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiAoXG4gICAgPFRoZW1lUHJvdmlkZXJcbiAgICAgIGluaXRTdGF0ZT17e1xuICAgICAgICBwcmltYXJ5OiB7XG4gICAgICAgICAgYmFja2dyb3VuZDogJyM2MjAwRUUnLFxuICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgSGVsdmV0aWNhLCBcIkFyaWFsXCInLFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8QXBwUm91dGVQcm92aWRlclxuICAgICAgICB0aXRsZT1cIldlYmNvbVwiXG4gICAgICAgIGluaXRTdGF0ZT17eyByb3V0ZTogJy8nLCBmZWF0dXJlUm91dGU6ICcvaGFuZ291dHMnIH19XG4gICAgICA+XG4gICAgICAgIDxBdXRoUHJvdmlkZXI+XG4gICAgICAgICAgPE5hdlByb3ZpZGVyPlxuICAgICAgICAgICAgPEhhbmdvdXRzUHJvdmlkZXIgc29ja2V0VXJsPXtgd3NzOi8vJHtpcH06MzAwMC9oYW5nb3V0c2B9PlxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XG4gICAgICAgICAgPC9OYXZQcm92aWRlcj5cbiAgICAgICAgPC9BdXRoUHJvdmlkZXI+XG4gICAgICA8L0FwcFJvdXRlUHJvdmlkZXI+XG4gICAgPC9UaGVtZVByb3ZpZGVyPlxuICApO1xufVxuIiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlcnMgfSBmcm9tICcuL0FwcFByb3ZpZGVycyc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxucmVuZGVyKFxyXG4gIDxBcHBQcm92aWRlcnM+XHJcbiAgICA8QXBwIC8+XHJcbiAgPC9BcHBQcm92aWRlcnM+LFxyXG5cclxuICBkb2N1bWVudC5ib2R5XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJmZXRjaCIsInQiLCJ1IiwiciIsImkiLCJvIiwiYyIsImYiLCJlIiwiYSIsInYiLCJtIiwiRSIsIngiLCJkIiwiaCIsInciLCJfIiwiZyIsImFjdGlvblR5cGVzIiwiQVBQX1JPVVRFX0NIQU5HRUQiLCJGRUFUVVJFX1JPVVRFX0NIQU5HRUQiLCJyZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwicm91dGUiLCJmZWF0dXJlUm91dGUiLCJBcHBSb3V0ZUNvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlQXBwUm91dGVDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkZlYXR1cmVSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJkaXNwYXRjaCIsImZpbmQiLCJwIiwidXNlQXBwUm91dGUiLCJvbkFwcFJvdXRlIiwiQXBwUm91dGUiLCJBcHBSb3V0ZVByb3ZpZGVyIiwiaW5pdFN0YXRlIiwidXNlUmVkdWNlciIsInZhbHVlIiwidXNlTWVtbyIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURFRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiRkVUQ0hfSEFOR09VVF9TVEFSVEVEIiwiRkVUQ0hfSEFOR09VVF9TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVF9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIlNPQ0tFVF9NRVNTQUdFX1JFQ0lFVkVEIiwiTUVTU0FHRVNfVVBEQVRFRCIsIkhBTkdPVVRTX1VQREFURUQiLCJIQU5HT1VUX1VQREFURUQiLCJVTlJFQURfSEFOR09VVFNfVVBEQVRFRCIsIkNPTk5FQ1RJTkciLCJPUEVOIiwiQ0xPU0lORyIsIkNMT1NFRCIsIlNPQ0tFVF9SRUFEWSIsIlNPQ0tFVF9FUlJPUiIsImhhbmdvdXRzIiwiaGFuZ291dCIsInVucmVhZGhhbmdvdXRzIiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJzb2NrZXQiLCJyZWFkeVN0YXRlIiwic29ja2V0TWVzc2FnZSIsInRleHQiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIkZJTFRFUl9IQU5HT1VUUyIsImZpbHRlciIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJsb2FkSGFuZ291dHMiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2VsZWN0SGFuZ291dCIsInNlbGVjdFVucmVhZCIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsIm9rIiwianNvbiIsImNoYW5nZU1lc3NhZ2VUZXh0IiwibG9hZE1lc3NhZ2VzIiwia2V5IiwiaGFuZ291dFN0YXRlcyIsIklOVklURVIiLCJBQ0NFUFRFUiIsIkRFQ0xJTkVSIiwiQkxPQ0tFUiIsIlVOQkxPQ0tFUiIsIk1FU1NBTkdFUiIsIklOVklURUQiLCJBQ0NFUFRFRCIsIkRFQ0xJTkVEIiwiQkxPQ0tFRCIsIlVOQkxPQ0tFRCIsIk1FU1NBR0VEIiwidXBkYXRlRGVsaXZlcmVkSGFuZ291dCIsIm5hbWUiLCJvZmZsaW5lIiwibWVzc2FnZSIsInRpbWVzdGFtcCIsImRlbGl2ZXJlZEhhbmdvdXQiLCJkZWxpdmVyZWQiLCJoYW5nb3V0S2V5IiwiaGFuZ291dEluZGV4IiwiZmluZEluZGV4IiwidXBkYXRlZEhhbmdvdXRzIiwic3BsaWNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInVwZGF0ZURlbGl2ZXJlZE1lc3NhZ2UiLCJ1cGRhdGVCb2NrZWRTdGF0ZSIsIm9mZmxpbmVIYW5nb3V0S2V5Iiwib2ZmbGluZWhhbmdvdXRzIiwiZGVsaXZlcmVkTWVzc2FnZSIsIm1lc3NhZ2VLZXkiLCJibG9ja2VkTWVzc2FnZSIsInNhdmVNZXNzYWdlZCIsInNhdmVJbnZpdGVkIiwic2F2ZUFjY2VwdGVkIiwic2F2ZURlY2xpbmVkIiwic2F2ZUJsb2NrZWQiLCJzYXZlVW5ibG92a2VkIiwic2F2ZVJlY2lldmVkSGFuZ291dCIsImZvY3VzZWRIYW5nb3V0IiwidW5yZWFkIiwicmVhZCIsInNhdmVSZWNpZXZlZE1lc3NhZ2UiLCJzYXZlVW5yZWFkSGFuZ291dCIsInVwZGF0ZWRNZXNzYWdlcyIsInVucmVhZGhhbmdvdXRzS2V5IiwidXBkYXRlZHVucmVhZHMiLCJzYXZlSW52aXRlciIsInNhdmVBY2NlcHRlciIsInNhdmVCbG9ja2VyIiwic2F2ZURlY2xpbmVyIiwic2F2ZU1lc3NhbmdlciIsInNhdmVVbmJsb2NrZXIiLCJ1c2VTb2NrZXRNZXNzYWdlIiwiaGFuZGxlQWNrbm93bGVkZ2VtZW50IiwiaGFuZGxlSGFuZ291dCIsImhhbmRsZUhhbmdvdXRzIiwiZm9yRWFjaCIsInVzZUVmZmVjdCIsIlZBTFVFX0NIQU5HRUQiLCJMT0dJTl9TVEFSVEVEIiwiTE9HSU5fU1VDQ0VTUyIsIkxPR0lOX0ZBSUxFRCIsIkxPR09VVF9TVEFSVEVEIiwiTE9HT1VUX0ZBSUxFRCIsIkxPR09VVF9TVUNDRVNTIiwiU0lHTlVQX1NUQVJURUQiLCJTSUdOVVBfU1VDQ0VTUyIsIlNJR05VUF9GQUlMRUQiLCJDSEFOR0VfUEFTU1dPUkRfU1RBUlRFRCIsIkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTIiwiQ0hBTkdFX1BBU1NXT1JEX0ZBSUxFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1RBUlRFRCIsIlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUyIsIlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEIiwiR09UX1RPS0VOX0ZST01fVVJMIiwiUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFIiwiZW1haWwiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJjb25maXJtIiwiY3VycmVudCIsImVtYWlsb3J1c2VybmFtZSIsInRva2VuIiwiaXNMb2dnZWRJbiIsImlzUGFzc3dvcmRDaGFuZ2VkIiwiYXV0aEZlZWRiYWNrIiwiYXV0aFJlZHVjZXIiLCJuZXh0U3RhdGUiLCJwYXlsb2FkIiwicHJvcE5hbWUiLCJzdWNjZXNzTWVzc2FnZSIsIkF1dGhSb3V0ZUNvbnRleHQiLCJBdXRoUm91dGVQcm92aWRlciIsImluaXRpYWxSb3V0ZSIsImF1dGhSb3V0ZSIsInNldEF1dGhSb3V0ZSIsInVzZVN0YXRlIiwiQXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsIkF1dGhQcm92aWRlciIsInVzZVdlYlNvY2tldCIsInNvY2tldFVybCIsInNvY2siLCJXZWJTb2NrZXQiLCJvbm1lc3NhZ2UiLCJtc2ciLCJkYXRhIiwib25vcGVuIiwib25jbG9zZSIsIm9uZXJyb3IiLCJIYW5nb3V0Q29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiSGFuZ291dHNQcm92aWRlciIsImF1dGhDb250ZXh0Iiwid2Vic29ja2V0SGFuZGxlciIsImhhbmRsZVVzZVNvY2tldE1lc3NhZ2UiLCJoYW5nb3V0RXhpc3QiLCJ1cGRhdGVkIiwibWFwIiwiVGhlbWVDb250ZXh0IiwidXNlVGhlbWVDb250ZXh0IiwiVGhlbWVQcm92aWRlciIsInNldFN0YXRlIiwiTmF2Q29udGV4dCIsInVzZU5hdkNvbnRleHQiLCJ1c2VOYXZpZ2F0aW9uIiwiZHJhd2VyT3BlbiIsInNldERyYXdlck9wZW4iLCJ0b2dnbGVEcmF3ZXIiLCJwcmV2IiwiTmF2UHJvdmlkZXIiLCJsIiwiTiIsIk0iLCJzIiwiUCIsImoiLCJIIiwiVCIsIiQiLCJxIiwiTmF2SXRlbSIsIkxpc3QiLCJpZCIsImJveFNpemluZyIsImJhY2tncm91bmRDb2xvciIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwid2lkdGgiLCJMaXN0SXRlbSIsIm9uQ2xpY2siLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsImRpc3BsYXkiLCJWQUxJRCIsIklOVkFMSUQiLCJJTkFDVElWRSIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiSU5WQUxJRF9QQVNTV09SRCIsIklOVkFMSURfRU1BSUwiLCJJTlZBTElEX1VTRVJOQU1FIiwiSU5WQUxJRF9FTVBUWV9TVFJJTkciLCJJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMIiwiUEFTU1dPUkRTX0RPX05PVF9NQVRDSCIsInBhc3N3b3JkUmVnZXgiLCJlbWFpbFJlZ2V4IiwidXNlcm5hbWVSZWdleCIsInZhbGlkYXRlRW1haWxDb25zdHJhaW50IiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblR5cGVzIiwidmFsaWRhdGlvblN0YXRlIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwiaXNDbGllbnRWYWxpZGF0aW9uVHlwZSIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSIsInZhbGlkYXRlRW1wdHlTdHJpbmciLCJsZW5ndGgiLCJ2YWxpZGF0ZVBhc3N3b3JkTWF0Y2giLCJhdXRoIiwiSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUiLCJSRVNFVF9WQUxJREFUSU9OX1NUQVRFIiwiSU5QVVRfQkxVUlJFRCIsIklOUFVUX0ZPQ1VTRUQiLCJTRVJWRVJfVkFMSURBVElPTiIsIkNMSUVOVF9WQUxJREFUSU9OIiwiSU5DX0lOUFVUX0NPVVROIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwidmFsaWRhdGlvbiIsImNvbnN0VmFsVHlwZXMiLCJ2YWxpZGF0aW9ucyIsInJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUiLCJzZXJ2ZXJWYWxpZGF0aW9uIiwiaHR0cFN0YXR1cyIsInZhbGlkYXRpb25TdGF0ZXMiLCJ2YWx1ZUNoYW5nZWQiLCJsb2dpbiIsImZvcm1EaXNwYXRjaCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYnRvYSIsIm1ldGhvZCIsInJlc3VsdCIsIndpbmRvdyIsImVycm9ycyIsInNpZ251cCIsImJvZHkiLCJDb250ZW50VHlwZSIsIkFjY2VwdCIsImxvZ291dCIsInJlbW92ZUl0ZW0iLCJjaGFuZ2VQYXNzd29yZCIsImFwaV91cmwiLCJmb3Jnb3RQYXNzd29yZCIsImdldFRva2VuRnJvbVVybCIsInJlY292ZXJMb2NhbEF1dGhTdGF0ZSIsInN0eWxlIiwiZ3JpZCIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJqdXN0aWZ5SXRlbXMiLCJwYWRkaW5nIiwiQXV0aERyYXdlckNvbnRlbnQiLCJoYW5kbGVSb3V0ZSIsInByZXZlbnREZWZhdWx0IiwidGFyZ2V0IiwiaGVpZ2h0IiwiQXV0aGVkU3RhdGUiLCJ1c2VyTmFtZSIsImhhbmRsZUxvZ091dCIsImFsaWduSXRlbXMiLCJmbGV4RGlyZWN0aW9uIiwidXNlckljb24iLCJtYXJnaW5Cb3R0b20iLCJVbkF1dGhlZFN0YXRlIiwidXNlVXNlck5hbWUiLCJzZXRVc2VybmFtZSIsInNldFRva2VuIiwic2V0RW1haWwiLCJIYW5nb3V0RHJhd2VyQ29udGVudCIsImNvdW50IiwiY29sb3IiLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJqdXN0aWZ5Q29udGVudCIsIk1lc3NhZ2UiLCJTZXR0aW5ncyIsImZpbGwiLCJib3JkZXIiLCJPbmxpbmVTdGF0dXMiLCJJc09ubGluZSIsIklzT2ZmbGluZSIsIkNvbm5lY3RpbmciLCJDbG9zaW5nIiwic2F2ZVBlbmRpbmdIYW5nb3V0IiwiaXNCbG9ja2VyIiwic2F2ZUhhbmdvdXQiLCJzYXZlTWVzc2FnZSIsImJsb2NrZXIiLCJEYXRlIiwibm93IiwiZmxvYXQiLCJzZW5kT2ZmbGluZUhhbmdvdXRzIiwib2ZmbGluZUhhbmdvdXRzIiwiZm9yZUVhY2giLCJzZW5kIiwiY29tbWFuZCIsInVzZUhhbmdvdXRzIiwidXNlcnMiLCJvbk5hdmlnYXRpb24iLCJvblNlbGVjdEhhbmdvdXQiLCJvblNlbGVjdFVucmVhZCIsIm9uU2VhcmNoIiwib25TdGFydFNlYXJjaCIsIm9uTWVzc2FnZVRleHQiLCJvbkhhbmdvdXQiLCJIYW5nb3V0VG9wTWVudSIsIm5hdlRvVW5yZWFkIiwiZHJhd2VyIiwiYm94U2hhZG93IiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwiekluZGV4IiwidXNlTWVkaWFRdWVyeSIsInNldFdpZHRoIiwic2V0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzZXRPcmllbnRhdGlvbiIsImRldmljZSIsInNldERldmljZSIsImhhbmRsZVZpZXdwb3J0U2l6ZSIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImhhbmRsZVNjcmVlbk9yaWVudGF0aW9uIiwic2NyZWVuIiwiY29uc29sZSIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJEcmF3ZXIiLCJvcGVuIiwiQXBwQmFyIiwidGhlbWUiLCJwcmltYXJ5IiwibWluSGVpZ2h0IiwiTWVudVdoaXRlIiwiTWVudSIsIkFwcE5hdmlnYXRpb24iLCJmbGV4IiwiSG9tZSIsIkxvZ2luIiwibGF6eSIsIkNoYW5nZVBhc3N3b3JkIiwiRm9yZ290UGFzc3dvcmQiLCJTaWdudXAiLCJQcm9maWxlIiwiQXV0aEZlZWRiYWNrIiwiQXV0aGVudGljYXRpb24iLCJTdXNwZW5zZSIsImZvcm1SZWR1Y2VyIiwiZm9ybVN0YXRlIiwiRm9ybUNvbnRleHQiLCJ1c2VGb3JtQ29udGV4dCIsIkZvcm1Qcm92aWRlciIsIkhhbmdvdXRzIiwiR3JvdXAiLCJBcHBSb3V0ZXMiLCJBcHAiLCJBcHBQcm92aWRlcnMiLCJiYWNrZ3JvdW5kIiwiZm9udEZhbWlseSIsImlwIiwicmVuZGVyIiwiZG9jdW1lbnQiXSwibWFwcGluZ3MiOiJBQUFBLElBQUksT0FBTyxHQUFHO0FBQ2QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLElBQUksSUFBSTtBQUN6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Q0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDeEQsS0FBSztBQUNMLEdBQUc7QUFDSCxFQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxXQUFXO0FBQ3BDLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRTtBQUNoQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDcEIsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsV0FBVztBQUN0QyxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDaEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFO0FBQy9CLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDckIsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsV0FBVztBQUN2QyxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDaEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNyQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUM7QUFDN0IsR0FBRyxFQUFDO0FBQ0osRUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBQztBQUNEO0FBQ0EsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ3RCLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFPO0FBQ2hFLENB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QUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQXNPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBdUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E1b1MsSUFBSUMsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLEVBQUUsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUNSLEdBQUMsQ0FBQyxDQUFDLENBQUNFLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDLEdBQUcsR0FBR0EsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTUyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1AsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRVksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNYLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFtRixTQUFTWSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1YsR0FBQyxDQUFDLENBQUMsQ0FBQ1csR0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQTJHLFNBQVNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNMLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBT1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFzRCxTQUFTRyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNkLEdBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQ1EsR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBNE4sU0FBU2UsR0FBQyxFQUFFLENBQUNaLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ2IsR0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTYSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFFLENBQUMsU0FBU0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTRCxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDTixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0wsR0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDZ0IsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ1gsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFRixHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFYyxHQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVixHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDUyxHQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDOztBQ0F6dEUsTUFBTUMsV0FBVyxHQUFFO0FBQ3RCQyxFQUFBQSxpQkFBaUIsRUFBQyxtQkFESTtBQUV0QkMsRUFBQUEscUJBQXFCLEVBQUM7QUFGQSxDQUFuQjs7QUNFQSxTQUFTQyxPQUFU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Q0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9DLEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFQSxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDa08sQ0FBQyxDQUFDLENBQThTLElBQUk5TixHQUFDLENBQUNQLENBQUMsQ0FBQyxHQUFHLENBQUNBLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDTyxHQUFDLEVBQUVBLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFtUyxJQUFpUitOLEdBQUMsQ0FBQ3RPLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDTSxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVNpTyxHQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU9DLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTQyxHQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQ3pPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUNzTyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUYsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQ0UsR0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJSixDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQ0ksR0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDcE8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDb08sR0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQ0EsR0FBQyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUlDLEdBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFvZSxJQUFJQyxHQUFDLENBQUMsa09BQWtPLENBQUNOLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLElBQUlPLEdBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBNk0sSUFBSSxDQUFDLENBQUM1TyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVM2TyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM3TyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJOE8sR0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM5TyxDQUFDLENBQUMsS0FBSyxDQUFDQSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzRPLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUdFLEdBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLEdBQUd6TyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDc08sR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQSxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FB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
