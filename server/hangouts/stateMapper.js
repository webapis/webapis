const hangoutStates = require("./hangoutStates");

module.exports = function stateMapper({ command }) {
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
    case "READ":
      return {
        senderState: hangoutStates.READ,
        targetState: hangoutStates.READER,
      };
    default:
      debugger;
      throw new Error("clientCommand type not specified");
  }
};
