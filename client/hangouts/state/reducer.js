import { actionTypes } from './actionTypes';
export const initState = {
  hangouts: [],
  hangout: null,
  socket: null,
  messages: [],
  search: '',
  user: [],
  loading: false,
  error: null,
};
export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_USER_FAILED:
    case actionTypes.FETCH_HANGOUT_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FETCH_USER_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_USER_SUCCESS:
      debugger;
      return {
        ...state,
        loading: false,
        users: action.users.map(u=> ({...u,state:'INVITE'}))
      };
    case actionTypes.FETCH_HANGOUT_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_HANGOUT_SUCCESS:
      return { ...state, loading: false, hangouts: action.hangouts };

    case actionTypes.HANGOUT_NOT_FOUND:
      return { ...state, loading: false };
    case actionTypes.FILTER_HANGOUTS:
      return {
        ...state,
        hangouts: state.hangouts.filter((g) => g.username.includes(state.search)),
      };
    case actionTypes.SEARCHED_HANGOUT:
      return { ...state, search: action.search };
    case actionTypes.LOAD_HANGOUTS:
      return { ...state, hangouts: action.hangouts };
    case actionTypes.SET_SOCKET:
      return { ...state, socket: action.socket };
    case actionTypes.SELECTED_HANGOUT:
      return {
        ...state,
        hangout: state.hangouts.find((g) => g.username === action.username),
      };
    case actionTypes.HANGOUT_CHANGED_ITS_STATE:
    case actionTypes.ACKNOWLEDGEMENT_RECIEVED:
      return {
        ...state,
        hangouts: state.hangouts.map((g) => {
          if (g.username === action.hangout.username) {
            return action.hangout;
          } else return g;
        }),
      };
    case actionTypes.OFFERER_RECIEVED:
      return { ...state, hangouts: [...state.hangouts, action.hangout] };
    default:
      return state;
  }
}
