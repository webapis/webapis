import actionTypes from './actionTypes';

export const initState = {
  contacts: [],
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
  selectedContact: null,
};

export function contactsReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_USERS_IN_CONTACT_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_USERS_IN_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        contacts: action.contacts,
      };
    case actionTypes.FETCH_USERS_IN_CONTACT_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FETCH_USERS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: action.users };
    case actionTypes.FETCH_USERS_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FETCH_LOCAL_CONTACTS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_LOCAL_CONTACTS_SUCCESS:
      return { ...state, loading: false, contacts: action.contacts };
    case actionTypes.FETCH_LOCAL_CONTACTS_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FIND_LOCAL_CONTACT_STARTED:
      return { ...state, loading: true };
    case actionTypes.FIND_LOCAL_CONTACT_SUCCESS:
      return { ...state, contacts: action.contacts, loading: false };
    case actionTypes.FIND_LOCAL_CONTACT_FAILED:
      return { ...state, error: action.error, loading: false };
    case actionTypes.USER_SELECTED:
      return { ...state, selectedUser: action.userName };
    default:
      return state;
  }
}
