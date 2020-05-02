import actionTypes from './actionTypes';
export const initState = {
  loading: false,
  users: [],
  error: null,
};
export function contactReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_USERS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: action.users };
    case actionTypes.FETCH_USERS_FAILED:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}
