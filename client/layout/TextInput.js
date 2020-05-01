import { h } from 'preact';

const style = {
  padding: 8,
  marginLeft: 16,
  marginRight: 16,
  marginTop: 8,
  marginBottom: 8,
  boxSizing: 'border-box',
  flex: 1,
};

export function TextInput(props) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <input style={style} {...props} />
    </div>
  );
}
