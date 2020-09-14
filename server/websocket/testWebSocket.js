module.exports.testWebSocket = async function ({
  ws,
  connections,
  message,
  sender,
}) {
  try {
    const { target, data } = message;

    const socket = connections[target];

    socket.send(JSON.stringify({ sender, data, type: "test-websocket" }));
  } catch (error) {
    throw error;
  }
};
