/* eslint-disable no-undef */
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function insertInvitation({
  userInviting,
  userInvited,
  invitation,
  hangout,
  collectionName,
  dbName,
}) {
  try {
    const clnt = await client.connect();
    const database = clnt.db(dbName);
    const collection = database.collection(collectionName);
    await collection.deleteMany();
    await collection.insertOne(userInvited);
    await collection.insertOne(userInviting);
    console.log('insert user')
     await collection.updateOne(
      { username: userInvited.username },
      { $push: { invitations: invitation } }
    );
       await collection.updateOne(
      { username: userInviting.username },
      { $push: { hangouts: hangout } }
    );
    return result;
  } catch (error) {
      console.log('err',error)
    return error;
  }
};
