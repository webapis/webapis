const hangoutHandler = require("./hangoutHandler");

module.exports = async function hangouts({ hangout, ws, client, connections }) {
  const collection = await client.db("auth").collection("users");

  switch (hangout.command) {
    case "ACCEPT":
    case "BLOCK":
    case "DECLINE":
    case "INVITE":
    case "MESSAGE":
    case "UNBLOCK":
    case "READING":
    case "SEEING":
      hangoutHandler({ collection, hangout, ws, connections });
      break;
    default:
      throw new Error("No message type is provided for switch statement");
  }
};

//
