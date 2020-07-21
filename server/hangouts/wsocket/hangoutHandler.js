const stateMapper = require("../stateMapper");

module.exports = async function hangoutHandler({
  collection,
  hangout,
  ws,
  connections,
}) {
  try {
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
      username: ws.user.username,
      email: ws.user.email,
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
          { username: ws.user.username },
          { $push: { hangouts: sender } }
        );
      }

      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });

      if (hangout.command === "ACCEPT" || hangout.command === "DECLINE") {
        let pullResult = await collection.updateOne(
          { username: ws.user.username },
          { $pull: { unreads: { timestamp, username } } }
        );
        // UPDATE HANGOUT ON TARGET
        await collection.updateOne(
          { username, "hangouts.username": ws.user.username },
          { $set: { "hangouts.$": target } }
        );
      }
    }

    // CLIENT COMMAND ELSE//
    else if (
      hangout.command === "BLOCK" ||
      hangout.command === "UNBLOCK" ||
      hangout.command === "MESSAGE"
    ) {
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: ws.user.username, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );

      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": ws.user.username },
        { $set: { "hangouts.$": target } }
      );

      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });

      if (hangout.command === "BLOCK" || hangout.command === "UNBLOCK") {
        await collection.updateOne(
          { username: ws.user.username },
          { $pull: { unreads: { username } } }
        );
        await collection.updateOne(
          { username },
          {
            $pull: {
              unreads: {
                username: ws.user.username,
                state: { $ne: "BLOCKER" },
              },
            },
          }
        );
      }
    } else if (hangout.command === "READ") {
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: ws.user.username, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );

      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": ws.user.username },
        { $set: { "hangouts.$": target } }
      );

      await collection.updateOne(
        { username: ws.user.username },
        { $pull: { unreads: { timestamp, username } } }
      );

      //PUSH UNREADS ON TARGET
      // await collection.updateOne({ username }, { $push: { unreads: target } });
    }
    //TARGET ONLINE: send state change//
    const targetOnline = connections[username];
    if (targetOnline) {
      targetOnline.send(JSON.stringify({ hangout: target, type: "HANGOUT" })); //-----------------
    } else {
    }
    //send state change to sender/

    ws.send(JSON.stringify({ hangout: sender, type: "ACKHOWLEDGEMENT" })); //---------------
  } catch (error) {
    const err = error;
    debugger;
    console.log("hangoutHandlerError", error);
  }
};
