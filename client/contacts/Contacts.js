import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { List, ListItem } from '../layout/NavList';
import { TextInput } from '../layout/TextInput';
import { useContacts } from './useContacts';
import { useUsers } from './useUsers';
import { useAuthContext } from '../auth/auth-context';
import { useContactsContext, selectContact } from './contact-context';
export default function Contacts() {
  const [state, dispatch] = useContactsContext();
  const { state: authState } = useAuthContext();
  const [contactsfilter, setContactsFilter] = useState(null);
  const [usersFilter, setUsersFilter] = useState(null);
  const [items, setItems] = useState([]);
  const { state: contactState } = useContacts({
    filter: contactsfilter,
    username: authState.username,
  });
  const { state: userState } = useUsers({ filter: usersFilter });

  function handleSearch(e) {
    const { value } = e.target;
    setContactsFilter(value);
  }

  useEffect(() => {
    if (contactState.contacts.length > 0) {
      setItems(contactState.contacts);
    }
  }, [contactState]);

  useEffect(() => {
    if (contactsfilter && contactState.contacts.length === 0) {
      setUsersFilter(contactsfilter);
    }

    if (contactsfilter && contactState.contacts.length > 0) {
      setItems(contactState.contacts);
    }
  }, [contactState.contacts, contactsfilter]);

  useEffect(() => {
    if (usersFilter && userState.users.length > 0) {
      debugger;
      setItems(userState.users);
    }
  }, [userState.users, usersFilter]);

  function handleItemClick(e) {
    const selectedContact = items.find((item) => item.username === e.target.id);
    debugger;
    selectContact({ dispatch, contact: selectedContact });
  }

  return (
    <div>
      <TextInput
        id='contact-search'
        onChange={handleSearch}
        placeholder='Enter username, or email'
      />
      <List id='contacts-list'>
        {items.length > 0 &&
          items.map((item) => {
            return (
              <ListItem onClick={handleItemClick} id={item.username}>
                {item.username}
              </ListItem>
            );
          })}
      </List>
    </div>
  );
}
