import { h } from 'preact';

import { Block } from 'icons/Block';
import { Center } from 'components/layout/Center';
import  AsyncButton  from 'controls/async-button';
import  Layout  from './Layout';

const style = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    paddingTop:68
  },
  btn: {
    flex: 1,
    marginRight: 4,
  },
};

export default function Blocked({ hangout, onUnblock, onClose }) {


  return (
    <Layout style={style.layout} id="blocked-ui">
      <Center style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Block width="60" height="70" color="red" />
        <b>{hangout && hangout.username}</b> is blocked
      </Center>

      <div style={{ display: 'flex', padding: 8 }}>
        <AsyncButton data-testid='close-btn' style={style.btn} onClick={onClose} >CLOSE</AsyncButton>
        <AsyncButton id='UNBLOCK'  style={style.btn} onClick={onUnblock} data-testid='unblock-btn'>UNBLOCK</AsyncButton>
      </div>
    </Layout>
  );
}
