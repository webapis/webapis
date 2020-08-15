module.exports.onLineStateChangeHandler = async function ({
  client,
  ws,
  browserId,
}) {
  try {
    const collection = await client.db("auth").collection("users");
    const user = await collection.findOne({ username: ws.user.username });
    const senderBrowser = user.browsers.find((b) => {
      if (b.browserId === browserId) {
        return b;
      }
    });
    //SEND SENDER UNDELIVERED
    if (senderBrowser && senderBrowser.undelivered) {
      const senderUndelivered = senderBrowser.undelivered;

      if (senderUndelivered && senderUndelivered.length > 0) {
        ws.send(
          JSON.stringify({
            hangouts: senderUndelivered,
            type: "DELAYED_ACKHOWLEDGEMENTS",
          }) //--
        );
      }
      pullSenderUndelivered({
        browserId: senderBrowser.browserId,
        username: ws.user.username,
        collection,
      });
    } else {
    }
  } catch (error) {
    const err = error;

    console.log("onLineStateChangeHandlerError", error);
  }
};

async function pullSenderUndelivered({ browserId, username, collection }) {
  await collection.update(
    { username },
    { $pull: { "browsers.$[t].undelivered": {} } },
    { arrayFilters: [{ "t.browserId": browserId }] }
  );
}
