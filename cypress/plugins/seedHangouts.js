/* eslint-disable no-undef */
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function seedHangouts() {
  try {
    const clnt = await client.connect();
    const database = clnt.db('hangouts');
    const collection = database.collection('users');
    await collection.deleteMany();

   

    


    return result;
  } catch (error) {
    return error;
  }
};
