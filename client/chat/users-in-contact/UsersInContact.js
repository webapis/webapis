import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useContactsContext } from '../contacts/contacts-context';
import {
  fetchUsersInContact,
  getLocalContacts,
  findLocalContact,
  selectContact,
} from '../contacts/actions';
import { List, ListItem } from '../../layout/NavList';
export default function UsersInContact({ filter }) {
  const { state, dispatch } = useContactsContext();
  const { contacts } = state;

  useEffect(() => {
    if (localStorage.getItem('contacts')) {
      getLocalContacts({ dispatch });
    } else {
      fetchUsersInContact({ dispatch });
    }
  }, []);

  useEffect(() => {
    if (filter) {
      findLocalContact({ dispatch, filter });
    }
  }, [filter]);

  function handleSelectContact(e) {
    selectContact({ dispatch, contactName: e.target.id });
  }
  return (
    <List id='usersincontact'>
      {contacts &&
        contacts.length > 0 &&
        contacts.map((c) => {
          return (
            <ListItem id={c.username} onClick={handleSelectContact}>
              {c.username}
            </ListItem>
          );
        })}
    </List>
  );
}
