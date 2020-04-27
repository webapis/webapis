import actionTypes from './actionTypes';
import { serverValidation } from '../form/actions';
import httpStatus from '../form/http-status';
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
      dispatch({ type: actionTypes.LOGIN_SUCCESS, token: result.token });
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
      dispatch({ type: actionTypes.SIGNUP_SUCCESS, token: result.token });
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
      throw new Error('Signup failed');
    }
  } catch (error) {
    dispatch({ type: actionTypes.SIGNUP_FAILED, payload: { error } });
  }
}
export async function logout({ dispatch, state }) {
  try {
    const { token } = state;
    const response = await fetch(
      `/auth/logout?${new URLSearchParams({
        token,
      })}`
    );
    dispatch({ type: actionTypes.LOGOUT_STARTED });
  } catch (error) {
    dispatch({ type: actionTypes.LOGOUT_FAILED, error });
  }
}
export async function changePassword({ dispatch, state, formDispatch }) {
  dispatch({ type: actionTypes.CHANGE_PASSWORD_STARTED });
  try {
    const { confirm, password, token, emailorusername, current } = state;
    const response = await fetch(
      `/auth/changepass`,
      {
        method: 'put',
        body: JSON.stringify({
          confirm,
          password,
          current,
          token,
          emailorusername,
        }),
      }
    );

    const result = await response.json();
    if (response.status === 200) {
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_SUCCESS,
        token: result.token,
      });
    } else if (response.status === 400) {
      const { errors } = result;
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
  try {
    dispatch({ type: actionTypes.REQUEST_PASS_CHANGE_STARTED });
    const { email } = state;
    const response = await fetch(
      `/auth/requestpasschange`,
      {
        method: 'post',
        body: JSON.stringify({ email }),
      }
    );
    const result = await response.json();
    if (response.status === 200) {
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_SUCCESS,
        token: result.token,
      });
    } else if (response.status === 400) {
      const { errors } = result;
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
      type: actionTypes.REQUEST_PASS_CHANGE_FAILED,
      payload: { error: err },
    });
  }
}

export function getTokenFromUrl({ token }) {
  return {
    type: actionTypes.GOT_TOKEN_FROM_URL,
    token,
  };
}
