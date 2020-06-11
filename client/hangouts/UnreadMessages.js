import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { List, ListItem } from '../layout/NavList';
export default function UnreadMessages({ unreadmessages }) {
  const [items, setItems] = useState([]);
  useEffect(() => {

    const reducerItems = unreadmessages.reduce((accumulator, current, index) => {
      if (index === 0) {
        return (accumulator = [{ ...current, messageCount: 1 }]);
      } else {
        const obj = accumulator.find(
          (a) =>
            a.username === current.username && current.state === 'MESSANGER'
        );
        if (obj) {
          const index = accumulator.findIndex(
            (a) => a.username === current.username
          );
          //if current exist inside accumilator map it to that object
          accumulator.splice(index, 1, {
            ...obj,
            messageCount: ++obj.messageCount,
          });
        } else {
          //if current exist inside accumilator map it to that object
          accumulator.push({ ...current, messageCount: 1 });
        }
      }

      return accumulator;
    }, []);
 //   console.log('reducerItems', reducerItems);
    setItems(reducerItems);
  }, [unreadmessages]);

  return (
    <div>
      <List>
        {items &&
          items.length > 0 &&
          items.map((u) => {
          return <ListItem>{u.username} <div style={{color:'#737373'}}>messages: {u.messageCount}</div></ListItem>;
          })}
      </List>
    </div>
  );
}
