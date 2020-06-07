import { stateMapper } from '../stateMapper'
export async function hangoutHandler({ collection, hangout, ws, connections }) {
  try {
    const { senderState, targetState } = stateMapper({ command: hangout.command })
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
    // update hangout on sender
    await collection.updateOne(
      { username: ws.user.username, 'hangouts.username': username },
      { $set: { 'hangouts.$': sender } }
    );

    // update hangout on target
    await collection.updateOne(
      { username, 'hangouts.username': ws.user.username },
      { $set: { 'hangouts.$': target } }
    );
    //TARGET ONLINE: send state change
    const targetOnline = connections[username];
    if (targetOnline) {
      targetOnline.send(JSON.stringify(target));
    } else {
      //TARGET OFFLINE: push updated hangout undeliverded collection
      await collection.updateOne(
        { username },
        {
          $push: {
            undeliverded: target,
          },
        }
      );
    }
    //send state change to sender
    ws.send(JSON.stringify(sender));
  } catch (error) {
    console.log('hangoutHandlerError', error);
  }
}