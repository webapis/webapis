var express = require('express');
var app = express();
var ParseServer = require('parse-server').ParseServer;

export function parseServer(){
    var api = new ParseServer({ 
        databaseURI: 'mongodb://127.0.0.1:27017',
        cloud: './cloud/main.js',
        appId: 'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
        masterKey: '1xxoXAIV3bZeYDBii6Ob8g2fz6ugUXjHKwX1LhDb',
        serverURL: 'http://localhost:1337/parse'
       });
       app.use('/parse', api);
       var port = 1337;
      app.listen(port, function() {
        console.log('parse-server-example running on port ' + port + '.');
      });
}

