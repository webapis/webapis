import { h } from 'preact';
import {useRef} from 'preact/hooks'
import { Message } from './Message';
import {MessageEditor} from './MessageEditor'
const styles = {
  messageContainer: {
    width: '100%',
    // backgroundColor: 'orange',
    height: '20vh',
    overflow: 'auto',
  },
};
export function Messages({ messages, username }) {
    const scrollerRef = useRef(null);
    function onSend(){
        scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  return (
      <div>

   
    <div style={styles.messageContainer} ref={scrollerRef}>
      {floatMessages({ messages: sortMessages({ messages }), username }).map(
        (m) => (
          <div style={{ display: 'flex' }}>
            {' '}
            <Message message={m} />
          </div>
        )
      )}
      
    </div>
    <MessageEditor onMessage={onSend}/>
       </div>
  );
}
function floatMessages({ messages, username }) {
  if (messages && username) {
    return messages.map((msg) => {
      if (msg.username === username) {
        return { ...msg, float: 'right', username: 'me' };
      } else {
        return { ...msg, float: 'left' };
      }
    });
  } else {
    throw new Error('messages or username not provided');
  }
}
function sortMessages({ messages }) {
  if (messages) {
    return messages.sort();
  } else {
    throw new Error('messages not provided for sortMessages');
  }
}
