var fs = require("fs");
var path = require("path");

export default function serveStatic(request, response) {
  // console.log('process.env.appName',`${__dirname}../apps/${process.env.appName}/build/index.html`)
  // console.log('request ', request.url);

  var filePath = "." + request.url;
  if (filePath == "./") {
    filePath = "/index.html";
  }
  //
  var extname = String(path.extname(filePath)).toLowerCase();
  var mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  };

  var contentType = mimeTypes[extname] || "application/octet-stream";

  let normailzie = "";
  if (filePath === "/index.html") {
    normailzie = path.normalize(
      __dirname + `../../../builds/${process.env.appName}/build/index.html`
    );
  } else {
    normailzie = path.normalize(
      __dirname + `../../../builds/${process.env.appName}/build/${request.url}`
    );
  }

  fs.readFile(normailzie, function (error, content) {
    if (error) {
      if (error.code == "ENOENT") {
        fs.readFile("./404.html", function (error, content) {
          response.writeHead(404, { "Content-Type": "text/html" });
          response.end(content, "utf-8");
        });
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
      }
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
}
