import { actionTypes } from '../../actionTypes';
export function updateReadHangouts({ dispatch, hangout, name }) {
  const { username, message } = hangout;
  let unreadhangoutsKey = `${name}-unread-hangouts`;
  let unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutsKey));

  // remove hangout from unread
if(false){
  debugger;
    const filteredHangouts = unreadhangouts.filter(function(unread)  {
      return  unread.username !== username});
   
      if(filteredHangouts.length>0){
        debugger;
        localStorage.setItem(unreadhangoutsKey, JSON.stringify(filteredHangouts));
        dispatch({
          type: actionTypes.UNREAD_HANGOUTS_UPDATED,
          unreadhangouts: filteredHangouts,
        });
      }

      else{
        debugger;
        localStorage.removeItem(unreadhangoutsKey);
        dispatch({
            type: actionTypes.UNREAD_HANGOUTS_UPDATED,
            unreadhangouts: [],
          });
          debugger;
       
        
      }
     
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
