import actionTypes from "./actionTypes";
export const initState = {
  validation: {
    username: { isValid: undefined, message: "" },
    email: { isValid: undefined, message: "" },
    password: { isValid: undefined, message: "" },
    confirm: {
      isValid: undefined,
      message: "",
    },
    emailorusername: { isValid: undefined, message: "" },
  },
  email: "",
  password: "",
  error: null,
  username: "",
  loading: false,
  confirm: "",
  current: "",
  emailorusername: "",
  token: null,
  authFeedback: null,
  user: null,
  browserId: null,
  authStarted: false,
  signupStarted: false, //used by service
  loginStarted: false, //used by service
  changePasswordStared: false, //used by service
  requestPassChangeStarted: false, //used by service
};

export function authReducer(state, action) {
  switch (action.type) {
    case actionTypes.BROWSER_ID_LOADED:
      return { ...state, browserId: action.browserId };
    case actionTypes.RESET_AUTH_STATE:
      return initState;
    case actionTypes.SET_ERROR_TO_NULL:
      return { ...state, error: null };
    case actionTypes.SERVER_ERROR_RECIEVED:
      return { ...state, error: action.error };
    case actionTypes.CONSTRAINT_VALIDATION:
      return {
        ...state,
        validation: {
          ...state.validation,
          [action.name]: { isValid: action.isValid, message: action.message },
        },
      };
    case actionTypes.VALUE_CHANGED:
      const nextState = {
        ...state,
        [action.name]: action.value,
      };
      return nextState;
    case actionTypes.LOGIN_STARTED:
      return {
        ...state,
        loading: true,
        loginStarted: true,
        authStarted: true,
      };
    case actionTypes.LOGIN_SUCCESS:
      debugger;
      return {
        ...state,
        loading: false,

        user: action.user,
        authStarted: false,
        loginStarted: false,
        password: "",
      };
    case actionTypes.LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        loginStarted: false,
        authStarted: false,
      };
    case actionTypes.SIGNUP_STARTED:
      return {
        ...state,
        loading: true,
        signupStarted: true,
        authStarted: true,
      };
    case actionTypes.SIGNUP_SUCCESS:
      debugger;
      return {
        ...state,
        loading: false,

        user: action.user,
        signupStarted: false,
        authStarted: false,
      };
    case actionTypes.SIGNUP_FAILED:
      return {
        ...state,
        loading: false,
        signupStarted: false,
        authStarted: false,
      };
    case actionTypes.CHANGE_PASSWORD_STARTED:
      return { ...state, loading: true, changePasswordStared: true };
    case actionTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.user,
        changePasswordStared: false,
        authStarted: false,
      };
    case actionTypes.CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        loading: false,
        changePasswordStared: false,
        authStarted: false,
      };
    case actionTypes.REQUEST_PASS_CHANGE_STARTED:
      return { ...state, loading: true, requestPassChangeStarted: true };
    case actionTypes.REQUEST_PASS_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        requestPassChangeStarted: false,
      };
    case actionTypes.REQUEST_PASS_CHANGE_FAILED:
      return { ...state, loading: false, requestPassChangeStarted: false };
    case actionTypes.GOT_TOKEN_FROM_URL:
      return { ...state, token: action.token };
    case actionTypes.LOGOUT:
      return { ...initState };
    case actionTypes.RECOVER_LOCAL_AUTH_STATE:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}
