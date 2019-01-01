import { h } from 'preact';
import PersonAdd from '../../layout/icons/PersonAdd';
import { TextInput } from '../../layout/TextInput';
import { Button } from '../../layout/Button';
import { Center } from '../../layout/Center';
import { Layout } from '../state-ui/Layout';
const style = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};

export function Invite({ hangout, sendInvite, onChange, value }) {
  return (
    <Layout style={style.layout}>
      <Center>
        <PersonAdd color="green" />
      </Center>
      <Center>
        Start Conversation with <b>{hangout && hangout.email}</b>
      </Center>
      <TextInput onChange={onChange} value={value} />
      <Center>
        <Button title="Send Invite" onClick={sendInvite} />
      </Center>
    </Layout>
  );
}
