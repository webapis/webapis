import { hangoutStates } from '../hangoutStates';
export async function messageHandler({ collection, hangout, ws, connections }) {
  try {
    const { username, email, message } = hangout;
    const messangee = {
      username,
      email,
      message,
      state: hangoutStates.MESSAGED,
    };
    
    const messanger = {
      username: ws.user.username,
      email: ws.user.email,
      message,
      state: hangoutStates.MESSANGER,
    };
    
    // update hangout on messanger
    await collection.updateOne(
      { username: ws.user.username, 'hangouts.username': username },
      { $set: { 'hangouts.$': messangee } }
    );

    // update hangout on messangee
    await collection.updateOne(
      { username, 'hangouts.username': ws.user.username },
      { $set: { 'hangouts.$': messanger } }
    );
    //MESSANNGEE ONLINE: send state change
    const messangeeOnline = connections[username];
    if (messangeeOnline) {
      messangeeOnline.send(JSON.stringify(messanger));
    } else{

        await collection.updateOne(
            { username},
            {
              $push: {
                undeliverded: messanger,
              },
            }
          );
    }
    //send state change to messanger
    ws.send(JSON.stringify(messangee));

    //MESSANGEE OFFLINE: push updated hangout undeliverded collection

  } catch (error) {
    console.log('messageHandlerError', error);
  }
}
