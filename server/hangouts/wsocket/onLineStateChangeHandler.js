export async function onLineStateChangeHandler({ client, ws, connections }) {
  debugger;
  try {
    const collection = await client.db('auth').collection('users');
    debugger;
    const user = await collection.findOne({ username: ws.user.username });
    debugger;
    if (user && user.undelivered) {
      debugger;
      ws.send(
        JSON.stringify({ hangouts: user.undelivered, type: 'UNDELIVERED' })
      );
      const removeUndeliveredResult = await collection.updateOne(
        { username: ws.user.username },
        { $unset: { undelivered: '' } }
      );
      // remove undelivered
    }
  } catch (error) {
      const err =error
    debugger
    console.log('onLineStateChangeHandlerError', error);
  }
  debugger;
}
//