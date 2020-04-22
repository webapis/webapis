/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import 'babel-polyfill';
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectId;
import apiurl from 'url';
import login from './login';
import signup from './signup';
import changePassword from './changePassword';
import recover from './recover';
const profile = require('./profile');

export default function (req, res) {
  const { url } = req;
  const collectionName = 'users';
  const database = req.client.db('auth');
  const collection = database.collection(collectionName);
  req.collection = collection;
  debugger;
  switch (true) {
    case url.includes('/login'):
      debugger;
      login({ req, res, collection });
      break;
    case url.includes('/signup'):
      signup({ req, res, collection });
      break;
    case url.includes('/changepass'):
      debugger;
      changePassword({ req, res, collection });
      break;
    case url.includes('/requestpasschange'):
      debugger;
      recover({ req, res, collection });
      break;
    case url.includes('/profile'):
      profile({ req, res, collection });
      break;
    default:
      return null;
  }
}
