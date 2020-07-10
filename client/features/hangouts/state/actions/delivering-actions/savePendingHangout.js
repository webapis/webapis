import { actionTypes } from "../../actionTypes";
export function savePendingHangout({
  dispatch,
  name,
  hangout,
  online,
  isBlocker,
}) {
  //6
  const { username, message } = hangout;
  let hangoutKey = "";
  let messageKey = "";
  if (online) {
    hangoutKey = `${name}-hangouts`;
    messageKey = `${name}-${username}-messages`;
  } else {
    hangoutKey = `${name}-offline-hangouts`;
    messageKey = `${name}-${username}-offline-messages`;
  }

  saveHangout({ hangoutKey, username, hangout, dispatch });
  if (message && message.text !== "") {
    saveMessage({ messageKey, username, message, dispatch, isBlocker });
  }
}

function saveHangout({ hangoutKey, username, hangout, dispatch }) {
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  let updatedHangouts = null;
  if (hangouts) {
    const hangoutIndex = hangouts.findIndex((g) => g.username === username);
    hangouts.splice(hangoutIndex, 1, hangout);
    localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts });
  } else {
    updatedHangouts = [hangout];
    localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: updatedHangouts });
  }
}

export function saveMessage({ messageKey, message, dispatch, isBlocker }) {
  const messages = JSON.parse(localStorage.getItem(messageKey));
  let updatedMessages = [];
  if (messages) {
    updatedMessages = [...messages, message];
  } else {
    updatedMessages = [message];
  }
  if (isBlocker) {
    const blocker = [
      ...updatedMessages,
      {
        text: "You can not send this message because you are blocked.",
        timestamp: Date.now(),
        type: "blocker",
        username: message.username,
        float: "right",
      },
    ];
    localStorage.setItem(messageKey, JSON.stringify(blocker));
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: blocker });
  } else {
    localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
  }
}
