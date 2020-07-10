import { actionTypes } from "../../actionTypes";
export function removeHangoutFromUnread({ name, hangout, dispatch }) {
  const { username } = hangout;
  let unreadhangoutsKey = `${name}-unread-hangouts`;
  let unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutsKey));

  const filteredHangouts = unreadhangouts.filter(function (unread) {
    return unread.username !== username;
  });

  if (filteredHangouts.length > 0) {
    localStorage.setItem(unreadhangoutsKey, JSON.stringify(filteredHangouts));
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: filteredHangouts,
    });
  } else {
    localStorage.removeItem(unreadhangoutsKey);
    dispatch({
      type: actionTypes.UNREAD_HANGOUTS_UPDATED,
      unreadhangouts: [],
    });
  }
}
