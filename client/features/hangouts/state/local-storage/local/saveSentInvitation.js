import { actionTypes } from "../../actionTypes";
export default function saveSentInvitation({ hangout, dispatch, name }) {
  const { message, username } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const localHangouts = localStorage.getItem(hangoutKey);
  const inviteHangout = { ...hangout, dState: "pending" };

  if (localHangouts && localHangouts.length > 0) {
    localStorage.setItem(
      hangoutKey,
      JSON.stringify([...localHangouts, inviteHangout])
    );
    dispatch({
      type: actionTypes.HANGOUTS_UPDATED,
      hangouts: [...localHangouts, inviteHangout],
    });
    dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: inviteHangout });
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([inviteHangout]));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: [inviteHangout] });
    dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: inviteHangout });
  }
  if (message) {
    const messageKey = `${name}-${username}-messages`;
    const InvitationMessage = { ...message, username, state: "pending" };
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [InvitationMessage],
    });
    localStorage.setItem(messageKey, JSON.stringify([InvitationMessage]));
  }
}

export function updateDeliveredInvitation({
  dispatch,
  name,
  hangout,
  onAppRoute,
}) {
  const { username, message } = hangout;

  const hangoutKey = `${name}-hangouts`;
  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const invitedHangout = { ...hangout, dState: "delivered" };
  const hangoutIndex = localHangouts.findIndex((l) => l.username === username);
  localHangouts.splice(hangoutIndex, 1, invitedHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));

  dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
  dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: invitedHangout });
  onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });

  // update invitation

  const messageKey = `${name}-${username}-messages`;
  const deliveredMessage = { ...message, username, state: "delivered" };
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const messageIndex = localMessages.findIndex(
    (l) => l.timestamp === message.timestamp
  );
  localMessages.splice(messageIndex, 1, deliveredMessage);
  localStorage.setItem(messageKey, JSON.stringify(localMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: localMessages });
}
