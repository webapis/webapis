debugger;
export default function chat({ message, connections }) {
  switch (message.type) {
    case 'INVITE':
      const sender = connections[message.username];
      const target = connections[message.target];
      debugger;
      target.send(JSON.stringify(message));
      break;
    case 'ACCEPT':
      break;
    case 'BLOCK':
      break;
    case 'UNBLOCK':
      break;
    case 'DECLINE':
      break;
    case 'MESSAGE':

    default:
      throw new Error('No message type is provided');
  }
}
