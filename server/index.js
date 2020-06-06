require('dotenv').config();
import httpRoute from './http-route';
import http from 'http';
import ws from './wsocket';

const url = 'mongodb://127.0.0.1:27017';
const { MongoClient } = require('mongodb');
(async () => {
  const client = await new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();
  const server = http.createServer(httpRoute(client));

  ws(server, client);
  function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
    });
  
    setTimeout(() => {
      console.error(
        'Could not close connections in time, forcefully shutting down',
      );
      process.exit(1);
    }, 10000);
  }
  
  process.on('SIGTERM', shutDown);
  process.on('SIGINT', shutDown);
  server.listen(3000, () => {
    console.log('processId', process.pid);
  });
})();
//