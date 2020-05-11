import { h } from 'preact';
import { useReducer } from 'preact/hooks';
import { invitationReducer, initState } from './invitationReducer';
import { sendInvitation, valueChanged } from './actions';
import Button from '../form/Button';
import PersonAddIcon from '../layout/icons/PersonAdd';
import { useAuthContext } from '../auth/auth-context';
export default function Invitation({ invitation }) {
  const { state: authState } = useAuthContext();
  const [state, dispatch] = useReducer(invitationReducer, initState);
  const { message } = state;

  function handleChange(e) {
    valueChanged({ dispatch, value: e.target.value });
  }

  function handleSendInvitation() {
    const { token } = authState;
    const { username } = invitation;
  
    sendInvitation({ dispatch, message, token, target: username });
  }
  return (
    <div data-testid='invitation'>
      {' '}
      <PersonAddIcon height={50} width={50} />
      <p>
        Start conversation with <i>{invitation.email}</i>{' '}
      </p>
      <textarea rows='3' cols='50' onChange={handleChange} value={message} />
      <Button id="send-invitation-btn" title='Send Invite' onClick={handleSendInvitation} />{' '}
    </div>
  );
}
