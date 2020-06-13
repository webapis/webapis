import { updateDeliveredHangout } from './updateDeliveredHangout';

export function saveMessaged({ dispatch, hangout, name, offline }) {
  updateDeliveredHangout({ dispatch, name, hangout, offline });
}
export function saveInvited({ dispatch, hangout, name, offline }) {
  updateDeliveredHangout({ dispatch, name, hangout, offline });
}
export function saveAccepted({ dispatch, hangout, name, offline }) {
  updateDeliveredHangout({ dispatch, name, hangout, offline });
}
export function saveDeclined({ dispatch, hangout, name, offline }) {
  updateDeliveredHangout({ dispatch, name, hangout, offline });
}
export function saveBlocked({ dispatch, hangout, name, offline }) {
  updateDeliveredHangout({ dispatch, name, hangout, offline });
}
export function saveUnblovked({ dispatch, hangout, name, offline }) {
  updateDeliveredHangout({ dispatch, name, hangout, offline });
}
