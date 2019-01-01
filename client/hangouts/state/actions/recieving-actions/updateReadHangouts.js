import { actionTypes } from '../../actionTypes';
export function updateReadHangouts({ dispatch, name, hangout }) {
  const { username, message } = hangout;


  // set read to true on unread hangouts
  let unreadhangoutsKey = `${name}-unread-hangouts`;
  const unreadhangouts =JSON.parse( localStorage.getItem(unreadhangoutsKey))
  if(unreadhangouts){
  //  const updatedunread = unreadhangouts.map(u=>u.timestamp===timestamp && u.username===username)
  }

  // set hangout to read
  const hangoutKey = `${name}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = hangouts.findIndex((g) => g.username === username);
  hangouts.splice(hangoutIndex, 1, { ...hangout, read: true });
  //
  localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts });
  
  if (message) {
   // updateReadMesssages({ dispatch, hangout, name });
  }
}

export function updateReadMesssages({ hangout, name, dispatch }) {
  const { username } = hangout;
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const updatedMessages = messages.map((m) => {
    return { ...m, read: true };
  });
  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
  dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
}
