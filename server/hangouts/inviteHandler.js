import {messagesFromServer,acknowledgmentTypes,messageCategories} from '../../client/hangouts/state/messageTypes'
export async function inviteHandler({ collection, hangout, ws, connections }) {
  const sourceHangouts = {username:hangout.username,type:acknowledgmentTypes.INVITED,category:messageCategories.ACKNOWLEDGEMENT};
  const targetHangouts = {
    message:hangout.message,
    type: messagesFromServer.INVITER,
    username: ws.user.username,
    email:ws.user.email,
    category:messageCategories.PEER
  };
debugger;

  //push new contact to user's contact list
  //push new contact to target user's contact list
  //if target user is online send invitation
  const updateSourceUser = await collection.updateOne(
    { username: ws.username },
    { $push: { hangout } }
  );
  const updateTarget = await collection.updateOne(
    { username: hangout.username },
    { $push: { hangout: targetHangouts } }
  );
  const targetUserConnection = connections[hangout.username];
  if (targetUserConnection) {
   
    targetUserConnection.send(JSON.stringify(targetHangouts));
 
  }
  ws.send(JSON.stringify(sourceHangouts))
} 
//