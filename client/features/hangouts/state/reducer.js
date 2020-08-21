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
  browserId: null,
  socketConnected: false,
};
export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SOCKET_CONNECTION_STATE_CHANGED:
      return { ...state, socketConnected: action.connected };
    case actionTypes.SET_BROWSER_ID:
      return { ...state, browserId: action.browserId };
    case actionTypes.MESSAGE_TEXT_CHANGED:
      return { ...state, messageText: action.text };
    case actionTypes.SET_HANGOUT_TO_INIT_STATE:
      return { ...initState, connected: state.connected };
    case actionTypes.FETCH_HANGOUTS_STARTED:
      return { ...state, fetchHangouts: true };
    case actionTypes.FETCH_HANGOUTS_SUCCESS:
      return { ...state, fetchHangouts: false, hangouts: action.hangouts };
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
      return {
        ...state,
        loading: true,
        pendingHangout: action.pendingHangout,
      };
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
        hangouts: action.hangouts,
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
      return { ...state, hangouts: action.hangouts };
    case actionTypes.SELECTED_HANGOUT:
      debugger;
      return {
        ...state,
        hangout: action.hangout,
      };
    //SOCKET
    case actionTypes.SOCKET_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
}
