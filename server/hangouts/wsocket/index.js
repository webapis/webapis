
import { initUsers } from './initUsers';
import { inviteHandler } from './inviteHandler';
import {acceptHandler} from './acceptHandler'
import {messageHandler} from './messageHandler'
import {clientCommands} from '../../../client/hangouts/state/clientCommands'
export default async function hangouts({
  hangout,
  ws,
  client,
  connections,
}) {
  const collection = await client.db('hangouts').collection('users');

 await initUsers({ collection,ws, hangout });

  switch (hangout.command) {
    case clientCommands.ONLINE:
      debugger;
      break;
    case clientCommands.INVITE:
  
     inviteHandler({ collection, hangout,ws,connections });
    
      break;
      case clientCommands.ACCEPT:
      acceptHandler({ collection, hangout,ws,connections })
      debugger;
      break;
      case clientCommands.BLOCK:
      break;
      case clientCommands.UNBLOCK:
      break;
      case clientCommands.DECLINE:
      break;
      case clientCommands.MESSAGE:
        debugger;
        messageHandler({ collection, hangout,ws,connections })
 break;
    default:
      throw new Error('No message type is provided for switch statement');
  }
} 


//

