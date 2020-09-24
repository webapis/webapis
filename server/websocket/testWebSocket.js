module.exports.testWebSocket = async function ({
  ws,
  connections,
  message,
  sender,
}) {
  try {
    ws.on("message", (socketMessage) => {
      const { data } = JSON.parse(socketMessage);
      debugger;
      ws.send(
        JSON.stringify({
          data,
          type: "test-websocket",
        })
      );
    }); //
  } catch (error) {
    throw error;
  }
};
