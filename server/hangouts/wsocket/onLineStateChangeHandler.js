export async function onLineStateChangeHandler({ client, ws, connections }) {
  try {
    const collection = await client.db('auth').collection('users');
    const user = await collection.findOne({ username: ws.user.username });
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
    console.log('onLineStateChangeHandlerError', error);
  }
  debugger;
}
