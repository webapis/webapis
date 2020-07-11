import { actionTypes } from "../../actionTypes";
export default function saveRecievedInvitation({ dispatch, hangout, name }) {
  const { message, username } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const recievedInvitation = { ...hangout, dState: "unread" };
  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  if (localHangouts && localHangouts.length > 0) {
    localStorage.setItem(
      hangoutKey,
      JSON.stringify([...localHangouts, recievedInvitation])
    );
    dispatch({
      type: actionTypes.HANGOUTS_UPDATED,
      hangouts: [...localHangouts, recievedInvitation],
    });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([recievedInvitation]));
    dispatch({
      type: actionTypes.HANGOUTS_UPDATED,
      hangouts: [recievedInvitation],
    });
  }

  if (message) {
    const messageKey = `${name}-${username}-messages`;
    const recievedMessage = { ...message, username, state: "unread" };
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [recievedMessage],
    });
    localStorage.setItem(messageKey, JSON.stringify([recievedMessage]));
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [recievedMessage],
    });
  }

  saveUnreadInvitation({ dispatch, name, hangout });
}

export function savePendingAccept({ name, dispatch, hangout, onAppRoute }) {
  try {
    const { username } = hangout;
    const hangoutKey = `${name}-hangouts`;
    const pendingAccept = { ...hangout, dState: "pending" };

    let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));

    let hangoutIndex = localHangouts.findIndex((f) => f.username === username);

    localHangouts.splice(hangoutIndex, 1, pendingAccept);

    localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
  } catch (error) {}
}

export function updateDeliveredAccept({ hangout, dispatch, name, onAppRoute }) {
  try {
    const { username } = hangout;

    const hangoutKey = `${name}-hangouts`;
    const deliveredAccept = { ...hangout, dState: "delivered" };
    let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
    let hangoutIndex = localHangouts.findIndex((f) => f.username === username);
    localHangouts.splice(hangoutIndex, 1, deliveredAccept);
    localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
    onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
    removeUnreadInvitation({ hangout, dispatch, name });
  } catch (error) {}
}

export function saveUnreadInvitation({ dispatch, name, hangout }) {
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const unreadInvitation = { ...hangout, dState: "unread" };
  if (localHangouts && localHangouts.length > 0) {
    localStorage.setItem(
      hangoutKey,
      JSON.stringify([...localHangouts, unreadInvitation])
    );
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: [...localHangouts, unreadInvitation],
    });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([unreadInvitation]));
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: [unreadInvitation],
    });
  }
}

export function removeUnreadInvitation({ hangout, dispatch, name }) {
  const { username, timestamp } = hangout;
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
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
