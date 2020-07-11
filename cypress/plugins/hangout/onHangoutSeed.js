/* eslint-disable no-undef */
const stateMapper = require("./stateMapper");
const url = "mongodb://localhost:27017";
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
module.exports = async function onHangoutSeed({
  hangout,
  senderUsername,
  targetOnline = false,
}) {
  try {
    const clnt = await client.connect();
    const database = clnt.db("auth");
    const collection = database.collection("users");
    const { senderState, targetState } = stateMapper({
      command: hangout.command,
    });
    const { username, email, message, offline, timestamp } = hangout;
    const sender = {
      username,
      email,
      message,
      timestamp,
      state: senderState,
    };

    debugger;
    const target = {
      username: senderUsername,
      email: "demo@gmail.com",
      message,
      timestamp,
      state: targetState,
    };
    if (hangout.command === "INVITE") {
      await collection.updateOne(
        { username: senderUsername },
        { $push: { hangouts: sender } }
      );

      // update hangout on target
      await collection.updateOne({ username }, { $push: { hangouts: target } });
    } else {
      // update hangout on sender
      await collection.updateOne(
        { username: senderUsername, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );

      // update hangout on target
      await collection.updateOne(
        { username, "hangouts.username": senderUsername },
        { $set: { "hangouts.$": target } }
      );
    }
    if (targetOnline) {
      debugger;
      //  targetOnline.send(JSON.stringify({ hangout: target, type: "HANGOUT" })); //-----------------
    } else {
      debugger; //
      //TARGET OFFLINE: push updated hangout undeliverded collection
      await collection.updateOne(
        { username },
        {
          $push: {
            undelivered: target,
          },
        }
      );
    }
    return result;
  } catch (error) {
    console.log("seed error", error);
    return error;
  }
};
