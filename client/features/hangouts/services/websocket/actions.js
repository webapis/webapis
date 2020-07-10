//fetch hangout from server if not found in local hangouts
import { actionTypes } from "../../state/actionTypes";
export async function searchHangouts({ search, dispatch, username }) {
  try {
    const response = await fetch(
      `/hangouts/find?search=${search}&username=${username}`
    );
    if (response.ok) {
      const { hangouts } = await response.json();
      //3.
      dispatch({ type: actionTypes.SEARCH_HANGOUT_SUCCESS, hangouts });
    }
  } catch (error) {
    dispatch({ type: actionTypes.SEARCH_HANGOUT_FAILED, error });
  }
}
