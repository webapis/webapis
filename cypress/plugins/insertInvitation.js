/* eslint-disable no-undef */
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function insertInvitation({
  user,
  invitation,
  collectionName,
  dbName,
}) {
  try {
    const clnt = await client.connect();
    const database = clnt.db(dbName);
    const collection = database.collection(collectionName);
    await collection.deleteMany();
    await collection.insertOne(user);
    console.log('insert user')
   const result= await collection.updateOne(
      { username: user.username },
      { $push: { invitations: invitation } }
    );
    return result;
  } catch (error) {
      console.log('err',error)
    return error;
  }
};
