const {
  onLineStateChangeHandler,
} = require("../hangouts/wsocket/onLineStateChangeHandler");
const hangoutsHandler = require("../hangouts/wsocket");
const jwt = require("jsonwebtoken");
const url = require("url");
const cookie = require("cookie");
module.exports.authedHandler = async function ({ request, connections, ws }) {
  try {
    const token = cookie.parse(request.headers["cookie"]);

    let uname = url.parse(request.url, true).query.username;
    let browserId = url.parse(request.url, true).query.browserId;

    const decoded = await jwt.verify(token[uname], process.env.secret);

    const { username } = decoded;

    console.log(username, "connected from", browserId);
    const user = await collection.findOne({ username });

    ws.user = user;

    connections[`${username}-${browserId}`] = ws;

    onLineStateChangeHandler({ connections, ws, client, browserId });
    ws.on("message", function incoming(message) {
      console.log("recieved,", message);
      try {
        const hangout = JSON.parse(message);
        hangoutsHandler({ hangout, connections, ws, client });
      } catch (error) {
        const err = error; //
        throw new Error(error);
      }
    });
    ws.on("close", function () {
      console.log("connection closed:", username);
      delete connections[`${username}-${browserId}`];
    });
  } catch (error) {}
};
