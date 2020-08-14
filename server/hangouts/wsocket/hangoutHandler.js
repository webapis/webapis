const stateMapper = require("../stateMapper");
const mongoDBPersistance = require("./handlePersistance");
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
    const { username, email, message, offline, timestamp, browserId } = hangout;
    const sender = {
      username,
      email,
      message,
      timestamp,
      state: senderState,
      browserId,
    };
    //
    const target = {
      username: ws.user.username,
      email: ws.user.email,
      message,
      timestamp,
      state: targetState,
    };

    await mongoDBPersistance.handlePersistance({
      connections,
      target,
      sender,
      collection,
      senderUserName: ws.user.username,
      username,
      hangout,
    });
  } catch (error) {
    const err = error;

    console.log("hangoutHandlerError", error);
  }
};
