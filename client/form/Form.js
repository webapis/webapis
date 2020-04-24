import { h } from 'preact';
import './css/style.css';
const style = {
  display: 'flex',
  flexDirection: 'column',
};

export default function Form({ children, formTitle, error }) {
  return (
    <div className='paper'>
 
        <legend>{formTitle}:</legend>
        {children}
        {error && (
          <div
            style={{
              color: 'red',
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 5,
            }}
          >
            * {error.message}
          </div>
        )}
   
    </div>
  );
}
