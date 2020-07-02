import { stateMapper } from '../stateMapper';
import { clientCommands } from '../../../client/features/hangouts/state/clientCommands';
export async function hangoutHandler({ collection, hangout, ws, connections }) {
  debugger;
  try {
    const { senderState, targetState } = stateMapper({
      command: hangout.command,
    });
    const { username, email, message,offline,timestamp } = hangout;
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

    if (hangout.command === clientCommands.INVITE) {
  
      const senderHangoutPushResult = await collection.updateOne(
        { username: ws.user.username },
        { $push: { hangouts: sender } }
      );
   
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
  
      // update hangout on target
      const targetHangoutUpdateResult = await collection.updateOne(
        { username, 'hangouts.username': ws.user.username },
        { $set: { 'hangouts.$': target } }
      );
    }

 
    //TARGET ONLINE: send state change//
    const targetOnline = connections[username];
    if (targetOnline) {
  
      targetOnline.send(JSON.stringify({hangout:target,type:'HANGOUT'}));//-----------------
    } else {
      //TARGET OFFLINE: push updated hangout undeliverded collection
      const targetUndeliveredUpdateResult = await collection.updateOne(
        { username },
        {
          $push: {
            undelivered: target,
          },
        }
      );
 
    }
    //send state change to sender
 
    if(offline){

      ws.send(JSON.stringify({hangout:sender,type:'OFFLINE_ACKN'}));//---------------
    }else{
      debugger;
      ws.send(JSON.stringify({hangout:sender,type:'ACKHOWLEDGEMENT'}));//---------------
    }
  } catch (error) {
    const err = error;
    debugger;
    console.log('hangoutHandlerError', error);
  }
}
