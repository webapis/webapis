import { h } from 'preact';
import { List, ListItem } from '../layout/NavList';
import { useUserName } from '../auth/useUserName';
import { useRootRouteContext } from '../route/root-router';
export function OtherContent() {
  const [rootRoute, setRootRoute] = useRootRouteContext();

  const { userName } = useUserName();

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    if (userName) {
      setRootRoute(`/${id}`);
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
        <ListItem onClick={handleRoute} id='chat'>
          Chat
        </ListItem>
        <ListItem>Item Two</ListItem>

        <ListItem onClick={handleRoute} id='hangouts'>
          Hangout
        </ListItem>
        <ListItem onClick={handleRoute} id='group'>
          Group
        </ListItem>
      </List>
    </div>
  );
}
