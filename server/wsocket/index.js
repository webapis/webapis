import invwsocket from '../invitation/wsocket';
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const EventEmitter = require('events');
const WebSocket = require('ws');
export const wsocket = new EventEmitter();

export const connections = {};
export default function (server) {
  invwsocket();
  const wss = new WebSocket.Server({ server });
  wss.on('connection', async function connection(ws, request) {
    try {
      const token = cookie.parse(request.headers['cookie']);
      const decoded = await jwt.verify(token.tkn, process.env.secret);
      const { username } = decoded;
      connections[username] = ws;

      debugger;
      wsocket.emit('connection', username);
      ws.on('message', function incoming(message) {
        wsocket.emit('message', { message, username });
        console.log('received: %s', message);
      });
      ws.on('close', function () {
        delete connections[username];
        debugger;
      });

      debugger;
    } catch (error) {
      const err = error;
      console.log(err);
      debugger;
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });
}
