import { h } from 'preact';
import { useMediaQuery } from '../layout/useMediaQuery';
//import './css/style.css';

export default function Form({ children, formTitle, error }) {
  const { device } = useMediaQuery;
  return (
    <div
    //className="paper"
    //  style={{ width: device === 'phone' ? '100%' : 350 }}
    >
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
