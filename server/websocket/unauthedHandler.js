const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const { MongoClient } = require("mongodb");
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
          unAuthedHangoutWsAndMongoDB({ ws, request, connections });
        } else {
          unAuthedHangoutWsApp({ ws, request, connections, peers });
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

function unAuthedHangoutWsApp({
  ws,
  request,
  connections,
  peers,
  cb = () => {},
}) {
  try {
    debugger;

    let senderUser = JSON.parse(url.parse(request.url, true).query.user);
    peers.push(senderUser);
    connections[
      `${senderUser.user.username}-${senderUser.user.browserId}`
    ] = ws;

    ws.on("message", (socketMessage) => {
      debugger;
      const {
        data: {
          sender,
          hangout: { target },
        },
      } = JSON.parse(socketMessage);
      debugger;
      let targetUser = peers.find((p) => p.user.username === target);

      hangoutsHandler({
        socketMessage,
        connections,
        ws,
        targetUser: targetUser.user,
        senderUser: senderUser.user,
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

async function unAuthedHangoutWsAndMongoDB({ ws, request, connections }) {
  try {
    debugger;
    const client = await new MongoClient(dbUrl, { useUnifiedTopology: true });
    await client.connect();
    const collection = await client.db("auth").collection("users");
    const {
      user: { username },
    } = JSON.parse(url.parse(request.url, true).query.user);
    const senderUser = await collection.findOne({ username });
    debugger;
    connections[
      `${senderUser.username}-${senderUser.browsers[0].browserId}`
    ] = ws;
    //
    ws.on("message", async (socketMessage) => {
      debugger;
      const {
        data: {
          sender,
          hangout: { target },
        },
      } = JSON.parse(socketMessage);
      debugger;
      let targetUser = await collection.findOne({ username: target });
      debugger;
      hangoutsHandler({
        socketMessage,
        connections,
        ws,
        targetUser,
        senderUser,
        cb: handlePersistance,
      });
    });
    ws.on("close", () => {
      delete connections[
        `${senderUser.username}-${senderUser.browsers[0].browserId}`
      ];

      console.log("socket closed by", senderUser.username);
    });
  } catch (error) {
    debugger;
  }
}
