import { h } from 'preact';
import { TextInput } from '../../layout/TextInput';
import { Button } from '../../layout/Button';
const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    //margin:0
  },
};
export function MessageEditor({ messageText, onMessageText, onMessage }) {
  return (
    <div style={styles.root}>
      <input type="text" onChange={onMessageText}  data-testid="message-input"/>
      <div>
        <Button title="send" id='MESSAGE' onClick={onMessage} data-testid='send-btn'/>
      </div>
    </div>
  );
}
