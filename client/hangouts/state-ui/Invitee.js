import { h } from 'preact';
import { Done } from '../../layout/icons/Done';
import { Center } from '../../layout/Center';
import { Layout } from '../state-ui/Layout';

const style = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};
export default function Invitee({ hangout }) {
  return (
    <Layout style={style.layout} id="invitee-ui">
      <Center>
        <Done width="70" height="70" color="green" />
      </Center>
      <Center>
        <p>
          You will be able to chat with <b>{hangout && hangout.email}</b> once
          your invition has been accepted.
        </p>
      </Center>
    </Layout>
  );
}
