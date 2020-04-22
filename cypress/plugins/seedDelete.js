/* eslint-disable no-undef */
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function seedDelete() {
  try {
    const clnt = await client.connect();
    const database = await clnt.db('auth');
    const collection = await database.collection('users');
    const result = await collection.deleteMany();

    return result;
  } catch (error) {
    return error;
  }
};
