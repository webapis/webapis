module.exports.onLineStateChangeHandler = async function ({
  client,
  ws,
  browserId,
  collection,
}) {
  try {
    //const collection = await client.db("auth").collection("users");

    const user = await collection.findOne({ username: ws.user.username });
    const connectedBrowser = user.browsers.find((b) => {
      if (b.browserId === browserId) {
        return b;
      }
    }); //
    //SEND DELAYED HANGOUTS
    if (connectedBrowser && connectedBrowser.delayed) {
      const delayedHangouts = connectedBrowser.delayed;

      if (delayedHangouts && delayedHangouts.length > 0) {
        const msg = {
          data: { hangouts: delayedHangouts, type: "DELAYED_ACKHOWLEDGEMENTS" },
          type: "HANGOUT",
        };
        ws.send(
          JSON.stringify(msg) //--
        );
      }
      pulldelayedHangouts({
        browserId: connectedBrowser.browserId,
        username: ws.user.username,
        collection,
      });
    }
    //SEND DELAYED UNDELIVERED
    if (connectedBrowser && connectedBrowser.undelivered) {
      const undeliveredHangouts = connectedBrowser.undelivered;
      if (undeliveredHangouts && undeliveredHangouts.length > 0) {
        const msg = {
          data: { hangouts: undeliveredHangouts, type: "UNDELIVERED_HANGOUTS" },
          type: "HANGOUT",
        };
        ws.send(
          JSON.stringify(msg) //--
        );
        pullUndeliveredHangouts({
          browserId: connectedBrowser.browserId,
          username: ws.user.username,
          collection,
        });
      }
    }
  } catch (error) {
    const err = error;

    console.log("onLineStateChangeHandlerError", error);
  }
};

async function pulldelayedHangouts({ browserId, username, collection }) {
  await collection.update(
    { username },
    { $pull: { "browsers.$[t].delayed": {} } },
    { arrayFilters: [{ "t.browserId": browserId }] }
  );
}
async function pullUndeliveredHangouts({ browserId, username, collection }) {
  await collection.update(
    { username },
    { $pull: { "browsers.$[t].undelivered": {} } },
    { arrayFilters: [{ "t.browserId": browserId }] }
  );
}
