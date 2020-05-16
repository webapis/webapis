import { h } from 'preact';
import { Done } from '../layout/icons/Done';
export function Invitee({ email }) {
  return (
    <div className='chat-state-view'>
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
          You'll be able to chat with <b>{email}</b> once your invitation has
          been accepted.
        </p>
      </div>
    </div>
  );
}
