import { h } from 'preact';

const styles = {
  padding: 8,
  marginLeft: 16,
  marginRight: 16,
  marginTop: 8,
  marginBottom: 8,
  boxSizing: 'border-box',
  flex: 1,
};

export function TextInput(props) {
  const { id, type = 'text',style } = props;
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <input  style={{...styles,...style}} {...props} data-testid={id} type={type} />
    </div>
  );
}