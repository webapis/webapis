export default function testProtocol({ protocol }) {
  const { data } = protocol;
  switch (protocol.type) {
    case "HANGOUT":
      expect(data).to.have.keys(
        "browserId",
        "command",
        "target",
        "timestamp",
        "message",
        "email"
      );
      break;
    case "ACKHOWLEDGEMENT":
      break;
    default:
      throw "No Hangout protocol provided";
  }
}
