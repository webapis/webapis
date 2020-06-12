import { actionTypes } from '../../actionTypes';
export function saveHangout(
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute
) {
  const { username } = hangout;

  const hangoutKey = `${name}-hangouts`;

  const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = hangouts.findIndex((g) => g.username === username);
  const updatedHangouts = null;

  if (focusedHangout.username === username) {
    updatedHangouts = hangouts.splice(hangoutIndex, 1, {
      ...hangout,
      read: true,
    });
    // sync message with reducer state
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
    if (hangout.state !== 'MESSANGER') {
      onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' });
    }
  } else {
    updatedHangouts = hangouts.splice(hangoutIndex, 1, {
      ...hangout,
      read: false,
    });
  }
  localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
  dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: updatedHangouts });
}
