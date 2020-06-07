import { useEffect } from 'preact/hooks';
import { useWSocketContext } from '../../wsocket/WSocketProvider';
import { hangoutStates } from '../../../server/hangouts/hangoutStates'
import { actionTypes } from './actionTypes'
import {updateLocalHangouts} from './updateLocalHangouts'
import { clientCommands } from './clientCommands'
export function useSocket({ dispatch, username }) {
  const socketContext = useWSocketContext();
  const { socket } = socketContext[0]

  useEffect(() => {
    if (socket && username) {
      socket.onmessage = (message) => {
        const hangout = JSON.parse(message.data);
        debugger;
        updateLocalHangouts({hangout,username})
        dispatch({type:actionTypes.HANGOUT_RECIEVED, hangout})
      };
      socket.onclose = () => {

      };
      socket.onerror = (error) => {

      };

      socket.onopen = () => {
        debugger;

      };
    }
  }, [socket, username]);

  return null;

}








