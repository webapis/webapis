/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function seedLogin({ email, username, password }) {
  console.log('logindata seeded');
  debugger;
  try {
    const clnt = await client.connect();
    const database = clnt.db('auth');
    const collection = database.collection('users');
    const deleteResult = await collection.deleteMany();
    debugger;
    const salt = await bcrypt.genSalt(10);
    debugger;
    const hash = await bcrypt.hash(password, salt);
    const result = await collection.insertOne({
      password: hash,
      email,
      username,
    });

    return result;
  } catch (error) {
    let err = error;
    debugger;
  }
};
