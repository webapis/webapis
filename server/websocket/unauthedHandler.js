const { errorMonitor } = require("../app-monitor/wsocket");
const { testWebSocket } = require("./testWebSocket");
const hangoutsHandler = require("../hangouts/wsocket/hangoutHandler");
const { handlePersistance } = require("../hangouts/wsocket/handlePersistance");
const url = require("url");

module.exports.unauthedHandler = async function ({
  ws,
  request,
  connections,
  peers,
}) {
  //
  try {
    switch (true) {
      case request.url.includes("hangout-app"):
        if (request.url.includes("mongodb")) {
          debugger;
          unAuthedHangoutApp({
            ws,
            request,
            connections,
            peers,
            cb: handlePersistance,
          });
        } else {
          unAuthedHangoutApp({ ws, request, connections, peers });
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

function unAuthedHangoutApp({
  ws,
  request,
  connections,
  peers,
  cb = () => {},
}) {
  try {
    debugger;

    //
    let senderUser = JSON.parse(url.parse(request.url, true).query.user);
    peers.push(senderUser);
    connections[
      `${senderUser.user.username}-${senderUser.user.browserId}`
    ] = ws;

    ws.on("message", (socketMessage) => {
      debugger; //
      const {
        data: {
          sender, ////
          hangout: { target },
        },
      } = JSON.parse(socketMessage);
      debugger;
      let targetUser = peers.find((p) => p.user.username === target);

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
      delete connections[
        `${senderUser.user.username}-${senderUser.user.browserId}`
      ];

      console.log("socket closed by", senderUser.user.username);
    });
  } catch (error) {
    debugger;
  }
}
