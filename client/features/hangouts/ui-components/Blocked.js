import { h } from 'preact';

import { Block } from 'icons/Block';
import { Center } from 'components/layout/Center';
import Button from 'controls/button';
import Layout from './Layout';

const style = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    paddingTop: 68
  }

};

export default function Blocked({ hangout, onUnblock, onClose }) {


  return (
    <Layout style={style.layout} id="blocked-ui">
      <Center style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Block width="60" height="70" color="red" />
        <b>{hangout && hangout.username}</b> is blocked
      </Center>
      <div className="row">
        <div className="col">
          <Button data-testid='close-btn' onClick={onClose} title="CLOSE" bg="secondary" block outline />
        </div>
        <div className="col">
          <Button id='UNBLOCK' onClick={onUnblock} data-testid='unblock-btn' title="UNBLOCK" bg="primary" block />
        </div>
      </div>
    </Layout>
  );
}
