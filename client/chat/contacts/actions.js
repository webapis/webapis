import actionTypes from './actionTypes';
export async function fetchContacts({ dispatch }) {
  try {
    dispatch({ type: actionTypes.FETCH_CONTACTS_STARTED });
    const response = await fetch('http://localhost:3000/contacts/find');

    const {contacts} = await response.json();

    dispatch({ type: actionTypes.FETCH_CONTACTS_SUCCESS, contacts });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_CONTACTS_FAILED, error });
  }
}
