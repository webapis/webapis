import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { Message } from './Message';
import { MessageEditor } from './MessageEditor';
const styles = {
  messageContainer: {
   // width: '100%',
   boxSizing: 'border-box',
     backgroundColor: 'orange',
    flex:15,
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
    <div style={{  boxSizing: 'border-box',width:'100%',height:'100%', backgroundColor:'yellow', display:'flex',flexDirection:'column'}}>
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
      <div style={{flex:1, backgroundColor:'green'}}>
      <MessageEditor
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
