import 'babel-polyfill';
import find from './find';
export default function hangoutsOperation(req, res) {
  debugger;
  const { url } = req;
  const collectionName = 'users';
  const database = req.client.db('hangouts');
  const collection = database.collection(collectionName);
  req.collection = collection;
  debugger;
  switch (true) {
    case url.includes('/find'):
      find({ req, res, collection });
      break;
    default:
      return null;
  }
}
