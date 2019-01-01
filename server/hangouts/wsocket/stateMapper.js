const hangoutStates = require("./hangoutStates");
const { undefinedArguments } = require("../../helpers");
module.exports.stateMapper = function ({ command }) {
  undefinedArguments({ command });
  switch (command) {
    case "ACCEPT":
      return {
        senderState: hangoutStates.ACCEPTED,
        targetState: hangoutStates.ACCEPTER,
      };
    case "BLOCK":
      return {
        senderState: hangoutStates.BLOCKED,
        targetState: hangoutStates.BLOCKER,
      };
    case "DECLINE":
      return {
        senderState: hangoutStates.DECLINED,
        targetState: hangoutStates.DECLINER,
      };
    case "INVITE":
      return {
        senderState: hangoutStates.INVITED,
        targetState: hangoutStates.INVITER,
      };
    case "MESSAGE":
      return {
        senderState: hangoutStates.MESSAGED,
        targetState: hangoutStates.MESSANGER,
      };

    case "UNBLOCK":
      return {
        senderState: hangoutStates.UNBLOCKED,
        targetState: hangoutStates.UNBLOCKER,
      };
    case "UNDECLINE":
      return {
        senderState: hangoutStates.UNDECLINED,
        targetState: hangoutStates.UNDECLINER,
      };
    case "READING":
      return {
        senderState: hangoutStates.READ,
        targetState: hangoutStates.READER,
      };
    default:
      throw new Error("clientCommand type not specified");
  }
};
