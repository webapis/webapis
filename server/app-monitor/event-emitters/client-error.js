const EventEmitter = require("events");
class ClientErrorEmitter extends EventEmitter {}

module.exports = new ClientErrorEmitter();
