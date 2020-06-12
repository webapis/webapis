import { actionTypes } from './actionTypes';
export const initState = {
  hangouts: null,
  hangout: null,
  messages: null,
  search: '',
  user: [],
  loading: false,
  error: null,
  messageText: '',
  online: false,
  socket: null,
  readyState: 0,
  socketMessage: null,
};
export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.HANGOUTS_UPDATED:
      return { ...state, hangouts: action.hangouts };
    case actionTypes.MESSAGES_UPDATED:
      return { ...state, messages: action.messages };
    case actionTypes.SOCKET_MESSAGE_RECIEVED:
      return { ...state, socketMessage: action.socketMessage };
    case actionTypes.LOADED_MESSAGES:
      return { ...state, messages: action.messages };
    case actionTypes.MESSAGE_TEXT_CHANGED:
      return { ...state, messageText: action.text };
    case actionTypes.FETCH_USER_FAILED:
    case actionTypes.FETCH_HANGOUT_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FETCH_HANGOUT_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_HANGOUT_SUCCESS:
      return { ...state, loading: false, hangouts: action.hangouts };
    case actionTypes.FILTER_HANGOUTS:
      return {
        ...state,
        hangouts: state.hangouts.filter((g) =>
          g.username.includes(state.search)
        ),
      };
    case actionTypes.SEARCHED_HANGOUT:
      return { ...state, search: action.search };
    case actionTypes.LOAD_HANGOUTS:
      return { ...state, hangouts: action.hangouts };
    case actionTypes.SELECTED_HANGOUT:
      return {
        ...state,
        hangout: state.hangouts.find((g) => g.username === action.username),
      };

    //SOCKET

    case actionTypes.SOCKET_ERROR:
      return { ...state, error: action.error };
    case actionTypes.CONNECTING:
      return { ...state, readyState: 0 };
    case actionTypes.OPEN:
      return { ...state, readyState: 1 };
    case actionTypes.CLOSING:
      return { ...state, readyState: 2 };
    case actionTypes.CLOSED:
      return { ...state, readyState: 3 };
    case actionTypes.SOCKET_READY:
      return { ...state, socket: action.socket };
    default:
      return state;
  }
}
