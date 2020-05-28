export async function initUsers({ collection, hangouts, ws }) {
  let sourceUser = null;
  let targetUser = null;
  sourceUser = await collection.findOne({ username: ws.username });
  debugger;
  if (!sourceUser) {
    sourceUser = await collection.insertOne({ username: ws.username });
    debugger;
  }
  targetUser = await collection.findOne({ username: hangouts.username });
  if (!targetUser) {
    targetUser = await collection.insertOne({ username: hangouts.username });
    debugger;
  }
}
