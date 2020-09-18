Cypress.Commands.add("hangoutProtocols", ({ protocol }) => {
  const { data } = protocol;
  switch (protocol.type) {
    case "HANGOUT":
      break;
    case "ACKHOWLEDGEMENT":
      break;
    default:
      throw "No Hangout protocol provided";
  }
});
