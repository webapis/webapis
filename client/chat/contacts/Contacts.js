import { h } from 'preact';
import { useState } from 'preact/hooks';
import { List, ListItem } from '../../layout/NavList';
import { TextInput } from '../../layout/TextInput';
import { Paper } from '../../layout/Paper';
import { Fab } from '../../layout/Fab';
import { AddIcon } from '../../layout/icons/AddIcon';
import Users from './users/Users';
import UsersInContact from './users-in-contact/UsersInContact';
import { useContactsContext } from './contacts-context';
import { RoomProvider } from './rooms/room-context';
import { InvitationProvider } from './invitations/invitation-context';
import Invitations from './invitations/Invitations';
import Rooms from './rooms/Rooms';
export default function Contacts() {
  const { state } = useContactsContext();
  const [filter, setFilter] = useState(null);

  function handleFilter(e) {
    setFilter(e.target.value);
  }

  return (
    <InvitationProvider>
      <RoomProvider>
        <div style={{ display: 'flex' }} data-testid='contact-list'>
          <Paper>
            <NewConversation onChange={handleFilter} />
            {<UsersInContact filter={filter} />}
            {<Users filter={filter} />}
            <Invitations id='invitations' />
            <Rooms id='rooms' />
          </Paper>
        </div>
      </RoomProvider>
    </InvitationProvider>
  );
}

function NewConversation({ onChange }) {
  const [newConversation, setNewConversation] = useState(false);

  function handleNewConversation() {
    setNewConversation(true);
  }

  return (
    <List>
      {newConversation ? (
        <TextInput
          onChange={onChange}
          placeholder='Enter username or email'
          id='contactsearch'
        />
      ) : (
        <ListItem onClick={handleNewConversation} id='conversation'>
          <Fab>
            <AddIcon />
          </Fab>
          <div>New Conversation</div>
        </ListItem>
      )}
    </List>
  );
}
