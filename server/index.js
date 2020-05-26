require('dotenv').config();
import httpRoute from './http-route';
import http from 'http';
import ws from './wsocket';


const url = 'mongodb://localhost:27017';
const { MongoClient } = require('mongodb');
// const client = server.on('clientError', (err, socket) => {
//   socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
// });


(async () => {
  const client = await new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
  await client.connect();
  const server = http.createServer(httpRoute(client));
 // database();
  ws(server);
  
  server.listen(3000, () => {
    console.log('processId', process.pid);
  });

})();
