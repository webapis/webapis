//invoked when socket message is recieved from connected user.
//send ACKNOWLEDGEMENT type message to message sender and HANGOUT type message to target user
const { undefinedArguments } = require("../../../helpers");
module.exports.sendHangout = async function ({
  cUser,
  tUser,
  hForTarget,
  hForSender,
  connections,
}) {
  try {
    undefinedArguments({ cUser, tUser, hForTarget, hForSender, connections });
    const targetBrowsers = tUser.browsers;
    const senderBrowsers = cUser.browsers;
    let funcs = {
      senderOnline: async function () {
        for (const browser of senderBrowsers) {
          const senderOnline =
            connections[`${cUser.username}-${browser.browserId}`];

          if (senderOnline) {
            const msg = {
              data: {
                hangout: hForSender,
                type: "ACKHOWLEDGEMENT",
                sender: cUser.username,
              },
              type: "HANGOUT",
            };

            senderOnline.send(JSON.stringify(msg));
            debugger;
          }
        }
      },
      targetOnline: async function () {
        for (const browser of targetBrowsers) {
          const targetOnline =
            connections[`${tUser.username}-${browser.browserId}`];

          if (targetOnline) {
            const msg = {
              data: {
                hangout: hForTarget,
                type: "HANGOUT",
                sender: cUser.username,
              },
              type: "HANGOUT",
            };
            targetOnline.send(JSON.stringify(msg)); //-----------------
            debugger;
          }
          debugger;
        }
      },
    };

    await funcs.senderOnline();
    await funcs.targetOnline();
  } catch (error) {
    debugger;
    throw error;
  }
};
