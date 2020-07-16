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
  senderEmail,
  targetOnline = false,
}) {
  try {
    debugger;
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
    //
    const target = {
      username: senderUsername,
      email: senderEmail,
      message,
      timestamp,
      state: targetState,
    };

    if (
      hangout.command === "INVITE" ||
      hangout.command === "ACCEPT" ||
      hangout.command === "DECLINE"
    ) {
      debugger;
      if (hangout.command === "INVITE" || hangout.command === "ACCEPT") {
        //PUSH HANGOUT ON SENDER
        await collection.updateOne(
          { username: senderUsername },
          { $push: { hangouts: sender } }
        );
      }
      debugger;
      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });
      debugger;
      if (hangout.command === "ACCEPT" || hangout.command === "DECLINE") {
        await collection.updateOne(
          { username: senderUsername },
          { $pull: { unreads: { timestamp, username } } }
        );
        // UPDATE HANGOUT ON TARGET
        await collection.updateOne(
          { username, "hangouts.username": senderUsername },
          { $set: { "hangouts.$": target } }
        );
        debugger;
      }
    }

    // CLIENT COMMAND ELSE
    else if (
      hangout.command === "BLOCK" ||
      hangout.command === "UNBLOCK" ||
      hangout.command === "MESSAGE"
    ) {
      debugger;
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: senderUsername, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );
      debugger;
      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": senderUsername },
        { $set: { "hangouts.$": target } }
      );
      debugger;
      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });
      debugger;
      if (hangout.command === "BLOCK" || hangout.command === "UNBLOCK") {
        debugger;
        await collection.updateOne(
          { username: senderUsername },
          { $pull: { unreads: { timestamp, username } } }
        );
        debugger;
      }
    } else if (hangout.command === "READ") {
      debugger;
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: senderUsername, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );
      debugger;
      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": senderUsername },
        { $set: { "hangouts.$": target } }
      );
      debugger;
      await collection.updateOne(
        { username: senderUsername },
        { $pull: { unreads: { timestamp, username } } }
      );
      debugger;
      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });
    } ////
    debugger;
    return result;
  } catch (error) {
    console.log("seed error", error);
    return error;
  }
};
