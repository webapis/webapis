import { actionTypes } from '../../actionTypes';
import {hangoutStates}  from '../../../../../server/hangouts/hangoutStates'
export function saveRecievedHangout({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread,
}) {
  const { username, message } = hangout;
 
  const hangoutKey = `${name}-hangouts`;

  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));

  if (hangouts) {
    const hangoutIndex = hangouts.findIndex((g) => g.username === username);
    if (focusedHangout && focusedHangout.username === username) {
      hangouts.splice(hangoutIndex, 1, {
        ...hangout,
        read: true,
      });
      // sync message with reducer state
    } else {
      hangouts.splice(hangoutIndex, 1, {
        ...hangout,
        read: false,
      });
    }
    localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts });
  } else {
    let updatedHangouts = null;
    if (focusedHangout && focusedHangout.username === username) {
      updatedHangouts = [
        {
          ...hangout,
          read: true,
        },
      ];
    } else {
      updatedHangouts = [
        {
          ...hangout,
          read: false,
        },
      ];
    }
    localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: updatedHangouts });
  }

  if (focusedHangout && focusedHangout.username === username) {
    dispatch({
      type: actionTypes.SELECTED_HANGOUT,
      username: hangout.username,
    });
    if (hangout.state !== 'MESSANGER') {
      onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' });
    }
  }
  if (message) {
    saveRecievedMessage({ dispatch, hangout, name, focusedHangout });
  }

  if (unread) {
    debugger;
    switch(hangout.state){
      case hangoutStates.ACCEPTER:
      case hangoutStates.INVITER:
      case hangoutStates.MESSANGER:
        saveUnreadHangout({ name, hangout,dispatch });
        break;
        default:
          break;
      }

    }
 
}
export function saveRecievedMessage({
  dispatch,
  hangout,
  name,
  focusedHangout,
}) {
  const { username, message } = hangout;

  // save message to localStorage
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  let updatedMessages = null;
  if (messages) {
    if (focusedHangout && focusedHangout.username === username) {
      updatedMessages = [...messages, { ...message, username, read: true }];
    } else {
      updatedMessages = [...messages, { ...message, username, read: false }];
    }
  } else {
    if (focusedHangout && focusedHangout.username === username) {
      updatedMessages = [{ ...message, username, read: true }];
    } else {
      updatedMessages = [{ ...message, username, read: false }];
    }
  }
  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));

  if (focusedHangout && focusedHangout.username === username) {
    // sync message with reducer state
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
  }
}

function saveUnreadHangout({ name, hangout,dispatch }) {
  
  //update unread hangouts
  let unreadhangoutsKey = `${name}-unread-hangouts`;
  let unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutsKey));
  let updatedunreads = null;
  if (unreadhangouts) {
    updatedunreads = [unreadhangouts, hangout];
  } else {
    updatedunreads = [hangout];
  }
  localStorage.setItem(unreadhangoutsKey, JSON.stringify(updatedunreads));

  dispatch({
    type: actionTypes.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: updatedunreads,
  });
}
