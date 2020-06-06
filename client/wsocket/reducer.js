import { actionTypes } from './actionTypes';
export const initState = {
  readyState: 3,
  socket: null,
  error: null,
};
export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SOCKET_ERROR:
      return { ...state, error: action.error };
    case actionTypes.CONNECTING:
      return { ...state, readyState: 0 };
    case actionTypes.OPEN:
      return { ...state, readyState: 1 };
    case actionTypes.CLOSING:
      return { ...state, readyState: 2 };
    case actionTypes.CLOSED:
      return { ...state, readyState: 3 };
    case actionTypes.SOCKET_READY:
      return { ...state, socket: action.socket };
    default:
      return state;
  }
}
