import { updateDeliveredHangout } from './updateDeliveredHangout';

export function saveMessaged({ dispatch, hangout, name, offline,onAppRoute }) {

  updateDeliveredHangout({ dispatch, name, hangout, offline,onAppRoute });
}
export function saveInvited({ dispatch, hangout, name, offline,onAppRoute }) {

  updateDeliveredHangout({ dispatch, name, hangout, offline,onAppRoute});
}
export function saveAccepted({ dispatch, hangout, name, offline,onAppRoute }) {

  updateDeliveredHangout({ dispatch, name, hangout, offline,onAppRoute });
}
export function saveDeclined({ dispatch, hangout, name, offline,onAppRoute }) {

  updateDeliveredHangout({ dispatch, name, hangout, offline,onAppRoute });
}
export function saveBlocked({ dispatch, hangout, name, offline,onAppRoute }) {
debugger;
  updateDeliveredHangout({ dispatch, name, hangout, offline,onAppRoute });
}
export function saveUnblovked({ dispatch, hangout, name, offline,onAppRoute }) {

  updateDeliveredHangout({ dispatch, name, hangout, offline,onAppRoute });
}
