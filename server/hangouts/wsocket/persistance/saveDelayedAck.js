//invoked on message event. after sendOnlineHangout() function
//the purpose of this function is to store hangout items for browsers of messages sender in offline state. message sender could use
//multiple devices or browsers at the same time or in different times.
module.exports.saveDelayedAck = async function ({
  cUser,
  connections,
  hForSender,
}) {
  try {
    const { browsers, username } = cUser.browsers;

    let funcs = {
      senderOffline: async function () {
        for (const browser of browsers) {
          const senderOnline = connections[`${username}-${browser.browserId}`];
          //
          if (!senderOnline) {
            await collection.update(
              { username },
              { $push: { "browsers.$[t].delayed": hForSender } },
              {
                arrayFilters: [{ "t.browserId": browser.browserId }],
                upsert: true,
              }
            );
          }
        }
      },
    };
    funcs.senderOffline();
  } catch (error) {}
};
