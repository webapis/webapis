import hangoutsHandler from '../hangouts/wsocket';
import {onLineStateChangeHandler} from '../hangouts/wsocket/onLineStateChangeHandler'
import url from 'url';
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const EventEmitter = require('events');
const WebSocket = require('ws');
export const wsocket = new EventEmitter();
let connections = {};
export default async function (server,client) {
  const collection = await client.db('auth').collection('users');
  const wss = new WebSocket.Server({ server });
  wss.on('connection', async function connection(ws, request) {
    try {
      const token = cookie.parse(request.headers['cookie']);

      let uname = url.parse(request.url, true).query.username;
      const decoded = await jwt.verify(token[uname], process.env.secret);
      const { username } = decoded;
      console.log(username,'conneted')
      const user = await collection.findOne({username})
      ws.user= user;
      connections[username] = ws; //
      
      onLineStateChangeHandler({connections,ws,client})
      ws.on('message', function incoming(message) {
        console.log('recieved,', message);
        try {
          if (request.url.includes('hangouts')) {
            const hangout = JSON.parse(message);
            hangoutsHandler({ hangout, connections,ws,client });
          }
        } catch (error) {
          const err = error;
          throw new Error(error);
        }
      });
      ws.on('close', function () {
        console.log('coonection closed:', username);
        delete connections[username];
      });
    } catch (error) {
      const err = error;

    }
  });
}

