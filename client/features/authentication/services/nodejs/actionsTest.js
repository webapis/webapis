// import actionTypes from "../../state/actionTypes";
// import serverValidation from "../../validation/serverErrorActions";
// import {
//   generateBrowserId,
//   saveBrowserIdToLocalStorage,
//   browserIdExists,
//   loadBrowserId,
// } from "../../state/onBrowserId";

export async function signup({
  email,
  password,
  username,
  started,
  success,
  failed,
  browserId,
}) {
  try {
    started();
    //const { email, password, username } = state;
    // const browserId = loadBrowserId();

    const response = await fetch(`/auth/signup`, {
      body: JSON.stringify({
        password,
        email,
        username,
        browserId, //: loadBrowserId(),
      }),
      headers: {
        ContentType: "application/json",
        Accept: "application/json",
      },
      method: "POST",
    });

    const result = await response.json();
    //if (response.status === 200) {
    const { token, username, email } = result;
    success({ token, username, email });
    //   dispatch({
    //     type: actionTypes.SIGNUP_SUCCESS,
    //     user: { token, username, email },
    //   });

    //   window.localStorage.setItem(
    //     "webcom",
    //     JSON.stringify({
    //       token,
    //       username,
    //       email,
    //     })
    //   );
    //   if (browserIdExists()) {
    //     dispatch({
    //       type: actionTypes.BROWSER_ID_LOADED,
    //       browserId: loadBrowserId(),
    //     });
    //   } else {
    //     const { browserId } = result;

    //     saveBrowserIdToLocalStorage({ browserId });
    //     dispatch({
    //       type: actionTypes.BROWSER_ID_LOADED,
    //       browserId,
    //     });
    //   }
    // } else if (response.status === 400) {
    //   const { errors } = result;

    //   errors.forEach((error) => {
    //     serverValidation({ status: error, dispatch });
    //   });
    //   dispatch({ type: actionTypes.SIGNUP_FAILED });
    // } else if (response.status === 500) {
    //   const { error } = result;

    //   dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
    //   dispatch({ type: actionTypes.SIGNUP_FAILED });
    // }
  } catch (error) {
    const err = error;
    failed({ error });
    // dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
    // dispatch({ type: actionTypes.SIGNUP_FAILED });
  }
}
