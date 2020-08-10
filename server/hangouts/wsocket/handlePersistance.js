module.exports.handlePersistance = function ({
  target,
  sender,
  collection,
  senderUserName,
  username,
  hangout,
}) {
  ////

  const { email, message, offline, timestamp } = hangout;
  let funcs = {
    updateTargetHangout: async function () {
      // UPDATE HANGOUT ON TARGET
      await collection.updateOne(
        { username, "hangouts.username": senderUserName },
        { $set: { "hangouts.$": target } }
      );
    },
    updateSenderHangout: async function () {
      // UPDATE HANGOUT ON SENDER
      await collection.updateOne(
        { username: senderUserName, "hangouts.username": username },
        { $set: { "hangouts.$": sender } }
      );
    },
    pushSenderHangout: async function () {
      //PUSH HANGOUT ON SENDER
      await collection.updateOne(
        { username: senderUserName },
        { $push: { hangouts: sender } }
      );
    },
    pushTargetUnread: async function () {
      //PUSH UNREADS ON TARGET
      await collection.updateOne({ username }, { $push: { unreads: target } });
    },
    pullSenderUnread: async function () {
      await collection.updateOne(
        { username: senderUserName },
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
      throw "hangout.command not specified";
  }
};
