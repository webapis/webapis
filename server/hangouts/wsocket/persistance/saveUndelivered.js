//invoked on message event. stores hangouts undelivered to target user.
//functino checkes whether target user is offline. if offline storage undelivered hangout

module.exports.saveUndelivered = async function ({
  tUser,
  connections,
  hForTarget,
}) {
  try {
    const { browsers, username } = cUser.browsers;
    const funcs = {
      targetOffline: async function () {
        for (const browser of browsers) {
          const targetOnline = connections[`${username}-${browser.browserId}`];
          if (!targetOnline) {
            await collection.update(
              { username },
              { $push: { "browsers.$[t].undelivered": hForTarget } },
              {
                arrayFilters: [{ "t.browserId": browser.browserId }],
                upsert: true,
              }
            );
          }
        }
      },
    };
  } catch (error) {}
};
