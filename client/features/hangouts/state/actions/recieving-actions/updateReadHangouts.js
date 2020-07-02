import { actionTypes } from '../../actionTypes';
export function updateReadHangouts({ dispatch, name, hangout }) {
  const { username, message } = hangout;

  // set read to true on unread hangouts
  let unreadhangoutsKey = `${name}-unread-hangouts`;
  const unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutsKey));

  if (unreadhangouts&& unreadhangouts.length>0) {
    
    let updatedunread = unreadhangouts.map(u => {
      if (u.username === username) {
        
        return { ...u, read: true };
      } else {
        return u;
      }
    });

    localStorage.setItem(unreadhangoutsKey, JSON.stringify(updatedunread));
dispatch({type:actionTypes.UNREAD_HANGOUTS_UPDATED,unreadhangouts:updatedunread})
    
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
     updateReadMesssages({ dispatch, hangout, name });
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
