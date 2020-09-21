const { errorMonitor } = require("../app-monitor/wsocket");
const { testWebSocket } = require("./testWebSocket");
const hangoutsHandler = require("../hangouts/wsocket/hangoutHandler");
const url = require("url");

module.exports.unauthedHandler = async function ({
  ws,
  request,
  connections,
  collection,
}) {
  //
  try {
    debugger;
    switch (true) {
      case request.url.includes("hangout-app"):
        debugger;
        unAuthedHangoutApp({ ws, request });
        break;
      case request.url.includes("websocket-app"):
        debugger;
        testWebSocket({ ws, request });
        break;
      default:
        throw "No socket handler provided";
    }
  } catch (error) {
    debugger;
  }
};

function unAuthedHangoutApp({ ws, request }) {
  try {
    debugger;
    let connections = {};
    let userone = JSON.parse(url.parse(request.url, true).query.userone);
    let usertwo = JSON.parse(url.parse(request.url, true).query.usertwo);

    let peers = [userone, usertwo];
    connections[`${userone.user.username}-${userone.user.browserId}`] = ws;
    connections[`${usertwo.user.username}-${usertwo.user.browserId}`] = ws;
    debugger;
    ws.on("message", (socketMessage) => {
      debugger;
      const {
        data: {
          sender, ////
          hangout: { target },
        },
      } = JSON.parse(socketMessage);
      debugger;
      const targetUser = peers.find((p) => p.user.username === target);
      const senderUser = peers.find((p) => p.user.username === sender);
      debugger;

      hangoutsHandler({
        socketMessage,
        connections,
        ws,
        targetUser,
        senderUser,
        cb: () => {},
      });
    });
    ws.on("close", () => {
      delete connections[userone.user.username];
      delete connections[usertwo.user.username];
      console.log("socket closed by", userone.username);
    });
  } catch (error) {
    debugger;
  }
}
