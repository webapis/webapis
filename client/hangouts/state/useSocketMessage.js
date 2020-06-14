import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useAppRoute } from '../../app-route/AppRouteProvider';
import { hangoutStates } from '../../../server/hangouts/hangoutStates';
import {
  saveInvited,
  saveUnblovked,
  saveDeclined,
  saveBlocked,
  saveAccepted,
  saveMessaged,
} from './actions/delivering-actions';
import {
  saveAccepter,
  saveBlocker,
  saveDecliner,
  saveInviter,
  saveMessanger,
  saveUnblocker,
} from './actions/recieving-actions';
export function useSocketMessage({
  socketMessage,
  username,
  dispatch,
  focusedHangout,
}) {
  const { onAppRoute } = useAppRoute();
  function handleAcknowledgement({ hangout,offline }) {
    switch (hangout.state) {
      case hangoutStates.INVITED:
        saveInvited({
          dispatch,
          hangout,
          name:username,
          focusedHangout,
          onAppRoute,
          offline
        });
      case hangoutStates.UNBLOCKED:
        saveUnblovked({
          dispatch,
          hangout,
          name:username,
          focusedHangout,
          onAppRoute,
          offline
        });
      case hangoutStates.DECLINED:
        saveDeclined({
          dispatch,
          hangout,
          name:username,
          focusedHangout,
          onAppRoute,
          offline
        });
      case hangoutStates.BLOCKED:
        saveBlocked({
          dispatch,
          hangout,
          name:username,
          focusedHangout,
          onAppRoute,
          offline
        });
      case hangoutStates.ACCEPTED:
        saveAccepted({
          dispatch,
          hangout,
          name:username,
          focusedHangout,
          onAppRoute,
          offline
        });

        break;
      case hangoutStates.MESSAGED:
       
        saveMessaged({
          dispatch,
          hangout,
          name:username,
          focusedHangout,
          onAppRoute,
          offline
        });
        break;
      default:
        break;
    }
  }

  function handleHangout({ hangout }) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
        saveAccepter({ dispatch, hangout,  name:username, focusedHangout,onAppRoute });
        break;
      case hangoutStates.BLOCKER:
        saveBlocker({ dispatch, hangout,  name:username, focusedHangout,onAppRoute  });
        break;
      case hangoutStates.DECLINER:
        saveDecliner({ dispatch, hangout,  name:username, focusedHangout,onAppRoute  });
        break;
      case hangoutStates.INVITER:
        saveInviter({ dispatch, hangout,  name:username, focusedHangout,onAppRoute  });
        break;
      case hangoutStates.MESSANGER:
        saveMessanger({ dispatch, hangout,  name:username, focusedHangout,onAppRoute  });
        break;
      case hangoutStates.UNBLOCKER:
        saveUnblocker({ dispatch, hangout,  name:username, focusedHangout,onAppRoute  });
        break;
      default:
        break;
    }
  }

  function handleHangouts({ hangouts }) {
    hangouts.forEach((hangout) => {
      handleHangout({ hangout });
    });
  }

  useEffect(() => {
    if (socketMessage  && username) {
    
      switch (socketMessage.type) {
        case 'ACKHOWLEDGEMENT':

          handleAcknowledgement({ hangout: socketMessage.hangout,offline:false });
          break;
        case 'HANGOUT':
          debugger;
          handleHangout({ hangout: socketMessage.hangout });
          break;
        case 'UNREAD_HANGOUTS':
          debugger;
          handleHangouts({ hangouts: socketMessage.hangouts });
          break;
        case 'OFFLINE_ACKN':
          debugger;
          handleAcknowledgement({ hangout: socketMessage.hangout,offline:true });
          break;
        default:
          break;
      }
    }
  }, [socketMessage]);

  return {};
}
