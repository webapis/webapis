import { h } from 'preact';
import List,{ListItem } from '../components/list';
import Accordions,{Accordion} from '../components/accordion'
import {useAppRoute} from '../app-route/AppRouteProvider'
import {useMediaQuery} from '../layout/useMediaQuery'
export default function StorybookDrawerContent({toggleDrawer,drawerIsOpen }) {
  const {onAppRoute}=useAppRoute()

  const {device}=useMediaQuery()
  function handleRoute(e) {
    const { id } = e.target;
    onAppRoute({featureRoute:'/',route:`/${id}`})
    if(drawerIsOpen && device==='phone'){
      toggleDrawer()
    }

  }
  return (
    <Accordions  selectedId='0'>
      <div style={{padding:3}}>

    
      <Accordion id="0" title="Hangout" >
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
        </List>
        </Accordion>
        <Accordion title="Icons" id="0">
          <List>
          <ListItem id="icons" onClick={handleRoute}>
         Icons
        </ListItem>
          </List>
        </Accordion>
        </div>
    </Accordions>
  );
}
