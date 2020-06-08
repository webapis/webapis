import { useEffect } from 'preact/hooks';
import { useWSocketContext } from '../../wsocket/WSocketProvider';
import { actionTypes } from './actionTypes';
import { updateLocalHangouts } from './updateLocalHangouts';
export function useSocket({ dispatch, username }) {
  const socketContext = useWSocketContext();
  const { socket } = socketContext[0];

  useEffect(() => {
    if (socket && username) {
      socket.onmessage = (message) => {
        debugger;
        const hangout = JSON.parse(message.data);
        updateLocalHangouts({ hangout, username });
        dispatch({ type: actionTypes.HANGOUT_RECIEVED, hangout });
      };
      socket.onclose = () => {};
      socket.onerror = (error) => {};
      socket.onopen = () => {};
    }
  }, [socket, username]);

  return null;
}
