import actionTypes from "./actionTypes";
export const initState = {
  login: false,
  signup: false,
  signout: false,
  changePassword: false,
  requestPassChange: false,
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
  success: false,
  error: null,
  username: "",
  loading: false,
  confirm: "",
  current: "",
  emailorusername: "",
  token: null,
  authFeedback: null,
  user: null,
  signout: false,
};

export function authReducer(state, action) {
  switch (action.type) {
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
      return { ...state, loading: true, login: true };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        user: action.user,
        password: "",
      };
    case actionTypes.LOGIN_FAILED:
      return { ...state, loading: false, login: false };
    case actionTypes.SIGNUP_STARTED:
      return { ...state, loading: true, signup: true };
    case actionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.user,
      };
    case actionTypes.SIGNUP_FAILED:
      return { ...state, loading: false, signup: false };
    case actionTypes.CHANGE_PASSWORD_STARTED:
      return { ...state, loading: true, changePassword: true };
    case actionTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.user,
        changePassword: false,
      };
    case actionTypes.CHANGE_PASSWORD_FAILED:
      return { ...state, loading: false, changePassword: false };
    case actionTypes.REQUEST_PASS_CHANGE_STARTED:
      return { ...state, loading: true, requestPassChange: true };
    case actionTypes.REQUEST_PASS_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        requestPassChange: false,
      };
    case actionTypes.REQUEST_PASS_CHANGE_FAILED:
      return { ...state, loading: false, requestPassChange: false };
    case actionTypes.GOT_TOKEN_FROM_URL:
      return { ...state, token: action.token };
    case actionTypes.LOGOUT:
      return { ...initState, signout: true };
    case actionTypes.RECOVER_LOCAL_AUTH_STATE:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}
