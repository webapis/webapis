require('dotenv').config();
import httpRoute from './http-route';
import http from 'http';

const server = http.createServer(httpRoute);
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000, () => {
  console.log('processId', process.pid);
});
////