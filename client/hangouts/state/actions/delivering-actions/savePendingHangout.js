import { actionTypes } from '../../actionTypes';
export function savePendingHangout({ dispatch, name, hangout, online }) {
  const { username, message, state, email } = hangout;
  let hangoutKey = '';
  let messageKey = '';
  if (online) {
    hangoutKey = `${name}-hangouts`;
    messageKey = `${name}-${username}-messages`;
  } else {
    hangoutKey = `${name}-offline-hangouts`;
    messageKey = `${name}-${username}-offline-messages`;
  }

  saveHangout({ hangoutKey, username, hangout });
  if (message) {
    saveMessage({ messageKey, username, message });
  }
}

function saveHangout({ hangoutKey, username, hangout }) {
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  let updatedHangouts = null;
  if (hangouts) {
    const hangoutIndex = hangouts.findIndex((g) => g.username === username);
    updatedHangouts = hangouts.splice(hangoutIndex, 1, hangout);
  } else {
    updatedHangouts = [hangout];
  }
  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: updatedHangouts });
}

function saveMessage({ messageKey, username, message }) {
  const messages = JSON.parse(localStorage.getItem(messageKey));
  let updatedMessages = null;
  if (messages) {
    updatedMessages = [...messages, message];
  } else {
    updatedMessages = [message];
  }
  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
}
