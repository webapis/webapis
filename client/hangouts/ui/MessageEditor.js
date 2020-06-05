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
      <TextInput onChange={onMessageText} value={messageText} />
      <div>
        <Button title="send" onClick={onMessage}/>
      </div>
    </div>
  );
}
