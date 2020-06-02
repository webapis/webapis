import { h } from 'preact';
const style ={
  width:15,
  height:15,

  border:'white 2px solid'
}
export function OnlineStatus({online}) {
  if(online){
    return <IsOnline/>
  }
    
  return <IsOffline/>
}


export function IsOnline(){
  return <div style={{...style,backgroundColor:'green'}} data-testid="online"></div>
}

export function IsOffline(){
  return <div style={{...style,backgroundColor:'red'}} data-testid="offline"></div>
}