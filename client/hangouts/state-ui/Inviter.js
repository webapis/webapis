import { h } from 'preact';
import { Button } from '../../layout/Button';
import { Message } from '../ui/Message';
import { Layout } from '../state-ui/Layout';
const style = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
};

export default function Inviter({ hangout, onAccept,onDecline }) {
  const message ={...hangout.message,username:hangout.username}
  return (
    <Layout id='inviter-ui'>
      <div style={style.root}>
        <div style={{ flex: 1, marginTop: 16, marginLeft: 8 }}>
          <Message
            message={message && message}
         
          />
        </div>

        <div style={{ display: 'flex', padding: 8 }}>
          <Button
          onClick={onDecline}
            title="Ignore"
            style={{ flex: 1, marginRight: 4, color: 'red' }}
          />
          <Button
          onClick={onAccept}
          data-testid='accept-btn'
            title="Accept"
            style={{ flex: 1, marginLeft: 4, color: 'green' }}
          />
        </div>
      </div>
    </Layout>
  );
}
