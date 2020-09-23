const { errorMonitor } = require("../app-monitor/wsocket");
const { testWebSocket } = require("./testWebSocket");
const hangoutsHandler = require("../hangouts/wsocket/hangoutHandler");
const { handlePersistance } = require("../hangouts/wsocket/handlePersistance");
const url = require("url");

module.exports.unauthedHandler = async function ({ ws, request, connections }) {
  //
  try {
    switch (true) {
      case request.url.includes("hangout-app"):
        if (request.url.includes("mongodb")) {
          unAuthedHangoutApp({ ws, request, cb: handlePersistance });
        } else {
          unAuthedHangoutApp({ ws, request });
        }

        break;
      case request.url.includes("websocket-app"):
        testWebSocket({ ws, request });
        break;
      default:
        throw "No socket handler provided";
    }
  } catch (error) {}
};

function unAuthedHangoutApp({ ws, request, cb = () => {} }) {
  try {
    let connections = {};
    let userone = JSON.parse(url.parse(request.url, true).query.userone);
    let usertwo = JSON.parse(url.parse(request.url, true).query.usertwo);

    let peers = [userone, usertwo];
    connections[`${userone.user.username}-${userone.user.browserId}`] = ws;
    connections[`${usertwo.user.username}-${usertwo.user.browserId}`] = ws;

    ws.on("message", (socketMessage) => {
      const {
        data: {
          sender, ////
          hangout: { target },
        },
      } = JSON.parse(socketMessage);

      const targetUser = peers.find((p) => p.user.username === target);
      const senderUser = peers.find((p) => p.user.username === sender);

      hangoutsHandler({
        socketMessage,
        connections,
        ws,
        targetUser,
        senderUser,
        cb,
      });
    });
    ws.on("close", () => {
      delete connections[userone.user.username];
      delete connections[usertwo.user.username];
      console.log("socket closed by", userone.username);
    });
  } catch (error) {}
}
