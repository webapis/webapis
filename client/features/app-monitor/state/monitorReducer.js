import actionTypes from "./actionTypes";

export const initState = {
  errors: [],
  loading: false,
  error: null,
};

export default function monitorReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_ERRORS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_ERRORS_SUCCESS:
      debugger;
      return { ...state, loading: false, errors: action.errors };
    case actionTypes.FETCH_ERRORS_FAILED:
      return { ...state, loading: false, error: action.errors };
    default:
      return state;
  }
}
