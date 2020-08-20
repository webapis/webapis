import actionTypes from "./actionTypes";
export const initState = {
  socket: null,
  connected: false,
};
export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SOCKET_INITIALIZED:
      return { ...state, socket: action.socket };
    case actionTypes.SOCKET_CONNECTION_CHANGED:
      return { ...state, connected: action.connected };
    case actionTypes.INITIAL_STATE:
      return initState;
    default:
      return state;
  }
}
