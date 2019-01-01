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
    debugger;
    peers.push(senderUser);
    connections[`${senderUser.username}-${senderUser.browserId}`] = ws;
    debugger;
    ws.on("message", (socketMessage) => {
      const {
        data: {
          sender,
          hangout: { target },
        },
      } = JSON.parse(socketMessage);

      let targetUser = peers.find((p) => p.username === target);
      debugger; //
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
      delete connections[`${senderUser.username}-${senderUser.browserId}`];

      console.log("socket closed by", senderUser.username);
    });
  } catch (error) {
    throw error;
  }
};
