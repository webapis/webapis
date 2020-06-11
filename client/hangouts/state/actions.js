import { actionTypes } from './actionTypes';
import { reducerUnreadhangouts } from './reduceUnreadhangouts'
//retrieves hangouts from localStorage
export function loadHangouts({ username, dispatch }) {
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));
  dispatch({ type: actionTypes.LOAD_HANGOUTS, hangouts });
}
//select hangout from List
export function selectHangout({ dispatch, username }) {
  dispatch({ type: actionTypes.SELECTED_HANGOUT, username });
}

export function selectUser({ dispatch, user, username }) {
  // save selected user to hangouts
  const hangout = { ...user, state: 'INVITE' };
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));

  if (hangouts) {
    localStorage.setItem(
      `${username}-hangouts`,
      JSON.stringify([...hangouts, hangout])
    );
  } else {
    localStorage.setItem(`${username}-hangouts`, JSON.stringify([hangout]));
  }

  dispatch({ type: actionTypes.SELECTED_USER, hangout });
}
//search for hangout by typing into TextInput
export function searchHangouts({ search, dispatch }) {
  dispatch({ type: actionTypes.SEARCHED_HANGOUT, search });
}
//filter hangout after search state change
export function filterHangouts({ dispatch }) {
  dispatch({ type: actionTypes.FILTER_HANGOUTS });
}

//fetch hangout from server if not found in local hangouts
export async function fetchHangout({ search, dispatch, username }) {
  try {
    dispatch({ type: actionTypes.FETCH_HANGOUT_STARTED });
    const response = await fetch(
      `/hangouts/find?search=${search}&username=${username}`
    );
    if (response.ok) {
      const { hangouts } = await response.json();
      dispatch({ type: actionTypes.FETCH_HANGOUT_SUCCESS, hangouts });
    }
  } catch (error) {
    const err = error;
    dispatch({ type: actionTypes.FETCH_HANGOUT_FAILED, error });
  }
}

export function changeMessageText({ text, dispatch }) {
  dispatch({ type: actionTypes.MESSAGE_TEXT_CHANGED, text });
}

export function startClientCommand({ dispatch }) {
  dispatch({ type: actionTypes.CLIENT_COMMAND_STARTED });
}

export function loadMessages({ hangout, dispatch }) {
  const { username } = hangout;
  const key = `${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));
  dispatch({ type: actionTypes.LOADED_MESSAGES, messages });
}

export function saveMessage({ dispatch, message }) {
  const { target } = message;
  const key = `${target}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));
  if (messages) {
    localStorage.setItem(key, JSON.stringify([...messages, message]));
  } else {
    localStorage.setItem(key, JSON.stringify([message]));
  }
  dispatch({ type: actionTypes.SAVED_MESSAGE_LOCALLY, message });
}

export function reduceUnread({ unreadhangouts, dispatch }) {
 // dispatch({ type: actionTypes., unreadhangouts: reducerUnreadhangouts({ unreadhangouts }) });
}
