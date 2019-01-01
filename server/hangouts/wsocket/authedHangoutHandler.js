const { onLineStateChangeHandler } = require("./onLineStateChangeHandler");
const { handlePersistance } = require("./handlePersistance");
module.exports.authedHangoutHandler = function ({
  ws,
  request,
  senderUser,
  collection,
  browserId,
}) {
  try {
    onLineStateChangeHandler({ connections, ws, collection, browserId });
    ws.on("message", async (message) => {
      const socketMessage = JSON.parse(message);
      const { data } = socketMessage;
      debugger;
      const {
        hangout: { target },
      } = data;
      const targetUser = await collection.findOne({ username: target });
      debugger;
      hangoutsHandler({
        socketMessage,
        connections,
        ws,
        senderUser,
        targetUser,
        cb: handlePersistance,
      });
    });
  } catch (error) {
    throw error;
  }
};
//
