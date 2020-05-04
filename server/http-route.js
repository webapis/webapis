/* eslint-disable linebreak-style */
/* eslint-disable indent */ //
import crudOperation from './crud/crud';
import authOperation from './auth/index';
import contactsOperation from './contacts';
import usersOperation from './users';
import seedOperation from './seed';
import serveStatic from './serve-static/index';
import servePassReset from './serve-static/serve-pass-reset';
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

export default async function httpRoute(req, res) {
  const { url } = req;
  const authRegex = /.*\/auth\/.*/;
  const resetRegex = /.*\/reset\/.*/;
  const crudRegex = /.*\/crud\/.*/;
  const seedRegex = /.*\/seed\/.*/;
  const contactsRegex = /.*\/contacts\/.*/;
  const usersRegex = /.*\/users\/.*/;
  req.auth = null;
  const clnt = await client.connect();
  req.client = clnt;
  res.setHeader('Access-Control-Allow-Origin', '*');
  let data = [];

  let responseHeader = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'access-control-allow-headers': '*',
    'access-control-max-age': 10,
    'Content-Type': 'application/json',
  };
  switch (req.method) {
    case 'OPTIONS':
      debugger;
      res.writeHead(200, responseHeader);
      res.end();
      break;
    case 'POST':
    case 'PUT':

    case 'DELETE':
      req.on('data', (chunk) => {
        data.push(chunk);
      });
      req.on('end', () => {
        if (data.length > 0) {
          debugger;
          const body = JSON.parse(data);
          req.body = body;
        }
        switch (true) {
          case authRegex.test(url):
            debugger;
            authOperation(req, res);
            break;
          case crudRegex.test(url):
            debugger;
            crudOperation(req, res);
            break;
          case seedRegex.test(url):
            debugger;
            seedOperation(req, res);
            break;
          case resetRegex.test(url):
            servePassReset(req, res);
            break;
          case contactsRegex.test(url):
            contactsOperation(req, res);
            break;
          case usersRegex.test(url):
            usersOperation(req, res);
            break;
          default:
            serveStatic(req, res);
        }
      });
      break;
    case 'GET':
      switch (true) {
        case authRegex.test(url):
          debugger;
          authOperation(req, res);
          break;
        case crudRegex.test(url):
          debugger;
          crudOperation(req, res);
          break;
        case seedRegex.test(url):
          debugger;
          seedOperation(req, res);
          break;
        case resetRegex.test(url):
          servePassReset(req, res);
          break;
        case contactsRegex.test(url):
          contactsOperation(req, res);
          break;
        case usersRegex.test(url):
          usersOperation(req, res);
          break;
        default:
          serveStatic(req, res);
      }

      break;
    default:
      crudOperation(req, res);
  }
}
