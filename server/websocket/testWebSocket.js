module.exports.testWebSocket = async function ({
  ws,
  connections,
  message,
  sender,
}) {
  try {
    const {
      data: { target, text, sender },
    } = message;
    debugger;
    const socket = connections[target];
    debugger;
    socket.send(
      JSON.stringify({
        data: { text, target: sender },
        type: "test-websocket",
      })
    );
  } catch (error) {
    throw error;
  }
};
