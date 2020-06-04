import {
  messagesFromServer,
  acknowledgmentTypes,
  messageCategories,
} from '../../../client/hangouts/state/messageTypes';
export async function inviteHandler({ collection, hangout, ws, connections }) {
  const sourceHangouts = {
    username: hangout.username,
    type: acknowledgmentTypes.INVITEE,
    category: messageCategories.ACKNOWLEDGEMENT,
  };
  const targetHangouts = {
    message: hangout.message,
    username: ws.user.username,
    email: ws.user.email,
  };
  debugger;

  //push new contact to user's contact list
  //push new contact to target user's contact list
  //if target user is online send invitation
  const updateSourceUser = await collection.updateOne(
    { username: ws.user.username },
    {
      $push: {
        hangouts: {
          username: hangout.username,
          email: hangout.email,
          state: acknowledgmentTypes.INVITEE,
        },
      },
    }
  );
  const updateTarget = await collection.updateOne(
    { username: hangout.username },
    {
      $push: {
        invitations: { ...targetHangouts, state: messagesFromServer.INVITER },
      },
    }
  );
  const targetUserConnection = connections[hangout.username];
  if (targetUserConnection) {
    targetUserConnection.send(
      JSON.stringify({
        ...targetHangouts,
        category: messageCategories.PEER,
        type: messagesFromServer.INVITER,
      })
    );
  }
  ws.send(JSON.stringify(sourceHangouts));
}
//
