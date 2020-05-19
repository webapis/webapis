import { h } from 'preact';
import './css/style.css';
import { Block } from '../layout/icons/Block';
export default function Blocked({ contact }) {
  const { username } = contact;
  return (
    <div className='chat-state-view' data-testid='blocked'>
      <div
        style={{
          flex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          margin: 8,
          //  borderBottom: '4px solid white',
        }}
      >
        <Block color='red' width={50} height={50} />
        <div>{username}</div>
        <p style={{ textAlign: 'center' }}>
          You blocked <b>{username && username}</b>.You cannot communicate with
          someone you blocked.
        </p>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <button className='btn'>Close</button>
        <button className='btn unblock-btn'>Unblock</button>
      </div>
    </div>
  );
}
