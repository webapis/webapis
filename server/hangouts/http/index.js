import "babel-polyfill";
import findOne from "./findOne";
import findHangouts from "./findHangouts";
export default function hangoutsOperation(req, res) {
  const { url } = req;
  const collectionName = "users";
  const database = req.client.db("auth");
  const collection = database.collection(collectionName);
  req.collection = collection;

  switch (true) {
    case url.includes("/findOne"):
      findOne({ req, res, collection });
      break;
    case url.includes("/findHangouts"):
      findHangouts({ req, res, collection });
      break;
    default:
      return null;
  }
}
