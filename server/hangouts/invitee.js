export async function invitee({ collection, hangouts, ws, connections }) {
  const sourceHangouts = hangouts;
  const targetHangouts = {
    ...hangouts,
    state: 'INVITER',
    username: ws.username,
  };
  //push new contact to user's contact list
  //push new contact to target user's contact list
  //if target user is online send invitation
  const updateSourceUser = await collection.updateOne(
    { username: ws.username },
    { $push: { hangouts: sourceHangouts } }
  );
  const updateTarget = await collection.updateOne(
    { username: hangouts.username },
    { $push: { hangouts: targetHangouts } }
  );
  const targetUserConnection = connections[hangouts.username];
  if (targetUserConnection) {
      debugger;
    targetUserConnection.send(JSON.stringify(targetHangouts));
    debugger;
  }
  debugger;
} //
