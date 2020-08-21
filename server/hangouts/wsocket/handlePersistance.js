module.exports.handlePersistance = async function ({
  target,
  sender,
  collection,
  senderUserName,
  username,
  hangout,
  connections,
}) {
  ////

  try {
    const { email, message, offline, timestamp } = hangout;

    const senderUser = await collection.findOne({ username: senderUserName });
    const senderBrowsers = senderUser.browsers;
    const targetUser = await collection.findOne({ username });
    const targetBrowsers = targetUser.browsers;
    let funcs = {
      senderOnline: async function () {
        for (const browser of senderBrowsers) {
          const senderOnline =
            connections[`${senderUserName}-${browser.browserId}`];
          if (senderOnline) {
            senderOnline.send(
              JSON.stringify({ hangout: sender, type: "ACKHOWLEDGEMENT" })
            );
          } else {
            await collection.update(
              { username: senderUserName },
              { $push: { "browsers.$[t].delayed": sender } },
              {
                arrayFilters: [{ "t.browserId": browser.browserId }],
                upsert: true,
              }
            );
          }
        }
      },
      targetOnline: async function () {
        for (const browser of targetBrowsers) {
          const targetOnline = connections[`${username}-${browser.browserId}`];
          if (targetOnline) {
            targetOnline.send(
              JSON.stringify({ hangout: target, type: "HANGOUT" })
            ); //-----------------
          } else {
            await collection.update(
              { username },
              { $push: { "browsers.$[t].undelivered": target } },
              {
                arrayFilters: [{ "t.browserId": browser.browserId }],
                upsert: true,
              }
            );
          }
        }
      },
      updateTargetHangout: async function () {
        const user = await collection.findOne({ username });
        const browsers = user.browsers;
        for await (const browser of browsers) {
          // UPDATE HANGOUT ON TARGET
          await collection.update(
            { username },
            { $set: { "browsers.$[t].hangouts.$[u]": target } },
            {
              arrayFilters: [
                { "t.browserId": browser.browserId },
                { "u.username": senderUserName },
              ],
              multi: true,
            }
          );
        }
      },
      updateSenderHangout: async function () {
        // UPDATE HANGOUT ON SENDER
        const user = await collection.findOne({ username: senderUserName });
        const browsers = user.browsers;
        // await collection.updateOne(
        //   { username: senderUserName, "hangouts.username": username },
        //   { $set: { "hangouts.$": sender } }
        // );

        for await (const browser of browsers) {
          const upd = await collection.update(
            { username: senderUserName },
            { $set: { "browsers.$[t].hangouts.$[u]": sender } },
            {
              arrayFilters: [
                { "t.browserId": browser.browserId },
                { "u.username": username },
              ],
              multi: true,
            }
          );
        }
      },
      pushSenderHangout: async function () {
        //PUSH HANGOUT ON SENDER
        for await (const browser of senderBrowsers) {
          await collection.update(
            { username: senderUserName },
            { $push: { "browsers.$[t].hangouts": sender } },
            {
              arrayFilters: [{ "t.browserId": browser.browserId }],
              upsert: true,
            }
          );
        }
      },
      // pushTargetUnread: async function () {
      //   //PUSH UNREADS ON TARGET
      //   for await (const browser of targetBrowsers) {
      //     await collection.update(
      //       { username },
      //       { $push: { "browsers.$[t].unreads": target } },
      //       { arrayFilters: [{ "t.browserId": browser.browserId }], upsert: true }
      //     );
      //   }
      // },

      // pullSenderUnread: async function () {
      //   for await (const browser of senderBrowsers) {
      //     await collection.update(
      //       { username: senderUserName },
      //       { $pull: { "browsers.$[t].unreads": { username, timestamp } } },
      //       { arrayFilters: [{ "t.browserId": browser.browserId }], upsert: true }
      //     );
      //   }
      // },
      pullTargetAllUndelivered: async function () {
        for await (const browser of senderBrowsers) {
          debugger;
          const updateResult = await collection.update(
            { username },
            {
              $pull: {
                "browsers.$[t].undelivered": {
                  username: senderUserName,
                  state: { $ne: "BLOCKER" },
                },
              },
            },
            {
              arrayFilters: [{ "t.browserId": browser.browserId }],
              upsert: true,
            }
          );

          debugger;
        }
      },
      // pullSenderAllUnreads: async function () {},
      // pullTargetAllUnreads: async function () {},
    };
    switch (hangout.command) {
      case "INVITE": //------------------------------------
        //SENDER

        funcs.pushSenderHangout(); //INVITED
        funcs.senderOnline();
        //TARGET
        //  funcs.pushTargetUnread(); //INVITER
        funcs.targetOnline();
        break;
      case "ACCEPT":
        //SENDER-----------------------------------------
        // funcs.pullSenderUnread(); //INVITER
        funcs.pushSenderHangout(); //ACCEPTED
        funcs.senderOnline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //ACCEPTER
        // funcs.pushTargetUnread(); //ACCEPTER
        funcs.targetOnline();
        break;
      case "DECLINE":
        //SENDER-----------------------------------------
        //   funcs.pullSenderUnread(); //INVITER
        funcs.senderOnline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //DECLINER
        funcs.targetOnline();
        break;
      case "MESSAGE":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //MESSAGED
        funcs.senderOnline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //MESSANGER
        //  funcs.pushTargetUnread(); //MESSANGER
        funcs.targetOnline();
        break;
      case "BLOCK":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //BLOCKED
        funcs.senderOnline();

        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //BLOCKER
        //    funcs.pullTargetAllUnreads(); //ALL
        //    funcs.pushTargetUnread(); //BLOCKER
        funcs.pullTargetAllUndelivered();

        funcs.targetOnline();
        break;
      case "UNBLOCK":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //UNBLOCKED
        funcs.senderOnline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //UNBLOCKER
        //   funcs.pushTargetUnread(); //UNBLOCKER
        funcs.targetOnline();
        break;

      case "READING":
        //SENDER-----------------------------------------
        // funcs.pullSenderAllUnreads(); //ALL
        funcs.updateSenderHangout(); //READ
        funcs.senderOnline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //READER
        //  funcs.pushTargetUnread(); //READER
        funcs.targetOnline();
        break;
      case "SEENING":
        //SENDER-----------------------------------------
        // funcs.pullSenderUnread(); //READER
        // funcs.updateSenderHangout(); //SEEN

        break;
      default:
        throw "hangout.command not specified";
    }
  } catch (error) {
    const err = error;
  }
};
