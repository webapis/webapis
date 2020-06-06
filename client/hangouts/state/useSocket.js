import { useEffect } from 'preact/hooks';
import { useWSocketContext } from '../../wsocket/WSocketProvider';
import { hangoutStates } from '../../../server/hangouts/hangoutStates'
import { actionTypes } from './actionTypes'
import {clientCommands} from './clientCommands'
export function useSocket({ dispatch, username }) {
  const socketContext = useWSocketContext();
  const { socket,online } = socketContext


  useEffect(() => {
    if (socket && username) {
      socket.onmessage = (message) => {
        const hangout = JSON.parse(message.data);
        debugger;
        handleHangoutState({ hangout, username, dispatch })
      };
      socket.onclose = () => {
        
      };
      socket.onerror = (error) => {
        
      };
      
      socket.onopen = () => {
        debugger;
       
      };
    }
  }, [socket,username]);

  return null;

}

function handleHangoutState({ hangout, username, dispatch }) {
  const key = `${username}-hangouts`
  debugger;
  const target = hangout.username
  const hangouts = JSON.parse(localStorage.getItem(key))
  debugger;
  let updatedState = null;
  switch (hangout.state) {
 
    case hangoutStates.ACCEPTER:
    case hangoutStates.BLOCKED:
    case hangoutStates.BLOCKER:
    case hangoutStates.DECLINED:
    case hangoutStates.DECLINER:
    case hangoutStates.MESSAGED:
    case hangoutStates.MESSANGER:
    case hangoutStates.UNBLOCKED:
    case hangoutStates.UNBLOCKER:
    case hangoutStates.INVITED:
      updatedState = hangouts.map(g => { if (g.username === target) { return hangout } else return g })
      localStorage.setItem(key, JSON.stringify( updatedState))
      debugger;
      dispatch({ type: actionTypes.HANGOUT_STATE_CHANGED, hangout })
      break;
      case hangoutStates.ACCEPTED:
    case hangoutStates.INVITER:
      if (hangouts) {
        debugger
        localStorage.setItem(key,JSON.stringify(hangouts.push(hangout)))
      }
      else {
        debugger;
        localStorage.setItem(key, JSON.stringify([hangout]))
      }
      dispatch({ type: actionTypes.NEW_HANGOUT_RECIEVED, hangout })
      break;
    default:
      throw new Error("hangoutState not defined")
  }

  function onOnline(){
    socket.send(JSON.stringify({command:clientCommands.ONLINE}))
  }

}






