import { h } from 'preact';
import { useState } from 'preact/hooks';
import { List, ListItem } from '../../layout/NavList';
import { TextInput } from '../../layout/TextInput';
import { Paper } from '../../layout/Paper';
import { Fab } from '../../layout/Fab';
import { AddIcon } from '../../layout/icons/AddIcon';
import Users from '../users/Users';
import UsersInContact from '../users-in-contact/UsersInContact';
import { useContactsContext } from './contacts-context';
export default function Contacts() {
  const { state } = useContactsContext();
  const [filter, setFilter] = useState(null);

  function handleFilter(e) {
    setFilter(e.target.value);
  }

  return (
    <div style={{ display: 'flex' }} data-testid="contact-list">
      <Paper>
        <NewConversation onChange={handleFilter} />
        {<UsersInContact filter={filter}  />}
        { <Users filter={filter} />}
      </Paper>
    </div>
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
        <TextInput onChange={onChange} placeholder='Enter username or email' id='contactsearch' />
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
