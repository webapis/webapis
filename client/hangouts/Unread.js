import { h } from 'preact';
import {useEffect,useState} from 'preact/hooks'
import {List,ListItem} from '../layout/NavList'
export default function unread({ unreads }) {
const [items,setItems]=useState([])
  useEffect(()=>{
const reducerItems = unreads.reduce((acc,curr)=>{
  
})
  },[unreads])



  return <div>
    <List>
      {unreads.map(u=>{
        return <ListItem>{u.username}</ListItem>
      })}
    </List>
  </div>;
}
