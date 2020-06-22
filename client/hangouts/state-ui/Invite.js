import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import PersonAdd from '../../icons/PersonAdd';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Center } from '../../layout/Center';
import { Layout } from '../state-ui/Layout';
import {resetHangout} from '../state/actions'
const style = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};
//
export default function Invite({ hangout, onInvite, onMessageText,messageText, value }) {

  
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
        <Button title="Send Invite" id="INVITE" onClick={onInvite} data-testid='oninvite-btn' />
      </Center>
    </Layout>
  );
}
