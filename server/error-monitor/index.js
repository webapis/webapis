const { clientError } = require("./client-error");

module.exports = function (req, res) {
  debugger;
  const { url } = req;
  const collectionName = "errors";
  const database = req.client.db("errmonitor");
  const collection = database.collection(collectionName);
  req.collection = collection;

  switch (true) {
    case url.includes("/client-error/"):
      debugger;
      clientError({ req, res, collection });
      break;
    default:
      return null;
  }
};
