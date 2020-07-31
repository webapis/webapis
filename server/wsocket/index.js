const hangoutsHandler = require("../hangouts/wsocket");
const { errorMonitor } = require("../app-monitor/wsocket");
const {
  onLineStateChangeHandler,
} = require("../hangouts/wsocket/onLineStateChangeHandler");

const url = require("url");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const EventEmitter = require("events");
const WebSocket = require("ws");
module.exports = wsocket = new EventEmitter();
let connections = {};

module.exports = async function (server, client) {
  const collection = await client.db("auth").collection("users");
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async function connection(ws, request) {
    //FIXME :HG same user signs in from multiple devices at the same time
    if (request.url.includes("hangouts")) {
      try {
        debugger;
        const token = cookie.parse(request.headers["cookie"]);

        let uname = url.parse(request.url, true).query.username;

        const decoded = await jwt.verify(token[uname], process.env.secret);

        const { username } = decoded;

        console.log(username, "connected");
        const user = await collection.findOne({ username });

        ws.user = user;
        connections[username] = ws;

        onLineStateChangeHandler({ connections, ws, client });
        ws.on("message", function incoming(message) {
          console.log("recieved,", message);
          try {
            const hangout = JSON.parse(message);
            hangoutsHandler({ hangout, connections, ws, client });
          } catch (error) {
            const err = error;

            throw new Error(error);
          }
        });
        ws.on("close", function () {
          console.log("connection closed:", username);
          delete connections[username];
        });
      } catch (error) {
        const err = error;
        debugger;
      }
    } else if (request.url.includes("monitor")) {
      console.log("monitor socket connected");
      errorMonitor({ ws });
    }
  });
};
//
