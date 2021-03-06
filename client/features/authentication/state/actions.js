import actionTypes from "./actionTypes";

export function logout() {
  window.localStorage.removeItem("webcom");
  return { type: actionTypes.LOGOUT_SUCCESS };
}

export function getTokenFromUrl({ token }) {
  return {
    type: actionTypes.GOT_TOKEN_FROM_URL,
    token,
  };
}

export function recoverLocalAuthState({ user, dispatch }) {
  dispatch({ type: actionTypes.RECOVER_LOCAL_AUTH_STATE, user });
}
