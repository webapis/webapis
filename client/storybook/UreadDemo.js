import { h } from 'preact';
import Unread from '../hangouts/UnreadHangouts';
import {reducerUnreadhangouts} from '../hangouts/state/reduceUnreadhangouts'
const unreads = [
  {
    username: 'demo',
    state: 'MESSANGER',
    message: { text: 'Hello you', timestamp: 1591810458630 },
  },

  {
    username: 'demo',
    state: 'MESSANGER',
    message: { text: 'Hello you', timestamp: 1591810458630 },
  },
  {
    username: 'bero',
    state: 'MESSANGER',
    message: { text: 'Hello you', timestamp: 1591810458630 },
  },
];

export function UnreadDemo() {
  return <Unread unreadhangouts={reducerUnreadhangouts({unreadhangouts:unreads})} />;
}
