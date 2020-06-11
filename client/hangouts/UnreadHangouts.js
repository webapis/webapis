import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { List, ListItem } from '../layout/NavList';
export default function UnreadHangouts({ unreadhangouts }) {


  return (
    <div>
      <List>
        {unreadhangouts &&
          unreadhangouts.length > 0 &&
          unreadhangouts.map((u) => {
          return <ListItem>{u.username} <div style={{color:'#737373'}}>messages: {u.messageCount}</div></ListItem>;
          })}
      </List>
    </div>
  );
}
