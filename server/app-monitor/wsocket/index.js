const clientErrorEmitter = require("../event-emitters/client-error");
module.exports.errorMonitor = function ({ ws }) {
  clientErrorEmitter.on("client-error", function (error) {
    debugger;
    ws.send(JSON.stringify(error));
    console.log("client error happened");
  });
};
