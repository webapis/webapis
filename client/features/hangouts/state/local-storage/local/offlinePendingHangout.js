import { actionTypes } from "../../actionTypes";

export default function savePendingOfflineHangout({ hangout, name }) {
  const hangoutKey = `${name}-offline-hangouts`;
  const offlineHangout = { ...hangout, offline: true };
  const localHangouts = localStorage.getItem(hangoutKey);
  if (localHangouts.length > 0) {
    localStorage.setItem(
      hangoutKey,
      JSON.stringify([...localHangouts, offlineHangout])
    );
  } else {
    localStorage.setItem(hangoutKey, JSON.stringify([offlineHangout]));
  }
}

export function sendPendingOfflineHanouts({ name, dispatch }) {
  const hangoutKey = `${name}-offline-hangouts`;
  const pendingHangouts = localStorage.getItem(hangoutKey);
  dispatch({ type: actionTypes.PENDING_OFFLINE_HANGOUTS, pendingHangouts });
}

export function removePendingOfflineHangout({ hangout }) {
  const { username } = hangout;
  const hangoutKey = `${name}-offline-hangouts`;
  const pendingHangouts = localStorage.getItem(hangoutKey);
  const hangoutIndex = pendingHangouts.findIndex(
    (g) => g.username === username
  );
  pendingHangouts.splice(hangoutIndex, 0); ////?????????????
  localStorage.setItem(hangoutKey, JSON.stringify(pendingHangouts));
}
