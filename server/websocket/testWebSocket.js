module.exports.testWebSocket = async function ({
  ws,
  connections,
  message,
  sender,
}) {
  try {
    //const socket = connections[target];//
    //
    ws.on("message", (socketMessage) => {
      const { data } = JSON.parse(socketMessage);

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
