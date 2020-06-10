import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useAppRoute } from '../../app-route/AppRouteProvider';
import { hangoutStates } from '../../../server/hangouts/hangoutStates';
import { updateLocalHangouts } from './updateLocalHangouts';

export function useMessageRouter({ message, username, dispatch }) {
  const { onAppRoute } = useAppRoute();
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
    if (message) {
      const hangout = JSON.parse(message.data);
      updateLocalHangouts({ hangout, username });
      handleRoute({ hangout });
      dispatch({ type: actionTypes.HANGOUT_RECIEVED, hangout });
    }
  }, [message]);
  return {};
}
