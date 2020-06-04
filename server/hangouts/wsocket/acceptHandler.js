
import { hangoutStates } from '../hangoutStates'
export async function acceptHandler({ collection, hangout, ws, connections }) {
  debugger;

  const { email, username } = hangout
  const inviter = { username, email, state: hangoutStates.ACCEPTED }
  const accepter = { username: ws.user.username, email: ws.user.email, state: hangoutStates.ACCEPTER }
  // insert hangout to accepter hangouts list
  await collection.updateOne(
    { username: ws.user.username },
    {
      $push: {
        hangouts: inviter,
      },
    }
  );
  await collection.updateOne(
    { username: ws.user.username },
    {
      $pull: {
        invitations: { username },
      },
    }
  );
  ws.send(JSON.stringify(inviter));
  // update hangout state on inviters hangouts list
  await collection.update(
    { username: hangout.username, 'hangouts.username': ws.user.username },
    { $set: { 'hangouts.$.state': hangoutStates.ACCEPTER } }
  );

  const inviterConnection = connections[hangout.username];
  if (inviterConnection) {
    inviter.send(
      JSON.parse(accepter)
    );
  }
  // remote hangout from invitation
} //
