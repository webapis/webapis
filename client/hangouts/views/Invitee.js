import { h } from 'preact';
import { Done } from '../../layout/icons/Done';
export default function Invitee({ contact }) {
  const { email } = contact;
  return (
    <div className='chat-state-view' data-testid='invitee'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ textAlign: 'center', margin: 8 }}>
          <Done
            color='white'
            fill='#4caf50'
            height={50}
            width={50}
            style={{ borderRadius: 100 }}
          />
        </div>

        <h5 style={{ textAlign: 'center' }}>Invitation is sent!</h5>
        <p style={{ textAlign: 'center', margin: 8 }}>
          You'll be able to chat with <b>{email && email}</b> once your
          invitation has been accepted.
        </p>
      </div>
    </div>
  );
}
