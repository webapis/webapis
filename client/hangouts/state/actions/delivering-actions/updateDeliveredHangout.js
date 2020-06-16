import { actionTypes } from '../../actionTypes';
export function updateDeliveredHangout({ name, dispatch, hangout, offline, onAppRoute }) {
  const { username, message, timestamp } = hangout;

  const deliveredHangout = { ...hangout, delivered: true };
  const hangoutKey = `${name}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = hangouts.findIndex((g) => g.username === username);
  let updatedHangouts = null;
  updatedHangouts = hangouts.splice(hangoutIndex, 1, deliveredHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: updatedHangouts });
  dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: deliveredHangout });
  if (message) {

    updateDeliveredMessage({ dispatch, name, deliveredHangout,hangout });
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

  if (hangout.state !== 'MESSANGER') {
    onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' });
  }
}

export function updateDeliveredMessage({ dispatch, name, deliveredHangout }) {
  const { username, message } = deliveredHangout;
 
  const deliveredMessage = { ...message, username: name, delivered: true }
  const blockedMessage = { timestamp: message.timestamp, text: 'blocke by you', username: name, type: 'blocked' }
  // save message to localStorage
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const hangoutIndex = messages.findIndex(
    (m) => m.timestamp === message.timestamp
  );
  messages.splice(hangoutIndex, 1, deliveredMessage);
  if(deliveredHangout.state==='BLOCKED'){
    debugger;
    messages.splice(hangoutIndex, 0, blockedMessage)
  }

  localStorage.setItem(messageKey, JSON.stringify(messages));

  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages });
}
