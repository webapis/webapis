import { actionTypes } from "../actionTypes";
import { updateUnread, updateSentMessage, saveSentMessage } from "./common";

export function savePendingAccept({ name, dispatch, hangout }) {
  try {
    const hangoutKey = `${name}-hangouts`;
    const pendingAccept = { ...hangout };

    let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
    if (localHangouts && localHangouts.length > 1) {
      localStorage.setItem(
        hangoutKey,
        JSON.stringify([...localHangouts, pendingAccept])
      );
      dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
    } else {
      localStorage.setItem(hangoutKey, JSON.stringify([pendingAccept]));
      dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
    }
    saveSentMessage({ hangout, dispatch, name, dState: "pending" });
    updateUnread({ hangout, dispatch, name });
  } catch (error) {
    console.error(error);
  }
}

export function updateDeliveredAccept({ hangout, dispatch, name, onAppRoute }) {
  try {
    const { username, message } = hangout;

    const hangoutKey = `${name}-hangouts`;
    const deliveredAccept = { ...hangout };
    let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
    let hangoutIndex = localHangouts.findIndex((f) => f.username === username);
    localHangouts.splice(hangoutIndex, 1, deliveredAccept);
    localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
    updateUnread({ hangout, dispatch, name });
    updateSentMessage({ hangout, name, dispatch, dState: "delivered" });
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
    onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
  } catch (error) {
    console.error(error);
  }
}
