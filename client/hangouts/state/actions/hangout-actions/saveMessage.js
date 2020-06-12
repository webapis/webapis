
import { actionTypes } from '../../actionTypes';
export function saveMessage({ dispatch, hangout, name, focusedHangout }) {
    const { username, message, state, email } = hangout;
  
    // save message to localStorage
    const messageKey = `${name}-${username}-messages`;
    const messages = JSON.parse(localStorage.getItem(messageKey));
    const updatedMessages = null;
    if (messages) {
      updatedMessages = [...messages, {...message,username}];
    } else {
      updatedMessages = [{...message,username}];
    }
    localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  
    if (focusedHangout.username === username) {
      // sync message with reducer state
      dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
    }
  
  }