const { authedHandlers } = require("./authedHandlers");
const { unauthedHandlers } = require("./unauthedHandlers");
const url = require("url");

const EventEmitter = require("events");
const WebSocket = require("ws");
let connections = {};
let peers = [];
module.exports = wsocket = new EventEmitter();

module.exports = async function (server, client) {
  const collection = await client.db("auth").collection("users");
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async function connection(ws, request) {
    if (request.url.includes("unauthed-msg")) {
      unauthedHandlers({ ws, request, connections, peers });
    } else if (request.url.includes("authed-msg")) {
      authedHandlers({ request, ws, connections, collection });
    } else {
      throw "proper url for websocket not provided";
    }
  });
};
//
/*
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
let testconnections={}
module.exports = async function (server, client) {
  const collection = await client.db("auth").collection("users");
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async function connection(ws, request) {
    //FIXME :HG same user signs in from multiple devices at the same time
    if (request.url.includes("unauthed-msg")) {
      let uname = url.parse(request.url, true).query.username;
      testconnections[uname] = ws;

      ws.on('message',function(message){

      })
      //
    } else if (request.url.includes("authed-msg")) {/////-------------------------?
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
            const err = error;//
            throw new Error(error);
          }
        });
        ws.on("close", function () {
          console.log("connection closed:", username);
          delete connections[`${username}-${browserId}`];
         
        });
      } catch (error) {
        const err = error;
      }
    } else if (request.url.includes("monitor")) {
      console.log("monitor socket connected");

      errorMonitor({ ws });
    }
  });
};
//

*/
