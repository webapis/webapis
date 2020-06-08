
import { hangoutHandler } from './hangoutHandler'
import {onLineStateChangeHandler} from './onLineStateChangeHandler'
import { clientCommands } from '../../../client/hangouts/state/clientCommands'
export default async function hangouts({
  hangout,
  ws,
  client,
  connections,
}) {
  const collection = await client.db('auth').collection('users');
debugger;
  switch (hangout.command) {
    case clientCommands.ACCEPT:
    case clientCommands.BLOCK:
    case clientCommands.DECLINE:
    case clientCommands.INVITE:
    case clientCommands.MESSAGE:
    case clientCommands.UNBLOCK:
      hangoutHandler({ collection, hangout, ws, connections })
      break;
    default:
      throw new Error('No message type is provided for switch statement');
  }
}


//

