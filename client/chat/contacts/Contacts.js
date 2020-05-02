import { h } from 'preact';
import { useReducer, useEffect, useState } from 'preact/hooks';
import { fetchContacts } from './actions';
import { contactReducer, initState } from './contactsReducer';
import { List, ListItem } from '../../layout/NavList';
import { TextInput } from '../../layout/TextInput';
import { Paper } from '../../layout/Paper';
import { Fab } from '../../layout/Fab';
import { AddIcon } from '../../layout/icons/AddIcon';
export default function Contacts() {
  const [state, dispatch] = useReducer(contactReducer, initState);
  const { contacts } = state;

  function getContacts() {
    fetchContacts({ dispatch });
  }

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Paper>
        <NewConversation />
        <List>
          {contacts.length > 0 &&
            contacts.map((c) => {
              return <ListItem id={c.username}>{c.username}</ListItem>;
            })}
        </List>
      </Paper>
    </div>
  );
}

function NewConversation() {
  const [newConversation, setNewConversation] = useState(false);

  function handleNewConversation() {
    setNewConversation(true);
  }

  return (
    <List>
      {newConversation ? (
        <TextInput placeholder='Enter username or email' />
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
