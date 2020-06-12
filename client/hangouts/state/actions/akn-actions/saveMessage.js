import { actionTypes } from '../../actionTypes';
export function saveMessage({ dispatch, name, hangout }) {
  const { username, message, state, email } = hangout;
  // save message to localStorage
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const updatedMessages = null;
  if (messages) {
    updatedMessages = [...messages, { ...message, delivered: false, username }];
  } else {
    updatedMessages = [{ ...message, delivered: false, username }];
  }
  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
}
