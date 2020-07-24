const { sendErrors, saveError } = require("./error-monitor");
module.exports = function (req, res) {
  const { url } = req;
  const collectionName = "errors";
  const database = req.client.db("errmonitor");
  const collection = database.collection(collectionName);
  req.collection = collection;

  switch (true) {
    case url.includes("/errors/"):
      debugger;
      sendErrors({ req, res, collection });
      break;
    case url.includes("/client-error/"):
      debugger;
      saveError({ req, res, collection });
      break;
    default:
      return null;
  }
};
