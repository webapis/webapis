//invoked on message event. stores hangouts undelivered to target user.
//functino checkes whether target user is offline. if offline storage undelivered hangout
const { undefinedArguments } = require("../../../helpers");
module.exports.saveUndelivered = async function ({
  tUser,
  connections,
  hForTarget,
  col,
}) {
  try {
    debugger; //
    undefinedArguments({ tUser, col, hForTarget });
    const { browsers, username } = tUser;
    debugger;
    const funcs = {
      targetOffline: async function () {
        for (const browser of browsers) {
          debugger;
          const targetOnline = connections[`${username}-${browser.browserId}`];
          debugger;
          if (!targetOnline) {
            let result = await col.update(
              { username },
              { $push: { "browsers.$[t].undelivered": hForTarget } },
              {
                arrayFilters: [{ "t.browserId": browser.browserId }],
                upsert: true,
              }
            );
            debugger;
          }

          debugger;
        }
      },
    };
    funcs.targetOffline();
  } catch (error) {
    debugger; //
    throw error;
  }
};