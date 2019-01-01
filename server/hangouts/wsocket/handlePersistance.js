const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const { MongoClient } = require("mongodb");
const assert = require("assert");
const { undefinedArguments } = require("../../helpers");

module.exports.handlePersistance = async function ({
  target,
  sender,
  senderUserName,
  username,
  hangout,
  connections,
  //collection,
}) {
  try {
    undefinedArguments({
      target,
      sender,
      senderUserName,
      username,
      hangout,
      connections,
      // collection,
    });
    const client = await new MongoClient(dbUrl, { useUnifiedTopology: true });
    await client.connect();
    const collection = await client.db("auth").collection("users");
    const { email, message, offline, timestamp } = hangout;

    const senderUser = await collection.findOne({ username: senderUserName });
    const senderBrowsers = senderUser.browsers;
    const targetUser = await collection.findOne({ username });
    const targetBrowsers = targetUser.browsers;

    let funcs = {
      senderOffline: async function () {
        for (const browser of senderBrowsers) {
          const senderOnline =
            connections[`${senderUserName}-${browser.browserId}`];
          //
          if (!senderOnline) {
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
      targetOffline: async function () {
        for (const browser of targetBrowsers) {
          const targetOnline = connections[`${username}-${browser.browserId}`];
          if (!targetOnline) {
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
          const updateResult = await collection.update(
            { username },
            { $set: { "browsers.$[t].hangouts.$[u]": target } },
            {
              arrayFilters: [
                { "t.browserId": browser.browserId },
                { "u.target": senderUserName },
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

        for await (const browser of browsers) {
          const updateResult = await collection.update(
            { username: senderUserName },
            { $set: { "browsers.$[t].hangouts.$[u]": sender } },
            {
              arrayFilters: [
                { "t.browserId": browser.browserId },
                { "u.target": username },
              ],
              multi: true,
            }
          );
        }
      },
      pushSenderHangout: async function () {
        //PUSH HANGOUT ON SENDER
        for await (const browser of senderBrowsers) {
          const updateResult = await collection.update(
            { username: senderUserName },
            { $push: { "browsers.$[t].hangouts": sender } },
            {
              arrayFilters: [{ "t.browserId": browser.browserId }],
              upsert: true,
            }
          );
        }
      },
      pushTargetHangout: async function () {
        //PUSH HANGOUT ON SENDER
        for await (const browser of targetBrowsers) {
          const updateResult = await collection.update(
            { username },
            { $push: { "browsers.$[t].hangouts": target } },
            {
              arrayFilters: [{ "t.browserId": browser.browserId }],
              upsert: true,
            }
          );
        }
      },
      pullTargetAllUndelivered: async function () {
        for await (const browser of senderBrowsers) {
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
        }
      },
      // pullSenderAllUnreads: async function () {},
      // pullTargetAllUnreads: async function () {},
    };

    switch (hangout.command) {
      case "INVITE": //------------------------------------
        //SENDER

        funcs.pushSenderHangout(); //INVITED
        funcs.senderOffline();
        //TARGET
        //  funcs.pushTargetUnread(); //INVITER
        funcs.pushTargetHangout();
        funcs.targetOffline();
        break;
      case "ACCEPT":
        //SENDER-----------------------------------------
        // funcs.pullSenderUnread(); //INVITER
        funcs.updateSenderHangout(); //ACCEPTED
        funcs.senderOffline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //ACCEPTER
        // funcs.pushTargetUnread(); //ACCEPTER
        funcs.targetOffline();
        break;
      // case "DECLINE":
      //   //SENDER-----------------------------------------
      //   //   funcs.pullSenderUnread(); //INVITER
      //   funcs.updateSenderHangout(); //DECLINED
      //   funcs.senderOffline();
      //   //TARGET-----------------------------------------
      //   funcs.updateTargetHangout(); //DECLINER
      //   funcs.targetOffline();
      //   break;
      case "MESSAGE":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //MESSAGED
        funcs.senderOffline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //MESSANGER
        //  funcs.pushTargetUnread(); //MESSANGER
        funcs.targetOffline();
        break;
      case "BLOCK":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //BLOCKED
        funcs.senderOffline();

        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //BLOCKER
        //    funcs.pullTargetAllUnreads(); //ALL
        //    funcs.pushTargetUnread(); //BLOCKER
        funcs.pullTargetAllUndelivered();

        funcs.targetOffline();
        break;
      case "UNBLOCK":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //UNBLOCKED
        funcs.senderOffline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //UNBLOCKER
        //   funcs.pushTargetUnread(); //UNBLOCKER
        funcs.targetOffline();
        break;
      case "DECLINE":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //BLOCKED
        funcs.senderOffline();

        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //BLOCKER
        //    funcs.pullTargetAllUnreads(); //ALL
        //    funcs.pushTargetUnread(); //BLOCKER
        funcs.pullTargetAllUndelivered();

        funcs.targetOffline();
        break;
      case "UNDECLINE":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //UNBLOCKED
        funcs.senderOffline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //UNBLOCKER
        //   funcs.pushTargetUnread(); //UNBLOCKER
        funcs.targetOffline();
        break;
      case "READING":
        //SENDER-----------------------------------------
        // funcs.pullSenderAllUnreads(); //ALL
        funcs.updateSenderHangout(); //READ
        funcs.senderOffline();
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //READER
        //  funcs.pushTargetUnread(); //READER
        funcs.targetOffline();
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

    throw error;
  }
};
