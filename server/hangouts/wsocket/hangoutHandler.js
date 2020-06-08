import { stateMapper } from '../stateMapper';
import { clientCommands } from '../../../client/hangouts/state/clientCommands';
export async function hangoutHandler({ collection, hangout, ws, connections }) {
  try {
    const { senderState, targetState } = stateMapper({
      command: hangout.command,
    });
    const { username, email, message } = hangout;
    const sender = {
      username,
      email,
      message,
      state: senderState,
    };
    debugger;
    const target = {
      username: ws.user.username,
      email: ws.user.email,
      message,
      state: targetState,
    };
    debugger;
    if (hangout.command === clientCommands.INVITE) {
      debugger;
      const senderHangoutPushResult = await collection.updateOne(
        { username: ws.user.username },
        { $push: { hangouts: sender } }
      );
      debugger;
      // update hangout on target
      const targetHangoutPushResult = await collection.updateOne(
        { username },
        { $push: { hangouts: target } }
      );
    } else {
      // update hangout on sender
      const senderHangoutUpdateResult = await collection.updateOne(
        { username: ws.user.username, 'hangouts.username': username },
        { $set: { 'hangouts.$': sender } }
      );
      debugger;
      // update hangout on target
      const targetHangoutUpdateResult = await collection.updateOne(
        { username, 'hangouts.username': ws.user.username },
        { $set: { 'hangouts.$': target } }
      );
    }

    debugger;
    //TARGET ONLINE: send state change//
    const targetOnline = connections[username];
    if (targetOnline) {
      debugger;
      targetOnline.send(JSON.stringify(target));
    } else {
      //TARGET OFFLINE: push updated hangout undeliverded collection
      const targetUndeliveredUpdateResult = await collection.updateOne(
        { username },
        {
          $push: {
            undeliverded: target,
          },
        }
      );
      debugger;
    }
    //send state change to sender
    ws.send(JSON.stringify(sender));
  } catch (error) {
    const err = error;
    debugger;
    console.log('hangoutHandlerError', error);
  }
}
