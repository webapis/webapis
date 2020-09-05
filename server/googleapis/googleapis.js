const gmailapi = require("./gmail/gmailapi");
module.exports = function googleapiOperations(req, res) {
  const { url } = req;

  switch (true) {
    case url.includes("/gmailapi"):
      gmailapi({ req, res });
      break;
    default:
      return null;
  }
};
