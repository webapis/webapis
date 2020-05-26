import { useEffect } from 'preact/hooks';
import { useWebSocket } from '../useWebSocket';
import { status } from './status';
import { actionTypes } from './useContacts';
export function useMessage({ dispatch }) {
  const { message } = useWebSocket();

  useEffect(() => {
    if (message) {
      switch (message.type) {
        case status.CHAT:
          dispatch({
            type: actionTypes.CONTACT_STATE_CHANGED,
            username: message.sender,
            state: status.CHAT,
          });
        case status.DECLINER:
          dispatch({
            type: actionTypes.CONTACT_STATE_CHANGED,
            username: message.sender,
            state: contactStatus.ACCEPTED,
          });
        case status.BLOCKER:
          dispatch({
            type: actionTypes.CONTACT_STATE_CHANGED,
            username: message.sender,
            state: status.BLOCKER,
          });
        case status.INVITER:
          dispatch({
            type: actionTypes.CONTACT_STATE_CHANGED,
            username: message.sender,
            state: status.INVITER,
          });
        default:
          throw new Error('message type is not defined');
      }
    }
  }, [message]);
}
