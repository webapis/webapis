const url = require("url");
const { undefinedArguments } = require("../../../helpers");
const { hangoutsHandler } = require("../hangoutHandler");
module.exports.unAuthedHangoutWsApp = function ({
  ws,
  request,
  connections,
  peers,
  cb = () => {},
}) {
  try {
    undefinedArguments({ ws, request, connections, peers, cb });
    let senderUser = JSON.parse(url.parse(request.url, true).query.user);

    peers.push(senderUser);
    connections[`${senderUser.username}-${senderUser.browserId}`] = ws;

    ws.on("message", (socketMessage) => {
      const {
        data: { type },
      } = JSON.parse(socketMessage);

      if (type === "HANGOUT") {
        const {
          data: {
            hangout: { target },
          },
        } = JSON.parse(socketMessage);
        let targetUser = peers.find((p) => p.username === target);
        hangoutsHandler({
          socketMessage,
          connections,
          ws,
          targetUser,
          senderUser,
          cb,
        });
      } else if (type === "OFFLINE_HANGOUTS") {
        const {
          data: { hangouts },
        } = JSON.parse(socketMessage);
        hangouts.forEach((hangout) => {
          const { target } = hangout;
          let targetUser = peers.find((p) => p.username === target);
          hangoutsHandler({
            socketMessage,
            connections,
            ws,
            targetUser,
            senderUser,
            cb,
          });
        });
        const msg = {
          data: {
            type: "OFFLINE_ACKHOWLEDGEMENT",
          },
          type: "HANGOUT",
        };
        let senderBrowsers = senderUser.browsers;
        senderBrowsers.forEach((browser) => {
          const senderOnline =
            connections[`${senderUser.username}-${browser.browserId}`];
          if (senderOnline) {
            senderOnline.send(JSON.stringify(msg));
          }
        });
      }
    });
    ws.on("close", () => {
      delete connections[`${senderUser.username}-${senderUser.browserId}`];

      console.log("socket closed by", senderUser.username);
    });
  } catch (error) {
    throw error;
  }
};
