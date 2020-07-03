
import { h } from 'preact';



 export default function List(props) {
  return (
    <div className="list" {...props}/>
  );
}


 function ListItem(props) {

  return (
    <div className="list-item" {...props} />
  );
}

export {ListItem}