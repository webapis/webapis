module.exports.testWebSocket = async function ({
  ws,
  connections,
  message,
  sender,
}) {
  try {
    //const socket = connections[target];//
    debugger; //
    ws.on("message", (socketMessage) => {
      debugger;
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
    debugger;
    throw error;
  }
};
