import { db } from '../db';
export default function hangouts({ message, connections }) {
  switch (message.type) {
    case 'INVITEE':
      const sender = connections[message.username];
      const target = connections[message.target];
      debugger;
      db.emit('updateOne', {
        dbName: 'hangout',
        collectionName: 'users',
        query: {},
        modifier: {},
        options: {},
      });
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
      throw new Error('No message type is provided for switch statement');
  }
}
