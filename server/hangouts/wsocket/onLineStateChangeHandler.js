module.exports.onLineStateChangeHandler = async function ({
  client,
  ws,
  browserId,
}) {
  try {
    const collection = await client.db("auth").collection("users");
    const user = await collection.findOne({ username: ws.user.username });
    const senderBrowser = user.browsers.find((b) => b.browserId === browserId);
    const senderUndelivered = senderBrowser.undelivered;
    pullSenderUndelivered({
      browserId: senderBrowser.browserId,
      username: ws.user.username,
    });
    if (undelivered && undelivered.length > 0) {
      ws.send(
        JSON.stringify({
          hangouts: senderUndelivered,
          type: "DELAYED_ACKHOWLEDGEMENTS",
        }) //--
      );
    }
  } catch (error) {
    const err = error;
    console.log("onLineStateChangeHandlerError", error);
  }
};

async function pullSenderUndelivered({ browserId, username }) {
  await collection.update(
    { username },
    { $pull: { "browsers.$[t].undelivered": { username } } },
    { arrayFilters: [{ "t.browserId": browserId }] }
  );
}
