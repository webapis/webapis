import { actionTypes } from "../../actionTypes";
export default function loadHangouts({ name, dispatch }) {
  const hangoutKey = `${name}-hangouts`;
  const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  if (localHangouts && localHangouts.length > 0) {
    dispatch({ type: actionTypes.LOADED_HANGOUTS, hangouts: localHangouts });
  }
}
