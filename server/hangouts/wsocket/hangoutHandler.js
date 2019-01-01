const stateMapper = require("./stateMapper");
const { undefinedArguments } = require("../../helpers");
//const mongoDBPersistance = require("./handlePersistance");

module.exports.hangoutsHandler = async function ({
  //collection,
  socketMessage,
  ws,
  connections,
  targetUser,
  senderUser,
  cb,
}) {
  try {
    undefinedArguments({
      // collection,
      socketMessage,
      ws,
      connections,
      targetUser,
      senderUser,
      cb,
    });
    const {
      data: { hangout },
    } = JSON.parse(socketMessage);
    const { senderState, targetState } = stateMapper({
      command: hangout.command,
    });
    const {
      target: sTarget,
      email,
      message,
      offline,
      timestamp,
      browserId,
    } = hangout;

    const sender = {
      target: sTarget,
      email,
      message,
      timestamp,
      state: senderState,
      browserId,
    };

    const target = {
      target: senderUser.username,
      email: senderUser.email,
      message,
      timestamp,
      state: targetState,
    };
    const targetBrowsers = targetUser.browsers;
    const senderBrowsers = senderUser.browsers;
    let funcs = {
      senderOnline: async function () {
        for (const browser of senderBrowsers) {
          const senderOnline =
            connections[`${senderUser.username}-${browser.browserId}`];

          if (senderOnline) {
            const msg = {
              data: {
                hangout: sender,
                type: "ACKHOWLEDGEMENT",
                sender: senderUser.username,
              },
              type: "HANGOUT",
            };

            senderOnline.send(JSON.stringify(msg));
          }
        }
      },
      targetOnline: async function () {
        for (const browser of targetBrowsers) {
          const targetOnline =
            connections[`${targetUser.username}-${browser.browserId}`];

          if (targetOnline) {
            const msg = {
              data: {
                hangout: target,
                type: "HANGOUT",
                sender: senderUser.username,
              },
              type: "HANGOUT",
            };
            targetOnline.send(JSON.stringify(msg)); //-----------------
          }
        }
      },
    };
    await funcs.senderOnline();
    await funcs.targetOnline();
    //persist to  databas//

    await cb({
      connections,
      //  collection,
      target,
      sender,
      senderUserName: senderUser.username,
      username: sTarget,
      hangout,
    });
  } catch (error) {
    throw error;
  }
};
