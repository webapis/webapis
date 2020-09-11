module.exports.testWebSocket = async function ({
  ws,
  connections,
  message,
  sender,
}) {
  try {
    debugger;
    const { target, data } = message;
    debugger;
    const socket = connections[target];
    debugger;
    socket.send(JSON.stringify({ sender, data, type: "test-websocket" }));
  } catch (error) {
    debugger;
    throw error;
  }
};
