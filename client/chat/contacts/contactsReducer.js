import actionTypes from './actionTypes';
export const initState = {
  loading: false,
  contacts: [],
  error: null,
};
export function contactReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_CONTACTS_SUCCESS:
      return { ...state, loading: false, contacts: action.contacts };
    case actionTypes.FETCH_CONTACTS_FAILED:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}
