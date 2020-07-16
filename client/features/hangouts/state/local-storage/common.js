import { actionTypes } from "../actionTypes";

export function updateUnread({ dispatch, hangout, name }) {
  const { username, timestamp } = hangout;
  const hangoutKey = `${name}-unread-hangouts`;
  const readHangout = { ...hangout };
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = localHangouts.findIndex(
    (f) => f.username === username && f.timestamp === timestamp
  );
  localHangouts.splice(hangoutIndex, 1, readHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({
    type: actionTypes.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: localHangouts,
  });
}

export function saveSentMessage({ hangout, dispatch, name, dState }) {
  const { username, message } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const pendingMessage = { ...message, username: name, state: dState };
  if (localMessages && localMessages.length > 0) {
    localStorage.setItem(
      messageKey,
      JSON.stringify([...localMessages, pendingMessage])
    );
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [...localMessages, pendingMessage],
    });
  } else {
    localStorage.setItem(messageKey, JSON.stringify([pendingMessage]));
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [pendingMessage],
    });
  }
}
export function saveRecievedMessage({ hangout, dispatch, name, dState }) {
  const { username, message } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const pendingMessage = { ...message, username, state: dState };
  if (localMessages && localMessages.length > 0) {
    localStorage.setItem(
      messageKey,
      JSON.stringify([...localMessages, pendingMessage])
    );
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [...localMessages, pendingMessage],
    });
  } else {
    localStorage.setItem(messageKey, JSON.stringify([pendingMessage]));
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [pendingMessage],
    });
  }
}
export function saveUnread({ dispatch, name, hangout }) {
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const unreadHangout = { ...hangout };
  if (localHangouts && localHangouts.length > 0) {
    localStorage.setItem(
      hangoutKey,
      JSON.stringify([...localHangouts, unreadHangout])
    );
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: [...localHangouts, unreadHangout],
    });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([unreadHangout]));
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: [unreadHangout],
    });
  }
}

export function updateSentMessage({ hangout, name, dispatch, dState }) {
  const { username, message } = hangout;
  const { timestamp } = message;
  const messageKey = `${name}-${username}-messages`;
  const updatedMessage = { ...message, username: name, state: dState };
  const localMessages = JSON.parse(localStorage.getItem(messageKey));

  let messageIndex = localMessages.findIndex((i) => {
    i.username === username, i.timestamp === timestamp;
  });
  localMessages.splice(messageIndex, 1, updatedMessage);
  localStorage.setItem(messageKey, JSON.stringify(localMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: localMessages });
}

export function updateRecievedMessage({
  hangout,
  name,
  dispatch,
  dState,
  messagedBy,
}) {
  const { username, message } = hangout;

  const { timestamp } = message;
  const messageKey = `${name}-${username}-messages`;
  const updatedMessage = { ...message, username, state: dState };
  const localMessages = JSON.parse(localStorage.getItem(messageKey));

  let messageIndex = localMessages.findIndex((i) => {
    i.username === username, i.timestamp === timestamp;
  });
  localMessages.splice(messageIndex, 1, updatedMessage);
  localStorage.setItem(messageKey, JSON.stringify(localMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: localMessages });
}

export function updateHangout({ dispatch, name, hangout }) {
  const { username } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const recievedAccepter = { ...hangout };
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  if (localHangouts && localHangouts.length > 0) {
    let hangoutIndex = localHangouts.findIndex((f) => f.username === username);
    localHangouts.splice(hangoutIndex, 1, recievedAccepter);
    localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
  }
}
