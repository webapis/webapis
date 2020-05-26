import { connections, wsocket } from '../wsocket';

export default function () {
  wsocket.on('connection', (username) => {
    console.log('connection happened', username);
  });
}
