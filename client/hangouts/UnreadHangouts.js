import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { List, ListItem } from '../layout/NavList';
import {reducerUnreadhangouts} from '../hangouts/state/reduceUnreadhangouts'
export default function UnreadHangouts({ unreadhangouts,onSelectUnread }) {

  const [items,setItems] =useState([])
useEffect(()=>{
if(unreadhangouts){

  const reduced =reducerUnreadhangouts({unreadhangouts})
 
  setItems(reduced)
}

},[unreadhangouts])

  return (
    <div data-testid='unreadhangouts' style={{paddingTop:68}}>
      <List>
        {items &&
          items.length > 0 &&
          items.map((u) => {
       
          return <ListItem onClick={onSelectUnread} id={u.username}>{u.username} messages: {u.messageCount}</ListItem>;
          })}
      </List>
    </div>
  );
}
