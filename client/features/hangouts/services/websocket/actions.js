//fetch hangout from server if not found in local hangouts
import actionTypes from "./actionTypes";
export async function fetchHangouts({ search, dispatch, username }) {
  try {
    dispatch({ type: actionTypes.FETCH_HANGOUT_STARTED });
    const response = await fetch(
      `/hangouts/find?search=${search}&username=${username}`
    );
    if (response.ok) {
      const { hangouts } = await response.json();
      debugger; //3.
      dispatch({ type: actionTypes.FETCH_HANGOUT_SUCCESS, hangouts });
    }
  } catch (error) {
    const err = error;

    dispatch({ type: actionTypes.FETCH_HANGOUT_FAILED, error });
  }
}

//search for hangout by typing into TextInput
export function searchInput({ search, dispatch }) {
  dispatch({ type: actionTypes.SEARCH_INPUT_CHANGED, search });
}
