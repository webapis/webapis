/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import 'babel-polyfill';
import findOne from './findOne';
import insertOne from './insertOne';
import updateOne from './updateOne';
import find from './find';
export default function (req, res) {
  const { url } = req;
  const collectionName = 'invitations';
  const database = req.client.db('auth');
  const collection = database.collection(collectionName);
  req.collection = collection;
  
  switch (true) {
    case url.includes('/findOne'):
      
      findOne({ req, res, collection });
      break;
    case url.includes('/updateOne'):
      
      updateOne({ req, res, collection });
      break;
    case url.includes('/insertOne'):
      
      insertOne({ req, res, collection });
      break;
    case url.includes('/find'):
      
      find({ req, res, collection });
      break;

    default:
      return null;
  }
}
