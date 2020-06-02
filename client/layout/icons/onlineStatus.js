import { h } from 'preact';
const style ={
  width:15,
  height:15,

  border:'white 2px solid'
}
export function OnlineStatus({online}) {
  return <div style={{...style,backgroundColor: online ? 'green':'red'}}> 
    
  </div>;
}
