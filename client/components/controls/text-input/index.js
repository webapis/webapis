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

  return (
    <div  >
      <input {...props}/>
    </div>
  );
}
