const stateMapper = require("../stateMapper");

module.exports = async function hangoutHandler({
  collection,
  hangout,
  ws,
  connections,
}) {
  try {
    const { senderState, targetState } = stateMapper({
      command: hangout.command,
    });
    const { username, email, message, offline, timestamp } = hangout;
    const sender = {
      username,
      email,
      message,
      timestamp,
      state: senderState,
    };
    //
    const target = {
      username: ws.user.username,
      email: ws.user.email,
      message,
      timestamp,
      state: targetState,
    };

    let funcs = {
      updateTargetHangout: async function () {
        // UPDATE HANGOUT ON TARGET
        await collection.updateOne(
          { username, "hangouts.username": ws.user.username },
          { $set: { "hangouts.$": target } }
        );
      },
      updateSenderHangout: async function () {
        // UPDATE HANGOUT ON SENDER
        await collection.updateOne(
          { username: ws.user.username, "hangouts.username": username },
          { $set: { "hangouts.$": sender } }
        );
      },
      pushSenderHangout: async function () {
        //PUSH HANGOUT ON SENDER
        await collection.updateOne(
          { username: ws.user.username },
          { $push: { hangouts: sender } }
        );
      },
      pushTargetUnread: async function () {
        //PUSH UNREADS ON TARGET
        await collection.updateOne(
          { username },
          { $push: { unreads: target } }
        );
      },
      pullSenderUnread: async function () {
        await collection.updateOne(
          { username: ws.user.username },
          { $pull: { unreads: { timestamp, username } } }
        );
      },
      pullSenderAllUnreads: async function () {},
      pullTargetAllUnreads: async function () {},
    };
    switch (hangout.command) {
      case "INVITE": //------------------------------------
        //SENDER
        funcs.pushSenderHangout(); //INVITED
        //TARGET
        funcs.pushTargetUnread(); //INVITER
        break;
      case "ACCEPT":
        //SENDER-----------------------------------------
        funcs.pullSenderUnread(); //INVITER
        funcs.pushSenderHangout(); //ACCEPTED
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //ACCEPTER
        funcs.pushTargetUnread(); //ACCEPTER

        break;
      case "DECLINE":
        //SENDER-----------------------------------------
        funcs.pullSenderUnread(); //INVITER
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //DECLINER
        break;
      case "MESSAGE":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //MESSAGED
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //MESSANGER
        funcs.pushTargetUnread(); //MESSANGER
        break;
      case "BLOCK":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //BLOCKED

        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //BLOCKER
        funcs.pullTargetAllUnreads(); //ALL
        funcs.pushTargetUnread(); //BLOCKER
        break;
      case "UNBLOCK":
        //SENDER-----------------------------------------
        funcs.updateSenderHangout(); //UNBLOCKED
        //TARGET-----------------------------------------
        funcs.updateTargetHangout(); //UNBLOCKER
        funcs.pushTargetUnread(); //UNBLOCKER
        break;

      case "READING":
        //SENDER-----------------------------------------
        funcs.pullSenderAllUnreads(); //ALL
        funcs.updateSenderHangout(); //READ
        //TARGET-----------------------------------------
        funcs.pushTargetUnread(); //READER
        break;
      case "SEENING":
        //SENDER-----------------------------------------
        funcs.pullSenderUnread(); //READER
        funcs.updateSenderHangout(); //SEEN

        break;
      default:
    }

    //TARGET ONLINE: send state change//
    const targetOnline = connections[username];
    if (targetOnline) {
      targetOnline.send(JSON.stringify({ hangout: target, type: "HANGOUT" })); //-----------------
    } else {
    }
    //send state change to sender/

    ws.send(JSON.stringify({ hangout: sender, type: "ACKHOWLEDGEMENT" })); //---------------
  } catch (error) {
    const err = error;
    debugger;
    console.log("hangoutHandlerError", error);
  }
};
