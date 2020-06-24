import actionTypes from '../actionTypes';
import { serverValidation } from '../../form/actions';
import httpStatus from '../../form/http-status';
export function valueChanged({ propName, value }) {

  return {
    type: actionTypes.VALUE_CHANGED,
    payload: {
      propName,
      value,
    },
  };
}

export async function login({ dispatch, state, formDispatch }) {
  try {
    const { emailorusername, password } = state;
    dispatch({ type: actionTypes.LOGIN_STARTED });
    const response = await fetch(`/auth/login`, {
      headers: {
        'Conten-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`,
      },
      method: 'GET',
    });

    const result = await response.json();

    if (response.status === 200) {
 
      const { token, username, email } = result;

      dispatch({ type: actionTypes.LOGIN_SUCCESS, token, username, email });
      window.localStorage.setItem(
        'webcom',
        JSON.stringify({
          token,
          username,
          email,
        })
      );
    } else if (response.status === 400) {
      const { errors } = result;
     
      errors.forEach((error) => {
        formDispatch(
          serverValidation({
            status: error,
          })
        );
      });
    } else {
   
      throw new Error('Login failed');
    }
  } catch (error) {
    debugger;
    dispatch({ type: actionTypes.LOGIN_FAILED, payload: { error } });
  }
}

export async function signup({ dispatch, formDispatch, state }) {
  dispatch({ type: actionTypes.SIGNUP_STARTED });
  const { email, password, username } = state;
  try {
    const response = await fetch(`/auth/signup`, {
      body: JSON.stringify({ password, email, username }),
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
    });
    const result = await response.json();
    if (response.status === 200) {
      const { token, username, email } = result;

      dispatch({ type: actionTypes.SIGNUP_SUCCESS, token, username, email });

      window.localStorage.setItem(
        'webcom',
        JSON.stringify({
          token,
          username,
          email,
        })
      );
    } else if (response.status === 400) {
      debugger;
      const { errors } = result;
      errors.forEach((error) => {
        formDispatch(
          serverValidation({
            status: error,
          })
        );
      });
    } else {
      throw new Error('Signup failed');
    }
  } catch (error) {
    const err = error;
    debugger;
    dispatch({ type: actionTypes.SIGNUP_FAILED, payload: { error } });
  }
}

export async function changePassword({ dispatch, state, formDispatch }) {
  dispatch({ type: actionTypes.CHANGE_PASSWORD_STARTED });
  try {
    const { confirm, password,token } = state;
    debugger;
    const response = await fetch(`/auth/changepass`, {
      method: 'put',
      body: JSON.stringify({
        confirm,
        password,
        token,
      }),
    });

    const result = await response.json();
    if (response.status === 200) {
      const { token, username, email } = result;
      debugger;
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_SUCCESS,
        token,
        username,
        email,
        message: `Password changed successfully.`,
      });

      window.localStorage.setItem(
        'webcom',
        JSON.stringify({
          token,
          username,
          email,
        })
      );
    } else if (response.status === 400) {
      const { errors } = result;
      debugger;
      errors.forEach((error) => {
        formDispatch(
          serverValidation({
            status: error,
          })
        );
      });
    } else if (response.status === 500) {
      const { error } = result;

      dispatch({
        type: actionTypes.CHANGE_PASSWORD_FAILED,
        error,
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    dispatch({
      type: actionTypes.CHANGE_PASSWORD_FAILED,
      payload: { error },
    });
  }
}

export async function forgotPassword({ dispatch, state, formDispatch }) {
  debugger;
  try {
    dispatch({ type: actionTypes.REQUEST_PASS_CHANGE_STARTED });
    const { email } = state;
    const response = await fetch(`/auth/requestpasschange`, {
      method: 'post',
      body: JSON.stringify({ email }),
    });
    debugger;

    if (response.status === 200) {
      const result = await response.json();
      debugger;
      dispatch({
        type: actionTypes.REQUEST_PASS_CHANGE_SUCCESS,
        token: result.token,
        message: `A link for password change  has been sent to, ${email}! `,
      });
    } else if (response.status === 400) {
      const result = await response.json();
      debugger;
      const { errors } = result;
      errors.forEach((error) => {
        formDispatch(
          serverValidation({
            status: error,
          })
        );
      });
    } else if (response.status === 500) {
      const result = await response.json();
      debugger;
      const { error } = result;
      debugger;
      dispatch({
        type: actionTypes.REQUEST_PASS_CHANGE_FAILED,
        error,
      });
    } else {
      throw new Error('Changing password failed');
    }
  } catch (error) {
    const err = error;
    debugger;
    dispatch({
      type: actionTypes.REQUEST_PASS_CHANGE_FAILED,
      payload: { error },
    });
  }
}




