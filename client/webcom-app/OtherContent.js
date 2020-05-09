import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { List, ListItem } from '../layout/NavList';
import { useUserName } from '../auth/useUserName';
import { useRouteContext } from '../route/router';
export function OtherContent() {
  const [route, setRoute] = useRouteContext();
  const { userName } = useUserName();



  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    if (userName) {
      setRoute(`/${id}`);
    } else {
      setRoute('/login');
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
        <ListItem>Item One</ListItem>
        <ListItem>Item Two</ListItem>
   
        <ListItem onClick={handleRoute} id='p2p'>
          Peer to Peer
        </ListItem>
      </List>
    </div>
  );
}
