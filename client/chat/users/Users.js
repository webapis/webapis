import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { List, ListItem } from '../../layout/NavList';
import { useContactsContext } from '../contacts/contacts-context';
import { fetchUsers, selectUser } from '../contacts/actions';

export default function Users({ filter }) {
  const { state, dispatch } = useContactsContext();
  const { users } = state;

  useEffect(() => {
    if (state.contacts.length === 0 && filter && filter.length >= 4) {
      fetchUsers({ dispatch, filter });
    }
  }, [state.contacts, filter]);

  function handleSelectUser(e) {
    selectUser({ dispatch, userName: e.target.id });
  }

  return (
    <List id='users'>
      {users &&
        users.length > 0 &&
        users.map((c) => {
          return (
            <ListItem id={c.username} onClick={handleSelectUser}>
              {c.username}
            </ListItem>
          );
        })}
    </List>
  );
}
