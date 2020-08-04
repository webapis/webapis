import { actionTypes } from "../actionTypes";

export function updateUnread({ dispatch, hangout, name, dState }) {
  try {
    const { username, timestamp } = hangout;

    const hangoutKey = `${name}-unread-hangouts`;
    const readHangout = { ...hangout, state: dState };
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
  } catch (error) {}
}

export function saveSentMessage({ hangout, dispatch, name }) {
  const { username, message } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const pendingMessage = { ...message, username: name, state: "pending" };
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
export function saveRecievedMessage({ hangout, dispatch, name }) {
  const { username, message } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const pendingMessage = { ...message, username, state: "unread" };
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
  const { state } = hangout;
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const unreadHangout = { ...hangout, state };
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

export function updateSentMessage({ hangout, name, dispatch }) {
  const { username, message } = hangout;
  const { timestamp } = message;
  const messageKey = `${name}-${username}-messages`;
  const updatedMessage = { ...message, username: name, state: "delivered" };
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
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  let hangoutIndex =
    localHangouts && localHangouts.findIndex((l) => l.username === username);
  localHangouts && localHangouts.splice(hangoutIndex, 1, hangout);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
}

export function saveHangout({ hangout, dispatch, name }) {
  const hangoutKey = `${name}-hangouts`;
  let localHangouts = localStorage.getItem(hangoutKey);

  if (localHangouts && localHangouts.length > 0) {
    localStorage.setItem(
      hangoutKey,
      JSON.stringify([...localHangouts, hangout])
    );
    dispatch({
      type: actionTypes.HANGOUTS_UPDATED,
      hangouts: [...localHangouts, hangout],
    });
    dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: hangout });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([hangout]));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: [hangout] });
  }
}

export function removeUnread({ hangout, dispatch, name }) {
  const { username, timestamp } = hangout;
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  if (localHangouts && localHangouts.length > 0) {
    const hangoutIndex = localHangouts.findIndex(
      (f) => f.username === username && f.timestamp === timestamp
    );
    localHangouts.splice(hangoutIndex, 1);
    localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: localHangouts,
    });
  }
}

export function removeUnreads({ dispatch, name }) {
  const hangoutKey = `${name}-unread-hangouts`;
  localStorage.removeItem(hangoutKey);
  dispatch({
    type: actionTypes.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: [],
  });
}

export function loadMessages({ hangout, name, dispatch }) {
  const { username } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  if (messages && messages.length > 0) {
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages });
  } else {
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: [] });
  }
}
