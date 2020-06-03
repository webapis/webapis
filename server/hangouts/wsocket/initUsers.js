export async function initUsers({ collection, hangout, ws }) {
  let sourceUser = null;
  let targetUser = null;
  sourceUser = await collection.findOne({ username: ws.user.username });
  debugger;
  if (!sourceUser) {
    sourceUser = await collection.insertOne({ username: ws.user.username });
    debugger;
  }
  targetUser = await collection.findOne({ username: hangout.username });
  if (!targetUser) {
    targetUser = await collection.insertOne({ username: hangout.username });
    debugger;
  }
}
