import { h } from 'preact';
import { List, ListItem } from '../layout/NavList';
import { useUserName } from '../auth/useUserName';

import { useRootRouteContext } from '../route/root-router';
import { useRouteContext } from '../route/router';
import { useContactsContext, removeContact } from '../contacts/contact-context';
export function OtherContent() {
  const [state, dispatch] = useContactsContext();
  const [rootRoute, setRootRoute] = useRootRouteContext();

  const { userName } = useUserName();

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    if (userName) {
      setRootRoute(`/${id}`);
      removeContact({ dispatch });
    } else {
      setRootRoute('/auth');
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <List>
        <ListItem onClick={handleRoute} id='chat'>Chat</ListItem>
        <ListItem>Item Two</ListItem>

        <ListItem onClick={handleRoute} id='p2p'>
          Peer to Peer
        </ListItem>
        <ListItem onClick={handleRoute} id='group'>
          Group
        </ListItem>
      </List>
    </div>
  );
}
