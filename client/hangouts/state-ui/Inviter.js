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

export default function Inviter({ hangout, onAccept, onDecline }) {
  debugger;
  return (
    <Layout id="inviter-ui">
      <div style={style.root}>
        <div style={{ flex: 1, marginTop: 16, marginLeft: 8 }}>
          {hangout && hangout.message && (
            <Message message={hangout && hangout.message && hangout.message} />
          )}
        </div>

        <div style={{ display: 'flex', padding: 8 }}>
          <Button
            id="DECLINE"
            onClick={onDecline}
            title="Ignore"
            style={{ flex: 1, marginRight: 4, color: 'red' }}
          />
          <Button
            id="ACCEPT"
            onClick={onAccept}
            data-testid="accept-btn"
            title="Accept"
            style={{ flex: 1, marginLeft: 4, color: 'green' }}
          />
        </div>
      </div>
    </Layout>
  );
}
