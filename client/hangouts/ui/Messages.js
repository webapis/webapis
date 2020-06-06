import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { Message } from './Message';
import { MessageEditor } from './MessageEditor';
const styles = {
  messageContainer: {
    width: '100%',
    // backgroundColor: 'orange',
    height: '20vh',
    overflow: 'auto',
  },
};
export function Messages({
  messages,
  username,
  onMessage,
  onMessageText,
  messageText,
}) {
  const scrollerRef = useRef(null);
  function onSend() {
    onMessage();
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }
  return (
    <div>
      <div style={styles.messageContainer} ref={scrollerRef}>
        {messages &&
          messages.length > 0 &&
          floatMessages({ messages: sortMessages({ messages }), username }).map(
            (m) => (
              <div style={{ display: 'flex' }}>
                {' '}
                <Message message={m} />
              </div>
            )
          )}
      </div>
      <MessageEditor onMessage={onSend} messageText={messageText}onMessageText={onMessageText} />
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
