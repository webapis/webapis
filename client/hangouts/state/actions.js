import {actionTypes}from './actionTypes'

export async function fetchHangouts({ dispatch, username }) {
    try {
      dispatch({ type: actionTypes.FETCH_HANGOUTS_STARTED });
      const response = await fetch(`/hangouts/find?username=${username}`);
      const { contacts } = await response.json();
  
      dispatch({ type: actionTypes.FETCH_HANGOUTS_SUCCESS, contacts });
    } catch (error) {
      dispatch({ type: actionTypes.FETCH_HANGOUTS_FAILED, error });
    }
  }
  export async function fetchUsers({ dispatch, filter }) {
    try {
      dispatch({ type: actionTypes.FETCH_USERS_STARTED });
      const response = await fetch(`/users/find?filter=${filter}`);
      const { users } = await response.json();
  
      dispatch({ type: actionTypes.FETCH_USERS_SUCCESS, users });
    } catch (error) {
      dispatch({ type: actionTypes.FETCH_USERS_FAILED, error });
    }
  }

  
  export function findHangouts({ dispatch, filter }) {
    dispatch({ type: actionTypes.FIND_HANGOUTS, filter });
  }