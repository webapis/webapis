const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const EventEmitter = require('events');
const url = 'mongodb://localhost:27017';

export const db = new EventEmitter();

export default async function () {
  const url = 'mongodb://localhost:27017';
  const MongoClient = require('mongodb').MongoClient;
  const client = new MongoClient(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const clnt = await client.connect();
  db.on('insertOne', async function (conf) {
      console.log('insertOne emitted')
    try {
      console.log('insertOne', conf);
      const collection = await clnt.db(conf.dbName).collection(conf.colName);
      debugger;
      const result = await collection.insertOne({ ...conf.obj });
      console.log('result', result);
      db.emit(`insertOne_${conf.colName}`, {
        dbName: 'chat',
        colName: 'invitation',
        obj: result,
      });
    } catch (error) {
      console.log('err', error);
    }
  });
  db.on('updateOne', function inserOne() {
    console.log('updateOne');
  });
//
  db.emit('updateOne');
}
