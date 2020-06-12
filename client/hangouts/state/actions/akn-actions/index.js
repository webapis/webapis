import { actionTypes } from '../../actionTypes';
import { saveAckHangout } from '../akn-actions/saveAckHangout';
import { updateMessage } from './updateMessage';
export function saveMessaged({ dispatch, hangout, name }) {
  updateMessage({ dispatch, name, hangout });
  saveAckHangout({ dispatch, name, hangout });
}
export function saveInvited({ dispatch, hangout, name }) {
  updateMessage({ dispatch, name, hangout });
  saveAckHangout({ dispatch, name, hangout });
}
export function saveAccepted({ dispatch, hangout, name }) {
  saveAckHangout({ dispatch, name, hangout });
}
export function saveDeclined({ dispatch, hangout, name }) {
  saveAckHangout({ dispatch, name, hangout });
}
export function saveBlocked({ dispatch, hangout, name }) {
  saveAckHangout({ dispatch, name, hangout });
}

export function saveUnblovked({ dispatch, hangout, name }) {
  saveAckHangout({ dispatch, name, hangout });
}
