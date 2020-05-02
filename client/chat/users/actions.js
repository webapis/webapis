import actionTypes from './actionTypes';
export async function fetchUsers({ dispatch }) {
  try {
    dispatch({ type: actionTypes.FETCH_USERS_STARTED });
    const response = await fetch('http://localhost:3000/users/find');

    const { users } = await response.json();

    dispatch({ type: actionTypes.FETCH_USERS_SUCCESS, users });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_USERS_FAILED, error });
  }
}
