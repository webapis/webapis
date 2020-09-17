import { actionTypes } from "../actionTypes";

export function updateUnread({ dispatch, hangout, username, dState }) {
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

export function saveSentMessage({ hangout, dispatch, username, dState }) {
  const { target, message } = hangout;
  const messageKey = `${username}-${target}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const pendingMessage = { ...message, owner: username, state: dState };
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
export function saveRecievedMessage({ hangout, dispatch, username, dState }) {
  const { target, message } = hangout;
  const messageKey = `${username}-${target}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const pendingMessage = { ...message, owner: target, state: dState };
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
export function saveUnread({ dispatch, username, hangout }) {
  const { state } = hangout;

  const hangoutKey = `${username}-unread-hangouts`;
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

export function updateSentMessage({ hangout, username, dispatch }) {
  const { target, message } = hangout;

  const { timestamp } = message;
  const messageKey = `${username}-${target}-messages`;
  const updatedMessage = { ...message, owner: username, state: "delivered" };
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  if (localMessages && localMessages.length > 0) {
    let messageIndex = localMessages.findIndex(
      (i) => i.ownwer === username && i.timestamp === timestamp
    );

    localMessages.splice(messageIndex, 1, updatedMessage);
    localStorage.setItem(messageKey, JSON.stringify(localMessages));
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: localMessages });
  } else {
    localStorage.setItem(messageKey, JSON.stringify([updatedMessage]));
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [updatedMessage],
    });
  }
}

export function updateRecievedMessages({
  hangout,
  username,
  dispatch,
  dState,
}) {
  const { target, state } = hangout;

  const messageKey = `${username}-${target}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const sentMessages = localMessages.filter((u) => u.owner === target);
  const recievedMessages = localMessages.filter((u) => u.owner === target);
  if (recievedMessages && recievedMessages.length > 0) {
    let updatedRecievedMessages = recievedMessages.map((l) => {
      if (state === "READING") {
        return { ...l, state: "reading" };
      } else if (state === "READ") {
        return { ...l, state: "read" };
      } else {
        return l;
      }
    });
    localStorage.setItem(
      messageKey,
      JSON.stringify([...sentMessages, ...updatedRecievedMessages])
    );
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [...sentMessages, ...updatedRecievedMessages],
    });
  }
}
export function updateRecievedReadMessages({
  hangout,
  username,
  dispatch,
  dState,
}) {
  const { target, state } = hangout;

  const messageKey = `${username}-${target}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));

  if (localMessages && localMessages.length > 0) {
    let updatedReadMessages = localMessages.map((l) => {
      if (l.owner === target) {
        return { ...l, state: "read" };
      }
    });
    localStorage.setItem(messageKey, JSON.stringify(updatedReadMessages));
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: updatedReadMessages,
    });
  }
}
export function updateRecievedMessage({ hangout, username, dispatch, dState }) {
  const { target, message } = hangout;

  const { timestamp } = message;
  const messageKey = `${username}-${target}-messages`;
  const updatedMessage = { ...message, owner: target, state: dState };
  const localMessages = JSON.parse(localStorage.getItem(messageKey));

  let messageIndex = localMessages.findIndex(
    (i) => i.owner === target && i.timestamp === timestamp
  );

  localMessages.splice(messageIndex, 1, updatedMessage);
  localStorage.setItem(messageKey, JSON.stringify(localMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: localMessages });
}
export function updateHangout({ dispatch, username, hangout }) {
  const { target } = hangout;

  const hangoutKey = `${username}-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));

  if (localHangouts && localHangouts.length > 0) {
    let hangoutIndex =
      localHangouts && localHangouts.findIndex((l) => l.target === target);
    localHangouts && localHangouts.splice(hangoutIndex, 1, hangout);
    localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
    dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([hangout]));
    dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout });
  }
}

export function saveHangout({ hangout, dispatch, username }) {
  const { target } = hangout;

  const hangoutKey = `${username}-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));

  if (localHangouts && localHangouts.length > 0) {
    if (localHangouts.some((hg) => hg.target === target)) {
      updateHangout({ hangout, dispatch, username });
    } else {
      localStorage.setItem(
        hangoutKey,
        JSON.stringify([...localHangouts, hangout])
      );
      // dispatch({
      //   type: actionTypes.HANGOUTS_UPDATED,
      //   hangouts: [...localHangouts, hangout],
      // });
    }

    dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: hangout });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([hangout]));
    // dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: [hangout] });
  }
}

export function removeUnread({ hangout, dispatch, username }) {
  const { target, timestamp } = hangout;
  const hangoutKey = `${username}-unread-hangouts`;

  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  if (localHangouts && localHangouts.length > 0) {
    const hangoutIndex = localHangouts.findIndex(
      (f) => f.target === target && f.timestamp === timestamp
    );
    localHangouts.splice(hangoutIndex, 1);
    localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: localHangouts,
    });
  }
}

export function removeUnreads({ dispatch, username, hangout, state }) {
  const { target } = hangout;
  const hangoutKey = `${username}-unread-hangouts`;

  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  if (localHangouts && localHangouts.length > 0) {
    let filtered = localHangouts.filter(
      (f) => (f.target === target && f.state === state) || f.target !== target
    );
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: filtered,
    });
    localStorage.setItem(hangoutKey, JSON.stringify(filtered));
  } else {
  }
}
export function removeTargetUnreads({ dispatch, username, hangout }) {
  const { target } = hangout;
  const hangoutKey = `${username}-unread-hangouts`;

  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  if (localHangouts && localHangouts.length > 0) {
    let filtered = localHangouts.filter((f) => f.target !== target);

    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: filtered,
    });
    localStorage.setItem(hangoutKey, JSON.stringify(filtered));
  } else {
  }
}
export function loadMessages({ hangout, username, dispatch }) {
  const { target } = hangout;
  const messageKey = `${username}-${target}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  if (messages && messages.length > 0) {
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages });
  } else {
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: [] });
  }
}

export function saveHangouts({ hangouts, username }) {
  localStorage.setItem(`${username}-hangouts`, JSON.stringify(hangouts));
}

export function loadHangouts({ username, dispatch }) {
  const hangoutKey = `${username}-hangouts`;

  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  if (localHangouts && localHangouts.length > 0) {
    dispatch({ type: actionTypes.LOADED_HANGOUTS, hangouts: localHangouts });
  } else {
    dispatch({ type: actionTypes.LOADED_HANGOUTS, hangouts: [] });
  }
}
