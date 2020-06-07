/* eslint-disable no-undef */
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const userInviter = { username: 'demo' }
const userInvitee = { username: 'bero' }
const invitedHangout = { username: 'bero', email: 'bero@gmail.com', state: "INVITED", message: { text: 'Lets chat friend', timestamp: 1591457950578 } }
const inviterHangout = { username: 'demo', email: 'demo@gmail.com', state: "INVITER", message: { text: "Lets chat friend", timestamp: 1591457950578 } }

module.exports = async function seedOnInvite() {
  try {
    const clnt = await client.connect();
    const database = clnt.db('hangouts');
    const collection = database.collection('users');
    //delete users
    await collection.deleteMany();
    //insert users
    await collection.insertOne(userInviter);
    await collection.insertOne(userInvitee);

    //push hangout to invitee
    await collection.updateOne(
      { username: userInvitee.username },
      { $push: { hangouts: inviterHangout } }
    );
    //push hangout to inviter
    await collection.updateOne(
      { username: userInviter.username },
      { $push: { hangouts: invitedHangout } }
    );
    //INVITEE OFFLINE: save hangout to undeliverded
    await collection.updateOne(
      { username: userInvitee.username },
      {
        $push: {
          undeliverded: inviterHangout,
        }
      }
    );
    return result;
  } catch (error) {
    console.log('err', error)
    return error;
  }
};
