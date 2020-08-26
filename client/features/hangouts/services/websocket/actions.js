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
      debugger;
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
