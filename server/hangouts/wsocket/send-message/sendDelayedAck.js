//invoked on user connection from different browser or device.
//function syncs user state connected from multiple devices or different browsers
const { undefinedArguments } = require("../../../helpers");
module.exports.sendDelayedAck = function ({ cUser, browserId, ws }) {
  try {
    undefinedArguments({ cUser, browserId, ws });
    const connectedBrowser = cUser.browsers.find((b) => {
      if (b.browserId === browserId) {
        return b;
      }
    }); //
    //SEND DELAYED HANGOUTS

    if (
      connectedBrowser.delayed !== undefined &&
      connectedBrowser.delayed.length > 0
    ) {
      ws.send(
        JSON.stringify({
          data: {
            hangouts: connectedBrowser.delayed,
            type: "DELAYED_ACKHOWLEDGEMENTS",
          },
          type: "HANGOUT",
        })
      );

      return true;
    }
    return false;
  } catch (error) {}
};
