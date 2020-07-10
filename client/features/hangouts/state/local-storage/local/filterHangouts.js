import { actionTypes } from "../../actionTypes";
export default function filterHangouts({ filter, dispatch, name }) {
  const hangoutKey = `${name}-hangouts`;
  const localHangouts = localStorage.getItem(hangoutKey);

  if (localHangouts && localHangouts.length > 0) {
    let filteredHangouts = localHangouts.filter((f) =>
      f.username.includes(filter)
    );
    if (filteredHangouts && filteredHangouts.length > 0) {
      dispatch({
        type: actionTypes.HANGOUTS_UPDATED,
        hangouts: filterHangouts,
      });
    } else {
      dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: [] });
    }
  }
}
