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
    padding: 5,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: 'border-box',
    flex: 1,
    
  },
  btn:{
    padding: 8,

    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: 'border-box',
    flex: 1,
  }
};
export function MessageEditor({ messageText, onMessageText, onMessage }) {
  return (
    <div style={styles.root}>
     
      <input style={styles.input}  type="text" onChange={onMessageText}  data-testid="message-input"/>
      
      
      <div>
        <Button  style={styles.btn}  title="send" id='MESSAGE' onClick={onMessage} data-testid='send-btn'/>
      </div>
    </div>
  );
}
