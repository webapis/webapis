import { actionTypes } from "../../actionTypes";

export function savePendingOnlineHangout({ hangout, name, dispatch }) {
  const { username, timestamp, message } = hangout;
  const hangoutKey = `${name}-hangouts`;
  const localHangouts = localStorage.getItem(hangoutKey);
  //  localHangouts.length===0
  if (localHangouts.length === 0) {
    addNewHangoutToLocalStorage({ name, hangout, dispatch });
    if (message) {
      saveMessageToLocalStorage({ message, name, dispatch });
    }
  }
  //  localHangouts.length>0
  else if (localHangouts.length > 0) {
    const prevHangout = hangouts.find((g) => g.username === username);
    // hangout exist
    if (prevHangout) {
      // TIMESTAMP is greater than
      if (prevHangout.timestamp < timestamp) {
        //update hangout
        updateHangoutToLocalStorage({ name, hangout, localHangouts, dispatch });
        //save message
        if (message) {
          saveMessageToLocalStorage({ message, name, dispatch });
        }
      }
      // TIMESTAMP is less than
      else if (preHangout.timestamp > timestamp) {
        //save only message
        if (message) {
          saveMessageToLocalStorage({ message, name, dispatch });
        }
      }
    }
    // hangout not exist
    else {
      addNewHangoutToLocalStorage({ name, hangout, dispatch });
      if (message) {
        saveMessageToLocalStorage({ message, name, dispatch });
      }
    }
  }
}

function saveMessageToLocalStorage({ message, name, dispatch }) {
  const { username } = message;
  const messageKey = `${name}-${username}-messages`;
  const pendingMessage = { ...message, state: "pending" };
  const localMessages = JSON.parse(localStorage.getItem(messageKey));
  if (localMessages.length > 0) {
    localStorage.setItem(
      messageKey,
      JSON.stringify([...localMessages, pendingMessage])
    );
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [...localMessages, pendingMessage],
    });
  } else if (localMessages.length === 0) {
    dispatch({
      type: actionTypes.MESSAGES_UPDATED,
      messages: [pendingMessage],
    });
    localStorage.setItem(messageKey, JSON.stringify([pendingMessage]));
  }
}

function updateHangoutToLocalStorage({
  name,
  hangout,
  dispatch,
  localHangouts,
}) {
  const hangoutKey = `${name}-hangouts`;
  const pendingHangout = { ...hangout, dState: "pending" };
  const hangoutIndex = hangouts.findIndex((g) => g.username === username);
  localHangouts.splice(hangoutIndex, 1, pendingHangout);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: localHangouts });
  dispatch({
    type: actionTypes.SENDING_HANGOUT_STARTED,
    pendingHangout: hangout,
  });
}

function addNewHangoutToLocalStorage({ name, hangout, dispatch }) {
  const hangoutKey = `${name}-hangouts`;
  const pendingHangout = { ...hangout, dState: "pending" };
  localStorage.setItem(hangoutKey, JSON.stringify([pendingHangout]));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: [pendingHangout] });
  dispatch({
    type: actionTypes.SENDING_HANGOUT_STARTED,
    pendingHangout: pendingHangout,
  });
}
