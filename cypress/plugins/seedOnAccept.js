/* eslint-disable no-undef */
const url = "mongodb://localhost:27017";
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const userInviter = { username: "demo" };
const userAccepter = { username: "bero" };
const accepted = {
  username: "demo",
  email: "demo@gmail.com",
  state: "ACCEPTED",
  message: { text: "Lets chat on hang", timestamp: 1591417896448 },
};
const accepter = {
  username: "bero",
  email: "bero@gmail.com",
  message: { text: "Lets chat on hang", timestamp: 1591417896448 },
  state: "ACCEPTER",
};
module.exports = async function seedOnMessage() {
  try {
    const clnt = await client.connect();
    const database = clnt.db("hangouts");

    const collection = database.collection("users");
    //delete users
    await collection.deleteMany({});
    //insert users
    await collection.insertOne(userInviter);
    await collection.insertOne(userAccepter);

    //inserHangout  to userInviter state:ACCEPTER
    // await collection.updateOne(
    //   { username: userInviter },
    //   { $push: { hangouts: accepter } }
    // );
    // insertHangout to userAccepter state:ACCEPTED
    await collection.updateOne(
      { username: userAccepter },
      { $push: { hangouts: accepted } }
    );
    console.log("updating onAccepseed");
    return result;
  } catch (error) {
    console.log("err", error);
    return error;
  }
};
