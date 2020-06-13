import { actionTypes } from '../../actionTypes';
export function updateDeliveredHangout({ name, dispatch, hangout, offline }) {
  const { username, message, timestamp } = hangout;
  const deliveredHangout = { ...hangout, delivered: true };
  const hangoutKey = `${name}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = hangouts.findIndex((g) => g.username === username);
  const updatedHangouts = null;
  updatedHangouts = hangouts.splice(hangoutIndex, 1, deliveredHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: updatedHangouts });

  if (message) {
    updateDeliveredMessage({ dispatch, name, deliveredHangout });
  }

  if (offline) {
    //remove offline hangout
    const offlineHangoutKey = `${name}-offline-hangouts`;
    const offlinehangouts = JSON.parse(localStorage.getItem(offlineHangoutKey));

    if (offlinehangouts) {
      const hangoutIndex = offlinehangouts.findIndex(
        (o) => o.timestamp === timestamp
      );
      localStorage.setItem(
        offlineHangoutKey,
        JSON.stringify(offlinehangouts.splice(hangoutIndex, 1))
      );
    }
  }
}

export function updateDeliveredMessage({ dispatch, name, deliveredHangout }) {
  const { username, message } = deliveredHangout;
  // save message to localStorage
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const hangoutIndex = messages.findIndex(
    (m) => m.timestamp === message.timestamp
  );
  const updatedMessages = messages.splice(hangoutIndex, 1, deliveredHangout);

  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
}
