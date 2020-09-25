const clientCommands = {
  INVITE: "INVITE",
  ACCEPT: "ACCEPT",
  DECLINE: "DECLINE",
  BLOCK: "BLOCK",
  UNBLOCK: "UNBLOCK",
  MESSAGE: "MESSAGE",
  ONLINE: "ONLINE",
  READ: "READ",
};

const hangoutStates = {
  INVITER: "INVITER",
  ACCEPTER: "ACCEPTER",
  DECLINER: "DECLINER",
  BLOCKER: "BLOCKER",
  UNBLOCKER: "UNBLOCKER",
  MESSANGER: "MESSANGER",
  READER: "READER",
  // acknowlegement
  INVITED: "INVITED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  BLOCKED: "BLOCKED",
  UNBLOCKED: "UNBLOCKED",
  MESSAGED: "MESSAGED",
  READ: "READ",
};
module.exports = function stateMapper({ command }) {
  switch (command) {
    case clientCommands.ACCEPT:
      return {
        senderState: hangoutStates.ACCEPTED,
        targetState: hangoutStates.ACCEPTER,
      };
    case clientCommands.BLOCK:
      return {
        senderState: hangoutStates.BLOCKED,
        targetState: hangoutStates.BLOCKER,
      };
    case clientCommands.DECLINE:
      return {
        senderState: hangoutStates.DECLINED,
        targetState: hangoutStates.DECLINER,
      };
    case clientCommands.INVITE:
      return {
        senderState: hangoutStates.INVITED,
        targetState: hangoutStates.INVITER,
      };
    case clientCommands.MESSAGE:
      return {
        senderState: hangoutStates.MESSAGED,
        targetState: hangoutStates.MESSANGER,
      };

    case clientCommands.UNBLOCK:
      return {
        senderState: hangoutStates.UNBLOCKED,
        targetState: hangoutStates.UNBLOCKER,
      };
    case clientCommands.READ:
      return {
        senderState: hangoutStates.READ,
        targetState: hangoutStates.READER,
      };
    default:
      throw new Error("clientCommand type not specified");
  }
};
