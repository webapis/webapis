import { actionTypes } from './actionTypes';
export const initState = {
  loading: false,
  error: null,
  hangouts: [],
  hangout:null
};
export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_HANGOUTS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_HANGOUTS_SUCCESS:
      return { ...state, loading: false, hangouts: action.hangouts };
    case actionTypes.FETCH_HANGOUTS_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FIND_HANGOUTS:
      return {
        ...state,
        hangouts: state.hangouts.filter((h) => h.username === action.filter),
      };
    case actionTypes.GET_LOCAL_HANGOUTS:
      const nextState = { ...state, hangouts: action.hangouts };

      return nextState;
    case actionTypes.HANGOUTS_IS_ONLINE:
      return {
        ...state,
        hangouts: state.hangouts.map((h) => {
          if (h.username === action.username) {
            return { ...h, online: true };
          }
        }),
      };
    case actionTypes.HANGOUTS_IS_OFFLINE:
      return {
        ...state,
        hangouts: state.hangouts.map((h) => {
          if (h.username === action.username) {
            return { ...h, online: false };
          }
        }),
      };
    case actionTypes.HANGOUTS_STATE_CHANGED:
      debugger;
      return {
        ...state,
        hangouts: state.hangouts.map((h) => {
          if (h.username === action.username) {
            return { ...h, state: action.state };
          }
        }),
      };
    case actionTypes.FETCH_USERS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.users.map((user) => {
          return { ...user, state: 'invite' };
        })
      };
    case actionTypes.FETCH_USERS_FAILED:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
