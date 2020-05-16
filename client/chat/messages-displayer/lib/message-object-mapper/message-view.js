import { h } from 'preact';

const MessageView = ({ message, datetime }) => (
  <div
    style={{
      borderRadius: 15,
      //borderColor: '#9E9E9E',
      //borderStyle: 'solid',
      //borderWidth: 2,
      maxWidth: '100%',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
      minWidth: '30%',
    }}
  >
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: 5,
        margin: 2,
        borderRadius: 50,
      }}
    >
      {message}
    </div>
    <div
      style={{
        fontSize: 10,
        paddingTop: 2,
        textAlign: 'end',
      }}
    >
      <i style={{ backgroundColor: 'transparent', color: '#737373' }}>
        {new Date(datetime).toLocaleTimeString()}
      </i>
    </div>
  </div>
);

export default MessageView;
