import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Button } from '../../layout/Button';
import { Message } from '../ui/Message';
import { Layout } from '../state-ui/Layout';
const style = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingTop: 70,
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    paddingBottom:8,
 
  },
};

export default function Inviter({ hangout, onAccept, onDecline }) {
  debugger;
  return (
    <Layout id="inviter-ui">
      <div style={style.root}>
        <div style={{ marginLeft: 8, display:'flex' }}>
          {hangout && hangout.message && (
            <Message
              message={
                hangout &&
                hangout.message && {
                  ...hangout.message,
                  username: hangout.username,float:'left'
                }
              }
            />
          )}
        </div>

        <div style={{ display: 'flex',paddingLeft:8,paddingRight:8 }}>
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
