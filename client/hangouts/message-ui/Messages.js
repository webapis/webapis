import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { Message } from './Message';
import { MessageEditor } from './MessageEditor';
import { BlockerMessage } from './BlockerMessage'
import {BlockedMessage} from './BlockedMessage'
const styles = {
  messageContainer: {
    // width: '100%',
    boxSizing: 'border-box',
    padding: 3,
  //  backgroundColor: 'orange',
    flex: 15,
    overflowY: 'auto',
    overflowX: "hidden"

  },
};
export function Messages({
  messages,
  onMessage,
  onMessageText,
  messageText,
  username,
  hangout
}) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    if (messages) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  function onSend(e) {
    onMessage(e);
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }
  return (
    <div style={{ boxSizing: 'border-box', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 68 }}>
      <div style={styles.messageContainer} ref={scrollerRef}>
        {messages &&
          messages.length > 0 &&
          floatMessages({ messages: sortMessages({ messages }), username }).map(
            (m) => (
              <div style={{ display: 'flex' }}>
                {' '}
                {!m.type && <Message message={m} />}
                {m.type && m.type === 'blocker' && <BlockerMessage message={m} />}
                {m.type && m.type === 'blocked' && <BlockedMessage message={m} />}
              </div>
            )
          )}
      </div>
      <div style={{ flex: 1 }}>
        <MessageEditor
          hangout={hangout}
          onMessage={onSend}
          messageText={messageText}
          onMessageText={onMessageText}
        />
      </div>

    </div>
  );
}
function floatMessages({ messages, username }) {
  if (messages && messages.length > 0 && username) {
    return messages.map((msg) => {
      if (msg.username === username) {
        return { ...msg, float: 'right', username: 'me' };
      } else {
        return { ...msg, float: 'left' };
      }
    });
  } else {
    return null;
  }
}
function sortMessages({ messages }) {
  if (messages) {
    return messages.sort();
  } else {
    return null;
  }
}
