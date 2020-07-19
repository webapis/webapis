import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/hooks.module.js";
import Messages from "./messages";
import Layout from "./Layout";

export default function Hangchat({
  loading,
  messages = [],
  onMessageText,
  onMessage,
  messageText,
  username,
  hangout,
  onNavigation,
}) {
  useEffect(() => {
    if (hangout) {
      document.title = hangout.username;
    }
  }, [hangout]);

  return (
    <Layout id="hangchat-ui" onNavigation={onNavigation}>
      <Messages
        loading={loading}
        onNavigation={onNavigation}
        hangout={hangout}
        messages={messages}
        onMessage={onMessage}
        onMessageText={onMessageText}
        messageText={messageText}
        username={username}
      />
    </Layout>
  );
}
