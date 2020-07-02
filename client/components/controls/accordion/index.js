import { h,createContext } from 'preact'
import {useReducer,useMemo,useContext,useState} from 'preact/hooks'
import reducer,{initState} from './reducer'
import actionTypes from './actionTypes'
import List, {ListItem} from 'controls/list'

const AccordionContext =createContext()

export default function Accordions(props){
const {selectedId}=props
const [state,dispatch] =useReducer(reducer,{...initState,selectedId})

const value = useMemo(() => [state, dispatch], [state]);
return <AccordionContext.Provider value={value} {...props}/>

}

export function Accordion({ children, title,id }) {
  const [state,dispatch] = useContext(AccordionContext)
  const [visible,setVisible]=useState(false)
const {selectedId}=state
  function selectAccordion (e){
      const id =e.target.id
     
      if(id !==selectedId){
        setVisible(true)
      }
      else{
        setVisible(prev=> !prev)
      }
     
      dispatch({type:actionTypes.ACCORDION_SELECTED,selectedId:id})
  }

    return (<List style={{backgroundColor:'#eeeeee',padding:3,flex:1,marginBottom:3}}>
   
       <ListItem id={id} onClick={selectAccordion} style={{fontWeight: 900}}>{title}</ListItem>
    
       {selectedId ===id && visible && children}
    </List>)
}