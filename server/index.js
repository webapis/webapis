require("dotenv").config();
import httpRoute from "./http-route";
//import http from 'http';
import ws from "./wsocket";
import { parseServer } from "./parse";
const https = require("https");
const fs = require("fs");
const url = "mongodb://127.0.0.1:27017";
const { MongoClient } = require("mongodb");
// parse
if (process.env.PREACT_APP_BACK === "PREACT_APP_PARSE") {
  parseServer();
}

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

(async () => {
  const client = await new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();
  // const server = http.createServer(httpRoute(client));
  const server = https.createServer(options, httpRoute(client));

  ws(server, client);
  function shutDown() {
    console.log("Received kill signal, shutting down gracefully");
    server.close(() => {
      console.log("Closed out remaining connections");
      process.exit(0);
    });

    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 10000);
  }

  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);
  server.listen(3000, (error) => {
    if (error) {
      process.exit(0);
      throw error;
    }
    console.log("processId", process.pid);
  });
})();
