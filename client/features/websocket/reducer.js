import actionTypes from "./actionTypes";
export const initState = {
  message: null,
  websocket: null,
  connectionState: null,
  error: null,
};

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SOCKET_ERROR:
      return { ...state, error: action.error };
    case actionTypes.CONNECTION_STATE_CHANGED:
      return { ...state, connectionState: action.connectionState };
    case actionTypes.MESSAGE_RECIEVED:
      return { ...state, message: action.message };
    case actionTypes.WEBSOCKET_INITIALIZED:
      return { ...state, websocket: action.websocket };
    default:
      return state;
  }
}