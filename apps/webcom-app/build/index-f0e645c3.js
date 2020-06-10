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

    case actionTypes.FEATURE_ROUTE_CHANGED:
      return { ...state,
        featureRoute: action.featureRoute,
        route: action.route
      };

    default:
      return state;
  }
}

const AppContext = M();
function useAppContext() {
  const context = w$1(AppContext);
  l(() => {
    if (context) {
      debugger;
    }
  }, [context]);

  if (!context) {
    throw new Error('useAppContext must be used with AppProvider');
  }

  return context;
}
function FeatureRoute(props) {
  const {
    children,
    path,
    paths
  } = props;
  const [state, dispatch] = useAppContext();
  const {
    featureRoute
  } = state;
  l(() => {
    if (featureRoute) {
      debugger;
    }
  }, [featureRoute]);

  if (path && featureRoute === path) {
    return children;
  } else if (paths && featureRoute === paths.find(p => p === featureRoute)) {
    return children;
  }

  return null;
}
function useAppRoute() {
  const [state, dispatch] = useAppContext();

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
  const [state, dispatch] = useAppContext();
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
function AppProvider(props) {
  const {
    initState
  } = props;
  const [state, dispatch] = p(reducer, initState);
  const value = h$1(() => [state, dispatch], [state]);
  return h(AppContext.Provider, _extends({
    value: value
  }, props));
}

function w$2(n,t){for(var e in t)n[e]=t[e];return n}function x$2(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}var E$2=function(n){var t,e;function r(t){var e;return (e=n.call(this,t)||this).isPureReactComponent=!0,e}return e=n,(t=r).prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e,r.prototype.shouldComponentUpdate=function(n,t){return x$2(this.props,n)||x$2(this.state,t)},r}(m);var _$2=n.__b;n.__b=function(n){n.type&&n.type.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),_$2&&_$2(n);};var N$1=n.__e;function U(n){return n&&((n=w$2({},n)).__c=null,n.__k=n.__k&&n.__k.map(U)),n}function M$1(){this.__u=0,this.o=null,this.__b=null;}function L(n){var t=n.__.__c;return t&&t.u&&t.u(n)}function O(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}function P$1(){this.i=null,this.l=null;}n.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return r.__c(n,t.__c);N$1(n,t,e);},(M$1.prototype=new m).__c=function(n,t){var e=this;null==e.o&&(e.o=[]),e.o.push(t);var r=L(e.__v),o=!1,u=function(){o||(o=!0,r?r(i):i());};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c();};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=e.state.u,e.setState({u:e.__b=null});n=e.o.pop();)n.forceUpdate();};e.__u++||e.setState({u:e.__b=e.__v.__k[0]}),n.then(u,u);},M$1.prototype.render=function(n,t){return this.__b&&(this.__v.__k[0]=U(this.__b),this.__b=null),[h(m,null,t.u?null:n.children),t.u&&n.fallback]};var W=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2];}};(P$1.prototype=new m).u=function(n){var t=this,e=L(t.__v),r=t.l.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),W(t,n,r)):o();};e?e(u):u();}},P$1.prototype.render=function(n){this.i=null,this.l=new Map;var t=x(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},P$1.prototype.componentDidUpdate=P$1.prototype.componentDidMount=function(){var n=this;n.l.forEach(function(t,e){W(n,e,t);});};var j$1=function(){function n(){}var t=n.prototype;return t.getChildContext=function(){return this.props.context},t.render=function(n){return n.children},n}();var H$1=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;m.prototype.isReactComponent={};var T$1="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;var I=n.event;function $$1(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}n.event=function(n){I&&(n=I(n)),n.persist=function(){};var t=!1,e=!1,r=n.stopPropagation;n.stopPropagation=function(){r.call(n),t=!0;};var o=n.preventDefault;return n.preventDefault=function(){o.call(n),e=!0;},n.isPropagationStopped=function(){return t},n.isDefaultPrevented=function(){return e},n.nativeEvent=n};var q$1={configurable:!0,get:function(){return this.class}},B=n.vnode;n.vnode=function(n){n.$$typeof=T$1;var t=n.type,e=n.props;if(t){if(e.class!=e.className&&(q$1.enumerable="className"in e,null!=e.className&&(e.class=e.className),Object.defineProperty(e,"className",q$1)),"function"!=typeof t){var r,o,u;for(u in e.defaultValue&&void 0!==e.value&&(e.value||0===e.value||(e.value=e.defaultValue),delete e.defaultValue),Array.isArray(e.value)&&e.multiple&&"select"===t&&(x(e.children).forEach(function(n){-1!=e.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete e.value),e)if(r=H$1.test(u))break;if(r)for(u in o=n.props={},e)o[H$1.test(u)?u.replace(/[A-Z0-9]/,"-$&").toLowerCase():u]=e[u];}!function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra|Tou)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}(),"function"==typeof t&&!t.m&&t.prototype&&($$1(t.prototype,"componentWillMount"),$$1(t.prototype,"componentWillReceiveProps"),$$1(t.prototype,"componentWillUpdate"),t.m=!0);}B&&B(n);};

const RootRouteContext = M();
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

const actionTypes$1 = {
  CONNECTING: 'CONNECTING',
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED',
  SOCKET_READY: 'SOCKET_READY',
  SOCKET_ERROR: 'SOCKET_ERROR'
};

const initState = {
  readyState: 3,
  socket: null,
  error: null
};
function reducer$1(state, action) {
  switch (action.type) {
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
  const [state, dispatch] = p(authReducer, initState$1);
  const value = h$1(() => [state, dispatch], [state]);
  return h(AuthContext.Provider, _extends({
    value: value
  }, props), h(AuthRouteProvider, null, children));
}

const WSocketContext = M();
function useWSocketContext() {
  const context = w$1(WSocketContext);

  if (!context) {
    throw new Error('useWSocketContext must be used with WSocketProvider');
  }

  return context;
}
function WSocketProvider(props) {
  const authContext = useAuthContext();
  const {
    username
  } = authContext.state;
  const {
    url
  } = props;
  const [state, dispatch] = p(reducer$1, initState);
  const {
    socket
  } = state;
  l(() => {
    if (username) {
      const sock = new WebSocket(`${url}/?username=${username}`);

      sock.onmessage = message => {
        const msg = JSON.parse(message.data);
        debugger;
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
  l(() => {
    if (socket) {
      if (socket.readyState === 0) {
        dispatch({
          type: actionTypes$1.CONNECTING
        });
      } else {
        if (socket.readyState === 2) {
          dispatch({
            type: actionTypes$1.CLOSING
          });
        }
      }
    }
  }, [socket]);
  const value = h$1(() => [state, dispatch], [state]);
  return h(WSocketContext.Provider, _extends({
    value: value
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

const PhoneDrawer = O(() => import('./PhoneDrawer-48c8eeea.js'));
const TabletDrawer = O(() => import('./TabletDrawer-62f2304a.js'));
const LaptopDrawer = O(() => import('./LapTopDrawer-4e5ec62d.js'));
const DesktopDrawer = O(() => import('./DesktopDrawer-d72c24b3.js'));
function Navigation(props) {
  const {
    onAppRoute
  } = useAppRoute();
  const wsocketContext = useWSocketContext();
  const {
    readyState
  } = wsocketContext[0];
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

const Login = O(() => import('./Login-73ff4759.js'));
const ChangePassword = O(() => import('./ChangePassword-8ddd8bac.js'));
const ForgotPassword = O(() => import('./ForgotPassword-49bb470a.js'));
const Signup = O(() => import('./Signup-8451319d.js'));
const Profile = O(() => import('./Profile-a3f12cc5.js'));
const AuthFeedback = O(() => import('./AuthFeedback-845d10ef.js'));
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

function OtherContent() {
  const [rootRoute, setRootRoute] = useRootRouteContext();
  const appcontext = useAppContext();
  const dispatch = appcontext[1];
  const {
    userName
  } = useUserName();

  function handleRoute(e) {
    e.preventDefault();
    const {
      id
    } = e.target;

    if (userName) {
      debugger; //  setRootRoute(`/${id}`);

      dispatch({
        type: actionTypes.APP_ROUTE_CHANGED,
        featureRoute: '/hangouts',
        route: '/hangouts'
      });
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

function Home() {
  return h("div", {
    "data-testid": "home"
  }, "Home");
}

const actionTypes$4 = {
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOADED_MESSAGES: 'LOADED_MESSAGES',
  SAVED_MESSAGE_LOCALLY: 'SAVED_MESSAGE_LOCALLY',
  SEARCHED_HANGOUT: 'SEARCHED_HANGOUT',
  SELECTED_HANGOUT: 'SELECTED_HANGOUT',
  FETCH_HANGOUT_STARTED: 'FETCH_HANGOUT_STARTED',
  FETCH_HANGOUT_SUCCESS: 'FETCH_HANGOUT_SUCCESS',
  FETCH_HANGOUT_FAILED: 'FETCH_HANGOUT_FAILED',
  ONLINE_STATE_CHANGED: 'ONLINE_STATE_CHANGED',
  HANGOUT_RECIEVED: 'HANGOUT_RECIEVED',
  HANGOUT_SENT: 'HANGOUT_SENT'
};

const initState$3 = {
  hangouts: null,
  hangout: null,
  messages: null,
  search: '',
  user: [],
  loading: false,
  error: null,
  messageText: '',
  online: false,
  undelivered: []
};
function reducer$2(state, action) {
  switch (action.type) {
    case actionTypes$4.SAVED_MESSAGE_LOCALLY:
      if (state.messages) {
        return { ...state,
          messages: [...state.messages, action.message]
        };
      } else {
        return { ...state,
          messages: [action.message]
        };
      }

    case actionTypes$4.LOADED_MESSAGES:
      return { ...state,
        messages: action.messages
      };

    case actionTypes$4.MESSAGE_TEXT_CHANGED:
      return { ...state,
        messageText: action.text
      };

    case actionTypes$4.FETCH_USER_FAILED:
    case actionTypes$4.FETCH_HANGOUT_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes$4.FETCH_USER_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$4.FETCH_USER_SUCCESS:
      return { ...state,
        loading: false,
        users: action.users
      };

    case actionTypes$4.FETCH_HANGOUT_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes$4.FETCH_HANGOUT_SUCCESS:
      return { ...state,
        loading: false,
        hangouts: action.hangouts
      };

    case actionTypes$4.HANGOUT_NOT_FOUND:
      return { ...state,
        loading: false
      };

    case actionTypes$4.FILTER_HANGOUTS:
      return { ...state,
        hangouts: state.hangouts.filter(g => g.username.includes(state.search))
      };

    case actionTypes$4.SEARCHED_HANGOUT:
      return { ...state,
        search: action.search
      };

    case actionTypes$4.LOAD_HANGOUTS:
      return { ...state,
        hangouts: action.hangouts
      };

    case actionTypes$4.SELECTED_USER:
      if (state.hangouts) {
        return { ...state,
          hangouts: [...state.hangouts, action.hangout],
          hangout: action.hangout
        };
      }

      return { ...state,
        hangouts: [action.hangout],
        hangout: action.hangout
      };

    case actionTypes$4.SELECTED_HANGOUT:
      return { ...state,
        hangout: state.hangouts.find(g => g.username === action.username)
      };

    case actionTypes$4.HANGOUT_RECIEVED:
      return { ...state,
        hangout: action.hangout,
        hangouts: updateHangout({
          hangouts: state.hangouts,
          hangout: action.hangout
        })
      };

    default:
      return state;
  }
}

function updateHangout({
  hangout,
  hangouts
}) {
  if (hangouts) {
    const hangoutExists = hangouts.find(g => g.username === hangout.username);

    if (hangoutExists) {
      return hangouts.map(g => {
        if (g.username === hangout.username) {
          return hangout;
        } else {
          return g;
        }
      });
    } else {
      return [hangouts, hangout];
    }
  } else {
    return [hangouts, hangout];
  }
}

function loadHangouts({
  username,
  dispatch
}) {
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));
  dispatch({
    type: actionTypes$4.LOAD_HANGOUTS,
    hangouts
  });
} //select hangout from List

function selectHangout({
  dispatch,
  username
}) {
  dispatch({
    type: actionTypes$4.SELECTED_HANGOUT,
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
    type: actionTypes$4.SELECTED_USER,
    hangout
  });
} //search for hangout by typing into TextInput

function searchHangouts({
  search,
  dispatch
}) {
  dispatch({
    type: actionTypes$4.SEARCHED_HANGOUT,
    search
  });
} //filter hangout after search state change

function filterHangouts({
  dispatch
}) {
  dispatch({
    type: actionTypes$4.FILTER_HANGOUTS
  });
} //fetch hangout from server if not found in local hangouts

async function fetchHangout({
  search,
  dispatch,
  username
}) {
  try {
    dispatch({
      type: actionTypes$4.FETCH_HANGOUT_STARTED
    });
    const response = await fetch(`/hangouts/find?search=${search}&username=${username}`);

    if (response.ok) {
      const {
        hangouts
      } = await response.json();
      dispatch({
        type: actionTypes$4.FETCH_HANGOUT_SUCCESS,
        hangouts
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes$4.FETCH_HANGOUT_FAILED,
      error
    });
  }
}
function changeMessageText({
  text,
  dispatch
}) {
  dispatch({
    type: actionTypes$4.MESSAGE_TEXT_CHANGED,
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
    type: actionTypes$4.LOADED_MESSAGES,
    messages
  });
}
function saveMessage({
  dispatch,
  message,
  username,
  target
}) {
  const key = `${target}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));

  if (messages) {
    localStorage.setItem(key, JSON.stringify([...messages, { ...message,
      username
    }]));
  } else {
    localStorage.setItem(key, JSON.stringify([{ ...message,
      username
    }]));
  }

  dispatch({
    type: actionTypes$4.SAVED_MESSAGE_LOCALLY,
    message
  });
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
  const authContext = useAuthContext();
  const {
    username
  } = authContext.state;
  const [state, dispatch] = p(reducer$2, initState$3);
  const {
    hangout
  } = state;
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

const Hangouts = O(() => import('./index-2707bf13.js'));
const Group = O(() => import('./group-3c893283.js'));
function App() {
  const appContext = useAppContext();
  const {
    initialRoute
  } = appContext[0];
  return h(AuthProvider, null, h(WSocketProvider, {
    url: "ws://localhost:3000/hangouts"
  }, h(HangoutsProvider, null, h(RootRouteProvider, {
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
  }, h(NavItem, null, "WEB COM")), h(AppRoute, {
    path: "/auth"
  }, h(RouteProvider, {
    initialRoute: "/login"
  }, h(Authentication, null))), h(AppRoute, {
    path: "/"
  }, h(Home, null)), h(AppRoute, {
    path: "/hangouts"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Hangouts, {
    initialRoute: initialRoute
  }))), h(AppRoute, {
    path: "/group"
  }, h(M$1, {
    fallback: h("div", null, "loading...")
  }, h(Group, null))), ''))))));
}

H(h(AppProvider, {
  title: "Webcom",
  initState: {
    route: '/hangouts',
    featureRoute: '/hangouts'
  }
}, h(App, null)), document.body);

export { m$1 as A, styleInject as B, useThemeContext as C, useUserName as D, getTokenFromUrl as E, FeatureRoute as F, changePassword as G, forgotPassword as H, signup as I, useAppRoute as J, ListItem as K, List as L, M$1 as M, d$1 as N, O, _extends as _, actionTypes$4 as a, useAuthContext as b, useHangoutContext as c, selectUser as d, searchHangouts as e, filterHangouts as f, fetchHangout as g, changeMessageText as h, saveMessage as i, useAppContext as j, h as k, l, useRouteContext as m, useRootRouteContext as n, useAuthRouteContext as o, useMediaQuery as p, useFormContext as q, valueChanged as r, selectHangout as s, login as t, useWSocketContext as u, validationTypes as v, validationStates as w, isClientValidationType as x, clientValidation as y, resetInputValidationState as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZjBlNjQ1YzMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLWNvbnRleHQvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvYXBwLWNvbnRleHQvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9hcHAtY29udGV4dC9hcHAtY29udGV4dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcmVhY3QvY29tcGF0L2Rpc3QvY29tcGF0Lm1vZHVsZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9yb3V0ZS9yb290LXJvdXRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9yb3V0ZS9yb3V0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvdGhlbWUvdGhlbWUtY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC93c29ja2V0L2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3dzb2NrZXQvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvYXV0aFJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLXJvdXRlLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hdXRoLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvd3NvY2tldC9XU29ja2V0UHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L2ljb25zL29ubGluZVN0YXR1cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvbmF2L2ljb25zL01lbnVXaGl0ZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvQXBwU2hlbGwuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L0FwcEJhci5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvdXNlTWVkaWFRdWVyeS5qcyIsIi4uLy4uLy4uL2NsaWVudC9hdXRoL3VzZVVzZXJOYW1lLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vdmFsaWRhdGlvblN0YXRlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25NZXNzYWdlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL3ZhbGlkYXRpb25SZWdleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2NvbnN0cmFpbnRWYWxpZGF0b3JzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2Zvcm0vYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9odHRwLXN0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L25hdi9OYXZpZ2F0aW9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvQXV0aGVudGljYXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L0RyYXdlckNvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L05hdkxpc3QuanMiLCIuLi8uLi8uLi9jbGllbnQvYXV0aC9pY29ucy91c2VyNjQucG5nIiwiLi4vLi4vLi4vY2xpZW50L2F1dGgvQXV0aENvbnRlbnQuanMiLCIuLi8uLi8uLi9jbGllbnQvZm9ybS9mb3JtUmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9mb3JtL2Zvcm0tY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL090aGVyQ29udGVudC5qcyIsIi4uLy4uLy4uL2NsaWVudC93ZWJjb20tYXBwL0hvbWUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvYWN0aW9uVHlwZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvcmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9BcHAuanMiLCIuLi8uLi8uLi9jbGllbnQvd2ViY29tLWFwcC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3VwcG9ydCA9IHtcbiAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgYmxvYjpcbiAgICAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJlxuICAgICdCbG9iJyBpbiBzZWxmICYmXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG59XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXcob2JqKSB7XG4gIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxufVxuXG5pZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgXVxuXG4gIHZhciBpc0FycmF5QnVmZmVyVmlldyA9XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3IHx8XG4gICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICB9XG4gIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gIH1cbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG4vLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgdmFyIGl0ZXJhdG9yID0ge1xuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXRlcmF0b3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICB0aGlzLm1hcCA9IHt9XG5cbiAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVycykpIHtcbiAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICB9LCB0aGlzKVxuICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgfSwgdGhpcylcbiAgfVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCAnICsgdmFsdWUgOiB2YWx1ZVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxufVxuXG5IZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgIGlmICh0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICB9XG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKG5hbWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtcyA9IFtdXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIGl0ZW1zLnB1c2godmFsdWUpXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pXG4gIH0pXG4gIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbn1cblxuaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXNcbn1cblxuZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICBpZiAoYm9keS5ib2R5VXNlZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgfVxuICBib2R5LmJvZHlVc2VkID0gdHJ1ZVxufVxuXG5mdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgfVxuICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgcmV0dXJuIHByb21pc2Vcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcubGVuZ3RoOyBpKyspIHtcbiAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgfVxuICByZXR1cm4gY2hhcnMuam9pbignJylcbn1cblxuZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gIGlmIChidWYuc2xpY2UpIHtcbiAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gIH0gZWxzZSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aClcbiAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICB9XG59XG5cbmZ1bmN0aW9uIEJvZHkoKSB7XG4gIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgIGlmICghYm9keSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZm9ybURhdGEgJiYgRm9ybURhdGEucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5LnRvU3RyaW5nKClcbiAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgLy8gSUUgMTAtMTEgY2FuJ3QgaGFuZGxlIGEgRGF0YVZpZXcgYm9keS5cbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChib2R5KVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gY29uc3VtZWQodGhpcykgfHwgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICB9XG4gIH1cblxuICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICB9XG4gIH1cblxuICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG52YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG5mdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgcmV0dXJuIG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xID8gdXBjYXNlZCA6IG1ldGhvZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgfVxuICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgIHRoaXMuc2lnbmFsID0gaW5wdXQuc2lnbmFsXG4gICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpXG4gIH1cblxuICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdzYW1lLW9yaWdpbidcbiAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICB9XG4gIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgdGhpcy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbCB8fCB0aGlzLnNpZ25hbFxuICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gIH1cbiAgdGhpcy5faW5pdEJvZHkoYm9keSlcbn1cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMsIHtib2R5OiB0aGlzLl9ib2R5SW5pdH0pXG59XG5cbmZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgYm9keVxuICAgIC50cmltKClcbiAgICAuc3BsaXQoJyYnKVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICByZXR1cm4gZm9ybVxufVxuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKClcbiAgLy8gUmVwbGFjZSBpbnN0YW5jZXMgb2YgXFxyXFxuIGFuZCBcXG4gZm9sbG93ZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlIG9yIGhvcml6b250YWwgdGFiIHdpdGggYSBzcGFjZVxuICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKVxuICBwcmVQcm9jZXNzZWRIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgaWYgKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBoZWFkZXJzXG59XG5cbkJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzXG4gIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbn1cblxuQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgIHVybDogdGhpcy51cmxcbiAgfSlcbn1cblxuUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG5SZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbn1cblxuZXhwb3J0IHZhciBET01FeGNlcHRpb24gPSBzZWxmLkRPTUV4Y2VwdGlvblxudHJ5IHtcbiAgbmV3IERPTUV4Y2VwdGlvbigpXG59IGNhdGNoIChlcnIpIHtcbiAgRE9NRXhjZXB0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgbmFtZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdmFyIGVycm9yID0gRXJyb3IobWVzc2FnZSlcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgfVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpXG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBET01FeGNlcHRpb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKGlucHV0LCBpbml0KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICBmdW5jdGlvbiBhYm9ydFhocigpIHtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICB9XG4gICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgfVxuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgfVxuXG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICB9XG5cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgIH1cblxuICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnb21pdCcpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgfVxuXG4gICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgIH0pXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgIHJlcXVlc3Quc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRE9ORSAoc3VjY2VzcyBvciBmYWlsdXJlKVxuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICByZXF1ZXN0LnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgfSlcbn1cblxuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG5cbmlmICghc2VsZi5mZXRjaCkge1xuICBzZWxmLmZldGNoID0gZmV0Y2hcbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxufVxuIiwidmFyIG4sbCx1LGksdCxvLHIsZixlPXt9LGM9W10sYT0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZHxpdGVyYS9pO2Z1bmN0aW9uIHMobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKG4sbCx1KXt2YXIgaSx0PWFyZ3VtZW50cyxvPXt9O2ZvcihpIGluIGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYob1tpXT1sW2ldKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpZm9yKHU9W3VdLGk9MztpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXUucHVzaCh0W2ldKTtpZihudWxsIT11JiYoby5jaGlsZHJlbj11KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZudWxsIT1uLmRlZmF1bHRQcm9wcylmb3IoaSBpbiBuLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1vW2ldJiYob1tpXT1uLmRlZmF1bHRQcm9wc1tpXSk7cmV0dXJuIHkobixvLGwmJmwua2V5LGwmJmwucmVmLG51bGwpfWZ1bmN0aW9uIHkobCx1LGksdCxvKXt2YXIgcj17dHlwZTpsLHByb3BzOnUsa2V5OmkscmVmOnQsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6b307cmV0dXJuIG51bGw9PW8mJihyLl9fdj1yKSxuLnZub2RlJiZuLnZub2RlKHIpLHJ9ZnVuY3Rpb24gcCgpe3JldHVybnt9fWZ1bmN0aW9uIGQobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gbShuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiB3KG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz93KG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP3cobik6bnVsbH1mdW5jdGlvbiBrKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gayhuKX19ZnVuY3Rpb24gZyhsKXsoIWwuX19kJiYobC5fX2Q9ITApJiZ1LnB1c2gobCkmJiFpKyt8fG8hPT1uLmRlYm91bmNlUmVuZGVyaW5nKSYmKChvPW4uZGVib3VuY2VSZW5kZXJpbmcpfHx0KShfKX1mdW5jdGlvbiBfKCl7Zm9yKHZhciBuO2k9dS5sZW5ndGg7KW49dS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSx1PVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LGksdCxvLHIsZjtuLl9fZCYmKHI9KG89KGw9bikuX192KS5fX2UsKGY9bC5fX1ApJiYodT1bXSwoaT1zKHt9LG8pKS5fX3Y9aSx0PXooZixvLGksbC5fX24sdm9pZCAwIT09Zi5vd25lclNWR0VsZW1lbnQsbnVsbCx1LG51bGw9PXI/dyhvKTpyKSxUKHUsbyksdCE9ciYmayhvKSkpfSl9ZnVuY3Rpb24gYihuLGwsdSxpLHQsbyxyLGYsYSxzKXt2YXIgaCxwLG0sayxnLF8sYix4LEEsUD1pJiZpLl9fa3x8YyxDPVAubGVuZ3RoO2ZvcihhPT1lJiYoYT1udWxsIT1yP3JbMF06Qz93KGksMCk6bnVsbCksdS5fX2s9W10saD0wO2g8bC5sZW5ndGg7aCsrKWlmKG51bGwhPShrPXUuX19rW2hdPW51bGw9PShrPWxbaF0pfHxcImJvb2xlYW5cIj09dHlwZW9mIGs/bnVsbDpcInN0cmluZ1wiPT10eXBlb2Yga3x8XCJudW1iZXJcIj09dHlwZW9mIGs/eShudWxsLGssbnVsbCxudWxsLGspOkFycmF5LmlzQXJyYXkoayk/eShkLHtjaGlsZHJlbjprfSxudWxsLG51bGwsbnVsbCk6bnVsbCE9ay5fX2V8fG51bGwhPWsuX19jP3koay50eXBlLGsucHJvcHMsay5rZXksbnVsbCxrLl9fdik6aykpe2lmKGsuX189dSxrLl9fYj11Ll9fYisxLG51bGw9PT0obT1QW2hdKXx8bSYmay5rZXk9PW0ua2V5JiZrLnR5cGU9PT1tLnR5cGUpUFtoXT12b2lkIDA7ZWxzZSBmb3IocD0wO3A8QztwKyspe2lmKChtPVBbcF0pJiZrLmtleT09bS5rZXkmJmsudHlwZT09PW0udHlwZSl7UFtwXT12b2lkIDA7YnJlYWt9bT1udWxsfWlmKGc9eihuLGssbT1tfHxlLHQsbyxyLGYsYSxzKSwocD1rLnJlZikmJm0ucmVmIT1wJiYoeHx8KHg9W10pLG0ucmVmJiZ4LnB1c2gobS5yZWYsbnVsbCxrKSx4LnB1c2gocCxrLl9fY3x8ZyxrKSksbnVsbCE9Zyl7aWYobnVsbD09YiYmKGI9ZyksQT12b2lkIDAsdm9pZCAwIT09ay5fX2QpQT1rLl9fZCxrLl9fZD12b2lkIDA7ZWxzZSBpZihyPT1tfHxnIT1hfHxudWxsPT1nLnBhcmVudE5vZGUpe246aWYobnVsbD09YXx8YS5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKGcpLEE9bnVsbDtlbHNle2ZvcihfPWEscD0wOyhfPV8ubmV4dFNpYmxpbmcpJiZwPEM7cCs9MilpZihfPT1nKWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoZyxhKSxBPWF9XCJvcHRpb25cIj09dS50eXBlJiYobi52YWx1ZT1cIlwiKX1hPXZvaWQgMCE9PUE/QTpnLm5leHRTaWJsaW5nLFwiZnVuY3Rpb25cIj09dHlwZW9mIHUudHlwZSYmKHUuX19kPWEpfWVsc2UgYSYmbS5fX2U9PWEmJmEucGFyZW50Tm9kZSE9biYmKGE9dyhtKSl9aWYodS5fX2U9YixudWxsIT1yJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB1LnR5cGUpZm9yKGg9ci5sZW5ndGg7aC0tOyludWxsIT1yW2hdJiZ2KHJbaF0pO2ZvcihoPUM7aC0tOyludWxsIT1QW2hdJiZEKFBbaF0sUFtoXSk7aWYoeClmb3IoaD0wO2g8eC5sZW5ndGg7aCsrKWooeFtoXSx4WysraF0seFsrK2hdKX1mdW5jdGlvbiB4KG4pe3JldHVybiBudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG4/W106QXJyYXkuaXNBcnJheShuKT9jLmNvbmNhdC5hcHBseShbXSxuLm1hcCh4KSk6W25dfWZ1bmN0aW9uIEEobixsLHUsaSx0KXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fEMobixvLG51bGwsdVtvXSxpKTtmb3IobyBpbiBsKXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxDKG4sbyxsW29dLHVbb10saSl9ZnVuY3Rpb24gUChuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPVwibnVtYmVyXCI9PXR5cGVvZiB1JiYhMT09PWEudGVzdChsKT91K1wicHhcIjpudWxsPT11P1wiXCI6dX1mdW5jdGlvbiBDKG4sbCx1LGksdCl7dmFyIG8scixmLGUsYztpZih0P1wiY2xhc3NOYW1lXCI9PT1sJiYobD1cImNsYXNzXCIpOlwiY2xhc3NcIj09PWwmJihsPVwiY2xhc3NOYW1lXCIpLFwic3R5bGVcIj09PWwpaWYobz1uLnN0eWxlLFwic3RyaW5nXCI9PXR5cGVvZiB1KW8uY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkmJihvLmNzc1RleHQ9XCJcIixpPW51bGwpLGkpZm9yKGUgaW4gaSl1JiZlIGluIHV8fFAobyxlLFwiXCIpO2lmKHUpZm9yKGMgaW4gdSlpJiZ1W2NdPT09aVtjXXx8UChvLGMsdVtjXSl9ZWxzZVwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdPyhyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksZj1sLnRvTG93ZXJDYXNlKCksbD0oZiBpbiBuP2Y6bCkuc2xpY2UoMiksdT8oaXx8bi5hZGRFdmVudExpc3RlbmVyKGwsTixyKSwobi5sfHwobi5sPXt9KSlbbF09dSk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwsTixyKSk6XCJsaXN0XCIhPT1sJiZcInRhZ05hbWVcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0eXBlXCIhPT1sJiZcInNpemVcIiE9PWwmJiF0JiZsIGluIG4/bltsXT1udWxsPT11P1wiXCI6dTpcImZ1bmN0aW9uXCIhPXR5cGVvZiB1JiZcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiYobCE9PShsPWwucmVwbGFjZSgvXnhsaW5rOj8vLFwiXCIpKT9udWxsPT11fHwhMT09PXU/bi5yZW1vdmVBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixsLnRvTG93ZXJDYXNlKCkpOm4uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsbC50b0xvd2VyQ2FzZSgpLHUpOm51bGw9PXV8fCExPT09dSYmIS9eYXIvLnRlc3QobCk/bi5yZW1vdmVBdHRyaWJ1dGUobCk6bi5zZXRBdHRyaWJ1dGUobCx1KSl9ZnVuY3Rpb24gTihsKXt0aGlzLmxbbC50eXBlXShuLmV2ZW50P24uZXZlbnQobCk6bCl9ZnVuY3Rpb24geihsLHUsaSx0LG8scixmLGUsYyl7dmFyIGEsdixoLHkscCx3LGssZyxfLHgsQSxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOyhhPW4uX19iKSYmYSh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihnPXUucHJvcHMsXz0oYT1QLmNvbnRleHRUeXBlKSYmdFthLl9fY10seD1hP18/Xy5wcm9wcy52YWx1ZTphLl9fOnQsaS5fX2M/az0odj11Ll9fYz1pLl9fYykuX189di5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9dj1uZXcgUChnLHgpOih1Ll9fYz12PW5ldyBtKGcseCksdi5jb25zdHJ1Y3Rvcj1QLHYucmVuZGVyPUUpLF8mJl8uc3ViKHYpLHYucHJvcHM9Zyx2LnN0YXRlfHwodi5zdGF0ZT17fSksdi5jb250ZXh0PXgsdi5fX249dCxoPXYuX19kPSEwLHYuX19oPVtdKSxudWxsPT12Ll9fcyYmKHYuX19zPXYuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYodi5fX3M9PXYuc3RhdGUmJih2Ll9fcz1zKHt9LHYuX19zKSkscyh2Ll9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhnLHYuX19zKSkpLHk9di5wcm9wcyxwPXYuc3RhdGUsaCludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9di5jb21wb25lbnRXaWxsTW91bnQmJnYuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9di5jb21wb25lbnREaWRNb3VudCYmdi5fX2gucHVzaCh2LmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZnIT09eSYmbnVsbCE9di5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ2LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoZyx4KSwhdi5fX2UmJm51bGwhPXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXYuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGcsdi5fX3MseCl8fHUuX192PT09aS5fX3Ype2Zvcih2LnByb3BzPWcsdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PWkuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9aS5fX2UsdS5fX2s9aS5fX2ssdi5fX2gubGVuZ3RoJiZmLnB1c2godiksYT0wO2E8dS5fX2subGVuZ3RoO2ErKyl1Ll9fa1thXSYmKHUuX19rW2FdLl9fPXUpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoZyx2Ll9fcyx4KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHkscCx3KX0pfXYuY29udGV4dD14LHYucHJvcHM9Zyx2LnN0YXRlPXYuX19zLChhPW4uX19yKSYmYSh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPWwsYT12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKHQ9cyhzKHt9LHQpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwodz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHkscCkpLEE9bnVsbCE9YSYmYS50eXBlPT1kJiZudWxsPT1hLmtleT9hLnByb3BzLmNoaWxkcmVuOmEsYihsLEFycmF5LmlzQXJyYXkoQSk/QTpbQV0sdSxpLHQsbyxyLGYsZSxjKSx2LmJhc2U9dS5fX2Usdi5fX2gubGVuZ3RoJiZmLnB1c2godiksayYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1yJiZ1Ll9fdj09PWkuX192Pyh1Ll9faz1pLl9fayx1Ll9fZT1pLl9fZSk6dS5fX2U9JChpLl9fZSx1LGksdCxvLHIsZixjKTsoYT1uLmRpZmZlZCkmJmEodSl9Y2F0Y2gobCl7dS5fX3Y9bnVsbCxuLl9fZShsLHUsaSl9cmV0dXJuIHUuX19lfWZ1bmN0aW9uIFQobCx1KXtuLl9fYyYmbi5fX2ModSxsKSxsLnNvbWUoZnVuY3Rpb24odSl7dHJ5e2w9dS5fX2gsdS5fX2g9W10sbC5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKGwpe24uX19lKGwsdS5fX3YpfX0pfWZ1bmN0aW9uICQobixsLHUsaSx0LG8scixmKXt2YXIgYSxzLHYsaCx5LHA9dS5wcm9wcyxkPWwucHJvcHM7aWYodD1cInN2Z1wiPT09bC50eXBlfHx0LG51bGwhPW8pZm9yKGE9MDthPG8ubGVuZ3RoO2ErKylpZihudWxsIT0ocz1vW2FdKSYmKChudWxsPT09bC50eXBlPzM9PT1zLm5vZGVUeXBlOnMubG9jYWxOYW1lPT09bC50eXBlKXx8bj09cykpe249cyxvW2FdPW51bGw7YnJlYWt9aWYobnVsbD09bil7aWYobnVsbD09PWwudHlwZSlyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCk7bj10P2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsbC50eXBlKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGwudHlwZSxkLmlzJiZ7aXM6ZC5pc30pLG89bnVsbCxmPSExfWlmKG51bGw9PT1sLnR5cGUpcCE9PWQmJm4uZGF0YSE9ZCYmKG4uZGF0YT1kKTtlbHNle2lmKG51bGwhPW8mJihvPWMuc2xpY2UuY2FsbChuLmNoaWxkTm9kZXMpKSx2PShwPXUucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9ZC5kYW5nZXJvdXNseVNldElubmVySFRNTCwhZil7aWYobnVsbCE9bylmb3IocD17fSx5PTA7eTxuLmF0dHJpYnV0ZXMubGVuZ3RoO3krKylwW24uYXR0cmlidXRlc1t5XS5uYW1lXT1uLmF0dHJpYnV0ZXNbeV0udmFsdWU7KGh8fHYpJiYoaCYmdiYmaC5fX2h0bWw9PXYuX19odG1sfHwobi5pbm5lckhUTUw9aCYmaC5fX2h0bWx8fFwiXCIpKX1BKG4sZCxwLHQsZiksaD9sLl9faz1bXTooYT1sLnByb3BzLmNoaWxkcmVuLGIobixBcnJheS5pc0FycmF5KGEpP2E6W2FdLGwsdSxpLFwiZm9yZWlnbk9iamVjdFwiIT09bC50eXBlJiZ0LG8scixlLGYpKSxmfHwoXCJ2YWx1ZVwiaW4gZCYmdm9pZCAwIT09KGE9ZC52YWx1ZSkmJmEhPT1uLnZhbHVlJiZDKG4sXCJ2YWx1ZVwiLGEscC52YWx1ZSwhMSksXCJjaGVja2VkXCJpbiBkJiZ2b2lkIDAhPT0oYT1kLmNoZWNrZWQpJiZhIT09bi5jaGVja2VkJiZDKG4sXCJjaGVja2VkXCIsYSxwLmNoZWNrZWQsITEpKX1yZXR1cm4gbn1mdW5jdGlvbiBqKGwsdSxpKXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgbD9sKHUpOmwuY3VycmVudD11fWNhdGNoKGwpe24uX19lKGwsaSl9fWZ1bmN0aW9uIEQobCx1LGkpe3ZhciB0LG8scjtpZihuLnVubW91bnQmJm4udW5tb3VudChsKSwodD1sLnJlZikmJih0LmN1cnJlbnQmJnQuY3VycmVudCE9PWwuX19lfHxqKHQsbnVsbCx1KSksaXx8XCJmdW5jdGlvblwiPT10eXBlb2YgbC50eXBlfHwoaT1udWxsIT0obz1sLl9fZSkpLGwuX19lPWwuX19kPXZvaWQgMCxudWxsIT0odD1sLl9fYykpe2lmKHQuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e3QuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChsKXtuLl9fZShsLHUpfXQuYmFzZT10Ll9fUD1udWxsfWlmKHQ9bC5fX2spZm9yKHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdJiZEKHRbcl0sdSxpKTtudWxsIT1vJiZ2KG8pfWZ1bmN0aW9uIEUobixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gSChsLHUsaSl7dmFyIHQsbyxmO24uX18mJm4uX18obCx1KSxvPSh0PWk9PT1yKT9udWxsOmkmJmkuX19rfHx1Ll9fayxsPWgoZCxudWxsLFtsXSksZj1bXSx6KHUsKHQ/dTppfHx1KS5fX2s9bCxvfHxlLGUsdm9pZCAwIT09dS5vd25lclNWR0VsZW1lbnQsaSYmIXQ/W2ldOm8/bnVsbDp1LmNoaWxkTm9kZXMubGVuZ3RoP2Muc2xpY2UuY2FsbCh1LmNoaWxkTm9kZXMpOm51bGwsZixpfHxlLHQpLFQoZixsKX1mdW5jdGlvbiBJKG4sbCl7SChuLGwscil9ZnVuY3Rpb24gTChuLGwpe3ZhciB1LGk7Zm9yKGkgaW4gbD1zKHMoe30sbi5wcm9wcyksbCksYXJndW1lbnRzLmxlbmd0aD4yJiYobC5jaGlsZHJlbj1jLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKSx1PXt9LGwpXCJrZXlcIiE9PWkmJlwicmVmXCIhPT1pJiYodVtpXT1sW2ldKTtyZXR1cm4geShuLnR5cGUsdSxsLmtleXx8bi5rZXksbC5yZWZ8fG4ucmVmLG51bGwpfWZ1bmN0aW9uIE0obil7dmFyIGw9e30sdT17X19jOlwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciBpLHQ9dGhpcztyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fChpPVtdLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIGxbdS5fX2NdPXQsbH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dC5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJmkuc29tZShmdW5jdGlvbihsKXtsLmNvbnRleHQ9bi52YWx1ZSxnKGwpfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe2kucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXtpLnNwbGljZShpLmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Db25zdW1lci5jb250ZXh0VHlwZT11LHUuUHJvdmlkZXIuX189dSx1fW49e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYodS5jb25zdHJ1Y3RvciYmbnVsbCE9dS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpPSEwLHUuc2V0U3RhdGUodS5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYoaT0hMCx1LmNvbXBvbmVudERpZENhdGNoKG4pKSxpKXJldHVybiBnKHUuX19FPXUpfWNhdGNoKGwpe249bH10aHJvdyBufX0sbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sbS5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PXRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1zKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4odSx0aGlzLnByb3BzKSksbiYmcyh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSxnKHRoaXMpKX0sbS5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLGcodGhpcykpfSxtLnByb3RvdHlwZS5yZW5kZXI9ZCx1PVtdLGk9MCx0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LHI9ZSxmPTA7ZXhwb3J0e0ggYXMgcmVuZGVyLEkgYXMgaHlkcmF0ZSxoIGFzIGNyZWF0ZUVsZW1lbnQsaCxkIGFzIEZyYWdtZW50LHAgYXMgY3JlYXRlUmVmLGwgYXMgaXNWYWxpZEVsZW1lbnQsbSBhcyBDb21wb25lbnQsTCBhcyBjbG9uZUVsZW1lbnQsTSBhcyBjcmVhdGVDb250ZXh0LHggYXMgdG9DaGlsZEFycmF5LEQgYXMgX3VubW91bnQsbiBhcyBvcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHUscixpPTAsbz1bXSxjPW4uX19yLGY9bi5kaWZmZWQsZT1uLl9fYyxhPW4udW5tb3VudDtmdW5jdGlvbiB2KHQscil7bi5fX2gmJm4uX19oKHUsdCxpfHxyKSxpPTA7dmFyIG89dS5fX0h8fCh1Ll9fSD17X186W10sX19oOltdfSk7cmV0dXJuIHQ+PW8uX18ubGVuZ3RoJiZvLl9fLnB1c2goe30pLG8uX19bdF19ZnVuY3Rpb24gbShuKXtyZXR1cm4gaT0xLHAoRSxuKX1mdW5jdGlvbiBwKG4scixpKXt2YXIgbz12KHQrKywyKTtyZXR1cm4gby50PW4sby5fX2N8fChvLl9fYz11LG8uX189W2k/aShyKTpFKHZvaWQgMCxyKSxmdW5jdGlvbihuKXt2YXIgdD1vLnQoby5fX1swXSxuKTtvLl9fWzBdIT09dCYmKG8uX19bMF09dCxvLl9fYy5zZXRTdGF0ZSh7fSkpfV0pLG8uX199ZnVuY3Rpb24gbChyLGkpe3ZhciBvPXYodCsrLDMpOyFuLl9fcyYmeChvLl9fSCxpKSYmKG8uX189cixvLl9fSD1pLHUuX19ILl9faC5wdXNoKG8pKX1mdW5jdGlvbiB5KHIsaSl7dmFyIG89dih0KyssNCk7IW4uX19zJiZ4KG8uX19ILGkpJiYoby5fXz1yLG8uX19IPWksdS5fX2gucHVzaChvKSl9ZnVuY3Rpb24gZChuKXtyZXR1cm4gaT01LGgoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIHMobix0LHUpe2k9Nix5KGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHQoKSk6biYmKG4uY3VycmVudD10KCkpfSxudWxsPT11P3U6dS5jb25jYXQobikpfWZ1bmN0aW9uIGgobix1KXt2YXIgcj12KHQrKyw3KTtyZXR1cm4geChyLl9fSCx1KT8oci5fX0g9dSxyLl9faD1uLHIuX189bigpKTpyLl9ffWZ1bmN0aW9uIFQobix0KXtyZXR1cm4gaT04LGgoZnVuY3Rpb24oKXtyZXR1cm4gbn0sdCl9ZnVuY3Rpb24gdyhuKXt2YXIgcj11LmNvbnRleHRbbi5fX2NdLGk9dih0KyssOSk7cmV0dXJuIGkuX19jPW4scj8obnVsbD09aS5fXyYmKGkuX189ITAsci5zdWIodSkpLHIucHJvcHMudmFsdWUpOm4uX199ZnVuY3Rpb24gQSh0LHUpe24udXNlRGVidWdWYWx1ZSYmbi51c2VEZWJ1Z1ZhbHVlKHU/dSh0KTp0KX1mdW5jdGlvbiBGKG4pe3ZhciByPXYodCsrLDEwKSxpPW0oKTtyZXR1cm4gci5fXz1uLHUuY29tcG9uZW50RGlkQ2F0Y2h8fCh1LmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4pe3IuX18mJnIuX18obiksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gXygpe28uc29tZShmdW5jdGlvbih0KXtpZih0Ll9fUCl0cnl7dC5fX0guX19oLmZvckVhY2goZyksdC5fX0guX19oLmZvckVhY2gocSksdC5fX0guX19oPVtdfWNhdGNoKHUpe3JldHVybiB0Ll9fSC5fX2g9W10sbi5fX2UodSx0Ll9fdiksITB9fSksbz1bXX1mdW5jdGlvbiBnKG4pe1wiZnVuY3Rpb25cIj09dHlwZW9mIG4udSYmbi51KCl9ZnVuY3Rpb24gcShuKXtuLnU9bi5fXygpfWZ1bmN0aW9uIHgobix0KXtyZXR1cm4hbnx8dC5zb21lKGZ1bmN0aW9uKHQsdSl7cmV0dXJuIHQhPT1uW3VdfSl9ZnVuY3Rpb24gRShuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fW4uX19yPWZ1bmN0aW9uKG4pe2MmJmMobiksdD0wO3ZhciByPSh1PW4uX19jKS5fX0g7ciYmKHIuX19oLmZvckVhY2goZyksci5fX2guZm9yRWFjaChxKSxyLl9faD1bXSl9LG4uZGlmZmVkPWZ1bmN0aW9uKHQpe2YmJmYodCk7dmFyIHU9dC5fX2M7dSYmdS5fX0gmJnUuX19ILl9faC5sZW5ndGgmJigxIT09by5wdXNoKHUpJiZyPT09bi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgocj1uLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fGZ1bmN0aW9uKG4pe3ZhciB0LHU9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQociksY2FuY2VsQW5pbWF0aW9uRnJhbWUodCksc2V0VGltZW91dChuKX0scj1zZXRUaW1lb3V0KHUsMTAwKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodSkpfSkoXykpfSxuLl9fYz1mdW5jdGlvbih0LHUpe3Uuc29tZShmdW5jdGlvbih0KXt0cnl7dC5fX2guZm9yRWFjaChnKSx0Ll9faD10Ll9faC5maWx0ZXIoZnVuY3Rpb24obil7cmV0dXJuIW4uX198fHEobil9KX1jYXRjaChyKXt1LnNvbWUoZnVuY3Rpb24obil7bi5fX2gmJihuLl9faD1bXSl9KSx1PVtdLG4uX19lKHIsdC5fX3YpfX0pLGUmJmUodCx1KX0sbi51bm1vdW50PWZ1bmN0aW9uKHQpe2EmJmEodCk7dmFyIHU9dC5fX2M7aWYodSYmdS5fX0gpdHJ5e3UuX19ILl9fLmZvckVhY2goZyl9Y2F0Y2godCl7bi5fX2UodCx1Ll9fdil9fTtleHBvcnR7bSBhcyB1c2VTdGF0ZSxwIGFzIHVzZVJlZHVjZXIsbCBhcyB1c2VFZmZlY3QseSBhcyB1c2VMYXlvdXRFZmZlY3QsZCBhcyB1c2VSZWYscyBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLGggYXMgdXNlTWVtbyxUIGFzIHVzZUNhbGxiYWNrLHcgYXMgdXNlQ29udGV4dCxBIGFzIHVzZURlYnVnVmFsdWUsRiBhcyB1c2VFcnJvckJvdW5kYXJ5fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xuICAgIEFQUF9ST1VURV9DSEFOR0VEOidBUFBfUk9VVEVfQ0hBTkdFRCcsXG4gICAgRkVBVFVSRV9ST1VURV9DSEFOR0VEOidGRUFUVVJFX1JPVVRFX0NIQU5HRUQnXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VEOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJvdXRlOiBhY3Rpb24ucm91dGUsZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlIH1cbiAgICAgICAgY2FzZSBhY3Rpb25UeXBlcy5GRUFUVVJFX1JPVVRFX0NIQU5HRUQ6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZmVhdHVyZVJvdXRlOiBhY3Rpb24uZmVhdHVyZVJvdXRlLHJvdXRlOmFjdGlvbi5yb3V0ZSB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VSZWR1Y2VyLHVzZU1lbW8sdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHtyZWR1Y2VyfSBmcm9tICcuL3JlZHVjZXInXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmNvbnN0IEFwcENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBcHBDb250ZXh0KTtcclxuICB1c2VFZmZlY3QoKCk9PntcclxuICAgIGlmKGNvbnRleHQpe1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgIH1cclxuICB9LFtjb250ZXh0XSlcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXBwQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBBcHBQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBDb250ZXh0KCk7XHJcbmNvbnN0IHtmZWF0dXJlUm91dGV9PXN0YXRlXHJcbnVzZUVmZmVjdCgoKT0+e1xyXG4gIGlmKGZlYXR1cmVSb3V0ZSl7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICB9XHJcbn0sW2ZlYXR1cmVSb3V0ZV0pXHJcbiAgaWYgKHBhdGggJiYgZmVhdHVyZVJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgZmVhdHVyZVJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSBmZWF0dXJlUm91dGUpKSB7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHBSb3V0ZSAoKXtcclxuICBjb25zdCBbc3RhdGUsZGlzcGF0Y2hdPXVzZUFwcENvbnRleHQoKVxyXG5cclxuICBmdW5jdGlvbiBvbkFwcFJvdXRlKHtyb3V0ZSxmZWF0dXJlUm91dGV9KXtcclxuICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkFQUF9ST1VURV9DSEFOR0VELCBmZWF0dXJlUm91dGUscm91dGV9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtvbkFwcFJvdXRlfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF0gPSB1c2VBcHBDb250ZXh0KCk7XHJcbmNvbnN0IHtyb3V0ZX09c3RhdGVcclxuICBpZiAocGF0aCAmJiByb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH0gZWxzZSBpZiAocGF0aHMgJiYgcm91dGUgPT09IHBhdGhzLmZpbmQoKHApID0+IHAgPT09IHJvdXRlKSkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gQXBwUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7aW5pdFN0YXRlfT1wcm9wc1xyXG4gIGNvbnN0IFtzdGF0ZSxkaXNwYXRjaF09dXNlUmVkdWNlcihyZWR1Y2VyLGluaXRTdGF0ZSlcclxuXHJcblxyXG5jb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8QXBwQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0e3VzZVN0YXRlIGFzIG4sdXNlUmVkdWNlciBhcyB0LHVzZUVmZmVjdCBhcyBlLHVzZUxheW91dEVmZmVjdCBhcyByLHVzZVJlZiBhcyBvLHVzZUltcGVyYXRpdmVIYW5kbGUgYXMgdSx1c2VNZW1vIGFzIGksdXNlQ2FsbGJhY2sgYXMgZix1c2VDb250ZXh0IGFzIGMsdXNlRGVidWdWYWx1ZSBhcyBhfWZyb21cInByZWFjdC9ob29rc1wiO2V4cG9ydCpmcm9tXCJwcmVhY3QvaG9va3NcIjtpbXBvcnR7Q29tcG9uZW50IGFzIGwsY3JlYXRlRWxlbWVudCBhcyBzLG9wdGlvbnMgYXMgdix0b0NoaWxkQXJyYXkgYXMgaCxoeWRyYXRlIGFzIGQscmVuZGVyIGFzIHAsX3VubW91bnQgYXMgbSxjbG9uZUVsZW1lbnQgYXMgeSxjcmVhdGVSZWYgYXMgYixjcmVhdGVDb250ZXh0IGFzIFMsRnJhZ21lbnQgYXMgZ31mcm9tXCJwcmVhY3RcIjtleHBvcnR7Y3JlYXRlRWxlbWVudCxjcmVhdGVDb250ZXh0LGNyZWF0ZVJlZixGcmFnbWVudCxDb21wb25lbnR9ZnJvbVwicHJlYWN0XCI7ZnVuY3Rpb24gdyhuLHQpe2Zvcih2YXIgZSBpbiB0KW5bZV09dFtlXTtyZXR1cm4gbn1mdW5jdGlvbiB4KG4sdCl7Zm9yKHZhciBlIGluIG4paWYoXCJfX3NvdXJjZVwiIT09ZSYmIShlIGluIHQpKXJldHVybiEwO2Zvcih2YXIgciBpbiB0KWlmKFwiX19zb3VyY2VcIiE9PXImJm5bcl0hPT10W3JdKXJldHVybiEwO3JldHVybiExfXZhciBFPWZ1bmN0aW9uKG4pe3ZhciB0LGU7ZnVuY3Rpb24gcih0KXt2YXIgZTtyZXR1cm4oZT1uLmNhbGwodGhpcyx0KXx8dGhpcykuaXNQdXJlUmVhY3RDb21wb25lbnQ9ITAsZX1yZXR1cm4gZT1uLCh0PXIpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuX19wcm90b19fPWUsci5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHgodGhpcy5wcm9wcyxuKXx8eCh0aGlzLnN0YXRlLHQpfSxyfShsKTtmdW5jdGlvbiBDKG4sdCl7ZnVuY3Rpb24gZShuKXt2YXIgZT10aGlzLnByb3BzLnJlZixyPWU9PW4ucmVmO3JldHVybiFyJiZlJiYoZS5jYWxsP2UobnVsbCk6ZS5jdXJyZW50PW51bGwpLHQ/IXQodGhpcy5wcm9wcyxuKXx8IXI6eCh0aGlzLnByb3BzLG4pfWZ1bmN0aW9uIHIodCl7cmV0dXJuIHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWUscyhuLHQpfXJldHVybiByLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PSEwLHIuZGlzcGxheU5hbWU9XCJNZW1vKFwiKyhuLmRpc3BsYXlOYW1lfHxuLm5hbWUpK1wiKVwiLHIudD0hMCxyfXZhciBfPXYuX19iO3YuX19iPWZ1bmN0aW9uKG4pe24udHlwZSYmbi50eXBlLnQmJm4ucmVmJiYobi5wcm9wcy5yZWY9bi5yZWYsbi5yZWY9bnVsbCksXyYmXyhuKX07dmFyIEE9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvciYmU3ltYm9sLmZvcihcInJlYWN0LmZvcndhcmRfcmVmXCIpfHwzOTExO2Z1bmN0aW9uIGsobil7ZnVuY3Rpb24gdCh0LGUpe3ZhciByPXcoe30sdCk7cmV0dXJuIGRlbGV0ZSByLnJlZixuKHIsdC5yZWZ8fGUpfXJldHVybiB0LiQkdHlwZW9mPUEsdC5yZW5kZXI9dCx0LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50PXQudD0hMCx0LmRpc3BsYXlOYW1lPVwiRm9yd2FyZFJlZihcIisobi5kaXNwbGF5TmFtZXx8bi5uYW1lKStcIilcIix0fXZhciBSPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/aChuKS5yZWR1Y2UoZnVuY3Rpb24obixlLHIpe3JldHVybiBuLmNvbmNhdCh0KGUscikpfSxbXSk6bnVsbH0sRj17bWFwOlIsZm9yRWFjaDpSLGNvdW50OmZ1bmN0aW9uKG4pe3JldHVybiBuP2gobikubGVuZ3RoOjB9LG9ubHk6ZnVuY3Rpb24obil7aWYoMSE9PShuPWgobikpLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZHJlbi5vbmx5KCkgZXhwZWN0cyBvbmx5IG9uZSBjaGlsZC5cIik7cmV0dXJuIG5bMF19LHRvQXJyYXk6aH0sTj12Ll9fZTtmdW5jdGlvbiBVKG4pe3JldHVybiBuJiYoKG49dyh7fSxuKSkuX19jPW51bGwsbi5fX2s9bi5fX2smJm4uX19rLm1hcChVKSksbn1mdW5jdGlvbiBNKCl7dGhpcy5fX3U9MCx0aGlzLm89bnVsbCx0aGlzLl9fYj1udWxsfWZ1bmN0aW9uIEwobil7dmFyIHQ9bi5fXy5fX2M7cmV0dXJuIHQmJnQudSYmdC51KG4pfWZ1bmN0aW9uIE8obil7dmFyIHQsZSxyO2Z1bmN0aW9uIG8obyl7aWYodHx8KHQ9bigpKS50aGVuKGZ1bmN0aW9uKG4pe2U9bi5kZWZhdWx0fHxufSxmdW5jdGlvbihuKXtyPW59KSxyKXRocm93IHI7aWYoIWUpdGhyb3cgdDtyZXR1cm4gcyhlLG8pfXJldHVybiBvLmRpc3BsYXlOYW1lPVwiTGF6eVwiLG8udD0hMCxvfWZ1bmN0aW9uIFAoKXt0aGlzLmk9bnVsbCx0aGlzLmw9bnVsbH12Ll9fZT1mdW5jdGlvbihuLHQsZSl7aWYobi50aGVuKWZvcih2YXIgcixvPXQ7bz1vLl9fOylpZigocj1vLl9fYykmJnIuX19jKXJldHVybiByLl9fYyhuLHQuX19jKTtOKG4sdCxlKX0sKE0ucHJvdG90eXBlPW5ldyBsKS5fX2M9ZnVuY3Rpb24obix0KXt2YXIgZT10aGlzO251bGw9PWUubyYmKGUubz1bXSksZS5vLnB1c2godCk7dmFyIHI9TChlLl9fdiksbz0hMSx1PWZ1bmN0aW9uKCl7b3x8KG89ITAscj9yKGkpOmkoKSl9O3QuX19jPXQuY29tcG9uZW50V2lsbFVubW91bnQsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3UoKSx0Ll9fYyYmdC5fX2MoKX07dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbjtpZighLS1lLl9fdSlmb3IoZS5fX3YuX19rWzBdPWUuc3RhdGUudSxlLnNldFN0YXRlKHt1OmUuX19iPW51bGx9KTtuPWUuby5wb3AoKTspbi5mb3JjZVVwZGF0ZSgpfTtlLl9fdSsrfHxlLnNldFN0YXRlKHt1OmUuX19iPWUuX192Ll9fa1swXX0pLG4udGhlbih1LHUpfSxNLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24obix0KXtyZXR1cm4gdGhpcy5fX2ImJih0aGlzLl9fdi5fX2tbMF09VSh0aGlzLl9fYiksdGhpcy5fX2I9bnVsbCksW3MobCxudWxsLHQudT9udWxsOm4uY2hpbGRyZW4pLHQudSYmbi5mYWxsYmFja119O3ZhciBXPWZ1bmN0aW9uKG4sdCxlKXtpZigrK2VbMV09PT1lWzBdJiZuLmwuZGVsZXRlKHQpLG4ucHJvcHMucmV2ZWFsT3JkZXImJihcInRcIiE9PW4ucHJvcHMucmV2ZWFsT3JkZXJbMF18fCFuLmwuc2l6ZSkpZm9yKGU9bi5pO2U7KXtmb3IoO2UubGVuZ3RoPjM7KWUucG9wKCkoKTtpZihlWzFdPGVbMF0pYnJlYWs7bi5pPWU9ZVsyXX19OyhQLnByb3RvdHlwZT1uZXcgbCkudT1mdW5jdGlvbihuKXt2YXIgdD10aGlzLGU9TCh0Ll9fdikscj10LmwuZ2V0KG4pO3JldHVybiByWzBdKyssZnVuY3Rpb24obyl7dmFyIHU9ZnVuY3Rpb24oKXt0LnByb3BzLnJldmVhbE9yZGVyPyhyLnB1c2gobyksVyh0LG4scikpOm8oKX07ZT9lKHUpOnUoKX19LFAucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihuKXt0aGlzLmk9bnVsbCx0aGlzLmw9bmV3IE1hcDt2YXIgdD1oKG4uY2hpbGRyZW4pO24ucmV2ZWFsT3JkZXImJlwiYlwiPT09bi5yZXZlYWxPcmRlclswXSYmdC5yZXZlcnNlKCk7Zm9yKHZhciBlPXQubGVuZ3RoO2UtLTspdGhpcy5sLnNldCh0W2VdLHRoaXMuaT1bMSwwLHRoaXMuaV0pO3JldHVybiBuLmNoaWxkcmVufSxQLnByb3RvdHlwZS5jb21wb25lbnREaWRVcGRhdGU9UC5wcm90b3R5cGUuY29tcG9uZW50RGlkTW91bnQ9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO24ubC5mb3JFYWNoKGZ1bmN0aW9uKHQsZSl7VyhuLGUsdCl9KX07dmFyIGo9ZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7fXZhciB0PW4ucHJvdG90eXBlO3JldHVybiB0LmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnByb3BzLmNvbnRleHR9LHQucmVuZGVyPWZ1bmN0aW9uKG4pe3JldHVybiBuLmNoaWxkcmVufSxufSgpO2Z1bmN0aW9uIHoobil7dmFyIHQ9dGhpcyxlPW4uY29udGFpbmVyLHI9cyhqLHtjb250ZXh0OnQuY29udGV4dH0sbi52bm9kZSk7cmV0dXJuIHQucyYmdC5zIT09ZSYmKHQudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCksdC5wPSExKSxuLnZub2RlP3QucD8oZS5fX2s9dC5fX2sscChyLGUpLHQuX19rPWUuX19rKToodC52PWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpLGQoXCJcIixlKSxlLmFwcGVuZENoaWxkKHQudiksdC5wPSEwLHQucz1lLHAocixlLHQudiksdC5fX2s9dC52Ll9fayk6dC5wJiYodC52LnBhcmVudE5vZGUmJnQucy5yZW1vdmVDaGlsZCh0LnYpLG0odC5oKSksdC5oPXIsdC5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Qudi5wYXJlbnROb2RlJiZ0LnMucmVtb3ZlQ2hpbGQodC52KSxtKHQuaCl9LG51bGx9ZnVuY3Rpb24gRChuLHQpe3JldHVybiBzKHose3Zub2RlOm4sY29udGFpbmVyOnR9KX12YXIgSD0vXig/OmFjY2VudHxhbGlnbm1lbnR8YXJhYmljfGJhc2VsaW5lfGNhcHxjbGlwKD8hUGF0aFUpfGNvbG9yfGZpbGx8Zmxvb2R8Zm9udHxnbHlwaCg/IVIpfGhvcml6fG1hcmtlcig/IUh8V3xVKXxvdmVybGluZXxwYWludHxzdG9wfHN0cmlrZXRocm91Z2h8c3Ryb2tlfHRleHQoPyFMKXx1bmRlcmxpbmV8dW5pY29kZXx1bml0c3x2fHZlY3Rvcnx2ZXJ0fHdvcmR8d3JpdGluZ3x4KD8hQykpW0EtWl0vO2wucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9e307dmFyIFQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvciYmU3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIil8fDYwMTAzO2Z1bmN0aW9uIFYobix0LGUpe2lmKG51bGw9PXQuX19rKWZvcig7dC5maXJzdENoaWxkOyl0LnJlbW92ZUNoaWxkKHQuZmlyc3RDaGlsZCk7cmV0dXJuIHAobix0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlKCksbj9uLl9fYzpudWxsfWZ1bmN0aW9uIFoobix0LGUpe3JldHVybiBkKG4sdCksXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZSgpLG4/bi5fX2M6bnVsbH12YXIgST12LmV2ZW50O2Z1bmN0aW9uICQobix0KXtuW1wiVU5TQUZFX1wiK3RdJiYhblt0XSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sdCx7Y29uZmlndXJhYmxlOiExLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzW1wiVU5TQUZFX1wiK3RdfSxzZXQ6ZnVuY3Rpb24obil7dGhpc1tcIlVOU0FGRV9cIit0XT1ufX0pfXYuZXZlbnQ9ZnVuY3Rpb24obil7SSYmKG49SShuKSksbi5wZXJzaXN0PWZ1bmN0aW9uKCl7fTt2YXIgdD0hMSxlPSExLHI9bi5zdG9wUHJvcGFnYXRpb247bi5zdG9wUHJvcGFnYXRpb249ZnVuY3Rpb24oKXtyLmNhbGwobiksdD0hMH07dmFyIG89bi5wcmV2ZW50RGVmYXVsdDtyZXR1cm4gbi5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe28uY2FsbChuKSxlPSEwfSxuLmlzUHJvcGFnYXRpb25TdG9wcGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LG4uaXNEZWZhdWx0UHJldmVudGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGV9LG4ubmF0aXZlRXZlbnQ9bn07dmFyIHE9e2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGFzc319LEI9di52bm9kZTt2LnZub2RlPWZ1bmN0aW9uKG4pe24uJCR0eXBlb2Y9VDt2YXIgdD1uLnR5cGUsZT1uLnByb3BzO2lmKHQpe2lmKGUuY2xhc3MhPWUuY2xhc3NOYW1lJiYocS5lbnVtZXJhYmxlPVwiY2xhc3NOYW1lXCJpbiBlLG51bGwhPWUuY2xhc3NOYW1lJiYoZS5jbGFzcz1lLmNsYXNzTmFtZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJjbGFzc05hbWVcIixxKSksXCJmdW5jdGlvblwiIT10eXBlb2YgdCl7dmFyIHIsbyx1O2Zvcih1IGluIGUuZGVmYXVsdFZhbHVlJiZ2b2lkIDAhPT1lLnZhbHVlJiYoZS52YWx1ZXx8MD09PWUudmFsdWV8fChlLnZhbHVlPWUuZGVmYXVsdFZhbHVlKSxkZWxldGUgZS5kZWZhdWx0VmFsdWUpLEFycmF5LmlzQXJyYXkoZS52YWx1ZSkmJmUubXVsdGlwbGUmJlwic2VsZWN0XCI9PT10JiYoaChlLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uKG4pey0xIT1lLnZhbHVlLmluZGV4T2Yobi5wcm9wcy52YWx1ZSkmJihuLnByb3BzLnNlbGVjdGVkPSEwKX0pLGRlbGV0ZSBlLnZhbHVlKSxlKWlmKHI9SC50ZXN0KHUpKWJyZWFrO2lmKHIpZm9yKHUgaW4gbz1uLnByb3BzPXt9LGUpb1tILnRlc3QodSk/dS5yZXBsYWNlKC9bQS1aMC05XS8sXCItJCZcIikudG9Mb3dlckNhc2UoKTp1XT1lW3VdfSFmdW5jdGlvbih0KXt2YXIgZT1uLnR5cGUscj1uLnByb3BzO2lmKHImJlwic3RyaW5nXCI9PXR5cGVvZiBlKXt2YXIgbz17fTtmb3IodmFyIHUgaW4gcikvXm9uKEFuaXxUcmF8VG91KS8udGVzdCh1KSYmKHJbdS50b0xvd2VyQ2FzZSgpXT1yW3VdLGRlbGV0ZSByW3VdKSxvW3UudG9Mb3dlckNhc2UoKV09dTtpZihvLm9uZG91YmxlY2xpY2smJihyLm9uZGJsY2xpY2s9cltvLm9uZG91YmxlY2xpY2tdLGRlbGV0ZSByW28ub25kb3VibGVjbGlja10pLG8ub25iZWZvcmVpbnB1dCYmKHIub25iZWZvcmVpbnB1dD1yW28ub25iZWZvcmVpbnB1dF0sZGVsZXRlIHJbby5vbmJlZm9yZWlucHV0XSksby5vbmNoYW5nZSYmKFwidGV4dGFyZWFcIj09PWV8fFwiaW5wdXRcIj09PWUudG9Mb3dlckNhc2UoKSYmIS9eZmlsfGNoZXxyYS9pLnRlc3Qoci50eXBlKSkpe3ZhciBpPW8ub25pbnB1dHx8XCJvbmlucHV0XCI7cltpXXx8KHJbaV09cltvLm9uY2hhbmdlXSxkZWxldGUgcltvLm9uY2hhbmdlXSl9fX0oKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYhdC5tJiZ0LnByb3RvdHlwZSYmKCQodC5wcm90b3R5cGUsXCJjb21wb25lbnRXaWxsTW91bnRcIiksJCh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHNcIiksJCh0LnByb3RvdHlwZSxcImNvbXBvbmVudFdpbGxVcGRhdGVcIiksdC5tPSEwKX1CJiZCKG4pfTt2YXIgRz1cIjE2LjguMFwiO2Z1bmN0aW9uIEoobil7cmV0dXJuIHMuYmluZChudWxsLG4pfWZ1bmN0aW9uIEsobil7cmV0dXJuISFuJiZuLiQkdHlwZW9mPT09VH1mdW5jdGlvbiBRKG4pe3JldHVybiBLKG4pP3kuYXBwbHkobnVsbCxhcmd1bWVudHMpOm59ZnVuY3Rpb24gWChuKXtyZXR1cm4hIW4uX19rJiYocChudWxsLG4pLCEwKX1mdW5jdGlvbiBZKG4pe3JldHVybiBuJiYobi5iYXNlfHwxPT09bi5ub2RlVHlwZSYmbil8fG51bGx9dmFyIG5uPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4odCl9LHRuPWc7ZXhwb3J0IGRlZmF1bHR7dXNlU3RhdGU6bix1c2VSZWR1Y2VyOnQsdXNlRWZmZWN0OmUsdXNlTGF5b3V0RWZmZWN0OnIsdXNlUmVmOm8sdXNlSW1wZXJhdGl2ZUhhbmRsZTp1LHVzZU1lbW86aSx1c2VDYWxsYmFjazpmLHVzZUNvbnRleHQ6Yyx1c2VEZWJ1Z1ZhbHVlOmEsdmVyc2lvbjpcIjE2LjguMFwiLENoaWxkcmVuOkYscmVuZGVyOlYsaHlkcmF0ZTpaLHVubW91bnRDb21wb25lbnRBdE5vZGU6WCxjcmVhdGVQb3J0YWw6RCxjcmVhdGVFbGVtZW50OnMsY3JlYXRlQ29udGV4dDpTLGNyZWF0ZUZhY3Rvcnk6SixjbG9uZUVsZW1lbnQ6USxjcmVhdGVSZWY6YixGcmFnbWVudDpnLGlzVmFsaWRFbGVtZW50OkssZmluZERPTU5vZGU6WSxDb21wb25lbnQ6bCxQdXJlQ29tcG9uZW50OkUsbWVtbzpDLGZvcndhcmRSZWY6ayx1bnN0YWJsZV9iYXRjaGVkVXBkYXRlczpubixTdHJpY3RNb2RlOmcsU3VzcGVuc2U6TSxTdXNwZW5zZUxpc3Q6UCxsYXp5Ok99O2V4cG9ydHtHIGFzIHZlcnNpb24sRiBhcyBDaGlsZHJlbixWIGFzIHJlbmRlcixaIGFzIGh5ZHJhdGUsWCBhcyB1bm1vdW50Q29tcG9uZW50QXROb2RlLEQgYXMgY3JlYXRlUG9ydGFsLEogYXMgY3JlYXRlRmFjdG9yeSxRIGFzIGNsb25lRWxlbWVudCxLIGFzIGlzVmFsaWRFbGVtZW50LFkgYXMgZmluZERPTU5vZGUsRSBhcyBQdXJlQ29tcG9uZW50LEMgYXMgbWVtbyxrIGFzIGZvcndhcmRSZWYsbm4gYXMgdW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMsdG4gYXMgU3RyaWN0TW9kZSxNIGFzIFN1c3BlbnNlLFAgYXMgU3VzcGVuc2VMaXN0LE8gYXMgbGF6eX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21wYXQubW9kdWxlLmpzLm1hcFxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuXHJcbmNvbnN0IFJvb3RSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gUm9vdFJvdXRlKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgcGF0aCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3Jvb3RSb3V0ZSxzZXRSb290Um91dGVdID0gdXNlUm9vdFJvdXRlQ29udGV4dCgpO1xyXG5cclxuICBpZiAocm9vdFJvdXRlID09PSBwYXRoKSB7XHJcblxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmsocHJvcHMpIHtcclxuICBjb25zdCB7IHRvLCBpZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW3Jvb3RSb3V0ZSwgc2V0Um9vdFJvdXRlXSA9IHVzZVJvb3RSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRSb290Um91dGUodG8pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGFcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICB7Li4ucHJvcHN9XHJcbiAgICAgIGhyZWY9e3RvfVxyXG4gICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja31cclxuICAgICAgc3R5bGU9e3sgdGV4dERlY29yYXRpb246ICdub25lJywgY29sb3I6ICdpbmhlcml0JyB9fVxyXG4gICAgLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlUm9vdFJvdXRlQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChSb290Um91dGVDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlUm9vdFJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBSb290Um91dGVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIFJvb3RSb3V0ZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgeyBpbml0aWFsUm91dGUgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtyb290Um91dGUsIHNldFJvb3RSb3V0ZV0gPSB1c2VTdGF0ZShpbml0aWFsUm91dGUpO1xyXG5cclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3Jvb3RSb3V0ZSwgc2V0Um9vdFJvdXRlXSwgW3Jvb3RSb3V0ZV0pO1xyXG5cclxuICByZXR1cm4gPFJvb3RSb3V0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBSb3V0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gUm91dGUocHJvcHMpIHtcclxuICBjb25zdCB7IGNoaWxkcmVuLCBwYXRoLCBwYXRocyB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IFtyb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgaWYgKHBhdGggJiYgcm91dGUgPT09IHBhdGgpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9IGVsc2UgaWYgKHBhdGhzICYmIHJvdXRlID09PSBwYXRocy5maW5kKChwKSA9PiBwID09PSByb3V0ZSkpIHtcclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMaW5rKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0bywgaWQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2V0Um91dGUodG8pO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGFcclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICB7Li4ucHJvcHN9XHJcbiAgICAgIGhyZWY9e3RvfVxyXG4gICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja31cclxuICAgICAgc3R5bGU9e3sgdGV4dERlY29yYXRpb246ICdub25lJywgY29sb3I6ICdpbmhlcml0JyB9fVxyXG4gICAgLz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFJvdXRlQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVJvdXRlQ29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gUm91dGVQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgaW5pdGlhbFJvdXRlIH0gPSBwcm9wcztcclxuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKGluaXRpYWxSb3V0ZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbcm91dGUsIHNldFJvdXRlXSwgW3JvdXRlXSk7XHJcblxyXG4gIHJldHVybiA8Um91dGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5cclxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlVGhlbWVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XHJcblxyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUaGVtZUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggVGhlbWVQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiBjb250ZXh0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgXHJcbiAgY29uc3QgeyBpbml0U3RhdGUgfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRTdGF0ZSk7XHJcblxyXG4gIHJldHVybiA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlVGhlbWVDb250ZXh0LCBUaGVtZVByb3ZpZGVyIH07XHJcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9e1xuICAgIENPTk5FQ1RJTkc6J0NPTk5FQ1RJTkcnLFxuICAgIE9QRU46J09QRU4nLFxuICAgIENMT1NJTkc6J0NMT1NJTkcnLFxuICAgIENMT1NFRDonQ0xPU0VEJyxcbiAgICBTT0NLRVRfUkVBRFk6J1NPQ0tFVF9SRUFEWScsXG4gICAgU09DS0VUX0VSUk9SOidTT0NLRVRfRVJST1InXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIHJlYWR5U3RhdGU6IDMsXG4gIHNvY2tldDogbnVsbCxcbiAgZXJyb3I6IG51bGwsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TT0NLRVRfRVJST1I6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ09OTkVDVElORzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCByZWFkeVN0YXRlOiAwIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDEgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMT1NJTkc6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcmVhZHlTdGF0ZTogMiB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xPU0VEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlYWR5U3RhdGU6IDMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNPQ0tFVF9SRUFEWTpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzb2NrZXQ6IGFjdGlvbi5zb2NrZXQgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgVkFMVUVfQ0hBTkdFRDogJ1ZBTFVFX0NIQU5HRUQnLFxyXG4gIExPR0lOX1NUQVJURUQ6ICdMT0dJTl9TVEFSVEVEJyxcclxuICBMT0dJTl9TVUNDRVNTOiAnTE9HSU5fU1VDQ0VTUycsXHJcbiAgTE9HSU5fRkFJTEVEOiAnTE9HSU5fRkFJTEVEJyxcclxuXHJcbiAgTE9HT1VUX1NUQVJURUQ6ICdMT0dPVVRfU1RBUlRFRCcsXHJcbiAgTE9HT1VUX0ZBSUxFRDogJ0xPR09VVF9GQUlMRUQnLFxyXG4gIExPR09VVF9TVUNDRVNTOiAnTE9HT1VUX1NVQ0NFU1MnLFxyXG5cclxuICBTSUdOVVBfU1RBUlRFRDogJ1NJR05VUF9TVEFSVEVEJyxcclxuICBTSUdOVVBfU1VDQ0VTUzogJ1NJR05VUF9TVUNDRVNTJyxcclxuICBTSUdOVVBfRkFJTEVEOiAnU0lHTlVQX0ZBSUxFRCcsXHJcblxyXG4gIENIQU5HRV9QQVNTV09SRF9TVEFSVEVEOiAnQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9TVUNDRVNTOiAnQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MnLFxyXG4gIENIQU5HRV9QQVNTV09SRF9GQUlMRUQ6ICdDSEFOR0VfUEFTU1dPUkRfRkFJTEVEJyxcclxuXHJcbiAgUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEJyxcclxuICBSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1M6ICdSRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MnLFxyXG4gIFJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOiAnUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQnLFxyXG4gIEdPVF9UT0tFTl9GUk9NX1VSTDogJ0dPVF9UT0tFTl9GUk9NX1VSTCcsXHJcblxyXG4gIFJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURTogJ1JFQ09WRVJfTE9DQUxfQVVUSF9TVEFURScsXHJcbn07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBlbWFpbDogJycsXHJcbiAgcGFzc3dvcmQ6ICcnLFxyXG4gIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIHVzZXJuYW1lOiAnJyxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBjb25maXJtOiAnJyxcclxuICBjdXJyZW50OiAnJyxcclxuICBlbWFpbG9ydXNlcm5hbWU6ICcnLFxyXG4gIHRva2VuOiBudWxsLFxyXG4gIGlzTG9nZ2VkSW46IGZhbHNlLFxyXG4gIGlzUGFzc3dvcmRDaGFuZ2VkOiBmYWxzZSxcclxuICBhdXRoRmVlZGJhY2s6IG51bGwsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXV0aFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuVkFMVUVfQ0hBTkdFRDpcclxuICAgICAgY29uc3QgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIFthY3Rpb24ucGF5bG9hZC5wcm9wTmFtZV06IGFjdGlvbi5wYXlsb2FkLnZhbHVlLFxyXG4gICAgICB9O1xyXG4gIFxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXHJcbiAgICAgICAgaXNMb2dnZWRJbjogdHJ1ZSxcclxuICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdXZWxjb21lLCAnLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0dJTl9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TSUdOVVBfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGlzTG9nZ2VkSW46IHRydWUsXHJcbiAgICAgICAgdG9rZW46IGFjdGlvbi50b2tlbixcclxuICAgICAgICB1c2VybmFtZTogYWN0aW9uLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24uZW1haWwsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnV2VsY29tZScsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNJR05VUF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5wYXlsb2FkLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHRva2VuOiBhY3Rpb24udG9rZW4sXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLmVtYWlsLFxyXG4gICAgICAgIGlzUGFzc3dvcmRDaGFuZ2VkOiB0cnVlLFxyXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIGF1dGhGZWVkYmFjazogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFUVVFU1RfUEFTU19DSEFOR0VfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24ucGF5bG9hZC5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5HT1RfVE9LRU5fRlJPTV9VUkw6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0b2tlbjogYWN0aW9uLnRva2VuIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5pbml0U3RhdGUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVDT1ZFUl9MT0NBTF9BVVRIX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHVzZXJuYW1lOiBhY3Rpb24udXNlci51c2VybmFtZSxcclxuICAgICAgICBlbWFpbDogYWN0aW9uLnVzZXIuZW1haWwsXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcblxyXG5jb25zdCBBdXRoUm91dGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhSb3V0ZShwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4sIHBhdGggfSA9IHByb3BzO1xyXG5cclxuICBjb25zdCBbYXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgaWYgKGF1dGhSb3V0ZSA9PT0gcGF0aCkge1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExpbmsocHJvcHMpIHtcclxuICBjb25zdCB7IHRvLCBpZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZUF1dGhSb3V0ZUNvbnRleHQoKTtcclxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRSb3V0ZSh0byk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8YVxyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIHsuLi5wcm9wc31cclxuICAgICAgaHJlZj17dG99XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfVxyXG4gICAgICBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogJ2luaGVyaXQnIH19XHJcbiAgICAvPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoUm91dGVDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhSb3V0ZUNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoUm91dGVDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEF1dGhSb3V0ZVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFJvdXRlUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCB7IGluaXRpYWxSb3V0ZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2F1dGhSb3V0ZSwgc2V0QXV0aFJvdXRlXSA9IHVzZVN0YXRlKGluaXRpYWxSb3V0ZSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdLCBbYXV0aFJvdXRlXSk7XHJcblxyXG4gIHJldHVybiA8QXV0aFJvdXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgYXV0aFJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vYXV0aFJlZHVjZXInO1xyXG5pbXBvcnQgeyBBdXRoUm91dGVQcm92aWRlciB9IGZyb20gJy4vYXV0aC1yb3V0ZS1jb250ZXh0JztcclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5mdW5jdGlvbiB1c2VBdXRoQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGhDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEFwcFByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEF1dGhQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihhdXRoUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9PlxyXG4gICAgICA8QXV0aFJvdXRlUHJvdmlkZXI+e2NoaWxkcmVufTwvQXV0aFJvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVzZUF1dGhDb250ZXh0LCBBdXRoUHJvdmlkZXIgfTtcclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge1xuICB1c2VDb250ZXh0LFxuICB1c2VTdGF0ZSxcbiAgdXNlRWZmZWN0LFxuICB1c2VSZWR1Y2VyLFxuICB1c2VNZW1vLFxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmNvbnN0IFdTb2NrZXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlV1NvY2tldENvbnRleHQoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFdTb2NrZXRDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VXU29ja2V0Q29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBXU29ja2V0UHJvdmlkZXInKTtcbiAgfVxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdTb2NrZXRQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCB7IHVybCB9ID0gcHJvcHM7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IHNvY2tldCB9ID0gc3RhdGU7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBjb25zdCBzb2NrID0gbmV3IFdlYlNvY2tldChgJHt1cmx9Lz91c2VybmFtZT0ke3VzZXJuYW1lfWApO1xuICAgICAgc29jay5vbm1lc3NhZ2U9KG1lc3NhZ2UpPT57XG4gICAgICAgIGNvbnN0IG1zZyA9SlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpXG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfVxuICAgICAgc29jay5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT1BFTiB9KTtcbiAgICAgIH07XG4gICAgICBzb2NrLm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xPU0VEIH0pO1xuICAgICAgfTtcbiAgICAgIHNvY2sub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNPQ0tFVF9FUlJPUiwgZXJyb3IgfSk7XG4gICAgICB9O1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TT0NLRVRfUkVBRFksIHNvY2tldDogc29jayB9KTtcbiAgICB9XG4gIH0sIFt1c2VybmFtZV0pO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzb2NrZXQpIHtcbiAgICAgIGlmIChzb2NrZXQucmVhZHlTdGF0ZSA9PT0gMCkge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNPTk5FQ1RJTkcgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc29ja2V0LnJlYWR5U3RhdGUgPT09IDIpIHtcbiAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNMT1NJTkcgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIFtzb2NrZXRdKTtcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxXU29ja2V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmNvbnN0IHN0eWxlID0ge1xuICB3aWR0aDogMTUsXG4gIGhlaWdodDogMTUsXG5cbiAgYm9yZGVyOiAnd2hpdGUgMnB4IHNvbGlkJyxcbn07XG5leHBvcnQgZnVuY3Rpb24gT25saW5lU3RhdHVzKHsgcmVhZHlTdGF0ZSB9KSB7XG4gIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XG4gICAgcmV0dXJuIDxJc09ubGluZSAvPjtcbiAgfSBlbHNlIGlmIChyZWFkeVN0YXRlID09PSAwKSB7XG4gICAgcmV0dXJuIDxDb25uZWN0aW5nIC8+O1xuICB9IGVsc2UgaWYgKHJlYWR5U3RhdGUgPT09IDIpIHtcbiAgICByZXR1cm4gPENsb3NpbmcgLz47XG4gIH1cbiAgcmV0dXJuIDxJc09mZmxpbmUgLz47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc09ubGluZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAnZ3JlZW4nIH19XG4gICAgICBkYXRhLXRlc3RpZD1cIm9ubGluZVwiXG4gICAgPjwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNPZmZsaW5lKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnIH19XG4gICAgICBkYXRhLXRlc3RpZD1cIm9mZmxpbmVcIlxuICAgID48L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvbm5lY3RpbmcoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdGluZ1wiXG4gICAgPjwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2xvc2luZygpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBzdHlsZT17eyAuLi5zdHlsZSwgYmFja2dyb3VuZENvbG9yOiAncGluaycgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwiY2xvc2luZ1wiXG4gICAgPjwvZGl2PlxuICApO1xufVxuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuaW1wb3J0ICcuLi9jc3Mvc3R5bGUuY3NzJztcclxuZXhwb3J0IGZ1bmN0aW9uIE1lbnVXaGl0ZSh7IG9uQ2xpY2ssIGRldmljZSwgaWQgfSkge1xyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uQ2xpY2soKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2JywgZGV2aWNlKTtcclxuICAgIHN3aXRjaCAoZGV2aWNlKSB7XHJcbiAgICAgIGNhc2UgJ3Bob25lJzpcclxuICAgICAgICBvbkNsaWNrKCcvcGhvbmUnKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAndGFibGV0JzpcclxuICAgICAgICBvbkNsaWNrKCcvdGFibGV0Jyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2xhcHRvcCc6XHJcbiAgICAgICAgb25DbGljaygnL2xhcHRvcCcpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdkZXNrdG9wJzpcclxuICAgICAgICBvbkNsaWNrKCcvZGVza3RvcCcpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPHN2Z1xyXG4gICAgICBkYXRhLXRlc3RpZD17aWR9XHJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZU9uQ2xpY2t9XHJcbiAgICAgIGNsYXNzTmFtZT0nbWVudS13aGl0ZSdcclxuICAgICAgdmlld0JveD0nMCAwIDI0IDI0J1xyXG4gICAgICBmaWxsPSd3aGl0ZSdcclxuICAgICAgd2lkdGg9JzI0cHgnXHJcbiAgICAgIGhlaWdodD0nMjRweCdcclxuICAgID5cclxuICAgICAgPHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD0nbm9uZScgLz5cclxuICAgICAgPHBhdGggZD0nTTMgMThoMTh2LTJIM3Yyem0wLTVoMTh2LTJIM3Yyem0wLTd2MmgxOFY2SDN6JyAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuZXhwb3J0IGZ1bmN0aW9uIEFwcFNoZWxsKHsgY2hpbGRyZW4gfSkge1xyXG4gIHJldHVybiA8ZGl2ID57Y2hpbGRyZW59PC9kaXY+O1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VUaGVtZUNvbnRleHQgfSBmcm9tICcuLi90aGVtZS90aGVtZS1jb250ZXh0JztcclxuZXhwb3J0IGZ1bmN0aW9uIEFwcEJhcih7IGNoaWxkcmVuIH0pIHtcclxuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lQ29udGV4dCgpO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgLi4udGhlbWUucHJpbWFyeSxcclxuICAgICAgICAvLyBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAvLyBsZWZ0OiAwLFxyXG4gICAgICAgIC8vIHRvcDogMCxcclxuICAgICAgICBtaW5IZWlnaHQ6IDY0LFxyXG4gICAgICAgIHBhZGRpbmdMZWZ0OiAxNixcclxuICAgICAgICBwYWRkaW5nUmlnaHQ6IDE2LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnIH19PntjaGlsZHJlbn08L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgZGV2aWNlVHlwZSBmcm9tICcuL2RldmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKSB7XHJcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbaGVpZ2h0LCBzZXRIZWlnaHRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW29yaWVudGF0aW9uLCBzZXRPcmllbnRhdGlvbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2RldmljZSwgc2V0RGV2aWNlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBmdW5jdGlvbiBoYW5kbGVWaWV3cG9ydFNpemUoKSB7XHJcbiAgIFxyXG4gICAgICBzZXRXaWR0aCh3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbiAgICAgIHNldEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTY3JlZW5PcmllbnRhdGlvbigpIHtcclxuICAgIHNldE9yaWVudGF0aW9uKHdpbmRvdy5zY3JlZW4ub3JpZW50YXRpb24pO1xyXG4gIH1cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHdpZHRoID4gMCkge1xyXG4gICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDYwMDpcclxuICAgICAgICAgIHNldERldmljZSgncGhvbmUnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gNzY4OlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gOTkyOlxyXG4gICAgICAgIGNhc2Ugd2lkdGggPD0gMTIwMDpcclxuICAgICAgICAgIHNldERldmljZSgndGFibGV0Jyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIHdpZHRoIDw9IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2xhcHRvcCcpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSB3aWR0aCA+IDI1NjA6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJ2Rlc2t0b3AnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBzZXREZXZpY2UoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW3dpZHRoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGV2aWNlJywgZGV2aWNlKTtcclxuICB9LCBbZGV2aWNlXSk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGhhbmRsZVZpZXdwb3J0U2l6ZSgpO1xyXG4gICAgaGFuZGxlU2NyZWVuT3JpZW50YXRpb24oKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYW5kbGVWaWV3cG9ydFNpemUpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZVNjcmVlbk9yaWVudGF0aW9uKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbiwgZGV2aWNlIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlVXNlck5hbWUoKSB7XHJcbiAgY29uc3QgW3VzZXJOYW1lLCBzZXRVc2VybmFtZV0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbdG9rZW4sIHNldFRva2VuXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IHsgc3RhdGUsZGlzcGF0Y2ggfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICBcclxuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcbiBcclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgdG9rZW4sIGVtYWlsIH0gPSBKU09OLnBhcnNlKFxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJylcclxuICAgICAgKTtcclxuICAgICAgc2V0VXNlcm5hbWUodXNlcm5hbWUpO1xyXG4gICAgICBzZXRUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldEVtYWlsKGVtYWlsKTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUudG9rZW4pIHtcclxuICBcclxuICAgICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwsIHRva2VuIH0gPXN0YXRlO1xyXG4gICAgICAvLyBjb25zdCB7IHVzZXJuYW1lLCB0b2tlbiwgZW1haWwgfSA9IEpTT04ucGFyc2UoXHJcbiAgICAgIC8vICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWJjb20nKVxyXG4gICAgICAvLyApO1xyXG4gICAgICBzZXRVc2VybmFtZSh1c2VybmFtZSk7XHJcbiAgICAgIHNldFRva2VuKHRva2VuKTtcclxuICAgICAgc2V0RW1haWwoZW1haWwpO1xyXG4gICAgfVxyXG4gIH0sIFtzdGF0ZV0pO1xyXG5cclxuICByZXR1cm4geyB1c2VyTmFtZSwgdG9rZW4sIGVtYWlsIH07XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIFZBTElEOiAnVkFMSUQnLFxyXG4gIElOVkFMSUQ6ICdJTlZBTElEJyxcclxuICBJTkFDVElWRTogJ0lOQUNUSVZFJ1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgLy9jb25zdHJhaW50XHJcbiAgRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdFTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT046ICdQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046ICdVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTicsXHJcbiAgRU1QVFlfU1RSSU5HX1ZBTElEQVRJT046ICdFTVBUWV9TVFJJTkdfVkFMSURBVElPTicsXHJcbiAgUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046ICdQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTicsXHJcbiAgLy9hdXRoXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAnVVNFUk5BTUVfVEFLRU4nLFxyXG4gIFJFR0lTVEVSRURfRU1BSUw6ICdSRUdJU1RFUkVEX0VNQUlMJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ0VNQUlMX05PVF9SRUdJU1RFUkVEJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDonVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQnXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBJTlZBTElEX1BBU1NXT1JEOlxyXG4gICAgJ2F0IGxlYXN0IDggY2hhcmFjdGVycywgbXVzdCBjb250YWluIGF0IGxlYXN0IDEgdXBwZXJjYXNlIGxldHRlciwgMSBsb3dlcmNhc2UgbGV0dGVyLCBDYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMnLFxyXG4gIElOVkFMSURfRU1BSUw6ICdlbWFpbCBmb3JtYXQgaXMgbm90IHZhbGlkJyxcclxuICBFTUFJTF9OT1RfUkVHSVNURVJFRDogJ2VtYWlsIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBVU0VSTkFNRV9OT1RfUkVHSVNURVJFRDogJ3VzZXJuYW1lIGlzIG5vdCByZWdpc3RlcmVkJyxcclxuICBJTlZBTElEX1VTRVJOQU1FOlxyXG4gICAgJ29ubHkgTGV0dGVycyBhLXogb3IgQS1aIGFuZCB0aGUgU3ltYm9scyAtIGFuZCBfIGFyZSBhbGxvd2VkJyxcclxuICBJTlZBTElEX0VNUFRZX1NUUklORzogJ2VtcHR5IHN0cmluZyBpcyBub3QgYWxsb3dlZCcsXHJcbiAgSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTDogJ2VtYWlsIG9yIHVzZXJuYW1lIGlzIG5vdCB2YWxpZCcsXHJcbiAgSU5WQUxJRF9DUkVERU5USUFMUzogJ2ludmFsaWQgY3JlZGVudGlhbHMgcHJvdmlkZWQnLFxyXG4gIFVTRVJOQU1FX1RBS0VOOiAndXNlcm5hbWUgaXMgYWxyZWFkeSB0YWtlbicsXHJcbiAgUkVHSVNURVJFRF9FTUFJTDogJ2VtYWlsIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcsXHJcbiAgUEFTU1dPUkRTX0RPX05PVF9NQVRDSDogJ3Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnXHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBwYXNzd29yZFJlZ2V4ID0gL14oPz0uKlxcZCkoPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipbYS16QS1aXSkuezgsfSQvZztcclxuXHJcbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPy9nO1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZXJuYW1lUmVnZXggPSAvW2EtekEtWl0rWy1fXSpbYS16QS1aXSsvZztcclxuIiwiaW1wb3J0IHZhbGlkYXRpb25TdGF0ZSBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcbmltcG9ydCB7IGVtYWlsUmVnZXgsIHBhc3N3b3JkUmVnZXgsIHVzZXJuYW1lUmVnZXggfSBmcm9tICcuL3ZhbGlkYXRpb25SZWdleCc7XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7IGVtYWlsIH0pIHtcclxuICBjb25zdCBlbWFpbENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKGVtYWlsUmVnZXgpO1xyXG5cclxuICBpZiAoZW1haWxDb25zdHJhaW50LnRlc3QoZW1haWwpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTUFJTCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNDbGllbnRWYWxpZGF0aW9uVHlwZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBjYXNlIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkQ29uc3RyYWludCh7IHBhc3N3b3JkIH0pIHtcclxuICBjb25zdCBwYXNzd29yZENvbnN0cmFpbnQgPSBuZXcgUmVnRXhwKHBhc3N3b3JkUmVnZXgpO1xyXG4gIGlmIChwYXNzd29yZENvbnN0cmFpbnQudGVzdChwYXNzd29yZCkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgIH07XHJcbiAgfVxyXG4gIGlmICghcGFzc3dvcmRDb25zdHJhaW50LnRlc3QocGFzc3dvcmQpKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9QQVNTV09SRCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQoeyB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHVzZXJuYW1lKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWxPclVzZXJuYW1lKHsgdmFsdWUgfSkge1xyXG4gIGNvbnN0IGVtYWlsQ29uc3RyYWludCA9IG5ldyBSZWdFeHAoZW1haWxSZWdleCk7XHJcbiAgY29uc3QgdXNlcm5hbWVDb25zdHJhaW50ID0gbmV3IFJlZ0V4cCh1c2VybmFtZVJlZ2V4KTtcclxuXHJcbiAgaWYgKGVtYWlsQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2UgaWYgKHVzZXJuYW1lQ29uc3RyYWludC50ZXN0KHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUVfT1JfRU1BSUwsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KSB7XHJcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuSU5WQUxJRCxcclxuICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1QVFlfU1RSSU5HLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGUuVkFMSUQsXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkTWF0Y2goeyBhdXRoIH0pIHtcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSB9ID1hdXRoO1xyXG5kZWJ1Z2dlcjtcclxuICBpZiAocGFzc3dvcmQgPT09ICcnIHx8IHBhc3N3b3JkICE9PSBjb25maXJtKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTlZBTElELFxyXG4gICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuUEFTU1dPUkRTX0RPX05PVF9NQVRDSCxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLlZBTElELFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTixcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIElOSVRfRk9STV9WQUxJREFUSU9OX1NUQVRFOiAnSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUnLFxyXG4gICAgUkVTRVRfVkFMSURBVElPTl9TVEFURTogJ1JFU0VUX1ZBTElEQVRJT05fU1RBVEUnLFxyXG4gICAgSU5QVVRfQkxVUlJFRDogJ0lOUFVUX0JMVVJSRUQnLFxyXG4gICAgSU5QVVRfRk9DVVNFRDogJ0lOUFVUX0ZPQ1VTRUQnLFxyXG4gIFxyXG4gICAgU0VSVkVSX1ZBTElEQVRJT046ICdTRVJWRVJfVkFMSURBVElPTicsXHJcbiAgICBDTElFTlRfVkFMSURBVElPTjonQ0xJRU5UX1ZBTElEQVRJT04nLFxyXG4gIFxyXG4gICAgSU5DX0lOUFVUX0NPVVROIDonSU5DX0lOUFVUX0NPVVROJ1xyXG4gIH07XHJcbiAgIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIC8vbG9naW5cclxuICBjcmVkZW50aWFsSW52YWxpZDogJzQwMScsXHJcbiAgLy9zaWdudXBcclxuICB1c2VybmFtZUlzVGFrZW46ICc0MDInLFxyXG4gIGVtYWlsSXNSZWdpc3RlcmVkOiAnNDAzJyxcclxuICB1c2VybmFtZUludmFsaWQ6ICc0MDUnLFxyXG4gIHBhc3N3b3JkSW52YWxpZDogJzQwNicsIC8vY2hhbmdlIHBhc3N3b3JkXHJcbiAgZW1haWxJbnZhbGlkOiAnNDA3JyxcclxuICAvL2xvZ2luXHJcbiAgZW1haWxJc05vdFJlZ2lzdGVyZWQ6ICc0MDgnLFxyXG4gIGVtcHR5U3RyaW5nTm90VmFsaWQ6ICc0MDknLFxyXG4gIGVtYWlsb3J1c2VybmFtZU5vdFZhbGlkOic0MTAnLFxyXG4gIHVzZXJuYW1lSXNOb3RSZWdpc3RlcmVkOic0MTEnLFxyXG4vL2NoYW5nZSBwYXNzd29yZFxyXG4gIHBhc3N3b3JkRG9Ob3RNYXRjaDonNDEyJyxcclxuICB0b2tlbkV4cGlyZWQ6JzQxMycsXHJcbiAgc2VydmVyVmFsaWRhdGlvblJhbmdlOiBzdGF0dXMgPT4ge1xyXG4gICAgaWYgKHN0YXR1cyA+PSA0MDAgJiYgc3RhdHVzIDw9IDQxMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcbiIsIlxyXG5pbXBvcnQgKiBhcyB2YWxpZGF0aW9ucyBmcm9tICcuL2NvbnN0cmFpbnRWYWxpZGF0b3JzJztcclxuaW1wb3J0IGNvbnN0VmFsVHlwZXMgZnJvbSAnLi92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblN0YXRlcyBmcm9tICcuL3ZhbGlkYXRpb25TdGF0ZXMnO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgaHR0cFN0YXR1cyBmcm9tICcuL2h0dHAtc3RhdHVzJztcclxuaW1wb3J0IHZhbGlkYXRpb25NZXNzYWdlcyBmcm9tICcuL3ZhbGlkYXRpb25NZXNzYWdlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xpZW50VmFsaWRhdGlvbih7IHZhbGlkYXRpb25UeXBlLCB2YWx1ZSwgc3RhdGUsYXV0aCB9KSB7XHJcblxyXG4gIGxldCB2YWxpZGF0aW9uID0gbnVsbDtcclxuICBzd2l0Y2ggKHZhbGlkYXRpb25UeXBlKSB7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsQ29uc3RyYWludCh7XHJcbiAgICAgICAgZW1haWw6IHZhbHVlLFxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT046XHJcbiAgICAgIHZhbGlkYXRpb24gPSB2YWxpZGF0aW9ucy52YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSh7XHJcbiAgICAgICAgdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50KHtcclxuICAgICAgICBwYXNzd29yZDogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlVXNlck5hbWVDb25zdHJhaW50KHtcclxuICAgICAgICB1c2VybmFtZTogdmFsdWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgY29uc3RWYWxUeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTjpcclxuICAgICAgdmFsaWRhdGlvbiA9IHZhbGlkYXRpb25zLnZhbGlkYXRlRW1wdHlTdHJpbmcoeyB2YWx1ZSB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGNvbnN0VmFsVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT046XHJcbiAgIFxyXG4gICAgICB2YWxpZGF0aW9uID0gdmFsaWRhdGlvbnMudmFsaWRhdGVQYXNzd29yZE1hdGNoKHsgYXV0aCB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIHJldHVybiB7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9WQUxJREFUSU9OLCAuLi52YWxpZGF0aW9uIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0Rm9ybVZhbGlkYXRpb25TdGF0ZSgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTklUX0ZPUk1fVkFMSURBVElPTl9TVEFURSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRJbnB1dFZhbGlkYXRpb25TdGF0ZSh7IHZhbGlkYXRpb25UeXBlIH0pIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFLCB2YWxpZGF0aW9uVHlwZSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5jSW5wdXRDb3VudCgpIHtcclxuICByZXR1cm4geyB0eXBlOiBhY3Rpb25UeXBlcy5JTkNfSU5QVVRfQ09VVE4gfTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXJ2ZXJWYWxpZGF0aW9uKHsgc3RhdHVzID0gMCB9KSB7XHJcblxyXG4gIHN3aXRjaCAoc3RhdHVzKSB7XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuY3JlZGVudGlhbEludmFsaWQ6XHJcbiAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfRU1BSUwsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMucGFzc3dvcmRJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfUEFTU1dPUkQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJbnZhbGlkOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLklOVkFMSURfVVNFUk5BTUUsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxJc1JlZ2lzdGVyZWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5SRUdJU1RFUkVEX0VNQUlMLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtYWlsSXNOb3RSZWdpc3RlcmVkOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMudXNlcm5hbWVJc1Rha2VuOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OLFxyXG4gICAgICAgIHZhbGlkYXRpb25UeXBlOiB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXHJcbiAgICAgICAgbWVzc2FnZTogdmFsaWRhdGlvbk1lc3NhZ2VzLlVTRVJOQU1FX1RBS0VOLFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBodHRwU3RhdHVzLmVtcHR5U3RyaW5nTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9FTVBUWV9TVFJJTkcsXHJcbiAgICAgICAgdmFsaWRhdGlvblN0YXRlOiB2YWxpZGF0aW9uU3RhdGVzLklOVkFMSUQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGh0dHBTdGF0dXMuZW1haWxvcnVzZXJuYW1lTm90VmFsaWQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuU0VSVkVSX1ZBTElEQVRJT04sXHJcbiAgICAgICAgdmFsaWRhdGlvblR5cGU6IHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICBtZXNzYWdlOiB2YWxpZGF0aW9uTWVzc2FnZXMuSU5WQUxJRF9VU0VSTkFNRV9PUl9FTUFJTCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgaHR0cFN0YXR1cy51c2VybmFtZUlzTm90UmVnaXN0ZXJlZDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZXMuSU5WQUxJRCxcclxuICAgICAgfTtcclxuICAgICAgY2FzZSBodHRwU3RhdHVzLnBhc3N3b3JkRG9Ob3RNYXRjaDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5TRVJWRVJfVkFMSURBVElPTixcclxuICAgICAgICB2YWxpZGF0aW9uVHlwZTogdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OLFxyXG4gICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRpb25NZXNzYWdlcy5QQVNTV09SRFNfRE9fTk9UX01BVENILFxyXG4gICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlcy5JTlZBTElELFxyXG4gICAgICB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHsgc2VydmVyVmFsaWRhdGlvbiB9IGZyb20gJy4uL2Zvcm0vYWN0aW9ucyc7XHJcbmltcG9ydCBodHRwU3RhdHVzIGZyb20gJy4uL2Zvcm0vaHR0cC1zdGF0dXMnO1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWUsIHZhbHVlIH0pIHtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLlZBTFVFX0NIQU5HRUQsXHJcbiAgICBwYXlsb2FkOiB7XHJcbiAgICAgIHByb3BOYW1lLFxyXG4gICAgICB2YWx1ZSxcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ2luKHsgZGlzcGF0Y2gsIHN0YXRlLCBmb3JtRGlzcGF0Y2ggfSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0dJTl9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2F1dGgvbG9naW5gLCB7XHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVuLVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnKicsXHJcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJhc2ljICR7YnRvYShgJHtlbWFpbG9ydXNlcm5hbWV9OiR7cGFzc3dvcmR9YCl9YCxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuIFxyXG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HSU5fU1VDQ0VTUywgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9KTtcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICd3ZWJjb20nLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICBlbWFpbCxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgIFxyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICBcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2dpbiBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPR0lOX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ251cCh7IGRpc3BhdGNoLCBmb3JtRGlzcGF0Y2gsIHN0YXRlIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNJR05VUF9TVEFSVEVEIH0pO1xyXG4gIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkLCB1c2VybmFtZSB9ID0gc3RhdGU7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3NpZ251cGAsIHtcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXNzd29yZCwgZW1haWwsIHVzZXJuYW1lIH0pLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICBjb25zdCB7IHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSA9IHJlc3VsdDtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX1NVQ0NFU1MsIHRva2VuLCB1c2VybmFtZSwgZW1haWwgfSk7XHJcblxyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgJ3dlYmNvbScsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zdCB7IGVycm9ycyB9ID0gcmVzdWx0O1xyXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBmb3JtRGlzcGF0Y2goXHJcbiAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtcclxuICAgICAgICAgICAgc3RhdHVzOiBlcnJvcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ251cCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0lHTlVQX0ZBSUxFRCwgcGF5bG9hZDogeyBlcnJvciB9IH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2ViY29tJyk7XHJcbiAgcmV0dXJuIHsgdHlwZTogYWN0aW9uVHlwZXMuTE9HT1VUX1NVQ0NFU1MgfTtcclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsIGZvcm1EaXNwYXRjaCwgdG9rZW4gfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0hBTkdFX1BBU1NXT1JEX1NUQVJURUQgfSk7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgY29uZmlybSwgcGFzc3dvcmQgfSA9IHN0YXRlO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaV91cmx9L2F1dGgvY2hhbmdlcGFzc2AsIHtcclxuICAgICAgbWV0aG9kOiAncHV0JyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIGNvbmZpcm0sXHJcbiAgICAgICAgcGFzc3dvcmQsXHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgIH0pLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXJuYW1lLCBlbWFpbCB9ID0gcmVzdWx0O1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9TVUNDRVNTLFxyXG4gICAgICAgIHRva2VuLFxyXG4gICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIG1lc3NhZ2U6IGBQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS5gLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAnd2ViY29tJyxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGVycm9ycy5mb3JFYWNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGZvcm1EaXNwYXRjaChcclxuICAgICAgICAgIHNlcnZlclZhbGlkYXRpb24oe1xyXG4gICAgICAgICAgICBzdGF0dXM6IGVycm9yLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHtcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gcmVzdWx0O1xyXG5cclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkNIQU5HRV9QQVNTV09SRF9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goe1xyXG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DSEFOR0VfUEFTU1dPUkRfRkFJTEVELFxyXG4gICAgICBwYXlsb2FkOiB7IGVycm9yIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZCh7IGRpc3BhdGNoLCBzdGF0ZSwgZm9ybURpc3BhdGNoIH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCB7IGVtYWlsIH0gPSBzdGF0ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hdXRoL3JlcXVlc3RwYXNzY2hhbmdlYCwge1xyXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCB9KSxcclxuICAgIH0pO1xyXG4gICAgZGVidWdnZXI7XHJcblxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5SRVFVRVNUX1BBU1NfQ0hBTkdFX1NVQ0NFU1MsXHJcbiAgICAgICAgdG9rZW46IHJlc3VsdC50b2tlbixcclxuICAgICAgICBtZXNzYWdlOiBgQSBsaW5rIGZvciBwYXNzd29yZCBjaGFuZ2UgIGhhcyBiZWVuIHNlbnQgdG8sICR7ZW1haWx9ISBgLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgY29uc3QgeyBlcnJvcnMgfSA9IHJlc3VsdDtcclxuICAgICAgZXJyb3JzLmZvckVhY2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgZm9ybURpc3BhdGNoKFxyXG4gICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7XHJcbiAgICAgICAgICAgIHN0YXR1czogZXJyb3IsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDUwMCkge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSByZXN1bHQ7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXHJcbiAgICAgICAgZXJyb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGFuZ2luZyBwYXNzd29yZCBmYWlsZWQnKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIGRpc3BhdGNoKHtcclxuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQsXHJcbiAgICAgIHBheWxvYWQ6IHsgZXJyb3IgfSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuRnJvbVVybCh7IHRva2VuIH0pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogYWN0aW9uVHlwZXMuR09UX1RPS0VOX0ZST01fVVJMLFxyXG4gICAgdG9rZW4sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY292ZXJMb2NhbEF1dGhTdGF0ZSh7IHVzZXIsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlJFQ09WRVJfTE9DQUxfQVVUSF9TVEFURSwgdXNlciB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgU3VzcGVuc2UsIGxhenkgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVkdWNlciB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZVRoZW1lQ29udGV4dCB9IGZyb20gJy4uL3RoZW1lL3RoZW1lLWNvbnRleHQnO1xyXG5pbXBvcnQge3VzZVdTb2NrZXRDb250ZXh0fSBmcm9tICcuLi93c29ja2V0L1dTb2NrZXRQcm92aWRlcidcclxuaW1wb3J0IHtPbmxpbmVTdGF0dXN9IGZyb20gJy4uL2xheW91dC9pY29ucy9vbmxpbmVTdGF0dXMnXHJcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcclxuaW1wb3J0IHsgTWVudVdoaXRlIH0gZnJvbSAnLi9pY29ucy9NZW51V2hpdGUnO1xyXG5pbXBvcnQgeyBBcHBTaGVsbCB9IGZyb20gJy4uL2xheW91dC9BcHBTaGVsbCc7XHJcbmltcG9ydCB7IEFwcEJhciB9IGZyb20gJy4uL2xheW91dC9BcHBCYXInO1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgcmVjb3ZlckxvY2FsQXV0aFN0YXRlIH0gZnJvbSAnLi4vYXV0aC9hY3Rpb25zJztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnLi4vYXBwLWNvbnRleHQvYXBwLWNvbnRleHQnXHJcbmltcG9ydCB7YWN0aW9uVHlwZXN9IGZyb20gJy4uL2FwcC1jb250ZXh0L2FjdGlvblR5cGVzJ1xyXG5jb25zdCBQaG9uZURyYXdlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1Bob25lRHJhd2VyJykpO1xyXG5jb25zdCBUYWJsZXREcmF3ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9UYWJsZXREcmF3ZXInKSk7XHJcbmNvbnN0IExhcHRvcERyYXdlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0xhcFRvcERyYXdlcicpKTtcclxuY29uc3QgRGVza3RvcERyYXdlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0Rlc2t0b3BEcmF3ZXInKSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZpZ2F0aW9uKHByb3BzKSB7XHJcbmNvbnN0IHtvbkFwcFJvdXRlfSA9dXNlQXBwUm91dGUoKVxyXG4gIGNvbnN0IHdzb2NrZXRDb250ZXh0ID11c2VXU29ja2V0Q29udGV4dCgpXHJcbiAgY29uc3Qge3JlYWR5U3RhdGV9PXdzb2NrZXRDb250ZXh0WzBdXHJcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgeyB1c2VyTmFtZSB9ID0gdXNlVXNlck5hbWUoKTtcclxuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uLCBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiwgZHJhd2VyQ29udGVudCB9ID0gcHJvcHM7XHJcblxyXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWVDb250ZXh0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHRvZ2dsZURyYXdlcih0bykge1xyXG4gICAgc2V0Um91dGUodG8pO1xyXG4gICAgc2V0T3BlbigocHJldikgPT4gIXByZXYpO1xyXG4gIH1cclxuICBjb25zdCB7IGRpc3BhdGNoIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlYmNvbScpKSB7XHJcbiAgXHJcbiAgICAgIHJlY292ZXJMb2NhbEF1dGhTdGF0ZSh7XHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgdXNlcjogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2ViY29tJykpLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG5mdW5jdGlvbiBuYXZUb1VucmVhZCAoKXtcclxuICBkZWJ1Z2dlcjtcclxuICBvbkFwcFJvdXRlKHsgZmVhdHVyZVJvdXRlOicvVU5SRUFEJyxyb3V0ZTonL2hhbmdvdXRzJ30pXHJcbn1cclxuICByZXR1cm4gKFxyXG4gICAgPEFwcFNoZWxsPlxyXG4gICAgICB7cm91dGUgPT09ICcvcGhvbmUnICYmIG9wZW4gPyAoXHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPFBob25lRHJhd2VyIG9uQ2xpY2s9e3RvZ2dsZURyYXdlcn0+e2RyYXdlckNvbnRlbnR9PC9QaG9uZURyYXdlcj5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICApIDogbnVsbH1cclxuICAgICAge3JvdXRlID09PSAnL3RhYmxldCcgJiYgb3BlbiA/IChcclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8VGFibGV0RHJhd2VyIG9uQ2xpY2s9e3RvZ2dsZURyYXdlcn0+e2RyYXdlckNvbnRlbnR9PC9UYWJsZXREcmF3ZXI+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgKSA6IG51bGx9XHJcbiAgICAgIHtyb3V0ZSA9PT0gJy9sYXB0b3AnICYmIG9wZW4gPyAoXHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPExhcHRvcERyYXdlciBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9PntkcmF3ZXJDb250ZW50fTwvTGFwdG9wRHJhd2VyPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgICkgOiBudWxsfVxyXG4gICAgICB7cm91dGUgPT09ICcvZGVza3RvcCcgJiYgb3BlbiA/IChcclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8RGVza3RvcERyYXdlciBvbkNsaWNrPXt0b2dnbGVEcmF3ZXJ9PntkcmF3ZXJDb250ZW50fTwvRGVza3RvcERyYXdlcj57JyAnfVxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgICkgOiBudWxsfVxyXG4gICAgICA8QXBwQmFyPlxyXG4gICAgICAgIDxNZW51V2hpdGUgb25DbGljaz17dG9nZ2xlRHJhd2VyfSBkZXZpY2U9e2RldmljZX0gaWQ9J21lbnUnIC8+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgIDxOYXZJdGVtPnt1c2VyTmFtZX08L05hdkl0ZW0+XHJcbiAgICAgICAgPE5hdkl0ZW0gb25DbGljaz17bmF2VG9VbnJlYWR9PlVucmVhZDwvTmF2SXRlbT5cclxuICAgICAgICA8TmF2SXRlbT5cclxuICAgICAgICAgIDxPbmxpbmVTdGF0dXMgcmVhZHlTdGF0ZT17cmVhZHlTdGF0ZX0vPlxyXG4gICAgICAgIDwvTmF2SXRlbT5cclxuICAgICAgPC9BcHBCYXI+XHJcbiAgICA8L0FwcFNoZWxsPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZJdGVtKHByb3BzKSB7XHJcbiAgY29uc3QgeyBjaGlsZHJlbiB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSduYXYtaXRlbSd7Li4ucHJvcHN9PntjaGlsZHJlbn08L2Rpdj47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IFN1c3BlbnNlLCBsYXp5IH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IEF1dGhSb3V0ZSB9IGZyb20gJy4vYXV0aC1yb3V0ZS1jb250ZXh0JztcclxuXHJcbmNvbnN0IExvZ2luID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvTG9naW4nKSk7XHJcbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvQ2hhbmdlUGFzc3dvcmQnKSk7XHJcbmNvbnN0IEZvcmdvdFBhc3N3b3JkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2F1dGgvRm9yZ290UGFzc3dvcmQnKSk7XHJcbmNvbnN0IFNpZ251cCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL1NpZ251cCcpKTtcclxuY29uc3QgUHJvZmlsZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL1Byb2ZpbGUnKSk7XHJcbmNvbnN0IEF1dGhGZWVkYmFjayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuLi9hdXRoL0F1dGhGZWVkYmFjaycpKTtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXV0aGVudGljYXRpb24oeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxBdXRoUm91dGUgcGF0aD0nL2NoYW5nZXBhc3N3b3JkJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8Q2hhbmdlUGFzc3dvcmQgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0F1dGhSb3V0ZT5cclxuICAgICAgPEF1dGhSb3V0ZSBwYXRoPScvbG9naW4nPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxMb2dpbiAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvQXV0aFJvdXRlPlxyXG5cclxuICAgICAgPEF1dGhSb3V0ZSBwYXRoPScvc2lnbnVwJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8U2lnbnVwIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BdXRoUm91dGU+XHJcblxyXG4gICAgICA8QXV0aFJvdXRlIHBhdGg9Jy9mb3Jnb3RwYXNzd29yZCc+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEZvcmdvdFBhc3N3b3JkIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9BdXRoUm91dGU+XHJcblxyXG4gICAgICA8QXV0aFJvdXRlIHBhdGg9Jy9wcm9maWxlJz5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+bG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8UHJvZmlsZSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvQXV0aFJvdXRlPlxyXG4gICAgICA8QXV0aFJvdXRlIHBhdGg9Jy9hdXRoZmVlZGJhY2snPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxBdXRoRmVlZGJhY2sgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L0F1dGhSb3V0ZT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICByb290OiB7fSxcclxuICB0b3A6IHt9LFxyXG4gIGJvdHRvbToge30sXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRHJhd2VyQ29udGVudCh7IGF1dGhDb250ZW50LCBvdGhlckNvbnRlbnQgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgXHJcbiAgICAgICAge2F1dGhDb250ZW50fVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdj5cclxuICAgIFxyXG4gICAgICAgIHtvdGhlckNvbnRlbnR9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5leHBvcnQgZnVuY3Rpb24gTGlzdCh7IGNoaWxkcmVuLCBpZCB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgIGRhdGEtdGVzdGlkPXtpZH1cclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcclxuXHJcbiAgICAgICAgcGFkZGluZ1RvcDogOCxcclxuICAgICAgICBwYWRkaW5nQm90dG9tOiA4LFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMaXN0SXRlbSh7IGNoaWxkcmVuLCBvbkNsaWNrLCBpZCB9KSB7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIGlkPXtpZH1cclxuICAgICAgZGF0YS10ZXN0aWQ9e2lkfVxyXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICBjbGFzc05hbWU9J2RyYXdlci1saXN0LWl0ZW0nXHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgICAgcGFkZGluZ0xlZnQ6IDE2LFxyXG4gICAgICAgIHBhZGRpbmdSaWdodDogMTYsXHJcbiAgICAgICAgcGFkZGluZ1RvcDogOCxcclxuICAgICAgICBwYWRkaW5nQm90dG9tOiA4LFxyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJjb25zdCBpbWcgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBUUFBQUFBWUxsVkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQUFtSkxSMFFBQUtxTkl6SUFBQUFKY0VoWmN3QUFEc1FBQUE3RUFaVXJEaHNBQUFBSGRFbE5SUWZrQkJzSUxTMVlmOUpJQUFBRG9FbEVRVlJvM3IyWlMwaFVVUmpIZjNNdGk5QlNNMmxSMHRQSmhFalNWaUVFMWFLTmxSVVZKRkVRRkZFa2J1MjFLN0dJTmhGRlJBK0NsaVV0YXROTDNJVFJOS0VSQmxFTGRVYkg3S0dtYzF2Y3JqUGp6TDMzZkdmdStIMkxnWHZPOS85OTk1d3o1M1VEU0syTU9xcFlRd1hGRkZFQS9DVEdFRDEwRStZVi9XSkZaYXZsTWlIaW1DNGVKMFFiTlg2ajU5UE1SMWZ3ZEEvVFRLRS84QkxPTXlpQzJ6N0lPWXF6Z3dkb3BGOExibnVVVXhpNitGVzh5UXB1KzJ0VzZ1QjNNdVFMM3NUa0IvdGtjSU1ydnNGdGIxUHZpbndlK0k0M01iblBiRFY4ZTA3d0ppWlB2Rk1JY0NkbmVCT1RCMTRkNFgvZlQvZFdOL3llbk9OTlRQWTc0VmNTbTVFRVlxekkzUHYrVERzcS9wSkFBbXZiRVc3S0pndSs4cEFlSU1oK2xncGpEM0VuOVVFSkE2SjMrRU1UZVZQUmVUVHpSeFRmUjFGcUFoZEU0V05zVDN1bnJjSVV6aVFIenhjdXVNY3lOdXR4a1VZMGViL1FMQXJ0U0JvNXFjTzRVNlRUbEFnTmlRSjNPUTR0MlR3U3RzTnFSV0cveUhkTUlKOWZJcTFxTU1CNVpzcG9IWXc3bG8zVEtkSTZZQ1d3VFJUVTYxcjZSYVMxQlF6S1dDc0tpcm1XUmtWYTZ5ZzFxSE1ZMDA0Mng3VjBya2pMb002Z1NoUUNTMXhMeTRWcVZRWkJZVWl0UzFsQWZDWUtHbFFJUThxcGRpeXI4V2lmZEtzd0tCV0d3RW5Ia2hOaXJWS0lpS1lPRTVNSmg0YmV5SVJZYXdER3hFRW1uMW1VaGkralYwTnBWQzhCazI0cVUvQ1ZkR3Zwak9wMGdSMjZlQW8vVDdnWFNPb0NnNS9pZ1dQWnA2UzdrTjk4MUZRWk1ZaG9oUDNsT3B1SUp6M1p6RTBtTkpRaWlNK0JvOXh3T0c2djVwWjRSTjJEczRMcWNSNnl6UFdObHZOSWxFQUxOQ2hYamxHdjFLejFEQ3RyN29ReWozc3YyNzhKSnUxS3ZpdHBUbHJ6OEh1RnFtTXVLMEFtMjhDNGdtcVh0U042cmlEWVJwY29nYmRjVWFqMXpQcXBVUmo1QzBWNGdFVUsvNGoxZHVXd1I4VjJNUjdncVlkcUNQaC9YM0hiUTZwREs0RTNIdVZKMUVLUG8xbURWZ0x1eDVRSUJZa1dHT0dhcTFSTUt3SDNxS3ZXS21UdmlJdnB5YkRHMnphaU5jL1Bjcm11N2lQSWNPcWp3NklwTkZzL21KNVRnTmN6aG4rUitTd3lVNWRVUTVrdnFRQjJ6MGdDenNkN29DM24rSXZ1SXpmQTdaemk3M3ZmbWMvTzRXWDFZN1g3OGxuY3lnbityaHJlNm9oV24rRnhMZ3F2QWRpaCthMHNrdyt6VndhM2JBVXZmY0cvWUxrTzN1cUtSdnF5Z2tjNUttMzY2VmJFR2FKYThBZ3RMTWdPYmxzQlRYd1F3VU9jdHRaN1A2MmFWdDR4NlFxZXBJdExpYjJlU2k5THJaUTYxbEpKQlNWSm4rOEhwejdmQzgrYS93QzFaQVhzM1VoVUhBQUFBQ1YwUlZoMFpHRjBaVHBqY21WaGRHVUFNakF5TUMwd05DMHlOMVF3T0RvME5UbzBOU3N3TURvd01CYXdTVlFBQUFBbGRFVllkR1JoZEdVNmJXOWthV1o1QURJd01qQXRNRFF0TWpkVU1EZzZORFU2TkRVck1EQTZNREJuN2ZIb0FBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCM2QzY3VhVzVyYzJOaGNHVXViM0pubSs0OEdnQUFBQUJKUlU1RXJrSmdnZz09XCI7XG4gIGV4cG9ydCBkZWZhdWx0IGltZzsiLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUm9vdFJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3Jvb3Qtcm91dGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aFJvdXRlQ29udGV4dCB9IGZyb20gJy4vYXV0aC1yb3V0ZS1jb250ZXh0JztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi9sYXlvdXQvTmF2TGlzdCc7XHJcbmltcG9ydCB1c2VySWNvbiBmcm9tICcuL2ljb25zL3VzZXI2NC5wbmcnO1xyXG5pbXBvcnQgeyBsb2dvdXQgfSBmcm9tICcuLi9hdXRoL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcclxuY29uc3Qgc3R5bGUgPSB7XHJcbiAgZ3JpZDoge1xyXG4gICAgZGlzcGxheTogJ2dyaWQnLFxyXG4gICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ2F1dG8gNSUgYXV0bycsXHJcbiAgICBqdXN0aWZ5SXRlbXM6ICdjZW50ZXInLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aENvbnRlbnQoKSB7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCBbYXV0aFJvdXRlLCBzZXRBdXRoUm91dGVdID0gdXNlQXV0aFJvdXRlQ29udGV4dCgpO1xyXG4gIGNvbnN0IFtyb290Um91dGUsIHNldFJvb3RSb3V0ZV0gPSB1c2VSb290Um91dGVDb250ZXh0KCk7XHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBpZCB9ID0gZS50YXJnZXQ7XHJcbiAgICBzZXRSb290Um91dGUoYC9hdXRoYCk7XHJcbiAgICBzZXRBdXRoUm91dGUoYC8ke2lkfWApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZ1RvcDogMTAgfX0+XHJcbiAgICAgIHshc3RhdGUudXNlcm5hbWUgJiYgPFVuQXV0aGVkU3RhdGUgaGFuZGxlUm91dGU9e2hhbmRsZVJvdXRlfSAvPn1cclxuICAgICAge3N0YXRlLnVzZXJuYW1lICYmIChcclxuICAgICAgICA8QXV0aGVkU3RhdGVcclxuICAgICAgICAgIHNldFJvb3RSb3V0ZT17c2V0Um9vdFJvdXRlfVxyXG4gICAgICAgICAgaGFuZGxlUm91dGU9e2hhbmRsZVJvdXRlfVxyXG4gICAgICAgICAgdXNlck5hbWU9e3N0YXRlLnVzZXJuYW1lfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICl9XHJcbiAgICAgIDxociBzdHlsZT17eyBoZWlnaHQ6IDEgfX0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoZWRTdGF0ZSh7IGhhbmRsZVJvdXRlLCB1c2VyTmFtZSwgc2V0Um9vdFJvdXRlIH0pIHtcclxuICBmdW5jdGlvbiBoYW5kbGVMb2dPdXQoKSB7XHJcbiAgIFxyXG4gICAgc2V0Um9vdFJvdXRlKCcvaG9tZScpO1xyXG4gICAgbG9nb3V0KCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPGRpdlxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICB9fVxyXG4gICAgICA+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxpbWcgc3JjPXt1c2VySWNvbn0gc3R5bGU9e3sgcGFkZGluZ1JpZ2h0OiA1IH19IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8YSBocmVmPScvJyBvbkNsaWNrPXtoYW5kbGVMb2dPdXR9IGlkPSdsb2dvdXQnIGRhdGEtdGVzdGlkPSdsb2dvdXQnPlxyXG4gICAgICAgICAgICBMb2dvdXRcclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiA4IH19PldlbGNvbWUsIHt1c2VyTmFtZX08L2Rpdj5cclxuICAgICAgPExpc3Q+XHJcbiAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nY2hhbmdlcGFzc3dvcmQnPlxyXG4gICAgICAgICAgQ2hhbmdlIFBhc3N3b3JkXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFVuQXV0aGVkU3RhdGUoeyBoYW5kbGVSb3V0ZSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlLmdyaWR9PlxyXG4gICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nbG9naW4nIGRhdGEtdGVzdGlkPSdsb2dpbic+XHJcbiAgICAgICAgICBMb2dpblxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICA8ZGl2Pnw8L2Rpdj5cclxuICAgICAgICA8YSBocmVmPScvJyBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J3NpZ251cCcgZGF0YS10ZXN0aWQ9J3NpZ251cCc+XHJcbiAgICAgICAgICBTaWdudXBcclxuICAgICAgICA8L2E+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB2YWxpZGF0aW9uU3RhdGUgZnJvbSAnLi92YWxpZGF0aW9uU3RhdGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7IHZhbGlkYXRpb246IHt9IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybVJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG5cclxuICBsZXQgbmV4dFN0YXRlID0gbnVsbDtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFUlZFUl9WQUxJREFUSU9OOlxyXG4gICAgICBuZXh0U3RhdGUgPSB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIFthY3Rpb24udmFsaWRhdGlvblR5cGVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogYWN0aW9uLnZhbGlkYXRpb25TdGF0ZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTElFTlRfVkFMSURBVElPTjpcclxuICAgICAgbmV4dFN0YXRlID0ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcblxyXG4gICAgICAgICAgW2FjdGlvbi52YWxpZGF0aW9uVHlwZV06IHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXRlOiBhY3Rpb24udmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24ubWVzc2FnZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5SRVNFVF9WQUxJREFUSU9OX1NUQVRFOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBbYWN0aW9uLnZhbGlkYXRpb25UeXBlXToge1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5JTlBVVF9GT0NVU0VEOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgIC4uLnN0YXRlLnZhbGlkYXRpb24sXHJcbiAgICAgICAgICBmb3JtU3RhdGU6IHZhbGlkYXRpb25TdGF0ZS5JTkFDVElWRSxcclxuICAgICAgICAgIFthY3Rpb24ucHJvcE5hbWVdOiB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEU6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgLi4uc3RhdGUudmFsaWRhdGlvbixcclxuICAgICAgICAgIGZvcm1TdGF0ZTogdmFsaWRhdGlvblN0YXRlLklOQUNUSVZFLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLklOQ19JTlBVVF9DT1VUTjpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGNvdW50OiBzdGF0ZS5jb3VudCArIDEgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgZm9ybVJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vZm9ybVJlZHVjZXInO1xyXG5jb25zdCBGb3JtQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VGb3JtQ29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChGb3JtQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUZvcm1Db250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEZvcm1Qcm92aWRlcicpO1xyXG4gIH1cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7IHN0YXRlLCBkaXNwYXRjaCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRm9ybVByb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKGZvcm1SZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxGb3JtQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vbGF5b3V0L05hdkxpc3QnO1xyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uL2F1dGgvdXNlVXNlck5hbWUnO1xyXG5pbXBvcnQgeyB1c2VSb290Um91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm9vdC1yb3V0ZXInO1xyXG5pbXBvcnQge3VzZUFwcENvbnRleHR9IGZyb20gJy4uL2FwcC1jb250ZXh0L2FwcC1jb250ZXh0J1xyXG5pbXBvcnQge2FjdGlvblR5cGVzfSBmcm9tICcuLi9hcHAtY29udGV4dC9hY3Rpb25UeXBlcydcclxuZXhwb3J0IGZ1bmN0aW9uIE90aGVyQ29udGVudCgpIHtcclxuICBjb25zdCBbcm9vdFJvdXRlLCBzZXRSb290Um91dGVdID0gdXNlUm9vdFJvdXRlQ29udGV4dCgpO1xyXG5jb25zdCBhcHBjb250ZXh0ID11c2VBcHBDb250ZXh0KClcclxuY29uc3QgZGlzcGF0Y2g9YXBwY29udGV4dFsxXVxyXG4gIGNvbnN0IHsgdXNlck5hbWUgfSA9IHVzZVVzZXJOYW1lKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xyXG4gICAgaWYgKHVzZXJOYW1lKSB7XHJcbiAgICAgZGVidWdnZXI7XHJcbiAgICAvLyAgc2V0Um9vdFJvdXRlKGAvJHtpZH1gKTtcclxuICAgICAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQVBQX1JPVVRFX0NIQU5HRUQsIGZlYXR1cmVSb3V0ZTonL2hhbmdvdXRzJyxyb3V0ZTonL2hhbmdvdXRzJ30pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZXRSb290Um91dGUoJy9hdXRoJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICA8TGlzdD5cclxuICAgICAgICA8TGlzdEl0ZW0gb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdjaGF0Jz5cclxuICAgICAgICAgIENoYXRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbT5JdGVtIFR3bzwvTGlzdEl0ZW0+XHJcblxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2hhbmdvdXRzJz5cclxuICAgICAgICAgIEhhbmdvdXRcclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgIDxMaXN0SXRlbSBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2dyb3VwJz5cclxuICAgICAgICAgIEdyb3VwXHJcbiAgICAgICAgPC9MaXN0SXRlbT5cclxuICAgICAgPC9MaXN0PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIb21lKCkge1xyXG4gIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPSdob21lJz5Ib21lPC9kaXY+O1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcblxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXG5cbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXG4gICAgTE9BREVEX01FU1NBR0VTOiAnTE9BREVEX01FU1NBR0VTJyxcbiAgICBTQVZFRF9NRVNTQUdFX0xPQ0FMTFk6J1NBVkVEX01FU1NBR0VfTE9DQUxMWScsXG4gICAgU0VBUkNIRURfSEFOR09VVDogJ1NFQVJDSEVEX0hBTkdPVVQnLFxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcblxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcbiAgICBcbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcblxuICAgIEhBTkdPVVRfUkVDSUVWRUQ6J0hBTkdPVVRfUkVDSUVWRUQnLFxuICAgIEhBTkdPVVRfU0VOVDonSEFOR09VVF9TRU5UJ1xuXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGhhbmdvdXRzOiBudWxsLFxuICBoYW5nb3V0OiBudWxsLFxuICBtZXNzYWdlczogbnVsbCxcbiAgc2VhcmNoOiAnJyxcbiAgdXNlcjogW10sXG4gIGxvYWRpbmc6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgbWVzc2FnZVRleHQ6ICcnLFxuICBvbmxpbmU6IGZhbHNlLFxuICB1bmRlbGl2ZXJlZDpbXVxufTtcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0FWRURfTUVTU0FHRV9MT0NBTExZOlxuICAgICAgaWYgKHN0YXRlLm1lc3NhZ2VzKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogWy4uLnN0YXRlLm1lc3NhZ2VzLCBhY3Rpb24ubWVzc2FnZV0gfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogW2FjdGlvbi5tZXNzYWdlXSB9O1xuICAgICAgfVxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBhY3Rpb24ubWVzc2FnZXMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VUZXh0OiBhY3Rpb24udGV4dCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgdXNlcnM6IGFjdGlvbi51c2VycyxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX05PVF9GT1VORDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5maWx0ZXIoKGcpID0+XG4gICAgICAgICAgZy51c2VybmFtZS5pbmNsdWRlcyhzdGF0ZS5zZWFyY2gpXG4gICAgICAgICksXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzZWFyY2g6IGFjdGlvbi5zZWFyY2ggfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFM6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUjpcbiAgICAgIGlmIChzdGF0ZS5oYW5nb3V0cykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSxcbiAgICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogW2FjdGlvbi5oYW5nb3V0XSxcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0OiBzdGF0ZS5oYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBhY3Rpb24udXNlcm5hbWUpLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfUkVDSUVWRUQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIGhhbmdvdXRzOiB1cGRhdGVIYW5nb3V0KHsgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLCBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCB9KVxuICAgICAgfTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuXG5cbmZ1bmN0aW9uIHVwZGF0ZUhhbmdvdXQoeyBoYW5nb3V0LCBoYW5nb3V0cyB9KSB7XG5cbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgY29uc3QgaGFuZ291dEV4aXN0cyA9IGhhbmdvdXRzLmZpbmQoZyA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKVxuICAgIGlmIChoYW5nb3V0RXhpc3RzKSB7XG4gICAgICByZXR1cm4gaGFuZ291dHMubWFwKGcgPT4ge1xuICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgIHJldHVybiBoYW5nb3V0XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGdcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtoYW5nb3V0cywgaGFuZ291dF1cbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIFtoYW5nb3V0cywgaGFuZ291dF1cbiAgfVxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5cbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXG5leHBvcnQgZnVuY3Rpb24gbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcbn1cbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCB1c2VybmFtZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSkge1xuICAvLyBzYXZlIHNlbGVjdGVkIHVzZXIgdG8gaGFuZ291dHNcbiAgY29uc3QgaGFuZ291dCA9IHsgLi4udXNlciwgc3RhdGU6ICdJTlZJVEUnIH07XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG5cbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICBgJHt1c2VybmFtZX0taGFuZ291dHNgLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoWy4uLmhhbmdvdXRzLCBoYW5nb3V0XSlcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xuICB9XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSLCBoYW5nb3V0IH0pO1xufVxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XG59XG4vL2ZpbHRlciBoYW5nb3V0IGFmdGVyIHNlYXJjaCBzdGF0ZSBjaGFuZ2VcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XG59XG5cbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgIGAvaGFuZ291dHMvZmluZD9zZWFyY2g9JHtzZWFyY2h9JnVzZXJuYW1lPSR7dXNlcm5hbWV9YFxuICAgICk7XG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcbiAgICAgIFxuICAgIH0gXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXJyID0gZXJyb3I7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XG4gXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcbiAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUywgbWVzc2FnZXMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZSh7ICBkaXNwYXRjaCwgbWVzc2FnZSx1c2VybmFtZSx0YXJnZXQgfSkge1xuIFxuICBjb25zdCBrZXkgPSBgJHt0YXJnZXR9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFsuLi5tZXNzYWdlcyx7Li4ubWVzc2FnZSx1c2VybmFtZX1dKSk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbey4uLm1lc3NhZ2UsdXNlcm5hbWV9XSkpO1xuICB9XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0FWRURfTUVTU0FHRV9MT0NBTExZLCBtZXNzYWdlIH0pO1xufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge1xuICB1c2VDb250ZXh0LFxuICB1c2VTdGF0ZSxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlRWZmZWN0LFxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuaW1wb3J0IHtcbiAgbG9hZEhhbmdvdXRzLFxuICBmaWx0ZXJIYW5nb3V0cyxcbiAgZmV0Y2hIYW5nb3V0LFxuICBsb2FkTWVzc2FnZXMsXG4gIHNhdmVNZXNzYWdlLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgeyBoYW5nb3V0IH0gPSBzdGF0ZTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh1c2VybmFtZSkge1xuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgfSwgW3VzZXJuYW1lXSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGhhbmdvdXQpIHtcbiAgICAgIC8vZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgICBsb2FkTWVzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCB9KTtcblxuICAgICAgLy9zYXZlIGhhbmdvdXQgdG8gbG9jYWxTdG9yYWdlXG4gICAgICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0taGFuZ291dHNgO1xuICAgICAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICAgICAgaWYgKCFoYW5nb3V0cykge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaGFuZ291dEV4aXN0ID0gaGFuZ291dHMuZmluZChcbiAgICAgICAgICAoZykgPT4gZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZVxuICAgICAgICApO1xuICAgICAgICBpZiAoaGFuZ291dEV4aXN0KSB7XG4gICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xuICAgICAgIFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXG5pbXBvcnQgeyBTdXNwZW5zZSwgbGF6eSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xuaW1wb3J0IHsgUm9vdFJvdXRlUHJvdmlkZXIsIFJvb3RSb3V0ZSB9IGZyb20gJy4uL3JvdXRlL3Jvb3Qtcm91dGVyJztcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIFJvdXRlIH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCBOYXZpZ2F0aW9uLCB7IE5hdkl0ZW0gfSBmcm9tICcuLi9uYXYvTmF2aWdhdGlvbic7XG5pbXBvcnQgQXV0aGVudGljYXRpb24gZnJvbSAnLi4vYXV0aC9BdXRoZW50aWNhdGlvbic7XG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnLi4vdGhlbWUvdGhlbWUtY29udGV4dCc7XG5pbXBvcnQgeyBEcmF3ZXJDb250ZW50IH0gZnJvbSAnLi4vbGF5b3V0L0RyYXdlckNvbnRlbnQnO1xuaW1wb3J0IHsgQXV0aENvbnRlbnQgfSBmcm9tICcuLi9hdXRoL0F1dGhDb250ZW50JztcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IEZvcm1Qcm92aWRlciB9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0JztcbmltcG9ydCB7IE90aGVyQ29udGVudCB9IGZyb20gJy4vT3RoZXJDb250ZW50JztcbmltcG9ydCB7IEhvbWUgfSBmcm9tICcuL0hvbWUnO1xuaW1wb3J0IHtXU29ja2V0UHJvdmlkZXJ9IGZyb20gJy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJ1xuaW1wb3J0IHtIYW5nb3V0c1Byb3ZpZGVyfSBmcm9tICcuLi9oYW5nb3V0cy9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJ1xuaW1wb3J0IHt1c2VBcHBDb250ZXh0LEFwcFJvdXRlfSBmcm9tICcuLi9hcHAtY29udGV4dC9hcHAtY29udGV4dCdcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4uL2hhbmdvdXRzJykpO1xuY29uc3QgR3JvdXAgPSBsYXp5KCgpID0+IGltcG9ydCgnLi4vZ3JvdXAvZ3JvdXAnKSk7XG5leHBvcnQgZnVuY3Rpb24gQXBwKCl7XG4gICAgY29uc3QgYXBwQ29udGV4dD11c2VBcHBDb250ZXh0KClcbiAgICBjb25zdCB7aW5pdGlhbFJvdXRlfT1hcHBDb250ZXh0WzBdXG4gICAgcmV0dXJuIDxBdXRoUHJvdmlkZXI+XG4gICAgPFdTb2NrZXRQcm92aWRlciB1cmwgPVwid3M6Ly9sb2NhbGhvc3Q6MzAwMC9oYW5nb3V0c1wiPlxuICAgICAgPEhhbmdvdXRzUHJvdmlkZXI+XG4gICAgPFJvb3RSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT0nLyc+XG4gICAgICA8Rm9ybVByb3ZpZGVyPlxuICAgICAgICA8VGhlbWVQcm92aWRlclxuICAgICAgICAgIGluaXRTdGF0ZT17e1xuICAgICAgICAgICAgcHJpbWFyeToge1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzYyMDBFRScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIEhlbHZldGljYSwgXCJBcmlhbFwiJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxOYXZpZ2F0aW9uXG4gICAgICAgICAgICBkcmF3ZXJDb250ZW50PXtcbiAgICAgICAgICAgICAgPERyYXdlckNvbnRlbnRcbiAgICAgICAgICAgICAgICBhdXRoQ29udGVudD17PEF1dGhDb250ZW50IC8+fVxuICAgICAgICAgICAgICAgIG90aGVyQ29udGVudD17PE90aGVyQ29udGVudCAvPn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TmF2SXRlbT5XRUIgQ09NPC9OYXZJdGVtPlxuICAgICAgICAgICBcbiAgICAgICAgICA8L05hdmlnYXRpb24+XG4gICAgICAgICAgPEFwcFJvdXRlIHBhdGg9Jy9hdXRoJz5cbiAgICAgICAgICAgIDxSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT0nL2xvZ2luJz5cbiAgICAgICAgICAgICAgPEF1dGhlbnRpY2F0aW9uIC8+XG4gICAgICAgICAgICA8L1JvdXRlUHJvdmlkZXI+XG4gICAgICAgICAgPC9BcHBSb3V0ZT5cblxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPScvJz5cbiAgICAgICAgICAgIDxIb21lIC8+XG4gICAgICAgICAgPC9BcHBSb3V0ZT5cblxuICAgICAgICAgIDxBcHBSb3V0ZSBwYXRoPScvaGFuZ291dHMnPlxuICAgICAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PmxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgICAgICA8SGFuZ291dHMgaW5pdGlhbFJvdXRlPXtpbml0aWFsUm91dGV9Lz5cbiAgICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgICAgPC9BcHBSb3V0ZT5cbiAgICAgICAgICA8QXBwUm91dGUgcGF0aD0nL2dyb3VwJz5cbiAgICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5sb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICAgICAgPEdyb3VwIC8+XG4gICAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgIDwvQXBwUm91dGU+XG4gICAgICAgICAgeycnfVxuICAgICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgICA8L0Zvcm1Qcm92aWRlcj5cbiAgICA8L1Jvb3RSb3V0ZVByb3ZpZGVyPlxuICAgIDwvSGFuZ291dHNQcm92aWRlcj5cbiAgICA8L1dTb2NrZXRQcm92aWRlcj5cbiAgPC9BdXRoUHJvdmlkZXI+XG59IiwiaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xyXG5pbXBvcnQgeyBoLCByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyBBcHBQcm92aWRlciB9IGZyb20gJy4uL2FwcC1jb250ZXh0L2FwcC1jb250ZXh0JztcclxuaW1wb3J0IHtBcHB9IGZyb20gJy4vQXBwJ1xyXG5yZW5kZXIoXHJcbiAgPEFwcFByb3ZpZGVyIHRpdGxlPSdXZWJjb20nIGluaXRTdGF0ZT17e3JvdXRlOicvaGFuZ291dHMnLGZlYXR1cmVSb3V0ZTonL2hhbmdvdXRzJ319PlxyXG4gICAgPEFwcC8+XHJcbiAgPC9BcHBQcm92aWRlcj4sXHJcbiAgZG9jdW1lbnQuYm9keVxyXG4pO1xyXG4iXSwibmFtZXMiOlsiZmV0Y2giLCJ0IiwidSIsInIiLCJpIiwibyIsImMiLCJmIiwiZSIsImEiLCJ2IiwibSIsIkUiLCJ4IiwiZCIsImgiLCJ3IiwiXyIsImciLCJhY3Rpb25UeXBlcyIsIkFQUF9ST1VURV9DSEFOR0VEIiwiRkVBVFVSRV9ST1VURV9DSEFOR0VEIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInJvdXRlIiwiZmVhdHVyZVJvdXRlIiwiQXBwQ29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VBcHBDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJFcnJvciIsIkZlYXR1cmVSb3V0ZSIsInByb3BzIiwiY2hpbGRyZW4iLCJwYXRoIiwicGF0aHMiLCJkaXNwYXRjaCIsImZpbmQiLCJwIiwidXNlQXBwUm91dGUiLCJvbkFwcFJvdXRlIiwiQXBwUm91dGUiLCJBcHBQcm92aWRlciIsImluaXRTdGF0ZSIsInVzZVJlZHVjZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJsIiwiTiIsIk0iLCJzIiwiUCIsImoiLCJIIiwiVCIsIiQiLCJxIiwiUm9vdFJvdXRlQ29udGV4dCIsInVzZVJvb3RSb3V0ZUNvbnRleHQiLCJSb290Um91dGVQcm92aWRlciIsImluaXRpYWxSb3V0ZSIsInJvb3RSb3V0ZSIsInNldFJvb3RSb3V0ZSIsInVzZVN0YXRlIiwiUm91dGVDb250ZXh0IiwidXNlUm91dGVDb250ZXh0IiwiUm91dGVQcm92aWRlciIsInNldFJvdXRlIiwiVGhlbWVDb250ZXh0IiwidXNlVGhlbWVDb250ZXh0IiwiVGhlbWVQcm92aWRlciIsInNldFN0YXRlIiwiQ09OTkVDVElORyIsIk9QRU4iLCJDTE9TSU5HIiwiQ0xPU0VEIiwiU09DS0VUX1JFQURZIiwiU09DS0VUX0VSUk9SIiwicmVhZHlTdGF0ZSIsInNvY2tldCIsImVycm9yIiwiVkFMVUVfQ0hBTkdFRCIsIkxPR0lOX1NUQVJURUQiLCJMT0dJTl9TVUNDRVNTIiwiTE9HSU5fRkFJTEVEIiwiTE9HT1VUX1NUQVJURUQiLCJMT0dPVVRfRkFJTEVEIiwiTE9HT1VUX1NVQ0NFU1MiLCJTSUdOVVBfU1RBUlRFRCIsIlNJR05VUF9TVUNDRVNTIiwiU0lHTlVQX0ZBSUxFRCIsIkNIQU5HRV9QQVNTV09SRF9TVEFSVEVEIiwiQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MiLCJDSEFOR0VfUEFTU1dPUkRfRkFJTEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVEFSVEVEIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9TVUNDRVNTIiwiUkVRVUVTVF9QQVNTX0NIQU5HRV9GQUlMRUQiLCJHT1RfVE9LRU5fRlJPTV9VUkwiLCJSRUNPVkVSX0xPQ0FMX0FVVEhfU1RBVEUiLCJlbWFpbCIsInBhc3N3b3JkIiwic3VjY2VzcyIsInVzZXJuYW1lIiwibG9hZGluZyIsImNvbmZpcm0iLCJjdXJyZW50IiwiZW1haWxvcnVzZXJuYW1lIiwidG9rZW4iLCJpc0xvZ2dlZEluIiwiaXNQYXNzd29yZENoYW5nZWQiLCJhdXRoRmVlZGJhY2siLCJhdXRoUmVkdWNlciIsIm5leHRTdGF0ZSIsInBheWxvYWQiLCJwcm9wTmFtZSIsInN1Y2Nlc3NNZXNzYWdlIiwibWVzc2FnZSIsInVzZXIiLCJBdXRoUm91dGVDb250ZXh0IiwiQXV0aFJvdXRlIiwiYXV0aFJvdXRlIiwidXNlQXV0aFJvdXRlQ29udGV4dCIsIkF1dGhSb3V0ZVByb3ZpZGVyIiwic2V0QXV0aFJvdXRlIiwiQXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsIkF1dGhQcm92aWRlciIsIldTb2NrZXRDb250ZXh0IiwidXNlV1NvY2tldENvbnRleHQiLCJXU29ja2V0UHJvdmlkZXIiLCJhdXRoQ29udGV4dCIsInVybCIsInNvY2siLCJXZWJTb2NrZXQiLCJvbm1lc3NhZ2UiLCJtc2ciLCJKU09OIiwicGFyc2UiLCJkYXRhIiwib25vcGVuIiwib25jbG9zZSIsIm9uZXJyb3IiLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyIiwiT25saW5lU3RhdHVzIiwiSXNPbmxpbmUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJJc09mZmxpbmUiLCJDb25uZWN0aW5nIiwiQ2xvc2luZyIsIk1lbnVXaGl0ZSIsIm9uQ2xpY2siLCJkZXZpY2UiLCJpZCIsImhhbmRsZU9uQ2xpY2siLCJjb25zb2xlIiwibG9nIiwiQXBwU2hlbGwiLCJBcHBCYXIiLCJ0aGVtZSIsInByaW1hcnkiLCJtaW5IZWlnaHQiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsImRpc3BsYXkiLCJ1c2VNZWRpYVF1ZXJ5Iiwic2V0V2lkdGgiLCJzZXRIZWlnaHQiLCJvcmllbnRhdGlvbiIsInNldE9yaWVudGF0aW9uIiwic2V0RGV2aWNlIiwiaGFuZGxlVmlld3BvcnRTaXplIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwiaGFuZGxlU2NyZWVuT3JpZW50YXRpb24iLCJzY3JlZW4iLCJhZGRFdmVudExpc3RlbmVyIiwidXNlVXNlck5hbWUiLCJ1c2VyTmFtZSIsInNldFVzZXJuYW1lIiwic2V0VG9rZW4iLCJzZXRFbWFpbCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJWQUxJRCIsIklOVkFMSUQiLCJJTkFDVElWRSIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTiIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJVU0VSTkFNRV9UQUtFTiIsIlJFR0lTVEVSRURfRU1BSUwiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiSU5WQUxJRF9QQVNTV09SRCIsIklOVkFMSURfRU1BSUwiLCJJTlZBTElEX1VTRVJOQU1FIiwiSU5WQUxJRF9FTVBUWV9TVFJJTkciLCJJTlZBTElEX1VTRVJOQU1FX09SX0VNQUlMIiwiUEFTU1dPUkRTX0RPX05PVF9NQVRDSCIsInBhc3N3b3JkUmVnZXgiLCJlbWFpbFJlZ2V4IiwidXNlcm5hbWVSZWdleCIsInZhbGlkYXRlRW1haWxDb25zdHJhaW50IiwiZW1haWxDb25zdHJhaW50IiwiUmVnRXhwIiwidGVzdCIsInZhbGlkYXRpb25UeXBlIiwidmFsaWRhdGlvblR5cGVzIiwidmFsaWRhdGlvblN0YXRlIiwidmFsaWRhdGlvbk1lc3NhZ2VzIiwiaXNDbGllbnRWYWxpZGF0aW9uVHlwZSIsInZhbGlkYXRlUGFzc3dvcmRDb25zdHJhaW50IiwicGFzc3dvcmRDb25zdHJhaW50IiwidmFsaWRhdGVVc2VyTmFtZUNvbnN0cmFpbnQiLCJ1c2VybmFtZUNvbnN0cmFpbnQiLCJ2YWxpZGF0ZUVtYWlsT3JVc2VybmFtZSIsInZhbGlkYXRlRW1wdHlTdHJpbmciLCJsZW5ndGgiLCJ2YWxpZGF0ZVBhc3N3b3JkTWF0Y2giLCJhdXRoIiwiSU5JVF9GT1JNX1ZBTElEQVRJT05fU1RBVEUiLCJSRVNFVF9WQUxJREFUSU9OX1NUQVRFIiwiSU5QVVRfQkxVUlJFRCIsIklOUFVUX0ZPQ1VTRUQiLCJTRVJWRVJfVkFMSURBVElPTiIsIkNMSUVOVF9WQUxJREFUSU9OIiwiSU5DX0lOUFVUX0NPVVROIiwiY3JlZGVudGlhbEludmFsaWQiLCJ1c2VybmFtZUlzVGFrZW4iLCJlbWFpbElzUmVnaXN0ZXJlZCIsInVzZXJuYW1lSW52YWxpZCIsInBhc3N3b3JkSW52YWxpZCIsImVtYWlsSW52YWxpZCIsImVtYWlsSXNOb3RSZWdpc3RlcmVkIiwiZW1wdHlTdHJpbmdOb3RWYWxpZCIsImVtYWlsb3J1c2VybmFtZU5vdFZhbGlkIiwidXNlcm5hbWVJc05vdFJlZ2lzdGVyZWQiLCJwYXNzd29yZERvTm90TWF0Y2giLCJ0b2tlbkV4cGlyZWQiLCJzZXJ2ZXJWYWxpZGF0aW9uUmFuZ2UiLCJzdGF0dXMiLCJjbGllbnRWYWxpZGF0aW9uIiwidmFsaWRhdGlvbiIsImNvbnN0VmFsVHlwZXMiLCJ2YWxpZGF0aW9ucyIsInJlc2V0SW5wdXRWYWxpZGF0aW9uU3RhdGUiLCJzZXJ2ZXJWYWxpZGF0aW9uIiwiaHR0cFN0YXR1cyIsInZhbGlkYXRpb25TdGF0ZXMiLCJ2YWx1ZUNoYW5nZWQiLCJsb2dpbiIsImZvcm1EaXNwYXRjaCIsInJlc3BvbnNlIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwibWV0aG9kIiwicmVzdWx0IiwianNvbiIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJlcnJvcnMiLCJmb3JFYWNoIiwic2lnbnVwIiwiYm9keSIsIkNvbnRlbnRUeXBlIiwiQWNjZXB0IiwibG9nb3V0IiwicmVtb3ZlSXRlbSIsImNoYW5nZVBhc3N3b3JkIiwiYXBpX3VybCIsImZvcmdvdFBhc3N3b3JkIiwiZ2V0VG9rZW5Gcm9tVXJsIiwicmVjb3ZlckxvY2FsQXV0aFN0YXRlIiwiUGhvbmVEcmF3ZXIiLCJsYXp5IiwiVGFibGV0RHJhd2VyIiwiTGFwdG9wRHJhd2VyIiwiRGVza3RvcERyYXdlciIsIk5hdmlnYXRpb24iLCJ3c29ja2V0Q29udGV4dCIsIm9wZW4iLCJzZXRPcGVuIiwiZHJhd2VyQ29udGVudCIsInRvZ2dsZURyYXdlciIsInRvIiwicHJldiIsIm5hdlRvVW5yZWFkIiwiU3VzcGVuc2UiLCJOYXZJdGVtIiwiTG9naW4iLCJDaGFuZ2VQYXNzd29yZCIsIkZvcmdvdFBhc3N3b3JkIiwiU2lnbnVwIiwiUHJvZmlsZSIsIkF1dGhGZWVkYmFjayIsIkF1dGhlbnRpY2F0aW9uIiwiRHJhd2VyQ29udGVudCIsImF1dGhDb250ZW50Iiwib3RoZXJDb250ZW50IiwiTGlzdCIsImJveFNpemluZyIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwiTGlzdEl0ZW0iLCJncmlkIiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImp1c3RpZnlJdGVtcyIsIkF1dGhDb250ZW50IiwiaGFuZGxlUm91dGUiLCJwcmV2ZW50RGVmYXVsdCIsInRhcmdldCIsIkF1dGhlZFN0YXRlIiwiaGFuZGxlTG9nT3V0IiwiYWxpZ25JdGVtcyIsImZsZXhEaXJlY3Rpb24iLCJ1c2VySWNvbiIsIm1hcmdpbkJvdHRvbSIsIlVuQXV0aGVkU3RhdGUiLCJmb3JtUmVkdWNlciIsImZvcm1TdGF0ZSIsImNvdW50IiwiRm9ybUNvbnRleHQiLCJ1c2VGb3JtQ29udGV4dCIsIkZvcm1Qcm92aWRlciIsIk90aGVyQ29udGVudCIsImFwcGNvbnRleHQiLCJIb21lIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BREVEX01FU1NBR0VTIiwiU0FWRURfTUVTU0FHRV9MT0NBTExZIiwiU0VBUkNIRURfSEFOR09VVCIsIlNFTEVDVEVEX0hBTkdPVVQiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiSEFOR09VVF9SRUNJRVZFRCIsIkhBTkdPVVRfU0VOVCIsImhhbmdvdXRzIiwiaGFuZ291dCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJ1bmRlbGl2ZXJlZCIsInRleHQiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIkZFVENIX1VTRVJfU1RBUlRFRCIsIkZFVENIX1VTRVJfU1VDQ0VTUyIsInVzZXJzIiwiSEFOR09VVF9OT1RfRk9VTkQiLCJGSUxURVJfSEFOR09VVFMiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsIlNFTEVDVEVEX1VTRVIiLCJ1cGRhdGVIYW5nb3V0IiwiaGFuZ291dEV4aXN0cyIsIm1hcCIsImxvYWRIYW5nb3V0cyIsInNlbGVjdEhhbmdvdXQiLCJzZWxlY3RVc2VyIiwic2VhcmNoSGFuZ291dHMiLCJmaWx0ZXJIYW5nb3V0cyIsImZldGNoSGFuZ291dCIsIm9rIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJzYXZlTWVzc2FnZSIsIkhhbmdvdXRDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJIYW5nb3V0c1Byb3ZpZGVyIiwiaGFuZ291dEV4aXN0IiwidXBkYXRlZCIsIkhhbmdvdXRzIiwiR3JvdXAiLCJBcHAiLCJhcHBDb250ZXh0IiwiYmFja2dyb3VuZCIsImNvbG9yIiwiZm9udEZhbWlseSIsInJlbmRlciIsImRvY3VtZW50Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE9BQU8sR0FBRztBQUNkLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixJQUFJLElBQUk7QUFDekMsRUFBRSxRQUFRLEVBQUUsUUFBUSxJQUFJLElBQUksSUFBSSxVQUFVLElBQUksTUFBTTtBQUNwRCxFQUFFLElBQUk7QUFDTixJQUFJLFlBQVksSUFBSSxJQUFJO0FBQ3hCLElBQUksTUFBTSxJQUFJLElBQUk7QUFDbEIsSUFBSSxDQUFDLFdBQVc7QUFDaEIsTUFBTSxJQUFJO0FBQ1YsUUFBUSxJQUFJLElBQUksR0FBRTtBQUNsQixRQUFRLE9BQU8sSUFBSTtBQUNuQixPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDbEIsUUFBUSxPQUFPLEtBQUs7QUFDcEIsT0FBTztBQUNQLEtBQUssR0FBRztBQUNSLEVBQUUsUUFBUSxFQUFFLFVBQVUsSUFBSSxJQUFJO0FBQzlCLEVBQUUsV0FBVyxFQUFFLGFBQWEsSUFBSSxJQUFJO0FBQ3BDLEVBQUM7QUFDRDtBQUNBLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUN6QixFQUFFLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztBQUNyRCxDQUFDO0FBQ0Q7QUFDQSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7QUFDekIsRUFBRSxJQUFJLFdBQVcsR0FBRztBQUNwQixJQUFJLG9CQUFv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LENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNqQixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUdBLFFBQUs7QUFDcEIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQU87QUFDeEIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQU87QUFDeEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVE7QUFDMUI7O0FDbmdCRyxJQUFDLENBQUMsQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9FQUFvRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLHlCQUF5QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFzTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQXVELENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBNW9TLElBQUlDLEdBQUMsQ0FBQ0MsR0FBQyxDQUFDQyxHQUFDLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUNDLEdBQUMsQ0FBQyxFQUFFLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVNDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDUixHQUFDLENBQUMsQ0FBQyxDQUFDRSxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUNGLEdBQUMsQ0FBQyxHQUFHLEdBQUdBLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU1MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9QLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDUSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDVSxHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQ0YsR0FBQyxDQUFDVCxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUVZLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDWCxHQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBbUYsU0FBU1ksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9WLEdBQUMsQ0FBQyxDQUFDLENBQUNXLEdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUEyRyxTQUFTQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDTCxHQUFDLENBQUNULEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU9ZLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBc0QsU0FBU0csR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDZCxHQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUNRLEdBQUMsQ0FBQ1QsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQTROLFNBQVNlLEdBQUMsRUFBRSxDQUFDWixHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUNhLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNiLEdBQUMsQ0FBQyxHQUFFLENBQUMsU0FBU2EsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRSxDQUFDLFNBQVNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0QsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQ04sR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNMLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ2dCLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUNYLEdBQUMsRUFBRUEsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBR0YsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRUYsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUNBLEdBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRWMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQ0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1YsR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDQyxHQUFDLEVBQUVB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LENBQUMsU0FBU0gsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSUQsR0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPQyxHQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRUEsR0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ3NDLENBQUMsQ0FBQyxDQUE4UyxJQUFJbEMsR0FBQyxDQUFDUCxDQUFDLENBQUMsR0FBRyxDQUFDQSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ08sR0FBQyxFQUFFQSxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBbVMsSUFBaVJtQyxHQUFDLENBQUMxQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ00sR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTcUMsR0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBU0MsR0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUM3QyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDMEMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDQyxHQUFDLENBQUMsU0FBUyxDQUFDLElBQUlGLENBQUMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUNFLEdBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSUosQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUNJLEdBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQ3hDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQ3dDLEdBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUNBLEdBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJQyxHQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBb2UsSUFBSUMsR0FBQyxDQUFDLGtPQUFrTyxDQUFDTixDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxJQUFJTyxHQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLENBQTZNLElBQUksQ0FBQyxDQUFDaEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTaUQsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDakQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSWtELEdBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDbEQsQ0FBQyxDQUFDLEtBQUssQ0FBQ0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUNnRCxHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHRSxHQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDQSxHQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsQ0FBQyxHQUFHN0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzBDLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcs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
