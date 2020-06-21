import { h } from 'preact';
import './css/style.css';



 function List(props) {
  return (
    <div className="list" {...props}/>
  );
}


 function ListItem(props) {

  return (
    <div className="list-item" {...props} />
  );
}

export {List,ListItem}