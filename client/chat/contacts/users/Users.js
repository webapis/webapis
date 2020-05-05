import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { List, ListItem } from '../../../layout/NavList';
import { useContactsContext } from '../contacts-context';
import { openInvitation } from '../invitations/actions';
import { useInvitationContext } from '../invitations/invitation-context';
import { useAuthContext } from '../../../auth/auth-context';
import { fetchUsers } from '../actions';

export default function Users({ filter }) {
  const { dispatch: invitDispatch } = useInvitationContext();
  const { state: authState } = useAuthContext();

  const { state, dispatch } = useContactsContext();
  const { users } = state;

  useEffect(() => {
    if (state.contacts.length === 0 && filter && filter.length >= 4) {
      fetchUsers({ dispatch, filter });
    }
  }, [state.contacts, filter]);

  function handleSelectUser(e) {
    
    const invitation = { sender: authState.username, reciever: e.target.id };
    openInvitation({ dispatch: invitDispatch, invitation });
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
