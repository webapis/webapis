import actionTypes from "./actionTypes";
export const initState = {
  message: null,
  websocket: null,
};

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.WEBSOCKET_INITIALIZED:
      return { ...state, websocket: action.websocket };
    default:
      return state;
  }
}
