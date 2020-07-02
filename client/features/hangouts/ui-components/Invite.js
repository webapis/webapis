import { h } from 'preact';
import PersonAdd from 'icons/PersonAdd';
import  TextInput  from 'controls/text-input';
import { Center } from 'components/layout/Center';
import  Layout  from './Layout';
import AsyncButton from 'controls/async-button'
const style = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};
//
export default function Invite({ hangout, onInvite, onMessageText,messageText, loading }) {

  
  return (
    <Layout style={style.layout}id="invite-ui">
      <Center>
        <PersonAdd color="green" />
      </Center>
      <Center>
        Start Conversation with <b>{hangout && hangout.email}</b>
      </Center>
      <TextInput id="messageTextInput" onChange={onMessageText} value={messageText} />
      <Center>
        <AsyncButton loading={loading}  id="INVITE" onClick={onInvite} data-testid='oninvite-btn' >
          SEND INVITE
        </AsyncButton>
      </Center>
    </Layout>
  );
}
