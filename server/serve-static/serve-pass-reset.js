var fs = require('fs');
var path = require('path');
const url = require('url');
export default function serverPassReset(request, response) {

  const pathname = url.parse(request.url, true).pathname;

  debugger;

  var filePath = '.' + pathname;
  debugger;
  if (filePath == './reset/passresetlink') {
    debugger;
    filePath = '/changepassword.html';
  }
  

  var extname = String(path.extname(filePath)).toLowerCase();
  debugger;
  var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
  };

  var contentType = mimeTypes[extname] || 'application/octet-stream';

  let normailzie = '';
  if (filePath === '/changepassword.html') {
    debugger;
    normailzie = path.normalize(
      __dirname +
        `../../../apps/${process.env.appName}/build/changepassword.html`
    );
  } else {
    debugger;
    normailzie = path.normalize(
      __dirname +
        `../../../apps/${process.env.appName}/build/${pathname.replace(
          '/reset/',
          ''
        )}`
    );
    debugger;
  }

  fs.readFile(normailzie, function (error, content) {
    debugger;
    if (error) {
      debugger;
      if (error.code == 'ENOENT') {
        debugger;
        fs.readFile('./404.html', function (error, content) {
          response.writeHead(404, { 'Content-Type': 'text/html' });
          response.end(content, 'utf-8');
        });
      } else {
        debugger;
        response.writeHead(500);
        response.end(
          'Sorry, check with the site admin for error: ' + error.code + ' ..\n'
        );
      }
    } else {
      debugger;
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
}
//