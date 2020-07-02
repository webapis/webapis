import { h } from 'preact';

import { Message } from './messages/Message';
import Layout  from './Layout';
import AsyncButton from 'controls/async-button'
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

export default function Inviter({ hangout, onAccept, onDecline,loading }) {
 
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
          <AsyncButton
            id="DECLINE"
            onClick={onDecline}
            data-testid="decline-btn"
            title="Decline"
            style={{ flex: 1, marginRight: 4, color: 'red' }}
          >
            DECLINE
          </AsyncButton>
          <AsyncButton
            id="ACCEPT"
            onClick={onAccept}
            data-testid="accept-btn"
            style={{ flex: 1, marginLeft: 4, color: 'green' }}
            loading={loading}
          >
            ACCEPT
          </AsyncButton>
        </div>
      </div>
    </Layout>
  );
}
