//fetch hangout from server if not found in local hangouts
import { actionTypes } from "../../state/actionTypes";
import { saveHangouts } from "../../state/local-storage/common";
export async function searchHangouts({ search, dispatch, username }) {
  try {
    const response = await fetch(
      `/hangouts/findOne?search=${search}&username=${username}`
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
    const response = await fetch(`/hangouts/findHangouts?username=${username}`);
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
    debugger;
    const response = await fetch(`/googleapis/gmailapi`, {
      method: "post",
      body: JSON.stringify({ from, to, subject, text, type }),
    });
    if (response.ok && response.status === 200) {
      dispatch({ type: actionTypes.INVITE_AS_GUEST_SUCCESS });
    } else {
      debugger;
      const { error } = await response.json();

      dispatch({ type: actionTypes.INVITE_AS_GUEST_FAILED, error });
    }
  } catch (error) {
    debugger;
    dispatch({ type: actionTypes.INVITE_AS_GUEST_FAILED, error });
  }
}
