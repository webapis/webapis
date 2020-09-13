import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { useAuthContext } from "./AuthProvider";
import actionTypes from "./actionTypes";
import * as cv from "../validation/constraintValidators";
import { useAppRoute } from "components/app-route/index";
import {
  generateBrowserId,
  saveBrowserIdToLocalStorage,
  browserIdExists,
  loadBrowserId,
} from "../state/onBrowserId";
export function useAuth() {
  const {
    state,
    login,
    signup,
    changepassword,
    requestpasswordchange,
    dispatch,
  } = useAuthContext();
  const { onAppRoute } = useAppRoute();

  function onChange(e) {
    const { name, value } = e.target;
    dispatch({ type: actionTypes.VALUE_CHANGED, name, value });
  }
  function onLogin() {
    const { emailorusername, password } = state;
    if (window.jsDisabled) {
      dispatch({ type: actionTypes.LOGIN_STARTED });
    } else {
      dispatch({
        type: actionTypes.CONSTRAINT_VALIDATION,
        name: "emailorusername",
        ...cv.validateEmailOrUsername({ value: emailorusername }),
      });

      if (password === "") {
        dispatch({
          type: actionTypes.CONSTRAINT_VALIDATION,
          name: "password",
          isValid: false,
          message: "Required field",
        });
      }
      if (
        cv.validateEmailOrUsername({ value: emailorusername }).isValid &&
        password.length > 0
      ) {
        login({
          emailorusername,
          password,
          started: () => {
            dispatch({ type: actionTypes.LOGIN_STARTED });
          },
          success: ({ reponse, result }) => {
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
    }
  }
  function onSignup() {
    const { username, password, email } = state;
    if (window.jsDisabled) {
      dispatch({ type: actionTypes.SIGNUP_STARTED });
    } else {
      if (
        cv.validateEmailConstraint({ email }).isValid &&
        cv.validateUserNameConstraint({ username }).isValid &&
        cv.validatePasswordConstraint({ password }).isValid
      ) {
        const browserId = loadBrowserId();
        signup({
          username,
          email,
          password,
          browserId,
          started: () => {
            dispatch({ type: actionTypes.SIGNUP_STARTED });
          },
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
            dispatch({ type: actionTypes.SIGNUP_FAILED, error });
          },
        });
      } else {
        dispatch({
          type: actionTypes.CONSTRAINT_VALIDATION,
          name: "password",
          ...cv.validatePasswordConstraint({ password }),
        });
        dispatch({
          type: actionTypes.CONSTRAINT_VALIDATION,
          name: "email",
          ...cv.validateEmailConstraint({ email }),
        });
        dispatch({
          type: actionTypes.CONSTRAINT_VALIDATION,
          name: "username",
          ...cv.validateUserNameConstraint({ username }),
        });
      }
    }
  }
  function onRequestPasswordChange() {
    dispatch({ type: actionTypes.REQUEST_PASS_CHANGE_STARTED });
  }
  function onPasswordChange() {
    dispatch({ type: actionTypes.CHANGE_PASSWORD_STARTED });
  }

  function onSignOut() {
    localStorage.removeItem("webcom");
    dispatch({ type: actionTypes.LOGOUT });
  }
  function onLoginBlur(e) {
    const { emailorusername, password } = state;
    const { name } = e.target;
    if (window.jsDisabled) {
    } else {
      switch (name) {
        case "emailorusername":
          dispatch({
            type: actionTypes.CONSTRAINT_VALIDATION,
            name: "emailorusername",
            ...cv.validateEmailOrUsername({ value: emailorusername }),
          });
          break;
        case "password":
          if (password === "") {
            dispatch({
              type: actionTypes.CONSTRAINT_VALIDATION,
              name: "password",
              isValid: false,
              message: "Required field",
            });
          } else {
            dispatch({
              type: actionTypes.CONSTRAINT_VALIDATION,
              name: "password",
              isValid: true,
              message: "",
            });
          }
          break;

        default:
          throw new Error("onLoginBlur error");
      }
    }
  }

  function onSignupBlur(e) {
    const { email, username, password } = state;
    const { name } = e.target;
    if (window.jsDisabled) {
    } else {
      switch (name) {
        case "password":
          dispatch({
            type: actionTypes.CONSTRAINT_VALIDATION,
            name: "password",
            ...cv.validatePasswordConstraint({ password }),
          });
          break;
        case "email":
          dispatch({
            type: actionTypes.CONSTRAINT_VALIDATION,
            name: "email",
            ...cv.validateEmailConstraint({ email }),
          });
          break;
        case "username":
          dispatch({
            type: actionTypes.CONSTRAINT_VALIDATION,
            name: "username",
            ...cv.validateUserNameConstraint({ username }),
          });
          break;
        default:
          throw new Error("onSignUpBlur error");
      }
    }
  }

  function onChangePassBlur() {}

  function onRequestPassChangeBlur() {}

  function onFocus(e) {
    const { name } = e.target;
    dispatch({
      type: actionTypes.CONSTRAINT_VALIDATION,
      name,
      isValid: undefined,
      message: "",
    });
    dispatch({ type: actionTypes.SET_ERROR_TO_NULL });
  }
  function onAuthNavigation(e) {
    e.preventDefault();

    const id = e.currentTarget.id;
    if (id === "signout") {
      onSignOut();
    } else {
      onAppRoute({ featureRoute: `/${id}`, route: "/auth" });
      dispatch({ type: actionTypes.RESET_AUTH_STATE });
    }
  }
  return {
    state,
    onFocus,
    onLoginBlur,
    onSignupBlur,
    onChangePassBlur,
    onRequestPassChangeBlur,
    dispatch,
    onLogin,
    onSignup,
    onRequestPasswordChange,
    onPasswordChange,
    onChange,
    onSignOut,
    onAuthNavigation,
  };
}
