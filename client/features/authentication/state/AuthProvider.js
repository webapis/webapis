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
import {
  generateBrowserId,
  saveBrowserIdToLocalStorage,
  browserIdExists,
  loadBrowserId,
} from "../state/onBrowserId";
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
    authedRoute,
    login,
    signup,
    changepassword,
    requestpasswordchange,
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
    if (signupStarted) {
      const browserId = loadBrowserId();
      handleSignUp({ username, email, password, browserId });
    }
  }, [signupStarted]);

  useEffect(() => {
    if (loginStarted) {
      handleLogin({ emailorusername, password });
    }
  }, [loginStarted]);

  useEffect(() => {
    if (user) {
      onAppRoute({
        route: authedRoute.route,
        featureRoute: authedRoute.featureRoute,
      });
    } else {
      onAppRoute({ appRoute: "/auth", featureRoute: "/login" });
    }
  }, [user]);
  function handleLogin({ emailorusername, password }) {
    login({
      emailorusername,
      password,

      success: ({ response, result }) => {
        if (response.status === 200) {
          const { token, username, email } = result;
          if (browserIdExists()) {
            dispatch({
              type: actionTypes.BROWSER_ID_LOADED,
              browserId: loadBrowserId(),
            });
          } else {
            const { browserId } = result;

            saveBrowserIdToLocalStorage({ browserId });
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

          errors.forEach((error) => {
            serverValidation({ status: error, dispatch });
          });
          dispatch({ type: actionTypes.LOGIN_FAILED });
        } else if (response.status === 500) {
          const { error } = result;

          dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
          dispatch({ type: actionTypes.LOGIN_FAILED });
        }
      },
      failed: (error) => {
        dispatch({ type: actionTypes.SERVER_ERROR_RECIEVED, error });
        dispatch({ type: actionTypes.LOGIN_FAILED });
      },
      hasBrowserId: browserIdExists(),
    });
  }
  function handleSignUp({ username, email, password, browserId }) {
    signup({
      username,
      email,
      password,
      browserId,

      success: ({ result, response }) => {
        if (response.status === 200) {
          const { token, username, email } = result;
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
          if (browserIdExists()) {
            dispatch({
              type: actionTypes.BROWSER_ID_LOADED,
              browserId,
            });
          } else {
            const { browserId } = result;
            saveBrowserIdToLocalStorage({ browserId });
            dispatch({
              type: actionTypes.BROWSER_ID_LOADED,
              browserId,
            });
          }
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
      },
      failed: (error) => {
        const err = error;

        dispatch({ type: actionTypes.SIGNUP_FAILED, error });
      },
    });
  }
  return html`
    <${AuthContext.Provider} value=${value} ...${props}>
      ${children({ user, signedout })}
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
