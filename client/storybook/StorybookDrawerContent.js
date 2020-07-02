import { h } from 'preact';
import List,{ListItem } from 'controls/list';
import Accordions,{Accordion} from 'controls/accordion'
import {useAppRoute} from 'components/app-route'
import {useMediaQuery} from 'components/layout/useMediaQuery'
export default function StorybookDrawerContent({toggleDrawer }) {
  const {onAppRoute}=useAppRoute()

  const {device}=useMediaQuery()
  function handleRoute(e) {
    const { id } = e.target;
    onAppRoute({featureRoute:'/',route:`/${id}`})
    if( device==='phone'){
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
        <Accordion title="Icons" id="1">
          <List>
          <ListItem id="icons" onClick={handleRoute}>
         Icons
        </ListItem>
          </List>
        </Accordion>
        <Accordion title="Components" id="2">
        <List>
          <ListItem id="asyncbutton" onClick={handleRoute}>
         AsyncButton
        </ListItem>
          </List>
        </Accordion>
        </div>
    </Accordions>
  );
}
