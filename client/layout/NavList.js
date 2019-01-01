import { h } from 'preact';
import './css/style.css';

const styles ={
  item:{
    boxSizing: 'border-box',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    display: 'flex',
    backgroundColor:'--bg-color',
    flex:1,
    '&:hover':{
      backgroundColor: '#f5f5f5',
      cursor: 'pointer'
    }
    
  },
  itemHover:{
   
  }
}

export function List({ children, id }) {
  return (
    <div
    data-testid={id}
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

      style={{
      ...styles.item
      }}
    >
      {children}
    </div>
  );
}
