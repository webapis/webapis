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
} from './actions/akn-actions';
import {
  saveAccepter,
  saveBlocker,
  saveDecliner,
  saveInviter,
  saveMessanger,
  saveUnblocker,
} from './actions/hangout-actions';
export function useSocketMessage({
  socketMessage,
  username,
  dispatch,
  focusedHangout,
}) {
  const { onAppRoute } = useAppRoute();
  function handleAcknowledgement({ hangout }) {
    switch (hangout.state) {
      case hangoutStates.INVITED:
        saveInvited({
          dispatch,
          hangout,
          username,
          focusedHangout,
          onAppRoute,
        });
      case hangoutStates.UNBLOCKED:
        saveUnblovked({
          dispatch,
          hangout,
          username,
          focusedHangout,
          onAppRoute,
        });
      case hangoutStates.DECLINED:
        saveDeclined({
          dispatch,
          hangout,
          username,
          focusedHangout,
          onAppRoute,
        });
      case hangoutStates.BLOCKED:
        saveBlocked({
          dispatch,
          hangout,
          username,
          focusedHangout,
          onAppRoute,
        });
      case hangoutStates.ACCEPTED:
        saveAccepted({
          dispatch,
          hangout,
          username,
          focusedHangout,
          onAppRoute,
        });

        break;
      case hangoutStates.MESSAGED:
        saveMessanged({
          dispatch,
          hangout,
          username,
          focusedHangout,
          onAppRoute,
        });
        break;
      default:
        break;
    }
  }

  function handleHangout({ hangout }) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
        saveAccepter({ dispatch, hangout, username, focusedHangout });
        break;
      case hangoutStates.BLOCKER:
        saveBlocker({ dispatch, hangout, username, focusedHangout });
        break;
      case hangoutStates.DECLINER:
        saveDecliner({ dispatch, hangout, username, focusedHangout });
        break;
      case hangoutStates.INVITER:
        saveInviter({ dispatch, hangout, username, focusedHangout });
        break;
      case hangoutStates.MESSANGER:
        saveMessanger({ dispatch, hangout, username, focusedHangout });
        break;
      case hangoutStates.UNBLOCKER:
        saveUnblocker({ dispatch, hangout, username, focusedHangout });
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
    if (socketMessage && focusedHangout && username) {
      switch (socketMessage.type) {
        case 'ACKHOWLEDGEMENT':
          handleAcknowledgement({ hangout: socketMessage.hangout });
          break;
        case 'HANGOUT':
          handleHangout({ hangout: socketMessage.hangout });
          break;
        case 'UNREAD_HANGOUTS':
          handleHangouts({ hangouts: socketMessage.hangouts });
          break;
        default:
          break;
      }
    }
  }, [socketMessage, focusedHangout, username]);
  return {};
}
