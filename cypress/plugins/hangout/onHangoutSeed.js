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
      if (hangout.command === "INVITE" || hangout.command === "ACCEPT") {
        //PUSH HANGOUT ON SENDER
        await collection.updateOne(
          { username: senderUsername },
          { $push: { hangouts: sender } }
        );
      }

      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });

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
      }
    }

    // CLIENT COMMAND ELSE
    else if (
      hangout.command === "BLOCK" ||
      hangout.command === "UNBLOCK" ||
      hangout.command === "MESSAGE"
    ) {
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: senderUsername, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );

      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": senderUsername },
        { $set: { "hangouts.$": target } }
      );

      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });

      if (hangout.command === "BLOCK" || hangout.command === "UNBLOCK") {
        await collection.updateOne(
          { username: senderUsername },
          { $pull: { unreads: { timestamp, username } } }
        );

        await collection.updateOne(
          { username },
          {
            $pull: {
              unreads: { username: senderUsername, state: { $ne: "BLOCKER" } },
            },
          }
        );
      }
    } else if (hangout.command === "READ") {
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: senderUsername, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );

      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": senderUsername },
        { $set: { "hangouts.$": target } }
      );

      await collection.updateOne(
        { username: senderUsername },
        { $pull: { unreads: { timestamp, username } } }
      );

      //PUSH UNREADS ON TARGET
      //   await collection.updateOne({ username }, { $push: { unreads: target } });
    } ////

    return true;
  } catch (error) {
    console.log("seed error", error);
    return error;
  }
};
