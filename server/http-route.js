
/* eslint-disable linebreak-style */
/* eslint-disable indent */ //
//import invitationOperation from './invitation';
//import crudOperation from './crud/crud';
import authOperation from './auth/index';
import hangoutsOperation from './hangouts/http'
import contactsOperation from './contacts';
import usersOperation from './users';
import seedOperation from './seed';
import serveStatic from './serve-static/index';
import servePassReset from './serve-static/serve-pass-reset';

export default function httpRoute(client) {
  return async function (req, res) {
    const { url } = req;
    const authRegex = /.*\/auth\/.*/;
    const resetRegex = /.*\/reset\/.*/;
    // const crudRegex = /.*\/crud\/.*/;
    const seedRegex = /.*\/seed\/.*/;
    const contactsRegex = /.*\/contacts\/.*/;
    const usersRegex = /.*\/users\/.*/;
   const hangoutsRegex = /.*\/hangouts\/.*/;
    req.auth = null;

    res.on('end', () => {
      
      clnt.close();
    });
    req.client = client;
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
            
            const body = JSON.parse(data);
            req.body = body;
          }
          switch (true) {
            case authRegex.test(url):
              
              authOperation(req, res);
              break;

            case seedRegex.test(url):
              
              seedOperation(req, res);
              break;
            case resetRegex.test(url):
              servePassReset(req, res);
              break;
            case contactsRegex.test(url):
              contactsOperation(req, res);
              break;
            case usersRegex.test(url):
              debugger;
              usersOperation(req, res);
              break;
            case hangoutsRegex.test(url):
              debugger;
              hangoutsOperation(req, res);
              break;
            default:
              serveStatic(req, res);
          }
        });
        break;
      case 'GET':
        switch (true) {
          case authRegex.test(url):
            
            authOperation(req, res);
            break;
          case seedRegex.test(url):
            
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
            case hangoutsRegex.test(url):
            
              hangoutsOperation(req, res);
              break;
          default:
            serveStatic(req, res);
        }

        break;
      default:
        throw new Error('No operation is provied');
    }
  };
}


