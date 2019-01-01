const { errorMonitor } = require("../app-monitor/wsocket");
const { testWebSocket } = require("./testWebSocket");
const url = require("url");
// const {
//   unAuthedHangoutWsAndMongoDB,
// } = require("../hangouts/wsocket/for-test/unAuthedHangoutWsAndMongoDB");
// const {
//   unAuthedHangoutWsApp,
// } = require("../hangouts/wsocket/for-test/unauthedHangoutWsHandler");
const { hangoutHandlerNew } = require("../hangouts/wsocket/index");
const { undefinedArguments } = require("../helpers");

module.exports.unauthedHandlers = async function ({
  ws,
  request,
  connections,
  peers,
}) {
  try {
    undefinedArguments({ ws, request, connections, peers });

    switch (true) {
      case request.url.includes("hangout-app"):
        let username = url.parse(request.url, true).query.username;
        let browserId = url.parse(request.url, true).query.browserId;

        if (request.url.includes("mongodb")) {
          hangoutHandlerNew({
            ws,
            connections,
            persist: true,
            username,
            browserId,
          });

          //unAuthedHangoutWsAndMongoDB({ ws, request, connections });
        } else {
          hangoutHandlerNew({
            ws,
            connections,
            persist: false,
            username,
            browserId,
          });
          //unAuthedHangoutWsApp({ ws, request, connections, peers });
        }

        break;
      case request.url.includes("websocket-app"):
        testWebSocket({ ws, request });
        break;
      default:
        throw "No socket handler provided";
    }
  } catch (error) {
    throw error;
  }
};
