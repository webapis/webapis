import { actionTypes } from '../../actionTypes';
export function saveRecievedHangout(
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute
) {
  const { username, message } = hangout;
  const hangoutKey = `${name}-hangouts`;

  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = hangouts.findIndex((g) => g.username === username);
  const updatedHangouts = null;
  if (hangouts) {
    if (focusedHangout.username === username) {
      updatedHangouts = hangouts.splice(hangoutIndex, 1, {
        ...hangout,
        read: true,
      });
      // sync message with reducer state
    } else {
      updatedHangouts = hangouts.splice(hangoutIndex, 1, {
        ...hangout,
        read: false,
      });
    }
  } else {
    if (focusedHangout.username === username) {
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
  }
  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: updatedHangouts });
  if (focusedHangout.username === username) {
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
    if (hangout.state !== 'MESSANGER') {
      onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' });
    }
  }
  if (message) {
    saveRecievedMessage({ dispatch, hangout, name });
  }
}

export function saveRecievedMessage({
  dispatch,
  hangout,
  name,
  focusedHangout,
}) {
  const { username, message, state, email } = hangout;

  // save message to localStorage
  const messageKey = `${name}-${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(messageKey));
  const updatedMessages = null;
  if (messages) {
    if (focusedHangout.username === username) {
      updatedMessages = [...messages, { ...message, username, read: true }];
    } else {
      updatedMessages = [...messages, { ...message, username, read: false }];
    }
  } else {
    if (focusedHangout.username === username) {
      updatedMessages = [{ ...message, username, read: true }];
    } else {
      updatedMessages = [{ ...message, username, read: false }];
    }
  }
  localStorage.setItem(messageKey, JSON.stringify(updatedMessages));

  if (focusedHangout.username === username) {
    // sync message with reducer state
    dispatch({ type: actionTypes.MESSAGES_UPDATED, messages: updatedMessages });
  }
}
