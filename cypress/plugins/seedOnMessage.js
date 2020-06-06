/* eslint-disable no-undef */
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = async function seedOnMessage({
  userMessanger,
  userMessangee,
  messagerHangout,
  messangeeHangout,
  collectionName,
  dbName,
}) {
  try {
    const clnt = await client.connect();
    const database = clnt.db(dbName);
    const collection = database.collection(collectionName);
    //inser messanger and messangee
    await collection.insertOne(userMessanger);
    await collection.insertOne(userMessangee);
    
    //inserHangout  to userMessager state:ACCEPTER
    await collection.updateOne(
      { username: userMessanger.username },
      { $push: { hangouts: messagerHangout } }
    );
    // insertHangout to userMessangee state:ACCEPTED
    await collection.updateOne(
      { username: userMessangee.username },
      { $push: { hangouts: messangeeHangout } }
    );
    return result;
  } catch (error) {
    console.log('err', error);
    return error;
  }
};
