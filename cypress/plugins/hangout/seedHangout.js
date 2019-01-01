/* eslint-disable no-undef */
const url = "mongodb://localhost:27017";
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function seedHangout({ username, hangout }) {
  try {
    const clnt = await client.connect();
    const database = await clnt.db("auth");
    const collection = await database.collection("users");

    return {
      updateResult: await collection.update(
        { username },
        { $push: { "browsers.$[t].hangouts": hangout } },
        {
          arrayFilters: [{ "t.browserId": "BID1234567890" }],
          upsert: true,
        }
      ),
      findResult: await collection.findOne({ username }),
    };
  } catch (error) {
    return error;
  }
};
