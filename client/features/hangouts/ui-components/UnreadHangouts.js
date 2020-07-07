import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import List,{ ListItem } from 'controls/list';
import {reducerUnreadhangouts} from 'features/hangouts/state/reduceUnreadhangouts'
export default function UnreadHangouts({ unreadhangouts,onSelectUnread,onRemoveUnread }) {

  const [items,setItems] =useState([])
useEffect(()=>{
if(unreadhangouts){

  const reduced =reducerUnreadhangouts({unreadhangouts})
 
  setItems(reduced)
}

},[unreadhangouts])

  return (
    <div data-testid='unreadhangouts' >
      <List>
        {items &&
          items.length > 0 &&
          items.map((u) => {
       
          return  <div style={{display:'flex'}}>
            <ListItem onClick={onSelectUnread} id={u.username} style={{flex:5}} data-testid={`${u.username}-select`}>{u.username} messages: {u.messageCount}</ListItem>
            <ListItem onClick={onRemoveUnread} id={u.username} style={{color:'red'}} data-testid={`${u.username}-remove`}>x</ListItem>
            </div>
          })}
      </List>
    </div>
  );
}
