
export default async function hangouts({ message,username,client }) {
  const collection = await client.db('hangouts').collection('users');
  switch (message.type) {
    case 'INVITEE':
      debugger;
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
