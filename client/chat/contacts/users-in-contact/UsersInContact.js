import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useContactsContext } from '../contacts-context';
import { useRoomContext } from '../rooms/room-context';
import {
  fetchUsersInContact,
  getLocalContacts,
  findLocalContact,
} from '../actions';
import { openRoom } from '../rooms/actions';
import { List, ListItem } from '../../../layout/NavList';
export default function UsersInContact({ filter }) {
  const { state: roomState, dispatch: roomDispatch } = useRoomContext();
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
    debugger;
    const room = state.contacts.find((c) => c.username === e.target.id);
    openRoom({ dispatch: roomDispatch, room });
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
