const stateMapper = require("../stateMapper");
//const mongoDBPersistance = require("./handlePersistance");

module.exports = async function hangoutHandler({
  collection,
  socketMessage,
  ws,
  connections,
  targetUser,
  senderUser,
  cb,
}) {
  try {
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
      target: senderUser.user.username,
      email: senderUser.user.email,
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
            connections[`${senderUser.user.username}-${browser.browserId}`];

          if (senderOnline) {
            const msg = {
              data: {
                hangout: sender,
                type: "ACKHOWLEDGEMENT",
                sender: senderUser.user.username,
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
            connections[`${targetUser.user.username}-${browser.browserId}`];

          if (targetOnline) {
            const msg = {
              data: {
                hangout: target,
                type: "HANGOUT",
                sender: senderUser.user.username,
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

    await cb({
      target,
      sender,
      senderUserName: senderUser.user.username,
      username: sTarget,
      hangout,
    });
  } catch (error) {
    const err = error;

    console.log("hangoutHandlerError", error);
  }
};
