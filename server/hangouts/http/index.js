const findOne = require("./findOne");
const findHangouts = require("./findHangouts");
const inviteAsGuest = require("./inviteAsGuest");
module.exports = function hangoutsOperation(req, res) {
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
    case url.includes("/inviteasguest"):
      inviteAsGuest({ req, res, collection });

    default:
      return null;
  }
};
