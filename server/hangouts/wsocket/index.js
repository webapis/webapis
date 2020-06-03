
import { initUsers } from './initUsers';
import { inviteHandler } from './inviteHandler';
import {acceptHandler} from './acceptHandler'
import {messageToServer} from '../../../client/hangouts/state/messageTypes'
export default async function hangouts({
  hangout,
  ws,
  client,
  connections,
}) {
  const collection = await client.db('hangouts').collection('users');
  debugger;
 await initUsers({ collection,ws, hangout });
debugger;
  switch (hangout.type) {
    case messageToServer.INVITE:
     debugger;
     inviteHandler({ collection, hangout,ws,connections });
    
      break;
    case messageToServer.HANGCHAT:
      acceptHandler({ collection, hangout,ws,connections })
      debugger;
      break;
    case messageToServer.BlOCK:
      break;
    case messageToServer.UNBLOCK:
      break;
    case messageToServer.DECLINE:
      break;
    case messageToServer.MESSAGE:

    default:
      throw new Error('No message type is provided for switch statement');
  }
} 


//

