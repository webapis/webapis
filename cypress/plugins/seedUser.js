/* eslint-disable no-undef */
const passhash = require('../../server/auth/hashPassword');
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function seedUser({ email, username, password }) {
  try {
    const clnt = await client.connect();
    const database = clnt.db('auth');
    const collection = database.collection('users');
    await collection.deleteMany();

    const { hash, salt, iterations } = passhash.hashPassword(password);

    debugger;

    const result = await collection.insertOne({
      hash,
      salt,
      iterations,
      email,
      username,
    });

    return result;
  } catch (error) {
    return error;
  }
};
