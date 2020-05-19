import { h } from 'preact';
import MessagesDispaler from './messages-displayer';
import { Settings } from '../layout/icons/Settıngs';
export default function Chat({ contact, onSetting }) {
  const { messages } = contact;
  return (
    <div
      className='chat-state-view'
      style={{ margin: 8, height: '100%' }}
      data-testid='chat'
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <div style={{ paddingRight: 8, paddingTop: 8 }} onClick={onSetting}data-testid='setting'>
          <Settings />
        </div>
      </div>
      <hr style={{ width: '99%' }} />
      <MessagesDispaler messages={messages} />
    </div>
  );
}
