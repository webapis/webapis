import { h } from 'preact';
import { List, ListItem } from '../layout/NavList';
import { useRouteContext } from '../route/router';
export function DrawerContent({ open }) {
  const [route, setRoute] = useRouteContext();
  function handleRoute(e) {
    const { id } = e.target;
    setRoute(`/${id}`);
  }
  return (
    <div>
      <List>
        <ListItem id="hangouts" onClick={handleRoute}>
          Hangouts
        </ListItem>
        <ListItem id="block" onClick={handleRoute}>
          Block
        </ListItem>
        <ListItem id="blocked" onClick={handleRoute}>
          Blocked
        </ListItem>
        <ListItem id="invite" onClick={handleRoute}>
          Invite
        </ListItem>
        <ListItem id="invitee" onClick={handleRoute}>
          Invitee
        </ListItem>
        <ListItem id="inviter" onClick={handleRoute}>
          Inviter
        </ListItem>
        <ListItem id="hangchat" onClick={handleRoute}>
          Hangchat
        </ListItem>

        <ListItem id="configure" onClick={handleRoute}>
          Configure
        </ListItem>
        <ListItem id="message" onClick={handleRoute}>
          Message
        </ListItem>
        <ListItem id="online" onClick={handleRoute}>
         onlineStatus
        </ListItem>
      </List>
    </div>
  );
}
