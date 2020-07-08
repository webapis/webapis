import { actionTypes } from "./actionTypes";
export const initState = {
  hangouts: null,
  hangout: null,
  unreadhangouts: null,
  messages: null,
  search: "",
  user: [],
  loading: false,
  error: null,
  messageText: "",
  online: false,
  socket: null,
  readyState: 0,
  socketMessage: null,
  fetchHangouts: false,
  pendingHangout: null,
  message: null,
};
export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ERROR_RECIEVED:
      return { ...state, error: action.error };
    case actionTypes.SENDING_HANGOUT_FULLFILLED:
      return { ...state, pendingHangout: null };
    case actionTypes.SENDING_HANGOUT_STARTED:
      return { ...state, pendingHangout: action.pendingHangout };
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
    case actionTypes.FETCH_USER_FAILED:
    case actionTypes.FETCH_HANGOUT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
        fetchHangouts: false,
      };
    case actionTypes.FETCH_HANGOUT_STARTED:
      return { ...state, loading: true, fetchHangouts: true };
    case actionTypes.FETCH_HANGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        hangouts: action.hangouts,
        fetchHangouts: false,
      };
    case actionTypes.FILTER_HANGOUTS:
      return {
        ...state,
        hangouts: state.hangouts.filter((g) =>
          g.username.includes(state.search)
        ),
      };
    case actionTypes.SEARCH_INPUT_CHANGE:
      
      return { ...state, search: action.search };
    case actionTypes.LOAD_HANGOUTS:
      return { ...state, hangouts: action.hangouts };
    case actionTypes.SELECTED_HANGOUT:
      if(action.hangout===undefined){
        debugger;
      }
    
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
