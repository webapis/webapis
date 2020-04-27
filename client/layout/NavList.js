import { h } from 'preact';
import './css/style.css';
export function List({ children }) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        backgroundColor: '#fff',

        paddingTop: 8,
        paddingBottom: 8,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

export function ListItem({ children, onClick, id }) {
  return (
    <div
      id={id}
      data-testid={id}
      onClick={onClick}
      className='drawer-list-item'
      style={{
        boxSizing: 'border-box',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        display: 'flex',
      }}
    >
      {children}
    </div>
  );
}
