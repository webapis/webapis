import { actionTypes } from '../../actionTypes';
import { saveMessage } from './saveMessage';
import { saveHangout } from './saveHangout';
export function saveInviter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
}) {
  const { username, message, state, email } = hangout;
  saveMessage({ dispatch, hangout, name, focusedHangout });
  saveHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}

export function saveAccepter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
}) {
  saveHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}

export function saveBlocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
}) {
  saveHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}

export function saveDecliner(
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute
) {
  saveHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}

export function saveMessanger({ dispatch, hangout, name, focusedHangout }) {
  saveMessage({ dispatch, hangout, name, focusedHangout });
  saveHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
} // END saveMessanger

export function saveUnblocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
}) {
  saveHangout({ dispatch, hangout, name, onAppRoute, focusedHangout });
}
