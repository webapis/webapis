/* eslint-disable no-undef */
const passhash =require('../../server/auth/hashPassword')
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
    const  {hash,salt,iterations}= passhash.hashPassword(password)
        
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
    let err = error;
    debugger;
  }
};
