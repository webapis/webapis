export default function removeUnreadHangout({ hangout, dispatch, name }) {
  const { username, timestamp } = hangout;
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = localHangouts.findIndex(
    (f) => f.username === username && f.timestamp === timestamp
  );
  localHangouts.splice(hangoutIndex, 1);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({
    type: actionTypes.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: localHangouts,
  });
}
