import { saveRecievedHangout } from './saveRecievedHangout';
export function saveInviter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {


  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout,  unread });
}

export function saveAccepter({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
 
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout,  unread });
}

export function saveBlocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout,  unread });
}

export function saveDecliner(
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
) {
  
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout,  unread });
}

export function saveMessanger({ dispatch, hangout, name, focusedHangout,onAppRoute,unread }) {
debugger;

  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout,  unread });
} // END saveMessanger

export function saveUnblocker({
  dispatch,
  hangout,
  name,
  focusedHangout,
  onAppRoute,
  unread
}) {
  
  saveRecievedHangout({ dispatch, hangout, name, onAppRoute, focusedHangout,  unread });
}
