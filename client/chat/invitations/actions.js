import actionTypes from './actionTypes';
export async function sendInvitation({ dispatch }) {
  try {
    dispatch({ type: actionTypes.SEND_INVITATION_STARTED });
    const response = await fetch('http://localhost:3000/invitations/', {
      method: 'post',
    });

    const { users } = await response.json();

    dispatch({ type: actionTypes.FETCH_USERS_SUCCESS, users });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_USERS_FAILED, error });
  }
}
