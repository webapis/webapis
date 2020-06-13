import { saveRecievedHangout } from './saveRecievedHangout';
export function saveInviter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
}) {
  const { username, message, state, email } = hangout;

  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}

export function saveAccepter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
}) {
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}

export function saveBlocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
}) {
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}

export function saveDecliner(
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute
) {
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}

export function saveMessanger({ dispatch, hangout, name, focusedHangout }) {
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
} // END saveMessanger

export function saveUnblocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
}) {
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}
