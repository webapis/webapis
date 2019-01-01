const jwt = require("jsonwebtoken");
const url = require("url");
const cookie = require("cookie");
const { undefinedArguments } = require("../helpers");
// const {
//   authedHangoutHandler,
// } = require("../hangouts/wsocket/authedHangoutHandler");
const { hangoutHandlerNew } = require("../hangouts/wsocket/index");
module.exports.authedHandlers = async function ({
  request,
  connections,
  ws,
  collection,
}) {
  try {
    undefinedArguments({ request, connections, ws, collection });
    const token = cookie.parse(request.headers["cookie"]);

    let uname = url.parse(request.url, true).query.username;
    let browserId = url.parse(request.url, true).query.browserId;

    const decoded = await jwt.verify(token[uname], process.env.secret);

    const { username } = decoded;

    console.log(username, "connected from", browserId);
    const senderUser = await collection.findOne({ username });

    connections[`${username}-${browserId}`] = ws;
    switch (true) {
      case request.url.includes("hangouts"):
        hangoutHandlerNew({
          ws,
          connections,
          persist: true,
          username,
          browserId,
        });
        break;
      case request.url.includes("webrtc"):
        //next
        break;
      default:
        throw "No url for authed url provided";
    }

    ws.on("close", function () {
      console.log("connection closed:", username);
      delete connections[`${username}-${browserId}`];
    });
  } catch (error) {
    const err = error;
  }
};
