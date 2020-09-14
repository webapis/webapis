import { actionTypes } from "./actionTypes";
//retrieves hangouts from localStorage
export function loadHangouts({ username, dispatch }) {
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));
  dispatch({ type: actionTypes.LOAD_HANGOUTS, hangouts });
}
//select hangout from List
export function selectHangout({ dispatch, hangout }) {
  dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
}

export function resetHangout({ dispatch }) {
  dispatch({ type: actionTypes.CLEARED_HANGOUT });
}

export function selectUnread({ dispatch, hangout }) {
  dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
}

//search for hangout by typing into TextInput
// export function searchHangouts({ search, dispatch }) {
//   dispatch({ type: actionTypes.SEARCHED_HANGOUT, search });
// }
//filter hangout after search state change
export function filterHangouts({ dispatch }) {
  dispatch({ type: actionTypes.FILTER_HANGOUTS });
}

//fetch hangout from server if not found in local hangouts
export async function fetchHangout({ search, dispatch, username }) {
  try {
    dispatch({ type: actionTypes.FETCH_HANGOUT_STARTED });
    const response = await fetch(
      `/authed-msg/hangouts/find?search=${search}&username=${username}`
    );
    if (response.ok) {
      const { hangouts } = await response.json();

      dispatch({ type: actionTypes.FETCH_HANGOUT_SUCCESS, hangouts });
    }
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_HANGOUT_FAILED, error });
  }
}
export async function searchHangouts({ search, dispatch, username }) {
  try {
    const response = await fetch(
      `/authed-msg/hangouts/findOne?search=${search}&username=${username}`
    );
    if (response.ok) {
      const { hangouts } = await response.json();
      //3.
      const userNotFound = hangouts.length === 0 ? true : false;

      dispatch({
        type: actionTypes.SEARCH_HANGOUT_SUCCESS,
        hangouts,
        userNotFound,
      });
    }
  } catch (error) {
    dispatch({ type: actionTypes.SEARCH_HANGOUT_FAILED, error });
  }
}

export async function findHangouts({ dispatch, username }) {
  try {
    const response = await fetch(
      `/authed-msg/hangouts/findHangouts?username=${username}`
    );
    if (response.ok) {
      const { hangouts } = await response.json();

      if (hangouts.length > 0) {
        saveHangouts({ hangouts, username });
      }

      dispatch({ type: actionTypes.FETCH_HANGOUTS_SUCCESS, hangouts });
    }
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_HANGOUTS_FAILED, error });
  }
}

export async function InviteAsGuest({
  from,
  to,
  subject,
  text,
  type,
  dispatch,
}) {
  try {
    const response = await fetch(`/googleapis/gmailapi`, {
      method: "post",
      body: JSON.stringify({ from, to, subject, text, type }),
    });
    if (response.ok && response.status === 200) {
      dispatch({ type: actionTypes.INVITE_AS_GUEST_SUCCESS });
    } else {
      const { error } = await response.json();

      dispatch({ type: actionTypes.INVITE_AS_GUEST_FAILED, error });
    }
  } catch (error) {
    dispatch({ type: actionTypes.INVITE_AS_GUEST_FAILED, error });
  }
}
export function changeMessageText({ text, dispatch }) {
  dispatch({ type: actionTypes.MESSAGE_TEXT_CHANGED, text });
}

export function startClientCommand({ dispatch }) {
  dispatch({ type: actionTypes.CLIENT_COMMAND_STARTED });
}

export function loadMessages({ hangout, dispatch, username }) {
  const key = `${username}-${hangout.username}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));
  dispatch({ type: actionTypes.LOADED_MESSAGES, messages });
}

//END saveInviter
