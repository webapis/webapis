const authOperation = require("./auth/index");
const hangoutsOperation = require("./hangouts/http");
const usersOperation = require("./users");
const serveStatic = require("./serve-static/index");
const appMonitorOperations = require("./app-monitor/http");
const servePassReset = require("./serve-static/serve-pass-reset");

module.exports = function httpRoute(client) {
  return async function (req, res) {
    const { url } = req;
    req.auth = null;
    res.on("end", () => {
      clnt.close();
    });
    req.client = client;
    res.setHeader("Access-Control-Allow-Origin", "*");
    let data = [];

    let responseHeader = {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
      "access-control-allow-headers": "*",
      "access-control-max-age": 10,
      "Content-Type": "application/json",
    };
    switch (req.method) {
      case "OPTIONS":
        res.writeHead(200, responseHeader);
        res.end();
        break;
      case "POST":
      case "PUT":
      case "DELETE":
        req.on("data", (chunk) => {
          data.push(chunk);
        });
        req.on("end", () => {
          if (data.length > 0) {
            const body = JSON.parse(data);
            req.body = body;
          }
          route({ url, req, res });
        });
        break;
      case "GET":
        route({ url, req, res });
        break;
      default:
        debugger;
        throw new Error("No operation is provied");
    }
  };
};

//
function route({ url, req, res }) {
  if (url.includes("monitor")) {
    debugger;
  }
  const authRegex = /.*\/auth\/.*/;
  const resetRegex = /.*\/reset\/.*/;
  const usersRegex = /.*\/users\/.*/;
  const hangoutsRegex = /.*\/hangouts\/.*/;
  const appMonitorRegex = /.*\/monitor\/.*/;
  switch (true) {
    case authRegex.test(url):
      authOperation(req, res);
      break;

    case resetRegex.test(url):
      servePassReset(req, res);
      break;

    case usersRegex.test(url):
      usersOperation(req, res);
      break;
    case hangoutsRegex.test(url):
      hangoutsOperation(req, res);
      break;
    case appMonitorRegex.test(url):
      appMonitorOperations(req, res);
      break;
    default:
      serveStatic(req, res);
  }
}
