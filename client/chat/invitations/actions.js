import actionTypes from './actionTypes';
export async function sendInvitation({ dispatch }) {
  try {
    dispatch({ type: actionTypes.SEND_INVITATION_STARTED });
    const response = await fetch('http://localhost:3000/invitations/', {
      method: 'post',
    });

    dispatch({ type: actionTypes.SEND_INVITATION_SUCCESS });
  } catch (error) {
    dispatch({ type: actionTypes.SEND_INVITATION_FAILED, error });
  }
}
