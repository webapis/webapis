import { actionTypes } from "../actionTypes";
import { saveSentMessage, updateSentMessage } from "./common";
export default function savePendingInvite({ hangout, dispatch, name }) {
  const { message, username } = hangout;
  const hangoutKey = `${name}-hangouts`;
  let localHangouts = localStorage.getItem(hangoutKey);
  const inviteHangout = { ...hangout };

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
    saveSentMessage({ hangout, dispatch, name, dState: "pending" });
  }
}

export function updateDeliveredInvite({ dispatch, name, hangout, onAppRoute }) {
  const { username, message } = hangout;

  const hangoutKey = `${name}-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const invitedHangout = { ...hangout };
  let hangoutIndex = localHangouts.findIndex((l) => l.username === username);
  localHangouts.splice(hangoutIndex, 1, invitedHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));

  dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
  dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: invitedHangout });
  onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });

  updateSentMessage({ hangout, name, dispatch, dState: "delivered" });
}
