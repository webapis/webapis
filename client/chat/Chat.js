import { h } from 'preact';
import MessagesDispaler from './messages-displayer';
export function Chat({ messages }) {
  return (
    <div style={{ margin: 8 }}>
      <MessagesDispaler messages={messages} />
    </div>
  );
}
