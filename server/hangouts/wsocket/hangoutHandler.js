import { stateMapper } from "../stateMapper";
import { clientCommands } from "../../../client/features/hangouts/state/clientCommands";
export async function hangoutHandler({ collection, hangout, ws, connections }) {
  try {
    debugger;
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
      hangout.command === clientCommands.INVITE ||
      hangout.command === clientCommands.ACCEPT ||
      hangout.command === clientCommands.DECLINE
    ) {
      if (
        hangout.command === clientCommands.INVITE ||
        hangout.command === clientCommands.ACCEPT
      ) {
        //PUSH HANGOUT ON SENDER
        await collection.updateOne(
          { username: ws.user.username },
          { $push: { hangouts: sender } }
        );
      }
      debugger;

      debugger;
      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });
      debugger;
      if (
        hangout.command === clientCommands.ACCEPT ||
        hangout.command === clientCommands.DECLINE
      ) {
        debugger;
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
      hangout.command === clientCommands.BLOCK ||
      hangout.command === clientCommands.UNBLOCK ||
      hangout.command === clientCommands.MESSAGE
    ) {
      debugger;
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: ws.user.username, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );
      debugger;
      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": ws.user.username },
        { $set: { "hangouts.$": target } }
      );

      debugger;
      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });
      debugger;
      if (
        hangout.command === clientCommands.BLOCK ||
        hangout.command === clientCommands.UNBLOCK
      ) {
        await collection.updateOne(
          { username: ws.user.username },
          { $pull: { unreads: { timestamp, username } } }
        );
        debugger;
      }
    } else if (hangout.command === clientCommands.READ) {
      debugger;
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: ws.user.username, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );
      debugger;
      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": ws.user.username },
        { $set: { "hangouts.$": target } }
      );
      debugger;
      await collection.updateOne(
        { username: ws.user.username },
        { $pull: { unreads: { timestamp, username } } }
      );
      debugger;
      //PUSH UNREADS ON TARGET
      // await collection.updateOne({ username }, { $push: { unreads: target } });
      debugger;
    }
    //TARGET ONLINE: send state change//
    const targetOnline = connections[username];
    if (targetOnline) {
      debugger;
      targetOnline.send(JSON.stringify({ hangout: target, type: "HANGOUT" })); //-----------------
    } else {
      debugger;
    }
    //send state change to sender/

    debugger;
    ws.send(JSON.stringify({ hangout: sender, type: "ACKHOWLEDGEMENT" })); //---------------
  } catch (error) {
    const err = error;

    console.log("hangoutHandlerError", error);
  }
}
