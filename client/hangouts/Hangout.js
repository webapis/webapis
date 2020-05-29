import {h} from 'preact'
import {List,ListItem} from '../layout/NavList'
import {TextInput} from '../layout/TextInput'
export default function Hangout({hangouts, onSearch,onSelect}){
    return <div>
        <TextInput type="search" onChange={onSearch}/>
        <List>
            {hangouts && hangouts.map(g=>{
                debugger;
                return <ListItem onClick={onSelect}>{g.username}</ListItem>
            })}
        </List>
    </div>
}