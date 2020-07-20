/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */

const bcrypt = require("crypto");
const ObjectID = require("mongodb").ObjectId;
const apiurl = require("url");
const login = require("./login");
const signup = require("./signup");
const changePassword = require("./changePassword");
const recover = require("./recover");

//
module.exports = function (req, res) {
  const { url } = req;
  const collectionName = "users";
  const database = req.client.db("auth");
  const collection = database.collection(collectionName);
  req.collection = collection;

  switch (true) {
    case url.includes("/login"):
      login({ req, res, collection });
      break;
    case url.includes("/signup"):
      signup({ req, res, collection });
      break;
    case url.includes("/changepass"):
      changePassword({ req, res, collection });
      break;
    case url.includes("/requestpasschange"):
      recover({ req, res, collection });
      break;

    default:
      return null;
  }
};
