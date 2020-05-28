import { initUsers } from './initUsers';
import { invitee } from './invitee';
export default async function hangouts({
  hangouts,
  ws,
  client,
  connections,
}) {
  const collection = await client.db('hangouts').collection('users');
  initUsers({ collection,ws, hangouts });
debugger;
  switch (hangouts.state) {
    case 'INVITEE':
     invitee({ collection, hangouts,ws,connections });
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
} //
