var express = require('express');
var app = express();
const fs = require('fs');
var ParseServer = require('parse-server').ParseServer;
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};
export function parseServer(){
    var api = new ParseServer({ 
        databaseURI: 'mongodb://127.0.0.1:27017',
        cloud: './cloud/main.js',
        appId: 'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
        masterKey: '1xxoXAIV3bZeYDBii6Ob8g2fz6ugUXjHKwX1LhDb',
        serverURL: `https://${process.env.ip}:1337/parse`,
        liveQuery: {
          classNames: ['Hangout','HangoutUser']
        }
       });
     
 
       var port = 1337;
       let httpServer = require('https').createServer( options,app);
    
       ParseServer.createLiveQueryServer(httpServer);
       app.use('/parse', api);
       httpServer.listen(port, function() {
        console.log('parse-server-example running on port ' + port + '.');
      });
}

