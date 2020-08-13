import actionTypes from "../../state/actionTypes";
import serverValidation from "../../validation/serverErrorActions";
import {
  generateBrowserId,
  saveBrowserIdToLocalStorage,
  browserIdExists,
  loadBrowserId,
} from "../../state/onBrowserId";
export async function signup({ dispatch, state }) {
  try {
    debugger;
    const { email, password, username } = state;

    const response = await fetch(`/auth/signup`, {
      body: JSON.stringify({ password, email, username }),
      headers: {
        ContentType: "application/json",
        Accept: "application/json",
      },
      method: "POST",
    });
    const result = await response.json();
    if (response.status === 200) {
      const { token, username, email, browserId } = result;
      debugger;
      dispatch({
        type: actionTypes.SIGNUP_SUCCESS,
        user: { token, username, email, browserId },
      });
      saveBrowserIdToLocalStorage({ username, browserId });
      dispatch({ type: actionTypes.BROWSER_ID_LOADED, browserId });
      window.localStorage.setItem(
        "webcom",
        JSON.stringify({
          token,
          username,
          email,
        })
      );
    } else if (response.status === 400) {
      const { errors } = result;

      errors.forEach((error) => {
        serverValidation({ status: error, dispatch });
      });
      dispatch({ type: actionTypes.SIGNUP_FAILED });
    } else if (response.status === 500) {
      const { error } = result;

      dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
      dispatch({ type: actionTypes.SIGNUP_FAILED });
    }
  } catch (error) {
    const err = error;

    dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
    dispatch({ type: actionTypes.SIGNUP_FAILED });
  }
}

export async function login({ dispatch, state }) {
  try {
    const { emailorusername, password } = state;
    const hasBrowserId = browserIdExists({ username: emailorusername })
      ? true
      : false;

    const response = await fetch(`/auth/login`, {
      headers: {
        "Conten-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization: `Basic ${btoa(`${emailorusername}:${password}`)}`,
      },
      method: "POST",
      body: JSON.stringify({ hasBrowserId }),
    });

    const result = await response.json();

    if (response.status === 200) {
      const { token, username, email } = result;
      if (hasBrowserId) {
        debugger;
        dispatch({
          type: actionTypes.BROWSER_ID_LOADED,
          browserId: loadBrowserId({ username }),
        });
      } else {
        const { browserId } = result;
        debugger;
        saveBrowserIdToLocalStorage({ username, browserId });
        dispatch({
          type: actionTypes.BROWSER_ID_LOADED,
          browserId,
        });
      }

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        user: { token, username, email },
      });
      window.localStorage.setItem(
        "webcom",
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
        serverValidation({ status: error, dispatch });
      });
      dispatch({ type: actionTypes.LOGIN_FAILED });
    } else if (response.status === 500) {
      const { error } = result;
      debugger;
      dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
      dispatch({ type: actionTypes.LOGIN_FAILED });
    }
  } catch (error) {
    const err = error;

    dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
    dispatch({ type: actionTypes.LOGIN_FAILED });
  }
}
export async function changePassword({ dispatch, state }) {
  try {
    const { confirm, password } = state;
    const { token } = state.user;

    const response = await fetch(`/auth/changepass`, {
      method: "put",
      body: JSON.stringify({
        confirm,
        password,
        token,
      }),
    });

    const result = await response.json();
    if (response.status === 200) {
      const { token, username, email } = result;
      if (!browserIdExists({ username })) {
        const browserId = generateBrowserId();
        saveBrowserIdToLocalStorage({ browserId, username });
        dispatch({ type: actionTypes.BROWSER_ID_LOADED, browserId });
      } else {
        dispatch({
          type: actionTypes.BROWSER_ID_LOADED,
          browserId: loadBrowserId({ username }),
        });
      }
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_SUCCESS,
        user: { token, username, email },
      });

      window.localStorage.setItem(
        "webcom",
        JSON.stringify({
          token,
          username,
          email,
        })
      );
    } else if (response.status === 400) {
      const { errors } = result;

      errors.forEach((error) => {
        serverValidation({ status: error, dispatch });
      });
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_FAILED,
      });
    } else if (response.status === 500) {
      const { error } = result;
      dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_FAILED,
      });
    }
  } catch (error) {
    dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
    dispatch({
      type: actionTypes.CHANGE_PASSWORD_FAILED,
    });
  }
}

export async function forgotPassword({ dispatch, state }) {
  try {
    const { email } = state;
    const response = await fetch(`/auth/requestpasschange`, {
      method: "post",
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      const result = await response.json();

      dispatch({
        type: actionTypes.REQUEST_PASS_CHANGE_SUCCESS,
        token: result.token,
      });
    } else if (response.status === 400) {
      const result = await response.json();

      const { errors } = result;
      errors.forEach((error) => {
        serverValidation({ status: error, dispatch });
      });
      dispatch({
        type: actionTypes.REQUEST_PASS_CHANGE_FAILED,
      });
    } else if (response.status === 500) {
      const { error } = result;
      dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
      dispatch({
        type: actionTypes.REQUEST_PASS_CHANGE_FAILED,
      });
    }
  } catch (error) {
    const err = error;

    dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
    dispatch({
      type: actionTypes.REQUEST_PASS_CHANGE_FAILED,
    });
  }
}
