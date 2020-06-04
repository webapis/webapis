import {
  messagesFromServer,
  acknowledgmentTypes,
  messageCategories,
} from '../../../client/hangouts/state/messageTypes';
export async function acceptHandler({ collection, hangout, ws, connections }) {
  debugger;
  // insert hangout to accepter hangouts list
  await collection.updateOne(
    { username: ws.user.username },
    {
      $push: {
        hangouts: {
          username: hangout.username,
          email: hangout.email,
          state: hangout.type,
        },
      },
    }
  );

  // send acknowledgement to accepter
  const acknowledgement = {
    category: messageCategories.ACKNOWLEDGEMENT,
    type: messagesFromServer.HANGCHAT,
    username: hangout.username,
    email: hangout.email,
  };
  ws.send(JSON.stringify(acknowledgement));
  // update hangout state on inviters hangouts list
  await collection.update(
    { username: hangout.username, 'hangouts.username': ws.user.username },
    { $set: { 'hangouts.$.state': 'HANGCHAT' } }
  );
  // send acknowledgement to inviter
  const inviter = connections[hangout.username];
  if (inviter) {
    inviter.send(
      JSON.parse({
        type: messagesFromServer.HANGCHAT,
        username: ws.user.username,
        email: ws.user.email,
      })
    );
  }
  // remote hangout from invitation
} //
