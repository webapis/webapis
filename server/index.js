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

  server.listen(3000, () => {
    console.log('processId', process.pid);
  });
})();
