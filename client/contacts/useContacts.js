import { useEffect, useReducer } from 'preact/hooks';

const actionTypes = {
  FETCH_CONTACTS_STARTED: 'FETCH_CONTACTS_STARTED',
  FETCH_CONTACTS_SUCCESS: 'FETCH_CONTACTS_SUCCESS',
  FETCH_CONTACTS_FAILED: 'FETCH_CONTACTS_FAILED',
  GET_LOCAL_CONTACTS: 'GET_LOCAL_CONTACTS',
  FIND_CONTACT: 'FIND_CONTACT',
};

async function fetchContacts({ dispatch, username }) {
  try {
    dispatch({ type: actionTypes.FETCH_CONTACTS_STARTED });
    const response = await fetch(`/contacts/find?username=${username}`);
    const { contacts } = await response.json();
    dispatch({ type: actionTypes.FETCH_CONTACTS_SUCCESS, contacts });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_CONTACTS_FAILED, error });
  }
}

function getLocalContacts({ dispatch, contacts }) {
  dispatch({ type: actionTypes.GET_LOCAL_CONTACTS, contacts });
}

function findContact({ dispatch, filter }) {
  dispatch({ type: actionTypes.FIND_CONTACT, filter });
}

const initState = {
  loading: false,
  error: null,
  contacts: [],
};

function contactsReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_CONTACTS_SUCCESS:
      return { ...state, loading: false, contacts: action.contacts };
    case actionTypes.FETCH_CONTACTS_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FIND_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.username === action.filter),
      };
    case actionTypes.GET_LOCAL_CONTACTS:
      const nextState = { ...state, contacts: action.contacts };
     
      return nextState;
    default:
      return state;
  }
}

export function useContacts({ filter, username }) {
  const [state, dispatch] = useReducer(contactsReducer, initState);
  useEffect(() => {
    if (localStorage.getItem(`contacts-${username}`)) {

      const storage = JSON.parse(localStorage.getItem(`contacts-${username}`));
      getLocalContacts({ dispatch, contacts: storage.contacts });
    } else {
      fetchContacts({ dispatch, username });
    }
  }, []);
  useEffect(() => {
    if (filter && filter.length > 3) {
      findContact({ dispatch, filter });
    }
  }, [filter]);

  return { state };
}
