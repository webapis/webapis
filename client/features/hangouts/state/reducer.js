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
  searchResult: [],
  searchHangouts: false,
  search: "",
  searchResult: [],
  guestEmail: "", //InviteGuest
  invitationSuccess: false, //InviteGuest
  userNotFound: false, //InviteGuest
  searching: false, //SeachComponent
  invitingGuest: false, // Invite Guest
  inviteGuest: false, // Invite Guest
  messageForGuest: "Let's chat", // InviteGuest
  searchComplete: false, //SearchComponent
  isValidGuestEmail: undefined,
  //filter
  filter: "",
  filterResult: [],

  //fetch
  fetchHangouts: false,

  pendingHangout: null,
  message: null,
  browserId: null,
  socketConnected: false,
  on_user_client_command: null,
  on_socket_message: false,
  on_socket_command_send: false,
  unreadsCount: 0,
  scrollToBottom: false,
};
export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SCROLL_TO_BOTTOM:
      return { ...state, scrollToBottom: action.scrollToBottom };
    case actionTypes.VALIDATED_GUEST_EMAIL_FORMAT:
      return { ...state, isValidGuestEmail: action.isValidGuestEmail };
    case actionTypes.INVITE_AS_GUEST_STARTED:
      return { ...state, invitingGuest: true };
    case actionTypes.INVITE_AS_GUEST_SUCCESS:
      return {
        ...state,
        invitingGuest: false,
        invitationSuccess: true,
        inviteGuest: false,
      };
    case actionTypes.INVITE_AS_GUEST_FAILED:
      return { ...state, invitingGuest: false, error: action.error };
    case actionTypes.GUEST_EMAIL_CHANGED:
      return { ...state, guestEmail: action.guestEmail };
    case actionTypes.MESSAGE_FOR_GUEST_CHANGED:
      return { ...state, messageForGuest: action.messageForGuest };
    case actionTypes.INVITE_GUEST:
      return { ...state, inviteGuest: action.inviteGuest };
    case actionTypes.ON_SOCKET_MESSAGE:
      return { ...state, on_socket_message: action.on_socket_message };
    case actionTypes.ON_USER_CLIENT_COMMAND:
      const nextState = {
        ...state,
        on_user_client_command: action.on_user_client_command,
      };

      return nextState;
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
      return {
        ...state,
        unreadhangouts: action.unreadhangouts,
        unreadsCount: action.unreadhangouts.length,
      };
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
      return { ...state, loading: true, searchHangouts: true, searching: true };
    case actionTypes.SEARCH_HANGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        hangouts: action.hangouts,
        searchHangouts: false,
        searching: false,
        userNotFound: action.userNotFound,
      };
    case actionTypes.SEARCH_HANGOUT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
        searchHangouts: false,
        searching: false,
      };

    case actionTypes.SEARCH_INPUT_CHANGE:
      return { ...state, search: action.search };
    //filter
    case actionTypes.FILTER_INPUT_CHANGED:
      return { ...state, filter: action.filter };
    case actionTypes.LOADED_HANGOUTS:
      return { ...state, hangouts: action.hangouts };
    case actionTypes.SELECTED_HANGOUT:
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
