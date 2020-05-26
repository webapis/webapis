import { db } from '../db';
export default function hangouts({ message,username }) {
  switch (message.type) {
    case 'INVITEE':
      debugger;
      db.emit('updateOne', {
        dbName: 'hangouts',
        colName: 'users',
        query:{username},
        modifier:{...message},
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
