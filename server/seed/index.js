const usersSeed = require("./users");
const recoverSeed = require("./seed-recover");
const hangoutSeed = require("./hangouts");
module.exports = function seedOperation(req, res) {
  const { url } = req;
  switch (true) {
    case url.includes("/users"):
      usersSeed(req, res);
      break;
    case url.includes("/requestpasschange"):
      recoverSeed(req, res);
      break;
    case url.includes("/hangouts"):
      hangoutSeed(req, res);
      break;
    default:
      null;
  }
};
