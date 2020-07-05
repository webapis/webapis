import { h } from 'preact';

import  Layout  from './Layout';
import  Button  from 'controls/button';
const style = {
  checkbox: { marginRight: 8 },
  checkboxRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: 16,
  },
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

export default function Block({ onCancel, onBlock, onReport }) {

 
  return (
    <Layout style={style.layout}>
      <div style={style.checkboxRoot}>
        <input type="checkbox" style={style.checkbox} onChange={onReport} />
        <label>Report</label>
      </div>
      <div style={{ display: 'flex', padding: 8 }}>
        <Button data-testid='cancel-btn' style={style.btn} onClick={onCancel} >CANCEL</Button>
        <Button title="Block" style={style.btn} id="BLOCK" onClick={onBlock} data-testid="block-btn" >BLOCK</Button>
      </div>
    </Layout>
  );
}
