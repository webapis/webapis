import { actionTypes } from './actionTypes';
import { messagesFromServer } from './messageTypes';

//retrieves hangouts from localStorage
export function loadHangouts({ username, dispatch }) {
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));

  dispatch({ type: actionTypes.LOAD_HANGOUTS, hangouts });
}

export function selectHangout({ dispatch, username }) {
  dispatch({ type: actionTypes.SELECTED_HANGOUT, username });
}

export function searchHangouts({ search, dispatch }) {
  dispatch({ type: actionTypes.SEARCHED_HANGOUT, search });
}

export function initWSocket({ url, dispatch }) {
  dispatch({ type: actionTypes.SET_SOCKET, socket: new WebSocket(url) });
}





export function filterHangouts({ dispatch }) {
  dispatch({ type: actionTypes.FILTER_HANGOUTS });
}

export async function fetchHangout({ search, dispatch }) {
    debugger
  try {
    dispatch({ type: actionTypes.FETCH_HANGOUT_STARTED });
    const response = await fetch(`/hangouts/find?search=${search}`);
    const { hangouts } = await response.json();

    if (hangouts.length > 0) {
      dispatch({ type: actionTypes.FETCH_HANGOUT_SUCCESS, hangouts });
    } else {
      dispatch({ type: actionTypes.FETCH_HANGOUT_NOT_FOUND });
      fetchUser({ username, dispatch });
    }
  } catch (error) {
    debugger;
    dispatch({ type: actionTypes.FETCH_HANGOUT_FAILED, error });
  }
}

export async function fetchUser({ username, dispatch }) {
  try {
    dispatch({ type: actionTypes.FETCH_USER_STARTED });
    const response = await fetch(`/users/find?username=${username}`);
    const { users } = await response.json();
    dispatch({ type: actionTypes.FETCH_USER_SUCCESS, users });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_USER_FAILED, error });
  }
}


