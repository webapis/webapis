import { hangoutStates } from '../hangoutStates'
export async function inviteHandler({ collection, hangout, ws, connections }) {
  const invitee = {
    username: hangout.username,
    email: hangout.email,
    state: hangoutStates.INVITED,
    message: hangout.message
  };
  const inviter = {
    message: hangout.message,
    username: ws.user.username,
    email: ws.user.email,
    state: hangoutStates.INVITER
  };
  debugger;

  // updateInviter
  await collection.updateOne(
    { username: ws.user.username },
    {
      $push: {
        hangouts: invitee
      },
    }
  );
  //updateInvitee 
  await collection.updateOne(
    { username: hangout.username },
    {
      $push: {
        invitations: inviter,
      },
    }
  );
  const inviteeConnection = connections[hangout.username];
  if (inviteeConnection) {
    inviteeConnection.send(
      JSON.stringify(inviter)
    );
  }
  ws.send(JSON.stringify(invitee));
}
//
