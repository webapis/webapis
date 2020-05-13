require('dotenv').config();
import httpRoute from './http-route';
import http from 'http';
import ws from './wsocket';
import database from './db';
const server = http.createServer(httpRoute);
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

database();
ws(server);

server.listen(3000, () => {
  console.log('processId', process.pid);
});
