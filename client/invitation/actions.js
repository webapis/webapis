import actionTypes from './actionTypes';

export async function sendInvitation({ dispatch, message, token, target }) {

  try {
    dispatch({ type: actionTypes.SEND_INVITATION_STARTED });
    const response = await fetch('/invitation/insertOne', {
      headers: {
        'Conten-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: `Bearer ${btoa(`${token}`)}`,
      },
      method: 'post',
      body: JSON.stringify({ target, message }),
    });
    const { invation } = await response.json();

    dispatch({ type: actionTypes.SEND_INVITATION_SUCCESS, invation });

  } catch (error) {
 
    dispatch({ type: actionTypes.SEND_INVITATION_FAILED, error });
  }
}

export function valueChanged({ dispatch, value }) {
  dispatch({ type: actionTypes.VALUE_CHANGED, value });
}
///
