import { hangoutStates } from "../hangoutStates";
export async function acceptHandler({ collection, hangout, ws, connections }) {
  const { email, username } = hangout;
  const accepted = {
    username,
    email,
    state: hangoutStates.ACCEPTED,
  };
  const accepter = {
    username: ws.user.username,
    email: ws.user.email,
    state: hangoutStates.ACCEPTER,
  };
  // insert hangout to accepter hangouts list
  await collection.updateOne(
    { username: ws.user.username, "hangouts.username": hangout.username },
    { $set: { "hangouts.$": accepted } }
  );
  // update hangout state on inviters hangouts list
  await collection.update(
    { username: hangout.username, "hangouts.username": ws.user.username },
    { $set: { "hangouts.$.state": hangoutStates.ACCEPTER } }
  );
  await collection.updateOne(
    { username: ws.user.username },
    {
      $pull: {
        invitations: { username },
      },
    }
  );

  const inviterConnection = connections[hangout.username];
  if (inviterConnection) {
    inviter.send(JSON.parse(accepter));
  }
  ws.send(JSON.stringify(accepted));
  // remote hangout from invitation
} //
