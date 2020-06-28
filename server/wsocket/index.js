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
 //
    try {
 debugger;
      const token = cookie.parse(request.headers['cookie']);
debugger;
      let uname = url.parse(request.url, true).query.username;
     debugger;
      const decoded = await jwt.verify(token[uname], process.env.secret);
    debugger;
      const { username } = decoded;
      debugger;
      console.log(username,'conneted')
      const user = await collection.findOne({username})
    debugger;
      ws.user= user;
      connections[username] = ws; 
      debugger;
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
          debugger;
          throw new Error(error);
        }
      });
      ws.on('close', function () {
        console.log('coonection closed:', username);
        delete connections[username];
      });
    } catch (error) {
     
      const err = error;
      debugger;
    }
  });
}
//
