////invoked on user connection. sends undelivered hangouts to connected user recieved from target users .
//undelivered hangouts gets added when user is offline for some reason.
const { undefinedArguments } = require("../../../helpers");
module.exports.sendUndelivered = function ({ cUser, browserId, ws }) {
  try {
    debugger;
    undefinedArguments({ cUser, browserId, ws });
    const connectedBrowser = cUser.browsers.find((b) => {
      if (b.browserId === browserId) {
        return b;
      }
    }); //
    //SEND UNDELIVERED HANGOUTS

    if (
      connectedBrowser.undelivered &&
      connectedBrowser.undelivered.length > 0
    ) {
      ws.send(
        JSON.stringify({
          data: {
            hangouts: connectedBrowser.undelivered,
            type: "UNDELIVERED_HANGOUTS",
          },
          type: "HANGOUT",
        })
      );

      return true;
    }
    return false;
  } catch (error) {
    debugger;
    throw error;
  }
};
