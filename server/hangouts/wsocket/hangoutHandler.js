const stateMapper = require("../stateMapper");
const mongoDBPersistance = require("./handlePersistance");
module.exports = async function hangoutHandler({
  collection,
  hangout,
  ws,
  connections,
}) {
  debugger;
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

    await mongoDBPersistance.handlePersistance({
      connections,
      target,
      sender,
      collection,
      senderUserName: ws.user.username,
      username,
      hangout,
    });

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

    console.log("hangoutHandlerError", error);
  }
};
