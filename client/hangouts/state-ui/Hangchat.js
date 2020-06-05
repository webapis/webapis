import { h } from 'preact';
import { Messages } from '../ui/Messages';
import { Layout } from './Layout';
export default function Hangchat({
  messages = [],
  onMessageText,
  onMessage,
  messageText,
  username
}) {
  return (
    <Layout id="hangchat-ui">
      <Messages
        messages={messages}
        onMessage={onMessage}
        onMessageText={onMessageText}
        messageText
        username={username}
      />
    </Layout>
  );
}
