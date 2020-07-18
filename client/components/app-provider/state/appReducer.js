import actionTypes from "./actionTypes";
export const initState = {
  error: null,
};
export default function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.APP_ERROR_MESSAGE:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
