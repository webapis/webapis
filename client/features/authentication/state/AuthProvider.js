import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useReducer,
  useContext,
  useEffect,
  useMemo,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { authReducer, initState } from "./authReducer";
//import AuthAdapter from "./AuthAdapter";
import serverValidation from "../validation/serverErrorActions";

import { useAppRoute } from "components/app-route/index";
import actionTypes from "./actionTypes";
const AuthContext = createContext();
const html = htm.bind(h);
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used with AppProvider");
  }

  const [state, dispatch] = context;

  return {
    state,
    dispatch,
  };
}

export default function AuthProvider(props) {
  const {
    children,
    login,
    signup,
    changepassword,
    requestpasswordchange,
    staticUser,
  } = props;

  const [state, dispatch] = useReducer(authReducer, initState);
  const { onAppRoute } = useAppRoute();
  const {
    user,
    signupStarted,
    username,
    email,
    password,
    emailorusername,
    loginStarted,
    signedout,
  } = state;
  const value = useMemo(() => [state, dispatch], [state]);
  useEffect(() => {
    if (userExist()) {
      loadUserAndBrowserId({ dispatch });
    }
  }, []);
  useEffect(() => {
    if (staticUser) {
      dispatch({ type: actionTypes.LOGIN_SUCCESS, user: staticUser });
    }
  }, [staticUser]);
  useEffect(() => {
    if (signupStarted) {
      handleSignUp({ username, email, password });
    }
  }, [signupStarted]);

  useEffect(() => {
    if (loginStarted) {
      handleLogin({ emailorusername, password });
    }
  }, [loginStarted]);

  // useEffect(() => {
  //   if (user) {
  //
  //     onAppRoute({
  //       appRoute: authedRoute.appRoute,
  //       featureRoute: authedRoute.featureRoute,
  //     });
  //   } else {
  //     onAppRoute({ appRoute: "/auth", featureRoute: "/login" });
  //   }
  // }, [user]);
  function handleLogin({ emailorusername, password }) {
    const browserId = loadBrowserId();
    login({
      emailorusername,
      password,
      browserId,
      success: ({
        token,
        username,
        email,
        inputValErrorCodes,
        ok,
        status,
        serverError,
      }) => {
        if (status === 200) {
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
        } else if (status > 200 && status < 500) {
          inputValErrorCodes.forEach((error) => {
            serverValidation({ status: error, dispatch });
          });
          dispatch({ type: actionTypes.LOGIN_FAILED });
        } else if (status === 500) {
          dispatch({
            type: actionTypes.SERVER_ERROR_RECIEVED,
            error: serverError,
          });
          dispatch({ type: actionTypes.LOGIN_FAILED });
        }
      },
      failed: (error) => {
        dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
        dispatch({ type: actionTypes.LOGIN_FAILED });
      },
    });
  }
  function handleSignUp({ username, email, password }) {
    const browserId = loadBrowserId();
    signup({
      username,
      email,
      password,
      browserId,

      success: ({ token, inputValErrorCodes, ok, status, serverError }) => {
        if (status === 200) {
          dispatch({
            type: actionTypes.SIGNUP_SUCCESS,
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
        } else if (status > 200 && status < 500) {
          //
          inputValErrorCodes.forEach((error) => {
            serverValidation({ status: error, dispatch });
          });
          dispatch({ type: actionTypes.SIGNUP_FAILED });
        } else if (status === 500) {
          dispatch({
            type: actionTypes.SERVER_ERROR_RECIEVED,
            error: serverError,
          });
          dispatch({ type: actionTypes.SIGNUP_FAILED, error: serverError });
        }
      },
      failed: (error) => {
        dispatch({ type: actionTypes.SIGNUP_FAILED, error });
      },
    });
  }
  return html`
    <${AuthContext.Provider} value=${value} ...${props}>
      ${children({ user })}
    <//>
  `;
}

function userExist() {
  if (window.localStorage.getItem("webcom") === null) {
    return false;
  } else {
    return true;
  }
}

function loadUserAndBrowserId({ dispatch }) {
  const { username, token, email, objectId } = JSON.parse(
    window.localStorage.getItem("webcom")
  );
  dispatch({
    type: actionTypes.RECOVER_LOCAL_AUTH_STATE,
    user: { username, token, email, objectId },
  });
  const browserId = loadBrowserId();
  dispatch({ type: actionTypes.BROWSER_ID_LOADED, browserId });
}

export function loadBrowserId() {
  if (localStorage.getItem("browserId")) {
    return localStorage.getItem("browserId");
  } else {
    let browserId = `BID${Date.now()}`;
    localStorage.setItem("browserId", browserId);
    return browserId;
  }
}
