import { h } from 'preact';
import PersonAddIcon from '../../layout/icons/PersonAdd';
export default function Invite({ contact, onChange, onInvite, value }) {
  const { email, message } = contact;

  return (
    <div className='chat-state-view' data-testid='invite'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 10,
        }}
      >
        <PersonAddIcon
          height={60}
          width={60}
          fill='#4caf50'
          color='white'
          style={{ borderRadius: 90 }}
        />

        <p>
          Start conversation with <b>{email && email}</b>{' '}
        </p>
      </div>
      <div>
        <div style={{ display: 'flex', padding: 8 }}>
          <textarea
            rows='3'
            style={{ flex: 1 }}
            name='message'
            onChange={onChange}
            value={value}
          />
        </div>

        <div style={{ display: 'flex', flex: 1 }}>
          <button className='btn'>Close</button>
          <button className='btn unblock-btn' onClick={onInvite}>
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}
