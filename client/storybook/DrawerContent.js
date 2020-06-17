import { h } from 'preact';
import { List, ListItem } from '../layout/NavList';

import {useAppRoute} from '../app-route/AppRouteProvider'
export function DrawerContent({ open }) {
  const {onAppRoute}=useAppRoute()

  function handleRoute(e) {
    const { id } = e.target;
    onAppRoute({featureRoute:'/',route:`/${id}`})
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
        <ListItem id="messages" onClick={handleRoute}>
          Messages
        </ListItem>
        <ListItem id="online" onClick={handleRoute}>
         onlineStatus
        </ListItem>
        <ListItem id="unread" onClick={handleRoute}>
         Uread
        </ListItem>
        <ListItem id="blocker-message" onClick={handleRoute}>
         BlockerMessage
        </ListItem>
        <ListItem id="icons" onClick={handleRoute}>
         Icons
        </ListItem>
      </List>
    </div>
  );
}
