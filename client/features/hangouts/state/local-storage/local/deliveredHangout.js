import { actionTypes } from "../../actionTypes";
export default function updateDeliveredHangout({ hangout, name, dispatch }) {
  const { username, timestamp } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const deliveredHangout = { ...hangout, delivered: true };
  const localHangouts = localStorage.getItem(hangoutKey);

  const hangoutIndex = hangouts.findIndex((g) => g.username === username);
  localHangouts.splice(hangoutIndex, 1, deliveredHangout); ////?
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
  //update message
  const messageKey = `${name}-${username}-messages`;
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  const deliveredMessage = localMessages.find(
    (m) => m.username === username && m.timestamp === timestamp
  );
  if (deliveredMessage) {
    const messageIndex = localMessages.findIndex(
      (g) => g.username === username && m.timestamp === timestamp
    );
    localMessages.splice(messageIndex, 1, {
      ...deliveredMessage,
      delivered: true,
    });
    localStorage.setItem(messageKey, JSON.stringify(localMessages));
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: localMessages });
  }
}
