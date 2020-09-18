const { errorMonitor } = require("../app-monitor/wsocket");
const { testWebSocket } = require("./testWebSocket");
const hangoutsHandler = require("../hangouts/wsocket");
const url = require("url");
module.exports.unauthedHandler = async function ({
  ws,
  request,
  connections,
  collection,
}) {
  try {
    let uname = url.parse(request.url, true).query.username;
    connections[uname] = ws;
    console.log("socket connected to", uname);
    ws.on("message", function unauthedMessageRecieved(message) {
      const msg = JSON.parse(message);
      debugger;
      switch (msg.type) {
        case "test-websocket":
          debugger;
          testWebSocket({ message: msg, ws, connections, sender: uname });
          break;
        case "HANGOUT":
          hangoutsHandler({ data, connections, ws, collection });
          break;
        case "error-monitor":
          errorMonitor();
          break;
        default:
      }
    });

    ws.on("close", function unauthedConnectionClosed() {
      delete connections[uname];
      console.log("socket closed by", uname);
    });
  } catch (error) {}
};
