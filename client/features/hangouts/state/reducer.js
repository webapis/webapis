import { actionTypes } from "./actionTypes";
export const initState = {
  hangouts: null,
  hangout: null,
  unreadhangouts: [],
  messages: null,

  loading: false,
  error: null,
  messageText: "",
  online: false,
  socket: null,
  readyState: 0,
  socketMessage: null,
  //search
  search: "",
  searchResult: [],
  searchHangouts: false,

  //filter
  filter: "",
  filterResult: [],

  //fetch
  fetchHangouts: false,

  pendingHangout: null,
  message: null,
};
export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_HANGOUT_TO_INIT_STATE:
      return { ...initState };
    case actionTypes.FETCH_HANGOUTS_STARTED:
      return { ...state, fetchHangouts: true };
    case actionTypes.FETCH_HANGOUTS_SUCCESS:
      return { ...state, fetchHangouts: false };
    case actionTypes.FETCH_HANGOUTS_FAILED:
      return { ...state, fetchHangouts: false, error: action.error };
    case actionTypes.ERROR_RECIEVED:
      return { ...state, error: action.error };
    //pending hangout
    case actionTypes.SENDING_HANGOUT_FULLFILLED:
      return {
        ...state,
        pendingHangout: null,
        loading: false,
        messageText: "",
      };
    case actionTypes.SENDING_HANGOUT_STARTED:
      return { ...state, loading: true, pendingHangout: action.pendingHangout };
    //----
    case actionTypes.CLEARED_HANGOUT:
      return { ...state, hangout: null };
    case actionTypes.UNREAD_HANGOUTS_UPDATED:
      return { ...state, unreadhangouts: action.unreadhangouts };
    case actionTypes.HANGOUT_UPDATED:
      return { ...state, hangout: action.hangout };
    case actionTypes.HANGOUTS_UPDATED:
      return { ...state, hangouts: action.hangouts };
    case actionTypes.MESSAGES_UPDATED:
      return { ...state, messages: action.messages };
    case actionTypes.SERVER_MESSAGE_RECIEVED:
      return { ...state, message: action.message };
    case actionTypes.LOADED_MESSAGES:
      return { ...state, messages: action.messages };
    case actionTypes.MESSAGE_TEXT_CHANGED:
      return { ...state, messageText: action.text };
    //search
    case actionTypes.SEARCH_HANGOUT_STARTED:
      return { ...state, loading: true, searchHangouts: true };
    case actionTypes.SEARCH_HANGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResult: action.hangouts,
        searchHangouts: false,
      };
    case actionTypes.SEARCH_HANGOUT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
        searchHangouts: false,
      };

    case actionTypes.SEARCH_INPUT_CHANGE:
      return { ...state, search: action.search };
    //filter
    case actionTypes.FILTER_INPUT_CHANGED:
      return { ...state, filter: action.filter };
    case actionTypes.LOADED_HANGOUTS:
      return { ...state, filterResult: action.hangouts };
    case actionTypes.SELECTED_HANGOUT:
      return {
        ...state,
        hangout: action.hangout,
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
