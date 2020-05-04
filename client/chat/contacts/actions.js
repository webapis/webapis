import actionTypes from './actionTypes';

export async function fetchUsersInContact({ dispatch }) {
  try {
    dispatch({ type: actionTypes.FETCH_USERS_IN_CONTACT_STARTED });
    const response = await fetch('http://localhost:3000/contacts/find');

    const { contacts } = await response.json();
    localStorage.setItem('contacts', JSON.stringify(contacts));
    dispatch({ type: actionTypes.FETCH_USERS_IN_CONTACT_SUCCESS, contacts });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_USERS_IN_CONTACT_FAILED, error });
  }
}

export async function fetchUsers({ dispatch, filter }) {
  try {
    dispatch({ type: actionTypes.FETCH_USERS_STARTED });
    const response = await fetch(
      `http://localhost:3000/users/find?filter=${filter}`
    );
    const { users } = await response.json();
    debugger;
    dispatch({ type: actionTypes.FETCH_USERS_SUCCESS, users });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_USERS_FAILED, error });
  }
}

export function getLocalContacts({ dispatch }) {
  try {
    dispatch({ type: actionTypes.FETCH_LOCAL_CONTACTS_STARTED });
    const contacts = JSON.parse(localStorage.getItem('contacts'))
      ? JSON.parse(localStorage.getItem('contacts'))
      : [];
    dispatch({ type: actionTypes.FETCH_LOCAL_CONTACTS_SUCCESS, contacts });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_LOCAL_CONTACTS_FAILED, error });
  }
}

export function findLocalContact({ dispatch, filter }) {
  try {
    dispatch({ type: actionTypes.FIND_LOCAL_CONTACT_STARTED });
    const query = JSON.parse(localStorage.getItem('contacts')).filter((c) =>
      c.username.includes(filter)
    );
    const filtered = query ? query : [];
    dispatch({
      type: actionTypes.FIND_LOCAL_CONTACT_SUCCESS,
      contacts: filtered,
    });
  } catch (error) {
    dispatch({ type: actionTypes.FIND_LOCAL_CONTACT_FAILED, error });
  }
}

export function selectUser({ dispatch, userName }) {
  dispatch({
    type: actionTypes.USER_SELECTED,
    userName,
  });
}

export function selectContact({ dispatch, contactName }) {
  dispatch({ type: actionTypes.CONTACT_SELECTED, contactName });
}
