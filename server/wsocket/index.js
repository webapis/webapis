import invwsocket from '../invitation/wsocket';
import chatMessages from './chatMessages';
import url from 'url';
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const EventEmitter = require('events');
const WebSocket = require('ws');
export const wsocket = new EventEmitter();

let connections = {};
let con = [];
export default function (server) {
  invwsocket();
  const wss = new WebSocket.Server({ server });
  wss.on('connection', async function connection(ws, request) {
    try {
      const token = cookie.parse(request.headers['cookie']);
      let uname = url.parse(request.url, true).query.username;

        debugger;
      const decoded = await jwt.verify(token[uname], process.env.secret);
      const { username } = decoded;
      ws.username = username;
      connections[username] = ws; //
      con.push(ws);
      console.log('new connection', username);
      //  debugger;
      wsocket.emit('connection', username);
      ws.on('message', function incoming(message) {
        try {
          console.log('recieved,', message);
          const msg = JSON.parse(message);

          if (msg && msg.path) {
            switch (msg.path) {
              case 'chat':
                chatMessages({ message: msg, connections });
                break;
              default:
                throw new Error('No message path is provided');
            }
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
      console.log(err);

      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });
}

