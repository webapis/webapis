import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import PersonAdd from '../../icons/PersonAdd';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Center } from '../../layout/Center';
import { Layout } from '../state-ui/Layout';
import AsyncButton from '../../components/async-button'
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
