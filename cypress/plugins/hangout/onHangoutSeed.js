/* eslint-disable no-undef */
const stateMapper = require("./stateMapper");
const url = "mongodb://localhost:27017";
const MongoClient = require("mongodb").MongoClient;
const mongoDBPersistance = require("../../../server/hangouts/wsocket/handlePersistance");
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
module.exports = async function onHangoutSeed({
  hangout,
  senderUsername,
  senderEmail,
  targetOnline = false,
}) {
  try {
    const clnt = await client.connect();
    const database = clnt.db("auth");
    const collection = database.collection("users");
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
      username: senderUsername,
      email: senderEmail,
      message,
      timestamp,
      state: targetState,
    };
    console.log("cypress node pid", process.pid);
    mongoDBPersistance.handlePersistance({
      target,
      sender,
      senderUserName: senderUsername,
      username,
      collection,
      hangout,
    });

    return true;
  } catch (error) {
    console.log("seed error", error);
    return error;
  }
};
