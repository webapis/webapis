/* eslint-disable no-undef */
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function deleteDatabase({dbName }) {
  try {
    const clnt = await client.connect();
    const database = clnt.db(dbName);
    const collection = await database.dropDatabase()
   
    return result;
  } catch (error) {
    return error;
  }
};