const url = require("url");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const { MongoClient } = require("mongodb");
const { handlePersistance } = require("../handlePersistance");
const { undefinedArguments } = require("../../../helpers");
const { hangoutsHandler } = require("../hangoutHandler");
module.exports.unAuthedHangoutWsAndMongoDB = async function ({
  ws,
  request,
  connections,
}) {
  try {
    undefinedArguments({ ws, request, connections });
    const client = await new MongoClient(dbUrl, { useUnifiedTopology: true });
    await client.connect();
    const collection = await client.db("auth").collection("users");
    const { username } = JSON.parse(url.parse(request.url, true).query.user);
    const senderUser = await collection.findOne({ username });

    connections[
      `${senderUser.username}-${senderUser.browsers[0].browserId}`
    ] = ws;
    //
    ws.on("message", async (socketMessage) => {
      const {
        data: {
          sender,
          hangout: { target },
        },
      } = JSON.parse(socketMessage);

      let targetUser = await collection.findOne({ username: target });

      hangoutsHandler({
        collection,
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
    throw error;
  }
};
