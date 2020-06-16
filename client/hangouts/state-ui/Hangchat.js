import { h } from 'preact';
import { Messages } from '../message-ui/Messages';
import { Layout } from './Layout';



export default function Hangchat({
  messages = [],
  onMessageText,
  onMessage,
  messageText,
  username,
  hangout
}) {
  return (
    <Layout id="hangchat-ui" >
      <Messages
        hangout={hangout}
        messages={messages}
        onMessage={onMessage}
        onMessageText={onMessageText}
        messageText ={messageText}
        username={username}
      />
    </Layout>
  );
}
