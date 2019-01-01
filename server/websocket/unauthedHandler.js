const { errorMonitor } = require("../app-monitor/wsocket");
const { testWebSocket } = require("./testWebSocket");
const hangoutsHandler = require("../hangouts/wsocket/hangoutHandler");
const url = require("url");
let userone = null;
let usetwo = null;
let peers = [];
module.exports.unauthedHandler = async function ({
  ws,
  request,
  connections,
  collection,
}) {
  try {
    //let uname = url.parse(request.url, true).query.username;
    if (request.url.includes("hangout-app")) {
      debugger;
      userone = JSON.parse(url.parse(request.url, true).query.userone);
      usertwo = JSON.parse(url.parse(request.url, true).query.usertwo);
      connections[`${userone.user.username}-${userone.user.browserId}`] = ws;
      connections[`${usertwo.user.username}-${usertwo.user.browserId}`] = ws;
      peers.push(userone, usertwo);
      debugger;
    }
    //  connections[uname] = ws;
    // console.log("socket connected to", uname);
    ws.on("message", function unauthedMessageRecieved(message) {
      const socketMessage = JSON.parse(message);

      debugger;
      switch (socketMessage.type) {
        case "test-websocket":
          debugger;
          testWebSocket({ socketMessage, ws, connections });
          break;
        case "HANGOUT":
          const {
            data: {
              sender,
              hangout: { target },
            },
          } = socketMessage;
          const targetUser = peers.find((p) => p.user.username === target);
          const senderUser = peers.find((p) => p.user.username === sender);
          debugger;
          hangoutsHandler({
            socketMessage,
            connections,
            ws,
            collection,
            targetUser,
            senderUser,
            cb: () => {},
          });
          break;
        case "error-monitor":
          errorMonitor();
          break;
        default:
      }
    });
    //
    ws.on("close", function unauthedConnectionClosed() {
      delete connections[userone.user.username];
      delete connections[usertwo.user.username];
      console.log("socket closed by", userone.username);
    });
  } catch (error) {
    debugger;
  }
};
