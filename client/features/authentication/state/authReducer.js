import actionTypes from './actionTypes';
export const initState = {
  email: '',
  password: '',
  success: false,
  error: null,
  username: '',
  loading: false,
  confirm: '',
  current: '',
  emailorusername: '',
  token: null,
  isLoggedIn: false,
  isPasswordChanged: false,
  authFeedback: null,
  user:null
};

export function authReducer(state, action) {
  switch (action.type) {
    case actionTypes.VALUE_CHANGED:
      const nextState = {
        ...state,
        [action.payload.propName]: action.payload.value,
      };
  
      return nextState;
    case actionTypes.LOGIN_STARTED:
      return { ...state, loading: true };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        user:action.user,
        isLoggedIn: true,
        password: '',
        successMessage: 'Welcome, ',
      };
    case actionTypes.LOGIN_FAILED:
      return { ...state, loading: false, error: action.payload.error };
    case actionTypes.SIGNUP_STARTED:
      return { ...state, loading: true };
    case actionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        isLoggedIn: true,
       user:action.user,
        password: '',
        successMessage: 'Welcome',
      };
    case actionTypes.SIGNUP_FAILED:
      return { ...state, loading: false, error: action.payload.error };
    case actionTypes.CHANGE_PASSWORD_STARTED:
      return { ...state, loading: true };
    case actionTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        user:action.user,
        isPasswordChanged: true,
        authFeedback: action.message,
      };
    case actionTypes.CHANGE_PASSWORD_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.REQUEST_PASS_CHANGE_STARTED:
      return { ...state, loading: true };
    case actionTypes.REQUEST_PASS_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        authFeedback: action.message,
      };
    case actionTypes.REQUEST_PASS_CHANGE_FAILED:
      return { ...state, loading: false, error: action.payload.error };
    case actionTypes.GOT_TOKEN_FROM_URL:
      return { ...state, token: action.token };
    case actionTypes.LOGOUT_SUCCESS:
      return { ...initState };
    case actionTypes.RECOVER_LOCAL_AUTH_STATE:
      return {
        ...state,
    user:action.user
      };
    default:
      return state;
  }
}
