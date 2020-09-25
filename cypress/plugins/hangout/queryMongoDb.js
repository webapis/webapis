/* eslint-disable no-undef */
const url = "mongodb://localhost:27017";
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function queryMongoDb({ username }) {
  try {
    const clnt = await client.connect();
    const database = await clnt.db("auth");
    const collection = await database.collection("users");

    return await collection.findOne({ username });
  } catch (error) {
    return error;
  }
};
