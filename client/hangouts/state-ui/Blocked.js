import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import { Block } from '../../icons/Block';
import { Center } from '../../layout/Center';
import { Button } from '../../components/Button';
import { Layout } from './Layout';
import {resetHangout} from '../state/actions'
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

  // useEffect(()=>{
  //   return ()=>{

  //     resetHangout({dispatch})
  //   }
  // },[])
  return (
    <Layout style={style.layout} id="blocked-ui">
      <Center style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Block width="60" height="70" color="red" />
        <b>{hangout && hangout.username}</b> is blocked
      </Center>

      <div style={{ display: 'flex', padding: 8 }}>
        <Button title="Close" style={style.btn} onClick={onClose} />
        <Button id='UNBLOCK' title="Unblock" style={style.btn} onClick={onUnblock} data-testid='unblock-btn'/>
      </div>
    </Layout>
  );
}
