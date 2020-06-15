var fs = require('fs');
var path = require('path');
const url = require('url');
export default function serverPassReset(request, response) {

  const pathname = url.parse(request.url, true).pathname;



  var filePath = '.' + pathname;

  if (filePath == './reset/passresetlink') {
   
    filePath = '/changepassword.html';
  }
  

  var extname = String(path.extname(filePath)).toLowerCase();

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
    
    normailzie = path.normalize(
      __dirname +
        `../../../apps/${process.env.appName}/build/changepassword.html`
    );
  } else {
    
    normailzie = path.normalize(
      __dirname +
        `../../../apps/${process.env.appName}/build/${pathname.replace(
          '/reset/',
          ''
        )}`
    );
    
  }

  fs.readFile(normailzie, function (error, content) {
    
    if (error) {
      
      if (error.code == 'ENOENT') {
        
        fs.readFile('./404.html', function (error, content) {
          response.writeHead(404, { 'Content-Type': 'text/html' });
          response.end(content, 'utf-8');
        });
      } else {
        
        response.writeHead(500);
        response.end(
          'Sorry, check with the site admin for error: ' + error.code + ' ..\n'
        );
      }
    } else {
      
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
}
//