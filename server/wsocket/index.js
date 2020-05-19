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
    debugger;
    try {
      const token = cookie.parse(request.headers['cookie']);
      const decoded = await jwt.verify(token.tkn, process.env.secret);
      const { username } = decoded;
      connections[username] = ws;

      debugger;
      wsocket.emit('connection', username);
      ws.on('message', function incoming(message) {
        try {
          const msg = JSON.parse(message);
       
          console.log('received: %s', msg.type);

          switch (msg.type) {
            case 'INVITE':
              wsocket.emit('invite', msg);
              break;
            case 'ACCEPT':
              wsocket.emit('accept', msg);
              break;
            case 'BLOCK':
              wsocket.emit('block', msg);
              break;
            case 'UNBLOCK':
              wsocket.emit('unblock', msg);
              break;
            case 'DECLINE':
              wsocket.emit('decline', msg);
              break;
            case 'MESSAGE':

            default:
              throw new Error('No message type is provided');
          }
        } catch (error) {
          throw new Error(error);
        }
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
