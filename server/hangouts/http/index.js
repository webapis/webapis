import 'babel-polyfill';
import find from './find';
export default function hangoutsOperation(req, res) {

  const { url } = req;
  const collectionName = 'users';
  const database = req.client.db('auth');
  const collection = database.collection(collectionName);
  req.collection = collection;
 //
  switch (true) {
    case url.includes('/find'):
      find({ req, res, collection });
      break;
    default:
      return null;
  }
}
