/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
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

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);
    const result = await collection.insertOne({
      password: hash,
      email,
      username,
    });

    return result;
  } catch (error) {
    return error;
  }
};
