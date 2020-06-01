import { h } from 'preact';
import { Layout } from '../state-ui/Layout';
import { Button } from '../../layout/Button';

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
        <Button title="Cancel" style={style.btn} onClick={onCancel} />
        <Button title="Block" style={style.btn} onClick={onBlock} />
      </div>
    </Layout>
  );
}
