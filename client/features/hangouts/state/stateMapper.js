export default function stateMapper({ command }) {
  switch (command) {
    case "ACCEPT":
      return {
        senderState: "ACCEPTED",
        targetState: "ACCEPTER",
      };
    case "BLOCK":
      return {
        senderState: "BLOCKED",
        targetState: "BLOCKER",
      };
    case "DECLINE":
      return {
        senderState: "DECLINED",
        targetState: "DECLINER",
      };
    case "INVITE":
      return {
        senderState: "INVITED",
        targetState: "INVITER",
      };
    case "MESSAGE":
      return {
        senderState: "MESSAGED",
        targetState: "MESSANGER",
      };

    case "UNBLOCK":
      return {
        senderState: "UNBLOCKED",
        targetState: "UNBLOCKER",
      };
    case "READ":
      return {
        senderState: "READ",
        targetState: "READER",
      };
    default:
      throw new Error("clientCommand type not specified");
  }
}
