import { actionTypes } from '../../actionTypes';
export function updateMessage({ dispatch, name, hangout }) {
  const { username, message, state, email } = hangout;
  // save message to localStorage
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const hangoutIndex = messages.findIndex(
    (m) => m.timestamp === message.timestamp
  );
  const updatedMessages = messages.splice(hangoutIndex, 1, {
    ...message,
    delivered: true,
    username,
  });

  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
}
