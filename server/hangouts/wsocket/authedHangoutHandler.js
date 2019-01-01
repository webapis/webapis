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
    onLineStateChangeHandler({
      connections,
      ws,
      collection,
      browserId,
      senderUser,
    });
    ws.on("message", async (message) => {
      const socketMessage = JSON.parse(message);
      const { data } = socketMessage;

      const {
        hangout: { target },
      } = data;
      const targetUser = await collection.findOne({ username: target });

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
