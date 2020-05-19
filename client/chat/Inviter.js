import { h } from 'preact';
import './css/style.css';
export default function Inviter({ accept_inv_img, contact }) {
  const { message, username } = contact;
  return (
    <div className='chat-state-view' data-testid='inviter'>
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          margin: 8,
          //  borderBottom: '4px solid white',
        }}
      >
        <img src={accept_inv_img} style={{ width: 100 }} />
        <div>{username && username}</div>
      </div>
      <hr style={{ width: '99%' }} />
      <div style={{ flex: 5, backgroundColor: '#eeeeee' }}>
        <Message message={message && message} />
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <button className='btn ignore-btn'>Ignore</button>
        <button className='btn accept-btn'>Accept</button>
      </div>
    </div>
  );
}

function Message({ message }) {
  return (
    <div
      style={{
        //   backgroundColor: 'yellow',
        marginTop: 15,
        marginLeft: 15,
        padding: 8,
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          display: 'inline',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: 10,
          fontSize: 13,
        }}
      >
        {message && message.text}
      </div>
      <div
        style={{
          paddingLeft: 16,
          marginTop: 8,
          colod: '#737373',
          fontSize: 10,
        }}
      >
        {message && message.datetime}
      </div>
    </div>
  );
}
