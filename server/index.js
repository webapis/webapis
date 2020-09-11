require("dotenv").config();
const PORT = process.env.PORT || 3000;
//import http from 'http';
const ws = require("./websocket");
//import { parseServer } from "./parse";//
const httpRoute = require("./http-route");
const https = require("https");
const http = require("http");
const fs = require("fs");
const url = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const { MongoClient } = require("mongodb");
// parse
if (process.env.PREACT_APP_BACK === "PREACT_APP_PARSE") {
  // parseServer();
} //

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

(async () => {
  let server = null;
  const client = await new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    server = http.createServer(httpRoute(client, server));
  } else {
    server = https.createServer(options, httpRoute(client));
  }

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
  server.listen(PORT, (error) => {
    if (error) {
      const err = error;

      process.exit(0);
      throw error;
    }
    console.log("processId", process.pid);
  });
})();
