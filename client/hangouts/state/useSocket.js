import { useEffect } from 'preact/hooks';
import { useWSocketContext } from '../../wsocket/WSocketProvider';
import { actionTypes } from './actionTypes';
import { updateLocalHangouts } from './updateLocalHangouts';
import { useAppRoute } from '../../app-route/AppRouteProvider';
import { hangoutStates } from '../../../server/hangouts/hangoutStates';
export function useSocket({ dispatch, username }) {
  const socketContext = useWSocketContext();
  const { onAppRoute } = useAppRoute();
  const { socket } = socketContext[0];

  function handleRoute({ hangout }) {
    switch (hangout.state) {
      case hangoutStates.INVITED:
      case hangoutStates.UNBLOCKED:
      case hangoutStates.DECLINED:
      case hangoutStates.BLOCKED:
      case hangoutStates.ACCEPTED:
        onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' });
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (socket && username) {
      socket.onmessage = (message) => {
    debugger;
        const hangout = JSON.parse(message.data);
        updateLocalHangouts({ hangout, username });
        handleRoute({ hangout });
        dispatch({ type: actionTypes.HANGOUT_RECIEVED, hangout });
      };
      socket.onclose = () => {};
      socket.onerror = (error) => {};
     // socket.onopen = () => {};
    }
  }, [socket, username]);

  return null;
}
