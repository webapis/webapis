export async function fetchHangouts({ dispatch, username }) {
    try {
      dispatch({ type: actionTypes.FETCH_CONTACTS_STARTED });
      const response = await fetch(`/contacts/find?username=${username}`);
      const { contacts } = await response.json();
  
      dispatch({ type: actionTypes.FETCH_CONTACTS_SUCCESS, contacts });
    } catch (error) {
      dispatch({ type: actionTypes.FETCH_CONTACTS_FAILED, error });
    }
  }
  
  export function getLocalContacts({ dispatch, contacts }) {
    dispatch({ type: actionTypes.GET_LOCAL_CONTACTS, contacts });
  }
  
  export function findContact({ dispatch, filter }) {
    dispatch({ type: actionTypes.FIND_CONTACT, filter });
  }