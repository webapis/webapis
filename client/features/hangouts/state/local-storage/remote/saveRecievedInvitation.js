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
}

export function savePendingAccept({ name, dispatch, hangout, onAppRoute }) {
  const { username } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const pendingAccept = { ...hangout, dState: "pending" };
  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = localHangouts.findIndex((f) => f.username === username);
  localHangouts.splice(hangoutIndex, 1, pendingAccept);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
}

export function updateDeliveredAccept({ hangout, dispatch, name, onAppRoute }) {
  const { username } = hangout;
  debugger;
  const hangoutKey = `${name}-hangouts`;
  const deliveredAccept = { ...hangout, dState: "delivered" };
  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = localHangouts.findIndex((f) => f.username === username);
  localHangouts.splice(hangoutIndex, 1, deliveredAccept);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
  onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
}
