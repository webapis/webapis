
import { initUsers } from './initUsers';
import { hangoutHandler } from './hangoutHandler'
import { clientCommands } from '../../../client/hangouts/state/clientCommands'
export default async function hangouts({
  hangout,
  ws,
  client,
  connections,
}) {
  const collection = await client.db('hangouts').collection('users');

  await initUsers({ collection, ws, hangout });
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
    case clientCommands.ONLINE:
      break;
    default:
      throw new Error('No message type is provided for switch statement');
  }
}


////

