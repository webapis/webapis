const findOne = require("./findOne");
const findHangouts = require("./findHangouts");

module.exports = function hangoutsOperation(req, res) {
  const { url } = req;
  const collectionName = "users";
  const database = req.client.db("auth");
  const collection = database.collection(collectionName);
  req.collection = collection;

  switch (true) {
    case url.includes("/findOne"):
      debugger;
      findOne({ req, res, collection });
      break;
    case url.includes("/findHangouts"):
      debugger;
      findHangouts({ req, res, collection });
      break;

    default:
      return null;
  }
};
