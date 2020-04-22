import getNavigations from './getNavigations';
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
import apiurl from 'url';

const url = 'mongodb://localhost:27017';

const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

function handleResponse({ result, res, statusCode }) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = statusCode;
  res.write(JSON.stringify(result));
  res.end();
}

export default async function crudOperation(req, res) {
  let result = null;

  let filter = apiurl.parse(req.url, true).query.filter;
  let document = apiurl.parse(req.url, true).query.document;
  let appName = apiurl.parse(req.url, true).query.appName;
  let doc = req.body;
  const { url } = req;
  debugger;
  try {
    const clnt = await client.connect();
    const db = clnt.db(appName);
    let obj;
    let updateResult;
    let deleteResult;
    switch (true) {
      case url.includes('/insertOne'):
        result = await db.collection(document).insertOne(doc);

        handleResponse({
          result: { _id: result.insertedId },
          statusCode: 201,
          res
        });

        break;
      case url.includes('/updateOne'):
        obj = { ...doc };
        delete obj._id;
        filter = { _id: new ObjectID(doc._id) };
        updateResult = await db
          .collection(document)
          .updateOne(filter, { $set: { ...obj } });

        if (updateResult.result.nModified === 1) {
          handleResponse({ result: {}, statusCode: 204, res });
        } else {
          handleResponse({ result, statusCode: 304, res });
        }

        break;
      case url.includes('/deleteOne'):
        filter = { _id: new ObjectID(doc._id) };
        deleteResult = await db.collection(document).deleteOne(filter);

        if (deleteResult.deletedCount === 1) {
          handleResponse({ result: {}, statusCode: 202, res });
        } else {
          handleResponse({ result: {}, statusCode: 404, res });
        }

        break;
      case url.includes('/list'):
        debugger;
        result = await db
          .collection(document)
          .find({})
          .toArray();

        handleResponse({ result, statusCode: 200, res });

        break;
      case url.includes('/navigations'):
        let navs = getNavigations({ appName });

        handleResponse({ result: navs, statusCode: 200, res });

        break;
      default:
        res.setHeader('Content-Type', 'text/plain');
        res.end('Path no spesified\n');
    }
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error));
    res.end();
  }
}
