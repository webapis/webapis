const { errorMonitor } = require("../app-monitor/wsocket");
const { testWebSocket } = require("./testWebSocket");
const {
  unAuthedHangoutWsAndMongoDB,
} = require("../hangouts/wsocket/for-test/unAuthedHangoutWsAndMongoDB");
const {
  unAuthedHangoutWsApp,
} = require("../hangouts/wsocket/for-test/unauthedHangoutWsHandler");

const { undefinedArguments } = require("../helpers");

module.exports.unauthedHandlers = async function ({
  ws,
  request,
  connections,
  peers,
}) {
  //
  try {
    undefinedArguments({ ws, request, connections, peers });
    switch (true) {
      case request.url.includes("hangout-app"):
        if (request.url.includes("mongodb")) {
          unAuthedHangoutWsAndMongoDB({ ws, request, connections });
        } else {
          unAuthedHangoutWsApp({ ws, request, connections, peers });
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
