import hangoutsHandler from '../hangouts';
import url from 'url';
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const EventEmitter = require('events');
const WebSocket = require('ws');
export const wsocket = new EventEmitter();
let connections = {};
export default function (server,client) {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', async function connection(ws, request) {
    debugger;
    try {
      const token = cookie.parse(request.headers['cookie']);

      let uname = url.parse(request.url, true).query.username;

      debugger;
      const decoded = await jwt.verify(token[uname], process.env.secret);
      const { username } = decoded;
      ws.username = username;
      connections[username] = ws; //

      ws.on('message', function incoming(message) {
        console.log('recieved,', message);
        debugger;
        try {
          if (request.url.includes('hangouts')) {
            debugger;
          
            const hangouts = JSON.parse(message);
            hangoutsHandler({ hangouts, connections,ws,client });
          }
        } catch (error) {
          const err = error;

          debugger;
          throw new Error(error);
        }
      });
      ws.on('close', function () {
        console.log('coonection closed:', username);
        debugger;
        delete connections[username];
      });
    } catch (error) {
      const err = error;

      debugger;
    }
  });
}
//
