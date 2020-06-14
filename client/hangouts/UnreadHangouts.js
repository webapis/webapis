import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { List, ListItem } from '../layout/NavList';
import {reducerUnreadhangouts} from '../hangouts/state/reduceUnreadhangouts'
export default function UnreadHangouts({ unreadhangouts }) {
  const [items,setItems] =useState([])
useEffect(()=>{
if(unreadhangouts){
  const reduced =reducerUnreadhangouts({unreadhangouts})
  setItems(reduced)
}

},[unreadhangouts])

  return (
    <div data-testid='unreadhangouts'>
      <List>
        {items &&
          items.length > 0 &&
          items.map((u) => {
            debugger;
          return <ListItem id={u.username}>{u.username} <div style={{color:'#737373'}}>messages: {u.messageCount}</div></ListItem>;
          })}
      </List>
    </div>
  );
}
