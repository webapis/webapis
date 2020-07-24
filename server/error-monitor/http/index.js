const { clientError } = require("./client-error");
const { errorMonitor } = require("./error-monitor");
module.exports = function (req, res) {
  const { url } = req;
  const collectionName = "errors";
  const database = req.client.db("errmonitor");
  const collection = database.collection(collectionName);
  req.collection = collection;

  switch (true) {
    case url.includes("/client-error/"):
      clientError({ req, res, collection });
      break;
    case url.includes("/error-monitor/"):
      errorMonitor({ req, res, collection });
      break;
    default:
      return null;
  }
};
