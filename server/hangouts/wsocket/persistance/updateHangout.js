//invoked after sendOnlineHangout functino returns true. function updates hangout state for sender and target user
const { undefinedArguments } = require("../../../helpers");
module.exports.updateHangout = async function ({
  hForTarget,
  hForSender,
  col,
  cUser,
  tUser,
  hangout,
}) {
  try {
    undefinedArguments({ hForTarget, hForSender, col, cUser, tUser, hangout });
    const { username: senderUserName } = cUser;
    const { username: targetUserName } = tUser;
    let funcs = {
      updateHangout: async function ({ username, targetUserName, hangout }) {
        const user = await col.findOne({ username });
        const browsers = user.browsers;
        for await (const browser of browsers) {
          // UPDATE HANGOUT ON TARGET
          const updateResult = await col.update(
            { username },
            { $set: { "browsers.$[t].hangouts.$[u]": hangout } },
            {
              arrayFilters: [
                { "t.browserId": browser.browserId },
                { "u.target": targetUserName },
              ],
              multi: true,
            }
          );
        }
      },

      pushHangout: async function ({ username, hangout }) {
        const user = await col.findOne({ username });
        const browsers = user.browsers;

        for await (const browser of browsers) {
          const updateResult = await col.update(
            { username },
            { $push: { "browsers.$[t].hangouts": hangout } },
            {
              arrayFilters: [{ "t.browserId": browser.browserId }],
              upsert: true,
            }
          );
        }
      },

      // pullTargetAllUndelivered: async function () {
      //   for await (const browser of senderBrowsers) {
      //     const updateResult = await col.update(
      //       { username },
      //       {
      //         $pull: {
      //           "browsers.$[t].undelivered": {
      //             username: senderUserName,
      //             state: { $ne: "BLOCKER" },
      //           },
      //         },
      //       },
      //       {
      //         arrayFilters: [{ "t.browserId": browser.browserId }],
      //         upsert: true,
      //       }
      //     );
      //   }
      // },
    };

    switch (hangout.command) {
      case "INVITE": //------------------------------------
        //SENDER
        funcs.pushHangout({
          username: senderUserName,
          targetUserName,
          hangout: hForSender,
        }); //INVITED
        //TARGET

        funcs.pushHangout({
          username: targetUserName,
          targetUserName: senderUserName,
          hangout: hForTarget,
        });
        break;
      case "ACCEPT":
      case "MESSAGE":
      case "BLOCK":
      case "UNBLOCK":
      case "DECLINE":
      case "UNDECLINE":
        //SENDER-----------------------------------------

        funcs.updateHangout({
          username: senderUserName,
          targetUserName,
          hangout: hForSender,
        }); //READ

        //TARGET-----------------------------------------
        funcs.updateHangout({
          username: targetUserName,
          targetUserName: senderUserName,
          hangout: hForTarget,
        }); //READER

        break;
      default:
        throw "hangout.command not specified";
    }
  } catch (error) {
    throw error;
  }
};
