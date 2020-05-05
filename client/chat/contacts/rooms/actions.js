import actionTypes from './actionTypes';
export function openRoom({ dispatch, room }) {
  debugger;
  dispatch({ type: actionTypes.OPEN_ROOM, room });
}

export function closeRoom({ dispatch, roomName }) {
  debugger;
  dispatch({ type: actionTypes.CLOSE_ROOM, roomName });
}
