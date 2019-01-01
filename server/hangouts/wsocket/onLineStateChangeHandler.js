const { undefinedArguments } = require("../../helpers");
module.exports.onLineStateChangeHandler = async function ({
  // client,
  ws,
  browserId,
  collection,
  senderUser,
}) {
  try {
    undefinedArguments({ ws, browserId, collection, senderUser });
    //const collection = await client.db("auth").collection("users");
    const { username } = senderUser;
    const user = await collection.findOne({ username });
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
        username,
        collection,
      });
    }
    //SEND UNDELIVERED
    if (
      connectedBrowser &&
      connectedBrowser.undelivered &&
      connectedBrowser.undelivered.length > 0
    ) {
      const { undelivered } = connectedBrowser;
      const msg = {
        data: { hangouts: undelivered, type: "UNDELIVERED_HANGOUTS" },
        type: "HANGOUT",
      };
      ws.send(
        JSON.stringify(msg) //--
      );
      debugger;
      pullUndeliveredHangouts({
        browserId: connectedBrowser.browserId,
        username,
        collection,
      });
    }
  } catch (error) {
    throw error;
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
