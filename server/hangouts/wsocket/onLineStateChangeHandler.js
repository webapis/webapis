module.exports.onLineStateChangeHandler = async function ({
  client,
  ws,
  connections,
}) {
  try {
    const collection = await client.db("auth").collection("users");

    const user = await collection.findOne({ username: ws.user.username });

    if (user && user.unreads) {
      ws.send(
        JSON.stringify({ hangouts: user.unreads, type: "UNREAD_HANGOUTS" }) //--
      );
      // const removeUndeliveredResult = await collection.updateOne(
      //   { username: ws.user.username },
      //   { $unset: { undelivered: "" } }
      // );
      // remove undelivered
    }
  } catch (error) {
    const err = error;

    console.log("onLineStateChangeHandlerError", error);
  }
};
