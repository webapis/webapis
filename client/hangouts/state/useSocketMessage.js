import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useAppRoute } from '../../app-route/AppRouteProvider';
import { hangoutStates } from '../../../server/hangouts/hangoutStates';
import { updateLocalHangouts } from './updateLocalHangouts';
import { actionTypes } from './actionTypes';
import { reduceUnread } from './actions';
export function useSocketMessage({
  socketMessage,
  username,
  dispatch,
  focusedHangout,
}) {
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

  function handleMessanger({hangout}){
    if(hangout.state==='MESSANGER'){
      
    }
  }
  useEffect(() => {
    if (socketMessage && focusedHangout && username) {
      debugger;
      if (socketMessage.type === 'ACKHOWLEDGEMENT') {
        const { hangout } = socketMessage;
        debugger;
        dispatch({
          type: actionTypes.ACKHOWLEDGEMENT_RECIEVED,
          hangout,
          username,
        });
        handleRoute({ hangout });
      } else if (socketMessage.type === 'HANGOUT') {
        const { hangout } = socketMessage;
        if (hangout.username === focusedHangout.username) {
          dispatch({
            type: actionTypes.FOCUSED_HANGOUT_RECIEVED,
            hangout,
            username,
          });
        } else {
          const { hangout } = socketMessage;
          dispatch({
            type: actionTypes.UNFOCUSED_HANGOUT_RECIEVED,
            hangout,
            username,
          });
        }
        debugger;
      } else if (socketMessage.type === 'UNREAD_HANGOUTS') {
        debugger;
        const { hangouts } = socketMessage;
        dispatch({
          type: actionTypes.OFFLINE_HANGOUTS_RECIEVED,
          hangouts,
          username,
        });
      }
    }
  }, [socketMessage, focusedHangout, username]);
  return {};
}
